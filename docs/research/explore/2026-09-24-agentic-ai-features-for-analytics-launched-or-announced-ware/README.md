# Agentic AI features for analytics

Seed: agentic AI features for analytics, launched or announced · mode: learning, rewritten from a scrutiny-mode run on 2026-09-24 · 2026-09-24

## What's out there

This quarter, every layer of the stack shipped or announced an agent:
- Snowflake is steering customers to Cortex Agents;
- Google made BigQuery's chat agent generally available;
- Tableau promised a "knowledge" layer for October;
- Looker can now write its semantic model into the warehouse;
- Hex shipped evaluation tools.

Launches claim quality in words and hand customers tools to test it. The
numbers that exist come from vendor blogs, comparing each vendor's agent with
general coding agents on unpublished questions.

Research is sharper. An agent can grow more capable and less consistent at
once. How repeated runs are combined changes the score, and one leaderboard's
top place came from reruns. Semantic layers are settling in the warehouse, but
Snowflake's recommended agent reads the semantic view rather than being bound
by it.

## The map

**Breadth** ([0-breadth.md](0-breadth.md))
- [Snowflake: move to Cortex Agents](https://docs.snowflake.com/en/release-notes/2026/other/2026-08-28-cortex-analyst-transition-cortex-agents) - quality claim, no figure
- [BigQuery Conversational Analytics GA](https://cloud.google.com/blog/products/data-analytics/conversational-analytics-in-bigquery-now-ga) - Google's warehouse agent
- [Evolving Tableau](https://www.techtarget.com/data-technologies/news/366650876/Evolving-Tableau-touts-tools-to-fuel-AI-powered-analytics) - Knowledge layer, due October
- [Looker analytic models](https://docs.cloud.google.com/looker/docs/analytic-models) - LookML into the warehouse
- [Introducing Evals](https://hex.tech/blog/evals/) - Hex's agent tests
- [Hex Evals docs](https://learn.hex.tech/docs/agent-management/evals) - one pass in two counts
- [Thumbtack evaluation](https://arxiv.org/abs/2609.09182) - capable but inconsistent

**Path 1 - vendor quality claims** ([file](path-1-vendor-quality-evidence.md))
- [Cortex Sense](https://www.snowflake.com/en/blog/enterprise-ai-agents-grounded-context/) - 24.1% → 86.3%
- [CoCo & CoWork](https://www.snowflake.com/en/blog/engineering/snowflake-coco-cowork-token-spend-efficiency/) - 58 internal questions
- [Databricks data agent](https://www.databricks.com/blog/why-frontier-data-agent-outperforms-general-coding-agents-quality-and-cost) - 401 unreleased tasks
- [data-eng-bench](https://www.snowflake.com/en/blog/engineering/data-eng-bench-data-engineering-agent-benchmark/) - public, quickly checked
- [BI Bench](https://www.basedash.com/blog/ai-data-analyst-benchmark-bi-bench-results) - a competitor's leaderboard
- [Cortex Agent evaluations](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-agents-evaluations) - judge-graded, no hold-out
- [Cortex Analyst evaluations](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-analyst-evaluations) - holds test queries out
- [Migration guide](https://www.snowflake.com/en/developers/guides/migrate-cortex-analyst-to-cortex-agents/) - "compare them yourself"
- [Evaluating Cortex Agents](https://www.snowflake.com/en/developers/guides/best-practices-for-evaluating-cortex-agents/) - consistency is the bar
- [Getting started](https://www.snowflake.com/en/developers/guides/getting-started-with-cortex-agent-evaluations/) - hands-on quickstart
- [Building Cortex Agents](https://www.snowflake.com/en/developers/guides/best-practices-to-building-cortex-agents/) - verified queries steady answers

**Path 2 - repeated runs** ([file](path-2-trace-backed-evaluation.md))
- [Thumbtack full text](https://arxiv.org/html/2609.09182v1) - the scoring rules
- [DataAgentBench](https://github.com/ucbepic/DataAgentBench) - five runs, averaged
- [BI-Bench](https://arxiv.org/abs/2609.20886) - ten runs, mean only
- [Noise Floor Audit](https://arxiv.org/abs/2608.22331) - rewording beats rerunning
- [PR #95](https://github.com/ucbepic/DataAgentBench/pull/95) - how rank 1 was reached
- [APIFlow-Bench](https://arxiv.org/abs/2608.29128) - strict score doubles spread
- [IBM on pass^k](https://huggingface.co/blog/ibm-research/altk-evolve-consistency) - the strict score explained
- [PR #100](https://github.com/ucbepic/DataAgentBench/pull/100) - tuned entries hidden
- [Permute paper](https://arxiv.org/abs/2609.25286) - rank 1's own account
- [ClawProBench](https://arxiv.org/abs/2608.22510) - a written rerun rule
- [Leaderboard ranks](https://arxiv.org/abs/2609.07785) - many pairs too close

**Path 3 - semantic models in the warehouse** ([file](path-3-semantic-layer-into-warehouse.md))
- [derived_analytic_model](https://docs.cloud.google.com/looker/docs/reference/param-view-derived-analytic-model) - export drops access filters
- [BigQuery Graph measures](https://cloud.google.com/blog/products/data-analytics/bigquery-graphs-with-measures-for-trusted-agentic-workloads) - key-locked aggregations
- [Symmetric aggregates](https://docs.cloud.google.com/looker/docs/best-practices/understanding-symmetric-aggregates) - double-counting explained
- [dbt's Ossie document](https://docs.getdbt.com/reference/artifacts/sl-manifest) - four named losses
- [Routing Mode](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-analyst/cortex-analyst-routing-mode) - semantic SQL ~10%
- [Semantic views overview](https://docs.snowflake.com/en/user-guide/views-semantic/overview) - agents query tables
- [Agent lineage](https://docs.snowflake.com/en/release-notes/2026/other/2026-09-02-cortex-agent-lineage) - agents need table access
- [Materializations](https://docs.snowflake.com/en/user-guide/views-semantic/materializations) - bypassed by agents
- [Preventing double counting](https://www.snowflake.com/en/blog/engineering/snowflake-cortex-analyst-introducting-joins-complex-schemas/) - Analyst's join checker
- [Why semantic views?](https://www.snowflake.com/en/blog/engineering/why-we-need-semantic-views/) - deterministic vs grounded
- [Create and manage agents](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-agents-manage) - guards undocumented
- [Semantic view best practices](https://www.snowflake.com/en/developers/guides/best-practices-semantic-views-cortex-analyst/) - keys set join direction

## How it fits together

- **Paths 1 and 3 meet at Cortex Agents.** One asks how it is tested, the other how it writes SQL. Both find the semantic view is reading material, not a rule.
- **Path 2 pairs with the sibling exploration** [methodology for proving agentic AI efficacy](../2026-09-24-methodology-for-proving-agentic-ai-efficacy-study-designs-ev/): an average hides whether an agent succeeds every time.
- **The [2026-09-23 Snowflake exploration](../2026-09-23-snowflake-sql-ai-functions/README.md)** saw benchmark results shift after release and averages hide differences. Paths 1 and 2 see the same for agents.
- **Path 3 continues #35 and #42**: deterministic compilation, Apache Ossie, Autopilot.

## Candidate topics

Proposals only. None of these is in the profile.

- `agent-claim-evidence` · Depth, under `warehouse-agentic`: what stands behind a vendor's quality claim for its agent. *From path 1.*
- `repeat-run-rules` · Depth, under `efficacy-methodology`: how repeated runs become one number. *From path 2.*
- `semantic-layer-binding` · Depth, under `semantic-models`: whether a semantic definition binds the agent that reads it. *From path 3.*

The original, audit-style version of this exploration is in [`scrutiny/`](scrutiny/README.md).
