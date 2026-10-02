import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import {
  collectInputs,
  nflverseUrls,
  SEEN_ID_COLUMNS,
  type FetchLike,
  type GamesRow,
  type NflverseFile,
  type ParsedRows,
  type PlayByPlayRow,
  type StatsPlayerRow,
} from "../src/nflverse.js";
import { run } from "../src/nflverse-cli.js";
import { heuristic, profileReport } from "../src/nflverse-profile.js";

// Every player below is invented; no real name or id appears in this file.
const stat = (o: Partial<StatsPlayerRow> & Pick<StatsPlayerRow, "player_id" | "player_display_name" | "week" | "team">): StatsPlayerRow => ({
  position: "WR",
  season: 2026,
  season_type: "REG",
  game_id: `2026_0${o.week}_${o.team}`,
  opponent_team: "BBB",
  carries: 0,
  rushing_yards: 0,
  rushing_tds: 0,
  targets: 0,
  receptions: 0,
  receiving_yards: 0,
  receiving_tds: 0,
  receiving_air_yards: 0,
  receiving_2pt_conversions: 0,
  rushing_2pt_conversions: 0,
  receiving_fumbles_lost: 0,
  rushing_fumbles_lost: 0,
  passing_yards: 0,
  passing_tds: 0,
  passing_interceptions: 0,
  fantasy_points: 0,
  fantasy_points_ppr: 0,
  target_share: null,
  air_yards_share: null,
  ...o,
});

const seen = Object.fromEntries(SEEN_ID_COLUMNS.map((c) => [c, null])) as Record<(typeof SEEN_ID_COLUMNS)[number], null>;
const play = (o: Partial<PlayByPlayRow>): PlayByPlayRow => ({
  ...seen,
  complete_pass: null,
  sack: null,
  touchdown: null,
  air_yards: null,
  pass_location: null,
  first_down: null,
  game_id: "2026_01_AAA",
  season: 2026,
  season_type: "REG",
  week: 1,
  posteam: "AAA",
  play_type: "pass",
  pass: 1,
  rush: 0,
  yardline_100: 60,
  two_point_attempt: 0,
  qb_kneel: 0,
  qb_spike: 0,
  down: 1,
  wp: 0.5,
  pass_oe: 0,
  receiver_player_id: null,
  receiver_player_name: null,
  rusher_player_id: null,
  rusher_player_name: null,
  ...o,
});

const game = (week: number, home: string, away: string, spread: number): GamesRow => ({
  game_id: `2026_0${week}_${away}_${home}`,
  season: 2026,
  week,
  gameday: "2026-10-04",
  gametime: null,
  home_team: home,
  away_team: away,
  home_score: null,
  away_score: null,
  spread_line: spread,
  total_line: 44,
  roof: "outdoors",
});

const FIX = "FIX00001";
const ZERO = "ZER00001";
const BYE = "BYE00001";
const AWAY = "AWY00001";

const baseRows = (): ParsedRows => {
  const wr = [
    // Targets 4, 8, 6; receptions 3, 5, 4; yards 30, 70, 40; one fumble lost in week 2.
    stat({ player_id: FIX, player_display_name: "Alex Fixture", week: 1, team: "AAA", targets: 4, receptions: 3, receiving_yards: 30 }),
    stat({ player_id: FIX, player_display_name: "Alex Fixture", week: 2, team: "AAA", targets: 8, receptions: 5, receiving_yards: 70, receiving_fumbles_lost: 1 }),
    stat({ player_id: FIX, player_display_name: "Alex Fixture", week: 3, team: "AAA", targets: 6, receptions: 4, receiving_yards: 40 }),
  ];
  const others = [1, 2, 3].flatMap((week) => [
    stat({ player_id: "OTH00001", player_display_name: "Bo Sample", week, team: "AAA", targets: 5, receptions: 2, receiving_yards: 20 }),
    stat({ player_id: ZERO, player_display_name: "Eve Zero", week, team: "AAA", position: "TE" }),
    stat({ player_id: "DUP00001", player_display_name: "Cy Dup", week, team: "AAA", targets: 1 }),
    stat({ player_id: "DUP00002", player_display_name: "Cy Dup", week, team: "BBB", targets: 1, opponent_team: "AAA" }),
    stat({ player_id: AWAY, player_display_name: "Dee Away", week, team: "BBB", targets: 7, receptions: 4, receiving_yards: 50, opponent_team: "AAA" }),
  ]);
  const bye = [1, 2].map((week) => stat({ player_id: BYE, player_display_name: "Fay Bye", week, team: "CCC", targets: 3, receptions: 2, receiving_yards: 20 }));
  const plays = [
    // The play-by-play name is abbreviated: only receiver_player_id ties it to the player.
    play({ week: 1, receiver_player_id: FIX, receiver_player_name: "A.Fixture", air_yards: -2, pass_location: "left", down: 3 }),
    play({ week: 1, receiver_player_id: FIX, receiver_player_name: "A.Fixture", air_yards: 5, pass_location: "middle", first_down: 1 }),
    play({ week: 2, receiver_player_id: FIX, receiver_player_name: "A.Fixture", air_yards: 15, pass_location: "right" }),
    play({ week: 2, receiver_player_id: FIX, receiver_player_name: "A.Fixture", air_yards: 25, pass_location: "right", yardline_100: 12 }),
    play({ week: 3, receiver_player_id: "OTH00001", receiver_player_name: "B.Sample", air_yards: 8, pass_location: "left", down: 3 }),
  ];
  return {
    stats_player: [...wr, ...others, ...bye],
    snap_counts: [],
    injuries: [{ season: 2026, week: 4, team: "AAA", gsis_id: FIX, full_name: "Alex Fixture", report_status: "Questionable", practice_status: "Limited", report_primary_injury: "Knee" }],
    games: [game(4, "AAA", "BBB", 3)],
    play_by_play: plays,
  };
};

const report = (rows: ParsedRows, names: string[], week = 4): string => profileReport(rows, 2026, week, names);

describe("heuristic", () => {
  it("computes floor, typical and ceiling from hand-worked numbers", () => {
    // Points before TDs: 12 receptions x 0.5 + 140 yards x 0.1 - 2 = 18 over 18 targets = 1.0 a target.
    const h = heuristic([4, 8, 6], 18);
    expect(h.weeks_used).toBe(3);
    expect(h.points_per_target).toBeCloseTo(1, 10);
    expect(h.floor).toBeCloseTo(3.2, 10); // 4 x 1.0 x 0.8
    expect(h.typical).toBeCloseTo(7.62, 10); // 6 x (1.0 + 0.27)
    expect(h.ceiling).toBeCloseTo(15.6, 10); // 8 x 1.0 x 1.2 + 6
  });

  it("prints the same three numbers for the fixture player, labelled and with the weeks used", () => {
    const text = report(baseRows(), ["Alex Fixture"]);
    expect(text).toContain("heuristic, not a model");
    expect(text).toContain("Weeks used: 3");
    expect(text).toContain("Floor 3.2  Typical 7.6  Ceiling 15.6");
  });

  it("counts rushing in points per target", () => {
    const rows = baseRows();
    rows.stats_player[0] = { ...rows.stats_player[0]!, carries: 2, rushing_yards: 10 };
    // One more point over 18 targets.
    expect(report(rows, ["Alex Fixture"])).toContain("Points per target before TDs (receiving and rushing, fumbles lost -2): 1.056");
  });
});

describe("only weeks before the target week", () => {
  it("changes no printed number when week-W and later rows are added", () => {
    const before = report(baseRows(), ["Alex Fixture", "Bo Sample"]);
    const rows = baseRows();
    const later = (week: number) => [
      stat({ player_id: FIX, player_display_name: "Alex Fixture", week, team: "AAA", targets: 20, receptions: 15, receiving_yards: 300, receiving_air_yards: 200 }),
      stat({ player_id: "OTH00001", player_display_name: "Bo Sample", week, team: "AAA", targets: 1 }),
    ];
    rows.stats_player.push(...later(4), ...later(5));
    rows.play_by_play.push(
      play({ week: 4, receiver_player_id: FIX, air_yards: 40, pass_location: "left", down: 3, first_down: 1, yardline_100: 5 }),
      play({ week: 5, receiver_player_id: FIX, air_yards: 40, pass_location: "left", down: 3, first_down: 1, yardline_100: 5 }),
    );
    rows.snap_counts.push({ game_id: "2026_04_AAA", player: "Alex Fixture", pfr_player_id: "x", position: "WR", team: "AAA", opponent: "BBB", week: 4, offense_snaps: 70, offense_pct: 1 });
    expect(report(rows, ["Alex Fixture", "Bo Sample"])).toBe(before);
  });
});

describe("play-by-play join", () => {
  it("counts targets of a player whose play-by-play name is abbreviated, on player_id", () => {
    const text = report(baseRows(), ["Alex Fixture"]);
    expect(text).toContain("By depth band: <=0: 1, 1-9: 1, 10-19: 1, 20+: 1");
    expect(text).toContain("Pass location: left 1, middle 1, right 2");
    expect(text).toContain("aDOT: 10.8 (4 of 4 targets with air yards)");
    expect(text).toContain("Third-down targets: 1 against the team's 2");
    expect(text).toContain("Red-zone targets: 1 against the team's 1");
  });

  it("does not join on name: a play with the player's full name and another id is not counted", () => {
    const rows = baseRows();
    rows.play_by_play.push(play({ week: 3, receiver_player_id: "OTH00001", receiver_player_name: "Alex Fixture", air_yards: 30 }));
    expect(report(rows, ["Alex Fixture"])).toContain("By depth band: <=0: 1, 1-9: 1, 10-19: 1, 20+: 1");
  });
});

describe("spread convention", () => {
  it("prints the home player's side as positive when the home team is favored", () => {
    const text = report(baseRows(), ["Alex Fixture"]);
    expect(text).toContain("Opponent: BBB (home)");
    expect(text).toContain("Spread: 3.0 for AAA");
    expect(text).toContain("positive = AAA favored");
    expect(text).toContain("implied team total: 23.5");
  });

  it("flips the sign for an away player", () => {
    const text = report(baseRows(), ["Dee Away"]);
    expect(text).toContain("Opponent: AAA (away)");
    expect(text).toContain("Spread: -3.0 for BBB");
    expect(text).toContain("raw 3.0");
    expect(text).toContain("implied team total: 20.5");
  });
});

describe("names that do not resolve", () => {
  it("says so for an unknown name and still prints the others", () => {
    const text = report(baseRows(), ["Nobody Here", "Alex Fixture"]);
    expect(text).toContain('"Nobody Here": no player by that name');
    expect(text).toContain("== Alex Fixture");
  });

  it("lists each candidate's team for a name that matches two players and picks neither", () => {
    const text = report(baseRows(), ["Cy Dup", "Alex Fixture"]);
    expect(text).toContain('"Cy Dup": matches more than one player');
    expect(text).toContain("DUP00001 on AAA");
    expect(text).toContain("DUP00002 on BBB");
    expect(text).not.toContain("== Cy Dup");
    expect(text).toContain("== Alex Fixture");
  });
});

describe("empty cases", () => {
  const clean = (text: string): void => {
    expect(text).not.toMatch(/NaN|Infinity|undefined/);
  };

  it("says a player with a bye in the latest prior week had no game, with no NaN", () => {
    const text = report(baseRows(), ["Fay Bye"]);
    expect(text).toContain("No game row in week 3");
    expect(text).toContain("No game for this team in this week");
    clean(text);
  });

  it("prints n/a for a player with zero targets", () => {
    const text = report(baseRows(), ["Eve Zero"]);
    expect(text).toContain("No targets in the weeks used");
    expect(text).toContain("Catch rate: n/a");
    clean(text);
  });
});

describe("command line", () => {
  const FILES: Record<NflverseFile, string> = {
    stats_player: "stats_player_week_2026.csv",
    snap_counts: "snap_counts_2026.csv",
    injuries: "injuries_2026.csv",
    games: "games.csv",
    play_by_play: "play_by_play_2026.csv.gz",
  };
  const urls = nflverseUrls(2026);
  const byUrl = new Map(Object.entries(urls).map(([file, url]) => [url, file as NflverseFile]));
  const fetchFixture: FetchLike = async (url) => {
    const body = readFileSync(new URL(`./fixtures/nflverse/${FILES[byUrl.get(url)!]}`, import.meta.url));
    return { status: 200, arrayBuffer: async () => new Uint8Array(body).buffer };
  };
  const collect = (season: number) => collectInputs(season, fetchFixture, () => new Date("2026-10-01T08:00:00Z"));

  it("exits 0 for names that match nothing and prints to the terminal only", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const code = await run(["profile", "--season", "2026", "--week", "4", "--player", "Nobody Here", "--player", "Also Nobody"], collect);
    const printed = log.mock.calls.map((c) => String(c[0])).join("\n");
    log.mockRestore();
    expect(code).toBe(0);
    expect(printed).toContain('"Nobody Here": no player by that name');
    expect(printed).toContain('"Also Nobody": no player by that name');
  });

  it("exits non-zero only for invalid arguments", async () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => undefined);
    expect(await run(["profile", "--season", "2026", "--week", "4"], collect)).toBe(1);
    expect(await run(["profile", "--season", "26", "--week", "4", "--player", "X"], collect)).toBe(1);
    expect(await run(["profile", "--season", "2026", "--week", "1", "--player", "X"], collect)).toBe(1);
    expect(await run(["profile", "--season", "2026", "--week", "4", "--player"], collect)).toBe(1);
    err.mockRestore();
  });
});

describe("driver review round 1", () => {
  it("ranks a WR among all WRs league-wide with 2+ games, and a TE among TEs", () => {
    // WR shares: Fay Bye 1.0, Dee Away 0.875, Alex Fixture 0.5, Bo Sample 0.417, Cy Dup 0.125 and 0.083.
    expect(report(baseRows(), ["Alex Fixture"])).toContain("rank among WRs league-wide: 3 of 6 (2+ games before week 4)");
    expect(report(baseRows(), ["Eve Zero"])).toContain("rank among TEs league-wide: 1 of 1 (2+ games before week 4)");
  });

  it("prints the team's red-zone totals for a player with no red-zone look", () => {
    expect(report(baseRows(), ["Bo Sample"])).toContain("Red-zone targets: 0 against the team's 1; red-zone carries: 0 against the team's 0");
  });

  it("gives a one-line note for a position outside WR, TE and RB, and still prints the others", () => {
    const rows = baseRows();
    rows.stats_player.push(...[1, 2, 3].map((week) => stat({ player_id: "QBX00001", player_display_name: "Quin Passer", week, team: "AAA", position: "QB" })));
    const text = report(rows, ["Quin Passer", "Alex Fixture"]);
    expect(text).toContain('"Quin Passer" is a QB; profiles cover WR, TE and RB.');
    expect(text).not.toContain("== Quin Passer");
    expect(text).toContain("== Alex Fixture");
  });

  it("warns when fewer than three weeks feed the heuristic, and not otherwise", () => {
    expect(report(baseRows(), ["Fay Bye"])).toContain("Small sample: 2 weeks. Treat floor and ceiling as rough.");
    expect(report(baseRows(), ["Alex Fixture"])).not.toContain("Small sample");
  });

  it("counts a running back's carries as opportunities in the heuristic", () => {
    const rows = baseRows();
    // 2 targets + 10 carries a week; 1 reception, 10 receiving and 40 rushing yards a week: 5.5 points over 12 opportunities.
    rows.stats_player.push(...[1, 2, 3].map((week) => stat({ player_id: "RBX00001", player_display_name: "Ray Back", week, team: "BBB", position: "RB", targets: 2, receptions: 1, receiving_yards: 10, carries: 10, rushing_yards: 40, opponent_team: "AAA" })));
    const text = report(rows, ["Ray Back"]);
    expect(text).toContain("Points per opportunity (target or carry) before TDs (receiving and rushing, fumbles lost -2): 0.458");
    expect(text).toContain("Floor 4.4  Typical 8.7  Ceiling 12.6"); // 12 x 0.4583 x 0.8; 12 x (0.4583 + 0.27); 12 x 0.4583 x 1.2 + 6
  });
});
