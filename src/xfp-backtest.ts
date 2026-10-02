/**
 * xfp v1-v4 backtest on one season. Every definition, constant and output is fixed by
 * docs/research/xfp-backtest-plan.md; nothing here is tuned. The projections are the ones
 * `buildXfp` and `buildQb` give the `xfp` command; this file only adds eligibility, outcomes and scoring.
 */
import { SEEN_ID_COLUMNS, type ParsedRows, type PlayByPlayRow } from "./nflverse.js";
import {
  BLOCK_STARTS,
  BOOTSTRAP_RESAMPLES,
  BOOTSTRAP_SEED,
  MIN_SCORED,
  TREND_ALPHA,
  TREND_MIN_WEEKS,
  TREND_PERMUTATIONS,
  accuracyVerdict,
  bias,
  blockOf,
  combine,
  combineTrend,
  mae,
  pairedBootstrap,
  rmse,
  settlingWeek,
  spearman,
  topNHits,
  trendTest,
  verdict,
  wilson,
  type Interval,
  type MethodScores,
  type PairedBootstrap,
  type ScoredItem,
  type Verdict,
} from "./backtest-stats.js";
import {
  QB_MIN_STARTS,
  XFP_MIN_GAMES,
  buildQb,
  buildXfp,
  extractLooks,
  extractQbLooks,
  qbIdsOf,
} from "./nflverse-xfp.js";

export const BT_POSITIONS = ["QB", "RB", "WR", "TE"] as const;
export type BtPosition = (typeof BT_POSITIONS)[number];
export const BT_METHODS = ["v1", "v2", "v3", "v4", "baseline"] as const;
export type BtMethod = (typeof BT_METHODS)[number];
export const READINGS = ["main", "sensitivity"] as const;
export type Reading = (typeof READINGS)[number];
export const FAMILIES = ["ranking", "accuracy"] as const;
export type Family = (typeof FAMILIES)[number];
export const SCOPES = ["block-1", "block-2", "block-3", "block-4", "pooled"] as const;
export type Scope = (typeof SCOPES)[number];
export const REASONS = ["bye", "not_seen", "not_starter", "min_games", "no_history"] as const;
export type Reason = (typeof REASONS)[number];

/** Top-N per position: the starter counts of a 12-team league (plan section 4). */
export const TOP_N: Record<BtPosition, number> = { QB: 12, RB: 24, WR: 24, TE: 12 };
export const FIRST_FOLD = 2;
export const LAST_FOLD = 17;
/** A starting QB with fewer dropbacks than this is counted, not treated differently (plan section 3.5). */
export const LOW_DROPBACKS = 15;

/** The eight comparisons of plan section 6, grouped by the model so one bootstrap serves each model. */
export const COMPARISONS: { model: BtMethod; baseline: BtMethod }[] = [
  { model: "v1", baseline: "baseline" },
  { model: "v2", baseline: "baseline" },
  { model: "v3", baseline: "baseline" },
  { model: "v4", baseline: "baseline" },
  { model: "v2", baseline: "v1" },
  { model: "v3", baseline: "v1" },
  { model: "v4", baseline: "v3" },
  { model: "v4", baseline: "v2" },
];
export const VERDICTS_TOTAL = 360;
export const OUTPUT_DIR = (season: number): string => `data/nflverse/${season}/xfp-backtest`;

const pad = (week: number): string => String(week).padStart(2, "0");
const round = (n: number, dp = 4): number => Math.round(n * 10 ** dp) / 10 ** dp;
const r4 = (n: number | null): number | null => (n === null ? null : round(n));
const byId = (a: { player_id: string }, b: { player_id: string }): number => a.player_id.localeCompare(b.player_id);

// ---------------------------------------------------------------- projections (weeks < W only)

/** One player's five numbers for week W, before any outcome is read. */
export interface Projected {
  player_id: string;
  position: BtPosition;
  team: string;
  /** The week-W opponent from the schedule; null on a bye. */
  opponent: string | null;
  /** Games before W (QB: starts before W). */
  prior_games: number;
  /** QB only: whether he started his team's latest game. */
  latest_starter: boolean | null;
  v1: number;
  v2: number | null;
  v3: number | null;
  v4: number | null;
  baseline: number;
}

/** The week-W projection for every WR/TE/RB with a game and every QB with a pass play before W, from `buildXfp` and `buildQb`. */
export function projectFold(rows: ParsedRows, prior: ParsedRows, season: number, week: number): Projected[] {
  const out: Projected[] = [];
  for (const p of buildXfp(rows, season, week, prior).players) {
    out.push({
      player_id: p.player_id,
      position: p.position,
      team: p.team,
      opponent: p.opponent?.team ?? null,
      prior_games: p.games,
      latest_starter: null,
      v1: p.xfp_per_game,
      v2: p.v2.next,
      v3: p.v3,
      v4: p.v4?.next ?? null,
      baseline: p.actual_per_game,
    });
  }
  for (const q of buildQb(rows, season, week, prior).players) {
    out.push({
      player_id: q.player_id,
      position: "QB",
      team: q.team,
      opponent: q.opponent?.team ?? null,
      prior_games: q.starts,
      latest_starter: q.latest_starter,
      v1: q.v1,
      v2: q.v2.next,
      v3: q.v3,
      v4: q.v4?.next ?? null,
      baseline: q.actual_per_start,
    });
  }
  return out;
}

// ---------------------------------------------------------------- one fold

export interface PlayerWeek {
  season: number;
  week: number;
  player_id: string;
  position: BtPosition;
  team: string;
  opponent: string;
  prior_games: number;
  thin: boolean;
  seen: boolean;
  week_starter: boolean | null;
  latest_starter: boolean | null;
  in_main: boolean;
  in_sensitivity: boolean;
  actual: number;
  baseline: number;
  v1: number;
  v2: number;
  v3: number;
  v4: number;
}

export interface Exclusion {
  week: number;
  position: BtPosition;
  reason: Reason;
  count: number;
}

export interface FoldResult {
  week: number;
  rows: PlayerWeek[];
  exclusions: Exclusion[];
  /** In-main QB-weeks whose starter had fewer than 15 dropbacks (a count only). */
  low_dropback_starters: number;
}

/** Every id that appears in a receiver, rusher or other player column of a week-W play (plan section 3.3). */
function seenIds(plays: PlayByPlayRow[]): Set<string> {
  const out = new Set<string>();
  for (const p of plays) {
    for (const id of [p.receiver_player_id, p.rusher_player_id, ...SEEN_ID_COLUMNS.map((c) => p[c])]) if (id !== null && id !== undefined) out.add(id);
  }
  return out;
}

/** Per team, the week-W passer with the most dropbacks (ties by player_id) and every passer's count. */
function weekStarters(plays: PlayByPlayRow[]): Map<string, { starter: string; dropbacks: Map<string, number> }> {
  const counts = new Map<string, Map<string, number>>();
  for (const p of plays) {
    if (p.qb_dropback !== 1 || p.passer_player_id === null || p.posteam === null) continue;
    const m = counts.get(p.posteam) ?? new Map<string, number>();
    m.set(p.passer_player_id, (m.get(p.passer_player_id) ?? 0) + 1);
    counts.set(p.posteam, m);
  }
  return new Map(
    [...counts].map(([team, m]) => {
      const top = [...m].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]![0];
      return [team, { starter: top, dropbacks: m }] as const;
    }),
  );
}

const need = (x: number | null, what: string): number => {
  if (x === null) throw new Error(`xfp backtest: ${what} is missing for a scored player`);
  return x;
};

/** Projects week W from weeks < W, then reads week W for eligibility and outcome. */
export function scoreFold(rows: ParsedRows, prior: ParsedRows, season: number, week: number): FoldResult {
  const weekPlays = rows.play_by_play.filter((p) => p.season === season && p.season_type === "REG" && p.week === week);
  if (weekPlays.length === 0) throw new Error(`no play-by-play for season ${season} week ${week}; fetch it first`);
  const projected = projectFold(rows, prior, season, week);
  const seen = seenIds(weekPlays);
  const starters = weekStarters(weekPlays);
  const skillActual = new Map<string, number>();
  for (const l of extractLooks(rows.play_by_play, season, week + 1, week)) skillActual.set(l.player_id, (skillActual.get(l.player_id) ?? 0) + l.points);
  const qbActual = new Map<string, number>();
  for (const l of extractQbLooks(rows.play_by_play, qbIdsOf(rows.stats_player, season, week), season, week + 1, week)) {
    qbActual.set(l.player_id, (qbActual.get(l.player_id) ?? 0) + l.points);
  }
  const excl = new Map<string, Exclusion>();
  const exclude = (position: BtPosition, reason: Reason): void => {
    const key = `${position}|${reason}`;
    const e = excl.get(key) ?? { week, position, reason, count: 0 };
    e.count += 1;
    excl.set(key, e);
  };
  const out: PlayerWeek[] = [];
  let lowDropbacks = 0;
  const push = (p: Projected, extra: Pick<PlayerWeek, "seen" | "week_starter" | "in_main" | "in_sensitivity" | "actual">): void => {
    out.push({
      season,
      week,
      player_id: p.player_id,
      position: p.position,
      team: p.team,
      opponent: p.opponent!,
      prior_games: p.prior_games,
      thin: p.prior_games < (p.position === "QB" ? QB_MIN_STARTS : XFP_MIN_GAMES),
      latest_starter: p.latest_starter,
      baseline: p.baseline,
      v1: p.v1,
      v2: need(p.v2, "v2"),
      v3: need(p.v3, "v3"),
      v4: need(p.v4, "v4"),
      ...extra,
    });
  };
  for (const p of projected) {
    if (p.position === "QB") {
      if (p.opponent === null) exclude("QB", "bye");
      else if (p.prior_games < 1) exclude("QB", "min_games");
      else {
        const isStarter = starters.get(p.team)?.starter === p.player_id;
        if (!isStarter) exclude("QB", "not_starter");
        if (isStarter || p.latest_starter) {
          if (isStarter && (starters.get(p.team)!.dropbacks.get(p.player_id) ?? 0) < LOW_DROPBACKS) lowDropbacks++;
          push(p, {
            seen: seen.has(p.player_id),
            week_starter: isStarter,
            in_main: isStarter,
            in_sensitivity: p.latest_starter === true,
            actual: qbActual.get(p.player_id) ?? 0,
          });
        }
      }
    } else if (p.opponent === null) exclude(p.position, "bye");
    else {
      const wasSeen = seen.has(p.player_id);
      if (!wasSeen) exclude(p.position, "not_seen");
      push(p, { seen: wasSeen, week_starter: null, in_main: wasSeen, in_sensitivity: true, actual: skillActual.get(p.player_id) ?? 0 });
    }
  }
  // A week-W starter with no pass play before W is outside the QB pool altogether.
  const poolIds = new Set(projected.filter((p) => p.position === "QB").map((p) => p.player_id));
  for (const [, s] of starters) if (!poolIds.has(s.starter)) exclude("QB", "no_history");
  const order = (p: BtPosition): number => BT_POSITIONS.indexOf(p);
  out.sort((a, b) => order(a.position) - order(b.position) || byId(a, b));
  const exclusions = [...excl.values()].sort((a, b) => order(a.position) - order(b.position) || REASONS.indexOf(a.reason) - REASONS.indexOf(b.reason));
  return { week, rows: out, exclusions, low_dropback_starters: lowDropbacks };
}

// ---------------------------------------------------------------- metrics

export interface Stats {
  n: number;
  mae: number | null;
  rmse: number | null;
  bias: number | null;
  spearman: number | null;
  top_n: number;
  hits: number;
  slots: number;
}

const inReading = (r: PlayerWeek, reading: Reading): boolean => (reading === "main" ? r.in_main : r.in_sensitivity);
const itemsOf = (rows: PlayerWeek[], method: BtMethod): ScoredItem[] =>
  rows.map((r) => ({ id: r.player_id, fold: r.week, team: r.team, actual: r.actual, proj: r[method] }));

/** Statistics of one method over player-weeks of one position; top-N is computed per week and summed. */
export function statsFor(rows: PlayerWeek[], position: BtPosition, method: BtMethod): Stats {
  const items = itemsOf(rows, method);
  const proj = items.map((i) => i.proj);
  const actual = items.map((i) => i.actual);
  let hits = 0;
  let slots = 0;
  for (const w of new Set(rows.map((r) => r.week))) {
    const h = topNHits(items.filter((i) => i.fold === w), TOP_N[position]);
    hits += h.hits;
    slots += h.slots;
  }
  return { n: rows.length, mae: mae(proj, actual), rmse: rmse(proj, actual), bias: bias(proj, actual), spearman: spearman(proj, actual), top_n: TOP_N[position], hits, slots };
}

const roundStats = (s: Stats): Stats => ({ ...s, mae: r4(s.mae), rmse: r4(s.rmse), bias: r4(s.bias), spearman: r4(s.spearman) });

const weeksOf = (scope: Scope, folds: number[]): number[] => (scope === "pooled" ? folds : folds.filter((w) => blockOf(w) === Number(scope.slice(-1))));

function scoresOf(rows: PlayerWeek[]): MethodScores {
  return {
    actual: rows.map((r) => r.actual),
    groups: rows.map((r) => `${r.week}|${r.team}`),
    proj: Object.fromEntries(BT_METHODS.map((m) => [m, rows.map((r) => r[m])])),
  };
}

/** The interval columns of `verdicts.json`, in the plan's order. */
const diffCols = (main: PairedBootstrap, sens: PairedBootstrap): Record<string, number | null> => ({
  spearman_diff_lo_main: r4(main.spearman_diff?.lo ?? null),
  spearman_diff_hi_main: r4(main.spearman_diff?.hi ?? null),
  spearman_diff_lo_sens: r4(sens.spearman_diff?.lo ?? null),
  spearman_diff_hi_sens: r4(sens.spearman_diff?.hi ?? null),
  mae_diff_lo_main: r4(main.mae_diff?.lo ?? null),
  mae_diff_hi_main: r4(main.mae_diff?.hi ?? null),
  mae_diff_lo_sens: r4(sens.mae_diff?.lo ?? null),
  mae_diff_hi_sens: r4(sens.mae_diff?.hi ?? null),
});

// ---------------------------------------------------------------- the whole run

export interface BacktestFiles {
  /** File name under the output directory -> JSON value. */
  files: Record<string, unknown>;
  verdicts_total: number;
  wins: number;
}

type Cell = { family: Family; model: BtMethod; baseline: BtMethod; position: BtPosition; scope: Scope };

/** Runs folds W = 2..through and builds every file of plan section 9, except the provenance in `summary.json`. */
export function runXfpBacktest(rows: ParsedRows, prior: ParsedRows, season: number, through: number = LAST_FOLD): BacktestFiles {
  if (!Number.isInteger(through) || through < FIRST_FOLD || through > LAST_FOLD) {
    throw new Error(`--through must be a week from ${FIRST_FOLD} to ${LAST_FOLD}; got ${through}`);
  }
  const folds: number[] = [];
  for (let w = FIRST_FOLD; w <= through; w++) folds.push(w);
  const results = folds.map((w) => scoreFold(rows, prior, season, w));
  const all = results.flatMap((r) => r.rows);
  const files: Record<string, unknown> = {};
  for (const r of results) {
    files[`fold-${pad(r.week)}-player-weeks.json`] = r.rows.map((p) => ({
      season: p.season,
      week: p.week,
      player_id: p.player_id,
      position: p.position,
      team: p.team,
      opponent: p.opponent,
      prior_games: p.prior_games,
      thin: p.thin,
      seen: p.seen,
      week_starter: p.week_starter,
      latest_starter: p.latest_starter,
      in_main: p.in_main,
      in_sensitivity: p.in_sensitivity,
      actual: round(p.actual),
      baseline: round(p.baseline),
      v1: round(p.v1),
      v2: round(p.v2),
      v3: round(p.v3),
      v4: round(p.v4),
    }));
  }
  const exclusions = results.flatMap((r) => r.exclusions);
  files["exclusions.json"] = exclusions;

  const sel = (reading: Reading, position: BtPosition, weeks: number[]): PlayerWeek[] =>
    all.filter((r) => r.position === position && inReading(r, reading) && weeks.includes(r.week));

  const weekly: Record<string, unknown>[] = [];
  const weeklyRaw = new Map<string, Stats>();
  for (const reading of READINGS)
    for (const week of folds)
      for (const position of BT_POSITIONS)
        for (const method of BT_METHODS) {
          const s = statsFor(sel(reading, position, [week]), position, method);
          weeklyRaw.set(`${reading}|${week}|${position}|${method}`, s);
          weekly.push({ reading, week, position, method, ...roundStats(s) });
        }
  files["weekly-metrics.json"] = weekly;

  const blockRows: Record<string, unknown>[] = [];
  const hitInterval = new Map<string, Interval | null>();
  for (const reading of READINGS)
    for (const scope of SCOPES)
      for (const position of BT_POSITIONS)
        for (const method of BT_METHODS) {
          const s = statsFor(sel(reading, position, weeksOf(scope, folds)), position, method);
          const w = wilson(s.hits, s.slots);
          hitInterval.set(`${reading}|${scope}|${position}|${method}`, w);
          blockRows.push({ reading, scope, position, method, ...roundStats(s), hit_rate: s.slots > 0 ? round(s.hits / s.slots) : null, wilson_lo: r4(w?.lo ?? null), wilson_hi: r4(w?.hi ?? null) });
        }
  files["block-metrics.json"] = blockRows;

  // One bootstrap per reading, position, scope and model serves both families.
  const modelsWithBaselines = new Map<BtMethod, BtMethod[]>();
  for (const c of COMPARISONS) modelsWithBaselines.set(c.model, [...(modelsWithBaselines.get(c.model) ?? []), c.baseline]);
  const boot = new Map<string, PairedBootstrap>();
  const counts = new Map<string, number>();
  for (const reading of READINGS)
    for (const position of BT_POSITIONS)
      for (const scope of SCOPES) {
        const rs = sel(reading, position, weeksOf(scope, folds));
        counts.set(`${reading}|${position}|${scope}`, rs.length);
        const scores = scoresOf(rs);
        for (const [model, baselines] of modelsWithBaselines) {
          const res = pairedBootstrap(scores, model, baselines, BOOTSTRAP_RESAMPLES, BOOTSTRAP_SEED);
          for (const b of baselines) boot.set(`${reading}|${position}|${scope}|${model}|${b}`, res[b]!);
        }
      }

  const verdictOf = (cell: Cell, reading: Reading): Verdict => {
    const n = counts.get(`${reading}|${cell.position}|${cell.scope}`)!;
    const b = boot.get(`${reading}|${cell.position}|${cell.scope}|${cell.model}|${cell.baseline}`)!;
    if (cell.family === "accuracy") return accuracyVerdict(n, b);
    return verdict(n, b, hitInterval.get(`${reading}|${cell.scope}|${cell.position}|${cell.model}`)!, hitInterval.get(`${reading}|${cell.scope}|${cell.position}|${cell.baseline}`)!);
  };
  const verdicts: Record<string, unknown>[] = [];
  const combined = new Map<string, Verdict>();
  for (const family of FAMILIES)
    for (const c of COMPARISONS)
      for (const position of BT_POSITIONS)
        for (const scope of SCOPES) {
          const cell: Cell = { family, model: c.model, baseline: c.baseline, position, scope };
          const main = verdictOf(cell, "main");
          const sens = verdictOf(cell, "sensitivity");
          const both = combine(main, sens);
          combined.set(`${family}|${c.model}|${c.baseline}|${position}|${scope}`, both);
          const bm = boot.get(`main|${position}|${scope}|${c.model}|${c.baseline}`)!;
          const bs = boot.get(`sensitivity|${position}|${scope}|${c.model}|${c.baseline}`)!;
          verdicts.push({
            family,
            model: c.model,
            baseline: c.baseline,
            position,
            scope,
            n_main: counts.get(`main|${position}|${scope}`),
            n_sensitivity: counts.get(`sensitivity|${position}|${scope}`),
            verdict_main: main,
            verdict_sensitivity: sens,
            verdict_combined: both,
            ...diffCols(bm, bs),
          });
        }
  files["verdicts.json"] = verdicts;

  const trends: Record<string, unknown>[] = [];
  let trendWins = 0;
  for (const method of BT_METHODS)
    for (const position of BT_POSITIONS)
      for (const statistic of ["spearman", "mae"] as const) {
        const run = (reading: Reading) =>
          trendTest(folds, folds.map((w) => weeklyRaw.get(`${reading}|${w}|${position}|${method}`)![statistic]), statistic === "spearman" ? "up" : "down");
        const m = run("main");
        const s = run("sensitivity");
        const both = combineTrend(m.trend, s.trend);
        if (both === "improves") trendWins++;
        trends.push({
          method,
          position,
          statistic,
          tau_main: r4(m.tau),
          p_main: r4(m.p),
          trend_main: m.trend,
          tau_sens: r4(s.tau),
          p_sens: r4(s.p),
          trend_sens: s.trend,
          trend_combined: both,
          weeks_main: m.weeks,
          weeks_sens: s.weeks,
        });
      }
  files["trend.json"] = trends;

  const blocksOf = (family: Family, model: BtMethod, baseline: BtMethod, position: BtPosition): Verdict[] =>
    [1, 2, 3, 4].map((b) => combined.get(`${family}|${model}|${baseline}|${position}|block-${b}`)!);
  const edgeOf = (b: Verdict[]): string =>
    b[0] !== "beats" ? "no_early_edge" : b[3] === "beats" ? "persists" : b[3] === "loses" ? "fades_and_reverses" : "fades";
  const settling: Record<string, unknown>[] = [];
  for (const position of BT_POSITIONS)
    for (const family of FAMILIES) {
      for (const model of ["v1", "v2", "v3", "v4"] as const) {
        const b = blocksOf(family, model, "baseline", position);
        settling.push({ position, family, comparison: `${model}_vs_baseline`, block1: b[0], block2: b[1], block3: b[2], block4: b[3], settling_week: settlingWeek(b) });
      }
      for (const [pair, model, baseline] of [["v3_vs_v1", "v3", "v1"], ["v4_vs_v2", "v4", "v2"]] as const) {
        const b = blocksOf(family, model, baseline, position);
        settling.push({ position, family, pair, block1: b[0], block2: b[1], block3: b[2], block4: b[3], edge: edgeOf(b) });
      }
    }
  files["settling-and-edge.json"] = settling;

  const total = verdicts.length + trends.length;
  if (total !== VERDICTS_TOTAL) throw new Error(`xfp backtest produced ${total} verdicts; the plan pre-registers ${VERDICTS_TOTAL}`);
  const wins = verdicts.filter((v) => v["verdict_combined"] === "beats").length + trendWins;
  const totals = Object.fromEntries(REASONS.map((r) => [r, exclusions.filter((e) => e.reason === r).reduce((s, e) => s + e.count, 0)]));
  files["summary.json"] = {
    season,
    folds,
    constants: {
      resamples: BOOTSTRAP_RESAMPLES,
      seed: BOOTSTRAP_SEED,
      trend_permutations: TREND_PERMUTATIONS,
      trend_min_weeks: TREND_MIN_WEEKS,
      trend_alpha: TREND_ALPHA,
      top_n: TOP_N,
      block_starts: [...BLOCK_STARTS],
      min_games: 1,
      thin_below_games: XFP_MIN_GAMES,
      thin_below_starts: QB_MIN_STARTS,
      min_scored: MIN_SCORED,
      positions: [...BT_POSITIONS],
    },
    verdicts_total: total,
    wins,
    of_total_text: `${wins} of ${total} verdicts are wins ("beats" or "improves")`,
    exclusion_totals: totals,
    qb_starters_under_15_dropbacks: results.reduce((s, r) => s + r.low_dropback_starters, 0),
  };
  return { files, verdicts_total: total, wins };
}
