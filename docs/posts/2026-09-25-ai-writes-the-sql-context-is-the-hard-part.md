---
title: AI can write the SQL. Context is what stops people trusting it.
date: 2026-09-25
status: draft
runs:
  - docs/research/explore/2026-09-25-the-dbt-semantic-layer-one-level-deeper-what-it-is-how-metri/
  - docs/research/explore/2026-09-25-databricks-agentic-ai-offerings-what-they-are-where-each-sit/
---

AI can write the SQL. That was never what stopped people trusting the answer.

At Meta, I've watched AI write SQL almost perfectly. Yet our cross-functional partners still couldn't use its output without sending it to a data scientist for query review.

The basic sanity checks are easy to automate. An agent can look for nulls and check that a join didn't blow up the row count.

What it couldn't check was context:
- Which table is the right one for this product?
- Does this column value really mean what I think it means?
- Is anything I'm about to use already outdated?

That's the same drudgery that made the job hard before AI.

After 8 years inside one company's stack, I wanted to know how much of this the rest of the industry has solved. So I pointed my research agents at data stacks outside Meta.

What clicked for me: they move the review. Instead of a data scientist checking every query afterwards, someone reviews the context once, up front, and the agent reads it.

Which table: Google's Looker docs tell teams to build separate, trimmed views just for agents, with only the fields they need.

What a column means: in dbt, metric definitions live in YAML in the project, so a change to a definition gets reviewed like any other code change. Databricks says definitions reviewed by their owners beat ones its agent inferred, and AI-drafted descriptions wait for a person to approve them.

What's outdated: Omni, a BI vendor, says to mark every metric certified, experimental or deprecated before launch. A Databricks consultancy counts deleting abandoned dashboards as curation, because the agent learns from them.

It isn't solved. Databricks ranks competing definitions, and that same consultancy warns that "ranking the most trusted definition is not the same as having a correct one." Nothing I found says how long this curation takes.

And honestly, the reading gave me the shape of it, not the feel. I skimmed more than half of it.

So next I'm building a small stack of my own: a toy website, event logging, synthetic users, dbt, and a data agent on top. Then I'll find out whether writing the context down actually removes the query review.

The reading was done by an agentic research system I built. It explores a topic breadth first, follows the best leads down, and writes a synthesis at every level. Sources and the repo are in the first comment.

## First comment

Sources, reading as of 2026-09-25:
- Looker, conversational analytics best practices: https://docs.cloud.google.com/looker/docs/conversational-analytics-looker-best-practices
- dbt, the metrics YAML spec: https://docs.getdbt.com/docs/build/latest-metrics-spec
- Databricks, operationalizing Genie Ontology: https://www.databricks.com/blog/operationalizing-genie-ontology-your-data-stack
- Omni, semantic layer rollout guide: https://omni.co/articles/best-semantic-layer-for-ai-and-bi-2026
- Hiflylabs, preparing for Genie Ontology: https://hiflylabs.com/blog/2026/7/29/how-to-prepare-for-databricks-genie-ontology

The research system, open source: https://github.com/chamaya00/background-research-agents
