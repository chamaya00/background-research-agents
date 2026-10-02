/**
 * `nflverse-cli xfp`: expected fantasy points (v1) from league-average bucket values (#163).
 * Only regular-season weeks before the target week feed any number (ADR 0008). Plays are joined to
 * players on player_id; v1 has no opponent or quarterback adjustment.
 */
import type { ParsedRows, PlayByPlayRow } from "./nflverse.js";
import { buildUsage } from "./nflverse-tables.js";

export const XFP_POSITIONS = ["WR", "TE", "RB"] as const;
export type XfpPosition = (typeof XFP_POSITIONS)[number];
/** Games before the week a player needs to be ranked or placed in a pecking order. */
export const XFP_MIN_GAMES = 2;
/** The leader is a clear 1 when this many share points ahead of the next player. */
export const CLEAR_LEAD_POINTS = 5;
const RZ_YARDLINE = 20;
const I5_YARDLINE = 5;

export interface XfpArgs {
  season: number;
  week: number;
  position?: XfpPosition;
  team?: string;
  top?: number;
}

/** Strict parse of the flags after `xfp`; null for anything unknown, repeated, missing or malformed. */
export function parseXfpArgs(rest: string[]): XfpArgs | null {
  if (rest.length % 2 !== 0) return null;
  const f = new Map<string, string>();
  for (let i = 0; i < rest.length; i += 2) {
    if (f.has(rest[i]!) || !["--season", "--week", "--position", "--team", "--top"].includes(rest[i]!)) return null;
    f.set(rest[i]!, rest[i + 1]!);
  }
  const season = f.get("--season");
  const week = f.get("--week");
  if (season === undefined || !/^\d{4}$/.test(season) || week === undefined || !/^\d{1,2}$/.test(week) || Number(week) < 2) return null;
  const out: XfpArgs = { season: Number(season), week: Number(week) };
  const position = f.get("--position");
  if (position !== undefined) {
    if (!(XFP_POSITIONS as readonly string[]).includes(position)) return null;
    out.position = position as XfpPosition;
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
}

/** Targets and carries from regular-season plays before the week, minus two-point tries, kneels and spikes. */
export function extractLooks(plays: PlayByPlayRow[], season: number, week: number): Look[] {
  const out: Look[] = [];
  for (const p of plays) {
    if (p.season !== season || p.season_type !== "REG" || p.week >= week) continue;
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
      });
    } else if (p.rush === 1 && p.rusher_player_id !== null && p.play_type === "run") {
      const id = p.rusher_player_id;
      out.push({
        kind: "carry",
        player_id: id,
        bucket: `car ${yl !== null && yl <= I5_YARDLINE ? "i5" : redZone ? "6-20" : "of"}`,
        points: 0.1 * (p.rushing_yards ?? 0) + (p.td_player_id === id ? 6 : 0),
        redZone,
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
export function bucketValues(looks: Look[]): BucketValue[] {
  const acc = new Map<BucketKey, { sum: number; n: number }>();
  for (const l of looks) {
    const a = acc.get(l.bucket) ?? { sum: 0, n: 0 };
    a.sum += l.points;
    a.n += 1;
    acc.set(l.bucket, a);
  }
  return BUCKET_ORDER.filter((b) => acc.has(b)).map((bucket) => {
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

export interface Tiered {
  tier: string;
  player: XfpPlayer;
}

export interface XfpResult {
  buckets: BucketValue[];
  players: XfpPlayer[];
}

export function buildXfp(rows: ParsedRows, season: number, week: number): XfpResult {
  const looks = extractLooks(rows.play_by_play, season, week);
  const buckets = bucketValues(looks);
  const value = new Map(buckets.map((b) => [b.bucket, b.value]));
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
  const players: XfpPlayer[] = [];
  for (const u of buildUsage(rows, season, week)) {
    if (!(XFP_POSITIONS as readonly string[]).includes(u.position) || u.games === 0) continue;
    const a = byPlayer.get(u.player_id) ?? { t: 0, c: 0, rz: 0, exp: 0, act: 0 };
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
    });
  }
  return { buckets, players };
}

const byId = (a: XfpPlayer, b: XfpPlayer): number => a.player_id.localeCompare(b.player_id);

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

/** Players with 2+ games, highest xFP/g first. */
export function rank(players: XfpPlayer[]): XfpPlayer[] {
  return players.filter((p) => p.games >= XFP_MIN_GAMES).sort((a, b) => b.xfp_per_game - a.xfp_per_game || byId(a, b));
}

const f1 = (n: number): string => n.toFixed(1);
const pct = (n: number | null): string => (n === null ? "n/a" : `${(n * 100).toFixed(1)}%`);

function rankingLines(title: string, pool: XfpPlayer[], top: number | undefined): string[] {
  const ranked = rank(pool);
  const left = pool.length - ranked.length;
  const shown = top === undefined ? ranked : ranked.slice(0, top);
  const out = [`${title} (${shown.length} of ${ranked.length} ranked; ${left} left out with fewer than ${XFP_MIN_GAMES} games)`];
  out.push("  # player (team pos, games) xFP/g actual/g diff tgt-share tgt/g car/g rz-looks");
  shown.forEach((p, i) =>
    out.push(
      `  ${i + 1}. ${p.player} (${p.team} ${p.position}, ${p.games} g) ${f1(p.xfp_per_game)} ${f1(p.actual_per_game)} ${p.diff >= 0 ? "+" : ""}${f1(p.diff)} ${pct(p.target_share)} ${f1(p.targets_per_game)} ${f1(p.carries_per_game)} ${p.rz_looks}`,
    ),
  );
  return out;
}

export function xfpReport(rows: ParsedRows, args: XfpArgs): string {
  const { season, week } = args;
  const res = buildXfp(rows, season, week);
  const out = [
    `nflverse xfp v1, ${season} week ${week}, data through week ${week - 1}.`,
    "Data © the nflverse project, https://github.com/nflverse/nflverse-data, used under CC-BY 4.0. Derived values.",
    "Expected points use league-average bucket values; no opponent or quarterback adjustment. Half-PPR.",
    "",
    "Bucket values (mean half-PPR per play, n plays)",
    ...res.buckets.map((b) => `  ${b.bucket}: ${b.value.toFixed(3)} (n=${b.n})`),
  ];
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
  out.push("", ...rankingLines("Rankings, overall, by xFP/g", pool, args.top));
  for (const pos of args.position === undefined ? XFP_POSITIONS : [args.position]) {
    out.push("", ...rankingLines(`Rankings, ${pos}, by xFP/g`, pool.filter((p) => p.position === pos), args.top));
  }
  return out.join("\n");
}
