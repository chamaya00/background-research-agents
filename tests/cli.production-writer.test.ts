import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const HERE = dirname(fileURLToPath(import.meta.url));
const CLI_SOURCE = readFileSync(join(HERE, "..", "src", "cli.ts"), "utf8");

describe("acceptance criterion 1: the production posting entry point uses the model-backed writer", () => {
  it("imports and calls createModelWriter, not templateWriter", () => {
    expect(CLI_SOURCE).toMatch(/import\s*\{[^}]*createModelWriter[^}]*\}\s*from\s*"\.\/modelWriter\.js"/);
    expect(CLI_SOURCE).toMatch(/createModelWriter\(/);
    expect(CLI_SOURCE).not.toMatch(/templateWriter/);
  });
});
