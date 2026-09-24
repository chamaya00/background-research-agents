# Curated source list

The list a research run reaches **first and by default** when it goes looking
for items on this reader's subjects. Built for
[#32](https://github.com/chamaya00/background-research-agents/issues/32),
which is the Format line in [`profile.md`](profile.md) - "Sources come from a
curated list rather than open search" - finally having something behind it.

Where it lives and why it is prose rather than YAML:
[ADR 0004](../decisions/0004-curated-source-list-lives-beside-the-profile.md).
How a run gets it: the same record, and step 1 of [`loop.md`](loop.md).

## What this list is not

**It is not an allowlist.** Nothing here forbids a run from reading anything.
The list is where a run starts, not the boundary of where it may go, and the
three commitments below are the whole of how it is meant to be used:

1. **The list is reached first and by default, never the only thing a run is permitted to read.**
   A run works through it
   before it searches, because a host whose reachability is already recorded
   costs one fetch to confirm rather than a search, a click and a 403.
2. **Open search stays available for everything the list does not cover.**
   The single most consequential item in
   [#26](https://github.com/chamaya00/background-research-agents/issues/26)
   - ERPBench, which reframed that whole brief - was reached by search, nine
   days after publication, from a host no list would have carried yet. A list
   that had been treated as a boundary would have excluded it. `arxiv.org` is
   in the table below *because of* that item, not as permission to have found
   it.
3. **The next brief says, for each item, whether it came from a listed source or from search.**
   One clause per item is enough. Without it there is no way
   to tell a list that is working from a list that is being ignored, and the
   only fix anyone can propose is "add more sources", which is the wrong one
   about half the time.

It is also not a ranking. Nothing here says one host is better than another;
that was ruled out of scope by #32 on purpose, and a weight column added
casually would be the first thing to start deciding selection silently.

## The list

*This section is the part that gets pasted into an issue body. Everything
below it is detail a run reads off the branch. See ADR 0004 for why the file is
split this way.*

Columns: **Line** is which of `profile.md`'s Interests lines the host has
actually been observed serving - `A` = "Analytics for enterprise AI, broadly",
`E` = "Measuring agent efficacy in an enterprise setting", `B` = the Depth line
"text-to-SQL and data-agent benchmarks by name", `D` = the Depth line "dbt's
semantic and context layer work". **Status** is reachability as observed by an
actual fetch, never inferred from a citation. **Cited** names the document and
which of its two tables the row came from:
`19` = `docs/research/19-analytics-for-enterprise-ai-brief-2026-09-21.md`,
`26` = `docs/research/26-analytics-and-agent-efficacy-brief-2026-09-23.md`,
`35` = `docs/research/35-depth-brief-2026-09-23-benchmarks-and-dbt.md`,
`42` = `docs/research/42-depth-brief-2026-09-23-semantic-models-and-warehouse-agentic.md`.
`X1` = the auto-breadth exploration `docs/research/explore/2026-09-23-snowflake-sql-ai-functions/`.
`X2` = the auto-breadth exploration `docs/research/explore/2026-09-24-agentic-ai-features-for-analytics-launched-or-announced-ware/`, run in GitHub Actions.

The two Depth lines were added to `profile.md` by the reaction to
[#29](https://github.com/chamaya00/background-research-agents/issues/29) and
first served by #35, which is why every `B` and `D` row below cites 35.

Two more Depth lines were added by the reaction to
[#35](https://github.com/chamaya00/background-research-agents/issues/35) and
first served by #42: `S` = `semantic-models`, `W` = `warehouse-agentic`.

| Host | Line | Status | Observed | Cited |
|---|---|---|---|---|
| `unite.ai` | A | reads | 2026-09-21 | 19, Read row |
| `mc.merill.net` | A and E | reads | 2026-09-21 and 2026-09-23 | 19, Read row; 26, Read row |
| `gethynellis.com` | A | reads | 2026-09-21 | 19, Read row |
| `pointfive.co` | A and E | reads | 2026-09-21 | 19, Read row |
| `kucoin.com` | E | reads | 2026-09-21 | 19, Read row |
| `arxiv.org` | E and B and D and S | reads | 2026-09-23, re-observed same day by #35 and by #42; re-observed 2026-09-24 by X2 | 26, Read row; 35, Read row; 42; X2 |
| `bird-bench.github.io` | E and B | reads | 2026-09-23, re-observed same day by #35 | 26, Read row; 35, Read row |
| `spider2-sql.github.io` | B | reads | 2026-09-23, re-observed same day by #42 | 35, Read row; 42 |
| `github.com` | B and D and W and A and E | reads (and `raw.githubusercontent.com` for raw files; `api.github.com` rate-limited, 403, or truncated; pull-request "Files changed" views return a shell; attached `.zip` trace archives redirect to `objects.githubusercontent.com` and return binary) | 2026-09-23, re-observed same day by #42 and by X1; re-observed 2026-09-24 by X2 | 35, Read row; 42; X1; X2 |
| `docs.getdbt.com` | D and W and S | reads | 2026-09-23, re-observed same day by #42; re-observed 2026-09-24 by X2 | 35, Read row; 42; X2 |
| `ossie.apache.org` | S | reads | 2026-09-23; re-observed 2026-09-24 by X2 | 42; X2 |
| `cloud.google.com` (blog only) | A and W | **reads the `/blog/` path; `/bigquery/docs/*` 301s to `docs.cloud.google.com`** | 2026-09-23; re-observed 2026-09-24 by X2 | X1; X2 |
| `docs.cloud.google.com` | A and W and S | reads - BigQuery and Looker release notes in full, Looker parameter references, BigQuery Graph docs, Colab release notes | 2026-09-24 | X2 |
| `docs.snowflake.com` | S and W and E | **reads; user guide full. Release notes are per-page: some return their body (2026-08-26, 2026-08-28, 2026-09-02, release 10.24, the new-features index) and some a shell (2026-04-13 four times, 2026-06-26, 2026-08-21)** | 2026-09-23; re-observed 2026-09-24 by X2 | 42; X2 |
| `docs.databricks.com` | A and W and E | reads - platform and AI/BI release notes, Genie benchmarks docs | 2026-09-24 | X2 |
| `databricks.com` | W and E | reads - blog posts in full | 2026-09-24 | X2 |
| `learn.microsoft.com` | A | reads - Power BI "What's new" | 2026-09-24 | X2 |
| `learn.hex.tech` | E and A | reads - changelog entries and Evals docs | 2026-09-24 | X2 |
| `hex.tech` | E and B | reads - blog, and the DataBench leaderboard | 2026-09-24 | X2 |
| `deepnote.com` | A | reads | 2026-09-24 | X2 |
| `cube.dev` | S | reads | 2026-09-24 | X2 |
| `sigmacomputing.com` | A | reads | 2026-09-24 | X2 |
| `docs.omni.co` | A | reads | 2026-09-24 | X2 |
| `ucbepic.github.io` | B | **reads, returns no table rows** - DataAgentBench's leaderboard renders client-side; read `docs/data/leaderboards.json` on GitHub instead | 2026-09-24 | X2 |
| `claude.com` | E | reads | 2026-09-24 | X2 |
| `basedash.com` | E and A | reads | 2026-09-24 | X2 |
| `typedef.ai` | S | reads | 2026-09-24 | X2 |
| `colrows.com` | W | reads | 2026-09-24 | X2 |
| `codecentric.de` | E | reads | 2026-09-24 | X2 |
| `pith.science` | E | reads - machine-generated preprint reviews | 2026-09-24 | X2 |
| `huggingface.co` | E | reads | 2026-09-24 | X2 |
| `venturebeat.com` | A | reads | 2026-09-24 | X2 |
| `atscale.com` | S | reads | 2026-09-24 | X2 |
| `seemoredata.io` | W | reads | 2026-09-24 | X2 |
| `encore.best` | S | reads | 2026-09-24 | X2 |
| `db.cs.washington.edu` | W | **reads, returns nothing usable** - the slide deck is a PDF the run could not render | 2026-09-24 | X2 |
| `bird-critic.github.io` | B | reads | 2026-09-23 | 35, Read row |
| `genloop.ai` | B | reads | 2026-09-23 | 35, Read row |
| `dbt-labs.github.io` | D | **reads, returns nothing usable** | 2026-09-23, re-observed same day by #42 | 35, "Reached but returned nothing usable"; 42 |
| `fivetran.com` | A and S | reads | 2026-09-23; re-observed 2026-09-24 by X2 | 26, Read row; X2 |
| `techtarget.com` | A | reads | 2026-09-23, re-observed same day; re-observed 2026-09-24 by X2 | 26, Read row; re-fetched by #32; X2 |
| `salesforce.com` | A | reads the newsroom; the Salesforce+ keynote page returns a truncated shell | 2026-09-23; re-observed 2026-09-24 by X2 | 26, Read row; X2 |
| `cxfoundation.com` | A | reads | 2026-09-23 | 26, Read row |
| `snowflake.com` | A and W and S and E | reads - newsroom, product and engineering blogs, developer guides | 2026-09-23, re-observed same day by #42; re-observed 2026-09-24 by X2 | 26, Read row; 42; X2 |
| `prnewswire.com` | E and W | reads | 2026-09-21, re-observed 2026-09-23 by #42 | 19, Read row; 42 |
| `community.fabric.microsoft.com` | A | refuses | 2026-09-21; refused again 2026-09-24 by X2 (403) | 19, Refused row; X2 |
| `powerbi.microsoft.com` | A | refuses (403) | 2026-09-24 | X2 |
| `tableau.com` | A | refuses (403) on `/products/new-features` | 2026-09-24 | X2 |
| `medium.com` | E and W | refuses (403) - three different posts, including `thumbtack-engineering` and `@prathamesh.nimkar` | 2026-09-24 | X2 |
| `web.archive.org` | E | **not fetchable by the run's fetch tool** - no archived copy could be compared | 2026-09-24 | X2 |
| `blogs.oracle.com` | B | refuses | 2026-09-23 | 42 |
| `hpcwire.com` | A | refuses | 2026-09-21 and 2026-09-23 | 19, Refused row; re-fetched by #32 |
| `openai.com` | A | refuses | 2026-09-23 | 26, Refused row |
| `blogs.mulesoft.com` | A | refuses | 2026-09-23 | 26, Refused row |
| `technologymagazine.com` | E | refuses | 2026-09-23 | 26, Refused row |
| `aimagazine.com` | E | refuses | 2026-09-23 | 26, Refused row |

A **refuses** row is not a dead entry and is the reason this list is worth
more than a bookmark folder. It says: this host has a page you want, you
cannot have it, so budget a substitute rather than discovering the 403 mid-run
for the third time. Two of #19's items rested on hosts in that half of the
table, and it cost that brief its only vendor release note.

### Refused by a session's network policy, not by the host

Separate from the table for the same reason as the section below: a different
kind of fact. On 2026-09-23 the auto-breadth exploration (`X1`) ran inside a
cloud session whose organisation network policy denied the connection before
it reached the host - the proxy's own status said `connect_rejected
(organization policy)`. The Actions runs behind #35 and #42 read several of the
same hosts the same day. **So these rows say nothing about the hosts. They say
what an auto-breadth run in that environment cannot read until the
environment's network access is widened**, and a table row reading "refuses"
for `docs.snowflake.com` or `arxiv.org` would mislead every ordinary brief.

Denied in that environment: `docs.snowflake.com`, `www.snowflake.com`,
`arxiv.org`, `export.arxiv.org`, `docs.databricks.com`, `www.databricks.com`,
`docs.cloud.google.com`, `learn.microsoft.com`, `huggingface.co`,
`api.semanticscholar.org`, `openreview.net`, `vldb.org`, `dl.acm.org`,
`medium.com`, `docs.google.com`, and a long tail of vendor, lab and news
hosts. Answered: `github.com`, `raw.githubusercontent.com`, the
`cloud.google.com` blog, and web search.

### Named but never reached

Separate from the table above, and deliberately so: every row up there traces
to a fetch somebody performed. This one traces to two searches that returned
nothing, which is a different kind of fact and must not be laundered into
looking like the same kind.

| Source | Line | Status | Last checked | Cited |
|---|---|---|---|---|
| **NIST CAISI**, AI Agent Standards Initiative | E | **not yet observed** - no confirmed publication inside the window; nothing fetched, because nothing was found to fetch | 2026-09-23 | 26, "What I searched for and did not find" |

The detail worth not re-deriving: everything either search returned dated to
February-April 2026 - the 2026-02-17 launch, an automated-benchmark-evaluation
draft that closed 2026-03-31, and Cloud Security Alliance notes through April.
Nothing between 2026-06-25 and 2026-09-23. #26 named a CAISI publication as
one of three things that would flip its recommendation, so this is a watch
item rather than a dead end.

**Read this as "this source has published nothing", not as "nobody has
looked".** A run that finds the same absence again adds a date to the Last
checked column and moves on; a run that finds a publication moves the entry
into the table above with a host and a fetched status. Either way the next run
starts from a stated result rather than from zero, which is the whole reason
the row exists.

## Per-entry detail

What each host carried when it was observed, and anything about it that a
future run would otherwise have to rediscover. Ordered as the table is.

### Serving line A - analytics for enterprise AI

- **`unite.ai`** - carried #19's item 1, the OpenAI Data agent write-up, in
  full.
- **`gethynellis.com`** - a weekly Microsoft Data & AI roundup; #19 used it as
  item 3's secondary after the primary refused. Useful specifically as a
  reachable mirror of Microsoft announcements whose own hosts block.
- **`fivetran.com`** - #26's item 2 in full: the dbt Summit announcement, its
  availability statuses and every number in it. A vendor press path that
  answers, which is rare enough in this set to be the point.
- **`techtarget.com`** - #26's item 1 substance. The one trade publisher in
  the Read half; the other three trade hosts observed all refused.
  Re-fetched by this run on 2026-09-23 and still readable, which is the only
  positive-direction re-observation in this file.
- **`salesforce.com`** - #26's item 1 context and its backward-follow
  (AIforce 2026-09-15, Agent Fabric 2025-09-25). Note the split with
  `blogs.mulesoft.com` below: the same company's newsroom answers and its
  product blog does not.
- **`cxfoundation.com`** - #26's Dreamforce context.
- **`snowflake.com`** - the Semantic View Autopilot drop, dated 2026-02-03.
  #26 fetched it and then dropped the item as seven months out of window, so
  this host is recorded as reachable on the strength of a check that did not
  produce an item. That is still an observation, and it is the cheapest kind
  to lose.
- **`community.fabric.microsoft.com`** - *refuses*, and it refused both of
  #19's rounds. It was item 3's **primary** source, and the item shipped
  assembled from a search excerpt plus the `gethynellis.com` roundup. Treat
  Fabric announcements as needing a mirror from the start.
- **`hpcwire.com`** (BigDATAwire) - *refuses*. Refused #19, refused the
  earlier session that wrote #20, and refused again when this run re-fetched
  `/bigdatawire/2026/09/11/openai-launches-data-agent-as-enterprise-analytics-race-heats-up/`
  on 2026-09-23. Three refusals across three runs and three dates: this is the
  host, not a bad run.
- **`openai.com`** - *refuses*. New refusal in #26; #19 never tested it.
  Nothing has depended on it yet - it was a lead, not a citation - but it is
  the vendor at the centre of line A's last two briefs, so the refusal is
  worth knowing before planning a round around it.
- **`blogs.mulesoft.com`** - *refuses*. Wanted for the vendor's own ROI
  framing for #26's item 1; nothing depends on it.

### Serving line E - measuring agent efficacy

- **`arxiv.org`** - #26's item 4 in full (ERPBench, the 85%/3% figure, the
  submission date). **Reached by search, not from any list**, nine days after
  publication - see "What this list is not" above. It is here so the next run
  checks it by default, and its presence must never be read as the reason the
  item was admissible.
- **`bird-bench.github.io`** - #26's item 3 in full: 82.39%, the 2026-08-22
  submission, held-out scoring, the 92.96% human baseline. The only
  independent leaderboard either brief managed to read, which makes it the
  highest-value single entry on this line.
- **`prnewswire.com`** - the Harness FinOps figures in #19's item 2, which
  #26 filed under Efficacy at 90 days in its own dropped-items table. A wire
  service carries whatever is filed to it; the `E` tag records what it has
  actually served here, not a prediction about what it will.
- **`kucoin.com`** - #19's second corroboration for the no-published-accuracy-
  benchmark point. Reached as a news-flash aggregator rather than sought out.
- **`technologymagazine.com`** - *refuses*. The trade write-up that surfaced
  #26's item 3. The item rested on the BIRD leaderboard instead, and its
  2026-09-09 reporting date came from a search index and was **not** used as
  the item's date.
- **`aimagazine.com`** - *refuses*. Same publisher, same story, same
  non-dependency.

### Serving line B - text-to-SQL and data-agent benchmarks by name

All four added by #35, the first depth round. **None of them was on this list
before that round**, which is the most useful single fact in this section: the
list was built from two breadth rounds, and every host the depth subject actually
lives on was missing from it. Commitment 2 - open search stays available - is what
let that round happen at all.

- **`spider2-sql.github.io`** - the Spider 2.0 leaderboard, and the source of
  #35's item 1. Carries all three tracks with rank, method, score and
  organisation. **It carries no dates at any point**, so it can show a standing
  and cannot show movement; #35 had to reach the top entry's 2026-03-01 date from
  the vendor's own announcement by search. Budget that if a round needs to date a
  Spider 2.0 result.

  **#42 re-fetched it and found a second limit worth recording:** it carries
  **three tracks only - Snow, DBT and Lite - and no AIFunc track**, eleven weeks
  after the benchmark's own authors published AIFunc. A track with no leaderboard
  cannot show movement even in principle, so a round asked to report on AIFunc
  should expect to establish an absence rather than read a standing.
- **`github.com`** - two repositories, both read on 2026-09-23:
  `xlang-ai/Spider2` for #35's verbatim News quotes and the benchmark's
  gold-answer release history, and `dbt-labs/dbt-llm-sl-bench` for the dbt
  benchmark harness's activity. The raw README path
  (`raw.githubusercontent.com/<org>/<repo>/main/README.md`) returned the full
  News list verbatim where the rendered repository page had summarised it - worth
  knowing, because the quotes in #35's item 1 are load-bearing.
- **`bird-critic.github.io`** - the BIRD family's harder tracks: BIRD-CRITIC's
  35.5% ceiling, the 2026 track release dates, the PostgreSQL human baseline.
  Reachable, and it is the host that shows the BIRD project disagreeing with its
  own headline leaderboard by fifty points. `bird-bench.github.io` does not carry
  that; fetch both.
- **`genloop.ai`** - a vendor blog, and the only one in this section. It carries
  the 2026-03-01 date for the Spider 2.0-Snow top submission, which the
  leaderboard itself does not carry, and the architecture description #35's item
  5 quotes. **Read it for what a top-of-board system says it does**, not for
  scores; its sibling pages are the listicles #35 dropped on substance.
- **`arxiv.org`** - re-observed. Carried five of #35's seven items. Still reached
  by search rather than by browsing the list, exactly as in #26.

  **The abstract page and the full-text page are not interchangeable**, and #35
  is where that cost something. `arxiv.org/abs/<id>` gave that run a figure it
  could only match against a leaderboard by inference; `arxiv.org/html/<id>v1`
  gave it the system's name, the leaderboard entry and the full baseline table,
  which turned the inference into a fact and supplied the correction to a figure
  two briefs had repeated. **Fetch the HTML full text before concluding that a
  paper does not say something.**

### Serving line D - dbt's semantic and context layer work

- **`docs.getdbt.com`** - **this row is a reversal and is the reason to read it.**
  The host refused the session that wrote #20, and had never been successfully
  fetched by any run; #24 quoted its benchmark figures from a search summary
  because of that. It **answered #35 on 2026-09-23** and carried the whole
  "Semantic Layer vs. Text-to-SQL: 2026 Benchmark Update" post - every figure,
  the methodology, the authors and the 2026-04-07 date. Reading it corrected the
  framing #24 had put on those figures. A refusal is a status with a date on it,
  not a property of a host, and this is the first observed case here of one
  flipping the good way.
- **`dbt-labs.github.io`** - the rendered results dashboard for
  `dbt-labs/dbt-llm-sl-bench`. **A third kind of status**, and the reason the
  Status column now has a value that is neither "reads" nor "refuses": it
  returned HTTP 200 and a navigation shell, and none of the figures the page
  exists to publish. Nothing in #35 rests on it and item 6 of that brief says so
  in its own text. The data is public and in the repository; a run that needs
  those numbers should go to `github.com` for the raw results rather than
  re-fetching this.

  **#42 re-fetched it and can now say why, which closes this.** The landing page
  returns descriptive prose and no figures; the `/compare` page returns a shell
  whose Summary, Accuracy, Latency, Cost and Tradeoffs sections every one read
  **"Loading..."**. It is an Evidence dashboard that queries a DuckDB file in the
  browser, so the figures are never in the HTML a fetch receives. **Do not
  re-fetch this host again** - the failure is architectural, not transient, and
  the one remaining route to those numbers is querying
  `results_analysis/llm_bench.duckdb` from the repository, which is a spike for an
  engineer rather than a fetch.

### Serving line S - semantic models

Added by #42, the first round on this line. Both new hosts arrived by open
search; neither was on this list.

- **`ossie.apache.org`** - the Apache Ossie (incubating) project site, formerly
  Open Semantic Interchange, and the source of #42's item 1. Its `/updates/`
  index is the changelog for the one cross-vendor semantic-model specification
  that Snowflake, Databricks, Salesforce and dbt Labs all contribute to, so it is
  the single host most likely to carry the next development on this line.
  **Read the update post rather than the home page** - the home page is a
  marketing summary and the post carries the commit counts, the contributor list
  and the explicit list of what the project has *not* decided.
- **`docs.snowflake.com`** - a different host from `snowflake.com`, and it
  behaves differently. **The user guide pages read in full**
  (`/en/user-guide/views-semantic/autopilot` carried every Power BI ingestion
  detail in #42's item 2). **The release-note pages return a navigation shell**
  and none of their own body - `/en/release-notes/2026/other/2026-08-18-semantic-views-power-bi-ingestion-ga`
  gave #42 nothing, so that item's GA date rests on the note's title and URL path
  rather than on its text. This is the same per-path split the `arxiv.org` entry
  records and the reason a per-host status column cannot capture it: **go to the
  user guide for substance and expect to date a feature from somewhere else.**
- **`arxiv.org`** - re-observed by #42, which read three full texts on this line
  (GROUND 2608.26157, and the dropped 2604.25149 and 2606.05634). #42 also
  confirmed what #35 suspected about the split: it read `/html/<id>v1` for
  substance and `/abs/<id>` **only for the submission-history line**, because the
  identifier's month and the stated submission date do not agree in this corpus
  and the date is what the window turns on. Fetch both, for different reasons.

### Serving line W - warehouse agentic features

Added by #42. Unlike line S, both hosts here were already listed.

- **`snowflake.com`** - now observed on three lines. #42 read the 2026-07-28
  Cortex AI Gateway press release and the same day's engineering blog in full,
  and both answered. **The newsroom and the engineering blog both read; the
  product blog path also reads** (`/en/blog/semantic-view-autopilot/`). This is
  the most reliable vendor host in the whole file.
- **`docs.getdbt.com`** - the release-notes page
  (`/docs/dbt-versions/dbt-cloud-release-notes`) carries **June through September
  2026 in one document**, which makes it the cheapest single fetch on this line:
  one page covers a whole 90-day window of what shipped and at what availability
  status. #42's item 5 is entirely from it.
- **`github.com`** - re-observed. #42 used `raw.githubusercontent.com` for three
  repositories (`xlang-ai/Spider2`'s README News list, `dbt-labs/dbt`'s v2
  roadmap note, `dbt-labs/dbt-llm-sl-bench`'s README) and **`api.github.com` for
  a recursive file tree**, which is the way to find out what data a repository
  actually contains without cloning it. That tree is how #42 established that
  `dbt-llm-sl-bench` publishes its results **only as binary database files** -
  there is no CSV or JSON to read, which is why that question has now failed
  twice for a reason no re-fetch will fix.
- **`prnewswire.com`** - re-observed on a second line. #42 fetched dbt Labs'
  agentic-features release in full and then dropped it as eleven months out of
  window. Recorded because a successful fetch that produces no item is still an
  observation, and this is the second time this file has recorded one.
- **`blogs.oracle.com`** - *refuses*, **403**. Wanted for Oracle's claim to top
  Spider 2.0-Lite, which would have been a dated leaderboard development. Nothing
  in #42 depends on it, and the claim remains unchecked.

### Serving both lines

- **`mc.merill.net`** - a Microsoft 365 message-centre mirror, and the only
  host observed in both briefs: RM571195 for #19 (line A) and RM569607 for
  #26, the agent-evaluations experience (line E). Reachable on both dates.

  **A host tagged to both lines does not widen any item's window.** The
  window is per Interests line, and `docs/memory/researcher.md` already
  records the rule: an item that serves two lines is filed under one of them,
  takes that line's window, and the filing decision is named along with the
  date it would fail under the other line. A two-line source tag is about
  where to look, and it has no say in what is admissible once you have looked.

## How an entry gets here, and how one goes stale

**An entry is added when a run has fetched the host and recorded the result in
its document's Read or Refused table.** Not when a run cites it, not when a
search surfaces it - `docs/memory/researcher.md`'s third lesson is exactly
this, learned when #21 found that a host it had cited as corroboration had in
fact 403'd. The "Named but never reached" section is the one exception, and it
is separate precisely so that nobody has to wonder which kind of fact they are
reading.

**A status is only as current as its Observed date**, and this file does not
pretend otherwise. A run that needs a host re-fetches it and updates the row
in the same pull request as its brief.

How much that date is worth is an open question with two data points, both
gathered by this run: `hpcwire.com` refused again two days after #19 recorded
it, and `techtarget.com` read again the same day #26 recorded it. Both
reproduced. But a 403 of this kind is returned by a CDN or WAF layer in front
of the site, configured by a vendor who changes the rules without notice, and
rate limiting produces exactly the pattern of a status that reproduces until
suddenly it does not. So treat a status as a **prior worth acting on, never a
fact** - the list exists to save a wasted round trip, not to authorise
skipping a fetch.
[`docs/research/32-curated-source-list-location-and-inlining.md`](../research/32-curated-source-list-location-and-inlining.md)
carries the evidence for both halves of that.

**Nothing here is checked on a schedule.** Automated reachability checking was
put out of scope by #32, and the substitute is that every brief re-fetches the
hosts it actually uses and amends the rows it touched. That leaves hosts
nobody has needed drifting out of date, which is the accepted cost: a stale
row on an unused host costs one wasted fetch, and the alternative is a
scheduled job nobody has decided to build.

This file is not `profile.md` and does not follow its write rule. The profile
is the driver's alone; this list is amended by the research runs that observe
the statuses in it, which is why it is a separate file rather than a sixth
section of the profile - see ADR 0004.
