---
title: Grading the agent is the job that transfers
date: 2026-09-26
status: draft
series: docs/writer/series/learning-in-public-ds-to-de.md
installment: unclaimed
runs:
  - docs/research/explore/2026-09-24-what-a-product-data-scientist-moving-into-data-engineering-s/
  - docs/research/explore/2026-09-25-dbt-evals-one-level-deeper-how-agents-doing-dbt-work-are-eva/
---

At Meta, I've watched AI write SQL almost perfectly. Our cross-functional
partners still couldn't use its output without sending it to a data
scientist for query review - not because the SQL was usually wrong, but
because nobody could tell, from the query alone, whether it was.

I went looking this round for how the rest of the industry checks an
agent's data work, half-expecting a new discipline I'd have to learn from
nothing. It isn't new. Every major vendor now ships a coding agent for data
engineers - Snowflake's CoCo, Databricks' Genie Code, Google's engineer
agent in BigQuery, dbt's Wizard - and every one of them moves the job the
same direction: the agent writes the pipeline, and the person specifies it,
reviews it, and supplies the context the agent works from. What's still
scarce, every source agreed, is the same thing that was scarce before
agents showed up: knowing what a row means, and when a right-looking number
is wrong. That part I already have reps in.

Checking the checker turned out to be less settled. All three paths I
followed into how dbt work gets graded landed on the same rule
independently: something you can read beats something you have to believe.
dbt's own tests, a row comparison, a query that re-runs - those grade the
work. An LLM judge shows up only once nothing deterministic is left to
check, and dbt Labs' own context-engineering package says why in one line:
a judge is "a paid opinion, not a reliable test." One study that measured
judges specifically on data-engineering tasks found they inflated a process
score from 22 to about 75 once they could no longer see what the agent
actually ran.

The graders themselves are younger, and shakier, than I expected. This
quarter an outside contributor filed eight defects against Spider 2.0-DBT's
answer keys in a single day - one task's gold database turned out not to
exist, so "every submission scores 0" - and someone else filed six against
DataAgentBench's. Neither project has replied yet. The comparison rule
alone can swing a score: one project reported 58.1% under a strict rule and
69.8% under a lenient one, on the same 43 questions, same run. A benchmark
number is exactly what I already knew a metric to be: a definition, before
it's a value.

For grading an agent against your own project rather than a published
leaderboard, the recipe splits in two, and neither half is exotic. For an
agent that answers questions: mine a log - agent traces, or better, the
warehouse's own query history - draft the cases, have someone who knows the
domain sign off the expected answer, and change one thing per run. For an
agent that changes a model: break something real on purpose, hide the
answer from the agent, and grade on the output data rather than the code.
The part I hadn't expected: a toolkit called dex now runs mutation testing
against the dbt tests themselves - flipping a join, dropping a filter - to
check whether your tests would have caught the mistake at all. A grader is
only as strong as what it's built on, and "the tests would catch this"
turns out to be its own thing worth verifying.

What's still open for me: I don't yet have a felt sense of how long "sign
off a golden set" or "audit an answer key" actually takes against a real
project. Nothing I read this round put a number on it, and I don't have my
own experience to put one on it either.
[author's own experience - TBD, needs a real interview]

So what comes next isn't a new plan - it's the second half of the one I
already named: a small stack of my own, a toy website, event logging,
synthetic users, dbt, and a data agent on top. Part of that was always to
find out whether writing the context down removes the query review. Now
it's also to build a golden set against it the way this round describes -
mine my own event log, hand-check the first batch of answers, then break a
model on purpose and see whether my dbt tests notice.

This is the series' first installment. There's no earlier posted piece and
no open thread on record yet to pick up or drop, so I'm saying that plainly
rather than inventing one to close on.

The reading was done by an agentic research system I built. It explores a
topic breadth first, follows the best leads down, and writes a synthesis at
every level; I directed which threads to follow and wrote the above from
what it found. Sources and the repo are in the first comment.

## First comment

Sources, reading as of 2026-09-26:
- Snowflake, CoCo for data engineers: https://www.snowflake.com/en/blog/snowflake-coco-data-engineering/
- Databricks, release notes, August 2026: https://docs.databricks.com/aws/en/release-notes/product/2026/august
- Google, BigQuery release notes: https://docs.cloud.google.com/bigquery/docs/release-notes
- dbt, Wizard overview: https://docs.getdbt.com/docs/platform/wizard-overview
- dbt Labs, dbt_context_engineering: https://docs.getdbt.com/blog/dbt-context-engineering
- DataClawEval: https://arxiv.org/html/2607.28033v1
- Spider 2.0-DBT answer-key audit, issue #224: https://github.com/xlang-ai/Spider2/issues/224
- DataAgentBench golden-answer disputes, issue #98: https://github.com/ucbepic/DataAgentBench/issues/98
- nl2sql, lenient-accuracy pull request #152: https://github.com/nadeem4/nl2sql/pull/152
- analytics-evals, mining golden questions from query history: https://github.com/PaddyCH96/analytics-evals
- dex, mutation coverage for dbt model tests, pull request #467: https://github.com/exmergo/dex/pull/467

The research system, open source: https://github.com/chamaya00/background-research-agents
