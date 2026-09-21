#!/usr/bin/env node
import { Octokit } from "@octokit/rest";
import { createOctokitCommentClient } from "./github.js";
import { applyFeedbackFromIssue } from "./apply-feedback.js";

const USAGE =
  "usage: research-brief-feedback <issue-number> --repo <owner/repo> " +
  "<interest.yaml> <preference.yaml> <knowledge.yaml>";

interface ParsedArgs {
  issueNumber: number;
  repo: string;
  interestPath: string;
  preferencePath: string;
  knowledgePath: string;
}

function parseArgs(argv: string[]): ParsedArgs | undefined {
  const positional: string[] = [];
  let repo: string | undefined;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--repo") {
      repo = argv[++i];
    } else if (arg !== undefined) {
      positional.push(arg);
    }
  }

  const [issueArg, interestPath, preferencePath, knowledgePath] = positional;
  const issueNumber = issueArg ? Number(issueArg) : NaN;
  if (!Number.isInteger(issueNumber) || !repo || !interestPath || !preferencePath || !knowledgePath) return undefined;
  return { issueNumber, repo, interestPath, preferencePath, knowledgePath };
}

/**
 * Reads every comment on `<issue-number>` and folds it into the three state
 * files - #6. Wiring this to the `issue_comment` trigger is a workflow
 * change and is left for the driver, same as the cron for #5.
 */
async function main(argv: string[]): Promise<void> {
  const args = parseArgs(argv);
  if (!args) {
    console.error(USAGE);
    process.exitCode = 1;
    return;
  }

  const [owner, repo] = args.repo.split("/");
  if (!owner || !repo) {
    console.error(`--repo must be "owner/repo", got "${args.repo}"`);
    process.exitCode = 1;
    return;
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error("requires GITHUB_TOKEN in the environment");
    process.exitCode = 1;
    return;
  }

  const client = createOctokitCommentClient(new Octokit({ auth: token }), owner, repo);
  const result = await applyFeedbackFromIssue(args.issueNumber, client, {
    interestPath: args.interestPath,
    preferencePath: args.preferencePath,
    knowledgePath: args.knowledgePath,
  });

  console.log(
    result.changedFiles.length > 0
      ? `updated: ${result.changedFiles.join(", ")}`
      : "no recognisable feedback signal in any comment; no state file changed",
  );
}

await main(process.argv.slice(2));
