# ADR 0007: auto breadth runs in GitHub Actions by default, in a workflow of its own

Date: 2026-09-24
Status: accepted. Supersedes the "runs inside a session" part of
[ADR 0006](0006-auto-breadth-mode.md). The rest of 0006 stands.

## Context

ADR 0006 put auto breadth in an interactive session. The issue plumbing gates
each level on a merge, its orchestrator cannot grow a tree, and runs are
serial and capped at 30 minutes. The first exploration
(`docs/research/explore/2026-09-23-snowflake-sql-ai-functions/`) showed what
that choice cost:

- **The cloud environment's network policy decided what the tree was about.**
  `docs.snowflake.com`, `arxiv.org`, `docs.databricks.com` and
  `docs.cloud.google.com` were refused before reaching the host, and two of the
  three leads the rules picked were displaced. The Actions runs behind #35 and
  #42 read the same hosts in full the same day.
- **A session has to stay alive** for the whole run, which is most of the
  babysitting the mode was built to remove.

It also showed what must not be lost: parallel subagents, and a driver with a
shell that checks every count a conclusion rests on. That checking produced
the headline evidence of two of the three paths.

## Decision

**A dedicated workflow, `.github/workflows/auto-breadth.yml`**, started by
hand (`workflow_dispatch`) with a seed and the three parameters. It runs Claude
Code once, as the driver, with the procedure in `docs/reader/auto-breadth.md`
unchanged. It does not go through issues, labels or the orchestrator, so none
of 0006's three constraints apply: one job builds the whole tree on one
checkout, levels hand work along in the working tree, and the job has four
hours.

**The agent never holds a write credential.** It reads untrusted web pages for
hours, so anything it can do, a page could talk it into doing:

- The checkout keeps no credential.
- The workflow token is `contents: read`.
- Bash is limited to reading, computing and local git.
- The action's subprocess secret scrub is on, so the agent's shell commands
  do not see the OAuth token.

A plain shell step after the agent compares every changed path against the
commit the run started from, and refuses to land anything outside the
exploration folder and `docs/reader/sources.md`. Only then does it mint the App
token, push one commit and open the pull request. The App identity is what
makes CI run on that pull request.

**A labelled issue starts it too** (added 2026-09-24, the same day). A session's
GitHub connection was refused when it tried to dispatch the workflow (403,
"Resource not accessible by integration"). A label a session adds does start
workflows; that is how `agent:queued` works. So an issue labelled
`auto-breadth` starts a run, with its title as the seed. A gate job refuses
unless both the labeller and the issue's author have write access, and it is
the only job that reads the issue. The App token that comments on the issue is
minted either in a separate job on its own runner (when the run starts) or
after the agent has finished (landing, or failure), so it never shares a
machine with the agent while the agent runs. This does not go through the
orchestrator. The orchestrator makes role-labelled children for `agent-run`,
which is exactly the machinery 0006 found a tree does not fit, and it is
factory-managed.

**It never merges.** The house rules keep merging with a session carrying the
person's instruction, or with the person. The standing "merge for me" in the
mode's step 5 is exercised by a session.

**A session remains a supported place to run it**, when the person asks or the
workflow cannot run. The command file and the mode doc say to dispatch by
default.

## Consequences

- Open network by default, with no environment setting to maintain.
- No live session is needed to produce an exploration. One is needed only to
  merge it and read it back, and that can be the next session the person opens.
- The read-back happens later than the research, not during it.
- Runner minutes: free on a public repository. If the repository goes private,
  one exploration at the defaults is roughly one to two hours of the monthly
  allowance.
- The same subscription is used, through `CLAUDE_CODE_OAUTH_TOKEN`, as
  agent-run uses it.
- It widens what automation can do: a new workflow that reads three secrets
  and runs three third-party actions, all pinned to commit SHAs. The pull
  request that adds it says so on a `Privilege change:` line.
- `/update-agents` does not manage this workflow, so a factory release leaves
  it alone and lists it as local.

## Alternatives rejected

- **Route it through issues and the orchestrator.** This hits all three of
  0006's constraints, and the orchestrator is factory-managed, so changing it
  would be reverted by the next release.
- **Keep it in sessions and widen the environment's network policy.** That
  fixes the network but not the need for a live session, and it is a setting
  that has to be kept in step with whatever hosts the next seed needs.
- **Give the agent the App token and let it push.** Simpler, but it puts a
  write credential in a context that reads arbitrary web content for hours.
  The path check is only trustworthy if the thing it checks cannot bypass it.
