# Where the curated source list lives, and how a run gets it

**The decision this serves:** where the source list
[`docs/reader/profile.md`](../reader/profile.md)'s Format line has been asking
for since [#2](https://github.com/chamaya00/background-research-agents/issues/2)
is stored and encoded, and what a run does to obtain it, given that
[`docs/reader/loop.md`](../reader/loop.md) step 1 inlines reader state into
every issue body and this file will not stay small.

Settled in [ADR 0004](../decisions/0004-curated-source-list-lives-beside-the-profile.md)
and built as [`docs/reader/sources.md`](../reader/sources.md). This document is
the comparison behind both.

Written for [#32](https://github.com/chamaya00/background-research-agents/issues/32).

## What the issue fixed, and what it was guessing

The issue is a good brief and it still carries guesses, and separating them
changed one answer.

**Fixed, and checked rather than assumed:**

- The seed. Every entry traces to a Read or Refused row in
  [#19's](19-analytics-for-enterprise-ai-brief-2026-09-21.md) or
  [#26's](26-analytics-and-agent-efficacy-brief-2026-09-23.md) fetch record. I
  cross-checked the issue's compiled table against both documents' tables: all
  nineteen hosts are present and correctly attributed, with one thing the
  compiled table flattens - `snowflake.com`'s row in #26 records a fetch that
  produced no item, because the Semantic View Autopilot drop was then dropped
  as seven months out of window. It is a real observation and I kept it, with
  the circumstance stated.
- ADR 0003's argument. Checked, and it is about the *consumer* - "an agent
  reads prose at least as well as YAML and a schema validator is not in the
  loop at all" - not about which piece of state is in hand. It therefore
  applies here unchanged, which is what the issue expected.
- The not-an-allowlist trap. Correct and load-bearing; see the `arxiv.org`
  case below.

**Guesses, and one of them I did not take:**

- **"Most likely `docs/reader/`"** turned out right, but not for the reason
  the issue gives. The issue reads it off ADR 0003's *conclusion* (reader
  state goes there). The argument that actually decides it is the **write
  rule**, which ADR 0003 does not discuss at all because the profile has only
  one writer. `profile.md` says "The driving session maintains it. Nobody else
  writes to it", and that rule is what makes the reaction diff in loop.md step
  5 meaningful. Every row in a source list cites a fetch, and only a research
  run can perform one. That is why the answer is a *separate file* in
  `docs/reader/` rather than a sixth section of the profile - and the issue's
  framing would have been satisfied by either.
- **"The inlining tension"** is framed as a size problem. Size is the symptom.
  The real variable is that the profile is read to decide *how to word* and
  *what is admissible*, while the list is read to decide *where to start* -
  and only the second has a part (the per-entry detail) a run does not need
  until after it has already decided to open the branch. That is what makes a
  split possible at all, and it is not available for `profile.md`.
- **The `sources.yaml` field list** (`id`, `kind`, `url`, `enabled`). Carried
  as "the fields a source list needs". Two of the four do not survive contact
  with this loop, and `enabled` is the one worth arguing about - below.

## Question 1: where the list lives

### Option D, taken first because it is the one that gets left out: change nothing

The briefs already contain the list. #19 and #26 each carry a Read and a
Refused table, produced by re-fetching. A run could read the last two or three
briefs in `docs/research/` and reconstruct the same nineteen hosts - which is
exactly what I did to build the file, in about ten minutes.

It costs nothing to adopt, adds no file, and cannot drift from the evidence
because it *is* the evidence.

What it costs: the reconstruction is per-run and its result is thrown away, so
the tenth brief pays what the third paid. Worse, it degrades as it grows - at
two briefs "read the last few" is tractable, at twelve it is a judgement about
which few, and a host recorded in brief 4 and not mentioned since becomes
invisible without anyone deciding it should be. And it cannot hold a negative:
there is no brief whose fetch table can say *NIST CAISI was searched for twice
and never found*, because nothing was fetched.

**What would have to be true for it to win:** that the list stays at
two-or-three briefs' worth. It will not; the objective exists because the loop
is meant to run daily.

This is the option I would have expected to lose and it loses for a sharper
reason than "it does not scale". A derived list cannot record an absence, and
absences are a third of what makes this list worth having.

### Option A: a sixth section of `profile.md`

One file, one paste, nothing to keep in sync, and the file a run is already
guaranteed to read. This is the option to beat and it is genuinely close.

It loses on the write rule, as above. Merging the two means either a run
editing `profile.md` - which breaks the only mechanism guaranteeing that every
line in it was seen and approved by the person - or a driver transcribing
reachability statuses it did not observe, which is the exact failure
`docs/memory/researcher.md`'s third lesson records: #21 cited a host as
corroboration that had in fact 403'd, because the citation list was built from
intent rather than from fetches.

There is a second, smaller cost: the profile is a wall of preferences a person
re-reads during a two-minute reaction, and nineteen hostnames in the middle of
it is nineteen lines they have to scroll past to reach the thing they are
actually editing.

### Option B: a separate prose file at `docs/reader/sources.md` — recommended

Consistent with ADR 0003's argument, separate writers under separate rules,
and shaped so the part that gets inlined is a section rather than the file.

Cost, and it is the one ADR 0003 explicitly warned about: two files now both
describe reader behaviour, and "a reader finding one would stop looking for
the other" is the failure that record called out as worth an ADR to avoid.
Mitigated by cross-references in three directions and by `loop.md` naming
both, but mitigation is not removal, and if this decision goes wrong that is
how.

### Option C: YAML at `state/sources.yaml`, as `3-state-and-source-schema.md` specified

Rejected on ADR 0003's reasoning unchanged, and I checked whether anything had
moved that would revive it. Nothing has: `src/state.ts` still loads four YAML
files through `loadYaml` from a `state/` that does not exist, `src/writer.ts`
is still the template placeholder its own comment says it is, and ADR 0003's
"Consequence, settled by #19" section is still accurate. Reviving the YAML
encoding for one of the four files would recreate the two-encodings condition
that record exists to prevent, for a validator that is not in the loop.

### Discarded in a line

A pinned GitHub issue as the store - no diff to review before a row becomes
true, which is the step this loop depends on, and ADR 0003 already rejected it
for the profile on the same ground.

## Question 2: how a run gets it

### Option 1: inline the whole file

The option that wins by default if nobody decides, which is why ADR 0004
writes it down rather than just not choosing it. It works today. It fails *by
degrees* - the body grows each round, the profile it is meant to foreground
gets pushed down, and there is no moment at which anybody is forced to notice.
That is the specific shape of failure worth pre-empting, because nothing about
it ever triggers a decision.

### Option 4, the one nobody asked for: put the list in `CLAUDE.md`'s unmanaged half

Carried properly, because on the stated constraints it looks like it should
win. `CLAUDE.md` outside the factory markers survives a release - `loop.md`
says so explicitly - and it is read in full by every run of every role, so
there is no paste, no pointer, and no injection step that can be skipped. It
would make the list *more* reliably present than the profile currently is.

It loses on two things. First, ADR 0003 already rejected `CLAUDE.md` for
reader state, and the reason was growth: "it grows on every round and
`CLAUDE.md` is read in full by every run of every role. The binding rule
belongs there; the data does not." A source list is the most
monotonically-growing artifact in this loop. Second, and worse in practice,
"every run of every role" includes the engineer and the designer, who have no
use for nineteen hostnames and would read them on every run forever.

Still, it is the only option that removes the injection step rather than
shortening it, and if the inlining mechanism is ever found to be the thing
that fails, this is where to look next.

### Option 2: inline the table, point at the file — recommended

`sources.md` is split into a compact table carrying all five fields - one row
per host - and per-entry detail below it. The issue body carries the profile
in full, the table section, and the path.

This works because of the asymmetry named at the top: a run needs the table to
*select* and needs the detail only after it has decided to use a host, by
which point it is reading the branch anyway. The split is not a compression of
the list, it is the list's actual seam.

Its weakness is that it needs a named successor or it is just option 1 with a
delay. ADR 0004 names one - split per Interests line past roughly 40 entries,
inline only the line the objective covers - and names what comes after *that*,
which is the scheduled reachability check #32 put out of scope, as a new ADR
rather than an extension.

### Option 3: point at the file and inline nothing

Tempting: `docs/` survives a release and a run reads the default branch
anyway, so the pointer looks redundant. Rejected because it makes reading the
list a second decision, and that is the same failure this repository's own
reader identified about brief delivery in
[#29](https://github.com/chamaya00/background-research-agents/issues/29) -
"read the brief back in full in the session, not only as a link to the issue.
Posting only a link makes reading it a second decision." A pointer that costs
a fetch to act on is the first thing a run under budget pressure skips, and
the skip is silent.

That is a piece of evidence from inside this repository about this repository's
one reader, which is better evidence than any general argument about pointers.

### The `enabled` field, and why it is not in the file

`3-state-and-source-schema.md` gates eligibility on `enabled`, deliberately
separate from interest state: "muting a subject removes items *about* that
subject from every source, while disabling a source removes *all* items from
that one source". That is a coherent design for a fetch step that skips
disabled sources.

There is no fetch step. In a file an agent reads, `enabled: false` has no
mechanism behind it and will be read as a judgement - "this source is bad" -
which is the ranking #32 excluded. A source that should not be read is deleted,
and the deletion is visible in the diff with a reason in the commit. Same for a
weight: `3-...md` puts weights in `preference.yaml` rather than in the source
list, and adding one here would start deciding selection with nothing recording
that it had.

## The evidence for the list being worth anything

The list's entire claim is that a recorded reachability status is worth acting
on later. I went looking for the case against it.

**For.** Two re-fetches performed by this run, on 2026-09-23:

- `hpcwire.com`, the same URL #19 recorded - HTTP 403 again. That is three
  refusals across three separate runs and three dates (#20's session, #19, and
  this one). Whatever is blocking is a property of the host.
- `techtarget.com`, the same URL #26 recorded - full article content returned.

**Against, and it is not weak.** A 403 of this kind is returned by a CDN or
WAF layer in front of the site, before the application runs; these are enabled
by default, updated by the vendor without notice, and owned by a different
team than the site. Intermittent 403s from one host to one client are the
signature of rate limiting specifically, which produces exactly the pattern of
a status that reproduces on every check until it does not.

So the honest reading is that a recorded status is a **prior worth acting on,
not a fact**. The list saves a wasted round trip and tells a run to budget a
substitute in advance; it must never be read as licence to skip a fetch, and
`sources.md` says so. This also means the refusal rows are the ones that decay
most dangerously - a host that quietly starts answering stays skipped, and
nothing surfaces it.

Sources: [Akamai WAF troubleshooting - edge 403s, bots, rate limits](https://medium.com/@dixitra20/akamai-waf-troubleshooting-edge-403s-bots-rate-limits-and-false-positives-7b0e22c1c7a9),
[Fix 403 errors that block AI crawlers](https://aicrawlercheck.com/blog/fix-403-errors-for-ai-crawlers),
[Cloudflare community: Block AI Bots giving 403s on normal requests](https://community.cloudflare.com/t/block-ai-bots-is-giving-403-errors-on-normal-requests-whats-the-blocking-criteria/791327).

## The trap that is not a size problem: not an allowlist

#26's most consequential item - ERPBench, which reframed the whole brief -
came from `arxiv.org`, reached by search, nine days after publication. No
curated list would have carried it beforehand. `arxiv.org` is in the file
*because of* that item, and reading its presence as the reason the item was
admissible inverts the causation exactly.

This is why the three commitments in ADR 0004 are stated in three places
rather than one. The third - that a brief says per item whether it came from a
listed source or from search - is the only one with feedback in it. Without
it, a list being ignored and a list that is working are indistinguishable from
outside, and the only remedy anyone can propose is "add more sources".

## What I searched for and did not find

- **Prior art on reachability-annotated source lists for research agents.** I
  did not find a worked design to compare against. Everything on the topic is
  about the *publisher's* side - how to stop AI crawlers, or how to get
  unblocked - and nothing about a consumer keeping a durable record of which
  hosts answer it. Treat the shape in `sources.md` as unvalidated by anyone
  else's experience.
- **Any change since ADR 0003 that would revive the YAML option.** None.
  Checked `src/state.ts`, `src/writer.ts`, and ADR 0003's own #19 consequence
  section; all three still hold.
- **A NIST CAISI publication inside the window.** Not re-searched by this run -
  #26 searched twice on 2026-09-23, which is today, and a third search the same
  day would be spending the budget on confidence rather than on the answer. Its
  result is recorded in `sources.md` as an entry rather than as a gap.

## Verified, inferred, assumed

- **Verified**: every host, status and date in `sources.md`, against the two
  documents' tables. The two re-fetches above. ADR 0003's argument and
  `profile.md`'s write rule, quoted from the files. `src/state.ts` and
  `src/writer.ts` still being in the state ADR 0003 describes.
- **Inferred**: that the write-rule conflict is the decisive argument for a
  separate file rather than a sixth section. Reasoned from `profile.md`'s
  stated rule plus loop.md step 5, not from anyone having hit the conflict.
- **Assumed, and load-bearing**: that a run given a table and a path will read
  the file when it needs the detail. Nothing enforces this. If runs turn out
  to use only the inlined table, the split has silently become option 3 for the
  detail half, and the tell would be briefs that cite a host without mentioning
  what it previously carried.
- **Assumed**: that roughly 40 entries is where an inlined table stops being
  readable. A judgement call, stated as one in ADR 0004. What matters is that a
  successor step exists and is named; the number can move.

## Recommendation, the argument against it, and what would flip it

**Recommendation:** prose at `docs/reader/sources.md` under ADR 0003's
reasoning, written by research runs rather than by the driver, with the issue
body inlining the table section and a path. Implemented on this branch.

**The strongest argument against it**, which is option A rather than anything
exotic: the write-rule conflict I am treating as decisive has never actually
occurred. Nobody has tried to put a fetch status in `profile.md` and been
stopped. So this record spends a second file, a cross-reference in three
directions, and the two-files-one-subject risk ADR 0003 explicitly named, to
pre-empt a conflict that is so far theoretical. If in three months the list has
twenty-five rows, changes twice a week, and everyone involved is also the
driver, the honest read will be that one file with a sixth section would have
been fine and this record bought separation nobody needed.

**What would flip it:** the list stopping being run-written. If reachability
ever comes from a scheduled check rather than from a brief's fetches - the
thing #32 put out of scope - then the writer is neither the driver nor the
run, and a third arrangement is needed; ADR 0004 already names that as a
superseding record rather than an extension. The smaller flip is the inlined
table not being read: if a brief cites a host whose row says it refuses, or
repeats a fetch the file already answers, the injection step failed and option
4 - `CLAUDE.md`'s unmanaged half, which removes the step rather than shortening
it - is where to look.
