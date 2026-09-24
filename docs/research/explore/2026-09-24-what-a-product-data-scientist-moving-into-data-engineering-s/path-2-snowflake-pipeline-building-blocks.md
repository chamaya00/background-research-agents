# Path 2 - How a Snowflake pipeline is built in 2026

This path starts from breadth angle 3, where Snowflake's agent CoCo writes and
operates the pipeline. It covers the pieces the agent is working with: Openflow
and Snowpipe Streaming to bring data in, Dynamic Tables to transform it, and
dbt Projects on Snowflake to test and deploy the transformations.

## Level 1 - The building blocks

### Openflow gen 1 and gen 2
[link](https://docs.snowflake.com/en/user-guide/data-integration/openflow/gen2/openflow-generations) · undated page; gen 2 deployments GA 2026-09-08 · vendor doc · read in full

1. **What it is about:** Openflow is Snowflake's ingestion service, built on Apache NiFi (an open-source tool for moving data), with 40+ connectors for sources such as Postgres, Salesforce and Kafka. The page compares the two generations. In gen 2, a connector is a schema-level object whose settings live in a versioned `config.json`. You edit a "live" copy, `COMMIT` it to the "default" version, then `START` it. That is [the SQL setup page](https://docs.snowflake.com/en/user-guide/data-integration/openflow/gen2/configure-connector-sql).
2. **Why you're seeing it:** It is the ingestion layer an agent now has to operate (`warehouse-agentic`).
3. **Seen before?** Yes. The breadth pass reported the gen 2 preview note. This page shows how it works.
4. **Relates to:** dbt Projects below. Both use the same draft, commit and promote cycle.
5. **Takeaways for you:** Openflow promises "promote configurations from dev to production without click-ops." Connector configuration is still in public preview.

### Snowpipe Streaming Elastic Channels is now GA
[link](https://www.snowflake.com/en/blog/snowpipe-streaming-elastic-channels-ga/) · 2026-09-16 · vendor blog · read in full

1. **What it is about:** Snowpipe Streaming writes rows straight from applications into tables within seconds. Plain Snowpipe loads files instead. Elastic Channels let many producers write to one table without managing "channels". Named Channels are still there for sources that need strict ordering, such as Kafka or change capture.
2. **Why you're seeing it:** It is the real-time entry point of a Snowflake pipeline, and the post suggests asking CoCo to build one (`warehouse-agentic`).
3. **Seen before?** New to you.
4. **Relates to:** Openflow above, which handles connectors to other systems. Streaming handles your own applications. The [overview](https://docs.snowflake.com/en/user-guide/snowpipe-streaming/data-load-snowpipe-streaming-overview) says when to use which.
5. **Takeaways for you:** Elastic Channels deliver "at-least-once" and without ordering, so rows can arrive twice. Give every event a stable ID and remove duplicates downstream. That is usually a Dynamic Table's job.

### Comprehensive Guide to Snowflake Dynamic Tables
[link](https://www.snowflake.com/en/developers/guides/comprehensive-guide-to-dynamic-tables/) · updated 2026-07-15 · vendor developer guide · read in full

1. **What it is about:** A hands-on guide to Dynamic Tables. A Dynamic Table is a table you define with a `SELECT` and a `TARGET_LAG` (how fresh it must be), and Snowflake keeps it refreshed, where possible only for the rows that changed. The guide covers layered pipelines, the four refresh modes, deduplication and slowly changing dimensions, Iceberg output, and scheduling from dbt.
2. **Why you're seeing it:** This is Snowflake's default transformation engine, and CoCo has a `/dynamic-tables` skill to scaffold and debug it (`warehouse-agentic`).
3. **Seen before?** New to you.
4. **Relates to:** dbt Projects below. dbt can create Dynamic Tables, but not the custom `REFRESH USING` kind. A [July practitioner comparison](https://blog.dataengineerthings.org/dbt-incremental-models-vs-snowflake-dynamic-tables-f13eb6062d68) with dbt incremental models could not be opened.
5. **Takeaways for you:** They replace the older streams-plus-tasks approach, where you scheduled your own `MERGE` statements: "No orchestration code. No refresh babysitting." The guide says "ADAPTIVE is the mode to reach for on messy, real-world data."

### Predict refresh behavior with EXPLAIN CHANGES
[link](https://docs.snowflake.com/en/user-guide/dynamic-tables/predict-refresh) · GA 2026-09-15 · vendor doc · read in full

1. **What it is about:** `EXPLAIN CHANGES` goes in front of a change to a Dynamic Table and reports what the next refresh would do, without applying the change. The possible answers are incremental, full, reinitialize, no data, or failure, and it gives a reason when one is available.
2. **Why you're seeing it:** It is a check a reviewer, or an agent, can run on a change before it ships (`warehouse-agentic`).
3. **Seen before?** The breadth pass's CoCo post said never let the agent touch production directly. This is one tool for checking first.
4. **Relates to:** [DCM Projects for Dynamic Tables](https://www.snowflake.com/en/developers/guides/dcm-projects-for-dynamic-tables/) (updated 2026-08-10). It defines a whole pipeline as code with a plan-then-deploy cycle, and uses "frozen regions" so historical rows are not recomputed.
5. **Takeaways for you:** A small edit can trigger a costly rebuild. For example, removing a frozen region reinitialises the table. The check covers only the table you name, not the tables downstream of it.

### Tutorial: Slim CI and per-PR databases for dbt Projects on Snowflake
[link](https://docs.snowflake.com/en/user-guide/tutorials/dbt-projects-on-snowflake-advanced-ci-cd-tutorial) · undated page; features GA [2026-09-10](https://docs.snowflake.com/en/release-notes/2026/other/2026-09-10-dbt-artifacts-slim-ci-defer-to-production-ga) · vendor tutorial · read in full

1. **What it is about:** dbt Projects on Snowflake runs dbt inside the warehouse as a database object. You deploy it, run it with `EXECUTE DBT PROJECT` and schedule it with tasks. The tutorial builds CI in GitHub Actions: it clones production into a database for each pull request, then builds and tests only the changed models, reading unchanged ones from production.
2. **Why you're seeing it:** It covers how dbt work gets reviewed and shipped on Snowflake (`dbt-context`, `warehouse-agentic`).
3. **Seen before?** The breadth pass covered dbt v2. This is dbt running inside Snowflake.
4. **Relates to:** [Mechanical Rock's review](https://www.mechanicalrock.io/blog/running-dbt-on-snowflake) (July 2025, background) complained that users were deploying from personal Workspaces. This tutorial deploys from CI instead.
5. **Takeaways for you:** Learn `state:modified+` and `--defer`. They keep CI fast, and they are what let a reviewer test an agent's pull request safely.

**Leads:**
1. L2-1a - Dynamic Tables as the transformation layer in depth: refresh modes (AUTO, INCREMENTAL, FULL, ADAPTIVE, and custom incremental, GA 2026-07-27), frozen regions and BACKFILL FROM, refresh boundaries, EXPLAIN CHANGES, and how Dynamic Tables are declared from dbt models and DCM Projects. Read Snowflake's Dynamic Tables user guide and developer guides, the CoCo `/dynamic-tables` skill, and practitioner comparisons with dbt incremental models, for which layer of a pipeline each approach suits.
2. L2-1b - Running dbt inside Snowflake as a team: dbt project objects, Workspaces and CoCo Desktop's Snowflake-managed mode, `env.yml` environments, Slim CI, defer and per-pull-request clones, failed-run recovery, and scheduling with tasks versus Airflow. Read Snowflake's dbt Projects docs, best-practices page and CI/CD tutorial, plus practitioner operations write-ups such as Jeremiah Hansen's deep dive (revised 2026-09-12), for how the develop, review and deploy loop works when an agent writes the models.

## Level 2 - Dynamic Tables in depth

### Dynamic table refresh modes
[link](https://docs.snowflake.com/en/user-guide/dynamic-tables/refresh-modes) · undated page; ADAPTIVE GA [2026-07-30](https://docs.snowflake.com/en/release-notes/2026/other/2026-07-30-dynamic-tables-adaptive-refresh-mode-ga) · vendor doc · read in full

1. **What it is about:** How a Dynamic Table decides what to recompute. INCREMENTAL processes only changed rows. FULL reruns the whole query. AUTO picks one of those two once, at creation. ADAPTIVE runs incrementally but rebuilds from scratch when a bulk change makes that cheaper. The mode is fixed when the table is created.
2. **Why you're seeing it:** It is the first choice made when you, or an agent, write a Dynamic Table (`warehouse-agentic`).
3. **Seen before?** Level 1's comprehensive guide named the four modes and recommended ADAPTIVE. This page gives the rules behind each one.
4. **Relates to:** Databricks' refresh policy below, which offers the same choice under other names.
5. **Takeaways for you:** The page keeps AUTO for exploration and prototyping, because it "does not re-evaluate on subsequent refreshes". INCREMENTAL suits tables where under about five percent of the data changes between refreshes.

### Snowflake Dynamic Tables: Custom Incrementalization
[link](https://www.snowflake.com/en/blog/engineering/custom-incremental-dynamic-tables/) · 2026-07-27 · vendor engineering blog · read in full

1. **What it is about:** A Snowflake engineer, Anirudh Santhiar, explains custom incremental Dynamic Tables, which went GA [the same day](https://docs.snowflake.com/en/release-notes/2026/other/2026-07-27-dynamic-tables-custom-incremental-ga). Instead of a `SELECT`, you write the refresh yourself as `MERGE INTO SELF` or `INSERT INTO SELF`, and read only the changed rows through the `CHANGES` clause. Snowflake still handles scheduling, retries and tracking which changes were processed.
2. **Why you're seeing it:** This is where Dynamic Tables meet dbt's hand-written incremental logic (`warehouse-agentic`, `dbt-context`).
3. **Seen before?** Level 1 said dbt cannot create this kind of table. This post explains what it is.
4. **Relates to:** dbt's `is_incremental()` high-watermark pattern, which the post rebuilds, and the streams-plus-tasks approach from Level 1.
5. **Takeaways for you:** Use it for joining a stream of facts to the current dimension, soft deletes, and running state. The post's caveat is that the table stops being a pure function of its inputs, so a bad merge persists.

### DCM Projects for Dynamic Tables
[link](https://www.snowflake.com/en/developers/guides/dcm-projects-for-dynamic-tables/) · updated 2026-08-10 · vendor developer guide · read in full

1. **What it is about:** Yoav Ostrinsky's hands-on guide to declaring a Dynamic Table pipeline in a DCM (Database Change Management) Project, Snowflake's infrastructure-as-code tool. You keep `DEFINE DYNAMIC TABLE` files and a `manifest.yml` of environments in Git. Then you plan (a dry run listing every change) and deploy, which applies `CREATE OR ALTER` rather than dropping tables.
2. **Why you're seeing it:** It is the Snowflake-native way to keep a whole pipeline as reviewable code (`warehouse-agentic`).
3. **Seen before?** Level 1 linked it from EXPLAIN CHANGES. This is the guide itself.
4. **Relates to:** The [frozen regions page](https://docs.snowflake.com/en/user-guide/dynamic-tables/frozen-regions). Widening a frozen region is free, but narrowing it rebuilds the table. `BACKFILL FROM` clones existing history into a new table, and edits to frozen rows went GA [2026-07-20](https://docs.snowflake.com/en/release-notes/2026/other/2026-07-20-dynamic-tables-dml-frozen-regions).
5. **Takeaways for you:** The example adds an `AI_CLASSIFY` column. Only recent rows are classified, and frozen history keeps `NULL`.

### [Feature] Snowflake Dynamic tables: Support for Adaptive refresh mode
[link](https://github.com/dbt-labs/dbt/issues/16163) · 2026-09-02 · GitHub issue (dbt Labs) · read in full

1. **What it is about:** An open request, still in triage, for dbt's `dynamic_table` materialization to accept ADAPTIVE. dbt's docs list only AUTO, FULL and INCREMENTAL.
2. **Why you're seeing it:** It shows how far you can declare Dynamic Tables from dbt today (`dbt-context`, `warehouse-agentic`).
3. **Seen before?** Level 1 noted that dbt cannot make the custom `REFRESH USING` kind. This is a second gap.
4. **Relates to:** dbt's [Snowflake configs page](https://docs.getdbt.com/reference/resource-configs/snowflake-configs). It supports frozen regions as `immutable_where` (v1.11 and later), but "Dynamic table SQL cannot be updated; the dynamic table must go through a `--full-refresh`". Snowflake's [dbt page](https://docs.snowflake.com/en/user-guide/dynamic-tables/dbt) adds that model contracts are unsupported.
5. **Takeaways for you:** dbt gives you tests, lineage and review. Snowflake's own SQL and DCM get new Dynamic Table features first.

### Incremental refresh for materialized views (Databricks)
[link](https://docs.databricks.com/aws/en/optimizations/incremental-refresh) · updated 2026-09-17 · vendor doc · read in full

1. **What it is about:** Databricks' counterpart to a Dynamic Table is a materialized view (a stored query result kept up to date) in its Lakeflow pipelines. On each refresh its engine, Enzyme, uses a cost model to pick an incremental technique or a full recompute. The pipeline's event log records which technique ran.
2. **Why you're seeing it:** It shows another vendor's approach to declarative incremental transformation, for comparison (`warehouse-agentic`).
3. **Seen before?** The breadth pass covered Genie Code inside Lakeflow Jobs. This covers the tables it builds.
4. **Relates to:** The refresh modes above. Databricks' [REFRESH POLICY](https://docs.databricks.com/aws/en/ldp/developer/ldp-sql-ref-create-materialized-view-refresh-policy) (updated 2026-09-11) offers AUTO, INCREMENTAL, INCREMENTAL STRICT and FULL. STRICT fails a refresh rather than silently rebuilding.
5. **Takeaways for you:** Both vendors land in the same place. You declare the result, the engine chooses how to update it, and you can see and constrain that choice.

**Searched for and not found:** BigQuery's release notes have no materialized-view or continuous-query entry after 2026-06-26. René Luijk's July comparison of dbt incremental models and Dynamic Tables (Data Engineer Things) still returned 403. Snowflake's ["What's new with Dynamic Tables"](https://www.snowflake.com/en/blog/whats-new-dynamic-tables-faster-flexible/) round-up (2026-06-15, background) falls just before the window.

**Leads:**
1. L2-2a - Custom incremental Dynamic Tables and the move off streams and tasks: `REFRESH USING` with `MERGE INTO SELF` / `INSERT INTO SELF`, the `CHANGES` clause, stream-static joins, soft deletes and stateful aggregation, and converting an existing task pipeline (one of the CoCo `dynamic-tables` skill's stated uses). Read Snowflake's custom incrementalization user guide, the 2026-07-27 engineering blog's examples, and practitioner migration write-ups, for which hand-written incremental patterns now fit inside a Dynamic Table and which still belong in dbt incremental models.
2. L2-2b - Changing a Dynamic Table pipeline without rebuilding it: `CREATE OR ALTER` in DCM Projects versus dbt's full-refresh-on-SQL-change, frozen regions (widen versus narrow), `BACKFILL FROM` with Time Travel, DML into frozen rows, and `INITIALIZE = ON_SCHEDULE`, with Databricks' REFRESH POLICY INCREMENTAL STRICT as the comparison. Read Snowflake's "Modify dynamic tables", frozen regions and DCM docs, dbt's Snowflake configs, and Databricks' refresh-policy docs, for how a reviewed change reaches production without recomputing history.

## Level 3 - Custom incremental and the move off streams and tasks

**Streams and tasks, first.** A **stream** is a Snowflake object that records which rows of a table were inserted, updated or deleted since you last read it. It works like a bookmark in the table's change log. A **task** runs a SQL statement on a schedule or after another task finishes. For years, incremental pipelines in Snowflake were built from these two pieces: a stream on the source, and a task that read it every few minutes and ran a `MERGE` into the target. Snowflake's [migration page](https://docs.snowflake.com/en/user-guide/dynamic-tables/migrate-streams-tasks) maps each piece onto a custom incremental Dynamic Table. The stream becomes the `CHANGES()` clause, the schedule becomes `TARGET_LAG`, and `MERGE INTO target` becomes `MERGE INTO SELF`.

### Custom incrementalization
[link](https://docs.snowflake.com/en/user-guide/dynamic-tables/custom-incrementalization) · undated page; GA [2026-07-27](https://docs.snowflake.com/en/release-notes/2026/other/2026-07-27-dynamic-tables-custom-incremental-ga) · vendor doc · read in full

1. **What it is about:** Snowflake's reference page for Dynamic Tables whose refresh you write yourself. You list the columns, then put one `MERGE INTO SELF` or `INSERT INTO SELF` inside `REFRESH USING`. It gives worked examples of enriching events with a dimension table, logging deletes, keeping running totals, and porting a stream-and-task pipeline.
2. **Why you're seeing it:** It is the reference behind this level's lead (`warehouse-agentic`, `dbt-context`).
3. **Seen before?** Level 2's engineering blog introduced the feature. This page gives its rules.
4. **Relates to:** The migration page above. Snowflake's [decision guide](https://docs.snowflake.com/en/user-guide/dynamic-tables-and-streams) still lists `MERGE` as a reason to prefer streams and tasks.
5. **Takeaways for you:** The limits show what stays outside it. Each refresh allows one DML statement. There is "No dbt integration" and no frozen regions. Without `BACKFILL FROM`, the first refresh replays every source row.

### Thrive Learning: Custom Incrementalization for Dynamic Tables
[link](https://www.snowflake.com/en/blog/thrive-dynamic-table-costs-custom-incremental/) · 2026-07-28 · vendor blog (customer story) · read in full

1. **What it is about:** Thrive Learning, a UK learning platform, ran a Dynamic Table that joined up to five sources. It had been split into a "fast lane" refreshed every six hours and a weekly "slow lane", and merging the two lanes created new problems. The team replaced this with `MERGE INTO SELF` over `CHANGES()`: "process only the delta, merge it in, leave everything else untouched."
2. **Why you're seeing it:** It is a team's own account of the switch, published the day after GA (`warehouse-agentic`, `dbt-context`).
3. **Seen before?** Level 2's engineering blog was Snowflake's own account. This shows a customer using it.
4. **Relates to:** dbt. "Native dbt support for custom incrementalization isn't there yet", so the team wrapped these tables "in a custom dbt materialization" to keep lineage, tests and docs.
5. **Takeaways for you:** Refresh latency "dropped from hours to seconds". The post shares no code.

### Add guide: Build SCD Type 2 Dimensions with Dynamic Tables (withdrawn)
[link](https://github.com/Snowflake-Labs/sfquickstarts/pull/3543) · opened 2026-09-18, closed 2026-09-23 · GitHub pull request (Snowflake Labs) · read in full

1. **What it is about:** Yoav Ostrinsky, author of Level 2's DCM guide, proposed a developer guide on slowly changing dimensions (SCD) Type 2. A Type 2 dimension keeps every past version of a row, each with valid-from and valid-to dates. He withdrew it: "the topic is simply not being published."
2. **Why you're seeing it:** SCD Type 2 is one of the patterns Snowflake's decision guide still sends to streams and tasks (`warehouse-agentic`).
3. **Seen before?** Level 1's comprehensive guide touched on slowly changing dimensions. This is the hard case.
4. **Relates to:** The migration page, which calls sequence-generated keys "unstable in incremental mode" and suggests a hash of the business key instead.
5. **Takeaways for you:** It lists three failure modes that "all fail quietly". `UUID_STRING()` silently forces a full refresh and reissues every key. Closing the old version and opening the new one has to happen in one `MERGE INTO SELF`. Facts can arrive before their dimension row.

### AUTO CDC INTO (pipelines)
[link](https://docs.databricks.com/aws/en/ldp/developer/ldp-sql-ref-apply-changes-into) · updated 2026-09-11 · vendor doc (Databricks) · read in full

1. **What it is about:** Databricks' statement for applying a stream of changes to a table inside a Lakeflow pipeline. You name the key and a `SEQUENCE BY` column that orders events, so late arrivals land correctly. You also say which events count as deletes, and whether to keep history as SCD Type 1 or Type 2.
2. **Why you're seeing it:** It is the same job at another vendor (`warehouse-agentic`).
3. **Seen before?** Level 2 covered Databricks' materialized views. This is the change-capture statement that sits beside them.
4. **Relates to:** Custom incrementalization above. Where Snowflake has you write the `MERGE`, Databricks turns SCD Type 2 and out-of-order handling into keywords.
5. **Takeaways for you:** The ideas carry over between vendors: a key, an ordering column, a delete rule, and a history policy. Learn these, and each vendor's syntax is a lookup.

### Microbatch incremental models (dbt)
[link](https://docs.getdbt.com/docs/build/incremental-microbatch) · updated 2026-09-22 · vendor doc (dbt Labs) · read in full

1. **What it is about:** dbt's incremental strategy for large event tables. You name a time column and a batch size (a day by default). dbt filters upstream models to each time window and builds each batch separately. It can backfill any date range, and `dbt retry` reruns only the batches that failed. `lookback` reprocesses recent batches to catch late data.
2. **Why you're seeing it:** It is dbt's answer to the same question (`dbt-context`).
3. **Seen before?** It replaces the `is_incremental()` high-watermark pattern in Level 2: "You don't need to think about `is_incremental` filtering."
4. **Relates to:** Custom incremental Dynamic Tables, which follow the warehouse's change log. Microbatch follows event time instead.
5. **Takeaways for you:** Together, these pages suggest a split. Work organized by time windows (backfills, reruns, late data) fits dbt. Merges that run every time a row changes fit Dynamic Tables.

**Searched for and not found:** No dbt Labs issue or pull request that asks for `REFRESH USING` support, so Thrive's custom materialization is the only dbt route we found. Snowflake Community's FAQ on converting streams, tasks and `MERGE` workflows loaded no text. The Medium post "Your Slowly Changing Dimension as a Snowflake Dynamic Table" (2026-07-08) and René Luijk's comparison of dbt incremental models with Dynamic Tables both returned 403. No independent practitioner write-up of a migration dated inside the window turned up. The ones found are older: [TO THE NEW](https://www.tothenew.com/blog/from-tasks-and-streams-to-tranquility-my-first-real-project-with-snowflake-dynamic-tables/) (July 2025) and [Data Today](https://data-today.net/snowflake/snowflake-pipelines-streams-tasks/) (2026-06-07), both background. Neither mentions custom incremental tables.

**Leads:**
1. L2-3a - Slowly changing dimensions and surrogate keys on Dynamic Tables: SCD Type 2 with `MERGE INTO SELF`, hash keys versus sequences and `UUID_STRING()`, late-arriving dimensions, and `BACKFILL FROM` to carry existing history, compared with dbt snapshots and Databricks' `AUTO CDC ... STORED AS SCD TYPE 2`. Read Snowflake's design-patterns and migration pages, dbt's snapshot docs, Databricks' AUTO CDC docs and community write-ups, for how each tool keeps a dimension's history.
2. L2-3b - Custom incremental Dynamic Tables inside a dbt project: custom materializations that wrap `REFRESH USING` (as Thrive built one), gaps in dbt's `dynamic_table` materialization, microbatch and the other incremental strategies on Snowflake, and DCM Projects as the non-dbt alternative. Read dbt's custom-materialization docs and adapter issues, Snowflake's dbt page, and practitioner write-ups, for how a team keeps one lineage graph when some models are Dynamic Tables.

## Where this path ends

Level 1 laid out a Snowflake pipeline as four pieces: Openflow and Snowpipe Streaming bring data in, Dynamic Tables transform it, and dbt tests and ships it. Levels 2 and 3 found that the transformation piece is where the craft is. You declare a result and choose how it refreshes. When a `SELECT` cannot express the logic, you write a `MERGE INTO SELF`, and that now replaces most of what streams and tasks used to do. For someone moving into data engineering, the ideas to learn carry across vendors: change feeds, keys and ordering, deletes and history, and when to rebuild rather than update. dbt still owns testing, review and time-window backfills, and does not yet wrap the newest Dynamic Table features.
