# Does red-zone share start working later in the season, or for bigger red-zone offences? Backtest findings, 2025 weeks 1-17

Issue #156, parent #150. Reads the committed outputs of #155 (`data/nflverse/2025/backtest/`) and judges them only by [`red-zone-backtest-plan.md`](red-zone-backtest-plan.md) and its [2025 addendum](red-zone-backtest-plan-2025-addendum.md). Nothing here is recomputed or re-tuned. Every number is copied from a committed file, except where a line says it is a sum or a count of committed numbers, and then it says which ones.

**Decision served.** When a sit/start or trade rationale reaches for a player's red-zone share, should it - from some week on, for some positions, or for players on high-volume red-zone teams - instead of overall target share?

## The answer first

- **WR: no, at any point in the season.** Red-zone share never settles as better than overall target share (B1). Over the full season it ranks next week's red-zone looks *worse* than overall target share in both readings. Cite overall target share.
- **TE: no.** Same as WR against overall target share. Even against last week's red-zone looks alone (B2) it settles only from week 14, a single block.
- **RB: yes against overall target share, from week 2; no against overall target + carry share.** Red-zone share beats B1 in all four blocks (4 block beats of 252 verdicts), but B1 counts only targets, and running backs mostly get carries. Against target + carry share (B1b) the verdict is inconclusive in every block. If the rationale already has an RB's touch share, red-zone share adds nothing shown.
- **Team red-zone volume does not change any of that, with one thin exception.** At RB against B1, by looks per game, the edge appears for high-volume offences and not low-volume ones in 3 of 4 blocks, the bare minimum the addendum set.
- **Pass-first / run-first red-zone labels: do not cite them.** A labelled team kept its tendency the next week a little over half the time, and pass-first teams' pass-catchers got the same share of red-zone looks as run-first teams' (0.4099 vs 0.4119).

**79 of 252 verdicts** the run produced are "beats" (`beats_count`: 79). No correction for multiple comparisons was applied. **51 of those 79 are against B3 (the even split), 15 against B2 (last week alone), 13 against B1 (all at RB) and 0 against B1b.** B3 and B2 are floors; beating them is not beating overall usage.

## How to read the verdicts

The plan's section 4 rule, applied per position and baseline:

- **Beats**: the paired-bootstrap 95% interval for *model minus baseline* Spearman is entirely above 0, the MAE-difference interval is not entirely above 0, and the baseline's top-N Wilson interval is not entirely above the model's.
- **Loses**: the mirror image - the Spearman interval entirely below 0, *and* the MAE interval not entirely below 0, *and* the model's Wilson interval not entirely above the baseline's. That is how the committed `verdicts` read it: WR against B1 has a Spearman interval entirely below 0 and is still "inconclusive", because the model's MAE is better (see Question 1).
- **Inconclusive**: everything else, including n < 30.
- `combined_verdicts` keeps a verdict only when the **seen** reading (unseen players excluded) and the **sensitivity** reading (unseen players scored 0) agree.

Baselines: **B1** overall target share; **B1b** overall target + carry share; **B2** last week's red-zone looks alone; **B3** the team's red-zone looks split evenly over its WR/TE/RB with a target or carry. "The model" is `rz_look_share x team_rz_looks_per_game`.

**Multiplicity, as the addendum (section E) binds it.** The run produces 252 verdicts: 12 season-pooled, 48 block, 192 volume-stratum (`verdict_count`: 252). **79 of 252 verdicts are "beats"** (`beats_count`: 79). **No correction for multiple comparisons was applied.** Every "beats" below carries "of 252 verdicts". The split by baseline is a count of the `combined_verdicts` objects in `summary.json` (the 3 + 12 + 24 + 24 of them that hold the 252); its total matches `beats_count`:

| Baseline | Pooled (12) | Blocks (48) | Strata, running total (96) | Strata, looks per game (96) | Beats, of 252 verdicts |
|---|---|---|---|---|---|
| B1 overall target share | 1 | 4 | 4 | 4 | 13 beats of 252 verdicts, all RB |
| B1b overall target + carry share | 0 | 0 | 0 | 0 | 0 beats of 252 verdicts |
| B2 last week alone (weak floor) | 3 | 5 | 3 | 4 | 15 beats of 252 verdicts |
| B3 even split (weak floor) | 3 | 11 | 19 | 18 | 51 beats of 252 verdicts |
| Total | 7 | 20 | 26 | 26 | 79 beats of 252 verdicts |

At a 95% interval, a handful of "beats" among 252 is within what chance produces (addendum E). 66 of the 79 beats (of 252 verdicts) are against B2 and B3. Neither is a number a rationale would otherwise cite: B3 knows nothing about the player, and B2 is one week of red-zone looks. Beating them shows red-zone share carries *some* information about the player; it does not show it carries more than overall usage does.

## Question 1: from which week does red-zone share start working?

Source: `summary.settling_week`, `summary.blocks.<1-4>.<POS>.combined_verdicts`, `summary.positions.<POS>.combined_verdicts`.

Settling week (addendum C): the first week of the earliest block from which the combined verdict is "beats" in that block and every later block - 2, 6, 10, 14 or "none".

**Settling weeks, exactly as in `summary.json`:**

| Position | B1 | B1b | B2 | B3 |
|---|---|---|---|---|
| WR | none | none | none | 2 |
| TE | none | none | 14 | 6 |
| RB | 2 | none | none | 2 |

**Combined verdicts by block (target weeks), and pooled over all 16 folds:**

| Position | Baseline | Block 1 (W 2-5) | Block 2 (W 6-9) | Block 3 (W 10-13) | Block 4 (W 14-17) | Season pooled | Beats in this row, of 252 verdicts |
|---|---|---|---|---|---|---|---|
| WR | B1 | inconclusive | inconclusive | inconclusive | inconclusive | inconclusive | 0 of 252 verdicts |
| WR | B1b | loses | inconclusive | inconclusive | inconclusive | inconclusive | 0 of 252 verdicts |
| WR | B2 | inconclusive | beats | inconclusive | inconclusive | beats | 2 of 252 verdicts |
| WR | B3 | beats | beats | beats | beats | beats | 5 of 252 verdicts |
| TE | B1 | inconclusive | inconclusive | inconclusive | inconclusive | inconclusive | 0 of 252 verdicts |
| TE | B1b | inconclusive | inconclusive | inconclusive | inconclusive | inconclusive | 0 of 252 verdicts |
| TE | B2 | inconclusive | beats | inconclusive | beats | beats | 3 of 252 verdicts |
| TE | B3 | inconclusive | beats | beats | beats | beats | 4 of 252 verdicts |
| RB | B1 | beats | beats | beats | beats | beats | 5 of 252 verdicts |
| RB | B1b | inconclusive | inconclusive | inconclusive | inconclusive | inconclusive | 0 of 252 verdicts |
| RB | B2 | beats | beats | inconclusive | inconclusive | beats | 3 of 252 verdicts |
| RB | B3 | beats | beats | beats | beats | beats | 5 of 252 verdicts |

**Season-pooled intervals, model minus baseline** (`summary.positions.<POS>.<reading>.paired_bootstrap_model_minus_baseline`, `verdicts`), for the two baselines a rationale would otherwise cite:

| Position | Baseline | Reading | Spearman diff 95% | MAE diff 95% | Reading verdict | Combined |
|---|---|---|---|---|---|---|
| WR | B1 | seen | [-0.0956, -0.0237] | [-0.3207, -0.2501] | inconclusive | inconclusive |
| WR | B1 | sensitivity | [-0.0664, -0.0041] | [-0.3798, -0.322] | inconclusive | inconclusive |
| WR | B1b | seen | [-0.1028, -0.0341] | [-0.0412, -0.0082] | inconclusive | inconclusive |
| WR | B1b | sensitivity | [-0.0764, -0.0161] | [-0.0842, -0.0555] | inconclusive | inconclusive |
| TE | B1 | seen | [-0.1013, -0.0041] | [-0.1651, -0.0974] | inconclusive | inconclusive |
| TE | B1 | sensitivity | [-0.0502, 0.0212] | [-0.2307, -0.1815] | inconclusive | inconclusive |
| TE | B1b | seen | [-0.1109, -0.0204] | [-0.0195, 0.0162] | loses | inconclusive |
| TE | B1b | sensitivity | [-0.0624, 0.0052] | [-0.0508, -0.024] | inconclusive | inconclusive |
| RB | B1 | seen | [0.0714, 0.1533] | [-0.2592, -0.1224] | beats (1 of 252 verdicts, with the line below) | beats |
| RB | B1 | sensitivity | [0.0963, 0.1684] | [-0.1496, -0.0436] | beats (same pooled verdict, of 252 verdicts) | |
| RB | B1b | seen | [-0.0294, 0.0164] | [-0.014, 0.047] | inconclusive | inconclusive |
| RB | B1b | sensitivity | [0.0309, 0.0754] | [-0.117, -0.0625] | beats (reading only; not one of 252 verdicts) | |

Pooled Spearman, model vs B1 vs B1b (seen / sensitivity, `methods.*.pooled.spearman`): WR 0.2615 / 0.2981 vs 0.3209 / 0.3326 vs 0.3296 / 0.3437; TE 0.2771 / 0.3271 vs 0.3314 / 0.3436 vs 0.3439 / 0.3564; RB 0.5399 / 0.5775 vs 0.427 / 0.4454 vs 0.5456 / 0.5241.

**Per position, against overall target share (B1):**

- **WR: it never starts working.** Settling week "none"; inconclusive in all four blocks and pooled. Over the season the Spearman difference is entirely below 0 in both readings - red-zone share is the *worse* ranker - and the verdict is "inconclusive" rather than "loses" only because the model's MAE is smaller. *Inference, as #143 found for 2026:* that MAE edge is a scale effect, since B1 multiplies a share of *targets* by team red-zone *targets plus carries*; against B1b, which is on the right scale, the model's MAE is still smaller and its ranking still worse.
- **TE: it never starts working.** Settling week "none"; inconclusive in every block. The seen-reading Spearman interval is entirely below 0 against both B1 and B1b; the sensitivity reading crosses 0.
- **RB: it works from week 2.** Settling week 2: "beats" in all four blocks and pooled (5 beats of 252 verdicts in that row). It is the only position and the only non-floor baseline where it happens, and it does not extend to B1b: against overall target + carry share the RB verdict is inconclusive in every block, and pooled the seen reading crosses 0 while the sensitivity reading beats - so the two readings disagree.

Against the floors: red-zone share beats the even split from week 2 at WR and RB and from week 6 at TE. Against last week alone (B2) it settles only at TE, from block 4 (week 14): TE beats B2 in blocks 2 and 4 (of 252 verdicts) and not in block 3. WR beats B2 in block 2 only and RB in blocks 1 and 2 only (of 252 verdicts), so neither has a settling week there. Why the early edge over B2 fades is not something the plan tests; it is reported, not explained.

## Question 2: does a team red-zone volume threshold matter?

Source: `summary.volume_matters`, `summary.volume.<measure>.<block>.<High|Low>.<POS>.combined_verdicts`, `summary.volume_thresholds.per_fold`.

Rule (addendum D): a threshold matters for a measure, position and baseline if the combined verdict is "beats" in High and not "beats" in Low in at least k = 3 of 4 blocks. High = at or above the fold's median over the teams that played week W, from weeks `< W` only.

**`volume_matters`, all 24, exactly as in `summary.json`:**

| Measure | Position | B1 | B1b | B2 | B3 |
|---|---|---|---|---|---|
| team_rz_total | WR | false | false | false | false |
| team_rz_total | TE | false | false | false | false |
| team_rz_total | RB | false | false | false | false |
| team_rz_looks_per_game | WR | false | false | false | false |
| team_rz_looks_per_game | TE | false | false | false | false |
| team_rz_looks_per_game | RB | **true** | false | false | false |

**The one `true`: RB against B1, by looks per game (measure (b) only, not the running total).** The block verdicts behind it, High / Low:

| Measure | Block 1 | Block 2 | Block 3 | Block 4 | Blocks with High beats and Low not, of 4 |
|---|---|---|---|---|---|
| team_rz_looks_per_game | beats / inconclusive | inconclusive / beats | beats / inconclusive | beats / inconclusive | 3 (blocks 1, 3, 4); 4 beats of 252 verdicts in this row |
| team_rz_total | beats / inconclusive | inconclusive / inconclusive | beats / beats | beats / inconclusive | 2 (blocks 1, 4); 4 beats of 252 verdicts in this row |

So it holds for (b) only. It clears k = 3 exactly; in block 2 it runs the other way (Low beats of 252 verdicts, High does not); and under the running total it fails in block 3 because both strata beat.

**What the threshold was, in looks** (`volume_thresholds.per_fold`, per-fold medians, nobody chose them):

| Fold W | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Teams that played W | 32 | 32 | 32 | 28 | 30 | 30 | 26 | 28 | 28 | 30 | 28 | 32 | 28 | 32 | 32 | 32 |
| Median running total (looks) | 7 | 14 | 22 | 30.5 | 38.5 | 49.5 | 53 | 63.5 | 70.5 | 78 | 88 | 93.5 | 100.5 | 113.5 | 121.5 | 129 |
| Median looks per game | 7 | 7 | 7.3333 | 7.625 | 8.5 | 8.3333 | 8.2262 | 8.5 | 8.4375 | 8.3889 | 8.8 | 8.4545 | 8.375 | 8.7308 | 8.6786 | 8.6 |

At a mid-season fold, W = 10, "High" meant at least **70.5** red-zone looks over weeks 1-9, or at least **8.4375** red-zone looks per game. From fold 6 on the looks-per-game median sits between 8.2262 and 8.8.

**Running total vs looks per game, once the week is fixed.** Addendum D expected them to split teams almost identically, because within a fold a running total is looks per game times games played, and games played differs only by a bye. The output bears that out. In blocks 1 and 4 the scored player-weeks in every High and Low stratum are identical under the two measures, in both readings (for example block 4 WR High 265 / 413 under each, `volume.<measure>.4.High.WR.<reading>.n`). In blocks 2 and 3 - the blocks with byes behind them - they differ by a handful:

| Block | Stratum | Position | Running total n (seen / sens.) | Looks per game n (seen / sens.) |
|---|---|---|---|---|
| 2 | High | WR | 249 / 334 | 242 / 328 |
| 2 | High | TE | 128 / 181 | 127 / 176 |
| 2 | High | RB | 152 / 205 | 151 / 204 |
| 2 | Low | WR | 215 / 298 | 222 / 304 |
| 2 | Low | TE | 114 / 172 | 115 / 177 |
| 2 | Low | RB | 148 / 190 | 149 / 191 |
| 3 | High | WR | 266 / 378 | 265 / 382 |
| 3 | High | TE | 131 / 205 | 137 / 208 |
| 3 | High | RB | 156 / 243 | 159 / 241 |
| 3 | Low | WR | 235 / 351 | 236 / 347 |
| 3 | Low | TE | 131 / 193 | 125 / 190 |
| 3 | Low | RB | 150 / 213 | 147 / 215 |

*Inference:* identical counts in block 1 (features from weeks 1-4) and block 4 (every team that plays week 14-17 has already had its bye) are what the bye explanation predicts; `summary.json` carries no per-team stratum, so which teams moved is not visible in the committed output.

**Where the verdicts differ between the two splits** - 4 of the 96 paired stratum verdicts:

- Block 2, High, WR vs B2: running total inconclusive, looks per game beats (1 of 252 verdicts).
- Block 2, Low, RB vs B1: running total inconclusive, looks per game beats (1 of 252 verdicts).
- Block 3, High, TE vs B3: running total beats (1 of 252 verdicts), looks per game inconclusive.
- Block 3, Low, RB vs B1: running total beats (1 of 252 verdicts), looks per game inconclusive.

Two of the four are RB vs B1, which is why that cell is `true` under one measure and `false` under the other. A determination that flips on a few player-weeks moving between strata is a thin one.

**Read plainly:** a big running red-zone total is mostly a later week, and question 1 already covers the week. Read under looks per game (addendum D's question 2), more volume per game does not make red-zone share outrank overall usage at WR or TE, and against touch share (B1b) at no position. The single `true` - RB vs overall target share - is a comparison red-zone share already wins pooled over every team, so it says that edge is concentrated in high-volume offences, not that a new edge appears.

## Question 3: do red-zone pass-first / run-first labels hold?

Source: `summary.team_flags`, and the `fold-<W>-team-flags.json` files.

**Section 5 "held up" tests, over all 16 folds, exactly as the plan fixes them:**

| Label | Team-folds labelled | Distinct teams | Tendency kept / tested | Wilson 95% | pc_targets / rz_looks (week W) | pc_share | Wilson 95% |
|---|---|---|---|---|---|---|---|
| Pass-first | 124 | 20 | 70 / 122 | 0.4851-0.658 | 437 / 1066 | 0.4099 | 0.3808-0.4397 |
| Run-first | 52 | 10 | 29 / 52 | 0.4234-0.6841 | 201 / 488 | 0.4119 | 0.3691-0.4561 |

- **Tendency kept:** pass-first teams threw at a higher rate than the league in the red zone the next week 70 times in 122; run-first teams ran more than the league 29 times in 52. The plan attaches no pass/fail verdict to this test, only the interval. *Inference:* both intervals include one half, so neither label has been shown to predict the next week's side of the league rate better than a coin.
- **Pass-catchers' share:** `pc_share_gap` **-0.002**, `pc_share_verdict` **inconclusive**. The rule needs pass-first to exceed run-first by at least 0.10 with non-overlapping intervals; they are the same to two decimal places and the intervals overlap almost entirely. Both groups clear the 3-team minimum (20 and 10 teams), so this is inconclusive on the evidence, not on sample size.

Per fold (`team_flags.per_fold`): fold 2 labelled 1 team (31 too few plays), fold 3 labelled 11, fold 4 28, fold 5 31, and every fold from 6 on labelled all 32. Sacks in the red-zone pass-play numerator, as nflverse's `pass` flag records them: 10 of 135 in fold 2, rising to 146 of 2,467 in fold 17 (`sacks_in_numerator`, `rz_pass_plays`).

**All-field context - this label carries no verdict.** Addendum F computes an all-field pass-first / run-first label for context only: it is not tested against week-W behaviour, does not enter either "held up" test, and is not a baseline. How often a team's red-zone label differs from its all-field label (`label_disagreements`):

| Fold W | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Labelled under both | 1 | 11 | 28 | 31 | 32 | 32 | 32 | 32 | 32 | 32 | 32 | 32 | 32 | 32 | 32 | 32 |
| Labels differ | 1 | 1 | 16 | 17 | 20 | 18 | 14 | 15 | 23 | 18 | 14 | 11 | 10 | 13 | 10 | 11 |
| Red-zone label only | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

Summed over the 16 folds (a sum of the committed per-fold counts): **212 of 455** team-folds labelled under both definitions carry a different red-zone label from their all-field label. From fold 4 to fold 10 that is about half or more of the league each week; from fold 13 on it is 10-13 of 32. Whatever a team's red-zone label says, it is often not what its overall pass/run tendency says - and neither label has a verdict that says it predicts anything.

## 2025 against 2026

Source: `data/nflverse/2026/backtest/summary.json` (`positions.<POS>.combined_verdicts`, `team_flags`), as written up in [#143](143-red-zone-backtest-findings.md). **The seasons are not pooled** (addendum A). 2026 has **two folds** (W = 2, 3); 2025 has **sixteen**.

| Position | Baseline | 2025 pooled (16 folds) | 2026 pooled (2 folds) |
|---|---|---|---|
| WR | B1 | inconclusive | inconclusive |
| WR | B1b | inconclusive | inconclusive |
| WR | B2 | beats (1 of 252 verdicts) | inconclusive |
| WR | B3 | beats (1 of 252 verdicts) | beats (a 2026 verdict, outside the 2025 count of 252 verdicts) |
| TE | B1 | inconclusive | inconclusive |
| TE | B1b | inconclusive | inconclusive |
| TE | B2 | beats (1 of 252 verdicts) | inconclusive |
| TE | B3 | beats (1 of 252 verdicts) | inconclusive |
| RB | B1 | beats (1 of 252 verdicts) | inconclusive |
| RB | B1b | inconclusive | inconclusive |
| RB | B2 | beats (1 of 252 verdicts) | inconclusive |
| RB | B3 | beats (1 of 252 verdicts) | beats (a 2026 verdict, outside the 2025 count of 252 verdicts) |

**They agree on 7 of 12 cells and never point opposite ways.** Each of the 5 differences is a 2025 "beats" (of 252 verdicts) where 2026 is inconclusive; four of them are against the floors B2 and B3. The one that matters is **RB vs B1**: 2026's two folds could not separate it (#143: "beats" in the seen reading, not the sensitivity reading), and 2025's sixteen do, in every block. On the question #150 asked - is 2026's "does not beat overall target share" an artefact of two thin folds? - **at WR and TE, no: 2025 says the same thing over a full season. At RB, partly: it beats target share but still not target + carry share, in either season.**

Team labels: 2026 had 4 of 6 pass-first and 0 of 1 run-first team-folds keep their tendency, and an inconclusive `pc_share_verdict` with one run-first team; 2025 has enough teams (20 and 10) and is still inconclusive, with a gap of -0.002.

## What to lean on it for

For a sit/start or trade call. Each bullet names the verdict it rests on.

- **WR: cite overall target share, not red-zone share, in any week of the season.** Rests on: B1 settling week "none", combined verdict inconclusive in all four blocks and pooled, with the pooled Spearman difference entirely below 0 in both readings. Do not pay extra in a trade for a receiver's red-zone share, and do not sell one for a low one.
- **TE: cite overall target share, not red-zone share.** Rests on: B1 and B1b settling week "none", inconclusive in every block. Whether last week's red-zone looks or red-zone share is the better TE number is unsettled (TE vs B2 settles at week 14, beats in blocks 2 and 4 only, of 252 verdicts).
- **RB: red-zone share may be cited over overall *target* share from week 2, but not over overall target + carry share - so if the rationale has touch share, cite that.** Rests on: RB B1 settling week 2, beats in all four blocks and pooled (5 beats of 252 verdicts, no correction applied); RB B1b settling week "none", inconclusive in every block and pooled.
- **Team red-zone volume: it should not change any of the above.** Rests on: 23 of 24 `volume_matters` false. The one `true` (RB vs B1, looks per game only) says the RB edge over target share is concentrated in offences at or above about 8.4 red-zone looks per game, met at exactly k = 3 of 4 blocks and not under the running total - **inconclusive** as a reason to weight an RB's red-zone share by their team's volume.
- **Red-zone pass-first / run-first label: not worth citing.** Rests on: `pc_share_verdict` inconclusive (gap -0.002, over 20 pass-first and 10 run-first teams), and tendency kept 70 of 122 and 29 of 52 with intervals that include one half. The all-field label has no verdict at all and is not a substitute.

## On how many player-weeks?

Source: `n` under each reading in `summary.positions.<POS>`, and `summary.excluded_player_weeks.by_fold`.

**Scored player-weeks, all 16 folds (seen / sensitivity):** WR **1983 / 2752**; TE **1024 / 1511**; RB **1257 / 1732**. Every block and stratum clears the 30 player-week minimum (the smallest stratum is block 1 Low WR, 95 / 128), so no verdict here is inconclusive for lack of sample.

**Excluded player-weeks by reason, summed over the 16 folds** (sums of the committed per-fold counts; `null_share` is 0 in every fold):

| Position | Bye | Not seen\* | No history | No target or carry before W | Null share | Total (seen reading) |
|---|---|---|---|---|---|---|
| WR | 208 | 769 | 0 | 306 | 0 | 1283 |
| TE | 119 | 487 | 0 | 194 | 0 | 800 |
| RB | 137 | 475 | 0 | 211 | 0 | 823 |
| unknown | 0 | 0 | 39 | 0 | 0 | 39 |

\* Excluded only in the seen reading; the sensitivity reading scores them as 0. The not-seen sums are exactly the difference between the two readings' `n`: WR 2752 - 1983 = 769, TE 1511 - 1024 = 487, RB 1732 - 1257 = 475. Bye exclusions fall in folds 5-12 and 14; folds 2-4, 13 and 15-17 have none. "No history" counts players with a week-W red-zone look and no stats row before W, so their position is unknown. Per-fold counts are in `excluded_player_weeks.by_fold`.

## Caveats

- **No multiplicity correction** across the 79 beats of 252 verdicts. The RB-vs-B1 result is the strongest "beats" against a real baseline because it repeats in all four blocks, both readings and the pooled season; the `volume_matters` `true` is the weakest, resting on k = 3 exactly and on one measure.
- **The seen reading flatters every method, the model most** (plan section 6). Every verdict above is the combined one, which needs the sensitivity reading to agree.
- **"Inconclusive" at WR against B1 is not "close".** Pooled over the season the model's ranking is worse in both readings; the rule's MAE clause is what stops it reading "loses".
- **Secondary outcomes** (touches, TDs) are in `summary.json` (#149) but outside the decision rule and outside the questions of #150; this document does not read them.
- **Recompute check:** maximum absolute difference 0 between the kneel/spike-filtered shares and the committed red-zone tables (`recompute_check.max_abs_diff`).

## Departures from the plan

None. Season 2025, weeks 1-17, 16 folds (`folds`), the bootstrap as fixed (2,000 resamples, seed 20261001, team-week unit, `bootstrap`), the 30 player-week minimum (`minimum_scored_player_weeks`), blocks 2-5 / 6-9 / 10-13 / 14-17, per-fold medians and k = 3 (`volume_matters_rule`), all as the addendum fixes them. Nothing was recomputed, no threshold, block or k chosen, and no file under `data/` added.

What this run could not do: tabulate per-fold metrics or per-team strata by script - `node` was refused in this run, so every count here was read from the committed JSON, and every sum above is stated as one and cross-checked where the file allows (the not-seen sums against `n`, the baseline split against `beats_count`).

## Outputs used

- `data/nflverse/2025/backtest/summary.json` - settling weeks, pooled, block and stratum verdicts and intervals, `volume_matters`, `volume_thresholds`, `team_flags`, `n`, exclusions, `verdict_count`, `beats_count`.
- `data/nflverse/2025/backtest/fold-<W>-team-flags.json` - schema of the per-team rows (fold 10 read).
- `data/nflverse/2026/backtest/summary.json` - 2026 combined verdicts and team-flag results.
- Plan: `docs/research/red-zone-backtest-plan.md`; addendum: `docs/research/red-zone-backtest-plan-2025-addendum.md`; 2026 findings: `docs/research/143-red-zone-backtest-findings.md`.
- All inputs: nflverse, CC-BY 4.0 (`summary.attribution`).
