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

Columns: **Line** is which of `profile.md`'s two Interests lines the host has
actually been observed serving - `A` = "Analytics for enterprise AI, broadly",
`E` = "Measuring agent efficacy in an enterprise setting". **Status** is
reachability as observed by an actual fetch, never inferred from a citation.
**Cited** names the document and which of its two tables the row came from:
`19` = `docs/research/19-analytics-for-enterprise-ai-brief-2026-09-21.md`,
`26` = `docs/research/26-analytics-and-agent-efficacy-brief-2026-09-23.md`.

| Host | Line | Status | Observed | Cited |
|---|---|---|---|---|
| `unite.ai` | A | reads | 2026-09-21 | 19, Read row |
| `mc.merill.net` | A and E | reads | 2026-09-21 and 2026-09-23 | 19, Read row; 26, Read row |
| `gethynellis.com` | A | reads | 2026-09-21 | 19, Read row |
| `pointfive.co` | A and E | reads | 2026-09-21 | 19, Read row |
| `prnewswire.com` | E | reads | 2026-09-21 | 19, Read row |
| `kucoin.com` | E | reads | 2026-09-21 | 19, Read row |
| `arxiv.org` | E | reads | 2026-09-23 | 26, Read row |
| `bird-bench.github.io` | E | reads | 2026-09-23 | 26, Read row |
| `fivetran.com` | A | reads | 2026-09-23 | 26, Read row |
| `techtarget.com` | A | reads | 2026-09-23, re-observed same day | 26, Read row; re-fetched by #32 |
| `salesforce.com` | A | reads | 2026-09-23 | 26, Read row |
| `cxfoundation.com` | A | reads | 2026-09-23 | 26, Read row |
| `snowflake.com` | A | reads | 2026-09-23 | 26, Read row |
| `community.fabric.microsoft.com` | A | refuses | 2026-09-21 | 19, Refused row |
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
