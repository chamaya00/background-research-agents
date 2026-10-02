# xfp v1-v4 backtest on 2025: evaluation plan

Issue #170, parent #169. **Committed before any 2025 outcome is computed.**
Written from [`red-zone-backtest-plan.md`](red-zone-backtest-plan.md) and its
[2025 addendum](red-zone-backtest-plan-2025-addendum.md) (the pre-registration
pattern, the "seen" and sensitivity readings, the multiplicity count),
`src/backtest-stats.ts`, `src/redzone-backtest.ts`, `src/nflverse-xfp.ts` and
the body of #169. **No 2025 week-W outcome was computed or read to write it.**

**Decision served.** Which of four expected-points projections (v1, v2, v3, v4),
if any, is worth quoting over the plain yardstick of a player's own points per
game so far, from which week of the season, and for which position. If a model
does not beat that yardstick, the `xfp` command should stop presenting it as an
improvement.

**Unit of observation: a player-week** (a player's week-W fantasy points against
five projections of them). **Unit of resampling: a team-week** (all of a team's
scored players in one fold, since they share a game and a play-caller).

## 1. Projections

For each fold W, call `buildXfp(rows, 2025, W, prior)` (WR, TE, RB) and
`buildQb(rows, 2025, W, prior)` (QB), `rows` being 2025 and `prior` being
2024 (`collectInputs(2024)`). These are the code paths the `xfp` command prints;
the backtest must not re-implement them. The week-W number of each method is:

| Method | WR / TE / RB (`ModelPlayer`) | QB (`QbPlayer`) |
|---|---|---|
| **v1** | `xfp_per_game` | `v1` |
| **v2** | `v2.next` | `v2.next` |
| **v3** | `v3` | `v3` |
| **v4** | `v4.next` | `v4.next` |
| **Baseline** (actual points per game before W) | `actual_per_game` | `actual_per_start` |

All values are points per game (QB: per start, over his started games only,
as `buildQb` defines it). `v2.next` and `v4.next` are null only on a bye,
which section 3 excludes, so every scored player-week has all five numbers. No
shrinkage, window, or constant is changed here (`ADJUST_K = 100`, bucket
definitions, `XFP_MIN_GAMES` as in `src/nflverse-xfp.ts`).

**Scoring, quoted by value.** WR / TE / RB are **half-PPR**: 0.5 per reception,
0.1 per receiving yard, 0.1 per rushing yard, 6 per receiving or rushing TD
scored by the player (`extractLooks`); two-point tries, kneels and spikes are
excluded, fumbles lost are not scored. QB uses the **#162 settings**
(`extractQbLooks`): 0.04 per passing yard, 4 per passing TD, -2 per
interception (a pick-six costs only the -2), 0.1 per rushing yard (scrambles
included), 6 per rushing TD, -2 per fumble lost by the QB, 0 for a sack apart
from a lost fumble; two-point tries, kneels and spikes excluded.

**Outcome (`actual`).** The player's week-W points: the sum of the same
per-play scoring above over his week-W plays, from week-W play-by-play only
(the engineer adds a week-window argument to the extractor; the scoring rules
do not change). The baseline and the outcome therefore use one scoring system.

## 2. Season and folds

- **Season 2025, regular season. 16 expanding-window folds, W = 2..17**: fold W
  projects from weeks `< W` and is scored on week W.
- **Week 18 is excluded.** Teams that have clinched rest starters in week 18,
  which breaks the premise that past usage projects week-W usage. A reason from
  the calendar, fixed before any 2025 outcome is read.
- **Prior season for v3 and v4: 2024, the full regular season (weeks 1-18)**,
  as `PREV_SEASON_LAST_WEEK = 18` fixes.
- 2025 is not pooled with any other season.

## 3. Eligibility

Each rule is a statement a test can check. Position is the position in the
stats rows before W (`buildUsage` for WR/TE/RB; `qbIdsOf` for QB), never names.

1. **Bye.** A player whose most recent team has no week-W game
   (`opponentOf(rows, 2025, W, team) === null`) is excluded, not scored 0.
2. **Minimum games before W: 1.** A WR/TE/RB needs `games >= 1` and a QB needs
   `starts >= 1` (a started game, section 3.4) before W; below that the
   baseline is undefined. This is looser than the ranking threshold the command
   prints (`XFP_MIN_GAMES = QB_MIN_STARTS = 2`) so that fold W = 2 is populated;
   thin early weeks are visible per week and are the point of the over-time
   question. A player below the command's threshold of 2 is flagged in the
   output (`thin = true`) and is not treated differently.
3. **Non-playing WR / TE / RB** (decided from week-W play-by-play only, no snap
   counts, as in the red-zone plan, section 6). A player on a non-bye team is
   **seen** if his `player_id` appears in any receiver, rusher, passer or other
   `*_player_id` column of any week-W row (the `SEEN_ID_COLUMNS` of
   `src/redzone-backtest.ts`, plus receiver and rusher). Main reading: unseen
   players are **excluded as not having played**. Known bias, stated in advance:
   a player on the field who got no target or carry is not seen either, and
   those are exactly the misses (projection positive, actual 0), so the main
   reading flatters every model.
4. **QBs count only as starters.** The week-W starter of a team is the passer
   with the most `qb_dropback = 1` plays in that team's week-W game, ties broken
   by `player_id` ascending (the rule of `gameStarters` / `latestStarter`). Main
   reading: the scored QB of a non-bye team is its week-W starter, if he meets
   rule 2. A QB who is not the week-W starter is not scored; a team whose
   week-W starter has no earlier start contributes no QB.
5. **In-game injury exits.** No player is prorated, imputed or dropped for
   leaving a game early. A player who appears in week-W play-by-play is scored
   on the points he actually scored (a seen WR/TE/RB with zero looks scores 0).
   A QB who leaves the game is the starter only if he had the most dropbacks;
   otherwise rule 4 excludes him and the relief QB, who has no start history
   by rule 2 unless he started earlier, enters instead. The write-up reports
   the number of QB-weeks where the starter had fewer than 15 dropbacks, as a
   count only.
6. **Team.** A player belongs to his most recent team before W; his
   opponent, and the passer factor's starter, are that team's.
7. **Exclusion counts.** The write-up reports excluded player-weeks per week
   and position by reason: `bye`, `not_seen`, `not_starter`, `min_games`,
   `no_history`.

**Two readings, which differ in one stated way: who is scored when someone did
not play.**

- **Main ("played") reading:** rules 1-6 exactly as above.
- **Sensitivity reading ("did not play scores 0"):** every player meeting
  rules 1, 2 and 6 on a non-bye team is scored, with an unseen WR/TE/RB scoring
  **0 actual points**. For QBs the scored player is the team's
  `latest_starter` (`latestStarter`, the QB the next-game projection assumes)
  if he meets rule 2, with his own week-W points, which are **0 if he did not
  play**; the week-W starter is otherwise ignored.

**"The two readings agree"** for a cell means the cell's verdict (section 6) is
the same under both. Where they differ, the combined verdict is
**inconclusive** (`combine` in `src/backtest-stats.ts`). Only a verdict that is
the same under both stands. Both readings' underlying numbers are reported.

## 4. Metrics

Per **week** (16), **position** (QB, RB, WR, TE), **method** (v1, v2, v3, v4,
baseline) and reading, with `err = projection - actual`:

1. **MAE** = mean |err|. 2. **RMSE** = sqrt(mean err^2).
3. **Mean bias** = mean err (positive: the method over-projects).
4. **Spearman** rank correlation of projection vs actual over the week's
   player-weeks, average ranks for ties (`spearman`); null when either side is
   constant.
5. **Top-N hit rate**, N by value: **QB 12, RB 24, WR 24, TE 12.** These are
   the starter counts of a 12-team league (one QB, two RB, two WR, one TE per
   team), fixed here with that reason, before outcomes. Per week and position,
   the N highest projections (ties broken by `player_id` ascending) are
   compared with the actual top N (ties at the Nth actual value all count as
   in): `topNHits`. A week with fewer than N scored players uses the count it
   has as its slots. Hit rate = hits / slots, with a 95% Wilson interval.

The same five statistics are reported **per block** and **pooled over all 16
folds**, computed over the pooled player-weeks of the scope for MAE, RMSE, bias
and Spearman (hits and slots are summed for top-N). Per-week numbers are
reported and are never individually decisive.

## 5. Over time

**Blocks:** W = **2-5, 6-9, 10-13, 14-17**, four contiguous non-overlapping
blocks of four folds (`BLOCK_STARTS` in `src/backtest-stats.ts`). Metrics are
reported per week and per block.

**Trend test.** For each method, position and reading, take the 16 weekly
values of a statistic (Spearman; MAE) over W = 2..17.
- **Statistic:** Kendall's tau between week W and the weekly value, over weeks
  with a non-null value.
- **Test:** a permutation test, 10,000 permutations of the weekly values across
  weeks, seed 20261001, **two-sided p < 0.05**.
- **"Improves":** tau > 0 for Spearman, tau < 0 for MAE, with p < 0.05. The
  opposite sign with p < 0.05 is "worsens"; otherwise "no trend". Fewer than 12
  non-null weeks is "no trend".
- Trend is determined per reading; the combined determination is "improves" /
  "worsens" only if both readings give it, else "no trend". The baseline is
  tested too, so a trend in a model can be read against a trend in the
  yardstick.

**"v3/v4 beat v1/v2 early and lose the edge later"** is read only from block
verdicts (section 6), for each position and each verdict family, on the two
pairs that differ in the value source alone: **v3 vs v1** and **v4 vs v2**.
Per pair:
- **Edge fades:** block 1's combined verdict is "beats" and block 4's is not.
- **Edge fades and reverses:** as above and block 4's is "loses".
- **Edge persists:** blocks 1 and 4 are both "beats".
- **No early edge:** block 1's is not "beats".
Blocks 2 and 3 are reported alongside and do not change the label. 16 such
readings (2 pairs x 4 positions x 2 families) are derived from the verdicts and
add no verdicts. v3/v4 are said to have the pattern for a position only if
both pairs, in the same family, read "edge fades" or "edge fades and reverses".

## 6. Verdict rule and comparisons

**Comparisons (model vs baseline), 8:** v1 vs baseline, v2 vs baseline, v3 vs
baseline, v4 vs baseline, v2 vs v1, v3 vs v1, v4 vs v3, v4 vs v2.

**Bootstrap.** The paired team-week bootstrap of `pairedBootstrap` in
`src/backtest-stats.ts`: **2,000 resamples, seed 20261001**, resampling
team-weeks (`fold|team`) within one position and scope (a block, or all 16
folds), model minus baseline, 95% percentile interval on the Spearman
difference and on the MAE difference. Unchanged from the precedent.

**Two verdict families**, because the person asked two questions:

- **Ranking family (primary Spearman).** Exactly `verdict()` in
  `src/backtest-stats.ts`: **beats** if the Spearman-difference interval is
  entirely above 0, the MAE-difference interval is not entirely above 0, and
  the baseline's top-N Wilson interval is not entirely above the model's;
  **loses** is the mirror image; otherwise **inconclusive**.
- **Accuracy family (primary MAE).** **beats** if the MAE-difference interval
  (model minus baseline) lies entirely below 0; **loses** if entirely above 0;
  otherwise **inconclusive**. Spearman and top-N do not enter. (The engineer
  adds this one function next to `verdict`.)

An edge that sits inside the interval is inconclusive, however large the point
estimate. **A cell with fewer than 30 scored player-weeks** (`MIN_SCORED`) for
that position, scope and reading is inconclusive. The cell's verdict in each
family is the combine of the two readings (section 3).

**Cells.** 8 comparisons x 4 positions x 5 scopes (4 blocks + pooled all 16
folds) x 2 families. The pooled-over-16 verdicts are the season headline; block
verdicts carry the over-time question. For the "which projection, from which
week" answer, per position, family and comparison against the baseline, the
**settling week** is `settlingWeek` over the four block verdicts (2, 6, 10, 14
or "none"); derived, adds no verdicts.

## 7. Multiplicity

The run produces **360 verdicts**:

- **320 head-to-head:** 8 comparisons x 4 positions x 5 scopes x 2 families
  (each is the combine of its two readings, counted once);
- **40 trend determinations:** 5 methods (v1-v4 and the baseline) x 4
  positions x 2 statistics (Spearman, MAE), each combined across readings.

Settling weeks, edge readings and exclusion counts are derived and add none.
**No correction for multiple comparisons is applied.** At 95% a handful of wins
among 360 is within what chance produces. **The write-up must print "of 360
verdicts" beside every win ("beats" or "improves") it reports,** and state how
many of the 360 were wins.

## 8. No leakage

For week W, every league value, bucket value, shrinkage factor, defense factor,
passer factor, the baseline and the starter uses **only regular-season weeks
`< W` of 2025, and for v3 and v4 additionally the full 2024 regular season
(weeks 1-18)**. The one thing read from week W is the schedule (the opponent,
`opponentOf`), as in the command, and the outcome, which is read only after
the five projections are fixed.

**Required test (vitest, fixtures, no network),
`xfp backtest does not leak week W`:** build a fixture season with weeks 1..W+1;
compute all five numbers (v1, v2, v3, v4, baseline, for WR/TE/RB and QB) for
week W from a copy of the data truncated to weeks `< W` plus the week-W
schedule, and again from the full data; the two must be identical for every
player. A second assertion changes week-W and week-(W+1) play and stat rows
arbitrarily and requires every projection to be unchanged.

## 9. Output schema

Committed by the driver under `data/nflverse/2025/xfp-backtest/`, **derived
only: no raw play-by-play, no names (player_id only)**, with the nflverse CC-BY
4.0 attribution and input hashes as in the precedent `summary.json`. The
engineer builds to this list; JSON arrays of objects with these keys.

| File | One row per | Columns |
|---|---|---|
| `fold-WW-player-weeks.json` (WW = 02..17) | player-week scored under either reading | `season, week, player_id, position, team, opponent, prior_games (QB: prior_starts), thin, seen, week_starter, latest_starter, in_main, in_sensitivity, actual, baseline, v1, v2, v3, v4` |
| `exclusions.json` | week, position, reason | `week, position, reason, count` (reasons of section 3.7) |
| `weekly-metrics.json` | reading, week, position, method | `reading, week, position, method, n, mae, rmse, bias, spearman, top_n, hits, slots` |
| `block-metrics.json` | reading, scope (`block-1`..`block-4`, `pooled`), position, method | `reading, scope, position, method, n, mae, rmse, bias, spearman, top_n, hits, slots, hit_rate, wilson_lo, wilson_hi` |
| `verdicts.json` | head-to-head cell (320) | `family, model, baseline, position, scope, n_main, n_sensitivity, verdict_main, verdict_sensitivity, verdict_combined, spearman_diff_lo_main, spearman_diff_hi_main, spearman_diff_lo_sens, spearman_diff_hi_sens, mae_diff_lo_main, mae_diff_hi_main, mae_diff_lo_sens, mae_diff_hi_sens` |
| `trend.json` | method, position, statistic (40) | `method, position, statistic, tau_main, p_main, trend_main, tau_sens, p_sens, trend_sens, trend_combined, weeks_main, weeks_sens` |
| `settling-and-edge.json` | position, family, comparison | `position, family, comparison, block1..block4 (combined verdicts), settling_week` for each comparison against the baseline; and `position, family, pair (v3_vs_v1, v4_vs_v2), block1..block4, edge` |
| `summary.json` | run | attribution, inputs with URL and sha256, the constants of this plan (resamples, seed, N per position, block starts, min games), `verdicts_total: 360`, `wins`, `of_total_text`, exclusion totals |

Nothing computed by this plan is among them: they are the files the
engineer's code will produce.

## 10. Change rule, and what this plan does not do

**Nothing is tuned after results: no projection, constant, N, block, threshold,
resample count, seed, eligibility rule, reading, or comparison is adjusted
after any 2025 outcome is seen.** A definition that proves unworkable (for
example a column missing from the play-by-play) changes only in a new commit
whose message says why, and the write-up reports both the original and the
amended reading. A result that disagrees with expectation is reported as is.

This plan computes no outcome and adds nothing under `data/`; no 2025 week-W
outcome was computed or read to write it. The backtest code (the extractor
window, the readings, the accuracy-family function, blocks, trend test, edge
readings, outputs) is an engineering issue this plan binds; the live 2025 run
and the write-up are separate issues.
