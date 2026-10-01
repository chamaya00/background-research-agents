# nflverse derived tables: 2026, target week 4

Derived values only, computed by this repository from nflverse data
(https://github.com/nflverse/nflverse-data), used under CC-BY 4.0. Snap counts
originate at Pro-Football-Reference. No raw nflverse file is committed here.

- `usage.json`: per player, pooled over weeks 1-3 and for week 3 alone.
- `points-allowed.json`: half-PPR points allowed per game by each defense to
  QB, RB, WR and TE over weeks 1-3, ranked among 32 (1 = most allowed).
- `red-zone.json`: per player, targets and carries inside the 20 over weeks
  1-3 and their shares of the team's, from play-by-play. Names are
  play-by-play's abbreviated form (`J.Gibbs`); join on `player_id`.
- `team-pace.json`: per offense, plays per game, pass rate, neutral pass rate
  and pass rate over expected, weeks 1-3.
- `game-environment.json`: week 4 spread, total and implied team totals.
- `injuries.json`: week 4 report status as of the fetch time, one status per
  player for the week rather than a day-by-day trend.

Every file lists each of the five inputs' URL, fetch time and SHA-256. The schema, the
leakage rule (weeks before the target week only), the team-total rule and the
snap join are in `docs/decisions/0008-derived-weekly-tables-schema.md`.

Reproduce:

    npm ci && npm run build
    node dist/nflverse-cli.js tables --season 2026 --week 4 --out data/nflverse/2026/week-04

Same input SHA-256s give the same rows. Injury and line data move during the
week, so a re-run later in the week will change `injuries.json` and
`game-environment.json` and record new input hashes.
