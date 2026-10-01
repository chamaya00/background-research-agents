# Does red-zone share predict next week's red-zone looks? Backtest findings, 2026 weeks 1-3

Issue #143, parent #140. Reads the committed outputs of PR #146 (148306b) and judges them only by the metrics and decision rule of [`docs/research/red-zone-backtest-plan.md`](red-zone-backtest-plan.md) (#144). Nothing here is recomputed; every number is copied from a file listed under "Outputs used".

**Decision served.** Whether a wide receiver's high red-zone share is worth paying for in a trade, or citing in a start, over what their overall target share already tells you.

**Answer, as blunt as the numbers allow.** Red-zone share does not beat plain overall target share for any position. For WR it is *worse* on the point estimate in both readings, and inconclusive only because two folds cannot rule out a small edge either way. The one thing it reliably beats is the floor (an even split of the team's red-zone plays), for WR and RB. The pass-first / run-first flags have not been shown to hold for a single week.

**What this rests on.** Two folds: weeks 1 -> 2 and weeks 1-2 -> 3. The third fold the plan names (weeks 1-3 -> 4) **does not exist yet**, because week 4 is not complete in the nflverse play-by-play. It is added by re-running the backtest command once week 4 has been played; nothing in this document should be read as covering week 4. Fold 1 -> 2 rests on a single week of features, and in that fold the model and B2 make identical rankings (the plan says so in section 3), so model-vs-B2 is effectively tested on fold 3 alone.

## How to read the verdicts

The plan's rule (section 4), applied per position and per baseline:

- **Beats**: the paired-bootstrap 95% interval for *model minus baseline* Spearman is entirely above 0, the MAE-difference interval is not entirely above 0, and the baseline's top-N Wilson interval is not entirely above the model's.
- **Loses**: Spearman-difference interval entirely below 0.
- **Inconclusive**: anything else, including any edge whose interval crosses 0, however large the point estimate.
- Each verdict is computed twice - the primary **seen** reading (players not seen in week-W play-by-play are excluded) and the **sensitivity** reading (they are scored as 0). Only a verdict the two readings agree on stands; disagreement is inconclusive.
- No correction for four comparisons per position is applied (`summary.no_multiplicity_correction`).

Baselines: **B1** overall target share; **B1b** overall target + carry share; **B2** last week's red-zone looks alone; **B3** team red-zone looks split evenly over the team's active WR/TE/RB. "The model" is `rz_look_share x team_rz_looks_per_game`. Spearman is the primary metric; a negative MAE difference means the model's errors are smaller.

## (a) Does prior red-zone share predict next week's red-zone looks better than each baseline?

Source: `summary.positions.<POS>` - `methods.*.pooled`, `paired_bootstrap_model_minus_baseline`, `verdicts`, `combined_verdicts`.

### WR

**Inconclusive against B1, B1b and B2; beats only B3.** Against overall target share the model's point estimate is lower, not higher.

Pooled Spearman (seen / sensitivity): model **0.139 / 0.155**; B1 **0.243 / 0.268**; B1b 0.242 / 0.273; B2 0.115 / 0.160; B3 -0.019 / -0.003.

| Model minus | Reading | Spearman diff 95% | MAE diff 95% | Verdict | Combined |
|---|---|---|---|---|---|
| B1 | seen | [-0.224, 0.025] | [-0.370, -0.127] | inconclusive | **inconclusive** |
| B1 | sensitivity | [-0.225, 0.006] | [-0.385, -0.173] | inconclusive | |
| B1b | seen | [-0.226, 0.025] | [-0.050, 0.103] | inconclusive | **inconclusive** |
| B1b | sensitivity | [-0.230, -0.0004] | [-0.056, 0.075] | **loses** | |
| B2 | seen | [-0.048, 0.090] | [-0.070, 0.031] | inconclusive | **inconclusive** |
| B2 | sensitivity | [-0.077, 0.063] | [-0.048, 0.053] | inconclusive | |
| B3 | seen | [0.005, 0.317] | [-0.230, -0.033] | beats | **beats** |
| B3 | sensitivity | [0.018, 0.302] | [-0.277, -0.107] | beats | |

Top-12 hit rate, pooled over 24 slots: model 5/24 = 0.21 (Wilson 0.09-0.40); B1 and B1b 7/24 = 0.29 (0.15-0.49) seen, 6/24 = 0.25 (0.12-0.45) sensitivity; B2 6/24 = 0.25; B3 4/24 seen, 3/24 sensitivity. No baseline's Wilson interval sits entirely above the model's, so top-N decides nothing here.

Read plainly: against overall target share both Spearman intervals run from about -0.22 to just above zero. The data cannot exclude a tiny red-zone edge, but nearly all of the interval is on the side where red-zone share is the *worse* predictor. Under the sensitivity reading, against overall target + carry share, the interval is entirely below zero (by 0.0004) - a "loses" that does not stand only because the seen reading does not agree. The B3 "beats" has a lower bound of 0.005 in the seen reading; it is the thinnest margin the rule allows.

The model's MAE is smaller than B1's in both readings (intervals entirely below 0). *Inference:* that is a scale effect rather than a better ranking - B1 multiplies a receiver's share of *targets* by the team's red-zone *targets plus carries*, which overstates every pass-catcher's looks (in `fold-03-predictions.json`, Keenan Allen's `b1_proj` is 1.58 against a `b1b_proj` of 0.84). Against B1b, which is on the right scale, the MAE difference straddles 0 in both readings.

### TE

**Inconclusive against all four baselines, B3 included.** The model does not separate from the floor at tight end.

Pooled Spearman (seen / sensitivity): model **0.078 / 0.147**; B1 0.104 / 0.151; B1b 0.119 / 0.164; B2 **0.165 / 0.227**; B3 -0.023 / -0.006.

| Model minus | Reading | Spearman diff 95% | MAE diff 95% | Verdict | Combined |
|---|---|---|---|---|---|
| B1 | seen | [-0.196, 0.138] | [-0.284, -0.011] | inconclusive | **inconclusive** |
| B1 | sensitivity | [-0.160, 0.160] | [-0.318, -0.093] | inconclusive | |
| B1b | seen | [-0.208, 0.128] | [0.001, 0.233] | inconclusive | **inconclusive** |
| B1b | sensitivity | [-0.178, 0.148] | [-0.028, 0.165] | inconclusive | |
| B2 | seen | [-0.198, 0.026] | [-0.013, 0.141] | inconclusive | **inconclusive** |
| B2 | sensitivity | [-0.173, 0.012] | [0.000, 0.125] | inconclusive | |
| B3 | seen | [-0.114, 0.311] | [-0.180, 0.125] | inconclusive | **inconclusive** |
| B3 | sensitivity | [-0.026, 0.330] | [-0.289, -0.035] | inconclusive | |

Top-6 hit rate over 12 slots: model 4/12 = 0.33 (Wilson 0.14-0.61); B1, B1b, B2 3/12 = 0.25 (0.09-0.53); B3 2/12 = 0.17 (0.05-0.45). Twelve slots cannot separate anything.

Against B1b in the seen reading the model's MAE is *worse* (interval [0.001, 0.233] entirely above 0); the Spearman interval already makes that comparison inconclusive, so this does not change the verdict. Last week's looks alone (B2) is the best TE point estimate in both readings.

### RB

**Inconclusive against B1, B1b and B2; beats B3.** The one "beats" against a real baseline (B1, seen reading) does not survive the sensitivity reading.

Pooled Spearman (seen / sensitivity): model **0.417 / 0.429**; B1 0.268 / 0.342; B1b **0.433 / 0.487**; B2 0.382 / 0.415; B3 -0.027 / 0.007.

| Model minus | Reading | Spearman diff 95% | MAE diff 95% | Verdict | Combined |
|---|---|---|---|---|---|
| B1 | seen | [0.013, 0.291] | [-0.476, 0.003] | **beats** | **inconclusive** |
| B1 | sensitivity | [-0.030, 0.209] | [-0.330, 0.130] | inconclusive | |
| B1b | seen | [-0.099, 0.063] | [-0.069, 0.226] | inconclusive | **inconclusive** |
| B1b | sensitivity | [-0.133, 0.013] | [-0.044, 0.203] | inconclusive | |
| B2 | seen | [-0.020, 0.099] | [-0.266, 0.014] | inconclusive | **inconclusive** |
| B2 | sensitivity | [-0.045, 0.075] | [-0.216, 0.035] | inconclusive | |
| B3 | seen | [0.266, 0.611] | [-0.556, -0.036] | beats | **beats** |
| B3 | sensitivity | [0.251, 0.588] | [-0.491, -0.013] | beats | |

Top-8 hit rate over 16 slots: model 10/16 = 0.63 (Wilson 0.39-0.82); B1b 9/16 = 0.56 (0.33-0.77); B1 and B2 7/16 = 0.44 (0.23-0.67); B3 3/16 = 0.19 (0.07-0.43).

Red-zone usage is far more predictable at RB than at WR or TE - every method except B3 has a pooled Spearman around 0.3-0.5. But overall target + carry share (B1b), which does not look at field position at all, matches or beats the red-zone signal on the point estimate in both readings.

## (b) Week-to-week stability of the share

**The plan defines no stability statistic, and two folds cannot support one.** What the committed output does say is below; it has no interval attached, and per-fold numbers are not individually decisive under the plan (section 4).

The direct "does last week carry over" reading is B2 - last week's red-zone looks alone - in each fold. In fold 2 the model and B2 rank identically (one week of features), so the fold-2 number is the same for both.

Per-fold Spearman, seen reading (sensitivity in brackets):

| Position | Method | Fold 2 | Fold 3 | Change |
|---|---|---|---|---|
| WR | model | 0.109 (0.114) | 0.156 (0.186) | +0.047 (+0.072) |
| WR | B2 | 0.109 (0.114) | 0.115 (0.196) | +0.007 (+0.081) |
| WR | B1 | 0.190 (0.207) | 0.297 (0.329) | +0.107 (+0.122) |
| WR | B1b | 0.177 (0.211) | 0.300 (0.332) | +0.123 (+0.121) |
| TE | model | 0.035 (0.091) | 0.110 (0.194) | +0.075 (+0.103) |
| TE | B2 | 0.035 (0.091) | 0.293 (0.364) | +0.258 (+0.272) |
| TE | B1 | 0.057 (0.083) | 0.146 (0.223) | +0.089 (+0.140) |
| TE | B1b | 0.068 (0.091) | 0.163 (0.236) | +0.095 (+0.145) |
| RB | model | 0.294 (0.310) | 0.560 (0.551) | +0.266 (+0.241) |
| RB | B2 | 0.294 (0.310) | 0.474 (0.505) | +0.180 (+0.195) |
| RB | B1 | 0.240 (0.274) | 0.297 (0.401) | +0.058 (+0.127) |
| RB | B1b | 0.355 (0.393) | 0.511 (0.559) | +0.156 (+0.166) |

B3 stays near zero throughout (-0.09 to 0.05). The change column is a subtraction of two committed numbers, not a new statistic.

What that supports:

- **WR: a receiver's red-zone looks one week barely rank their looks the next** - B2's Spearman is 0.11-0.12 in the seen reading in both folds. Overall target share (B1) ranks next week's red-zone looks about twice as well in fold 3 (0.30).
- **RB: last week carries over moderately** - B2 0.29 then 0.47.
- **TE: it moved from nothing (0.04) to moderate (0.29)** between folds, which says the TE reading is not settled.
- Every method improves from fold 2 to fold 3, which is what one would expect when features go from one week of data to two. *Inference:* with only two folds, "the share is getting more stable" and "the features have more weeks behind them" cannot be told apart.

## (c) Do the pass-first / run-first flags hold next week?

**Inconclusive, and the sample is too small to tell.** Source: `summary.team_flags`, `fold-02-team-flags.json` and `fold-03-team-flags.json` (`rows`, `next_week`).

- **Fold 2 labelled no team.** All 32 had fewer than the plan's minimum of 20 red-zone plays after one week; `fold-02-team-flags.json` has an empty `next_week`.
- **Fold 3** labelled 11 of 32: 6 pass-first (CAR, HOU, KC, NO, SF, TB), 4 neutral (CHI, DET, LV, WAS), 1 run-first (SEA); 21 were too few plays. 22 sacks sit in the 323 red-zone pass plays of the fold-3 numerator (10 in 163 for fold 2), as nflverse's `pass` flag records them.
- **Tendency kept** (week-3 red-zone pass rate on the right side of the league's 0.557): pass-first **4 of 6** (Wilson 0.30-0.90) - KC (0.53) and SF (0.50) fell below the league rate. Run-first **0 of 1** (Wilson 0-0.79): SEA went from 0.37 to **0.75**.
- **Pass-catchers' share of red-zone looks** in week 3: pass-first teams 20 of 47 = **0.43** (Wilson 0.30-0.57); run-first 9 of 12 = **0.75** (0.47-0.91). The gap is **-0.32**, the wrong direction for the label, and the plan's rule needs at least 3 teams per group; there was 1 run-first team. `pc_share_verdict`: **inconclusive**.

With one fold, six teams on one side and one on the other, this is not evidence that the labels work or that they fail. It is evidence that they cannot be leaned on yet.

## (d) On how many player-weeks?

Source: `n` under each reading in `summary.positions.<POS>`, and `summary.excluded_player_weeks.by_fold`.

Scored player-weeks (seen / sensitivity):

| Position | Fold 2 | Fold 3 | Pooled |
|---|---|---|---|
| WR | 108 / 123 | 115 / 145 | **223 / 268** |
| TE | 53 / 68 | 61 / 79 | **114 / 147** |
| RB | 68 / 76 | 73 / 92 | **141 / 168** |

Every position clears the plan's minimum of 30 scored player-weeks, so no verdict above is inconclusive *for that reason*; they are inconclusive because the intervals are wide.

Excluded player-weeks, by fold, position and reason:

| Fold | Position | Bye | Not seen\* | No history | No target or carry before W | Null share | Total |
|---|---|---|---|---|---|---|---|
| 1 -> 2 | WR | 0 | 15 | 0 | 25 | 3 | 43 |
| 1 -> 2 | TE | 0 | 15 | 0 | 11 | 1 | 27 |
| 1 -> 2 | RB | 0 | 8 | 0 | 11 | 2 | 21 |
| 1 -> 2 | unknown | 0 | 0 | 9 | 0 | 0 | 9 |
| 1-2 -> 3 | WR | 0 | 30 | 0 | 21 | 5 | 56 |
| 1-2 -> 3 | TE | 0 | 18 | 0 | 10 | 3 | 31 |
| 1-2 -> 3 | RB | 0 | 19 | 0 | 14 | 2 | 35 |
| 1-2 -> 3 | unknown | 0 | 0 | 6 | 0 | 0 | 6 |

\* Excluded only in the seen reading; the sensitivity reading scores them as 0, which is exactly the difference between the two `n` columns above (e.g. WR fold 3: 115 + 30 = 145). "No history" counts players with a week-W red-zone look and no stats row before W, so their position is unknown. No team had a bye in weeks 2 or 3.

## What to lean on it for

Written for the decision at hand: whether to trade for wide receivers *because* their red-zone share is high.

**Do not pay extra for a WR's red-zone share.** Over weeks 1-3 a receiver's red-zone share predicted next week's red-zone looks *worse* than their overall target share (Spearman 0.14 vs 0.24 seen; 0.16 vs 0.27 sensitivity), and the interval on that gap reaches only 0.006-0.025 above zero. If two receivers have similar overall target share, the one with the higher red-zone share has not been shown to get more red-zone looks next week. Price the trade on overall target share; treat a high red-zone share as noise until it shows up there too.

**Do not sell a WR because their red-zone share is low**, for the same reason in reverse: the signal that would justify it does not carry week to week at WR (last week's red-zone looks alone: Spearman 0.11-0.12).

**Do not use a team's pass-first label to favour its receivers.** The only run-first team threw 75% of its red-zone plays the next week, and pass-first teams' receivers got a *smaller* share of red-zone looks (0.43) than that team's (0.75). Six teams against one cannot show this either way; it means the flag adds nothing to a trade case yet.

**What it is good for:**

- **Starts, at RB:** red-zone usage is the most predictable it gets here (top-8 hit 10 of 16 for the model, 9 of 16 for overall touch share). Lean on RB *usage* - but overall touch share does the job as well as red-zone share, so cite whichever you already have.
- **Against the floor, at WR and RB:** individual usage, red-zone or overall, beats assuming a team's red-zone plays are split evenly. That is the only comparison any red-zone signal wins.
- **At TE, nothing yet.** No method separated from the floor; if anything, last week's looks (B2) was the best point estimate.

**For the rationale wording:** under the plan's stated decision ("if it does not beat them, the rationale should stop citing it"), sit/start rationales should cite overall target share, or target + carry share for RBs, rather than red-zone share - for all three positions - until a fold says otherwise.

## Caveats on these conclusions

- **Two folds, the first on one week of features.** Every interval above is wide because of it. A result this thin can move with fold 1-3 -> 4; the WR verdict against B1/B1b in particular sits close to "loses" and could land there or drift back toward zero.
- **No multiplicity correction** for four baselines per position. The two thin "beats" (WR vs B3, lower bound 0.005; RB vs B1 seen, 0.013) are the ones most likely to be chance.
- **The seen rule flatters every method, the model most** (plan section 6): a player on the field who got no look is excluded. The sensitivity reading corrects for that, and it is the reading in which red-zone share does worse against B1b, not better.
- **The team-flag test has one run-first team.** Nothing about the flags is settled.
- **Early-season fixture thinness.** In fold 3, 21 of 32 teams had fewer than 20 red-zone plays over two weeks, and ATL shows 0 red-zone plays in weeks 1-2 in `fold-03-team-flags.json`. *Inference:* red-zone shares built on fewer than 20 team plays are lumpy by construction, which is part of why the signal is weak this early; whether it strengthens with more weeks is exactly what the next fold tests.
- **Secondary outcomes were not scored.** The plan (section 2) says red-zone touches and TDs are reported against the same projection, and targets and carries reported separately. The committed per-row files carry `actual_touches`, `actual_tds`, `actual_targets` and `actual_carries`, but `summary.json` scores only looks. This document does not compute those metrics by hand. They are outside the decision rule, so no verdict above depends on them.

## Departures from the plan

**None in definitions.** The outputs name the plan (`summary.plan`), use its bootstrap (2,000 resamples, seed 20261001, team-week unit), its 30 player-week minimum and its top-N sizes (12 / 6 / 8), and the recompute check shows a maximum absolute difference of **0** between the kneel/spike-filtered shares and the committed `red-zone.json` in both folds (`summary.recompute_check`).

Two things fall short of the plan without changing a definition:

1. Fold 1-3 -> 4 is not run because week 4 is not yet in the play-by-play (plan section 6 anticipates this). It is added by re-running the backtest command once week 4 is played.
2. The secondary outcomes (touches, TDs, separate targets and carries) are in the per-row files but not summarised - see the caveat above.

What this run could not verify: whether any commit after #144 amended the plan. `git log` on the plan file and the `gh api` commits query both needed an approval this run does not have. The plan's text as read carries no amendment, and no output names one.

## Outputs used

- `data/nflverse/2026/backtest/summary.json` - verdicts, intervals, `n`, exclusions, team-flag summary, recompute check.
- `data/nflverse/2026/backtest/fold-02-predictions.json`, `data/nflverse/2026/backtest/fold-03-predictions.json` - per-player rows (used only for the B1-scale example and to confirm which secondary outcomes exist).
- `data/nflverse/2026/backtest/fold-02-team-flags.json`, `data/nflverse/2026/backtest/fold-03-team-flags.json` - team labels and `next_week` results.
- `data/nflverse/2026/week-04/red-zone-ranking.json` - the forward week-4 ranking, not read for any finding here; it is what these findings say not to trade on at WR.
- Plan: `docs/research/red-zone-backtest-plan.md`.
- All inputs: nflverse, CC-BY 4.0, fetched 2026-10-01 (`summary.inputs`).
