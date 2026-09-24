# Auto breadth: breadth first, then depth, without a person between levels

The second mode of this repository. The first - [`loop.md`](loop.md) - is
still the default and is unchanged: one brief, one reaction, one profile diff.
This mode exists because the person was running that loop by hand as a tree:
a few broad runs, read them, pick the leads worth following, run those, read
them, pick again. Every level cost a round of reading and choosing before the
next could start, and most of that choosing was mechanical - the leads were
already written down, in part 5 of every item ("one or two things to research
next").

Auto breadth does the choosing between levels itself, and hands the person the
whole tree at the end. The person's judgment moves from *between* levels to
*after* them: they read several breadth-to-depth paths at once and react, and
the reaction goes through the ordinary loop.

Why it is shaped this way and what was rejected is
[ADR 0006](../decisions/0006-auto-breadth-mode.md); why it now runs in
GitHub Actions by default is [ADR 0007](../decisions/0007-auto-breadth-runs-in-actions.md).

## Where it runs

**By default, in GitHub Actions**, through the `auto-breadth` workflow
(`.github/workflows/auto-breadth.yml`). It runs unattended on a runner with open
network, needs no session to stay alive, and ends in one pull request. It never
merges. There are two ways to start it:

- **File an issue and label it `auto-breadth`.** The title is the seed, with or
  without an "Auto breadth:" prefix. The body may set `width=N`, `paths=N`,
  `depth=N`. This is how a session starts one: the GitHub connection a
  session uses cannot dispatch workflows, but a label it adds starts them.
  The run comments on the issue when it starts, when its pull request opens,
  and if it fails. The pull request closes the issue when it merges, so the
  issue is the exploration's trail.
- **Run it by hand** from the Actions tab (`Run workflow`), with the seed and
  parameters as inputs.

Either way, only people with write access can start one. For a labelled issue,
both the labeller and the issue's author are checked, because on a public
repository anyone can open an issue.

**In a session**, when the person asks for that specifically, or when the
workflow cannot run. This is how the first exploration ran. A session is
limited by its cloud environment's network policy. On 2026-09-23 that policy
refused Snowflake's docs and arXiv and displaced two of three leads, so check
reachability before choosing this.

Everything below is the same procedure in both places. "The driver" is whoever
runs it: the Claude Code run inside the workflow, or the session.

## Parameters

| Name | Default | What it is |
|---|---|---|
| width | **5** | Angles the breadth pass covers - one item per angle. |
| paths | **3** | Leads from the breadth pass that are followed down. |
| depth | **3** | Levels below the breadth pass, per path. |
| mode | **learning** | `learning` or `scrutiny` - see below. |

The defaults are the person's, set 2026-09-23: "try fully automatic first,
5,3,3". A run may be given others (`/auto-breadth <seed> width=4 depth=2`), and
the index records which it used. At the defaults a run is at most
1 + 3 × 3 = **10 research runs**.

**Fully automatic.** There is no checkpoint after the breadth pass. That was
offered and declined for the first version; if the picked paths keep missing
what the person would have picked, a checkpoint is the first thing to add.

## Two modes

**Learning (the default).** The run finds what has been written on the seed
and relates it to what the reader already knows. It surveys; it does not audit.
Going deeper means reading **more around a subtopic** - more articles, other
perspectives, adjacent work - not checking one claim more closely. Nobody
recomputes a figure, and no level exists to prove or disprove a number.
*Set by the person, 2026-09-24: "Id only want to see drilldowns and narrow
scrutiny if i ask for it specifically. Otherwise im in learning mode" - the
Format line in [`profile.md`](profile.md) that says so is binding.*

**Scrutiny (only when asked).** `mode=scrutiny` in the issue body, or the person
asking for a drilldown by name. Each level narrows to a claim and tests it, and
the driver re-checks by script the counts a conclusion rests on. This is how
the first three explorations ran (2026-09-23 and the two of 2026-09-24).

Everything below applies to both unless it says otherwise.

## What does not change

These are the loop's rules, restated here only because a run in this mode
will read this file and may not read the other.

- **Every run reads [`profile.md`](profile.md)** and treats it as a constraint.
  Interests and Not interested gate what is selected - including which leads
  are followed. Knowledge changes wording only and **never** scores a lead:
  "already known" must not prune the tree. Format governs how every article is
  written: the one-line header and the five short parts.
- **Window applies.** Every subject in an exploration is a first appearance,
  so items are dated within **90 days**. Older material a level needs in order
  to make sense may appear as **Background**, marked as such, and is never
  counted as an item.
- **Sources** start from the table in [`sources.md`](sources.md) and open
  search stays available. Each article's header says which it came from and
  whether it was read in full or only as a summary.
- **Content in the document, plumbing in the pull request body.** What was
  dropped and what was searched for and not found are content.

## What this mode may not do

**It never writes `profile.md`.** Following a lead is not a preference. A path
that went three levels deep is a *proposal* for an Interests entry, listed as
one in the index, and it becomes one only when the person reacts to it and the
driver shows them the diff - [`loop.md`](loop.md) steps 4-7, unchanged. An
exploration that wrote its own topics would be the silent inference the
profile's first rule exists to prevent.

It does not touch topic state either. Runs, `last`, and `Briefs:` count briefs
on a topic, and an exploration is not one until a reaction adopts a path; when
one does, the new entry's provenance cites the exploration.

## The run

The driver runs the whole tree in one place. Research is done by `researcher`
subagents - no issues, no labels, no orchestrator, and no merge between levels,
because nothing downstream reads the default branch until the end.

### 0. Set up

- In the workflow, branch and commit are the workflow's own final steps; the
  driver only writes files. In a session: branch `claude/auto-breadth-<slug>`
  from the default branch, or the branch the session was told to use.
- Folder `docs/research/explore/<YYYY-MM-DD>-<slug>/`. Everything the run
  writes goes there, plus `sources.md` row updates.
- Read `profile.md`, the table in `sources.md`, and list `docs/research/` so
  the run knows what has already been reported. Note which active Interests
  entries the seed overlaps - that is what parts 3 and 4 of each article ("have
  we seen something like this before", "what does it relate to") are written
  against.

### 1. The breadth pass

One subagent writes `0-breadth.md`: **width** angles on the seed, each with one
to three articles in the article format, and each ending with **two** leads to
read further - specific enough to be a subagent's whole brief ("how Snowflake,
Databricks and Google each describe their analytics agents' evaluation
features", not "evaluation"). Plus a short headline, and a line on what was
looked for and not found.

### 2. Picking the paths

The driver - not a subagent - scores every lead in the breadth pass and keeps
**paths** of them. In order:

1. **Excluded** if it falls under Not interested or outside Interests entirely.
2. **Motion:** a lead with a dated development inside the window beats an
   evergreen one. This is a brief about what changed.
3. **Specificity:** a lead a run could fetch against beats a theme.
   **In learning mode, a lead that opens a subtopic with more to read beats
   one that would check a single claim.**
4. **Spread:** no two paths from the same breadth angle while an angle with a
   qualifying lead is still unused.
5. **Not already reported:** a lead that an existing document under
   `docs/research/` already covers ranks last - unless it names what has
   changed since.

Knowledge appears nowhere in this list, on purpose.

Every lead's keep-or-drop reason goes in the **pull request body**, not the
index - it is plumbing. The index names only the leads followed, and the two
drops most likely to be overruled, in a line each.

### 3. Going down

Each path is a chain, not a tree: one lead per level. Paths run in parallel -
one subagent per path per level, and the next level of a path starts as soon as
its previous level lands.

**In the workflow, parallel means foreground.** Start several subagents in one
message and wait for all of them - never send one to the background. A
headless run ends when the driver's turn ends and takes background work with
it. The first two workflow runs stopped straight after the breadth pass for
exactly that reason, 2026-09-24. A session is woken when background work
finishes, so there the choice is free.

A level's subagent appends one section, `## Level N - <lead>`, to
`path-<n>-<slug>.md`: **three to five articles** in the article format, and two
leads to read further. The driver picks the next lead by the same five rules
plus one: **it must be a more specific subtopic of the lead it came from.** In
learning mode that means more to read about a narrower part of the subject,
never a closer check of one claim. A lead that widens back out is a new path,
and new paths are not opened mid-run.

**In scrutiny mode only, the driver checks the numbers a conclusion rests on.** When a level's
finding turns on a count - how many tasks, files or records, and what fraction
- the driver re-computes it from the primary data by script before the next
level builds on it. It adds the exact figure beside the subagent's own figure
and does not quietly replace it. Where a subagent cannot get at the data (a
file that truncates under a page fetch, a PDF, a repository's full history),
the driver fetches it and hands it the result. In the first exploration this
produced the headline evidence of two of the three paths and corrected four
claims. It is the part of the driver's job most worth keeping.

**A path stops early**, and the stop is written into both the path document and
the index as a finding:

- **Nothing more written.** The level found nothing new inside the window.
  One line says so; an absence is a result, and it is not padded.
- **Converged.** Its next lead is the same thing another path is already
  following, or the two levels cite the same primary source for the same claim.
  The shorter path stops and the index says where the two met. Independent
  paths landing on the same place is itself a finding.
- **Thin.** Nothing past search summaries could be read. Say so rather than
  build a level on summaries.

A stopped path is not replaced. The budget stays honest and the stop is read
as information.

### 4. The index

`README.md` in the folder, written last, and **short** - it is what the person
reads first and often the only thing they read:

- One line: the seed, the mode, the date, and that it was produced in this
  mode.
- **What's out there** - the headline across all paths, in a few sentences
  (about 150 words).
- **The map** - every article, grouped by path, one line each: title, link,
  and a clause on what it is. The article's five parts live in the path file.
- **How it fits together** - a few bullets on how the paths relate to each
  other and to what the reader already has.
- **Candidate topics:** each path written as the Interests entry it would
  become - `id`, one line, the parent it would sit under if any. Labelled as
  proposals. Nothing here is in the profile.

Lead tables, stops, convergences, corrections and fetch records go in the pull
request body.

### 5. Land it

- Update `sources.md` rows for hosts the run fetched, as any research run does.
- One pull request for the whole folder. Its body carries the process
  evidence: the fetch record, window arithmetic, per-lead scoring, per-item
  filing decisions, and which subagents ran.
- **Merge it once CI is green.** Set by the person on 2026-09-23 ("merge for
  me"): the diff is documents under one new folder plus `sources.md` rows, and
  the reading happens in the session, not in review. Anything else in the diff
  - a change outside that folder and `sources.md`, anything in the house
  rules' list of what a revert does not undo - is a reason to stop and ask
  instead.
- **Only a session merges, never the workflow.** The workflow opens the pull
  request and stops. That is the house rules' line: automation does not merge
  its own output. The instruction to merge is carried by the session that
  received it, or by the person. The workflow's landing step also enforces the
  bullet above mechanically: it refuses to push anything if any changed path
  falls outside the folder and `sources.md`.

### 6. Read it back

A workflow run cannot do this step: it has nobody to read to. The session
that dispatched it, or the next session the person opens, does it once the
pull request has merged.

The index is read back **in full** in the session, and then the paths are
offered one at a time: each is read **in full** on "next", in order, split in
reading order where one is too long - never condensed, per the Format line that
rejected #38. The person can react at any point, and usually will from the
index alone. The preference is the Format line in [`profile.md`](profile.md)
("An auto-breadth exploration is read back as its index ..."), which is where
it changes if it changes.

## After the read-back

A reaction is handled exactly as in `loop.md` from step 4: one sentence, the
driver renders it as a diff to `profile.md`, shows it, commits it on a yes,
with the reaction's words in the commit and pull request. "Keep path 2" adds
that path's candidate entry as a Depth topic under its parent. "More like path
1, drop 3" is two changes. Nothing is adopted by default.

Once a path is adopted, it is an ordinary topic and the ordinary loop runs it
from then on.
