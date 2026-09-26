# Client-postable freelance job types this repository could deliver - shortlist, prices, owner minutes, platforms

**Issue:** #77 (child of #76). **Written:** 2026-09-26 by a researcher run, not
a session.

**The decision this serves:** which job types a client actually posts are worth
carrying into #76's next child, which ranks the gaps and picks a first trial,
judged on how many of the owner's minutes each one costs rather than how much
of it an agent can do.

**Status: complete for what this run could reach, and thin where it could not.**
Upwork and Fiverr both refused every direct fetch (HTTP 403). Freelancer.com
answered, and then its own terms turned out to forbid the automated access used
to read it (see [Platforms](#platform-comparison)). So two of the five job types
below have fewer than three *dated* postings. Each one says so. If this were
re-run, the next thing to read is the same Upwork searches, done by a person in
a logged-in browser. That is a human step, and it is the only way to get the
posting dates and prices this run could see only through a search index.

---

## How to read the evidence

Every posting and rate below is marked with one of four grades, because they
are not equally strong:

| Grade | What it means |
|---|---|
| **A - read** | Fetched directly from the platform during this run. The date is converted from the platform's own `time_submitted` Unix timestamp. |
| **B - indexed** | The platform page returned 403. The title, price and date come from the page title or snippet as a web search index shows it. It is the platform's own text, but it was not read in full, and it may be stale. |
| **B- - summarised** | As B, but the date came from the search tool's summary of the page, not from the page title. This is the weakest grade still attributed to the platform. |
| **C - vendor** | A third-party or vendor blog. Weaker evidence, and never presented as a rate. |

**Postings listed without a date are not counted** toward any "at least three
postings" bar.

### What was reachable (re-fetched while writing, 2026-09-26)

| Host / URL tried | Result |
|---|---|
| `www.upwork.com/freelance-jobs/dbt/` | 403 |
| `www.upwork.com/hire/market-researchers/cost/` | 403 |
| `support.upwork.com/.../43342677368467-Use-bots-and-other-automation-properly` | 403 |
| `www.fiverr.com/categories/writing-translation` | 403 |
| `help.fiverr.com/.../37333301560593-Using-AI-on-Fiverr-...` | 403 (as in the hypothesis pass) |
| `www.guru.com/d/jobs/c/writing-translation/` | 403 |
| `www.peopleperhour.com/freelance-jobs/writing-translation` | 200, but the body came back empty to the fetch tool. Nothing read. |
| `www.freelancer.com/jobs/data-engineering/` (HTML) | 200, read |
| `www.freelancer.com/api/projects/0.1/projects/...` (public JSON) | 200, read. **Then stopped:** see Freelancer.com's §33 below. |

**What else was tried and refused.** A `curl` status sweep over all of these
hosts was refused by this run's own Bash permission check ("Contains
simple_expansion"). It was not retried, so every row above is from the WebFetch
tool. On Upwork and Fiverr, where WebFetch got a 403, WebSearch restricted to
`upwork.com` was used instead. That is where every grade-B item comes from.

**One date trap, found and avoided.** The summarising model inside the fetch
tool turned the Freelancer timestamps into January 2025 dates, and gave
different dates for the same project in two calls. The raw integers
(e.g. `1790155200`) were converted here with `date -u -d @…` instead, and give
2026-09-23 to 2026-09-26. The Freelancer HTML page also labelled items "6 days
ago" when their API timestamps are from today. All Freelancer dates below are
from the raw timestamps.

---

## Guesses versus constraints in the issue

- **Constraints, checked:** the metric is owner minutes. Job discovery stays
  human. No auto-bidding and no scheduled feed reads. The factory is
  unreadable from here. The writer is tuned to one voice.
- **Guesses, tested below:** that the recurring brief-plus-posts retainer is the
  best fit, and its price band; that data engineering pays $55-110/h; that
  Fiverr is a place clients *post* jobs.
- **A guess the issue's own wording carries:** "client-postable" fits Upwork and
  Freelancer.com, where clients post and freelancers bid. Fiverr mostly works
  the other way round: the seller lists a gig and the buyer browses. So "real
  Fiverr postings" may be the wrong thing to look for. This is an inference
  from how the platform is built. Fiverr's pages could not be read to confirm
  it.

---

## Platform comparison

| | **Upwork** | **Fiverr** | **Freelancer.com** |
|---|---|---|---|
| **Could this run read listings?** | **No.** Every `upwork.com` and `support.upwork.com` fetch returned 403. Only search-index snippets were visible. | **No.** `www.fiverr.com` and `help.fiverr.com` returned 403. | **Yes, technically.** The HTML job list and the public JSON API both answered. **But its terms forbid it** without written permission (next row but one). |
| **Freelancer fee** | Variable 0-15% per contract, fixed when the proposal is sent. Proposals cost Connects at $0.15 each, 6-16 per proposal. *Grade C* ([golance](https://golance.com/blogs/upwork-fees-explained-2026), [hireinsouth](https://www.hireinsouth.com/post/how-much-does-upwork-cost)). Upwork's own [fee article](https://support.upwork.com/hc/en-us/articles/211062538-Learn-about-the-Freelancer-Service-Fee) was indexed but not fetched. | 20% of every order at every seller level. Buyers pay 5.5% plus $2.50 on orders under $50. *Grade C* ([vaultleap](https://vaultleap.com/blog/fiverr-fees-explained-2026), [fastlancer](https://www.fastlancer.org/en/fastlancer-blog/fiverr-review/)). Fiverr's own page was not reachable. | "10% or $5.00 USD, whichever is greater", on fixed-price and hourly projects alike. Free members get 6 bids a month, and bidding needs a $20 balance. *Grade A, read* ([fees and charges](https://www.freelancer.com/feesandcharges)). |
| **Rule on AI use** | AI drafting of proposals is allowed if a human reviews and sends them. *Grade B* (snippet of [Use bots and other automation properly](https://support.upwork.com/hc/en-us/articles/43342677368467-Use-bots-and-other-automation-properly)). No client-facing AI-disclosure rule was found. | AI is allowed in every category. Disclosure is required only when the client asks, or has said "no AI" before or at the start of the order. *Grade B* (snippet of [Using AI on Fiverr](https://help.fiverr.com/hc/en-us/articles/37333301560593-Using-AI-on-Fiverr-Guidelines-for-freelancers-and-clients); the article ID differs from the hypothesis's `34998793899665`, which suggests it was re-issued under a new ID - *inference*). A critic's view: [Threads post](https://www.threads.com/@lichtkonfetti/post/DVMG_jGCLng/) complaining that this puts the burden on the client. | The terms have **no clause on AI-generated content**. *Grade A, read* ([terms](https://www.freelancer.com/about/terms)). |
| **Rule on automation** | Bans bots, scrapers, "job alert or watcher tools that scrape or run searches", "auto-refresh or tab reload tools", page monitors, and anything that submits a proposal without a human clicking send. Upwork says it detects these automatically and **makes no exceptions**. *Grade B* (help-article snippet). | Prohibits accessing the platform "through unauthorized methods" and scraping data from it, and can end in permanent suspension. *Grade B* (snippet of [Community Standards](https://help.fiverr.com/hc/en-us/articles/32242973123985-Our-Community-Standards)). | §33: "You agree that you will not use any robot, spider, scraper or other automated means to access the Website via any means, including for the avoidance of doubt access to our API … for any purpose without our express written permission." *Grade A, read.* |
| **Consequence for this repository** | Discovery, proposals and messages are human-only. An agent may draft a proposal from a job post someone pastes in, and nothing more. | Same as Upwork. Also, the seller-lists-gig model means discovery is mostly the *buyer's* act. | **Even a one-off research read is outside the terms.** This run made about eight Freelancer requests before reading §33, then stopped. The postings already read are cited, but no future run should read Freelancer.com without the permission §33 names. |

**Considered and not checked:** Contra, which the hypothesis suggested. There
was no turn budget left to test it, so nothing is claimed about it.
**Discarded:** Guru and PeoplePerHour - Guru returned 403 and PeoplePerHour an
empty body, so neither can be cited.

---

## The shortlist

Five job types: two engineering, three writing or research. Each has a
**minutes** block, broken down as AC3 asks. **All minutes are inferences**,
reasoned from what the posting asks for and from each system's mechanic. None
is measured, and none is a platform figure. Each block ends with a
back-of-envelope effective hourly rate.

### 1. One-off market or competitor research report (writing / research)

**Postings**

| Posting | Platform | Date | Price | Grade |
|---|---|---|---|---|
| [Market Research Analyst \| Competitor Analysis](https://www.upwork.com/freelance-jobs/apply/Market-Research-Analyst-Competitor-Analysis_~022102840103983609771/) | Upwork | 2026-09-23 | $5 fixed | B |
| [B2B Market Research & Lead Generation Specialist](https://www.upwork.com/freelance-jobs/apply/B2B-Market-Research-Lead-Generation-Specialist_~022100433782672057267/) | Upwork | 2026-09-16 | $300 fixed | B |
| [Quick SaaS Pricing Research & Benchmarking](https://www.upwork.com/freelance-jobs/apply/Quick-SaaS-Pricing-Research-Benchmarking_~022097662574447168449/) | Upwork | 2026-09-09 | $5 fixed, contract-to-hire | B |
| [Pre-Built Cobot Sourcing Details](https://www.freelancer.com/projects/robotics-and-cognitive-automation/Pre-Built-Cobot-Sourcing) | Freelancer.com | 2026-09-26 | $250-750 fixed, 16 bids averaging $564 | A |
| [Competitive Intelligence Researcher Needed for B2B Pricing Research](https://www.upwork.com/freelance-jobs/apply/Competitive-Intelligence-Researcher-Needed-for-B2B-Pricing-Research_~022100290158311367603/) | Upwork | undated | under 30 h/wk, 1-3 months | B |

**Price.** The *real postings* run from $5 to $300 fixed on Upwork, and $250-750
on Freelancer.com. The *Upwork rate page* for market research analysts gives a
median of $38/h, with a range of $25-70/h (grade B,
[snippet](https://www.upwork.com/hire/market-researchers/cost/)). Two of the
three dated Upwork postings are $5, which is a price for a lead-in test, not
for a report.

**Delivery system:** `/auto-breadth` (breadth pass, then paths down), and a
round for a narrower question. *Capability confirmed by reading
[`auto-breadth.md`](../reader/auto-breadth.md), and by the seven explorations
under `docs/research/explore/`.*

**Where it most likely breaks: the profile step.** Every run "reads
[`profile.md`](../reader/profile.md) and treats it as a constraint", and the
workflow hard-codes that path
([`auto-breadth.yml:252`](../../.github/workflows/auto-breadth.yml)). A client's
subject (cobots, SaaS pricing) would be filtered through the owner's Interests
and Not-interested lines. The 90-day item window and "learning mode, no
recomputing figures" also run against what these postings ask for: a pricing
benchmark *is* a set of figures to check. A second break is the output format.
Postings ask for "a competitor comparison in Excel/Google Sheets"
(the $5 posting's snippet), and the system produces markdown in a pull request.

**Owner minutes** *(inference)*

- Finding and bidding: 20-40 min. Read postings by hand, adapt a drafted
  proposal, send it. On Upwork that also spends Connects.
- Scoping and client communication: 20-45 min. Deliverable format, which
  competitors, and where the sources may come from - the paid databases that
  buyers expect cannot be reached from here.
- Reviewing the system's output: 60-120 min. A paid report needs every cited
  claim re-checked, and an auto-breadth run is 10 research runs of text.
- Revisions: 30-60 min, one round.
- **Total: about 2¼-4½ h.** At $300 that is roughly $65-130/h. At $5 it loses
  money on the Connects alone.

### 2. LinkedIn ghostwriting for a founder (writing)

**Postings**

| Posting | Platform | Date | Price | Grade |
|---|---|---|---|---|
| [Thought-Leader LinkedIn Profile Makeover](https://www.freelancer.com/projects/content-writing/Thought-Leader-LinkedIn-Profile-Makeover) | Freelancer.com | 2026-09-26 | ₹600-1,500 fixed (23 bids averaging ₹5,787) | A |
| [LinkedIn + X Ghostwriter for SF Startup Founder](https://www.upwork.com/freelance-jobs/apply/LinkedIn-Ghostwriter-for-Startup-Founder_~022075825523383988602/) | Upwork | 2026-07-09 | not visible | B- |
| [LinkedIn Ghostwriter for B2B Founder - AI Automation Niche](https://www.upwork.com/freelance-jobs/apply/LinkedIn-Ghostwriter-for-B2B-Founder-Automation-Niche_~022072733704470294735/) | Upwork | 2026-07-03 | not visible | B- |
| [LinkedIn Ghostwriter & Profile Manager](https://www.upwork.com/freelance-jobs/apply/LinkedIn-Ghostwriter-Profile-Manager_~022044068082026299327/) | Upwork | 2026-04-15 | under 30 h/wk, 1-3 months | B- |
| [Ghostwriter - Founder-Led B2B Content (Twitter, LinkedIn, Newsletter)](https://www.upwork.com/freelance-jobs/apply/Ghostwriter-Founder-Led-B2B-Content-Twitter-LinkedIn-Newsletter_~022007264888991164047/) | Upwork | 2026-01-03 | not visible | B- |

**Price.** No Upwork posting's price was visible. The *Upwork rate page* for
ghostwriters gives a median of $32/h, with a range of $20-45/h (grade B,
[snippet](https://www.upwork.com/hire/ghostwriters/cost/)). The one *real
posting* with a visible price is ₹600-1,500 fixed on Freelancer.com, about
$7-17 at roughly ₹87/$ (the conversion is mine), though bids averaged about
$66. *Vendor blogs* claim $150-800 per post and $1-5K a month
([LinkGenie](https://linkgenie.one/blog/how-much-does-a-linkedin-ghostwriter-cost),
grade C). That is marketing and is not a rate.

**Delivery system:** `/post`. *Capability confirmed by reading
[`writer.md`](../writer/writer.md) and one real draft
(`docs/posts/2026-09-25-…`).*

**Where it most likely breaks: pass 2, the interview, and `style.md`.** The
writer is tuned to one author. [`style.md`](../writer/style.md) is "about the
audience that person writes for", with a single hard-coded path. **A gap, not a
capability: writing in a client's voice is not possible today.** The interview
pass asks the *author* about "the moment the subject touched their own work".
For a client, the owner would have to put those questions to the client and
relay the answers. The mode also may not fetch anything, so a client whose
subject has no research in this repository gets no first pass at all.

**Owner minutes** *(inference; per month, 8 posts)*

- Finding and bidding: 30-60 min once, then nothing while the client stays.
- Scoping and client communication: 60-120 min onboarding (voice samples,
  topics, the "no employer internals" rule turned into the client's own
  terms), then 15-30 min per post relaying interview questions and answers.
  That comes to 2-4 h a month.
- Reviewing the system's output: 15-30 min per post, which is 2-4 h. A voice
  mismatch cannot be caught by reading for facts.
- Revisions: 15-45 min per post, which is 2-6 h. Early months will be the
  worst, because `style.md` learns only from reactions.
- **Total: about 7-15 h a month** after onboarding. At the rate page's $32/h
  median, that is only break-even if the client pays for the hours.

### 3. Recurring newsletter or industry digest (writing) - *below the bar: two dated postings*

**Postings**

| Posting | Platform | Date | Price | Grade |
|---|---|---|---|---|
| [Newsletter Email Management & Writing](https://www.freelancer.com/projects/email-marketing/Newsletter-Email-Management-Writing) | Freelancer.com | 2026-09-26 | ₹1,250-2,500/h, 32 bids | A |
| [Sales-Driven Email Newsletter](https://www.freelancer.com/projects/email-marketing/Sales-Driven-Email-Newsletter) | Freelancer.com | 2026-09-23 | $15-25/h, 100 bids | A |
| [Freelance AI Newsletter Writer](https://www.upwork.com/freelance-jobs/apply/Freelance-Newsletter-Writer_~021926708961030523226/) | Upwork | undated | not visible | B |
| [Newsletter Writer & Growth Assistant (Part-Time, Remote)](https://www.upwork.com/freelance-jobs/apply/Newsletter-Writer-Growth-Assistant-Part-Time-Remote_~022068719717178148162/) | Upwork | undated | not visible | B |
| [Newsletter Writer (Writing & Publishing Audience)](https://www.upwork.com/freelance-jobs/apply/Newsletter-Writer-Writing-Publishing-Audience_~022017160163408676011/) | Upwork | undated | not visible | B |

**Only two postings are dated. This type does not meet AC1's three.** Upwork
could not be fetched. Searches for Upwork titles of the form "Hourly, posted
<date>" and "posted August/September 2026" returned only category pages. That
is where AC1's "state plainly which platform could not be reached" applies.

**Price.** The *real postings* pay $15-25/h, and ₹1,250-2,500/h, which is about
$14-29/h (conversion mine). The *Upwork rate page* for writers in general gives
a median of $40/h, range $30-59/h (grade B,
[snippet](https://www.upwork.com/hire/writers/cost/)). There is no rate page
for newsletter writers specifically.

**Delivery system:** the round loop. *Capability confirmed by reading
[`loop.md`](../reader/loop.md) and the four briefs in `docs/research/`.*

**Where it most likely breaks: step 1 (form the objective) and the delivery
surface.** Step 1 inlines the owner's `profile.md` into every issue, and
there is one profile. A client needs their own, and a second loop that the
owner drives for them. Both postings also ask for *email workflow*: "take full
ownership of my newsletter workflow", "written, designed, and scheduled". The
loop ends at a merged markdown file (step 3). Nothing here designs or sends
email. Step 4, "one sentence back", is the part a client is least likely to do.

**Owner minutes** *(inference; per weekly issue)*

- Finding and bidding: 30-60 min once.
- Scoping and client communication: 60-120 min onboarding, then 15 min a week
  collecting the client's reaction and turning it into a profile diff
  (loop.md step 5 makes that a reader's job).
- Reviewing the system's output: 30-60 min.
- Revisions, including laying it out in the client's email tool: 30-60 min.
- **Total: about 1¼-2¼ h per issue.** At $15-25/h that is roughly $20-55 per
  issue for the owner's time. The hourly price does not pay for the loop.

### 4. Analytics engineering - dbt models, warehouse work (engineering) - *below the bar: one dated posting*

**Postings**

| Posting | Platform | Date | Price | Grade |
|---|---|---|---|---|
| [Back-End and Data Engineering Support](https://www.freelancer.com/projects/backend-development/Back-End-Data-Engineering-Support) | Freelancer.com | 2026-09-26 | ₹12,500-37,500 fixed, 17 bids | A |
| [DBT Developer with Snowflake Expertise](https://www.upwork.com/freelance-jobs/apply/DBT-Developer-with-Snowflake-Expertise_~021998787472701968421/) | Upwork | undated | not visible | B |
| [Data Engineer to transform data using dbt for data visualization](https://www.upwork.com/freelance-jobs/apply/Data-Engineer-transform-data-using-dbt-for-data-visualization_~021939632073772924644/) | Upwork | undated | not visible | B |
| [Standout Data Analyst & Data Engineer Wanted (Power BI, dbt)](https://www.upwork.com/freelance-jobs/apply/Standout-Data-Analyst-Data-Engineer-Wanted-Power-DBT-Flexible-Easygoing-Vibes_~021986238194098682930/) | Upwork | undated | not visible | B |
| [Data Warehouse / DBT Builder](https://www.upwork.com/freelance-jobs/apply/Data-Warehouse-DBT-Builder_~021960925493855201191/) | Upwork | undated | not visible | B |
| [Snowflake Platform Engineer](https://www.upwork.com/freelance-jobs/apply/Snowflake-Platform-Engineer_~022032357534848814268/) | Upwork | undated | under 30 h/wk, 6+ months, contract-to-hire | B |

**Only one posting is dated. This type does not meet AC1's three.** There is
plenty of Upwork demand (the category page's snippet says 343 open data
engineer jobs, grade B), but no posting date or price was visible through the
index. A Freelancer API query for `dbt` returned **zero** active projects.

**Price.** No real posting price is in USD for a dbt job. The *Upwork rate
page* for data analysts gives a median of $30/h, range $20-50/h (grade B,
[snippet](https://www.upwork.com/hire/data-analysts/cost/)). No Upwork rate page
for data engineers or dbt engineers was visible. The search summary mentioned a
$35-70/h analytics-engineer contractor listing, but it is not on any of the
three platforms, and it is not cited as a rate.

**Delivery system:** the external agent factory's engineer role. ***Assumed.***
The factory cannot be read from here. What this repository shows is its
*interface* - issues with acceptance criteria in, pull requests through CI out -
not how it performs on someone else's codebase.

**Where it most likely breaks: the first run, on access.** The engineer role
reads a repository and opens a pull request that CI checks. A client's dbt
project needs warehouse credentials to `dbt build`, and it usually lives in the
client's own git host. Either the client grants a third party write access and
secrets, or the pull request goes through CI that never touched real data. The
owner is also the reviewer the factory assumes: "reviewed by a human" means the
owner reads SQL against a schema they did not design.

**Owner minutes** *(inference; one ~20 h-equivalent task)*

- Finding and bidding: 30-60 min.
- Scoping and client communication: 60-180 min. Access, conventions, which
  models, and a test dataset.
- Reviewing the system's output: 60-180 min, across the pull requests.
- Revisions: 60-120 min. A wrong join is found by the client in a dashboard,
  not by CI.
- **Total: about 3½-9 h** for work billed as about 20 h. At the $30/h median
  rate page, that is $600 of billing for up to 9 h of owner time. This is the
  only type here where billing outpaces minutes - *if the factory assumption
  holds*.

### 5. Small automation builds - an AI newsletter pipeline, a weekly report agent (engineering) - *below the bar: two dated postings*

**Postings**

| Posting | Platform | Date | Price | Grade |
|---|---|---|---|---|
| [Automated AI Newsletter Pipeline Creation](https://www.freelancer.com/projects/automation/Automated-Newsletter-Pipeline-Creation) | Freelancer.com | 2026-09-23 | $30-250 fixed, **302 bids** averaging $159 | A |
| [Otomatisasi Laporan Performa eNewsletter](https://www.freelancer.com/projects/email-marketing/Otomatisasi-Laporan-Performa-eNewsletter) (build an agent for a weekly newsletter performance report) | Freelancer.com | 2026-09-25 | €8-30 fixed | A |
| [n8n AI Agent for Shopify Orders + CRM Automation](https://www.upwork.com/freelance-jobs/apply/n8n-Agent-for-Shopify-Orders-CRM-Automation_~022088290925050756832/) | Upwork | undated | not visible | B |
| [n8n Automation Expert Needed to Build Workflows & AI Agents](https://www.upwork.com/freelance-jobs/apply/n8n-Automation-Expert-Needed-Build-Workflows-Agents_~022078911517795336656/) | Upwork | undated | not visible | B |

**Only two postings are dated. This type does not meet AC1's three.**

**Price.** The *real postings* are $30-250 and €8-30 fixed. The 302 bids on the
first are the finding: this is the most crowded bucket seen in this run.

**Delivery system:** the external agent factory's engineer role. ***Assumed***,
as in type 4.

**Where it most likely breaks: the target is not a repository.** These
postings want n8n or Make.com workflows, an LLM and an email service wired
together in the client's accounts. A pull request through CI has nowhere to
land. The factory could build a script version, but the owner would then do the
installing, and in effect the translation to n8n.

**Owner minutes** *(inference)*

- Finding and bidding: 20-30 min, with low odds against 300 bids.
- Scoping and client communication: 30-60 min.
- Reviewing the system's output: 60-120 min, testing it against the client's
  real accounts.
- Revisions and disputes: 30-90 min. Cheap fixed-price automation is where
  "it doesn't work on my setup" lives.
- **Total: about 2¼-5 h for $30-250.** Break-even at best.

---

## The hypothesis document: what this run confirmed, revised, rejected

Source: [`freelance-automation-fit-2026-09-26.md` on `claude/automate-freelance-jobs-koasx3`](https://github.com/chamaya00/background-research-agents/blob/claude/automate-freelance-jobs-koasx3/docs/research/freelance-automation-fit-2026-09-26.md).

| Claim there | Verdict | Why |
|---|---|---|
| Best fit is a recurring retainer: weekly AI-and-data brief plus LinkedIn posts, **$500-1,500/month** | **Rejected as evidenced; stays a hypothesis.** | No posting at that price or in that shape was found. The closest real postings (type 3) pay $15-25/h, and they want email operations the loop does not do. $500-1,500 was the hypothesis's own pricing choice, and its document says as much ("price it … at first"). It is not a market rate. |
| Upwork market-research median **$38/h, range $25-70** | **Confirmed, with lower confidence than it implied.** | The same figures appear in the search-index snippet of the same Upwork page. The page itself returned 403 to this run, so it was not re-read. |
| Real $5 fixed-price competitor-analysis posting, 2026-09-23 | **Confirmed, and extended.** | The same posting is indexed with that title and date, plus a second $5 posting (2026-09-09) and a $300 one (2026-09-16). $5 is common in this category, not an outlier. |
| LinkedIn ghostwriting **$500-3,500/month** (vendor blogs) | **Revised down, still weak.** | The only platform figure is Upwork's ghostwriter rate page (snippet): median **$32/h**, range $20-45. Vendor blogs still say $1-5K a month. No posting price confirmed either. |
| Freelance data engineers **$55-110/h** (third-party blog) | **Not confirmed.** | The only platform figure visible is Upwork's *data analyst* page: median $30/h, range $20-50. No data-engineer rate page and no dated USD dbt posting were readable. |
| Upwork suspends accounts for auto-submitting proposals, auto-messaging, scraping or refreshing the feed; AI drafting is fine if a human sends | **Confirmed** (grade B). | The help article's indexed text says this, and adds that there are no exceptions and detection is automatic. The page itself returned 403. |
| Fiverr allows AI everywhere; disclosure on request or for "no AI" orders | **Confirmed** (grade B). | Same rule in the snippet of what appears to be a re-issued article (a new ID). |
| `help.fiverr.com` refused by egress | **Confirmed, and wider.** | `www.fiverr.com` also returns 403, as do Upwork, its support site, and Guru. |
| "Share automatable" (70-80%, 60%, 40-50%) as the ranking metric | **Rejected as the metric.** | #76 set owner minutes as the metric. Type 2 (ghostwriting) was ranked "Strong" at 60% automatable, and it costs about 7-15 owner-hours a month here because the voice interview cannot be delegated. |
| Analytics engineering is a good fit, via a factory fork | **Revised: a good fit on minutes-per-dollar, an assumption on capability.** | See type 4. It is the only type where billing plausibly outpaces minutes, and it rests entirely on the factory assumption and on client access. |
| Per-client state is a gap: single hard-coded `profile.md`, e.g. `auto-breadth.yml:252` | **Confirmed by reading.** | Line 252 names `docs/reader/profile.md`. `style.md` is single-author in the same way. |
| AI integration +178% YoY; Contra or Project Catalog avoids the bidding treadmill | **Not checked.** | No budget left. Named here so nobody reads silence as confirmation. |

---

## Searches that came back empty

- Upwork job titles carrying "posted <date>" for **dbt**, **newsletter**, or
  **n8n/automation** in August or September 2026: only category and hire pages
  came back. The same query shape found three dated market-research postings,
  so the absence is specific to those categories in the index, not the method.
- Freelancer.com API query `dbt`: zero active projects.
- Any posting of the *brief-plus-posts retainer* shape, on any platform
  reachable here: none found.
- Any Fiverr *buyer request* or brief: not attempted, because the host
  returned 403.

## Assumptions the shortlist rests on

1. That the agent factory's engineer role can work in a client's repository
   and warehouse (types 4 and 5). **Unverifiable from here.**
2. That grade-B snippets reflect the live pages. The search index can be stale,
   and some "open" postings will have closed.
3. That a client would accept markdown or a pull request as a deliverable, or
   that the owner converts it. This is not stated in any posting.

---

## Recommendation (scoped to the shortlist, not a trial)

**The next child should rank types 1 and 2 on firm evidence, and types 3, 4 and
5 only after a human repeats the Upwork searches this run could not read.**
Only types 1 and 2 clear three dated postings. Type 4 is the best on
minutes-per-dollar, but it is also the one resting most heavily on the factory
assumption.

**Strongest argument against it,** found rather than imagined: type 1's own
evidence. Two of its three dated Upwork postings pay $5, and the market-research
median is $38/h. Type 1 is only viable at the $250-750 end, which appeared once,
on the one platform whose terms bar reading it. Ghostwriting (type 2) carries the
open voice gap, and no posting price for it was visible.

**What would flip it:** a human-run Upwork search showing three or more dated
dbt postings at $40/h or more. That would make type 4 the one to rank first,
and it would make the factory assumption the first thing to test.
