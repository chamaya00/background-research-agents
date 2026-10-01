import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { collectInputs, nflverseUrls, parseCsv, parseInputs, type FetchLike, type NflverseFile, type ParsedRows, type PlayByPlayRow } from "../src/nflverse.js";
import { blockOf, median, settlingWeek, volumeMatters, type Verdict } from "../src/backtest-stats.js";
import {
  foldVolume,
  runBacktest,
  scoreFold,
  summarise,
  withAllField,
  POSITIONS,
  type FoldResult,
  type Position,
  type ScoredRow,
  type TeamFlag,
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
const real: ParsedRows = parseInputs(await collectInputs(2026, fixtureFetch, () => new Date("2026-10-01T08:00:00Z")));

const COLS = [
  "game_id", "season", "week", "season_type", "posteam", "play_type", "pass", "rush", "yardline_100",
  "two_point_attempt", "qb_kneel", "qb_spike", "down", "wp", "pass_oe",
  "receiver_player_id", "receiver_player_name", "rusher_player_id", "rusher_player_name",
] as const;
type Col = (typeof COLS)[number];
function plays(...specs: Partial<Record<Col, string | number>>[]): PlayByPlayRow[] {
  const base: Partial<Record<Col, string | number>> = { season: 2026, week: 1, season_type: "REG", posteam: "CLE", game_id: "g1" };
  const lines = specs.map((s) => COLS.map((c) => String({ ...base, ...s }[c] ?? "")).join(","));
  return parseCsv("play_by_play", [COLS.join(","), ...lines].join("\n"));
}

/** `looks` week-1 red-zone targets for a team, plus one week-2 play so it "played week 2". */
const team = (name: string, looks: number): Partial<Record<Col, string | number>>[] => [
  ...Array.from({ length: looks }, (_, i) => ({
    posteam: name,
    game_id: name + "-1",
    week: 1,
    pass: 1,
    yardline_100: 10,
    two_point_attempt: 0,
    receiver_player_id: name + "-r" + String(i),
  })),
  { posteam: name, game_id: name + "-2", week: 2, play_type: "run", rush: 1, yardline_100: 50, two_point_attempt: 0 },
];

describe("block and settling-week rules", () => {
  it("maps target weeks to the four blocks", () => {
    expect([1, 2, 5, 6, 9, 10, 13, 14, 17, 18].map(blockOf)).toEqual([null, 1, 1, 2, 2, 3, 3, 4, 4, null]);
  });

  it("finds the settling week from the combined verdicts of the four blocks", () => {
    const b: Verdict = "beats";
    const i: Verdict = "inconclusive";
    const l: Verdict = "loses";
    expect(settlingWeek([b, b, b, b])).toBe(2);
    expect(settlingWeek([i, b, b, b])).toBe(6);
    expect(settlingWeek([b, i, b, b])).toBe(10);
    expect(settlingWeek([i, i, i, b])).toBe(14);
    expect(settlingWeek([b, b, b, i])).toBe("none");
    expect(settlingWeek([l, l, l, l])).toBe("none");
  });

  it("applies the k = 3 of 4 rule: High beats and Low does not", () => {
    const b: Verdict = "beats";
    const i: Verdict = "inconclusive";
    expect(volumeMatters([b, b, b, i], [i, i, i, i])).toBe(true);
    expect(volumeMatters([b, b, i, i], [i, i, i, i])).toBe(false);
    // High beats everywhere, but Low also beats in two blocks: only 2 of 4 qualify.
    expect(volumeMatters([b, b, b, b], [b, b, i, i])).toBe(false);
  });
});

describe("volume measures and strata", () => {
  it("takes the median of an even count, with a tie at the median going High", () => {
    expect(median([5, 1, 3, 3])).toBe(3);
    expect(median([1, 2, 4, 5])).toBe(3);
    const tie = foldVolume(plays(...team("AAA", 1), ...team("BBB", 3), ...team("CCC", 3), ...team("DDD", 5)), 2026, 2);
    expect(tie.medians.team_rz_total).toBe(3);
    expect(tie.teams.map((t) => [t.team, t.team_rz_total, t.stratum_team_rz_total])).toEqual([
      ["AAA", 1, "Low"],
      ["BBB", 3, "High"],
      ["CCC", 3, "High"],
      ["DDD", 5, "High"],
    ]);
    const split = foldVolume(plays(...team("AAA", 1), ...team("BBB", 2), ...team("CCC", 4), ...team("DDD", 5)), 2026, 2);
    expect(split.medians.team_rz_total).toBe(3);
    expect(split.teams.map((t) => t.stratum_team_rz_total)).toEqual(["Low", "Low", "High", "High"]);
    // One game each, so looks per game equals the total here.
    expect(split.medians.team_rz_looks_per_game).toBe(3);
    expect(split.teams.map((t) => t.stratum_team_rz_looks_per_game)).toEqual(["Low", "Low", "High", "High"]);
  });

  it("uses weeks before W only: week-W plays leave measures, medians and strata unchanged", () => {
    const base = plays(...team("AAA", 1), ...team("BBB", 3), ...team("CCC", 3), ...team("DDD", 5));
    const extra = plays(
      ...Array.from({ length: 9 }, (_, i) => ({
        posteam: "AAA",
        game_id: "AAA-2",
        week: 2,
        pass: 1,
        yardline_100: 5,
        two_point_attempt: 0,
        receiver_player_id: "x" + String(i),
      })),
      { posteam: "BBB", game_id: "BBB-3", week: 3, pass: 1, yardline_100: 5, two_point_attempt: 0, receiver_player_id: "y" },
    );
    expect(foldVolume([...base, ...extra], 2026, 2)).toEqual(foldVolume(base, 2026, 2));
  });
});

describe("all-field labels", () => {
  it("recomputes CLE's fold 3 all-field rate and label independently", () => {
    const cle = real.play_by_play.filter(
      (p) =>
        p.season === 2026 &&
        p.season_type === "REG" &&
        p.posteam === "CLE" &&
        p.week < 3 &&
        (p.play_type === "pass" || p.play_type === "run") &&
        !p.qb_kneel &&
        !p.qb_spike &&
        !p.two_point_attempt,
    );
    // As in the red-zone rate (plan section 5), the numerator is the `pass` flag: sacks count as passes.
    const pass = cle.filter((p) => p.pass === 1).length;
    const rate = pass / cle.length;
    const label = cle.length < 20 ? "too_few_plays" : rate >= 0.6 ? "pass_first" : rate <= 0.45 ? "run_first" : "neutral";
    const flag = scoreFold(real, 2026, 3).flags.find((t) => t.team === "CLE")!;
    expect(flag.all_field_plays).toBe(cle.length);
    expect(flag.all_field_pass_rate).toBe(Math.round(rate * 1e4) / 1e4);
    expect(flag.all_field_label).toBe(label);
  });

  it("carries no verdict on the all-field fields or on the disagreement counts", () => {
    const out = runBacktest(real, 2026, 3);
    const flag = out.folds[1]!.flags[0]!;
    expect(Object.keys(flag).filter((k) => k.startsWith("all_field")).sort()).toEqual(["all_field_label", "all_field_pass_rate", "all_field_plays"]);
    expect(Object.keys(flag).filter((k) => /verdict|held|kept/.test(k))).toEqual([]);
    for (const f of out.summary.team_flags.per_fold) {
      expect(Object.keys(f.label_disagreements)).toEqual(["both_labelled", "differ", "red_zone_only"]);
    }
  });

  it("does not leak week-W plays into the all-field rate", () => {
    const base = plays(...team("AAA", 1));
    const more = plays({ posteam: "AAA", week: 2, game_id: "AAA-2", play_type: "pass", pass: 1, yardline_100: 40, two_point_attempt: 0 });
    const flags = [{ team: "AAA" }] as TeamFlag[];
    expect(withAllField(flags, [...base, ...more], 2026, 2)).toEqual(withAllField(flags, base, 2026, 2));
  });
});

/** Synthetic folds: 8 teams per fold, each with two players per position, spread projections and outcomes. */
function syntheticFolds(weeks: number[], withRows = true): FoldResult[] {
  return weeks.map((w) => {
    const teams = Array.from({ length: 8 }, (_, t) => "T" + String(t));
    const rows: ScoredRow[] = withRows
      ? teams.flatMap((tm, t) =>
          POSITIONS.flatMap((pos: Position) =>
            [0, 1].map((k) => {
              const seed = (w * 7 + t * 13 + k * 5 + pos.length * 3) % 11;
              return {
                player_id: tm + "-" + pos + "-" + String(k),
                player: "p",
                position: pos,
                team: tm,
                overall_looks: 5,
                rz_targets: 1,
                rz_carries: 1,
                rz_target_share: 0.1,
                rz_carry_share: 0.1,
                rz_look_share: 0.1,
                team_rz_looks_per_game: 3,
                proj_looks: (seed * 3) % 5,
                proj_targets: 1,
                proj_carries: 1,
                overall_target_share: 0.1,
                b1_proj: (seed * 5) % 4,
                b1b_proj: (seed * 2) % 6,
                b2_proj: seed % 3,
                b3_proj: (seed * 7) % 5,
                fold: w,
                seen: seed !== 4,
                actual_looks: (seed * 3 + t) % 5,
                actual_targets: 1,
                actual_carries: 1,
                actual_touches: 1,
                actual_tds: 0,
                actual_looks_share: 0.1,
                actual_targets_share: 0.1,
                actual_carries_share: 0.1,
              } satisfies ScoredRow;
            }),
          ),
        )
      : [];
    const volTeams = teams.map((tm, t) => ({
      team: tm,
      team_rz_total: t,
      team_rz_looks_per_game: t,
      stratum_team_rz_total: t >= 4 ? ("High" as const) : ("Low" as const),
      stratum_team_rz_looks_per_game: t % 2 === 0 ? ("High" as const) : ("Low" as const),
    }));
    return {
      week: w,
      rows,
      flags: [],
      next_week: [],
      recompute_max_abs_diff: 0,
      exclusions: {} as FoldResult["exclusions"],
      volume: { medians: { team_rz_total: 3.5, team_rz_looks_per_game: 3.5 }, teams: volTeams },
    };
  });
}
const range = (a: number, b: number): number[] => Array.from({ length: b - a + 1 }, (_, i) => a + i);

describe("block and stratum summaries", () => {
  it("counts 252 verdicts with four blocks and 72 with one", () => {
    const four = summarise(syntheticFolds(range(2, 17), false));
    expect(four.verdict_count).toBe(252);
    expect(four.beats_count).toBe(0);
    expect(Object.keys(four.blocks)).toEqual(["1", "2", "3", "4"]);
    expect(four.settling_week).not.toBeNull();
    const one = summarise(syntheticFolds(range(2, 5), false));
    expect(one.verdict_count).toBe(12 + 12 + 48);
  });

  it("reports a block's entry as the existing evaluation on exactly that block's folds", () => {
    const folds = syntheticFolds(range(2, 9));
    const s = summarise(folds);
    expect(s.blocks["2"]!.weeks).toEqual([6, 7, 8, 9]);
    expect(s.blocks["2"]!.positions).toEqual(summarise(folds.filter((f) => f.week >= 6)).positions);
    expect(s.blocks["1"]!.positions).toEqual(summarise(folds.filter((f) => f.week <= 5)).positions);
  });

  it("reports a stratum's verdicts as the existing evaluation on exactly that stratum's rows", () => {
    const folds = syntheticFolds(range(2, 5));
    const s = summarise(folds);
    const lowRows = folds.map((f) => ({ ...f, rows: f.rows.filter((r) => Number(r.team.slice(1)) < 4) }));
    expect(s.volume.team_rz_total["1"]!.Low).toEqual(summarise(lowRows).positions);
    const highRows = folds.map((f) => ({ ...f, rows: f.rows.filter((r) => Number(r.team.slice(1)) % 2 === 0) }));
    expect(s.volume.team_rz_looks_per_game["1"]!.High).toEqual(summarise(highRows).positions);
  });

  it("leaves settling weeks and volume determinations null with fewer than four blocks", () => {
    const s = runBacktest(real, 2026, 3).summary;
    expect(Object.keys(s.blocks)).toEqual(["1"]);
    expect(s.blocks["1"]!.weeks).toEqual([2, 3]);
    expect(s.settling_week).toBeNull();
    expect(s.settling_week_reason).toBe("fewer than four blocks");
    expect(s.volume_matters.team_rz_total!.WR!.b1).toBeNull();
    expect(s.volume_thresholds.per_fold.map((f) => f.fold)).toEqual([2, 3]);
  });

  it("keeps the pre-existing summary keys and per-fold flag keys", () => {
    const out = runBacktest(real, 2026, 3);
    for (const k of ["folds", "plan", "bootstrap", "minimum_scored_player_weeks", "recompute_check", "excluded_player_weeks", "positions", "team_flags"]) {
      expect(out.summary).toHaveProperty(k);
    }
    expect(out.summary.positions).toEqual(summarise(out.folds).positions);
    expect(out.summary.team_flags.per_fold[0]).toMatchObject({ fold: 2, labelled: expect.any(Number), rz_pass_plays: expect.any(Number) });
  });
});
