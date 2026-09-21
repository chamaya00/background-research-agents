import type { Instruction, Writer } from "../../src/writer.js";

const EXPLANATIONS: Record<string, string> = {
  "cohort-retention":
    "Cohort retention analysis measures what share of a cohort keeps using a product over time.",
};

export interface StubWriterHandle {
  writer: Writer;
  instructions: Instruction[];
}

/**
 * The deterministic stub named in #3's design doc: renders a fixed string
 * from the instruction it is handed and records every instruction it saw, so
 * a test can assert against the instruction rather than only the rendering.
 */
export function createStubWriter(): StubWriterHandle {
  const instructions: Instruction[] = [];

  const writer: Writer = (item, instruction) => {
    instructions.push(instruction);

    const explain = instruction.directives.find((d) => d.startsWith("explain:"));
    if (explain) {
      const conceptId = explain.slice("explain:".length);
      return `${item.title} :: ${EXPLANATIONS[conceptId] ?? `full explanation of ${conceptId}`}`;
    }

    const remind = instruction.directives.find((d) => d.startsWith("remind:"));
    if (remind) {
      const conceptId = remind.slice("remind:".length);
      return `${item.title} :: quick reminder of ${conceptId}`;
    }

    return item.title;
  };

  return { writer, instructions };
}
