import { loadInterest, loadKnowledge, loadPreference, loadSources, loadFixtureItems } from "./state.js";
import { fetchItems, type SkippedSource } from "./fetch.js";
import { selectAndRank } from "./select.js";
import { buildInstruction, type Writer } from "./writer.js";

export interface BriefItem {
  id: string;
  sourceId: string;
  url: string;
  publishedAt: string;
  subjects: string[];
  concepts: string[];
  reason: string;
  text: string;
}

export interface Brief {
  items: BriefItem[];
  /** Sources that failed to fetch this run, and why - #5's criterion 2. */
  skipped: SkippedSource[];
}

export interface GenerateBriefConfig {
  sourcesPath: string;
  /** Fixture stand-in for a live fetch, read by `kind: fixture` sources only. Omit if none are fixtures. */
  itemsPath?: string;
  interestPath: string;
  preferencePath: string;
  knowledgePath: string;
  /** Injected dependency: a deterministic stub under test, `templateWriter` in production. */
  writer: Writer;
  /** Reference date recency is measured against. Defaults to now; tests pin it. */
  asOf?: Date;
  /** Injected so tests never make a real network call. Defaults to the global `fetch`. */
  fetchImpl?: typeof fetch;
}

/**
 * Reads all four state files fresh from disk on every call - a hand-edit to
 * one between two calls is picked up on the next one, with no caching layer
 * to invalidate.
 */
export async function generateBrief(config: GenerateBriefConfig): Promise<Brief> {
  const sources = loadSources(config.sourcesPath);
  const fixtureItems = config.itemsPath ? loadFixtureItems(config.itemsPath) : [];
  const interest = loadInterest(config.interestPath);
  const preference = loadPreference(config.preferencePath);
  const knowledge = loadKnowledge(config.knowledgePath);

  const { items: fetched, skipped } = await fetchItems(sources, {
    fixtureItems,
    fetchImpl: config.fetchImpl,
  });
  const ranked = selectAndRank(fetched, interest, preference, { asOf: config.asOf ?? new Date() });

  const items: BriefItem[] = await Promise.all(
    ranked.map(async ({ item, reason }) => {
      const instruction = buildInstruction(item, knowledge);
      return {
        id: item.id,
        sourceId: item.sourceId,
        url: item.url,
        publishedAt: item.publishedAt,
        subjects: item.subjects,
        concepts: item.concepts,
        reason,
        text: await config.writer(item, instruction),
      };
    }),
  );

  return { items, skipped };
}
