import { XMLParser } from "fast-xml-parser";
import type { Source, SourceList } from "./schema/sources.js";
import { FetchedItemSchema, type FetchedItem } from "./schema/item.js";

export interface SkippedSource {
  sourceId: string;
  reason: string;
}

export interface FetchResult {
  items: FetchedItem[];
  skipped: SkippedSource[];
}

export interface FetchOptions {
  /** Read by `kind: fixture` sources only - the stand-in fixed items file. */
  fixtureItems?: FetchedItem[];
  /** Injected so tests never make a real network call. Defaults to the global `fetch`. */
  fetchImpl?: typeof fetch;
}

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  isArray: (name) => name === "item" || name === "category",
});

type XmlNode = string | number | Record<string, unknown> | undefined;

function textOf(value: XmlNode): string {
  if (value === undefined) return "";
  if (typeof value === "object") {
    const text = (value as Record<string, unknown>)["#text"];
    return text === undefined ? "" : String(text);
  }
  return String(value);
}

function formatFromEnclosure(enclosure: XmlNode): string {
  const mime = typeof enclosure === "object" ? String(enclosure["@_type"] ?? "") : "";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "podcast";
  return "article";
}

function toIsoDate(pubDate: string): string {
  const parsed = new Date(pubDate);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`unparseable pubDate "${pubDate}"`);
  }
  return parsed.toISOString().slice(0, 10);
}

/**
 * Parses one RSS 2.0 document into `FetchedItem`s. Each item is validated
 * against the same schema a fixture file is, so a feed item missing a
 * required field fails the same way a malformed fixture does - one item that
 * cannot be shaped into a `FetchedItem` fails the whole source (#5's
 * criterion 2), rather than silently dropping just that item.
 */
function parseRssItems(sourceId: string, xml: string): FetchedItem[] {
  const doc: unknown = xmlParser.parse(xml);
  const channel = (doc as { rss?: { channel?: Record<string, unknown> } } | undefined)?.rss?.channel;
  if (!channel) {
    throw new Error("not an RSS 2.0 document (no rss.channel)");
  }

  const rawItems = channel.item;
  const items = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : [];

  return items.map((raw, index) => {
    const item = raw as Record<string, XmlNode>;
    const link = textOf(item.link);
    const guid = item.guid !== undefined ? textOf(item.guid) : link;
    const rawCategories = item.category;
    const categories = Array.isArray(rawCategories)
      ? rawCategories.map((c) => textOf(c as XmlNode))
      : rawCategories !== undefined
        ? [textOf(rawCategories)]
        : [];

    const candidate = {
      id: guid || `${sourceId}-${index}`,
      sourceId,
      title: textOf(item.title),
      url: link,
      publishedAt: toIsoDate(textOf(item.pubDate)),
      subjects: categories,
      concepts: [],
      rawText: textOf(item.description)
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim(),
      format: formatFromEnclosure(item.enclosure),
    };

    const parsed = FetchedItemSchema.safeParse(candidate);
    if (!parsed.success) {
      throw new Error(`item ${index} from "${sourceId}" does not match the fetched-item schema: ${parsed.error.message}`);
    }
    return parsed.data;
  });
}

async function fetchRssSource(source: Source, fetchImpl: typeof fetch): Promise<FetchedItem[]> {
  const response = await fetchImpl(source.url);
  if (!response.ok) {
    throw new Error(`${source.url} responded ${response.status}`);
  }
  return parseRssItems(source.id, await response.text());
}

/**
 * Fetches every enabled source. A source whose fetch or parse step throws -
 * unreachable, a non-2xx response, or a body that doesn't parse as the kind
 * it claims - is recorded in `skipped` with why, and excluded from `items`,
 * rather than failing the run (#5's criterion 2). `kind: fixture` never
 * throws this way; it only ever filters `fixtureItems`, which is why it is
 * not wrapped in the same try/catch as a real fetch below.
 */
export async function fetchItems(sources: SourceList, options: FetchOptions = {}): Promise<FetchResult> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const fixtureItems = options.fixtureItems ?? [];
  const items: FetchedItem[] = [];
  const skipped: SkippedSource[] = [];

  for (const source of sources.sources) {
    if (!source.enabled) continue;

    if (source.kind === "fixture") {
      items.push(...fixtureItems.filter((item) => item.sourceId === source.id));
      continue;
    }

    try {
      if (source.kind !== "rss") {
        throw new Error(`unsupported source kind "${source.kind}"`);
      }
      items.push(...(await fetchRssSource(source, fetchImpl)));
    } catch (error) {
      skipped.push({
        sourceId: source.id,
        reason: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return { items, skipped };
}
