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

   It also carries the **table section** of [`sources.md`](sources.md) and a
   pointer to that file by path - the table, not the whole file, and
   [ADR 0004](../decisions/0004-curated-source-list-lives-beside-the-profile.md)
   is where that split and its successor are argued. The per-entry detail is
   read off the branch.

2. **The run produces the brief.** A researcher child writes it and opens a
   pull request, or - for a round where the point is speed rather than
   plumbing - the driver writes it in session and says plainly that it did.
   Which one it was goes at the top of the brief, because a driver-written
   brief is not evidence that the pipeline works.

3. **The driver delivers the report itself.** The document the run wrote is
   read back in full in the session. It is not filed as a separate issue - it
   is already in git with a permanent URL, and a copy in an issue body is a
   second copy that can drift. **Not a summary of it** - that was tried once, in
   [#38](https://github.com/chamaya00/background-research-agents/issues/38),
   and rejected: a condensed brief drops the counter-argument, the near-misses
   and the numbered assumptions, which are the parts most likely to change how
   the report reads. Commentary from the driver goes alongside it, not instead
   of it.

   **Topic state is updated here**, not in step 6: bump `runs`, set `last`,
   append to `Briefs:`, add to `Items:`, and clear `run in flight`. Delivery is
   the fact that changes them, and a reaction may never come - `run in flight`
   was stale the moment #35's report was delivered, because this step used to
   live at 6.

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

   Topic state was already updated at step 3, when the report was delivered.
   If a reaction retires a topic or adds one, that lands here.

7. **Put the reaction's own words in the pull request** that changes
   `profile.md` - in the commit message and the body, beside the line they
   produced. That is the whole record: `git log -p docs/reader/profile.md`
   then carries what was said and what it changed in one place, which an issue
   comment never did. The
   issue thread is the human-readable record; `profile.md`'s history is the
   one the next run reads.

## The source list, and how step 2 uses it

[`sources.md`](sources.md) carries which hosts answer a fetch, which refuse,
and when that was last observed. Three commitments govern it, and they are
written here as well as in that file and in ADR 0004 because a rule about how
to use a file is useless where a run will not see it:

- **The list is reached first and by default, never the only thing a run is permitted to read.**
  It is a starting point, not an allowlist.
- **Open search stays available for everything the list does not cover.** The
  single most consequential item in [#26](https://github.com/chamaya00/background-research-agents/issues/26)
  arrived by search from a host no list would have carried yet. A list treated
  as a boundary would have excluded it.
- **The brief says, for each item, whether it came from a listed source or from search.**
  One clause per item. It is the only feedback the list has:
  without it there is no way to tell a list that is working from one that is
  being ignored.

A run that fetches a host amends that host's row - status and Observed date -
in the same pull request as the brief. Nothing checks reachability on a
schedule, so a row's Observed date is the whole of its warranty.

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
