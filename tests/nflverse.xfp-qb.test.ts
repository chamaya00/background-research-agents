import { describe, expect, it } from "vitest";
import { SEEN_ID_COLUMNS, type GamesRow, type ParsedRows, type PlayByPlayRow, type StatsPlayerRow } from "../src/nflverse.js";
import {
  ADJUST_K,
  QB_RANKING_HEADER,
  buildQb,
  bucketValues,
  extractQbLooks,
  gameStarters,
  latestStarter,
  parseXfpArgs,
  qbReport,
  xfpReport,
} from "../src/nflverse-xfp.js";

// Every team, player and quarterback below is invented.
const Q1 = "AAAQB001"; // starts weeks 1 and 2 for AAA
const Q2 = "AAAQB002"; // backup: relief in both games
const BQ = "BBBQB001"; // starts weeks 1 and 2 for BBB
const WR = "AAAWR001"; // a receiver, and a non-QB runner
const DEF = "BBBDF001"; // a defender

const stat = (id: string, name: string, week: number, team: string, position: string, season = 2026): StatsPlayerRow => ({
  player_id: id,
  player_display_name: name,
  position,
  season,
  week,
  season_type: "REG",
  game_id: `${season}_0${week}_${team}`,
  team,
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
});

const seen = Object.fromEntries(SEEN_ID_COLUMNS.map((c) => [c, null])) as Record<(typeof SEEN_ID_COLUMNS)[number], null>;
const play = (o: Partial<PlayByPlayRow>): PlayByPlayRow => ({
  ...seen,
  complete_pass: null,
  sack: 0,
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

const att = (week: number, passer: string, o: Partial<PlayByPlayRow> = {}): PlayByPlayRow =>
  play({ week, passer_player_id: passer, pass_attempt: 1, qb_dropback: 1, air_yards: 12, complete_pass: 0, passing_yards: 0, ...o });
const sack = (week: number, passer: string, o: Partial<PlayByPlayRow> = {}): PlayByPlayRow =>
  play({ week, passer_player_id: passer, sack: 1, pass_attempt: 0, qb_dropback: 1, rushing_yards: -7, ...o });
const rush = (week: number, id: string, o: Partial<PlayByPlayRow> = {}): PlayByPlayRow =>
  play({ week, pass: 0, rush: 1, play_type: "run", rusher_player_id: id, rushing_yards: 0, yardline_100: 40, ...o });
const scramble = (week: number, id: string, o: Partial<PlayByPlayRow> = {}): PlayByPlayRow =>
  rush(week, id, { qb_scramble: 1, qb_dropback: 1, ...o });
const bq = (o: Partial<PlayByPlayRow>): PlayByPlayRow => ({ ...o, posteam: "BBB", defteam: "AAA" }) as PlayByPlayRow;

// Bucket and points of every counted play (defense BBB unless noted):
//  w1 Q1 att 10-19 of, complete 20 yd             0.8   Q1 starts: 3 dropbacks to Q2's 1
//  w1 Q1 att 10-19 of, incomplete                 0
//  w1 Q1 sack                                     0
//  w1 Q2 att 1-9 of, complete 10 yd (relief)      0.4
//  w2 Q1 att 20+ rz, 15 yd TD                     4.6
//  w2 Q1 att 10-19 of, pick-six                  -2
//  w2 Q1 scramble of, 8 yd                        0.8
//  w2 Q1 run i5, 2 yd TD                          6.2
//  w2 Q1 att 1-9 of, 8 yd, receiver fumble lost   0.32  (not charged to Q1)
//  w2 Q1 sack, Q1 fumble lost                    -2
//  w2 Q2 att <=0 of, incomplete (relief)          0
//  w1 BQ att 10-19 of, 30 yd (vs AAA)             1.2
//  w2 BQ att 20+ of, incomplete (vs AAA)          0
//  w2 BQ run of, 10 yd (vs AAA)                   1.0
// Excluded: two-point try, kneel, spike, a receiver's run, a postseason pass, every week-3 play.
const plays = (): PlayByPlayRow[] => [
  att(1, Q1, { complete_pass: 1, passing_yards: 20 }),
  att(1, Q1),
  sack(1, Q1),
  att(1, Q2, { air_yards: 5, complete_pass: 1, passing_yards: 10 }),
  att(2, Q1, { air_yards: 25, yardline_100: 15, complete_pass: 1, passing_yards: 15, pass_touchdown: 1, td_player_id: WR }),
  att(2, Q1, { interception: 1, touchdown: 1, td_player_id: DEF, interception_player_id: DEF }),
  scramble(2, Q1, { rushing_yards: 8 }),
  rush(2, Q1, { yardline_100: 3, rushing_yards: 2, td_player_id: Q1 }),
  att(2, Q1, { air_yards: 5, complete_pass: 1, passing_yards: 8, fumble_lost: 1, fumbled_1_player_id: WR }),
  sack(2, Q1, { fumble_lost: 1, fumbled_1_player_id: Q1 }),
  att(2, Q2, { air_yards: 0 }),
  bq(att(1, BQ, { complete_pass: 1, passing_yards: 30 })),
  bq(att(2, BQ, { air_yards: 25 })),
  bq(rush(2, BQ, { rushing_yards: 10 })),
  // Excluded plays.
  att(2, Q1, { two_point_attempt: 1, complete_pass: 1, passing_yards: 2, pass_touchdown: 1 }),
  rush(2, Q1, { qb_kneel: 1, rushing_yards: -1 }),
  att(2, Q1, { qb_spike: 1, air_yards: 0 }),
  rush(2, WR, { rushing_yards: 30 }),
  att(2, Q1, { season_type: "POST", passing_yards: 50 }),
  att(3, Q1, { passing_yards: 99 }),
];

const stats = (): StatsPlayerRow[] => [
  stat(Q1, "Quin Alpha", 1, "AAA", "QB"),
  stat(Q2, "Quin Beta", 1, "AAA", "QB"),
  stat(BQ, "Quin Gamma", 1, "BBB", "QB"),
  stat(WR, "Wes Receiver", 1, "AAA", "WR"),
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

// Previous season: att 10-19 of = 1.0 (n=1) and sack = 0 (n=1); week 19 and postseason plays do not count.
const prior = (): ParsedRows =>
  rowsWith(
    [
      att(1, Q1, { season: 2025, complete_pass: 1, passing_yards: 25 }),
      sack(2, Q1, { season: 2025 }),
      att(19, Q1, { season: 2025, complete_pass: 1, passing_yards: 90 }),
      att(5, Q1, { season: 2025, season_type: "POST", complete_pass: 1, passing_yards: 90 }),
    ],
    [stat(Q1, "Quin Alpha", 1, "AAA", "QB", 2025)],
  );

const K = ADJUST_K;
const shrink = (a: number, e: number, m: number): number => (a + K * m) / (e + K * m);
const looks = () => extractQbLooks(plays(), new Set([Q1, Q2, BQ]), 2026, 3);
const byValue = (b: string) => bucketValues(looks(), ["att 10-19 of", "att 1-9 of", "att 20+ rz", "att 20+ of", "att <=0 of", "sack", "scr of", "run i5", "run of"]).find((v) => v.bucket === b)!;
const qb = (id: string, p = plays(), s = stats(), g?: GamesRow[], pr: ParsedRows | null = null, week = 3) =>
  buildQb(rowsWith(p, s, g), 2026, week, pr).players.find((x) => x.player_id === id)!;

describe("qb plays and scoring", () => {
  const find = (pred: (l: ReturnType<typeof looks>[number]) => boolean) => looks().filter(pred);

  it("scores each play type in the #162 set", () => {
    expect(find((l) => l.bucket === "att 20+ rz")[0]!.points).toBeCloseTo(0.04 * 15 + 4);
    expect(find((l) => l.play === "scr")[0]!.points).toBeCloseTo(0.8);
    expect(find((l) => l.play === "scr")[0]!.bucket).toBe("scr of");
    expect(find((l) => l.bucket === "run i5")[0]!.points).toBeCloseTo(6.2);
    expect(find((l) => l.play === "sack" && l.week === 1)[0]!.points).toBe(0);
  });

  it("charges a pick-six only the interception", () => {
    const pick = find((l) => l.play === "att" && l.points < 0);
    expect(pick).toHaveLength(1);
    expect(pick[0]!.points).toBe(-2);
  });

  it("charges a lost fumble to the QB only when he fumbled", () => {
    expect(find((l) => l.bucket === "att 1-9 of" && l.player_id === Q1)[0]!.points).toBeCloseTo(0.32);
    expect(find((l) => l.play === "sack" && l.week === 2)[0]!.points).toBe(-2);
  });

  it("excludes two-point tries, kneels, spikes, non-QB runs, postseason and week W", () => {
    // 14 counted plays: nothing from the excluded list is in.
    expect(looks()).toHaveLength(14);
    expect(find((l) => l.player_id === WR)).toHaveLength(0);
    expect(extractQbLooks(plays(), new Set([Q1, Q2, BQ]), 2026, 4).some((l) => l.week === 3)).toBe(true);
  });
});

describe("buckets, starts, actual and gap", () => {
  it("values a bucket as the league mean points per play with its n", () => {
    const v = bucketValues(looks(), ["att 10-19 of", "att 1-9 of", "sack"]);
    // att 10-19 of: 0.8, 0, -2 and BQ's 1.2 = 0 over 4; att 1-9 of: 0.4 and 0.32; sack: 0 and -2.
    expect(v).toEqual([
      { bucket: "att 10-19 of", value: expect.closeTo(0, 9), n: 4 },
      { bucket: "att 1-9 of", value: expect.closeTo(0.36, 9), n: 2 },
      { bucket: "sack", value: -1, n: 2 },
    ]);
    expect(byValue("run i5").value).toBeCloseTo(6.2);
  });

  it("picks the starter by dropbacks with ties to the lower id, like latestStarter", () => {
    const g = gameStarters(plays(), 2026, 3);
    expect(g.get("2026_01_AAA_BBB AAA")!.starter).toBe(Q1);
    expect(g.get("2026_02_AAA_BBB BBB")!.starter).toBe(BQ);
    const tie = [att(1, "Q9", {}), att(1, "Q3", {})];
    expect(gameStarters(tie, 2026, 2).get("2026_01_AAA_BBB AAA")!.starter).toBe("Q3");
    expect(latestStarter(tie, 2026, 2, "AAA")).toBe("Q3");
  });

  it("counts starts and games apart and leaves relief plays out of the per-game numbers", () => {
    const a = qb(Q1);
    expect(a.starts).toBe(2);
    expect(a.games).toBe(2);
    // Started-game plays only: pass-class 8 plays, 2 rushes (scramble + run), rz plays: att 20+ rz and run i5.
    expect(a.dropbacks_per_start).toBeCloseTo(8 / 2);
    expect(a.rushes_per_start).toBeCloseTo(1);
    expect(a.rz_per_start).toBeCloseTo(1);
    const backup = qb(Q2);
    expect(backup.starts).toBe(0);
    expect(backup.games).toBe(2);
    expect(backup.v1).toBe(0);
  });

  it("computes v1 per start, actual per start and the gap by hand", () => {
    const a = qb(Q1);
    // v1 sum: sack -1, att 20+ rz 4.6, pick-six att 10-19 of 0, scramble 0.8, run 6.2, att 1-9 of 0.36, sack -1, att x2 0.
    expect(a.v1).toBeCloseTo((-1 + 4.6 + 0.8 + 6.2 + 0.36 - 1) / 2);
    // actual: week 1 0.8; week 2 4.6 - 2 + 0.8 + 6.2 + 0.32 - 2 = 7.92.
    expect(a.actual_per_start).toBeCloseTo((0.8 + 7.92) / 2);
    expect(a.gap).toBeCloseTo(a.actual_per_start - a.v1);
    expect(a.gap).toBeCloseTo(-0.62);
  });

  it("ranks QBs with 2+ starts and lists the rest as fewer than 2 starts", () => {
    const text = qbReport(rowsWith(plays(), stats()), { season: 2026, week: 3 }, prior()).join("\n");
    expect(text).toContain(QB_RANKING_HEADER);
    const [ranked, rest] = text.split("Not ranked: fewer than 2 starts");
    expect(ranked).toContain("Quin Alpha");
    expect(ranked).toContain("Quin Gamma");
    expect(ranked).not.toContain("Quin Beta");
    expect(rest).toContain("Quin Beta (AAA, 0 starts, 2 games) - - - - - - - - - - -");
    expect(rest).toMatch(/Quin Beta .*, not latest starter$/m);
    expect(ranked).not.toContain("not latest starter");
    expect(text).toContain("for a quarterback it measures his own efficiency");
    expect(text).toContain("no passer or quarterback-quality factor");
  });
});

describe("v2, defense only", () => {
  // Pass-class plays (actual, expected) against BBB: n = 10, A = 2.92, E = 4.12; the league has 12 pass-class plays, m = E / 12.
  const mPass = 4.12 / 12;
  const fBBBPass = shrink(2.92, 4.12, mPass);

  it("computes the defense factors by hand and gives 1.0 to a defense with no plays", () => {
    const res = buildQb(rowsWith(plays(), stats()), 2026, 3);
    expect(res.adjustment.defense.get("BBB target")).toBeCloseTo(fBBBPass);
    expect(res.adjustment.defense.get("AAA target")).toBeCloseTo(shrink(1.2, 0, mPass));
    expect(res.adjustment.defense.get("BBB carry")).toBeCloseTo(1);
    expect(res.adjustment.defense.has("CCC target")).toBe(false);
    expect(res.adjustment.passer.size).toBe(0);
  });

  it("applies the factors retro per play and next by class, and prints bye without a projection", () => {
    const a = qb(Q1);
    const pass = 3.76;
    expect(a.v2.retro).toBeCloseTo((pass * fBBBPass + 6.2) / 2);
    expect(a.v2.next).toBeCloseTo((pass / 2) * fBBBPass + 3.1);
    expect(qb(Q1, plays(), stats(), []).v2.next).toBeNull();
    const text = qbReport(rowsWith(plays(), stats(), []), { season: 2026, week: 3 }, prior()).join("\n");
    expect(text).toContain("2 starts, 2 games) 5.0 ");
    expect(text).toContain(" bye");
  });
});

describe("v3 and v4", () => {
  const pr = prior();

  it("values the buckets from the previous season and lists the fallbacks", () => {
    const res = buildQb(rowsWith(plays(), stats()), 2026, 3, pr);
    expect(res.v3!.previous).toEqual([
      { bucket: "att 10-19 of", value: expect.closeTo(1, 9), n: 1 },
      { bucket: "sack", value: 0, n: 1 },
    ]);
    expect(res.v3!.fallbacks).toContain("run i5");
    expect(res.v3!.fallbacks).not.toContain("att 10-19 of");
    // v3 differs from v1: att 10-19 of is 1.0 rather than 0.
    expect(res.v3!.v3.get("att 10-19 of")).toBeCloseTo(1);
    expect(res.v3!.v3.get("run i5")).toBeCloseTo(6.2);
    expect(qb(Q1, plays(), stats(), undefined, pr).v3).toBeCloseTo((1 + 1 + 0 + 4.6 + 1 + 0.8 + 6.2 + 0.36 + 0) / 2);
    expect(qb(Q1).v3).toBeNull();
  });

  it("applies the defense adjustment to v3's values", () => {
    const a = qb(Q1, plays(), stats(), undefined, pr);
    // Under v3, E against BBB's pass-class plays is 9.12; the league's is 10.12 over 12.
    const f = shrink(2.92, 9.12, 10.12 / 12);
    expect(a.v4!.retro).toBeCloseTo((8.76 * f + 6.2) / 2);
    expect(a.v4!.next).toBeCloseTo(4.38 * f + 3.1);
  });

  it("ignores the previous season's week 19 and postseason", () => {
    expect(buildQb(rowsWith(plays(), stats()), 2026, 3, pr).v3!.previous.map((b) => b.n)).toEqual([1, 1]);
  });
});

describe("columns, sorting and the command", () => {
  it("accepts --position QB and prints only the QB section; other positions omit it", () => {
    expect(parseXfpArgs(["--season", "2026", "--week", "4", "--position", "QB"])).toEqual({ season: 2026, week: 4, position: "QB" });
    const rows = rowsWith(plays(), stats());
    const only = xfpReport(rows, { season: 2026, week: 3, position: "QB" }, prior());
    expect(only).toContain("QB rankings");
    expect(only).not.toContain("Pecking orders");
    expect(xfpReport(rows, { season: 2026, week: 3, position: "WR" }, prior())).not.toContain("QB rankings");
  });

  it("appends the QB section after the existing output when no position is given", () => {
    const text = xfpReport(rowsWith(plays(), stats()), { season: 2026, week: 3 }, prior());
    expect(text.indexOf("Rankings, RB")).toBeGreaterThan(-1);
    expect(text.indexOf("QB rankings")).toBeGreaterThan(text.indexOf("Rankings, RB"));
  });

  it("sorts by the chosen version and labels v2-v4 as not validated against v1", () => {
    const rows = rowsWith(plays(), stats());
    const names = (sort: "v1" | "v2" | "v3" | "v4"): string[] =>
      qbReport(rows, { season: 2026, week: 3, sort }, prior())
        .filter((l) => /^ {2}\d\./.test(l))
        .map((l) => l.split(" ")[4]!);
    expect(names("v1")).toEqual(["Alpha", "Gamma"]);
    expect(names("v4")).toEqual(["Alpha", "Gamma"]);
    const text = qbReport(rows, { season: 2026, week: 3 }, prior()).join("\n");
    for (const v of ["v2", "v3", "v4"]) expect(text).toMatch(new RegExp(`${v}: .*not validated against v1`));
  });
});

describe("no leakage", () => {
  it("leaves every printed QB number unchanged when week W and later plays and stats are added", () => {
    const base = qbReport(rowsWith(plays(), stats()), { season: 2026, week: 3 }, prior()).join("\n");
    const later = [
      att(3, Q2, { passing_yards: 300, pass_touchdown: 1, complete_pass: 1 }),
      att(3, "NEWQB01", { passing_yards: 80 }),
      rush(4, BQ, { rushing_yards: 60 }),
      sack(3, BQ),
      att(3, BQ, { qb_dropback: 1, passing_yards: 40 }),
      att(4, Q2, { passing_yards: 40, qb_dropback: 1 }),
      att(4, Q2, { passing_yards: 40, qb_dropback: 1 }),
      att(4, Q2, { passing_yards: 40, qb_dropback: 1 }),
    ].map((p) => ({ ...p, game_id: `2026_0${p.week}_AAA_BBB` }));
    const moreStats = [stat(Q2, "Renamed Later", 3, "AAA", "QB"), stat("NEWQB01", "Quin New", 3, "AAA", "QB"), stat(WR, "Wes Receiver", 4, "AAA", "QB")];
    const after = qbReport(rowsWith([...plays(), ...later], [...stats(), ...moreStats]), { season: 2026, week: 3 }, prior()).join("\n");
    expect(after).toBe(base);
  });
});
