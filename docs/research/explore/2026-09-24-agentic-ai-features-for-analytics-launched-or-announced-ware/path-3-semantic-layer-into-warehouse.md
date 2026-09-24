# Path 3 - What a semantic model keeps when it moves into the warehouse

This path starts from Looker's new export of its models into Snowflake and
BigQuery. It covers what carries over, whether Snowflake's agents actually
query through the warehouse's semantic view, and what guards them against
counting the same row twice.

## Level 1 - What survives the move

### derived_analytic_model parameter reference (Looker)
[link](https://docs.cloud.google.com/looker/docs/reference/param-view-derived-analytic-model) · undated page; feature in preview 2026-08-28 · vendor doc · read in full

1. **What it is about:** Looker is Google's BI tool, and LookML is its modelling language. This is the reference for exporting a LookML "Explore" (a set of joined tables) into the warehouse. Before it can be exported, every view needs a primary key, the joins must form a tree, and every source must be a stored table.
2. **Why you're seeing it:** It shows part of what a semantic model costs to build and maintain (`semantic-models`).
3. **Seen before?** The Looker analytic-models page in the breadth pass.
4. **Relates to:** #42 item 2, Snowflake importing Power BI models, which also listed nothing about what survives.
5. **Takeaways for you:** Looker "ignores" four Explore rules during the export, including `access_filter` (row-level security) and standing filters such as "exclude test accounts". An agent reading the warehouse copy can see rows that Looker would have hidden, unless someone rebuilds those rules as table policies in the warehouse.

### BigQuery Graphs with measures for trusted agentic workloads
[link](https://cloud.google.com/blog/products/data-analytics/bigquery-graphs-with-measures-for-trusted-agentic-workloads) · 2026-08-13 · vendor blog · read in full

1. **What it is about:** BigQuery Graph is a graph view over tables in Google's warehouse. Google has added "measures" to it: aggregations tied to a table's key, so that a join cannot count a row twice. The [docs page](https://docs.cloud.google.com/bigquery/docs/graph-measures) uses the example of a department budget "counted twice".
2. **Why you're seeing it:** It is a warehouse vendor's agent-facing semantic feature (`warehouse-agentic`, `semantic-models`).
3. **Seen before?** #42 item 1 argued that without a shared expression language, one model would give different results on two engines.
4. **Relates to:** Looker's symmetric aggregates below. Snowflake takes a third approach: it refuses queries that cross levels of detail the wrong way.
5. **Takeaways for you:** The three layers each prevent double-counting in their own way. Measures support six functions, while LookML has 21 measure types, so types like median and percentile have no direct equivalent.

### Understanding symmetric aggregates (Looker)
[link](https://docs.cloud.google.com/looker/docs/best-practices/understanding-symmetric-aggregates) · 2025-07-22 (background) · vendor doc · read in full

1. **What it is about:** Looker's explainer on how it keeps "sums, averages, and counts" correct when a one-to-many join repeats rows. The fix relies on each view's primary key.
2. **Why you're seeing it:** It explains the main problem a semantic layer exists to solve (`semantic-models`).
3. **Seen before?** New to you.
4. **Relates to:** BigQuery's measures above, and the fan traps in level 3.
5. **Takeaways for you:** This is the clearest introduction here to double-counting. When orders are joined to line items, each order's values repeat once per line. The fix needs "a unique primary key" and "the correct join relationship", which is why Looker's export insists on primary keys.

### Semantic manifest reference: the Apache Ossie document (dbt)
[link](https://docs.getdbt.com/reference/artifacts/sl-manifest) · July 2026 · vendor doc · read in full

1. **What it is about:** dbt is the transformation layer, and it has its own semantic layer. Since July, dbt writes that semantic layer out as an Apache Ossie file and can read Ossie files in. Ossie is the vendor-neutral format for exchanging semantic models.
2. **Why you're seeing it:** It shows what one exporter loses (`semantic-models`, `dbt-context`).
3. **Seen before?** #42 item 1 introduced Ossie, and #42 item 5 mentioned this file in one sentence.
4. **Relates to:** Looker's export above, which lists its prerequisites but not its losses.
5. **Takeaways for you:** dbt gives every loss a warning code. Conversion metrics, private metrics and natural entities are dropped, and cumulative metrics lose their time window. The last is the one to watch: a running total can arrive as a plain sum with the same name. Across both exporters, metrics that depend on a filter, a window or a sequence are the ones that fail to move.

## Level 2 - Do Snowflake's agents query through the semantic view?

### Routing Mode for Cortex Analyst
[link](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-analyst/cortex-analyst-routing-mode) · undated page; preview since 2025-11-14 · vendor doc · read in full

1. **What it is about:** Cortex Analyst is Snowflake's text-to-SQL service. It first tries "semantic SQL", a `SEMANTIC_VIEW(...)` query that names metrics and dimensions, which the database expands using the view's definitions. If that fails, it falls back to ordinary SQL on the tables.
2. **Why you're seeing it:** Letting a compiler rather than the model write the joins is the pattern `semantic-models` was opened for.
3. **Seen before?** Yes. #35 and #42 both found that top systems route questions through a semantic layer and let a compiler write the SQL.
4. **Relates to:** The overview page below.
5. **Takeaways for you:** Snowflake says Routing Mode "only results in semantic SQL for about 10% of queries, in aggregate". The share depends on how well the view's metrics cover the question. The page has clear examples of what semantic SQL looks like.

### Overview of semantic views (Snowflake)
[link](https://docs.snowflake.com/en/user-guide/views-semantic/overview) · undated · vendor doc · read in full

1. **What it is about:** Snowflake's introduction to semantic views. A semantic view is a warehouse object that declares tables, relationships, facts, dimensions and metrics. The page also explains why to use one.
2. **Why you're seeing it:** It covers how Snowflake's agents use the semantic layer (`warehouse-agentic`, `semantic-models`).
3. **Seen before?** #42 described semantic views as what Cortex Analyst queries against.
4. **Relates to:** Path 1's evaluators, which also treat the view as something the agent reads.
5. **Takeaways for you:** One sentence explains a lot: "Currently, Cortex Agents reads the information captured in the semantic view definition and generates the SQL against the physical tables directly." For Snowflake's recommended agent, the view is guidance in the prompt, not a compiler.

### Data lineage for Cortex Agents
[link](https://docs.snowflake.com/en/release-notes/2026/other/2026-09-02-cortex-agent-lineage) · 2026-09-02 · vendor doc · read in full

1. **What it is about:** Lineage is Snowflake's record of which objects feed which. The lineage graph now includes agents, drawn as table → semantic view → agent from the tools each agent declares.
2. **Why you're seeing it:** It is about what an agent can reach in the warehouse (`warehouse-agentic`).
3. **Seen before?** #42's GROUND paper made security violations a headline metric. This note is about what an agent is allowed to read.
4. **Relates to:** Snowflake's [semantic-view best practices](https://docs.snowflake.com/en/user-guide/views-semantic/best-practices-dev), which say an agent's role needs SELECT on "both the semantic view and its underlying tables".
5. **Takeaways for you:** A person can query a semantic view with access to the view alone, but an agent also needs access to the tables. So a semantic view cannot act as an agent's access boundary, and row policies belong on the tables.

### Semantic view materializations
[link](https://docs.snowflake.com/en/user-guide/views-semantic/materializations) · public preview July 2026 · vendor doc · read in full

1. **What it is about:** Materializations are precomputed dimensions and metrics that make semantic-view queries faster.
2. **Why you're seeing it:** It is here for what it says about agents, not for speed (`semantic-models`).
3. **Seen before?** New to you.
4. **Relates to:** Routing Mode and the overview page above.
5. **Takeaways for you:** The page says agent queries "that execute physical SQL directly against the underlying tables do not benefit". A feature added to the semantic-SQL path does not automatically reach Snowflake's agents.

## Level 3 - What guards the agent against double-counting

### Preventing Join Hallucinations and Double Counting
[link](https://www.snowflake.com/en/blog/engineering/snowflake-cortex-analyst-introducting-joins-complex-schemas/) · 2025-02-20 (background) · vendor blog · read in full

1. **What it is about:** A Snowflake engineer describes how Cortex Analyst checks the SQL it writes against a "granularity graph" built from the semantic model's joins. The check catches fan traps, where a one-to-many join inflates a sum, and chasm traps, where two one-to-many branches multiply each other's rows.
2. **Why you're seeing it:** It covers a guard that keeps agent answers correct (`semantic-models`).
3. **Seen before?** Looker's symmetric aggregates, in level 1, solve the same problem.
4. **Relates to:** Level 2. The agent path writes its own SQL, and no page says whether this check runs there.
5. **Takeaways for you:** It describes the two classic traps clearly. It also shows a third way to keep answers correct, between "compiler" and "prompt": the model writes the SQL and a rule-based check can reject it.

### Why Do We Need Semantic Views?
[link](https://www.snowflake.com/en/blog/engineering/why-we-need-semantic-views/) · 2026-03-09 (background) · vendor blog · read in full

1. **What it is about:** Will Pugh, a Snowflake engineer, walks through fan traps and "averages of averages", and shows how a semantic view prevents them.
2. **Why you're seeing it:** It explains why the semantic layer matters for agents (`semantic-models`).
3. **Seen before?** The 2025 blog above.
4. **Relates to:** The deterministic-compilation pattern in #35 and #42, where a compiler rather than the model writes the SQL.
5. **Takeaways for you:** In its appendix, "Can't LLMs do all of this?", a very capable LLM writes a fan trap. It concludes: "Querying these views directly ensures deterministic results, while Snowflake Intelligence and agents use them as a grounded framework to generate more accurate SQL." That is the clearest statement of the trade-off.

### Create and manage agents (Snowflake)
[link](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-agents-manage) · undated · vendor doc · read in full

1. **What it is about:** The reference for configuring a Cortex Agent and its tools.
2. **Why you're seeing it:** It documents the agent Snowflake now recommends (`warehouse-agentic`).
3. **Seen before?** The transition note in the breadth pass, and the migration guide in path 1.
4. **Relates to:** The overview page in level 2, which says the agent writes its own SQL.
5. **Takeaways for you:** The agent's SQL tool is still called `cortex_analyst_text_to_sql`. Snowflake's pages disagree on whether the Analyst service still writes that SQL, and none says whether Analyst's join checks carried over. The migration guide names one guard, self-correction "if the SQL errors or returns unexpected results". An inflated total does neither.

### Best Practices for Creating Semantic Views for Cortex Analyst
[link](https://www.snowflake.com/en/developers/guides/best-practices-semantic-views-cortex-analyst/) · 2026-02-03 (background) · vendor doc · read in full

1. **What it is about:** Snowflake's developer guide to designing semantic views: relationships, primary keys and verified queries.
2. **Why you're seeing it:** It covers what it takes to build a semantic model well (`semantic-models`).
3. **Seen before?** The Looker reference in level 1, which also leans on primary keys.
4. **Relates to:** The 2025 checker blog above, and the [YAML specification](https://docs.snowflake.com/en/user-guide/views-semantic/semantic-view-yaml-spec) for semantic views.
5. **Takeaways for you:** Cortex Analyst joins tables only where the view defines a relationship. The direction of each join is now inferred from primary keys, so a wrong key changes which side counts as "many". Many-to-many joins are not supported directly. The suggested workaround, a shared bridge table, builds the very shape the 2025 checker exists to reject.
