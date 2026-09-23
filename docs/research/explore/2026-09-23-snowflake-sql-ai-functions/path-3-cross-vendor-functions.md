# Path 3 - Cheaper per-row AI calls, and what they give up

This path starts from [breadth item 4](0-breadth.md#4-google-and-databricks-moved-the-same-function-vocabulary-out-of-sql-and-nobody-attached-an-accuracy-number),
where Google and Databricks copied Snowflake's AI function vocabulary and none
of the three vendors attached an accuracy number. It follows that item's second
lead: BigQuery's "optimized mode" (model distillation) for `AI.IF` and
`AI.CLASSIFY`, read as the cross-vendor counterpart to the Snowflake model
cascades described in item 3's background. The question underneath it: **when
a vendor makes per-row LLM calls cheap by substituting a smaller model, what
accuracy does it say it gives up, and can one vendor's figure be compared with
another's?** A research subagent produced this in auto-breadth mode. It is not
a brief on an adopted topic, and nothing in it changes the profile.

**Window:** 90 days, so items are dated on or after **2026-06-25**. Older
material appears only as marked **Background**.

---

## Level 1 - BigQuery's optimized mode against Snowflake's cascades

**Headline: optimized mode has not left preview. The window added no new
accuracy figure for it. What changed is who gets it without asking for it.**

- **Still preview, and on by default.** Five months after the 2026-04-22
  announcement, no GA was found anywhere readable. Google's own Python client
  names the distilled path the default (`"minimize_cost" (default)`). According
  to a search summary of the reference page, a table with an automatically
  maintained embedding column gets the distilled path without the query asking.
  That embedding feature went **GA on 2026-08-07** (item 1).
- **A second Google product, and a different kind of consent.** On 2026-07-02
  Google shipped the same mechanism in AlloyDB, also in preview. There the
  user switches it on explicitly, and it "falls back to the LLM" instead of
  failing the query (item 2).
- **Not comparable across vendors.** The only accuracy figures either vendor
  has published for its cheaper mode predate the window. They measure
  different things against different references on different datasets. In
  the window, the only per-function accuracy number any of the three vendors
  published was Databricks' **94.7%**, for a mode that costs *more*, not less
  (item 3).

**Background (out of window), the one figure the level's question turns on.**
Google's disclosure is a blog post of **2026-05-13** by Thibaud Hottelier and
Yannis Papakonstantinou, which summarises the SIGMOD 2026 paper arXiv:2603.15970.
The post says "proxy F1 to LLM F1 ranged from 90% to 102%" on ten of eleven
benchmarks, and 116% on the eleventh. It prints four of the eleven rows:

| Dataset | F1, proxy | F1, LLM on every row | Proxy / LLM |
|---|---|---|---|
| Amazon Reviews 10k | 0.860 | 0.739 | 1.163 |
| Banking77 | 0.700 | 0.707 | 0.990 |
| California Housing | 0.953 | 0.953 | 1.0 |
| FEVER | 0.782 | 0.853 | 0.917 |

So the answer to "what does the 230× cost in accuracy" is, as far as Google
has said: **up to about 8 points of F1 on the worst of the four benchmarks it
printed (FEVER), nothing on two, and a gain on one.** The post calls this
"about 400x less tokens" for a million-row query, not 230×, and it names the
failure cases itself. Proxies "will fail for complex prompts that require
forms of reasoning that go beyond detecting patterns in the embedding model".
They are also "not employed" at "extreme selectivity, i.e., cases of very few
TRUEs or very few FALSEs".

---

### 1. BigQuery's optimized mode is still preview, and a GA elsewhere in BigQuery now decides who runs it

**1. What it is.** Optimized mode replaces most of an `AI.IF` or `AI.CLASSIFY`
call's Gemini inferences with a small model. According to the search summaries
of Google's documentation, the model is trained during the query:

- BigQuery "selects a small representative sample of your data and calls
  Gemini to provide labels".
- It trains "an ultra-lightweight proxy model (such as logistic regression)
  just-in-time on CPU using text embeddings as features".
- It "evaluates the distilled model's accuracy against Gemini", and only then
  "promotes it to process the remainder of the dataset".
- It needs "approximately 3,000 rows" and embeddings from a single model.

Three things about it could be read in full, from Google's own client library
`bigframes`:

- **The client names the cheap path as the default.** The `if_` docstring
  reads: `"minimize_cost" (default): uses a local, distilled model to process
  the majority of rows, reducing latency and cost. "maximize_quality": always
  uses the remote LLM for inference.` `classify` takes the same two values and
  does not say which is the default.
- **The error cap switches off with it.** `max_error_ratio`, "the maximum
  acceptable ratio of row-level inference failures", "isn't supported when
  `optimization_mode` is set to `minimize_cost`". So a caller cannot both take
  the cheap path and cap how many rows fail.
- **Neither signature accepts embeddings.** `bigframes.bigquery.ai.if_` and
  `classify` take no embeddings argument. Nor does the DataFrame accessor that
  shipped in `bigframes` 2.45.0 on **2026-07-08** ("add ai.classify, ai.score,
  ai.if_ to the df bq accessor"). The client forwards `optimization_mode` only
  when it is set and otherwise leaves it out of the SQL, so the server's
  default applies.

The server's default is where the dated development sits. The `AI.IF`
reference page, read only as a search summary, lists `MINIMIZE_COST
(default)`. It describes the `embeddings` argument as "for optimized mode
(Preview)", and says that without it "the query uses standard LLM inference
for all rows **unless the table has autonomous embedding generation
enabled**". Autonomous embedding generation keeps an embedding column
maintained automatically. It was previewed on 2026-02-20 and went **GA on
2026-08-07**. The GA post (Joe Malone and Francis Lan) says: "With the General
Availability of Autonomous Embedding Generation, BigQuery manages this entirely
for you. By simply defining a column in your schema, BigQuery asynchronously
and continuously generates embeddings". **That post does not mention `AI.IF`,
`AI.CLASSIFY` or optimized mode.**

Put together: once the embedding feature went GA, any `AI.IF` call on a table
with such a column runs the distilled path unless it asks not to. Through
`bigframes`, that column is the only route to the distilled path. And the
feature that decides this is GA while the mode it switches on is still preview.

**Has optimized mode left preview?** No evidence that it has.

- The reference page, as indexed, still says "optimized mode (Preview)".
- Google's running "What's new with Google Data Cloud" log, read to its
  latest heading (September 7-10), has no entry on optimized mode,
  distillation, AI functions or autonomous embeddings anywhere after
  2026-06-25.
- The `bigframes` changelog has never mentioned the mode, from 2.40.0
  (2026-05-13) through 2.49.0 (2026-09-09).

**2. How long ago.**

- **2026-08-07**, 47 days ago, for the autonomous-embedding GA.
- **2026-07-08**, 77 days ago, for the `bigframes` accessor.

The mode itself was announced on 2026-04-22, 154 days ago (Background).

**3. How it relates to what has already been read.** It serves
**`warehouse-agentic`** (the warehouse vendors' own AI features) and the
"measurement of AI systems" reading of **`analytics-broad`**.

- **Breadth item 3** said the cost of an AI query is becoming "an optimiser
  property, in the way that join order is", and invisible to the analyst.
  This item finds the same of the *model*: which model answered a row depends
  on table DDL and a default.
- **Breadth item 4** found no accuracy numbers attached to the vocabulary. The
  mode does carry one, but it lives in a blog post rather than in the reference
  page or the client (see the Background above).

**4. What through-line it changes.** It sharpens #42's through-line, that the
vendors "shipped a meter" and not accuracy.

- **A hidden accuracy gate.** This mode ships with an accuracy gate the user
  cannot see: the query checks the small model against Gemini and, by the
  search summary, "fails with an error" if it misses a threshold that no
  readable page states.
- **The gate checks agreement, not truth.** It measures agreement with Gemini's
  labels, not with ground truth. So the most it can promise is "about as good
  as Gemini", which is itself unmeasured on the customer's data.

**5. What to research next.**

- **The `embeddings` argument text on the `AI.IF` and `AI.CLASSIFY` reference
  pages, and when it changed.** Get the verbatim "unless the table has
  autonomous embedding generation enabled" wording and the page's last-updated
  date. Establish whether that clause predates the 2026-08-07 GA or arrived
  with it, which says whether existing queries on such tables switched to the
  distilled path with no code change.
- **The error a BigQuery optimized-mode query returns when the distilled model
  is rejected.** Get the exact message, whether it reports the measured
  agreement with Gemini, and the threshold. Check that threshold against
  arXiv:2603.15970's selection rule (item 3's lead), to see whether production
  uses the paper's rule.

**6. Source.**

- From `sources.md` (`github.com`, listed), reached by search for this subject:
  - [`bigframes/bigquery/_operations/ai.py`](https://raw.githubusercontent.com/googleapis/python-bigquery-dataframes/main/bigframes/bigquery/_operations/ai.py),
    [`bigframes/extensions/core/dataframe_accessor.py`](https://raw.githubusercontent.com/googleapis/python-bigquery-dataframes/main/bigframes/extensions/core/dataframe_accessor.py),
    [`bigframes/core/compile/sqlglot/expressions/ai_ops.py`](https://raw.githubusercontent.com/googleapis/python-bigquery-dataframes/main/bigframes/core/compile/sqlglot/expressions/ai_ops.py)
    and [`CHANGELOG.md`](https://raw.githubusercontent.com/googleapis/python-bigquery-dataframes/main/CHANGELOG.md):
    **full page read**. `ai.py` was read twice, the second time for the two
    parameters' docstrings verbatim.
  - The [file's commit history](https://github.com/googleapis/python-bigquery-dataframes/commits/main/bigframes/bigquery/_operations/ai.py):
    **full page read**. It begins with an import on 2026-06-01, so it cannot
    show when the parameter was added.
- From open search (`cloud.google.com` is not on `sources.md`):
  - Google Cloud blog, [BigQuery search innovations, GA of autonomous embedding generation](https://cloud.google.com/blog/products/data-analytics/bigquery-search-innovations-unify-structured-unstructured-data)
    (2026-08-07): **full page read**.
  - [Introducing autonomous embedding generation](https://cloud.google.com/blog/products/data-analytics/introducing-bigquery-autonomous-embedding-generation)
    (2026-02-20, preview): **full page read**.
  - ["What's new with Google Data Cloud"](https://cloud.google.com/blog/products/data-analytics/whats-new-with-google-data-cloud):
    **full page read**, for the absence.
  - The [`AI.IF` reference](https://docs.cloud.google.com/bigquery/docs/reference/standard-sql/bigqueryml-syntax-ai-if),
    the [`AI.CLASSIFY` reference](https://docs.cloud.google.com/bigquery/docs/reference/standard-sql/bigqueryml-syntax-ai-classify)
    and [Optimize AI function costs with model distillation](https://docs.cloud.google.com/bigquery/docs/optimize-ai-functions):
    **search summary only**. `docs.cloud.google.com` refused, and the BigQuery
    release notes redirect there.

**7. Verified / inferred / assumed.**

- **Verified:**
  - The `bigframes` docstrings quoted, including "(default)" on
    `minimize_cost` for `if_`.
  - The `max_error_ratio` exclusion.
  - The absence of an embeddings parameter from both signatures.
  - That the compiler leaves out a `None` mode.
  - The 2.45.0 and 2.40.0 to 2.49.0 changelog dates, and that the changelog
    never names the mode.
  - The 2026-08-07 GA wording, and that the post does not mention AI
    functions.
  - The Data Cloud log's silence through September 10.
- **Search summary only, filed as inferred:**
  - The server default `MINIMIZE_COST`.
  - The autonomous-embedding clause.
  - "(Preview)" on the reference page.
  - The sample, train, evaluate and promote sequence.
  - The ~3,000-row requirement.
  - The fail-on-threshold behaviour.
- **Inferred:**
  - That the 2026-08-07 GA widened who runs the distilled path by default.
    This rests on the summarised clause, and on not knowing when the clause
    was written.
  - That optimized mode is still preview. That is an absence across three
    readable Google sources, and the release notes themselves could not be
    read.
- **Assumed:** that a `bigframes` prompt cannot carry an embedding column into
  `AI.IF` as the embeddings argument. The `PROMPT_TYPE` definition was not
  read.

---

### 2. Google shipped the same distillation in AlloyDB, as opt-in and with a silent fallback, and gave it a third savings figure

**1. What it is.** On **2026-07-02**, Google's AlloyDB blog (Darshana
Sivakumar and Pushkar Khadilkar) announced that "`ai.generate`, `ai.rank`,
`ai.if`, and `ai.forecast`—are now Generally Available". It also introduced two
accelerations, each described in the post as "in preview":

- **Smart batching.** "Up to 2,400x performance boost (processing 10,000
  rows/sec)".
- **A proxy model for `ai.if`.** "Up to 100,000 rows processed per second (a
  23,000x improvement) and costs slashed by 6,000x (down to 1/10th of a
  cent)". It is "available in preview for ai.if".

The mechanism is the one BigQuery uses: "a small, proxy model that utilizes
your embeddings and is trained on your specific LLM outputs". Two design
choices differ from BigQuery's:

- **It is explicitly opt-in.** "AlloyDB trains a lightweight proxy model on a
  sample of your data. This happens in the background when you use the
  **PREPARE** statement". The distilled model runs only on **EXECUTE**. A plain
  `ai.if` in a `WHERE` clause does not use it.
- **It degrades silently rather than failing.** "If the accuracy of the model
  is low, or if AlloyDB can't find a model, AlloyDB automatically falls back to
  using the LLM." In BigQuery the same situation is, per the search summary,
  a failed query.

The post gives **no accuracy figure** for the proxy, and it does not say what
"low" means. It links to the 2026-05-13 proxy-models post instead (see the
Background above). The word "BigQuery" does not appear in it.

**One mechanism, three multiples.** Google has now put three different savings
numbers on this technique, each with a different unit:

| Date | Product | Figure | Unit |
|---|---|---|---|
| 2026-04-22 | BigQuery | "230x reduction in tokens consumed" | tokens, no row count |
| 2026-05-13 | BigQuery (blog on the paper) | "about 400x less tokens" | tokens, "a typical one million row query" |
| 2026-07-02 | AlloyDB | "costs slashed by 6,000x" | cost, no row count |

None of the three states its baseline beyond "row-by-row" or "row-at-a-time".
None puts an accuracy figure next to its multiple.

**2. How long ago.** **2026-07-02**, 83 days ago.

**3. How it relates to what has already been read.** It serves
**`analytics-broad`** (the measurement reading), and **`warehouse-agentic`** in
a wider sense: AlloyDB is Google's operational database, not its warehouse.

It is the second Google product found running per-row distillation. Set
against breadth item 3's Snowflake cascades, it adds a third design for the
same trade (item 3's table).

**4. What through-line it changes.** It adds one: **who agreed to the cheaper
answer.** Within Google alone, the same mechanism is opt-in with a silent
fallback in AlloyDB, and on by default with a hard failure in BigQuery (item 1).
The multiples in the table cannot be ranked against each other or against
Snowflake's "2-6×", because each counts a different thing.

**5. What to research next.**

- **The baselines behind Google's 230×, ~400× and 6,000×.** For each, from the
  three posts and the cost section of arXiv:2603.15970: the row count, the
  Gemini model in the baseline, and whether "cost" includes the embedding
  generation and the labelling sample. Establish whether these are one
  measurement at three scales or three different measurements.
- **AlloyDB's "Evaluate semantic queries with AI operators" page and the
  PREPARE step.** Does AlloyDB report the proxy's measured accuracy back to the
  user before `EXECUTE`, and is that accuracy measured against the LLM's labels
  or against labels the user supplies?

**6. Source.** From open search; `cloud.google.com` is not on `sources.md`.

- Google Cloud blog, [Boost performance and lower costs with AlloyDB AI functions](https://cloud.google.com/blog/products/databases/boost-performance-and-lower-costs-with-alloydb-ai-functions)
  (2026-07-02): **full page read**.
- The [2026-05-13 proxy-models post](https://cloud.google.com/blog/products/data-analytics/more-than-100x-faster-and-cheaper-llm-powered-sql-queries-with-proxy-models)
  and the [2026-04-22 BigQuery post](https://cloud.google.com/blog/products/data-analytics/unveiling-new-bigquery-capabilities-for-the-agentic-era):
  **full page read**, used for the table.
- The InfoQ write-up (July 2026) that surfaced this: **search summary only**.
  `infoq.com` refused.

**7. Verified / inferred / assumed.**

- **Verified:**
  - The date, the authors and every quote above.
  - Both preview statements, and the GA list.
  - The PREPARE and EXECUTE mechanics.
  - The fallback sentence.
  - The absence of any accuracy figure and of the word "BigQuery".
  - All three multiples, with their units as worded.
- **Inferred:** that AlloyDB's proxy and BigQuery's optimized mode are one
  mechanism. The 2026-05-13 post says "BigQuery and AlloyDB already implement
  this optimization under the optimized mode feature", and Pushkar Khadilkar
  appears both as a co-author of the AlloyDB post and in the paper's author
  list (the author list is from a search summary).
- **Assumed:** that the 6,000× is a cost ratio against the same model called
  per row. The post does not say what it is measured against.

---

### 3. The window's only per-function accuracy number came from Databricks, for a mode that costs more, and the cheaper modes' figures do not line up

**1. What it is.** On **2026-08-18**, Databricks announced a "precision mode"
for `ai_extract`: `'precision'` is passed as the mode. According to search
summaries of the Databricks blog:

- It combines "custom-trained models for document extraction with an agentic
  harness".
- It reaches "94.7% extraction accuracy", "seven percentage points higher than
  the strongest frontier-model baseline tested, GPT-5.6 Sol".
- It was evaluated on "roughly 9,000 complex documents, including those up to
  2,000 pages and schemas with over 300 nested fields".

No price for the mode was found.

That is the only per-function accuracy figure any of the three vendors
published in the window, and it points the opposite way from this path's
subject. The vendor that published a number did so to sell a **more
expensive** mode. The two vendors that make per-row calls cheaper published
their figures before the window, in forms that cannot be set side by side:

| | Google, optimized mode / proxy models | Snowflake, AI_FILTER cascades | Databricks, `ai_extract` precision |
|---|---|---|---|
| **What replaces the LLM** | Logistic-regression-class model on embeddings; no LLM for most rows | Smaller LLM (e.g. Claude Haiku 4.5), escalating uncertain rows to a larger one (e.g. Sonnet 4.5) | Nothing is replaced; a harness is added |
| **Headline quality claim** | Proxy/LLM F1 0.90-1.02 on 10 of 11 benchmarks, 1.16 on 1 | "90-95% of oracle model quality"; F1 0.812 → 0.777 (−4.3%) on six `AI_FILTER` datasets; later, F1 ≥ 0.95 at best operating points | 94.7% extraction accuracy |
| **Measured against** | Ground truth (inferred: the proxy beats the LLM on Amazon Reviews, which only a non-LLM reference allows) | The 0.812/0.777 pair reads as ground truth; the later ≥ 0.95 reads as agreement with the oracle (inferred) | Not read |
| **Datasets named** | Amazon Reviews, Banking77, California Housing, FEVER (+7 unprinted) | Six, not named in anything read | ~9,000 documents, not public in anything read |
| **In production** | Per-call `optimization_mode`; default `MINIMIZE_COST` where embeddings exist; query fails under threshold | "By default" on qualifying `AI_FILTER` queries; "minimal impact on quality"; to disable, "contact your account manager" | Opt-in per call |
| **Dated** | Paper v6 2026-04-14; blog 2026-05-13 | Paper Nov 2025; cascades paper Apr 2026; blog 2026-05-29 | 2026-08-18 |

Three things make the cheaper modes' figures incomparable, and none is fixable
by reading harder:

- **They are relative to different models.** Google reports the proxy as a
  fraction of Gemini's F1. Snowflake reports the cascade as a fraction of
  Sonnet's (or of "oracle" quality). A 0.95 ratio against a weak reference and
  one against a strong reference are different claims.
- **They are measured on disjoint, mostly unnamed data.** No overlapping
  dataset between the two vendors was found.
- **The production checks measure agreement, not accuracy.** Per search
  summaries, BigQuery's gate compares the proxy with Gemini, and the Google
  paper selects a proxy when it is within "absolute 10%" of the LLM baseline.
  Snowflake's thresholds carry "probabilistic guarantees" relative to the
  oracle. A customer is told, at most, that the cheap answer agrees with the
  expensive one.

**The independent check that exists does not test the cheap modes.**
**SemBench** is the only benchmark found that runs a vendor's SQL AI functions
next to academic systems. It is by the `utndatasystems` group behind breadth
item 3's SemCEB, and appears in PVLDB. Its BigQuery queries call
`AI.IF(... connection_id => ..., model_params => ...)` with **no `embeddings`
argument and no `optimization_mode`**, so by Google's own rule they run Gemini
on every row. Its repository's in-window activity (2026-07-01, 07-02, 07-16) is
additions to its "Adopted By" list. The one Snowflake entry there evaluates
**Semantic Rank** (arXiv:2509.00303), not the filter that the cascades
accelerate.

Snowflake's own client offers no handle on the cascade either. Snowpark's
`DataFrameAIFunctions.filter` takes `predicate` and `input_columns` and nothing
else. `classify` adds `output_column`, `return_error_details` and `**kwargs`.
Neither mentions a proxy, a budget or a quality target.

**2. How long ago.** **2026-08-18**, 36 days ago, for Databricks. The Google
and Snowflake figures in the table are all **Background**, from 2025-11 to
2026-05-29 (117 days ago at the latest).

**3. How it relates to what has already been read.**

- It serves **`analytics-broad`**, the measurement of AI systems.
- It is the direct answer to **breadth item 4**'s "nobody attached an accuracy
  number". Someone did, once, in the window, and for the expensive direction.
- It repeats **#19 item 1**'s finding about agents at the function level:
  vendor-run numbers on undisclosed sets. There it was Cortex Sense's 86% and
  Databricks' 52% → 84.5%; here it is 94.7% on ~9,000 unpublished documents.
- **Breadth item 4's other lead** asked about the same Databricks release, for
  billing. This item uses it for accuracy only.

**4. What through-line it changes.** It adds one: **accuracy is disclosed when
it sells an upgrade, and hedged when it justifies a downgrade.** The cheap modes
come with ratios against the vendor's own larger model, on data the customer
will never see, enforced in production by an agreement check. The expensive
mode comes with an absolute percentage. Neither kind can be compared across
vendors.

It also complicates breadth item 3's "invisible optimiser" point. In Snowflake
the cheap path is invisible and switched off by a phone call. In BigQuery it is
visible as a parameter but defaults on. In AlloyDB it is opt-in.

**5. What to research next.**

- **Whether any dataset in Snowflake's six `AI_FILTER` cascade benchmarks
  (arXiv:2511.07663, arXiv:2604.00660) is among Google's eleven proxy-model
  benchmarks (arXiv:2603.15970).** A shared dataset would give the only
  like-for-like quality-loss comparison available without running both
  products. The full texts name them; `arxiv.org` refused this run.
- **Databricks' `ai_extract` precision-mode evaluation.** Which ~9,000
  documents, who labelled them, what "extraction accuracy" counts (field-level
  exact match or something looser), and the per-page price against the default
  mode, from the 2026-08-18 blog and the `ai_extract` reference page.

**6. Source.**

- Databricks, [Document Intelligence: pushing the frontier for complex document extraction](https://www.databricks.com/blog/databricks-document-intelligence-pushing-frontier-complex-document-extraction):
  **search summary only**. `www.databricks.com`, `docs.databricks.com` and
  three secondary hosts (`abilytics.com`, `releasebytes.com`,
  `startuphub.ai`) refused.
- Google's column: the [2026-05-13 post](https://cloud.google.com/blog/products/data-analytics/more-than-100x-faster-and-cheaper-llm-powered-sql-queries-with-proxy-models),
  **full page read**, read twice, the second time verbatim for the table and
  for status wording.
  [arXiv:2603.15970](https://arxiv.org/abs/2603.15970), including its "absolute
  10%" rule: **search summary only**.
- Snowflake's column: [arXiv:2511.07663](https://arxiv.org/abs/2511.07663),
  [arXiv:2604.00660](https://arxiv.org/abs/2604.00660), the
  [engineering blog](https://www.snowflake.com/en/blog/engineering/optimize-enterprise-llm-queries/)
  and the [`AI_FILTER` reference](https://docs.snowflake.com/en/sql-reference/functions/ai_filter):
  **search summary only**.
- From `sources.md` (`github.com`, listed), reached by search:
  - [Snowpark `dataframe_ai_functions.py`](https://raw.githubusercontent.com/snowflakedb/snowpark-python/main/src/snowflake/snowpark/dataframe_ai_functions.py),
    **full page read**.
  - The [SemBench README](https://raw.githubusercontent.com/SemBench/SemBench/main/README.md)
    and [commit history](https://github.com/SemBench/SemBench/commits/main),
    **full page read**.
  - Its [BigQuery runner](https://raw.githubusercontent.com/SemBench/SemBench/main/src/runner/generic_bigquery_runner/generic_bigquery_runner.py)
    and [movie `Q1.sql`](https://raw.githubusercontent.com/SemBench/SemBench/main/files/movie/query/bigquery/Q1.sql)
    and [`Q2.sql`](https://raw.githubusercontent.com/SemBench/SemBench/main/files/movie/query/bigquery/Q2.sql),
    **full page read**. These are two of the ten movie-scenario BigQuery
    files, from one of six scenarios.

**7. Verified / inferred / assumed.**

- **Verified:**
  - Google's four table rows, the "90% to 102%" and 116% wording, and the two
    failure-case quotes.
  - Snowpark's two signatures and their silence on cascades.
  - SemBench's two `AI.IF` calls with no embeddings and no mode.
  - The runner's lack of any `optimization_mode`.
  - The in-window commit titles, and the Snowflake row being Semantic Rank.
- **Search summary only, filed as inferred:**
  - Everything about Databricks precision mode, including the 2026-08-18 date.
  - Every Snowflake figure, including 0.812 → 0.777, "90-95%" and ≥ 0.95.
  - The proxy and oracle model names.
  - The "by default" and "contact your account manager" wording.
  - The "absolute 10%" selection rule.
- **Inferred:**
  - That Google's F1 is against ground truth, from a proxy trained on LLM
    labels outscoring the LLM.
  - That Snowflake's ≥ 0.95 is agreement with the oracle, from SUPG's design
    and the 0.989 mean.
  - That SemBench's other BigQuery queries follow the two read.
- **Assumed:** that no shared dataset exists between the two vendors'
  evaluations. That is the first lead above, and it has not been checked.

---

### What was dropped and why

- **Google's 2026-05-13 proxy-models post and arXiv:2603.15970** (v1
  2026-03-16, v6 2026-04-14). This is the primary accuracy disclosure for the
  whole level, 133 and 162 days old. Used as Background, not an item.
- **Snowflake's cascade record.** It comprises the AISQL paper (Nov 2025), the
  2025-09-23 `AI_FILTER` performance optimization preview, "Streaming Model
  Cascades for Semantic SQL" (April 2026) and the 2026-05-29 engineering blog.
  All are out of window, and all were read as search summaries. They are used
  as item 3's Snowflake column.
- **arXiv:2608.27244** (Snowflake, 2026-08-27, "Compositional Online Learning
  for Semantic Data Processing Systems"). This is in window and is Snowflake's
  newest work on the call boundary, but it is breadth item 3's lead, not this
  one, and it was search summary only. It is left to that line, so the two
  paths do not converge on one source.
- **"From Interpretation to Compilation"** (arXiv:2607.13407, July 2026, and
  its follow-up 2608.06677). These compile a semantic operator into code with
  one LLM call, a third way to avoid per-row calls. They are in window, but
  academic, not tied to any vendor's functions, and search summary only.
- **InfoQ's July 2026 AlloyDB write-up** and a July 2026 Google community
  Medium post on the same launch. Both are secondary to item 2's primary post,
  and both hosts refused or were not tried.
- **A critique of arXiv:2603.15970** ("no error bars, exclusion criteria,
  statistical tests") surfaced only through an automated paper-review
  aggregator's search summary. Neither a named critic nor a primary source was
  behind it, so it was dropped as unattributable.
- **The Cortex AISQL paper through a university course mirror.** Tried as a
  full-text substitute for `arxiv.org`; it refused.

### What was searched for and not found

- **A GA for BigQuery optimized mode.** Nothing in Google's Data Cloud log
  through 2026-09-10, nothing in the `bigframes` changelog, and no GA post. The
  reference page is still indexed as "(Preview)". The release notes could not
  be read.
- **The numeric quality threshold BigQuery applies before promoting a
  distilled model.** No readable or summarised Google page states it. The
  paper's "absolute 10%" is an example in a research rule, not a documented
  product setting.
- **Any accuracy figure for AlloyDB's proxy model.** None in its launch post.
  Its "low" accuracy fallback is undefined.
- **Any independent measurement of BigQuery's optimized mode or Snowflake's
  cascades.** SemBench runs BigQuery with distillation off, and its Snowflake
  adopter measured ranking. No other benchmark, paper or practitioner post was
  found that turns either cheaper mode on and scores it against ground truth.
- **A quality figure behind Snowflake's "minimal impact on quality"** on the
  default-on `AI_FILTER` optimization. None in the summarised reference page.
- **A Google sample notebook** using `optimization_mode` or `MINIMIZE_COST`.
  One open web search for the two terms with `AI.IF` and `GoogleCloudPlatform`
  returned none. GitHub's own code search was not used, because it needs
  authentication.
- **Any cascade, proxy or quality control in Snowpark's AI methods.** None.
  Read in full.
- **A price for Databricks' precision mode.** None found in search results.
