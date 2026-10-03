/**
 * `nflverse-cli xfp`: expected fantasy points from bucket values (#163, #165). v1 uses league-average
 * values; v2 adjusts them for the defense and the passer; v3 takes the values from the previous season;
 * v4 adjusts v3. Only regular-season weeks before the target week feed any number (ADR 0008), except
 * the week-W schedule, which names the opponent. Plays are joined to players on player_id.
 */
import type { ParsedRows, PlayByPlayRow } from "./nflverse.js";
import { buildUsage } from "./nflverse-tables.js";

export const XFP_POSITIONS = ["WR", "TE", "RB"] as const;
export type XfpPosition = (typeof XFP_POSITIONS)[number];
/** `--position` also takes QB, which has its own section (#167). */
export const XFP_ARG_POSITIONS = [...XFP_POSITIONS, "QB"] as const;
/** Games before the week a player needs to be ranked or placed in a pecking order. */
export const XFP_MIN_GAMES = 2;
/** The leader is a clear 1 when this many share points ahead of the next player. */
export const CLEAR_LEAD_POINTS = 5;
/** Plays of shrinkage in an adjustment factor: (actual + K*m) / (expected + K*m). Fixed, not tuned. */
export const ADJUST_K = 100;
/** The previous season feeds v3 through its regular-season week 18. */
export const PREV_SEASON_LAST_WEEK = 18;
export const XFP_SORTS = ["v1", "v2", "v3", "v4"] as const;
export type XfpSort = (typeof XFP_SORTS)[number];
const RZ_YARDLINE = 20;
const I5_YARDLINE = 5;

export interface XfpArgs {
  season: number;
  week: number;
  position?: XfpPosition | "QB";
  team?: string;
  top?: number;
  sort?: XfpSort;
}

/** Strict parse of the flags after `xfp`; null for anything unknown, repeated, missing or malformed. */
export function parseXfpArgs(rest: string[]): XfpArgs | null {
  if (rest.length % 2 !== 0) return null;
  const f = new Map<string, string>();
  for (let i = 0; i < rest.length; i += 2) {
    if (f.has(rest[i]!) || !["--season", "--week", "--position", "--team", "--top", "--sort"].includes(rest[i]!)) return null;
    f.set(rest[i]!, rest[i + 1]!);
  }
  const season = f.get("--season");
  const week = f.get("--week");
  if (season === undefined || !/^\d{4}$/.test(season) || week === undefined || !/^\d{1,2}$/.test(week) || Number(week) < 2) return null;
  const out: XfpArgs = { season: Number(season), week: Number(week) };
  const position = f.get("--position");
  if (position !== undefined) {
    if (!(XFP_ARG_POSITIONS as readonly string[]).includes(position)) return null;
    out.position = position as XfpPosition | "QB";
  }
  const team = f.get("--team");
  if (team !== undefined) {
    if (!/^[A-Z]{2,3}$/.test(team)) return null;
    out.team = team;
  }
  const top = f.get("--top");
  if (top !== undefined) {
    if (!/^\d+$/.test(top) || Number(top) < 1) return null;
    out.top = Number(top);
  }
  const sort = f.get("--sort");
  if (sort !== undefined) {
    if (!(XFP_SORTS as readonly string[]).includes(sort)) return null;
    out.sort = sort as XfpSort;
  }
  return out;
}

const BANDS = ["<=0", "1-9", "10-19", "20+", "na"] as const;
type Band = (typeof BANDS)[number];
const bandOf = (air: number | null): Band =>
  air === null ? "na" : air <= 0 ? "<=0" : air <= 9 ? "1-9" : air <= 19 ? "10-19" : "20+";

export type BucketKey = string;
const BUCKET_ORDER: BucketKey[] = [
  ...BANDS.flatMap((b) => [`tgt ${b} rz`, `tgt ${b} of`]),
  "car i5",
  "car 6-20",
  "car of",
];

export interface Look {
  kind: "target" | "carry";
  player_id: string;
  bucket: BucketKey;
  points: number;
  redZone: boolean;
  defteam: string | null;
  /** The passer of a target; null for carries. */
  passer: string | null;
}

/**
 * Targets and carries from regular-season plays before the week, minus two-point tries, kneels and spikes.
 * `onlyWeek` narrows that to one week, which is how the backtest scores an outcome with the same rules.
 */
export function extractLooks(plays: PlayByPlayRow[], season: number, week: number, onlyWeek?: number): Look[] {
  const out: Look[] = [];
  for (const p of plays) {
    if (p.season !== season || p.season_type !== "REG" || p.week >= week) continue;
    if (onlyWeek !== undefined && p.week !== onlyWeek) continue;
    if (p.two_point_attempt === 1 || p.qb_kneel === 1 || p.qb_spike === 1) continue;
    const yl = p.yardline_100;
    const redZone = yl !== null && yl <= RZ_YARDLINE;
    if (p.pass === 1 && p.receiver_player_id !== null) {
      const id = p.receiver_player_id;
      out.push({
        kind: "target",
        player_id: id,
        bucket: `tgt ${bandOf(p.air_yards)} ${redZone ? "rz" : "of"}`,
        points: 0.5 * (p.complete_pass === 1 ? 1 : 0) + 0.1 * (p.receiving_yards ?? 0) + (p.td_player_id === id ? 6 : 0),
        redZone,
        defteam: p.defteam ?? null,
        passer: p.passer_player_id,
      });
    } else if (p.rush === 1 && p.rusher_player_id !== null && p.play_type === "run") {
      const id = p.rusher_player_id;
      out.push({
        kind: "carry",
        player_id: id,
        bucket: `car ${yl !== null && yl <= I5_YARDLINE ? "i5" : redZone ? "6-20" : "of"}`,
        points: 0.1 * (p.rushing_yards ?? 0) + (p.td_player_id === id ? 6 : 0),
        redZone,
        defteam: p.defteam ?? null,
        passer: null,
      });
    }
  }
  return out;
}

export interface BucketValue {
  bucket: BucketKey;
  value: number;
  n: number;
}

/** A bucket's league value is the mean half-PPR of every play in it; empty buckets are left out. */
export function bucketValues(looks: Look[], order: BucketKey[] = BUCKET_ORDER): BucketValue[] {
  const acc = new Map<BucketKey, { sum: number; n: number }>();
  for (const l of looks) {
    const a = acc.get(l.bucket) ?? { sum: 0, n: 0 };
    a.sum += l.points;
    a.n += 1;
    acc.set(l.bucket, a);
  }
  return order.filter((b) => acc.has(b)).map((bucket) => {
    const a = acc.get(bucket)!;
    return { bucket, value: a.sum / a.n, n: a.n };
  });
}

export interface XfpPlayer {
  player_id: string;
  player: string;
  position: XfpPosition;
  team: string;
  games: number;
  target_share: number | null;
  targets_per_game: number;
  carries_per_game: number;
  rz_looks: number;
  xfp_per_game: number;
  actual_per_game: number;
  diff: number;
}

/** One adjusted model's numbers for a player; next is null on a bye. */
export interface Projection {
  retro: number;
  next: number | null;
}

export interface ModelPlayer extends XfpPlayer {
  /** v2: v1's values adjusted for defense and passer. */
  v2: Projection;
  /** v3: current plays at previous-season values; null when no previous season was supplied. */
  v3: number | null;
  /** v4: v3's values adjusted for defense and passer. */
  v4: Projection | null;
  /** The week-W opponent; null on a bye. */
  opponent: { team: string; away: boolean } | null;
  /** Q*: the team's most recent starter; null when the team has no earlier game. */
  starter: { id: string; name: string } | null;
}

export interface Tiered {
  tier: string;
  player: XfpPlayer;
}

/** A bucket value table: v1's, or v3's. */
export type ValueTable = Map<BucketKey, number>;

export const toTable = (values: BucketValue[]): ValueTable => new Map(values.map((b) => [b.bucket, b.value]));

export interface Adjustment {
  /** Mean value per class-c play, m_c. */
  mean: { target: number; carry: number };
  /** Defense factors keyed by `${defteam} ${class}`. */
  defense: Map<string, number>;
  /** Passer factors, targets only. */
  passer: Map<string, number>;
}

const shrink = (actual: number, expected: number, mean: number): number => {
  const denom = expected + ADJUST_K * mean;
  return denom === 0 ? 1 : (actual + ADJUST_K * mean) / denom;
};

const defKey = (team: string, kind: Look["kind"]): string => `${team} ${kind}`;

/**
 * Factors for any value table V: f = (A + K*m) / (E + K*m), where A is actual points, E the points V
 * expects over the same plays, m the league mean V per play of the class, K = ADJUST_K. Defenses are
 * keyed by class, passers cover targets only.
 */
export function buildAdjustment(looks: Look[], values: ValueTable): Adjustment {
  const v = (l: Look): number => values.get(l.bucket) ?? 0;
  const cls = { target: { e: 0, n: 0 }, carry: { e: 0, n: 0 } };
  for (const l of looks) {
    cls[l.kind].e += v(l);
    cls[l.kind].n += 1;
  }
  const mean = {
    target: cls.target.n === 0 ? 0 : cls.target.e / cls.target.n,
    carry: cls.carry.n === 0 ? 0 : cls.carry.e / cls.carry.n,
  };
  const tally = (key: (l: Look) => string | null): Map<string, number> => {
    const acc = new Map<string, { a: number; e: number; kind: Look["kind"] }>();
    for (const l of looks) {
      const k = key(l);
      if (k === null) continue;
      const t = acc.get(k) ?? { a: 0, e: 0, kind: l.kind };
      t.a += l.points;
      t.e += v(l);
      acc.set(k, t);
    }
    return new Map([...acc].map(([k, t]) => [k, shrink(t.a, t.e, mean[t.kind])]));
  };
  return {
    mean,
    defense: tally((l) => (l.defteam === null ? null : defKey(l.defteam, l.kind))),
    passer: tally((l) => (l.kind === "target" ? l.passer : null)),
  };
}

/** Defense factor; exactly 1 for a defense with no plays of the class. */
export const defenseFactor = (adj: Adjustment, team: string | null, kind: Look["kind"]): number =>
  team === null ? 1 : (adj.defense.get(defKey(team, kind)) ?? 1);

/** Passer factor; exactly 1 for a passer with no targets. */
export const passerFactor = (adj: Adjustment, id: string | null): number => (id === null ? 1 : (adj.passer.get(id) ?? 1));

interface Sums {
  target: number;
  carry: number;
  /** Sum of V x the play's factors over the player's plays. */
  adjusted: number;
}

/** Per player: V summed by class, and V x the play's own factors summed. */
function sumsByPlayer(looks: Look[], values: ValueTable, adj: Adjustment): Map<string, Sums> {
  const out = new Map<string, Sums>();
  for (const l of looks) {
    const s = out.get(l.player_id) ?? { target: 0, carry: 0, adjusted: 0 };
    const v = values.get(l.bucket) ?? 0;
    s[l.kind] += v;
    s.adjusted += v * defenseFactor(adj, l.defteam, l.kind) * (l.kind === "target" ? passerFactor(adj, l.passer) : 1);
    out.set(l.player_id, s);
  }
  return out;
}

export interface Matchup {
  opponent: string;
  away: boolean;
}

/** The team's week-W opponent from the schedule; null on a bye. The one place week W is read. */
export function opponentOf(rows: ParsedRows, season: number, week: number, team: string): Matchup | null {
  for (const g of rows.games) {
    if (g.season !== season || g.week !== week) continue;
    if (g.home_team === team) return { opponent: g.away_team, away: false };
    if (g.away_team === team) return { opponent: g.home_team, away: true };
  }
  return null;
}

/**
 * Q*: the passer with the most `qb_dropback = 1` plays in the team's latest regular-season game before
 * W, ties broken by player_id; null when the team has no earlier game or no passer in it.
 */
export function latestStarter(plays: PlayByPlayRow[], season: number, week: number, team: string): string | null {
  let latest: { week: number; game: string } | null = null;
  for (const p of plays) {
    if (p.season !== season || p.season_type !== "REG" || p.week >= week || p.posteam !== team) continue;
    if (latest === null || p.week > latest.week) latest = { week: p.week, game: p.game_id };
  }
  if (latest === null) return null;
  const counts = new Map<string, number>();
  for (const p of plays) {
    if (p.season !== season || p.game_id !== latest.game || p.posteam !== team || p.qb_dropback !== 1 || p.passer_player_id === null) continue;
    counts.set(p.passer_player_id, (counts.get(p.passer_player_id) ?? 0) + 1);
  }
  const ranked = [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  return ranked.length === 0 ? null : ranked[0]![0];
}

export interface ValueTables {
  /** Previous season's table, n = previous-season plays; empty buckets are absent. */
  previous: BucketValue[];
  /** v3's table: previous-season values, with the current value where the previous season had n = 0. */
  v3: ValueTable;
  /** Buckets that fell back to the current season's value. */
  fallbacks: BucketKey[];
}

/** v3's value table. A bucket the previous season never saw takes the current season's value. */
export function previousSeasonTable(prior: ParsedRows, season: number, current: BucketValue[]): ValueTables {
  return withFallbacks(bucketValues(extractLooks(prior.play_by_play, season - 1, PREV_SEASON_LAST_WEEK + 1)), current);
}

/** Previous-season values, with the current season's value where the previous season had n = 0. */
function withFallbacks(previous: BucketValue[], current: BucketValue[]): ValueTables {
  const v3 = toTable(previous);
  const fallbacks: BucketKey[] = [];
  for (const b of current) {
    if (!v3.has(b.bucket)) {
      v3.set(b.bucket, b.value);
      fallbacks.push(b.bucket);
    }
  }
  return { previous, v3, fallbacks };
}

export interface XfpResult {
  buckets: BucketValue[];
  players: ModelPlayer[];
  adjustment: Adjustment;
  /** Null without a previous season. */
  v3: ValueTables | null;
  adjustmentV3: Adjustment | null;
}

export function buildXfp(rows: ParsedRows, season: number, week: number, prior: ParsedRows | null = null): XfpResult {
  const looks = extractLooks(rows.play_by_play, season, week);
  const buckets = bucketValues(looks);
  const value = toTable(buckets);
  const v3 = prior === null ? null : previousSeasonTable(prior, season, buckets);
  const adj = buildAdjustment(looks, value);
  const adj3 = v3 === null ? null : buildAdjustment(looks, v3.v3);
  const sums1 = sumsByPlayer(looks, value, adj);
  const sums3 = v3 === null || adj3 === null ? null : sumsByPlayer(looks, v3.v3, adj3);
  const byPlayer = new Map<string, { t: number; c: number; rz: number; exp: number; act: number }>();
  for (const l of looks) {
    const a = byPlayer.get(l.player_id) ?? { t: 0, c: 0, rz: 0, exp: 0, act: 0 };
    if (l.kind === "target") a.t += 1;
    else a.c += 1;
    if (l.redZone) a.rz += 1;
    a.exp += value.get(l.bucket)!;
    a.act += l.points;
    byPlayer.set(l.player_id, a);
  }
  const names = new Map<string, string>();
  for (const s of rows.stats_player) {
    if (s.season === season && s.week < week && s.player_id !== null && s.player_display_name !== null) names.set(s.player_id, s.player_display_name);
  }
  const starters = new Map<string, string | null>();
  const starterOf = (team: string): string | null => {
    if (!starters.has(team)) starters.set(team, latestStarter(rows.play_by_play, season, week, team));
    return starters.get(team)!;
  };
  const project = (s: Sums, games: number, a: Adjustment, match: Matchup | null, q: string | null): Projection => ({
    retro: s.adjusted / games,
    next:
      match === null
        ? null
        : (s.target / games) * defenseFactor(a, match.opponent, "target") * passerFactor(a, q) +
          (s.carry / games) * defenseFactor(a, match.opponent, "carry"),
  });
  const zero: Sums = { target: 0, carry: 0, adjusted: 0 };
  const players: ModelPlayer[] = [];
  for (const u of buildUsage(rows, season, week)) {
    if (!(XFP_POSITIONS as readonly string[]).includes(u.position) || u.games === 0) continue;
    const a = byPlayer.get(u.player_id) ?? { t: 0, c: 0, rz: 0, exp: 0, act: 0 };
    const match = opponentOf(rows, season, week, u.team);
    const q = starterOf(u.team);
    const s3 = sums3?.get(u.player_id) ?? zero;
    players.push({
      player_id: u.player_id,
      player: u.player,
      position: u.position as XfpPosition,
      team: u.team,
      games: u.games,
      target_share: u.pooled.target_share,
      targets_per_game: a.t / u.games,
      carries_per_game: a.c / u.games,
      rz_looks: a.rz,
      xfp_per_game: a.exp / u.games,
      actual_per_game: a.act / u.games,
      diff: (a.act - a.exp) / u.games,
      v2: project(sums1.get(u.player_id) ?? zero, u.games, adj, match, q),
      v3: sums3 === null ? null : (s3.target + s3.carry) / u.games,
      v4: adj3 === null ? null : project(s3, u.games, adj3, match, q),
      opponent: match === null ? null : { team: match.opponent, away: match.away },
      starter: q === null ? null : { id: q, name: names.get(q) ?? q },
    });
  }
  return { buckets, players, adjustment: adj, v3, adjustmentV3: adj3 };
}

const byId = (a: { player_id: string }, b: { player_id: string }): number => a.player_id.localeCompare(b.player_id);

/**
 * Top four WR/TE/RB with 2+ games by target share. The leader is 1 when 5+ share points clear of #2
 * (then #2 is 2); otherwise the top two are 1a / 1b. The rest are 3 and 4.
 */
export function peckingOrder(players: XfpPlayer[], team: string): Tiered[] {
  const top = players
    .filter((p) => p.team === team && p.games >= XFP_MIN_GAMES)
    .sort((a, b) => (b.target_share ?? -1) - (a.target_share ?? -1) || byId(a, b))
    .slice(0, 4);
  const lead = top.length < 2 ? Infinity : ((top[0]!.target_share ?? 0) - (top[1]!.target_share ?? 0)) * 100;
  const tiers = lead >= CLEAR_LEAD_POINTS - 1e-9 ? ["1", "2", "3", "4"] : ["1a", "1b", "3", "4"];
  return top.map((player, i) => ({ tier: tiers[i]!, player }));
}

/** The number a ranking sorts on; v2 and v4 sort on the next game, so a bye has no key. */
export function sortKey(p: XfpPlayer | ModelPlayer, sort: XfpSort): number | null {
  const m = p as Partial<ModelPlayer>;
  if (sort === "v1") return p.xfp_per_game;
  if (sort === "v2") return m.v2?.next ?? null;
  if (sort === "v3") return m.v3 ?? null;
  return m.v4?.next ?? null;
}

/** Players with 2+ games, highest key first (v1's xFP/g by default); players with no key go last. */
export function rank<T extends XfpPlayer>(players: T[], sort: XfpSort = "v1"): T[] {
  const key = (p: T): number => sortKey(p, sort) ?? -Infinity;
  return players.filter((p) => p.games >= XFP_MIN_GAMES).sort((a, b) => key(b) - key(a) || byId(a, b));
}

const f1 = (n: number): string => n.toFixed(1);
const f2 = (n: number): string => n.toFixed(2);
const pct = (n: number | null): string => (n === null ? "n/a" : `${(n * 100).toFixed(1)}%`);
const opt = (n: number | null | undefined): string => (n === null || n === undefined ? "-" : f1(n));

const SORT_TITLE: Record<XfpSort, string> = { v1: "xFP/g", v2: "v2 next game", v3: "v3 xFP/g", v4: "v4 next game" };
export const RANKING_HEADER =
  "  # player (team pos, games) v1 v2-retro v2-next v3 v4-retro v4-next actual/g diff tgt-share tgt/g car/g rz-looks next-game";

function nextGame(p: ModelPlayer): string {
  if (p.opponent === null) return "bye";
  return `${p.opponent.away ? "@" : "vs"} ${p.opponent.team}, QB ${p.starter?.name ?? "n/a"}`;
}

function rankingLines(title: string, pool: ModelPlayer[], top: number | undefined, sort: XfpSort): string[] {
  const ranked = rank(pool, sort);
  const left = pool.length - ranked.length;
  const shown = top === undefined ? ranked : ranked.slice(0, top);
  const out = [`${title} (${shown.length} of ${ranked.length} ranked; ${left} left out with fewer than ${XFP_MIN_GAMES} games)`];
  out.push(RANKING_HEADER);
  shown.forEach((p, i) =>
    out.push(
      `  ${i + 1}. ${p.player} (${p.team} ${p.position}, ${p.games} g) ${f1(p.xfp_per_game)} ${f1(p.v2.retro)} ${opt(p.v2.next)} ${opt(p.v3)} ${opt(p.v4?.retro)} ${opt(p.v4?.next)} ${f1(p.actual_per_game)} ${p.diff >= 0 ? "+" : ""}${f1(p.diff)} ${pct(p.target_share)} ${f1(p.targets_per_game)} ${f1(p.carries_per_game)} ${p.rz_looks} ${nextGame(p)}`,
    ),
  );
  return out;
}

/** A passer prints by display name when a stats row before the week has one, else by player_id. */
function factorLines(label: string, adj: Adjustment, names: Map<string, string> = new Map()): string[] {
  const teams = [...new Set([...adj.defense.keys()].map((k) => k.split(" ")[0]!))].sort();
  const dl = teams.map((t) => `${t} ${f2(defenseFactor(adj, t, "target"))}/${f2(defenseFactor(adj, t, "carry"))}`);
  const ql = [...adj.passer]
    .map(([id, f]) => [names.get(id) ?? id, f] as const)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([name, f]) => `${name} ${f2(f)}`);
  return [
    `${label} defense factors (target/carry): ${dl.join("; ") || "(none)"}`,
    `${label} passer factors: ${ql.join("; ") || "(none)"}`,
  ];
}

export function xfpReport(rows: ParsedRows, args: XfpArgs, prior: ParsedRows | null = null): string {
  const { season, week } = args;
  const sort = args.sort ?? "v1";
  if (args.position === "QB") return [...XFP_NOTICE(season, week), "", ...qbReport(rows, args, prior)].join("\n");
  const res = buildXfp(rows, season, week, prior);
  const out = [
    `nflverse xfp v1-v4, ${season} week ${week}, data through week ${week - 1}.`,
    "Data © the nflverse project, https://github.com/nflverse/nflverse-data, used under CC-BY 4.0. Derived values.",
    "v1: league-average bucket values; no opponent or quarterback adjustment. Half-PPR.",
    "v2: adjusted, not validated against v1",
    "v3: previous-season values, not validated against v1",
    "v4: adjusted, not validated against v1",
    `Adjustment factors use K = ${ADJUST_K} plays; v2 and v4 next-game numbers use the week-${week} opponent and each team's latest starter.`,
    "",
    "Bucket values (mean half-PPR per play, n plays)" + (res.v3 ? "; v1 | previous season v3" : ""),
  ];
  const prev = new Map((res.v3?.previous ?? []).map((b) => [b.bucket, b]));
  for (const b of res.buckets) {
    const p = prev.get(b.bucket);
    out.push(`  ${b.bucket}: ${b.value.toFixed(3)} (n=${b.n})` + (res.v3 ? ` | ${p ? `${p.value.toFixed(3)} (n=${p.n})` : "n/a (n=0), fell back to v1"}` : ""));
  }
  if (res.v3) out.push(`  v3 buckets that fell back to the current season: ${res.v3.fallbacks.join(", ") || "none"}`);
  else out.push("  v3 and v4: no previous-season data supplied, not computed");
  const passerNames = new Map<string, string>();
  for (const st of rows.stats_player) {
    if (st.season === season && st.week < week && st.player_id !== null && st.player_display_name !== null) passerNames.set(st.player_id, st.player_display_name);
  }
  out.push("", ...factorLines("v2", res.adjustment, passerNames));
  if (res.adjustmentV3) out.push(...factorLines("v4", res.adjustmentV3, passerNames));
  const inTeam = res.players.filter((p) => args.team === undefined || p.team === args.team);
  const teams = [...new Set(inTeam.map((p) => p.team))].sort();
  out.push("", `Pecking orders (target share, ${XFP_MIN_GAMES}+ games; WR/TE/RB)`);
  if (teams.length === 0) out.push("  (no team matches)");
  for (const t of teams) {
    const order = peckingOrder(res.players, t);
    const line = order.map((o) => `${o.tier} ${o.player.player} ${pct(o.player.target_share)} (${o.player.games} g)`).join("; ");
    out.push(`  ${t}: ${order.length === 0 ? "(no player with enough games)" : line}`);
  }
  const pool = inTeam.filter((p) => args.position === undefined || p.position === args.position);
  const title = SORT_TITLE[sort];
  out.push("", ...rankingLines(`Rankings, overall, by ${title}`, pool, args.top, sort));
  for (const pos of args.position === undefined ? XFP_POSITIONS : [args.position]) {
    out.push("", ...rankingLines(`Rankings, ${pos}, by ${title}`, pool.filter((p) => p.position === pos), args.top, sort));
  }
  if (args.position === undefined) out.push("", ...qbReport(rows, args, prior));
  return out.join("\n");
}

// ---- Quarterbacks (#167): the same machinery over QB plays, scored in the #162 set. ----

/** Quarterbacks need this many starts to be ranked. */
export const QB_MIN_STARTS = 2;
type QbPlay = "att" | "sack" | "scr" | "run";

/** A QB play. `kind` is the adjustment class in `buildAdjustment`: "target" = the pass class (attempts, sacks, scrambles), "carry" = designed runs. */
export interface QbLook extends Look {
  play: QbPlay;
  game_id: string;
  week: number;
  /** The QB's team (posteam). */
  team: string;
}

const QB_BUCKET_ORDER: BucketKey[] = [
  ...BANDS.flatMap((b) => [`att ${b} rz`, `att ${b} of`]),
  "sack",
  "scr rz",
  "scr of",
  "run i5",
  "run 6-20",
  "run of",
];

/** Player ids whose position is QB in stats rows of the season before the week. */
export function qbIdsOf(stats: ParsedRows["stats_player"], season: number, week: number): Set<string> {
  const out = new Set<string>();
  for (const s of stats) {
    if (s.season === season && s.week < week && s.player_id !== null && s.position === "QB") out.add(s.player_id);
  }
  return out;
}

/**
 * QB plays from regular-season plays before the week, minus two-point tries, kneels and spikes. Points are
 * 0.04/pass yd, 4/pass TD, -2/INT, 0.1/rush yd, 6/rush TD, -2 per fumble lost when the fumbler is the QB.
 * A pick-six costs only the -2; a sack scores 0 apart from a lost fumble.
 */
export function extractQbLooks(plays: PlayByPlayRow[], qbs: Set<string>, season: number, week: number, onlyWeek?: number): QbLook[] {
  const out: QbLook[] = [];
  for (const p of plays) {
    if (p.season !== season || p.season_type !== "REG" || p.week >= week) continue;
    if (onlyWeek !== undefined && p.week !== onlyWeek) continue;
    if (p.two_point_attempt === 1 || p.qb_kneel === 1 || p.qb_spike === 1) continue;
    const yl = p.yardline_100;
    const redZone = yl !== null && yl <= RZ_YARDLINE;
    const zone = redZone ? "rz" : "of";
    const make = (play: QbPlay, id: string, bucket: BucketKey, points: number): void => {
      const fumble = p.fumble_lost === 1 && p.fumbled_1_player_id === id ? -2 : 0;
      out.push({
        kind: play === "run" ? "carry" : "target",
        play,
        player_id: id,
        bucket,
        points: points + fumble,
        redZone,
        defteam: p.defteam ?? null,
        passer: null,
        game_id: p.game_id,
        week: p.week,
        team: p.posteam ?? "",
      });
    };
    const passer = p.passer_player_id;
    const rusher = p.rusher_player_id;
    if (p.sack === 1 && passer !== null) {
      make("sack", passer, "sack", 0);
    } else if (p.qb_scramble === 1 && rusher !== null) {
      make("scr", rusher, `scr ${zone}`, 0.1 * (p.rushing_yards ?? 0) + (p.td_player_id === rusher ? 6 : 0));
    } else if (p.pass_attempt === 1 && p.sack !== 1 && passer !== null) {
      const pick = p.interception === 1;
      const points = 0.04 * (p.passing_yards ?? 0) + (p.pass_touchdown === 1 && !pick ? 4 : 0) - (pick ? 2 : 0);
      make("att", passer, `att ${bandOf(p.air_yards)} ${zone}`, points);
    } else if (p.rush === 1 && p.play_type === "run" && p.qb_scramble !== 1 && rusher !== null && qbs.has(rusher)) {
      make("run", rusher, `run ${yl !== null && yl <= I5_YARDLINE ? "i5" : redZone ? "6-20" : "of"}`, 0.1 * (p.rushing_yards ?? 0) + (p.td_player_id === rusher ? 6 : 0));
    }
  }
  return out;
}

/** Per game and team, the passer with the most `qb_dropback = 1` plays, ties broken by player_id (`latestStarter`'s rule). */
export function gameStarters(plays: PlayByPlayRow[], season: number, week: number): Map<string, { team: string; week: number; starter: string }> {
  const counts = new Map<string, { team: string; week: number; by: Map<string, number> }>();
  for (const p of plays) {
    if (p.season !== season || p.season_type !== "REG" || p.week >= week || p.qb_dropback !== 1 || p.passer_player_id === null || p.posteam === null) continue;
    const key = `${p.game_id} ${p.posteam}`;
    const g = counts.get(key) ?? { team: p.posteam, week: p.week, by: new Map() };
    g.by.set(p.passer_player_id, (g.by.get(p.passer_player_id) ?? 0) + 1);
    counts.set(key, g);
  }
  return new Map(
    [...counts].map(([key, g]) => {
      const top = [...g.by].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]![0];
      return [key, { team: g.team, week: g.week, starter: top }] as const;
    }),
  );
}

export interface QbPlayer {
  player_id: string;
  player: string;
  team: string;
  starts: number;
  games: number;
  v1: number;
  v2: Projection;
  v3: number | null;
  v4: Projection | null;
  actual_per_start: number;
  gap: number;
  dropbacks_per_start: number;
  rushes_per_start: number;
  rz_per_start: number;
  opponent: { team: string; away: boolean } | null;
  /** Whether he started his team's latest game (`latestStarter`); a benched or injured QB's next game is marked. */
  latest_starter: boolean;
}

export interface QbResult {
  buckets: BucketValue[];
  players: QbPlayer[];
  adjustment: Adjustment;
  v3: ValueTables | null;
  adjustmentV3: Adjustment | null;
}

export function buildQb(rows: ParsedRows, season: number, week: number, prior: ParsedRows | null = null): QbResult {
  const qbs = qbIdsOf(rows.stats_player, season, week);
  const looks = extractQbLooks(rows.play_by_play, qbs, season, week);
  const buckets = bucketValues(looks, QB_BUCKET_ORDER);
  const value = toTable(buckets);
  let v3: ValueTables | null = null;
  if (prior !== null) {
    const end = PREV_SEASON_LAST_WEEK + 1;
    const priorLooks = extractQbLooks(prior.play_by_play, qbIdsOf(prior.stats_player, season - 1, end), season - 1, end);
    v3 = withFallbacks(bucketValues(priorLooks, QB_BUCKET_ORDER), buckets);
  }
  const adj = buildAdjustment(looks, value);
  const adj3 = v3 === null ? null : buildAdjustment(looks, v3.v3);
  const startedBy = new Map<string, Set<string>>();
  for (const [key, g] of gameStarters(rows.play_by_play, season, week)) {
    const set = startedBy.get(g.starter) ?? new Set<string>();
    set.add(key.split(" ")[0]!);
    startedBy.set(g.starter, set);
  }
  const names = new Map<string, string>();
  for (const s of rows.stats_player) {
    if (s.season === season && s.week < week && s.player_id !== null && s.player_display_name !== null) names.set(s.player_id, s.player_display_name);
  }
  const byQb = new Map<string, QbLook[]>();
  for (const l of looks) byQb.set(l.player_id, [...(byQb.get(l.player_id) ?? []), l]);
  const players: QbPlayer[] = [];
  for (const [id, all] of byQb) {
    if (!qbs.has(id)) continue;
    const started = startedBy.get(id) ?? new Set<string>();
    const mine = all.filter((l) => started.has(l.game_id));
    const starts = started.size;
    const games = new Set(all.map((l) => l.game_id)).size;
    const per = (n: number): number => (starts === 0 ? 0 : n / starts);
    const sum = (table: ValueTable, a: Adjustment | null, kind?: Look["kind"]): number =>
      mine.reduce(
        (acc, l) => (kind !== undefined && l.kind !== kind ? acc : acc + (table.get(l.bucket) ?? 0) * (a === null ? 1 : defenseFactor(a, l.defteam, l.kind))),
        0,
      );
    const latest = all.reduce((a, b) => (b.week > a.week ? b : a));
    const match = opponentOf(rows, season, week, latest.team);
    const project = (table: ValueTable, a: Adjustment): Projection => ({
      retro: per(sum(table, a)),
      next:
        match === null
          ? null
          : per(sum(table, null, "target")) * defenseFactor(a, match.opponent, "target") + per(sum(table, null, "carry")) * defenseFactor(a, match.opponent, "carry"),
    });
    const v1 = per(sum(value, null));
    const actual = per(mine.reduce((acc, l) => acc + l.points, 0));
    players.push({
      player_id: id,
      player: names.get(id) ?? id,
      team: latest.team,
      starts,
      games,
      v1,
      v2: project(value, adj),
      v3: v3 === null ? null : per(sum(v3.v3, null)),
      v4: v3 === null || adj3 === null ? null : project(v3.v3, adj3),
      actual_per_start: actual,
      gap: actual - v1,
      dropbacks_per_start: per(mine.filter((l) => l.kind === "target").length),
      rushes_per_start: per(mine.filter((l) => l.play === "scr" || l.play === "run").length),
      rz_per_start: per(mine.filter((l) => l.redZone).length),
      opponent: match === null ? null : { team: match.opponent, away: match.away },
      latest_starter: latestStarter(rows.play_by_play, season, week, latest.team) === id,
    });
  }
  return { buckets, players, adjustment: adj, v3, adjustmentV3: adj3 };
}

/** The number a QB ranking sorts on; v2 and v4 sort on the next game, so a bye has no key. */
export function qbSortKey(p: QbPlayer, sort: XfpSort): number | null {
  if (sort === "v1") return p.v1;
  if (sort === "v2") return p.v2.next;
  if (sort === "v3") return p.v3;
  return p.v4?.next ?? null;
}

/** QBs with 2+ starts, highest key first; a QB with no key goes last. */
export function rankQbs(players: QbPlayer[], sort: XfpSort = "v1"): QbPlayer[] {
  const key = (p: QbPlayer): number => qbSortKey(p, sort) ?? -Infinity;
  return players.filter((p) => p.starts >= QB_MIN_STARTS).sort((a, b) => key(b) - key(a) || byId(a, b));
}

const XFP_NOTICE = (season: number, week: number): string[] => [
  `nflverse xfp quarterbacks, ${season} week ${week}, data through week ${week - 1}.`,
  "Data © the nflverse project, https://github.com/nflverse/nflverse-data, used under CC-BY 4.0. Derived values.",
];

export const QB_RANKING_HEADER =
  "  # player (team, starts, games) v1 v2-retro v2-next v3 v4-retro v4-next actual/start gap dropbacks/start rushes/start rz-plays/start next-game";

function qbFactorLines(label: string, adj: Adjustment): string[] {
  const teams = [...new Set([...adj.defense.keys()].map((k) => k.split(" ")[0]!))].sort();
  const dl = teams.map((t) => `${t} ${f2(defenseFactor(adj, t, "target"))}/${f2(defenseFactor(adj, t, "carry"))}`);
  return [`${label} defense factors (pass/run): ${dl.join("; ") || "(none)"}`];
}

const qbRow = (p: QbPlayer, prefix: string): string => {
  // With no starts there is nothing to divide by: per-start numbers print as "-", not 0.0.
  const ps = (x: number | null | undefined): string => (p.starts === 0 ? "-" : opt(x));
  const next = p.opponent === null ? "bye" : `${p.opponent.away ? "@" : "vs"} ${p.opponent.team}${p.latest_starter ? "" : ", not latest starter"}`;
  return `  ${prefix} ${p.player} (${p.team}, ${p.starts} starts, ${p.games} games) ${ps(p.v1)} ${ps(p.v2.retro)} ${ps(p.v2.next)} ${ps(p.v3)} ${ps(p.v4?.retro)} ${ps(p.v4?.next)} ${ps(p.actual_per_start)} ${p.starts === 0 ? "-" : `${p.gap >= 0 ? "+" : ""}${f1(p.gap)}`} ${ps(p.dropbacks_per_start)} ${ps(p.rushes_per_start)} ${ps(p.rz_per_start)} ${next}`;
};

/** The QB section: labels, bucket values, factors and rankings. */
export function qbReport(rows: ParsedRows, args: XfpArgs, prior: ParsedRows | null = null): string[] {
  const { season, week } = args;
  const sort = args.sort ?? "v1";
  const res = buildQb(rows, season, week, prior);
  const out = [
    "Quarterbacks. Scoring: 0.04/pass yd, 4/pass TD, -2/INT, 0.1/rush yd, 6/rush TD, -2/fumble lost by the QB. Two-point tries are excluded.",
    "v1: league-average bucket values; per start, over started games only (relief plays are left out).",
    "v2: adjusted for the defense only, no passer or quarterback-quality factor; not validated against v1",
    "v3: previous-season values, not validated against v1",
    "v4: v3's values adjusted for the defense only, not validated against v1",
    "gap = actual - v1; for a quarterback it measures his own efficiency, since v1 prices only the play, not who played it.",
    `Adjustment factors use K = ${ADJUST_K} plays; next-game numbers use the week-${week} opponent from the schedule.`,
    "",
    "QB bucket values (mean points per play, n plays)" + (res.v3 ? "; v1 | previous season v3" : ""),
  ];
  const prev = new Map((res.v3?.previous ?? []).map((b) => [b.bucket, b]));
  for (const b of res.buckets) {
    const p = prev.get(b.bucket);
    out.push(`  ${b.bucket}: ${b.value.toFixed(3)} (n=${b.n})` + (res.v3 ? ` | ${p ? `${p.value.toFixed(3)} (n=${p.n})` : "n/a (n=0), fell back to v1"}` : ""));
  }
  if (res.v3) out.push(`  v3 buckets that fell back to the current season: ${res.v3.fallbacks.join(", ") || "none"}`);
  else out.push("  v3 and v4: no previous-season data supplied, not computed");
  out.push("", ...qbFactorLines("v2", res.adjustment));
  if (res.adjustmentV3) out.push(...qbFactorLines("v4", res.adjustmentV3));
  const pool = res.players.filter((p) => args.team === undefined || p.team === args.team);
  const ranked = rankQbs(pool, sort);
  const shown = args.top === undefined ? ranked : ranked.slice(0, args.top);
  out.push("", `QB rankings, by ${SORT_TITLE[sort]} (${shown.length} of ${ranked.length} ranked; a start = the most dropbacks for his team in a game)`, QB_RANKING_HEADER);
  shown.forEach((p, i) => out.push(qbRow(p, `${i + 1}.`)));
  const rest = pool.filter((p) => p.starts < QB_MIN_STARTS).sort(byId);
  if (rest.length > 0) {
    out.push("", `Not ranked: fewer than ${QB_MIN_STARTS} starts`);
    for (const p of rest) out.push(qbRow(p, "-"));
  }
  return out;
}
