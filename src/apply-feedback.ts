import { writeFileSync } from "node:fs";
import { stringify as stringifyYaml } from "yaml";
import { loadInterest, loadPreference, loadKnowledge } from "./state.js";
import { extractSignals, applySignals, type FeedbackState, type Signal, type StateFile } from "./feedback.js";

/**
 * What `applyFeedbackFromIssue` needs from GitHub: the comments on one issue.
 * Kept narrow and injected so tests never make a real network call - same
 * shape as `IssueClient` in post.ts.
 */
export interface CommentClient {
  listComments(issueNumber: number): Promise<{ id: number; body: string }[]>;
}

export interface ApplyFeedbackPaths {
  interestPath: string;
  preferencePath: string;
  knowledgePath: string;
}

export interface CommentSignals {
  commentId: number;
  signals: Signal[];
}

export interface ApplyFeedbackResult {
  changedFiles: StateFile[];
  commentSignals: CommentSignals[];
}

/**
 * Reads every comment on a brief issue, in order, and folds each one's
 * signals into running interest/preference/knowledge state - a later
 * comment's signals are read against the state earlier comments already
 * produced. Only a state file a signal actually changed is written back to
 * disk; every other file on `paths`, and every file outside `paths`
 * entirely, is left untouched, and nothing from a comment body is ever
 * passed to a shell or interpreted as anything but text to match keywords
 * and known ids against - see feedback.ts. #6.
 */
export async function applyFeedbackFromIssue(
  issueNumber: number,
  client: CommentClient,
  paths: ApplyFeedbackPaths,
): Promise<ApplyFeedbackResult> {
  const comments = await client.listComments(issueNumber);

  let state: FeedbackState = {
    interest: loadInterest(paths.interestPath),
    preference: loadPreference(paths.preferencePath),
    knowledge: loadKnowledge(paths.knowledgePath),
  };

  const changedFiles = new Set<StateFile>();
  const commentSignals: CommentSignals[] = [];

  for (const comment of comments) {
    const signals = extractSignals(comment.body, state);
    const result = applySignals(state, signals);
    state = { interest: result.interest, preference: result.preference, knowledge: result.knowledge };
    for (const file of result.changedFiles) changedFiles.add(file);
    commentSignals.push({ commentId: comment.id, signals });
  }

  if (changedFiles.has("interest")) writeFileSync(paths.interestPath, stringifyYaml(state.interest));
  if (changedFiles.has("preference")) writeFileSync(paths.preferencePath, stringifyYaml(state.preference));
  if (changedFiles.has("knowledge")) writeFileSync(paths.knowledgePath, stringifyYaml(state.knowledge));

  return { changedFiles: [...changedFiles], commentSignals };
}
