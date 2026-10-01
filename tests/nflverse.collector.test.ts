import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { describe, expect, it } from "vitest";
import { parse } from "csv-parse/sync";
import {
  collectInputs,
  nflverseUrls,
  parseCsv,
  parseInputs,
  type FetchLike,
  type NflverseFile,
} from "../src/nflverse.js";

const DIR = new URL("./fixtures/nflverse/", import.meta.url);
const FILES: Record<NflverseFile, string> = {
  stats_player: "stats_player_week_2026.csv",
  snap_counts: "snap_counts_2026.csv",
  injuries: "injuries_2026.csv",
  games: "games.csv",
  play_by_play: "play_by_play_2026.csv.gz",
};
const bytesOf = (file: NflverseFile): Buffer => readFileSync(new URL(FILES[file], DIR));
const textOf = (file: NflverseFile): string =>
  (file === "play_by_play" ? gunzipSync(bytesOf(file)) : bytesOf(file)).toString("utf8");

const urls = nflverseUrls(2026);
const byUrl = new Map(Object.entries(urls).map(([file, url]) => [url, file as NflverseFile]));

const stubFetch =
  (requested: string[] = []): FetchLike =>
  async (url) => {
    requested.push(url);
    const body = bytesOf(byUrl.get(url)!);
    return { status: 200, arrayBuffer: async () => new Uint8Array(body).buffer };
  };

describe("collector", () => {
  it("requests exactly the five URLs and records url, fetch time and sha256", async () => {
    const requested: string[] = [];
    const now = new Date("2026-10-01T07:30:00Z");
    const inputs = await collectInputs(2026, stubFetch(requested), () => now);

    expect(requested.sort()).toEqual(
      [
        "https://github.com/nflverse/nflverse-data/releases/download/stats_player/stats_player_week_2026.csv",
        "https://github.com/nflverse/nflverse-data/releases/download/snap_counts/snap_counts_2026.csv",
        "https://github.com/nflverse/nflverse-data/releases/download/injuries/injuries_2026.csv",
        "https://github.com/nflverse/nflverse-data/releases/download/schedules/games.csv",
        "https://github.com/nflverse/nflverse-data/releases/download/pbp/play_by_play_2026.csv.gz",
      ].sort(),
    );
    expect(inputs).toHaveLength(5);
    for (const input of inputs) {
      expect(input.url).toBe(urls[input.file]);
      expect(input.fetchedAt).toBe("2026-10-01T07:30:00.000Z");
      expect(input.sha256).toBe(createHash("sha256").update(bytesOf(input.file)).digest("hex"));
    }
  });

  it("fails naming the file and the status on a non-200", async () => {
    const notFound: FetchLike = async () => ({ status: 404, arrayBuffer: async () => new ArrayBuffer(0) });
    await expect(collectInputs(2026, notFound)).rejects.toThrow(/stats_player.*404/);
  });
});

describe("parsing", () => {
  it("keeps the column count and the quoted headshot_url intact", () => {
    const records: Record<string, string>[] = parse(textOf("stats_player"), { columns: true });
    const header = textOf("stats_player").split("\n")[0]!.split(",");
    const quoted = readFileSync(new URL(FILES.stats_player, DIR), "utf8")
      .split("\n")
      .find((line) => /"[^"]*,[^"]*"/.test(line));
    expect(quoted).toBeDefined();
    for (const record of records) expect(Object.keys(record)).toHaveLength(header.length);
    const withComma = records.find((r) => r.headshot_url?.includes(","));
    expect(withComma).toBeDefined();
    expect(quoted).toContain(`"${withComma!.headshot_url}"`);
  });

  it("parses every fixture through its schema", () => {
    const inputs = (Object.keys(FILES) as NflverseFile[]).map((file) => ({
      file,
      url: urls[file],
      fetchedAt: "",
      sha256: "",
      bytes: bytesOf(file),
    }));
    const rows = parseInputs(inputs);
    expect(rows.stats_player).toHaveLength(112);
    expect(rows.snap_counts).toHaveLength(142);
    expect(rows.injuries).toHaveLength(10);
    expect(rows.games).toHaveLength(64);
    expect(rows.play_by_play).toHaveLength(513);
  });

  it("decompresses the play-by-play file with zlib while its sha256 stays that of the compressed bytes", async () => {
    const inputs = await collectInputs(2026, stubFetch());
    const pbp = inputs.find((i) => i.file === "play_by_play")!;
    const compressed = bytesOf("play_by_play");
    expect(pbp.sha256).toBe(createHash("sha256").update(compressed).digest("hex"));
    expect(pbp.sha256).not.toBe(createHash("sha256").update(gunzipSync(compressed)).digest("hex"));
    // Gzip magic bytes: the input is still compressed, and parsing decompresses it.
    expect([pbp.bytes[0], pbp.bytes[1]]).toEqual([0x1f, 0x8b]);
    expect(parseInputs([pbp]).play_by_play).toHaveLength(513);
  });

  // Renaming a required column's header leaves every row missing that field.
  const missing: [NflverseFile, string][] = [
    ["stats_player", "targets"],
    ["snap_counts", "offense_pct"],
    ["injuries", "gsis_id"],
    ["games", "home_team"],
  ];
  it.each(missing)("%s: a row missing %s fails, naming the file and field", (file, field) => {
    const broken = textOf(file).replace(new RegExp(`(^|,)${field}(,|\\n)`), `$1${field}_x$2`);
    expect(() => parseCsv(file, broken)).toThrow(new RegExp(`${file}: row 1 invalid at field ${field}`));
  });

  it("reads the 2026_04_PIT_CLE lines and Fannin's targets", () => {
    const game = parseCsv("games", textOf("games")).find((g) => g.game_id === "2026_04_PIT_CLE");
    expect(game?.spread_line).toBe(-2.5);
    expect(game?.total_line).toBe(38.5);

    const fannin = parseCsv("stats_player", textOf("stats_player"))
      .filter((r) => r.player_id === "00-0040663")
      .sort((a, b) => a.week - b.week);
    expect(fannin.map((r) => [r.week, r.targets])).toEqual([
      [1, 3],
      [2, 6],
      [3, 9],
    ]);
  });

  it("keeps the fields the weekly tables need on Fannin's week 3 row", () => {
    const week3 = parseCsv("stats_player", textOf("stats_player")).find(
      (r) => r.player_id === "00-0040663" && r.week === 3,
    );
    expect(week3?.receiving_air_yards).toBe(75);
    expect((week3!.fantasy_points + week3!.fantasy_points_ppr) / 2).toBeCloseTo(20.6, 6);
  });

  it("parses team-level rows with no player to a null player_id", () => {
    const blank = readFileSync(new URL("stats_player_week_2026.blank-player.csv", DIR), "utf8");
    const rows = parseCsv("stats_player", blank);
    expect(rows).toHaveLength(3);
    for (const row of rows) {
      expect(row.player_id).toBeNull();
      expect(row.player_display_name).toBeNull();
      expect(row.position).toBeNull();
    }
  });

  it("accepts a game with no kickoff time, as the 1999 rows have", () => {
    const [header, first, ...rest] = textOf("games").split("\n");
    const col = header!.split(",").indexOf("gametime");
    const cells = first!.split(",");
    cells[col] = "";
    const games = parseCsv("games", [header, cells.join(","), ...rest].join("\n"));
    expect(games[0]?.gametime).toBeNull();
  });
});
