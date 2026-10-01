# Collecting NFL data and computing sit/start numbers in this repository

**Decision this serves:** which source, which runtime and which storage rule
the first engineer issue should build. The goal is that a sit/start rationale
cites numbers this repository computed from raw data, not numbers it quoted
from another site's page.

Research only. Nothing here was built, no account or key was created, and no
dependency was added. Date of every fetch: **2026-10-01**, between about 04:45
and 05:15 UTC, from the GitHub Actions runner this agent run executes on.

## Synthesis

**Recommendation: build on the nflverse data releases, in plain TypeScript,
in GitHub Actions. Commit small derived weekly tables, not the raw files.**

nflverse publishes 2026 player-week stats, snap counts, injuries with practice
status, play-by-play, depth charts and a games file with spread and total as
CSV assets on GitHub releases. This run fetched each one; all of them already
held weeks 1-3, and the injury file held week 4's practice report. From those
files alone, this run re-derived three numbers #118 had quoted for its game 1:

- Harold Fannin Jr.'s 30% week 3 target share (Sharp);
- his 86% snap share (Yahoo);
- the Browns' 18.0 implied total (CBS).

All three matched. The pages #118 cited were never needed.

**Why this approach:**

- **One host.** GitHub is the one host both runtimes reach, and nflverse
  serves everything from it (see "Where code can run").
- **Inside ADR 0001.** The work is grouping and dividing CSV rows: target
  share, snap share, opponent points allowed. That fits inside ADR 0001 with
  no new ecosystem. Python's `nflreadpy` is marked experimental by its own
  authors.
- **Reproducible.** Release assets are overwritten in place. A committed
  derived table, stamped with each input file's hash, is the only way a
  report can be re-derived later.

**Two other sources:**

- **NWS (`api.weather.gov`)** fills weather. It is public and needs no key.
- **Sleeper's undocumented stats endpoint** is the cross-check. It is the only
  free source found with red-zone targets and snap counts in one JSON row, but
  it is non-commercial only and has no documentation.

**Reported, not recommended:**

- **ESPN:** the Disney terms forbid automated access by name.
- **NFL.com:** its terms forbid systematic retrieval.
- **Pro-Football-Reference:** its terms forbid automated access and building
  databases from it.

**What it cannot cover:**

- **Route participation** is not available free in season. nflverse's
  participation data, the only free route field, is "provided after all
  post-season games are completed".
- **PFF-style grades** have no free source.
- **Same-day practice trends.** The injury file keeps one practice status per
  week, so a "DNP Wednesday, limited Thursday" trend is lost.

**Strongest argument against:** nflverse's snap counts carry
Pro-Football-Reference IDs. The likeliest reading is that they are derived
from PFR, whose terms forbid exactly that kind of database. Committing even
derived snap shares therefore inherits a question about where the data came
from that the CC-BY 4.0 licence does not settle. That decision is the
owner's, and it is asked once on #123.

## What was verified, and how

**Fetching.** Every fetch below used WebFetch from this run's Actions runner.
From that runner:

- `curl`, `gh api` and `zcat` were refused by the run's permission settings.
  No network call went through the shell, and the gzipped play-by-play file
  could not be decompressed here.
- WebFetch truncates large text bodies, but saves `application/octet-stream`
  responses to disk. That is how the full nflverse CSVs were read: GitHub
  serves release assets as octet-stream through a 302 to
  `release-assets.githubusercontent.com`, and the saved files were then
  searched with grep.

**Evidence states:**

- **Verified:** read in the fetched file or page, quotable.
- **Inferred:** reasoned from something verified; the reasoning is given.
- **Assumed:** load-bearing, neither verified nor inferred; named in the
  section "Assumptions".

**The issue's guesses, against its constraints.** The constraints are fixed:

- the stack is ADR 0001;
- terms of service are hard limits;
- the session has blocked egress.

The guesses are the candidate list and the phrase "nfldata games file". That
file now has a second, equivalent copy as the nflverse `schedules` release.
The CSV header was identical in both fetches, and the nflverse release text
says it is automated from Lee Sharpe's repository.

## Sources

Every source below was fetched in this run unless it says "not tested". The
terms are quoted from the linked page as it read on 2026-10-01.

| Source | Data offered | Format | In-season cadence | Terms: automated access, storing | This run's fetch (2026-10-01) |
|---|---|---|---|---|---|
| **nflverse-data releases** ([repo](https://github.com/nflverse/nflverse-data)) | Player-week stats incl. `targets`, `carries`, `receiving_air_yards`, `target_share`, `air_yards_share`; snap counts; injuries with practice status; play-by-play; depth charts; FTN charting; participation | CSV, CSV.GZ, Parquet assets on GitHub releases | "nightly basis after each game day" for pbp and player stats; snap counts "every day at 0, 6, 12, 18 UTC"; injuries "every day at 7AM UTC" ([schedule](https://nflreadr.nflverse.com/articles/nflverse_data_schedule.html)) | The repository page shows a **CC-BY-4.0** licence. The [nflreadpy README](https://github.com/nflverse/nflreadpy) says: "The majority of all nflverse data available ... is broadly licensed as CC-BY 4.0, and the FTN data is CC-BY-SA 4.0." No clause restricts automated download; the releases exist for it. | `.../releases/download/stats_player/stats_player_week_2026.csv`: 302 to release-assets, then 200, 1.4 MB CSV, weeks 1-3, 179 columns. `snap_counts_2026.csv`: 200, 393 KB, weeks 1-3. `injuries_2026.csv`: 200, 82.6 KB, weeks 1-4. `play_by_play_2026.csv.gz`: 200, 3.1 MB (not decompressed). `depth_charts_2026.csv`: failed, body over WebFetch's 10 MB cap. |
| **nfldata games file**, now mirrored as the nflverse `schedules` release ([DATASETS.md](https://github.com/nflverse/nfldata/blob/master/DATASETS.md)) | One row per game: `spread_line`, `total_line`, moneylines, `roof`, `temp`, `wind`, rest days, starting QBs | CSV | "updates very [sic] 5 minutes during the season" ([schedule](https://nflreadr.nflverse.com/articles/nflverse_data_schedule.html)) | DATASETS.md carries no licence statement, and it does not say where lines come from. Not found: a licence file for `nflverse/nfldata`. | `raw.githubusercontent.com/nflverse/nfldata/master/data/games.csv`: 200, but WebFetch returned only the 1999-2000 rows (truncated). `.../releases/download/schedules/games.csv`: 200, 2.1 MB. Row `2026_04_PIT_CLE` has `spread_line` -2.5, `total_line` 38.5, `roof` outdoors. |
| **Sleeper API** ([docs](https://docs.sleeper.com/)) | Documented: leagues, rosters, players, state. Undocumented: `/v1/stats/nfl/regular/<season>/<week>`, with keys `rec_tgt`, `rec_rz_tgt`, `rush_rz_att`, `off_snp`, `tm_off_snp`, `rec_air_yd` | JSON | Not documented; `season_has_scores: true` at week 4 | Docs: "free to use for **non-commercial purposes**"; "stay under 1000 API calls per minute, otherwise, you risk being IP-blocked"; no key. The stats endpoints are **not in the docs**. [Terms of use](https://support.sleeper.com/en/articles/5486620-terms-of-use) §9.2: must not "redistribute, sublicense, copy ... create derivative works based on ... the Services". | `api.sleeper.app/v1/state/nfl`: 200, JSON, `"week": 4, "season": "2026"`. `api.sleeper.app/v1/stats/nfl/regular/2026/3`: 200, JSON keyed by Sleeper player ID with the keys listed. |
| **ESPN undocumented APIs** ([Disney terms](https://disneytermsofuse.com/english/)) | Scoreboard, events, odds (DraftKings), injuries, depth charts | JSON | Live | §2.B.x forbids: "access, monitor, copy or extract the Disney Products using a robot, spider, script, or other automated means, including ... data mining or web scraping". The terms cover products "branded ... ESPN". **Forbidden: reported, not recommended.** | `site.api.espn.com/.../nfl/scoreboard?...week=4`: **403**. `site.api.espn.com/.../teams/cle/injuries`: **403**. `sports.core.api.espn.com/v2/.../weeks/4/events`: 200, 16 event refs. `.../events/401872964/competitions/401872964/odds`: 200, "Draft Kings", "PIT -2.5", overUnder 38.5. |
| **The Odds API** ([terms](https://the-odds-api.com/terms-and-conditions.html)) | Live spreads, totals and moneylines from many books; sport key `americanfootball_nfl` | JSON | Live | Terms permit "Storing our data and retaining it indefinitely" and "Calculating and displaying values you derive from our data". They forbid: "Do not resell, repackage, or redistribute our data as a standalone data product." The [home page](https://the-odds-api.com/) lists Starter at "500 credits per month". | **Not tested:** every endpoint needs an API key, and creating one is out of scope. The [v4 guide](https://the-odds-api.com/liveapi/guides/v4/) and terms pages: 200. |
| **NFL.com official injury report** ([terms](https://www.nfl.com/legal/terms/)) | Practice participation (DNP/LP/FP) per day, and game status | HTML | Wednesday-Friday in game weeks | §1.3: "Systematic retrieval of data or other content from the Services, whether to create or compile ... a collection, compilation, database, or directory, is prohibited absent our express prior written consent." **Forbidden: reported, not recommended.** | `nfl.com/injuries/league/2026/reg4`: 200. Steelers-Browns lists Dowdle "Did Not Participate", Ramsey "Limited", and others; game status blank. |
| **National Weather Service API** ([api.weather.gov](https://www.weather.gov/documentation/services-web-api)), *the candidate nobody asked for* | Hourly forecast: wind, precipitation probability, temperature | JSON (GeoJSON) | Hourly | US government work. The terms page was **not fetched in this run**; that NWS data is public domain is an inference from it being federal work, not a quote. | `api.weather.gov/points/41.5061,-81.6995` (Cleveland stadium): 200, `gridId` CLE, forecast URL `gridpoints/CLE/83,65/forecast/hourly`. |
| **Pro-Football-Reference** ([terms](https://www.sports-reference.com/termsofuse.html), [data use](https://www.sports-reference.com/data_use.html)) | Snap counts, advanced receiving | HTML | Next day | §5(i) forbids "any automated means to access or use the Site, including scripts, bots, scrapers, data miners". §5(j) forbids use "to create any database ... that competes with or constitutes a material substitute". **Forbidden: reported, not recommended.** | Terms pages: 200. Data pages: not fetched. #118 recorded a 403. |

**Discarded:**

- **ffverse `ffopportunity`** (expected fantasy points). Its
  [releases](https://github.com/ffverse/ffopportunity/releases) showed no
  2026 file. It is also someone else's model, which is quoting again by
  another route.
- **R's `nflreadr`.** It reads the same files as option C below, from a
  second foreign runtime, with nothing gained over Python.

## Freshness: can a Thursday-Sunday cycle use it?

**Yes, for everything except a Wednesday-to-Friday practice trend.**

- **Weeks 1-3 were complete.** On Thursday 2026-10-01 at about 05:00 UTC, the
  player-stats and snap-count files held week 3 complete. Week 3 ended with
  Monday night's game on 2026-09-28. Verified: Fannin's week 3 rows are in
  both files.
- **The injury file was current.** It already held week 4 practice rows
  (verified: Dowdle `Did Not Participate In Practice`, week 4). Those rows
  were identical to NFL.com's page for both Browns and Steelers.
- **It keeps one status per week.** Teven Jenkins appears once in week 4, as
  "Limited". #118 recorded him as DNP Monday, then LP Tuesday, so the file
  keeps the latest day only. Inferred from the header: there is one
  `practice_status` column and no date column.
- **The games file had Thursday's line.** It carried week 4's line before
  Thursday's game: -2.5 / 38.5, the same as ESPN's DraftKings object read the
  same morning.
- **The line moves.** The games file updates every 5 minutes, so a run
  records the time it read it.

**The cycle that follows:** Tuesday-morning build of usage tables for
completed weeks. Wednesday-Friday re-runs to read injuries. Line and
weather read on the day the report is written, with the read time recorded.

## Coverage map

Each number type #118 and #119 relied on, and the fields to compute it from.

| Number type | Computable free? | Source and fields |
|---|---|---|
| Snap share | Yes | nflverse `snap_counts_<season>.csv`: `offense_snaps`, `offense_pct`, keyed `game_id`, `player`, `pfr_player_id`, `team`. Cross-check: Sleeper `off_snp` / `tm_off_snp`. |
| Target share | Yes | nflverse `stats_player_week_<season>.csv`: `targets`, plus per-game `target_share` and `air_yards_share`. Team denominator = sum of `targets` over the team's rows in that `game_id`. |
| Carries | Yes | Same file: `carries`, `rushing_yards`, `rushing_tds`. |
| Red zone | Yes | nflverse play-by-play: rows with `yardline_100 <= 20`, using `receiver_player_id` (targets) and `rusher_player_id` (carries), `pass`, `rush` and `two_point_attempt`. Field meanings verified in the [pbp dictionary](https://raw.githubusercontent.com/nflverse/nflreadr/main/data-raw/dictionary_pbp.csv). Cross-check: Sleeper `rec_rz_tgt`, `rush_rz_att`. |
| Routes (route participation, yards per route run) | **Not available free in season** | nflverse participation has a `route` field, but it is "provided after all post-season games are completed. It does not update during the season!" ([schedule](https://nflreadr.nflverse.com/articles/nflverse_data_schedule.html)). FTN charting has no route field ([dictionary](https://nflreadr.nflverse.com/articles/dictionary_ftn_charting.html)). Snap share is the free stand-in, and it overstates tight ends who block. |
| Implied team totals | Yes | Games file: `total_line`, `spread_line`. "A positive number means the home team was favored". Home implied = (`total_line` + `spread_line`) / 2; away implied = (`total_line` − `spread_line`) / 2. |
| Injuries and practice status | Partly | nflverse `injuries_<season>.csv`: `report_status`, `practice_status`, `report_primary_injury`. **One status per week, so day-by-day trends are lost.** Day-by-day is on NFL.com, whose terms forbid systematic retrieval. |
| Defense vs position | Yes | Player-week stats: rows where `opponent_team` = the defense and `position` = the position; sum the scoring formula (see the worked example). |
| Pace and pass rate | Yes | Play-by-play: plays per game = count of `play_type` in {pass, run} by `posteam` and `game_id`; pass rate = mean of `pass`; neutral pass rate restricted by `wp` and `down`; pass rate over expected = mean of `pass_oe`. |
| Weather | Yes | Forecast: NWS hourly `windSpeed`, `probabilityOfPrecipitation`, `temperature` at the stadium's grid point, for the kickoff hour. Whether it applies: games file `roof`. After the game: `temp`, `wind`. |
| PFF-style grades | **Not available free** | No free source found. FTN charting's `is_drop`, `is_contested_ball` and `is_catchable_ball` are play-level charting, not grades, and are CC-BY-SA (share-alike). |
| D/ST rank (used by #118) | Yes, as a computed proxy | Points allowed to D/ST from player stats: `def_sacks`, `def_interceptions`, fumble recoveries, and opponent points from the games file's scores. Someone else's rank is not reproducible. |

## Where code can run

**This run (GitHub Actions) reached:**

- github.com release downloads and `release-assets.githubusercontent.com`;
- `raw.githubusercontent.com`;
- `api.sleeper.app`;
- `sports.core.api.espn.com`;
- `api.weather.gov`;
- `nfl.com`;
- `the-odds-api.com`.

**It was refused by:**

- `site.api.espn.com`: 403;
- `npmjs.com`: 403.

All of those fetches went through WebFetch. The shell's own network commands
(`curl`, `gh api`) were not allowed under this run's permissions.

**The interactive session** refused espn.com, cbssports.com and 4for4.com on
2026-09-30, per the issue, but git to github.com works. Inferred: a
collector that only reads `github.com/nflverse/nflverse-data` release assets
can run in either place. Anything using Sleeper, NWS or an odds API should
run in Actions.

**What to build:** a scheduled or label-triggered workflow step that runs
`node dist/...` with ordinary Node `fetch`. That is an engineer's workflow,
not an agent run, so this run's tool permissions do not apply to it.
Assumed: the workflow runner's own egress matches what WebFetch reached
here. WebFetch runs on the runner, but that it uses the same network path as
a `node` process is not something this run could check.

## Analysis in this repository

| | A. Plain TypeScript over CSV | B. Arquero (JS dataframe) | C. Python `nflreadpy` + Polars | D. DuckDB via `@duckdb/node-api` |
|---|---|---|---|---|
| **What it is** | Fetch the CSV (Node `fetch`, `zlib` for `.gz`), parse rows into zod-validated records, group and divide in functions with vitest tests | [Arquero](https://github.com/uwdata/arquero), a BSD-3 library for "query processing and transformation of array-backed data tables", Node 18+ | The [nflverse Python port](https://github.com/nflverse/nflreadpy), MIT, Polars-based | SQL directly over CSV/Parquet through a native binding ([duckdb-node-neo](https://github.com/duckdb/duckdb-node-neo), MIT, prebuilt linux-x64) |
| **Inside ADR 0001?** | Yes | Yes: an npm package | **No**: first Python dependency | Same language, but a **native binary** |
| **ADR needed** | **None for the stack.** One ADR for the derived-table schema (a new data shape, per house rules). A CSV parser such as `csv-parse` stays within npm and needs only a PR-body reason. | Schema ADR only. Arquero is a version-level choice within npm. | New-ecosystem ADR covering: second runtime in CI, `ci / checks` gaining Python lint/test, Python-to-TS hand-off format, and the owner's sign-off. | ADR for a native dependency: platform binaries, a failed install breaking `npm ci`, and SQL as a second language for logic to be tested. |
| **What it costs** | The most code: about a dozen grouping functions. CSV quoting (the `headshot_url` field contains commas inside quotes, verified) must be handled; hand-splitting on commas will be wrong. | Less code; a dependency to learn. **Its README lists no CSV or Parquet loader**, so a CSV parser is still needed. | Least analysis code, but two CI toolchains. The README marks it "Lifecycle: experimental" and says "Most of the first version was written by Claude based on nflreadr, use at your own risk." | Least code for joins; heaviest install. |
| **What it rules out later** | Nothing; any of B-D can be added on top. | Little. | Makes TypeScript the second language for this feature. | Ties the build to DuckDB's binary support. |
| **Where it runs** | Actions; in the session too, if it reads only github.com | Same as A | Actions only, unless the session can install from PyPI (not tested) | Actions; npm install in the session not tested (npmjs.com returned 403 to this run's WebFetch) |
| **Right pick if** | Data stays at a few MB a week and the formulas are the ones in this document | The formula count grows past what hand-written grouping keeps readable | Most of the value were in nflverse-only helpers (e.g. `load_ff_opportunity`) rather than our own formulas | Play-by-play aggregation becomes the bulk of the work and is slow in JS |

**Recommended: A, with B allowed later.** Inferred from sizes: 3 weeks of
player stats is 1.4 MB, so about 8 MB for a season; play-by-play is 3.1 MB
gzipped for 3 weeks. That is small enough that a plain loop over rows is not
the bottleneck. Every formula in the worked example is a filter, a sum and a
divide.

## Storage and reproducibility

**Recommended: fetch raw files on every run, and commit only derived weekly
tables, each stamped with what made it.**

Size is not the constraint. GitHub warns at 50 MiB, "blocks files larger
than 100 MiB" and recommends repositories "ideally less than 1 GB" ([GitHub
docs](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github)).
The constraints are these:

- **Release assets are not pinned.** The release text says they update
  automatically, and the download URL is the same for every version: one
  path per file, redirecting to a fresh signed blob. Inferred: a URL cannot
  pin a version. Re-deriving a report later needs either the raw file
  committed, or a derived table plus the SHA-256 and fetch time of each
  input. The second keeps the repository small and still lets a reader see
  that the input changed.
- **The guard.** This repository's caller, `.github/workflows/guard.yml`,
  enforces memory caps and protected paths and names no size limit. The
  reusable workflow it calls (`project-guard.yml@v1.39.0`) was not read in
  this run.
- **Licences.** CC-BY 4.0 requires attribution, so each derived table carries
  a header line naming nflverse and the licence. FTN charting is CC-BY-SA, so
  a table built from it would have to carry that share-alike licence too.
  Recommended: do not commit FTN-derived tables.
- **Third-party rows in git are the owner's decision.** Committing anything
  derived from third-party data puts it into git history permanently, which
  is why it is asked on #123 rather than assumed.

## What a sit/start rationale becomes: worked example

**Player:** Harold Fannin Jr., TE, Cleveland. nflverse `player_id`
`00-0040663`; snap file `pfr_player_id` `FannHa00`.

**Game:** #118's game 1, Steelers at Browns, week 4. `game_id`
`2026_04_PIT_CLE`, Thursday 2026-10-01.

**Window:** weeks 1-3 of 2026, regular season (`season_type` = `REG`). Half-PPR
scoring, as #118 states.

Every value below was computed in this run from the files named, except
where a row says otherwise.

| Input | Formula over named fields | Source file | Value |
|---|---|---|---|
| Targets | Σ `targets` where `player_id` = 00-0040663, `week` in 1..3 | `stats_player_week_2026.csv` | 3 + 6 + 9 = **18** |
| Team targets | For each of his `game_id`s: Σ `targets` over rows with `team` = CLE in that `game_id`. Here checked as `targets` / `target_share`: 3/0.1364, 6/0.2, 9/0.3. | same | 22 + 30 + 30 = **82** |
| **Target share, wks 1-3** | Σ targets / Σ team targets (pooled, not a mean of weekly shares) | same | 18/82 = **22.0%**; weekly 13.6%, 20.0%, **30.0%** (wk 3 matches #118's Sharp figure) |
| **Air-yards share, wks 1-3** | Σ `receiving_air_yards` / Σ team air yards. Team air yards = Σ `receiving_air_yards` over CLE rows in the game (checked here as `receiving_air_yards` / `air_yards_share`). | same | 109 / (228 + 108 + 172) = **21.5%** |
| **Snap share, wks 1-3** | Σ `offense_snaps` / Σ team offensive snaps. Team snaps = max `offense_snaps` among CLE rows in that `game_id` (the QB or a lineman at `offense_pct` = 1). | `snap_counts_2026.csv` | Player 42 + 50 + 60 = 152. Weekly `offense_pct` 0.82, 0.86, **0.86** (wk 3 matches #118's Yahoo figure). Wk 3 team snaps 70 (Austin Barber, 70, 1.0); pooled ≈ **85%** (inferred: wk 1-2 team totals from `offense_snaps`/`offense_pct`). |
| **Red-zone targets, wks 1-3** | Count of rows where `receiver_player_id` = 00-0040663, `yardline_100` ≤ 20, `pass` = 1, `two_point_attempt` = 0, `week` in 1..3. Divide by the same count with `posteam` = CLE. | `play_by_play_2026.csv.gz` | **Not computed:** the file was fetched (3.1 MB) but could not be decompressed in this run. |
| **Opponent points allowed to TE, wks 1-3** | For each `game_id` where `opponent_team` = PIT, `position` = TE: Σ half-PPR points, where half-PPR = 0.1·(`receiving_yards` + `rushing_yards`) + 6·(`receiving_tds` + `rushing_tds`) + 0.5·`receptions` + 2·(`receiving_2pt_conversions` + `rushing_2pt_conversions`) − 2·(`receiving_fumbles_lost` + `rushing_fumbles_lost`). Equals (`fantasy_points` + `fantasy_points_ppr`)/2 (checked on Gesicki: (9.7 + 12.7)/2 = 11.2). Then mean per game; rank among 32 defenses. | `stats_player_week_2026.csv` | Wk 1 vs ATL: Pitts 0 rec on 1 target, Muse 0 → 0.0. Wk 2 vs NE: Henry 3-40 → 5.5, Raridon 1-30 → 3.5, Latu 0 → 9.0. Wk 3 vs CIN: Gesicki 3-37-1 → 11.2, Hudson 2-13 → 2.3, Sample 1-0 → 0.5 → 14.0. **Mean 7.7 per game.** The league rank was not computed in this run. |
| **Implied team total** | CLE is home: (`total_line` + `spread_line`) / 2. Record the fetch time, since the line updates every 5 minutes. | `games.csv` (`schedules` release), row `2026_04_PIT_CLE` | (38.5 + (−2.5)) / 2 = **18.0**; PIT 20.5. Matches #118's CBS-derived figures. |
| **Injury / practice status** | Row where `gsis_id` = 00-0040663, `team` = CLE, `week` = 4; absent means not listed | `injuries_2026.csv` | **No row:** not on the week 4 report. Six other Browns are. |
| **Weather** | `roof` from the games file. If outdoors: NWS hourly forecast period containing kickoff (`gameday` + `gametime`, ET) → `windSpeed`, `probabilityOfPrecipitation` | `games.csv`, `api.weather.gov/gridpoints/CLE/83,65/forecast/hourly` | `roof` = outdoors; forecast **not read** in this run (the points lookup was). |
| His own scoring, for context | Same half-PPR formula, by week | `stats_player_week_2026.csv` | 3.1, 7.9, 20.6 |

**The rationale, rewritten from computed numbers.** Start, as a TE1-range
floor with a ceiling only if week 3's usage holds:

- **Pooled usage is moderate:** 22.0% target share and 21.5% air-yards share
  over weeks 1-3.
- **Week 3 was a spike:** 30.0% of targets and 86% of snaps.
- **The scoring setting is the slate's lowest:** an 18.0 implied team total.
- **Pittsburgh has allowed 7.7 half-PPR points a game to tight ends.**

A reader can disagree with every number and re-run each one.

**What an engineer builds from this:**

- each row above becomes one function plus one test, fixed by a snippet of
  the real CSV;
- this document's values are the expected outputs;
- red zone, the league rank and the weather read are the three not yet
  computed.

## Searched for and not found

- **A licence file for `nflverse/nfldata`.** The repository page and DATASETS.md were
  read and neither states one. The raw README fetch returned nothing usable.
- **Where `spread_line` and `total_line` come from.** DATASETS.md does not
  say. ESPN's DraftKings object agreed on this one game.
- **An in-season source of route participation.** The searches covered
  nflverse participation, FTN charting and Sleeper keys; none has one in
  season.
- **A statement from nflverse that PFR permits the snap-count build.** The
  [nflverse-pfr](https://github.com/nflverse/nflverse-pfr) page says only
  "builds pfr data for nflverse/nflverse-data".
- **Reports of nflverse 2026 releases going stale in season.** One search
  found other projects wiring the same releases, e.g.
  [Endzone-Empire #1638](https://github.com/andydarknessb/Endzone-Empire/issues/1638)
  and [going-deep #115](https://github.com/CommonFox/going-deep/issues/115),
  not outages. The one break found is
  [nflfastR v6.0.0](https://github.com/nflverse/nflfastR/releases), which
  moved raw play-by-play to `nflverse/nflverse-pbp`: "previous nflfastR
  versions won't be able to download 2026+ seasons". It breaks the R client,
  not the release files.
- **Arquero's version, and the npm pages for it and DuckDB.** npmjs.com
  returned 403.

## Assumptions

- **The runner's network.** A `node` process in an Actions step reaches the
  same hosts WebFetch reached in this run.
- **Fetching nflverse is not scraping.** Reading nflverse's own release
  assets is not automated access to PFR or NFL.com. Inferred: nflverse
  publishes the files for download. Assumed: that nflverse's licence covers
  derived use of the PFR-origin snap counts. This is the one assumption the
  owner is asked about.
- **The season's size.** A full season of player stats stays under about
  10 MB. Inferred by scaling 1.4 MB for 3 weeks.

## Recommendation, the argument against it, and what would flip it

**Build the collector and the derived tables in plain TypeScript (option A),
run them in GitHub Actions, and read the nflverse release assets as the
primary source:**

| Use | Source |
|---|---|
| Primary data | nflverse release assets: player stats, snap counts, injuries, schedules, play-by-play |
| Forecast | NWS |
| Cross-check only, never committed | Sleeper's stats endpoint |

**Storage:** fetch raw files per run, and commit derived weekly tables with
input hashes and CC-BY attribution. Every rationale then cites a computed
field and a formula, as in the worked example.

**The strongest argument against it, from looking rather than imagining:**
nflverse's snap counts carry Pro-Football-Reference keys (`pfr_game_id`,
`pfr_player_id`, verified in the header). The repository that builds them is
named "builds pfr data". Sports-Reference's terms forbid automated access and
any "database ... that competes with or constitutes a material substitute".
So the one input #118 found hardest to get may arrive already downstream of a
use PFR's terms prohibit. A CC-BY label on the nflverse repository does not
license what nflverse may not have had the right to license.

**The answer flips if:**

- **PFR is the snap source.** If the owner treats a PFR origin as
  disqualifying, snap share moves to Sleeper's `off_snp` / `tm_off_snp`. That
  keeps the plan but makes a non-commercial, undocumented endpoint
  load-bearing. If Sleeper is unacceptable too, snap share leaves the
  rationale and target share carries usage alone.
- **nflverse stops publishing in season.** If a week's files have not
  appeared by Tuesday 12:00 UTC on two weeks, the primary source becomes the
  cross-check and the plan needs a paid feed, which is the owner's call.
- **Route participation becomes required.** If the owner decides route
  participation is required rather than wanted, no free option here
  qualifies.

## Proposed follow-up issues (not filed)

**1. Engineer: fetch nflverse weekly files into a typed, hashed input set.**
*Role:* `role:engineer`. *Depends on:* the owner's answer on #123.

- Given a season and week, when the collector runs, then it downloads
  `stats_player_week_<season>.csv`, `snap_counts_<season>.csv`,
  `injuries_<season>.csv` and `games.csv` from
  `github.com/nflverse/nflverse-data/releases/download/...`. It records each
  file's URL, fetch time (UTC) and SHA-256. Check: a test with recorded
  fixtures asserts all four records.
- Given a row whose quoted field contains a comma (`headshot_url`), when
  parsed, then the column count equals the header's. Check: a vitest case
  using a real row.
- Given a fetch that returns non-200, then the run fails naming the file.
  Check: a test with a stubbed 404.
- Given the change, then `ci / checks` is green and no file outside `src/`,
  `tests/` and one new workflow is touched. Check:
  `git diff --name-only`.

**2. Engineer: the derived weekly tables and the formulas in this document.**
*Role:* `role:engineer`. *Depends on:* 1, and an ADR for the table schema in
the same pull request.

- Given the fixture slice for CLE weeks 1-3, when the usage table is built,
  then Fannin's pooled target share is 18/82 and his air-yards share is
  109/508. Check: a vitest assertion to 4 decimal places.
- Given the fixture slice of TE rows against PIT, when points allowed is
  computed, then the result is 0.0, 9.0 and 14.0 by week and 7.67 per game.
  Check: a vitest assertion.
- Given `games.csv` row `2026_04_PIT_CLE`, then implied totals are CLE 18.0
  and PIT 20.5. Check: a vitest assertion.
- Given a built table, then its header names nflverse, CC-BY 4.0, and each
  input's SHA-256. Check: a test reading the first lines.
- Given the pull request, then `docs/decisions/` has a new ADR for the table
  schema. Check: `git diff --name-only`.

**3. Engineer: red zone, pace and pass rate from play-by-play.**
*Role:* `role:engineer`. *Depends on:* 2.

- Given `play_by_play_<season>.csv.gz`, when red-zone targets are computed,
  then the filter is `yardline_100 <= 20`, `pass = 1`,
  `two_point_attempt = 0`. Check: a fixture test with one play inside and one
  play outside the 20.
- Given a team-game, then plays per game counts `play_type` in {pass, run}
  only. Check: a fixture test with a kneel and a penalty row that must be
  excluded.

**4. Researcher: re-run one week 5 game's sit/start from computed tables
only.** *Role:* `role:researcher`. *Depends on:* 2 merged.

- Given the finished document, then every number in one game section cites
  a derived-table file and a column, not an external page. Check: grep the
  section for `http`; only nflverse, NWS and games-file links appear.
- Given the document, then it lists every call where the computed number
  disagreed with what a public site published the same week. Check: the
  section exists and names the site.

## Owner decisions, asked on #123

Asked once on the issue, with `agent-factory:needs-input`. This document
proceeds under the recommended answers:

1. **Committing derived tables built from third-party data** (nflverse,
   CC-BY 4.0, with snap counts that appear to originate at PFR). Recommended:
   **yes, derived weekly tables only, with attribution and input hashes. No
   raw files, and nothing FTN-derived.**
2. **A new language ecosystem (Python).** Recommended: **no.** Stay inside
   ADR 0001 with option A.
3. **A paid feed for route participation.** Recommended: **no**, for now.
   Use snap share as the stand-in and say so on every tight-end call.
