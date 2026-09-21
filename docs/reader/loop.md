# The read-react-remember loop

The product of this repository is one habit: read a brief, react to it in a
sentence, and have the reaction change the next brief. Everything else here
is plumbing in service of that.

This file is the mechanic. [`profile.md`](profile.md) is the state it writes.
`CLAUDE.md` is what makes it binding on a session that has not read this file
yet.

## Why it is written here and not in `.claude/`

`/update-agents` rewrites `.claude/agents/`, `.claude/skills/`, and six named
files in `.claude/commands/` from the factory release, verbatim, and its own
instructions say a local edit "makes this repository quietly disagree with
every other one, and the next run of this command overwrites it anyway". A
role or skill edited there is reverted on the next release and the pull
request files it as drift.

What survives, checked against that command's file list: everything under
`docs/`, and everything in `CLAUDE.md` outside the
`agent-factory:begin`/`end` markers. So the loop lives in `docs/`, the rule
that binds it lives in the unmanaged half of `CLAUDE.md`, and neither is in
the factory's reach.

## One round

1. **Form the objective.** The driver writes the issue body, and the body
   carries the topic, the current contents of `profile.md`, and what changed
   since the last brief and why. This is the whole of the memory mechanism:
   a research run reads the default branch and the issue it was queued on, so
   the issue body is the injection point that survives a factory release.

2. **The run produces the brief.** A researcher child writes it and opens a
   pull request, or - for a round where the point is speed rather than
   plumbing - the driver writes it in session and says plainly that it did.
   Which one it was goes at the top of the brief, because a driver-written
   brief is not evidence that the pipeline works.

3. **The driver presents it**, with commentary: what it picked, what it
   dropped, and what it assumed was already known. The commentary is what
   makes a one-sentence reaction possible. Without it the reader has to
   reverse-engineer the selection before they can disagree with it.

4. **One sentence back.** That is the contract. Structured per-item questions
   are the fallback for a sentence that is genuinely ambiguous, not the
   default - a reaction that costs two minutes a day will not be given daily,
   and a loop nobody closes is worse than no loop.

5. **The driver renders the reaction as a diff and shows it before
   committing.** "You said *I already know cohort retention* → Knowledge:
   `cohort-retention` = expert" is the step where this goes wrong, and it is
   the reader's to catch. Silent inference across concepts is a real failure
   mode in this repository, not a hypothetical: it is what [#6](https://github.com/chamaya00/background-research-agents/issues/6)
   was sent back for.

6. **Commit the diff as one pull request against `profile.md`.** One per
   brief, so the file's git history is the reaction log.

7. **Post the reaction and the resulting diff back to the brief's issue**, so
   the thread is complete even when the reaction happened in a session. The
   issue thread is the human-readable record; `profile.md`'s history is the
   one the next run reads.

## What the driver owns here

Beyond the technical judgment the `driving-an-objective` skill already
describes:

- **Tuning the profile.** Translating reactions, showing the diff, retiring
  contradicted lines, keeping the file short enough to paste into an issue
  body.
- **Rendering the brief to the format lines.** `docs/research/` is written in
  the repository's format for the repository; the brief a person reads is a
  different artifact for an audience of one, today. Keeping the render with
  the driver means format preferences change every round at zero agent-run
  cost - and they are the fastest-moving preference there is.
- **Saying when the brief was thin.** A round that found nothing worth
  reporting is a finding about the source list, and it belongs in the
  presentation rather than being padded around.

## What the orchestrator does not own

Not quality. The orchestrator splits, queues, and reports status; judging
whether a brief is any good is the driver's, per `CLAUDE.md`. For a brief
that is one researcher run it is a one-child split and close to pure
overhead, which is fine and which it will say out loud. It earns its keep
when a round needs more than one run - a researcher fetching and an analyst
saying what moved since last week.
