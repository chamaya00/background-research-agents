# Path 1 - Why "it worked once" is not the same as "it works every time"

This path follows Thinkingbox, a new benchmark that runs every task 20 times,
and the writing around it. It covers how reliability is measured, how the
number gets computed and published, and whether an agent could game the
grader. It grew out of angle 3 of the [breadth pass](0-breadth.md).

## Level 1 - Measuring reliability, not one-off success

### One Success Isn't Reliability: Thinkingbox, a Sandbox and Benchmark for Agents in Stateful Business Workflows
[link](https://arxiv.org/abs/2608.19741) · 2026-08-29 (v2; v1 2026-08-20) · paper · read in full

1. **What it is about:** Researchers from Pittsburgh, Northwestern, UC Irvine and Microsoft built 507 business-workflow tasks and graded each one on the final state of its database, running every task 20 times. pass@1 is the chance that one try succeeds. pass^20 is the share of tasks that succeed on all 20 tries.
2. **Why you're seeing it:** repeated trials are one of the clearest new ideas in `efficacy-methodology` about what counts as evidence.
3. **Seen before?** [#26][b26] item 4 (ERPBench) graded the database instead of the screen. Thinkingbox adds repetition.
4. **Relates to:** the rest of this path. The [sibling exploration][sib] also found that the rule for combining runs decides the result.
5. **Takeaways for you:** Claude Opus 5 scores 66.50% on one try but 47.53% on all 20. Similar one-try scores hide very different consistency. Name the version when quoting: v1 led with GPT-5.4 at 25.25%.

### τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains
[link](https://arxiv.org/abs/2406.12045) · 2024-06-17 · paper · summary only

1. **What it is about:** The Sierra/Princeton benchmark that introduced pass^k. Sierra is a customer-service agent company. Agents chat with a simulated customer and call tools. In 2024 GPT-4o solved under half the tasks, and under 25% of retail tasks on all 8 tries (pass^8).
2. **Why you're seeing it:** Background, older than the window. Thinkingbox and most reliability work cite it as where the metric comes from.
3. **Seen before?** New to you.
4. **Relates to:** Thinkingbox above, which borrows its metric.
5. **Takeaways for you:** Two years later, the most consistent model in Thinkingbox keeps about 71% of its one-try score across 20 tries. That is better, but still far from "every time".

### Beyond Pass@k: Measuring Reliability and Security of Agentic Code Generation
[link](https://arxiv.org/abs/2608.14711) · 2026-08-11 · paper · read in full

1. **What it is about:** Researchers from Cornell, Anote.ai and Stevens show that pass@k is sometimes computed over the unit tests inside one submission rather than over independent runs. They propose "reliability@k" instead. On a small synthetic set, pass@5 overstated multi-run reliability by 0.92 on average.
2. **Why you're seeing it:** `efficacy-methodology`, on how a reliability metric is defined.
3. **Seen before?** New to you.
4. **Relates to:** level 2, on how Thinkingbox's own number is computed.
5. **Takeaways for you:** One label can cover several different calculations. Before you compare two figures, ask what the n and the k actually count.

### READY or Not: Reliable Enterprise Agent Deployment
[link](https://arxiv.org/abs/2609.02095) · 2026-09-02 · paper · summary only

1. **What it is about:** Mostly Scale AI authors test 16 systems on 750 clinical-audit cases. They measure how much human review each system needs to reach a 76% reliability target. GPT-5.4, at 72.8% accuracy, needed 39.2% human review. Sonnet 5, at 72.5%, needed 29.6%.
2. **Why you're seeing it:** `agent-efficacy`, on what an enterprise accepts as evidence that it can deploy an agent.
3. **Seen before?** New to you.
4. **Relates to:** Thinkingbox, where near-identical headline scores also hide a big practical difference.
5. **Takeaways for you:** Whether a system knows when it is wrong, so its failures reach a person, is a separate part of reliability from accuracy.

### Noise Floor Audit for Agent Benchmarks
[link](https://arxiv.org/abs/2608.22331) · 2026-08-23 · paper · read in full

1. **What it is about:** Georgia Tech and CMU researchers ran 150 function-calling tasks ten times each on three models. Scores moved by about a point or less between reruns. Rewording the prompt without changing its meaning moved them by a median of 10-19 points.
2. **Why you're seeing it:** `benchmarks-depth`, on how much a score moves for reasons that have nothing to do with skill.
3. **Seen before?** The Meta paper in the breadth pass (angle 4) did not measure run-to-run noise. This paper does, on simpler tasks.
4. **Relates to:** Thinkingbox, where multi-step tasks vary a lot between runs.
5. **Takeaways for you:** Test with reworded prompts rather than plain reruns. Variation seems to come from multi-step interaction more than from single calls.

## Level 2 - How a reliability number is computed and published

### ThinkingBox: Measuring whether agents finish the job
[link](https://commandline.microsoft.com/thinkingbox-bench-agent-benchmarking/) · 2026-08-19 · vendor blog · read in full

1. **What it is about:** Microsoft's launch post for the benchmark, written by one of its engineers. It defines pass^20 plainly, "On what percentage of tasks did all 20 attempts succeed?". It also gives figures for models the paper does not, such as Claude Opus 4.6 and Kimi-K2.6.
2. **Why you're seeing it:** `efficacy-methodology`, on how reliability evidence is presented to readers.
3. **Seen before?** It is the companion to the level 1 paper.
4. **Relates to:** pull request #22 below, which shows the released tool computes something else.
5. **Takeaways for you:** Opus 4.6 and Kimi-K2.6 are 0.25 points apart on one try (37.91% and 37.66%) but more than 10 points apart on all 20 (13.81% and 3.16%). It is a second example of the same pattern.

### microsoft/thinkingbox pull request #22: "fix: correct pass^k metric naming and comments"
[link](https://github.com/microsoft/thinkingbox/pull/22) · 2026-08-19 · repo · read in full

1. **What it is about:** A small change in the benchmark's released code. It renamed the pass^k function and documented a deliberate choice: the tool averages (successes ÷ attempts)^k over tasks, which gives partial credit to tasks that nearly always pass, rather than counting only tasks that passed every time.
2. **Why you're seeing it:** `efficacy-methodology`, on whether a published number can be reproduced.
3. **Seen before?** Yes. The [Snowflake exploration][snow]'s path 1 found a benchmark whose paper and released files disagreed (465 tasks against 393).
4. **Relates to:** the launch post above, which defines the metric the literal way.
5. **Takeaways for you:** The paper's figures look like the literal all-20 share, but the released tool computes a larger number, so a rerun will not match the paper. When you see pass^k, ask which calculation was used.

### ThinkingBox-Bench dataset
[link](https://huggingface.co/datasets/microsoft/ThinkingBox-Bench) · 2026-08-17 · repo · read in full

1. **What it is about:** The public copy of the 507 task definitions on Hugging Face, the main public host for AI models and datasets, under a permissive data licence. Its terms forbid using the tasks to train or optimise a model.
2. **Why you're seeing it:** `efficacy-methodology`, on what a benchmark releases so that others can check it.
3. **Seen before?** [#42][b42] item 6 found an enterprise benchmark that nobody outside its builder could run. Anyone can run this one.
4. **Relates to:** pull request #22 above, and level 3 on run logs.
5. **Takeaways for you:** The tasks are public but no per-run results are, so the headline can be checked for consistency but not recomputed. "Are per-task results released?" is a fair question to ask of any reliability claim.

### Pebblous editorial on Thinkingbox and stateful agent reliability
[link](https://blog.pebblous.ai/blog/thinkingbox-stateful-agent-reliability/en/) · 2026-08-20 · vendor blog · read in full

1. **What it is about:** A write-up from Pebblous, a data company, that summarises the paper and the limits the authors themselves admit. One is that the single simulated user stays "cooperative after repeated agent failures".
2. **Why you're seeing it:** it shows how the benchmark was covered outside the paper.
3. **Seen before?** New to you.
4. **Relates to:** the level 1 paper.
5. **Takeaways for you:** Coverage from launch week quotes v1's GPT-5.4 figures, which v2 dropped. Check which version second-hand coverage is based on.

## Level 3 - Could an agent game the grader?

### Issue #35: `__reserved__server_tool` is routable from /call_tool and /mcp, bypassing the scenario tool allowlist
[link](https://github.com/microsoft/thinkingbox/issues/35) · 2026-09-21 · repo · read in full

1. **What it is about:** An outside contributor reports that a hidden server command could let a caller rewrite the database the grader reads. That is "reward hacking": passing the check without doing the task. No maintainer has replied.
2. **Why you're seeing it:** `efficacy-methodology`, on whether a benchmark's grading can be trusted.
3. **Seen before?** It is the same family as Hack-Verifiable Terminal Bench in the breadth pass (angle 2).
4. **Relates to:** the README below, which explains how a run is wired.
5. **Takeaways for you:** Agents run through the benchmark's own runner cannot reach the command, because the runner refuses tools it did not offer. Anything connected to the server directly still can. Integrity can depend on the harness rather than the tasks.

### microsoft/thinkingbox README
[link](https://github.com/microsoft/thinkingbox) · 2026-09-10 · repo · read in full

1. **What it is about:** The repository's front page. It shows how a run is wired: a local "session proxy" sits in front of the tool servers, which speak MCP (Model Context Protocol, the open standard agents use to call tools), and `tb infer` runs the agent. The framework is also meant for training-data generation and reinforcement-learning training loops.
2. **Why you're seeing it:** `efficacy-methodology`. It is background for reading the issue above.
3. **Seen before?** New to you.
4. **Relates to:** issue #35 and the docs below.
5. **Takeaways for you:** One benchmark server can serve as both an exam and a training ground. A gap that does not matter for the exam can matter when an agent is trained against it.

### Thinkingbox docs: test cases deep dive
[link](https://raw.githubusercontent.com/microsoft/thinkingbox/main/docs/test_cases_deep_dive.md) · 2026-09-10 · repo · read in full

1. **What it is about:** The repository's own explainer on how tasks are written and checked. It names the risk directly: an agent "learning to 'game' the tests (aka reward hacking) by generating the expected output without actually performing the necessary actions". A [companion doc](https://raw.githubusercontent.com/microsoft/thinkingbox/main/docs/history_and_metadata.md), read only as a summary, describes the per-run log.
2. **Why you're seeing it:** `efficacy-methodology`, on how builders guard against gamed scores.
3. **Seen before?** New to you.
4. **Relates to:** issue #35.
5. **Takeaways for you:** A run log shows what the agent tried, including refused calls, but not what else touched the database. No run logs are published, so an outside audit is not yet possible.

### ThinkingBox: a sandbox for agents (jacar.es, in Spanish)
[link](https://jacar.es/thinkingbox-sandbox-agentes/) · 2026-09-11 · news · read in full

1. **What it is about:** A Spanish-language explainer of the Thinkingbox framework. It covers the reserved setup and state-reading hooks that the grader relies on.
2. **Why you're seeing it:** it is outside coverage of the benchmark this path follows.
3. **Seen before?** New to you.
4. **Relates to:** issue #35, which came ten days later.
5. **Takeaways for you:** A readable walkthrough of how grading on the final state works. It does not mention the later issue.

[b26]: ../../26-analytics-and-agent-efficacy-brief-2026-09-23.md
[b42]: ../../42-depth-brief-2026-09-23-semantic-models-and-warehouse-agentic.md
[snow]: ../2026-09-23-snowflake-sql-ai-functions/README.md
[sib]: ../2026-09-24-agentic-ai-features-for-analytics-launched-or-announced-ware/
