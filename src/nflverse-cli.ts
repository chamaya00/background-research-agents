#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { collectInputs, parseInputs, type FetchedInput } from "./nflverse.js";
import { buildTables, provenance } from "./nflverse-tables.js";
import { profileReport } from "./nflverse-profile.js";
import { parseXfpArgs, xfpReport } from "./nflverse-xfp.js";
import { runBacktest } from "./redzone-backtest.js";

const USAGE =
  "usage: nflverse-cli fetch --season <yyyy> | nflverse-cli tables --season <yyyy> --week <n> --out <dir> | nflverse-cli backtest --season <yyyy> --out <dir> [--through <n>] | nflverse-cli profile --season <yyyy> --week <n> --player <name> [--player <name> ...] | nflverse-cli xfp --season <yyyy> --week <n> [--position WR|TE|RB] [--team XXX] [--top N] [--sort v1|v2|v3|v4]";

const pad = (week: number): string => String(week).padStart(2, "0");

export type Collect = (season: number) => Promise<FetchedInput[]>;

function flags(args: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (let i = 0; i + 1 < args.length; i += 2) out[args[i]!] = args[i + 1]!;
  return out;
}

/**
 * `fetch` prints the manifest (URL, fetch time, SHA-256 per input) and row counts as JSON.
 * `tables` writes the six derived tables, each with attribution and the manifest, to --out.
 * `backtest` writes the red-zone folds, summary and forward ranking under --out (ADR 0008).
 * `profile` prints a receiver's role and floor/typical/ceiling to the terminal, writing nothing.
 * `xfp` prints expected vs actual half-PPR points per game, pecking orders and rankings, writing nothing.
 * --through <n> names the last completed week; without it the weeks come from the play-by-play.
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
    if (command === "backtest" && validSeason && f["--out"] && (f["--through"] === undefined || /^\d{1,2}$/.test(f["--through"]))) {
      const inputs = await collect(season);
      const prov = provenance(inputs);
      const out = runBacktest(parseInputs(inputs), season, f["--through"] === undefined ? undefined : Number(f["--through"]));
      const dir = f["--out"];
      const write = (sub: string, name: string, extra: Record<string, unknown>): void => {
        mkdirSync(join(dir, sub), { recursive: true });
        writeFileSync(join(dir, sub, name), JSON.stringify({ ...prov, season, ...extra }, null, 2) + "\n");
      };
      for (const fold of out.folds) {
        const uses = { target_week: fold.week, uses_weeks: "1.." + String(fold.week - 1) };
        write("backtest", `fold-${pad(fold.week)}-predictions.json`, { ...uses, rows: fold.rows });
        write("backtest", `fold-${pad(fold.week)}-team-flags.json`, {
          ...uses,
          rows: fold.flags,
          next_week: fold.next_week,
          volume_medians: fold.volume.medians,
          volume: fold.volume.teams,
        });
      }
      write("backtest", "summary.json", out.summary);
      write(`week-${pad(out.forward_week)}`, "red-zone-ranking.json", {
        target_week: out.forward_week,
        uses_weeks: "1.." + String(out.forward_week - 1),
        ...out.forward,
      });
      return 0;
    }
    if (command === "profile") {
      // --player repeats, which the one-value-per-flag parser above cannot hold.
      const names: string[] = [];
      let ok = rest.length >= 6 && rest.length % 2 === 0;
      for (let i = 0; ok && i < rest.length; i += 2) {
        if (rest[i] === "--player" && rest[i + 1]!.trim() !== "") names.push(rest[i + 1]!);
        else if (rest[i] !== "--season" && rest[i] !== "--week") ok = false;
      }
      const weeks = rest.filter((a, i) => i % 2 === 0 && a === "--week").length;
      const seasons = rest.filter((a, i) => i % 2 === 0 && a === "--season").length;
      if (ok && validSeason && /^\d{1,2}$/.test(f["--week"] ?? "") && week >= 2 && weeks === 1 && seasons === 1 && names.length > 0) {
        const inputs = await collect(season);
        console.log(profileReport(parseInputs(inputs), season, week, names));
        return 0;
      }
    }
    if (command === "xfp") {
      const args = parseXfpArgs(rest);
      if (args) {
        const inputs = await collect(args.season);
        const prior = parseInputs(await collect(args.season - 1));
        console.log(xfpReport(parseInputs(inputs), args, prior));
        return 0;
      }
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
