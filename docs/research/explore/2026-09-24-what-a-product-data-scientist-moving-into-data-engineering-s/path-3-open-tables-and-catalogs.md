# Path 3 - Open tables and catalogs as agent infrastructure

This path starts from the breadth pass's angle 5, the foundations underneath
the agents. It reads around the storage layer below the warehouse: Apache
Iceberg, the open table format, and the catalogs that track Iceberg tables and
decide who may read them. It ends where catalogs are starting to hold semantic
definitions as well as tables.

## Level 1 - Formats and catalogs

### The State of Apache Iceberg v4 in July 2026
[link](https://datalakehousehub.com/blog/iceberg-v4-state-july-2026/) · 2026-07-06 · practitioner blog (Alex Merced, Dremio developer relations) · read in full

1. **What it is about:** Apache Iceberg is an open table format. It stores a table as ordinary Parquet files plus metadata files, so Spark, Snowflake, BigQuery and other engines can all read and write the same table. The post walks up the layers (data files, manifests, a manifest list, a metadata file, and the catalog that holds the pointer to the current one) and then surveys the proposals for v4.
2. **Why you're seeing it:** It explains the storage layer that agents and semantic models now sit on (`analytics-broad`, `semantic-models`).
3. **Seen before?** The breadth pass's Dremio report said v3 is stable and v4 is in design. This is the longer account.
4. **Relates to:** dbt's Lake Compute in angle 2, which runs dbt models directly on Iceberg tables.
5. **Takeaways for you:** Learn v3, the current version. v4 is still design work: one-file commits for streaming, and relative paths so a table can move. The author expects it to roll out slowly, the way v3 did.

### Apache Iceberg REST Catalog in Production: Polaris, Unity Catalog, Nessie, and the Layer That Actually Controls Your Data Lakehouse
[link](https://cloudrps.com/blog/iceberg-rest-catalog-polaris-unity-catalog-production/) · 2026-09-02 · vendor blog (CloudRPS, unsigned) · read in full

1. **What it is about:** A catalog is the service that records which tables exist, where each one's current metadata lives, and who may use it. The Iceberg REST catalog spec is a shared web interface for this, so "any engine that speaks REST can talk to any compliant catalog". The post compares Apache Polaris (open source), Databricks' Unity Catalog, Project Nessie (which adds Git-style branches) and AWS Glue.
2. **Why you're seeing it:** This is the layer that decides what an agent can reach (`analytics-broad`, `warehouse-agentic`).
3. **Seen before?** New to you. The breadth pass named catalogs in one sentence.
4. **Relates to:** Onehouse's [June critique](https://www.onehouse.ai/blog/databricks-iceberg-support-has-a-catch-its-called-unity-catalog) (background), written by a competitor, which argues Databricks' Iceberg support flows "inward to Unity Catalog".
5. **Takeaways for you:** "Your data governance and access control become a catalog concern rather than an engine concern." Learn credential vending: the catalog hands an engine short-lived storage keys that open only one table's files.

### Govern Apache Iceberg Tables for External Engines with Snowflake Horizon
[link](https://www.snowflake.com/en/developers/guides/govern-iceberg-tables-for-external-engines-with-snowflake-horizon/) · updated 2026-09-22 · vendor developer guide · read in full

1. **What it is about:** Horizon Catalog is Snowflake's catalog and governance layer. It now serves Snowflake's Iceberg tables to other engines, such as Spark, over the REST protocol. This hands-on guide shows what happens when a table has masking or row-access rules. Snowflake withholds the storage keys, runs the scan itself and gives the engine temporary, already-filtered files.
2. **Why you're seeing it:** It is a warehouse vendor governing data that is read outside the warehouse (`warehouse-agentic`).
3. **Seen before?** The 2026-09-24 analytics-agents exploration, path 3, found that row rules belong on tables, not on semantic views. This shows those rules following the table out of Snowflake.
4. **Relates to:** The [Scan Plan API release note](https://docs.snowflake.com/en/release-notes/2026/other/2026-09-10-iceberg-scan-plan-api-public-preview) (preview, 2026-09-10), and the credential vending in the previous article, which this switches off.
5. **Takeaways for you:** "The policies travel with the data." A write is allowed only if every policy on the table changes nothing for the writer's role.

### Apache Iceberg Lakehouse: Snowflake & Google Cloud
[link](https://www.snowflake.com/en/blog/snowflake-google-cloud-open-lakehouse/) · 2026-07-29 · vendor blog (joint Snowflake and Google authors) · read in full

1. **What it is about:** Two vendors explain how one set of Iceberg tables serves both of them. Google's Lakehouse was called BigLake until April, and its catalog is the Lakehouse runtime catalog. It and Snowflake's Horizon can each reach tables the other manages, which is called federation. Semantic models and MCP servers sit on top for agents.
2. **Why you're seeing it:** It shows catalogs as the base layer for warehouse agents (`warehouse-agentic`, `semantic-models`).
3. **Seen before?** Angle 4 covered Google's Knowledge Catalog, a separate metadata product. The rest is new to you.
4. **Relates to:** Google's [release notes](https://docs.cloud.google.com/lakehouse/docs/release-notes) (Horizon added as a remote catalog, 2026-07-13) and its [2026-09-18 post](https://cloud.google.com/blog/products/data-analytics/borderless-lakehouse-cross-cloud-caching-and-connections), which federates to Unity Catalog, Glue and Horizon for "increasingly, AI agents".
5. **Takeaways for you:** The catalog is "the single authority that knows which tables exist ... who can access them and where data files physically reside." The semantic layer sits one level up.

### Apache Ossie and Apache Polaris: Putting Semantic Models in the Open Catalog
[link](https://datalakehousehub.com/blog/apache-ossie-polaris-semantic-models/) · 2026-08-25 · practitioner blog (Alex Merced, Dremio developer relations) · read in full

1. **What it is about:** Apache Polaris is an open-source Iceberg catalog that Snowflake and Dremio started, and it runs inside Horizon. [Polaris 1.7](https://datalakehousehub.com/blog/apache-polaris-1-7-0/) (2026-08-02) added a beta API, off by default, that stores Apache Ossie semantic models "as first-class catalog entities next to the tables they describe".
2. **Why you're seeing it:** It shows catalogs starting to govern semantic definitions (`semantic-models`, `dbt-context`).
3. **Seen before?** Yes. #42 item 1 introduced Ossie, and angle 5 noted that Polaris planned permissions for semantic models.
4. **Relates to:** Polaris's [changelog](https://github.com/apache/polaris/blob/main/CHANGELOG.md), where dedicated semantic-model privileges have been added but not yet released. Unity Catalog's metric views are already permissioned catalog objects.
5. **Takeaways for you:** A reader with access to the model but not the tables "can see definitions and cannot run them". Today it is "a registry with no defined consumer flow", so nothing yet uses the stored models.

**Leads:**
1. L3-1a - How a catalog enforces access when many engines and agents read the same Iceberg table: credential vending against server-side scan planning (the Iceberg REST Scan Plan API), Snowflake Horizon's policy enforcement, Polaris's credential-vending and access-delegation work, Unity Catalog's attribute-based access control (ABAC) for external engines, and Google Lakehouse's catalog federation. Read in project docs, dev-list digests and hands-on tutorials for what a data engineer configures so that row and column rules hold whichever engine or agent does the reading.
2. L3-1b - Semantic models as catalog objects: Polaris's beta Semantic Model API and its new dedicated privileges, the proposed Apache Ossie REST API and Ossie's query and MCP interface, Unity Catalog metric views and business semantics, and Horizon's handling of semantic views. Read for how each catalog stores a definition, grants access to it and serves it to an agent, and for what practitioners say is still undecided.

## Level 2 - Who enforces access on a shared table

### Unifying governance across engines and catalogs in the Open Lakehouse
[link](https://www.databricks.com/blog/unifying-governance-across-engines-and-catalogs-open-lakehouse) · 2026-09-10 · vendor blog (Databricks; Daniel Weeks, Ryan Blue, Andrei Tserakhau) · read in full

1. **What it is about:** It describes three ways a catalog can make row and column rules hold outside its own engine. With **centralized enforcement**, the catalog filters the data itself and returns only what the user may see. With **Read Restrictions**, the catalog tells a trusted engine which row filter and column masks to apply. With **Catalog Labels**, two catalogs exchange tags, and each one applies its own rules.
2. **Why you're seeing it:** It maps out the question this level asks (`analytics-broad`, `warehouse-agentic`).
3. **Seen before?** Level 1's Horizon guide is the centralized model. The analytics-agents exploration's path 3 put row policies on tables because an agent needs SELECT on them. All three models carry a table's policy outward.
4. **Relates to:** Snowflake's [Read Restrictions post](https://www.snowflake.com/en/blog/engineering/apache-iceberg-read-restrictions-governance0/) (2026-09-03). It says an engine that cannot apply every rule "must fail the query". The spec change [merged](https://github.com/apache/iceberg/pull/13879) on 2026-09-03.
5. **Takeaways for you:** The deciding question is whether the engine is trusted. Spark and DuckDB count as untrusted "when users control the runtime", because users can run arbitrary code.

### [DISCUSS] Proposal: File-Level Access Delegation in the Iceberg REST Catalog Spec
[link](http://www.mail-archive.com/dev@iceberg.apache.org/msg15104.html) · 2026-09-12 (thread under way by 2026-09-01) · project dev list (Apache Iceberg, mail-archive mirror) · read in full

1. **What it is about:** Delegated access is per table today: vended credentials open a whole table's folder. Sung Yun's thread proposes access per file during scan planning, through **presigned URLs**. A presigned URL is a web link to one file that stops working after a set time.
2. **Why you're seeing it:** This is where the open spec is being decided right now (`analytics-broad`).
3. **Seen before?** Level 1's CloudRPS piece introduced credential vending. This thread is about where it runs out.
4. **Relates to:** William Hyun's draft [PR #17332](https://github.com/apache/iceberg/pull/17332) (2026-07-22). A [2026-09-23 thread](http://www.mail-archive.com/dev@iceberg.apache.org/msg15247.html) and Polaris [issue #5579](https://github.com/apache/polaris/issues/5579) ask what a catalog should do when it cannot delegate at all; Polaris returns an error. Trino, an open-source SQL engine, has an open [PR](https://github.com/trinodb/trino/pull/30891) (2026-08-26) that makes it honour server-side planning.
5. **Takeaways for you:** The stated goal is to "make partition-scoped sharing practical in the REST Catalog model." Scan planning works only if the engine's client asks the catalog to do it.

### Cross-engine attribute-based access controls (ABAC)
[link](https://docs.databricks.com/aws/en/external-access/cross-engine-abac) · updated 2026-09-11 · vendor doc (Databricks) · read in full

1. **What it is about:** Unity Catalog is Databricks' catalog. ABAC attaches rules to tags such as "pii" instead of setting them table by table. This page explains how those row filters and column masks still hold when an outside Spark job reads the table: "a specialized serverless compute layer" filters the data first. The feature is in beta.
2. **Why you're seeing it:** It is a concrete setup list for this level's question (`warehouse-agentic`).
3. **Seen before?** Yes. It follows the pattern in Level 1's Horizon guide, where governed reads go through the vendor's own compute.
4. **Relates to:** The [launch post](https://www.databricks.com/blog/introducing-cross-engine-abac) (2026-06-02, background) builds on the Iceberg REST scan APIs. The September [release notes](https://docs.databricks.com/aws/en/release-notes/product/2026/september) add metastore-level ABAC policies (beta, 09-17): one policy for every catalog.
5. **Takeaways for you:** You enable external data access, grant `EXTERNAL USE SCHEMA`, use managed tables, and turn on server-side planning in Iceberg-Spark 1.11 or later. Only reads are supported, so a writer has to be exempted from the policy.

### The State of Apache Polaris in July 2026
[link](https://dev.to/alexmercedcoder/the-state-of-apache-polaris-in-july-2026-from-incubating-catalog-to-the-governance-layer-of-the-1n3h) · 2026-07-08 · practitioner blog (Alex Merced, Dremio developer relations) · read in full

1. **What it is about:** How Polaris controls access. Engines "hold one thing: an identity with Polaris." Roles grant access at the catalog, namespace and table level, and credential vending hands out short-lived keys to a table's storage paths. Since 1.3, Polaris can pass decisions to Open Policy Agent (OPA), a separate policy engine whose rules are written as code.
2. **Why you're seeing it:** It covers the open-source catalog's side of access control (`analytics-broad`).
3. **Seen before?** Level 1 covered Polaris as a home for semantic models. This covers its tables.
4. **Relates to:** [CVE-2026-64640](https://app.opencve.io/cve/CVE-2026-64640) (2026-08-06). In Polaris 1.6.0 and earlier, registering a table could read a metadata file from outside the allowed storage.
5. **Takeaways for you:** Row and column control is "the destination the roadmap has pointed at all along". It has not shipped. Polaris decides who may open a table, not which rows they see.

### Credential vending overview (Google Lakehouse)
[link](https://docs.cloud.google.com/lakehouse/docs/credential-vending) · updated 2026-09-22 · vendor doc (Google Cloud) · read in full

1. **What it is about:** Google's Lakehouse runtime catalog checks a user's IAM permissions, which are Google Cloud's access roles. It then returns "a short-lived storage token" that covers only the table's files. Spark and Trino ask for the token through the `X-Iceberg-Access-Delegation` header, and BigQuery uses it automatically.
2. **Why you're seeing it:** It is Google's catalog in this level's lead (`warehouse-agentic`).
3. **Seen before?** Level 1's Snowflake and Google post said the two catalogs federate. This page shows what a reader actually receives.
4. **Relates to:** Between July and September, the [release notes](https://docs.cloud.google.com/lakehouse/docs/release-notes) add Horizon, SAP and Workday as remote catalogs, but nothing on row or column rules for outside engines. [LakeOps](https://lakeops.dev/blog/ai-agents-safe-access-iceberg) (2026-09-15) argues that agents also need checks on each query, such as read-only access and masking of personal data.
5. **Takeaways for you:** Google's documented control for outside engines works at the table level.

**Leads:**
1. L3-2a - Iceberg Read Restrictions and Catalog Labels after adoption: the merged `ReadRestrictions` spec (PR #13879, 2026-09-03) and Catalog Labels (PR #15750), read in Iceberg dev-list threads, catalog and engine release notes (Polaris, Unity Catalog, Horizon, Spark, Trino) and explainers for which catalogs and engines announce support, how a catalog decides an engine is "trusted" (mTLS, on-behalf-of flows), and what a data engineer sets so an engine fails closed.
2. L3-2b - File-level access delegation in the Iceberg REST spec: the File-Level Access Delegation proposal, presigned-URL PRs #17332, #18079 and #18080, the 2026-09-23 thread on what a catalog does when delegation cannot be satisfied (with Polaris issue #5579), and engine clients for server-side scan planning (Trino PR #30891, DuckDB, Doris), read for how file-scoped access would work end to end and what each side must configure.

## Level 3 - Read Restrictions and Catalog Labels after the merge

### Apache Iceberg Read Restrictions: Interoperable Governance
[link](https://www.snowflake.com/en/blog/engineering/apache-iceberg-read-restrictions-governance0/) · 2026-09-03 · vendor engineering blog (Snowflake; Prashant Singh, Russell Spitzer, Vishwa Lakkundi) · read in full

1. **What it is about:** The spec's authors explain Read Restrictions. When an engine loads a table, the catalog adds a `required-row-filter` and `required-column-projections`. Each column mask is one of nine named actions, such as `show-last-4` or `sha-256-global`. An administrator decides which engines are trusted to apply them.
2. **Why you're seeing it:** It answers this level's question of how "trusted" gets decided (`analytics-broad`, `warehouse-agentic`).
3. **Seen before?** Level 2 quoted one line from it. The Databricks post in Level 2 named the model.
4. **Relates to:** Trust comes from "mTLS, on-behalf-of flow, and similar methods". With mTLS, the engine and the catalog each present a certificate. With on-behalf-of, the engine passes along the user's identity instead of its own.
5. **Takeaways for you:** Trust is "a bilateral agreement between the catalog and the engine or administrator", so each platform sets it up and the spec does not. An engine that cannot apply a mask "must fail the query".

### Spec: Add finer grained read restrictions as part of loadTable
[link](https://github.com/apache/iceberg/pull/13879) · merged 2026-09-03 · project pull request (Apache Iceberg; Prashant Singh) · read in full

1. **What it is about:** This is the spec change itself. It adds an optional `ReadRestrictions` field to the catalog's load-table reply. Rules name columns by field id, a stable number, so renaming a column does not break a policy. The [vote](http://www.mail-archive.com/dev@iceberg.apache.org/msg15002.html) passed with 8 binding +1s, 13 non-binding +1s and no objections.
2. **Why you're seeing it:** It is the primary source for what the open standard now says (`analytics-broad`).
3. **Seen before?** Level 2 gave only the merge date.
4. **Relates to:** No engine has released code for it yet. The Java masking API ([PR #16198](https://github.com/apache/iceberg/pull/16198)) is open and targeted at Iceberg 1.13.0. The Spark proof of concept ([PR #16082](https://github.com/apache/iceberg/pull/16082), background) is a draft that has been marked stale. Alex Merced's [weekly](https://dev.to/alexmercedcoder/apache-data-lakehouse-weekly-september-3-9-2026-4h3m) (2026-09-10) says deployments had been "faking" this "with a proxy in front of the catalog".
5. **Takeaways for you:** The [spec text](https://raw.githubusercontent.com/apache/iceberg/main/open-api/rest-catalog-open-api.yaml) says a supporting reader "must fail any read against the loaded table that cannot apply a returned restriction in full". Failing closed is built into the engine, not something you configure.

### [DISCUSS] Table and Column Label Metadata in Iceberg REST Catalog
[link](http://www.mail-archive.com/dev@iceberg.apache.org/msg14849.html) · 2026-08-26 · project dev list (Apache Iceberg, mail-archive mirror; Andrei Tserakhau) · read in full

1. **What it is about:** It proposes an optional `labels` field in the load reply. Labels are key-value pairs that the catalog owns, such as an owner, a "pii" classification or a cost centre, set for the table or for each column. They are read-only, and the spec does not define what they mean.
2. **Why you're seeing it:** Labels are the third model in Level 2's map, and the thread lists "AI context" among their uses (`analytics-broad`, `semantic-models`).
3. **Seen before?** In the Databricks post in Level 2, labels were a way for catalogs to exchange tags. What was voted on here is narrower.
4. **Relates to:** The [vote](http://www.mail-archive.com/dev@iceberg.apache.org/msg14939.html) opened 2026-09-02, and [PR #15750](https://github.com/apache/iceberg/pull/15750) merged 2026-09-09. A separate proposal for full tags, which have identity and a lifecycle, is still open ([issue #16165](https://github.com/apache/iceberg/issues/16165), background).
5. **Takeaways for you:** "Read Restrictions is server-side enforcement ... while Labels are client-side". The catalog supplies context, and each engine decides what to do with it. Labels enforce nothing.

### Catalog Labels: client-library read support (Go / Rust / Python / C++)
[link](https://github.com/apache/iceberg/issues/18126) · 2026-09-15 · project tracking issue (Apache Iceberg; GitHub user laskoviymishka) · read in full

1. **What it is about:** It tracks which Iceberg client libraries can read labels. Java can: [PR #18045](https://github.com/apache/iceberg/pull/18045) merged on 2026-09-17. A PR to show labels in Spark's `DESCRIBE EXTENDED` is open ([#18049](https://github.com/apache/iceberg/pull/18049)). This issue plans the same work for PyIceberg (the Python library), Go, Rust and C++.
2. **Why you're seeing it:** It shows how far adoption has got in the two weeks since the vote (`analytics-broad`, `warehouse-agentic`).
3. **Seen before?** New to you. Level 2 did not cover how engines receive labels.
4. **Relates to:** ClickHouse is an open-source analytical database. It has two open issues to read and emit labels ([#120805](https://github.com/ClickHouse/ClickHouse/issues/120805) and [#120806](https://github.com/ClickHouse/ClickHouse/issues/120806), 2026-09-18). #120805 says Polaris, Unity Catalog and Lakekeeper (an open-source Iceberg catalog written in Rust) "already emit" labels. Polaris's [changelog](https://github.com/apache/polaris/blob/main/CHANGELOG.md) and Lakekeeper's [releases](https://github.com/lakekeeper/lakekeeper/releases) do not mention labels.
5. **Takeaways for you:** Labels reach Java and Spark first. An agent written in Python has to wait for PyIceberg.

**Searched for and not found:** No release notes or docs from Polaris, Unity Catalog, Horizon, Spark or Trino announce support for Read Restrictions. Nothing describes an engine setting that makes reads fail closed. The spec leaves the decision about which engines to trust to each platform.

**Leads:**
1. L3-3a - Engine-side enforcement of Iceberg Read Restrictions: the Java ReadRestrictions Actions API (PR #16198, milestone Iceberg 1.13.0), the Spark and Trino proofs of concept (PR #16082), and the plan-hiding and predicate-reorder protections Snowflake's explainer names, read in Iceberg release notes, engine PRs and explainers for when a released engine first applies the nine masking actions and how a platform registers an engine as trusted.
2. L3-3b - Catalog Labels as context for agents: the client rollout in Iceberg issue #18126 (PyIceberg, Go, Rust, C++), Spark `DESCRIBE` exposure (PR #18049), ClickHouse issues #120805 and #120806, the separate first-class Tag proposal (issue #16165), and which catalogs (Polaris, Unity Catalog, Lakekeeper, Google's Lakehouse runtime catalog) document emitting labels, read for how ownership, classification and semantic hints reach an agent when it loads a table.

## Where this path ends

Level 1 showed that Iceberg keeps tables as open files, and that engines and agents reach those files through a catalog. Level 2 found access control moving into the catalog in three forms. The catalog can filter the data itself, tell a trusted engine what to filter, or pass along tags. This month the open standard wrote down the second and third forms, but no engine has shipped them, and each platform still decides for itself which engines count as trusted. For a data scientist moving into data engineering, that means learning Iceberg v3 and a REST catalog, and treating credential vending and server-side planning as what works today. Watch Read Restrictions and Labels as the coming contract, and ask two questions of any agent: which identity it reads as, and whether its engine fails closed.
