# Shopper profile - template

The state a shopping round reads and a reaction writes, per
[`companion.md`](companion.md). Sections come from
[#87 §2](../research/87-personal-shopper-reuse-interview-verdict.md) and
[#92 §4](../research/92-shopmy-creators-and-discovery.md), updated for the
owner's decision on #95 that the owner confirms size by clicking through,
and nothing here does.

**This file is a template. It holds placeholders only.** A real profile
never lives in this public repository - see [`privacy.md`](privacy.md). Copy
this file to the private location, fill it there, and paste into a round's
issue body only the lines O4 allows to be public.

Every `<angle-bracket>` value is a placeholder. Every line carries its date
and where it came from, in italics, as `docs/reader/profile.md` does.

## The three axes

| Section | Gates? | Re-ranks? | Wording? | Written by |
|---|---|---|---|---|
| **Wants** | **Yes**: a round serves only an open Want | No | No | Owner, in a reaction or a round's need |
| **Budget** | **Yes** | No | No | Owner |
| **Not interested** | **Yes** | No | No | Only a reaction that says "stop showing me", shown as a diff first |
| **Declined proposals** | **Proposals only**, never products | No | No | Owner, rejecting a proposal |
| **Sizes** | No | No | **Search term** (see below) | Owner; interview Q1 |
| **Style** | No | **Yes** | No | Reactions; the owner's description of what they like |
| **Creators** | No | **Yes**: a pick a followed creator made ranks above an equal one | **Yes**: "picked by <creator>" | Owner, by naming; an adopted proposal |
| **Brand notes** | No | **Yes**, within the brand and category named | **Yes**, shown beside the item | Interview Q2-Q4 |
| **Owned** | No | **Yes**, near-duplicates rank lower | **Yes**: "you have ..." | Interview Q1, Q5 |
| **Knowledge** | No | No | **Yes** | As in `docs/reader/profile.md` |
| **Format** | No | No | **Yes** | Owner |

**Gates** means an item can be left out. **Re-ranks** means it moves but
stays eligible. **Wording** means only what is said about it changes. What
the owner already has or knows never gates (#87 §2, "Owned never gates").

## Gate

### Wants

- `<want-id>` · open · "<the need in the owner's words>" · budget `<Budget line or none>`.
  *<Source: round n issue / reaction>, <YYYY-MM-DD>.*

### Budget

- `<category>` · up to `<$ amount>`.
  *<Source>, <YYYY-MM-DD>.*

### Not interested

- `<thing to stop showing>`.
  *"<the owner's own words>", round <n>, <YYYY-MM-DD>.*

### Declined proposals

- `<creator handle or style>` · not proposed again.
  *"<the owner's own words>", round <n>, <YYYY-MM-DD>.*

## Re-rank

### Style

- `<silhouette, colour, material or detail liked>`.
  *<Source>, <YYYY-MM-DD>.*

### Creators

- `<platform>` · `<creator name or handle>` · `<public link, only if cleared under O4>`.
  *<Source>, <YYYY-MM-DD>.*

### Brand notes

- `<brand>` · `<category or material>` · `<fit or durability note>`.
  *Interview Q<n>, round <n>, <YYYY-MM-DD>.*

### Owned

- `<category or colour>` · plenty.
  *<Source>, <YYYY-MM-DD>.*

## Wording

### Sizes

**A Sizes line is a search term with a 90-day expiry.** Its only use is to
be added to a search query, so results come back in the owner's usual size
range. It is never used to leave a result out. The owner confirms size by
clicking through.

- `<category>` · search term "`<size words as they would be typed into a search>`" · as of `<YYYY-MM-DD>` · expires `<YYYY-MM-DD + 90 days>`.
  *<Source>, <YYYY-MM-DD>.*

Expiry: after 90 days the line is **not used as a search term** until the
owner re-confirms it, and interview Q1 asks "is this size still right?" at
the next round. A line is never silently extended. A search without a size
term is a valid search; it only returns a wider spread.

A real Sizes line is a body size and **never appears in this public
repository** (O4).

### Knowledge

- `<what the owner already knows and does not need explained>`.
  *<Source>, <YYYY-MM-DD>.*

### Format

- Up to 3 picks per round, each with price as listed and where, one link with affiliate status labelled, and a "why" naming a profile line or "none yet".
  *Default from companion.md.*
- Interview follow-ups at 7 and 21 days after arrival.
  *Default from #87 §3.*
- `<proposals per round: at most one>`.
  *Default from #92 §4.*

## Retired

Lines taken out, kept with the reason, so the reason survives.

- ~~`<old line>`~~ · retired `<YYYY-MM-DD>` · "<the owner's own words>".
