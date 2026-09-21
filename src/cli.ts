#!/usr/bin/env node
import { generateBrief } from "./brief.js";
import { templateWriter } from "./writer.js";

/**
 * Prints the generated brief as JSON on stdout. Fetching, model-backed
 * writing, and posting the result to GitHub are all out of scope here - see
 * issue #4 and #5. This exists so the deterministic core is invocable, not as
 * the finished pipeline.
 */
function main(argv: string[]): void {
  const [sourcesPath, itemsPath, interestPath, preferencePath, knowledgePath] = argv;
  if (!sourcesPath || !itemsPath || !interestPath || !preferencePath || !knowledgePath) {
    console.error(
      "usage: research-brief <sources.yaml> <items.json> <interest.yaml> <preference.yaml> <knowledge.yaml>",
    );
    process.exitCode = 1;
    return;
  }

  const brief = generateBrief({
    sourcesPath,
    itemsPath,
    interestPath,
    preferencePath,
    knowledgePath,
    writer: templateWriter,
  });

  console.log(JSON.stringify(brief, null, 2));
}

main(process.argv.slice(2));
