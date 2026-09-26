---
title: The grader you can trust is one you can read
date: 2026-09-26
status: draft
series: docs/writer/series/learning-in-public-ds-to-de.md
installment: unclaimed
channel: linkedin
cut_from: docs/posts/2026-09-26-grading-the-agent-is-the-job-that-transfers.md
runs:
  - docs/research/explore/2026-09-25-dbt-evals-one-level-deeper-how-agents-doing-dbt-work-are-eva/
---

The grader you trust is the one you can read, not the one you have to
believe.

At Meta, I've watched AI write SQL almost perfectly. Our partners still
couldn't use the output without sending it to a data scientist for query
review - not because it was usually wrong, but because nobody could tell,
from the query alone, whether it was.

That's the same question one level up: who checks the agent, and how do
you trust the checker?

I went looking this round at how data teams grade agents doing dbt work,
and three separate paths into it landed on the same rule independently.
Something you can read beats something you have to believe. dbt's own
tests, a row-by-row comparison, a query that re-runs against fresh data -
those grade the work directly. An LLM judge shows up only once nothing
deterministic is left to check.

dbt Labs' own context-engineering package says why, in one line I didn't
expect a vendor to write: an LLM judge is "a paid opinion, not a reliable
test."

One study went further and measured it. On data-engineering tasks
specifically, judges inflated a process score from 22 to about 75 once
they could no longer see what the agent actually ran underneath the
answer. The gap wasn't the judge being lenient. It was the judge grading
the story instead of the work.

What clicks for me here is that this isn't a new skill to learn from
scratch. It's the same question I already ask about a metric: is this
number measuring what it claims to, or does it just look plausible? I
have years of reps asking that about dashboards. I have none yet asking
it about a benchmark someone else built for an agent.

What I still don't have a feel for: how much of a real dbt project's
checks can actually be deterministic before you're forced into a judge
anyway, and where that line sits in practice.
[author's own experience - TBD, needs a real interview]

Next for me: building my own small project - synthetic users, dbt, a data
agent on top - specifically so I can find out where that line falls
firsthand instead of taking a vendor's word for it.

This was researched by an agentic system I built and directed - it reads
breadth first, follows the best leads down, and I wrote this from what it
found. Sources and the repo are in the first comment.

## First comment

Sources, reading as of 2026-09-26:
- dbt Labs, dbt_context_engineering: https://docs.getdbt.com/blog/dbt-context-engineering
- DataClawEval: https://arxiv.org/html/2607.28033v1

The research system, open source: https://github.com/chamaya00/background-research-agents

