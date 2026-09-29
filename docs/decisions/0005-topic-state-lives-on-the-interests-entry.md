# ADR 0005: topic state lives on the Interests entry, not in its own file

Date: 2026-09-23
Status: accepted

## Context

Topics needed state a person could query - at minimum which topics are live,
how many times each has been briefed, when it was last refreshed, and whether
it has been retired - so that "run every active topic not updated in the last
seven days" is a read rather than an archaeology exercise across issues.

Some of that state already existed and was already wrong. The Window rule in
`docs/reader/profile.md` says 90 days for a topic's first appearance in a
brief and 30 days after that, which is a function of a run count nothing was
counting. Each Interests line carried the answer in prose instead, and by
2026-09-23 the `agent-efficacy` line still read "Not yet covered by any
brief" while [#29](https://github.com/chamaya00/background-research-agents/issues/29)
had given it three items. A fact two places have to agree on, maintained by
hand in prose, disagrees.

[ADR 0004](0004-curated-source-list-lives-beside-the-profile.md) settled the
test for where reader state goes, and it is not the shape of the data: it is
**who writes it**. `docs/reader/sources.md` is a separate file because its
rows are reachability observations and only a research run can produce one,
while `profile.md` is the driver's alone and that write rule is what makes the
reaction diff the only way a preference becomes true.

## Decision

**Topic state is carried on each entry in `profile.md`'s Interests section,
one topic per entry, and there is no separate topics file.**

Applying ADR 0004's test lands the other way here. A run count, a last-briefed
date and a retirement are all facts the *driver* produces, at the moment it
reacts to a brief - the same moment, in the same pull request, as the
preference edit that sits two lines below them. There is no second writer to
separate out.

The fields are `id`, status, `runs`, `last`, and - only when one exists - a
`run in flight`. Below them: the briefs that covered the topic, the items it
yielded, and the provenance of the line. A **Depth** topic names its parent.

**The window is derived from `runs`, never stored** - 90 days at zero, 30
after. It was stored in prose and that is what went stale; a derived field
cannot disagree with the count it is derived from.

**`Items` counts from [#29](https://github.com/chamaya00/background-research-agents/issues/29)**,
the first brief in which every item named the Interests line it served.
Earlier briefs predate that attribution and are not reconstructed, because a
guessed count is indistinguishable from a real one once it is written down.

`loop.md` step 6 is where the update happens: the reaction pull request, which
is the one moment the brief is finished, read, and in front of somebody.

*Amended by #39: the update moved to step 3, delivery, because a reaction may
never come and `run in flight` went stale while waiting for one. `/round`
carries it out. The rest of this decision is unchanged.*

## Consequences

Easy: answering "which active topics are stale" by reading one section;
retiring a topic without losing what it produced; a window that corrects
itself; and a driver updating state and preference in one diff a person reads
once.

Hard: the Interests section is now the longest part of a file that is inlined
into every issue body, and it grows per topic rather than per reaction. At
roughly fifteen topics it will need the same treatment ADR 0004 gave
`sources.md` - a compact table inlined, the detail read off the branch.

Ruled out later: a run maintaining this state. It cannot, and should not - a
run does not know it is run number three, and letting one write to
`profile.md` to find out would put a research run inside the file whose write
rule exists to keep the person's veto real.

## Alternatives rejected

**A separate `docs/reader/topics.md`.** The natural parallel to `sources.md`,
and it fails ADR 0004's own test: that file is separate because it has a
different writer, and this state does not. It would also list every topic a
second time, and the Interests lines would drift from it exactly as the prose
window notes already drifted from reality - which is the problem being fixed,
reintroduced one file over.

**A state table at the top of the Interests section, entries below.** One
file, but still two lists of the same topics, so still a drift surface. The
per-entry line costs one row of width and removes the second list entirely.

**Deriving it from GitHub rather than storing it.** Run counts and dates are
recoverable from issues and merge commits, so this is possible. Rejected
because a research run reads the default branch and the issue it was queued
on, and nothing else - state it cannot see is state it cannot act on, and the
window rule is acted on by every run.

**Storing the window per topic instead of deriving it.** That is what the
prose notes did, and it is what went stale.
