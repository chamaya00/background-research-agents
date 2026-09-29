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
- **`benchmarks-depth`** · **active** · 2 runs · last **2026-09-23** · window **30d**
  **Depth**, under `agent-efficacy`: text-to-SQL and data-agent benchmarks by
  name - Spider, Spider 2.0, BIRD, ERPBench. Leaderboard movement,
  methodology, and what each one's design does and does not make measurable.
  *Briefs: [#35](https://github.com/chamaya00/background-research-agents/issues/35), [#42](https://github.com/chamaya00/background-research-agents/issues/42). Items: 6. Added by the reaction to [#29](https://github.com/chamaya00/background-research-agents/issues/29), "places i want to go deeper next,
  like ... the data benchmarks like spider and bird", 2026-09-23. Narrower
  than its parent rather than separate from it; breadth was explicitly kept.*
- **`dbt-context`** · **active** · 1 run · last **2026-09-23** · window **30d**
  **Depth**, under `analytics-broad`: dbt's semantic and context layer work -
  the Fivetran/dbt Agents Schema, the semantic-layer-versus-text-to-SQL
  benchmarks, and what is built on top of them.
  *Briefs: [#35](https://github.com/chamaya00/background-research-agents/issues/35). Items: 2. Added by the reaction to [#29](https://github.com/chamaya00/background-research-agents/issues/29), "the dbt findings", 2026-09-23.
  Narrower than its parent rather than separate from it.*
- **`semantic-models`** · **active** · 1 run · last **2026-09-23** · window **30d**
  **Depth**, under `dbt-context`: semantic models themselves - how one is
  defined, what it costs to build and maintain, who curates it, and the
  deterministic-compilation pattern that [#35](https://github.com/chamaya00/background-research-agents/issues/35)'s items 5 and 6 both
  landed on independently.
  *Briefs: [#42](https://github.com/chamaya00/background-research-agents/issues/42). Items: 3. Reaction to [#35](https://github.com/chamaya00/background-research-agents/issues/35), "dive deeper into semantic models", 2026-09-23.
  [#35](https://github.com/chamaya00/background-research-agents/issues/35)'s own counter-argument is why this is its own topic: every
  number in that report is accuracy on questions a semantic layer was built to
  answer, and nobody reports what building it took.*
- **`warehouse-agentic`** · **active** · 1 run · last **2026-09-23** · window **30d**
  **Depth**, under `analytics-broad`: agentic AI features shipped by the
  warehouse and transformation vendors themselves - Snowflake and dbt first.
  *Briefs: [#42](https://github.com/chamaya00/background-research-agents/issues/42). Items: 2. Reaction to [#35](https://github.com/chamaya00/background-research-agents/issues/35), "snowflake and dbt agentic ai features",
  2026-09-23.*
- **`efficacy-methodology`** · **active** · 0 runs · never run · window **90d**
  **Depth**, under `agent-efficacy`: how the efficacy of agentic AI is
  *proven*, not claimed - study designs (online experiments, holdouts,
  comparisons against a human baseline), offline evals and whether a benchmark
  is valid, and what an organization accepts as evidence. Lessons from **any
  agentic AI domain** count - coding, support, research agents - not only
  analytics.
  *Reaction to the Snowflake SQL AI functions exploration
  ([`docs/research/explore/2026-09-23-snowflake-sql-ai-functions/`](../research/explore/2026-09-23-snowflake-sql-ai-functions/README.md)),
  "Im more interested now in methodology to prove agentic ai efficacy ...
  Efficacy measurement lessons can also come from other agentic AI domains",
  2026-09-24. That exploration's path 1 - whether a benchmark's headline can be
  trusted - is folded in here as its first evidence rather than adopted as a
  topic of its own.*

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

**Who writes it, and when.** The driver, when the report is delivered -
`loop.md` step 3, which `/round` carries out. A research run does not touch
this file at all; that rule is what makes the reaction diff the only way a preference becomes
true. This is the same who-writes-it test that put `sources.md` in a separate
file, and it lands the other way here: run counts and retirement are the
driver's facts, so they belong beside the preference rather than in a file of
their own. See [ADR 0005](../decisions/0005-topic-state-lives-on-the-interests-entry.md).

**What it answers.** "Which active topics have not been refreshed in seven
days" is a read of status and `last` down this section, with `run in flight`
telling you which of those are already queued.

## Not interested

- **Cost and pricing of AI features as a subject in itself** - per-token
  pricing, metering, spend controls, cost benchmarks. Cost stays in where it is
  part of an efficacy measure, such as #42's cost per correct answer.
  *Reaction to the Snowflake SQL AI functions exploration, "im not so
  interested in continuing down any of these paths about cost", 2026-09-24.
  That exploration's two cost candidate topics were not adopted.*

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

- `outside-analytics-stacks` - **new**. Vendor analytics and data products
  outside Meta - warehouses, BI tools, semantic layers, notebooks, and the
  agent features built on them: explain what a product is and where it sits in
  a stack the first time it appears.
  *Reaction to the Snowflake SQL AI functions exploration, "Ive been at meta
  for 8 years and havent seen outside company stacks during that time",
  2026-09-24. Records only that these are new; nothing is inferred about what
  is known from inside Meta.*
- `data-engineering` - **new**, coming from product data science. Explain
  data-engineering concepts (modelling, orchestration, pipelines, testing,
  governance) in a clause the first time; product analytics and
  experimentation need no introduction.
  *"a product data scientist transitioning to data engineering", 2026-09-24,
  in the request that started the data-engineering exploration (#59). The
  last clause was the driver's inference, shown in the diff and accepted
  ("yes add the knowledge line too", 2026-09-25).*

## Format

- One thing to open each morning - a single artifact, not a feed.
  *Seed, from [#2](https://github.com/chamaya00/background-research-agents/issues/2), 2026-09-20.*
- Every item carries what it is, a source link, a date, and **why it was
  selected**, traceable to a line in this file rather than asserted.
  *Seed, from [#2](https://github.com/chamaya00/background-research-agents/issues/2), 2026-09-20.*
- A concept recorded under Knowledge is reported as a delta, never
  re-introduced. *Seed, from [#2](https://github.com/chamaya00/background-research-agents/issues/2), 2026-09-20.*
- Sources come from a curated list rather than open search.
  *Seed, from the objective's delivery questions, 2026-09-20.*
- **The research document *is* the brief, and it is read back in full in the
  session.** No condensed version, no separate rendering, and **no brief
  issue** - the document under `docs/research/` is the record, it already has
  a permanent URL, and a copy of it in an issue body is a second copy that can
  drift from the first. *Brief [#38](https://github.com/chamaya00/background-research-agents/issues/38), "i'd rather see the original 35
  in full ... don't prepare the briefs like 38 anymore", then "do you have to
  file it as an issue? why not just read it back word for word in here",
  2026-09-23.*
- **Reactions are given in the session**, and land in git: the reaction's own
  words go in the commit message and pull request body of the `profile.md`
  change they produce, beside the line they changed. *Same reaction. This is
  strictly better than an issue comment for the one job that matters - a
  profile line's provenance - because `git log -p docs/reader/profile.md` then
  carries the reaction and its effect in one place.*

<!--
Delivering as a GitHub issue was a seed preference from #2 on 2026-09-20, when
the plan was a scheduled pipeline whose feedback reader parsed brief-issue
comments. ADR 0003 stood that pipeline down; the issue outlived the mechanism
that needed it, and three rounds went by before anyone asked why it was there.

What is lost: a reaction is no longer visible to anyone outside the session
until the profile pull request lands. That is the whole cost, and it is
acceptable while there is one reader.
-->
- **Learning mode is the default.** Find what has been written and relate it
  to what I already know. Do not audit, recompute or adjudicate claims.
  Drilldowns and close scrutiny only when I ask for them by name.
  *Reaction to the 2026-09-24 explorations (#55, #56), "In general these
  explorations are Still too wordy and too narrowly focused on proving or
  disproving certain numbers. Id only want to see drilldowns and narrow
  scrutiny if i ask for it specifically. Otherwise im in learning mode, i just
  want to see whats been written out there and i want the researcher to help
  me find it and relate them back to me", 2026-09-24.*
- **Each article: a one-line header, then five short parts.** The header gives
  the title, link, date, source type, and whether it was read in full or only
  as a summary. Then:
  1. What is this article about
  2. Why is it being shown to me
  3. Have we seen something like this before
  4. What does it relate to
  5. The most relevant takeaways for me

  One or two sentences per part, about 120 words per article.
  *Same reaction, "The aspects that come with each post need to be condensed
  and the writing needs to be more concise. Lets try something like this per
  article", 2026-09-24. The 120-word figure is the driver's translation of
  "concise", shown in the diff and accepted.*
- **Read full pages, not abstracts or search summaries, and say which.**
  Prefer full text over a landing page, and a landing page over a search
  index. Twice in [#35](https://github.com/chamaya00/background-research-agents/issues/35) that difference decided whether something was
  a fact or an inference: item 5's system identification was impossible from
  the arXiv abstract and trivial from `arxiv.org/html/<id>v1`, and item 1's
  quotes were summarised by the rendered GitHub page and verbatim from
  `raw.githubusercontent.com`. Where only a summary was available, the article's
  header says so. *Brief [#35](https://github.com/chamaya00/background-research-agents/issues/35), "prioritize
  reading full pages, not just abstracts or search summaries", 2026-09-23.*
- **The report carries content, not plumbing.** What the run writes under
  `docs/research/` is what a reader reads: the items, the headline, what was
  dropped, what was searched for and not found, the recommendation and its
  argument against. **The process evidence goes in the pull request body
  instead** - window arithmetic and per-item filing decisions, the fetch
  record, which acceptance criterion each section satisfies, and the note on
  `src/`. A reviewer needs those; a reader does not. *Brief [#35](https://github.com/chamaya00/background-research-agents/issues/35),
  "leave out any plumbing comments / sections, only deliver content from the
  posts", 2026-09-23.*

  Two things stay in the report because they are content rather than plumbing:
  **what was dropped and why**, and **what was searched for and not found**. A
  near-miss and a verified absence are findings.
- **Item 6's source link is load-bearing beyond the item.** It is what lets a
  reader judge which sources keep earning their place. *Brief [#29](https://github.com/chamaya00/background-research-agents/issues/29),
  "link to the post so i can see where it came from and start identifying
  trustworthy sources", 2026-09-23. The same evidence `sources.md`
  accumulates.*

<!--
The parked question - whether docs/research/ still earns its keep once briefs
carry this much detail - is ANSWERED by the reaction above, and answered the
other way. The document is now the brief rather than a fuller copy behind one,
so there is nothing to weigh: removing it would remove the product.

A known limit, named here so it is not hit as a surprise. The 65,536-character GitHub
issue body limit stopped applying the moment the issue did, and the documents
had already run 23,880 (#19) -> 30,483 (#26) -> 49,355 (#35) toward it.

What still has a limit is a session message. If a report is too long to read
back in one, split it in reading order and say so - never condense it, which
is the thing the #38 reaction rejected.
-->

- **Synthesis leads, at three scales.** A consolidating "so what" - the
  sources pulled into one narrative, with what it means for me - gets the most
  care. The articles are supporting detail.
  1. **The whole run:** the index opens with a synthesis and so what across
     every path and source, **300-450 words**. It is always the first thing I
     read.
  2. **Each path** ends with **Where this path ends** - one paragraph.
  3. **Each level** ends with a short **So what** - two or three sentences.
  *Reaction to the data-engineering exploration's path 1 (#60), whose closing
  paragraph "surprised me by how much value it added": "This is consolidation
  and synthesis. Its valuable because it gives me the so what and connects the
  large amount of sources into a cohesive narrative that my brain can handle
  ... I want every following run to lean here harder", then "make the
  synthesis required for the entire run as a whole as well as at each level
  ... I want the first thing i read to be the whole run synthesis", and "The
  whole run should be a synthesis and so what, target budget 300-450 words",
  2026-09-25.*
- **An exploration is read back synthesis first:** the whole-run synthesis,
  then each path's "Where this path ends", then the level "So what"s.
  Articles are read only when I ask for a path in full.
  *Same reaction: "I tried reading the full path 1 output here but could only
  skim and still started losing attention by the time i got to layer 3."*

## Retired

- **Format:** "An auto-breadth exploration is read back as its index, in full,
  then its paths one at a time on 'next'." *Added 2026-09-24 from the reaction
  to the Snowflake exploration; replaced 2026-09-25 by synthesis-first
  read-back, after a full path lost the reader's attention by level 3.*

- **Format:** "Every item in it follows the same seven-part structure" - what
  it is, how long ago, how it relates, what through-line it changes, what to
  research next, the source link and read depth, and verified / inferred /
  assumed per item. *Added 2026-09-23 from the reactions to #29 and #35;
  retired 2026-09-24 by the reaction to #55 and #56, which replaced it with
  the five-part article above. Read depth survives as a tag in the header;
  verified / inferred / assumed does not.*

- **Format:** "Delivered as a GitHub issue, reacted to in its comments."
  *Seed, from [#2](https://github.com/chamaya00/background-research-agents/issues/2), 2026-09-20; replaced by the reaction to
  [#38](https://github.com/chamaya00/background-research-agents/issues/38), 2026-09-23, which put delivery and reactions in the session.
  The replacing lines landed in #39 and this one stayed behind until the
  round 4 topic-state update found it.*
- **Format:** "This governs the *presented* brief - the session read-back and
  the issue. The document under `docs/research/` is unchanged by it."
  *Added 2026-09-23 from the reaction to [#29](https://github.com/chamaya00/background-research-agents/issues/29); retired the same day by
  the reaction to [#38](https://github.com/chamaya00/background-research-agents/issues/38). The split between a presented brief and a
  stored document is gone - they are one artefact. The reasoning was that they
  serve different readers; the reader says they do not.*
- **Format:** "Read the brief back in the session, not only as a link."
  *Added 2026-09-23, narrowed from "in full" the same day, and now restored to
  **in full** by the reaction to [#38](https://github.com/chamaya00/background-research-agents/issues/38). The middle version lasted one
  round. Kept here because the round trip is the point: "in full" was removed
  as wordiness and came back as the requirement.*


- **Format:** "Read the brief back **in full** in the session." *Added
  2026-09-23 from the reaction to [#29](https://github.com/chamaya00/background-research-agents/issues/29); narrowed the same
  day by the same brief's second reaction - "too wordy". Reading it back in
  the session survives; reading it back **in full** does not. The six-part
  structure above replaces it.*

<!--
A line replaced by a later reaction, kept with both dates so a reversal is
visible.
-->
