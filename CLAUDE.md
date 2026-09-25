# Project context

## What this is

A background research agent runner: agents run long-lived research tasks -
monitoring, investigation, report generation - and surface findings to a
person.

## Stack

TypeScript on Node 20, recorded in
[ADR 0001](docs/decisions/0001-stack-typescript-node.md). Zod-validated
input, vitest for tests, `@octokit/rest` for GitHub, `fast-xml-parser` for
feeds.

## Commands

- Install: `npm ci`. Run it before anything else - the other four all fail
  on a missing `node_modules` in a way that reads like a broken repository
  rather than a missing step.
- Dev: no dev server. The product is a command-line entry point; `npm run
  build` then `node dist/cli.js` is the closest thing.
- Checks CI runs: `npm run typecheck`, `npm run lint`, `npm run test`,
  `npm run build`.

Those four are what CI runs, as `ci / checks`. The placeholder scaffolding
gate that used to sit here was replaced in #8, when the first product code
landed - a gate that goes green on untested code is worse than no gate, so
the swap had to happen with that code rather than after it.

This section used to say the stack was not chosen and CI ran nothing. It was
false from #7 onward, and it was believed: #22's pull request body told a
reviewer that CI was still the placeholder gate, citing this file, while
`ci / checks` was green on that very pull request. A run cannot check a claim
its own permissions forbid it from checking, so what this file says about the
gate is what it will repeat.

Whatever the gate runs, the rule is the same. If a check is renamed here,
rename it in `.github/workflows/ci.yml` in the same commit, or the gate
silently stops checking that thing.

Branch protection is not part of that change and should not be touched by it.
The `ci` job is named `checks` on every path, so what protection requires stays
the same however often the commands under it change. Renaming that job is the
one edit here that breaks the rule: a required check that stops reporting
blocks every merge rather than gating them, including the pull request that
would name it back.

<!-- agent-factory:begin -->
<!-- Everything from here to the agent-factory:end marker describes the shared
     process rather than this project, and /update-agents replaces the whole
     block when this repository moves to a new factory release. An edit inside
     it is lost on the next update: put anything specific to this repository
     outside the block, where nothing will overwrite it. -->

## How work moves

Objectives become issues labelled `objective`. A human labels the objective
`agent:queued`; nothing else needs labelling by hand. The orchestrator splits it
into 1-5 child issues sized to the work, each with acceptance criteria and one
role label, and then queues them itself as each one becomes ready. A small
objective may be a single engineer issue - when it is, the orchestrator says
which roles it skipped, so a thin plan is visible rather than assumed.

It stays with the objective after the split. A child reaching `agent:review` or
`agent:blocked` wakes it: it reads the state of every child, queues whatever the
merge has just unblocked, rewrites and re-queues a child that blocked on its own
scoping, and replaces the status picture on the parent issue. The parent issue
is the whole surface - a human reads that and nothing else, and hears from the
orchestrator when a decision is genuinely theirs.

Ready means the issues a child depends on are merged to the default branch, not
merely finished and labelled `agent:review`. An agent reads the default branch,
so work that is finished but unmerged is invisible to the child that depends on
it. Which roles open a pull request for their own work is not restated here -
each role file says what that role does, and a summary of it in this file could
only drift. A run started too early refuses, correctly, and still spends one of
that issue's three attempts. That check is now the orchestrator's to make before
it queues anything.

The human still decides what merges. The orchestrator queues work and reports on
it; it does not merge a pull request, and it cannot break a child down further -
that comes back as `needs-decomposition` and a comment on the parent.

A role that hits a decision it cannot make asks it on its own issue and keeps
working under the answer it recommends. That question comes back labelled
`agent:needs-input`, which rides alongside `agent:review` rather than replacing
it: the work shipped and is reviewable, and what is waiting is an answer, not a
run. The orchestrator carries it onto the parent issue verbatim, so the parent
stays the only page a human has to read. It blocks the merge and nothing else,
and no merge policy covers it - that one is always the person's.

**Work that is refused comes back rather than stopping.** A driver that reads a
pull request and will not take it writes the review, drops `agent:review`, and
adds `agent:revise`. That starts a run on the branch and pull request that
already exist, holding the review as its brief. It spends a budget of two
revision rounds rather than one of the three attempts, which is what makes
rejecting a nearly-right diff affordable instead of a way to strand an issue at
`needs-decomposition`. A third round is refused and comes to a person, and it
is a finding about the review rather than about the role. The `house-rules`
skill carries both halves.

Labels: `objective`, `agent:queued`, `agent:running`, `agent:review`,
`agent:blocked`, `agent:needs-input`, `agent:revise`, `needs-decomposition`,
`needs-human`, `role:researcher`, `role:analyst`, `role:designer`,
`role:engineer`.

A label the preflight matches on and the repository does not have is a
mechanism that fails silently. Re-run `bootstrap` from the Actions tab after
picking up a release that adds one; it is idempotent.

## Driving an objective

A session that files an objective, or is pointed at one, is that objective's
driver: the person's window into it, and the technical judgment between an
agent's work and what ships. Nobody else is watching, and nothing downstream
catches what the driver waves through. Filing one is `/objective`, which
refines the idea, sets the merge policy, queues it, and hands back to the
session to drive.

The driver is expected to reject work that clears the merge gate and is still
not good enough - and to send it back with `agent:revise` rather than merely
saying so - to press a specification for definition before the child that
depends on it is queued, and to tell the orchestrator that a split or a brief
was wrong. What it does not get to decide is what the product should be. That
line - subject matter, not seniority - is the first thing the skill draws.

**Shorthand:** a message starting with `obj` - any case, with or without a
trailing `.` or `:` - means the same thing as typing `/objective`. Read
`.claude/commands/objective.md` and follow it, treating the rest of the
message as the rough idea. Nothing else is shorthand for anything; a plain
description of work with no `obj` prefix is a question or a discussion, not an
instruction to file something.

**Waking back up is `/check-in`.** Whether that is a person resuming a
session, a scheduled wake, or a subscribed pull request's activity firing one,
it runs the same catch-up: what is waiting on the person first, then the state
of every child, then the two reading passes over each waiting diff, merging
under the policy where it applies.

**Read `.claude/skills/driving-an-objective/` whenever an objective is in play**
- what to do with its merge policy, how to report, how to put a blocker so it
can be answered, and what only the person can decide. This paragraph exists to
say the role is yours; the skill says how to hold it.

## The rules

Not restated here. Two sections used to summarise them and every line had a
fuller source a click away, so the summaries could only ever drift out of
agreement with the thing they summarised - which is worse than not having them,
because a reader who finds a rule here stops looking for the real one.

- `.claude/skills/house-rules/` - what must be true before work starts and
  before anything merges, who may merge, the three-strike rule, and what no
  agent may touch.
- `.claude/skills/memory-protocol/` - how this repository's lessons are stored,
  capped, proposed, and retired.
- `.claude/skills/acceptance-criteria/` - what a criterion has to look like to
  gate anything.
- `.claude/skills/driving-an-objective/` - what the session in front of a person
  does once an objective is running, what it owns, and what it may refuse.
- `.claude/skills/briefing/` - what the orchestrator's report on a parent issue
  has to carry intact, what it compresses, and what a driver may send back.

Every agent run is told to follow the first three by name. The last two are the
two ends of one channel: the orchestrator writes to `briefing`, the driving
session reads by it, and the section above names them rather than leaving them
to be discovered.

<!-- agent-factory:end -->

## Reading a brief

The product here is one habit: read a brief, react to it in a sentence, have
the reaction change the next brief. `docs/reader/loop.md` is the mechanic and
`docs/reader/profile.md` is the state it writes - what subjects are worth
fetching, what is already known, and what shape the result should take.

Three rules, and they are the reason this is written in the half of the file
a factory release does not touch:

1. **Every research run reads `docs/reader/profile.md`** and treats it as a
   constraint on what it selects and on how it words what it selected. The
   session forming the objective inlines that file into the issue body, which
   is the only injection point a release cannot revert.
2. **A reaction is not applied until it is a committed line in that file.**
   Agreeing with someone in a session is not memory; the session ends.
3. **The driver shows the diff before committing it.** A reaction is
   translated by a reader, not obeyed literally, and the translation is the
   step the person has to be able to veto.

**`/round` runs the driver's side of a round**: forming and queuing the
next one, delivering a merged report and recording it, and turning a reaction
into a diff. A session-start hook says when a merged brief was never
recorded. Use the command rather than working the steps out from
`loop.md` each time. That is how round 4's topic state went unrecorded.

Knowledge changes wording only. A reaction that says something is already
understood must never narrow what gets fetched - that conflation is what
`docs/research/3-state-and-source-schema.md` was written to prevent.

**A second mode: auto breadth.** `/auto-breadth <seed>` explores a seed breadth
first and follows the best leads down several levels without a person between
levels - `docs/reader/auto-breadth.md` is the mechanic, ADRs 0006 and 0007 the
reasons. It runs in GitHub Actions by default (the `auto-breadth` workflow,
started by labelling an issue `auto-breadth` whose title is the seed; it opens
a pull request and never merges), or in a session when asked.
It reads the profile like any run and **never writes it**: a followed path is a
proposal until a reaction adopts it through the loop above. The loop stays the
default. **Shorthand:** a message starting with `auto breadth` - any case, with
or without a trailing `:` - means `/auto-breadth` with the rest of the message
as the seed. That and `obj` are the only two.

**A third mode: writing.** `/post [theme]` turns the research already here
into a LinkedIn article and feed post in the author's voice, synthesized across
at least two runs - `docs/writer/writer.md` is the mechanic and
`docs/writer/style.md` the state, tuned by reactions exactly as the profile is.
It runs in a session, fetches nothing, never writes the profile, and never
merges a post until the author says it is ready.

## Lessons

Cross-role, so they are here rather than in four copies under `docs/memory/`.
Same rules as those files: one line, the reason attached, deleted once a check
enforces it.

- Do not leave a pull request open across a factory release. #10 branched
  before v1.38.0 and its diff against `main` two days later would have deleted
  the `research-craft` skill and rolled four workflow pins back to v1.36.0 -
  it stopped being a retro and became a revert, while still reading as a
  retro in the list. Rebase it the day the release lands, or re-cut it from
  `main` and close the original.
