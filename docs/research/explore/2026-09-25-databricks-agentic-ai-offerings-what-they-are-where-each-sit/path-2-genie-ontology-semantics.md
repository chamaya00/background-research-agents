# Path 2 - Genie Ontology: how Databricks defines business meaning for its agents

This path starts from breadth Angle 2, lead L2a. Angle 2 found that the data team's job under Genie is curating what Genie reads. This level reads Databricks' own framework and docs for that layer (metric views, Pages, certification, inferred snippets), then independent, partner and catalog-vendor writers on who does the curation and how it compares with Snowflake semantic views. Items are dated 2026-06-27 or later.

## Level 1 - Genie Ontology end to end

### Operationalizing Genie Ontology in Your Data Stack
[link](https://www.databricks.com/blog/operationalizing-genie-ontology-your-data-stack) · 2026-09-01 · vendor blog · read in full · listed source
1. **What it is about:** Databricks' own six-layer build order for Genie Ontology: clean gold tables, then metadata, then a semantic layer (metric views, primary and foreign keys, Pages, domains), then certified assets, then governance, then evaluation. The rule is "model the 'head' and let Genie Ontology infer the 'tail'".
2. **Why you're seeing it:** `semantic-models`, which asks who curates a model and how. This is the vendor's answer.
3. **Seen before?** The Pages post appeared in the breadth pass. This post places Pages inside the whole stack.
4. **Relates to:** Snowflake's internal context layer (2026-09-24), which also built semantic views on top of well-modelled tables.
5. **Takeaways for you:** Metric views are "one of the most important steps for accuracy". Pages written by people outrank inferred context when the two conflict. Feedback goes to the layer that caused the error.

### Unity Catalog metric views (docs and release notes)
[link](https://docs.databricks.com/aws/en/uc-semantics/metric-views/) · 2026-09-11 (last updated) · vendor docs · read in full · listed source
1. **What it is about:** A metric view is a Unity Catalog object defined in YAML. It has sources, joins, dimensions, measures and window measures, and you query it with `MEASURE(revenue)`. The aggregation runs at query time, so one definition works at any grouping.
2. **Why you're seeing it:** `semantic-models`, `warehouse-agentic`.
3. **Seen before?** Named in the breadth pass. The definition itself is new here.
4. **Relates to:** The release notes. On [2026-07-16](https://docs.databricks.com/aws/en/ai-bi/release-notes/2026), dashboard SQL could be converted into local metric views, and Genie Code took over that conversion on 09-03. [Window measures](https://docs.databricks.com/aws/en/release-notes/product/2026/september) gained numeric-index periods such as fiscal weeks on 09-14, and sharing reached GA on 09-25.
5. **Takeaways for you:** Databricks is folding dashboard SQL into governed metrics. Since 09-10, Genie Code "prefers governed metric views over ad-hoc SQL datasets."

### Understanding Genie Ontology
[link](https://genloop.ai/blogs/understanding-genie-ontology) · 2026-07-08 · independent vendor blog · read in full · listed source
1. **What it is about:** Varun Agrawal explains OntoRank, the PageRank-style score that ranks competing definitions (inferred "snippets") by origin, author authority, usage, links to certified assets and recency.
2. **Why you're seeing it:** `semantic-models`, the question of what a model costs to build.
3. **Seen before?** Genloop appeared in #35 for benchmarks. This is its first appearance on semantics.
4. **Relates to:** [Typedef's Cortex Sense comparison](https://www.typedef.ai/blog/cortex-sense-vs-genie-ontology-which-one-checks-the-answer) (2026-07-08). Typedef finds both vendors rank definitions by trust but check nothing: "Context is not correctness, on both platforms."
5. **Takeaways for you:** "Automated extraction reduces the cold-start burden but does not remove the curation beneath it." Analysts still write the measures, joins and verified answers. The 84.5% accuracy figure comes from a vendor-run suite of 28 questions.

### Genie Ontology on Databricks: How to Prepare Your Company
[link](https://hiflylabs.com/blog/2026/7/29/how-to-prepare-for-databricks-genie-ontology) · 2026-07-29 · partner consultancy blog · read in full · search
1. **What it is about:** Márk Lőrinczy's checklist for preparing for Genie Ontology: metric views, glossary Pages with named owners, domain design, certification, and retiring stale dashboards.
2. **Why you're seeing it:** `semantic-models`, the question of who does the curation.
3. **Seen before?** No. It is the practitioner counterpart to the first item.
4. **Relates to:** The ssp.sh primer (2026-09-24) that separates semantic, context and ontology layers. Metric views and Pages form the modelled semantic layer, and the snippets form the context layer.
5. **Takeaways for you:** An analytics engineer leads the work, and domain owners must settle disputed definitions first: "Ranking the most trusted definition is not the same as having a correct one." Abandoned dashboards are "training signals", so deleting them counts as curation.

### Apache Ossie vs Warehouse-Native Semantics: Snowflake and Databricks Compared
[link](https://datus.ai/blog/osi-vs-warehouse-native-semantics/) · 2026-08-07 (updated 2026-09-13) · independent vendor blog · read in full · search
1. **What it is about:** Evan Paul compares warehouse-native semantics (Snowflake semantic views and Databricks metric views) with Apache Ossie, the vendor-neutral YAML format for moving definitions between tools.
2. **Why you're seeing it:** `semantic-models`, `dbt-context`. This item is the comparison with Snowflake.
3. **Seen before?** Ossie appeared in #42, and Snowflake semantic views in path 3 of the 2026-09-24 exploration.
4. **Relates to:** [Colrows](https://colrows.com/blogs/snowflake-semantic-views-vs-databricks-metric-views/) (2026-08-21; the writer sells a competing product): "A Snowflake Semantic View cannot read Databricks."
5. **Takeaways for you:** The objects match: logical tables with facts on Snowflake, measures in YAML on Databricks. Snowflake imports Ossie through `SYSTEM$CREATE_SEMANTIC_VIEW_FROM_OSSIE_YAML`. Databricks had no converter as of August.

**Leads:**
- **L1-a** - Inferred context and its ranking: how Genie Ontology's snippets and OntoRank authority scores, and Snowflake's Cortex Sense, decide between competing definitions. What a data steward can see, certify, override or suppress, and what independent writers (typedef, Atlan, Genloop, partners) say about keeping ranked definitions correct over time, since July 2026.
- **L1-b** - Metric views as day-to-day modelling work: window measures, semi-additive measures, materialization, dbt-databricks' `metric_view` materialization, and converting dashboard SQL and Tableau or Power BI models into metric views with Genie Code. Compared with authoring Snowflake semantic views, from docs, release notes and practitioner posts since July 2026.

**So what:** Every source here, including the vendor, splits Genie Ontology into two halves. The "head" is modelled by people: metric views, Pages, keys and certification. The "tail" is inferred snippets ranked by authority. Independent writers add that ranking a definition is not the same as checking it. For you, the job is familiar metric-definition work done as data engineering: writing measures in YAML, choosing which dashboards to certify or retire, and settling disputed definitions before an algorithm settles them for you.

## Level 2a - Ranked, inferred definitions and who keeps them right

### Cortex Sense for Enterprise AI Agents
[link](https://www.snowflake.com/en/blog/enterprise-ai-agents-grounded-context/) · 2026-06-30 · vendor blog · read in full · search
1. **What it is about:** This is Snowflake's own description of Cortex Sense. Cortex Sense is a runtime layer that learns business definitions from past queries, transformation models and BI metrics. When a question arrives, it hands the relevant definitions to Snowflake's Cortex agents. Private preview began in mid-July.
2. **Why you're seeing it:** `warehouse-agentic`, `semantic-models`.
3. **Seen before?** Yes, for its accuracy claim, in path 1 of the 2026-09-24 analytics-agents exploration. Here it is read for how it ranks definitions.
4. **Relates to:** OntoRank. Snowflake ranks definitions by relevance, authority, popularity and freshness, and "a metric definition backed by a governed semantic view" wins. That is the same head-over-tail rule as Genie.
5. **Takeaways for you:** On a conflict, it "will surface the conflict to the Cortex Sense builder and ask the human to settle it." Inside Snowflake it found "dozens of different definitions of daily active users". Someone settled them by saying, in plain English, which definition belonged to which team.

### Genie Ontology (Databricks Community thread)
[link](https://community.databricks.com/t5/data-engineering/genie-ontology/td-p/164536) · 2026-07-30 · vendor community forum, with answers from a Databricks employee and a partner · read in full · search
1. **What it is about:** A practitioner asks what a steward can actually inspect in Genie Ontology. The questions cover exports, where a definition came from, and review.
2. **Why you're seeing it:** `semantic-models`. This is the lead's question about what a steward can see.
3. **Seen before?** No. Level 1's Databricks blog said Pages written by people outrank inferred context. This thread shows what the tooling exposed in July.
4. **Relates to:** On [2026-08-13](https://docs.databricks.com/aws/en/ai-bi/release-notes/2026), ontology snippets opened to all customers, still in Public Preview. The [docs](https://docs.databricks.com/aws/en/genie/genie-ontology) (last updated 2026-09-11) still show sources only through citation icons on each answer.
5. **Takeaways for you:** There is "No public export/snapshot feature yet", and "not yet a full reviewable changelog or diff of newly learned context." A steward reviews one answer at a time, not the ranked store. In the partner's words, "the machine fills in everything around the definitions you bothered to write down."

### What Is Snowflake Cortex Sense?
[link](https://datahub.com/blog/what-is-snowflake-cortex-sense/) · 2026-07-28 · catalog-vendor blog (DataHub) · read in full · search
1. **What it is about:** DataHub makes a metadata catalog, an inventory of tables, owners and lineage, and it sells a cross-platform "context platform". This post explains Cortex Sense's four inputs: query history, object metadata, Power BI and Tableau definitions, and semantic views in Horizon Context, which is Snowflake's governed store of definitions and glossary terms.
2. **Why you're seeing it:** `warehouse-agentic`, `semantic-models`.
3. **Seen before?** No. Level 1 had no catalog vendor's view of the Snowflake side.
4. **Relates to:** **Background:** [Atlan](https://atlan.com/know/snowflake/snowflake-cortex-sense/) (2026-06-03) warned that inconsistent revenue definitions mean "Cortex Sense automates and accelerates the inconsistency". [Dawiso](https://www.dawiso.com/blog-post/standalone-context-layer-genie-ontology) (2026-06-25) made the same point about Genie.
5. **Takeaways for you:** Learned context serves only the agents inside that one warehouse. Catalog vendors pitch themselves as the steward's system of record above both warehouses, serving "one set of governed, validated context to every agent."

### dbt_context_engineering: modeling the context your AI agents read
[link](https://docs.getdbt.com/blog/dbt-context-engineering) · 2026-09-16 · vendor developer blog · read in full · search
1. **What it is about:** Stephen Thibeault introduces an open-source package for dbt, the SQL transformation tool where data models and their tests live as code. The package turns unstructured text such as transcripts and tickets into agent context. It covers chunking, vector search, versioned prompts and tests.
2. **Why you're seeing it:** `dbt-context`, `agent-efficacy`.
3. **Seen before?** No. Earlier runs covered dbt's semantic layer, not this package.
4. **Relates to:** It answers "how does context stay correct" by testing it rather than ranking it. A `grounded` test checks that an answer cites its source text.
5. **Takeaways for you:** "Metrics earned trust by being tested, and context has to clear the same bar." The line "No prompt should live only in a UI" reads as the opposite of a learned store you cannot export. The upkeep is CI tests and code review, as with metrics.

**Leads:**
- **L2a-a** - Settling conflicts in practice. What Cortex Sense's builder conflict queue and Genie's snippet-curation tools look like to preview users. Hands-on posts and docs since August 2026.
- **L2a-b** - Checking that the top-ranked definition is still right. This covers drift signals such as missing owners and stale glossary terms, changelogs of learned context, and running evaluations of context in CI. Sources include Atlan's context-drift guidance, dbt's grounded tests and Genie benchmarks, since July 2026.

**So what:** Snowflake and Databricks rank learned definitions on nearly the same signals, and both let a governed metric beat an inferred one. They differ in who hears about a conflict. Snowflake says it asks a person, while Databricks shows sources for each answer but, as of July, kept no changelog of what it learned. Catalog vendors and dbt answer the upkeep question the old way, with named owners and tests kept in code. For you, settling a disputed DAU definition becomes an ongoing data-engineering job: you own the queue of conflicts and the tests, and you do not assume the top-ranked definition is correct.

## Level 2b - Metric views as day-to-day modelling work

### Advanced techniques for metric views (window measures)
[link](https://docs.databricks.com/aws/en/uc-semantics/metric-views/advanced-techniques) · 2026-09-17 (last updated) · vendor docs · read in full · listed source
1. **What it is about:** How to write window measures, which are running totals, trailing windows and period-over-period comparisons, using `order`, `range`, `offset` and `semiadditive: first | last`. A semi-additive measure, such as an account balance, can be summed across customers but not across dates.
2. **Why you're seeing it:** `semantic-models`, which asks how a model is defined.
3. **Seen before?** Level 1 mentioned the [2026-09-14 release note](https://docs.databricks.com/aws/en/release-notes/product/2026/september) about fiscal-week offsets. This is the modelling guide behind it.
4. **Relates to:** dbt MetricFlow's `non_additive_dimension`. [Typedef](https://www.typedef.ai/blog/what-are-metrics-in-unity-catalog-databricks-governed-metric-layer-explained) (**Background**, 2026-06-22) notes that a person must declare this property, because neither tool can infer it.
5. **Takeaways for you:** The metric is a ratio of two measures (`MEASURE(a)/MEASURE(b)`). For fiscal periods you need a dense integer index column, so the "4-4-5 calendar" becomes a modelling task.

### Materialization for metric views
[link](https://docs.databricks.com/aws/en/business-semantics/metric-views/materialization) · 2026-09-11 (last updated) · vendor docs · read in full · listed source
1. **What it is about:** Materialization means precomputing results and storing them as tables. A `materialization:` block in the metric view's YAML lists materialized views to refresh on a schedule. The optimizer then answers a query from the closest one, either as an exact match or by rolling it up to a coarser grain.
2. **Why you're seeing it:** `semantic-models`, the question of what a model costs to maintain.
3. **Seen before?** No. Level 1 covered only query-time aggregation.
4. **Relates to:** Rollup only works for additive measures (SUM, COUNT, MIN, MAX). COUNT(DISTINCT), medians and window measures need an exact match.
5. **Takeaways for you:** This is the same trade-off as pre-aggregated experiment tables: distinct users do not roll up. One hard stop is that a metric view cannot be materialized if it or any of its source tables uses row-level security, column masks or ABAC (attribute-based access control).

### feat(databricks): support metric view materializations (dbt Fusion)
[link](https://github.com/dbt-labs/dbt/pull/16054) · opened 2026-08-23, merged 2026-09-09 · GitHub pull request · read in full · search
1. **What it is about:** Adds `materialized='metric_view'` to dbt Fusion, dbt's new engine. You put the metric view's YAML in a dbt model body, and dbt creates, alters or replaces the Unity Catalog object like any other model.
2. **Why you're seeing it:** `dbt-context`, `semantic-models`.
3. **Seen before?** No. The dbt-databricks adapter has had this since [v1.12.0](https://raw.githubusercontent.com/databricks/dbt-databricks/main/CHANGELOG.md) (**Background**, May 2026). This PR brings it to Fusion.
4. **Relates to:** Open [issue #1501](https://github.com/databricks/dbt-databricks/issues/1501) (**Background**, 2026-06-07): `doc()` blocks fail inside metric views, so their documentation cannot reuse model docs.
5. **Takeaways for you:** Metric definitions can live in the same repo, `ref()` graph and review flow as your models. The PR also fixes one lifecycle gap: turning an existing table or view into a metric view now succeeds instead of failing.

### Import BI files using Genie Code
[link](https://docs.databricks.com/aws/en/dashboards/manage/import-bi) · Public Preview [2026-07-23](https://docs.databricks.com/aws/en/ai-bi/release-notes/2026); page last updated 2026-09-11 · vendor docs · read in full · listed source
1. **What it is about:** You upload a Tableau (`.twb`/`.tds`) or Power BI (`.pbit`) file to Genie Code, Databricks' coding agent. It rebuilds the dashboard and turns the file's measures and dimensions into local metric views, which you can later promote to Unity Catalog.
2. **Why you're seeing it:** `warehouse-agentic`, `semantic-models`.
3. **Seen before?** Level 1 covered converting dashboard SQL. This covers converting whole BI models.
4. **Relates to:** [KPI Partners](https://www.kpipartners.com/blogs/migrate-dashboards-databricks-ai-bi-genie-code) (undated, a consultancy): level-of-detail expressions and DAX (Power BI's formula language) need review. Wholesale import will "faithfully reproduce every duplicate measure".
5. **Takeaways for you:** Take stock of your dashboards and cut the duplicates before importing, then settle the metric views before rebuilding the charts.

### Semantic Studio (Preview)
[link](https://docs.snowflake.com/en/release-notes/2026/other/2026-08-26-semantic-studio-preview) · 2026-08-26 · vendor release note · read in full · listed source
1. **What it is about:** Semantic Studio is Snowflake's new workspace for authoring semantic views. It combines chat with CoCo (Cortex Code), direct YAML editing, Git-backed versioning and one-click deployment. [Its docs](https://docs.snowflake.com/en/user-guide/views-semantic/editor) accept SQL, Tableau, Power BI or YAML as a starting point.
2. **Why you're seeing it:** `warehouse-agentic`, `semantic-models`. This is the Snowflake comparison.
3. **Seen before?** Snowflake semantic views appeared in level 1's Datus item. The authoring surface is new.
4. **Relates to:** Genie Code's BI import, with the same inputs and the same agent-plus-YAML loop.
5. **Takeaways for you:** When a Genie or Cortex answer is wrong, request-ID debugging traces it to the semantic view and proposes the fix as a diff. The two vendors now author their models in nearly the same way.

**Leads:**
- **L2b-a** - Semi-additive and window measures across semantic layers: how Databricks `semiadditive`, dbt MetricFlow `non_additive_dimension` and Snowflake semantic view metrics each express balances, snapshots and period-over-period, with worked examples and tutorials since July 2026.
- **L2b-b** - Metric views as code: the dbt `metric_view` materialization in dbt-databricks and Fusion, Declarative Automation Bundles deployment, and Git-backed Semantic Studio. How teams test, review and promote semantic definitions like any other model, since July 2026.

**So what:** Metric-view work is ordinary modelling, just not in SQL. You declare which measures are additive, semi-additive or distinct counts, and that choice decides what can be precomputed and what an agent can safely roll up. Both vendors now start from your existing Tableau, Power BI or SQL and let an agent draft the YAML. The skill that transfers is judging which definitions to keep, merge or delete, and dbt's `metric_view` puts that judgement in code review.

## Where this path ends

Genie Ontology is two layers under one name. The head is modelled by people: metric views written in YAML, Pages with named owners, keys and certification. The tail is definitions Genie infers from queries and dashboards, ranked by an authority score. Snowflake's Cortex Sense ranks on nearly the same signals and applies the same head-over-tail rule, and Snowflake's Semantic Studio drafts semantic views from Tableau, Power BI or SQL much as Genie Code does. So the vendors differ less in how they model meaning than in how visible the learned part is. Snowflake says it sends conflicts to a person, while Databricks, as of July, kept no exportable record of what it had learned. Every independent writer makes the same point: ranking a definition is not checking it. The answers on offer are old ones, named owners and tests in code, and dbt now lets a metric view live in a repository and go through review like any model. For you this is the most familiar ground in the run. Deciding what "daily active user" means, which measures can be summed and which dashboards to retire is product data science work. In a data-engineering job it becomes the governed layer every agent reads, and you own it.
