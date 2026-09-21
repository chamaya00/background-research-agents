# ADR 0001: TypeScript on Node for the research-brief vertical slice

Date: 2026-09-20
Status: accepted

## Context

#2 needs a stack before any code lands, and #3 is the issue that has to record
it. The vertical slice this stack has to carry: a script invoked on a schedule
(no server, no UI) that reads a handful of hand-editable state files (interest,
preference, knowledge, source list), fetches from a fixed set of external
sources, calls a model API to write brief items, and posts the result as a
GitHub issue via the GitHub API - then, in a later child, reads comments back
off that issue as untrusted input and turns them into state-file diffs.

`ci.yml` ships as a placeholder gate whose tripwire fails the moment any file
lands outside the provisioned set (`README.md`, `CLAUDE.md`, `.github/`,
`.claude/`, `docs/`, `scripts/`). Its header comment documents exactly one
non-hand-written path through that gate: a Node project with `package.json`
scripts for `typecheck`, `lint`, `test`, `build`, wired with a four-line
`with:` block (`check-name: 'checks'`, `node-version: '20'`,
`checks: 'typecheck,lint,test,build'`). Any other stack means hand-writing the
gate's `commands:` list and maintaining it as the project's own substitute for
that mapping.

The constraint driving this decision is therefore not raw language
suitability - several stacks can fetch HTTP, parse YAML, and call a model API -
it is which one turns into a *tested, structurally-enforced* CI gate with the
least hand-built machinery, since the gate is required infrastructure for
every child issue that follows this one (#2's trap 1).

## Decision

The vertical slice is built in TypeScript, run on Node 20, checked with the
gate's native four-script mapping: `tsc --noEmit` for typecheck, `eslint` for
lint, a test runner (`vitest` or Node's built-in `node:test`) for test, and
`tsc` (or `tsup`) for build. State files (interest, preference, knowledge,
source list) are plain YAML, parsed with a small schema-validation library
(e.g. `zod`) so a hand-edited file that breaks the shape fails loudly in a
typed way rather than silently producing `undefined` fields downstream.
GitHub interaction goes through `@octokit/rest`; the model API through its
official TypeScript SDK. No web framework, no database, no build step beyond
compiling to JS for the scheduled job to run - there is no served surface in
scope for this slice.

## Consequences

**Easier:** the CI swap called out in #2's trap 1 is the documented four-line
`with:` block instead of a hand-rolled `commands:` list that the project then
owns forever. Typed parsing of hand-edited YAML state files catches a
malformed file at the type boundary instead of at whatever line first reads
the missing field. `@octokit/rest` and the model SDKs are both maintained,
typed, first-party clients, so the outbound calls this slice makes (#2's trap
5) are not hand-rolled HTTP against undocumented shapes.

**Harder:** none of this buys anything for the parts of the slice that are not
about the stack - the schema design in this same issue, the untrusted-comment
handling in #2's trap 4, and the fixture determinism in trap 3 all have to be
solved by design regardless of language.

**Ruled out later:** picking TypeScript now makes a second language for this
slice a genuine category change (house rules: "the first dependency from an
ecosystem this project does not already use" needs its own ADR), so a future
child reaching for Python (for a specific library, say) is a decision that
comes back through this file, not a silent addition.

## Alternatives rejected

**Python.** A credible choice for anything fetch-and-summarize shaped, and
`requests`/`httpx`, `pyyaml`, and `pydantic` cover the same ground as the
TypeScript equivalents above. Rejected because `ci.yml`'s placeholder gate has
no documented Python path: the four checks it expects (`typecheck`, `lint`,
`test`, `build`) would have to be hand-assembled from `mypy`, `ruff`,
`pytest`, and a packaging step, each configured and maintained here rather
than inherited from the gate's own logic - real cost, for no capability this
slice needs that Node lacks.

**Go.** Statically typed, single-binary output is a genuine fit for a
scheduled job with no server. Rejected for the same reason as Python (no
documented gate path, so `commands:` would be hand-written and hand-maintained
here) plus a second one specific to Go: the GitHub API and the current
generation of model-provider SDKs are officially shipped and best-supported in
TypeScript/JavaScript and Python first, with Go clients typically community
maintained or code-generated - a worse fit for a slice whose two outbound
integrations (GitHub, the model API) are exactly where correctness matters
most.

**Deno or Bun instead of Node.** Same source language, so this is a runtime
choice rather than a stack choice, but worth naming since it was considered.
Rejected because the documented gate path names `node-version` explicitly, so
either runtime would still mean hand-writing `commands:` to invoke a different
binary - all cost, no benefit, for a slice with no feature (top-level await
aside) that depends on choosing the newer runtime over the one the gate
already expects.
