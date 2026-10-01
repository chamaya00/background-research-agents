# Red-zone usage backtest: evaluation plan

Issue #141, parent #140. **Committed before any fold's outcomes are computed.**
Everything below is fixed by this commit. Written from ADR 0008 (and its
play-by-play amendment), `buildRedZone` / `buildTeamPace` in
`src/nflverse-tables.ts`, and the schema of `data/nflverse/2026/week-04/*.json`.
No week-W outcome was read or computed to write it.

**Decision served.** Whether a player's past red-zone share is worth citing in a
sit/start rationale over simpler numbers the rationale already cites (overall
target share, last week alone, team volume). If it does not beat them, the
rationale should stop citing it.

## 1. Signals (features)

For fold target week W, every feature reads regular-season plays of weeks
`< W` only (the ADR 0008 leakage rule). Team totals and league means are
recomputed per fold from those same weeks; nothing is carried over from a later
fold's table. Per fold the feature tables are regenerated with
`node dist/nflverse-cli.js tables --season 2026 --week W --out <temp dir outside data/>`.

A **red-zone look** is a play with `yardline_100 <= 20`, `two_point_attempt = 0`,
`qb_kneel = 0`, `qb_spike = 0`, and either a target (`pass = 1` with a
`receiver_player_id`) or a carry (`rush = 1` with a `rusher_player_id`). Passes
with no receiver (throwaways, sacks) are in no player's or team's count, as in
ADR 0008. Features and outcomes use this one definition. `buildRedZone` excludes
two-point tries but not kneels or spikes (a kneel inside the 20 would count as a
QB carry in its team total); the evaluation recomputes features from play-by-play
with the filter above and reports the largest absolute difference from the
committed table's `rz_target_share` / `rz_carry_share` as a check, not a tuning
input.

For player *p* on team *T*, over weeks `< W`:

- `rz_target_share = Σ rz_targets(p) / Σ rz_targets(T)`
- `rz_carry_share = Σ rz_carries(p) / Σ rz_carries(T)`
- **`rz_look_share = (rz_targets(p) + rz_carries(p)) / (rz_targets(T) + rz_carries(T))`**
  (the primary signal; `null` when the denominator is 0)
- `team_rz_looks_per_game(T) = (rz_targets(T) + rz_carries(T)) / games(T)`,
  `games(T)` = games T played in weeks `< W`.
- **Projection (the model):** `proj_looks(p) = rz_look_share(p) x team_rz_looks_per_game(T)`.
  Projected targets and carries are the same with the separate shares and the
  matching team counts. No shrinkage, no recency weighting, no matchup term.

A player's team is the team on their most recent row `< W` (ADR 0008). Position
is `position` from the fold's `usage.json` joined on `player_id`, never names.

## 2. Outcomes

For week W, from week-W play-by-play only, with the same look definition:

- **Primary:** `actual_looks(p)` = week-W red-zone targets + carries, as a
  **count**, and as a **team share** `actual_looks(p) / actual_team_looks(T)`.
  Targets and carries are also reported separately.
- **Secondary (reported, outside the decision rule):** red-zone touches
  (receptions, `complete_pass = 1`, + carries) and red-zone TDs (a red-zone
  play with `touchdown = 1` and `td_player_id` equal to the receiver on a pass
  or the rusher on a run). Scored against the same `proj_looks`.
- **WR, TE and RB are reported separately** in every table. QB and any other
  position are not scored. Position comes from `player_id` joined to
  `usage.json`.

## 3. Baselines

Each baseline yields a score per player-week and is scored with the same metrics
and the same player-weeks. Counts are put on the looks scale by multiplying by
`team_rz_looks_per_game(T)` so MAE is comparable; rank metrics do not depend on
that factor.

- **B1, overall target share:** `Σ targets(p) / Σ team_targets(T)` over weeks
  `< W`, the `pooled.target_share` in `usage.json`. Projection =
  share x `team_rz_looks_per_game(T)`.
- **B1b, overall target + carry share:** `(Σ targets(p) + Σ carries(p)) /
  (Σ team_targets(T) + Σ team_carries(T))`, all plays, any field position, using
  the `usage.json` counts. Projection = share x `team_rz_looks_per_game(T)`.
- **B2, most-recent-week red-zone looks alone:** `proj_looks(p)` = p's red-zone
  looks in week W-1 (count, no team scaling). In fold 1->2 this equals the pooled
  count.
- **B3, team-volume-only:** `proj_looks(p) = team_rz_looks_per_game(T) / k(T)`,
  the team's red-zone plays split evenly over `k(T)`, the number of WR, TE and
  RB on T in `usage.json` with at least one overall target or carry in weeks
  `< W`. It is constant within team and position, so its Spearman is computed
  with tied ranks and is expected to be weak; that is the point of the floor.

To say the red-zone signal **beats the baselines** it must beat all four.

## 4. Metrics and decision rule

Per fold, and pooled over folds (primary reading), per position:

1. **Spearman rank correlation** of `proj` vs `actual_looks` over player-weeks
   (average ranks for ties). **This is the primary metric.**
2. **Top-N hit rate.** N = 12 for WR, 8 for RB, 6 for TE. Per fold, take the N
   players with the highest projection (ties at the cut-off broken by
   `player_id` ascending) and count how many are in the actual top N by looks
   (ties at the Nth actual value all count as in). Hit rate = hits / (N x folds).
   Reported with a **95% Wilson interval**.
3. **MAE** of `proj_looks` vs `actual_looks` (counts).

**Intervals.** Spearman difference (model minus baseline) and MAE difference
get a **paired bootstrap, 2,000 resamples, seed 20261001, resampling
team-weeks** (all of a team's player-weeks together, since they share a game
and a play-caller) with a 95% percentile interval.

**Decision rule, per position and baseline, fixed now:**

- **Beats** the baseline: the Spearman-difference interval is entirely above 0,
  and neither the MAE-difference interval is entirely above 0 (worse) nor the
  Wilson interval of the baseline's top-N hit rate entirely above the model's.
- **Loses**: the mirror image (Spearman interval entirely below 0).
- **Inconclusive**: everything else. **An edge that sits inside the interval is
  inconclusive**, however large the point estimate. Also inconclusive: fewer
  than 30 scored player-weeks for that position.

The headline is stated per position as beats / inconclusive / loses against
each of B1, B1b, B2, B3. No correction for four comparisons is applied; the
write-up says so. Folds are pooled for the verdict; per-fold numbers are shown
and are not individually decisive (fold 1->2 rests on one week of features).

## 5. Pass-first / neutral / run-first

**Red-zone pass rate** for team T over weeks `< W`: `pass / (pass + rush)`
over plays with `yardline_100 <= 20`, `play_type` in {pass, run}, excluding
`qb_kneel = 1`, `qb_spike = 1` and `two_point_attempt = 1`. `pass = 1` is
nflverse's flag as recorded: it includes sacks, and scrambles are classified
as nflverse classifies them, not re-sorted by the plan; the write-up states
how many sacks fall in the numerator.

- **Pass-first:** rate >= 0.60. **Run-first:** rate <= 0.45. **Neutral:**
  strictly between.
- **Minimum play count:** a team with fewer than **20** such plays over weeks
  `< W` is **not labelled** (reported as "too few plays"). Counts of labelled
  and unlabelled teams are reported per fold; early folds are expected to label
  few.

**Held up next week** (tested only on labelled pass-first and run-first teams
that played week W):

1. *Tendency kept:* a pass-first team's week-W red-zone pass rate is above the
   league's week-W red-zone pass rate (all teams that played, pooled plays);
   a run-first team's is below it. Reported as teams kept / teams labelled
   with a Wilson interval.
2. *Pass-catchers vs the rest:* in week W, `pc_share(T)` = WR + TE red-zone
   targets / team red-zone looks (the rest being RB and QB looks). Pooled over
   folds, the label "held up" if pass-first teams' pooled `pc_share` exceeds
   run-first teams' by at least **0.10** and their Wilson intervals (over
   looks) do not overlap. Otherwise **inconclusive**. Needs at least 3 teams
   in each group, else inconclusive.

Neutral teams are reported, not tested.

## 6. Eligibility and folds

- **Bye week:** a team with no regular-season play-by-play rows in week W is on
  a bye; its players are **excluded**, not scored as zero.
- **"Didn't play" is decided from week-W play-by-play only, no snap counts.**
  A player of a team that played week W is *seen* if their `player_id` appears
  in any `*_player_id` column of any week-W row (receiver, rusher, passer,
  lateral, tackler, TD scorer, and so on). A player with a feature row and not
  seen is **excluded as not having played**. A seen player with zero looks is
  scored with 0. Known bias: a player on the field only as a blocker is not
  seen and is excluded; a sensitivity reading that scores every non-bye-team
  player as 0 is reported alongside, labelled as such and not used for the
  verdict.
- **No history:** a player absent from the fold's `usage.json` (no stats row in
  weeks `< W`) has no position and no features, and is excluded.
- Players with `rz_look_share = null` (team had no red-zone looks) are excluded.
- **The write-up must report the excluded player-weeks**, per fold and
  position, by reason: bye, not seen, no history, null share.
- **Folds:** 1->2 (features week 1, outcomes week 2), 1-2->3, and 1-3->4. The
  last needs week 4 in the data (the committed `week-04` tables are features
  for week 4, not outcomes); until then it is not run and the write-up says so.
  Folds are expanding-window, never shuffled.

## 7. Change rule

Nothing is tuned after results: no threshold, N, window, filter or baseline is
adjusted after seeing any fold's outcomes. If a definition proves unworkable
(for example a column missing from the play-by-play), it changes only in a new
commit whose message says why, and the write-up reports both the original and
the amended reading. A result that disagrees with expectation is reported as is.

## 8. What this plan does not do

It computes no outcomes and adds nothing under `data/`. The evaluation code and
the results write-up are separate issues that this plan binds.
