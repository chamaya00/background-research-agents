import { mkdtempSync, copyFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const FIXTURE_DIR = join(HERE, "..", "..", "fixtures", "determinism");

export interface TempFixturePaths {
  dir: string;
  sourcesPath: string;
  itemsPath: string;
  interestPath: string;
  preferencePath: string;
  knowledgePath: string;
}

/**
 * Copies the checked-in determinism fixtures into a fresh temp directory so a
 * test can hand-edit or append to them on disk without mutating the fixtures
 * every other test reads.
 */
export function copyDeterminismFixtures(knowledgeVariant: "a" | "b" = "a"): TempFixturePaths {
  const dir = mkdtempSync(join(tmpdir(), "research-brief-"));

  const sourcesPath = join(dir, "sources.yaml");
  const itemsPath = join(dir, "items.json");
  const interestPath = join(dir, "interest.yaml");
  const preferencePath = join(dir, "preference.yaml");
  const knowledgePath = join(dir, "knowledge.yaml");

  copyFileSync(join(FIXTURE_DIR, "sources.fixture.yaml"), sourcesPath);
  copyFileSync(join(FIXTURE_DIR, "items.fixture.json"), itemsPath);
  copyFileSync(join(FIXTURE_DIR, "interest.fixture.yaml"), interestPath);
  copyFileSync(join(FIXTURE_DIR, "preference.fixture.yaml"), preferencePath);
  copyFileSync(join(FIXTURE_DIR, `knowledge.${knowledgeVariant}.fixture.yaml`), knowledgePath);

  return { dir, sourcesPath, itemsPath, interestPath, preferencePath, knowledgePath };
}

/** Fixed reference date within 30 days of both fixture items (2026-09-15 and -16). */
export const FIXTURE_AS_OF = new Date("2026-09-20T00:00:00Z");
