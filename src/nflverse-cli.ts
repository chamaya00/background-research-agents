#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { collectInputs, parseInputs, type FetchedInput } from "./nflverse.js";
import { buildTables, provenance } from "./nflverse-tables.js";

const USAGE =
  "usage: nflverse-cli fetch --season <yyyy> | nflverse-cli tables --season <yyyy> --week <n> --out <dir>";

export type Collect = (season: number) => Promise<FetchedInput[]>;

function flags(args: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (let i = 0; i + 1 < args.length; i += 2) out[args[i]!] = args[i + 1]!;
  return out;
}

/**
 * `fetch` prints the manifest (URL, fetch time, SHA-256 per input) and row counts as JSON.
 * `tables` writes the six derived tables, each with attribution and the manifest, to --out.
 * Returns the exit code.
 */
export async function run(argv: string[], collect: Collect = (s) => collectInputs(s)): Promise<number> {
  const [command, ...rest] = argv;
  const f = flags(rest);
  const season = Number(f["--season"]);
  const week = Number(f["--week"]);
  const validSeason = /^\d{4}$/.test(f["--season"] ?? "");
  try {
    if (command === "fetch" && validSeason && rest.length === 2) {
      const inputs = await collect(season);
      const rows = parseInputs(inputs);
      const manifest = inputs.map(({ file, url, fetchedAt, sha256 }) => ({
        file,
        url,
        fetchedAt,
        sha256,
        rows: rows[file].length,
      }));
      console.log(JSON.stringify({ season, inputs: manifest }, null, 2));
      return 0;
    }
    if (command === "tables" && validSeason && /^\d{1,2}$/.test(f["--week"] ?? "") && week >= 2 && f["--out"]) {
      const inputs = await collect(season);
      const tables = buildTables(inputs, parseInputs(inputs), season, week);
      const prov = provenance(inputs);
      const dir = f["--out"];
      mkdirSync(dir, { recursive: true });
      const write = (name: string, extra: Record<string, unknown>, rows: unknown[]): void =>
        writeFileSync(
          join(dir, name),
          JSON.stringify({ ...prov, season, target_week: week, ...extra, rows }, null, 2) + "\n",
        );
      const through = { uses_weeks: "1.." + String(week - 1) };
      write("usage.json", through, tables.usage);
      write("points-allowed.json", through, tables.pointsAllowed);
      write("red-zone.json", through, tables.redZone);
      write("team-pace.json", through, tables.teamPace);
      write("game-environment.json", {}, tables.environment);
      write("injuries.json", { note: "One status per player for the week, not a day-by-day trend." }, tables.injuries);
      return 0;
    }
    console.error(USAGE);
    return 1;
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    return 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = await run(process.argv.slice(2));
}
