import { readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { describe, expect, it } from "vitest";
import { parseCsv, type PlayByPlayRow } from "../src/nflverse.js";
import { buildRedZone, buildTeamPace } from "../src/nflverse-tables.js";

const real = parseCsv(
  "play_by_play",
  gunzipSync(readFileSync(new URL("./fixtures/nflverse/play_by_play_2026.csv.gz", import.meta.url))).toString("utf8"),
);

const COLS = [
  "game_id", "season", "week", "season_type", "posteam", "play_type", "pass", "rush", "yardline_100",
  "two_point_attempt", "qb_kneel", "qb_spike", "down", "wp", "pass_oe",
  "receiver_player_id", "receiver_player_name", "rusher_player_id", "rusher_player_name",
] as const;
type Col = (typeof COLS)[number];

/** Builds rows through the real schema from a few columns; everything else is empty, as in the file. */
function plays(...specs: Partial<Record<Col, string | number>>[]): PlayByPlayRow[] {
  const base: Partial<Record<Col, string | number>> = { season: 2026, week: 1, season_type: "REG", posteam: "CLE", game_id: "g1" };
  const lines = specs.map((s) => COLS.map((c) => String({ ...base, ...s }[c] ?? "")).join(","));
  return parseCsv("play_by_play", [COLS.join(","), ...lines].join("\n"));
}

describe("red-zone usage", () => {
  it("counts a pass to a receiver at yardline_100 20 and not one at 21", () => {
    const rows = buildRedZone(
      plays(
        { pass: 1, two_point_attempt: 0, yardline_100: 20, receiver_player_id: "R1", receiver_player_name: "A" },
        { pass: 1, two_point_attempt: 0, yardline_100: 21, receiver_player_id: "R2", receiver_player_name: "B" },
      ),
      2026,
      4,
    );
    expect(rows.map((r) => [r.player_id, r.rz_targets, r.team_rz_targets])).toEqual([["R1", 1, 1]]);
    expect(rows[0]!.rz_target_share).toBe(1);
  });

  it("agrees on the real rows: CLE's pass at 20 counts, the ones at 21 do not", () => {
    const rows = buildRedZone(real, 2026, 4);
    const targets = (id: string): number => rows.find((r) => r.player_id === id)?.rz_targets ?? 0;
    expect(targets("00-0041547")).toBeGreaterThanOrEqual(1);
    // Every counted target sits on a play at yardline_100 <= 20.
    const expected = real.filter(
      (p) => p.posteam === "CLE" && p.pass === 1 && p.two_point_attempt === 0 && p.yardline_100 !== null && p.yardline_100 <= 20 && p.receiver_player_id !== null,
    ).length;
    expect(rows.filter((r) => r.team === "CLE").reduce((n, r) => n + r.rz_targets, 0)).toBe(expected);
  });

  it("counts a rush at yardline_100 5 but not a two-point rush, keyed on rusher_player_id", () => {
    const rows = buildRedZone(
      plays(
        { rush: 1, two_point_attempt: 0, yardline_100: 5, rusher_player_id: "B1", rusher_player_name: "Back" },
        { rush: 1, two_point_attempt: 1, yardline_100: 2, rusher_player_id: "B2", rusher_player_name: "Other" },
        { rush: 1, two_point_attempt: 0, yardline_100: 5, rusher_player_id: "B1", rusher_player_name: "Back", week: 4 },
      ),
      2026,
      4,
    );
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ player_id: "B1", rz_carries: 1, team_rz_carries: 1, rz_carry_share: 1 });
  });

  it("finds the real CLE rush at 5 and excludes the two-point tries", () => {
    const rows = buildRedZone(real, 2026, 4);
    expect(rows.find((r) => r.player_id === "00-0040784")!.rz_carries).toBeGreaterThanOrEqual(1);
    const twoPoint = real.filter((p) => p.two_point_attempt === 1 && p.rush === 1 && p.posteam === "CAR");
    expect(twoPoint.length).toBeGreaterThan(0);
    const carCarries = rows.filter((r) => r.team === "CAR").reduce((n, r) => n + r.rz_carries, 0);
    const carRush = real.filter(
      (p) => p.posteam === "CAR" && p.rush === 1 && p.two_point_attempt === 0 && p.yardline_100 !== null && p.yardline_100 <= 20 && p.rusher_player_id !== null,
    ).length;
    expect(carCarries).toBe(carRush);
  });

  it("shares a team's red-zone targets between its receivers", () => {
    const rows = buildRedZone(
      plays(
        { pass: 1, two_point_attempt: 0, yardline_100: 10, receiver_player_id: "R1" },
        { pass: 1, two_point_attempt: 0, yardline_100: 8, receiver_player_id: "R1" },
        { pass: 1, two_point_attempt: 0, yardline_100: 3, receiver_player_id: "R2" },
      ),
      2026,
      4,
    );
    expect(rows.find((r) => r.player_id === "R1")).toMatchObject({ rz_targets: 2, team_rz_targets: 3, rz_target_share: 0.6667 });
  });
});

describe("team pace and pass rate", () => {
  // CLE, game g1: 3 passes and 1 run count; kneel, spike and a no_play do not.
  const game = plays(
    { play_type: "pass", pass: 1, down: 1, wp: 0.5, pass_oe: 10 },
    { play_type: "pass", pass: 1, down: 3, wp: 0.5, pass_oe: -4 },
    { play_type: "run", pass: 0, rush: 1, down: 2, wp: 0.9, pass_oe: -6 },
    { play_type: "run", pass: 0, rush: 1, down: 1, wp: 0.5 },
    { play_type: "qb_kneel", pass: 0, rush: 1, qb_kneel: 1, down: 1, wp: 0.5 },
    { play_type: "qb_spike", pass: 1, qb_spike: 1, down: 2, wp: 0.5 },
    { play_type: "no_play", pass: 1, down: 1, wp: 0.5 },
    { play_type: "pass", pass: 1, down: 1, wp: 0.5, pass_oe: 2, week: 4 },
  );

  it("counts only pass and run plays, not kneels, spikes or no_play, and not week 4", () => {
    const [cle] = buildTeamPace(game, 2026, 4);
    expect(cle).toMatchObject({ team: "CLE", games: 1, plays: 4, plays_per_game: 4 });
  });

  it("takes pass rate as the mean of pass over the counted plays", () => {
    expect(buildTeamPace(game, 2026, 4)[0]!.pass_rate).toBe(0.5);
  });

  it("restricts neutral pass rate to wp 0.2-0.8 and downs 1-2", () => {
    // Neutral: the first pass (down 1) and the last run (down 1); the third play has wp 0.9, the second is down 3.
    const [cle] = buildTeamPace(game, 2026, 4);
    expect(cle!.neutral_plays).toBe(2);
    expect(cle!.neutral_pass_rate).toBe(0.5);
    const edge = buildTeamPace(
      plays(
        { play_type: "pass", pass: 1, down: 1, wp: 0.2 },
        { play_type: "pass", pass: 1, down: 2, wp: 0.8 },
        { play_type: "run", pass: 0, rush: 1, down: 1, wp: 0.81 },
        { play_type: "run", pass: 0, rush: 1, down: 1 },
      ),
      2026,
      4,
    )[0]!;
    expect(edge.neutral_plays).toBe(2);
    expect(edge.neutral_pass_rate).toBe(1);
  });

  it("takes pass rate over expected as the mean of pass_oe, skipping plays without one", () => {
    expect(buildTeamPace(game, 2026, 4)[0]!.pass_rate_over_expected).toBe(0);
  });

  it("averages plays per game over the games played", () => {
    const two = plays(
      { play_type: "pass", pass: 1 },
      { play_type: "run", pass: 0, rush: 1 },
      { play_type: "run", pass: 0, rush: 1, game_id: "g2", week: 2 },
    );
    expect(buildTeamPace(two, 2026, 4)[0]).toMatchObject({ games: 2, plays: 3, plays_per_game: 1.5 });
  });

  it("on the real rows counts no kneel, spike or no_play and matches a direct count", () => {
    const cle = buildTeamPace(real, 2026, 4).find((t) => t.team === "CLE")!;
    const direct = real.filter(
      (p) => p.posteam === "CLE" && (p.play_type === "pass" || p.play_type === "run") && p.qb_kneel !== 1 && p.qb_spike !== 1,
    );
    expect(cle.games).toBe(3);
    expect(cle.plays).toBe(direct.length);
    expect(real.some((p) => p.play_type === "no_play")).toBe(true);
    expect(real.some((p) => p.qb_spike === 1 || p.play_type === "qb_spike")).toBe(true);
  });
});
