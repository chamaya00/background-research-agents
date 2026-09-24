# Breadth pass - moving from product data science into data engineering, as agents arrive

What was written between late June and late September 2026 about how data
engineering work is changing with agents in the warehouse and transformation
stack, and what that suggests someone moving into the field should learn.

**A typical outside data stack, in the order data flows.** **Ingestion** tools
copy data from apps and databases into storage: Fivetran, Snowflake's Openflow,
Databricks' Lakeflow Connect. The **warehouse** stores tables and runs SQL:
Snowflake, Google BigQuery, Databricks (a "lakehouse", warehouse plus data lake).
More and more, the tables sit in an open file format, **Apache Iceberg**, that
several engines can read, tracked by a **catalog** that says where each table
is and who may read it. **Transformation** turns raw tables into clean, modelled
ones as version-controlled SQL: dbt, or Google's Dataform. **Orchestration**
runs those steps on a schedule: Airflow, Lakeflow Jobs. A **semantic layer**
defines business terms like "active customer" once. **BI tools** (dashboards)
and **notebooks** sit on top. Data engineers own the bottom four layers, and
the agents below are now aimed at exactly those.

**Headline.** Practitioners and vendors this quarter describe the same shift.
Writing pipeline code is moving to agents, and the engineer's job is moving to
specifying, reviewing and supplying context. Every major vendor shipped a coding
agent for data engineers: Snowflake CoCo, Databricks Genie Code, Google's Data
Engineering Agent and dbt's Developer Agent. They all ask for the same inputs:
tests, conventions written down as "skills", and semantic definitions. So the
things worth learning are the old fundamentals: modelling, testing and semantic
definitions, plus the new work of writing context that an agent can use.

## 1. The data-engineering job as agents arrive

In-window writing about the role is mostly essays and benchmark reviews rather
than surveys. The surveys everyone quotes are older and appear here as background.

### Roundup: a rogue agent, Kimi K3, and data teams in the AI era
[link](https://roundup.getdbt.com/p/roundup-a-rogue-agent-kimi-k3-and) · 2026-08-06 · newsletter (dbt Labs) · read in full

1. **What it is about:** dbt Labs' newsletter talks through Katie Bauer's split of data work into "platform work" (loading data, building core models) and "distribution work" (getting answers to decision-makers). Its argument is that agents make practitioners more "full-stack".
2. **Why you're seeing it:** It is about how agents change analytics work itself (`analytics-broad`, `dbt-context`).
3. **Seen before?** New to you. dbt's own [June post](https://www.getdbt.com/blog/the-analytics-engineer-in-2026-system-designer-governance-owner-ai-context-provider) (background) calls the role "system designer, governance owner, AI context provider".
4. **Relates to:** Angle 5's context-layer pieces, which describe what "providing context" involves.
5. **Takeaways for you:** Tristan Handy (dbt's founder) says that with agents "everybody can do most of the technical stuff". What stays scarce is "the same set of boring fundamentals": governance, documentation, semantic definitions. For you, business judgment carries over and syntax matters less.

### Data Engineering Benchmarks for AI Agents
[link](https://upriverdata.com/blog/data-engineering-benchmarks-for-ai-agents) · 2026-08-19 · vendor blog (Upriver) · read in full

1. **What it is about:** A survey of six benchmarks that test agents on data-engineering tasks: dbt's ADE-bench, Snowflake's data-eng-bench, ELT-Bench, DataClawEval, Databricks' internal set, and Spider 2.0/BIRD.
2. **Why you're seeing it:** A benchmark's task list is a written job description (`benchmarks-depth`, `agent-efficacy`).
3. **Seen before?** Partly. data-eng-bench and Databricks' internal set appeared in the 2026-09-24 analytics-agents exploration, path 1. Spider 2.0 and BIRD are #35's.
4. **Relates to:** Angle 3's CoCo post, which gives the practitioner's side of what these tasks look like.
5. **Takeaways for you:** The tasks are the job. Understand an existing transformation graph, then "validate row counts, keys, metrics, and edge cases", then debug. The post also says "Agent harness matters almost as much as the model", and that agents which pass once can fail on a rerun.

**Leads:**
1. L1a - What role and hiring writing in the window says separates "analytics engineer", "data engineer" and the new "context engineer" titles: practitioner essays and job-posting analyses from the dbt Roundup, Joe Reis's Practical Data community, Data Engineering Weekly and SeattleDataGuy, read for which of a product data scientist's existing skills each role asks for.
2. L1b - Data-engineering agent benchmarks as a map of the work: ADE-bench, Snowflake data-eng-bench, ELT-Bench, DataClawEval and Spider 2.0-DBT, read for what kinds of task each contains (bug fixes, refactors, ingestion, debugging, lineage) and what their authors say the tasks represent.

## 2. dbt - what shipped for agents and for engineers

dbt is the most common tool for transformation, and it is where analytics
engineering started. dbt Labs has merged with Fivetran, the ingestion company,
and this quarter both its engine and its agents changed.

### Fivetran + dbt Labs announces new capabilities to make enterprise data agent-ready at dbt Summit 2026
[link](https://www.fivetran.com/press/fivetran-dbt-labs-announces-new-capabilities-to-make-enterprise-data-agent-ready-at-dbt-summit-2026) · 2026-09-16 · vendor press release · read in full

1. **What it is about:** The combined company's conference launches. dbt v2 is generally available: a Rust rewrite, formerly "Fusion", with "10x faster parsing" and SQL errors caught as you type. Alongside it come dbt Wizard (dbt's agent) in a CLI and a desktop app, the Fivetran Context Layer (private beta) and Lake Compute (private beta). Lake Compute is a DuckDB engine, a small single-machine database, that runs dbt models directly on Iceberg tables.
2. **Why you're seeing it:** dbt's own agentic features (`warehouse-agentic`, `dbt-context`).
3. **Seen before?** Yes. #26 item 2 covered the Agents Schema, and #42 item 5 covered v2 reaching general availability. What is new here is Lake Compute and the Context Layer.
4. **Relates to:** Angle 5's Iceberg piece. dbt now runs where the open-format tables live.
5. **Takeaways for you:** Learn dbt v2 directly. Its fast feedback on errors is what makes agent-written SQL checkable.

### The dbt MCP server comes to Claude: governed context, one sign-in away
[link](https://docs.getdbt.com/blog/dbt-mcp-server-claude) · 2026-07-23 · vendor blog · read in full

1. **What it is about:** MCP (Model Context Protocol) is the standard way an outside AI tool calls another system. dbt's MCP server now runs hosted, and Claude connects to it with a single sign-in. It exposes model discovery and lineage, the Semantic Layer's certified metrics, SQL, job runs and their errors, and column-level lineage.
2. **Why you're seeing it:** It is the channel through which dbt context reaches agents (`dbt-context`, `semantic-models`).
3. **Seen before?** #35 noted the tool consolidation as a dropped item. This is the first piece in these briefs to show the tools themselves.
4. **Relates to:** Angle 3, where Snowflake exposes semantic views over MCP too.
5. **Takeaways for you:** The tool list is a short curriculum: lineage, tests, metrics and job operations. "dbt supplies the keystone; the rest of your work composes around it."

### dbt release notes (September 2026 entries)
[link](https://docs.getdbt.com/docs/dbt-versions/dbt-cloud-release-notes) · 2026-09 · vendor doc · read in full

1. **What it is about:** September's changelog adds a Developer Agent and an Analyst Agent (both beta). It also adds a new Semantic Layer YAML format, in which semantic models sit inside each model's YAML and "measures" become simple metrics.
2. **Why you're seeing it:** It covers how dbt semantic models are defined (`semantic-models`, `dbt-context`).
3. **Seen before?** #42 item 5 read the same page for v2, Wizard and the Apache Ossie export. The agents and the YAML change were not in it.
4. **Relates to:** #42 item 1's Apache Ossie, which dbt now exports.
5. **Takeaways for you:** If you learn the Semantic Layer now, learn the new YAML format. Older tutorials teach the format this one replaces.

**Leads:**
1. L2a - dbt's agent surface for a learner: dbt Wizard (CLI, Desktop, Explore mode), the Developer and Analyst agents, the open `dbt-agent-skills` repository and the remote dbt MCP server, read through dbt's docs, developer blog and tutorials for what each does inside a dbt project.
2. L2b - Learning dbt v2 and the new Semantic Layer YAML now: dbt's migration guides from v1, column-level lineage, `dbt lint`, dbt State, and practitioner write-ups of dbt Summit 2026 (for example Rittman Analytics), read for what changed and what a newcomer should skip.

## 3. Snowflake - agents for the engineer, not the business user

Snowflake is a cloud warehouse. Its data-engineering agent is CoCo, formerly
Cortex Code: a coding agent that knows your Snowflake account, runs in a
terminal, a desktop app, the browser or VS Code, and reached GA in the VS Code
extension on 2026-08-27.

### CoCo: Snowflake's AI coding agent for data engineers
[link](https://www.snowflake.com/en/blog/snowflake-coco-data-engineering/) · 2026-09-04 · vendor blog · read in full

1. **What it is about:** A Snowflake sales engineer's best practices for AI-assisted pipelines: start from minimal prompts, iterate on the failures, and write team knowledge down as "skills" (Markdown workflows with scripts), plugins, and an `AGENTS.md` file of conventions.
2. **Why you're seeing it:** A warehouse vendor describing how engineers should work with its agent (`warehouse-agentic`).
3. **Seen before?** The 2026-09-24 analytics-agents exploration, path 1, covered CoCo's benchmark claims. This is about how you would work with it.
4. **Relates to:** dbt's agent skills in angle 2, and Databricks' Skills in Unity Catalog in angle 4. All three vendors converge on skills.
5. **Takeaways for you:** "What separates a professional data engineer ... is the ability to use AI tools to create repeatable, high-quality outcomes." There are two firm rules: keep dbt and version control, and never let the agent touch production directly.

### Second generation Openflow (Preview)
[link](https://docs.snowflake.com/en/release-notes/2026/other/2026-08-31-openflow-gen2-preview) · 2026-08-31 · vendor doc · read in full

1. **What it is about:** Openflow is Snowflake's ingestion service, which copies data in from other systems. In its second generation, deployments and connectors are ordinary SQL objects: you create and change them with `CREATE`/`ALTER`, control access with roles, and version configurations for Git-based promotion. The deployments reached GA on 2026-09-08.
2. **Why you're seeing it:** It is the ingestion layer an agent now has to operate (`warehouse-agentic`).
3. **Seen before?** New to you.
4. **Relates to:** Openflow gen 2 and the CoCo post above share a direction: anything expressed as versioned code can be written and reviewed by an agent.
5. **Takeaways for you:** Ingestion is becoming code under version control. Git, environments and role-based access are core data-engineering skills.

**Leads:**
1. L3a - How Snowflake teaches engineers to work with CoCo: the "Data Engineering with CoCo" developer guide, the 2026-09-30 hands-on lab, the published skills (`dbt-projects-on-snowflake`, `dcm`, `snowpark-python`) and the Workload Performance Analysis skill (2026-09-23), read with community write-ups on encoding team conventions for an agent.
2. L3b - Snowflake's pipeline building blocks under the agent: Openflow gen 2, Dynamic Tables (EXPLAIN CHANGES, incremental refresh), dbt Projects on Snowflake (Slim CI GA 2026-09-10) and Snowpipe Streaming, read in Snowflake's docs and practitioner tutorials for how a pipeline is built end to end in 2026.

## 4. Other vendors - Databricks and Google

Databricks and Google both put an agent inside their pipeline tools. Microsoft
Fabric had nothing in the window that could be read in full (see the end).

### Databricks release notes, August 2026
[link](https://docs.databricks.com/aws/en/release-notes/product/2026/august) · 2026-08-03 to 2026-08-31 · vendor doc · read in full

1. **What it is about:** Databricks' platform changelog. Genie Code, its coding agent, can now run as a task inside a Lakeflow Job (Lakeflow is Databricks' ingestion, pipeline and scheduling suite): it runs a prompt unattended and reads the upstream outputs (beta, 08-27). Agent skills become governed objects in Unity Catalog, Databricks' catalog (beta, 08-28). "Pages for business concepts" define terms and KPIs once (beta, 08-12).
2. **Why you're seeing it:** A lakehouse vendor's data-engineering agent features (`warehouse-agentic`).
3. **Seen before?** The 2026-09-24 analytics-agents exploration, path 1, covered Genie Code's quality claim. This covers how it works inside pipelines.
4. **Relates to:** Snowflake's skills in angle 3, and angle 5's context layer.
5. **Takeaways for you:** An agent is now one step in a scheduled pipeline, so its output needs the same tests as any other step.

### BigQuery release notes (Data Engineering Agent entries)
[link](https://docs.cloud.google.com/bigquery/docs/release-notes) · 2026-07-10 and 2026-08-13 · vendor doc · read in full

1. **What it is about:** BigQuery is Google's cloud warehouse. Its Data Engineering Agent builds and fixes pipelines in Dataform, Google's counterpart to dbt. On 07-10 the agent started reading BigQuery Graph for "context between data source and destination schemas". On 08-13 (preview), semantic metadata written in Dataform's SQLX files began syncing to Knowledge Catalog, Google's metadata catalog.
2. **Why you're seeing it:** Google's data-engineering agent (`warehouse-agentic`, `semantic-models`).
3. **Seen before?** The 2026-09-24 analytics-agents exploration covered BigQuery's chat agent for business users and BigQuery Graph's measures. This is the engineer's agent.
4. **Relates to:** dbt's MCP server in angle 2, which also gives an agent lineage and metrics.
5. **Takeaways for you:** Google feeds its agent the same inputs: schema relationships and business metadata written as code.

**Leads:**
1. L4a - Databricks' data-engineering agents in depth: Genie Code in Lakeflow (Pipeline Editor, Jobs task), Genie ZeroOps (the background operations agent), Skills in Unity Catalog and Lakeflow Designer, read through Databricks' docs, June-September 2026 release notes and practitioner reviews.
2. L4b - Google and Microsoft side by side: BigQuery's Data Engineering Agent (Dataform, BigQuery Pipelines, Knowledge Catalog, Graph context) against Microsoft Fabric's notebook agent, Data Factory MCP and Fabric Core MCP server, read in each vendor's docs and in coverage of FabCon Europe (from 2026-09-28).

## 5. Foundations underneath the agents

This is what a data engineer builds so that agents can use data at all: open
tables and catalogs, and the definitions and context layered on top of them.

### Context, semantics, and ontology: a primer for the agentic era
[link](https://www.ssp.sh/blog/semantic-context-layer-primer/) · 2026-09-12 · practitioner blog (ssp.sh) · read in full

1. **What it is about:** Three terms, separated. A **semantic layer** turns business concepts into computable SQL/YAML. A **context layer** adds documents, wikis and query history. An **ontology** describes real-world entities and how they relate.
2. **Why you're seeing it:** It lays out the ideas behind semantic models (`semantic-models`, `dbt-context`).
3. **Seen before?** It generalises #42's semantic-model thread. The same author's [June post](https://www.ssp.sh/blog/agentic-context-layer/) (background) splits "hard semantics" (YAML, SQL) from "soft semantics" (Markdown, wikis), both kept in Git.
4. **Relates to:** Fivetran's Context Layer in angle 2, and Databricks' business-concept pages in angle 4.
5. **Takeaways for you:** "If we didn't have agents, we wouldn't need this much context." Also: "The hard part in data is never building semantics ... it's how and who keeps it correct and maintained."

### Building an internal context layer for AI agents at Snowflake
[link](https://www.snowflake.com/en/blog/snowflake-internal-context-layer-for-ai-agents/) · 2026-08-17 · vendor blog · read in full

1. **What it is about:** How Snowflake's own data team gave its internal agents a "golden layer". It is built from semantic views over raw telemetry, pre-aggregated materializations for speed, and verified queries (stored question-and-SQL pairs) that also serve as tests.
2. **Why you're seeing it:** A data team's own account of building and maintaining a semantic model (`semantic-models`, `warehouse-agentic`).
3. **Seen before?** The 2026-09-24 analytics-agents exploration, path 3, covered semantic views and verified queries from the product docs. This is a team running them.
4. **Relates to:** The primer above, as a worked example of its "hard semantics".
5. **Takeaways for you:** They ran the semantic views "like production software": version control, peer review, CI/CD. Performance came first, because agents querying billion-row event tables were too slow.

### State of the open lakehouse, September 2026
[link](https://www.dremio.com/blog/state-of-the-open-lakehouse-september-2026/) · 2026-09-03 · vendor blog (Dremio) · read in full

1. **What it is about:** A monthly report on the open projects. Iceberg v3 is production-stable and v4 is being designed. Apache Polaris, an open Iceberg catalog, has shipped v1.7. Apache Ossie is the semantic-model spec. Dremio sells a lakehouse engine and helps develop Ossie, and says so.
2. **Why you're seeing it:** It covers the storage and catalog layer that semantic models are starting to attach to (`semantic-models`, `analytics-broad`).
3. **Seen before?** #42 item 1 covered Ossie becoming an Apache project. This report adds the table-format and catalog side.
4. **Relates to:** Dremio's [weekly for 15-23 September](https://dev.to/alexmercedcoder/apache-data-lakehouse-weekly-september-15-to-23-2026-41mi): Polaris plans permissions for semantic models, so a catalog may govern definitions as well as tables.
5. **Takeaways for you:** "Grounding an agent in a semantic model is the difference between a system that is right and one that is fluent."

**Leads:**
1. L5a - Open table formats and catalogs as agent infrastructure: Apache Iceberg v3/v4, Apache Polaris (semantic-model permissions, the Ossie REST API), Snowflake Horizon Catalog, Databricks Unity Catalog and Google BigLake, read for what a data engineer needs to understand and how catalogs are starting to govern semantic definitions.
2. L5b - Building and maintaining a context layer in practice: company write-ups on semantic views and metric views plus "soft" context (docs, wikis, verified queries), including Snowflake's internal layer and Horizon Context, Unity Catalog Business Semantics and business-concept pages, the Fivetran Context Layer/Agents Schema and the open-source `ktx`, read for who does the work and how it is kept current.

## Searched for and not found

- **Data quality, data contracts and observability for agents, dated in the window.** Monte Carlo's Agent Observability launch is from March 2026, and nothing newer from Monte Carlo, Soda, Great Expectations or Anomalo turned up.
- **A survey of data engineers on agents, dated in the window.** The ones cited everywhere are older: dbt's State of Analytics Engineering (2026-04-14, 363 respondents), Joe Reis's State of Data Engineering (February, 1,101 respondents) and Astronomer's State of Airflow (January).
- **Anything written for a data scientist moving into data engineering** in the window. Career guides found were generic or undated.
- **A Microsoft Fabric data-engineering agent launch that could be read in full.** Fabric's blog and community pages refused. Its "what's new" page lists MCP servers for Data Factory and Fabric (preview), without exact dates.
- **Independent practitioner essays hosted on Substack** (Joe Reis, Gradient Flow, SeattleDataGuy, Learn Analytics Engineering) and Rittman Analytics' dbt Summit review. All were found by search and none could be opened.
