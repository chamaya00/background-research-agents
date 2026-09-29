# Personal shopper: taste intake and product search feasibility

**Decision this serves:** which inputs a personal-shopper agent can take a
person's style taste from, and which sources it can find real products in
(price, size availability, link), given what is legally permitted and what a
GitHub Actions run in this public repository can actually reach. Child B of
[#85](https://github.com/chamaya00/background-research-agents/issues/85)
designs the feedback loop, the reuse map and the recommendation on top of this.

**Status:** first pass, run 1 of 3 on
[#86](https://github.com/chamaya00/background-research-agents/issues/86),
2026-09-29. The comparison held steady over the last several fetches. Still
unread: Walmart's affiliate API terms (its page returned an empty shell),
eBay's Browse API docs (403), and the full UCP/Shop catalog terms page linked
from Shopify's skill file.

## Headline

1. **TikTok is out as a feed and stays in as links.** TikTok's terms forbid
   automated extraction "except as approved in writing". The Research API is
   closed to commercial and individual applicants. The Display API reads only
   the account that authorised it. What works without a key is **oEmbed**:
   given a video URL the person pastes, it returned the caption, handle and a
   thumbnail from this run. It gives no product data. The person's own
   **"Download your data" export** lists their liked and favourited videos as
   links.
2. **Pinterest is better than the issue assumed.** A **public board's RSS
   feed** (`pinterest.com/<user>/<board>.rss`) came back from this run as
   XML: 25 items, each with a pin link and an image URL. That is the shape
   `src/fetch.ts` already parses. The API (v5, OAuth, trial tier) can read
   the person's own boards, including secret ones. Its terms forbid storing
   what it returns.
3. **The product side's best source was on nobody's list: Shopify.**
   Shopify's own Shop catalog is searchable without sign-in, across what
   Shopify describes as "millions of stores". It returns price, available
   colours and sizes, and a link, and it accepts an image as the query. Each
   store also serves `/products.json` with per-size `available` flags, and two
   stores returned it to this run. The big-box retailers mostly did not:
   Amazon 503, Walmart CAPTCHA, Nordstrom empty. Target returned results, but
   its terms forbid agents it has not approved.
4. **Kids' safety data is open and machine-readable.** CPSC's recall API
   returned JSON with no key, and its RSS feed returned XML. The small-parts
   and choking-warning rules came back as XML from the eCFR API. The
   age-grading guidance exists only as a PDF.
5. **Photos of the person and their children should not enter an Actions run
   of this repository.** Its logs are visible to any logged-in GitHub user,
   and a model's description of a photo lands in those logs. The workable
   place is the person's own machine, read by a local Claude Code session. A
   private repository works as a second choice, with a caveat below.

## How reachability was tested

This run executes inside GitHub Actions (run
[36597682570](https://github.com/chamaya00/background-research-agents/actions/runs/36597682570)),
so a fetch from here answers "can an Actions run reach it". `curl` was refused
by this run's tool permissions ("This command requires approval"), so every
probe below went through the WebFetch tool. **Inference:** WebFetch's request
leaves from the runner itself. A site that blocks datacenter IPs would block
it the same way, and the Walmart CAPTCHA and Amazon 503 fit that. A
repository workflow that ran `fetch()` from Node would face the same egress,
but its user agent would differ, so a site that filters by user agent could
answer it differently. Not tested.

Citations are labelled **[official]** (the platform's own terms, docs or help
pages) or **[third-party]**.

## 1. Inputs: what can legally be obtained, what an Actions run reaches, and the cheapest supply

### TikTok handles and videos

- **Legal.** TikTok's Terms of Service, last updated July 15, 2026, forbid
  users to "scrape, crawl, export or otherwise extract any data or content in
  any form, for any purpose, from the Platform using any automated system or
  software, including automated 'bots,' except as approved in writing by
  TikTok USDS Joint Venture" (§3.4).
  [official](https://www.tiktok.com/legal/page/us/terms-of-service/en)
  - **Research API:** limited to "qualified researchers in the U.S., Europe,
    Canada, and Brazil". Applicants "must be independent of commercial
    interests and conduct research on a not-for-profit or non-commercial
    basis". Individuals are not eligible.
    [official](https://developers.tiktok.com/products/research-api/)
  - **Display API:** scopes `user.info.basic` and `video.list`, the latter
    described as "Read a user's public videos on TikTok". It reads the
    authorising user's own videos, not the creators they follow. It needs a
    registered app, a token, and OAuth consent. The page says nothing about
    app review.
    [official](https://developers.tiktok.com/doc/display-api-overview)
  - **oEmbed** (`https://www.tiktok.com/oembed?url=<video url>`): documented
    with no authentication. It returns `title`, `author_name`, `author_url`
    and `thumbnail_url`.
    [official](https://developers.tiktok.com/doc/embed-videos)
- **Reachable from Actions.** oEmbed was fetched for
  `https://www.tiktok.com/@scout2015/video/6718335390845095173` and returned
  JSON with the caption ("Scramble up ur name & I'll try to guess it😍❤️
  #foryoupage #petsoftiktok #aesthetic"), `author_name` "Scout, Suki &
  Stella" and a signed 576×1024 thumbnail URL on `tiktokcdn-us.com` with an
  `x-expires` parameter. The profile page `https://www.tiktok.com/@scout2015`
  returned only the header (name, bio, counts) and no video list.
- **Cheapest supply.** The person pastes the URLs of videos whose outfits they
  like. The agent calls oEmbed for the caption and thumbnail. The thumbnail is
  one frame, which may not show the outfit. A screenshot the person takes at
  the right moment is better input, and it is covered under screenshots
  below. For volume, TikTok's in-app **Download your data** (JSON option)
  lists liked and favourited videos as a `VideoList` of `Date` and
  `VideoLink`. That export is described by third parties
  ([ScrollBack guide, third-party](https://scroll-back.com/guides/how-to-download-your-tiktok-data)).
  TikTok's own help page for it came back as an empty shell from this run.
  **Unestablished:** whether a handle alone, meaning "what does this creator
  wear", can be read by any permitted route. No route found. The honest
  answer is that the person pastes links and screenshots.
- **Legal tension, stated rather than resolved.** oEmbed is documented by
  TikTok for embedding. An agent calling it on URLs the person supplied is
  inferred to be within its intended use, not a scrape, but no TikTok page
  says so.

### Pinterest boards

- **Legal.** Pinterest's Terms, updated April 30, 2025: "you agree not to
  scrape, collect, search, copy or otherwise access data or content from
  Pinterest in unauthorized ways, such as by using automated means (without
  our express prior permission)".
  [official](https://policy.pinterest.com/en/terms-of-service)
  The Developer Guidelines allow access to an account only "with
  authorization, for example by using an access token". They also say "you
  may not store any information accessed through any Pinterest Materials
  including the API. Instead, call the API each time you need to access
  information". And they forbid using Pinterest Materials "to train,
  fine-tune, or otherwise improve or develop any artificial intelligence or
  machine learning models".
  [official](https://policy.pinterest.com/en/developer-guidelines)
  Trial access can read boards and pins, is "rate limited based on calls per
  day/per app", and anything created in trial is sandbox-only.
  [official](https://developers.pinterest.com/docs/key-concepts/access-tiers/)
  The published cap is 1,000 requests/day
  ([search summary, third-party](https://www.blotato.com/blog/pinterest-api-pricing)).
  That figure was not read on an official page.
- **Reachable from Actions.**
  - `https://www.pinterest.com/pinterest/official-news.rss` returned RSS:
    channel "Official news", 25 items. The first item links
    `https://www.pinterest.com/pin/424605071112831904/`, and its description
    embeds an image at `i.pinimg.com/236x/...`.
  - `https://api.pinterest.com/v5/boards` returned **401** without a token,
    as expected. The endpoint answers from a runner.
  - `developers.pinterest.com/docs/api/v5/` rendered as a JavaScript shell,
    and `.../getting-started/set-up-app/` and
    `.../authentication-and-scopes/` returned **404**.
- **Cheapest supply.** The person names the public board URLs, and the run
  appends `.rss`. That needs no account, no key and no code beyond what
  `src/fetch.ts` does. It only yields each board's recent 25 pins, and only
  for public boards. **Legal tension:** Pinterest publishes these feeds, but
  its terms forbid automated access "without our express prior permission".
  Whether reading a feed Pinterest serves counts as permitted is
  **unestablished**. It is the same question every RSS reader raises. For
  secret boards, or the full history, **Download your Pinterest data**
  (Settings → Privacy and data → Request your data) emails a link within 48
  hours, via SendSafely, as HTML.
  [official](https://help.pinterest.com/en/article/download-your-pinterest-data)
  (The HTML format comes from a
  [search summary, third-party](https://help.measureprotocol.com/support/solutions/articles/80001128767-pinterest-data-file-retro-instructions).)
  The API route is the only one that reads secret boards live. It needs a
  registered app and an OAuth token stored as a repository secret, and "do
  not store" means each run re-reads the boards rather than caching pins in
  git.

### Photos of current and wanted outfits

- **Legal.** They are the person's own photos, so no platform terms apply.
  The constraint is privacy (§5), not permission.
- **Reachable from Actions.** Only if the photos are somewhere the run can
  authenticate to. See §5. Nothing public is involved.
- **Cheapest supply.** Drop the photos into a folder on the person's own
  machine, and a local Claude Code session reads them with its file-read
  tool. This run did exactly that with a public sample image (§2). No
  upload, no account.

### Screenshots

- **Legal.** A screenshot the person takes of a product page, a TikTok frame
  or an Instagram post is their own capture. **Inference:** no platform term
  reaches an agent reading an image the person hands it. No page was found
  saying either way.
- **Reachable from Actions.** The same as photos: only via the storage in §5.
- **Cheapest supply.** Paste straight into the session, or drop into the same
  local folder. A screenshot is the one input that carries a TikTok outfit
  and a product page's price and size in a single capture.

### Order history

- **Legal.** It is the person's own data, exported by them.
- **Reachable from Actions.** Retailer accounts are behind login. No run
  should hold the person's retailer passwords, and none was tried. Amazon's
  `/s?k=` search page returned **503** to this run, so its account pages
  were not attempted.
- **Cheapest supply.** Amazon replaced its order-report CSV (removed 2023)
  with **Request your data** under Your Account → Manage your data. It
  returns spreadsheets with one row per item: date, name, quantity, price
  ([Tiller, third-party](https://tiller.com/how-to-download-your-amazon-order-history-report/)).
  Not confirmed on an Amazon page in this run. **Searched and not found:**
  an export for Target, Old Navy or Carter's order history. The fallback is
  forwarding order-confirmation emails, or a screenshot of the orders page.
  Order history is the one input that reveals **sizes that were kept**,
  which is the strongest fit signal available. It also carries the
  children's sizes over time.

### Input summary

| Input | Legal route | From an Actions run | Cheapest supply |
|---|---|---|---|
| TikTok video | oEmbed on pasted URL | **Yes**, caption + 1 thumbnail | Paste links, plus screenshots |
| TikTok handle | None found | Profile header only | Not supported; say so |
| TikTok likes | Own data export | No (file on device) | Export JSON, paste links |
| Pinterest public board | Board RSS (tension noted) | **Yes**, 25 pins with images | Name the board URLs |
| Pinterest secret boards | API v5 with OAuth, no storing | Yes, with a token secret | Data export (HTML) |
| Outfit photos | Own data | Only via §5 storage | Local folder, local session |
| Screenshots | Own capture | Only via §5 storage | Paste into the session |
| Order history | Own data export | No | Amazon data request; emails |

## 2. Taste extraction from an image: what can and cannot be read

**Tested in this run** on one public image,
[`File:Woman_wearing_trench_coat.jpg`](https://commons.wikimedia.org/wiki/File:Woman_wearing_trench_coat.jpg)
(CC BY-SA 4.0, Bartholomewjuniper, 2019-10-27). WebFetch saved it to the
runner, and this run's model read it.

| Read | Result from this image | Reliable? | Basis |
|---|---|---|---|
| Silhouette | Single-breasted trench, belted and tied at the waist, straight to slightly A-line, ending above the knee; slim dark bottoms; ankle-height duck boots | **Yes** | Tested |
| Colour | Coat khaki/tan; bottoms charcoal; boots grey-blue rubber lower, heathered grey upper, tan laces | **Yes**, named families; not exact shade (light and white balance shift it) | Tested |
| Construction details | Tortoiseshell-look buttons, sleeve tabs with button, flap pocket, point collar | **Yes** at this resolution (960 px) | Tested |
| Visible fabric cues | Coat: matte, smooth, lightweight woven, likely twill-like; upper of boots: felt/wool-look | **Cue only**: "matte smooth woven" is readable, "cotton gabardine" is not | Tested |
| Logos / brand | None legible. The boots resemble a well-known duck-boot style, but no mark is visible | **Only when a logo is legible**; resemblance is a guess and was not stated as a brand | Tested |
| Fibre content | Cannot tell cotton from polyester from blend | **No** | Tested (negative) |
| True fit on the wearer | Coat looks proportionate, but the size, the ease through the shoulders, and whether it is the intended fit cannot be read | **No** | Tested (negative) |
| Quality | Stitching, lining, and water resistance not determinable | **No** | Tested (negative) |
| Garment category from a screenshot of a product page | Not tested | Expected yes | **Assumed** |
| Children's sizes from a photo of a child | Not tested, deliberately (no public child photo was used) | Expected no: age can be guessed, size cannot | **Assumed** |
| Accuracy across many images, repeatability, video frames | Not tested; one image is an existence check, not a rate | Unknown | **Unestablished** |

What this means for the profile: an image gives **silhouette, colour family,
details and category**. It does not give size, fibre or quality. Those have to
come from order history (kept sizes), product pages (fibre content is on the
label and usually in the listing), and the person's own reactions.

## 3. A proposed taste profile

Modelled on `docs/reader/profile.md`'s axes. Its rule carries over:
**knowledge-like lines change wording and never narrow what is fetched**
([`3-state-and-source-schema.md`](3-state-and-source-schema.md)). A line gets
there only through a reaction the person has seen translated, as in
[`loop.md`](../reader/loop.md).

| Section | Gates selection? | Changes wording? | Example line |
|---|---|---|---|
| **Wants** (open needs, one per person in the household) | **Yes** | No | `toddler-rain-gear` · active · for: child 1 · "rain jacket and boots for daycare, before November" |
| **Style** (silhouettes, colours, details liked) | **Yes**, ranks and filters | No | "Belted, knee-length outerwear; neutrals (tan, navy, charcoal); tortoiseshell buttons. *From 3 saved trench photos and reaction to round 1.*" |
| **Not interested** | **Yes**, excludes | No | "No graphic slogan tees for the kids; no cropped tops. *Reaction, round 2.*" |
| **Sizes and fit** (per person, dated) | **Yes**, a result with no available size is dropped | No | "Child 1: 2T tops, 3T outerwear (runs small at Primary), as of 2026-09. *From kept orders.*" |
| **Budget** (per category) | **Yes** | No | "Kids' outerwear under $50; women's coats up to $250." |
| **Safety** (per child, from age) | **Yes**, hard filter | No | "Child 2 is under 3: exclude toys with small parts (16 CFR 1501); check CPSC recalls for every toy and gear item." |
| **Already owned** (wardrobe) | **Open question for child B**: de-duplicating ("already has a trench") gates, and would narrow selection | Yes | "Owns: tan trench (2024), grey duck boots." |
| **Knowledge** (vocabulary, brands known) | **No** | **Yes** | "Knows fabric terms; do not explain twill or gabardine." |
| **Format** | No | **Yes** | "Three options per want, each with price, sizes in stock, link, and why it matches a Style line." |

**Already owned** is flagged rather than settled. It is the one line where
"already known" genuinely should change what is fetched, unlike the reader
profile's Knowledge, and that is the same conflation #3 warned about. Child B
should decide it explicitly.

## 4. Finding products with price, size availability and a link

Reachability entries name the URL fetched and the result. "Women's" and
"Kids'" mark which half of the shopping list each source was probed or is
known to cover.

### Retailer APIs

| Source | Covers | Cost | Terms (cited) | Reachable from Actions? |
|---|---|---|---|---|
| **Amazon Creators API** (replaces PA-API 5) | Both | Free with an Associates account | PA-API 5 is deprecated: "applications continuing to use PA-API 5 will receive an HTTP 403". Eligibility was not on the fetched page. [official](https://affiliate-program.amazon.com/creatorsapi/docs/en-us/paapiv5-deprecation) | `webservices.amazon.com/paapi5/documentation/` → 302 to the deprecation notice (read). `amazon.com/s?k=toddler+rain+jacket` → **503**. API endpoint not probed (needs keys) |
| **eBay Browse API** | Both, much of it resale | Free with a developer account | Not read | `developer.ebay.com/api-docs/buy/browse/overview.html` → **403**; `developer.ebay.com/develop/api/buy/browse_api` → **403** |
| **Etsy Open API v3** | Handmade women's and kids' | Free key | Personal apps "go through a deeper review process". Commercial access is "reviewed manually". [official](https://developers.etsy.com/documentation/) | Docs → 200. Whether listing search returns size variations was **not established** |
| **Walmart Affiliate API** | Both | Free for approved affiliates | Not read | `walmart.io/docs/affiliates/v1/introduction` → shell with only a header. `walmart.com/search?q=toddler+rain+jacket` → **CAPTCHA** ("Robot or human?") |
| **Target** | Both | No public product API found | "Use or attempt to use any engine, software, tool, agent ... to navigate or search the Site other than ... Approved Agent" and no "data extraction, scraping, mining" (updated 2026-09-10). [official](https://www.target.com/c/terms-conditions/-/N-4sr7l) | `target.com/s?searchTerm=toddler+rain+jacket` → **200 with real results** (Cat & Jack toddler rain jacket $24.00). Reachable, and forbidden |
| **Nordstrom** | Women's | No public product API found | Not read | `nordstrom.com/s/madewell-the-perfect-vintage-jean/5460173` → **empty body** |

### Shopify: per-store feeds, the store's agent endpoint, and the Shop catalog

The candidate nobody asked for, and the strongest one on the product side.
Many direct-to-consumer women's and kids' brands run on Shopify.

| Source | Covers | Cost | Terms (cited) | Reachable from Actions? |
|---|---|---|---|---|
| **`/products.json`** on a Shopify store | Per brand | Free, no key | Shopify's own terms bind merchants, not shoppers. [official](https://www.shopify.com/legal/terms) Primary's `robots.txt` has no rule against `.json` and directs agents to `/products/{handle}.json` for "read-only browsing". [official, merchant](https://www.primary.com/agents.md) | `primary.com/products.json?limit=2` → **200 JSON**, "Baby swim trunk in beach balls", sizes 3-6 to 18-24, $29.50, `available: true`. `girlfriend.com/products.json?limit=2` → **200 JSON**, "Black Meredith Bow Tank", $23.40, XXS/XS/5XL/6XL available and S-XL not. `hannaandersson.com/products.json` → **307** (not followed) |
| **UCP MCP endpoint** per store (`https://{shop}/api/ucp/mcp`, `search_catalog` tool) | Per brand | Free | "rate-limited per IP. Back off on 429 responses", "Checkout requires human approval". [official, merchant](https://www.primary.com/agents.md) The older `/api/mcp` catalog tools "were removed". [official](https://shopify.dev/docs/apps/build/storefront-mcp) | Named in `primary.com/robots.txt` (200). **The MCP call itself was not made** (it needs a POST, which WebFetch cannot send) |
| **Shop catalog** (Shopify's `shop` CLI, `@shopify/shop-cli`, or its HTTP API) | Both, across "millions of stores" | Free; search needs no sign-in | "Personal use only. No commercial services, resale platforms, aggregators, or third-party programmatic access". [official](https://shop.com/SKILL.md), with details at `help.shop.app/en/shop/shopping/personal-agents` (not fetched) | `shop.app/SKILL.md` → 301 to `shop.com/SKILL.md` → 200. Results carry price, available colours/sizes and a link. `shop search --image ./photo.jpg` searches by image. **No search was run** (it needs a global npm install, and installing tooling is outside this issue's scope; a spike behind its own issue should run one text and one image query) |

**What would have to be true for Shop to be the pick:** the person's household
is one personal user, which fits "personal use only". Also, "third-party
programmatic access" must not be read as covering an agent the person runs for
themselves. The skill file exists precisely for that agent, but the linked
terms page was not read. **Privacy cost:** image search sends the photo to
Shopify, so it must never be given a photo of a child.

### Affiliate and product feeds

| Source | Cost | Terms | Reachable from Actions? |
|---|---|---|---|
| **CJ product search** | Free for publishers | The fetched summary said access needs a "publisher with active relationship/advertiser approval", and returns price, availability, size and link. **Low confidence:** the summary repeated my own prompt's wording, so treat it as **unestablished**. | `developers.cj.com/docs/rest-apis/product-search` → 200 |
| **Rakuten, Impact, AWIN, ShareASale** | Free for approved publishers | Not read | Not probed. **Inference:** every network requires publisher approval per advertiser, and usually a published site. That is a large ask for one household's shopping |

### Shopping search APIs

| Source | Cost | Terms | Reachable? | Size availability? |
|---|---|---|---|---|
| **SerpApi Google Shopping** | Free 250/month; $25/mo for 1,000; $75/mo for 5,000. [vendor](https://serpapi.com/pricing) | Vendor terms not read | `serpapi.com/pricing` → 200 | **No**: title, price, merchant, link, delivery and rating only. [vendor](https://serpapi.com/google-shopping-api) |
| **Google Custom Search JSON API** | 100/day free, $5 per 1,000 | "closed to new customers"; existing customers "have until January 1, 2027". [official](https://developers.google.com/custom-search/v1/overview) | Docs → 200 | No |
| **Brave Search API** | $5 free credit monthly, then $5 per 1,000. [official](https://brave.com/search/api/) | Storing results "in part or whole" needs a plan "that explicitly grants storage rights" | Page → 200 | No |

### Plain web search

The session's own WebSearch tool, or a run's, finds product pages at no
marginal cost. It does not return price or size in a structured form, so every
hit needs a second fetch of the product page. That second fetch fails at the
retailers that block runners (Amazon, Walmart, Nordstrom) and breaks the
retailer's terms at Target. It works at Shopify stores.

### Refused or unreadable from this run, with what was tried

| Site | URL tried | Result |
|---|---|---|
| Amazon | `https://www.amazon.com/s?k=toddler+rain+jacket` | 503 |
| Walmart | `https://www.walmart.com/search?q=toddler+rain+jacket` | CAPTCHA page |
| Walmart I/O docs | `https://walmart.io/docs/affiliates/v1/introduction` | Shell, header only |
| Nordstrom | `https://www.nordstrom.com/s/madewell-the-perfect-vintage-jean/5460173` | Empty body |
| Hanna Andersson | `https://www.hannaandersson.com/products.json?limit=2` | 307, not followed |
| eBay developer docs | `developer.ebay.com/api-docs/buy/browse/overview.html`, `developer.ebay.com/develop/api/buy/browse_api` | 403, 403 |
| eCFR HTML | `https://www.ecfr.gov/current/title-16/.../section-1500.19` | 302 to `unblock.federalregister.gov` (the API route works; see §6) |
| data.transportation.gov | `https://data.transportation.gov/resource/3j8r-p6nv.json` | 403 |
| TikTok help | `https://www.tiktok.com/support/faq_detail?id=7543597460594285112` | Shell, no content |
| Pinterest dev docs | `developers.pinterest.com/docs/api/v5/`, `/getting-started/set-up-app/`, `/authentication-and-scopes/` | JS shell, 404, 404 |
| `curl` itself | any | Refused by this run's permissions ("requires approval") |

## 5. Where the images and videos live

This repository is public. Its Actions logs are readable by anyone who is
"logged in to a GitHub account ... including for public repositories"
([official](https://docs.github.com/en/actions/how-tos/monitor-workflows/use-workflow-run-logs)).
A model's description of a photo, such as "toddler, about 2, wearing...", is
data about a child, and it would land in those logs and in any pull request
the run opens. So:

- **Recommended: the person's own machine, read by a local Claude Code
  session.** Use a folder outside any git working tree, for example
  `~/Pictures/shopper-intake/`. The session reads images with its file-read
  tool, which is what this run did with the sample image. What stays local:
  every photo, every screenshot and every description of a child. What
  crosses into the repository: only profile lines the person approved in a
  diff, written without identifying detail, such as "Child 1: 3T outerwear".
  **An Actions run cannot read this, and that is the point.**
- **Second choice: a private GitHub repository** (for example
  `<owner>/shopper-private`). A workflow in this public repository could
  check it out with a fine-grained token held as an Actions secret, scoped to
  that one repository and read-only. **But** the run's logs and outputs are
  still this public repository's, so it could read the photos and must not
  describe them. **Inference:** safe only if that workflow lives in the
  private repository instead, which moves the image step out of this
  repository entirely.
- **Cloud photo libraries** (Google Photos, iCloud) were not probed. They
  need OAuth on the person's account in any case, which is a secret no less
  sensitive than the photos.
- **Never:** this repository, a gist (a "secret" gist is unlisted, not
  private), an issue attachment, or Shop's image search with a child in
  frame.

**Plainly: no option lets an Actions run of this public repository read
family photos without the risk of their descriptions becoming public.** Image
reading belongs in the local session.

## 6. Kids' safety sources

| Source | What it gives | Machine-readable? | Reached from this run? |
|---|---|---|---|
| **CPSC Recalls API** (`https://www.saferproducts.gov/RestWebServices/Recall`) [official](https://www.cpsc.gov/Recalls/CPSC-Recalls-Application-Program-Interface-API-Information) | Recalls with title, product name, hazard and remedy. Filters: `Title`, `RecallDescription`, `ProductName`, dates. "No API key is required." | **Yes**, JSON (`format=json`) or XML | **Yes**: `...Recall?format=json&RecallDateStart=2026-09-01` → 30 records. First: #10992, 2026-09-24, "5Color Recalls Children's Bicycle Helmet and Pads Sets ..." |
| **CPSC Recalls RSS** (`https://www.cpsc.gov/Newsroom/CPSC-RSS-Feed/Recalls-RSS`) [official] | Latest 40 recalls | **Yes**, RSS (fits `src/fetch.ts`) | **Yes**: "Recall List", 40 items, first dated 2026-09-24 |
| **16 CFR 1501**, the small-parts ban for children under 3, via the eCFR API [official](https://www.ecfr.gov/api/versioner/v1/full/2026-09-01/title-16.xml?part=1501) | "applies to all toys and other articles intended for use by children under 3 years" | **Yes**, XML text. The test-cylinder dimensions are only a figure (image) | **Yes** via the API. The HTML page was redirected to a bot check |
| **16 CFR 1500.19**, choking-hazard labelling for ages 3-6, via the eCFR API [official](https://www.ecfr.gov/api/versioner/v1/full/2026-09-01/title-16.xml?part=1500&section=1500.19) | The rule that toys for children "at least 3 but less than 6" with small parts carry a warning | **Partly**: the rule text is XML, but the **warning wording itself is an embedded image** (`er27fe95.001.gif`) | **Yes** via the API |
| **CPSC Age Determination Guidelines (2020)** [official PDF](https://www.cpsc.gov/s3fs-public/Age-Determination-Guidelines-Relating-Consumer-Product-to-Characteristics-Skills-Play-Behavior-Intersts-to-Children-January-2020.pdf) | How CPSC staff age-grade a product. "Not a mandatory rule" | **No**, PDF prose | Found by search; the PDF itself **not fetched**. The Toy Safety page (200) did not link it |
| **ASTM F963** toy standard [official](https://www.astm.org/standards/f963); CPSC's section chart [official](https://www.cpsc.gov/Business--Manufacturing/Business-Education/Toy-Safety/ASTM-F-963-Chart) | Mandatory toy requirements | **No**: a paid standard, with a read-only reading room | Chart page → 200 |
| **NHTSA car-seat recalls** (gear: car seats) [official](https://www.nhtsa.gov/nhtsa-datasets-and-apis) | Child-seat recall campaigns | Yes, per its catalogue entry | **No**: `api.nhtsa.gov/recalls/recallsByVehicle?make=graco&model=4ever&modelYear=2024` → 400 (it is the vehicle endpoint, a wrong guess); `data.transportation.gov/resource/3j8r-p6nv.json` → 403. **Unestablished** |

What a listing carries: **age grading and choking warnings are on the product
listing, not in any feed.** Shopify's `products.json` has no age field, so an
age grade must be read from the listing text. **Searched and not found:** a
machine-readable age-grade or choking-warning field in any retail feed probed.

## What was searched for and not found

- A permitted route from a TikTok **handle** to its outfits.
- An order-history export for Target, Old Navy or Carter's.
- A size-availability field in any shopping search API. None of SerpApi,
  Google CSE or Brave has one.
- An age-grade field in any product feed.
- Pinterest's official statement of the trial daily cap. Only a third-party
  source gave the number.

## Discarded

- **Scraping TikTok or Instagram** (tools such as the `tiktok-save` family
  surfaced in search). Ruled out by TikTok §3.4 and by the issue.
- **Google Custom Search** as a product-search backbone. It is closed to new
  customers and ends 2027-01-01.

## Verified, inferred, assumed

- **Verified** (read on a primary page or fetched in this run): every status
  code above; TikTok, Pinterest and Target terms quotes; the Shopify
  `products.json` fields; the CPSC API and RSS; the eCFR XML; the image
  reading in §2.
- **Inferred:** WebFetch egresses from the runner. oEmbed on pasted links is
  within intended use. Affiliate networks are impractical for one household.
  A private-repo workflow is safe only if it lives in the private repo.
- **Assumed, and load-bearing:** that the Shop catalog's "personal use only"
  covers an agent the person runs for themselves. That the person's favoured
  brands are substantially on Shopify. Neither was checked, and the product
  half of any plan rests on both.

## Recommendation

Take taste from **pasted links and screenshots, public Pinterest board RSS,
and order history exported by the person**, with all image reading in a
**local session**. Find products through **Shopify: the Shop catalog for
breadth and per-store `products.json` for exact size availability**, with
plain web search to discover brands. Run **CPSC recall checks on every kids'
item** through the recall API. Leave Amazon, Walmart and Target to links the
person clicks, not fetches the agent makes.

**Strongest argument against:** the Shopify route covers only brands that
happen to run on Shopify. Much of a family's actual kids' spend is at Target,
Amazon, Walmart and Carter's, and none of those was fetchable or permitted.
So the agent could be excellent at a slice of the market the person rarely
buys from. **What would flip it:** if the person's order history shows most
spending at the big-box retailers, the product half becomes "search broadly,
then hand the person links" (SerpApi's free 250/month, or plain web search),
with size availability checked by the person at click time. That becomes an
honest gap, stated as one, rather than a feature.
