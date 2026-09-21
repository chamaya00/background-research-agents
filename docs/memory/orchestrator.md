# Lessons for the orchestrator in this repository

<!--
One line per lesson, specific to this repository, stated as a rule with the
reason attached. Hard cap of 40 non-blank lines, enforced by the guard.

Past the cap, rewrite rather than append: merge two lessons that say the same
thing, drop the one that has stopped being relevant, tighten what survives.

Delete any lesson that has graduated into a test, a lint rule, or a type.
-->

- When a merged ADR or design doc commits to a capability, name the child that implements it: #2's split left the model writer that ADR 0001 and #3's design doc both assume unwired, so the objective would have finished with templated briefs and every criterion green.
- The objective issue itself keeps acquiring a stale `agent:review` label between supervision runs - seen on seven consecutive wakes of #2. Clear it while replacing the status picture and never read it as a child's state; the mechanism is unidentified, so this is a symptom to handle rather than a cause to fix here.
