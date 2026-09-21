import { describe, expect, it } from "vitest";
import { selectAndRank } from "../src/select.js";
import type { FetchedItem } from "../src/schema/item.js";
import type { Interest } from "../src/schema/interest.js";
import type { Preference } from "../src/schema/preference.js";

describe("acceptance criterion 5: preference.formats ranks the earlier-listed format higher, all else equal", () => {
  it("ranks an article ahead of a video when formats lists article first, and reverses when formats is reversed", () => {
    const interest: Interest = {
      subjects: [{ id: "topic", label: "Topic", status: "active", weight: 3 }],
    };

    const base = {
      sourceId: "src",
      subjects: ["topic"],
      concepts: [],
      rawText: "identical length text for both items",
      publishedAt: "2026-09-15",
    };

    const items: FetchedItem[] = [
      { ...base, id: "video-item", title: "Video item", url: "https://example.com/v", format: "video" },
      { ...base, id: "article-item", title: "Article item", url: "https://example.com/a", format: "article" },
    ];

    const asOf = new Date("2026-09-20T00:00:00Z");
    const preferenceBase = {
      depth: "quick" as const,
      recency: { min_recency_days: 30, prefer_recent: true },
      sources: {},
    };

    const articleFirst: Preference = { ...preferenceBase, formats: ["article", "video"] };
    const videoFirst: Preference = { ...preferenceBase, formats: ["video", "article"] };

    const rankedArticleFirst = selectAndRank(items, interest, articleFirst, { asOf });
    expect(rankedArticleFirst.map((r) => r.item.id)).toEqual(["article-item", "video-item"]);

    const rankedVideoFirst = selectAndRank(items, interest, videoFirst, { asOf });
    expect(rankedVideoFirst.map((r) => r.item.id)).toEqual(["video-item", "article-item"]);
  });
});
