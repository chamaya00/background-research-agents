# Path 3 - What the warehouse's copy of a semantic model loses

This path comes from **item 3** of the breadth pass
([`0-breadth.md`](0-breadth.md), "Looker can now write its semantic model into
the warehouse, as a Snowflake semantic view or a BigQuery Graph"). It follows
that item's first lead: **what survives Looker's translation of LookML into
the warehouse (preview, 2026-08-28).** A research subagent wrote it in
auto-breadth mode ([`docs/reader/auto-breadth.md`](../../../reader/auto-breadth.md)).
It is not a brief on an adopted topic, and nothing in it changes the profile.
**Window:** 90 days, so items are dated on or after **2026-06-26**. Anything
older is marked **Background** and is not counted as an item.

The question underneath the path: **as the semantic layer moves down into the
warehouse, what does an agent reading the warehouse's copy lose, compared with
the BI tool's original? And does that affect how accurate the agent is?**

## Level 1 - What survives Looker's LookML-to-warehouse translation

**Looker documents what the translation needs from you. It does not document
what the translation leaves behind, with one exception, and the exception is
the part that matters most to an agent. Looker "ignores" four Explore-level
rules when it builds the warehouse copy: row-level access filters and the
Explore's standing filters among them. An agent that answers from the
Snowflake or BigQuery copy therefore answers over rows the Looker Explore
would have excluded, unless someone rebuilds those rules in the warehouse.
Beyond that, the three layers cannot hold the same set of measures. LookML
has 21 measure types. BigQuery Graph's new measures accept 6 aggregate
functions. And Looker, BigQuery Graph and Snowflake each prevent
double-counting by a different mechanism. dbt, doing the same kind of export
into Apache Ossie, publishes its losses as four named warning codes. Looker's
page says nothing about what happens to a construct it cannot translate.**

**Background: the vocabulary, for a reader new to these stacks.**

- **LookML** is Looker's modelling language. Joins, dimensions (attributes you
  group by) and measures (aggregations such as revenue) are written once as
  code.
- An **Explore** is LookML's unit of analysis: a base view plus the views
  joined to it. It is what a business user opens, and what Looker's own agent
  queries.
- A **Snowflake semantic view** is a database object, made with
  `CREATE SEMANTIC VIEW`. It declares logical tables, the relationships between
  them, facts, dimensions and metrics inside the warehouse. Snowflake's agents,
  Cortex Analyst and Cortex Agents, read it.
- A **BigQuery Graph** is a property graph in Google's warehouse. Tables become
  "node" and "edge" tables, and they are queried with GQL (graph query
  language) or with SQL.

In this stack, the semantic layer sits between the warehouse and the BI tool.
This level is about a feature that copies it downward.

---

### 1. Looker's LookML-to-warehouse translation ignores access filters and standing filters, and does not say what it does with anything it cannot translate

**1. What it is.** Looker's `derived_analytic_model` parameter has a
`model_source` subparameter. Given an existing Explore, Looker generates a
Snowflake semantic view or a BigQuery Graph from it and keeps that object
maintained in the database. The feature page says Looker "automatically
translates your Explore topology, joins, dimensions, and measures into
database-native analytic model DDL statements". DDL is the SQL that creates
database objects.

The parameter reference is the only place that lists what the translation
requires and what it discards. Its subsection "Considerations for LookML-based
derived analytic models" has **four** labelled bullets:

1. **Primary keys:** "Every view in the source Explore must have a primary key
   dimension that's defined by using `primary_key: yes`."
2. **Acyclic topology:** "The relationships that are defined by joins in the
   source Explore must form a strict acyclic tree structure." The page also
   says: "Cyclic relationships are not supported."
3. **Source view requirements:** "Views that are included in the source
   Explore must be standard database tables or persistent derived tables (PDTs)
   with a stable name." And: "Ephemeral (non-persistent) derived tables and
   views that are based on other analytic models cannot be used as sources."
   (A derived table is a table Looker builds from a query. An ephemeral one
   exists only inside the query. A persistent one is written to the
   database.)
4. **Explore parameters:** "Dynamic runtime filtering parameters
   (`sql_always_where`, `always_filter`, `access_filter`) and `sql_always_join`
   on the source Explore are ignored during analytic model generation."

A fifth requirement sits under the setup steps: "Building relationships within
an in-database analytic model strictly requires the `foreign_key` parameter on
each join in the source Explore." LookML has two ways to write a join.
`foreign_key` names one key column. `sql_on` is a free SQL condition. The page
does not mention `sql_on`.

The general "Things to consider" section covers every analytic model. It says
"The following features are not supported with analytic models:" and lists
**three** features: filtered measures, aggregate awareness, and Looker legacy
runtime. It also says "Features that rely on implicit joins aren't supported",
and names four examples: "custom calendars and fields that are defined with
`type: location`, `type: distance`, or `type: zipcode`".

**What the page does not say** is what happens when a source Explore contains
one of these things. The possibilities are an error, a skipped field, or a
field translated without its filter, and none of them is stated. The main body
never mentions Liquid (LookML's templating language), `count_distinct`, or
symmetric aggregates. It does not say whether field descriptions, labels or
synonyms are carried across.

**Why the ignored four bear on agent accuracy.**

- `access_filter` is Looker's row-level security. Per its reference, it "lets
  you apply user-specific data restrictions" by tying a field to a user
  attribute.
- `sql_always_where` and `always_filter` are filters that every query on the
  Explore gets automatically. Excluding test accounts or cancelled orders is
  the typical kind.

Snowflake's semantic views do not carry row policies of their own. Snowflake's
best-practice page says of masking and row access policies: "These policies
can't be set directly on semantic view attributes, but if they are set on
underlying tables and columns, they propagate to semantic views and are
enforced."

So the rule an agent in Looker was held to lives in the Explore. The rule an
agent reading the Snowflake copy is held to lives on the tables. The
translation does not move the first to the second. **An agent asked "revenue
last quarter" through the warehouse copy can return a different number from
the same question asked through Looker, because different rows go into it**
(inferred; see part 7).

**2. How long ago.** Looker's release notes carry, under **2026-08-28**: "Now
available in preview, you can define Looker-managed, in-database analytic
models directly from existing LookML Explores by using the model_source
subparameter." That is **27 days** before 2026-09-24.

**Background (out of window):** the preview in which Looker *reads* existing
semantic views and graphs dates from **May 2026**. Three fetches of the
release notes put that entry under three different days (05-07, 05-27 and
05-28), so no exact date is given here.

**3. How it relates to what has already been read.**

- **Filed under `semantic-models`** (90-day window; it passes at 27 days).
- It also serves **`warehouse-agentic`** (90 days) and **`dbt-context`** (30
  days). It passes both, so the filing widens nothing.

It answers the breadth pass's lead 1, and it corrects the breadth pass's note
that the feature page carries "no limitations". The feature page carries none.
The **parameter reference** does.

It is the reverse direction of **#42 item 2**. There, Snowflake's Autopilot
imports Power BI models, and #42 found no coverage figure for what survives
the import. Here the export side has a partial list, but it still has no
figure.

For the `semantic-models` line's "what it costs to build and maintain", this
is concrete effort:

- every view needs a declared primary key;
- every join must be rewritten as `foreign_key` if it was written as `sql_on`;
- every ephemeral derived table must become persistent.

That is rework on a model that already works in Looker. This is inferred as
effort; no page gives a figure.

**4. What through-line it changes.** It qualifies the breadth pass's point
that the semantic definition "is settling in the warehouse". **What settles is
the joins, dimensions and measures, not the rules.** Governance and standing
filters stay behind in the BI tool.

It also qualifies the breadth pass's inference that two agents reading one
derived view "would be comparable". They would be comparable on metric
definitions. They would not be comparable on which rows are in scope, unless
the warehouse carries equivalent policies.

**#42's GROUND paper** made security violations a headline metric. This is a
shipped path by which a governed definition can lose its row security on the
way to an agent.

**5. What to research next.**

- **What Looker does with an untranslatable construct.** Take a source Explore
  that has a filtered measure, a Liquid-templated dimension, an `sql_on` join,
  or `sql_always_where`. Does the regenerator (Looker's background process
  that builds persistent objects) error, skip the field, or translate it
  without its condition? Check the LookML validator error reference and the
  "PDT details modal" and "SQL tab" sections of the `derived_analytic_model`
  page, which show the generated DDL. If none of them says, record that
  answering it needs an engineer's spike on a preview instance.
- **Whether LookML descriptions and labels reach the agent-facing metadata.**
  Do LookML `description` and `label` become Snowflake `COMMENT` /
  `WITH SYNONYMS`, or BigQuery Graph descriptions and synonyms? BigQuery says
  its agents "can use descriptions, synonyms, and measures defined on your
  graph to improve the quality of the results". Check the analytic-models
  page, the BigQuery Graph schema docs, and any material from Snowflake's
  2026-10-21 webinar with Google Looker.

**6. Source.** From open search. `docs.cloud.google.com` is not a row in
`sources.md`; it is where the `cloud.google.com` row's docs redirect to.

- [Looker, `derived_analytic_model` parameter reference](https://docs.cloud.google.com/looker/docs/reference/param-view-derived-analytic-model):
  **full page read**, in five passes through a summarising fetch. Every
  quotation above came back as a quotation. The counts (four considerations,
  three unsupported features, four implicit-join examples) were re-asked, and
  two passes disagreed before converging; see part 7.
- [Looker, "In-database analytic models"](https://docs.cloud.google.com/looker/docs/analytic-models):
  **full page read**.
- [Looker release notes](https://docs.cloud.google.com/looker/docs/release-notes):
  **full page read** for the 2026-08-28 entry.
- [Looker, `access_filter`](https://docs.cloud.google.com/looker/docs/reference/param-explore-access-filter):
  **full page read**.
- `docs.snowflake.com` is on `sources.md`:
  [Snowflake, best practices for semantic views](https://docs.snowflake.com/en/user-guide/views-semantic/best-practices-dev),
  **full page read** for the policy sentence.

**7. Verified / inferred / assumed.**

- **Verified:**
  - the 2026-08-28 entry, verbatim;
  - the four considerations and their labels;
  - the four ignored parameters, named;
  - the `foreign_key` requirement;
  - the three unsupported features and the four implicit-join examples;
  - the absence from the page of Liquid, `count_distinct`, symmetric
    aggregates, metadata carry-over, and any statement of what happens to an
    unsupported construct;
  - Snowflake's sentence on how policies propagate.
- **Inferred:**
  - that ignoring `sql_always_where` and `always_filter` changes the numbers
    an agent returns. This follows from what the parameters do; no page says
    it.
  - that `sql_on` joins cannot be translated. "Strictly requires the
    `foreign_key` parameter on each join" implies it, but `sql_on` is never
    named.
  - that the "not supported" list, written for all analytic models, also
    constrains what the translation emits.
- **Assumed:** that a customer's Snowflake tables do not already carry row
  policies equivalent to their Looker access filters. Where they do, the
  security part of this item does not apply to them.
- **Count caution:** one fetch reported "5 bullets" and listed four. Another
  merged the implicit-join examples into the unsupported list and gave "5".
  A targeted re-read of the main body gave 4 and 3 (+4 examples).

---

### 2. BigQuery Graph gained measures that stop double-counting, and the three layers now disagree on which measures can exist at all

**1. What it is.** On **2026-08-13** Google added **measures** to BigQuery
Graph, in preview. The "Work with measures" page defines one as "an aggregate
property defined within the `PROPERTIES` clause of a node or edge table". It
states the problem measures solve with an example: when a one-to-many join
repeats rows, "the Computer Science department's budget is counted twice".
Measures "define their aggregation in reference to the `KEY` of the node or
edge table on which they're defined", so a join cannot inflate them. The
announcement post names Looker's `derived_analytic_model` as one way to
populate a graph. It says Conversational Analytics agents "navigate the
deterministic, relationship-aware map of the graph".

The page lists the aggregate functions a measure can use. There are **six**:
`SUM`, `AVG`, `COUNT`, `COUNT(DISTINCT)`, `MIN`, `MAX`. It also carries two
restrictions. "You can't reference a property defined by a measure in a GQL
query": measures are reached only through SQL's `GRAPH_EXPAND` function and
an `AGG()` wrapper. And `GRAPH_EXPAND` "doesn't accept all types of graphs":
it needs exactly one root node table.

**This matters because it is the first time the warehouse side has matched
the thing LookML is best known for.** LookML's **symmetric aggregates**
prevent miscalculating "sums, averages, and counts" across one-to-many joins.
They depend on "a unique primary key" and "the correct join relationship"
(Looker's guide; Background, last updated 2025-07-22). So the three layers
now solve double-counting in three different ways:

| Layer | Mechanism | Source |
|---|---|---|
| LookML | Symmetric aggregates, keyed on each view's primary key | Looker guide (Background) |
| BigQuery Graph | Measures locked to the `KEY` of their node or edge table | graph-measures page (in window) |
| Snowflake semantic view | Each metric is aggregated at its own table's grain before joining, per Snowflake's engineering blog ("the `SALE_MODEL` is aggregated before it is joined"; 2026-03-09, Background). A query where a dimension's table is coarser than the metric's is refused: "the base table for the dimension must have an equal or lower level of granularity than the base metric or dimension entity" | Snowflake querying guide |

**The comparison I made. No vendor documents a mapping.** Looker's measure-type
reference lists **21** measure types in three categories, and these counts
are the ones to re-check:

- **Aggregate (14):** `average`, `average_distinct`, `count`,
  `count_distinct`, `list`, `max`, `median`, `median_distinct`, `min`,
  `percentile`, `percentile_distinct`, `period_over_period`, `sum`,
  `sum_distinct`.
- **Non-aggregate (4):** `date`, `number`, `string`, `yesno`.
- **Post-SQL (3):** `percent_of_previous`, `percent_of_total`,
  `running_total`.

Set against BigQuery Graph's six functions, the 14 aggregate types fall into
three groups:

- **6 have a directly named equivalent:** `sum`, `average` (`AVG`), `count`,
  `count_distinct`, `min`, `max`.
- **2 are plausibly covered by key-locking rather than by a function:**
  `sum_distinct` and `average_distinct`. Both exist to de-duplicate before
  aggregating, which a measure locked to a key already does. This is an
  inference.
- **6 have no function in the list:** `median`, `median_distinct`,
  `percentile`, `percentile_distinct`, `list`, `period_over_period`.

The graph-measures page does not say whether a measure can be defined from
other measures (LookML's `number` type does this) or filtered (a LookML
filtered measure). Neither target has anything like the three post-SQL types.

**Snowflake is looser:** a metric is `AS <sql_expr>`. Derived metrics combine
metrics across tables ("omit `table_alias.` from the name"). There are
window-function metrics and `NON ADDITIVE BY`. The reference enumerates no
allowed functions, so median, percentile and list aggregations are likely
expressible. It has **no** clause for a filter on a metric: its
`LABELS = ( FILTER )` "can only" be set "for facts and dimensions (not for
metrics)". It has no time-grain construct comparable to LookML's
`dimension_group` timeframes, and none for row policies.

**2. How long ago.** **2026-08-13** (Google Cloud blog, Deepak Dayama and Yun
Zhang), **42 days** before 2026-09-24. The docs pages are undated. The
Snowflake engineering blog (2026-03-09) and Looker's symmetric-aggregates
guide are **Background**.

**3. How it relates to what has already been read.** **Filed under
`warehouse-agentic`** (90-day window; it passes at 42 days). It also serves
`semantic-models` (90 days, passes). Under `analytics-broad` (30 days) it
would fail, and it is not filed there.

It is the first item in these documents on how the **semantic layer's
arithmetic** differs between vendors rather than its format. #42 item 1
recorded that Apache Ossie's expression language is on the "maybe" list, and
inferred that without one, "a semantic model exchanged ... will not produce
identical results across two engines". This is that inference showing up in
shipped products: the same Explore compiled into two warehouses lands in two
different aggregation models.

**4. What through-line it changes.** It sharpens #42's portability
through-line: **a semantic model can be copied without its arithmetic being
copied.** It also moves where accuracy is decided. On Snowflake, a question
that crosses grain the wrong way is **refused** rather than miscounted. That
is safer, but an agent then has to handle the refusal.

It also opens a question the next level could close. Snowflake's
materializations page says: "Queries from Cortex Analyst, Cortex Agents, and
Snowflake CoWork that execute physical SQL directly against the underlying
tables do not benefit from semantic view materializations." If Snowflake's
agents write SQL against the tables rather than through the semantic view,
the grain protection above only holds if the agent's SQL reproduces it. That
is inferred from one sentence and is lead 1.

**5. What to research next.**

- **Whether Snowflake's agents query the semantic view or only read it.** Do
  Cortex Analyst and Cortex Agents emit SQL through the `SEMANTIC_VIEW()`
  query clause, which enforces the granularity rule, or physical SQL against
  the underlying tables? Use the Cortex Analyst docs, the materializations
  page's sentence, and the 2026-04-13 "Improved SQL generation in Cortex
  Agents" note. This decides whether the fan-out protection binds the agent.
- **Whether every Explore Looker accepts is a graph `GRAPH_EXPAND` accepts.**
  Looker requires "a strict acyclic tree". `GRAPH_EXPAND` requires exactly
  one root node table and ignores edges between dimension tables. Compare the
  two rules clause by clause and name an Explore shape that passes Looker and
  fails BigQuery (for example, an Explore that joins two fact views), or
  establish that none exists.

**6. Source.** From open search. `cloud.google.com` (blog) and
`docs.snowflake.com` are on `sources.md`. `docs.cloud.google.com` is the
redirect target of the former.

- [Google Cloud blog, "BigQuery Graphs with measures for trusted agentic workloads"](https://cloud.google.com/blog/products/data-analytics/bigquery-graphs-with-measures-for-trusted-agentic-workloads):
  **full page read**.
- [BigQuery, "Work with measures"](https://docs.cloud.google.com/bigquery/docs/graph-measures):
  **full page read**, with the function list re-read verbatim.
- [BigQuery Graph overview](https://docs.cloud.google.com/bigquery/docs/graph-overview):
  **full page read**.
- [Looker measure types](https://docs.cloud.google.com/looker/docs/reference/param-measure-types):
  **full page read**, with the table re-read row by row.
- [Looker, understanding symmetric aggregates](https://docs.cloud.google.com/looker/docs/best-practices/understanding-symmetric-aggregates):
  **full page read**, Background.
- [Snowflake, `CREATE SEMANTIC VIEW`](https://docs.snowflake.com/en/sql-reference/sql/create-semantic-view):
  **full page read**, with the grammar re-read.
- [Snowflake, querying semantic views](https://docs.snowflake.com/en/user-guide/views-semantic/querying):
  **full page read**.
- [Snowflake, materializations](https://docs.snowflake.com/en/user-guide/views-semantic/materializations):
  **full page read** for one sentence.
- [Snowflake engineering blog, "Why Do We Need Semantic Views?"](https://www.snowflake.com/en/blog/engineering/why-we-need-semantic-views/)
  (Will Pugh, 2026-03-09): **full page read**, Background.

**7. Verified / inferred / assumed.**

- **Verified:**
  - the 2026-08-13 date and preview status;
  - the six functions;
  - the KEY-locking sentence;
  - the two query restrictions;
  - the 21 LookML types and their categories (two reads agreed);
  - Snowflake's grammar, derived metrics, the `LABELS = ( FILTER )`
    restriction, the granularity rule, and the materializations sentence.
- **Inferred:**
  - the 6 / 2 / 6 split. It is my comparison of two lists, not a documented
    mapping.
  - that Snowflake metrics can express median, percentile and list. The
    grammar allows any SQL expression, but no allowed-function list was read.
  - that the absence of a time-grain construct in Snowflake matters for
    translated `dimension_group`s. Looker's examples show `timeframes` being
    used on the consuming side, but the page does not say how they translate.
- **Assumed:** that Looker translates each LookML measure into the target's
  native measure or metric object, rather than into precomputed columns. The
  page says "measures" are translated and does not say into what.

---

### 3. dbt's export into Apache Ossie publishes its own loss list: four named warning codes

**1. What it is.**

- **dbt** is the transformation layer. Its Semantic Layer defines semantic
  models, entities (join keys), dimensions, measures and metrics in YAML.
- **Apache Ossie** (#42 item 1) is the vendor-neutral format for exchanging
  semantic models between tools.

In July 2026, dbt started writing an `osi_document.json` file at parse time,
"an Ossie representation of your project's Semantic Layer". It also started
reading Ossie files placed in an `osi/` directory.

The semantic-manifest reference then says what does not make the trip:
"Not all dbt semantic layer constructs have an Ossie equivalent, so dbt emits
warnings (event code `I078`) when elements are dropped or degraded during
conversion". There are **four** codes, verbatim:

| Warning | Cause |
|---|---|
| `CONVERSION_METRIC_DROPPED` | "Conversion metrics cannot be represented in Ossie and are excluded." |
| `PRIVATE_METRIC_DROPPED` | "Private metrics are not included in Ossie output." |
| `NATURAL_ENTITY_DROPPED` | "Natural entities have no Ossie equivalent and are excluded." |
| `CUMULATIVE_SEMANTICS_LOSS` | "The metric is included, but its cumulative window and grain semantics cannot be represented." |

In practice:

- A **conversion metric** measures how many entities go from one event to
  another, such as visit to purchase.
- A **cumulative metric** is a running or windowed total.

The fourth code is the dangerous one. The metric survives under the same name
with different meaning: a running total can arrive as a plain sum. The import
side has limits too. Ossie files in installed packages are ignored, only dbt
models (not sources, seeds or snapshots) can be referenced, and "any other
version raises a parse error" beyond Ossie `0.1.0` and `0.1.1`.

**2. How long ago.** The release-notes entry is dated **July 2026**, with no
day given. That puts it **55-85 days** before 2026-09-24, depending on the day.

**3. How it relates to what has already been read.** **Filed under
`semantic-models`** (90-day window, passes). It fails **`dbt-context`**'s
30-day window at any July date, so it is not filed there. The filing is named
here so that choice is visible.

#42 item 5 reported the `osi_document.json` artifact in one sentence. #42's
recommendation named it "the first emitter" for a one-layer-two-engines
experiment. This is the first reading of what that emitter drops.

**Set beside item 1, it is the contrast this level turns on.** Two exporters
from the same quarter:

- **dbt** names each loss, with a code, at build time.
- **Looker** names prerequisites and four ignored parameters, and is silent
  on the rest.

**4. What through-line it changes.** It gives #42's "transferable" through-line
its first measured edge. There is still no coverage figure for any real
project. But there is now a **documented list of constructs** that do not
transfer. Two of the four codes, conversion and cumulative semantics, and
LookML's filtered measures from item 1, are the same family: **metrics whose
meaning depends on a filter, a window or a sequence.** Across both exporters,
that is what fails to move.

That is inferred from two lists. It is also the family an agent is most
likely to get wrong when it writes SQL itself, so it is exactly what a
semantic layer is supposed to hold. That part is assumed.

**5. What to research next.**

- **What Ossie 0.1.1 itself can express for metrics.** Read the specification
  in the `apache/ossie` repository (raw files on `raw.githubusercontent.com`).
  Does a metric carry a filter, a time grain, a window or a non-additive
  dimension? List the constructs, so the four dbt codes can be checked
  against the spec rather than against dbt's reading of it.
- **Whether any warehouse ingests `osi_document.json`, and what it drops.**
  Snowflake is an Ossie contributor, and #42 item 2's Autopilot imports Power
  BI files. Is there a documented Ossie import path into Snowflake semantic
  views or Databricks metric views, with a loss list of its own, dated after
  2026-06-26?

**6. Source.** `docs.getdbt.com` is on `sources.md` and was reached from the
list.

- [dbt release notes](https://docs.getdbt.com/docs/dbt-versions/dbt-cloud-release-notes):
  **full page read** for the July entry.
- [dbt, semantic manifest reference, Apache Ossie document section](https://docs.getdbt.com/reference/artifacts/sl-manifest):
  **full page read**, with the warning table re-read verbatim (two passes
  agreed on four codes).
- [dbt, Ossie semantic layer documents](https://docs.getdbt.com/docs/build/ossie-semantic-models):
  **full page read**.

**7. Verified / inferred / assumed.**

- **Verified:**
  - the July entry;
  - the introductory sentence and `I078`;
  - all four codes and their causes, verbatim;
  - the supported Ossie versions and the import limits.
- **Inferred:**
  - the 55-85 day range, since the entry has a month and no day;
  - the "same family" reading across dbt's and Looker's lists.
- **Assumed:** that dbt's list is complete. The docs say warnings are emitted
  "when elements are dropped or degraded". A loss dbt does not detect would
  have no code.

---

### What was searched for and not found

- **A statement of what Looker does with a construct it cannot translate**
  (error, skip, or silent loss). Not on the feature page and not on the
  parameter reference.
- **Any mention of Liquid, `count_distinct`, symmetric aggregates, or metadata
  carry-over** (descriptions, labels, synonyms) in the main body of the
  `derived_analytic_model` page. None.
- **Any independent test or write-up of Looker's `model_source` translation**
  dated after 2026-08-28. Search returned vendor docs, Snowflake's webinar
  listing (2026-10-21, not yet held), and generic LookML explainers. None
  tested the feature.
- **A row-policy, filtered-metric or time-grain clause in `CREATE SEMANTIC VIEW`.**
  None. Row policies attach only to underlying tables.
- **Whether BigQuery Graph measures can be filtered or derived from other
  measures.** Not mentioned on the measures page.
- **Databricks metric views** as a translation target. Not searched at this
  level. Looker's feature supports only BigQuery and Snowflake ("Analytic
  models are supported only for BigQuery and Snowflake connections").

### What was dropped

- **Snowflake Semantic Studio, preview 2026-08-26 (29 days).** An authoring
  surface for semantic views, and not a move of definitions between layers.
  Search summary only.
- **Snowflake semantic view materializations, public preview in release 10.24
  (2026-07-09 to 07-15, per a search summary).** A performance feature. Its
  page supplied one sentence to item 2 and is not an item itself.
- **Snowflake-Labs `semantic-model-generator`.** The earlier route from a
  Looker Explore into Snowflake "materialize[s] your Explore dataset in Looker
  as Snowflake table(s)". It flattened the Explore instead of translating it.
  The README says it "has been replaced by the native Cortex Analyst Semantic
  View Generator". Out of window (2024 dates); it is useful only as the
  contrast that Looker's route now keeps the join structure.
- **Fivetran Context Layer (2026-09-16).** Metadata connectors from Looker,
  dbt, Sigma and Power BI. The driver verified it exists. Not fetched at this
  level: it moves definitions into a catalogue, not into the warehouse's
  semantic object.
- **"Snowflake Semantic Views - and the Trap Nobody Warns You About"
  (encore.best, August 2026).** It covers semi-additive metrics with
  hypothetical examples only, and does not touch translation.

## Level 2 - Do Snowflake's agents query through the semantic view, or only read it?

**Mostly they only read it, and Snowflake's direction this quarter is toward
reading, not querying. Snowflake's own overview page says: "Currently, Cortex
Agents reads the information captured in the semantic view definition and
generates the SQL against the physical tables directly." The older product,
Cortex Analyst, does try to query through the view first. Snowflake calls this
"Routing Mode", and says it "only results in semantic SQL for about 10% of
queries, in aggregate". On 2026-08-28 Snowflake told customers to move from
Cortex Analyst to Cortex Agents. The transition note says nothing about the
difference: it says only that Agents "uses the same semantic views for SQL
generation". (*Corrected at level 3:* it also says Agents "uses Cortex
Analyst as its tool for querying structured data"; see Level 3 item 2.) So the protections Level 1 item 2 credited to the Snowflake
semantic view bind an agent only as instructions in a prompt. Those are the
grain refusal that prevents double-counting, the declared join paths, and the
metric formulas. None of them is enforced by the query engine. Two other
in-window notes point the same way. Agent lineage (2026-09-02) draws the
agent's data as flowing table -> semantic view -> agent, but a role running an
agent must hold `SELECT` on the tables themselves. Semantic view
materializations (July) are documented as unavailable to agent queries that
"execute physical SQL". This is the opposite of the deterministic-compilation
pattern #35 and #42 landed on. Snowflake built that pattern, measured it at
about one query in ten, and is steering customers to the path that does not
use it.**

**Background: terms used below.**

- **Semantic SQL** is Snowflake's name for a query that goes *through* a
  semantic view. Either it uses the `SEMANTIC_VIEW(...)` clause, which names
  dimensions and metrics rather than tables and joins, or it is standard SQL
  written against the view with `AGG()` around each metric. The engine
  expands it into real SQL from the view's definitions, and in doing so
  enforces the view's rules. This is what #35 and #42 called deterministic
  compilation: the model picks *which* metrics and dimensions it wants, and
  the model does not write the joins and aggregations itself.
- **Physical SQL** is ordinary SQL written against the underlying tables. When
  an agent writes physical SQL, the semantic view's definitions reach the
  answer only if the model copies them correctly into what it writes.
- **Cortex Analyst** is Snowflake's text-to-SQL service. **Cortex Agents** is
  its agent layer, which calls tools (Analyst-style SQL generation among
  them). The breadth pass, item 1, explains both.

---

### 1. Snowflake's recommended agent writes physical SQL, and the product it is replacing is the one that tries to go through the semantic view

**1. What it is.** Snowflake now documents two different paths from a
question to SQL. They behave differently.

**Cortex Analyst: semantic SQL first, then fallback.** The Routing Mode page
says: "Routing Mode is a query-generation strategy that prioritizes semantic
SQL and falls back to standard SQL only when needed." It also says: "Cortex
Analyst automatically uses Routing Mode when generating based on a semantic
view." Its "How it works" section has three steps:

1. Cortex Analyst uses Routing mode in the playground, API, and all product
   surfaces.
2. Cortex Analyst tries to produce semantic SQL: `SELECT … FROM SEMANTIC_VIEW(...)`.
3. If unable to produce valid semantic SQL within timeout, it routes to
   standard SQL on physical tables.

The page then gives the figure: "Routing Mode only results in semantic SQL for
about 10% of queries, in aggregate. This number varies depending on the level
of coverage the metrics defined in the semantic view have." The page also
shows what the semantic path returns. These are **Snowflake's own published
examples** of what Cortex Analyst generates. For the question "Average order
value by customer segment.":

```sql
SELECT *
FROM SEMANTIC_VIEW(
  tpch_analysis
  DIMENSIONS customer.customer_market_segment
  METRICS orders.order_average_value
)
ORDER BY customer_market_segment;
```

And for "Show total revenue and order count by year.":

```sql
SELECT *
FROM SEMANTIC_VIEW(
  tpch_analysis
  DIMENSIONS orders.order_year
  METRICS orders.total_revenue, orders.order_count
)
ORDER BY order_year;
```

Snowflake states the benefit as "Consistent metrics: Queries use definitions
from semantic views, not SQL". It also lists "Safer defaults: Dimensions,
metrics, and joins come from governed metadata". Routing Mode is still
labelled a preview feature.

**Cortex Agents: physical SQL.** The semantic-views overview page, under "Why
use semantic views?", says: "For AI applications: Semantic views improve
accuracy by combining LLM reasoning with rule-based definitions. Currently,
Cortex Agents reads the information captured in the semantic view definition
and generates the SQL against the physical tables directly." The only example
of agent SQL that Snowflake publishes is on the Agents Run API page, and it is
cut short in the source itself: `"sql": "WITH __table_a AS (...) SELECT ..."`.
That is a chain of named subqueries (`WITH` clauses), not a `SEMANTIC_VIEW`
call. The two agent-execution tool blocks on that page are named
`system_execute_sql`.

**The recommendation.** The 2026-08-28 note says "Snowflake recommends
transitioning to Cortex Agents, which supports every Cortex Analyst capability
with higher answer quality". That banner now also sits at the top of the
Routing Mode page. The note's only sentence on how SQL is made is "Cortex
Agents uses the same semantic views for SQL generation, so you don't need to
rebuild your semantic layer." It does not mention Routing Mode, semantic SQL,
the `SEMANTIC_VIEW` clause or physical tables.
*Corrected at level 3:* that is not the note's only sentence on how SQL is
made. Just before it, the note says "Cortex Agents uses Cortex Analyst as its
tool for querying structured data, so the transition is a change to how you
invoke it rather than a rebuild". That sentence says Cortex Analyst is still
in the loop. The 2026-04-13 note, per search summaries, says the opposite. See
Level 3 item 2.

**Background (out of window).**

- **2025-11-14:** Routing Mode entered preview.
- **2026-04-13:** "Improved SQL generation in Cortex Agents". Per search
  summaries of that note, agents that use semantic views "now generate SQL
  directly, rather than delegating SQL generation to the Cortex Analyst
  service as a separate step". Blocks of type `cortex_analyst_text_to_sql` were
  replaced by `system_execute_sql`. **This is most likely the point where the
  agent path left Routing Mode behind** (inferred: the note's body could not
  be read, and no page states the sequence).

**2. How long ago.** The transition note is dated **2026-08-28**, **27 days**
before 2026-09-24. The overview page and the Routing Mode page are undated.
The overview page lists Semantic Studio (preview 2026-08-26) among its
interfaces, and the Routing Mode page carries the 2026-08-28 banner. So both
were edited inside the window (inferred from their contents; neither page
carries a date). The 2025-11-14 and 2026-04-13 notes are **Background**.

**3. How it relates to what has already been read.**

- **Filed under `semantic-models`** (90-day window; it passes at 27 days). The
  question it answers, whether a semantic query is compiled or the model
  writes SQL, is the pattern that topic was opened for.
- It also serves **`warehouse-agentic`** (90 days, passes).

It answers Level 1 item 2's first lead. Level 1 put Snowflake's grain rule in
its comparison table as the way Snowflake prevents double-counting. That rule
is enforced only on semantic SQL, so on the agent path it is guidance, not
enforcement.

It also sharpens the breadth pass's item 1. That item described Cortex
Analyst as turning "a question into one SQL query against a semantic view".
Per the Routing Mode page, that holds for about one question in ten. The rest
is SQL against the tables, written with the view as context.

**It bears directly on #35 and #42.** Both landed on deterministic
compilation: the model emits a semantic query and a compiler turns it into
SQL. `SEMANTIC_VIEW()` is that pattern, shipped by a warehouse vendor. The
vendor's own figure for how often its model manages to use it is **about
10%**. #35's counter-argument was that every accuracy number it read was
measured on questions a semantic layer had been built to answer. This is the
same problem from the other side: the figure depends on "the level of
coverage the metrics defined in the semantic view have".

**4. What through-line it changes.** It qualifies the breadth pass's
through-line that the semantic definition "is settling in the warehouse". **The
definition settles there. On Snowflake's recommended path, its enforcement
does not reach the agent.** At query time the semantic view acts as a prompt
for the agent, not as a compiler. It also qualifies path 1's reading of the
"higher answer quality" claim (breadth item 1): whatever produced that quality,
Snowflake got it by letting the model write SQL, not by holding it to the
view. The second half of that sentence is inferred.

**5. What to research next.**

- **Whether the agent path can ever emit `SEMANTIC_VIEW()`.** Is there a
  setting, tool type or orchestration instruction in Cortex Agents' tool
  specification ("Create and manage agents", the agent object's `tools` and
  `tool_resources` reference) that turns on Routing Mode or semantic SQL for
  an agent? Is there any Snowflake-published `system_execute_sql` example with
  the SQL shown in full rather than cut to `WITH __table_a AS (...)`? The
  2026-09-16 "Cortex Agents object enhancements" note is the in-window place
  to start.
- **What the "about 10%" is measured over.** Over which accounts, questions
  and period? Does Snowflake publish how the share rises with metric
  coverage? The one candidate source is a Snowflake talk at the University of
  Washington's 2026 Database Day, "Snowflake Semantic View: Unlocking
  Efficient and Trusted AI-powered BI" (slides by Li Gao). This run could
  reach the PDF but could not extract its text. The brief is to extract it and
  record every figure on semantic-SQL share and accuracy.

**6. Source.** From open search. `docs.snowflake.com` is on `sources.md`.

- [Snowflake, Routing Mode for Cortex Analyst](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-analyst/cortex-analyst-routing-mode):
  **full page read**, in four passes. The 10% sentence, the three steps, both
  code blocks with their captions, and the Considerations section were
  re-asked verbatim.
- [Snowflake, overview of semantic views](https://docs.snowflake.com/en/user-guide/views-semantic/overview):
  **full page read**. The "Currently, Cortex Agents ..." sentence was re-asked
  verbatim with its surrounding paragraph and heading.
- [Snowflake release note, 2026-08-28 transition](https://docs.snowflake.com/en/release-notes/2026/other/2026-08-28-cortex-analyst-transition-cortex-agents):
  **full page read**, with the SQL-generation sentence re-asked verbatim and
  the absence of the other terms confirmed.
- [Snowflake, Cortex Agents Run API](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-agents-run):
  **full page read**. The example SQL is cut short on the page itself.
- [Snowflake release note, 2025-11-14 Routing Mode preview](https://docs.snowflake.com/en/release-notes/2025/other/2025-11-14-cortex-analyst-routing-mode):
  **full page read**, Background.
- [Snowflake release note, 2026-04-13 "Improved SQL generation in Cortex Agents"](https://docs.snowflake.com/en/release-notes/2026/other/2026-04-13-cortex-agents-agentic-analyst):
  **search summary only**, Background. It returned a navigation shell on
  three routes.

**7. Verified / inferred / assumed.**

- **Verified:**
  - the Routing Mode definition, its three steps, the 10% sentence, both
    examples and their questions, and its preview status;
  - the overview's "Currently, Cortex Agents ..." sentence;
  - the transition note's SQL-generation sentence, and its silence on the
    difference between the two paths;
  - the abbreviated `WITH __table_a` example and the `system_execute_sql`
    block name.
- **Search summary only, filed as inferred:** the 2026-04-13 note's wording.
- **Inferred:**
  - that the 2026-04-13 change is when agents stopped using Routing Mode;
  - that both undated pages were edited inside the window;
  - that "higher answer quality" came from free SQL generation rather than
    from the view.
- **Assumed:**
  - that "Currently" on the overview page describes today's behaviour, not a
    sentence left over from before an update;
  - that Snowflake's aggregate 10% is representative of a typical customer's
    view. The page itself says it varies with coverage.

---

### 2. Snowflake's new agent lineage draws the data path through the semantic view, but the agent's role has to be able to read the tables directly

**1. What it is.** On **2026-09-02** Snowflake added agents to its data
lineage graph. Lineage is the catalogue's record of which objects feed which.
The note reads, verbatim:

- "You can now use data lineage to see which data a Cortex Agent can reach
  through the tools declared in its specification."
- "A semantic view that a Cortex Analyst tool references, and a Cortex Search
  service that a Cortex Search tool references, both appear upstream of the
  agent."
- "Because a semantic view is itself downstream of the tables it references,
  you can trace the whole path from a table, through the semantic view, to the
  agent that consumes it."
- "Snowflake records these relationships when you create an agent or commit a
  new version ..."

So lineage is drawn from the agent's **declared tools**, when the agent is
defined. It is not drawn from the SQL the agent runs.

**The access rules say the executed path is different.** For an ordinary
query, a semantic view behaves like a standard view. The querying guide says:
"To query a semantic view, you don't need the SELECT privilege on the tables
used in the semantic view. You only need the SELECT privilege on the semantic
view itself." For an agent, the best-practices page says, under "Limit access
with masking policies and row access policies": "Cortex Agents that use
semantic views require the role that is executing queries to have SELECT
privilege on both the semantic view and its underlying tables."

That extra grant is what physical SQL needs (inferred; the page gives no
reason). **The practical consequence is that a semantic view cannot serve as
an agent's access boundary.** A standard view can: a role can be given the
view and not the table. An agent's role must be given the tables. Nothing read
here says the agent's SQL is checked against the columns the view exposes.

Snowflake's MCP-server page warns in the same direction. MCP is the Model
Context Protocol, by which outside AI clients call Snowflake tools. Under
"Configure tool types" it says: "Exposing `SYSTEM_EXECUTE_SQL` on the same
server allows the MCP client to bypass the agent's semantic views, verified
queries, and orchestration". It advises putting direct SQL on "a separate MCP
server with a dedicated least-privileged role."

**2. How long ago.** **2026-09-02**, **22 days** before 2026-09-24. The
best-practices, querying and MCP pages are undated.

**3. How it relates to what has already been read.** **Filed under
`warehouse-agentic`** (90 days, passes). It also serves `semantic-models`
(90 days, passes).

It revises part of **Level 1 item 1**, without contradicting it. That item
found that Looker drops its access filters when it builds the warehouse copy,
and that Snowflake's row policies "can't be set directly on semantic view
attributes" and must sit on the tables. This item shows why the tables are the
only place they could work for an agent. The agent's SQL goes to the tables,
so a policy on the tables applies to it, and a rule held only in the semantic
view would not. Level 1's advice to rebuild access filters as table policies
is therefore required, not merely advisable. That last point is inferred.

It also bears on **#42's GROUND paper**, which made security violations a
headline metric. Here, the permission an agent needs is wider than the
permission a person querying the same semantic view needs.

**4. What through-line it changes.** It adds one point to this path's
through-line: **what a governance screen shows about an agent is its
configuration, not its execution.** Lineage says the agent is downstream of a
semantic view. Execution says it reads tables that the role must be able to
read. Anyone who audits an agent from the lineage graph sees the governed path
and not the actual one. That is inferred from the note's wording ("declared in
its specification") and the privilege rule. No page puts the two side by side.

**5. What to research next.**

- **Whether Snowflake's access history records the tables an agent's SQL
  actually touched.** `ACCESS_HISTORY` is the account-usage view listing the
  objects each query read. For a `system_execute_sql` query, does its
  `base_objects_accessed` list the underlying tables, and does anything link
  that query back to the agent and the semantic view it declared? Check the
  `ACCESS_HISTORY` reference and the Data Lineage guide the 2026-09-02 note
  links to.
- **Whether agent SQL is limited to the columns the semantic view exposes.**
  The agent's role holds `SELECT` on whole tables. Can an agent's generated
  SQL read a column the view does not declare, or one the view marks
  `PRIVATE`? Check the Cortex Agents access-control section, and the
  semantic-view docs on private facts and metrics. If neither says, record
  that answering it needs an engineer's spike.

**6. Source.** From open search. `docs.snowflake.com` is on `sources.md`.

- [Snowflake release note, 2026-09-02 "Data lineage for Cortex Agents"](https://docs.snowflake.com/en/release-notes/2026/other/2026-09-02-cortex-agent-lineage):
  **full page read**, with all four sentences re-asked verbatim.
- [Snowflake, best practices for semantic views](https://docs.snowflake.com/en/user-guide/views-semantic/best-practices-dev):
  **full page read** for the privilege and policy sentences.
- [Snowflake, querying semantic views](https://docs.snowflake.com/en/user-guide/views-semantic/querying):
  **full page read**, with the privileges section re-asked verbatim.
- [Snowflake-managed MCP server](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-agents-mcp):
  **full page read** for the warning.

**7. Verified / inferred / assumed.**

- **Verified:**
  - all four lineage sentences, and that lineage is drawn from declared tools;
  - both privilege sentences (view-only for a query, view and tables for an
    agent);
  - the MCP bypass warning.
- **Inferred:**
  - that the table grant exists because agent SQL is physical;
  - that a semantic view therefore cannot bound an agent's access;
  - that lineage misrepresents the executed path.
- **Assumed:** that Snowflake has no enforcement step, unread here, that
  checks agent SQL against the semantic view's declared objects before it
  runs. None was found, but a check that exists and is not documented would
  change this item.

---

### 3. Features built on the semantic view's query path do not reach the agent, and the one documented guard on the physical path belongs to the retired product

**1. What it is.** Snowflake's semantic view materializations entered public
preview in July 2026. They are precomputed dimensions and metrics that the
query planner can read instead of the base tables. The page carries this note,
verbatim:

> "Semantic view materializations benefit queries executed as Semantic SQL
> (via the SEMANTIC_VIEW construct or standard SQL against a semantic view).
> Queries from Cortex Analyst, Cortex Agents, and Snowflake CoWork that execute
> physical SQL directly against the underlying tables do not benefit from
> semantic view materializations."

(Snowflake CoWork is the business-user chat product, formerly Snowflake
Intelligence.) The performance point is outside this reader's interests. It
is included for what it admits: **a semantic-view feature is available to an
agent only if the agent's query goes through the view.** Snowflake's docs name
three things that exist only on that path:

| Only on the semantic-SQL path | Source |
|---|---|
| The grain rule: "the base table for the dimension must have an equal or lower level of granularity than the base table for the metric" | querying guide |
| Materializations | materializations page |
| Subqueries inside a semantic query. Even here the agent is excluded: "Cortex Analyst does not generate semantic SQL queries that use subqueries. Subqueries are available only in manually authored queries." | querying guide |

**What guards the physical path.** One Snowflake source describes a check on
generated physical SQL. Snowflake's engineering blog of **2025-02-20**
(Yahia Bsat, Background) describes Cortex Analyst checking its generated SQL
against a "granularity graph". It says: "If an additive aggregate appears
above the root node (like in `orders` here), a fan trap is detected." Such a
detection triggers what it calls an "error correction module". A fan trap is
the double-counting that Level 1 item 2 described. The post is about
**Cortex Analyst**. **Nothing read here says whether Cortex Agents' own SQL
generation, since 2026-04-13, runs the same check.**

One more gap follows from item 1. Routing Mode falls back to physical SQL "if
unable to produce valid semantic SQL". The grain rule works by refusing a
query. So a question the semantic view refuses as a fan-out may be answered
anyway, by the physical-SQL fallback (inferred; the page does not say whether
a refusal counts as "unable to produce valid semantic SQL").

**2. How long ago.** Public preview in **release 10.24, 2026-07-09 to
2026-07-15**. That date comes from a search summary; the page itself is
undated. That puts it **71-77 days** before 2026-09-24. The 2025-02-20 blog
is **Background**.

**3. How it relates to what has already been read.** **Filed under
`semantic-models`** (90 days, passes at either end of the range). Cost and
performance are not the reason for filing; the item is filed for which
protections bind the agent.

Level 1 dropped this feature as "a performance feature" and used only its
sentence on Cortex. This item keeps the feature dropped and takes its note as
evidence. Together with item 1, it completes Level 1 item 2's table: **each of
the three layers' anti-double-counting mechanisms must be asked a second
question: does the vendor's own agent go through it?** For Snowflake, the
answer is: only in about 10% of Analyst queries, and apparently never for
Agents.

For **#35 and #42**, it shows the cost of *not* compiling. Every capability
added to the compiler is a capability the free-SQL agent lacks unless the
model reproduces it.

**4. What through-line it changes.** It names a split inside one product. **A
Snowflake semantic view is now two things: a query engine for BI tools and
hand-written SQL, and a prompt for Snowflake's agents.** Features added to the
first do not reach the second. That is inferred from three documented
exclusions. No page states it as a principle.

**5. What to research next.**

- **Whether Cortex Agents' direct SQL generation keeps Cortex Analyst's
  fan-trap and chasm-trap check.** A chasm trap is double-counting across two
  one-to-many branches. Look for a 2026 Snowflake engineering-blog post on
  agent SQL generation, the Cortex Agents limitations or known-issues pages,
  and the 2026-04-13 note's body by another route: the driver's fetch, or a
  cached copy. If nothing says, the test is a spike. Ask an agent a question
  that crosses grain the wrong way, and inspect the `system_execute_sql` block.
- **What Routing Mode does when semantic SQL is refused on grain.** Does a
  `SEMANTIC_VIEW` query that fails the granularity rule trigger the fallback,
  so that the question is answered in physical SQL? Or is the refusal
  returned to the user? Check the error text in the querying guide, and
  Routing Mode's "Considerations" ("If the semantic view cannot satisfy a
  question, Cortex Analyst falls back to Standard SQL"). If neither says, it
  needs a spike on one question against the TPC-H example view.

**6. Source.** From open search. `docs.snowflake.com` and `snowflake.com` are
on `sources.md`.

- [Snowflake, semantic view materializations](https://docs.snowflake.com/en/user-guide/views-semantic/materializations):
  **full page read**, with the note re-asked verbatim and its section heading
  checked.
- [Snowflake, querying semantic views](https://docs.snowflake.com/en/user-guide/views-semantic/querying):
  **full page read**, with the subquery note re-asked verbatim.
- [Snowflake engineering blog, "Preventing Join Hallucinations and Double Counting"](https://www.snowflake.com/en/blog/engineering/snowflake-cortex-analyst-introducting-joins-complex-schemas/)
  (Yahia Bsat, 2025-02-20): **full page read**, Background.
- The release-10.24 date: **search summary only**, carried from Level 1.

**7. Verified / inferred / assumed.**

- **Verified:**
  - the materializations note, verbatim;
  - the grain rule and the subquery note;
  - the 2025 blog's fan-trap sentence, and that the post concerns Cortex
    Analyst only.
- **Search summary only:** the July preview date.
- **Inferred:**
  - that a semantic view is "two things";
  - that a grain refusal may be answered through the fallback.
- **Assumed:** that the three documented exclusions are representative, and
  that there are no documented features that *do* bind agent SQL. None was
  found.

---

### What was searched for and not found

- **Any Snowflake-published example of Cortex Agents' SQL in full.** The only
  one, on the Run API page, is cut short to `WITH __table_a AS (...) SELECT ...`
  in the source. The Cortex Analyst REST API page's only SQL example is
  `SELECT * FROM table`.
- **Any statement that Cortex Agents uses Routing Mode or emits
  `SEMANTIC_VIEW()`.** Checked in the Cortex Agents overview, the Run API
  page, the Routing Mode page, the transition note, and the "Using semantic
  views" page. None says so, and the overview page says the opposite.
- **The body of the 2026-04-13 note.** It returned a navigation shell at the
  `/en/` URL, at the URL without `/en/`, and on the 2026 feature-release
  index. The Internet Archive could not be fetched. A public GitHub source for
  Snowflake's docs was not searched for.
- **Any in-window release note that changes how Cortex Agents or Cortex
  Analyst generates SQL, or how either handles row access policies.** The
  2026 index lists 2026-08-26, 09-02, 09-16 and 09-21 notes for Cortex
  Agents, and 2026-08-28 for Analyst. The 08-28 and 09-02 notes were read in
  full and do not change SQL generation. The 09-16 and 09-21 notes were seen
  only as titles or a search summary, and nothing in either suggests they do.
- **A published critic.** No one outside Snowflake was found testing whether
  agent SQL respects semantic-view grain or join paths. One practitioner post
  in the right area could not be read (see "What was dropped").

### What was dropped

- **"I Built Four Cortex Agents on a Semantic Layer - Here's Where the
  Governance Actually Lives"** (Satish Kumar, Medium, June 2026). The host
  refused the fetch. Its day in June is unknown, so it may fall outside the
  window.
- **Seemore Data, "Snowflake Cortex Analyst Guide"** (Yaniv Leven,
  2026-03-19). Background. It repeats the Routing Mode page's fallback
  sentence and 10% figure with no further source.
- **Snowflake's "Build Agentic Analytics with Semantic Views" guide.** Its
  `SEMANTIC_VIEW` example is hand-written for the tutorial, not returned by an
  agent, so it is not evidence of what an agent emits.
- **2026-06-26, "SQL queries as logical tables in semantic views" (GA).**
  Exactly 90 days old. The note returned a shell, and its title concerns how
  views are defined, not how agents query them.
- **Atlan's enterprise guide to semantic views.** Search summary only. It says
  Cortex Analyst "generates SQL against physical tables", which is true for
  about 90% of queries per Snowflake and not for all of them. It is not used.

## Level 3 - Does Cortex Agents keep Cortex Analyst's fan-trap and chasm-trap guard?

**Nothing moved inside the window, and nothing published answers the
question. That silence is the finding. Snowflake describes Cortex Analyst's
protection against double-counting as three separate mechanisms:**

- **a join rule:** Analyst "will not join tables unless relationships are
  explicitly defined in the semantic view";
- **a checker that runs on the SQL Analyst generates:** it detects fan traps
  and rejects chasm traps. It is described only in a 2025 engineering blog;
- **the semantic-SQL engine:** it refuses a query that crosses grain the
  wrong way.

**Snowflake's documentation pages use the words "fan trap", "chasm trap" or
"double counting" nowhere. Its Cortex Agents pages mention joins only
indirectly. They also disagree about whether Cortex Analyst still sits in the
agent's SQL path:**

- the 2026-04-13 note says agents no longer delegate SQL generation to the
  Analyst service;
- the 2026-08-28 transition note says agents use "Cortex Analyst as its tool
  for querying structured data".

**Neither note says whether the checker went with the name. The only guard
Snowflake names on the agent path is the model's own self-correction "if the
SQL errors or returns unexpected results". A fan-trap total produces neither
an error nor an obviously unexpected number. The one Snowflake-published
sentence that answers the question beneath this lead is Background: an
engineer's blog from March. It says querying a view "ensures deterministic
results", while agents use it "as a grounded framework". So the best reading
of what is published is this: on the path Snowflake now recommends,
double-counting is prevented by the prompt, with any checker unconfirmed.
Only a spike can settle it.**

**Background: terms used below.**

- A **fan trap** is a one-to-many join that repeats rows, so a sum taken
  after the join is inflated. An order's shipping fee is repeated on each of
  its five line items and summed five times.
- A **chasm trap** is two one-to-many branches meeting at one table, such as
  invoices and reservations both joined to one customer. The two branches
  multiply each other's rows.
- A **primary key** is the column that identifies each row uniquely. Snowflake
  semantic views use it to work out which side of a join is "one" and which is
  "many".

---

### 1. Cortex Analyst's double-counting protection is three mechanisms, and only one of them is in a documentation page

**1. What it is.** Pieced together from Snowflake's own pages, Cortex Analyst
has three separate guards. They differ in who enforces them.

**(a) Declared joins only. Enforced by the service and by the view's
definition.**

Snowflake's best-practices guide for semantic views says: "Cortex Analyst will
not join tables unless relationships are explicitly defined in the semantic
view." The YAML specification for semantic views says how the direction of a
join is now known:

- "Semantic views do not require the `join_type` or `relationship_type`
  fields that were used in legacy semantic models."
- "The relationship type (one-to-one, many-to-one) is automatically inferred
  from the data and primary key definitions."
- "One-to-one relationships are inferred automatically when both sides of a
  relationship have the join column declared as part of the primary key."

So the older explicit `many_to_one` / `one_to_one` declarations have been
replaced by inference from primary keys. The legacy "semantic model
specification" URL now redirects to the semantic-views overview, so the old
wording is no longer on the docs site.

The validation-rules page adds two structural limits:

- "You cannot define circular relationships, even through transitive paths".
- "You can define multiple relationships between two tables, but there are
  limitations".

The Cortex Analyst page states the claim that rests on all this, under "Why use
Semantic Views with Cortex Analyst?": "Join paths are predefined, ensuring
correct multi-table queries".

**(b) A checker on generated SQL. Enforced by the Analyst service, documented
only in a blog.**

Snowflake's engineering post of 2025-02-20 (Yahia Bsat) describes a
"granularity graph". In it, "Directed edges indicate many-to-one joins defined
in the semantic model" and "Loops (connecting nodes to themselves) each
represent a one-to-one relationship".

- On fan traps it says "Additive aggregates (e.g., `SUM`, `AVG`, `COUNT`)
  should only be applied at the lowest granularity node".
- On chasm traps: "we see three nodes — with two edges converging on the
  nation node — and both source nodes are contributing aggregated measures.
  This pattern signals a chasm trap, leading to the query rejection."
- On what happens next: "If validation errors are encountered, trigger the
  error correction module".

A join the graph has no edge for is flagged "as hallucinated".

**(c) The semantic-SQL engine. Enforced by the database.** The querying guide's
grain rule, and its error text: "The dimension entity 'ORDERS' must be related
to and have an equal or lower level of granularity compared to the base metric
or dimension entity 'CUSTOMER'." This applies only to the roughly 10% of
queries that Routing Mode sends through `SEMANTIC_VIEW()` (Level 2 item 1).

**Which pages name the traps.** The full-page reads below were searched for
"fan trap", "chasm trap" and "double counting":

- the YAML spec;
- the validation-rules page;
- the querying guide;
- the Cortex Analyst page;
- the semantic-view best-practices page;
- the Routing Mode page.

None of them contains any of the three phrases. The traps are named only in
the 2025 blog and in the March 2026 blog cited in item 2.

**One more finding, from the best-practices guide's answer on many-to-many
relationships:** "Currently, these are not directly supported. Workaround:
create a shared dimension table to bridge the gap. This allows two many-to-one
relationships to simulate many-to-many behavior." By the 2025 blog's own
definition, "two many-to-one join paths converge on a single table" is a chasm
trap. **So Snowflake's recommended workaround builds exactly the shape its
checker exists to reject.** That is safe where the checker runs. Item 2 is
about whether it runs on the agent path.

**2. How long ago.** The documentation pages are undated. The Cortex Analyst
page carries the 2026-08-28 transition banner, so it was edited **within the
last 27 days** (inferred from its content). The only dated description of
mechanism (b) is **2025-02-20**, **Background**, about 19 months old. The
best-practices guide was last updated **2026-02-03**, also **Background**. The
item is admitted on the current pages, as the baseline that the in-window
transition replaces.

**3. How it relates to what has already been read.**

- **Filed under `semantic-models`** (90 days). It also serves
  `warehouse-agentic` (90 days), so the filing widens nothing.

Level 1 item 2's table credited Snowflake with one mechanism, (c). Level 2
item 3 found the 2025 blog, (b). This item adds (a) and separates the three by
enforcer. **That matters for the question beneath this lead.** The answer is
not a choice between "engine" and "prompt". There is a middle option: a
checker the vendor runs on SQL the model wrote. #35 and #42 landed on
deterministic compilation, the model picking metrics and a compiler writing
the SQL. A checker is a weaker cousin of that: the model writes the SQL and a
rule-based pass vetoes it.

**4. What through-line it changes.** It refines Level 2's "a prompt, not a
compiler". For Cortex Analyst, the semantic view acts as three things:

- a compiler for about one query in ten;
- a checker's rulebook for the rest, if the 2025 design still runs;
- a join allow-list throughout.

It also sharpens Level 1 item 1's cost point: **primary keys now carry the
join direction.** In Looker's translation (Level 1) and in a hand-built view
alike, a missing or wrong primary key does not just fail validation. It
changes what counts as "many" (inferred from the inference rule quoted
above).

**5. What to research next.**

- **Whether aggregate-before-join, the chasm-safe behaviour, is documented for
  `SEMANTIC_VIEW()` itself.** Two metrics from two fact tables share one
  dimension: what does the engine emit? The querying guide's "Choosing the
  dimensions that you can return for a given metric" section and the
  `CREATE SEMANTIC VIEW` reference are the places to look. Check whether any
  page, not only Will Pugh's blog, says each metric is aggregated before the
  join.
- **Whether the 2025 checker runs on Routing Mode's physical-SQL fallback.**
  That fallback is about 90% of Analyst queries, and "leading to the query
  rejection" predates Routing Mode (2025-11-14). Look for any 2026 Snowflake
  engineering post on Analyst's SQL validation. If there is none, treat the
  checker as unconfirmed on both paths, not only the agent's.

**6. Source.** From open search. `docs.snowflake.com` and `snowflake.com` are
on `sources.md`.

- [Snowflake, YAML specification for semantic views](https://docs.snowflake.com/en/user-guide/views-semantic/semantic-view-yaml-spec):
  **full page read**.
- [Snowflake, how Snowflake validates semantic views](https://docs.snowflake.com/en/user-guide/views-semantic/validation-rules):
  **full page read**, with the relationships section re-asked.
- [Snowflake, Cortex Analyst](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-analyst):
  **full page read**, with both relationship passages re-asked verbatim.
- [Snowflake, querying semantic views](https://docs.snowflake.com/en/user-guide/views-semantic/querying):
  **full page read**, with the error text re-asked.
- [Snowflake, Routing Mode](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-analyst/cortex-analyst-routing-mode):
  **full page read**, re-read for this level's terms.
- [Snowflake, best practices for semantic views](https://docs.snowflake.com/en/user-guide/views-semantic/best-practices-dev):
  **full page read**.
- [Snowflake developer guide, "Best Practices for Creating Semantic Views for Cortex Analyst"](https://www.snowflake.com/en/developers/guides/best-practices-semantic-views-cortex-analyst/)
  (Abhinav Vadrevu, updated 2026-02-03): **full page read**, Background.
- [Snowflake engineering blog, "Preventing Join Hallucinations and Double Counting"](https://www.snowflake.com/en/blog/engineering/snowflake-cortex-analyst-introducting-joins-complex-schemas/)
  (Yahia Bsat, 2025-02-20): **full page read**, with the chasm, correction and
  edge passages re-asked verbatim. Background.
- [Legacy Cortex Analyst semantic model specification](https://docs.snowflake.com/user-guide/snowflake-cortex/cortex-analyst/semantic-model-spec):
  **full page read** of what it now serves, which is the semantic-views
  overview.

**7. Verified / inferred / assumed.**

- **Verified:**
  - every quotation above;
  - the redirect of the legacy spec URL;
  - that none of the six documentation pages listed contains "fan trap",
    "chasm trap" or "double counting";
  - that the shared-dimension workaround matches the blog's chasm-trap
    definition, word for word in its structure.
- **Inferred:**
  - that the Cortex Analyst page was edited in the window;
  - that a wrong primary key changes the inferred join direction.
- **Assumed:** that the 2025 checker still exists in some form. Nothing read
  says it was retired, and nothing dated after 2025-02-20 describes it.

---

### 2. Snowflake's Cortex Agents pages say nothing about fan or chasm traps, and disagree about whether Cortex Analyst is still in the agent's SQL path

**1. What it is.** Every current Cortex Agents page and every in-window note
that could carry the answer was read for joins, relationships, grain, fan
traps, chasm traps and double counting:

- the Cortex Agents overview;
- "Create and manage agents";
- the Run API;
- the 2026-08-28 transition note;
- the 10.24 release notes;
- the migration guide;
- the Cortex Agents best-practices guide.

**None of them states how the agent handles a fan trap or a chasm trap. None
says whether it applies Cortex Analyst's checker.** What the pages do say
about the path from question to SQL does not agree with itself:

| Source | What it says | Date |
|---|---|---|
| Semantic-views overview | "Currently, Cortex Agents reads the information captured in the semantic view definition and generates the SQL against the physical tables directly." | undated |
| 2026-04-13 note | Agents "now generate SQL directly, rather than delegating SQL generation to the Cortex Analyst service as a separate step" | Background; search summary only |
| Migration guide | "Cortex Analyst is a single-purpose text-to-SQL endpoint. You send a question and a semantic view; it returns SQL. Cortex Agents wraps that capability in an orchestrator that can:" ... "2. **Generate SQL** directly against your semantic view" | updated 2026-05-05, Background |
| 2026-08-28 transition note | "Cortex Agents uses Cortex Analyst as its tool for querying structured data, so the transition is a change to how you invoke it rather than a rebuild" | in window |
| "Create and manage agents" | The tool type is still `"cortex_analyst_text_to_sql"`, and "When Cortex Analyst is invoked by an agent, it does not have access to open source LLM models" | undated |

Read together, "Cortex Analyst" on the agent path is a **tool name and a
configuration block**. Since April, per the note, it is not the service that
generates the SQL. The Analyst page's "Join paths are predefined, ensuring
correct multi-table queries", and the 2025 checker, are properties of that
service. **No page says whether they travelled with the name** (inferred; the
table is the evidence).

**What the agent path is documented to have instead.** The migration guide's
comparison table gives SQL accuracy as "High" for Analyst and "Higher — agent
can inspect results and self-correct errors" for Agents. Its fourth step is
"**Self-correct** if the SQL errors or returns unexpected results".

A fan-trap total does not error. It returns a number of the right type, only
too large. So self-correction catches it only if the model judges the number
"unexpected" (inferred). That is a guard in the model's judgement: a prompt,
not a rule.

The Run API example shows the same string in the `tool_use` `sql` field and
the `tool_result` `sql` field, `"WITH __table_a AS (...) SELECT ..."`. The
page says nothing about any rewrite or check between generation and
execution.

**The only Snowflake-published test.** The migration guide's "Validate Your
Migration" section asks the customer to "Run 10-20 representative questions
through both APIs and compare SQL correctness, accuracy, and latency". It
names no multi-fact question.

**No Snowflake-published example or test of a multi-fact question through
Cortex Agents was found.** The Ontology post (2026-05-25, Background) was the
closest candidate. It benchmarks agents on 22 questions and shows no
multi-fact SQL.

**The one Snowflake sentence that answers the question beneath this lead is
Background.** Will Pugh's "Why Do We Need Semantic Views?" (2026-03-09) walks
through both traps. Its appendix, "Can't LLMs do all of this?", says:

- "However, I've still encountered the traps and averages of averages."
- It gives "an example of a query generated by a very capable LLM over the
  TPC-DS data set" that contains a fan trap.
- It concludes: "Querying these views directly ensures deterministic results,
  while Snowflake Intelligence and agents use them as a grounded framework to
  generate more accurate SQL."

That is a Snowflake engineer saying, before the April change, that the
deterministic guarantee belongs to direct queries and that agents get
grounding. It is one engineer's blog, not documentation, and it names no
checker either way.

**2. How long ago.** The transition note is **2026-08-28**, **27 days** before
2026-09-24. The 10.24 release notes cover **2026-07-09 to 2026-07-15**, **71-77
days**. The "Cortex Agents object enhancements" note (2026-09-16, **8 days**)
and the Compact API note (2026-09-21, **3 days**) were seen as search summaries
only, and neither touches SQL generation.

These are **Background**:

- the migration guide (2026-05-05, 142 days);
- the Cortex Agents best-practices guide (2026-06-15, 101 days);
- the Ontology post (2026-05-25);
- Pugh's post (2026-03-09);
- the 2026-04-13 note.

**3. How it relates to what has already been read.**

- **Filed under `warehouse-agentic`** (90 days; it passes at 27 days). It
  also serves `semantic-models` (90 days, passes).

It answers Level 2 item 3's first lead: **no document says either way.** It
corrects one line of Level 2 item 1, marked there, which said the transition
note's only sentence on SQL generation was the "same semantic views" one.

It does not overturn Level 2's headline, that the view binds the agent "only
as instructions in a prompt". It narrows it. The prompt reading is the only
one any published source supports. A checker that runs and is simply
undocumented is not excluded.

For **#35 and #42**: #35's counter-argument was that accuracy figures come
from questions a semantic layer was built to answer. The multi-fact question
is exactly what a semantic layer is built to answer. On Snowflake's
recommended path, nobody has published whether the layer still answers it
deterministically.

Path 1 of this exploration covers Snowflake's evaluators. Whether an
evaluator would catch an inflated total is its question and is not followed
here.

**4. What through-line it changes.** Level 2 said "prompt, not compiler".
This level makes it **"prompt, with any checker undocumented".** The through-line
for this path becomes: **the vendor's documentation does not let a customer
tell which guard applies to the agent they are told to move to.** That is
a documentation gap, and it is also a governance one, in the sense of Level 2
item 2. A customer cannot audit the agent from the lineage graph, and cannot
learn its join guarantees from the docs.

**5. What to research next.**

- **The spike.** Take one semantic view with two fact tables sharing a
  dimension, for example TPC-H `lineitem` and `partsupp` through `part`, or
  the best-practices guide's own shared-dimension workaround. Ask one question
  that sums a measure from each by that dimension. Ask it through the Cortex
  Analyst REST API, through a Cortex Agent on the same view, and as a
  hand-written `SEMANTIC_VIEW()` query. Compare the `system_execute_sql` block's
  SQL and the three totals. This needs an engineer with a Snowflake account,
  behind its own issue.
- **Whether an agent trace shows a validation step.** Snowflake's agent
  monitoring ("Review threads, logs, and traces") records spans. Does a trace
  for a `system_execute_sql` call show anything between generation and
  execution: a validation span, a rejected draft, a retry with a changed join?
  Check the Cortex Agents monitoring/observability page and the event-table
  schema. That can show whether a checker exists without anyone having to
  document it.

**6. Source.** From open search. `docs.snowflake.com` and `snowflake.com` are
on `sources.md`.

- [Snowflake release note, 2026-08-28 transition](https://docs.snowflake.com/en/release-notes/2026/other/2026-08-28-cortex-analyst-transition-cortex-agents):
  **full page read**, re-read in full at this level, with term absences
  checked.
- [Snowflake, 10.24 release notes](https://docs.snowflake.com/en/release-notes/2026/10_24):
  **full page read**. Two features, neither on SQL generation.
- [Snowflake, Cortex Agents](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-agents):
  **full page read**, with "How it works" and "Limitations" re-asked verbatim.
- [Snowflake, create and manage agents](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-agents-manage):
  **full page read**.
- [Snowflake, Cortex Agents Run API](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-agents-run):
  **full page read** for the two `sql` fields.
- [Snowflake, overview of semantic views](https://docs.snowflake.com/en/user-guide/views-semantic/overview):
  **full page read**.
- [Snowflake developer guide, "Upgrade from Cortex Analyst to Cortex Agents"](https://www.snowflake.com/en/developers/guides/migrate-cortex-analyst-to-cortex-agents/)
  (Abhinav Vadrevu, updated 2026-05-05): **full page read**, with the list item
  and its lead-in re-asked verbatim. Background.
- [Snowflake developer guide, "Best Practices for Building Cortex Agents"](https://www.snowflake.com/en/developers/guides/best-practices-to-building-cortex-agents/)
  (2026-06-15): **full page read**, nothing on joins. Background.
- [Snowflake engineering blog, "Why Do We Need Semantic Views?"](https://www.snowflake.com/en/blog/engineering/why-we-need-semantic-views/)
  (Will Pugh, 2026-03-09): **full page read**, with the appendix's three
  sentences re-asked verbatim. Background.
- [Snowflake engineering blog, "Ontology in Snowflake: Building Cortex Agents"](https://www.snowflake.com/en/blog/engineering/ontology-grounded-cortex-agents/)
  (2026-05-25): **full page read**. Background.
- [Snowflake release note, 2026-04-13](https://docs.snowflake.com/en/release-notes/2026/other/2026-04-13-cortex-agents-agentic-analyst):
  **search summary only**. It returned a navigation shell again.

**7. Verified / inferred / assumed.**

- **Verified:**
  - that none of the pages listed states how the agent handles fan or chasm
    traps, or whether it applies Analyst's checker;
  - the five statements in the table, except the 2026-04-13 row;
  - the migration guide's self-correction wording and validation advice;
  - the identical `sql` fields in the Run API example;
  - Pugh's three sentences.
- **Search summary only, filed as inferred:** the 2026-04-13 wording, and the
  content of the 2026-09-16 and 2026-09-21 notes.
- **Inferred:**
  - that "Cortex Analyst" on the agent path now names a tool, not the
    service that generates SQL;
  - that self-correction does not reliably catch an inflated total.
- **Assumed:** that the absence of a documented checker reflects the product
  rather than only the docs. **This is the load-bearing assumption of this
  level, and it is the one the spike would test.**

---

### What was searched for and not found

- **Any Snowflake page or note stating that Cortex Agents' SQL generation
  detects or prevents fan traps, chasm traps or double-counting.** Checked:
  - the Cortex Agents overview, "Create and manage agents" and the Run API;
  - the semantic-views overview;
  - the 2026-08-28 transition note, the 10.24 release notes, and the
    2026-09-16 and 2026-09-21 notes (the last two by search summary);
  - the migration guide and the Cortex Agents best-practices guide.

  None.
- **Any Snowflake documentation page, rather than a blog, that names a fan
  trap, a chasm trap or double counting.** Checked:
  - the YAML spec;
  - the validation rules;
  - the querying guide;
  - the Cortex Analyst page;
  - the Routing Mode page;
  - the semantic-view best practices.

  None.
- **The 2026-04-13 note's body.** It returned a navigation shell for the
  fourth time across two levels.
- **A Snowflake-published multi-fact example or test through Cortex Agents,
  with SQL in full.** None. The Run API example is still cut to
  `WITH __table_a AS (...)`.
- **An independent test** of agent SQL on a multi-fact question. None found.
  One search summary asserted that "Cortex Agents has mechanisms to prevent
  wrong totals". None of the sources it listed says so for Agents, and it is
  not used.
- **Legacy `relationship_type` wording on the docs site.** Its URL now
  redirects to the semantic-views overview.

### What was dropped

- **"Mastering Semantic Views and Cortex Agents with Cortex Code"** (Tianxia
  Jia, Snowflake Builders Blog on Medium). The fetch was refused with a 403.
  It was the likeliest place for a Snowflake employee to show agent SQL in
  full.
- **"Snowflake Cortex Analyst: Evaluating Text-to-SQL Accuracy for Real-World
  BI"** (2024-08-29). Background. Its benchmark is "a single view with
  pre-joined data" only, so it has nothing on joins.
- **Snowflake's "Agentic Semantic Model Improvement" post (June 2026).**
  Search summary only. It is about improving a semantic view with an LLM
  judge, which is an evaluation question and belongs to path 1.

## Where this path ends

The three levels together say this about the question the path started with:
what an agent reading the warehouse's copy of a semantic model loses.

- **Level 1: the copy loses rules and arithmetic.** Looker's translation into
  Snowflake or BigQuery "ignores" access filters and standing filters. The
  three layers cannot hold the same set of measures. Each prevents
  double-counting by a different mechanism:
  - LookML with symmetric aggregates;
  - BigQuery Graph with key-locked measures;
  - Snowflake with a grain rule that refuses the query.
- **Level 2: Snowflake's agent reads the copy rather than querying it.**
  Cortex Analyst goes through `SEMANTIC_VIEW()` for about one query in ten.
  Cortex Agents, which Snowflake now recommends, "generates the SQL against
  the physical tables directly". Grain refusal and materializations do not
  reach it, and its role must hold `SELECT` on the tables.
- **Level 3: whether anything else guards the agent's joins is undocumented.**
  Analyst had a join allow-list and a rule-based checker that rejected chasm
  traps. The agent path's pages name neither. They describe self-correction on
  errors and "unexpected results" instead. Snowflake's own engineer describes
  agents as using the view "as a grounded framework", against direct queries
  that are "deterministic".

**What to take away.** When a semantic layer moves into the warehouse, the
definitions arrive and the guarantees do not necessarily follow. Of the three
double-counting mechanisms Level 1 compared, none can be shown to bind
Snowflake's recommended agent. That is not the same as showing that it
double-counts. It means the deterministic-compilation pattern #35 and
#42 landed on exists in Snowflake's product, and is not the path its agent
takes. Any accuracy claim for that agent on multi-fact questions is a claim
about the model, not about the semantic layer.

**What stays open, and who could close it.**

- **An engineer's spike** (Level 3 item 2, lead 1). One multi-fact question,
  asked three ways on one semantic view: through Cortex Analyst, through
  Cortex Agents, and as a hand-written `SEMANTIC_VIEW()` query. It would
  settle in an afternoon what no document does. It needs a Snowflake account,
  and it should be its own issue.
- **Snowflake**, by publishing the 2026-04-13 note's body in a readable form,
  or by saying in the Cortex Agents docs whether Analyst's join validation
  runs on `system_execute_sql`.
- **Looker's side** is still open from Level 1: what it does with a construct
  it cannot translate.

**The strongest counter-argument.** An absence in the docs is weak evidence
about a product. Snowflake kept calling the agent's tool "Cortex Analyst" and
kept the join-declaration rule in the view, and it claims "every Cortex
Analyst capability". The simplest reading is that the checker came along and
nobody wrote it down. Snowflake documented Analyst's checker only in a blog,
never on a docs page, so its absence from the Agents pages is exactly what
the docs would look like either way. If the spike shows the agent rejecting
or correctly pre-aggregating a chasm-trap question, the answer to the
question beneath this path flips. It becomes "prevented by an undocumented
checker, not by the prompt", and the loss this path traced shrinks to Level
1's rules and measure types.
