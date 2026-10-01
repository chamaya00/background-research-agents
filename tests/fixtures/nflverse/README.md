# nflverse test fixtures

Real rows, copied byte for byte, from nflverse data releases, for #125's tests (#127-#129). No row was edited or invented. Tests read these files; they never fetch from the network.

**Source:** [nflverse/nflverse-data](https://github.com/nflverse/nflverse-data) release assets.

**Licence:** CC-BY 4.0. Data © the nflverse project (https://github.com/nflverse/nflverse-data), used under CC-BY 4.0. Snap counts appear to originate at Pro-Football-Reference; the owner accepted that on #123.

**Fetched:** 2026-10-01 07:22 UTC, from the driving session, with `curl -L`.

| Fixture | Rows kept | Source file | SHA-256 of the full source file at fetch time |
|---|---|---|---|
| `stats_player_week_2026.csv` | CLE rows, weeks 1-3, REG; and TE rows with `opponent_team` = PIT, weeks 1-3 (112) | `releases/download/stats_player/stats_player_week_2026.csv` (1,487,226 bytes) | `e293e213908f746db982cd9112f5016125a42eeeec16c4773b35c6cc5edf6327` |
| `snap_counts_2026.csv` | CLE rows, weeks 1-3 (142) | `releases/download/snap_counts/snap_counts_2026.csv` (402,793 bytes) | `c5868527b1052ae572b2d8f34a7bb777675a5e762ceaeb25f72f10d1c59846d5` |
| `injuries_2026.csv` | CLE and PIT rows, week 4 (10) | `releases/download/injuries/injuries_2026.csv` (106,657 bytes) | `408a873e9a80993f46e073697e7fd3f04894778b28ae23250090440e71106a07` |
| `games.csv` | 2026 season, weeks 1-4 (64) | `releases/download/schedules/games.csv` (2,182,349 bytes) | `0a4b3a2d425bd3fa5b18302c27c3f380307d21c3779d759498654c799f439a49` |
| `stats_player_week_2026.blank-player.csv` | The only 3 rows in the full file with an empty `player_id`, `player_display_name` and `position` (source rows 1118, 2225, 3339: SEA week 1, BUF week 2, ATL week 3). They are team-level rows carrying penalties, and one `def_safeties`. | same file as `stats_player_week_2026.csv` | same |
| `play_by_play_2026.csv.gz` | Every play of CLE's three games, weeks 1-3: `2026_01_CLE_JAX`, `2026_02_CLE_TB`, `2026_03_CAR_CLE` (513 records, 372 columns), gzipped with `gzip -9 -n`. Fetched 2026-10-01 08:27 UTC. | `releases/download/pbp/play_by_play_2026.csv.gz` (3,259,751 bytes, compressed) | `321433f8c3cab61e7577f49dc2f22f8216de8a5eb84baa432f1cf3d60d0b705a` (of the compressed file) |

Each fixture keeps the source file's header line unchanged.

**Values the fixtures were checked to contain:**

- Harold Fannin Jr. (`00-0040663`): `targets` 3, 6, 9 and `receiving_air_yards` 10, 24, 75 in weeks 1-3.
- CLE team totals summed over its rows: targets 22, 30, 30, and air yards 228, 108, 162.

  nflverse's own `air_yards_share` implies team totals of 228, 108 and 172 (Fannin's `receiving_air_yards` / `air_yards_share`: 10/0.0439, 24/0.2222, 75/0.4360). So in week 3 its denominator is 10 more than the sum of the team's rows, and #128 has to say which one it uses.
- TE rows against PIT: half-PPR per game 0.0, 9.0 and 14.0.
- `2026_04_PIT_CLE`: `spread_line` -2.5, `total_line` 38.5, `roof` outdoors.
- Play-by-play, by `game_id#play_id`:
  - pass at `yardline_100` 20, `two_point_attempt` 0, with a receiver: `2026_02_CLE_TB#2630` (CLE, `receiver_player_id` 00-0041547) and `#4242` (TB);
  - pass at 21: `2026_02_CLE_TB#1045` and `#1068` (CLE, 00-0041037) and `#3394` (TB);
  - rush at 5, not a two-point try: `2026_01_CLE_JAX#2441` (CLE, `rusher_player_id` 00-0040784);
  - two-point tries: `2026_03_CAR_CLE#3948` (CAR rush) and `#4288` (CLE pass);
  - spike: `2026_03_CAR_CLE#4642` (`play_type` qb_spike); kneels carry `play_type` qb_kneel; 55 `no_play` rows.
  - Missing values in this file are empty strings, not `NA` (145 empty `pass_oe`, 3 empty `wp`).
  - The path is `pbp/`, not `play_by_play/` as #129 first said; `play_by_play/play_by_play_2026.csv.gz` returns 404.
