# Auto breadth - Snowflake SQL AI functions - 2026-09-23

**Produced in auto-breadth mode** ([`docs/reader/auto-breadth.md`](../../../reader/auto-breadth.md)).
A research subagent wrote the breadth pass and each level of each path. The
driving session chose every lead between levels, re-computed every count a
level's conclusion rests on, and corrected claims one path disproved in
another. No person chose anything between the seed and this page. It is not a
brief on an adopted topic, and **nothing here changes `profile.md`**. The
candidate topics at the end are proposals.

| | |
|---|---|
| Seed | Snowflake SQL AI functions (`AI_FILTER`, `AI_CLASSIFY`, `AI_AGG`, `AI_COMPLETE` and the rest of the family formerly called Cortex AISQL) |
| Parameters | width 5, paths 3, depth 3 - the defaults |
| Reached | breadth + path 1 to depth 3 + path 2 to depth 3 + path 3 to depth 2 (stopped thin) = **9 of 10 runs** |
| Window | 90 days, on or after 2026-06-25 - every subject here is a first appearance |

**Read this before the paths.** The session this ran in could not reach
`docs.snowflake.com`, `www.snowflake.com`, `arxiv.org`, `docs.databricks.com`
or `docs.cloud.google.com`: the environment's network policy refused them,
not the hosts. So Snowflake's own release notes and every newest paper appear
here only as search summaries, and **two of the three leads the rules would
have picked were displaced** (listed under the leads, below). What the run could
read in full was GitHub - benchmark repositories, SDK source, commit history,
data files - and Google's blog. That is why the three paths ended up being
about **evidence** rather than features: evidence is what lives on GitHub.

---

## The headline across all three paths

**Every number in circulation about SQL AI functions - how accurate they are,
what they cost, how much the cheap modes save - is either produced by a vendor
or rests on data nobody outside its authors has checked. And in the two cases
this run could check itself, the checking changed the number.**

- **Accuracy (path 1).** The one benchmark built on Snowflake's AI functions,
  Spider 2.0-AIFunc, reports that the best models reach 67-70%. That score is
  on 465 tasks, and the public release has 393. The answers are withheld and
  scored by hand. The answer keys were inherited from a gold set that Spider
  2.0 rewrote in October 2025, and **no version of them has been audited by
  anyone outside the two author teams**. The January audit that found most
  of Spider 2.0-Snow's public gold wrong judged the pre-October gold: 118 of
  the 120 files have changed since, including 65 of the 66 AIFunc bases the
  audit covered.
- **Cost (path 2).** The only production cost figure found is Snowflake's own:
  LLM calls are "80-90% of query cost", from a paper this run could read only
  as a summary. The only benchmark that runs a production warehouse's AI
  functions, SemBench on BigQuery, was co-written by Google's BigQuery team.
  It prices tokens at list rates rather than reading a bill, and **it
  undercounts**. Its runner takes whatever the inference log holds when it
  looks, and the log takes minutes to fill. 76 of 2,114 BigQuery records show
  $0, and partial counts are averaged into the published table. On cars Q5,
  BigQuery reads $1.47 where its complete runs average $1.88, which flips its
  ranking against ThalamusDB ($1.61). SemBench also wrote a Snowflake column
  and never scored it.
- **Savings (path 3).** Google's cheaper modes come with multiples of 230×,
  ~400× and 6,000×, and none of them comes with an accuracy figure. The
  6,000× is measured against row-at-a-time calls that Google's own smart
  batching, launched in the same post, already beats by 2,400×. Against that
  batching, the proxy is about **10× faster**. BigQuery's optimized mode is
  still preview, but its client names it the default, and a separate GA on
  2026-08-07 decides which tables get it without asking.

**Through-line.** This extends #42's: the vendors shipped meters rather than
accuracy improvements. This quarter they also shipped cheaper defaults, and
the measurement that would say what those defaults give up does not exist
independently yet. Snowflake is the least measured of the three vendors on
every axis here, because the one harness that could have measured it switched
Snowflake off.

---

## The tree

```
Seed: Snowflake SQL AI functions
└─ Breadth pass (0-breadth.md) - 5 angles, 10 leads
   ├─ 1 What shipped: SDK dropped "experimental", 15 functions ... (not followed)
   ├─ 2 Spend control: Cortex AI Gateway preview, per-user quotas ... (lead displaced - network)
   ├─ 3 Cost as an optimiser problem ─────────────────────── PATH 2
   │    L1 SemCEB and the cost of AI_FILTER/AI_JOIN
   │    L2 Does any benchmark measure a production warehouse?
   │    L3 Is SemBench's BigQuery cost an undercount?  → yes, and it reaches the paper
   ├─ 4 Rivals copied the vocabulary, no accuracy numbers ── PATH 3
   │    L1 BigQuery optimized mode vs Snowflake's cascades
   │    L2 What each of Google's savings figures is measured against
   │    (stopped: thin)
   └─ 5 AIFunc benchmark can't run on shared accounts ────── PATH 1
        L1 The 465-versus-393 gap                     → a real cut; headline on 465
        L2 Tasks built on mis-annotated examples      → bounded: 84 of 393
        L3 Which Spider 2.0 version, does the audit reach it → no; nobody has audited the gold
```

- [Breadth pass](0-breadth.md)
- [Path 1 - Spider 2.0-AIFunc reproducibility](path-1-aifunc-reproducibility.md), three levels, ends with **Where this path ends**
- [Path 2 - The cost of a semantic operator](path-2-semantic-operator-cost.md), three levels, ends with **Where this path ends**
- [Path 3 - Cheaper per-row AI calls, and what they give up](path-3-cross-vendor-functions.md), two levels

---

## Every lead, kept or dropped

The breadth pass left ten leads. The rules
([`auto-breadth.md`](../../../reader/auto-breadth.md), step 2) are: exclusion,
motion, specificity, spread, and not already reported. Knowledge was not used.

| Lead | From angle | Decision | Why |
|---|---|---|---|
| L9 - AIFunc's 465 vs 393 | 5 | **Kept → path 1** | Motion (2026-07-07), sharpest single question, and it bears on a number the reader has been told twice (#35, #42). Readable on GitHub. |
| L5 - full text of Snowflake's arXiv:2608.27244 ("80-90% of query cost") | 3 | **Displaced** | The rules' second pick: Snowflake measuring its own production cost. On `arxiv.org`, which the environment refused, so it would have stopped thin at level 1. |
| L6 - SemCEB at 10,000 rows | 3 | **Kept → path 2** | Same angle as L5, in window (2026-07-24), readable. Path 2 was also asked to reach L5 by any legitimate route; it could only get summaries. |
| L3 - do per-user quotas cover warehouse `AI_*` calls? | 2 | **Displaced** | The rules' third pick, and the question an enterprise buyer asks first. On `docs.snowflake.com`, which was refused. |
| L4 - Service Consumption Table rates | 2 | Dropped | Evergreen, and on a refused host. |
| L8 - BigQuery optimized mode | 4 | **Kept → path 3** | Took angle 2's place, since both of its leads were on refused hosts. It is the counterpart to Snowflake's cascades, and partly readable. |
| L7 - Databricks AI Functions REST billing | 4 | Dropped | Same angle as path 3, and on a refused host. |
| L1 - BCR-2184/2358 NULL-on-error billing | 1 | Dropped | Refused host, and a "what does the note say" lead. |
| L2 - July 2026 model deprecations | 1 | Dropped | Refused host, and a "what does the note say" lead. |
| L10 - outside scores on AIFunc | 5 | Dropped | Same angle as path 1; the absence was already verified in the breadth pass. |

**Picks between levels:**

- **Path 1.** L2 took the mis-annotation cross because level 1's other leads
  sat on arXiv. L3 followed the audit's own supplement once the session
  extracted it.
- **Path 2.** L2 took "does any benchmark measure a production warehouse?"
  over an open, academic pull request. It was the most seed-relevant question
  that could be answered. L3 took the undercount once the session had counted
  it across every metrics file.
- **Path 3.** L2 took "what is each savings figure measured against?" because
  level 1's preferred lead was on a refused docs host.

---

## Stops, convergences, and corrections between paths

- **Path 3 stopped at level 2, as thin.** Every remaining lead needed Google's
  docs, arXiv, or Medium, all refused, or was already answered as an absence.
- **Paths 2 and 3 met at SemBench.** Both read the same BigQuery runner and
  query files, and both found optimized mode switched off. Path 2 cites path
  3 rather than re-deriving it. Independent descents from breadth items 3 and
  4 arriving at the same harness is itself the finding: **it is the only
  place anyone runs a production warehouse's AI functions beside academic
  systems.**
- **Corrections made where the claim sits, not only here:**
  - **Path 3, level 1** said BigQuery "fails the query" when the proxy misses.
    That came from a search summary. Level 2 read Google's own post, which
    says the optimizer falls back to the LLM. Corrected at all four places.
  - **Path 3, level 1** attributed SemBench to the SemCEB group. Path 2 read
    the citation block, which names Google BigQuery authors. Corrected.
  - **Path 3, level 1** called Databricks' 94.7% the window's only accuracy
    figure. Path 2 found an earlier 0.81 for `ai_classify` (summary only).
    Corrected.
  - **Path 2, level 2** said no Snowflake runner exists. Level 3 found one in
    the paper snapshot's `docs/`: written, partly run, never scored.
  - **Path 1, level 2** estimated about 41 wrong bases. Level 3 withdrew that
    estimate, because the audit judged gold AIFunc never used.
  - **Counts re-computed by the session, by script.** Path 1: 84/58/26/66;
    the 120 public-gold files; 345 rewritten questions; 118 of 120 changed
    gold files. Path 2: the 76 zero-cost records, and the cars Q5 figures.
    Where a subagent had counted by hand or by line length, the exact figure
    is added beside it.
- **The WebFetch summariser invented facts twice on path 3.** It reported
  "Generally Available" where the page did not say it, and "90% to 116% in
  10 benchmarks" where the page said 90-102% in 10 and 116% in the 11th.
  Every figure path 3 relies on was re-read verbatim.

---

## Candidate topics

Written as the Interests entries they would become. **None is in the
profile.** A reaction adopts one, and the driver shows the diff first.

- **`benchmark-provenance`** · Depth, under `benchmarks-depth`. Whether a
  benchmark's headline can be trusted: paper set against released set, who
  holds the answer key, whether the gold was ever audited, and which version
  was scored. *From path 1.* It generalises beyond AIFunc; the same questions
  apply to every leaderboard `benchmarks-depth` tracks.
- **`ai-function-cost-measurement`** · Depth, under `warehouse-agentic`. What
  a SQL AI function really costs, and whether anyone measures it
  independently: token sources reconciled against bills, optimiser-set cost,
  per-user quotas. *From path 2.* It would also pick up the displaced L3
  (quotas) and L5 (Snowflake's 80-90%) once those hosts are reachable.
- **`cheap-mode-tradeoffs`** · Depth, under `warehouse-agentic`. Vendors'
  cheaper per-row modes (distillation, cascades, proxies): what accuracy they
  disclose giving up, what baseline their savings are measured against, and
  who gets them by default. *From path 3.*

**Open questions that need someone other than a researcher,** carried from
the paths:

- Score SemBench's unscored Snowflake medical results against the ground truth
  already in the repository (an analyst task).
- Re-score all six SemBench scenarios with partial counts excluded.
- Diff all 36 AIFunc public-gold answer files between Spider 2.0 commit
  `84911f3` and `main` (a script).
