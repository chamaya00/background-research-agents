# Shopper round 3: everyday footwear picks across three price tiers

**Decision this serves:** which everyday women's shoes to put in front of the
owner in each of three price tiers (under $400, $400-$695, over $695), so
that the social-proof children of
[#110](https://github.com/chamaya00/background-research-agents/issues/110)
have an exact model, a price and a safe link to check for each. Run for
[#111](https://github.com/chamaya00/background-research-agents/issues/111)
on 2026-09-30. No social proof here; that is the next children's work.

**Inputs:** the four proposed Style lines and the wishlist transcription in
[round 2 (#101)](../shopper/rounds/101-everyday-footwear.md); the link rule
and the tightened brand-domain test in
[`link-safety.md`](../shopper/link-safety.md) and #101; #107's verdicts in
[`104-social-proof-and-brand-verdicts.md`](104-social-proof-and-brand-verdicts.md).

**Status:** run 1 of 3. Every price below was read on the retailer's own
product page on **2026-09-30**. Nothing was checked for size or stock beyond
what the page said unprompted (sizes are private, O4).

**Constraints, not guesses:** no fetch of `zappos.com`, `reddit.com`,
TikTok, Instagram, LTK or ShopMy pages (issue). **Guess in the issue:** that
the wishlist brands can be bought at $400-$695 through a linkable page. Two
of the three could not be (see "Wishlist items" below).

## The four Style lines, as round 2 proposed them

1. `black leather, smooth or softly grained`
2. `flat or low heel, 45 mm or under, for every day`
3. `classic silhouettes: penny loafer, ballet flat, low pump, sock-fit ankle bootie`
4. `minimal: no visible logo or metal hardware; a small self-leather detail (knot, bow, penny strap) is fine`

"Fits 1-4" below means all four. Where a row bends a line it says which and
why. Heel height is given **as listed**; where the page gave none, the row
says "not stated on the listing" rather than a number read off a photo.

## Headline

- **Under $400: 3 picks.** Madewell Greta Ballet Flat ($98), MARGAUX The
  James Loafer ($375), MARGAUX The Roma Ballet Flat ($395). All black
  leather, all flat, no hardware.
- **$400-$695: 2 picks, both not on the wishlist.** Jamie Haller Penny
  Loafers, black ($625, the flat sibling of wishlist item 2), and Alexandre
  Birman Clarita Ballerina Mary Jane Flat ($625, bends line 3). No wishlist
  item could be linked (below).
- **Over $695: 2 picks.** The Row Fay II Ballerina Flat ($920) and Tod's
  Penny Loafer ($825).
- **All seven links are on a named known retailer** (`nordstrom.com` or
  `shopbop.com`). No brand-own domain was needed or used.

## Picks

"Siblings to watch for" is for the proof children's exact-or-sibling rule
([#108 §5](104-social-proof-approaches.md#5-recommendation-the-standard-step)):
products sharing the name, or a name close enough that a review or post
could be about the wrong one.

### Under $400

| # | Exact model | Price as listed (retailer, date read) | Heel height as listed | Colour / material as listed | Style lines | Purchase link (rule it rests on) | Siblings to watch for |
|---|---|---|---|---|---|---|---|
| U1 | **Madewell, "The Greta Ballet Flat"**, True Black | $98.00, nordstrom.com, 2026-09-30 | "Flat (ballet flat style)"; no number stated on the listing | True Black; leather upper and lining, synthetic sole; elastic strap across the foot | **Fits 1-4.** 1: black leather. 2: flat. 3: ballet flat. 4: the only detail is an elastic strap, no hardware or logo on the upper. | https://www.nordstrom.com/s/madewell-the-greta-ballet-flat-women/7575401 - choose True Black. Named known retailer (`nordstrom.com`); **sold by Nordstrom** per the page. | Many. **The Greta Mary Jane Flat** (madewell.com style NN044, same $98, whose URL is titled "the-greta-ballet-flat" - the likeliest mix-up), The Greta Ballet Flat in Patent Leather (NT532), The Greta Glove Flat, The Greta Double-Strap, The Greta Lace-Up, The Greta Ballet Flat Mule ([madewell.com search results](https://www.madewell.com/p/the-greta-glove-flat/OB407/)). |
| U2 | **MARGAUX, "The James Loafer"**, Black Nappa | $375.00, nordstrom.com, 2026-09-30 | Not stated on the listing | Black Nappa ("buttery nappa leather"); flexible leather sole; sacchetto construction; handmade in Spain | **Fits 1-4.** 1: black nappa, soft. 2: an unstructured loafer on a flexible leather sole (**inference** that it is flat: no number given). 3: loafer, square toe. 4: no hardware or logo named. | https://www.nordstrom.com/s/margaux-the-james-loafer/9219895 - choose Black Nappa. Named known retailer (`nordstrom.com`); **"Sold and shipped by Margaux New York, Inc."** per the page (see "Links" below). | Other finishes of the same model (Cedar Suede, Mahogany Nappa). No other MARGAUX product named "James" found. |
| U3 | **MARGAUX, "The Roma Ballet Flat"**, Black Nappa | $395.00, nordstrom.com, 2026-09-30 - shown with the Moss Suede default; no separate price was given for Black Nappa, so **confirm it on selecting Black Nappa** | "Flat (ballet flat style)"; no number stated on the listing | Black Nappa ("buttery nappa leather"); smooth leather lining; 5 mm foam padding; handmade in Spain | **Fits 1-4.** 1: black nappa. 2: flat. 3: ballet flat, pointed toe. 4: elasticised topline only. | https://www.nordstrom.com/s/the-roma-ballet-flat/8870613 - the page opens on Moss Suede; choose **Black Nappa**. Named known retailer (`nordstrom.com`); **"Sold and shipped by Margaux New York, Inc."** per the page. | The same model in **Merlot Crinkle Patent**, Moss/Leopard/Indigo Suede and Praline Nappa - reviews on the page pool all finishes (**inference** from one product page for all colours). No other MARGAUX "Roma" found. |

**Round-2 picks, not repeated as rows.** The J.Crew New Winona (CH288) and
the ECCO Margot Bow stay where #107 left them: **"try in store first"** for
the Winona and **"try in store first, leaning swap"** for the Margot Bow
([#107 §5](104-social-proof-and-brand-verdicts.md#5-verdicts-per-pick)).
Neither is a new pick, so neither takes a row here. U1 is the swap #107
named as the next candidate for the Margot Bow, "Madewell Greta on
`madewell.com`", linked here on `nordstrom.com` instead because the
madewell.com URL for "The Greta Ballet Flat" returned the Mary Jane
version.

### $400-$695

| # | Exact model | Price as listed (retailer, date read) | Heel height as listed | Colour / material as listed | Style lines | Purchase link (rule it rests on) | Siblings to watch for |
|---|---|---|---|---|---|---|---|
| M1 | **Jamie Haller, "Penny Loafers"**, Black (Shopbop's name for The Penny Loafer) | $625.00, shopbop.com, 2026-09-30 | Not stated on the listing | Black; buffalo leather upper, leather lining, leather sole with rubber patch; round toe; penny strap; made in Italy | **Fits 1-4.** 1: black buffalo leather (grained). 2: a flat penny loafer (**inference**: no number given). 3: penny loafer. 4: penny strap only. **Not on the wishlist** - it is the flat sibling of wishlist item 2, **The Heeled Penny Loafer**, and flat is what line 2 asks for. | https://www.shopbop.com/penny-loafer-lth-bop1-jamie/vp/v=1/1590217063.htm. Named known retailer (`shopbop.com`). | **The Heeled Penny Loafer** (wishlist item 2); Shopbop's other "Penny Loafers" and "The Penny Loafers" listings, which are different leathers and colours at $595-$765 - one black one at **$765** ([Shopbop brand page](https://www.shopbop.com/jamie-haller-shoes/br/v=1/74325.htm?f=MAShoeStyle-Loafer)); Suede Penny Loafers; Croc Penny Loafers; Penny Loafer Mules. |
| M2 | **Alexandre Birman, "Clarita Ballerina Mary Jane Flat"**, Black | $625.00, nordstrom.com, 2026-09-30 | "Flat"; no number stated on the listing | Black; "leather and textile upper", leather lining and sole; softly rounded toe; bow on the strap; made in Brazil | **Bends line 3**: a Mary Jane is a ballet flat with a strap, not one of the four named silhouettes. **May bend line 1**: the upper is listed as leather *and textile*, and which part is textile is not stated. Fits 2 (flat) and 4 (a bow, the kind of detail line 4 allows; whether it is self-leather is not stated). Picked because it is the one non-wishlist $400-$695 flat found with no metal hardware and a black option. | https://www.nordstrom.com/s/alexandre-birman-clarita-ballerina-mary-jane-flat-women/9025588 - choose Black. Named known retailer (`nordstrom.com`); **sold by Nordstrom** per the page. | **Clarita** is Alexandre Birman's name for a family of bow shoes: the brand's [Clarita collection](https://alexandrebirman.com/collections/clarita) (search result, not fetched) covers stilettos, flats and block heels, including the **Clarita Flat Sandal**, **Clarita Sport Sandal** and **Clarita Block 90mm Sandals** ([Shopbop](https://www.shopbop.com/clarita-block-sandal-alexandre-birman/vp/v=1/1537914747.htm)). A review or post saying "Clarita" is a sibling until it says "ballerina" or "Mary Jane flat". |

**Fewer than three here, on purpose.** Rejected at this tier:

- **Lanvin, "The Ballerina Flat In Leather"**, black, $690.00, nordstrom.com,
  2026-09-30 - fails line 4: "Gold metal label with the Lanvin logo on the
  back". Rating 2.0 from one review. Sold by Lanvin on the page.
- **Gianvito Rossi, "Carla Ballerina"**, black on sale within $447-$845,
  nordstrom.com, 2026-09-30 - fails line 4 (buckle closure); the black
  colourway's own price was not isolated from the range.
- **SCAROSSO, "Carla Ballerinas"**, Black Calf, $390-$405 - straddles the
  tier edge and fails line 4 ("laces with metal aglets on the toe").
- **AEYDE "Tom" loafer** ($425, shopbop.com) and **AEYDE "Della"** bow
  flat ($375, shopbop.com): both fit the lines, both **sold out in every
  size** on 2026-09-30. Named so the owner can ask for either.

### Over $695

| # | Exact model | Price as listed (retailer, date read) | Heel height as listed | Colour / material as listed | Style lines | Purchase link (rule it rests on) | Siblings to watch for |
|---|---|---|---|---|---|---|---|
| O1 | **The Row, "Fay II Ballerina Flat"**, Black | $920.00, nordstrom.com, 2026-09-30 | Not stated on the listing | Black; "Leather upper, lining and sole"; "buttery napa leather"; dipped topline | **Fits 1-4.** 1: black nappa. 2: ballerina flat (**inference**: no number given). 3: ballet flat. 4: no hardware or logo named; the only detail is the dipped topline. | https://www.nordstrom.com/s/fay-ii-ballerina-flat-women/8947772. Named known retailer (`nordstrom.com`); **sold by Nordstrom** per the page. | **"Fay Wool Flat"** ($920, nordstrom.com, same name root); the original "Fay" if a review omits "II" (**inference**); **The Row "Ballet Flat"** ($820, [nordstrom.com](https://www.nordstrom.com/s/the-row-ballet-flat-women/6292175)); **"Ava"**, a Mary Jane-style flat and the one search results surface first. A post naming only "The Row ballet flats" cannot be matched to this model. |
| O2 | **Tod's, "Penny Loafer"**, Nero | $825.00, nordstrom.com, 2026-09-30 | Not stated on the listing | Nero (black); leather upper and lining; rubber-crepe sole with embossed-pebbled detailing; made in Italy | **Fits 1-4, with one caveat on 4**: the page names no logo or hardware on the upper; the pebbled sole is Tod's signature and is on the underside. 1: black leather. 2: flat loafer (**inference**: no number given). 3: penny loafer. | https://www.nordstrom.com/s/penny-loafer-women/8050088. Named known retailer (`nordstrom.com`); **sold by Nordstrom** per the page. | Tod's sells many penny loafers and **Gommino** driving moccasins, and "Tod's penny loafer" in a review usually does not name which (**inference**). Watch for Gommino, "T Timeless", and lug-sole versions. |

**Also seen and rejected at this tier:** The Row "Ballet Flat", $820,
nordstrom.com - the page opens on Milk, lists "Leather and textile upper",
and on re-fetch showed only Milk in stock at the one size displayed, so
black could not be shown to be buyable; the Fay II replaced it. Ferragamo "Varina Leather Flat",
$780, black offered only as **Nero Patent/Gold** - fails line 1 (patent) and
line 4 ("logo-embossed metal buckle"); it has the most reviews of anything
seen in the tier (82, 4.4). Khaite "Jane Ballet Flat", $840 - offered in
Sable suede only, fails line 1. Everything else on Nordstrom's black
designer-flats page at this price carried a logo, a bit, a chain or a
buckle (Gucci, Prada, Valentino, Burberry, Miu Miu, Bottega Veneta).

## Wishlist items at $400-$695

The issue allowed these here, labelled "already on your wishlist". **None is
a pick, because none could be linked.**

- **BY FAR, Prudence 45** - already on your wishlist. No named known
  retailer page carrying it was found: searches scoped to nordstrom.com,
  shopbop.com and bloomingdales.com returned only category pages, and the
  one amazon.com listing #101 cited (`B0FRB8JZ9T`) returned **HTTP 500**.
  `byfar.com` is still unconfirmed under the tightened test.
- **Jamie Haller, The Heeled Penny Loafer** - already on your wishlist.
  $695 per search summaries, but Shopbop's Jamie Haller shoe page, fetched
  2026-09-30, **does not list it**. The only pages carrying it are on
  `shop-jamiehaller.com`, which no named known retailer page read this run
  names, so it stays **unconfirmed**. M1 is its flat sibling.
- **Dear Frances, Topo Bootie** - already on your wishlist. Not searched
  this run; round 2 found it only on `dearfrances.com` and a stockist not
  on the list, and it bends line 2 (heel) anyway.

## Links: which rule each rests on

**Every pick rests on the named-known-retailer clause** of
[`link-safety.md`](../shopper/link-safety.md), exact host
`www.nordstrom.com` or `www.shopbop.com`. None rests on a brand-own domain,
so the tightened test from #101 is not exercised: no brand domain was used,
and none was confirmed.

**One thing a reviewer should weigh:** Nordstrom's pages say who sells each
item. U1, M2, O1 and O2 say "Sold by Nordstrom". **U2 and U3 say "Sold and
shipped by Margaux New York, Inc."** - the brand selling through
Nordstrom's marketplace - as did several rejected items (Lanvin, Gianvito
Rossi, SCAROSSO, Andrea Gomez). The host passes the rule either way;
the rule does not distinguish, and this document does not propose that it
should without the owner.

**Lookalikes seen: none.** No host posed as another brand's store this run.

## Recommendation

**Send all seven to the proof children, and start with U2 (MARGAUX James)
and M1 (Jamie Haller Penny Loafers).** They are the two that fit all four
lines as a loafer, which is the silhouette the wishlist leans on hardest
(items 2 and, as a flat, the reason round 2 picked the Winona), and they
bracket the question the owner asked #107: whether $375 buys what $625
does.

**Candidate nobody asked for:** MARGAUX. It is not on the wishlist, not a
round-2 pick and not in #107's roundup list, and it is the only brand here
with two all-four-line fits under $400.

**Strongest argument against, looked for:** the tiers are filled from one
retailer. Six of seven links are `nordstrom.com`, because it was the named
known retailer whose listing pages the run could read in full; the wishlist
brands' own stockists (Smallable, Farfetch, SSENSE) are off the list. So
"best under $400" here means "best on Nordstrom under $400", and a better
fit elsewhere would not have been seen. Two of the seven are also sold by
the brand through Nordstrom's marketplace, not by Nordstrom.

**What would change it:** the owner adding a stockist to the known-retailer
list (which would make BY FAR and Dear Frances linkable), a Budget line
from round 2's interview Q4 (which could empty the top tier), or an answer
to round 2's Q2 that allows a slim mid heel (which would admit the Topo
Bootie and the Heeled Penny Loafer on line 2).

## What the run could not reach

- **amazon.com** listing for BY FAR Prudence 45: HTTP 500.
- **saksfifthavenue.com** (Khaite Billy Leather Penny Loafer): HTTP 403.
- **Heel heights in millimetres** for all seven picks: no listing stated
  a number. The proof children or the owner should read it at the store.
- **zappos.com, reddit.com, TikTok, Instagram, LTK, ShopMy**: not fetched,
  by rule.
