# Project context

## What this is

A background research agent runner: agents run long-lived research tasks -
monitoring, investigation, report generation - and surface findings to a
person.

## Stack

TypeScript on Node 20, chosen in `docs/decisions/0001-stack-typescript-node.md`
over Python and Go because `ci.yml`'s gate has a documented Node path and
anything else meant hand-writing it. State files are YAML, validated with
`zod` at load so a hand-edit that breaks the shape fails loudly. `@octokit/rest`
for GitHub, `fast-xml-parser` for feeds.

`docs/decisions/0002-fetched-item-format-field.md` records the one data-shape
change since.

## Commands

- Install: `npm ci`. `node_modules` is not pre-installed, and skipping this
  makes `tsc` and `eslint` report dozens of unrelated-looking errors.
- Dev: `npm run build`, then the CLI entry points under `dist/`.
- Checks CI runs: `typecheck`, `lint`, `test`, `build` - the four npm scripts,
  named in `.github/workflows/ci.yml` as `checks: 'typecheck,lint,test,build'`.

The placeholder scaffolding gate this repository shipped with is gone. It did
its job: it failed the moment product code landed in #4, which is what it was
for, and was replaced in that same pull request rather than left to go green
on untested code.

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

## Lessons

Repository-specific lessons for the **driving session** - the interactive
session in front of a person, which is not an agent role and so has no
`docs/memory/<role>.md`. Role lessons live there; these live here because
there is nowhere else for them.

Same rules as a memory file: one line, stated as a rule with the reason
attached, proposed in a pull request, capped at 40 lines, and deleted once a
check enforces it.

<!-- Add lessons below this line, newest last. -->

- Re-read an issue's labels immediately before writing them: the write
  replaces the whole set rather than merging, and the orchestrator moves them
  between turns, so a set built from an earlier read silently reinstates what
  it has since cleared. A stale `agent:running` written back onto #2 this way
  made the wake-on-merge decline to queue the objective, and the chain sat
  still until somebody noticed.
- Address a comment to `@claude` when you need supervision to act on it: a
  bare comment on the parent is only read on a wake something else caused, so
  it records a finding without scheduling one. The same finding sat unread
  until a child happened to finish, then produced a new child within minutes
  once addressed.
