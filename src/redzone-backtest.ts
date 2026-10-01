/**
 * Red-zone usage backtest, team flags and forward ranking. Every definition, baseline, metric and
 * threshold is fixed by docs/research/red-zone-backtest-plan.md; ADR 0008 records the outputs.
 */
import { SEEN_ID_COLUMNS, type GamesRow, type ParsedRows, type PlayByPlayRow } from "./nflverse.js";
import { buildRedZone, buildUsage, type UsageRow } from "./nflverse-tables.js";
import {
  BOOTSTRAP_RESAMPLES,
  BOOTSTRAP_SEED,
  MIN_SCORED,
  combine,
  mae,
  pairedBootstrap,
  spearman,
  topNHits,
  verdict,
  wilson,
  type Interval,
  type MethodScores,
  type ScoredItem,
  type Verdict,
} from "./backtest-stats.js";

export const POSITIONS = ["WR", "TE", "RB"] as const;
export type Position = (typeof POSITIONS)[number];
export const TOP_N: Record<Position, number> = { WR: 12, RB: 8, TE: 6 };
export const METHODS = ["model", "b1", "b1b", "b2", "b3"] as const;
export const BASELINES = ["b1", "b1b", "b2", "b3"] as const;
export const REASONS = ["bye", "not_seen", "no_history", "no_target_or_carry", "null_share"] as const;
export type Reason = (typeof REASONS)[number];
export const PASS_FIRST = 0.6;
export const RUN_FIRST = 0.45;
export const MIN_FLAG_PLAYS = 20;
export const PC_GAP = 0.1;
export const MIN_GROUP_TEAMS = 3;

const round = (n: number, dp = 4): number => Math.round(n * 10 ** dp) / 10 ** dp;
const r4 = (n: number | null): number | null => (n === null ? null : round(n));
const bump = <K>(m: Map<K, number>, k: K, by = 1): void => void m.set(k, (m.get(k) ?? 0) + by);

type Play = PlayByPlayRow & { posteam: string };
const regular = (plays: PlayByPlayRow[], season: number, keep: (week: number) => boolean): Play[] =>
  plays.filter((p): p is Play => p.season === season && p.season_type === "REG" && p.posteam !== null && keep(p.week));

/** The plan's look filter: inside the 20, no two-point try, kneel or spike. */
const inLookZone = (p: PlayByPlayRow): boolean =>
  p.yardline_100 !== null &&
  p.yardline_100 <= 20 &&
  (p.two_point_attempt ?? 0) === 0 &&
  (p.qb_kneel ?? 0) === 0 &&
  (p.qb_spike ?? 0) === 0;
const isTarget = (p: PlayByPlayRow): boolean => inLookZone(p) && p.pass === 1 && p.receiver_player_id !== null;
const isCarry = (p: PlayByPlayRow): boolean => inLookZone(p) && p.rush === 1 && p.rusher_player_id !== null;

/**
 * Weeks, counted from week 1, whose every game in `games` has regular-season plays. Stops at the
 * first week that does not, so a half-played week and everything after it is not a fold.
 */
export function completedWeeks(games: GamesRow[], plays: PlayByPlayRow[], season: number): number[] {
  const played = new Set(plays.filter((p) => p.season === season && p.season_type === "REG").map((p) => p.game_id));
  const byWeek = new Map<number, GamesRow[]>();
  for (const g of games) if (g.season === season && g.week <= 18) byWeek.set(g.week, [...(byWeek.get(g.week) ?? []), g]);
  const out: number[] = [];
  for (let w = 1; byWeek.has(w) && byWeek.get(w)!.every((g) => played.has(g.game_id)); w++) out.push(w);
  return out;
}

// ---------------------------------------------------------------- features (weeks < W only)

interface PlayerLooks {
  team: string;
  lastWeek: number;
  targets: number;
  carries: number;
  /** Looks in week W-1 alone (B2). */
  lastWeekLooks: number;
}

export interface Features {
  players: Map<string, PlayerLooks>;
  teamTargets: Map<string, number>;
  teamCarries: Map<string, number>;
  teamGames: Map<string, number>;
}

/** Looks and team totals from regular-season plays of weeks before `week`: nothing later is read. */
export function features(plays: PlayByPlayRow[], season: number, week: number): Features {
  const f: Features = { players: new Map(), teamTargets: new Map(), teamCarries: new Map(), teamGames: new Map() };
  const gamesOf = new Map<string, Set<string>>();
  const touch = (id: string, p: Play): PlayerLooks => {
    let row = f.players.get(id);
    if (!row) {
      row = { team: p.posteam, lastWeek: p.week, targets: 0, carries: 0, lastWeekLooks: 0 };
      f.players.set(id, row);
    }
    if (p.week >= row.lastWeek) {
      row.lastWeek = p.week;
      row.team = p.posteam;
    }
    return row;
  };
  for (const p of regular(plays, season, (w) => w < week)) {
    gamesOf.set(p.posteam, (gamesOf.get(p.posteam) ?? new Set()).add(p.game_id));
    if (isTarget(p)) {
      const row = touch(p.receiver_player_id!, p);
      row.targets += 1;
      if (p.week === week - 1) row.lastWeekLooks += 1;
      bump(f.teamTargets, p.posteam);
    }
    if (isCarry(p)) {
      const row = touch(p.rusher_player_id!, p);
      row.carries += 1;
      if (p.week === week - 1) row.lastWeekLooks += 1;
      bump(f.teamCarries, p.posteam);
    }
  }
  for (const [t, g] of gamesOf) f.teamGames.set(t, g.size);
  return f;
}

/** Plan section 1 check: largest absolute difference from `buildRedZone`'s committed shares. */
export function recomputeCheck(plays: PlayByPlayRow[], season: number, week: number): number {
  const mine = features(plays, season, week);
  let max = 0;
  for (const row of buildRedZone(plays, season, week)) {
    const m = mine.players.get(row.player_id);
    const tt = m ? (mine.teamTargets.get(m.team) ?? 0) : 0;
    const tc = m ? (mine.teamCarries.get(m.team) ?? 0) : 0;
    const ts = m && tt > 0 ? round(m.targets / tt) : 0;
    const cs = m && tc > 0 ? round(m.carries / tc) : 0;
    max = Math.max(max, Math.abs((row.rz_target_share ?? 0) - ts), Math.abs((row.rz_carry_share ?? 0) - cs));
  }
  return round(max);
}

// ---------------------------------------------------------------- team flags

export type FlagLabel = "pass_first" | "neutral" | "run_first" | "too_few_plays";

export interface TeamFlag {
  team: string;
  rz_plays: number;
  rz_pass_plays: number;
  /** Sacks are in the numerator: nflverse marks them `pass = 1`. */
  rz_sacks: number;
  rz_pass_rate: number | null;
  rz_looks: number;
  rz_looks_per_game: number | null;
  label: FlagLabel;
}

const isFlagPlay = (p: PlayByPlayRow): boolean =>
  p.yardline_100 !== null &&
  p.yardline_100 <= 20 &&
  (p.play_type === "pass" || p.play_type === "run") &&
  (p.qb_kneel ?? 0) === 0 &&
  (p.qb_spike ?? 0) === 0 &&
  (p.two_point_attempt ?? 0) === 0;

const labelOf = (rate: number | null, plays: number): FlagLabel =>
  plays < MIN_FLAG_PLAYS || rate === null ? "too_few_plays" : rate >= PASS_FIRST ? "pass_first" : rate <= RUN_FIRST ? "run_first" : "neutral";

/** Per team, from weeks before `week`: red-zone pass rate, volume and the label. */
export function teamFlags(plays: PlayByPlayRow[], season: number, week: number, f = features(plays, season, week)): TeamFlag[] {
  const acc = new Map<string, { plays: number; pass: number; sacks: number }>();
  for (const p of regular(plays, season, (w) => w < week)) {
    const a = acc.get(p.posteam) ?? { plays: 0, pass: 0, sacks: 0 };
    acc.set(p.posteam, a);
    if (!isFlagPlay(p)) continue;
    a.plays += 1;
    if (p.pass === 1) a.pass += 1;
    if (p.pass === 1 && p.sack === 1) a.sacks += 1;
  }
  return [...acc.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([team, a]) => {
      const rate = a.plays > 0 ? a.pass / a.plays : null;
      const looks = (f.teamTargets.get(team) ?? 0) + (f.teamCarries.get(team) ?? 0);
      const games = f.teamGames.get(team) ?? 0;
      return {
        team,
        rz_plays: a.plays,
        rz_pass_plays: a.pass,
        rz_sacks: a.sacks,
        rz_pass_rate: r4(rate),
        rz_looks: looks,
        rz_looks_per_game: games > 0 ? round(looks / games, 2) : null,
        label: labelOf(rate, a.plays),
      };
    });
}

// ---------------------------------------------------------------- predictions (no week-W data)

export interface Candidate {
  player_id: string;
  player: string;
  position: Position;
  team: string;
  /** Overall targets + carries in weeks < W (usage.json), the "has history" test. */
  overall_looks: number;
  rz_targets: number;
  rz_carries: number;
  rz_target_share: number | null;
  rz_carry_share: number | null;
  rz_look_share: number | null;
  team_rz_looks_per_game: number | null;
  proj_looks: number | null;
  proj_targets: number | null;
  proj_carries: number | null;
  /** Overall target share (usage.json pooled.target_share), the B1 input. */
  overall_target_share: number | null;
  b1_proj: number | null;
  b1b_proj: number | null;
  b2_proj: number;
  b3_proj: number | null;
}

export interface FoldFeatures {
  week: number;
  candidates: Candidate[];
  usage: UsageRow[];
  flags: TeamFlag[];
}

const isPosition = (p: string): p is Position => (POSITIONS as readonly string[]).includes(p);

/** Everything a fold predicts, from weeks < W. The same code feeds the backtest and the forward ranking. */
export function predictFold(rows: ParsedRows, season: number, week: number): FoldFeatures {
  const f = features(rows.play_by_play, season, week);
  const usage = buildUsage(rows, season, week);
  const teamOf = (u: UsageRow): string => f.players.get(u.player_id)?.team ?? u.team;
  // k(T): WR, TE and RB on T with at least one overall target or carry (B3 and the scored population).
  const k = new Map<string, number>();
  for (const u of usage) if (isPosition(u.position) && u.pooled.targets + u.pooled.carries > 0) bump(k, teamOf(u));
  const candidates: Candidate[] = [];
  for (const u of usage) {
    if (!isPosition(u.position)) continue;
    const team = teamOf(u);
    const mine = f.players.get(u.player_id);
    const targets = mine?.targets ?? 0;
    const carries = mine?.carries ?? 0;
    const tt = f.teamTargets.get(team) ?? 0;
    const tc = f.teamCarries.get(team) ?? 0;
    const games = f.teamGames.get(team) ?? 0;
    const rpg = games > 0 ? (tt + tc) / games : null;
    const lookShare = tt + tc > 0 ? (targets + carries) / (tt + tc) : null;
    const scale = (share: number | null): number | null => (share === null || rpg === null ? null : share * rpg);
    const ratio = (n: number, d: number): number | null => (d > 0 ? n / d : null);
    candidates.push({
      player_id: u.player_id,
      player: u.player,
      position: u.position,
      team,
      overall_looks: u.pooled.targets + u.pooled.carries,
      rz_targets: targets,
      rz_carries: carries,
      rz_target_share: r4(ratio(targets, tt)),
      rz_carry_share: r4(ratio(carries, tc)),
      rz_look_share: r4(lookShare),
      team_rz_looks_per_game: rpg === null ? null : round(rpg, 2),
      proj_looks: scale(lookShare),
      proj_targets: games > 0 && tt > 0 ? (targets / tt) * (tt / games) : null,
      proj_carries: games > 0 && tc > 0 ? (carries / tc) * (tc / games) : null,
      overall_target_share: u.pooled.target_share,
      b1_proj: scale(u.pooled.target_share ?? 0),
      b1b_proj: scale(ratio(u.pooled.targets + u.pooled.carries, u.pooled.team_targets + u.pooled.team_carries) ?? 0),
      b2_proj: mine?.lastWeekLooks ?? 0,
      b3_proj: rpg === null || !k.get(team) ? null : rpg / k.get(team)!,
    });
  }
  return { week, candidates, usage, flags: teamFlags(rows.play_by_play, season, week, f) };
}

// ---------------------------------------------------------------- outcomes and eligibility

export interface ScoredRow extends Candidate {
  fold: number;
  /** Appears in a `*_player_id` column of a week-W play. Unseen rows count only under the sensitivity reading. */
  seen: boolean;
  actual_looks: number;
  actual_targets: number;
  actual_carries: number;
  actual_touches: number;
  actual_tds: number;
  actual_looks_share: number | null;
  actual_targets_share: number | null;
  actual_carries_share: number | null;
}

export type Exclusions = Record<Position | "unknown", Record<Reason, number>>;
const emptyExclusions = (): Exclusions =>
  Object.fromEntries([...POSITIONS, "unknown"].map((p) => [p, Object.fromEntries(REASONS.map((r) => [r, 0]))])) as Exclusions;

export interface NextWeekFlag {
  team: string;
  label: FlagLabel;
  rz_pass_rate_prior: number | null;
  rz_pass_rate_next: number | null;
  league_rz_pass_rate_next: number | null;
  /** Pass-first above the league's week-W rate, run-first below; null when the team had no red-zone play in W. */
  tendency_kept: boolean | null;
  /** WR + TE red-zone targets in week W, by the position the fold's usage table gives (no history: not counted). */
  pc_targets_next: number;
  rz_looks_next: number;
  pc_share_next: number | null;
}

export interface FoldResult {
  week: number;
  rows: ScoredRow[];
  exclusions: Exclusions;
  flags: TeamFlag[];
  next_week: NextWeekFlag[];
  recompute_max_abs_diff: number;
}

/** Joins week-W outcomes to a fold's predictions and applies the plan's section 6 eligibility. */
export function scoreFold(rows: ParsedRows, season: number, week: number, fold = predictFold(rows, season, week)): FoldResult {
  const wk = regular(rows.play_by_play, season, (w) => w === week);
  const playedTeams = new Set(wk.map((p) => p.posteam));
  const seen = new Set<string>();
  for (const p of wk) {
    for (const id of [p.receiver_player_id, p.rusher_player_id, ...SEEN_ID_COLUMNS.map((c) => p[c])]) if (id !== null) seen.add(id);
  }
  const tgt = new Map<string, number>();
  const car = new Map<string, number>();
  const touches = new Map<string, number>();
  const tds = new Map<string, number>();
  const teamLooks = new Map<string, number>();
  const teamTgt = new Map<string, number>();
  const teamCar = new Map<string, number>();
  for (const p of wk) {
    if (isTarget(p)) {
      const id = p.receiver_player_id!;
      bump(tgt, id);
      bump(teamLooks, p.posteam);
      bump(teamTgt, p.posteam);
      if (p.complete_pass === 1) bump(touches, id);
      if (p.touchdown === 1 && p.td_player_id === id) bump(tds, id);
    }
    if (isCarry(p)) {
      const id = p.rusher_player_id!;
      bump(car, id);
      bump(touches, id);
      bump(teamLooks, p.posteam);
      bump(teamCar, p.posteam);
      if (p.touchdown === 1 && p.td_player_id === id) bump(tds, id);
    }
  }

  const exclusions = emptyExclusions();
  const scored: ScoredRow[] = [];
  const known = new Set(fold.usage.map((u) => u.player_id));
  for (const c of fold.candidates) {
    const excl = (r: Reason): void => void (exclusions[c.position][r] += 1);
    if (!playedTeams.has(c.team)) excl("bye");
    else if (c.overall_looks === 0) excl("no_target_or_carry");
    else if (c.rz_look_share === null) excl("null_share");
    else {
      const looks = (tgt.get(c.player_id) ?? 0) + (car.get(c.player_id) ?? 0);
      const share = (n: number, d: number | undefined): number | null => (d ? r4(n / d) : null);
      const isSeen = seen.has(c.player_id);
      if (!isSeen) excl("not_seen");
      scored.push({
        ...c,
        fold: week,
        seen: isSeen,
        actual_looks: looks,
        actual_targets: tgt.get(c.player_id) ?? 0,
        actual_carries: car.get(c.player_id) ?? 0,
        actual_touches: touches.get(c.player_id) ?? 0,
        actual_tds: tds.get(c.player_id) ?? 0,
        actual_looks_share: share(looks, teamLooks.get(c.team)),
        actual_targets_share: share(tgt.get(c.player_id) ?? 0, teamTgt.get(c.team)),
        actual_carries_share: share(car.get(c.player_id) ?? 0, teamCar.get(c.team)),
      });
    }
  }
  // Players with a week-W target or carry and no stats row before W: no position, no features.
  const noHistory = new Set<string>();
  for (const id of [...tgt.keys(), ...car.keys()]) if (!known.has(id)) noHistory.add(id);
  exclusions.unknown.no_history = noHistory.size;

  // Team flags held up next week, on labelled pass-first and run-first teams that played W.
  const posOf = new Map(fold.usage.map((u) => [u.player_id, u.position]));
  const flagWeek = wk.filter(isFlagPlay);
  const rate = (ps: Play[]): number | null => (ps.length > 0 ? ps.filter((p) => p.pass === 1).length / ps.length : null);
  const league = rate(flagWeek);
  const nextWeek: NextWeekFlag[] = [];
  for (const fl of fold.flags) {
    if ((fl.label !== "pass_first" && fl.label !== "run_first") || !playedTeams.has(fl.team)) continue;
    const next = rate(flagWeek.filter((p) => p.posteam === fl.team));
    const looks = teamLooks.get(fl.team) ?? 0;
    let pc = 0;
    for (const p of wk) {
      if (p.posteam === fl.team && isTarget(p) && ["WR", "TE"].includes(posOf.get(p.receiver_player_id!) ?? "")) pc += 1;
    }
    nextWeek.push({
      team: fl.team,
      label: fl.label,
      rz_pass_rate_prior: fl.rz_pass_rate,
      rz_pass_rate_next: r4(next),
      league_rz_pass_rate_next: r4(league),
      tendency_kept: next === null || league === null ? null : fl.label === "pass_first" ? next > league : next < league,
      pc_targets_next: pc,
      rz_looks_next: looks,
      pc_share_next: looks > 0 ? r4(pc / looks) : null,
    });
  }
  return {
    week,
    rows: scored,
    exclusions,
    flags: fold.flags,
    next_week: nextWeek,
    recompute_max_abs_diff: recomputeCheck(rows.play_by_play, season, week),
  };
}

// ---------------------------------------------------------------- summary

const PROJ: Record<(typeof METHODS)[number], (r: ScoredRow) => number> = {
  model: (r) => r.proj_looks ?? 0,
  b1: (r) => r.b1_proj ?? 0,
  b1b: (r) => r.b1b_proj ?? 0,
  b2: (r) => r.b2_proj,
  b3: (r) => r.b3_proj ?? 0,
};

const num = (n: number | null): number | null => (n === null ? null : round(n));
const ival = (i: Interval | null): Interval | null => (i === null ? null : { lo: round(i.lo), hi: round(i.hi) });

function methodMetrics(rows: ScoredRow[], position: Position, method: (typeof METHODS)[number]) {
  const items = (rs: ScoredRow[]): ScoredItem[] =>
    rs.map((r) => ({ id: r.player_id, fold: r.fold, team: r.team, actual: r.actual_looks, proj: PROJ[method](r) }));
  const folds = [...new Set(rows.map((r) => r.fold))].sort((a, b) => a - b);
  let hits = 0;
  let slots = 0;
  const perFold = folds.map((w) => {
    const rs = rows.filter((r) => r.fold === w);
    const it = items(rs);
    const h = topNHits(it, TOP_N[position]);
    hits += h.hits;
    slots += h.slots;
    return {
      fold: w,
      n: rs.length,
      spearman: num(spearman(it.map((i) => i.proj), it.map((i) => i.actual))),
      mae: num(mae(it.map((i) => i.proj), it.map((i) => i.actual))),
      top_n_hits: h.hits,
      top_n_slots: h.slots,
    };
  });
  const all = items(rows);
  const interval = wilson(hits, slots);
  return {
    pooled: {
      spearman: num(spearman(all.map((i) => i.proj), all.map((i) => i.actual))),
      mae: num(mae(all.map((i) => i.proj), all.map((i) => i.actual))),
      top_n_hits: hits,
      top_n_slots: slots,
      top_n_hit_rate: slots > 0 ? round(hits / slots) : null,
      top_n_wilson: ival(interval),
    },
    per_fold: perFold,
    interval,
  };
}

type SecondaryOutcome = "touches" | "tds" | "targets" | "carries";

const SECONDARY: Record<SecondaryOutcome, { actual: (r: ScoredRow) => number; model: (r: ScoredRow) => number; model_projection: string }> = {
  touches: { actual: (r) => r.actual_touches, model: PROJ.model, model_projection: "proj_looks" },
  tds: { actual: (r) => r.actual_tds, model: PROJ.model, model_projection: "proj_looks" },
  targets: { actual: (r) => r.actual_targets, model: (r) => r.proj_targets ?? 0, model_projection: "proj_targets" },
  carries: { actual: (r) => r.actual_carries, model: (r) => r.proj_carries ?? 0, model_projection: "proj_carries" },
};

/** The plan's secondary outcomes against the projections as they stand. Reported only: no verdict, outside the decision rule. */
function secondaryOutcomes(rows: ScoredRow[]) {
  return Object.fromEntries(
    (Object.keys(SECONDARY) as SecondaryOutcome[]).map((o) => {
      const { actual, model, model_projection } = SECONDARY[o];
      const act = rows.map(actual);
      const pooled = (proj: number[]) => ({ spearman: num(spearman(proj, act)), mae: num(mae(proj, act)) });
      return [
        o,
        {
          n: rows.length,
          projection: { model: model_projection, baselines: "same projection each baseline uses for looks (b1_proj, b1b_proj, b2_proj, b3_proj)" },
          methods: Object.fromEntries(METHODS.map((m) => [m, pooled(rows.map(m === "model" ? model : PROJ[m]))])),
        },
      ];
    }),
  ) as Record<SecondaryOutcome, { n: number; projection: { model: string; baselines: string }; methods: Record<string, { spearman: number | null; mae: number | null }> }>;
}

function evaluateReading(rows: ScoredRow[], position: Position) {
  const metrics = Object.fromEntries(METHODS.map((m) => [m, methodMetrics(rows, position, m)])) as Record<
    (typeof METHODS)[number],
    ReturnType<typeof methodMetrics>
  >;
  const scores: MethodScores = {
    actual: rows.map((r) => r.actual_looks),
    groups: rows.map((r) => `${r.fold}|${r.team}`),
    proj: Object.fromEntries(METHODS.map((m) => [m, rows.map(PROJ[m])])),
  };
  const boot = pairedBootstrap(scores, "model", [...BASELINES]);
  const verdicts = Object.fromEntries(
    BASELINES.map((b) => [b, verdict(rows.length, boot[b]!, metrics.model.interval, metrics[b].interval)]),
  ) as Record<(typeof BASELINES)[number], Verdict>;
  return {
    n: rows.length,
    methods: Object.fromEntries(METHODS.map((m) => [m, { pooled: metrics[m].pooled, per_fold: metrics[m].per_fold }])),
    paired_bootstrap_model_minus_baseline: Object.fromEntries(
      BASELINES.map((b) => [b, { spearman_diff: ival(boot[b]!.spearman_diff), mae_diff: ival(boot[b]!.mae_diff) }]),
    ),
    verdicts,
    secondary_outcomes: secondaryOutcomes(rows),
  };
}

function sumExclusions(folds: FoldResult[]): Record<string, Exclusions> {
  return Object.fromEntries(folds.map((f) => [`weeks_1_to_${f.week - 1}__target_${f.week}`, f.exclusions]));
}

function flagSummary(folds: FoldResult[]) {
  const group = (label: "pass_first" | "run_first") => {
    const rs = folds.flatMap((f) => f.next_week.filter((n) => n.label === label));
    const tested = rs.filter((n) => n.tendency_kept !== null);
    const kept = tested.filter((n) => n.tendency_kept).length;
    const looks = rs.reduce((s, n) => s + n.rz_looks_next, 0);
    const pc = rs.reduce((s, n) => s + n.pc_targets_next, 0);
    return {
      team_folds: rs.length,
      teams: new Set(rs.map((n) => n.team)).size,
      tendency_kept: kept,
      tendency_tested: tested.length,
      tendency_kept_wilson: ival(wilson(kept, tested.length)),
      pc_targets: pc,
      rz_looks: looks,
      pc_share: looks > 0 ? round(pc / looks) : null,
      pc_share_wilson: ival(wilson(pc, looks)),
    };
  };
  const pf = group("pass_first");
  const rf = group("run_first");
  const enough = pf.teams >= MIN_GROUP_TEAMS && rf.teams >= MIN_GROUP_TEAMS;
  const gap = pf.pc_share !== null && rf.pc_share !== null ? round(pf.pc_share - rf.pc_share) : null;
  const w1 = pf.pc_share_wilson;
  const w2 = rf.pc_share_wilson;
  const apart = w1 !== null && w2 !== null && (w1.lo > w2.hi || w2.lo > w1.hi);
  const held = enough && gap !== null && gap >= PC_GAP && apart;
  return {
    per_fold: folds.map((f) => ({
      fold: f.week,
      labelled: f.flags.filter((t) => t.label !== "too_few_plays").length,
      unlabelled_too_few_plays: f.flags.filter((t) => t.label === "too_few_plays").length,
      pass_first: f.flags.filter((t) => t.label === "pass_first").length,
      neutral: f.flags.filter((t) => t.label === "neutral").length,
      run_first: f.flags.filter((t) => t.label === "run_first").length,
      sacks_in_numerator: f.flags.reduce((s, t) => s + t.rz_sacks, 0),
      rz_pass_plays: f.flags.reduce((s, t) => s + t.rz_pass_plays, 0),
    })),
    pass_first: pf,
    run_first: rf,
    pc_share_gap: gap,
    pc_share_verdict: held ? "held up" : "inconclusive",
    pc_share_rule: `pass-first pc_share exceeds run-first by >= ${PC_GAP}, Wilson intervals (over looks) do not overlap, >= ${MIN_GROUP_TEAMS} teams per group`,
  };
}

export function summarise(folds: FoldResult[]) {
  const positions = Object.fromEntries(
    POSITIONS.map((pos) => {
      const all = folds.flatMap((f) => f.rows.filter((r) => r.position === pos));
      const seen = evaluateReading(all.filter((r) => r.seen), pos);
      const sensitivity = evaluateReading(all, pos);
      const combined = Object.fromEntries(
        BASELINES.map((b) => [b, combine(seen.verdicts[b], sensitivity.verdicts[b])]),
      );
      return [pos, { top_n: TOP_N[pos], seen_rule: seen, sensitivity_unseen_as_zero: sensitivity, combined_verdicts: combined }];
    }),
  );
  return {
    folds: folds.map((f) => f.week),
    plan: "docs/research/red-zone-backtest-plan.md",
    bootstrap: { resamples: BOOTSTRAP_RESAMPLES, seed: BOOTSTRAP_SEED, unit: "team-week" },
    minimum_scored_player_weeks: MIN_SCORED,
    no_multiplicity_correction: "Four baselines are compared per position with no correction for multiple comparisons.",
    recompute_check: {
      note: "Largest absolute difference between rz_target_share / rz_carry_share recomputed with kneels and spikes excluded and buildRedZone's (the committed red-zone.json). A check, not a tuning input.",
      per_fold: folds.map((f) => ({ fold: f.week, max_abs_diff: f.recompute_max_abs_diff })),
      max_abs_diff: Math.max(0, ...folds.map((f) => f.recompute_max_abs_diff)),
    },
    excluded_player_weeks: {
      by_fold: sumExclusions(folds),
      note: "Reason priority: bye, no_target_or_carry, null_share, then not_seen (a reason only under the primary reading; the sensitivity reading scores those players with 0). no_history counts players with a week-W red-zone target or carry and no stats row before W, position unknown.",
    },
    positions,
    team_flags: flagSummary(folds),
  };
}

// ---------------------------------------------------------------- forward ranking

/** Top `top` per position by projected looks (the backtest's model), ties by red-zone targets then player_id. */
export function rankPerPosition(candidates: Candidate[], top = 20): Record<Position, Candidate[]> {
  const byLooks = (a: Candidate, b: Candidate): number =>
    (b.proj_looks ?? 0) - (a.proj_looks ?? 0) || b.rz_targets - a.rz_targets || a.player_id.localeCompare(b.player_id);
  // The backtest's eligibility: some target or carry before W, and a non-null share.
  const eligible = candidates.filter((c) => c.overall_looks > 0 && c.rz_look_share !== null);
  return Object.fromEntries(POSITIONS.map((p) => [p, eligible.filter((c) => c.position === p).sort(byLooks).slice(0, top)])) as Record<
    Position,
    Candidate[]
  >;
}

export function forwardRanking(rows: ParsedRows, season: number, week: number, top = 20) {
  const fold = predictFold(rows, season, week);
  const playing = new Set(rows.games.filter((g) => g.season === season && g.week === week).flatMap((g) => [g.home_team, g.away_team]));
  const flag = new Map(fold.flags.map((t) => [t.team, t]));
  const ranked = rankPerPosition(
    fold.candidates.filter((c) => playing.size === 0 || playing.has(c.team)),
    top,
  );
  const row = (c: Candidate) => ({
    player_id: c.player_id,
    player: c.player,
    position: c.position,
    team: c.team,
    rz_targets: c.rz_targets,
    rz_target_share: c.rz_target_share,
    rz_carries: c.rz_carries,
    rz_look_share: c.rz_look_share,
    team_rz_looks_per_game: c.team_rz_looks_per_game,
    proj_looks: r4(c.proj_looks),
    proj_targets: r4(c.proj_targets),
    proj_carries: r4(c.proj_carries),
    overall_target_share: c.overall_target_share,
    b1_proj: r4(c.b1_proj),
    team_flag: flag.get(c.team)?.label ?? "too_few_plays",
    team_rz_pass_rate: flag.get(c.team)?.rz_pass_rate ?? null,
  });
  return {
    ranking: Object.fromEntries(POSITIONS.map((p) => [p, ranked[p].map(row)])) as Record<Position, ReturnType<typeof row>[]>,
    teams: fold.flags.filter((t) => playing.size === 0 || playing.has(t.team)),
  };
}

export interface BacktestOutput {
  folds: FoldResult[];
  summary: ReturnType<typeof summarise>;
  forward_week: number;
  forward: ReturnType<typeof forwardRanking>;
}

/** Folds are 1..W-1 -> W for every completed week W >= 2; the ranking is for the week after the last. */
export function runBacktest(rows: ParsedRows, season: number, through?: number): BacktestOutput {
  const completed = through !== undefined ? Array.from({ length: through }, (_, i) => i + 1) : completedWeeks(rows.games, rows.play_by_play, season);
  const last = completed.length > 0 ? completed[completed.length - 1]! : 0;
  if (last < 2) throw new Error(`need at least two completed weeks to backtest; found ${last}`);
  const folds = completed.filter((w) => w >= 2).map((w) => scoreFold(rows, season, w));
  return { folds, summary: summarise(folds), forward_week: last + 1, forward: forwardRanking(rows, season, last + 1) };
}
