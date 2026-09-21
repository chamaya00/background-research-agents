import { readFileSync, writeFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";
import { generateBrief } from "../src/brief.js";
import { templateWriter } from "../src/writer.js";
import { copyDeterminismFixtures, FIXTURE_AS_OF } from "./helpers/tempFixtures.js";

describe("acceptance criterion 3: a new source can add an item to the brief", () => {
  it("includes an item absent from the previous run once a fixture source is appended", async () => {
    const fixtures = copyDeterminismFixtures("a");

    const before = await generateBrief({
      sourcesPath: fixtures.sourcesPath,
      itemsPath: fixtures.itemsPath,
      interestPath: fixtures.interestPath,
      preferencePath: fixtures.preferencePath,
      knowledgePath: fixtures.knowledgePath,
      writer: templateWriter,
      asOf: FIXTURE_AS_OF,
    });
    const beforeIds = new Set(before.items.map((item) => item.id));

    // Append one fixture source - the worked example from #3's design doc.
    const sources = parseYaml(readFileSync(fixtures.sourcesPath, "utf8"));
    sources.sources.push({
      id: "sequoia-ai-ascent",
      kind: "fixture",
      url: "https://www.sequoiacap.com/feed/?tag=ai",
      enabled: true,
    });
    writeFileSync(fixtures.sourcesPath, stringifyYaml(sources));

    // A live fetch against a newly-added feed would return new items; the
    // fixture stand-in for that is appending one to the fixed items file.
    const items = JSON.parse(readFileSync(fixtures.itemsPath, "utf8"));
    items.push({
      id: "item-3",
      sourceId: "sequoia-ai-ascent",
      title: "Sequoia's enterprise AI portfolio bets on agentic BI",
      url: "https://example.com/c",
      publishedAt: "2026-09-17",
      subjects: ["agentic-bi-tools"],
      concepts: [],
      rawText: "Sequoia's latest enterprise AI writeup covers agentic interfaces to BI tools.",
    });
    writeFileSync(fixtures.itemsPath, JSON.stringify(items, null, 2));

    const after = await generateBrief({
      sourcesPath: fixtures.sourcesPath,
      itemsPath: fixtures.itemsPath,
      interestPath: fixtures.interestPath,
      preferencePath: fixtures.preferencePath,
      knowledgePath: fixtures.knowledgePath,
      writer: templateWriter,
      asOf: FIXTURE_AS_OF,
    });

    const newItems = after.items.filter((item) => !beforeIds.has(item.id));
    expect(newItems).toHaveLength(1);
    expect(newItems[0]?.id).toBe("item-3");
  });
});
