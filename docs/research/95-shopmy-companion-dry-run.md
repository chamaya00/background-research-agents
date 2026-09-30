# ShopMy companion: dry run of one round in Actions

**Decision this serves:** whether the shopping companion described in
[`docs/shopper/companion.md`](../shopper/companion.md) should keep running as
a researcher issue in GitHub Actions, or move to a surface on the owner's own
device (for example a Claude Project), judged on one round run exactly as that
setup describes. Written for
[#98](https://github.com/chamaya00/background-research-agents/issues/98),
child of [#95](https://github.com/chamaya00/background-research-agents/issues/95).
Run on 2026-09-30.

**Inputs, as the issue set them:**

- **Need:** new women's footwear to wear every day.
- **Creator links (O4-cleared, fetched once each):**
  - https://shopmy.us/shop?Curator_id=70850&tab=latest
  - https://shopmy.us/shop?Curator_id=63222&tab=collections&Section_id=183978
  - https://shopmy.us/shop?Curator_id=497127&tab=latest
- **Profile:** none. No taste data exists yet, so every "why" below is
  "none yet".

Deviation from the setup, set by the issue: the round is written here rather
than under `docs/shopper/rounds/`, and the fetch record sits in this document
(Findings) rather than only in the pull request body.

---

# Round 1: everyday women's footwear

## Picks - 2 of 3

**Two picks, not three.** A third candidate (HOKA Clifton 10) was dropped:
its product page on `hoka.com` failed to load (WebFetch error
`Parse Error: Header overflow`), so neither the price nor the domain could be
confirmed from the brand's side, and [`link-safety.md`](../shopper/link-safety.md)
says a pick whose domain cannot be confirmed is shown without a link or
dropped. A fourth candidate (Rothy's RS02 Sneaker) was dropped because its
product URL on `rothys.com` came back as the women's sneakers category page
with no product and no price, so there was nothing to price. Two honest picks
beat a padded third.

Both picks came from search alone. The three creator pages returned no
product content (Findings §1), so nothing below was picked by a creator the
owner follows, and no pick carries an affiliate link.

### 1. On - Women's Cloud 6, White | White

| Field | |
|---|---|
| **Item** | On, "Women's Cloud 6 White \| White" |
| **Price as listed** | $160.00 as listed on on.com, 2026-09-30. No sale price shown on that page. |
| **Link** | https://www.on.com/en-us/products/cloud-6-3wf1006/womens/white-white-shoes-3WF10061200 - clean link - no affiliate. |
| **Why** | none yet. |
| **Found via** | search. |
| **Size** | Not checked. No Sizes search term used (none exists). Check size at the store. |

### 2. Allbirds - Women's Tree Runner, Kaikoura White

| Field | |
|---|---|
| **Item** | Allbirds, "Women's Tree Runner" (Kaikoura White colourway, per the URL) |
| **Price as listed** | $100 as listed on allbirds.com, 2026-09-30. |
| **Link** | https://www.allbirds.com/products/womens-tree-runners-kaikoura-white - clean link - no affiliate. |
| **Why** | none yet. |
| **Found via** | search. |
| **Size** | Not checked. No Sizes search term used (none exists). Check size at the store. |

### Links: lookalikes

**No lookalike domain was seen in this run.** Every host that appeared in the
searches was `shopmy.us`, a brand's own domain (`hoka.com`, `on.com`,
`rothys.com`, `allbirds.com`), a named known retailer (`walmart.com`), or an
editorial site not used as a link (`treelinereview.com`, `runrepeat.com`,
`wwd.com`, `today.com`, `styleguru.org`, `forbes.com`,
`curationmonetized.substack.com`, `prnewswire.com`, `roxannecarne.com`,
`instagram.com`, `apps.apple.com`, `wikipedia.org`). The two known ones from
#95, `unofficed.com` and `elearn.nptel.ac.in`, did not appear. **Caveat:** the
brand searches were restricted to the brand's own domain, which is also why
nothing lookalike could appear in them. Only the one open search
("best women's everyday shoes 2026 comfortable walking sneaker") could have
surfaced one, and it did not.

### Proposed

None this round. Nothing was read from a creator page, so there is nothing a
proposal could be "similar to".

## Interview questions - round 1 (intake only)

Round 1 has no purchase history, so these are about the need itself
([`companion.md`](../shopper/companion.md), "When the interview questions
come"). Four, not five: a fifth about size is left out because Sizes is a
private line (O4) and the answer could not be written here.

1. **What does "every day" mean for you - mostly walking, standing at work,
   school runs, errands, something else?**
2. **What do you wear most days now, and what do you like about it?**
3. **What would you not wear - a colour, a chunky sole, laces, a logo?**
4. **Is there a price above which you would not buy everyday shoes?**

## Profile lines these answers would create

Proposals for the owner to approve, in the template's syntax
([`profile-template.md`](../shopper/profile-template.md)). None is written by
this run.

| Q | Section | Line an answer would add | Effect |
|---|---|---|---|
| - | **Wants** | `W1` · open · "new women's footwear to wear every day" · budget `<from Q4>`. *Round 1 issue #98, 2026-09-30.* | **Gates**: a round serves only an open Want. Created by this round's need, not an answer. |
| 1 | **Style** | `<occasion, e.g. all-day walking on pavement>`. *Round 1 interview Q1, <date>.* | **Re-ranks** (cushioned walking shoes above fashion sneakers, or the reverse). Never gates. |
| 2 | **Style** | `<silhouette, colour, material liked, e.g. low-profile knit sneaker, white>`. *Round 1 interview Q2, <date>.* | **Re-ranks.** This is the line that would let a "why" stop saying "none yet". |
| 2 | **Owned** | `<category or colour>` · plenty. *Round 1 interview Q2, <date>.* | **Re-ranks** near-duplicates lower and changes wording ("you have ..."). Never gates. |
| 3 | **Style** | `<disliked detail, as a preference, e.g. prefers slim soles>`. *Round 1 interview Q3, <date>.* | **Re-ranks.** Becomes a **Not interested** line (gates) only if the owner says "stop showing me", shown as a diff first. |
| 4 | **Budget** | `footwear` · up to `<$ amount>`. *Round 1 interview Q4, <date>.* | **Gates.** Round 1 had none, which is why a $160 pick was eligible. |

## What the run could not do

- **Read any creator.** All three ShopMy links returned an empty page
  (Findings §1). No product, no shelf, no `go.shopmy.us` link.
- **Price HOKA.** `hoka.com` product page: `Parse Error: Header overflow`.
- **Price Rothy's.** `rothys.com/products/the-womens-rs02-sneaker-bright-white`
  came back as a category page with no product.
- **Use the Shop catalog.** No shell, no Shop CLI, no POST (Findings §4).
- **Check size or stock.** Not attempted, by decision (O3).

---

# Findings

Every fetch in this run went through the WebFetch tool and every search
through WebSearch. **Where the request leaves from is an inference:** WebFetch
in Claude Code is the agent's own tool and this run's container is the Actions
runner, so "reachable from the runner" below means "reachable to this run's
WebFetch". The tool does not print the HTTP status code of a successful
response or the IP it left from, so no status code is quoted where none was
shown.

## 1. What each creator link returned

| Link | Fetched | What came back | Product content? | Creator content? |
|---|---|---|---|---|
| `shopmy.us/shop?Curator_id=70850&tab=latest` | once | No error. Body empty: no text, links, names or prices. | No | No |
| `shopmy.us/shop?Curator_id=63222&tab=collections&Section_id=183978` | once | No error. Body empty; "only a JavaScript shell". | No | No |
| `shopmy.us/shop?Curator_id=497127&tab=latest` | once | No error. Body empty. | No | No |

This matches #92 §1 exactly. No link was fetched twice, and no page rendered.
Because the bodies were empty there was **no `go.shopmy.us` redirect to
follow**, so none was fetched.

## 2. Whether the creators could be identified

**One of three, by search engine, not by the page.**

- **70850: identified.** A web search for `shopmy "Curator_id=70850"`
  returned a result titled "Sophia Chang's Handpicked Recommendations | ShopMy"
  at `https://shopmy.us/shop?Curator_id=70850`, plus a product URL under that
  curator (`shopmy.us/shop/product/2826547?Curator_id=70850`). That product
  URL was **not fetched**: it is a shelf the owner did not supply. The name is
  the public title of a link O4 already cleared; the search snippet also
  carried the creator's own body measurements, which are deliberately not
  repeated here.
- **63222 and 497127: not identified.** One search for either number beside
  "shopmy" returned no result naming them. No further search was run.

This **contradicts** [`companion.md`](../shopper/companion.md) ("Where this
may not belong"), which records #95's interactive run finding `Curator_id`
links "unindexed by any search engine". At least one is indexed, with its
bare `?Curator_id=` form. The difference is probably the query shape (quoted
parameter), which is an inference.

## 3. Reachability by domain

| Domain | Tried? | Result |
|---|---|---|
| `shopmy.us` | Yes, 3 GETs | **Reachable**, returned without error; bodies empty (client-rendered). |
| `go.shopmy.us` | **Not tried** | No redirect link was found to try. Not a finding about reachability. |
| `catalog.shopify.com` | **Not tried** | Not exercised through its API or otherwise (§4). |
| `on.com` | Yes, 1 GET | **Reachable**, product name and price read. |
| `allbirds.com` | Yes, 1 GET | **Reachable**, product name and price read. |
| `rothys.com` | Yes, 1 GET | **Reachable**, but the product URL returned a category page, no price. |
| `hoka.com` | Yes, 1 GET | **Not read**: `Parse Error: Header overflow`. The server answered with headers larger than WebFetch parses; this is a tool limit, not a block, and is not the same as unreachable. |
| `walmart.com`, `amazon.com`, `target.com`, other retailers | **Not tried** | Appeared in search only (walmart.com), never fetched. |

## 4. What this role cannot do

**The researcher role has no shell.** Its tool grant is Read, Glob, Grep,
Write, Edit, WebFetch, WebSearch and GitHub issue/PR tools
([`.claude/agents/researcher.md`](../../.claude/agents/researcher.md)). It
**cannot run `@shopify/shop-cli`** and **cannot call the
`catalog.shopify.com` endpoint**, which is MCP over POST while WebFetch sends
only GET (#86 §4). **`catalog.shopify.com` was therefore not exercised through
its API** in this run.

Stated so nobody mistakes it for a route: the Actions harness for this run
did also hand the session a Bash tool, used here only for `git` and `gh`
(committing this file and opening the pull request). It was **not** used to
fetch anything, install the Shop CLI, or POST to the catalog. Using it that
way would route around the role's grant and the issue's instruction, and would
make the companion depend on a harness detail rather than on the role.

## 5. What the owner must supply next time

- **Product links, not creator links.** `go.shopmy.us/p-<id>` links (from the
  app's share button) or the retailer URL. A redirect reveals the retailer
  and makes a creator-picked, affiliate-labelled pick possible; a creator page
  gives nothing to a non-rendering fetch.
- **A written description of what they liked on those shelves**, in their own
  words, since the shelves cannot be read. Not a screenshot
  ([`privacy.md`](../shopper/privacy.md)).
- **Answers to the four intake questions above**, so a "why" can name a line.
- **A budget** for footwear, so Budget can gate.
- **Sizes, privately only.** Not in this repository (O4).

## 6. A defect in the setup, reported and not fixed here

[`link-safety.md`](../shopper/link-safety.md) confirms a brand's domain "by
the brand's own pages linking to it" or by an owner-supplied redirect. With no
redirect, the first test is circular: a lookalike's pages also link to
themselves. In this run `on.com` and `allbirds.com` were accepted because the
brand-restricted search and the fetched product page agreed, which is judgement
the rule does not describe. A non-circular test (for example: the brand's
domain as linked from a named known retailer's product page, or from the
brand's own verified social profile) is the owner's or the driver's call, so
`docs/shopper/` is left unchanged by this pull request.

---

# Verdict

**The Actions-researcher route does not work as a companion. It works only as
a public, profile-free test harness, and the companion belongs on the owner's
own device (a Claude Project or a local session).**

Evidence from this run:

- **The ShopMy input produced nothing.** Three of three creator links came back
  empty. Everything the owner is actually doing in ShopMy - the shelves, the
  picks, the creators' taste - was invisible to the round. The picks came from
  plain web search, which is what the setup predicted the round would reduce to.
- **The one thing that could make it work cannot be public.** A useful round
  needs a Style line, a Budget and a Size. Two of those are fine here; the
  third, and any screenshot of what the owner is looking at, is barred from
  this repository by O4. A round on the owner's device reads their real
  screenshots and profile privately.
- **The one API route is closed to the role.** No shell, no Shop CLI, no
  catalog POST. Changing that is a factory change to the role grant.
- **The round is slow for a shopping moment.** An issue, a queue, a run and a
  pull request is the wrong latency for "I'm looking at shoes in the app now".

**The strongest case against, which I looked for:** the route did deliver two
priced, safe, correctly labelled picks from brand domains, with a lookalike
check and an honest "none yet" - the discipline worked. And one creator was
identifiable from a search index, so a creator's name can seed a search even
when the page cannot be read. That is a real, repeatable capability. But it is
equally available on the owner's device, where it comes without the public
exposure.

**What would flip it:** the owner supplying `go.shopmy.us` product links and
being content to keep the whole profile public-safe; or the researcher role
gaining a shell (a factory change), so the Shop catalog can be searched and
the runner does something a phone session cannot.
