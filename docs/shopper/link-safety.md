# Link safety

Part of the shopping companion ([`companion.md`](companion.md)). Every pick
carries one link, and that link is the thing the owner will click and
possibly pay through.

## Why this exists

The interactive dry run on
[#95](https://github.com/chamaya00/background-research-agents/issues/95)
(2026-09-30) searched for Rothy's shoes and got **scam mirror storefronts
serving fake "Rothy's" product pages** in the results, on
**`unofficed.com`** and **`elearn.nptel.ac.in`**. Neither is Rothy's, and
the second is a subdomain of an education site with no connection to the
brand, which is how these look plausible in a result list: the page title and
images are the brand's; only the domain is wrong. Search results are not a
source of trustworthy links.

## The rule

**A link is shown only if its host is the brand's own domain or a named
known retailer. Never a lookalike.**

- **The brand's own domain** - the domain the brand itself uses, e.g.
  `rothys.com` for Rothy's. Established by the brand's own pages linking to
  it, or by the retailer URL carried in a `go.shopmy.us` redirect the owner
  supplied (#92 §3), not by a search result's title.
- **A named known retailer** - one of these, and only these, until the list
  is changed by the owner:
  `amazon.com`, `walmart.com`, `target.com`, `nordstrom.com`,
  `nordstromrack.com`, `zappos.com`, `dsw.com`, `macys.com`,
  `bloomingdales.com`, `shopbop.com`, `neimanmarcus.com`, `saksfifthavenue.com`,
  `rei.com`, `anthropologie.com`, `madewell.com`, `jcrew.com`, `loft.com`,
  `sephora.com`. **Every store counts equally** (owner decision on #95):
  Amazon, Walmart and Target are in, as links only.
- **The affiliate hop.** An owner-supplied `go.shopmy.us/...` link, and the
  affiliate host its first redirect names (`*.sjv.io`, `goto.walmart.com`,
  `click.linksynergy.com`, #92 §3), may be shown as the **affiliate link**
  only when the destination it carries (`u=`, `murl=`, or the Amazon URL
  itself) passes this rule. The clean destination URL is shown beside it.
- **Exact host match, subdomains of that host only.** `www.rothys.com`
  passes; `rothys.com.shop-sale.net`, `rothys-outlet.com`, `rothys.co`,
  `elearn.nptel.ac.in/rothys` and `unofficed.com/rothys` do not.
- **Never shown:** URL shorteners other than `go.shopmy.us`, marketplace
  resellers on a domain not listed above, any host found only through
  search whose connection to the brand cannot be shown from the brand's own
  site.

## When the run cannot verify a domain

It does not show the link. Specifically:

1. It tries once to confirm the domain from the brand's own side: the
   domain in an owner-supplied redirect, or the brand's site linking to
   itself. It does not reason from a page's look, title, logo or price.
2. If that fails, the pick is **shown without a link**, with the words
   "link not shown - could not confirm `<host>` is <brand>'s own domain", or
   the pick is dropped in favour of one that verifies.
3. The unverified host is **named** in the round's "What the run could not
   do" section, so the next round and the owner can see it. A host that is
   positively a lookalike (unrelated owner, copied content) is named as
   such.

A pick with no link is better than a pick with a wrong one. A round that
ends with fewer than three picks because of this rule has worked.

## Lookalikes seen

| Host | Posed as | Seen | Source |
|---|---|---|---|
| `unofficed.com` | Rothy's product pages | 2026-09-30 | #95, interactive dry run |
| `elearn.nptel.ac.in` | Rothy's product pages | 2026-09-30 | #95, interactive dry run |

A round that meets a new one adds a row in its own pull request.
