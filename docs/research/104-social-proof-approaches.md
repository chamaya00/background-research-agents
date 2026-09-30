# Shopper: approaches for finding social proof on a named product, and the standard step for future rounds

**Decision this serves:** which way of finding social proof (creators who
wore it, long-term wear reports, common complaints) becomes the standard
step a shopper round runs on each pick. The approach is chosen for how
reachable it is, whether it is permitted, and how often it returns evidence
about **this** model. Child of
[#104](https://github.com/chamaya00/background-research-agents/issues/104),
run for [#106](https://github.com/chamaya00/background-research-agents/issues/106)
on 2026-09-30. The pilot products are round 2's two picks
([`101-everyday-footwear.md`](../shopper/rounds/101-everyday-footwear.md)).

**Status:** complete at pilot scale, run 1 of 3. Every approach was tried
once per shoe, with WebSearch and WebFetch from GitHub Actions. The ranking
stopped moving after the third approach: every later one either returned
sibling-model evidence or nothing. **Not reached:** any Reddit page (the
tools refuse the domain), Reddit's own terms page (same), ECCO's US terms
and product pages (HTTP 429), and Amazon's review page (HTTP 500). What I
would read next: ECCO's terms page on a later day, and one ECCO product
page for its on-site reviews.

**This is not the proof itself.** #104 also asks for the proof, the brand
reputation and a verdict for each pick. The pilot rows below are a single
attempt per approach, not a thorough search. They are evidence about the
*approaches*. They are not a verdict on the shoes.

**Constraints, not guesses:** no scraping of TikTok, Instagram, ShopMy or
LTK (#86, #92). The run has WebSearch and WebFetch and no shell. Purchase
links follow [`link-safety.md`](../shopper/link-safety.md), but evidence
links do not have to (#104). **Guesses in the issue:** the six approaches
it lists, and the idea that "creator wear" is where the proof lives. The
pilot suggests that for these two shoes it mostly does **not** live there
(see §3).

## Headline

1. **The model-match problem is bigger than the source problem.** J.Crew
   sells at least nine "Winona" products. Round 2's pick is the **New
   Winona penny loafer, style CH288**. Almost all of the Winona's social
   fame belongs to its siblings: the lug-sole (BT893, CH287) and the
   original (BA190). ECCO's "Margot" is at least five shoes. Every creator
   hit for the Margot came from ECCO's own account and did not say which
   Margot it showed. Across the six named approaches and one extra, **the
   pilot found zero organic creator posts that match either pick's model**.
2. **Retailer reviews on the exact product page were the only approach
   that returned model-matched evidence for both shoes.** jcrew.com CH288:
   118 reviews, 4.2 average, including a split after four wears. Zappos
   Margot Bow: 2 reviews, 3.0 average, one of them about shipping and not
   the shoe. Retailer reviews are weak as proof, but they are the only
   source that is certainly about this model.
3. **Reddit is unreachable from this runtime.** WebSearch refuses
   `reddit.com` as a domain filter ("not accessible to our user agent"), and
   WebFetch "is unable to fetch" both `www.reddit.com` and `redditinc.com`.
   An unfiltered search for "reddit J.Crew Winona loafers" returned no
   Reddit result.
4. **Recommendation: an ordered step, "identify the model, then retailer
   reviews, then the search index, then oEmbed".** First pin the style
   number and name its siblings from the product page. Then read the exact
   product page's reviews. Then run a fixed set of search-index queries
   (creator posts, YouTube, editorial, LTK/ShopMy) that are read as search
   results only. Last, use oEmbed only to read the disclosure on a specific
   post that a search surfaced. The stop rule, the labelling rule and the
   model-match rule are in §5.

## 1. What "this model" is: the siblings found in the pilot

These are the names a search returns for each pick, and which are **not**
the pick. Every row comes from a search result title, or from a page that
was fetched and named in §3.

**J.Crew: the pick is "New Winona Penny Loafers in Italian Spazzolato
Leather", style `CH288`**
([jcrew.com](https://www.jcrew.com/p/womens/categories/shoes/flats/new-winona-penny-loafers-in-italian-spazzolato-leather/CH288)).
Siblings seen in search results:

| Sibling | Style | Source |
|---|---|---|
| Winona penny loafers in spazzolato leather (the original) | BA190 | [jcrew.com](https://www.jcrew.com/p/womens/categories/shoes/oxfords-and-loafers/winona-penny-loafers-in-spazzolato-leather/BA190) |
| New Winona lug-sole penny loafers, Italian spazzolato | CH287 | [jcrew.com](https://www.jcrew.com/p/womens/categories/shoes/flats/new-winona-lug-sole-penny-loafers-in-italian-spazzolato-leather/CH287) |
| Winona lug-sole penny loafers, spazzolato | BT893 | [jcrew.com](https://www.jcrew.com/p/womens/categories/shoes/flats/winona-lug-sole-penny-loafers-in-spazzolato-leather/BT893) |
| Winona lug-sole, metallic / suede | BT894 / BP306 | [jcrew.com](https://www.jcrew.com/p/womens/categories/shoes/oxfords-and-loafers/winona-lug-sole-penny-loafers-in-metallic-leather/BT894), [jcrew.com](https://www.jcrew.com/p/womens/categories/shoes/oxfords-and-loafers/winona-lug-sole-penny-loafers-in-suede/BP306) |
| Winona croc-embossed / suede / woven / linen / Spanish canvas | BA191 / BA192, CM900 / BP308 / BP325 / BX920 | search result titles on jcrew.com (e.g. [BA191](https://www.jcrew.com/p/womens/categories/shoes/flats/winona-loafers-in-croc-embossed-leather/BA191), [CM900](https://www.jcrew.com/p/womens/categories/shoes/oxfords-and-loafers/winona-penny-loafers-in-suede/CM900)) |
| J.Crew **Factory** penny loafers | - | a separate line; [YouTube](https://www.youtube.com/watch?v=F9EfFN5pljA) |

**Inference:** "New" in CH288's name marks a rework of BA190. Whether the
last, leather or sole changed was not read from any page, so BA190 evidence
counts as **sibling** and not as the same model.

**ECCO: the pick is "Margot Bow Ballerina Flat", black**
([Zappos 10016978](https://www.zappos.com/p/womens-ecco-margot-bow-ballerina-flat/product/10016978);
[Amazon B0DC7YH3DF](https://www.amazon.com/ECCO-Womens-Margot-Ballerina-Ballet/dp/B0DC7YH3DF)).
Siblings seen: Margot **Plain** ballerina
([Zappos 9992816](https://www.zappos.com/product/review/9992816)), Margot
**Mary Jane** (ECCO 234343,
[Zappos 10004154](https://www.zappos.com/p/womens-ecco-margot-mary-jane-ballerina-ballet-flat/product/10004154)),
Margot **Origami**
([6pm 10004160](https://www.6pm.com/p/womens-ecco-margot-origami-ballerina-ballet-flat/product/10004160)),
Margot ballerina ECCO 234323 and Margot ballerina flat ECCO 244333
([us.ecco.com](https://us.ecco.com/product/ecco-margot/244333/51707)), and a
Margot suede loafer (ECCO 234383). **Not established:** which ECCO article
number is the Bow. `us.ecco.com/product/ecco-margot/244333/51707` returned
HTTP 429, so it is not known whether 244333 is the Bow.

**Name collisions that are not ECCO at all:** VIVAIA "Margot Mary Jane"
([TikTok](https://www.tiktok.com/@bymelissxo/video/7396023427863285022),
[LTK](https://www.shopltk.com/explore/michelebell21/posts/4a5a14f8-58ba-11ee-962d-0242ac110004)),
Coach "Margot", and Margaux "Demi Jane". A search for "Margot ballet flat"
returns more of these than ECCO's own.

## 2. The approaches compared

Seven approaches: the issue's six and one it did not name (resale
listings). Each row has five attributes. "Permitted" cites a terms page or
says it could not be read. "Reachable" states a fetch or search made in
this run and its result.

| # | Approach | What it finds | Reliability | Permitted | Reachable from a run | Cost |
|---|---|---|---|---|---|---|
| A1 | **Indexed creator posts** (TikTok / Instagram via search, then oEmbed on a found URL) | Captions, handles and hashtags of short posts. For a hot product, try-ons and "most comfortable" claims. No wear duration. | **Low for proof.** Posts are launch or haul moments, often affiliate, and captions rarely give the exact model. | Search index: we never touch the platform. TikTok terms forbid scraping ([#86 citing TikTok ToS](86-personal-shopper-intake-and-product-search.md)). oEmbed is documented for embedding, not for reading ([TikTok, official](https://developers.tiktok.com/doc/embed-videos)); the tension is carried from #86. Instagram oEmbed docs ([Meta](https://developers.facebook.com/docs/instagram-platform/oembed)) do not say whether reading captions is allowed. | **Search: worked.** 10 TikTok/Instagram results per query. **TikTok oEmbed: worked** (captions returned for `@pamelamvaldez`, `@kitkeenan` and `@ecco`). **TikTok `/discover/` page: empty** ("TikTok - Make Your Day" only). **Instagram oEmbed without a token: worked, but empty**: an embed shell with no caption. | 1-2 searches plus 1 oEmbed call per post. Free. |
| A2 | **YouTube reviews** (search, then oEmbed) | Long try-ons, "one year later" reviews, and for shoes, cut-in-half construction reviews. | **Medium to high when a model-matched video exists.** Long-form, and sponsorship is usually disclosed. | YouTube ToS (effective 2023-12-15): no "automated means (such as robots, botnets or scrapers)" except public search engines per robots.txt or with written permission ([YouTube ToS, official](https://www.youtube.com/static?template=terms)). Reading search results and oEmbed is not accessing the Service with a scraper (**inference**). | **Search (youtube.com filter): worked**, 10 results per shoe. **oEmbed: worked** (title and channel for `shorts/EgRe52deC6s`). **Watch page fetch: empty**: no title, description or date was readable. | 1 search plus 1 oEmbed per candidate. Free. |
| A3 | **Reddit threads** | Unsponsored "how did they hold up" threads, sizing advice and complaints. Historically the best long-term source for shoes. | **High where it exists** (anonymous, organic), **if** it could be read. | Reddit's User Agreement forbids automated collection without agreement, as reported by [ideafast.pro, secondary](https://www.ideafast.pro/blog/is-it-legal-to-scrape-reddit) and [redditapis.com, secondary](https://www.redditapis.com/blogs/is-scraping-reddit-legal-2026). The primary page could not be read (`redditinc.com` refused by the tool). Reddit blocked unlicensed crawlers in robots.txt in 2024 ([TechCrunch](https://techcrunch.com/2024/06/25/reddits-upcoming-changes-attempt-to-safeguard-the-platform-against-ai-crawlers)). | **Blocked.** WebSearch with `allowed_domains: reddit.com` returned "API Error: 400 The following domains are not accessible to our user agent: ['reddit.com']". WebFetch of `www.reddit.com/search/?q=…` returned "Claude Code is unable to fetch from www.reddit.com". **Unfiltered search: empty** (no Reddit URL in 10 results for "reddit J.Crew Winona loafers" or "reddit ECCO Margot ballet flat"). | Zero, because it cannot be done. The only route is the owner pasting a thread's text. |
| A4 | **Long-term review blogs and editorial "tested" articles** | Wear tests over weeks, comparisons within a category, construction notes. | **Mixed.** A real wear test is high. A commerce listicle that re-quotes retailer reviews is low and **not independent** (see §4). Almost all carry affiliate disclosures. | Per publisher, and none forbids a single read of a public article in what was read. Forbes returned 403, so its terms were not read. | **Search: worked**, no model-matched article for either shoe. **Fetch: Yahoo/Footwear News worked (200). Forbes: blocked (403).** | 2-3 searches plus 1-2 fetches. Free. |
| A5 | **LTK / ShopMy links naming the product** (search index only) | That a creator linked the product, and when. Affiliate by construction. | **Low for proof.** A link is not wear, and every one is paid on click. | LTK forbids "any robot, spider, other automatic device, **or manual process** to monitor or copy" ([LTK ToS §4, via #92](92-shopmy-creators-and-discovery.md)). ShopMy forbids any "program, spider, 'bot'" ([ShopMy ToS §8, via #92](92-shopmy-creators-and-discovery.md)). So: **search results only, pages not fetched.** | **Search (shopltk.com and shopmy.us filter): worked.** 5 Winona items for J.Crew, 0 ECCO Margot. **Pages: not fetched, by rule.** #92 found ShopMy pages return an empty body anyway. | 1 search per shoe. Free. |
| A6 | **Retailer reviews** on the exact product page | Star count, fit ("runs half a size long"), early failures ("split after four wears"), and sometimes wear duration. | **Medium.** The model is certain, but the reviews are unverified, skewed to the first weeks of wear, and can be about fulfilment. Some retailers syndicate or incentivise reviews (not checked here). | **jcrew.com: no clause** on robots, scraping or automated access ([J.Crew Terms, updated 2024-09-19](https://www.jcrew.com/help/terms-of-use)). **Zappos: forbidden by the letter.** Its license excludes "any use of data mining, robots (bots), or similar data gathering and extraction tools" ([Zappos Conditions of Use, updated 2026-06-25](https://www.zappos.com/c/terms-of-use)). **ECCO: not read** (429). | **jcrew.com CH288: worked.** **Zappos review pages: worked.** **us.ecco.com: blocked (429). Amazon: blocked (500).** | 1 fetch per page. Free. |
| A7 | **Resale listings** (Poshmark, eBay) *(not in the issue)* | Worn pairs with the seller's description of condition and wear ("worn once", "sole separating"), and how the price holds. | **Low to medium.** Resale is evidence of how a shoe ages, but listings rarely give the style number and are skewed to unworn returns. | **Poshmark forbids it:** "copy, scrape, harvest, crawl or use any technology, software or automated systems to collect any…" ([Poshmark ToS §4.b, v4.6, 2025-06-03](https://poshmark.com/terms)). eBay terms not read. | **Search: worked** (7 Winona listings; 0 ECCO Margot). **Listing fetch: empty** (404, the listing is gone). | 1 search. Free. Search results only, given the terms. |

**Discarded, in a line:** paid social-listening tools (Brandwatch, Sprout
and similar) and the TikTok Research API. The tools cost money and are out
of the free tier (#92's O2). The Research API is for academic and
non-profit research (**unverified here, from memory**). Neither reaches
anything the search index does not reach for a single product.

## 3. The pilot: each approach tried once per shoe

Each cell gives the model-matched items that were usable, with an example,
plus any sibling or brand-paid items, which are labelled and not counted.
"Usable" means about the product as worn or tested, not a bare product
listing.

### J.Crew New Winona penny loafer (CH288)

| # | Approach | What came back | Exact-model usable | Example |
|---|---|---|---|---|
| A1 | Creator posts | Search `"Winona" penny loafer J.Crew review tiktok OR instagram`, plus a TikTok/Instagram-filtered search. 2 creator posts, both **sibling (lug-sole)**. `@pamelamvaldez`: caption "they're the Winona lug-sole penny loafers in spazzolato leather and they're on sale!!!", no disclosure, so **organic as disclosed, sibling**. `@kitkeenan`: "Linked on my ltk 👏🏻 these are elite", so **affiliate, sibling**. Both read with oEmbed. The rest were TikTok `/discover/` and Instagram `/popular/` aggregation pages (the discover fetch was empty). | **0** | [@pamelamvaldez](https://www.tiktok.com/@pamelamvaldez/video/7456243490922646830) (sibling) |
| A2 | YouTube | youtube.com-filtered search `J.Crew Winona loafer`: 10 results, **none names Winona**. J.Crew Factory penny loafers, hauls, and a J.M. Weston video. | **0** | none |
| A3 | Reddit | Blocked (see §2). Unfiltered search: 0 Reddit URLs. | **0** (blocked) | none |
| A4 | Editorial / blogs | "Tested" searches (2): **no editorial wear test of any Winona**. One commerce article, [Footwear News via Yahoo, 2024-04-01](https://www.yahoo.com/lifestyle/tiktok-famous-j-crew-penny-173956205.html) (fetched). It covers the original and croc Winona (**sibling**) and is **affiliate** ("may receive a commission"). The author does not say they wore it, and it quotes two unnamed "J.Crew shopper" reviews. | **0** | Footwear News (sibling, affiliate) |
| A5 | LTK / ShopMy | Filtered search: 5 Winona items, **none "New Winona"**. [LTK natamclaughlin](https://www.shopltk.com/explore/natamclaughlin/posts/88ad9c2a-2fd4-11ee-924f-0242ac110002) is the lug-sole. [LTK crystalinmarie](https://www.shopltk.com/explore/crystalinmarie/posts/fd071281-adb6-11ed-b831-0242ac110004) is the original spazzolato, 2023. There were also [a ShopMy product](https://shopmy.us/shop/product/121239), [a go.shopmy.us link](https://go.shopmy.us/p-11972493) and an LTK collection. All **affiliate, sibling or unknown**. Not fetched. | **0** | none |
| A6 | Retailer reviews | [jcrew.com CH288](https://www.jcrew.com/p/womens/categories/shoes/flats/new-winona-penny-loafers-in-italian-spazzolato-leather/CH288), fetched: **118 reviews, 4.2 average** (74 five-star, 20 four, 9 three, 7 two, 8 one). Quoted: "After just four wears, the leather on the side of one of the shoes completely split" (Khaylee, 1 week ago); "Very stiff and runs slightly big… 1/2 size too long" (Runnergirl1543, 4 days ago). No construction, origin or heel height on the page as read. | **118** (3 read verbatim) | the CH288 page |
| A7 | Resale | Poshmark search: 7 Winona listings, mostly BA190 or lug-sole ("Style No. BA 190", "never worn"), with none identifiable as CH288. The one fetch was 404. | **0** | none |

### ECCO Margot Bow Ballerina Flat, black

| # | Approach | What came back | Exact-model usable | Example |
|---|---|---|---|---|
| A1 | Creator posts | 2 searches. **All 3 TikTok hits are ECCO's own account** featuring `@Jessi`, so **paid (brand-commissioned)**. oEmbed caption: "Keep up. @Jessi in the ECCO MARGOT ballerina." It does not say which Margot. There was also one Instagram post by `@ecco` ("Steal the season in the #ECCO MARGOT ballerina"), which gave an empty oEmbed without a token. Other hits were **other brands' "Margot"** (VIVAIA). | **0** (3 brand-paid, model unknown) | [@ecco](https://www.tiktok.com/@ecco/video/7491685769170423062) (paid) |
| A2 | YouTube | youtube.com-filtered search: 1 relevant video, [Zappos "ECCO Margot Mary Jane Ballerina Ballet Flat SKU: 10004154"](https://www.youtube.com/shorts/EgRe52deC6s). It is a **sibling** (Mary Jane) and **retailer-produced**; oEmbed confirmed the channel as "Shop Zappos". The rest were about the dancer Margot Fonteyn. | **0** | Zappos short (sibling, retailer) |
| A3 | Reddit | Blocked. Unfiltered search: 0 Reddit URLs. | **0** (blocked) | none |
| A4 | Editorial / blogs | 2 searches: **no article names any Margot**. Aggregated "best ballet flats" lists (Forbes, AOL, Gulf News) came back without it. The Forbes fetch was 403. | **0** | none |
| A5 | LTK / ShopMy | Filtered search: **0 ECCO Margot**. Hits were VIVAIA Margot, Margaux Demi Jane, Hill House "Margot" and creators named Margot. | **0** | none |
| A6 | Retailer reviews | [Zappos Bow reviews](https://www.zappos.com/product/review/10016978), fetched: **2 reviews, 3.0 average**. The first (2025-06-17) is about Zappos sending the Bow **instead of** the Plain. The second (2025-02-05) is "Good quality." Neither gives wear duration. **Sibling:** the [Zappos Plain reviews](https://www.zappos.com/product/review/9992816) have 10 reviews at 4.0: "absolutely no arch support" (2026-03), "much too narrow for my regular width feet" (2025-09). us.ecco.com was 429 and Amazon was 500. | **2** (1 about the shoe) | Zappos Bow reviews |
| A7 | Resale | Poshmark search: **0 Margot**. The hits were ECCO Owando Bow and Touch Ballerina 2.0 (other models). | **0** | none |

**What the pilot says, as a count:** 14 approach-and-shoe cells. Only 2
returned model-matched items that were usable, and both were A6. There were
**zero organic creator posts that match the model** for either shoe.
**Inference:** the Winona result is typical of a long-running line with
many versions, and the Margot result is typical of a mid-price comfort
brand that pays for its creator content itself. These are two data points
and should not be read as a law.

## 4. Where each approach misleads, from the pilot

- **Sibling fame.** The "TikTok-famous" Winona (4.4 million views, per the
  search tool's summary of the Footwear News article; the fetched article
  did not repeat the figure, so it is unverified) is mostly the lug-sole
  and original. A step that counts "Winona" hits would
  report strong creator proof for CH288 when there is none.
- **Brand-paid volume.** Every ECCO Margot creator hit was ECCO's own
  account. A step that counts creator posts without the labelling rule
  would report three creator wears where there are zero organic ones.
- **Affiliate by construction.** Every LTK and ShopMy hit, and `@kitkeenan`'s
  "Linked on my ltk", earns on the click. A caption with no `#ad` can still
  be affiliate.
- **Editorial that is retailer reviews in disguise.** Footwear News quotes
  two anonymous "J.Crew shopper" reviews under an affiliate disclosure. It
  counts once, as A6, and not as an independent source.
- **Retailer reviews about the wrong thing.** Half of the Margot Bow's
  Zappos reviews are about fulfilment. The review page mixes in the Plain
  by accident, so it cannot be taken as the whole picture.
- **Name collisions.** VIVAIA, Coach and Margaux all sell a "Margot" flat,
  and a keyword match would absorb them.

## 5. Recommendation: the standard step

**Adopt an ordered step, "identify the model, then retailer reviews, then
the search index, then oEmbed", with a fixed budget per pick.** It beat
the alternatives because it is the only ordering where the first evidence
gathered is certainly about the right shoe, and where every later piece is
checked against that identity.

**The step, per pick:**

1. **Identify the model.** From the pick's product page (already fetched
   for the link), record the style or article number and the exact name.
   From one search, list the siblings that share the name.
2. **Retailer reviews.** Read the exact product page's reviews on the
   brand's own site or a named known retailer **whose terms were read and
   do not forbid it**. jcrew.com qualifies; Zappos does not, by the letter.
   Record the count, the average and up to three reviews that give wear
   duration, a failure or a fit note.
3. **Search index, four fixed queries.** Run `"<exact name>" review` and
   `"<exact name>" tiktok OR instagram`, then the same name filtered to
   `youtube.com` and to `shopltk.com, shopmy.us`. Read results as results,
   and never fetch LTK, ShopMy, TikTok, Instagram or Reddit pages. Fetch
   once any editorial article or blog that names the exact model.
4. **oEmbed, only to label.** For each creator post URL from step 3 that
   might match, call TikTok or YouTube oEmbed once to read the caption and
   disclosure.
5. **Report.** A table of what came back per approach, in the pilot's
   shape (§3), with an empty row stated as empty.

**Stop rule:** stop a pick at **8 searches and 6 fetches or oEmbed calls**,
or earlier after **two consecutive queries return no new model-matched
item**, whichever comes first. Never re-fetch a page that returned 403,
429, 500 or an empty body in the same round. **Say "thin evidence"** if the
pick ends with fewer than three model-matched, non-paid items. That is a
finding to report and not a reason to keep searching.

**Labelling rule** (for every creator, editorial or video item, as
disclosed):

- **paid**: posted by the brand's own account, or carrying `#ad`, `#sponsored`,
  "paid partnership" or `#<brand>partner`.
- **gifted**: "gifted", "c/o", "PR package" or "sent to me".
- **affiliate**: an LTK or ShopMy post or link, `rstyle.me`, `on.ltk.com`,
  `go.shopmy.us`, "linked on my LTK", or an article's "may receive a
  commission". **Any item found on LTK or ShopMy is affiliate by
  construction.**
- **organic (as disclosed)**: none of the above visible in what was read.
  The words "as disclosed" stay, because an unlabelled post can still be
  paid.
- **unknown**: the caption or disclosure could not be read (e.g. the
  Instagram oEmbed with no token).

Weight organic long-term items above everything else, and launch-week hauls
last. Paid items are listed but **never counted** toward "thin evidence".

**Model-match rule:** every item is labelled **exact** (it names the style
number or the full exact name, including words like "New" or "Bow"),
**sibling: <name>** (same line, different construction or upper, e.g.
"sibling: Winona lug-sole BT893", "sibling: Margot Plain"), or **unmatched**
(a generic "J.Crew loafers" or another brand's "Margot"). Unmatched items
are dropped. Sibling items are reported in their own column and never
added to the exact count. An item that does not say which version it
shows (ECCO's "the ECCO MARGOT ballerina") is **sibling-or-exact,
unconfirmed** and counted as sibling.

**When the step would mislead, and what the run does then.** The main case
is **sponsored-heavy or sibling-heavy results**: the Margot's creator hits
were 100% brand-paid, and the Winona's were 100% sibling. The run then
reports the exact, non-paid count, which is **zero** for both, above the
raw count. It says "thin evidence: creator proof is brand-paid" or
"sibling-only", and falls back to A6 and to long-term sibling evidence,
labelled as sibling. It does not present sibling fame as the pick's own. A
second case: **retailer reviews skewed to the first weeks**. A 4.2 average
over 118 reviews says little about month six, so the report names the
number of reviews that mention a duration. For CH288, none of the three
read gave one beyond "four wears".

**What the step cannot do, stated so the owner knows:** read Reddit, which
was the best long-term source for shoes before 2024. If the owner wants it,
the only route is the owner pasting a thread's URL and text into the round
issue. That fits the owner-supplied input model in
[`companion.md`](../shopper/companion.md).

### The strongest argument against, looked for

*"Retailer reviews are the least trustworthy form of social proof. Putting
them first builds the step on the weakest source."* This is true of
reliability. The ranking is not by reliability, though. It is by what is
certainly about this model and what this runtime can reach. I searched for
the case that would break it, a model-matched organic creator post or an
editorial wear test for either shoe, with 18 search queries across A1, A2,
A4 and A5, and found none. **If that absence is specific to these two
shoes** (a hotter product, say a Jamie Haller loafer, might have real
creator wear tests), then step 3 will find it anyway. Step 3 stays
mandatory, and only the order changes what is trusted first.

### What would flip it

- **Reddit becomes readable**, through an owner-pasted thread or a
  licensed route. Then Reddit goes second, above retailer reviews, for
  long-term wear.
- **Model-matched YouTube long-term reviews turn up routinely** for the
  owner's price tier. Then A2 goes second.
- **A retailer's terms are read and forbid even one fetch**, as Zappos's
  do by the letter. Then step 2 moves to the brand's own site only, and to
  "search-index snippets only" for that retailer.

## Proposed changes to `docs/shopper/` (not made)

These are proposals only. This run changes nothing under `docs/shopper/`.

- **File:** `docs/shopper/companion.md`, section "### The output shape".
  **Proposed line:** `Each pick carries a "Social proof" block run to docs/research/104-social-proof-approaches.md §5: model identity and siblings, retailer reviews, four search-index queries, oEmbed only to label; each item labelled paid / gifted / affiliate / organic (as disclosed) / unknown and exact / sibling; "thin evidence" stated when fewer than three exact, non-paid items.`
- **File:** `docs/shopper/companion.md`, section "### What the run may fetch
  and must not". **Proposed line:** `Social proof: never fetch reddit.com, tiktok.com, instagram.com, shopltk.com or shopmy.us pages; read them as search results only; oEmbed once per post URL only to read its disclosure; retailer review pages only where that retailer's terms were read and do not forbid automated access (jcrew.com yes; zappos.com no, by its Conditions of Use).`
- **File:** `docs/shopper/companion.md`, section "### What the owner puts
  in it". **Proposed line:** `Optional: Reddit or forum threads the owner has read about a pick, pasted as URL plus text; the run cannot reach Reddit itself.`

## Verified, inferred, assumed

- **Verified in this run:** each fetch and search result stated above,
  with its status. The J.Crew CH288 review count and distribution. The
  Zappos Bow and Plain review counts. The captions from TikTok oEmbed. The
  YouTube, Zappos, Poshmark and J.Crew terms clauses as quoted.
- **Carried from earlier runs, not re-read:** the TikTok, LTK and ShopMy
  terms (#86, #92).
- **Inferred:** that a search result is not "accessing the Service" under
  YouTube's terms. That CH288 differs materially from BA190. That the pilot
  pattern (sibling-heavy for long-running lines, brand-paid for comfort
  brands) generalises.
- **Assumed, load-bearing:** that WebSearch's index is representative of
  what a person searching Google would find. The search tool's coverage of
  TikTok and Instagram is not documented anywhere I read. Also assumed:
  that reading a retailer's review page once, on the owner's behalf, is the
  use the "bots" clause targets. Zappos's wording says it is, so the
  recommendation excludes Zappos.
- **Secondary only:** Reddit's terms. The primary page could not be
  fetched.

## Searches that came back empty

Recorded so the next round does not repeat them:

- Any Reddit URL for either shoe (3 phrasings).
- A YouTube video that names the Winona (J.Crew) or the Margot Bow (ECCO).
- An editorial or blog wear test naming the New Winona, any Winona, or any
  ECCO Margot.
- Any LTK or ShopMy item naming "New Winona" or ECCO Margot.
- A resale listing identifiable as CH288, or any Margot on Poshmark.
- An organic creator post naming "New Winona" or "Margot Bow".
