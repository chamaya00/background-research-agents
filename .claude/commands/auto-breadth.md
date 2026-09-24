---
description: Explore a seed breadth first, then follow the best leads down several levels, automatically - and hand back every path to read at once.
argument-hint: "<seed> [width=5] [paths=3] [depth=3]"
---

Run an auto breadth exploration on `$ARGUMENTS`.

The procedure is [`docs/reader/auto-breadth.md`](../../docs/reader/auto-breadth.md).
Read it in full and follow it; this file only starts it. It lives under
`docs/` rather than here for the reason `docs/reader/loop.md` gives: that is
the half of the repository a factory release does not rewrite.

**By default, start the `auto-breadth` workflow** rather than running the tree
in this session: file an issue titled with the seed, put any `width=N`,
`paths=N` or `depth=N` in its body, and label it `auto-breadth`. A session's
GitHub connection cannot dispatch a workflow directly, but the label starts it.
The workflow runs unattended on a runner with open network access, comments on
the issue, and opens one pull request. Then watch for that pull request, merge
it under the rules in the mode's step 5, and read the index back. Run the tree in the session only when the person
asks for that, or when the workflow cannot run. See the mode's "Where it
runs" section.

Anything after the seed of the form `width=N`, `paths=N` or `depth=N`
overrides that default. Everything else is the seed.

This is a separate mode, not a replacement for the loop: a brief on an
existing topic still goes through `/objective` and `docs/reader/loop.md`.
