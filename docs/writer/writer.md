# The writer mode

Turns the research this repository has already done into a long-form Substack
issue and the LinkedIn posts cut from it, synthesized across runs and built
around the author's own experience. It is the third mode beside the
read-react-remember loop ([`loop.md`](../reader/loop.md)) and auto breadth
([`auto-breadth.md`](../reader/auto-breadth.md)). It starts with
[`/post`](../../.claude/commands/post.md).

[`style.md`](style.md) is the state it reads and writes: audience, voice,
shape, evidence rules, per channel. A series file under
[`docs/writer/series/`](series/) is the state for one series: its premise,
its audience, its installments, and the threads a posted installment still
owes a return to. This file is the mechanic for both.

## Why a mode and not a role

The roles in `.claude/agents/` are the factory's. `/update-agents` deletes a
role there that the factory release does not carry, so a `writer` role would
be removed by the next release. Everything under `docs/` survives a release,
and so does a command the factory does not ship. The same reasoning put the
loop and auto breadth here.

## Where it runs

In a session. It needs no network: everything it reads is already in the
repository. No workflow, no runner minutes, no secrets. If writing ever needs
to run unattended, a label-started workflow on the auto-breadth pattern is the
route (ADR 0007); nothing here needs that yet.

## What it reads, in this order

1. [`style.md`](style.md), in full, as a constraint - both the shared
   sections and the channel section for each piece being written.
2. **The series file** the run is writing an installment for, in full: its
   premise, its audience, its installment list, and its open threads. Which
   file that is comes from the theme or from the author, never assumed - a
   run with only one series file in [`series/`](series/) still names it
   rather than reaching for it by default, so a second series is a
   configuration choice each time, not a fallback.
3. [`../reader/profile.md`](../reader/profile.md) - Interests, Not interested
   and Knowledge only - for what the author cares about and already knows.
4. **The syntheses.** For every exploration under
   [`docs/research/explore/`](../research/explore/): the index's whole-run
   synthesis and "How it fits together", then each path's "Where this path
   ends". For the briefs directly under `docs/research/`: each one's headline
   and recommendation. A run with no whole-run synthesis (the ones before
   #64) is read from its path endings.
5. **The articles**, only for the claims a draft will make, to get the
   original source link, its date and what exactly it said.

## What it may not do

- **Fetch anything.** A gap is named and becomes a proposed auto-breadth seed.
- **Write `profile.md`, the research files or `sources.md`.** It writes one
  Substack issue file and one file per cut LinkedIn post, and `style.md` and
  the series file only through the steps below that name them.
- **Publish.** Posting to Substack or LinkedIn is the author's act. A merged
  piece is a finished draft, not a published one.

## One interview, one issue, its cut posts

Three passes, because the research and the author each supply what the other
cannot. The research gives breadth and sources; the author gives the
experience that makes a piece worth reading. *The author's words, 2026-09-25:
"First start with the writer first pass, full on research synthesis. Then ask
me questions to fill in the blanks in order to fulfill my writing
requirements."*

One interview produces two kinds of file: **one Substack issue**, long-form,
and **2-3 LinkedIn posts cut from it** - each its own file, each naming its
series and installment number, each passing the trace check in step 7 on its
own rather than by reference to the issue it was cut from.

0. **Read** the files above, including the series file for this run.

1. **Theme.** Given one, take it. Given none, propose three, each in one
   line: the claim, and the runs it rests on. A theme must rest on **at least
   two runs** - cross-run synthesis is the point of the mode, and a piece
   from one run is that run's synthesis with a byline. Stop and let the
   author pick.

2. **First pass: the research draft.** State the claim in one sentence, name
   the runs behind it, and write the Substack issue from the research alone.
   Show it to the author as a starting point, not as a finished issue. It is
   expected to sound like a literature review.

3. **Second pass: the interview.** Compare the draft with `style.md` and ask
   the author at most five questions, aimed at what only they can supply:
   - what they believed or saw before;
   - the moment the subject touched their own work, told without employer
     internals;
   - what took longest to understand, and whether it has clicked yet;
   - what they would tell a friend making the same move;
   - anything in the draft they do not believe.

   Also read the author's own words in `profile.md` reactions and in commit
   messages. They are a record of what the author found hard.

4. **Third pass: the rewrite.** Rebuild the Substack issue around the
   answers. The author's experience is the spine and the research answers it.
   Cut every point the answers do not support. Keep only the three to five
   sources that carry the argument. **The issue must pick up at least one
   open thread from the series file's last posted installment, or say
   explicitly that it is dropping that thread, and it must end by naming what
   comes next** - the series file's open-threads list is what makes both of
   those checkable rather than a matter of the writer's memory.

5. **Write the Substack issue** at `docs/posts/<date>-<slug>.md` with this
   front matter, then the issue, then a `## First comment` section holding
   the sources and the reading date:

   ```yaml
   title: <the claim>
   date: <YYYY-MM-DD>
   status: draft        # draft -> ready -> posted
   series: docs/writer/series/<slug>.md
   installment: unclaimed   # set to the next number only at status: posted
   runs:                # every exploration or brief the piece draws on
     - docs/research/explore/<folder>/
   ```

6. **Cut 2-3 LinkedIn posts from the issue**, each its own file at
   `docs/posts/<date>-<slug>-linkedin-<n>.md`, with the same front matter
   shape (`series`, `installment: unclaimed`, its own `runs` subset) plus
   `channel: linkedin`. A cut post is not a link to the issue; it stands on
   its own against every rule `style.md`'s LinkedIn section sets - the first
   two lines carry the point, no links in the body, sources in a first
   comment, length inside the feed-post range - because a cut post that only
   reads correctly after the issue has failed.

7. **Trace check, per piece.** For the issue and for each cut post
   separately: list every factual claim with its source and the research
   file that carried it. A claim with no line in the research comes out. The
   author's own experience is marked as theirs and needs no source. Each
   piece's table goes in the pull request body under its own heading. Then
   check the lengths `style.md` sets for that piece's channel.

8. **Hand it back.** Open or update the pull request and read the issue and
   each cut post back in full in the session.

9. **One sentence back, split in two.** A reaction about **one piece**
   revises that draft on the same branch. A reaction about **pieces of that
   channel in general** becomes a line in `style.md`'s section for that
   channel: show the diff, commit it on a yes, and put the reaction's own
   words in the commit message. A reaction about the series itself - a
   thread to add, drop, or resolve - is a diff to the series file, shown and
   committed the same way. One reaction can be more than one of these.

10. **Merge when the author says a piece is ready**, with `status: ready`.
    Standing merge instructions for research do not cover posts: a post is
    the author's public voice. When the author says it is live, set
    `status: posted` on that piece, add `url:` with its published link, and
    only then - never before - **replace `installment: unclaimed` with the
    next number the series file has not yet used, and add the corresponding
    row to that series file's installments list.** A piece abandoned or left
    at `draft` or `ready` never claims a number and never appears in that
    list; the series only advances on what actually posted.
