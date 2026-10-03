# NFL 2026 week 4 sit/start from this repository's computed tables - Sunday and Monday games (v2)

**Week: 4, not 5.** The derived tables landed on `main` in #135 on
2026-10-01, before Sunday's 09:30 ET kickoff, so this covers week 4's Sunday
and Monday games: #118's games 2-8 and all eight of #119's (15 games). The
Thursday game, Steelers at Browns, has been played by the time this is read
and is left out.

**Decision this serves:** which players to start, flex or sit in a 12-team,
half-PPR, one-QB lineup, with every call resting on numbers this repository
computed rather than on numbers quoted from another site.

**Status:** v2, complete for the tables as built at 2026-10-01T08:16Z plus
#129's `red-zone.json` and `team-pace.json` (#138, #139). v2 adds a red-zone
share to every RB, WR and TE call and both teams' pace to every game header,
corrects how `spread_line` is cited, and removes two claims the tables did not
support. Four calls changed; see "What changed in v2". Nothing the issue
lists is missing.

## Week synthesis

The tables say what the quoted pages could not: who actually gets the ball,
pooled over three weeks. Where that disagrees with a name or a matchup quote,
the share wins. 39 of 242 calls differ from #118 and #119, mostly cooling
tight ends and D/STs. Red-zone share, new in v2, moved four calls.

**Strongest starts.** Volume in a good setting:

- Jahmyr Gibbs (game 14): 0.7831 rush share and 18 of 19 red-zone carries, against the defense allowing the second-most to RBs, in a 51.5 total.
- Bijan Robinson (game 15): 0.6346 rush share, 0.2192 target share, 11 of 12 red-zone carries.
- Josh Allen (game 2): 93.44 half-PPR points in three games and a 27.5 team total.
- Jaxon Smith-Njigba (game 12): 0.3789 target share, 0.5186 air-yards share, half of Seattle's red-zone targets.
- Josh Downs (game 1): 0.2553 target share against the defense allowing the most to WRs.
- Trey McBride (game 6): 0.3009 target share and 0.4 red-zone target share at tight end.

**Riskiest sits.** Good numbers in a bad spot:

- Kirk Cousins (game 11): 56.24 points in three games, but Kansas City allows the fewest to QBs.
- Marvin Harrison Jr. (game 6): 0.7689 snap share, a 0.0796 target share and no red-zone touches.
- Oronde Gadsden II (game 12): a 0.0814 target share; #119 started him.
- Carnell Tate (game 9): 0.25 target share, but 1 of 12 red-zone targets on the league's slowest offense.

**Sleepers.** Shares the quoted pages missed:

- Luther Burden III (game 3): 0.3333 red-zone target share on the second-fastest offense.
- Kalif Raymond (game 3): 0.2333 target share.
- Dontayvion Wicks (game 7): 0.1852 target share on 0.88 week 3 snaps, and 4 of 10 red-zone targets.
- Bucky Irving (game 8): 0.6061 rush share against the defense allowing the most to RBs.
- Cardinals D/ST (game 6): Jameis Winston has 8.66 points in two games.

**Likely busts.** Names ahead of usage:

- Saquon Barkley (game 7): 19.5 points in three games, 5 of 14 red-zone carries.
- Jaylen Waddle (game 13): 23.9 points in three games.
- Mark Andrews (game 9): 18.7 points; Derrick Henry takes 20 of Baltimore's 24 red-zone carries.
- Xavier Worthy (game 11): week 3 target share fell to 0.087.
- Jameson Williams (game 14): 0.1574 target share against the rank-31 WR defense.

**What moves before kickoff.** The injury table holds Wednesday's practice
only. Adams, Jefferson, McCaffrey, Hubbard and Evans did not practise; each
has a pivot below. Atlanta, Chicago, New Orleans, Philadelphia and Seattle
had no rows at all.

## What changed in v2

A call changed only where red-zone or pace numbers moved it. Every other
call is v1's, now with a red-zone share added.

| Player | Game | v1 call | v2 call | Numbers that moved it |
|---|---|---|---|---|
| WR Luther Burden III | 3 | Flex | **Start** | Red-zone target share 0.3333 `red-zone.json:rz_target_share` (6 of 18), double any other Bear's, on 68.67 `team-pace.json:plays_per_game`, second in the league. |
| TE Tucker Kraft | 8 | Flex | **Sit** | Red-zone target share 0.0556 `red-zone.json:rz_target_share` (1 of 18), tied for sixth on the team, in a 38.5 `game-environment.json:total_line`. |
| WR Carnell Tate | 9 | Flex | **Sit** | Red-zone target share 0.0833 `red-zone.json:rz_target_share` (1 of 12), on the league's slowest offense, 52.33 `team-pace.json:plays_per_game`. |
| TE Mark Andrews | 9 | Flex | **Sit** | Red-zone target share 0.1 `red-zone.json:rz_target_share` (1 of 10), while Derrick Henry has 0.8333 `red-zone.json:rz_carry_share` (20 of 24), on a 0.4565 `team-pace.json:neutral_pass_rate`. |

Not calls, but also changed:

- **Spread citations.** `spread_line` is positive when the home team is
  favored. v1 cited it betting-style in nine game headers ("Bills -6.5"
  where the table holds 6.5), and the comparison set table spreads beside
  quoted ones without saying which sign convention each used. Each now gives
  the table's value and its meaning; the convention is under "How to read a
  citation".
- **Game 15.** v1 asserted that Travis Etienne Jr. was absent, but nothing
  in the tables shows that: he has 3 games in `usage.json`, and New Orleans
  had no injury rows. The claim is gone. Kamara is re-judged on the tables
  alone, and the call stays Sit.
- **Game 3.** The game-time row no longer speculates about Caleb Williams
  returning, because the tables do not say who starts.
- **Pivots.** Darren Waller's pivot is now Mike Gesicki (game 4), because
  Andrews is a Sit.

## How to read a citation

Every number is cited as a value followed by its table file and column, for
example ``0.2451 `usage.json:pooled.target_share` ``: open `usage.json`, find
the player's row, read `pooled.target_share`. All six tables are
in [`data/nflverse/2026/week-04/`](../../data/nflverse/2026/week-04/). The
first four were built from nflverse files fetched at 2026-10-01T08:16Z, and
`red-zone.json` and `team-pace.json` from play-by-play fetched at 08:46Z
(#139). Their schema is
[ADR 0008](../decisions/0008-derived-weekly-tables-schema.md) and its
amendment.

- `usage.json`: `pooled.*` is weeks 1-3 pooled (Σ player / Σ team over the
  games the player has a row in); `last_week.*` is week 3 alone. Shares are
  fractions, quoted as in the table (0.2451 = 24.5%).
- `points-allowed.json`: half-PPR points per game the opponent's defense has
  allowed to the position over weeks 1-3, `rank` 1 = most allowed of 32.
  Cited as `per_game` and `rank` for the row (`defense`, `position`).
- `game-environment.json`: `spread_line`, `total_line`, and
  `home_implied_total` / `away_implied_total` = (total ± spread) / 2.
  **`spread_line` is signed from the home team's side: positive means the home
  team is favored, negative means the away team is.** It is not a betting
  line, where the favorite carries the minus sign. A cited spread gives the
  table's value and then its meaning, e.g. ``6.5 `game-environment.json:spread_line` (positive = home favored: Bills by 6.5)``.
- `red-zone.json`: weeks 1-3, snaps inside the opponent's 20, two-point tries
  excluded, joined to `usage.json` on `player_id` (its `player` names are
  play-by-play abbreviations). Cited as `rz_target_share` for a pass-catcher
  and `rz_carry_share` for a back, with the counts behind the share in
  brackets (`rz_targets` of `team_rz_targets`, or `rz_carries` of
  `team_rz_carries`). A player with no row had no red-zone target or carry,
  and the reason says "no red-zone touches" rather than citing a zero.
- `team-pace.json`: one row per offense, weeks 1-3. Each game header gives
  both teams' `plays_per_game` and `neutral_pass_rate` (pass rate on first and
  second down with win probability 0.2-0.8).
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

- **Red zone and pace are now cited** (v2). Every RB, WR and TE call gives
  its red-zone share from `red-zone.json`, or says "no red-zone touches" when
  the player has no row. Every game header gives both teams' `plays_per_game`
  and `neutral_pass_rate` from `team-pace.json`, and a rationale cites pace
  only where it changes the reading. What the red-zone table does not hold is
  touchdowns: a share says who is used near the goal line, not who scored.
- **Routes.** Snap share (`snap_share`) stands in for route participation,
  and every tight-end call says so.
- **Weather.** Not used in any call. No external forecast was read.
- **D/ST.** The tables have no defense scoring. A D/ST call rests on the
  opponent's implied total, the spread, and the opposing quarterback's
  production and the defense's own QB points allowed from the tables.
- **Depth-chart news after 08:16Z on 2026-10-01**, including Friday's final
  statuses.

## Game-time decisions

Rebuilt in round 2 from Friday's final designations: every player on this
document's list whose `report_status` in `injuries.json` is Questionable or
Doubtful, and the call that rests on them. The tables were rebuilt at
2026-10-03T06:38Z from nflverse's 06:01 UTC injuries file. No listed player
is Doubtful.

| Player | Game | Status `injuries.json` | Call here | Pivot |
|---|---|---|---|---|
| WR Keenan Allen (IND) | 1, Sun 09:30 | Questionable; Did Not Participate; "Not injury related - resting player" | Flex | A rest day, not an injury. If inactive, a later WR: Wan'Dale Robinson (game 9) or Malik Washington (game 10). |
| WR Terry McLaurin (WAS) | 1, Sun 09:30 | Questionable; Limited; Hamstring | Start | If inactive, Stefon Diggs's Flex firms; for a Start-grade pivot, Wan'Dale Robinson (game 9). |
| TE Kenyon Sadiq (NYJ) | 3, Sun 13:00 | Questionable; Limited; Back | Flex | Mason Taylor is Out, so Sadiq is the Jets' TE if active. If inactive, T.J. Hockenson (game 10, 16:05). |
| TE Colby Parkinson (LA), for Tyler Higbee | 7, Sun 13:00 | Questionable; Did Not Participate; Knee | Higbee Flex | Ferguson is Out. If Parkinson plays, Higbee drops to Sit; use Hockenson (game 10). Higbee himself Did Not Participate but has no `report_status`. |
| WR Zay Flowers (BAL) | 9, Sun 13:00 | Questionable; Limited; Hamstring | Start | If inactive, Rashod Bateman moves to Flex; for a Start, Jordan Addison (game 10) is already one. |
| WR Chris Moore (BAL) | 9, Sun 13:00 | Questionable; Limited; Ankle | Sit | None needed. |
| RB Tyjae Spears (TEN) | 9, Sun 13:00 | Questionable; Full; Ankle | Sit | None needed. If inactive, Pollard's Flex firms. |
| WR Ladd McConkey (LAC) | 12, Sun 16:25 | Questionable; Limited; Foot | Flex | If inactive, no Chargers WR moves up; Deebo Samuel Sr. (game 13, same window). |
| WR Mike Evans (SF) | 13, Sun 16:25 | Questionable; Limited; Ribs | Flex | If inactive, Deebo Samuel Sr. stays Flex and George Kittle gains. |
| WR Jalen Coker (CAR) | 14, Sun 20:20 | Questionable; Limited; Quadricep | Flex | If inactive, Brycen Tremayne moves to Flex. Sunday night: set an earlier flex if you cannot wait for inactives. |

**Out, so already decided** (each a Sit, handled in its game section):
Jayden Daniels and Rachaad White (game 1), Breece Hall, Adonai Mitchell,
Mason Taylor and Caleb Williams (game 3), Colbie Young (game 4), Terrance
Ferguson and DeVonta Smith (game 7), Baker Mayfield (game 8), Caleb Douglas
and Justin Jefferson (game 10), Jadarian Price (game 12) and Xavier Legette
(game 14).

**Atlanta, New Orleans and New York (Giants) had posted no `report_status`
when the tables were built.** Their rows in `injuries.json` are practice
status only, and none names a player on this document's list, so the calls
in games 6 and 15 rest on practice status only. Game 15 is Monday: check
those teams' reports before setting a lineup.

## Games

Kickoff order. The number in brackets is the game's number in #118
(`116-…`) or #119 (`117-…`).

### 1. Colts at Commanders (London) - Sun 09:30 ET [#119 game 1]

Row `2026_04_IND_WAS`: -4.5 `game-environment.json:spread_line` (negative =
away favored: Colts by 4.5), total 47.5 `game-environment.json:total_line`;
Colts 26 `game-environment.json:away_implied_total`, Commanders 21.5
`game-environment.json:home_implied_total`. Jayden Daniels and Rachaad White
are Out `injuries.json:report_status`; Mariota starts.

Pace: Colts 62.33 `team-pace.json:plays_per_game` and 0.5455
`team-pace.json:neutral_pass_rate`; Commanders 66 and 0.5109.

**Colts**

| Player | Call | Reason |
|---|---|---|
| QB Daniel Jones | **Flex** | Washington allows 27.38 to QBs, rank 2 `points-allowed.json:per_game,rank`, and the Colts' 26 `game-environment.json:away_implied_total` is the game's higher total, but his own output is 28.34 `usage.json:pooled.half_ppr_points` over 3 `usage.json:games` (9.4 a game) and 7.9 `usage.json:last_week.half_ppr_points`. A streamer, not a weekly start. |
| RB Jonathan Taylor | **Start** | Rush share 0.7952 `usage.json:pooled.rush_share` on 0.8895 `usage.json:pooled.snap_share` and 59 `usage.json:pooled.half_ppr_points` over 3 games; volume outweighs a Washington defense allowing 10.27 to RBs, rank 32 `points-allowed.json:per_game,rank`. Red-zone carry share 0.9231 `red-zone.json:rz_carry_share` (12 of 13). Full `injuries.json:practice_status`, no `report_status`. |
| RB Seth McGowan | **Sit** | Rush share 0.0723 `usage.json:pooled.rush_share`, snap share 0.1105 `usage.json:pooled.snap_share`, 1.9 `usage.json:pooled.half_ppr_points` in three games, red-zone carry share 0.0769 `red-zone.json:rz_carry_share` (1 of 13). |
| WR Josh Downs | **Start** | Target share 0.2553 `usage.json:pooled.target_share` and air-yards share 0.451 `usage.json:pooled.air_yards_share`, up to 0.3143 `usage.json:last_week.target_share`, red-zone target share 0.3333 `red-zone.json:rz_target_share` (4 of 12), against the defense allowing the most to WRs, 38.99, rank 1 `points-allowed.json:per_game,rank`. |
| WR Keenan Allen | **Flex** | Target share 0.2128 `usage.json:pooled.target_share`, 0.2571 `usage.json:last_week.target_share`, on 0.6368 `usage.json:pooled.snap_share`, in the rank-1 WR matchup above; red-zone target share 0.25 `red-zone.json:rz_target_share` (3 of 12); 22.5 `usage.json:pooled.half_ppr_points` over 3 games caps him at WR3. Questionable `injuries.json:report_status`, a rest day (Did Not Participate `injuries.json:practice_status`, "Not injury related - resting player" `injuries.json:report_primary_injury`) - on the game-time list. |
| WR Laquon Treadwell | **Sit** | Snap share 0.6474 `usage.json:pooled.snap_share` but target share 0.0532 `usage.json:pooled.target_share` and 0.0286 `usage.json:last_week.target_share`; no red-zone touches. |
| TE Tyler Warren | **Start** | Target share 0.234 `usage.json:pooled.target_share` on snap share 0.9211 `usage.json:pooled.snap_share` (snap share stands in for routes), red-zone target share 0.25 `red-zone.json:rz_target_share` (3 of 12), against a defense allowing 19.07 to TEs, rank 2 `points-allowed.json:per_game,rank`. |
| D/ST Colts | **Sit** | Washington's 21.5 `game-environment.json:home_implied_total` is not low; Mariota, the starter with Daniels Out `injuries.json:report_status`, scored 20.42 `usage.json:last_week.half_ppr_points`; the Colts allow 21.87 to QBs, rank 5 `points-allowed.json:per_game,rank`. |

**Commanders**

| Player | Call | Reason |
|---|---|---|
| QB Jayden Daniels | **Sit** | Out `injuries.json:report_status` (elbow `injuries.json:report_primary_injury`). His 32.4 `usage.json:pooled.half_ppr_points` over 2 `usage.json:games` and rush share 0.1875 `usage.json:pooled.rush_share` do not play this week. Round 2: was Flex. |
| QB Marcus Mariota | **Flex** | The starter, with Daniels Out `injuries.json:report_status`: 20.42 `usage.json:last_week.half_ppr_points` as the week 3 starter, 29.16 `usage.json:pooled.half_ppr_points` over 2 games, against the Colts' 21.87 to QBs, rank 5 `points-allowed.json:per_game,rank`, but on a 21.5 `game-environment.json:home_implied_total`. A streamer. Round 2: was Sit. |
| RB Jacory Croskey-Merritt | **Start** | Rush share 0.4896 `usage.json:pooled.rush_share`, up to 0.5938 `usage.json:last_week.rush_share` on 0.5652 `usage.json:last_week.snap_share`, against the Colts' 25.93 to RBs, rank 5 `points-allowed.json:per_game,rank`, with White Out `injuries.json:report_status`. Red-zone carry share 0.3333 `red-zone.json:rz_carry_share` (5 of 15), the team's highest, and White's 4 of 15 are now free. Target share 0.0323 `usage.json:pooled.target_share` keeps the floor low. Round 2: was Flex. |
| RB Rachaad White | **Sit** | Out `injuries.json:report_status` (shoulder `injuries.json:report_primary_injury`); rush share 0.2292 `usage.json:pooled.rush_share` and target share 0.0968 `usage.json:pooled.target_share`; red-zone carry share 0.2667 `red-zone.json:rz_carry_share` (4 of 15). |
| WR Terry McLaurin | **Start** | Target share 0.2366 `usage.json:pooled.target_share`, 0.3 `usage.json:last_week.target_share`, air-yards share 0.4564 `usage.json:last_week.air_yards_share`, against the Colts' 29.67 to WRs, rank 11 `points-allowed.json:per_game,rank`. Red-zone target share 0.1538 `red-zone.json:rz_target_share` (2 of 13) is modest. Questionable `injuries.json:report_status` (hamstring, Limited `injuries.json:practice_status`) - on the game-time list. |
| WR Stefon Diggs | **Flex** | Target share 0.2366 `usage.json:pooled.target_share` on snap share 0.5762 `usage.json:pooled.snap_share`; red-zone target share 0.3077 `red-zone.json:rz_target_share` (4 of 13), the team's highest; 38 `usage.json:pooled.half_ppr_points` over 3 games but 5.3 `usage.json:last_week.half_ppr_points` with Mariota. |
| WR Dyami Brown | **Sit** | Target share 0.0968 `usage.json:pooled.target_share`, snap share down to 0.3043 `usage.json:last_week.snap_share`, 2.1 `usage.json:pooled.half_ppr_points`, red-zone target share 0.0769 `red-zone.json:rz_target_share` (1 of 13). |
| TE Ben Sinnott | **Sit** | Target share 0.0313 `usage.json:pooled.target_share` on 0.5857 `usage.json:pooled.snap_share` (snap share stands in for routes), 1.1 `usage.json:pooled.half_ppr_points`, no red-zone touches; the Colts' 14.13 to TEs, rank 8 `points-allowed.json:per_game,rank`, does not rescue it. |
| D/ST Commanders | **Sit** | The Colts are implied for 26 `game-environment.json:away_implied_total`; Washington allows 27.38 to QBs, rank 2 `points-allowed.json:per_game,rank`; S Nick Cross and G Sam Cosmi are Out `injuries.json:report_status`. |

### 2. Patriots at Bills - Sun 13:00 ET [#118 game 2]

Row `2026_04_NE_BUF`: 7 `game-environment.json:spread_line` (positive =
home favored: Bills by 7), total 49.5 `game-environment.json:total_line`;
Bills 28.25 `game-environment.json:home_implied_total`, Patriots 21.25
`game-environment.json:away_implied_total`.

Pace: Patriots 59.33 `team-pace.json:plays_per_game` and 0.5513
`team-pace.json:neutral_pass_rate`; Bills 60 and 0.5306.

**Patriots**

| Player | Call | Reason |
|---|---|---|
| QB Drake Maye | **Sit** | 21.6 `usage.json:pooled.half_ppr_points` over 3 `usage.json:games` (7.2 a game), 3.76 `usage.json:last_week.half_ppr_points`, and a 21.25 `game-environment.json:away_implied_total`; Buffalo's 19.66 to QBs, rank 8 `points-allowed.json:per_game,rank`, is not enough. |
| RB Rhamondre Stevenson | **Sit** | Rush share 0.3647 `usage.json:pooled.rush_share`, falling to 0.2692 `usage.json:last_week.rush_share`, on snap share 0.5979 `usage.json:pooled.snap_share`; 20.4 `usage.json:pooled.half_ppr_points` in three games. Buffalo's 25 to RBs, rank 6 `points-allowed.json:per_game,rank`, is split two ways, and New England has run 3 red-zone carries in three games, 0.3333 `red-zone.json:rz_carry_share` (1 of 3). |
| RB TreVeyon Henderson | **Sit** | Rush share 0.4444 `usage.json:pooled.rush_share` over 2 `usage.json:games` but 0.3077 `usage.json:last_week.rush_share` and target share 0.0196 `usage.json:pooled.target_share`; red-zone carry share 0.3333 `red-zone.json:rz_carry_share` (1 of 3). |
| WR Mack Hollins | **Flex** | Target share 0.1951 `usage.json:pooled.target_share`, 0.3 `usage.json:last_week.target_share`, air-yards share 0.2604 `usage.json:pooled.air_yards_share`, against Buffalo's 32.1 to WRs, rank 5 `points-allowed.json:per_game,rank`. Red-zone target share 0.4444 `red-zone.json:rz_target_share` is the team's highest, but on 4 of 9 targets. |
| WR Romeo Doubs | **Sit** | Target share 0.1341 `usage.json:pooled.target_share` and 0.1333 `usage.json:last_week.target_share`; 17.5 `usage.json:pooled.half_ppr_points` over three games; red-zone target share 0.1111 `red-zone.json:rz_target_share` (1 of 9). |
| WR DeMario Douglas | **Sit** | Target share 0.1707 `usage.json:pooled.target_share` on 0.5661 `usage.json:pooled.snap_share`; 10.2 `usage.json:pooled.half_ppr_points` over three games; red-zone target share 0.1111 `red-zone.json:rz_target_share` (1 of 9). |
| TE Hunter Henry | **Sit** | Target share 0.122 `usage.json:pooled.target_share`, 0.0667 `usage.json:last_week.target_share`, on 0.7831 `usage.json:pooled.snap_share` (snap share stands in for routes), red-zone target share 0.1111 `red-zone.json:rz_target_share` (1 of 9); Buffalo allows 8.2 to TEs, rank 22 `points-allowed.json:per_game,rank`. |
| D/ST Patriots | **Sit** | Buffalo's 28.25 `game-environment.json:home_implied_total` is the game's high, with New England a 7-point underdog `game-environment.json:spread_line`; Josh Allen has 93.44 `usage.json:pooled.half_ppr_points` in three games. |

**Bills**

| Player | Call | Reason |
|---|---|---|
| QB Josh Allen | **Start** | 93.44 `usage.json:pooled.half_ppr_points` over 3 games (31.1 a game) with rush share 0.3111 `usage.json:pooled.rush_share`, and a 28.25 `game-environment.json:home_implied_total`, which outweighs New England's 12.45 to QBs, rank 27 `points-allowed.json:per_game,rank`. |
| RB James Cook | **Start** | Rush share 0.6444 `usage.json:pooled.rush_share`, 0.7273 `usage.json:last_week.rush_share`, on 0.7121 `usage.json:pooled.snap_share`, as a 7-point favorite `game-environment.json:spread_line`; New England allows 18.83 to RBs, rank 14 `points-allowed.json:per_game,rank`. Red-zone carry share 0.6429 `red-zone.json:rz_carry_share` (9 of 14). |
| RB Ty Johnson | **Sit** | One game: snap share 0.2273 `usage.json:pooled.snap_share`, rush share 0 `usage.json:pooled.rush_share`, target share 0.1538 `usage.json:pooled.target_share`; no red-zone touches. |
| WR DJ Moore | **Start** | Target share 0.2195 `usage.json:pooled.target_share`, 0.3846 `usage.json:last_week.target_share`, air-yards share 0.3265 `usage.json:pooled.air_yards_share`, red-zone target share 0.1818 `red-zone.json:rz_target_share` (2 of 11); New England allows 26.73 to WRs, rank 15 `points-allowed.json:per_game,rank`. Limited `injuries.json:practice_status` but no `report_status`, so no game-day risk. |
| WR Khalil Shakir | **Sit** | Snap share 0.7273 `usage.json:last_week.snap_share` but target share 0.1154 `usage.json:last_week.target_share` and 1.1 `usage.json:last_week.half_ppr_points`. Red-zone target share 0.3636 `red-zone.json:rz_target_share` is the team's highest, but 4 of 11 targets is too few to start him on. |
| WR Keon Coleman | **Sit** | Target share 0.1098 `usage.json:pooled.target_share`, snap share 0.4848 `usage.json:last_week.snap_share`, red-zone target share 0.0909 `red-zone.json:rz_target_share` (1 of 11); Limited `injuries.json:practice_status`, no `report_status`. |
| TE Dalton Kincaid | **Start** | Target share 0.2073 `usage.json:pooled.target_share` and air-yards share 0.2497 `usage.json:pooled.air_yards_share` on 0.6818 `usage.json:pooled.snap_share` (snap share stands in for routes), 37.3 `usage.json:pooled.half_ppr_points` in three games; red-zone target share only 0.0909 `red-zone.json:rz_target_share` (1 of 11). New England allows the fewest to TEs, 4.53, rank 32 `points-allowed.json:per_game,rank` - his share outweighs it at a thin position. |
| D/ST Bills | **Start** | New England is implied for 21.25 `game-environment.json:away_implied_total` as a 7-point underdog `game-environment.json:spread_line`, and Maye has 21.6 `usage.json:pooled.half_ppr_points` in three games. |

### 3. Jets at Bears - Sun 13:00 ET [#118 game 3]

Row `2026_04_NYJ_CHI`: 3.5 `game-environment.json:spread_line` (positive =
home favored: Bears by 3.5), total 43.5 `game-environment.json:total_line`;
Bears 23.5 `game-environment.json:home_implied_total`, Jets 20
`game-environment.json:away_implied_total`. Caleb Williams is Out
`injuries.json:report_status` (hamstring), so Keenum starts. The Jets are
without Breece Hall, Adonai Mitchell and Mason Taylor, all Out
`injuries.json:report_status`.

Pace: Jets 64.67 `team-pace.json:plays_per_game` and 0.5728
`team-pace.json:neutral_pass_rate`; Bears 68.67 and 0.5398, the second-most
plays a game in the league.

**Jets**

| Player | Call | Reason |
|---|---|---|
| QB Geno Smith | **Flex** | 50.92 `usage.json:pooled.half_ppr_points` over 3 `usage.json:games` (17.0 a game) and 26.04 `usage.json:last_week.half_ppr_points`, against Chicago's 16.93 to QBs, rank 17 `points-allowed.json:per_game,rank`, on a 20 `game-environment.json:away_implied_total`. |
| RB Braelon Allen | **Start** | Breece Hall is Out `injuries.json:report_status`, which frees Hall's 0.6 `usage.json:pooled.rush_share` beside Allen's own 0.2235 `usage.json:pooled.rush_share`, with snap share 0.5152 `usage.json:last_week.snap_share`. Chicago allows 18.17 to RBs, rank 17 `points-allowed.json:per_game,rank`. Red-zone carry share 0.25 `red-zone.json:rz_carry_share` (3 of 12) and target share 0.375 `red-zone.json:rz_target_share` (3 of 8) already make him the goal-line back's partner. Round 2: was Flex. |
| RB Isaiah Davis | **Sit** | Rush share 0 `usage.json:pooled.rush_share`, target share 0 `usage.json:pooled.target_share`, 0 `usage.json:pooled.half_ppr_points` in two games; no red-zone touches. |
| WR Garrett Wilson | **Start** | Target share 0.2842 `usage.json:pooled.target_share`, 0.3611 `usage.json:last_week.target_share`, air-yards share 0.4189 `usage.json:pooled.air_yards_share`; volume outweighs Chicago's 22 to WRs, rank 27 `points-allowed.json:per_game,rank`. Red-zone target share is only 0.125 `red-zone.json:rz_target_share` (1 of 8). |
| WR Adonai Mitchell | **Sit** | Target share 0.2542 `usage.json:pooled.target_share` and air-yards share 0.5766 `usage.json:pooled.air_yards_share` over 2 `usage.json:games`, red-zone target share 0.125 `red-zone.json:rz_target_share` (1 of 8), but Out `injuries.json:report_status` (finger). |
| WR Isaiah Williams | **Sit** | Snap share 0.7729 `usage.json:pooled.snap_share` but target share 0.0947 `usage.json:pooled.target_share` and 2.6 `usage.json:last_week.half_ppr_points`; red-zone target share 0.125 `red-zone.json:rz_target_share` (1 of 8). |
| TE Kenyon Sadiq | **Flex** | Target share 0.2222 `usage.json:last_week.target_share` on 0.5758 `usage.json:last_week.snap_share` (snap share stands in for routes) with Mason Taylor Out `injuries.json:report_status`; Chicago allows 6.27 to TEs, rank 27 `points-allowed.json:per_game,rank`. Red-zone target share 0 `red-zone.json:rz_target_share` (0 of 8), so this is yardage only. Sadiq himself is Questionable `injuries.json:report_status` (back, Limited `injuries.json:practice_status`) - on the game-time list. |
| D/ST Jets | **Sit** | Chicago's 23.5 `game-environment.json:home_implied_total`; Keenum scored 24.48 `usage.json:last_week.half_ppr_points` in his start; the Jets are 3.5-point underdogs `game-environment.json:spread_line`. |

**Bears**

| Player | Call | Reason |
|---|---|---|
| QB Case Keenum | **Flex** | The starter, with Caleb Williams Out `injuries.json:report_status`: 24.48 `usage.json:last_week.half_ppr_points` in one start, against the Jets' 14.95 to QBs, rank 23 `points-allowed.json:per_game,rank`, on a 23.5 `game-environment.json:home_implied_total` and Chicago's 68.67 `team-pace.json:plays_per_game`. One start is a streamer's sample. Round 2: was Sit, held down by an unsettled starter. |
| RB D'Andre Swift | **Start** | Rush share 0.5143 `usage.json:pooled.rush_share` on snap share 0.6471 `usage.json:pooled.snap_share`, 52.1 `usage.json:pooled.half_ppr_points` over 3 games (17.4 a game), against the Jets' 21.1 to RBs, rank 9 `points-allowed.json:per_game,rank`. Red-zone carry share 0.56 `red-zone.json:rz_carry_share` (14 of 25) on the offense with the second-most plays a game, 68.67 `team-pace.json:plays_per_game`. |
| RB Kyle Monangai | **Sit** | Rush share 0.2857 `usage.json:pooled.rush_share` on 0.3575 `usage.json:pooled.snap_share`; 3.1 `usage.json:last_week.half_ppr_points`; red-zone carry share 0.24 `red-zone.json:rz_carry_share` (6 of 25). |
| WR Luther Burden III | **Start** | Target share 0.2556 `usage.json:pooled.target_share`, 0.3235 `usage.json:last_week.target_share`, air-yards share 0.2729 `usage.json:pooled.air_yards_share`, and red-zone target share 0.3333 `red-zone.json:rz_target_share` (6 of 18), double any other Bear's; Chicago runs 68.67 `team-pace.json:plays_per_game`, second in the league. The Jets allow 23.17 to WRs, rank 22 `points-allowed.json:per_game,rank`. Moved up from Flex in v2. |
| WR Kalif Raymond | **Flex** | Target share 0.2333 `usage.json:pooled.target_share` on 0.6561 `usage.json:pooled.snap_share`, 36.9 `usage.json:pooled.half_ppr_points` over 3 games, the team's best WR output; red-zone target share 0.1667 `red-zone.json:rz_target_share` (3 of 18). |
| WR Rome Odunze | **Sit** | Air-yards share 0.3415 `usage.json:pooled.air_yards_share` but target share 0.1444 `usage.json:pooled.target_share`, 17.9 `usage.json:pooled.half_ppr_points` over 3 games, red-zone target share 0.1111 `red-zone.json:rz_target_share` (2 of 18). |
| TE Colston Loveland | **Sit** | Snap share 0.8416 `usage.json:pooled.snap_share` (snap share stands in for routes) but target share 0.1 `usage.json:pooled.target_share` and 5.9 `usage.json:pooled.half_ppr_points` in three games; red-zone target share 0.1667 `red-zone.json:rz_target_share` (3 of 18) has not turned into points; the Jets allow 5.37 to TEs, rank 30 `points-allowed.json:per_game,rank`. |
| D/ST Bears | **Flex** | The Jets are implied for 20 `game-environment.json:away_implied_total` as 3.5-point underdogs `game-environment.json:spread_line`, without Hall, Mitchell and Taylor, all Out `injuries.json:report_status`, but Geno Smith has 50.92 `usage.json:pooled.half_ppr_points` in three games. |

### 4. Jaguars at Bengals - Sun 13:00 ET [#118 game 4]

Row `2026_04_JAX_CIN`: 2.5 `game-environment.json:spread_line` (positive =
home favored: Bengals by 2.5), total 51.5 `game-environment.json:total_line`,
the week's highest; Bengals 27
`game-environment.json:home_implied_total`, Jaguars 24.5
`game-environment.json:away_implied_total`.

Pace: Jaguars 55.67 `team-pace.json:plays_per_game` and 0.5833
`team-pace.json:neutral_pass_rate`; Bengals 58.67 and 0.6757, the league's
most pass-heavy neutral offense.

**Jaguars**

| Player | Call | Reason |
|---|---|---|
| QB Trevor Lawrence | **Start** | 52.04 `usage.json:pooled.half_ppr_points` over 3 `usage.json:games` (17.3 a game), 19.78 `usage.json:last_week.half_ppr_points`, a 24.5 `game-environment.json:away_implied_total` in a 51.5 total; Cincinnati allows 17.11 to QBs, rank 15 `points-allowed.json:per_game,rank`. |
| RB Bhayshul Tuten | **Flex** | Rush share 0.5 `usage.json:pooled.rush_share` on snap share 0.4944 `usage.json:pooled.snap_share` and target share 0.0658 `usage.json:pooled.target_share`; Cincinnati allows 15.87 to RBs, rank 20 `points-allowed.json:per_game,rank`. Red-zone carry share 0.5 `red-zone.json:rz_carry_share` (6 of 12). |
| RB Chris Rodriguez Jr. | **Sit** | Rush share 0.2326 `usage.json:pooled.rush_share`, snap share 0.2753 `usage.json:pooled.snap_share`, target share 0 `usage.json:pooled.target_share`. Red-zone carry share 0.4167 `red-zone.json:rz_carry_share` (5 of 12) makes him a touchdown dart, not a start. |
| WR Parker Washington | **Start** | Target share 0.3026 `usage.json:pooled.target_share` and air-yards share 0.4853 `usage.json:pooled.air_yards_share`, 41.6 `usage.json:pooled.half_ppr_points` over 3 games, red-zone target share 0.2308 `red-zone.json:rz_target_share` (3 of 13); Cincinnati allows 25.6 to WRs, rank 18 `points-allowed.json:per_game,rank`. |
| WR Jakobi Meyers | **Flex** | Target share 0.2963 `usage.json:last_week.target_share`, up from 0.1447 `usage.json:pooled.target_share`, on 0.7865 `usage.json:pooled.snap_share`; red-zone target share 0.1538 `red-zone.json:rz_target_share` (2 of 13). Full `injuries.json:practice_status`, no `report_status`. |
| WR Brian Thomas Jr. | **Sit** | Snap share 0.4213 `usage.json:pooled.snap_share`, target share 0.037 `usage.json:last_week.target_share`, 1.3 `usage.json:last_week.half_ppr_points`; no red-zone touches. |
| TE Brenton Strange | **Sit** | Target share 0.1316 `usage.json:pooled.target_share` on 0.764 `usage.json:pooled.snap_share` (snap share stands in for routes), 16.7 `usage.json:pooled.half_ppr_points` over 3 games, red-zone target share 0.1538 `red-zone.json:rz_target_share` (2 of 13), despite Cincinnati's 13.83 to TEs, rank 9 `points-allowed.json:per_game,rank`. |
| D/ST Jaguars | **Sit** | Cincinnati's 27 `game-environment.json:home_implied_total` in a 51.5 `game-environment.json:total_line`; Burrow has 52.92 `usage.json:pooled.half_ppr_points` in three games. |

**Bengals**

| Player | Call | Reason |
|---|---|---|
| QB Joe Burrow | **Start** | 52.92 `usage.json:pooled.half_ppr_points` over 3 games, 22.58 `usage.json:last_week.half_ppr_points`, and a 27 `game-environment.json:home_implied_total`; that outweighs Jacksonville's 11.09 to QBs, rank 30 `points-allowed.json:per_game,rank`. |
| RB Chase Brown | **Start** | Rush share 0.7206 `usage.json:pooled.rush_share` on 0.7072 `usage.json:pooled.snap_share` with a 27 `game-environment.json:home_implied_total`; Jacksonville's 14.27 to RBs, rank 27 `points-allowed.json:per_game,rank`, makes him an RB2, not an RB1. Red-zone carry share 0.6 `red-zone.json:rz_carry_share` (6 of 10). |
| RB Samaje Perine | **Sit** | Rush share 0.1471 `usage.json:pooled.rush_share`, snap share 0.3315 `usage.json:pooled.snap_share`, 1.9 `usage.json:last_week.half_ppr_points`, red-zone carry share 0.2 `red-zone.json:rz_carry_share` (2 of 10). |
| WR Ja'Marr Chase | **Start** | Target share 0.2451 `usage.json:pooled.target_share`, 0.3243 `usage.json:last_week.target_share`, on snap share 0.9392 `usage.json:pooled.snap_share`; red-zone target share 0.4 `red-zone.json:rz_target_share` (4 of 10) in the league's most pass-heavy neutral offense, 0.6757 `team-pace.json:neutral_pass_rate`. |
| WR Tee Higgins | **Start** | Air-yards share 0.459 `usage.json:pooled.air_yards_share`, target share 0.2255 `usage.json:pooled.target_share`, 37.4 `usage.json:pooled.half_ppr_points` over 3 games. Red-zone target share 0.1 `red-zone.json:rz_target_share` (1 of 10) - his points come from distance. |
| WR Dohnte Meyers | **Sit** | Target share 0.0686 `usage.json:pooled.target_share`; snap share rose to 0.5614 `usage.json:last_week.snap_share` with Colbie Young out, and Young is Out again `injuries.json:report_status`, but on 0.1351 `usage.json:last_week.target_share`, and no red-zone touches. |
| TE Mike Gesicki | **Flex** | 27.5 `usage.json:pooled.half_ppr_points` over 2 `usage.json:games`, target share 0.1408 `usage.json:pooled.target_share` and air-yards share 0.1959 `usage.json:pooled.air_yards_share`, on snap share 0.4132 `usage.json:pooled.snap_share` (snap share stands in for routes); red-zone target share 0.2 `red-zone.json:rz_target_share` (2 of 10); Jacksonville allows 6.5 to TEs, rank 26 `points-allowed.json:per_game,rank`. TD-dependent. |
| D/ST Bengals | **Sit** | Jacksonville is implied for 24.5 `game-environment.json:away_implied_total`; Lawrence has 52.04 `usage.json:pooled.half_ppr_points` in three games; the spread is only 2.5 `game-environment.json:spread_line`. |

### 5. Cowboys at Texans - Sun 13:00 ET [#118 game 5]

Row `2026_04_DAL_HOU`: 3 `game-environment.json:spread_line` (positive =
home favored: Texans by 3), total 48.5 `game-environment.json:total_line`;
Texans 25.75 `game-environment.json:home_implied_total`, Cowboys 22.75
`game-environment.json:away_implied_total`. `roof` is null in the table.

Pace: Cowboys 59.33 `team-pace.json:plays_per_game` and 0.6082
`team-pace.json:neutral_pass_rate`; Texans 66.67 and 0.5966.

**Cowboys**

| Player | Call | Reason |
|---|---|---|
| QB Dak Prescott | **Start** | 63.1 `usage.json:pooled.half_ppr_points` over 3 `usage.json:games` (21.0 a game) against Houston's 19.91 to QBs, rank 7 `points-allowed.json:per_game,rank`, on a 22.75 `game-environment.json:away_implied_total`. |
| RB Javonte Williams | **Start** | Rush share 0.6232 `usage.json:pooled.rush_share` on 0.754 `usage.json:pooled.snap_share`, 45.5 `usage.json:pooled.half_ppr_points` over 3 games; volume over Houston's 10.33 to RBs, rank 31 `points-allowed.json:per_game,rank`, which makes him an RB2 rather than an RB1. Red-zone carry share 0.7333 `red-zone.json:rz_carry_share` (11 of 15). |
| RB Tyler Goodson | **Sit** | One game: rush share 0.2 `usage.json:pooled.rush_share`, snap share 0.1486 `usage.json:pooled.snap_share`, 2.2 `usage.json:pooled.half_ppr_points`, red-zone carry share 0.0667 `red-zone.json:rz_carry_share` (1 of 15). |
| WR CeeDee Lamb | **Start** | Target share 0.2475 `usage.json:pooled.target_share`, air-yards share 0.4103 `usage.json:pooled.air_yards_share`, against Houston's 33.8 to WRs, rank 3 `points-allowed.json:per_game,rank`; red-zone target share 0.1667 `red-zone.json:rz_target_share` (3 of 18). |
| WR George Pickens | **Start** | Target share 0.2475 `usage.json:pooled.target_share`, 0.275 `usage.json:last_week.target_share`, air-yards share 0.3522 `usage.json:pooled.air_yards_share`, in the same rank-3 WR matchup; red-zone target share 0.1667 `red-zone.json:rz_target_share` (3 of 18). |
| WR Ryan Flournoy | **Sit** | Target share 0.1782 `usage.json:pooled.target_share` on 0.7059 `usage.json:pooled.snap_share` has produced 11.2 `usage.json:pooled.half_ppr_points` in three games, despite red-zone target share 0.2222 `red-zone.json:rz_target_share` (4 of 18). |
| TE Jake Ferguson | **Flex** | Target share 0.1089 `usage.json:pooled.target_share` on 0.6845 `usage.json:pooled.snap_share` (snap share stands in for routes), 27.7 `usage.json:pooled.half_ppr_points` over 3 games; Houston allows 10.17 to TEs, rank 16 `points-allowed.json:per_game,rank`. Fourth in line for targets behind two WRs at 0.2475, but tied for the team's highest red-zone target share, 0.2222 `red-zone.json:rz_target_share` (4 of 18). |
| D/ST Cowboys | **Sit** | Houston's 25.75 `game-environment.json:home_implied_total`; Dallas allows 23.51 to QBs, rank 3 `points-allowed.json:per_game,rank`; Dallas is a 3-point underdog `game-environment.json:spread_line`. |

**Texans**

| Player | Call | Reason |
|---|---|---|
| QB C.J. Stroud | **Start** | Dallas allows 23.51 to QBs, rank 3 `points-allowed.json:per_game,rank`, and Houston has the game's higher total, 25.75 `game-environment.json:home_implied_total`; his own 45.16 `usage.json:pooled.half_ppr_points` over 3 games makes him a low QB1. |
| RB David Montgomery | **Flex** | Rush share 0.5211 `usage.json:pooled.rush_share` on 0.5399 `usage.json:pooled.snap_share`, but 5.8 `usage.json:last_week.half_ppr_points`; Dallas allows 23 to RBs, rank 8 `points-allowed.json:per_game,rank`. Red-zone carry share 0.7 `red-zone.json:rz_carry_share` (7 of 10). |
| RB Woody Marks | **Sit** | Rush share 0.3099 `usage.json:pooled.rush_share`, target share 0.0714 `usage.json:pooled.target_share`, 19.1 `usage.json:pooled.half_ppr_points` over 3 games, red-zone carry share 0.3 `red-zone.json:rz_carry_share` (3 of 10). |
| WR Nico Collins | **Start** | One game: target share 0.2703 `usage.json:pooled.target_share`, air-yards share 0.4068 `usage.json:pooled.air_yards_share`, red-zone target share 0.1667 `red-zone.json:rz_target_share` (2 of 12). Full `injuries.json:practice_status` and no `report_status`, so the status that held him at Flex is gone. Dallas allows 24.27 to WRs, rank 20 `points-allowed.json:per_game,rank`, in Houston's 25.75 `game-environment.json:home_implied_total`. Round 2: was Flex. |
| WR Xavier Hutchinson | **Sit** | Target share 0.24 `usage.json:last_week.target_share` and air-yards share 0.4353 `usage.json:last_week.air_yards_share` without Collins, but 16.9 `usage.json:pooled.half_ppr_points` over 3 games and red-zone target share 0.0833 `red-zone.json:rz_target_share` (1 of 12); Collins is back. |
| WR Kayshon Boutte | **Sit** | Snap share 0.615 `usage.json:pooled.snap_share` but target share 0.0804 `usage.json:pooled.target_share` and 3.1 `usage.json:last_week.half_ppr_points`; red-zone target share 0.1667 `red-zone.json:rz_target_share` (2 of 12). |
| TE Dalton Schultz | **Start** | Target share 0.2232 `usage.json:pooled.target_share` on 0.6338 `usage.json:pooled.snap_share` (snap share stands in for routes) against Dallas's 14.43 to TEs, rank 6 `points-allowed.json:per_game,rank`; red-zone target share only 0.0833 `red-zone.json:rz_target_share` (1 of 12). Limited `injuries.json:practice_status` but no `report_status`. |
| D/ST Texans | **Sit** | Dallas is implied for 22.75 `game-environment.json:away_implied_total`; Prescott has 63.1 `usage.json:pooled.half_ppr_points` in three games; Houston allows 19.91 to QBs, rank 7 `points-allowed.json:per_game,rank`. |

### 6. Cardinals at Giants - Sun 13:00 ET [#118 game 6]

Row `2026_04_ARI_NYG`: Cardinals -2.5 `game-environment.json:spread_line`,
total 44.5 `game-environment.json:total_line`; Cardinals 23.5
`game-environment.json:away_implied_total`, Giants 21
`game-environment.json:home_implied_total`.

Pace: Cardinals 65.33 `team-pace.json:plays_per_game` and 0.5824
`team-pace.json:neutral_pass_rate`; Giants 59 and 0.4286, the league's
second-lowest neutral pass rate (Atlanta's 0.4176 is lower). New York had
posted no `report_status` when the tables were built; its rows are practice
status only.

**Cardinals**

| Player | Call | Reason |
|---|---|---|
| QB Jacoby Brissett | **Flex** | 48.58 `usage.json:pooled.half_ppr_points` over 3 `usage.json:games` (16.2 a game) and 25.6 `usage.json:last_week.half_ppr_points`; the Giants allow 16.94 to QBs, rank 16 `points-allowed.json:per_game,rank`. |
| RB Jeremiyah Love | **Start** | Rush share 0.5256 `usage.json:pooled.rush_share`, up to 0.7778 `usage.json:last_week.rush_share`, on 0.6437 `usage.json:last_week.snap_share`; the Giants allow 19.87 to RBs, rank 10 `points-allowed.json:per_game,rank`. Red-zone carry share 0.6 `red-zone.json:rz_carry_share` (9 of 15). |
| RB Tyler Allgeier | **Sit** | Rush share fell to 0.0741 `usage.json:last_week.rush_share` from 0.3077 `usage.json:pooled.rush_share`; 2.9 `usage.json:last_week.half_ppr_points`; red-zone carry share 0.2667 `red-zone.json:rz_carry_share` (4 of 15). |
| WR Michael Wilson | **Start** | Target share 0.2743 `usage.json:pooled.target_share`, 0.34 `usage.json:last_week.target_share`, air-yards share 0.4208 `usage.json:pooled.air_yards_share`, red-zone target share 0.25 `red-zone.json:rz_target_share` (5 of 20); the Giants allow 29.73 to WRs, rank 9 `points-allowed.json:per_game,rank`. |
| WR Marvin Harrison Jr. | **Sit** | Snap share 0.7689 `usage.json:pooled.snap_share` and air-yards share 0.2268 `usage.json:pooled.air_yards_share` have produced target share 0.0796 `usage.json:pooled.target_share` and 9.3 `usage.json:pooled.half_ppr_points` in three games, and no red-zone touches. |
| WR Kendrick Bourne | **Sit** | Target share 0.1239 `usage.json:pooled.target_share`, 0.06 `usage.json:last_week.target_share`, 3.2 `usage.json:last_week.half_ppr_points`, red-zone target share 0.1 `red-zone.json:rz_target_share` (2 of 20). |
| TE Trey McBride | **Start** | Target share 0.3009 `usage.json:pooled.target_share` on 0.8632 `usage.json:pooled.snap_share` (snap share stands in for routes), 46.1 `usage.json:pooled.half_ppr_points` over 3 games, red-zone target share 0.4 `red-zone.json:rz_target_share` (8 of 20); the Giants allow 9.6 to TEs, rank 19 `points-allowed.json:per_game,rank`. |
| D/ST Cardinals | **Flex** | The Giants are implied for 21 `game-environment.json:home_implied_total`, and Winston has 8.66 `usage.json:pooled.half_ppr_points` over 2 `usage.json:games` and 6.12 `usage.json:last_week.half_ppr_points`. |

**Giants**

| Player | Call | Reason |
|---|---|---|
| QB Jameis Winston | **Sit** | 8.66 `usage.json:pooled.half_ppr_points` over 2 games; Arizona's 21.98 to QBs, rank 4 `points-allowed.json:per_game,rank`, does not lift a 21 `game-environment.json:home_implied_total`. |
| RB Cam Skattebo | **Start** | Rush share 0.5495 `usage.json:pooled.rush_share`, target share 0.1905 `usage.json:last_week.target_share`, on 0.7656 `usage.json:last_week.snap_share`; Arizona allows 15.4 to RBs, rank 22 `points-allowed.json:per_game,rank`. Red-zone carry share 0.6923 `red-zone.json:rz_carry_share` (9 of 13) on the league's second most run-leaning neutral offense, 0.4286 `team-pace.json:neutral_pass_rate`. An RB2. |
| RB Najee Harris | **Sit** | Rush share 0.2407 `usage.json:pooled.rush_share` on snap share 0.1803 `usage.json:pooled.snap_share`, target share 0 `usage.json:pooled.target_share`, red-zone carry share 0.2308 `red-zone.json:rz_carry_share` (3 of 13). |
| WR Malik Nabers | **Flex** | Target share 0.2317 `usage.json:pooled.target_share` but air-yards share 0.042 `usage.json:last_week.air_yards_share` and 15.6 `usage.json:pooled.half_ppr_points` over 3 games; red-zone target share 0.3333 `red-zone.json:rz_target_share` (3 of 9) on a team that throws the second-least in neutral downs, 0.4286 `team-pace.json:neutral_pass_rate`. Arizona allows 34.2 to WRs, rank 2 `points-allowed.json:per_game,rank`. |
| WR Malachi Fields | **Sit** | Air-yards share 0.3021 `usage.json:pooled.air_yards_share` on target share 0.1463 `usage.json:pooled.target_share`, 2.9 `usage.json:last_week.half_ppr_points`; no red-zone touches. |
| WR Darnell Mooney | **Sit** | Target share 0.0976 `usage.json:pooled.target_share`, snap share 0.4375 `usage.json:last_week.snap_share`, 3.9 `usage.json:last_week.half_ppr_points`; no red-zone touches. |
| TE Isaiah Likely | **Start** | Target share 0.2805 `usage.json:pooled.target_share` on 0.8438 `usage.json:last_week.snap_share` (snap share stands in for routes), red-zone target share 0.4444 `red-zone.json:rz_target_share` (4 of 9), against Arizona's 14.93 to TEs, rank 5 `points-allowed.json:per_game,rank`. |
| D/ST Giants | **Sit** | Arizona is implied for 23.5 `game-environment.json:away_implied_total`; Brissett has 48.58 `usage.json:pooled.half_ppr_points` in three games; the Giants are 2.5-point underdogs `game-environment.json:spread_line`. |

### 7. Rams at Eagles - Sun 13:00 ET [#118 game 7]

Row `2026_04_LA_PHI`: -3.5 `game-environment.json:spread_line` (negative =
away favored: Rams by 3.5), total 42.5 `game-environment.json:total_line`;
Rams 23 `game-environment.json:away_implied_total`, Eagles 19.5
`game-environment.json:home_implied_total`. DeVonta Smith, Marquise Brown and
Dallas Goedert are Out `injuries.json:report_status`; so are the Rams' Terrance
Ferguson and Aaron Donald.

Pace: Rams 64 `team-pace.json:plays_per_game` and 0.5926
`team-pace.json:neutral_pass_rate`; Eagles 56.67 and 0.5044.

**Rams**

| Player | Call | Reason |
|---|---|---|
| QB Matthew Stafford | **Start** | 51.98 `usage.json:pooled.half_ppr_points` over 3 `usage.json:games` (17.3 a game), a 23 `game-environment.json:away_implied_total`, and Philadelphia's 20.72 to QBs, rank 6 `points-allowed.json:per_game,rank`. |
| RB Kyren Williams | **Start** | Rush share 0.6522 `usage.json:last_week.rush_share` on 0.7093 `usage.json:last_week.snap_share`, 47.5 `usage.json:pooled.half_ppr_points` over 3 games; Philadelphia allows 15.43 to RBs, rank 21 `points-allowed.json:per_game,rank`. Red-zone carry share 0.7273 `red-zone.json:rz_carry_share` (8 of 11). |
| RB Blake Corum | **Sit** | Rush share 0.35 `usage.json:pooled.rush_share` falling to 0.2609 `usage.json:last_week.rush_share`; 2.5 `usage.json:last_week.half_ppr_points`; red-zone carry share 0 `red-zone.json:rz_carry_share` (0 of 11). |
| WR Davante Adams | **Start** | Target share 0.2736 `usage.json:pooled.target_share`, air-yards share 0.4495 `usage.json:pooled.air_yards_share`, 56.8 `usage.json:pooled.half_ppr_points` over 3 games, red-zone target share 0.1667 `red-zone.json:rz_target_share` (2 of 12); Philadelphia allows 30 to WRs, rank 8 `points-allowed.json:per_game,rank`. Full `injuries.json:practice_status`, no `report_status`. |
| WR Puka Nacua | **Start** | One game: target share 0.3333 `usage.json:pooled.target_share`, air-yards share 0.444 `usage.json:pooled.air_yards_share`, then no week 3 row; red-zone target share 0.0833 `red-zone.json:rz_target_share` (1 of 12). Full `injuries.json:practice_status` and no `report_status`: the status that held him at Flex is gone, and Philadelphia allows 30 to WRs, rank 8 `points-allowed.json:per_game,rank`. Round 2: was Flex. |
| WR Konata Mumpfield | **Sit** | Target share 0.1633 `usage.json:last_week.target_share` and 17.3 `usage.json:last_week.half_ppr_points` without Nacua, but 0.1038 `usage.json:pooled.target_share` and red-zone target share 0.0833 `red-zone.json:rz_target_share` (1 of 12); Adams and Nacua both practised in full `injuries.json:practice_status`. |
| TE Tyler Higbee | **Flex** | Target share 0.2245 `usage.json:last_week.target_share` on 0.7093 `usage.json:last_week.snap_share` (snap share stands in for routes), with Terrance Ferguson Out and Colby Parkinson Questionable `injuries.json:report_status`; Philadelphia allows 4.8 to TEs, rank 31 `points-allowed.json:per_game,rank`. Red-zone target share 0.1667 `red-zone.json:rz_target_share` (2 of 12), level with Parkinson's. Higbee himself Did Not Participate `injuries.json:practice_status` but carries no `report_status`. On the game-time list via Parkinson. |
| D/ST Rams | **Sit** | Philadelphia is implied for 19.5 `game-environment.json:home_implied_total` without DeVonta Smith, Out `injuries.json:report_status`, but Hurts has 53.5 `usage.json:pooled.half_ppr_points` in three games with rush share 0.2105 `usage.json:pooled.rush_share`. |

**Eagles**

| Player | Call | Reason |
|---|---|---|
| QB Jalen Hurts | **Start** | 53.5 `usage.json:pooled.half_ppr_points` over 3 games with rush share 0.2105 `usage.json:pooled.rush_share`; the Rams allow 16.19 to QBs, rank 20 `points-allowed.json:per_game,rank`. The rushing floor carries a 19.5 `game-environment.json:home_implied_total` and the loss of DeVonta Smith, Out `injuries.json:report_status`. |
| RB Saquon Barkley | **Flex** | Rush share 0.7895 `usage.json:last_week.rush_share` but 0.4474 `usage.json:pooled.rush_share` on snap share 0.4807 `usage.json:pooled.snap_share`, and 19.5 `usage.json:pooled.half_ppr_points` in three games (6.5 a game); the Rams allow 14.4 to RBs, rank 26 `points-allowed.json:per_game,rank`. Red-zone carry share 0.3571 `red-zone.json:rz_carry_share` (5 of 14) - not a goal-line monopoly. |
| RB Will Shipley | **Sit** | Rush share 0.1184 `usage.json:pooled.rush_share`, 0 `usage.json:last_week.rush_share`, 1.6 `usage.json:last_week.half_ppr_points`; red-zone carry share 0.2857 `red-zone.json:rz_carry_share` (4 of 14). |
| WR DeVonta Smith | **Sit** | Out `injuries.json:report_status` (hamstring). His target share 0.3333 `usage.json:pooled.target_share`, air-yards share 0.4771 `usage.json:pooled.air_yards_share` and red-zone target share 0.2 `red-zone.json:rz_target_share` (2 of 10) go to Wicks. Round 2: was Start. |
| WR Dontayvion Wicks | **Start** | With Smith Out `injuries.json:report_status`, he is the top healthy receiver: target share 0.1852 `usage.json:pooled.target_share` and air-yards share 0.2999 `usage.json:pooled.air_yards_share` on 0.88 `usage.json:last_week.snap_share`; 28.4 `usage.json:pooled.half_ppr_points` over 3 games; red-zone target share 0.4 `red-zone.json:rz_target_share` (4 of 10), the team's highest. The Rams allow 26.27 to WRs, rank 17 `points-allowed.json:per_game,rank`. Round 2: was Flex. |
| WR Makai Lemon | **Sit** | Target share 0.1111 `usage.json:pooled.target_share`, 6.8 `usage.json:pooled.half_ppr_points` over 3 games, 4.4 `usage.json:last_week.half_ppr_points`; no red-zone touches. |
| TE Johnny Mundt | **Sit** | Target share 0.0678 `usage.json:pooled.target_share` on 0.5952 `usage.json:pooled.snap_share` (snap share stands in for routes), no red-zone touches; the Rams allow 6.07 to TEs, rank 28 `points-allowed.json:per_game,rank`. |
| D/ST Eagles | **Sit** | The Rams are implied for 23 `game-environment.json:away_implied_total` as 3.5-point favorites `game-environment.json:spread_line`; Stafford has 51.98 `usage.json:pooled.half_ppr_points` in three games. |

### 8. Packers at Buccaneers - Sun 13:00 ET [#118 game 8]

Row `2026_04_GB_TB`: -3 `game-environment.json:spread_line` (negative = away
favored: Packers by 3), total 39.5 `game-environment.json:total_line`, the
lowest of these 15 games but for Miami at Minnesota; Packers 21.25
`game-environment.json:away_implied_total`, Buccaneers 18.25
`game-environment.json:home_implied_total`. Baker Mayfield is Out
`injuries.json:report_status` (thumb); Jalon Daniels starts.

Pace: Packers 60 `team-pace.json:plays_per_game` and 0.5732
`team-pace.json:neutral_pass_rate`; Buccaneers 59 and 0.5773.

**Packers**

| Player | Call | Reason |
|---|---|---|
| QB Jordan Love | **Flex** | 51.76 `usage.json:pooled.half_ppr_points` over 3 `usage.json:games` (17.3 a game), but a 21.25 `game-environment.json:away_implied_total` in a 39.5 total and Tampa Bay's 14.77 to QBs, rank 24 `points-allowed.json:per_game,rank`. |
| RB Chris Brooks | **Sit** | Rush share 0.2292 `usage.json:pooled.rush_share`, 0 `usage.json:last_week.rush_share`, 6.9 `usage.json:pooled.half_ppr_points` over 3 games. MarShawn Lloyd, not on #118's list, leads at 0.4792 `usage.json:pooled.rush_share`. Red-zone carry share 0.3636 `red-zone.json:rz_carry_share` (4 of 11), behind Lloyd's 0.5455 in the same column. |
| RB Kaleb Johnson | **Sit** | Rush share 0.4444 `usage.json:last_week.rush_share` but snap share 0.3636 `usage.json:last_week.snap_share` and 5.3 `usage.json:pooled.half_ppr_points` over 3 games; no red-zone touches. |
| WR Christian Watson | **Start** | Target share 0.2417 `usage.json:pooled.target_share`, air-yards share 0.2825 `usage.json:pooled.air_yards_share`, 60.9 `usage.json:pooled.half_ppr_points` over 3 games, red-zone target share 0.3333 `red-zone.json:rz_target_share` (6 of 18); Tampa Bay allows 22.7 to WRs, rank 26 `points-allowed.json:per_game,rank`. |
| WR Matthew Golden | **Start** | Target share 0.25 `usage.json:pooled.target_share`, air-yards share 0.4901 `usage.json:last_week.air_yards_share`, 38.8 `usage.json:pooled.half_ppr_points` over 3 games, red-zone target share 0.2222 `red-zone.json:rz_target_share` (4 of 18). |
| WR Skyy Moore | **Sit** | Target share 0.0917 `usage.json:pooled.target_share`, snap share 0.3057 `usage.json:pooled.snap_share`, 6.2 `usage.json:pooled.half_ppr_points`, red-zone target share 0.1667 `red-zone.json:rz_target_share` (3 of 18). |
| TE Tucker Kraft | **Sit** | Snap share 0.7927 `usage.json:pooled.snap_share` (snap share stands in for routes) and target share 0.1417 `usage.json:pooled.target_share`, but 15.1 `usage.json:pooled.half_ppr_points` over 3 games and red-zone target share 0.0556 `red-zone.json:rz_target_share` (1 of 18), tied for sixth on the team; Tampa Bay allows 12.93 to TEs, rank 11 `points-allowed.json:per_game,rank`. Moved down from Flex in v2: with no red-zone role, a 39.5 `game-environment.json:total_line` leaves no touchdown path. |
| D/ST Packers | **Start** | Tampa Bay is implied for 18.25 `game-environment.json:home_implied_total`; Baker Mayfield is Out `injuries.json:report_status`; Jalon Daniels has -1.1 `usage.json:pooled.half_ppr_points` on snap share 0.058 `usage.json:pooled.snap_share`. |

**Buccaneers**

| Player | Call | Reason |
|---|---|---|
| QB Jalon Daniels | **Sit** | -1.1 `usage.json:pooled.half_ppr_points` on snap share 0.058 `usage.json:pooled.snap_share`, an 18.25 `game-environment.json:home_implied_total`. He starts, with Mayfield Out `injuries.json:report_status`, and is still a sit. |
| RB Bucky Irving | **Start** | Rush share 0.6061 `usage.json:pooled.rush_share`, target share 0.1579 `usage.json:pooled.target_share`, against Green Bay's 29.17 to RBs, the most, rank 1 `points-allowed.json:per_game,rank`. Red-zone carry share 0.6 `red-zone.json:rz_carry_share` (3 of 5) and target share 0.2857 `red-zone.json:rz_target_share` (4 of 14). Full `injuries.json:practice_status`, no `report_status`. |
| RB Kenny Gainwell | **Sit** | Rush share 0.1515 `usage.json:pooled.rush_share`, target share 0.1053 `usage.json:pooled.target_share`, 7.3 `usage.json:pooled.half_ppr_points` over 3 games, red-zone carry share 0.2 `red-zone.json:rz_carry_share` (1 of 5). |
| WR Emeka Egbuka | **Flex** | Target share 0.2105 `usage.json:pooled.target_share`, 0.2571 `usage.json:last_week.target_share`, red-zone target share 0.1429 `red-zone.json:rz_target_share` (2 of 14), against Green Bay's 29.7 to WRs, rank 10 `points-allowed.json:per_game,rank`, on an 18.25 `game-environment.json:home_implied_total` with Jalon Daniels throwing. |
| WR Ted Hurst III | **Sit** | Air-yards share 0.2838 `usage.json:pooled.air_yards_share` but target share 0.1368 `usage.json:pooled.target_share`, 0.0857 `usage.json:last_week.target_share`, red-zone target share 0.1429 `red-zone.json:rz_target_share` (2 of 14). |
| WR Chris Godwin Jr. | **Sit** | Target share 0.1158 `usage.json:pooled.target_share`, air-yards share 0.059 `usage.json:pooled.air_yards_share`, no red-zone touches; Full `injuries.json:practice_status`, so health is no longer the reason. |
| TE Cade Otton | **Sit** | Snap share 0.9372 `usage.json:pooled.snap_share` (snap share stands in for routes) and target share 0.1789 `usage.json:pooled.target_share`, but 17.5 `usage.json:pooled.half_ppr_points` over 3 games with a backup QB and red-zone target share 0.1429 `red-zone.json:rz_target_share` (2 of 14); Green Bay allows 9.37 to TEs, rank 20 `points-allowed.json:per_game,rank`. |
| D/ST Buccaneers | **Flex** | Green Bay is implied for 21.25 `game-environment.json:away_implied_total` in a 39.5 `game-environment.json:total_line`; Tampa Bay allows 14.77 to QBs, rank 24 `points-allowed.json:per_game,rank`. |

### 9. Titans at Ravens - Sun 13:00 ET [#119 game 2]

Row `2026_04_TEN_BAL`: 11.5 `game-environment.json:spread_line` (positive =
home favored: Ravens by 11.5), total 42.5 `game-environment.json:total_line`;
Ravens 27 `game-environment.json:home_implied_total`, Titans 15.5
`game-environment.json:away_implied_total`.

Pace: Titans 52.33 `team-pace.json:plays_per_game`, the league's fewest, and
0.527 `team-pace.json:neutral_pass_rate`; Ravens 57.67 and 0.4565.

**Titans**

| Player | Call | Reason |
|---|---|---|
| QB Cam Ward | **Sit** | 41.16 `usage.json:pooled.half_ppr_points` over 3 `usage.json:games`, 9.44 `usage.json:last_week.half_ppr_points`, on a 15.5 `game-environment.json:away_implied_total`. |
| RB Tony Pollard | **Flex** | Rush share 0.8095 `usage.json:last_week.rush_share`, 0.5938 `usage.json:pooled.rush_share`, against Baltimore's 18.2 to RBs, rank 16 `points-allowed.json:per_game,rank`, but an 11.5-point underdog script. Red-zone carry share 0.6667 `red-zone.json:rz_carry_share` (8 of 12). Full `injuries.json:practice_status`, no `report_status`. |
| RB Tyjae Spears | **Sit** | Rush share 0.2031 `usage.json:pooled.rush_share`, 0.5 `usage.json:last_week.half_ppr_points`, red-zone carry share 0.0833 `red-zone.json:rz_carry_share` (1 of 12); Questionable `injuries.json:report_status` (ankle, Full `injuries.json:practice_status`) - on the game-time list. |
| WR Wan'Dale Robinson | **Flex** | Target share 0.225 `usage.json:pooled.target_share`, 0.3143 `usage.json:last_week.target_share`, red-zone target share 0.25 `red-zone.json:rz_target_share` (3 of 12), against Baltimore's 29.63 to WRs, rank 12 `points-allowed.json:per_game,rank`; a trailing script adds volume. |
| WR Carnell Tate | **Sit** | Target share 0.25 `usage.json:pooled.target_share` and air-yards share 0.4345 `usage.json:pooled.air_yards_share` on 0.8405 `usage.json:pooled.snap_share` - the team's most-used WR - but red-zone target share 0.0833 `red-zone.json:rz_target_share` (1 of 12) on the league's slowest offense, 52.33 `team-pace.json:plays_per_game`, and 18.8 `usage.json:pooled.half_ppr_points` over 3 games shows the 15.5 implied total biting. Moved down from Flex in v2: the volume is real but has no touchdown path. |
| WR Elic Ayomanor | **Sit** | Target share 0.1125 `usage.json:pooled.target_share`, 0.0857 `usage.json:last_week.target_share`, 1.6 `usage.json:last_week.half_ppr_points`. Red-zone target share 0.4167 `red-zone.json:rz_target_share` is the team's highest, but on 5 of 12 targets and not enough to start him. |
| TE Gunnar Helm | **Sit** | Snap share 0.816 `usage.json:pooled.snap_share` (snap share stands in for routes) but 9.5 `usage.json:pooled.half_ppr_points` over 3 games; red-zone target share 0.25 `red-zone.json:rz_target_share` (3 of 12); Baltimore allows 10.1 to TEs, rank 17 `points-allowed.json:per_game,rank`. |
| D/ST Titans | **Sit** | Baltimore is implied for 27 `game-environment.json:home_implied_total`; Lamar Jackson has 60.2 `usage.json:pooled.half_ppr_points` in three games with rush share 0.1753 `usage.json:pooled.rush_share`. |

**Ravens**

| Player | Call | Reason |
|---|---|---|
| QB Lamar Jackson | **Start** | 60.2 `usage.json:pooled.half_ppr_points` over 3 games, a 27 `game-environment.json:home_implied_total`; Tennessee's 10.53 to QBs, rank 31 `points-allowed.json:per_game,rank`, trims the ceiling, not the call. Full `injuries.json:practice_status`, no `report_status`. |
| RB Derrick Henry | **Start** | Rush share 0.6804 `usage.json:pooled.rush_share`, 72.4 `usage.json:pooled.half_ppr_points` over 3 games, as an 11.5-point favorite `game-environment.json:spread_line`, with red-zone carry share 0.8333 `red-zone.json:rz_carry_share` (20 of 24). |
| RB Justice Hill | **Sit** | Rush share 0.134 `usage.json:pooled.rush_share`, target share 0.0411 `usage.json:pooled.target_share`, 3.3 `usage.json:last_week.half_ppr_points`; no red-zone touches. |
| WR Zay Flowers | **Start** | Target share 0.2727 `usage.json:pooled.target_share` over 2 `usage.json:games`, 0.3 `usage.json:last_week.target_share` on a snap share of only 0.3281 `usage.json:last_week.snap_share` in his return, red-zone target share 0.2 `red-zone.json:rz_target_share` (2 of 10); Tennessee allows 26.6 to WRs, rank 16 `points-allowed.json:per_game,rank`. Questionable `injuries.json:report_status` (hamstring, Limited `injuries.json:practice_status`) - on the game-time list. |
| WR Rashod Bateman | **Sit** | Snap share 0.8579 `usage.json:pooled.snap_share` but target share 0.1781 `usage.json:pooled.target_share`, 4.7 `usage.json:last_week.half_ppr_points`, red-zone target share 0.2 `red-zone.json:rz_target_share` (2 of 10). Flex if Flowers sits. |
| WR Chris Moore | **Sit** | Target share 0.0822 `usage.json:pooled.target_share`, 0.05 `usage.json:last_week.target_share`, red-zone target share 0.1 `red-zone.json:rz_target_share` (1 of 10); Questionable `injuries.json:report_status` (ankle) - on the game-time list. |
| TE Mark Andrews | **Sit** | Target share 0.2466 `usage.json:pooled.target_share` on 0.6474 `usage.json:pooled.snap_share` (snap share stands in for routes), but 18.7 `usage.json:pooled.half_ppr_points` over 3 games and red-zone target share 0.1 `red-zone.json:rz_target_share` (1 of 10): Baltimore's red zone runs through Henry, 20 of 24 carries, on a 0.4565 `team-pace.json:neutral_pass_rate`. Tennessee allows 5.53 to TEs, rank 29 `points-allowed.json:per_game,rank`. Full `injuries.json:practice_status`. Moved down from Flex in v2. |
| D/ST Ravens | **Start** | Tennessee is implied for 15.5 `game-environment.json:away_implied_total`, the week's second-lowest, as an 11.5-point underdog `game-environment.json:spread_line`; Ward has 41.16 `usage.json:pooled.half_ppr_points` in three games. |

### 10. Dolphins at Vikings - Sun 16:05 ET [#119 game 3]

Row `2026_04_MIA_MIN`: 10 `game-environment.json:spread_line` (positive =
home favored: Vikings by 10), total 38.5 `game-environment.json:total_line`;
Vikings 24.25 `game-environment.json:home_implied_total`, Dolphins 14.25
`game-environment.json:away_implied_total`, the week's lowest. Dome. Justin
Jefferson is Out `injuries.json:report_status` (ankle).

Pace: Dolphins 57.67 `team-pace.json:plays_per_game` and 0.5263
`team-pace.json:neutral_pass_rate`; Vikings 55 and 0.4476. Both are slow.

**Dolphins**

| Player | Call | Reason |
|---|---|---|
| QB Malik Willis | **Sit** | 39.18 `usage.json:pooled.half_ppr_points` over 3 `usage.json:games`, a 14.25 `game-environment.json:away_implied_total`, and Minnesota's 13.18 to QBs, rank 26 `points-allowed.json:per_game,rank`. |
| RB Ollie Gordon II | **Flex** | Rush share 0.5484 `usage.json:last_week.rush_share` on 0.8356 `usage.json:last_week.snap_share` with De'Von Achane at 0.0548 `usage.json:last_week.snap_share`; Minnesota allows 10.87 to RBs, rank 29 `points-allowed.json:per_game,rank`. Red-zone carry share 0.2857 `red-zone.json:rz_carry_share` (4 of 14), behind De'Von Achane's 0.5 (7 of 14) in the same column. |
| RB Jaylen Wright | **Sit** | Rush share 0.0638 `usage.json:pooled.rush_share`, snap share 0.0609 `usage.json:pooled.snap_share`, red-zone carry share 0.1429 `red-zone.json:rz_carry_share` (2 of 14); Full `injuries.json:practice_status`, no `report_status`. |
| WR Malik Washington | **Flex** | Target share 0.2706 `usage.json:pooled.target_share`, air-yards share 0.3209 `usage.json:pooled.air_yards_share`, against Minnesota's 29.57 to WRs, rank 13 `points-allowed.json:per_game,rank`, on a 14.25 `game-environment.json:away_implied_total`. Red-zone target share 0.25 `red-zone.json:rz_target_share` is 1 of Miami's 4 red-zone targets in three games. |
| WR Chris Bell | **Sit** | Target share 0.1176 `usage.json:pooled.target_share`, 0.2 `usage.json:last_week.target_share`, no red-zone touches; Full `injuries.json:practice_status`, so the call is usage, not health. |
| WR Caleb Douglas | **Sit** | Target share 0.2 `usage.json:pooled.target_share` on 0.887 `usage.json:pooled.snap_share` over 2 games, red-zone target share 0.25 `red-zone.json:rz_target_share` (1 of 4), no week 3 row, and Out `injuries.json:report_status` (ankle). |
| TE Greg Dulcich | **Sit** | Target share 0.1412 `usage.json:pooled.target_share` on 0.6915 `usage.json:pooled.snap_share` (snap share stands in for routes), 13.5 `usage.json:pooled.half_ppr_points` over 3 games; red-zone target share 0.5 `red-zone.json:rz_target_share` is 2 of 4, too few to count on; Minnesota allows 7.77 to TEs, rank 23 `points-allowed.json:per_game,rank`. |
| D/ST Dolphins | **Sit** | Minnesota is implied for 24.25 `game-environment.json:home_implied_total` as a 10-point favorite `game-environment.json:spread_line`; Miami allows 27.1 to RBs, rank 3 `points-allowed.json:per_game,rank`. |

**Vikings**

| Player | Call | Reason |
|---|---|---|
| QB Kyler Murray | **Sit** | 10.04 `usage.json:pooled.half_ppr_points` over 2 games, 10.42 `usage.json:last_week.half_ppr_points`; Miami's 19.34 to QBs, rank 9 `points-allowed.json:per_game,rank`, does not cover a run-first script as a 10-point favorite `game-environment.json:spread_line`, now without Jefferson, Out `injuries.json:report_status`. |
| RB Aaron Jones | **Start** | Rush share 0.7391 `usage.json:last_week.rush_share` and target share 0.24 `usage.json:last_week.target_share`, against Miami's 27.1 to RBs, rank 3 `points-allowed.json:per_game,rank`. Red-zone carry share 0.5 `red-zone.json:rz_carry_share` (4 of 8), shared with Jordan Mason. Limited `injuries.json:practice_status` but no `report_status`. |
| RB DeeJay Dallas | **Sit** | Rush share 0.0353 `usage.json:pooled.rush_share`, snap share 0.1307 `usage.json:pooled.snap_share`, 3.3 `usage.json:pooled.half_ppr_points`, no red-zone touches. Jordan Mason, not on #119's list, had 0.4412 `usage.json:pooled.rush_share` in his one game. |
| WR Justin Jefferson | **Sit** | Out `injuries.json:report_status` (ankle). Target share 0.2537 `usage.json:pooled.target_share`, air-yards share 0.3339 `usage.json:pooled.air_yards_share` and red-zone target share 0.5 `red-zone.json:rz_target_share` (3 of 6) do not play this week. Round 2: was Flex. |
| WR Jordan Addison | **Start** | Target share 0.36 `usage.json:last_week.target_share`, air-yards share 0.6509 `usage.json:last_week.air_yards_share`, on 0.9831 `usage.json:last_week.snap_share` - week 3 was already the shape of a game without Jefferson, Out `injuries.json:report_status`; red-zone target share 0.1667 `red-zone.json:rz_target_share` (1 of 6); Miami allows 19.07 to WRs, rank 28 `points-allowed.json:per_game,rank`. |
| WR Jauan Jennings | **Sit** | Target share 0.0625 `usage.json:pooled.target_share` on 0.629 `usage.json:pooled.snap_share`, 0.6 `usage.json:pooled.half_ppr_points` over 2 games, no red-zone touches. |
| TE T.J. Hockenson | **Flex** | Target share 0.194 `usage.json:pooled.target_share` on 0.733 `usage.json:pooled.snap_share` (snap share stands in for routes), red-zone target share 0.3333 `red-zone.json:rz_target_share` (2 of 6), against Miami's 13.5 to TEs, rank 10 `points-allowed.json:per_game,rank`; 2.1 `usage.json:last_week.half_ppr_points`. |
| D/ST Vikings | **Start** | Miami is implied for 14.25 `game-environment.json:away_implied_total`, the week's lowest, as a 10-point underdog `game-environment.json:spread_line`; Willis has 39.18 `usage.json:pooled.half_ppr_points` in three games. |

### 11. Chiefs at Raiders - Sun 16:25 ET [#119 game 4]

Row `2026_04_KC_LV`: Chiefs -4.5 `game-environment.json:spread_line`, total
47.5 `game-environment.json:total_line`; Chiefs 26
`game-environment.json:away_implied_total`, Raiders 21.5
`game-environment.json:home_implied_total`. Dome.

Pace: Chiefs 63.67 `team-pace.json:plays_per_game` and 0.5806
`team-pace.json:neutral_pass_rate`; Raiders 61.33 and 0.5938.

**Chiefs**

| Player | Call | Reason |
|---|---|---|
| QB Patrick Mahomes | **Start** | 66.58 `usage.json:pooled.half_ppr_points` over 3 `usage.json:games` (22.2 a game), a 26 `game-environment.json:away_implied_total`; Las Vegas allows 16.13 to QBs, rank 22 `points-allowed.json:per_game,rank`. |
| RB Kenneth Walker III | **Start** | Rush share 0.7065 `usage.json:pooled.rush_share`, target share 0.1978 `usage.json:pooled.target_share`, 73.7 `usage.json:pooled.half_ppr_points` over 3 games; Las Vegas allows 15.13 to RBs, rank 23 `points-allowed.json:per_game,rank`. Red-zone carry share 0.9375 `red-zone.json:rz_carry_share` (15 of 16) and target share 0.2778 `red-zone.json:rz_target_share` (5 of 18), the team's highest in both. |
| RB Emmett Johnson | **Sit** | Rush share 0.1739 `usage.json:pooled.rush_share`, target share 0 `usage.json:last_week.target_share`, 1.7 `usage.json:last_week.half_ppr_points`, red-zone carry share 0.0625 `red-zone.json:rz_carry_share` (1 of 16). |
| WR Rashee Rice | **Start** | Target share 0.3913 `usage.json:last_week.target_share`, air-yards share 0.4658 `usage.json:last_week.air_yards_share`, red-zone target share 0.2222 `red-zone.json:rz_target_share` (4 of 18), Full `injuries.json:practice_status`; volume over Las Vegas's 18.27 to WRs, rank 30 `points-allowed.json:per_game,rank`. |
| WR Xavier Worthy | **Sit** | Target share fell to 0.087 `usage.json:last_week.target_share` from 0.1648 `usage.json:pooled.target_share` on the same 0.8269 `usage.json:last_week.snap_share`, in the rank-30 WR matchup. Red-zone target share 0.2222 `red-zone.json:rz_target_share` (4 of 18) is pooled, before the week 3 drop. |
| WR Tyquan Thornton | **Sit** | Air-yards share 0.2686 `usage.json:pooled.air_yards_share` on target share 0.0769 `usage.json:pooled.target_share`, 3.2 `usage.json:last_week.half_ppr_points`, no red-zone touches. |
| TE Travis Kelce | **Start** | Target share 0.1978 `usage.json:pooled.target_share` on 0.7861 `usage.json:pooled.snap_share` (snap share stands in for routes), against Las Vegas's 17.73 to TEs, rank 3 `points-allowed.json:per_game,rank`; red-zone target share 0.1111 `red-zone.json:rz_target_share` (2 of 18) makes the matchup, not the red zone, the reason. |
| D/ST Chiefs | **Flex** | Las Vegas is implied for 21.5 `game-environment.json:home_implied_total` as a 4.5-point underdog `game-environment.json:spread_line`; Kansas City allows the fewest to QBs, 8.95, rank 32 `points-allowed.json:per_game,rank`, but Cousins has 56.24 `usage.json:pooled.half_ppr_points` in three games. |

**Raiders**

| Player | Call | Reason |
|---|---|---|
| QB Kirk Cousins | **Sit** | 56.24 `usage.json:pooled.half_ppr_points` over 3 games, but Kansas City allows the fewest to QBs, 8.95, rank 32 `points-allowed.json:per_game,rank`, on a 21.5 `game-environment.json:home_implied_total`. |
| RB Ashton Jeanty | **Start** | Rush share 0.6774 `usage.json:pooled.rush_share`, target share 0.1818 `usage.json:pooled.target_share`, on 0.796 `usage.json:pooled.snap_share`; red-zone carry share 0.8824 `red-zone.json:rz_carry_share` (15 of 17); Full `injuries.json:practice_status`. |
| RB Connor Heyward | **Sit** | Listed FB in the table: rush share 0.0215 `usage.json:pooled.rush_share`, target share 0 `usage.json:pooled.target_share`, 0.2 `usage.json:pooled.half_ppr_points`; no red-zone touches. |
| WR Tre Tucker | **Sit** | Target share 0.1705 `usage.json:pooled.target_share`, 0.1333 `usage.json:last_week.target_share`, red-zone target share 0.0588 `red-zone.json:rz_target_share` (1 of 17), against the fewest WR points allowed, 17.47, rank 32 `points-allowed.json:per_game,rank`. |
| WR Jalen Nailor | **Sit** | Target share 0.125 `usage.json:pooled.target_share`, 7.7 `usage.json:pooled.half_ppr_points` over 3 games, 2.1 `usage.json:last_week.half_ppr_points`, red-zone target share 0.0588 `red-zone.json:rz_target_share` (1 of 17). |
| WR Jack Bech | **Sit** | Target share 0.1034 `usage.json:pooled.target_share` on 0.4656 `usage.json:pooled.snap_share` over 2 games, 13.3 `usage.json:pooled.half_ppr_points`, red-zone target share 0.1176 `red-zone.json:rz_target_share` (2 of 17), no week 3 row. |
| TE Brock Bowers | **Start** | One game: target share 0.4333 `usage.json:pooled.target_share`, air-yards share 0.4015 `usage.json:pooled.air_yards_share`, snap share 0.7857 `usage.json:pooled.snap_share` (snap share stands in for routes), red-zone target share 0.1765 `red-zone.json:rz_target_share` (3 of 17). Limited `injuries.json:practice_status` but no `report_status`. |
| D/ST Raiders | **Sit** | Kansas City is implied for 26 `game-environment.json:away_implied_total`; Mahomes has 66.58 `usage.json:pooled.half_ppr_points` in three games; the Raiders are 4.5-point underdogs `game-environment.json:spread_line`. |

### 12. Chargers at Seahawks - Sun 16:25 ET [#119 game 5]

Row `2026_04_LAC_SEA`: 7 `game-environment.json:spread_line` (positive =
home favored: Seahawks by 7), total 42.5 `game-environment.json:total_line`;
Seahawks 24.75 `game-environment.json:home_implied_total`, Chargers 17.75
`game-environment.json:away_implied_total`. Seattle's Jadarian Price and
Zach Charbonnet are Out `injuries.json:report_status`.

Pace: Chargers 59 `team-pace.json:plays_per_game` and 0.4474
`team-pace.json:neutral_pass_rate`; Seahawks 59.33 and 0.5294.

**Chargers**

| Player | Call | Reason |
|---|---|---|
| QB Justin Herbert | **Sit** | 33.88 `usage.json:pooled.half_ppr_points` over 3 `usage.json:games`, a 17.75 `game-environment.json:away_implied_total`, and Seattle's 12.25 to QBs, rank 28 `points-allowed.json:per_game,rank`. |
| RB Omarion Hampton | **Flex** | Rush share 0.6173 `usage.json:pooled.rush_share` on 0.5417 `usage.json:pooled.snap_share`, but target share 0.0349 `usage.json:pooled.target_share` and Seattle's 13.9 to RBs, rank 28 `points-allowed.json:per_game,rank`. Red-zone carry share 0.6667 `red-zone.json:rz_carry_share` (10 of 15) on a run-leaning offense, 0.4474 `team-pace.json:neutral_pass_rate`. |
| RB Keaton Mitchell | **Sit** | Rush share 0.2099 `usage.json:pooled.rush_share`, snap share 0.3125 `usage.json:pooled.snap_share`, red-zone carry share 0.2 `red-zone.json:rz_carry_share` (3 of 15); 12.2 `usage.json:last_week.half_ppr_points` was a one-week spike. |
| WR Ladd McConkey | **Flex** | Air-yards share 0.2518 `usage.json:pooled.air_yards_share`, snap share up to 0.8841 `usage.json:last_week.snap_share`, target share 0.1744 `usage.json:pooled.target_share`, red-zone target share 0.2 `red-zone.json:rz_target_share` (2 of 10); Seattle allows 18.67 to WRs, rank 29 `points-allowed.json:per_game,rank`. Questionable `injuries.json:report_status` (foot, Limited `injuries.json:practice_status`) - on the game-time list. |
| WR Quentin Johnston | **Sit** | Target share 0.1977 `usage.json:pooled.target_share` on 0.8229 `usage.json:pooled.snap_share` has produced 10.1 `usage.json:pooled.half_ppr_points` in three games, with no red-zone touches. |
| WR Tre Harris | **Sit** | Target share 0.186 `usage.json:pooled.target_share`, 19.9 `usage.json:pooled.half_ppr_points` over 3 games, against Seattle's 18.67 to WRs, rank 29 `points-allowed.json:per_game,rank`. Red-zone target share 0.3 `red-zone.json:rz_target_share` is the team's highest, but 3 of 10 targets is too few to start him on. |
| TE Oronde Gadsden II | **Sit** | Snap share 0.5652 `usage.json:last_week.snap_share` (snap share stands in for routes) but target share 0.0814 `usage.json:pooled.target_share` and 0 `usage.json:last_week.half_ppr_points`; red-zone target share 0.2 `red-zone.json:rz_target_share` (2 of 10); Seattle allows 9 to TEs, rank 21 `points-allowed.json:per_game,rank`. |
| D/ST Chargers | **Sit** | Seattle is implied for 24.75 `game-environment.json:home_implied_total`; Darnold scored 27.66 `usage.json:last_week.half_ppr_points`; the Chargers are 7-point underdogs `game-environment.json:spread_line`. |

**Seahawks**

| Player | Call | Reason |
|---|---|---|
| QB Sam Darnold | **Start** | 27.66 `usage.json:last_week.half_ppr_points` as the week 3 starter, a 24.75 `game-environment.json:home_implied_total`, and the Chargers' 17.89 to QBs, rank 12 `points-allowed.json:per_game,rank`. No Seattle QB has a row in `injuries.json`; Drew Lock started two games (34.18 `usage.json:pooled.half_ppr_points`). |
| RB Jadarian Price | **Sit** | Out `injuries.json:report_status` (chest). Rush share 0.35 `usage.json:pooled.rush_share`, 0.2778 `usage.json:last_week.rush_share`, red-zone carry share 0.15 `red-zone.json:rz_carry_share` (3 of 20). Emanuel Wilson, not on #119's list, led at 0.5 `usage.json:last_week.rush_share`. |
| RB George Holani | **Sit** | Rush share 0.1875 `usage.json:pooled.rush_share`, target share 0.0737 `usage.json:pooled.target_share`, snap share 0.3476 `usage.json:pooled.snap_share`, red-zone carry share 0.3 `red-zone.json:rz_carry_share` (6 of 20), behind Emanuel Wilson's 0.45 (9 of 20) in the same column. Price and Charbonnet being Out `injuries.json:report_status` frees carries, but Wilson is ahead of him for them; Limited `injuries.json:practice_status`, no `report_status`. |
| WR Jaxon Smith-Njigba | **Start** | Target share 0.3789 `usage.json:pooled.target_share`, air-yards share 0.5186 `usage.json:pooled.air_yards_share`, 90.56 `usage.json:pooled.half_ppr_points` over 3 games, the week's most by a WR here, and red-zone target share 0.5 `red-zone.json:rz_target_share` (9 of 18). |
| WR Cooper Kupp | **Sit** | Target share 0.1053 `usage.json:pooled.target_share`, 0.1111 `usage.json:last_week.target_share`, 20.1 `usage.json:pooled.half_ppr_points` over 3 games, red-zone target share 0.0556 `red-zone.json:rz_target_share` (1 of 18); the Chargers allow 27.43 to WRs, rank 14 `points-allowed.json:per_game,rank`. |
| WR Rashid Shaheed | **Sit** | Target share 0.1263 `usage.json:pooled.target_share`, 0.0667 `usage.json:last_week.target_share`, 8.7 `usage.json:pooled.half_ppr_points` over 3 games, red-zone target share 0 `red-zone.json:rz_target_share` (0 of 18). |
| TE AJ Barner | **Flex** | Snap share 0.861 `usage.json:pooled.snap_share` (snap share stands in for routes), target share 0.2 `usage.json:last_week.target_share`, red-zone target share 0.2222 `red-zone.json:rz_target_share` (4 of 18), but 19.1 `usage.json:pooled.half_ppr_points` over 3 games; the Chargers allow 9.73 to TEs, rank 18 `points-allowed.json:per_game,rank`. |
| D/ST Seahawks | **Start** | The Chargers are implied for 17.75 `game-environment.json:away_implied_total` as 7-point underdogs `game-environment.json:spread_line`; Herbert has 33.88 `usage.json:pooled.half_ppr_points` in three games. |

### 13. Broncos at 49ers - Sun 16:25 ET [#119 game 6]

Row `2026_04_DEN_SF`: 3 `game-environment.json:spread_line` (positive = home
favored: 49ers by 3), total 47.5 `game-environment.json:total_line`; 49ers
25.25 `game-environment.json:home_implied_total`, Broncos 22.25
`game-environment.json:away_implied_total`.

Pace: Broncos 54.67 `team-pace.json:plays_per_game` and 0.6067
`team-pace.json:neutral_pass_rate`; 49ers 53.33 and 0.5345. Both are among
the league's slowest four.

**Broncos**

| Player | Call | Reason |
|---|---|---|
| QB Bo Nix | **Sit** | 43.7 `usage.json:pooled.half_ppr_points` over 3 `usage.json:games` (14.6 a game) against San Francisco's 14.53 to QBs, rank 25 `points-allowed.json:per_game,rank`; 24.14 `usage.json:last_week.half_ppr_points` is the outlier. |
| RB J.K. Dobbins | **Sit** | Rush share 0.5147 `usage.json:pooled.rush_share` but snap share 0.4222 `usage.json:pooled.snap_share`, target share 0.023 `usage.json:pooled.target_share`, and 13 `usage.json:pooled.half_ppr_points` in three games. Red-zone carry share 0.5455 `red-zone.json:rz_carry_share` (6 of 11) is a touchdown chance, not a reason to start him. |
| RB RJ Harvey | **Flex** | Target share 0.1897 `usage.json:pooled.target_share`, 0.2258 `usage.json:last_week.target_share`, on 0.4237 `usage.json:pooled.snap_share`; red-zone carry share 0 `red-zone.json:rz_carry_share` (0 of 11) and target share 0.125 `red-zone.json:rz_target_share` (2 of 16); San Francisco allows 19.83 to RBs, rank 11 `points-allowed.json:per_game,rank`. Better in full PPR. |
| WR Jaylen Waddle | **Flex** | Target share 0.2299 `usage.json:pooled.target_share`, air-yards share 0.4379 `usage.json:pooled.air_yards_share`, but 23.9 `usage.json:pooled.half_ppr_points` in three games, red-zone target share 0.0625 `red-zone.json:rz_target_share` (1 of 16), and San Francisco's 22.73 to WRs, rank 25 `points-allowed.json:per_game,rank`. |
| WR Courtland Sutton | **Sit** | Target share 0.1839 `usage.json:pooled.target_share` and air-yards share 0.273 `usage.json:pooled.air_yards_share` have produced 12.2 `usage.json:pooled.half_ppr_points` in three games. Red-zone target share 0.3125 `red-zone.json:rz_target_share` (5 of 16) is the team's highest, but 5 targets in three games have not lifted his points; a dart, not a start. |
| WR Pat Bryant | **Sit** | Target share 0.1034 `usage.json:pooled.target_share`, 0.0645 `usage.json:last_week.target_share`, red-zone target share 0.0625 `red-zone.json:rz_target_share` (1 of 16); 13.4 `usage.json:last_week.half_ppr_points` came on that small share. |
| TE Evan Engram | **Sit** | Target share 0.092 `usage.json:pooled.target_share` on 0.5778 `usage.json:pooled.snap_share` (snap share stands in for routes), red-zone target share 0.0625 `red-zone.json:rz_target_share` (1 of 16); San Francisco allows 7.73 to TEs, rank 24 `points-allowed.json:per_game,rank`. |
| D/ST Broncos | **Sit** | San Francisco is implied for 25.25 `game-environment.json:home_implied_total`; Purdy has 80.86 `usage.json:pooled.half_ppr_points` in three games; Denver allows 26 to RBs, rank 4 `points-allowed.json:per_game,rank`. |

**49ers**

| Player | Call | Reason |
|---|---|---|
| QB Brock Purdy | **Start** | 80.86 `usage.json:pooled.half_ppr_points` over 3 games (27.0 a game), 31.28 `usage.json:last_week.half_ppr_points`, a 25.25 `game-environment.json:home_implied_total`. |
| RB Christian McCaffrey | **Start** | Rush share 0.6522 `usage.json:last_week.rush_share`, target share 0.2099 `usage.json:pooled.target_share`, against Denver's 26 to RBs, rank 4 `points-allowed.json:per_game,rank`. Red-zone carry share 0.6667 `red-zone.json:rz_carry_share` (8 of 12). Full `injuries.json:practice_status`, no `report_status`. |
| RB Kaelon Black | **Sit** | Rush share 0.3125 `usage.json:pooled.rush_share` falling to 0.1739 `usage.json:last_week.rush_share`; 1.7 `usage.json:last_week.half_ppr_points`; red-zone carry share 0.3333 `red-zone.json:rz_carry_share` (4 of 12). McCaffrey practised in full. |
| WR Deebo Samuel Sr. | **Flex** | Target share 0.1358 `usage.json:pooled.target_share` but 0 `usage.json:last_week.target_share` on 0.7593 `usage.json:last_week.snap_share`, 35.4 `usage.json:pooled.half_ppr_points` over 3 games, red-zone target share 0.1765 `red-zone.json:rz_target_share` (3 of 17); rises if Evans sits. |
| WR Mike Evans | **Flex** | Target share 0.1975 `usage.json:pooled.target_share`, air-yards share 0.2864 `usage.json:pooled.air_yards_share`, red-zone target share 0.1176 `red-zone.json:rz_target_share` (2 of 17); snap share 0.3333 `usage.json:last_week.snap_share` after the injury, and Questionable `injuries.json:report_status` (ribs, Limited `injuries.json:practice_status`). On the game-time list. |
| WR KhaDarel Hodge | **Sit** | Target share 0.0123 `usage.json:pooled.target_share`, 2.3 `usage.json:pooled.half_ppr_points`, no red-zone touches; Did Not Participate `injuries.json:practice_status`, no `report_status`. |
| TE George Kittle | **Start** | Target share 0.2692 `usage.json:last_week.target_share` on 0.8519 `usage.json:last_week.snap_share` (snap share stands in for routes), 41.4 `usage.json:pooled.half_ppr_points` over 3 games, red-zone target share 0.2941 `red-zone.json:rz_target_share` (5 of 17), the team's highest; Denver allows 11.8 to TEs, rank 13 `points-allowed.json:per_game,rank`. |
| D/ST 49ers | **Flex** | Denver is implied for 22.25 `game-environment.json:away_implied_total`; Nix has 43.7 `usage.json:pooled.half_ppr_points` in three games; San Francisco allows 14.53 to QBs, rank 25 `points-allowed.json:per_game,rank`. |

### 14. Lions at Panthers - Sun 20:20 ET [#119 game 7]

Row `2026_04_DET_CAR`: -3.5 `game-environment.json:spread_line` (negative =
away favored: Lions by 3.5), total 50.5 `game-environment.json:total_line`,
second only to Jacksonville at Cincinnati; Lions 27
`game-environment.json:away_implied_total`, Panthers 23.5
`game-environment.json:home_implied_total`. Carolina's Xavier Legette is Out
`injuries.json:report_status`.

Pace: Lions 65.67 `team-pace.json:plays_per_game` and 0.56
`team-pace.json:neutral_pass_rate`; Panthers 65 and 0.6146. Both are fast,
and Carolina is the league's second most pass-heavy neutral offense.

**Lions**

| Player | Call | Reason |
|---|---|---|
| QB Jared Goff | **Start** | 65.58 `usage.json:pooled.half_ppr_points` over 3 `usage.json:games` (21.9 a game), a 27 `game-environment.json:away_implied_total`, and Carolina's 18.97 to QBs, rank 10 `points-allowed.json:per_game,rank`. |
| RB Jahmyr Gibbs | **Start** | Rush share 0.7831 `usage.json:pooled.rush_share`, target share 0.1944 `usage.json:pooled.target_share`, against Carolina's 28.2 to RBs, rank 2 `points-allowed.json:per_game,rank`. Red-zone carry share 0.9474 `red-zone.json:rz_carry_share` (18 of 19), the highest of any back here, plus target share 0.2273 `red-zone.json:rz_target_share` (5 of 22). |
| RB Sione Vaki | **Sit** | Rush share 0.1084 `usage.json:pooled.rush_share`, snap share 0.256 `usage.json:pooled.snap_share`, 9 `usage.json:pooled.half_ppr_points` over 3 games, red-zone carry share 0.0526 `red-zone.json:rz_carry_share` (1 of 19). |
| WR Amon-Ra St. Brown | **Start** | Target share 0.3241 `usage.json:pooled.target_share`, air-yards share 0.3752 `usage.json:pooled.air_yards_share`, 64.3 `usage.json:pooled.half_ppr_points` over 3 games, red-zone target share 0.4091 `red-zone.json:rz_target_share` (9 of 22); volume over Carolina's 18.17 to WRs, rank 31 `points-allowed.json:per_game,rank`. |
| WR Jameson Williams | **Sit** | Air-yards share 0.307 `usage.json:pooled.air_yards_share` on target share 0.1574 `usage.json:pooled.target_share`, 17.7 `usage.json:pooled.half_ppr_points` over 3 games, red-zone target share 0.0455 `red-zone.json:rz_target_share` (1 of 22), in the rank-31 WR matchup. |
| WR Isaac TeSlaa | **Sit** | Target share 0.0833 `usage.json:pooled.target_share`, snap share 0.4769 `usage.json:last_week.snap_share`, 11.7 `usage.json:pooled.half_ppr_points` over 3 games, red-zone target share 0.0909 `red-zone.json:rz_target_share` (2 of 22). |
| TE Sam LaPorta | **Start** | Snap share 0.8986 `usage.json:pooled.snap_share` (snap share stands in for routes), target share 0.1759 `usage.json:pooled.target_share`, red-zone target share 0.2273 `red-zone.json:rz_target_share` (5 of 22), against Carolina's 12.03 to TEs, rank 12 `points-allowed.json:per_game,rank`. |
| D/ST Lions | **Sit** | Carolina is implied for 23.5 `game-environment.json:home_implied_total` in a 50.5 `game-environment.json:total_line`; Bryce Young has 69.16 `usage.json:pooled.half_ppr_points` in three games; Detroit allows the most to QBs, 30.02, rank 1 `points-allowed.json:per_game,rank`. |

**Panthers**

| Player | Call | Reason |
|---|---|---|
| QB Bryce Young | **Start** | Detroit allows the most to QBs, 30.02, rank 1 `points-allowed.json:per_game,rank`; 69.16 `usage.json:pooled.half_ppr_points` over 3 games; a 23.5 `game-environment.json:home_implied_total`. Full `injuries.json:practice_status`. |
| RB Chuba Hubbard | **Start** | Rush share 0.8261 `usage.json:last_week.rush_share` on 0.8442 `usage.json:last_week.snap_share`, 48.6 `usage.json:pooled.half_ppr_points` over 3 games, red-zone carry share 0.6667 `red-zone.json:rz_carry_share` (6 of 9). Full `injuries.json:practice_status`, no `report_status`. |
| RB AJ Dillon | **Sit** | Rush share 0.1791 `usage.json:pooled.rush_share`, snap share 0.109 `usage.json:pooled.snap_share`, 4.4 `usage.json:pooled.half_ppr_points`, no red-zone touches. Hubbard practised in full. |
| WR Tetairoa McMillan | **Start** | Snap share 0.9481 `usage.json:last_week.snap_share`, target share 0.213 `usage.json:pooled.target_share`, red-zone target share 0.25 `red-zone.json:rz_target_share` (5 of 20), against Detroit's 32.67 to WRs, rank 4 `points-allowed.json:per_game,rank`, on a 0.6146 `team-pace.json:neutral_pass_rate`. |
| WR Jalen Coker | **Flex** | Target share 0.2037 `usage.json:pooled.target_share`, 43.2 `usage.json:pooled.half_ppr_points` over 3 games, red-zone target share 0.25 `red-zone.json:rz_target_share` (5 of 20), in the rank-4 WR matchup; Questionable `injuries.json:report_status` (quadricep, Limited `injuries.json:practice_status`). On the game-time list. |
| WR Xavier Legette | **Sit** | Out `injuries.json:report_status` (knee). Target share 0.0909 `usage.json:pooled.target_share` on 0.5149 `usage.json:pooled.snap_share` over 2 games, red-zone target share 0.05 `red-zone.json:rz_target_share` (1 of 20), no week 3 row. |
| WR Brycen Tremayne | **Sit** | Snap share 0.8052 `usage.json:last_week.snap_share` with Legette out, but target share 0.0556 `usage.json:pooled.target_share` and no red-zone touches; 10.3 `usage.json:last_week.half_ppr_points` is all his output. Flex if Coker sits. |
| TE Darren Waller | **Flex** | Detroit allows the most to TEs, 28.53, rank 1 `points-allowed.json:per_game,rank`; target share 0.1905 `usage.json:last_week.target_share` on snap share 0.436 `usage.json:pooled.snap_share` (snap share stands in for routes), red-zone target share 0.1 `red-zone.json:rz_target_share` (2 of 20). Full `injuries.json:practice_status`, no `report_status`. |
| D/ST Panthers | **Sit** | Detroit is implied for 27 `game-environment.json:away_implied_total`, tied with Cincinnati and Baltimore behind only Buffalo's 28.25, with Carolina a 3.5-point underdog `game-environment.json:spread_line`; Goff has 65.58 `usage.json:pooled.half_ppr_points` in three games. |

### 15. Falcons at Saints - Mon 20:15 ET [#119 game 8]

Row `2026_04_ATL_NO`: 2.5 `game-environment.json:spread_line` (positive =
home favored: Saints by 2.5), total 47.5 `game-environment.json:total_line`;
Saints 25 `game-environment.json:home_implied_total`, Falcons 22.5
`game-environment.json:away_implied_total`. Dome. Neither team had posted a
`report_status` when the tables were built; their `injuries.json` rows are
practice status only, and none is a player on this list.

Pace: Falcons 63 `team-pace.json:plays_per_game` and 0.4176
`team-pace.json:neutral_pass_rate`; Saints 74 and 0.5932, the most plays a
game in the league.

**Falcons**

| Player | Call | Reason |
|---|---|---|
| QB Michael Penix Jr. | **Flex** | One game: 14.04 `usage.json:pooled.half_ppr_points` on snap share 1 `usage.json:pooled.snap_share`, a 22.5 `game-environment.json:away_implied_total`, and New Orleans's 17.82 to QBs, rank 13 `points-allowed.json:per_game,rank`. |
| RB Bijan Robinson | **Start** | Rush share 0.6346 `usage.json:pooled.rush_share`, target share 0.2192 `usage.json:pooled.target_share`, 71.2 `usage.json:pooled.half_ppr_points` over 3 games; New Orleans allows 24.87 to RBs, rank 7 `points-allowed.json:per_game,rank`. Red-zone carry share 0.9167 `red-zone.json:rz_carry_share` (11 of 12). |
| RB Brian Robinson Jr. | **Sit** | Rush share 0.2885 `usage.json:pooled.rush_share` on snap share 0.335 `usage.json:pooled.snap_share`, target share 0.0274 `usage.json:pooled.target_share`, red-zone carry share 0.0833 `red-zone.json:rz_carry_share` (1 of 12). Listed as "Brian Robinson" in the table. |
| WR Drake London | **Start** | Target share 0.4348 `usage.json:last_week.target_share`, air-yards share 0.5988 `usage.json:last_week.air_yards_share`, against New Orleans's 24 to WRs, rank 21 `points-allowed.json:per_game,rank`. No red-zone touches: Atlanta threw one red-zone pass in three games, 1 `red-zone.json:team_rz_targets`, so his ceiling is yardage, not touchdowns. |
| WR Jahan Dotson | **Sit** | Air-yards share 0.375 `usage.json:pooled.air_yards_share` but target share 0.137 `usage.json:pooled.target_share` and 6.1 `usage.json:pooled.half_ppr_points` over 3 games; no red-zone touches. |
| WR Olamide Zaccheaus | **Sit** | Target share 0.0822 `usage.json:pooled.target_share`, snap share 0.36 `usage.json:pooled.snap_share`, 3.7 `usage.json:pooled.half_ppr_points`; no red-zone touches. |
| TE Kyle Pitts Sr. | **Sit** | Snap share 0.53 `usage.json:pooled.snap_share` (snap share stands in for routes), target share 0.0822 `usage.json:pooled.target_share`, 3 `usage.json:pooled.half_ppr_points` in three games, no red-zone touches; New Orleans's 16.5 to TEs, rank 4 `points-allowed.json:per_game,rank`, cannot fix that. Listed as "Kyle Pitts" in the table. |
| D/ST Falcons | **Sit** | New Orleans is implied for 25 `game-environment.json:home_implied_total`; Shough has 69.38 `usage.json:pooled.half_ppr_points` in three games with rush share 0.175 `usage.json:pooled.rush_share`. |

**Saints**

| Player | Call | Reason |
|---|---|---|
| QB Tyler Shough | **Start** | 69.38 `usage.json:pooled.half_ppr_points` over 3 games (23.1 a game), rush share 0.175 `usage.json:pooled.rush_share`, a 25 `game-environment.json:home_implied_total`; Atlanta allows 18.23 to QBs, rank 11 `points-allowed.json:per_game,rank`. |
| RB Alvin Kamara | **Sit** | Rush share 0.3273 `usage.json:pooled.rush_share` on snap share 0.3099 `usage.json:pooled.snap_share`, 9.3 `usage.json:pooled.half_ppr_points` over 2 games, against Atlanta's 10.47 to RBs, rank 30 `points-allowed.json:per_game,rank`. Red-zone carry share 0.1667 `red-zone.json:rz_carry_share` (2 of 12), behind Travis Etienne's 0.3333 (4 of 12) in the same column; the tables show no reason for his share to grow. |
| RB Kendre Miller | **Sit** | Rush share 0.2453 `usage.json:pooled.rush_share` over 2 games, 0.1429 `usage.json:last_week.rush_share`, red-zone carry share 0.1667 `red-zone.json:rz_carry_share` (2 of 12), against Atlanta's 10.47 to RBs, rank 30 `points-allowed.json:per_game,rank`. |
| WR Chris Olave | **Start** | Target share 0.2903 `usage.json:pooled.target_share`, air-yards share 0.4891 `usage.json:pooled.air_yards_share`, red-zone target share 0.2105 `red-zone.json:rz_target_share` (4 of 19), against Atlanta's 31.3 to WRs, rank 6 `points-allowed.json:per_game,rank`, on the league's fastest offense, 74 `team-pace.json:plays_per_game`. |
| WR Devaughn Vele | **Flex** | Snap share 0.9138 `usage.json:pooled.snap_share`, target share 0.1774 `usage.json:pooled.target_share`, 30.7 `usage.json:pooled.half_ppr_points` over 3 games, red-zone target share 0.1579 `red-zone.json:rz_target_share` (3 of 19), in the rank-6 WR matchup. |
| WR Bryce Lance | **Sit** | Snap share 0.7284 `usage.json:pooled.snap_share` but target share 0.0645 `usage.json:pooled.target_share`, 0 `usage.json:last_week.half_ppr_points`, and no red-zone touches. |
| TE Juwan Johnson | **Start** | Target share 0.2 `usage.json:last_week.target_share`, 40.8 `usage.json:pooled.half_ppr_points` over 3 games, on 0.681 `usage.json:pooled.snap_share` (snap share stands in for routes); red-zone target share 0.3158 `red-zone.json:rz_target_share` (6 of 19), the team's highest; Atlanta allows 14.2 to TEs, rank 7 `points-allowed.json:per_game,rank`. |
| D/ST Saints | **Sit** | Atlanta is implied for 22.5 `game-environment.json:away_implied_total`; Bijan Robinson has 71.2 `usage.json:pooled.half_ppr_points` in three games; New Orleans allows 24.87 to RBs, rank 7 `points-allowed.json:per_game,rank`. |

## Comparison with #118 and #119

Two halves: calls that changed, and quoted numbers the tables contradict.
#118 is `docs/research/116-2026-week-4-sit-start-games-1-8.md`, #119 is
`docs/research/117-2026-week-4-sit-start-games-9-16.md`. Both were read on
2026-09-30, a day before the tables were built.

### Calls that differ

39 of the 242 calls differ: 22 against #118, 17 against #119. Every other
player keeps the same call. v2 added Burden, now a Start against #118's Flex,
and dropped Carnell Tate, whose v2 Sit matches #119. Kraft and Andrews were
already on the list and now differ by more.

| Player | Game here | Baseline call | Call here | Computed numbers that moved it |
|---|---|---|---|---|
| QB Daniel Jones | 1 | #119 Start | Flex | 28.34 `usage.json:pooled.half_ppr_points` over 3 games; 7.9 `usage.json:last_week.half_ppr_points`. #119 leaned on a quoted matchup stat; the table agrees on the matchup (rank 2) but his own output is a streamer's. |
| QB Jayden Daniels | 1 | #119 Sit | Flex | Limited `injuries.json:practice_status` - practising; 32.4 `usage.json:pooled.half_ppr_points` over 2 games. A start if active, so not a flat Sit. |
| QB Geno Smith | 3 | #118 Sit | Flex | 50.92 `usage.json:pooled.half_ppr_points` over 3 games; Chicago's rank 17 to QBs `points-allowed.json:rank`. |
| RB Braelon Allen | 3 | #118 Start | Flex | Rush share 0.2235 `usage.json:pooled.rush_share`; Hall's status is DNP, not Out `injuries.json:practice_status`. |
| TE Kenyon Sadiq | 3 | #118 Start | Flex | Snap share 0.4493 `usage.json:pooled.snap_share`; Limited himself `injuries.json:practice_status`; Chicago rank 27 to TEs `points-allowed.json:rank`. |
| RB D'Andre Swift | 3 | #118 Flex | Start | 52.1 `usage.json:pooled.half_ppr_points`; the Jets rank 9 to RBs `points-allowed.json:rank` - #118 quoted "2nd in yards allowed", which is not what fantasy points show. |
| WR Luther Burden III | 3 | #118 Flex | Start | Red-zone target share 0.3333 `red-zone.json:rz_target_share` (6 of 18); 68.67 `team-pace.json:plays_per_game`. New in v2. |
| WR Kalif Raymond | 3 | #118 Sit | Flex | Target share 0.2333 `usage.json:pooled.target_share`, 36.9 `usage.json:pooled.half_ppr_points`. #118 read one week and one long TD. |
| D/ST Bears | 3 | #118 Start | Flex | Geno Smith's 50.92 `usage.json:pooled.half_ppr_points`; Jets implied 20 `game-environment.json:away_implied_total`. |
| RB Bhayshul Tuten | 4 | #118 Start | Flex | Snap share 0.4944 `usage.json:pooled.snap_share`, target share 0.0658 `usage.json:pooled.target_share`; Cincinnati rank 20 to RBs `points-allowed.json:rank`. |
| D/ST Jaguars | 4 | #118 Start | Sit | Cincinnati implied 27 `game-environment.json:home_implied_total`; Burrow 52.92 `usage.json:pooled.half_ppr_points`. |
| TE Mike Gesicki | 4 | #118 Sit | Flex | 27.5 `usage.json:pooled.half_ppr_points` over 2 games; Jacksonville rank 26 to TEs `points-allowed.json:rank`. |
| TE Jake Ferguson | 5 | #118 Start | Flex | Target share 0.1089 `usage.json:pooled.target_share`; Houston rank 16 to TEs `points-allowed.json:rank`. |
| QB Jacoby Brissett | 6 | #118 Sit | Flex | 48.58 `usage.json:pooled.half_ppr_points`, 25.6 `usage.json:last_week.half_ppr_points`. |
| WR Marvin Harrison Jr. | 6 | #118 Flex | Sit | Target share 0.0796 `usage.json:pooled.target_share`, 9.3 `usage.json:pooled.half_ppr_points`. |
| D/ST Cardinals | 6 | #118 Sit | Flex | Winston 8.66 `usage.json:pooled.half_ppr_points` over 2 games; Giants implied 21 `game-environment.json:home_implied_total`. |
| TE Tyler Higbee | 7 | #118 Start | Flex | Philadelphia rank 31 to TEs `points-allowed.json:rank`; target share 0.1711 `usage.json:pooled.target_share` over 2 games. |
| RB Saquon Barkley | 7 | #118 Start | Flex | 19.5 `usage.json:pooled.half_ppr_points` over 3 games, rush share 0.4474 `usage.json:pooled.rush_share`; the Rams rank 26 to RBs `points-allowed.json:rank`. |
| WR DeVonta Smith | 7 | #118 Flex | Start | Target share 0.3333 `usage.json:pooled.target_share`, air-yards share 0.4771 `usage.json:pooled.air_yards_share`. #118 quoted a defense stat over his usage. |
| WR Dontayvion Wicks | 7 | #118 Sit | Flex | Target share 0.1852 `usage.json:pooled.target_share`, 28.4 `usage.json:pooled.half_ppr_points`. |
| QB Jordan Love | 8 | #118 Start | Flex | Tampa Bay rank 24 to QBs `points-allowed.json:rank`; 38.5 `game-environment.json:total_line`. |
| TE Tucker Kraft | 8 | #118 Start | Sit | 15.1 `usage.json:pooled.half_ppr_points` over 3 games; v2: red-zone target share 0.0556 `red-zone.json:rz_target_share` (1 of 18). |
| RB Bucky Irving | 8 | #118 Flex | Start | Rush share 0.6061 `usage.json:pooled.rush_share`; Green Bay rank 1 to RBs `points-allowed.json:rank`. |
| D/ST Buccaneers | 8 | #118 Start | Flex | Green Bay implied 21 `game-environment.json:away_implied_total`; Tampa Bay rank 24 to QBs `points-allowed.json:rank`. |
| TE Mark Andrews | 9 | #119 Start | Sit | 18.7 `usage.json:pooled.half_ppr_points` over 3 games; Tennessee rank 29 to TEs `points-allowed.json:rank`; v2: red-zone target share 0.1 `red-zone.json:rz_target_share` (1 of 10). |
| WR Justin Jefferson | 10 | #119 Start | Flex | Did Not Participate `injuries.json:practice_status`; 0.1186 `usage.json:last_week.snap_share`. |
| WR Xavier Worthy | 11 | #119 Flex | Sit | Target share 0.087 `usage.json:last_week.target_share`; Las Vegas rank 30 to WRs `points-allowed.json:rank`. |
| D/ST Chiefs | 11 | #119 Start | Flex | Cousins 56.24 `usage.json:pooled.half_ppr_points`; Raiders implied 21.5 `game-environment.json:home_implied_total`. |
| TE Oronde Gadsden II | 12 | #119 Start | Sit | Target share 0.0814 `usage.json:pooled.target_share`, 0 `usage.json:last_week.half_ppr_points`. |
| WR Cooper Kupp | 12 | #119 Flex | Sit | Target share 0.1053 `usage.json:pooled.target_share`. |
| TE AJ Barner | 12 | #119 Start | Flex | 19.1 `usage.json:pooled.half_ppr_points` over 3 games; Chargers rank 18 to TEs `points-allowed.json:rank`. |
| RB J.K. Dobbins | 13 | #119 Flex | Sit | 13 `usage.json:pooled.half_ppr_points` over 3 games, target share 0.023 `usage.json:pooled.target_share`. |
| WR Jaylen Waddle | 13 | #119 Start | Flex | 23.9 `usage.json:pooled.half_ppr_points` over 3 games; San Francisco rank 25 to WRs `points-allowed.json:rank`. |
| WR Courtland Sutton | 13 | #119 Flex | Sit | 12.2 `usage.json:pooled.half_ppr_points` over 3 games. |
| D/ST 49ers | 13 | #119 Start | Flex | Denver implied 22.25 `game-environment.json:away_implied_total`. |
| WR Jameson Williams | 14 | #119 Flex | Sit | Target share 0.1574 `usage.json:pooled.target_share`; Carolina rank 31 to WRs `points-allowed.json:rank`. |
| D/ST Lions | 14 | #119 Start | Sit | Carolina implied 24 `game-environment.json:home_implied_total`; Bryce Young 69.16 `usage.json:pooled.half_ppr_points`. |
| QB Michael Penix Jr. | 15 | #119 Start | Flex | One game, 14.04 `usage.json:pooled.half_ppr_points`. |
| RB Alvin Kamara | 15 | #119 Flex | Sit | Snap share 0.3099 `usage.json:pooled.snap_share`; Atlanta rank 30 to RBs `points-allowed.json:rank`. |

**The pattern.** The tables moved calls in two directions. They cooled
tight ends and D/STs that #118 and #119 started on a name or a matchup
quote (Higbee, Kraft, Andrews, Gadsden, Barner; six D/STs), and they warmed
players whose pooled shares the quoted pages had not printed (Swift,
DeVonta Smith, Irving, Raymond, Burden). v2's red-zone shares pushed the same
way: both tight ends it moved went down.

### Quoted numbers the tables contradict

Only numbers the tables can check are listed. Where a quote matched, it is
listed once at the end so the check is visible.

| Quoted in | Player or game | Quoted value (source) | Table value | Note |
|---|---|---|---|---|
| #119 game 1 | Washington pass defense | "league-high 24.8 passing fantasy points per game" (Sharp) | 27.38 to QBs, rank 2 `points-allowed.json:per_game,rank` (WAS, QB); Detroit is rank 1 at 30.02 | Different scoring, but not league-high on these tables. |
| #119 game 1 | Jacory Croskey-Merritt | 58.5% of snaps in week 3 (Sharp) | 0.5652 `usage.json:last_week.snap_share` | Footballguys' 57% in the same document is closer. |
| #119 game 6 | RJ Harvey | 13% target share (RotoWire) | 0.1897 `usage.json:pooled.target_share`; 0.2258 `usage.json:last_week.target_share` | Contradicted. |
| #119 game 6 | Christian McCaffrey | "no week 4 injury item found" | Did Not Participate `injuries.json:practice_status` | The table post-dates #119's read. |
| #118 game 2 | Bills defense vs QBs | "seventh-most points to QBs" (SI) | 19.66, rank 8 `points-allowed.json:per_game,rank` (BUF, QB) | Off by one rank. |
| #118 game 4 | Chase Brown | 68% of snaps (full page) | 0.7018 `usage.json:last_week.snap_share` | Contradicted by two points. |
| #118 game 6 | Malik Nabers | "team-high 27% target share" (NBC) | 0.2317 `usage.json:pooled.target_share`; Isaiah Likely 0.2805 `usage.json:pooled.target_share` | Not team-high pooled; week 3 was 0.2857 `usage.json:last_week.target_share`. |
| #118 game 7 | Davante Adams | 34% target share (Footballguys) | 0.2736 `usage.json:pooled.target_share`; 0.2653 `usage.json:last_week.target_share` | Contradicted. |
| #118 game 7 | DeVonta Smith | 8 of the team's 24 targets | 0.32 `usage.json:last_week.target_share` = 8 of 25 `usage.json:last_week.team_targets` | Team count off by one. |
| #118 game 3 | Jets at Bears line | Bears -3, total 43, Bears 23.0 / Jets 20.0 (CBS) | 3.5 (positive = home favored: Bears by 3.5) / 43.5, 23.5 / 20 `game-environment.json` | Line moved a day later; not an error. |
| #118 game 5 | Cowboys at Texans line | Texans -2.5, total 47.5, 25.0 / 22.5 | 3 (positive = home favored: Texans by 3) / 48.5, 25.75 / 22.75 `game-environment.json` | Moved. |
| #118 game 6 | Cardinals at Giants line | Cardinals -1, total 44.5, 22.75 / 21.75 | -2.5 (negative = away favored: Cardinals by 2.5) / 44.5, 23.5 / 21 `game-environment.json` | Moved. |
| #118 game 7 | Rams at Eagles line | Rams -3, total 44 (CBS); 43.5 (4for4) | -3 (negative = away favored: Rams by 3) / 43.5 `game-environment.json` | 4for4's matches. |
| #118 game 8 | Packers at Buccaneers line | Packers -4, total 39.5 (CBS); -3.5 (4for4) | -3.5 (negative = away favored: Packers by 3.5) / 38.5 `game-environment.json` | Moved. |
| #119 games 2-8 | Lines | TEN-BAL 43.5; MIA-MIN -10, MIA 14.25; KC-LV 48.5; LAC-SEA -6.5/43.5; DEN-SF -2.5/46.5; DET-CAR 50.5; ATL-NO 48.5 (bet365, 2026-09-28; betting-style, favorite negative) | 42.5; 10.5 (positive = home favored: Vikings by 10.5), 14; 47.5; 7 (Seahawks by 7)/42.5; 3 (49ers by 3)/47.5; 51.5; 47.5 `game-environment.json:spread_line,total_line` | bet365 two days earlier vs the games file at 08:16Z on 2026-10-01; movement, not error. |

**Quotes the tables confirm** (week 3 snaps unless noted): #118's Hollins
76%, Henry 70%, Stevenson 52%, Henderson 37%, Cook 67%, DJ Moore 10 of 26
targets on 64%, Kincaid 21% target share on 68%, Swift 69%, Burden 25%
share, Odunze 15% share, Javonte Williams 76%, Lamb 82%, Pickens 85%,
Skattebo 76.6%, McBride 91%, Barkley 72%, Wicks 88% (and its summary-only
"5 targets" = 0.2 of 25), Otton 94%, and Dallas allowing the 3rd-most to QBs
(rank 3). #119's Warren 23.4% share, Allen 25.7%, McLaurin 30%, St. Brown
32.4%, Walker and Kelce 19.8%, Jeanty 18.2% on 84%, Tucker 17.0%, Thornton
7.7% on 46%, Deebo 13.58% on 76%, McCaffrey 83% and 65% of carries, Addison
98%, Gordon 84%, Kamara 32%, the Colts allowing the 5th-most to QBs (rank 5),
and Seattle the 4th-fewest to WRs (rank 29).
