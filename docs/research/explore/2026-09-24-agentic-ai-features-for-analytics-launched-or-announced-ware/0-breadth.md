# Breadth pass - agentic AI features for analytics

What warehouse, BI, semantic-layer and notebook vendors launched or announced
for agents between late June and late September 2026, plus the first serious
evaluation of one.

A typical company stack, bottom up: a **warehouse** stores the tables and runs
SQL. **dbt** turns raw tables into cleaned ones. A **semantic layer** defines
business terms like "revenue" once. On top sit **BI tools** (dashboards) and
**notebooks** (SQL, Python and charts in one document). Most agents below read
a semantic layer.

## 1. Warehouses - the agent a business user talks to

Snowflake and Google both moved their warehouse chat agents forward. Each
claimed quality in words, not numbers.

### Snowflake recommends moving from Cortex Analyst to Cortex Agents
[link](https://docs.snowflake.com/en/release-notes/2026/other/2026-08-28-cortex-analyst-transition-cortex-agents) · 2026-08-28 · vendor doc · read in full

1. **What it is about:** Snowflake is a cloud data warehouse, and it offers two ways to question your data in plain English. Cortex Analyst turns a question into SQL. Cortex Agents plans several steps and calls tools. This note recommends Cortex Agents, "which supports every Cortex Analyst capability with higher answer quality."
2. **Why you're seeing it:** It is a warehouse vendor's own agent launch (`warehouse-agentic`) with a quality claim attached (`agent-efficacy`).
3. **Seen before?** #42 covered Snowflake's governance layer and Semantic View Autopilot. This is the first piece on the product a business user actually talks to.
4. **Relates to:** Path 1 follows the quality claim, and path 3 follows how the agent writes its SQL.
5. **Takeaways for you:** You keep your semantic views and verified queries (stored question-and-SQL pairs) when you switch. No figure backs "higher answer quality", and Snowflake has published no comparison of the two products.

### Conversational Analytics in BigQuery now GA
[link](https://cloud.google.com/blog/products/data-analytics/conversational-analytics-in-bigquery-now-ga) · 2026-06-30 · vendor blog · read in full

1. **What it is about:** BigQuery is Google's cloud warehouse, and Conversational Analytics is its chat agent. The agent answers from BigQuery tables directly, or from Looker's semantic model when Looker is in use. This post announces general availability. A [Q3 roundup](https://cloud.google.com/blog/products/data-analytics/conversational-analytics-in-google-data-cloud-in-q326) (2026-07-28) adds the API.
2. **Why you're seeing it:** It is the second warehouse vendor's agent (`warehouse-agentic`).
3. **Seen before?** New to you. #19 covered Microsoft's and OpenAI's data agents, not Google's.
4. **Relates to:** The Snowflake note above, and Looker in angle 3.
5. **Takeaways for you:** Google says "Accuracy in Conversational Analytics is by design, not aspirational." Its only evidence is one customer saving "around half a day each week". Like Snowflake, Google asserts quality and publishes no measurement.

## 2. BI tools - dashboards becoming agents

Tableau was the only BI tool with an in-window announcement that could be read in full.

### Evolving Tableau touts tools to fuel AI-powered analytics
[link](https://www.techtarget.com/data-technologies/news/366650876/Evolving-Tableau-touts-tools-to-fuel-AI-powered-analytics) · 2026-09-21 · news · read in full

1. **What it is about:** Tableau is Salesforce's dashboard (BI) tool. At Dreamforce it announced four products, all due by the end of October: Studio (build apps by describing them), Proactive Intelligence (an "always-on analyst"), Tableau Knowledge (a "context layer" for AI) and Data Apps (Tableau inside ChatGPT and Claude).
2. **Why you're seeing it:** `analytics-broad` covers BI tools, and Tableau Knowledge touches `semantic-models`.
3. **Seen before?** #26 covered Salesforce's Agent Fabric from the same conference. This is the analytics half.
4. **Relates to:** Looker's and Snowflake's semantic layers. Every layer now claims to be the context that agents read.
5. **Takeaways for you:** In [May](https://www.techtarget.com/searchbusinessanalytics/news/366642778/Tableau-repositions-for-AI-unveils-new-knowledge-layer), TechTarget reported the knowledge engine as due in June, so as reported it has slipped to October. No accuracy claim came with it. One analyst's summary: "the whole market is moving in this direction."

## 3. Semantic layers - definitions moving into the warehouse

The quarter's semantic-layer news is about where definitions live, and the
answer is increasingly the warehouse.

### In-database analytic models (Looker)
[link](https://docs.cloud.google.com/looker/docs/analytic-models) · undated page; feature in preview 2026-08-28 · vendor doc · read in full

1. **What it is about:** Looker is Google's BI tool. Its modelling language, LookML, defines joins, dimensions and measures once as code. This page describes Looker compiling a LookML "Explore" (a set of joined tables that users query) into a Snowflake semantic view or a BigQuery Graph inside the warehouse.
2. **Why you're seeing it:** It is about where semantic definitions live, which is `semantic-models` and `dbt-context`.
3. **Seen before?** It mirrors #42 item 2, where Snowflake's Autopilot imports Power BI models into Snowflake. Looker exports in the other direction.
4. **Relates to:** Path 3 follows what survives the translation. It also skips Apache Ossie, #42's neutral exchange format.
5. **Takeaways for you:** The warehouse is becoming where semantic definitions end up. Looker's [release notes](https://docs.cloud.google.com/looker/docs/release-notes) for the same day also made "golden queries" GA. These are curated question-and-SQL pairs, the same idea as Snowflake's verified queries.

## 4. Notebooks - evaluation tools for the customer

Hex is a hosted notebook: SQL, Python and charts in one document. This quarter
it shipped a way for customers to test its agent.

### Introducing Evals (Hex)
[link](https://hex.tech/blog/evals/) · 2026-08-04 · vendor blog · read in full

1. **What it is about:** Hex's agent answers data questions in chat ("Threads") and inside notebooks. With Evals, a team writes test questions with a known answer or reference SQL and grades the agent with checks or an LLM judge. Later updates let a chat open into a notebook (2026-08-11) and made test suites versioned and schedulable (2026-09-15).
2. **Why you're seeing it:** Evals is about proving an agent works (`efficacy-methodology`). Suites rerun "as your guides or semantic models evolve" (`semantic-models`).
3. **Seen before?** New to you.
4. **Relates to:** Snowflake's evaluators in path 1, level 2. Cube says it "recently released Cube Evals", and Sigma says evals are "coming later in 2026".
5. **Takeaways for you:** The quarter's pattern is that vendors ship tools for you to measure their agents instead of publishing measurements. A versioned suite could show what a change to a semantic model buys. Nobody has published such a result yet.

### Hex Evals documentation
[link](https://learn.hex.tech/docs/agent-management/evals) · undated · vendor doc · read in full

1. **What it is about:** Hex's reference for Evals: how test cases, repeated attempts and pass rates work.
2. **Why you're seeing it:** An evaluation's scoring rule decides what its number means (`efficacy-methodology`).
3. **Seen before?** Yes, in the Hex launch post just above. This page has the details behind it.
4. **Relates to:** The Thumbtack paper below, and path 2, which is about how repeated runs become one score.
5. **Takeaways for you:** A case can run 1-3 attempts, and "the case passes as long as no more than one attempt fails". So an agent that is right once and wrong once passes. Hex's stated aim is to tolerate "a one-off failure". Whenever a pass rate comes from several attempts, ask how the attempts were combined.

## 5. Evidence - does any of it work?

This is the one in-window evaluation of a deployed enterprise analytics agent
with a real design.

### Evaluating Enterprise Analytics Agents: An End-to-End, Trace-Backed Methodology
[link](https://arxiv.org/abs/2609.09182) · 2026-08-28 · paper · read in full

1. **What it is about:** Eight authors at Thumbtack, an online marketplace for local services, evaluate their own internal analytics agent. They grade its trace (the tools it called and the tables it used) as well as its final answer. The study used 50 questions, two model setups and three runs of each.
2. **Why you're seeing it:** It is about what an organisation accepts as evidence (`efficacy-methodology`, `agent-efficacy`).
3. **Seen before?** It is in the same family as #26's ERPBench (85% "saved", 3% correct) and #42's GROUND. It is the first of these on a deployed enterprise agent.
4. **Relates to:** Path 2 goes deeper into how it scores.
5. **Takeaways for you:** The stronger setup lifted real-data answers from 21% to 73%. It also changed which table it used on 41 of 50 questions across runs. Capability and consistency can move in opposite directions, and grading each final answer once would miss that. The study has no human baseline and no A/B test.
