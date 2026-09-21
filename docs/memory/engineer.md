# Lessons for the engineer in this repository

- Run `npm ci` before `npm run typecheck`/`lint` on a fresh checkout - `node_modules` is not pre-installed, and a missing install makes `tsc`/`eslint` report dozens of unrelated-looking "cannot find module"/implicit-`any` errors across every file, not just a clear "no node_modules" message. Both are in the allowlist per #5's own note on this.

<!--
One line per lesson, specific to this repository, stated as a rule with the
reason attached. Hard cap of 40 non-blank lines, enforced by the guard.

Past the cap, rewrite rather than append: merge two lessons that say the same
thing, drop the one that has stopped being relevant, tighten what survives.

Delete any lesson that has graduated into a test, a lint rule, or a type.
-->
