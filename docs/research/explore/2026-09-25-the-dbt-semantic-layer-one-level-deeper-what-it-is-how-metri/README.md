# The dbt Semantic Layer, one level deeper

Seed: the dbt Semantic Layer - what it is, how metrics are defined and served, and how agents use it, for a product data scientist moving into data engineering · mode: learning · 2026-09-25 · produced in auto-breadth mode, in GitHub Actions (width 5, paths 3, depth 2; every path reached levels 2a and 2b)

## Synthesis

The dbt Semantic Layer is two things. MetricFlow, an open-source engine, turns metric definitions written in YAML into SQL. A paid hosted service serves those metrics by name to BI tools and agents. For someone moving from product data science into data engineering, the reading adds up to one claim: the syntax got easy, and the work that remains is judgment you already have.

Defining metrics got simpler this year. A semantic model now sits on a dbt model's own YAML entry, entities and dimensions are tagged on its columns, and every old "measure" became a simple metric. dbt's tutorial, sample project, open-source dbt 1.12 and its Wizard agent all write the new form. Most guides online still show the old one, and three moves translate them (path 1). Underneath the syntax is the classic modelling question: declare the grain, give each table one primary entity, and keep tables normalized so MetricFlow can join them. For you, that means users and events as separate models joined on `user`, with funnels as conversion metrics.

Serving is where definitions quietly multiply. Outside agents reach dbt metrics four ways: the API, dbt's MCP server, MetricFlow run locally, or a copy synced into another tool (path 2). On the first three, dbt stays the only definition, so a merged change reaches Claude, ChatGPT or Snowflake's agents on the next question. Synced copies in Hex, Omni, Lightdash and Snowflake semantic views each update on their own trigger and drop what they cannot express. Conversion and cumulative metrics, your funnels and to-date numbers, go first. Metrics built from other metrics also fail in the Ossie converters that move definitions between layers (path 3).

Deciding what agents see is a curation job with no single owner (paths 2 and 3). A host admin enables the connector, whoever configures it picks the tools, and the user's own permissions bound the results. dbt's `agent_accessible` tag narrows a list, but dbt does not describe it as a lock. Across platforms, curation follows two models. Some write an explicit list into code (dbt, Cube, Looker, Omni). Databricks ranks everything, with certification as the strongest vote. Sources disagree on who curates: the data scientist, the analytics engineer, or the business. They agree on named owners and a small certified core; one guide says 10-20 metrics. Nobody reports how long that took.

So what: learn the new YAML on free dbt 1.12 and model users and events cleanly. Before trusting any agent's funnel number, ask which route it took. The scarce skill is the one you bring: settling what a metric means, and whether heavy use makes it right. Now that settlement ships as reviewed code that decides what agents see.

## The map

**Breadth** ([0-breadth.md](0-breadth.md))
- [Semantic Layer architecture](https://docs.getdbt.com/docs/use-dbt-semantic-layer/sl-architecture) - open engine, paid serving
- [MetricFlow 0.212-0.213](https://github.com/dbt-labs/metricflow/releases) - new warehouses, Ossie datatypes
- [Summit: the layer as AI infrastructure](https://multishoring.com/blog/semantic-layer-ai-infrastructure/) - seven prerequisites
- [Migrate to the latest YAML spec](https://docs.getdbt.com/docs/build/latest-metrics-spec) - measures become simple metrics
- [Creating metrics](https://docs.getdbt.com/docs/build/metrics-overview) - the five metric types
- [Ossie semantic documents](https://docs.getdbt.com/docs/build/ossie-semantic-models) - importing the cross-vendor spec
- [Available integrations](https://docs.getdbt.com/docs/platform-integrations/avail-sl-integrations) - connectors and APIs
- [Saved queries and exports](https://docs.getdbt.com/docs/use-dbt-semantic-layer/exports) - metrics as warehouse tables
- [Caching](https://docs.getdbt.com/docs/use-dbt-semantic-layer/sl-cache) - result and declarative
- [MCP Semantic Layer tools](https://docs.getdbt.com/docs/dbt-ai/mcp-available-tools) - seven tools, `meta_filter`
- [Cortex agents with dbt MCP](https://docs.getdbt.com/docs/dbt-ai/integrate-mcp-snowflake-cortex) - Snowflake's agent on dbt metrics
- [building-dbt-semantic-layer skill](https://github.com/dbt-labs/dbt-agent-skills/tree/main/skills/dbt/skills/building-dbt-semantic-layer) - an agent's build checklist
- [Databricks metric views](https://colrows.com/blogs/databricks-metric-views/) - the platform-built alternative
- [Context engineering playbook](https://roundup.getdbt.com/p/the-context-engineering-playbook) - the layer for must-be-exact metrics
- [The scarce resource is consensus](https://roundup.getdbt.com/p/the-scarce-resource-is-consensus) - Ramp's canonical metrics

**Path 1 - writing metrics in the new spec** ([file](path-1-writing-metrics-in-the-new-spec.md))
- [dbt Core v1.12](https://github.com/dbt-labs/dbt-core/releases/tag/v1.12.0) - new spec in free dbt
- [Semantic Layer quickstart](https://docs.getdbt.com/guides/sl-snowflake-qs) - first worked example
- [jaffle-shop `orders.yml`](https://github.com/dbt-labs/jaffle-shop/blob/main/models/marts/orders.yml) - a whole project, new form
- [How we build our metrics](https://docs.getdbt.com/best-practices/how-we-build-our-metrics/semantic-layer-1-intro) - good advice, old syntax
- [Wizard builds Semantic Layer definitions](https://docs.getdbt.com/best-practices/how-to-use-wizard/wizard-7-semantic-layer) - the agent's checklist
- [Lightdash PR #25313](https://github.com/lightdash/lightdash/pull/25313) - tools lag the new keys
- [dbt-agent-skills PR #138](https://github.com/dbt-labs/dbt-agent-skills/pull/138) - common translation slips
- [Measures reference](https://docs.getdbt.com/docs/build/measures) - the old dictionary
- [Fill nulls and timespine](https://docs.getdbt.com/docs/build/fill-nulls-advanced) - keys that moved
- [Marts structure guide](https://docs.getdbt.com/best-practices/how-we-structure/4-marts) - normalize for the layer
- [Entities](https://docs.getdbt.com/docs/build/entities) - four kinds of join key
- [Join logic](https://docs.getdbt.com/docs/build/join-logic) - no fan-out, two hops
- [Databricks metric-view joins](https://docs.databricks.com/aws/en/uc-semantics/metric-views/joins) - one-to-many allowed
- [Kimball star schema](https://datadef.io/guides/en/dimensional-modeling) - grain first

**Path 2 - other companies' agents on dbt metrics** ([file](path-2-other-agents-on-dbt-metrics.md))
- [dbt Summit announcements](https://www.getdbt.com/blog/dbt-summit-2026-product-announcements) - Claude and ChatGPT via MCP
- [MCP server for dbt (Atlan)](https://atlan.com/know/mcp/mcp-server-for-dbt/) - stops at dbt's boundary
- [Hex Semantic Model Sync](https://learn.hex.tech/docs/connect-to-data/semantic-models/semantic-model-sync/dbt-metricflow) - a synced copy
- [Best BI tools for dbt teams (Omni)](https://omni.co/articles/best-bi-tools-for-dbt-teams-governed-semantic-layer-ai-queries-and-embedded-analytics-2026) - drift within a quarter
- [nao PR #1687](https://github.com/getnao/nao/pull/1687) - MetricFlow run locally
- [Hex Context Toolkit v2](https://github.com/hex-inc/action-context-toolkit/releases) - sync on merge, prune
- [omni-to-dbt-metricflow](https://github.com/exploreomni/omni-agent-skills/pull/105) - write-back by pull request
- [Lightdash write-back](https://github.com/lightdash/lightdash/pull/28825) - renames break charts
- [dbt_semantic_view commits](https://github.com/Snowflake-Labs/dbt_semantic_view/commits/main) - a passthrough, not a converter
- [dbt SL vs Snowflake semantic views](https://www.paradime.io/blog/dbt-semantic-layer-vs-snowflake-semantic-views-a-complete-technical-comparison) - two places
- [Remote MCP setup](https://docs.getdbt.com/docs/dbt-ai/setup-remote-mcp) - toolset switches
- [OAuth scopes and consent](https://docs.getdbt.com/docs/platform/manage-access/connect-apps-oauth) - whose permissions
- [dbt-mcp changelog](https://github.com/dbt-labs/dbt-mcp/blob/main/CHANGELOG.md) - `meta_filter` is not a lock
- [Claude connectors](https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities) - the host admin's controls
- [dbt MCP safe access (TrueFoundry)](https://www.truefoundry.com/blog/dbt-mcp-server) - service vs personal tokens

**Path 3 - who curates the metrics** ([file](path-3-who-curates-the-metrics.md))
- [Post-AI data stack (Macomber)](https://www.iandmacomber.com/blog/post-ai-data-stack/) - data scientists define the truth
- [Analytics engineer to context engineer](https://www.getdbt.com/blog/from-analytics-engineer-to-context-engineer) - dbt's answer
- [The missing role (CIO)](https://www.cio.com/article/4204033/the-missing-role-in-every-enterprise-ai-strategy-the-analytics-engineer.html) - analytics engineers own it
- [Operationalizing Genie Ontology](https://www.databricks.com/blog/operationalizing-genie-ontology-your-data-stack) - rank, certify, start with one domain
- [Semantic layer rollout (Omni)](https://omni.co/articles/best-semantic-layer-for-ai-and-bi-2026) - 10-20 metrics, pilot
- [Summit sessions by role](https://www.getdbt.com/blog/dbt-summit-2026-sessions-by-role) - six rollouts, abstracts only
- [Ossie Sigma converter](https://github.com/apache/ossie/tree/main/converters/sigma) - one definition, many copies
- [Digital Turbine semantic layer](https://www.digitalturbine.com/blog/building-the-dt-semantic-layer-creating-a-single-source-of-truth-with-agent-driven-data-modeling) - agent drafts, checks approve
- [Ossie converter feedback](https://github.com/apache/ossie/discussions/325) - metrics of metrics fail
- [Certify or deprecate (Databricks)](https://docs.databricks.com/aws/en/data-governance/unity-catalog/certify-deprecate-data) - certification ranks higher
- [Genie Ontology (Atlan)](https://atlan.com/know/ai-agent/databricks/genie-ontology/) - popular isn't correct
- [Looker conversational analytics](https://docs.cloud.google.com/looker/docs/conversational-analytics-looker-best-practices) - trim fields for agents
- [Cube multi-agent](https://docs.cube.dev/admin/ai/multi-agent) - allow-lists as code
- [Optimize for Omni AI](https://docs.omni.co/modeling/develop/ai-optimization) - curation levers ranked

## How it fits together

- **Paths 2 and 3 converged on one finding from opposite sides.** Path 2 read dbt's access controls and path 3 read curation practice. Both concluded that `meta_filter` narrows what an agent lists but is not access control. Cube says the same of its own allow-lists.
- **Every route between layers drops the same metrics.** Composite metrics (conversion, cumulative, metrics built from other metrics) are what BI syncs (path 2), Ossie converters (path 3) and dbt's own Ossie import (breadth) leave behind.
- **This goes one level below** #35 (the layer's benchmark), #42 (Ossie, Snowflake semantic views) and the 2026-09-24 data-engineering exploration (dbt's agents and skills), and it leaves #35's open question unanswered: nobody reports what curation took.

**Two leads not followed that you might have picked:** how dbt's own agents choose the metric route over `text_to_sql` (breadth L4a), and conversion and cumulative metrics compared with how experimentation tools define funnels (L2b).

## Candidate topics

Proposals only. None of these is in the profile.

- `semantic-model-authoring` · Depth, under `semantic-models`: writing semantic models in dbt's new YAML spec - grain, entities, join rules, and reading older tutorials in translation. *From path 1.*
- `agent-metric-routes` · Depth, under `dbt-context`: how outside agents reach governed metrics (API, MCP, local MetricFlow, synced copies) and who controls what they see. *From path 2.*
- `metric-curation` · Depth, under `semantic-models`: who owns metric definitions, and how platforms decide which metrics an agent sees - explicit lists against certification and ranking. *From path 3.*
