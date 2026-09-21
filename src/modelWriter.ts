import Anthropic from "@anthropic-ai/sdk";
import type { FetchedItem } from "./schema/item.js";
import type { Instruction, Writer } from "./writer.js";

/**
 * What the model-backed writer needs from a model provider: one prompt in,
 * one string out. Kept this narrow and injected - same shape as
 * `IssueClient` in `post.ts` - so tests never make a real network call; see
 * `createAnthropicClient` for the production implementation (ADR 0003).
 */
export interface ModelClient {
  complete(prompt: string): Promise<string>;
}

/**
 * Builds the prompt from one item and its instruction (#4's `buildInstruction`
 * output). Per `docs/research/3-state-and-source-schema.md`'s "How an item's
 * narrative text is produced": an `explain:<id>` directive asks for a full
 * inline explanation, a `remind:<id>` directive for a one-clause reminder,
 * and no directive means the concept is `expert` and gets neither.
 */
export function buildPrompt(item: FetchedItem, instruction: Instruction): string {
  const explain = instruction.directives.find((d) => d.startsWith("explain:"));
  const remind = instruction.directives.find((d) => d.startsWith("remind:"));

  const directive = explain
    ? `The reader has not encountered "${explain.slice("explain:".length)}" before. Include a brief, ` +
      `self-contained inline explanation of that concept as part of your sentences.`
    : remind
      ? `The reader already knows "${remind.slice("remind:".length)}". Do not explain it - at most a ` +
        `single short clause reminding them it's relevant, never a definition.`
      : `The reader is already expert in every concept this item touches. Do not explain or define anything.`;

  return [
    "Write one or two plain-prose sentences introducing this item for a reader's daily research brief.",
    "Do not include the URL or a citation - it is shown separately.",
    "Do not use markdown formatting.",
    "",
    `Title: ${item.title}`,
    `Source text: ${item.rawText}`,
    "",
    directive,
  ].join("\n");
}

/**
 * Wraps a `ModelClient` as a `Writer` (#4's injected-writer interface).
 * Throws rather than returning broken or empty text - #9's criterion 4 - so a
 * failed or empty completion stops brief generation instead of posting a
 * blank or partial item. Errors from `client.complete` itself (an
 * unreachable or errored model API) are not caught here and propagate to the
 * caller for the same reason.
 */
export function createModelWriter(client: ModelClient): Writer {
  return async (item, instruction) => {
    const prompt = buildPrompt(item, instruction);
    const text = await client.complete(prompt);
    const trimmed = text.trim();
    if (!trimmed) {
      throw new Error(`model-backed writer produced empty text for item "${item.id}"`);
    }
    return trimmed;
  };
}

/**
 * Production `ModelClient`: Anthropic's Messages API via `@anthropic-ai/sdk`
 * (ADR 0003). Reads `ANTHROPIC_API_KEY` from the environment by the SDK's own
 * default lookup - never hardcoded, never logged - unless a key is passed
 * explicitly (tests only; production always uses the default).
 */
export function createAnthropicClient(apiKey?: string): ModelClient {
  const key = apiKey ?? process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error("ANTHROPIC_API_KEY is required to run the model-backed writer");
  }

  const client = new Anthropic({ apiKey: key });

  return {
    async complete(prompt) {
      const response = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        messages: [{ role: "user", content: prompt }],
      });

      const textBlock = response.content.find((block) => block.type === "text");
      if (!textBlock) {
        throw new Error("model response contained no text content");
      }
      return textBlock.text;
    },
  };
}
