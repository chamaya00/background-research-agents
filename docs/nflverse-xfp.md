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

## Limits

- **League-average values.** Every target in a bucket is worth the same, whoever threw it and whoever covered it.
- **No opponent or quarterback adjustment yet.** That is v2.
- **Three weeks is a small sample.** Bucket values with a small n, and per-game numbers over 2-3 games, move a lot week to week.
- Weekly stats can differ from play-by-play totals by a play or two (lateral plays, nullified plays); both are printed from their own source.
