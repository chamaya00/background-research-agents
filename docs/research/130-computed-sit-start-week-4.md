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
example ``0.2451 `usage.json:pooled.target_share` ``: open `usage.json`, find
the player's row, read `pooled.target_share`. All four tables are
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
  player is not on the week 4 report as fetched. When fetched, only two rows
  league-wide had a `report_status` (both Washington, both `Out`), and five
  teams in these games had no rows at all: ATL, CHI, NO, PHI and SEA. "Not on
  the report" for those five means "not posted yet", not "healthy".
- `pooled.half_ppr_points` is a three-week total over `games`; where a reason
  gives a per-game figure, it is that total divided by `games`, and both
  inputs are named.

**Calls.** 12-team, half-PPR, one-QB, the same player list as #118 and #119.
**Start** is a lineup player this week, **Flex** is a fringe start that
depends on the rest of a roster, **Sit** is a bench. For a QB or a D/ST, Flex
means a streaming-grade start: play it if your regular starter is out or on a
bye. Each call is a judgement over the cited numbers, not a formula.

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

Kickoff order. The number in brackets is the game's number in #118
(`116-…`) or #119 (`117-…`).

### 1. Colts at Commanders (London) - Sun 09:30 ET [#119 game 1]

Row `2026_04_IND_WAS`: spread -3.5 `game-environment.json:spread_line` (Colts
favored), total 47.5 `game-environment.json:total_line`; Colts 25.5
`game-environment.json:away_implied_total`, Commanders 22
`game-environment.json:home_implied_total`.

**Colts**

| Player | Call | Reason |
|---|---|---|
| QB Daniel Jones | **Flex** | Washington allows 27.38 to QBs, rank 2 `points-allowed.json:per_game,rank`, and the Colts' 25.5 `game-environment.json:away_implied_total` is the game's higher total, but his own output is 28.34 `usage.json:pooled.half_ppr_points` over 3 `usage.json:games` (9.4 a game) and 7.9 `usage.json:last_week.half_ppr_points`. A streamer, not a weekly start. |
| RB Jonathan Taylor | **Start** | Rush share 0.7952 `usage.json:pooled.rush_share` on 0.8895 `usage.json:pooled.snap_share` and 59 `usage.json:pooled.half_ppr_points` over 3 games; volume outweighs a Washington defense allowing 10.27 to RBs, rank 32 `points-allowed.json:per_game,rank`. Limited `injuries.json:practice_status` - on the game-time list. |
| RB Seth McGowan | **Sit** | Rush share 0.0723 `usage.json:pooled.rush_share`, snap share 0.1105 `usage.json:pooled.snap_share`, 1.9 `usage.json:pooled.half_ppr_points` in three games. |
| WR Josh Downs | **Start** | Target share 0.2553 `usage.json:pooled.target_share` and air-yards share 0.451 `usage.json:pooled.air_yards_share`, up to 0.3143 `usage.json:last_week.target_share`, against the defense allowing the most to WRs, 38.99, rank 1 `points-allowed.json:per_game,rank`. |
| WR Keenan Allen | **Flex** | Target share 0.2128 `usage.json:pooled.target_share`, 0.2571 `usage.json:last_week.target_share`, on 0.6368 `usage.json:pooled.snap_share`, in the rank-1 WR matchup above; 22.5 `usage.json:pooled.half_ppr_points` over 3 games caps him at WR3. Limited `injuries.json:practice_status` - on the game-time list. |
| WR Laquon Treadwell | **Sit** | Snap share 0.6474 `usage.json:pooled.snap_share` but target share 0.0532 `usage.json:pooled.target_share` and 0.0286 `usage.json:last_week.target_share`. |
| TE Tyler Warren | **Start** | Target share 0.234 `usage.json:pooled.target_share` on snap share 0.9211 `usage.json:pooled.snap_share` (snap share stands in for routes), against a defense allowing 19.07 to TEs, rank 2 `points-allowed.json:per_game,rank`. |
| D/ST Colts | **Sit** | Washington's 22 `game-environment.json:home_implied_total` is not low; Mariota scored 20.42 `usage.json:last_week.half_ppr_points` as the starter; the Colts allow 21.87 to QBs, rank 5 `points-allowed.json:per_game,rank`. |

**Commanders**

| Player | Call | Reason |
|---|---|---|
| QB Jayden Daniels | **Flex** | 32.4 `usage.json:pooled.half_ppr_points` over 2 `usage.json:games` with rush share 0.1875 `usage.json:pooled.rush_share`, against the Colts' 21.87 to QBs, rank 5 `points-allowed.json:per_game,rank`; Limited `injuries.json:practice_status`. A start if he is active - on the game-time list. |
| QB Marcus Mariota | **Sit** | 20.42 `usage.json:last_week.half_ppr_points` as the week 3 starter, 29.16 `usage.json:pooled.half_ppr_points` over 2 games, and a 22 `game-environment.json:home_implied_total`; a one-QB start only if Daniels sits. Both QBs get a call because the starter is not known. |
| RB Jacory Croskey-Merritt | **Flex** | Rush share 0.4896 `usage.json:pooled.rush_share`, up to 0.5938 `usage.json:last_week.rush_share` on 0.5652 `usage.json:last_week.snap_share`, against the Colts' 25.93 to RBs, rank 5 `points-allowed.json:per_game,rank`, with White DNP `injuries.json:practice_status`. Target share 0.0323 `usage.json:pooled.target_share` keeps the floor low. |
| RB Rachaad White | **Sit** | Did Not Participate `injuries.json:practice_status`; rush share 0.2292 `usage.json:pooled.rush_share` and target share 0.0968 `usage.json:pooled.target_share` in a split. On the game-time list. |
| WR Terry McLaurin | **Start** | Target share 0.2366 `usage.json:pooled.target_share`, 0.3 `usage.json:last_week.target_share`, air-yards share 0.4564 `usage.json:last_week.air_yards_share`, against the Colts' 29.67 to WRs, rank 11 `points-allowed.json:per_game,rank`. |
| WR Stefon Diggs | **Flex** | Target share 0.2366 `usage.json:pooled.target_share` on snap share 0.5762 `usage.json:pooled.snap_share`; 38 `usage.json:pooled.half_ppr_points` over 3 games but 5.3 `usage.json:last_week.half_ppr_points` with Mariota. |
| WR Dyami Brown | **Sit** | Target share 0.0968 `usage.json:pooled.target_share`, snap share down to 0.3043 `usage.json:last_week.snap_share`, 2.1 `usage.json:pooled.half_ppr_points`. |
| TE Ben Sinnott | **Sit** | Target share 0.0313 `usage.json:pooled.target_share` on 0.5857 `usage.json:pooled.snap_share` (snap share stands in for routes), 1.1 `usage.json:pooled.half_ppr_points`; the Colts' 14.13 to TEs, rank 8 `points-allowed.json:per_game,rank`, does not rescue it. |
| D/ST Commanders | **Sit** | The Colts are implied for 25.5 `game-environment.json:away_implied_total`; Washington allows 27.38 to QBs, rank 2 `points-allowed.json:per_game,rank`; S Nick Cross and G Sam Cosmi are Out `injuries.json:report_status`. |

### 2. Patriots at Bills - Sun 13:00 ET [#118 game 2]

Row `2026_04_NE_BUF`: Bills -6.5 `game-environment.json:spread_line`, total
48.5 `game-environment.json:total_line`; Bills 27.5
`game-environment.json:home_implied_total`, Patriots 21
`game-environment.json:away_implied_total`.

**Patriots**

| Player | Call | Reason |
|---|---|---|
| QB Drake Maye | **Sit** | 21.6 `usage.json:pooled.half_ppr_points` over 3 `usage.json:games` (7.2 a game), 3.76 `usage.json:last_week.half_ppr_points`, and a 21 `game-environment.json:away_implied_total`; Buffalo's 19.66 to QBs, rank 8 `points-allowed.json:per_game,rank`, is not enough. |
| RB Rhamondre Stevenson | **Sit** | Rush share 0.3647 `usage.json:pooled.rush_share`, falling to 0.2692 `usage.json:last_week.rush_share`, on snap share 0.5979 `usage.json:pooled.snap_share`; 20.4 `usage.json:pooled.half_ppr_points` in three games. Buffalo's 25 to RBs, rank 6 `points-allowed.json:per_game,rank`, is split two ways. |
| RB TreVeyon Henderson | **Sit** | Rush share 0.4444 `usage.json:pooled.rush_share` over 2 `usage.json:games` but 0.3077 `usage.json:last_week.rush_share` and target share 0.0196 `usage.json:pooled.target_share`. |
| WR Mack Hollins | **Flex** | Target share 0.1951 `usage.json:pooled.target_share`, 0.3 `usage.json:last_week.target_share`, air-yards share 0.2604 `usage.json:pooled.air_yards_share`, against Buffalo's 32.1 to WRs, rank 5 `points-allowed.json:per_game,rank`. |
| WR Romeo Doubs | **Sit** | Target share 0.1341 `usage.json:pooled.target_share` and 0.1333 `usage.json:last_week.target_share`; 17.5 `usage.json:pooled.half_ppr_points` over three games. |
| WR DeMario Douglas | **Sit** | Target share 0.1707 `usage.json:pooled.target_share` on 0.5661 `usage.json:pooled.snap_share`; 10.2 `usage.json:pooled.half_ppr_points` over three games. |
| TE Hunter Henry | **Sit** | Target share 0.122 `usage.json:pooled.target_share`, 0.0667 `usage.json:last_week.target_share`, on 0.7831 `usage.json:pooled.snap_share` (snap share stands in for routes); Buffalo allows 8.2 to TEs, rank 22 `points-allowed.json:per_game,rank`. |
| D/ST Patriots | **Sit** | Buffalo's 27.5 `game-environment.json:home_implied_total` is the game's high; Josh Allen has 93.44 `usage.json:pooled.half_ppr_points` in three games. |

**Bills**

| Player | Call | Reason |
|---|---|---|
| QB Josh Allen | **Start** | 93.44 `usage.json:pooled.half_ppr_points` over 3 games (31.1 a game) with rush share 0.3111 `usage.json:pooled.rush_share`, and a 27.5 `game-environment.json:home_implied_total`, which outweighs New England's 12.45 to QBs, rank 27 `points-allowed.json:per_game,rank`. |
| RB James Cook | **Start** | Rush share 0.6444 `usage.json:pooled.rush_share`, 0.7273 `usage.json:last_week.rush_share`, on 0.7121 `usage.json:pooled.snap_share`, as a 6.5-point favorite `game-environment.json:spread_line`; New England allows 18.83 to RBs, rank 14 `points-allowed.json:per_game,rank`. |
| RB Ty Johnson | **Sit** | One game: snap share 0.2273 `usage.json:pooled.snap_share`, rush share 0 `usage.json:pooled.rush_share`, target share 0.1538 `usage.json:pooled.target_share`. |
| WR DJ Moore | **Start** | Target share 0.2195 `usage.json:pooled.target_share`, 0.3846 `usage.json:last_week.target_share`, air-yards share 0.3265 `usage.json:pooled.air_yards_share`; New England allows 26.73 to WRs, rank 15 `points-allowed.json:per_game,rank`. Limited `injuries.json:practice_status` - on the game-time list. |
| WR Khalil Shakir | **Sit** | Snap share 0.7273 `usage.json:last_week.snap_share` but target share 0.1154 `usage.json:last_week.target_share` and 1.1 `usage.json:last_week.half_ppr_points`. |
| WR Keon Coleman | **Sit** | Target share 0.1098 `usage.json:pooled.target_share`, snap share 0.4848 `usage.json:last_week.snap_share`, and Did Not Participate `injuries.json:practice_status`. |
| TE Dalton Kincaid | **Start** | Target share 0.2073 `usage.json:pooled.target_share` and air-yards share 0.2497 `usage.json:pooled.air_yards_share` on 0.6818 `usage.json:pooled.snap_share` (snap share stands in for routes), 37.3 `usage.json:pooled.half_ppr_points` in three games. New England allows the fewest to TEs, 4.53, rank 32 `points-allowed.json:per_game,rank` - his share outweighs it at a thin position. |
| D/ST Bills | **Start** | New England is implied for 21 `game-environment.json:away_implied_total` as a 6.5-point underdog `game-environment.json:spread_line`, and Maye has 21.6 `usage.json:pooled.half_ppr_points` in three games. |

### 3. Jets at Bears - Sun 13:00 ET [#118 game 3]

Row `2026_04_NYJ_CHI`: Bears -3.5 `game-environment.json:spread_line`, total
43.5 `game-environment.json:total_line`; Bears 23.5
`game-environment.json:home_implied_total`, Jets 20
`game-environment.json:away_implied_total`. Chicago had no rows in
`injuries.json` when fetched.

**Jets**

| Player | Call | Reason |
|---|---|---|
| QB Geno Smith | **Flex** | 50.92 `usage.json:pooled.half_ppr_points` over 3 `usage.json:games` (17.0 a game) and 26.04 `usage.json:last_week.half_ppr_points`, against Chicago's 16.93 to QBs, rank 17 `points-allowed.json:per_game,rank`, on a 20 `game-environment.json:away_implied_total`. |
| RB Braelon Allen | **Flex** | Rush share 0.2235 `usage.json:pooled.rush_share` and snap share 0.5152 `usage.json:last_week.snap_share` behind Breece Hall's 0.6 `usage.json:pooled.rush_share`; Hall Did Not Participate `injuries.json:practice_status`. Chicago allows 18.17 to RBs, rank 17 `points-allowed.json:per_game,rank`. A start if Hall is out - on the game-time list. |
| RB Isaiah Davis | **Sit** | Rush share 0 `usage.json:pooled.rush_share`, target share 0 `usage.json:pooled.target_share`, 0 `usage.json:pooled.half_ppr_points` in two games. |
| WR Garrett Wilson | **Start** | Target share 0.2842 `usage.json:pooled.target_share`, 0.3611 `usage.json:last_week.target_share`, air-yards share 0.4189 `usage.json:pooled.air_yards_share`; volume outweighs Chicago's 22 to WRs, rank 27 `points-allowed.json:per_game,rank`. |
| WR Adonai Mitchell | **Sit** | Target share 0.2542 `usage.json:pooled.target_share` and air-yards share 0.5766 `usage.json:pooled.air_yards_share` over 2 `usage.json:games`, but no week 3 row and Did Not Participate `injuries.json:practice_status`. On the game-time list. |
| WR Isaiah Williams | **Sit** | Snap share 0.7729 `usage.json:pooled.snap_share` but target share 0.0947 `usage.json:pooled.target_share` and 2.6 `usage.json:last_week.half_ppr_points`. |
| TE Kenyon Sadiq | **Flex** | Target share 0.2222 `usage.json:last_week.target_share` on 0.5758 `usage.json:last_week.snap_share` (snap share stands in for routes) with Mason Taylor Did Not Participate `injuries.json:practice_status`; Chicago allows 6.27 to TEs, rank 27 `points-allowed.json:per_game,rank`. Sadiq himself is Limited `injuries.json:practice_status` - on the game-time list. |
| D/ST Jets | **Sit** | Chicago's 23.5 `game-environment.json:home_implied_total`; Keenum scored 24.48 `usage.json:last_week.half_ppr_points` in his start; the Jets are 3.5-point underdogs `game-environment.json:spread_line`. |

**Bears**

| Player | Call | Reason |
|---|---|---|
| QB Case Keenum | **Sit** | 24.48 `usage.json:last_week.half_ppr_points` in one start, against the Jets' 14.95 to QBs, rank 23 `points-allowed.json:per_game,rank`, on a 23.5 `game-environment.json:home_implied_total`. The starter is not settled and Chicago had no injury rows; on the game-time list. |
| RB D'Andre Swift | **Start** | Rush share 0.5143 `usage.json:pooled.rush_share` on snap share 0.6471 `usage.json:pooled.snap_share`, 52.1 `usage.json:pooled.half_ppr_points` over 3 games (17.4 a game), against the Jets' 21.1 to RBs, rank 9 `points-allowed.json:per_game,rank`. |
| RB Kyle Monangai | **Sit** | Rush share 0.2857 `usage.json:pooled.rush_share` on 0.3575 `usage.json:pooled.snap_share`; 3.1 `usage.json:last_week.half_ppr_points`. |
| WR Luther Burden III | **Flex** | Target share 0.2556 `usage.json:pooled.target_share`, 0.3235 `usage.json:last_week.target_share`, air-yards share 0.2729 `usage.json:pooled.air_yards_share`; the Jets allow 23.17 to WRs, rank 22 `points-allowed.json:per_game,rank`. |
| WR Kalif Raymond | **Flex** | Target share 0.2333 `usage.json:pooled.target_share` on 0.6561 `usage.json:pooled.snap_share`, 36.9 `usage.json:pooled.half_ppr_points` over 3 games, the team's best WR output. |
| WR Rome Odunze | **Sit** | Air-yards share 0.3415 `usage.json:pooled.air_yards_share` but target share 0.1444 `usage.json:pooled.target_share`, 17.9 `usage.json:pooled.half_ppr_points` over 3 games. |
| TE Colston Loveland | **Sit** | Snap share 0.8416 `usage.json:pooled.snap_share` (snap share stands in for routes) but target share 0.1 `usage.json:pooled.target_share` and 5.9 `usage.json:pooled.half_ppr_points` in three games; the Jets allow 5.37 to TEs, rank 30 `points-allowed.json:per_game,rank`. |
| D/ST Bears | **Flex** | The Jets are implied for 20 `game-environment.json:away_implied_total` as 3.5-point underdogs `game-environment.json:spread_line`, but Geno Smith has 50.92 `usage.json:pooled.half_ppr_points` in three games. |

### 4. Jaguars at Bengals - Sun 13:00 ET [#118 game 4]

Row `2026_04_JAX_CIN`: Bengals -2.5 `game-environment.json:spread_line`,
total 51.5 `game-environment.json:total_line`, tied for the week's highest;
Bengals 27 `game-environment.json:home_implied_total`, Jaguars 24.5
`game-environment.json:away_implied_total`.

**Jaguars**

| Player | Call | Reason |
|---|---|---|
| QB Trevor Lawrence | **Start** | 52.04 `usage.json:pooled.half_ppr_points` over 3 `usage.json:games` (17.3 a game), 19.78 `usage.json:last_week.half_ppr_points`, a 24.5 `game-environment.json:away_implied_total` in a 51.5 total; Cincinnati allows 17.11 to QBs, rank 15 `points-allowed.json:per_game,rank`. |
| RB Bhayshul Tuten | **Flex** | Rush share 0.5 `usage.json:pooled.rush_share` on snap share 0.4944 `usage.json:pooled.snap_share` and target share 0.0658 `usage.json:pooled.target_share`; Cincinnati allows 15.87 to RBs, rank 20 `points-allowed.json:per_game,rank`. |
| RB Chris Rodriguez Jr. | **Sit** | Rush share 0.2326 `usage.json:pooled.rush_share`, snap share 0.2753 `usage.json:pooled.snap_share`, target share 0 `usage.json:pooled.target_share`. |
| WR Parker Washington | **Start** | Target share 0.3026 `usage.json:pooled.target_share` and air-yards share 0.4853 `usage.json:pooled.air_yards_share`, 41.6 `usage.json:pooled.half_ppr_points` over 3 games; Cincinnati allows 25.6 to WRs, rank 18 `points-allowed.json:per_game,rank`. |
| WR Jakobi Meyers | **Flex** | Target share 0.2963 `usage.json:last_week.target_share`, up from 0.1447 `usage.json:pooled.target_share`, on 0.7865 `usage.json:pooled.snap_share`. Limited `injuries.json:practice_status` - on the game-time list. |
| WR Brian Thomas Jr. | **Sit** | Snap share 0.4213 `usage.json:pooled.snap_share`, target share 0.037 `usage.json:last_week.target_share`, 1.3 `usage.json:last_week.half_ppr_points`. |
| TE Brenton Strange | **Sit** | Target share 0.1316 `usage.json:pooled.target_share` on 0.764 `usage.json:pooled.snap_share` (snap share stands in for routes), 16.7 `usage.json:pooled.half_ppr_points` over 3 games, despite Cincinnati's 13.83 to TEs, rank 9 `points-allowed.json:per_game,rank`. |
| D/ST Jaguars | **Sit** | Cincinnati's 27 `game-environment.json:home_implied_total` in a 51.5 `game-environment.json:total_line`; Burrow has 52.92 `usage.json:pooled.half_ppr_points` in three games. |

**Bengals**

| Player | Call | Reason |
|---|---|---|
| QB Joe Burrow | **Start** | 52.92 `usage.json:pooled.half_ppr_points` over 3 games, 22.58 `usage.json:last_week.half_ppr_points`, and a 27 `game-environment.json:home_implied_total`; that outweighs Jacksonville's 11.09 to QBs, rank 30 `points-allowed.json:per_game,rank`. |
| RB Chase Brown | **Start** | Rush share 0.7206 `usage.json:pooled.rush_share` on 0.7072 `usage.json:pooled.snap_share` with a 27 `game-environment.json:home_implied_total`; Jacksonville's 14.27 to RBs, rank 27 `points-allowed.json:per_game,rank`, makes him an RB2, not an RB1. |
| RB Samaje Perine | **Sit** | Rush share 0.1471 `usage.json:pooled.rush_share`, snap share 0.3315 `usage.json:pooled.snap_share`, 1.9 `usage.json:last_week.half_ppr_points`. |
| WR Ja'Marr Chase | **Start** | Target share 0.2451 `usage.json:pooled.target_share`, 0.3243 `usage.json:last_week.target_share`, on snap share 0.9392 `usage.json:pooled.snap_share`. |
| WR Tee Higgins | **Start** | Air-yards share 0.459 `usage.json:pooled.air_yards_share`, target share 0.2255 `usage.json:pooled.target_share`, 37.4 `usage.json:pooled.half_ppr_points` over 3 games. |
| WR Dohnte Meyers | **Sit** | Target share 0.0686 `usage.json:pooled.target_share`; snap share rose to 0.5614 `usage.json:last_week.snap_share` with Colbie Young Did Not Participate `injuries.json:practice_status`, but on 0.1351 `usage.json:last_week.target_share`. |
| TE Mike Gesicki | **Flex** | 27.5 `usage.json:pooled.half_ppr_points` over 2 `usage.json:games`, target share 0.1408 `usage.json:pooled.target_share` and air-yards share 0.1959 `usage.json:pooled.air_yards_share`, on snap share 0.4132 `usage.json:pooled.snap_share` (snap share stands in for routes); Jacksonville allows 6.5 to TEs, rank 26 `points-allowed.json:per_game,rank`. TD-dependent. |
| D/ST Bengals | **Sit** | Jacksonville is implied for 24.5 `game-environment.json:away_implied_total`; Lawrence has 52.04 `usage.json:pooled.half_ppr_points` in three games; the spread is only 2.5 `game-environment.json:spread_line`. |

### 5. Cowboys at Texans - Sun 13:00 ET [#118 game 5]

Row `2026_04_DAL_HOU`: Texans -3 `game-environment.json:spread_line`, total
48.5 `game-environment.json:total_line`; Texans 25.75
`game-environment.json:home_implied_total`, Cowboys 22.75
`game-environment.json:away_implied_total`. `roof` is null in the table.

**Cowboys**

| Player | Call | Reason |
|---|---|---|
| QB Dak Prescott | **Start** | 63.1 `usage.json:pooled.half_ppr_points` over 3 `usage.json:games` (21.0 a game) against Houston's 19.91 to QBs, rank 7 `points-allowed.json:per_game,rank`, on a 22.75 `game-environment.json:away_implied_total`. |
| RB Javonte Williams | **Start** | Rush share 0.6232 `usage.json:pooled.rush_share` on 0.754 `usage.json:pooled.snap_share`, 45.5 `usage.json:pooled.half_ppr_points` over 3 games; volume over Houston's 10.33 to RBs, rank 31 `points-allowed.json:per_game,rank`, which makes him an RB2 rather than an RB1. |
| RB Tyler Goodson | **Sit** | One game: rush share 0.2 `usage.json:pooled.rush_share`, snap share 0.1486 `usage.json:pooled.snap_share`, 2.2 `usage.json:pooled.half_ppr_points`. |
| WR CeeDee Lamb | **Start** | Target share 0.2475 `usage.json:pooled.target_share`, air-yards share 0.4103 `usage.json:pooled.air_yards_share`, against Houston's 33.8 to WRs, rank 3 `points-allowed.json:per_game,rank`. |
| WR George Pickens | **Start** | Target share 0.2475 `usage.json:pooled.target_share`, 0.275 `usage.json:last_week.target_share`, air-yards share 0.3522 `usage.json:pooled.air_yards_share`, in the same rank-3 WR matchup. |
| WR Ryan Flournoy | **Sit** | Target share 0.1782 `usage.json:pooled.target_share` on 0.7059 `usage.json:pooled.snap_share` has produced 11.2 `usage.json:pooled.half_ppr_points` in three games. |
| TE Jake Ferguson | **Flex** | Target share 0.1089 `usage.json:pooled.target_share` on 0.6845 `usage.json:pooled.snap_share` (snap share stands in for routes), 27.7 `usage.json:pooled.half_ppr_points` over 3 games; Houston allows 10.17 to TEs, rank 16 `points-allowed.json:per_game,rank`. Fourth in line for targets behind two WRs at 0.2475. |
| D/ST Cowboys | **Sit** | Houston's 25.75 `game-environment.json:home_implied_total`; Dallas allows 23.51 to QBs, rank 3 `points-allowed.json:per_game,rank`; Dallas is a 3-point underdog `game-environment.json:spread_line`. |

**Texans**

| Player | Call | Reason |
|---|---|---|
| QB C.J. Stroud | **Start** | Dallas allows 23.51 to QBs, rank 3 `points-allowed.json:per_game,rank`, and Houston has the game's higher total, 25.75 `game-environment.json:home_implied_total`; his own 45.16 `usage.json:pooled.half_ppr_points` over 3 games makes him a low QB1. |
| RB David Montgomery | **Flex** | Rush share 0.5211 `usage.json:pooled.rush_share` on 0.5399 `usage.json:pooled.snap_share`, but 5.8 `usage.json:last_week.half_ppr_points`; Dallas allows 23 to RBs, rank 8 `points-allowed.json:per_game,rank`. |
| RB Woody Marks | **Sit** | Rush share 0.3099 `usage.json:pooled.rush_share`, target share 0.0714 `usage.json:pooled.target_share`, 19.1 `usage.json:pooled.half_ppr_points` over 3 games. |
| WR Nico Collins | **Flex** | One game: target share 0.2703 `usage.json:pooled.target_share`, air-yards share 0.4068 `usage.json:pooled.air_yards_share`; Limited `injuries.json:practice_status`. Dallas allows 24.27 to WRs, rank 20 `points-allowed.json:per_game,rank`. On the game-time list. |
| WR Xavier Hutchinson | **Sit** | Target share 0.24 `usage.json:last_week.target_share` and air-yards share 0.4353 `usage.json:last_week.air_yards_share` without Collins, but 16.9 `usage.json:pooled.half_ppr_points` over 3 games. Flex if Collins is out - on the game-time list. |
| WR Kayshon Boutte | **Sit** | Snap share 0.615 `usage.json:pooled.snap_share` but target share 0.0804 `usage.json:pooled.target_share` and 3.1 `usage.json:last_week.half_ppr_points`. |
| TE Dalton Schultz | **Start** | Target share 0.2232 `usage.json:pooled.target_share` on 0.6338 `usage.json:pooled.snap_share` (snap share stands in for routes) against Dallas's 14.43 to TEs, rank 6 `points-allowed.json:per_game,rank`. Limited `injuries.json:practice_status` - on the game-time list. |
| D/ST Texans | **Sit** | Dallas is implied for 22.75 `game-environment.json:away_implied_total`; Prescott has 63.1 `usage.json:pooled.half_ppr_points` in three games; Houston allows 19.91 to QBs, rank 7 `points-allowed.json:per_game,rank`. |

### 6. Cardinals at Giants - Sun 13:00 ET [#118 game 6]

Row `2026_04_ARI_NYG`: Cardinals -2.5 `game-environment.json:spread_line`,
total 44.5 `game-environment.json:total_line`; Cardinals 23.5
`game-environment.json:away_implied_total`, Giants 21
`game-environment.json:home_implied_total`.

**Cardinals**

| Player | Call | Reason |
|---|---|---|
| QB Jacoby Brissett | **Flex** | 48.58 `usage.json:pooled.half_ppr_points` over 3 `usage.json:games` (16.2 a game) and 25.6 `usage.json:last_week.half_ppr_points`; the Giants allow 16.94 to QBs, rank 16 `points-allowed.json:per_game,rank`. |
| RB Jeremiyah Love | **Start** | Rush share 0.5256 `usage.json:pooled.rush_share`, up to 0.7778 `usage.json:last_week.rush_share`, on 0.6437 `usage.json:last_week.snap_share`; the Giants allow 19.87 to RBs, rank 10 `points-allowed.json:per_game,rank`. |
| RB Tyler Allgeier | **Sit** | Rush share fell to 0.0741 `usage.json:last_week.rush_share` from 0.3077 `usage.json:pooled.rush_share`; 2.9 `usage.json:last_week.half_ppr_points`. |
| WR Michael Wilson | **Start** | Target share 0.2743 `usage.json:pooled.target_share`, 0.34 `usage.json:last_week.target_share`, air-yards share 0.4208 `usage.json:pooled.air_yards_share`; the Giants allow 29.73 to WRs, rank 9 `points-allowed.json:per_game,rank`. |
| WR Marvin Harrison Jr. | **Sit** | Snap share 0.7689 `usage.json:pooled.snap_share` and air-yards share 0.2268 `usage.json:pooled.air_yards_share` have produced target share 0.0796 `usage.json:pooled.target_share` and 9.3 `usage.json:pooled.half_ppr_points` in three games. |
| WR Kendrick Bourne | **Sit** | Target share 0.1239 `usage.json:pooled.target_share`, 0.06 `usage.json:last_week.target_share`, 3.2 `usage.json:last_week.half_ppr_points`. |
| TE Trey McBride | **Start** | Target share 0.3009 `usage.json:pooled.target_share` on 0.8632 `usage.json:pooled.snap_share` (snap share stands in for routes), 46.1 `usage.json:pooled.half_ppr_points` over 3 games; the Giants allow 9.6 to TEs, rank 19 `points-allowed.json:per_game,rank`. |
| D/ST Cardinals | **Flex** | The Giants are implied for 21 `game-environment.json:home_implied_total`, and Winston has 8.66 `usage.json:pooled.half_ppr_points` over 2 `usage.json:games` and 6.12 `usage.json:last_week.half_ppr_points`. |

**Giants**

| Player | Call | Reason |
|---|---|---|
| QB Jameis Winston | **Sit** | 8.66 `usage.json:pooled.half_ppr_points` over 2 games; Arizona's 21.98 to QBs, rank 4 `points-allowed.json:per_game,rank`, does not lift a 21 `game-environment.json:home_implied_total`. |
| RB Cam Skattebo | **Start** | Rush share 0.5495 `usage.json:pooled.rush_share`, target share 0.1905 `usage.json:last_week.target_share`, on 0.7656 `usage.json:last_week.snap_share`; Arizona allows 15.4 to RBs, rank 22 `points-allowed.json:per_game,rank`. An RB2. |
| RB Najee Harris | **Sit** | Rush share 0.2407 `usage.json:pooled.rush_share` on snap share 0.1803 `usage.json:pooled.snap_share`, target share 0 `usage.json:pooled.target_share`. |
| WR Malik Nabers | **Flex** | Target share 0.2317 `usage.json:pooled.target_share` but air-yards share 0.042 `usage.json:last_week.air_yards_share` and 15.6 `usage.json:pooled.half_ppr_points` over 3 games; Arizona allows 34.2 to WRs, rank 2 `points-allowed.json:per_game,rank`. |
| WR Malachi Fields | **Sit** | Air-yards share 0.3021 `usage.json:pooled.air_yards_share` on target share 0.1463 `usage.json:pooled.target_share`, 2.9 `usage.json:last_week.half_ppr_points`. |
| WR Darnell Mooney | **Sit** | Target share 0.0976 `usage.json:pooled.target_share`, snap share 0.4375 `usage.json:last_week.snap_share`, 3.9 `usage.json:last_week.half_ppr_points`. |
| TE Isaiah Likely | **Start** | Target share 0.2805 `usage.json:pooled.target_share` on 0.8438 `usage.json:last_week.snap_share` (snap share stands in for routes), against Arizona's 14.93 to TEs, rank 5 `points-allowed.json:per_game,rank`. |
| D/ST Giants | **Sit** | Arizona is implied for 23.5 `game-environment.json:away_implied_total`; Brissett has 48.58 `usage.json:pooled.half_ppr_points` in three games; the Giants are 2.5-point underdogs `game-environment.json:spread_line`. |

### 7. Rams at Eagles - Sun 13:00 ET [#118 game 7]

Row `2026_04_LA_PHI`: Rams -3 `game-environment.json:spread_line`, total 43.5
`game-environment.json:total_line`; Rams 23.25
`game-environment.json:away_implied_total`, Eagles 20.25
`game-environment.json:home_implied_total`. Philadelphia had no rows in
`injuries.json` when fetched.

**Rams**

| Player | Call | Reason |
|---|---|---|
| QB Matthew Stafford | **Start** | 51.98 `usage.json:pooled.half_ppr_points` over 3 `usage.json:games` (17.3 a game), a 23.25 `game-environment.json:away_implied_total`, and Philadelphia's 20.72 to QBs, rank 6 `points-allowed.json:per_game,rank`. |
| RB Kyren Williams | **Start** | Rush share 0.6522 `usage.json:last_week.rush_share` on 0.7093 `usage.json:last_week.snap_share`, 47.5 `usage.json:pooled.half_ppr_points` over 3 games; Philadelphia allows 15.43 to RBs, rank 21 `points-allowed.json:per_game,rank`. |
| RB Blake Corum | **Sit** | Rush share 0.35 `usage.json:pooled.rush_share` falling to 0.2609 `usage.json:last_week.rush_share`; 2.5 `usage.json:last_week.half_ppr_points`. |
| WR Davante Adams | **Start** | Target share 0.2736 `usage.json:pooled.target_share`, air-yards share 0.4495 `usage.json:pooled.air_yards_share`, 56.8 `usage.json:pooled.half_ppr_points` over 3 games; Philadelphia allows 30 to WRs, rank 8 `points-allowed.json:per_game,rank`. Did Not Participate `injuries.json:practice_status` - on the game-time list. |
| WR Puka Nacua | **Flex** | One game: target share 0.3333 `usage.json:pooled.target_share`, air-yards share 0.444 `usage.json:pooled.air_yards_share`, then no week 3 row; Limited `injuries.json:practice_status`. On the game-time list. |
| WR Konata Mumpfield | **Sit** | Target share 0.1633 `usage.json:last_week.target_share` and 17.3 `usage.json:last_week.half_ppr_points` without Nacua, but 0.1038 `usage.json:pooled.target_share`. Flex if Adams or Nacua is out - on the game-time list. |
| TE Tyler Higbee | **Flex** | Target share 0.2245 `usage.json:last_week.target_share` on 0.7093 `usage.json:last_week.snap_share` (snap share stands in for routes), with Colby Parkinson and Terrance Ferguson both Did Not Participate `injuries.json:practice_status`; Philadelphia allows 4.8 to TEs, rank 31 `points-allowed.json:per_game,rank`. On the game-time list via Parkinson. |
| D/ST Rams | **Sit** | Philadelphia is implied for 20.25 `game-environment.json:home_implied_total` but Hurts has 53.5 `usage.json:pooled.half_ppr_points` in three games with rush share 0.2105 `usage.json:pooled.rush_share`. |

**Eagles**

| Player | Call | Reason |
|---|---|---|
| QB Jalen Hurts | **Start** | 53.5 `usage.json:pooled.half_ppr_points` over 3 games with rush share 0.2105 `usage.json:pooled.rush_share`; the Rams allow 16.19 to QBs, rank 20 `points-allowed.json:per_game,rank`. The rushing floor carries a 20.25 `game-environment.json:home_implied_total`. |
| RB Saquon Barkley | **Flex** | Rush share 0.7895 `usage.json:last_week.rush_share` but 0.4474 `usage.json:pooled.rush_share` on snap share 0.4807 `usage.json:pooled.snap_share`, and 19.5 `usage.json:pooled.half_ppr_points` in three games (6.5 a game); the Rams allow 14.4 to RBs, rank 26 `points-allowed.json:per_game,rank`. |
| RB Will Shipley | **Sit** | Rush share 0.1184 `usage.json:pooled.rush_share`, 0 `usage.json:last_week.rush_share`, 1.6 `usage.json:last_week.half_ppr_points`. |
| WR DeVonta Smith | **Start** | Target share 0.3333 `usage.json:pooled.target_share`, air-yards share 0.4771 `usage.json:pooled.air_yards_share`, snap share 0.9337 `usage.json:pooled.snap_share`; the Rams allow 26.27 to WRs, rank 17 `points-allowed.json:per_game,rank`. |
| WR Dontayvion Wicks | **Flex** | Target share 0.1852 `usage.json:pooled.target_share` and air-yards share 0.2999 `usage.json:pooled.air_yards_share` on 0.88 `usage.json:last_week.snap_share`; 28.4 `usage.json:pooled.half_ppr_points` over 3 games. |
| WR Makai Lemon | **Sit** | Target share 0.1111 `usage.json:pooled.target_share`, 6.8 `usage.json:pooled.half_ppr_points` over 3 games, 4.4 `usage.json:last_week.half_ppr_points`. |
| TE Johnny Mundt | **Sit** | Target share 0.0678 `usage.json:pooled.target_share` on 0.5952 `usage.json:pooled.snap_share` (snap share stands in for routes); the Rams allow 6.07 to TEs, rank 28 `points-allowed.json:per_game,rank`. |
| D/ST Eagles | **Sit** | The Rams are implied for 23.25 `game-environment.json:away_implied_total` as 3-point favorites `game-environment.json:spread_line`; Stafford has 51.98 `usage.json:pooled.half_ppr_points` in three games. |

### 8. Packers at Buccaneers - Sun 13:00 ET [#118 game 8]

Row `2026_04_GB_TB`: Packers -3.5 `game-environment.json:spread_line`, total
38.5 `game-environment.json:total_line`, tied for the week's lowest; Packers
21 `game-environment.json:away_implied_total`, Buccaneers 17.5
`game-environment.json:home_implied_total`.

**Packers**

| Player | Call | Reason |
|---|---|---|
| QB Jordan Love | **Flex** | 51.76 `usage.json:pooled.half_ppr_points` over 3 `usage.json:games` (17.3 a game), but a 21 `game-environment.json:away_implied_total` in a 38.5 total and Tampa Bay's 14.77 to QBs, rank 24 `points-allowed.json:per_game,rank`. |
| RB Chris Brooks | **Sit** | Rush share 0.2292 `usage.json:pooled.rush_share`, 0 `usage.json:last_week.rush_share`, 6.9 `usage.json:pooled.half_ppr_points` over 3 games. MarShawn Lloyd, not on #118's list, leads at 0.4792 `usage.json:pooled.rush_share`. |
| RB Kaleb Johnson | **Sit** | Rush share 0.4444 `usage.json:last_week.rush_share` but snap share 0.3636 `usage.json:last_week.snap_share` and 5.3 `usage.json:pooled.half_ppr_points` over 3 games. |
| WR Christian Watson | **Start** | Target share 0.2417 `usage.json:pooled.target_share`, air-yards share 0.2825 `usage.json:pooled.air_yards_share`, 60.9 `usage.json:pooled.half_ppr_points` over 3 games; Tampa Bay allows 22.7 to WRs, rank 26 `points-allowed.json:per_game,rank`. |
| WR Matthew Golden | **Start** | Target share 0.25 `usage.json:pooled.target_share`, air-yards share 0.4901 `usage.json:last_week.air_yards_share`, 38.8 `usage.json:pooled.half_ppr_points` over 3 games. |
| WR Skyy Moore | **Sit** | Target share 0.0917 `usage.json:pooled.target_share`, snap share 0.3057 `usage.json:pooled.snap_share`, 6.2 `usage.json:pooled.half_ppr_points`. |
| TE Tucker Kraft | **Flex** | Snap share 0.7927 `usage.json:pooled.snap_share` (snap share stands in for routes) and target share 0.1417 `usage.json:pooled.target_share`, but 15.1 `usage.json:pooled.half_ppr_points` over 3 games; Tampa Bay allows 12.93 to TEs, rank 11 `points-allowed.json:per_game,rank`. |
| D/ST Packers | **Start** | Tampa Bay is implied for 17.5 `game-environment.json:home_implied_total`; Baker Mayfield Did Not Participate `injuries.json:practice_status`; Jalon Daniels has -1.1 `usage.json:pooled.half_ppr_points` on snap share 0.058 `usage.json:pooled.snap_share`. |

**Buccaneers**

| Player | Call | Reason |
|---|---|---|
| QB Jalon Daniels | **Sit** | -1.1 `usage.json:pooled.half_ppr_points` on snap share 0.058 `usage.json:pooled.snap_share`, a 17.5 `game-environment.json:home_implied_total`. Mayfield Did Not Participate `injuries.json:practice_status`; on the game-time list. |
| RB Bucky Irving | **Start** | Rush share 0.6061 `usage.json:pooled.rush_share`, target share 0.1579 `usage.json:pooled.target_share`, against Green Bay's 29.17 to RBs, the most, rank 1 `points-allowed.json:per_game,rank`. Limited `injuries.json:practice_status` - on the game-time list. |
| RB Kenny Gainwell | **Sit** | Rush share 0.1515 `usage.json:pooled.rush_share`, target share 0.1053 `usage.json:pooled.target_share`, 7.3 `usage.json:pooled.half_ppr_points` over 3 games. |
| WR Emeka Egbuka | **Flex** | Target share 0.2105 `usage.json:pooled.target_share`, 0.2571 `usage.json:last_week.target_share`, against Green Bay's 29.7 to WRs, rank 10 `points-allowed.json:per_game,rank`, on a 17.5 implied total. |
| WR Ted Hurst III | **Sit** | Air-yards share 0.2838 `usage.json:pooled.air_yards_share` but target share 0.1368 `usage.json:pooled.target_share`, 0.0857 `usage.json:last_week.target_share`. |
| WR Chris Godwin Jr. | **Sit** | Target share 0.1158 `usage.json:pooled.target_share`, air-yards share 0.059 `usage.json:pooled.air_yards_share`; Did Not Participate `injuries.json:practice_status`. |
| TE Cade Otton | **Sit** | Snap share 0.9372 `usage.json:pooled.snap_share` (snap share stands in for routes) and target share 0.1789 `usage.json:pooled.target_share`, but 17.5 `usage.json:pooled.half_ppr_points` over 3 games with a backup QB; Green Bay allows 9.37 to TEs, rank 20 `points-allowed.json:per_game,rank`. |
| D/ST Buccaneers | **Flex** | Green Bay is implied for 21 `game-environment.json:away_implied_total` in a 38.5 `game-environment.json:total_line`; Tampa Bay allows 14.77 to QBs, rank 24 `points-allowed.json:per_game,rank`. |

### 9. Titans at Ravens - Sun 13:00 ET [#119 game 2]

Row `2026_04_TEN_BAL`: Ravens -11.5 `game-environment.json:spread_line`, total
42.5 `game-environment.json:total_line`; Ravens 27
`game-environment.json:home_implied_total`, Titans 15.5
`game-environment.json:away_implied_total`.

**Titans**

| Player | Call | Reason |
|---|---|---|
| QB Cam Ward | **Sit** | 41.16 `usage.json:pooled.half_ppr_points` over 3 `usage.json:games`, 9.44 `usage.json:last_week.half_ppr_points`, on a 15.5 `game-environment.json:away_implied_total`. |
| RB Tony Pollard | **Flex** | Rush share 0.8095 `usage.json:last_week.rush_share`, 0.5938 `usage.json:pooled.rush_share`, against Baltimore's 18.2 to RBs, rank 16 `points-allowed.json:per_game,rank`, but an 11.5-point underdog script. Did Not Participate `injuries.json:practice_status` - on the game-time list. |
| RB Tyjae Spears | **Sit** | Rush share 0.2031 `usage.json:pooled.rush_share`, 0.5 `usage.json:last_week.half_ppr_points`; Did Not Participate `injuries.json:practice_status`. |
| WR Wan'Dale Robinson | **Flex** | Target share 0.225 `usage.json:pooled.target_share`, 0.3143 `usage.json:last_week.target_share`, against Baltimore's 29.63 to WRs, rank 12 `points-allowed.json:per_game,rank`; a trailing script adds volume. |
| WR Carnell Tate | **Flex** | Target share 0.25 `usage.json:pooled.target_share` and air-yards share 0.4345 `usage.json:pooled.air_yards_share` on 0.8405 `usage.json:pooled.snap_share` - the team's most-used WR - though 18.8 `usage.json:pooled.half_ppr_points` over 3 games shows the 15.5 implied total biting. |
| WR Elic Ayomanor | **Sit** | Target share 0.1125 `usage.json:pooled.target_share`, 0.0857 `usage.json:last_week.target_share`, 1.6 `usage.json:last_week.half_ppr_points`. |
| TE Gunnar Helm | **Sit** | Snap share 0.816 `usage.json:pooled.snap_share` (snap share stands in for routes) but 9.5 `usage.json:pooled.half_ppr_points` over 3 games; Baltimore allows 10.1 to TEs, rank 17 `points-allowed.json:per_game,rank`. |
| D/ST Titans | **Sit** | Baltimore is implied for 27 `game-environment.json:home_implied_total`; Lamar Jackson has 60.2 `usage.json:pooled.half_ppr_points` in three games with rush share 0.1753 `usage.json:pooled.rush_share`. |

**Ravens**

| Player | Call | Reason |
|---|---|---|
| QB Lamar Jackson | **Start** | 60.2 `usage.json:pooled.half_ppr_points` over 3 games, a 27 `game-environment.json:home_implied_total`; Tennessee's 10.53 to QBs, rank 31 `points-allowed.json:per_game,rank`, trims the ceiling, not the call. Limited `injuries.json:practice_status` - on the game-time list. |
| RB Derrick Henry | **Start** | Rush share 0.6804 `usage.json:pooled.rush_share`, 72.4 `usage.json:pooled.half_ppr_points` over 3 games, as an 11.5-point favorite `game-environment.json:spread_line`. |
| RB Justice Hill | **Sit** | Rush share 0.134 `usage.json:pooled.rush_share`, target share 0.0411 `usage.json:pooled.target_share`, 3.3 `usage.json:last_week.half_ppr_points`. |
| WR Zay Flowers | **Start** | Target share 0.2727 `usage.json:pooled.target_share` over 2 `usage.json:games`, 0.3 `usage.json:last_week.target_share` on a snap share of only 0.3281 `usage.json:last_week.snap_share` in his return; Tennessee allows 26.6 to WRs, rank 16 `points-allowed.json:per_game,rank`. Limited `injuries.json:practice_status` - on the game-time list. |
| WR Rashod Bateman | **Sit** | Snap share 0.8579 `usage.json:pooled.snap_share` but target share 0.1781 `usage.json:pooled.target_share`, 4.7 `usage.json:last_week.half_ppr_points`. Flex if Flowers sits. |
| WR Chris Moore | **Sit** | Target share 0.0822 `usage.json:pooled.target_share`, 0.05 `usage.json:last_week.target_share`; Limited `injuries.json:practice_status`. |
| TE Mark Andrews | **Flex** | Target share 0.2466 `usage.json:pooled.target_share` on 0.6474 `usage.json:pooled.snap_share` (snap share stands in for routes), but 18.7 `usage.json:pooled.half_ppr_points` over 3 games; Tennessee allows 5.53 to TEs, rank 29 `points-allowed.json:per_game,rank`. Full `injuries.json:practice_status`. |
| D/ST Ravens | **Start** | Tennessee is implied for 15.5 `game-environment.json:away_implied_total`, the week's second-lowest, as an 11.5-point underdog `game-environment.json:spread_line`; Ward has 41.16 `usage.json:pooled.half_ppr_points` in three games. |

### 10. Dolphins at Vikings - Sun 16:05 ET [#119 game 3]

Row `2026_04_MIA_MIN`: Vikings -10.5 `game-environment.json:spread_line`, total
38.5 `game-environment.json:total_line`; Vikings 24.5
`game-environment.json:home_implied_total`, Dolphins 14
`game-environment.json:away_implied_total`, the week's lowest. Dome.

**Dolphins**

| Player | Call | Reason |
|---|---|---|
| QB Malik Willis | **Sit** | 39.18 `usage.json:pooled.half_ppr_points` over 3 `usage.json:games`, a 14 `game-environment.json:away_implied_total`, and Minnesota's 13.18 to QBs, rank 26 `points-allowed.json:per_game,rank`. |
| RB Ollie Gordon II | **Flex** | Rush share 0.5484 `usage.json:last_week.rush_share` on 0.8356 `usage.json:last_week.snap_share` with De'Von Achane at 0.0548 `usage.json:last_week.snap_share`; Minnesota allows 10.87 to RBs, rank 29 `points-allowed.json:per_game,rank`. |
| RB Jaylen Wright | **Sit** | Rush share 0.0638 `usage.json:pooled.rush_share`, snap share 0.0609 `usage.json:pooled.snap_share`; Limited `injuries.json:practice_status`. On the game-time list. |
| WR Malik Washington | **Flex** | Target share 0.2706 `usage.json:pooled.target_share`, air-yards share 0.3209 `usage.json:pooled.air_yards_share`, against Minnesota's 29.57 to WRs, rank 13 `points-allowed.json:per_game,rank`, on a 14-point implied total. |
| WR Chris Bell | **Sit** | Target share 0.1176 `usage.json:pooled.target_share`, 0.2 `usage.json:last_week.target_share`; Limited `injuries.json:practice_status`. |
| WR Caleb Douglas | **Sit** | Target share 0.2 `usage.json:pooled.target_share` on 0.887 `usage.json:pooled.snap_share` over 2 games, no week 3 row, Did Not Participate `injuries.json:practice_status`. On the game-time list. |
| TE Greg Dulcich | **Sit** | Target share 0.1412 `usage.json:pooled.target_share` on 0.6915 `usage.json:pooled.snap_share` (snap share stands in for routes), 13.5 `usage.json:pooled.half_ppr_points` over 3 games; Minnesota allows 7.77 to TEs, rank 23 `points-allowed.json:per_game,rank`. |
| D/ST Dolphins | **Sit** | Minnesota is implied for 24.5 `game-environment.json:home_implied_total` as a 10.5-point favorite `game-environment.json:spread_line`; Miami allows 27.1 to RBs, rank 3 `points-allowed.json:per_game,rank`. |

**Vikings**

| Player | Call | Reason |
|---|---|---|
| QB Kyler Murray | **Sit** | 10.04 `usage.json:pooled.half_ppr_points` over 2 games, 10.42 `usage.json:last_week.half_ppr_points`; Miami's 19.34 to QBs, rank 9 `points-allowed.json:per_game,rank`, does not cover a run-first script as a 10.5-point favorite. |
| RB Aaron Jones | **Start** | Rush share 0.7391 `usage.json:last_week.rush_share` and target share 0.24 `usage.json:last_week.target_share`, against Miami's 27.1 to RBs, rank 3 `points-allowed.json:per_game,rank`. Limited `injuries.json:practice_status` - on the game-time list. |
| RB DeeJay Dallas | **Sit** | Rush share 0.0353 `usage.json:pooled.rush_share`, snap share 0.1307 `usage.json:pooled.snap_share`, 3.3 `usage.json:pooled.half_ppr_points`. Jordan Mason, not on #119's list, had 0.4412 `usage.json:pooled.rush_share` in his one game. |
| WR Justin Jefferson | **Flex** | Target share 0.2537 `usage.json:pooled.target_share`, air-yards share 0.3339 `usage.json:pooled.air_yards_share`, but snap share 0.1186 `usage.json:last_week.snap_share` after his injury and Did Not Participate `injuries.json:practice_status`. Start if he practises fully - on the game-time list. |
| WR Jordan Addison | **Start** | Target share 0.36 `usage.json:last_week.target_share`, air-yards share 0.6509 `usage.json:last_week.air_yards_share`, on 0.9831 `usage.json:last_week.snap_share`; Miami allows 19.07 to WRs, rank 28 `points-allowed.json:per_game,rank`. |
| WR Jauan Jennings | **Sit** | Target share 0.0625 `usage.json:pooled.target_share` on 0.629 `usage.json:pooled.snap_share`, 0.6 `usage.json:pooled.half_ppr_points` over 2 games. |
| TE T.J. Hockenson | **Flex** | Target share 0.194 `usage.json:pooled.target_share` on 0.733 `usage.json:pooled.snap_share` (snap share stands in for routes), against Miami's 13.5 to TEs, rank 10 `points-allowed.json:per_game,rank`; 2.1 `usage.json:last_week.half_ppr_points`. |
| D/ST Vikings | **Start** | Miami is implied for 14 `game-environment.json:away_implied_total`, the week's lowest, as a 10.5-point underdog `game-environment.json:spread_line`; Willis has 39.18 `usage.json:pooled.half_ppr_points` in three games. |

### 11. Chiefs at Raiders - Sun 16:25 ET [#119 game 4]

Row `2026_04_KC_LV`: Chiefs -4.5 `game-environment.json:spread_line`, total
47.5 `game-environment.json:total_line`; Chiefs 26
`game-environment.json:away_implied_total`, Raiders 21.5
`game-environment.json:home_implied_total`. Dome.

**Chiefs**

| Player | Call | Reason |
|---|---|---|
| QB Patrick Mahomes | **Start** | 66.58 `usage.json:pooled.half_ppr_points` over 3 `usage.json:games` (22.2 a game), a 26 `game-environment.json:away_implied_total`; Las Vegas allows 16.13 to QBs, rank 22 `points-allowed.json:per_game,rank`. |
| RB Kenneth Walker III | **Start** | Rush share 0.7065 `usage.json:pooled.rush_share`, target share 0.1978 `usage.json:pooled.target_share`, 73.7 `usage.json:pooled.half_ppr_points` over 3 games; Las Vegas allows 15.13 to RBs, rank 23 `points-allowed.json:per_game,rank`. |
| RB Emmett Johnson | **Sit** | Rush share 0.1739 `usage.json:pooled.rush_share`, target share 0 `usage.json:last_week.target_share`, 1.7 `usage.json:last_week.half_ppr_points`. |
| WR Rashee Rice | **Start** | Target share 0.3913 `usage.json:last_week.target_share`, air-yards share 0.4658 `usage.json:last_week.air_yards_share`, Full `injuries.json:practice_status`; volume over Las Vegas's 18.27 to WRs, rank 30 `points-allowed.json:per_game,rank`. |
| WR Xavier Worthy | **Sit** | Target share fell to 0.087 `usage.json:last_week.target_share` from 0.1648 `usage.json:pooled.target_share` on the same 0.8269 `usage.json:last_week.snap_share`, in the rank-30 WR matchup. |
| WR Tyquan Thornton | **Sit** | Air-yards share 0.2686 `usage.json:pooled.air_yards_share` on target share 0.0769 `usage.json:pooled.target_share`, 3.2 `usage.json:last_week.half_ppr_points`. |
| TE Travis Kelce | **Start** | Target share 0.1978 `usage.json:pooled.target_share` on 0.7861 `usage.json:pooled.snap_share` (snap share stands in for routes), against Las Vegas's 17.73 to TEs, rank 3 `points-allowed.json:per_game,rank`. |
| D/ST Chiefs | **Flex** | Las Vegas is implied for 21.5 `game-environment.json:home_implied_total` as a 4.5-point underdog `game-environment.json:spread_line`; Kansas City allows the fewest to QBs, 8.95, rank 32 `points-allowed.json:per_game,rank`, but Cousins has 56.24 `usage.json:pooled.half_ppr_points` in three games. |

**Raiders**

| Player | Call | Reason |
|---|---|---|
| QB Kirk Cousins | **Sit** | 56.24 `usage.json:pooled.half_ppr_points` over 3 games, but Kansas City allows the fewest to QBs, 8.95, rank 32 `points-allowed.json:per_game,rank`, on a 21.5 `game-environment.json:home_implied_total`. |
| RB Ashton Jeanty | **Start** | Rush share 0.6774 `usage.json:pooled.rush_share`, target share 0.1818 `usage.json:pooled.target_share`, on 0.796 `usage.json:pooled.snap_share`; Full `injuries.json:practice_status`. |
| RB Connor Heyward | **Sit** | Listed FB in the table: rush share 0.0215 `usage.json:pooled.rush_share`, target share 0 `usage.json:pooled.target_share`, 0.2 `usage.json:pooled.half_ppr_points`. |
| WR Tre Tucker | **Sit** | Target share 0.1705 `usage.json:pooled.target_share`, 0.1333 `usage.json:last_week.target_share`, against the fewest WR points allowed, 17.47, rank 32 `points-allowed.json:per_game,rank`. |
| WR Jalen Nailor | **Sit** | Target share 0.125 `usage.json:pooled.target_share`, 7.7 `usage.json:pooled.half_ppr_points` over 3 games, 2.1 `usage.json:last_week.half_ppr_points`. |
| WR Jack Bech | **Sit** | Target share 0.1034 `usage.json:pooled.target_share` on 0.4656 `usage.json:pooled.snap_share` over 2 games, no week 3 row. |
| TE Brock Bowers | **Start** | One game: target share 0.4333 `usage.json:pooled.target_share`, air-yards share 0.4015 `usage.json:pooled.air_yards_share`, snap share 0.7857 `usage.json:pooled.snap_share` (snap share stands in for routes). Not on the injury report. |
| D/ST Raiders | **Sit** | Kansas City is implied for 26 `game-environment.json:away_implied_total`; Mahomes has 66.58 `usage.json:pooled.half_ppr_points` in three games; the Raiders are 4.5-point underdogs `game-environment.json:spread_line`. |

### 12. Chargers at Seahawks - Sun 16:25 ET [#119 game 5]

Row `2026_04_LAC_SEA`: Seahawks -7 `game-environment.json:spread_line`, total
42.5 `game-environment.json:total_line`; Seahawks 24.75
`game-environment.json:home_implied_total`, Chargers 17.75
`game-environment.json:away_implied_total`. Seattle had no rows in
`injuries.json` when fetched.

**Chargers**

| Player | Call | Reason |
|---|---|---|
| QB Justin Herbert | **Sit** | 33.88 `usage.json:pooled.half_ppr_points` over 3 `usage.json:games`, a 17.75 `game-environment.json:away_implied_total`, and Seattle's 12.25 to QBs, rank 28 `points-allowed.json:per_game,rank`. |
| RB Omarion Hampton | **Flex** | Rush share 0.6173 `usage.json:pooled.rush_share` on 0.5417 `usage.json:pooled.snap_share`, but target share 0.0349 `usage.json:pooled.target_share` and Seattle's 13.9 to RBs, rank 28 `points-allowed.json:per_game,rank`. |
| RB Keaton Mitchell | **Sit** | Rush share 0.2099 `usage.json:pooled.rush_share`, snap share 0.3125 `usage.json:pooled.snap_share`; 12.2 `usage.json:last_week.half_ppr_points` was a one-week spike. |
| WR Ladd McConkey | **Flex** | Air-yards share 0.2518 `usage.json:pooled.air_yards_share`, snap share up to 0.8841 `usage.json:last_week.snap_share`, target share 0.1744 `usage.json:pooled.target_share`; Seattle allows 18.67 to WRs, rank 29 `points-allowed.json:per_game,rank`. |
| WR Quentin Johnston | **Sit** | Target share 0.1977 `usage.json:pooled.target_share` on 0.8229 `usage.json:pooled.snap_share` has produced 10.1 `usage.json:pooled.half_ppr_points` in three games. |
| WR Tre Harris | **Sit** | Target share 0.186 `usage.json:pooled.target_share`, 19.9 `usage.json:pooled.half_ppr_points` over 3 games, in the rank-29 WR matchup. |
| TE Oronde Gadsden II | **Sit** | Snap share 0.5652 `usage.json:last_week.snap_share` (snap share stands in for routes) but target share 0.0814 `usage.json:pooled.target_share` and 0 `usage.json:last_week.half_ppr_points`; Seattle allows 9 to TEs, rank 21 `points-allowed.json:per_game,rank`. |
| D/ST Chargers | **Sit** | Seattle is implied for 24.75 `game-environment.json:home_implied_total`; Darnold scored 27.66 `usage.json:last_week.half_ppr_points`; the Chargers are 7-point underdogs `game-environment.json:spread_line`. |

**Seahawks**

| Player | Call | Reason |
|---|---|---|
| QB Sam Darnold | **Start** | 27.66 `usage.json:last_week.half_ppr_points` as the week 3 starter, a 24.75 `game-environment.json:home_implied_total`, and the Chargers' 17.89 to QBs, rank 12 `points-allowed.json:per_game,rank`. Seattle had no injury rows; Drew Lock started two games (34.18 `usage.json:pooled.half_ppr_points`). |
| RB Jadarian Price | **Sit** | Rush share 0.35 `usage.json:pooled.rush_share`, 0.2778 `usage.json:last_week.rush_share`, 0.7 `usage.json:last_week.half_ppr_points`. Emanuel Wilson, not on #119's list, led at 0.5 `usage.json:last_week.rush_share`. |
| RB George Holani | **Sit** | Rush share 0.1875 `usage.json:pooled.rush_share`, target share 0.0737 `usage.json:pooled.target_share`, snap share 0.3476 `usage.json:pooled.snap_share`. |
| WR Jaxon Smith-Njigba | **Start** | Target share 0.3789 `usage.json:pooled.target_share`, air-yards share 0.5186 `usage.json:pooled.air_yards_share`, 90.56 `usage.json:pooled.half_ppr_points` over 3 games, the week's most by a WR here. |
| WR Cooper Kupp | **Sit** | Target share 0.1053 `usage.json:pooled.target_share`, 0.1111 `usage.json:last_week.target_share`, 20.1 `usage.json:pooled.half_ppr_points` over 3 games; the Chargers allow 27.43 to WRs, rank 14 `points-allowed.json:per_game,rank`. |
| WR Rashid Shaheed | **Sit** | Target share 0.1263 `usage.json:pooled.target_share`, 0.0667 `usage.json:last_week.target_share`, 8.7 `usage.json:pooled.half_ppr_points` over 3 games. |
| TE AJ Barner | **Flex** | Snap share 0.861 `usage.json:pooled.snap_share` (snap share stands in for routes), target share 0.2 `usage.json:last_week.target_share`, but 19.1 `usage.json:pooled.half_ppr_points` over 3 games; the Chargers allow 9.73 to TEs, rank 18 `points-allowed.json:per_game,rank`. |
| D/ST Seahawks | **Start** | The Chargers are implied for 17.75 `game-environment.json:away_implied_total` as 7-point underdogs `game-environment.json:spread_line`; Herbert has 33.88 `usage.json:pooled.half_ppr_points` in three games. |

### 13. Broncos at 49ers - Sun 16:25 ET [#119 game 6]

Row `2026_04_DEN_SF`: 49ers -3 `game-environment.json:spread_line`, total 47.5
`game-environment.json:total_line`; 49ers 25.25
`game-environment.json:home_implied_total`, Broncos 22.25
`game-environment.json:away_implied_total`.

**Broncos**

| Player | Call | Reason |
|---|---|---|
| QB Bo Nix | **Sit** | 43.7 `usage.json:pooled.half_ppr_points` over 3 `usage.json:games` (14.6 a game) against San Francisco's 14.53 to QBs, rank 25 `points-allowed.json:per_game,rank`; 24.14 `usage.json:last_week.half_ppr_points` is the outlier. |
| RB J.K. Dobbins | **Sit** | Rush share 0.5147 `usage.json:pooled.rush_share` but snap share 0.4222 `usage.json:pooled.snap_share`, target share 0.023 `usage.json:pooled.target_share`, and 13 `usage.json:pooled.half_ppr_points` in three games. |
| RB RJ Harvey | **Flex** | Target share 0.1897 `usage.json:pooled.target_share`, 0.2258 `usage.json:last_week.target_share`, on 0.4237 `usage.json:pooled.snap_share`; San Francisco allows 19.83 to RBs, rank 11 `points-allowed.json:per_game,rank`. Better in full PPR. |
| WR Jaylen Waddle | **Flex** | Target share 0.2299 `usage.json:pooled.target_share`, air-yards share 0.4379 `usage.json:pooled.air_yards_share`, but 23.9 `usage.json:pooled.half_ppr_points` in three games and San Francisco's 22.73 to WRs, rank 25 `points-allowed.json:per_game,rank`. |
| WR Courtland Sutton | **Sit** | Target share 0.1839 `usage.json:pooled.target_share` and air-yards share 0.273 `usage.json:pooled.air_yards_share` have produced 12.2 `usage.json:pooled.half_ppr_points` in three games. |
| WR Pat Bryant | **Sit** | Target share 0.1034 `usage.json:pooled.target_share`, 0.0645 `usage.json:last_week.target_share`; 13.4 `usage.json:last_week.half_ppr_points` came on one target in sixteen. |
| TE Evan Engram | **Sit** | Target share 0.092 `usage.json:pooled.target_share` on 0.5778 `usage.json:pooled.snap_share` (snap share stands in for routes); San Francisco allows 7.73 to TEs, rank 24 `points-allowed.json:per_game,rank`. |
| D/ST Broncos | **Sit** | San Francisco is implied for 25.25 `game-environment.json:home_implied_total`; Purdy has 80.86 `usage.json:pooled.half_ppr_points` in three games; Denver allows 26 to RBs, rank 4 `points-allowed.json:per_game,rank`. |

**49ers**

| Player | Call | Reason |
|---|---|---|
| QB Brock Purdy | **Start** | 80.86 `usage.json:pooled.half_ppr_points` over 3 games (27.0 a game), 31.28 `usage.json:last_week.half_ppr_points`, a 25.25 `game-environment.json:home_implied_total`. |
| RB Christian McCaffrey | **Start** | Rush share 0.6522 `usage.json:last_week.rush_share`, target share 0.2099 `usage.json:pooled.target_share`, against Denver's 26 to RBs, rank 4 `points-allowed.json:per_game,rank`. Did Not Participate `injuries.json:practice_status` - on the game-time list. |
| RB Kaelon Black | **Sit** | Rush share 0.3125 `usage.json:pooled.rush_share` falling to 0.1739 `usage.json:last_week.rush_share`; 1.7 `usage.json:last_week.half_ppr_points`. Flex if McCaffrey sits. |
| WR Deebo Samuel Sr. | **Flex** | Target share 0.1358 `usage.json:pooled.target_share` but 0 `usage.json:last_week.target_share` on 0.7593 `usage.json:last_week.snap_share`, 35.4 `usage.json:pooled.half_ppr_points` over 3 games; rises if Evans sits. |
| WR Mike Evans | **Flex** | Target share 0.1975 `usage.json:pooled.target_share`, air-yards share 0.2864 `usage.json:pooled.air_yards_share`; snap share 0.3333 `usage.json:last_week.snap_share` after the injury, and Did Not Participate `injuries.json:practice_status`. On the game-time list. |
| WR KhaDarel Hodge | **Sit** | Target share 0.0123 `usage.json:pooled.target_share`, 2.3 `usage.json:pooled.half_ppr_points`; Did Not Participate `injuries.json:practice_status`. |
| TE George Kittle | **Start** | Target share 0.2692 `usage.json:last_week.target_share` on 0.8519 `usage.json:last_week.snap_share` (snap share stands in for routes), 41.4 `usage.json:pooled.half_ppr_points` over 3 games; Denver allows 11.8 to TEs, rank 13 `points-allowed.json:per_game,rank`. |
| D/ST 49ers | **Flex** | Denver is implied for 22.25 `game-environment.json:away_implied_total`; Nix has 43.7 `usage.json:pooled.half_ppr_points` in three games; San Francisco allows 14.53 to QBs, rank 25 `points-allowed.json:per_game,rank`. |

### 14. Lions at Panthers - Sun 20:20 ET [#119 game 7]

Row `2026_04_DET_CAR`: Lions -3.5 `game-environment.json:spread_line`, total
51.5 `game-environment.json:total_line`, tied for the week's highest; Lions
27.5 `game-environment.json:away_implied_total`, Panthers 24
`game-environment.json:home_implied_total`.

**Lions**

| Player | Call | Reason |
|---|---|---|
| QB Jared Goff | **Start** | 65.58 `usage.json:pooled.half_ppr_points` over 3 `usage.json:games` (21.9 a game), a 27.5 `game-environment.json:away_implied_total`, and Carolina's 18.97 to QBs, rank 10 `points-allowed.json:per_game,rank`. |
| RB Jahmyr Gibbs | **Start** | Rush share 0.7831 `usage.json:pooled.rush_share`, target share 0.1944 `usage.json:pooled.target_share`, against Carolina's 28.2 to RBs, rank 2 `points-allowed.json:per_game,rank`. |
| RB Sione Vaki | **Sit** | Rush share 0.1084 `usage.json:pooled.rush_share`, snap share 0.256 `usage.json:pooled.snap_share`, 9 `usage.json:pooled.half_ppr_points` over 3 games. |
| WR Amon-Ra St. Brown | **Start** | Target share 0.3241 `usage.json:pooled.target_share`, air-yards share 0.3752 `usage.json:pooled.air_yards_share`, 64.3 `usage.json:pooled.half_ppr_points` over 3 games; volume over Carolina's 18.17 to WRs, rank 31 `points-allowed.json:per_game,rank`. |
| WR Jameson Williams | **Sit** | Air-yards share 0.307 `usage.json:pooled.air_yards_share` on target share 0.1574 `usage.json:pooled.target_share`, 17.7 `usage.json:pooled.half_ppr_points` over 3 games, in the rank-31 WR matchup. |
| WR Isaac TeSlaa | **Sit** | Target share 0.0833 `usage.json:pooled.target_share`, snap share 0.4769 `usage.json:last_week.snap_share`, 11.7 `usage.json:pooled.half_ppr_points` over 3 games. |
| TE Sam LaPorta | **Start** | Snap share 0.8986 `usage.json:pooled.snap_share` (snap share stands in for routes), target share 0.1759 `usage.json:pooled.target_share`, against Carolina's 12.03 to TEs, rank 12 `points-allowed.json:per_game,rank`. |
| D/ST Lions | **Sit** | Carolina is implied for 24 `game-environment.json:home_implied_total` in a 51.5 total; Bryce Young has 69.16 `usage.json:pooled.half_ppr_points` in three games; Detroit allows the most to QBs, 30.02, rank 1 `points-allowed.json:per_game,rank`. |

**Panthers**

| Player | Call | Reason |
|---|---|---|
| QB Bryce Young | **Start** | Detroit allows the most to QBs, 30.02, rank 1 `points-allowed.json:per_game,rank`; 69.16 `usage.json:pooled.half_ppr_points` over 3 games; a 24 `game-environment.json:home_implied_total`. Full `injuries.json:practice_status`. |
| RB Chuba Hubbard | **Start** | Rush share 0.8261 `usage.json:last_week.rush_share` on 0.8442 `usage.json:last_week.snap_share`, 48.6 `usage.json:pooled.half_ppr_points` over 3 games. Did Not Participate `injuries.json:practice_status` - on the game-time list. |
| RB AJ Dillon | **Sit** | Rush share 0.1791 `usage.json:pooled.rush_share`, snap share 0.109 `usage.json:pooled.snap_share`, 4.4 `usage.json:pooled.half_ppr_points`. Flex if Hubbard sits. |
| WR Tetairoa McMillan | **Start** | Snap share 0.9481 `usage.json:last_week.snap_share`, target share 0.213 `usage.json:pooled.target_share`, against Detroit's 32.67 to WRs, rank 4 `points-allowed.json:per_game,rank`. |
| WR Jalen Coker | **Flex** | Target share 0.2037 `usage.json:pooled.target_share`, 43.2 `usage.json:pooled.half_ppr_points` over 3 games, in the rank-4 WR matchup; Did Not Participate `injuries.json:practice_status`. On the game-time list. |
| WR Xavier Legette | **Sit** | Target share 0.0909 `usage.json:pooled.target_share` over 2 games, no week 3 row; Did Not Participate `injuries.json:practice_status`. |
| WR Brycen Tremayne | **Sit** | Snap share 0.8052 `usage.json:last_week.snap_share` with Legette out, but target share 0.0556 `usage.json:pooled.target_share`; 10.3 `usage.json:last_week.half_ppr_points` is all his output. Flex if Coker sits. |
| TE Darren Waller | **Flex** | Detroit allows the most to TEs, 28.53, rank 1 `points-allowed.json:per_game,rank`; target share 0.1905 `usage.json:last_week.target_share` on snap share 0.436 `usage.json:pooled.snap_share` (snap share stands in for routes). Did Not Participate `injuries.json:practice_status` - on the game-time list. |
| D/ST Panthers | **Sit** | Detroit is implied for 27.5 `game-environment.json:away_implied_total`, the week's joint-highest team total; Goff has 65.58 `usage.json:pooled.half_ppr_points` in three games. |

### 15. Falcons at Saints - Mon 20:15 ET [#119 game 8]

Row `2026_04_ATL_NO`: Saints -2.5 `game-environment.json:spread_line`, total
47.5 `game-environment.json:total_line`; Saints 25
`game-environment.json:home_implied_total`, Falcons 22.5
`game-environment.json:away_implied_total`. Dome. Neither team had rows in
`injuries.json` when fetched, so Travis Etienne Jr.'s absence is not in the
tables.

**Falcons**

| Player | Call | Reason |
|---|---|---|
| QB Michael Penix Jr. | **Flex** | One game: 14.04 `usage.json:pooled.half_ppr_points` on snap share 1 `usage.json:pooled.snap_share`, a 22.5 `game-environment.json:away_implied_total`, and New Orleans's 17.82 to QBs, rank 13 `points-allowed.json:per_game,rank`. |
| RB Bijan Robinson | **Start** | Rush share 0.6346 `usage.json:pooled.rush_share`, target share 0.2192 `usage.json:pooled.target_share`, 71.2 `usage.json:pooled.half_ppr_points` over 3 games; New Orleans allows 24.87 to RBs, rank 7 `points-allowed.json:per_game,rank`. |
| RB Brian Robinson Jr. | **Sit** | Rush share 0.2885 `usage.json:pooled.rush_share` on snap share 0.335 `usage.json:pooled.snap_share`, target share 0.0274 `usage.json:pooled.target_share`. Listed as "Brian Robinson" in the table. |
| WR Drake London | **Start** | Target share 0.4348 `usage.json:last_week.target_share`, air-yards share 0.5988 `usage.json:last_week.air_yards_share`, against New Orleans's 24 to WRs, rank 21 `points-allowed.json:per_game,rank`. |
| WR Jahan Dotson | **Sit** | Air-yards share 0.375 `usage.json:pooled.air_yards_share` but target share 0.137 `usage.json:pooled.target_share` and 6.1 `usage.json:pooled.half_ppr_points` over 3 games. |
| WR Olamide Zaccheaus | **Sit** | Target share 0.0822 `usage.json:pooled.target_share`, snap share 0.36 `usage.json:pooled.snap_share`, 3.7 `usage.json:pooled.half_ppr_points`. |
| TE Kyle Pitts Sr. | **Sit** | Snap share 0.53 `usage.json:pooled.snap_share` (snap share stands in for routes), target share 0.0822 `usage.json:pooled.target_share`, 3 `usage.json:pooled.half_ppr_points` in three games; New Orleans's 16.5 to TEs, rank 4 `points-allowed.json:per_game,rank`, cannot fix that. Listed as "Kyle Pitts" in the table. |
| D/ST Falcons | **Sit** | New Orleans is implied for 25 `game-environment.json:home_implied_total`; Shough has 69.38 `usage.json:pooled.half_ppr_points` in three games with rush share 0.175 `usage.json:pooled.rush_share`. |

**Saints**

| Player | Call | Reason |
|---|---|---|
| QB Tyler Shough | **Start** | 69.38 `usage.json:pooled.half_ppr_points` over 3 games (23.1 a game), rush share 0.175 `usage.json:pooled.rush_share`, a 25 `game-environment.json:home_implied_total`; Atlanta allows 18.23 to QBs, rank 11 `points-allowed.json:per_game,rank`. |
| RB Alvin Kamara | **Sit** | Rush share 0.3273 `usage.json:pooled.rush_share` on snap share 0.3099 `usage.json:pooled.snap_share`, 9.3 `usage.json:pooled.half_ppr_points` over 2 games, against Atlanta's 10.47 to RBs, rank 30 `points-allowed.json:per_game,rank`. Etienne's 0.375 `usage.json:pooled.rush_share` is freed, but nothing in the tables says to whom. |
| RB Kendre Miller | **Sit** | Rush share 0.2453 `usage.json:pooled.rush_share` over 2 games, 0.1429 `usage.json:last_week.rush_share`, in the rank-30 RB matchup. |
| WR Chris Olave | **Start** | Target share 0.2903 `usage.json:pooled.target_share`, air-yards share 0.4891 `usage.json:pooled.air_yards_share`, against Atlanta's 31.3 to WRs, rank 6 `points-allowed.json:per_game,rank`. |
| WR Devaughn Vele | **Flex** | Snap share 0.9138 `usage.json:pooled.snap_share`, target share 0.1774 `usage.json:pooled.target_share`, 30.7 `usage.json:pooled.half_ppr_points` over 3 games, in the rank-6 WR matchup. |
| WR Bryce Lance | **Sit** | Snap share 0.7284 `usage.json:pooled.snap_share` but target share 0.0645 `usage.json:pooled.target_share` and 0 `usage.json:last_week.half_ppr_points`. |
| TE Juwan Johnson | **Start** | Target share 0.2 `usage.json:last_week.target_share`, 40.8 `usage.json:pooled.half_ppr_points` over 3 games, on 0.681 `usage.json:pooled.snap_share` (snap share stands in for routes); Atlanta allows 14.2 to TEs, rank 7 `points-allowed.json:per_game,rank`. |
| D/ST Saints | **Sit** | Atlanta is implied for 22.5 `game-environment.json:away_implied_total`; Bijan Robinson has 71.2 `usage.json:pooled.half_ppr_points` in three games; New Orleans allows 24.87 to RBs, rank 7 `points-allowed.json:per_game,rank`. |

## Comparison with #118 and #119

_To be written once the game sections are in._
