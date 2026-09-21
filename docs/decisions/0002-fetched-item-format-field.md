# ADR 0002: `FetchedItem` gains a `format` field, ranked by `preference.formats`

Date: 2026-09-21
Status: accepted

## Context

`preference.formats` has been parsed and set since #4's merge (31d1a79) but
never read: `FetchedItem` carried no `format` field and `selectAndRank` never
consulted the list, so it re-ranked nothing.
`docs/research/3-state-and-source-schema.md` names `formats` as one of four
preference axes that re-rank a candidate pool (alongside `depth`, `sources`,
`recency`), not a decorative one - #4's own merge commit flagged this as
unfinished rather than deciding it either way, and left it for the first child
where items stop being fixtures to settle, which is this one.

This issue is also the first to fetch real RSS items, and a real feed
discloses format at fetch time: RSS 2.0's `<enclosure type="...">` gives a
MIME type an item can be classified from (`video/*`, `audio/*`, or neither).
Wiring the ranking axis and giving it something real to read from land
together because neither is useful alone - a re-ranking axis with nothing to
rank on is the bug this issue inherited, and a format read from the feed with
nowhere to feed it is dead the same way in the other direction.

## Decision

`FetchedItem` (`src/schema/item.ts`) gains `format: z.string().min(1)`,
defaulting to `"article"` so every fixture item written before this field
existed - including `fixtures/determinism/items.fixture.json` - still parses
unchanged. The real RSS fetch (`src/fetch.ts`) derives it from the item's
`<enclosure>` MIME type: a `video/*` prefix maps to `"video"`, `audio/*` to
`"podcast"`, anything else (including no enclosure at all) to `"article"`.

`selectAndRank` (`src/select.ts`) reads it as a fourth ranking axis alongside
depth, source weight, and recency: an item whose format appears earlier in
`preference.formats` ranks higher, all else equal. A format absent from that
list ranks below every listed format rather than being excluded - the same
treatment `sources` already gives an unlisted source id (weight 1, not
rejection), and consistent with `docs/research/3-state-and-source-schema.md`
calling `formats` a preference ordering, not a filter. `min_recency_days` is
the one hard cutoff among the four axes; format is not another one.

## Consequences

**Easier:** `preference.formats` is live configuration instead of dead
configuration - a hand-edit to its ordering now visibly changes which items
rank first, the same way editing `depth` or a source weight already does.
Real fetched items and stub items in tests both carry the field a test can
assert an ordering against (see `tests/select.format-axis.test.ts`).

**Harder:** a fixture or a feed that wants to be ranked as anything other than
the article/video/podcast split above has to say so with a matching
`preference.formats` entry; the mapping from MIME type to format string lives
in `src/fetch.ts` and is the one place a new content kind (e.g. a `report`
PDF, which `docs/research/3-state-and-source-schema.md`'s own example
`formats` list already anticipates) has to be taught to classify.

**Ruled out later:** `format` is an open string, not a fixed enum,
specifically so a not-yet-classified value degrades to "ranks last" rather
than failing item parsing outright - see the alternative below.

## Alternatives rejected

**Remove `preference.formats` from the schema instead of wiring it (this
issue's other named option).** Rejected because `docs/research/`
`3-state-and-source-schema.md` already committed `formats` as one of four
designed preference axes, and #4's merge commit flagged it as *unfinished*,
not as a design mistake - removing a designed axis to avoid finishing it is
the bigger, quieter decision of the two, not the smaller one.

**A fixed enum for `format`** (`z.enum(["article", "video", "podcast"])`)
instead of an open string. Rejected because RSS enclosure MIME types are
open-ended (a `report` source might enclose a PDF, a format
`3-state-and-source-schema.md`'s own example `preference.formats` list already
names), and an enum would fail item parsing outright the first time a real
feed used one; an open string with a default keeps an unrecognized format
ranking last instead of breaking the fetch.
