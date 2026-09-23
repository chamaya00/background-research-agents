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

---

## Level 2 - Whether any benchmark measures a production warehouse's AI functions

**Headline: every number on what a production warehouse's AI function costs
and how accurate it is was still produced by the vendor. The one partial
exception, SemBench's BigQuery column, was co-written with Google's BigQuery
team. Its cost is list-price arithmetic, not a bill, and its own data shows
the arithmetic losing tokens.**

- **Nobody has built a second engine into SemBench.** No Snowflake or
  Databricks runner exists anywhere this run could reach: SemBench itself, the
  six forks pushed this quarter, its 15 pull requests, its 12 issues, or the
  code of the one adopter this quarter that published a runner (item 1).
- **What the BigQuery number measures.** It is Gemini 2.5 Flash tokens,
  collected from a log table and multiplied by a price table written into the
  runner. The runner never reads what BigQuery billed for the query. For the
  same query at the same output size, the recorded usage runs from 8.9
  million tokens down to **zero** (item 1, Background).
- **The quarter's one number on both cost and accuracy is a vendor's.**
  Databricks published it on 2026-07-20 for `ai_classify`: 0.81 accuracy
  against Gemini's 0.76, at about a hundredth of the cost. It was measured by
  Databricks on datasets no summary names (item 2).
- **Adopters leave the warehouse out.** When someone outside SemBench's authors
  ran SemBench this quarter, they ran the academic systems and left BigQuery
  out (item 3).

**What this level asked, and the answer.** Is there any independent,
reproducible measurement of what a production warehouse's AI function costs and
how accurate it is? **No.**

- **BigQuery** has one reproducible measurement. It is not independent, and it
  is not a measurement of the bill.
- **Snowflake and Databricks** have none. Their only numbers are the vendors'
  own. In this window those are Snowflake's analytical 11.4× (Level 1, item 2)
  and Databricks' 0.81.

---

### 1. SemBench this quarter: six forks, one pull request, three adopters, and no second production engine

**1. What it is.** A check of every place a Snowflake (`AI_FILTER`,
`AI_CLASSIFY`, `AI_AGG`) or Databricks (`ai_query`, `ai_classify`) runner for
SemBench could exist, and what was found in each. **None was found.**

- **Upstream.** `src/runner/` holds six runners: BigQuery, CAESURA, FlockMTL,
  LOTUS, Palimpzest and ThalamusDB. The only per-system configuration folders
  are for Palimpzest and ThalamusDB.
- **Forks.** The repository shows 24 forks, and GitHub lists 15 of them as
  having push activity. Six of those were pushed inside the window:
  - `cezary17`, 2026-07-15.
  - `AymaneHassini`, 2026-07-26.
  - `UviniR`, 2026-08-10.
  - `Joy1Ren`, 2026-08-23.
  - `ABCbum`, 2026-09-03.
  - `SleepyLGod/SemBench-IVM`, 2026-09-14. Its tagline is "IVM Scenarios
    Added", but its main branch has no commit past upstream's 2026-07-16.

  Of these, five main branches were opened (all but `ABCbum`'s) and each has
  the same six runner folders as upstream. The one fork with six open pull
  requests, `DamonZhao-sfu`, was last pushed 2026-06-07 and has the same six
  runner folders.
- **Pull requests.** There are 15, and none adds a runner for a new engine. The
  only one inside the window is **#29**, opened 2026-09-03 by `ABCbum` and
  still unmerged. It forwards `skip_setup` in seven scenario runners for LOTUS,
  Palimpzest and ThalamusDB, and does not touch BigQuery.
- **Issues.** There are 12, and none asks for Snowflake, Databricks or any
  other warehouse.

**Background (out of window): what SemBench's BigQuery number measures.** Read
from the runner and the query files.

- **Which functions.** SemBench calls BigQuery's newer AI functions directly,
  not `ML.GENERATE_TEXT`:
  - `AI.IF` for filters and for joins. Movie Q5 to Q7 compare pairs of reviews
    of one film. E-commerce q8 joins every long product description to every
    product image.
  - `AI.CLASSIFY` for e-commerce q6.
  - `AI.SCORE` inside an `ORDER BY` for the ranking query, e-commerce q14.
  - The animals scenario used `IF(AI.GENERATE(...))` until 2025-12-20. The
    maintainer wrote that "the BigQuery version we used before has an error
    when using AI.IF() for audio modality".

  **No query asks for optimized mode.** Path 3, Level 1, item 3 established
  this from the movie `Q1.sql` and `Q2.sql` and the runner. The three
  e-commerce files read here (q6, q8, q14) are the same: they pass
  `connection_id` and `model_params`, with no `embeddings` argument and no
  `optimization_mode`.
- **Which model.** `model_name: str = "gemini-2.5-flash"`, with
  `thinking_budget: int = 0` passed into each call's `model_params`, and 20
  concurrent workers. Every recorded BigQuery run read here names
  gemini-2.5-flash.
- **How cost is computed. It is not the bill.**
  - **Tokens.** After each query the runner prints "Waiting 5 seconds for
    inference logs to materialize...". It then reads per-model log tables
    (`inference_logs.gemini_2_5_flash` and four others). It pulls Gemini's own
    usage fields out of each logged response:
    `$.usageMetadata.promptTokenCount`, `candidatesTokenCount` and
    `thoughtsTokenCount`.
  - **Price.** It multiplies those tokens by a `MODEL_PRICES` table written
    into the code. For `gemini_2_5_flash` that table reads `0.30 / 1e6` per
    input token, `1.00 / 1e6` per audio input token and `2.50 / 1e6` per
    output token, with thinking tokens charged at the output rate.
  - **Not read.** The runner never reads `total_bytes_billed` or `slot_ms`. So
    whatever BigQuery charged to run the query itself is not in SemBench's
    BigQuery cost.
- **The method loses tokens, and SemBench's own files show it.** Movie Q7 pairs
  every review of one film with every other and asks `AI.IF` whether the two
  disagree. It returns about 36,000 rows at every scale factor, so the model
  work should be about the same each time. The recorded usage is not:

  | Run | Rows returned | Tokens recorded | Cost recorded |
  |---|---|---|---|
  | sf2000 | 35,914 | 8,927,153 | $3.46 |
  | sf8000 | 35,865 | 8,527,116 | $3.31 |
  | sf16000, repeat 1 | 36,236 | 2,684,224 | $1.03 |
  | sf16000 | 35,888 | **0** | **$0.00** |

  The same sf16000 run records **0 tokens and $0.00 for Q6** as well. Q6 is a
  `LIMIT 10` query that cost about $1.01 in the other three runs, and in this
  run it still scored F1 0.9, which it could not have done without calling the
  model. Both entries are marked `"status": "success"`.
- **Who wrote it.** SemBench's citation block lists 15 authors, including Fatma
  Özcan, Gautam Gupta, Thibaud Hottelier and Kris Kissel. Google's own blog
  bylines Hottelier as a Google "Software Engineer". According to a search
  summary, the DEEM Lab announcement calls SemBench "a collaboration between
  Google's BigQuery team and researchers from Cornell, MIT, UTN, UMichigan".
  In December 2025, the GitHub user `thibaudbh` wrote three pull requests
  (#8, #10 and #11) that reshaped the BigQuery queries, for example "Make q5
  and q6 use AI.CLASSIFY in ecomm". They were merged the same day, and #10
  shows "No reviews".
- **The paper's own caveat**, from a search summary only: BigQuery shows
  "relatively high quality variance across different runs" because its
  "model-related parameters ... are controlled internally and are not exposed
  to users".

**2. How long ago.**

- **2026-09-14**, 9 days ago, for the latest fork push. **2026-09-03**, 20
  days ago, for pull request #29.
- The other in-window forks were pushed 2026-07-15 (70 days), 2026-07-26 (59
  days), 2026-08-10 (44 days) and 2026-08-23 (31 days).
- The runner itself was last changed **2025-11-20**, and the BigQuery query
  rewrites date from **2025-12-20**. Both are Background.

**3. How it relates to what has already been read.** It directly answers
Level 1, item 3's two leads, and it **converges with path 3, Level 1, item 3**
on the same primary source: the BigQuery runner and query files. The two paths
agree that optimized mode is off.

It also adds two things that path 3 does not have. The first is what the cost
column counts. The second is who wrote the benchmark. Path 3 attributes
SemBench to "the `utndatasystems` group". Its citation block and the DEEM Lab
announcement put Google's BigQuery team among its authors.

It serves **`analytics-broad`**, in its reading as the measurement of AI
systems, and touches **`warehouse-agentic`**. Both have a 90-day window in
this mode.

**4. What through-line it changes.** Level 1 said the benchmark that "*has*
scored a production engine" had not re-run it. This item changes what that
score is.

- **It is not independent.** It is vendor co-authored, and the vendor's engineer
  wrote the queries' current form.
- **Its cost column is not a bill.** It prices tokens from a list and leaves
  out BigQuery's own charges.
- **Its token capture is unreliable at the largest runs.**

So #19's pattern, "vendor-run on undisclosed question sets", now has a
function-level cousin. The question sets are public, but the vendor
co-authored the run and the cost is not audited.

**5. What to research next.**

- **Which Q7 and Q6 figures reach the paper.** Which of the four recorded Q7
  runs (0, 2.68 million, 8.53 million or 8.93 million tokens) feed SemBench's
  published scale-factor figure? And do `across_system_2.5flash_sf16000_repeat2`
  to `repeat5` (`bigquery.json`) show the same undercount? That would settle
  whether the five-second log wait undercounts BigQuery systematically at
  large runs, or failed once.
- **Whether the price table matches the bill.** Does SemBench's `MODEL_PRICES`
  entry for gemini-2.5-flash match what Google bills for an `AI.IF` call made
  through a BigQuery connection? And how large are the on-demand bytes or slot
  charges for movie Q7 and e-commerce q8, which the runner never reads, next to
  the token cost? This needs Google's pricing pages read without truncation.

**6. Source.** From open search. `github.com` is on `sources.md` for other
lines, but this repository is not.

- **Full page read:**
  - [`generic_bigquery_runner.py`](https://raw.githubusercontent.com/SemBench/SemBench/main/src/runner/generic_bigquery_runner/generic_bigquery_runner.py),
    read four times for verbatim code, and
    [its history](https://github.com/SemBench/SemBench/commits/main/src/runner/generic_bigquery_runner).
  - The query files
    [movie Q5](https://raw.githubusercontent.com/SemBench/SemBench/main/files/movie/query/bigquery/Q5.sql),
    [Q6](https://raw.githubusercontent.com/SemBench/SemBench/main/files/movie/query/bigquery/Q6.sql)
    and [Q7](https://raw.githubusercontent.com/SemBench/SemBench/main/files/movie/query/bigquery/Q7.sql),
    and e-commerce [q6](https://raw.githubusercontent.com/SemBench/SemBench/main/files/ecomm/queries/dialects/bigquery/q6.sql),
    [q8](https://raw.githubusercontent.com/SemBench/SemBench/main/files/ecomm/queries/dialects/bigquery/q8.sql)
    and [q14](https://raw.githubusercontent.com/SemBench/SemBench/main/files/ecomm/queries/dialects/bigquery/q14.sql).
  - The BigQuery metrics files at
    [sf2000](https://raw.githubusercontent.com/SemBench/SemBench/main/files/movie/metrics/across_system_2.5flash_sf2000/bigquery.json),
    [sf8000](https://raw.githubusercontent.com/SemBench/SemBench/main/files/movie/metrics/across_system_2.5flash_sf8000/bigquery.json),
    [sf16000](https://raw.githubusercontent.com/SemBench/SemBench/main/files/movie/metrics/across_system_2.5flash_sf16000/bigquery.json)
    (its Q6 and Q7 entries were read a second time, character for character)
    and [sf16000 repeat 1](https://raw.githubusercontent.com/SemBench/SemBench/main/files/movie/metrics/across_system_2.5flash_sf16000_repeat1/bigquery.json).
  - The [README](https://raw.githubusercontent.com/SemBench/SemBench/main/README.md),
    for the citation block.
  - The [pull request list](https://github.com/SemBench/SemBench/pulls?q=is%3Apr),
    [#10](https://github.com/SemBench/SemBench/pull/10),
    [#11](https://github.com/SemBench/SemBench/pull/11) and
    [#29](https://github.com/SemBench/SemBench/pull/29), and the
    [issue list](https://github.com/SemBench/SemBench/issues?q=is%3Aissue).
  - The [forks page](https://github.com/SemBench/SemBench/forks), and the
    `src/runner` listings of five in-window forks and of `DamonZhao-sfu`.
  - Google's [2026-05-13 blog byline](https://cloud.google.com/blog/products/data-analytics/more-than-100x-faster-and-cheaper-llm-powered-sql-queries-with-proxy-models),
    for Hottelier's affiliation.
- **Read through a fetch tool that summarises long files, so possibly
  incomplete:** the default-scale
  [`bigquery.json`](https://raw.githubusercontent.com/SemBench/SemBench/main/files/movie/metrics/bigquery.json)
  came back with 2 of 10 queries, and was not used.
- **Search summary only:**
  - The [DEEM Lab announcement](https://deem.berlin/post/2026-03-15-sembench/).
    The host refused.
  - The paper's variance caveat, via [arXiv:2511.01716](https://arxiv.org/abs/2511.01716).
    `arxiv.org` refused.

**7. Verified / inferred / assumed.**

- **Verified:**
  - The six upstream runners, and the same six on each fork main branch
    opened.
  - The fork push dates, pull request #29's scope, and that no pull request or
    issue asks for Snowflake or Databricks.
  - The functions each query file calls, and that none of them sets a mode.
  - The default model and thinking budget.
  - The log-table source, the price table, and that bytes and slots are never
    read.
  - Every figure in the Q7 table, and the sf16000 Q6 entry.
  - The author list, Hottelier's Google byline, and `thibaudbh`'s three pull
    requests with their merge dates.
- **Inferred:**
  - That the Q7 and Q6 zeros and the 2.68 million figure are log-capture
    undercounts rather than real savings. This rests on near-identical row
    counts across runs, and on a Q6 F1 of 0.9 recorded at zero tokens. An
    engine-side cache is the alternative explanation, and nothing read rules
    it out.
  - That the per-query label (`"query_uuid"`) is what the aggregation filters
    the log tables on. The label is in every query, but the filter clause was
    not in what came back.
  - That `thibaudbh` is Thibaud Hottelier. The name matches, and SemBench is
    that account's only repository, but the profile states no name.
  - That the runner's prices equal Google's list prices. Google's pricing pages
    came back truncated.
- **Search summary only, filed as inferred:** the "Google's BigQuery team"
  wording, the four authors' Google affiliation other than Hottelier's, and
  the paper's variance caveat.
- **Assumed:** that no Snowflake or Databricks runner sits on a non-default
  branch of any fork. Only main branches were read, and nine inactive forks
  were not opened, on the reasoning that a fork with no pushes cannot hold new
  code.

---

### 2. The quarter's one cost-and-accuracy figure for a production AI function is Databricks' own: `ai_classify` behind vector search

**1. What it is.** "Scaling document classification to 100k+ labels", a
Databricks blog post dated **2026-07-20** according to search summaries. It
benchmarks three ways to classify documents into taxonomies of 35,000 to
100,000 labels:

- pure vector search with Qwen3-Embedding-8B and hybrid BM25 scoring;
- vector search that shortlists the **top 20 labels**, then `ai_classify`
  choosing from that shortlist;
- direct calls to frontier models.

**The headline:** the shortlist-then-`ai_classify` workflow "achieves 0.81
average accuracy across three datasets", against **0.76 for Gemini 3.5
Flash**, the best direct frontier model, "at roughly 1/100th the per-document
cost". One summary says "token cost" rather than per-document cost. The three
datasets, the labels' provenance and the dollar figures are not in any summary
read.

**This is the only in-window figure found that states both the cost and the
accuracy of a production warehouse's AI function against an alternative.** It
was run by the vendor, and nothing was found that reproduces it.

**2. How long ago.** **2026-07-20**, 65 days ago, from search summaries.

**3. How it relates to what has already been read.**

- **Level 1 dropped this post.** Its Databricks line calls it "a product post
  on shortlisting labels by embedding before classifying", and dropped it
  because it says nothing about plan-time cost. For this level's question,
  whether any production number is independent, it is the Databricks data
  point.
- **It qualifies path 3, Level 1, item 3.** That item says "In the window, the
  only per-function accuracy number any of the three vendors published was
  Databricks' **94.7%**", for `ai_extract` precision mode on 2026-08-18. This
  post came four weeks earlier, and is for a configuration sold as *cheaper*
  than calling a model directly. The comparison is a workflow against another
  vendor's model, not against a cheaper mode of `ai_classify` itself. So it
  complicates path 3's through-line ("accuracy is disclosed when it sells an
  upgrade") without overturning it.

It serves **`analytics-broad`** (the measurement reading) and
**`warehouse-agentic`**.

**4. What through-line it changes.** It confirms #19's "vendor-run on
undisclosed question sets" at the function level, for a third vendor. It also
shows the one way a vendor publishes cost and accuracy together: as a
comparison against *another vendor's model called directly*, never against its
own function's cheaper or dearer setting.

**5. What to research next.**

- **The three datasets behind 0.81 against 0.76.** Are they named and public,
  who labelled them, and what are the per-document dollar figures for each of
  the three approaches? This needs the post itself, on `www.databricks.com`,
  which refused this run.
- **Whether an outsider could recompute "1/100th the per-document cost".** Do
  the `ai_classify` reference page or the July 2026 release notes state the
  model behind `ai_classify` and a price per call or per token?

**6. Source.** From open search. Neither host is on `sources.md`.

- [Databricks blog, "Scaling document classification to 100k+ labels"](https://www.databricks.com/blog/scaling-document-classification-100k-labels):
  **search summary only**, from three differently worded searches.
  `www.databricks.com` refused.
- The [StartupHub.ai write-up](https://www.startuphub.ai/ai-news/technology/2026/databricks-ai-classify-beats-llms-on-cost):
  **search summary only**. It is secondary, and was not fetched.

**7. Verified / inferred / assumed.**

- **Verified:** nothing in this item was read in full. It is kept as an item
  because it is the only in-window cost-and-accuracy figure found for a
  production AI function, and the level's question is whether such figures
  are all vendor-made.
- **Search summary only, filed as inferred:**
  - The date.
  - The three approaches, the top-20 shortlist and the embedding model.
  - The 0.81, 0.76 and "1/100th" figures.
  - The 35,000 to 100,000 label range.
- **Inferred:** that the post names no public datasets. The summaries do not
  name them, and that is not the same as the post not naming them.
- **Assumed:** that "AI Classify" in the post is the `ai_classify` SQL
  function, not a separate product surface. Summaries use both spellings.

---

### 3. When someone other than SemBench's authors ran it this quarter, BigQuery dropped out

**1. What it is.** **BlendSQL v0.1.0**, "Large Databases Need Small,
Open-Weight Language Models", by Parker Glenn of Capital One
(arXiv:2606.31808). It was accepted to the AI for Databases workshop at VLDB
2026 and added to SemBench's Adopted by list on 2026-07-02.

According to the search summary of its abstract, it reaches "a win-or-tie rate
of 57% against closed-source alternatives at 390× lower cost and 3.8× lower
latency on the SemBench benchmark", with quantized open-weight models on a
single 16 GB GPU. The same summary says that proprietary-API systems "can incur
costs exceeding $10,000 for a single set of experiments".

**What its code shows.** BlendSQL's own SemBench harness,
`research/movies_sembench/runner.py`, imports five evaluation functions:
`run_blendsql_eval`, `run_thalamusdb_eval`, `run_flock_eval`, `run_lotus_eval`
and `run_palimpzest_eval`. **There is no BigQuery evaluation.**

Its plotting notebook, of which only the start could be read, loads
`results/2026-01-08/{model_path}/all_results_with_runs.csv`. It filters
Palimpzest out and prints "Total thalamusdb + lotus costs: 8.77". So the
"closed-source alternatives" are closed models (Gemini, GPT) called through
the academic systems, **not a warehouse's AI function**.

SemBench's other two in-window adopters, CADENZA and the compilation-based
operators paper, were read only as search summaries. Neither summary mentions
BigQuery.

**2. How long ago.** **2026-07-02**, 83 days ago, for the Adopted by entry.
The arXiv identifier dates the paper to late June 2026: it is numbered above
SemJoin (arXiv:2606.29532), which was submitted 2026-06-28. The runs its
notebook reads are dated 2026-01-08, which is Background.

**3. How it relates to what has already been read.** It is the forward edge of
item 1: what happened when an outsider picked SemBench up. Level 1, item 3
listed BlendSQL as one of three in-window adopters, and assumed that "Adopted
by" means each one reports SemBench numbers. For BlendSQL that is now
**verified in code**, with the warehouse left out. It serves
**`analytics-broad`**.

**4. What through-line it changes.** It adds a mechanism to Level 1's
"production engines ... frozen at one run". **Only the vendor re-runs the
vendor's engine.** An outside group can re-run LOTUS on its own API key, but
re-running BigQuery means paying for BigQuery and trusting the log-table cost
method (item 1). None of the three in-window adopters' readable material shows
one doing so. The public harness therefore compares research systems with each
other, and quotes the warehouse only from its co-authored first run.

**5. What to research next.**

- **Which systems count as the "closed-source alternatives".** Which SemBench
  systems and models make up the 57% win-or-tie and the 390× in BlendSQL's
  results table? Does any BigQuery figure from SemBench's published metrics
  enter the comparison? This needs `arxiv.org/html/2606.31808`.
- **Whether LOTUS and ThalamusDB were re-run or copied.** In BlendSQL's
  `research/movies_sembench/src/eval_scripts` and its 2026-01-08 results, were
  LOTUS and ThalamusDB run by BlendSQL's author, or copied from SemBench's
  `files/movie/metrics`? And do their costs match SemBench's for the same
  model? That is a test of whether SemBench's token-based costs reproduce
  outside its authors even for the open systems.

**6. Source.** From open search. `github.com` is on `sources.md` for other
lines, but this repository is not.

- **Full page read:** [`research/movies_sembench/runner.py`](https://raw.githubusercontent.com/parkervg/blendsql/main/research/movies_sembench/runner.py),
  [`benchmark-providers.py`](https://raw.githubusercontent.com/parkervg/blendsql/main/research/movies_sembench/benchmark-providers.py),
  the [`research/` listing](https://github.com/parkervg/blendsql/tree/main/research)
  and the [repository README](https://github.com/parkervg/blendsql).
- **Read through a fetch tool that truncated it:**
  [`visualize.ipynb`](https://raw.githubusercontent.com/parkervg/blendsql/main/research/movies_sembench/visualize.ipynb)
  is 624 KB, and the read ended inside embedded image data.
- **Search summary only:** the paper's abstract, via [arXiv:2606.31808](https://arxiv.org/abs/2606.31808),
  and CADENZA and the compilation-based paper. `arxiv.org` refused.

**7. Verified / inferred / assumed.**

- **Verified:**
  - The five imported evaluation functions and the absence of BigQuery from
    the runner.
  - The notebook lines quoted.
  - The 2026-07-02 Adopted by date, from Level 1's commit read.
- **Search summary only, filed as inferred:**
  - The 57%, 390×, 3.8× and "$10,000" figures.
  - The workshop acceptance.
  - That CADENZA and the compilation paper do not use BigQuery.
- **Inferred:**
  - The late-June dating, from identifier order.
  - That "closed-source alternatives" means closed models inside academic
    systems. This rests on the runner, not on the paper's text.
- **Assumed:** that the truncated remainder of the notebook adds no BigQuery
  series. The runner, which was read in full, gives it nothing to plot.

---

### What was dropped and why

- **AtScale, "Inside a Real Benchmark: Measuring the Cost of AI on the
  Warehouse".** By its search summary, it measures LLM-*generated* SQL on
  BigQuery (cost against time, r = 0.16), not AI functions. The host refused.
- **Estuary, "Best Data Warehouse for AI in 2026: 5 Platforms Benchmarked".**
  The host refused, and the summary shows no measured AI-function figure.
- **SemJoin** (arXiv:2606.29532, Purdue, 2026-06-28). It is in the window,
  but it is an academic semantic-join optimiser with no production engine in
  its summary.
- **"Large Language Model-Enhanced Relational Operators: Taxonomy, Benchmark,
  and Analysis"** (arXiv:2603.02537). This is a second benchmark of semantic
  operators, but it is from March 2026, outside the window, and search summary
  only.
- **Snowflake's "Batch Inference Performance: Cross-Platform Comparison"
  blog.** It is vendor-run, and it compares classic ML model inference against
  SageMaker and Spark UDFs, not SQL AI functions.
- **Snowflake's AI Function Studio.** The option nobody asked for: a vendor
  tool that, by its search summary, "benchmarks candidate function
  configurations against representative datasets to measure accuracy". That
  would be a customer measuring on their own data. It is undated in anything
  read, and `docs.snowflake.com` refused. It is a candidate for its own lead,
  not an item.
- **"SemBench: A Universal Semantic Framework for LLM Evaluation"**
  (arXiv:2603.11687). It shares the name, and a search engine attached its
  "single encoder may introduce biases" limitation to this SemBench. It is a
  different benchmark, so it was dropped rather than cited as a critic.
- **The SemBench paper's "about $140" for e-commerce Q8.** This is Level 1
  Background. Item 1 explains how such a figure is computed, but the paper's
  own run could not be read to check it.

### What was searched for and not found

- **A Snowflake or Databricks runner for SemBench.** None was found in:
  - upstream `src/runner/`;
  - the main branch of five of the six forks pushed in the window, and of
    `DamonZhao-sfu` (`ABCbum`'s was not opened, but its one known change is
    pull request #29);
  - SemBench's 15 pull requests and 12 issues;
  - BlendSQL's harness.
- **Any in-window re-run of SemBench's BigQuery queries.** None. The runner
  was last changed 2025-11-20, and Level 1 found no result-changing commit
  after 2026-05-23.
- **An independent measurement of Snowflake `AI_FILTER`/`AI_CLASSIFY` or
  Databricks `ai_query`/`ai_classify` cost and accuracy on public data.** Six
  differently worded searches found none. They were phrased as benchmark,
  practitioner "million rows" experiment, GitHub repository, and cross-vendor
  comparison. They returned only pricing guides, vendor posts and feature
  comparisons.
- **A critic of SemBench's BigQuery cost method.** None. The only caveat found
  is the paper's own, about variance, and it concerns quality rather than
  cost. A method with no critic has been found, not checked.
- **Google's list price for Gemini 2.5 Flash, to check the runner's table.**
  Both `cloud.google.com/vertex-ai/generative-ai/pricing` and
  `cloud.google.com/bigquery/pricing` came back truncated before the relevant
  section.
- **SemBench's leaderboard, the DEEM Lab post, the UTN blog post and the
  paper's text.** `sembench.github.io`, `deem.berlin`, `utndatasystems.github.io`
  and `arxiv.org` all refused. So whether the leaderboard lists any
  production engine besides BigQuery rests on the repository alone.

---

## Level 3 - Whether SemBench's BigQuery cost is an undercount, and whether it reaches what was published

**Headline: yes, and yes. Every error goes the same way: it makes BigQuery
look cheaper.** SemBench reads BigQuery's token counts from a log. Google's
own tutorial for that log says it takes "a few minutes" to fill. SemBench's
runner waits seconds, then keeps whatever it finds.

- **An empty log** is recorded as **$0.00**, and the query is still marked
  `"success"`.
- **A half-filled log** is recorded as the query's cost, and nothing flags
  it.

The paper's tables, its scale-factor figure and the leaderboard all apply the
same rule: they discard the $0.00 runs as "not supported", but they average
the half-counted runs in. The cells affected come out about a fifth too
cheap. On one cars query, that is enough to rank BigQuery below ThalamusDB,
when the full count puts it 17% above.

No one has reported this upstream. Nothing about it changed in the window. At
HEAD (2026-07-15), the repository still serves these files from a snapshot it
labels "Paper submission version - October 2025".

Two more findings qualify the leaderboard:

- **Its "GPT-4o Mini" and "GPT-5 Mini" views show a BigQuery column that is
  really a Gemini run.** It is copied from the Gemini folders, and nothing on
  the leaderboard says so.
- **The same snapshot holds Snowflake `AI_FILTER` queries for four scenarios
  and Snowflake results for one.** No Snowflake cost or accuracy number was
  ever published from them. This corrects Level 2's "no Snowflake runner
  exists anywhere".

**What this level asked, and the answer.**

- **Is the one production-warehouse cost figure in SemBench an undercount?**
  Yes.
  - **Zeros:** 76 of 2,114 successful BigQuery records carry zero tokens and
    zero cost while returning rows.
  - **Partial counts:** at least seven more carry a partial count.
- **Does it reach what was published?**
  - The zeros do not: they are dropped.
  - The partial counts do. They lower BigQuery's cost by 19-26% on movie Q7
    at four of the five scale factors in the scale-factor figure, and by 22%
    on cars Q5 in the main table.

---

### 1. The runner records whatever the log holds when it looks, and Google says the log takes minutes to fill

**1. What it is.** This item is the mechanism, read from the code.

**Where `token_usage` comes from.**

- **The log.** BigQuery's `AI.IF`, `AI.CLASSIFY` and `AI.SCORE` call Gemini
  through Vertex AI. Vertex AI can write a copy of every model request and
  response to a BigQuery table. This is called **request-response logging**.
  - The table has `full_request` and `full_response` columns, both JSON.
  - It also has a `logging_time` column, which Google's tutorial defines as
    "roughly when the response was returned".
- **How SemBench finds its own calls.** It tags each call with a label,
  `query_uuid = <run id>-q<query number>`. After the run, it sums Gemini's
  own usage fields over five `inference_logs.*` tables, filtered on
  `JSON_VALUE(full_request, '$.labels.query_uuid') = @query_uuid`. Level 2
  inferred that filter; it is now read.
- **The log tables are not created anywhere in the repository.** So how
  logging was configured, including what fraction of requests it samples,
  is outside the code.

**Two rules in the runner at HEAD produce the undercount.**

- **Any non-empty result is final.** An empty result raises "usage not
  materialized yet (no rows)" and triggers a retry. A non-empty result is
  accepted at once.
  - Nothing compares the number of logged responses with the number of rows
    the model was called on.
  - So a log that has caught up with half the calls yields half the tokens,
    and the record looks normal.
- **Failure is written as a success.** When the retries run out, the runner
  prints "Could not retrieve cost data ... setting to 0". It sets
  `token_usage` to 0 and `money_cost` to 0.0.
  - `status` stays `"success"`. It was set when the query returned rows.
  - `run.py` prints tokens and cost only when they are above zero. So on the
    console, a zeroed query looks like a query with no cost line, not like a
    failure.

**How long the runner waits, against how long Google says the log takes.**

- **At HEAD:** a 5-second sleep, then at most three attempts 5 seconds apart,
  so about 15 seconds. Commit `d9ae9fb` added the first sleep on 2025-11-20:
  "add initial 5 seconds wait for inference log materialization".
- **In the version uploaded with the results on 2025-10-01** (`f7f3569`):
  there is no initial sleep, and `max_retries = 12  # 12 * 5s = 1 minute max
  wait`. The retry still applies only to an empty result.
- **Google's tutorial for this logging:**
  - "It can take a few minutes for the dataset to be created and for logs to
    show up".
  - It waits two minutes before querying the table.
  - "It may take a few minutes for new logs to appear."
  - Request-response pairs larger than the 10 MB BigQuery write-API row limit
    "will not be recorded".
  - A `sampling_rate` below 1.0 logs only that fraction of requests.

**What the files show fits that timing.**

- **The zeros are the end of the run.** A run executes every query first and
  reads the logs afterwards, in the same order. So the last queries executed
  are read soonest after they finish.
  - The execution order is the key order in each metrics file, because the
    runner builds the metrics in query order.
  - In the four runs checked, the zeros are the last queries executed:
    - movie `across_system_2.5flash_1`: Q7-Q10;
    - movie `_3`: Q6-Q10;
    - cars `_1`: Q4-Q9 (cars files run in the order Q1, Q10, Q2 ... Q9).
  - Cars `_4` shows the boundary inside one run:

    | Query | Tokens recorded | Same query in other rounds |
    |---|---|---|
    | Q4 | 3,973,003 | 3,973,003 |
    | Q5 | **774,640** | 5.96-6.33 million |
    | Q6-Q9 | **0** | millions |

- **No speed signature, against the cache explanation.** Level 2 named an
  engine-side cache as the alternative to a logging failure. If the model had
  not been called, the zero and partial runs should be faster. They are not:
  - movie Q7's zero and partial runs took **135-340 s**;
  - its full-count runs took **137-593 s**.
- **Identical output is not evidence either way.** The model is deterministic
  here. Full runs of movie Q7 recorded exactly 8,515,104 tokens eleven
  times. The 112,062-token run (`sf1000_repeat2`) returned the same 36,236
  rows, with the same precision and recall, as a 9,182,314-token run.
  A cache would also do that.
- **The systems that count tokens in-process never zero out.** Counts
  computed by the session from the repository's metrics files, for records
  with zero tokens but at least one row:

  | System | Records with zero tokens | Share |
  |---|---|---|
  | BigQuery | 76 of 2,114 | 3.6% |
  | LOTUS | 0 of 1,525 | 0% |
  | ThalamusDB | 0 of 1,417 | 0% |
  | Palimpzest | 0 of 1,081 | 0% |
  | FlockMTL | 10 of 10 | 100% |
  | Caesura | 5 of 8 | 63% |

  - LOTUS reads its counts from `lotus.settings.lm.stats`, in the same
    process that made the calls, according to SemBench's submit page.
  - FlockMTL and Caesura are samples too small to read, and they come from
    different runners.

**Nobody has flagged it.** None of SemBench's 12 issues concerns BigQuery,
tokens or cost. Level 2 found that none of its 15 pull requests does either.

**A source of truth that does not depend on the log** (search summary only).
BigQuery now shows, "for some generative AI functions", the input, output,
thought and cache token counts per query under "Job information". This is in
Preview. According to a search summary, the Job REST resource also carries
"GenAi stats". Neither is dated in anything read. SemBench's runner reads
neither.

**Background (out of window).**

- The runner as uploaded on 2025-10-01, and the 2025-11-20 change.
- Google's tutorial notebook, by Eric Dong, © 2025.

**2. How long ago.**

- **2026-07-15**, 70 days ago, for HEAD `c814e38`: the repository state that
  still carries all of this. Level 1 dated the same merge, pull request #28,
  2026-07-16. The difference is presumably a time zone.
- Everything else in this item is Background.

**3. How it relates to what has already been read.**

- **It settles Level 2 item 1's main inference.** Level 2 said: "That the Q7
  and Q6 zeros and the 2.68 million figure are log-capture undercounts rather
  than real savings... An engine-side cache is the alternative explanation."
  The mechanism is now read in code. The run-tail pattern and the timing
  evidence favour the log.
- **It verifies the `query_uuid` filter**, which Level 2 could only infer.
- **Filing.** It serves `analytics-broad`, in its reading as the measurement
  of AI systems, and touches `warehouse-agentic`. Both have a 90-day window
  in this mode.

**4. What through-line it changes.** Level 2 said SemBench's BigQuery cost "is
not a bill". This item adds that **it is not a complete count of tokens
either**. It counts the tokens that had reached an asynchronous log within
seconds (or a minute, in the 2025 version), and checks nothing.

The general lesson for this path: **a cost read from a log that is written
after the fact is a lower bound, not a measurement, unless something
reconciles it** against the number of calls or against the bill.

**5. What to research next.**

- **Whether BigQuery's job-level token statistics match the log on a full
  run.**
  - The test query is movie Q7, which records 8,515,104 tokens in most full
    runs. Run it once. Read the Preview "Job information" counts and the
    Job resource's GenAi stats. Then query the `inference_logs` table after
    0 s, 15 s, 60 s and 5 minutes.
  - That would show how fast the log fills and whether a reconciled source
    exists.
  - The field names and the Preview date need `docs.cloud.google.com`, which
    refused this run. The measurement needs a GCP project. That makes it a
    task for an engineer, not for reading.
- **How SemBench's `inference_logs` dataset was configured.**
  - What `sampling_rate` did it use?
  - Did any request-response pair exceed the 10 MB row limit? E-commerce q8,
    which joins long descriptions to product images, is the candidate.
  - The setup is not in the repository. It needs the paper's appendix
    (`arxiv.org/html/2511.01716v2`) or an issue on `SemBench/SemBench`.

**6. Source.** From open search. `github.com` is on `sources.md` for other
lines, but this repository is not.

- **Full file read, from a fresh clone of HEAD `c814e38` made by the
  session:**
  - [`generic_bigquery_runner.py`](https://github.com/SemBench/SemBench/blob/c814e38/src/runner/generic_bigquery_runner/generic_bigquery_runner.py),
    [`generic_runner.py`](https://github.com/SemBench/SemBench/blob/c814e38/src/runner/generic_runner.py),
    [`run.py`](https://github.com/SemBench/SemBench/blob/c814e38/src/run.py)
    and [`run_worker.py`](https://github.com/SemBench/SemBench/blob/c814e38/src/run_worker.py).
  - The experiment scripts
    [`scale_factor_experiment_timeout.sh`](https://github.com/SemBench/SemBench/blob/c814e38/scripts/scale_factor_experiment_timeout.sh)
    and [`repeat_experiment.sh`](https://github.com/SemBench/SemBench/blob/c814e38/scripts/repeat_experiment.sh).
  - The runner section of [`docs/submit.html`](https://github.com/SemBench/SemBench/blob/c814e38/docs/submit.html).
  - The BigQuery metrics files for cars
    [`across_system_2.5flash_1`](https://github.com/SemBench/SemBench/blob/c814e38/files/cars/metrics/across_system_2.5flash_1/bigquery.json)
    to [`_5`](https://github.com/SemBench/SemBench/blob/c814e38/files/cars/metrics/across_system_2.5flash_5/bigquery.json),
    and for movie `_1` to `_5`, `sf1000_repeat1` and
    [`sf1000_repeat2`](https://github.com/SemBench/SemBench/blob/c814e38/files/movie/metrics/across_system_2.5flash_sf1000_repeat2/bigquery.json).
  - The Q7 record in every movie BigQuery file.
- **Computed by the session from the repository's metrics files:** the
  76-of-2,114 count, the per-system counts and the movie Q7 series.
- **Full page read:** the [issue list](https://github.com/SemBench/SemBench/issues?q=is%3Aissue),
  the [runner's commit history](https://github.com/SemBench/SemBench/commits/main/src/runner/generic_bigquery_runner),
  and commit [`d9ae9fb`](https://github.com/SemBench/SemBench/commit/d9ae9fb78f8e450cdd8fa9016794814d4f79a2a9)
  for its message only. Its diff did not render.
- **Read through a fetch tool that summarises, so the quoted lines are its
  quotes:**
  - The [2025-10-01 runner at `f7f3569`](https://raw.githubusercontent.com/SemBench/SemBench/f7f3569/src/runner/generic_bigquery_runner/generic_bigquery_runner.py).
  - Google's [request-response logging notebook](https://github.com/GoogleCloudPlatform/generative-ai/blob/main/gemini/logging/intro_request_response_logging.ipynb),
    read from `raw.githubusercontent.com`.
- **Search summary only:**
  - Google's [request-response logging page](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/multimodal/request-response-logging).
    `docs.cloud.google.com` refused, and `cloud.google.com` redirected there.
  - BigQuery's job-level token counts, via
    [the token-quota page](https://docs.cloud.google.com/bigquery/docs/control-genai-costs)
    and [the Job resource](https://docs.cloud.google.com/bigquery/docs/reference/rest/v2/Job).

**7. Verified / inferred / assumed.**

- **Verified:**
  - The accept-if-not-empty rule.
  - That a failure is written as zero while the status stays `"success"`.
  - The console printing tokens only when above zero.
  - The 5-second sleep and the three attempts at HEAD, and `d9ae9fb`'s date
    and message.
  - The label filter.
  - That nothing in the repository creates the log tables.
  - The run-tail pattern in the four runs named, and the cars `_4` figures.
  - The Q7 execution-time ranges.
  - The per-system counts (the session's computation).
  - That there is no upstream issue.
- **Verified through a summarising fetch, and filed with that caveat:**
  - The 12 retries and the absence of an initial sleep at `f7f3569`.
  - The tutorial's "a few minutes", its two-minute wait, `sampling_rate` and
    the 10 MB limit.
- **Inferred:**
  - That log latency is the cause. This rests on the run-tail pattern, the
    empty-only retry and Google's wording.
  - That an engine-side cache is not the cause. This rests on execution times
    alone. A cache that still took minutes is not ruled out.
- **Search summary only, filed as inferred:** the job-level token counts and
  their Preview status.
- **Assumed:** that SemBench logged at a sampling rate of 1.0. A lower rate
  would thin every query evenly rather than zero the end of a run, so the
  pattern argues against it. But the configuration was not read.

---

### 2. The published aggregates drop the zeros and keep the partial counts, so the error reaches the paper's table and figure, in BigQuery's favour

**1. What it is.** This item covers how the per-run records become published
numbers, and what the leaderboard labels them as.

**Three aggregators, one rule.** Each treats a record with `money_cost` 0 as
"system doesn't support this query in this run" and leaves it out, along with
that run's quality and latency.

- **`src/table_brick_design_avg.py`** writes the per-scenario LaTeX heatmap
  tables. Their caption reads "Experimental Results of SemBench for the {...}
  Scenario".
  - Its code says: "Check if this system supports this query (money_cost >
    0)".
  - By default it averages the five round folders
    `across_system_2.5flash_{1..5}`.
- **`src/plot_scalability_combined.py`** is headed "Combined Scalability and
  Memory Plotting for VLDB Conference Paper".
  - It reads only the `_sf*_repeat*` folders.
  - It skips a record `if exec_time <= 0 or money <= 0`.
  - It averages each query over its repeats, then averages over the queries
    every system completed.
- **The leaderboard's `docs/static/js/sembench.js`** says "Only include if has
  positive cost (matches Python logic)".
  - Its only data version is `paper-2025-10-01`, described in `versions.json`
    as "Paper submission version - October 2025" and created 2025-09-19.
  - That snapshot holds the same zero records and the same partial counts
    (checked by grep, including `774640` and `112062`).

**What the rule does to the two kinds of error.**

- **Zeros are dropped, not averaged in as $0.** That part of the rule works.
  But whole runs go with them:
  - in the main movie table, BigQuery's Q7-Q10 rest on 3 of 5 rounds, and
    Q6 on 4;
  - in the main cars table, Q4-Q9 rest on 3 or 4.
- **Partial counts are above zero, so they are kept** as that run's cost.

**Two verified cases where a partial count changes a published number.**

- **Cars Q5, main table.** BigQuery's round costs:

  | Round | Cost | Tokens |
  |---|---|---|
  | 2 | $1.85 | 5,984,816 |
  | 3 | $1.84 | 5,960,386 |
  | 4 | **$0.25** | **774,640** |
  | 5 | $1.95 | 6,328,482 |
  | 1 | $0 (dropped) | 0 |

  - The cell's mean is **$1.47**. The mean of the three full rounds is
    **$1.88**, so the cell is **22% low**.
  - ThalamusDB's cars Q5 costs **$1.61** in each of four rounds; its fifth
    record is a zero and is dropped.
  - So the table puts BigQuery **9% cheaper than ThalamusDB**. The full count
    puts it **17% dearer**.
  - Palimpzest, at $0.011, is cheapest either way.
  - BigQuery's answer was exact (relative error 0.0) in all five rounds,
    including the partial one and the zero one.
- **Movie Q7, scale-factor figure.** BigQuery's recorded mean, as the plot
  computes it, against the mean of the full-count repeats:

  | Rows | Full-count repeats | Recorded mean | Full-count mean | Low by |
  |---|---|---|---|---|
  | 1,000 | 4 of 5 | $2.68 | $3.34 | 20% |
  | 2,000 | 4 of 5 | $2.65 | $3.28 | 19% |
  | 4,000 | 5 of 5 | $3.28 | $3.28 | 0% |
  | 8,000 | 3 of 5 | $2.47 | $3.28 | 25% |
  | 16,000 | 2 of 5, plus one zero dropped | $2.42 | $3.28 | 26% |

  - In one raw file the ordering against LOTUS inverts. At 16,000 rows,
    repeat 1, BigQuery records **$1.03** against LOTUS's **$1.50**. The full
    count, about $3.28, is 2.2 times LOTUS's.
  - The figure averages repeats, so it does not show that inversion. Its
    BigQuery line and error band are still pulled down and widened by the
    partial counts.

**How much, and in which direction.**

- **Direction.** Every effect found makes BigQuery look cheaper, never
  dearer.
- **Size.** At 1,000 rows, Q7's shortfall is $0.66. That is about a ninth of
  BigQuery's summed movie cost per run, about $5.75 over ten queries in
  repeat 1. This holds if Q7 is among the queries every system completed.
- **Unchecked.** The main movie table is unaffected: its three full rounds
  are clean. Animals, e-commerce, medical and MMQA were not checked for
  partial counts. A partial count is only detectable where a query has a
  stable full-count reference.

**Separately, the BigQuery column under the OpenAI model views is a Gemini
run.**

- **The files label themselves.**
  - `files/movie/metrics/across_system_4omini/bigquery.json` records
    `"model_name": "gemini-2.0-flash-001"` on every query.
  - `across_system_5mini/bigquery.json` in movie, animals and medical records
    `"gemini-2.5-flash"`.
  - The session found the figures identical to the 2.0-flash and 2.5-flash
    files. For example, Q7 is 8,734,443 tokens and $1.573 in both the
    2.0-flash and 4o-mini files.
  - So these are copies, and the files say so.
- **The stand-ins match on price.** SemBench's own LOTUS price table gives:

  | Model | Input, per million tokens | Output, per million tokens |
  |---|---|---|
  | `gpt-4o-mini` | $0.15 | $0.60 |
  | `gemini-2.0-flash` (text) | $0.15 | $0.60 |
  | `gpt-5-mini` | $0.25 | $2.00 |
  | `gemini_2_5_flash` (BigQuery runner) | $0.30 | $2.50 |

  - So the 4o-mini stand-in has identical text list prices.
  - The 5-mini stand-in is 20-25% dearer per token, which biases that view
    against BigQuery.
- **The leaderboard does not say so.**
  - `sembench.js` maps movie's `'4omini'` to "GPT-4o Mini" and `'5mini'` to
    "GPT-5 Mini", and loads `bigquery.json` from those folders like any other
    system.
  - It has no BigQuery-specific handling. Its only BigQuery references are
    the system list, the display name and the SQL path.
  - The snapshot contains both movie files.
  - No text in the README, `index.html`, `submit.html` or `website.readme`
    explains the substitution.

**2. How long ago.**

- **2026-07-15**, 70 days ago, for HEAD: the state these aggregators and the
  leaderboard are served in.
- The aggregators (2025-09-17), the snapshot (2025-09-19, uploaded
  2025-10-01) and the runs are Background.

**3. How it relates to what has already been read.** It answers both halves
of Level 2 item 1's first lead.

- **Which recorded Q7 runs feed the scale-factor figure?** All the `_repeat`
  folders except the zeros. The folders without `_repeat` (including
  `sf16000`, which Level 2's table cited) feed only the memory plots, and
  those skip BigQuery by code.
- **Do `sf16000_repeat2` to `repeat5` show the same undercount?**
  - `repeat2` is zero;
  - `repeat3` is partial, at 5,450,174 tokens;
  - `repeat4` and `repeat5` are full.

It also qualifies Level 2's statement that "every recorded BigQuery run read
here names gemini-2.5-flash". The 4o-mini file names 2.0 Flash.

It serves `analytics-broad` and touches `warehouse-agentic`.

**4. What through-line it changes.** A cleaning rule that treats missing data
as "unsupported" catches the obvious failure and keeps the subtle one.

- **It catches the zeros**, so no published cell reads $0.
- **It averages the partial counts in**, so a published cell can read 22%
  low and look normal.

For this path, that turns Level 2's "not a bill" into **a lower estimate that
favours the vendor, even as token arithmetic**.

The model-substitution finding adds a second, general point. **A leaderboard
keyed by model cannot hold a production warehouse to the same model.** The
warehouse offers only its own vendor's models, so any "same model" comparison
against it is a stand-in, and this one is unlabelled.

**5. What to research next.**

- **Re-score every BigQuery cell with the partial counts excluded, across all
  six scenarios.**
  - Flag any record below, say, half of that query's median tokens across
    runs.
  - Then list which main-table cells and which scale-figure points move, and
    which rankings against LOTUS, ThalamusDB and Palimpzest flip.
  - This run checked only movie and cars.
  - It needs a script over `files/*/metrics`. That is an analyst's task with
    no network.
- **Whether the published paper shows the numbers these scripts produce.**
  - Does arXiv:2511.01716v2's cars table show BigQuery Q5 at about $1.47?
  - Does its model-comparison section put a BigQuery column beside
    GPT-4o-mini or GPT-5-mini results?
  - The generated file names itself `table_2.py`, not
    `table_brick_design_avg.py`. So which script made which published table
    is inferred.
  - This needs `arxiv.org/html/2511.01716v2`, which refused this run.

**6. Source.** From open search. `github.com` is on `sources.md` for other
lines, but this repository is not.

- **Full file read, from the session's clone of HEAD:**
  - [`table_brick_design_avg.py`](https://github.com/SemBench/SemBench/blob/c814e38/src/table_brick_design_avg.py)
    and [`plot_scalability_combined.py`](https://github.com/SemBench/SemBench/blob/c814e38/src/plot_scalability_combined.py).
  - [`plot.py`](https://github.com/SemBench/SemBench/blob/c814e38/src/plot.py),
    lines 2166-2260 and 4150-4230.
  - [`sembench.js`](https://github.com/SemBench/SemBench/blob/c814e38/docs/static/js/sembench.js),
    lines 1-90, 349-355 and 400-580, plus a search of the whole file.
  - [`versions.json`](https://github.com/SemBench/SemBench/blob/c814e38/docs/static/versions.json).
  - The generic LOTUS runner's [price table](https://github.com/SemBench/SemBench/blob/c814e38/src/runner/generic_lotus_runner/generic_lotus_runner.py).
  - The Q5 record of every system in cars rounds 1-5.
  - The `model_name` field of every BigQuery file under `across_system_4omini`
    and `_5mini`.
- **Computed by the session from the repository's metrics files:** the movie
  Q7 series, and the identity of the 4o-mini and 5-mini files with their
  Gemini counterparts.
- **This run's own arithmetic,** from the verified figures: the means and
  shortfalls in the two tables above.

**7. Verified / inferred / assumed.**

- **Verified:**
  - The zero-means-unsupported rule in all three aggregators.
  - That the snapshot is the leaderboard's only version and holds the same
    records.
  - The cars Q5 and movie Q7 figures. The means are arithmetic on them.
  - The LOTUS inversion in `sf16000_repeat1`.
  - The model names in the substituted files, and both price tables.
  - That `sembench.js` gives BigQuery no special handling.
  - That no explanatory text exists in the four files searched.
- **Inferred:**
  - That these scripts produced the paper's tables and figure. The file
    names say so, and the paper could not be read.
  - The "about a ninth" share.
  - That the rendered leaderboard shows a BigQuery column in the 4o-mini and
    5-mini views. `sembench.github.io` refused, so the page was not seen.
  - That the stand-ins were chosen for price. The exact match for 4o-mini
    suggests it, and nothing says it.
- **Assumed:** that the partial counts are undercounts and not cheaper runs.
  Item 1 argues this, but no billing record was read for any run.

---

### 3. The paper snapshot holds a Snowflake `AI_FILTER` column that was written, partly run, and never scored

**1. What it is.** SemBench's paper snapshot, served by the leaderboard from
`docs/static/data/paper-2025-10-01/`, contains **Snowflake Cortex query
files** and **Snowflake results**. It contains no Snowflake cost or quality
figure anywhere.

**What exists:**

- **`AI_FILTER` queries for four scenarios** (Cortex AI SQL is Snowflake's
  family of SQL AI functions):
  - movie: 10 files;
  - e-commerce: 11;
  - medical: 7;
  - MMQA: 11.
  - Movie Q7, for example, is the same review self-join as BigQuery's,
    written as `AI_FILTER(PROMPT('These two movie reviews express opposite
    sentiments ... {0} ... {1}', r1."reviewText", r2."reviewText"))`.
- **Two e-commerce files record a limit**: "Currently not supported in
  Snowflake with the following error: Unsupported prompt input modality type:
  multiImages for function: AI_FILTER".
- **Snowflake result files for medical** Q1, Q3, Q4, Q8 and Q10, in two
  round folders, `flash_2` and `flash_4`. Their columns are in Snowflake's
  upper case, for example `AGE,GENDER,SMOKING_HISTORY,...`. So at least one
  scenario was run.

**What is missing:**

- **No `snowflake.json` metrics file**, in the snapshot or at HEAD.
- **None in the 2025-10-01 upload's** `files/medical/metrics` folders.
- **No Snowflake query folder** in that upload's `files/medical/query`.
- **No runner class.** The repository's search finds no file named for
  Snowflake outside the snapshot.

**The code keeps a slot for it, switched off:**

- `run.py` maps `"snowflake": "SnowflakeRunner"`, and no such class exists.
- The e-commerce and medical scenario handlers import `setup.snowflake`
  modules that are not in the repository.
- The table generator has `# "Snowflake",` commented out of its system list.
- `scripts/analysis.py` defaults to `include_snowflake = False`. The
  analysis files it wrote say "The 'snowflake' system has been excluded from
  this analysis".
- `website_version_update.py` defaults to an analysis directory named
  `academic_bigquery_snowflake_3scenarios`.
- `sembench.js` lists `'snowflake'` among the systems it will load.
- E-commerce's BigQuery runner still opens with the docstring "Snowflake
  system runner implementation. Placeholder required by the current
  structure".

**Why it was dropped is not stated in anything read.**

**2. How long ago.**

- **2026-07-15**, 70 days ago, for HEAD, which still serves the snapshot.
- The snapshot itself was created 2025-09-19 and uploaded 2025-10-01. It is
  Background.

**3. How it relates to what has already been read.**

- **It corrects Level 2.** Level 2 wrote: "No Snowflake or Databricks runner
  exists anywhere this run could reach". Its searches covered `src/runner/`,
  forks, pull requests and issues.
  - The runner code does not exist.
  - Snowflake queries and results do, in `docs/`, where none of those
    searches looked.
- **It does not change Level 1 item 3's statement** that no Snowflake system
  has been added "as an evaluated system". That remains true.
- It serves `warehouse-agentic` and `analytics-broad`.

**4. What through-line it changes.** Level 2 said Snowflake and Databricks
have no independent measurement. The sharper version is this:
**the one independent benchmark wrote a Snowflake `AI_FILTER` column, ran part
of it, and published neither a cost nor an accuracy.**

So the absence of a Snowflake number is not for lack of trying. What stopped
it is not recorded.

**5. What to research next.**

- **Snowflake `AI_FILTER`'s accuracy on SemBench medical, computed from files
  already in the repository.**
  - Score the `flash_2` and `flash_4` Snowflake results for Q1, Q3, Q4, Q8
    and Q10 against `raw_results/ground_truth`.
  - Compare them with BigQuery's `bigquery_flash` results for the same five
    queries.
  - That would be the first third-party accuracy figure for `AI_FILTER` on
    public data. It is an analyst's task with no network.
- **Why the Snowflake column was dropped, and how its cost would have been
  measured.**
  - Does arXiv:2511.01716 v1 or v2 mention Snowflake Cortex?
  - What did the `academic_bigquery_snowflake_3scenarios` analysis contain?
    It is named in the code, but it is not in the repository.
  - The routes are the paper's HTML, and an issue on `SemBench/SemBench`.

**6. Source.** From open search. `github.com` is on `sources.md` for other
lines, but this repository is not.

- **Full file read, from the session's clone of HEAD:**
  - The movie [Q1](https://github.com/SemBench/SemBench/blob/c814e38/docs/static/data/paper-2025-10-01/movie/query/snowflake/Q1.sql)
    and [Q7](https://github.com/SemBench/SemBench/blob/c814e38/docs/static/data/paper-2025-10-01/movie/query/snowflake/Q7.sql)
    Snowflake queries.
  - E-commerce [q9](https://github.com/SemBench/SemBench/blob/c814e38/docs/static/data/paper-2025-10-01/ecomm/queries/dialects/snowflake/q9.sql).
  - Medical [Q1](https://github.com/SemBench/SemBench/blob/c814e38/docs/static/data/paper-2025-10-01/medical/query/snowflake/Q1.sql)
    and the head of its [`flash_2` result](https://github.com/SemBench/SemBench/blob/c814e38/docs/static/data/paper-2025-10-01/medical/raw_results/flash_2/snowflake/Q1.csv).
  - E-commerce's [BigQuery runner](https://github.com/SemBench/SemBench/blob/c814e38/src/scenario/ecomm/runner/bigquery_runner/bigquery_runner.py).
  - `scripts/analysis.py`, lines 290-340.
  - A search of the whole repository for "snowflake" and "cortex", and file
    listings of every `snowflake` folder.
- **Full page read, through a fetch tool:** the 2025-10-01 upload's
  [`files/medical/metrics`](https://github.com/SemBench/SemBench/tree/f7f3569/files/medical/metrics),
  its [`across_system_2.5flash_2`](https://github.com/SemBench/SemBench/tree/f7f3569/files/medical/metrics/across_system_2.5flash_2)
  and [`files/medical/query`](https://github.com/SemBench/SemBench/tree/f7f3569/files/medical/query)
  listings, and the repository's commit search for "snowflake". It found one
  commit, the 2026-03-20 Adopted by entry.

**7. Verified / inferred / assumed.**

- **Verified:**
  - The query files and their counts, and the two e-commerce error notes.
  - The medical result files.
  - The absence of any Snowflake metrics file and of any runner class.
  - Every code trace quoted.
- **Inferred:**
  - That "flash_2" and "flash_4" are round folders of the Gemini 2.5 Flash
    experiments. This is from the naming.
  - That the upper-case columns mean the results came from Snowflake.
- **Assumed:** that no Snowflake metrics exist on a branch or in a file the
  search missed. Only the default branch and the one upload commit were
  checked.

---

### What was dropped and why

- **An engine-side response cache as the main explanation.** Dropped as the
  lead explanation because execution times show no speed signature and
  identical outputs are normal here. It is kept as a named alternative in item
  1.
- **A sampling rate below 1.0 as the explanation.** It would thin every query
  in proportion. The records show intact early queries and zeroed late ones.
- **Google's 2025-09-17 blog, "BigQuery enhancements to boost gen AI
  inference".** Read in full. It covers throughput and row-level retries
  ("over 99.99% row-level success rate"), not token accounting, and it is
  Background.
- **The memory plots.** They skip BigQuery by code
  (`if system_name.lower() == "bigquery": continue`).
- **FlockMTL's 10 of 10 and Caesura's 5 of 8 zero-token records.** The
  samples are tiny, and they come from different runners with different
  causes, not examined here.
- **Cars Q3's spread of 5.09-5.52 million tokens across rounds.** It is
  within what an LLM-driven `LIMIT` query varies by, and was not treated as a
  partial count.
- **Quality drift from dropped runs.** Cars Q8 F1 runs from 0.17 to 0.28
  across rounds. Dropping rounds 1 and 4 moves the mean from 0.23 to 0.24,
  too small to report as an item.

### What was searched for and not found

- **An upstream issue or pull request about zero or missing BigQuery tokens.**
  None among the 12 issues (the list was read), and none among the 15 pull
  requests (Level 2).
- **Any critic of SemBench's cost method.** A search phrased as "SemBench
  BigQuery token usage zero cost inference logs undercount" returned only the
  repository, the paper and Google's documentation.
- **SemBench's logging configuration.** Neither the sampling rate nor any
  table-creation step appears in the code, the README or the submit page.
- **Google's documented latency on its own logging page.**
  `docs.cloud.google.com` refused. Only the tutorial notebook's wording was
  read.
- **When BigQuery's job-level token counts shipped.** The release notes are
  on the refused host, and three searches gave no date.
- **The paper's text.** `arxiv.org` refused, so which script produced which
  published table is inferred from file headers.
- **Any in-window change to BigQuery results, the runner, the aggregators or
  the leaderboard data.** None.
  - The runner was last changed 2025-11-20.
  - `versions.json` holds one version.
  - The one repository commit that mentions Snowflake is the 2026-03-20
    Adopted by entry.

### Where this path ends

Three levels, one chain.

- **Level 1** found that the cost of a warehouse AI function has become an
  optimiser problem.
  - The research estimators that would steer it are poor: off by 16 to 664
    times on average.
  - Snowflake's engine team sidesteps estimation by learning while the query
    runs.
  - The only harness that has scored a production engine, SemBench on
    BigQuery, had not re-run it this quarter.
- **Level 2** found that even that one score is not independent and not a
  bill.
  - Google's BigQuery team co-wrote it.
  - It prices logged tokens at list rates.
  - Every other production number this quarter came from the vendor itself.
- **Level 3** found that the log undercounts, and that the undercount reaches
  the published results.
  - About one run in thirty records no cost at all. Those runs are
    discarded.
  - A smaller number record part of the cost. Those are averaged in.
  - The result is a vendor's function reported as cheaper than it was, by
    about a fifth where it shows, and cheap enough to change one ranking.
  - The same snapshot also shows that SemBench wrote a Snowflake column and
    never scored it.

The plain answer to the question under the whole path: **a published cost
figure for a warehouse AI function can be trusted only as far as its token
source is reconciled against the bill.** Today, nothing checked by this path
does that:

- no vendor's own figure;
- SemBench's BigQuery column;
- Snowflake's analytical 11.4×;
- Databricks' 1/100th.

The likely fix looks cheap: read job-level statistics or billing exports
instead of a log, and fail loudly on a zero. The job-level route is in Preview
and was read here only in search summaries. Until someone does this, the
honest reading of any such number is **"at least this much"**.
