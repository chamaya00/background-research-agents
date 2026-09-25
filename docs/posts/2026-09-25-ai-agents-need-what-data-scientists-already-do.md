---
title: The hardest work around AI data agents is work product data scientists already do
date: 2026-09-25
status: draft
runs:
  - docs/research/explore/2026-09-25-the-dbt-semantic-layer-one-level-deeper-what-it-is-how-metri/
  - docs/research/explore/2026-09-25-dbt-evals-one-level-deeper-how-agents-doing-dbt-work-are-eva/
  - docs/research/explore/2026-09-25-databricks-agentic-ai-offerings-what-they-are-where-each-sit/
---

# The hardest work around AI data agents is work product data scientists already do

*Reading as of 2026-09-25.*

I'm a product data scientist moving into data engineering. I expected the reading to tell me that AI agents make my old skills less relevant. After three research runs, on dbt's Semantic Layer, on how agents doing dbt work get evaluated, and on Databricks' agent offerings, I think the opposite. The scarce work around data agents is defining metrics, designing experiments and proving that nothing changed. What's new to me is the engineering scaffolding around those skills.

## Agents are only as good as the metric definitions they read

A semantic layer is where a company writes down, in code, what each metric means, so that every dashboard and every agent computes "revenue" the same way. Agents are why it suddenly matters.

Ian Macomber, who leads data at Ramp, [argues](https://www.iandmacomber.com/blog/post-ai-data-stack/) that every agent should start "from the data scientist's representation of what's true, what matters, and why." dbt Labs, a vendor, [describes the analytics engineer](https://www.getdbt.com/blog/from-analytics-engineer-to-context-engineer) becoming a "context engineer" who decides "exactly what each agent is allowed to see." A [CIO opinion piece](https://www.cio.com/article/4204033/the-missing-role-in-every-enterprise-ai-strategy-the-analytics-engineer.html) gives the job to the analytics engineer instead. The sources disagree about who owns the definitions. None of them says the job is going away.

Some platforms try to learn definitions from usage. Databricks' Genie Ontology ranks candidate definitions by signals such as usage and who created them. Atlan, which sells a competing catalog, [points out](https://atlan.com/know/ai-agent/databricks/genie-ontology/) that a usage signal can favour the popular definition over the correct one. Typedef [put it most plainly](https://www.typedef.ai/blog/what-is-genie-ontology-databricks-continuously-learned-context-layer-explained): "Ranking the most trusted definition of a metric is not the same as checking whether the number an agent computes from it is correct."

Anyone who has watched two teams report different numbers for the same product metric knows that problem. The fix is also familiar: a named owner and a definition someone has argued over. One detail made it concrete for me. Hex's docs say its [sync from dbt](https://learn.hex.tech/docs/connect-to-data/semantic-models/semantic-model-sync/dbt-metricflow) does not support conversion metrics, so a funnel defined in dbt never reaches Hex's agent. That's the kind of gap I'd want to know about before trusting an agent's funnel number.

## Evaluating an agent is designing an experiment

An eval is a repeatable test of whether an agent does a task well. Reading how people evaluate agents on data work felt like reading experiment reviews.

**Control arms.** dbt Labs' own [skill-eval](https://github.com/dbt-labs/dbt-agent-skills/tree/main/evals) runs the same dbt task with no skill, with a skill, and with a skill plus an outside tool: a treatment and control design. Its results folder in the public repository is empty, so there's nothing to read the lift from yet.

**Where the variance comes from.** A [noise-floor audit](https://arxiv.org/html/2608.22331) of 150 tool-calling tasks found that rerunning the same prompt flipped only 0.7-2.7% of outcomes. Rewording prompts without changing their meaning produced paired standard deviations 11 to 58 times larger. Their advice is to spend your budget on more prompts and tasks rather than reruns. That's a sampling-frame argument.

**The metric definition.** A small open-source project [reported](https://github.com/nadeem4/nl2sql/pull/152) its accuracy as 58% under a strict comparison rule and 70% under a lenient one, on the same outputs. How a grader compares an answer with the key is a metric definition, and it moves the headline.

**Who grades.** [DataClawEval](https://arxiv.org/html/2607.28033v1), a research benchmark built on Tencent production pipelines, found that LLM judges inflated process scores from 22.2 to about 75 against its rule-based grader. Its authors conclude "Rule-based grading is irreplaceable." dbt Labs' new [context-engineering package](https://docs.getdbt.com/blog/dbt-context-engineering) calls an LLM judge "a paid opinion, not a reliable test."

**The answer key can be wrong.** In one day this September, an outside contributor [filed eight defects](https://github.com/xlang-ai/Spider2/issues/224) against the dbt track of Spider 2.0, a well-known benchmark. In one task the reference database was identical to the starting files, so every submission scored zero. None of the eight had a reply when the research ran.

## Proving nothing changed is an A/A test on tables

When an agent migrates or rewrites a pipeline, someone has to show the new tables match the old ones. Databricks' own [docs for migrating dbt projects with Genie Code](https://docs.databricks.com/aws/en/ldp/de-agent) say to "run the pipeline to confirm the results match." A [community migration guide](https://community.databricks.com/t5/community-articles/stop-translating-alteryx-boxes-a-lakebridge-assisted-test-driven/td-p/163424) runs old and new side by side and compares aggregates, advising "business behavior, not the visual shape of the canvas." Databricks' open-source [Lakebridge](https://github.com/databrickslabs/lakebridge/releases/tag/v0.15.0) toolkit now explains why rows fail to match. To me, that's an A/A test with tables as the unit.

The same goes for tests. The open-source toolkit dex [added mutation testing](https://github.com/exmergo/dex/pull/467) for dbt models. It plants bugs, such as a swapped join or a flipped comparison, and reports whether your tests catch them. That's a power check: a grader built from dbt tests is only as strong as those tests. Altimate's [pull-request reviewer](https://help.altimate.ai/code/usage/dbt-pr-review/) lets only deterministic checks block a merge; its LLM findings are "clamped to ≤ warning."

## What I'd do next

- **Learn the metric YAML.** Open-source [dbt Core 1.12](https://github.com/dbt-labs/dbt-core/releases/tag/v1.12.0) reads dbt's new semantic-layer spec, so you can practise without a paid account.
- **Write up an eval like an experiment.** Name the control arm, the unit, the repeats and what the grader forgives, before looking at any score.
- **Put your effort into the scaffolding.** Git, CI, data diffs and dbt tests are the parts that are genuinely new. The judgment they carry isn't.

## How this was made

I built a research system with Claude Code on GitHub. I give it a seed topic. It surveys five angles, follows the three best leads two levels down, and writes a synthesis at every level, running about ten research agents unattended in GitHub Actions. It reads a profile of what I know and care about, which I update by reacting to each run in a sentence. A writer mode drafted this post from three runs' syntheses, and I chose the seeds and edited it. One limit: it reports what was published and doesn't audit vendors' claims. [The repository is public.](https://github.com/chamaya00/background-research-agents)

## Feed post

I expected AI agents to make my product data science skills less relevant as I move into data engineering.

After three research runs, I think the opposite.

The hardest work around data agents turned out to be three things product data scientists already do:

1. Defining metrics. Agents are only as good as the definitions they read. Ranking a definition by popularity isn't the same as checking it.

2. Designing experiments. Evaluating an agent means control arms, sampling and a metric definition. One project's accuracy was 58% or 70% depending only on the comparison rule.

3. Proving nothing changed. Checking that a migrated pipeline matches the old one is an A/A test on tables.

What's genuinely new to me is the scaffolding: Git, CI, data diffs and dbt tests.

I didn't do this reading alone. I built an agentic research system that explores a topic breadth first, follows the best leads down and writes a synthesis at every level. The article covers what it found and how it works.

[link to article]
