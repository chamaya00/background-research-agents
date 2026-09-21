import { createHash } from "node:crypto";
import type { Brief } from "./brief.js";

/**
 * What `postBrief` needs from GitHub: find whether this brief's content was
 * already posted, and create the issue if not. Kept narrow and injected so
 * tests never make a real network call - see `createOctokitIssueClient` for
 * the production implementation.
 */
export interface IssueClient {
  /** True if an issue already carries this exact marker somewhere in its body. */
  hasMarker(marker: string): Promise<boolean>;
  createIssue(title: string, body: string): Promise<{ number: number }>;
}

export interface PostResult {
  created: boolean;
  issueNumber?: number;
  hash: string;
}

export interface PostOptions {
  title?: string;
}

/**
 * The dedupe key: a sha256 of each selected item's id, url, and rendered
 * text, order-sensitive. Two runs against unchanged state and an unchanged
 * writer produce the same hash; a hand-edit to any state file, a new item, or
 * a different writer output changes it. Embedded in the issue body as
 * `<!-- research-brief:<hash> -->` (see `renderIssueBody`) - that marker, not
 * the issue title or timing, is what `hasMarker` looks for.
 */
export function briefHash(brief: Brief): string {
  const canonical = JSON.stringify(brief.items.map((item) => ({ id: item.id, url: item.url, text: item.text })));
  return createHash("sha256").update(canonical).digest("hex");
}

export function markerFor(hash: string): string {
  return `research-brief:${hash}`;
}

export function renderIssueBody(brief: Brief, hash: string): string {
  const sections = brief.items.map(
    (item) => `### ${item.text}\n\n${item.url} — ${item.publishedAt}\n\n${item.reason}`,
  );
  const skippedNote =
    brief.skipped.length > 0
      ? `\n\n---\nSkipped: ${brief.skipped.map((s) => `${s.sourceId} (${s.reason})`).join("; ")}`
      : "";

  return `${sections.join("\n\n")}${skippedNote}\n\n<!-- ${markerFor(hash)} -->`;
}

/**
 * Posts a brief as exactly one GitHub issue, unless one carrying this exact
 * brief's hash marker already exists - #5's criteria 3 and 4.
 */
export async function postBrief(brief: Brief, client: IssueClient, options: PostOptions = {}): Promise<PostResult> {
  const hash = briefHash(brief);

  if (await client.hasMarker(markerFor(hash))) {
    return { created: false, hash };
  }

  const title = options.title ?? `Research brief - ${new Date().toISOString().slice(0, 10)}`;
  const { number } = await client.createIssue(title, renderIssueBody(brief, hash));
  return { created: true, issueNumber: number, hash };
}
