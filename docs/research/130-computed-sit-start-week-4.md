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

## Comparison with #118 and #119

_To be written once the game sections are in._
