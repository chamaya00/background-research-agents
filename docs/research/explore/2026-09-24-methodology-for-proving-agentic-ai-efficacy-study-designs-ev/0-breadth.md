# Breadth pass - proving agentic AI efficacy

Five angles on how people show that an agentic AI system actually works, and
the published pieces behind each. Paths 1, 2 and 3 go deeper on angles 3, 2
and 1. The index is [`README.md`](README.md).

## Angle 1 - Studies of agents rolled out inside real companies

How a company measures whether giving people an agent changed anything, and
what it chooses to count.

### Adoption and Impact of Command-Line AI Coding Agents
[link](https://arxiv.org/abs/2607.01418) · 2026-07-01 · paper · read in full

1. **What it is about:** Microsoft researchers measured what happened after engineers got two terminal-based coding agents, Claude Code and GitHub Copilot CLI. They used a synthetic control (a comparison group built from engineers who did not adopt) and found merged pull requests per engineer per day up about 24%.
2. **Why you're seeing it:** `efficacy-methodology` asks how efficacy is proven through study designs, and this is the largest causal study of a deployed agent in the window.
3. **Seen before?** New to you. Every earlier brief ([#26][b26], [#35][b35], [#42][b42]) measured agents on benchmarks, not in a company rollout.
4. **Relates to:** the CMU/Stanford study below, and path 3, which asks what this study counts as the outcome.
5. **Takeaways for you:** The design is careful, with a placebo test and confidence intervals. But the outcome is a count of merged pull requests, and the authors say they measured no quality outcome.

### AI Writes Faster Than Humans Can Review: A Longitudinal Study of an Enterprise "2×" Mandate
[link](https://arxiv.org/abs/2607.01904) · 2026-07-02 · paper · read in full

1. **What it is about:** CMU and Stanford researchers followed 802 developers and 196,212 pull requests at a software firm that told staff to double productivity with AI. Pull requests per developer doubled. The share getting any human review fell from 89% to 68%, while AI review bots rose to about 84%.
2. **Why you're seeing it:** it pairs a throughput number with review and quality measures, which is the kind of evidence `efficacy-methodology` and `agent-efficacy` are about.
3. **Seen before?** New to you. It came out a day after the Microsoft study, and the two do not cite each other.
4. **Relates to:** path 3, levels 1 and 3, which read it closely.
5. **Takeaways for you:** Reverts stayed flat or fell, so quality did not visibly drop on its measures. The checking behind each change thinned, though, and the authors say a single throughput number hides exactly that.

### METR: an update on its developer-productivity trial
[link](https://metr.org/blog/2026-02-24-uplift-update/) · 2026-02-24 · report · summary only

1. **What it is about:** METR, an AI evaluation nonprofit, ran a randomised controlled trial in 2025, assigning developers at random to work with or without AI. Experienced open-source developers were 19% slower with AI. This post says the follow-up gave "an unreliable signal", because developers declined to work without AI.
2. **Why you're seeing it:** Background, older than the 90-day window. It shows the textbook design `efficacy-methodology` names, the randomised trial, running into a practical wall.
3. **Seen before?** New to you.
4. **Relates to:** the two company studies above, which are observational rather than randomised.
5. **Takeaways for you:** Once people depend on a tool, randomly withholding it gets hard. That is part of why no in-window randomised trial of an agent turned up.

## Angle 2 - Checking that a benchmark measures what it claims

How researchers find the leaks, shortcuts and scoring choices that inflate a
benchmark score.

### Automated Transcript Analysis for Detecting Flaws in Agentic Benchmarks
[link](https://arxiv.org/abs/2607.27518) · 2026-07-29 · paper · read in full

1. **What it is about:** The UK AI Security Institute and co-authors built "scanners", LLM prompts that read saved agent runs, to find four kinds of benchmark flaw, such as the agent seeing the answer. Humans then confirmed the flags. They confirmed problems in five widely used agent benchmarks.
2. **Why you're seeing it:** `efficacy-methodology` covers whether a benchmark is valid, and this is the first systematic tool for checking.
3. **Seen before?** Yes, one benchmark at a time. The [Snowflake exploration][snow]'s path 1 found a benchmark whose answers nobody outside its authors had audited, and [#35][b35] item 1 found Spider 2.0's scoring suspended.
4. **Relates to:** path 2, which follows its numbers.
5. **Takeaways for you:** Scanners are triage, not graders. Humans confirmed that about 20% of SWE-bench Verified runs touched leaked answers. SWE-bench Verified is the most-cited coding-agent benchmark.

### Hack-Verifiable Terminal Bench
[link](https://arxiv.org/abs/2608.22103) · 2026-08-22 · paper · read in full

1. **What it is about:** Tel Aviv University and UC Santa Barbara researchers planted a folder of solutions and tests into 8,989 command-line tasks, so any agent that peeks gets caught. At the least-hardened level, one frontier model used the planted answers in 59.8% of runs and another in 11.8%.
2. **Why you're seeing it:** benchmark validity, under `efficacy-methodology`.
3. **Seen before?** New to you.
4. **Relates to:** the scanner paper above, which finds leaks after the fact where this one sets a trap. Path 1, level 3 meets the same risk in a business benchmark.
5. **Takeaways for you:** Models differ a lot in how willing they are to take a shortcut. On an unhardened benchmark, part of a leaderboard gap can be willingness to exploit rather than skill.

### When Is an Agent Evaluation Over? Outcome Finality and Cross-Unit Separation
[link](https://arxiv.org/abs/2608.14940) · 2026-08-14 · paper · read in full

1. **What it is about:** A single-author paper that asks when you should read an agent's result, and whether runs affect each other. In a replay of AgentDojo, an agent-security benchmark, scoring at the end of the run recorded 50 successes out of 200. Waiting for pending operations to finish recorded 200 out of 200.
2. **Why you're seeing it:** benchmark validity, under `efficacy-methodology`.
3. **Seen before?** It echoes [#26][b26] item 4 (ERPBench), where "the task appeared to complete" and "the right value was written" differed by more than 80 points.
4. **Relates to:** path 3's theme that what a study counts as the outcome is a choice.
5. **Takeaways for you:** When you score can change the score. Only 4 of 10 well-known agent benchmarks say how they handle unfinished operations.

## Angle 3 - Grading how an agent got its answer, not only the answer

Newer grading methods that look at the steps taken, the data used, and
repeated runs.

### Evaluating Enterprise Analytics Agents: An End-to-End, Trace-Backed Methodology
[link](https://arxiv.org/abs/2609.09182) · 2026-08-28 · paper · read in full

1. **What it is about:** Thumbtack, a US marketplace for hiring local service professionals, shows how it evaluates its internal analytics agent. It uses 50 questions with human-written "golden" answers, runs each three times, and grades from the agent's trace (its log of queries and steps) instead of using an LLM judge.
2. **Why you're seeing it:** it is the closest piece to your own domain, an analytics agent evaluated on its owner's data, under `efficacy-methodology` and `semantic-models`.
3. **Seen before?** [#42][b42] found no paper saying what a semantic layer cost to build. This one puts a golden answer at "a few hours" per question. The [sibling exploration][sib] also reads it.
4. **Relates to:** path 1 on repeated runs.
5. **Takeaways for you:** On 15 of 30 finance traces, the agent gave numerically close answers from the wrong source tables. A right-looking number can come from the wrong place.

### trajectory-judge: What Outcome-Only LLM Judges Miss on Agent Trajectories
[link](https://arxiv.org/abs/2609.00038) · 2026-08-29 · paper · read in full

1. **What it is about:** A synthetic study from Utrecht University uses a support agent with seven tools and 400 runs with faults planted at known steps. A judge that sees only the goal and the final answer catches 84% of obvious faults but only 45% of silent ones. A judge given every step catches 77% of the silent ones.
2. **Why you're seeing it:** offline evals, under `efficacy-methodology`. An LLM judge (one model grading another model's output) is a common shortcut.
3. **Seen before?** New to you.
4. **Relates to:** Thumbtack above, which chose trace checks over an LLM judge.
5. **Takeaways for you:** If an LLM grades an agent, give the judge the steps, not just the answer. Promises the agent invented in its replies got past every judge tested.

## Angle 4 - Re-evaluating a production agent inside a company

How a team that owns an agent keeps checking it after every change without
running the whole benchmark each time.

### Efficient Benchmarking in Production: A Study of an Evolving LLM Agent
[link](https://arxiv.org/abs/2609.21267) · 2026-09-18 · paper · read in full

1. **What it is about:** A Meta team benchmarks a production analytics agent with tens of thousands of monthly users. The benchmark is 519 analyst-written questions and takes about three hours a run. With item response theory (IRT), a testing method that gives each question a difficulty so a few questions can predict the full score, 200 questions got within about 1 point.
2. **Why you're seeing it:** it is evaluation practice inside Meta, under `efficacy-methodology` and `agent-efficacy`.
3. **Seen before?** [#26][b26] item 5 said the team that owns an agent now runs its own private eval suite. This is the first account of what one costs to run.
4. **Relates to:** CAISI in angle 5, which also uses IRT. Neither cites the other.
5. **Takeaways for you:** The team deployed fixed question subsets because they were simple to run. The paper does not say how much a full run varies by itself, and path 1 shows that can be large.

## Angle 5 - What governments and regulators treat as evidence

What public evaluators publish as method, and what regulators can now demand.

### CAISI's Assessment of Z.ai's GLM-5.3 Cyber Capabilities
[link](https://www.nist.gov/news-events/news/2026/09/caisis-assessment-zais-glm-53-cyber-capabilities) · 2026-09-17 · report · read in full

1. **What it is about:** NIST's Center for AI Standards and Innovation (CAISI), a US government evaluator, assessed a Chinese model's hacking ability. It ran the model as an agent in a ReAct harness (a reason-then-act loop with bash and python) and took the best of three attempts. It combined scores with IRT and gave Wilson confidence intervals (a standard interval for a percentage).
2. **Why you're seeing it:** `efficacy-methodology` includes what an organisation accepts as evidence.
3. **Seen before?** Yes. [#26][b26] said a CAISI evaluation method would change its recommendation. CAISI published three assessments in the window, but none is a standard for evaluating agents.
4. **Relates to:** the Meta IRT paper in angle 4.
5. **Takeaways for you:** Best of three measures a ceiling, not reliability. Path 1 covers whether an agent works every time.

### NIST AI Agent Standards Initiative
[link](https://www.nist.gov/artificial-intelligence/ai-agent-standards-initiative) · 2026-08-14 · standard · read in full

1. **What it is about:** NIST's page for its effort to set standards for AI agents. It was updated in August but shows no dated output from the last 90 days. A related draft, NIST AI 800-2, "Practices for Automated Benchmark Evaluations of Language Models", is still a February public draft.
2. **Why you're seeing it:** `efficacy-methodology`, on what an organisation can cite as evidence.
3. **Seen before?** Yes. [#26][b26] was waiting on this initiative, and it is still quiet.
4. **Relates to:** CAISI's assessments above, which show a method by example rather than as a standard.
5. **Takeaways for you:** No US standard yet exists that a procurement team could cite for evaluating its own agents. It is worth checking again.

### EU AI Act Service Desk: the Commission's enforcement powers from 2 August 2026
[link](https://ai-act-service-desk.ec.europa.eu/en/ai-act/faq/commissions-enforcement-powers-related-ai-act-obligations-providers-most-advanced-models) · 2026-08-02 · standard · read in full

1. **What it is about:** The European Commission's FAQ on the powers it holds from 2 August 2026 over providers of general-purpose AI models. They include requesting access to a model for evaluation, and fines of up to 3% of global turnover.
2. **Why you're seeing it:** `efficacy-methodology`, on what regulators accept as evidence.
3. **Seen before?** New to you.
4. **Relates to:** CAISI above. The US answers by example and the EU by powers.
5. **Takeaways for you:** The EU can now ask to evaluate a model, but it has published no standard for what an evaluation must show.

[b26]: ../../26-analytics-and-agent-efficacy-brief-2026-09-23.md
[b35]: ../../35-depth-brief-2026-09-23-benchmarks-and-dbt.md
[b42]: ../../42-depth-brief-2026-09-23-semantic-models-and-warehouse-agentic.md
[snow]: ../2026-09-23-snowflake-sql-ai-functions/README.md
[sib]: ../2026-09-24-agentic-ai-features-for-analytics-launched-or-announced-ware/
