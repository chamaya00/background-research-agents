import type { Knowledge } from "./schema/knowledge.js";
import type { FetchedItem } from "./schema/item.js";

/**
 * What the writing step hands the writer for one item: the item itself, and
 * one directive per concept the item touches, chosen from that concept's
 * familiarity. `explain:<id>` asks for a full inline explanation, `remind:<id>`
 * for a one-clause reminder, and an `expert` concept produces no directive at
 * all - per #3's design doc, that's the whole of what familiarity is allowed
 * to change.
 */
export interface Instruction {
  itemId: string;
  directives: string[];
}

export function buildInstruction(item: FetchedItem, knowledge: Knowledge): Instruction {
  const conceptById = new Map(knowledge.concepts.map((concept) => [concept.id, concept]));

  const directives = item.concepts.flatMap((conceptId) => {
    const concept = conceptById.get(conceptId);
    if (!concept) return [];
    switch (concept.familiarity) {
      case "unfamiliar":
        return [`explain:${conceptId}`];
      case "familiar":
        return [`remind:${conceptId}`];
      case "expert":
        return [];
    }
  });

  return { itemId: item.id, directives };
}

/** Injected dependency: production and tests each supply their own. */
export type Writer = (item: FetchedItem, instruction: Instruction) => string;

/**
 * Production writer. #3's design doc commits to a model-generated writer, but
 * this issue explicitly excludes live network access (a model API call is
 * one) and no currently queued child wires the credential that call would
 * need - see the issue body's "open question". This is a template
 * placeholder, not the production writer the ADR describes: it renders the
 * item's own fields plus a directive-driven note, with no model call and no
 * new outbound destination. Swapping it for a real model-backed writer is a
 * later, separate decision with its own `Privilege change:` line.
 */
export const templateWriter: Writer = (item, instruction) => {
  const explain = instruction.directives.find((d) => d.startsWith("explain:"));
  const remind = instruction.directives.find((d) => d.startsWith("remind:"));

  if (explain) {
    const conceptId = explain.slice("explain:".length);
    return `${item.title} (${item.url}) - includes background on ${conceptId}, a concept you haven't encountered yet.`;
  }
  if (remind) {
    const conceptId = remind.slice("remind:".length);
    return `${item.title} (${item.url}) - a quick reminder on ${conceptId}.`;
  }
  return `${item.title} (${item.url})`;
};
