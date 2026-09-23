# Path 2 - The cost of a semantic operator

This path descends from **item 3** of the breadth pass
([`0-breadth.md`](0-breadth.md)), "Snowflake's own researchers say LLM calls
are 80-90% of the cost of an AI query, and academia has adopted `AI_FILTER` as
the thing to optimise". It follows that item's second research-next lead,
SemCEB's ground truth at scale factor 10,000, and folds in its first lead, the
full text of arXiv:2608.27244, as far as any reachable route allowed. It was
produced in **auto-breadth mode** ([`docs/reader/auto-breadth.md`](../../../reader/auto-breadth.md)),
so nothing in it is a profile change. Window: 90 days, so items are dated on
or after **2026-06-25**.

---

## Level 1 - SemCEB and the cost of `AI_FILTER`/`AI_JOIN` as an optimiser problem

**Headline: the cost of an AI function has become an optimiser problem, but no
production engine's optimiser has been measured on it this quarter.** The
research this quarter treats the cost as something the planner decides, and so
does Snowflake's own engine team. But the one benchmark built to score those
estimates has only an open-source backend. It took its ground truth from 1,000
to 10,000 rows in July without re-scoring anything at the new size.
Snowflake's own answer skips the thing the benchmark measures: it learns
selectivity row by row while the query runs, instead of estimating it before
the query starts. The benchmark that *has* scored a production engine
(BigQuery, once, before the window) has published no new results since May.

The question this path asks is whether the cost of an AI function is now a
property of the query optimiser, and whether anyone is measuring how well
optimisers handle it. The answer is **yes to the first and, inside the window,
no to the second**. For Snowflake's `AI_FILTER`/`AI_JOIN` that "no" is a
verified absence on both benchmarks. For BigQuery it means one run from before
the window, not repeated. For Databricks nothing was found at all.

---

### 1. SemCEB's ground truth grew tenfold in July, but no estimator has been scored at the new size and no production engine can be

**1. What it is.** SemCEB is a benchmark for **cardinality estimation over
semantic operators**. Cardinality estimation means predicting how many rows a
filter or join will return before running it. For an `AI_FILTER` that calls an
LLM on every row, that prediction is what lets an optimiser choose a cheap plan
over an expensive one. The benchmark was written by Zimmerer, Kühn, Li, Stoian,
Borovica-Gajic and Kipf in the `utndatasystems` organisation. It has 102
hand-curated queries on Amazon Reviews "Arts, Crafts and Sewing" data: 45,693
products and 936,216 reviews, with text, images and precomputed embeddings.
Each query contains "exactly one semantic predicate and no relational
predicates". The paper was accepted to NOVAS, the 2nd Workshop on Novel
Optimizations for Visionary AI Systems at VLDB 2026, on 2026-07-24.

**What moved in the window:**

- **Pull request #110, merged 2026-07-24**, "Ground-truth selectivities for
  gpt-5.4-nano at sf=10000 for filter queries". In this repository **scale
  factor means rows, not a multiplier**. `config.toml` defines it as "Number of
  rows loaded from the main dataset table for filtering", with a default of
  `scale_factor = 1000` and `join_scale_factor = 100`. So sf=10000 means the
  filter queries' true answers are now labelled over 10,000 rows instead of
  1,000. That is ten times the rows, and so ten times the LLM calls to label
  them.
  - The results folder now holds 62 files at sf10000 (`q0` to `q61`), beside
    the same 62 at sf1000.
  - The ground-truth cache file spans selectivities from 0.0001 to 0.9998.
  - Across the queries, the true cardinality at 10,000 rows runs from 73
    ("Image clearly depicts blue wool") to 9,621 ("Features don't mention
    refills").
- **Pull request #109, open since 2026-07-23 and unmerged two months later**,
  adds a new estimator family, "Unify Importance Sampling". Its class
  docstring calls it "Distance-stratified semantic cardinality estimation".
  It groups rows into bands by embedding distance to the query, samples more
  heavily from the nearer bands, and scales up the positives it finds in each
  band. The configuration adds five sampling fractions (1% to 20%) with
  `num_bins = 4`. The same pull request adds a LiteLLM proxy.
- **Pull request #112, merged 2026-09-17**, changes data loading only. It
  "filter[s] and scal[es] in DuckDB before materializing into pandas", which is
  the kind of change needed to load at larger scale factors.

**What has not moved.** The scored results predate the window.
`results/tables/algorithm_summary.csv` was last changed on **2026-06-21**. It
reports a signed **q-error**, the factor by which an estimate is wrong. The
benchmark code says it returns "a negative q-error for underestimation", and it
clamps both counts to at least 1. The table reads:

| Estimator | Queries answered | Mean q-error | Worst q-error | LLM calls | Cost (USD) |
|---|---|---|---|---|---|
| Sampling, 1% | 102 | −664 | −17,226 | 2,787 | 0.15 |
| Sampling, 5% | 102 | −35.2 | −1,375 | 21,401 | 1.19 |
| Sampling, 10% | 102 | −19.3 | −999 | 61,658 | 3.41 |
| Sampling, 20% | 102 | −16.4 | −999 | 198,721 | 10.84 |
| Semantic Histograms | **31** | −122 | −1,000 | 992 | 0.00 |

Two things in that table answer "how far off are the baseline estimators".

- **Every baseline underestimates on average, by more than an order of
  magnitude.**
  - Even a 20% sample is off by a mean factor of 16. Its worst case is an
    estimate of at most one row against a true 999.
  - A 1% sample is off by a mean factor of 664.
  - Buying accuracy with a bigger sample costs about 70 times the LLM calls,
    from 1% to 20%.
- **The state-of-the-art learned estimator answers only 31 of the 102
  queries.** That is Semantic Histograms, which the repository pulls in as a
  submodule from `DataManagementLab/semantic_histograms`. The code has an
  `UNSUPPORTED` result kind for queries an estimator cannot answer.

The search summary of the paper's abstract says the same thing in words:
sampling "does not scale and comes with high costs", and Semantic Histograms is
"limited in its applicability, and its performance appears sensitive to the
predicate category".

**How much a wrong estimate costs.** The repository's join showcase (June 20)
runs one query under different plans at `join_scale_factor = 100`. The
cheapest plan read cost **$0.125** (549,241 tokens). The most expensive cost
**$2.85** (13.0 million tokens). That is a spread of about 23× in cost, for
the same query and the same answer.

**Has any production engine's estimator been scored on it? No, and as shipped
it could not be.** The repository's only LLM backend is `lotus_backend.py`, for
LOTUS, the Stanford semantic-operator library. There is no backend for
Snowflake, BigQuery or Databricks. Its ground truth is gpt-5.4-nano's verdict
run through LOTUS. So despite the operator names, **no Snowflake `AI_FILTER`
is executed anywhere in SemCEB**.

**Background (out of window).**
- The arXiv posting, 2606.23081, was linked from the repository on
  **2026-06-24**, one day before the window.
- The Semantic Histograms paper, "Selectivity Estimation for Semantic Filters
  on Image Data" (Urban, Nguyen, Sanmartino, Papotti and Binnig, arXiv:2606.04610),
  was posted **2026-06-03**. Its search summary claims an end-to-end runtime
  reduction "up to 86%".

**2. How long ago.**
- **2026-07-24**, 61 days ago, for pull request #110 and the NOVAS acceptance.
- **2026-07-23**, 62 days ago, for #109 being opened.
- **2026-09-17**, 6 days ago, for #112.

**3. How it relates to what has already been read.** This is a direct descent
from breadth item 3, which read SemCEB's README and commit history and could
only name pull request #110. The breadth pass wrote "scale factor 10,000" as
if it were a workload multiplier. It is a row count, and that changes what the
tenfold step means: it is a larger labelled sample, not a warehouse-scale test.

It serves **`analytics-broad`**, in its reading as "the measurement of AI
systems". It also touches **`benchmarks-depth`**, but it is filed under
`analytics-broad` because what it measures is an optimiser's input, not a
model's answers. Both lines have a 90-day window in this mode, so the filing
admits nothing that the other line would exclude.

Nothing under `docs/research/` has covered cardinality estimation before.

**4. What through-line it changes.** It sharpens breadth item 3's new
through-line: "the cost of an AI query is becoming an optimiser property, in
the way that join order is". That is right, and SemCEB adds one step to it.

- **The estimates optimisers would need are currently bad.** A cheap sample
  underestimates by 16× to 664× on average, and the best learned method covers
  under a third of the queries.
- **The only public yardstick is disconnected from every production engine.**
  An estimate off by 16× is what decides whether an `AI_FILTER` runs before or
  after a join. The showcase puts that choice at 23× in cost.

**5. What to research next.**
- **SemCEB's estimators re-scored at scale factor 10,000.** Does any result
  file, table or plot at sf10000 land in `utndatasystems/SemCEB` after pull
  request #110, and does the NOVAS camera-ready report sampling's q-error and
  dollar cost at 10,000 rows rather than 1,000? The concrete question is
  whether 1% sampling's mean −664 improves with ten times the rows or only
  gets ten times dearer.
- **Pull request #109, "Unify Importance Sampling".** Does it merge, and what
  q-error and LLM-call count does distance-stratified sampling get against
  plain 1-20% sampling on the same 102 queries? Also confirm whether it
  implements the importance sampling of Tsinghua's Unify system (Wang and Li)
  or only borrows the name. The code cites no paper.

**6. Source.** From open search. `github.com` is on `sources.md` for other
lines, but this repository is not.
- **Full page read:**
  - [`README.md`](https://raw.githubusercontent.com/utndatasystems/SemCEB/main/README.md)
    and [`config.toml`](https://raw.githubusercontent.com/utndatasystems/SemCEB/main/config.toml).
  - [Pull request #110](https://github.com/utndatasystems/SemCEB/pull/110),
    [pull request #109](https://github.com/utndatasystems/SemCEB/pull/109) with
    [its diff](https://github.com/utndatasystems/SemCEB/pull/109/files) and the
    [new estimator file on its branch](https://raw.githubusercontent.com/utndatasystems/SemCEB/ckuehn/unify-importance-sampling/src/semceb/algorithms/unify_importance_sampling.py),
    and [pull request #112](https://github.com/utndatasystems/SemCEB/pull/112).
  - [`algorithm_summary.csv`](https://raw.githubusercontent.com/utndatasystems/SemCEB/main/results/tables/algorithm_summary.csv),
    [`data_skew_summary.csv`](https://raw.githubusercontent.com/utndatasystems/SemCEB/main/results/tables/data_skew_summary.csv)
    and [`query_categoriy_counts.csv`](https://raw.githubusercontent.com/utndatasystems/SemCEB/main/results/tables/query_categoriy_counts.csv).
  - [`benchmark.py`](https://raw.githubusercontent.com/utndatasystems/SemCEB/main/src/semceb/benchmark/benchmark.py),
    for the q-error definition.
  - The [commit history](https://github.com/utndatasystems/SemCEB/commits/main),
    and the per-path histories for `results/raw` and `algorithm_summary.csv`.
  - The directory listings for `results/`, `benchmark_queries/`,
    `src/semceb/algorithms/` and `src/semceb/llm_backends/`, and `.gitmodules`.
- **Read through a fetch tool that summarises long files, so possibly
  incomplete:**
  - The [sf10000 ground-truth cache](https://raw.githubusercontent.com/utndatasystems/SemCEB/main/benchmark_queries/ground_truth_cache_gpt-5.4-nano_sf10000.json).
    It came back with 61 entries against 62 result files.
  - The [showcase results](https://raw.githubusercontent.com/utndatasystems/SemCEB/main/results/raw/showcase/showcase_results.jsonl).
    It came back with 18 plans, where its metadata says 96 were executed.
- **Search summary only:** the paper's findings sentence and the
  Semantic Histograms paper, both via [arXiv:2606.23081](https://arxiv.org/abs/2606.23081)
  and [arXiv:2606.04610](https://arxiv.org/abs/2606.04610). `arxiv.org`
  refused this run. The NOVAS paper could not be read by any other route.

**7. Verified / inferred / assumed.**
- **Verified:**
  - Pull request #110's title, dates and author, and #109's open status,
    commits, configuration and docstring. Also #112's date and description.
  - The row-count definition of scale factor.
  - The 62 sf10000 result files.
  - Every figure in the q-error table, and the sign convention and clamping.
  - The 31-query coverage of Semantic Histograms and the `UNSUPPORTED` result
    kind.
  - That LOTUS is the only backend.
  - That the scored table was last changed on 2026-06-21.
- **Inferred:**
  - That the table was computed at 1,000 rows. It reads `results/raw/result.jsonl`,
    which does not record its scale factor, and 1,000 is the configuration
    default.
  - That no sf10000 scores exist. The file names in `results/raw` and the
    table's last-change date say so, but no document states it.
  - The 23× showcase spread. It rests on a read that may have been truncated,
    so the true spread across all 96 plans could be wider but not narrower.
- **Search summary only, filed as inferred:** the paper's findings sentence,
  and Semantic Histograms' "up to 86%".
- **Assumed:** that the 102-query total includes join queries without
  sf10000 ground truth, which would explain 62 labelled filter queries. No
  per-type count could be read.

---

### 2. Snowflake's engine team answered the same question by not estimating in advance at all

**1. What it is.** "Compositional Online Learning for Semantic Data Processing
Systems", arXiv:2608.27244. According to search summaries, its authors are
Paweł Liskowski, Fuheng Zhao, Benjamin Han, Anupam Datta and Dimitris
Tsirogiannis of **Snowflake Inc.**

The paper puts learners at the point where each LLM call is made, "the LLM
call boundary". The argument is that an LLM call is slow enough that a
CPU-side model can update itself inside the call's round trip. It composes
three components inside Cortex AISQL:

- **A response cache**, which memoises exact repeated calls. It does no
  learning, and serves as the baseline.
- **Larch, for filter ordering.** It "refits a per-predicate selectivity model
  on every LLM outcome" and chooses the next predicate to evaluate for each
  row.
- **GAMCAL, for cascade routing.** It "refits a calibrated GAM on a doubling
  schedule" (a GAM is a generalised additive model) and routes each row
  either to a cheap proxy model or to the large oracle model, deciding per
  batch.

The paper's headline figures, all from search summaries:

- **Motivation:** "LLM compute accounts for 80-90% of query cost in
  production", and each call costs "10^5-10^7×" a relational predicate.
- **Result:** an **analytical** case study on a five-predicate conjunction
  filter. It computes an **11.4×** cost reduction if the components are
  independent, and **"roughly 8×"** after three interactions between them.

That is the answer to this path's question from inside Snowflake. **The
selectivity estimate that SemCEB benchmarks as an up-front prediction is,
in Snowflake's design, a model that refits on every row's LLM outcome while the
query runs.**

**The critic, found by looking for one.** The one critique found is a Pith
review of the paper, read only as a search summary. It makes two points:

- "If the quantitative claims could be validated with proper bounds or
  end-to-end measurements, the work would provide a useful design template."
  So the 11.4× and 8× are computed, not measured end to end.
- The paper flags, but does not analyse, carrying learned state across
  queries. It leaves open "which bounded-staleness rule keeps a per-template
  warm-start cache sound under prompt and data drift".

**Background (out of window).**
- **Larch** (arXiv:2606.07923, **2026-06-06**) is the standalone paper for the
  ordering component. Its search summary claims a 3× to 19× reduction in
  token-cost overhead against Palimpzest and Quest. Its selectivity model is
  "a two-layer MLP with roughly 144K trainable parameters".
- **Streaming Model Cascades for Semantic SQL** (arXiv:2604.00660, April 2026)
  appears to be the source of the GAMCAL figures that search engines attach
  to this paper: F1 above 0.95 on six benchmarks, and up to 58% fewer oracle
  calls than LOTUS's cascade. They are **not** attributed to the August paper
  here.
- Snowflake's **2025-09-23 "AI_FILTER Performance Optimization (Preview)"**
  note claims "2-10x speedup" and "up to 60%" fewer tokens. It says the
  optimisation is applied when the engine "detects a suitable pattern", without
  a guarantee. Two engineering-blog posts continue that line: streaming
  cascades on **2026-05-29**, and query optimisation on **2026-06-16**, both
  dated by search summary. All three are outside the window.

**2. How long ago.** **2026-08-27**, 27 days ago, as the breadth pass recorded
it. The date comes from a search summary, and the abstract page was not
reachable to confirm the submission-history line.

**3. How it relates to what has already been read.**
- This is the paper behind breadth items 2 and 3's "80-90%" figure. This run
  got no closer to its text than the breadth pass did: every reachable route
  was tried and refused.
- What it adds beyond the breadth pass is from summaries of the body rather
  than the abstract: the author list with affiliation, the three components,
  the 11.4× and 8× figures and their analytical status, and a named critic.
- It serves **`warehouse-agentic`**, because it describes Snowflake's own
  shipping engine. It also bears on `analytics-broad`. Both lines have a
  90-day window in this mode.

**4. What through-line it changes.** It splits the breadth pass's "cost is an
optimiser property" into **two different architectures**.

- **The academic line** (SemCEB, Semantic Histograms, and Tsinghua's
  SIGMOD 2026 work on semantic cardinality estimation) treats the cost as a
  **plan-time estimate**. That estimate can be benchmarked, and today it is
  poor (item 1).
- **Snowflake's line** treats the cost as **runtime learning**. There is no
  up-front number to score, so SemCEB's two-phase protocol does not fit it:
  a setup phase, then one estimate per predicate before execution.

Snowflake's own headline gain is analytical. So **nobody outside Snowflake can
check how well its engine handles the cost, and Snowflake has not published a
measurement that would let them.**

**5. What to research next.**
- **Where the "80-90% of query cost" figure comes from, in the full text of
  arXiv:2608.27244** (`arxiv.org/html/2608.27244`). Which customer workloads
  and period, and does "query cost" include warehouse compute credits or only
  AI Credits? This needs a run whose egress reaches `arxiv.org`. Every other
  route (author pages, a code repository, review sites) was tried here and
  refused or does not exist.
- **Whether Larch-style per-row ordering and GAMCAL-style routing are what
  Snowflake's "AI_FILTER Performance Optimization" does today.** Has the
  2025-09-23 preview reached GA in any release note since 2026-06-25, and does
  the `AI_FILTER` reference page describe per-row adaptive ordering or say
  only that the optimisation "may" apply?

**6. Source.** From open search. `arxiv.org`, `docs.snowflake.com` and
`snowflake.com` are all on `sources.md`, and all three **refused this run**.
- [arXiv:2608.27244](https://arxiv.org/abs/2608.27244) (also
  [HTML](https://arxiv.org/html/2608.27244)): **search summary only**, from
  four differently worded searches.
- The [Pith review](https://pith.science/paper/2608.27244): **search summary
  only**. The host refused this run.
- [Larch, arXiv:2606.07923](https://arxiv.org/abs/2606.07923),
  [Streaming Model Cascades, arXiv:2604.00660](https://arxiv.org/abs/2604.00660),
  the [2025-09-23 release note](https://docs.snowflake.com/en/release-notes/2025/other/2025-09-23-ai-filter-optimization)
  and the [2026-05-29 engineering blog](https://www.snowflake.com/en/blog/engineering/optimize-enterprise-llm-queries/):
  **search summary only**, used as background.

**7. Verified / inferred / assumed.**
- **Verified:** nothing in this item was read in full. It is kept as an item
  rather than dropped for two reasons: it is the only in-window primary source
  from a production vendor on this question, and item 1's verified absence
  only makes sense beside it.
- **Search summary only, filed as inferred:**
  - The authors, their affiliation and the date.
  - The three components and their descriptions.
  - The 80-90%, 10^5-10^7×, 11.4× and "roughly 8×" figures, and the
    analytical status of the last two.
  - The Pith critique.
  - Every background figure.
- **Inferred:**
  - That SemCEB's protocol cannot score an online learner. This is reasoned
    from SemCEB's two-phase design (verified in item 1) against the paper's
    per-call refitting (summary only). Neither document says it.
  - That GAMCAL's F1 and oracle-call figures come from the April paper, not
    the August one. Search engines attach them to both.
- **Assumed:** that the paper describes components running in the production
  engine rather than in a research fork of it. "All experiments run on
  Snowflake's Cortex AISQL" is summary wording, and whether the learners ship
  to customers is exactly the second lead.

---

### 3. The only harness that has scored a production engine on semantic-operator cost gained adopters this quarter, not results

**1. What it is.** **SemBench** is the benchmark for semantic query
processing engines. It is maintained by Jiale Lao (`SolidLao`); SemCEB's first
author (`andizimmerer`) is also a committer. It was accepted to VLDB 2026. It
measures cost, quality and latency end to end across engines, and is the one
harness found that includes a production warehouse. Its README lists four
systems "evaluated in paper": LOTUS, Palimpzest, ThalamusDB and **Google
BigQuery**.

**What moved in the window was only the "Adopted by" list.** Three commits
add outside systems that report results on SemBench:

- **2026-07-01:** CADENZA (POSTECH and UIUC, SIGMOD 2027).
- **2026-07-02:** BlendSQL (Capital One, arXiv:2606.31808).
- **2026-07-16:** the compilation-based semantic operators paper (University
  of Hawaiʻi at Mānoa, arXiv:2607.13407).

The list now has ten entries. **Snowflake is on it once**, for **Semantic
Rank** (arXiv:2509.00303, with the University of Chicago, UCLA and UCSB), not
for `AI_FILTER` or `AI_JOIN`. **No commit since 2026-05-23 has changed a
result**; the last two re-ran LOTUS and Palimpzest on one query. No Snowflake
or Databricks system has been added as an evaluated system.

**Background (out of window).** From the search summary of the SemBench paper
(arXiv:2511.01716, revised March 2026): among the systems that support all
queries, BigQuery "achieved optimal performance according to all metrics".
BigQuery was the one system to reach the largest scale on e-commerce Q8, at
"about $140". And on three queries, cost "varied by more than a factor of 100×
across different systems".

**2. How long ago.** **2026-07-16**, 69 days ago, for the latest in-window
commit. The others are **2026-07-01** (84 days) and **2026-07-02** (83 days).
The results have been unchanged since **2026-05-23**, which is outside the
window.

**3. How it relates to what has already been read.** It is new to
`docs/research/`. It serves **`analytics-broad`**, as the measurement of AI
systems. It answers the second half of this path's question from the other
side:
- Item 1 found that the estimation benchmark cannot score a production engine.
- This item finds that the end-to-end benchmark *has* scored one, BigQuery,
  and has not run it again this quarter.

Breadth item 4 found that no vendor attached an accuracy number to its AI
functions. SemBench is the one place a third party did attach a cost number to
one.

**4. What through-line it changes.** It adds a qualification to the breadth
pass's through-line. **Semantic-operator optimisation is being measured on a
shared harness, and the field is converging on it.** Ten research systems
report on SemBench, including one from a bank (Capital One) and one from
Snowflake.

But the harness measures **research optimisers against each other**. The
production engines that set the actual bill are either missing (Snowflake's
`AI_FILTER`, Databricks' `ai_query`) or frozen at one run (BigQuery). The 100×
cost spread between systems is the size of the stakes, and it has not been
re-measured since spring.

**5. What to research next.**
- **Whether SemBench's BigQuery runner uses BigQuery's "optimized mode" for
  `AI.IF` and `AI.CLASSIFY`.** Check the BigQuery runner under
  `SemBench/SemBench`'s `src/runner/`. If it calls row by row, BigQuery's
  published cost on SemBench is not the cost of Google's optimiser, and the
  230× token reduction Google claims for optimized mode has never been
  independently measured.
- **Whether anyone has written a Snowflake `AI_FILTER`/`AI_JOIN` runner for
  SemBench.** Check `SemBench/SemBench`'s forks, open and closed pull
  requests, and its issue tracker for a `GenericRunner` subclass targeting
  Cortex AI Functions or Databricks `ai_query`. The README invites one ("reach
  out to discuss how to contribute your results"). Its absence would mean
  Snowflake's optimiser has never been scored on a shared harness.

**6. Source.** From open search. `github.com` is on `sources.md` for other
lines, but this repository is not.
- [`SemBench/SemBench` README](https://raw.githubusercontent.com/SemBench/SemBench/main/README.md):
  **full page read**, twice, the second time for the Adopted by table
  verbatim.
- [Commit history](https://github.com/SemBench/SemBench/commits/main):
  **full page read**, January to July 2026.
- The paper's BigQuery figures, via [arXiv:2511.01716](https://arxiv.org/abs/2511.01716):
  **search summary only**, used as background.
- The online leaderboard at `sembench.org` and the UTN blog post on SemBench
  at `utndatasystems.github.io` both **refused this run**.

**7. Verified / inferred / assumed.**
- **Verified:**
  - The four evaluated systems.
  - The ten-entry Adopted by table, with operators, institutions and
    references, including Snowflake's Semantic Rank entry.
  - The three in-window commit dates and their messages.
  - That no result-changing commit came after 2026-05-23.
  - That the SemCEB first author is a committer.
- **Search summary only, filed as inferred:** BigQuery's "optimal" standing,
  the "about $140" figure and the 100× spread.
- **Inferred:** that the leaderboard holds no Snowflake or Databricks entry.
  The README and commits show none, but the leaderboard itself could not be
  read.
- **Assumed:** that "Adopted by" means each paper reports SemBench numbers, not
  merely that it cites SemBench. The README's heading says the systems
  "independently adopted" it, and no entry was opened to check.

---

### What was dropped and why

- **Kalypso** (arXiv:2607.23815, July 2026), a system that reuses the LLM's
  cached state (its KV cache) across semantic operators. It is in the window,
  but it lowers the cost of each call rather than estimating how many calls a
  plan will make. It is also search-summary only, and the breadth pass already
  carries it.
- **Compilation-based execution** (arXiv:2607.13407 from July, and its
  engine follow-up arXiv:2608.06677 from August). This is the option nobody
  asked for. It asks the LLM once to write deterministic code for the
  predicate, so no per-row call is left to estimate. It is in the window, but
  it is search-summary only, is not tied to any warehouse's functions, and
  claims only "preliminary" results. It appears in item 3 as a SemBench
  adopter.
- **Tsinghua's "Bridging the Gap: Cardinality Estimation for Semantic Queries
  on Unstructured Data"** (Xu et al., PACMMOD/SIGMOD 2026). This is the other
  academic estimator, and the likely namesake of SemCEB's pull request #109.
  It is outside the window (May 2026), and `dbgroup.cs.tsinghua.edu.cn`
  refused this run.
- **The Semantic Histograms paper** (arXiv:2606.04610, 2026-06-03), outside
  the window. Used as background in item 1.
- **PLOP** (arXiv:2604.09944), **iPDB** (arXiv:2601.16432) and **Cost-Aware
  Optimization for Agentic Query Execution** (arXiv:2606.03152). All are
  cost-based placement of semantic operators, and all are outside the window.
- **Snowflake's 2025-09-23 `AI_FILTER` optimisation preview and its May and
  June 2026 engineering blogs.** All are outside the window, and the host
  refused. Used as background in item 2.
- **Databricks.** Searches for an optimiser or cost model behind `ai_query`
  and `ai_classify` found only a product post on shortlisting labels by
  embedding before classifying, and the host refused. Nothing was found that
  describes plan-time handling of the function's cost.

### What was searched for and not found

- **Any SemCEB result at 10,000 rows for any estimator.** None. `results/raw`
  holds scored files at sf10, sf20, a sf1000 simple-predicate variant and the
  default. The scored tables have not changed since 2026-06-21.
- **A SemCEB backend for Snowflake, BigQuery or Databricks.** None: the only
  file in `llm_backends/` is `lotus_backend.py`. There is no issue or pull
  request asking for one. The repository has one open issue (#81, a parquet
  reading error) and two open pull requests (#102 and #109).
- **Any production engine's estimator scored on SemCEB, by anyone.** Not in
  the repository and not in three differently worded searches.
- **A readable copy of the SemCEB NOVAS paper.** `arxiv.org`, the first
  author's page (`andi-zimmerer.com`), OpenReview's NOVAS group and the UTN
  blog all refused this run.
- **A readable copy of arXiv:2608.27244.** There is no code repository: a
  search of `Snowflake-Labs` for Larch, cascades or online learning found
  tutorials only. `pith.science` refused. Author profiles exist only on a
  third-party arXiv reader, which this run did not use to route around the
  refusal.
- **A GitHub repository for Larch or GAMCAL.** None, which confirms the
  breadth pass's search for Larch.
- **A critic of SemCEB.** None found. The only commentary is the paper's own
  findings sentence, and a source with no critic has been found, not checked.
- **New SemBench results, or a Snowflake or Databricks runner, since
  2026-05-23.** None in the README or the commit history.
