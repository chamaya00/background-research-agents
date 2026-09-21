#!/usr/bin/env node
// Manual, documented run against the real model API for #9's criterion 3 -
// not part of the automated test suite, which never makes a live model
// call (see tests/modelWriter.test.ts). Requires ANTHROPIC_API_KEY in the
// environment. Run with `npm run verify-model-writer`.
//
// Runs the same item through both an "unfamiliar" and a "familiar"
// knowledge state for the one concept it touches, so the printed output
// shows the model complying with both directives in one pass.
import { createAnthropicClient, createModelWriter } from "../dist/modelWriter.js";
import { buildInstruction } from "../dist/writer.js";

const item = {
  id: "item-1",
  sourceId: "gartner-blog",
  title: "Enterprise buyers now expect usage-based AI pricing",
  url: "https://example.com/a",
  publishedAt: "2026-09-15",
  subjects: ["usage-based-pricing"],
  concepts: ["cohort-retention"],
  rawText:
    "Enterprise buyers are increasingly negotiating usage-based pricing for AI features, citing cohort retention data as their main justification.",
  format: "article",
};

const knowledgeWith = (familiarity) => ({
  concepts: [{ id: "cohort-retention", label: "Cohort retention analysis", familiarity, last_updated: null, note: null }],
});

const writer = createModelWriter(createAnthropicClient());

for (const familiarity of ["unfamiliar", "familiar"]) {
  const instruction = buildInstruction(item, knowledgeWith(familiarity));
  const text = await writer(item, instruction);
  console.log(`--- ${familiarity} (directives: ${instruction.directives.join(", ") || "none"}) ---`);
  console.log(text);
  console.log();
}
