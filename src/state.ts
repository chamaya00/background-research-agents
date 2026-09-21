import { readFileSync } from "node:fs";
import { parse as parseYaml } from "yaml";
import { z } from "zod";
import { InterestSchema, type Interest } from "./schema/interest.js";
import { PreferenceSchema, type Preference } from "./schema/preference.js";
import { KnowledgeSchema, type Knowledge } from "./schema/knowledge.js";
import { SourceListSchema, type SourceList } from "./schema/sources.js";
import { FetchedItemListSchema, type FetchedItem } from "./schema/item.js";

function loadYaml<T>(path: string, schema: z.ZodType<T>): T {
  const raw = readFileSync(path, "utf8");
  const parsed: unknown = parseYaml(raw);
  const result = schema.safeParse(parsed);
  if (!result.success) {
    throw new Error(`${path} does not match its schema: ${result.error.message}`);
  }
  return result.data;
}

export function loadInterest(path: string): Interest {
  return loadYaml(path, InterestSchema);
}

export function loadPreference(path: string): Preference {
  return loadYaml(path, PreferenceSchema);
}

export function loadKnowledge(path: string): Knowledge {
  return loadYaml(path, KnowledgeSchema);
}

export function loadSources(path: string): SourceList {
  return loadYaml(path, SourceListSchema);
}

export function loadFixtureItems(path: string): FetchedItem[] {
  const raw = readFileSync(path, "utf8");
  const parsed: unknown = JSON.parse(raw);
  const result = FetchedItemListSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error(`${path} does not match the fetched-item schema: ${result.error.message}`);
  }
  return result.data;
}
