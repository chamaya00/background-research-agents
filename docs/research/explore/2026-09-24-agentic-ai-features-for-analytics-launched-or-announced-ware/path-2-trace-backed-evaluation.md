# Path 2 - What a data agent's score means when it runs more than once

This path starts from Thumbtack's trace-backed paper. It gathers how
evaluations and leaderboards handle repeated runs (averaging, "every run must
pass", reruns), and why the rule chosen changes the number.

## Level 1 - Repeated runs, and how each evaluation scores them

### Evaluating Enterprise Analytics Agents (full text)
[link](https://arxiv.org/html/2609.09182v1) · 2026-08-28 · paper · read in full

1. **What it is about:** These are the scoring rules behind the Thumbtack paper in the breadth pass. Each run gets yes, partial, no or unknown. Partial counts as half. Unknown (the agent declining to answer) leaves the average and is reported as a separate "coverage" rate. One table counts how often three runs agreed.
2. **Why you're seeing it:** It spells out one evaluation's rules in full (`efficacy-methodology`).
3. **Seen before?** Yes. Breadth angle 5 covered the same paper's abstract.
4. **Relates to:** Hex's rule from the breadth pass, which lets a case pass with one success in two attempts.
5. **Takeaways for you:** The stronger setup was fully consistent on only 1 of 50 questions. Only the 10 finance questions had checked answers, so "41 of 50" measures disagreement between runs, not wrong answers. The authors put it best: "The portable contribution is the methodology, not the specific rates." An automated review on [Pith](https://pith.science/paper/2609.09182) notes it never ran a final-answer-only grader to compare against.

### DataAgentBench
[link](https://github.com/ucbepic/DataAgentBench) · leaderboard updated to 2026-09-15 · repo · read in full

1. **What it is about:** This benchmark comes from UC Berkeley and Hasura PromptQL. It has 54 data questions over 12 datasets and four database systems. Every submission must include five runs per question, with traces.
2. **Why you're seeing it:** It is a live data-agent leaderboard (`benchmarks-depth`).
3. **Seen before?** New to you. #35 covered Spider 2.0 and BIRD, which test text-to-SQL.
4. **Relates to:** Levels 2 and 3 follow its top entry.
5. **Takeaways for you:** The headline Pass@1 averages the five runs, so a question that passes 3 of 5 counts as 0.6 and the inconsistency disappears into one number. Each dataset carries equal weight, whatever its size. An August check found one grader accepting the refusal "I could not determine the answer" as correct.

### BI-Bench
[link](https://arxiv.org/abs/2609.20886) · 2026-09-16 · paper · read in full

1. **What it is about:** Microsoft Research, Microsoft and UIUC test BI agents on 100 tasks. They average each result over 10 runs and use a paired t-test to check whether differences are real.
2. **Why you're seeing it:** It is a new benchmark for BI agents that repeats runs (`benchmarks-depth`, `efficacy-methodology`).
3. **Seen before?** New to you.
4. **Relates to:** Other in-window data-agent benchmarks. [Hex's DataBench](https://hex.tech/blog/databench-agentic-analytics-benchmark/) (2026-08-13) repeats its judge three times but not the agent. DI-Bench and [DataSpace](https://arxiv.org/abs/2608.03451) each run once.
5. **Takeaways for you:** Repeated runs are now common, but benchmarks use them to steady the average, not to report whether a task is solved every time. None of these five benchmarks publishes a per-task consistency figure.

### Noise Floor Audit for Agent Benchmarks
[link](https://arxiv.org/abs/2608.22331) · 2026-08-23 · paper · read in full

1. **What it is about:** Georgia Tech authors take 150 tool-calling tasks from BFCL, the Berkeley Function-Calling Leaderboard. They rerun each task 10 times at temperature 0, then reword each prompt four ways that keep its meaning.
2. **Why you're seeing it:** `efficacy-methodology` accepts lessons from any agent domain.
3. **Seen before?** New to you.
4. **Relates to:** Thumbtack's paper above. Its repeats change the run order and sampling, but never the wording of the question.
5. **Takeaways for you:** Rerunning changed the outcome on only 0.7-2.7% of tasks, but rewording moved scores 11 to 58 times more than rerunning did. The authors recommend publishing the rewording variance beside every headline score. They warn that this may not hold for agents with long plans and side effects, and analytics agents are that kind.

## Level 2 - "Every run passes" versus the average

### Permute EQ submission (DataAgentBench PR #95)
[link](https://github.com/ucbepic/DataAgentBench/pull/95) · 2026-09-01 to 2026-09-13 · repo · read in full

1. **What it is about:** This is the pull-request thread behind DataAgentBench's current rank 1. The submitter first replaced only the failed runs on four questions. The maintainer refused, "because replacing only the trials that failed removes the very failures Pass@1 is meant to count", and accepted whole-question reruns instead.
2. **Why you're seeing it:** It shows how a leaderboard score gets made (`benchmarks-depth`).
3. **Seen before?** Like Spider 2.0-AIFunc in the 2026-09-23 exploration, it is a leaderboard result that changed after it was first posted.
4. **Relates to:** Level 3, on who writes the rules for reruns.
5. **Takeaways for you:** The entry rose from 0.8713 to 0.9467, and from third place to first. The reruns used prompts written for specific questions, and the maintainers disclosed this. Two reruns followed benchmark fixes that the submitter had reported. The rerun policy shapes a leaderboard score as much as the agent does.

### APIFlow-Bench
[link](https://arxiv.org/abs/2608.29128) · 2026-08-29 · paper · read in full

1. **What it is about:** Postman, the API-testing company, runs 467 API-workflow tasks five times per model. It reports three scores: any run passed, the mean, and all five passed.
2. **Why you're seeing it:** It is a lesson on reliability from outside data (`efficacy-methodology`).
3. **Seen before?** New to you. The sibling methodology exploration's Thinkingbox reports the same kind of all-runs score.
4. **Relates to:** DataAgentBench, which reports only the mean.
5. **Takeaways for you:** Requiring all five runs to pass spreads the models across 44 points, "double the 20.5-point pass1 spread". Small models lose the most: one drops 26.3 points, while frontier models drop 1.8-3.8. In the authors' words, "The leaderboard is therefore mostly a consistency ranking."

### Your Agent Aced the Task. Will It Do It Again?
[link](https://huggingface.co/blog/ibm-research/altk-evolve-consistency) · 2026-09-15 · vendor blog · read in full

1. **What it is about:** IBM Research explains pass^k, the share of tasks an agent solves in every one of k tries. Its example is AppWorld, a benchmark of everyday tasks across several apps.
2. **Why you're seeing it:** It is a plain explainer of the strict score (`efficacy-methodology`).
3. **Seen before?** APIFlow-Bench above.
4. **Relates to:** DataAgentBench's averaged Pass@1, and Hex's lenient pass rule.
5. **Takeaways for you:** A GPT-4.1 agent succeeded on 77.4% of runs, but succeeded on all five runs for only 53.0% of tasks. Its one-line rule is worth keeping: "Pass^k ≤ Mean@k ≤ Pass@k, always." When someone quotes a score, ask which of the three it is.

## Level 3 - Who writes the rerun rules

### Hide benchmark-informed submissions by default (DataAgentBench PR #100)
[link](https://github.com/ucbepic/DataAgentBench/pull/100) · merged 2026-09-13 · repo · read in full

1. **What it is about:** By default, DataAgentBench now hides entries whose prompt was written for this benchmark ("benchmark-informed"). Its [submission rubric](https://raw.githubusercontent.com/ucbepic/DataAgentBench/main/SUBMISSION_RUBRIC.md) already bans prompts that hand over "the decisive interpretation the gold answer depends on".
2. **Why you're seeing it:** It is a benchmark writing its own rules in public (`benchmarks-depth`).
3. **Seen before?** PR #95, in level 2.
4. **Relates to:** ClawProBench below, which writes a rerun rule down.
5. **Takeaways for you:** The top twelve entries are all tuned for the benchmark, and the first untuned entry scores 0.785, about 16 points below the leader. A footnote flagging rank 1's question-specific prompts was added on 2026-09-13 and removed two days later. The rank-1 submitter asked for written rerun criteria, and none exists yet.

### Learned Enterprise Data Comprehension: Compression and Routing for Data Agents
[link](https://arxiv.org/abs/2609.25286) · 2026-09-21 · paper · read in full

1. **What it is about:** This is the rank-1 team's own paper, from permute.ai. It reports 94.67% on DataAgentBench, "ranking first among 40 leaderboard entries".
2. **Why you're seeing it:** It is the published account behind the leaderboard's top score (`benchmarks-depth`, `efficacy-methodology`).
3. **Seen before?** PRs #95 and #100 above.
4. **Relates to:** Spider 2.0-AIFunc in the 2026-09-23 exploration, where a paper and its release also described different things.
5. **Takeaways for you:** The paper says its protocol "prohibited benchmark-specific information" in prompts. It does not mention the reruns or the question-specific prompts that the leaderboard records. Read a paper's headline together with the leaderboard's notes.

### ClawProBench
[link](https://arxiv.org/abs/2608.22510) · 2026-08-23 · paper · read in full

1. **What it is about:** A benchmark for agents running on OpenClaw, a live agent runtime with tools for browsing, memory, messaging and scheduling. Each run is scored from its execution trace.
2. **Why you're seeing it:** It is the only benchmark found that writes a rerun rule down (`efficacy-methodology`).
3. **Seen before?** New to you. Like Thumbtack's paper, it scores from traces.
4. **Relates to:** DataAgentBench, which has no written rerun rule.
5. **Takeaways for you:** The rule fits in one line: "Only provider or harness execution failures should be rerun; low-score targeted tuning should create a new exposed/tuned submission label." It also asks each leaderboard row to record the settings used, the retry policy and "prior benchmark exposure". Look for rules like this on any leaderboard you rely on.

### What Does an LLM-Agent Leaderboard Rank Actually Compare?
[link](https://arxiv.org/abs/2609.07785) · 2026-09-07 · paper · read in full

1. **What it is about:** Wei-Jung Huang re-analyses agent leaderboards, DataAgentBench among them, to see how weighting and uncertainty move the ranks. The paper was accepted at IEEE DSAA 2026.
2. **Why you're seeing it:** It is an outside look at what a leaderboard rank is worth (`benchmarks-depth`).
3. **Seen before?** DataAgentBench, in level 1.
4. **Relates to:** Level 1's point that DataAgentBench weights each dataset equally.
5. **Takeaways for you:** On DataAgentBench, "scores shift by up to 9.2 points and 10 of 28 public-configuration pairs remain underpowered". In plain terms, many pairs are too close to tell apart. The paper asks leaderboards to report "what configuration was evaluated". Its data are older than the current top three entries.
