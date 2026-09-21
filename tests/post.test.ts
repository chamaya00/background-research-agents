import { describe, expect, it } from "vitest";
import { postBrief, briefHash, renderIssueBody, type IssueClient } from "../src/post.js";
import type { Brief } from "../src/brief.js";

const brief: Brief = {
  items: [
    {
      id: "item-1",
      sourceId: "good-rss",
      url: "https://example.com/a",
      publishedAt: "2026-09-15",
      subjects: ["usage-based-pricing"],
      concepts: [],
      reason: "matches interest subject 'usage-based-pricing' (weight 3)",
      text: "Usage-based pricing goes mainstream for AI features",
    },
  ],
  skipped: [],
};

const MARKER_PATTERN = /<!-- (research-brief:[a-f0-9]+) -->/;

/**
 * Stands in for `createOctokitIssueClient`: a marker is "found" once
 * `createIssue` has been called with a body carrying it, the same relationship
 * a real search against GitHub has to a real create.
 */
function createFakeClient() {
  const created: { title: string; body: string }[] = [];
  const postedMarkers = new Set<string>();

  const client: IssueClient = {
    async hasMarker(marker) {
      return postedMarkers.has(marker);
    },
    async createIssue(title, body) {
      created.push({ title, body });
      const match = MARKER_PATTERN.exec(body);
      if (match?.[1]) postedMarkers.add(match[1]);
      return { number: created.length };
    },
  };

  return { client, created };
}

describe("acceptance criterion 3: post mode creates exactly one GitHub issue whose body is the generated brief", () => {
  it("calls createIssue exactly once with the rendered brief as the body", async () => {
    const { client, created } = createFakeClient();

    const result = await postBrief(brief, client);

    expect(created).toHaveLength(1);
    expect(result.created).toBe(true);
    expect(created[0]!.body).toBe(renderIssueBody(brief, briefHash(brief)));
  });
});

describe("acceptance criterion 4: running post twice against the same brief content does not create a duplicate issue", () => {
  it("finds the marker from the first run and skips creating a second issue", async () => {
    const { client, created } = createFakeClient();

    const first = await postBrief(brief, client);
    const second = await postBrief(brief, client);

    expect(created).toHaveLength(1);
    expect(first.created).toBe(true);
    expect(second.created).toBe(false);
    // The dedupe key: a sha256 hash of every selected item's id, url, and
    // rendered text (order-sensitive), embedded in the issue body as
    // `<!-- research-brief:<hash> -->` - see `briefHash` and `markerFor` in
    // src/post.ts. Both runs against the same brief content produce the same
    // hash, which is what `hasMarker` matches against.
    expect(second.hash).toBe(briefHash(brief));
    expect(second.hash).toBe(first.hash);
  });
});
