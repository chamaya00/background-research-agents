# ADR 0006: auto breadth runs inside a session, and never writes the profile

Date: 2026-09-23
Status: accepted

## Context

The way this repository was actually being used was a tree search run by hand:
a few broad briefs, read them, pick the leads worth following, run briefs on
those, read them, pick again. `semantic-models` and `warehouse-agentic` both
came from that process - a reaction to #35 naming leads #35 had written down.
The person wanted that operation reusable: give a seed, get back several
breadth-to-depth paths to read, without choosing between every level.

The existing machinery cannot do this, for two structural reasons:

- **Levels are gated on merges.** A research run reads the default branch, so
  the level below cannot start until the level above has merged, and only a
  session or a person merges. Runs are also serialised at the repository level
  and capped at 30 minutes each.
- **The orchestrator cannot grow a tree.** It makes one to five children and no
  grandchildren. Three paths three levels deep, plus a breadth pass, is ten runs.

And one rule it must not break: `profile.md` changes only through a reaction
the person has seen translated (`CLAUDE.md`, "Reading a brief", rule 2).

## Decision

**Auto breadth is a second mode, run inside an interactive session.** The
session is the driver; `researcher` subagents do the research; the session picks
leads between levels by rules written in
[`docs/reader/auto-breadth.md`](../reader/auto-breadth.md). Nothing merges
between levels because nothing reads the default branch until the end. One pull
request carries the whole exploration.

**Output lives under `docs/research/explore/<date>-<slug>/`**: an index
(`README.md`), the breadth pass (`0-breadth.md`), and one document per path
(`path-<n>-<slug>.md`) that reads breadth to depth, top to bottom. This is a
new data shape for `docs/research/` - a folder rather than a file, and no issue
number - which is why this is an ADR.

**The mode never writes `profile.md`.** Paths are proposals in the index. A path
becomes an Interests entry only through the ordinary reaction loop.

**Knowledge never scores a lead.** The axis split from
`docs/research/3-state-and-source-schema.md` applies to lead selection exactly
as it applies to item selection.

**Defaults are width 5, paths 3, depth 3, fully automatic, merged by the
session once green** - all set by the person, 2026-09-23.

## Consequences

- The ordinary loop is untouched: `/objective`, `loop.md`, and brief issues work
  as before. The two modes share `profile.md` as input and the reaction loop as
  output.
- An exploration is not evidence that the Actions pipeline works - it never runs
  there. The index says which mode produced it.
- It runs only while a session is alive. A scheduled Routine that starts a fresh
  session per seed is the route to running it unattended, and is not built yet.
- The session scores leads, so a bad pick is the driver's error and is visible:
  every lead's keep-or-drop reason is in the index.
- Cost is up to ten research subagents per seed at the defaults, spent from the
  same subscription as everything else.
- The command file `.claude/commands/auto-breadth.md` is not one of the six
  that `/update-agents` manages, so a release leaves it alone - but the release
  pull request will list it as a local-only file. That is expected.

## Alternatives rejected

- **A chain of objectives through the issue system.** Each level an objective,
  merged under a `green` policy. Works within the rules, but every level still
  waits on a live driver to merge, which is the babysitting this exists to
  remove, and ten serialised Actions runs take a day.
- **One long Actions run that does the whole tree.** A 30-minute, 150-turn cap
  for ten runs' worth of reading, all in one context. Depth would be the first
  casualty.
- **A TypeScript controller in `src/` calling the model directly.** Needs an API
  key where this repository runs on a Claude Code OAuth token - the same reason
  ADR 0003 moved research into agent runs.
- **Writing followed paths into Interests automatically.** Faster to adopt, and
  exactly the silent inference rule 2 forbids.
