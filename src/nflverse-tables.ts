import type { FetchedInput, GamesRow, InputRecord, InjuriesRow, ParsedRows, StatsPlayerRow } from "./nflverse.js";

export const ATTRIBUTION = {
  source: "nflverse",
  url: "https://github.com/nflverse/nflverse-data",
  license: "CC-BY 4.0",
  notice: "Data © the nflverse project, used under CC-BY 4.0. Derived values; snap counts originate at Pro-Football-Reference.",
};

export interface Provenance {
  attribution: typeof ATTRIBUTION;
  inputs: InputRecord[];
}

export interface Usage {
  targets: number;
  team_targets: number;
  target_share: number | null;
  air_yards: number;
  team_air_yards: number;
  air_yards_share: number | null;
  carries: number;
  team_carries: number;
  rush_share: number | null;
  snaps: number;
  team_snaps: number;
  snap_share: number | null;
  receptions: number;
  half_ppr_points: number;
}

export interface UsageRow {
  player_id: string;
  player: string;
  position: string;
  team: string;
  games: number;
  pooled: Usage;
  last_week: Usage & { week: number };
}

export interface PointsAllowedRow {
  defense: string;
  position: "QB" | "RB" | "WR" | "TE";
  games: number;
  points_allowed: number;
  per_game: number;
  rank: number;
}

export interface EnvironmentRow {
  game_id: string;
  week: number;
  home_team: string;
  away_team: string;
  spread_line: number | null;
  total_line: number | null;
  home_implied_total: number | null;
  away_implied_total: number | null;
  roof: string | null;
  games_read_at: string;
}

export interface InjuryRow {
  team: string;
  gsis_id: string;
  player: string | null;
  report_status: string | null;
  practice_status: string | null;
  report_primary_injury: string | null;
}

export interface Tables {
  usage: UsageRow[];
  pointsAllowed: PointsAllowedRow[];
  environment: EnvironmentRow[];
  injuries: InjuryRow[];
}

const POSITIONS = ["QB", "RB", "WR", "TE"] as const;

/** (fantasy_points + fantasy_points_ppr) / 2: half a point per reception. */
export const halfPpr = (r: Pick<StatsPlayerRow, "fantasy_points" | "fantasy_points_ppr">): number =>
  (r.fantasy_points + r.fantasy_points_ppr) / 2;

/** Snap counts say "Harold Fannin", stats say "Harold Fannin Jr.": compare names without case, punctuation or suffix. */
export const nameKey = (name: string | null): string =>
  (name ?? "")
    .toLowerCase()
    .replace(/[^a-z ]/g, "")
    .split(" ")
    .filter((w) => w !== "" && !["jr", "sr", "ii", "iii", "iv", "v"].includes(w))
    .join(" ");

const round = (n: number, dp = 4): number => Math.round(n * 10 ** dp) / 10 ** dp;
const share = (n: number, d: number): number | null => (d > 0 ? round(n / d) : null);

/** Team total per (game_id, team), summed over that team's rows in that game. */
function sumBy(rows: StatsPlayerRow[], pick: (r: StatsPlayerRow) => number): Map<string, number> {
  const out = new Map<string, number>();
  for (const r of rows) {
    const key = `${r.game_id}|${r.team}`;
    out.set(key, (out.get(key) ?? 0) + pick(r));
  }
  return out;
}

/** Regular-season rows of weeks before the target week only: nothing from week W leaks in. */
function priorRows(stats: StatsPlayerRow[], season: number, week: number): StatsPlayerRow[] {
  return stats.filter((r) => r.season === season && r.season_type === "REG" && r.week < week);
}

export function buildUsage(rows: ParsedRows, season: number, week: number): UsageRow[] {
  const prior = priorRows(rows.stats_player, season, week);
  const teamTargets = sumBy(prior, (r) => r.targets);
  const teamAir = sumBy(prior, (r) => r.receiving_air_yards);
  const teamCarries = sumBy(prior, (r) => r.carries);

  // Team snaps for a game: the maximum offense_snaps among that team's rows.
  const teamSnaps = new Map<string, number>();
  const snapsByPlayer = new Map<string, number>();
  for (const s of rows.snap_counts) {
    if (s.week >= week || !s.game_id.startsWith(`${season}_`)) continue;
    const tk = `${s.game_id}|${s.team}`;
    teamSnaps.set(tk, Math.max(teamSnaps.get(tk) ?? 0, s.offense_snaps));
    // The join to stats is by name: snap counts carry no gsis player id.
    snapsByPlayer.set(`${tk}|${nameKey(s.player)}`, s.offense_snaps);
  }

  const byPlayer = new Map<string, StatsPlayerRow[]>();
  for (const r of prior) {
    if (r.player_id === null) continue;
    byPlayer.set(r.player_id, [...(byPlayer.get(r.player_id) ?? []), r]);
  }

  const usageOf = (games: StatsPlayerRow[]): Usage => {
    const u = { t: 0, tt: 0, a: 0, ta: 0, c: 0, tc: 0, s: 0, ts: 0, rec: 0, pts: 0 };
    for (const r of games) {
      const tk = `${r.game_id}|${r.team}`;
      u.t += r.targets;
      u.tt += teamTargets.get(tk) ?? 0;
      u.a += r.receiving_air_yards;
      u.ta += teamAir.get(tk) ?? 0;
      u.c += r.carries;
      u.tc += teamCarries.get(tk) ?? 0;
      u.s += snapsByPlayer.get(`${tk}|${nameKey(r.player_display_name)}`) ?? 0;
      u.ts += teamSnaps.get(tk) ?? 0;
      u.rec += r.receptions;
      u.pts += halfPpr(r);
    }
    return {
      targets: u.t,
      team_targets: u.tt,
      target_share: share(u.t, u.tt),
      air_yards: u.a,
      team_air_yards: u.ta,
      air_yards_share: share(u.a, u.ta),
      carries: u.c,
      team_carries: u.tc,
      rush_share: share(u.c, u.tc),
      snaps: u.s,
      team_snaps: u.ts,
      snap_share: share(u.s, u.ts),
      receptions: u.rec,
      half_ppr_points: round(u.pts, 2),
    };
  };

  const out: UsageRow[] = [];
  for (const [id, games] of byPlayer) {
    const latest = games.reduce((a, b) => (b.week > a.week ? b : a));
    // Last week alone is week W-1; all zeros when the player has no row then (bye, inactive).
    const lastGames = games.filter((g) => g.week === week - 1);
    out.push({
      player_id: id,
      player: latest.player_display_name ?? id,
      position: latest.position ?? "",
      team: latest.team,
      games: games.length,
      pooled: usageOf(games),
      last_week: { week: week - 1, ...usageOf(lastGames) },
    });
  }
  return out.sort((a, b) => a.player_id.localeCompare(b.player_id));
}

export function buildPointsAllowed(rows: ParsedRows, season: number, week: number): PointsAllowedRow[] {
  const prior = priorRows(rows.stats_player, season, week);
  // A defense's games are every game it appears in, so a game with no rows at a position counts as 0.
  const gamesOf = new Map<string, Set<string>>();
  for (const r of prior) {
    const set = gamesOf.get(r.opponent_team) ?? new Set<string>();
    set.add(r.game_id);
    gamesOf.set(r.opponent_team, set);
  }
  const out: PointsAllowedRow[] = [];
  for (const position of POSITIONS) {
    const forPosition: PointsAllowedRow[] = [];
    for (const [defense, games] of gamesOf) {
      const pts = prior
        .filter((r) => r.opponent_team === defense && r.position === position && r.player_id !== null)
        .reduce((sum, r) => sum + halfPpr(r), 0);
      forPosition.push({
        defense,
        position,
        games: games.size,
        points_allowed: round(pts, 2),
        per_game: round(pts / games.size, 2),
        rank: 0,
      });
    }
    forPosition.sort((a, b) => b.per_game - a.per_game || a.defense.localeCompare(b.defense));
    forPosition.forEach((r, i) => {
      r.rank = i > 0 && forPosition[i - 1]!.per_game === r.per_game ? forPosition[i - 1]!.rank : i + 1;
    });
    out.push(...forPosition);
  }
  return out;
}

/** Half-PPR points a defense allowed at one position, per week before the target week. */
export function pointsAllowedByWeek(
  stats: StatsPlayerRow[],
  defense: string,
  position: string,
  week: number,
): Map<number, number> {
  const out = new Map<number, number>();
  for (const r of stats) {
    if (r.week >= week || r.opponent_team !== defense || r.position !== position || r.player_id === null) continue;
    out.set(r.week, (out.get(r.week) ?? 0) + halfPpr(r));
  }
  return out;
}

export function buildEnvironment(
  games: GamesRow[],
  season: number,
  week: number,
  gamesReadAt: string,
): EnvironmentRow[] {
  return games
    .filter((g) => g.season === season && g.week === week)
    .map((g) => {
      const both = g.spread_line !== null && g.total_line !== null;
      // Positive spread_line means the home team is favored.
      return {
        game_id: g.game_id,
        week: g.week,
        home_team: g.home_team,
        away_team: g.away_team,
        spread_line: g.spread_line,
        total_line: g.total_line,
        home_implied_total: both ? (g.total_line! + g.spread_line!) / 2 : null,
        away_implied_total: both ? (g.total_line! - g.spread_line!) / 2 : null,
        roof: g.roof,
        games_read_at: gamesReadAt,
      };
    });
}

export function buildInjuries(injuries: InjuriesRow[], season: number, week: number): InjuryRow[] {
  return injuries
    .filter((i) => i.season === season && i.week === week)
    .map((i) => ({
      team: i.team,
      gsis_id: i.gsis_id,
      player: i.full_name,
      report_status: i.report_status,
      practice_status: i.practice_status,
      report_primary_injury: i.report_primary_injury,
    }));
}

export function buildTables(inputs: FetchedInput[], rows: ParsedRows, season: number, week: number): Tables {
  const gamesInput = inputs.find((i) => i.file === "games");
  return {
    usage: buildUsage(rows, season, week),
    pointsAllowed: buildPointsAllowed(rows, season, week),
    environment: buildEnvironment(rows.games, season, week, gamesInput?.fetchedAt ?? ""),
    injuries: buildInjuries(rows.injuries, season, week),
  };
}

export function provenance(inputs: InputRecord[]): Provenance {
  return {
    attribution: ATTRIBUTION,
    inputs: inputs.map(({ file, url, fetchedAt, sha256 }) => ({ file, url, fetchedAt, sha256 })),
  };
}
