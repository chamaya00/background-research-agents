import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { generateBrief, type Brief } from "../src/brief.js";
import { templateWriter } from "../src/writer.js";

/**
 * A recorded RSS 2.0 response, standing in for what a real feed like
 * TechCrunch's returns - see `scripts/verify-network.mjs` for the live run
 * this was checked against. Never fetched over the network in this suite.
 */
const VALID_RSS = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Example Feed</title>
    <item>
      <title>Usage-based pricing goes mainstream for AI features</title>
      <link>https://good.example.com/articles/usage-based-pricing</link>
      <guid>https://good.example.com/articles/usage-based-pricing</guid>
      <pubDate>Tue, 15 Sep 2026 12:00:00 GMT</pubDate>
      <description><![CDATA[<p>Vendors are shifting to usage-based pricing for AI features.</p>]]></description>
      <category>usage-based-pricing</category>
    </item>
  </channel>
</rss>`;

const MALFORMED_BODY = "this is not xml or rss at all";

interface FakeResponse {
  ok: boolean;
  status?: number;
  body: string;
}

function fetchImplFor(responses: Record<string, FakeResponse>): typeof fetch {
  return (async (input) => {
    const url = String(input);
    const response = responses[url];
    if (!response) throw new Error(`unexpected fetch of "${url}"`);
    return {
      ok: response.ok,
      status: response.status ?? 200,
      text: async () => response.body,
    } as Response;
  }) as typeof fetch;
}

describe("acceptance criteria 1 and 2: a real RSS fetch reaches the brief, a broken source doesn't stop the run", () => {
  let brief: Brief;

  beforeAll(async () => {
    const dir = mkdtempSync(join(tmpdir(), "research-brief-rss-"));
    const sourcesPath = join(dir, "sources.yaml");
    const interestPath = join(dir, "interest.yaml");
    const preferencePath = join(dir, "preference.yaml");
    const knowledgePath = join(dir, "knowledge.yaml");

    writeFileSync(
      sourcesPath,
      [
        "sources:",
        "  - id: good-rss",
        "    kind: rss",
        "    url: https://good.example.com/feed.rss",
        "    enabled: true",
        "  - id: broken-404",
        "    kind: rss",
        "    url: https://broken.example.com/feed.rss",
        "    enabled: true",
        "  - id: malformed-rss",
        "    kind: rss",
        "    url: https://malformed.example.com/feed.rss",
        "    enabled: true",
        "",
      ].join("\n"),
    );
    writeFileSync(
      interestPath,
      [
        "subjects:",
        "  - id: usage-based-pricing",
        "    label: Usage-based pricing",
        "    status: active",
        "    weight: 3",
        "",
      ].join("\n"),
    );
    writeFileSync(
      preferencePath,
      [
        "depth: quick",
        "formats:",
        "  - article",
        "recency:",
        "  min_recency_days: 365",
        "  prefer_recent: true",
        "sources:",
        "  good-rss: 1",
        "",
      ].join("\n"),
    );
    writeFileSync(knowledgePath, "concepts: []\n");

    const fetchImpl = fetchImplFor({
      "https://good.example.com/feed.rss": { ok: true, body: VALID_RSS },
      "https://broken.example.com/feed.rss": { ok: false, status: 404, body: "" },
      "https://malformed.example.com/feed.rss": { ok: true, body: MALFORMED_BODY },
    });

    brief = await generateBrief({
      sourcesPath,
      interestPath,
      preferencePath,
      knowledgePath,
      writer: templateWriter,
      asOf: new Date("2026-09-20T00:00:00Z"),
      fetchImpl,
    });
  });

  it("criterion 1: retrieves the recorded item and carries it through selection and writing unchanged", () => {
    expect(brief.items).toHaveLength(1);
    const item = brief.items[0]!;
    expect(item.sourceId).toBe("good-rss");
    expect(item.url).toBe("https://good.example.com/articles/usage-based-pricing");
    expect(item.publishedAt).toBe("2026-09-15");
    expect(item.text).toContain("Usage-based pricing goes mainstream for AI features");
  });

  it("criterion 2: the 404 and the malformed source are both skipped with a reason, and the good source's item still makes the brief", () => {
    expect(brief.skipped).toHaveLength(2);
    const reasonBySource = new Map(brief.skipped.map((s) => [s.sourceId, s.reason]));
    expect(reasonBySource.get("broken-404")).toMatch(/404/);
    expect(reasonBySource.get("malformed-rss")).toMatch(/not an RSS/i);
    expect(brief.items.map((i) => i.sourceId)).toEqual(["good-rss"]);
  });
});
