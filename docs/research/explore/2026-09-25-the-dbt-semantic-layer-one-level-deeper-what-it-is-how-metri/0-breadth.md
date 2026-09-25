# Breadth - the dbt Semantic Layer, one level deeper

**Headline:** The dbt Semantic Layer has two halves. One is a free, open-source engine, MetricFlow, that turns metric definitions written in YAML into SQL. The other is a paid hosted service that serves those metrics to BI tools and agents. Over the last 90 days, the way metrics are written got simpler: a semantic model now sits on the model's own YAML entry, and "measures" became simple metrics. MetricFlow also gained converters for Apache Ossie. Agents reach the metrics mainly through dbt's MCP server, and that now includes Snowflake's own agents. Practitioners agree the layer should cover the few metrics that must be exact, not everything, and that agreeing on those definitions is harder than writing them.

## Angle 1 - What it is and where it sits

The Semantic Layer is where metric definitions live as code inside a dbt project. Tools and agents then ask for a metric by name. **Background:** MetricFlow's licence changed to Apache 2.0, an open-source licence, in October 2025 ([dbt Labs announcement](https://www.getdbt.com/blog/open-source-metricflow-governed-metrics), seen only in a search summary).

### dbt Semantic Layer architecture
[link](https://docs.getdbt.com/docs/use-dbt-semantic-layer/sl-architecture) · last updated 2026-09-10 · vendor doc · read in full · listed source
1. **What it is about:** The four parts of the Semantic Layer. Two are open source under Apache 2.0: MetricFlow, the engine that turns a metric request into SQL, and dbt Semantic Interfaces, the YAML spec. Two are proprietary and need a paid dbt platform plan: the Service Layer that routes queries, and the GraphQL and JDBC APIs.
2. **Why you're seeing it:** It answers "what is it" (`dbt-context`, `semantic-models`).
3. **Seen before?** #35 and #42 used the Semantic Layer as a benchmark subject. Neither broke it into parts.
4. **Relates to:** The warehouse still does the computing. The layer writes SQL and sends it to the warehouse, so it sits between dbt models and every BI tool or agent.
5. **Takeaways for you:** You can learn it for free: define metrics and query them locally from the `mf` command line. Serving metrics to other tools is the paid part.

### MetricFlow releases 0.212.0 and 0.213.0
[link](https://github.com/dbt-labs/metricflow/releases) · 2026-08-19 and 2026-09-10 · open-source release notes · read in full · listed source
1. **What it is about:** August added support for Athena, Amazon's query service. It also added a build that packs MetricFlow into standalone programs for dbt v2, the Rust engine formerly called Fusion. September added Vertica support and an optional `datatype` field on dimensions and metrics, which the Ossie converter now carries across. It also fixed a security hole in filter templates.
2. **Why you're seeing it:** The engine itself changing (`semantic-models`, `dbt-context`).
3. **Seen before?** #42 item 5 saw dbt write an Ossie file. The converter work inside the engine is new.
4. **Relates to:** Angle 2's Ossie import, and the interchange question in Angle 5.
5. **Takeaways for you:** MetricFlow is an active public repository you can read. The standalone build suggests the engine is moving inside dbt v2 rather than running beside it. That is an inference from a CI note.

### dbt Summit 2026: The Semantic Layer as AI Infrastructure
[link](https://multishoring.com/blog/semantic-layer-ai-infrastructure/) · 2026-09-23 · consultancy blog · read in full · search
1. **What it is about:** A consultancy's reading of dbt Summit, held 15-18 September. dbt pitched the semantic layer as infrastructure for AI, not a BI convenience. The post lists seven things to have in place before agents arrive: agreed definitions, tests, lineage, named owners, freshness targets, access control and predictable cost.
2. **Why you're seeing it:** How dbt now positions the layer (`dbt-context`, `warehouse-agentic`).
3. **Seen before?** The 2026-09-24 exploration read the Fivetran press release from the Summit. This is an outside reading of it, focused on the Semantic Layer.
4. **Relates to:** The practitioners in Angle 5, who say the same thing with more nuance.
5. **Takeaways for you:** "Define, test and govern a few key metrics first, then scale only once they hold." It is a summary, not a primary source.

**Leads:**
- **L1a** - The open-core boundary, in practice. Read the MetricFlow repository README and CHANGELOG, the `dbt-semantic-interfaces` repository, the October 2025 open-sourcing post, and the dbt v2 readiness docs. Establish what a learner can run with no dbt platform account (the `mf` command line, local DuckDB), what needs the paid Service Layer, and how the MetricFlow build inside dbt v2 changes that.
- **L1b** - How dbt positioned the Semantic Layer at Summit 2026, next to the Fivetran Context Layer and the Agents Schema. Read dbt's announcements post (getdbt.com, 2026-09-16), the Fivetran Context Layer docs, the September Analytics Engineering Roundup issues, and outside wrap-ups (Multishoring, Rollstack). Establish which does what: metrics, metadata, or unstructured context.

## Angle 2 - How metrics are defined

A semantic model tells MetricFlow what a table is. It names the table's **entities**, the join keys such as `customer_id` that let MetricFlow connect tables. It names the **dimensions**, the columns you group or filter by, and a default time column. Metrics are built on top. The way all of this is written changed this year. **Background:** dbt's January post on why: "defining metrics was just plain hard" ([Modernizing the Semantic Layer Spec](https://docs.getdbt.com/blog/modernizing-the-semantic-layer-spec), 2026-01-21, read in full).

### Migrate to the latest YAML spec
[link](https://docs.getdbt.com/docs/build/latest-metrics-spec) · last updated 2026-09-08 · vendor doc · read in full · listed source
1. **What it is about:** Old and new YAML side by side. The semantic model is now a block on the model's own entry, and entities and dimensions are tagged on its columns. Measures are gone: a simple metric now carries its own aggregation. `dbt-autofix deprecations --semantic-layer` rewrites old files.
2. **Why you're seeing it:** How a semantic model is defined today (`semantic-models`).
3. **Seen before?** The 2026-09-24 exploration flagged the new format from the release notes, which date it to January (dbt v2) and March (dbt platform). This is the guide itself.
4. **Relates to:** The next article's metric types, all written in the new form.
5. **Takeaways for you:** Learn only the new spec. Two gaps remain: it does not yet support references across projects, and dbt's older Copilot assistant does not write it.

### Creating metrics
[link](https://docs.getdbt.com/docs/build/metrics-overview) · last updated 2026-07-20 · vendor doc · read in full · listed source
1. **What it is about:** The five metric types in the new spec. Simple is one aggregation. Ratio divides two metrics. Cumulative sums over a window or to date. Derived does arithmetic on other metrics. Conversion counts a base event followed by a conversion event for the same entity within a time window. Options include filters, `fill_nulls_with` and `join_to_timespine`.
2. **Why you're seeing it:** What a metric definition can express (`semantic-models`).
3. **Seen before?** No. No prior brief listed the metric types.
4. **Relates to:** Your experimentation work. Conversion and cumulative metrics are funnels and to-date sums, defined once instead of rewritten in every query.
5. **Takeaways for you:** A ratio is built from two governed metrics, so its numerator and denominator are defined once and cannot drift apart.

### Apache Ossie semantic layer documents
[link](https://docs.getdbt.com/docs/build/ossie-semantic-models) · last updated 2026-09-08 · vendor doc · read in full · listed source
1. **What it is about:** dbt can now read semantic models written in Apache Ossie's JSON format, the cross-vendor spec. They go in an `osi/` folder and sit alongside native YAML. Ossie datasets map to dbt models, fields to dimensions, and relationships to entities.
2. **Why you're seeing it:** A second way to define the same thing (`semantic-models`, `dbt-context`).
3. **Seen before?** #42 item 1 covered Ossie becoming an Apache project, and item 5 covered dbt exporting an Ossie file. Importing is the other direction.
4. **Relates to:** The converter work in Angle 1, and the landscape in Angle 5.
5. **Takeaways for you:** Only Ossie versions 0.1.0 and 0.1.1 are accepted, and unsupported metric types are dropped with a warning. So moving definitions between tools only partly works today.

**Leads:**
- **L2a** - Learning to write semantic models in the new spec, by example. Read dbt's "How we build our metrics" best-practice guide, the Semantic Layer quickstart, the `dbt-autofix` README, and the example projects dbt Labs publishes on GitHub. Note which tutorials still teach the old format, and what a first semantic model on a dbt project should cover.
- **L2b** - Conversion and cumulative metrics, for someone who builds funnels and retention for a living. Read dbt's conversion-metric, cumulative-metric and time-spine docs, the `fill_nulls_with` and `join_to_timespine` references, and community examples. Compare how funnels, retention and to-date metrics are written in MetricFlow with how experimentation tools define them.

## Angle 3 - How metrics are served

Once defined, a metric is requested by name, for example "revenue by region by month". The Semantic Layer writes the SQL, runs it in the warehouse and returns rows. There are three routes: live APIs, tables built ahead of time, and cached results. Little on this side changed in the window, so these are the current docs.

### Available integrations
[link](https://docs.getdbt.com/docs/platform-integrations/avail-sl-integrations) · last updated 2026-08-18 · vendor doc · read in full · listed source
1. **What it is about:** Native connectors exist for Power BI, Tableau, Excel, Google Sheets, Hex, Mode, Omni and others, with Sigma in preview. Other tools connect through the [APIs](https://docs.getdbt.com/docs/dbt-cloud-apis/sl-api-overview) (updated 2026-07-23). JDBC is a standard interface that lets SQL tools connect; dbt's is built on Arrow Flight SQL. GraphQL is a web query API for people building apps. The third API is a Python SDK.
2. **Why you're seeing it:** How metrics leave the layer (`dbt-context`, `semantic-models`).
3. **Seen before?** No.
4. **Relates to:** Exports, next, which cover tools with no connector.
5. **Takeaways for you:** The Python SDK is your route from a notebook. July's release notes made GraphQL queries over the complexity limit fail outright instead of just warning.

### Saved queries and exports
[link](https://docs.getdbt.com/docs/use-dbt-semantic-layer/exports) · last updated 2026-09-08 · vendor doc · read in full · listed source
1. **What it is about:** A saved query is a named combination of metrics and dimensions, kept in the project. An export runs a saved query and writes the result to the warehouse as a table or view. It runs on dbt's scheduler, the orchestration that runs builds in order on a schedule.
2. **Why you're seeing it:** The route for tools that only read tables (`semantic-models`).
3. **Seen before?** No.
4. **Relates to:** Caching, next, which is built on saved queries with exports.
5. **Takeaways for you:** You know the pattern of a dashboard reading a nightly metrics table. Here that table is defined upstream from a governed metric.

### Caching
[link](https://docs.getdbt.com/docs/use-dbt-semantic-layer/sl-cache) · last updated 2026-07-23 · vendor doc · read in full · listed source
1. **What it is about:** There are two kinds. Result caching relies on the warehouse's own cache: MetricFlow writes identical SQL for identical requests, so a repeated request comes back fast. Declarative caching pre-builds saved queries into a `dbt_sl_cache` schema and answers matching requests from it. It clears itself when upstream data refreshes.
2. **Why you're seeing it:** How serving stays fast (`semantic-models`).
3. **Seen before?** No.
4. **Relates to:** Cube's June comparison (dropped for date) said dbt has "no built-in caching". This page is the counterpoint.
5. **Takeaways for you:** Declarative caching is Enterprise-only. It will likely matter most for agents that ask many small questions. That is an inference.

**Leads:**
- **L3a** - The BI connectors in practice. Read dbt's Power BI, Tableau, Excel, Google Sheets, Hex, Omni and Sigma integration docs, and the `semantic-layer-powerbi-connector` and `semantic-layer-tableau-connector` repositories. Find out what each tool can ask for (any metric, or saved queries only), how it lets users filter, and where it falls short.
- **L3b** - Querying metrics from code. Read the JDBC API docs (the `semantic_layer.query` syntax), the GraphQL schema and its complexity limit, the Python SDK repository and examples, and the mention of ADBC, a newer Arrow-based database interface. Work out how a notebook user pulls governed metrics into Python for analysis.

## Angle 4 - How agents use it

An agent should not write SQL for a governed metric. It should look the metric up and ask for it. The main way in is the dbt MCP server. MCP (Model Context Protocol) is the standard way an AI tool calls another system. **Background:** dbt Labs' own procedure for agents answering questions, last changed February ([dbt-agent-skills](https://github.com/dbt-labs/dbt-agent-skills), `answering-natural-language-questions-with-dbt`, read in full). It tries the Semantic Layer first, then edits the layer's compiled SQL, then model docs, then raw project files.

### Semantic Layer tools in the dbt MCP server
[link](https://docs.getdbt.com/docs/dbt-ai/mcp-available-tools) · last updated 2026-09-16 · vendor doc · read in full · listed source
1. **What it is about:** Seven tools. Agents can list metrics and saved queries, get dimensions, dimension values and entities, show a query's compiled SQL, and query metrics. July's release notes added a `meta_filter`, so a project can tag which metrics agents may see (for example `agent_accessible: true`).
2. **Why you're seeing it:** The door agents use (`dbt-context`, `warehouse-agentic`).
3. **Seen before?** The 2026-09-24 exploration covered the hosted server reaching Claude. The Semantic Layer tool list is new.
4. **Relates to:** #35's benchmark, which measured this route.
5. **Takeaways for you:** Tagging metrics for agents is a curation decision. Someone chooses what agents get.

### Integrate Snowflake Cortex agents with dbt MCP
[link](https://docs.getdbt.com/docs/dbt-ai/integrate-mcp-snowflake-cortex) · last updated 2026-09-21 · vendor doc · read in full · listed source
1. **What it is about:** How to point a Snowflake Cortex agent at dbt's remote MCP server so it answers questions from dbt metrics. Cortex agents are Snowflake's in-warehouse agents, shown to users through Snowflake Intelligence. The agent uses `list_metrics`, `get_dimensions` and `query_metrics`, plus `text_to_sql` if it is turned on.
2. **Why you're seeing it:** A warehouse agent using dbt's layer (`warehouse-agentic`, `dbt-context`).
3. **Seen before?** #42 item 2 covered Snowflake's own semantic views. Here Snowflake's agent uses dbt's instead.
4. **Relates to:** Angle 5. Two semantic layers can meet in one agent.
5. **Takeaways for you:** The agent gets the signed-in user's dbt permissions. Sign-in to the remote MCP server is still in public beta.

### building-dbt-semantic-layer (a dbt Labs agent skill)
[link](https://github.com/dbt-labs/dbt-agent-skills/tree/main/skills/dbt/skills/building-dbt-semantic-layer) · last changed 2026-07-15 · open-source agent instructions · read in full · listed source
1. **What it is about:** dbt Labs' written instructions for a coding agent that builds semantic models. The agent detects which spec the project uses, finds relevant models, and defines entities, dimensions and metrics. It then validates with `dbt parse` and `dbt sl validate`. The skill lists pitfalls such as a missing time dimension.
2. **Why you're seeing it:** Who builds the layer (`semantic-models`, `dbt-context`).
3. **Seen before?** Path 1 of the 2026-09-24 exploration covered the skills repository and how skills are packaged. What this skill says is new.
4. **Relates to:** #35's counter-argument that nobody reports what building the layer took. Here an agent is asked to do part of it.
5. **Takeaways for you:** It doubles as a short checklist for building a semantic model yourself.

**Leads:**
- **L4a** - How dbt tells agents to use the Semantic Layer. Read the `dbt-agent-skills` skills on answering questions and on building the layer, the MCP tool docs, the `meta_filter` release note, and the Analyst agent and Wizard Explore mode docs. Map when each agent takes the metric route and when it falls back to `text_to_sql` or model docs.
- **L4b** - Agents from other companies on dbt metrics. Read how Snowflake Cortex and Intelligence, the Claude and ChatGPT plugins announced at Summit, Hex's Semantic Model Sync, and the AI features of Omni, Dot and Push.ai reach dbt metrics. Ask whether each goes through the API, the MCP server or a synced copy of the definitions.

## Angle 5 - The wider field around it

dbt's layer is one of several. Standalone layers such as dbt, Cube and AtScale work across warehouses. Others are built into one platform: Snowflake semantic views, Databricks metric views, and LookML, the modelling language of Google's Looker BI tool. Most comparisons in the window were written by vendors. The practitioner voices came through dbt Labs' own newsletter.

### Databricks Metric Views: What They Do, Where They Stop
[link](https://colrows.com/blogs/databricks-metric-views/) · 2026-07-05 · vendor blog · read in full · listed source
1. **What it is about:** An explainer on Databricks metric views. These are metrics defined in Unity Catalog, Databricks' governance catalog, and queried with a `MEASURE()` function. The post says where they stop: they work on one platform only, measures cannot be nested, and definitions need manual upkeep.
2. **Why you're seeing it:** The platform-built alternative (`semantic-models`, `warehouse-agentic`).
3. **Seen before?** #42 item 2 covered Snowflake's equivalent. Databricks' has not appeared before.
4. **Relates to:** It calls the dbt Semantic Layer "the main standalone option that spans warehouses today."
5. **Takeaways for you:** Colrows sells a competing layer, so read the limits as part of a pitch. The trade-off it names is portability against native simplicity.

### The context engineering playbook (Claire Gouze)
[link](https://roundup.getdbt.com/p/the-context-engineering-playbook) · 2026-07-02 · podcast write-up (dbt Labs newsletter) · read in full · listed source
1. **What it is about:** Claire Gouze, who runs the analytics-agent startup nao Labs, on context for agents. She calls the metric layer "governance for your most critical, high-value metrics that have to be 100% accurate", not a prerequisite for all analysis. She backs querying MetricFlow first, then falling back to docs and SQL.
2. **Why you're seeing it:** When to use the layer, from someone building agents (`dbt-context`, `agent-efficacy`).
3. **Seen before?** #35's benchmark measured accuracy only on questions the layer covers. Here a practitioner says the uncovered rest is normal.
4. **Relates to:** dbt's own agent procedure (Angle 4 background) uses the same fallback order.
5. **Takeaways for you:** She says better data models and documentation raised agent reliability far more than profiling or query history did. Those are her numbers.

### The scarce resource is consensus (Ian Macomber)
[link](https://roundup.getdbt.com/p/the-scarce-resource-is-consensus) · 2026-07-16 · podcast write-up (dbt Labs newsletter) · read in full · listed source
1. **What it is about:** Ian Macomber of Ramp, a finance company, on consensus. Without agreed definitions, people asked the same question many ways and got different answers. Ramp moved its canonical metrics, their owners and its North Star metrics into the dbt repository. Its agents go through an internal layer, not raw data.
2. **Why you're seeing it:** Who curates the layer (`semantic-models`).
3. **Seen before?** No. No curation account has appeared in earlier briefs.
4. **Relates to:** Gouze above, and your own experience of product teams disputing a metric.
5. **Takeaways for you:** The hard part he names is agreement, not YAML. Owning metric definitions may be a role you already play.

**Leads:**
- **L5a** - Standalone versus platform-built semantic layers in 2026, read as a map rather than a verdict. Cover Databricks metric views, Snowflake semantic views and Snowflake Labs' `dbt_semantic_view` package, Cube Core, AtScale and LookML. Read the comparisons by Cube, Typedef, Basedash and Colrows, noting who sells what, and Apache Ossie's converter list. Show where definitions can move between these layers.
- **L5b** - Who curates metrics and what adoption takes. Read Analytics Engineering Roundup interviews (Macomber, Gouze, Tristan Handy's August 21 issue), dbt Summit 2026 talks on Semantic Layer rollouts, dbt's "how we build our metrics" guide, and practitioner case studies. Look at ownership, coverage gaps, starting small, and how teams decide which metrics agents may see.

## Looked for and not found

No independent write-up of migrating to the new YAML spec turned up; only dbt's own docs describe it. Rittman Analytics' Summit write-up and Strategy's critique of the Fivetran-dbt merger both refused access, so the dissenting and practitioner Summit views are missing here. In the window, dbt's release notes changed nothing about saved queries, exports, caching, JDBC or the Python SDK. The serving side's changes were GraphQL's complexity limit, Redshift sign-in, clearer Snowflake error messages and an Omni connector. Several useful explainers were dated just before the window and were dropped: Upsolve (May 20), Datus (June 9), InfiniSynapse (June 23), Cube's alternatives piece (June 3), Basedash (March), Typedef (November 2025) and Hex's Semantic Model Sync (March 2025). No accuracy figures for the MCP or Analyst agent routes were found beyond the April benchmark #35 already covered.
