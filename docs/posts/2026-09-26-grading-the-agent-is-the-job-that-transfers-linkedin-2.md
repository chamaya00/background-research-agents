---
title: Nobody's fixed the answer key yet
date: 2026-09-26
status: draft
series: docs/writer/series/learning-in-public-ds-to-de.md
installment: unclaimed
channel: linkedin
cut_from: docs/posts/2026-09-26-grading-the-agent-is-the-job-that-transfers.md
runs:
  - docs/research/explore/2026-09-25-dbt-evals-one-level-deeper-how-agents-doing-dbt-work-are-eva/
---

A benchmark score is only as good as its answer key. This quarter, two of
the ones people cite for data agents have answer keys nobody has fixed
yet.

After 8 years inside one company's data stack, I wanted to know how much
of the "is this agent actually good" problem the rest of the industry has
already solved. Benchmarks felt like the obvious place to look - a
published number, no ambiguity.

Then I read how those numbers get made.

An outside contributor filed eight separate defects against Spider
2.0-DBT's answer keys, in a single day. One task's gold database turned
out to be byte-identical to the files the agent starts with - the tables
it's supposed to be graded on don't exist, so, in the reporter's words,
"every submission scores 0." Three other tasks point at gold files that
were never shipped under those names.

Someone else filed six disputes against DataAgentBench's golden answers in
five days. One gold answer groups a medical question by the wrong code
entirely - every public submission scored 0 on it.

Neither project has replied to any of these yet.

And even when the key is right, the rule that compares an agent's output
against it isn't fixed either. One project reported the same run scoring
58.1% under a strict comparison rule and 69.8% under a lenient one - on
the same 43 questions. Nearly 12 points of "accuracy," gone, from
switching which output shapes the rule forgives.

The click for me: a benchmark score isn't a fact about the agent. It's a
metric, with a definition behind it, exactly like the metrics I've spent
years defining and defending in product analytics. I'd ask what a metric
counts and doesn't before I trusted it. I hadn't thought to ask the same
of a leaderboard.

What I don't have yet: hands-on experience filing or fixing one of these
disputes myself, so I can't say from the inside how long a maintainer
actually takes to respond, or what makes one get fixed and another sit
open.
[author's own experience - TBD, needs a real interview]

Before I trust a data-agent benchmark's number again, I'm reading its
issue tracker first - the same way I'd read a metric's known-issues log
before shipping a dashboard off it.

This was researched by an agentic system I built and directed - it reads
breadth first, follows the best leads down, and I wrote this from what it
found. Sources and the repo are in the first comment.

## First comment

Sources, reading as of 2026-09-26:
- Spider 2.0-DBT answer-key audit, issue #224: https://github.com/xlang-ai/Spider2/issues/224
- DataAgentBench golden-answer disputes, issue #98: https://github.com/ucbepic/DataAgentBench/issues/98
- nl2sql, lenient-accuracy pull request #152: https://github.com/nadeem4/nl2sql/pull/152

The research system, open source: https://github.com/chamaya00/background-research-agents
