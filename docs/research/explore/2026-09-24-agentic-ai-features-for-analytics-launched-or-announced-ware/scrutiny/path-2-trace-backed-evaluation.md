# Path 2 - What a trace-backed evaluation's headline numbers do and do not say

This path descends from **item 5** of the breadth pass
([`0-breadth.md`](0-breadth.md), "The first in-window evaluation of a deployed
enterprise analytics agent with a real design found the failures that
final-answer grading hides"). It follows that item's first lead: **the scoring
arithmetic in arXiv:2609.09182**, and what its 41-of-50 result means under
Hex's multi-attempt pass rule (breadth item 4). A research subagent produced it
in auto-breadth mode
([`docs/reader/auto-breadth.md`](../../../reader/auto-breadth.md)). It is not a
brief on an adopted topic, and nothing in it changes the profile.

**Window:** 90 days, so items are dated on or after **2026-06-26**. Anything
older appears only as a marked **Background** note and is not counted.

## Level 1 - The scoring arithmetic of arXiv:2609.09182, and the 41 of 50 under a 2-of-3 rule

**The paper's pass-rate arithmetic is fully specified, and it is lenient in a
way the paper states openly: "partial" scores 0.5, and "unknown" is dropped
from the denominator and reported as a separate coverage rate. The 41-of-50
figure is not a pass rate, though. It is a count of questions whose three runs
disagreed with each other, on a definition the paper never writes down, and
most of those questions have no correct answer to pass against. How many of the
41 would pass Hex's 2-of-3 rule cannot be computed from what is published. For
at least 31 of them there is no golden answer at all. For the 10 finance
questions that have one, the paper's trace-level 50% fits anything from 0 to 10
passing questions, depending on the rule. So the rule you choose moves the
result more than the model difference the paper measures. Among the other
in-window data-agent benchmarks, the ones that repeat runs average them. None
reports whether a single question gets the same answer twice. One live
leaderboard dispute shows how easily a repeat-run score can be edited after the
runs are done.**

---

### 1. The paper scores "partial" as half and removes "unknown" from the denominator, but never defines the instability it headlines

**1. What it is.** The paper is arXiv:2609.09182, eight authors, all at
**Thumbtack**, an online marketplace for hiring local service professionals.
The full text is short (15 KB of HTML), and all six of its tables were read. It
says four things about how it scores, and leaves one thing undefined.

- **The pass rate (Section 3.6), verbatim:**

  > "unknown verdicts are excluded from the denominator and reported separately
  > as a coverage rate; among the decided runs, each verdict is scored
  > yes == 1.0, partial == 0.5, no == 0.0, and the reported pass rate is the
  > mean of these scores."

  So abstention is **neither neutral nor failure. It is removed.** The
  paper's word for it is "a first-class abstention, not a failure". An agent
  that abstains more therefore has a smaller denominator and, other things
  equal, no lower a pass rate. The guard against that is the separate coverage
  rate. **The case study's results tables (Tables 3 to 6) do not print a
  coverage rate** in the text as read.
- **Five evaluation layers (Table 1).** Each layer has a stated "decision use":
  - run validity: "Discard or rerun invalid batches before interpreting
    quality";
  - primary correctness;
  - diagnostic signals;
  - cross-run reliability, with the labels "Stable, value-unstable,
    interpretation-unstable, no-attempt" and the use "Route unstable patterns
    to human review or stricter workflow control";
  - human calibration: "Calibrate thresholds before they become deployment
    gates".

  The paper puts calibration against expert review under future work
  (Section 9). It did not do it in the case study.
- **The case study (Section 5).** The 50 questions are "balanced across five
  internal business areas, with 10 questions per area". The key limit is
  verbatim: **"Finance was the one area with complete structured golden
  answers."** Only 10 of the 50 questions can be scored for correctness. That
  is 30 traces per configuration.
- **The reliability table (Table 6, "Cross-run determinism across 50
  questions"),** reproduced exactly:

  | Model | Stable | Value | Interpretation | Partial | No attempt |
  |---|---|---|---|---|---|
  | Fast | 0 | 19 | 21 | 4 | 6 |
  | Reasoning | 1 | 8 | 41 | 0 | 0 |

  Both rows sum to 50. **Only one of the 50 questions gave the stronger setup
  the same interpretation and the same value on all three runs.**

**What is not defined.** The paper has no definition of "Stable", "Value",
"Interpretation" or "Partial" as Table 6 uses them. Its only gloss is Section
6.5: "on 41 of 50 questions, it changed the table set or query interpretation
across repetitions." There is no statement of how the three runs' table sets
are compared, and no threshold. "Partial" in Table 6 is not among Table 1's
four labels, and is a different thing from the "partial" verdict worth 0.5.
Section 9 adds that "three samples bound but do not precisely estimate
run-to-run stability, so the interpretation-instability counts should be read
as lower bounds rather than exact rates."

**Two things in the tables do not fit together. Both are this run's arithmetic,
not the paper's.**

- **Fast failed its own validity check and was compared anyway.** Table 3
  gives Fast's "Run-validity check" as **Fail**. Table 1's rule for an invalid
  batch is to discard or rerun it "before interpreting quality". Fast's
  quality scores still appear beside Reasoning's in Tables 4 to 6. The text
  as read does not say why.
- **Fast's Table 3 and Table 6 cannot both count attempts the same way.**
  Table 3 gives Fast an early-refusal rate of **73%** of 150 traces. That
  leaves about 40 or 41 traces that were not refused early. Table 6 puts
  **40** Fast questions in Stable, Value or Interpretation, which are
  categories that compare runs with each other. If each of those needed at
  least two non-refused runs, that would take at least 80 traces. So either a
  refused run counts as having an "interpretation", or the categories are
  computed on something other than attempted runs. The paper does not say
  which.

**2. How long ago.** v1 was submitted **2026-08-28** at 20:57:45 UTC, 27 days
before 2026-09-24. There is no v2.

**3. How it relates to what has already been read.** Filed under
**`efficacy-methodology`** (90-day window). It also serves **`agent-efficacy`**
(30 days), and 27 days passes that too.

- The breadth pass read this paper's abstract verbatim, and its full text only
  through a summary. This is the first reading of the paper's scoring rule and
  its tables.
- The 2026-09-23 exploration's path 1 found that Spider 2.0-AIFunc used a
  determinism check ("at least 35 executions per instance") to **filter its
  ground truth**. This paper points repetition at the **agent**, not at the
  answer key. Those are two different uses of the same tool.
- **Background (out of window):** Thumbtack Engineering posted "Evaluating AI
  at Scale" on Medium in April 2026. Per a search summary, two of this paper's
  authors wrote it (Shishir Dash and Teja Venkat Kolli). It was not read.
- **The only critic found** is a **machine-generated** review on Pith
  (pith.science), a site that posts automated reviews of preprints. It was
  compiled on 2026-09-23 from a review dated 2026-09-10. Its main objection,
  verbatim: "The missing baseline is a load-bearing gap for the comparative
  narrative". The paper says a final-answer grader would pass what trace
  scoring flags, but it never ran such a grader. The review asks for "either
  the baseline implemented or the claim softened". It also suggests "six or
  more repetitions".

**4. What through-line it changes.** It qualifies the breadth pass's reading of
this paper. The breadth pass said capability and reliability moved in opposite
directions. The paper does show that, but the reliability half is **a count of
disagreement between runs, on a definition nobody outside Thumbtack can
apply**. It is **not a reliability pass rate**, and it cannot become one without
golden answers the paper does not have for 40 of its 50 questions. The
paper's own verdict on itself is the fairest one: "The portable contribution
is the methodology, not the specific rates." For `efficacy-methodology` this
adds a rule to the evidence standard. **An abstention-aware pass rate is only
as honest as the coverage rate printed beside it.** Here that coverage rate is
specified but not printed.

**5. What to research next.**
- **The definitions behind Table 6, and the missing coverage rates, from the
  authors.** The paper has eight named Thumbtack authors, and the Medium post
  shares two of them. Is there a companion post, talk or code release defining
  "interpretation-unstable" (same table set? same SQL? same join path?) and
  "Partial"? Does anything publish the coverage rate that Section 3.6 says
  should sit beside every pass rate? Check the Thumbtack Engineering Medium
  publication for posts dated on or after 2026-08-28, and each author's page.
- **Whether the abstain-and-exclude rule appears in other evaluation
  harnesses.** Hex excludes errored or ungraded checks from its measure pass
  rates. Which other in-window agent-evaluation tools do the same? Candidates:
  Snowflake's Cortex Agent evaluations (version targeting went GA
  2026-08-21), LangSmith and Braintrust. Which of them report coverage beside
  the pass rate, so an agent cannot raise its score by abstaining?

**6. Source.** From open search. `arxiv.org` is on `sources.md`.
- [arXiv:2609.09182 HTML full text](https://arxiv.org/html/2609.09182v1):
  **full page read**, through six targeted fetches. Section 3.6, Table 1,
  Section 5, Tables 3 to 6 and Section 9 were each returned as verbatim
  quotation, and Table 6's rows were checked to sum to 50.
- [arXiv abstract page](https://arxiv.org/abs/2609.09182): **full page read**,
  for the authors and the submission history.
- [Pith review of 2609.09182](https://pith.science/paper/2609.09182): **full
  page read**. It is not on `sources.md`, and it is machine-generated.
- [Thumbtack Engineering, "Evaluating AI at Scale"](https://medium.com/thumbtack-engineering/evaluating-ai-at-scale-how-thumbtack-approaches-reliability-safety-and-quality-in-genai-f75d0211ac54)
  (April 2026, Background): **search summary only**.

**7. Verified / inferred / assumed.**
- **Verified:**
  - the verdict-to-score mapping and the exclusion of "unknown", both verbatim;
  - Table 1's layers and decision uses;
  - the "10 questions per area" design, and that finance is the only area with
    golden answers;
  - Table 6 exactly as printed;
  - the "lower bounds" sentence;
  - that Fast's run-validity check reads "Fail";
  - the Pith review's quotes and dates.
- **Inferred:**
  - that the paper does not define Table 6's categories, and does not print
    coverage rates or explain why Fast was kept. These are absences reported
    by a summarising fetch over a 15 KB page. They were asked for three
    different ways and never came back, but a summariser can miss a sentence.
  - the Table 3 against Table 6 arithmetic. It rests on the assumption that
    comparing runs needs at least two attempted runs.
- **Assumed:** that the "partial" verdict and Table 6's "Partial" column are
  unrelated. The shared word is the only link, and the paper does not connect
  them.

---

### 2. How many of the 41 would pass Hex's 2-of-3 rule is not computable, and where it can be bounded, the rule moves the result from 0 to 10 of 10

**1. What it is.** The arithmetic the lead asked for, set against the rule as
Hex publishes it. **Hex** is a hosted notebook product whose built-in agent
answers data questions (breadth item 4). Its Evals documentation, re-read
verbatim for this level:

> "Each case can run 1-3 attempts. Every attempt is graded independently
> against the case's rubrics."
>
> "For cases with 2 or 3 attempts, the case passes as long as no more than one
> attempt fails."
>
> "The Hex agent is non-deterministic, so the same prompt can produce different
> responses across runs. Multiple attempts help distinguish a one-off failure,
> which is tolerated, from a repeated failure that causes the case to fail."

A case's verdict is binary: Pass, Fail, Error, Cancelled or Skipped. There is
no half credit. For measures, "Checks that errored or were not graded are
excluded rather than counted as failures". That is the same move as
Thumbtack's "unknown" rule. A `warnOnly` rubric is "graded and reported" but
"cannot fail or error its case". That is the same idea as Thumbtack's
diagnostic signals.

**Why the 41 cannot be put through the rule.** There are four reasons, and
each would be enough on its own.

1. **The 41 is a consistency count, not a correctness count.** Hex's rule
   counts passing attempts. Table 6 counts questions whose runs disagreed. A
   question whose three runs split two to one on the table set passes 2-of-3
   if the majority table was the right one, and fails if it was not.
2. **At least 31 of the 41 have no correct answer to pass against.** Only the
   10 finance questions have golden answers, so at most 10 of the 41 are
   finance questions and at least 31 (41 − 10) are not. For those 31, a
   correctness pass is undefined in the paper's own terms. It would be
   "unknown", and excluded.
3. **The split is not published.** A question can "change" across three runs
   as two-to-one or as three different interpretations. Table 6 does not say
   which. Only a two-to-one split can pass 2-of-3.
4. **Table 6 is not broken down by business area**, so the number of finance
   questions among the 41 is known only to be between 1 and 10. Only 9
   Reasoning questions were not interpretation-unstable, so at least one of
   the 10 finance questions must be among the 41.

**What can be bounded: the finance scorecard.** The inputs are all
Reasoning-configuration figures from the paper:

- **Input (Section 6.3, verbatim):** "Across the 30 Reasoning finance traces
  ... a non-canonical source-of-truth table on 15 of 30 (50%) and a skipped
  decomposition on 27 of 30 (90%)". Table 4's "Required table used" (50%) and
  "Decomposition method" (10%) agree with those counts.
- **Setup:** 10 questions × 3 runs = 30 traces. The required table was used
  on **15** traces, and decomposition was done on **3**.

Distributing those successes across 10 questions of 3 runs each gives these
bounds on how many questions pass. This is this run's arithmetic.

| Scorer (Reasoning, finance) | Traces passing | Hex 2-of-3 | Strict 3-of-3 | Any 1-of-3 |
|---|---|---|---|---|
| Required table used | 15 of 30 | **3 to 7** of 10 | **0 to 5** of 10 | **5 to 10** of 10 |
| Decomposition done | 3 of 30 | **0 to 1** of 10 | **0 to 1** of 10 | **1 to 3** of 10 |
| Required table used, Fast | 0 of 30 | 0 | 0 | 0 |

How the table-use row is derived, so it can be checked:
- **2-of-3 maximum:** seven questions with two passes each is 14, and the
  15th pass goes to an eighth question on its own. Eight at two each would
  need 16.
- **2-of-3 minimum:** if k questions have two or more passes and the rest
  have at most one, the total is at most 3k + (10 − k). Reaching 15 needs
  k ≥ 3. Three questions at 3 plus six at 1 is 15, so 3 is reachable.
- **Strict 3-of-3:** at most 5 questions (15 ÷ 3). The minimum is 0: seven
  questions at 2 plus one at 1.
- **Any 1-of-3:** at least 5 questions (15 ÷ 3). The maximum is 10: five
  questions at 2 plus five at 1.

**The paper's one trace-level number, 50%, is consistent with anything from
none of the finance questions to all of them passing, depending only on how
attempts are combined.**

**2. How long ago.** The paper is dated **2026-08-28** (27 days). Hex Evals
launched on **2026-08-04** (51 days). The documentation page carries no date of
its own.

**3. How it relates to what has already been read.** Filed under
**`efficacy-methodology`** (90 days), which is where both dates pass.
**`agent-efficacy`** (30 days) would fail Hex's 51-day date; that is named here
so the filing is visible.

- This answers the breadth pass's inference in item 5, part 7: "that the
  paper's reliability failures would survive a lenient multi-attempt rule". The
  answer is that the published data **cannot settle it either way**, and the
  finance bounds show why.
- It parallels the 2026-09-23 exploration's path 2 (SemBench), which found
  that a figure "averages repeats, so it does not show that inversion". That
  path was about cost and this one is about correctness, but the mechanism is
  the same: an aggregate over repeats erases a per-repeat fact.
- No earlier document in `docs/research/` discusses repeat-run pass rules.

**4. What through-line it changes.** It sharpens breadth item 4's "who sets
the pass rule sets the result" into a measured range. On the only questions
where correctness is defined, the choice among three common rules moves the
per-question pass count by up to 10 of 10. That is a larger swing than the
paper's headline model difference on the same scorer, which was 0% to 50% of
traces. **Hex also has no rubric that compares attempts with each other.**
Every attempt is graded on its own. A Hex customer could only see Thumbtack's
kind of instability by writing a rubric that pins the table and then reading
per-attempt verdicts, which Hex shows per case ("Each case also shows its
attempts") and exposes through `--json`.

**5. What to research next.**
- **Per-attempt export from Hex Evals.** Does `hex eval case get <id> --json`
  return each attempt's verdict on each rubric, so a user can recompute a
  strict all-attempts pass rate and a between-attempt agreement rate? Hex's
  CLI reference or its published eval-suite examples (versioned suites,
  2026-09-15) should answer it. Record the field names if they exist.
- **A published per-question repeat breakdown for any analytics agent.** Find
  any in-window paper or vendor post that reports, per question, how many of k
  runs passed, so that 1-of-k, majority and k-of-k rates can all be computed
  from one table. BI-Bench's released code and data (item 4) are the first
  place to check.

**6. Source.**
- [arXiv:2609.09182 HTML](https://arxiv.org/html/2609.09182v1): **full page
  read**. Section 5, Section 6.3 and Tables 4 and 6 were quoted verbatim. From
  open search; `arxiv.org` is on `sources.md`.
- [Hex Evals documentation](https://learn.hex.tech/docs/agent-management/evals):
  **full page read**, through four fetches. The attempts passage, case
  results, measures and warn-only sections were quoted verbatim. From open
  search; `learn.hex.tech` is not on `sources.md`.

**7. Verified / inferred / assumed.**
- **Verified:**
  - Hex's rule, its "one-off failure ... tolerated" rationale, and its
    exclusion of ungraded checks;
  - the paper's 10 golden-answer questions, 15 of 30 and 27 of 30.
- **Inferred:** every bound in the table. It is arithmetic on the published
  counts, and anyone can check it.
- **Assumed:**
  - that the "required table used" and "decomposition" scorers are binary on
    those 30 traces. The paper's rule allows a 0.5 verdict. Section 6.3's
    counts out of 30 suggest no trace was "unknown", but "partial" is not
    ruled out.
  - that a Hex rubric pinning the table would grade the way Thumbtack's
    "required table used" scorer does.

---

### 3. A data-agent leaderboard's maintainer refused a rerun that replaced only the failed trials - and the score then rose anyway, by rerunning the failed queries whole

**1. What it is.** **DataAgentBench** (DAB) is a benchmark from UC Berkeley and
Hasura PromptQL. It has 54 queries over 12 datasets and four database systems.
A leaderboard submission must include "5 runs on all queries across all
datasets", with execution traces. The headline Pass@1 is "the mean over
datasets of each dataset's average per-query pass rate". So a query that
passes 3 of 5 runs contributes 0.6, and consistency is averaged into a single
number rather than reported.

In-window, that rule was tested on the top entry. Pull request #95, "Permute
EQ - Claude Opus 5 - 94.67% Pass@1", was opened on 2026-09-01. It replaced
trials for five queries. The maintainer, Ruiying-Ma (first author of the DAB
paper), replied on **2026-09-03**:

> "We can accept the GITHUB_REPOS Q2 rerun, but not the crmarenapro Q3, Q7,
> and Q9 ones, because replacing only the trials that failed removes the very
> failures Pass@1 is meant to count. This puts you at 0.8922 for now."

She offered the alternative of rerunning "all 5 trials of those three queries
under the same frozen setup". The submitter did so, and reported on
**2026-09-11**: "We've completed five reruns each for CRMArenaPro Q3, Q7, and
Q9, with all 15 passing the current validators." The entry was accepted at
**0.9467** (258 of 270 trials, which is 54 × 5). *Corrected at level 2:* these
are two different figures, not one. 0.9467 is the leaderboard's stratified
Pass@1 (the mean over the 12 datasets of each dataset's pass rate); 258 of 270
is the raw trial pass rate, which is 0.9556. The pull request states them as
"258/270 raw, 0.9467 stratified Pass@1". It also reran DEPS_DEV_V1 Q1 whole,
after a validator update, and left the other 245 answer-trace pairs unchanged.
The commit history shows the
same entry at 0.8658 when it was added (2026-08-18), then 0.8713 after a
rescore (2026-08-19), then 0.9467 (2026-09-13). It is now ranked first.

**The rule the maintainer enforced stops trial-level selection. It does not
stop query-level selection.** The three queries rerun whole were the three that
had failed. Rerunning only the queries you did badly on, and keeping the new
runs, is still a choice made after seeing the results. That is this run's
inference, not the maintainer's.

**Two other in-window changes bear on how repeats and abstentions are scored:**
- **Refusals scored as correct.** PR #80 (2026-08-02) added a test that every
  one of the 104 validators must both accept its own ground truth and reject a
  wrong answer. It found that the `crmarenapro/query9` validator accepted the
  refusal "I could not determine the answer", because a substring match found
  the expected answer's letters inside "determine". That is a refusal scored
  as a pass, the opposite of Thumbtack's rule of excluding abstentions.
- **Tuned prompts hidden.** PR #100 (merged 2026-09-13) hides "benchmark-informed"
  submissions by default, those whose "up-front prompt is DAB-specific". That
  is **12 of 37** submissions, leaving 25 in the default view. In that
  thread, the Permute submitter asked for concrete tuning criteria covering
  "reruns", among other things.

**2. How long ago.**
- The maintainer's refusal: **2026-09-03**, 21 days before 2026-09-24.
- PR #95 merged: **2026-09-15**, 9 days. *Corrected at level 2:* PR #95
  was **closed, not merged**, by the maintainer on 2026-09-15. Its score was
  applied to the leaderboard data (`docs/data/leaderboards.json`, "updatedAt":
  "2026-09-15") instead.
- PR #100: 2026-09-13, 11 days.
- PR #80: 2026-08-02, 53 days.
- **Background (out of window):** the DAB paper itself, arXiv:2603.20576
  (March 2026).

**3. How it relates to what has already been read.** Filed under
**`benchmarks-depth`** (30-day window). The refusal and the merge pass at 21
and 9 days. PR #80 is dated 53 days back, which fails that window. It is
admitted only as supporting detail under **`efficacy-methodology`** (90 days),
and that assignment is named here. The driver's notes listed DAB's five-run
rule and the tuned-prompt commit; the pull-request threads had not been read
before. This is the second in-window case this reader has seen of a
leaderboard headline being edited after the fact. The first is the 2026-09-23
exploration's path 1, where Spider 2.0-AIFunc's paper and its release describe
different sets.

**4. What through-line it changes.** It adds a governance point to "who sets
the pass rule sets the result". **A repeat-run rule is only as strong as the
rerun policy around it**, and here that policy was being written in a pull
request thread in September. Averaging five runs (DAB), counting a case as
passed with one failure (Hex), and counting disagreement between runs
(Thumbtack) are three different answers to one question. Only Thumbtack's
makes instability a reported number.

**5. What to research next.**
- **Strict pass^5 for DAB's top entries, from their submitted traces.**
  Pass^5 means the share of queries that pass on all five runs. Submissions
  must include all five runs per query, so it is computable. For Permute EQ,
  Scout and Camber, compute pass^5 and the number of queries that pass on
  some runs but not all. Check whether the ranking holds. The results JSON is
  in each leaderboard pull request (Permute EQ is PR #95).
- **DAB's written rerun policy.** After PR #95 and the "highly tuned"
  question in PR #100, did the DAB README or `CONTRIBUTING` gain a rule on
  when a rerun may replace submitted trials, whether at the trial, query or
  whole-submission level? Record the wording and the commit date.

**6. Source.** From open search. `github.com` and `raw.githubusercontent.com`
are on `sources.md`.
- [DataAgentBench repository](https://github.com/ucbepic/DataAgentBench) and
  [raw README](https://raw.githubusercontent.com/ucbepic/DataAgentBench/main/README.md):
  **full page read**.
- [Commit history](https://github.com/ucbepic/DataAgentBench/commits/main):
  **full page read**, with 35 commits back to 2026-08-02.
- [PR #95](https://github.com/ucbepic/DataAgentBench/pull/95): **full page
  read**. Both quoted comments were re-fetched character for character.
- [PR #80](https://github.com/ucbepic/DataAgentBench/pull/80) and
  [PR #100](https://github.com/ucbepic/DataAgentBench/pull/100): **full page
  read**, through a summarising fetch.
- The [DAB website leaderboard](https://ucbepic.github.io/DataAgentBench/)
  returned its explanatory text but not its table rows.

**7. Verified / inferred / assumed.**
- **Verified:**
  - the five-run requirement and the Pass@1 definition;
  - both PR #95 quotes with their dates;
  - 0.8922, 0.9467 and 258 of 270;
  - the commit messages and dates;
  - the 12 of 37 and 104-validator counts, as the PR pages state them.
- **Inferred:**
  - that the three rerun queries were chosen because they had failed. The
    maintainer's refusal of "replacing only the trials that failed" names them
    as the queries with failed trials.
  - that query-level selection remains possible.
- **Assumed:** that "the same frozen setup" was in fact frozen. Nothing read
  can check it.

---

### 4. Of five in-window data-agent benchmarks, two show no agent repeats, one repeats only its judge, and two repeat runs (5 and 10 times) but report only the mean. Meanwhile, a rerun-noise audit finds rewording matters far more than rerunning

**1. What it is.** The driver asked which in-window data-agent benchmarks
measure reliability across repeated runs the way Thumbtack does. Each was
checked in its full text for repeat runs:

| Benchmark | Date | Agent runs per task | What the repeats are used for |
|---|---|---|---|
| **BI-Bench** (arXiv:2609.20886; Microsoft Research, Microsoft and UIUC) | 2026-09-16 | **10** | "We report all results averaged over 10 repeated runs to account for model randomness", and a paired t-test on "a per-task difference in success rate over the 10 runs", with bootstrap 95% intervals. The mean and its significance, not whether a task is solved every time. |
| **DataAgentBench** | leaderboard active to 2026-09-15 | **5** | The mean of per-query pass rates (item 3). |
| **Hex DataBench** (Hex's own 100-task benchmark) | blog 2026-08-13; leaderboard updated 2026-09-22 | not stated | The **judge** is repeated, not the agent: "every verdict is the majority of three judge runs (though they agreed with each other 96% of the time)". |
| **DI-Bench** (arXiv:2609.05776) | 2026-09-04 | 1 at temperature 0 | No repeats. Opus 4.6's "57.9%" is a single figure. |
| **DataSpace** (arXiv:2608.03451) | 2026-08-04 | no repeats found | "Task Accuracy" is binary per task. Its 11 domain experts reviewed tasks during construction, not agent outputs. |

**None of the five reports a per-task consistency figure.** Thumbtack's Table 6
has no counterpart in any of them. There is a small tell in DataBench: its top
scores (70.5%, 67.0%, 65.0%, 62.5%, 61.3%) are not all whole numbers out of
100 tasks, so some averaging or partial credit is going on, and the blog does
not say which.

**The counterweight.** "Noise Floor Audit for Agent Benchmarks"
(arXiv:2608.22331) comes from Georgia Tech authors, some independent, and
several CMU alumni. It reran 150 frozen tool-calling tasks **10 times at
temperature 0** on three endpoints. The tasks come from BFCL, the Berkeley
Function-Calling Leaderboard, which tests whether a model calls tools with the
right arguments. It then reworded the prompts four semantics-preserving ways.
The results, from the abstract:

- "ever-flip fractions are 0.7%, 2.0%, and 2.7%". That is the share of tasks
  whose outcome changed at least once across reruns.
- "median perturbation paired SDs 11x to 58x larger than rerun paired SDs".
  SD here is standard deviation.

Its recommended reporting contract is to "publish the frozen instance list,
the prompt-template family, paired perturbation SDs, and a small
failure-character table with each headline score". It warns against applying
this to "agents whose errors emerge through environment state, tool side
effects, retrieval quality, or long-horizon planning". An analytics agent is
that kind of agent.

**2. How long ago.**
- BI-Bench: **2026-09-16**, 8 days before 2026-09-24.
- DI-Bench: 2026-09-04, 20 days.
- DataBench blog: 2026-08-13, 42 days. Leaderboard update: 2026-09-22, 2 days.
- DataSpace: 2026-08-04, 51 days.
- Noise Floor Audit: **2026-08-23**, 32 days.

**3. How it relates to what has already been read.** Filed under
**`efficacy-methodology`** (90 days), which admits every date above.
**`benchmarks-depth`** (30 days) would fail DataSpace (51 days), the Noise
Floor Audit (32 days) and the DataBench blog (42 days); that is named here so
the filing is visible. #26, #35 and #42 compared benchmarks on task counts,
provenance and what they score. None compared them on whether they rerun.
The breadth pass dropped DataSpace for angle 5; it appears here only as a row.

**4. What through-line it changes.** It extends "the vendors claim, the
customer measures" (breadth headline) to the academic side. **Repeat runs are
now common, but they are used to steady the mean, not to report
inconsistency.** It also puts a limit on the Thumbtack design. Its
repetitions vary only question order and sampling. Section 3.3: "The runner
resets state between questions and randomizes question order with fixed
seeds." It does not reword the questions. If the Noise Floor Audit's ratio
carried over to analytics agents, which its authors say not to assume, then
41 of 50 would understate instability. That matches the paper's own "lower
bounds" caveat, but for a reason the paper does not name.

**5. What to research next.**
- **Per-task solve counts in BI-Bench's released data.** BI-Bench's comments
  field says code and data are released. Do the released result files record
  each of the 10 runs per task? If so, compute the share of the 100 tasks
  solved in all 10 runs, in none, and in between, for one frontier model with
  and without tools. That would be the first published consistency figure for
  a BI agent. It is one table, so the driver may need to fetch it.
- **A reworded-question rerun of any analytics or text-to-SQL benchmark.**
  Find any in-window paper that reruns a text-to-SQL or data-agent benchmark
  with semantics-preserving rewordings of the question (not reorderings),
  and reports the variance from rewording against the variance from rerunning.
  That tests whether the Noise Floor Audit's 11x to 58x holds outside function
  calling.

**6. Source.** From open search. `arxiv.org` and `github.com` are on
`sources.md`; `hex.tech` is not.
- [BI-Bench HTML](https://arxiv.org/html/2609.20886v1): **full page read**,
  targeted at repeats and scoring, with the 10-run sentence verbatim.
- [BI-Bench abstract page](https://arxiv.org/abs/2609.20886): **full page
  read**, for the date.
- [DI-Bench HTML](https://arxiv.org/html/2609.05776v1) and
  [DataSpace HTML](https://arxiv.org/html/2608.03451v1): **full page read**,
  through a summarising fetch targeted at repeats.
- [Hex DataBench blog](https://hex.tech/blog/databench-agentic-analytics-benchmark/)
  and [DataBench leaderboard](https://hex.tech/databench/): **full page read**.
- [Noise Floor Audit abstract](https://arxiv.org/abs/2608.22331) and
  [HTML](https://arxiv.org/html/2608.22331v1): **full page read**, targeted.

**7. Verified / inferred / assumed.**
- **Verified:**
  - BI-Bench's 10-run sentence and its t-test design;
  - DI-Bench's temperature 0;
  - DataBench's majority-of-three-judges sentence and 96%;
  - the DataBench top-five scores;
  - the Noise Floor Audit's figures, protocol, recommendation and warning
    against generalising;
  - Thumbtack's fixed-seed sentence.
- **Inferred:**
  - **the absence of repeats in DI-Bench and DataSpace, and of a
    consistency figure in all five.** These rest on summarising fetches
    reporting that no such language was found. A summariser can miss a
    sentence.
  - that DataBench's non-integer scores mean averaging or partial credit.
- **Assumed:** that rewording would add instability to an analytics agent.
  The only evidence is from function calling, and its authors say it does not
  generalise.

---

### What was searched for and not found

- **A human critic of arXiv:2609.09182.** None was found. No citing paper, no
  blog post, and no Thumbtack post dated after 2026-08-28 turned up. The only
  critique is Pith's machine-generated review.
- **Definitions of Table 6's categories** anywhere in the paper. None was
  found, and no code or data release is mentioned.
- **A coverage rate in the case study's results tables.** None was printed,
  though Section 3.6 specifies one.
- **Any published pass rate from Hex Evals** with per-attempt detail. None,
  as the breadth pass also found.
- **Any in-window data-agent benchmark reporting per-task consistency** (a
  pass^k-style figure, or a solved-every-time share). None of the five
  checked does.

### What was dropped

- **"Beyond Pass@k: Measuring Reliability and Security of Agentic Code
  Generation" (arXiv:2608.14711, 2026-08-11, 44 days).** Coding agents. It
  argues that pass@k has been computed over unit tests rather than
  independent rollouts, with "0.96-0.98 reported vs. 0.00-0.12 corrected".
  It is directly on the method, but only the abstract was read, and its
  lesson (the aggregation rule decides the number) is item 2's lesson, shown
  with a different domain's data. It is the strongest candidate for a
  cross-domain item if this path goes on.
- **"One Success Isn't Reliability: Thinkingbox" (arXiv:2608.19741)** and
  **"Trace Integrity for LLM Data Agents" (arXiv:2608.26036).** Both are in
  window by identifier and on topic. They appeared in search listings only
  and were not read.
- **Thumbtack Engineering's April 2026 Medium post.** Out of window, and
  search summary only; noted as Background in item 1.

---

## Level 2 - Strict pass^5 on DataAgentBench's top entries

**For none of the top three entries is the per-query, per-run pass/fail
published. A submission file holds answers only, and the maintainer produces
the verdicts by running validators that nobody publishes the output of. What
the pull requests do publish is each dataset's passing-trial count, and that
is enough to bound strict pass^5 (the number of the 54 queries that pass on
all five runs). Permute EQ is 48 to 50, Camber 39 to 47, Scout 33 to 45.
Permute EQ stays first under the strict rule however the unknown trials fall.
Scout and Camber cannot be ordered by it. The order between those two is
already set before any strict rule is applied, by how the average is weighted.
Scout is second on the leaderboard's per-dataset average (0.9062 against
0.8790). Counted trial by trial, Camber passes more (245 of 270 against 242).
Permute EQ's strict-rule lead did not exist before its September reruns:
before them it was 43 to 46, inside Camber's range. Those reruns replaced four
wholly or mostly failed queries, and ran them under query-specific prompts.
Two agent benchmarks from outside the data field that do report pass^5 show
the size of what averaging hides. In both, the strict rule spreads models
roughly twice as far apart as the average does.**

---

### 1. DAB's top three do not publish per-query verdicts, but the per-dataset tallies bound pass^5: Permute EQ 48-50, Camber 39-47, Scout 33-45 of 54

**1. What it is.** **Pass^5** is the strict counterpart of Pass@1: a query
counts only if all five runs pass. **Pass@5** is the lenient one: at least one
run passes. **Pass@1**, as DAB uses it, is the average. DAB's submission rule
requires a results JSON of `dataset`, `query`, `run` and `answer`, "5 runs per
query, for every query in every dataset (270 trials total)", and traces. **The
file carries answers, not verdicts.** Permute EQ's file, read at the PR #95 head
commit, has exactly those four fields and no pass, score or correct field. The
maintainer scores each file by re-running each query's `validate.py`. The
leaderboard data file (`docs/data/leaderboards.json`) holds one `passAt1` per
entry and no per-query field. `docs/data/queries.json` holds question text only.

What is public is a per-dataset table in each pull request. Every figure below
is counted from those tables. Each dataset's query count comes from Scout's
trial counts ÷ 5. The totals are 54 queries and 270 trials, and each entry's
table recomputes to its published Pass@1.

| Dataset (queries) | Permute EQ passes | Camber passes | Scout passes |
|---|---|---|---|
| agnews (4) | 10/20 | 10/20 | 9/20 |
| bookreview (3) | 15/15 | 15/15 | 15/15 |
| crmarenapro (13) | 65/65 | 65/65 | 59/65 |
| DEPS_DEV_V1 (2) | 9/10 | 5/10 | 9/10 |
| GITHUB_REPOS (4) | 20/20 | 15/20 | 16/20 |
| googlelocal (4) | 20/20 | 19/20 | 20/20 |
| music_brainz_20k (3) | 15/15 | 15/15 | 15/15 |
| PANCANCER_ATLAS (3) | 15/15 | 14/15 | 15/15 |
| PATENTS (3) | 15/15 | 15/15 | 15/15 |
| stockindex (3) | 15/15 | 15/15 | 15/15 |
| stockmarket (5) | 24/25 | 25/25 | 24/25 |
| yelp (7) | 35/35 | 32/35 | 30/35 |
| **Trials passed** | **258/270** | **245/270** | **242/270** |

**The bounds.** Take a dataset with q queries and f failed trials. At least
q − f of its queries pass all five runs, and at most q − ⌈f ÷ 5⌉. A dataset with
no failures is exact. So is a dataset with one failure, where exactly one query
is 4 of 5.

| Entry | Pass@1 (leaderboard) | Pass^5, queries of 54 | Pass none of 5 | In between |
|---|---|---|---|---|
| Permute EQ | 0.9467 | **48 to 50** (0.889 to 0.926) | 0 to 2 | 2 to 6 |
| Camber | 0.8790 | **39 to 47** (0.722 to 0.870) | 0 to 4 | 3 to 15 |
| Scout | 0.9062 | **33 to 45** (0.611 to 0.833) | 0 to 4 | 5 to 21 |

*Driver's check:* every figure in this table and in the per-dataset tallies
below was re-derived by hand from the tallies quoted (no script could run in
this exploration). Scout: 242 passing trials, stratified 10.8748 ÷ 12 =
0.9062. Camber: 245, 10.5476 ÷ 12 = 0.8790. Permute EQ final: 258, with
failures only in agnews (10), stockmarket (1) and DEPS_DEV_V1 (1), giving
11.36 ÷ 12 = 0.9467. The pass^5 bounds come out the same: 48-50, 39-47 and
33-45.

- **Permute EQ.** The only uncertainty is agnews, where 10 of 20 passes spread
  over 4 queries gives 0 to 2 all-pass queries. Exactly two queries are known
  to be inconsistent: DEPS_DEV_V1 Q2 (4 of 5) and one stockmarket query (4 of 5).
- **Camber.** Exact on 37 queries. The open datasets are yelp (4 to 6
  all-pass), GITHUB_REPOS (0 to 3), agnews (0 to 2) and DEPS_DEV_V1 (0 to 1).
- **Scout.** Exact on 26 queries. The open datasets are crmarenapro (7 to 11),
  yelp (2 to 6), GITHUB_REPOS (0 to 3; at least one query has a failure) and
  agnews (0 to 1).

**Does the ranking hold?** At the top, yes. Permute EQ's minimum (48) is above
Camber's maximum (47) and Scout's maximum (45). **Ranks 2 and 3 are not
determined.** Camber's range (39 to 47) and Scout's (33 to 45) overlap. Camber
has the higher floor and the higher ceiling, but neither range excludes the
other order. The benchmark's own statistics script
points the other way: `stats_scripts/avg_pass_k.py` computes pass@k, the
lenient "at least one of k passes" figure, and nothing in the repository
computes the strict one.

**2. How long ago.**
- Permute EQ's final score was posted **2026-09-13** (11 days before
  2026-09-24). PR #95 was closed and the leaderboard data updated
  **2026-09-15** (9 days).
- Scout (PR #96) was opened 2026-09-08 (16 days) and added **2026-09-11** (13
  days).
- Camber (PR #92) was opened 2026-08-27 and merged **2026-08-30** (25 days).

**3. How it relates to what has already been read.** Filed under
**`benchmarks-depth`** (30 days), and every date passes. This is the arithmetic
Level 1's item 3 pointed at: it established that DAB averages five runs into
one number, and this puts numbers on what the average absorbs. It is the same
shape of result as Level 1's item 2 on Thumbtack's finance questions: from
published totals, a pass count under a stricter rule can be bounded but not
fixed. The difference is that here the bounds are narrow enough to decide
rank 1.

**4. What through-line it changes.** It sharpens "who sets the pass rule sets
the result" in a direction Level 1 did not reach. **At the very top of a live
data-agent leaderboard, the strict rule does not change the leader.** It does
open a gap between the average and the strict count that differs by entry:
about 3 to 7 points for Permute EQ against its raw 0.9556, 4 to 19 points for
Camber against its raw 0.9074, and 6 to 29 points for Scout against its raw
0.8963. Whether that gap reorders anything below
rank 1 cannot be read from what DAB publishes.

**5. What to research next.**
- **Fix Camber's pass^5 exactly by running DAB's validators on four datasets.**
  Camber's submission is on branch `submission/camber-v5-opus5-n5` of
  `Spartan-Linh-Truong/DataAgentBench` (PR #92). The file path was not visible
  in the rendered diff. Scoring only yelp, GITHUB_REPOS, agnews and DEPS_DEV_V1
  (17 queries, 85 trials) with each query's `validate.py` settles 39 to 47.
  Validators apply answer-section extraction for some entries, so the
  maintainer's scoring mode matters. Camber is scored "on the full answer
  text". This needs code execution, so it is an engineer's spike.
- **Fix Scout's pass^5 on its three widest datasets.** Scout's submission is
  on `WeiJiuQi/DataAgentBench` `main` (PR #96). Scoring crmarenapro, yelp,
  GITHUB_REPOS and agnews (28 queries, 140 trials) settles whether Scout falls
  below Camber under the strict rule. Also a spike.

**6. Source.** From open search. `github.com` and `raw.githubusercontent.com`
are on `sources.md`.
- [PR #95](https://github.com/ucbepic/DataAgentBench/pull/95): **full page
  read**, through three summarising fetches. The "258/270 raw, 0.9467
  stratified" line, the 257/0.9383 alternative and the closure event came
  back quoted.
- [Permute EQ submission file at the PR #95 head commit](https://raw.githubusercontent.com/ucbepic/DataAgentBench/02918bb09f4c2e92bc5f1918973b96b896041a6d/leaderboard_submissions/permute_eq.json):
  **read for its structure only.** The fetch returned the first 20 of 270
  objects. The file does not exist on `main`.
- [PR #96](https://github.com/ucbepic/DataAgentBench/pull/96) and
  [PR #92](https://github.com/ucbepic/DataAgentBench/pull/92): **full page
  read**. Each per-dataset table was reproduced on request and checked by
  recomputing Pass@1.
- [PR #88](https://github.com/ucbepic/DataAgentBench/pull/88) (Permute EQ's
  original submission): **full page read**, through a summarising fetch.
- [`docs/data/leaderboards.json`](https://raw.githubusercontent.com/ucbepic/DataAgentBench/main/docs/data/leaderboards.json),
  [`docs/data/queries.json`](https://raw.githubusercontent.com/ucbepic/DataAgentBench/main/docs/data/queries.json),
  [`SUBMISSION_RUBRIC.md`](https://raw.githubusercontent.com/ucbepic/DataAgentBench/main/SUBMISSION_RUBRIC.md),
  [`stats_scripts/avg_pass_k.py`](https://raw.githubusercontent.com/ucbepic/DataAgentBench/main/stats_scripts/avg_pass_k.py)
  and its README: **full page read**, through summarising fetches.

**7. Verified / inferred / assumed.**
- **Verified:**
  - Scout's and Camber's per-dataset tables as printed;
  - that each table recomputes to its Pass@1 (Scout 10.8748 ÷ 12 = 0.9062,
    Camber 10.5476 ÷ 12 = 0.8790);
  - that the submission file has no verdict field;
  - that the leaderboard JSON has no per-query field.
- **Inferred:**
  - **Permute EQ's final per-dataset column.** It is derived, not printed. See
    item 3 for the chain; every intermediate score it predicts matches one the
    maintainer published.
  - Camber's pass counts, which are its printed rates × trials. Each comes out
    a whole number.
  - every pass^5 bound, which is arithmetic anyone can redo from the table.
  - the absence of any per-query verdict file, which rests on directory
    listings and summarising fetches.
- **Assumed:** that the per-dataset tables in the pull requests are what the
  maintainer's final scoring produced. For Scout and Camber, no later rescore
  appears in the leaderboard's "sources" notes.

---

### 2. Ranks 2 and 3 are decided by how the average is weighted, before any strict rule: Scout leads per dataset, Camber leads per trial

**1. What it is.** DAB's Pass@1 is "the mean over datasets of each dataset's
average per-query pass rate". Each of the 12 datasets weighs 1/12, whatever
its size. crmarenapro has 13 queries and DEPS_DEV_V1 has 2, so one DEPS_DEV_V1
trial moves the score 6.5 times as much as one crmarenapro trial. Every query
here has five trials, so the per-query average and the raw trial rate are the
same number. Counted from the table in item 1:

| Entry | Stratified Pass@1 (per dataset) | Raw trial rate (per query) |
|---|---|---|
| Permute EQ | 0.9467 (rank 1) | 258/270 = **0.9556** (rank 1) |
| Scout | 0.9062 (**rank 2**) | 242/270 = **0.8963** (**rank 3**) |
| Camber | 0.8790 (**rank 3**) | 245/270 = **0.9074** (**rank 2**) |

**The two rules put 2 and 3 in opposite orders.** Scout loses most of its
trials in crmarenapro (6), yelp (5) and agnews (11). Those are large datasets,
so each loss is diluted. Camber loses most of its trials in DEPS_DEV_V1 (5 of
10) and agnews (10 of 20). DEPS_DEV_V1 is tiny, so each of those losses counts
heavily. Neither order is wrong: the leaderboard's is a decision to weight
datasets equally. **The size of that choice (2.7 points, Scout over Camber) is
bigger than any difference the strict rule can be shown to make between
them.**

**2. How long ago.** Scout was added **2026-09-11** (13 days) and Camber was
merged **2026-08-30** (25 days). The leaderboard data was last updated
**2026-09-15** (9 days).

**3. How it relates to what has already been read.** Filed under
**`benchmarks-depth`** (30 days). Level 1's item 3 quoted the stratified
definition without testing it. This is the test. It is the third case on this
path of an aggregation choice moving a result. Level 1's item 2 was the rule
for combining attempts, Level 1's item 4 was averaging over repeats, and this
is weighting across datasets. The leaderboard has also grown since Level 1's
PR #100 figure of "12 of 37" benchmark-informed entries. It now lists **40
entries, 13 of them "benchmark-informed"**, and all three entries here are in
that hidden-by-default group. *Driver's count:* **14 of 40** (ranks 1 to 12,
14 and 24), from the driver's own row-by-row listing of `overallLeaderboard`,
which agrees with Level 3 below. The same fetch's summary line said 12, so the
figure still rests on a summariser's listing, not on a script.

**4. What through-line it changes.** It adds a fourth rule to "who sets the
pass rule sets the result". **Before asking whether repeats are averaged,
check what is being averaged over.** On a benchmark where dataset sizes run
from 2 to 13 queries, weighting per dataset or per query is a ranking decision
on its own.

**5. What to research next.**
- **How many adjacent pairs flip between the two weightings across DAB's
  ranks 4 to 10.** Every leaderboard pull request carries a per-dataset table
  (Sentinel, Permute Core and the rest are linked from the `prUrl` fields in
  `leaderboards.json`). Recompute the raw trial rate for each, and count the
  adjacent rank pairs whose order reverses.
- **Whether DAB states why it weights by dataset.** Search the DAB issues and
  pull requests dated on or after 2026-06-26 for any maintainer statement on
  dataset-stratified against query-weighted scoring. The "sources" notes in
  `leaderboards.json` mention a full rescore on 2026-06-12. Check whether the
  weighting was set or changed then.

**6. Source.** From open search, on `sources.md` hosts. Built from the same
[PR #96](https://github.com/ucbepic/DataAgentBench/pull/96),
[PR #92](https://github.com/ucbepic/DataAgentBench/pull/92) and
[`leaderboards.json`](https://raw.githubusercontent.com/ucbepic/DataAgentBench/main/docs/data/leaderboards.json)
as item 1: **full page read**, through summarising fetches, with the tables
reproduced on request. The Pass@1 definition is from the
[raw README](https://raw.githubusercontent.com/ucbepic/DataAgentBench/main/README.md),
**full page read**.

**7. Verified / inferred / assumed.**
- **Verified:**
  - the printed stratified scores;
  - Scout's 242, which is summed from its printed passing-trial counts;
  - the 40 entries and 13 benchmark-informed, as the fetch counted them.
- **Inferred:** Camber's 245, which is rates × trials. Each product is a whole
  number, which is what a correct reading predicts.
- **Assumed:** that the maintainer's scoring for every entry uses the same
  per-dataset query counts. The Scout table is the only one that prints trial
  counts.

---

### 3. Permute EQ's strict-rule lead was made by its reruns: four failed or mostly failed queries went to 5 of 5, under query-specific prompts

**1. What it is.** Permute EQ's per-query history can be reconstructed exactly
for every query that was rerun. Each step below is pinned by a score the
maintainer published.

- **Before PR #95, 0.8713 and 238 of 270.** PR #88's answer-section rescore
  gave 0.8658 and "micro 237/270". The per-dataset table recomputes to both.
  Re-scoring one bookreview trial upward took it to 0.8713.
- **GITHUB_REPOS Q2: 0 of 5 → 5 of 5.** Accepting only this rerun gave 0.8922,
  and that is exactly 0.8713 plus a quarter of a dataset (GITHUB_REPOS going
  from 15 of 20 to 20 of 20). A gain of 5 trials from rerunning 5 trials means
  every original trial had failed. It also means the other three GITHUB_REPOS
  queries were 15 of 15.
- **crmarenapro Q3, Q7, Q9: 5 of 15 → 15 of 15.** The dataset went from 55 of
  65 to 65 of 65 ("all 15 passing"). So the other ten queries were 50 of 50,
  and the three rerun queries had passed 5 of their 15 original trials between
  them.
- **DEPS_DEV_V1 Q1: 0 of 5 → 5 of 5.** The submitter wrote "257/270 raw,
  0.9383" or "258/270 raw, 0.9467", depending on whether run 4 counted. Only
  DEPS_DEV_V1 at 9 of 10 gives 0.9467. The dataset was 4 of 10 before, so Q1
  went up by exactly 5 and Q2 is 4 of 5.

That is 25 rerun trials. Beside the "245 answer-trace pairs" left unchanged,
that makes 270.

**What it did to pass^5.** Before the reruns, Permute EQ passed all five runs
on **43 to 46** of 54 queries. Camber's range is 39 to 47, so the strict rule
would not have put Permute EQ first. On Pass@1 it was below Camber (0.8713
against 0.8790), and it was below Camber on raw trials too (238 against 245).
The reruns added **4 or 5** all-pass queries and 20 passing trials, which put
it at 48 to 50.

**The prompts changed with the reruns.** The leaderboard's note on the entry,
verbatim:

> "Those reruns use query-specific prompts (5 prompt variants across the 54
> queries); crmarenapro q3/q7/q9 carry a CONDITIONAL EXECUTION RULES block not
> present in the other 51 queries."

The maintainer's final comment lists the variants: "Prompt 2 + conditional
rules" for crmarenapro q3, q7 and q9; "Prompt 2 + GitHub repos variant" for
github_repos q2; and "Prompt 2 minus tiebreaker rule" for deps_dev_v1 q1.
*Corrected at level 3:* those three labels are paraphrases, not quotations.
The table's own wording is "Prompt 2 + `CONDITIONAL EXECUTION RULES`",
"Prompt 2 + `USE ONLY FOR GITHUB REPOS Q2`", and "Prompt 2 + `USE ONLY FOR
GITHUB REPOS Q2`, minus the tiebreaker rule (p)" (for deps_dev_v1 q1). So the
block added for GITHUB_REPOS Q2 names that query, and it was reused for a query
in a different dataset. The disclosure is thorough. What it discloses is that **every rerun query ran
under a prompt written after its failures were seen.** Level 1 assumed "the
same frozen setup" was frozen. It was frozen across the five rerun trials. It
was not the setup of the original submission.

**Rank 2 replaced trials too, for a different reason.** On Scout, the
maintainer asked on 2026-09-08: "Were failed runs dropped and replaced? The
leaderboard requires five unselected trials per query". The reply
(2026-09-09): "we removed the affected dataset-level trials, renumbered the
subsequent trials to close the gaps, and ran additional trials". Those trials
were removed because the LLM API crashed, not because the answers were wrong.
It was accepted on 2026-09-11.

**2. How long ago.** The maintainer's final comment was **2026-09-13** (11
days). The leaderboard note is as of **2026-09-15** (9 days). Scout's exchange
ran **2026-09-08** to **2026-09-11** (16 to 13 days). PR #88's rescore,
**2026-08-18** (37 days), is supporting arithmetic.

**3. How it relates to what has already been read.** Filed under
**`benchmarks-depth`** (30 days). PR #88's 2026-08-18 date fails that window at
37 days. It is admitted as supporting detail under **`efficacy-methodology`**
(90 days), and that assignment is named here. This resolves Level 1's item 3
inference that query-level selection "remains possible". **It happened, it
was disclosed, and it was accepted, and it moved the strict ranking as well as
the average.** It also resolves that item's "assumed" line on the frozen setup.

**4. What through-line it changes.** "A repeat-run rule is only as strong as
the rerun policy around it" (Level 1) now has a measured instance. **Averaging
did not hide inconsistency at rank 1. It hid how rank 1 was reached.** A
strict rule applied to the submission as it stands cannot tell a query that
was consistent the first time from one rerun whole under a new prompt.

**5. What to research next.**
- **The text of the CONDITIONAL EXECUTION RULES block.** The maintainer's
  comment on PR #95 says the prompts were supplied. Find the prompt files in
  the Permute EQ traces or the PR's attachments, and quote the block used for
  crmarenapro q3/q7/q9. Does it state something specific to those questions (a
  filter, a join, a tie rule) that the other 51 queries' prompt lacks?
- **Scout's discarded trials: how many, which datasets, and what they
  scored.** From PR #96's comments and traces, record how many dataset-level
  trials were removed after API crashes, whether the removed trials' partial
  answers survive in the traces, and whether the maintainer wrote any rule
  separating crash-driven from correctness-driven replacement.

**6. Source.** From open search, on `sources.md` hosts.
- [PR #95](https://github.com/ucbepic/DataAgentBench/pull/95): **full page
  read**. The prompt-variant table and the 257/258 alternatives came back
  quoted.
- [PR #88](https://github.com/ucbepic/DataAgentBench/pull/88): **full page
  read**, through a summarising fetch. The table came back and recomputes
  exactly.
- [PR #96](https://github.com/ucbepic/DataAgentBench/pull/96): **full page
  read**. Both maintainer quotes and the reply came back verbatim.
- [`leaderboards.json`](https://raw.githubusercontent.com/ucbepic/DataAgentBench/main/docs/data/leaderboards.json):
  **full page read**. The note was re-fetched character for character.

**7. Verified / inferred / assumed.**
- **Verified:**
  - the published scores 0.8658 and 237, 0.8713, 0.8922, 0.9383 and 257,
    0.9467 and 258;
  - the leaderboard note on query-specific prompts;
  - the prompt-variant list;
  - Scout's replacement exchange.
- **Inferred:** each per-query before and after count (0 of 5 → 5 of 5, 5 of
  15 → 15 of 15, and DEPS_DEV_V1 Q2 at 4 of 5). These are this run's
  arithmetic, and each is the only assignment consistent with the published
  scores. The same goes for the 43 to 46 before-rerun range.
- **Assumed:** that no other trial's verdict changed between PR #88's rescore
  and the final score, apart from the one bookreview trial. The "245
  unchanged" statement covers answers, not verdicts. A validator change
  elsewhere would break the chain, and the leaderboard's "sources" notes name
  none after 2026-08-18.

---

### 4. Two in-window agent evaluations that do report pass^5 find the strict rule spreads models about twice as far as the average

**1. What it is.** These two are the counterpart to DAB, and neither is a data
agent.
- **APIFlow-Bench** (arXiv:2608.29128, **Postman, Inc.**, which makes an API
  testing tool) runs "467 tasks × 5 epochs for each model, temperature 1.0". It
  reports "pass@5 (any epoch passed), pass1 (the mean), and pass5 (all five
  passed), the reliability statistic". Verbatim:
  - "all-five-of-five spreads the same panel across 44 points (42.2–86.1%),
    double the 20.5-point pass1 spread";
  - "Consistency is where small models pay: gpt-5.4-mini drops 26.3 points
    from pass1 to pass5 and gpt-5-mini 14.6, against 1.8–3.8 for the frontier
    tier";
  - "The leaderboard is therefore mostly a consistency ranking."
- **IBM Research, "Your Agent Aced the Task. Will It Do It Again?"** (Hugging
  Face blog). On AppWorld, a benchmark of multi-app everyday tasks, "a ReAct
  agent using GPT-4.1 succeeded on 77.4% of runs across five repetitions. But
  it succeeded in all five runs for only 53.0% of tasks". Its definition:
  "Pass^k ≤ Mean@k ≤ Pass@k, always."

**Set beside DAB's top three,** the frontier drop of 1.8 to 3.8 points is about
Permute EQ's size: 3 to 7 points below its raw 0.9556. Camber's gap (4 to 19
points) and Scout's (6 to 29) could be anything from frontier-sized to
small-model-sized. The published data cannot say which.

**2. How long ago.** APIFlow-Bench v1: **2026-08-29**, 26 days before
2026-09-24. IBM blog: **2026-09-15**, 9 days.

**3. How it relates to what has already been read.** Filed under
**`efficacy-methodology`** (90 days). That line counts lessons from any agent
domain. **`agent-efficacy`** (30 days) would also pass both. Level 1's item 4
found that no in-window **data-agent** benchmark reports per-task consistency.
That still stands. These are in-window agent evaluations outside data that
do, which shows the omission is a choice, not a limit of the method. The
Noise Floor Audit (Level 1's item 4) found little variation from reruns on
function calling at temperature 0. APIFlow-Bench runs at temperature 1.0 on
long workflows, and finds reliability is where the ranking is decided.

**4. What through-line it changes.** It gives the strict rule an external
scale. **Where pass^5 is reported, the spread between models roughly doubles,
and the smaller models lose most.** DAB's top three are all frontier-class,
and at rank 1 the published data put the gap at frontier size. The question
that stays open is whether it does for ranks 2 and 3.

**5. What to research next.**
- **Whether APIFlow-Bench's pass1 and pass5 orders disagree for any adjacent
  pair of models.** The paper gives both only in Figure 3(b), with no table.
  Its released 44,362 transcripts should allow both rankings to be listed.
  Record any pair that swaps.
- **Whether IBM's intervention raises pass^5 more than Mean@5.** The post
  gives GPT-4.1's baseline and mentions gpt-oss-120b qualitatively. Read its
  results section for the ALTK-Evolve configuration's Mean@5 and Pass^5, and
  state whether consistency moved separately from accuracy.

**6. Source.** From open search. `arxiv.org` is on `sources.md`;
`huggingface.co` is not.
- [APIFlow-Bench abstract](https://arxiv.org/abs/2608.29128): **full page
  read**.
- [APIFlow-Bench HTML](https://arxiv.org/html/2608.29128v1): **full page
  read**, through two targeted fetches. All three sentences came back
  verbatim.
- [IBM Research on Hugging Face](https://huggingface.co/blog/ibm-research/altk-evolve-consistency):
  **full page read**, through one summarising fetch. The 77.4%/53.0% sentence
  and the definition came back verbatim.

**7. Verified / inferred / assumed.**
- **Verified:** every quoted figure, APIFlow-Bench's run protocol, the date
  and affiliation of each source.
- **Inferred:** the comparison with DAB's gaps. It is this run's arithmetic
  across different benchmarks and different task types.
- **Assumed:** that "frontier tier" in APIFlow-Bench is comparable to Claude
  Opus 5 and GLM-5.2 as run on DAB. The paper's panel was not checked for
  those models.

---

### What was searched for and not found

- **Per-query or per-trial verdicts for any of the three entries.** Not in the
  pull request bodies or comments, `docs/data/leaderboards.json`,
  `docs/data/queries.json`, `failure_analysis/`, or `leaderboard_submissions/`
  on `main`. That directory lists one file,
  `claude-opus-4-6_results.json`, and Permute EQ's `permute_eq.json` returns
  404 on `main`.
- **Where Scout's and Camber's submission files sit.** Each "Files changed"
  view shows one `.json` file but did not render its path.
- **A pass^k (strict) script in DAB.** `stats_scripts/` has
  `avg_pass_k.py`, which computes pass@k, the lenient direction.
- **A published pass^5, or any per-query consistency discussion, for
  DAB.** A search for it returned only PR #95 and forks of the repository.
- **A written DAB rerun policy.** `SUBMISSION_RUBRIC.md` says only "If
  something doesn't line up, we'll point it out on the PR". The rule "five
  unselected trials per query" exists in a PR #96 comment, not in a file.

### What was dropped

- **"Beyond pass@1: A Reliability Science Framework for Long-Horizon LLM
  Agents" (arXiv:2603.29231).** Its identifier dates it to March 2026, which
  is outside the window.
- **"The Reliability Gap: Agent Benchmarks for Enterprise" (simmering.dev).**
  It appeared in search results only. It is undated as seen and was not read.
- **DAB PRs #99 and #104** (newer entries, 70.87% and 82.01%). They are below
  the top three, and outside this lead.

---

## Level 3 - The rerun rules behind DataAgentBench's rank 1, and the rule that would have stopped them

**The text of the CONDITIONAL EXECUTION RULES block is not public anywhere a
page fetch can reach. It is not in the PR thread, the leaderboard data, the
submitter's fork, or the submitter's own paper. It exists only inside a 6.1 MB
trace archive attached to PR #95, and reading it means unzipping that archive.
What is public is the block's label, the label of a second block that names the
query it was written for ("USE ONLY FOR GITHUB REPOS Q2"), and the history
around both. The maintainers' answer to prompts written after failures was to
disclose them, not to exclude them. They added a footnote on 2026-09-13 and
removed it on 2026-09-15. Since then the entry has carried only the same
"Tuned prompt" tick as every other entry in DAB's top twelve. Nothing written
in DAB governs reruns. The submitter asked for a rerun rule the day after the
tuned entries were hidden, and two more requests for clarification are open
with no answer. One in-window agent benchmark does write the rule down: rerun
only provider or harness failures, and give a rerun tuned after low scores a
separate label. Applied to DAB, that rule turns on one rerun more than on
the three the lead is about. The crmarenapro reruns are worth 1.3 points and
do not decide rank 1. The DEPS_DEV_V1 Q1 rerun is worth 4.2 points, because
its dataset has two queries, and it does decide rank 1. So the answer to "what
is the leaderboard measuring" depends on how one rerun is classified, and DAB
has not written down how to classify it.**

---

### 1. The block itself is unpublished, but its labels, its trigger and its predecessor are public, and the predecessor was described two different ways

**1. What it is.** **DataAgentBench** (DAB) is the Berkeley and Hasura
PromptQL benchmark of 54 data questions over 12 datasets (Levels 1 and 2). A
**trace** is the full log of one agent run. A **validator** is the per-query
script that marks an answer right or wrong. Here is what could and could not be
found of the prompts behind Permute EQ's reruns.

- **The labels, verbatim.** The maintainer's 2026-09-13 comment on PR #95
  opens "For reference, here is what we see across the 54 queries:". Its table
  assigns:
  - "Prompt 1" to 24 queries;
  - "Prompt 2" to 25;
  - "Prompt 2 + `CONDITIONAL EXECUTION RULES`" to crmarenapro q3, q7 and q9;
  - "Prompt 2 + `USE ONLY FOR GITHUB REPOS Q2`" to github_repos q2;
  - "Prompt 2 + `USE ONLY FOR GITHUB REPOS Q2`, minus the tiebreaker rule (p)"
    to deps_dev_v1 q1.

  The submitter's description adds, verbatim: "No query mixes prompt versions
  across its five trials." The block written for one GitHub query was reused on
  a package-dependency query in another dataset, with one rule removed.
- **The movement between prompts** (this level's arithmetic). The leaderboard
  note says the original submission used "Two fixed prompts ... across a 27/27
  split". The final table has 24 on Prompt 1 and 30 on Prompt 2 or a variant of
  it (25 + 3 + 1 + 1). So the three crmarenapro queries **moved from Prompt 1
  to Prompt 2 plus a new block** when they were rerun. The maintainer's comment
  confirms it: the description's "'CRM Q3, Q7, and Q9 all use the original
  Prompt 1'" was "no longer true after the reruns".
- **The trigger for each rerun, as the submitter gave it.** GITHUB_REPOS Q2 was
  rerun "following the clarified query wording in [GITHUB_REPOS Query 2 ground
  truth violates the language requirement #87]". DEPS_DEV_V1 Q1 was rerun
  "following the tie-validator update in [DEPS_DEV_V1 Query 1 has an
  unresolved 95-way cutoff tie #86]". Both issues were opened on 2026-08-05 by
  ericmillsio, the PR's author. #87 reports that the expected Swift repository
  is mostly C++ by byte count; #86 reports that "95 packages tie for fifth".
  **No benchmark change is cited for the three crmarenapro reruns.**
- **The predecessor prompt was described two ways.** In PR #88, on
  2026-08-07, the submitter wrote: "the second adds two question-specific
  formatting rules affecting presentation only, not evidence, analysis, or
  answer selection. No other question-specific tuning was used." The
  leaderboard's own note on the entry says the second prompt "carries three
  question-scoped rules, two presentational and one, scoped to GITHUB_REPOS
  q1, governing population selection." So the maintainers' reading found a
  third rule, and it is one that does select the answer.
- **Where the text is.** PR #95 links `permute_eq_traces.zip` (6.1 MB).
  Fetched, it is compressed binary. The fork `permute-ai/DataAgentBench`,
  branch `permute-eq-resubmission`, carries `leaderboard_submissions/permute_eq.json`
  and no prompt file of its own. Permute's paper (item 3) reproduces no prompt
  text.

**2. How long ago.**
- The maintainer's prompt table: **2026-09-13**, 11 days before 2026-09-24.
- PR #95 was closed on **2026-09-15**, 9 days.
- Issues #86 and #87: 2026-08-05, 50 days.
- PR #88's two-rules sentence: 2026-08-07, 48 days.

**3. How it relates to what has already been read.** Filed under
**`benchmarks-depth`** (30 days). The 2026-09-13 table and the 09-15 closure
pass. The August dates fail that window. They are admitted as supporting
detail under **`efficacy-methodology`** (90 days), and that assignment is named
here. This is Level 2 item 3's first lead, answered as far as a fetch allows,
and it corrects that item's paraphrased labels in place. It also weakens Level
2's "every rerun query ran under a prompt written after its failures were
seen" for two of the five queries. The benchmark itself changed under them
(the question wording for GITHUB_REPOS Q2, the validator for DEPS_DEV_V1 Q1),
so a rerun there does not have to be a response to failure alone.

**4. What through-line it changes.** It adds a disclosure point to "a
repeat-run rule is only as strong as the rerun policy around it". **What was
disclosed is the name of each block, not its content.** A label like
`CONDITIONAL EXECUTION RULES` tells a reader that a query-specific rule exists.
It does not say whether the rule hands over "the decisive interpretation" that
DAB's rubric forbids (item 3). The PR #88 episode shows why the content
matters. The submitter's own account ("presentation only") and the
maintainers' reading ("governing population selection") disagreed about a
rule both of them had seen.

**5. What to research next.**
- **Unzip `permute_eq_traces.zip` (the 2026-09 attachment, file id 32134035)
  and quote the block.** Search the crmarenapro q3, q7 and q9 run files for
  `CONDITIONAL EXECUTION RULES`, and the github_repos q2 and deps_dev_v1 q1
  files for `USE ONLY FOR GITHUB REPOS Q2`. Record whether either block names a
  table, filter, join, threshold or tie rule that the question does not state.
  This needs code execution, so it is an engineer's spike.
- **What the clarified GITHUB_REPOS Q2 wording says, and when it changed.**
  Issue #87 is closed. The page as fetched shows no closing commit. Find the
  commit that edited `query_GITHUB_REPOS/query2`, and compare its date with the
  rerun's. A rerun on a changed question is a different kind of event from a
  rerun on the same question.

**6. Source.** From open search. `github.com` and `arxiv.org` are on
`sources.md`.
- [PR #95](https://github.com/ucbepic/DataAgentBench/pull/95): **full page
  read**, through six summarising fetches. The table, the "No query mixes"
  sentence and the Prompt 1 sentence were re-asked for character-for-character
  wording.
- [PR #88](https://github.com/ucbepic/DataAgentBench/pull/88): **full page
  read**, through two summarising fetches. The two-rules sentence came back
  verbatim.
- [Issue #86](https://github.com/ucbepic/DataAgentBench/issues/86) and
  [issue #87](https://github.com/ucbepic/DataAgentBench/issues/87): **full page
  read**. Only the opening posts rendered, with no comments or closing event.
- [`leaderboards.json`](https://raw.githubusercontent.com/ucbepic/DataAgentBench/main/docs/data/leaderboards.json):
  **full page read**. The Permute EQ object was returned whole.
- [Fork tree, `permute-ai/DataAgentBench@permute-eq-resubmission`](https://api.github.com/repos/permute-ai/DataAgentBench/git/trees/permute-eq-resubmission?recursive=1):
  **read, truncated.** The listing cut off inside the query directories.
- [`permute_eq_traces.zip`](https://github.com/user-attachments/files/32134035/permute_eq_traces.zip):
  **reached, not readable.** It is binary. The fetch named four agnews run
  files and nothing else.

**7. Verified / inferred / assumed.**
- **Verified:**
  - the five labels and their query assignments;
  - "No query mixes prompt versions";
  - the Prompt 1 sentence;
  - the two issue titles, dates and author;
  - the PR #88 sentence and the leaderboard's "three question-scoped rules"
    note.
- **Inferred:**
  - that the crmarenapro queries moved from Prompt 1 to Prompt 2. This is
    27 − 24 = 3, backed by the maintainer's sentence.
  - that the block's text is in the trace archive. The traces are the only
    place a per-run prompt would be recorded, and the archive was not
    readable.
  - that the fork carries no prompt file. The tree listing was truncated.
- **Assumed:** that the maintainers' "three rules" reading comes from reading
  the traces. The note does not say how it was reached.

---

### 2. The maintainers disclosed the query-specific prompts in a footnote, then removed the footnote two days later, and the remaining tick is shared by all of the top twelve

**1. What it is.** The maintainer's answer to prompts written for failed
queries was disclosure. The disclosure then shrank.

- **Added, 2026-09-13** (commit `8e60569`, "Update Permute EQ to 0.9467 (PR #95
  reruns)"). The entry went from rank 3 at 0.8713 to rank 1 at 0.9467. Its row
  gained a marker, and the README gained, verbatim:

  > "**⁷** Permute EQ ([#95]) uses query-specific prompts: 5 prompt variants
  > across the 54 queries, with the per-query assignment listed in the PR."

  The maintainer told the submitter the same day: "We have added a short
  footnote to your leaderboard entry noting that query-specific prompts are
  used and pointing here for the detail."
- **Removed, 2026-09-15** (commit `0290945`). The message, verbatim: "Remove
  footnote 7 (Permute EQ) from leaderboard README. Drops the query-specific
  prompts footnote and its row marker. The Tuned prompt column still marks the
  entry, and the per-query prompt detail remains in docs/data/leaderboards.json."
  Nothing in the PR #95 thread asks for the removal. The submitter's last
  comment there, on 2026-09-14, is "Thanks! I've updated the PR title +
  description."
- **What stayed.** Footnotes 2 to 6 are still under the README table, and each
  records a problem with another entry's runs. For example: "⁵ fabric-rlm
  ([#76]) had 8 agnews trials counted as non-passes: 4 loaded external gold
  labels, and 4 submitted the gold value with no derivation in the supplied
  traces." None of them concerns prompts.
- **The tick that remains.** The "Tuned prompt" column is defined verbatim as
  "✓ = the up-front prompt is DAB-specific, built from a close study of DAB's
  task conventions (domain rules, parsing and interpretation choices, and
  expected answer shapes)". It dates from 2026-07-17 (commit `62dc7da`,
  "rename column to Tuned prompt"). In `leaderboards.json` Permute EQ's
  `promptGroup` is `"benchmark-informed"`. So it is **hidden by default** on
  the website since PR #100. By this level's count of an enumerated listing of
  `overallLeaderboard`, **ranks 1 to 12 are all "benchmark-informed", and so
  are ranks 14 and 24: 14 of 40.** (Level 2 recorded 13 of 40. A separate
  summarising fetch said 15.)
- **So the default view has a different leader.** The first entry that is not
  ticked is rank 13, "Spacedock (Recce) (GPT-5.5)", at **0.7850**. That is
  16.2 points below Permute EQ.

**2. How long ago.** Footnote added **2026-09-13** (11 days). Removed
**2026-09-15** (9 days). Column renamed 2026-07-17 (69 days).

**3. How it relates to what has already been read.** Filed under
**`benchmarks-depth`** (30 days). The footnote dates pass; the 2026-07-17
column date fails at 69 days and is supporting detail under
**`efficacy-methodology`** (90 days), named here. Level 1 recorded PR #100's
hiding rule. This shows what it does to the question in the lead. **"Tuned"
and "query-specific" are one tick.** A single DAB-specific prompt used for all
54 queries, and five prompts including blocks named for single queries, are
marked the same way.

**4. What through-line it changes.** It changes "the vendors claim, the
customer measures" (breadth headline) into a statement about the measurer.
**DAB now shows two leaderboards, sixteen points apart at the top, and the line
between them is drawn by a classification whose criteria are not written
down** (item 3). With the footnote gone, the README no longer separates a
tuned prompt from a prompt written for one query.

**5. What to research next.**
- **Why the footnote was removed.** The commit message gives what replaced it,
  not why. Search DAB's issues, PRs and commits from 2026-09-15 onward for any
  statement on per-entry prompt footnotes, and check whether any other entry
  has had one added or removed.
- **Where Permute EQ ranks among the tuned entries on the website's "Show all"
  view, and whether that view's "Highly tuned" column separates query-specific
  prompts.** The website rendered no table rows when fetched. The PR #100
  preview screenshots may show the column's values.

**6. Source.** From open search, on `sources.md` hosts.
- [Commit `8e60569`](https://github.com/ucbepic/DataAgentBench/commit/8e60569)
  and [commit `0290945`](https://github.com/ucbepic/DataAgentBench/commit/0290945):
  **full page read**. Both diffs came back line for line.
- [Raw README](https://raw.githubusercontent.com/ucbepic/DataAgentBench/main/README.md):
  **full page read**, through four fetches. The header, the definition, rows
  1 to 3 and 13, and footnotes 1 to 6 came back verbatim.
- [`leaderboards.json`](https://raw.githubusercontent.com/ucbepic/DataAgentBench/main/docs/data/leaderboards.json):
  **full page read**. All 40 `overallLeaderboard` lines were listed on request.
- [README history, 2026-06-26 to 2026-08-18](https://github.com/ucbepic/DataAgentBench/commits/main/README.md)
  and [`leaderboards.json` history](https://github.com/ucbepic/DataAgentBench/commits/main/docs/data/leaderboards.json):
  **full page read**.
- [PR #95](https://github.com/ucbepic/DataAgentBench/pull/95): **full page
  read**, for the "short footnote" sentence.

**7. Verified / inferred / assumed.**
- **Verified:**
  - the footnote's text, both commits and their dates;
  - the removal message;
  - `"promptGroup": "benchmark-informed"`;
  - the column definition and its 2026-07-17 rename;
  - Spacedock's row at 0.7850 with an empty tick cell.
- **Inferred:**
  - **14 of 40.** It is this level's count from a listing returned by a
    summariser. Two other fetches of the same file disagreed, so it needs a
    scripted count. *Driver's check:* a fourth fetch listed all 40 rows with
    their `promptGroup`, and the rows give 14 again (ranks 1-12, 14, 24).
  - that nothing in the thread asked for the removal. This is an absence in
    a summarised page.
- **Assumed:** that the website's default view excludes exactly the
  `benchmark-informed` group, as PR #100's description says. The website's
  table did not render.

---

### 3. DAB has no written rule on reruns. The submitter asked for one, two more requests are open, and the submitter's paper reports the score without the reruns

**1. What it is.** The lead asked what DAB's rules now say about reruns.

- **`SUBMISSION_RUBRIC.md`** has one commit, "Add submission validity
  rubric", dated **2026-07-03**. The word "rerun" does not appear in it. Its
  only "re-run" is the maintainers' own: "we **re-run** each submission's
  answers through the official validators". Its coverage rule is "**5 runs per
  query**, for every query in every dataset (270 trials total)". There is
  nothing on which runs may be replaced.
- **What the rubric does say about prompts** is its leakage rule, verbatim: a
  prompt may not contain "a planner/spec block that hands over the specific
  value, the exact set of rows, or the decisive interpretation the gold answer
  depends on, rather than letting the agent derive it." Whether the
  CONDITIONAL EXECUTION RULES block does that cannot be judged without its text
  (item 1).
- **The only rerun rules on record live in PR comments**, not in files. One is
  the 2026-09-03 refusal of "replacing only the trials that failed" (Level 1).
  The other is "five unselected trials per query" (PR #96, Level 2).
- **The submitter asked for the rule.** On 2026-09-14, the day after PR #100
  merged, ericmillsio asked the maintainers to "expand the submission
  guidelines with concrete criteria and examples for 'highly tuned'". The
  reruns bullet, verbatim:

  > "Reruns: How do you distinguish unchanged-setup reruns, corrections
  > following revised questions or harness bugs, and changes targeting
  > analytical failures? A rerun doesn't inherently require a prompt or
  > harness change."

  He closed with: "Since this change makes the classification determine
  default leaderboard visibility, it would help to publish the criteria and
  apply them consistently across submissions." **No reply follows.**
- **Two more requests are open with no reply.**
  - Issue #109 (2026-09-20, marc-shade) asks whether a tuned prompt may "state
    the intended reading of a query" that an earlier issue listed as
    ambiguous. It sets the tuned-prompt definition against Rubric 2.2 and
    hypothesises that each kind of rule becomes leakage "when applied
    per-query".
  - Issue #110 (2026-09-22, ldzhouquan) asks whether profiling that
    "incidentally produces a fact decisive for a benchmark question" is
    disallowed.
- **The submitter's paper.** "Learned Enterprise Data Comprehension:
  Compression and Routing for Data Agents" (arXiv:2609.25286) is by Ethan
  Torres and Eric Mills, both of permute.ai. Its abstract reports "94.67%
  dataset-macro stratified Pass@1 over five complete trials and 258/270
  successful raw query attempts ... ranking first among 40 leaderboard
  entries". Its reproducibility statement, verbatim: "The validation protocol
  prohibited access to gold-standard answers and prohibited benchmark-specific
  information or leading cues from being incorporated into the system inputs or
  prompts." Asked for reruns, prompt variants, crmarenapro, the conditional
  rules block, or the "benchmark-informed" label, a fetch of the full text found
  none of them.

**2. How long ago.**
- The submitter's request: **2026-09-14**, 10 days before 2026-09-24.
- Issue #109: 2026-09-20, 4 days. Issue #110: 2026-09-22, 2 days.
- The paper: submitted **2026-09-21**, 3 days.
- The rubric: 2026-07-03, 83 days.

**3. How it relates to what has already been read.** Filed under
**`efficacy-methodology`** (90 days), which admits the rubric's 83 days.
**`benchmarks-depth`** (30 days) would fail the rubric and admit everything
else; that is named here so the filing is visible. Level 2 found no written
rerun policy. This confirms that, and adds that the question has now been put
to DAB three times in nine days and answered none of those times. The paper
is the path's second case of a result reported in two places that do not
agree on method. The first was Spider 2.0-AIFunc's paper against its release,
in the 2026-09-23 exploration. Here, the leaderboard records query-specific
prompts and a "benchmark-informed" group, and the paper reports the same
258/270 under a protocol that "prohibited benchmark-specific information".

**4. What through-line it changes.** "Who sets the pass rule sets the result"
gains a clause. **Where the rule is not written, whoever classifies each case
sets the result, and the classification is being made one pull request at a
time.** The submitter's own three-way split (unchanged reruns, corrections
after a revised question or a harness bug, changes aimed at failures) is the
most precise statement of the rule anyone in this dispute has made. The
maintainers have not adopted it.

**5. What to research next.**
- **Whether DAB answers the 2026-09-14 request, #109 or #110, and with what
  wording.** Watch `SUBMISSION_RUBRIC.md` and the README for a first commit
  after 2026-07-03 that mentions reruns, and record whether it splits reruns
  the way the submitter did.
- **Whether arXiv:2609.25286 discloses the reruns anywhere the fetch missed.**
  Read its Experiments section and Appendix C (a sample execution trace) in
  full, and check the trace's prompt against the five variants' labels. If the
  sample is a crmarenapro q3, q7 or q9 trial, it may carry the block.

**6. Source.** From open search. `github.com`, `raw.githubusercontent.com` and
`arxiv.org` are on `sources.md`.
- [`SUBMISSION_RUBRIC.md`](https://raw.githubusercontent.com/ucbepic/DataAgentBench/main/SUBMISSION_RUBRIC.md):
  **full page read**, through four fetches. The leakage and coverage
  paragraphs and every "run" sentence came back verbatim.
- [Rubric history](https://github.com/ucbepic/DataAgentBench/commits/main/SUBMISSION_RUBRIC.md):
  **full page read**.
- [PR #100](https://github.com/ucbepic/DataAgentBench/pull/100): **full page
  read**. The 2026-09-14 comment came back verbatim on a second request.
- [Issue #109](https://github.com/ucbepic/DataAgentBench/issues/109) and
  [issue #110](https://github.com/ucbepic/DataAgentBench/issues/110): **full
  page read**, through summarising fetches. The quoted phrases are from those
  summaries' quotations.
- [arXiv:2609.25286 abstract](https://arxiv.org/abs/2609.25286): **full page
  read**. [HTML full text](https://arxiv.org/html/2609.25286): **full page
  read**, through two targeted fetches.

**7. Verified / inferred / assumed.**
- **Verified:**
  - the rubric's single commit and date, and its leakage and coverage wording;
  - the submitter's comment and its date;
  - the paper's authors, affiliations, date, abstract figures and
    reproducibility sentence.
- **Inferred:**
  - **that no maintainer has replied** to any of the three requests. These
    are absences on summarised pages.
  - **that the paper does not mention the reruns or the query-specific
    prompts.** The fetch was asked for each term by name and returned none,
    but it is a summariser over a long paper.
  - the issues' exact wording beyond the quoted phrases.
- **Assumed:** that the paper's "validation protocol" is DAB's leaderboard
  validation. The sentence does not say whose protocol it is.

---

### 4. One in-window benchmark writes the rule down. Applied to DAB, it turns on the DEPS_DEV_V1 Q1 rerun, not the crmarenapro ones

**1. What it is.** **ClawProBench** (arXiv:2608.22510, YuanHang Xiao) is a
benchmark for agents running on **OpenClaw**, a live agent runtime with tools
for browsing, memory, messaging and scheduling. It scores each trial from its
execution trace, as Thumbtack does (Level 1). Its "Governance and Release
Contract" (Appendix D, Table 15) states, verbatim:

> "Only provider or harness execution failures should be rerun; low-score
> targeted tuning should create a new exposed/tuned submission label."
>
> "Execution-failure status is retained and analyzed instead of being hidden."

Its Discussion adds that each leaderboard row "should bind model endpoint,
runtime/harness name and digest, adapter version, benchmark commit,
scenario/checker hashes, decoding settings, timeout and retry policy, status,
and prior benchmark exposure." **Prior benchmark exposure** means how much the
submitter had seen of the benchmark's results before the run. It is the field
the footnote in item 2 was standing in for.

**Applied to DAB.** Five queries were rerun: GITHUB_REPOS Q2 (5 trials),
crmarenapro Q3, Q7 and Q9 (15), and DEPS_DEV_V1 Q1 (5). The score depends on
which reruns count. Every figure below is this level's arithmetic, from Level
2's per-dataset table.
- Permute EQ's final per-dataset rates sum to 11.36 over 12 datasets.
- Excluding a rerun restores its dataset's earlier rate: crmarenapro 55 of 65,
  DEPS_DEV_V1 4 of 10, GITHUB_REPOS 15 of 20.

| Reruns that count | Pass@1 | Raw trials | Rank against Scout 0.9062 and Camber 0.8790 |
|---|---|---|---|
| All five (as accepted, 2026-09-13) | **0.9467** | 258 | 1 |
| All but crmarenapro Q3, Q7, Q9 | **0.9338** | 248 | 1 |
| All but DEPS_DEV_V1 Q1 | **0.9050** | 253 | **2** |
| GITHUB_REPOS Q2 only (the maintainer's 2026-09-03 position) | **0.8922** | 243 | 2 |
| None (ClawProBench's rule read literally: no rerun was a provider or harness failure) | **0.8713** | 238 | 3 |

*Driver's check:* all five rows re-derived by hand from Level 2's
per-dataset column. Removing crmarenapro's rerun subtracts 10/65 ÷ 12;
DEPS_DEV_V1 Q1's subtracts 0.5 ÷ 12; GITHUB_REPOS Q2's subtracts 0.25 ÷ 12.
The results are 0.9467, 0.9338, 0.9050, 0.8922 and 0.8713; the trial counts
are 258, 248, 253, 243 and 238; and 0.9050 sits 0.0012 below Scout's 0.9062.
All as printed.

**The three reruns the lead is about, which carry the conditional block, are
worth 1.3 points and do not decide rank 1.** DEPS_DEV_V1 Q1 decides it. Its
dataset has two queries, so five trials there move the stratified score 4.2
points (0.5 ÷ 12). Without that rerun, Permute EQ sits 0.0012 below Scout. That
rerun is also the hardest one to classify:
- The submitter filed it as a correction: "following the tie-validator update
  in ... #86".
- But the validator was revised on 2026-08-18. The leaderboard's own note says
  "DEPS_DEV_V1 query 1 re-scored 2026-08-18 ... under a revised validator
  (accepting any of the 95 packages tied at fifth place ...)". Permute EQ's
  0.8713 was set in a later commit on 2026-08-19. The commit list shows
  "Correct Permute EQ to 0.8713" (`dec001f`) above "Update leaderboard for the
  DEPS_DEV_V1 query 1 rescore" (`e6a9c79`). By Level 2's chain, the query was
  0 of 5 at 0.8713.
- So the original five trials had **already failed under the corrected
  validator**. The rerun then changed the prompt, by removing "the tiebreaker
  rule (p)".

On the submitter's own three-way split, that is closer to "changes targeting
analytical failures" than to "corrections following revised questions or
harness bugs". This is this level's reading, not anyone's ruling. Scout's
replacement of trials after API crashes (Level 2) is the case ClawProBench's
rule allows.

**2. How long ago.** ClawProBench v1: **2026-08-23**, 32 days before
2026-09-24. The validator revision: 2026-08-18 (37 days). Permute EQ's 0.8713:
2026-08-19 (36 days). The accepted 0.9467: 2026-09-13 (11 days).

**3. How it relates to what has already been read.** Filed under
**`efficacy-methodology`** (90 days), the line that counts lessons from any
agent domain. **`benchmarks-depth`** and **`agent-efficacy`** (30 days) would
both fail ClawProBench at 32 days; that is named here. It is the second
in-window trace-scored design on this path after Thumbtack's (Level 1), and
the only one found that writes a rerun rule. One other in-window paper
re-analyses DAB from outside. "What Does an LLM-Agent Leaderboard Rank
Actually Compare?" (arXiv:2609.07785, Wei-Jung Huang, 2026-09-07, 17 days;
accepted at IEEE DSAA 2026) found that on DAB "scores shift by up to 9.2
points and 10 of 28 public-configuration pairs remain underpowered". It asks
leaderboards to report "what configuration was evaluated". It looked at
weighting and uncertainty, which is Level 2 item 2's subject, not at reruns.
Its DAB data predate the top three entries: its top configuration is
"PromptQL Claude Opus 4.6".

**4. What through-line it changes.** It turns the lead's question into a
measured one. **What DAB's rank 1 measures depends on how one five-trial rerun
on a two-query dataset is classified.** The rule that would settle it exists,
in one line, in another benchmark's appendix. Under it, the reruns stay
visible as their own exposed entry and do not replace the original. For
`efficacy-methodology` the lesson is general. **A rerun policy has to be
written before the results are in, and it has to say who classifies each
rerun.** Otherwise the classification is made after the fact, by the party
who has seen which queries failed. That is the thing the policy exists to
prevent.

**5. What to research next.**
- **Whether ClawProBench applies its own rule.** Its artifact has "manifests
  and sanitized traces" and reports 37 holdout configurations. Check whether
  any row carries the "exposed/tuned" label or a retained execution-failure
  status, which would show the rule enforced rather than recommended.
- **What exactly failed in DEPS_DEV_V1 Q1's original five trials.** In PR
  #88's traces (the first `permute_eq_traces.zip`, file id 31712547), find
  Q1's five answers and what the revised validator rejected. If rule (p)
  broke the 95-way tie in a way the revised validator still rejects, the rerun
  was a response to failure. If the failure was elsewhere, removing (p) is
  incidental. This is an engineer's spike, like item 1's.

**6. Source.** From open search. `arxiv.org`, `github.com` and
`raw.githubusercontent.com` are on `sources.md`.
- [ClawProBench abstract](https://arxiv.org/abs/2608.22510): **full page
  read**. [HTML](https://arxiv.org/html/2608.22510v1): **full page read**,
  through one targeted fetch. The Table 15 rule, the status sentence and the
  row-binding sentence came back verbatim.
- [Huang, arXiv:2609.07785 abstract](https://arxiv.org/abs/2609.07785): **full
  page read**. [HTML](https://arxiv.org/html/2609.07785): **full page read**,
  through two targeted fetches. Neither returned which DAB submissions it
  used or how many trials.
- [`leaderboards.json`](https://raw.githubusercontent.com/ucbepic/DataAgentBench/main/docs/data/leaderboards.json)
  "sources" notes and the [file's commit history](https://github.com/ucbepic/DataAgentBench/commits/main/docs/data/leaderboards.json):
  **full page read**.

**7. Verified / inferred / assumed.**
- **Verified:**
  - ClawProBench's rule, status sentence, row-binding sentence and date;
  - Huang's DAB sentence, recommendation and date;
  - the 2026-08-18 validator note;
  - the commit order on 2026-08-19.
- **Inferred:**
  - every Pass@1 in the table. It is arithmetic on Level 2's inferred final
    column, whose two published endpoints (0.8922 and 0.8713) the table
    reproduces.
  - **that DEPS_DEV_V1 Q1 was 0 of 5 under the revised validator.** This
    rests on the commit order and Level 2's chain.
  - the classification of that rerun, which is a reading of the submitter's
    own taxonomy.
- **Assumed:** that excluding a rerun would restore the original trials rather
  than drop the query. DAB has no rule either way, and dropping the query
  would score it 0 of 5 on the same arithmetic.

---

### What was searched for and not found

- **The text of the CONDITIONAL EXECUTION RULES block, or of the `USE ONLY FOR
  GITHUB REPOS Q2` block.** Not in PR #95's description or comments, PR #88,
  `leaderboards.json`, the README or its footnote history, the fork's file
  tree, or arXiv:2609.25286. A search on the exact block name returned PR #95
  and the paper and nothing else. A search on the second block name returned
  nothing about DAB.
- **Any maintainer statement on whether a prompt written after seeing failed
  queries is acceptable.** The maintainer's two statements are the 2026-09-03
  trial-level refusal and the 2026-09-13 footnote notice. Neither judges the
  prompt change.
- **A stated reason for removing footnote 7.** The commit gives what replaced
  it, and the PR thread has no request for it.
- **A rerun rule in any DAB file.** Not in `SUBMISSION_RUBRIC.md` (one commit,
  2026-07-03) or the README.
- **Issue #87's resolution.** The issue shows as closed, but no closing
  commit or comment rendered.

### What was dropped

- **"The Double Measurement Confound in Agent Benchmarks" (arXiv:2609.09218,
  2026-09-06, 18 days).** It is on scaffolding and scorer confounds, with
  reporting "beyond the mean". Only the abstract was read, and it does not
  address reruns.
- **DAB PR #106 ("[Pre-review] datalens agent ... historical 88.7753%
  submission").** It surfaced in the same search. The title suggests a
  historical run brought forward for review, which may test the rerun question
  from another side. It was not read.
- **DAB's website leaderboard.** It rendered only descriptive text, so the
  "Highly tuned" column's values could not be read.

---

## Where this path ends

The three levels asked one question of three different evaluations: what does
a headline efficacy number for a data agent say about whether the agent works
repeatedly?

- **Level 1: Thumbtack's trace-backed scoring is honest about its rules but
  reports disagreement, not reliability.** The paper scores "partial" as half
  and drops "unknown" from the denominator. It specifies a coverage rate and
  does not print one. Its headline "41 of 50" counts questions whose three runs
  disagreed, on a definition it does not write down, and 40 of the 50 questions
  have no correct answer to check against.
- **Level 1 and Level 2: the pass rule is a result.** On Thumbtack's only
  scorable questions, the choice among any-of-3, 2-of-3 and all-of-3 moves the
  pass count across the whole range from 0 to 10. On DataAgentBench, averaging
  five runs hides a strict pass^5 gap of up to 29 points. Weighting by dataset
  instead of by query reverses ranks 2 and 3.
- **Levels 1 to 3: DataAgentBench's rank 1 was made after the runs.** Permute
  EQ rose from rank 3 to rank 1 by rerunning five queries, three of them under
  query-specific blocks. The maintainers disclosed this in a footnote and
  removed the footnote two days later. DAB has no written rerun rule, and three
  requests for one sit unanswered. Whether rank 1 stands turns on how a single
  five-trial rerun on a two-query dataset is classified.

**The rule of evidence to take away.** An agent's efficacy number is evidence
only when four things were fixed before the runs and published beside the
number:
- how attempts combine;
- what the average is taken over;
- what counts as abstaining;
- which failures may be rerun.

A reported number with any of these decided afterwards measures the
submitter's knowledge of the benchmark, not the agent. The cheapest safeguards
seen on this path are:
- ClawProBench's one line: rerun only provider or harness failures, and label
  anything else as exposed;
- a strict pass^k printed beside the mean;
- a coverage rate printed beside any pass rate that drops abstentions.

**What stays open, and who could close it:**
- **The block's text and DEPS_DEV_V1 Q1's original failures.** An engineer
  unzips PR #95's and PR #88's trace archives and quotes them.
- **Exact pass^5 for Camber and Scout.** An engineer runs DAB's validators on
  the four datasets named per entry in Level 2, on branch
  `submission/camber-v5-opus5-n5` of `Spartan-Linh-Truong/DataAgentBench` and
  on `main` of `WeiJiuQi/DataAgentBench`.
- **A rerun rule.** Only DAB's maintainers can write one. The submitter's
  2026-09-14 comment has already drafted the three categories it would need.
- **Thumbtack's Table 6 definitions and coverage rates.** Only the paper's
  authors can publish these.

**The strongest counter-argument.** Permute EQ's submitter is the one party in
this story who showed his work.
- He filed the two benchmark defects (#86, #87) that forced two of the
  reruns, and the maintainers accepted both as real.
- He reran whole queries when told to, labelled every prompt variant, and
  asked for the rule himself.
- Every entry in DAB's top twelve carries a prompt "built from a close study
  of DAB's task conventions", and the development runs behind those prompts
  are unpublished. A rerun under a new prompt differs from them only in being
  visible.

On that reading, the path has not found a leaderboard being gamed. It has
found the one entry whose tuning can be seen, and a rule that penalised it
would reward the others for not disclosing. The answer is that ClawProBench's
rule does not penalise disclosure. It keeps the rerun and labels it. The
counter-argument does not, though, account for the prompt changes being
recorded as labels rather than text, or for the paper reporting the same
258/270 under a protocol that "prohibited benchmark-specific information".
