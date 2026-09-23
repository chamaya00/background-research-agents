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
