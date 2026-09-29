# Path 1 - What stands behind the warehouse vendors' quality claims for their agents

This path descends from **item 1** of the breadth pass
([`0-breadth.md`](0-breadth.md), "Snowflake told customers to move from its
text-to-SQL service to its agent, citing 'higher answer quality', with no
figure"). It follows that item's first lead: **the evidence behind "higher
answer quality"**, widened by the driver to the question of what the warehouse
vendors' own in-window evaluations of their agents actually measure. It was
produced in auto-breadth mode
([`docs/reader/auto-breadth.md`](../../../reader/auto-breadth.md)) by a research
subagent. It is not a brief on an adopted topic, and nothing in it is a profile
change. The window is 90 days, so items are dated on or after **2026-06-26**;
anything older is marked **Background** and is not counted as an item.

## Level 1 - The evidence behind the vendors' agent-quality claims

**Snowflake has published no comparison of Cortex Agents against Cortex
Analyst. Its own evaluation tools could not produce one on a common metric,
because they grade the two products differently. So the direct answer to the
lead is no: there is no task count, no question author, and no verified-query
setting to record. The breadth pass's wider claim needs correcting, though.
The launch *notes* carried no number, but the vendors' *engineering blogs*
published at least four internal comparisons inside the window: Snowflake on
2026-06-30, 2026-08-06 and 2026-08-21, and Databricks on 2026-07-23. Three of
the four rest on question sets nobody outside the vendor can see, graded by
methods the posts do not state or do not name. In each, the vendor's agent is
compared with general-purpose coding agents, not with the vendor's own earlier
product. Where the arithmetic can be checked, it does not always hold.
Snowflake's headline 86.3% cannot be a whole count out of the 58 questions it
says it used, and one of its tables disagrees with the sentence above it. The
one benchmark whose tasks are public, data-eng-bench, drew two substantive
outside findings within a month: a gold answer that is off by one, and a web
tool that Snowflake's own agent could not switch off during the published
runs.**

**Background: where these products sit.** The breadth pass's
[stack map](0-breadth.md#background-where-each-product-sits-in-a-stack) places
Snowflake and Databricks at the warehouse layer, with agents reading a semantic
layer above it. Four product names are new at this level:

- **CoCo**, or Cortex Code, is Snowflake's coding agent. It is a command-line
  and in-product assistant that writes SQL, dbt models and Python against a
  Snowflake account. It is the counterpart of Claude Code or OpenAI Codex, but
  it knows about Snowflake.
- **CoWork** appears with CoCo in the title of the 2026-08-21 post, and the
  post reports the 58-question result as "CoWork using Cortex Sense". The
  passages read here do not define it.
- **Cortex Sense** (private preview) is a context layer. It builds table,
  metric and filter knowledge from things like query history, so that an agent
  does not depend only on hand-written semantic views.
- **Genie Code** is Databricks' in-notebook coding assistant (breadth item 4).
  It is not Genie, the business-user analytics agent.

---

### 1. Snowflake's "higher answer quality" has no published comparison behind it, and Snowflake's two evaluators score the two products differently

**1. What it is.** The release note of **2026-08-28** says, verbatim: "Snowflake
recommends transitioning to Cortex Agents, which supports every Cortex Analyst
capability with higher answer quality." The note was re-read in full for this
level. Its body has six links, all to user-guide pages: Cortex Agents, the
Cortex Analyst REST API, semantic views, the verified query repository, and
agent management. None of them is an evaluation. The Cortex Agents user guide
carries no figure either. Its only statement about quality is a disclaimer:
"While Snowflake strives to provide high-quality responses, the accuracy of the
LLM responses or the citations provided is not guaranteed."

**The stated reason is a mechanism, not a measurement.** Snowflake's developer
guide "Upgrade from Cortex Analyst to Cortex Agents" (Abhinav Vadrevu, updated
2026-05-05, **Background**) explains the quality claim as: "This architecture
is why agents handle open-ended and ambiguous questions better: instead of a
single pass, the agent can iterate until it gets the right answer." It then
hands the comparison to the customer: "Run 10-20 representative questions
through both APIs and compare SQL correctness, accuracy, and latency". It cites
no Snowflake-run comparison.

**A customer who follows that advice with Snowflake's own tools gets two
different scores:**

| | Cortex Analyst evaluations | Cortex Agent evaluations |
|---|---|---|
| Metric | `sql_correctness`, "the only supported metric" | answer correctness, plus tool selection, tool execution and logical consistency |
| Ground truth | the semantic view's **verified queries** | a `ground_truth_output` answer the customer writes |
| How graded | the generated SQL is executed and its result compared with the verified query's result; an LLM judge is involved (v1 `claude-4-sonnet` … v3 `claude-sonnet-4-6` or `openai-gpt-5.4`) | answer correctness is graded by an LLM judge against the expected answer |
| Leakage control | "Cortex Analyst creates a temporary copy of your semantic view with those selected queries removed" | not mentioned |
| Cross-product comparison | not mentioned | not mentioned |

(Verified queries are curated question-and-SQL pairs stored in a semantic view,
which the system retrieves as examples at run time.)

The Analyst evaluator removes a verified query from the semantic view before it
uses that query as a test. The Agent evaluator's page says nothing about
verified queries. Since 2026-04-13, Cortex Agents "generate SQL directly" from
the same semantic views, according to a search summary of that note. So an
agent tested on a question whose verified query is still in the view could
retrieve its own answer. That is an inference from what the page leaves out,
not a documented behaviour. **Both pages do say that scores move between
runs.** The Analyst page says that "repeated runs against the same pinned
metric version can produce different SQL and different scores". The Agent page
says "Agent orchestration is non-deterministic, so repeated runs ... can take
different tool paths and produce different scores."

**The nearest outside measurement is a competitor's, and it discloses less than
Snowflake does.** Basedash, an AI-native BI vendor, published "BI Bench" on
**2026-06-27**. The results table has "Snowflake Cortex" tenth of eleven, at
**19.2%** accuracy and 19.0 seconds per task. Basedash ranks itself first at
92.1%. The post and the methodology page give no question count, no grader, no
attempt count, and no statement of which Snowflake product was tested. They say
only that each tool ran with "its default settings". Cortex Analyst answers
from a semantic view, so a default setup with no semantic view built would
explain a low score on its own. That is an inference; Basedash does not say
what was set up.

**2. How long ago.**
- The release note: **2026-08-28**, 27 days ago.
- Version targeting for both evaluators went GA on **2026-08-21**, 34 days ago
  (breadth item 1, search summary).
- BI Bench: **2026-06-27**, 89 days ago, inside the window by one day.
- The migration guide (2026-05-05) and the 2026-04-13 SQL-generation note are
  **Background**.

**3. How it relates to what has already been read.** Filed under
**`warehouse-agentic`**, which is at 90 days. It answers breadth item 1's first
lead and settles that item's **Assumed** line ("that 'higher answer quality'
rests on an internal Snowflake evaluation"): nothing published shows one, and
Snowflake's own guide gives an architectural reason instead. It also serves
**`efficacy-methodology`** (90 days). The two evaluators are a small, concrete
case of what that line asks: what an organisation accepts as proof. Here the
vendor's two proofs are not commensurable. #42 described Cortex Analyst as the
thing semantic views are built for. The 2026-09-23 exploration read the per-row
AI functions underneath. Neither looked at how Snowflake grades either product.

**4. What through-line it changes.** It sharpens the breadth headline, "assert
quality and hand over the evaluator". **Snowflake handed over two evaluators,
and they do not compare the thing it asserted.** A customer checking "higher
answer quality" with Snowflake's own tools would be comparing execution-matched
SQL on held-out verified queries with a judge's reading of a final answer, and
only the first holds out the verified queries.

**5. What to research next.**
- **Whether Cortex Agent evaluations hold out verified queries.** When an
  agent's Cortex Analyst tool points at a semantic view and the evaluation
  dataset contains questions that are also verified queries in that view, are
  they removed during the run, as the Analyst evaluator's "temporary copy"
  does? Check the Cortex Agent evaluation dataset and YAML reference pages on
  `docs.snowflake.com`. Also check whether `ground_truth_invocations` can carry
  expected SQL, which would let a customer score both products on the same
  metric.
- **What BI Bench actually ran as "Snowflake Cortex".** The methodology page
  refers to a "BI Bench GitHub repository". Find it. Record the question count,
  the grading criteria, and whether a semantic view was built for Cortex or it
  ran on raw tables. Only with that can the 19.2% be read as a measurement of
  Cortex Analyst or Cortex Agents.

**6. Source.** Open search, starting from the breadth pass.
`docs.snowflake.com` and `snowflake.com` are on `sources.md`; `basedash.com`
is not.
- [Release note, 2026-08-28](https://docs.snowflake.com/en/release-notes/2026/other/2026-08-28-cortex-analyst-transition-cortex-agents):
  **full page read**, with the sentence and its links re-read.
- [Cortex Agents user guide](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-agents):
  **full page read**.
- [Cortex Analyst evaluations](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-analyst-evaluations):
  **full page read**, fetched twice, the second time for the hold-out,
  judge-model and non-determinism sentences verbatim.
- [Cortex Agent evaluations](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-agents-evaluations):
  **full page read**.
- [Migration guide](https://www.snowflake.com/en/developers/guides/migrate-cortex-analyst-to-cortex-agents/):
  **full page read**, fetched twice, the second time for both quotes and the
  date verbatim.
- [2026-04-13 note](https://docs.snowflake.com/en/release-notes/2026/other/2026-04-13-cortex-agents-agentic-analyst):
  **navigation shell only**, as in the breadth pass. Its content comes from a
  **search summary**.
- [Basedash, "We benchmarked 11 AI data analysts"](https://www.basedash.com/blog/ai-data-analyst-benchmark-bi-bench-results)
  and [BI Bench page](https://www.basedash.com/bi-bench): **full page read**.
  The table was fetched twice.

**7. Verified / inferred / assumed.**
- **Verified:**
  - the absence of any figure or evaluation link from the note and the user
    guide;
  - the migration guide's two quotes and its date;
  - both evaluators' metrics, grading and ground truth as tabulated;
  - the Analyst evaluator's hold-out sentence and both non-determinism
    sentences;
  - that neither evaluator page mentions comparing the two products;
  - BI Bench's table row, its date, "default settings", and the absence of a
    count and a grader.
- **Search summary only, filed as inferred:** that the 2026-04-13 change made
  Cortex Agents generate SQL directly.
- **Inferred:**
  - that verified queries can leak into Agent evaluations. This rests on the
    page's silence, not on a statement.
  - that BI Bench's low Cortex score reflects setup rather than capability.
- **Assumed:** that Snowflake has run an Agents-versus-Analyst comparison
  internally at all. Nothing read shows one.

---

### 2. Cortex Sense's 24.1% → 86.3%: 58 internal questions, an ungrounded coding agent as the baseline, and a top figure that is not a whole count out of 58

**1. What it is.** The figure has been published twice inside the window.

- **2026-06-30**, "Cortex Sense for Enterprise AI Agents" (Arun Agarwal,
  Abhinav Vadrevu, Rajhans Samdani, Tyler Richards). Snowflake "benchmarked it
  on a set of hard questions, comparing a frontier coding agent with direct
  access to SQL execution via model context protocol (MCP), vanilla CoCo (which
  had the ability to retrieve relevant semantic views if it needed) and CoCo
  grounded by Cortex Sense. Cortex Sense improved accuracy from 24.1% to 86.3%
  on our benchmark." The post gives **no question count and no grading
  method**. Its chart shows two values, 24.1% for the frontier coding agent and
  86.3% with Cortex Sense. **Vanilla CoCo's score is not given anywhere in the
  text or chart**, although it was one of the three configurations run.
- **2026-08-21**, "Snowflake CoCo & CoWork: Token & Intelligence Efficiency"
  (Snowflake AI Research). This post gives the count: "we created a set of 58
  internal questions spanning Snowflake's own product analytics domain". It
  names the two configurations: "CoWork using Cortex Sense" at 86.3%, and
  "Claude Code connecting to Snowflake via Snowflake MCP" at 24.1%. The
  grading method is again not stated.

**What the comparison measures.** The baseline is a general coding agent with
**no context layer at all**, not Snowflake's existing product. The comparison
that would show what Cortex Sense adds beyond semantic views is vanilla CoCo,
which could retrieve semantic views, against CoCo with Cortex Sense. That
configuration was run and its score was not published. The questions come
from Snowflake's own product analytics, on Snowflake's own internal data,
and were written by Snowflake. Nothing says who wrote them or whether they
were held out from building Cortex Sense's context.

**The arithmetic does not close.** On 58 questions a single-run accuracy can
only be *k*/58:

| Reported | Nearest *k*/58 | Fits? |
|---|---|---|
| 24.1% | 14/58 = 24.14% | **Yes** |
| 86.3% | 50/58 = 86.21%, 51/58 = 87.93% | **No** |

Because 50/58 reduces to 25/29, averaging over two, three or five runs of the
58 still gives 86.21%. Reaching 86.3% on multiples of 58 takes at least 13
runs. So one of these is true, and neither post says which:

- the scoring gives partial credit;
- the two configurations were scored on different denominators, for example
  with some questions excluded;
- 86.3% was measured on a set other than the 58 the August post attaches to
  it.

The June post predates the count and does not tie its "set of hard questions"
to the 58.

*Driver's check:* re-computed by hand from the stated count (no script could
run in this exploration). 14/58 = 24.138%; 50/58 = 86.207%; 51/58 = 87.931%.
On 10, 11 or 12 runs of 58 the nearest fractions round to 86.2% or 86.4%, not
86.3%. The table holds.

**Two further claims in the June post rest on smaller or unstated sets.**

- **A human baseline.** Of "an early internal eval set", the post says: "On
  that set it edged out human performance by 10 percentage points". The
  comparison is against Snowflake's hand-curated semantic views. The set's size
  is not stated.
- **A cited outside baseline.** The post says Snowflake's no-context baseline
  of "around 25% accuracy" was "remarkably similar to Anthropic's result which
  independently measured it at just 21%". Followed back, the Anthropic post
  (2026-06-03, **Background**) says: "Without skills, Claude's ability to
  answer analytics questions accurately didn't exceed 21% on our evals." Its
  evaluations were partly "auto-generated by Claude (then human validated)",
  and it gives no question count. "Independently" means that Anthropic measured
  its own agent on its own data. It is not a check of Snowflake's number.

**2. How long ago.** **2026-06-30** (86 days ago) and **2026-08-21** (34 days
ago). The Anthropic post, 2026-06-03, is **Background**.

**3. How it relates to what has already been read.** Filed under
**`agent-efficacy`**, whose window here is the 90-day first-appearance window.
The 30-day window would exclude the June post and admit the August one. It also
serves **`semantic-models`** (90 days). #19 reported "Cortex Sense claims 86%"
as a June summit figure and filed it as "vendor-run on undisclosed question
sets". The breadth pass kept it out of window for that reason. **Both are now
superseded.** The figure was republished inside the window, and it now has a
count that can be tested. The unpublished vanilla-CoCo score is exactly the
number #35 found missing from every report: what a semantic layer buys, set
against what building it cost.

**4. What through-line it changes.** It qualifies the efficacy line's working
rule that a vendor figure is weak because the question set is undisclosed.
Here the set is described and even counted. **The weakness is the choice of
baseline, and a headline that cannot be reproduced from the stated count.** A
comparison against no context at all says that context helps. It does not say
that this context layer helps more than the semantic views Snowflake already
sells.

**5. What to research next.**
- **How the 86.3% was computed.** Look for a Cortex Sense preview document, a
  Summit 2026 session page, or a later Snowflake post that states the grading
  (execution match, judge, or partial credit), the number of runs, and vanilla
  CoCo's score on the same set. Typedef, a competitor, wrote on 2026-06-05
  (Background) of "about 83% (about 86% in a separate measure)". Find where
  Snowflake published an 83%, and on what set.
- **The "edged out human performance by 10 percentage points" claim of
  2026-06-30.** What is the "early internal eval set": its size, who wrote it,
  and whether "human performance" means answers produced from hand-curated
  semantic views or answers produced by analysts? It is the only human
  comparison any warehouse vendor published this quarter.

**6. Source.** Both Snowflake posts came from the driver's correction and
were re-read here. `snowflake.com` is on `sources.md`; `claude.com` and
`typedef.ai` are not.
- [Snowflake, "Cortex Sense for Enterprise AI Agents"](https://www.snowflake.com/en/blog/enterprise-ai-agents-grounded-context/):
  **full page read**, fetched three times, for the figures, the configurations
  and the chart labels verbatim.
- [Snowflake, "Snowflake CoCo & CoWork: Token & Intelligence Efficiency"](https://www.snowflake.com/en/blog/engineering/snowflake-coco-cowork-token-spend-efficiency/):
  **full page read**, fetched three times. The 58-question paragraph was read
  verbatim.
- [Anthropic, "How Anthropic enables self-service data analytics with Claude"](https://claude.com/blog/how-anthropic-enables-self-service-data-analytics-with-claude):
  **full page read**, as background.
- [Typedef, "What Is Cortex Sense?"](https://www.typedef.ai/blog/what-is-cortex-sense-snowflakes-runtime-context-layer-explained):
  **full page read**, as background. It is a competitor that says it has not
  tested Cortex Sense.

**7. Verified / inferred / assumed.**
- **Verified:**
  - both dates and the authors;
  - every quoted sentence;
  - the count of 58;
  - the two named configurations and the unreported vanilla-CoCo score;
  - the absence of a grading method from both posts;
  - Anthropic's 21% sentence.
- **Verified arithmetic:** the *k*/58 table, which a reader can recompute.
- **Inferred:** that the June "set of hard questions" and the August 58 are
  one set. The figures are identical, but neither post links the two.
- **Inferred:** the three explanations for 86.3%. None is stated.
- **Assumed:** that the 24.1% baseline was a single run. It fits 14/58 exactly.

---

### 3. "Our data agent beats coding agents": Snowflake's and Databricks' internal comparisons name no grader, withhold their tasks, and in Snowflake's case disagree with their own table

**1. What it is.** Two posts, from two vendors, make the same argument: an
agent that knows the vendor's platform beats a general coding agent pointed at
it.

**Databricks, "Why A Frontier Data Agent Outperforms General Coding Agents in
Quality and Cost"** (Databricks AI Research Team, **2026-07-23**):
- "We distilled 401 self-contained tasks from real internal usage at
  Databricks", covering discovery, writing and changing code, debugging,
  explaining code, and data lookups.
- "Answers were graded by an independent judge based on whether the response
  was correct and useful, and a task that times out counts as a failure."
  Each agent had "the same 20-minute wall-clock budget per task".
- Results: **Genie Code 76.6%, Coding Agent 1 72.1%, Coding Agent 2 55.9%,
  Coding Agent 3 56.1%.**
- The competitors are anonymised as "coding agents from major AI labs" with
  "the latest models from frontier labs", augmented with Databricks MCP. No
  model is named.
- "We disabled the Ontology during this run as it is not yet globally
  available".
- The judge is not identified, and nothing says the tasks will be released.

The four figures all fit single-run counts on 401: 307, 289, 224 and 225.
(*Driver's check:* 307/401 = 76.56%, 289/401 = 72.07%, 224/401 = 55.86%,
225/401 = 56.11%. All round to the published figures.)
**The judge is the part to hold on to.** Databricks' own MemAlign post
(2026-05-08, **Background**) reported that, on 50 notebooks generated by
Genie Code, "judges disagreed with experts by up to 0.68 MAE on a 3-point
scale". The July post does not say whether its "independent judge" is an LLM,
or whether it was aligned. Databricks' Genie benchmarks documentation, updated
**2026-09-17**, says of the analytics agent: "An LLM judge grades Agent mode
responses rather than using SQL comparison."

**Snowflake, "Snowflake CoCo & CoWork: Token & Intelligence Efficiency"**
(**2026-08-21**) runs two benchmarks besides Cortex Sense's. It gives a
**task count for neither and a grading method for neither**. "Pass3" is
described only as over "three repeated trials". The post does not say whether
that means all three must pass.
- **The "internal SQL-fixing benchmark"**, "inspired by production workloads".
  The table reads: CoCo Opus 5 **98.0%**, CoCo Sonnet 5 **86.0%**, Claude Code
  Opus 5 **72.0%**, Claude Code Sonnet 5 **44.0%**. The sentence the driver
  quoted, "86% vs 72%", compares **CoCo on the smaller model with Claude Code
  on the larger one**. At the same model the gaps are 26 and 42 points, as the
  post also says.
- **The "benchmark of diverse Snowflake workloads".** The table reads: CoCo
  Opus 5 **68.0%**, CoCo Sonnet 5 **63.0%**, Claude Code Opus 5 **58.0%**,
  Claude Code Sonnet 5 **48.0%**. **The sentence above the table disagrees
  with it**: "12 on Sonnet 5 (60% vs 48%) ... CoCo on Sonnet 5 delivers the
  reliability of Claude Code on Opus 5 (60% vs 58%) at 45% lower cost per trial
  ($0.451 vs $0.821)". The table's CoCo Sonnet 5 row is 63.0% at $0.394. Two
  separate reads returned the same text and the same row. So the post's own
  headline for this benchmark uses numbers that are not in its table.
  *Driver's check:* a third, independent verbatim read by the driver returned
  the same sentence ("12 on Sonnet 5 (60% vs 48%)", "(60% vs 58%) at 45% lower
  cost per trial ($0.451 vs $0.821)") and the same table row ("Sonnet 5 |
  63.0% | 0.394").

The benchmark the driver called "general Snowflake analytics" is described in
the post as "large-scale data migrations, Streamlit analytics dashboards and
more". It is a workload mix, not a set of analytics questions.

**2. How long ago.**
- Databricks' post: **2026-07-23**, 63 days ago.
- Snowflake's post: **2026-08-21**, 34 days ago.
- The Genie benchmarks documentation update: **2026-09-17**, 7 days ago.
- MemAlign (2026-05-08) is **Background**.

**3. How it relates to what has already been read.** Filed under
**`efficacy-methodology`** (90 days). Under `agent-efficacy`'s 30 days the
Databricks post, at 63 days, would fail. It also serves
**`warehouse-agentic`** (90 days). #19 recorded June's Databricks figure
(52% → 84.5%) as vendor-run and undisclosed. On re-read, that
[2026-06-16 post](https://www.databricks.com/blog/introducing-genie-one-genie-ontology-and-genie-agents)
used a 28-question suite (**Background**). **The July post is thirteen times
larger** and names its task sources, its timeout rule and its disabled
component. It is the most specific of the undisclosed sets, and it still
cannot be checked. The breadth pass's item 4 found Hex's pass rule counting
one success in two as a pass. Here the same question, how repeated trials
combine, is not answered at all.

**4. What through-line it changes.** It adds a pattern to the breadth
headline. **In the window, the vendors' published comparisons are against
coding agents, not against their own previous product or a human.** That
makes the claim "a platform-aware agent beats a generic one". It is not "our
agent is accurate enough to use". The second claim is the one a buyer needs.
It is what Snowflake's "higher answer quality" asserts and does not measure
(item 1).

**5. What to research next.**
- **Whether Snowflake corrected the 2026-08-21 post.** Compare an archived copy
  from on or near publication (for example on `web.archive.org`) with the
  current page. Is the second table's CoCo Sonnet 5 row 60.0% at $0.451 in an
  earlier version, so that the table was re-run and the text not updated, or
  was the text always wrong? Also check whether any later Snowflake post quotes
  the "60% vs 58%" claim.
- **What the "independent judge" in Databricks' 401-task comparison is.** Is it
  an LLM judge, which model, is it aligned with MemAlign, and has Databricks
  published its agreement with human graders on any subset of the 401? Check
  Databricks' blog and MLflow documentation from 2026-07-23 onward.

**6. Source.** Both posts came from the driver's correction and were re-read
here. `databricks.com` and `docs.databricks.com` are not in the `sources.md`
table.
- [Databricks, 2026-07-23](https://www.databricks.com/blog/why-frontier-data-agent-outperforms-general-coding-agents-quality-and-cost):
  **full page read**, fetched twice. The table and the methodology sentences
  were read verbatim.
- [Snowflake, 2026-08-21](https://www.snowflake.com/en/blog/engineering/snowflake-coco-cowork-token-spend-efficiency/):
  **full page read**, fetched three times. Both tables and the disagreeing
  sentence were read verbatim twice.
- [Databricks, "Use benchmarks in a Genie Space"](https://docs.databricks.com/aws/en/genie/benchmarks):
  **full page read**.
- [Databricks, MemAlign post](https://www.databricks.com/blog/using-memalign-improve-evaluation-traditional-machine-learning-genie-code)
  and [Genie One post](https://www.databricks.com/blog/introducing-genie-one-genie-ontology-and-genie-agents):
  **full page read**, as background.

**7. Verified / inferred / assumed.**
- **Verified:**
  - both posts' dates, counts (401 only), figures, quoted methodology
    sentences, and stated absences;
  - the text-table disagreement, on two reads;
  - the Genie documentation sentence and its date;
  - the MemAlign figure.
- **Verified arithmetic:** the four *k*/401 fits.
- **Inferred:** that the Snowflake SQL-fixing set has 50 tasks, or a multiple
  of 50. All four of its figures are even percentages, and 63.0% on the other
  benchmark rules out 50 there. This is not stated.
- **Inferred:** that the "independent judge" is an LLM. The post does not say.
- **Assumed:** that anonymised "Coding Agent 1-3" are the same products and
  models across tasks.

---

### 4. data-eng-bench: the one vendor benchmark with public tasks, and what outsiders found in it within a month

**1. What it is.** "A Data Engineering Benchmark for AI Agents" (Snowflake AI
Research, "in joint work with Bespoke Labs", **2026-08-06**) released 103 dbt
tasks as `Snowflake-Labs/data-eng-bench` under Apache-2.0. (dbt is the
transformation layer in the breadth pass's stack map; a dbt model is a SQL file
that builds a table.) The tasks run on Harbor, the harness from Terminal-Bench.
The README describes the tasks this way:
- "The 103 tasks span four categories": Analytics 65, Development and bug-fixes
  16, Dimensional modeling and snapshots 9, Data engineering 13.
- Difficulty: 3 easy, 47 medium, 45 hard, 8 very hard.
- Scoring is by "a `pytest` verifier that checks the materialized tables row by
  row against a reference solution".

The blog divides the same 103 differently, into 84 Build and 19 Fix tasks. The
two taxonomies each sum to 103.

The published table, with Pass@1 defined as "mean single-attempt pass rate
(averaged across three attempts)" and Pass^3 as "resolved if all three
attempts succeed":

| Harness | Model | Pass@1 | Pass^3 |
|---|---|---|---|
| Snowflake CoCo (Code) | Opus 5 | 73.8% | 64.1% |
| Snowflake CoCo (Code) | Sonnet 5 | 56.6% | 40.8% |
| Snowflake CoCo (Code) | GPT 5.6 Sol | 64.1% | 55.3% |
| Claude Code | Opus 5 | 69.6% | 60.2% |
| Claude Code | Sonnet 5 | 56.6% | 40.8% |
| Codex | GPT 5.6 Sol | 60.5% | 49.5% |

Every figure fits its stated denominator: *k*/309 for Pass@1 and *k*/103 for
Pass^3 (for example 228/309 and 66/103). This is the only vendor evaluation
at this level whose Pass rule is defined and whose arithmetic closes. It
evaluates CoCo, not Cortex Agents or Cortex Analyst.

**Because the tasks are public, outsiders could check them, and two findings
followed within a month:**

- **Web tools during the published runs.** Pull request #7 was opened
  2026-08-19 by a Snowflake engineer and merged 2026-09-02. It says: "The tasks
  and their reference solutions are public now, so an agent that can reach the
  web can look up the answer". It also says: "Cortex Code keeps `web_search`
  and `web_fetch` available in **every** agent mode, including code mode ...
  Harbor's `cortex-code` agent has no option to switch them off". At that
  point the bundled Claude Code configuration already disabled web tools, and
  the Codex one did not. The blog's runs were "conducted between 08/03/2026 -
  08/05/2026", in CoCo's Code mode, after the repository's initial commit of
  2026-07-29. **The blog says nothing about web tools for any harness.** So
  the CoCo rows were produced by an agent that the benchmark's own maintainers
  later documented could not be kept off the web. Whether any run used the web
  is not recorded anywhere read.
- **A wrong gold answer.** Pull request #9, opened 2026-09-05 by an outside
  contributor (`genesis-gh-jlangseth`), reports that in
  `dbt-monthly-channel-revenue` the stored `consecutive_growth_months` is one
  higher than the task's own instruction defines. "28 of 51 rows disagree by
  exactly +1", and the value 1 never appears. It traces the error to a window
  frame in the reference solution. **It is unmerged, with no maintainer
  response**, 19 days on. A reference solution that is wrong fails every agent
  that follows the instruction, and passes every agent that copies the
  reference.

One other outside pull request, #5 (a train/test split, 2026-08-12), was
closed unmerged by its own author. The only issue is a Snowflake "Migration
Log". The repository shows 27 commits, 78 stars and 13 forks.

**2. How long ago.**
- The blog: **2026-08-06**, 49 days ago.
- PR #7: opened **2026-08-19** (36 days ago), merged **2026-09-02** (22 days
  ago).
- PR #9: **2026-09-05**, 19 days ago.
- The repository's first commit: **2026-07-29**, 57 days ago.

**3. How it relates to what has already been read.** Filed under
**`efficacy-methodology`** (90 days). Under `benchmarks-depth`'s 30 days the
2026-08-06 release would fail, although both pull requests would pass. It is
the same pattern the 2026-09-23 exploration's path 1 found in Spider
2.0-AIFunc: a vendor-authored benchmark whose gold is the weak point. It is
the opposite case on access, though. AIFunc hid its gold and was scored by
hand. data-eng-bench published its gold, and that is the only reason either
finding exists. #35's WarehouseReliabilityBench and #26's ERPBench also graded
against database state, as this verifier does.

**4. What through-line it changes.** It gives the efficacy line a
counter-example to its own preference. **Publishing the tasks is what made
the vendor's figures checkable, and checking found problems at once.** A
vendor evaluation with no critics (items 2 and 3) has not been shown to be
sound; nobody has been able to look. The comparison inside this benchmark
also depends on a harness setting that differed between the vendor's agent
and its competitors, and the published post does not disclose it.

**5. What to research next.**
- **Recompute `consecutive_growth_months` for `dbt-monthly-channel-revenue`
  from the task's own fixture**, using the instruction's rule. Does PR #9's
  28-of-51 hold? The task is in the Analytics category and in the published
  run. Every row that passed it did so against a wrong reference. The recount
  needs the task's data, which is a download rather than a page fetch.
- **Whether any data-eng-bench result has been re-run for CoCo with web tools
  off**, on Harbor ≥ 0.22.0 or with `--allow-agent-host`. Check the Harbor hub
  leaderboard the README links for rows dated after 2026-09-02, and compare
  CoCo Opus 5's 73.8% / 64.1% with any such row.

**6. Source.** The blog came from the driver's correction. `github.com` and
`raw.githubusercontent.com` are on `sources.md`; this repository was not.
- [Snowflake, data-eng-bench post](https://www.snowflake.com/en/blog/engineering/data-eng-bench-data-engineering-agent-benchmark/):
  **full page read**, fetched three times. The table, the definitions, the
  test dates and the absence of any web-tool statement were read verbatim.
- [`README.md`](https://raw.githubusercontent.com/Snowflake-Labs/data-eng-bench/master/README.md):
  **full page read**, fetched twice.
- [`docs/cortex-code.md`](https://raw.githubusercontent.com/Snowflake-Labs/data-eng-bench/master/docs/cortex-code.md),
  [PR #7](https://github.com/Snowflake-Labs/data-eng-bench/pull/7) (fetched
  twice, the body verbatim), [PR #9](https://github.com/Snowflake-Labs/data-eng-bench/pull/9),
  [PR #5](https://github.com/Snowflake-Labs/data-eng-bench/pull/5),
  [commits](https://github.com/Snowflake-Labs/data-eng-bench/commits/master),
  [issues](https://github.com/Snowflake-Labs/data-eng-bench/issues?q=is%3Aissue),
  [pull requests](https://github.com/Snowflake-Labs/data-eng-bench/pulls?q=is%3Apr)
  and the [repository page](https://github.com/Snowflake-Labs/data-eng-bench):
  **full page read**.

**7. Verified / inferred / assumed.**
- **Verified:**
  - the 103 and both of its breakdowns;
  - the table and both definitions;
  - the test dates;
  - PR #7's quotes and its dates;
  - PR #9's claim, its date and its unmerged status with no response;
  - the commit, issue and pull-request record.
- **Verified arithmetic:** every figure's fit to /309 or /103.
- **Not verified:** PR #9's 28 of 51. That is the contributor's count, not
  recomputed here.
- **Inferred:** that the blog's CoCo runs had web tools available. This
  follows from PR #7's description of every mode, and from Harbor's option
  arriving only in 0.22.0 on 2026-09-02. The blog does not say which Harbor
  version or configuration it used.
- **Assumed:** that the tasks were publicly reachable during the 08-03 to 08-05
  runs. The 2026-07-29 commit is titled "Initial public dbt-bench OSS dataset
  repo", but the date the repository became visible was not read.

---

### What was searched for and not found

- **Any Snowflake-published comparison of Cortex Agents with Cortex Analyst on
  the same semantic views.** None was found in the release note, the user
  guide, the migration guide, either evaluation page, or search. Snowflake's
  engineering-blog index was read twice. It listed posts from 2026-09-03 to
  2026-09-23 and one from 2026-06-02, and none was about either product. That
  index is incomplete: it omitted both the 2026-08-06 and the 2026-08-21
  posts. So this absence rests on search as well as on the index.
- **The body of the 2026-04-13 "Improved SQL generation in Cortex Agents"
  note.** It returned a navigation shell again. What it says comes from search
  summaries.
- **A question count for the 2026-06-30 Cortex Sense post.** None is on the
  page. The only count is the August post's 58.
- **Task counts and graders for the two CoCo benchmarks**, and a definition of
  "Pass3". None is in the post.
- **The identity of Databricks' "independent judge", and any release of the
  401 tasks.** Neither was found.
- **A critic of the 401-task comparison or of the Cortex Sense figure that
  tested either.** The nearest were a competitor's explainer (Typedef, June,
  which says it has not tested Cortex Sense) and Colrows (2026-06-12, updated
  2026-08-30, also a competitor). Colrows restates vendor figures: "Both
  vendors grade their own homework, and the two report cards are not
  comparable." Neither ran anything.
- **A maintainer response to data-eng-bench PR #9.** None, 19 days on.
- **Any Google evaluation figure for BigQuery data agents in the window.** The
  BigQuery release notes carry agent observability ("monitor the performance,
  adoption, latency, and costs of your data agents", Preview, 2026-08-24) and
  publishing to Gemini Enterprise (Preview, 2026-09-22), and no figure. **The
  same release notes date Conversational Analytics GA to 2026-06-23**, which is
  93 days ago and outside the window. The breadth pass dated it by Google's
  blog post of 2026-06-30.

### What was dropped

- **Snowflake, "Agentic Semantic Model Improvement"** (57% → 78% on four BIRD
  subsets of 60, 80, 111 and 141 questions, with a Mistral Large 2 judge). A
  search summary dated it 2026-06-16. The page says **2025-03-31**, so it is
  out of window. It is recorded because a summariser misdated it.
- **Snowflake, "Inside Snowflake Intelligence"** (2025-06-03) and **"Cortex
  Agent Evaluations"** (2026-03-13, the GPA judge's TRAIL/GAIA figures).
  Both are out of window. The second measures a judge, not an agent.
- **Codecentric, "Building an Evaluation Harness for Databricks Genie"**
  (2026-08-04). A practitioner's harness with eight questions and no results.
  Its point, that Genie's Agent mode is judge-graded, is carried by
  Databricks' own documentation in item 3.
- **phData's CoCo + TruLens workflow post, two Medium posts on evaluating
  Cortex Agents, and Atlan's and Mastech's Cortex Analyst guides.** Surfaced by
  search and not read. They are secondary, or undated in the results.

## Level 2 - Can Snowflake's own evaluators check "higher answer quality"?

**No, and the reason is now documented rather than inferred from silence.
Nothing inside the window changed what either evaluator can do. The one
in-window change, version targeting (2026-08-21), makes a run repeatable. It
does not make the two products comparable. The breakdown has three parts.
First, there is no shared question set. The Cortex Analyst evaluator accepts
only the semantic view's own verified queries. The Cortex Agent evaluator
takes a separate table of questions, with no hold-out. Second, there is no
shared metric. Analyst's `sql_correctness` executes SQL and compares results.
Every Agent metric that reads expected tool behaviour is an LLM judge's
semantic match, and the Agent page says outright that the Cortex Analyst
`tool_input` is "not SQL you author". Third, there is a leakage path, and
Snowflake's own in-window pages spell out each step. The 2026-08-28 note says
verified queries "continue to apply" in Cortex Agents. The migration guide says
their use is "not directly exposed". The Agent evaluator removes nothing. And
Snowflake's evaluation best-practices guide, updated 2026-08-25, recommends
fixing inconsistent results by adding verified queries. So a customer who
tests the Agent on questions it holds verified answers for cannot tell from the
response or the score that it did. A customer can approximate a fair
comparison by hand. Nothing documented does it for them, and it still ends on
two different kinds of grader.**

Terms new at this level:
- A **trace** is the recorded sequence of steps an agent took for one question:
  which tools it called, with what input, and what came back.
- **Public Preview** is Snowflake's label for a feature that any customer can
  use but that is not yet generally available (GA) or covered as a finished
  product.
- An **evaluation dataset** for Cortex Agents is a table with one row per test
  question. Each row holds the question and a JSON "ground truth" object
  describing what the agent should do and say.

---

### 1. Cortex Agents use the verified queries and the Agent evaluator does not hold them out: the leakage path, now stated step by step

**1. What it is.** Level 1 filed leakage as an inference from what the Agent
evaluation page leaves out. Three Snowflake statements now sit under it.

- **Verified queries apply inside Cortex Agents.** The 2026-08-28 transition
  note, under "What transitioning involves", says: "Your verified queries are
  stored in the semantic view, so they continue to apply." It also says:
  "Cortex Agents uses the same semantic views for SQL generation, so you don't
  need to rebuild your semantic layer."
- **The customer cannot see when they were used.** The migration guide
  (updated 2026-05-05, **Background**) maps each Cortex Analyst response
  field to its Agent equivalent. For the Analyst field
  `confidence.verified_query_used`, the Agent column reads "Not directly
  exposed". The "How to detect" column reads: "Verified queries still
  influence SQL generation but are not surfaced in the response".
- **The Agent evaluator removes nothing.** The phrases "verified query" and
  "verified queries" do not appear anywhere on the Cortex Agent evaluations
  page (checked by a direct yes/no re-read). The Analyst page describes its
  hold-out verbatim: "Cortex Analyst creates a temporary copy of your semantic
  view with those selected queries removed. Cortex Analyst then generates SQL
  using this temporary copy, which does not contain the evaluation queries."
  It gives the reason: "This prevents the evaluation queries from influencing
  SQL generation, ensuring that the evaluation measures how well Cortex
  Analyst can answer questions without relying on exact matches from verified
  queries."

**What is still not documented is the mechanism.** The verified-query
repository pages describe retrieval for Cortex Analyst only: "When the user's
question is similar to a query in the Verified Query Repository (VQR), Cortex
Analyst uses that query to generate the SQL query in its response." Neither
the repository page nor the Cortex Agents user guide says how an agent that
"generate[s] SQL directly" (the 2026-04-13 change, still readable only as a
search summary) retrieves the verified queries. The 2026-08-28 note says they
"continue to apply" and does not say how.

**The Analyst hold-out is narrower than it sounds.** This is an inference, and
it is recorded here because it qualifies Level 1's table. Snowflake's
semantic-view optimisation feature (Preview, undated page) reads verified
queries and writes what it learns into the rest of the semantic view. Its
example: "Cortex Analyst uses the verified SQL to determine how you're defining
*active*. From there, it can suggest the addition of an 'is_active' filter on
the customer table". A temporary copy with the verified query removed still
contains any filter or definition that was derived from that query. So the
Analyst hold-out removes the answer but not what was learned from it.

**2. How long ago.**
- The transition note: **2026-08-28**, 27 days ago.
- The Agent evaluations page is **undated**. The only date on it is a model
  deprecation: "`claude-4-sonnet` entered the legacy state on August 12,
  2026" (43 days ago).
- The Analyst evaluations page, both verified-query repository pages, the
  Cortex Agents user guide and the optimisation page are **undated**.
- The migration guide (2026-05-05) and the 2026-04-13 note are **Background**.

**3. How it relates to what has already been read.** It takes Level 1 item 1's
inference, "verified queries can leak into Agent evaluations", and replaces the
page's silence with documented statements. What remains unstated is only
whether a leaked query changes a score. Filed under **`warehouse-agentic`**
(90 days). It also serves **`efficacy-methodology`** (90 days). This is the
same shape as data-eng-bench's web tools in Level 1 item 4: the answer is
reachable from inside the test, and the published result does not say whether
it was reached. Here, though, the result belongs to each customer rather than
to Snowflake.

**4. What through-line it changes.** It hardens the path's through-line, "the
vendors' two proofs are not commensurable", into a stronger claim. **A
customer running Snowflake's Agent evaluator on the questions they know best,
which are the ones they already wrote verified queries for, measures retrieval
as well as reasoning, and cannot see which it measured.** The one Snowflake
evaluator that guards against this is the one attached to the product Snowflake
now recommends leaving.

**5. What to research next.**
- **A spike, for an engineer behind its own issue: does a verified query change
  a Cortex Agent evaluation score?** Take one semantic view and split one
  question set into two halves. Half are present as verified queries, and half
  are the same questions with their verified queries removed. Run one Cortex
  Agent evaluation over both halves with `answer_correctness`. Compare the
  scores, and diff the agent's SQL against the verified SQL question by
  question. Reading cannot settle this.
- **Whether any trace field records verified-query use for Cortex Agents.**
  Read the AI Observability reference
  (`docs.snowflake.com/en/user-guide/snowflake-cortex/ai-observability/reference`)
  and the `GET_AI_RECORD_TRACE` function reference for span attributes. The
  question is whether anything replaces Analyst's `verified_query_used` inside
  an evaluation trace, even though the Agent response does not expose it.

**6. Source.** Open search and direct fetch. `docs.snowflake.com` and
`snowflake.com` are on `sources.md`.
- [Transition note, 2026-08-28](https://docs.snowflake.com/en/release-notes/2026/other/2026-08-28-cortex-analyst-transition-cortex-agents):
  **full page read**, fetched twice, the second time for both sentences
  verbatim.
- [Cortex Agent evaluations](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-agents-evaluations):
  **full page read**, fetched four times, including once for the yes/no check on
  "verified query".
- [Cortex Analyst evaluations](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-analyst-evaluations):
  **full page read**, fetched three times, for the hold-out and purpose
  sentences verbatim.
- [Migration guide](https://www.snowflake.com/en/developers/guides/migrate-cortex-analyst-to-cortex-agents/):
  **full page read**, fetched twice, the second time for the table row
  verbatim.
- [Verified Query Repository (semantic views path)](https://docs.snowflake.com/en/user-guide/views-semantic/verified-query-repository),
  [the same page under the Cortex Analyst path](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-analyst/verified-query-repository),
  [Cortex Agents user guide](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-agents)
  and [semantic-view optimisation](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-analyst/analyst-optimization):
  **full page read**.
- [2026-04-13 note](https://docs.snowflake.com/en/release-notes/2026/other/2026-04-13-cortex-agents-agentic-analyst):
  **navigation shell only** for the third time. Its content comes from a
  **search summary**.

**7. Verified / inferred / assumed.**
- **Verified:**
  - the 2026-08-28 sentences;
  - the migration guide's "Not directly exposed" row;
  - the absence of "verified query" from the Agent evaluation page;
  - the Analyst hold-out and purpose sentences;
  - that the repository pages and the Agents user guide describe no retrieval
    mechanism for agents;
  - the optimisation page's example sentence.
- **Search summary only, filed as inferred:** that agents have generated SQL
  directly since 2026-04-13.
- **Inferred:** that a verified query in the agent's semantic view is used
  during an evaluation run. The note says they "continue to apply", and
  evaluation runs are ordinary agent runs. No page says so of evaluation runs
  specifically.
- **Inferred:** that the Analyst hold-out leaves behind concepts derived from
  the held-out query.
- **Assumed:** that verified-query use raises correctness. That is the point of
  verified queries, and nothing read measures it for agents.

---

### 2. Snowflake's own evaluation guide, updated inside the window, tells customers to fix inconsistent results by adding verified queries

**1. What it is.** "Best Practices for Evaluating Cortex Agents" is a
Snowflake developer guide by Josh Reini, Elliott Botwick and Larry Orimoloye,
"Updated Aug 25, 2026". It is Snowflake's advice on how to run the Agent
evaluator well. It says what to do with a question whose score varies between
runs: "Inconsistent results point at under-specified instructions or an
ambiguous question — usually fixable with more explicit instructions, better
tool descriptions, or verified queries." It warns against a set that is too
easy: "An aggregate score of 100% on a given metric typically signals that your
dataset is too easy and risks overfitting to cases your agent already handles
well". It does not tell the reader to keep evaluation questions apart from the
verified queries added to fix them. A direct re-read for such advice found
none.

Its advice on building the set points the same way. "The best approach is to
ask a willing set of end users what they hope to get out of your agent." Then
"you can query the logs to build a representative dataset using Cortex Code."
Nothing in the guide mentions checking that set against the semantic view's
existing verified queries.

**2. How long ago.** **2026-08-25**, 30 days ago. It is an update date on an
existing guide. What changed on that date was not established. The companion
quickstart, "Getting Started with Cortex Agent Evaluations" (updated
2026-03-17), is **Background**.

**3. How it relates to what has already been read.** It completes the loop
item 1 describes, using Snowflake's own advice. A question scores
inconsistently, so the customer adds its verified query. The next run scores it
consistently, because the agent can now use the answer, and the Agent evaluator
does not remove it. The guide's overfitting warning is about the difficulty of
the set, not its independence from the thing being tuned. Filed under
**`efficacy-methodology`** (90 days), which is exactly that line's question
about proof: here, what separates a test set from a training signal. It would
also pass **`warehouse-agentic`** (90 days).

**4. What through-line it changes.** It adds a practice-level instance of the
path's pattern. **The guidance attached to Snowflake's evaluator measures
improvement on a set that the recommended fix can contaminate, and the
evaluator gives no warning.** This is the evaluator-side mirror of Level 1's
finding that the vendors' published comparisons rest on sets nobody outside can
check. Here the customer can see the set but cannot see the contamination.

**5. What to research next.**
- **What the 2026-08-25 update changed.** Snowflake developer guides are built
  from the `Snowflake-Labs/sfquickstarts` repository on GitHub. Find this
  guide's source file and read its commit history around 2026-08-25. Did the
  verified-queries advice or the overfitting warning arrive in that update or
  earlier?
- **Whether Snowflake's own demo overlaps its evaluation set with its verified
  queries.** The "Getting Started with Cortex Agent Evaluations" quickstart
  ships a setup script that creates a semantic view, and an `EVALS_TABLE` with
  questions such as "What was the total spend on our summer campaign?". Read the
  script from its GitHub repository and check whether any evaluation question
  is also a verified query in that semantic view.

**6. Source.** Open search. `snowflake.com` is on `sources.md`.
- [Best Practices for Evaluating Cortex Agents](https://www.snowflake.com/en/developers/guides/best-practices-for-evaluating-cortex-agents/):
  **full page read**, fetched twice, the second time for every sourcing
  paragraph, both "verified queries" occurrences, and the absence of
  separation advice.
- [Getting Started with Cortex Agent Evaluations](https://www.snowflake.com/en/developers/guides/getting-started-with-cortex-agent-evaluations/):
  **full page read**, as background.

**7. Verified / inferred / assumed.**
- **Verified:**
  - the date, the authors and all quoted sentences;
  - the two occurrences of "verified queries", one of which is only a list of
    what a semantic view YAML contains;
    *Corrected at level 3:* the guide as updated on 2026-08-25 contains three,
    not two. The third, in its "Goal Setting" section, also recommends
    verified queries for inconsistent scores ("verified queries etc."), and
    has done so since 2026-04-24. See Level 3 item 1.
    *Driver's check:* the driver's own fetch of the raw file at `2f5630d`
    returned only one line containing "verified quer" (the "Inconsistent
    results ... or verified queries" sentence). That makes three readings of
    the count - one, two and three - all through a summarising fetch. The
    count is unsettled. What does not depend on it is that the advice to add
    verified queries for inconsistent results is in the guide.
  - the absence of advice on keeping evaluation questions separate.
- **Inferred:** the contamination loop. Each step is documented (items 1 and
  2), but no page describes the loop, and nobody was found to have hit it.
- **Assumed:** that customers actually build their Agent evaluation sets from
  the same questions they wrote verified queries for. It is the natural source
  of "the questions I know the answers to", but nothing measures it.

---

### 3. No common metric: the Agent dataset can describe expected SQL but not test it, and the Analyst evaluator will not take the Agent's questions

**1. What it is.** The lead asked whether `ground_truth_invocations` can carry
expected SQL. The Agent evaluation page answers it directly.
- **The dataset.** It has two columns, an input query (VARCHAR) and a ground
  truth (VARIANT, JSON). The ground truth holds `ground_truth_output` and
  `ground_truth_invocations`. The second is an array of objects with
  `tool_name` (required), and optional `tool_input` and `tool_output`, each
  described as "Natural-language or structured text".
- **Cortex Analyst is excluded as an input.** For a Cortex Analyst tool, the
  page says: "The `tool_input` is the natural-language query the agent
  generates for the tool, not SQL you author."
- **SQL can go in `tool_output`, as a description.** The page's own example:
  `"tool_output": "SQL that aggregates revenue by category for Jan 1 - Mar 31,
  2025 from the REVENUE_V semantic view, returning three rows with totals
  roughly 1.2M, 1.4M, and 1.1M USD."`
- **It is graded by semantic matching.** Tool execution accuracy is the only
  metric that reads `tool_output`: "Snowflake finds the closest semantic match
  among the agent's actual invocations for that tool (pairing each tool call at
  most once), then scores how well the expected input and output align with the
  real invocation." It is labelled "Tool execution accuracy (Public Preview)".
  Answer correctness "reads the `ground_truth_output` key and compares its
  value to the agent's streamed reply".
- **Custom metrics are judges too.** "Custom metrics use an LLM prompt and
  scoring methodology, which are passed to the evaluation judging system to
  produce a score". A custom prompt can read `{{tool_info}}` and
  `{{ground_truth}}`, so it could ask a judge to compare the agent's SQL with an
  expected SQL. It would still be a judge's reading. Nothing on the page
  executes an expected query.
- **The other direction is closed.** "Cortex Analyst evaluations use verified
  queries (VQs) as the evaluation set." The `verified_queries` YAML key selects
  among them: "If not provided, all verified queries are used." A direct
  re-read found no dataset table, no `INPUT_QUERY` column, and no way to test
  questions that are not verified queries. So the Agent's question table cannot
  be run through the Analyst evaluator.

**The 2026-08-21 change does not bridge this.** A search summary of the GA note
(the page itself is a shell) says a new `agent_version` key "runs an
evaluation against a specific agent version, alias, or shortcut, so a scheduled
or CI/CD evaluation stays reproducible". It also says "All five system metrics
accept a version key": the four Agent metrics and `sql_correctness`. Pinning
fixes the configuration and the judge. The Agent page limits what that buys:
"A metric version pins the judge, not the trace the judge reads."

**A possible inconsistency, recorded and not resolved.** According to a search
summary, the 2026-04-13 note says `cortex_analyst_text_to_sql` tool blocks were
"replaced by blocks of type `system_execute_sql`, which contains a `sql`
field". The Agent evaluation page still describes a Cortex Analyst tool whose
`tool_input` is a natural-language query, and it never mentions
`system_execute_sql`. If traces now show SQL-execution blocks rather than
Analyst calls, then what `tool_output` is matched against is not what the
evaluation page describes.

**Where it breaks, in order.** A customer who follows the migration guide's
"Run 10-20 representative questions through both APIs and compare" with
Snowflake's tools has three options. (a) Use the verified queries as the
questions. Analyst holds them out and the Agent does not (item 1). (b) Use new
questions. Analyst cannot evaluate them. (c) Build a copy of the semantic view
without the test questions' verified queries, point a test agent at it, and
write each verified query's result as `ground_truth_output`. That is a manual
hold-out, and it is possible in principle. It is not documented, and it still
compares an execution-matched score with a judge-graded one. The only fully
common metric is one the customer builds outside the evaluators: run both
products' SQL and compare the results.

**2. How long ago.**
- Version-targeting GA: **2026-08-21**, 34 days ago (title and URL date; body
  from a search summary).
- The Agent and Analyst evaluation pages are **undated**.
- Tool execution accuracy appeared as a Preview on **2026-06-11** (release-note
  title), 105 days ago, which is **Background**. The page still labels it
  Public Preview.
- The 2026-04-13 note is **Background**.

**3. How it relates to what has already been read.** It answers the second half
of the lead, and it corrects the scope of Level 1's table without contradicting
it. The table set "a `ground_truth_output` answer the customer writes" against
verified queries. The fuller picture is that the Agent evaluator can hold an
expected SQL, but only as prose for a judge to match, in a metric still in
Preview. Filed under **`warehouse-agentic`** (90 days). It also serves
**`efficacy-methodology`** (90 days). It is the same split #35 and Databricks'
Genie documentation (Level 1 item 3) found. Agent modes are judged by an LLM,
and one-shot text-to-SQL is judged by execution. **Snowflake applies that split
to its own two products, which leaves no path between them.**

**4. What through-line it changes.** None new. It confirms Level 1's
through-line at the level of the dataset schema. **"Higher answer quality"
cannot be checked on one metric with Snowflake's evaluators. The break is by
design, not an omission of documentation. One evaluator will not accept the
other's questions, and the other will not execute the first one's answers.**

**5. What to research next.**
- **Whether the agent's generated SQL is retrievable per evaluation record.**
  Read the `GET_AI_EVALUATION_DATA` and `GET_AI_RECORD_TRACE`
  (`SNOWFLAKE.LOCAL`) function references on `docs.snowflake.com`. Is the SQL
  (a `system_execute_sql` `sql` field or equivalent) returned in a column, so
  that a customer could execute it and compare its results with the verified
  SQL themselves? That is the do-it-yourself common metric.
- **Which block type Cortex Agent traces carry today.** Read the Cortex Agents
  REST API response reference on `docs.snowflake.com` for `system_execute_sql`
  and `cortex_analyst_text_to_sql`. That settles whether the evaluation page's
  Cortex Analyst `tool_input` and `tool_output` guidance matches what the judge
  actually sees.

**6. Source.** Open search and direct fetch. `docs.snowflake.com` and
`snowflake.com` are on `sources.md`.
- [Cortex Agent evaluations](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-agents-evaluations):
  **full page read**, fetched four times. The tool-naming bullet, the example,
  the matching sentence, the custom-metric sentence and the Preview labels were
  read verbatim.
- [Cortex Analyst evaluations](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-analyst-evaluations):
  **full page read**, fetched three times.
- [Version-targeting GA note, 2026-08-21](https://docs.snowflake.com/en/release-notes/2026/other/2026-08-21-cortex-agent-eval-version-targeting-ga):
  **navigation shell only**. Its content comes from a **search summary**.
  [Feature updates earlier in 2026](https://docs.snowflake.com/en/release-notes/feature-releases-2026)
  gave **titles only**, which is where the 2026-06-11 date comes from.
- [2026-04-13 note](https://docs.snowflake.com/en/release-notes/2026/other/2026-04-13-cortex-agents-agentic-analyst):
  **shell**. Its content comes from a **search summary**.

**7. Verified / inferred / assumed.**
- **Verified:**
  - the dataset columns and keys;
  - the "not SQL you author" sentence;
  - the `tool_output` example;
  - the semantic-match, answer-correctness and custom-metric sentences;
  - both Public Preview labels;
  - that the Analyst evaluator takes only verified queries;
  - the "pins the judge, not the trace" sentence.
- **Search summary only, filed as inferred:** the 2026-08-21 note's content,
  and the 2026-04-13 block-type change.
- **Inferred:**
  - that a custom metric can compare SQL through `{{tool_info}}`. The variable
    is documented, but its contents are not.
  - the manual hold-out in (c). It is assembled from documented parts, and
    nobody was found to have done it.
  - the evaluation page / release note inconsistency.
- **Assumed:** that no undocumented evaluator option exists, for example an
  Analyst dataset table. Documentation can lag the product.

---

### What was searched for and not found

- **Any hold-out, exclusion or warning about verified queries in Cortex Agent
  evaluations.** Checked on the Agent evaluation page, the best-practices
  guide, the getting-started quickstart, and by two searches. None was found.
- **Any description of how Cortex Agents retrieve verified queries**, beyond
  "continue to apply" and "still influence SQL generation". Checked on both
  verified-query repository pages, the Cortex Agents user guide, and the
  transition note.
- **Any way to give the Cortex Analyst evaluator questions that are not
  verified queries.** None on its page.
- **Any Snowflake or outside comparison of the two evaluators' scores on one
  question set, or anyone reporting verified-query leakage in Agent
  evaluations.** Two searches found only Snowflake pages and practitioner
  how-to posts. The two Medium posts that search surfaced could not be read
  (`medium.com` refused with a 403).
- **The bodies of the 2026-08-21 and 2026-04-13 release notes.** Both are
  navigation shells. The index page gives titles only. The 2026-08-28 note,
  unusually, read in full.

### What was dropped

- **The 2026-06-11 "Cortex Agent tool evaluation metrics (Preview)" note.** It
  is 105 days old, so Background. It is used only to date item 3's Preview
  status.
- **Atlan, "Cortex Analyst vs Custom Text-to-SQL: Accuracy Guide [2026]".**
  Surfaced by search. From the search result, it concerns semantic-layer
  accuracy rather than either evaluator. It is secondary and was not read.
- **Snowflake's "Cortex Agent Evaluations" engineering post (2026-03-13).**
  Already dropped at Level 1 as out of window. Nothing here needed it.

## Level 3 - What the 2026-08-25 update to Snowflake's evaluation guide changed

**The advice to fix inconsistent scores with verified queries was not new on
2026-08-25. It has been in the guide since 2026-04-24. The update repeated it
in a new section and raised consistency to "the bar". Everything else the
update added is about pinning: which agent version is scored, and which judge
scores it. That makes a customer's own runs repeatable. It adds nothing on
holding test questions out, nothing on how many runs make a comparison, and no
mention of Cortex Analyst beyond one metric name. Three days later, Snowflake
told customers to move to Cortex Agents on a quality claim. Its own guidance
for that week lets a customer check whether their agent is stable against
itself. It does not let them check the claim. And the guide's recommended fix
for an unstable question is to add that question's answer to what the agent
reads, which the Agent evaluator does not remove before testing. That can make
the score self-fulfilling. Nothing read shows that it does.**

The guide's source is public. It lives in the `Snowflake-Labs/sfquickstarts`
repository on GitHub, and its history has thirteen commits from 2026-04-14 to
2026-08-25. Three fall inside the window. Two of those, on 2026-07-22 and
2026-07-29, only change a link. The 2026-08-25 commit is the substantive one:
147 lines added and 5 removed, by Josh Reini, one of the guide's authors, with
the title "Update best-practices-for-evaluating-cortex-agents.md" and no
message.

A term new at this level:
- A **judge version** (Snowflake calls it a metric version) is a named bundle
  of the model that grades an answer, plus the prompt, rubric and thresholds it
  grades with. `v1` uses `claude-4-sonnet`. `v3` uses `claude-sonnet-4-6` or
  `openai-gpt-5.4`.

---

### 1. The verified-queries fix predates the update by four months; the update restated it and made consistency the target

**1. What it is.** The guide's "Goal Setting" section was added on
**2026-04-24** (commit `679d041`, by `sfc-gh-ebotwick`). It ends: "Additionally
- metric scores jumping from 80% -> 65% -> 90% with minimal changes to the
evaluation set or agent instructions suggest that your agent may be failing to
answer queries in a consistent manner - which can often be addressed by adding
more explicit instructions, better tool descriptions, verified queries etc."
The same paragraph carries the overfitting warning Level 2 quoted ("An
aggregate score of 100% ..."). The guide's first version, of 2026-04-14, had
neither. It mentioned verified queries only in a list of what a semantic view
file contains.

**The 2026-08-25 update left that sentence untouched.** It changed one earlier
sentence in the paragraph:

- Before: "This can be achieved via the the compare tab in the Agent
  Evaluations UI or by directly querying the results from the event table."
- After: "This can be achieved via the compare tab and score trend visuals in
  the Agent Evaluations UI, or by directly querying the results from the event
  table. Keep the metric version fixed while you do this — scores from
  different metric versions aren't comparable, so a version change mid-series
  will look like variance that isn't there."

**It then said the same thing again, more prominently**, in a new section,
"Comparing runs across versions":

> Consistent failures point at a missing tool, a bad tool description, or a
> gap in the semantic view. Inconsistent results point at under-specified
> instructions or an ambiguous question — usually fixable with more explicit
> instructions, better tool descriptions, or verified queries. Accurate is the
> goal; consistently accurate is the bar.

This is the sentence Level 2 quoted. The update also added a new takeaway to
the guide's closing list: "Target consistency, not just accuracy — per-question
score trends tell you which failures are systematic and which are
non-determinism".

**It also wrote the rest of the loop out more explicitly.** An older sentence,
unchanged, already said of production failures: "Then, add these queries to
your evaluation dataset and improve your agent". The update added, in a new
section on attributing answers to agent versions: "It also closes the loop back
to evaluations: once you know which version produced a failure, you can add
that query to your dataset and evaluate against that exact version by name."

**What the update did not add.** A direct re-read of the current page found
no advice to keep evaluation questions apart from verified queries, and no hold-out or
test set kept out of tuning. The raw file has no occurrence of "leak" or
"contamin".

Snowflake's companion guide, "Best Practices for Building Cortex Agents"
(updated 2026-06-15, **Background**), explains why a verified query would make
a flaky question steady: "Pre-define verified queries: For common or complex
analytics, pre-define and verify queries directly in your semantic views. This
ensures the agent uses an optimized, predictable query path." Path 3 found
Snowflake's semantic-view overview saying "Currently, Cortex Agents reads the
information captured in the semantic view definition and generates the SQL
against the physical tables directly". Verified queries are part of that
definition.

**2. How long ago.**
- The update: **2026-08-25**, 30 days ago, 3 days before the 2026-08-28
  transition note.
- The two July link fixes: **2026-07-22** (64 days) and **2026-07-29** (57
  days).
- The Goal Setting section, with its verified-queries clause: **2026-04-24**,
  153 days ago, **Background**.
- The guide's first version (2026-04-14) and the Building guide (2026-06-15)
  are **Background**.

**3. How it relates to what has already been read.** It answers Level 2 item
2's first lead. It also corrects Level 2's count of "verified queries"
occurrences, which is marked in place. The loop Level 2 inferred now has the
guide's own words at each end. A production failure goes into the dataset. A
failure that comes and goes is fixed with a verified query. The fix is kept if
the score steadies. Level 2 item 1 established that the Agent evaluator does not
remove verified queries before testing, and that the response does not say when
one was used. Filed under **`efficacy-methodology`** (90 days), whose question
is what separates proof from assertion. It also serves **`warehouse-agentic`**
(90 days).

**4. What through-line it changes.** It moves the date of the problem, not its
shape. **The contamination risk is not something Snowflake introduced during
the transition week. It has been in the guide since April. What the update did
was restate it at the moment customers were told to switch, and make
consistency the goal.** A verified query is the one fix the guide lists that
works by giving the agent the answer. A target of "consistently accurate"
rewards exactly that fix.

**5. What to research next.**
- **What "agent optimization in Cortex Code" writes.** The guide tells customers
  to "improve your agent by iterating either manually or by using agent
  optimization in Cortex Code". Read the Cortex Code agent-optimization skill's
  documentation. Does it add verified queries to the semantic view from the
  evaluation dataset's failing questions? If it does, the loop is automated,
  not just advised.
- **Whether Snowflake's verified-query suggestions draw on the same logs as the
  evaluation dataset.** The guide builds the dataset "from the logs" with
  Cortex Code. Read the verified-query suggestion documentation on
  `docs.snowflake.com`. Are suggested verified queries generated from the same
  agent or Analyst request history? If so, the two sets start from the same
  questions by default.

**6. Source.** Open search and direct fetch. `snowflake.com`, `github.com` and
`raw.githubusercontent.com` are on `sources.md`. `sfquickstarts` had not been
read before.
- [The guide](https://www.snowflake.com/en/developers/guides/best-practices-for-evaluating-cortex-agents/):
  **full page read**, fetched five times, for both paragraphs verbatim and for
  the yes/no checks.
- [File history](https://github.com/Snowflake-Labs/sfquickstarts/commits/master/site/sfguides/src/best-practices-for-evaluating-cortex-agents/best-practices-for-evaluating-cortex-agents.md):
  **full page read**.
- Diffs of [`2f5630d` (2026-08-25)](https://github.com/Snowflake-Labs/sfquickstarts/commit/2f5630d923a1c79ad1249fed79421360cbe9d18d),
  [`c8a2e9d` (2026-07-29)](https://github.com/Snowflake-Labs/sfquickstarts/commit/c8a2e9dcb4402774ddfe5868dbc6da77391c9374),
  [`5b5e3d0` (2026-07-22)](https://github.com/Snowflake-Labs/sfquickstarts/commit/5b5e3d0c72217ddd1d90de15949b626a2e71b61d)
  and [`679d041` (2026-04-24)](https://github.com/Snowflake-Labs/sfquickstarts/commit/679d0411828db3f32ffa4fc3f247747b2a9f0b20):
  **full diff read**, each in its `.diff` form.
- The raw file [before the update](https://raw.githubusercontent.com/Snowflake-Labs/sfquickstarts/c8a2e9dcb4402774ddfe5868dbc6da77391c9374/site/sfguides/src/best-practices-for-evaluating-cortex-agents/best-practices-for-evaluating-cortex-agents.md),
  [after it](https://raw.githubusercontent.com/Snowflake-Labs/sfquickstarts/2f5630d923a1c79ad1249fed79421360cbe9d18d/site/sfguides/src/best-practices-for-evaluating-cortex-agents/best-practices-for-evaluating-cortex-agents.md)
  and [at the first commit](https://raw.githubusercontent.com/Snowflake-Labs/sfquickstarts/aadf2308097347670ff9e1821ee34f51caf06934/site/sfguides/src/best-practices-for-evaluating-cortex-agents/best-practices-for-evaluating-cortex-agents.md):
  **full page read**.
- [Best Practices for Building Cortex Agents](https://www.snowflake.com/en/developers/guides/best-practices-to-building-cortex-agents/):
  **full page read**, twice, the second time for the sentence verbatim.
- [Semantic views overview](https://docs.snowflake.com/en/user-guide/views-semantic/overview):
  cited from path 3, not re-read.

**7. Verified / inferred / assumed.**
- **Verified:**
  - the commit dates, authors and sizes;
  - that the July commits change only links;
  - the before and after Goal Setting text. The diff, the raw file and the
    rendered page agree.
  - the new section's text and the new takeaway;
  - that the verified-queries clause arrived on 2026-04-24 and was absent from
    the first version;
  - the absence of any hold-out advice.
- **Inferred:** that the update's restatement matters because of its timing.
  The commit has no message, and nothing links it to the transition.
- **Inferred:** that a verified query steadies a flaky question by giving the
  agent the answer. The Building guide says it gives a "predictable query
  path", and nothing read measures it for agents.
- **Assumed:** that customers read and follow this guide. Nothing measures its
  readership.

---

### 2. What the update actually added was version pinning: runs become repeatable, but "did this change help?" is still one run against one run

**1. What it is.** Most of the 147 added lines document two features that went
GA on 2026-08-21. The first is `agent_version`, which chooses which agent
configuration is scored. The second is metric `version`, which chooses which
judge scores it. The guide explains the choice of agent version plainly. A
committed version such as `VERSION$3` "is immutable. This is what keeps
scheduled and CI/CD evaluations reproducible, and it is the only option that
gives you a clean A/B between two agent configurations." `LIVE` "is mutable, so
two runs against it can score differently for reasons that have nothing to do
with your dataset."

**The new comparison advice splits into two questions:**
- "**Did this change help?** Compare two runs against two committed versions
  on the same dataset and metric version."
- "**Is my agent consistent?** Run the same dataset against the same committed
  version repeatedly and look at per-question variance."

The first is written as one run per version. The second says "repeatedly" and
gives no number. A direct re-read of the current page found **no number of
repeated runs, and no statistical test, confidence interval or standard
deviation**. It does not suggest running the first comparison more than once.
The Agent evaluation page says Agent runs vary: "Agent orchestration is
non-deterministic" (Level 1). It goes further than the guide on CI: "Before you
gate a CI/CD pipeline on a threshold, run the same dataset several times to
learn its normal range, then gate on that range instead of a single run's exact
score." It still gives no number.

**What the update says about Cortex Analyst.** It mentions Cortex Analyst once
in the text, to say that `sql_correctness` also accepts a version, and adds a
link to the Analyst evaluation page under "Related resources". A direct
re-read found nothing on moving from Cortex Analyst, and nothing on comparing
an agent with it.

**2. How long ago.**
- The update: **2026-08-25**, 30 days ago.
- The features it documents went GA on **2026-08-21**, 34 days ago. The GA note
  is readable only as a search summary (Level 2).
- The Agent evaluation page is **undated**.

**3. How it relates to what has already been read.** Level 2 item 3 found that
pinning "pins the judge, not the trace the judge reads". This item adds what
the guide builds on that pinning: a before-and-after comparison of a
customer's own agent versions, with the judge held still. That is the
comparison Snowflake's tools can now support cleanly. Comparing the agent with
the product it replaces is not among them. Level 1 item 4 found the only vendor
evaluation on the path with a defined repeat rule, data-eng-bench's three
attempts. This guide asks customers to judge a change on a single run each.
Filed under **`efficacy-methodology`** (90 days). It also serves
**`warehouse-agentic`** (90 days).

**4. What through-line it changes.** It narrows the path's through-line about
what can be checked. **What Snowflake gave customers in the transition week
checks an agent against itself, not against the claim.** Pinning removes two
sources of drift, the agent and the judge. It does not tell a customer how big
the remaining run-to-run noise is. That noise is what decides whether "did this
change help?" has an answer.

**5. What to research next.**
- **What the Compare tab shows when a version has been run more than once.**
  Read the Compare section of the Cortex Agent evaluation documentation and its
  screenshots. Does it show the spread across repeated runs, or only two runs
  side by side? If only two, the interface enforces the one-run comparison.
- **How large the run-to-run spread is on a pinned version.** Search for any
  Snowflake, partner or customer post from 2026-08-21 onward that reports
  per-question or aggregate scores across repeated runs of one committed agent
  version and one metric version. Without a published spread, a reader cannot
  size the "several times" the documentation asks for.

**6. Source.** Direct fetch. `snowflake.com` and `docs.snowflake.com` are on
`sources.md`.
- [The guide](https://www.snowflake.com/en/developers/guides/best-practices-for-evaluating-cortex-agents/)
  and the [2026-08-25 diff](https://github.com/Snowflake-Labs/sfquickstarts/commit/2f5630d923a1c79ad1249fed79421360cbe9d18d.diff):
  **full page read**. The quoted sentences come from the diff, and the page's
  absences come from a direct yes/no re-read.
- [Cortex Agent evaluations](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-agents-evaluations):
  **full page read**, for the CI sentence verbatim.

**7. Verified / inferred / assumed.**
- **Verified:**
  - the quoted sentences;
  - that the update names Cortex Analyst only for `sql_correctness` and in a
    link;
  - the absence of a run count or statistics from the guide, and of a run count
    from the documentation's CI sentence.
- **Inferred:** that a one-run comparison cannot separate a change from noise
  on an agent Snowflake calls non-deterministic. This is the general point
  applied here. Nothing read measures the noise.
- **Assumed:** that customers use the Compare tab as the guide describes, one
  run per version.

---

### 3. The judge the guide calls default is a legacy model, and the update tells customers to pin away from it before October

**1. What it is.** The update added a table of judge versions. It is identical
to the one on the Agent evaluation page. It marks `v1`, judged by
`claude-4-sonnet`, as "The current default version." The update then says:

> **Pinning protects you from model deprecations, but not silently.**
> Unversioned metrics and `auto` roll forward to the newest supported version
> when their current version is deprecated — your runs keep working, but
> scores can shift. Pinned versions do not roll forward, so a run pinning a
> deprecated version fails with an error after the deprecation date. With
> `claude-4-sonnet` deprecating in October, pin `v3` in scheduled and CI/CD
> evaluations and upgrade deliberately.

It also says, as a bullet heading: "**Scores from different versions are not
comparable.**"

The Agent evaluation page adds a date the guide does not give: "`claude-4-sonnet`
entered the legacy state on August 12, 2026", and "Accounts with no prior
`claude-4-sonnet` usage must pin `v2` or `v3`." So on 2026-08-25 the default
judge had already been legacy for 13 days. A customer who had never used that
model would find that the default fails.

Two older lines in the guide still point at the same model. Custom metrics:
"Omitting `model`, or setting it to `auto`, uses `claude-4-sonnet` today and
rolls forward when that model is deprecated." And the CI tip, unchanged since
before the window: "**Pin the orchestration LLM:** Use a specific model (e.g.,
`claude-4-sonnet`) rather than `auto`."

**2. How long ago.**
- The update: **2026-08-25**, 30 days ago.
- The legacy date: **2026-08-12**, 43 days ago.
- "October" is not given a day in either source.

**3. How it relates to what has already been read.** Level 1's table recorded
the judge versions for the Analyst evaluator (`claude-4-sonnet` to
`claude-sonnet-4-6` or `openai-gpt-5.4`). Level 2 item 2 noted the legacy date
only as the one date on an undated page. This item puts them together. **Any
customer who scored Cortex Analyst or Cortex Agents on default settings before
the switch, and scores again after October, has two series that Snowflake's own
guide calls not comparable.** A customer checking "higher answer quality" by
comparing their Analyst history with new Agent runs would be crossing that line
as well as the metric line Level 2 found. Filed under **`efficacy-methodology`**
(90 days). It also serves **`warehouse-agentic`** (90 days).

**4. What through-line it changes.** None new. It adds a date to Level 2's
point that the two evaluators cannot be compared. **The judge changes this
autumn as well as the product.** It also shows the guidance is careful about
reproducibility: the update's warning about silent score shifts is precise and
correct. That care is spent on keeping a customer's own series stable. None of
it is spent on the comparison the transition note asks customers to accept.

**5. What to research next.**
- **The exact October date, and what `auto` resolves to after it.** Read
  Snowflake's model deprecation page on `docs.snowflake.com` for
  `claude-4-sonnet`. Does `v1` roll forward to `v2` or to `v3`? That decides
  which judge an unpinned customer's scores move to.
- **How far scores move between judge versions on the same traces.** Look for
  any Snowflake documentation or post that reports `v1` against `v3` agreement,
  or re-scoring of one run under two versions. The guide says only that scores
  "can shift".

**6. Source.** Direct fetch. `snowflake.com` and `docs.snowflake.com` are on
`sources.md`.
- [The guide](https://www.snowflake.com/en/developers/guides/best-practices-for-evaluating-cortex-agents/):
  **full page read**, with the `claude-4-sonnet` and "not comparable" sentences
  re-read verbatim.
- The [raw file on `master`](https://raw.githubusercontent.com/Snowflake-Labs/sfquickstarts/master/site/sfguides/src/best-practices-for-evaluating-cortex-agents/best-practices-for-evaluating-cortex-agents.md):
  **full page read**, for the October bullet verbatim. The rendered-page read
  did not return that bullet. The diff and the raw file both did.
- [Cortex Agent evaluations](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-agents-evaluations):
  **full page read**, for the table and both legacy sentences verbatim.

**7. Verified / inferred / assumed.**
- **Verified:**
  - both tables;
  - the October bullet, on two reads;
  - both "not comparable" sentences;
  - the legacy date and the "must pin" sentence;
  - the two older `claude-4-sonnet` lines.
- **Inferred:** that "legacy" (13 days before the update) and "deprecating"
  (October) are two stages of one retirement. Neither page defines the
  relation.
- **Assumed:** that many customers run on the default judge version. The guide
  implies it by warning them, and nothing counts them.

---

### What was searched for and not found

- **A reason for the 2026-08-25 change.** The commit has a title only, "Update
  best-practices-for-evaluating-cortex-agents.md", and no message. The commit
  page shows no linked pull request.
- **Any hold-out, leakage or test-set separation advice in the guide at any
  version.** None was found in the current page, the before and after files,
  or the first version.
- **A number of repeated runs, or any statistical treatment of repeated runs,**
  in the guide or the Agent evaluation page.
- **Any mention of the Cortex Analyst transition in the guide.** None was
  found, though the update came three days before the note.
- **Anyone outside Snowflake commenting on the guide or its update.** Two
  searches returned Snowflake's own pages and Medium tutorials. Medium refused
  at Level 2, and these tutorials were not tried again.

### What was dropped

- **The 2026-07-22 and 2026-07-29 commits.** They are in window, and both only
  change a `quickstarts.snowflake.com` link to a `snowflake.com/en/developers`
  one.
- **The "Ground Truth Considerations" section** (2026-04-15, **Background**).
  Its diff was seen only as a summary, which said it advises anchoring
  questions "to fixed points in time" against changing data. It bears on
  ground-truth staleness, not on hold-outs.
- **The Medium tutorials on evaluating Cortex Agents** surfaced by search.
  They are secondary, and the host refused at Level 2.

## Where this path ends

The path asked what stands behind Snowflake's 2026-08-28 statement that Cortex
Agents give "higher answer quality" than Cortex Analyst. The three levels
answered it from three directions:

- **Level 1: nothing has been published behind it.** Snowflake has not
  published a comparison of the two products. The vendor comparisons that do
  exist in the window set each vendor's agent against general coding agents,
  on question sets outsiders cannot see. Where the arithmetic can be checked,
  it does not always close. The one benchmark with public tasks,
  data-eng-bench, drew two substantive outside findings within a month.
- **Level 2: Snowflake's own tools cannot produce such a comparison.** The
  Analyst evaluator runs SQL and holds out verified queries. The Agent
  evaluator uses a judge and holds out nothing. Neither accepts the other's
  questions. Each step of a leakage path is documented: the Agent reads the
  semantic view's verified queries, does not say when it used one, and is
  scored without them removed.
- **Level 3: the guidance for the transition week made runs repeatable, not
  comparable.** The 2026-08-25 update documented how to pin the agent version
  and the judge. It restated a four-month-old recommendation to steady
  inconsistent questions with verified queries, and made "consistently
  accurate" the bar. It added nothing on hold-outs, nothing on repeat counts,
  and nothing on Cortex Analyst beyond one metric name.

**What the reader should take away:** "higher answer quality" is an assertion
with an architectural reason behind it (the agent can iterate) and no
measurement. Snowflake's evaluation tools let a customer measure whether their
own agent is stable and whether a change helped it. They cannot say whether it
beats Cortex Analyst. Followed as written, the guide can raise the Agent
evaluator's scores by handing the agent answers to the questions it is tested
on. This is a vulnerability of the guidance, not a documented occurrence.
Nobody has been found who hit it, and nobody has been found who measured it.

**What stays open, and who could close it.** Reading cannot close any of these
three:
- **A spike, for an engineer with a Snowflake account, behind its own issue.**
  This is Level 2's design: one semantic view and one question set, half with
  verified queries present and half removed, scored by `answer_correctness`
  pinned at `v3`, with each half run several times. It would answer whether a
  verified query moves an Agent score, and by how much against the run-to-run
  spread.
- **The same account could run the comparison Snowflake did not publish.** Put
  the same held-out questions through both products, execute both products'
  SQL, and compare the results directly. This is the do-it-yourself common
  metric of Level 2 item 3.
- **Snowflake could close all three** by publishing its internal comparison,
  if one exists, with its question count, grader and hold-out rule.

**The strongest counter-argument.** A customer's evaluation set is not a
benchmark of unseen questions. It is a sample of the questions their users
really ask. The guide says to build it from real logs for that reason. If a
verified query makes the agent answer one of those questions correctly and
consistently, then the score reflects what users will get. On that reading,
the Analyst evaluator's hold-out measures something customers do not need,
which is how well the product generalises to questions nobody curated. That
argument is strong for monitoring one deployment. It fails for the one
question this path asked: whether Cortex Agents answer better than Cortex
Analyst. That question needs both products measured on the same questions,
under the same hold-out rule, by the same kind of grader. Nothing Snowflake
has published or documented provides that. The absence of a publication is
also not proof that no internal comparison exists. Level 1 marked that as an
assumption, and it remains one.
