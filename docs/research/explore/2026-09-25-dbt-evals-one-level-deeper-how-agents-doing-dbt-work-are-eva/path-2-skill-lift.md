# Path 2 - When a skill's measured lift can be trusted

Follows breadth lead L3a: when a with-and-without skill delta can be trusted.

## Level 1 - Skill lift as an experiment: controls, repeats, judges, task coverage

**Background:** The open [Agent Skills evaluating-skills guide](https://agentskills.io/skill-creation/evaluating-skills) (March 2026) runs each prompt `with_skill` and `without_skill`, or against an `old_skill` snapshot. It warns that "stddev is only meaningful with multiple runs per eval". Anthropic's skill-creator has had no change since 2026-04-20. SkillsBench (last release 2026-06-16), SkillAudit (2026-06-21) and Tessl's "[A Framework for Evaluating Agentic Skills at Scale](https://arxiv.org/abs/2606.17819)" (2026-06-16) all fall just before the window.

### Evaluating Skills, Not Just Agents: Agentic Continuous Evaluation of Skills (ACES)
[link](https://arxiv.org/html/2608.20614) · 2026-08-20 · research paper (NVIDIA) · read in full · search

1. **What it is about:** This is the method behind NVIDIA's SkillEvaluator. It runs 947 paired cases across 58 production skills and 4 agent harnesses, and reports composite lift of 0.21 with a 95% interval of [0.197, 0.230]. It also bootstraps over whole skills and gets [0.190, 0.235].
2. **Why you're seeing it:** `efficacy-methodology`.
3. **Seen before?** The breadth pass cited it only for ρ = 0.14. This is the full design.
4. **Relates to:** The control is not "no skills". Only the target skill is withheld, and helper and decoy skills stay loaded, much like an active control arm.
5. **Takeaways for you:** Only 88 of 201 cells were run twice. The paper says to read cases as clustered by skill, harness and trial, not as 947 independent units. Agreement between live judges is "unmeasured". Lift can also shrink as models improve, because the baseline arm needs less help.

### Agent Skills Can Be Harmful: An Empirical Study of Skill-Induced Failures in LLM Agents
[link](https://arxiv.org/html/2608.11888v1) · 2026-08-12 · research paper (Microsoft Research, HUST, UIUC) · read in full · search

1. **What it is about:** It reruns SkillsBench and SWE-Skills-Bench tasks with each skill, without it, and with a *semantically matched* alternative skill. It finds 307 skill-induced failures: 125 tasks that broke and 182 where the agent became at least 2× slower or costlier.
2. **Why you're seeing it:** `efficacy-methodology`. It is the critic's view of an average lift.
3. **Seen before?** No. It builds on the two benchmarks the breadth pass named.
4. **Relates to:** ACES's decoy arm. Here the second control is another plausible skill, not an empty one.
5. **Takeaways for you:** "A failed with-skill run alone cannot distinguish skill-induced harm from base-agent limitations." Most harm came from relevant skills that got a required field wrong or left it out. The most common slowdown was "excessive verification". An average lift can hide both.

### skill-eval-harness: paired variants with a significance gate
[link](https://github.com/adewale/skill-eval-harness) · v0.5.0 2026-07-08 (first native Claude/Codex release), commits through 2026-08-01 · open-source repository (independent developer) · read in full (README, CHANGELOG) · search

1. **What it is about:** A command-line harness that runs the same case, model and repetition with and without a skill. It checks that the two arms really match before it reports any lift.
2. **Why you're seeing it:** `efficacy-methodology`. It is a practitioner building the statistics the guide leaves out.
3. **Seen before?** No. It writes skill-creator's `benchmark.json` format.
4. **Relates to:** dbt's skill-eval, which has with and without arms but no statistics. It also relates to [Tessl's finding](https://tessl.io/blog/your-benchmarks-are-lying-to-you-and-your-judge-is-to-blame/) (**Background**, May 2026) that one score "swung 47 percentage points" depending on which judge graded it.
5. **Takeaways for you:** It uses a sign-flip test, which is a paired permutation test. Fewer than 6 matched pairs can never reach p ≤ 0.05, so it labels them `INDETERMINATE`. It also splits cases into tune and holdout sets, and checks whether the answer leaked into the prompt.

### Are Production Cloud Skills Adequately Tested?
[link](https://arxiv.org/html/2607.22015) · v1 2026-07-24 (v3 2026-08-12) · research paper (Alibaba Cloud) · read in full · search

1. **What it is about:** It checks what a skill's test prompts actually exercise. A skill's instructions are broken into "operational test obligations", and the suite is scored on how many of them at least one test covers.
2. **Why you're seeing it:** `efficacy-methodology`. It is about how tasks are selected.
3. **Seen before?** No. Google's weekly re-runs in the breadth pass assume the prompt suite is already adequate.
4. **Relates to:** ACES's four prompt types: explicit, implicit, contextual and negative control.
5. **Takeaways for you:** At Alibaba, 36% of skills fell below the mandatory 80% coverage gate. Coverage is checked before any with-and-without run. A lift measured on a narrow suite describes that suite's population, not the skill.

**Leads:**
- **L1-a** - Choosing the control arm and the unit of analysis in skill-lift experiments. Read ACES sections 4-7 and Appendix C (decoy skills, cluster bootstraps, partial repeats), "Agent Skills Can Be Harmful"'s cross-skill reference runs and its SkillTriage attribution tool, skill-eval-harness's pairing identity and `old_skill`/ablation arms, the public paired trajectories in `benchflow-ai/skillsbench-leaderboard`, and `dbt-agent-skills` PR #159 with its `skill-sets.yaml`. Read for what each counts as "without the skill" and how many repeats each trusts.
- **L1-b** - Where skill-eval test cases come from and what they miss. Read Alibaba's SkillAdeqBench and obligation extraction, ACES's `EVAL.md` and four-bucket generator, the Tessl framework paper 2606.17819 on criteria leakage in generated tasks (**Background**), SkillAudit's capability-aligned task generation (**Background**), SWE-Skills-Bench's requirement documents, and the `scenario.md` files in `dbt-agent-skills/evals`. Read for how the prompt set is drawn and who checks its coverage.

**So what:** A skill lift is an A/B test in which the skill is the treatment, and your experimentation questions carry over directly. They are what the control arm is, what the unit is and whether outcomes are clustered, how many repeats there are, whether the metric is valid, and which population the tasks represent. The in-window work answers each question differently, and only ACES reports an interval. dbt's own skill-eval has the paired arms but single runs, an LLM grader and no statistics. That is the "early iteration" stage the Agent Skills guide describes, so treat any dbt skill delta as directional until repeats and a coverage check exist.

**Searched for and not found:** any change to Anthropic's skill-creator since 2026-04-20 (re-confirmed); an in-window follow-up by the 2606.17819 authors (Tessl's judge posts date to May 2026); published `dbt-agent-skills` results with repeated runs; in-window SWE-Skills-Bench activity.

## Level 2a - Control arms, units and repeats in skill-lift experiments

### The Regression Tax: Decomposing Why Skills Help and Hurt LLM Agents
[link](https://arxiv.org/html/2607.22520v1) · 2026-07-24 · research paper (Sentient Labs) · read in full · search

1. **What it is about:** About 5,800 paired runs on two office benchmarks (Treasury-document questions and Excel-forum spreadsheet tasks), across three agent-and-model stacks, each with no skills and with three skill libraries. Every task is labelled a gain (failed without the skill, passed with it) or a regression (the reverse).
2. **Why you're seeing it:** `efficacy-methodology`.
3. **Seen before?** The same harm as "Agent Skills Can Be Harmful" in level 1, counted over whole benchmarks rather than case by case.
4. **Relates to:** Its control is an empty skill library. So is the no-skill baseline in dbt's `skill-sets.yaml`.
5. **Takeaways for you:** 553 gains against 324 regressions: a net lift hides a lot of churn. Each arm ran once ("run-to-run variance is not estimated"). An exact McNemar test on the discordant pairs leaves 3 of 18 conditions significant after Bonferroni correction.

### SkillApt: Learning When to Activate Agent Skills from Counterfactual Evidence
[link](https://arxiv.org/html/2609.26863) · 2026-09-22 · research paper (Central China Normal University) · read in full · search

1. **What it is about:** It learns, task by task, whether loading a skill is worthwhile. Its labels come from with-and-without pairs in which "the only manipulated variable" is the target skill. If infrastructure fails in either arm, the pair is dropped rather than scored as a loss.
2. **Why you're seeing it:** `efficacy-methodology`.
3. **Seen before?** It uses ACES's control from level 1: companion skills stay loaded in both arms and only the target skill is withheld.
4. **Relates to:** Heterogeneous treatment effects, as in uplift modelling: the per-task effect is the object, not the average.
5. **Takeaways for you:** Of 29 skills, 19 helped on some tasks and hurt on others. Each pair ran once at temperature 0; only a 9-fixture real-world check repeated arms three times.

### DeepSWE: Measuring Frontier Coding Agents on Original, Long-Horizon Engineering Tasks
[link](https://arxiv.org/html/2607.07946) · 2026-07-08 · research paper (Datacurve) · read in full · search

1. **What it is about:** A benchmark of 113 newly written coding tasks graded by hand-written verifiers. It runs 16 agent configurations about four times per task, for 7,174 scored runs.
2. **Why you're seeing it:** `efficacy-methodology`, `benchmarks-depth`.
3. **Seen before?** No. It is not about dbt, but its section on error bars states the unit-of-analysis problem more plainly than any other in-window source.
4. **Relates to:** ACES's two intervals in level 1: one over paired cases, and one bootstrapped over whole skills.
5. **Takeaways for you:** Its ±1.96 SE interval "captures only one source of noise", the reruns, and misses task sampling. "With only about four runs, a configuration whose runs happen to land close together looks very precise even when its true uncertainty is large."

### One Success Isn't Reliability: Thinkingbox, a Sandbox and Benchmark for Agents in Stateful Business Workflows
[link](https://arxiv.org/html/2608.19741) · 2026-08-20 (v2 2026-08-29) · research paper (Pittsburgh, Northwestern, UC Irvine, Microsoft) · read in full · search

1. **What it is about:** 507 business-workflow tasks in areas such as retail, insurance and banking IT. Each task is run 20 times, and executable checks inspect the final state of the sandbox.
2. **Why you're seeing it:** `agent-efficacy`, `efficacy-methodology`.
3. **Seen before?** No. The closest dbt parallel is ADE-bench's three attempts per task in the breadth pass.
4. **Relates to:** pass@k asks whether any of k attempts succeeds; pass^k asks whether all k do, which separates best-of-k from a result that repeats.
5. **Takeaways for you:** Claude Opus 5 scored 66.50% at pass@1 but 47.53% at pass^20. Intervals come from a task-cluster bootstrap that keeps each task's 20 trials together: the task is the unit, not the trial.

### Noise Floor Audit for Agent Benchmarks
[link](https://arxiv.org/html/2608.22331) · 2026-08-23 · research paper (Georgia Tech, CMU) · read in full · search

1. **What it is about:** It measures two sources of noise on 150 tasks from BFCL, the Berkeley Function Calling Leaderboard: 10 identical reruns at temperature 0, and rewording each prompt without changing its meaning.
2. **Why you're seeing it:** `efficacy-methodology`.
3. **Seen before?** No. The breadth pass covered noise in the judge (DataClawEval). This is noise in the agent.
4. **Relates to:** An A/A test: rerun the same arm to see how much movement appears with no intervention.
5. **Takeaways for you:** Only 0.7-2.7% of tasks ever flipped across reruns, while rewording gave paired standard deviations 11-58x larger. So spend budget on prompt variants and more tasks rather than reruns. It covers single tool-call tasks only.

**Leads:**
- **L2a-a** - Gains versus regressions: reporting a skill's effect as a transition table over tasks, not a net lift. Read the Regression Tax's three mechanisms (description "osmosis", grounding displacement, verification displacement), SkillTriage's reference-run attribution in "Agent Skills Can Be Harmful", SkillApt's per-task utility labels, and ACES's isolation-versus-group "routing premium". Read for which tasks each counts as harmed, and against which control run.
- **L2a-b** - Repeats and the resampling unit in agent benchmarks. Read Thinkingbox's Appendix D.1 task-cluster bootstrap, DeepSWE's released per-run records, the Noise Floor Audit's bootstrap curve over 25-150 tasks, "Beyond Pass@k" ([2608.14711](https://arxiv.org/html/2608.14711), 2026-08-11, reliability@k over 8 rollouts), and Miller's "Adding error bars to evals" (**Background**, 2024). Read for how many trials each trusts and what it resamples.

**So what:** The control arm is one of two things - an empty library (the Regression Tax, dbt's baseline) or everything except the target skill (ACES, SkillApt) - and they answer different questions: does having skills help, or does this one add anything. Almost every in-window skill study runs each arm once; the benchmark papers that repeat say the task is the unit to resample, and that rewording a prompt moves scores more than rerunning it. For a dbt skill, read the lift as gains and regressions over tasks, and spend extra runs on more scenarios before more reruns.

**Searched for and not found:** paired with-and-without trajectories in `benchflow-ai/skillsbench-leaderboard` (its only in-window commit, 2026-07-09, syncs the v1.1 task set); a `dbt-agent-skills` evals change since PR #159 that adds repeats; an in-window practitioner post on A/A tests for agent evals.

## Level 2b - Where skill-eval test cases come from, and what they miss

**Background:** Alibaba's obligation-coverage data ([SkillAdqBench](https://github.com/dawnvince/SkillAdqBench)) went public on 2026-08-10. Tessl's [2606.17819](https://arxiv.org/html/2606.17819) (June 16) generates tasks from skills, drops any that reveal "rubric details that could enable gaming", and excludes skills that need databases or pre-populated state. [SkillAudit](https://arxiv.org/abs/2606.22613) (June) builds tasks from the capabilities a skill claims. dbt's 15 `scenario.md` files are hand-written checklists.

### Towards automating eval engineering (LangChain's Eval Engineering skill)
[link](https://www.langchain.com/blog/towards-automating-eval-engineering) · 2026-07-22 · vendor blog (LangChain) · read in full · search

1. **What it is about:** A skill that has a coding agent draft evals for your agent. It maps the repository's prompts and tools, reads traces from LangSmith (LangChain's tracing product), then interviews you; each eval you approve becomes a Harbor task: an instruction, a Docker environment and a verifier.
2. **Why you're seeing it:** `efficacy-methodology`. It draws a prompt set from code, traces and a person at once.
3. **Seen before?** It is the breadth pass's lead L5b, not read until now.
4. **Relates to:** In ACES the author writes the intent. Here the person approves each proposed eval instead.
5. **Takeaways for you:** "The best evals came from users providing feedback." Agents gamed the verifiers: they "exploit exposed answer material, or satisfy a proxy without completing the task." It describes no coverage check.

### How to build agent evals from traces
[link](https://arize.com/resources/agent-evals-from-traces/) · 2026-08-19 · vendor guide (Arize, an LLM-monitoring company) · read in full · search

1. **What it is about:** Read the traces before you write any evaluator. Label each defect you see ("open coding"), group the labels into a failure taxonomy, and rank failure types by "frequency × severity × difficulty_of_detection".
2. **Why you're seeing it:** `efficacy-methodology`. This is the production-trace route to a prompt set.
3. **Seen before?** No. **Background:** Braintrust (June 17) and Arthur (June 12) describe the same loop from trace to golden set.
4. **Relates to:** [Agent Tailor](https://blog.agentailor.com/posts/how-to-write-ai-agent-evals) (2026-08-15): "a suite invented at a desk tests the failures you can imagine; one distilled from traces tests the ones you already shipped."
5. **Takeaways for you:** This is your sampling ground. "A calibration set drawn only from failures will overstate recall and understate precision, because the base rate is wrong." Sample common, hard and edge cases, not only failures.

### SKT: Skill-Use Training at Scale via Verified Synthetic Data Generation
[link](https://arxiv.org/html/2608.02287) · 2026-08-03 · research paper (Shanghai AI Laboratory) · read in full · search

1. **What it is about:** A pipeline that generates 4,000 tasks from 2,000 public skills, each with a sandbox, an executable evaluator and a reference solution. Every task passes rule checks, an LLM review and a difficulty gate; the test set is built from a separate pool of skills.
2. **Why you're seeing it:** `efficacy-methodology`.
3. **Seen before?** No. Its test set is also called SkillEval, but it is not the breadth pass's SkillEval (2608.06891).
4. **Relates to:** Tessl's leakage check in the Background above. SKT also withholds its test tasks from training.
5. **Takeaways for you:** A task is kept only if a paired run shows the skill helps, and tasks solved too often are made harder. The population is built to need the skill, so lift measured on it describes those tasks.

### ImpossibleRubrics: Stress-Testing Generated Rubrics as Reward Signals
[link](https://arxiv.org/html/2609.16816) · 2026-09-15 · research paper (NUS, Peking University, CAS, JD.com) · read in full · search

1. **What it is about:** Eleven models each wrote a grading rubric from nothing but a task and its evidence. On 169 tasks with no supportable answer (plus 48 answerable controls), the rubrics passed 8-26% of an attacker's confident but unsupported answers.
2. **Why you're seeing it:** `efficacy-methodology`. The grading criteria are the other half of a generated eval.
3. **Seen before?** No. Level 1 looked at judges; this is the rubric the judge is given.
4. **Relates to:** dbt's hand-written criteria. The Semantic Layer scenario caps the score at 2 if any legacy construct appears.
5. **Takeaways for you:** Rubrics failed by being "specific about the wrong things", not by being vague. One gave full credit for "0.0%" when the evidence contained no trials.

### Skill-based Agentic Evaluation for Real-time Data Science Tasks (full text)
[link](https://arxiv.org/pdf/2609.16487) · 2026-09-15 · research paper (Adobe) · read in full · search

1. **What it is about:** How Adobe built 55 test cases for an in-house machine-learning skill. Each is a user request with expected-answer code, run against a synthetic warehouse that copies production schemas. Decoy datasets were planted, such as a mislabelled 2-week extract, so an agent matching on names alone fails.
2. **Why you're seeing it:** `efficacy-methodology`, `agent-efficacy`.
3. **Seen before?** Yes. Path 1 level 1 read the abstract. This is the full text's test set and one baseline.
4. **Relates to:** Adobe's weakest baseline had Anthropic's skill-creator "devise its own criteria".
5. **Takeaways for you:** That baseline checked only the skill's own declared "final checks", and was anti-correlated with three expert raters (MCC −0.379). Criteria taken from the skill grade it against its own claims.

**Leads:**
- **L2b-a** - Drawing an eval set from production traces as a sampling problem. Read Arize's guide, Agent Tailor's post and the step in LangChain's skill that reads LangSmith traces; as **Background**, Braintrust's clustering-based selection and Arthur's regression sets built from incidents. Compare them with dbt's `dbt-job-failure` scenario. Read for how each sets its sampling frame, strata and base rate, and who approves a case.
- **L2b-b** - Generated environments and generated criteria for data tasks. Read Adobe's synthetic warehouse with decoys, the enterprise data generator in [2609.11286](https://arxiv.org/abs/2609.11286) (2026-09-10, 66 business applications), SKT's filter, ImpossibleRubrics, and Tessl's leakage checks and database exclusion (**Background**). Read for how a generated task and its rubric are checked, and what the generator filters out.

**So what:** Test cases come from three places, and each misses something different. Cases drawn from the skill's own text inherit what the skill claims (Adobe's self-criteria baseline, SKT's filter); cases drawn from traces cover what already shipped, and catch rare failures only if you sample for them; cases written by people are few and hand-checked. Only Alibaba's gate measures coverage - elsewhere a person approving each case stands in for it, including dbt's 15 hand-written scenarios. Read any dbt skill result as a result on that sampling frame.

**Searched for and not found:** any coverage check applied to the `dbt-agent-skills` scenarios; no scenario was added in the window (the three commits touching that folder fixed an example on 07-15, changed the harness on 09-01 and renamed a skill on 09-03). SWE-Skills-Bench's repository returned 404.

## Where this path ends

A skill's lift is an A/B test with the skill as the treatment, and the in-window work is only starting to hold it to that standard. Controls differ - an empty library or everything but the target skill - and answer different questions. Most studies run each arm once, a net lift hides churn between tasks gained and tasks lost, and the task set is drawn from wherever was convenient: the skill's own text, traces, or a few hand-written scenarios, with only Alibaba measuring coverage. dbt's own skill-eval sits at the start of that curve: paired arms and hand-written checklists, but single runs, an LLM grader and no published results. Read any dbt skill delta as directional. The questions you already ask of an experiment - unit, repeats, population - are the ones this literature is now learning to ask.
