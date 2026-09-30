# Shopper round 2: everyday women's footwear, from the owner's wishlist

**Decision this serves:** which everyday women's shoes to show the owner
next, and which Style lines the owner should approve so that a pick's "why"
can stop saying "none yet". Run for
[#101](https://github.com/chamaya00/background-research-agents/issues/101) on
2026-09-30, following [`companion.md`](../companion.md). Round 1 is
[#98's dry run](../../research/95-shopmy-companion-dry-run.md).

**Inputs, as the issue set them:**

- **Need:** new women's footwear to wear every day. No budget, no size, and
  no size search term used.
- **Taste source 1:** the owner's ShopMy wishlist,
  https://shopmy.us/collections/7944423, cleared for public use by the owner
  on 2026-09-30.
- **Taste source 2 (fallback):** the driver's text transcription of the four
  product cards on that wishlist (names and descriptions only, no brands).

## Which taste source this round used

**Taste source 2 only. The link approach failed again.**

The wishlist link was fetched **once**, on 2026-09-30, with WebFetch. It
returned no error and an **empty body**: no text, product names, brands,
prices or links. So there was **no `go.shopmy.us` link to follow**, and none
was fetched. It was not re-fetched, rendered or crawled. This is the same
result round 1 got for three creator links ([round 1,
Findings §1](../../research/95-shopmy-companion-dry-run.md#1-what-each-creator-link-returned))
and #92 got before it: a ShopMy collection link, like a creator link, gives
a non-rendering fetch nothing.

Everything below rests on the four product names and descriptions in the
issue body.

## The four wishlisted items, identified

One web search on each item's exact name. The brand is taken from what the
results agree on. Identification is not the link-safety test: a result naming
a brand is evidence of the brand, not of which domain is the brand's own
(see "Links" below).

| # | Wishlist name | Brand | Source | Confidence and caveats |
|---|---|---|---|---|
| 1 | "Topo Leather Bootie" | **Dear Frances** | Search for `"Topo Leather Bootie"` returned [dearfrances.com "Topo Bootie, Black"](https://dearfrances.com/products/topo-bootie-black) and other Dear Frances colourways, and a stockist listing, [romiboutique.com "Topo Bootie"](https://www.romiboutique.com/products/topo-bootie). | **Identified, medium confidence.** The results call it "Topo Bootie", not "Topo Leather Bootie", and the search summary describes a "sculptural mid heel" where the transcription says "slim kitten heel". No other brand uses the name in the results. Not fetched. |
| 2 | "The Heeled Penny Loafer" | **Jamie Haller** | Search for `"The Heeled Penny Loafer"` returned ["The Heeled Penny Loafer in Black – Jamie Haller"](https://shop-jamiehaller.com/products/the-heeled-penny-loafer-in-black) and an Oxblood colourway. | **Identified, high confidence**: the only exact-name match. Thursday Boots and Kate Spade sell heeled penny loafers under other names. Not fetched. |
| 3 | "Prudence 45 Nappa Leather Pump Heel" | **BY FAR** | Search for `"Prudence 45" nappa leather pump` returned ["Prudence 45 Black Nappa Leather Pump – BY FAR"](https://byfar.com/products/prudence-45-black-nappa-leather), corroborated by listings naming BY FAR on [Smallable](https://www.smallable.com/en/product/prudence-45-leather-pumps-black-by-far-413807), [Farfetch](https://www.farfetch.com/shopping/women/by-far-prudence-45-pumps-item-33322912.aspx) and [amazon.com](https://www.amazon.com/by-FAR-Womens-Prudence-45/dp/B0FRB8JZ9T). | **Identified, high confidence.** The search summary gives a 4.5 cm block heel, which confirms the transcription's "about 45 mm". Not fetched. |
| 4 | "Leather Knotted Ballerina Flats" | **Not identified** - two candidates | Search returned the exact name under **two** brands with the **same reference number, 11562750**: [massimodutti.com "Leather knotted ballerina flats · Black"](https://www.massimodutti.com/us/leather-knotted-ballerina-flats-l11562750) and [zara.com "Leather knotted ballerina flats - Black"](https://www.zara.com/us/en/leather-knotted-ballerina-flats-p11562750.html). | Both pages were fetched once to settle it and both returned **HTTP 403**. Both brands belong to the same group, so a shared reference is plausible but unconfirmed (**inference**). The search summary's "AIRFIT" insole is a term Zara uses; the title format is Massimo Dutti's. Left unresolved rather than guessed. Jil Sander sells a "hand-knotted" ballerina, not under this name. |

**Inference, not verified:** the three priced items sit in a designer price
tier (search summaries gave $695, $695 and $400; none was read at a store).
That is not turned into a Budget line. Budget is the owner's to set, and is
interview question 4 below.

## Proposed Style lines

Proposals for the owner to approve, in the syntax of
[`profile-template.md`](../profile-template.md). **None is written into any
profile.** A pick below names them as "Style (proposed) line n".

- **Style (proposed) line 1:** `black leather, smooth or softly grained`.
  *Owner's wishlist, items 1-4, round 2 (#101), 2026-09-30.*
  All four are black leather. Not "smooth" alone: item 2 is grained, item 3
  is soft nappa.
- **Style (proposed) line 2:** `flat or low heel, 45 mm or under, for every day`.
  *Owner's wishlist, items 2, 3 and 4, round 2 (#101), 2026-09-30.*
  Item 4 is flat, item 3 is 45 mm, item 2 is on a low block heel. Item 1's
  kitten heel is the exception and is why this line says "for every day"
  rather than "always" (**inference**; interview question 3 asks it).
- **Style (proposed) line 3:** `classic silhouettes: penny loafer, ballet flat, low pump, sock-fit ankle bootie`.
  *Owner's wishlist, items 1-4, round 2 (#101), 2026-09-30.*
  One silhouette per item, none of them trend shapes.
- **Style (proposed) line 4:** `minimal: no visible logo or metal hardware; a small self-leather detail (knot, bow, penny strap) is fine`.
  *Owner's wishlist, items 1-4, round 2 (#101), 2026-09-30.*
  The only details on the four are a knot (4), a penny strap (2) and piping
  or a back zip (3, 1). **Inference** from the descriptions, not from the
  products' pages.

**Not proposed:** a toe-shape line. The four have a pointed, a
rounded-square, a round and a loafer toe, so they support no preference.

All four lines **re-rank**; none gates.

## Picks - 2 of 3

**Two picks, both new, both flat.** The issue asked for flat or low heel over
the kitten-heel bootie; neither pick has a heel above a quarter inch. No
wishlist item is a pick (see "Why no wishlist pick" below). Nothing was
checked for size or stock.

### 1. J.Crew - New Winona penny loafers in Italian spazzolato leather, black

| Field | |
|---|---|
| **Item** | J.Crew, "New Winona penny loafers in Italian spazzolato leather" (black offered) |
| **Price as listed** | $198 as listed on jcrew.com, 2026-09-30. No sale price shown. |
| **Link** | https://www.jcrew.com/p/womens/categories/shoes/flats/new-winona-penny-loafers-in-italian-spazzolato-leather/CH288 - clean link - no affiliate. `jcrew.com` is a named known retailer in [`link-safety.md`](../link-safety.md). Choose black on the page. |
| **Why** | The flat version of wishlist item 2: a black leather penny loafer (Style (proposed) lines 1 and 3) sold under J.Crew's flats category, so it meets Style (proposed) line 2 where the Jamie Haller heeled loafer only nearly does. Heel height was not stated on the page. |
| **Found via** | search. |
| **Size** | Not checked. No Sizes search term used. Check size at the store. |

### 2. ECCO - Margot Bow Ballerina Flat, black

| Field | |
|---|---|
| **Item** | ECCO, "Margot Bow Ballerina Flat", Black |
| **Price as listed** | $139.95 as listed on zappos.com, 2026-09-30. |
| **Link** | https://www.zappos.com/p/womens-ecco-margot-bow-ballerina-flat-black/product/10016978/color/3 - clean link - no affiliate. `zappos.com` is a named known retailer in [`link-safety.md`](../link-safety.md). |
| **Why** | A black leather ballet flat with a small bow (Style (proposed) lines 1, 3 and 4), on a 1/4 inch heel with a padded leather-covered footbed, which the listing pitches for day-to-day wear (Style (proposed) line 2). The closest new item to wishlist item 4. |
| **Found via** | search. |
| **Size** | Not checked. No Sizes search term used. Check size at the store. |

### Why no wishlist pick

The best everyday wishlist item is **item 4, the knotted ballerina flats**:
flat, soft leather, and the cheapest-looking of the four. It is not a pick
because its brand could not be settled and both candidate pages returned 403,
so there was no price to show and no domain to confirm. **Item 3, BY FAR
Prudence 45**, is the next: low block heel, soft nappa. `nordstrom.com`'s BY
FAR pumps page, fetched once, listed no products, so no named known retailer
page carrying it was found, and `byfar.com` does not pass the tightened test
below. A third pick with no link and no price would be padding.

Item 1, the kitten-heel bootie, was ranked below the others for every day as
the issue asked.

### A third candidate, dropped

**Lands' End "Essential Leather Ballet Flats"** on nordstrom.com ($129.95 as
listed, 2026-09-30; black offered; "rounded-toe construction with a classic
bow accent"). It fits the same lines as pick 2 and has a verified link.
Dropped because it duplicates pick 2's slot and its page gave no heel height
or footbed detail to separate it on all-day wear. Named so the owner can ask
for it. A **MANGO bow round toe ballet flat** on nordstrom.com was also
dropped: the listing's colour was light pastel brown, not black.

### Links

**The tightened test from the issue:** a domain counts as a brand's own only
if a named known retailer's page, or the brand's official social profile,
names it. **Both picks avoid the question** by linking to a named known
retailer's own product page (`jcrew.com`, `zappos.com`). J.Crew is both brand
and listed retailer.

No brand-own domain was used for a link. Hosts seen and **not** used as
links, and why:

- `dearfrances.com`, `shop-jamiehaller.com`, `byfar.com`,
  `massimodutti.com`, `zara.com`: brand domains by search result only. No
  named known retailer page or official social profile naming them was read,
  so under this round's test **none is confirmed**. `shop-jamiehaller.com` in
  particular is a hyphenated `shop-` host, the shape a lookalike would take;
  it is **not** shown to be one, only unconfirmed.
- `romiboutique.com`, `thecoolhour.com`, `smallable.com`, `farfetch.com`,
  `lyst.com`, `ssense.com`, `thursdayboots.com`, `na-kd.com`,
  `ballerette.com`, `balielf.com`, `quince.com`, `dolcevita.com`: stockists
  or brands not on the named known retailer list. Not linked.
- `ebay.com`, `etsy.com`, `pinterest.com`: marketplaces and boards. Not
  linked.

**Lookalikes seen: none seen.** No host posed as another brand's store. The
two from #95 (`unofficed.com`, `elearn.nptel.ac.in`) did not appear.

### Proposed

None this round. The wishlist page gave nothing to be "similar to", and the
items themselves are the owner's, not a proposal.

## Interview questions

Round 2 has no purchase from round 1 to follow up, so these are still intake
questions, carried from round 1 where they apply. Five. None asks a size:
Sizes is private (O4).

1. **What does "every day" mean for you - mostly walking, standing at work,
   errands, something else?** *(Round 1 Q1, unanswered.)*
2. **Is the kitten-heel bootie an everyday shoe for you, or an occasional one?**
   *(New: it decides whether Style (proposed) line 2 caps heel height at
   45 mm or allows a slim mid heel.)*
3. **What would you not wear - a colour other than black, a chunky or lug
   sole, laces, a visible logo?** *(Round 1 Q3, sharpened by the wishlist.)*
4. **Is there a price above which you would not buy everyday shoes?**
   *(Round 1 Q4, unanswered. The wishlist's identified items run about
   $400-$695 by search summary, which is why this matters.)*
5. **Which of the four wishlist items is closest to what you want now, and
   why?** *(New: replaces round 1 Q2, "what do you wear now", which the
   wishlist partly answers.)*

## Profile lines these answers would create

Proposals for the owner to approve. None is written by this run.

| Q | Section | Line an answer would add | Effect |
|---|---|---|---|
| - | **Wants** | `W1` · open · "new women's footwear to wear every day" · budget `<from Q4>`. *Round 1 issue #98, carried into round 2 (#101), 2026-09-30.* | **Gates**: a round serves only an open Want. Created by the need, not an answer. |
| - | **Style** | Style (proposed) lines 1-4 above. *Owner's wishlist, round 2 (#101), 2026-09-30.* | **Re-rank.** Created by the wishlist, awaiting approval. |
| 1 | **Style** | `<occasion, e.g. all-day walking on pavement>`. *Round 2 interview Q1, <date>.* | **Re-ranks** cushioned soles above thin leather soles, or the reverse. |
| 2 | **Style** | Amends proposed line 2 to `flat or low heel, 45 mm or under` **or** `flat to slim mid heel`. *Round 2 interview Q2, <date>.* | **Re-ranks.** Never gates. |
| 3 | **Style** | `<disliked detail as a preference, e.g. prefers slim leather soles>`. *Round 2 interview Q3, <date>.* | **Re-ranks.** A **Not interested** line (gates) only if the owner says "stop showing me", shown as a diff first. |
| 4 | **Budget** | `footwear` · up to `<$ amount>`. *Round 2 interview Q4, <date>.* | **Gates.** Round 2 had none, which is why nothing was left out on price. |
| 5 | **Style** | `closest to: <item> - <the owner's reason>`. *Round 2 interview Q5, <date>.* | **Re-ranks**, weighting the proposed line that item rests on. |

## What the run could not do

- **Read the wishlist.** `shopmy.us/collections/7944423` returned an empty
  body. No product, brand, price or `go.shopmy.us` link.
- **Identify item 4's brand.** `massimodutti.com` and `zara.com` both returned
  HTTP 403 for the one product page each.
- **Price or link any wishlist item.** Items 1-3 were identified by search
  only and not fetched; no named known retailer page carrying them was read
  (`nordstrom.com`'s BY FAR pumps page listed no products).
- **Confirm any brand-own domain** under the tightened test. Not attempted
  beyond the above: both picks link to named known retailers instead.
- **Read J.Crew's heel height.** The Winona page did not state it.
- **Check size or stock.** Not attempted, by decision (O3).
- **Use the Shop catalog.** No shell, no Shop CLI, no POST.
