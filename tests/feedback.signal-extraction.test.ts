import { readFileSync, writeFileSync } from "node:fs";
import { parse as parseYaml } from "yaml";
import { describe, expect, it } from "vitest";
import { applyFeedbackFromIssue } from "../src/apply-feedback.js";
import { copyDeterminismFixtures } from "./helpers/tempFixtures.js";
import { fakeCommentClient } from "./helpers/fakeCommentClient.js";

describe("acceptance criterion 1: plain-language feedback becomes a diff on the matching state file", () => {
  it("a familiarity comment ('I already know about X, stop explaining it') flips that concept to familiar in knowledge.yaml, and nothing else", async () => {
    const fixtures = copyDeterminismFixtures("a");
    const before = readFileSync(fixtures.knowledgePath, "utf8");
    const beforeInterest = readFileSync(fixtures.interestPath, "utf8");
    const beforePreference = readFileSync(fixtures.preferencePath, "utf8");

    const client = fakeCommentClient([
      "I already know about cohort retention analysis, stop explaining it every time.",
    ]);
    const result = await applyFeedbackFromIssue(1, client, fixtures);

    expect(result.changedFiles).toEqual(["knowledge"]);
    expect(readFileSync(fixtures.interestPath, "utf8")).toBe(beforeInterest);
    expect(readFileSync(fixtures.preferencePath, "utf8")).toBe(beforePreference);

    const after = parseYaml(readFileSync(fixtures.knowledgePath, "utf8"));
    const beforeParsed = parseYaml(before);
    const cohort = after.concepts.find((c: { id: string }) => c.id === "cohort-retention");
    const cohortBefore = beforeParsed.concepts.find((c: { id: string }) => c.id === "cohort-retention");
    expect(cohortBefore.familiarity).toBe("unfamiliar");
    expect(cohort.familiarity).toBe("familiar");

    // Nothing else in knowledge.yaml changed.
    const otherConcept = after.concepts.find((c: { id: string }) => c.id === "usage-based-pricing-101");
    expect(otherConcept.familiarity).toBe("unfamiliar");
  });

  it("a depth comment ('I want deeper pieces') flips preference.yaml's depth field from quick to deep", async () => {
    const fixtures = copyDeterminismFixtures("a");
    // Start from "quick" so the comment has something to change - the shared
    // fixture already reads "deep".
    writeFileSync(fixtures.preferencePath, readFileSync(fixtures.preferencePath, "utf8").replace("depth: deep", "depth: quick"));
    const beforePreference = parseYaml(readFileSync(fixtures.preferencePath, "utf8"));
    expect(beforePreference.depth).toBe("quick");

    const client = fakeCommentClient(["I want deeper pieces from now on, not summaries."]);
    const result = await applyFeedbackFromIssue(1, client, fixtures);

    expect(result.changedFiles).toEqual(["preference"]);
    const afterPreference = parseYaml(readFileSync(fixtures.preferencePath, "utf8"));
    expect(afterPreference.depth).toBe("deep");
    // Everything else on preference.yaml is untouched.
    expect(afterPreference.sources).toEqual(beforePreference.sources);
    expect(afterPreference.formats).toEqual(beforePreference.formats);
    expect(afterPreference.recency).toEqual(beforePreference.recency);
  });

  it("a source comment ('more from source Y') increases that source's weight in preference.yaml", async () => {
    const fixtures = copyDeterminismFixtures("a");
    const before = parseYaml(readFileSync(fixtures.preferencePath, "utf8"));
    expect(before.sources["gartner-blog"]).toBe(5);

    const client = fakeCommentClient(["I'd like more from gartner-blog please."]);
    const result = await applyFeedbackFromIssue(1, client, fixtures);

    expect(result.changedFiles).toEqual(["preference"]);
    const after = parseYaml(readFileSync(fixtures.preferencePath, "utf8"));
    expect(after.sources["gartner-blog"]).toBe(6);
    // The other source, and every other field, is untouched.
    expect(after.sources["random-newsletter"]).toBe(before.sources["random-newsletter"]);
    expect(after.depth).toBe(before.depth);
  });
});

describe("acceptance criterion 3: a comment with no recognisable signal leaves every state file unchanged", () => {
  it("exits successfully and reports no changed files", async () => {
    const fixtures = copyDeterminismFixtures("a");
    const beforeInterest = readFileSync(fixtures.interestPath, "utf8");
    const beforePreference = readFileSync(fixtures.preferencePath, "utf8");
    const beforeKnowledge = readFileSync(fixtures.knowledgePath, "utf8");

    const client = fakeCommentClient(["Great brief, thanks for putting this together!"]);
    const result = await applyFeedbackFromIssue(1, client, fixtures);

    expect(result.changedFiles).toEqual([]);
    expect(readFileSync(fixtures.interestPath, "utf8")).toBe(beforeInterest);
    expect(readFileSync(fixtures.preferencePath, "utf8")).toBe(beforePreference);
    expect(readFileSync(fixtures.knowledgePath, "utf8")).toBe(beforeKnowledge);
  });
});
