# How agents doing dbt work are evaluated, one level deeper

Seed: dbt evals, one level deeper - how agents doing dbt work are evaluated (dbt's eval harnesses, benchmarks, skill evals), for a product data scientist moving into data engineering · mode: learning · 2026-09-25 · produced in auto-breadth mode, in GitHub Actions (width 5, paths 3, depth 2; all three paths reached level 2 on both branches)

## Synthesis

Every agent eval is a metric, and the questions that decide whether a metric means anything also decide whether an agent's score does. The run followed three leads down from the breadth pass: how public benchmarks grade, when a skill's measured lift can be trusted, and how a team evaluates an agent on its own project. All three landed on that point independently.

The graders people trust are deterministic. dbt tests, row comparisons and queries that re-run grade the work. LLM judges appear only as a fallback. The one study that measured judges on data-engineering tasks found they inflated process scores from 22 to about 75, and dbt Labs' new context package calls a judge "a paid opinion, not a reliable test". Deterministic does not mean right, though. A pass rests on three parts that fail separately: the answer key, the rule that compares output with it, and any checks written on top. This quarter outsiders filed eight defects against Spider 2.0-DBT's answer keys and six against DataAgentBench's, none answered yet. They also showed the same output scoring 58% or 70% depending on the comparison rule (path 1).

dbt's own harnesses are early. Its skill-eval runs each task with and without a skill, which is the right design, but once per arm, graded by an LLM, with no results published. The wider skill-eval writing explains why that matters. Controls differ, a net lift hides tasks lost as well as gained, and rewording a prompt moves scores more than rerunning it. The task set decides which population the lift describes (path 2). Read any dbt skill delta as directional.

On your own project, the recipe for agents that answer questions is settled and familiar. Mine a log, let a machine draft cases, have an expert sign off each answer, pin the dates, and change one thing per run. For agents that build models it is younger: break something real, hide the key and grade on output data. Then check that the dbt tests doing the grading would catch a mistake at all, which is what mutation testing now does (path 3).

The so what: evaluating agents is where your experimentation training transfers most directly into data engineering. The whole debate is about unit of analysis, repeats, sampling frame, metric definition and known-issues logs. What is new to you is the machinery underneath: dbt tests, contracts, CI and lineage. The one gap no source fills sits in that machinery. Nothing ties a golden answer to the dbt model it depends on, so a model change cannot flag which answers went stale.

## The map

**Breadth** ([0-breadth.md](0-breadth.md))
- [skill-eval (dbt-agent-skills)](https://github.com/dbt-labs/dbt-agent-skills/tree/main/evals) - dbt's with/without skill harness
- [ADE-bench PR #154](https://github.com/dbt-labs/ade-bench/pull/154) - ADE-bench used to pick Wizard's engine
- [ADE-bench issue #155](https://github.com/dbt-labs/ade-bench/issues/155) - grade the project, not just rows
- [ELT-Bench multi-warehouse](https://github.com/uiuc-kang-lab/ELT-Bench/commit/661c8ea) - Databricks, Redshift; now an RL target
- [DataClawEval](https://arxiv.org/html/2607.28033v1) - judges inflate; rules irreplaceable
- [Google Agent Skills testing](https://cloud.google.com/blog/topics/developers-practitioners/behind-the-scenes-how-we-build-test-and-scale-google-agent-skills) - weekly with/without re-runs
- [NVIDIA SkillEvaluator](https://developer.nvidia.com/blog/evaluating-ai-agent-skill-performance-with-nvidia-skillevaluator/) - "Skill Lift" across 300+ skills
- [SkillEval](https://arxiv.org/html/2608.06891v1) - scoring a skill without running it
- [dbt-agent-trust](https://github.com/datacult/dbt-agent-trust) - golden questions, layered matching
- [Fivetran on dbt Wizard](https://www.fivetran.com/blog/dbt-wizard-an-ai-agent-that-actually-understands-your-dbt-project) - one side-by-side with Claude Code
- [No babysitting, not today](https://docs.getdbt.com/blog/wizard-use-cases) - a green compile is not proof
- [CoCo eval lab (TechUp)](https://github.com/sfc-gh-ebotwick/techup_26_eval_hol) - one agent tunes another
- [phData CoCo + TruLens](https://www.phdata.io/blog/ship-snowflake-cortex-agents-faster-a-skills-first-workflow-with-cortex-code-trulens/) - tiered golden sets

**Path 1 - what data-engineering benchmarks grade, and what they miss** ([file](path-1-benchmark-graders.md))
- [data-eng-bench's hidden tests](https://www.snowflake.com/en/blog/engineering/data-eng-bench-data-engineering-agent-benchmark/) - rules you can read
- [The gold SQL is wrong (Hochman)](https://dev.to/omer_hochman/your-text-to-sql-model-isnt-as-wrong-as-your-benchmark-says-the-gold-sql-is-p16) - sort losses first
- [ModularSQL](https://arxiv.org/html/2609.29573) - set comparison forgives duplicates
- [Answer key first (Misata)](https://dev.to/rasinmuhammed/half-the-answer-keys-in-text-to-sql-benchmarks-are-wrong-so-i-generated-the-database-from-the-3431) - generate data from the key
- [Ground-truth-as-code (Adobe)](https://arxiv.org/abs/2609.16487) - re-run gold at grading time
- [Spider 2.0-DBT issues #223-#230](https://github.com/xlang-ai/Spider2/issues/224) - eight broken keys, no reply
- [DataAgentBench disputes](https://github.com/ucbepic/DataAgentBench/issues/98) - gold with a dropping join
- [data-eng-bench PR #7](https://github.com/Snowflake-Labs/data-eng-bench/pull/7) - hiding a public key
- [Benchmarking the Benchmarks](https://arxiv.org/html/2607.02577) - graders wrong on 18.5%
- [WorkSurface-Bench](https://arxiv.org/html/2607.25765) - gold that must re-run
- [Spider2 #226](https://github.com/xlang-ai/Spider2/issues/226) - column-wise match forgives wrong joins
- [AttestQL](https://github.com/ivermin1123/attestql) - typed replay of BIRD
- [NeMo Gym #3357](https://github.com/NVIDIA-NeMo/Gym/issues/3357) - comparison modes as reward
- [DataSpace](https://arxiv.org/html/2608.03451) - the strict mirror image
- [nl2sql PR #152](https://github.com/nadeem4/nl2sql/pull/152) - 58% strict, 70% lenient

**Path 2 - when a skill's measured lift can be trusted** ([file](path-2-skill-lift.md))
- [ACES](https://arxiv.org/html/2608.20614) - the only interval, clustered cases
- [Agent Skills Can Be Harmful](https://arxiv.org/html/2608.11888v1) - a matched-skill control
- [skill-eval-harness](https://github.com/adewale/skill-eval-harness) - paired test, holdout split
- [Are Cloud Skills Adequately Tested?](https://arxiv.org/html/2607.22015) - coverage gate first
- [The Regression Tax](https://arxiv.org/html/2607.22520v1) - gains versus regressions
- [SkillApt](https://arxiv.org/html/2609.26863) - per-task effects
- [DeepSWE](https://arxiv.org/html/2607.07946) - reruns miss task sampling
- [Thinkingbox](https://arxiv.org/html/2608.19741) - pass^20, task-cluster bootstrap
- [Noise Floor Audit](https://arxiv.org/html/2608.22331) - rewording beats reruns
- [LangChain eval engineering](https://www.langchain.com/blog/towards-automating-eval-engineering) - agent drafts, person approves
- [Arize: evals from traces](https://arize.com/resources/agent-evals-from-traces/) - sampling, base rates
- [SKT](https://arxiv.org/html/2608.02287) - tasks built to need the skill
- [ImpossibleRubrics](https://arxiv.org/html/2609.16816) - rubrics specific about the wrong things
- [Adobe test set (full text)](https://arxiv.org/pdf/2609.16487) - decoys; self-criteria anti-correlated

**Path 3 - evaluating a data agent against your own dbt project** ([file](path-3-own-project-evals.md))
- [Golden question guide (dbt-agent-trust)](https://github.com/datacult/dbt-agent-trust/blob/main/docs/golden_question_guide.md) - writing the key
- [Making Agents Evaluable](https://www.datacult.com/post/building-the-agent-layer-behind-a-governed-data-agent) - log fields for diagnosis
- [Evaluating Cortex Agents](https://www.snowflake.com/en/developers/guides/best-practices-for-evaluating-cortex-agents/) - 100% means too easy
- [dbt_context_engineering](https://docs.getdbt.com/blog/dbt-context-engineering) - grader as dbt tests
- [Omni AI Evals](https://omni.co/blog/run-your-agent-like-a-data-product-with-ai-evals) - branch-compare question sets
- [Self-improving agents with CoCo](https://www.snowflake.com/en/developers/guides/self-improving-agents-with-cortex-code/) - traces to frozen dataset
- [Hex scheduled eval suites](https://learn.hex.tech/changelog/2026-09-15) - bootstrap from Threads
- [analytics-evals](https://github.com/PaddyCH96/analytics-evals) - questions from query history
- [Stale golden datasets (OneUptime)](https://oneuptime.com/blog/post/2026-08-31-maintain-stale-llm-golden-dataset/view) - a maintenance cycle
- [how-much-do-you-bench](https://github.com/datamindedacademy/how-much-do-you-bench) - private tasks, data volume
- [SiriusDeliver (Tencent)](https://arxiv.org/html/2608.09185) - 200 real change requests
- [dex PR #467](https://github.com/exmergo/dex/pull/467) - mutation-testing dbt tests
- [Altimate dbt PR Review](https://help.altimate.ai/code/usage/dbt-pr-review/) - only rules can block
- [Recce devloop (PR #44)](https://github.com/DataRecce/recce-claude-plugin/pull/44) - data diff before the PR

## How it fits together

- **All three paths landed on rules first, a judge for the rest.** Path 1's validity audit lets a judge score only what deterministic checks leave. Path 3's Altimate clamps LLM findings to warnings. The breadth pass's DataClawEval measured why.
- **Paths 1 and 2 met at one paper.** Adobe's ground-truth-as-code (arXiv 2609.16487) was read as a grader in path 1 and as a test-set design in path 2.
- **ADE-bench, dbt's own benchmark, was quiet.** Its main branch has had no commits since 2026-05-28, and its disputed answer keys (#146, #151) are unanswered, while outsiders audited other benchmarks' keys.
- **This extends what you have.** #35's Spider and BIRD now appear at the grader level. The 2026-09-24 methodology exploration's benchmark-flaw path continues into data. The data-engineering exploration's skills path moves from writing skills to testing them.

**Two leads not followed that you might have picked:** dbt Labs' own harnesses from the inside (breadth L1a; most of its sources were already read in the breadth pass), and in-warehouse eval features at Snowflake, Databricks and Google (breadth L5a).

## Candidate topics

Proposals only. None of these is in the profile.

- `benchmark-grading` · Depth, under `benchmarks-depth`: how data and dbt benchmarks build, compare and repair their answer keys, and what their pass rules forgive. *From path 1.*
- `skill-lift-design` · Depth, under `efficacy-methodology`: with-and-without skill experiments, covering control arms, repeats, units and how test cases are drawn. *From path 2.*
- `own-project-evals` · Depth, under `agent-efficacy`: building golden sets and graders from your own dbt project, for agents that answer questions and agents that change models. *From path 3.*
