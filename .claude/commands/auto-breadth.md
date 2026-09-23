---
description: Explore a seed breadth first, then follow the best leads down several levels, automatically - and hand back every path to read at once.
argument-hint: "<seed> [width=5] [paths=3] [depth=3]"
---

Run an auto breadth exploration on `$ARGUMENTS`.

The procedure is [`docs/reader/auto-breadth.md`](../../docs/reader/auto-breadth.md).
Read it in full and follow it; this file only starts it. It lives under
`docs/` rather than here for the reason `docs/reader/loop.md` gives: that is
the half of the repository a factory release does not rewrite.

Anything after the seed of the form `width=N`, `paths=N` or `depth=N`
overrides that default. Everything else is the seed.

This is a separate mode, not a replacement for the loop: a brief on an
existing topic still goes through `/objective` and `docs/reader/loop.md`.
