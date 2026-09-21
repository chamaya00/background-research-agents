# ADR 0003: reader state is prose under `docs/reader/`, not YAML under `state/`

Date: 2026-09-21
Status: accepted

## Context

`docs/research/3-state-and-source-schema.md` settled two things together and
they have come apart. It settled the **axis split** - interest and preference
gate selection, knowledge only changes wording, and the three are structurally
incapable of answering each other's question - and it settled an **encoding**,
three YAML files under `state/`, validated at load time by zod so a typo fails
loudly. The second followed from the first only because of who was going to
read them: a TypeScript pipeline, per [ADR 0001](0001-stack-typescript-node.md).

The reader is no longer that pipeline. The direction under discussion on
[#2](https://github.com/chamaya00/background-research-agents/issues/2) runs
research inside agent runs driven through issues, because that is what works
with a Claude Code OAuth token, and an agent reads prose at least as well as
YAML and a schema validator is not in the loop at all. Meanwhile the state
has to be pasted into an issue body on every round - that is the only
injection point a factory release cannot revert - and it has to be read and
corrected by a person in the middle of a two-minute reaction.

Nothing forces a choice here except that the two files would otherwise both
claim to be the state, and a reader finding one would stop looking for the
other. That is the same failure the `## The rules` section of `CLAUDE.md`
describes for summarised rules, and it is worth an ADR rather than a
paragraph.

## Decision

Reader state lives in `docs/reader/profile.md` as prose, in the four sections
the axis split defines - Interests, Not interested, Knowledge, Format - plus
Retired. The axis split carries forward unchanged and is the part that was
decided; the YAML encoding does not, and `state/` is not created.

Every line cites the brief and date that produced it. A reaction that
contradicts an existing line replaces it and the replaced line moves to
Retired with both dates, so a reversal is visible in the file rather than only
in its history.

`docs/research/3-state-and-source-schema.md` stays as it is. It records what
was true for the pipeline it was written for, and this record says where it
stopped applying.

## Consequences

Easy: pasting the whole state into an issue body, hand-editing it during a
reaction, reading a diff of it in a pull request, and adding an axis without a
schema migration.

Hard: anything that wants to *compute* over the state. There is no load-time
validation, so a malformed line fails by being misread rather than by
throwing, and the failure surfaces as a slightly wrong brief. That is
acceptable while an agent is the only consumer and a person reads every round;
it stops being acceptable the moment something selects on this file
programmatically.

Ruled out later: the existing `src/` selection code cannot consume this file
without a parser being written for it. If
[#2](https://github.com/chamaya00/background-research-agents/issues/2) settles
back toward the pipeline, this decision is superseded rather than extended -
the two encodings should not both exist.

## Alternatives rejected

**Keep the YAML under `state/` and have the agent read that.** An agent can
read YAML, so this is not impossible; it loses on the person. The state is
edited during a reaction and pasted into issue bodies, and YAML that nothing
validates is markdown with worse ergonomics and an implied contract nobody
enforces.

**Put it in `docs/memory/researcher.md`.** Rejected on the memory protocol's
own terms: a 40-line cap that reader preferences would exhaust within a month,
and an explicit rule that a line with no incident behind it is a preference
and preferences do not belong there. Reader state is nothing but preferences.

**Put it in the unmanaged half of `CLAUDE.md`.** Survives a release, same as
`docs/`, but it grows on every round and `CLAUDE.md` is read in full by every
run of every role. The binding rule belongs there; the data does not.

**A GitHub issue or project field as the store.** No diff to review before a
line becomes true, which is the step the loop depends on, and it puts the
state somewhere a run reads through an API rather than off the branch it has
already checked out.
