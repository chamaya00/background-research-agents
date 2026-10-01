#!/usr/bin/env node
import { collectInputs, parseInputs } from "./nflverse.js";

const USAGE = "usage: nflverse-cli fetch --season <yyyy>";

/** Prints the manifest (URL, fetch time, SHA-256 per input) and row counts as JSON. */
async function main(argv: string[]): Promise<void> {
  const [command, flag, value] = argv;
  const season = Number(value);
  if (command !== "fetch" || flag !== "--season" || !/^\d{4}$/.test(value ?? "")) {
    console.error(USAGE);
    process.exitCode = 1;
    return;
  }
  try {
    const inputs = await collectInputs(season);
    const rows = parseInputs(inputs);
    const manifest = inputs.map(({ file, url, fetchedAt, sha256 }) => ({
      file,
      url,
      fetchedAt,
      sha256,
      rows: rows[file].length,
    }));
    console.log(JSON.stringify({ season, inputs: manifest }, null, 2));
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    process.exitCode = 1;
  }
}

await main(process.argv.slice(2));
