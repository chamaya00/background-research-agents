# Auto breadth - agentic AI features for analytics - 2026-09-24

**Produced in auto-breadth mode** ([`docs/reader/auto-breadth.md`](../../../reader/auto-breadth.md)),
unattended, in GitHub Actions. A research subagent wrote the breadth pass and
each level of each path. The driver chose every lead between levels and
checked the counts each conclusion rests on. It also corrected claims one path
disproved in another. No person chose anything between the seed and this page.
It is not a brief on an adopted topic, and **nothing here changes
`profile.md`**. The candidate topics at the end are proposals.

| | |
|---|---|
| Seed | Agentic AI features for analytics, launched or announced - warehouses, BI tools, semantic layers, notebooks: what is available, where each sits in a stack, and what evidence shows it works |
| Parameters | width 5, paths 3, depth 3 - the defaults |
| Reached | breadth + path 1 to depth 3 + path 2 to depth 3 + path 3 to depth 3 = **10 of 10 runs** |
| Window | 90 days, on or after 2026-06-26 - every subject here is a first appearance |

**Read this before the paths.** Unlike the 2026-09-23 session run, this one
could read the vendors' own documentation: `docs.snowflake.com`,
`docs.databricks.com`, `docs.cloud.google.com` and `arxiv.org` all answered.
What it could not do was run code. The runner's shell could not start, so
nothing was computed by script. Every count the driver checked was re-derived
by hand from the figures on the page. Three questions that need a program or a
vendor account were not answered. They are listed at the end as work for an
engineer.

The breadth pass's
[stack map](0-breadth.md#background-where-each-product-sits-in-a-stack) is the
place to start if the products are unfamiliar. It shows where each warehouse,
transformation tool, semantic layer, BI tool and notebook sits, and which
layer each vendor's agent reads.

---

## The headline across all three paths

**This quarter's agentic analytics features shipped with a quality claim and
an evaluator. The evaluator is handed to the buyer. At every point this run
could check, whatever decides whether an agent's answer is right, and
whether a number about it can be trusted, was set by the party reporting the
number, or not set at all. It was never published beside the number.**

- **The semantic layer does not bind Snowflake's recommended agent (paths 1
  and 3, from opposite directions).** On 2026-08-28 Snowflake told customers
  to move from Cortex Analyst to Cortex Agents for "higher answer quality",
  with no figure. Path 3 found that the agent "reads the information captured
  in the semantic view definition and generates the SQL against the physical
  tables directly". So the view's guard against double-counting across joins
  does not reach it. Path 1 found that Snowflake's evaluator for that agent
  does not remove the verified queries the agent can read. Snowflake's own
  guide recommends adding verified queries to fix unstable scores. **The
  semantic view reaches the agent as reading material, both when it answers
  and when it is tested.** Paths 1 and 3 started from different breadth
  angles, evaluation and query compilation, and reached the same product
  behaviour from each side. That meeting is itself a finding.
- **The rule for combining runs is the result (paths 1 and 2).**
  - On Thumbtack's only scorable questions (10 of 50), the choice among
    any-of-3, 2-of-3 and all-of-3 moves the pass count anywhere from 0 to 10.
  - On DataAgentBench, averaging five runs hides a strict gap of up to 29
    points, and weighting by dataset rather than by query swaps ranks 2 and 3.
  - Hex's evaluator passes a case that succeeds once in two attempts.
  - Snowflake's guide made "consistently accurate" the bar, and names no
    number of runs.
- **Where numbers exist, they do not measure what the claim needs (path 1).**
  - The vendors' in-window figures compare their agent with general coding
    agents, not with their own earlier product.
  - Snowflake's headline 86.3% cannot be a whole count out of the 58
    questions it says it used.
  - Snowflake's 2026-08-21 post quotes numbers its own table does not
    contain.
  - The one vendor benchmark with public tasks, data-eng-bench, drew two
    outside findings within a month. One was a wrong gold answer. The other
    was a web tool that Snowflake's own agent could not switch off during the
    published runs.
- **A leaderboard's top place was made after the runs (path 2).**
  DataAgentBench's rank 1 came from rerunning five failed queries, three of
  them under blocks written for those queries. The maintainers disclosed it in
  a footnote, then removed the footnote two days later. **One five-trial rerun
  on a two-query dataset decides rank 1.** The benchmark has no written rerun
  rule.

**Through-line.** This extends #42's "governance and meters, not accuracy",
and the breadth pass's "assert quality and hand over the evaluator". The rule
of evidence the three paths share is that an efficacy number counts only if
five things were fixed before the runs and published beside it:
- the query path;
- the hold-out;
- how attempts combine;
- what the average is taken over;
- which failures may be rerun.

No vendor claim in this window meets it. The Thumbtack paper comes closest,
and it prints one of its own rules without the figure it requires.

---

## The tree

```
Seed: agentic AI features for analytics
└─ Breadth pass (0-breadth.md) - 5 angles, 10 leads
   ├─ 1 Warehouse: Snowflake recommends Cortex Agents, "higher answer quality", no figure ── PATH 1
   │    L1 What stands behind the vendors' quality claims    → no comparison; in-window vendor figures vs coding agents; 86.3% not /58
   │    L2 Can Snowflake's own evaluators check the claim?   → no: different questions, grader, hold-out; a documented leakage path
   │    L3 What the 2026-08-25 evaluation-guide update changed → pinning, not comparing; verified-query fix dates from April
   ├─ 2 BI: Tableau's knowledge layer, GA slipped from June to October (not followed)
   ├─ 3 Semantic layer: Looker writes LookML into the warehouse ─────────── PATH 3
   │    L1 What survives the LookML-to-warehouse translation → row and standing filters "ignored"; three double-counting models
   │    L2 Do Snowflake's agents query through the view?      → Agents write physical SQL; Analyst goes through the view ~10%
   │    L3 Does Agents keep Analyst's fan/chasm-trap guard?   → nothing moved; undocumented either way
   ├─ 4 Notebooks: Hex Evals, and a pass rule that passes 1 of 2 (not followed)
   └─ 5 Evidence: Thumbtack's trace-backed evaluation ─────────────────────── PATH 2
        L1 The paper's scoring arithmetic; 41 of 50 under 2-of-3 → not computable; rule moves 0-10 of 10
        L2 Strict pass^5 on DataAgentBench's top entries       → rank 1 holds; averaging and weighting move 2 and 3
        L3 The rerun rules behind rank 1                       → query-specific blocks; one rerun decides; no written rule
```

- [Breadth pass](0-breadth.md), five items, with a section of **corrections
  made after the pass** at the end
- [Path 1 - What stands behind the warehouse vendors' quality claims for their agents](path-1-vendor-quality-evidence.md),
  three levels, ends with **Where this path ends**
- [Path 2 - What a trace-backed evaluation's headline numbers do and do not say](path-2-trace-backed-evaluation.md),
  three levels, ends with **Where this path ends**
- [Path 3 - What the warehouse's copy of a semantic model loses](path-3-semantic-layer-into-warehouse.md),
  three levels, ends with **Where this path ends**

---

## Every lead, kept or dropped

The breadth pass left ten leads, two per angle. The rules
([`auto-breadth.md`](../../../reader/auto-breadth.md), step 2) are, in order:
exclusion, motion, specificity, spread, and not already reported. Knowledge
was not used. No lead fell under Not interested (cost as a subject), so none
was excluded.

| Lead | From angle | Decision | Why |
|---|---|---|---|
| L1 - evidence behind Snowflake's "higher answer quality" | 1 | **Kept → path 1** | Motion (2026-08-28). Specific: a named claim with named documents to check. The driver had also found in-window vendor figures the breadth pass missed, so the lead had more to read than its item suggested. |
| L2 - Google's evidence for "Accuracy ... by design" in BigQuery Conversational Analytics | 1 | Dropped | Spread: same angle as path 1. Its GA was also dated 2026-06-23, outside the window; the in-window 2026-06-30 date is Google's blog post about it. |
| L3 - Tableau Knowledge's status: a real slip, or a different product? | 2 | Dropped | In motion (Dreamforce, 2026-09-15 to 17), but it would have rested on a trade report. Tableau's own page refused this run (403). Path 3's lead was the stronger in-window development at a fetchable source. **This is the drop the reader is most likely to overrule**: it is the only lead on a BI tool. |
| L4 - Tableau Agent's semantic-model generation (Beta), fidelity | 2 | Dropped | Less specific: a Beta feature with no document to fetch against, and a fidelity figure the breadth pass had already looked for and not found. |
| L5 - what survives Looker's LookML-to-warehouse translation | 3 | **Kept → path 3** | Motion (preview 2026-08-28). Specific: a parameter reference to read. Spread: the third distinct angle. Not already reported. |
| L6 - one Looker-derived semantic view queried by two agents | 3 | Dropped | Nothing to fetch yet. Its anchor is a Snowflake webinar on 2026-10-21, which is in the future. |
| L7 - Hex's pass rule: per-attempt export, any published pass rate | 4 | Dropped | Would converge with path 2, whose first lead already applied Hex's rule to the Thumbtack result. Path 2's level 1 covers it (item 2). |
| L8 - a measured before-and-after for a semantic-model change | 4 | Dropped | The breadth pass had already searched for such a result and found none; a second search was likely to record the same absence. The Databricks half rested on a search summary. |
| L9 - the scoring arithmetic of arXiv:2609.09182 | 5 | **Kept → path 2** | Motion (2026-08-28). The most specific lead in the pass. Full text readable. Serves `efficacy-methodology` directly. |
| L10 - map vendor evaluators onto the paper's three families | 5 | Dropped | Spread: same angle as path 2. Path 1's levels 2 and 3 ended up reading Snowflake's evaluator anyway. |

**Picks between levels.** Every pick had to be narrower than the lead it came
from.

- **Path 1, level 2.** Took "do Snowflake's Agent evaluations hold out
  verified queries, and can they carry expected SQL?" It is the question of
  whether a customer can check the claim at all.
  - The sharper lead was recomputing the wrong gold answer data-eng-bench
    PR #9 reports. It was **dropped because no one in this run could execute
    code**, and it is listed as work for an engineer.
  - "Was the 2026-08-21 post corrected?" needed `web.archive.org`, which the
    fetch tool cannot read.
- **Path 1, level 3.** Took "what did the 2026-08-25 guide update change?",
  the only remaining lead with in-window motion that needed no Snowflake
  account. The spike its level 2 proposed (verified queries present or removed
  under the Agent evaluator) needs an account.
- **Path 2, level 2.** Took strict pass^5 on DataAgentBench's top entries: the
  scores moved in September, the submissions are public, and it tests whether
  averaging hides inconsistency. The per-trial verdicts turned out not to be
  published, and the level bounded them from per-dataset tallies instead.
- **Path 2, level 3.** Took the query-specific rerun rules behind rank 1. It
  was dated 2026-09-13, readable, and needed no code. The two leads that would
  have settled ranks 2 and 3 exactly both need an engineer to run the
  validators.
- **Path 3, level 2.** Took "do Snowflake's agents query through the semantic
  view or only read it?" It decides whether any of level 1's double-counting
  protections reach the agent.
- **Path 3, level 3.** Took "does Cortex Agents keep Cortex Analyst's
  fan-trap and chasm-trap guard?", the accuracy question on the path
  Snowflake now recommends. Level 2's other sharp lead was about the older
  product's fallback.

---

## Stops, convergences, and corrections between paths

- **No path stopped early.** All three reached depth 3, so the budget of ten
  runs was spent in full.
  - **Path 3's level 3 found that nothing moved.** No Snowflake page, dated
    or undated, says whether Cortex Agents keeps Cortex Analyst's join
    checker. The level's items rest on current, undated documentation and on
    the 2026-08-28 note.
  - **Path 1's level 2 was thin on movement.** The evaluators' pages are
    undated. What moved the answer were the 2026-08-25 and 2026-08-28 pages.
- **Paths 1 and 3 met at Snowflake's Cortex Agents.** Neither followed the
  other's lead:
  - path 1 asked how the agent is tested;
  - path 3 asked how it writes SQL.
  
  Both found the semantic view is something the agent reads, not something
  that binds it. Path 3's level 2 quote is cited, not re-derived, in path 1's
  level 3.
- **Paths 1 and 2 met at repeat-run rules.** Snowflake's "consistently
  accurate is the bar" with no run count (path 1, level 3) and Hex's
  one-success-in-two (breadth item 4, path 2 level 1) are the same gap the
  Thumbtack paper and DataAgentBench show from the benchmark side.
- **Corrections, made where the claim sits:**
  - **Breadth pass, "No launch came with a number".** The launch notes
    carried none, but the vendors' engineering blogs published internal
    figures in the window:
    - Snowflake: 2026-06-30, 2026-08-06, 2026-08-21;
    - Databricks: 2026-07-23;
    - Hex: DataBench, 2026-08-13.

    The driver found these while the breadth pass ran, and path 1 read them.
  - **Breadth pass, BigQuery Conversational Analytics' GA.** It was
    2026-06-23 by Google's release notes, outside the window, not 2026-06-30.
  - **Breadth pass, item 1: "Cortex Analyst turns a question into one SQL
    query against a semantic view".** It does so for about one query in ten.
    Cortex Agents writes SQL against the tables (path 3, level 2).
  - **Breadth pass, Jupyter AI.** 3.2.0 was released 2026-09-03, inside the
    window. It is a maintenance release, so the notebook angle's conclusion
    stands.
  - **Path 2, level 1: "0.9467 (258 of 270 trials)".** 0.9467 is
    DataAgentBench's stratified score. The raw trial rate is 258/270 =
    0.9556. Corrected at level 2 from the driver's re-read of PR #95.
  - **Path 2, level 1: "PR #95 merged".** It was closed, not merged. The
    score was applied through the leaderboard data file. Corrected at level 2.
  - **Path 1, level 2: "two occurrences of 'verified queries'".** Level 3
    counted three, and the driver's own read returned one. All three counts
    came through a summarising fetch. **Unsettled**, and marked as such; the
    recommendation itself is in the guide either way.
  - **Path 3, level 2.** It said the 2026-08-28 note had one sentence on SQL
    generation. Level 3 found a second, which contradicts the 2026-04-13
    note. Corrected in place.
- **Counts the driver re-derived by hand** (no script could run), each marked
  *Driver's check* beside the subagent's figure:
  - Snowflake's *k*/58 table;
  - Databricks' four *k*/401 fits;
  - data-eng-bench's /309 and /103 fits and its three 103-sums;
  - Thumbtack's Table 6 row sums and the 0-to-10 bounds;
  - DataAgentBench's three per-dataset tallies (242, 245 and 258 trials) and
    their stratified scores;
  - the pass^5 bounds (48-50, 39-47, 33-45);
  - the five rerun scenarios (0.9467 to 0.8713).

  All held. The "benchmark-informed" count read three ways across fetches
  (12, 13, 15). The driver's row-by-row listing gives **14 of 40**, agreeing
  with path 2's level 3.
- **The fetch summariser invented or misattributed text four times.** Twice
  it misdated a Snowflake post as "August 2026". Once it quoted "genuine SQL
  generation ability", which is not on the page. Once it attributed guide
  lines to the wrong commit. Every quote the paths rely on was re-asked for
  verbatim.

---

## Candidate topics

Written as the Interests entries they would become. **None is in the
profile.** A reaction adopts one, and the driver shows the diff first.

- **`agent-claim-evidence`** · Depth, under `warehouse-agentic`. What stands
  behind a warehouse or BI vendor's quality claim for its analytics agent:
  - whether a published comparison exists, and against what baseline;
  - whether the vendor's own evaluator can check the claim;
  - whether the evaluator holds out what the agent reads.

  *From path 1.*
- **`repeat-run-rules`** · Depth, under `efficacy-methodology`. How repeated
  runs become one efficacy number:
  - pass rules (any, majority, all);
  - averaging and weighting;
  - abstention and coverage;
  - rerun policy.

  It asks, for each benchmark and evaluator, which of these were fixed before
  the runs. *From path 2.* It generalises across domains, as
  `efficacy-methodology` asks, and it is where the 2026-09-23 exploration's
  `benchmark-provenance` proposal would sit if adopted.
- **`semantic-layer-binding`** · Depth, under `semantic-models`. Whether a
  semantic definition binds the agent that reads it:
  - compiled deterministically, or given to the model as context;
  - what moving a definition between layers (BI tool → warehouse →
    exchange format) drops.

  *From path 3.*

**Open questions that need someone other than a researcher,** carried from
the paths:

- **One multi-fact question on one Snowflake semantic view**, run three ways:
  - through Cortex Analyst;
  - through Cortex Agents;
  - as a hand-written `SEMANTIC_VIEW()` query.

  It settles whether the agent double-counts. It needs an engineer with a
  Snowflake account (path 3).
- **Cortex Agent evaluations with and without the test questions' verified
  queries** in the semantic view, run several times at a pinned judge. It
  measures whether the evaluator's leakage path is real. It needs a Snowflake
  account (path 1).
- **Run DataAgentBench's validators** on Camber's and Scout's named branches,
  and unzip Permute EQ's trace archives to quote the query-specific blocks
  (path 2).
- **Recompute data-eng-bench's disputed gold answer** from the task fixture
  (PR #9's 28 of 51), a script (path 1).
