# Auto breadth - Snowflake SQL AI functions - breadth pass - 2026-09-23

**Produced by a research subagent in auto-breadth mode**, as step 1 of
[`docs/reader/auto-breadth.md`](../../../reader/auto-breadth.md). It is not a
brief on an adopted topic, and nothing in it is a profile change.

**The decision this serves:** which angles on Snowflake's SQL AI functions (the
`AI_*` family formerly marketed as Cortex AISQL) are worth following deeper, for
a reader tracking analytics for enterprise AI.

**Window:** 90 days, so items are dated on or after **2026-06-25**. Anything
older appears only as a marked **Background** note.

**Read this first, because it shapes every part 6 below.** In this run the hosts
that carry most of Snowflake's own record would not load: `docs.snowflake.com`,
`www.snowflake.com`, `arxiv.org`, `docs.databricks.com` and
`docs.cloud.google.com`. What did load was GitHub (Snowflake's and Google's own
SDK repositories, and the benchmark and paper repositories) and
`cloud.google.com`'s blog. So the full-page reads here come mostly from
**changelogs, pull requests and benchmark repositories**. Snowflake's own
release notes and the newest papers appear only as **search summaries**, and
each item says which claims rest on which.

---

## Headline

**This quarter the family stopped being a preview and started being billed and
benchmarked. Both of those are harder to see from outside than the features
were.**

Three things happened in the window, and each one moves something from "new
feature" to "operating cost":

- **Snowflake's own Python client stopped calling the functions experimental.**
  A Snowflake engineer's pull request, merged 2026-07-24, says "Snowflake now
  exposes 15 `AI_*` functions". The release that shipped the change on
  2026-07-29 took the `experimental` tag off every AI method (item 1).
- **The research on running these functions points at cost, and so do
  Snowflake's own researchers.** A Snowflake-authored paper dated 2026-08-27
  says that in production, LLM compute is **80-90% of query cost**. That figure
  rests on a search summary; the paper itself would not load. An academic
  benchmark now targets `AI_FILTER` and `AI_JOIN` by name (item 3). In the same
  quarter, Snowflake's control plane for AI spend went to preview with per-user
  quotas (item 2).
- **The one benchmark built on these functions cannot be run on the shared
  accounts that ship with its parent benchmark.** Its own evaluation guide says
  the accounts handed out through the Spider 2.0 access process "do not
  currently have Cortex AISQL enabled", and that running it "is not cheap".
  The public release has **393 tasks, where the paper reports 465** (item 5).

The competitive picture fits the same pattern. Google and Databricks spent the
quarter moving the **same function vocabulary** (classify, filter, score,
embed, similarity) out of SQL and into DataFrame and REST interfaces. None of
the three vendors attached an accuracy number to any of it (item 4).

---

## The items

### 1. Snowflake's client library stopped calling the AI functions experimental, and counted fifteen

**1. What it is.** An AI function is an LLM call made from inside a SQL
statement. `AI_FILTER(prompt, column)` returns true or false per row,
`AI_CLASSIFY` assigns a label and `AI_AGG` summarises across rows. The model
runs in the warehouse, and the result is an ordinary column.

In this window the Snowpark Python client, Snowflake's own DataFrame library,
changed in three ways:

- **Pull request #4263**, merged **2026-07-17**, "Removed the
  `@experimental(version="1.39.0")` decorator from all 14 methods in
  `DataFrameAIFunctions`": `complete`, `filter`, `agg`, `classify`,
  `similarity`, `sentiment`, `embed`, `summarize_agg`, `transcribe`,
  `parse_document`, `extract`, `count_tokens` and the two `split_text_*`
  helpers. It also removed the decorator from `RelationalGroupedDataFrame.ai_agg`.
  The test plan is "no experimental warnings are emitted when calling AI SQL
  functions."
- **Pull request #4261**, merged **2026-07-24**, gives its motivation as:
  "Snowflake now exposes 15 `AI_*` functions. Prior to this PR, the Snowpark
  Python client was missing three of them". Those three are `AI_COUNT_TOKENS`,
  `AI_MULTI_EMBED` and `AI_REDACT`. It also moved token counting off
  "the deprecated `SNOWFLAKE.CORTEX.COUNT_TOKENS`".
- **Release 1.54.0, dated 2026-07-29**, shipped both changes and added
  `DataFrame.ai.translate`. The unreleased 1.56.0 section already fixes
  `ai_extract` "misrouting FILE-type inputs", and documents that
  `ai_redact(..., mode="detect")` "returns an ARRAY of span objects".

The same window also brought server-side changes that this run could see only
as search summaries:

- **2026-08-10:** `AI_MULTI_EMBED` became GA for large video files (up to 6 GB,
  on TwelveLabs Marengo Embed 3.0).
- **2026-08-20:** `AI_EXTRACT` and `AI_PARSE_DOCUMENT` gained support for
  client-side encrypted stages and network-restricted accounts.
- **Behaviour-change bundles:** under `BCR-2184`, most AI functions (including
  `AI_COMPLETE`, `AI_CLASSIFY`, `AI_FILTER`, `AI_PARSE_DOCUMENT` and
  `AI_TRANSCRIBE`) return NULL on error instead of failing the query. A pending
  `BCR-2358` in the 2026_07 bundle extends this to `AI_EMBED` and
  `AI_SIMILARITY`.

**Background (out of window).** Four earlier release notes, all read as search
summaries, set the baseline:

- **2025-11-04:** "Cortex AI Functions" went GA. Its URL still reads
  `cortex-aisql-operators-ga`.
- **2026-01-22:** `AI_FILTER`, `AI_AGG` and `AI_SUMMARIZE_AGG` went GA.
- **2026-01-27:** `AI_COUNT_TOKENS` went GA.
- **2026-05-13:** per-function privileges went GA.

**2. How long ago.** **2026-07-29**, 56 days ago, for the release. The two pull
requests are dated **2026-07-17** (68 days) and **2026-07-24** (61 days).

**3. How it relates to what has already been read.** It serves
**`warehouse-agentic`**, whose first run (#42) covered Snowflake's agent layer
(the Cortex AI Gateway and Semantic View Autopilot) and never reached the SQL
functions underneath. #35's item 2 described AI functions only as the subject
of the Spider 2.0-AIFunc benchmark. This is the first item in any brief about
the functions themselves.

**4. What through-line it changes.** It extends #42's through-line, which was
that the vendors shipped governance and meters rather than accuracy. Taking the
tag off is a statement about support, not about quality: nothing in either pull
request or the changelog mentions accuracy. What it does change is the
**rename**. The product is now "AI Functions". "AISQL" survives in URLs and
repository names, and the benchmark itself was renamed from "Spider2-AISQL" to
"Spider2-AIFunc" on the day it was published (item 5). A reader searching for
"AISQL" will increasingly find only older material.

**5. What to research next.**
- **Snowflake's behaviour-change entries `BCR-2184` (2026_02 bundle) and
  `BCR-2358` (2026_07 bundle, pending) on AI Function multirow error
  handling.** Three questions: which functions now return NULL on error, the
  date each bundle is enabled by default, and whether a row that returns NULL
  after a model error is still billed for its input tokens. A query whose
  failures turn into NULLs has a different accuracy story from one that stops.
- **Snowflake's "Cortex model deprecations for July 2026" notice.** Which models
  were withdrawn from `AI_COMPLETE` and the other `AI_*` functions, and what
  happens to a saved view or dynamic table that names a withdrawn model. That
  is the maintenance cost of putting a model name inside SQL.

**6. Source.** From open search; neither host was on `sources.md` for this
subject, although `github.com` is listed for other lines.
- [snowpark-python `CHANGELOG.md`](https://raw.githubusercontent.com/snowflakedb/snowpark-python/main/CHANGELOG.md):
  **full page read**, including the release dates from 1.45.0 to 1.55.0.
- [Pull request #4263](https://github.com/snowflakedb/snowpark-python/pull/4263)
  and [pull request #4261](https://github.com/snowflakedb/snowpark-python/pull/4261):
  **full page read** of each description and its review thread.
- The server-side release notes (for example
  [2026-08-10 AI_MULTI_EMBED](https://docs.snowflake.com/en/release-notes/2026/other/2026-08-10-ai-multi-embed-large-video-files-ga)
  and [BCR-2184](https://docs.snowflake.com/en/release-notes/bcr-bundles/2026_02/bcr-2184)):
  **search summary only**, because `docs.snowflake.com` refused this run.

**7. Verified / inferred / assumed.**
- **Verified:** both pull requests' merge dates, authors and quoted text; the
  list of 14 methods; the 1.54.0 date and its entries; and the "deprecated
  `SNOWFLAKE.CORTEX.COUNT_TOKENS`" wording.
- **Inferred:** that the fifteen functions are `AI_COMPLETE`, `AI_FILTER`,
  `AI_AGG`, `AI_CLASSIFY`, `AI_SIMILARITY`, `AI_SENTIMENT`, `AI_EMBED`,
  `AI_SUMMARIZE_AGG`, `AI_TRANSCRIBE`, `AI_PARSE_DOCUMENT`, `AI_EXTRACT`,
  `AI_COUNT_TOKENS`, `AI_MULTI_EMBED`, `AI_REDACT` and `AI_TRANSLATE`. The pull
  request gives the count without the list, and these fifteen are what the
  changelog names.
- **Inferred:** that removing the tag reflects the SQL functions' GA status.
  Neither pull request gives a reason.
- **Search summary only, filed as inferred:** the 2026-08-10 and 2026-08-20
  dates and both behaviour-change entries.
- **Assumed:** that the Python client follows the server surface rather than
  leading it.

---

### 2. The spend control for Snowflake's AI reached preview with per-user quotas, while the per-row price stays in a PDF

**1. What it is.** The **Cortex AI Gateway** went to **Preview** on
**2026-09-15**. According to the search summary of the release note, it is
"the control plane where you govern how AI applications and third-party agents
in your organization reach models". It offers three spend controls:

- **Custom budgets:** you can "control spend by adding the gateway as a shared
  resource to a custom budget".
- **Per-user quotas:** these set "monthly and daily credit limits that apply to
  each user individually". They are described as "the only AI cost control with
  built-in enforcement: blocks are applied within minutes of the limit being
  reached".
- **A usage view:** the new `AI_GATEWAY_USAGE_HISTORY` view records "the
  gateway, user, model, and token consumption for each request".

The reason this belongs under SQL functions is how they are priced. An AI
function is billed per token for every row it touches, so its cost scales with
table size rather than with the number of questions asked. The one full-page
statement this run could read on that point comes from the AIFunc benchmark's
evaluation guide: "Running AISQL over the Spider2-Snow databases is not cheap.
The databases are large, and every AI function call invokes a model." Item 3's
Snowflake-authored paper supplies the scale, again only via a search summary:
LLM compute is "80-90% of query cost" in production, and each call costs
"10^5-10^7×" a relational predicate.

**Background (out of window).** From search summaries:

- **2026-04-01:** Snowflake moved AI to a separate **AI Credits** currency, at
  $2.00 global and $2.20 regional per credit.
- **2026-03-02:** cost management for AI Functions went GA, with a
  `CORTEX_AI_FUNCTIONS_USAGE_HISTORY` view and per-user monthly spend limits.
- **2026-04-10:** budgets for AI features went GA.

The per-model, per-function rates live in Snowflake's Service Consumption
Table, and several pricing guides point there rather than to the pricing page.

**2. How long ago.** **2026-09-15**, eight days ago.

**3. How it relates to what has already been read.** It serves
**`warehouse-agentic`**, and it is a direct development on **#42's item 4**,
which read the Gateway's announcement of **2026-07-28**. At that point the
Gateway itself was "public preview soon", and AI Cost Control was private
preview. #42's first research-next lead asked whether leaving private preview
would produce "any published per-query or per-agent cost figures". Seven weeks
later the answer is no: the preview adds enforcement and a usage view, and no
cost figures were found.

**4. What through-line it changes.** It confirms #42's headline: "the second
thing both vendors shipped is a meter". It also adds a gap specific to SQL.
The Gateway is described in terms of agents and applications reaching models,
and none of the material read says whether an `AI_FILTER` running inside an
ordinary warehouse query goes through the Gateway, through a quota, or only
through the older AI Functions budget. For the workload most likely to produce
a five-figure surprise (one function over a large table), which control applies
is not stated anywhere this run could read.

**5. What to research next.**
- **Snowflake's "AI cost management and governance" guide** (the per-user quota
  section) and the 2026-09-15 Gateway preview note. Do quotas cover the AI
  Functions domain (`AI_COMPLETE`, `AI_FILTER`, `AI_CLASSIFY` in a warehouse
  query) or only Gateway traffic? And given the "within minutes" enforcement,
  can a single long-running query run past the limit before it is blocked?
- **Table 6 of Snowflake's Service Consumption Table**, the AI Credits per
  million tokens by model and function. Record the current rates for
  `AI_FILTER`, `AI_CLASSIFY` and `AI_AGG`, and check whether the prompt tokens
  each function adds internally are billed to the customer.

**6. Source.** From open search; `docs.snowflake.com` is on `sources.md` and
**refused this run**.
- [Snowflake release note, "Sep 15, 2026: Cortex AI Gateway (Preview)"](https://docs.snowflake.com/en/release-notes/2026/other/2026-09-15-cortex-ai-gateway)
  and the [AI cost management and governance guide](https://docs.snowflake.com/en/user-guide/snowflake-cortex/governance-and-availability/ai-cost-management-and-governance):
  **search summary only**.
- [Spider2-AIFunc `docs/evaluation.md`](https://raw.githubusercontent.com/Leolty/Spider2-AIFunc/main/docs/evaluation.md):
  **full page read**.
- The 80-90% figure is from
  [arXiv:2608.27244](https://arxiv.org/abs/2608.27244): **search summary only**.

**7. Verified / inferred / assumed.**
- **Verified:** only the "not cheap" quote, from the evaluation guide.
- **Search summary only, filed as inferred:** the 2026-09-15 preview date, the
  quota and budget mechanics, the usage view, the "within minutes" wording, the
  80-90% and 10^5-10^7× figures, and every background date and price above.
- **Inferred:** that no per-query cost figure was published with the preview.
  This is an absence in search results, not in a page read in full.
- **Assumed:** that the Gateway preview is the same product #42 read on
  2026-07-28 and not a separately scoped component. The name matches, and no
  scope could be checked.

---

### 3. Snowflake's own researchers say LLM calls are 80-90% of the cost of an AI query, and academia has adopted `AI_FILTER` as the thing to optimise

**1. What it is.** A cluster of in-window research on making SQL AI functions
cheaper to run. Its centre of gravity is Snowflake's own engine team.

- **"Compositional Online Learning for Semantic Data Processing Systems",
  Paweł Liskowski and four co-authors, arXiv:2608.27244, 2026-08-27.**
  Liskowski is first author of Snowflake's Cortex AISQL engine paper. According
  to the search summary of the abstract, an LLM call "is expensive enough to
  dominate query cost, yet slow enough to hide a CPU-side learner's update
  behind its round-trip". Its answer is to put online learners at the LLM call
  boundary, since "at LLM latency, per-call gradient steps and per-batch
  threshold solves fit inside the round-trip". It also reports the production
  figures quoted in item 2.
- **SemCEB, a cardinality-estimation benchmark "for semantic operators,
  specifically `AI_FILTER` and `AI_JOIN`"**, by Zimmerer, Kühn, Li, Stoian,
  Borovica-Gajic and Kipf, in the `utndatasystems` GitHub organisation. The
  affiliation was not read.
  Cardinality estimation means predicting how many rows a filter will keep
  before running it; for a filter that calls an LLM on every row, that
  prediction decides the query plan.
  - It has "102 hand-curated queries". "Each query intentionally contains
    exactly one semantic predicate and no relational predicates."
  - Its repository shows **acceptance to NOVAS**, the 2nd Workshop on Novel
    Optimizations for Visionary AI Systems at VLDB, on **2026-07-24**. On the
    same day it added ground-truth selectivities for gpt-5.4-nano at scale
    factor 10,000. The repository was still active on 2026-09-17.
- **Kalypso (UMass Amherst, arXiv:2607.23815, July 2026)**, a serving system
  that reuses the LLM's cached state (its KV cache) as rows pass from one
  semantic operator to the next. Its search summary claims speedups of up to
  4.57×.

**Background (out of window).**
- The **Cortex AISQL** engine paper (arXiv:2511.07663, SIGMOD Companion '26,
  held 2026-05-31 to 2026-06-05) reports three techniques. Figures are from a
  search summary.
  - AI-aware query optimisation: 2-8× speedups.
  - Adaptive model cascades, which send most rows to a cheap proxy model and
    escalate uncertain ones: 2-6× speedups at 90-95% of the stronger model's
    quality.
  - Rewriting a semantic join as classification: 15-70× speedups.
- **Larch** (arXiv:2606.07923), by Snowflake authors including Liskowski,
  Tsirogiannis and Datta, learns the order in which to evaluate several
  `AI_FILTER`s. It was submitted **2026-06-06**, 19 days before this window.
- **Google's rival mechanism** is BigQuery's "optimized mode" for `AI.IF` and
  `AI.CLASSIFY`, preview since **2026-04-22**. It "trains task-specific models
  on the fly, delivering a 230x reduction in tokens consumed compared to
  row-by-row gen AI processing".

**2. How long ago.** **2026-08-27** (27 days) for the Snowflake paper, and
**2026-07-24** (61 days) for SemCEB's acceptance. Kalypso's identifier places
it in July 2026, with the exact day not read.

**3. How it relates to what has already been read.** Nothing in `docs/research/`
covers semantic query processing. It serves **`analytics-broad`** ("the
measurement of AI systems", as confirmed by the reaction to #24). SemCEB also
touches **`benchmarks-depth`**, and is filed here because its subject is
optimisation, not accuracy. The closest earlier item is #42's item 6, DevRev's
**$0.57 per correct answer**. That figure costs a whole text-to-SQL agent. This
cluster costs the LLM call inside a query, which is the other half of the same
bill.

**4. What through-line it changes.** It adds one. Earlier briefs treated LLM
cost as a price per question. Here the cost is **per row and set by the query
plan**. How much an `AI_FILTER` costs depends on the optimiser's choice of
evaluation order and on how many rows a cheap proxy can decide. Both of those
are **invisible to the analyst who wrote the SQL**, and neither vendor prints
them in the query plan as far as this run could see. The cost of an AI query is
becoming an optimiser property, in the way that join order is.

**5. What to research next.**
- **The full text of arXiv:2608.27244.** Find the production source of the
  "80-90% of query cost" figure (which workloads and which period), whether its
  learners ship in Cortex AI Functions today, and what quality loss it reports
  against always calling the large model.
- **SemCEB's gpt-5.4-nano ground truth at scale factor 10,000**
  (`utndatasystems/SemCEB` pull request #110, 2026-07-24) and the NOVAS paper's
  results. How far off are the baseline estimators, and has any production
  engine's estimator (Snowflake's or BigQuery's) been scored on it?

**6. Source.** All from open search.
- [SemCEB repository](https://github.com/utndatasystems/SemCEB),
  [its README](https://raw.githubusercontent.com/utndatasystems/SemCEB/main/README.md)
  and [its commit history](https://github.com/utndatasystems/SemCEB/commits/main):
  **full page read**.
- [Kalypso README](https://raw.githubusercontent.com/goodluck-hojae/kalypso/main/README.md):
  **full page read**. It carries no figures.
- [arXiv:2608.27244](https://arxiv.org/abs/2608.27244),
  [arXiv:2607.23815](https://arxiv.org/abs/2607.23815),
  [arXiv:2606.07923](https://arxiv.org/abs/2606.07923) and
  [arXiv:2511.07663](https://arxiv.org/abs/2511.07663): **search summary only**.
  `arxiv.org` is on `sources.md` and **refused this run**.
- [Google's 2026-04-22 BigQuery post](https://cloud.google.com/blog/products/data-analytics/unveiling-new-bigquery-capabilities-for-the-agentic-era):
  **full page read**, used as background.

**7. Verified / inferred / assumed.**
- **Verified:** SemCEB's operator scope, query count and single-predicate
  design; its commit dates, including acceptance on 2026-07-24 and the arXiv
  link added on 2026-06-24; Kalypso's one-line description; and Google's 230×
  quote with its preview status.
- **Inferred:** that SemCEB's arXiv posting falls just **before** the window,
  from the "Add link to arXiv" commit on 2026-06-24. That is why the item is
  dated by acceptance, not by posting.
- **Inferred:** that Liskowski is at Snowflake, from his first authorship of
  the AISQL paper. The August paper's affiliations were not read.
- **Search summary only, filed as inferred:** the 2026-08-27 date, all quotes
  from the August paper, the 80-90% and 10^5-10^7× figures, every AISQL-paper
  speedup, Larch's date and authors, and Kalypso's 4.57×.
- **Assumed:** that SemCEB's `AI_FILTER`/`AI_JOIN` naming follows Snowflake's
  syntax. The README does not say whose.

---

### 4. Google and Databricks moved the same function vocabulary out of SQL, and nobody attached an accuracy number

**1. What it is.** In the window, both rivals exposed their SQL AI functions to
other interfaces, and the function sets now line up closely with Snowflake's.

**Google (BigQuery).** From the BigQuery DataFrames (`bigframes`) changelog:
- **2.44.0, 2026-06-25:** "add AI TVFs to the pandas bq accessor" (TVFs are
  table-valued functions).
- **2.45.0, 2026-07-08:** "add ai.classify, ai.score, ai.if_ to the df bq
  accessor", and "support gemini-3.x models".
- **2.47.0, 2026-08-03:** "add ai.embed and ai.similarity to bigquery accessor".

**2026-09-14:** Google's blog announced **augmented analytics table-valued
functions**: `AI.KEY_DRIVERS`, `AI.CAUSAL_EFFECT`, `ML.CORRELATION`,
`ML.DETECT_CHANGE_POINTS`, `ML.TREND` and `ML.SEASONALITY`. They are pitched
as able to be "integrated as skills for AI agents", and "all new BigQuery
augmented analytical functions are now available in Conversational Analytics".
The post gives **no availability status and no pricing**.

**Databricks.** August 2026, from search summaries only:
- "you can now call `ai_parse_document`, `ai_extract`, and `ai_classify`
  through the AI Functions REST API".
- A new `ai_extract` "precision mode" for multi-page documents and schemas with
  50 or more fields.

**How the vocabularies line up.** Snowflake's `AI_FILTER`, `AI_CLASSIFY`,
`AI_EMBED`, `AI_SIMILARITY` and `AI_PARSE_DOCUMENT` correspond to BigQuery's
`AI.IF`, `AI.CLASSIFY`, `AI.EMBED`, `AI.SIMILARITY` and `AI.PARSE_DOCUMENT`,
and to Databricks' `ai_classify`, `ai_extract` and `ai_parse_document`.

**A verified absence.** Google's running "What's new with Google Data Cloud"
log, whose latest heading is **2026-09-10**, has **no entry on BigQuery AI
functions** anywhere between 2026-06-25 and that date. The quarter's AI
function work shows up in the client library and one product blog post, not in
the vendor's own summary of the quarter.

**2. How long ago.** Spread across the window: **2026-07-08** (77 days),
**2026-08-03** (51 days), August 2026 for Databricks, and **2026-09-14**
(9 days).

**3. How it relates to what has already been read.** It serves
**`analytics-broad`**. #19's item 1 compared Snowflake's and Databricks' summit
accuracy claims (Cortex Sense's 86%, Databricks' 52%→84.5%) and found them
"vendor-run on undisclosed question sets". That comparison was about agents.
This one is about the functions under them, and it produced **no accuracy
claims at all**, which rules out even the undisclosed kind.

**4. What through-line it changes.** It adds a portability through-line, which
sits next to #42's Apache Ossie item. Ossie is trying to make a *semantic
model* portable across vendors. Here the *AI function vocabulary* has become
portable by imitation, with no standard behind it: the same names and roughly
the same signatures, but different models, billing units and optimisers. A
query that moves between warehouses keeps its syntax and loses any guarantee
that it returns the same rows. Nothing read here measures that.

**5. What to research next.**
- **Databricks' August 2026 platform release notes.** For the AI Functions REST
  API (`ai_parse_document`, `ai_extract`, `ai_classify`) and `ai_extract`
  precision mode: how the REST call is billed compared with the SQL call, and
  whether precision mode changes the price per page or per token.
- **BigQuery's "Optimize AI function costs with model distillation" page**, for
  optimized mode on `AI.IF` and `AI.CLASSIFY`. Has it left preview since
  2026-04-22, and what accuracy does the 230× token reduction cost against
  calling Gemini on every row? This is the closest competitor to Snowflake's
  model cascades in item 3.

**6. Source.** From open search; neither host is on `sources.md`.
- [`python-bigquery-dataframes` `CHANGELOG.md`](https://raw.githubusercontent.com/googleapis/python-bigquery-dataframes/main/CHANGELOG.md):
  **full page read**.
- [Google Cloud blog, "BigQuery Augmented analytics TVFs"](https://cloud.google.com/blog/products/data-analytics/bigquery-augmented-analytics-tvfs)
  (Jenny Ortiz and Haoming Chen, 2026-09-14): **full page read**.
- [Google Cloud blog, "What's new with Google Data Cloud"](https://cloud.google.com/blog/products/data-analytics/whats-new-with-google-data-cloud):
  **full page read**, for the absence.
- The [Databricks August 2026 release notes](https://docs.databricks.com/aws/en/release-notes/product/2026/august):
  **search summary only**. `docs.databricks.com` and `learn.microsoft.com`
  both refused this run.

**7. Verified / inferred / assumed.**
- **Verified:** every `bigframes` entry and date quoted; the 2026-09-14 post's
  authors, function list and the two quotes; the post's silence on pricing and
  availability; and the log's missing AI-function entries through 2026-09-10.
- **Search summary only, filed as inferred:** both Databricks items and their
  August dating.
- **Inferred:** the correspondence between vocabularies, which rests on names
  and the one-line descriptions read, not on signatures compared side by side.
- **Assumed:** that a DataFrame accessor calls the same server-side function as
  the SQL form, so it adds an interface and not a new capability. The
  changelogs do not say so.

---

### 5. The benchmark built on these functions cannot be run on the shared accounts, and its public release is smaller than its paper

**1. What it is.** **Spider 2.0-AIFunc** is, as of this run, still the only
public benchmark found that measures whether a model can write SQL *using*
Snowflake's AI functions. It was released on GitHub as a repository separate
from Spider 2.0, and that repository says four things that neither earlier
brief could read:

- **The shared accounts cannot run it.** "Snowflake accounts obtained through
  the Spider 2.0 access process do not currently have Cortex AISQL enabled."
  Evaluation needs your own credentials, with "Cortex AISQL functions enabled".
  Running it "is not cheap".
- **The public release is smaller than the paper.** The released
  `data/spider2-aifunc.jsonl` has **393 tasks across 117 databases**: "289
  `main` and 104 `diversity`" variants. The paper reports **465 instances
  across 125 databases**, and the dataset document mentions neither 465 nor
  125. The release is "task-only: the gold SQL and gold results are held out."
- **The function mix is lopsided.**

  | Function | Tasks |
  |---|---|
  | `AI_CLASSIFY` | 227 |
  | `AI_SIMILARITY` | 153 |
  | `AI_FILTER` | 148 |
  | `AI_AGG` | 66 |
  | `AI_EXTRACT` | 48 |
  | `AI_SENTIMENT` | 22 |

  That is an average of 1.69 functions per task. **`AI_COMPLETE` is not
  among them**, so the family's most general function (and the one most
  exposed to prompt variation) is not measured.
- **Scoring tolerates nondeterminism by design.** The evaluator runs the
  prediction and the gold query and "compares the result tables". It allows
  "up to two retries for transient errors" and offers a majority-of-*N* mode,
  but says "a single execution is enough for most purposes" because the
  benchmark "was verified for determinism when it was built".

The repository's last commit is **2026-07-08**. One of those commits was
"Rename project Spider2-AISQL -> Spider2-AIFunc".

**Re-checked in this run, and still true:** the Spider 2.0 README's News list
still ends at **2026-08-12**, and `xlang-ai/Spider2` has **no AIFunc folder**,
even though a search engine summary claimed it hosts the variant.

**2. How long ago.** **2026-07-07**, 78 days ago. That is the repository's
publication and the paper's submission date as #35 recorded it.

**3. How it relates to what has already been read.** It serves
**`benchmarks-depth`**, and it is a development on **#35's item 2** and on
**#42's AIFunc section**. #35 read the abstract only. #42 established that
nothing had moved. It also asked whether AIFunc runs on the suspended Spider
2.0 evaluation account, and answered "the paper does not say".

**The repository says, and the answer is stronger than either option #42
weighed.** AIFunc was never runnable on the Spider 2.0-provided accounts at
all, suspended or not. Every run needs someone's own paid Snowflake account.

**4. What through-line it changes.** It changes #35's. That brief used AIFunc's
**67-70%** as "the single best argument against" reading Spider 2.0-Snow's
96.70 as a solved problem, and #42 repeated it. Two qualifications now attach
to the number:

- **It was measured on a set larger than the one released** (465 against 393),
  and nothing read says which set the headline was computed on.
- **Nobody outside the authors can reproduce it without buying the compute**,
  and gold answers are withheld.

The argument still stands. The number it rests on is now known to be less
reproducible than it was taken to be.

**5. What to research next.**
- **The 465-versus-393 gap in Spider 2.0-AIFunc.** Using the full text of
  arXiv:2607.06229 and `Leolty/Spider2-AIFunc`'s `docs/generation.md`: which 72
  instances were dropped between paper and release, and were the paper's
  67-70% and 58.1% figures computed on 465 or on 393?
- **Whether anyone outside the authors has scored a system on Spider
  2.0-AIFunc.** Check forks, issues and pull requests on
  `Leolty/Spider2-AIFunc`, and papers citing arXiv:2607.06229. With gold
  answers held out and no leaderboard, record how an outside score would even
  be checked.

**6. Source.** From open search; `github.com` is on `sources.md` for line B,
but this repository was not.
- [`Leolty/Spider2-AIFunc` README](https://raw.githubusercontent.com/Leolty/Spider2-AIFunc/main/README.md),
  [`docs/dataset.md`](https://raw.githubusercontent.com/Leolty/Spider2-AIFunc/main/docs/dataset.md),
  [`docs/evaluation.md`](https://raw.githubusercontent.com/Leolty/Spider2-AIFunc/main/docs/evaluation.md)
  and [commit history](https://github.com/Leolty/Spider2-AIFunc/commits/main):
  **full page read**. `dataset.md` was read twice, the second time for its
  numeric lines character for character.
- [`xlang-ai/Spider2` README](https://raw.githubusercontent.com/xlang-ai/Spider2/main/README.md)
  and [repository tree](https://github.com/xlang-ai/Spider2): **full page
  read**.
- The paper's 465/125 figures come from #35 and from a search summary of
  [arXiv:2607.06229](https://arxiv.org/abs/2607.06229). `arxiv.org` refused
  this run.

**7. Verified / inferred / assumed.**
- **Verified:** the account sentence, the "not cheap" sentence, 393 tasks, 117
  databases, the 289/104 split, all six function counts, the absence of 465 and
  125 from the dataset document, the held-out gold, the scoring mechanics, the
  commit dates and the rename commit. Also verified: the unchanged News list
  and the missing AIFunc folder.
- **Inferred:** that the 465-versus-393 difference is a real reduction and not
  a counting-unit difference (for example, instances against tasks). The two
  documents use different nouns, and that is exactly what the first lead has
  to settle.
- **Inferred:** that "not currently enabled" held at release, from the
  document's wording.
- **Assumed:** that the paper's 67-70% was computed on the 465-instance set.
  Nothing read says so either way.

---

## What was dropped and why

- **Larch** (arXiv:2606.07923, Snowflake authors). This is learned ordering of
  multiple `AI_FILTER`s, and is the most on-seed paper found. It was submitted
  **2026-06-06**, 19 days before the window, so it is used as background in
  item 3.
- **The Cortex AISQL engine paper** (arXiv:2511.07663, SIGMOD Companion '26).
  It is the primary source for Snowflake's optimiser and cascades, dated
  November 2025, and is background only.
- **Snowflake's 2026 cost-control run-up:** AI Credits (2026-04-01), cost
  management for AI Functions (2026-03-02) and AI budgets (2026-04-10). All are
  out of window, and all were read as search summaries only. Used as
  background in item 2.
- **Earlier GA and preview events for the functions:** `AI_FILTER`, `AI_AGG`
  and `AI_SUMMARIZE_AGG` GA (2026-01-22); `AI_COUNT_TOKENS` GA (2026-01-27);
  `AI_CLASSIFY` for documents (2026-05-13); per-function privileges
  (2026-05-13); `AI_EXTRACT` extraction scores (2026-05-22); Gemini 3.5 Flash
  in AI Functions (2026-05-28). All are out of window.
- **Governance as its own angle.** Its in-window material was the
  encrypted-stage support for `AI_EXTRACT`/`AI_PARSE_DOCUMENT` (2026-08-20), an
  AI mode for sensitive-data classification using GPT-5 Mini (August), and the
  `AI_REDACT` wrapper. All but the last were readable only as search summaries.
  It was folded into item 1 instead of being built as an item on summaries.
- **BLIP, "Bolt-on, Verifiable Provenance for LLM-Powered Data Processing"**
  (arXiv:2608.25210, UC Berkeley, August 2026, PVLDB). It is in window and is
  the strongest governance paper found: it names the minimal input that
  reproduces an LLM's answer, and claims "over 30% higher accuracy than the
  best-performing baseline". It is not tied to any warehouse's functions, and
  it was search summary only.
- **SemPlan** (arXiv:2608.13612, 2026-08-12). It is in window, but it
  benchmarks natural-language-to-SQL architectures (22-26% answer correctness
  across four), not SQL AI functions. That fits `agent-efficacy`, not this
  seed.
- **The enterprise-usage angle.** Everything found was a vendor case study
  (Snyk's "1,250 hours a month", Penske) with no date inside the window, or a
  practitioner post readable only as a summary. One such summary, of a post on
  running Cortex in production, said "running Cortex on millions of rows per
  task is not recommended". That contradicts Snowflake's production-scale
  framing, and it could not be read to check.
- **Third-party pricing guides** (Finout, Enqurious and others). Their
  worked example (about 26,000 AI Credits, roughly $52,000, for `AI_COMPLETE`
  over a million rows on a frontier model, against about 440 credits on a small
  one, a "59x" gap) is repeated across several guides. Its origin is not cited
  and none of the guides would load, so it was dropped on substance.
- **BigQuery `AI.GENERATE` GA (2026-01-27) and optimized mode (2026-04-22).**
  Both are out of window. Optimized mode appears as background in item 3 and
  as a lead in item 4.

## What was searched for and not found

- **A published absolute accuracy figure for any Snowflake AI function**
  (`AI_FILTER`, `AI_CLASSIFY` or `AI_EXTRACT` against human labels). Searched
  Snowflake's material and the research. The nearest thing is the AISQL
  paper's cascades at "90-95% of oracle model quality", which is relative to a
  larger model, not to ground truth.
- **Any score on Spider 2.0-AIFunc from outside its authors, or a leaderboard.**
  None. The repository has had no commits since 2026-07-08. The Spider 2.0
  README's News list still ends 2026-08-12. `xlang-ai/Spider2` has no AIFunc
  folder.
- **Any BigQuery AI-function entry in Google's own quarterly log** between
  2026-06-25 and 2026-09-10. None.
- **Issues on `snowflakedb/snowpark-python` matching "ai_".** The repository's
  issue search returned "No results". No user-filed bug trail for the AI
  methods exists there.
- **A GitHub repository for Larch.** A repository search for "larch semantic
  predicates" returned zero results.
- **Whether a warehouse `AI_FILTER` is governed by the Cortex AI Gateway or by
  per-user quotas.** Nothing readable says either way (item 2).
- **A Snowflake-published per-query or per-row cost example for an AI
  function.** The only concrete figures found were third-party, and their
  source is uncited (see above).

## Which angles look most worth descending

**Item 5 first, then item 3, then item 2.**

- **Item 5 (lead: the 465-versus-393 gap).** It has the sharpest single
  question and the most direct consequence for a number this reader has
  already been told twice. It is checkable on a host that answers (GitHub),
  and it is what `benchmarks-depth` exists for.
- **Item 3 (lead: the full text of arXiv:2608.27244).** It is where the
  window's newest Snowflake-authored primary source sits, and it holds the one
  production cost figure in the whole pass.
- **Item 2 (lead: whether quotas cover warehouse AI functions).** It is the
  development on #42 that a `warehouse-agentic` reader would expect, and it
  asks the question an enterprise buyer would ask first.

Items 1 and 4 are real but shallower. Their leads are mostly "what does this
release note say", not "what does this change".

**The strongest argument against that ordering, which I went looking for:** the
two leads ranked second and third rest on hosts that **refused this run**.
`arxiv.org` holds the 80-90% paper, and `docs.snowflake.com` holds the quota
documentation. A depth run under the same egress would get no further than the
search summaries this pass already has, and would stop "thin" at level 1 by the
mode's own rule. Under that constraint, the right pick for the second and third
paths is not the most interesting lead but the one on a host that answers. That
would favour item 4's `bigframes` side and item 3's SemCEB lead, both on GitHub,
over the Snowflake paper and docs.

I did look for a reason to demote item 5 as well. The candidate was that
AIFunc's authors might have posted a corrected count or an explanation
somewhere. Nothing was found: no issue, no commit after 2026-07-08, and no News
entry.

**What would flip it:** reachable `arxiv.org` and `docs.snowflake.com` for
the depth runs. With those, item 3's paper becomes the best lead in the pass,
because it is Snowflake measuring its own production cost, and item 2's
question can be answered from the vendor's text instead of from a summary of
it.
