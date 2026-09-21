#!/usr/bin/env node
// Manual, documented run against a real source for #5's criterion 1 - not
// part of the automated test suite, which never makes a live network call.
// Run with `npm run verify-network [url]`; defaults to the RSS feed named in
// fixtures/determinism/sources.fixture.yaml's real-source counterpart.
import { fetchItems } from "../dist/fetch.js";

const url = process.argv[2] ?? "https://techcrunch.com/category/artificial-intelligence/feed/";

const sources = {
  sources: [{ id: "manual-check", kind: "rss", url, enabled: true }],
};

const result = await fetchItems(sources);

console.log(`Fetched ${result.items.length} item(s) from ${url}`);
for (const item of result.items.slice(0, 3)) {
  console.log(`- ${item.title}`);
  console.log(`  ${item.url}`);
  console.log(`  published ${item.publishedAt}, format ${item.format}`);
}

if (result.skipped.length > 0) {
  console.log("Skipped:");
  for (const skip of result.skipped) {
    console.log(`- ${skip.sourceId}: ${skip.reason}`);
  }
  process.exitCode = 1;
}
