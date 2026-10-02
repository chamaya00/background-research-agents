/**
 * `nflverse-cli profile`: one receiver's role and a floor / typical / ceiling, from the weekly nflverse data.
 * Only weeks before the target week feed any number; the next game and the injury report are week W itself.
 * Players are joined to play-by-play on player_id; names only pick the player from the stats rows (ADR 0008).
 */
import type { GamesRow, ParsedRows, PlayByPlayRow, StatsPlayerRow } from "./nflverse.js";
import {
  buildEnvironment,
  buildInjuries,
  buildRedZone,
  buildTeamPace,
  buildUsage,
  halfPpr,
  nameKey,
  type EnvironmentRow,
  type RedZoneRow,
  type TeamPaceRow,
  type UsageRow,
} from "./nflverse-tables.js";

/** Heuristic constants, fixed here and tuned to no player. */
export const FLOOR_FACTOR = 0.8;
export const TYPICAL_TD_ALLOWANCE = 0.27;
export const CEILING_FACTOR = 1.2;
export const CEILING_BONUS = 6;
export const FUMBLE_LOST_POINTS = -2;

const BANDS = ["<=0", "1-9", "10-19", "20+"] as const;
type Band = (typeof BANDS)[number];
const bandOf = (airYards: number): Band => (airYards <= 0 ? "<=0" : airYards <= 9 ? "1-9" : airYards <= 19 ? "10-19" : "20+");

export interface Heuristic {
  weeks_used: number;
  points_per_target: number | null;
  floor: number | null;
  typical: number | null;
  ceiling: number | null;
}

/** Floor / typical / ceiling in half-PPR from weekly targets and points per target before touchdowns. */
export function heuristic(weeklyTargets: number[], pointsBeforeTds: number): Heuristic {
  const total = weeklyTargets.reduce((a, b) => a + b, 0);
  if (weeklyTargets.length === 0 || total === 0) {
    return { weeks_used: weeklyTargets.length, points_per_target: null, floor: null, typical: null, ceiling: null };
  }
  const ppt = pointsBeforeTds / total;
  return {
    weeks_used: weeklyTargets.length,
    points_per_target: ppt,
    floor: Math.min(...weeklyTargets) * ppt * FLOOR_FACTOR,
    typical: (total / weeklyTargets.length) * (ppt + TYPICAL_TD_ALLOWANCE),
    ceiling: Math.max(...weeklyTargets) * ppt * CEILING_FACTOR + CEILING_BONUS,
  };
}

/** Receiving and rushing yards at 0.1, receptions at 0.5, fumbles lost at -2: half-PPR without touchdowns. */
const pointsBeforeTds = (r: StatsPlayerRow): number =>
  0.5 * r.receptions +
  0.1 * (r.receiving_yards + r.rushing_yards) +
  FUMBLE_LOST_POINTS * (r.receiving_fumbles_lost + r.rushing_fumbles_lost);

export type Resolution =
  | { kind: "found"; player_id: string }
  | { kind: "none" }
  | { kind: "multiple"; candidates: { player_id: string; team: string }[] };

/** Matches a name against the display names of players with a stats row before the target week; never guesses. */
export function resolvePlayer(rows: ParsedRows, season: number, week: number, name: string): Resolution {
  const key = nameKey(name);
  const latest = new Map<string, StatsPlayerRow>();
  for (const r of rows.stats_player) {
    if (r.season !== season || r.season_type !== "REG" || r.week >= week || r.player_id === null) continue;
    if (key === "" || nameKey(r.player_display_name) !== key) continue;
    const seen = latest.get(r.player_id);
    if (!seen || r.week > seen.week) latest.set(r.player_id, r);
  }
  if (latest.size === 0) return { kind: "none" };
  if (latest.size === 1) return { kind: "found", player_id: [...latest.keys()][0]! };
  return {
    kind: "multiple",
    candidates: [...latest].map(([player_id, r]) => ({ player_id, team: r.team })).sort((a, b) => a.player_id.localeCompare(b.player_id)),
  };
}

const num = (n: number | null | undefined, dp = 1): string => (n === null || n === undefined || !Number.isFinite(n) ? "n/a" : n.toFixed(dp));
const pct = (n: number | null | undefined): string => (n === null || n === undefined || !Number.isFinite(n) ? "n/a" : `${(n * 100).toFixed(1)}%`);
const ratio = (n: number, d: number): string => `${n} of ${d} (${d > 0 ? pct(n / d) : "n/a"})`;

interface PlayCounts {
  targets: number;
  airYardsKnown: number;
  airYards: number;
  bands: Record<Band, number>;
  location: Record<string, number>;
  thirdDown: number;
  firstDowns: number;
  rushFirstDowns: number;
}

function playCounts(plays: PlayByPlayRow[], id: string): PlayCounts {
  const c: PlayCounts = {
    targets: 0,
    airYardsKnown: 0,
    airYards: 0,
    bands: { "<=0": 0, "1-9": 0, "10-19": 0, "20+": 0 },
    location: { left: 0, middle: 0, right: 0, unknown: 0 },
    thirdDown: 0,
    firstDowns: 0,
    rushFirstDowns: 0,
  };
  for (const p of plays) {
    if (p.pass === 1 && p.receiver_player_id === id) {
      c.targets += 1;
      if (p.air_yards !== null) {
        c.airYardsKnown += 1;
        c.airYards += p.air_yards;
        c.bands[bandOf(p.air_yards)] += 1;
      }
      const loc = p.pass_location;
      c.location[loc === "left" || loc === "middle" || loc === "right" ? loc : "unknown"]! += 1;
      if (p.down === 3) c.thirdDown += 1;
      if (p.first_down === 1) c.firstDowns += 1;
    }
    if (p.rush === 1 && p.rusher_player_id === id && p.first_down === 1) c.rushFirstDowns += 1;
  }
  return c;
}

const teamThirdDownTargets = (plays: PlayByPlayRow[], team: string): number =>
  plays.filter((p) => p.posteam === team && p.pass === 1 && p.receiver_player_id !== null && p.down === 3).length;

export interface FormatInput {
  usage: UsageRow;
  rows: ParsedRows;
  season: number;
  week: number;
  playsBefore: PlayByPlayRow[];
  allUsage: UsageRow[];
  redZone: RedZoneRow[];
  pace: TeamPaceRow[];
  environment: EnvironmentRow[];
}

function formatProfile(i: FormatInput): string[] {
  const { usage, season, week } = i;
  const id = usage.player_id;
  const team = usage.team;
  const mine = i.rows.stats_player
    .filter((r) => r.season === season && r.season_type === "REG" && r.week < week && r.player_id === id)
    .sort((a, b) => a.week - b.week);
  const out: string[] = [];
  out.push(`== ${usage.player} (${usage.position || "?"}, ${team}) - player_id ${id} ==`);
  out.push(`Uses regular-season weeks 1..${week - 1} only; ${mine.length} game(s) played.`);
  if (!mine.some((r) => r.week === week - 1)) {
    out.push(`No game row in week ${week - 1} (bye, inactive or not on a roster): nothing for that week below.`);
  }
  const u = usage.pooled;

  // Role.
  const wrs = i.allUsage.filter((o) => o.team === team && o.position === "WR");
  const better = wrs.filter((o) => (o.pooled.target_share ?? -1) > (u.target_share ?? -1)).length;
  out.push("", "Role");
  out.push(
    `  Target share: ${pct(u.target_share)}; rank among team WRs: ${u.target_share === null || usage.position !== "WR" ? `n/a (${usage.position || "?"}, not a WR)` : `${better + 1} of ${wrs.length}`}`,
  );
  out.push(`  Targets over team targets: ${ratio(u.targets, u.team_targets)}`);
  out.push(`  Air-yard share: ${pct(u.air_yards_share)} (${num(u.air_yards, 0)} of ${num(u.team_air_yards, 0)})`);
  out.push(`  Snap share, overall: ${pct(u.snap_share)}${u.snap_unmatched_games > 0 ? ` (${u.snap_unmatched_games} game(s) with no snap match, left out)` : ""}`);

  // Weekly.
  out.push("", "By week (targets / team share / line / half-PPR points / snap share)");
  if (mine.length === 0) out.push("  (no games)");
  for (const r of mine) {
    const wk = buildUsage(i.rows, season, r.week + 1).find((x) => x.player_id === id)?.last_week;
    const line = `${r.receptions}/${r.targets} ${num(r.receiving_yards, 0)} yd ${r.receiving_tds} TD` +
      (r.carries > 0 ? `; ${r.carries} car ${num(r.rushing_yards, 0)} yd ${r.rushing_tds} TD` : "");
    out.push(
      `  Week ${r.week}: ${r.targets} tgt, ${wk ? pct(wk.target_share) : "n/a"} of team, ${line}, ${num(halfPpr(r), 1)} pts, snaps ${wk ? pct(wk.snap_share) : "n/a"}`,
    );
  }

  // Play by play.
  const pc = playCounts(i.playsBefore, id);
  out.push("", "Targets (play-by-play, joined on player_id)");
  out.push(`  aDOT: ${pc.airYardsKnown > 0 ? num(pc.airYards / pc.airYardsKnown, 1) : "n/a"} (${pc.airYardsKnown} of ${pc.targets} targets with air yards)`);
  out.push(`  By depth band: ${BANDS.map((b) => `${b}: ${pc.bands[b]}`).join(", ")}`);
  out.push(`  Pass location: left ${pc.location.left}, middle ${pc.location.middle}, right ${pc.location.right}${pc.location.unknown ? `, unknown ${pc.location.unknown}` : ""}`);
  out.push(`  Third-down targets: ${pc.thirdDown} against the team's ${teamThirdDownTargets(i.playsBefore, team)}`);
  const rec = mine.reduce((a, r) => a + r.receptions, 0);
  const recYds = mine.reduce((a, r) => a + r.receiving_yards, 0);
  out.push(`  Catch rate: ${u.targets > 0 ? pct(rec / u.targets) : "n/a"}`);
  out.push(`  First downs: ${pc.firstDowns} receiving, ${pc.rushFirstDowns} rushing`);
  out.push(`  Yards per target: ${u.targets > 0 ? num(recYds / u.targets, 2) : "n/a"}`);

  // Red zone.
  const rz = i.redZone.find((r) => r.player_id === id);
  out.push(
    `  Red-zone targets: ${rz?.rz_targets ?? 0} against the team's ${rz?.team_rz_targets ?? "n/a"}; red-zone carries: ${rz?.rz_carries ?? 0} against the team's ${rz?.team_rz_carries ?? "n/a"}`,
  );

  // Team.
  out.push("", `Team ${team}`);
  const top = i.allUsage
    .filter((o) => o.team === team)
    .sort((a, b) => (b.pooled.target_share ?? -1) - (a.pooled.target_share ?? -1) || a.player_id.localeCompare(b.player_id))
    .slice(0, 4);
  out.push(`  Top pass-catchers by target share: ${top.map((o) => `${o.player} ${pct(o.pooled.target_share)} (${o.games} g)`).join("; ")}`);
  const pace = i.pace.find((p) => p.team === team);
  out.push(
    pace
      ? `  Plays per game: ${num(pace.plays_per_game, 1)}; pass rate: ${pct(pace.pass_rate)}; pass rate over expected: ${num(pace.pass_rate_over_expected, 1)} (percentage points, nflverse pass_oe)`
      : "  Plays per game / pass rate: n/a (no plays before this week)",
  );

  // Next game.
  out.push("", `Next game (week ${week})`);
  const env = i.environment.find((e) => e.home_team === team || e.away_team === team);
  if (!env) {
    out.push("  No game for this team in this week (bye, or schedule not published).");
  } else {
    const home = env.home_team === team;
    const spread = env.spread_line === null ? null : home ? env.spread_line : -env.spread_line;
    out.push(`  Opponent: ${home ? env.away_team : env.home_team} (${home ? "home" : "away"}); roof: ${env.roof ?? "n/a"}`);
    out.push(`  Total: ${num(env.total_line)}; implied team total: ${num(home ? env.home_implied_total : env.away_implied_total)}`);
    out.push(
      `  Spread: ${num(spread)} for ${team} (convention: nflverse spread_line is positive when the home team is favored, raw ${num(env.spread_line)}; printed here from ${team}'s side, positive = ${team} favored, negative = ${team} an underdog)`,
    );
  }
  const inj = buildInjuries(i.rows.injuries, season, week).find((r) => r.gsis_id === id);
  out.push(
    `  Injury report: ${inj ? `${inj.report_status ?? "no game status"}; practice: ${inj.practice_status ?? "n/a"}${inj.report_primary_injury ? `; ${inj.report_primary_injury}` : ""}` : "not on the week's report"}`,
  );

  // Heuristic.
  const h = heuristic(mine.map((r) => r.targets), mine.reduce((a, r) => a + pointsBeforeTds(r), 0));
  out.push("", "Floor / typical / ceiling, half-PPR (heuristic, not a model)");
  out.push(`  Weeks used: ${h.weeks_used}`);
  if (h.points_per_target === null) {
    out.push("  No targets in the weeks used: points per target cannot be worked out, so floor, typical and ceiling are n/a.");
  } else {
    out.push(`  Points per target before TDs (receiving and rushing, fumbles lost -2): ${num(h.points_per_target, 3)}`);
    out.push(`  Floor ${num(h.floor)}  Typical ${num(h.typical)}  Ceiling ${num(h.ceiling)}`);
  }
  return out;
}

/** Builds the text printed for the named players; a name that is not exactly one player says so and the rest still print. */
export function profileReport(rows: ParsedRows, season: number, week: number, names: string[]): string {
  const prior = (p: PlayByPlayRow): boolean => p.season === season && p.season_type === "REG" && p.week < week;
  const playsBefore = rows.play_by_play.filter(prior);
  const allUsage = buildUsage(rows, season, week);
  const redZone = buildRedZone(rows.play_by_play, season, week);
  const pace = buildTeamPace(rows.play_by_play, season, week);
  const gamesThisWeek: GamesRow[] = rows.games;
  const environment = buildEnvironment(gamesThisWeek, season, week, "");
  const blocks: string[] = [];
  for (const name of names) {
    const res = resolvePlayer(rows, season, week, name);
    if (res.kind === "none") {
      blocks.push(`"${name}": no player by that name has a regular-season game before week ${week} in ${season}. Not guessed.`);
    } else if (res.kind === "multiple") {
      blocks.push(
        `"${name}": matches more than one player (${res.candidates.map((c) => `${c.player_id} on ${c.team}`).join("; ")}). Not guessed; use the exact name of one.`,
      );
    } else {
      const usage = allUsage.find((u) => u.player_id === res.player_id)!;
      blocks.push(formatProfile({ usage, rows, season, week, playsBefore, allUsage, redZone, pace, environment }).join("\n"));
    }
  }
  const head = [
    `nflverse profile, ${season} week ${week}, data through week ${week - 1}.`,
    "Data © the nflverse project, https://github.com/nflverse/nflverse-data, used under CC-BY 4.0. Derived values; snap counts originate at Pro-Football-Reference.",
  ];
  return [...head, "", blocks.join("\n\n")].join("\n");
}
