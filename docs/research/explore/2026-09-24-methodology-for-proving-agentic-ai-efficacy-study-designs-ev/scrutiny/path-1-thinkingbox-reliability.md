# Path 1 - One success is not reliability: what Thinkingbox's revision changed

**Produced by a research subagent in auto-breadth mode.** This is not a
profile change. The index is [`README.md`](README.md), and the breadth pass
this path descends from is [`0-breadth.md`](0-breadth.md), item 3, lead L5.

---

## Level 1 - Thinkingbox v1 against v2

**Window:** 90 days, so items are dated on or after 2026-06-26. Everything
counted below is dated between 2026-08-11 and 2026-09-02. τ-bench (2024) is
**Background** only.

**What this level found.** Thinkingbox's v2 changes the headline without
re-running the model that held it. The ten rows the two versions share are
identical. Three models came in, and two went out.

The new leader, Claude Opus 5, beats GPT-5.4 on pass@1 by **1.14 points**. On
the paper's reliability metric the gap is much larger: **47.53%** pass^20
against GPT-5.4's **25.25%**, and the 25.25% appears only in v1. **v2 deletes
GPT-5.4's pass^20.**

So the thing the breadth pass treated as one gap (pass@1 against pass^20) is
really a **per-model property**. Two models with nearly the same single-run
score differ by **22.28 points** in how often they succeed every time.

A second problem sits under all three pass^20 figures. The benchmark's released
code does **not** compute "succeeded in all 20 attempts". It computes the
average of (successes/20)^20, and that is a different, larger number. Nothing
read says which of the two the paper reports.

---

### 1. v2 swapped the headline model, kept every carried-over row identical, and dropped GPT-5.4's pass^20

**1. What it is.** A line-by-line comparison of the two versions of Li, Ko,
Keramati and nine others, "One Success Isn't Reliability: Thinkingbox, a
Sandbox and Benchmark for Agents in Stateful Business Workflows"
(arXiv:2608.19741). The authors are at Pittsburgh, Northwestern, UC Irvine and
Microsoft. v1 is dated 2026-08-20 and v2 2026-08-29.

Thinkingbox runs an agent against **MCP** tool servers. MCP, the Model Context
Protocol, is the open standard through which an agent calls external tools.
Each task gets its own backend database, and the verdict is read from that
database's final state.

**What stayed the same.** Both versions have:
- **507 tasks.** Retail 98, travel/booking 104, auto insurance 100, neobank
  104 and consulting IT/HR 101 (Table 4 column headers, v2).
- **20 trials per task.**
- **477 tasks graded on backend state only**, plus 30 tasks that also use a
  binary response rubric.
- **One user simulator**, a GPT-5.4-mini deployment that also judges the 30
  rubric tasks.
- **The same limitations appendix** (Appendix A).

**What changed in the roster** (Table 4, both versions):

| | v1 (12 models) | v2 (13 models) |
|---|---|---|
| Added | - | **Claude Opus 5** 66.50, **GPT-5.6-sol** 61.91, **Qwen3.8-27B** 51.70 |
| Removed | **GPT-5.2** 46.28, **Qwen3.6-27B** 32.94 | - |
| Carried over | GPT-5.4, Claude Sonnet 4.6, Claude Opus 4.6, o3-pro, Grok-4.3, DeepSeek-V4-Pro, Kimi-K2.6, GLM-5.1, Mistral-Large-3, Qwen3.5-9B | same ten |

**GPT-5.4 was not re-run.** Its Table 4 row is identical in both versions:
Retail 76.33, Auto 62.65, Booking 68.13, Bank 65.34, Consulting 54.60, average
**65.36**. The domain cells of the other nine carried-over rows are identical
too. So is every Table 5 failure-mode row for the models present in both.

**What v2 removed from the text.** v1 reads: "The strongest model reaches
65.36% pass@1 and succeeds at least once on 91.12% of tasks, yet succeeds in
all 20 attempts on only 25.25%." **Neither 91.12 nor 25.25 appears in v2.**
GPT-5.4 gets no pass@20 or pass^20 figure anywhere in v2.

v2 gives pass^20 for only two models, both in the text rather than a table:
- **Claude Opus 5, 47.53%** (abstract).
- **Qwen3.8-27B: "89.35% pass@20 but only 7.50% pass^20 despite 51.70% pass@1"**
  (results section).

**Neither version has a per-model pass^k table.** Figure 1(B) plots the
discovery-reliability gap and has no numbers in its text.

**Two defects v2 introduced.**
- **Qwen3.5-9B's average.** Its domain cells are unchanged (19.15, 0.45, 4.52,
  1.06, 2.34), but its average moved from **5.41** (v1) to **5.84** (v2).
  - Recomputed here as a task-weighted micro-average, the paper's stated
    method (Equation 5), those cells give **5.40**. An unweighted mean gives
    5.50.
  - **Neither is 5.84**, so the v2 figure looks like an error.
  - Check: the same recomputation reproduces Claude Opus 5's 66.50,
    GPT-5.6-sol's 61.91, Qwen3.8-27B's 51.70 and Qwen3.6-27B's 32.94.
- **A stale caveat.** Both versions say "The simulator also shares a model
  family with the strongest evaluated agent, so we cannot rule out
  interaction-style effects that favor same-family agents." In v1 that was
  true: a GPT-5.4-mini simulator, and GPT-5.4 on top. In v2 the strongest agent
  is Claude Opus 5, which is not in the simulator's family, and the sentence
  was not updated.

**2. How long ago.** v2 on 2026-08-29, 26 days ago. v1 on 2026-08-20, 35
days ago.

**3. How it relates to what has already been read.**
- **It corrects the breadth pass's item 3.** That item built on v1's 65.36 /
  91.12 / 25.25 and a 40-point gap. It also recorded "89.35% pass@20 … 7.50%
  pass^20" as absent from the paper and possibly from another paper. **Both
  figures are in v2, attributed to Qwen3.8-27B.** They were absent only from
  v1, which is the version that was read. The driver's check had already
  placed the 47.53.
- **Claude Opus 5** also appears in the breadth pass's item 2, where
  Hack-Verifiable Terminal Bench measured its shortcut-taking at 17.4% at L0.

**4. What through-line it changes.** It adds a caution to "one success is not
reliability": **a benchmark's headline reliability number can change model
between versions without anything being re-measured.**
- 40.11 points (v1) and 18.97 points (v2) are both the gap "for the strongest
  model", and they belong to different models.
- Anyone quoting "the Thinkingbox gap" has to name the model and the version.
  Coverage that went out in the v1 week still quotes 25.25% (item 3).

**5. What to research next.**
- **P1-L1a - Appendix D.1 of v2: are the two leaders actually separable?** v2
  says "Task-cluster bootstrap intervals are reported in Appendix D.1". A
  page fetch truncated before that table.
  - Read D.1 as numbers: Claude Opus 5's and GPT-5.4's pass@1 intervals, and
    any pass^20 intervals.
  - Establish whether the 1.14-point pass@1 lead and the 22.28-point pass^20
    difference fall outside them.
  - Check whether D.1 or any v2 appendix table still carries GPT-5.4's pass^20.
  - *In window: 2026-08-29.*
- **P1-L1b - Appendix C.1 in v1 against v2: did the three new models run under
  the same harness?** Compare temperature, reasoning-effort setting, turn caps
  and token caps as printed in each version.
  - The GitHub commit "Allow provider-defined reasoning effort" (#27) is dated
    2026-09-02, after v2, so the question is what v2's rows used.
  - Also record whether an erratum or a v3 fixes Qwen3.5-9B's 5.84 or the
    same-family sentence.
  - *In window: 2026-08-20 to 2026-09-02.*

**6. Source.** From open search, on `arxiv.org`, which is on `sources.md`.
- [arXiv:2608.19741v2 full text](https://arxiv.org/html/2608.19741v2): **full
  page read**, four targeted passes. Appendices C.1 and D.1 truncated and were
  **not read**.
- [arXiv:2608.19741v1 full text](https://arxiv.org/html/2608.19741v1): **full
  page read**, two passes.
- [The v2 abstract page](https://arxiv.org/abs/2608.19741v2): **abstract or
  landing page only**, for authors, versions and the code link.

**7. Verified / inferred / assumed.**
- **Verified:** the rosters and every Table 4 figure quoted, in both versions;
  the identical GPT-5.4 row; v2's absence of 91.12, 25.25 and any GPT-5.4
  pass^20; the 89.35 / 7.50 / 51.70 sentence; the unchanged simulator, task
  counts, trial count and grading split; and the same-family sentence in both
  versions.
- **Recomputed here:** 5.40 against the printed 5.84, and the four averages
  that do reproduce. The arithmetic is shown above.
- **Inferred:** that "identical row" means "not re-run". The paper does not
  say how v2's rows were produced.
- **Inferred:** why GPT-5.4's pass^20 was dropped. Nothing says.
- **Assumed:** that the Table 4 column labelled "Booking (104)" is the
  travel/hospitality domain. The counts match; the labels differ.

---

### 2. Near-identical single-run scores hide very different consistency, and the paper's explanation is failure to repair after a tool error

**1. What it is.** Set side by side, the three pass^20 figures the paper
gives, one of them from v1 only:

| Model (version) | pass@1 | pass@20 | pass^20 | pass@1 − pass^20 | pass^20 ÷ pass@1 |
|---|---|---|---|---|---|
| Claude Opus 5 (v2) | 66.50 | not given | **47.53** | 18.97 | 0.71 |
| GPT-5.4 (v1) | 65.36 | 91.12 | **25.25** | 40.11 | 0.39 |
| Qwen3.8-27B (v2) | 51.70 | 89.35 | **7.50** | 44.20 | 0.15 |

The last two columns are computed here from the paper's figures.

**Two models within 1.14 points on pass@1 differ by 22.28 points on pass^20.**
The ordering on pass@1 is also not stable by domain. Claude Opus 5 leads the
average but scores **49.95** on booking against GPT-5.4's **68.13**, a gap of
18.18 points (Table 4, v2).

**What the paper says drives failure** (v2 Table 5, the share of *failed*
trials by mode, averaged over twelve models):

| Failure mode | Share of failed trials |
|---|---|
| Tool usage | **79.9%** |
| Wrong state update | 9.4% |
| Incomplete user resolution | 7.5% |
| No state-changing action | 3.2% |

The mechanism, in the paper's words: "A typical trace contains one or more tool
errors, failed preconditions, or unsuccessful lookups, after which the agent
fails to repair the workflow; in some cases, it continues as though the failed
action had succeeded."

Claude Opus 5's failures are the most concentrated in that mode, at **96.4%**
tool usage and **2.0%** wrong state update. o3-pro's lean the other way, with
**27.8%** wrong state update.

The abstract's interpretive claim is that "many failed trials show clean
termination and valid state-changing actions", so a response or a tool call
looking right is no proxy for the task being done.

**What the paper does not do.** It never explains *variance*: why the same
model on the same task passes on one trial and fails on the next. Table 5 sorts
failures. It does not separate tasks that always fail from tasks that fail
sometimes, and only the second kind lowers pass^20 below pass@1.

**2. How long ago.** v2 on 2026-08-29, 26 days ago.

**3. How it relates to what has already been read.** The breadth pass's item 4
(Meta's arXiv:2609.21267) left open how much a full benchmark run varies
between repeats of an unchanged agent. This is the first in-window figure for
that on a business-workflow benchmark, and it is large and differs by model.

The Background comparator is τ-bench, the Sierra/Princeton benchmark
(arXiv:2406.12045, 2024-06-17) that introduced pass^k. Its abstract: gpt-4o
"succeed[s] on <50% of the tasks, and [is] quite inconsistent (pass^8 <25% in
retail)". Thinkingbox cites τ-bench for pass^k. Two years on, the most
consistent model in Thinkingbox holds about 71% of its single-run score across
20 trials.

**4. What through-line it changes.** "Report pass^k, not pass@1" becomes
**"rank on pass^k, because pass@1 does not predict it."**
- **A procurement comparison on pass@1 would call Claude Opus 5 and GPT-5.4 a
  tie.** On the paper's own figures, one of them completes the same task every
  time roughly twice as often.
- **The failure explanation points at recovery rather than planning.** The
  dominant mode is failing to repair after a tool error. That is something a
  harness can test directly, by injecting tool errors, rather than inferring
  it from repetition.

**5. What to research next.**
- **P1-L1c - pass@20 and pass^20 for all 13 models in v2.** Get them from the
  data behind Figure 1(B), an appendix table, or the released results.
  - Test whether ranking by pass^20 reorders the Table 4 ranking beyond the
    GPT-5.4 / Claude Opus 5 swap. GPT-5.6-sol at 61.91 and Claude Sonnet 4.6 at
    58.45 are the next pair to check.
  - Record where the numbers came from.
  - *In window: 2026-08-29.*
- **P1-L1d - Where Claude Opus 5's inconsistency sits.** Using per-task
  success counts (c out of 20) for Claude Opus 5 and GPT-5.4:
  - How many of the 507 tasks are always-pass (c=20), never-pass (c=0) and
    sometimes-pass (1-19), per domain?
  - Is the sometimes-pass set concentrated in booking, where Claude Opus 5
    trails by 18.18 points?
  - This is the "tasks that fail sometimes" split Table 5 does not make.
  - *In window: 2026-08-29.*

**6. Source.** From open search, on `arxiv.org`.
- [arXiv:2608.19741v2](https://arxiv.org/html/2608.19741v2) and
  [v1](https://arxiv.org/html/2608.19741v1): **full page read**, as in item 1.
- [τ-bench, arXiv:2406.12045](https://arxiv.org/abs/2406.12045): **abstract
  or landing page only** (Background).

**7. Verified / inferred / assumed.**
- **Verified:** every pass@1, pass@20 and pass^20 figure in the table, each in
  the version named; the Table 5 averages and the rows quoted (the 79.9% average
  was re-summed here from the twelve rows); the "fails to repair" and "clean
  termination" sentences; and τ-bench's abstract figures.
- **Inferred:** that GPT-5.4's v1 pass^20 and Claude Opus 5's v2 pass^20 were
  computed the same way and can be compared. They come from different versions,
  and the estimator is unresolved (item 3).
- **Inferred:** "roughly twice as often" is 47.53 ÷ 25.25 = 1.88.
- **Assumed:** that Table 5 is shares of failed trials, from its "Failure Mode
  Breakdown (%)" title and rows summing to about 100.

---

### 3. The released code computes pass^k as the average of (c/n)^k, which is not "succeeded in all 20 attempts"

**1. What it is.** The paper links a Microsoft repository,
[`microsoft/thinkingbox`](https://github.com/microsoft/thinkingbox). It is
MIT-licensed, with 15 commits from 2026-05-16 to 2026-09-10 and 83 stars when
read. It has a companion,
[`microsoft/thinkingbox-data`](https://github.com/microsoft/thinkingbox-data),
also MIT, with 21 commits. The companion's README says "Version 1.0 contains
507 executable tool-agent-user tasks" and that the set is mirrored on Hugging
Face, the public model and dataset host.

**There is no leaderboard and no results folder** in either repository.

The metric code is in `thinkingbox/cli/agg_main.py`. On **2026-08-19**, the day
before v1, pull request #22 ("fix: correct pass^k metric naming and comments",
by Young Ko, a co-author) renamed `unbiased_pass_power_k` to `pass_power_k`. The
docstring it left reads: "An unbiased estimator is (c choose k)/(n choose k),
but it is zero whenever c < k … We instead use (c/n)^k, which retains a
non-zero signal even when c > 0." The function returns `(c / n) ** k` per test
case, aggregated as "the mean over tasks".

pass@k, by contrast, uses the standard unbiased estimator,
1 − C(n−c, k)/C(n, k).

**Why it matters at n = k = 20.**
- **The literal definition.** Read strictly ("all 20 of 20"), the unbiased
  estimator is 1 when c = 20 and 0 otherwise. So it equals the share of tasks
  that passed every trial, which is what v1's prose says: "succeeds in all 20
  attempts on only 25.25%".
- **What the code computes.** (c/n)^20 also credits near-misses: a 19/20 task
  contributes **0.358**, an 18/20 task **0.122** and a 17/20 task **0.039**.
- **The consequence.** If the paper's figures came from this aggregator, each
  pass^20 is an upper bound on the literal all-20 share, not the share itself.
- **Which one the paper used is not stated.** v2 "does not formally define
  pass@k or pass^k". It says only that it follows τ-bench's "pass@k and pass^k
  analyses".

**2. How long ago.** Pull request #22 on 2026-08-19 (36 days). The last
repository commit was 2026-09-10 (14 days).

**3. How it relates to what has already been read.** This repeats a pattern
from X1's path 1, where Spider 2.0-AIFunc's paper set (465) and its released
set (393) disagreed. There, **the released artefact and the paper's headline
do not obviously measure the same thing, and only the artefact can settle
it.** Here the artefact is public and runnable, which X1's was not.

**4. What through-line it changes.** It narrows "report pass^k" to **"report
pass^k with its estimator."** The next benchmark will have the same problem.
- Two pass^20 figures computed by the two estimators can differ substantially
  on the same runs. The size depends on how many tasks sit at 17-19 of 20
  successes.
- The repository's authors chose the biased one on purpose, for signal on hard
  tasks.
- A reader comparing Thinkingbox's gap to τ-bench's, or to anyone else's,
  cannot do so without knowing which estimator each used.

**5. What to research next.**
- **P1-L1e - Recompute pass^20 both ways from released per-trial results.**
  Find whether per-trial verdicts for the paper's runs are published:
  `thinkingbox-data`, the Hugging Face dataset, or the `tb agg` input JSONL.
  - If they are, compute for Claude Opus 5, GPT-5.4 and Qwen3.8-27B both the
    literal share of tasks with c = 20 and the mean of (c/20)^20.
  - State which reproduces 47.53, 25.25 and 7.50.
  - If they are not published, record that as the finding.
  - *In window: repository activity 2026-08-19 to 2026-09-10.*
- **P1-L1f - The Hugging Face Thinkingbox-bench dataset card, and any outside
  run.** Read the card for its date, version, licence and whether trajectories
  or results are included. Then look for any third party that has run the 507
  tasks:
  - GitHub issues on either repository;
  - forks with results;
  - a Hugging Face Space;
  - another paper reporting Thinkingbox-bench numbers.
  - *In window: dataset released with v1, 2026-08-20.*

**6. Source.** From open search. `github.com` and `raw.githubusercontent.com`
are the hosts.
- [README, raw](https://raw.githubusercontent.com/microsoft/thinkingbox/main/README.md):
  **full page read**.
- [`agg_main.py`, raw](https://raw.githubusercontent.com/microsoft/thinkingbox/main/thinkingbox/cli/agg_main.py):
  **full page read**, for the metric functions.
- [Pull request #22](https://github.com/microsoft/thinkingbox/pull/22): **full
  page read**.
- [Commit list](https://github.com/microsoft/thinkingbox/commits/main): **full
  page read**.
- [Repository page](https://github.com/microsoft/thinkingbox) and
  [`thinkingbox-data`](https://github.com/microsoft/thinkingbox-data): **landing
  page only**. The data README was seen as rendered, not raw.

**7. Verified / inferred / assumed.**
- **Verified:** the licence, commit dates and messages, pull request #22's
  rename and docstring, the `(c / n) ** k` return, mean-over-tasks
  aggregation, the unbiased pass@k formula, and the absence of a results or
  leaderboard folder.
- **Computed here:** 0.95^20 = 0.358, 0.90^20 = 0.122 and 0.85^20 = 0.039.
- **Inferred, and load-bearing:** that the paper's pass^20 figures may come
  from this aggregator. The paper's prose ("succeeds in all 20 attempts")
  describes the literal share. **Neither is established.**
- **Assumed:** that `main` today matches what produced the paper's numbers.
  #27 and #29 postdate v2, but neither touches the metric by its message.

---

### 4. Nobody else in the window reports pass^k on enterprise-style tasks; the three nearest papers measure something else

**1. What it is.** Three in-window papers that looked like comparators. Each
turned out to measure a different kind of unreliability.

**"Beyond Pass@k: Measuring Reliability and Security of Agentic Code
Generation"** (Jiang and Zheng of Cornell, Vidra of Anote.ai, Setty of Stevens;
arXiv:2608.14711, 2026-08-11).
- **The problem it names.** Pass@k is being computed with *n* set to the number
  of unit tests in one submission, rather than the number of independent
  rollouts.
- **Its proposed correction** is "reliability@k".
- **Result.** On a synthetic 10-problem set with 8 rollouts per task, "pass@5
  scores inflate multi-rollout reliability@5 by a mean of 0.924" (Table 1). For
  one agent profile the figures are 0.965 against 0.000.
- **Scope.** Code only. It has no business-workflow tasks and does not mention
  Thinkingbox. It is not, as the breadth pass suspected, the source of the
  89.35 / 7.50 figures (item 1).

**"READY or Not: Reliable Enterprise Agent Deployment"** (Chatrath and 14
co-authors, mostly Scale AI; arXiv:2609.02095, 2026-09-02).
- **What it measures.** "Deployment reliability" under human oversight, on
  750 clinical-audit cases with 16 systems.
- **Headline.** "GPT-5.4's 72.8% versus Sonnet 5's 72.5%" autonomous accuracy
  "require 39.2% versus 29.6% human review, respectively, to qualify at the
  same 76% reliability target".
- **What drives the difference.** How well each system's stated confidence
  routes its failures to a human.
- **No pass^k and no repeated trials.**

**"Noise Floor Audit for Agent Benchmarks"** (Chen, Qian, Wang, Peng, Xu, Wu
and Sun; Georgia Tech and CMU; arXiv:2608.22331, 2026-08-23).
- **What it measures.** Run-to-run noise on the Berkeley Function Calling
  Leaderboard: 150 instances, three models, 10 reruns at temperature 0.
- **Rerun noise is tiny.** The paired standard deviation is **0.28-1.1 points**,
  and 0.7-2.7% of instances ever flip.
- **Rephrasing noise is not.** Semantics-preserving prompt perturbations give a
  median paired standard deviation of **10-19 points**.
- **Its recommendation.** Rerunning buys "almost no extra information after the
  first small rerun check", so compute is better spent on perturbations.

**2. How long ago.** 2026-08-11 (44 days), 2026-09-02 (22 days) and
2026-08-23 (32 days).

**3. How it relates to what has already been read.** READY is the same
finding as item 2 from another direction. **Two systems within 0.3 points on
accuracy** differ by about ten points in the oversight they need. In item 2,
two models within 1.14 points on pass@1 differ by 22 points on pass^20. Neither
paper cites the other.

**4. What through-line it changes.** The three together say **"unreliability"
has at least three separable sources**:
- **Rollout-to-rollout variance** in multi-turn, stateful work (Thinkingbox);
- **sensitivity to how the request is phrased** (Noise Floor Audit);
- **how well the system knows when it is wrong** (READY).

The Noise Floor Audit's near-zero rerun noise on single tool calls at
temperature 0, set against Thinkingbox's large pass@1-to-pass^20 gaps, suggests
something. **The variance lives in the multi-turn interaction** (the
simulator, the tool errors and the recovery), not in the model's sampling.
That is an inference across papers with different settings.

**5. What to research next.**
- **P1-L1g - τ-bench's current leaderboard as the only like-for-like
  comparator.** Look for pass^k figures for Claude Opus 5 and GPT-5.4 on
  Sierra's τ-bench or τ²-bench leaderboard or repository as of September 2026.
  Sierra is the customer-service agent company that built τ-bench. Record which
  pass^k estimator the τ-bench code uses, and whether Claude Opus 5 leads on
  consistency there too.
  *In window if the leaderboard has in-window entries; otherwise record that it
  has not moved.*
- **P1-L1h - READY's per-system table of 16: does the ordering on oversight
  needed agree with any repeated-trial measure?** From arXiv:2609.02095's
  results tables:
  - list each system's autonomous accuracy and the human-review share at the
    76% target;
  - note which systems also appear in Thinkingbox (GPT-5.4, Claude Sonnet 4.6);
  - say whether READY reports any repeated-run variance at all.
  - *In window: 2026-09-02.*

**6. Source.** From open search, on `arxiv.org`.
- [arXiv:2608.14711v1](https://arxiv.org/html/2608.14711v1): **full page
  read**.
- [arXiv:2609.02095v1](https://arxiv.org/html/2609.02095v1): **full page
  read**. It returned a summary-level extraction, so its per-system tables were
  not captured.
- [arXiv:2608.22331v1](https://arxiv.org/html/2608.22331v1): **full page
  read**. It was found through the search result's PDF link.

**7. Verified / inferred / assumed.**
- **Verified:** all three dates and author lines; Beyond Pass@k's scope, its
  0.924 figure and its absence of Thinkingbox; READY's 72.8 / 72.5 / 39.2 /
  29.6 / 76% sentence and its absence of pass^k; and the Noise Floor Audit's
  benchmark, models, reruns, standard deviations and recommendation.
- **Inferred:** "three separable sources", and that Thinkingbox's variance is
  interactional. No paper tests this.
- **Assumed:** that "Sonnet 5" in READY is a distinct Anthropic model from
  Thinkingbox's Claude Sonnet 4.6. It is named as such, and it is not checked.

---

> **Driver's check on level 1** (2026-09-24, by hand from the primary
> sources, because this runner has no shell for scripts).
> - **v2 Table 4 re-read verbatim:** Qwen3.5-9B "19.15 0.45 4.52 1.06 2.34
>   5.84", GPT-5.4 "76.33 62.65 68.13 65.34 54.60 65.36", Claude Opus 5
>   "80.71 65.80 49.95 70.63 66.19 66.50", columns Retail (98), Auto (100),
>   Booking (104), Bank (104), Consulting (101).
> - **Task-weighted averages re-computed:** Qwen3.5-9B 2738.36 / 507 =
>   **5.401** (printed 5.84, so the level's finding of an error stands);
>   GPT-5.4 33140.82 / 507 = **65.367** (printed 65.36); Claude Opus 5
>   33715.09 / 507 = **66.499** (printed 66.50).
> - **The estimator, re-read from `agg_main.py` on `main`:** `pass_power_k`
>   returns `(c / n) ** k`, and `aggregate_results` takes `safe_mean` over
>   tasks. Confirmed as the level says. v2's own wording for Figure 1(B) is
>   "all-20 success is far lower", which is the literal definition, so the
>   paper's prose and the released code still disagree.

### Searched for and not found

- **A changelog for v1 to v2.** No statement of what changed appears in v2's
  text, and none was visible on the abstract page. The changes above were
  established by comparing the two versions.
- **GPT-5.4's pass^20 in v2**, and 91.12 or 25.25 anywhere in v2. Absent.
- **A per-model pass^k table in either version.** None. pass^20 appears in
  prose for one model in v1 and two in v2.
- **A Thinkingbox leaderboard.** Neither repository has one. A Hugging Face
  paper-page extraction claimed one exists, showing "pass@20" figures matching
  v1's pass@1 and pass^20. That looks like mislabelled Table 4 data, and it is
  not relied on.
- **An independent replication or critique of Thinkingbox.**
  - [Pebblous's editorial](https://blog.pebblous.ai/blog/thinkingbox-stateful-agent-reliability/en/),
    dated 2026-08-20 and read in full, restates the paper's own limitations
    and quotes the v1 numbers.
  - A [Nerd Level Tech post](https://nerdleveltech.com/ai-agent-reliability-benchmark-thinkingbox)
    headlined "65% Once, 25% Always" was seen as a search result only.
  - Both carry v1's GPT-5.4 figures that v2 withdrew.
  - Pebblous's "80.88% of failed trials ended cleanly and changed state" was
    **not found** in the text of either version. Only the qualitative sentence
    was.
- **Another in-window paper reporting pass^k on enterprise-style agent tasks.**
  None among the three read (item 4) or in one open search. Two older papers
  surfaced, and neither was read: "ReliabilityBench" (arXiv:2601.06112) and
  "Beyond pass@1: A Reliability Science Framework" (arXiv:2603.29231). Both
  are out of window by their identifiers.
- **Appendix C.1 settings and Appendix D.1 intervals.** Present in v2 by
  heading, but truncated in every fetch. They are leads P1-L1a and P1-L1b.

---

## Level 2 - Which pass^20 did the paper report?

**Window:** 90 days, so items are dated on or after 2026-06-26. Everything
counted below is dated between 2026-08-17 and 2026-09-21. The repository's
initial commit (2026-05-16) is **Background** only.

**What this level found.** The published numbers answer the question even
though no per-trial data is released. **Every pass^20 figure the authors have
published is a whole number of tasks out of 507:**
- GPT-5.4's 25.25% is **128 tasks**.
- Claude Opus 5's 47.53% is **241 tasks**.
- Qwen3.8-27B's 7.50% is **38 tasks**.
- Two more figures, from a Microsoft post the level above had not found, are
  whole-task counts too: **70 tasks** and **16 tasks**.

That is what the literal "succeeded in all 20 attempts" count produces. The
released aggregator's average of (c/20)^20 would not produce it, unless almost
no task sits at 17-19 successes, and in that case the two estimators agree to
the printed decimal anyway. **So each figure is the literal all-20 share, or
equal to it as printed.** No second computation is needed before the numbers
are compared.

Two things stay open:
- **The authors' own account contradicts itself.** Microsoft's launch post
  defines pass^20 as the literal share. It also says it was computed with
  `tb agg`, and `tb agg` has computed (c/n)^k since the first commit.
- **The per-task counts that would settle the question outright are not
  published anywhere this level checked.**

---

### 1. All five published pass^20 figures are whole-task counts out of 507, and none of the five pass@1 figures is

**1. What it is.** A divisibility check on every pass@1, pass@20 and pass^20
figure the authors have published: the two arXiv versions (arXiv:2608.19741) and
the Microsoft post in item 2.

**Why the check works.** Thinkingbox-Bench has **507 tasks** and **20 trials
per task**, so the three metrics are counted over different units:
- **pass@1 is counted over trials.** It is the share of 10,140 trials that
  succeeded, so it moves in steps of 1/10,140.
- **The literal pass^20 is counted over tasks.** It is the share of tasks that
  passed all 20 trials, so it can only be *k*/507, a multiple of **0.1972
  points**.
- **pass@20 is counted over tasks too.** The paper uses the unbiased estimator
  1 − C(20−c, 20)/C(20, 20) (level 1, item 3). At n = k = 20 that is 1 whenever
  c ≥ 1, so pass@20 is also *k*/507.
- **The released aggregator's pass^20 is not counted over tasks.** It averages
  (c/20)^20 over the 507 tasks. The literal count is still in there, but each
  task that passed 1-19 times adds a fraction on top of it. The result lands on
  a *k*/507 value only if those fractions sum to almost nothing, or by
  coincidence.

A figure printed to two decimals matches some *k*/507 by chance about **5% of
the time**. That is 0.01 ÷ 0.1972.

Each figure below is multiplied by 507/100 to find its task count:

| Metric | Model (where printed) | Printed | × 5.07 | Nearest *k*/507, rounded | On the 1/507 grid? |
|---|---|---|---|---|---|
| pass^20 | GPT-5.4 (v1 abstract; Microsoft post) | 25.25 | 128.02 | 128/507 = 25.25 | **yes** |
| pass^20 | Claude Opus 5 (v2 abstract) | 47.53 | 240.98 | 241/507 = 47.53 | **yes** |
| pass^20 | Qwen3.8-27B (v2 results) | 7.50 | 38.03 | 38/507 = 7.50 | **yes** |
| pass^20 | Claude Opus 4.6 (Microsoft post) | 13.81 | 70.02 | 70/507 = 13.81 | **yes** |
| pass^20 | Kimi-K2.6 (Microsoft post) | 3.16 | 16.02 | 16/507 = 3.16 | **yes** |
| pass@20 | GPT-5.4 (v1; post) | 91.12 | 461.98 | 462/507 = 91.12 | yes (expected) |
| pass@20 | Qwen3.8-27B (v2) | 89.35 | 453.00 | 453/507 = 89.35 | yes (expected) |
| pass@20 | Claude Opus 4.6 (post) | 70.02 | 355.00 | 355/507 = 70.02 | yes (expected) |
| pass@20 | Kimi-K2.6 (post) | 84.22 | 427.00 | 427/507 = 84.22 | yes (expected) |
| pass@1 | GPT-5.4 | 65.36 | 331.38 | 331 → 65.29, 332 → 65.48 | no (expected) |
| pass@1 | Claude Opus 5 | 66.50 | 337.16 | 337 → 66.47 | no (expected) |
| pass@1 | Qwen3.8-27B | 51.70 | 262.12 | 262 → 51.68 | no (expected) |
| pass@1 | Claude Opus 4.6 | 37.91 | 192.20 | 192 → 37.87 | no (expected) |
| pass@1 | Kimi-K2.6 | 37.66 | 190.94 | 191 → 37.67 | no (expected) |

**What the table shows.**
- **The pass@1 rows are the control.** All five are off the grid, as a
  per-trial average should be. Being on it is not something every figure in
  this paper does.
- **All five pass^20 figures are on the grid.** If each were an average of
  (c/20)^20, the chance of all five landing there by coincidence is about
  0.0507^5, or **3 in 10 million**.

**The only other way to land on the grid.** Under the aggregator, a task with
c successes adds (c/20)^20 of a task on top of the literal count. The printed
figure keeps its value only while those additions stay under the rounding
margin:

| Model | Literal count implied | Margin, in task units | What the margin allows |
|---|---|---|---|
| GPT-5.4 | 128 | 0.043 | no task at 18-19, at most one at 17 |
| Claude Opus 4.6 | 70 | 0.042 | no task at 18-19, at most one at 17 |
| Kimi-K2.6 | 16 | 0.047 | no task at 18-19, at most one at 17 |
| Qwen3.8-27B | 38 | 0.050 | no task at 18-19, at most one at 17 |
| Claude Opus 5 | 241 | **0.0025** | **no task at 15 or more** |

For reference, one task at 17 of 20 adds **0.039**, at 16 **0.0115**, at 15
**0.0032**, and at 14 **0.0008**.

**How plausible that alternative is.** Assume the aggregator, and combine the
same published figures:

| Model | Tasks passed 1-19 times | Their mean successes out of 20 |
|---|---|---|
| GPT-5.4 | 462 − 128 = **334** | **12.2** (4,067 of 6,627 successes) |
| Qwen3.8-27B | 453 − 38 = **415** | 10.8 |
| Claude Opus 4.6 | 355 − 70 = **285** | 8.6 |
| Kimi-K2.6 | 427 − 16 = **411** | 8.5 |

For GPT-5.4, all 334 would then have to sit at 17 or below with at most one
at 17, while averaging 12.2 of 20. That is arithmetically possible. It is not
a shape a repeated-trial distribution usually takes.

**2. How long ago.** The figures were published on 2026-08-19 (the Microsoft
post, 36 days ago), 2026-08-20 (v1, 35 days) and 2026-08-29 (v2, 26 days).

**3. How it relates to what has already been read.**
- **It answers the question level 1 left open** (its item 3, "Nothing read
  says which of the two the paper reports"). The answer comes from the numbers
  themselves rather than from the method section, which is still unread.
- **It lifts the caveat on level 1's item 2 table.** That table set 47.53
  against 25.25, and its part 7 noted the estimator was unresolved. The figures
  are both whole-task counts, **so they are like-for-like.**
- **The 22.28-point gap stands** as a difference of 241 − 128 = **113 tasks**
  that one model passed every time and the other did not reach.

**4. What through-line it changes.** "Report pass^k with its estimator"
(level 1) gains a practical check anyone can run without the data. **A
repeated-trial metric that claims to count tasks has to be a multiple of 1/N,
where N is the number of tasks.** Any benchmark that publishes N and a pass^k
figure can be checked this way.

It does not settle *how* the authors computed the figures. It settles *what*
they are.

**5. What to research next.**
- **P1-L2a - The LaTeX source of v2, for Appendix D.1 and any pass^k formula.**
  Three HTML renderings and the PDF fetch all failed to reach the appendices.
  - The source tarball is at `arxiv.org/e-print/2608.19741v2`. A driver with a
    shell can untar it and search for `pass\^`, `all 20`, `binom` and `D.1`.
  - Record the formula if one is given.
  - Run the grid test on every pass^20 interval endpoint in D.1. Bootstrap
    endpoints over task clusters should also be whole-task counts if the point
    estimate is.
  - *In window: 2026-08-29.*
- **P1-L2b - The pass^k estimator in Sierra's τ-bench / τ²-bench code, which
  Thinkingbox cites for the metric.** Sierra is the customer-service agent
  company that built τ-bench.
  - Read the metric function in `sierra-research/tau2-bench` (and `tau-bench`)
    raw.
  - Establish whether it is C(c,k)/C(n,k) or (c/n)^k, and the commit date it
    took its current form.
  - Say whether the literal-share reading Thinkingbox's figures imply matches
    the benchmark it follows.
  - *In window only if the function changed on or after 2026-06-26; otherwise
    Background.*

**6. Source.** From open search.
- [arXiv:2608.19741v2](https://arxiv.org/html/2608.19741v2): **full page read**,
  two targeted passes. Every pass truncated before Appendix D.
- [arXiv:2608.19741v1](https://arxiv.org/html/2608.19741v1): **full page read**,
  one targeted pass, which truncated at Appendix B.
- [Microsoft post, "ThinkingBox: Measuring whether agents finish the job"](https://commandline.microsoft.com/thinkingbox-bench-agent-benchmarking/):
  **full page read**, two passes.

**7. Verified / inferred / assumed.**
- **Verified:** every printed figure in the first table, each at the location
  named, and the task and trial counts.
- **Computed here:** every ×5.07 product, grid match, margin and mean. The
  arithmetic is shown above.
- **Inferred:** the 5%-per-figure coincidence rate. It assumes the fractional
  part of the aggregator's extra credit is spread evenly, which is
  reasonable with 285-415 sometimes-pass tasks per model but is not measured.
- **Inferred:** that the figures are the literal share. That is the joint
  reading of the grid match and the implausibility of the alternative, and
  **no per-task count was seen.**
- **Assumed:** that each figure's denominator is all 507 tasks. The release
  README says the aggregate "metrics are omitted if tasks have unequal attempt
  counts", which points that way, but a model with excluded tasks would break
  the check.

---

### 2. Microsoft's launch post defines pass^20 as the literal share and says it was computed with `tb agg`, and `tb agg` has computed (c/n)^k since its first commit

**1. What it is.** A Microsoft blog post, "ThinkingBox: Measuring whether
agents finish the job", by **Liang-Chun Tsai**, Principal Machine Learning
Engineer, dated **2026.08.19**. That is the day before v1 and the day #22
merged.

**Its definition**, verbatim: "pass^20: On what percentage of tasks did all 20
attempts succeed?"

**Its reproduction line** says the release instructions cover "computing
pass@1, pass@20, and pass^20 with tb agg".

**Two figures that appear in neither arXiv text as fetched:** "Claude Opus 4.6
and Kimi-K2.6 score 37.91% and 37.66%. Opus reaches 70.02% pass@20 and 13.81%
pass^20. Kimi reaches 84.22% pass@20 but only 3.16% pass^20." Neither 13.81
nor 3.16 was found in v1 or v2 as far as each fetch reached.

**The release README repeats the hedge.** The v1 release README in
`microsoft/thinkingbox-data` says "pass^20 **estimates** whether all 20
attempts succeed". It points to `uv run tb agg output_thinkingbox_bench_v1.jsonl`.

**What the code history shows.** `thinkingbox/cli/agg_main.py` has exactly
**two commits**:
- **The initial commit** (`50b1367`, 2026-05-16, `ltsai-microsoft`). Its
  function was already named `pass_power_k_unbiased`, and already returned
  `(c / n) ** k`. The docstring **#22 removed** reads: "It is calculated as
  (mean pass rate) ** k".
- **#22** (`c360142`, 2026-08-19, Young Ko; 13 additions, 12 deletions). The
  diff touches only names, the docstring and the call site.
  - The `return (c / n) ** k` line is in none of its hunks.
  - #22 added the sentence that the choice is deliberate: "Unlike pass@k, we
    deliberately use a biased estimator for pass^k."

**So the formula was never changed.** #22 corrected the *label*: until
2026-08-19 the code called (c/n)^k "unbiased". Whenever the paper's runs were
aggregated, `tb agg` would have produced (c/n)^k.

**How `tb agg` presents its results.** It prints two things:
- **The pass^k line is a fraction to two decimals**: `print(f"  pass^{k}:
  {v:.2f}")`, never multiplied by 100. For GPT-5.4 it would read
  `pass^20: 0.25` under either estimator.
- **A per-test-case table** with a `Pass` column of successes per task.

A four-significant-figure percentage such as 25.25 therefore cannot have been
read off the pass^k line. The per-task `Pass` column is enough to count the
literal share by hand.

**2. How long ago.**
- The post and #22: 2026-08-19, 36 days ago.
- The data release tag `thinkingbox-bench-v1.0`: 2026-08-17, 38 days ago.
- The initial commit: 2026-05-16, **Background**.

**3. How it relates to what has already been read.**
- **It corrects level 1's item 3 on one point.** That item presented #22 as the
  moment the metric was named. The formula predates the paper by three months.
  #22 only stopped calling it unbiased.
- **It explains item 1 of this level.** The per-task table prints the counts
  from which the literal share is counted, and the pass^k line is too coarse to
  have supplied the published figures.
- **It adds a second pair of models** with the same shape as level 1's item 2,
  from the authors' own post:

  | Model | pass@1 | pass@20 | pass^20 |
  |---|---|---|---|
  | Claude Opus 4.6 | 37.91 | 70.02 | **13.81** |
  | Kimi-K2.6 | 37.66 | 84.22 | **3.16** |

  That is a 0.25-point pass@1 gap against a **10.65-point** pass^20 gap, and
  the ordering on pass@20 runs the other way.

**4. What through-line it changes.** Through-line unchanged; it adds a hazard
to "report pass^k with its estimator". **The tool a benchmark ships for
reproduction and the number its paper prints can use different definitions
while both carry the same label.** Anyone who reruns Thinkingbox with `tb agg`
and compares their pass^20 to the paper's is comparing (c/n)^20 against a
count.

On item 1's margins, the rerun's figure should come out higher than the
paper's. How much higher depends on how many tasks sit at 17-19 successes
(item 3).

**5. What to research next.**
- **P1-L2c - Is there a second aggregation path in `microsoft/thinkingbox`
  that counts all-20 tasks?**
  - List `thinkingbox/` and `scripts/dataset_utils/` through the contents API.
  - Read raw every file that mentions `pass^`, `pass_power`, `all(` over runs,
    or `runs_per_test`.
  - Establish whether any code path returns the share of tasks with c = n, or
    whether the published figures could only have come from outside the
    repository.
  - *In window: repository activity 2026-08-19 to 2026-09-10.*
- **P1-L2d - The Claude Opus 4.6 / Kimi-K2.6 pair: dropped in v1, or never in
  the paper?**
  - In v1's LaTeX source (`arxiv.org/e-print/2608.19741v1`), search for 13.81,
    3.16, 70.02 and 84.22.
  - Record whether v1 printed them anywhere, and whether v2 kept the Opus 4.6
    row's pass@20 and pass^20.
  - Opus 4.6's Table 4 row is carried over unchanged into v2.
  - *In window: 2026-08-20 to 2026-08-29.*

**6. Source.** From open search.
- [Microsoft post](https://commandline.microsoft.com/thinkingbox-bench-agent-benchmarking/):
  **full page read**, two passes.
- [Commit history of `agg_main.py`](https://api.github.com/repos/microsoft/thinkingbox/commits?path=thinkingbox/cli/agg_main.py)
  and [#22's patch](https://api.github.com/repos/microsoft/thinkingbox/commits/c360142):
  **full page read**, as GitHub API JSON.
- [`agg_main.py` at the initial commit](https://raw.githubusercontent.com/microsoft/thinkingbox/50b1367/thinkingbox/cli/agg_main.py)
  and [on `main`](https://raw.githubusercontent.com/microsoft/thinkingbox/main/thinkingbox/cli/agg_main.py):
  **full page read**, for the metric functions, `print_metrics` and the
  per-test table.
- [v1 release README](https://raw.githubusercontent.com/microsoft/thinkingbox-data/main/releases/thinkingbox_bench_v1/README.md):
  **full page read**.

**7. Verified / inferred / assumed.**
- **Verified:** the post's byline, date, definition, reproduction sentence and
  the Opus 4.6 / Kimi sentence. Also the two commits and their dates, #22's
  patch, the unchanged `return (c / n) ** k`, the pre-#22 "(mean pass rate)
  ** k" docstring, the `:.2f` fraction print, the per-test `Pass` column, and
  the README's "estimates" wording.
- **Verified absent:** 13.81, 3.16, 70.02 and 84.22 in v1 (through Appendix B)
  and in v2 (through Table 7). The appendices past those points were not read.
- **Inferred:** that the post's author is the `ltsai-microsoft` who made the
  initial commit. The handle matches the name, and that is not confirmed.
- **Inferred:** that the published figures were counted from per-task output
  rather than from the pass^k line. The precision argument rules out the line.
  It does not show what was used instead.
- **Inferred:** when the paper's runs were aggregated. Nothing read dates them.

---

### 3. No per-trial or per-task results are published, so the size of the difference can only be bounded

**1. What it is.** A check of every place the paper's run data could sit:

| Place | What is there | Results? |
|---|---|---|
| `microsoft/thinkingbox` | Code, config, docs, scripts, tests | **None.** README links no results, leaderboard or trajectories. **Releases: none.** |
| `microsoft/thinkingbox-data` | `dataset/`, `servers/`, `support/`, `releases/` | **None.** `releases/` holds two benchmark folders. |
| `releases/thinkingbox_bench_v1/` | README (7,277 bytes), test list (25,144 bytes), `huggingface/` | **None.** |
| `huggingface/data/` | `agents.parquet` 12,731 B, `scenarios.parquet` 57,496 B, `tasks.parquet` 378,705 B | **Tasks only.** |
| GitHub releases on `thinkingbox-data` | Two, both 2026-08-17 | **No assets.** |
| Hugging Face [`microsoft/ThinkingBox-Bench`](https://huggingface.co/datasets/microsoft/ThinkingBox-Bench) | `data/`, `.gitattributes`, `LICENSE.txt`, `README.md`. 461 kB. 507 task rows plus 5 scenarios and 1 agent. Licence **CDLA-Permissive-2.0** | **No model results or trials.** |

About the Hugging Face dataset:
- Its columns are task definitions: `task_ref`, `domain`, `query`,
  `initial_state_patch_json`, `expected_tool_interactions_json`,
  `rubrics_json` and others.
- The card forbids using the content "for prompt optimization, fine-tuning,
  reinforcement learning, reward-model training, or other model optimization".

**What the missing data would look like.** `tb infer` writes "one JSON object
per trial". `tb agg` reads each trial as a `DecodeResult`, with fields `uid`,
`messages`, `metadata`, `is_system_error`, `test_result` and `usage`. At 507 ×
20 = **10,140 trials per model**, one model's file carries full message
traces. **No such file for any model is public.**

**What the difference could be.** The gap between the two estimators on the
same run, in points, is

(100 ÷ 507) × Σ (c/20)^20, summed over the tasks with 1-19 successes.

One point needs 5.07 "task-equivalents" of extra credit. Holding every
sometimes-pass task at a single count:

| Estimator difference | Tasks at 19/20 (0.358 each) | at 18/20 (0.122 each) | at 17/20 (0.039 each) |
|---|---|---|---|
| **1 point** | 14 (2.8% of tasks) | 42 (8.2%) | 131 (25.8%) |
| **5 points** | 71 (13.9%) | 209 (41.1%) | 654, impossible |
| **10 points** | 142 (27.9%) | 417 (82.3%) | impossible |

Tasks at 16/20 or below add at most 0.0115 each, so they barely matter.

**So a difference big enough to reorder models needs many near-perfect
tasks.** A 5-point difference needs about **one task in seven at 19/20**, or
**two in five at 18/20**. Level 1's 22.28-point Claude Opus 5 / GPT-5.4 gap
could not come from the estimator alone. It is 113 task-equivalents, which
would take about **315 tasks (62%) at 19/20** in one model more than in the
other.

**2. How long ago.**
- The data release: 2026-08-17 (38 days ago).
- The Hugging Face card's last edit: 27 days ago, about 2026-08-28.
- The last `thinkingbox` commit: 2026-09-10 (14 days).

**3. How it relates to what has already been read.** It closes lead P1-L1e as
posed. **Neither estimator can be recomputed from public data**, so item 1's
indirect test is the strongest evidence available.

Level 1's lead P1-L1d (where Claude Opus 5's inconsistency sits, per domain)
is **blocked** for the same reason. The per-task counts it needs are not
released.

**4. What through-line it changes.** "Rank on pass^k" needs a condition
attached: **pass^k from a benchmark that does not release per-task counts
cannot be independently re-derived, only checked for consistency.** This one
passes the consistency check (item 1).

For an enterprise reading a vendor's reliability figure, the table above is
the question to ask: how many tasks sat at 18-19 of 20? The answer decides
whether the estimator matters.

**5. What to research next.**
- **P1-L2e - Any third-party Thinkingbox-Bench run with per-task output.**
  - Search Hugging Face for datasets and Spaces mentioning `ThinkingBox-Bench`
    or `thinkingbox_bench_v1` other than `microsoft/ThinkingBox-Bench`.
  - Search GitHub code for `output_thinkingbox_bench_v1.jsonl` and
    `testlist_thinkingbox_bench_v1.yaml` outside the two Microsoft
    repositories, and search forks of `microsoft/thinkingbox`.
  - For any hit, count c = 20 tasks and compute (c/20)^20 from its per-test
    table.
  - *In window: on or after 2026-08-17.*
- **P1-L2f - The Hugging Face discussion that last edited the card.** The
  README changed about 2026-08-28 "via a pull request discussion".
  - Read that discussion and any others on the dataset.
  - Record whether anyone asked for trajectories or results, and what
    Microsoft answered.
  - *In window: about 2026-08-28.*

**6. Source.** From open search.
- GitHub contents API listings of
  [`thinkingbox-data/releases`](https://api.github.com/repos/microsoft/thinkingbox-data/contents/releases),
  [`releases/thinkingbox_bench_v1`](https://api.github.com/repos/microsoft/thinkingbox-data/contents/releases/thinkingbox_bench_v1),
  [its `huggingface/data`](https://api.github.com/repos/microsoft/thinkingbox-data/contents/releases/thinkingbox_bench_v1/huggingface/data),
  and the [`thinkingbox` root](https://api.github.com/repos/microsoft/thinkingbox/contents/),
  [`docs`](https://api.github.com/repos/microsoft/thinkingbox/contents/docs) and
  [`scripts`](https://api.github.com/repos/microsoft/thinkingbox/contents/scripts):
  **full page read** (JSON).
- Releases for [`thinkingbox`](https://api.github.com/repos/microsoft/thinkingbox/releases)
  (empty) and [`thinkingbox-data`](https://api.github.com/repos/microsoft/thinkingbox-data/releases):
  **full page read**.
- [`thinkingbox-data` README, raw](https://raw.githubusercontent.com/microsoft/thinkingbox-data/main/README.md)
  and the [`thinkingbox` README, raw](https://raw.githubusercontent.com/microsoft/thinkingbox/main/README.md):
  **full page read**.
- The [Hugging Face card](https://huggingface.co/datasets/microsoft/ThinkingBox-Bench)
  and its [file tree](https://huggingface.co/datasets/microsoft/ThinkingBox-Bench/tree/main):
  **full page read**. The `data/` folder was listed on GitHub, not opened on
  Hugging Face.

**7. Verified / inferred / assumed.**
- **Verified:** every listing, size, date, licence and quote above; the empty
  release assets; and the trial fields `tb agg` reads.
- **Computed here:** the difference table. 0.95^20 = 0.3585, 0.90^20 = 0.1216,
  0.85^20 = 0.0388, 0.80^20 = 0.0115.
- **Inferred:** that the Hugging Face `data/` folder holds the same three
  parquet files as the GitHub mirror. The sizes sum to about the card's 461 kB.
- **Assumed:** that "not published" holds for places not checked, such as
  Azure blob links and supplementary material behind the arXiv PDF. The PDF
  could not be read in this runner.

---

### 4. An open issue reports that the tool allowlist can be bypassed to rewrite the backend state the verdict is read from

**1. What it is.** Issue #35 on `microsoft/thinkingbox`, opened **2026-09-21**
by Alen Cheung (@alencheung), is titled "`__reserved__server_tool` is routable
from /call_tool and /mcp, bypassing the scenario tool allowlist".

**What it reports.**
- A reserved dispatch name reaches tools a scenario excluded, because "the
  reserved branch runs before the allowlist lookup".
- It reaches lifecycle tools too. So "state-based assertions can be satisfied
  by rewriting the world through `__reserved__init`".
- That is reward hacking, meaning passing the check without doing the task,
  and "without session churn" that would reveal it.
- It lists four further gaps: caller-supplied session grants, ungated session
  lifecycle operations, non-constant-time token comparison, and non-loopback
  binding without an authentication warning.

**What it does not claim.** It does not say any published score was affected.
No maintainer response was visible when read.

**2. How long ago.** 2026-09-21, 3 days ago.

**3. How it relates to what has already been read.**
- **Thinkingbox's verdict is read from each task's final backend state**
  (level 1, item 1). This issue names a route by which that state could be set
  directly.
- **It is the same class of failure the breadth pass's item 2 measured.** That
  was Hack-Verifiable Terminal Bench, where Claude Opus 5's shortcut-taking was
  17.4% at L0.
- Nothing here shows any agent in the paper's runs used the route.

**4. What through-line it changes.** Through-line unchanged; it adds a
precondition to "the verdict is the backend state". **The state check is only
as strong as the agent's inability to write state by any route other than the
workflow.** Pass^20 counts every trial the state check passed, so a bypass
would inflate it as easily as pass@1.

**5. What to research next.**
- **P1-L2g - Can an agent under evaluation reach the reserved route, or only an
  external caller?**
  - Read raw the MCP server dispatch code the issue cites in
    `microsoft/thinkingbox`.
  - Establish whether the tool list presented to the agent in a `tb infer` run
    exposes `__reserved__server_tool`, or whether reaching it needs direct
    HTTP access the agent does not have.
  - Record any maintainer reply or fixing commit after 2026-09-21.
  - *In window: 2026-09-21 onward.*
- **P1-L2h - Would a reserved-tool call show up in the trace behind Table 5's
  failure modes?** Establish from the trace format (`docs/history_and_metadata.md`
  and `docs/test_case_format.md`, raw) whether calls to reserved names are
  logged per trial. If they are, a released trace could be audited for them.
  *In window: repository state as of 2026-09-24.*

**6. Source.** From open search.
- [Issue #35](https://github.com/microsoft/thinkingbox/issues/35): **full page
  read**.
- The issue lists of [`thinkingbox`](https://api.github.com/repos/microsoft/thinkingbox/issues?state=all&per_page=100)
  and [`thinkingbox-data`](https://api.github.com/repos/microsoft/thinkingbox-data/issues?state=all&per_page=100):
  **full page read** (JSON).

**7. Verified / inferred / assumed.**
- **Verified:** the title, author, date, quoted sentences, the four further
  gaps, and the absence of any claim about published scores.
- **Inferred:** that no maintainer has responded. That rests on no reply being
  visible in one read.
- **Assumed, and load-bearing for the item's relevance:** that the route is
  reachable in an evaluation run at all. The issue describes the server's
  endpoints, not the agent's tool list. That is lead P1-L2g.

---

### Searched for and not found (level 2)

- **Per-trial or per-task results for any model**, in either repository, their
  releases, the Hugging Face dataset, the READMEs, or any issue or pull request
  on either repository (item 3). None.
- **A pass^k formula in the paper.**
  - v2 was fetched three ways (arXiv HTML, ar5iv, and a reader proxy that
    returned an unrelated figure caption). All three stopped before Appendix D.
  - The PDF downloaded but could not be converted to text in this runner.
  - Within what was read, the only wording is "all-20 success" and "succeeds in
    all 20 attempts". **No formula.**
- **Appendix D.1's bootstrap intervals.** Not read, for the same reason. Lead
  P1-L2a.
- **When the paper's runs were produced or aggregated.** Not stated in the
  post, either README, or the text read.
- **Any change to the pass^k formula in the code history.** None. Two commits
  touch `agg_main.py`, and neither changes the `return` line.
- **Any code in `tb agg` that counts tasks with c = n.** None in `agg_main.py`.
  The rest of the package was not searched (lead P1-L2c).
- **13.81, 3.16, 70.02 and 84.22 in the paper.** Not in v1 through Appendix B,
  and not in v2 through Table 7. They appear only in the Microsoft post.
- **Any outside party questioning the estimator.** None found. The one open
  issue on either repository that questions evaluation integrity is #35 (item
  4), and it is about state rewriting, not the metric.

> **Driver's check on level 2** (2026-09-24, by hand).
> - **The grid test, re-done independently:** 128/507 = 25.247, 241/507 =
>   47.535, 38/507 = 7.495, 70/507 = 13.807 and 16/507 = 3.156. Printed to two
>   decimals, these are 25.25, 47.53 (47.5345), 7.50, 13.81 and 3.16. All five
>   match. The pass@20 figures also land on the grid: 462/507 = 91.124,
>   355/507 = 70.020, 427/507 = 84.221.
> - **The Microsoft post was re-read by the driver.** It gives the byline
>   "2026.08.19", Liang-Chun Tsai; defines pass^20 as "On what percentage of
>   tasks did all 20 attempts succeed?"; and gives GPT-5.4 65.36 / 91.12 /
>   25.25, Claude Opus 4.6 37.91 / 70.02 / 13.81 and Kimi-K2.6 37.66 / 84.22 /
>   3.16. All confirmed. The post's summariser also rendered the `tb agg` step
>   as aggregating "20 attempts per task into one average", which is the
>   ambiguity this level describes.
> - **What the driver could not do:** open the LaTeX source or the PDF. No
>   shell in this runner, so lead P1-L2a is displaced, not dropped.

---

## Level 3 - Can the agent under evaluation reach the state-rewrite route?

**Window:** 90 days, so items are dated on or after 2026-06-26. Everything
counted below is dated 2026-09-10 (the `main` commit read) or 2026-09-21 (the
issue). Nothing older is used.

**What this level found.** The answer is **reachable only by an outside
caller**. In a default `tb infer` run, the agent under evaluation cannot reach
the state-rewrite route that issue #35 describes.
- **The model is only offered the tools the scenario granted**, plus one
  built-in tool. The reserved name is never among them.
- **The harness refuses any tool call whose name is not on that list.** It
  answers "does not exist" and never forwards the call to the tool server.
- **The model has no other route to the server.** No scenario in the benchmark
  grants a shell, code-execution or URL-fetching tool, and the harness adds no
  tools hosted by the model provider.

**The catch is where the guard lives.** It is in ThinkingBox's own client, and
the server has no equivalent. So the gap is closed only for agents driven
through `tb infer`. Any agent seated directly on the server's `/mcp` endpoint
is an "outside caller" in the code's terms. The issue shows that such a caller,
using the official MCP client library, can reach the route. The framework says
it is meant for reinforcement-learning training loops as well as evaluation.

**Nothing moved in the window beyond the issue itself.** It has no reply, no
label, no linked pull request and no timeline events, and there has been no
commit to either repository since 2026-09-10.

---

### 1. In a default `tb infer` run the agent is refused any tool name it was not offered, so the reserved route is closed to it

**1. What it is.** A reading of the code that sits between the model and the
tool server in `microsoft/thinkingbox`, at `main` commit `ea053ba9`. That is
the commit the issue says it verified against, and it is still the newest one.

**How a run is wired** (README): the operator starts the **session proxy**
with `tb mcp-start` and then runs `tb infer`. The session proxy is a
long-running local HTTP server that sits in front of the MCP tool servers and
gives each trial its own isolated session. `tb infer` is the command that runs
the agent against the tasks. The model itself is called over the provider's
API.

**Three steps decide the answer.**

*Step 1 - what the agent is shown.*
- `run` in `thinkingbox/common/agent_user_loop.py` calls
  `mcp_tools = await mcp_proxy.list_tools()`. It then builds the agent with
  `agent_session_factory(mcp_proxy=..., mcp_tools=mcp_tools, ...)`.
- The only orchestrator type in `config_types.py` is
  `ThinkingBoxOrchestratorConfig`, and its factory (`agent_session_factory.py`)
  always builds `AgentSession.from_config`. That function sets
  `all_tools = config.builtin_tools + mcp_tools`, and the session then calls
  `self.llm.add_tools(self.tools)`.
- On the server side, `ToolDispatcher.list_tools`
  (`thinkingbox/tools/client/common.py`) returns
  `{name: info.tool_def for name, info in self.tools.items()}`. That is the
  filtered set. The issue itself confirms the reserved name "is hidden from
  the client".

*Step 2 - what happens to a name that is not on the list.*
- `AgentSession._handle_tool` (`thinkingbox/common/agent_session.py`) checks
  `if tc.name not in self.llm.tool_names:`. For such a name it returns
  `Error: function '{tc.name}' does not exist` and does not call the server.
- Only a name that passes this check reaches the file's single server call,
  `result = await self.mcp.call_tool(tc.name, **tc.arguments)`.
- `_handle_tool` is used for both sequential and parallel tool calls. Tools
  that end the agent's turn skip it, but they never call the server either.
- `tool_names` is filled only by `add_tools` in each of the three model
  adapters read: `anthropic_messages_session.py`, `aoai_responses_session.py`
  and `aoai_session.py`. None of the three adds provider-hosted tools such as
  web search or code execution.

*Step 3 - what the agent could reach instead.*
- **The built-in tool.** The benchmark's agent file
  (`thinkingbox-data/dataset/agent/think.yaml`) declares one:
  `InjectionAttackInToolResponse`, an end-turn alarm with a single `reason`
  argument.
- **The scenario tools.** The five benchmark scenarios were read: neobank
  support, consulting, auto insurance, external retail and external booking.
  Every tool they grant is a business API, such as Zendesk, Okta, Workday,
  policy, billing, claims, orders, payments and bookings. None runs shell
  commands, executes code, fetches URLs or touches the file system.
- **Nothing else.** The model has no route of its own to the proxy on
  `127.0.0.1:7111`.

**Where the lines are.** The issue gives line numbers for the files it cites,
at `ea053ba9`:
- the reserved branch at `common.py:255`;
- `/call_tool` at `session_proxy.py:590`;
- `/mcp` at `session_proxy.py:251` and `:264`.

This level read the same code by function name and quoted line. It could not
get stable line numbers for `agent_session.py`, because the page-fetch tool
numbered the file differently on two reads.

**2. How long ago.** The code was read at `ea053ba9`, committed 2026-09-10 (14
days ago). The issue was opened 2026-09-21 (3 days ago).

**3. How it relates to what has already been read.** It settles level 2's item
4. That item's relevance rested on the assumption "that the route is reachable
in an evaluation run at all". **In the harness the paper describes, it is
not.** So the paper's figures are not exposed to this route through the agent.
Nothing here says anything about any other route.

**4. What through-line it changes.** Level 2 added "the state check is only as
strong as the agent's inability to write state by any route other than the
workflow". This item narrows where that inability comes from. **It is enforced
by the harness client, not by the tool server.** A benchmark's integrity claim
therefore holds only for the harness that produced its numbers. It does not
carry over to the server's other front doors.

**5. What to research next.**
- **P1-L3a - Were all 13 models in v2's Table 4 run through `tb infer` with
  the built-in `AgentSession`?**
  - In v2's Appendix C.1, via the LaTeX source at
    `arxiv.org/e-print/2608.19741v2`, find the harness description for each
    model.
  - Look for any model driven by an outside framework or MCP client seated on
    `/mcp`. For such a row the route would count as reachable by the agent.
  - *In window: 2026-08-29.*
- **P1-L3b - Does the user simulator or the rubric judge get the proxy?**
  - Read raw `thinkingbox/common/user_simulated_answer.py` and
    `rubrics_judge.py`.
  - Establish whether either model is given tools or the `mcp_proxy` handle.
    Both are other models in the loop, and the simulator is GPT-5.4-mini.
  - *In window: code at `ea053ba9`, 2026-09-10.*

**6. Source.** From open search, on `github.com` and
`raw.githubusercontent.com`.
- **Full page read:**
  - `agent_user_loop.py` (three passes);
  - `agent_session.py` (four passes, one of them GitHub's plain-text view);
  - `agent_session_factory.py`;
  - `anthropic_messages_session.py`;
  - `aoai_responses_session.py`;
  - `aoai_session.py` (for the tool methods only);
  - `config_types.py` (two targeted passes);
  - `tools/client/common.py` (for `ToolDispatcher`);
  - `mcp_proxy_client.py`;
  - the README;
  - [`think.yaml` in `thinkingbox-data`](https://raw.githubusercontent.com/microsoft/thinkingbox-data/main/dataset/agent/think.yaml);
  - the five benchmark scenario files under
    [`thinkingbox-data/dataset/scenario/`](https://github.com/microsoft/thinkingbox-data/tree/main/dataset/scenario);
  - the repository tree through the
    [GitHub API](https://api.github.com/repos/microsoft/thinkingbox/git/trees/main?recursive=1).
  - Every file named without a link is under
    [`microsoft/thinkingbox` at `main`](https://github.com/microsoft/thinkingbox/tree/main).
- **Limit on all of these reads.** Every read went through a page-fetch tool
  that returns quoted extracts rather than the raw file.
- **Issue:** [#35 through the API](https://api.github.com/repos/microsoft/thinkingbox/issues/35),
  **full page read**.

**7. Verified / inferred / assumed.**
- **Verified:**
  - the `tc.name not in self.llm.tool_names` guard, and that `_handle_tool` is
    the file's only `self.mcp.call_tool` call;
  - `all_tools = config.builtin_tools + mcp_tools`, and the single
    orchestrator type;
  - that `ToolDispatcher.list_tools` returns only `self.tools`;
  - that no provider-hosted tools are added by the three adapters read;
  - the one built-in tool, and that the five scenarios' tools are business
    APIs.
- **Inferred:** that the model has no network path of its own to the proxy.
  That rests on no provider-hosted tool being attached, and on the tool list
  above.
- **Not read:** the `LLMSessionConfigT` variants beyond these three adapters,
  and `update_tools_with_client_config`. That function is called on the tool
  list, and was assumed to edit definitions rather than add names.
- **Assumed:** that the paper's runs used this code path (lead P1-L3a).

---

### 2. The route stays open to anything seated directly on the proxy, which the framework's own `/mcp` endpoint and its stated training use invite

**1. What it is.** Who counts as the "outside caller" of the answer above, read
from `thinkingbox/tools/session_proxy.py` and the repository documentation.

**The proxy's defaults.**
- `tb mcp-start` binds to `--host` **`127.0.0.1`**, port **7111**. Loopback
  means that only processes on the same machine can connect.
- The API key defaults to **`None`**. Authentication applies only when it is
  enabled, through `THINKINGBOX_SESSION_PROXY_KEY` or `--api-key`.

**Two front doors, and neither applies the check that `AgentSession` does.**
- **`/call_tool`.** `_call_tool_inner` passes `data.tool_name` straight to
  `session.call_tool`.
- **`/mcp`**, documented in the code as "MCP streamable-http endpoint. Supports
  tools/list and tools/call methods. Forwards requests to the session in header
  X-TB-Session-Id."
  - `SessionProxyMiddleware.on_list_tools` lists only `session.tools`.
  - `on_call_tool` forwards `context.message.name` unchanged.
  - That mismatch is how the issue's official-MCP-client test reached a tool
    it had not been shown.
- **Behind both.** `ToolDispatcher.call_tool` handles
  `RESERVED_SERVER_TOOL = "__reserved__server_tool"` before it looks the name
  up in the filtered set.
- **The reserved names in the file:** `__reserved__init`,
  `__reserved__geteffects`, `__reserved__teardown` and `__reserved__proxy_info`.
  The harness's own calls to the first three go through a separate method,
  `ToolDispatcherExt._call_reserved_tool_if_exists`.

**Who sits on those doors in a default run.** Two pieces of ThinkingBox's own
code send tool names to the proxy without checking them.
- **Test code.** `SessionClientFixture.call_tool`
  (`thinkingbox/common/mcp_proxy_client.py`) posts `__reserved__server_tool`
  on purpose. The issue calls this the one legitimate consumer.
- **History replay.** `replay_history_tool_calls` (`agent_user_loop.py`)
  re-runs tool calls recorded in a test's `.meta.yaml` history. It runs only
  `if tc.history:`, and the history is written by the test author, not the
  agent.
  - The published task table on Hugging Face has no history field. Its columns
    run from `task_ref` to `release_tag`, with `expected_tool_interactions_json`
    as the only recorded calls.

**Where the route matters.** The repository describes itself as a framework
"for offline training-data generation, reinforcement-learning training loops,
and model evaluation".
- Its own deep-dive document names the risk: during fine-tuning, an agent
  "learning to 'game' the tests (aka reward hacking) by generating the
  expected output without actually performing the necessary actions".
- The README describes only `tb infer` as a client of the proxy. It gives no
  instructions for seating an outside agent on `/mcp`. The endpoint exists,
  and so does the header.

**2. How long ago.** The code is at `ea053ba9`, 2026-09-10 (14 days ago). The
issue was opened 2026-09-21 (3 days ago).

**3. How it relates to what has already been read.**
- It restates the issue's own scoping with the code behind it. The issue calls
  this "an eval-correctness gap in the instrument rather than a crossed
  security boundary", because "the documented default topology runs the proxy
  on loopback under the operator's own account".
- Level 1's Background reference, τ-bench, and the breadth pass's
  Hack-Verifiable Terminal Bench both measure what an agent does with the tools
  it is given. **This is about tools it is not given.**

**4. What through-line it changes.** Through-line unchanged. It adds a question
an enterprise should ask of any sandboxed benchmark it reuses as a training
reward or as an acceptance test: **is the tool grant enforced at the server, or
only in the vendor's harness?** A benchmark that is sound when run through its
own harness can still become hackable when its server is reused as an RL
environment. The published numbers are unaffected.

**5. What to research next.**
- **P1-L3c - Would the grader notice a state rewrite through
  `__reserved__init`?**
  - In `thinkingbox-data/servers/tb_business_ops_servers_202606/`, read raw
    how one server implements `__reserved__init` and `__reserved__geteffects`.
  - Establish whether init replaces the world or patches it, and what baseline
    the effects are measured from.
  - The Hugging Face card says the expected end state is "materialize[d] at
    runtime by replaying tool calls against a fresh database". Establish
    whether a rewritten world would diff as clean.
  - *In window: servers released 2026-08-17.*
- **P1-L3d - A private or advisory response to #35.**
  - The repository's `SECURITY.md` asks that vulnerabilities not be reported
    through public issues, which may explain the silence.
  - Check `api.github.com/repos/microsoft/thinkingbox/security-advisories` and
    the issue's timeline weekly.
  - Record the first maintainer action and whether the fix follows the issue's
    step 1: refusing `__reserved__*` names on both front doors.
  - *In window: 2026-09-21 onward.*

**6. Source.** From open search.
- **Full page read:**
  - `session_proxy.py` (two targeted passes, for the host and port defaults,
    `_call_tool_inner`, both middleware methods, the reserved names and the
    authentication default);
  - `mcp_proxy_client.py`;
  - `agent_user_loop.py`;
  - the README (two passes);
  - [`docs/session_proxy_config.md`](https://raw.githubusercontent.com/microsoft/thinkingbox/main/docs/session_proxy_config.md);
  - [`docs/test_cases_deep_dive.md`](https://raw.githubusercontent.com/microsoft/thinkingbox/main/docs/test_cases_deep_dive.md)
    (for the reward-hacking passage);
  - [`SECURITY.md`](https://raw.githubusercontent.com/microsoft/thinkingbox/main/SECURITY.md);
  - the [Hugging Face card](https://huggingface.co/datasets/microsoft/ThinkingBox-Bench),
    for its column list.
- **Search summary only:** the repository's self-description, from its
  [GitHub page title](https://github.com/microsoft/thinkingbox) as returned in
  search.

**7. Verified / inferred / assumed.**
- **Verified:**
  - the `127.0.0.1` / `7111` defaults and the `None` API key;
  - both front doors forwarding the name unchanged, and `on_list_tools`
    listing only granted tools;
  - the four reserved names in the proxy;
  - the fixture's use of the reserved name, and history replay being
    conditional on `tc.history`;
  - the card's columns, the deep-dive quote and `SECURITY.md`'s instruction.
- **Inferred:** that the 507 published tasks never use history replay. The
  card lists no history field, but the test files in `thinkingbox-data` were
  not searched for `.meta.yaml` companions.
- **Inferred:** that the silence on #35 reflects private handling. Nothing
  says so.
- **Not established:** whether anyone uses the `/mcp` endpoint as a training
  environment.

---

### 3. A refused reserved-name call by the agent would sit in its trace; a direct call to the proxy would not, and no traces are released either way

**1. What it is.** What the per-trial record would show, read from the code
that writes it and the two documents named in the lead.

**What `tb infer` writes per trial** (`thinkingbox/cli/infer.py`) is a
`DecodeResult` with these fields:
- `uid`, `messages`, `test_result`, `test_context`, `test_tags`, `tools`;
- `raw_messages`, `user_llm_history`, `usage`, `metadata`, `finish_reason`.

**Where the agent's calls go.** In `AgentSession`, every tool call and its
response are appended through `self.add_messages([tr])` into
`self.conversation.messages`, and also into
`self.conversation.metadata["tool_calls"]`. This includes the "does not
exist" error.

**What that means for each kind of call.**
- **The agent names the reserved tool.** The trace would show it twice: as the
  model's call, and as the error the harness returned instead of calling the
  server. `tools` records the list the agent was actually offered.
- **History replay.** Its errors are recorded in
  `DecodeResult.metadata["replay_warnings"]` (`docs/history_and_metadata.md`).
  Replayed calls that succeed are not described as marked in the trace.
- **Test code and outside callers.** Calls on either front door never pass
  through `AgentSession`, so **nothing in the per-trial record captures
  them**.
  - Test code reads state as `x.effects` (`docs/test_case_format.md`), which
    the harness fills through `__reserved__geteffects`.
  - Neither document describes any record of calls on the proxy side.

**2. How long ago.** The code and documents were read at `ea053ba9`,
2026-09-10 (14 days ago).

**3. How it relates to what has already been read.** It answers lead P1-L2h.
Combined with level 2's item 3, it says **an audit is possible in principle and
impossible in practice**. The field that would show an attempt exists, but no
per-trial file for any model is public. The route the code leaves open, direct
calls to the proxy, would not show up in that field even if the files were
released.

**4. What through-line it changes.** "Pass^k from a benchmark that does not
release per-task counts cannot be independently re-derived" (level 2) extends
to integrity. **A trace can show what the agent attempted. It cannot show what
else happened to the backend during the trial.** Only proxy-side logging could
show that.

**5. What to research next.**
- **P1-L3e - Does the proxy log tool calls on its side?**
  - In `session_proxy.py` and `tools/client/worker.py`, read raw every
    logging call on the `call_tool` path.
  - Establish whether each call's name, session id and caller is written
    anywhere. That would be the only audit trail for calls from outside the
    agent loop.
  - *In window: code at `ea053ba9`, 2026-09-10.*
- **P1-L3f - Where the "does not exist" refusal lands in Table 5.**
  - In `agg_main.py` and any failure-mode classifier in the package, find how
    a trial containing a refused tool name is classified.
  - Establish whether it counts under "Tool usage", the 79.9% mode (level 1,
    item 2).
  - *In window: code at `ea053ba9`, 2026-09-10.*

**6. Source.** From open search.
- **Full page read:**
  - `infer.py` (for the `DecodeResult` fields);
  - `agent_session.py` (for `add_messages` and the `tool_calls` metadata);
  - [`docs/history_and_metadata.md`](https://raw.githubusercontent.com/microsoft/thinkingbox/main/docs/history_and_metadata.md)
    and [`docs/test_case_format.md`](https://raw.githubusercontent.com/microsoft/thinkingbox/main/docs/test_case_format.md).
- **Read as summaries only.** Both documents were returned as summaries plus
  short quotes, because the fetch tool declined to reproduce them whole.

**7. Verified / inferred / assumed.**
- **Verified:**
  - the `DecodeResult` field list;
  - that refused calls and their error are appended to `messages` and to
    `metadata["tool_calls"]`;
  - the `replay_warnings` field;
  - `x.effects` as the state accessor.
- **Inferred:** that `x.effects` is filled through `__reserved__geteffects`.
  The proxy calls that name, but the path from there to `x.effects` was not
  traced.
- **Inferred:** that direct calls on the proxy leave no per-trial record.
  Nothing read writes one, and proxy-side logging was not read (lead P1-L3e).

---

### Searched for and not found (level 3)

- **Any maintainer response to #35.** None, as of 2026-09-24:
  - no comments, no labels, `updated_at` equal to `created_at`, and an
    [empty timeline](https://api.github.com/repos/microsoft/thinkingbox/issues/35/timeline);
  - no issue or pull request numbered above 35;
  - the five open pull requests created that day (#30-#34) are Dependabot
    dependency bumps, all opened before the issue;
  - no commit to `thinkingbox` after `ea053ba9` (2026-09-10), and none to
    `thinkingbox-data` since 2026-09-15.
- **A reserved-name filter anywhere on the agent's side.** None. The agent is
  protected by the general "not in `tool_names`" check, not by anything that
  knows about `__reserved__`.
- **A shell, code, HTTP-fetch or file-system tool in any benchmark scenario,
  or a provider-hosted tool in any of the three model adapters read.** None.
- **Documentation for seating an external agent on `/mcp`.** None in the
  README. The endpoint and its header are documented only in code.
- **Outside coverage of #35.** Two searches found only the issue itself.
  - A Spanish explainer on [jacar.es](https://jacar.es/thinkingbox-sandbox-agentes/)
    (2026-09-11, full page read) describes the `__reserved__init` and
    `__reserved__geteffects` hooks without raising the issue, which it
    predates.
  - An AlphaSignal news item was seen as a search result only.

---

> **Driver's check on level 3** (2026-09-24). The driver re-read
> `thinkingbox/common/agent_session.py` on `main`. `_handle_tool` contains
> `if tc.name not in self.llm.tool_names:`, which returns `Error: function
> '{tc.name}' does not exist`, **before** `result = await
> self.mcp.call_tool(tc.name, **tc.arguments)`. That is the guard this level's
> answer rests on, confirmed verbatim. The server-side line numbers are the
> issue's and were not re-checked.

## Where this path ends

Taken together, the three levels say that **Thinkingbox's reliability headline
holds up, but only its authors can verify it.** Level 1 showed that the
headline pass^20 changed model between versions without anything being
re-measured. Level 2 showed that every published pass^20 is a whole-task count,
so it is the literal "all 20 succeeded" share, even though the tool the authors
ship for reproduction computes a different, larger quantity. Level 3 showed
that the state-rewrite gap reported on 2026-09-21 is closed to an agent run
through `tb infer`, but the closure is in the harness client rather than the
server, so it does not extend to agents or training loops seated directly on
the proxy. Still open: whether every model in the paper ran through `tb infer`
(P1-L3a), whether a rewritten world would pass the effects-based grader
(P1-L3c), a maintainer's answer to #35, and the appendices no fetch in this
runner could reach. If the path continued, the next lead would be **P1-L3c**,
because it decides whether the gap matters where it is still open.
