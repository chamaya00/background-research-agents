# Privacy

Part of the shopping companion ([`companion.md`](companion.md)).

## The rule

**This repository is public, and so are its issues, pull requests and
Actions logs** (#86 §5, citing GitHub's
[run-log documentation](https://docs.github.com/en/actions/how-tos/monitor-workflows/use-workflow-run-logs)).
Anything a round is given or writes here is published, including a model's
description of an image. So none of the following may go into this
repository, its issues, its pull requests, or a run's input or output:

- **Photos**, including shelf screenshots, outfit photos and product photos
  the owner took, and any description of one.
- **Body sizes** - any Sizes line with real values, any fit note that
  implies a size.
- **Order history** - order numbers, receipts, confirmations, what was
  bought when, and the Owned lines built from them.
- **Children's data** - anything at all about a child, including that a
  size or item is for one. The kids' side is out of scope (#95).

**The one exception is the three creator links the owner cleared in #95
(O4):**

- https://shopmy.us/shop?Curator_id=70850&tab=latest
- https://shopmy.us/shop?Curator_id=63222&tab=collections&Section_id=183978
- https://shopmy.us/shop?Curator_id=497127&tab=latest

No other creator link, handle or name the owner follows goes in here unless
the owner clears it in writing on an issue, the same way.

A round run here therefore works with a near-empty profile. Its picks will
mostly say "why: none yet". That is correct behaviour, not a defect.

## What a run does when it is given something it should not have

If an issue body or comment carries a photo, a size, an order or anything
about a child, the run does not read it into its output, does not describe
it, and says in its pull request body that the input held private data it
ignored, without repeating it. It does not delete or edit the owner's
comment; that is the owner's to do.

## Where real use should live

Two places fit, both inside O2 (free, or the owner's existing Max plan):

| | Private GitHub repository, worked from Claude Code sessions | Claude Project |
|---|---|---|
| **What it is** | A new private repository holding the filled-in profile and round notes; the owner runs rounds in a Claude Code session (local, or on the web or mobile app) against it | A workspace in the Claude app with its own chats and uploaded knowledge files ([Claude support](https://support.claude.com/en/articles/9517075-what-are-projects)) |
| **Cost** | Free: private repositories on GitHub Free, with 2,000 Actions minutes a month if ever needed (#87 §1, citing [GitHub billing](https://docs.github.com/en/billing/managing-billing-for-your-products/managing-billing-for-github-actions/about-billing-for-github-actions)) | Free accounts get up to five projects; the owner's Max plan covers it (same source) |
| **Screenshots** | Shared into the session and never committed; kept in a folder outside the working tree (#86 §5) | Pasted into a chat on the phone, where the ShopMy app already is - the most natural fit for the companion direction |
| **Loop rule 2** ("a reaction is not applied until it is a committed line") | **Met**: the profile is a file, a reaction is a commit | **Not met as written**: knowledge files are replaced by upload; the support page describes no version history (**inferred** from its absence, not confirmed) |
| **Loop rule 3** ("show the diff before committing") | **Met**: `git diff` before the commit | Only by convention: the chat can show a before/after, and the owner re-uploads the file by hand |
| **Reaction log** | `git log -p` on the profile, with the reaction's words in each commit (loop.md step 7) | None beyond chat history |

**Recommended: the private repository**, for the reason #87 §1 gave and
that still holds: the loop's value is a profile the owner can read line by
line with the reason for each line, changed only by a diff they approved,
with a history that answers "why am I not seeing this". Git gives all three
for free; a Project's knowledge file gives none of them without manual
discipline.

**The case for the Claude Project, which is real:** the owner lives in the
ShopMy app on their phone, and sharing a screenshot into a chat on the same
phone is one step, where a repository session is several. If the dry run
(#95) shows the Actions route cannot read ShopMy at all, and screenshots
become the main input, the phone-side convenience may matter more than the
history. **What would flip it:** the owner finding that they do not open
sessions against a repository often enough to keep rounds going. Then a
Project with a pasted profile, re-uploaded on each approved change, is the
better tool, and loop rule 2 is kept by hand.

This public repository keeps the mechanic, the template and these rules,
and nothing personal.
