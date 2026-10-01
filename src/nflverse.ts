import { createHash } from "node:crypto";
import { parse } from "csv-parse/sync";
import { z } from "zod";

const BASE = "https://github.com/nflverse/nflverse-data/releases/download";

export type NflverseFile = "stats_player" | "snap_counts" | "injuries" | "games";

export type FetchLike = (url: string) => Promise<Pick<Response, "status" | "arrayBuffer">>;

export interface InputRecord {
  file: NflverseFile;
  url: string;
  fetchedAt: string;
  sha256: string;
}

export interface FetchedInput extends InputRecord {
  bytes: Uint8Array;
}

export function nflverseUrls(season: number): Record<NflverseFile, string> {
  return {
    stats_player: `${BASE}/stats_player/stats_player_week_${season}.csv`,
    snap_counts: `${BASE}/snap_counts/snap_counts_${season}.csv`,
    injuries: `${BASE}/injuries/injuries_${season}.csv`,
    games: `${BASE}/schedules/games.csv`,
  };
}

/** Fetches the four files. Throws, naming the file and status, on any non-200. */
export async function collectInputs(
  season: number,
  fetchFn: FetchLike = (url) => fetch(url),
  now: () => Date = () => new Date(),
): Promise<FetchedInput[]> {
  const urls = nflverseUrls(season);
  const out: FetchedInput[] = [];
  for (const file of Object.keys(urls) as NflverseFile[]) {
    const url = urls[file];
    const res = await fetchFn(url);
    if (res.status !== 200) {
      throw new Error(`${file}: fetching ${url} returned status ${res.status}`);
    }
    const bytes = new Uint8Array(await res.arrayBuffer());
    out.push({
      file,
      url,
      fetchedAt: now().toISOString(),
      sha256: createHash("sha256").update(bytes).digest("hex"),
      bytes,
    });
  }
  return out;
}

const text = z.string().min(1);
const num = z
  .string()
  .min(1)
  .transform(Number)
  .pipe(z.number().finite());
const optText = z.string().transform((s) => (s === "" ? null : s));
// Lines are empty for games without odds yet.
const optNum = z
  .string()
  .transform((s) => (s === "" || s === "NA" ? null : Number(s)))
  .pipe(z.number().finite().nullable());

// Team-level rows (penalties, safeties) have no player; #128 skips them for usage.
export const statsPlayerRow = z.object({
  player_id: optText,
  player_display_name: optText,
  position: optText,
  season: num,
  week: num,
  season_type: text,
  game_id: text,
  team: text,
  opponent_team: text,
  carries: num,
  rushing_yards: num,
  rushing_tds: num,
  targets: num,
  receptions: num,
  receiving_yards: num,
  receiving_tds: num,
  receiving_air_yards: num,
  receiving_2pt_conversions: num,
  rushing_2pt_conversions: num,
  receiving_fumbles_lost: num,
  rushing_fumbles_lost: num,
  passing_yards: num,
  passing_tds: num,
  passing_interceptions: num,
  fantasy_points: num,
  fantasy_points_ppr: num,
  target_share: optNum,
  air_yards_share: optNum,
});

export const snapCountsRow = z.object({
  game_id: text,
  player: text,
  pfr_player_id: text,
  position: text,
  team: text,
  opponent: text,
  week: num,
  offense_snaps: num,
  offense_pct: num,
});

export const injuriesRow = z.object({
  season: num,
  week: num,
  team: text,
  gsis_id: text,
  full_name: optText,
  report_status: optText,
  practice_status: optText,
  report_primary_injury: optText,
});

export const gamesRow = z.object({
  game_id: text,
  season: num,
  week: num,
  gameday: text,
  // Empty on 1999 rows of the all-seasons file; set on every 2026 row.
  gametime: optText,
  home_team: text,
  away_team: text,
  // Empty until the game is played.
  home_score: optNum,
  away_score: optNum,
  spread_line: optNum,
  total_line: optNum,
  roof: optText,
});

const SCHEMAS = {
  stats_player: statsPlayerRow,
  snap_counts: snapCountsRow,
  injuries: injuriesRow,
  games: gamesRow,
};

export type StatsPlayerRow = z.infer<typeof statsPlayerRow>;
export type SnapCountsRow = z.infer<typeof snapCountsRow>;
export type InjuriesRow = z.infer<typeof injuriesRow>;
export type GamesRow = z.infer<typeof gamesRow>;

export interface ParsedRows {
  stats_player: StatsPlayerRow[];
  snap_counts: SnapCountsRow[];
  injuries: InjuriesRow[];
  games: GamesRow[];
}

/** Parses one file's CSV text; a bad row throws naming the file, row and field. */
export function parseCsv<F extends NflverseFile>(file: F, csv: string): z.infer<(typeof SCHEMAS)[F]>[] {
  const records: Record<string, string>[] = parse(csv, { columns: true, bom: true, skip_empty_lines: true });
  const schema = SCHEMAS[file];
  return records.map((record, i) => {
    const result = schema.safeParse(record);
    if (!result.success) {
      const fields = result.error.issues.map((issue) => issue.path.join(".")).join(", ");
      throw new Error(`${file}: row ${i + 1} invalid at field ${fields}`);
    }
    return result.data;
  }) as z.infer<(typeof SCHEMAS)[F]>[];
}

export function parseInputs(inputs: FetchedInput[]): ParsedRows {
  const rows: Record<string, unknown> = {};
  for (const input of inputs) {
    rows[input.file] = parseCsv(input.file, new TextDecoder().decode(input.bytes));
  }
  return rows as unknown as ParsedRows;
}
