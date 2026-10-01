# Lessons for the researcher in this repository

<!--
One line per lesson, specific to this repository, stated as a rule with the
reason attached. Hard cap of 40 non-blank lines, enforced by the guard.

Past the cap, rewrite rather than append: merge two lessons that say the same
thing, drop the one that has stopped being relevant, tighten what survives.

Delete any lesson that has graduated into a test, a lint rule, or a type.
-->

- A brief run states its date window and its source stand-in in the document
  itself - `docs/reader/profile.md` specifies neither, so a brief that leaves
  them implicit cannot be argued with and the reaction it earns is about the
  wrong thing.
- An item that serves two Interests lines is filed under one of them and takes
  that line's window, so the filing decision can admit an item the other line
  would have excluded on date - name the assignment and the date it fails under
  the other line, because an unstated one is a silent widening of the window.
- An acceptance criterion here that says "checked by grepping" is checked with
  a plain grep, so a sentence wrapped across two lines fails a criterion it
  actually satisfies - #32 wrote all three of its commitments correctly and had
  to rewrap them. Put the checkable claim on one line, even a long one.
- Re-fetch every host while writing the document rather than reconstructing
  the list from what you cited - #21 did this in its revision round and found
  that `hpcwire.com` 403s, so an item it had cited as corroboration had never
  been read. A citation list records what you meant to read; only a re-fetch
  records what you got. Re-fetch load-bearing quotes too: in #113 a second
  fetch of the same page dropped a factory town, a style number and a
  "heating machines" detail the first summary had supplied.
- Reddit is unreachable from a run - WebSearch rejects `allowed_domains: reddit.com` and WebFetch refuses `reddit.com` and `redditinc.com` (#106) - so do not plan an approach on it; say so once and ask for owner-pasted threads.
- When a run needs a file from the web and `curl` is refused, WebFetch saves binary responses (images) to a local path that Read can open - #86 ran its vision test that way; do not report "cannot test on an image" before trying it.
- GitHub release assets come back as octet-stream, so WebFetch saves the whole file even when its text summary is truncated - #123 grepped full nflverse CSVs that way after `curl`, `gh api` and `zcat` were refused; follow the 302 to `release-assets.githubusercontent.com`, then use Grep (Read refuses `.bin`), and expect gzip to stay unreadable.
