import { describe, expect, it } from "vitest";
import { generateBrief } from "../src/brief.js";
import { templateWriter } from "../src/writer.js";
import { loadInterest, loadPreference } from "../src/state.js";
import { copyDeterminismFixtures, FIXTURE_AS_OF } from "./helpers/tempFixtures.js";

describe("acceptance criterion 1: every item names a source link, a date, and a real reason", () => {
  it("produces a reason string that traces to an actual key in interest or preference state", async () => {
    const fixtures = copyDeterminismFixtures("a");

    const brief = await generateBrief({
      sourcesPath: fixtures.sourcesPath,
      itemsPath: fixtures.itemsPath,
      interestPath: fixtures.interestPath,
      preferencePath: fixtures.preferencePath,
      knowledgePath: fixtures.knowledgePath,
      writer: templateWriter,
      asOf: FIXTURE_AS_OF,
    });

    expect(brief.items.length).toBeGreaterThan(0);

    const interest = loadInterest(fixtures.interestPath);
    const preference = loadPreference(fixtures.preferencePath);
    const interestSubjectIds = new Set(interest.subjects.map((s) => s.id));
    const preferenceSourceIds = new Set(Object.keys(preference.sources));

    for (const item of brief.items) {
      // Source link.
      expect(item.url).toMatch(/^https?:\/\//);
      // Date.
      expect(item.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);

      // Reason names an actual key present in interest or preference state,
      // not a generic constant like "selected" or "matched".
      const match = /matches interest subject '([^']+)'/.exec(item.reason);
      // `?? ""` rather than a non-null assertion: noUncheckedIndexedAccess types
      // a capture group as possibly undefined, and an empty key fails the same
      // assertion a missing match would, with the same message.
      const namedKey = match?.[1] ?? "";
      expect(namedKey, `reason "${item.reason}" does not name a subject key`).not.toBe("");
      const namedKeyIsReal = interestSubjectIds.has(namedKey) || preferenceSourceIds.has(namedKey);
      expect(namedKeyIsReal, `"${namedKey}" is not a real key in interest.yaml or preference.yaml`).toBe(
        true,
      );
    }
  });
});
