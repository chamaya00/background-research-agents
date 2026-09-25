# Writer style - posts for LinkedIn

Who the posts are for, whose voice they are in, and what shape they take.
Every `/post` run reads this file and treats it as a constraint. The driving
session maintains it. Nobody else writes to it.

It is the writer's counterpart to [`../reader/profile.md`](../reader/profile.md).
That file is about one reader, the person this repository researches for. This
one is about the audience that person writes for, which is a different set of
people with different needs, so the two are kept apart.

## How a line gets here

The same way a profile line does, per [`writer.md`](writer.md) step 8: a
draft is read, a reaction is given in the author's own words, and a reaction
about posts in general - rather than about this one draft - is rendered as a
diff to this file, shown, and committed on a yes. Every line cites the post
that produced it. A reaction that contradicts a line replaces it, and the old
line moves to **Retired** with both dates.

Lines marked *Seed* came from the author's answers when the mode was set up,
2026-09-25. The rest came from reactions to drafts.

## Channel

- **LinkedIn, and the feed post is the default.** 300-450 words, which is
  about a two-minute read and fits LinkedIn's 3,000-character limit. An article
  is written only when a worked example needs more room than that.
  *Reaction to the first draft (#71), "Make the feed post the default",
  2026-09-25.*
- **The first two lines carry the whole point.** They are most of what a
  scroller sees before "see more". *Seed, 2026-09-25.*
- **Written to paste, not to render.** LinkedIn does not render markdown. Plain
  text with line breaks, no markdown symbols, and no links in the body: sources
  go in a first comment, drafted with the post. *Seed, 2026-09-25; links moved
  to the first comment with the feed-post default.*

## Audience, in priority order

1. **Data science and data engineering hiring managers and recruiters.** They
   should come away having seen judgment - a position taken and argued from
   evidence - and the ability to build agentic systems that do useful work.
   Lead with the claim, keep it skimmable, and show a decision, not a list.
2. **People making the same move from data science to data engineering.**
   Something concrete to learn or do next.
3. **Anyone interested in agent evals and AI measurement, new college
   graduates included.** Every term of art is defined in a clause the first
   time it appears, and no insider knowledge is assumed.

When they pull apart, write for the first and define terms for the third.
*Seed: the author's three audiences, 2026-09-25.*

## Voice

- **First person, as the author: a practitioner learning in public.** A
  product data scientist moving into data engineering, candid about what is
  new to them. Not an expert's verdict and not a vendor's pitch. *Seed: "Yes
  my voice, practitioner learning in public", 2026-09-25.*
- **The spine is the author's experience.** The post opens from something the
  author did, believed, got wrong or struggled with, taken from the interview
  in `writer.md` step 3, and the research answers it. Never invent an
  anecdote; a point with no real moment behind it is cut. *Reaction to the
  first draft (#71): "the voice feels inauthentic and sounds 100% AI written
  ... In my own writing ive tried to put my personal experience out there
  behind any recommendations or claims i make", 2026-09-25.*
- **One click per post.** Find the thing that took the author longest to see,
  and make it land for the reader in two minutes: the before, the shift, one
  concrete example. Everything else is cut. *Same reaction: "I want to make the
  thing that took me 2 hours to understand immediately click for the reader in
  2 minutes".*
- **Honest about what is still unclear**, and says what the author will do
  about it. *Interview for #71: "i still dint fully get them, id want my own
  hands on experience", 2026-09-25.*
- **Three to five sources carry the argument**, not a dozen. *Same reaction.*
- **No repeated sentence pattern** (such as ending paragraphs with "That's X")
  and no stacks of bold lead-ins. Once the author adds samples of their own
  writing to `docs/writer/samples/`, the post matches them. *Same reaction:
  "sounds 100% AI written even without the clear tells".*
- **Opinions read as mine.** Facts have a source in the first comment. *Seed,
  2026-09-25.*
- **Plain, concrete sentences.** No hype words, and no claim that anything
  "changes everything". *Seed, 2026-09-25.*

## Structure of a post

1. **Two opening lines that carry the point**, in the author's words where
   possible.
2. **The author's moment**: what they saw or believed, concretely.
3. **The click**: what the research showed, tied point by point to that
   moment.
4. **What is still open**, and what the author will do next.
5. **How this was made**, in one or two sentences: the agentic system did the
   reading, the author directed it. The repository link goes in the first
   comment. *Seed: "Im also wanting to showcase my ability to build useful
   agentic systems by conveying this content generated by my agentic system",
   2026-09-25; shortened with the feed-post default.*

## Evidence

- **Every factual claim has its original source in the first comment** - the
  vendor page, paper or pull request - not this repository's research files.
  The repository is linked there once. *Seed, 2026-09-25.*
- **Vendor claims are labelled as vendor claims**, and a number is quoted as
  reported by its source. The research ran in learning mode and did not audit
  them. *Seed, 2026-09-25.*
- **Nothing the research did not carry.** A post that needs a fact the
  research lacks names the gap and proposes an auto-breadth seed. *Seed,
  2026-09-25.*
- **The first comment says when the reading was done**, as "Reading as of
  <date>". *Seed, 2026-09-25.*

## Never in a post

- **Anything about an employer's internal systems, data or practices.** The
  research reads public sources only, so this holds by construction; a draft
  that reaches for an inside example is rewritten. *Seed: "Nothing beyond what
  the public sources say", 2026-09-25.*
- **Cost and pricing of AI features as a subject in itself**, for the same
  reason it is excluded from the research: the author is not interested in it.
  *Carried from `profile.md` Not interested, 2026-09-24.*

## Retired

- **Each post is a LinkedIn article of 800-1,200 words plus a feed post of at
  most about 1,200 characters that shares it.** Seed, 2026-09-25. Retired
  2026-09-25 by the reaction to #71's first draft, "Make the feed post the
  default".
