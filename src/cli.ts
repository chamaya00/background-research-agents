#!/usr/bin/env node
import { Octokit } from "@octokit/rest";
import { generateBrief } from "./brief.js";
import { createAnthropicClient, createModelWriter } from "./modelWriter.js";
import { postBrief } from "./post.js";
import { createOctokitIssueClient } from "./github.js";

const USAGE =
  "usage: research-brief <sources.yaml> <interest.yaml> <preference.yaml> <knowledge.yaml> " +
  "[--items <items.json>] [--post --repo <owner/repo>] [--title <title>]";

interface ParsedArgs {
  sourcesPath: string;
  interestPath: string;
  preferencePath: string;
  knowledgePath: string;
  itemsPath?: string;
  post: boolean;
  repo?: string;
  title?: string;
}

function parseArgs(argv: string[]): ParsedArgs | undefined {
  const positional: string[] = [];
  let itemsPath: string | undefined;
  let post = false;
  let repo: string | undefined;
  let title: string | undefined;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--items") {
      itemsPath = argv[++i];
    } else if (arg === "--post") {
      post = true;
    } else if (arg === "--repo") {
      repo = argv[++i];
    } else if (arg === "--title") {
      title = argv[++i];
    } else if (arg !== undefined) {
      positional.push(arg);
    }
  }

  const [sourcesPath, interestPath, preferencePath, knowledgePath] = positional;
  if (!sourcesPath || !interestPath || !preferencePath || !knowledgePath) return undefined;
  return { sourcesPath, interestPath, preferencePath, knowledgePath, itemsPath, post, repo, title };
}

/**
 * Prints the generated brief as JSON on stdout by default. With `--post`,
 * posts it as a GitHub issue instead (#5). Item text comes from the
 * model-backed writer (#9, ADR 0003) - `ANTHROPIC_API_KEY` must be set in the
 * environment for either mode, since the writer runs before `--post` is
 * even checked.
 */
async function main(argv: string[]): Promise<void> {
  const args = parseArgs(argv);
  if (!args) {
    console.error(USAGE);
    process.exitCode = 1;
    return;
  }
  if (args.post && !args.repo) {
    console.error("--post requires --repo <owner/repo>");
    process.exitCode = 1;
    return;
  }

  const writer = createModelWriter(createAnthropicClient());

  const brief = await generateBrief({
    sourcesPath: args.sourcesPath,
    itemsPath: args.itemsPath,
    interestPath: args.interestPath,
    preferencePath: args.preferencePath,
    knowledgePath: args.knowledgePath,
    writer,
  });

  for (const skip of brief.skipped) {
    console.error(`skipped source "${skip.sourceId}": ${skip.reason}`);
  }

  if (!args.post) {
    console.log(JSON.stringify(brief, null, 2));
    return;
  }

  const [owner, repo] = args.repo?.split("/") ?? [];
  if (!owner || !repo) {
    console.error(`--repo must be "owner/repo", got "${args.repo}"`);
    process.exitCode = 1;
    return;
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error("--post requires GITHUB_TOKEN in the environment");
    process.exitCode = 1;
    return;
  }

  const client = createOctokitIssueClient(new Octokit({ auth: token }), owner, repo);
  const result = await postBrief(brief, client, { title: args.title });

  console.log(
    result.created
      ? `created issue #${result.issueNumber} (hash ${result.hash})`
      : `already posted (hash ${result.hash}); no new issue created`,
  );
}

await main(process.argv.slice(2));
