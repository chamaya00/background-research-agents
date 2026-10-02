# `nflverse-cli xfp`: expected fantasy points, v1

Issue #163, parent #161. Prints each team's pecking order, every WR/TE/RB's expected vs actual half-PPR points per game, and rankings by expected points. It prints to stdout and writes nothing, under `data/` or anywhere else.

## Run it

```
npm run build
node dist/nflverse-cli.js xfp --season <yyyy> --week <W> [--position WR|TE|RB] [--team XXX] [--top N]
```

`--week W` is the week being looked ahead to; it must be 2 or more. Only regular-season weeks `< W` feed any number (the leakage rule of ADR 0008). It fetches the same five nflverse inputs as `tables`; no new source. Invalid arguments exit non-zero.

`--team` limits the pecking orders and the rankings to one team; `--position` limits the rankings to one position; `--top N` shows the first N of each ranking. Pecking orders always cover all three positions.

## Plays

Regular season, weeks `< W`. Two-point tries, `qb_kneel = 1` and `qb_spike = 1` are excluded. Plays are tied to players by `receiver_player_id` / `rusher_player_id`, never by name.

- **Target:** `pass = 1` with a `receiver_player_id`.
- **Carry:** `rush = 1` with a `rusher_player_id` and `play_type = run`.

## Buckets and formulas

- **Targets:** air-yard band (`<=0`, `1-9`, `10-19`, `20+`, `na` when air yards are missing) x `rz` (`yardline_100 <= 20`) or `of`.
- **Carries:** `i5` (`yardline_100 <= 5`), `6-20`, or `of`.

Half-PPR points of one play:

- target: 0.5 per completion + 0.1 per receiving yard + 6 when `td_player_id` is the receiver;
- carry: 0.1 per rushing yard + 6 when `td_player_id` is the rusher.

A bucket's **league value** is the mean of those points over all plays in it. The table is printed with each bucket's value and n.

## Per player

WR, TE and RB only, from the stats rows (`buildUsage`):

- **xFP/g** = the sum of league values over the player's targets and carries / games played;
- **actual/g** = the sum of the same plays' points / games played;
- **diff** = actual - expected;
- also printed: target share, targets per game, carries per game, and red-zone looks (targets + carries at `yardline_100 <= 20`).

Fumbles lost and two-point conversions are not counted, on either side.

## Pecking orders

Each team's top four WR/TE/RB with 2+ games, by target share, with games played. The leader is **1** when 5+ share points ahead of #2 (then #2 is **2**); otherwise the top two are **1a / 1b**. The rest are **3** and **4**.

## Rankings

Overall and by position, by xFP/g. Players with fewer than 2 games are left out, and each ranking says how many.

## v2, v3 and v4 (#165)

All three are **adjusted or re-valued, not validated against v1**. The planned backtest (O16 on #126) is what will say whether any of them beats v1; until then they are printed, labelled, and not recommended over it. `--sort v1|v2|v3|v4` (default `v1`) picks the ranking key; v2 and v4 rank by next game, v3 by its xFP/g. The ranking carries v1, v2 retro, v2 next, v3, v4 retro, v4 next and actual per game. The CLI also fetches `collectInputs(season - 1)` for v3.

### The adjustment, for any value table V

Each play's *expected* value is V of its bucket; its *actual* value is the half-PPR above. A play is a target or a carry (its class), over weeks `< W`.

- **Defense factor**, defense D and class c: `f_def(D, c) = (A + K*m_c) / (E + K*m_c)`. A is the actual points of class-c plays against D (`defteam`), E their expected points, m_c the league mean V per class-c play.
- **Passer factor**, passer Q, targets only: `f_qb(Q) = (A + K*m_tgt) / (E + K*m_tgt)` over targets thrown by Q (`passer_player_id`).
- **K = 100 plays**, exported as `ADJUST_K`. A defense or passer with no plays has A = E = 0 and gets exactly 1.0.

**Why a fixed K.** K is the number of plays of league-average evidence a factor starts with, so a defense seen on 20 plays moves a fifth of the way to what it did and one seen on 300 moves three quarters. It is not tuned because tuning it on the weeks being predicted is leakage, and a K fitted on a season would be validated by the same season. The backtest may revisit it; this version does not.

The adjustment is one function of V (`buildAdjustment`); v2 is it applied to v1's values and v4 to v3's, with E and m_c computed under that table.

### v2

- **Retrospective** per player: the sum over his plays of V(bucket) x f_def(defteam, class), with each target also x f_qb(passer), divided by games.
- **Next game** per player: `v1 target xFP/g x f_def(opp, target) x f_qb(Q*) + v1 carry xFP/g x f_def(opp, carry)`. `opp` is his team's week-W opponent from the schedule; the ranking row names it ("vs" home, "@" away) and Q* by name. A team with no week-W game prints `bye` and no projection, and ranks last under `--sort v2` and `v4`.

**The starter rule.** Q* is the passer with the most `qb_dropback = 1` plays (by `passer_player_id`) in the team's latest regular-season game before W, ties broken by player_id. A team's week-W starter is not known from data before W, so this assumes last week's starter plays.

### v3

Values come from the entire previous regular season (season - 1, weeks 1-18), with v1's play filter and buckets. A player's xFP/g is the current season's plays (weeks `< W`) valued at those values. **Fallback:** a bucket with n = 0 in the previous season takes the current season's value, and the output lists which buckets fell back. The previous-season table is printed beside v1's (value and n of each).

### v4

v2's machinery on v3's values: a retrospective and a next game, with factors, E and m_c computed under v3's table.

### Leakage

Every v1-v4 number uses regular-season weeks `< W` of the current season and the previous season. The only week-W row read is the schedule, for the opponent.

## Limits

- **v1 is league-average.** Every target in a bucket is worth the same, whoever threw it and whoever covered it. v2 and v4 correct for that, unvalidated.
- **Factors on three weeks are thin.** At K = 100 a defense seen on a few dozen plays moves little from 1.0; that is the point of K.
- **The starter is assumed.** A quarterback change, injury or bye makes Q* wrong, and nothing here knows.
- **Three weeks is a small sample.** Bucket values with a small n, and per-game numbers over 2-3 games, move a lot week to week.
- Weekly stats can differ from play-by-play totals by a play or two (lateral plays, nullified plays); both are printed from their own source.
