# Path 3 - Who curates the metrics

This path starts from breadth lead **L5b**, in angle 5, "The wider field around it". The lead asks who curates the metrics in a semantic layer and what adoption takes. It reads the Analytics Engineering Roundup, dbt's newsletter and podcast, from July to September. It also reads dbt Summit 2026 material, dbt's own blog, a trade-press opinion piece, and rollout guides from Databricks and Omni. The breadth pass already read the Gouze and Macomber interviews, so they are not repeated here.

## Level 1 - Who owns the definitions, and how teams start

A semantic layer is where metric definitions live as code, so every tool and agent asks for "revenue" by name instead of writing its own SQL. **Background:** two older pieces set the frame. dbt Labs' [July 2025 post on ownership](https://www.getdbt.com/blog/semantic-layer-ownership) recommended a split: data teams run the machinery, and business domain experts own the definitions. Anthropic's [June 2026 account](https://claude.com/blog/how-anthropic-enables-self-service-data-analytics-with-claude) of its own analytics agent has "humans own the definitions" while Claude writes the supporting docs. It found that "a handful of canonical datasets, a few dozen offline evals, and a thin knowledge skill" captured most of the benefit.

### The Shape and Feel of the Post-AI Data Stack (Ian Macomber)
[link](https://www.iandmacomber.com/blog/post-ai-data-stack/) · 2026-08-30 · practitioner essay (personal blog) · read in full · search (linked from the 2026-09-04 Roundup)
1. **What it is about:** Macomber leads data at Ramp, a finance company. He says a data team now has two jobs: let everyone build with data and AI on their own, and "build and champion the singular reality their company operates on." Analysts' judgment goes into shared, agent-readable artifacts instead of one-off reports.
2. **Why you're seeing it:** It is about who curates metrics and why agents raise the stakes (`semantic-models`, `dbt-context`).
3. **Seen before?** The breadth pass read his July interview on consensus. This is his own, longer argument six weeks later.
4. **Relates to:** #35's counter-argument. He treats curation as the job itself, not as overhead. He still gives no figure for what it takes.
5. **Takeaways for you:** He wants every agent to start "from the data scientist's representation of what's true, what matters, and why." In his framing, defining metrics is data-science work that now ships as infrastructure.

### From analytics engineer to context engineer
[link](https://www.getdbt.com/blog/from-analytics-engineer-to-context-engineer) · 2026-08-06 · vendor blog (dbt Labs) · read in full · listed source
1. **What it is about:** Britton Stamper, who works on AI enablement at dbt Labs, writes about analytics engineers. They build the cleaned, tested tables in dbt that sit between raw data and analysis. He says the role is becoming "context engineer": compress, enrich, describe and govern data, including "exactly what each agent is allowed to see." His example turns Gong sales-call transcripts into short dbt tables, so sales agents stop reading raw calls.
2. **Why you're seeing it:** It is dbt's own answer to who curates (`dbt-context`, `semantic-models`).
3. **Seen before?** The 2026-09-24 breadth pass quoted dbt's June post calling the role "governance owner, AI context provider". This post makes that concrete. Tristan Handy discussed it in the [2026-08-21 Roundup](https://roundup.getdbt.com/p/roundup-why-your-sales-team-shouldnt).
4. **Relates to:** The `meta_filter` in dbt's MCP server, from the breadth pass, which lets a tag such as `agent_accessible` decide which metrics an agent lists. MCP is the standard way an AI tool calls another system. dbt's [July release note](https://docs.getdbt.com/docs/dbt-versions/dbt-cloud-release-notes) says the filter exists to keep result lists small. It does not describe it as access control.
5. **Takeaways for you:** Here, deciding what agents see is an analytics-engineering job. Metrics are only one part of it.

### The missing role in every enterprise AI strategy: the analytics engineer
[link](https://www.cio.com/article/4204033/the-missing-role-in-every-enterprise-ai-strategy-the-analytics-engineer.html) · 2026-08-03 · trade-press opinion (CIO contributor) · read in full · search
1. **What it is about:** Ritish Chugh, a fintech data leader, argues that the analytics engineer "owns the semantic data layer": versioned, validated metric definitions, each with an accountable owner. AI should consume only validated outputs, because an ungoverned metric's ambiguity gets amplified "at the output layer."
2. **Why you're seeing it:** It covers the split between analytics engineers and data scientists over who defines metrics (`semantic-models`, `agent-efficacy`).
3. **Seen before?** No earlier brief took the ownership question to an IT-leadership audience.
4. **Relates to:** Macomber, above, gives the definitions to data scientists. Chugh gives data scientists the models built on top, such as anomaly and fraud detection.
5. **Takeaways for you:** Both answers are in print. The one a company picks decides whether defining metrics sits with the data scientist who argues about them or with the engineer who ships them.

### Operationalizing Genie Ontology in your data stack
[link](https://www.databricks.com/blog/operationalizing-genie-ontology-your-data-stack) · 2026-09-01 · vendor blog (Databricks) · read in full · listed source
1. **What it is about:** Genie is Databricks' question-answering agent. Its new "ontology" collects context from metric views, dashboards, notebooks and table descriptions, then "ranks that context by authority and relevance." Certified assets and definitions reviewed by their owners win when sources conflict. Building metric views and certifying assets stay human work. AI-drafted descriptions wait for a person to approve them.
2. **Why you're seeing it:** It shows a second way to decide what an agent sees (`warehouse-agentic`, `semantic-models`).
3. **Seen before?** The breadth pass read Colrows on Databricks metric views. The ranking layer on top is new.
4. **Relates to:** dbt tags metrics in or out, while Databricks ranks everything. A [Hiflylabs guide](https://hiflylabs.com/blog/2026/7/29/how-to-prepare-for-databricks-genie-ontology) (2026-07-29) warns that "a winner does not equal real consensus between your teams."
5. **Takeaways for you:** Start with one high-value domain: "You should not try to cover the whole business before going live."

### Semantic Layer for AI and BI (2026): how to implement it
[link](https://omni.co/articles/best-semantic-layer-for-ai-and-bi-2026) · 2026-09-02 · vendor guide (Omni, a BI tool with its own semantic layer) · read in full · search
1. **What it is about:** Six steps for a rollout that "sticks." Name metric owners, approvers and domain boundaries first. Start with 10-20 core metrics. Mark each one certified, experimental or deprecated before launch. Then pilot on 15-30 real questions that users already ask, and compare the answers from dashboards, analysts and AI.
2. **Why you're seeing it:** It covers starting small and how much to cover (`semantic-models`, `agent-efficacy`).
3. **Seen before?** In the breadth pass, Gouze said the layer should hold only the metrics that must be exact. This guide puts a number on "few."
4. **Relates to:** #42's warning, via the QUVI paper, that tuning a layer to a fixed set of questions overfits it. This pilot is exactly such a set.
5. **Takeaways for you:** The pilot is an experiment you already know how to run. Omni sells a competing layer and gives no source for its numbers.

**Leads:**
- **L-1a** - Summit 2026 rollouts of governed metrics for agents, company by company. Read the dbt Summit session pages, plus recordings or slides as they are posted: Okta (Pooja Crahen), Nordstrom (Nadine Bruxel), ING (Jarno Boeijink), Amazon's session on Redshift with the dbt Semantic Layer, Sigma (Matt Senick, with the `dbt_semantic_view` package) and AlphaSense with Euno. Add each company's own engineering blog. Find out who owned the definitions, which domain each team started with, and how many metrics reached agents.
- **L-1b** - How each platform decides which metrics an agent may see. Read dbt's `meta_filter` and saved-query docs, Snowflake's docs on verified queries in semantic views and on Cortex Analyst, Databricks' docs on certification and Genie Ontology, and Omni's and Looker's features for certified content. Compare explicit curation (tags and allow-lists) with ranking by authority and usage. Note what each approach asks of the metric owner.

**So what:** Every source names someone to curate metrics, but not the same someone - the data scientist (Macomber), the analytics engineer (Chugh, dbt) or the business with engineering enforcing (Databricks) - and they agree on named owners, a small certified core and a pilot on real questions. The skill that carries over is settling a metric dispute; the new part is shipping that settlement as reviewed code that decides what agents see. None says how long curation took, so #35's counter-argument still stands.

## Level 2a - Rollouts, company by company

The six dbt Summit company talks can only be read as abstracts so far. Their session pages do not load, and no recordings or slides could be reached. So this level reads the abstracts once, then turns to companies that wrote their own rollouts down. **Background:** Sigma's [May 27 post](https://www.sigmacomputing.com/blog/manage-snowflake-semantic-views), written before its Summit talk, is the one company account that says who owns the definitions. Its data platform team keeps "a separate Semantic View per domain: sales, support, product", so "Customer Success does not see different ARR than Finance."

### Your next level starts here: a preview of dbt Summit sessions, by role
[link](https://www.getdbt.com/blog/dbt-summit-2026-sessions-by-role) · 2026-07-20 · vendor blog (dbt Labs) · read in full, but it carries session abstracts only · listed source
1. **What it is about:** Abstracts for the six company talks. Okta uses dbt as "the source of truth" for definitions and Snowflake to run them. Nordstrom treats data freshness as an "AI SLA" (a promised service level) under a chat agent. ING is rolling dbt out across a regulated bank. Amazon connects dbt's MCP server to Redshift's, "so an agent never authors a query". AlphaSense uses Euno, a metadata tool, to feed lineage and ownership to Claude and Cursor.
2. **Why you're seeing it:** It is the lead's company list (`semantic-models`, `dbt-context`).
3. **Seen before?** The breadth pass read Multishoring's outside summary of the Summit. This is dbt's own list of the talks.
4. **Relates to:** Level 1's ownership question. No abstract answers it.
5. **Takeaways for you:** No abstract says who owns the definitions, which domain came first, or how many metrics agents reach.

### Apache Ossie: Sigma Computing data model converter
[link](https://github.com/apache/ossie/tree/main/converters/sigma) · first commit 2026-09-08 · open-source code (Apache Ossie) · read in full · search
1. **What it is about:** Matt Senick, the Sigma analytics engineer giving the Summit talk, added a two-way converter. It translates Sigma's data models (Sigma is a BI tool) to and from Ossie YAML. Each formula is kept both as Sigma text and as SQL, so a round trip loses nothing.
2. **Why you're seeing it:** It is the one Summit talk that left something you can read (`semantic-models`, `dbt-context`).
3. **Seen before?** The breadth pass covered dbt importing Ossie. This is a BI vendor writing its own converter.
4. **Relates to:** The talk's abstract. A Dagster job (Dagster is an orchestrator, which runs builds in order) deploys Snowflake semantic views, Cortex Agents and Sigma models from one dbt project.
5. **Takeaways for you:** Sigma keeps one definition per domain and generates every other copy of it, including the ones agents use.

### Building the DT Semantic Layer: agent-driven data modeling
[link](https://www.digitalturbine.com/blog/building-the-dt-semantic-layer-creating-a-single-source-of-truth-with-agent-driven-data-modeling) · 2026-08-13 · company engineering blog (Digital Turbine) · read in full · search
1. **What it is about:** Digital Turbine is a mobile advertising company. It built its own semantic layer on Databricks rather than using dbt or Cube. It started with core entities: "one definition of a user", one of a device. Claude runs an `add-entity-definition` questionnaire to draft each definition, and schema checks catch drafts that drift.
2. **Why you're seeing it:** It is a named company's own rollout, with an agent helping to curate (`semantic-models`, `agent-efficacy`).
3. **Seen before?** The breadth pass read dbt's skill for an agent building semantic models. This is a company doing the same thing on its own stack.
4. **Relates to:** Level 1's Genie Ontology, where AI drafts and a person approves.
5. **Takeaways for you:** The first users were data scientists, whose models gained 0.09 to 0.15 AUC. The team says adoption is at an "early stage".

### Feedback: apache-ossie converters (from a MetricFlow / dbt-databricks shop)
[link](https://github.com/apache/ossie/discussions/325) · 2026-08-14 · practitioner report (GitHub discussion) · read in full · search
1. **What it is about:** A team that keeps metrics in both Databricks metric views and dbt's MetricFlow tested Ossie's converters on its real project. Metrics built on one fact table (a table of events or transactions) converted with "numerically faithful" results. Metrics combining two fact tables did not convert, and neither did metrics built from other metrics. Labels and default time columns were dropped without a warning.
2. **Why you're seeing it:** It shows a rollout that spans two layers (`semantic-models`).
3. **Seen before?** The breadth pass found that dbt's Ossie import drops unsupported metric types. This team hit the same limit from the other direction.
4. **Relates to:** Sigma's plan to generate every copy from one definition.
5. **Takeaways for you:** Metrics built from other metrics are the ones that fail to convert. Nobody has replied.

**Leads:**
- **L-2a-i** - Sigma's one-project pattern, piece by piece. Read the Snowflake Labs `dbt_semantic_view` package's README and changelog, and the Ossie Sigma converter's `LIMITATIONS.md`. Add Dagster's dbt and Sigma integration docs, Sigma's data-model API docs, and Senick's Summit recording on the dbt Summit 2026 YouTube playlist once it is posted. Find out how one team deploys one definition per domain to BI, Cortex Agents and Sigma, and what each translation drops.
- **L-2a-ii** - An agent drafts and a named owner approves: how companies split the curation work. Read Digital Turbine's `add-entity-definition` workflow, the customer quotes for Snowflake's Semantic View Autopilot, Omni's Modeling Agent docs, Databricks' option to export a Genie agent's context as a metric view, and any in-window company post that describes a review step. Find out who signs off on a definition an agent drafted, and what checks run first.

**So what:** The companies on stage at the Summit have published abstracts, not accounts. The two that wrote their rollouts down keep a small central team owning one definition per domain or entity, generate every other copy from it, and let an agent draft definitions that a person or a check approves. Nobody says how many metrics reached agents, so "start small" is still advice rather than a reported result.

## Level 2b - Choosing which metrics an agent sees

Level 1 found two ways to decide what an agent sees: dbt tags metrics in or out, and Databricks ranks everything. This level reads how five platforms put that into practice. **Background:** nothing Snowflake published on curation is dated inside the window. Its verified queries are stored question-and-SQL pairs kept in a semantic view. Its [suggestions page](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-analyst/verified-query-suggestions) (undated) groups questions users often ask that no verified query matches, and proposes up to ten at a time for a person to accept, edit or dismiss. Snowflake's [Semantic View Autopilot post](https://www.snowflake.com/en/blog/semantic-view-autopilot/) (2026-02-03) calls this a move "from coding into curation".

### Flag data as certified or deprecated (Databricks)
[link](https://docs.databricks.com/aws/en/data-governance/unity-catalog/certify-deprecate-data) · last updated 2026-09-11 · vendor doc · read in full · listed source
1. **What it is about:** Unity Catalog is Databricks' governance catalog, the registry of what data exists and who may use it. Its `system.certification_status` tag marks tables, metric views, dashboards, Genie Agents and notebooks as "certified" or "deprecated". Only people granted permission can set it. A beta feature assigns the tag automatically by rule, "such as query usage, asset age, owner".
2. **Why you're seeing it:** It shows how a person marks which metrics an agent should trust (`warehouse-agentic`, `semantic-models`).
3. **Seen before?** Level 1 read Databricks' Genie Ontology blog. This page is where the certification it relies on gets set.
4. **Relates to:** The [Genie Ontology doc](https://docs.databricks.com/aws/en/genie/genie-ontology), updated the same day, which scores context "based on where it was generated from, how often it is used, and how fresh it is."
5. **Takeaways for you:** Certifying something does not show or hide it from the agent; it makes the thing rank higher. Under the automation rule, heavy use can earn the certified tag.

### What is Genie Ontology? (Atlan)
[link](https://atlan.com/know/ai-agent/databricks/genie-ontology/) · 2026-06-19, updated 2026-08-10 · vendor explainer (Atlan, a data-catalog company) · read in full · search
1. **What it is about:** An outside explainer on OntoRank, the ranking behind Genie Ontology, which weighs "creator credibility, usage breadth, dataset linkage, and recency." Atlan names two limits. The ranking learns only from Databricks and its connected apps, while most companies also run Snowflake, dbt or Tableau. And a usage signal can favour the popular definition over the correct one.
2. **Why you're seeing it:** It is the case against ranking (`warehouse-agentic`, `agent-efficacy`).
3. **Seen before?** Level 1 quoted Hiflylabs: "a winner does not equal real consensus."
4. **Relates to:** **Background:** [Typedef](https://www.typedef.ai/blog/what-is-genie-ontology-databricks-continuously-learned-context-layer-explained) (2026-06-24): "Ranking the most trusted definition of a metric is not the same as checking whether the number an agent computes from it is correct."
5. **Takeaways for you:** Atlan sells a competing catalog. Its concern still matches one you know well: the most-used dashboard is not always the right one.

### Best practices for configuring Conversational Analytics in Looker
[link](https://docs.cloud.google.com/looker/docs/conversational-analytics-looker-best-practices) · last updated 2026-09-24 · vendor doc · read in full · listed source
1. **What it is about:** Looker is Google's BI tool. An Explore is its curated starting point for queries: a set of joined tables with chosen fields. The page tells teams to build separate Explores for agents, keeping only the fields the agent needs and hiding keys and technical columns. It says to "create focused agents for distinct business areas," not one agent for everything.
2. **Why you're seeing it:** Here, curating what an agent sees means leaving things out (`semantic-models`, `warehouse-agentic`).
3. **Seen before?** The 2026-09-24 exploration covered Looker's golden queries. This page is about which fields reach the agent.
4. **Relates to:** Omni's `ai_fields`, below, and dbt's `meta_filter`.
5. **Takeaways for you:** Usage feeds the curation. System Activity, Looker's usage logs, shows which fields agents' queries used, so you can decide what to drop.

### Multi-agent and Certified queries (Cube)
[link](https://docs.cube.dev/admin/ai/multi-agent) · revised 2026-08-26 (dated by [the change's pull request](https://github.com/cube-js/cube/pull/11657)) · vendor doc · read in full · search
1. **What it is about:** Cube is a standalone semantic layer with its own agents. Each agent lists its `accessible_views`, the curated views it may query, in an `agents/config.yml` file kept with the data model. Each space groups rules and [certified queries](https://docs.cube.dev/admin/ai/certified-queries): SQL that admins reviewed, which the agent may reuse or adapt.
2. **Why you're seeing it:** It is a written allow-list, versioned as code (`semantic-models`, `warehouse-agentic`).
3. **Seen before?** The 2026-09-24 exploration read Cube's semantic-layer comparisons. Its agent configuration is new.
4. **Relates to:** Snowflake's verified queries and Looker's golden queries: curated examples that guide the agent without limiting it to them.
5. **Takeaways for you:** Cube says plainly: "Don't rely on an agent for security." An allow-list guides what the agent does. Access policies in the model are what actually restrict data.

### Optimize models for Omni AI
[link](https://docs.omni.co/modeling/develop/ai-optimization) · undated page; [changelog](https://docs.omni.co/changelog) entries 2026-07-06 and 2026-08-03 · vendor doc · read in full · listed source
1. **What it is about:** Omni is a BI tool with its own semantic layer. Modelers choose which topics the AI may use with `ai_chat_topics`, and which fields with `ai_fields`, and add `sample_queries` and `ai_context` notes. The page ranks the levers by impact: "ai_context > ai_fields > sample_queries > synonyms > field descriptions." In July, `omni_agent` let context differ by agent.
2. **Why you're seeing it:** It shows curation spread across several levers (`semantic-models`).
3. **Seen before?** Level 1 read Omni's rollout guide. This page shows how the curation itself is done.
4. **Relates to:** Looker's field-trimming. A workbook inspector shows the exact context the AI received.
5. **Takeaways for you:** Omni's [February post](https://omni.co/blog/improving-ai-quality-with-context) (Background) says most teams "start with just a small amount of model-level context and a few key topics."

**Leads:**
- **L-2b-i** - Usage as an input to curation, platform by platform. Read Snowflake's verified-query suggestions and Semantic View Autopilot docs, Databricks' beta rule that certifies assets automatically and the usage weight in OntoRank, Looker's System Activity for queries that agents generate, and Omni's "Learn from conversation". Also read practitioner accounts of using each one. For each, establish what usage only proposes for a person to approve and what it promotes without a person.
- **L-2b-ii** - Curated example queries as a curation layer. Compare Snowflake's verified queries (`verified_by`, onboarding questions), Looker's golden queries, Cube's certified queries per space, Databricks Genie's example SQL, and dbt's saved queries. Read each one's docs and walkthroughs for who writes the examples, how they are reviewed and versioned, and whether the agent must follow them or only learns from them.

**So what:** Two models run side by side. Looker, Cube, Omni and dbt give the agent an explicit list written into code; Databricks lets everything in and ranks it, with certification as the strongest vote; Snowflake sits between, with usage proposing and a person approving. Every platform feeds usage back in somewhere, so the curator's real job is judging when heavy use means a metric is right - a judgment you have made about dashboards for years.

## Where this path ends

Every source says a semantic layer needs named curators and a small certified core, but they disagree on who curates. Macomber says the data scientist, Chugh and dbt say the analytics engineer, and Databricks says the business, with engineering enforcing. None reports how long curation took, so #35's counter-argument still stands. The companies that wrote their rollouts down, Sigma and Digital Turbine, both have a central owner for one definition per domain or entity and generate every other copy from it. Both let an agent draft definitions that a person or a check approves. The named Summit talks are abstracts only so far. Deciding what an agent sees follows two models. Some platforms write an explicit list into code (dbt, Cube, Looker, Omni). Databricks ranks everything, with certification as the strongest vote, and Snowflake sits between: usage proposes, a person approves. What recurs for the curator is judging whether heavy use means a metric is right. A product data scientist has been making that call about dashboards all along, so this path is the most direct bridge from the reader's current job to the new one.
