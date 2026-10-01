# NFL 2026 week 4 sit/start from this repository's computed tables - Sunday and Monday games

**Week: 4, not 5.** The derived tables landed on `main` in #135 on
2026-10-01, before Sunday's 09:30 ET kickoff, so this covers week 4's Sunday
and Monday games: #118's games 2-8 and all eight of #119's (15 games). The
Thursday game, Steelers at Browns, has been played by the time this is read
and is left out.

**Decision this serves:** which players to start, flex or sit in a 12-team,
half-PPR, one-QB lineup, with every call resting on numbers this repository
computed rather than on numbers quoted from another site.

**Status:** in progress. Game sections are added a game or two at a time.

## Week synthesis

_To be written once the game sections are in._

## How to read a citation

Every number is cited as a value followed by its table file and column, for
example ``0.2451 (`usage.json` `pooled.target_share`)``. All four tables are
in [`data/nflverse/2026/week-04/`](../../data/nflverse/2026/week-04/), built
from nflverse files fetched at 2026-10-01T08:16Z; their schema is
[ADR 0008](../decisions/0008-derived-weekly-tables-schema.md).

- `usage.json`: `pooled.*` is weeks 1-3 pooled (Σ player / Σ team over the
  games the player has a row in); `last_week.*` is week 3 alone. Shares are
  fractions, quoted as in the table (0.2451 = 24.5%).
- `points-allowed.json`: half-PPR points per game the opponent's defense has
  allowed to the position over weeks 1-3, `rank` 1 = most allowed of 32.
  Cited as `per_game` and `rank` for the row (`defense`, `position`).
- `game-environment.json`: `spread_line`, `total_line`, and
  `home_implied_total` / `away_implied_total` = (total ± spread) / 2.
- `injuries.json`: `report_status` and `practice_status`. Absent means the
  player is not on the week 4 report as fetched.

**What the tables do not hold, and so stays out of the rationale:**

- **Red zone and pace.** #129's tables are not on `main`. No call uses
  red-zone share.
- **Routes.** Snap share (`snap_share`) stands in for route participation,
  and every tight-end call says so.
- **Weather.** Not used in any call. No external forecast was read.
- **D/ST.** The tables have no defense scoring. A D/ST call rests on the
  opponent's implied total, the spread, and the opposing quarterback's
  production and the defense's own QB points allowed from the tables.
- **Depth-chart news after 08:16Z on 2026-10-01**, including Friday's final
  statuses.

## Game-time decisions

_To be written once the game sections are in._

## Games

## Comparison with #118 and #119

_To be written once the game sections are in._
