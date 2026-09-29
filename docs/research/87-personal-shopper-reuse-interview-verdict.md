# Personal shopper: reuse map, feedback interview, prior art, and whether to build

**Decision this serves:** whether the owner builds a personal-shopper agent
for their household (US, free tier only, toddler aged 1-3), and if so on what
- this repository, a new repository on the factory, or something else - and
how small the first version is. Child B of
[#85](https://github.com/chamaya00/background-research-agents/issues/85). It
builds on [#86](86-personal-shopper-intake-and-product-search.md), which
established what inputs and product sources are reachable, and does not redo
that work.

**Status:** first pass, run 1 of 3 on
[#87](https://github.com/chamaya00/background-research-agents/issues/87),
2026-09-29. The prior-art section is filled from official pages fetched in
this run; see its own table for what could not be reached.

**Constraints, not guesses** (answered by the owner on #85, 2026-09-29): O1
US market; O2 free or free tier only, with Claude through the owner's Max-plan
OAuth token as the one paid tool; O3 one or more children aged 1-3. The
issue's candidate list for prior art and its three-way "clone / new repo on
the factory / not this system" framing are **guesses** in research-craft's
sense: the framing is answered below, but the answer turns out to be a fourth
shape that sits between two of them.

## Headline

1. **Build, small, and not on this system.** The first version is a
   **private repository worked only from local Claude Code sessions** - the
   loop's rules copied in as documents, no factory, no Actions. Photos never
   leave the owner's machine except to Claude, which is where #86 said they
   belong, and the profile - which will hold a child's sizes and a household's
   purchases - is not published. This repository is public, so "clone this
   repo and extend it" would publish exactly that.
2. **What carries over is the loop's discipline, not its machinery.** The
   three-axis split, "a reaction is not applied until it is a committed line",
   and "show the diff before committing" all carry over as-is. The Actions
   runner, the pull-request-as-delivery model, the factory's roles and
   `src/fetch.ts` do not fit the first version, each for a reason in a cited
   file below.
3. **#86's open question is settled: "already owned" re-ranks and annotates,
   it never gates.** Only an explicit statement that a Want is closed
   removes anything, and that is a Want line the person sees retired in a
   diff. "I already own a lot of black" and "this brand pills" are walked
   through in §4 and neither removes a category.
4. **Sizes get their own section with an expiry.** A toddler size line gates
   selection for 90 days from its date and then stops gating until it is
   re-confirmed; the next round asks.
5. **The strongest evidence against:** a toddler's clothes are bought mostly
   at the retailers #86 found unreachable or forbidden (Target, Amazon,
   Walmart, Carter's, Old Navy), and a 1-3-year-old outgrows a size every few
   months, so a profile that learns slowly may never catch up with the child.
   The first version is designed to find that out in a month.

## 1. Reuse map

Each element of this repository and the factory, marked **as-is**, **adapt**
or **does not fit** for the first version, with the file the reason rests on.

| Element | Verdict | Reason, tied to the file |
|---|---|---|
| **The read-react-remember loop** ([`docs/reader/loop.md`](../reader/loop.md)) | **Adapt** | Steps 4-7 carry over as-is: one sentence back, rendered as a diff, shown before committing, the reaction's own words in the commit (loop.md steps 4-7). Step 1's injection point does not: it exists because "a research run reads the default branch and the issue it was queued on, so the issue body is the injection point that survives a factory release" (step 1). With no factory and no issue-queued runs, the session reads the profile file directly and that reason disappears. Step 3's "read back in full" becomes "three options per Want, shown in the session", not a document. |
| **The profile and its sections** ([`docs/reader/profile.md`](../reader/profile.md)) | **Adapt** | The axis table (profile.md "The three axes, and why they stay separate") and the Retired section carry over as-is. The sections do not: Interests/Window are about subjects and dates, and a shopper needs Wants, Sizes, Brand notes, Owned, Budget and Safety (§2 below). The file is **public** here ("Every research run reads this file"; the repository is public, per #86 §5), so the shopper's profile cannot live beside it. |
| **Knowledge-changes-wording-only** ([`docs/research/3-state-and-source-schema.md`](3-state-and-source-schema.md), "Why three files and not one") | **As-is** | "Knowledge never removes an item from consideration and never changes its rank". The shopper has the same trap in a new form - "I already own a lot of X" reads as knowledge and must not become an exclusion - and the same answer, plus the preference-ranks-rather-than-filters rule that document gives `preference.yaml` ("preference ranks the candidate pool that interest has already filtered rather than removing items from it outright"). |
| **The interview pass** ([`docs/writer/writer.md`](../writer/writer.md) step 3) | **Adapt** | The cap ("ask the author at most five questions, aimed at what only they can supply") and the three-pass shape carry over. The questions do not: the writer's are about experience; the shopper's are about fit, size and wear, and they are **timed to the garment** (a fit question after it is worn, a durability question after several washes) rather than asked once per piece (§3). |
| **Auto breadth** ([`docs/reader/auto-breadth.md`](../reader/auto-breadth.md), [ADR 0006](../decisions/0006-auto-breadth-mode.md), [ADR 0007](../decisions/0007-auto-breadth-runs-in-actions.md)) | **Does not fit** the first version | Its unit is "several breadth-to-depth paths to read at once" (auto-breadth.md, opening), for a person in learning mode. A shopping round is the opposite shape: three concrete options for one Want. Its one plausible later use - "which brands on Shopify make 2T rain gear" as brand discovery - is a research question, not a round. Its **mechanics** are the reusable part if the build ever moves to Actions: a path check that refuses anything outside an allowed folder, and "the agent never holds a write credential" (ADR 0007, Decision). |
| **The Actions runner** ([`.github/workflows/agent-run.yml`](../../.github/workflows/agent-run.yml), [`auto-breadth.yml`](../../.github/workflows/auto-breadth.yml)) | **Does not fit** the first version; **adapt** later for one job | Three reasons. (a) The images: #86 §5, "no option lets an Actions run of this public repository read family photos without the risk of their descriptions becoming public". (b) Egress: #86 found Amazon 503, Walmart CAPTCHA and Nordstrom empty from the runner, and inferred datacenter-IP blocking (#86 "How reachability was tested"). (c) Weight: agent-run is "capped in turns and minutes" at 150 turns and 30 minutes (agent-run.yml lines 3-4, 75-76) and reached through issue labels - built for a unit of work, not a two-minute shopping check. The one job that does fit a runner later is an **unattended recall watch** over owned kids' items (CPSC API, no key, #86 §6), which needs no photo and no retailer. |
| **PR-as-delivery** (loop.md step 2; `.claude/skills/house-rules/SKILL.md`, "Before merge", "Who merges") | **Adapt**: commits yes, pull requests no | "Commit the diff as one pull request against `profile.md`. One per brief, so the file's git history is the reaction log" (loop.md step 6). The reaction log is worth keeping as-is - `git log -p` answering "why am I not seeing this brand" is exactly the audit a shopper needs. The pull request around it is not: its job here is review by a person who is not the reader, and in a one-household tool the reader, the reviewer and the merger are the same person in the same minute. House-rules' "Tests before merge. Every acceptance criterion has a test" has nothing to bite on in a profile edit. A direct commit, shown as a diff first, keeps the log without the ceremony. |
| **The fetcher** ([`src/fetch.ts`](../../src/fetch.ts)) | **Does not fit** as a runtime; **as-is** as a pattern for one feed | It parses RSS 2.0 into `FetchedItem`s and is called only from `src/brief.ts` (line 50) - no workflow in `.github/workflows/` runs it; ADR 0003 moved research into agent runs. For the shopper: CPSC's recall RSS is RSS (#86 §6), so it would parse as-is (**inferred**, not run). Pinterest board RSS would **not** carry over as-is: `parseRssItems` strips every tag from `description` (`.replace(/<[^>]+>/g, " ")`, fetch.ts line 91), and the pin's image is an `<img>` in that description (#86 §1, Pinterest), so the one thing the shopper wants from a pin is deleted. Shopify `products.json` and the Shop catalog are JSON, which fetch.ts rejects ("unsupported source kind", line 137). In a session-only build the model reads those directly with its fetch tool and no fetcher is needed. |
| **The curated source list** ([`docs/reader/sources.md`](../reader/sources.md), [ADR 0004](../decisions/0004-curated-source-list-lives-beside-the-profile.md)) | **Adapt** | ADR 0004 names the list's real job as "**reachability**: which hosts answer a fetch, which return 403, and when that was last observed". That is exactly what #86's refusal table is, and a shopper needs it per retailer: "Primary: `products.json` 200, sizes and `available` per variant, 2026-09-29". Kept as a separate file from the profile for ADR 0004's reason ("who writes it"). |
| **The factory** (`.claude/agents/`, `.claude/skills/`, `.claude/agent-factory.json`) | **Does not fit** | Its roles are "orchestrator, researcher, analyst, designer, engineer" (`.claude/agent-factory.json`, `roles`) and its unit is an objective split into "1-5 child issues ... each with acceptance criteria and one role label" (`CLAUDE.md`, "How work moves"). None of the five roles is a shopper, and adding one locally is reverted: "`/update-agents` deletes a role there that the factory release does not carry" (writer.md, "Why a mode and not a role"). The factory is the right tool for **building** the shopper (§6), not for **being** it. **Assumption:** whether the factory's reusable workflow can be called from a private repository was not read in any vendored file; everything known about the factory here comes from `.claude/` and the workflow pin `chamaya00/agent-factory/...@v1.39.0` (agent-run.yml line 61). |

### Which of the three

**Recommended: none of the three as worded - a new private repository, run
from local sessions, with this repository's loop rules copied in as
documents and no factory installed.** Of the issue's three options it is
closest to "not this system at all", because none of the runtime carries
over, and it should be read that way. Why each named option loses:

- **"Clone this repo and extend it."** Loses on privacy first. This
  repository is public, and a shopper's profile carries a child's size by
  date, a household's brands and what it bought. Cloning into a private
  repository fixes that but carries four research modes, a dormant
  TypeScript pipeline and 400 lines of reader profile that have nothing to
  do with shopping, all of which a factory release would keep trying to
  update.
- **"New repo on the factory."** Loses on fit and on egress. The factory's
  value is splitting work across roles and gating merges; a shopping round is
  one person, one session, three options, one sentence back. And its runs
  execute in Actions, which #86 found blocked by the big-box retailers and
  which cannot hold the photos without making them part of a log. If a later
  version needs an unattended job (the recall watch), a scheduled workflow in
  the same private repository is a smaller addition than the factory.
- **Why not simply "use ChatGPT"?** That is the real competitor, and §5
  takes it seriously: it is the discarded option's strongest form.

## 2. The profile, for a shopper

Built on #86 §3, with the one question #86 left open (Already owned) decided
and two sections added. The three columns are the profile's own axis test
(profile.md, "The three axes"): **gates** means an item can be excluded;
**re-ranks** means an item's position moves but it stays eligible; **wording**
means only what is said about it changes.

| Section | Gates? | Re-ranks? | Wording? | Written by |
|---|---|---|---|---|
| **Wants** - open needs, per person | **Yes**: a round searches only open Wants | No | No | Person, in a reaction |
| **Sizes** - per person, dated, with expiry | **Yes** while current (see rule below) | No | Yes, after expiry | Interview Q1, order history |
| **Budget** - per category | **Yes** | No | No | Person |
| **Safety** - per child, derived from age | **Yes**, hard | No | Yes (warnings shown) | Derived from birth month; never from a reaction |
| **Not interested** - explicit exclusions | **Yes** | No | No | Only a reaction that says "stop showing me", translated and shown |
| **Style** - silhouettes, colours, details liked | No | **Yes** | No | Photos, pins, reactions |
| **Brand notes** - quality, fit, durability per brand | No | **Yes**, within the category the note names | **Yes**: shown beside the item | Interview Q2-Q4 |
| **Owned** - what the household already has | No | **Yes**, near-duplicates rank lower | **Yes**: "you have ..." | Interview Q5, order history |
| **Knowledge** | No | No | **Yes** | As in profile.md |
| **Format** | No | No | **Yes** | As in profile.md |

Two departures from #86 §3, both deliberate:

- **Style re-ranks, it does not filter.** #86 had it as "ranks and filters".
  3-state's rule for `preference.yaml` is that preference "ranks the
  candidate pool that interest has already filtered rather than removing
  items from it outright", and taste drawn from a dozen photos is exactly the
  kind of state that should rank rather than exclude. Exclusion lives only in
  Not interested, which a person has to say.
- **Owned never gates.** #86 flagged it as "the one line where 'already
  known' genuinely should change what is fetched". It is decided the other
  way: what closes a need is the **Want** being retired ("we have enough rain
  boots" retires `child-1-rain-boots`), which is explicit, shown in a diff,
  and scoped to one Want. "We own a lot of X" only ever moves X down and says
  so.

**The size rule.** Sizes are a different kind of state from taste: they are
facts with a shelf life, and they only move one way. Each line carries a date
and a source.

- A size line **gates** for **90 days** from its date. A result with no
  available variant in that size is dropped.
- For outerwear and shoes, the round also searches **one size up**
  (buying ahead is normal for a growing toddler), and says which it is.
- After 90 days the line **stops gating** and becomes wording ("last known
  2T, 2026-10-01 - check"), the round shows the current and next size, and
  interview Q1 asks at the next round. A line is never silently extended.
- A size only moves down if the person says so (a line can be wrong; a child
  does not shrink). **Inference:** 90 days is a guess at a 1-3-year-old's
  pace between toddler sizes; no growth-chart source was read in this run,
  so the number is the owner's to change.

Example lines, written the way profile.md writes them:

- Wants: `child-1-rain-gear` · open · for child 1 · "rain jacket and boots
  for daycare, before November". *Reaction, round 1, 2026-10-01.*
- Sizes: `Child 1 · tops 2T, outerwear 3T · as of 2026-10-01 · gates until
  2026-12-30`. *Kept orders, round 1.*
- Safety: `Child 1 is under 3: exclude toys with small parts (16 CFR 1501);
  check every toy and gear item against CPSC recalls.` *Derived from birth
  month; not a reaction.*

## 3. The post-purchase interview

The agent only recommends, so the interview starts from what the person
**says** they bought (or an order confirmation they paste). It runs at the
start of a round, before the new recommendations, so that answers land in
the profile before they are needed. **At most five questions per round**,
matching writer.md step 3; when more is owed than five, the order below is
the priority, because a stale size gates and a brand note only ranks.

| # | Question | Asked when | Answer type | Becomes a line in | Gates / re-ranks / wording | Example line |
|---|---|---|---|---|---|---|
| 1 | "Which of last round's picks did you buy, and in which size? Did you keep it?" | Next round after a pick, and whenever a Sizes line has passed its 90 days | **Per-child size** | Sizes | **Gates** (for 90 days) | `Child 1 · outerwear 3T · kept Primary rain jacket 3T · as of 2026-10-08` |
| 2 | "How does it fit - true to size, small, big, and where?" | At least 7 days after it arrived (it has been worn) | **Fit note** | Brand notes (per brand × category); a size change goes to Q1's line instead | **Re-ranks** (nudges which size to suggest) and **wording** ("runs small - consider 4T") | `Primary · outerwear · runs about half a size small in the sleeves · child 1, 2026-10-15` |
| 3 | "After a few washes, how has it held up - pilling, shrinking, fading, seams?" | At least 21 days after it arrived | **Wash/fabric durability** | Brand notes, naming the fabric | **Re-ranks** within that brand × fabric; **wording** beside it | `Brand X · cotton-poly knit leggings · pilled after about 4 washes · child 1, 2026-10-29` |
| 4 | "Would you buy from this brand again?" | With Q3, once per brand per quarter | **Per-brand quality** | Brand notes | **Re-ranks** that brand across its categories; **gates only if** the answer is "never again" **and** the person confirms the Not-interested diff | `Brand Y · overall · "good value, would buy again" · 2026-10-29` |
| 5 | "Anything you now have plenty of?" | Once per round, last | **"Already own a lot of X"** | Owned | **Re-ranks** near-duplicates down; **wording** ("you have several") | `Owner · black basics (tops, trousers) · plenty · 2026-10-08` |

What is **not** asked: anything the model can read off a product page
(fibre, price) or off an image (colour family, silhouette - #86 §2), and
nothing about a child beyond size and fit. **What each answer is not allowed
to become** is the design, not a detail: none of Q2-Q5 can write a Not
interested or retire a Want without a separate, explicit sentence from the
person and a diff they said yes to (loop.md step 5).

## 4. Two sentences, walked through

### "I already own a lot of black"

1. **Classified** as answer type 5 (Owned). Not a Style line (it says nothing
   about liking black) and not Not interested (it does not say "stop").
2. **Diff shown before committing** (loop.md step 5):
   ```diff
    ## Owned
   +- Owner · black (tops, trousers, knitwear) · plenty · 2026-10-08
   +  *"I already own a lot of black", round 2.*
   ```
   Nothing is added under Not interested and no Want is retired. The driver
   says so in the same message: "This moves black items down within each
   Want and flags them. It does not stop black from being shown. Say 'no
   more black' if you want it excluded."
3. **Next round, Want `owner-fall-sweater`:** the search runs exactly as
   before - same query, same size, same budget. Say it returns eight
   candidates, three of them black. Style scores them; Owned then moves each
   black one below any non-black candidate with an equal or close Style
   score. If the best candidate by far is black, it still appears, marked
   "you have plenty of black; this one is here because ...". **Sweaters are
   still searched, black is still eligible, and nothing is removed.**

### "This brand pills"

1. **Classified** as answer types 3 and 4 (durability, per brand) and scoped
   to what was actually worn: the brand and the fabric of the item it was
   said about. The driver asks one clarifying question only if the item is
   ambiguous (loop.md step 4, "structured per-item questions are the fallback
   for a sentence that is genuinely ambiguous").
2. **Diff:**
   ```diff
    ## Brand notes
   +- Brand X · cotton-poly knit (leggings) · pilled after about 4 washes ·
   +  child 1, bought 2026-09-20, reported 2026-10-29
   +  *"this brand pills", round 3.*
   ```
   Not interested is untouched. The driver says: "Brand X knits rank lower
   and carry this note. Brand X's other fabrics and every other brand's
   knits are unaffected. Say 'stop showing me Brand X' to exclude the
   brand."
3. **Next round, Want `child-1-leggings`:** leggings are searched as before.
   Brand X knit leggings still appear if they are available in 2T, ranked
   below an otherwise-equal alternative, with "you said this brand's knits
   pilled after about 4 washes". A Brand X **woven** rain jacket for
   `child-1-rain-gear` is ranked with no penalty. **Knits are still
   searched, Brand X is still eligible, and nothing is removed.**

The rule both walk-throughs show: a sentence about a property of things the
person has becomes a **ranking weight and a caption**, never a filter.
Filters are written only by sentences that ask to stop seeing something, and
only after the diff.

## 5. Prior art

*In progress on this branch: official pages are being fetched. This section
is filled in the next commit.*

## 6. Recommendation

**Build**, as a one-month test, not a product.

**The smallest first version:**

- **Categories:** two. Toddler (1-3) outerwear and shoes for child 1, and one
  adult category the owner names. Toys are **out** of the first version:
  they are where the safety rules bite hardest (16 CFR 1501's small-parts
  ban, #86 §6) and where no retail feed carries an age grade (#86, "Searched
  and not found"). The recall check still runs on anything the person says
  they bought for a child, including a toy.
- **Inputs:** pasted links and screenshots, public Pinterest board RSS, and
  the person's kept orders (Amazon data request or pasted confirmations), per
  #86's recommendation. No TikTok beyond pasted links.
- **Product source:** the Shopify Shop catalog for breadth and per-store
  `products.json` for exact size availability (#86 §4), plus plain web
  search for brand discovery. **Upgrade path, not the first version:**
  SerpApi (free 250/month, but no size availability - #86 §4) or any paid
  shopping API. Target, Amazon and Walmart are **links the person clicks**,
  never fetches. **Caveat carried from #86:** the Shop catalog search was
  never run, and "personal use only" covering the owner's own agent is
  assumed; the first session's first act is one text query and one image
  query (of the owner's own clothing, never a child).
- **Where private images live:** a folder on the owner's machine outside any
  git working tree (#86 §5), read by the local session. The private
  repository holds only approved profile lines, with children named "child
  1", "child 2".
- **Runtime:** local Claude Code sessions on the owner's Max plan (O2). A
  `CLAUDE.md` carrying the three rules from this repository's "Reading a
  brief" section, adapted, and one command for a round.
- **Safety:** every kids' item checked against the CPSC recall API by product
  name before it is shown; Safety lines derived from age, never written by a
  reaction; age grading read from the listing text and shown, since no feed
  carries it.
- **Never:** add-to-cart, checkout, or holding a retailer login. Shopify's
  own agent file says "Checkout requires human approval" (#86 §4); the
  shopper does not reach that step at all.

**The result that would prove it wrong:** after four weekly rounds, **fewer
than 3 of the recommended items bought and kept**, or **more than half of
the kids' Wants closed by buying at a retailer the agent could not search**
(Target, Amazon, Walmart, Carter's, Old Navy). The first says the taste
side does not work; the second says the product side covers the wrong
market, which is #86's own strongest argument against, now measured on the
owner's actual spending.

**The strongest evidence against, looked for rather than imagined:**

- #86's: "the agent could be excellent at a slice of the market the person
  rarely buys from". Nothing found in this run weakens it.
- A toddler's size changes faster than a weekly-to-monthly loop gathers
  evidence, so the kids' half of the profile is always partly stale; the 90-
  day expiry makes that visible rather than fixing it.
- The general assistants in §5 already do "describe what you want, get
  options with prices and links" for free, and remember across chats. What a
  self-built version adds is narrower than it first looks: a profile the
  owner can read and edit line by line with a reason on each, the
  gate/rank/wording split, and a recall check. Whether that is worth a
  month of rounds is exactly what the test measures.

**What would flip it:** if the owner's first round of kept orders shows most
kids' spending at big-box retailers, stop before round 2 - the product side
cannot be fixed within O2. If instead a general assistant is tried side by
side for the same Want and returns in-size, in-budget options as often,
the self-built version is only worth it for the profile, and that is a
smaller build (a profile file and a prompt) than this one.

**A product for other users** is a later question and is not answered here:
it changes the privacy design (other people's children), the terms question
(Shop's "personal use only") and the cost constraint all at once.

## 7. For a later build objective

**Roles it would need**, from this repository's five
(`.claude/agent-factory.json`, `roles`):

- **engineer** - the round command, the `products.json` size check, the CPSC
  check, and the private repository's `CLAUDE.md`.
- **researcher** - two open questions from #86 that decide the product side
  and need no build: the Shop terms page (`help.shop.app/.../personal-agents`)
  and which of the owner's actual brands are on Shopify, from their order
  history.
- **analyst** - defines the falsification test above precisely: what counts
  as "kept", where the four rounds' outcomes are recorded, and how the
  big-box share is counted.
- **designer** - **skipped**: the output is three options in a session, and
  its shape is a Format line the owner tunes by reaction.
- **orchestrator** - only if the build runs on the factory; the runtime does
  not.

**Unverified claims, in their authors' own words.**

From #86:

- "**Assumed, and load-bearing:** that the Shop catalog's 'personal use only'
  covers an agent the person runs for themselves. That the person's favoured
  brands are substantially on Shopify. Neither was checked, and the product
  half of any plan rests on both."
- "**No search was run** (it needs a global npm install ...)" - of the Shop
  catalog.
- "**The MCP call itself was not made** (it needs a POST, which WebFetch
  cannot send)".
- "Not tested; one image is an existence check, not a rate" - of image taste
  extraction across many images.
- "Children's sizes from a photo of a child | Not tested, deliberately ... |
  Expected no: age can be guessed, size cannot | **Assumed**".
- "Whether reading a feed Pinterest serves counts as permitted is
  **unestablished**."
- "An agent calling it on URLs the person supplied is inferred to be within
  its intended use, not a scrape, but no TikTok page says so." (TikTok oEmbed)
- "**Inference:** WebFetch's request leaves from the runner itself."
- "Whether listing search returns size variations was **not established**"
  (Etsy).

From this document:

- "**Inference:** 90 days is a guess at a 1-3-year-old's pace between toddler
  sizes; no growth-chart source was read in this run".
- "CPSC's recall RSS is RSS (#86 §6), so it would parse as-is
  (**inferred**, not run)" - through `src/fetch.ts`.
- "**Assumption:** whether the factory's reusable workflow can be called
  from a private repository was not read in any vendored file".
- The falsification thresholds (3 kept items, half of kids' Wants) are the
  author's judgment, not derived from any source.
