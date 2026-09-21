import { describe, expect, it } from "vitest";
import { generateBrief, type Brief } from "../src/brief.js";
import { copyDeterminismFixtures, FIXTURE_AS_OF } from "./helpers/tempFixtures.js";
import { createStubWriter } from "./helpers/stubWriter.js";

function withoutText(brief: Brief) {
  return brief.items.map((item) => ({ ...item, text: undefined }));
}

describe("acceptance criterion 2: knowledge state changes wording, never selection", () => {
  it("matches the four-part comparison from #3's design doc", () => {
    const fixturesA = copyDeterminismFixtures("a");
    const fixturesB = copyDeterminismFixtures("b");

    const stubA = createStubWriter();
    const stubB = createStubWriter();

    const briefA = generateBrief({
      sourcesPath: fixturesA.sourcesPath,
      itemsPath: fixturesA.itemsPath,
      interestPath: fixturesA.interestPath,
      preferencePath: fixturesA.preferencePath,
      knowledgePath: fixturesA.knowledgePath,
      writer: stubA.writer,
      asOf: FIXTURE_AS_OF,
    });

    const briefB = generateBrief({
      sourcesPath: fixturesB.sourcesPath,
      itemsPath: fixturesB.itemsPath,
      interestPath: fixturesB.interestPath,
      preferencePath: fixturesB.preferencePath,
      knowledgePath: fixturesB.knowledgePath,
      writer: stubB.writer,
      asOf: FIXTURE_AS_OF,
    });

    // 1. Selection is unchanged: every field but `text` is identical, in the same order.
    expect(withoutText(briefA)).toEqual(withoutText(briefB));

    // 2. Exactly one item's text differs - the one tagged `cohort-retention`.
    const item1A = briefA.items.find((i) => i.id === "item-1")!;
    const item1B = briefB.items.find((i) => i.id === "item-1")!;
    const item2A = briefA.items.find((i) => i.id === "item-2")!;
    const item2B = briefB.items.find((i) => i.id === "item-2")!;

    expect(item1A.text).not.toEqual(item1B.text);
    expect(item2A.text).toEqual(item2B.text);

    // 3. The direction is right: the full explanation appears under knowledge.a
    // and not under knowledge.b.
    expect(item1A.text).toContain("Cohort retention analysis measures");
    expect(item1B.text).not.toContain("Cohort retention analysis measures");

    // 4. The instruction handed to the writer is right, not just the stub's
    // output: knowledge.a's instruction for item-1 carries the explain
    // directive, knowledge.b's does not.
    const instructionA = stubA.instructions.find((i) => i.itemId === "item-1")!;
    const instructionB = stubB.instructions.find((i) => i.itemId === "item-1")!;

    expect(instructionA.directives).toContain("explain:cohort-retention");
    expect(instructionB.directives).not.toContain("explain:cohort-retention");
    expect(instructionB.directives).toContain("remind:cohort-retention");
  });
});
