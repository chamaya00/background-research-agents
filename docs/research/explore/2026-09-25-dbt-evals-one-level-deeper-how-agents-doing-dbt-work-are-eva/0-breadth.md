# Breadth pass - how agents doing dbt work are evaluated, one level deeper

**Headline.** Between late June and late September 2026, evaluating dbt agents mostly meant building harnesses and running paired comparisons, not leaderboard races. dbt Labs runs its skills with and without the skill, and runs candidate engines for its Wizard agent on its own benchmark. Google and NVIDIA published the same with-and-without "skill lift" design for skills in general. Benchmark authors are also widening what gets graded, from "do the output rows match" towards "was the project changed correctly". The graders people trust are deterministic: dbt tests and row comparisons. LLM judges appear only as a fallback, and one paper measured why.

dbt, for reference: it is the tool where data engineers write transformations as version-controlled SQL files called **models**. **dbt tests** are assertions run against the tables those models produce, such as "no nulls" or "matches this answer key".

## Angle 1 - dbt Labs' own eval harnesses

### skill-eval: dbt Labs' harness for testing its agent skills
[link](https://github.com/dbt-labs/dbt-agent-skills/tree/main/evals) · latest in-window change 2026-09-01 (PR #159) · open-source repository (dbt Labs) · read in full (README, PR #159, one scenario) · listed source

1. **What it is about:** A command-line tool that runs a dbt task under several "skill sets": no skill, a skill, or a skill plus an MCP server (the protocol agents use to call outside tools). Transcripts are graded by hand, or by Claude on task completion, tool use and solution quality.
2. **Why you're seeing it:** It is dbt's own with-and-without comparison (`agent-efficacy`, `efficacy-methodology`).
3. **Seen before?** Yes. Path 1 of the 2026-09-24 exploration noted the folder. This item is about how it is used.
4. **Relates to:** [PR #159](https://github.com/dbt-labs/dbt-agent-skills/pull/159) came out of "real A/B testing". It made the model mandatory and isolated MCP servers, because runs had been silently falling back to the default model and picking up unrelated tools.
5. **Takeaways for you:** One scenario runs the Semantic Layer skill at an old commit against the fixed version: a regression test for a skill. No results are published, because `runs/` holds only a `.gitignore`.

### ADE-bench as the yardstick for Wizard's engine (ADE-bench PR #154)
[link](https://github.com/dbt-labs/ade-bench/pull/154) · opened 2026-07-22, still open · open-source repository (dbt Labs) · read in full (description) · listed source

1. **What it is about:** ADE-bench is dbt Labs' benchmark of analytics-engineering tasks set inside real dbt projects. A task passes only if every dbt test passes. This pull request adds LangChain's Deep Agents Code as a runner "while evaluating Deep Agents for Wizard", dbt's agent.
2. **Why you're seeing it:** It is the clearest public trace of how dbt chooses what powers its agent (`agent-efficacy`, `warehouse-agentic`).
3. **Seen before?** The Upriver survey in the 2026-09-24 breadth pass named ADE-bench. This shows it being used.
4. **Relates to:** [PR #153](https://github.com/dbt-labs/ade-bench/pull/153) (2026-07-20) adds an effort setting for Claude Code, so harnesses can be compared at the same reasoning effort.
5. **Takeaways for you:** The design is paired: the same model on 75 tasks with 3 attempts each. It scored 167/225 against Codex's 165/225, and 53 tasks tied. The runs it links to are in a private repository.

**Leads:**
- **L1a** - How dbt Labs tests its skills and agents from the inside. Read the `dbt-agent-skills` `evals/` scenarios (v2-migration triage categories, Semantic Layer latest vs legacy spec, unit-test format choice, job failure), their `scenario.md` grading criteria and `skill-sets.yaml` configurations, `skill-eval`'s change history (#92, #159), and ADE-bench's agent runners (#149, #153, #154). Read for what dbt counts as "the skill helped" and how it catches a skill regression.
- **L1b** - How dbt measures the context it sells. Read `dbt-llm-sl-bench`'s August 2026 re-run (Claude 5 and GPT-5.6, with a thinking-effort sweep), the `dbt-mcp` repository's `evals/` folder, and dbt developer-blog posts on the Semantic Layer and the MCP server. Read for how dbt tests whether its metric definitions and tools make agents more accurate, and where it publishes that evidence.

## Angle 2 - Data-engineering benchmarks with dbt tasks

**Background:** Spider 2.0-DBT, 68 dbt tasks on DuckDB (a small single-file database), has no News entry since 2025-05-22. The benchmark activity in the window was elsewhere.

### "Evaluate dbt project changes beyond model output" (ADE-bench issue #155)
[link](https://github.com/dbt-labs/ade-bench/issues/155) · 2026-09-16 · open-source repository issue (dbt Labs) · read in full (issue, README) · listed source

1. **What it is about:** Doug Beatty of dbt Labs proposes that ADE-bench also check whether an agent changed the project itself correctly. That covers adding tests, setting model contracts (enforced column types), and declaring sources and exposures (the upstream tables and downstream dashboards). Today it checks "just whether it successfully produced the right rows."
2. **Why you're seeing it:** It names what the benchmark's grader cannot see today (`benchmarks-depth`, `efficacy-methodology`).
3. **Seen before?** No. The Upriver survey described ADE-bench's tasks, not the limits of its grader.
4. **Relates to:** The README explains the current grader. Tests are generated from answer-key CSV files ("seeds") and check that tables exist and that their rows match. "If all of them pass, the task passes."
5. **Takeaways for you:** Much data-engineering work leaves the output rows unchanged, so a grader that only matches rows cannot see it. The proposal is to grade against dbt's own metadata instead.

### ELT-Bench adds Databricks and Redshift destinations
[link](https://github.com/uiuc-kang-lab/ELT-Bench/commit/661c8ea) · 2026-08-02, follow-ups 2026-08-04 · open-source repository (UIUC) · commit read in full, README as summary only · search

1. **What it is about:** ELT-Bench asks an agent to build a whole pipeline. ELT means extract and load (copy source data into a warehouse), then transform, here with dbt into target models. It has 100 pipelines. It used to load into Snowflake only, and now also supports Databricks and Redshift, with reworked data models and ground truth.
2. **Why you're seeing it:** `benchmarks-depth`.
3. **Seen before?** It was named in the Upriver survey.
4. **Relates to:** **Background:** ELT-Bench-Verified (March 2026) found that benchmark errors, not agent errors, caused many of the failures. On 2026-09-23 a public repository turned ELT-Bench into a [training environment](https://github.com/Tony-Shen-2005/elt-bench-rl) for reinforcement learning.
5. **Takeaways for you:** Data-engineering benchmarks are now also training targets. In other agent domains, that has been the first step toward contamination.

### DataClawEval: data-engineering agents in a real industrial harness
[link](https://arxiv.org/html/2607.28033v1) · 2026-07-30 · research paper (Tencent and universities) · read in full · search

1. **What it is about:** 100 pipeline tasks drawn from Tencent's production code, across five engines (PySpark, Hive, Trino, Flink, MySQL), covering both batch and streaming. Deterministic scripts run each result against live databases and score both the output and the process. It does not use dbt.
2. **Why you're seeing it:** `efficacy-methodology`, `benchmarks-depth`.
3. **Seen before?** Only as a name in the Upriver survey.
4. **Relates to:** It describes ELT-Bench as "confined to a single dbt/Airbyte-on-warehouse stack."
5. **Takeaways for you:** It compared LLM judges with its rule-based grader. The judges inflated process scores from 22.2 to about 75, and their scores varied from run to run. The paper concludes "Rule-based grading is irreplaceable" because a judge "never observes runtime behavior." The top model scored 74.9.

**Leads:**
- **L2a** - What data-engineering benchmarks grade, and what they miss. Read ADE-bench's grader (auto-generated seed tests, issue #155's metadata proposal, the disputed tasks in #146 and #151), ELT-Bench-Verified's error taxonomy, DataClawEval's output-plus-process scoring and its judge experiment, and data-eng-bench's invariant tests. Read for how each one decides that a task passed.
- **L2b** - Benchmarks as training and harness targets. Read ELT-Bench's multi-warehouse release and `elt-bench-rl`, ADE-bench's Terminal-Bench base, data-eng-bench's train/test split (PR #5), and how vendors report ADE-bench results (Paradime, Altimate, Snowflake: retries, run dates, promised re-runs). Read for how a benchmark's meaning changes once agents are tuned against it.

## Angle 3 - Skill evals as a practice

**Background:** The open Agent Skills spec's [evaluating-skills guide](https://agentskills.io/skill-creation/evaluating-skills) (March 2026) and Anthropic's skill-creator set the pattern. Run each test prompt `with_skill` and `without_skill`, grade assertions, and record the difference. SkillsBench 1.1 (2026-06-16) found curated skills added 16.6 points, while skills the agents wrote for themselves lowered scores.

### Behind the scenes: how Google builds, tests and scales its Agent Skills
[link](https://cloud.google.com/blog/topics/developers-practitioners/behind-the-scenes-how-we-build-test-and-scale-google-agent-skills) · 2026-08-03 · vendor blog (Google Cloud) · read in full · listed source

1. **What it is about:** How Google tests the skills it publishes. Authors must supply prompt suites and scoring rubrics. Each skill is run with and without, on several agent frameworks, and the whole library is re-run weekly to catch regressions.
2. **Why you're seeing it:** `efficacy-methodology`.
3. **Seen before?** No. Path 1 of the 2026-09-24 exploration covered writing skills, not testing them.
4. **Relates to:** dbt's skill-eval in angle 1 uses the same with-and-without design. Google adds a weekly schedule.
5. **Takeaways for you:** Each skill lands in a 2×2 grid: whether it improves accuracy, and whether it improves efficiency in tokens and time. Before merge, linters and link checks catch "hallucinated links". Skills get CI, the automatic checks that run on every change.

### Evaluating AI agent skill performance with NVIDIA SkillEvaluator
[link](https://developer.nvidia.com/blog/evaluating-ai-agent-skill-performance-with-nvidia-skillevaluator/) · 2026-08-19 · vendor technical blog (NVIDIA) · read in full · search

1. **What it is about:** NVIDIA checks skills in three tiers: static checks, duplication across its catalogue, then live sandbox runs with and without the skill. It reports "Skill Lift", the difference in score, across 300+ skills on Claude Code and Codex.
2. **Why you're seeing it:** `agent-efficacy`, `efficacy-methodology`.
3. **Seen before?** No.
4. **Relates to:** The companion paper, [ACES](https://arxiv.org/abs/2608.20614) (2026-08-20), found that structural checks and LLM-judge scores barely agree (Spearman ρ = 0.14). Passing lint says little about whether a skill helps.
5. **Takeaways for you:** Lift averaged +41 points on correctness. The post says most skills were run only once and gives no confidence intervals. ACES reports a 95% interval on its paired subset.

### SkillEval: judging a skill without running it
[link](https://arxiv.org/html/2608.06891v1) · 2026-08-07 · research paper · read in full · search

1. **What it is about:** It scores a `SKILL.md` on seven properties, including trigger clarity, workflow integrity and failure awareness. It does this by reading the document's representation inside a model, without running any tasks.
2. **Why you're seeing it:** `efficacy-methodology`.
3. **Seen before?** No.
4. **Relates to:** The with-and-without runs above. It checks itself against SkillsBench's measured lift, with a correlation of about r = 0.78.
5. **Takeaways for you:** It works as a cheap pre-screen, not a substitute for runs. The authors note that the same skill helps by "substantially different" amounts on different tasks.

**Leads:**
- **L3a** - When a with-and-without skill delta can be trusted. Read the Agent Skills evaluating-skills guide, Anthropic's skill-creator evals and blind comparisons, SkillsBench 1.1, NVIDIA SkillEvaluator and ACES, Google's continuous evals, and the critics: SWE-Skills-Bench, SkillAudit, and "A Framework for Evaluating Agentic Skills at Scale" (arXiv 2606.17819). Read for repeats, baselines, agreement between judges and how tasks are selected.
- **L3b** - Harbor as a shared format for agent evals. Read the Harbor framework (Laude Institute, the makers of Terminal-Bench). SkillEvaluator, data-eng-bench and LangChain's eval-engineering skill (2026-07-22) all produce Harbor tasks, and ADE-bench is built on Terminal-Bench. Read for what one task format makes possible: the same task run across many agents and harnesses.

## Angle 4 - How teams judge dbt agents on their own projects

### dbt-agent-trust: evaluating an analytics agent on the dbt Semantic Layer
[link](https://github.com/datacult/dbt-agent-trust) · created 2026-07-14, last push 2026-09-15 · open-source repository (Data Culture, dbt Champions program) · read in full (README) · search

1. **What it is about:** A working question-answering agent built on the dbt Semantic Layer (dbt's store of metric definitions), plus a grader for 40 "golden questions" with known answers. An answer passes at the first of four layers that matches: exact, tolerant of column names, approximate, then an LLM judge.
2. **Why you're seeing it:** `agent-efficacy`, `dbt-context`.
3. **Seen before?** #35 covered dbt's own Semantic Layer benchmark. This is a practitioner's harness for the same kind of agent.
4. **Relates to:** Data Culture's dbt Summit 2026 talk, "Don't ship what you can't measure".
5. **Takeaways for you:** "Many different SQL queries return the same correct result, so comparing query text tells you nothing." It also says that synthesis and verdicts have no answer key, so they need expert review.

### dbt Wizard: an AI agent that actually understands your dbt project
[link](https://www.fivetran.com/blog/dbt-wizard-an-ai-agent-that-actually-understands-your-dbt-project) · 2026-08-18 · vendor blog (Fivetran, merged with dbt Labs) · read in full · listed source

1. **What it is about:** Fivetran's VP of Data gave dbt Wizard and Claude Code the same requests, starting with "Create a dbt model to compute monthly number of 1M dollar ARR customers". He lists six differences, including semantic search across the project, finding four downstream consumers before editing, and a validation subagent that ran `dbt run --defer`.
2. **Why you're seeing it:** `warehouse-agentic`, `agent-efficacy`.
3. **Seen before?** No. Path 1 read Wizard's documentation.
4. **Relates to:** PR #154 in angle 1, dbt's paired and repeated version of the same comparison.
5. **Takeaways for you:** It is useful for knowing what to look for in an agent's transcript. As evidence, it is one side-by-side run by the vendor, and it reports no measured outcome.

### No babysitting, not today
[link](https://docs.getdbt.com/blog/wizard-use-cases) · 2026-06-30 · vendor developer blog (dbt Labs) · read in full · listed source

1. **What it is about:** A dbt Labs advocate used Wizard to move his own economic-data project to the new Semantic Layer YAML. The project uses Dagster (an orchestrator, which schedules pipeline steps), dbt and BigQuery.
2. **Why you're seeing it:** `dbt-context`, `agent-efficacy`.
3. **Seen before?** Named as lead L1-1b in path 1 of the 2026-09-24 exploration, but not read there.
4. **Relates to:** dbt-agent-trust above. Both check answers against the real warehouse rather than the code.
5. **Takeaways for you:** "A green compile is not proof a Semantic Layer change works." He checked by deploying ("43 metrics discovered, query status SUCCESSFUL") and then querying a metric for real numbers.

**Leads:**
- **L4a** - Evaluating a data agent against your own project. Read about golden-question sets and layered result matching (dbt-agent-trust, Data Culture's dbt Summit 2026 talk). Add ADE-bench's advice to swap in your own tasks and a clone of your own database, its community task-generator plugin (#148), and Snowflake's evaluation datasets. Read for how a team builds an answer key and a grader from its own dbt project.
- **L4b** - What a person checks after an agent changes a dbt project. Read about Wizard's validation subagents and `--defer` runs, dbt tests and model contracts, data-diff review (Recce's dev-loop review, merged 2026-09-11), and the structural rules in dbt-project-evaluator. Read for which checks are automatic, which are human, and how teams wire them into CI.

## Angle 5 - Warehouse vendors' eval loops for data agents

This angle narrowed to Snowflake, the only vendor that published how its customers evaluate data agents during the window. Databricks' figures for Genie Code, its coding agent, date from March 2026 and are background. Snowflake's data-eng-bench was covered in the 2026-09-24 analytics-agents exploration.

### Eval-driven agent optimization with CoCo (Snowflake TechUp 2026 lab)
[link](https://github.com/sfc-gh-ebotwick/techup_26_eval_hol) · created 2026-08-04, last push 2026-09-23 · tutorial repository (Snowflake employee) · read in full (README) · search

1. **What it is about:** A hands-on lab in four steps. Build a baseline Cortex Agent (Snowflake's question-answering agent over a semantic view) and evaluate it in Snowsight, Snowflake's web interface, with LLM-judge metrics. Then CoCo, Snowflake's coding agent, reads the results and writes the agent's instructions as a new version, which is evaluated again.
2. **Why you're seeing it:** `warehouse-agentic`, `efficacy-methodology`.
3. **Seen before?** No. The earlier exploration covered CoCo's benchmark claims.
4. **Relates to:** Snowflake's [2026-08-21 release note](https://docs.snowflake.com/en/release-notes/2026/other/2026-08-21-cortex-agent-eval-version-targeting-ga), which made it generally available to point an evaluation at a specific agent version.
5. **Takeaways for you:** Every judge score shows "the criteria the metric used" and "the reason". One agent improves another, and the evaluation run is how the improvement is measured.

### Ship Snowflake Cortex Agents faster: a skills-first workflow with CoCo + TruLens
[link](https://www.phdata.io/blog/ship-snowflake-cortex-agents-faster-a-skills-first-workflow-with-cortex-code-trulens/) · 2026-08-31 · consultancy blog (phData) · read in full · search

1. **What it is about:** A Snowflake partner's workflow for evaluating Cortex Agents with TruLens, an open-source evaluation library. It uses tiered golden sets (40% foundational, 30% operational, 20% analytical, 10% adversarial), 17 custom metrics, LLM-judge scoring and auto-fail rules.
2. **Why you're seeing it:** `agent-efficacy`, `efficacy-methodology`.
3. **Seen before?** No.
4. **Relates to:** The lab above. CoCo skills such as `/agent-workflow evaluate` run the evaluation loop.
5. **Takeaways for you:** Each tier has its own correctness threshold, between 90% and 100%. Evaluation becomes a skill that the coding agent runs.

**Leads:**
- **L5a** - Evaluating data agents inside the warehouse. Read Snowflake's Cortex Agent evaluations (GA 2026-03-13, version targeting 2026-08-21, custom LLM-judge YAML), TruLens, Databricks' agent evaluation and its Quotient AI acquisition for Genie, and Google's BigQuery Agent Analytics SDK. Use each vendor's docs and release notes, and read for how a customer evaluates an agent in the warehouse and what the judge gets to see.
- **L5b** - Agents that write and run evals for other agents. Read CoCo's agent-workflow skills, LangChain's eval-engineering skill (2026-07-22, which interviews the user and emits Harbor tasks), Anthropic skill-creator's iterate-and-benchmark loop, and Databricks' plans for Quotient AI. Read for how the evaluate-then-rewrite loop is automated and where a person stays in it.

**Dropped, near misses:** Paradime's ADE-bench report carries a 2026-09-16 page date, but its run is dated 2026-04-01 and no later re-run is shown. Altimate's ADE-bench page is undated. Snowflake's 2026-08-21 CoCo post uses repeated-trial scoring but is framed around token spend. SkillsBench 1.1, SkillAudit and the "Evaluating Agentic Skills at Scale" paper all fall just before 2026-06-27.

**Searched for and not found:** a dbt Labs write-up of how Wizard is evaluated (only PR #154's links to private runs); any published results from `dbt-agent-skills` evals; a Spider 2.0-DBT development in the window; a Databricks or Google publication in the window on evaluating their data-engineering agents; an independent reproduction of any vendor's ADE-bench claim; a practitioner outside a vendor, in the window, evaluating a dbt agent on their own project that builds models (rather than answering questions); any change to Anthropic's skill-creator since 2026-04-20.
