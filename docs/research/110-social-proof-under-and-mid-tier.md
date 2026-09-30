# Shopper round 3: social proof for the under-$400 and $400-$695 picks

**Decision this serves:** for each round-3 pick under $695, how much of what
is said about it is about **this exact model**, from someone not paid by the
brand, and whether it has held up past the first weeks - so the owner can
tell a well-evidenced pick from a well-marketed one. Child of
[#110](https://github.com/chamaya00/background-research-agents/issues/110),
run for [#112](https://github.com/chamaya00/background-research-agents/issues/112)
on 2026-09-30. Picks: [`110-round-3-picks.md`](110-round-3-picks.md) (#111),
rows U1-U3 and M1-M2. Method:
[#108's standard step](104-social-proof-approaches.md#5-recommendation-the-standard-step),
its stop rule, its labelling rule and its model-match rule, unchanged.

**Status:** run 1 of 3, complete for what this runtime can reach. Every
fetch below was made on 2026-09-30.

**Constraints, not guesses:** no fetch of `zappos.com`, `reddit.com`,
TikTok, Instagram, LTK or ShopMy pages - those appear here as **search
results only**, and TikTok / YouTube captions were read through oEmbed only
to label them. Evidence links do not have to pass
[`link-safety.md`](../shopper/link-safety.md); purchase links do, and none
is added here. **Guess in the issue:** that the hard part is model match.
It was, but in an unexpected direction for U1 (see "U1 model identity").

## Headline

| Pick | Exact, non-paid items | Sibling items (not counted) | Longest exact wear found | Evidence strength |
|---|---|---|---|---|
| U1 Madewell Greta Ballet Flat | 7 (2 editorial/blog, 1 TikTok unknown-label, 4 LTK creators) + 942 Nordstrom reviews | 0 kept | ~5 months, near-daily (blog, affiliate) | **moderate** |
| U2 MARGAUX James Loafer | 1 (PureWow) + 18 Nordstrom reviews | 2 (brand-level Margaux long-term) | "several commutes" | **thin** |
| U3 MARGAUX Roma Ballet Flat | 0 + 34 Nordstrom reviews | 2 (brand-level Margaux long-term) | none stated | **thin** |
| M1 Jamie Haller Penny Loafers, black | 0 | 2 (Town & Country, 3 years in Oxblood; ShopMy black listing) | none for the exact colourway | **thin** |
| M2 Alexandre Birman Clarita Ballerina Mary Jane Flat | 0; **no retailer reviews either** | 1 (Clarita sandals video, unread) | none | **thin** |
| J.Crew New Winona / ECCO Margot Bow | not re-searched - see [#107](104-social-proof-and-brand-verdicts.md) | - | - | as #107 |

1. **Only the cheapest pick has real proof.** The $98 Greta is the only one
   with three or more exact-model, non-paid items; every other pick is
   **thin evidence**. The more a shoe costs here, the less anyone has said
   about that exact shoe.
2. **Nobody organic has worn the exact M1.** Jamie Haller's fame is real,
   but the one long-term wear test found (Town & Country, three years) is
   the **Oxblood** Penny Loafer, and the black-buffalo Shopbop listing has
   no reviews at all. That fame is the sibling's, and is not counted.
3. **M2 has no evidence of any kind.** Nordstrom shows "no reviews yet", and
   every "Clarita" search result is a sandal, heel or sneaker sibling.
4. **MARGAUX's evidence is brand-level, not model-level.** Two long-term
   reviewers (one at five years) wear other Margaux styles; neither names
   the James or the Roma.
5. **Greta's complaints cluster on the leather and lining failing early**
   (4 independent sources, including Madewell's own admission of a
   defective early lining).

**Evidence strength rule used** (so the verdicts can be checked against the
counts): **thin** = fewer than 3 exact-model, non-paid creator or editorial
items (#108's "thin evidence" line); **moderate** = 3 or more, but none of
them organic (as disclosed) and reporting a month or more of wear;
**strong** = 3 or more, including at least one organic (as disclosed) item
reporting a month or more. Retailer reviews are reported alongside but do
not move the rating, because #108 counts creator proof. Sibling items never
count.

## U1. Madewell, "The Greta Ballet Flat", True Black - $98

### U1 model identity (step 1)

Nordstrom lists it as item **10091972**
([nordstrom.com](https://www.nordstrom.com/s/madewell-the-greta-ballet-flat-women/7575401),
fetched). #111 named "The Greta Mary Jane Flat" (madewell.com **NN044**) as
the likeliest mix-up. The search index shows NN044 under **both** names:
[".../the-greta-ballet-flat/NN044/"](https://www.madewell.com/p/womens/shoes/flats-loafers/ballet-flats/the-greta-ballet-flat/NN044/)
and [".../the-greta-mary-jane-flat/NN044/"](https://www.madewell.com/p/womens/shoes/ballet-flats/the-greta-mary-jane-flat/NN044/)
(search results, not fetched). Every review of the "Greta Ballet Flat"
below describes an **elastic strap across the foot**, which is what #111's
U1 row lists. **Inference:** "Greta Ballet Flat" and "Greta Mary Jane Flat"
are one construction under two names, not siblings. Items naming either
with the elastic strap are counted **exact**. The real siblings are the
Double-Strap, Glove, Lace-Up, Mule, Open-Weave, Suede and Metallic versions,
and items naming those are sibling.

### U1 creators who wore it (steps 3-4)

| Creator | Link | What they said | Label | Model match |
|---|---|---|---|---|
| There She Goes Again (blog, undated) | [review](https://thereshegoesagain.org/madewell-greta-review/) | Worn "almost every day" in London for about five months, "well over 10,000 steps"; "still looking and feeling good"; "the elastic strap and the MWL Cloudlift Lite padding seriously make these flats". Bought them herself. | affiliate (rstyle.me and retailer affiliate links) | exact |
| Angela Elias, PS Shopping (PopSugar), 2024-09-08 | [scraped copy](https://fashionartperfumesmagazine.com/madewell-greta-ballet-flats-review-with-photos/) - the PopSugar original was not fetched | "a handful" of wears; leather "buttery-soft"; no break-in; unlined upper "wrinkling and buckling". Repeats Madewell's note that "an early model of this shoe had a defective lining". | affiliate ("may earn commission") | exact ($98, Mary Jane strap) |
| @kerenna.a (TikTok) | [video 7351194538918087982](https://www.tiktok.com/@kerenna.a/video/7351194538918087982) | "Looove the color of my new @madewell greta ballet flats" (search result title; oEmbed returned **HTTP 400**) | unknown | exact name; colour not black (inference from caption) |
| Kaleybrook (LTK) | [post](https://www.shopltk.com/explore/Kaleybrook/posts/13a1bcee-268b-11f0-b03a-0242ac110017) | Title only: "Madewell The Greta Ballet Flat … curated on LTK" | affiliate (LTK) | exact name |
| shea_mcgee (LTK) | [post](https://www.shopltk.com/explore/shea_mcgee/posts/51212f46-2fef-11ee-b813-0242ac110003) | Title only: "The Greta Ballet Flat curated on LTK" | affiliate (LTK) | exact name |
| rpowrotterman (LTK) | [post](https://www.shopltk.com/explore/rpowrotterman/posts/2b92cd04-951a-11ef-9bc9-0242ac11001e) | Title only: "Madewell The Greta Ballet Flat in … curated on LTK" - the variant is cut off | affiliate (LTK) | exact name, variant unconfirmed |
| lifewithjazz (LTK, two posts) | [post 1](https://www.shopltk.com/explore/lifewithjazz/posts/91e880d1-81b2-11ef-af9a-0242ac110007), [post 2](https://www.shopltk.com/explore/lifewithjazz/posts/2a0289c3-9301-11ef-ba18-0242ac11000b) | Title only: "The Greta Ballet Flat (Women) curated on LTK" - "(Women)" is Nordstrom's naming | affiliate (LTK) | exact name |
| @madewell (TikTok) | [video 7337716649564474670](https://www.tiktok.com/@madewell/video/7337716649564474670) | "There's no ballet flat like Greta..." (search result title) | **paid** (brand's own account) - listed, not counted | exact name |

**Sibling or unmatched, not counted:** @emily.kierstead (TikTok,
[video](https://www.tiktok.com/@emmmck/video/7359009396287884549)), oEmbed
caption "These are the best purchase everrrr for the perfect spring ballet
flat 🥿 … #madewell" - organic (as disclosed), but it never says "Greta",
so it is **unmatched** and dropped. LTK "Greta Ballet Flat Mule" and ShopMy
"Open-Weave Leather" hits are **sibling**. The LTK posts are *curations*:
the titles show a link, not that the creator wore the shoe (inference from
what LTK titles say).

**Count:** 7 exact, non-paid creator or editorial items. Six are affiliate
by construction, one is unknown. **None is organic (as disclosed).**

### U1 long-term wear

**Retailer reviews:** Nordstrom, **942 reviews, 4.4 average**, fit summary
"true to size", read 2026-09-30. The fetch returned six verbatim; these are
counts of what was read, not of all 942. Nordstrom pools colours on one
page.

- **Months:** the There She Goes Again blog (about five months, near-daily)
  is the only exact item with a duration past weeks. It is affiliate, not
  organic, so nothing organic outranks it. Lynne66 (Nordstrom, 2024-11-12)
  has "several pairs in different colors", which implies repeat purchase
  but gives no duration.
- **Launch-week:** PopSugar ("a handful" of wears), and most Nordstrom
  reviews read.

| Complaint | Independent sources | Links |
|---|---|---|
| Leather or lining failing early | **4**: Buzzcutmom ("wore these for literally 1 hour... a chunk of leather peeling", 2024-12-10); Lisanolastname ("Left shoe was defective", 2025-04-14); There She Goes Again (sweat "messing with the lining" in summer); Madewell's own note of "a defective lining" on an early model, as repeated by PopSugar | [Nordstrom](https://www.nordstrom.com/s/madewell-the-greta-ballet-flat-women/7575401), [blog](https://thereshegoesagain.org/madewell-greta-review/), [PopSugar copy](https://fashionartperfumesmagazine.com/madewell-greta-ballet-flats-review-with-photos/) |
| Leather cheaper than it used to be | 1: ichen, 2024-04-07 | [Nordstrom](https://www.nordstrom.com/s/madewell-the-greta-ballet-flat-women/7575401) |
| Strap tension uneven between the two shoes | 1: JeninSAT, 2024-09-03 | [Nordstrom](https://www.nordstrom.com/s/madewell-the-greta-ballet-flat-women/7575401) |
| Shallow, tapered toe box | 1: Vvulpes, 2024-08-17 | [Nordstrom](https://www.nordstrom.com/s/madewell-the-greta-ballet-flat-women/7575401) |
| Unlined upper wrinkles and buckles | 1: PopSugar (who did not mind it) | [PopSugar copy](https://fashionartperfumesmagazine.com/madewell-greta-ballet-flats-review-with-photos/) |
| Sizing advice conflicts | 2: Madewell says size down half (per PopSugar); Nordstrom's summary and Lynne66 say true to size | as above |

**Steps run for U1:** 1, 2, 3 (all four queries), 4 (two oEmbed calls, one
HTTP 400). **What stopped it:** 5 of 6 fetches used, and the last two
queries (YouTube; a blog-and-lining query) returned no new exact item.
YouTube returned only Zappos's retailer product videos, which were not
counted. **Evidence strength: moderate** - 7 exact, non-paid items, but
none organic (as disclosed) with a month or more of wear.

## U2. MARGAUX, "The James Loafer", Black Nappa - $375

**Model identity:** "The James Loafer" (margauxny.com sometimes calls it
"The James Soft Loafer"), sacchetto construction, in Black Nappa, Mahogany
Nappa, and Cedar, Molasses and Indigo Suede
([margauxny.com](https://margauxny.com/products/the-james-loafer-black-nappa),
fetched; no style number, price or reviews in what the fetch returned).
Siblings: other Margaux loafers (**Andie**, **Marlowe**, **Louisa**) and
"The Loafer", whose Zappos review page came up in search and was not
fetched.

### U2 creators who wore it

| Creator | Link | What they said | Label | Model match |
|---|---|---|---|---|
| Marissa Wu, PureWow, updated 2026-05-24 | [article](https://www.purewow.com/fashion/margaux-shoes-review) | "so soft and flexible, while still creating a nice line"; "I've already done several commutes with no complaints from my feet"; sized down half a size, "the leather does stretch after a couple wears" | affiliate ("compensation through affiliate links"; "some items may be gifted" - not said which) | exact name; colour not stated |
| @margauxny / Margaux (Instagram) | [reel](https://www.instagram.com/reel/Dbycl9iJvYS/), [post](https://www.instagram.com/p/DUeJRsNkvrd/) | "Meet James, a loafer with the ease of a slipper"; "Soft touch. The James loafer combines a tailored look..." (search result titles) | **paid** (brand's own account) - not counted | exact name |

**Sibling, not counted:** PureWow's author has worn other Margaux styles
for "nearly five years" ("probably the best thing in my closet"; soles can
be redone by a cobbler), and The Fashion House Mom
([review](https://thefashionhousemom.com/margaux-shoes-review/), October
2024, ShopMy links so **affiliate**) has worn many pairs over years. **Both
are about the Demi, Fonteyn, Pointe and other Margaux styles, and neither
names the James.** That is brand evidence, and it is sibling.

**Count:** 1 exact, non-paid item. **Thin evidence.**

### U2 long-term wear

**Retailer reviews:** Nordstrom, **18 reviews, 4.8 average**
([nordstrom.com](https://www.nordstrom.com/s/margaux-the-james-loafer/9219895),
fetched). The fetch tool returned review **titles and summaries, not
reviewer names**, so each is cited by its title. A search snippet puts
margauxny.com at 4.81 over 21 reviews (not fetched, not counted). The
longest duration stated is "after two days of wear" ("Best shoe
investment"). One reviewer owns three pairs ("Absolutely OBSESSED").
**Nothing past weeks was found for this model.**

| Complaint | Independent sources | Links |
|---|---|---|
| Too flat, not enough arch support for long city walking | **2**: two Nordstrom reviews (one returned them; one "exceptional quality" but "too flat") | [Nordstrom](https://www.nordstrom.com/s/margaux-the-james-loafer/9219895) |
| Runs about half a size large | **2**: PureWow (sized down half); Nordstrom's sizing note "size down if between two sizes" | [PureWow](https://www.purewow.com/fashion/margaux-shoes-review), [Nordstrom](https://www.nordstrom.com/s/margaux-the-james-loafer/9219895) |
| Too soft to last heavy daily wear (a worry, not a failure) | 1: "Beautiful style but too soft" | [Nordstrom](https://www.nordstrom.com/s/margaux-the-james-loafer/9219895) |
| Exposed back stitching rubs the heel | 1, **search summary only** of margauxny.com reviews, not read | search for `"James Loafer" Margaux review` |

**Steps run for U2:** 1, 2, 3 (all four queries: review; tiktok/instagram;
YouTube; LTK/ShopMy, shared with U3). Step 4 did not run: the only exact
creator posts were the brand's own Instagram, and #108 found Instagram
oEmbed returns no caption without a token. **What stopped it:** two
consecutive queries (YouTube, then tiktok/instagram) returned no new exact,
non-paid item. **Evidence strength: thin** - 1 exact, non-paid item.

## U3. MARGAUX, "The Roma Ballet Flat", Black Nappa - $395

**Model identity:** "The Roma", pointed-toe ballet flat with an
elasticated topline, in Black, Praline and Espresso Nappa, Merlot Crinkle
Patent, and Moss, Leopard, Indigo and Cedar Suede
([margauxny.com](https://margauxny.com/products/the-roma-black-nappa),
fetched; no reviews in what the fetch returned). A search snippet puts the
Black Nappa page at **4.78 over 79 reviews** (not read). Siblings and name
collisions: Margaux's **Modern**, **Demi**, **Pointe** and **Fonteyn**
flats; **FRĒDA SALVADOR "Roma"** woven flats (another brand, unmatched).

### U3 creators who wore it

| Creator | Link | What they said | Label | Model match |
|---|---|---|---|---|
| - | - | **None found for the Roma.** Queries: `"Roma Ballet Flat" Margaux review`; `Margaux "Roma" ballet flat tiktok OR instagram`; YouTube; LTK/ShopMy; `"Margaux" "Roma" pointed ballet flat review worn`. The only Roma social hit is a ShopMy product page ([438324](https://shopmy.us/shop/product/438324)), a listing and not a post. | - | - |

**Checked and not counted:**

| Creator | Link | What they said | Label | Model match |
|---|---|---|---|---|
| Mary Lynn's Wardrobe (YouTube) | [video](https://www.youtube.com/watch?v=zMTmK0mby1A) | Title (oEmbed): "Trying the New Margaux Modern Ballet Flats \| Styling & Honest Review" | not read past the title | **sibling: Margaux Modern** |
| daniella (TikTok) | [video](https://www.tiktok.com/@thingsasoflate/video/7633967739865943326) | oEmbed caption: "very excited xo @margaux"; search title "Margaux Ballet Flats: My Honest Review & Sizing Guide" | unknown (the caption's tag of the brand is not a disclosure) | unmatched - no model named |
| Margaux (Instagram) | [post](https://www.instagram.com/p/DN553NMjeaX/) | "We've iterated on the ballet flat since the very ..." (search title) | paid (brand's own account) | sibling-or-exact, unconfirmed |
| PureWow; The Fashion House Mom | as in U2 | long-term wear of other Margaux flats | affiliate | sibling (brand-level) |

**Count:** 0 exact, non-paid items. **Thin evidence: no creator proof
found.**

### U3 long-term wear

**Retailer reviews:** Nordstrom, **34 reviews, 4.4 average**, fit "true to
size", width "runs slightly narrow"
([nordstrom.com](https://www.nordstrom.com/s/the-roma-ballet-flat/8870613),
fetched). Colours are pooled on one page (**inference**, per #111). None of
the five read states a duration; Kristina K. (2026-09-15) owns it "in 3
colors" and says it takes "about an hour to break in". **Nothing past
weeks was found.**

| Complaint | Independent sources | Links |
|---|---|---|
| Wide width still narrow | **2**: Sarah B. (Nordstrom, 2026-08-12, "The wide width is still extremely narrow"); a margauxny.com review via **search summary** ("just gives you more room in the toe box") | [Nordstrom](https://www.nordstrom.com/s/the-roma-ballet-flat/8870613); search `"Roma Ballet Flat" Margaux review` |
| Painful at the toes and backs | 1: Tumaris (2026-08-16, returned) | [Nordstrom](https://www.nordstrom.com/s/the-roma-ballet-flat/8870613) |
| Toe length too long | 1, **search summary only** of margauxny.com reviews | search `"Margaux" "Roma" pointed ballet flat review worn` |

**Steps run for U3:** 1, 2, 3 (all four queries plus one extra "worn"
query), 4 (two oEmbed calls; both came back sibling or unmatched). **What
stopped it:** the "worn" query and the tiktok/instagram query both returned
nothing exact, and 5 of 6 fetches were used. **Evidence strength: thin** -
0 exact, non-paid items.

## M1. Jamie Haller, "Penny Loafers", Black - $625

**Model identity:** Shopbop style **JHALL30000**, black **buffalo** leather,
leather sole with rubber patch, made in Italy
([shopbop.com](https://www.shopbop.com/penny-loafer-lth-bop1-jamie/vp/v=1/1590217063.htm),
fetched; no reviews on the page; note "Customers say: Runs small"). The
brand's own page for "The Penny Loafer in Black" ($625) describes a matte,
hand-waxed leather with "pronounced grain" and does not name the hide
([shop-jamiehaller.com](https://shop-jamiehaller.com/products/the-penny-loafer-in-black),
fetched), so whether the two are one product is **unconfirmed**. Siblings
(from #111 and this run): **The Heeled Penny Loafer**; the goatskin "The
Penny Loafers" on Shopbop
([1519740300](https://www.shopbop.com/penny-loafer-jamie-haller/vp/v=1/1519740300.htm),
search result); the black $765 listing; Oxblood, Brown, Suede, Croc and
patent versions; Penny Loafer Mules.

**Model-match rule applied here:** the Penny Loafer is sold in several hides
under one name, and a review that names a colourway other than black is a
different upper. By #108's rule ("same line, different construction or
upper"), it is **sibling**.

### M1 creators who wore it

| Creator | Link | What they said | Label | Model match |
|---|---|---|---|---|
| - | - | **None found for the black Penny Loafer.** Queries: `Jamie Haller "Penny Loafer" review flat`; YouTube (returned only other brands); `"Jamie Haller" "penny loafer" worth it wore months review blog`; LTK/ShopMy; `"Jamie Haller" penny loafers tiktok OR instagram black`; an editor-review query. | - | - |

**Sibling evidence, in its own table and not counted:**

| Creator | Link | What they said | Label | Model match |
|---|---|---|---|---|
| Roxanne Adamiyatt, Town & Country (via AOL), 2024-08-24 | [article](https://www.aol.com/does-iykyk-loafer-live-hype-150000993.html) | Worn nearly three years: "my oxblood pair has personality and signs of use, but just get better and better over time"; "glove-like without being too rigid"; she has the leather sole replaced when it wears | affiliate ("earn commission"); purchase or gift not stated | **sibling: Penny Loafer in Oxblood** |
| ShopMy product page "JAMIE HALLER \| The Penny Loafers - Black" | [link](https://go.shopmy.us/p-30087049) | Search result title only; a ShopMy snippet says the Penny Leather Loafer is "recommended by over 1,100 curators" | affiliate (ShopMy) | sibling-or-exact, unconfirmed (could be the $765 black listing) |
| @jamiehaller-tagged Instagram post | [post](https://www.instagram.com/p/Cz7AaEyxyXA/) | "Just in!! Jamie Haller black patent loafers!" (search title) | unknown | sibling: patent |
| Jamie Haller's own Substack | [post](https://jamiehaller.substack.com/p/the-mens-penny-loafer) | The founder on the men's penny loafer (search result) | paid (brand's own) | sibling: men's |

**Unmatched, dropped:** @marah.goralczyk (TikTok), whose caption says she
found loafers "JUST AS NICE" as Jamie Haller - a dupe, not the shoe.

**Count:** 0 exact, non-paid items. **Thin evidence: creator proof is
sibling-only.** This is the case #108 warned about: the fame is real, and
it belongs to the line and to Oxblood, not to this listing.

### M1 long-term wear

**Nothing for the exact model.** Shopbop has no reviews; goop's page
returned **HTTP 403**. The Town & Country three-year report is the
strongest long-term evidence in this document, and it is a **sibling**. If
the owner treats colour as immaterial for this line, it would be the one
item anywhere here that is long-term, named and not brand-paid. That is
the owner's call, and this run does not make it for them.

| Complaint | Independent sources | Links |
|---|---|---|
| Sizing: runs small, or varies | **2**: Shopbop "Customers say: Runs small"; Alicia Lund's Substack, via **search summary only** ("sizing seems to vary wildly") - the page returned **HTTP 403** | [Shopbop](https://www.shopbop.com/penny-loafer-lth-bop1-jamie/vp/v=1/1590217063.htm); [Substack](https://aliciamlund.substack.com/p/a-fall-loafer-breakdown) (403) |
| Leather sole wears and needs replacing | 1, **sibling** (Town & Country) - maintenance, not a failure | [article](https://www.aol.com/does-iykyk-loafer-live-hype-150000993.html) |

**Steps run for M1:** 1, 2 (Shopbop and the brand page, neither with
reviews; goop 403), 3 (all four queries plus two extra), 4 not run (no
exact creator post URL to label). **What stopped it:** 6 searches and 5
fetches, and the last two queries returned only siblings. **Evidence
strength: thin** - 0 exact, non-paid items.

## M2. Alexandre Birman, "Clarita Ballerina Mary Jane Flat", Black - $625

**Model identity:** Nordstrom style **11470671**
([nordstrom.com](https://www.nordstrom.com/s/alexandre-birman-clarita-ballerina-mary-jane-flat-women/9025588),
fetched): **"No reviews yet"**, fit "true to size". Siblings: the
**Clarita Ballerina Flat** without the strap (Nordstrom item 10174106,
[fetched](https://www.nordstrom.com/s/alexandre-birman-clarita-ballerina-flat-women/7659802):
sold out, no reviews), the **Asymmetric Clarita Mary Jane** (pointed,
suede), and the Clarita sandals, block heels and sneakers. Name collision:
Birkenstock "Santa Clarita" Mary Janes (unmatched).

### M2 creators who wore it

| Creator | Link | What they said | Label | Model match |
|---|---|---|---|---|
| - | - | **None found.** Queries: `Alexandre Birman "Clarita Ballerina" review`; `"Clarita" "Mary Jane" Alexandre Birman flat tiktok OR instagram OR review`; YouTube + LTK/ShopMy combined. | - | - |

**Sibling, not counted:** "Review: Alexandre Birman Clarita Sandals"
([YouTube](https://www.youtube.com/watch?v=UX4ZJ7n1y2M), search result, not
read); @alexandrebirman TikToks on the Clarita knot, jelly sandal and
sneaker (paid, brand's own).

**Count:** 0 exact, non-paid items. **Thin evidence: no evidence of any
kind for this model, retailer reviews included.**

### M2 long-term wear

**None found, for the exact model or for its closest sibling.** No
complaints can be counted, because nothing was said about it.

**Steps run for M2:** 1, 2 (no reviews at Nordstrom), 3 (three queries; the
YouTube and LTK/ShopMy queries were combined into one), 4 not run (no
creator post). **What stopped it:** all three queries returned nothing
exact - two consecutive empties met the stop rule after the second, and
the third was run to make sure of it.

**Evidence strength: thin** - 0 exact, non-paid items.

## J.Crew and ECCO: cited to #107, not re-searched

Neither is a round-3 row (#111 says so), and the issue asks for #107's
findings to be reused rather than redone. **No query or fetch was run for
either in this document.**

- **J.Crew New Winona, CH288:** creator proof -
  [#107 §1.1](104-social-proof-and-brand-verdicts.md#11-creators-who-wore-it)
  (thin evidence, sibling-only: 0 exact, non-paid). Long-term wear and
  complaints - [#107 §1.2](104-social-proof-and-brand-verdicts.md#12-long-term-wear)
  (118 jcrew.com reviews, 4.2; stiffness, half a size long, one early
  leather split). Brand -
  [#107 §3.1](104-social-proof-and-brand-verdicts.md#31-jcrew-footwear).
  Verdict - [#107 §5](104-social-proof-and-brand-verdicts.md#5-verdicts-per-pick),
  "try in store first". **Evidence strength: thin**, per #107's counts.
- **ECCO Margot Bow, black:** creator proof -
  [#107 §2.1](104-social-proof-and-brand-verdicts.md#21-creators-who-wore-it)
  (thin evidence, brand-paid only). Long-term wear -
  [#107 §2.2](104-social-proof-and-brand-verdicts.md#22-long-term-wear).
  Brand - [#107 §3.2](104-social-proof-and-brand-verdicts.md#32-ecco).
  Verdict - [#107 §5](104-social-proof-and-brand-verdicts.md#5-verdicts-per-pick),
  "try in store first, leaning swap". **Evidence strength: thin**, per
  #107's counts.

**One link between them:** #107 named "Madewell Greta" as the next
candidate for a Margot Bow swap. U1 above is that shoe, and it is the only
pick in either tier whose evidence is not thin. That is a comparison of
evidence, not of shoes.

## Stop rule, per pick

| Pick | Step 1 | Step 2 | Step 3 | Step 4 | Searches / fetches | What stopped it |
|---|---|---|---|---|---|---|
| U1 | ran | ran (Nordstrom) | ran, 4 queries | ran, 2 oEmbed (1 × HTTP 400) | 4 / 5 | two consecutive queries with no new exact item |
| U2 | ran | ran (Nordstrom; brand page had no reviews in the fetch) | ran, 4 queries (LTK/ShopMy shared with U3) | not run: only brand posts, Instagram oEmbed needs a token (#108) | 4 / 4 | two consecutive queries with no new exact item |
| U3 | ran | ran (Nordstrom; brand page likewise) | ran, 5 queries | ran, 2 oEmbed | 5 / 5 | two consecutive queries with no new exact item |
| M1 | ran | ran; no reviews on either page, goop 403 | ran, 6 queries | not run: no exact post | 6 / 5 | two consecutive queries returning siblings only |
| M2 | ran | ran; no reviews | ran, 3 queries | not run: no post | 3 / 2 | two consecutive empty queries |
| Winona, Margot Bow | - | - | - | - | 0 / 0 | not re-searched by rule (#107) |

No pick reached #108's cap of 8 searches and 6 fetches.

## Not reachable

- **goop.com** (Jamie Haller The Penny Loafer): **HTTP 403**.
- **aliciamlund.substack.com** ("A Fall Loafer Breakdown"): **HTTP 403**;
  its sizing claim is from a search summary only.
- **TikTok oEmbed** for @kerenna.a's Greta video: **HTTP 400**; labelled
  unknown.
- **margauxny.com reviews** (James, 21; Roma, 79): the product pages
  fetched, but the reviews did not come back with them (**inference**: they
  load in a script). Their numbers are from search snippets and are not
  counted.
- **PopSugar's original** Greta review was not fetched; a scraped copy was
  read instead, and its wording is paraphrased ("by means of a breaking-in
  interval"), so quotes from it are approximate.
- **Not fetched, by rule:** zappos.com (Greta and "The Loafer" review
  pages appeared in search), reddit.com, TikTok, Instagram, LTK and ShopMy
  pages.
- **Instagram captions:** not read; Instagram oEmbed needs a token (#108).

## Searches that came back empty

- Every Roma, Jamie Haller (exact colourway) and Clarita Mary Jane query
  above - listed in each pick's creator table so they can be re-run.
- `Jamie Haller penny loafer review` on YouTube: only other brands'
  loafers.
- `Margaux "James" loafer` on YouTube: no James video, only general Margaux
  reviews that do not name it.

## Verified, inferred, assumed

- **Verified (fetched 2026-09-30):** every retailer review count, average
  and quote cited to Nordstrom or Shopbop; the blog, PopSugar-copy, PureWow
  and Town & Country quotes and disclosures; every oEmbed caption quoted.
- **Inferred:** that Greta "Ballet Flat" and "Mary Jane Flat" (NN044) are
  one construction; that Nordstrom pools colours; that LTK "curated"
  titles do not show a wear; that the margauxny.com reviews load in a
  script.
- **Assumed, load-bearing:** that the Nordstrom review fetch returned a
  fair sample. It returns about six reviews of hundreds, so a complaint
  count here is a floor, not a rate.

## Recommendation

**Treat U1 (Madewell Greta) as the only pick in these two tiers with
enough exact-model evidence to judge, and treat U2, U3, M1 and M2 as
"thin evidence - try in store first".** For M1, show the owner the Town &
Country three-year report **labelled as the Oxblood sibling**. It is the
best long-term evidence here, and whether it transfers to black buffalo
is the owner's call, not this run's. Carry the Greta's early leather and
lining complaints (4 sources) with it, because they are what its evidence
is mostly about.

**Strongest argument against, looked for:** *"Counting creator items
rewards the cheapest, most-sold shoe, not the best-made one. The Greta
wins on volume that affiliate LTK curators produce for any $98 shoe."*
That is largely true. Six of the Greta's seven items are affiliate, none
is organic, and its most-repeated complaint is a durability failure. I
looked for the reverse case - an organic long-term item for a pricier
pick - and found one, for M1, and it is a sibling. So the ranking says
which picks can be **judged** from what is published, not which is the
better shoe.

**What would flip it:** an owner-pasted Reddit thread, or a named
wear-test of the black Jamie Haller or either MARGAUX model, would move
that pick off thin. The owner deciding that colourway does not matter for
the Jamie Haller Penny Loafer would move M1 to one long-term item: still
thin by count, but no longer empty.
