# Path 3 - Lakebase: the transactional database arrives in the lakehouse

This path starts from lead L4a in angle 4 of the breadth pass ("The layer agents run on"). That angle introduced Lakebase, Databricks' managed Postgres, through its August engineering post on storing the write-ahead log in object storage. Level 1 reads what has been written since late June about Lakebase from a data engineer's side. That covers the two sync directions between Postgres and the lakehouse, LTAP (the claim that one copy of data can serve both), branching, and Lakebase Search. The sources are Databricks docs, an independent analyst, a partner consultancy and an MIT research paper.

## Level 1 - Lakebase for data engineers

### Serve lakehouse data with synced tables
[link](https://docs.databricks.com/aws/en/oltp/projects/reverse-etl) · 2026-09-18 (last updated) · vendor docs · read in full · search
1. **What it is about:** A synced table is a read-only copy of a lakehouse table (Delta, Iceberg or a view) inside Lakebase Postgres, kept fresh by a managed Lakeflow pipeline. This is *reverse ETL*: pushing analytical results back out to an app that needs fast single-row lookups. Stack: storage, the bridge from lakehouse to app.
2. **Why you're seeing it:** `warehouse-agentic`, and the lead's reverse ETL question.
3. **Seen before?** No. The 2026-09-24 run covered data flowing into the lakehouse, not out of it.
4. **Relates to:** The opposite direction, Lakebase Change Data Feed (**Background**, [docs updated 2026-06-11](https://docs.databricks.com/aws/en/oltp/projects/lakehouse-sync)), writes every Postgres change into a Delta history table.
5. **Takeaways for you:** You still choose a primary key and a mode: snapshot, triggered or continuous (15-second minimum). Schema changes must be additive, and apps cannot write to the copy. The pipeline is managed for you, but it still exists.

### Databricks Unites Operational and Analytic Workloads on the Lakehouse
[link](https://research.isg-one.com/analyst-perspectives/databricks-unites-operational-and-analytic-workloads-on-the-lakehouse) · 2026-07-08 · independent analyst (Matt Aslett, ISG Software Research) · read in full · search
1. **What it is about:** An analyst's view of LTAP. *OLTP* databases handle an app's many small reads and writes. *OLAP* systems scan large amounts of history for analysis. LTAP is Databricks' name for one copy of data, kept in open lake formats, that serves both. Stack: storage.
2. **Why you're seeing it:** `warehouse-agentic`, `analytics-broad`.
3. **Seen before?** The breadth pass named LTAP from Databricks' own post. This is the first outside view of it.
4. **Relates to:** *CDC* (change data capture: copying each app change into the warehouse), which path 2 of the 2026-09-24 run showed as AUTO CDC INTO. LTAP's pitch is that this pipeline goes away.
5. **Takeaways for you:** Aslett calls ending replication "a holy grail" but says every OLTP-on-lakehouse offering is "in the early stages of development". He advises including Databricks in evaluations while staying sceptical.

### LTAP and Lakehouse//RT, One Copy of Data for Everything
[link](https://zorost.com/ltap-lakehouse-rt-one-copy) · 2026-07-08 · partner consultancy blog (Zorost, unsigned) · read in full · search
1. **What it is about:** A consultancy that works on Databricks explains two June announcements. One is LTAP. The other is Lakehouse//RT, a new warehouse type built on the Rust-based Reyden engine that answers queries over Delta and Iceberg tables in milliseconds. Stack: storage and compute.
2. **Why you're seeing it:** `warehouse-agentic`.
3. **Seen before?** No.
4. **Relates to:** Databricks' [VLDB post](https://www.databricks.com/blog/building-ai-era-lakebase-streaming-and-lakehouse-innovations-vldb-2026) (2026-08-27) calls Lakebase plus Lakehouse//RT "the first true" LTAP system. The [release notes](https://docs.databricks.com/aws/en/release-notes/lakebase/) list one piece so far: LTAP Direct Writes (beta, 2026-08-25), which speeds up synced-table loads.
5. **Takeaways for you:** The post quotes Reynold Xin, Databricks' co-founder: CDC "really stands for 'continuous data corruption'". Its advice is "you cannot architect around it yet, only toward it". It calls the effect on reverse ETL "less direct".

### Lakebase Search
[link](https://docs.databricks.com/aws/en/oltp/projects/lakebase-search) · 2026-09-15 (last updated; GA in the 2026-09-18 release note) · vendor docs · read in full · search
1. **What it is about:** Two Postgres extensions. `lakebase_vector` does vector search, which finds rows with similar meaning using embeddings. `lakebase_text` does BM25 keyword ranking. One SQL query can combine the two into hybrid search. Stack: storage, used for agent retrieval.
2. **Why you're seeing it:** `warehouse-agentic`.
3. **Seen before?** No. Managed agent memory (breadth angle 4) runs on this same database.
4. **Relates to:** Neon's [post](https://neon.com/blog/lakebase-search-on-neon) (2026-07-02). Neon is the Postgres company that became part of Databricks. The Databricks [launch post](https://www.databricks.com/blog/announcing-lakebase-search-agent-native-retrieval-built-lakebase-postgres) (**Background**, 2026-06-16) says agents "need that exact data fully indexed and searchable on the next" turn. It also says AI Search remains the fully managed option.
5. **Takeaways for you:** BM25 "computes corpus statistics at build time, not incrementally". Keyword results are only as fresh as the last index rebuild, and scheduling that rebuild is pipeline work.

### Chronos: Efficient Bolt-on Branching Across Data Stores for Stateful Agentic Applications
[link](https://arxiv.org/html/2609.14889v1) · 2026-09-14 (revised 2026-09-17) · research preprint (MIT CSAIL and University of Arizona; Madden, Stonebraker et al.) · read in full · search
1. **What it is about:** Agents often try several approaches before keeping one, and each attempt can change files, database rows and vector indexes. *Branching* gives each attempt a private copy of that state, which costs almost nothing until it changes. Chronos branches several stores together without modifying them. Stack: storage, across systems.
2. **Why you're seeing it:** `warehouse-agentic`. Branching is Databricks' main argument that Lakebase is the database for agents.
3. **Seen before?** No. Nessie's Git-style table branches appeared on 2026-09-24.
4. **Relates to:** Sadalage and Hartman's three-part Lakebase branching series (**Background**, [June](https://www.databricks.com/blog/enabling-evolutionary-database-development-database-branching-lakebase-part-3)). It describes one parent database, a long-lived branch per environment, and agents held to the same gates as developers.
5. **Takeaways for you:** The paper puts Neon among single-store systems that leave the application "to align their versions and coordinate every cross-store merge". An agent's state rarely lives in one database.

**Leads:**
- **L1-a** - Lakebase Change Data Feed, the direction from app to lakehouse. Cover how the `wal2delta` extension turns Postgres's write-ahead log into `lb_<table>_history` Delta tables, what `REPLICA IDENTITY FULL` and the other preconditions ask of app teams, and how a data engineer turns history rows into current-state and SCD Type 2 tables (with AUTO CDC or materialized views). Compare it with Snowflake Postgres's `pg_lake` and with conventional CDC tools such as Debezium and Fivetran. Read Databricks docs, the Lakebase CDF templates, and community and practitioner write-ups since July 2026.
- **L1-b** - Branches and snapshots as the agent's sandbox in Lakebase. Cover the Postgres APIs (GA 2026-08-14) that let an agent create and discard branches, Genie Code inside the Lakebase UI (2026-08-24), point-in-time restore, and what a data engineer sets per branch: permissions, masking, promotion rules. Read alongside cross-store branching research such as Chronos and Neon's own writing on agent-created databases, since July 2026.

**So what:** What Lakebase ships today does not remove CDC or reverse ETL. It turns both into managed features you configure (a key, a mode, additive-only schema changes) rather than pipelines you write. LTAP, the version with no copy at all, is what both outside readers say you cannot build on yet. The case for Lakebase as the agents' database rests on cheap branches and search inside the same Postgres, and the MIT paper's point is that an agent's state usually spans more than one store.

**Looked for and not found:** a hands-on practitioner review of synced tables or Change Data Feed dated in the window (search returned only docs and a Medium post, which refuses), and a dated in-window piece on Snowflake Postgres to compare against (only its February GA material and a July webinar listing turned up; level 2a later found one).

## Level 2a - Lakebase Change Data Feed: app changes into the lakehouse

### Store Postgres changes in the lakehouse (Lakebase CDF quickstart)
[link](https://docs.databricks.com/aws/en/oltp/projects/quickstart-lakebase-cdf) · 2026-09-18 (last updated) · vendor docs · read in full · search
1. **What it is about:** The four-step setup for Lakebase Change Data Feed (CDF). An extension called `wal2delta` reads Postgres's write-ahead log (WAL: the log of every change, written before the change is applied). It appends each change as a row to a Delta table named `lb_<table>_history`, about every 15 seconds. Stack: the bridge from the app database to the lakehouse.
2. **Why you're seeing it:** `warehouse-agentic`. This is the mechanism the lead asked about.
3. **Seen before?** Level 1's synced-tables item mentioned CDF in passing (**Background**, [concept page updated 2026-06-11](https://docs.databricks.com/aws/en/oltp/projects/lakebase-cdf)).
4. **Relates to:** That page's limits: no partitioned tables, and a schema change re-copies the whole table.
5. **Takeaways for you:** App teams run `ALTER TABLE ... REPLICA IDENTITY FULL`, so Postgres logs the whole row before and after each change. One update becomes two rows, `update_preimage` and `update_postimage`. Getting to SCD Type 2 is left to you.

### How we pushed CDC into Postgres - and turned replication into clockwork
[link](https://www.snowflake.com/en/blog/engineering/postgres-to-snowflake-replication-mirroring/) · 2026-07-23 · vendor engineering blog (Marco Slot, Snowflake) · read in full · search
1. **What it is about:** Snowflake Postgres is Snowflake's managed Postgres, built from its 2025 purchase of Crunchy Data. Its "data mirroring" runs a `snowflake_cdc` extension inside Postgres. The extension writes batches of changes into Iceberg change logs (Iceberg is an open table format, a peer of Delta), and Snowflake merges them in. Stack: the same bridge, built by a rival.
2. **Why you're seeing it:** `warehouse-agentic`, where the profile names Snowflake first.
3. **Seen before?** No. Level 1 found no in-window Snowflake Postgres piece, and this fills that gap.
4. **Relates to:** Same move as `wal2delta`: capture runs inside the database. `pg_lake` provides the transactions that span Postgres and Iceberg.
5. **Takeaways for you:** Slot's objection to external CDC is that the consumer "knows nothing about the state of Postgres". Mirroring moves all tables "exactly to a Postgres transaction boundary", so you receive merged tables, not a history to model.

### Postgres Meets the Lakehouse: pg_lake, pg_duckdb, and When Postgres Is Enough
[link](https://datalakehousehub.com/blog/postgres-meets-the-lakehouse/) · 2026-09-02 · practitioner blog (Alex Merced) · read in full · search
1. **What it is about:** Two Postgres extensions that bring lakehouse features into Postgres itself. With `pg_lake`, Postgres owns Iceberg tables on object storage, and each Iceberg write is part of a Postgres transaction. `pg_duckdb` embeds the DuckDB analytics engine. Stack: storage, seen from Postgres.
2. **Why you're seeing it:** `warehouse-agentic`, `analytics-broad`.
3. **Seen before?** No.
4. **Relates to:** Conventional CDC works like this: Debezium (an open-source tool that reads the WAL) publishes changes to Kafka (a message stream), and a sink writes them to the lake. Merced says `pg_lake` can replace that chain with a scheduled SQL insert.
5. **Takeaways for you:** The catch is that "Only Postgres writes pg_lake tables". Other engines can read them but not write them. He also gives rough limits for when Postgres alone is enough: hundreds of gigabytes to low terabytes of data, and fewer than fifty analysts querying at once.

### Replace Parquet history with native CDF SCD2 (claims-adjudication-agent-demo #6)
[link](https://github.com/Irtebat/claims-adjudication-agent-demo/pull/6) · 2026-09-24 · GitHub pull request (Irtebat) · read in full · search
1. **What it is about:** A demo claims-processing agent replaces its home-built history tables with real CDF. The flow is Lakebase, then `lb_claims_history`, then AUTO CDC. AUTO CDC stores the data as SCD Type 2: one row per version of a record, each with the dates it was valid. Gold views show current state and full history. Stack: pipeline modelling.
2. **Why you're seeing it:** `warehouse-agentic`. It carries out the lead's step of turning history rows into SCD2.
3. **Seen before?** AUTO CDC INTO and SCD2 were covered in path 2 of the 2026-09-24 exploration. Here CDF feeds them.
4. **Relates to:** A [workshop issue](https://github.com/pablordoricaw/stryker-cr-workshop-09232026/issues/40) (2026-09-23) fakes `lb_<table>_history` when setup fails, because "CDF is unsupported on default-storage catalogs".
5. **Takeaways for you:** Both repos treat the history table's columns as the contract downstream code relies on. The friction was in naming: the PR needed commits to quote CDF table names and to handle prefixed streaming state.

### Build durable agents with Temporal and Lakebase
[link](https://www.databricks.com/blog/build-durable-agents-temporal-and-lakebase) · 2026-09-08 · vendor blog (Sam Ingbar, Databricks) · read in full · search
1. **What it is about:** An underwriting agent built on Temporal, a framework that records each step of a long-running job so the job can resume after a crash. The agent writes its run status, tool calls, reviews and metrics to Lakebase tables. Stack: agent layer, feeding storage.
2. **Why you're seeing it:** `warehouse-agentic` and `agent-efficacy`, because the feed becomes a record of what an agent did.
3. **Seen before?** No.
4. **Relates to:** Level 1 argued that Lakebase is the agent's database. Here its change log becomes the audit trail.
5. **Takeaways for you:** The repo sets `REPLICA IDENTITY FULL` on every table, but "an administrator still has to enable the feature". The history tables "can reconstruct a run's policy source, tool evidence, Activity attempts, review wait, recommendation, and human decision". That is the raw material for measuring an agent.

**Leads:**
- **L2a-a** - Modelling Lakebase history tables downstream. How the AUTO CDC recipe handles `update_preimage` rows, how it orders changes (`_sort_by` or `_pg_lsn`), and how it treats deletes. Also covers DevHub's "Medallion Architecture from CDC History Tables" template, and what happens in an SCD2 table when a schema change re-copies every row as a fresh `insert`.
- **L2a-b** - CDC inside the database versus outside it. On one side are Lakebase `wal2delta` and Snowflake's `snowflake_cdc` with `pg_lake`. On the other are Lakeflow Connect's Postgres connector (Databricks' managed ingestion; its [FAQ](https://docs.databricks.com/aws/en/ingestion/lakeflow-connect/postgresql-faq), updated 2026-09-11, warns that the WAL can fill the disk if its gateway stops) and Debezium. Also covers what `REPLICA IDENTITY FULL` asks of tables with many updates.

**So what:** Databricks and Snowflake have both moved CDC inside Postgres. On Lakebase, the app team's share is one `ALTER TABLE` per table, and a pipeline you once ran becomes a feature someone switches on. They differ in what arrives. Snowflake delivers tables already merged to a transaction boundary. Lakebase delivers a history table, so the SCD2 and current-state modelling from the 2026-09-24 AUTO CDC path is still your job. The Temporal example shows that the history is useful beyond pipelines, as a replayable record of every step an agent took.

## Level 2b - Branches as the agent's sandbox

### Diagnose and fix issues with Genie
[link](https://docs.databricks.com/aws/en/oltp/projects/observability-genie) · 2026-07-30 (last updated) · vendor docs · read in full · search
1. **What it is about:** Genie is Databricks' AI assistant, and it now runs inside the Lakebase console. The Genie Code entry arrived there on 2026-08-24, per the [release notes](https://docs.databricks.com/aws/en/release-notes/lakebase/). You describe a database problem in plain words. It reads live Postgres state, query plans and the history of schema changes, then proposes a fix. Stack: an agent working on the database itself.
2. **Why you're seeing it:** `warehouse-agentic`. The lead asked about Genie Code in Lakebase.
3. **Seen before?** No. Level 1 covered sync and search, not an agent operating the database.
4. **Relates to:** [Point-in-time restore](https://docs.databricks.com/aws/en/oltp/projects/point-in-time-restore) (docs, 2026-09-11). A restore creates a new branch holding the data as it was at a chosen moment, up to 30 days back. The old branch keeps running, and apps have to be pointed at the new one.
5. **Takeaways for you:** Genie's usual recovery is to propose a branch from just before the bad change. The docs say "Genie never restores, modifies, or applies a fix on its own." The agent gets a branch, and a human still approves every change.

### Lakebase API guide
[link](https://docs.databricks.com/aws/en/oltp/projects/api-usage) · 2026-09-22 (last updated; GA 2026-08-14) · vendor docs · read in full · search
1. **What it is about:** The REST API and SDKs for creating and deleting projects, branches, computes, roles and snapshots. This is what lets a script or an agent make a branch per task and then throw it away. Stack: the control layer above the database.
2. **Why you're seeing it:** `warehouse-agentic`.
3. **Seen before?** Level 1's Chronos paper covered branching in general. This is Lakebase's own mechanism.
4. **Relates to:** The [Branches](https://docs.databricks.com/aws/en/oltp/projects/branches) page (2026-09-11). A *protected* branch cannot be deleted or reset. A *reset* pulls the parent's current data into a child, "only one direction (parent → child)".
5. **Takeaways for you:** Neither page covers masking (hiding sensitive columns) or permissions per branch. A May Databricks post (**Background**, [Backstage part 2](https://www.databricks.com/blog/backstage-lakebase-part-2)) says Unity Catalog masking policies follow a new branch automatically.

### Neon changelog, 18 September 2026
[link](https://neon.com/docs/changelog/2026-09-18) · 2026-09-18 · vendor changelog · read in full · search
1. **What it is about:** Neon is the serverless Postgres company Databricks acquired, and its storage engine sits under Lakebase. Neon's full backend is now generally available. The database, object storage, login and functions all branch together, "so a PR, preview, or agent session gets your entire backend."
2. **Why you're seeing it:** `warehouse-agentic`. It is Neon's own writing on databases that agents create.
3. **Seen before?** Level 1 cited Neon only for Lakebase Search.
4. **Relates to:** The [2026-09-11 changelog](https://neon.com/docs/changelog/2026-09-11) adds "claimable" projects: an agent creates one with no account, and a person takes ownership later. Neon's [May post](https://neon.com/blog/were-building-backends) (**Background**) asks for "rollback, and cost controls before the sci-fi layer."
5. **Takeaways for you:** Neon's answer to Chronos's point is to branch every store it owns. That covers an app's stores, not lakehouse tables.

### Agentic Data Sandbox: Safely Run AI Agents on Prod Data
[link](https://lakefs.io/blog/agentic-data-sandbox/) · 2026-08-25 (updated 2026-09-21) · vendor blog (lakeFS, Tal Sofer) · read in full · search
1. **What it is about:** lakeFS is an open-source layer that adds Git-style branches to files and tables in object storage. The post defines an agent sandbox in four steps: branch production data for each agent or run, let the agent work, validate the result, then merge it or discard it. Stack: storage, on the lake side.
2. **Why you're seeing it:** `warehouse-agentic`.
3. **Seen before?** Partly. Nessie's table branches appeared on 2026-09-24, but lakeFS is new.
4. **Relates to:** lakeFS's product launch, [lakeFS for Agentic AI](https://www.businesswire.com/news/home/20260610833771/en/lakeFS-for-Agentic-AI-Isolated-Reproducible-Enterprise-Data-for-Every-Agent) (**Background**, 2026-06-10).
5. **Takeaways for you:** The merge gate is yours to build: data-quality checks, least-privilege access, an audit trail, and human approval for risky changes. Lakebase's reset only flows from parent to child, but lakeFS merges a branch's data back.

### PlanetScale Branching vs Managed Preview Data: What Each Actually Isolates
[link](https://getautonoma.com/blog/planetscale-branching-for-previews) · July 2026 (month only) · vendor blog (Autonoma, a testing company; Tom Piaggio) · read in full · search
1. **What it is about:** PlanetScale is a managed MySQL and Postgres host. Its branches copy the *schema* (table structure) but not the data, so a new MySQL branch starts empty. A change reaches production through a *deploy request*: a schema diff that someone reviews and that is applied without locking tables.
2. **Why you're seeing it:** `warehouse-agentic`. It covers the lead's questions on schema-migration review and promotion.
3. **Seen before?** No.
4. **Relates to:** [PandaStack's comparison](https://www.pandastack.ai/blog/best-postgres-branching-platforms-2026/) (2026-08-16) sorts branching into three kinds: copy-on-write (Neon, Supabase), schema-only (PlanetScale) and whole-machine clones.
5. **Takeaways for you:** "A deploy request tells you the migration is safe. It says nothing about whether the branch behind it has data worth testing against." Copy-on-write branches come with real data, so masking that data becomes the data engineer's job.

**Leads:**
- **L2b-a** - Governance that follows a branch. Cover how Unity Catalog masking and row-level security (rules on which rows a user may see) carry over to new Lakebase branches, and how branch actions land in the audit log. Compare this with lakeFS merge hooks and with anonymized branches in Neon and Supabase. Read the Backstage series, the Unity Catalog attribute-based access docs, and Neon's anonymization docs.
- **L2b-b** - Promotion without a data merge. Cover how a change on an agent's Postgres branch becomes a reviewed schema migration on production. Read about migration tools (Flyway, Liquibase, Atlas), PlanetScale deploy requests, Supabase migrations, and the Sadalage and Hartman "evolutionary database" practices.

**So what:** Across vendors, the agent's sandbox is a copy-on-write branch, and its safety rests on a human approving whatever leaves it: Genie proposes and waits, lakeFS gates each merge, and PlanetScale reviews each schema diff. For a data engineer, the work moves from building copies to setting the rules at the edges of a branch. That means who can see masked data inside it, and what checks a change must pass to reach production. The databases differ most on whether a branch's data can be merged back, and the lake-side tools are the ones that allow it.

## Where this path ends

Lakebase brings the app's own database, Postgres, inside Databricks. Today it does not remove the two pipelines that have always joined apps to warehouses; it moves them inside the database and turns them into settings. Change Data Feed writes every app change into a Delta history table, synced tables push lakehouse results back out to apps, and in both cases you choose keys, modes and schema rules instead of writing the pipeline. Snowflake has made the same move with its own Postgres, differing mainly in that it delivers merged tables where Lakebase delivers a history you still model into SCD Type 2. LTAP, one copy of data with no pipeline at all, is what outside analysts say you cannot yet build on. The case for Lakebase as the agents' database rests on branching: cheap copy-on-write copies where an agent can work, with a person approving anything that leaves. Every vendor read here puts the data engineer at the edges of that branch, deciding who sees masked data inside it and what checks a change must pass to reach production. Databricks' own docs are still thin on masking per branch. For you this is the least familiar part of the run: app-side concepts such as the write-ahead log, replica identity and schema migrations. It also has a payoff you will recognise. The history tables are an event log of what each agent did, which makes them the raw material for measuring agents.
