# Freelance gaps, ranked by the owner's dollars per owner-hour, and one first trial

**Issue:** #78 (child of #76). **Written:** 2026-09-26 by a researcher run, not
a session. **Built on:**
[`docs/research/77-freelance-job-shortlist-owner-minutes.md`](77-freelance-job-shortlist-owner-minutes.md)
as merged in #79. Section references below ("#77 §4") are to that file's
numbered shortlist entries and named sections.

**The decision this serves:** which one job type the owner should try first, on
which platform and at what price, judged on the owner's dollars per owner-hour -
and which gap in this repository or the factory has to close before it can run.

**Status: complete.** This is synthesis over #77, not a second research pass.
**No URL was fetched by this run** - no web search, no web fetch, no request to
any host, and none to any freelancer.com host or API. Every posting, rate,
platform rule and Freelancer.com fact below is #77's and is cited to its
section. The only new material here is arithmetic on #77's figures, the
ordering that follows from it, and the reasoning around the trial.

---

## What is verified, inferred and assumed here

- **Verified (by #77, not re-checked):** the postings, their dates and prices,
  the rate-page medians, the platform rules. #77 graded each one; its grades
  carry over unchanged.
- **Inferred - and this is the ranking key itself:** every owner-time figure.
  #77's words: "All minutes are inferences, reasoned from what the posting asks
  for and from each system's mechanic. None is measured, and none is a platform
  figure." **Every $/owner-hour figure below is therefore derived from inferred
  minutes, and none is measured.**
- **Assumed:** everything about what the external agent factory can do. #77 §4:
  "The factory cannot be read from here." Every gap and trial step that touches
  the factory is labelled **ASSUMPTION** below.

## Guesses versus constraints in the issue

- **Constraints, kept:** the key is $/owner-hour from #77's numbers; no
  Freelancer.com reads; no auto-bidding and no feed scraping; client voice is a
  gap; the factory is unreadable.
- **A guess worth naming:** the issue's wording expects the trial to be a
  *client* job. One candidate below earns nothing at all and is still the
  first thing worth doing, because it is the cheapest observation that can
  knock the top-ranked gap out. It is carried as a candidate in its own right.
- **A guess #77 already overturned:** that the recurring brief-plus-posts
  retainer is the target. #77's hypothesis table rejects it as evidenced, so it
  is not a candidate here.

---

## Step 1: $/owner-hour per job type, re-derived from #77

**Method.** $/owner-hour = price ÷ #77's owner hours. The low end divides the
lowest price by the most hours, the high end the highest price by the fewest
hours. Where #77 gives a rate page rather than a posting price, the rate is
applied to the hours #77 says are billed. Platform fees and Upwork Connects are
**not** netted out, matching how #77 computed its own figures ("At $300 that is
roughly $65-130/h"); netting them would take up to 15% off every Upwork figure
alike (#77 [Platform comparison](77-freelance-job-shortlist-owner-minutes.md#platform-comparison))
and does not change the order below. Rupee conversions use #77's own ₹87/$.
*All figures derived from inferred minutes.*

| # | Type | #77 price used | #77 owner time | **$/owner-hour (derived)** | Other #77 prices, for context | Dated postings (#77) |
|---|---|---|---|---|---|---|
| 1 | Research report | $300 fixed (Upwork, 2026-09-16) - the end #77 calls the only viable one | 2¼-4½ h | **$67-133** (300÷4.5, 300÷2.25) | $5 fixed (two of three dated): $1-2 before Connects. Freelancer $250-750: $56-333, seen once. | 3+ |
| 2 | LinkedIn ghostwriting | Upwork ghostwriter rate page, median $32/h, range $20-45 - assuming, as #77 does, "the client pays for the hours" | 7-15 h a month | **$20-45** (median $32) | No posting price visible. Freelancer ₹600-1,500 profile makeover is a different job. | 3+ (B-) |
| 3 | Newsletter / digest | $15-25/h (Freelancer, 2026-09-23), billed per owner hour | 1¼-2¼ h per issue | **$15-25** | ₹1,250-2,500/h posting: $14-29. | **2 - thin** |
| 4 | Analytics engineering (dbt) | Upwork data-analyst rate page, median $30/h × #77's ~20 h billed = $600 | 3½-9 h per ~20 h task | **$67-171** (600÷9, 600÷3.5) | Full rate range $20-50/h ($400-1,000): $44-286. Freelancer ₹12,500-37,500 fixed ($144-431): $16-123. | **1 - thin** |
| 5 | Small automation builds | $30-250 fixed (Freelancer, 2026-09-23) | 2¼-5 h | **$6-111** (30÷5, 250÷2.25) | 302 bids averaging $159: $32-71. €8-30 posting: under $18. | **2 - thin** |

**Rank rule.** Types are ordered by the midpoint of the bold range: type 4
≈ $119, type 1 ≈ $100, type 5 ≈ $58, type 2 ≈ $32, type 3 ≈ $20. Type 4's
range also contains type 1's (same floor, higher ceiling), so the order of the
top two does not depend on choosing midpoints.

**One place this disagrees with #77's wording.** #77 calls type 5 "Break-even
at best", and the derived ceiling is $111/h. The two agree once the bid count is
read in: the $250 top is one client's budget ceiling with 302 bids against it,
and #77's own figure for what bidders actually offer, $159 average, gives
$32-71. The rank uses the posting range as the rule says; the win odds are not
in the key, and are a reason type 5 is not a trial candidate below.

---

## Step 2: the gaps, each tied to #77's "where it most likely breaks" note

Each gap names the types it blocks and the #77 section that is its evidence.
None is a new finding; each restates a break #77 already recorded.

| Gap | What is missing | Blocks | Evidence (#77 section) | Factory? |
|---|---|---|---|---|
| **G-factory** | The factory's engineer role working in a dbt project it did not write, with the warehouse credentials `dbt build` needs and a pull request in the client's own git host - and the owner able to review SQL against a schema they did not design. | 4 (and 5, on the capability half) | #77 §4, "Where it most likely breaks: the first run, on access"; #77 [Assumptions](77-freelance-job-shortlist-owner-minutes.md#assumptions-the-shortlist-rests-on) 1 | **ASSUMPTION** - the factory cannot be read from here |
| **G-profile** | Per-client state for research runs. Every run reads the owner's single `profile.md` (hard-coded at `auto-breadth.yml:252`), so a client's subject is filtered through the owner's Interests, 90-day window and "no recomputing figures". | 1, 3 | #77 §1, "Where it most likely breaks: the profile step"; #77 §3, "step 1 (form the objective)" | no |
| **G-deliverable** | A client-shaped deliverable. Research ends as markdown in a pull request; postings ask for "a competitor comparison in Excel/Google Sheets" (type 1) and for email "written, designed, and scheduled" (type 3). | 1, 3 | #77 §1, "A second break is the output format"; #77 §3, "and the delivery surface" | no |
| **G-not-a-repo** | A target that is not a repository. Automation postings want n8n or Make.com workflows in the client's accounts; a pull request through CI has nowhere to land. | 5 | #77 §5, "Where it most likely breaks: the target is not a repository" | **ASSUMPTION** - it is the factory's engineer role that would have to build it |
| **G-voice** | Client voice. `style.md` is single-author with one hard-coded path, and the interview pass asks *the author* about their own work. | 2 | #77 §2, "Where it most likely breaks: pass 2, the interview, and `style.md`" | no |
| **G-no-fetch** | The writer mode may not fetch, so a client whose subject has no research here gets no first pass. | 2 | #77 §2, same note ("The mode also may not fetch anything") | no |
| **G-client-loop** | A second, owner-driven loop for a client: step 4's "one sentence back" is "the part a client is least likely to do", and turning it into a diff is a reader's job. | 3 | #77 §3, same note as G-profile | no |

---

## Step 3: the ranked gap list

Ordered by the $/owner-hour of the type each gap unblocks. Where a gap unblocks
more than one type, the **setting type** is the one with the higher figure, and
it alone sets the rank. The count of types is a secondary column and was used
only to break ties; it moved nothing above a gap with a higher figure. *All
ranges derived from inferred minutes.*

| Rank | Gap | Setting type | **$/owner-hour** (from) | Types unblocked (secondary) | Thin evidence under the rank |
|---|---|---|---|---|---|
| 1 | **G-factory** *(ASSUMPTION)* | 4 | **$67-171** ($600 ÷ 3½-9 h) | 2 (4, 5) | One dated dbt posting; price is the data-*analyst* rate page, not a dbt price; the factory capability is assumed. |
| 2 | **G-profile** | 1 (type 3 is $15-25) | **$67-133** ($300 ÷ 2¼-4½ h) | 2 (1, 3) | $300 is one of three dated Upwork postings; the other two are $5. |
| 3 | **G-deliverable** | 1 (type 3 is $15-25) | **$67-133** ($300 ÷ 2¼-4½ h) | 2 (1, 3) | As rank 2. |
| 4 | **G-not-a-repo** *(ASSUMPTION)* | 5 | **$6-111** ($30-250 ÷ 2¼-5 h) | 1 | Two dated postings; 302 bids on one. |
| 5 | **G-voice** | 2 | **$20-45** (rate page $20-45/h, billed per owner hour) | 1 | No posting price visible for ghostwriting. |
| 6 | **G-no-fetch** | 2 | **$20-45** (as rank 5) | 1 | As rank 5. |
| 7 | **G-client-loop** | 3 | **$15-25** ($15-25/h, billed per owner hour) | 1 | Two dated postings. |

**Ties, and how they were broken.** Ranks 2 and 3 tie on the key and on the
secondary count (two types each). They are ordered as #77 orders them: §1 names
the profile step as where type 1 "most likely breaks" and the format as "a
second break". Ranks 5 and 6 tie the same way and follow #77 §2's order.

**What the list means in practice.** Gap 1 sits at the top on a range that
rests on one dated posting and an assumption; gaps 2 and 3 sit just below it on
firmer demand evidence. The distance between them is small (midpoints about
$119 and $100) and every condition in the next section can close it. That
closeness is the main reason the trial below starts with a test, not a bid.

**A consequence #77 did not draw.** Closing G-profile for `/auto-breadth` means
changing the path the workflow hard-codes at `auto-breadth.yml:252`, a file
under `.github/workflows/` that no agent may edit (house rules). So the type-1
route cannot start until a person makes a workflow change, or runs the
exploration in a session with a client-scoped constraint in place of the
profile - which is itself a build nobody has specified. *Inference, from #77 §1's
citation and the house rules.* G-factory needs nothing built in this
repository to be tested.

---

## Step 4: the first-trial candidates

| Candidate | Type · platform · price (all #77) | $/owner-hour (derived) | What it needs first | What it rules out later |
|---|---|---|---|---|
| **A. Sample-dbt factory test alone** | None - no client, no platform, no price | $0 by construction | A factory engineer run against a public sample dbt project | Nothing; it spends owner hours for information only |
| **B. Type 4 via the test** | Analytics engineering · Upwork · $30/h (rate-page median) for ~20 h, ≈ $600 | $67-171 | Step 1 is A | Type 1 is deferred, not dropped |
| **C. Type 1** | Research report · Upwork · $300 fixed | $67-133 | G-profile closed (a workflow edit or a session build), G-deliverable handled by hand | Uses Connects on a category where two of three dated postings pay $5 |
| **D. Type 2** | Ghostwriting · Upwork · rate page $32/h | $20-45 | G-voice and G-no-fetch closed | - |
| **Discarded: types 3 and 5** | - | $15-25 / $6-111 | - | Below the two leaders on the key *and* thin (two dated postings each); type 5 also faces 302 bids (#77 §5). |
| **Not a trial, but ahead of all of them: the owner's Upwork search** | - | - | A logged-in human search (#77 Status and Recommendation) | Can overturn B vs C outright - see Step 6 |

**A in its own right.** Considered as a trial, A tests nothing about demand or
price, so on the key it scores zero and cannot be *the* trial of a job type. But
it is the cheapest observation that can remove the top-ranked gap, it risks no
client, no Connects and no reputation, and it is the only candidate that needs
nothing built first. So it is not rejected - it becomes B's first step, and if
it fails, it is the whole of the trial and C takes over.

---

## Recommendation: one first trial

**Trial: type 4, analytics engineering (dbt), on Upwork, at the $30/h Upwork
data-analyst rate-page median for a task of about 20 billed hours (≈ $600) - all
#77 §4's figures - giving an owner rate of $67-171 per owner-hour, derived from
inferred minutes.**

Order of steps:

1. **Run the factory's engineer role against a sample, non-client dbt project**
   (a public example project with seed data, so `dbt build` runs without anyone's
   warehouse). Give it three issues of the kind the #77 §4 postings describe - a
   staging model, a mart with a join, and tests - and plant one known answer in
   the seed data (a total the mart must reproduce). The owner logs every minute
   spent: setup, reviewing, revising. *Which sample project to use is not chosen
   here; nothing was fetched to check one.*
2. **Stop the trial here if any of these is observed:**
   - the known-answer check fails while CI is green - #77 §4's "A wrong join is
     found by the client in a dashboard, not by CI", seen before a client does;
   - any of the three issues ends at `needs-decomposition` or `needs-human`;
   - the owner's logged time for the three issues, scaled to a ~20 h task,
     exceeds 9 h - #77's own upper bound; past it $600 buys less than $67 an
     owner-hour, below type 1's floor at $300;
   - the role cannot run `dbt build` at all without credentials or tooling the
     factory does not hold.
3. **Only then approach a client**, one bid, on a dated dbt posting found by the
   owner's search (below), priced at or above the $30/h median.

**Why B over C.** It is first on the key, and its first step needs nothing built
here, while C cannot start until a workflow file only a person may edit is
changed (Step 3). #77's recommendation says types 3-5 should be ranked only
"after a human repeats the Upwork searches"; this trial honours that by not
reaching a client until the search is in (condition 1 below).

### Conditions the recommendation rests on, and what would change it

| # | Condition (where #77 is thin) | #77 source | The observation that would change the recommendation |
|---|---|---|---|
| 1 | **Type 4 has one dated posting, not three**, and a Freelancer API query for `dbt` returned zero active projects. | #77 §4 postings; [Searches that came back empty](77-freelance-job-shortlist-owner-minutes.md#searches-that-came-back-empty) | The owner's Upwork search finds fewer than three dated dbt postings in the last 60 days → switch the trial to C (type 1). |
| 2 | **The factory assumption for type 4** (and type 5). | #77 §4 Delivery system; Assumptions 1 | Any stop result in step 2 → switch to C. |
| 3 | **Type 4's price is the data-*analyst* rate page, not a dbt price**; no USD dbt posting price was visible, and the blog's $55-110/h was not confirmed. | #77 §4 Price; hypothesis table row "$55-110/h" | Dated dbt postings priced mostly under about $25/h → type 4's midpoint drops below type 1's ($100 at $300), and C leads. |
| 4 | **~20 h billed per task is #77's inference**, and one visible dbt-adjacent posting is 6+ months, contract-to-hire. | #77 §4 owner minutes; Snowflake posting row | Dated postings that are mostly long retainers or contract-to-hire rather than bounded tasks → the per-task owner-time model does not apply; re-derive before bidding. |
| 5 | **Client access** - credentials and client git host. | #77 §4, "the first run, on access" | The first client will not grant a third party repository and warehouse access → stop at step 3; type 4 is not deliverable through this route. |
| 6 | **Types 3 and 5 are thin** (two dated postings each) and rest on nothing here - the recommendation does not lean on them. | #77 §3, §5 | Dated automation postings at about $370+ fixed would bring type 5's midpoint level with type 4's; dated newsletter work at about $160+ per issue would bring type 3's to type 1's. Either re-opens the ranking. |

### What would prove it wrong

**A concrete, observable result:** the owner's own log for step 1 exceeds 9
owner-hours for a ~20 h-equivalent task, or the known-answer check fails with CI
green. Either one means type 4 does not beat type 1 on the key once the
assumption is replaced by an observation, and the recommendation was wrong.

**The strongest evidence against it already in #77:** #77 §4 itself - "Only
one posting is dated. This type does not meet AC1's three", "A Freelancer API
query for `dbt` returned **zero** active projects", and "No real posting price is
in USD for a dbt job". And #77's
[Recommendation](77-freelance-job-shortlist-owner-minutes.md#recommendation-scoped-to-the-shortlist-not-a-trial)
chose the opposite way round: rank types 1 and 2 "on firm evidence", and 3-5
only after the human search. This document puts type 4 first because the key
changed after #77 was written, and holds its client step behind that search -
but the demand evidence for type 4 is still the weakest of the two leaders.

---

## What the owner's Upwork search could overturn

The human-run, logged-in Upwork search for dated dbt, newsletter and automation
postings has not been done (#77 Status). It could overturn each conclusion here:

| Conclusion | Result that would overturn it |
|---|---|
| **Gap order** - G-factory above G-profile / G-deliverable | Dated dbt postings priced under about $25/h, or no dated dbt postings → G-factory drops below ranks 2-3. |
| **Gap order** - G-not-a-repo at rank 4 | Dated automation postings at about $370+ fixed → type 5 draws level with type 4 and G-not-a-repo rises. |
| **Gap order** - G-client-loop last | Dated newsletter postings at about $160+ per issue (or about $100/h) → type 3's figure rivals type 1's and G-client-loop rises. |
| **Trial choice** - type 4 | Fewer than three dated dbt postings → C, type 1. |
| **Price** - $30/h, ≈ $600 | #77's own flip result, **three or more dated dbt postings at $40/h or more**, confirms the trial and raises the price: $800 per ~20 h task, $89-229 per owner-hour (derived). Postings with visible fixed prices would replace the rate-page figure altogether. |

## Searches that came back empty

None were run: this run made no fetches or searches. The absences it relies on
are #77's, listed in #77's
[Searches that came back empty](77-freelance-job-shortlist-owner-minutes.md#searches-that-came-back-empty).

## Assumptions this document adds

1. That billing a ghostwriting or newsletter client per owner hour is the right
   reading of "if the client pays for the hours" (types 2, 3). Any per-post or
   per-issue flat price changes those two ranges, not the top of the list.
2. That netting out fees leaves the order unchanged. True while the two leaders
   are both on Upwork; not true if type 1 were priced off the Freelancer.com
   $250-750 posting (a 10%-or-$5 fee against Upwork's 0-15% plus Connects).
3. That the owner's minutes for step 1 are recorded at all. The whole trial is a
   measurement of the one quantity #77 could only infer.
