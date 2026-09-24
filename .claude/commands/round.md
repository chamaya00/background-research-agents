---
description: Run the driver's side of one read-react-remember round - form and queue the next round, deliver a merged report, or turn a reaction into a profile diff - in the order docs/reader/loop.md sets, so no step depends on a session remembering it.
argument-hint: "[form | deliver | react] [reaction text, for react]"
---

Run the next driver step of the loop in `docs/reader/loop.md`. With `$1`
empty, work out which step is due from the repository state (section 1) and
run that one. With `$1` set to `form`, `deliver` or `react`, run that step.

This command exists because the driver's steps lived only as prose in
`loop.md`, and each session re-derived them. Round 4's topic state went
unrecorded that way, and a status report misread which delivery rule was
current. **`loop.md` says why each step exists. This file is how it is run.**
If they disagree, `loop.md` wins, and fixing this file is part of the same
change that changed `loop.md`.

This is a project command. `/update-agents` overwrites six named commands and
not this one, so a factory release leaves it alone. The rules in `CLAUDE.md`'s
*Reading a brief* section bind every step below.

## 1. Work out which step is due

Read, on `main`:

- `docs/reader/profile.md`, the Interests section: each topic's `runs`,
  `last`, `Briefs:` and any `run in flight`.
- `docs/research/`: every brief document. Its number is the research issue
  that produced it.
- Open issues labelled `role:researcher` whose parent is the open objective
  for this loop (today #19).

Then:

- A research issue open and not yet merged → nothing is due from the driver.
  Say which issue it is and what state it is in, and stop.
- A brief document on `main` whose issue number is missing from every
  `Briefs:` line → **deliver** it.
- The last delivered report has no reaction recorded (no `profile.md` pull
  request quotes it) and the person is in the session → ask for one sentence;
  when it comes, **react**.
- Otherwise → **form** the next round.

The session-start hook `reader-state-check.sh` runs the second check
mechanically and says so at the top of the session. Treat what it prints as a
starting point and confirm it from the files.

## 2. Form: file and queue the next round

`loop.md` step 1. The issue body is the only injection point a factory
release cannot revert, so it carries everything the run needs:

1. **The subjects.** The active topics this round covers, and the words of the
   reaction that chose them, quoted.
2. **A table of those topics** with `runs`, window (90 days at 0 runs, 30 days
   after) and the cutoff date that window gives from today. Point out any
   topic whose window differs from the others; that asymmetry was round 4's
   trap.
3. **What changed since the last round**: every `profile.md` line added or
   retired since the previous research issue, with its reason. Format changes
   go first, because they are the ones a run gets wrong.
4. **Covered ground**: the facts the last brief reported, so they are not
   re-reported as news.
5. **The table section of `docs/reader/sources.md`, pasted whole**, plus its
   path. Per ADR 0004 the per-entry detail is read off the branch. Restate the
   three commitments: reached first and by default; open search stays
   available; each item says which it came from.
6. **Acceptance criteria** in the `acceptance-criteria` skill's shape. The
   standing ones: every item has the seven parts from `profile.md`'s Format
   section, in order; content in the document and process evidence in the pull
   request body; `sources.md` rows amended for every host fetched; no padding,
   and a zero on any subject stated plainly.
7. **Out of scope**, always including: writing to `docs/reader/profile.md`,
   `.claude/**`, `.github/workflows/**`, and `src/`.

Title it `Researcher: round <n> - <subjects>`, give it `Parent: #<objective>`
on its first line, and label it `role:researcher`. Then **add `run in flight`
to each covered topic's entry in `profile.md`** in a one-line pull request,
and label the issue `agent:queued` once that pull request is open. The
round is queued; the next step is the run's, not this session's.

## 3. Deliver: read the report back, then record it

`loop.md` step 3. The report is merged and sits at
`docs/research/<n>-<slug>.md`.

1. **Read it back in full, in the session, word for word.** No summary and no
   condensed version: #38 tried that and it was rejected. If it is too long
   for one message, split it in reading order and say so. Your own commentary
   goes after it, not instead of it, and is labelled as yours.
2. **Do not file it as an issue.** The document is the record and already
   has a permanent URL. Post one only if the person asks for it in this
   session, and treat that as a one-off, not a change of rule; #44 was one.
3. **Update topic state in the same turn**, as a pull request against
   `docs/reader/profile.md`. For every topic the report's items were filed
   under:
   - bump `runs` and set `last` to the report's date;
   - recompute the window (0 runs → 90d, otherwise 30d);
   - append the research issue to `Briefs:`;
   - add that topic's item count to `Items:`, taken from each item's own
     filing statement rather than guessed;
   - remove `run in flight`.

   A topic with a zero this round still gets `runs` and `last`: it was
   covered, and found nothing.
4. Show the diff and say plainly that this is bookkeeping, not a
   reaction. It merges on the person's yes, like every `profile.md` change.

## 4. React: one sentence becomes one diff

`loop.md` steps 4 to 7. `$2` onward, or the person's next message, is the
reaction.

1. **Translate, don't transcribe.** Put each clause in the section it belongs
   to: Interests, Not interested, Window, Knowledge or Format. Knowledge
   changes wording only and never narrows what gets fetched. A clause that
   touches two concepts gets two lines, never one line covering both; #6 was
   sent back for exactly that.
2. **A line that contradicts an existing one replaces it**, and the old line
   moves to Retired with both dates. Check Format especially: a replaced seed
   line stayed behind for a day once.
3. **Show the diff before committing**, and ask about anything ambiguous with
   a specific question rather than a guess. That diff is the step the person
   can veto.
4. On a yes, open one pull request. The person's own words go in both the
   commit message and the body, beside the lines they produced, so
   `git log -p docs/reader/profile.md` is the reaction log.
5. If the reaction names what to cover next, that is the next round's
   subjects: offer to run **form**.

## 5. Report

End every run of this command with one line: what was done, and which step is
due next and who it waits on.
