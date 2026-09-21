import { readFileSync, writeFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { generateBrief } from "../src/brief.js";
import { templateWriter } from "../src/writer.js";
import { copyDeterminismFixtures, FIXTURE_AS_OF } from "./helpers/tempFixtures.js";

describe("acceptance criterion 4: a hand-edited state file changes the next run's output", () => {
  it("drops an item once its only subject is hand-muted in interest.yaml", async () => {
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
    expect(before.items.map((item) => item.id)).toContain("item-2");

    // A hand edit: a person opens interest.yaml in a text editor and flips
    // one status, not through any script or API.
    const edited = readFileSync(fixtures.interestPath, "utf8").replace(
      "id: agentic-bi-tools\n    label: \"Agentic interfaces to BI/analytics tools\"\n    status: active",
      "id: agentic-bi-tools\n    label: \"Agentic interfaces to BI/analytics tools\"\n    status: muted",
    );
    writeFileSync(fixtures.interestPath, edited);

    const after = await generateBrief({
      sourcesPath: fixtures.sourcesPath,
      itemsPath: fixtures.itemsPath,
      interestPath: fixtures.interestPath,
      preferencePath: fixtures.preferencePath,
      knowledgePath: fixtures.knowledgePath,
      writer: templateWriter,
      asOf: FIXTURE_AS_OF,
    });

    expect(after.items.map((item) => item.id)).not.toContain("item-2");
    // item-1's subject (usage-based-pricing) was untouched.
    expect(after.items.map((item) => item.id)).toContain("item-1");
  });
});
