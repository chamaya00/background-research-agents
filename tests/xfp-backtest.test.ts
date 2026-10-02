import { describe, expect, it, vi } from "vitest";
import { SEEN_ID_COLUMNS, type GamesRow, type ParsedRows, type PlayByPlayRow, type StatsPlayerRow } from "../src/nflverse.js";
import { parseXfpBacktestArgs, run } from "../src/nflverse-cli.js";
import { buildQb, buildXfp } from "../src/nflverse-xfp.js";
import { accuracyVerdict, kendallTau, trendTest } from "../src/backtest-stats.js";
import { VERDICTS_TOTAL, projectFold, runXfpBacktest, scoreFold, statsFor, type PlayerWeek } from "../src/xfp-backtest.js";

// Every team, player and quarterback below is invented.
const Q1 = "AAAQB001"; // starts every AAA game
const R1 = "AAAQB002"; // AAA relief only: no start, so below the minimum
const WR1 = "AAAWR001";
const WR2 = "AAAWR002"; // targeted before week 3, absent from week 3 play-by-play
const RB1 = "AAARB001";
const Q2 = "BBBQB001"; // starts weeks 1-2, leaves the week-3 game early
const R2 = "BBBQB002"; // enters in week 3 with no earlier pass play
const WR3 = "BBBWR001";
const Q4 = "CCCQB001"; // CCC has a bye in week 3
const C1 = "CCCWR001";

const stat = (id: string, week: number, team: string, position: string, season = 2026): StatsPlayerRow => ({
  player_id: id,
  player_display_name: id,
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

const seenCols = Object.fromEntries(SEEN_ID_COLUMNS.map((c) => [c, null])) as Record<(typeof SEEN_ID_COLUMNS)[number], null>;
const play = (o: Partial<PlayByPlayRow>): PlayByPlayRow => ({
  ...seenCols,
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

// A pass: `to` is the receiver (or null), complete for `yards` when yards > 0.
const pass = (week: number, passer: string, to: string | null, yards: number, o: Partial<PlayByPlayRow> = {}): PlayByPlayRow =>
  play({
    week,
    passer_player_id: passer,
    receiver_player_id: to,
    pass_attempt: 1,
    qb_dropback: 1,
    air_yards: 12,
    complete_pass: yards > 0 ? 1 : 0,
    passing_yards: yards,
    receiving_yards: yards > 0 ? yards : 0,
    ...o,
  });
const rush = (week: number, id: string, yards: number, o: Partial<PlayByPlayRow> = {}): PlayByPlayRow =>
  play({ week, pass: 0, rush: 1, play_type: "run", rusher_player_id: id, rushing_yards: yards, yardline_100: 40, ...o });
const bbb = (o: PlayByPlayRow): PlayByPlayRow => ({ ...o, posteam: "BBB", defteam: "AAA" });
const ccc = (o: PlayByPlayRow): PlayByPlayRow => ({ ...o, posteam: "CCC", defteam: "DDD", game_id: `2026_0${o.week}_CCC_DDD` });

// Half-PPR points and QB points of every counted play are in the comments of the tests below.
const earlyWeek = (w: number): PlayByPlayRow[] => [
  pass(w, Q1, WR1, 20), // WR1 2.5, Q1 0.8
  pass(w, Q1, WR2, 0),
  pass(w, Q1, WR2, 0),
  pass(w, R1, WR2, 0), // relief: one dropback to Q1's three
  rush(w, RB1, 5), // RB1 0.5
  bbb(pass(w, Q2, WR3, 10)), // WR3 1.5, Q2 0.4
  bbb(pass(w, Q2, WR3, 0)),
  ccc(pass(w, Q4, C1, 15)), // C1 2.0, Q4 0.6
];
const plays = (): PlayByPlayRow[] => [
  ...earlyWeek(1),
  ...earlyWeek(2),
  // Week 3: WR2 is absent; Q2 leaves after two dropbacks and R2 takes five; CCC is on a bye.
  pass(3, Q1, WR1, 30), // WR1 3.5, Q1 1.2
  rush(3, RB1, 10), // RB1 1.0
  bbb(pass(3, Q2, WR3, 10)), // WR3 1.5, Q2 0.4
  bbb(pass(3, Q2, null, 0)),
  ...[1, 2, 3, 4, 5].map(() => bbb(pass(3, R2, null, 0))),
];

const stats = (): StatsPlayerRow[] =>
  [1, 2, 3].flatMap((w) => [
    stat(Q1, w, "AAA", "QB"),
    stat(R1, w, "AAA", "QB"),
    stat(WR1, w, "AAA", "WR"),
    stat(WR2, w, "AAA", "WR"),
    stat(RB1, w, "AAA", "RB"),
    stat(Q2, w, "BBB", "QB"),
    stat(WR3, w, "BBB", "WR"),
    ...(w < 3 ? [stat(Q4, w, "CCC", "QB"), stat(C1, w, "CCC", "WR")] : []),
  ]);

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
const games = (): GamesRow[] => [game(1, "AAA", "BBB"), game(1, "CCC", "DDD"), game(2, "AAA", "BBB"), game(2, "CCC", "DDD"), game(3, "AAA", "BBB")];

const rowsOf = (p: PlayByPlayRow[], s: StatsPlayerRow[]): ParsedRows => ({ stats_player: s, snap_counts: [], injuries: [], games: games(), play_by_play: p });
const season = (): ParsedRows => rowsOf(plays(), stats());
// Previous season: enough for v3's tables to exist.
const prior = (): ParsedRows =>
  rowsOf(
    [pass(1, Q1, WR1, 25, { season: 2025 }), rush(2, RB1, 8, { season: 2025 }), pass(3, Q1, null, 0, { season: 2025 })],
    [stat(Q1, 1, "AAA", "QB", 2025), stat(WR1, 1, "AAA", "WR", 2025)],
  );

const W = 3;
const find = (rows: PlayerWeek[], id: string): PlayerWeek | undefined => rows.find((r) => r.player_id === id);

describe("projections", () => {
  it("backtest projections match xfp command output", () => {
    const proj = projectFold(season(), prior(), 2026, W);
    const skill = buildXfp(season(), 2026, W, prior()).players;
    const qbs = buildQb(season(), 2026, W, prior()).players;
    expect(skill.length).toBeGreaterThan(0);
    for (const p of skill) {
      const got = proj.find((x) => x.player_id === p.player_id)!;
      expect([got.v1, got.v2, got.v3, got.v4, got.baseline]).toEqual([p.xfp_per_game, p.v2.next, p.v3, p.v4?.next ?? null, p.actual_per_game]);
    }
    for (const q of qbs) {
      const got = proj.find((x) => x.player_id === q.player_id)!;
      expect([got.v1, got.v2, got.v3, got.v4, got.baseline]).toEqual([q.v1, q.v2.next, q.v3, q.v4?.next ?? null, q.actual_per_start]);
    }
    expect(proj.length).toBe(skill.length + qbs.length);
    // The fold's rows carry the same numbers.
    const row = find(scoreFold(season(), prior(), 2026, W).rows, WR1)!;
    const direct = proj.find((x) => x.player_id === WR1)!;
    expect([row.v1, row.v2, row.v3, row.v4, row.baseline]).toEqual([direct.v1, direct.v2, direct.v3, direct.v4, direct.baseline]);
  });

  const truncated = (): ParsedRows => {
    const s = season();
    return { ...s, play_by_play: s.play_by_play.filter((p) => p.week < W), stats_player: s.stats_player.filter((r) => r.week < W) };
  };

  it("xfp backtest does not leak week W", () => {
    // Week-W schedule stays (it names the opponent); week-W plays and stats go.
    expect(projectFold(season(), prior(), 2026, W)).toEqual(projectFold(truncated(), prior(), 2026, W));
  });

  it("week W data changes no projection", () => {
    const s = season();
    const altered: ParsedRows = {
      ...s,
      play_by_play: [
        ...s.play_by_play.map((p) => (p.week >= W ? { ...p, passing_yards: 400, receiving_yards: 400, rushing_yards: 90, complete_pass: 1 } : p)),
        pass(W, Q1, WR2, 80),
        pass(W + 1, Q2, WR1, 60),
        rush(W + 1, WR2, 70),
      ],
      stats_player: [...s.stats_player.map((r) => (r.week >= W ? { ...r, targets: 40, carries: 30, position: "TE" } : r)), stat("ZZZWR001", W, "AAA", "WR")],
    };
    expect(projectFold(altered, prior(), 2026, W)).toEqual(projectFold(season(), prior(), 2026, W));
  });
});

describe("baseline", () => {
  it("is the player's actual points per game over weeks before W", () => {
    // WR1 scored 2.5 in each of weeks 1-2, RB1 0.5; Q1 averaged 0.8 per start.
    const rows = scoreFold(season(), prior(), 2026, W).rows;
    expect(find(rows, WR1)!.baseline).toBeCloseTo(2.5);
    expect(find(rows, RB1)!.baseline).toBeCloseTo(0.5);
    expect(find(rows, Q1)!.baseline).toBeCloseTo(0.8);
    // Week 3 changes the outcome, not the baseline.
    expect(find(rows, WR1)!.actual).toBeCloseTo(3.5);
  });
});

describe("eligibility", () => {
  const fold = scoreFold(season(), prior(), 2026, W);
  const count = (position: string, reason: string): number => fold.exclusions.find((e) => e.position === position && e.reason === reason)?.count ?? 0;

  it("excludes a bye in both readings, not as a zero", () => {
    expect(find(fold.rows, C1)).toBeUndefined();
    expect(find(fold.rows, Q4)).toBeUndefined();
    expect(count("WR", "bye")).toBe(1);
    expect(count("QB", "bye")).toBe(1);
  });

  it("drops a player who did not play from main and scores him 0 in the sensitivity reading", () => {
    const wr2 = find(fold.rows, WR2)!;
    expect(wr2.seen).toBe(false);
    expect([wr2.in_main, wr2.in_sensitivity, wr2.actual]).toEqual([false, true, 0]);
    expect(count("WR", "not_seen")).toBe(1);
    const wr1 = find(fold.rows, WR1)!;
    expect([wr1.seen, wr1.in_main, wr1.in_sensitivity]).toEqual([true, true, true]);
  });

  it("scores a QB only as the week's starter in main, and the latest starter in sensitivity", () => {
    const q1 = find(fold.rows, Q1)!;
    expect([q1.week_starter, q1.latest_starter, q1.in_main, q1.in_sensitivity]).toEqual([true, true, true, true]);
    expect(q1.actual).toBeCloseTo(1.2);
    // R1 never started: below the minimum, in neither reading.
    expect(find(fold.rows, R1)).toBeUndefined();
    expect(count("QB", "min_games")).toBe(1);
  });

  it("does not prorate an in-game injury exit: the starter keeps his own points, the relief QB is outside the pool", () => {
    const q2 = find(fold.rows, Q2)!;
    expect([q2.week_starter, q2.latest_starter, q2.in_main, q2.in_sensitivity]).toEqual([false, true, false, true]);
    expect(q2.actual).toBeCloseTo(0.4);
    expect(find(fold.rows, R2)).toBeUndefined();
    expect(count("QB", "not_starter")).toBe(1);
    expect(count("QB", "no_history")).toBe(1);
  });

  it("counts a starter with fewer than 15 dropbacks without treating him differently", () => {
    expect(fold.low_dropback_starters).toBe(1);
  });
});

const wr = (o: Partial<PlayerWeek>): PlayerWeek => ({
  season: 2026,
  week: 3,
  player_id: "X",
  position: "WR",
  team: "AAA",
  opponent: "BBB",
  prior_games: 3,
  thin: false,
  seen: true,
  week_starter: null,
  latest_starter: null,
  in_main: true,
  in_sensitivity: true,
  actual: 0,
  baseline: 0,
  v1: 0,
  v2: 0,
  v3: 0,
  v4: 0,
  ...o,
});

describe("metrics", () => {
  it("MAE, RMSE, bias and Spearman equal the hand values", () => {
    // v1 = 10, 8, 6, 4 against actual 9, 11, 5, 0: errors 1, -3, 1, 4.
    const rows = [
      wr({ player_id: "A", v1: 10, actual: 9 }),
      wr({ player_id: "B", v1: 8, actual: 11 }),
      wr({ player_id: "C", v1: 6, actual: 5 }),
      wr({ player_id: "D", v1: 4, actual: 0 }),
    ];
    const s = statsFor(rows, "WR", "v1");
    expect(s.n).toBe(4);
    expect(s.mae).toBeCloseTo(2.25); // 9 / 4
    expect(s.rmse).toBeCloseTo(Math.sqrt(6.75)); // (1 + 9 + 1 + 16) / 4
    expect(s.bias).toBeCloseTo(0.75); // 3 / 4
    expect(s.spearman).toBeCloseTo(0.8); // ranks 4,3,2,1 against 3,4,2,1: 1 - 6*2 / (4*15)
    // Fewer than N = 24 players: every player is a slot, and every one is in the actual top.
    expect([s.top_n, s.hits, s.slots]).toEqual([24, 4, 4]);
  });

  it("top-N hit rate equals the hand value", () => {
    // 13 tight ends, N = 12. Projections 13..1 for P1..P13, actuals 1..13: the actual top 12 is P2..P13,
    // the projected top 12 is P1..P12, so P1 misses and 11 of 12 hit.
    const rows = Array.from({ length: 13 }, (_, i) => wr({ player_id: `P${String(i + 1).padStart(2, "0")}`, position: "TE", v1: 13 - i, actual: i + 1 }));
    const s = statsFor(rows, "TE", "v1");
    expect([s.top_n, s.hits, s.slots]).toEqual([12, 11, 12]);
  });

  it("sums hits and slots over weeks", () => {
    const wk = (week: number): PlayerWeek[] => [wr({ week, player_id: "A", v1: 2, actual: 2 }), wr({ week, player_id: "B", v1: 1, actual: 1 })];
    const s = statsFor([...wk(2), ...wk(3)], "WR", "v1");
    expect([s.hits, s.slots]).toEqual([4, 4]);
  });

  it("accuracy family reads only the MAE interval", () => {
    const b = (lo: number, hi: number) => ({ spearman_diff: { lo: 0.5, hi: 0.9 }, mae_diff: { lo, hi } });
    expect(accuracyVerdict(30, b(-2, -0.1))).toBe("beats");
    expect(accuracyVerdict(30, b(0.1, 2))).toBe("loses");
    expect(accuracyVerdict(30, b(-1, 1))).toBe("inconclusive");
    expect(accuracyVerdict(29, b(-2, -0.1))).toBe("inconclusive");
  });
});

describe("trend", () => {
  it("kendall tau equals the hand values", () => {
    expect(kendallTau([1, 2, 3, 4], [1, 2, 3, 4])).toBe(1);
    expect(kendallTau([1, 2, 3, 4], [4, 3, 2, 1])).toBe(-1);
    // Pairs: (1,2) +, (1,3) +, (1,4) +, (2,3) -, (2,4) +, (3,4) +: S = 4, tau = 4 / 6.
    expect(kendallTau([1, 2, 3, 4], [1, 3, 2, 4])).toBeCloseTo(4 / 6);
  });

  it("calls a steady rise an improvement for Spearman and a worsening for MAE, and fewer than 12 weeks no trend", () => {
    const weeks = Array.from({ length: 16 }, (_, i) => i + 2);
    const rising = weeks.map((w) => w / 20);
    expect(trendTest(weeks, rising, "up").trend).toBe("improves");
    expect(trendTest(weeks, rising, "down").trend).toBe("worsens");
    expect(trendTest(weeks.slice(0, 11), rising.slice(0, 11), "up").trend).toBe("no trend");
    expect(trendTest(weeks, weeks.map((w) => (w % 2) / 2), "up").trend).toBe("no trend");
  });
});

describe("a run", () => {
  const through = 3;
  const result = () => runXfpBacktest(season(), prior(), 2026, through);
  const keys = (v: unknown): string => Object.keys((v as Record<string, unknown>[])[0]!).join(",");

  it("verdict count equals the pre-registered total", () => {
    const { files, verdicts_total } = result();
    expect(verdicts_total).toBe(VERDICTS_TOTAL);
    expect(VERDICTS_TOTAL).toBe(360);
    expect((files["verdicts.json"] as unknown[]).length).toBe(320);
    expect((files["trend.json"] as unknown[]).length).toBe(40);
    const summary = files["summary.json"] as Record<string, unknown>;
    expect(summary["verdicts_total"]).toBe(360);
    expect(summary["of_total_text"]).toContain("of 360 verdicts");
  });

  it("computes block metrics for every block, scope and method", () => {
    const blocks = result().files["block-metrics.json"] as { reading: string; scope: string; position: string; method: string; n: number }[];
    expect(blocks.length).toBe(2 * 5 * 4 * 5);
    const pooledWr = blocks.find((b) => b.reading === "main" && b.scope === "pooled" && b.position === "WR" && b.method === "v1")!;
    const block1Wr = blocks.find((b) => b.reading === "main" && b.scope === "block-1" && b.position === "WR" && b.method === "v1")!;
    const block2Wr = blocks.find((b) => b.reading === "main" && b.scope === "block-2" && b.position === "WR" && b.method === "v1")!;
    expect(pooledWr.n).toBe(block1Wr.n);
    expect(block2Wr.n).toBe(0);
  });

  it("writes exactly the files and columns of the plan's output schema", () => {
    const { files } = result();
    expect(Object.keys(files).sort()).toEqual(
      [
        "block-metrics.json",
        "exclusions.json",
        "fold-02-player-weeks.json",
        "fold-03-player-weeks.json",
        "settling-and-edge.json",
        "summary.json",
        "trend.json",
        "verdicts.json",
        "weekly-metrics.json",
      ].sort(),
    );
    expect(keys(files["fold-03-player-weeks.json"])).toBe(
      "season,week,player_id,position,team,opponent,prior_games,thin,seen,week_starter,latest_starter,in_main,in_sensitivity,actual,baseline,v1,v2,v3,v4",
    );
    expect(keys(files["exclusions.json"])).toBe("week,position,reason,count");
    expect(keys(files["weekly-metrics.json"])).toBe("reading,week,position,method,n,mae,rmse,bias,spearman,top_n,hits,slots");
    expect(keys(files["block-metrics.json"])).toBe("reading,scope,position,method,n,mae,rmse,bias,spearman,top_n,hits,slots,hit_rate,wilson_lo,wilson_hi");
    expect(keys(files["verdicts.json"])).toBe(
      "family,model,baseline,position,scope,n_main,n_sensitivity,verdict_main,verdict_sensitivity,verdict_combined,spearman_diff_lo_main,spearman_diff_hi_main,spearman_diff_lo_sens,spearman_diff_hi_sens,mae_diff_lo_main,mae_diff_hi_main,mae_diff_lo_sens,mae_diff_hi_sens",
    );
    expect(keys(files["trend.json"])).toBe("method,position,statistic,tau_main,p_main,trend_main,tau_sens,p_sens,trend_sens,trend_combined,weeks_main,weeks_sens");
    const settling = files["settling-and-edge.json"] as Record<string, unknown>[];
    expect(settling.filter((r) => "comparison" in r).map((r) => Object.keys(r).join(","))[0]).toBe("position,family,comparison,block1,block2,block3,block4,settling_week");
    expect(settling.filter((r) => "pair" in r).map((r) => Object.keys(r).join(","))[0]).toBe("position,family,pair,block1,block2,block3,block4,edge");
    expect(settling.length).toBe(4 * 2 * (4 + 2));
    // Derived only: ids, no names.
    expect(JSON.stringify(files)).not.toContain("player_display_name");
  });

  it("is identical across two runs", () => {
    expect(JSON.stringify(result().files)).toBe(JSON.stringify(result().files));
  });
});

describe("command", () => {
  it("parses strictly", () => {
    expect(parseXfpBacktestArgs(["--season", "2025", "--through", "17"])).toEqual({ season: 2025, through: 17 });
    expect(parseXfpBacktestArgs(["--season", "2025", "--through", "17", "--out", "x"])).toEqual({ season: 2025, through: 17, out: "x" });
    for (const bad of [[], ["--season", "2025"], ["--through", "17"], ["--season", "25", "--through", "17"], ["--season", "2025", "--through", "1"], ["--season", "2025", "--through", "18"], ["--season", "2025", "--through", "9", "--bogus", "1"], ["--season", "2025", "--season", "2025", "--through", "9"], ["--season", "2025", "--through"]]) {
      expect(parseXfpBacktestArgs(bad)).toBeNull();
    }
  });

  it("exits non-zero with usage for bad or missing arguments, without fetching", async () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const collect = vi.fn();
    expect(await run(["xfp-backtest", "--season", "2025"], collect)).toBe(1);
    expect(await run(["xfp-backtest"], collect)).toBe(1);
    expect(collect).not.toHaveBeenCalled();
    expect(String(err.mock.calls[0]![0])).toContain("usage:");
    err.mockRestore();
  });

  it("fails with a clear message, not a stack trace, when the data cannot be fetched", async () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const collect = vi.fn().mockRejectedValue(new Error("stats_player: fetching https://example.invalid returned status 404"));
    expect(await run(["xfp-backtest", "--season", "2025", "--through", "17"], collect)).toBe(1);
    const message = String(err.mock.calls[0]![0]);
    expect(message).toContain("could not fetch");
    expect(message).toContain("2025");
    expect(message).not.toMatch(/\n\s+at /);
    // The previous season is fetched through the same collector as the xfp command does.
    expect(collect).toHaveBeenCalledWith(2025);
    err.mockRestore();
  });
});
