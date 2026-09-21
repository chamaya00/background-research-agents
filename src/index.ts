export { generateBrief } from "./brief.js";
export type { Brief, BriefItem, GenerateBriefConfig } from "./brief.js";
export { templateWriter, buildInstruction } from "./writer.js";
export type { Writer, Instruction } from "./writer.js";
export { selectAndRank } from "./select.js";
export type { SelectedItem } from "./select.js";
export { fetchItems } from "./fetch.js";
export type { FetchResult, FetchOptions, SkippedSource } from "./fetch.js";
export { postBrief, briefHash, markerFor, renderIssueBody } from "./post.js";
export type { IssueClient, PostResult, PostOptions } from "./post.js";
export { createOctokitIssueClient, createOctokitCommentClient } from "./github.js";
export { extractSignals, applySignals } from "./feedback.js";
export type { FeedbackState, Signal, StateFile } from "./feedback.js";
export { applyFeedbackFromIssue } from "./apply-feedback.js";
export type { CommentClient, ApplyFeedbackPaths, ApplyFeedbackResult, CommentSignals } from "./apply-feedback.js";
export {
  loadInterest,
  loadPreference,
  loadKnowledge,
  loadSources,
  loadFixtureItems,
} from "./state.js";
