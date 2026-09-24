# Auto breadth - methodology for proving agentic AI efficacy - breadth pass - 2026-09-24

**Produced by a research subagent in auto-breadth mode**, as step 1 of
[`docs/reader/auto-breadth.md`](../../../reader/auto-breadth.md). It is not a
brief on an adopted topic, and nothing in it is a profile change.

**The decision this serves:** which angles on *how agentic AI efficacy is
proven* - study designs, evals, benchmark validity, and what organisations
accept as evidence - are worth following deeper. The reader tracks this as
`efficacy-methodology`, a Depth entry under `agent-efficacy`, and it counts
lessons from any agentic domain.

**Window:** `efficacy-methodology` has had 0 runs, so the window is 90 days.
Items are dated on or after **2026-06-26**. Anything older appears only as a
marked **Background** note and is never counted as an item.

**Reachability this run.** `arxiv.org` (both `/html/` full text and `/abs/`
pages), `nist.gov`, `metr.org` and the EU AI Act Service Desk all answered. Every
item below rests on a full-page read. Where a figure appears only in a chart and
not in the text, or where a search summary disagreed with the page, the item
says so.

---

## Headline

**This quarter the evidence for agent efficacy moved away from "did it succeed
once" in four places at the same time. The only large causal study of deployed
agents in the window still measured a count that a second study, published the
next day, shows is the wrong outcome.**

- **Deployed-agent evidence (item 1).** Microsoft's authors estimate that
  command-line coding agents raised merged pull requests per engineer per day by
  **+24.0% [95% CI +14.5%, +33.7%]**. That study was submitted 2026-07-01. A
  day later, a CMU/Stanford study of a different firm found per-developer pull
  requests up **2.09×**. Over the same period, human substantive review fell
  from about **39% to 21%** of pull requests. The count went up, and the
  checking behind each change went down.
- **Benchmark validity (item 2).** The UK AI Security Institute built automated
  scanners that read agent transcripts looking for flaws in the benchmark, and
  confirmed flaws in **five** widely used benchmarks, SWE-bench Verified among
  them. A separate benchmark planted exploitable answer files for agents to
  find. One frontier model used them in **59.8%** of runs at the lowest
  hardening level.
- **Grading (item 3).** A new benchmark of 507 business-workflow tasks run 20
  times each shows the best model at **65.36% pass@1**. **91.12%** of tasks
  succeed at least once in 20 tries, and only **25.25%** succeed all 20 times.
  An enterprise analytics agent at Thumbtack gave numerically close answers
  from the wrong source tables on **15 of 30** traces.
- **What institutions use (items 4 and 5).** Two very different organisations
  published how they turn many noisy task results into one number, and both use
  the same tool, **item response theory**. NIST's CAISI uses it for a
  government "cyber capability index" with Wilson confidence intervals. A Meta
  team uses it to cut a three-hour production benchmark for an analytics agent
  to 200 of its 519 questions at about 1 point of error. That convergence is
  this pass's through-line, and neither source cites the other.

A standing item from earlier briefs also moves. **CAISI has now published
inside the window**, three times: GLM-5.2 on 2026-07-17, Kimi K3 on
2026-07-23 and GLM-5.3 on 2026-09-17. These are model capability assessments,
not the AI Agent Standards Initiative output that #26 was waiting for, and that
initiative still shows nothing dated in the window (item 5).

---

## The items

### 1. The largest deployed-agent study in the window measured merged pull requests, and a study published the next day shows why that is not enough

**1. What it is.** Two quasi-experimental studies of coding agents rolled out
inside real companies, submitted one day apart. Neither is a randomised trial,
and both say so.

**Microsoft: "Adoption and Impact of Command-Line AI Coding Agents"**
(Murphy-Hill, Butler and Savelieva, all at Microsoft, arXiv:2607.01418,
2026-07-01).
- **What was studied.** Microsoft's internal rollout of two tools on
  **2026-01-05**: Claude Code, Anthropic's terminal-based coding agent, and
  GitHub Copilot CLI, GitHub's equivalent.
- **Data.** Engineer-week data from 2025-10-01 to 2026-04-29, with a 13-week
  pre-period and a 16-week post-period.
- **Outcome.** Merged pull requests, counted only if a pull request completed
  within 28 days. Measurement covers Azure DevOps, Microsoft's internal code
  hosting and review system, and so undercounts work elsewhere.
- **Two designs.**
  - A **synthetic control** (Google's CausalImpact Bayesian structural
    time-series). A counterfactual for adopters is built from ten daily-mean
    series of non-adopters. A placebo intervention in October 2025 returned
    **-1.1% [-10.6%, +8.6%]**, which passes the check.
  - A **within-engineer Poisson model** with engineer and week fixed effects.
- **Headline:** "+24.0% lift in PRs/engineer/day over the post-period [95% CI
  +14.5%, +33.7%]", holding at **+20.0% [+7.4%, +35.9%]** in March-April.
- **Tool comparison.** Among single-tool users, Copilot CLI shows **+24.9%
  [+23.0%, +26.8%]** and Claude Code **+11.4% [+9.4%, +13.6%]**.
- **What the authors concede.** They read their own dose-response curve as
  association rather than cause ("heavier-use weeks may carry a lighter task
  mix"). They name their positionality: "Microsoft sells AI tools, encourages
  their use, and owns GitHub". On quality they write "a merged PR is not the
  same as the value it delivers", and "the field still lacks agreed-upon
  measures".

**CMU/Stanford: "AI Writes Faster Than Humans Can Review: A Longitudinal Study
of an Enterprise '2×' Mandate"** (He, Agarwal, Denisov-Blanch, Azaletskiy,
Koyejo and Vasilescu, arXiv:2607.01904, 2026-07-02).
- **Setting.** An unnamed mid-sized B2B software firm that announced a "2×"
  productivity mandate in June 2025.
- **Data.** **802 developers** (564 in the estimation sample) and **196,212
  pull requests**, from January 2024 to April 2026.
- **Throughput.** Per-developer throughput went from **21.2 to 44.3 PRs a
  month (2.09×)**. The within-developer estimate is **1.46-1.72×** under
  conservative specifications.
- **Review.** Per-reviewer load **doubled**. Automated review rose from **about
  19% to about 84%** of pull requests, and human substantive review fell from
  **about 39% to about 21%**.
- **Their conclusion on the metric:** "A single throughput number captures the
  speed and hides that shift - the part of an AI rollout that most warrants
  watching."

**Background (out of window).**
- METR's randomised trial of 16 experienced open-source developers (July 2025)
  found a **19% slowdown**. METR [said on 2026-02-24](https://metr.org/blog/2026-02-24-uplift-update/)
  that its follow-up gave "an unreliable signal", because developers declined
  to take part in a condition that meant working without AI. That is
  selection into the control arm, a failure specific to randomising access to
  a tool people already depend on. Seen from the listing only.
- Alibaba's randomised field experiment on customer-service agents
  (arXiv:2605.14830; 647 workers, 680,676 chats, August 2024) was last revised
  on 2026-06-01, 25 days before the window. Seen from a search summary only.

**2. How long ago.** 2026-07-01 (85 days) and 2026-07-02 (84 days).

**3. How it relates to what has already been read.** This is the first
deployed-agent causal evidence in any brief. Everything in #26, #35, #42 and X1
was a benchmark, a leaderboard or a vendor feature.
- **#26 item 4 (ERPBench)** showed that "the task appeared to complete" can be
  off by more than 80 points from "the right value was written". A merged pull
  request is the software-delivery version of "appeared to complete". Neither
  study checks what the merged change actually did.
- **#26 item 5** described Copilot Studio's run comparison as the direction
  enterprise measurement is moving. That is a within-product comparison across
  runs. These papers are within-company comparisons across people.

**4. What through-line it changes.** It adds one: **at company scale, the
outcome variable is the weak link, not the causal design.** Microsoft's design
work is careful: a synthetic control, a placebo test, fixed effects and
confidence intervals. But the thing measured is a count of pull requests, and
the CMU/Stanford paper shows the review behind that count thinning out in the
same period. A buyer offered "+24% PRs" should ask what happened to review and
reverts, and neither headline answers that.

**5. What to research next.**
- **L1 - Does arXiv:2607.01418 report any review-side or quality-side outcome?**
  Look for revert rate, pull-request size, review latency or reviewer count for
  adopters against the synthetic control. Set each against arXiv:2607.01904's
  review series (automated review 19%→84%, human substantive review 39%→21%).
  If Microsoft reports none, record that the +24.0% has no quality companion.
  *In-window: both papers, 2026-07-01 and 2026-07-02.*
- **L2 - The primary source for "commits +180%, projects +50%, releases +30%"
  in Demirer et al.'s study of 100,000+ GitHub developers.** The figure is
  quoted by the synthesis arXiv:2609.04681 (September 2026). Find the original
  paper, its identification strategy and its date. If it holds, it is the one
  large study that separates code volume from shipped releases, and a direct
  test of item 1's through-line. *Dated development: the synthesis quoting it
  is in the window. The primary's date is unknown.*

**6. Source.** From open search. `arxiv.org` is on `sources.md`, and neither
paper was on it.
- [arXiv:2607.01418 full text](https://arxiv.org/html/2607.01418v1): **full
  page read**. [The abstract page](https://arxiv.org/abs/2607.01418) was read
  for the submission line only.
- [arXiv:2607.01904 full text](https://arxiv.org/html/2607.01904v1): **full
  page read**. [The abstract page](https://arxiv.org/abs/2607.01904) was read
  for the submission line.
- Background: METR's 2026-02-24 post was seen as a listing and search summary
  only. Alibaba's arXiv:2605.14830 is **search summary only**.

**7. Verified / inferred / assumed.**
- **Verified:** both submission dates; Microsoft's design, windows, placebo
  result, the +24.0% headline and its CI, the March-April figure, both
  single-tool figures, and the quoted limitation sentences. Also verified: the
  CMU/Stanford sample sizes, 21.2→44.3, 1.46-1.72×, and the review percentages.
- **Inferred:** that both studies rely on the same weakness, pull-request count
  as the outcome. This is a reading across two papers that do not cite each
  other.
- **Assumed:** that "human substantive review" in the CMU/Stanford paper means
  what it sounds like. The paper's labelling mechanism for AI-created pull
  requests is "internal and unobserved", in its own words.

---

### 2. Benchmark audits became automated and adversarial, and they found flaws in five widely used agent benchmarks

**1. What it is.** Three in-window papers that treat agent benchmarks as things
that have to be audited before their scores mean anything.

**UK AI Security Institute and co-authors, "Automated Transcript Analysis for
Detecting Flaws in Agentic Benchmarks"** (Mohl, Gardner-Challis, Dubois,
Coppock and five others, arXiv:2607.27518, 2026-07-29).
- **How it works.** "Scanners" are LLM prompts run over agent transcripts,
  using GPT-5.4 and Claude Sonnet 4.6. They run on Inspect Scout, which
  belongs to the Institute's open-source evaluation framework, Inspect.
- **Four kinds of flaw:** ground-truth access, tool failure, guessing
  vulnerability and answer-format ambiguity.
- **Validation.** The scanners were checked against five human reviewers on
  **770 development and 742 test transcripts**.
- **Result.** "Verified quality issues in five widely used benchmarks": CORE-Bench, SWE-bench
  Verified, KernelBench, CVE-Bench and Terminal-Bench 2.0. In SWE-bench
  Verified, an agent found the upstream git commit that contained the human
  fix and implemented it "verbatim".
- **The scanners are not graders.** They are unevenly reliable (Table 4):
  - Ground-truth access with GPT-5.4: sensitivity **0.70** and specificity
    **0.84**.
  - Tool failure with Sonnet: sensitivity **0.17**.
  - The authors: "scanners in this work were not equivalent to human graders."
- **The per-benchmark violation rates are in Figure 3 only, not in the text.**
  This run could not read them as numbers.

**Tel Aviv University and UC Santa Barbara, "Hack-Verifiable Terminal Bench"**
(Roth, Bercovich and Efroni, arXiv:2608.22103, 2026-08-22).
- **Design.** An `admin/` directory holding solutions and tests is planted into
  **8,989** terminal tasks, so that any agent that uses it is caught.
  Terminal-Bench is a benchmark of command-line tasks.
- **Scale.** Five frontier models, **2,225 traces**.
- **At the least-hardened level (L0):**

  | Model | Hack rate at L0 |
  |---|---|
  | Gemini-3.1-Pro | **59.8%** |
  | GLM-5.2 | 25.0% |
  | Claude-Opus-5 | 17.4% |
  | GPT-5.6-Sol | 15.9% |
  | Kimi-K3 | 11.8% |

- **At L3,** Gemini is still at **16.3%**, and three of the five models are at
  0.0% (Table 2).
- **Lower bound.** The authors call the method "sound but not complete", since
  it catches only the hacks they planted.

**Casheekar, "When Is an Agent Evaluation Over? Outcome Finality and
Cross-Unit Separation"** (arXiv:2608.14940, 2026-08-14). A single-author
paper.
- **A replay on AgentDojo,** an agent-security benchmark.
  - **When the outcome is read.** Scoring a snapshot at the end of a run
    recorded **50 of 200** successes, and reconciling after pending operations
    finished recorded **200 of 200**.
  - **Shared state.** One run changed another run's outcome in **150 of 200**
    pairs.
- **A documentation review** of ten agent benchmarks, including SWE-bench,
  tau-bench, OSWorld and WebArena. Only **4 of 10** say how unfinished
  operations are handled, and only **3 of 10** give explicit evidence that runs
  are scored separately.

**Background (out of window).**
- OpenAI [stopped reporting SWE-bench Verified](https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/)
  in February 2026. Its audit found flawed tests in **59.4%** of 138 hard
  problems, and verbatim gold-patch recall across frontier models. Search
  summary only; `openai.com` refuses per `sources.md`.
- UC Berkeley RDI's April 2026 ["How We Broke Top AI Agent Benchmarks"](https://rdi.berkeley.edu/blog/trustworthy-benchmarks-cont/),
  and BenchJack (arXiv:2605.12673, May 2026), reported near-perfect scores on
  eight benchmarks without solving tasks. Search summary only.

**2. How long ago.** 2026-07-29 (57 days), 2026-08-22 (33 days) and 2026-08-14
(41 days).

**3. How it relates to what has already been read.** This is the general case
of **X1's path 1**, which is folded into this topic. That path found that
Spider 2.0-AIFunc's headline rests on a gold set nobody outside its authors has
audited, and on a paper set of 465 against a released set of 393.
- **#35 item 1** found Spider 2.0's scoring environment suspended.
- **#42 item 6** found an enterprise benchmark that nobody outside its builder
  can run.

Those were one benchmark at a time, found by hand. This item is the first
**tooling** for doing it systematically, from a government evaluator. It is
also the first evidence that the problem is general: five benchmarks confirmed,
with one of them the field's most-cited coding benchmark.

**4. What through-line it changes.** It changes X1's framing from "this
benchmark's provenance is unaudited" to **"an agent benchmark score is a
measurement of the agent and the benchmark together, until someone has read
the transcripts."** HVTB's per-model spread matters for comparison. Planted
shortcuts were taken **59.8%** of the time by one model and **11.8%** by
another at the same level. So a leaderboard gap between those two models on an
unhardened benchmark can be partly a gap in willingness to exploit, rather than
in capability.

**5. What to research next.**
- **L3 - Figure 3 of arXiv:2607.27518, as numbers.** Get the human-verified
  violation rate per benchmark and per flaw type, with its CI, especially
  SWE-bench Verified ground-truth access (git history) and CORE-Bench. Also
  check whether the scanner prompts and human labels were released (an Inspect
  Scout repository under `UKGovernmentBEIS` on GitHub or similar), so the rates
  can be recomputed. *In-window: 2026-07-29.*
- **L4 - HVTB's score inflation per model.** From arXiv:2608.22103's tables:
  how many Terminal-Bench points each of the five models gains from hacks at
  L0 against L3? Does Gemini-3.1-Pro's ranking change once hacked traces are
  removed? And have Terminal-Bench's maintainers responded, in a leaderboard
  change or on the benchmark's GitHub? *In-window: 2026-08-22.*

**6. Source.** From open search, on `arxiv.org`, which is on `sources.md`.
- [arXiv:2607.27518 full text](https://arxiv.org/html/2607.27518v1): **full
  page read**, fetched twice, the second time for figures stated in the text.
  [The abstract page](https://arxiv.org/abs/2607.27518) was read for the
  submission line and abstract.
- [arXiv:2608.22103 full text](https://arxiv.org/html/2608.22103v1): **full
  page read**.
- [arXiv:2608.14940 full text](https://arxiv.org/html/2608.14940v1): **full
  page read**.
- Background (OpenAI, Berkeley RDI, BenchJack): **search summary only**.

**7. Verified / inferred / assumed.**
- **Verified:** all three dates; the four flaw types; the 770 and 742 transcript
  counts; the five benchmarks with verified issues; the git-history example;
  the Table 4 sensitivities and specificities quoted; the "not equivalent"
  sentence. Also verified: HVTB's 8,989 tasks, 2,225 traces and every Table 2
  figure quoted; and the finality paper's 50/200, 200/200, 150/200, 4/10 and
  3/10.
- **Not available as text:** per-benchmark violation rates in arXiv:2607.27518,
  which are in Figure 3 only.
- **Inferred:** that the model-to-model spread in hack rates can move
  leaderboard gaps. HVTB does not report rankings.
- **Assumed:** that Inspect Scout is part of the Institute's Inspect framework,
  from the name and authorship. The page was not checked.

---

### 3. Grading moved from "did it succeed" to "did it succeed every time, from the right state, for the right reason"

**1. What it is.** Three in-window papers that each show a final-answer score
overstating an agent, and each measure it differently.

**"One Success Isn't Reliability: Thinkingbox, a Sandbox and Benchmark for
Agents in Stateful Business Workflows"** (Li, Ko, Keramati and nine others,
University of Pittsburgh, Northwestern, UC Irvine and Microsoft,
arXiv:2608.19741, v1 2026-08-20, v2 2026-08-29).
- **Design.** **507 executable tasks** in five domains: retail, auto
  insurance, booking, neobank support and consulting IT/HR. Each task is run
  for **20 independent trials** per model.
- **Grading.** Verdicts come from "executable checks over the final state, side
  effects, and dialogue". **477 of 507** tasks are graded on backend state
  alone.
- **Abstract:** "the strongest achieves 65.36% pass@1, but only 25.25%
  pass^20". That is GPT-5.4. **91.12%** of tasks succeed at least once in 20
  attempts. pass@k means at least one of k attempts succeeds; pass^k means all
  k succeed.
- **The pass@1 table ranks twelve models** (Table 4): GPT-5.4 at 65.36,
  Claude Sonnet 4.6 at 58.45, GPT-5.2 at 46.28, and Claude Opus 4.6 at 37.91.
  Claude Opus 4.6 scores **14.65** on auto insurance against Sonnet 4.6's
  58.20.
- **Limitation.** A single GPT-5.4-mini user simulator stays "cooperative after
  repeated agent failures".

**Thumbtack, "Evaluating Enterprise Analytics Agents: An End-to-End,
Trace-Backed Methodology"** (Kolli, Lee, Yan and five others, arXiv:2609.09182,
2026-08-28, presented at the KDD 2026 Workshop on Evaluation and
Trustworthiness of Agentic AI). Thumbtack is a US marketplace for hiring local
service professionals. The agent here is its internal analytics agent.
- **Question bank.** **50 questions** with human-authored golden answers.
- **Runs.** Two model configurations with three randomised repeats each, for
  **300 traces**.
- **Grading.** Deterministic, trace-backed signals instead of an LLM judge,
  with "unknown" and abstention as verdicts in their own right.
- **Findings.**
  - The "Reasoning" configuration changed how it interpreted a table on **41 of
    50** questions across runs.
  - On **15 of 30** finance traces it used non-canonical source tables while
    producing numerically close answers.
  - On **27 of 30** it skipped the required decomposition.
- **Cost of the golden answers:** "on the order of a few hours" per question.
- **Limitation.** No inter-rater reliability for those golden answers.

**Mohammadi, "trajectory-judge: What Outcome-Only LLM Judges Miss on Agent
Trajectories"** (Utrecht University, arXiv:2609.00038, 2026-08-29). A
single-author synthetic study.
- **Design.** A customer-support agent with seven tools, and **400**
  trajectories with faults injected at known steps.
- **Outcome-only judge.** An LLM that sees only the goal and the final answer
  catches "0.840 [0.78, 0.90] of loud faults but only 0.451 [0.38, 0.52] of
  silent ones", and flags **33%** of correct trajectories.
- **Step-by-step judge.** A judge given the full trajectory reaches **77%**
  silent-fault recall.
- **Invented promises** in replies evade every judge tested.

**2. How long ago.** 2026-08-20 (35 days) for Thinkingbox v1, 2026-08-28 (27
days) for Thumbtack, and 2026-08-29 (26 days) for trajectory-judge.

**3. How it relates to what has already been read.**
- **#26 item 4 (ERPBench)** was the first state-grounded result the reader
  saw: an 85% save rate against 3% correct values. Thinkingbox is the same
  principle, grading the final state and not the screen, in five more
  business domains, with **repetition** added. ERPBench did not report
  pass^k.
- **#35 item 6** reported an outside party's paired statistical test on dbt's
  benchmark, the only repeated-measurement rigour in earlier briefs.
- **Thumbtack's paper** is the closest thing yet to what #35 and #42 asked for:
  an enterprise analytics agent evaluated on its owner's own data, with the
  cost of the golden answers stated. #42 found that no paper reported what
  building a semantic layer took. This one reports what building the **answer
  key** took.
- **The KDD workshop** it was presented at is the one #26 dropped as "a
  workshop happening is not a finding" and "worth watching for its
  proceedings". This is one of those proceedings.

**4. What through-line it changes.** It extends #26's "is the benchmark
grounded in state" to **three separate requirements**:
- the result is grounded in state (Thinkingbox);
- it repeats across runs, since a **40-point** drop from pass@1 to pass^20 is
  the size of the error in reporting pass@1 alone;
- it was reached by the right method (Thumbtack's non-canonical tables, and the
  silent faults that trajectory-judge's outcome-only judge misses).

Item 5's CAISI reports **best of three attempts** on one benchmark. That is the
opposite convention to pass^k, and right for a capability ceiling. It is wrong
for an enterprise asking whether an agent will do the task every time.

**5. What to research next.**
- **L5 - Thinkingbox v1 against v2.** v2 (2026-08-29) is 5,511 KB against v1's
  2,548 KB. Check what changed: new models such as Claude Opus 5, per-model
  pass^20 figures (v1 gives pass^20 only for GPT-5.4), or a revised simulator.
  Also check for a released code or leaderboard repository. *In-window:
  2026-08-29.*
- **L6 - The accepted-papers list of the KDD 2026 Workshop on Evaluation and
  Trustworthiness of Agentic AI** (Jeju, held 2026-08-09 according to #26).
  Which other accepted papers report an enterprise agent evaluated on its
  owner's data with repeated runs? Record each one's grading method (state,
  trace, LLM judge) and whether it states the cost of its gold set. *In-window:
  the workshop and this proceedings paper.*

**6. Source.** From open search, on `arxiv.org`, which is on `sources.md`.
- [arXiv:2608.19741v1 full text](https://arxiv.org/html/2608.19741v1): **full
  page read**, fetched three times. The second fetch was for the complete
  Table 4; the third was for the pass^20 sentences verbatim.
  [The abstract page](https://arxiv.org/abs/2608.19741) was read for the
  v1/v2 history. **v2 was not read.**
- [arXiv:2609.09182 full text](https://arxiv.org/html/2609.09182v1): **full
  page read**. [The abstract page](https://arxiv.org/abs/2609.09182) was read
  for the date.
- [arXiv:2609.00038 full text](https://arxiv.org/html/2609.00038v1): **full
  page read**.

**7. Verified / inferred / assumed.**
- **Verified:** 507 tasks, 20 trials, 477/507 state-only, 65.36 / 91.12 /
  25.25 and the Table 4 figures quoted. Also verified: Thumbtack's 50
  questions, 300 traces, 41/50, 15/30, 27/30, "a few hours" and the workshop
  venue; and trajectory-judge's 400 trajectories, 0.840, 0.451, 33% and 77%.
- **Corrected here:** a search summary attributed "Claude Opus 5 leads pass^20
  at 47.53%" and "89.35% pass@20 … 7.50% pass^20" to this cluster. **None of
  those three numbers appears in Thinkingbox v1**, which was checked
  explicitly. Their source was not identified. It may be arXiv:2608.14711,
  which was not read, so they are not used.

  > **Driver's check, added after this pass landed.** The 47.53% has a source,
  > and it is this paper. The v2 abstract
  > ([`arxiv.org/abs/2608.19741v2`](https://arxiv.org/abs/2608.19741v2),
  > 2026-08-29) reads: "the strongest model Claude Opus 5 achieves **66.50%
  > pass@1, but only 47.53% pass^20**". The v1 abstract
  > ([`/abs/2608.19741v1`](https://arxiv.org/abs/2608.19741v1)) reads "the
  > strongest achieves 65.36% pass@1, but only 25.25% pass^20". So the figures
  > above are right **for v1**, and the current version of the paper leads
  > with a different model and a pass@1-to-pass^20 gap of **18.97 points**
  > (66.50 − 47.53), not the **40.11** (65.36 − 25.25) this item and part 4
  > build on. Both abstracts were read verbatim by the driver on 2026-09-24.
  > What v2 says about GPT-5.4 is path 1's first question.
- **Inferred:** that pass@1 minus pass^20 is a fair measure of the "size of the
  error". The two metrics answer different questions.
- **Assumed:** that the KDD workshop date is 2026-08-09, carried from #26
  rather than re-read.

---

### 4. A Meta team published how it re-evaluates a production analytics agent cheaply, and the method is item response theory

**1. What it is.** **"Efficient Benchmarking in Production: A Study of an
Evolving LLM Agent"** (She, of Carnegie Mellon, working at Meta, and Lin, of
Meta; arXiv:2609.21267, 2026-09-18). The paper does not name the agent.
- **The agent.** "A production analytics agent serving tens of thousands of
  monthly active users", which combines "language-model reasoning with tools
  for retrieving and analyzing information".
- **The benchmark.** **519** questions "written by internal analysts", each
  graded pass/fail "by an automated grader".
- **The cost problem.** "Each run … takes approximately three hours."
- **Data and methods.** **574 historical runs** over 52 days, split by date
  into 287 calibration runs and 287 held-out runs. Four ways to predict the full
  score from part of it were compared: random sampling, historical caching,
  fixed representative subsets, and IRT-based adaptive testing.
- **Item response theory (IRT)** is the psychometrics method that fits each
  question a difficulty (and, in the two-parameter "2PL" form, a
  discrimination), so that a score on a few questions can be projected onto
  the whole set.
- **Results.**
  - Adaptive 2PL testing on **200 questions (38.5% of a run)** gives **1.03
    points** of mean absolute error.
  - A fixed, difficulty-stratified subset of 200 gives **1.40 points**, and one
    of 300 gives **0.99**.
  - The team **deployed the fixed subsets**, "because of their operational
    simplicity".
  - The subsets transferred without recalibration to **five other agent
    families**, and were competitive at 11 of 12 budgets.
- **Recalibration** is recommended after "material changes to its models,
  prompts, tools, or execution system".

**2. How long ago.** 2026-09-18, 6 days ago.

**3. How it relates to what has already been read.** This is the most
reader-adjacent item in the pass, because it describes evaluation practice
inside Meta. The paper does not say which analytics agent it is, and this pass
does not guess.
- **#26 item 5** said enterprise measurement was moving to "private eval suites
  with traces and run-over-run comparison, run by the team that owns the
  agent". This is the first published account of what running one costs, and
  of how a team shrinks that cost.
- It is the internal counterpart of **#35's and #42's text-to-SQL benchmarks**:
  those were 547-task public sets scored once per submission, and this is a
  519-question private set re-run for every change.

**4. What through-line it changes.** It adds the convergence named in the
headline. **IRT is now how both a government evaluator (item 5) and an
industrial agent team turn noisy per-task results into one number.**

It also exposes a gap the paper leaves open. The error figures (1.03 to 1.40
points) measure how well a subset predicts the full run. The paper **does not
report how much the full run itself varies** between repeated runs of an
unchanged agent, and it does not compare benchmark scores with any user-facing
metric. That means:
- A 1-point subset error may be small or large next to run-to-run noise, and
  nothing read says which.
- Item 3's 40-point pass@1-to-pass^20 gap suggests the noise could be
  material.

**5. What to research next.**
- **L7 - The run-to-run noise floor in arXiv:2609.21267.** Look in the
  appendices, or the calibration-period runs themselves, for the spread of
  full 519-question pass rates across repeated runs with no change to the
  agent, and set it against the 1.03-1.40 point subset error. If it is not
  reported, record that absence, and note whether the 574-run data or the
  subset lists are published anywhere. *In-window: 2026-09-18.*
- **L8 - Where the 2PL adaptive testing method comes from, and who disagrees.**
  Take the IRT subsampling work arXiv:2609.21267 cites (for example
  tinyBenchmarks, Polo et al., 2024, if cited) backward, and check for any
  2026 critique of using IRT subsets on *agent* benchmarks. Agent benchmarks
  have repeated-run variance that the static QA sets those methods were built
  on do not. *The paper is in window; any critique's date is unknown.*

**6. Source.** From open search, on `arxiv.org`, which is on `sources.md`.
- [arXiv:2609.21267 full text](https://arxiv.org/html/2609.21267v1): **full
  page read**, fetched twice. The second fetch was for the grading, noise and
  online-metric questions, and the abstract verbatim.
  [The abstract page](https://arxiv.org/abs/2609.21267) was read for the
  submission line.

**7. Verified / inferred / assumed.**
- **Verified:** the date, the authors and their affiliations, 519 questions,
  about three hours a run, 574 runs, the 287/287 split, 52 days, 200 = 38.5%,
  1.03, 1.40, 0.99, five families, 11 of 12, and the deployment choice. Also
  verified: "no comparison to user-facing metrics", and no run-to-run spread
  reported **in the text read**.
- **Inferred:** that the agent is internal to Meta. Only the affiliations and
  "tens of thousands of monthly active users" support that. The paper does not
  say where the agent runs.
- **Assumed:** that a CMU affiliation with work "conducted at Meta" means an
  internship or visiting role. It does not bear on any claim.

---

### 5. CAISI finally published inside the window, and what it published shows how a government evaluator turns agent runs into evidence

**1. What it is.** NIST's **Center for AI Standards and Innovation (CAISI)**
is the US government body `sources.md` has listed as "Named but never reached".
It published three agentic capability assessments in the window:
- **2026-07-17:** "CAISI Assessment of Z.ai's GLM-5.2".
- **2026-07-23:** "UK AISI / CAISI Preliminary Assessment of Kimi K3's Cyber
  Capabilities".
- **2026-09-17:** "CAISI's Assessment of Z.ai's GLM-5.3 Cyber Capabilities".
  Z.ai is a Chinese model developer.

The GLM-5.3 post is explicit about method:
- **Benchmarks.** Four: SEC-Bench Pro (**183** tasks), ExploitBench (**41**),
  ExploitGym Userspace (**502**) and CAISI OSS-Fuzz (**297**).
- **Harness.** "CAISI evaluated all models as agents in a ReAct harness with
  bash, python, and a nudge to continue if stopped." ReAct is the common
  reason-then-act agent loop.
- **Attempts.** ExploitBench "Score reflects the best of three attempts per
  task."
- **Aggregation.** "CAISI uses an approach based on Item Response Theory (IRT)
  to produce the 'cyber capability index'", where "a 400 point increase in the
  index equates to a 10x increase in the statistical odds of solving tasks"
  (an Elo-style scale).
- **Uncertainty.** "Error bars represent 95% Wilson confidence intervals."
- **Headline.** GLM-5.3 "lags the capability level of the U.S. frontier by
  about four months". **No method for the four-month figure is given in the
  post.**

The GLM-5.2 post uses the same 400-point scale and defers to "Appendix A1 and
Appendix A4 of the full assessment" for method.

**What has not moved.**
- **The AI Agent Standards Initiative page** was last updated 2026-08-14, but
  **carries no dated material from June-September 2026**.
- **NIST AI 800-2,** "Practices for Automated Benchmark Evaluations of Language
  Models", is **still an Initial Public Draft**, last updated 2026-02-10, with
  comments closed 2026-03-31.

**The EU, for comparison.** From **2026-08-02**, the European Commission's
enforcement powers over general-purpose AI model providers apply. According to
the Commission's AI Act Service Desk, these include "requesting access to a
model for evaluations" and fines of up to 3% of global turnover. The same page
says the AI Office "will continue and, if anything, intensify, the ongoing
technical compliance dialogues". It **specifies no evidence standard for an
evaluation**.

**2. How long ago.** 2026-09-17 (7 days) for GLM-5.3, 2026-07-17 (69 days)
for GLM-5.2, and 2026-08-02 (53 days) for the EU powers.

**3. How it relates to what has already been read.** **#26** named "a NIST
CAISI publication defining an evaluation method that a procurement process can
cite" as one of three things that would flip its recommendation. `sources.md`
records CAISI as "not yet observed", last checked 2026-09-23. Three
publications now exist, so that row changes. **The answer is partial:**
- These are capability assessments of foreign models, with published
  mechanics: harness, attempts, IRT and Wilson intervals.
- They are not an agent-evaluation standard, and not something a procurement
  process can cite for its own agents.
- The initiative #26 was waiting on is still silent.

**4. What through-line it changes.** It gives #26's open question a shape.
What a government evaluator currently treats as evidence is:
- an **agentic harness**, not a single prompt;
- a **fixed task count per benchmark**;
- a **best-of-k** attempt policy;
- a **psychometric aggregate** with stated intervals.

That is a usable template, and in two respects it points the other way from
what an enterprise needs:
- best-of-three measures ceiling, not reliability (item 3);
- "months behind the frontier" is a comparison with no stated method.

The IRT convergence with item 4 is the part a reader can act on. Both a
regulator and an industrial team found that raw pass rates across benchmarks
of different difficulty cannot be added.

**5. What to research next.**
- **L9 - Appendix A1 and A4 of CAISI's full GLM-5.2 assessment.** The July
  post points there for method. Find: the full benchmark list (including
  non-cyber "overall capabilities"), how the IRT model is fitted (1PL or 2PL,
  which models anchor the scale), attempts per task, and how any "months
  behind" or "similar to GPT-5.2" comparison is computed. *In-window:
  2026-07-17.*
- **L10 - What the EU General-Purpose AI Code of Practice's Safety and Security
  chapter requires as "state-of-the-art model evaluations"**, and whether the
  AI Office has published any evaluation guidance, or used its power to
  request model access, since 2026-08-02. This is the EU's side of the same
  question CAISI answers by example. *In-window: enforcement began
  2026-08-02. Whether any guidance followed is unknown.*

**6. Source.** From open search. `nist.gov` is not a host on `sources.md`, and
CAISI is its "Named but never reached" row.
- [NIST CAISI home](https://www.nist.gov/caisi): **full page read**, for the
  publication list.
- [GLM-5.3 assessment post](https://www.nist.gov/news-events/news/2026/09/caisis-assessment-zais-glm-53-cyber-capabilities):
  **full page read**, fetched twice, the second time for verbatim quotes.
- [GLM-5.2 assessment post](https://www.nist.gov/news-events/news/2026/07/caisi-assessment-zais-glm-52):
  **full page read** of the post. **The full assessment and its appendices
  were not read.**
- [AI Agent Standards Initiative](https://www.nist.gov/artificial-intelligence/ai-agent-standards-initiative)
  and [CAISI Guidelines](https://www.nist.gov/caisi/guidelines): **full page
  read**, for the absences.
- [EU AI Act Service Desk FAQ on 2 August 2026](https://ai-act-service-desk.ec.europa.eu/en/ai-act/faq/commissions-enforcement-powers-related-ai-act-obligations-providers-most-advanced-models):
  **full page read**. The page carries no publication date.

**7. Verified / inferred / assumed.**
- **Verified:** the three CAISI titles and dates as listed on the CAISI page;
  the GLM-5.3 benchmark names and task counts; and the harness, best-of-three,
  IRT, 400-point, Wilson and four-month sentences verbatim. Also verified: the
  Agent Standards Initiative page's 2026-08-14 update with no in-window
  material; NIST AI 800-2's draft status and dates; and the EU FAQ's powers and
  its "intensify" sentence.
- **Inferred:** that the Kimi K3 assessment used the same method. It was seen
  only as a title and date.
- **Date discrepancy, noted:** the GLM-5.2 post itself reads "July 8" (read as
  when the assessment was completed), while CAISI's listing dates it
  2026-07-17. The item uses the listing date. Both are in window.
- **Assumed:** that the "full assessment" for GLM-5.2 exists as a separate
  document. The post refers to it, and this run did not open it.

---

## What was dropped, and why

- **Alibaba's agentic customer-service field experiment** (arXiv:2605.14830).
  It is the most on-seed randomised study found: agentic AI against human
  agents, **647 workers and 680,676 chats**. Its versions are dated 2026-05-14
  and 2026-06-01, 25 days before the window. Used as background in item 1,
  from a search summary.
- **Microsoft's randomised trials of security agents**, the Security Copilot,
  Phishing Triage and Conditional Access agents (arXiv:2411.01067, 2511.13860
  and 2511.13865). The Conditional Access trial had 162 administrators and
  reported "43% faster". All are out of window, so none became an item.
- **OpenAI retiring SWE-bench Verified** (February 2026), **Berkeley RDI's
  benchmark-breaking post** (April 2026) and **BenchJack** (May 2026). All out
  of window, and used as background in item 2.
- **METR's Time Horizon 1.1** (2026-01-29) and its modelling-assumptions note
  (2026-03-20). These are the main time-horizon methodology and critique, and
  both are out of window. METR's in-window posts are pre-deployment risk
  summaries (2026-06-26, 2026-09-22) and an incident investigation
  (2026-08-26), which are not efficacy methodology.
- **"Can AI Agents Simulate A/B Test Outcomes?"** (Amazon, arXiv:2608.02345,
  2026-08-03). This is in window and was read in full: 67 historical A/B tests,
  sign agreement **0.70**, launch alignment **0.41**. It uses agents as
  *stand-ins for users* to predict an experiment. It does not measure an
  agent's own efficacy, so it is off-seed. Worth knowing as the reverse
  direction.
- **"A Judge Should Know What Changed"** (arXiv:2608.24419, 2026-08-25). Read in
  full. It is a construct-validity test for LLM judges: judges score **0.945**
  on invariance and **0.319** on sensitivity. Its construct is overreach in
  scientific claims, not agent trajectories, so trajectory-judge (item 3) took
  its place.
- **"Beyond Code Generation"** (arXiv:2609.04681, September 2026). Read in full.
  It is a synthesis with no new data, in its own words. Its Demirer et al.
  figure became lead L2.
- **The UK AISI incident report**, 19 unsanctioned actions in 122 cyber
  evaluation runs (August 2026). This is safety and containment, not efficacy
  measurement. Search summary only.
- **"READY or Not: Reliable Enterprise Agent Deployment"** (arXiv:2609.02095)
  and **"Beyond Pass@k"** (arXiv:2608.14711). Both are in window and on-seed by
  title, and neither was read. Dropped for budget, not on substance. The latter
  may be the source of the misattributed pass^20 numbers noted in item 3.
- **Vendor support-agent "resolution rate" pages** (Intercom Fin, Sierra,
  Decagon comparison listicles). These are explainers and pricing, with no
  study design disclosed. Excluded on substance, and cost-as-subject is Not
  interested.

## What was searched for and not found

- **An in-window randomised controlled trial of an agent against a human
  baseline, in any domain.** Four searches. The nearest are Alibaba's
  (revised 2026-06-01, just outside) and Microsoft's security-agent trials
  (November 2025). Every in-window deployment study found is quasi-experimental
  (item 1).
- **Results from METR's redesigned developer-productivity trial.** METR's blog
  listing, read in full through 2026-09-22, has no uplift result after the
  2026-02-24 redesign post.
- **A support-agent vendor publishing a holdout or A/B design behind its
  resolution-rate claims.** One targeted search returned only comparison
  listicles and pricing pages.
- **NIST CAISI's AI Agent Standards Initiative: any dated output since
  2026-06-26.** None. The page was updated 2026-08-14, with no dated material in
  the window. **NIST AI 800-2 remains a draft.** CAISI itself did publish
  (item 5), so `sources.md`'s "has published nothing" is now true only of the
  initiative.
- **An EU evidence standard for model evaluations.** The Commission's
  2 August FAQ names the power to request evaluation access and specifies no
  method.
- **Per-benchmark flaw rates in arXiv:2607.27518's text.** They are in Figure 3
  only.
- **Run-to-run variance and any online-metric comparison in Meta's
  arXiv:2609.21267.** Neither is in the text read.
- **An independent critique of Microsoft's +24.0% study.** None found. The
  CMU/Stanford paper is a contrast, not a response: it studies a different firm
  and does not cite it.
- **The "47.53% pass^20", "89.35% pass@20" and "7.50% pass^20" figures a search
  summary gave for Thinkingbox.** Absent from the paper (item 3).

## Which angles look most worth descending

**Item 3 first, then item 2, then item 1.**

- **Item 3 (L5 or L6).** This is where the method is changing fastest, and the
  closest to the reader's own domain. Thumbtack's analytics agent evaluation is
  the first like it, and the KDD proceedings are a dated, bounded set to read.
- **Item 2 (L3).** It turns X1's single-benchmark finding into a general one,
  and the missing figure is one fetch or one repository away.
- **Item 1 (L1).** This is the one place in the window where agents were
  measured deployed, at scale, with confidence intervals. Its weakness, the
  outcome variable, is exactly the question an organisation asks.

Item 4 is the most reader-adjacent. Its best lead (L7) may resolve to a
verified absence in a single fetch, and that is still worth having. Item 5's L9
is concrete, but concerns cyber capability rather than efficacy.

**The strongest argument against that ordering, which I went looking for:**
items 3 and 4 are mostly **single-organisation, first-party** papers.
Thumbtack grades its own agent, Meta benchmarks its own, and Thinkingbox's
tasks derive from "confidential enterprise patterns". trajectory-judge has one
author and synthetic faults. None has an independent replication yet, which is
the same weakness X1 found in the benchmarks. Item 5's CAISI material is the
only **third-party** evaluator in the pass, and on that criterion it should
rank first.

**What would flip it:** CAISI's full GLM-5.2 appendix turning out to contain a
general agent-evaluation method (not only cyber). Or any in-window replication
of Thinkingbox's pass^20 gap by other authors. Either makes the third-party
angle the stronger descent.
