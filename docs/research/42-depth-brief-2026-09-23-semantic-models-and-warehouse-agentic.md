# Depth brief: semantic models, warehouse agentic features, and two benchmarks - 2026-09-23

**Produced by a research run**, not by a session. Per
[`docs/reader/loop.md`](../reader/loop.md) step 2, this says so at the top
because a driver-written brief is not evidence that the pipeline works.

**The decision this brief serves:** the reader asked to go deeper on four
things after reading round 3 - semantic models, the Spider 2.0-AIFunc update,
Snowflake and dbt agentic features, and the DevRev benchmark whose premise they
endorsed. Two of those are new topics and two are follow-ups on a topic that has
already run. The question underneath all four is round 3's own counter-argument:
**every accuracy number in that report was measured on questions a semantic layer
was built to answer, and nobody reported what building it cost.**

**Six items passed filtering.** Three serve the new `semantic-models` topic, two
serve the new `warehouse-agentic` topic, and one serves `benchmarks-depth`. No
subject came back at zero. **Spider 2.0-AIFunc has not moved**, and that is
reported below as a finding rather than padded into an item.

---

## The headline, before the items

**Round 3 said nobody reports what a semantic layer costs to build. After a
90-day search, that is still true - and the interesting part is what the industry
is doing instead of measuring it.**

Three papers now report accuracy that a governed semantic layer made possible,
and none of the three reports the effort that produced the layer. GROUND (item 3)
is the newest; QUVI and SPC were round 3's items 5 and 6. The count matters more
than any one instance: this is not one author being careless, it is a field-wide
convention that the modelling side of the trade is not part of the result.

Meanwhile both vendors spent the window attacking that cost without ever naming
it. Snowflake shipped a way to **import** a semantic model you already paid for
rather than author a new one (item 2). The Open Semantic Interchange became
**Apache Ossie** so that a semantic model written once is portable to the next
tool (item 1). Both of those are only worth building if hand-authoring is
expensive - so the vendors are pricing the problem with their roadmaps while the
papers leave the number blank.

**And the second thing both vendors shipped is a meter.** Snowflake's Cortex AI
Gateway "attributes costs to the teams, agents, or workloads driving them, and
enforces spending limits" (item 4). dbt now bills Wizard **per token**, with
monthly included usage and admin spend limits (item 5). Neither vendor shipped a
headline accuracy improvement in this window. They shipped governance and
billing. That is what a category looks like when the capability question is
considered settled enough to start charging for, and it is the strongest signal
in this round that the interesting cost has moved from inference to everything
around it.

---

## Spider 2.0-AIFunc: nothing has moved, and here is what that cost to establish

This is not an item. It has no development dated inside its window, so counting
it as one would be padding. It is reported here because three of round 3's open
questions are now answered, and the answers are all negative.

**Spider 2.0-AIFunc has had no development between 2026-08-24 and 2026-09-23.**
The `xlang-ai/Spider2` README's News list ends at **2026-08-12**, the Snowflake
evaluation-account suspension notice that round 3 already reported. There is no
entry after it. The Spider 2.0 leaderboard site carries **three tracks - Snow,
DBT and Lite - and no AIFunc track**, so there is nowhere for an AIFunc result to
appear even if someone had produced one.

**Does AIFunc have a leaderboard?** No, and the paper does not promise one. It
ships GitHub and Hugging Face resources and reports its own numbers; it never
references a leaderboard system. **Has any Spider 2.0-Snow top-three system been
scored on it?** No. Neither Genloop nor QUVI - nor any other named leaderboard
entrant - appears in its evaluation. The comparison round 3 wanted, where a
system near 96 on Snow is measured near 70 on AIFunc, has not been run by
anybody, and there is no venue that would host it.

**Does AIFunc use the suspended Snowflake evaluation account?** The paper does
not say. It says agents "interact directly with the Snowflake environment,
proposing modifications to both the SQL and the instruction, executing the
resulting query against the database", and that each of the 465 instances passed
a four-pass determinism check of "at least 35 executions per instance". That
describes a Snowflake account doing a great deal of work; it does not say whose.
The suspension notice names **Spider 2.0-Snow** specifically and AIFunc not at
all, which is weak evidence they are separate and not enough to conclude it.

The reason to keep watching: AIFunc's 67-70% is still the single best argument
against "enterprise text-to-SQL is nearly solved", and it is currently an
unaudited self-report by the benchmark's own authors. Nothing independent has
touched it in eleven weeks.

---

## The items

### 1. The cross-vendor semantic model spec became an Apache project, and named what it has not decided

**1. What it is.** The **Open Semantic Interchange** was accepted into the Apache
Incubator and renamed **Apache Ossie (incubating)**. It is "an open,
vendor-neutral specification for exchanging semantic models: datasets, fields,
relationships, and metrics", expressed in JSON or YAML, and it "defines a
vendor-neutral format for expressing business metrics, dimensions, and their
relationships as well as broader business concepts and rules" so that tools can
"consume and produce semantic definitions without loss of meaning". The rename
was mechanical rather than strategic - "OSI" collided with other projects sharing
that acronym.

The substance behind it: **more than 100 commits and 35 merged pull requests**
from contributors at Snowflake, Dremio, Salesforce, Databricks, dbt Labs,
RelationalAI, GoodData and Honeydew, with participation grown "from 17 launch
partners to more than 50 organizations" and three working groups with named
leadership. Under incubation it runs on "public mailing lists, GitHub-based
development, a formal discussion-and-vote process for spec changes, and
committership earned through contribution rather than employer affiliation".

The part worth reading twice is what is **not** settled. Proposed additions -
an expression-language specification, converters, a standardized query
specification, catalog integration - are listed and then explicitly disclaimed:
"None of this is predetermined." A semantic model you can exchange but cannot
*evaluate* identically in two tools is a portable document, not a portable
answer. The expression language is the piece that would make it the second thing,
and it is on the maybe list.

**2. How long ago.** **2026-07-10**, eleven weeks ago. Inside the 90-day window
this topic gets on its first run.

**3. How it relates to what has already been read.** It is the first item in any
of these briefs that treats the semantic model as an **artifact with a format**
rather than as an implementation detail inside one vendor. Round 3's items 5 and
6 both independently landed on deterministic compilation from a structured
intermediate - QUVI's SMQ, SPC's semantic paths - and neither could say whether
those intermediates were the same kind of object. Ossie is the answer being
built: they are, or they are meant to become, the same kind of object. It also
gives the Fivetran/dbt **Agents Schema** from #26's item 2 a context it did not
have - that was one vendor pair's standard, and this is the industry one that
both of them are also in.

**4. What through-line it changes.** It adds one. Round 3's through-line was that
routing through a semantic layer is how a system gets to the top of a leaderboard.
This says the layer is becoming **transferable**, which changes what the cost of
building one means: a cost you pay once per company is a different proposition
from one you pay once per tool. It does not change the accuracy through-line at
all - nothing here is measured.

**5. What to research next.**
- Whether the expression-language working group has produced anything, since
  that is the difference between exchanging definitions and exchanging results.
- Whether any of the three benchmark systems round 3 read - QUVI, SPC, or dbt's
  own harness - can ingest or emit Ossie, which would let one semantic layer be
  scored under two engines and isolate the layer's contribution from the engine's.

**6. Source.** [Apache Ossie (incubating), "Apache Ossie (Incubating): The New
Name for Open Semantic Interchange"](https://ossie.apache.org/updates/ossie-enters-apache-incubator/).
Reached by **open search**; `ossie.apache.org` was not on `sources.md` and is
added by this round. **Full page read.**

**7. Verified / inferred / assumed.** **Verified:** every quoted phrase, the
date, the commit and pull-request counts, the contributor company list, the
governance model, and the "None of this is predetermined" disclaimer - all from
the project's own announcement, read in full. **Inferred:** that a semantic model
exchanged without a shared expression language will not produce identical results
across two engines; the post implies this by listing an expression-language spec
as a proposed addition, but does not state the consequence. **Assumed:** that
"more than 50 organizations" participating means more than nominal membership.
The post gives no activity breakdown per organisation, and a standards body's
partner count is the number most likely to be generous.

---

### 2. Snowflake made the cheapest semantic model the one you already built somewhere else

**1. What it is.** **Power BI ingestion for Semantic View Autopilot** reached
**general availability**. Autopilot is "the AI-assisted way to create a semantic
view in Snowsight" that "generates the logical tables, relationships, and metrics
for you" instead of requiring hand-written YAML; the new capability is that it
now takes a Power BI file as the input. "Autopilot supports the `.pbit` and
`.pbix` formats", and doing so "lets you migrate your existing DAX measures,
table relationships, and column definitions directly into Snowflake". It needs a
stage you can write to and read access to the underlying tables the Power BI file
references. The resulting semantic view is what Cortex Analyst queries against.

**Filed under `semantic-models`; it serves `warehouse-agentic` too.** Both topics
are on their first run at a 90-day window, so the filing does not admit an item
the other line would have excluded - the date passes either way. Naming it
anyway, because an unstated dual filing is how a window gets widened quietly.

The reason this is a semantic-models item and not a feature note: it is a
**statement about where the cost is**. Nobody builds an importer for an artifact
that is cheap to author. The whole proposition is that a company's Power BI model
represents years of accumulated definition work, and that re-deriving it inside
Snowflake is expensive enough to be worth engineering around.

What it does **not** carry is the number. The GA release note itself is a
navigation shell that returns none of its own content, and the user guide that
does carry the substance is undated and quantifies nothing - no coverage figure
for how much of a typical Power BI model survives the trip, and no accuracy
comparison between an imported view and a hand-built one. The only figure this
vendor has ever published on the subject is "review, certify and deploy in
minutes instead of weeks", from the Autopilot launch post of **2026-02-03**,
which is seven months outside this window and is a marketing claim with no method
behind it. That post also supplies the one honest sentence in the set: Autopilot
"transforms semantic modeling from coding into curation" - the human is still
required, and what changed is what they do, not whether they are needed.

**2. How long ago.** **2026-08-18**, five weeks ago. Inside the 90-day window.

**3. How it relates to what has already been read.** It is a direct development
on the Semantic View Autopilot drop that **#26 fetched and then dropped** as
seven months out of window. That drop is now vindicated and reversed in the same
motion: the February launch stayed out, and the August extension of it is in. It
is also the concrete form of round 3's counter-argument - the modelling cost that
no paper reports is the cost this product exists to remove.

**4. What through-line it changes.** It sharpens the standing one. "Routing
through a semantic layer is how you get accuracy" now has a second half: "and the
layer is expensive enough that the warehouse vendor will import yours from a
competitor's tool rather than make you write it." It changes nothing about
measured accuracy, because none is reported.

**5. What to research next.**
- What fraction of a real Power BI model survives ingestion. The user guide
  points at a separate "Power BI ingestion feature support" page for the
  exclusions, which is where the honest answer will be.
- Whether an imported semantic view scores the same as a hand-built one on
  anything - Cortex Analyst has no published benchmark, and this is the obvious
  experiment nobody has run.

**6. Source.** [Snowflake, "Semantic View
Autopilot"](https://docs.snowflake.com/en/user-guide/views-semantic/autopilot),
the user guide, which carries the Power BI ingestion substance. Reached by **open
search**; `docs.snowflake.com` was not on `sources.md` and is added by this round
- note that `snowflake.com` was already listed and is a different host. **Full
page read** of the user guide. The GA release note at
[`/release-notes/2026/other/2026-08-18-semantic-views-power-bi-ingestion-ga`](https://docs.snowflake.com/en/release-notes/2026/other/2026-08-18-semantic-views-power-bi-ingestion-ga)
returned **a navigation shell only**, so the date comes from that note's title and
path rather than from its body. The "minutes instead of weeks" and "coding into
curation" quotes are from
[Snowflake's Autopilot launch post](https://www.snowflake.com/en/blog/semantic-view-autopilot/),
**full page read**, and are used as dated context, not as this item's date.

**7. Verified / inferred / assumed.** **Verified:** the `.pbit`/`.pbix` support,
the migration of DAX measures, table relationships and column definitions, the
stage and read-access prerequisites, and Cortex Analyst as the consumer - all
read in full from the user guide. **Verified separately:** the two February
quotes, from the launch post read in full. **Inferred:** the **2026-08-18 GA
date**, which rests on the release note's title and URL path because its body
would not render - a title and a path are strong evidence and are not the page
saying it. **Inferred:** that building an importer implies the vendor believes
authoring is expensive; that is a reading of a roadmap, not a claim the vendor
makes. **Assumed:** that "general availability" here means all regions where
Cortex Analyst runs, which is Autopilot's stated availability rule but is not
restated for this specific capability.

---

### 3. A third independent paper reports what a governed semantic layer bought, and a third one does not say what it cost

**1. What it is.** **GROUND**, a framework that "constrains large language
model-generated SQL queries to approved business definitions before execution".
It binds user intent to governed metrics and dimensions through a semantic
retrieval layer, then validates the generated SQL against schema, metric, join,
grain, filter, security and cost rules, retrying when a rule is violated. Single
author: **Aravind Sasidharan Pillai**, Principal Architect for Data Engineering
at **Cox Automotive**.

The reported numbers are large. On a synthetic benchmark of 100 automotive
reporting questions: **95.1% value-based accuracy against 0.0% for the baselines**,
and **zero row-level security violations against 35-78%** for the ungoverned
systems. On real data - the US NHTSA vehicle-safety database, 271,718 complaints,
40 hand-authored gold queries plus 40 adversarial questions across four models -
**100% execution and 100% result accuracy**, with zero filter or security
violations. The price is **roughly 5× the token usage and 1.3× the latency** of
direct prompting.

Read those with the author's position in mind. A 0.0% baseline and a 100% result
on the author's own benchmark are the two numbers in this brief least likely to
reproduce under an independent harness, and nothing here has been reproduced.
The **security** figures are the durable part: a violation count is a property of
the enforcement layer rather than of the model, and it is checkable by anyone who
has the rules.

**And the semantic layer that made all of it possible is described and never
costed.** It "encompasses approved metrics, dimensions, join paths, filters, and
row-level security"; the appendix says the benchmark "defines 10 approved
metrics". There is no person-hour figure, no count of definitions authored for
the real NHTSA deployment, no curator role, no timeline, and nothing about
ongoing maintenance. **This is the second time this brief series has recorded
that absence, and the count is now three papers.** Round 3 found it in QUVI
("curated") and in SPC; it is here too, from a different author, a different
company and a different domain.

**2. How long ago.** **2026-07-06**, eleven weeks ago. Inside the 90-day window
this topic gets on its first run.

**3. How it relates to what has already been read.** It is the third member of
the family round 3's items 5 and 6 opened - constrain the model to a governed
intermediate, compile deterministically, measure the result. It is also the first
of the three to make **security violations** a headline metric rather than
accuracy, which is a closer relative of #29's ERPBench (85% save-vs-3%-correct)
and round 3's WarehouseReliabilityBench (0.754 → 0.351) than of any leaderboard.

**4. What through-line it changes.** None on its own, and that is the finding.
Three papers, three teams, one convention: report what the layer bought, never
what it cost. A through-line that survives its third independent confirmation is
no longer a suspicion about one report.

**5. What to research next.**
- Whether the 10 approved metrics are published, which would make the layer's
  size checkable and turn "reported by nobody" into "reported by nobody, but
  reconstructible for one".
- Whether any of the three systems has been run against a layer it did not
  author. Every one of them built the semantic layer and then measured itself on
  it, and that is the design flaw the cost question is really pointing at.

**6. Source.** [Pillai, "GROUND: Reducing Hallucinations in LLM-Based Enterprise
Analytics Through Governed Semantic
Definitions"](https://arxiv.org/html/2608.26157v1), arXiv:2608.26157v1. Reached by
**open search**; `arxiv.org` is on `sources.md`, and as in every previous round it
was reached by searching rather than by browsing the list. **Full page read** of
the HTML full text, per the preference for full pages over abstracts - the
appendix's "defines 10 approved metrics" and the absence of any effort figure are
both findings that only a full read can support. The **2026-07-06** submission
date was confirmed against the abstract page's submission history, because the
identifier and the date do not agree and the date is what the window turns on.

**7. Verified / inferred / assumed.** **Verified:** the mechanism, the author and
affiliation, every number quoted above, the 10-metric appendix line, and the
submission date. **Verified as an absence, which is the item's point:** the full
text contains no person-hours, no definition count for the production deployment,
no curator role and no maintenance figure - a claim a full read can make and an
abstract cannot. **Inferred:** that a 0.0% baseline reflects an unusually strict
value-matching criterion rather than total baseline failure; the paper reports
the criterion and not that reading of it. **Assumed:** that the NHTSA evaluation
is independent of the synthetic one. Both appear in the same paper by the same
author, and nothing rules out the semantic layer having been tuned against both.

---

### 4. Snowflake's agentic shipping this quarter was governance and a cost meter, not analytics

**1. What it is.** The **Cortex AI Gateway**, announced as "the connective layer
for all trusted agent activity" and built on Natoma, a centralized MCP gateway
Snowflake integrated. It governs how agents - "both first-party tools (like
Snowflake CoCo and CoWork) and third-party ecosystems (such as Amazon Bedrock,
Azure AI Foundry, ChatGPT, Claude Code, Cursor, custom LangChain or LlamaIndex
apps, and others)" - "access models, data, MCP servers and enterprise tools".

What is actually shippable matters more than the announcement. **Generally
available:** Agent Identity, AI Risk Posture Understanding, Sensitive Data
Protection, strict data-movement policies, and ransomware protection via
multi-party approval. **Public preview:** the data-exfiltration-prevention
package; the Gateway itself is "public preview soon". **Private preview:** almost
everything a reader would care about - AI Cost Control, Observability and
Tracing, Agent Action Auditability, context-aware access policies, intelligent
model routing, third-party agent identity, and governed access across "100+ MCP
servers (including BYO and VPC connect)".

The cost line is the one to keep: the Gateway "gives IT and finance teams a
unified view of AI consumption, attributes costs to the teams, agents, or
workloads driving them, and enforces spending limits to help prevent runaway
costs before they occur." Snowflake's stated adoption base for this is "over
9,100 customers use Snowflake's AI products on a weekly basis".

**Neither the press release nor the engineering blog mentions semantic views or
semantic models once.** For a vendor whose analytics agents are documented as
running on semantic views, an entire agentic-governance launch that never names
the layer supplying the business meaning is a gap worth noticing.

**2. How long ago.** **2026-07-28**, eight weeks ago. Inside the 90-day window
this topic gets on its first run.

**3. How it relates to what has already been read.** It is the first item in any
of these briefs to cover a warehouse vendor's **own** agentic product line, which
is the whole reason this topic exists. It sits against #26's reading of the
analytics-agent market as a capability race: Snowflake's contribution to the
quarter is not a better agent, it is a place to stand between agents and data.

**4. What through-line it changes.** It opens one, and this brief's headline is
it: **the vendors are competing on control and cost attribution rather than on
accuracy.** Nothing in this launch claims an accuracy improvement, and nothing in
it is measured against a benchmark.

**5. What to research next.**
- Whether AI Cost Control leaving private preview produces any published
  per-query or per-agent cost figures - that would be the first vendor number
  comparable to DevRev's $0.57-per-correct-answer in item 6.
- Whether the Gateway's MCP governance covers **dbt's** remote MCP server, which
  would put one vendor's control plane in front of the other's semantic layer.

**6. Source.** [Snowflake, "Snowflake Advances the Trusted Agentic Enterprise Era
with Unified Monitoring and Cost
Management"](https://www.snowflake.com/en/news/press-releases/snowflake-advances-the-trusted-agentic-enterprise-era-with-unified-monitoring-and-cost-management/),
the press release, corroborated by
[the same day's engineering blog](https://www.snowflake.com/en/blog/enterprise-ai-security-agentic-mcp-governance/).
`snowflake.com` **is on `sources.md`** and was reached from the list; the specific
pages were located by search. **Full page read** of both.

**7. Verified / inferred / assumed.** **Verified:** every availability status
above, the Natoma integration, the third-party platform list, the cost-attribution
quote, the 9,100-customer figure, the 2026-07-28 date, and the absence of any
mention of semantic views in either page - both read in full. **Inferred:** that
private preview here means months from general availability; Snowflake gives a
date for exactly one item in the set (Okta integration, Q4 2026) and none for the
rest. **Assumed:** that "9,100 customers use Snowflake's AI products weekly" is a
count of customer accounts with any AI usage rather than of agentic usage
specifically - the release does not decompose it, and it is a vendor-reported
adoption figure with no definition attached.

---

### 5. dbt shipped its engine rewrite, and started metering its agent by the token

**1. What it is.** **dbt Summit 2026** and the release notes around it. The
headline is that **dbt v2.0 is generally available** - the single Rust engine
formerly called Fusion, now the default, with `pip install dbt` installing v2 and
`pip install dbt-core` reserved for v1. **dbt State** went GA alongside it,
skipping or cloning nodes whose logic and data have not changed.

The agentic half is where the interesting decision is. **dbt Wizard now bills on
usage, metered per token**, with a monthly included allowance and administrator
spend limits. **Explore mode** entered preview and lets read-only users ask
plain-language questions without a developer licence, which is the first time
dbt's agent is reachable by someone who does not build models. **Wizard Desktop**
is in private beta, **dbt Charts** in public beta, and AI features now **default
to enabled** on existing accounts as a behaviour change rather than an opt-in.

Two smaller entries from earlier in the window say more about the semantic layer
than anything at the Summit did. In **July**, dbt began writing an
`osi_document.json` artifact at parse time and added an `osi-paths` config, so a
dbt project now emits an Apache Ossie representation of its semantic models as a
build output - item 1, wired in. In **August**, Semantic Layer queries exceeding
a complexity of 200,000 changed from **warning to erroring**, which is a vendor
discovering that its semantic layer was being asked for things it could not
sustain.

**2. How long ago.** **2026-09-15 to 2026-09-18**, one week ago, with the two
supporting entries dated **July 2026** and **August 2026**. All inside the
90-day window.

**3. How it relates to what has already been read.** It is a development on
#26's item 2, the dbt Summit announcement read from `fivetran.com`, and on the
Agents Schema in it. What is new here is the shipping status rather than the
intent: #26 read the announcement, and this reads the release notes that say
which parts are GA. It also closes a loop with round 3's dbt items, which were
about dbt's benchmark rather than its product.

**4. What through-line it changes.** It confirms item 4's. dbt's contribution to
the window is an engine, a cache, a meter and a permission model. The agent got
cheaper to reach and more expensive to run, and no accuracy claim was attached to
any of it. **Per-token billing is the single most concrete thing either vendor
did about cost this quarter**, and it prices the inference side of the trade
while the modelling side stays unpriced - which is exactly the asymmetry round
3's counter-argument identified, now visible in a price list.

**5. What to research next.**
- What dbt Wizard's included monthly token allowance actually is, since that is
  the first real number on what a governed analytics agent costs to operate.
- Whether the `osi_document.json` artifact round-trips - can a semantic model
  exported from dbt be ingested by Snowflake's semantic views, and does it answer
  the same question the same way.

**6. Source.** [dbt Labs, "dbt release
notes"](https://docs.getdbt.com/docs/dbt-versions/dbt-cloud-release-notes).
`docs.getdbt.com` **is on `sources.md`** and was reached from the list. **Full
page read** of the release-notes page, which carries June through September 2026
in one document. The dbt v2 roadmap note in
[`dbt-labs/dbt`](https://raw.githubusercontent.com/dbt-labs/dbt/main/docs/roadmap/2026-06-announcing-v2.md)
was read in full as a backward-follow and confirms v2 was in **alpha** in June
with no GA date named, which is what makes the September GA a development.

**7. Verified / inferred / assumed.** **Verified:** dbt v2.0 and dbt State at GA,
the `pip install` naming change, Wizard's per-token billing with included usage
and spend limits, Explore mode in preview, Wizard Desktop private beta, dbt
Charts public beta, AI-features-default-on, the `osi_document.json` artifact and
`osi-paths` config in July, and the Semantic Layer complexity limit changing from
warn to error in August - all from the release notes read in full. **Verified:**
v2's June alpha status, from the roadmap document read in full. **Inferred:** the
**2026-09-15 to 2026-09-18** Summit dates, which came from search results rather
than from the release-notes page; the release notes group the announcements under
the Summit without printing the dates. **Inferred:** that the complexity limit
changing from warn to error indicates real load rather than a tidy-up - the note
states the change and not the reason. **Assumed:** that the release-notes page is
complete for the window. It is a vendor-maintained changelog and nothing
independent confirms nothing was omitted.

---

### 6. The enterprise-shaped benchmark the reader endorsed cannot be run by anyone outside the company that built it

**1. What it is.** **DevRev NL2SQL** - 900 execution-verified queries over a
production Snowflake schema - **has not been released, and will not be until the
paper is published.** The paper's own words: "The DevRev NL2SQL benchmark will be
released publicly upon publication." The plan is specific and credible - hosted
on Hugging Face under a permissive open-source licence, with all 900 queries and
their Semantic Depth Score annotations, schema documentation in m-schema format
for the 15 entity types used in generation, the scoring rubric and the LLM judge
prompt, and "a leaderboard for community submissions will accompany the release".
None of it exists yet.

**Round 3's other open question is answered too, and negatively: the Semantic
Depth Score has not been applied to Spider 2.0 or BIRD by anyone, including its
authors.** They reference Spider 2.0-Snow queries as source material for their
formula patterns and report SDS for their own benchmark only. SDS is a
seven-dimension rubric scored 0-5 each to a maximum of 35, covering eligibility
conditions, derived metrics, population scoping, multi-stage logic, output
precision, temporal precision and SQL construct diversity - a schema-agnostic
instrument, which is what makes it applicable to Spider and BIRD in principle and
what makes nobody having done it the finding.

**The paper does carry the one thing nothing else in this line does: money per
answer.** Cost per correctly answered query is **$0.57** for their system against
**$0.93** for ReFoRCE, **$4.60** for APEX-SQL and **$15.35** for FlexSQL, with a
median of 108K input-plus-output tokens against 56K-1,183K for the baselines. A
27× spread in the price of a correct answer is a larger practical difference than
most of the accuracy gaps these briefs have reported, and it is the only place
any of them has been able to quote one.

**And the modelling cost is missing here too.** The schema documentation, the
m-schema files and the semantic metadata are all described; the effort to produce
them is not, in person-hours or any other unit. That is the fourth instance in
this round.

**2. How long ago.** **2026-09-04**, nineteen days ago. Inside the 30-day window
this topic gets on its second run.

**3. How it relates to what has already been read.** It is a development on round
3's item 3, and it is the item the reader endorsed the premise of - that Spider
and BIRD measure against a schema shape enterprises do not have. The premise
survives. What changes is the instrument's status: an unreleased benchmark with a
91.7% score on it, reported by the company that built both, is a result about a
product and not yet a measurement anybody else can make.

**4. What through-line it changes.** It qualifies the through-line the reader
just adopted. Enterprise-shaped schemas being preferred over the academic sets is
a preference about what should be measured; DevRev is currently the best argument
for it and not yet a way to act on it. **ESQ-Bench, which is released, would have
been the alternative and is out of window - see what was dropped.**

**5. What to research next.**
- Whether the paper has been accepted anywhere, since publication is the trigger
  for release and there is otherwise no date to watch.
- Whether anyone scores SDS on Spider 2.0-Snow. It needs only the rubric and the
  judge prompt, both of which the paper describes, and it would test the
  enterprise-shape claim directly rather than by assertion.

**6. Source.** [Varadharajan et al., "A Cost-Aware Agentic Architecture for
NL-to-SQL over Nested Enterprise Schemas, with a New
Benchmark"](https://arxiv.org/html/2609.04641v1), arXiv:2609.04641v1. Reached by
**open search**; `arxiv.org` is on `sources.md`. **Full page read** of the HTML
full text - the release statement, the SDS scope and the cost table are all body
content, and none of the three is visible from the abstract.

**7. Verified / inferred / assumed.** **Verified:** the release statement quoted
verbatim, the Hugging Face and licence plan, the leaderboard promise, the SDS
definition and its seven dimensions, that SDS was applied only to DevRev's own
benchmark, all four cost-per-correct-answer figures, the token medians, and the
2026-09-04 date - all read in full. **Verified as an absence:** no effort or
person-hour figure for the schema documentation or semantic metadata. **Inferred:**
that "upon publication" means a peer-reviewed venue rather than the arXiv posting
that already happened; the phrase is not defined and the arXiv reading would make
the sentence false on its own terms. **Assumed:** that the four cost figures were
measured under comparable conditions and pricing. The paper reports them in one
table as a comparison, and three of the four systems are competitors it
implemented or configured itself.

---

## What was dropped, and why

**The near-misses in this round are unusually painful, because two of the three
would have answered the central question.**

- **"Semantic Layers for Reliable LLM-Powered Data Analytics" (Rumiantsau and
  Fokeev, arXiv:2604.25149), submitted 2026-04-28** - out of the 90-day window by
  eight weeks. It is the closest anything has come to costing a semantic layer:
  the thing that produced a +17 to +23 point accuracy gain across three frontier
  models was "a 4 KB hand-authored markdown document describing the dataset's
  measures, conventions, and disambiguation rules". Four kilobytes is a **size**,
  not an effort, so even this would not have closed the question - but it is the
  only paper that has said how big the artifact was. Worth re-reading in full if
  this topic ever gets a 90-day window again.
- **"Bootstrapping Semantic Layer from Execution for Text-to-SQL" (Lee, Kim and
  Hwang, arXiv:2606.05634), submitted 2026-06-04** - out of window by 21 days,
  which is the tightest miss in any of these briefs. It is the direct attack on
  the cost question from the research side: infer the groundings from execution
  feedback rather than specifying them in advance, on the grounds that written
  specifications "are often incomplete, especially in expert domains where
  domain-specific conventions are under-documented". It does not benchmark against
  a hand-authored layer, so it would not have supplied a cost number either.
- **ESQ-Bench (Mishra, Chukkapalli and Naik, arXiv:2608.23569), submitted
  2026-06-12** - out of the benchmarks window by ten weeks. A released Oracle-first
  enterprise benchmark, 550 pairs over 465 tables in tiers of 10, 48-52 and
  168-177 tables, where execution match falls 87.4% → 68.7% for the best model
  across the tiers. It is the strongest available evidence for the premise the
  reader endorsed and it is simply too old for this round. **If the reader wants
  the enterprise-shape claim tested rather than asserted, this is the thing to
  ask for a window for.**
- **"Evaluating Enterprise Analytics Agents: An End-to-End, Trace-Backed
  Methodology" (arXiv:2609.09182)** - in date, but it serves `agent-efficacy`,
  which this round puts out of scope, rather than any of the four subjects.
- **dbt Labs' "Cost Optimization Results and Agentic AI Features" release
  (2025-10-14)** and **Snowflake's Intelligence and Cortex Code expansion
  (2026-04-21)** - both are the vendor announcements this topic exists to cover
  and both are far outside the window. The second is where CoWork and CoCo were
  named, which items 4 and 5 both reference without re-reporting.
- The semantic-layer buyer's guides, tool comparisons and vendor listicles that
  dominate a search for what a semantic layer costs. Several carry price ranges
  ("$50-100k/year and a multi-month modeling effort" for one BI tool), all of it
  uncited and from vendors selling an alternative. Dropped on substance, not date.

---

## What was searched for and not found

- **Any published figure for what building a semantic layer costs.** Searched
  across a 90-day window for person-hours, authoring effort, curation burden,
  annotation cost and maintenance overhead, against the research literature, both
  vendors' documentation and the trade press. **Nothing.** Three papers report
  what the layer bought and none reports what it cost; the two vendors both
  shipped products premised on the cost being high and neither published the
  number. **This is the second time this brief series has recorded this absence
  and the first time it has been recorded after a search aimed at it.** Round 3
  found it as a by-product of reading three papers; this round went looking and
  the answer did not change.
- **Who curates the layer, in any of the systems measured.** The closest thing to
  an answer is a warning rather than a description: round 3's QUVI paper observes
  that curating a semantic layer against an evaluation set is a **Goodhart-style
  risk**, where descriptions "drift from concise, generalizable annotations toward
  verbose text that effectively encodes the expected answer for known questions",
  raising benchmark accuracy while reducing robustness to unseen questions. Its
  recommendation is to treat the layer as code subject to review. Nobody says who
  does that review, or how long it takes.
- **Any development on Spider 2.0-AIFunc dated after 2026-08-24.** Checked
  against the `xlang-ai/Spider2` README's News list (last entry 2026-08-12), the
  Spider 2.0 leaderboard site (three tracks, no AIFunc), and open search. Nothing.
- **An AIFunc leaderboard, or any Spider 2.0-Snow leaderboard system scored on
  AIFunc.** Neither exists.
- **The August `dbt-llm-sl-bench` numbers, from the repository's results data.**
  Still not obtainable, and the reason is now precise rather than a shrug. The
  README confirms the three strategies - `sql`, `semantic_layer` and `mcp` - and
  confirms an August 2026 re-run "adding newer Claude and GPT models with
  thinking-effort sweeps". But the results are stored **only as binary database
  files** - `llm_bench.db` in the repository root and
  `results_analysis/llm_bench.duckdb` behind the dashboard. There is no CSV, no
  JSON and no results table in any readable file; the repository's markdown
  carries the dashboard's queries, not its output. **So whether the `mcp` strategy
  is now the best of the three remains unanswerable by reading**, and it will stay
  that way until either the dashboard renders or someone queries the database. The
  dashboard failed again, and this run can now say how precisely: its comparison
  page returns a shell whose Summary, Accuracy, Latency, Cost and Tradeoffs
  sections all read **"Loading..."**. It is a client-rendered page fetching the
  database in the browser, so no amount of re-fetching will ever produce figures.

---

## Recommendation

**Stop treating the missing cost number as a gap in the search and start treating
it as the finding.** Two rounds and a targeted 90-day hunt have produced the same
result from three papers, two vendors and a trade press that would love to quote
a figure. The next round should not go looking for it again. It should ask the
question that the absence actually poses: **every system measured so far built
the semantic layer it was then measured on.** That is the design flaw, and it is
checkable - one semantic layer, two engines, or one engine against a layer it did
not author. Apache Ossie (item 1) is the first thing that makes such an experiment
mechanically possible, and dbt's `osi_document.json` artifact (item 5) is the
first emitter.

**The strongest argument against this, which I went looking for:** the absence may
be an artifact of where I am reading rather than a fact about the field. Every
cost figure in this brief came from a vendor or a self-published paper, and the
places that would actually hold semantic-layer build costs - consulting
statements of work, implementation contracts, internal post-mortems - are not
web-reachable and never will be. The MIT CISR and MIT Sloan pieces on the
semantic layer, both out of window, are the genre where a survey-based number
would live, and I could not check either inside the window. So "nobody reports
it" is defensible and "nobody knows it" is not: it is entirely possible that
every company that has built one knows precisely what it cost, and that the
number is simply not published. That would make this a publishing-norm finding
rather than a knowledge finding, which is a weaker claim than the one above.

**What would flip it.** One paper reporting authoring effort in any unit;
one vendor publishing a coverage or accuracy figure for an auto-generated
semantic model against a hand-built one; or one system being scored on a semantic
layer somebody else authored. Any of the three turns this from an absence into a
measurement, and the last one turns the whole through-line over.
