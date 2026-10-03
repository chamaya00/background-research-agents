import { describe, expect, it, vi } from "vitest";
import { SEEN_ID_COLUMNS, type ParsedRows, type PlayByPlayRow, type StatsPlayerRow } from "../src/nflverse.js";
import { run } from "../src/nflverse-cli.js";
import { bucketValues, buildXfp, extractLooks, parseXfpArgs, peckingOrder, rank, xfpReport, type XfpPlayer } from "../src/nflverse-xfp.js";

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
  receiving_yards: null,
  rushing_yards: null,
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

const A = "AAA00001";
const B = "AAA00002";
const target = (week: number, id: string, o: Partial<PlayByPlayRow> = {}): PlayByPlayRow =>
  play({ week, receiver_player_id: id, air_yards: 12, complete_pass: 0, receiving_yards: 0, ...o });
const carry = (week: number, id: string, o: Partial<PlayByPlayRow> = {}): PlayByPlayRow =>
  play({ week, pass: 0, rush: 1, play_type: "run", rusher_player_id: id, rushing_yards: 0, ...o });

const rowsWith = (plays: PlayByPlayRow[], stats: StatsPlayerRow[]): ParsedRows => ({
  stats_player: stats,
  snap_counts: [],
  injuries: [],
  games: [],
  play_by_play: plays,
});

const games = (id: string, name: string, team: string, targets: number[], position = "WR"): StatsPlayerRow[] =>
  targets.map((t, i) => stat({ player_id: id, player_display_name: name, week: i + 1, team, targets: t, position }));

// Two weeks, team AAA, two players. Plays, with the bucket each lands in:
//  A: week 1 tgt 12 air yards, complete, 20 yd, TD, yardline 60 -> tgt 10-19 of: 0.5 + 2 + 6 = 8.5
//  B: week 1 tgt 12 air yards, incomplete, yardline 60          -> tgt 10-19 of: 0   (bucket mean 4.25)
//  A: week 2 tgt 3 air yards, complete, 7 yd, yardline 15       -> tgt 1-9 rz: 0.5 + 0.7 = 1.2
//  A: week 2 carry from the 3, 2 yd, TD                         -> car i5: 0.2 + 6 = 6.2
//  B: week 2 carry from the 40, 6 yd                            -> car of: 0.6
//  B: week 2 carry from the 40, 10 yd                           -> car of: 1.0   (bucket mean 0.8)
const plays = (): PlayByPlayRow[] => [
  target(1, A, { complete_pass: 1, receiving_yards: 20, td_player_id: A }),
  target(1, B),
  target(2, A, { air_yards: 3, complete_pass: 1, receiving_yards: 7, yardline_100: 15 }),
  carry(2, A, { yardline_100: 3, rushing_yards: 2, td_player_id: A }),
  carry(2, B, { yardline_100: 40, rushing_yards: 6 }),
  carry(2, B, { yardline_100: 40, rushing_yards: 10 }),
];
const stats = (): StatsPlayerRow[] => [...games(A, "Alex Fixture", "AAA", [1, 1]), ...games(B, "Bo Sample", "AAA", [1, 0], "RB")];

describe("play filter", () => {
  it("counts only regular-season weeks before W and drops two-point tries, kneels and spikes", () => {
    const base = plays();
    const noise = [
      target(3, A, { complete_pass: 1, receiving_yards: 50 }),
      target(1, A, { season_type: "POST" }),
      target(1, A, { two_point_attempt: 1 }),
      target(1, A, { qb_spike: 1 }),
      carry(1, A, { qb_kneel: 1 }),
      carry(1, A, { play_type: "pass" }),
      carry(1, A, { two_point_attempt: 1 }),
      play({ week: 1, receiver_player_id: null }),
    ];
    expect(extractLooks([...base, ...noise], 2026, 3)).toEqual(extractLooks(base, 2026, 3));
    expect(extractLooks(base, 2026, 3)).toHaveLength(6);
  });
});

describe("buckets and league values", () => {
  it("assigns air-yard band, na, red zone and carry buckets", () => {
    const looks = extractLooks(
      [
        target(1, A, { air_yards: -1 }),
        target(1, A, { air_yards: null }),
        target(1, A, { air_yards: 25, yardline_100: 20 }),
        carry(1, A, { yardline_100: 5 }),
        carry(1, A, { yardline_100: 6 }),
        carry(1, A, { yardline_100: 21 }),
      ],
      2026,
      2,
    );
    expect(looks.map((l) => l.bucket)).toEqual(["tgt <=0 of", "tgt na of", "tgt 20+ rz", "car i5", "car 6-20", "car of"]);
  });

  it("computes a bucket's value by hand: car of = (0.6 + 1.0) / 2", () => {
    const values = bucketValues(extractLooks(plays(), 2026, 3));
    const get = (b: string) => values.find((v) => v.bucket === b)!;
    expect(get("car of").value).toBeCloseTo(0.8, 10);
    expect(get("car of").n).toBe(2);
    expect(get("tgt 10-19 of").value).toBeCloseTo(4.25, 10);
    expect(get("tgt 1-9 rz").value).toBeCloseTo(1.2, 10);
    expect(get("car i5").value).toBeCloseTo(6.2, 10);
  });

  it("gives a touchdown to the receiver only when td_player_id is the receiver", () => {
    const [l] = extractLooks([target(1, A, { complete_pass: 1, receiving_yards: 0, td_player_id: B })], 2026, 2);
    expect(l!.points).toBeCloseTo(0.5, 10);
  });

  it("prints each bucket with its value and n", () => {
    const text = xfpReport(rowsWith(plays(), stats()), { season: 2026, week: 3 });
    expect(text).toContain("car of: 0.800 (n=2)");
    expect(text).toContain("tgt 10-19 of: 4.250 (n=2)");
  });
});

describe("per player", () => {
  it("computes xFP/g and actual/g by hand", () => {
    const res = buildXfp(rowsWith(plays(), stats()), 2026, 3);
    const a = res.players.find((p) => p.player_id === A)!;
    // Expected: tgt 10-19 of 4.25 + tgt 1-9 rz 1.2 + car i5 6.2 = 11.65 over 2 games.
    expect(a.xfp_per_game).toBeCloseTo(11.65 / 2, 10);
    // Actual: 8.5 + 1.2 + 6.2 = 15.9 over 2 games.
    expect(a.actual_per_game).toBeCloseTo(15.9 / 2, 10);
    expect(a.diff).toBeCloseTo((15.9 - 11.65) / 2, 10);
    expect(a.targets_per_game).toBe(1);
    expect(a.carries_per_game).toBe(0.5);
    expect(a.rz_looks).toBe(2);
    expect(a.target_share).toBeCloseTo(2 / 3, 3);
    const b = res.players.find((p) => p.player_id === B)!;
    // B: 4.25 target value + two carries at 0.8 = 5.85; actual 0 + 1.6.
    expect(b.xfp_per_game).toBeCloseTo(5.85 / 2, 10);
    expect(b.actual_per_game).toBeCloseTo(1.6 / 2, 10);
    expect(b.games).toBe(2);
  });

  it("leaves out QBs", () => {
    const s = [...stats(), stat({ player_id: "QB000001", player_display_name: "Quin Passer", week: 1, team: "AAA", position: "QB" })];
    expect(buildXfp(rowsWith(plays(), s), 2026, 3).players.map((p) => p.player_id).sort()).toEqual([A, B]);
  });

  it("changes no printed number when week-W plays and stats are added", () => {
    const args = { season: 2026, week: 3 };
    const before = xfpReport(rowsWith(plays(), stats()), args);
    const extraPlays = [target(3, A, { complete_pass: 1, receiving_yards: 80, td_player_id: A }), carry(3, B, { yardline_100: 2, rushing_yards: 2, td_player_id: B })];
    const extraStats = [
      stat({ player_id: A, player_display_name: "Alex Fixture", week: 3, team: "AAA", targets: 9 }),
      stat({ player_id: "NEW00001", player_display_name: "Cy New", week: 3, team: "AAA", targets: 4 }),
    ];
    expect(xfpReport(rowsWith([...plays(), ...extraPlays], [...stats(), ...extraStats]), args)).toBe(before);
  });
});

const player = (id: string, team: string, share: number, games = 3): XfpPlayer => ({
  player_id: id,
  player: id,
  position: "WR",
  team,
  games,
  target_share: share,
  targets_per_game: 0,
  carries_per_game: 0,
  rz_looks: 0,
  xfp_per_game: share * 10,
  actual_per_game: 0,
  diff: 0,
});

describe("pecking orders", () => {
  it("calls the leader 1 when 5+ share points ahead of #2", () => {
    const order = peckingOrder(
      [player("p1", "AAA", 0.3), player("p2", "AAA", 0.25), player("p3", "AAA", 0.2), player("p4", "AAA", 0.1), player("p5", "AAA", 0.05), player("q1", "BBB", 0.9)],
      "AAA",
    );
    expect(order.map((o) => `${o.tier}:${o.player.player_id}`)).toEqual(["1:p1", "2:p2", "3:p3", "4:p4"]);
  });

  it("calls the top two 1a / 1b when the lead is under 5 points, and skips players under 2 games", () => {
    const order = peckingOrder([player("p1", "AAA", 0.3), player("p2", "AAA", 0.26), player("p3", "AAA", 0.2), player("p4", "AAA", 0.1), player("x", "AAA", 0.5, 1)], "AAA");
    expect(order.map((o) => `${o.tier}:${o.player.player_id}`)).toEqual(["1a:p1", "1b:p2", "3:p3", "4:p4"]);
  });
});

describe("rankings", () => {
  it("ranks by xFP/g and leaves out players under 2 games", () => {
    expect(rank([player("p1", "AAA", 0.3), player("p2", "AAA", 0.2), player("p3", "AAA", 0.9, 1)]).map((p) => p.player_id)).toEqual(["p1", "p2"]);
  });

  it("says how many were left out and honours --position, --team and --top", () => {
    const rows = rowsWith(plays(), [...stats(), ...games("CCC00001", "Cy Other", "CCC", [1])]);
    const all = xfpReport(rows, { season: 2026, week: 3 });
    expect(all).toContain("Rankings, overall, by xFP/g (2 of 2 ranked; 1 left out");
    expect(all).not.toContain("Cy Other");
    const rb = xfpReport(rows, { season: 2026, week: 3, position: "RB" });
    expect(rb).toContain("1. Bo Sample");
    expect(rb).not.toContain("Alex Fixture (AAA WR");
    expect(rb).not.toContain("Rankings, WR");
    const team = xfpReport(rows, { season: 2026, week: 3, team: "CCC" });
    expect(team).not.toContain("Bo Sample");
    expect(team).toContain("(0 of 0 ranked; 1 left out");
    const top = xfpReport(rows, { season: 2026, week: 3, top: 1 });
    expect(top).toContain("Rankings, overall, by xFP/g (1 of 2 ranked");
    expect(top).not.toContain("2. ");
  });
});

describe("arguments and command", () => {
  it("parses valid flags and rejects invalid ones", () => {
    expect(parseXfpArgs(["--season", "2026", "--week", "4", "--position", "WR", "--team", "AAA", "--top", "5"])).toEqual({
      season: 2026,
      week: 4,
      position: "WR",
      team: "AAA",
      top: 5,
    });
    for (const bad of [
      ["--season", "2026"],
      ["--season", "26", "--week", "4"],
      ["--season", "2026", "--week", "1"],
      ["--season", "2026", "--week", "4", "--position", "K"],
      ["--season", "2026", "--week", "4", "--team", "aaa"],
      ["--season", "2026", "--week", "4", "--top", "0"],
      ["--season", "2026", "--week", "4", "--week", "5"],
      ["--season", "2026", "--week", "4", "--bogus", "x"],
      ["--season", "2026", "--week"],
    ]) {
      expect(parseXfpArgs(bad)).toBeNull();
    }
  });

  it("exits non-zero for invalid arguments without fetching", async () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const collect = vi.fn();
    expect(await run(["xfp", "--season", "2026", "--week", "4", "--position", "K"], collect)).toBe(1);
    expect(collect).not.toHaveBeenCalled();
    err.mockRestore();
  });
});
