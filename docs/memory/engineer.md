# Lessons for the engineer in this repository

<!--
One line per lesson, specific to this repository, stated as a rule with the
reason attached. Hard cap of 40 non-blank lines, enforced by the guard.

Past the cap, rewrite rather than append: merge two lessons that say the same
thing, drop the one that has stopped being relevant, tighten what survives.

Delete any lesson that has graduated into a test, a lint rule, or a type.
-->

- Verify with `npm run <script>`, never a version probe: the run allowlist grants `npm ci|install|run|test` and refuses `npm --version`, `npm init`, bare `node` and `tsc`, so a refused probe proves nothing about whether the checks can run. #4 reported all four checks unverified; all four were runnable.
- Passing tests are not a green gate here - the gate runs typecheck, lint, test and build, and vitest resolves `node:*` imports that `tsc` rejects, so #4's four tests passed while typecheck and build failed on 20 errors.
