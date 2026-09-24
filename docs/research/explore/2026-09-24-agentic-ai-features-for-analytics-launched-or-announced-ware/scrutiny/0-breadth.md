# Auto breadth - agentic AI features for analytics - breadth pass - 2026-09-24

**Produced by a research subagent in auto-breadth mode**, as step 1 of
[`docs/reader/auto-breadth.md`](../../../reader/auto-breadth.md). It is not a
brief on an adopted topic, and nothing in it is a profile change.

**The decision this serves:** which angles on agentic analytics features -
warehouses, BI tools, semantic layers, notebooks, and the evidence behind them -
are worth following deeper, for a reader tracking analytics for enterprise AI.

**Window:** 90 days, so items are dated on or after **2026-06-26**. Anything
older appears only as a marked **Background** note and is not counted.

---

## Headline

**Across all five layers of the stack, the quarter's launches claimed quality
and did not measure it. What shipped in place of a number was a way for the
customer to measure it themselves.**

- **No launch came with a number.** Nine vendor pages were read in full for
  this pass - Snowflake, Google (twice), Looker, Databricks, Hex, Cube, Sigma
  and Deepnote - plus TechTarget's two reports on Tableau. None publishes an
  accuracy figure for what it launched. Snowflake's note telling customers to move to Cortex Agents
  says it has "higher answer quality" and gives no figure (item 1). Google's
  general-availability post says "Accuracy in Conversational Analytics is by
  design, not aspirational", and its only evidence is one customer's time
  saving.
- **Evaluation tools went to customers instead.** Snowflake made its agent
  evaluations target specific agent versions (2026-08-21). Hex shipped Evals
  (2026-08-04), then versioned eval suites you can publish (2026-09-15). Cube
  says it "recently released Cube Evals". Sigma says evals are "coming later in
  2026". The work of proving an agent works has moved from the vendor to the
  buyer (item 4).
- **The semantic layer is moving down into the warehouse.** Looker can now
  compile its own semantic model into a Snowflake semantic view or a BigQuery
  Graph (item 3). That is the reverse of the Snowflake Power BI import #42
  reported. Either way, the semantic definition is settling in the warehouse,
  under the agent the warehouse vendor now recommends (item 1).
- **The one in-window evaluation with a real design finds the problem that
  grading final answers hides.** Thumbtack's analytics team ran 50 questions
  three times each under two model setups. The stronger setup answered far more
  questions. It also changed which table it used between runs on **41 of 50**
  questions (item 5). Hex's eval tool counts a two-attempt case as a pass if
  one attempt passes (item 4). That is exactly the kind of rule under which such
  instability would not show up.

---

## Background: where each product sits in a stack

This is **Background**, not an item. It is here because the seed asks where
each product sits, and the reader is new to vendor stacks outside Meta.

A typical company's analytics stack has five layers, from the bottom up:

| Layer | What it does | Products named in this pass |
|---|---|---|
| **Storage / warehouse** (or "lakehouse") | Holds the tables and runs the SQL. | Snowflake, Databricks, Google BigQuery, Amazon Redshift, Microsoft Fabric (OneLake) |
| **Transformation** | Turns raw tables into cleaned, modelled ones, as versioned code. | dbt (now merged with Fivetran, per #26 and #42) |
| **Semantic layer** | Defines business terms once - "revenue", "active customer" - as metrics, dimensions and joins, so every tool computes them the same way. | Snowflake **semantic views**, Databricks **metric views**, **LookML** (Looker's modelling language), the dbt Semantic Layer, Cube, AtScale, Power BI semantic models, Tableau's semantics. Apache Ossie (#42 item 1) is a spec for exchanging these definitions between tools. |
| **BI / consumption** | Dashboards, reports, and now chat, for business users. | Tableau and Tableau Next (Salesforce), Power BI (Microsoft), Looker (Google), ThoughtSpot, Sigma, Omni |
| **Notebooks** | Mixed code, SQL and prose documents for analysts and data scientists. | Hex, Deepnote, Databricks notebooks, Snowflake Notebooks, Google Colab, Jupyter |

**Where the agents sit.** Almost every analytics agent in this pass sits on
top of a semantic layer, and each one reads a different layer:

- **Snowflake's Cortex Agents** read Snowflake semantic views (item 1).
- **Databricks' Genie** reads Unity Catalog metric views.
- **Google's Conversational Analytics** reads BigQuery directly, or Looker's
  LookML when Looker is present.
- **Tableau's agents** read Tableau's own semantics and its new "Knowledge"
  layer (item 2).
- **Hex's agent** reads Hex's semantic models.

So the competition in this market is less about which agent is smarter. It is
about **whose semantic layer the agent reads**. That is also why a feature that
moves semantic definitions from one layer to another (item 3) matters more than
it looks.

**Background, out of window, for the warehouse vendors:**

- **Databricks** launched **Genie One**, "an all-new agentic coworker", together
  with Genie Ontology and an expanded Agent Bricks, at its Data + AI Summit on
  **2026-06-16**. That is 100 days ago, 10 days outside the window.
- The accuracy figures already reported in #19 date from the June summits and
  are also out of window: Snowflake's Cortex Sense at 86%, and Databricks'
  52% → 84.5%. #19 found both were "vendor-run on undisclosed question sets".

---

## The items

### 1. Snowflake told customers to move from its text-to-SQL service to its agent, citing "higher answer quality", with no figure

**1. What it is.** Snowflake is a cloud **warehouse**, and it sells two
natural-language products that sit on top of its semantic views.

- **Cortex Analyst** is a text-to-SQL service: it turns a question into one SQL
  query against a semantic view.
- **Cortex Agents** is an orchestration layer. It plans across several steps,
  calls tools (Cortex Analyst among them), searches unstructured documents with
  Cortex Search, and keeps a conversation going across turns.

On **2026-08-28** Snowflake published a release note that puts one above the
other. Its first sentence, read verbatim:

> "Snowflake recommends transitioning to Cortex Agents, which supports every
> Cortex Analyst capability with higher answer quality."

The rest of the note makes the move look cheap:

- Semantic views stay as they are, and Cortex Agents uses the same ones for SQL
  generation.
- **Verified queries**, the curated question-and-SQL pairs stored inside a
  semantic view, keep working.
- The Cortex Analyst REST API stays available, and existing applications keep
  working.

What the note does **not** carry is any measurement behind "higher answer
quality": no benchmark, no task count, no figure.

Two other releases in the window fill in the picture:

- **2026-08-21:** "version targeting" for Cortex Agent and Cortex Analyst
  evaluations reached general availability. A customer can now pin an
  evaluation run to a specific agent version. That makes it possible, in
  principle, to check the quality claim on your own questions.
- **2026-08-26:** the Cortex Agents Coding Agent reached GA. An agent can now be
  given a sandbox managed by Snowflake, with bash, file editing, SQL execution
  and web search. The note describes this as "the same runtime that powers
  Snowflake CoCo" (CoCo is Cortex Code, Snowflake's coding agent, which #42
  referenced).

**Background (out of window).** A release note dated **2026-04-13** is titled
"Improved SQL generation in Cortex Agents". Per search summaries, that change
made Cortex Agents generate SQL directly rather than hand the step to the
Cortex Analyst service. That is the most likely technical basis for the
August quality claim. Its body returned only a navigation shell to this run.

**2. How long ago.** **2026-08-28**, 27 days ago. The supporting releases are
dated 2026-08-21 (34 days) and 2026-08-26 (29 days).

**3. How it relates to what has already been read.** Filed under
**`warehouse-agentic`**, which is on its first run and has a 90-day window.
#42 covered Snowflake's governance layer (the Cortex AI Gateway) and its
semantic-model import (Semantic View Autopilot, which feeds Cortex Analyst).
The earlier SQL AI functions exploration covered the per-row functions
underneath. **This is the first item about the product a business user
actually talks to, and it says that product is changing.** The text-to-SQL
service #42 described as "what Cortex Analyst queries against" is now one tool
inside an agent. It also serves **`agent-efficacy`**: it is a vendor quality
claim with no evidence attached, the same pattern #19 recorded for the June
summit figures. Both lines are on 90-day windows, so the filing admits nothing
the other would exclude.

**4. What through-line it changes.** It extends #42's through-line, "the
vendors are competing on control and cost attribution rather than on accuracy",
with one qualification. Snowflake did make an accuracy claim this quarter. It
made it in words rather than numbers, and at the same time it shipped the tool
a customer would need to check it. Google did the same on 2026-06-30 when it
made BigQuery Conversational Analytics generally available. Google's agent
reads BigQuery tables directly, or Looker's semantic layer where Looker is
present. Its post says "Accuracy in Conversational Analytics is by design, not
aspirational" and backs that with one customer's time saving: "saving our
financial analysts around half a day each week". **The warehouse vendors' new
default is to assert quality and hand over the evaluator.**

**5. What to research next.**
- **The evidence behind "higher answer quality" (Snowflake release note,
  2026-08-28).** Check the Cortex Agents user guide, the 2026-04-13 "Improved
  SQL generation in Cortex Agents" note, and Snowflake's engineering blog.
  Is there any published comparison of Cortex Agents against Cortex Analyst on
  the same semantic views? If so, record the task count, who wrote the
  questions, and whether verified queries were part of the prompt. If there is
  none, say so plainly.
- **Google's evidence for BigQuery Conversational Analytics (GA 2026-06-30) and
  the Conversational Analytics API (GA per Google's Q3 post of 2026-07-28).**
  Does Google publish any evaluation to back "accuracy ... by design", with a
  task count, a question source and a metric? Does the API or Looker's golden
  queries (GA 2026-08-28) come with an evaluation tool comparable to
  Snowflake's?

**6. Source.** From open search. `docs.snowflake.com` and `cloud.google.com`
are both on `sources.md`.
- [Snowflake release note, "Aug 28, 2026: Snowflake recommends transitioning from Cortex Analyst to Cortex Agents"](https://docs.snowflake.com/en/release-notes/2026/other/2026-08-28-cortex-analyst-transition-cortex-agents):
  **full page read**, and the first sentence re-read verbatim. Unlike the
  release note #42 hit, this one returned its body.
- [2026-08-26 Coding Agent GA note](https://docs.snowflake.com/en/release-notes/2026/other/2026-08-26-cortex-agents-coding-agent-ga):
  **full page read**.
- [2026-08-21 version-targeting note](https://docs.snowflake.com/en/release-notes/2026/other/2026-08-21-cortex-agent-eval-version-targeting-ga)
  and [2026-04-13 SQL generation note](https://docs.snowflake.com/en/release-notes/2026/other/2026-04-13-cortex-agents-agentic-analyst):
  **navigation shell only**. Their content comes from **search summaries**.
- [Google Cloud blog, "Conversational Analytics in BigQuery now GA"](https://cloud.google.com/blog/products/data-analytics/conversational-analytics-in-bigquery-now-ga)
  (Vasiya Krishnan and Jiaxun Wu, 2026-06-30) and
  [the Q3 2026 roundup](https://cloud.google.com/blog/products/data-analytics/conversational-analytics-in-google-data-cloud-in-q326)
  (2026-07-28): **full page read**, with the quotes re-read verbatim.

**7. Verified / inferred / assumed.**
- **Verified:**
  - the recommendation sentence, word for word;
  - that semantic views and verified queries carry over, and that the REST API
    stays available;
  - the absence of any figure from the note;
  - the coding-agent GA and its sandbox tool list;
  - Google's GA date, both Google quotes, and the absence of any accuracy
    figure from either Google post.
- **Search summary only, filed as inferred:**
  - the 2026-08-21 version-targeting feature and its `agent_version` key;
  - what the 2026-04-13 change did.
- **Inferred:** that the April change is the basis for the August claim.
  Neither note links the two.
- **Assumed:** that "higher answer quality" rests on an internal Snowflake
  evaluation rather than on customer reports. The note does not say which.

---

### 2. Tableau re-announced its agentic "Knowledge" layer at Dreamforce, now for general availability by the end of October, with no accuracy claim

**1. What it is.** **Tableau** is a **BI tool**, owned by Salesforce, used to
build dashboards on top of whatever warehouse a company runs. **Tableau Next**
is its newer platform, built on Salesforce's Data Cloud and Agentforce (the
Salesforce agent platform). Tableau Next has four layers of its own: data,
semantics, visualisation and action.

At **Dreamforce 2026** (Salesforce's annual conference, 2026-09-15 to
2026-09-17), Tableau announced four products. TechTarget reported that all of
them are "scheduled for general availability by the end of October":

- **Tableau Studio**, where "analysts can vibe code via natural language to
  create applications";
- **Proactive Intelligence**, to "deliver insights within user workflows",
  described as an "autonomous 'always-on analyst' that pushes proactive
  recommendations into operational tools";
- **Tableau Knowledge**, "to provide a context layer for AI and analytics to
  draw upon";
- **Data Apps**, which "extends Studio's application development capabilities
  to third-party environments such as ChatGPT and Claude".

**The item's substance is the date, not the product list.** Tableau Knowledge
is not new. TechTarget reported it at Tableau Conference on **2026-05-05**,
where Tableau's general manager Mark Recher said: "We've had a knowledge layer
-- a semantic layer -- inside Tableau for decades. What we're announcing is a
knowledge graph." That May article also said, verbatim: "The knowledge engine
will be GA in June". In September the target is the end of October. **As
reported, the context layer Tableau's agents are meant to run on has slipped
by about four months.** No accuracy claim was attached to it at either
announcement.

The two analysts TechTarget quoted are sceptical in different ways:

- **Mike Leone (Moor Insights & Strategy):** "the whole market is moving in this
  direction. They're building a lot of the same pieces, from semantic layers and
  agents to connections into AI assistants."
- **David Menninger (ISG):** "I'll reserve judgment on the speed of thought
  comment".

The one customer quoted, CrowdStrike's VP of AI, data and analytics, puts the
weight on the layer underneath, not on the agent: "The trusted data foundation
is a non-negotiable."

**2. How long ago.** Announced at Dreamforce, **2026-09-15 to 2026-09-17**,
7-9 days ago. The TechTarget report is dated **2026-09-21**, 3 days ago. The
exact keynote day was not read.

**3. How it relates to what has already been read.** Filed under
**`analytics-broad`**, the only active line that covers BI tools. Its window is
30 days, and at 3-9 days this passes. #26 item 1 covered Salesforce's Agent
Fabric and its cost and performance control plane around the same conference.
This is the analytics half of the same Salesforce push, and it had not been
read before. It also touches **`semantic-models`**. Recher's "knowledge graph"
on top of "a semantic layer" is one more instance of what #42 found: vendors
building around the semantic layer without saying what it costs to build or
whether it improves answers.

**4. What through-line it changes.** It adds a **schedule** through-line to
#42's "governance and meters, not accuracy". The BI vendors are selling a
context layer that is still pre-GA. As reported, the GA date moved from June to
October, so an agent that depends on it has had no generally available
foundation for the whole quarter. The inference from the two articles is
flagged in part 7. Leone's reading, that Tableau "is undergoing the same
repositioning as other analytics specialists", fits the headline: every layer
is now claiming to be the context layer.

**5. What to research next.**
- **Tableau Knowledge's actual status and what "knowledge graph" means.**
  Check Tableau's help pages and release notes for Tableau Knowledge or the
  "Auto Knowledge Graph". Is it the same component as May's "knowledge engine"
  (so a real slip) or a renamed or wider product? And is "continuously retrains
  itself based on user engagement" (per a search summary of Tableau's
  conference blog) documented anywhere, with any measure of what the
  retraining improves?
- **Tableau Agent's semantic-model generation, in Beta in Tableau Next, as
  demonstrated at Dreamforce 2026.** What does it generate from a plain-language
  prompt? Must a person certify the result before agents use it? Is there any
  figure for how faithful a generated model is? Set it beside Snowflake's
  Semantic View Autopilot (#42 item 2), the other vendor tool that writes the
  semantic layer for you.

**6. Source.** From open search. `techtarget.com` and `salesforce.com` are on
`sources.md`.
- [TechTarget, "Evolving Tableau touts tools to fuel AI-powered analytics"](https://www.techtarget.com/data-technologies/news/366650876/Evolving-Tableau-touts-tools-to-fuel-AI-powered-analytics)
  (Eric Avidon, 2026-09-21): **full page read**, with the availability sentence
  and both analyst quotes re-read verbatim.
- [TechTarget, "Tableau repositions for AI, unveils new knowledge layer"](https://www.techtarget.com/searchbusinessanalytics/news/366642778/Tableau-repositions-for-AI-unveils-new-knowledge-layer)
  (2026-05-05): **full page read**, used as dated background. The "GA in June"
  sentence was re-read verbatim.
- The [Salesforce+ keynote page](https://www.salesforce.com/plus/experience/dreamforce_2026/series/tableau_-_agentic_analytics_at_dreamforce_2026/episode/episode-s1e2)
  returned a truncated shell: its title and running time only.
- The Dreamforce dates come from a **search summary** of Moscone Center's
  event listing.
- The Tableau Agent Beta status and the "Auto Knowledge Graph" wording are
  **search summary only**.

**7. Verified / inferred / assumed.**
- **Verified:**
  - the four products and their one-line descriptions as TechTarget reported
    them;
  - "general availability by the end of October";
  - the May "GA in June" sentence and the Recher quote;
  - the Leone, Menninger and CrowdStrike quotes;
  - the absence of any accuracy figure from both articles.
- **Inferred:**
  - **the slip itself.** It rests on one publication reporting "the knowledge
    engine" for June and "Tableau Knowledge" for October. These may not be the
    same component.
  - the Dreamforce dating, which comes from the event dates and not from a
    dated keynote page.
- **Assumed:** that TechTarget's report of availability matches Tableau's own.
  No Tableau-authored page with the October date was read.

---

### 3. Looker can now write its semantic model into the warehouse, as a Snowflake semantic view or a BigQuery Graph

**1. What it is.** **Looker** is Google's **BI tool**. Its distinguishing
feature has always been **LookML**, a modelling language where joins,
dimensions and measures are defined once as code. So Looker is both a
**semantic layer** and a consumption layer. An "Explore" is LookML's unit of
exposed analysis: a set of joined views that users, and now agents, query.

On **2026-08-28** Looker's release notes carried, verbatim: "Now available in
preview, you can define Looker-managed, in-database analytic models directly
from existing LookML Explores." The feature documentation explains what that
means:

> Looker "automatically translates your Explore topology, joins, dimensions,
> and measures into database-native analytic model DDL statements (such as node
> and edge tables for BigQuery Graph or tables and relationships for Snowflake
> semantic views)."

The documentation gives the purpose as: "so that you can keep your semantic
definitions consistent across Looker and other BI tools, applications, or
workloads that interface with your data warehouse." Three ways of using it are
documented:

- point Looker at an analytic model the database already owns;
- have Looker manage one from SQL;
- have Looker **derive one from LookML**. This is the new one.

The same day's notes made two further changes, both GA:

- **Conversational Analytics verified queries**, "also known as golden
  queries". These are curated question-and-SQL pairs the agent retrieves
  instead of writing SQL from scratch; Snowflake's verified queries in item 1
  are the same idea.
- Continuous Integration (CI) suites can now run automatically "when a dbt
  Cloud CI job finishes".

**Background (out of window).** On **2026-05-27**, 120 days ago, Looker
announced a preview in which it could **read** Snowflake semantic views and
BigQuery Graphs, together with a Looker-managed MCP server in preview. MCP,
the Model Context Protocol, is the standard way for an outside agent to call a
tool. August adds the other direction: Looker **writes** them.

**2. How long ago.** **2026-08-28**, 27 days ago.

**3. How it relates to what has already been read.** Filed under
**`semantic-models`**, which is on its first run and has a 90-day window. It
also serves **`dbt-context`**, whose window is 30 days; 27 days passes that
too, so the filing widens nothing. It is the mirror image of **#42 item 2**:

- In August, Snowflake's Autopilot began **importing** Power BI models into
  Snowflake semantic views.
- In the same month, Looker began **exporting** LookML into Snowflake semantic
  views.

Two different vendors, from opposite sides, both chose the warehouse's own
object as where a semantic definition ends up. It also bears on **#42 item 1,
Apache Ossie**. Ossie is meant to be the neutral exchange format between tools.
Looker's route skips it and compiles straight into each warehouse's native
format. The analytic-models page as read does not mention Ossie at all, which
is an absence and not a stated choice.

**4. What through-line it changes.** It sharpens #42's portability through-line
and points it in a direction. #42 said the semantic layer "is becoming
transferable". This says **where it is being transferred to: the warehouse**.
That is the layer whose vendor, in item 1, now recommends an agent that reads
semantic views. If LookML compiles to a Snowflake semantic view, then Cortex
Agents and Looker's own Conversational Analytics could answer from one
definition. They would also become directly comparable, which nobody has been
able to do so far. That last point is an inference, and it is lead 2.

**5. What to research next.**
- **What survives the LookML-to-semantic-view translation.** Use Looker's
  `derived_analytic_model` and `model_source` documentation (preview
  2026-08-28). Which LookML constructs have no Snowflake semantic view or
  BigQuery Graph equivalent: derived tables, Liquid templating, access filters
  and row-level security, measure types such as `count_distinct` over fanned-out
  joins? The page as read carries no limitations list, so the answer will be
  in the parameter reference, or it will be an absence worth recording.
- **One semantic definition, two agents.** Snowflake has scheduled a webinar,
  "Stop Redefining your AI Context: Snowflake Semantic Views and Google Looker",
  for 2026-10-21. Find any Snowflake or Google documentation of a joint pattern
  in which a Looker-derived semantic view is queried by Cortex Agents. Has
  anyone compared the two agents' answers on the same view? That is the "one
  semantic layer, two engines" experiment #42's recommendation called for.

**6. Source.** From open search. `docs.cloud.google.com` is not in the
`sources.md` table; it is where `cloud.google.com/bigquery/docs/*` redirects,
per the `cloud.google.com` row.
- [Looker release notes](https://docs.cloud.google.com/looker/docs/release-notes):
  **full page read** for June to September 2026, with every quoted entry
  verbatim.
- [Looker, "In-database analytic models"](https://docs.cloud.google.com/looker/docs/analytic-models):
  **full page read**.
- The Snowflake webinar title and date are **search summary only**.

**7. Verified / inferred / assumed.**
- **Verified:**
  - the 2026-08-28 preview entry, the golden-queries GA and the dbt Cloud CI
    trigger, all verbatim;
  - the translation sentence and the purpose sentence from the feature page;
  - the three integration methods;
  - the 2026-05-27 read-direction preview and the managed MCP server preview;
  - that the analytic-models page does not mention Ossie, Cortex Agents or any
    limitations.
- **Inferred:**
  - that "derive from LookML" is the new capability in August and the rest was
    already there in May. The release notes support this; the feature page does
    not date its sections.
  - that two agents reading one derived view would be comparable.
- **Assumed:** that preview means incomplete translation coverage. Nothing read
  says what is missing, and a translation of this kind is rarely lossless.

---

### 4. Hex, a notebook vendor, shipped an evaluation tool for its agent - and its pass rule counts one success in two attempts as a pass

**1. What it is.** **Hex** is a hosted **notebook**. SQL, Python and charts sit
in one document and connect to the company's warehouse. It has an agent in two
forms:

- **Threads**, a chat interface for business users;
- the **Notebook Agent**, which works inside a notebook.

Hex also keeps its own semantic models, so it spans the notebook and semantic
layers.

This quarter it shipped three things, in order:

- **2026-08-04, "Introducing Evals".** "Measure Hex Agent performance and test
  context changes safely before they ship, all from the CLI." Ground truth can
  be a number, or a reference SQL query with a tolerance. The grading can also
  be done by a model judge (an LLM reading the transcript). The rubrics check
  whether the agent will:
  - "use the correct tools, like a specific semantic model or guide";
  - "propose multiple approaches back to the user or ask for clarification";
  - "find and call out the data discrepancy that you know exists in the data";
  - "appropriately refuse to answer a question where there is insufficient
    context".

  The named customer is Chime, with "50+ data domains".
- **2026-08-11: a chat-to-notebook toggle.** Users "easily switch views and
  build in the underlying notebook". A business user's conversation now has a
  notebook behind it that an analyst can open and audit.
- **2026-09-15: publishable, versioned eval suites.** Teams can "Turn the
  questions you test repeatedly into a versioned suite, then compare results as
  your guides or semantic models evolve", and schedule them to run in Context
  Studio.

**The detail worth reading twice is the pass rule.** Hex's Evals documentation
says, verbatim:

> "For cases with 2 or 3 attempts, the case passes as long as no more than one
> attempt fails.
> - 1 attempt: it must pass
> - 2 attempts: at least 1 must pass
> - 3 attempts: at least 2 must pass"

So a case where the agent is right once and wrong once **scores as a pass**.
Repeated attempts are how you would detect an agent that is inconsistent, and
this rule lets inconsistency through by design. The case-level pass rate is
then "every case counts equally across the suite, however many attempts it
ran". Two rubric types use a model judge, and the documentation does not say
which model it is.

**Background (out of window).** Hex has been candid about how hard this is.
In a post on its internal evaluation lab (Izzy Miller, **2026-05-22**) it said:
"We still sometimes struggle to calibrate and align our LLM judges". It also
said its "eval sets are also relatively small compared to public benchmarks".

**The same fortnight elsewhere in notebooks, as corroboration.**

- **Databricks:** its in-notebook assistant, renamed **Genie Code**, got a
  "Full page ... command center experience where the active chat is shown
  prominently" on **2026-08-04**, with notebooks open as tabs beside the chat.
  An effort-level setting followed on 2026-08-19.
- **Deepnote**, another hosted notebook, launched an **Agent Workspace** on
  **2026-08-03**, reachable from Claude Code, Codex or any MCP client.

In both, the notebook is becoming the artifact behind the conversation rather
than the place where work starts. Neither published an accuracy figure.

**2. How long ago.**
- **2026-08-04**, 51 days ago, for Evals;
- 2026-08-11 (44 days) for the chat-to-notebook toggle;
- 2026-09-15 (9 days) for published suites;
- Databricks and Deepnote on 2026-08-04 and 2026-08-03 (51 and 52 days).

**3. How it relates to what has already been read.** Filed under
**`efficacy-methodology`**, which is on its first run and has a 90-day window,
because what matters here is the scoring design, not the notebook. It also
serves **`semantic-models`** (90 days) in a specific way. #42's headline was
that nobody reports what a semantic layer costs or buys. **A versioned suite
re-run "as your guides or semantic models evolve" is the first product feature
found that could measure what a change to the semantic model buys**, on the
customer's own questions. If `analytics-broad` (30 days) were the filing line,
the 51-day date would fail it. That is named here so the choice is visible.

**4. What through-line it changes.** It turns the headline's "the evaluator is
handed to the customer" into something concrete, and it adds a warning. **Who
sets the pass rule sets the result.** A vendor-designed harness decides how
repeated attempts combine. Hex's choice treats one success in two as a pass.
That leniency is invisible in a headline pass rate, and it is exactly the
reliability failure item 5 measured. Whether a buyer-run evaluation is stronger
evidence than a vendor-run benchmark depends on rules like this one, not on who
presses the button.

**5. What to research next.**
- **How much Hex's pass rule inflates a pass rate.** Does Hex's Evals output
  (CLI or Context Studio) report per-attempt results as well as per-case ones,
  so a user can recompute a strict all-attempts-pass rate? Has Hex, or Chime
  (the customer named in the 2026-08-04 launch post), published any pass rate
  at all?
- **A measured semantic-model change.** Has any Hex customer or Hex post
  published a before-and-after suite result for a semantic-model or guide
  change since 2026-09-15? Separately, does Databricks' Genie Code "semantic
  validation check" publish its check list with any pass figure? Per a search
  summary, that check validates "business definitions, grain, attribution,
  population, time window, units, scale" after writing a dashboard widget.
  Either would be the first number on what a semantic-layer change buys inside
  a product.

**6. Source.** From open search; none of these hosts is on `sources.md`.
- [Hex changelog](https://learn.hex.tech/changelog),
  [2026-08-04 entry](https://learn.hex.tech/changelog/2026-08-04),
  [2026-08-11 entry](https://learn.hex.tech/changelog/2026-08-11) and
  [2026-09-15 entry](https://learn.hex.tech/changelog/2026-09-15):
  **full page read**.
- [Hex blog, "Introducing Evals"](https://hex.tech/blog/evals/) (Andrew Lee,
  2026-08-04): **full page read**.
- [Hex Evals documentation](https://learn.hex.tech/docs/agent-management/evals):
  **full page read**, with the pass-rule passage re-read verbatim.
- [Hex blog, "How we built a lab to evaluate data agents"](https://hex.tech/blog/evaluate-data-agents/)
  (2026-05-22): **full page read**, used as background.
- [Databricks platform release notes, August 2026](https://docs.databricks.com/aws/en/release-notes/product/2026/august):
  **full page read**. The "semantic validation check" wording is **search
  summary only**.
- [Deepnote, "Introducing Deepnote Agent Workspace"](https://deepnote.com/blog/agent-workspace):
  **full page read**.

**7. Verified / inferred / assumed.**
- **Verified:**
  - every Hex date, quote and rubric description above;
  - the pass rule, verbatim;
  - the equal weighting of cases;
  - that the judge model is not named in the documentation;
  - the Chime figure;
  - the May "struggle to calibrate" quote;
  - the Databricks and Deepnote dates and descriptions;
  - that none of the three vendors' pages carries an accuracy figure.
- **Inferred:**
  - that the pass rule hides inconsistency. This is arithmetic on the stated
    rule, not something Hex says.
  - that versioned suites could measure a semantic-model change. That is what
    the feature is described as doing; no one has reported doing it.
- **Assumed:** that customers use multi-attempt cases at all. Attempts are
  configured per case, from one to three, and the default was not read.

---

### 5. The first in-window evaluation of a deployed enterprise analytics agent with a real design found the failures that final-answer grading hides

**1. What it is.** "Evaluating Enterprise Analytics Agents: An End-to-End,
Trace-Backed Methodology", arXiv:2609.09182. Eight authors, all at
**Thumbtack**, which the paper calls "a large online marketplace". "Trace-backed"
means the grading reads the agent's recorded steps (tool calls, tables used,
intermediate results), not only its final answer.

The argument, from the abstract: "Grading final answers hides where these
agents fail. A plausible answer can use the wrong source of truth. It can skip
a required decomposition, claim causality without support, or change its table
interpretation across repeated runs."

The method grades three families: **semantic understanding**, **execution
quality** and **reliability**. It uses:

- question banks with human-written golden answers. Each answer "was drafted by
  the domain expert who owns that business area and independently reviewed and
  approved by a second analyst";
- repeated runs;
- runtime traces;
- a **run-validity check** before scoring, which filters out authentication and
  infrastructure failures;
- **"tiered, abstention-aware scores"**, with four verdicts: yes, partial, no,
  unknown. These feed "a decision framework rather than a release gate".

The case study used 50 questions, two anonymised model setups called "Fast"
and "Reasoning", and three randomised repetitions each: **300 traces**. The
results, from the abstract verbatim:

- The stronger setup "reduced early refusal from 73% to 0% and increased
  real-data answers from 21% to 73%".
- It "also exhausted the tool-round budget on 16% of runs".
- It "overran the schema-exploration budget on 77% of traces".
- **It "changed its table interpretation on 41 of 50 questions."**
- "On finance questions with structured golden answers, source table use and
  escalation improved, but canonical decomposition remained weak in both
  configurations."

**What it does not have.** There is no human baseline and no online experiment
or A/B test. And "The question bank, the agent system, and the data warehouse
are internal to one organization and cannot be shared." The paper also does not
say which warehouse, semantic layer or vendor agent the system is built on.

**2. How long ago.** **2026-08-28** (v1 submitted 20:57 UTC), 27 days ago.

**3. How it relates to what has already been read.** Filed under
**`efficacy-methodology`**, which is on its first run and has a 90-day window.
It also serves **`agent-efficacy`**, whose window is 30 days; 27 days passes
that too. #42 dropped this paper by title, as in date but outside that round's
four subjects. This is its first read. It sits in the same family as three
earlier findings that measure a system against its real state rather than its
surface:

- #26's **ERPBench**, which scored agents against the database rather than the
  screen: 85% "saved", 3% correct;
- #35's WarehouseReliabilityBench;
- #42's **GROUND**, which made security violations a headline metric.

It is the first of these to evaluate a **deployed enterprise analytics agent**,
not a benchmark system. It was built by the company that runs the agent, not a
vendor or an academic group. That is the kind of evidence
`efficacy-methodology` says an organisation accepts.

**4. What through-line it changes.** It changes the one this reader's
efficacy line started from: that the question is **accuracy**. On the paper's
numbers, capability and reliability moved in opposite directions. The setup
that answered from real data three and a half times as often also changed its
table interpretation on 82% of questions across repeated runs. A single-run
accuracy benchmark would have scored the stronger setup as simply better. A
vendor harness with a lenient multi-attempt rule (item 4) might as well. **The
reliability family is what makes this paper different, and no vendor's
launch-quarter material reports anything like it.**

**5. What to research next.**
- **The scoring arithmetic in arXiv:2609.09182, from the HTML full text.** How
  do "partial" and "unknown" enter the mean pass rate? Is "unknown" (abstention)
  scored as neutral or as failure? What exactly counts as "changed its table
  interpretation", and is there a threshold? Then apply the 41-of-50 result to
  Hex's rule (at least 2 of 3 attempts must pass). How many of those questions
  would a 2-of-3 rule still pass?
- **Do vendor evaluation tools cover the paper's three families?** Map
  Snowflake's Cortex Agent evaluations (GA 2026-03-13, version targeting
  2026-08-21), whose metrics include "tool execution accuracy" per a search
  summary, and Hex Evals (2026-08-04) against the paper's semantic
  understanding, execution quality and reliability. Which families can a
  customer measure with the vendor's own tool, and which cannot be measured at
  all? Also run a forward search for any paper or post citing 2609.09182.

**6. Source.** From open search. `arxiv.org` is on `sources.md` and, as in
every earlier round, was reached by searching.
- [arXiv:2609.09182 abstract page](https://arxiv.org/abs/2609.09182):
  **full page read**, with the abstract re-read character for character for
  every figure.
- [HTML full text](https://arxiv.org/html/2609.09182v1): **full page read**,
  through a summarising fetch, for the affiliation, the golden-answer process,
  the four verdicts, the run-validity signals and the limitations quote. Those
  phrases were returned as quotations.

**7. Verified / inferred / assumed.**
- **Verified:**
  - the title, the authors and the submission date;
  - every figure in the abstract, verbatim;
  - the Thumbtack affiliation;
  - the golden-answer drafting and review process;
  - the four-verdict scale;
  - the "cannot be shared" limitation;
  - the absence of a human baseline and of any online experiment.
- **Inferred:** "82% of questions", which is 41 ÷ 50, and "three and a half
  times", which is 73 ÷ 21.
- **Inferred:** that the paper's reliability failures would survive a lenient
  multi-attempt rule. The paper reports per-question instability, not per-case
  pass counts, so this needs lead 1.
- **Assumed:** that the internal agent is representative of what a vendor agent
  would do on the same questions. It is one company's system on one company's
  data. The paper says so, and nothing here can check it.

---

## What was dropped, and why

- **Google BigQuery Conversational Analytics GA (2026-06-30, 86 days).** In
  window, and the closest rival for angle 1. It lost to Snowflake's note because
  Snowflake's changes the architecture a reader has to understand: the
  text-to-SQL service becomes a tool inside an agent. Both make an unquantified
  quality claim. Google's evidence is used in item 1's part 4 and in its second
  lead.
- **Databricks Genie One, Genie Ontology and Agent Bricks (2026-06-16, 100
  days).** Out of window by 10 days; used as background. The in-window Genie One
  updates are about distribution, not capability: Excel and Google Sheets on
  2026-08-05, a macOS app on 2026-08-25, and a free-usage extension to
  2027-01-31 on 2026-08-03.
- **Microsoft Power BI and Fabric.** Per a search summary, the integration
  between Copilot in Power BI and Fabric data agents is retired from
  **2026-08-26**. For a reader asking where agents sit, that would have been
  the most telling BI item. Both `community.fabric.microsoft.com` and
  `powerbi.microsoft.com` returned **403**, so it would have been built on
  summaries. #19 hit the same wall.
- **Sigma, "New in Sigma July 2026" (2026-07-31, 55 days).** Sigma is a
  warehouse-native BI tool. Its agents "can now use a governed data model as a
  source", and "evals will help you see not just whether an agent is used but
  whether it is any good" is listed as **coming later in 2026**. Read in full.
  Smaller than Tableau's announcement; used in the headline.
- **Cube, "Agentic Analytics Loops" (2026-08-13, 42 days).** Cube is a
  standalone semantic layer. This is a direction post by its CEO. It mentions
  "recently released Cube Evals" but gives no figures. The Semantic Model Agent
  it describes dates from October 2025. Read in full; used in the headline.
- **Tableau Conference 2026 (2026-05-05)** and **Looker's May 27 previews.** Out
  of window; used as background in items 2 and 3.
- **Snowflake semantic view variables GA (2026-06-26, exactly 90 days).** In
  window by one day. A modelling feature with no agent or evidence angle.
  Search summary only.
- **AWS.** The only in-window item found, "Amazon Redshift integrates with Agent
  Toolkit for AWS" (August 2026), is about administering the warehouse, not
  analysing data in it. Search summary only. Amazon Quick Suite had no dated
  in-window launch that could be found.
- **ThoughtSpot Spotter 3 (February 2026) and Spotter for Industries
  (2026-03-18).** Out of window.
- **dbt Summit 2026 (2026-09-15 to 2026-09-18).** Already reported as #42 item
  5. Its new piece, the Fivetran Context Layer in private beta, continues #26's
  Agents Schema item. Not re-reported.
- **DataSpace (arXiv:2608.03451, 2026-08-04).** In window: 410 tasks over mixed
  file, database and video workspaces, which found that "multimodal evidence
  integration and joins consistently reduce accuracy across all six backbones".
  It is an academic benchmark not tied to any product in this seed. Thumbtack's
  paper was chosen for angle 5 because it evaluates a deployed agent.
- **"Business Truth, not SQL Accuracy" (arXiv:2608.09254).** In window by
  identifier and on topic, but not read past a search listing. Worth a look if
  angle 5 is followed.
- **Kyvos joining Apache Ossie (2026-08-12).** A membership announcement.

## What was searched for and not found

- **An independent accuracy comparison of warehouse-native agents** (Cortex
  Agents or Cortex Analyst, Genie, BigQuery Conversational Analytics) dated in
  the window. None was found. What exists is vendor-internal figures, all from
  June or earlier, and vendor-blog comparisons that say, in one case, "Neither
  vendor's figure is comparable".
- **Any figure behind Snowflake's "higher answer quality".** Not in the release
  note, and not found by search.
- **Any accuracy figure in the window's launch material.** None in Google's two
  Conversational Analytics posts, in Tableau's Dreamforce announcements as
  reported, or in Hex's, Cube's, Sigma's or Deepnote's posts.
- **Any published pass rate from Hex Evals**, by Hex or by Chime. None.
- **An online experiment or A/B test of an analytics agent**, in any vendor or
  practitioner write-up in the window. None. Thumbtack's paper is an offline
  evaluation with repeats, and it says it ran no experiment.
- **A critic or replication of arXiv:2609.09182.** None. It is 27 days old.
- **A limitations list for Looker's LookML-to-semantic-view translation.** Not
  on the feature page as read.
- **Any in-window release of Google Colab's Data Science Agent or of Jupyter
  AI.** None found. The notebook angle's in-window activity that could be found
  was at Hex, Databricks and Deepnote; Snowflake Notebooks was not searched on
  its own.
- **Whether the Looker feature uses Apache Ossie.** It does not mention it.

## Corrections made after this pass, by the driver and the paths

Recorded here, where the corrected claims sit, and not only in the index.

- **"No launch came with a number" is too strong.** The launch *notes*
  carried none. But the vendors' *engineering blogs* published internal
  figures inside the window, which this pass missed or placed out of window:
  - Snowflake's Cortex Sense post, **2026-06-30**: 24.1% → 86.3%;
  - Databricks' Genie Code comparison, **2026-07-23**: 401 internal tasks,
    76.6%;
  - Snowflake's data-eng-bench, **2026-08-06**: 103 public tasks;
  - Hex's DataBench, **2026-08-13**;
  - Snowflake's CoCo and CoWork post, **2026-08-21**: 58 internal questions.

  Path 1, level 1 reads the Snowflake and Databricks posts. The headline's
  point survives in a narrower form: what shipped with the launches was a
  claim and an evaluator, and the numbers that exist compare vendor agents
  with general coding agents, not with the vendor's own earlier product.
- **"The accuracy figures already reported in #19 date from the June
  summits and are also out of window."** Snowflake's 86.3% was republished
  in window, on 2026-06-30 and 2026-08-21, with a count of 58 that can be
  tested (path 1, level 1, item 2). Databricks' 52.4% → 84.5% (2026-06-16) is
  out of window, as stated.
- **BigQuery Conversational Analytics' GA date.** Google's BigQuery release
  notes date it **2026-06-23**, 93 days ago and outside the window. Item 1's
  "2026-06-30" is the date of Google's blog post about it, which is inside.
- **Item 1: Cortex Analyst "turns a question into one SQL query against a
  semantic view".** Snowflake's Routing Mode page says that trying the
  `SEMANTIC_VIEW()` clause first "only results in semantic SQL for about 10%
  of queries, in aggregate". Its overview page says: "Currently, Cortex Agents
  reads the information captured in the semantic view definition and
  generates the SQL against the physical tables directly" (path 3, level 2).
  Both products mostly write SQL against the tables, informed by the view.
- **"Any in-window release of ... Jupyter AI. None found."** Jupyter AI
  **3.2.0** was released on **2026-09-03**, per its changelog, which the driver
  read. That release is maintenance and routing work, not an agent feature,
  so the notebook angle's conclusion does not change.
