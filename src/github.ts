import type { Octokit } from "@octokit/rest";
import type { IssueClient } from "./post.js";

/**
 * Production `IssueClient`: an already-authenticated `Octokit` instance, the
 * client ADR 0001 named for GitHub interaction. `hasMarker` searches issues
 * (open and closed) for the exact hash marker rather than listing every
 * issue, so a repository with a long history stays cheap to check.
 */
export function createOctokitIssueClient(octokit: Octokit, owner: string, repo: string): IssueClient {
  return {
    async hasMarker(marker) {
      const response = await octokit.search.issuesAndPullRequests({
        q: `repo:${owner}/${repo} "${marker}" in:body`,
      });
      return response.data.total_count > 0;
    },
    async createIssue(title, body) {
      const response = await octokit.issues.create({ owner, repo, title, body });
      return { number: response.data.number };
    },
  };
}
