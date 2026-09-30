# The shopping companion

**Decision this serves:** how one shopping round runs for an owner who
finds things in the ShopMy app and wants an assistant beside it, using only
what this repository already runs (the researcher agent in GitHub Actions),
and what that route must not do. Written for
[#97](https://github.com/chamaya00/background-research-agents/issues/97),
child of [#95](https://github.com/chamaya00/background-research-agents/issues/95).
It builds on [#86](../research/86-personal-shopper-intake-and-product-search.md),
[#87](../research/87-personal-shopper-reuse-interview-verdict.md) and
[#92](../research/92-shopmy-creators-and-discovery.md), and follows the shape
of [`docs/reader/loop.md`](../reader/loop.md).

**Status: a draft, not yet run.** Nothing here has been exercised. The dry
run in #95 is the first round through it, and its findings decide whether
this route stays (see "Where this may not belong").

This file is the mechanic. Its siblings:

- [`profile-template.md`](profile-template.md) - the state a round reads
  and a reaction writes. Placeholders only.
- [`link-safety.md`](link-safety.md) - which links a pick may carry.
- [`privacy.md`](privacy.md) - what may never enter this public repository,
  and where real use should live.

## Owner decisions this rests on

Taken on #95 on 2026-09-30, after #92, and written down nowhere else before
this file:

- **O1:** US market.
- **O2:** free or free tier only. The one paid tool is Claude through the
  owner's Max-plan token.
- **O3:** no stock check and no size check. A pick shows its price **as
  listed**, with where it was listed. The owner checks size by clicking.
- **Every store counts equally.** Because nothing is checked, a store the
  agent cannot read is no worse than one it can. Amazon, Walmart and Target
  are in, **as links only**.
- **The Sizes line is a search term with a 90-day expiry**, not a filter.
  It goes into the query ("women's size 8 walking sneaker"); it never drops
  a result.
- **Companion direction.** The owner uses the ShopMy app. The assistant
  takes what they share - product links, creator names or handles, shelf
  screenshots, a need - and returns picks. **It never operates the app or
  the owner's account.**
- **O4:** only the three creator links in #95 may appear publicly. No
  photos, sizes, order history or children's data. See
  [`privacy.md`](privacy.md).

Two things #87 and #92 said that these decisions overturn, stated so nobody
reads the older documents as current:

- #87 §2 has Sizes **gate** selection for 90 days. Under O3 there is nothing
  to gate against, so Sizes becomes a search term (profile template, Sizes).
- #92 §5 keeps the Shop catalog as the searchable source with per-store
  `products.json` for size. Under O3 and the researcher's tool grant (below),
  neither is used. Plain web search and the owner's own links are the source.

## The limits, stated plainly

These are not worked around. A round that meets one says so in its output.

- **No shell.** The researcher role has Read, Write, Edit, WebFetch and
  WebSearch; `curl` was refused in #86 and #92, and the role definition
  grants no Bash.
- **No Shop CLI.** `@shopify/shop-cli` needs a shell and an install. It has
  never been run by anything in this repository.
- **No catalog endpoint.** `catalog.shopify.com` and every store's
  `/api/ucp/mcp` are MCP over POST; WebFetch sends only GET (#86 §4).
- **No stock check and no size check.** By decision (O3), and in any case
  #92 §3 found size and stock travel in no link, only on the retailer's own
  page, and several retailers refuse a runner (Amazon 503, Walmart CAPTCHA).
- **No rendering.** ShopMy pages are a JavaScript app and came back empty to
  WebFetch every time #92 tried (#92 §1). A round expects that again.
- **No reading of the owner's images in this repository.** A screenshot
  attached to a public issue is public. See [`privacy.md`](privacy.md).

Changing any of these is a change to a role's tool grant or a workflow,
which is a factory change and outside this setup.

## One round

### How a round is started

**An issue the existing researcher agent runs on. No new workflow.** The
`agent-run` workflow already starts the researcher on a labelled issue.

- **Title:** `Shopper round <n>: <the need in a few words>` - for example
  `Shopper round 1: everyday women's footwear`. The number is the round
  count; the need is the Want it serves.
- **Labels:** `role:researcher`, then `agent:queued` once the body is
  complete. Filed as a child of a `shopper` objective when one is open, so
  the orchestrator's usual readiness and reporting apply; the body is what
  matters to the run.
- **Assumption, not tested:** that a round issue works the same when the
  orchestrator queues it as when the owner adds `agent:queued` by hand. #95's
  dry run is the first test.

The run writes its output to `docs/shopper/rounds/<issue-number>-<slug>.md`
and opens a pull request, which is how every researcher run delivers
(researcher role, "Output"). The pull request is the round's permanent
record and the place the owner reacts.

### What the owner puts in it

The issue body carries, in this order:

1. **The need**, in the owner's words: "new everyday shoes", with any
   occasion or budget they want to say out loud. Becomes or matches a Want.
2. **What they found in ShopMy, as links.** Any of:
   - product links (`go.shopmy.us/p-<id>` or the retailer's own URL);
   - creator links of the form `shopmy.us/shop?Curator_id=<n>`, or a creator
     name or handle. **Only creators the owner has cleared for public use**
     (O4 - today, the three in #95);
   - a description of a shelf. Not a screenshot: see
     [`privacy.md`](privacy.md).
3. **The current profile**, pasted in full from wherever the owner keeps it.
   A run reads the default branch and the issue it was queued on (loop.md
   step 1), so the body is the one injection point. In this public
   repository that profile may hold only what O4 allows, which today is
   close to nothing - that is expected, and the "why: none yet" rule below
   is what keeps it honest.
4. **What was bought or kept since the last round**, only if the owner
   wants the interview to follow it up, named by product and store, never
   an order number or a size.

A round with only a need and no links is valid. It is a weaker round: the
picks come from search alone.

### What the run may fetch and must not

ShopMy's terms forbid "any program, spider, 'bot,' or other automatic
device to gather or 'harvest' information" and "systematic retrieval of
data" (#92 §1). The run acts for the owner on what the owner handed it, and
nothing more.

**May:**

- **Fetch each ShopMy link the owner supplied, once.** Record what came
  back, including an empty body.
- **Fetch each `go.shopmy.us` redirect it finds** - in the owner's body or
  in a page it was given - once, to read the retailer from the `Location`
  header (`u=` for Impact hosts, `murl=` for Rakuten, the destination itself
  for Amazon; #92 §3). It does not need to load the retailer to know it.
- **Run web searches** for the need, using profile lines as search terms
  (Sizes, Style, Budget).
- **Fetch a product page** on a domain that passes
  [`link-safety.md`](link-safety.md), once per candidate, to read the price
  as listed. If it refuses (403, 503, CAPTCHA, empty), the pick falls back to
  the price as listed somewhere else, or says "price not read".

**Must not:**

- **Crawl.** No second fetch of a ShopMy page, no pagination, no tabs other
  than the one in the link given.
- **Follow into other creators or shelves.** A link on a supplied page that
  leads to another creator, collection or shelf is not fetched, even if it
  looks relevant. It may be named as a proposal (#92 §4) for the owner to
  supply next round.
- **Render, log in or act.** No headless browser, no account, no wishlist,
  no follow, no add-to-cart, no checkout. The companion never operates the
  app or the owner's account.
- **Fetch LTK creator pages** unless the owner supplied that exact link.
  LTK's terms also forbid a "manual process to monitor or copy" (#92 §2).
- **Check size or stock**, even where a page would show it (O3).
- **Show any link that fails [`link-safety.md`](link-safety.md).**

### The output shape

One document per round at `docs/shopper/rounds/<issue-number>-<slug>.md`,
content only. Fetch records and process notes go in the pull request body,
as loop.md step 2 sets for briefs.

**Picks - up to 3.** Fewer is allowed and better than a padded third. For
each pick:

| Field | What it says |
|---|---|
| **Item** | Brand and product name as the listing gives them. |
| **Price as listed** | The price exactly as shown, and **where it was listed** - "$98.00 as listed on rothys.com, 2026-10-01" or "$89.99 as listed in the creator's ShopMy link text, not confirmed at the store". A creator's price can be stale (#92 §3 found one $158 off), so the source is part of the price. "Price not read" when nothing could be read. |
| **Link** | One URL on the brand's own domain or a named known retailer, per [`link-safety.md`](link-safety.md). **Affiliate status labelled**: either "affiliate link - <creator> earns a commission" (the owner's supplied `go.shopmy.us` link) or "clean link - no affiliate". When the pick came through an affiliate link, both are given, and the owner picks (#92 §3). |
| **Why** | One sentence tied to a **named profile line** - "Style: *low-profile white sneakers* (Style line 1)" or "Creators: picked by <creator>" - **or the literal words "none yet"** when no profile line supports it. Inventing a style match to fill this field is the failure the field exists to catch. |
| **Found via** | "owner's link", "redirect from the owner's link", or "search". One clause, as loop.md asks of briefs. |
| **Size** | Not checked. The Sizes search term used, if any, and "check size at the store". |

**Proposed** (optional, at most one). A creator or style the round came
across and did not follow, labelled "Proposed: similar to X, because Y" per
#92 §4. Never a pick, never fetched further.

**Interview questions.** The questions this round asks, at most five, per
"When the interview questions come" below. A round with nothing owed says
"none this round".

**Profile lines these answers would create.** For each question, the exact
line an answer would add, in the template's syntax, with its section and
whether it gates, re-ranks or changes wording. These are proposals the owner
approves, not writes.

**What the run could not do.** Every limit it met, named: which fetch came
back empty, which retailer refused, which link failed link safety and why.

### How a reaction becomes a profile change

Loop.md steps 4-7, unchanged in substance:

1. **One sentence back**, on the round's pull request or issue. "The second
   pair is too chunky" is a whole reaction.
2. **The driver translates it into a diff against the profile and shows it
   before committing.** The translation says which section, and whether the
   line gates, re-ranks or only changes wording. "Too chunky" becomes a
   **Style** line that re-ranks ("prefers slim soles"), never a **Not
   interested** line that gates, unless the owner said "stop showing me".
   #87 §4 walks two sentences through this and is the reference.
3. **The owner approves the diff.** Nothing is committed on silence. A diff
   that would put a size, a photo description, an order or anything about a
   child into this public repository is not shown here at all; it is
   applied only where [`privacy.md`](privacy.md) says real use lives.
4. **Committed as one change, with the reaction's own words** in the commit
   message beside the line it produced, so the profile's history is the
   reaction log (loop.md step 7).

The rule that carries over intact from the reader loop: **what the owner
already has or knows changes wording and ranking, never what is fetched**.
Only an explicit "stop showing me X" gates, and only after its diff (#87 §4).

### When the interview questions come

**At most five per round**, as #87 §3 sets, asked at the start of the round
so that answers land before the next picks are made, and **timed to the
garment**:

| # | Question | Asked when | Becomes |
|---|---|---|---|
| 1 | Which of last round's picks did you buy, and did you keep it? | The round after a pick; and whenever the Sizes line is past its 90 days, as "Is this size still right?" | Owned, and a refreshed Sizes search term (private only) |
| 2 | How does it fit - true to size, small, big, and where? | At least 7 days after it arrived | Brand notes: re-ranks and wording |
| 3 | After a few wears or washes, how has it held up? | At least 21 days after it arrived | Brand notes: re-ranks within brand and material |
| 4 | Would you buy from this brand again? | With Q3, once per brand per quarter | Brand notes; gates only on "never again" plus a confirmed diff |
| 5 | You bought it through <creator>'s link - did it look like it did on them? | Only when the item came from a creator's link (#92 §5) | Creators wording line |

When more than five are owed, this order is the priority. **Round 1 has no
purchase history, so it asks only intake questions** - at most five, about
the need itself (occasion, budget, what the owner wears now and likes), each
with the profile line it would create. Nothing about a child is asked;
children are out of scope (#95).

Footwear is worn from day one and shows wear sooner than clothes; **the 7-
and 21-day thresholds are #87's, set for toddler clothes, and are the
owner's to move** by a Format line.

## Where this may not belong

**Inference, to be tested by #95's dry run:** this route may not survive the
first round. #92 found every ShopMy page empty to WebFetch, and #95's
interactive run found `Curator_id` links unindexed by any search engine. If
the three creator links come back empty and the owner's `go.shopmy.us`
product links are the only thing that resolves, the round reduces to "web
search for the need, with the owner's product links as seeds", and a Claude
Project or local session on the owner's own device, reading their real
screenshots privately, does that at least as well with none of the public
exposure. [`privacy.md`](privacy.md) already recommends where real use
lives; the dry run's verdict decides whether the Actions route is kept only
for public, profile-free test rounds like #95's.
