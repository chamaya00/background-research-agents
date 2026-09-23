# Reader profile - analytics for enterprise AI

What one person wants from the daily brief on this topic: which subjects are
worth fetching, what is already known, and what shape the result should take.
Every research run reads this file and treats it as a constraint. The driving
session maintains it. Nobody else writes to it.

This is not `docs/memory/`. Role memory is capped at 40 lines, is about how to
do the work, and the memory protocol is explicit that a line with no incident
behind it is a preference and preferences do not belong there. This file is
nothing but preferences, which is why it is product data rather than memory.

## How a line gets here

A line is added only by the loop in [`loop.md`](loop.md): a brief is read, a
reaction is given in the reader's own words, the driver renders that reaction
as a diff to this file, shows the diff, and commits it on a yes. No line is
written from something inferred silently, and no line is written from a
reaction the reader has not seen translated.

Every line cites the brief that produced it, so `git log` answers "why am I no
longer seeing this". A reaction that contradicts an existing line replaces it,
and the replaced line moves to **Retired** with both dates - a profile that
only ever grows becomes a wall nothing can read by round thirty.

## The three axes, and why they stay separate

Carried forward from
[`docs/research/3-state-and-source-schema.md`](../research/3-state-and-source-schema.md),
which settled this split for the pipeline that was being built at the time:

| Section | Question | Gates selection? | Changes wording? |
|---|---|---|---|
| Interests | which subjects get fetched | **Yes** | No |
| Not interested | what is actively excluded | **Yes** | No |
| Window | how far back an item may be dated | **Yes** | No |
| Knowledge | what is already known | **No** | **Yes** |
| Format | how the result is rendered | No | **Yes** |

Knowledge never removes an item and never reranks one. It decides whether a
concept an item touches gets explained or referenced in passing, and nothing
else. A reaction that reads as knowledge ("I already know what RAG is") must
not end up in Interests, or the brief quietly stops covering a subject the
reader only said they understood.

**Window** is a fifth section rather than a Format line, and the first
reaction is what exposed the need for it. Recency gates selection - an item
outside the window is excluded, not reworded - so filing it under Format would
be the exact conflation this split exists to prevent. #2's original three axes
had recency under *preference*, which gates selection; folding preference into
Interests and Format lost it, and this puts it back.

The encoding is prose rather than the YAML that document specified, because
the consumer changed: that schema was read by a parser, and this file is read
by an agent. The axes are the part that was decided; the file format was not.

## Interests

- Analytics for enterprise AI, broadly - what actually changed, not
  explainers. *Seed, from [#2](https://github.com/chamaya00/background-research-agents/issues/2), 2026-09-20. Confirmed
  as covering both readings - analytics products AI has changed, and the
  measurement of AI systems - by the reaction to brief
  [#24](https://github.com/chamaya00/background-research-agents/issues/24), 2026-09-23.*
- Measuring agent efficacy in an enterprise setting - evals, benchmarks, and
  what an enterprise accepts as evidence that a deployed agent works.
  *Brief [#24](https://github.com/chamaya00/background-research-agents/issues/24), "add another research angle on
  measuring agent efficacy in an enterprise setting", 2026-09-23. Not yet
  covered by any brief, so it carries the 90-day first pass below.*

<!--
Nothing below the seed line yet, on purpose. Subjects belong here once a
reaction has named one, not before. The example subjects in the schema
document (usage-based pricing, agentic BI, data residency) were illustrations
of a YAML shape and were never stated as interests - treating them as real
would put three invented preferences in front of every future run.
-->

## Not interested

<!-- Empty. Fills from reactions that say "less of this". -->

## Window

- **90 days for a subject's first appearance in a brief, 30 days after that.**
  *Brief [#24](https://github.com/chamaya00/background-research-agents/issues/24), "match the recommended 90 days at
  first then 30 days", 2026-09-23.*

<!--
This is #21's own recommendation, and its argument is why the rule is written
per *subject* rather than per brief: a first pass has no predecessor to have
covered the older material, and that is true of a newly added subject just as
much as of a newly started topic. Read per brief it would already have expired
- #20 and #24 both exist - and adding a subject would inherit a 30-day window
that has never once been applied to it.

So on the next run: "analytics for enterprise AI, broadly" is at 30 days, and
"measuring agent efficacy" is at 90.
-->

## Knowledge

<!--
Empty on purpose. Level per concept, one line each, e.g.

- `cohort-retention` - expert; report the delta, do not define it.
  *Brief 2026-09-28, "I already know cohort retention".*

Three levels only: new, familiar, expert. A concept marked familiar or expert
is referenced in passing; a concept marked new is explained once.
-->

## Format

- Delivered as a GitHub issue, reacted to in its comments.
  *Seed, from [#2](https://github.com/chamaya00/background-research-agents/issues/2), 2026-09-20.*
- One thing to open each morning - a single artifact, not a feed.
  *Seed, from [#2](https://github.com/chamaya00/background-research-agents/issues/2), 2026-09-20.*
- Every item carries what it is, a source link, a date, and **why it was
  selected**, traceable to a line in this file rather than asserted.
  *Seed, from [#2](https://github.com/chamaya00/background-research-agents/issues/2), 2026-09-20.*
- A concept recorded under Knowledge is reported as a delta, never
  re-introduced. *Seed, from [#2](https://github.com/chamaya00/background-research-agents/issues/2), 2026-09-20.*
- Sources come from a curated list rather than open search.
  *Seed, from the objective's delivery questions, 2026-09-20.*
- **Read the brief back in full in the session, not only as a link to the
  issue.** The issue is the durable record and the place a reaction is filed;
  the session is where it is actually read. Posting only a link makes reading
  it a second decision. *Brief [#29](https://github.com/chamaya00/background-research-agents/issues/29), "read 29 to me so i can
  react here... this should be standard operating procedure going forward",
  2026-09-23.*

## Retired

<!--
A line replaced by a later reaction, kept with both dates so a reversal is
visible. Nothing here yet.
-->
