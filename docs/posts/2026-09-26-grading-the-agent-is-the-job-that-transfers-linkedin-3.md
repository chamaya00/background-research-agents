---
title: Break it on purpose. Then check whether your tests notice.
date: 2026-09-26
status: draft
series: docs/writer/series/learning-in-public-ds-to-de.md
installment: unclaimed
channel: linkedin
cut_from: docs/posts/2026-09-26-grading-the-agent-is-the-job-that-transfers.md
runs:
  - docs/research/explore/2026-09-25-dbt-evals-one-level-deeper-how-agents-doing-dbt-work-are-eva/
  - docs/research/explore/2026-09-24-what-a-product-data-scientist-moving-into-data-engineering-s/
---

You don't need a published benchmark to know if a data agent is any good
on your own project. You need to break something on purpose and see if
anything notices.

That's the recipe I found this round for grading an agent against your
own dbt project, and it splits cleanly in two.

For an agent that answers questions: mine a log - agent traces, or better,
the warehouse's own query history, which shows what analysts actually
asked rather than only what people typed at a bot. Draft the cases from
that, have someone who knows the domain sign off each expected answer, pin
the dates so answers don't drift, and change one thing per run so you know
what moved the number.

For an agent that changes a dbt model, the recipe is different: break
something real on purpose, hide the answer from the agent, and grade on
the output data rather than the code it wrote.

The part that surprised me: a toolkit called dex now runs mutation testing
against the dbt tests themselves. It flips a join, drops a filter, swaps a
SUM for a MAX, then runs your existing tests against the broken model. If
nothing goes red, you've learned something worse than "the agent has a
bug" - you've learned your tests wouldn't have caught a human making the
same mistake either.

That's the part that lands for me. A grader built from dbt tests is only
as strong as those tests, and "would my tests even catch this" isn't a
question I'd thought to ask before I started reading agentic pipelines
work this way.

I don't yet know how this feels on a real project - whether planting bugs
on purpose turns up problems I'd expect, or ones I wouldn't have thought
to test for at all.
[author's own experience - TBD, needs a real interview]

So that's next, literally: I'm building a small stack of my own - a toy
website, event logging, synthetic users, dbt, and a data agent on top -
partly to mine my own query history for golden questions, and partly to
break a model on purpose and watch whether my own dbt tests notice.

This was researched by an agentic system I built and directed - it reads
breadth first, follows the best leads down, and I wrote this from what it
found. Sources and the repo are in the first comment.

## First comment

Sources, reading as of 2026-09-26:
- analytics-evals, mining golden questions from query history: https://github.com/PaddyCH96/analytics-evals
- dex, mutation coverage for dbt model tests, pull request #467: https://github.com/exmergo/dex/pull/467

The research system, open source: https://github.com/chamaya00/background-research-agents
