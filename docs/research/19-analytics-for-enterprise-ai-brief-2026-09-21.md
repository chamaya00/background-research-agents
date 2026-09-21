# Brief: analytics for enterprise AI - 2026-09-21

**Produced by a research run**, not by a session. Per
[`docs/reader/loop.md`](../reader/loop.md) step 2, which asks for this line at
the top because a driver-written brief is not evidence that the pipeline works.
This is issue [#21](https://github.com/chamaya00/background-research-agents/issues/21)
under objective [#19](https://github.com/chamaya00/background-research-agents/issues/19).

This is the first brief. There is no previous one, so there is no baseline to
delta against, and the Knowledge section of
[`docs/reader/profile.md`](../reader/profile.md) is empty - every concept below
is treated as unfamiliar.

**Three items passed filtering. Three is the whole brief**; there is no fourth
being held back and nothing has been added to round the number up. The candidate
pool and every rejection are in [What was dropped](#what-was-dropped) so the
count can be argued with rather than trusted.

---

## Two stand-ins, both of which need a decision that is not mine

Named here rather than in a footnote, because both change what you are reading
and both are things a reaction could fix in one sentence.

**1. Sources.** The profile says *"Sources come from a curated list rather than
open search."* No such list exists anywhere in this repository - the only file
matching the shape is `fixtures/determinism/sources.fixture.yaml`, a test
fixture. So this brief used open WebSearch and WebFetch, which is the thing that
line was written to rule out. Every source below is named and dated so the list
can be built backwards from what actually earned its place. Building the list is
out of scope for this issue.

**2. The window.** The profile says *"what actually changed, not explainers"* but
does not say *changed since when*, and with no previous brief there is nothing to
subtract. I set the window at **the 30 days to 2026-09-21 (from 2026-08-22)** and
applied it to every candidate. That is an assumption, not a finding: it is the
single knob with the largest effect on what is below, and widening it to 90 days
would roughly triple the pool. [What a wider window would have
added](#what-a-wider-window-would-have-added) lists exactly what it lets in, so
"widen it" is a one-sentence reaction with a visible consequence.

Also worth a sentence before the items: the Interests line reads *"Analytics for
enterprise AI, broadly"*, and that phrase has two readings - **analytics products
that AI has changed**, and **the measurement of AI systems themselves**. I read
"broadly" as covering both and the three items below split 2/1 across them. If
only one of the two is wanted, saying so cuts the brief roughly in half and makes
the next one sharper.

---

## The items

### 1. OpenAI shipped a Data agent into ChatGPT Work

**What it is.** A first-party agent inside ChatGPT Work that connects to
warehouses and BI sources - Snowflake, Databricks, BigQuery, Redshift,
ClickHouse, MongoDB, Datadog among them - answers questions in natural language
without SQL, builds interactive dashboards, and can take follow-up actions after
user approval. It also pulls files from Google Drive and SharePoint into the same
analysis. OpenAI says its internal version has served 3,500+ users over ~600
petabytes and ~70,000 datasets; NTT Data, Thermo Fisher and ServiceTitan are
named as early customers.

**Source.**
[Unite.AI, "OpenAI Introduces Data Agent in ChatGPT Work to Analyze Company
Data"](https://www.unite.ai/openai-introduces-data-agent-in-chatgpt-work-to-analyze-company-data/),
which links the primary announcement at `openai.com/index/put-data-to-work`.
Corroborated by [BigDATAwire, "OpenAI Launches Data Agent as Enterprise Analytics
Race Heats Up"](https://www.hpcwire.com/bigdatawire/2026/09/11/openai-launches-data-agent-as-enterprise-analytics-race-heats-up/)
(2026-09-11) and a
[KuCoin newsflash](https://www.kucoin.com/news/flash/openai-launches-data-agent-for-enterprise-analysis-but-doesn-t-disclose-accuracy-benchmarks)
(2026-09-11).

**Date.** 2026-09-10.

**Why it was selected.** The profile's Interests line asks for *"what actually
changed, not explainers"*. A model vendor shipping a product that reads the
warehouse directly is a change in who supplies enterprise analytics, not a new
description of one - and it is the item most likely to be raised at you by
somebody else this week.

**The part worth knowing.** OpenAI published no accuracy benchmark with it. Every
competitor in this space leads with one - Snowflake's Cortex Sense claims 86% on
structured questions with full business context against 24% for a generic
frontier model, Databricks claims a 52%→84.5% move - so the absence is
conspicuous rather than neutral. Those competitor figures are themselves
vendor-run on undisclosed question sets, per
[PointFive's summit write-up](https://www.pointfive.co/blog/snowflake-and-databricks-summits-2026-what-actually-matters),
so the honest reading is that nobody in this category has published a number an
outsider can check. I looked for an independent evaluation of any of them and
found none.

---

### 2. Copilot Studio put a price tag on each agent evaluation

**What it is.** Microsoft 365 message centre item RM571195: agent evaluations in
Copilot Studio now show makers their consumption cost, itemised across three
things - generating the evaluation, executing the test run, and *model grading*.
General availability, rolling out through September 2026, no admin action
required.

Model grading is the technique where one model scores another model's output
against a rubric instead of a human doing it. It is how most agent evaluation
suites produce a number at all, and it is a per-run model call, which is why it
shows up as a line on a bill.

**Source.** [Microsoft 365 message centre RM571195, "Microsoft Copilot Studio:
Cost visibility in Agent Evaluations"](https://mc.merill.net/message/RM571195).

**Date.** 2026-09-15.

**Why it was selected.** The Format line asks for items whose selection is
*"traceable to a line in this file rather than asserted"*, and this one traces to
the Interests line on the measurement reading of "analytics for enterprise AI":
it is a change to what an enterprise can see about its own AI, not a change to
what the AI can do. Small, dull, and the kind of thing that only looks
significant once - the moment a team finds out what their eval suite costs per
run is the moment the suite starts getting smaller.

**The part worth knowing.** It lands against a measured gap. Harness's *2026
State of AI in FinOps* (700 engineering leaders, surveyed May-June 2026 by Sapio
Research) found 73% of organisations have AI cost policies but only 13% have
visibility into actual spend, 72% had an unexpected AI cost spike in the past
year, and just 26% have a robust way to measure the business value of AI spend
([press release](https://www.prnewswire.com/news-releases/new-harness-report-reveals-enterprise-ai-spend-has-outgrown-the-systems-built-to-track-it-302837776.html),
2026-07-29 - outside this brief's window, cited here as context rather than as an
item). One vendor itemising one workload is not that gap closing; it is the first
place it got measurable.

---

### 3. Fabric data agents got an iterative DAX sub-agent, in preview

**What it is.** Fabric data agents can now generate DAX against Power BI
semantic models iteratively rather than in one pass: a specialised sub-agent that
calls tools, inspects intermediate results and refines across several steps, plus
instance value indexing that resolves actual dimension values out of the model
before the query is written. Microsoft claims better accuracy and consistency and
lower latency, particularly for questions needing value resolution or multiple
reasoning steps. Preview runtime only - you switch Runtime from Standard to
Preview in the data agent ribbon. The orchestrator behind both runtimes now runs
on GPT-5.1.

**Source.** [Microsoft Fabric Updates blog, "Advanced DAX generation for semantic
models in Fabric data agents
(Preview)"](https://community.fabric.microsoft.com/blog/fbc_fabricupdatesblogs/advanced-dax-generation-for-semantic-models-in-fabric-data-agents-preview/5363136).
**Caveat on this one:** that page returned HTTP 403 to this run's fetcher, so the
description above is assembled from the search index's excerpt of that same page
plus a secondary weekly roundup,
[Gethyn Ellis, "Microsoft Data and AI News: Top 7 Stories This
Week"](https://www.gethynellis.com/2026/09/microsoft-data-ai-news-7-september-2026/).
I did not read the primary page directly.

**Date.** On or before 2026-09-07 (the roundup that carries it covers the week
ending that day; the primary page does not expose a date to this run).

**Why it was selected.** Same Interests line, product reading, and it is the
concrete version of what item 1 is the loud version of. "Natural language → a
correct metric" has always broken on ambiguous column names and dimension values
that differ between reports, and this is a named vendor fix aimed exactly there.
It is also the one item here that tells you *how* these systems are being made to
work rather than that they exist.

**The part worth knowing.** It is preview, behind a runtime toggle, and the
accuracy claim is again Microsoft's own with no published test set. Same pattern
as item 1 - which is the actual through-line of this brief and is stated in the
recommendation below rather than left for you to notice.

---

## What was dropped

The candidate pool was everything found in-window. These four passed the date
filter and were then excluded on subject, and each is a line you can overrule:

| Candidate | Date | Why it was dropped |
|---|---|---|
| Salesforce ships seven named Agentforce agents (Casey, Paige, Carter, Hunter, Marshall, Piper, Fin) | 2026-09-11 | An agent product line on a CRM data platform. Neither analytics nor the measurement of AI. Closest call in the set - see the comparison below, where one extra Interests line lets it in. |
| Power BI ODBC → ADBC connector migration, phased through 2027 | 2026-09 | Real analytics plumbing with a real deprecation date, but no AI content at all. It is a BI item, not an enterprise-AI one. |
| Dynamics 365 / Power Platform / Dataverse roadmaps merge into the AI at Work roadmap | 2026-08-25 | Administrative. Nothing changed about a product. |
| New Microsoft AI agent certifications (AB-620T00, AI-500T00, AB-6007) | 2026-09/10 | Training availability. The profile asks for what changed, and a course is not a change to the thing it teaches. |

And these were found, are on-subject, and were dropped **only** on the 30-day
window:

| Candidate | Date | Note |
|---|---|---|
| Harness *2026 State of AI in FinOps* (700 respondents) | 2026-07-29 | Cited above as context for item 2 rather than as an item. The most decision-relevant thing I read all run, and the window excludes it. |
| EU AI Act Article 50 transparency obligations enter force; the AI Omnibus (Reg. (EU) 2026/1744) pushes high-risk obligations - *including automatic logging* - to 2027-12-02 | 2026-08-02 (Omnibus in force 2026-07-27) | Directly relevant: automatic logging is instrumentation, and the deadline for it moved by more than a year. |
| Databricks CustomerLake (agentic CDP) | 2026-06-16 | |
| Snowflake Summit and Databricks Data+AI Summit: Cortex Sense, Horizon Context, Genie One, Unity Catalog Metrics, Agent Bricks | 2026-06 | The accuracy claims quoted in item 1 come from here. |
| Gartner Magic Quadrant for Analytics and BI Platforms | 2026-06-29 | Positions agentic analytics and governed semantic layers as baseline rather than differentiator. |
| Microsoft Build: Agent Skills for Power BI; Fabric data agents GA | 2026-06 | Item 3 is the September increment on top of this. |
| Amplitude agentic AI analytics (global agent, four specialised agents, MCP) | 2026-02-17 | |

### What a wider window would have added

At 90 days: the Harness FinOps report and the EU AI Act / AI Omnibus logging
delay, both of which I would rank above item 3. At 120 days: the June summit
cluster - Snowflake, Databricks, Microsoft Build, Gartner MQ - which is six more
items and would make this a survey rather than a brief.

My read: **90 days for the first brief, 30 after that.** The first one has no
predecessor to have already covered the older material, and every subsequent one
does. But this is a format preference and the profile owns it, so it is a
reaction, not my call.

## What I searched for and did not find

Recorded because an absence nobody can reconstruct reads as a gap in effort.

- **A curated source list in this repository.** Verified absent: `state/` does
  not exist (ADR 0003 decided not to create it) and the only `sources` file is
  `fixtures/determinism/sources.fixture.yaml`, a test fixture.
- **Any September 2026 change in the LLM observability / evaluation tooling
  market.** Searched twice with different vocabulary. Both searches returned
  almost nothing but vendor listicles - "10 LLM Observability Tools", "Top 7",
  "Best … for Product Managers" - which the Interests line excludes by name as
  explainers. This is a finding about the source list rather than about the
  market: the SEO layer over this topic is thick enough that open search cannot
  reach the primary announcements, which is an argument for the curated list the
  Format line already asks for.
- **A stable 1.0 of the OpenTelemetry GenAI semantic conventions.** Not found.
  As of mid-July 2026 every `gen_ai.*` attribute, span and metric in the registry
  still carries "Development"; the conventions moved into a dedicated
  `semantic-conventions-genai` repository in v1.42.0 on 2026-06-12 precisely so
  they could iterate below the core stability bar. Out of window, and the
  *absence* of a stable release is the fact worth carrying forward: the standard
  everything in item 2's category would be built on is not fixed yet.
- **An independent, third-party accuracy benchmark for any enterprise data
  agent.** None found for OpenAI, Snowflake, Databricks or Microsoft. Every
  figure in this brief is vendor-run.

---

## The two renderings the issue asked for

These exist to demonstrate that the two axes in
[`docs/reader/profile.md`](../reader/profile.md) do different things - Knowledge
changes wording only, Interests gates selection - because conflating them is the
failure [`docs/research/3-state-and-source-schema.md`](3-state-and-source-schema.md)
was written to prevent, and the failure
[#6](https://github.com/chamaya00/background-research-agents/issues/6) was sent
back for.

### A. Knowledge changes one item's wording and nothing else

Hypothetical added line, under **Knowledge** only:

```
- `llm-as-judge` - familiar; reference it, do not define it.
  *Hypothetical, for the comparison in this brief.*
```

The pool, the selection, the order and items 1 and 3 are **identical** between
the two renderings. Item 2's body is the only text that moves.

**As rendered now (Knowledge empty - `llm-as-judge` unfamiliar, so explained
once):**

> Microsoft 365 message centre item RM571195: agent evaluations in Copilot Studio
> now show makers their consumption cost, itemised across three things -
> generating the evaluation, executing the test run, and *model grading*. General
> availability, rolling out through September 2026, no admin action required.
>
> Model grading is the technique where one model scores another model's output
> against a rubric instead of a human doing it. It is how most agent evaluation
> suites produce a number at all, and it is a per-run model call, which is why it
> shows up as a line on a bill.

**As it would render with that Knowledge line (familiar - referenced in
passing):**

> Microsoft 365 message centre item RM571195: agent evaluations in Copilot Studio
> now show makers their consumption cost, itemised across three things -
> generating the evaluation, executing the test run, and the LLM-as-judge grading
> pass. General availability, rolling out through September 2026, no admin action
> required.

What changed: the second paragraph - the definition - is gone, and the phrase
"model grading" becomes "the LLM-as-judge grading pass", naming the concept
instead of unpacking it. What did not change: the item is still here, still
second, and items 1 and 3 are untouched to the character. That is the whole of
what Knowledge is permitted to do. Note that the *delta* - that the grading pass
is now separately priced - survives in both, per the Format line *"a concept
recorded under Knowledge is reported as a delta, never re-introduced"*.

### B. Interests changes what is in the brief at all

Hypothetical added line, under **Interests**:

```
- The agent control plane at the big enterprise suites - which agents ship
  named and pre-scoped, and what that implies for what can be measured about
  them. *Hypothetical, for the comparison in this brief.*
```

Same fixed pool, same 30-day window. **Selection changes:**

| Candidate | Now | With the added Interests line |
|---|---|---|
| OpenAI Data agent | in | in |
| Copilot Studio evaluation cost visibility | in | in |
| Fabric data agents DAX sub-agent | in | in |
| **Salesforce ships seven named Agentforce agents** (2026-09-11) | **out** | **in** |

A four-item brief instead of three. The Agentforce item is currently dropped
because seven named CRM agents are an agent product, not analytics and not
measurement; the added line makes "which agents ship pre-scoped" a subject in its
own right, and the item clears on subject rather than on wording. Nothing about
how it would be *worded* changed - it was excluded, and now it is not.

The contrast with comparison A is the point: no phrasing of a Knowledge line
could have pulled that item in, and no phrasing of an Interests line changes how
item 2 explains model grading.

---

## Recommendation, the argument against it, and what would flip it

**The through-line, if you read nothing else:** the enterprise data-agent
category now has four serious vendors and zero checkable accuracy numbers.
OpenAI shipped without one; Snowflake, Databricks and Microsoft all publish one
and all of them are vendor-run on undisclosed question sets. If you are going to
be asked to have an opinion about these products, the useful question is not
which is best but what anyone would accept as evidence.

**The strongest argument against that framing**, which I went looking for rather
than imagined: it is the complaint that gets made about every new software
category in its first two years, and it was made about BI dashboards, about
search relevance, and about RAG, none of which ended up gated on a public
benchmark. Buyers ran their own questions against their own data and decided. If
that happens here, "nobody published a number" will read in a year as a thing
commentators said while the market settled on private evaluation - which is what
item 2 is infrastructure for, and is a reason to weight item 2 more heavily than
its size suggests.

**What would flip it:** a third-party evaluation with a published question set
that more than one of these vendors agrees to be scored on, or a regulator making
logging and evaluation records mandatory - the EU AI Act's automatic-logging
obligation was pointed at that and has just moved to 2027-12-02, which is the
single most load-bearing date in this brief and is outside its window.

## Verified, inferred, assumed

- **Verified** (read in the source, quotable): every date, product name, number
  and status attributed to a link above, with the one exception noted in item 3,
  where the primary page 403'd and the content came from that page's search
  excerpt plus a secondary.
- **Inferred**: that item 2's cost line will shrink eval suites rather than
  budgets - reasoned from the Harness finding that 73% have policies and 13% have
  visibility, not observed anywhere.
- **Assumed**, and load-bearing: the 30-day window; that "analytics for
  enterprise AI, broadly" covers both AI-in-analytics and the measurement of AI;
  and that open search is an acceptable stand-in for the curated list the Format
  line requires. All three are the reader's to correct, and correcting any of
  them changes what next week's brief contains.

## This brief's relationship to `src/`

`src/` was not run and not touched. See
[ADR 0003](../decisions/0003-reader-profile-lives-in-docs.md), "Consequence,
settled by #19", for why.
