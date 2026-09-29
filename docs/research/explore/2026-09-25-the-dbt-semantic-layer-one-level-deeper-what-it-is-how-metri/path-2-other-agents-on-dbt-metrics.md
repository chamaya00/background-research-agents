# Path 2 - Other companies' agents on dbt metrics

This path starts from breadth lead L4b, under angle 4, "How agents use it". It reads how agents built by other companies reach metrics defined in dbt: Claude and ChatGPT, Snowflake's agents, Hex, Omni, and nao, plus Atlan as an outside critic. For each, it asks one question: does the agent ask dbt for the number, or does it work from its own copy of the definitions? The answer decides where a metric's owner has to look after a change.

## Level 1 - Four routes in: API, MCP, a synced copy, or MetricFlow run locally

The breadth pass named three routes. Reading the docs turned up a fourth.

- **The Semantic Layer API.** The tool asks dbt's hosted service at query time. Dot and Push.ai work this way, over GraphQL (a web query API), with a dbt service token. Their docs pages carry no dates, so they are not counted as items here.
- **The dbt MCP server.** An agent calls dbt's tools by name. MCP (Model Context Protocol) is the standard way an AI tool calls another system.
- **A synced copy.** The tool imports the definitions and writes its own SQL.
- **MetricFlow run locally.** The agent runs dbt's open-source engine itself.

**Background:** dbt's February post for Snowflake users set out three routes: the MCP server, publishing dbt metrics as Snowflake semantic views through the `dbt_semantic_view` package, or generating the views with Snowflake's Autopilot tool ([Bring structured context to Snowflake Intelligence with dbt](https://www.getdbt.com/blog/bring-structured-context-to-snowflake-intelligence-with-dbt), 2026-02-11, read in full). The post warns that the Autopilot route can let definitions drift. (Level 2a below found the package is a passthrough: you write Snowflake's syntax in dbt, and it does not convert MetricFlow definitions.) Snowflake Intelligence is now called CoWork. Its MCP connectors, which let it call outside tools, sign each user in separately ([MCP Connectors](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-agents-mcp-connectors), undated, read in full).

### Everything we announced at dbt Summit and why it matters
[link](https://www.getdbt.com/blog/dbt-summit-2026-product-announcements) · 2026-09-16 · vendor blog · read in full · listed source
1. **What it is about:** dbt Labs' Summit round-up. It lists "out-of-the-box integrations with Anthropic" and "a plugin in ChatGPT", both generally available. Both run on the dbt MCP server, which "exposes your models, metrics, lineage, and test results to any AI agent".
2. **Why you're seeing it:** This is the MCP route, and it is the one dbt promotes (`dbt-context`, `warehouse-agentic`).
3. **Seen before?** Yes. #35 noted the same GA and dropped it as covered ground. The 2026-09-24 exploration read the July Claude post.
4. **Relates to:** The [Claude setup page](https://docs.getdbt.com/docs/dbt-ai/integrate-mcp-claude) (updated 2026-07-30). Sign-in ends on a consent screen that lists "the specific permissions the client is allowed to use".
5. **Takeaways for you:** On this route Claude never holds a copy of your metrics. It asks `query_metrics`, so a change you merge in dbt reaches it on the next question.

### MCP Server for dbt: How It Works & What's Missing in 2026
[link](https://atlan.com/know/mcp/mcp-server-for-dbt/) · published 2026-05-12, updated 2026-09-18 · vendor explainer (Atlan) · read in full · search
1. **What it is about:** Atlan sells a data catalog, a searchable inventory of a company's data. Its explainer walks through the dbt MCP server's metric tools, then argues that dbt's context "stops at dbt's boundary". In its words, lineage and business metadata "don't flow losslessly across tools".
2. **Why you're seeing it:** It is the outside critique of the MCP route (`dbt-context`, `semantic-models`).
3. **Seen before?** No. Atlan has not appeared in earlier briefs.
4. **Relates to:** The Summit post above. Atlan says the MCP server covers only what dbt knows about.
5. **Takeaways for you:** Read it as a pitch for Atlan's own product. The point still stands: a metric defined in a BI tool is invisible to an agent that asks dbt.

### Semantic Model Sync from dbt MetricFlow (Hex)
[link](https://learn.hex.tech/docs/connect-to-data/semantic-models/semantic-model-sync/dbt-metricflow) · docs undated; changelog [2026-08-18](https://learn.hex.tech/changelog/2026-08-18) and [2026-09-15](https://learn.hex.tech/changelog/2026-09-15) · vendor docs and changelog · read in full · listed source
1. **What it is about:** Hex is a notebook and BI tool with its own agent. It imports MetricFlow files from GitHub through a GitHub Action, a script that runs on each merge. It then turns them into Hex's own semantic objects. Conversion metrics and slowly changing (SCD Type II) dimensions are not supported.
2. **Why you're seeing it:** This is the synced-copy route (`semantic-models`, `warehouse-agentic`).
3. **Seen before?** Partly. The 2026-09-24 exploration covered Hex's Evals. The breadth pass dropped the 2025 launch post as too old.
4. **Relates to:** September's changelog, which says eval suites let you "compare results as your guides or semantic models evolve".
5. **Takeaways for you:** The copy updates when you merge. A conversion metric, your funnel metric, does not reach Hex's agent at all.

### Best BI Tools for dbt Teams (2026)
[link](https://omni.co/articles/best-bi-tools-for-dbt-teams-governed-semantic-layer-ai-queries-and-embedded-analytics-2026) · 2026-09-03 · vendor article (Omni) · read in full · search
1. **What it is about:** Omni, a BI tool, reviews how other BI tools consume dbt. Most offer "one-way metadata sync", it says. Teams "end up with definitions that drift between dbt and BI within a quarter." Omni says its own AI answers from the combined dbt-plus-Omni model and can push metrics back into dbt.
2. **Why you're seeing it:** It names the main cost of the synced-copy route (`semantic-models`).
3. **Seen before?** No. Omni appeared only as a name in the integrations list.
4. **Relates to:** Omni's [own dbt docs](https://docs.omni.co/integrations/dbt/semantic-layer) (undated). They describe a manual "Refresh now" and no cumulative or conversion metrics.
5. **Takeaways for you:** This is a vendor judging its rivals. The drift it describes is the familiar fight over two dashboards showing two numbers, now between two tools.

### Semantic layer support with dbt MetricFlow (nao pull request #1687)
[link](https://github.com/getnao/nao/pull/1687) · opened 2026-09-16, merged 2026-09-17 · open-source repository · read in full · search
1. **What it is about:** nao is Claire Gouze's open-source analytics agent. It now runs MetricFlow "strictly as a SQL compiler", with no dbt Cloud call and "no Semantic Layer plan to buy". It reads `semantic_manifest.json`, a file every dbt build writes. Its [docs](https://docs.getnao.io/nao-agent/context-builder/semantic-layer) add that the agent sees results, never the compiled SQL.
2. **Why you're seeing it:** This is a fourth route, which the breadth lead did not name (`semantic-models`, `agent-efficacy`).
3. **Seen before?** Yes. Gouze is in breadth angle 5, and her [February tests](https://getnao.io/blog/semantic-layer-impact-analytics-agent/) (background) found metric-only agents could not answer questions outside the layer.
4. **Relates to:** The 2026-09-24 finding that Snowflake's agent reads its semantic view without being bound by it. nao's agent cannot rewrite the SQL, so it is bound.
5. **Takeaways for you:** The open-source engine is enough to put governed metrics in front of an agent.

**Leads:**
- **L-1a** - The synced-copy route in detail. Read Hex's Semantic Model Sync docs and its GitHub Action, Omni's dbt sync and push-back docs, Lightdash's metrics-in-YAML docs, Push.ai's rename behaviour, and Snowflake Labs' `dbt_semantic_view` package. Establish what triggers each sync, which metric types each drops, what happens when a metric is renamed, and whether edits can flow back into dbt.
- **L-1b** - Controlling what outside agents can reach through the dbt MCP server. Read dbt's OAuth scopes-and-consent docs, the MCP environment-variable reference with its tool-access controls, the `meta_filter` tagging and `text_to_sql` switch, the `dbt-mcp` repository, and Snowflake CoWork's MCP connector administration. Establish who decides which metrics and tools an outside agent sees, and whose permissions its queries run under.

**So what:** The route an outside agent takes decides where your metric definitions actually live. On the API and MCP routes dbt stays the single source, so a merged change reaches Claude, ChatGPT or Snowflake's agent on the next question; on the synced-copy route, Hex and Omni each hold a copy that updates only when a sync runs and silently drops what it cannot express, conversion metrics among them. Before you trust an agent's funnel number, find out which route it took.

**Looked for and not found:** The ChatGPT plugin's own page on `openai.com` refused access, and dbt has no ChatGPT setup page (the likely URL returned 404). So no in-window account says how that plugin is set up or controlled beyond dbt's single line about it. No in-window source says how Power BI Copilot, Tableau's agents or Sigma's AI use dbt metrics. Their connectors are documented only as BI query routes, not agent routes. The Dot, Push.ai and Sigma integration pages carry no dates.

## Level 2a - The synced-copy route in detail

### Hex Context Toolkit v2: semantic models sync on merge, and old ones are pruned
[link](https://github.com/hex-inc/action-context-toolkit/releases) · v2.0.0 2026-07-28, latest v2.1.2 2026-09-10 · open-source repository and vendor docs · read in full · listed source
1. **What it is about:** Hex's GitHub Action is a script GitHub runs when the repository changes. It now syncs semantic projects (dbt MetricFlow, Cube or Snowflake semantic views) as well as written guides. Version 2 made "publishing and pruning" automatic. A merge to a dev branch only tests the files; a merge to main imports them. Hex's [sync docs](https://learn.hex.tech/docs/connect-to-data/semantic-models/semantic-model-sync/intro) (undated) call the older Action deprecated.
2. **Why you're seeing it:** It answers what triggers Hex's sync (`semantic-models`, `warehouse-agentic`).
3. **Seen before?** Level 1 read Hex's MetricFlow page, which lists what Hex drops. The new Action and its trigger rules are new here.
4. **Relates to:** Hex's Evals, from the 2026-09-24 exploration. Version 2.1.0 (August 25) runs evals as part of publishing.
5. **Takeaways for you:** Hex's copy follows your main branch, not a schedule. Pruning suggests a renamed metric's old name disappears from Hex; that is an inference.

### omni-to-dbt-metricflow: an agent skill that moves Omni metrics into dbt
[link](https://github.com/exploreomni/omni-agent-skills/pull/105) · opened 2026-09-12, merged 2026-09-18 · open-source agent instructions (Omni) · read in full · listed source
1. **What it is about:** Written steps for a coding agent. It converts Omni fields into MetricFlow YAML, checks for clashing names, and validates with `dbt parse`. Then it deletes the Omni version so dbt's definition shows through. Until then Omni's own layer wins: "Extension keys win. dbt-only keys fill in."
2. **Why you're seeing it:** This is the edits-flow-back question for Omni (`semantic-models`, `dbt-context`).
3. **Seen before?** Level 1's Omni article claimed metrics can be pushed back. Omni's [semantic-layer docs](https://docs.omni.co/integrations/dbt/semantic-layer) call the import "one-way". This skill is how the gap gets bridged.
4. **Relates to:** Omni's [sync triggers](https://docs.omni.co/integrations/dbt/syncing-dbt) (undated): a manual "Sync now", a scheduled schema refresh, or an API call after `dbt run`.
5. **Takeaways for you:** Pushing back means an agent drafts a pull request for review. It is not a live sync. Cumulative and conversion metrics cannot make the trip in either direction.

### Lightdash writes ad hoc metrics back as pull requests
[link](https://github.com/lightdash/lightdash/pull/28825) · merged 2026-09-09 · open-source repository · read in full · listed source
1. **What it is about:** Lightdash is an open-source BI tool. Its metrics live in the dbt project's own YAML, under a `meta` block, rather than in MetricFlow. A metric someone builds ad hoc in Lightdash can be [written back](https://docs.lightdash.com/references/dbt-write-back) as a pull request. This change extends that to projects written in Lightdash's own YAML, without dbt.
2. **Why you're seeing it:** Lightdash avoids keeping a separate copy (`semantic-models`).
3. **Seen before?** No. Lightdash has not appeared in an earlier brief.
4. **Relates to:** Its [validator](https://docs.lightdash.com/references/validating-your-content) (undated) flags charts that still use a renamed metric. **Background:** Push.ai's [docs](https://docs.push.ai/data-sources/semantic-layers/dbt) (undated) treat a rename as a new metric and delete the old one.
5. **Takeaways for you:** A rename breaks saved charts in every tool; what varies is whether the tool warns you. A September 22 [issue](https://github.com/lightdash/lightdash/issues/29756) proposes flagging cases where "Four charts all labelled Total Revenue disagree."

### dbt_semantic_view adds materializations and unit tests
[link](https://github.com/Snowflake-Labs/dbt_semantic_view/commits/main) · commits 2026-07-10 to 2026-09-14 · open-source repository (Snowflake Labs) · read in full · listed source
1. **What it is about:** A dbt package that lets a dbt model create a Snowflake semantic view, Snowflake's own metric definitions, which its Cortex agents read. July added pre-computed copies of a view's results and `CREATE OR ALTER`, which updates a view in place. September's [PR #32](https://github.com/Snowflake-Labs/dbt_semantic_view/pull/32) lets dbt unit tests cover models that query a view.
2. **Why you're seeing it:** It is the warehouse-side copy (`warehouse-agentic`, `semantic-models`).
3. **Seen before?** Level 1 described the package as publishing dbt metrics. The README says it is "a direct passthrough": you write Snowflake's syntax, not MetricFlow's.
4. **Relates to:** dbt's February post, which says Snowflake's Autopilot tool generates views from dbt definitions. Snowflake's [Autopilot docs](https://docs.snowflake.com/en/user-guide/views-semantic/autopilot) (undated) list Tableau, Power BI, SQL and YAML inputs, but not dbt.
5. **Takeaways for you:** You get one repository and one deploy. You still have two definitions of each metric, and nothing but you keeps them equal.

### dbt Semantic Layer vs. Snowflake Semantic Views
[link](https://www.paradime.io/blog/dbt-semantic-layer-vs-snowflake-semantic-views-a-complete-technical-comparison) · 2026-09-16 · vendor blog (Paradime) · read in full · search
1. **What it is about:** Paradime sells a development environment for dbt, and here it compares the two layers. It says a hybrid setup means "metric definitions live in two places". Its fix is the package route: views written as ".sql files in your dbt project" and deployed with `dbt run`.
2. **Why you're seeing it:** It names the cost of keeping two copies (`semantic-models`, `warehouse-agentic`).
3. **Seen before?** #42 item 2 covered semantic views. This is the first head-to-head with dbt's layer.
4. **Relates to:** The package above, and the Omni article in Level 1, which says definitions "drift between dbt and BI within a quarter".
5. **Takeaways for you:** One repository makes drift less likely, not impossible. None of this level's sources describes a tool that turns MetricFlow into semantic views automatically.

**Leads:**
- **L-2a-i** - Write-back: turning a metric built in a BI tool into a reviewed dbt definition. Read Omni's `omni-to-dbt-metricflow` SKILL.md, FIELD-MAPPING.md and FALLBACK-TO-DBT.md, Lightdash's dbt write-back docs and pull requests #28825 and #28831 (write-back from its AI features), and Hex's `hex context semantic-project pull` docs. Establish who reviews the pull request, which aggregations survive the trip, and which layer wins once it merges.
- **L-2a-ii** - What a metric rename or deletion breaks downstream of dbt. Read Lightdash's validator and `lightdash rename` docs, Push.ai's delete-and-recreate rule, Hex Context Toolkit v2's automatic pruning, Omni's content validator, and dbt's own guidance on deprecating or renaming metrics. Establish what happens to saved charts, agent eval suites and agent answers when a metric's name changes.

**So what:** Every synced copy has its own update rule - Hex on a merge to main, Omni on a manual or scheduled refresh, Push.ai on a reconnect, Snowflake's views on your `dbt run` - so one metric can briefly exist in several versions. Edits now flow back into dbt, but only as pull requests a person reviews. The practical risks for you are renames and funnel metrics: Omni carries neither conversion nor cumulative metrics, and Hex drops conversion.

## Level 2b - Deciding what an outside agent can reach

Two parties decide what an outside agent reaches. On dbt's side, whoever writes the connection sets which tools exist, and the sign-in sets whose permissions apply. On the host's side (Claude, ChatGPT, Snowflake CoWork - the product the agent runs in), an admin decides whether the connector is allowed at all. **Background:** Snowflake's connector page, read in Level 1, has admins create the connector and each user sign in, with no per-tool filter. Snowflake's 2026-07-22 release note, "External OAuth and configurable scopes for MCP servers", covers the reverse direction: outside agents calling Snowflake's own MCP servers under the user's Snowflake role ([Snowflake-managed MCP server](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-agents-mcp), undated, read in full).

### Set up remote MCP, and the MCP environment-variable reference
[link](https://docs.getdbt.com/docs/dbt-ai/setup-remote-mcp) · last updated 2026-09-08, both pages · vendor doc · read in full · listed source
1. **What it is about:** How to connect an agent to dbt's hosted MCP server, and the switches that shape what it sees. Whoever writes the connection settings can turn off whole toolsets (`semantic_layer`, `sql`, `discovery`) or single tools such as `text_to_sql`, with a header or an [environment variable](https://docs.getdbt.com/docs/dbt-ai/mcp-environment-variables). An allowlist mode switches on only the tools it names.
2. **Why you're seeing it:** This is the main control panel for what an outside agent can call (`dbt-context`, `warehouse-agentic`).
3. **Seen before?** The breadth pass listed the tools. The controls around them are new.
4. **Relates to:** SQL and code-generation tools start switched off. Turning off dbt's AI features hides only `text_to_sql`.
5. **Takeaways for you:** "Queries run under the authenticated user's permissions." With a token, that means the token's owner. Service tokens cannot run `execute_sql` at all.

### Connect apps with OAuth (scopes and consent)
[link](https://docs.getdbt.com/docs/platform/manage-access/connect-apps-oauth) · last updated 2026-08-04 · vendor doc (beta feature) · read in full · listed source
1. **What it is about:** OAuth is the "sign in with your account" flow: the agent gets a token on your behalf, never your password. On first connection, the user approves scopes, named slices of permission such as `projects:query` for metrics. They also pick all projects or only some.
2. **Why you're seeing it:** It answers whose permissions an agent acts with (`dbt-context`, `warehouse-agentic`).
3. **Seen before?** Level 1 quoted this consent screen from the Claude setup page. This is the page behind it.
4. **Relates to:** The other route is [service account tokens](https://docs.getdbt.com/docs/dbt-apis/service-tokens) (updated 2026-07-31), which "belong to an account rather than a user" and can be limited to "Semantic Layer Only".
5. **Takeaways for you:** Scopes "don't grant any new access"; they only narrow what the user already has. The audit log records the agent's actions under the user's name. Admins cannot yet revoke a connection; that is "coming soon".

### dbt-mcp changelog, v1.22.0 to v2.4.0
[link](https://github.com/dbt-labs/dbt-mcp/blob/main/CHANGELOG.md) · 2026-07-14 to 2026-09-22 · open-source release notes · read in full · listed source
1. **What it is about:** Eleven releases in the window. The one that matters for access is v1.22.0 on 14 July. It gave `list_metrics` a `meta_filter`, which shows only metrics carrying a tag such as `agent_accessible: true`. The rest are mostly fixes.
2. **Why you're seeing it:** What dbt is actually changing in these controls (`dbt-context`).
3. **Seen before?** The breadth pass noted `meta_filter`. The rest of the log is new.
4. **Relates to:** [Pull request #892](https://github.com/dbt-labs/dbt-mcp/pull/892), merged 23 September, stopped multi-project OAuth users being sent back to sign in on every restart. [Issue #687](https://github.com/dbt-labs/dbt-mcp/issues/687), open since April (background), asks for sign-in through the company's login system instead of a dbt account.
5. **Takeaways for you:** dbt's release note describes `meta_filter` as keeping results "small". It is a parameter the agent passes, not a lock an admin sets. That reading is an inference.

### Use connectors to extend Claude's capabilities
[link](https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities) · updated 2026-08-20 · vendor help doc (Anthropic) · read in full · search
1. **What it is about:** The host's side. On Claude Team and Enterprise, an Owner must enable a connector before anyone can use it, and can set each action to "Always allow, Needs approval, or Blocked". Each person still signs in, so "Claude inherits each person's permissions from the connected service."
2. **Why you're seeing it:** dbt has been a Claude connector since Summit, so these are the controls a Claude admin holds over it (`warehouse-agentic`, `dbt-context`).
3. **Seen before?** Level 1 covered dbt's Claude setup page. The host's admin controls are new.
4. **Relates to:** [Enterprise-managed auth](https://support.claude.com/en/articles/15537633-authorize-mcp-connectors-for-your-entire-organization), generally available 2026-08-24, grants connectors by role through an identity provider such as Okta. dbt is not among its ten launch connectors.
5. **Takeaways for you:** Two admins decide, one on each side. Claude's owner decides which dbt tools may be called. dbt's permissions decide what each call returns.

### dbt MCP Server: Tools, Setup, and Safe Access
[link](https://www.truefoundry.com/blog/dbt-mcp-server) · 2026-09-17 · vendor blog (TrueFoundry) · read in full · search
1. **What it is about:** TrueFoundry sells an MCP gateway, a proxy between agents and many MCP servers. It argues that dbt access should be designed, not left open. It recommends service tokens for shared read-only metadata, and personal tokens only where `execute_sql` is needed.
2. **Why you're seeing it:** An outside view of who should control the agent (`warehouse-agentic`, `agent-efficacy`).
3. **Seen before?** No. TrueFoundry has not appeared before.
4. **Relates to:** dbt's own switches in the first article. A gateway is also a workaround for the company sign-in that issue #687 asks for.
5. **Takeaways for you:** Its rule of thumb is to "turn execute_sql off unless a specific agent needs it." Read it as a pitch for a gateway.

**Leads:**
- **L-2b-i** - Agents that run with nobody signed in. Look at scheduled and unattended agents on dbt metrics: Snowflake CoWork Automations (preview since 2026-08-06), Cortex Agents called from pipelines, and gateway-hosted agents such as TrueFoundry's. Read dbt's service-token permission sets ("Semantic Layer Only"), the token-header setup, and the host docs. Establish whose identity a scheduled metric query uses, what the audit log shows, and how that differs from a person asking in chat.
- **L-2b-ii** - The company login system in front of MCP. Read Claude's Enterprise-managed auth, Snowflake's 2026-07-22 external OAuth and role-scope release note, `dbt-mcp` issue #687 on OIDC (the standard behind "sign in with Okta"), and whether dbt plans to join Claude's managed-auth list. Establish how an Okta group or Snowflake role could map to what a dbt agent sees.

**So what:** No single place decides what an agent sees from dbt. The host's admin enables the connector and may block actions, whoever sets up the connection picks the toolsets, and the signed-in person's dbt permissions - or a service token's shared identity - limit what comes back. Tagging a metric `agent_accessible` narrows the agent's list, but nothing in dbt's description of it says it is enforced.

## Where this path ends

Outside agents reach dbt metrics four ways, and the route decides where a metric really lives. On the API, MCP and local-MetricFlow routes, dbt stays the only definition, so a change you merge reaches Claude, ChatGPT, Snowflake's agents or nao on the next question. On the synced-copy route - Hex, Omni, Lightdash, and Snowflake semantic views deployed through `dbt_semantic_view` - each tool keeps its own copy with its own update trigger. Each drops the metric types it cannot express, and conversion and cumulative metrics, the funnel and to-date ones, go first. Each handles renames differently. Edits now flow back into dbt, but only as pull requests a person reviews. Control over what an agent sees is split three ways: the host's admin enables the connector, whoever configures the connection picks toolsets, and the signed-in user's dbt permissions bound the results. `meta_filter` narrows a list but is not described as a lock. For someone about to own metrics, the working question for any agent is which route it takes and which of those settings you hold.
