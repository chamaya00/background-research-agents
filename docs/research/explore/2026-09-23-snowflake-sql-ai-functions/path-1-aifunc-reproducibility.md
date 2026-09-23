# Path 1 - Spider 2.0-AIFunc reproducibility

This path descends from **item 5** of the breadth pass
([`0-breadth.md`](0-breadth.md), "The benchmark built on these functions cannot
be run on the shared accounts, and its public release is smaller than its
paper"). It follows that item's first lead: **the 465-versus-393 gap in Spider
2.0-AIFunc.** It was produced in auto-breadth mode
([`docs/reader/auto-breadth.md`](../../../reader/auto-breadth.md)) by a research
subagent. It is not a brief on an adopted topic, and nothing in it is a profile
change.

## Level 1 - The 465-versus-393 gap

**The gap is not a difference in counting units. 72 instances were removed,
36 from each of the two task sets, and eight databases went with them. The
paper's headline accuracies fit 465 and, as single-run scores, three of the
four cannot be produced on 393. So the 67-70% that #35 and #42 used as their
counter-argument is a score on a set nobody outside the authors has. The
public release comes with no reconciliation, and it is scored by hand.**

The window is 90 days, so items must be dated on or after **2026-06-25**. Both
primary sources fall inside it: the paper was submitted on **2026-07-07**, and
the repository was published on 2026-07-07 with its last commit on
**2026-07-08**. **Nothing has moved since 2026-07-08.** There have been no
commits, issues or pull requests, no second arXiv version, and no Spider 2.0
News entry. Everything below is a closer reading of those two in-window
releases, not a later development.

**How this level could read its sources.** The repository was read in full on
`raw.githubusercontent.com` and `github.com`. The paper could not be read:
`arxiv.org` refused this run. Every count or percentage attributed to the paper
below comes from **search-engine summaries of its HTML full text**, and each
item says which claims rest on them.

---

### 1. The 72 missing instances are 36 from the main set and 36 from the diversity set, and the paper calls its 465 "the final released benchmark"

**1. What it is.** Spider 2.0-AIFunc was built in two generation passes. The
**main** pass rewrote Spider2-Snow tasks so that the answer needs a Snowflake AI
function. The **diversity** pass (instance IDs ending `_div`) prompted for the
under-used functions: `AI_SENTIMENT`, `AI_EXTRACT` and `AI_AGG`. Setting the
paper's counts beside the release's shows exactly where the 72 went:

| | Paper (arXiv:2607.06229) | Public release | Removed |
|---|---|---|---|
| Main | 325 | 289 | **36** (11% of main) |
| Diversity | 140 | 104 | **36** (26% of diversity) |
| **Total** | **465** | **393** | **72** (15.5%) |
| Databases | 125 | 117 | **8** |
| Single-function tasks | 155 | about 122-125 (derived) | about 30-33 |
| Multi-function tasks | 310 | about 268-271 (derived) | about 39-42 |
| Tasks using `AI_SENTIMENT` | 22 | 22 | **0** |

This rules out the explanation the breadth pass could not exclude, which was
that the two figures count different things. Both count instances with an
`instance_id`, and the release contains both sets (the first rows of the data
file are `sf_bq003` through `sf_bq011`, with `sf_bq008_div` and `sf_bq010_div`
among them). Nor is 393 "main only". **Something removed instances from both
sets in equal numbers.**

According to a search summary of the paper's text, "after all verification
and filtering stages, 465 instances (325 from the main round, 140 from the
diversity round) across 125 databases constitute the final released
benchmark." The repository's documents never mention 465, 125, 325 or 140.
`DATA.md` describes the file as "393 AISQL tasks" referencing "117 Spider2-Snow
databases and 42 external-knowledge documents". The evaluation guide says
"evaluating all 393 tasks once already adds up".

**The candidate cause is one the lead did not name, and the repository
documents it.** `docs/generation.md` ends with an "Additional quality
validation" section. It describes a pass run after the three-stage pipeline,
combining AI assistance and human review, with two filters, quoted here:

- *Instruction-clarity review:* "we checked that each instruction is
  unambiguous and fully specifies the expected result, and refined or dropped
  the ones that were not."
- *Decorative-AI audit:* "we kept only tasks where an AI function is
  essential, and removed any whose result a traditional SQL query could
  reproduce on its own."

It also calls the public file "a gold-stripped export of the **selected**
instances". The paper's description of its own pipeline, as far as the search
summaries show it, covers generation, the diversity round and the
multi-pass determinism check, which comprises "at least 35 executions per
instance" in "temporally separated windows". None of the summaries mentions
either of the two filters above.

**Which instances were dropped cannot be established from public material.**
The gold SQL, the generation traces and the paper's own instance list are not
released (`DATA.md`: "Generation artifacts and traces" are excluded). The data
file came back truncated when fetched here, so the released IDs could not be
enumerated either.

- **Candidate carried and not ruled out: whole databases lost access.** Eight
  databases vanished. The 72 removals average nine per lost database, against
  3.7 tasks per database across the paper's set. So database loss alone would
  need the eight to have been unusually task-heavy, and it is not the likelier
  cause.
- **Candidate discarded: a different Hugging Face copy.** The README links a
  Hugging Face dataset (`tianyang/spider2-aifunc`), which could in principle
  hold 465. `huggingface.co` refused this run, and search did not surface the
  dataset page. That leaves the candidate unchecked rather than ruled out.
  Every document on GitHub says 393.

**2. How long ago.** The release was published **2026-07-07** (78 days ago),
the same day as the paper's submission. The last commit is **2026-07-08** (77
days ago).

**3. How it relates to what has already been read.** It serves
**`benchmarks-depth`**. #35's item 2 reported "465 verified instances across
125 real-world databases" from the paper and never saw the release. #42 read
the paper's determinism check ("each of the 465 instances") and also never saw
the release. The breadth pass found the 393 and said which of the two
explanations for the gap it could not rule out. This item rules out one of
them.

**4. What through-line it changes.** It sharpens the one #42 left open: AIFunc
is "an unaudited self-report by the benchmark's own authors". The report and
the artefact now also **describe different sets**, and the artefact's own
documentation of a post-pipeline filter is the likeliest bridge between them.
A benchmark whose paper and release disagree by 15% with no note on either
side is a weaker instrument than one that is merely unaudited.

**5. What to research next.**
- **Which eight Spider2-Snow databases are in the paper's 125 but not the
  release's 117.** List the distinct `db_id` values in
  `Leolty/Spider2-AIFunc/data/spider2-aifunc.jsonl`. This needs a
  non-summarising download, because the file truncates under a page fetch.
  Compare them with the paper's appendix database list, or failing that with
  the database column of `xlang-ai/Spider2`'s `spider2-snow` task file. That
  says whether the eight are licensing-sensitive, very large, or were
  suspended.
- **Whether the construction section of arXiv:2607.06229 describes the
  instruction-clarity review and the decorative-AI audit that
  `docs/generation.md` describes.** If the paper describes them and still
  reports 465, something else removed the 72. If it does not, the filters
  post-date the evaluation that produced Table 1, and the released 393 is the
  cleaned set.

**6. Source.** Reached from the breadth pass, which reached it by open search.
`github.com` is on `sources.md` for line B; this repository was not.
- [`README.md`](https://raw.githubusercontent.com/Leolty/Spider2-AIFunc/main/README.md),
  [`DATA.md`](https://raw.githubusercontent.com/Leolty/Spider2-AIFunc/main/DATA.md),
  [`docs/dataset.md`](https://raw.githubusercontent.com/Leolty/Spider2-AIFunc/main/docs/dataset.md),
  [`docs/generation.md`](https://raw.githubusercontent.com/Leolty/Spider2-AIFunc/main/docs/generation.md)
  and [`docs/evaluation.md`](https://raw.githubusercontent.com/Leolty/Spider2-AIFunc/main/docs/evaluation.md):
  **full page read**. `generation.md` was fetched three times, the last time
  for its closing sections verbatim.
- [`data/spider2-aifunc.jsonl`](https://raw.githubusercontent.com/Leolty/Spider2-AIFunc/main/data/spider2-aifunc.jsonl):
  **partial**, because the fetch truncated it. Only the first and last few
  records were seen.
- The [repository page](https://github.com/Leolty/Spider2-AIFunc),
  [commits](https://github.com/Leolty/Spider2-AIFunc/commits/main),
  [issues](https://github.com/Leolty/Spider2-AIFunc/issues?q=is%3Aissue),
  [pull requests](https://github.com/Leolty/Spider2-AIFunc/pulls?q=is%3Apr) and
  [forks](https://github.com/Leolty/Spider2-AIFunc/forks): **full page read**.
- [arXiv:2607.06229](https://arxiv.org/html/2607.06229) (325/140, 125,
  155/310, `AI_SENTIMENT` = 22, "final released benchmark", the 35-execution
  check): **search summary only**. `arxiv.org` is on `sources.md` and refused
  this run.

**7. Verified / inferred / assumed.**
- **Verified:** 393 = 289 main + 104 diversity, 117 databases, 42 knowledge
  documents, `AI_SENTIMENT` = 22 in the release, and the absence of 465, 125,
  325 and 140 from every repository document. Also verified: both quality
  filters quoted above, "selected instances", the `_div` naming, and the
  repository's six commits, the last on 2026-07-08.
- **Search summary only, filed as inferred:** every paper-side count in the
  table (325, 140, 125, 155, 310, and `AI_SENTIMENT` = 22) and the phrase
  "final released benchmark". The 325 + 140 = 465 and 155 + 310 = 465 sums
  are internally consistent, which makes a garbled summary less likely. It is
  still not a read.
- **Inferred:** the single-function and multi-function counts for the release,
  derived from its 664 function occurrences (1.69 × 393) on the assumption
  that it has no more than the paper's handful of three-function tasks.
- **Inferred:** that the post-pipeline filters are the cause of the drop. Only
  the filters' existence and wording are verified. Their timing relative to
  the paper, and the number of instances each removed, are not stated
  anywhere read.
- **Assumed:** that 393 is the file's actual line count. It is what three
  repository documents say, and the file itself could not be counted.

---

### 2. The paper's headline accuracies fit 465, and as single-run scores three of the four cannot be produced on 393

**1. What it is.** *Execution accuracy* is the share of tasks on which a
system's query returns the same result table as the gold query. On a set of
*N* tasks it can only take the values *k*/*N*, and that makes it possible to
test which set a reported percentage was computed on. According to a search
summary, the paper's Table 1 gives **Claude Opus 4.6 70.3%, Claude Sonnet 4.6
69.0% and Gemini 3.1 Pro 67.1%**, which is where the abstract's "67-70%" comes
from. The best open-source model scores **58.1%**. Tested at one decimal place:

| Reported | On 465 | Nearest on 393 | Fits 393? |
|---|---|---|---|
| 70.3% | 327/465 = 70.32 | 276 → 70.23, 277 → 70.48 | **No** |
| 69.0% | 321/465 = 69.03 | 271 → 68.96 | Yes |
| 67.1% | 312/465 = 67.10 | 263 → 66.92, 264 → 67.18 | **No** |
| 58.1% | 270/465 = 58.06 | 228 → 58.02, 229 → 58.27 | **No** |

The dataset statistics that the summaries attribute to the paper behave the
same way, and they act as a control. "66.0%" of tasks combine two functions
(307/465; impossible on 393). "91.8%" return 20 rows or fewer (427/465;
impossible on 393). "2.2%" exceed 100 rows (10/465; impossible on 393). The
per-function figures for `AI_SENTIMENT`, 68.2% and 36.4%, are 15/22 and 8/22,
consistent with a 22-instance category that the release also has.

**So the answer to the lead's second question is 465**, on one condition:
that Table 1 reports a single run per model over the full set. If it
instead reports a mean over several runs, the denominator becomes a multiple of the
set size, and the test stops discriminating: 829/1179 = 70.3% on 393 × 3. One
search summary characterises the evaluation as single-run, but the paper
could not be read to confirm it.

**2. How long ago.** The paper was submitted **2026-07-07**, 78 days ago.

**3. How it relates to what has already been read.** It answers the question
the breadth pass left under **Assumed** in item 5: "that the paper's 67-70% was
computed on the 465-instance set. Nothing read says so either way." Something
now says so, arithmetically. #35 set the paper's figure against the Spider
2.0-Snow leaderboard's top entry of 96.70.

**4. What through-line it changes.** Everything this reader has been told
about AIFunc's difficulty describes the paper's set. **Any score produced on
the public release will not be comparable to it**, because it will be a score
on a different, smaller set, and there is no published mapping between the
two. The benchmark has in effect two versions under one name, and the paper
reports only the one that is not public.

**5. What to research next.**
- **Whether Table 1 of arXiv:2607.06229 reports a single run or a mean over
  several runs, and over how many instances.** The paper's evaluation-setup
  paragraph and the table caption answer it. It is the one assumption the
  arithmetic above rests on.
- **The per-function instance counts behind the paper's function-level
  accuracy table, set against the release's 227 / 153 / 148 / 66 / 48 / 22.**
  The counts are for `AI_CLASSIFY`, `AI_SIMILARITY`, `AI_FILTER`, `AI_AGG`,
  `AI_EXTRACT` and `AI_SENTIMENT`. `AI_SENTIMENT` already matches at 22. The
  other five differences locate the 72 by function, and would show whether the
  diversity set's loss of 36 fell on `AI_EXTRACT` and `AI_AGG`, the functions
  that set exists to cover.

**6. Source.**
- [arXiv:2607.06229](https://arxiv.org/html/2607.06229) (every reported
  percentage in this item): **search summary only**, from three separate
  searches. `arxiv.org` is on `sources.md` and refused this run.
- [`docs/dataset.md`](https://raw.githubusercontent.com/Leolty/Spider2-AIFunc/main/docs/dataset.md)
  for the release's denominators and function counts: **full page read**.

**7. Verified / inferred / assumed.**
- **Verified:** the arithmetic. Every *k*/465 and *k*/393 value in the table
  can be recomputed by the reader.
- **Search summary only, filed as inferred:** all eight percentages attributed
  to the paper and the model names attached to them. One earlier summary named
  the three proprietary models as Opus 4.6, Gemini 3.1 Pro and GPT-5.4. The
  one carrying the figures named Sonnet 4.6 instead of GPT-5.4. That
  disagreement is unresolved.
- **Inferred:** that the results were computed on 465. The inference is strong
  under the single-run assumption, because the figures are impossible on 393,
  and weak without it.
- **Assumed:** that Table 1 is a single run over the full set.

---

### 3. On the released 393 the same model could score anywhere from 65% to 83%, and only the authors can score it

**1. What it is.** Take the paper's figures as exact counts on 465 (item 2),
and assume the 393 released tasks are a subset of them. The released-set score
of the same system is then bounded by how it did on the 72 removed tasks:

| System (paper) | On 465 | On 393 if it got all 72 right | if it got all 72 wrong |
|---|---|---|---|
| Claude Opus 4.6 | 70.3% (327) | 64.9% (255) | 83.2% (327) |
| Gemini 3.1 Pro | 67.1% (312) | 61.1% (240) | 79.4% (312) |
| Best open-source | 58.1% (270) | 50.4% (198) | 68.7% (270) |

**Which way it most likely went is an inference from the filters' own
wording.** The instruction-clarity review removed instructions that did not
fully specify the expected result. Under exact-match scoring, a model is
likelier to miss those than to hit them, so removing them pushes the released
score up. The decorative-AI audit has no obvious direction. The released-set
figure for the top model is therefore more likely above 70.3% than below it,
by an unknown amount.

**Nobody outside the authors can find out.** The evaluation guide says so in
full: "Because the gold SQL is held out, scoring is not self-service. The
official submission process is still being finalized; for now, send us your
predictions and we will score them by hand." Submissions go by email to a
named author, as a JSONL of `id` and `pred_sql`. The same page adds that for
Spider 2.0-provided Snowflake accounts, "the AISQL access path for those
accounts is still pending". So a run needs a paid account of one's own, a
score needs the authors, and no leaderboard exists to publish the result.
Seventy-seven days after the last commit, the repository shows 0 issues, 0
pull requests, one fork with no push activity, and 2 stars.

**Background (out of window): the gold AIFunc starts from.** The pipeline
rewrote Spider2-Snow's gold SQL, and its main pass had "access to all gold
queries for ambiguity resolution". Jin et al., "Pervasive Annotation Errors
Break Text-to-SQL Benchmarks and Leaderboards" (arXiv:2601.08778, January
2026, PVLDB), report an expert-audited **annotation error rate of 62.8% for
Spider 2.0-Snow**, from a search summary. AIFunc's four-pass determinism check
verifies that a gold query returns the **same** result each time. Nothing
read says it verifies that the result is **correct**. This is the strongest
evidence found against the 67-70% as a difficulty measure, and it is
independent of the 465/393 question.

**2. How long ago.** The evaluation guide's hand-scoring and pending-access
text dates from **2026-07-07** (78 days ago), and has not changed since the
last commit on **2026-07-08**. The Jin et al. paper is background, from
January 2026.

**3. How it relates to what has already been read.** #35's item 2 called
AIFunc's 67-70% "the single best argument against" reading Spider 2.0-Snow's
**96.70** as solved. The gap between them was 26.4 points. Measured against
the bounds above, the same argument on the released set rests on a gap of
anywhere from **13.5** (96.70 − 83.2) to **31.8** points (96.70 − 64.9). #42
repeated the argument and called it unaudited. The breadth pass added that it
cannot be reproduced on the shared accounts.

**4. What through-line it changes.** **The counter-argument survives, but its
size is no longer known, and the likelier direction shrinks it.** Two
different system configurations on the same vendor's platform, one
text-to-SQL agent on Snow and a bare model on AIFunc, still produce a large
gap. What cannot be claimed any more is that the gap is about 27 points
wide. The honest wording is "somewhere between 13 and 32 points, measured by
the benchmark's authors on a set that is no longer public, and graded against
gold derived from a benchmark independently audited as mostly mis-annotated".

**5. What to research next.**
- **How many of the 289 released main instance IDs (`sf_bq###`) appear among
  the Spider 2.0-Snow examples that Jin et al. (arXiv:2601.08778) flagged as
  mis-annotated.** Use that paper's released annotations if they are on
  GitHub. A high overlap would mean AIFunc's gold inherits known source
  errors, and determinism checking would not have caught them.
- **Whether the "AISQL access path" for Spider 2.0-provided Snowflake accounts,
  "still pending" in `docs/evaluation.md`, has opened.** Watch the
  `xlang-ai/Spider2` News list and the `Leolty/Spider2-AIFunc` commits. That
  opening is the one event that would let anyone other than a paying account
  holder run the 393.

**6. Source.**
- [`docs/evaluation.md`](https://raw.githubusercontent.com/Leolty/Spider2-AIFunc/main/docs/evaluation.md)
  ("Submitting results" section): **full page read**, quoted verbatim.
- The [repository page](https://github.com/Leolty/Spider2-AIFunc),
  [issues](https://github.com/Leolty/Spider2-AIFunc/issues?q=is%3Aissue),
  [pull requests](https://github.com/Leolty/Spider2-AIFunc/pulls?q=is%3Apr) and
  [forks](https://github.com/Leolty/Spider2-AIFunc/forks): **full page read**.
- [`docs/generation.md`](https://raw.githubusercontent.com/Leolty/Spider2-AIFunc/main/docs/generation.md)
  for the main-pass gold access: **full page read**.
- The [`xlang-ai/Spider2` README](https://raw.githubusercontent.com/xlang-ai/Spider2/main/README.md)
  (News still ends 2026-08-12, and has no AIFunc or AISQL mention): **full
  page read**. `github.com` is on `sources.md`.
- [arXiv:2601.08778](https://arxiv.org/abs/2601.08778), background: **search
  summary only**, from open search.

**7. Verified / inferred / assumed.**
- **Verified:** the hand-scoring and pending-access quotes, the submission
  format, the repository's activity counts, and that the Spider 2.0 README has
  not changed.
- **Verified arithmetic, on inferred inputs:** every bound in the table. The
  inputs are the paper's figures from item 2, which are search summary only.
- **Inferred:** that removing under-specified instructions raises the score,
  and therefore that the released-set score is more likely above 70.3% than
  below it.
- **Search summary only, filed as inferred:** the 62.8% error rate and its
  scope.
- **Assumed:** that the 393 are a subset of the 465 with their instructions
  unchanged. The clarity review says "refined **or** dropped", so some
  released instructions may differ from the ones the paper scored, and to that
  extent even the overlapping tasks are not the same test.

---

### What was dropped and why

- **Pith (`pith.science/paper/2607.06229`).** It surfaced in every search as a
  rendering of the paper. It was not fetched, because it is a third-party
  reader of the refused arXiv text, and reading the paper through it would
  work around the refusal rather than record it.
- **Contra Collective's "GPT-5.5 vs Claude Opus 4.8 vs Gemini 3.5 Pro: Text to
  SQL on BIRD and Spider 2.0 Tested (July 2026)".** In window and on-subject
  by title. The host refused, and the search summary showed nothing about
  AIFunc.
- **ESQ-Bench (arXiv:2608.23569) and "Agentic-SQL Revisited"
  (arXiv:2608.15389).** Both are in window (August 2026) and surfaced by the
  search for critics. Neither is about AIFunc in its summary, and both were
  readable only as summaries. They belong to `agent-efficacy` rather than to
  this lead.
- **"Pervasive Annotation Errors Break Text-to-SQL Benchmarks and
  Leaderboards" (arXiv:2601.08778).** Out of window (January 2026), so it is
  used only as Background in item 3.
- **The SemCEB, Larch and Cortex engine papers from the breadth pass.** Not
  part of this lead. They are the cost angle, not the benchmark.

### What was searched for and not found

- **Any issue, pull request or active fork on `Leolty/Spider2-AIFunc`.** There
  are 0 issues (open or closed) and 0 pull requests. The repository shows one
  fork, and the forks view lists none with push activity. Nobody has publicly
  asked about the 465/393 difference.
- **Any commit after 2026-07-08.** None. The repository has six commits in
  total, all dated 2026-07-07 or 2026-07-08.
- **A second arXiv version of 2607.06229 that reconciles the counts.** Search
  shows v1 only. This is from search summaries, since `arxiv.org` refused this
  run.
- **Any mention of 465, 125, 325, 140 or the paper's accuracy figures in any
  repository document.** None, across the README, `DATA.md`, `dataset.md`,
  `generation.md` and `evaluation.md`.
- **Whether the paper describes the decorative-AI audit or the
  instruction-clarity review.** A search on the audit's own wording returned
  only the paper's generic construction description. Not established either
  way.
- **The Hugging Face copy's row count.** `huggingface.co` refused, and search
  did not surface the dataset page.
- **Forward citations of arXiv:2607.06229.** A search on the identifier
  returned the paper, this repository's own issues, and unrelated documents.
  No citing paper and no outside score was found.
- **A published critic of AIFunc specifically.** None. The nearest is the
  Spider 2.0-Snow annotation audit, used as Background.
- **Any Spider 2.0 notice of databases being removed from Spider2-Snow**, which
  would have explained the eight missing databases. The README News list has
  none, and has no AIFunc or AISQL mention at all.

## Level 2 - AIFunc tasks built on Spider 2.0-Snow examples reported as mis-annotated

**No one has published which Spider 2.0-Snow examples are wrong, so the
question cannot be answered ID by ID. It can be bounded. The audit behind
"62.8%" covered only the 121 examples whose gold SQL is public. 84 of AIFunc's
393 released tasks (58 main, 26 diversity) are built on 66 of those examples.
The other 309 are built on gold that no one outside the two author teams has
examined. AIFunc built on Spider 2.0's private gold, and its documentation
describes no check that the gold is correct. Its paper counts annotation
issues at 1.5%, but it looked for them only among the 30 tasks that every
strong model failed. How much of the 67-70% comes from inherited bad gold
cannot be measured from public material.**

The window is 90 days, so items must be dated on or after **2026-06-25**.
There are three in-window anchors:

- AIFunc's release, on **2026-07-07**.
- The audit repository's two in-window commits, on **2026-07-08** and
  **2026-08-27**. Neither touches Spider 2.0-Snow.
- One Spider 2.0 issue on an AIFunc base task, on **2026-09-07**.

The audit itself (Jin et al., arXiv:2601.08778, January 2026) is
**Background**. **Spider 2.0-Snow's gold has not moved in the window.** The
last commit under `spider2-snow/` is dated 2025-10-30.

**How this level could read its sources.** GitHub was read in full on
`github.com` and `raw.githubusercontent.com`. The whole crossing below rests
on those reads, on the released AIFunc task file, and on Spider2-Snow's task
file. Both papers could be seen only through search summaries:
`arxiv.org` and `www.vldb.org` refused this run, and so did `dev.to`. Each
item says which claims rest on summaries.

---

### 1. The 62.8% comes from an audit of 121 examples, and 84 of AIFunc's 393 tasks are built on 66 of them

**1. What it is.** Spider 2.0-Snow publishes gold SQL for only part of its
547 examples. The rest is held back. According to a search summary of the
audit paper, "among 121 examples with released gold queries, the Spider 2.0
team updated user questions in 71 examples". The same summary says the update
"reduces the error rate from 66.1% to 62.8%", and that "errors in only 3.3% of
examples are fully resolved". Those three figures are exactly 80/121, 76/121
and 4/121. **So 62.8% means 76 of the 121 examples with public gold. It is not
a rate measured over all 547.**

The authors' repository holds the SQL they audited, in
`SAR-Agent/spider2/sql/`. That copy includes `sf001.sql`, which the current
Spider 2.0 gold folder no longer has: it returns 404 there. This is the likely
reason the audit counts 121 while the current folder holds 120: the session
counted `spider2-snow/evaluation_suite/gold/sql` in a fresh clone of
`xlang-ai/Spider2` on 2026-09-23 and found exactly 120 `.sql` files.

**The crossing.** Every AIFunc task that shares an ID with a Spider 2.0-Snow
example whose gold is public:

| | Released AIFunc tasks | Built on an audited example | Share |
|---|---|---|---|
| Main | 289 | **58** | 20.1% |
| Diversity (`_div`) | 104 | **26** (18 share their base with a main task, and 8 have no main task) | 25.0% |
| **Total** | **393** | **84**, on **66** distinct audited examples | **21.4%** |

120 of Spider 2.0-Snow's 547 examples have public gold, which is 21.9%. The
table's counts were re-computed by script against that clone and match
exactly: 84 tasks, 58 main and 26 diversity, on 66 distinct examples.
AIFunc's main set sits on audited examples at almost the same rate (20.1%).
Nothing suggests AIFunc chose audited examples more or less often than chance.
AIFunc uses 66 of the audit's 121 examples.

**The 66 audited examples AIFunc is built on:**
- **Main (58):**
  - `sf_bq` 017, 028, 033, 037, 052, 057, 099, 128, 150, 158, 167, 176,
    209, 216, 219, 222, 223, 224, 233, 236, 246, 248, 250, 252, 263, 264,
    265, 271, 291, 295, 321, 334, 345, 346, 347, 359, 377, 421 and 429.
  - `sf_ga001`.
  - `sf_local` 004, 009, 015, 019, 022, 026, 038, 039, 056, 075, 195, 199,
    210, 263, 269, 300, 309 and 360.
- **Diversity variants of those (18):**
  - `sf_bq` 028, 216, 252, 295, 345, 346, 347, 359 and 377.
  - `sf_local` 015, 019, 026, 038, 056, 075, 195, 199 and 269.
- **Diversity only (8):**
  - `sf_bq` 043, 072, 091, 104, 294 and 455.
  - `sf_local` 311 and 336.

**No file anywhere says which of the 66 are among the 76 found wrong.** Here
is what the audit repository holds:

- `data/` holds only BIRD corrections (`arcwise_plat_*_with_diff.json`).
- `SAR-Agent/spider2/` holds the audit's inputs: gold SQL and a task file with
  four fields (`instance_id`, `instruction`, `db_id` and
  `external_knowledge`). It has no verdict field.
- `materials/supplementary_material.pdf` (added 2025-11-01) could not be read
  as text in this run.

Suppose the 62.8% held evenly across the audited examples. Then about 41 of
the 66 would be wrong, carrying about 53 of the 84 tasks. That is an
expectation, not a count.

**2. How long ago.** AIFunc's release was published **2026-07-07**, 78 days
ago. The audit repository's newest commit is dated **2026-08-27**, 27 days
ago. It merged pull request #11, "Legacy corrections for release", which
changes seven BIRD questions and nothing else. The only other in-window commit
adds a licence, on 2026-07-08. The audit paper and its Spider 2.0-Snow data
("ininit data", 2026-01-19) are **Background**.

**3. How it relates to what has already been read.** It serves
**`benchmarks-depth`**. Level 1's item 3 filed Jin et al. as "an
expert-audited **annotation error rate of 62.8% for Spider 2.0-Snow**". This
item narrows that figure to its actual scope, the 121 examples with public
gold, and lists which AIFunc tasks fall inside it.

**4. What through-line it changes.** It corrects Level 1's wording. The phrase
"gold derived from a benchmark independently audited as mostly mis-annotated"
overstates the audit's reach:

- **About 21% of AIFunc stands on audited examples.** The audit found most of
  those wrong.
- **About 79% stands on examples no outsider has audited.** Applying 62.8% to
  them extrapolates from a sample that the Spider 2.0 team chose to publish.
  Nothing read says how it chose, or that the choice was random.

**5. What to research next.**
- **Text extraction of `materials/supplementary_material.pdf` in
  `uiuc-kang-lab/text_to_sql_benchmarks` (1.1 MB, committed 2025-11-01).** Does
  it list Spider 2.0-Snow examples by `instance_id` with an error category? If
  it does, cross the list with the 66 audited examples above. This needs an
  engineer's download, because page fetches return it as binary.
- **The instance IDs behind the worked examples in arXiv:2601.08778's Spider
  2.0-Snow error-pattern section.** These are the `TO_TIMESTAMP(end_date)` case
  and the JOIN/FLATTEN row-count case. They are the only per-example verdicts
  the paper is known to print. Check each against the 66.

**6. Source.** Open search found the audit repository; `github.com` is on
`sources.md` for line B, and this repository was not.
- [`uiuc-kang-lab/text_to_sql_benchmarks`](https://github.com/uiuc-kang-lab/text_to_sql_benchmarks):
  **full page read** of the README,
  [commits](https://github.com/uiuc-kang-lab/text_to_sql_benchmarks/commits/main),
  [pull request #11](https://github.com/uiuc-kang-lab/text_to_sql_benchmarks/pull/11),
  and the `data/`, `materials/`, `SAR-Agent/` and `SAR-Agent/spider2/`
  listings. The first lines of
  [`SAR-Agent/spider2/spider2-snow.jsonl`](https://raw.githubusercontent.com/uiuc-kang-lab/text_to_sql_benchmarks/main/SAR-Agent/spider2/spider2-snow.jsonl)
  were read, and the file was truncated. `supplementary_material.pdf`:
  **not readable**.
- [Spider 2.0-Snow `gold/sql`](https://github.com/xlang-ai/Spider2/tree/main/spider2-snow/evaluation_suite/gold/sql):
  **full page read**. The page truncates after 100 files, at `sf_local157`.
  Every AIFunc ID sorting after that point (34 main and 4 diversity-only) was
  probed as a raw file, together with controls known to be present and
  absent. Each of the 10 hits was confirmed present in the audit copy.
- The released AIFunc task file and Spider2-Snow's task file: **read in full**.
- [arXiv:2601.08778](https://arxiv.org/abs/2601.08778) (121, 71, 66.1%, 62.8%
  and 3.3%): **search summary only**. `arxiv.org` is on `sources.md` and
  refused this run, and `www.vldb.org` (CIDR version) refused too.

**7. Verified / inferred / assumed.**
- **Verified:**
  - The 58 / 26 / 84 / 66 counts and every ID listed above. They come from the
    released task IDs crossed with the gold files, each found in a directory
    listing or by a raw-file probe.
  - The contents of `data/` and `SAR-Agent/spider2/`.
  - That `sf001.sql` is in the audit copy and absent from Spider 2.0.
  - That the two in-window commits are BIRD-only and a licence.
- **Search summary only, filed as inferred:** the 121 denominator and the three
  percentages. The exact k/121 fit makes a garbled summary unlikely.
- **Inferred:** that the audit covered all 121 examples, which rests on the
  arithmetic fit. Also inferred: the ~41 and ~53 expectations.
- **Assumed:** that an AIFunc task with the same `instance_id` was built from
  that Snow example's gold. The ID convention implies it, and `generation.md`
  does not state it.

---

### 2. AIFunc built on the private gold and describes no check of it, and its paper counts annotation issues only where every strong model failed

**1. What it is.** The lead's second question has a documentary answer.
**AIFunc took its gold from Spider 2.0.** `docs/generation.md`, read in full,
says of its source tasks: "In our build, these came from Spider 2.0 gold files,
which are access-controlled and not redistributed here." It also says: "these
inputs were derived from the Spider 2.0 gold files, which are not public."

Each source task carries two fields that matter here:
- `gold_sqls`, one or more "traditional SQL gold queries".
- `execution_results`, "the gold execution output, used as evidence during
  generation".

The main pass runs in `--mode multi`, which "lets the agent see all gold SQLs
for one instruction and resolve ambiguity".

After generation, the pipeline checks two things. The first is determinism.
The second is the instruction-quality round quoted in Level 1: clarity, and
whether the AI function is decorative. **No sentence in the file says the
Spider 2.0 gold was checked for correctness, re-annotated, or audited.** So
AIFunc inherited the whole 547-example gold. That includes the 426 examples
whose gold is not public and which the audit never saw.

**The paper's own count, according to search summaries of arXiv:2607.06229:**
- The pipeline started "from 513 Spider2-Snow instances". It "transforms the
  target SQL ... and the corresponding instruction is revised to match".
- Its error analysis defines **S1** as the instances where all three strong
  proprietary models fail. It names them as Claude Opus 4.6, Gemini 3.1 Pro
  and GPT-5.4.
- "7 of the 30 S1 instances (23%) show signs of annotation issues (C5), where
  the gold query encodes constraints absent from the instruction or admits
  multiple valid answers."
- This is put at **1.5% of the benchmark**, which is 7/465.

**Why 1.5% is a floor rather than an estimate** (inferred):
- It was counted only in S1. A wrong gold fails every model that answers the
  question correctly. A model that reproduces the gold's own mistake passes.
  So wrong-gold tasks can sit in S2 as well, where at least one strong model
  succeeds, and no C5 count for S2 was found.
- C5's definition covers under-specification and multiple valid answers. It
  does not name a gold that is precisely specified but wrong about the data.
  That is the audit's schema and domain-knowledge category.

**Why the true share could still sit well below 62.8%** (inferred): the
pipeline rewrites each instruction to match its gold SQL. When the base
example's question and SQL disagree, which is the audit's commonest pattern,
the rewrite can absorb the disagreement into the instruction instead of
passing it on as a wrong answer. Item 3 is one visible case.

**2. How long ago.** **2026-07-07**, 78 days ago, for both the paper and
`generation.md`. The repository has not changed since 2026-07-08.

**3. How it relates to what has already been read.** Level 1's item 1 read
`generation.md` for its two filters. Level 1's item 3 said the determinism
check "verifies that a gold query returns the **same** result each time" and
not that it is **correct**. This item confirms that from the document's full
text and adds the authors' own count. It also bears on Level 1's unresolved
model-name disagreement: this summary names **GPT-5.4** among the three
strong proprietary models in the error analysis. It does not say whether
Sonnet 4.6 is in Table 1.

**4. What through-line it changes.** It changes #35's "single best argument
against" reading Spider 2.0-Snow's 96.70 as solved. **The benchmark's own
authors attribute part of their hardest failures to the benchmark.** Their
count is 1.5%. Outsiders cannot recount it, because the gold is hidden twice:
AIFunc holds back its own gold, and AIFunc's gold was built on Spider 2.0's
private gold. So the inherited share of the 67-70% lies somewhere between the
authors' 1.5% floor and a ceiling nobody has measured.

**5. What to research next.**
- **The instance IDs of the seven C5 instances in arXiv:2607.06229's error
  analysis**, if the appendix lists them. Check how many fall among the 66
  audited examples in item 1, and how many among the 72 removed before release.
- **Whether arXiv:2607.06229 cites Jin et al. (arXiv:2601.08778) anywhere, and
  whether its S2 stratum reports a C5 count.** Only S1's count appears in the
  summaries.

**6. Source.**
- [`docs/generation.md`](https://raw.githubusercontent.com/Leolty/Spider2-AIFunc/main/docs/generation.md):
  **full page read**, fetched twice. The second fetch was for Stage 1 and the
  validation section verbatim.
- [arXiv:2607.06229](https://arxiv.org/html/2607.06229v1) (513, S1, the
  models, 7 of 30, C5, 1.5%): **search summary only**, from two searches.
  `arxiv.org` is on `sources.md` and refused this run.

**7. Verified / inferred / assumed.**
- **Verified:** every `generation.md` quotation, and that no sentence in the
  file describes checking the base gold for correctness.
- **Search summary only, filed as inferred:** 513, the S1 definition and its
  three models, 7 of 30, the C5 definition, and 1.5%. The 7/465 = 1.505% fit
  supports the summary.
- **Inferred:** that 1.5% is a floor, and that instruction rewriting can absorb
  mismatches between question and SQL.
- **Assumed:** that the "Spider 2.0 gold files" AIFunc used are the
  full-benchmark gold and not only the public subset. "Access-controlled" and
  "not public" point to the full set, and 289 main tasks cannot come from
  about 120 public examples.

---

### 3. The one in-window public report on an AIFunc base task: Spider 2.0 issue #216 on `local029`, which AIFunc's rewrite had already re-specified

**1. What it is.** On `xlang-ai/Spider2`, issue #216 (FengMaXu,
**2026-09-07**) reports that the Spider2-Lite gold SQL for `local029`
inflates its counts. It counts `COUNT(o.order_id)` after joining
`olist_order_payments`. That counts payment rows rather than delivered orders,
and the issue proposes `COUNT(DISTINCT o.order_id)`.

The Lite gold SQL does exactly that: `COUNT(o.order_id) AS
Total_Orders_By_Customers, AVG(p.payment_value) ...` over the payment join.
Its average is also per payment row.

Snow's `sf_local029` asks the same question. It asks for the "top three
customers ... who have the highest number of delivered orders", with "the
average payment value, city, and state". **AIFunc builds two tasks on it**:
`sf_local029` (`AI_SENTIMENT`) and `sf_local029_div` (`AI_AGG` and
`AI_SENTIMENT`).

**AIFunc's instruction had already fixed half of the complaint in wording.**
It asks for "the average total payment per order ... (calculated by first
summing all payment values for each order, then averaging across orders)". The
other half, "the count of delivered orders", cannot be checked, because
AIFunc's gold is held out.

Three more facts bound the case:
- **`sf_local029` is not among the 121 audited examples**, so the audit could
  not have covered it. The only in-window error report on an AIFunc base task
  falls outside the audit's reach.
- **Snow's hidden gold is not the Lite query.** Snow's gold *result* is
  published: `exec_result/` holds result files for every example, including
  those with hidden SQL. The file for this example, `sf_local029_a.csv`, has
  the columns `customer_unique_id`, `delivered_orders`, `avg_payment_value`,
  `customer_city` and `customer_state`. The Lite query returns neither the ID
  nor the count. Whether Snow's 15, 9 and 7 delivered orders are inflated
  cannot be told without the database.
- **No maintainer has responded.** The same is true of **#203**
  (2026-07-22), which reports that `sf012`'s gold executes to a different
  result from its CSV. `sf012` is not an AIFunc base task.

**Background (out of window).**
- **Issue #195** (2026-05-25) says `haversine_formula.md` contradicts
  `sf_local010`'s gold, which counts directional city pairs. It lists
  `sf_local009` only as "related". `sf_local009` is an AIFunc main task and one
  of the 66 audited examples. AIFunc's version asks for a maximum route
  distance, which does not depend on direction.
- **Spider 2.0's own 2025 fixes touched AIFunc base tasks:** "fix sf_bq291
  semantic issue" (2025-07-17), "update local029 eval" (2025-07-23) and "fix
  sf_bq294 eval" (2025-08-06).

**2. How long ago.** **2026-09-07**, 16 days ago. #203 is dated
**2026-07-22**, 63 days ago.

**3. How it relates to what has already been read.** Level 1 found no issues
at all on AIFunc's own repository. This is the first outside report anywhere
that lands on an AIFunc base task, and it sits on the parent benchmark's
tracker.

**4. What through-line it changes.** **None, on its own: it is one case, not a
rate.** It does show both mechanisms from item 2 at work on a single task:
- **The error was real.** It is verified in Lite's gold, and inferred for
  Snow's hidden gold.
- **AIFunc's rewrite absorbed half of it.** The ambiguous average is now
  spelled out in the instruction.
- **The other half is unknowable.** The count sits in held-out gold.

**5. What to research next.**
- **Recount delivered orders with `COUNT(DISTINCT order_id)` for the top three
  `customer_unique_id` values in Spider2-Lite's downloadable
  `BRAZILIAN_E_COMMERCE` SQLite database.** Compare the recount with the 15, 9
  and 7 in Snow's `sf_local029_a.csv`. That shows whether Snow's gold, and
  therefore AIFunc's base gold, inflates the count. It needs an engineer's
  spike.
- **Whether #216 or #195 gets a maintainer response, or a gold commit lands
  under `spider2-snow/`.** There has been none since 2025-10-30. If one lands,
  check whether `Leolty/Spider2-AIFunc` follows it.

**6. Source.** Open search, then the Spider 2.0 issue tracker. `github.com` is
on `sources.md` for line B.
- [Issue #216](https://github.com/xlang-ai/Spider2/issues/216),
  [issue #203](https://github.com/xlang-ai/Spider2/issues/203) and
  [issue #195](https://github.com/xlang-ai/Spider2/issues/195): **full page
  read**. #216 is written in Chinese and was read through a translating fetch.
  #195 was fetched twice, the second time for its `sf_local009` wording
  verbatim.
- [Lite `local029.sql`](https://raw.githubusercontent.com/xlang-ai/Spider2/main/spider2-lite/evaluation_suite/gold/sql/local029.sql)
  and [Snow `sf_local029_a.csv`](https://raw.githubusercontent.com/xlang-ai/Spider2/main/spider2-snow/evaluation_suite/gold/exec_result/sf_local029_a.csv):
  **full page read**.
- [`spider2-snow` commit history](https://github.com/xlang-ai/Spider2/commits/main/spider2-snow):
  **full page read**.
- AIFunc's and Snow's `sf_local029` and `sf_local009` instructions: **read in
  full** from the task files.

**7. Verified / inferred / assumed.**
- **Verified:**
  - The Lite gold's payment-row count.
  - Both instructions, and the published Snow result's columns and values.
  - That `sf_local029` has no public Snow gold SQL.
  - That no maintainer has responded to #216, #203 or #195.
  - That no `spider2-snow` commit has landed since 2025-10-30.
- **Inferred:** that Snow's hidden `sf_local029` gold shares the Lite flaw.
  Same question, same data, and a result file that shows only that the
  query differs.
- **Inferred:** that AIFunc's payment wording was written in response to this
  ambiguity and is not a coincidence.
- **Assumed:** that the maintainers' silence reflects inactivity and not a
  private fix. No gold commit has landed since 2025-10-30.

---

### What was dropped and why

- **Spider2-dbt issues #223 to #230, all opened 2026-09-20.** They are a burst
  of detailed gold and evaluator critiques inside the window. One is titled
  "chinook001's gold database does not contain the three tables it is graded
  on". They concern Spider2-dbt, not Snow, and touch no AIFunc base task.
- **Pull request #11 on the audit repository (2026-08-27).** It is in window,
  but BIRD-only. It is mentioned in item 1 as the audit repository's latest
  activity.
- **"Half the answer keys in text-to-SQL benchmarks are wrong" (DEV Community,
  2026-07-10, per a search summary), and "Your text-to-SQL model isn't as wrong
  as your benchmark says".** Both are secondary. The first restates Jin et al.'s
  52.8% and 62.8%. `dev.to` refused this run.
- **The `sqlsure.ai` post on wrong BIRD gold.** It is about BIRD, not Snow.
- **"Human-Level Text-to-SQL via Reinforcement Learning on Verified Data"
  (arXiv:2603.20004, March 2026).** It is out of window. The title suggests a
  verified set, but no summary showed Spider 2.0-Snow labels per example.
- **Pith's rendering of arXiv:2607.06229.** It is a third-party reader of a
  refused host, so it was not fetched, as in Level 1.

### What was searched for and not found

- **A list of which Spider 2.0-Snow examples Jin et al. found wrong, by ID.**
  None is in the audit repository's README, `data/` or `SAR-Agent/spider2/`.
  The supplementary PDF could not be read as text. `arxiv.org` and
  `www.vldb.org` both refused.
- **Any third party's corrected, re-annotated or "verified" release of
  Spider 2.0-Snow.** Three differently worded searches returned only the
  original repository, its forks, and the audit paper.
- **Any change to Spider 2.0-Snow's gold in the window.** There has been no
  commit under `spider2-snow/` since 2025-10-30. The README News list, per
  Level 1, still ends on 2026-08-12.
- **Any Spider 2.0-Snow work in the audit repository's in-window commits.**
  None. The two in-window commits are a licence and BIRD corrections.
- **Anyone connecting AIFunc to the annotation audit.** A search on both names
  returned the two papers and this repository's own issues.
- **Whether AIFunc's paper cites Jin et al.** Not established from the
  summaries.
- **Which 34 Spider 2.0-Snow examples were left out before AIFunc's pipeline
  started (547 − 513)**, and whether any of them are audited examples. Not
  found.
- **The IDs of AIFunc's seven C5 instances.** Not reachable.
