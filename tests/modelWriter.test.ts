import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { buildPrompt, createModelWriter, type ModelClient } from "../src/modelWriter.js";
import type { FetchedItem } from "../src/schema/item.js";
import type { Instruction } from "../src/writer.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const FIXTURE_DIR = join(HERE, "..", "fixtures", "model-writer");

const ITEM_1: FetchedItem = {
  id: "item-1",
  sourceId: "gartner-blog",
  title: "Enterprise buyers now expect usage-based AI pricing",
  url: "https://example.com/a",
  publishedAt: "2026-09-15",
  subjects: ["usage-based-pricing"],
  concepts: ["cohort-retention"],
  rawText:
    "Enterprise buyers are increasingly negotiating usage-based pricing for AI features, citing cohort retention data as their main justification.",
  format: "article",
};

const FAMILIAR_INSTRUCTION: Instruction = { itemId: "item-1", directives: ["remind:cohort-retention"] };

/** The same explanation string #4's stub writer (and the design doc's assertion 3) use for this concept. */
const COHORT_RETENTION_EXPLANATION = "Cohort retention analysis measures";

function fakeClient(complete: ModelClient["complete"]): ModelClient {
  return { complete };
}

describe("acceptance criterion 2: live-response check for the familiar case is tolerant of wording, intolerant of the explanation reappearing", () => {
  it("accepts a mocked familiar-case response that doesn't re-explain the concept", async () => {
    // Hand-authored mock, not a literal capture from #9's criterion 3 live run
    // (unavailable in this environment - see the pull request). Stands in for
    // "recorded/mocked model API response" per the criterion's own wording,
    // which allows either.
    const response = readFileSync(join(FIXTURE_DIR, "familiar.response.txt"), "utf8").trim();
    const client = fakeClient(async () => response);
    const writer = createModelWriter(client);

    const text = await writer(ITEM_1, FAMILIAR_INSTRUCTION);

    // Tolerant of wording: no exact-match assertion against the fixture text.
    expect(text.length).toBeGreaterThan(0);
    // Intolerant of the explanation reappearing: the full definition a
    // `familiar` concept must not receive is absent.
    expect(text).not.toContain(COHORT_RETENTION_EXPLANATION);
  });

  it("would fail the same check if the model re-explained the concept anyway", async () => {
    const nonCompliantResponse = `Quick reminder: ${COHORT_RETENTION_EXPLANATION} how many users return after their first use.`;
    const client = fakeClient(async () => nonCompliantResponse);
    const writer = createModelWriter(client);

    const text = await writer(ITEM_1, FAMILIAR_INSTRUCTION);

    expect(text).toContain(COHORT_RETENTION_EXPLANATION);
  });
});

describe("acceptance criterion 4: an unreachable or errored model API fails the writer loudly", () => {
  it("propagates the client's error rather than swallowing it", async () => {
    const client = fakeClient(async () => {
      throw new Error("model API unreachable: ECONNREFUSED");
    });
    const writer = createModelWriter(client);

    await expect(writer(ITEM_1, FAMILIAR_INSTRUCTION)).rejects.toThrow("model API unreachable");
  });

  it("throws rather than returning empty text for a blank response", async () => {
    const client = fakeClient(async () => "   ");
    const writer = createModelWriter(client);

    await expect(writer(ITEM_1, FAMILIAR_INSTRUCTION)).rejects.toThrow(/empty text/);
  });
});

describe("buildPrompt", () => {
  it("asks for an inline explanation when the instruction carries an explain directive", () => {
    const prompt = buildPrompt(ITEM_1, { itemId: "item-1", directives: ["explain:cohort-retention"] });
    expect(prompt).toContain("has not encountered");
    expect(prompt).toContain("cohort-retention");
  });

  it("asks for at most a one-clause reminder, never a definition, for a remind directive", () => {
    const prompt = buildPrompt(ITEM_1, FAMILIAR_INSTRUCTION);
    expect(prompt).toContain("Do not explain it");
  });

  it("asks for no explanation at all when there is no directive (the expert case)", () => {
    const prompt = buildPrompt(ITEM_1, { itemId: "item-1", directives: [] });
    expect(prompt).toContain("Do not explain or define anything");
  });
});
