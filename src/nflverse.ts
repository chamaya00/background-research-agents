import { createHash } from "node:crypto";
import { gunzipSync } from "node:zlib";
import { parse } from "csv-parse/sync";
import { z } from "zod";

const BASE = "https://github.com/nflverse/nflverse-data/releases/download";

export type NflverseFile = "stats_player" | "snap_counts" | "injuries" | "games" | "play_by_play";

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
    // The release tag is pbp, not play_by_play; the asset is gzipped.
    play_by_play: `${BASE}/pbp/play_by_play_${season}.csv.gz`,
  };
}

/** Fetches the five files. Throws, naming the file and status, on any non-200. */
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

// Columns added for the backtest (#142). Optional so a file or fixture without them still parses.
const optCol = z
  .string()
  .optional()
  .transform((s) => (s === undefined || s === "" ? null : s));
const optNumCol = z
  .string()
  .optional()
  .transform((s) => (s === undefined || s === "" || s === "NA" ? null : Number(s)))
  .pipe(z.number().finite().nullable());

/** Every `*_player_id` column of the file other than receiver and rusher: a player in any of them was on the field (plan section 6, "seen"). */
export const SEEN_ID_COLUMNS = [
  "td_player_id", "passer_player_id", "lateral_receiver_player_id", "lateral_rusher_player_id",
  "lateral_sack_player_id", "interception_player_id", "lateral_interception_player_id",
  "punt_returner_player_id", "lateral_punt_returner_player_id", "kickoff_returner_player_id",
  "lateral_kickoff_returner_player_id", "punter_player_id", "kicker_player_id",
  "own_kickoff_recovery_player_id", "blocked_player_id", "tackle_for_loss_1_player_id",
  "tackle_for_loss_2_player_id", "qb_hit_1_player_id", "qb_hit_2_player_id",
  "forced_fumble_player_1_player_id", "forced_fumble_player_2_player_id", "solo_tackle_1_player_id",
  "solo_tackle_2_player_id", "assist_tackle_1_player_id", "assist_tackle_2_player_id",
  "assist_tackle_3_player_id", "assist_tackle_4_player_id", "tackle_with_assist_1_player_id",
  "tackle_with_assist_2_player_id", "pass_defense_1_player_id", "pass_defense_2_player_id",
  "fumbled_1_player_id", "fumbled_2_player_id", "fumble_recovery_1_player_id",
  "fumble_recovery_2_player_id", "sack_player_id", "half_sack_1_player_id", "half_sack_2_player_id",
  "penalty_player_id", "safety_player_id", "fantasy_player_id",
] as const;
const seenIds = Object.fromEntries(SEEN_ID_COLUMNS.map((c) => [c, optCol])) as Record<
  (typeof SEEN_ID_COLUMNS)[number],
  typeof optCol
>;

// One play. Missing values are empty strings in this file. Only the columns the derived tables read are kept.
export const playByPlayRow = z.object({
  ...seenIds,
  complete_pass: optNumCol,
  // Added for the profile command (#159); optional like the columns above.
  air_yards: optNumCol,
  // Added for xfp (#163); optional like the columns above.
  receiving_yards: optNumCol,
  rushing_yards: optNumCol,
  pass_location: optCol,
  first_down: optNumCol,
  sack: optNumCol,
  touchdown: optNumCol,
  // Added for xfp v2 (#165); optional like the columns above, so a fixture without them still parses.
  defteam: optCol.optional(),
  qb_dropback: optNumCol.optional(),
  // Added for xfp quarterbacks (#167); optional like the columns above.
  pass_attempt: optNumCol.optional(),
  qb_scramble: optNumCol.optional(),
  interception: optNumCol.optional(),
  fumble_lost: optNumCol.optional(),
  pass_touchdown: optNumCol.optional(),
  passing_yards: optNumCol.optional(),
  game_id: text,
  season: num,
  week: num,
  season_type: text,
  posteam: optText,
  play_type: optText,
  pass: optNum,
  rush: optNum,
  yardline_100: optNum,
  two_point_attempt: optNum,
  qb_kneel: optNum,
  qb_spike: optNum,
  down: optNum,
  wp: optNum,
  pass_oe: optNum,
  receiver_player_id: optText,
  receiver_player_name: optText,
  rusher_player_id: optText,
  rusher_player_name: optText,
});

const SCHEMAS = {
  stats_player: statsPlayerRow,
  snap_counts: snapCountsRow,
  injuries: injuriesRow,
  games: gamesRow,
  play_by_play: playByPlayRow,
};

export type StatsPlayerRow = z.infer<typeof statsPlayerRow>;
export type SnapCountsRow = z.infer<typeof snapCountsRow>;
export type InjuriesRow = z.infer<typeof injuriesRow>;
export type GamesRow = z.infer<typeof gamesRow>;
export type PlayByPlayRow = z.infer<typeof playByPlayRow>;

export interface ParsedRows {
  stats_player: StatsPlayerRow[];
  snap_counts: SnapCountsRow[];
  injuries: InjuriesRow[];
  games: GamesRow[];
  play_by_play: PlayByPlayRow[];
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
    // The hash covers the compressed bytes; only the parse sees the decompressed ones.
    const bytes = input.file === "play_by_play" ? gunzipSync(input.bytes) : input.bytes;
    rows[input.file] = parseCsv(input.file, new TextDecoder().decode(bytes));
  }
  return rows as unknown as ParsedRows;
}
