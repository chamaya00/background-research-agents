import type { SourceList } from "./schema/sources.js";
import type { FetchedItem } from "./schema/item.js";

/**
 * Stand-in for a live fetch. Every source in scope here is `kind: fixture`;
 * its "fetch" is a filter over a fixed items file rather than a network call.
 * A real `kind: rss` fetch is out of scope for this issue (see #3's design doc).
 */
export function fetchItems(sources: SourceList, allItems: FetchedItem[]): FetchedItem[] {
  const enabledSourceIds = new Set(
    sources.sources.filter((source) => source.enabled).map((source) => source.id),
  );
  return allItems.filter((item) => enabledSourceIds.has(item.sourceId));
}
