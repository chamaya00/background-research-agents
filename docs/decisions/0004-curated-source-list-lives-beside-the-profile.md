# ADR 0004: the curated source list is prose beside the profile, and the issue body inlines its table

Date: 2026-09-23
Status: accepted

## Context

`docs/reader/profile.md`'s Format line has said "Sources come from a curated
list rather than open search" since
[#2](https://github.com/chamaya00/background-research-agents/issues/2), and
until [#32](https://github.com/chamaya00/background-research-agents/issues/32)
there was no such list. Two briefs have now run without one and both of them
independently argued for it from evidence rather than from the Format line:
[#19](https://github.com/chamaya00/background-research-agents/issues/19) found
that the hosts which refuse are not a random sample of the hosts worth reading
- both of its refusals sat on load-bearing links - and
[#26](https://github.com/chamaya00/background-research-agents/issues/26) found
that open search on these subjects returns mostly vendor listicles, so every
item it filed came from guessing at a specific vendor or venue rather than
from searching the subject.

That makes the list's real job narrower than "a list of good sources", and
naming it is what decides the encoding. Its job is to carry **reachability**:
which hosts answer a fetch, which return 403, and when that was last observed.
Nothing else in this loop records that, and it is only recoverable today by
reading a brief's fetch table and inferring.

Three constraints were already settled elsewhere and this record does not
reopen them:

- [ADR 0003](0003-reader-profile-lives-in-docs.md) put reader state in
  `docs/reader/` as prose rather than YAML under `state/`, on the argument
  that **the consumer is an agent, not a parser**. That argument is about who
  reads the state, not about which state it is, so it applies to a source list
  the same way.
- `docs/reader/loop.md` step 1 has the driver inline `profile.md` into every
  objective's issue body, because the issue body is an injection point a
  factory release cannot revert.
- `docs/research/3-state-and-source-schema.md` specified `sources.yaml` with
  `id`, `kind`, `url` and `enabled`. Per ADR 0003 its YAML encoding does not
  carry over, but the question it was answering - what fields does a source
  entry need - still has to be answered.

The open questions #32 raised, then, are two: **where the list lives and in
what encoding**, and **how a run gets it** once it is larger than `profile.md`
and still growing. The second is the one that defaults silently if nobody
decides it, because "inline the state" is an existing habit that will simply
be applied to a second file until the issue body stops being readable.

## Decision

**The list lives at `docs/reader/sources.md`, as prose, beside the profile.**
This is consistent with ADR 0003 and does not supersede it. `state/` is still
not created and no YAML encoding of this list exists.

It is a separate file rather than a sixth section of `profile.md`, and the
reason is who writes it. `profile.md` says "The driving session maintains it.
Nobody else writes to it", and that rule is load-bearing - it is what makes
the reaction diff in `loop.md` step 5 the only way a preference becomes true.
A source list is the opposite: its rows are reachability observations, and the
only thing that can produce one is a research run that fetched the host. Two
different writers under one write rule would mean either a run editing the
profile or a driver inventing fetch statuses, and both are worse than a second
file.

**The fields an entry carries**, answering `3-state-and-source-schema.md` in
this encoding: host (the `id`, and a hostname is a better identity here than a
slug because reachability is a property of the host), the Interests line it has
been observed serving, a reachability status, the date that status was
observed, and a citation to the document and table row it came from. There is
deliberately **no `enabled` field and no weight**. `enabled` gated a fetch step
that does not exist; a weight would start deciding selection silently, and
ranking sources was put out of scope by #32.

**A status is an observation or it is not written.** An entry is added when a
run has fetched the host and recorded the result in its own Read or Refused
table. A source that was searched for and never found gets a row in a
*separate* table - "Named but never reached" - so that a stated absence is
available to the next run without being dressed as a fetch. The NIST CAISI
entry is the first of these.

### How a run gets it: inline the table, point at the file

`sources.md` is split into a compact table - one row per entry, carrying all
five fields - and per-entry detail below it. **The issue body inlines
`profile.md` in full, unchanged, plus the source list's table section and a
pointer to `docs/reader/sources.md` by path.** The per-entry detail is read off
the default branch.

The split is what makes this stable rather than a deferral. The table is the
part a run needs in order to *select* - it answers "where do I start and what
will refuse me" - and it grows by one line per source. The detail is what a run
needs once it has already decided to use a host, at which point it is reading
the branch anyway.

Why inline anything at all, when `docs/` survives a factory release just as the
issue body does: what a release can revert is the *instruction to read the
file*, not the file. `CLAUDE.md`'s unmanaged half carries that instruction for
`profile.md` today, and the inlined copy is the belt to its braces. The pointer
line in the issue body is the same belt for `sources.md` - it survives a
release, it names the path, and it costs one line.

### What happens when that is outgrown

Named here so it does not have to be rediscovered as an emergency:

1. **Now, at 19 entries and one gap row.** Table plus pointer, as above.
2. **Past roughly 40 entries**, or whenever the table stops being something a
   person will read in an issue body: split the file by Interests line into
   `docs/reader/sources/<line>.md`, leave `docs/reader/sources.md` as the
   index, and inline only the table for the lines the objective in hand
   actually covers. A brief on one subject has never needed the other
   subject's hosts.
3. **When per-line tables outgrow that too** - which in practice means
   statuses going stale faster than the briefs that touch them can refresh
   them - the mechanism has run out, and the next decision is the scheduled
   reachability check that #32 put out of scope. That is a new ADR superseding
   this section, not an extension of it, because it introduces a writer to
   this file that is not a research run.

The threshold in step 2 is a judgement call and is meant to be; what this
record fixes is that the step exists and is named, so growing past it is a
decision somebody makes rather than an issue body quietly becoming unreadable.

### How the list is to be used, in three commitments

These are restated verbatim at the top of `sources.md` and in `loop.md`,
because a rule about how to use a file that lives only in a decision record is
a rule a run will not see:

1. **The list is reached first and by default. It is never the only thing a
   run is permitted to read.**
2. **Open search stays available for everything the list does not cover.**
3. **The next brief says, for each item, whether it came from a listed source
   or from search.**

The third is the only one with any feedback in it. Without it there is no way
to distinguish a list that is working from a list that is being ignored, and
the only remedy anyone can propose from the outside is "add more sources".

## Consequences

Easy: adding a source after a brief observes one, in the same pull request as
the brief. Reading the list in a diff. Recording a refusal, which nothing in
this repository could express before. Recording an absence, likewise. Pasting
the table into an issue body, because the file was shaped for it.

Hard, and worth stating rather than discovering:

- **Statuses go stale and nothing says so.** There is no scheduled check, by
  design, so a row's Observed date is the whole of its warranty.
  `hpcwire.com` is already the example: refused 2026-09-21, not re-tested in
  #26 because no item needed it, still listed as refusing on the strength of a
  two-day-old observation that nobody has repeated. The failure mode is a run
  skipping a host that has since started answering, which is invisible.
- **The list can only ever grow from what briefs happened to fetch.** Its
  coverage is a trailing record of two rounds' habits, not a survey of the
  field. The `arxiv.org` row exists because one item arrived by search; on the
  same evidence, whatever the next important item arrives by search from is
  currently missing, and commitment 3 is the only instrument that will show it.
- **Two files now both describe reader behaviour**, which is the exact
  condition ADR 0003 called out as worth an ADR to avoid: a reader who finds
  one stops looking for the other. Mitigated by the write-rule split above,
  by `profile.md` and `sources.md` each naming the other, and by `loop.md`
  naming both - but it is a real cost and it is the price of not putting fetch
  observations under the driver's write rule.
- **Nothing computes over this file**, same as ADR 0003. A malformed row fails
  by being misread rather than by throwing.

## Alternatives rejected

**A sixth section inside `profile.md`.** One file, one paste, nothing to keep
in sync - genuinely the cheapest option and the one to beat. It loses on the
write rule: `profile.md` is the driver's alone and every line in it cites a
reaction, while every row in a source list cites a fetch that only a run can
perform. Merging them means either weakening the rule that makes the reaction
diff meaningful, or having a driver transcribe statuses it did not observe.

**YAML at `state/sources.yaml`, as `3-state-and-source-schema.md` specified.**
Rejected on ADR 0003's argument unchanged: the consumer is an agent, not a
parser, and there is no loader to validate it. A reachability table in YAML is
a markdown table with worse ergonomics and an implied schema nothing enforces.
If #2 ever settles back toward the `src/` pipeline this goes with ADR 0003,
superseded together rather than separately.

**Inline the whole file into every issue body.** This is the option that wins
by default if nobody decides, which is why it is written down. It works today
- the file is short - and it fails by degrees rather than at a point: the issue
body gets longer every round, the profile it is supposed to foreground gets
pushed further down, and there is no moment at which anyone is forced to
notice. Inlining the table only costs one section heading and has a named
successor.

**Point at the file and inline nothing.** Tempting, because `docs/` survives a
factory release and a run reads the default branch anyway. Rejected because it
makes reading the list a second decision, which is the same failure the reader
themselves identified about brief delivery in
[#29](https://github.com/chamaya00/background-research-agents/issues/29) -
"read the brief back in full in the session, not only as a link". A pointer
that costs a fetch to act on gets skipped by a run under budget pressure, and
the skip is silent.

**An `enabled` flag, carried over from the YAML schema.** Rejected: it gated a
fetch step in a pipeline this loop does not run, and in a list an agent reads
it would be indistinguishable from "this source is bad", which is the ranking
#32 excluded. A source that should not be read is removed, with the removal
visible in the diff.

**Storing reachability in `docs/memory/researcher.md` instead.** Rejected on
the memory protocol's own terms, the same way ADR 0003 rejected it for the
profile: a 40-line cap that nineteen hosts would consume half of immediately,
and a rule that memory is about how to do the work rather than about the
subject matter. The lesson "re-fetch rather than reconstructing from
citations" belongs there. The table of what nineteen hosts returned does not.
