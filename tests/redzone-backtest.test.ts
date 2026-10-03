import { mkdtempSync, readFileSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  collectInputs,
  nflverseUrls,
  parseCsv,
  parseInputs,
  SEEN_ID_COLUMNS,
  type FetchLike,
  type NflverseFile,
  type ParsedRows,
  type PlayByPlayRow,
} from "../src/nflverse.js";
import { run } from "../src/nflverse-cli.js";
import {
  completedWeeks,
  features,
  predictFold,
  rankPerPosition,
  type Candidate,
  recomputeCheck,
  runBacktest,
  scoreFold,
  teamFlags,
} from "../src/redzone-backtest.js";

const DIR = new URL("./fixtures/nflverse/", import.meta.url);
const FILES: Record<NflverseFile, string> = {
  stats_player: "stats_player_week_2026.csv",
  snap_counts: "snap_counts_2026.csv",
  injuries: "injuries_2026.csv",
  games: "games.csv",
  play_by_play: "play_by_play_2026.csv.gz",
};
const byUrl = new Map(Object.entries(nflverseUrls(2026)).map(([file, url]) => [url, file as NflverseFile]));
const fixtureFetch: FetchLike = async (url) => {
  const body = readFileSync(new URL(FILES[byUrl.get(url)!], DIR));
  return { status: 200, arrayBuffer: async () => new Uint8Array(body).buffer };
};
const collect = (): ReturnType<typeof collectInputs> => collectInputs(2026, fixtureFetch, () => new Date("2026-10-01T08:00:00Z"));
const real: ParsedRows = parseInputs(await collect());

const COLS = [
  "game_id", "season", "week", "season_type", "posteam", "play_type", "pass", "rush", "yardline_100",
  "two_point_attempt", "qb_kneel", "qb_spike", "down", "wp", "pass_oe",
  "receiver_player_id", "receiver_player_name", "rusher_player_id", "rusher_player_name",
  "complete_pass", "touchdown", "td_player_id", "sack",
] as const;
type Col = (typeof COLS)[number];

/** Builds rows through the real schema from a few columns; everything else is empty, as in the file. */
function plays(...specs: Partial<Record<Col, string | number>>[]): PlayByPlayRow[] {
  const base: Partial<Record<Col, string | number>> = { season: 2026, week: 1, season_type: "REG", posteam: "CLE", game_id: "g1" };
  const lines = specs.map((s) => COLS.map((c) => String({ ...base, ...s }[c] ?? "")).join(","));
  return parseCsv("play_by_play", [COLS.join(","), ...lines].join("\n"));
}
const withPlays = (p: PlayByPlayRow[]): ParsedRows => ({ ...real, play_by_play: p });

/** Two CLE skill players with overall targets or carries in week 1, from the real usage table. */
const [P1, P2] = predictFold(real, 2026, 2)
  .candidates.filter((c) => c.team === "CLE" && c.overall_looks > 0)
  .map((c) => c.player_id) as [string, string];

describe("red-zone looks, touches and TDs", () => {
  // Week 1 features: a target for P1, a carry for P2; a two-point try, a spike and a kneel do not count.
  const week1 = plays(
    { pass: 1, yardline_100: 10, two_point_attempt: 0, receiver_player_id: P1 },
    { pass: 1, yardline_100: 8, two_point_attempt: 1, receiver_player_id: P1 },
    { pass: 1, yardline_100: 3, two_point_attempt: 0, qb_spike: 1, receiver_player_id: P1 },
    { rush: 1, yardline_100: 5, two_point_attempt: 0, rusher_player_id: P2 },
    { rush: 1, yardline_100: 1, two_point_attempt: 0, qb_kneel: 1, rusher_player_id: "QB-X" },
  );
  const week2 = plays(
    { week: 2, game_id: "g2", pass: 1, yardline_100: 15, two_point_attempt: 0, receiver_player_id: P1, complete_pass: 1, touchdown: 1, td_player_id: P1 },
    { week: 2, game_id: "g2", pass: 1, yardline_100: 12, two_point_attempt: 0, receiver_player_id: P1, complete_pass: 0 },
    { week: 2, game_id: "g2", rush: 1, yardline_100: 3, two_point_attempt: 0, rusher_player_id: P2, touchdown: 1, td_player_id: P2 },
    { week: 2, game_id: "g2", rush: 1, yardline_100: 25, two_point_attempt: 0, rusher_player_id: P2 },
  );

  it("counts features without kneels, spikes or two-point tries", () => {
    const f = features(week1, 2026, 2);
    expect(f.players.get(P1)).toMatchObject({ targets: 1, carries: 0 });
    expect(f.players.get(P2)).toMatchObject({ targets: 0, carries: 1 });
    expect(f.players.has("QB-X")).toBe(false);
    expect([f.teamTargets.get("CLE"), f.teamCarries.get("CLE"), f.teamGames.get("CLE")]).toEqual([1, 1, 1]);
  });

  it("projects share x team looks per game and counts week-2 looks, touches and TDs", () => {
    const fold = scoreFold(withPlays([...week1, ...week2]), 2026, 2);
    const a = fold.rows.find((r) => r.player_id === P1)!;
    const b = fold.rows.find((r) => r.player_id === P2)!;
    expect(a).toMatchObject({ rz_look_share: 0.5, team_rz_looks_per_game: 2, proj_looks: 1, b2_proj: 1 });
    expect(a).toMatchObject({ actual_looks: 2, actual_targets: 2, actual_carries: 0, actual_touches: 1, actual_tds: 1 });
    expect(a.actual_looks_share).toBe(0.6667);
    expect(b).toMatchObject({ actual_looks: 1, actual_carries: 1, actual_touches: 1, actual_tds: 1, actual_looks_share: 0.3333 });
  });

  it("reports the largest difference from buildRedZone, which counts the kneel as a carry", () => {
    // buildRedZone: P2 has 1 of 2 team carries (0.5) and QB-X 0.5; recomputed, P2 has 1 of 1 and QB-X none.
    expect(recomputeCheck(week1, 2026, 2)).toBe(0.5);
    expect(recomputeCheck(week2, 2026, 3)).toBe(0);
  });
});

describe("eligibility", () => {
  it("excludes a team with no week-W plays as bye, not as zeros", () => {
    const noCleWeek3 = real.play_by_play.filter((p) => !(p.week === 3 && (p.posteam === "CLE" || p.game_id.includes("CLE"))));
    const fold = scoreFold(withPlays(noCleWeek3), 2026, 3);
    expect(fold.rows.filter((r) => r.team === "CLE")).toEqual([]);
    // No team has a week-3 play left, so every candidate is on a bye.
    const byes = Object.values(fold.exclusions).reduce((n, e) => n + e.bye, 0);
    expect(byes).toBe(predictFold(real, 2026, 3).candidates.length);
    expect(fold.rows).toEqual([]);
  });

  it("excludes a player the week's plays never mention as not seen, and scores him only in the sensitivity reading", () => {
    const full = scoreFold(real, 2026, 3);
    const target = full.rows.find((r) => r.seen && r.actual_looks > 0)!;
    const mentions = (p: PlayByPlayRow): boolean =>
      [p.receiver_player_id, p.rusher_player_id, ...SEEN_ID_COLUMNS.map((c) => p[c])].includes(target.player_id);
    const fold = scoreFold(withPlays(real.play_by_play.filter((p) => !(p.week === 3 && mentions(p)))), 2026, 3);
    const row = fold.rows.find((r) => r.player_id === target.player_id)!;
    expect(row).toMatchObject({ seen: false, actual_looks: 0 });
    const notSeen = Object.values(fold.exclusions).reduce((n, e) => n + e.not_seen, 0);
    expect(notSeen).toBe(fold.rows.filter((r) => !r.seen).length);
    expect(notSeen).toBeGreaterThan(0);
  });

  it("excludes players with no stats row before W as no_history, and players with no target or carry", () => {
    const fold = scoreFold(real, 2026, 3);
    // Opponents' players have no stats rows in the CLE-only fixture.
    expect(fold.exclusions.unknown.no_history).toBeGreaterThan(0);
    const played = new Set(real.play_by_play.filter((p) => p.week === 3).map((p) => p.posteam));
    const none = predictFold(real, 2026, 3).candidates.filter((c) => c.overall_looks === 0 && played.has(c.team)).length;
    expect(none).toBeGreaterThan(0);
    expect(Object.values(fold.exclusions).reduce((n, e) => n + e.no_target_or_carry, 0)).toBe(none);
    expect(fold.rows.every((r) => r.overall_looks > 0 && r.rz_look_share !== null)).toBe(true);
  });
});

describe("team flags", () => {
  const rate = (pass: number, run: number, extra: Partial<Record<Col, string | number>>[] = []): PlayByPlayRow[] =>
    plays(
      ...Array.from({ length: pass }, () => ({ play_type: "pass", pass: 1, yardline_100: 12, two_point_attempt: 0 })),
      ...Array.from({ length: run }, () => ({ play_type: "run", rush: 1, pass: 0, yardline_100: 6, two_point_attempt: 0 })),
      ...extra,
    );
  const label = (p: PlayByPlayRow[]): string => teamFlags(p, 2026, 2).find((t) => t.team === "CLE")!.label;

  it("takes pass / (pass + run) with kneels, spikes, two-point tries and plays outside the 20 left out, sacks in", () => {
    const flags = teamFlags(
      rate(2, 2, [
        { play_type: "pass", pass: 1, sack: 1, yardline_100: 9, two_point_attempt: 0 },
        { play_type: "qb_kneel", rush: 1, qb_kneel: 1, yardline_100: 2, two_point_attempt: 0 },
        { play_type: "qb_spike", pass: 1, qb_spike: 1, yardline_100: 4, two_point_attempt: 0 },
        { play_type: "pass", pass: 1, yardline_100: 5, two_point_attempt: 1 },
        { play_type: "pass", pass: 1, yardline_100: 30, two_point_attempt: 0 },
      ]),
      2026,
      2,
    );
    expect(flags[0]).toMatchObject({ rz_plays: 5, rz_pass_plays: 3, rz_sacks: 1, rz_pass_rate: 0.6, label: "too_few_plays" });
  });

  it("labels on the plan's thresholds and withholds a label under 20 plays", () => {
    expect(label(rate(12, 8))).toBe("pass_first"); // 0.60 exactly
    expect(label(rate(9, 11))).toBe("run_first"); // 0.45 exactly
    expect(label(rate(10, 10))).toBe("neutral");
    expect(label(rate(12, 7))).toBe("too_few_plays"); // 19 plays
  });

  it("scores whether the label held next week against the league's pooled week-W rate", () => {
    const week1 = rate(12, 8);
    const week2 = plays(
      { week: 2, game_id: "g2", play_type: "pass", pass: 1, yardline_100: 9, two_point_attempt: 0, receiver_player_id: P1 },
      { week: 2, game_id: "g2", play_type: "run", rush: 1, pass: 0, yardline_100: 9, two_point_attempt: 0, rusher_player_id: P2 },
      { week: 2, game_id: "g2", play_type: "pass", pass: 1, yardline_100: 9, two_point_attempt: 0, receiver_player_id: P1 },
      { week: 2, game_id: "g3", posteam: "CAR", play_type: "run", rush: 1, pass: 0, yardline_100: 9, two_point_attempt: 0 },
    );
    const [nw] = scoreFold(withPlays([...week1, ...week2]), 2026, 2).next_week;
    // CLE passed 2 of 3 (0.6667) against a league rate of 2 of 4 (0.5).
    expect(nw).toMatchObject({ team: "CLE", label: "pass_first", rz_pass_rate_next: 0.6667, league_rz_pass_rate_next: 0.5, tendency_kept: true, rz_looks_next: 3 });
  });
});

describe("leakage", () => {
  it("leaves fold W's predictions unchanged when week-W and later plays are added", () => {
    const before = { ...real, play_by_play: real.play_by_play.filter((p) => p.week < 3), stats_player: real.stats_player.filter((r) => r.week < 3) };
    const extra = plays(
      { week: 3, game_id: "2026_03_CAR_CLE", rush: 1, yardline_100: 2, two_point_attempt: 0, rusher_player_id: P2, play_type: "run" },
      { week: 4, game_id: "2026_04_PIT_CLE", pass: 1, yardline_100: 2, two_point_attempt: 0, receiver_player_id: P1, play_type: "pass" },
    );
    const after = { ...real, play_by_play: [...real.play_by_play, ...extra] };
    const a = predictFold(before, 2026, 3);
    const b = predictFold(after, 2026, 3);
    expect(b.candidates).toEqual(a.candidates);
    expect(b.flags).toEqual(a.flags);
  });
});

describe("backtest run", () => {
  it("finds completed weeks from the play-by-play, so a new week needs no code", () => {
    const played = new Set(real.play_by_play.map((p) => p.game_id));
    const games = real.games.filter((g) => played.has(g.game_id));
    expect(completedWeeks(games, real.play_by_play, 2026)).toEqual([1, 2, 3]);
    // The week-4 game is on the schedule with no plays yet: not a completed week.
    expect(completedWeeks([...games, ...real.games.filter((g) => g.week === 4)], real.play_by_play, 2026)).toEqual([1, 2, 3]);
    // Every game on the schedule needs plays; the fixture holds only CLE's.
    expect(completedWeeks(real.games, real.play_by_play, 2026)).toEqual([]);
  });

  it("scores folds 1->2 and 1-2->3 and ranks week 4, deterministically, calling thin samples inconclusive", () => {
    const out = runBacktest(real, 2026, 3);
    expect(out.folds.map((f) => f.week)).toEqual([2, 3]);
    expect(out.forward_week).toBe(4);
    for (const pos of ["WR", "TE", "RB"] as const) {
      const p = out.summary.positions[pos]!;
      expect(p.sensitivity_unseen_as_zero.n).toBeLessThan(30);
      expect(Object.values(p.combined_verdicts)).toEqual(["inconclusive", "inconclusive", "inconclusive", "inconclusive"]);
    }
    expect(Object.keys(out.forward.ranking)).toEqual(["WR", "TE", "RB"]);
    const first = [...out.forward.ranking.WR, ...out.forward.ranking.TE, ...out.forward.ranking.RB][0];
    expect(first).toHaveProperty("team_flag");
    expect(first).toHaveProperty("b1_proj");
    expect(first).toHaveProperty("overall_target_share");
    expect(runBacktest(real, 2026, 3)).toEqual(out);
  });

  it("reports secondary outcomes per position and reading with no verdict, leaving combined_verdicts as the primary verdicts give them", () => {
    const out = runBacktest(real, 2026, 3);
    for (const pos of ["WR", "TE", "RB"] as const) {
      const p = out.summary.positions[pos]!;
      for (const reading of [p.seen_rule, p.sensitivity_unseen_as_zero]) {
        const so = reading.secondary_outcomes;
        expect(Object.keys(so)).toEqual(["touches", "tds", "targets", "carries"]);
        for (const o of Object.values(so)) {
          expect(Object.keys(o.methods)).toEqual(["model", "b1", "b1b", "b2", "b3"]);
          for (const m of Object.values(o.methods)) expect(Object.keys(m)).toEqual(["spearman", "mae"]);
          expect(o).not.toHaveProperty("verdict");
          expect(o).not.toHaveProperty("verdicts");
        }
        expect(so.touches.projection.model).toBe("proj_looks");
        expect(so.tds.projection.model).toBe("proj_looks");
        expect(so.targets.projection.model).toBe("proj_targets");
        expect(so.carries.projection.model).toBe("proj_carries");
      }
      const recomputed = Object.fromEntries(
        (["b1", "b1b", "b2", "b3"] as const).map((b) => {
          const [a, c] = [p.seen_rule.verdicts[b], p.sensitivity_unseen_as_zero.verdicts[b]];
          return [b, a === c ? a : "inconclusive"];
        }),
      );
      expect(p.combined_verdicts).toEqual(recomputed);
    }
  });

  it("ranks per position by projected looks, so a one-target player on a no-volume team sits below a volume player", () => {
    const base = predictFold(real, 2026, 3).candidates[0]!;
    const mk = (id: string, position: Candidate["position"], over: Partial<Candidate>): Candidate => ({
      ...base,
      player_id: id,
      position,
      overall_looks: 5,
      rz_look_share: 0.2,
      ...over,
    });
    const ranked = rankPerPosition(
      [
        mk("hooper", "TE", { rz_targets: 1, rz_target_share: 1, proj_looks: 0.33 }),
        mk("volume", "TE", { rz_targets: 3, rz_target_share: 0.5, proj_looks: 2.5 }),
        mk("tie-b", "TE", { rz_targets: 1, proj_looks: 1 }),
        mk("tie-a", "TE", { rz_targets: 2, proj_looks: 1 }),
        mk("wr", "WR", { rz_targets: 2, proj_looks: 0.5 }),
        mk("no-history", "WR", { overall_looks: 0, proj_looks: 9 }),
        mk("null-share", "WR", { rz_look_share: null, proj_looks: 9 }),
      ],
      20,
    );
    expect(ranked.TE.map((c) => c.player_id)).toEqual(["volume", "tie-a", "tie-b", "hooper"]);
    expect(ranked.WR.map((c) => c.player_id)).toEqual(["wr"]);
    expect(ranked.RB).toEqual([]);
    expect(rankPerPosition(ranked.TE, 2).TE).toHaveLength(2);
  });

  it("refuses to run with fewer than two completed weeks", () => {
    expect(() => runBacktest(real, 2026)).toThrow(/two completed weeks/);
  });

  it("the CLI writes folds, summary and ranking with input hashes, under the directory it is given", async () => {
    const dir = mkdtempSync(join(tmpdir(), "backtest-"));
    expect(await run(["backtest", "--season", "2026", "--out", dir, "--through", "3"], collect)).toBe(0);
    expect(readdirSync(join(dir, "backtest")).sort()).toEqual([
      "fold-02-predictions.json",
      "fold-02-team-flags.json",
      "fold-03-predictions.json",
      "fold-03-team-flags.json",
      "summary.json",
    ]);
    const summary = JSON.parse(readFileSync(join(dir, "backtest", "summary.json"), "utf8"));
    expect(summary.inputs.map((i: { file: string }) => i.file)).toHaveLength(5);
    expect(summary.inputs[0].sha256).toMatch(/^[0-9a-f]{64}$/);
    expect(summary.attribution.license).toBe("CC-BY 4.0");
    expect(summary.bootstrap).toMatchObject({ resamples: 2000, seed: 20261001 });
    expect(summary.recompute_check.max_abs_diff).toBeGreaterThanOrEqual(0);
    const ranking = JSON.parse(readFileSync(join(dir, "week-04", "red-zone-ranking.json"), "utf8"));
    expect(ranking).toMatchObject({ target_week: 4, uses_weeks: "1..3" });
  });
});
