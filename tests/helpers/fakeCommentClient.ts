import type { CommentClient } from "../../src/apply-feedback.js";

/** Stands in for `createOctokitCommentClient`: comments are supplied up front, no network call. */
export function fakeCommentClient(bodies: string[]): CommentClient {
  const comments = bodies.map((body, index) => ({ id: index + 1, body }));
  return {
    async listComments() {
      return comments;
    },
  };
}
