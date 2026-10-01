import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";
import {
  collectInputs,
  nflverseUrls,
  parseInputs,
  type FetchedInput,
  type FetchLike,
  type NflverseFile,
  type ParsedRows,
} from "../src/nflverse.js";
import { run } from "../src/nflverse-cli.js";
import {
  buildEnvironment,
  buildInjuries,
  buildPointsAllowed,
  buildUsage,
  halfPpr,
  pointsAllowedByWeek,
  provenance,
} from "../src/nflverse-tables.js";

const DIR = new URL("./fixtures/nflverse/", import.meta.url);
const FILES: Record<NflverseFile, string> = {
  stats_player: "stats_player_week_2026.csv",
  snap_counts: "snap_counts_2026.csv",
  injuries: "injuries_2026.csv",
  games: "games.csv",
};
const urls = nflverseUrls(2026);
const byUrl = new Map(Object.entries(urls).map(([file, url]) => [url, file as NflverseFile]));
const fixtureFetch: FetchLike = async (url) => {
  const body = readFileSync(new URL(FILES[byUrl.get(url)!], DIR));
  return { status: 200, arrayBuffer: async () => new Uint8Array(body).buffer };
};
const NOW = new Date("2026-10-01T08:00:00Z");
const load = async (): Promise<{ inputs: FetchedInput[]; rows: ParsedRows }> => {
  const inputs = await collectInputs(2026, fixtureFetch, () => NOW);
  return { inputs, rows: parseInputs(inputs) };
};

const FANNIN = "00-0040663";

describe("usage table", () => {
  it("pools Fannin's target share and air-yards share over team totals summed from CLE's rows", async () => {
    const { rows } = await load();
    const fannin = buildUsage(rows, 2026, 4).find((u) => u.player_id === FANNIN)!;
    expect(fannin.pooled.targets).toBe(18);
    expect(fannin.pooled.team_targets).toBe(82);
    expect(fannin.pooled.target_share).toBeCloseTo(0.2195, 4);
    expect(fannin.pooled.air_yards).toBe(109);
    expect(fannin.pooled.team_air_yards).toBe(498);
    expect(fannin.pooled.air_yards_share).toBeCloseTo(0.2189, 4);
    expect(fannin.last_week.week).toBe(3);
    expect(fannin.last_week.targets).toBe(9);
    expect(fannin.last_week.team_air_yards).toBe(162);
  });

  it("takes Fannin's week 3 snap share as 60 of the team's maximum 70", async () => {
    const { rows } = await load();
    const fannin = buildUsage(rows, 2026, 4).find((u) => u.player_id === FANNIN)!;
    expect(fannin.last_week.snaps).toBe(60);
    expect(fannin.last_week.team_snaps).toBe(70);
    expect(fannin.last_week.snap_share).toBeCloseTo(0.8571, 4);
  });

  describe("snap join fallback", () => {
    const isFannin = (s: ParsedRows["snap_counts"][number]) =>
      s.team === "CLE" && s.week === 3 && s.player.includes("Fannin");
    const withSnaps = (rows: ParsedRows, snap_counts: ParsedRows["snap_counts"]): ParsedRows => ({ ...rows, snap_counts });
    const fanninOf = (rows: ParsedRows) => buildUsage(rows, 2026, 4).find((u) => u.player_id === FANNIN)!;

    it("matches on position and last name when the full name differs, and the game stays known", async () => {
      const { rows } = await load();
      const renamed = rows.snap_counts.map((s) => (isFannin(s) ? { ...s, player: "Hal Fannin" } : s));
      const fannin = fanninOf(withSnaps(rows, renamed));
      expect(fannin.last_week.snaps).toBe(60);
      expect(fannin.last_week.team_snaps).toBe(70);
      expect(fannin.last_week.snap_unmatched_games).toBe(0);
    });

    it("treats a game with no snap row as unknown, not zero", async () => {
      const { rows } = await load();
      const fannin = fanninOf(withSnaps(rows, rows.snap_counts.filter((s) => !isFannin(s))));
      expect(fannin.pooled.snaps).toBe(92);
      expect(fannin.pooled.team_snaps).toBe(109);
      expect(fannin.pooled.snap_unmatched_games).toBe(1);
      expect(fannin.last_week.snaps).toBe(0);
      expect(fannin.last_week.team_snaps).toBe(0);
      expect(fannin.last_week.snap_unmatched_games).toBe(1);
    });

    it("declines the fallback when two snap rows share the last name", async () => {
      const { rows } = await load();
      const original = rows.snap_counts.find(isFannin)!;
      const renamed = rows.snap_counts.map((s) => (s === original ? { ...s, player: "Hal Fannin" } : s));
      const twin = { ...original, player: "Other Fannin", pfr_player_id: "TwinXX00" };
      const fannin = fanninOf(withSnaps(rows, [...renamed, twin]));
      expect(fannin.last_week.snap_unmatched_games).toBe(1);
      expect(fannin.last_week.snaps).toBe(0);
    });
  });

  it("skips team-level rows with no player", async () => {
    const { rows } = await load();
    const blank = parseInputs([
      {
        file: "stats_player",
        url: "",
        fetchedAt: "",
        sha256: "",
        bytes: readFileSync(new URL("stats_player_week_2026.blank-player.csv", DIR)),
      },
    ]).stats_player;
    const merged = { ...rows, stats_player: [...rows.stats_player, ...blank] };
    expect(buildUsage(merged, 2026, 4).every((u) => u.player_id !== null)).toBe(true);
    expect(buildUsage(merged, 2026, 4)).toEqual(buildUsage(rows, 2026, 4));
  });
});

describe("points allowed", () => {
  it("gives PIT's TE points of 0, 9 and 14 for weeks 1-3, mean 7.67", async () => {
    const { rows } = await load();
    const byWeek = pointsAllowedByWeek(rows.stats_player, "PIT", "TE", 4);
    expect([...byWeek.keys()].sort()).toEqual([1, 2, 3]);
    expect([1, 2, 3].map((w) => byWeek.get(w))).toEqual([0, 9, 14]);
    const pit = buildPointsAllowed(rows, 2026, 4).find((r) => r.defense === "PIT" && r.position === "TE")!;
    expect(pit.per_game).toBeCloseTo(7.67, 2);
    expect(pit.games).toBe(3);
    expect(pit.rank).toBeGreaterThanOrEqual(1);
  });

  it("computes half-PPR as (fantasy_points + fantasy_points_ppr) / 2 on every fixture row", async () => {
    const { rows } = await load();
    for (const r of rows.stats_player) {
      expect(halfPpr(r)).toBe(r.fantasy_points + (r.fantasy_points_ppr - r.fantasy_points) / 2);
      expect(halfPpr(r)).toBeCloseTo(r.fantasy_points + r.receptions * 0.5, 6);
    }
  });
});

describe("game environment and injuries", () => {
  it("derives implied totals CLE 18.0 and PIT 20.5 for 2026_04_PIT_CLE", async () => {
    const { inputs, rows } = await load();
    const env = buildEnvironment(rows.games, 2026, 4, inputs.find((i) => i.file === "games")!.fetchedAt);
    const game = env.find((g) => g.game_id === "2026_04_PIT_CLE")!;
    expect(game.home_team).toBe("CLE");
    expect(game.home_implied_total).toBe(18);
    expect(game.away_implied_total).toBe(20.5);
    expect(game.roof).toBe("outdoors");
    expect(game.games_read_at).toBe(NOW.toISOString());
    expect(env.every((g) => g.week === 4)).toBe(true);
  });

  it("lists week 4 injury status per player", async () => {
    const { rows } = await load();
    const inj = buildInjuries(rows.injuries, 2026, 4);
    expect(inj).toHaveLength(10);
    expect(inj[0]).toMatchObject({ team: "CLE", gsis_id: "00-0035234", practice_status: "Limited Participation in Practice" });
  });
});

describe("leakage", () => {
  it("leaves W = 4 usage and points allowed unchanged when a week-4 row is added", async () => {
    const { rows } = await load();
    const fannin = rows.stats_player.filter((r) => r.player_id === FANNIN && r.week === 3);
    const te = rows.stats_player.filter((r) => r.position === "TE" && r.opponent_team === "PIT");
    const leaked = [...fannin, ...te].map((r) => ({ ...r, week: 4, targets: 99, carries: 99, receiving_air_yards: 999, fantasy_points: 50, fantasy_points_ppr: 60 }));
    const extra = { ...rows, stats_player: [...rows.stats_player, ...leaked] };
    expect(buildUsage(extra, 2026, 4)).toEqual(buildUsage(rows, 2026, 4));
    expect(buildPointsAllowed(extra, 2026, 4)).toEqual(buildPointsAllowed(rows, 2026, 4));
    // Sanity: the extra rows do count when the target week moves past them.
    expect(buildUsage(extra, 2026, 5)).not.toEqual(buildUsage(rows, 2026, 5));
  });
});

describe("output", () => {
  it("writes attribution naming nflverse and CC-BY 4.0 and every input's url, fetch time and sha256", async () => {
    const out = mkdtempSync(join(tmpdir(), "tables-"));
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const code = await run(["tables", "--season", "2026", "--week", "4", "--out", out], (s) =>
      collectInputs(s, fixtureFetch, () => NOW),
    );
    log.mockRestore();
    expect(code).toBe(0);
    const { inputs } = await load();
    for (const name of ["usage", "points-allowed", "game-environment", "injuries"]) {
      const doc = JSON.parse(readFileSync(join(out, `${name}.json`), "utf8"));
      expect(doc.attribution.source).toBe("nflverse");
      expect(doc.attribution.license).toBe("CC-BY 4.0");
      expect(doc.inputs).toEqual(provenance(inputs).inputs);
      expect(doc.inputs).toHaveLength(4);
      for (const i of doc.inputs) {
        expect(i.url).toMatch(/^https:\/\//);
        expect(i.fetchedAt).toBe(NOW.toISOString());
        expect(i.sha256).toMatch(/^[0-9a-f]{64}$/);
      }
      expect(doc.rows.length).toBeGreaterThan(0);
    }
  });

  it("exits non-zero with usage on bad arguments", async () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => undefined);
    expect(await run(["tables", "--season", "2026"], async () => [])).toBe(1);
    err.mockRestore();
  });
});
