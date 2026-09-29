# Personal shopper: ShopMy (vs LTK) as the women's product source, and discovery of similar creators and styles

**Decision this serves:** whether #87's first version changes its women's
product source from the Shopify Shop catalog to the creators the owner
follows on ShopMy (with LTK as the rival), and whether "find me similar
creators and styles" can be added without ever narrowing the profile. Child
of [#91](https://github.com/chamaya00/background-research-agents/issues/91).
It builds on [#86](86-personal-shopper-intake-and-product-search.md) and
[#87](87-personal-shopper-reuse-interview-verdict.md) and does not redo them.

**Status:** first pass, run 1 of 3 on
[#92](https://github.com/chamaya00/background-research-agents/issues/92),
2026-09-29. The ranking stopped moving after the redirect chains were
followed: every link after the first three said the same thing. Not
reached: any ShopMy creator page's content (every one came back empty), the
LTK developer portal (login page only), and both platforms' privacy-request
forms. What I would read next is one ShopMy creator page in a real browser
on the owner's machine, which is the only way to see what a shelf shows.

**Constraints, not guesses:** O1 US market. O2 free tier only, with Claude
on the owner's Max plan as the one paid tool. O3 the runtime is local
sessions in a private repository (#87). O4 the creator pages are public
creators picked here, not the owner's follows. **Guesses in the issue:**
that ShopMy is the right frame (it turns out LTK is the one an agent can
read), and that "product source" is the role a creator plays. The finding
below is that a creator is a **taste input and a link source**, not a
catalog.

## Headline

1. **ShopMy cannot be read by an agent at all.** Every public ShopMy page
   fetched (four creator and collection pages) returned an empty body: it
   is a JavaScript app. Its API is real, documented, and closed: "Our API
   access is not yet publicly available", "no API key for creators at this
   time", and its scopes only read the signed-in user's **own** links,
   collections and profile. There is no endpoint for follows. Its terms
   forbid "any program, spider, 'bot,' or other automatic device".
2. **LTK is readable, and its terms are stricter.** A public LTK creator
   page came back as server-rendered HTML: bio (with the creator's own
   sizes), follower count, and each product with a name and price. But
   LTK's terms forbid "any robot, spider, other automatic device, **or
   manual process** to monitor or copy our web pages".
3. **The final retailer survives every affiliate redirect, in plain
   sight.** All six links followed went through one or two affiliate hops
   (Rakuten, Impact), and each hop carried the retailer's product URL as a
   query parameter (`murl=`, `u=`). You can read the retailer without
   landing on it. **Size and stock do not travel in any link.** They are
   only on the retailer's own page.
4. **Creators' picks land mostly where #86 could not go.** Of the retailers
   the sampled picks resolved to: Amazon, Walmart and Nordstrom (three of
   #86's four unreachable ones), plus Shopbop, Bloomingdale's, Neiman
   Marcus, Sephora and Loft. One was on Shopify (Tuckernuck). A creator
   route widens the retailer mix, which is its value. It widens it toward
   exactly the stores where the agent cannot check a size.
5. **Verdict: ShopMy adds to the Shop catalog as an input, and does not
   replace it as a source.** The owner pastes a creator's link or a
   screenshot of a shelf, the agent reads the retailer out of the link, and
   it checks size only where the retailer allows. The Shop catalog stays the
   searchable source. Discovery is feasible only as proposals the owner
   adopts, built on what the owner pastes.

## How reachability was tested

This run executes in GitHub Actions (run
[36608364702](https://github.com/chamaya00/background-research-agents/actions/runs/36608364702)),
not on the owner's machine, which is where O3 puts the shopper. So a fetch
here answers "does this answer a datacenter IP through WebFetch", which is a
lower bound on what a local session sees. `curl` was refused by this run's
permissions ("requires approval"), as it was for #86, so every probe went
through WebFetch. WebFetch returns cross-host redirects to the caller rather
than following them, which is how each hop of every affiliate link below was
recorded.

Citations are labelled **[official]** (the platform's own terms, help,
developer or app-store page) or **[third-party]**. All fetched 2026-09-29.

## 1. ShopMy: what a shopper and an agent can reach

| Question | Answer | Source | URL fetched → result |
|---|---|---|---|
| **What a creator's public shop page, shelves and collections expose** (price, retailer, link, size) | **Nothing an agent can read.** Every page returned an empty body to this run. Search engines index the page titles ("Alix Earle's Handpicked Recommendations \| ShopMy"), so the content exists and is rendered by JavaScript. **Inferred, not seen:** a shelf shows a product image, a name, and a `go.shopmy.us/p-<id>` link. Price and size on a shelf could not be established. | Page fetches **[official]**; the titles from search result listings | `shopmy.us/alixearle` → empty. `shopmy.us/cvazzana/latest-finds` → empty. `shopmy.us/erikaveurink/shelves` → empty. `shopmy.us/collections/274735` → empty. `shopmy.us/shop/collections/3071588` → empty. `shopmy.us/shops` → empty. |
| **Whether a shopper can see or export the list of creators they follow** | **See: yes, in the app. Export: no route found.** Shoppers follow creators through **Circles**: the app connects shoppers with "curated products all recommended by your Circles — the creators, editors, and experts whose taste you already love". "An account is required to use features like Wishlists and Circles." No page describes exporting Circles. | [App Store listing, official](https://apps.apple.com/us/app/shopmy/id6443850511); [Creator Guide FAQ, official](https://guide.shopmy.us/circles-wishlist-latest-finds-and-more/5jLY2jskGAENwEWJEf147B/faqs/5kdVRoGw9nmmppW3uMKyRZ) | App Store → 200 (version 2.2.41, "1d ago"). Guide FAQ → 200. |
| **Whether any API, feed or structured data exists** | **An API exists, and it is closed and self-scoped.** Base `https://api.shopmy.us/v1/`, OAuth. "Our API access is not yet publicly available"; it is for "external partners"; "no API key for creators at this time". Scopes: `read_links`, `write_links`, `read_collections`, `write_collections`, `read_profile`. `GET /Collections` fetches "a user's ShopMy collections" (the authorised user's own) and returns `id, name, description, image, social_links, private, Section_id, url`, with no products. `GET /Profile` returns "the authenticated user's public ShopMy profile" with no followers or following. `GET /Catalog/search` (scope `write_links`) returns `title, image, brand`, and `retailers[]` with `name, domain, url, rate` (commission rate). **It returns no price and no size.** No RSS or public JSON feed was found. `robots.txt` is `Allow: /`; the sitemap lists blog and marketing pages and almost no creator pages. | [llms.txt index, official](https://docs.shopmy.us/llms.txt); [OAuth setup, official](https://docs.shopmy.us/reference/getting-started-with-your-api-1.md); [Fetch Collections, official](https://docs.shopmy.us/reference/fetch-collections.md); [Search Catalog, official](https://docs.shopmy.us/reference/search-catalog-1.md); [Fetch Profile, official](https://docs.shopmy.us/reference/fetch-profile-1.md) | All five → 200 (Markdown). `shopmy.us/robots.txt` → 200. `shopmy.us/sitemap.xml` → 200 XML. |
| **What ShopMy's terms say about automated access** | §8 Proper Use: "systematic retrieval of data from the Services without ShopMy's express written permission is strictly prohibited", and users "shall not: (i) use any program, spider, 'bot,' or other automatic device to gather or 'harvest' information", nor engage in "screen scraping" or "database scraping". Shoppers "may browse without registration". Last updated as rendered by the fetch: September 16, 2026. | [Terms of Service, official](https://shopmy.us/legal/terms-of-service) | `shopmy.us/terms` → 200, the homepage (the terms are elsewhere). `shopmy.us/legal/terms-of-service` → 200. |

**The robots.txt / terms conflict, stated rather than resolved.** `robots.txt`
permits every crawler everywhere; the terms forbid every bot. The first is a
signal to search engines. The second binds a user who accepts the terms.
**Inference:** the terms govern the owner, so the owner's agent should obey
them. The permissive `robots.txt` does not license the agent.

## 2. LTK: the same four questions

| Question | Answer | Source | URL fetched → result |
|---|---|---|---|
| **What a creator's public page and posts expose** | **Readable HTML.** The profile page `shopltk.com/explore/<handle>` gave the bio, follower count, and a product gallery with each product's **name, price and an `rstyle.me` or `on.ltk.com` link**. A post page listed each product with **name, brand and retailer name** and an `on.ltk.com` link, with no price, labelled "Paid links". **No size or stock field on either.** Some creators put their own sizes in the bio. | Page fetches **[official]** | `shopltk.com/` → 200, with `/explore/<handle>/posts/<id>` URLs. `shopltk.com/explore/leannebarlow` → 200. `shopltk.com/explore/leannebarlow/posts/68125b78-…` → 200. `shopltk.com/explore/kerrisaf` → 200. `shopltk.com/explore/caitlincovington` → **404** (the handle guessed from memory was wrong; not retried). |
| **Whether a shopper can see or export who they follow** | **See: yes, in the app. Export: no route found.** "Follow creators and friends with similar interests"; "Your Following feed … see posts only from the creators you choose to follow" (the second is from a search summary). No export described on the FAQ or the app listing. | [App Store listing, official](https://apps.apple.com/us/app/ltk-shop-trusted-recs/id1154027990); [FAQ, official](https://company.shopltk.com/en-gb/faqs) (creator-side only) | App Store → 200 (version 5.74.0, "3 hours ago"). FAQ → 200, no shopper-side answers. |
| **Whether any API, feed or structured data exists** | **APIs exist; access is not public.** The terms (§7) mention "third-party applications, which interface with LTK application programming interfaces ('LTK APIs')", which "LTK may change, suspend, or discontinue … at any time". The developer portal is a sign-in page. No public feed found. `robots.txt` is `Disallow:` (empty; everything allowed). | [Terms §7, official](https://company.shopltk.com/ltk-terms-of-service); [rewardStyle Developer Portal, official](https://api.rewardstyle.com/); an independent API profile exists, [api-evangelist/ltk, third-party](https://github.com/api-evangelist/ltk) (not read) | Terms → 200. `api.rewardstyle.com` → 200, "Welcome back!" sign-in only. `shopltk.com/robots.txt` → 200. `shopltk.com/terms` → **404**. |
| **What LTK's terms say about automated access** | §4: "systematic retrieval of data from the Services to create or compile … a collection, compilation, database or directory without express written permission of LTK is strictly prohibited"; "You agree that you will not use any robot, spider, other automatic device, **or manual process** to monitor or copy our web pages"; no "screen scraping", "database scraping". Last updated as rendered by the fetch: September 16, 2026. | [LTK Shopping Terms of Service, official](https://company.shopltk.com/ltk-terms-of-service) | → 200. |

### Side by side

| | ShopMy | LTK |
|---|---|---|
| Public creator page readable by an agent | **No** (empty body, JS app) | **Yes** (HTML with names, prices, links) |
| Price on the page | Not established | Yes on the profile gallery; not on posts; **can be stale** (§3) |
| Retailer on the page | Not established | Yes on posts; readable from every link (§3) |
| Size or stock on the page | Not established | **No**. Some creators state their own size in the bio |
| Follows visible to the shopper | Yes (Circles, account needed) | Yes (Following feed) |
| Follows exportable | No route found | No route found |
| API | Exists, "not yet publicly available", reads only the signed-in user's own data, catalog search has no price or size | Exists ("LTK APIs"), portal sign-in only |
| Public feed | None found | None found |
| Terms on automation | Forbids bots and systematic retrieval | Forbids bots **and "manual process to monitor or copy"** |
| `robots.txt` | `Allow: /` | `Disallow:` (empty) |
| Platform "similar" features | Circles, Latest Finds, brand and category filters; no "similar creators" found | Interest feeds, AI chat "shoppable ideas pulled from real creator posts", search that suggests creators, "Similar Product" on posts (from a search summary); no "similar creators" found |

## 3. What creators' picks give the shopper

**Creators picked (O4):** [Alix Earle](https://en.wikipedia.org/wiki/Alix_Earle)
(ShopMy; Wikipedia describes the "Alix Earle effect" on sales), Caroline
Vazzana (ShopMy; a 2025 Webby winner in fashion and beauty, per
[webbyawards.com](https://winners.webbyawards.com/2025/creators/individual-creator/fashion-beauty/332828/caroline-vazzana)),
Erika Veurink (ShopMy; found in a search of `shopmy.us`), and on LTK
`leannebarlow` (237.6K followers) and `kerrisaf` (220.9K followers), both taken
from LTK's own home page. The LTK two are not household names. They were
picked because LTK's home page featured them, which is at least LTK's own
choice. The ShopMy three are picked for being public and prominent.

**Everything on the ShopMy side is empty.** The three ShopMy creators'
pages, and two of Alix Earle's collections, returned no content (§1). So
the retailer and redirect questions for ShopMy were answered from one
`go.shopmy.us` link found in a public Facebook post, not from a named
creator's shelf. That is the gap this document is weakest on.

| Page | Retailers the picks are at | #86's unreachable four? | Final retailer survives the redirect? | Size or stock survives? |
|---|---|---|---|---|
| `shopmy.us/alixearle`, `shopmy.us/collections/274735` ("Recently Worn & Mentioned") | **Could not be read** | Unknown | Unknown | Unknown |
| `shopmy.us/cvazzana/latest-finds` | **Could not be read** | Unknown | Unknown | Unknown |
| `shopmy.us/erikaveurink/shelves` | **Could not be read** | Unknown | Unknown | Unknown |
| A ShopMy link from a public post, `go.shopmy.us/p-18704855` (creator unknown) | Loft | No | **Yes.** 302 to `loft.sjv.io/c/2340682/…?subId1=user-15762-pin-18704855-…&u=https%3A%2F%2Fwww.loft.com%2F…` (Impact). The retailer URL is the `u=` parameter. `subId1` carries the ShopMy user and pin ids. | No. `loft.com` → 404 "site is under maintenance" on the day. |
| LTK `leannebarlow`, profile | Nordstrom (Monica Vinader necklace); Quince; others not named on the gallery | **Nordstrom** | **Yes.** `rstyle.me/+qAY9…` → 307 to `nordstrom.sjv.io/c/116548/…?u=https%3A%2F%2Fwww.nordstrom.com%2Fs%2Fsnake-chain-necklace%2F6408244…` (Impact). | Not in the link. The Nordstrom page **did** render from this run (unlike #86's empty body): "One Size", "In stock". **Price mismatch:** LTK's gallery said $166.99, Nordstrom said $325.00. |
| LTK `leannebarlow`, post "Shopbop Fall Sale" | Shopbop, Bloomingdale's, Neiman Marcus, Tuckernuck, Sephora, Cult Gaia | No | **Yes.** `on.ltk.com/+mfP9…` → 307 to `click.linksynergy.com/deeplink?…&murl=https%3A%2F%2Fwww.shopbop.com%2F…` (Rakuten). `on.ltk.com/+H96_…` → 307 to linksynergy with `murl=https%3A%2F%2Ftnuck.com%2Fproducts%2Fgold-marisa-mini-pave-earring%3Fvariant%3D…` → 302 to `tnuck.com/…&utm_source=rakuten&utm_campaign=LTK`. | Not in the link. **Shopbop's page rendered with per-size stock**: "XXS: Only 1 left, XS: In stock, S: Sold Out, M: Sold Out, L: In stock, XL: Only 2 left", $285. **Tuckernuck is Shopify:** `tnuck.com/products/gold-marisa-mini-pave-earring.json` → 200, variant "Gold / OS", $195.00, but that endpoint has **no `available` flag**; `.js` → 503. |
| LTK `kerrisaf`, profile | Amazon (PUMIEY, Dokotoo), Walmart (No Boundaries, Free Assembly, Madden NYC) | **Amazon, Walmart** | **Yes.** `rstyle.me/+przd…` → 307 **straight to** `amazon.com/…/dp/B0DF46SKC6/…&tag=kerrisa-1-bg-20` (the creator's own Associates tag, no intermediate hop). `on.ltk.com/+cEb3…` → 307 to `goto.walmart.com/c/116548/…&u=https%3A%2F%2Fwww.walmart.com%2Fip%2F…` (Impact). | Not in the link. `amazon.com/dp/B0DF46SKC6` → 200 with the title, the body truncated, **no price or sizes read**. `walmart.com/ip/…` → **CAPTCHA** ("Activate and hold the button to confirm that you're human"), as in #86. |

**What this says, taken together.**

- **An affiliate link does not hide the retailer.** Every hop seen put the
  destination in a query parameter: `u=` for Impact (`*.sjv.io`,
  `goto.walmart.com`), `murl=` for Rakuten (`click.linksynergy.com`), or
  the destination itself for Amazon. **Inference:** an agent can read the
  retailer and product URL from the first redirect's `Location` header
  without visiting the retailer, which is one request to the creator
  platform's link host rather than a page load.
- **Size never travels in a link, and neither does a reliable price.** The
  one price compared was stale by $158 (LTK $166.99 vs Nordstrom $325.00).
  **Inference:** a creator page's price is the price when the creator
  linked it, so it is a hint, and the retailer's page is the price.
- **Where size can be checked is the retailer's question, not the
  platform's.** Shopbop and Nordstrom answered with stock from this run;
  Amazon gave only a title; Walmart gave a CAPTCHA; Loft was down. A local
  session on a home IP may do better at Amazon and Walmart (**inferred**
  from #86's datacenter-IP reading, not tested), and Target's terms still
  forbid any unapproved agent (#86 §4).
- **Buying through these links pays the creator.** Every link above carries
  a creator or network id (`tag=kerrisa-1-bg-20`, `subId1=user-15762-…`,
  `ranSiteID=…`). The terms say the shopper's price does not change: "the
  price for your audience remains the same" ([LTK FAQ,
  official](https://company.shopltk.com/en-gb/faqs)). ShopMy's terms require
  creators to make "clear and conspicuous disclosures" (§12), and LTK marks
  them "Paid links". The shopper should say "affiliate link, the creator
  earns a commission" beside each one, and should offer the clean retailer
  URL (the `u=` / `murl=` value) as an alternative, so the owner chooses
  whether the creator is paid. **Author's judgment:** default to the
  affiliate link for a creator the owner follows, since paying them is
  presumably part of why the owner follows them, and the clean link for a
  proposed one.

## 4. Discovery of similar creators and styles

The rule, from [ADR 0006](../decisions/0006-auto-breadth-mode.md) and
[`auto-breadth.md`](../reader/auto-breadth.md) ("What this mode may not do"):
**a followed path is a proposal until a reaction adopts it, and nothing is
adopted by default.** Carried here: a suggested creator or style never enters
a section that gates, and never replaces a creator the owner chose.

**Where proposals live.** Not in the profile. Each round's output gets a
short **Proposed** block, like auto breadth's "Candidate topics", and a
proposal becomes a profile line only through loop steps 4-7 (a sentence
back, a diff shown, a commit on yes). Two sections are added to #87's
shopper profile to hold what gets adopted:

| Section | Gates? | Re-ranks? | Wording? | Written by |
|---|---|---|---|---|
| **Creators** - creators the owner follows, per platform, with a handle | **No** | **Yes**: a pick a followed creator made ranks above an equal pick with no creator behind it | **Yes**: "picked by X, affiliate link" | Owner, by pasting or naming; an adopted proposal |
| **Declined proposals** - creators and styles the owner said no to | **Gates proposals only** (never re-proposed), never products | No | No | Owner, rejecting a proposal |

**Declined proposals is deliberately not Not interested.** "Don't suggest
her again" is not "don't show me anything she picked". Filing it under Not
interested would exclude products, which is the narrowing the issue forbids.

**Style** stays as #87 set it: it re-ranks, never gates. An adopted style
proposal is a Style line.

### The methods

| # | Method | Reachable? | Permitted? | Writes to | Gates? | How the owner adopts or rejects |
|---|---|---|---|---|---|---|
| 1 | **The platform's own "similar" features.** LTK: interest feeds, search that suggests creators, "chat about what you are looking for and get shoppable ideas pulled from real creator posts" ([App Store, official](https://apps.apple.com/us/app/ltk-shop-trusted-recs/id1154027990)). ShopMy: Circles and brand or category filters ([App Store, official](https://apps.apple.com/us/app/shopmy/id6443850511)). **No "similar creators" feature was found on either** | **Only in the app, signed in**; not to an agent | **Yes for the owner**, who is using the app as intended. **No for the agent** (both terms) | Nothing directly. The owner meets a creator in the app and pastes the handle | No | The owner pastes a handle with "add her". That is an adoption, shown as a diff to Creators |
| 2 | **Overlap in brands or products between creators.** Two creators who link the same brands, or the same product, are similar in the way that matters to a shopper | **LTK: the pages are readable** (§2). **ShopMy: no**. The same computation works on the links the owner pastes, from any platform | **LTK's pages: no.** "Manual process to monitor or copy" covers an agent reading a creator's gallery to compare it. **The owner's pasted links: yes**, it is their own capture | A **proposed** Creators line ("X links 4 of the 6 brands you kept from Y"), and **proposed Brand notes** | No, proposals only | "Yes, follow X" adds a Creators line. "No" adds a Declined line. Silence leaves it in Proposed for one more round, then it drops |
| 3 | **Image similarity with Claude.** The owner pastes screenshots of outfits from creators they follow. The session reads silhouette, colour family and details (tested in #86 §2) and names the common thread, then proposes a Style line and, when the owner pastes a new creator's screenshot, how close it is | **Yes**, in a local session, on the owner's own screenshots | **Yes**: the owner's own capture (#86, "Screenshots") | A **proposed** Style line, or a **proposed** Creators line | No. Style re-ranks (#87) | Diff to Style on "yes"; Declined proposals on "no" |
| 4 | **Size twin (the candidate nobody asked for).** LTK creators often state their own size in the bio: "5'6" \| size XS-S in tops \| 25 in bottoms", "5'2 Small 2/4". A creator with the owner's size and height is similar in the dimension a photo cannot give (#86 §2: fit "cannot be read") | The bio is on the public page, but reading many bios is the "monitor" LTK forbids. The owner can paste a bio | As method 2 | A **proposed** Creators line tagged "size twin", and **wording** ("she wears a 25, you wear a 26") | No | As method 2 |
| 5 | **Shop catalog image search** as a "similar product" source ([#86 §4](86-personal-shopper-intake-and-product-search.md)). The owner's creator screenshot becomes a query for similar products on Shopify stores | **Not run** (#86 and #87 left the first search to the first session) | Personal use, owner-directed (#87 §5) | Candidates in a round, not the profile | No | The ordinary round |

**Discarded, with the reason in a line:** having the agent crawl LTK's
Following or Discover pages for the owner. It would find similar creators
fastest, and it is exactly what "any robot, spider … or manual process to
monitor or copy" rules out.

### How much of a round goes to discovery

**Author's judgment, not derived from any source:** **one pick in five**,
with at least one round in four carrying none. Four picks come from followed
creators and the Shop catalog, as #87 sets them. The fifth is labelled
**Proposed: similar to X, because Y**. A round with nothing worth proposing
carries none rather than filling the slot. The ratio is a Format line the
owner can move by reaction ("more new people" or "stop suggesting").

Reason for one in five: the owner's reactions are the only thing that
adopts a creator. At one proposal per round they can answer every one; at
three per round the Declined list grows faster than the owner's attention,
and silence starts deciding.

## 5. What changes in #87's first version

**ShopMy adds to the Shop catalog; it does not replace it.** Precisely:

- **Product source: unchanged.** The Shop catalog stays the searchable
  source, with per-store `products.json` for size (#86 §4, #87 §6). ShopMy
  cannot be searched by an agent (§1). LTK can be read and forbids it (§2).
- **New input: creator picks, pasted.** Beside #86's pasted links and
  screenshots, the owner pastes `go.shopmy.us` and LTK links, or screenshots
  of a shelf. The session reads the first redirect for the retailer, then
  checks size where the retailer answers (Shopify stores, Shopbop and
  Nordstrom from this run) and says "check size yourself" where it does not
  (Amazon, Walmart, Target).
- **Profile:** add **Creators** (re-ranks and words, never gates) and
  **Declined proposals** (gates proposals only), as in §4. No existing
  section changes its axis.
- **Interview:** add one question, asked only when a bought item came from
  a creator's link. "You bought X through Y's link. Did it look like it did
  on her?" The answer becomes a **Creators** wording line ("Y's picks run
  more fitted than they look") or a **Brand notes** line, and never a
  Declined or Not interested line without a separate sentence. It counts
  toward #87's cap of five questions, after Q1 (size), because a stale size
  gates and a creator note only ranks.
- **Where the Creators section's first lines come from:** the owner types
  or pastes the handles. No export route was found on either platform
  (§1, §2).

**The result that would prove this wrong:** after four rounds, **fewer than
half of the creator links the owner pasted resolve to a retailer where the
agent could check the owner's size**. Then the creator input adds retailers
the agent can only link to, and the size check that justifies #87's build
does not apply to it. **Author's threshold**, not derived.

**The strongest evidence against, looked for rather than imagined:**

- **The sample's retailers already point that way.** Of the picks whose
  retailer was followed, Amazon and Walmart (unreadable), Nordstrom and
  Shopbop (readable today, both big department stores), Loft (down), and one
  Shopify store. #86's argument, "the agent could be excellent at a slice of
  the market the person rarely buys from", becomes sharper here: following
  creators moves the owner's shopping **toward** the stores the agent can't
  check.
- **ShopMy, the platform the issue named, is the one this run could not read
  at all.** Every claim about what a ShopMy shelf shows is inferred.
- **A free app already does discovery better.** LTK's app has interest feeds
  and a chat that pulls "shoppable ideas … from real creator posts". What a
  self-built version adds is the same narrow thing #87 found: a profile the
  owner reads and edits, and a rule that "similar" never narrows it.

**What would flip it:** if ShopMy opened its API to shoppers with a follows
scope, or either platform offered a follows export, the Creators section
could be filled and refreshed without the owner typing it, and creator picks
could become a real source rather than an input. If the owner's pasted links
turn out mostly to resolve to Shopify stores, the creator route is better
than the catalog at the one thing the catalog lacks, which is taste.

## What was searched for and not found

- Any ShopMy or LTK page describing an **export of followed creators**.
- A **"similar creators"** feature on either platform's public pages or app
  listings.
- Any **public feed** (RSS, JSON) of a creator's shelf or posts on either
  platform.
- A **size or stock field** in any creator page, post, API response schema or
  affiliate link.
- LTK's developer documentation: the portal is sign-in only.
- ShopMy creator-page content by any route open to this run.

## Unverified claims, in my own words

- That a ShopMy shelf shows an image, a name and a `go.shopmy.us` link. I
  never saw one.
- Whether ShopMy shelves show a price or a size. Unknown.
- That an agent can read the retailer from the first redirect alone. I saw
  it in every `Location` header, but I relied on WebFetch reporting that
  header, and the network could change the format.
- That the creator of `go.shopmy.us/p-18704855` is a women's-fashion creator.
  It came from a public post and the creator is unknown.
- That a local session on a home IP reaches Amazon and Walmart where this
  runner did not. Carried from #86's inference, not tested.
- The "September 16, 2026" last-updated date on **both** terms pages. It is
  what the fetch tool reported for each, and the coincidence is suspicious.
  Read the dates on the pages before quoting them.
- LTK's "Following feed" wording and its "Similar Product" feature came
  from search summaries, not from a page this run read.
- That "manual process to monitor or copy" covers a session reading one LTK
  page the owner pointed it at. I read it as covering systematic reading
  (many creators, repeatedly), and not a one-off read the owner asked for,
  but LTK does not say.
- The one-in-five discovery share and the "half of pasted links" threshold
  are my judgment.
- Alix Earle, Caroline Vazzana and Erika Veurink are on ShopMy per search
  result titles of `shopmy.us` pages. Their pages did not render, so I did
  not confirm them there.
