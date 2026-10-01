# Red-zone usage backtest: 2025 addendum

Issue #151, parent #150. **Committed before any 2025 outcome is computed.**
An addendum to [`red-zone-backtest-plan.md`](red-zone-backtest-plan.md) (#144),
written from that plan, [the 2026 weeks 1-3 findings](143-red-zone-backtest-findings.md),
ADR 0008 and its amendments, `src/redzone-backtest.ts`, `src/backtest-stats.ts`
and the schema of `data/nflverse/2026/backtest/summary.json`. **No 2025 week-W
outcome was computed or read to write it, and no 2026 outcome beyond what is
already committed.**

**Decision served.** Whether the 2026 reading (red-zone share does not beat
overall target share) is an artefact of two folds on thin features, by asking
the three questions of #150 on a full season: (1) does the model start beating
the baselines from some week on; (2) does it work better for teams with more
red-zone volume; (3) do red-zone-specific pass-first / run-first labels hold.

## A. Inheritance

**Sections 1-7 of the plan apply unchanged to 2025.** That is the look
definition, the model, B1 / B1b / B2 / B3, the three metrics, the paired
bootstrap (2,000 resamples, seed 20261001, resampling team-weeks), the two
readings that must agree, "n < 30 scored player-weeks is inconclusive", the
section 5 labels and cut-offs (0.60 / 0.45, 20 plays, the two "held up" tests)
and the section 6 eligibility rules. This addendum quotes none of their values
except where noted, and restates none with a different value. Section 8 is
unchanged: the evaluation code and write-up are separate issues.

Additions, by section of the plan:

| Plan section | Addition | Where here |
|---|---|---|
| 6 (Folds) | The 2025 fold list, replacing the 2026 list for this season only | B |
| 4 (Decision rule) | The same verdict computed per week block, and per volume stratum (cut within each fold, pooled by block) | C, D |
| 4 (Multiplicity) | The count of verdicts, and a binding on the write-up | E |
| 5 (Labels) | An all-field label for context, and a per-fold disagreement count | F |
| 7 (Change rule) | Carried over, covering the new values | G |

2025 is a separate season, run and written up separately. It is not pooled
with 2026.

## B. Season and folds

- **Season 2025, regular-season weeks 1-17.**
- **16 expanding-window folds, W = 2..17** (fold W uses features from weeks
  `< W` and outcomes from week W), run as
  `node dist/nflverse-cli.js backtest --season 2025 --through 17` with `--out`
  a temporary directory outside `data/`.
- **Week 18 is excluded.** It is the week in which teams that have clinched
  rest starters, which breaks the premise that a player's past usage projects
  his week-W usage. This is a reason from the calendar, fixed before any 2025
  outcome is read; it is not a result of looking at week 18.
- **No 2025 forward ranking is committed under `data/`.** The command writes a
  `week-18/red-zone-ranking.json` for the week after the last completed one;
  that file, and every other output of the run, stays outside `data/`. The
  results write-up carries the numbers it cites.

## C. Question 1: from which week does the model beat the baselines?

**Blocks.** Four contiguous, non-overlapping blocks of four folds, covering
W = 2..17 exactly:

| Block | Target weeks W | Folds |
|---|---|---|
| 1 | 2-5 | 4 |
| 2 | 6-9 | 4 |
| 3 | 10-13 | 4 |
| 4 | 14-17 | 4 |

**Verdicts.** Within each block, the plan's section 4 verdict is computed per
position (WR, TE, RB) and per baseline (B1, B1b, B2, B3), pooled over the
block's folds, under both readings, with `combined_verdicts` (inconclusive
where the readings disagree or n < 30). Top-N hit rates use N x (folds in the
block) slots as in the plan. The plan's verdicts pooled over all 16 folds are
also reported, as the headline of the season.

**Settling week.** For a position and baseline, the settling week is the first
week of the earliest block from which the combined verdict is "beats" in that
block and in every later block: 2, 6, 10 or 14. It is "none" if no such block
exists. Block 4 alone being "beats" gives 14; a block 4 that is not "beats"
gives "none". 12 settling weeks are reported (3 positions x 4
baselines).

**Per-fold numbers** are reported for every fold and are not decisive.

## D. Question 2: does a team red-zone volume threshold matter?

**Volume measures**, per team T and fold W, from weeks `< W` only (features,
never week-W outcomes):

- **(a) `team_rz_total(T)`**: the running total of T's red-zone looks, targets
  plus carries, the plan's look definition.
- **(b) `team_rz_looks_per_game(T)`**: the plan's section 1 definition.

**Strata.** Running totals rise with the calendar, and inside a block they
still climb from fold to fold (in block 1 a W=2 team has one game of looks and
a W=5 team four). A cut pooled over the block would put the late folds in High
and the early folds in Low, so week is held apart from volume by cutting
**within each fold**:

- For each measure and fold W, the threshold is the **median of that measure
  over the teams that played week W**, from weeks `< W` only (one value per
  team, computed from features, never from week-W outcomes).
- A team-fold is **High** if its value is `>=` its own fold's median, otherwise
  **Low**. Players take their team's stratum.
- A block's High stratum **pools the High team-folds of the block's four
  folds**, and its Low stratum pools the Low ones. Stratum verdicts are for
  these pooled strata, per block.
- The thresholds are computed by the run, **the per-fold medians are written to
  the output** (so the write-up can say what a given total was in looks), and
  nobody chooses them.
- The same bootstrap, readings, eligibility and n < 30 rule apply per stratum,
  resampling team-weeks within the stratum. A stratum with fewer than 30 scored
  player-weeks for a position is inconclusive.

**What (a) and (b) are, once week is fixed.** Within one fold, a team's running
total equals its looks per game times its games played, and games played
differs only by a bye. So (a) and (b) give nearly the same split inside a fold,
and (a) is expected to agree with (b). (a) is kept because the person asked
about the running total; the write-up reports where the two disagree, for
example teams just past a bye. For #150's question 2: a larger running total
that comes from **more weeks** is question 1; one that comes from **more volume
per game** is question 2, read under (b).

**A volume threshold matters** for a measure, position and baseline if the
combined verdict is **"beats" in the High stratum and not "beats" in the Low
stratum in at least k = 3 of the 4 blocks.** k = 3 is fixed now. Anything else
is "no volume effect shown". 24 such determinations are reported (2 measures x
3 positions x 4 baselines). Where it holds for (a) only or (b) only, the write-up
says which.

## E. Multiplicity

The 2025 run produces **252 verdicts**:

- 12 pooled over all 16 folds (3 positions x 4 baselines);
- 48 block verdicts (12 x 4 blocks), question 1;
- 192 stratum verdicts (12 x 4 blocks x 2 measures x 2 strata), question 2.

The settling weeks (12) and the threshold determinations (24) are derived from
these and add no verdicts. **No correction for multiple comparisons is
applied.** At a 95% interval, a handful of "beats" among 252 is within what
chance produces. **The findings must state "of 252 verdicts" next to every
"beats" they report**, and say how many of the 252 were "beats".

## F. Question 3: red-zone-specific labels, with all-field context

- **Red-zone labels and both "held up" tests run over all 16 folds, exactly as
  section 5 of the plan fixes them.** Nothing there changes.
- **All-field pass rate**, for context only: for team T over weeks `< W`,
  `pass / (pass + rush)` over **all plays at any field position** with
  `play_type` in {pass, run}, excluding `qb_kneel = 1`, `qb_spike = 1` and
  `two_point_attempt = 1`. Labelled with the same cut-offs (pass-first >= 0.60,
  run-first <= 0.45, neutral strictly between) and the same minimum of 20 such
  plays, below which the team is not labelled. (That minimum is expected to
  bind on no team from fold 2 on, since a team has well over 20 plays in a
  game; it is kept so that nothing is re-chosen.)
- **Output per fold:** the count of teams **labelled under both definitions**
  whose red-zone label differs from their all-field label, with the number of
  teams labelled under both beside it, and the number labelled under the
  red-zone definition only.
- **The all-field labels carry no verdict.** They are not tested against week-W
  behaviour, do not enter the "held up" tests, and are not a baseline.

## G. Change rule

As in section 7 of the plan: nothing is tuned after results, **including the
block boundaries, the volume thresholds (per-fold medians) and k.** If a definition
proves unworkable, it changes only in a new commit whose message says why, and
the write-up reports both the original and the amended reading. A result that
disagrees with expectation is reported as is.

## H. What this addendum does not do

It computes no outcome and adds nothing under `data/`. `src/redzone-backtest.ts`
and `src/backtest-stats.ts` today produce verdicts only pooled over all folds,
blocks and strata do not exist there, and the all-field label is not computed;
the block, stratum and all-field output are an engineering change that this
addendum binds, in its own issue. The write-up is another.
