import { loadInterest, loadKnowledge, loadPreference, loadSources, loadFixtureItems } from "./state.js";
import { fetchItems } from "./fetch.js";
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
}

export interface GenerateBriefConfig {
  sourcesPath: string;
  /** Fixture stand-in for a live fetch - see `fetchItems`. */
  itemsPath: string;
  interestPath: string;
  preferencePath: string;
  knowledgePath: string;
  /** Injected dependency: a deterministic stub under test, `templateWriter` in production. */
  writer: Writer;
  /** Reference date recency is measured against. Defaults to now; tests pin it. */
  asOf?: Date;
}

/**
 * Reads all four state files fresh from disk on every call - a hand-edit to
 * one between two calls is picked up on the next one, with no caching layer
 * to invalidate.
 */
export function generateBrief(config: GenerateBriefConfig): Brief {
  const sources = loadSources(config.sourcesPath);
  const allItems = loadFixtureItems(config.itemsPath);
  const interest = loadInterest(config.interestPath);
  const preference = loadPreference(config.preferencePath);
  const knowledge = loadKnowledge(config.knowledgePath);

  const fetched = fetchItems(sources, allItems);
  const ranked = selectAndRank(fetched, interest, preference, { asOf: config.asOf ?? new Date() });

  const items: BriefItem[] = ranked.map(({ item, reason }) => {
    const instruction = buildInstruction(item, knowledge);
    return {
      id: item.id,
      sourceId: item.sourceId,
      url: item.url,
      publishedAt: item.publishedAt,
      subjects: item.subjects,
      concepts: item.concepts,
      reason,
      text: config.writer(item, instruction),
    };
  });

  return { items };
}
