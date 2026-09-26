# Lessons for the engineer in this repository

- Run `npm ci` before `npm run typecheck`/`lint` on a fresh checkout - `node_modules` is not pre-installed, and a missing install makes `tsc`/`eslint` report dozens of unrelated-looking "cannot find module"/implicit-`any` errors across every file, not just a clear "no node_modules" message. Both are in the allowlist per #5's own note on this.

- Reach for `npm ci` / `npm run <script>` / `npm test` directly; a refused
  `npm --version` does not mean the toolchain is missing. #4 confirmed five
  probes refused one by one - `npm --version`, `npm init -y`, `node -e`,
  `tsc --version`, `gh --version` - and concluded every code-executing command
  was blocked and the workflow was misconfigured, while the scripts it
  actually needed were permitted the whole time. The allowlist matches command
  shapes literally, so a probe is the one thing it will not let you use to
  find out what you may run.

- An unattended engineer run cannot write to anything under `.claude/`
  (`.claude/commands/post.md` refused twice with "you haven't granted it yet"
  on #73, content unchanged between tries) - the harness classifies `.claude/`
  as sensitive the way `memory-protocol` already documents for
  `.claude/memory/`, and only an interactive session with a person present can
  approve it. Say so in the pull request and leave that edit for the driver
  rather than retrying with a different tool or path.

<!--
One line per lesson, specific to this repository, stated as a rule with the
reason attached. Hard cap of 40 non-blank lines, enforced by the guard.

Past the cap, rewrite rather than append: merge two lessons that say the same
thing, drop the one that has stopped being relevant, tighten what survives.

Delete any lesson that has graduated into a test, a lint rule, or a type.
-->
