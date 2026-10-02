# `nflverse-cli profile`: a receiver's role and floor / typical / ceiling

Issue #159, parent #158. Prints, for each named receiver, what the weekly nflverse data says about the role and a rough half-PPR range. It prints to the terminal and writes nothing, under `data/` or anywhere else.

## Run it

```
npm run build
node dist/nflverse-cli.js profile --season <yyyy> --week <W> --player "<name>" [--player "<name>" ...]
```

`--week W` is the week being looked ahead to. Only regular-season weeks `< W` feed any number (the same leakage rule as ADR 0008). The next game (opponent, home/away, total, implied total, spread, roof) and the injury report are week `W` itself, because they are what is known before it is played. `W` must be 2 or more.

It fetches the five nflverse inputs like `tables` does (no new source), joins play-by-play to players on `player_id` from the player stats, and never on names; the name you type only picks the player out of the stats rows. Snap counts use the nickname-fallback join already in `buildUsage`.

A name that matches no player, or more than one, is reported (with each candidate's team for more than one) and never guessed; the other names still print. The exit code is non-zero only for invalid arguments.

## What it prints

Role: target share and rank among team WRs, targets over team targets, air-yard share, snap share overall and by week. Weekly: targets, share, line and half-PPR points. Play-by-play: aDOT, targets by depth band (<=0, 1-9, 10-19, 20+), pass location, third-down targets against the team's, catch rate, first downs, yards per target, red-zone targets and carries against the team's. Team: top four pass-catchers by target share with games played, plays per game, pass rate, pass rate over expected. Next game and injury status. Then the heuristic.

Spread: nflverse `spread_line` is positive when the home team is favored. The profile prints it from the player's team's side (home: as is; away: sign flipped, so positive means the player's team is favored) and also prints the raw value.

## The heuristic

Half-PPR, from the weeks used (every game the player has a row for before week `W`; the number is printed):

- points per target before TDs = (0.5 x receptions + 0.1 x (receiving + rushing yards) - 2 x fumbles lost) / targets, summed over those weeks. Rushing is included.
- **floor** = min weekly targets x points per target x 0.8
- **typical** = mean weekly targets x (points per target + 0.27)
- **ceiling** = max weekly targets x points per target x 1.2 + 6

The constants (0.8, 0.27, 1.2, 6) are fixed and tuned to no player. With no targets the three numbers print as n/a.

## Limits

- **It is a heuristic, not a model, and not a projection.** It restates past volume and efficiency as a range.
- **Three weeks is a small sample.** Early in a season the min and max of two or three weekly target counts are noisy, and a role change inside the window is invisible.
- Nothing here adjusts for opponent, game script or injuries to teammates; those are printed beside it, not folded in.
- What target share does and does not predict is in the backtest findings: [#143, 2026 weeks 1-3](research/143-red-zone-backtest-findings.md) (red-zone share does not beat overall target share, for any position) and [#150, 2025 weeks 1-17](research/150-red-zone-backtest-2025-findings.md) (the same question over a full season, with the strata and the 252-verdict multiplicity caveat). Read those before leaning on a red-zone line.

Data © the nflverse project, https://github.com/nflverse/nflverse-data, used under CC-BY 4.0. Snap counts originate at Pro-Football-Reference.
