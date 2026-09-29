# Moving from product data science into data engineering, as agents arrive

Seed: what a product data scientist moving into data engineering should learn about agentic-AI-enabled warehouses, dbt, Snowflake and other vendors · mode: learning · 2026-09-24 · produced in auto-breadth mode, in GitHub Actions (width 5, paths 3, depth 3; all three paths reached depth 3)

## What's out there

Every major vendor now ships a coding agent for data engineers: Snowflake's
CoCo, Databricks' Genie Code, Google's Data Engineering Agent and dbt's Wizard.
The writing on the job agrees on where that leaves the engineer. Agents write
the pipeline code, and the engineer specifies it, reviews it and supplies the
context the agent works from.

The three paths show what that context is:
- **Written conventions:** an always-on `AGENTS.md` and task "skills", shared
  like code or granted like a table (path 1).
- **Declarative pipelines:** you state the result and the platform decides how
  to refresh it, so a change can be reviewed before it ships (path 2).
- **Catalogs that enforce access:** on open Iceberg tables, whichever engine
  or agent reads them (path 3).

What is worth learning is mostly the old fundamentals: modelling, keys and
change feeds, testing, review, and access control. They are now written down
for machines.

## The map

**Breadth** ([0-breadth.md](0-breadth.md))
- [dbt Roundup, August](https://roundup.getdbt.com/p/roundup-a-rogue-agent-kimi-k3-and) - "boring fundamentals" stay scarce
- [Data engineering benchmarks for agents](https://upriverdata.com/blog/data-engineering-benchmarks-for-ai-agents) - the tasks are the job
- [Fivetran + dbt Summit launches](https://www.fivetran.com/press/fivetran-dbt-labs-announces-new-capabilities-to-make-enterprise-data-agent-ready-at-dbt-summit-2026) - dbt v2 GA, Lake Compute
- [dbt MCP server in Claude](https://docs.getdbt.com/blog/dbt-mcp-server-claude) - lineage, tests, metrics for agents
- [dbt release notes, September](https://docs.getdbt.com/docs/dbt-versions/dbt-cloud-release-notes) - new agents, new Semantic Layer YAML
- [CoCo for data engineers](https://www.snowflake.com/en/blog/snowflake-coco-data-engineering/) - skills, `AGENTS.md`, never touch prod
- [Openflow gen 2 preview](https://docs.snowflake.com/en/release-notes/2026/other/2026-08-31-openflow-gen2-preview) - ingestion as SQL objects
- [Databricks release notes, August](https://docs.databricks.com/aws/en/release-notes/product/2026/august) - Genie Code as a pipeline step
- [BigQuery release notes](https://docs.cloud.google.com/bigquery/docs/release-notes) - Google's engineer agent reads Graph context
- [Context, semantics, ontology primer](https://www.ssp.sh/blog/semantic-context-layer-primer/) - three layers told apart
- [Snowflake's internal context layer](https://www.snowflake.com/en/blog/snowflake-internal-context-layer-for-ai-agents/) - semantic views run like software
- [State of the open lakehouse](https://www.dremio.com/blog/state-of-the-open-lakehouse-september-2026/) - Iceberg v3, Polaris, Ossie

**Path 1 - dbt's agents, from a learner's side** ([file](path-1-dbt-agent-surface.md))
- [Overview of dbt Wizard](https://docs.getdbt.com/docs/platform/wizard-overview) - four surfaces, three check depths
- [Wizard in Studio IDE](https://docs.getdbt.com/docs/dbt-ai/developer-agent) - approval modes, ends in a PR
- [Analyst agent](https://docs.getdbt.com/docs/dbt-ai/analyst-agent) - questions via the Semantic Layer
- [dbt-agent-skills](https://github.com/dbt-labs/dbt-agent-skills) - dbt's practices as skills
- [Summit 2026 lab](https://github.com/dbt-labs/Summit-26-Accelerating-analytics-with-AI) - learn the workflow by doing it
- [Skills from dbt packages](https://docs.getdbt.com/docs/dbt-ai/package-skills) - `dbt deps` installs them
- [Migrate to dbt Wizard](https://docs.getdbt.com/docs/dbt-ai/wizard-migrate) - where standing context lives
- [Lab answer sheets](https://github.com/dbt-labs/Summit-26-Accelerating-analytics-with-AI/tree/main/exercises/expectations) - what goes in `AGENTS.md` vs a skill
- [maintaining-dbt-documentation](https://github.com/dbt-labs/dbt-agent-skills/blob/main/skills/dbt/skills/maintaining-dbt-documentation/SKILL.md) - a full worked skill
- [AGENTS.md and Agent Skills (Red Hat)](https://developers.redhat.com/articles/2026/07/27/standardize-project-context-agentsmd-and-agent-skills) - the conventions from outside data
- [Skills with Wizard CLI](https://docs.getdbt.com/docs/dbt-ai/wizard-skills) - whose skill wins
- [dbt PR #15840](https://github.com/dbt-labs/dbt/pull/15840) - the argument over package skills
- [Unity Gateway Skills](https://docs.databricks.com/aws/en/agents/uc-skills/create-share-uc-skills) - sharing is a grant
- [CoCo share skills](https://docs.snowflake.com/en/user-guide/cortex-code/cortex-code-skill-plugin-sharing) - versioned, certified extensions

**Path 2 - how a Snowflake pipeline is built in 2026** ([file](path-2-snowflake-pipeline-building-blocks.md))
- [Openflow gen 1 and gen 2](https://docs.snowflake.com/en/user-guide/data-integration/openflow/gen2/openflow-generations) - connectors under version control
- [Snowpipe Streaming Elastic Channels](https://www.snowflake.com/en/blog/snowpipe-streaming-elastic-channels-ga/) - real-time in, dedupe later
- [Guide to Dynamic Tables](https://www.snowflake.com/en/developers/guides/comprehensive-guide-to-dynamic-tables/) - declare it, Snowflake refreshes
- [EXPLAIN CHANGES](https://docs.snowflake.com/en/user-guide/dynamic-tables/predict-refresh) - preview a change's refresh
- [Slim CI for dbt Projects](https://docs.snowflake.com/en/user-guide/tutorials/dbt-projects-on-snowflake-advanced-ci-cd-tutorial) - per-PR clones, defer
- [Refresh modes](https://docs.snowflake.com/en/user-guide/dynamic-tables/refresh-modes) - AUTO, FULL, INCREMENTAL, ADAPTIVE
- [Custom incrementalization blog](https://www.snowflake.com/en/blog/engineering/custom-incremental-dynamic-tables/) - write the refresh yourself
- [DCM Projects for Dynamic Tables](https://www.snowflake.com/en/developers/guides/dcm-projects-for-dynamic-tables/) - pipeline as code, frozen history
- [dbt issue #16163](https://github.com/dbt-labs/dbt/issues/16163) - dbt lags the new modes
- [Databricks incremental refresh](https://docs.databricks.com/aws/en/optimizations/incremental-refresh) - same idea, other vendor
- [Custom incrementalization docs](https://docs.snowflake.com/en/user-guide/dynamic-tables/custom-incrementalization) - `MERGE INTO SELF` rules
- [Thrive Learning](https://www.snowflake.com/en/blog/thrive-dynamic-table-costs-custom-incremental/) - a customer's switch
- [Withdrawn SCD2 guide](https://github.com/Snowflake-Labs/sfquickstarts/pull/3543) - three quiet failure modes
- [Databricks AUTO CDC INTO](https://docs.databricks.com/aws/en/ldp/developer/ldp-sql-ref-apply-changes-into) - SCD as keywords
- [dbt microbatch](https://docs.getdbt.com/docs/build/incremental-microbatch) - time windows stay in dbt

**Path 3 - open tables and catalogs as agent infrastructure** ([file](path-3-open-tables-and-catalogs.md))
- [Iceberg v4, July](https://datalakehousehub.com/blog/iceberg-v4-state-july-2026/) - how Iceberg is layered
- [REST catalogs in production](https://cloudrps.com/blog/iceberg-rest-catalog-polaris-unity-catalog-production/) - Polaris, Unity, Nessie, Glue
- [Horizon for external engines](https://www.snowflake.com/en/developers/guides/govern-iceberg-tables-for-external-engines-with-snowflake-horizon/) - policies travel with data
- [Snowflake & Google lakehouse](https://www.snowflake.com/en/blog/snowflake-google-cloud-open-lakehouse/) - catalogs federate
- [Ossie in Polaris](https://datalakehousehub.com/blog/apache-ossie-polaris-semantic-models/) - semantic models as catalog objects
- [Unifying governance (Databricks)](https://www.databricks.com/blog/unifying-governance-across-engines-and-catalogs-open-lakehouse) - three enforcement models
- [File-level delegation thread](http://www.mail-archive.com/dev@iceberg.apache.org/msg15104.html) - per-file access, in design
- [Cross-engine ABAC](https://docs.databricks.com/aws/en/external-access/cross-engine-abac) - Unity's setup list
- [State of Polaris, July](https://dev.to/alexmercedcoder/the-state-of-apache-polaris-in-july-2026-from-incubating-catalog-to-the-governance-layer-of-the-1n3h) - table-level access only
- [Google credential vending](https://docs.cloud.google.com/lakehouse/docs/credential-vending) - short-lived table keys
- [Read Restrictions explainer](https://www.snowflake.com/en/blog/engineering/apache-iceberg-read-restrictions-governance0/) - how "trusted" is decided
- [Iceberg PR #13879](https://github.com/apache/iceberg/pull/13879) - the spec change itself
- [Labels DISCUSS thread](http://www.mail-archive.com/dev@iceberg.apache.org/msg14849.html) - tags as agent context
- [Labels client rollout](https://github.com/apache/iceberg/issues/18126) - Java first, Python waits

## How it fits together

- **All three paths end at the same move:** anything an agent reads becomes a
  governed object. Skills are catalog objects at Databricks and Snowflake (path
  1). Pipelines are declared and planned before they deploy (path 2). Semantic
  models and access rules move into the catalog (path 3).
- **Paths 1 and 2 meet at dbt's limits.** dbt owns review, tests and lineage,
  but Snowflake's newest Dynamic Table features reach its own SQL first. One
  team wrote its own dbt materialization to bridge the gap.
- **Path 3 continues earlier work** on semantic models: #42's Apache Ossie, and
  the [analytics-agents exploration](../2026-09-24-agentic-ai-features-for-analytics-launched-or-announced-ware/)'s
  finding that row policies belong on tables. Here those policies follow the
  table out of the warehouse.
- **Business judgment carries over from your current work.** Every source says
  what stays scarce is knowing what a row means and when a right-looking number
  is wrong.

**Two leads not followed that you might have picked:** Databricks' data-engineering
agents in depth (breadth L4a), and role and hiring writing that separates
analytics, data and "context" engineers (breadth L1a).

## Candidate topics

Proposals only. None of these is in the profile.

- `agent-context-authoring` · Depth, under `warehouse-agentic`: how data teams write, share and govern the conventions their agents follow - `AGENTS.md`, skills, and skills as catalog objects. *From path 1.*
- `declarative-pipelines` · Depth, under `warehouse-agentic`: declarative, incrementally refreshed transformation - Dynamic Tables, Lakeflow materialized views, dbt incremental models - and how a change is reviewed before it ships. *From path 2.*
- `open-table-governance` · Depth, under `analytics-broad`: Iceberg tables and REST catalogs as the layer that decides what an agent can read, and the catalog as a home for semantic definitions. *From path 3.*
