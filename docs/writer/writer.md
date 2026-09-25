# The writer mode

Turns the research this repository has already done into posts: a LinkedIn
article and the feed post that shares it, synthesized across runs. It is the
third mode beside the read-react-remember loop ([`loop.md`](../reader/loop.md))
and auto breadth ([`auto-breadth.md`](../reader/auto-breadth.md)). It starts
with [`/post`](../../.claude/commands/post.md).

[`style.md`](style.md) is the state it reads and writes: audience, voice,
shape, evidence rules. This file is the mechanic.

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

1. [`style.md`](style.md), in full, as a constraint.
2. [`../reader/profile.md`](../reader/profile.md) - Interests, Not interested
   and Knowledge only - for what the author cares about and already knows.
3. **The syntheses.** For every exploration under
   [`docs/research/explore/`](../research/explore/): the index's whole-run
   synthesis and "How it fits together", then each path's "Where this path
   ends". For the briefs directly under `docs/research/`: each one's headline
   and recommendation. A run with no whole-run synthesis (the ones before
   #64) is read from its path endings.
4. **The articles**, only for the claims a draft will make, to get the
   original source link, its date and what exactly it said.

## What it may not do

- **Fetch anything.** A gap is named and becomes a proposed auto-breadth seed.
- **Write `profile.md`, the research files or `sources.md`.** It writes one
  post file per post, and `style.md` only through step 6.
- **Publish.** Posting to LinkedIn is the author's act. A merged post is a
  finished draft, not a published one.

## One post

0. **Read** the files above.

1. **Theme.** Given one, take it. Given none, propose three, each in one
   line: the claim, and the runs it rests on. A theme must rest on **at least
   two runs** - cross-run synthesis is the point of the mode, and a post from
   one run is that run's synthesis with a byline. Stop and let the author
   pick.

2. **The claim, then the draft.** State the post's claim in one sentence and
   name the runs behind it, then write both pieces without waiting. The author
   reacts to a draft faster than to an outline.

3. **Write** `docs/posts/<date>-<slug>.md` with this front matter, then the
   article, then the feed post under a `## Feed post` heading:

   ```yaml
   title: <the claim>
   date: <YYYY-MM-DD>
   status: draft        # draft -> ready -> posted
   runs:                # every exploration or brief the post draws on
     - docs/research/explore/<folder>/
   ```

4. **Trace check.** List every factual claim in the article with the source it
   links to and the research file that carried it. A claim with no line in
   the research comes out. That table is process evidence, so it goes in the
   pull request body, not the post. Then check the lengths `style.md` sets and
   fix any that are over.

5. **Hand it back.** Open a pull request with the post file only, and read the
   post back in full in the session - it is short enough, and the author is
   judging the words.

6. **One sentence back, split in two.** A reaction about **this post** revises
   the draft on the same branch. A reaction about **posts in general** ("less
   hedging", "always open with a question") becomes a line in `style.md`: show
   the diff, commit it on a yes, and put the reaction's own words in the commit
   message. One reaction can be both. The split is what makes the next post
   better rather than only this one.

7. **Merge when the author says the post is ready**, with `status: ready`.
   Standing merge instructions for research do not cover posts: a post is the
   author's public voice. When the author says it is live, set
   `status: posted` and add the LinkedIn link under the front matter's `date`
   as `url:`.
