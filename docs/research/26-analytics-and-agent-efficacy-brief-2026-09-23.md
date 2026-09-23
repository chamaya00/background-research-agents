# Brief: analytics for enterprise AI, and measuring agent efficacy - 2026-09-23

**Produced by a research run**, not by a session. Per
[`docs/reader/loop.md`](../reader/loop.md) step 2, round 2. This is issue
[#26](https://github.com/chamaya00/background-research-agents/issues/26) under
objective [#19](https://github.com/chamaya00/background-research-agents/issues/19).

The previous brief is
[#24](https://github.com/chamaya00/background-research-agents/issues/24), written
up as
[`docs/research/19-analytics-for-enterprise-ai-brief-2026-09-21.md`](19-analytics-for-enterprise-ai-brief-2026-09-21.md).
Its three items - OpenAI's Data agent in ChatGPT Work, Copilot Studio's
evaluation cost visibility, and the iterative DAX sub-agent in Fabric data
agents - are covered ground here. None is re-reported. Two items below are
**developments on** one of them and say which one and what moved.

**Five items passed filtering.** Two serve the established subject, three serve
the new one. That split is the window rule working and is the most argue-withable
thing in this document; it is unpacked in
[The two windows](#the-two-windows-and-what-each-one-let-through) rather than
buried. The candidate pool and every rejection are in
[What was dropped](#what-was-dropped).

Knowledge in [`docs/reader/profile.md`](../reader/profile.md) is still empty, so
every concept below is treated as unfamiliar and explained once.

---

## The two windows, and what each one let through

The profile now carries a Window rule that did not exist when #24 was written:
**90 days for a subject's first appearance in a brief, 30 days after that**, per
*subject*. Resolved against today, 2026-09-23:

| Interests line | Appeared in a brief before? | Window | Cutoff date | Items below |
|---|---|---|---|---|
| Analytics for enterprise AI, broadly | Yes - #24 | **30 days** | **2026-08-24** | 2 (items 1, 2) |
| Measuring agent efficacy in an enterprise setting | No | **90 days** | **2026-06-25** | 3 (items 3, 4, 5) |

Every item states its line and its cutoff, so a date can be checked against the
right one without arithmetic.

**The asymmetry is not an accident and it is not padding.** At 30 days for both
subjects this brief would have had three items, not five. Of the three efficacy
items, the ones dated 2026-08-22 and 2026-08-19 fall two and five days the wrong
side of 2026-08-24 and would have been excluded; the third, dated 2026-09-15,
clears a 30-day window comfortably and is here because of its subject, not
because of its window.

So the 90-day first pass admitted **two** items that 30 days would have kept out.
That is real work on its first outing, which is the argument #21 made for it, now
visible rather than predicted - but it is a smaller result than the 2-vs-3 split
suggests on its own, and the split should not be read as the window's doing. The
larger share of what is new here comes from the new *subject* rather than the new
*window*: adding the Interests line is what put three items in scope at all, and
only two of those three needed the extra sixty days to get in.

**One judgement call you should know about, because it changes the brief.** Items
3 and 5 touch both Interests lines. I assigned each to the efficacy line, which
gives them the 90-day window; under the analytics line's 30-day window both would
have been excluded on date. I think the assignment is right on subject - one is a
benchmark leaderboard, the other is an evaluation tooling release, and "evals,
benchmarks, and what an enterprise accepts as evidence" is the line that names
them - but a reader who disagrees should say so, because saying so drops two of
five items. It is flagged again inline on each.

**"Analytics for enterprise AI, broadly" is read as covering both meanings** -
analytics products AI has changed, and the measurement of AI systems - because
the reaction to #24 settled that explicitly. #21 raised it as an open question;
it is closed and this run did not re-open it.

**Sources are still open search.** The Format line says *"Sources come from a
curated list rather than open search"*, no such list exists in this repository,
and building one is out of scope for this issue. So this brief used WebSearch and
WebFetch, exactly as #21 did, and every host it touched is tabled in
[What the network reached](#what-the-network-reached-and-what-refused-it).

---

## The items

### 1. Salesforce put agent cost and performance behind one control plane, across vendors

**Serves:** *Analytics for enterprise AI, broadly* - the measurement reading.
**Window applied:** 30 days, to 2026-08-24. **Date:** 2026-09-11.

**What it is.** At Dreamforce (San Francisco, week of 2026-09-10, ~43,000
attendees) Salesforce announced **Enterprise AI Harness**: a consolidation of six
existing products - MuleSoft Agent Fabric, Informatica, Data 360 and three others
- into one layer that governs AI agents *including agents and models from other
vendors*. The part that matters here is the **AI Control Plane**, which TechTarget
describes as giving "visibility into what agents are doing, how they are
performing and the costs they are incurring." Available now, with further
capabilities from February 2027.

A *control plane*, in this sense, is the layer that decides and records what an
agent is allowed to reach and what it did, separately from the agent doing it -
the same split as between a network's routing decisions and its traffic.

**Sources.**
[TechTarget, "Salesforce Enterprise AI Harness latest salvo aimed at
ServiceNow"](https://www.techtarget.com/it-strategy/news/366650256/Salesforce-Enterprise-AI-Harness-latest-salvo-aimed-at-ServiceNow)
(2026-09-11, read). Context on the surrounding announcements from
[Salesforce's own AIforce
story](https://www.salesforce.com/news/stories/aiforce-announcement/)
(2026-09-15, read) and a
[Dreamforce roundup](https://cxfoundation.com/news/dreamforce-announcements-2026)
(2026-09-15, read).

**Why it was selected.** The Interests line asks for *"what actually changed, not
explainers"*, on the measurement reading of "analytics for enterprise AI". What
changed is that cross-vendor agent performance and cost became a product surface
somebody sells, rather than a thing each team builds.

**The part worth knowing, from following it backwards.** Agent Fabric is not new -
[Salesforce announced it on
2025-09-25](https://www.salesforce.com/news/stories/mulesoft-agent-fabric-announcement/)
(read), and its observability was the **Agent Visualizer**, "a dynamic map of
their agent ecosystem, showing how agents connect, interact, and perform". That
page mentions no cost monitoring and no performance scorecard. So the increment in
2026-09 is the *cost* dimension and the cross-vendor scope, not observability as
such. That is worth holding onto, because it is the same increment Microsoft
shipped three weeks earlier in #24's item 2 - two vendors, one month, both
deciding that the number a buyer wants next to "did the agent work" is "what did
it cost". This item does not move #24's item 2; it is the second instance of the
pattern that item was the first instance of.

**What I could not check.** No skeptical analyst is quoted in the TechTarget
piece, and I did not find one elsewhere. The MuleSoft blog that would carry the
vendor's own framing,
`blogs.mulesoft.com/news/welcome-to-dreamforce-2026-turning-ai-ambition-into-measurable-roi-with-agent-fabric/`,
returned HTTP 403 to this run, so the "measurable ROI" claim in its title is not
something I have read the substance of.

---

### 2. Fivetran + dbt Labs shipped an open schema for the context agents read

**Serves:** *Analytics for enterprise AI, broadly* - the products reading.
**Window applied:** 30 days, to 2026-08-24. **Date:** 2026-09-16.

**What it is.** At dbt Summit 2026 the merged Fivetran + dbt Labs announced
**dbt v2** (a full Rust rewrite of the engine, parsing a 10,000-model project up
to 10x faster than v1) and **dbt State** at general availability, plus the
**Fivetran Context Layer** in private beta. The Context Layer unifies structured
dbt context with unstructured knowledge - docs, Slack threads - and exposes it
through **Agents Schema**, an open-source standard that keeps that context in the
data warehouse itself, reachable over MCP. Also announced: **dbt Charts** (public
beta, governed BI next to the models) and **dbt Wizard** in public preview.

MCP - Model Context Protocol - is the open interface a model uses to call tools
and pull context from a system it was not trained on; it is how "the warehouse"
becomes something an agent can query rather than something a vendor has to
integrate one product at a time.

**Source.** [Fivetran press release, "Fivetran + dbt Labs Announces New
Capabilities to Make Enterprise Data Agent-Ready at dbt Summit
2026"](https://www.fivetran.com/press/fivetran-dbt-labs-announces-new-capabilities-to-make-enterprise-data-agent-ready-at-dbt-summit-2026)
(read).

**Why it was selected.** Same Interests line, products reading, and the same test
- *what actually changed*. An open, in-warehouse schema for agent context is a
change to where the answer to "what does 'revenue' mean here" lives. Every item
in #24 was a vendor putting an agent **on top of** the warehouse; this is the
layer underneath all of them being standardised by someone who sells neither
agent nor warehouse.

**The part worth knowing.** Every number in the release is a *cost or speed*
number - RxBenefits at 59% off scheduled-job warehouse cost, $8,173.23 in 60
days; Virgin Media O2 at 25% off job run time; 10x parse speed. There is no
accuracy number anywhere in it, for the Context Layer or for Wizard. That is the
same absence #24 found across OpenAI, Snowflake, Databricks and Microsoft, now
one layer further down the stack: the context layer is sold on the premise that
better context makes agents more correct, and it ships without a measurement of
that. Note also that the thing most load-bearing for the claim - the Context
Layer - is the one piece in **private beta**, while what reached GA is the
engine rewrite.

---

### 3. An enterprise data agent now has a third-party-scored accuracy number - and it moves #24's item 1

**Serves:** *Measuring agent efficacy in an enterprise setting*. **Window
applied:** 90 days, to 2026-06-25. **Date:** 2026-08-22 (leaderboard submission),
still top of the board when I read it on 2026-09-23.

**Moves #24's item 1.** #24's through-line was that "the enterprise data-agent
category now has four serious vendors and zero checkable accuracy numbers", and
its last searched-and-not-found entry was *"an independent, third-party accuracy
benchmark for any enterprise data agent"*. That is no longer strictly true, and
the way it stopped being true is more interesting than the fact.

**What it is.** Huawei 2012 Labs' **DataGallery-Text2SQL** sits first on the
**BIRD** benchmark's public leaderboard for execution accuracy, at **82.39%**,
submitted 2026-08-22. BIRD is 95 databases and 12,751 question-SQL pairs across
37 domains, built specifically around the things that break text-to-SQL in real
estates - large and dirty values, external knowledge, query efficiency. The test
set is held out: you send a submission to the benchmark's maintainers and they
score it, which is the property that makes the number checkable by somebody other
than the vendor.

The human baseline on the same benchmark is **92.96%**, measured with data
engineers and database students. So the best published system is roughly ten
points below a competent person.

**Sources.** [BIRD benchmark leaderboard](https://bird-bench.github.io/) (read -
the 82.39%, the 2026-08-22 submission date, the held-out scoring procedure and
the 92.96% human baseline all come from that page). The trade-press write-up that
surfaced it, [Technology Magazine, "Huawei DataGallery Tops Benchmark for
Enterprise Text2SQL
AI"](https://technologymagazine.com/news/huawei-datagallery-tops-benchmark-for-enterprise-text2sql-ai)
(reported 2026-09-09), **returned HTTP 403 and I did not read it**; so did its
sister title `aimagazine.com`. Nothing in this item depends on either - the
figures are from the leaderboard itself.

**Why it was selected.** The new Interests line asks for *"evals, benchmarks, and
what an enterprise accepts as evidence that a deployed agent works"*. This is the
clearest instance available of the first two, and the gap between it and the next
item is the clearest instance of the third.

**Why the window assignment matters here.** 2026-08-22 is two days outside the
analytics line's 30-day cutoff of 2026-08-24. Under the efficacy line's 90-day
window it is comfortably in. I put it under the efficacy line because it is a
benchmark result, not a product release - but it does develop an analytics-line
item from #24, and if you read that as making it an analytics-line item, it drops
out of this brief on date. That is a one-sentence reaction with a visible
consequence.

**The argument against reading this as the gap closing**, which I went looking
for: BIRD is a *benchmark* score, not a deployment result, and #21's own dropped
material already contains the counter-evidence - Spider 2.0, the harder
enterprise-shaped benchmark, had a best execution accuracy of 31%, and the
broader finding in this space is a **37% gap between lab benchmark scores and
real-world deployment performance** (reported by
[Morph](https://www.morphllm.com/ai-agent-evaluation), a vendor page and the
weakest source cited in this brief - I did not find a primary for that figure and
you should treat it as indicative only). A checkable number on a public
leaderboard is not the same object as evidence that a deployed agent works, and
item 4 is what happens when somebody tries to measure the second thing.

---

### 4. ERPBench scored agents against the database instead of the screen, and the result is brutal

**Serves:** *Measuring agent efficacy in an enterprise setting*. **Window
applied:** 90 days, to 2026-06-25. **Date:** 2026-09-15.

**What it is.** A benchmark for computer-use agents driving live ERP systems -
the software an enterprise runs finance and operations on. Its design choice is
the whole point: it scores an agent **against the values actually written to the
database**, not against what the screen appeared to show. The paper also
describes a production-grade harness that requires human approval before an agent
action executes.

*Computer-use agent* means an agent that drives a normal graphical application by
looking at the screen and clicking, rather than through an API.

The headline result, across six agents: **some agents save in up to 85% of runs
but write the correct value in as few as 3%.** The agent completes the workflow,
the UI confirms it, and the record is wrong.

**Source.** [Bhagtani, Sridhar, Baran Pouyan, Zhao and Siow, "ERPBench: A
State-Grounded Evaluation Paradigm for Computer-Use Agents in Enterprise
Software", arXiv:2609.17885](https://arxiv.org/abs/2609.17885) (read, submitted
2026-09-15).

**Why it was selected.** Same new Interests line, and it is the sharpest available
answer to its third clause - *what an enterprise accepts as evidence that a
deployed agent works*. An 85%-vs-3% spread says that the evidence most evaluation
harnesses collect, which is whether the task appeared to complete, is capable of
being almost entirely wrong. That is a finding about measurement methodology, not
about any one agent.

**Where it sits against item 3.** These two are the brief's real pair. Item 3 is
the category getting a number an outsider can check; item 4 is a demonstration
that the number you check depends entirely on where you read it from, and that
the cheap place to read it from - the interface - can be off by more than 80
points. Read together they say the useful question has moved from "is there a
benchmark" to "is the benchmark grounded in state".

**The argument against it.** It is a preprint, six agents, one task family, from
authors I could not identify an institutional affiliation for from the abstract
page alone, and I found no independent replication or critique of it - it is nine
days old. Treat the 85%/3% figure as a claim I read in the source rather than as
a settled result. It is load-bearing for the framing above, so if it does not
survive review, the framing weakens with it.

---

### 5. Copilot Studio's evaluations became diagnosable, not just priced - and that moves #24's item 2

**Serves:** *Measuring agent efficacy in an enterprise setting*. **Window
applied:** 90 days, to 2026-06-25. **Date:** 2026-08-19 (published), general
availability September CY2026.

**Moves #24's item 2.** #24 reported RM571195, which put a *cost* on each agent
evaluation. This is **RM569607**, published four weeks earlier and reaching GA in
the same month, which changes what an evaluation *tells you*. #24 had the price;
this is the product. What moved: an evaluation went from a score to a trace.

**What it is.** Agent evaluations in Copilot Studio gain seven things: richer
evaluation explanations, **agent reasoning traces**, cited knowledge sources,
**evaluation run comparison**, support for larger datasets, customisable test
generation, and dataset generation from existing knowledge sources. Plus
pre-run validation to catch configuration errors.

Two of those are the substantive ones. A *reasoning trace* is the recorded
sequence of steps and tool calls an agent took, as opposed to only its final
answer - it is what turns "this eval failed" into "it failed at step four, on the
wrong document". *Run comparison* is what makes a change measurable at all:
without it you have a score per run and no way to attribute a move to an edit.

**Source.** [Microsoft 365 message centre RM569607, "Microsoft Copilot Studio:
Improvements to agent evaluations experience"](https://mc.merill.net/message/RM569607)
(read).

**Why it was selected.** The new Interests line, on *evals*. And it is the
counterweight to item 3: the direction enterprise measurement is actually moving
is not toward a public benchmark, it is toward private eval suites with traces
and run-over-run comparison, run by the team that owns the agent.

**Why the window assignment matters here too.** Published 2026-08-19, five days
outside the analytics line's 30-day cutoff. It is in this brief under the efficacy
line's 90-day window. Same reaction available as on item 3, same consequence.

**The part worth knowing.** Put RM569607 and RM571195 side by side and Microsoft
has, within one month, made evaluations both more informative and visibly more
expensive - traces and larger datasets and run comparison all cost model calls,
and the sibling message itemises what that costs, including the model-grading
pass. Those two ship together. The thing that gets measured next is the eval
budget.

---

## What was dropped

The candidate pool was everything found in-window across both subjects. These
were on-subject and excluded on **date**, against the window that applied to their
subject:

| Candidate | Date | Subject / window | Why dropped |
|---|---|---|---|
| Snowflake Semantic View Autopilot GA - automated creation and governance of semantic views for agents | 2026-02-03 | Analytics / 30d | Seven months out. Directly relevant to item 2's subject matter; a 90-day window would not have let it in either. |
| Tableau Agentic Analytics Platform, Knowledge Engine, Tableau MCP into Gemini Enterprise | 2026-05-05 | Analytics / 30d | Out of window. The Dreamforce coverage in item 1 restates it, which is why item 1 is scoped to the Harness and the control plane rather than to Tableau. |
| NIST CAISI **AI Agent Standards Initiative** - three pillars including evaluation methodology for agent interoperability | 2026-02-17 | Efficacy / 90d | Out of window by five months. The most consequential thing in this space long-term and I could find no update to it inside 90 days - see the not-found list below. |
| KDD Workshop on Evaluation and Trustworthiness of Agentic AI, Jeju | 2026-08-09 | Efficacy / 90d | In window, dropped on substance: a workshop happening is not a finding. Worth watching for its proceedings. |
| Harness *2026 State of AI in FinOps* (73% have AI cost policies, 13% have spend visibility) | 2026-07-29 | Efficacy / 90d | **In window under the new line**, and #24 cited it as context. Dropped to avoid re-serving the reader something last brief already quoted at them. If you would rather have it as an item, say so. |

Excluded on **subject** rather than date:

| Candidate | Date | Why dropped |
|---|---|---|
| Salesforce AIforce / Claudeforce / Slackforce; Agentforce Coworker at 100,000 users in 35 days; Koa reasoning model | 2026-09-15 | Interface and model announcements. Neither analytics nor the measurement of AI. Item 1 takes the one piece of the Dreamforce set that is about measurement and leaves the rest. |
| Salesforce product renaming - reverting from "Agentforce" branding to Sales Cloud, Service Cloud etc. | 2026-09-15 | Nothing changed about a product. |
| Vendor listicles: "AI Agent Benchmarks: The 2026 Enterprise Evaluation Guide", "AI Agent Evaluation Framework: 2026 Enterprise Guide", "Enterprise AI ROI Playbook", and roughly a dozen more | 2026 | Explainers, which the Interests line excludes by name. Their volume is itself a finding - see below. |

---

## What I searched for and did not find

Recorded because an absence nobody can reconstruct reads as a gap in effort
rather than as a result.

- **Any update to the NIST CAISI AI Agent Standards Initiative inside 90 days.**
  Searched twice. Everything returned dates to February-April 2026: the
  2026-02-17 launch, the automated-benchmark-evaluation draft that closed
  2026-03-31, and a run of Cloud Security Alliance research notes through April.
  Nothing between 2026-06-25 and today. The body most likely to define what an
  auditor accepts as evidence that an agent works has published nothing this
  quarter that open search can reach.
- **A stable release of the OpenTelemetry GenAI semantic conventions.** Still not
  found, which confirms rather than updates #21's finding: every `gen_ai.*`
  attribute, span and metric still carries "Development", the conventions are
  still in the separate `semantic-conventions-genai` repository they moved to in
  v1.42.0 on 2026-06-12, and there is no committed stabilisation timeline. Four
  months on from #21's check, the standard that item 1's and item 5's category
  would be built on has not moved. **This is a repeat check, not a new finding**,
  and it is here because a second null result on the same question is worth more
  than the first.
- **Any independent evaluation of the specific products in #24** - OpenAI's Data
  agent, Copilot Studio, Fabric data agents. None. Item 3 is a different vendor
  on a public benchmark; nobody has scored the four products #24 named.
- **A skeptical or dissenting analyst read on Enterprise AI Harness.** Searched;
  found only positive or descriptive coverage. Item 1 has no critic, which by the
  method I am working to means it has been found rather than checked.
- **The SEO layer is still the dominant obstacle.** #21 recorded that open search
  on this topic returns mostly vendor listicles. On the new efficacy subject it is
  worse, not better: the first page of results for almost every evaluation query
  is "The 2026 Enterprise Guide" content marketing. Every item in this brief came
  from either a primary vendor page, a benchmark site, arXiv, or one trade-press
  story - and I reached those by guessing at specific vendors and venues, not by
  searching the subject. That is a second independent argument for the curated
  source list the Format line already asks for, and it is stronger on this
  subject than on the old one.

---

## What the network reached, and what refused it

Every row observed during this run.

**Read** (HTTP 200, and the content attributed to it below came from the page):

| Host | What it carries here |
|---|---|
| `arxiv.org` | Item 4 in full - ERPBench, the 85%/3% figure, the submission date |
| `bird-bench.github.io` | Item 3 in full - 82.39%, the 2026-08-22 submission, held-out scoring, the 92.96% human baseline |
| `mc.merill.net` | Item 5 in full - RM569607, its date and its seven capabilities |
| `fivetran.com` | Item 2 in full - the announcement, availability statuses, every number |
| `techtarget.com` | Item 1's substance - Enterprise AI Harness, the AI Control Plane quote, availability |
| `salesforce.com` | Item 1's context (AIforce, 2026-09-15) and its backward-follow (Agent Fabric, 2025-09-25) |
| `cxfoundation.com` | Item 1's Dreamforce context - attendance, the six consolidated products, Agent Fabric's role |
| `snowflake.com` | The Semantic View Autopilot drop - its 2026-02-03 date and the absence of an accuracy number |

**Refused:**

| Host | Status | Consequence |
|---|---|---|
| `openai.com` | HTTP 403 | Wanted for "The next phase of enterprise AI". **Nothing in this brief depends on it** - it was a lead, not a citation. Note this is a new refusal: #21 did not test this host. |
| `blogs.mulesoft.com` | HTTP 403 | The vendor's own "measurable ROI with Agent Fabric" framing for item 1. Item 1 does not quote it and does not repeat its ROI claim. |
| `technologymagazine.com` | HTTP 403 | The trade-press write-up that surfaced item 3. Item 3 rests on the BIRD leaderboard, which was read; the 2026-09-09 reporting date is from the search index and is **not** the date the item is filed under. |
| `aimagazine.com` | HTTP 403 | Same publisher, same story, same non-dependency. |

**Items resting on a page I did not open: none.** Every item's central claim comes
from a host in the Read table. The only facts in this document that come from a
search-index summary rather than a page are: item 3's 2026-09-09 reporting date
(not used as the item's date), and the 37% lab-to-production gap figure quoted
against item 3, which is flagged inline as weakly sourced.

Two things changed since #21's fetch record, both worth carrying forward. First,
**`hpcwire.com` and `community.fabric.microsoft.com` were not needed this round** -
no item required them - so their refusal cost nothing, unlike last time when both
sat on load-bearing links. Second, the refusals that did occur cluster on **vendor
marketing domains and one trade publisher**, while primary technical sources -
arXiv, a benchmark site, a message-centre mirror, a press-release path - all
answered. That is the more useful shape of the finding than a raw count: this
runner can reach the places where the checkable numbers live, and is blocked
mainly from the places where the claims live. Eight of twelve fetches returned
usable text, against #21's six of eight.

---

## Recommendation, the argument against it, and what would flip it

**The through-line, if you read nothing else:** the question in this category has
moved on from #24's. #24 asked whether anybody had published a number an outsider
could check. Item 3 says one now exists - 82.39% on a held-out benchmark, ten
points under a human. Item 4 says the number's *grounding* is what decides whether
it means anything, by showing agents that appear to succeed 85% of the time and
write the right value 3% of the time. And item 5 says the direction real
enterprises are actually moving is neither - it is private eval suites that
produce traces and run-over-run comparisons, priced per run. **The useful
question this week is not "is there a benchmark" but "is it grounded in state,
and can you diff two runs of it".**

**The strongest argument against that framing**, which I went looking for rather
than imagined: items 3, 4 and 5 are the three data points that fit, and they are
drawn from a subject whose 90-day window is three times as wide as the one applied
to the item that does not fit. Item 1 - a vendor selling cross-vendor agent cost
and performance visibility as a governance product - is a completely different
theory of where this goes: not measurement at all, but control, sold to whoever
owns the budget. On the evidence here that theory has more revenue behind it than
all three efficacy items combined. If the next two briefs at 30 days keep
returning control-plane products and no benchmarks, this recommendation was an
artefact of the window, and the honest read will be that enterprises settled for
knowing what agents cost rather than whether they work.

**What would flip it:** a NIST CAISI publication defining an evaluation method
that a procurement process can cite - the initiative exists and has gone quiet for
a quarter; an independent evaluation of any of the four products #24 named; or a
replication of ERPBench's state-grounded result by someone other than its authors.
Any of the three turns this from a shape in five items into something checkable.

## Verified, inferred, assumed

- **Verified** (read in the source, quotable): every date, product name, number
  and status attributed to a host in the Read table above.
- **Inferred**: that item 5's trace-and-comparison features and item 1's cost
  control plane are the same movement from two vendors - reasoned from their
  content and timing, asserted by nobody. Also inferred: that the Fivetran Context
  Layer's private-beta status while the engine rewrite reached GA indicates the
  context claim is the less settled half. That is a reading of a release, not a
  statement anyone made.
- **Assumed**, and load-bearing:
  1. That items 3 and 5 belong to the efficacy Interests line rather than the
     analytics one. This is the assumption with the largest effect on the
     document - reversing it removes both on date.
  2. That a subject's "first appearance in a brief" means its first appearance
     since being added to the profile, so the newly added efficacy line gets 90
     days even though briefs have been written before. The profile's comment says
     this explicitly; I am naming it because it is the mechanism that produced the
     1-vs-4 split.
  3. That open search remains an acceptable stand-in for the curated list the
     Format line requires. Third brief running.

## This brief's relationship to `src/`

`src/` was not run, not wired and not touched. See
[ADR 0003](../decisions/0003-reader-profile-lives-in-docs.md), "Consequence,
settled by #19". Nothing was written to
[`docs/reader/profile.md`](../reader/profile.md) either - that is the driver's,
per [`loop.md`](../reader/loop.md) steps 3-6.
