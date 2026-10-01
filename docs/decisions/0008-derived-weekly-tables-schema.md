# ADR 0008: Derived weekly sit/start tables - schema, path, leakage, team totals, attribution

Date: 2026-10-01
Status: accepted

## Context

#125 needs the numbers a sit/start rationale cites, computed from the four
nflverse files #127 collects. `docs/research/123-fantasy-data-collection-and-analysis.md`
works the formulas through; the owner's answers on #123 are to commit derived
tables only, with nflverse/CC-BY 4.0 attribution and each input's SHA-256, and
nothing FTN-derived. This records what #128 built.

## Decision

**Command and output.** `node dist/nflverse-cli.js tables --season <yyyy> --week <W> --out <dir>`
writes four JSON files to `<dir>`: `usage.json`, `points-allowed.json`,
`game-environment.json`, `injuries.json`. Each is
`{attribution, inputs, season, target_week, ..., rows}`, pretty-printed with two
spaces and a trailing newline. Where the files live in the repository is the
driving session's call when it commits real output; this change commits none.

**Leakage rule.** For target week W, usage and points allowed read regular-season
rows of weeks 1..W-1 only. Rows of week W or later never contribute. W must be at
least 2.

**Team-total rule.** Team targets, team air yards and team carries for a game are
the sums over that team's rows in that `game_id` in the stats file. nflverse's
own `target_share` and `air_yards_share` are not used: its `air_yards_share`
implies a CLE week 3 air-yards total of 172 where the team's rows sum to 162.
Team snaps for a game are the maximum `offense_snaps` among that team's rows in
that `game_id`. A pooled share is Σ player / Σ team, over the games in which the
player has a stats row (a game the player was absent from does not enter the
denominator). Shares are rounded to 4 dp and are `null` when the denominator is 0.
Team-level rows with no `player_id` are skipped for usage and positional points
allowed; their targets, carries and air yards are 0, so team totals are unaffected.

**Snap join is by name.** Snap counts carry only `pfr_player_id` and a name, no
gsis id, so snaps join to stats on (`game_id`, `team`, name). Names are compared
lowercased, without punctuation and without a generational suffix, because the
files disagree ("Harold Fannin" in snaps, "Harold Fannin Jr." in stats). A
name still misses nicknames ("Kenny" / "Kenneth" Gainwell), so when it misses the
join falls back to (`game_id`, `team`, `position`, last word of the name) and uses
that only when exactly one snap row matches. A game with no match from either
join is unknown, not zero: it adds nothing to `snaps` or `team_snaps`, and is
counted in `snap_unmatched_games`. A snap row with no stats row is not listed in
the usage table.

**Tables.**

1. `usage.json` rows: `player_id`, `player`, `position`, `team`, `games`, and two
   blocks, `pooled` (weeks 1..W-1) and `last_week` (week W-1 alone, plus `week`),
   each holding `targets`, `team_targets`, `target_share`, `air_yards`,
   `team_air_yards`, `air_yards_share`, `carries`, `team_carries`, `rush_share`,
   `snaps`, `team_snaps`, `snap_share`, `snap_unmatched_games`, `receptions`, `half_ppr_points`.
2. `points-allowed.json` rows: `defense`, `position` (QB, RB, WR, TE), `games`,
   `points_allowed`, `per_game`, `rank` (1 = most allowed per game; ties share a
   rank). A defense's games are every game it appears in, so a game without a
   row at that position counts as 0.
3. `game-environment.json` rows: `game_id`, `week`, `home_team`, `away_team`,
   `spread_line`, `total_line`, `home_implied_total`, `away_implied_total`
   ((total ± spread) / 2, positive spread meaning home favored), `roof`,
   `games_read_at` (fetch time of the games file).
4. `injuries.json` rows: `team`, `gsis_id`, `player`, `report_status`,
   `practice_status`, `report_primary_injury`. One status per week, not a
   day-by-day trend; the file says so in a `note`.

**Half-PPR** is (`fantasy_points` + `fantasy_points_ppr`) / 2.

**Attribution.** Every file carries `attribution` (`source: "nflverse"`,
`license: "CC-BY 4.0"`, the project URL and a notice) and `inputs`: for each of
the four files its URL, fetch time and SHA-256, taken from #127's manifest. The
tables hold derived values only; no raw nflverse file is committed, and nothing
FTN-derived is read (the `ftn` column of `games.csv` is not kept by the schema).

`injuriesRow` gains `full_name` so the injury table can name the player.

## Amendment: play-by-play tables (#129)

A fifth input, `play_by_play`, is fetched from
`releases/download/pbp/play_by_play_<season>.csv.gz` (the tag is `pbp`; the path
`play_by_play/` returns 404). It is decompressed with `zlib.gunzipSync` at parse
time; the recorded SHA-256 is of the compressed bytes, as fetched. Only the
columns the tables read are kept by the schema. `tables` now writes six files:
the four above plus `red-zone.json` and `team-pace.json`, each with
`uses_weeks: "1..W-1"` and the same attribution and manifest (five inputs).
Regular-season plays of weeks 1..W-1 with a `posteam` only.

5. `red-zone.json` rows, one per player: `player_id`, `player`, `team` (latest),
   `rz_targets`, `team_rz_targets`, `rz_target_share`, `rz_carries`,
   `team_rz_carries`, `rz_carry_share`. A red-zone target is a play with
   `yardline_100 <= 20`, `pass = 1`, `two_point_attempt = 0` and a
   `receiver_player_id`, keyed on it; a carry is the same with `rush = 1` keyed
   on `rusher_player_id` (QB scrambles count). Team totals are the same counts
   summed over the offense (`posteam`), so a pass with no receiver is in neither
   side. Shares are rounded to 4 dp, `null` when the team total is 0.
6. `team-pace.json` rows, one per offense: `team`, `games`, `plays`,
   `plays_per_game`, `pass_rate`, `neutral_plays`, `neutral_pass_rate`,
   `pass_rate_over_expected`. **Plays** are rows with `play_type` in {pass, run},
   excluding `qb_kneel = 1` and `qb_spike = 1`; `no_play` (penalty-only), punts,
   kicks and the rest are not plays. Two-point tries carry `play_type` pass/run
   and are counted; the criteria do not exclude them. `pass_rate` is the mean of
   `pass` over plays. **Neutral** restricts those plays to `wp` between 0.2 and
   0.8 inclusive and `down` in {1, 2}; a play with no `wp` or `down` is not
   neutral. `pass_rate_over_expected` is the mean of `pass_oe` (percentage
   points, as nflverse gives it) over plays that have one. Rates are rounded to
   4 dp; `plays_per_game` to 2.

## Amendment: red-zone backtest, team flags and forward ranking (#142)

`node dist/nflverse-cli.js backtest --season <yyyy> --out <season dir> [--through <W>]`
runs the evaluation fixed by `docs/research/red-zone-backtest-plan.md`; every
definition, baseline, metric and threshold is that plan's and is not restated or
changed here. Typical use on live data: `--out data/nflverse/2026`, which writes
fold 1->2, 1-2->3 and, once week 4 is in the play-by-play, 1-3->4, with no code
change. Without `--through` the completed weeks are those, counted from week 1,
whose every game in `games.csv` has regular-season plays; a half-played week ends
the list. `--through` names the last completed week by hand (tests use it, since
the fixtures hold one team). Fewer than two completed weeks is an error.

**Files** under `--out` (each with `attribution` and the five `inputs` with SHA-256s):

- `backtest/fold-<WW>-predictions.json`: one row per scored player-week for target
  week W. Position (from `usage.json` on `player_id`), team, signals from weeks
  `< W` (`rz_targets`, `rz_carries`, three shares, `team_rz_looks_per_game`),
  `proj_looks`, `proj_targets`, `proj_carries`, the baselines `b1_proj`, `b1b_proj`,
  `b2_proj`, `b3_proj`, and week-W actuals: looks, targets, carries, touches, TDs,
  and team shares of looks, targets and carries. `seen` marks the section 6 rule;
  rows with `seen: false` count only in the sensitivity reading, where their
  actuals are 0.
- `backtest/fold-<WW>-team-flags.json`: per team, red-zone plays, pass plays, sacks
  (in the numerator), pass rate, looks, looks per game, label (`pass_first`,
  `neutral`, `run_first`, `too_few_plays`); `next_week` holds, for labelled
  pass-first and run-first teams that played W, the week-W pass rate against the
  league's pooled rate, `tendency_kept`, and `pc_share_next`.
- `backtest/summary.json`: per position, both readings (`seen_rule`,
  `sensitivity_unseen_as_zero`) with n, Spearman, MAE and top-N hit rate with a
  Wilson interval per method (pooled and per fold), the paired team-week bootstrap
  of model minus each baseline (2,000 resamples, seed 20261001), the verdict per
  baseline under each reading and `combined_verdicts` (inconclusive where they
  disagree or n < 30); excluded player-weeks per fold, position and reason; the
  recompute check (largest absolute difference from `buildRedZone`'s shares);
  and the team-flag summary with the `pc_share` verdict.
- `week-<WW>/red-zone-ranking.json`, beside the other weekly tables, for the week
  after the last completed one: `ranking.WR`, `ranking.TE` and `ranking.RB`, each the
  top 20 by `proj_looks` (red-zone look share x the team's red-zone looks per game,
  the backtest's model), ties by red-zone targets then `player_id`. Each row carries
  the counts, shares, projections, the team's flag, and `overall_target_share` with
  `b1_proj` (the B1 projection) beside it. Eligibility is the backtest's: some
  target or carry before W and a non-null share. `teams` holds every team's flag. It
  comes from the same `predictFold` as the backtest rows; if `games.csv` lists that
  week, teams not in it are left out.

**Choices the plan leaves open.** The reason an excluded player-week is counted
under is the first that applies, in the order bye, no target or carry, null share,
not seen (the sensitivity reading scores that last group, so `not_seen` is a
primary-reading reason only); `no_history` counts players with a week-W red-zone
target or carry and no stats row before W, under position `unknown`. When a fold
has fewer players at a position than N, top-N slots are the player count rather
than N, and the hit rate is hits over slots. `pc_share` counts a target as a
pass-catcher's by the position in the fold's `usage.json`; a player without
history is in the denominator only. A team's red-zone look features use the team on
that player's latest red-zone play, falling back to the usage table's team.

**Schema.** `playByPlayRow` also keeps `complete_pass`, `touchdown`, `sack` and
every `*_player_id` column (for the "seen" rule). They are optional, so a file
without them still parses.

## Consequences

- A table is reproducible from the listed inputs: same SHA-256s, same output.
- A player whose name matches neither join (or whose fallback is ambiguous) has
  that game left out of his snap share rather than counted as 0; a report can see
  how many games through `snap_unmatched_games`.
- The `rank` is among the defenses that appear in the stats file, which is 32 on
  full files and fewer on fixture slices.
