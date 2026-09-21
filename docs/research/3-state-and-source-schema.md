# State, source, and fixture schema for the research-brief vertical slice

**Decision this serves:** what file formats hold interest, preference, and
knowledge state; what file format lists sources and which field of it gates
selection; and what fixture format lets a test prove that a knowledge-state
change alone changed a brief's wording without changing what got selected.
Stack decided separately in [ADR 0001](../decisions/0001-stack-typescript-node.md).

All four files below are YAML: hand-editable with a text editor, diffable in a
pull request or a commit, and validated at load time against a schema (see the
ADR) so a typo fails loudly instead of silently. Each lives under `state/` in
the repository once an engineer child wires the pipeline; this issue fixes
their shape, not their path.

## Why three files and not one

#2 is explicit that conflating interest, preference, and knowledge is "the
main way this kind of system goes vague." The three answer three different
questions, and only two of them decide whether an item appears at all:

| File | Question it answers | Gates *selection*? | Changes how an item is *written*? |
|---|---|---|---|
| `interest.yaml` | which subjects get fetched | **Yes** | No |
| `preference.yaml` | what kind of item is liked | **Yes** | No |
| `knowledge.yaml` | what's already known | **No** | **Yes** |

Interest and preference both filter and rank the candidate pool before an
item is chosen. Knowledge never removes an item from consideration and never
changes its rank - it only changes the prose the writing step produces for an
item that was already selected, by deciding whether a concept the item
touches gets explained or referenced in passing. A pipeline bug that let
knowledge state suppress an item would be exactly the conflation #2 warns
against, so the schemas keep the three files structurally incapable of
answering each other's question: `knowledge.yaml` has no field a selector
could filter or sort on, only a familiarity level and a note.

## `interest.yaml` - which subjects get fetched

The vertical slice is scoped to one topic ("analytics for enterprise AI"), so
this file does not list topics - it lists the subjects *within* that topic
that are currently worth fetching for, each with a status that a selector
filters on and a weight it ranks by.

```yaml
# state/interest.yaml
subjects:
  - id: usage-based-pricing
    label: "Usage-based pricing for AI features"
    status: active       # active | muted - muted subjects are never selected
    weight: 3             # 1-5, higher ranks candidates from this subject higher
  - id: agentic-bi-tools
    label: "Agentic interfaces to BI/analytics tools"
    status: active
    weight: 5
  - id: data-residency
    label: "Data residency requirements for enterprise AI"
    status: muted
    weight: 1
```

A fetched item is tagged with the subject id(s) it matches (tagging is a
fetch-time concern, out of scope here). Selection reads `status`: `muted`
removes every item tagged only with that subject from the candidate pool
before ranking; `weight` orders what is left. Hand-editing `status` from
`active` to `muted` on `data-residency` and re-running the pipeline against
the same source fixtures removes every data-residency-only item from the next
brief without touching any other file - that is the observable effect #2's
criterion 4 asks the source-list file to have, and the same shape applies
here.

## `preference.yaml` - what kind of item is liked

Four independent axes, named directly from #2's own list (depth, source,
recency, format). Each axis is a preference *ordering*, not a hard filter, so
preference ranks the candidate pool that interest has already filtered rather
than removing items from it outright - except `min_recency_days`, which is a
hard cutoff because "how recent is acceptable" is naturally a threshold, not
a ranking.

```yaml
# state/preference.yaml
depth: deep                 # quick | deep - ranks longer / more technical items higher when "deep"
formats:                    # ordered, first is most preferred
  - report
  - article
  - video
recency:
  min_recency_days: 30      # hard cutoff: items older than this are excluded, not just ranked lower
  prefer_recent: true       # among eligible items, more recent ranks higher
sources:                    # per-source-id weight; the only source-level weighting there is
  gartner-blog: 5
  random-newsletter: 1
```

`sources` here is the only place a source carries a weight - `sources.yaml`
below describes *how* to fetch a source and whether it is enabled, and has no
weight field for this to override. A source id absent from this map weighs 1.

`depth`, `formats`, and `sources` re-rank; `recency.min_recency_days` filters.
Both kinds live in one file because they answer the same question ("what kind
of item is liked") even though they act differently in the pipeline - the
distinction that matters for #2's framing is preference vs. interest vs.
knowledge, not filter vs. rank within one of those three.

## `knowledge.yaml` - what's already known

```yaml
# state/knowledge.yaml
concepts:
  - id: cohort-retention
    label: "Cohort retention analysis"
    familiarity: familiar     # unfamiliar | familiar | expert
    last_updated: 2026-09-10
    note: "Learned from the Amplitude brief on 2026-09-10"
  - id: usage-based-pricing-101
    label: "What usage-based pricing means"
    familiarity: unfamiliar
    last_updated: null
    note: null
```

No `status`, no `weight`, no field a filter could read. The writing step
looks up each concept an item touches (by id, same tagging mechanism as
interest subjects) and picks one of three renderings: `unfamiliar` gets a full
explanation inline, `familiar` gets a one-clause reminder, `expert` gets no
explanation at all - just the delta the item itself reports. Familiarity is
the only field that changes, and it changes prose, never the item list.

## `sources.yaml` - the source list

```yaml
# state/sources.yaml
sources:
  - id: gartner-blog
    kind: rss
    url: https://www.gartner.com/en/newsroom/rss
    enabled: true
  - id: a16z-enterprise-ai
    kind: rss
    url: https://a16z.com/tag/enterprise-ai/feed/
    enabled: true
  - id: random-newsletter
    kind: rss
    url: https://example.com/newsletter/feed
    enabled: false
```

`enabled` is the field that gates eligibility: the fetch step skips every
source with `enabled: false` outright, so its items never enter the candidate
pool regardless of interest or preference state. This is deliberately a
separate axis from `interest.subjects[].status` - muting a subject removes
items *about* that subject from every source, while disabling a source
removes *all* items from that one source regardless of subject. `kind` and
`url` describe how to fetch, not whether to; they carry no eligibility
meaning.

**Worked example.** Adding one entry:

```diff
   - id: random-newsletter
     kind: rss
     url: https://example.com/newsletter/feed
     enabled: false
+  - id: sequoia-ai-ascent
+    kind: rss
+    url: https://www.sequoiacap.com/feed/?tag=ai
+    enabled: true
```

Re-running the pipeline against the same interest/preference/knowledge state
now includes `sequoia-ai-ascent`'s items in the fetch step's output; if any of
those items match an active, non-muted interest subject and clear the
preference filters, the next brief contains at least one item sourced from
it that no prior run could have produced - the observable change #2's
criterion 6 names.

## How an item's narrative text is produced

Scope item 5. Stated here rather than left implicit, because the fixture
comparison below is only meaningful once this is settled, and #4's criterion 2
inherits whatever this says.

**Item text is model-generated.** ADR 0001 names a model API and this design
keeps that decision. The writing step hands the model the item's fields, the
concepts it touches, and the familiarity level of each of those concepts;
familiarity selects which instruction the writer is given - `unfamiliar` asks
for a full inline explanation, `familiar` for a one-clause reminder, `expert`
for none at all.

**Model output is not byte-reproducible, and this design does not pretend it
is.** Two production runs against identical state and identical items will
differ in wording. The byte comparison below is therefore a property of the
*test harness*, not of production, and saying so is what keeps it honest.

**Under test, the writer is a deterministic stub.** The pipeline takes its
writer as an injected dependency. The determinism test injects a stub that
renders a fixed string from the instruction it is handed, so two runs differing
only in knowledge state produce byte-identical output everywhere the instruction
did not change. What is held fixed is the writer itself - not a temperature, a
seed, or a cache, because none of those makes a model byte-stable in a way a
test should be allowed to depend on.

This makes the boundary the test guards explicit: everything from reading state
through choosing the instruction is covered, and the model's compliance with
that instruction is not. Assertion 4 below is what stops the uncovered half
being invisible.

## Fixture format for the determinism test (criterion 5)

#2's criterion 5 needs a test that proves a negative: a concept's explanation
*stops* appearing once `knowledge.yaml` marks it familiar, with nothing else
in the brief changing. That requires holding fetch and ranking fixed and
varying exactly one input.

**Fixture set**, checked into the repository (path left to the engineer child
that consumes it, e.g. `fixtures/determinism/`):

```
fixtures/determinism/
  sources.fixture.yaml       # same shape as sources.yaml, all "kind: fixture"
  items.fixture.json         # the fetched items every "fixture" source returns
  interest.fixture.yaml
  preference.fixture.yaml
  knowledge.a.fixture.yaml   # cohort-retention: unfamiliar
  knowledge.b.fixture.yaml   # identical to (a) except cohort-retention: familiar
```

`items.fixture.json` is the stand-in for a live fetch: a fixed JSON array, so
"fixed source fixtures" means literally the same bytes on every run, no
network involved.

```json
[
  {
    "id": "item-1",
    "sourceId": "gartner-blog",
    "title": "Enterprise buyers now expect usage-based AI pricing",
    "url": "https://example.com/a",
    "publishedAt": "2026-09-15",
    "subjects": ["usage-based-pricing"],
    "concepts": ["cohort-retention"],
    "rawText": "..."
  },
  {
    "id": "item-2",
    "sourceId": "a16z-enterprise-ai",
    "title": "Agentic BI copilots are shipping faster than expected",
    "url": "https://example.com/b",
    "publishedAt": "2026-09-16",
    "subjects": ["agentic-bi-tools"],
    "concepts": [],
    "rawText": "..."
  }
]
```

`knowledge.a.fixture.yaml` and `knowledge.b.fixture.yaml` are byte-identical
except for `cohort-retention`'s `familiarity` field (`unfamiliar` vs.
`familiar`) and its `last_updated`/`note` - the "one knowledge-state entry"
criterion 3 asks for.

**The comparison a test makes.** Run the pipeline twice against the identical
fixture set, `sources.fixture.yaml`, `interest.fixture.yaml`, and
`preference.fixture.yaml`, swapping only the knowledge fixture, producing
`brief.a.json` and `brief.b.json`. The test then asserts four things, in
order:

1. **Selection is unchanged.** The ordered list of `id`s (and every other
   field except the rendered text) in `brief.a.json` and `brief.b.json` is
   identical - proving knowledge state did not gate selection. Concretely:
   `brief.a.items.map(i => ({...i, text: undefined}))` deep-equals the same
   projection of `brief.b.items`.
2. **Exactly one item's text differs.** Only `item-1` (the one tagged
   `cohort-retention`) has a different `text` field between the two briefs;
   `item-2`'s `text` is byte-identical in both. This is the "prove a
   negative, not just a difference somewhere" check - a test that only
   asserted "the two briefs differ" would pass even if the wrong item's text
   changed.
3. **The direction is right, not just that it changed.** `brief.a`'s text for
   `item-1` contains the full explanation string the `unfamiliar` rendering
   is defined to produce (e.g. contains the substring "Cohort retention
   analysis measures..."); `brief.b`'s text for the same item does not
   contain that substring. This is the assertion that turns "it looks
   different" into "the explanation specifically stopped appearing," which is
   what criterion 5 actually claims.
4. **The instruction is right, not just the stub's output.** The stub records
   every instruction it was handed. For `item-1`, the instruction produced
   under `knowledge.a` (unfamiliar) contains the explain directive and the one
   produced under `knowledge.b` (familiar) does not. This is the assertion that
   survives swapping the stub for the real model: 1-3 prove the pipeline is
   internally consistent, and this one proves the thing the live system
   actually depends on - that familiarity reaches the writer and changes what
   it is asked for.

A test built this way fails if: selection logic starts reading `familiarity`
(check 1 catches it), the writing step re-explains a concept regardless of
familiarity (check 3 catches it), or an unrelated rendering path is
accidentally sensitive to knowledge state (check 2 catches it), or the explain
directive survives into the `familiar` instruction (check 4 catches it). All
of those failure modes are ones a looser "diff the two briefs" test would
miss.

**What this proves, and what it does not.** With a stubbed writer these four
assertions prove that selection ignores knowledge state, that exactly the right
item's text is affected, and that the instruction handed to the writer drops the
explain directive once a concept is familiar. They do **not** prove that the
live model complies with that instruction - a model told to omit an explanation
can still produce one. No deterministic test can close that gap, and leaving it
unsaid would make #2's criterion 5 read as covered when it is half covered.

## What this leaves open

- Exact YAML validation library and schema definitions: an engineer decision,
  not a schema-shape one - anything that rejects a file missing a required key
  satisfies this design.
- Where fetched items get subject/concept tags assigned (fetch time vs. a
  separate tagging pass): out of scope for this issue, since it doesn't change
  any of the four file shapes above, only how their `subjects`/`concepts`
  fields get populated.
- Verifying that the *live* model omits the explanation it was told to omit.
  The stubbed test above deliberately does not cover this; the check that would
  - an assertion against real model output, tolerant of wording but intolerant
  of the explanation reappearing - belongs to the engineer child that first
  makes the model call.
- The real (non-fixture) `kind: rss` fetch implementation: explicitly out of
  scope per #2 and this issue's own scope section - a later engineer child,
  against these schemas.
