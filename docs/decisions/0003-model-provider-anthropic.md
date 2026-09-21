# ADR 0003: Anthropic's Messages API as the model provider for the writer

Date: 2026-09-21
Status: accepted

## Context

ADR 0001 commits to a model-generated writer and to reaching it "through its
official TypeScript SDK," but deliberately leaves the provider unnamed -
`src/writer.ts`'s `templateWriter` is a placeholder specifically because no
child had yet wired the credential a live call needs. #9 is that child: it
adds the first outbound call to a model API and the first credential of that
kind, which is a category change (house-rules: "the first dependency from an
ecosystem this project does not already use") independent of which provider
is picked, so it gets this ADR regardless of the answer.

The task the provider has to do is narrow: given one fetched item's title,
URL, and raw text, plus zero or one directive (`explain:<concept>` or
`remind:<concept>`), return one or two sentences of prose that comply with
the directive. No tool use, no multi-turn conversation, no long context. That
narrowness matters more than any benchmark difference between providers here.

## Decision

The writer calls Anthropic's Messages API through `@anthropic-ai/sdk`
(`src/modelWriter.ts`), reading its key from the `ANTHROPIC_API_KEY`
environment variable - the SDK's own default lookup, so the key is never
threaded through application config by hand. It uses
`claude-haiku-4-5-20251001`: the task is a short, low-ambiguity rewrite
repeated once per brief item on a schedule, and a fast, inexpensive model is
the right fit for that shape rather than a reach for one built for harder
reasoning.

## Consequences

**Easier:** `@anthropic-ai/sdk` is a maintained, typed first-party client
(same category of dependency ADR 0001 already chose `@octokit/rest` for), so
the SDK itself is not a new kind of risk on top of the credential and the
outbound call. The env-var default means there is exactly one place the key
can leak from in application code: nowhere, because the code never reads or
logs it directly.

**Harder:** the writer now depends on a paid, rate-limited external service
where it previously depended on nothing - a scheduled run can fail for
reasons (quota, an outage, a model deprecation) that a template render never
could. `src/modelWriter.ts` is written so that failure is loud (an uncaught
error that stops the run) rather than something the pipeline swallows and
posts around, which is what #9's criterion 4 asks for and what makes this
harder tolerable rather than silently corrosive.

**Ruled out later:** picking Anthropic here makes a second model provider a
genuine category change the same way a second language would be under ADR
0001 - a future child reaching for a different provider (for cost, or a
capability this one lacks) comes back through this file rather than adding a
second SDK quietly.

## Alternatives rejected

**OpenAI.** Equally credible for this task; `openai`'s Node SDK is likewise
maintained and typed. Rejected on a single tie-breaker: this repository's own
tooling (`.claude/`, the agent roles that write it) is Claude Code, built on
Anthropic's models, so its outbound calls and its own operation already run
through the same account relationship rather than adding a second vendor
relationship for one narrow, low-stakes task.

**Google Gemini.** Same shape of argument as OpenAI - a credible general
choice, rejected for the same tie-breaker rather than any capability gap for
a two-sentence rewrite task.

**A cheaper non-model approach (templating with light randomization, or a
smaller local model).** Rejected because `docs/research/3-state-and-source-schema.md`
is explicit that item text is model-generated and that this design "does not
pretend" a model's output is byte-reproducible; a local or templated
approach would quietly redefine that decision rather than execute it, and
redefining it is not this issue's scope.
