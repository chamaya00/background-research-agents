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

Each entry carries its own state on the first line. **How topic state works**
is below the entries; the short version is that a topic is one line here, the
state is maintained by the driver when a brief merges, and the window is
derived rather than stored.

- **`analytics-broad`** · **active** · 3 runs · last **2026-09-23** · window **30d**
  Analytics for enterprise AI, broadly - what actually changed, not
  explainers.
  *Briefs: [#20](https://github.com/chamaya00/background-research-agents/issues/20) (driver-written, round 0), [#24](https://github.com/chamaya00/background-research-agents/issues/24), [#29](https://github.com/chamaya00/background-research-agents/issues/29). Items: 2
  since [#29](https://github.com/chamaya00/background-research-agents/issues/29), when per-item line attribution began. Seed, from
  [#2](https://github.com/chamaya00/background-research-agents/issues/2), 2026-09-20. Confirmed as covering both readings - analytics
  products AI has changed, and the measurement of AI systems - by the reaction
  to [#24](https://github.com/chamaya00/background-research-agents/issues/24), 2026-09-23.*
- **`agent-efficacy`** · **active** · 1 run · last **2026-09-23** · window **30d**
  Measuring agent efficacy in an enterprise setting - evals, benchmarks, and
  what an enterprise accepts as evidence that a deployed agent works.
  *Briefs: [#29](https://github.com/chamaya00/background-research-agents/issues/29). Items: 3. Added by the reaction to [#24](https://github.com/chamaya00/background-research-agents/issues/24), "add
  another research angle on measuring agent efficacy in an enterprise
  setting", 2026-09-23.*
- **`benchmarks-depth`** · **active** · 0 runs · never run · window **90d** · run in flight: [#35](https://github.com/chamaya00/background-research-agents/issues/35)
  **Depth**, under `agent-efficacy`: text-to-SQL and data-agent benchmarks by
  name - Spider, Spider 2.0, BIRD, ERPBench. Leaderboard movement,
  methodology, and what each one's design does and does not make measurable.
  *Added by the reaction to [#29](https://github.com/chamaya00/background-research-agents/issues/29), "places i want to go deeper next,
  like ... the data benchmarks like spider and bird", 2026-09-23. Narrower
  than its parent rather than separate from it; breadth was explicitly kept.*
- **`dbt-context`** · **active** · 0 runs · never run · window **90d** · run in flight: [#35](https://github.com/chamaya00/background-research-agents/issues/35)
  **Depth**, under `analytics-broad`: dbt's semantic and context layer work -
  the Fivetran/dbt Agents Schema, the semantic-layer-versus-text-to-SQL
  benchmarks, and what is built on top of them.
  *Added by the reaction to [#29](https://github.com/chamaya00/background-research-agents/issues/29), "the dbt findings", 2026-09-23.
  Narrower than its parent rather than separate from it.*

### How topic state works

Recorded here rather than left to convention, because the Window rule already
depended on this state and was already wrong: before this section existed,
`agent-efficacy` still read "Not yet covered by any brief" while
[#29](https://github.com/chamaya00/background-research-agents/issues/29) had given it three items. A fact that two places have to agree
on, maintained by hand in prose, disagrees.

**The fields, in order on the first line of each entry:**

| Field | What it is |
|---|---|
| `id` | A stable short name. This is what a person or an issue refers to a topic by, so it does not change when the wording does. |
| status | **active** or **retired**. A retired topic keeps its entry and its history; nothing is deleted. |
| runs | How many briefs have covered this topic. |
| last | The date of the most recent brief that covered it, or **never run**. |
| window | **Derived, not stored** - 90 days at 0 runs, 30 days after that. |
| run in flight | The issue number of a queued or running brief covering this topic. Present only when there is one. |

**And on the italic line:** `Briefs:` the issues that covered it, which is the
audit trail the run count is derived from; `Items:` how many items it has
actually yielded; and the provenance of the line itself.

**`Items` is the field that earns its keep.** A topic that is active, has been
run three times and has yielded nothing is a topic to re-scope or retire, and
nothing else in this file would say so. It counts from [#29](https://github.com/chamaya00/background-research-agents/issues/29), the
first brief where every item named the Interests line it served; earlier
briefs predate that attribution and are not guessed at.

**A Depth topic names its parent.** It narrows a broader topic rather than
replacing it. The profile has no mechanism for a parent to outrank a child in
selection, and that is a known gap rather than an oversight - if depth should
displace breadth rather than compete with it, that is a decision to make
explicitly.

**Who writes it, and when.** The driver, in the same pull request that reacts
to a brief - `loop.md` step 6. A research run does not touch this file at all;
that rule is what makes the reaction diff the only way a preference becomes
true. This is the same who-writes-it test that put `sources.md` in a separate
file, and it lands the other way here: run counts and retirement are the
driver's facts, so they belong beside the preference rather than in a file of
their own. See [ADR 0005](../decisions/0005-topic-state-lives-on-the-interests-entry.md).

**What it answers.** "Which active topics have not been refreshed in seven
days" is a read of status and `last` down this section, with `run in flight`
telling you which of those are already queued.

## Not interested

<!-- Empty. Fills from reactions that say "less of this". -->

## Window

- **90 days for a subject's first appearance in a brief, 30 days after that.**
  *Brief [#24](https://github.com/chamaya00/background-research-agents/issues/24), "match the recommended 90 days at
  first then 30 days", 2026-09-23.*

**Each topic's current window is on its entry under Interests**, derived from
its run count rather than stored, so the rule and the state cannot disagree.

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
- **Read the brief back in the session, not only as a link to the issue.** The
  issue is the durable record and the place a reaction is filed; the session is
  where it is actually read. Posting only a link makes reading it a second
  decision. *Brief [#29](https://github.com/chamaya00/background-research-agents/issues/29), "read 29 to me so i can react here...
  standard operating procedure going forward", 2026-09-23.*
- **Every presented item follows the same six-part structure, in this
  order:**
  1. what it is, briefly;
  2. how long ago;
  3. how it relates to what has already been read;
  4. what through-line it changes, or that it changes none;
  5. one or two things to research next to go deeper on it;
  6. a link to the source it came from.

  **The structure is what replaces the wordiness, not brevity.** Each part
  carries as much detail as it is worth - "too wordy" was about prose that
  sprawled, and the correction is that a reader should know where in an item
  to find each thing, not that there should be less in it. *Brief
  [#29](https://github.com/chamaya00/background-research-agents/issues/29), "too wordy ... i want a more consistent structure
  among posts", then "the brief should be more detailed", 2026-09-23.*

  This governs the **presented** brief - the session read-back and the issue.
  The document under `docs/research/` is unchanged by it. *Whether that
  document still earns its keep once briefs carry this much detail is an open
  question the reader raised and parked on 2026-09-23; it is not decided here
  and nothing should be removed on the strength of it.*
- **Item 6 of that structure is the source link, and it is load-bearing beyond
  the item.** It is what lets a reader start judging which sources keep earning
  their place. *Brief [#29](https://github.com/chamaya00/background-research-agents/issues/29), "link to the post so i can see where
  it came from and start identifying trustworthy sources", 2026-09-23. This is
  the same evidence [#31](https://github.com/chamaya00/background-research-agents/issues/31) is building the curated source list
  from.*

## Retired

- **Format:** "Read the brief back **in full** in the session." *Added
  2026-09-23 from the reaction to [#29](https://github.com/chamaya00/background-research-agents/issues/29); narrowed the same
  day by the same brief's second reaction - "too wordy". Reading it back in
  the session survives; reading it back **in full** does not. The six-part
  structure above replaces it.*

<!--
A line replaced by a later reaction, kept with both dates so a reversal is
visible.
-->
