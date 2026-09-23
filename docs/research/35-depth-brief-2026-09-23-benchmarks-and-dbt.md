# Depth brief: text-to-SQL benchmarks, and dbt's semantic layer - 2026-09-23

**Produced by a research run**, not by a session. Per
[`docs/reader/loop.md`](../reader/loop.md) step 2, **round 3**. This is issue
[#35](https://github.com/chamaya00/background-research-agents/issues/35) under
objective [#19](https://github.com/chamaya00/background-research-agents/issues/19).

The previous brief is
[#29](https://github.com/chamaya00/background-research-agents/issues/29), written
up as
[`docs/research/26-analytics-and-agent-efficacy-brief-2026-09-23.md`](26-analytics-and-agent-efficacy-brief-2026-09-23.md).

**The decision this brief serves:** the reader asked to go deeper on two named
subjects rather than wider. What this run has to establish is whether the two
Depth Interests lines carry enough real movement inside 90 days to be worth
holding as standing subjects - and, specifically, whether the two figures the
last two briefs repeated without reading a page are true.

**This is a depth round.** The two broad Interests lines are out of scope; what
turned up on them is named in [What was dropped](#what-was-dropped) and nothing
else.

**Seven items passed filtering.** Five serve the benchmarks line, two serve the
dbt line. One of the five is a bridge item that serves both and is filed under
benchmarks - the filing is named inline, per the rule in
[`docs/memory/researcher.md`](../memory/researcher.md).

Knowledge in [`docs/reader/profile.md`](../reader/profile.md) is still empty, so
every concept below is explained once.

---

## The headline, before the items

**#29 told you Spider 2.0 "tops out around 31%". The number is real and the word
"tops" is wrong, and this run read the primaries to establish both.**

31.26% is **ReFoRCE + o1-preview**, and it is the best-scoring *raw-schema*
pipeline on Spider 2.0-Snow. It is not the benchmark's ceiling. The full ladder,
quoted from the paper that sits third on that board today:

| Method on Spider 2.0-Snow (547 tasks) | Execution accuracy |
|---|---|
| DAIL-SQL + GPT-4o | 2.20% |
| Spider-Agent + o1-preview | 23.58% |
| Spider-Agent + Claude-4-Sonnet | 25.78% |
| **ReFoRCE + o1-preview** - *the "31%"* | **31.26%** |
| QUVI-3 + Gemini 3 Pro | **94.15%** |

And the live board, read at `spider2-sql.github.io` on 2026-09-23:

| Track | Examples | Top entry | Score |
|---|---|---|---|
| Spider 2.0-Snow | 547, Snowflake-hosted | Genloop Sentinel Agent v2 Pro | **96.70** |
| Spider 2.0-Lite | 547, BigQuery / Snowflake / SQLite | Tianqiong Data Agent + GLM 5.2 | **76.23** |
| Spider 2.0-DBT | 68, DuckDB, repository-level code task | SignalPilot Agent | **65.6** |

**Sixty-five points separate the best raw-schema pipeline from the top of the
board on the same 547 questions.** That gap is this brief's subject, and item 5 is
what it is made of. It is not a story about better SQL-writing models.

Two things stop this from being a clean "the gap closed" correction, and both are
items. The scoring environment behind the 96.70 **has been suspended since
2026-08-12** (item 1). And the benchmark's own authors published a Snowflake-hosted
extension in July on which frontier models score **67-70%** (item 2).

---

## Windows, and how each item was filed

Both Depth Interests lines were added to the profile by the reaction to #29 and
neither has appeared in a brief before, so **both carry the 90-day first pass:
cutoff 2026-06-25**.

| Interests line | First appearance? | Window | Cutoff | Items |
|---|---|---|---|---|
| Text-to-SQL and data-agent benchmarks by name - Spider, Spider 2.0, BIRD, ERPBench | Yes | **90 days** | **2026-06-25** | 1, 2, 3, 4, 5 |
| dbt's semantic and context layer work | Yes | **90 days** | **2026-06-25** | 6, 7 |

**Neither line is at zero**, so acceptance criterion 2's fallback is not needed.

**The filing decision worth knowing about.** Item 5 serves both lines - it is a
semantic-layer-mediated agent scored on Spider 2.0. It is filed under the
benchmarks line because what makes it an item is the leaderboard number rather
than the layer. `docs/memory/researcher.md` requires naming the date it would
fail under the other line: **it would not fail.** Both lines are at 90 days this
round, so this assignment moves no item in or out of the brief. That is worth
stating explicitly, because it is the first round where the filing rule has had
no consequence, and a reader who remembers #26's version of this paragraph should
know the stakes are different.

---

## The items

Each follows the six-part structure the reaction to #29 put in the profile's
Format section, in that order.

---

### 1. The benchmark behind "enterprise text-to-SQL is nearly solved" has been unable to run its own evaluation since 2026-08-12

**1. What it is.** Spider 2.0 is the enterprise-shaped successor to Spider - 632
real-world text-to-SQL workflow problems drawn from production warehouses, across
three tracks. Its flagship track, **Spider 2.0-Snow**, runs its 547 examples
against Snowflake databases hosted by the benchmark's maintainers. On 2026-08-12
the maintainers posted, and have not since replaced, this notice:

> "We sincerely apologize for the ongoing disruption to Spider 2.0-Snow access.
> The Snowflake evaluation account is currently experiencing an unexpected
> suspension issue, and we are working urgently with the Snowflake team to
> resolve it as quickly as possible."

It is still the most recent entry in the repository's News list as of today. The
track whose leaderboard says 96.70 has had its evaluation environment suspended
for **six weeks**.

Two further properties of the benchmark, read off the same News list, decide how
much the 96.70 is worth:

- **2024-12-24** - "Release all examples and gold answers for self-evaluation.
  However, only a small amount of gold SQL is available."
- **2025-04-20** - "Ground-truth tables released."

So the answer key is substantially public. Official leaderboard placement does
require following a submission guidance document rather than simply self-asserting
a score, but **this is a materially weaker integrity property than BIRD's**, where
the test set is held out entirely and scored by the maintainers on submission.
#26 identified held-out scoring as "the property that makes the number checkable
by somebody other than the vendor". Spider 2.0 does not have that property in the
same form, and the 96.70 is a vendor's own report of its own run.

And the board contains its own warning. **Snow and Lite are the same 547
examples** - the difference is the dialect and the host. Top of Snow is 96.70; top
of Lite is 76.23. A twenty-point spread on the same questions is not a statement
about how hard the questions are.

**2. How long ago.** The suspension notice is dated **2026-08-12**, six weeks ago,
and is current rather than historical - it is the live state of the benchmark
today. The leaderboard itself was read **2026-09-23**. The 96.70 submission that
tops it dates to **2026-03-01**, which is three weeks outside this round's window
as news; it is reported here as a correction to a figure two briefs carried, not
as a development.

**3. How it relates to what has already been read.** It corrects **#29's item 3**
directly. That item's argument against reading BIRD's 82.39% as the gap closing
was "Spider 2.0 - harder, enterprise-shaped - tops out around 31%", and the issue
brief for this round flagged that figure as taken from #26's dropped material
rather than from a read page. It was.

**This run read the primaries, and the correction is narrower and more useful than
"wrong".** 31.26% is a real, correctly-transcribed figure: it is **ReFoRCE +
o1-preview**, the strongest *raw-schema* pipeline on Spider 2.0-Snow, quoted in
item 5's paper alongside DAIL-SQL at 2.20% and Spider-Agent at 23-26%. What was
wrong is the word **"tops out"**. It was the ceiling of one approach, promoted to
the ceiling of the benchmark. So #29's counter-argument to BIRD survives in
weakened form - Spider 2.0 is harder than BIRD *for raw text-to-SQL* - but its
conclusion inverts: the benchmark that was supposed to show the gap was wide is
now the one showing it closed, and it is a **different architecture** doing the
closing, not a better model.

**4. What through-line it changes.** It sharpens the standing through-line rather
than replacing it. #29's was *"the useful question has moved from 'is there a
benchmark' to 'is it grounded in state, and can you diff two runs of it.'"* This
adds a third clause that is prior to both: **can the benchmark still be run at
all, and by whom.** A held-out test set is a promise that requires infrastructure
to keep; Spider 2.0's has been down six weeks and its answer key is public. ERPBench's
state-grounding and BIRD's held-out scoring are both claims about the *scoring
environment*, and the scoring environment is a thing that decays.

**5. What to research next.**
- **Whether the Spider 2.0-Snow suspension has been resolved, and whether any
  leaderboard entry has been submitted or re-validated since 2026-08-12.** A
  board that keeps accepting entries while its evaluation account is suspended
  would be a much stronger finding than this one.
- **What the official Spider 2.0 submission guidance actually requires** - the
  document is linked from the repository and this run did not open it. Whether
  maintainers re-run a submitted system or accept a reported score is the single
  fact that decides how much the 96.70 means.

**6. Source.** [Spider 2.0 leaderboard](https://spider2-sql.github.io/) (read
2026-09-23) and the
[`xlang-ai/Spider2` repository README](https://github.com/xlang-ai/Spider2) (read
2026-09-23; the News quotes above are verbatim from it - the
`raw.githubusercontent.com` path returned them where the rendered page had
summarised them). **Neither host was on the curated list** - both reached by open
search on the benchmark's name, and both are added to `sources.md` by this pull
request.

---

### 2. Spider 2.0's own authors published a harder Snowflake track in July, and frontier models score 67-70% on it

**1. What it is.** **Spider 2.0-AIFunc**, an extension of Spider 2.0 to what the
authors call *AI-native SQL workflows*: **465 verified instances across 125
real-world databases**, requiring six types of **AI function** now available as
native SQL capabilities on Snowflake rather than conventional SQL alone.

An *AI function* here is an LLM call invoked from inside a SQL statement -
classification, extraction, summarisation over a column - so the task is no longer
"write correct SQL" but "decide where in the query a model should be called, and
on what". That is a real enterprise workload and it is not what any benchmark in
these briefs has measured.

The results: **67-70% execution accuracy for the strongest proprietary models,
58.1% for the best open-source model.**

**2. How long ago.** Submitted **2026-07-07**, eleven weeks ago. Inside the
window.

**3. How it relates to what has already been read.** It is the first **development
on Spider 2.0 itself** to reach these briefs - #29 only ever cited the benchmark
as a counter-example, from a number it had not read. The author list includes
**Tao Yu**, who is on the original Spider 2.0 work, so this is the benchmark's own
lineage rather than a competitor. It does not move #29's item 3 (BIRD); it is the
other half of item 1.

**4. What through-line it changes.** It is the single best argument against
reading item 1's 96.70 as "enterprise text-to-SQL is solved", and it is the
benchmark family's own argument. Two months after AIFunc reported **67-70%** for
the best proprietary models on 465 Snowflake tasks, the Snow leaderboard's top
entry reads 96.70 on 547 Snowflake tasks. Those two numbers come from the same
project, on the same platform, months apart. **Either the task definition or the
scoring is doing almost all of the work in that thirty-point difference**, and
that is precisely item 1's point about the board and the benchmark coming apart -
stated here by the people who built both.

**5. What to research next.**
- **Whether AIFunc has a leaderboard, and whether any of the Snow leaderboard's
  top three has been scored on it.** If Genloop or QUVI-3 sits near 96 on Snow and
  near 70 on AIFunc, the gap is the task. If neither has been scored on it, that
  is its own finding.
- **Whether AIFunc's 465 instances use the same Snowflake evaluation account that
  has been suspended since 2026-08-12.** If so, the benchmark's newest track has
  been unrunnable since a month after it shipped.

**6. Source.** [Liu, Xu, Lei, Kuang, Chen, Yu, McAuley, Yao and He, "Spider
2.0-AIFunc: Extending Real-World Text-to-SQL to AI-Native SQL Workflows",
arXiv:2607.06229](https://arxiv.org/abs/2607.06229) (read). **`arxiv.org` is on
the curated list; reached by open search**, chasing item 1's subject rather than
browsing the list.

---

### 3. A new enterprise text-to-SQL benchmark argues Spider and BIRD have the wrong shape of schema

**1. What it is.** **DevRev NL2SQL**, a benchmark of **900 execution-verified
queries** over production enterprise schemas with nested types and link-graph
structure, released with a cost-aware agentic architecture that scores **91.7%
answer correctness** on it - **54.6 percentage points** over the next-best
baseline. It also introduces a **Semantic Depth Score (SDS)**, a measure of how
much analytical reasoning a question actually requires.

The argument behind it is the interesting part. *Nested* schemas are ones where a
column holds a structured object or array rather than a scalar, and *link-graph*
structure means records reference each other as a graph rather than through flat
foreign keys - both are normal in production SaaS warehouses and largely absent
from the academic benchmark sets. The claim is that Spider and BIRD measure
against a schema shape enterprises do not have.

A 54.6-point margin over the next-best baseline is not a normal benchmark result.
It is what you get when you publish a benchmark alongside the system designed for
it, and it should be read as a statement about the benchmark's novelty rather than
the system's quality.

**2. How long ago.** Submitted **2026-09-04**, nineteen days ago. Comfortably
inside the 90-day window.

**3. How it relates to what has already been read.** It is one of **four** newly
named benchmarks to reach these briefs in two rounds, after **#29's item 4**
(ERPBench, arXiv:2609.17885) and alongside items 2 and 4 here. It does not move
#29's item 3 (BIRD) or item 4 (ERPBench) - it competes with them. And it is the
first item in any brief here that attacks **Spider and BIRD's construct validity**
rather than reporting a score on them.

**4. What through-line it changes.** It adds a second axis to #29's through-line.
ERPBench said the *grounding* of a benchmark decides whether its number means
anything - read the database, not the screen. This says the *schema shape* does
too. Both are arguments that the number is downstream of the test harness, which
is the same claim from two directions, and together they make the standing
through-line stronger rather than qualifying it.

**5. What to research next.**
- **Whether the Semantic Depth Score has been applied to Spider 2.0 or BIRD by
  anyone.** A portable difficulty metric applied across benchmarks would let you
  compare two leaderboards that currently cannot be compared at all - and would
  test item 1's twenty-point Snow/Lite spread.
- **Whether DevRev NL2SQL is publicly released or described only in the paper.**
  A benchmark nobody outside the authors can run is a result, not an instrument.

**6. Source.** [Varadharajan et al., "A Cost-Aware Agentic Architecture for
NL-to-SQL over Nested Enterprise Schemas, with a New
Benchmark", arXiv:2609.04641](https://arxiv.org/abs/2609.04641) (read).
**`arxiv.org` is on the curated list** - it is there because of #26's ERPBench
item - but this paper was reached **by open search**, not by working the list.
That distinction is the point of commitment 3.

---

### 4. A benchmark where roughly half the correct answers are refusals

**1. What it is.** **WarehouseReliabilityBench**: 400 frozen tasks over two
synthetic warehouses, in which **roughly half the correct responses are a
clarification, an abstention or a refusal**. The paper scores a *Business Truth
Rate* rather than SQL accuracy, and reports a rule-gated 7B agent beating a
direct-prompted 32B baseline by **+0.237**, with the **false success rate falling
from 0.754 to 0.351**.

The design choice is the finding. Every benchmark in these briefs so far scores an
agent on producing an answer. This one scores it on **knowing when not to**, and
the mechanism is rules derived from a semantic layer and a physical catalog, with
every answer gated on deterministic post-execution checks.

A *false success* is a run that returns a confident answer that is wrong. A
benchmark that only measures accuracy-when-answering cannot see them; a benchmark
where half the gold answers are refusals is built to.

**2. How long ago.** Submitted **2026-08-10**, six weeks ago. Inside the window.

**3. How it relates to what has already been read.** It is the closest relative of
**#29's item 4** (ERPBench, 85%-save-vs-3%-correct) that has appeared - both
measure the gap between an agent appearing to succeed and actually succeeding.
ERPBench found it by reading the database; this finds it by making refusal a
correct answer. It also connects forward to item 6: the failure-mode asymmetry it
quantifies is exactly the one dbt's own benchmark describes in prose.

**4. What through-line it changes.** It is the strongest single piece of evidence
*for* #29's standing through-line, and it extends it. "Is it grounded in state"
gets a companion: **is the benchmark's answer key allowed to contain "I don't
know"**. A 0.754 false-success rate on a direct-prompted baseline is the number
that makes item 1's 96.70 hard to believe at face value - not because the systems
are comparable, but because it shows how much of a benchmark score can be
confident wrongness that the scoring never looks for.

**5. What to research next.**
- **Whether WarehouseReliabilityBench's tasks and the Business Truth Rate metric
  are released**, and whether anyone has scored a frontier model on it. A
  single-author preprint with two synthetic warehouses needs a second party.
- **Whether BIRD, Spider 2.0 or ERPBench contain any unanswerable questions at
  all.** If none of them do, every leaderboard in this brief is measuring a task
  that does not include the most common enterprise failure.

**6. Source.** [Lee, "Business Truth, not SQL Accuracy: A Rule-Gated 7B Analytics
Agent Outperforms a Direct-Prompted 32B Baseline",
arXiv:2608.09254](https://arxiv.org/abs/2608.09254) (read). **`arxiv.org` is on
the curated list; this paper was reached by open search.**

---

### 5. Routing through a semantic layer is how a system gets to the top of Spider 2.0 - and the top two entries both do it

**Filed under the benchmarks line; serves both.** See
[Windows](#windows-and-how-each-item-was-filed) - the filing costs nothing this
round, because both Depth lines are at 90 days.

**1. What it is.** A natural-language-to-SQL agent that does not generate SQL from
the schema. It reasons over a **curated semantic layer** using a compact
intermediate representation the authors call **Semantic Model Query (SMQ)**; a
**deterministic engine** compiles an SMQ into dialect-correct SQL for SQLite,
BigQuery or Snowflake, which the agent then inspects, composes and executes. It
reports **94.15% execution accuracy on the 547-task Spider2-snow benchmark**,
using Gemini 3 Pro preview at temperature 0.1 with extended thinking at the high
setting.

**The leaderboard identification is confirmed, not inferred.** The paper names its
system *spider2-daquv-quvi*, referred to throughout as **QUVI**, and the Spider
2.0-Snow board's third entry is `QUVI-3 + Gemini-3-pro-preview` at 94.15. The
paper's own baseline table is where item 1's corrected ladder comes from.

**And this is not one paper's idiosyncrasy - the two entries above it are the same
idea.** Genloop, whose Sentinel Agent v2 Pro tops the board at 96.70, describes
its architecture as a **"Unified Business Memory"**: *"a governed layer that holds
your business logic, metric definitions, join paths, and team-specific context"*,
against which it builds *"a context graph of your data environment, and reason
against that"* rather than translating questions directly to SQL. Native, second
at 96.53, describes reasoning across the data to discover *"structure,
relationships, definitions, exceptions, and gaps"* before querying.

Three different vendors and one academic group, the top three places and a fourth
close behind, all having independently concluded that **the model should not see
the raw schema**.

**2. How long ago.** Submitted **2026-06-30**, twelve weeks ago - five days inside
the 90-day cutoff of 2026-06-25, and the oldest item in this brief.

**3. How it relates to what has already been read.** This is the item that joins
the two Depth lines the reader asked for, and it was not obvious from either that
they would meet. **#24's item 2** quoted dbt's claim that semantic-layer grounding
lifts accuracy sharply over raw text-to-SQL; that was a vendor measuring its own
product on its own eleven-question dataset. This is the same architectural claim,
made by unaffiliated authors, scored on the hardest public enterprise text-to-SQL
benchmark there is. It does not move **#29's item 2** - the Fivetran/dbt Agents
Schema is a distribution format, not an agent - but it is independent evidence for
the premise that release is sold on.

**4. What through-line it changes.** It changes the framing of the whole dbt Depth
line. The reader's two depth subjects were named separately, and the natural
reading was that they are two topics. **They are one argument.** The semantic
layer is not a competitor to text-to-SQL benchmarks; on the evidence here it is
the current best-known way to score well on one. Item 1 said the board and the
benchmark have come apart; this says what the top of the board is actually made
of, and it is not a better SQL-writing model.

**5. What to research next.**
- **Whether any system near the top of Spider 2.0-Snow works on the raw schema.**
  This round established what the top of the board is made of; the sharper
  question is whether raw text-to-SQL appears anywhere above ReFoRCE's 31.26% at
  all. If it does not, "text-to-SQL" has quietly stopped being the thing the
  text-to-SQL leaderboard measures.
- **Who curates the semantic layer in each case, and how long it takes.** Every
  system here presupposes a modelled layer exists. dbt's own benchmark (item 7)
  is explicit that three extra models were hand-built; QUVI calls its layer
  "curated". **The cost of the curation is the number nobody is reporting**, and
  it is what a buyer would actually be quoted.

**6. Source.** [Kim, Khoeurn and Yoon, "A Semantic-Layer-Mediated Agent for
Natural Language to SQL over Heterogeneous Enterprise Databases",
arXiv:2606.31041](https://arxiv.org/abs/2606.31041) - abstract and
[full text](https://arxiv.org/html/2606.31041v1) both read; the system name, the
baseline ladder and the backbone come from the full text. Genloop's architecture
description is from ["Genloop is #1 on Spider
2.0"](https://genloop.ai/blogs/genloop-is-1-on-spider-2.0) (read, dated
2026-03-01). Native's is from a **search summary of `usenative.ai`, not a page
this run opened** - it is the one architecture claim here that was not read at
source, and nothing rests on it. All reached **by open search**; `arxiv.org` is
listed, `genloop.ai` is not and is added by this pull request.

---

### 6. Somebody outside dbt ran dbt's own benchmark dataset, and reported a paired statistical test

**1. What it is.** **Semantic path compilation (SPC)**: instead of a model
generating SQL, a multi-turn planner grounds phrases and picks from constrained
options, and **deterministic code** does the graph traversal, role predicates,
grain lowering, SQL construction and verification. On a 38-question test set it
scores **97.4% correct across all runs against 55.3% for direct generation**, with
the paired difference significant at **McNemar p = 3.05 x 10⁻⁵**.

The part that makes it an item rather than one more architecture paper: it is
evaluated on the **ACME insurance benchmark** - the same dataset dbt Labs built
its own semantic-layer-versus-text-to-SQL comparison on.

*McNemar's test* is the standard test for whether two systems differ on the same
set of items, given that the same questions were put to both. Reporting one at all
is unusual here: none of the benchmark results in any of these briefs - BIRD's
82.39%, Spider 2.0's 96.70, dbt's own 98.2% - comes with a significance claim or a
variance estimate.

**2. How long ago.** Submitted **2026-08-17**, five weeks ago. Inside the window.

**3. How it relates to what has already been read.** It is the first genuine
**development** on **#24's item 2**, the dbt semantic-layer benchmark. #24 quoted
dbt's numbers; this is a third party running the same dataset and getting the same
direction of result from a different mechanism - deterministic compilation rather
than a semantic-layer API. It also converges with items 4 and 5: all three
conclude that the fix for confident wrongness is to take SQL construction away
from the model and gate the output deterministically. **Item 5's QUVI compiles an
SMQ with a deterministic engine; this compiles a semantic path with deterministic
code.** Two groups, two names, one mechanism - and one of them is top-three on the
hardest public board.

**4. What through-line it changes.** It is the first item in any of these briefs
to attach a **significance test** to a claim about agent accuracy, and that is a
through-line change of its own: *the useful question is becoming whether a
reported difference between two agent configurations is a difference at all.*
Every number #24, #26 and #29 reported is a point estimate with no variance -
BIRD's 82.39% versus SiriusAI's 82.28%, eleven hundredths of a point apart on the
same board, is the clearest case of a gap nobody has shown is real.

**5. What to research next.**
- **Whether dbt's own benchmark harness reports variance across its 20 runs per
  model**, or only the mean. The repository is public
  (`dbt-labs/dbt-llm-sl-bench`) and this is answerable from it.
- **Who the ACME insurance dataset belongs to and how many groups now use it.**
  Two independent evaluations on one small dataset is either a convergence or a
  shared blind spot, and which one it is depends on who built it.

**6. Source.** [Ai, "Bounded Semantic Planning and Deterministic Compilation for
Reliable Enterprise Text-to-SQL",
arXiv:2608.16663](https://arxiv.org/abs/2608.16663) (read). Reached **by open
search**, on a listed host.

---

### 7. dbt re-ran its semantic-layer benchmark in August against a new generation of models

**1. What it is.** `dbt-labs/dbt-llm-sl-bench` is the public harness behind the
figures #24 quoted: three strategies - raw `sql`, `semantic_layer`, and `mcp` -
run against the ACME insurance dataset, with and without additional dbt modeling.
In **August 2026** the repository added **Claude Sonnet 5, Claude Opus 5, and
GPT-5.6 Luna, Terra and Sol, with a thinking-effort sweep for the new models**.
The original run it was built for was March 2026.

**This item reports the re-run, not its results.** This run could not read the
figures: the results dashboard at `dbt-labs.github.io/dbt-llm-sl-bench` returned a
navigation shell rather than its tables to this fetcher, and the numbers live
behind pages it lists. **No accuracy figure from the August run appears anywhere
in this brief**, and one should not be inferred from the April figures below.

**2. How long ago.** **August 2026** - between five and nine weeks ago. The exact
commit date was not readable from the repository landing page, and it is the
weakest-dated item here. It is inside the window at either end of August, which is
why it survives; if the window were 30 days it would need a real date first.

**3. How it relates to what has already been read.** It is a development on
**#24's item 2** and on the figures the issue brief for this round singled out as
unverified. Those figures came from a **2026-04-07** dbt developer-blog post,
which is **fifteen weeks old and outside this window** - so the benchmark itself
cannot be an item this round, only its re-run can. See
[What the covered figures actually say](#what-the-covered-figures-actually-say)
for what reading that primary corrected.

**4. What through-line it changes.** None on its own. Its significance is
conditional and worth stating as such: **if** the August run shows the
semantic-layer advantage shrinking as models improve, it undercuts items 5 and 6
and the Fivetran Context Layer's entire premise; **if** it shows the advantage
holding, it is the strongest available evidence for them. A re-run whose result
nobody has published is a pending answer to the most load-bearing question on this
Depth line, and it is the single thing most worth chasing next round.

**5. What to research next.**
- **The August run's actual numbers**, from the repository's results data rather
  than the dashboard - the raw outputs are in the repo and readable without the
  rendered site.
- **Whether the `mcp` strategy is now the best of the three.** It is the strategy
  the Fivetran Context Layer and Agents Schema are built to serve, and #29's item
  2 shipped that whole layer without an accuracy number anywhere in the release.

**6. Source.** [`dbt-labs/dbt-llm-sl-bench`](https://github.com/dbt-labs/dbt-llm-sl-bench)
(read 2026-09-23 - the August model additions and the March initial run are from
its landing page). The results dashboard,
[`dbt-labs.github.io/dbt-llm-sl-bench`](https://dbt-labs.github.io/dbt-llm-sl-bench/),
**was fetched and returned no figures**. Reached **by open search**; `github.com`
was not on the curated list and is added by this pull request.

---

### Item 7's part 4, restated for the through-line

Item 7 is the only item here whose value is a pending answer rather than a
finding, and it is worth saying once more where it points. **Items 5 and 6 say
the semantic layer is winning; item 7 is the experiment that could say it is
winning by less each generation.** The April primary already shows the unmodeled
gap narrowing from 27.8 points to 8.2 as models improved from GPT-4 to Sonnet 4.6.
The August run added three model generations past that. Nobody has published what
it found.

---

## What the covered figures actually say

Acceptance criterion 6 asks this run to state, for the two figures earlier briefs
took from search summaries, whether it read a primary. Both answers are below.

### Spider 2.0's "~31%" - **primary read; figure correct, description wrong**

Covered in full in item 1. `spider2-sql.github.io` was fetched on 2026-09-23 and
the board reads 96.70 / 76.23 / 65.6 across its three tracks; the full-text of
arXiv:2606.31041 supplied the baseline ladder that shows where 31% came from.

**31.26% is ReFoRCE + o1-preview, the best raw-schema pipeline on Spider 2.0-Snow.**
It is not the benchmark's ceiling and never was. Repeating the number is fine;
repeating **"tops out"** is not. The correct sentence is: *raw-schema text-to-SQL
tops out around 31% on Spider 2.0-Snow, and semantic-layer-mediated systems are
sixty-five points above it.*

### dbt's semantic-layer benchmark figures - **primary read, figures right, framing wrong**

`docs.getdbt.com` **refused the session that wrote #20 and had never been fetched
by a run.** It answered this one. The post is ["Semantic Layer vs. Text-to-SQL:
2026 Benchmark Update"](https://docs.getdbt.com/blog/semantic-layer-vs-text-to-sql-2026),
by Jason Ganz and Benoit Perigaud of dbt Labs, dated **2026-04-07**.

Every number #24 quoted is in it. Two things about how they were quoted are not:

1. **The 90.0% → 98.2% and 84.1% → 100% figures are from the *modeled project*
   configuration**, not from the raw schema. #24 presented them as "semantic-layer
   grounding lifting" each model, which reads as the semantic layer doing the
   work. Three additional dbt models following best practice are doing part of it.
2. **The 32.7% → 64.5% comparison had a semantic-layer column and #24 dropped
   it.** On the original schema, the semantic layer went 60.5% (2023, GPT-4) →
   72.7% (2026). So text-to-SQL roughly doubled and **the gap narrowed from 27.8
   points to 8.2.** #24 quoted the half of that table that shows text-to-SQL
   improving and omitted the half that shows the semantic layer's lead shrinking -
   which is the more interesting number and the one that argues against dbt's own
   conclusion.

The post is **out of window** at fifteen weeks, so none of this is an item. Two
further details worth not re-deriving: the dataset is 11 questions over 15 tables,
20 runs per model, open-sourced as `dbt-labs/dbt-llm-sl-bench`; and on questions
**beyond** the semantic layer's modeled scope the semantic layer scores **0.0%**
by construction while GPT-5.3-Codex text-to-SQL scores 100%.

The post's own framing is the part worth carrying: *"With text-to-SQL, failure
looks like a plausible but incorrect answer. With the Semantic Layer, failure
looks like an error message."* That is the same claim item 4's 0.754 false-success
rate quantifies, from a vendor rather than a benchmark.

---

## Checked and not moved

Recorded because a verified null is a result, and because acceptance criterion 5
requires saying which covered-ground item moved.

- **BIRD's leaderboard has not moved since #29.** `bird-bench.github.io` re-read
  2026-09-23: **DataGallery-Text2SQL (Huawei 2012 Labs) is still first at 82.39%**,
  submitted 2026-08-22, with SiriusAI-SQL (Tencent) at 82.28% and AskData + GPT-4o
  (AT&T CDO) at 81.95% behind it. Human baseline still **92.96%**. One month, no
  change. **This is not an item** - nothing happened.
- **The BIRD family's newer tracks are all outside the window.** Effi-SQL
  (2026-06-18, 300 SQL-efficiency pairs) misses the cutoff by a week;
  LiveSQLBench-Large-v1 is March 2026; GenUI-Agent is May 2026; BIRD-INTERACT's
  ICLR 2026 acceptance was January. Worth knowing anyway: **no model clears ~44%
  on LiveSQLBench**, which is contamination-free and continuously refreshed, and
  the top score on BIRD-CRITIC is **35.5%**. The BIRD project's own harder tracks
  disagree with its headline leaderboard by fifty points.
- **ERPBench has not been replicated, cited or critiqued.** #26 named replication
  by someone other than its authors as one of three things that would flip its
  recommendation. Searched; found nothing. Eight days on from #29, still a
  single un-replicated preprint.
- **NIST CAISI** - not searched this round. Out of scope for a depth round on
  these two lines, per the issue. Its `sources.md` row is unchanged.

---

## What was dropped

On-subject, excluded on **date** against the 90-day cutoff of 2026-06-25:

| Candidate | Date | Line | Why dropped |
|---|---|---|---|
| dbt Labs, "Semantic Layer vs. Text-to-SQL: 2026 Benchmark Update" - the primary behind #24's figures | 2026-04-07 | dbt | Fifteen weeks out. **Read anyway**, because criterion 6 asks whether the figures hold - see [What the covered figures actually say](#what-the-covered-figures-actually-say). |
| Genloop Sentinel Agent v2 Pro reaching 96.70 on Spider 2.0-Snow | 2026-03-01 | Benchmarks | Out by twelve weeks as news. Carried inside items 1 and 5 as a **correction** and as architectural evidence, which is a different claim than reporting it as new. |
| BIRD Effi-SQL, 300 SQL-efficiency benchmark pairs | 2026-06-18 | Benchmarks | Misses the cutoff by **seven days**. The nearest miss in this brief, and the one most worth revisiting if the window is ever widened. |
| LiveSQLBench-Large-v1 - ~1K columns, ~54 tables per DB, 480 tasks, Business Rule Drift | 2026-03 | Benchmarks | Six months out. Named in [Checked and not moved](#checked-and-not-moved) because its ~44% ceiling contradicts BIRD's headline board. |
| ProSPy - profiling-driven SQL-Python agent, 60.15% / 60.51% on Spider 2.0-Lite and -Snow with Claude-4.5-Opus | 2026-06-04 | Benchmarks | Three weeks out. Would have been an item; its Spider 2.0 figures are a useful sanity check against item 1's board and are recorded here for that reason alone. |
| arXiv:2601.08778 - "Pervasive Annotation Errors Break Text-to-SQL Benchmarks and Leaderboards" | 2026-01 | Benchmarks | Eight months out, and the **most frustrating exclusion in this brief**: it argues directly for item 1's thesis from a direction this round did not take, that the gold answers themselves are wrong. Named here so the next round starts from it rather than rediscovering it. |
| arXiv:2604.25149 - paired benchmark of semantic-layer accuracy and hallucination across three frontier models | 2026-04 | dbt | Five months out. Closest relative of item 6 and the first thing to read if that line needs depth next round. |

Excluded on **substance**:

| Candidate | Date | Why dropped |
|---|---|---|
| dbt MCP server consolidating to one `get_node_details` tool; read-only OAuth for analysis features | 2026-08 | A deprecation and a permissions change. Real, in window, on the dbt line - and not a finding. Named here so the absence is visible rather than assumed. |
| Agents Schema reaching GA through the Anthropic marketplace and a ChatGPT plugin | 2026-09-16 | A distribution detail of **#29's item 2**, which is covered ground. Nothing moved; it is the same release. |
| Vendor comparison pages - "Best Agentic BI Tools for Enterprise in 2026", "7 Best Databricks Genie Alternatives", Atlan's text-to-SQL explainers, and roughly a dozen more | 2026 | Explainers and listicles. Notable only in that **the top entry on Spider 2.0-Snow is a vendor that publishes them**, which is context for item 1 rather than an item. |

**Out of scope by the issue** - the two broad Interests lines. One item turned up
that would have been strong on them and is named here as the issue asks: nothing
else did. The depth searches did not surface enterprise-analytics or
agent-efficacy material outside these two subjects, which is itself mild evidence
that the two Depth lines are narrow enough to be worth holding separately.

---

## What I searched for and did not find

- **Any resolution to the Spider 2.0-Snow suspension.** The 2026-08-12 notice is
  the newest News entry on the repository. No later statement, no status page, no
  issue thread reached by search. Six weeks.
- **Any ERPBench replication, citation or critique.** Second null on this
  question across two briefs.
- **The August 2026 results from `dbt-llm-sl-bench`.** The repository records the
  models being added; the rendered dashboard returned no figures to this fetcher.
  This is a **reachability** failure, not an absence - the data exists and is
  public, and item 7 says so.
- **Submission dates for any Spider 2.0 leaderboard entry.** The board carries
  rank, method, score and organisation, and **no dates at all**. The 2026-03-01
  date for the top entry came from the vendor's own announcement, reached by
  search. A leaderboard with no dates cannot show movement, which is a real
  limitation on the "leaderboard movement" half of this Depth Interests line -
  and the reason item 1 had to be written about the benchmark's state rather than
  its trajectory.
- **Any independent audit of a Spider 2.0 submission.** None found. The board's
  integrity rests on a submission guidance document this run did not open.
- **Any published cost or effort figure for building the semantic layers in items
  5 and 6.** Searched; nothing. This is the absence the recommendation's
  counter-argument is built on, and it is a null result rather than a gap in the
  search - four systems report accuracy and none reports what the modelling took.
- **A leaderboard or scored result for Spider 2.0-AIFunc.** The paper reports
  model scores; no board was found, and no top-three Snow system appears to have
  been scored on it.

---

## What the network reached, and what refused it

Every host fetched during this run. `sources.md` is amended in the same pull
request, per acceptance criterion 4.

**Read** (returned usable text):

| Host | What it carries here | On the list before this round? |
|---|---|---|
| `spider2-sql.github.io` | Item 1's leaderboard figures for all three tracks | **No** - new row |
| `github.com` | Item 1's verbatim News quotes and submission properties; item 7's repository activity | **No** - new row |
| `arxiv.org` | Items 2, 3, 4, 5 and 6 in full, and item 1's corrected baseline ladder | Yes |
| `docs.getdbt.com` | The dbt benchmark verification in full | **No** - new row, and it **refused #20** |
| `bird-bench.github.io` | The verified BIRD null - 82.39%, 92.96%, the three top entries | Yes |
| `bird-critic.github.io` | BIRD-CRITIC's 35.5% ceiling and the BIRD family's 2026 track dates | **No** - new row |
| `genloop.ai` | Item 5's Unified Business Memory quotes, and the 2026-03-01 date for the 96.70 submission | **No** - new row |

**Reached but returned nothing usable:**

| Host | Status | Consequence |
|---|---|---|
| `dbt-labs.github.io` | HTTP 200, navigation shell only | Item 7's figures. **Item 7 states plainly that it has none**; nothing in this brief rests on the August run's numbers. |

**Refused: none.** Zero 403s this round, against four in #26. The two hosts the
issue brief warned would refuse - `technologymagazine.com` and `aimagazine.com` -
were **not fetched**, because no item needed them; budgeting a substitute turned
out to be unnecessary rather than useful. Their rows are unchanged.

**Items resting on a page I did not open: one clause, flagged.** Native's
architecture description in item 5 comes from a search summary of `usenative.ai`,
which this run did not fetch; the item says so and nothing depends on it. Every
other claim in this brief comes from a host in the Read table. Item 5's QUVI-3
identification, which the first push of this document carried as an **inference**,
was confirmed from the paper's full text before this document was finished.

**What this says about the curated list.** Seven hosts were read and **five were
not on it**. The list carried `arxiv.org` and `bird-bench.github.io`, and
`arxiv.org` alone supplied five of seven items - so the list did real work - but
every benchmark host this round's subject actually lives on was missing, because
the list was built from two breadth rounds and these are depth subjects. That is
the list working as designed rather than failing: commitment 2 is what let this
round happen at all, and the five new rows are what commitment 3's feedback is
for.

**One thing the list cannot currently record, and should.** `arxiv.org` was
reached seven times and "reads" is now doing a lot of work for it - but the
*abstract* page and the *full-text HTML* page behave differently and answered
different questions. Item 5's identification was impossible from the abstract and
trivial from `arxiv.org/html/<id>v1`. Same for `github.com`: the rendered
repository page summarised the News list, and `raw.githubusercontent.com` returned
it verbatim, which is what made item 1's quotes usable. **A per-host row cannot
carry "this path works and that one doesn't"**, and twice this round that was the
difference between an inference and a fact. Noted in `sources.md`'s per-entry
detail rather than proposed as a schema change, which is out of scope here.

---

## Recommendation, the argument against it, and what would flip it

**Hold both Depth lines. They are one subject, and this round found its seam.**

Read items 1, 5 and 6 together. The top of the hardest public enterprise
text-to-SQL leaderboard is not a better SQL-writing model. It is a **semantic
layer with a deterministic compiler behind it** - confirmed for QUVI-3 at 94.15
from the paper's own text, and described in the same terms by the two vendors
above it (item 5). That is the architecture an unaffiliated group independently
validated on dbt's own benchmark dataset, with the only significance test in any
of these briefs (item 6). The two subjects the reader named separately are one
argument, and neither line answers on its own.

**The measurement question, meanwhile, got worse rather than better.** The board
carrying that result has had its evaluation account suspended for six weeks, its
ground truth has been public since 2025-04-20 (item 1), and the benchmark's own
authors published a July extension on which frontier models score 67-70% (item 2).
This is the reverse of what #29 found: **the architecture question is now being
answered more convincingly than the measurement question.**

**The strongest argument against that**, which I went looking for and which is not
the one this document carried on its first push - that one was the QUVI-3
identification, and confirming it removed it.

It is this: **every number above is execution accuracy on questions a semantic
layer was built to answer, and the cost of building it is reported by nobody.**
dbt's own primary is the evidence. On questions *outside* the modeled scope its
semantic layer scores **0.0% by construction** while GPT-5.3-Codex text-to-SQL
scores 100%, and the modeled configuration that produces its best figures required
three hand-built models. QUVI calls its layer "curated"; Genloop's is "governed".
So the honest reading of the sixty-five-point gap may be that these systems moved
the work from inference time to modelling time and then measured only inference
time. **A benchmark cannot see labour that happened before the benchmark started**,
and item 4's 400-task refusal benchmark is the only thing in this brief that even
gestures at what falls outside a modeled scope in production.

A second, weaker argument: five of seven items are arXiv preprints, four of them
single- or small-team submissions from the last eleven weeks with no citations.
A brief assembled from preprints measures what got published, not what is true.

**What would flip it:** the August `dbt-llm-sl-bench` run showing the
semantic-layer advantage collapsing as models improve - the April primary already
shows the unmodeled gap narrowing from 27.8 points to 8.2, which is the trend line
pointing that way; a Spider 2.0-Snow entry above 94.15 that is demonstrably raw
text-to-SQL; or any of these systems reporting how long its semantic layer took to
build, and it turning out to be cheap.

## Verified, inferred, assumed

- **Verified** (read on the page, quotable): every leaderboard figure in item 1
  and the baseline ladder behind the 31% correction; the two News quotes and their
  dates; every date, figure and claim attributed to an arXiv paper in items 2-6;
  item 5's system name and its identification as the `QUVI-3` leaderboard entry;
  Genloop's architecture quotes and its 2026-03-01 date; BIRD's 82.39%, 92.96% and
  top-three ordering; every dbt benchmark figure in [What the covered figures
  actually say](#what-the-covered-figures-actually-say).
- **Inferred**, and flagged inline: that Spider 2.0's public ground-truth release
  makes its leaderboard weaker than BIRD's held-out scoring - the properties are
  stated by each benchmark, the comparison is mine. Also inferred: that Genloop's
  "Unified Business Memory" and QUVI's semantic layer are the same architectural
  idea. They are described in similar terms by parties with no reason to agree,
  which is the strength of it and also its whole basis.
- **Read only in summary**, not at source: Native's architecture description in
  item 5, from a search index rather than `usenative.ai`. Nothing rests on it.
  Note also that Native's own materials claim **#1 at 96.53** while the board this
  run read shows Genloop at 96.70 above it; the board is what this brief follows.
- **Assumed**, and load-bearing:
  1. That item 7's repository activity is correctly dated to August 2026. It came
     from a repository landing page rather than a commit log, and it is the only
     item whose window placement I cannot pin to a day.
  2. That the Spider 2.0 leaderboard read on 2026-09-23 reflects validated
     submissions rather than self-reports. The submission guidance document was
     not opened. If it is weaker than assumed, item 1 gets **stronger**, not
     weaker.
  3. That "first appearance in a brief" gives both Depth lines 90 days even though
     both were derived from items in #29. The profile's Window comment supports
     this; naming it because a reader could argue #29 already covered both
     subjects, and under a 30-day window this brief would have **one** item -
     item 3, the only one dated inside 2026-08-24.

## This brief's relationship to `src/` and the profile

`src/` was not run, wired or touched. Nothing was written to
[`docs/reader/profile.md`](../reader/profile.md) - that is the driver's, per
[`loop.md`](../reader/loop.md) steps 3-6.
[`docs/reader/sources.md`](../reader/sources.md) **was** amended, which is this
run's to do: see
[ADR 0004](../decisions/0004-curated-source-list-lives-beside-the-profile.md).
