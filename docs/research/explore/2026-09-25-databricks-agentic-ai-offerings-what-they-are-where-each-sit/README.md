# Databricks' agentic AI offerings, for a data scientist moving into data engineering

Seed: Databricks' agentic AI offerings - what they are, where each sits in the stack, and what they mean for a product data scientist moving into data engineering · mode: learning · 2026-09-25 · produced in auto-breadth mode, in GitHub Actions (width 5, paths 3, depth 2; every path reached level 2 on both branches)

## Synthesis

Databricks' agentic offerings are one agent family, **Genie**, on a platform renamed around it this year. Listed from the top of the stack down:

- **Genie One and Genie Agents** answer business users' questions. Genie Agents were called Genie spaces until July.
- **Genie Code** is the engineer's agent, formerly Databricks Assistant. It writes and fixes pipelines, runs unattended as a job step, and migrates dbt and Informatica code.
- **Genie Ontology** is the business meaning both of them read.
- **Agent Bricks and MLflow** are for building and evaluating your own agents.
- **Unity Catalog and Unity Gateway** govern data, models and tools.
- **Lakebase** is a Postgres database for apps and agents.

The three paths followed the parts nearest a data-engineering job, and they end in the same place: the agent drafts, and the engineer owns what the agent reads and what leaves its sandbox.

- **Pipelines (path 1).** Lakeflow Designer and Genie Code produce pipeline code, but review happens mostly inside the product. Getting tests and a data diff into CI is still your job, while dbt already does both on the pull request. Leaving dbt is optional: Databricks runs it as a job task, so the question becomes who owns the logic.
- **Meaning (path 2).** Genie Ontology puts metric views and Pages written by people above definitions inferred from usage and ranked by authority. Snowflake ranks definitions the same way. Every independent writer says that ranking a definition is not checking it. The remedies on offer are old ones: named owners, and metric definitions kept in code and reviewed.
- **Storage (path 3).** Lakebase turns change capture and reverse ETL into database settings rather than pipelines you write. The version with no copy at all, LTAP, is not ready to build on. Agents get cheap branches to work in, and a person approves whatever leaves them.

**What it means for you.** Vendors and independents agree that these agents are only as good as the metadata, definitions and permissions beneath them, and that maintaining those is data-engineering work. Much of it is product data science under new names. Settling what "daily active user" means, declaring which measures can be summed, and showing that outputs match before and after a change are all familiar; the last is an A/A test on tables. Agent traces and Lakebase history tables are event logs, so measuring agents is analytics you already do. What is new is the scaffolding: Git, bundles, environments and CI; metric views written in YAML; and app-side database ideas such as the write-ahead log, schema migrations and branches.

One caution: almost everything readable in the window was written by vendors or partners. The June Summit launches fall just before it.

## The map

**Breadth** ([0-breadth.md](0-breadth.md))
- [Genie Code for pipelines](https://docs.databricks.com/aws/en/ldp/de-agent) - diffs, approvals, dry runs
- [Freight railroad case](https://www.databricks.com/blog/how-major-freight-railroad-scaled-pipeline-creation-genie-code) - skills plus templates
- [Scheduled tasks](https://docs.databricks.com/aws/en/genie-code/scheduled-tasks) - unattended, auto-approve on
- [Expanding Genie Agents](https://www.databricks.com/blog/expanding-genie-agents-deep-analysis-file-reasoning-and-more) - agent mode, files
- [Unity Catalog Pages](https://www.databricks.com/blog/unity-catalog-pages-governed-home-your-business-knowledge-genie-ontology) - owned business terms
- [Genie One MCP GA](https://www.databricks.com/blog/genie-one-mcp-now-generally-available) - Genie inside other assistants
- [Evaluate and monitor agents](https://docs.databricks.com/aws/en/mlflow3/genai/eval-monitor) - MLflow judges
- [MLflow Tracing](https://docs.databricks.com/aws/en/mlflow3/genai/tracing/) - traces as SQL tables
- [Agent-based security reviews](https://www.databricks.com/blog/how-i-built-agent-based-security-reviews-databricks) - measured from operational records
- [Lakebase Postgres](https://www.databricks.com/blog/object-storage-wal-lakebase-postgres-agentic-era) - the WAL in object storage
- [Managed agent memory](https://docs.databricks.com/aws/en/agents/agent-memory/managed-memory) - per-store access
- [Unity Gateway CLI](https://www.databricks.com/blog/deploy-and-manage-coding-agents-scale-unity-gateway-cli) - governed coding agents
- [Genie beyond BI (Qubika)](https://qubika.com/blog/databricks-genie-one-agents-ontology-code/) - the family mapped
- [Beyond autocomplete (Entrada)](https://entrada.ai/databricks-genie-code-governed-agentic-workflows/) - context decides quality

**Path 1 - Lakeflow Designer, analyst flow to engineer's pipeline** ([file](path-1-lakeflow-designer-handoff.md))
- [Designer Summer Release](https://docs.databricks.com/aws/en/release-notes/product/2026/july) - bundles, new operators
- [Move to production](https://docs.databricks.com/aws/en/designer/production) - a notebook in Git
- [Genie Code migration](https://docs.databricks.com/aws/en/ldp/de-agent) - dbt and Informatica in
- [Stop translating Alteryx boxes](https://community.databricks.com/t5/community-articles/stop-translating-alteryx-boxes-a-lakebridge-assisted-test-driven/td-p/163424) - migrate behaviour
- [dbt Canvas](https://docs.getdbt.com/docs/platform/canvas) - canvas to plain SQL
- [Build a visual data prep](https://docs.databricks.com/aws/en/designer/build-transformation) - three in-product review surfaces
- [Diggibyte on Designer](https://diggibyte.com/lakeflow-designer/) - "backed by real Python"
- [Pipeline unit tests](https://docs.databricks.com/aws/en/ldp/unit-testing) - editor only, not CI
- [SDP testing blueprint](https://community.databricks.com/t5/technical-blog/from-experiment-to-prod-lakeflow-spark-declarative-pipelines/ba-p/164292) - tests in CI by hand
- [dbt compare changes](https://docs.getdbt.com/docs/deploy/advanced-ci) - data diff on the PR
- [dbt in Lakeflow Jobs](https://docs.databricks.com/aws/en/jobs/how-to/use-dbt-in-workflows) - keeping dbt
- [dbt Databricks configs](https://docs.getdbt.com/reference/resource-configs/databricks-configs) - same objects from dbt
- [dbt Labs' reply](https://www.getdbt.com/blog/databricks-processes-your-data-dbt-defines-what-it-means) - who owns the logic
- [Lakebridge v0.15.0](https://github.com/databrickslabs/lakebridge/releases/tag/v0.15.0) - reconcile old and new

**Path 2 - Genie Ontology, business meaning for agents** ([file](path-2-genie-ontology-semantics.md))
- [Operationalizing Genie Ontology](https://www.databricks.com/blog/operationalizing-genie-ontology-your-data-stack) - model the head
- [Metric views](https://docs.databricks.com/aws/en/uc-semantics/metric-views/) - YAML measures
- [Understanding Genie Ontology (Genloop)](https://genloop.ai/blogs/understanding-genie-ontology) - OntoRank
- [Preparing your company (HiflyLabs)](https://hiflylabs.com/blog/2026/7/29/how-to-prepare-for-databricks-genie-ontology) - settle disputes first
- [Ossie vs warehouse-native (Datus)](https://datus.ai/blog/osi-vs-warehouse-native-semantics/) - Snowflake compared
- [Cortex Sense](https://www.snowflake.com/en/blog/enterprise-ai-agents-grounded-context/) - conflicts go to a person
- [Genie Ontology thread](https://community.databricks.com/t5/data-engineering/genie-ontology/td-p/164536) - no changelog, no export
- [Cortex Sense (DataHub)](https://datahub.com/blog/what-is-snowflake-cortex-sense/) - a catalog vendor's view
- [dbt_context_engineering](https://docs.getdbt.com/blog/dbt-context-engineering) - test context like metrics
- [Window measures](https://docs.databricks.com/aws/en/uc-semantics/metric-views/advanced-techniques) - semi-additive, fiscal periods
- [Metric view materialization](https://docs.databricks.com/aws/en/business-semantics/metric-views/materialization) - what rolls up
- [dbt metric_view PR](https://github.com/dbt-labs/dbt/pull/16054) - metric views as dbt models
- [Import BI files](https://docs.databricks.com/aws/en/dashboards/manage/import-bi) - Tableau and Power BI in
- [Semantic Studio](https://docs.snowflake.com/en/release-notes/2026/other/2026-08-26-semantic-studio-preview) - Snowflake's authoring surface

**Path 3 - Lakebase, the transactional database in the lakehouse** ([file](path-3-lakebase-for-data-engineers.md))
- [Synced tables](https://docs.databricks.com/aws/en/oltp/projects/reverse-etl) - reverse ETL as a setting
- [ISG on LTAP](https://research.isg-one.com/analyst-perspectives/databricks-unites-operational-and-analytic-workloads-on-the-lakehouse) - early, stay sceptical
- [LTAP and Lakehouse//RT (Zorost)](https://zorost.com/ltap-lakehouse-rt-one-copy) - "architect toward it"
- [Lakebase Search](https://docs.databricks.com/aws/en/oltp/projects/lakebase-search) - hybrid search in Postgres
- [Chronos paper](https://arxiv.org/html/2609.14889v1) - branching across stores
- [CDF quickstart](https://docs.databricks.com/aws/en/oltp/projects/quickstart-lakebase-cdf) - WAL to Delta history
- [Snowflake Postgres mirroring](https://www.snowflake.com/en/blog/engineering/postgres-to-snowflake-replication-mirroring/) - merged, not history
- [pg_lake and pg_duckdb (Merced)](https://datalakehousehub.com/blog/postgres-meets-the-lakehouse/) - when Postgres is enough
- [CDF into SCD2 PR](https://github.com/Irtebat/claims-adjudication-agent-demo/pull/6) - history to SCD Type 2
- [Temporal and Lakebase](https://www.databricks.com/blog/build-durable-agents-temporal-and-lakebase) - history as agent audit
- [Genie in Lakebase](https://docs.databricks.com/aws/en/oltp/projects/observability-genie) - proposes, never applies
- [Lakebase API](https://docs.databricks.com/aws/en/oltp/projects/api-usage) - branches on demand
- [Neon, 18 September](https://neon.com/docs/changelog/2026-09-18) - the whole backend branches
- [lakeFS agent sandbox](https://lakefs.io/blog/agentic-data-sandbox/) - branch, validate, merge
- [PlanetScale branching (Autonoma)](https://getautonoma.com/blog/planetscale-branching-for-previews) - schema-only branches

## How it fits together

- **Paths 1 and 2 meet at dbt.** The dbt adapter now builds streaming tables, materialized views and metric views on Databricks, so the choice between dbt and Databricks-native tools is about ownership rather than capability.
- **Paths 2 and 3 meet at access rules.** Row security blocks metric-view materialization, and masking per Lakebase branch is barely documented.
- **This run extends the [2026-09-24 data-engineering exploration](../2026-09-24-what-a-product-data-scientist-moving-into-data-engineering-s/README.md).** It adds the review of generated pipelines to that run's agent-context thread, its AUTO CDC path now has a source to feed it, and it follows the Databricks lead that run left unfollowed.
- **Path 3 touches `agent-efficacy`.** Trace and history tables are the raw data for measuring agents.

**Two leads not followed that you might have picked:** Genie ZeroOps and scheduled Genie Code as operations agents (breadth L1a), and how Databricks shows a judge agrees with people, for `efficacy-methodology` (breadth L3b).

## Candidate topics

Proposals only. None of these is in the profile.

- `generated-pipeline-review` · Depth, under `warehouse-agentic`: how pipeline changes made by a canvas or an agent are reviewed - the artifact in Git, tests in CI, data diffs, migration equivalence checks. *From path 1.*
- `learned-context-curation` · Depth, under `semantic-models`: metric views and learned-context layers (Genie Ontology, Cortex Sense) - how definitions are modelled, ranked and kept correct. *From path 2.*
- `lakehouse-postgres` · Depth, under `warehouse-agentic`: Postgres inside the lakehouse (Lakebase, Snowflake Postgres) - CDC and reverse ETL as features, branches as agent sandboxes. *From path 3.*
