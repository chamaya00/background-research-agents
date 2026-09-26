# Which paid freelance work this repository could largely automate - 2026-09-26

**Produced in a session**, not by a research run, as a discussion answer. It is
not an objective and nothing here is queued. It does not read or change
`docs/reader/profile.md`.

The question: which paid jobs on Fiverr, Upwork, or similar sites could this
repository, or a tuned fork of the agent factory, do most of the work for?

**Short answer.** Sell a **recurring retainer**, not one-off gigs. The best
fit is a weekly intelligence brief plus LinkedIn posts, written for a
data or AI buyer, in the niche this repository has already researched. The
product here is a loop: a reader reacts and the next brief changes. That
loop is what a retainer client pays for. Almost no other seller on these
sites can offer it, and the $5 fixed-price research bucket cannot price it.

---

## What the repository can actually produce

Only outputs that already exist here count. Nothing is assumed from what a
fork *could* build.

| Mode | Output that exists | Where |
|---|---|---|
| Round (the loop) | A dated, sourced brief with an explicit window rule, a dropped-items log, and a profile that changes with each reaction | `docs/research/*-brief-*.md`, `docs/reader/` |
| Auto breadth | A multi-level deep dive on a seed, run unattended in Actions, opened as a PR | `docs/research/explore/`, `.github/workflows/auto-breadth.yml` |
| Writing | A LinkedIn post in one author's voice, drawn from at least two runs, with a questions pass and a style file that learns | `docs/posts/`, `docs/writer/` |
| Factory roles | Engineer, researcher, analyst and designer agents that turn an issue with acceptance criteria into a reviewed PR | `.claude/agents/`, `agent-run.yml` |

Existing subject depth: enterprise AI analytics, measuring agent efficacy,
dbt and its semantic layer, warehouse-native AI (Snowflake, Databricks,
Fabric).

## The market, by fit

Rates below come from Upwork's own rate pages where possible. Where the only
source is a vendor blog, the table says so. Those numbers are marketing and
should be treated as a ceiling, not a median.

| # | Job type | Typical pay | Share automatable here | Fit | Why |
|---|---|---|---|---|---|
| 1 | **Recurring industry / competitor intelligence digest** (weekly brief for a founder, PMM, or data leader) | Upwork market-research median $38/h, range $25-70/h [1]. DIY CI programmes cost ~$650/mo in software plus about 8 h/week of curation. Full-service offerings run $1-2.5K/mo [2] | High, about 70-80%. Fetching, filtering, windowing and writing are the round loop. The human part is client reactions, which the loop already structures | **Best** | Recurring revenue. The profile-learns-from-reactions mechanic is the product differentiator. One client is one fork |
| 2 | **LinkedIn / newsletter ghostwriting** for B2B founders and execs | $500-1,300/mo for 4-8 posts, $1.5-3.5K/mo mid-tier retainers (vendor blogs) [3] | Medium-high, about 60%. `/post` already drafts from research, asks questions and rewrites. The author interview cannot be automated and should not be | **Strong**, especially bundled with #1 | The writer mode needs research underneath it. Clients who buy #1 are the natural buyers of #2, and #72 (Substack issue plus cut LinkedIn posts) is already this shape |
| 3 | **One-off deep research report** (market sizing, competitor matrix, literature review, landscape scan) | Wide. Upwork carries real $5 fixed-price competitor-analysis posts [4] next to $50-70/h advanced analysts [1] | High for the draft, about 70%, via auto-breadth. Low for sign-off: claims must be checked by hand before a client relies on them | **Conditional** | The low end is exactly the commoditised work AI already floods [5]. Only take it in the niche (data or AI tooling) at intermediate-plus rates, or as the free sample that sells #1 |
| 4 | **Analytics engineering** (dbt models, semantic-layer metrics, warehouse AI setup) | Data engineers $55-110/h, with specialised work higher (third-party blog) [6] | Medium, about 40-50%, via a factory fork running the engineer role. Client warehouse access, credentials and review are human | **Good, different fork** | Highest rates, and the repository's research is in this domain. But it is an engineering fork of the agent factory, not this repository |
| 5 | AI integration / automation builds | Fastest-growing Upwork category, AI integration +178% YoY [7] | Medium via factory engineer role | Possible | Crowded with agencies, and depends on the client's own stack |
| - | Data annotation, AI video, virtual assistance | - | Low | **Skip** | Nothing here produces these |

## What cannot be automated, and should not be

- **Finding and bidding on jobs.** Upwork permanently suspends accounts that
  auto-submit proposals, auto-message, or scrape or refresh the job feed on a
  schedule. Automation may *draft*, but a human must review and send [8]. An
  agent here can write a proposal draft from a pasted job post. It must not
  touch Upwork itself.
- **Disclosure.** Fiverr allows AI in every category. It expects it to support
  the seller's own skill, and requires disclosure when a client asks or has
  made a "no AI" request [9]. Upwork's 2026 terms change concerns training
  Upwork's own AI, not a new client-facing disclosure rule [10]. Be open
  anyway: the retainer pitch *is* the agent loop, so hiding it would hide
  the product.
- **Client judgement.** Accepting a brief, the ghostwriting interview, and
  anything a client will act on financially. Rule 3 of the reader loop
  (show the diff before committing) already puts a human at that point.

## What a client-facing fork needs that this repository lacks

1. **Per-client state.** `docs/reader/profile.md`, `docs/reader/sources.md`
   and `docs/writer/style.md` are single hard-coded paths (for example,
   `.github/workflows/auto-breadth.yml:252`). The cheapest fix is one private
   fork per client. Parameterising a client directory is the scalable one,
   but that is an objective in its own right.
2. **A delivery surface.** Output lands as markdown in a GitHub PR. Clients
   need email, a Google Doc, PDF or Substack. The Substack objective (#72)
   covers part of this.
3. **Source access.** Sources are public feeds and GitHub. Paid databases
   (Crunchbase, PitchBook, G2, analyst reports) are what many research
   buyers expect, and the network egress here blocks many sites.
4. **A claim-check pass.** A brief for one reader can be wrong at low cost.
   A paid deliverable cannot. Add a verification step that re-fetches every
   cited URL and confirms the quoted claim before delivery.
5. **Confidentiality.** Client briefs and voice samples must live in a
   private repository, never this one.

## Recommended first offer

**"Weekly AI-and-data intelligence brief, plus 2 LinkedIn posts a month from
it"** for data-tool startups or heads of data. Price it as a retainer in the
$500-1,500/mo band at first, below mid-tier ghostwriting alone, because
the track record is thin. Sell it on Upwork or Contra as a *project catalog*
item or fixed-price milestone, so there is no bidding treadmill. Use a
one-off auto-breadth report as the paid trial.

Why this one: it uses modes 1 and 3 together, it is recurring, and the
existing subject depth is the sample. The briefs and the published post
under `docs/` are a portfolio as they stand.

What would prove it wrong: if a trial client's reactions do not visibly change
the second and third briefs, the differentiator is not real. The offer is then
just a cheaper market-research gig, competing with the $5 bucket.

## Sources

1. [Upwork - Market Research Analyst hourly rates](https://www.upwork.com/hire/market-researchers/cost/)
2. [Competitive intelligence pricing roundups, 2026](https://www.getmonetizely.com/articles/how-much-should-you-pay-for-competitive-intelligence-monitoring-understanding-subscription-pricing-models); [meertrack](https://meertrack.com/compare/best-competitive-intelligence-tools)
3. [LinkGenie](https://linkgenie.one/blog/how-much-does-a-linkedin-ghostwriter-cost); [Foundera](https://www.foundera.co/blog/linkedin-ghostwriting-pricing-guide-2026); [Windmill Growth](https://windmillgrowth.com/blogseo/linkedin-ghostwriter-cost) (vendor blogs)
4. [Upwork job post, $5 fixed-price competitor analysis, 2026-09-23](https://www.upwork.com/freelance-jobs/apply/Market-Research-Analyst-Competitor-Analysis_~022102840103983609771/)
5. [SelfEmployed - AI is flooding freelance platforms](https://www.selfemployed.com/news/ai-freelance-platforms-2026/)
6. [Damongo - freelance data engineer rates 2026](https://damongo.com/freelance-data-engineer-rates-2026-how-much-to-charge/); [Upwork - dbt engineers](https://www.upwork.com/hire/dbt-engineers/)
7. [Upwork In-Demand Skills 2026](https://investors.upwork.com/news-releases/news-release-details/upworks-demand-skills-2026-demand-top-ai-skills-more-doubles-ai)
8. [Upwork Help - Use bots and other automation properly](https://support.upwork.com/hc/en-us/articles/43342677368467-Use-bots-and-other-automation-properly)
9. [Fiverr Help - Using AI on Fiverr](https://help.fiverr.com/hc/en-us/articles/34998793899665-Using-AI-on-Fiverr-Guidelines-for-freelancers-and-clients) (read via search summary; the page itself was blocked by egress)
10. [terms.law - Upwork 2026 AI and privacy update](https://terms.law/2025/12/05/upwork-ai-privacy-update-2026-corporate-clients/)
