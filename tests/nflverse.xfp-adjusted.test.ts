import { describe, expect, it } from "vitest";
import { SEEN_ID_COLUMNS, type GamesRow, type ParsedRows, type PlayByPlayRow, type StatsPlayerRow } from "../src/nflverse.js";
import {
  ADJUST_K,
  RANKING_HEADER,
  buildAdjustment,
  buildXfp,
  bucketValues,
  defenseFactor,
  extractLooks,
  latestStarter,
  parseXfpArgs,
  passerFactor,
  previousSeasonTable,
  rank,
  toTable,
  xfpReport,
  type ModelPlayer,
  type XfpSort,
} from "../src/nflverse-xfp.js";

// Every team, player and quarterback below is invented.
const stat = (o: Partial<StatsPlayerRow> & Pick<StatsPlayerRow, "player_id" | "player_display_name" | "week" | "team">): StatsPlayerRow => ({
  position: "WR",
  season: 2026,
  season_type: "REG",
  game_id: `2026_0${o.week}_${o.team}`,
  opponent_team: "ZZZ",
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
  game_id: `${o.season ?? 2026}_0${o.week ?? 1}_AAA_BBB`,
  season: 2026,
  season_type: "REG",
  week: 1,
  posteam: "AAA",
  defteam: "BBB",
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

const A = "AAA00001"; // WR on AAA, home in week 3
const C = "BBB00001"; // WR on BBB, away in week 3
const D = "CCC00001"; // WR on CCC, bye in week 3
const QA1 = "AAAQB001";
const QA2 = "AAAQB002";
const QB2 = "BBBQB002";

const target = (week: number, id: string, passer: string, o: Partial<PlayByPlayRow> = {}): PlayByPlayRow =>
  play({ week, receiver_player_id: id, passer_player_id: passer, air_yards: 12, complete_pass: 0, receiving_yards: 0, qb_dropback: 1, ...o });
const carry = (week: number, id: string, o: Partial<PlayByPlayRow> = {}): PlayByPlayRow =>
  play({ week, pass: 0, rush: 1, play_type: "run", rusher_player_id: id, rushing_yards: 0, yardline_100: 40, ...o });
const dropback = (week: number, passer: string, posteam = "AAA", defteam = "BBB"): PlayByPlayRow =>
  play({ week, posteam, defteam, passer_player_id: passer, qb_dropback: 1, play_type: "pass" });

// Bucket, points, defense, passer of every play counted:
//  w1 A tgt 10-19 of, complete 20 yd      2.5  vs BBB, QA1
//  w1 A tgt 10-19 of, incomplete          0    vs BBB, QA1
//  w1 C tgt 10-19 of, complete 10 yd      1.5  vs AAA, QB2
//  w1 A car i5, 1 yd                      0.1  vs BBB
//  w2 A car of, 10 yd                     1.0  vs BBB
//  w2 C car of, 20 yd                     2.0  vs AAA
// Values: tgt 10-19 of = 4/3; car of = 1.5; car i5 = 0.1.
const plays = (): PlayByPlayRow[] => [
  target(1, A, QA1, { complete_pass: 1, receiving_yards: 20 }),
  target(1, A, QA1),
  target(1, C, QB2, { posteam: "BBB", defteam: "AAA", complete_pass: 1, receiving_yards: 10 }),
  carry(1, A, { yardline_100: 3, rushing_yards: 1 }),
  carry(2, A, { rushing_yards: 10 }),
  carry(2, C, { posteam: "BBB", defteam: "AAA", rushing_yards: 20 }),
  // Starters: AAA's latest game is week 2, where QA2 has the most dropbacks; BBB's is QB2.
  dropback(1, QA1),
  dropback(1, QA1),
  dropback(1, QA1),
  dropback(2, QA2),
  dropback(2, QA2),
  dropback(2, QA1),
  dropback(2, QB2, "BBB", "AAA"),
];

const stats = (): StatsPlayerRow[] => [
  ...[1, 2].map((week) => stat({ player_id: A, player_display_name: "Alex Fixture", week, team: "AAA", targets: 1 })),
  ...[1, 2].map((week) => stat({ player_id: C, player_display_name: "Cass Sample", week, team: "BBB", targets: 1 })),
  ...[1, 2].map((week) => stat({ player_id: D, player_display_name: "Dee Bye", week, team: "CCC", targets: 1 })),
  stat({ player_id: QA1, player_display_name: "Quin Alpha", week: 1, team: "AAA", position: "QB" }),
  stat({ player_id: QA2, player_display_name: "Quin Beta", week: 2, team: "AAA", position: "QB" }),
  stat({ player_id: QB2, player_display_name: "Quin Gamma", week: 2, team: "BBB", position: "QB" }),
];

const game = (week: number, home: string, away: string): GamesRow => ({
  game_id: `2026_0${week}_${away}_${home}`,
  season: 2026,
  week,
  gameday: "2026-09-27",
  gametime: null,
  home_team: home,
  away_team: away,
  home_score: null,
  away_score: null,
  spread_line: null,
  total_line: null,
  roof: null,
});

const rowsWith = (p: PlayByPlayRow[], s: StatsPlayerRow[], g: GamesRow[] = [game(3, "AAA", "BBB")]): ParsedRows => ({
  stats_player: s,
  snap_counts: [],
  injuries: [],
  games: g,
  play_by_play: p,
});

// Previous season: tgt 10-19 of = 3.0 (n=1), car of = 2.0 (n=1); no car i5, so it falls back.
// Week 19 and postseason plays must not count.
const priorPlays = (): PlayByPlayRow[] => [
  target(1, A, QA1, { season: 2025, complete_pass: 1, receiving_yards: 25 }),
  carry(18, A, { season: 2025, rushing_yards: 20 }),
  target(19, A, QA1, { season: 2025, complete_pass: 1, receiving_yards: 90 }),
  target(5, A, QA1, { season: 2025, season_type: "POST", complete_pass: 1, receiving_yards: 90 }),
];
const prior = (): ParsedRows => rowsWith(priorPlays(), []);

const shrink = (actual: number, expected: number, mean: number): number => (actual + ADJUST_K * mean) / (expected + ADJUST_K * mean);

describe("adjustment factors", () => {
  const looks = extractLooks(plays(), 2026, 3);
  const adj = buildAdjustment(looks, toTable(bucketValues(looks)));

  it("fixes K at 100", () => {
    expect(ADJUST_K).toBe(100);
  });

  it("computes the defense and passer factors by hand", () => {
    // Targets against BBB: actual 2.5 + 0, expected 4/3 + 4/3; m_tgt = 4/3.
    expect(defenseFactor(adj, "BBB", "target")).toBeCloseTo((2.5 + 400 / 3) / (8 / 3 + 400 / 3), 12);
    expect(defenseFactor(adj, "BBB", "target")).toBeCloseTo(135.83333333 / 136, 6);
    // Targets against AAA: actual 1.5, expected 4/3.
    expect(defenseFactor(adj, "AAA", "target")).toBeCloseTo((1.5 + 400 / 3) / (4 / 3 + 400 / 3), 12);
    // Carries: m_car = (0.1 + 1.5 + 1.5) / 3. Against BBB: actual 1.1, expected 1.6. Against AAA: actual 2, expected 1.5.
    const mCar = 3.1 / 3;
    expect(adj.mean.carry).toBeCloseTo(mCar, 12);
    expect(defenseFactor(adj, "BBB", "carry")).toBeCloseTo(shrink(1.1, 1.6, mCar), 12);
    expect(defenseFactor(adj, "AAA", "carry")).toBeCloseTo(shrink(2, 1.5, mCar), 12);
    // Passers: QA1 threw the two targets against BBB, QB2 the one against AAA.
    expect(passerFactor(adj, QA1)).toBeCloseTo((2.5 + 400 / 3) / (8 / 3 + 400 / 3), 12);
    expect(passerFactor(adj, QB2)).toBeCloseTo((1.5 + 400 / 3) / (4 / 3 + 400 / 3), 12);
  });

  it("gives a defense or passer with no plays exactly 1.0", () => {
    expect(defenseFactor(adj, "ZZZ", "target")).toBe(1);
    expect(defenseFactor(adj, "ZZZ", "carry")).toBe(1);
    expect(passerFactor(adj, "NOPE0001")).toBe(1);
    expect(passerFactor(adj, null)).toBe(1);
  });
});

describe("v2 retrospective", () => {
  it("sums V x defense x passer over targets and V x defense over carries, per game", () => {
    const res = buildXfp(rowsWith(plays(), stats()), 2026, 3);
    const a = res.players.find((p) => p.player_id === A)!;
    const fT = (2.5 + 400 / 3) / (8 / 3 + 400 / 3); // BBB targets, and QA1: the same two plays
    const fC = shrink(1.1, 1.6, 3.1 / 3);
    const expected = (2 * (4 / 3) * fT * fT + 1.5 * fC + 0.1 * fC) / 2;
    expect(a.v2.retro).toBeCloseTo(expected, 12);
    expect(a.xfp_per_game).toBeCloseTo((8 / 3 + 1.6) / 2, 12);
  });
});

describe("v2 next game", () => {
  const res = buildXfp(rowsWith(plays(), stats()), 2026, 3);
  const adj = res.adjustment;

  it("home player: v1 target xFP/g x f_def(opp) x f_qb(Q*) + v1 carry xFP/g x f_def(opp)", () => {
    const a = res.players.find((p) => p.player_id === A)!;
    expect(a.opponent).toEqual({ team: "BBB", away: false });
    expect(a.starter).toEqual({ id: QA2, name: "Quin Beta" }); // latest game, most dropbacks; QA2 has no targets so factor 1
    const expected = ((8 / 3) / 2) * defenseFactor(adj, "BBB", "target") * 1 + (1.6 / 2) * defenseFactor(adj, "BBB", "carry");
    expect(a.v2.next).toBeCloseTo(expected, 12);
  });

  it("away player uses the home team's defense and his own team's starter", () => {
    const c = res.players.find((p) => p.player_id === C)!;
    expect(c.opponent).toEqual({ team: "AAA", away: true });
    expect(c.starter?.name).toBe("Quin Gamma");
    const expected = ((4 / 3) / 2) * defenseFactor(adj, "AAA", "target") * passerFactor(adj, QB2) + (1.5 / 2) * defenseFactor(adj, "AAA", "carry");
    expect(c.v2.next).toBeCloseTo(expected, 12);
  });

  it("a team with no week-W game prints bye and no projection", () => {
    const d = res.players.find((p) => p.player_id === D)!;
    expect(d.opponent).toBeNull();
    expect(d.v2.next).toBeNull();
    expect(d.v4).toBeNull();
    const text = xfpReport(rowsWith(plays(), stats()), { season: 2026, week: 3 }, prior());
    expect(text).toMatch(/Dee Bye \(CCC WR, 2 g\).* bye$/m);
    expect(text).toMatch(/Alex Fixture \(AAA WR, 2 g\).* vs BBB, QB Quin Beta$/m);
    expect(text).toMatch(/Cass Sample \(BBB WR, 2 g\).* @ AAA, QB Quin Gamma$/m);
  });

  it("breaks a tie for starter by player_id", () => {
    const tie = [dropback(2, "AAAQB009"), dropback(2, "AAAQB003"), dropback(1, "AAAQB001"), dropback(1, "AAAQB001")];
    expect(latestStarter(tie, 2026, 3, "AAA")).toBe("AAAQB003");
    expect(latestStarter(tie, 2026, 1, "AAA")).toBeNull();
  });
});

describe("v3", () => {
  it("takes values from weeks 1-18 of the previous regular season and falls back where n = 0", () => {
    const res = buildXfp(rowsWith(plays(), stats()), 2026, 3, prior());
    expect(res.v3!.previous.map((b) => [b.bucket, b.value, b.n])).toEqual([
      ["tgt 10-19 of", 3, 1],
      ["car of", 2, 1],
    ]);
    expect(res.v3!.fallbacks).toEqual(["car i5"]);
    expect(res.v3!.v3.get("car i5")).toBeCloseTo(0.1, 12);
    // Current plays at previous-season values: 2 x 3.0 + 2.0 + 0.1 over 2 games.
    expect(res.players.find((p) => p.player_id === A)!.v3).toBeCloseTo(8.1 / 2, 12);
    // v1 is unchanged by the previous season.
    expect(res.players.find((p) => p.player_id === A)!.xfp_per_game).toBeCloseTo(buildXfp(rowsWith(plays(), stats()), 2026, 3).players.find((p) => p.player_id === A)!.xfp_per_game, 12);
  });

  it("prints the previous-season table beside v1's and lists the fallback", () => {
    const text = xfpReport(rowsWith(plays(), stats()), { season: 2026, week: 3 }, prior());
    expect(text).toContain("tgt 10-19 of: 1.333 (n=3) | 3.000 (n=1)");
    expect(text).toContain("car i5: 0.100 (n=1) | n/a (n=0), fell back to v1");
    expect(text).toContain("v3 buckets that fell back to the current season: car i5");
  });

  it("builds the table from a prior season's rows only", () => {
    const t = previousSeasonTable(prior(), 2026, bucketValues(extractLooks(plays(), 2026, 3)));
    expect(t.v3.get("tgt 10-19 of")).toBe(3);
  });
});

describe("v4", () => {
  const res = buildXfp(rowsWith(plays(), stats()), 2026, 3, prior());
  const a = res.players.find((p) => p.player_id === A)!;

  it("is the same machinery as v2 with v3's values, in E and m_c too", () => {
    const looks = extractLooks(plays(), 2026, 3);
    const adj3 = buildAdjustment(looks, res.v3!.v3);
    // With V3, E over targets against BBB is 2 x 3.0, m_tgt = (3 + 3 + 3) / 3, actual still 2.5.
    expect(defenseFactor(adj3, "BBB", "target")).toBeCloseTo(shrink(2.5, 6, 3), 12);
    expect(defenseFactor(adj3, "BBB", "target")).not.toBeCloseTo(defenseFactor(res.adjustment, "BBB", "target"), 6);
    const fT = shrink(2.5, 6, 3);
    // Carries with V3: 0.1 + 2.0 + 2.0 over three plays; against BBB actual 1.1, expected 2.1.
    const mCar = 4.1 / 3;
    const fC = shrink(1.1, 2.1, mCar);
    expect(a.v4!.retro).toBeCloseTo((2 * 3 * fT * fT + 2 * fC + 0.1 * fC) / 2, 12);
    // Next game: V3 target xFP/g (6/2) x f_def(BBB) x f_qb(QA2 = 1) + V3 carry xFP/g (2.1/2) x f_def(BBB, carry).
    expect(a.v4!.next).toBeCloseTo((6 / 2) * fT + (2.1 / 2) * fC, 12);
  });

  it("differs from v2 only through the value table", () => {
    const looks = extractLooks(plays(), 2026, 3);
    const viaV1 = buildAdjustment(looks, toTable(bucketValues(looks)));
    expect(defenseFactor(viaV1, "BBB", "carry")).toBe(defenseFactor(res.adjustment, "BBB", "carry"));
    expect(a.v4!.retro).not.toBeCloseTo(a.v2.retro, 6);
  });
});

describe("output", () => {
  const text = xfpReport(rowsWith(plays(), stats()), { season: 2026, week: 3 }, prior());

  it("has a column per model and the labels under the header", () => {
    expect(text).toContain(RANKING_HEADER);
    for (const col of ["v1", "v2-retro", "v2-next", "v3", "v4-retro", "v4-next", "actual/g"]) expect(RANKING_HEADER).toContain(col);
    const lines = text.split("\n");
    expect(lines.indexOf("v2: adjusted, not validated against v1")).toBeGreaterThan(0);
    expect(lines).toContain("v3: previous-season values, not validated against v1");
    expect(lines).toContain("v4: adjusted, not validated against v1");
    expect(text).toContain("K = 100");
  });

  it("leaves pecking orders unchanged", () => {
    expect(text).toContain("Pecking orders (target share, 2+ games; WR/TE/RB)");
  });

  it("sorts by the chosen key, v2 and v4 by next game, and a bye goes last", () => {
    const mk = (id: string, xfp: number, v2n: number | null, v3: number, v4n: number | null): ModelPlayer => ({
      player_id: id,
      player: id,
      position: "WR",
      team: "AAA",
      games: 3,
      target_share: 0,
      targets_per_game: 0,
      carries_per_game: 0,
      rz_looks: 0,
      xfp_per_game: xfp,
      actual_per_game: 0,
      diff: 0,
      v2: { retro: 99, next: v2n },
      v3,
      v4: { retro: 99, next: v4n },
      opponent: null,
      starter: null,
    });
    const ps = [mk("a", 3, 1, 2, null), mk("b", 2, 3, 1, 1), mk("c", 1, 2, 3, 2)];
    const order = (s: XfpSort): string => rank(ps, s).map((p) => p.player_id).join("");
    expect(order("v1")).toBe("abc");
    expect(order("v2")).toBe("bca");
    expect(order("v3")).toBe("cab");
    expect(order("v4")).toBe("cba");
    expect(rank(ps).map((p) => p.player_id).join("")).toBe("abc");
  });

  it("prints the ranking under --sort and defaults to v1", () => {
    const v2 = xfpReport(rowsWith(plays(), stats()), { season: 2026, week: 3, sort: "v2" }, prior());
    expect(v2).toContain("Rankings, overall, by v2 next game");
    const rows = v2.split("\n").filter((l) => /^ {2}\d\. /.test(l));
    const res = buildXfp(rowsWith(plays(), stats()), 2026, 3, prior());
    const expected = rank(res.players, "v2").map((p) => p.player);
    expect(rows.slice(0, 3).map((l) => expected.findIndex((n) => l.includes(n)))).toEqual([0, 1, 2]);
    expect(xfpReport(rowsWith(plays(), stats()), { season: 2026, week: 3 }, prior())).toContain("Rankings, overall, by xFP/g");
  });

  it("parses --sort and rejects an unknown one", () => {
    expect(parseXfpArgs(["--season", "2026", "--week", "4", "--sort", "v4"])).toEqual({ season: 2026, week: 4, sort: "v4" });
    expect(parseXfpArgs(["--season", "2026", "--week", "4", "--sort", "v5"])).toBeNull();
  });
});

describe("no leakage", () => {
  it("changes no v1-v4 number when week-W and later plays, stats and games are added", () => {
    const base = rowsWith(plays(), stats());
    const extraPlays = [
      target(3, A, QA1, { complete_pass: 1, receiving_yards: 80 }),
      carry(3, C, { posteam: "BBB", defteam: "AAA", rushing_yards: 40 }),
      carry(4, A, { yardline_100: 2, rushing_yards: 2 }),
      dropback(3, "AAAQB000"),
      dropback(3, "AAAQB000"),
      dropback(3, "AAAQB000"),
      dropback(4, "AAAQB000", "AAA", "BBB"),
    ];
    const extraStats = [
      stat({ player_id: A, player_display_name: "Alex Fixture", week: 3, team: "AAA", targets: 9 }),
      stat({ player_id: "AAAQB000", player_display_name: "Quin Late", week: 3, team: "AAA", position: "QB" }),
      stat({ player_id: "NEW00001", player_display_name: "Cy New", week: 4, team: "AAA", targets: 4 }),
    ];
    const later = rowsWith([...plays(), ...extraPlays], [...stats(), ...extraStats], [game(3, "AAA", "BBB"), game(4, "CCC", "AAA")]);
    for (const sort of ["v1", "v2", "v3", "v4"] as const) {
      const args = { season: 2026, week: 3, sort };
      expect(xfpReport(later, args, prior())).toBe(xfpReport(base, args, prior()));
    }
  });
});
