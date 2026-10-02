# Which expected-points projection to trust, from which week, for which position? xfp v1-v4 backtest findings, 2025 weeks 2-17

Issue #172, parent #169. Reads the committed outputs of #176 (`data/nflverse/2025/xfp-backtest/`, produced by the code of #174) and judges them only by [`xfp-backtest-plan.md`](xfp-backtest-plan.md) (#170, amended in #175). Nothing here is recomputed or re-tuned, and nothing was fetched. Every number is copied from a committed file; where a line gives a count or a sum of committed values, it says so and says which ones.

**Decision served.** Which of the four expected-points projections (v1, v2, v3, v4), if any, is worth quoting over a player's own points per game so far (the baseline), from which week of the season, and for which position - and whether the `xfp` command should stop presenting any of them as an improvement.

## The answer first

- **Over the whole season, at no position does any model settle as better than the baseline from some week on.** All 32 settling weeks (4 models x 4 positions x 2 families) are "none" (`settling-and-edge.json`). Wins exist, but in single blocks or pooled over the season, never in a run of blocks through week 17.
- **TE is the one position where the models clearly beat the baseline (8 beats of 360 verdicts pooled, both readings agree).** All four of v1-v4 beat it on ranking and on point accuracy over the full season, in both readings. By block the edge sits in weeks 6-9 (ranking) and 6-13 (accuracy), not in weeks 2-5 or 14-17. The four models are indistinguishable from each other at TE.
- **WR: only v4, only on ranking, only pooled over the season (1 beat of 360 verdicts, both readings agree).** Its point accuracy against the baseline is a disagreement between the readings, not a win.
- **RB: nothing beats the baseline over the season (0 beats of 360 verdicts pooled).** v2 and v4 rank better in weeks 2-5 only (2 beats of 360 verdicts), then nothing.
- **QB: nothing beats the baseline over the season (0 beats of 360 verdicts pooled).** Point accuracy beats it in single blocks only - v1 and v3 in weeks 2-5, v2 and v4 in weeks 10-13 (4 beats of 360 verdicts) - and ranking never does.
- **No model improves over the season (0 improves of 360 verdicts, all 40 trend determinations "no trend").** The readings disagree on 5 of the 40; each disagreement is reported below.
- **v3/v4 do not beat v1/v2 early and lose the edge later (0 beats of 360 verdicts in block 1 for either pair).** All 16 edge readings are "no early edge". Where the prior-season values differ at all, v3 is *less* accurate than v1 early (WR and TE, weeks 2-5), and v4's edge over v2 at WR appears *late* (weeks 10-17).

**30 of 360 verdicts are wins** (`summary.json`: `wins` 30, `verdicts_total` 360, `of_total_text` "30 of 360 verdicts are wins (\"beats\" or \"improves\")"). **No correction for multiple comparisons was applied** (plan section 7). All 30 are head-to-head "beats" (of 360 verdicts); none is a trend "improves". By position, a count of the combined "beats" in `verdicts.json`: TE 19, WR 5, QB 4, RB 2 (of 360 verdicts each). 26 are against the baseline and 4 are model against model, all four at WR with v4 the winner.

## How to read the verdicts

From plan sections 3 and 6:

- **Two readings.** The **main ("played")** reading excludes a WR/TE/RB who does not appear in week-W play-by-play, and scores a QB only if he was that week's starter (most dropbacks). The **sensitivity ("did not play scores 0")** reading scores every eligible WR/TE/RB on a non-bye team, with an unseen one scoring 0, and scores the team's latest starter at QB, with 0 if he did not play.
- **Two families.** **Ranking**: "beats" if the paired-bootstrap 95% interval of the Spearman difference (model minus yardstick) is entirely above 0, the MAE-difference interval is not entirely above 0, and the yardstick's top-N Wilson interval is not entirely above the model's; "loses" is the mirror image. **Accuracy**: "beats" if the MAE-difference interval is entirely below 0; "loses" if entirely above 0. Everything else, and any cell under 30 scored player-weeks, is "inconclusive". This is the rule; the wins it produced are counted out of 360 verdicts below.
- **Combined verdict.** A verdict stands only if both readings give it; where they differ the combined verdict is "inconclusive". Every claim below says whether the readings agree.
- **Scopes.** Block 1 = weeks 2-5, block 2 = 6-9, block 3 = 10-13, block 4 = 14-17, plus the season pooled over all 16 folds. **Settling week**: the first week of the earliest block from which the combined verdict is "beats" in that block and every later one (2, 6, 10, 14 or "none"); derived, adding none to the count of 360 verdicts.
- **Top-N**, as amended in #175 before any outcome was computed: **QB 15, RB 30, WR 40, TE 15** (`summary.constants.top_n`).

## Question (a): point accuracy per method and position

Source: `block-metrics.json`, `scope` "pooled"; `verdicts.json`, `family` "accuracy", `scope` "pooled".

**Pooled MAE, points per game, main / sensitivity** (lower is better):

| Position | v1 | v2 | v3 | v4 | Baseline | n (main / sens.) |
|---|---|---|---|---|---|---|
| QB | 6.3541 / 7.2899 | 6.4405 / 7.3823 | 6.2988 / 7.2584 | 6.3915 / 7.3597 | 6.7167 / 7.4738 | 453 / 480 |
| RB | 4.0387 / 3.7417 | 4.0412 / 3.7414 | 4.0556 / 3.7711 | 4.0487 / 3.7566 | 4.1291 / 3.7269 | 1333 / 1944 |
| WR | 3.7954 / 3.7019 | 3.7752 / 3.6798 | 3.8077 / 3.7143 | 3.7709 / 3.6719 | 3.8564 / 3.616 | 2131 / 3058 |
| TE | 2.9903 / 2.6421 | 2.9924 / 2.6436 | 2.9986 / 2.6541 | 2.9927 / 2.6432 | 3.1537 / 2.7814 | 1077 / 1704 |

**Pooled mean bias (projection minus actual), main / sensitivity:** QB v1 -0.0095 / 1.5629, baseline 0.1657 / 1.577; RB v1 -0.6175 / 0.5489, baseline -0.5449 / 0.5213; WR v1 0.1146 / 1.1369, baseline -0.0205 / 0.9144; TE v1 -0.5187 / 0.4242, baseline -0.2797 / 0.6114. The other models sit within a few hundredths to a few tenths of v1 (all in `block-metrics.json`). Every method under-projects RB and TE in the main reading and over-projects every position in the sensitivity one - which is what scoring non-players as 0 should do.

**Accuracy verdicts against the baseline, pooled over the season:**

| Position | v1 | v2 | v3 | v4 | Readings |
|---|---|---|---|---|---|
| QB | inconclusive | inconclusive | inconclusive | inconclusive | **disagree** for v1 and v3 (main beats, sensitivity inconclusive - single-reading results, not one of 360 verdicts); agree for v2 and v4 |
| RB | inconclusive | inconclusive | inconclusive | inconclusive | agree (inconclusive in both) |
| WR | inconclusive | inconclusive | inconclusive | inconclusive | **disagree** for all four: v2 and v4 main beats, sensitivity inconclusive; v1 and v3 main inconclusive, sensitivity **loses** (single-reading results, not one of 360 verdicts) |
| TE | beats (1 of 360 verdicts) | beats (1 of 360 verdicts) | beats (1 of 360 verdicts) | beats (1 of 360 verdicts) | agree |

- **TE: every model is more accurate than the baseline (4 beats of 360 verdicts, both readings agree).** v1 minus baseline MAE, 95%: main [-0.2453, -0.0794], sensitivity [-0.2028, -0.0772]. The other three are within 0.013 of those bounds.
- **QB: the readings disagree.** v1 minus baseline MAE: main [-0.669, -0.0417], entirely below 0; sensitivity [-0.5098, 0.1364], crossing it. v3 the same: main [-0.7255, -0.0947], sensitivity [-0.5382, 0.1071]. The point estimates favour the models in both readings; only the main reading's interval clears 0. Combined: inconclusive.
- **WR: the readings point opposite ways.** Main: v4 minus baseline MAE [-0.1664, -0.0045] (beats in that reading only, not one of 360 verdicts). Sensitivity: v1 [0.0129, 0.1571] and v3 [0.0247, 0.1705] are entirely *above* 0 - the baseline is more accurate - and the baseline has the lowest sensitivity MAE of the five (3.616). Combined: inconclusive for all four. *Inference:* projections built from opportunity over-project receivers who then do not play; the baseline, which averages points already scored, is less exposed when those weeks count as 0.
- **RB: inconclusive in both readings.** Same direction as WR: the models' MAE is lower in the main reading and the baseline's is lowest in the sensitivity reading (3.7269), but no interval clears 0 in either.

**Accuracy, model against model, pooled:** v4 beats v3 at WR (1 of 360 verdicts, both readings agree: main [-0.0705, -0.0033], sensitivity [-0.0706, -0.0135]). **v3 loses to v1 at RB, WR and TE in both readings** (v3 minus v1 MAE, WR main [0.005, 0.0199], sensitivity [0.007, 0.0183]). Every other model-against-model accuracy cell pooled is inconclusive. The sizes are hundredths of a point per game.

## Question (b): ranking accuracy per method and position

Source: `block-metrics.json` (pooled), `verdicts.json` (`family` "ranking", `scope` "pooled").

**Pooled Spearman, main / sensitivity** (higher is better):

| Position | v1 | v2 | v3 | v4 | Baseline |
|---|---|---|---|---|---|
| QB | 0.2316 / 0.2403 | 0.2013 / 0.2086 | 0.2442 / 0.2443 | 0.2104 / 0.2093 | 0.1933 / 0.2341 |
| RB | 0.7332 / 0.6537 | 0.7311 / 0.6529 | 0.7342 / 0.6552 | 0.7321 / 0.6537 | 0.7235 / 0.6559 |
| WR | 0.6274 / 0.5648 | 0.6304 / 0.5683 | 0.6284 / 0.5663 | 0.6313 / 0.5694 | 0.6011 / 0.5571 |
| TE | 0.6145 / 0.5886 | 0.6172 / 0.5916 | 0.6152 / 0.5891 | 0.6177 / 0.5917 | 0.5832 / 0.5625 |

**Pooled top-N hits / slots, main / sensitivity:**

| Position (N) | v1 | v2 | v3 | v4 | Baseline |
|---|---|---|---|---|---|
| QB (15) | 152 / 145 of 240 | 141 / 132 of 240 | 149 / 146 of 240 | 141 / 134 of 240 | 149 / 148 of 240 |
| RB (30) | 330 / 303 of 480 | 334 / 304 of 480 | 329 / 303 of 480 | 332 / 303 of 480 | 325 / 302 of 480 |
| WR (40) | 380 / 329 of 640 | 382 / 337 of 640 | 381 / 329 of 640 | 386 / 336 of 640 | 373 / 332 of 640 |
| TE (15) | 125 / 105 of 240 | 125 / 113 of 240 | 123 / 106 of 240 | 125 / 112 of 240 | 121 / 102 of 240 |

No model's top-N Wilson interval excludes the baseline's at any position pooled (for example TE v1 main 0.4578-0.5832 against baseline 0.4413-0.5669), so top-N decided no verdict here.

**Ranking verdicts against the baseline, pooled over the season:**

| Position | v1 | v2 | v3 | v4 | Readings |
|---|---|---|---|---|---|
| QB | inconclusive | inconclusive | inconclusive | inconclusive | agree (inconclusive in both) |
| RB | inconclusive | inconclusive | inconclusive | inconclusive | **disagree** for v3 (main beats, sensitivity inconclusive - not one of 360 verdicts); agree for the rest |
| WR | inconclusive | inconclusive | inconclusive | beats (1 of 360 verdicts) | **disagree** for v1, v2, v3 (main beats, sensitivity inconclusive); agree for v4 |
| TE | beats (1 of 360 verdicts) | beats (1 of 360 verdicts) | beats (1 of 360 verdicts) | beats (1 of 360 verdicts) | agree |

- **TE: every model ranks better than the baseline (4 beats of 360 verdicts, both readings agree).** v1 minus baseline Spearman: main [0.0108, 0.0521], sensitivity [0.0108, 0.0422].
- **WR: v4 ranks better than the baseline (1 beat of 360 verdicts, both readings agree)** - by a little: Spearman difference main [0.0164, 0.0445], sensitivity [0.0004, 0.0239], the sensitivity lower bound four ten-thousandths above 0. v1, v2 and v3 clear 0 in the main reading only (v1 sensitivity [-0.0047, 0.0196]); that is a disagreement, combined inconclusive.
- **RB: no model ranks better than the baseline (0 beats of 360 verdicts pooled).** v3 clears 0 in the main reading only ([0.0002, 0.022]; sensitivity [-0.0099, 0.0079]) - a disagreement.
- **QB: no model ranks better than the baseline (0 beats of 360 verdicts pooled), in both readings.** Every interval crosses 0 (v3 main [-0.0291, 0.1365]). QB Spearman is low for every method (0.19-0.24), so ranking QBs week to week is weak whatever is used.

**Ranking, model against model, pooled:** v4 beats v2 at WR (1 of 360 verdicts, both readings agree: Spearman difference main [0.0001, 0.0018], sensitivity [0.0005, 0.0018]). At QB and RB, v4 vs v2 is main beats, sensitivity inconclusive - a disagreement. Every other model-against-model ranking cell pooled is inconclusive. The differences between models are in the third decimal of Spearman; the models rank players almost identically.

## Question (c): does any model improve over the season?

Source: `trend.json` (40 determinations), `settling-and-edge.json`, block rows of `verdicts.json`.

**Trend test** (plan section 5: Kendall's tau of the weekly statistic against week, 10,000-permutation two-sided test, p < 0.05, both readings required). **All 40 combined determinations are "no trend" (0 improves of 360 verdicts, 0 worsens).** All 40 have 16 non-null weeks in both readings.

The readings disagree on 5 of the 40, each a sensitivity- or main-only "improves" that the combine discards, so none is one of 360 verdicts' wins:

| Method | Position | Statistic | Main tau / p / trend | Sensitivity tau / p / trend | Combined, of 360 verdicts |
|---|---|---|---|---|---|
| v1 | WR | MAE | 0 / 1 / no trend | -0.4 / 0.0324 / improves | no trend (0 wins of 360 verdicts) |
| v3 | WR | MAE | 0 / 1 / no trend | -0.4 / 0.0327 / improves | no trend (0 wins of 360 verdicts) |
| v4 | WR | MAE | 0.0167 / 0.9659 / no trend | -0.3833 / 0.0403 / improves | no trend (0 wins of 360 verdicts) |
| baseline | WR | MAE | 0.0167 / 0.9646 / no trend | -0.5 / 0.0052 / improves | no trend (0 wins of 360 verdicts) |
| baseline | RB | Spearman | 0.4 / 0.0349 / improves | 0.0333 / 0.8953 / no trend | no trend (0 wins of 360 verdicts) |

v2 at WR MAE is just outside: sensitivity tau -0.3667, p 0.0502, "no trend". The WR MAE pattern under the sensitivity reading is shared by the baseline, with the strongest tau of the five, so it is not a property of the models. *Inference:* it is what one would expect if fewer unseen receivers were scored late in the season, though the committed files do not show that directly - per-week exclusions are in `exclusions.json` and were not tabulated here.

**Block verdicts against the baseline (combined), and the settling week.** Only rows with at least one block "beats" (of 360 verdicts) are shown; every other model-against-baseline row is inconclusive in all four blocks.

| Position | Family | Model | Block 1 (W 2-5) | Block 2 (W 6-9) | Block 3 (W 10-13) | Block 4 (W 14-17) | Pooled | Settling week | Beats in row, of 360 verdicts |
|---|---|---|---|---|---|---|---|---|---|
| QB | accuracy | v1 | beats | inconclusive | inconclusive | inconclusive | inconclusive | none | 1 of 360 verdicts |
| QB | accuracy | v3 | beats | inconclusive | inconclusive | inconclusive | inconclusive | none | 1 of 360 verdicts |
| QB | accuracy | v2 | inconclusive | inconclusive | beats | inconclusive | inconclusive | none | 1 of 360 verdicts |
| QB | accuracy | v4 | inconclusive | inconclusive | beats | inconclusive | inconclusive | none | 1 of 360 verdicts |
| RB | ranking | v2 | beats | inconclusive | inconclusive | inconclusive | inconclusive | none | 1 of 360 verdicts |
| RB | ranking | v4 | beats | inconclusive | inconclusive | inconclusive | inconclusive | none | 1 of 360 verdicts |
| WR | ranking | v4 | inconclusive | inconclusive | inconclusive | inconclusive | beats | none | 1 of 360 verdicts |
| TE | ranking | v1, v2, v3, v4 (each) | inconclusive | beats | inconclusive | inconclusive | beats | none | 2 of 360 verdicts each, 8 in all |
| TE | accuracy | v1, v3, v4 (each) | inconclusive | beats | beats | inconclusive | beats | none | 3 of 360 verdicts each, 9 in all |
| TE | accuracy | v2 | inconclusive | beats | inconclusive | inconclusive | beats | none | 2 of 360 verdicts |

Every block "beats" (of 360 verdicts) in this table has both readings agreeing (each is "beats" in `verdict_main` and `verdict_sensitivity`). Block 1 QB v1 accuracy, for scale: MAE difference main [-1.7168, -0.0126], sensitivity [-1.7425, -0.0199] - more than a point per game better at the top of its interval, almost nothing at the bottom, on 116 / 124 player-weeks.

**Do v3/v4 beat v1/v2 early and lose that edge later?** No (0 beats of 360 verdicts for v3 vs v1 or v4 vs v2 in block 1). All 16 edge readings (2 pairs x 4 positions x 2 families) are **"no early edge"**, so v3/v4 have the pattern at no position. What the pairs did show, combined, both readings agreeing:

- **v3 vs v1, accuracy: v3 *loses* in block 1 at WR and TE**, and again in block 4 at WR; pooled, it loses at RB, WR and TE. Prior-season values made the early-season projection slightly *worse*, not better.
- **v4 vs v2, accuracy at WR: v4 beats in blocks 3 and 4 (2 beats of 360 verdicts)**, inconclusive in blocks 1 and 2 - an edge that appears late, the reverse of the hypothesis.
- Every other pair-block cell is inconclusive.

Outside the two pairs: **v2 loses to v1 on QB accuracy in block 1, and v4 loses to v3 on QB accuracy in block 1** - the defense adjustment made early-season QB projections less accurate, both readings agreeing. Neither persists into a later block.

## Recommendation

What to quote in a sit/start or trade rationale, per position. The baseline is the player's own points per game so far (QB: per start). "Settling week" is from `settling-and-edge.json` and is "none" in every row.

| Position | Trust | From which week | Rests on (combined verdicts) |
|---|---|---|---|
| QB | **Nothing beats the baseline** - quote points per start | No week; settling week none | 0 beats of 360 verdicts pooled in either family. Accuracy beats only in single blocks (v1, v3 weeks 2-5; v2, v4 weeks 10-13; 4 beats of 360 verdicts) and never in two blocks running. Ranking inconclusive in every block. |
| RB | **Nothing beats the baseline** - quote points per game | No week; settling week none | 0 beats of 360 verdicts pooled in either family. v2 and v4 rank better in weeks 2-5 only (2 beats of 360 verdicts). v3 is less accurate than v1 pooled. |
| WR | **v4 for ranking, as a season-long reading only; nothing beats the baseline on point accuracy** | No week; settling week none | v4 ranking beats baseline pooled (1 of 360 verdicts), inconclusive in every block. v4 beats v2 on ranking and v3 on accuracy pooled (2 of 360 verdicts). Accuracy vs baseline: readings disagree. |
| TE | **v1** (any of v1-v4 does as well; v1 carries no "not validated" label) | Season-long; the edge shows in weeks 6-13, not 2-5 or 14-17; settling week none | All four beat baseline pooled in both families (8 of 360 verdicts); accuracy in blocks 2-3, ranking in block 2. v2/v3/v4 do not beat v1 anywhere at TE; v3 loses to v1 on accuracy pooled. |

**Strongest case against this table:** at TE - the only position with a clean result - the four models agree to the third decimal, so 8 of the 30 wins are one finding counted four times, plus 11 block wins from the same source. Read as independent evidence, 19 of 30 wins at TE overstates it; read as one finding, it is one position where volume-based expected points rank and project tight ends a little better than their own points-per-game history, by about 0.16 points per game in MAE (main: 2.9903 vs 3.1537) and 0.03 in Spearman (main: 0.6145 vs 0.5832). Against 360 verdicts with no correction, a single consistent position is not much. **What would flip it:** a second season (2024, or 2026 once complete) run under this plan giving TE the same pooled verdict would make it a finding rather than a candidate; a second season where it is inconclusive would leave no position at which any xfp version is worth quoting over the baseline.

**For the `xfp` command:** on this season, v1 is not shown to be an improvement over points per game at QB, RB or WR, and v2-v4 are not shown to be improvements over v1 anywhere. The plan's decision line - "if a model does not beat that yardstick, the `xfp` command should stop presenting it as an improvement" - applies at QB and RB for all four (0 beats of 360 verdicts pooled), and at WR for v1-v3 and for v4's point accuracy (v4's WR ranking is the 1 pooled beat of 360 verdicts there). Whether and how to change the command's wording is a follow-up for the person, not applied here.

## On how many player-weeks?

Source: `n` in `block-metrics.json` (pooled), and `summary.exclusion_totals`.

**Scored player-weeks, all 16 folds (main / sensitivity):** QB **453 / 480**; RB **1333 / 1944**; WR **2131 / 3058**; TE **1077 / 1704**. The smallest block cells seen above (QB block 3, 114 / 118) clear the 30 player-week minimum; no verdict cited here is inconclusive for lack of sample.

**Excluded player-weeks by reason, all positions, all folds** (`summary.exclusion_totals`): bye **526**, not seen **2165**, not starter **213**, fewer than the minimum games **231**, no history **10**. The not-seen count is exactly the sum of the WR/RB/TE differences between the two readings' `n` (a sum of committed values: RB 1944 - 1333 = 611, WR 3058 - 2131 = 927, TE 1704 - 1077 = 627; 611 + 927 + 627 = 2165). Per-week and per-position counts by reason are in `exclusions.json`. **QB-weeks where the starter had fewer than 15 dropbacks: 4** (`qb_starters_under_15_dropbacks`), reported as a count only, as plan section 3.5 requires.

## Limits

- **What has and has not been "seen".** The plan (#170) was committed "before any 2025 outcome is computed" and states that "no 2025 week-W outcome was computed or read to write it"; the one amendment (#175, top-N to QB 15, RB 30, WR 40, TE 15) is recorded in the plan as made "on 2026-10-02, after this plan merged and before any 2025 outcome was computed". So this is an out-of-sample test of the xfp models *as pre-registered*. It is not a test on untouched data in a wider sense: the 2025 play-by-play and player stats were already read by the red-zone backtest of #150 (parent #169: "already used by #150"), and 2025 is a completed public season. No xfp constant was fitted on it (`ADJUST_K = 100` is fixed, not tuned - `docs/nflverse-xfp.md`), which is what keeps the test honest despite that.
- **The main reading's "seen" rule flatters every method,** as the plan says in advance (section 3.3): a player on the field with no target or carry is not seen, and those are exactly the misses. 2165 player-weeks were excluded as not seen. Every verdict cited as a win is the combined one, which needs the sensitivity reading to agree; at WR and RB the sensitivity reading is where the baseline catches up or passes the models.
- **What the v2-v4 "not validated" caveat now rests on.** The command labels v2, v3 and v4 "not validated against v1" (`src/nflverse-xfp.ts`; for QB, v2 is "adjusted for the defense only, no passer or quarterback-quality factor"). After this backtest the caveat rests on: **0 beats of 360 verdicts for v2 over v1 or for v3 over v1**, at any position or scope (the plan's 80 v2-vs-v1 and v3-vs-v1 cells); v3 *loses* to v1 on accuracy pooled at RB, WR and TE, and v2 loses to v1 on QB accuracy in weeks 2-5. **v4 was never compared with v1 directly** - the plan's comparisons are v4 vs v3 and v4 vs v2 - and its 4 beats of 360 verdicts over those are all at WR and measured in hundredths of a point. The caveat is therefore still true: no version has been validated against v1, and v3 has evidence against it.
- **One season.** 2025, regular-season weeks 2-17, not pooled with any other season (plan section 2). Nothing here says how 2024 or 2026 would come out.
- **No multiplicity correction.** 30 wins of 360 verdicts, with no correction applied; the plan says plainly that "a handful of wins among 360 is within what chance produces". The TE result is the one that repeats across both families, both readings and four models; every other win stands alone in its row.
- **Week 18 excluded** for the reason the plan fixed from the calendar (starters rest).
- **Minimum games = 1** for eligibility, looser than the command's printed threshold of 2 (`thin_below_games`, `thin_below_starts` = 2). Thin player-weeks are flagged in the fold files, not treated differently, so block 1 includes players the command would not rank.

## Departures from the plan

None in the run: 16 folds W = 2..17 (`folds`), 2,000 resamples and seed 20261001 (`constants`), 10,000 trend permutations, `trend_min_weeks` 12, `trend_alpha` 0.05, `min_scored` 30, block starts 2 / 6 / 10 / 14, top-N as amended, `verdicts_total` 360 - all as the plan fixes them. The top-N amendment of #175 was made before any outcome; plan section 10 asks a write-up to report both readings only for a definition that "proves unworkable", which this was not, and the committed outputs carry the amended N only - the original N (QB 12, RB 24, WR 24, TE 12) was not run and is not reported. Top-N enters only the ranking family's third clause and decided no pooled verdict (see Question (b)).

What this run could not do: tabulate by script. `node` was refused in this run, so every value here was read from the committed JSON with a text search, and every count is stated as one and cross-checked where the files allow (the 30 wins against `summary.wins`, the not-seen sum against `exclusion_totals.not_seen`).

## Follow-ups (none applied)

- Rewording the `xfp` command's presentation at QB, RB and WR, per the plan's decision line. A product call for the person.
- Re-running this plan on a second season, which is what would turn the TE result into a finding or retire it.
- A direct v4-vs-v1 comparison, which the plan did not include, so that the v4 caveat can be judged against the version the command defaults to.
- Retuning anything (`ADJUST_K`, bucket definitions, prior-season weighting) is out of scope for #169 and is not proposed here as a change; if pursued, it needs its own pre-registered plan on a season it was not tuned on.

## Outputs used

- `data/nflverse/2025/xfp-backtest/summary.json` - attribution, input hashes, constants, `verdicts_total`, `wins`, `of_total_text`, `exclusion_totals`, `qb_starters_under_15_dropbacks`.
- `data/nflverse/2025/xfp-backtest/verdicts.json` - all 320 head-to-head cells; pooled rows and every combined "beats" (30 of 360 verdicts) / "loses" read.
- `data/nflverse/2025/xfp-backtest/block-metrics.json` - pooled MAE, bias, Spearman, top-N, Wilson intervals, `n`.
- `data/nflverse/2025/xfp-backtest/trend.json` - all 40 trend determinations.
- `data/nflverse/2025/xfp-backtest/settling-and-edge.json` - block verdicts against the baseline, settling weeks, the 16 edge readings.
- Not read row by row: `weekly-metrics.json`, `exclusions.json`, `fold-WW-player-weeks.json`.
- Plan: [`xfp-backtest-plan.md`](xfp-backtest-plan.md); form: [`150-red-zone-backtest-2025-findings.md`](150-red-zone-backtest-2025-findings.md).
- All inputs: nflverse, CC-BY 4.0 (`summary.attribution`).
