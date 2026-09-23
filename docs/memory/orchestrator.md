# Lessons for the orchestrator in this repository

- Read a child's `state` as well as its labels before counting what is at
  review - closing an issue here does not strip `agent:review`, so every
  closed child (#3, #4, #5, #6, #21) carried it until it was cleaned up by
  hand, and a count taken from labels alone sees work waiting that finished
  days ago.
- Before carrying an `agent:needs-input` question onto a parent, check the
  child still has an open pull request - #9 kept the label after #15 was
  closed unmerged, which made #2 report a blocker with nothing behind it. A
  question whose work was withdrawn is moot, not answered, and the difference
  belongs in the comment that clears it.
- A label write replaces the whole set, so read the labels in the same turn
  you write them - #2 was written from an 11-hour-old read, lost
  `agent:queued`, and the wake-on-merge job then correctly declined to queue
  anything. The objective stalled silently, which is the failure mode: nothing
  reports a label that is merely absent.

<!--
One line per lesson, specific to this repository, stated as a rule with the
reason attached. Hard cap of 40 non-blank lines, enforced by the guard.

Past the cap, rewrite rather than append: merge two lessons that say the same
thing, drop the one that has stopped being relevant, tighten what survives.

Delete any lesson that has graduated into a test, a lint rule, or a type.
-->
