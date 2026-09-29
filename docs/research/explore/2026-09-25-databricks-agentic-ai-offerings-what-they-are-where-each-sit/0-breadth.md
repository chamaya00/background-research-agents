# Breadth - Databricks' agentic AI offerings

Seed: Databricks' agentic AI offerings, where each sits in the stack, and what they mean for a product data scientist moving into data engineering. Learning mode, run 2026-09-25, items dated 2026-06-27 onward.

**Headline:** Databricks is a data platform built around a *lakehouse* (analytical tables stored as files in cloud object storage). Its agentic offerings are best read as one agent family, **Genie**, plus the plumbing underneath it. There are three Genie products: Genie Code for engineers, Genie One and Genie Agents for business users, and Genie Ontology as the business-meaning layer they both read. Under them sit Agent Bricks and MLflow for teams that build their own agents, and Lakebase, Unity Catalog and Unity Gateway for storage, governance and control. Every source this pass read, vendor and partner alike, says the same thing: the agents are only as good as the catalog metadata and semantic definitions under them. Maintaining that layer is data-engineering work, which is where you are heading.

Many products were renamed in 2026: Genie spaces became Genie Agents on 2026-07-09, Databricks One became Genie, Vector Search became AI Search, and the AI gateway is now Unity Gateway. Older articles use the old names.

**Where each offering sits** (products named in this pass):

| Layer | Offering | Angle |
|---|---|---|
| End-user apps | Genie One, Genie Agents, Genie App Builder | 2 |
| Model and agent building | Agent Bricks, MLflow 3 evaluation and tracing | 3 |
| Compute and pipelines | Genie Code (in Lakeflow), Lakeflow Designer, Genie ZeroOps | 1 |
| Catalog and governance | Unity Catalog (metric views, Pages, Genie Ontology), Unity Gateway, managed MCP servers | 2, 4 |
| Storage | Lakebase (Postgres), managed agent memory, trace tables | 3, 4 |

## Angle 1 - Agents for data engineers

### Use Genie Code for pipeline development
[link](https://docs.databricks.com/aws/en/ldp/de-agent) · 2026-09-11 (last updated) · vendor docs · read in full · listed source
1. **What it is about:** Genie Code is Databricks' built-in coding agent. In Agent mode it works inside the editor for Lakeflow, Databricks' pipeline layer for ingestion, transformation and scheduling. It searches tables, edits several pipeline files, runs dry runs and refreshes, and diagnoses errors. Stack: compute and pipelines.
2. **Why you're seeing it:** `warehouse-agentic`: an agent that the platform vendor ships for data engineers.
3. **Seen before?** Partly. The 2026-09-24 data-engineering exploration showed Genie Code as a pipeline step, taken from the August release notes. This page explains how it works.
4. **Relates to:** Medallion pipelines (raw "bronze", cleaned "silver" and business-ready "gold" tables). The page also lists migrating dbt and Informatica projects into Lakeflow as a use case.
5. **Takeaways for you:** The agent shows a diff for each file and asks before it runs anything (Allow / Allow in this thread / Always allow). Databricks writes that "there is still risk". Reviewing an agent's diffs is part of the job.

### How a major freight railroad scaled pipeline creation with Genie Code
[link](https://www.databricks.com/blog/how-major-freight-railroad-scaled-pipeline-creation-genie-code) · 2026-08-12 · vendor blog (customer case) · read in full · listed source
1. **What it is about:** A Canadian railway converting hundreds of legacy pipelines used Genie Code with custom Agent Skills (packaged instructions the agent loads). It also used Unity Catalog, Databricks' governance catalog of tables, permissions and lineage, to look up schemas. The agent generated table definitions, loads, merges and tests. Stack: pipelines, fed by the catalog.
2. **Why you're seeing it:** `warehouse-agentic`, and the seed's question about what the role becomes.
3. **Seen before?** The case is new. Skills as catalog objects appeared on 2026-09-24 (Unity Catalog Skills).
4. **Relates to:** AUTO CDC INTO from the 2026-09-24 run, which applies change feeds to tables in order.
5. **Takeaways for you:** People still owned the field mappings and the business logic. The agent produced code from templates checked against fixed rules: primary keys, audit columns, ordered merges and soft deletes. The vendor reports 90%+ automation for new ingestion.

### Genie Code scheduled tasks
[link](https://docs.databricks.com/aws/en/genie-code/scheduled-tasks) · 2026-09-11 (last updated; GA 2026-09-01) · vendor docs · read in full · listed source
1. **What it is about:** A scheduled task runs a Genie Code prompt on a timer with nobody watching, for example "summarise overnight job results each morning". Each run leaves a chat you can review later. Stack: pipeline operations.
2. **Why you're seeing it:** `warehouse-agentic`.
3. **Seen before?** No.
4. **Relates to:** Genie ZeroOps (**Background**, [announced 2026-06-16](https://www.databricks.com/blog/introducing-genie-zeroops), private preview), a background agent that detects pipeline failures, traces them through lineage and tests fixes in a sandbox. Nothing reaches production without your approval.
5. **Takeaways for you:** "Auto-approve is always on for scheduled runs." A classifier screens out risky actions, and each run has the Unity Catalog permissions of the person who created the task. The permissions you design therefore act as the safety limit on what the agent can do.

**Leads:**
- **L1a** - Databricks' background operations agents: Genie ZeroOps and Genie Code scheduled tasks. What each watches, what each may do without a person present, how sandbox verification and approval work, and what practitioners report on community.databricks.com and partner blogs since July 2026.
- **L1b** - Lakeflow Designer as the handoff from analyst to engineer. How a drag-and-drop Designer flow becomes pipeline code in Git, and how Genie Code migrates dbt and Informatica projects into Lakeflow. Designer docs, the July "Summer Release" notes and blog posts since July 2026, compared with dbt's Wizard.

**So what:** For engineers, Databricks has one agent, Genie Code, and it appears in the editor, the pipeline builder and a scheduler. Your work moves toward writing mappings and skills, reviewing diffs and designing permissions.

## Angle 2 - Agents for analysts and business users

### Expanding Genie Agents: deep analysis, file reasoning, and more
[link](https://www.databricks.com/blog/expanding-genie-agents-deep-analysis-file-reasoning-and-more) · 2026-09-02 · vendor blog · read in full · listed source
1. **What it is about:** Genie Agents are curated agents that answer questions for one domain over chosen tables; they were called Genie spaces until July. This post adds Agent mode (a multi-step research plan that ends in a report), APIs, analysis of PDFs and slides stored in Unity Catalog volumes, and shared conversations. Stack: end-user apps.
2. **Why you're seeing it:** `warehouse-agentic`, `analytics-broad`.
3. **Seen before?** Genie's benchmarks and accuracy evidence were covered in the 2026-09-24 analytics-agents exploration. This post covers the product itself, not the scores.
4. **Relates to:** Snowflake's Cortex Agents from earlier runs, which fill the same role.
5. **Takeaways for you:** Data experts use Genie Code to build a first version of an agent, diagnose conversations that failed and find knowledge gaps. Authors review the suggestions before saving them. Curating the agent is the data team's job.

### Unity Catalog Pages: a governed home for your business knowledge in Genie Ontology
[link](https://www.databricks.com/blog/unity-catalog-pages-governed-home-your-business-knowledge-genie-ontology) · 2026-09-22 · vendor blog · read in full · listed source
1. **What it is about:** Pages (Beta) are catalog entries for business terms, each with an owner, synonyms, a definition and links to tables. They are the human-curated part of Genie Ontology, Databricks' business-context layer that Genie reads before it answers. Stack: catalog and governance.
2. **Why you're seeing it:** `semantic-models`, `dbt-context`.
3. **Seen before?** Adjacent. The ssp.sh primer that separates semantic, context and ontology layers appeared on 2026-09-24, and so did Snowflake's ontology post.
4. **Relates to:** Metric views, Unity Catalog's governed metric definitions and in effect Databricks' semantic layer. They sit alongside Pages, and sharing them became GA on 2026-09-24.
5. **Takeaways for you:** Data stewards curate Pages, and Genie Code can bulk-import definitions from Confluence, Slack, Docs and GitHub. Genie's answers cite the Page they used. That goes some way to answering "who curates it" from `semantic-models`.

### The Genie One MCP is now Generally Available
[link](https://www.databricks.com/blog/genie-one-mcp-now-generally-available) · 2026-09-22 · vendor blog · read in full · listed source
1. **What it is about:** Genie One, the business-user home that was formerly Databricks One, can now be called as an MCP server. MCP is the open protocol that lets an AI assistant call outside tools. Claude, ChatGPT or Cursor can ask it questions and get back results, charts and citations from Genie Ontology. Stack: end-user apps, reached through the gateway.
2. **Why you're seeing it:** `warehouse-agentic`.
3. **Seen before?** Genie One's June launch was Background in the analytics-agents exploration.
4. **Relates to:** Unity Gateway (angle 4), where this runs as a managed MCP service with audit logging.
5. **Takeaways for you:** Databricks is betting that people will reach governed data through whatever assistant they already use. The post gives no accuracy figures. Its pitch is consistency: the same governed answer in every tool.

**Leads:**
- **L2a** - Genie Ontology end to end: Unity Catalog Pages, metric views (window measures, sharing, converting dashboard SQL into local metric views), certification and ontology snippets. How a semantic model is defined and curated for Genie, compared with Snowflake semantic views. Docs and blog posts since July 2026.
- **L2b** - How a Genie Agent is authored and kept healthy: Genie Code's curation skills, the monitoring table, Agent mode APIs and Unity Catalog functions as tools. What Databricks tells an author to watch after launch, from the AI/BI release notes and docs since July 2026.

**So what:** For analysts the product is Genie. The data team's work is curating what Genie reads: metric views, Pages and certified tables. This is the semantic-model work you already follow, under Databricks' names.

## Angle 3 - Building your own agents, and evaluating them

### Evaluate and monitor agents (MLflow 3 for GenAI)
[link](https://docs.databricks.com/aws/en/mlflow3/genai/eval-monitor) · 2026-09-16 (last updated) · vendor docs · read in full · listed source
1. **What it is about:** MLflow, the open-source experiment tracker that Databricks runs, scores agents with "scorers": LLM judges and code checks for correctness, groundedness and safety. `mlflow.genai.evaluate()` scores one agent version against an evaluation dataset so you can compare versions. Stack: model and agent building.
2. **Why you're seeing it:** `agent-efficacy`, `efficacy-methodology`.
3. **Seen before?** Databricks' MemAlign judge-alignment post was Background in the 2026-09-24 analytics scrutiny.
4. **Relates to:** Offline evaluation versus production monitoring. The same scorers run on sampled live traffic.
5. **Takeaways for you:** The docs suggest scoring traces by hand in the UI first and automating later. Using one judge both offline and online makes the numbers comparable, but the judge is still a model.

### MLflow Tracing overview
[link](https://docs.databricks.com/aws/en/mlflow3/genai/tracing/) · 2026-09-16 (last updated; storage in Unity Catalog GA 2026-07-16) · vendor docs · read in full · listed source
1. **What it is about:** A trace records each step an agent took: inputs, outputs, latency, tokens and tool calls. Traces now land in Delta tables governed by Unity Catalog (Delta is Databricks' table format), and you can query them with SQL. Stack: storage and catalog, serving agent building.
2. **Why you're seeing it:** `agent-efficacy`; `analytics-broad` (measuring AI systems).
3. **Seen before?** No.
4. **Relates to:** Product event logging. A trace table is the agent's event log.
5. **Takeaways for you:** Measuring an agent becomes analytics on a table you can join to anything else, which is home ground for you. Unity Gateway sends coding-agent traces to the same table (angle 4).

### How I built agent-based security reviews on Databricks
[link](https://www.databricks.com/blog/how-i-built-agent-based-security-reviews-databricks) · 2026-09-24 · vendor blog (practitioner) · read in full · listed source
1. **What it is about:** A Databricks engineer built seven notebook agents: intake, risk, requirements, specialised review, validation, workflow and learning. Lakeflow Jobs orchestrates them, Claude models are hosted on Databricks, records live in Unity Catalog and a Databricks App is the front end. Stack: agent building on top of pipelines.
2. **Why you're seeing it:** `agent-efficacy`, meaning what an enterprise accepts as evidence.
3. **Seen before?** No.
4. **Relates to:** Agent Bricks (**Background**, [2026-06-16](https://www.databricks.com/blog/agent-bricks-dais-2026)), Databricks' builder platform, which now takes "any model, any harness". This build did not use it.
5. **Takeaways for you:** Success was measured from operational records: automation rate, cycle time, risk mix and reviewer time saved. No judge scores are reported. The rule: automate only where the criteria are explicit, evidence is required and uncertainty gets escalated.

**Leads:**
- **L3a** - Agent Bricks since the June expansion: Knowledge Assistant, Supervisor Agent, custom agents on LangGraph or Claude Agent SDK, the Omnigent harness, and deployment to Databricks Apps. How each is built and evaluated, from Databricks docs and blog posts since July 2026.
- **L3b** - How Databricks says to show that a judge agrees with people: Judge Builder, tunable judges, MemAlign, review queues and agent-as-a-judge. MLflow and Databricks docs plus independent write-ups, read for `efficacy-methodology`.

**So what:** Building agents on Databricks mostly means using the data platform plus MLflow. Evaluation lives in trace tables and judges, so measuring an agent looks like product analytics on a new event log.

## Angle 4 - The layer agents run on

### Object Storage + WAL: Lakebase Postgres for the agentic era
[link](https://www.databricks.com/blog/object-storage-wal-lakebase-postgres-agentic-era) · 2026-08-27 · vendor engineering blog · read in full · listed source
1. **What it is about:** Lakebase is Databricks' managed Postgres. It is an *OLTP* database, a store for app transactions that reads and writes a row at a time, unlike the analytical lakehouse. Its write-ahead log (the append-only record of every change) lives in object storage, and the compute holds no data. Stack: storage.
2. **Why you're seeing it:** `warehouse-agentic`.
3. **Seen before?** No.
4. **Relates to:** "LTAP": the transactional and analytical engines read one copy of the data. That removes the change-copying (CDC) pipelines seen on 2026-09-24.
5. **Takeaways for you:** The case for agents: a copy-on-write branch for testing a migration takes seconds, idle compute stops after five minutes, and restoring to any earlier point in the log is cheap. Fewer copy pipelines is the claim to watch.

### Managed agent memory
[link](https://docs.databricks.com/aws/en/agents/agent-memory/managed-memory) · 2026-09-22 (last updated; Beta 2026-09-16) · vendor docs · read in full · listed source
1. **What it is about:** A managed store where an agent keeps long-term memories and conversation history. Lakebase provides the storage, and agents built on any framework, including the OpenAI Agents SDK and Claude Agent SDK, can use it. Stack: storage for agents.
2. **Why you're seeing it:** `warehouse-agentic`.
3. **Seen before?** No.
4. **Relates to:** Genie One's user-facing Memory feature (Beta since July).
5. **Takeaways for you:** Access is controlled per store, not per user. `actor_id` separates entries logically, but anyone with access to the store can read every entry. How memory is modelled and permissioned is a data-engineering design decision.

### Deploy and manage coding agents at scale with the Unity Gateway CLI
[link](https://www.databricks.com/blog/deploy-and-manage-coding-agents-scale-unity-gateway-cli) · 2026-09-24 · vendor blog · read in full · listed source
1. **What it is about:** Unity Gateway is Databricks' control point for access to models and tools. Admins set approved models, MCP servers, skills and routing in one place, and `ug claude` or `ug codex` starts a coding agent with that setup. Stack: catalog and governance.
2. **Why you're seeing it:** `warehouse-agentic`.
3. **Seen before?** Sharing Unity Catalog Skills was covered on 2026-09-24.
4. **Relates to:** Managed MCP servers, which the gateway governs. They expose Genie, AI Search, SQL and Unity Catalog functions as agent tools.
5. **Takeaways for you:** Traces from third-party coding agents go into the lakehouse trace table, so how people use Claude Code or Codex becomes queryable data. The post's cost-routing claim is skipped here.

**Leads:**
- **L4a** - Lakebase for data engineers: LTAP, syncing between Delta tables and Postgres, branching and snapshots, and Lakebase Search. What changes for pipelines that currently copy app data into the warehouse or push warehouse data back out to apps (reverse ETL). Databricks docs and engineering blog posts since July 2026, plus any independent reviews.
- **L4b** - Unity Gateway as the control plane for agents: managed MCP servers, Genie One MCP, Unity Catalog functions as tools, on-behalf-of-user auth and unified tracing. How a data team decides what an agent may touch. Docs from July to September 2026.

**So what:** The agent layer rests on three familiar pieces: a database (Lakebase), a catalog (Unity Catalog) and a gateway that logs everything into tables. The data-engineering work is modelling and permissioning those stores.

## Angle 5 - The map, and what it means for the role

### Databricks Genie is becoming more than conversational BI
[link](https://qubika.com/blog/databricks-genie-one-agents-ontology-code/) · 2026-09-24 · partner consultancy blog · read in full · search
1. **What it is about:** A Qubika solutions architect sets out the Genie family: Genie One for business users, Genie Agents as curated domain contexts, Genie Ontology for business meaning and Genie Code for practitioners. Stack: from end-user apps down to the catalog.
2. **Why you're seeing it:** `warehouse-agentic`, `analytics-broad`.
3. **Seen before?** No. Partner commentary is new in this run.
4. **Relates to:** Atlan's three-tier map (**Background**, [published 2026-06-19](https://atlan.com/know/ai-agent/databricks/databricks-data-ai-summit-2026-announcements/), updated 2026-09-21): agent, governance and infrastructure layers. Atlan's criticism is that the context is strong inside Databricks, but enterprises run more than Databricks.
5. **Takeaways for you:** "AI does not eliminate the need for semantic governance. It makes it more visible." The author is a Databricks Champion, so this is a friendly view.

### Beyond autocomplete: how Genie Code turns data work into governed agentic workflows
[link](https://entrada.ai/databricks-genie-code-governed-agentic-workflows/) · 2026-07-24 · partner consultancy blog · read in full · search
1. **What it is about:** Maciej Rubczyński argues that Genie Code is not autocomplete but a workflow layer that reasons over tables, lineage, permissions and pipelines. Stack: compute and pipelines.
2. **Why you're seeing it:** `warehouse-agentic`, and the seed's question about the role.
3. **Seen before?** No. It adds an outside view to angle 1.
4. **Relates to:** dbt's Wizard and Snowflake's CoCo from the 2026-09-24 exploration, which are the same idea at other vendors.
5. **Takeaways for you:** "The stronger the context, the better the result." Weak metadata and unclear definitions undermine the agent. "Auto-approve is a productivity feature, not a control plane."

**Leads:**
- **L5a** - Independent maps comparing Databricks' agent portfolio with Snowflake's (Cortex Agents, Snowflake Intelligence) and Google's, layer by layer. How partner, analyst and catalog-vendor writers line up what each vendor offers since July 2026.
- **L5b** - What a data engineer's week looks like with Genie Code, from practitioner accounts: reviewing pipelines an agent wrote, writing Agent Skills, and CI/CD with Declarative Automation Bundles. community.databricks.com and partner blogs since July 2026.

**So what:** Independent writers agree with the vendor on one point: the agents are the visible layer, and the value sits in catalog metadata and semantics. Your move into data engineering lands on the layer these agents depend on.

## Looked for and not found

- **An independent hands-on review of Agent Bricks dated in the window.** The only ones found were from 2025 or were AI-written June recaps.
- **A Databricks post on Agent Bricks after the June summit.** Search returned only the summit post.
- **A practitioner report of Genie ZeroOps catching a real failure.** The one community post was an overview.
- **A Databricks page laying out the whole agentic portfolio by layer, dated in the window.** The table above is assembled from this run's own reading.

## Dropped

- **Genie ZeroOps community post (2026-08-03):** it restates the June announcement and has no use case.
- **Rename-history community post (2026-07-22):** it points to rebricked.org and lists no renames itself.
- **ChatForest DAIS guide (2026-06-17):** outside the window, and AI-written.
- **SunnyData Agent Bricks review (2025-09-17):** outside the window, and it predates the June changes.
- **Lakeflow Designer docs:** kept as lead L1b rather than an item.
- **"Genie Code for ML" community announcement (2026-07-16):** ML engineering is outside the seed.
- **Genie pricing changes, Unity Gateway price multipliers, "Managing AI Coding Costs at Scale":** cost is on the Not interested list.
