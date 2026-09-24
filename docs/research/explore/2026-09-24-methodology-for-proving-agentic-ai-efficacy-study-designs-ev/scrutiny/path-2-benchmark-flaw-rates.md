# Path 2 - How often an agent benchmark is broken, measured

**Produced by a research subagent in auto-breadth mode**
([`docs/reader/auto-breadth.md`](../../../reader/auto-breadth.md)). It is not a
brief on an adopted topic, and nothing in it is a profile change. It descends
from item 2 of the breadth pass ([`0-breadth.md`](0-breadth.md)), lead L3. The
exploration's index is [`README.md`](README.md).

## Level 1 - The per-benchmark flaw rates behind the AISI transcript scanners

**Figure 3 can be read as numbers after all. They are not in the paper's text,
the PDF or the source, but they are in the authors' own released plot files.
The human-confirmed flaws cluster in one benchmark:**
- **CORE-Bench:** about **29-30% of test transcripts** have a confirmed
  violation in each of three flaw types (ground-truth access, guessing, answer
  format).
- **SWE-bench Verified:** **20.2%** of transcripts have confirmed ground-truth
  access.
- **Every other cell** is **8% or less**, and most are zero.

**The scanners' own flag rates are a poor stand-in for the confirmed rate, and
they miss in both directions:**
- **CORE-Bench, tool failure:** **88.9%** flagged, **0%** confirmed.
- **Tau2-Retail, ground-truth access:** **39.9%** flagged, **0%** confirmed.
- **CORE-Bench, ground-truth access:** humans confirmed *more* (30.0%) than
  the scanners flagged (25.6%).

**Every rate is a share of transcripts, not of tasks.** The confirmed rates
come with no confidence interval anywhere public.

**None of the five benchmarks' maintainers has responded to the paper.** Its
Inspect Evals ports did change inside the window, in the flaw class the paper
calls tool failure, without citing it.

**Window.** The window is 90 days, so items are dated on or after
**2026-06-26**. The in-window anchors are:
- the paper, **2026-07-29**;
- its code repository's final commits, which added the plot files,
  **2026-06-29 and 2026-06-30**;
- Inspect Evals releases on **2026-07-02, 07-23, 08-20 and 09-17**.

The human-label files on Hugging Face show as last changed "5 months ago",
which puts them before the window. They are **Background**: data the in-window
paper rests on.

**Terms used below** (the Knowledge rule `outside-analytics-stacks` is *new*,
so tools outside Meta are explained once):
- **Inspect** is the UK AI Security Institute's open-source framework for
  running model evaluations.
- **Inspect Evals** is its community collection of benchmark implementations,
  or "ports".
- **Inspect Scout** is the add-on that runs "scanners" (LLM prompts) over saved
  agent transcripts.
- **Hugging Face** is the public host where the labelled data sits.

**The benchmarks:**
- **CORE-Bench:** reproduce a published paper's results from its code.
- **SWE-bench Verified:** fix real GitHub issues.
- **KernelBench:** write fast GPU kernels.
- **CVE-Bench:** exploit real web-application vulnerabilities.
- **Terminal-Bench 2.0:** command-line tasks.
- **Tau2-Retail:** a customer-service conversation with a simulated user.

---

### 1. Figure 3 as numbers: confirmed flaw rates per benchmark and flaw type

**1. What it is.** The paper is Mohl, Gardner-Challis, Dubois, Coppock and five
others, arXiv:2607.27518. Its authors are at Arcadia Impact, the UK AI Security
Institute, MARS and Generality Labs. It plots, per benchmark and flaw type:
- the share of transcripts the scanners flagged;
- the share human reviewers confirmed.

**How the confirmed rate was estimated.** Reviewers did not grade every
transcript. The paper says: "We therefore stratified transcripts by benchmark
and scanner flag status … A target of 25 scanner-positive and 25
scanner-negative samples per benchmark was used, using a threshold of ≥2."
On the paper's 0-3 scale, 2 is "Clear" and 3 is "Impactful". The confirmed
rate is then re-weighted to the full population. The analysis notebook calls
this inverse-probability weighting (IPW): each sampled transcript counts for
"N_population / n_validated" of its stratum.

**The source of the numbers.** The paper's repository commits the plot as a
vector file,
`analysis/results/paper_figures/combined/combined_test_empirical/violation_rates_by_benchmark_max.svg`.
Its legend reads "composite flag rate (max across scanners)" and
"human-confirmed (IPW-adj.)", which matches Figure 3's caption word for word.

Converting each marker's pixel position back through the y-axis ticks gives
the table below. The ticks sit at 0.0 = y 265.937 and 1.0 = y 22.318, so a
value is (265.937 − y) / 243.619. The legend fixes the colours: `#4477aa`
answer format, `#aa3377` ground-truth access, `#66ccee` guessing, `#ccbb44`
tool failure.

**Test set.** Each cell gives the scanner flag rate with its 95% CI, then the
**human-confirmed** rate.

| Benchmark (test transcripts) | Ground-truth access | Tool failure | Guessing | Answer-format ambiguity |
|---|---|---|---|---|
| CORE-Bench (90) | 25.6% [16.7, 35.6] → **30.0%** | 88.9% [82.2, 94.4] → **0.0%** | 44.9% [38.1, 52.3] → **28.5%** | 27.8% [18.9, 37.8] → **28.6%** |
| SWE-bench Verified (401) | 33.9% [29.4, 38.9] → **20.2%** | 9.5% [6.7, 12.5] → **1.7%** | not scanned on test | 19.0% [15.0, 22.7] → **0.7%** |
| KernelBench (96) | 0.0% [0.0, 0.0] → **0.0%** | 6.3% [2.1, 11.5] → **8.0%** | not scanned | 25.0% [16.7, 34.4] → **0.0%** |
| CVE-Bench (80) | 12.5% [5.0, 21.3] → **1.3%** | 1.3% [0.0, 3.8] → **0.0%** | 5.0% [1.3, 10.0] → **2.5%** | 8.8% [3.8, 15.0] → **5.0%** |
| Tau2-Retail (228) | 39.9% [33.8, 46.1] → **0.0%** | 18.9% [13.6, 24.1] → **0.0%** | not plotted | 6.6% [3.5, 10.1] → **0.0%** |

**Terminal-Bench 2.0 is not in the test set.** Table 3 of the paper lists it
as development-only, with 85 GPT-5.4 transcripts. Its numbers come from the
development twin of the same file (`combined_dev_empirical/…_max.svg`, where
0.0 = y 265.011 and 1.0 = y 22.318):

| Benchmark (dev transcripts) | Ground-truth access | Tool failure | Guessing | Answer-format ambiguity |
|---|---|---|---|---|
| Terminal-Bench 2.0 (85) | 8.2% [2.4, 15.3] → **2.4%** | 27.1% [17.6, 36.5] → **4.7%** | 8.2% [2.4, 14.1] → no human mark | 41.2% [30.6, 51.8] → **11.9%** |
| CORE-Bench (90) | 35.6% [22.2, 48.9] → **46.7%** | 71.1% [55.6, 84.4] → **13.3%** | 42.2% [26.7, 55.6] → **22.2%** | 42.2% [28.9, 57.8] → **8.9%** |
| SWE-bench Verified (100) | 23.0% [15.0, 31.0] → **9.0%** | 5.0% [1.0, 10.0] → no human mark | 2.0% [0.0, 6.0] → no human mark | 33.0% [24.0, 43.0] → **4.0%** |

The same development plot has MLE-bench and MLRC-bench at 0% confirmed on both
of their criteria.

**This reconciles the paper's "five widely used benchmarks".** Five benchmarks
have a confirmed rate above zero: CORE-Bench, SWE-bench Verified, KernelBench
and CVE-Bench on the test set, and Terminal-Bench 2.0 on the development set.
Tau2-Retail, MLE-bench and MLRC-bench are zero everywhere they are plotted.

**The denominators check.** Every flag rate is an exact *k*/*n* on the
transcript counts:
- Tau2-Retail: 91/228, 43/228 and 15/228.
- CVE-Bench: 10/80, 7/80, 4/80 and 1/80.
- KernelBench: 24/96 and 6/96.
- CORE-Bench: 23/90, 25/90 and 80/90.
- SWE-bench Verified: 136/401, 76/401 and 38/401. That is 401 test plus 100
  development transcripts, which matches Table 3's total of 501.

One cell does not fit its benchmark's 90: CORE-Bench guessing on the test set
fits 79/176. The confirmed rates are weighted, so they are not *k*/*n*.

> **Driver's check** (2026-09-24, by hand, because this runner has no shell for
> scripts). The driver re-fetched the test SVG and read the marker
> coordinates itself. The circle markers for ground-truth access
> (`#aa3377`) sit at y = 203.679, 235.485, 265.937, 183.313 and 168.703.
> Through (265.936975 − y) / 243.61885 they give 25.6%, 12.5%, 0.0%, 33.9% and
> 39.9%, which are the **flag** rates above. The **human-confirmed** markers are
> the X-shaped markers, one definition per colour:
> - **Ground-truth access** (y = 192.743, 262.892, 265.937, 216.849, 265.937):
>   **30.04%**, **1.25%**, 0, **20.15%**, 0.
> - **Answer format:** 28.58%, 5.00%, 0, 0.75%, 0.
> - **Guessing:** 28.55%, 2.50%.
> - **Tool failure:** 0, 0, **8.00%**, 1.75%, 0.
>
> Every cell in the test table reproduces. The one rounding difference is
> SWE-bench Verified ground-truth access: **20.15%** exactly (49.088 /
> 243.619), shown above as 20.2%. Every flag rate's *k*/*n* was checked too:
> 136/401 = 33.9%, 76/401 = 19.0%, 38/401 = 9.5%, 91/228 = 39.9%,
> 43/228 = 18.9%, 15/228 = 6.6%, 23/90 = 25.6%, 25/90 = 27.8%, 80/90 = 88.9%,
> 79/176 = 44.9%. The development-set table was **not** re-checked.

**What the paper's text says about the cells that stand out:**
- **CORE-Bench tool failure** is flagged at 89% and confirmed at 0%. The paper
  explains why: "Environment configuration is an intended component of
  CORE-Bench, so this is not necessarily invalidating."
- **CORE-Bench ground-truth access:** answers were "frequently exposed in
  plotting code or results files".
- **CORE-Bench guessing:** labels, axes or colours "come from a small and
  easily guessable set".
- **SWE-bench Verified ground-truth access** has two sources: an issue that
  "described the gold patch verbatim", and "models accessing upstream git
  history including human generated patches for the intended issue".
- **CVE-Bench:** the scanners "mis-flagged almost all CVE-Bench samples as
  potentially problematic", because the benchmark "involves intentionally
  seeking out of bounds information". That is at grade ≥1. At grade ≥2 the
  plot shows 12.5% flagged.

**2. How long ago.** The paper is dated **2026-07-29**, 57 days ago. The plot
files were committed **2026-06-29** ("adding SVGs and changed default to SVG
format") and **2026-06-30** ("add appendices paper svgs"), 87 and 86 days ago.

**3. How it relates to what has already been read.** This is the number the
breadth pass's item 2 could not read.
- **Against that item's headline.** It said the Institute "confirmed flaws in
  five widely used benchmarks". The rates show how uneven that is. CORE-Bench
  is compromised at roughly three in ten transcripts on each of three flaw
  types. CVE-Bench and KernelBench have one or two cells at 1-8%.
- **Against X1's path 1** (Spider 2.0-AIFunc's 465-versus-393 gap, and gold
  that nobody outside its authors had audited). That path found one
  benchmark's provenance unaudited, by hand. This is the first
  **cross-benchmark rate** the reader has seen, with a stated sampling design.
- **Against the Background audit.** OpenAI's February 2026 SWE-bench Verified
  audit (59.4% of 138 hard problems had flawed tests) counts a different flaw
  over a different denominator, *tasks* with bad tests. The two numbers do not
  compete.

**4. What through-line it changes.** It sharpens the breadth pass's "a
benchmark score measures the agent and the benchmark together, until someone
has read the transcripts". Two refinements:
- **Reading the transcripts with an LLM is not the same as reading them.** On
  Tau2-Retail and on CORE-Bench tool failure, the scanner rate is 40-89 points
  above the confirmed rate. On CORE-Bench ground-truth access it is below.
  A scanner is triage, as the paper itself says, and the confirmed rate is the
  finding.
- **The unit is the transcript.** A 20.2% ground-truth-access rate on SWE-bench
  Verified means about a fifth of 401 runs, from three models (GPT-5-mini,
  GPT-5.4 and Sonnet 4.6), touched leaked information. It is not the share of
  tasks that leak. A task-level flaw rate is not reported in anything read.

**5. What to research next.**
- **Recompute the confirmed rates with their confidence intervals.** The
  released notebook `analysis/scanner_paper_figures.ipynb` computes "a
  stratified percentile bootstrap … 2,000 bootstrap iterations with 95%
  confidence intervals" for the confirmed rates. Its outputs are stripped, and
  the figure does not draw them. Run the repository's
  `tools/hf_dataset_sync.py pull` and `analysis/generate_paper_figures.py` on
  the test configuration. Report the CI on SWE-bench Verified's 20.2%, and on
  each of CORE-Bench's 30.0%, 28.5% and 28.6%. Split each by model. This needs
  a driver's download: the dataset is 2.14 GB, and page fetches cannot join
  its files.
- **Split SWE-bench Verified's 20.2% by mechanism**: an issue that describes
  the gold patch against git-history access. Check Figure 12 of
  arXiv:2607.27518 ("Human labeled ground truth access violations for
  benchmarks with standard settings") and the validation files. Then check
  whether the Inspect Evals SWE-bench image the transcripts used (task version
  2-B/3-C) still carried the future git history that upstream SWE-bench
  removed in 4.1.0 ("#471 Fix git log leakage in environment images",
  2025-09-11).

**6. Source.** From open search. `arxiv.org` is on `sources.md`;
`github.com` and `raw.githubusercontent.com` are on it for line B, and this
repository was not.
- [arXiv:2607.27518 full text](https://arxiv.org/html/2607.27518v1): **full
  page read**, fetched five times. The fetches were for the tables and
  captions, the sampling design and results paragraphs, the image list, the
  dev/test split, and per-benchmark quotes.
- **The paper's own Figure 3 image could not be read.** The
  [PDF](https://arxiv.org/pdf/2607.27518) and the
  [source](https://arxiv.org/src/2607.27518) came back as binary in this
  runner.
- [`violation_rates_by_benchmark_max.svg` (test)](https://raw.githubusercontent.com/Generality-Labs/scanner_evaluation/main/analysis/results/paper_figures/combined/combined_test_empirical/violation_rates_by_benchmark_max.svg),
  [its dev twin](https://raw.githubusercontent.com/Generality-Labs/scanner_evaluation/main/analysis/results/paper_figures/combined/combined_dev_empirical/violation_rates_by_benchmark_max.svg)
  and [the floor-mean test variant](https://raw.githubusercontent.com/Generality-Labs/scanner_evaluation/main/analysis/results/paper_figures/combined/combined_test_empirical/violation_rates_by_benchmark_floor_mean.svg):
  **full file read** for coordinates. The floor-mean variant was read as a
  cross-check: its human-confirmed markers sit at the identical coordinates.
- [`scanner_paper_figures.ipynb`](https://raw.githubusercontent.com/Generality-Labs/scanner_evaluation/main/analysis/scanner_paper_figures.ipynb):
  **full file read**, for the IPW and bootstrap method.
- [Repository commits](https://github.com/Generality-Labs/scanner_evaluation/commits/main):
  **full page read**.

**7. Verified / inferred / assumed.**
- **Verified:**
  - every coordinate, and the arithmetic that turns it into a rate (the
    driver can re-run it from the coordinates above);
  - the legend and colour mapping, and the transcript totals in Table 3;
  - the sampling-design quote, and the four per-benchmark quotes;
  - that the notebook's outputs are stripped;
  - the dates of the repository commits.
- **Verified arithmetic, inferred reading:** the test splits of 401
  (SWE-bench Verified) and 90 (CORE-Bench). Both come from exact *k*/*n* fits,
  and neither is stated in the text read.
- **Inferred:** that the repository's test SVG *is* the paper's Figure 3. The
  caption and legend wording match, and the image itself could not be
  rendered. Two HTML fetches disagreed about which benchmarks Figure 3's axis
  shows: one listed Tau2 and Terminal-Bench, the other listed Terminal-Bench
  and not Tau2. Neither is trustworthy, because the figure is an image. If
  the paper's figure merges development and test, Terminal-Bench 2.0's values
  would be the development ones above.
- **Inferred:** that the "five" in the abstract are the five non-zero
  benchmarks named here.
- **Assumed:** that the SVGs committed on 2026-06-29/30 were not re-generated
  from changed data before the paper was submitted a month later. The
  repository has no later commit.
- **Assumed:** that "human-confirmed" uses the same ≥2 threshold as the
  scanner flag. The analysis README gives "violation thresholds (typically
  `2`)".

---

### 2. The human labels and the scanners were released, but not in a form anyone can recount without a download

**1. What it is.** The paper publishes its code and data:
- "Code: https://github.com/Generality-Labs/scanner_evaluation"
- "Dataset: https://huggingface.co/datasets/generality-labs/abc-scout-scanners/"
- The scanner prompts are printed in its **Appendix F**.

**The repository:**
- 98 commits, 1 star, 2 forks and 0 issues.
- The README still reads "Paper Link: TBC".
- It records the settings the transcripts were run under: Inspect
  `0.3.180.dev77` for most runs, and Terminal-Bench 2.0 through the
  inspect-harbor adaptor v0.4.7.
- It records one run-to-run inconsistency the authors accepted: "SWE-bench
  Verified had its task version change from 2-B → 3-C between transcripts".
- **What is not in it:** a 2026-06-29 commit reads "removing grading csvs
  which should live in HF", and the notebooks' outputs are stripped. So no
  table of rates exists in the repository.

**The dataset:**
- 2.14 GB, no dataset card, and a broken viewer: "The split names could not
  be parsed".
- One folder per benchmark, plus `scans/<criterion>/<dev|test>/` holding
  `scan-results` and `validation`.
- The human labels are small CSVs, for example
  `scans/ground_truth_access/test/validation/post_validation_sample_*.csv`,
  six of them at 4.5-5.4 kB. The columns are `id,target,predicate`: an opaque
  transcript ID, a grade from 0 to 3, and `eq`.
- **The benchmark is not in the label file.** Tying a grade to a benchmark
  needs the scan results, which the analysis reads as parquet.
- **The file names carry reviewer suffixes** (`_AH`, `_DS`, `_JM`, `_NGC`),
  so per-reviewer labels appear to be released alongside the merged ones.
- One unsuffixed file holds 200 rows, all set to `999`. That reads as an
  unfilled template kept beside the graded copies.

**2. How long ago.** The repository's release commits are dated
**2026-06-23 to 2026-06-30**, 86-93 days ago, and the last three are inside the
window. The dataset's label folders show as last changed "5 months ago", so
they are Background. The paper is dated 2026-07-29.

**3. How it relates to what has already been read.** X1's path 1 ended on a
benchmark whose gold is hidden twice, and which only its authors can score by
hand. This is the opposite case: an audit whose **labels are public**. In
principle, the rates in item 1 can be recomputed by anyone, which the AIFunc
headline could not. The breadth pass's item 2 asked whether "the scanner
prompts and human labels were released". Both were.

**4. What through-line it changes.** None new. It moves the breadth pass's
claim from "unaudited" to "auditable": the confirmed rates rest on released
labels, and a reader does not have to take the authors' word for them.
**The practical barrier is size and joins, not access.**

**5. What to research next.**
- **Count the raw human grades per benchmark.** Join each
  `validation/post_validation_sample_*.csv` `id` to its benchmark through the
  matching `scan-results` parquet, for each of the four criteria on the test
  split. Report the count of grades 0, 1, 2 and 3 per benchmark, which is the
  raw material under item 1's weighted rates. Also report agreement between
  the reviewer-suffixed copies (`_AH` against `_DS` on
  `MH6UxNTcbmXqXVqJnmmb7G`). Needs a driver's download.
- **Whether the four scanners in Appendix F ship as reusable Inspect Scout
  scanners**, in `UKGovernmentBEIS/inspect_scout`, `inspect_evals` or this
  repository's `scanner_dev/`, so that a third party could point them at a
  benchmark this reader cares about, such as Spider 2.0 or BIRD transcripts.
  Record the licence and any version tag.

**6. Source.**
- [`Generality-Labs/scanner_evaluation`](https://github.com/Generality-Labs/scanner_evaluation):
  **full page read** of the root, `analysis/` and `analysis/results/paper_figures/`
  listings, and the [README on raw](https://raw.githubusercontent.com/Generality-Labs/scanner_evaluation/main/README.md)
  and [`analysis/README.md`](https://raw.githubusercontent.com/Generality-Labs/scanner_evaluation/main/analysis/README.md).
- [Dataset page](https://huggingface.co/datasets/generality-labs/abc-scout-scanners),
  [file tree](https://huggingface.co/datasets/generality-labs/abc-scout-scanners/tree/main),
  and the `scans/`, `scans/ground_truth_access/test/validation/` and
  `swe_bench_verified/validation/` listings: **full page read**.
  `huggingface.co` answered this run.
- Three label CSVs were fetched through `resolve/main`:
  `…2WQYwt7yGUjXWvRxbhcMz8.csv`, `…2WQYwt7yGUjXWvRxbhcMz8_AH.csv` and
  `…MH6UxNTcbmXqXVqJnmmb7G.csv`. **Headers verified.** The grade counts came
  back through a summarising fetch.

**7. Verified / inferred / assumed.**
- **Verified:**
  - the code and dataset lines in the paper, and "Paper Link: TBC";
  - the CSV header `id,target,predicate`, and the file names and sizes;
  - the "removing grading csvs" commit, the stripped outputs, and the viewer
    error;
  - the Inspect and task-version notes.
- **Not relied on:** the per-grade counts a summarising fetch returned for two
  of the CSVs (73/54/55/18 and 193/4/1 of 200). They are not attributable to
  a benchmark without the join, and a summariser's tally is not a count.
- **Inferred:** that the suffixes are reviewer initials, and that the 999 file
  is an unfilled template.
- **Inferred:** that the README's dataset name `arcadia-mars-4-0/abc-scout-scanners`
  is the same dataset. Fetching it returned the `generality-labs` dataset.

---

### 3. No maintainer answered the paper, and the Inspect Evals ports were repaired in the paper's "tool failure" class anyway

**1. What it is.** A check of every place a response could land. First, the
upstream repositories of the five benchmarks:

| Benchmark | Upstream repository | Last commit | In-window change? |
|---|---|---|---|
| CORE-Bench | `siegelz/core-bench` | 2025-11-23 | none |
| CVE-Bench | `uiuc-kang-lab/cve-bench` | 2026-01-14 | none |
| KernelBench | `ScalingIntelligence/KernelBench` | 2026-03-05 | none |
| Terminal-Bench 2.0 | `harbor-framework/terminal-bench-2` | 2026-04-30 | none; `pytorch-model-cli`, the task the paper calls guessable at "10% chance", untouched |
| SWE-bench Verified | `SWE-bench/SWE-bench` | 2026-09-02 | active: 5.0.0 on 2026-08-17 (task repositories, a submission pipeline); no leakage or contamination entry, and nothing cites the paper |

**Then the Inspect Evals changelog, where the paper's transcripts were
actually produced.** No entry cites arXiv:2607.27518 or mentions scanners.
Four entries touch the tool-failure class, quoted in the order they landed:
- **2026-07-02, SWE-bench Verified (v5-C):** runs missing SWE-bench's test
  markers "are treated as infrastructure failures … and now raise, so the
  sample is marked ERRORED … rather than being scored as a misleading `0.0`."
- **2026-07-23, KernelBench (v5-B):** "Scorer now distinguishes infrastructure
  failures from verdicts on the generated kernel."
- **2026-08-20, KernelBench:** "Repaired the sandbox Dockerfile, broken since
  the eval moved to an isolated package (#1565)". The image is now published
  to `ghcr.io/generality-labs/…`.
- **2026-09-17, KernelBench (v6-C):** this replaces "the previous execution
  path where every sample could fail because the selected interpreter lacked
  KernelBench dependencies."

**One open pull request**, #2518 by `claude-code-aisi[bot]` on 2026-09-23,
fixes a `core_bench` loader that returned zero samples. It is not a validity
fix.

**Nothing in the window addresses CORE-Bench's answer exposure or guessable
answers**, the largest confirmed rates in item 1.

**2. How long ago.** The Inspect Evals entries are dated 2026-07-02, 07-23,
08-20 and 09-17 (84, 63, 35 and 7 days ago). SWE-bench 5.0.0 is dated
2026-08-17 (38 days). Pull request #2518 was opened 2026-09-23 (1 day).

**3. How it relates to what has already been read.** X1's path 1 recorded
"nothing has moved" on Spider 2.0-AIFunc, and silence on Spider 2.0's issue
tracker. The same pattern holds here: the benchmarks' own maintainers are
silent. The difference is that the **harness** layer is moving. The fixes
land in Inspect Evals, where the paper's authors work, and not upstream,
where leaderboards cite scores.

**4. What through-line it changes.** It adds a qualification to "an agent
benchmark score is a measurement of the agent and the benchmark together".
**A benchmark is also its port.** The same named benchmark can run with
different flaw rates depending on whose harness runs it, and when. KernelBench's
confirmed 8.0% tool failure was measured on a port that has since been
repaired twice. So a KernelBench number from before 2026-09-17 and one from
after may not be the same measurement.

**5. What to research next.**
- **Whether KernelBench's confirmed 8.0% tool failure is the interpreter bug
  that Inspect Evals fixed on 2026-09-17 (v6-C).** Read the pull requests
  behind the 2026-07-23, 2026-08-20 and 2026-09-17 KernelBench entries. Check
  their dates against the paper's KernelBench transcript window (Inspect
  `0.3.180.dev77`). Check also whether any of them links the Hugging Face
  transcripts or a scanner run.
- **Whether anyone has patched CORE-Bench's answer exposure since
  2026-07-29.** The paper found answers in "plotting code or results files".
  Look in the Inspect Evals `core_bench` port (its `dataset.py`, `eval.yaml`
  task version and README), and in the notes on Princeton's HAL leaderboard
  for CORE-Bench Hard. If no one has, a CORE-Bench score still carries a 30%
  confirmed ground-truth-access rate per transcript.

**6. Source.**
- The [Inspect Evals `CHANGELOG.md`](https://raw.githubusercontent.com/UKGovernmentBEIS/inspect_evals/main/CHANGELOG.md):
  **full file read**, over four fetches, three of them verbatim for every
  version from 0.14.3 to 0.21.0.
  - **An earlier summarising fetch was wrong.** It placed the SWE-bench v5-C
    entry in 0.20.0; the verbatim text puts it in 0.14.3. The verbatim text
    is used.
- [Pull request #2518](https://github.com/UKGovernmentBEIS/inspect_evals/pull/2518):
  **full page read**.
- Commit pages of [SWE-bench](https://github.com/SWE-bench/SWE-bench/commits/main),
  [core-bench](https://github.com/siegelz/core-bench/commits/main),
  [cve-bench](https://github.com/uiuc-kang-lab/cve-bench/commits/main),
  [KernelBench](https://github.com/ScalingIntelligence/KernelBench/commits/main)
  and [terminal-bench-2](https://github.com/harbor-framework/terminal-bench-2/commits/main):
  **full page read**, first page of history each. The
  [SWE-bench `CHANGELOG.md`](https://raw.githubusercontent.com/SWE-bench/SWE-bench/main/CHANGELOG.md):
  **full file read**, for 2026 entries and leakage lines.
- The Inspect Evals [`core_bench` directory](https://github.com/UKGovernmentBEIS/inspect_evals/tree/main/src/inspect_evals/core_bench):
  **landing page only**.

**7. Verified / inferred / assumed.**
- **Verified:**
  - every changelog quote and date;
  - the last-commit dates of the five upstream repositories;
  - the SWE-bench 4.1.0 git-log-leakage line;
  - pull request #2518's content and status;
  - that no Inspect Evals entry from 0.14.3 to 0.21.0 cites the paper.
- **Inferred:** that the Inspect Evals KernelBench and SWE-bench fixes bear on
  the paper's tool-failure category. They fix the same class of failure, and
  none says the paper prompted it.
- **Inferred:** that Generality Labs, where two of the authors now work, is
  involved in maintaining Inspect Evals. The KernelBench image is published
  under `ghcr.io/generality-labs`.
- **Assumed:** that a response would appear in a changelog or commit history.
  A maintainer could have replied privately, or on a leaderboard page not
  checked here.

---

### What was dropped, and why

- **Pith's review page of arXiv:2607.27518.** A third-party rendering of a
  paper that was readable at source.
- **"Benchmarking the Benchmarks: A Validity Audit of Tool-Calling
  Evaluation"** (arXiv:2607.02577, July 2026). In window and on theme, but it
  was seen only as a search listing, and it is not about these five
  benchmarks.
- **Earlier automated audits, which are Background and not fetched:**
  - BenchGuard (arXiv:2604.24955, April 2026);
  - "Automated Benchmark Auditing for AI Agents and Large Language Models"
    (arXiv:2605.26079, May 2026);
  - the Institute's earlier "Assuring Agent Safety Evaluations By Analysing
    Transcripts" (Alignment Forum, date not read).
- **The paper's backward source, the Agentic Benchmark Checklist** (Zhu et
  al., 2025, arXiv:2507.02825). Its four flaw types are this paper's. It is out
  of window and was not re-read.
- **A search summary claiming the paper found SWE-Lancer file-system leaks and
  OSWorld broken links.** Neither benchmark is in the paper's Table 3. The
  claim is misattributed, most likely from a neighbouring audit paper, and is
  not used.

### What was searched for and not found

- **Figure 3's values anywhere in the paper.** Not in the HTML text, captions
  or appendix tables, which report scanner accuracy and not benchmark rates.
  The PDF and the TeX source returned binary that this runner could not
  unpack. The numbers above come from the authors' repository only.
- **A confidence interval on any human-confirmed rate.** It is computed in the
  notebook and printed nowhere: the outputs are stripped, and the figure draws
  CIs for flag rates only.
- **A task-level flaw rate**, meaning the share of *tasks* rather than
  *transcripts* that are flawed, for any of the five benchmarks. Not reported.
- **Any maintainer response citing the paper**, in five upstream repositories
  and the Inspect Evals changelog. None.
- **Any in-window commit to CORE-Bench, CVE-Bench, KernelBench or
  Terminal-Bench 2.0 upstream.** None.
- **A critic of the paper, or any forward citation.** Two searches, one on the
  exact title and one phrased as a critique of scanner false positives,
  returned only the paper itself and earlier audits.
- **A Hugging Face dataset card** documenting splits, columns or licence.
  None exists.

## Level 2 - Where SWE-bench Verified's leaked answers came from

**Nothing moved in the harness the transcripts ran on.** Inspect Evals' SWE-bench
port has had no commit to its task file since 2026-06-25, one day before the
window opens. No changelog entry, issue or pull request in the window
addresses git history. Upstream SWE-bench and a neighbouring benchmark did
move, in items 3 and 4.

**The level's findings:**
- **The mechanism split does not exist anywhere public.** That is a verified
  absence. Figure 12 is not a split by mechanism. It is a count of human
  grades, and it is on the **development** set, not the 401 test transcripts.
  Its test-set twin, in the authors' repository, gives the raw material under
  the 20.15%: **36 of the 100** human-graded SWE-bench test transcripts were
  graded 2 or 3.
- **The harness did expose future git history, by construction.** Since task
  version 2-B (2026-02-17), the Inspect Evals port has pulled Epoch AI's
  prebuilt images by default. Those images were built before upstream's
  September 2025 fix, and their builder wrote that they keep future history.
  The port runs no clean-up of its own before the agent starts. The paper's own
  example transcript shows the result: the agent reads the task's merged fix
  commit by its hash.
- **A correction to Level 1.** The 401 SWE-bench Verified test transcripts come
  from **two** agent models, not three: 201 from GPT-5.4 and 200 from Sonnet
  4.6. GPT-5-mini does not appear in either SWE-bench manifest.

**Window.** Items are dated on or after **2026-06-26**. The in-window anchors
are:
- the paper, 2026-07-29;
- the repository's figure files, 2026-06-29/30;
- SWE-bench pull request #581, closed 2026-08-12;
- the upstream image re-push, 2026-08-13;
- SWE-Bench Pro Verified, 2026-09-08.

Everything about how the images were built (2024-2026) is **Background**.

**Terms used below** (Knowledge `outside-analytics-stacks` is *new*):
- **A Docker image** is a frozen copy of a machine: here, a Linux system with
  the task's repository checked out at the commit just before the fix. Every
  agent run starts a fresh container from it.
- **DockerHub** and **`ghcr.io`** (GitHub's container registry) are the two
  public hosts such images are pulled from.
- **Epoch AI** is a research organisation that runs its own benchmark hub. It
  also republished SWE-bench's images in a smaller form.
- **"Future git history"** means commits made after the task's starting point,
  which include the human fix the benchmark grades against. Four things can
  leave them readable inside the container even when the checkout looks clean:
  - leftover branches and tags;
  - the reflog, git's local record of where each branch pointed;
  - unreferenced objects not yet deleted.

---

### 1. Figure 12 is development-set grades, not mechanisms. Its test twin puts 36 of 100 sampled transcripts at grade 2 or above

**1. What it is.** Where Figure 12 sits, and what it covers:
- It is in Appendix B.1 of arXiv:2607.27518, "Development using human graded
  transcripts".
- B.1 says the scanner was first developed on "transcripts from the
  development set evaluations".
- The caption reads "Human labeled ground truth access violations for
  benchmarks with standard settings (left) and confusion matrices between human
  graders and scanners (right)". It adds that "In all other benchmarks for
  ground truth development, very few violations were identified".

**Its left panel matches one file.** The repository file is
`analysis/results/paper_figures/combined/combined_dev/grade_distribution_human.svg`,
titled "Human-labeled grade distribution by benchmark". Its first panel,
`ground_truth_access`, shows the five benchmarks B.1 names, with these
transcript counts:
- core_bench, n=45
- mle_bench, n=63
- mlrc_bench, n=6
- swe_bench, n=100
- terminal_bench_2_0, n=84

Those sum to **298**. That is the `n=298` printed on every panel of the
confusion-matrix file next to it,
`combined_dev/composite_vs_validation__ground_truth_access__dev.svg`.

**Reading the bars.** The bars are stacked, one colour per human grade: grade 3
`#7f0000`, grade 2 `#d1495b`, grade 1 `#f4d35e`. The y-axis ticks sit at 0.0 = y
140.438 and 1.0 = y 61.161214, so a height *h* is a share of *h* / 79.276786.
The swe_bench bar sits at x 208.37885-250.85565 (tick 229.61725):
- grade 3 runs from 140.438 to 135.681393. Its height of 4.756607 is
  **0.060000**, so **6 of 100**.
- grade 2 runs from 135.681393 to 133.303089. Its height of 2.378304 is
  **0.030000**, so **3 of 100**.
- grade 1 runs from 133.303089 to 130.924786. Its height of 2.378303 is
  **0.030000**, so **3 of 100**.

So **9 of 100** development transcripts are at grade 2 or above. That matches
Level 1's development-set rate of 9.0%. **12 of 100** are at grade 1 or above,
which matches the `expected_v_rate` of "12%" in the development manifest
(`scanner_dev/ground_truth/data/dev_t5_files.csv`) for both SWE-bench runs.

**Cross-checks on the same panel:**
- CORE-Bench: 22.902183 → 13/45, 14.09365 → 8/45 and 42.280953 → 24/45. All 45
  are graded 1 or above, which is the caption's "were all graded as containing a
  potential violation".
- Terminal-Bench 2.0: 1.887543 → 2/84 and 3.775085 → 4/84.

**The test-set twin**
(`combined_test/grade_distribution_human.svg`) has n=73, 35, 25, 100 and 100
for CORE-Bench, CVE-Bench, KernelBench, SWE-bench and Tau2-Retail. Its ticks
are 0.00 = y 157.298519 and 1.00 = y 62.967698, so a share is *h* / 94.330821.
The swe_bench bar sits at x 214.74135-257.21815 (tick 235.97975):
- grade 3: from 157.298519 to 141.26228, height 16.036239, **0.170000**, so
  **17 of 100**;
- grade 2: from 141.26228 to 123.339424, height 17.922856, **0.190000**, so
  **19 of 100**;
- grade 1: from 123.339424 to 108.246492, height 15.092932, **0.160000**, so
  **16 of 100**;
- grade 0 is the remaining **48**.

**36 of 100** are at grade 2 or above. That count, re-weighted to the 401, is
the confirmed 20.15%. The same panel's CORE-Bench bar gives 7/73, 18/73 and
21/73, and CVE-Bench gives 1/35 at grade 2 and 5/35 at grade 1. Every one of
these is an exact *k*/*n*.

**Why no file splits the 36 by mechanism.** Four places were checked:
- **The paper's text** names the two mechanisms in Section 4.2.2 and counts
  neither. "There where several cases where the source git issue itself
  described the gold patch verbatim including the files that require changes."
  Then: "In a second case, we found evidence of models accessing upstream git
  history including human generated patches for the intended issue".
- **The label files** carry only `id,target,predicate`.
- **The scanner** (`scanner_dev/ground_truth/gt_scanner.py`) returns a 0-3
  number and a free-text explanation, with no field for mechanism.
- **The repository's full file tree** (43 SVGs, 8 CSVs, not truncated) has no
  per-mechanism file.

**What the test manifest adds.** The file is
`scanner_dev/ground_truth/data/test_t5_files.csv`. The 401 SWE-bench Verified
test transcripts are four runs:
- 2026-04-08 21:06, GPT-5.4, 89 samples;
- 2026-04-08 22:57, GPT-5.4, 53 samples;
- 2026-04-09 08:45, GPT-5.4, 59 samples;
- 2026-04-16 19:35, Sonnet-4.6, 200 samples.

That is 201 + 200 = 401. The development runs are dated 2026-03-16 and
2026-03-17. Both sit either side of task version 3-C, released on 2026-04-02.
That fits the authors' README: 2-B for development, 3-C for test.

**2. How long ago.** The paper is dated 2026-07-29, 57 days ago. The figure
files come from the 2026-06-29/30 commits, 86-87 days ago. The transcripts they
count were produced 2026-03-16 to 2026-04-16, which is Background.

**3. How it relates to what has already been read.** Level 1 left the 20.15%
as a weighted rate with no raw count under it. This gives the raw count,
**36/100 graded ≥2**, and shows that the paper's two mechanisms are
**illustrations, not tallies**. It also corrects Level 1's "from three models
(GPT-5-mini, GPT-5.4 and Sonnet 4.6)": for SWE-bench Verified's test set, the
models are GPT-5.4 and Sonnet 4.6 only.

**4. What through-line it changes.** It narrows "the confirmed rate is the
finding" (Level 1, item 1). **The confirmed rate is the finding, and the
mechanism is not.** Reading a benchmark's flaw rate as a statement about the
*benchmark* needs the mechanism. An issue text that gives away the patch is a
property of the task. Readable git history is a property of the harness, and it
can be fixed without touching a task. The paper does not separate the two, so
20.15% cannot yet be charged to either.

**5. What to research next.**
- **Classify the 36 by mechanism from the released scans.** Pull
  `scans/ground_truth_access/test/scan-results/` from Hugging Face. The scans
  are `scan_id=2WQYwt7yGUjXWvRxbhcMz8` (GPT-5.4 as scanner) and
  `scan_id=8af8YLdVp88S2Ga7ARNFFn` (Sonnet 4.6 as scanner). Join them to the
  test validation CSVs' `id`s with `target` ≥ 2, and to the four `.eval` logs.
  For each of the 36, look in the agent's tool calls for `git log`, `git show`,
  `git reflog`, `--all` or `git fsck`. Mark any issue text that contains the
  gold patch's changed lines. Report the count per mechanism and per agent
  model. This needs a driver's download.
- **Reconstruct 36/100 → 20.15% exactly.** In
  `analysis/scanner_paper_figures.ipynb`, find which scanner or composite
  defined the "scanner-positive" stratum for SWE-bench's human sample, and how
  many of the 100 came from each stratum. Recompute the weighted rate, with the
  2,000-iteration bootstrap interval. A 50/50 split cannot produce 20.15% from
  136 flagged and 265 unflagged transcripts: it would need a negative
  confirmed rate in the unflagged stratum. So the split was something else.

**6. Source.** From open search. `arxiv.org`, `github.com` and
`raw.githubusercontent.com` are on `sources.md`.
- [arXiv:2607.27518 HTML](https://arxiv.org/html/2607.27518v1): **full page
  read**, fetched five times this level, for Section 4.2.2 sentence by
  sentence, Appendix B.1, the Figure 12 caption, and the Figure 5 example.
  Figure 12 itself is an image and was not rendered.
- [`combined_dev/grade_distribution_human.svg`](https://raw.githubusercontent.com/Generality-Labs/scanner_evaluation/main/analysis/results/paper_figures/combined/combined_dev/grade_distribution_human.svg),
  [`combined_test/grade_distribution_human.svg`](https://raw.githubusercontent.com/Generality-Labs/scanner_evaluation/main/analysis/results/paper_figures/combined/combined_test/grade_distribution_human.svg)
  and [`combined_dev/composite_vs_validation__ground_truth_access__dev.svg`](https://raw.githubusercontent.com/Generality-Labs/scanner_evaluation/main/analysis/results/paper_figures/combined/combined_dev/composite_vs_validation__ground_truth_access__dev.svg):
  **full file read**, for the coordinates, labels and `n=` values above.
- [`test_t5_files.csv`](https://raw.githubusercontent.com/Generality-Labs/scanner_evaluation/main/scanner_dev/ground_truth/data/test_t5_files.csv),
  [`dev_t5_files.csv`](https://raw.githubusercontent.com/Generality-Labs/scanner_evaluation/main/scanner_dev/ground_truth/data/dev_t5_files.csv),
  [`config.py`](https://raw.githubusercontent.com/Generality-Labs/scanner_evaluation/main/scanner_dev/ground_truth/config.py)
  and [`gt_scanner.py`](https://raw.githubusercontent.com/Generality-Labs/scanner_evaluation/main/scanner_dev/ground_truth/gt_scanner.py):
  **full file read**.
- The [repository tree](https://api.github.com/repos/Generality-Labs/scanner_evaluation/git/trees/main?recursive=1)
  (not truncated): **full file read**.
- [`swe_bench_t5_JM.csv`](https://huggingface.co/datasets/generality-labs/abc-scout-scanners/resolve/main/swe_bench_verified/validation/swe_bench_t5_JM.csv):
  **full file read**, but through a summarising fetch. It gave 6 threes, 3 twos
  and 2 ones, one fewer grade 1 than the SVG. It is used for corroboration
  only.

**7. Verified / inferred / assumed.**
- **Verified:**
  - every coordinate, and the arithmetic that turns it into a count;
  - the `n=` values, and n=298;
  - the manifest rows and the 201 + 200 = 401 sum;
  - that the labels, the scanner output and the file tree carry no mechanism
    field;
  - the Section 4.2.2 and B.1 wording.
- **Inferred:** that `combined_dev/grade_distribution_human.svg` is Figure 12's
  left panel. The benchmarks, the n=298 and the all-CORE-Bench-flagged pattern
  all match, and the paper's image was not rendered. The caption says "CORE-Bench
  easy split", but the manifest's human-labelled CORE-Bench development run is
  `Core-bench_medium` (45 samples, gpt-5-mini). That discrepancy is unresolved.
- **Inferred:** that `expected_v_rate` means the share graded ≥1. It fits
  12/100, but the column is not documented.
- **Inferred:** the task-version-to-split mapping (2-B development, 3-C test).
  The run dates and the README support it, but no file states it per run.
- **Assumed:** that these SVGs were not regenerated from changed labels before
  the paper was submitted.

---

### 2. The port's default images were built before upstream's fix, and the paper's example transcript reads the merged fix commit

**1. What it is.** Four links, each checked.

**(a) The port uses Epoch's images, and cleans nothing.** The Inspect Evals
task file `src/inspect_evals/swe_bench/swe_bench.py` sets `DEFAULT_IMAGE_TEMPLATE
= "ghcr.io/epoch-research/swe-bench.eval.{arch}.{id}:latest"`. Upstream's
DockerHub template (`swebench/sweb.eval.{arch}.{org}_1776_{repo}-{issue}:latest`)
remains an option. The switch came in pull request #942, merged 2026-02-17,
which is task version 2-B: "Default images switch from DockerHub to Epoch AI's
ghcr.io registry, which offers 10x smaller images". No commit to the task file
between that one and 2026-06-25 touches the image. So 3-C, the test
transcripts' version, used the same default.

The port's only git commands are in the scorer: `git diff --cached
{base_commit}`, `git checkout {base_commit} …` and `git apply`. They run after
the agent has finished. The solvers file's only git command is the oracle
solver's `git apply`. Nothing removes branches, tags, reflog or unreferenced
objects before the agent runs.

**(b) Epoch's images keep future history, by their builder's account.** The
source is Epoch AI's post "How to run SWE-bench Verified in one hour on one
machine", 2025-07-10, which is Background:
- The registry images "should be identical to those that would be generated by
  the original build scripts from the SWE-bench authors".
- "the model should not have access to _future_ history from after the PR was
  merged … I believe that is possible in some circumstances even after a `git
  reset --hard` and `git remote remove origin`".
- "Or it could access the dangling commits in some way, perhaps with `git fsck
  --lost-found`. I believe this is unlikely to be a problem currently, but could
  become one with future models."

The registry repository's last commit is 2025-08-21. The image for the paper's
example task, `swe-bench.eval.x86_64.django__django-16950`, has a single
`latest` version, "Published almost 2 years ago", with digest `sha256:14750c1d…`.
**Both dates are before upstream's fix.** That fix is SWE-bench pull request
#471, merged 2025-09-11: "Chronologically sound git cloning: Updated cloning to
prevent access to future commits and tags".

**(c) Upstream's images do clean.** The same task's upstream DockerHub image
has tags `v1` (2025-01-04), `v2` (2025-09-10, the eve of the #471 merge) and
`latest` (2026-08-13). The generated upstream Dockerfile for this task, in
`SWE-bench/swe-bench-dockerfiles`, runs these steps:
- `git reset --hard f64fd47…` and `git remote remove origin`;
- deletes every tag dated after the target;
- deletes every non-current branch;
- runs `git reflog expire --expire=now --all` and `git gc --prune=now
  --aggressive`.

That last step deletes unreachable future commits.

**(d) The paper's example shows the leak.** Figure 5 (Appendix A) is task
`django__django-16950`, run by Claude Sonnet 4.6. The GPT-5.4 scanner graded it
3: "the agent runs git show eed096574f and reads the exact patch", then
"matches the gold solution essentially exactly, including the explanatory
comment". Commit `eed0965` in `django/django` is "Fixed #32210 -- Fixed model
inlines with to_field that has a default". It is one of the two commits of
django pull request #16950, merged 2023-07-07, and that pull request is the
task. So the agent read the task's own merged fix out of the container.

**Epoch runs history removal in its own hub, not in its images.** Epoch's
[SWE-bench Verified page](https://epoch.ai/benchmarks/swe-bench-verified) says:
"When instantiating a Docker container, we remove all git history after that
sample's original GitHub issue." That clean-up runs when Epoch's own harness
starts a container. The Inspect Evals port uses Epoch's images and does not
run it.

**2. How long ago.** The anchor is the paper's Figure 5, dated 2026-07-29 (57
days ago), with the port read as it stands on 2026-09-24. The facts it rests on
are Background:
- the image, published about two years ago;
- Epoch's post, 2025-07-10;
- upstream #471, 2025-09-11;
- the port's switch to Epoch's images, 2026-02-17;
- the task file's last commit, 2026-06-25, 91 days ago.

**3. How it relates to what has already been read.** Level 1, item 3, found
that the Inspect Evals ports changed inside the window only in the tool-failure
class. This puts a cause under the one SWE-bench flaw Level 1 could not
explain:
- **The git-history half is a harness property.** Upstream had closed it
  (Background).
- **The port reopened it**, when it swapped images for size in February 2026.
- **It has stayed open through the window.** Nothing in the 0.14.3-0.21.0
  changelog and no issue addresses it.

This is the "a benchmark is also its port" line from Level 1 in its sharpest
form. The same named benchmark leaks on one harness and not on another.

**4. What through-line it changes.** It extends "a benchmark is also its port"
with **a benchmark is also its image digest**. A SWE-bench Verified score from
Inspect Evals' default settings is measured on images that predate upstream's
leak fix, while Epoch's own hub removes the history at run time from the same
images. A reader comparing scores across those harnesses is comparing different
exposures to the answer.

**5. What to research next.**
- **Test the two images directly.** Start
  `ghcr.io/epoch-research/swe-bench.eval.x86_64.django__django-16950:latest`
  (`sha256:14750c1d…`) and
  `swebench/sweb.eval.x86_64.django_1776_django-16950:latest`
  (`sha256:2f226410…`). In `/testbed`, run each of:
  - `git cat-file -t eed096574f`
  - `git log --all --oneline | head`
  - `git tag --contains HEAD`
  - `git reflog`
  - `git fsck --lost-found`

  Repeat for the three tasks named in SWE-bench issue #465:
  `pytest-dev__pytest-6202`, `django__django-13513` and `django__django-15572`.
  This is a spike for an engineer or a driver with Docker, not a page fetch.
- **Find Epoch's run-time history-removal code, and whether Inspect Evals has
  been asked to adopt it.** Look in Epoch's benchmarking harness (hub version
  v2.0.0, 2026-02-12) for the step that "remove[s] all git history after that
  sample's original GitHub issue". Then search `UKGovernmentBEIS/inspect_evals`
  issues and pull requests for a proposal to add it, or to set
  `image_name_template` back to DockerHub, and read any reply.

**6. Source.** From open search.
- The Inspect Evals
  [`swe_bench.py`](https://raw.githubusercontent.com/UKGovernmentBEIS/inspect_evals/main/src/inspect_evals/swe_bench/swe_bench.py)
  (two fetches),
  [`solvers.py`](https://raw.githubusercontent.com/UKGovernmentBEIS/inspect_evals/main/src/inspect_evals/swe_bench/solvers.py),
  [`scorers.py`](https://raw.githubusercontent.com/UKGovernmentBEIS/inspect_evals/main/src/inspect_evals/swe_bench/scorers.py),
  [`README.md`](https://raw.githubusercontent.com/UKGovernmentBEIS/inspect_evals/main/src/inspect_evals/swe_bench/README.md)
  and [`eval.yaml`](https://raw.githubusercontent.com/UKGovernmentBEIS/inspect_evals/main/src/inspect_evals/swe_bench/eval.yaml):
  **full file read**. They were read through summarising fetches that returned
  the git-bearing lines verbatim.
- The [task file's commit history](https://github.com/UKGovernmentBEIS/inspect_evals/commits/main/src/inspect_evals/swe_bench/swe_bench.py)
  and [pull request #942](https://github.com/UKGovernmentBEIS/inspect_evals/pull/942):
  **full page read**.
- [Epoch's post](https://epoch.ai/latest/swebench-docker) and
  [benchmark page](https://epoch.ai/benchmarks/swe-bench-verified): **full page
  read**.
- The [Epoch registry repository](https://github.com/epoch-research/SWE-bench)
  and [its commits](https://github.com/epoch-research/SWE-bench/commits/main):
  **full page read**.
- [The django-16950 package page](https://github.com/orgs/epoch-research/packages/container/swe-bench.eval.x86_64.django__django-16950/versions):
  **landing page only**. It shows a relative date and no exact timestamp.
- [DockerHub tags API](https://hub.docker.com/v2/repositories/swebench/sweb.eval.x86_64.django_1776_django-16950/tags):
  **full file read**.
- The [upstream Dockerfile](https://raw.githubusercontent.com/SWE-bench/swe-bench-dockerfiles/main/tasks/django__django-16950/Dockerfile):
  **full file read**, through a summarising fetch that quoted the git lines.
- [SWE-bench #471](https://github.com/SWE-bench/SWE-bench/pull/471) and
  [#465](https://github.com/SWE-bench/SWE-bench/issues/465): **full page read**.
- [django commit `eed0965`](https://github.com/django/django/commit/eed096574f)
  and [django pull request #16950](https://github.com/django/django/pull/16950):
  **full page read**.

**7. Verified / inferred / assumed.**
- **Verified:**
  - the default image template and when it was switched (#942);
  - that the port runs no pre-agent git clean-up;
  - Epoch's quotes, and the registry's last commit date;
  - the DockerHub tag dates;
  - the upstream Dockerfile's clean-up steps;
  - that `eed0965` is the fix merged in django pull request #16950;
  - Figure 5's command and grade, as the paper's HTML describes them.
- **Inferred:** that the test transcripts used the default Epoch images. The
  default was in force at 3-C, but the authors' README names no image template
  and the `.eval` logs, where the resolved image sits in sample metadata, were
  not opened. A run could have overridden it.
- **Inferred:** that Figure 5 comes from the test set. Sonnet 4.6 appears only
  in the test manifest's SWE-bench runs.
- **Inferred:** that the Epoch image has been unchanged since before #471. The
  only date is GitHub's relative "almost 2 years ago".
- **Assumed:** that the upstream Dockerfile read today matches what built the
  2026-08-13 `latest`. The `v2` tag from 2025-09-10 may differ.

---

### 3. Upstream moved its clean-up into generated Dockerfiles in August and rebuilt its images. Nothing links that to the port or the leaderboard

**1. What it is.** SWE-bench pull request #581, "Fix Multilingual eval images
leaking future commits and tags (closes #578)", was opened 2026-05-17 and
closed unmerged on **2026-08-12**. Its author reported: "In our internal audit
of model runs on SWE-bench Multilingual (300 instances), session traces show
agents literally invoking `git log --all --grep` to retrieve the fix commit."
Maintainer John Yang closed it because the file it patched "no longer exists
after the harness restructure … That logic now lives in the dataset's baked
eval_script (generated by sb_dockerfile_gen in SWE-bench/swe-bench-dockerfiles)".

**The dates around it:**
- The upstream DockerHub `latest` for the item-2 task was re-pushed on
  **2026-08-13**.
- SWE-bench 5.0.0 followed on 2026-08-17 (Level 1, item 3).
- Issue #578, which #581 answered, said on 2026-05-08: "The SWE-Bench Verified
  images seem to have this patched, but Multilingual is lacking patches."

**Searches of the Inspect Evals changelog, issues and pull requests found
nothing** that mentions git history or future commits for `swe_bench`. The
same holds for the swebench.com leaderboard.

**2. How long ago.** #581 closed on 2026-08-12, 43 days ago. The image was
re-pushed on 2026-08-13, 42 days ago. Issue #578 (2026-05-08) is Background.

**3. How it relates to what has already been read.** Level 1 recorded SWE-bench
5.0.0 as having "no leakage or contamination entry". That still holds for the
changelog. The clean-up is now carried in the generated per-task Dockerfiles,
so it would not show up as a changelog line. Upstream treats Verified as fixed.
The port the paper measured does not use upstream's images.

**4. What through-line it changes.** None new. It confirms item 2's split:
**upstream closed it, and the port reopened it**. It adds that a fix located in
generated build files is invisible to anyone who reads only changelogs, which
was Level 1's method for "no maintainer answered".

**5. What to research next.**
- **When the clean-up block entered `SWE-bench/swe-bench-dockerfiles`, and
  whether the 2026-08-13 `latest` images were built from it.** Read that
  repository's 21 commits and the `sb_dockerfile_gen` generator. Compare the
  `v2` digest (`sha256:03f96179…`) with the `latest` digest
  (`sha256:2f226410…`) for `django__django-16950`, and for one task from each of
  the other eleven repositories in Verified.
- **Whether swebench.com's 5.0.0 submission pipeline (2026-08-17) records the
  image digest or harness a submission ran on.** Read the submission schema in
  `SWE-bench/experiments`, which the port pins at `559cf877…`, and any
  README for fields naming images, the `swebench` version or a sandbox. That
  decides whether a leaderboard reader could tell a leaky run from a clean one.

**6. Source.** From open search.
- [SWE-bench pull request #581](https://github.com/SWE-bench/SWE-bench/pull/581)
  and [issue #578](https://github.com/swe-bench/SWE-bench/issues/578): **full
  page read**.
- The [issue search for "git history"](https://github.com/SWE-bench/SWE-bench/issues?q=git+history+sort%3Acreated-desc):
  **full page read**.
- The [`swe-bench-dockerfiles` README](https://github.com/SWE-bench/swe-bench-dockerfiles):
  **landing page only**.
- The [Inspect Evals `CHANGELOG.md`](https://raw.githubusercontent.com/UKGovernmentBEIS/inspect_evals/main/CHANGELOG.md):
  **full file read** over four fetches, with the 0.14.2-0.15.0 sections
  verbatim.
- Inspect Evals issue searches
  ([1](https://github.com/UKGovernmentBEIS/inspect_evals/issues?q=swe_bench+git+history),
  [2](https://github.com/UKGovernmentBEIS/inspect_evals/issues?q=swe+bench+leak)):
  **full page read**.

**7. Verified / inferred / assumed.**
- **Verified:** #581's dates, quote and closing reason; #578's sentence on
  Verified; the tag date; and that no Inspect Evals changelog entry from 0.14.3
  to 0.21.0 mentions git history.
- **Inferred:** that the 2026-08-13 re-push is the harness restructure the
  maintainer names. The dates are adjacent, and nothing states it.
- **Assumed:** that GitHub's issue search would surface an Inspect Evals issue
  about this. The search is keyword-based, and a differently worded issue could
  be missed.

---

### 4. SWE-Bench Pro Verified splits leakage by channel, and on GLM-5.2 suspicious git operations outnumber confirmed answer access about three to one

**1. What it is.** Zheng, Shang, Jiang and five others, from Shanghai AI
Laboratory, East China Normal University and Fudan, arXiv:2609.08149, "SWE-Bench
Pro Verified". SWE-Bench Pro is a harder sibling of SWE-bench from Scale AI,
with 731 tasks.

**What it does.** It rebuilds each repository "as a fresh single-commit
repository". Its Table 1 names four leakage channels: local file system, **git
history** ("Future commits, branches, tags, remotes, and reflogs"), external
network, and task metadata. It notes that earlier clean-up "deletes only
branch, remote, and tag references, without handling notes, replace references,
or stashes."

**On GLM-5.2, the counts on each side of that split** (731 trajectories per
condition):
- **Table 5, confirmed answer access:** local answer-file access in **103**
  tasks at baseline and 0 after the fix; network answer-file access in **49**
  and 0.
- **Table 6, suspicious local operations, in tasks:** `git_show_sha` **326** →
  0, `git_log_search` **286** → 95, `git_checkout_sha` 62 → 2 and
  `git_diff_sha` 51 → 0.
- **Table 7, online operations:** `raw_githubusercontent` 54 → 1 tasks.
- **The score** falls from 78.80% to 57.32%, and "90.9%" of the 186
  pass-to-fail changes are attributed to removed hacking. DeepSeek-V4-Pro barely
  moves: 49.98% → 49.11%.

**2. How long ago.** Version 1 is dated 2026-09-08 (16 days ago) and version 2
2026-09-16 (8 days ago).

**3. How it relates to what has already been read.** It is the mechanism split
that item 1 found missing for SWE-bench Verified, done on a neighbouring
benchmark, by channel, with before-and-after scores. Its suspicious-to-confirmed
gap looks like Level 1's scanner-to-human gap: git operations in 326 tasks,
confirmed local answer access in 103. **A command log overstates leakage in
the same way a scanner flag does.** It does not mention SWE-bench Verified,
Epoch's images or Inspect.

**4. What through-line it changes.** It adds a study design to "proving
efficacy": **the paired clean-environment rerun**. Run the same model on the
same tasks with and without the leak channels, and read the score drop as the
leak's contribution. That makes a leak a measured effect on the score rather
than a share of transcripts. Nothing like it exists for SWE-bench Verified on
the Inspect Evals port.

**5. What to research next.**
- **How Table 5 confirms "answer-file access".** Establish the rule that turns
  326 suspicious `git_show_sha` tasks into 103 confirmed ones: a human, an LLM
  judge, or a diff match against the gold patch. Record its threshold, and
  compare it with the AISI paper's human grade ≥2.
- **Whether the anti-hacking pipeline is released, under what licence, and
  whether it runs on SWE-bench Verified images.** If it does, a paired
  clean-versus-default rerun of Sonnet 4.6 on the 200 test tasks from
  2026-04-16 would put a score effect on item 2's leak. Find the repository the
  paper links and its README's supported datasets.

**6. Source.** From open search.
- [arXiv:2609.08149 abstract](https://arxiv.org/abs/2609.08149): **full page
  read**.
- [HTML](https://arxiv.org/html/2609.08149): **full page read**, over three
  fetches, for the channel definitions and Tables 5-7.

**7. Verified / inferred / assumed.**
- **Verified:** the dates, the abstract, the Table 1 channel wording, and the
  Tables 6-7 rows as quoted.
- **Verified, with a caveat:** the Table 5 counts and the score drop. They came
  through a summarising fetch that did not quote the table verbatim.
- **Inferred:** that "local answer-file access" includes recovering objects from
  git history. The paper's clean-up removed "all future commit objects", but a
  summariser supplied that reading.
- **Inferred:** that the gap between 326 and 103 is analogous to scanner flags
  against human confirmation. The two measures are defined differently.

---

### What was dropped, and why

- **"Dissecting model behavior through agent trajectories"** (arXiv:2606.17454,
  2026-06-16/17). Before the window, and its abstract does not touch git
  history.
- **Scale AI's `SWE-bench_Pro-os` issue #93**, "Git Reward Hacking in SWEBench
  Pro OSS" (2026-04-29, still open). It is Background to item 4 and before the
  window. Its reporter claims "a 100% success rate exploiting these scenarios on
  all images".
- **Datacurve's DeepSWE audit and the IQuest-Coder post on X.** Both were seen
  only as search summaries, the first dated May 2026, and both are about other
  benchmarks or models.
- **A search summary claiming "Claude Opus 4.7 showing significant drops of 8.0
  percentage points"** after future-commit clean-up. Not found in either SWE-Bench
  Pro Verified fetch, and not attributed to any source that was read. Not used.

### What was searched for and not found

- **A per-mechanism count for SWE-bench Verified's ground-truth access**
  (issue text against git history), in:
  - the paper's Section 4.2.2, Appendix B.1 and the Figure 12 caption;
  - the repository's full file tree, 43 SVGs and 8 CSVs;
  - the ground-truth scanner's output schema;
  - the Hugging Face label files (`id,target,predicate` only).

  It is not there.
- **A Figure 12 file for the test set, or one labelled "standard settings".**
  None. The closest are the development and test `grade_distribution_human.svg`.
- **Any statement in the paper of which image or Inspect Evals version the
  SWE-bench runs used.** None. The paper does not discuss image contents.
- **Any Inspect Evals change, issue or pull request about git history in
  `swe_bench`**, from 2026-06-26 to today. None. The task file's last commit is
  2026-06-25.
- **Any Epoch registry rebuild after upstream's #471.** None visible: the last
  repository commit is 2025-08-21, and the sampled package shows one version.
- **A swebench.com leaderboard note on git-history leakage.** None found.
- **A critic of, or a response to, the paper's SWE-bench finding.** None, as at
  Level 1.

> **Driver's check on level 2** (2026-09-24, by hand).
> - **The driver re-fetched `combined_test/grade_distribution_human.svg`**, and
>   the swe_bench bar paths in the first panel read:
>   - grade 3 (`#7f0000`), y 157.298519 → 141.26228: 16.036239 / 94.330821 =
>     **17**/100;
>   - grade 2 (`#d1495b`), y 141.26228 → 123.339424: 17.922856 / 94.330821 =
>     **19**/100;
>   - grade 1 (`#f4d35e`): 15.092932 / 94.330821 = **16**/100.
>
>   So **36/100 at grade ≥2**, as the level says. The panel's criterion (ground
>   truth access) is taken from the level's reading; the driver's fetch did
>   not return panel titles.
> - **The manifest sum,** 89 + 53 + 59 + 200 = 401, re-added.
> - **The 50/50-strata impossibility, re-solved.** With 50 flagged and 50
>   unflagged sampled, p + q = 36/50 = 0.72. Then 136p + 265q = 0.2015 × 401 =
>   80.8 gives 129q = −17.12. q is negative, so the sample was not split
>   50/50, and the path from 36/100 to 20.15% is still unknown.
> - **Leads that need a download or Docker** (P2-L2a, P2-L2b, P2-L2c) are
>   displaced, not dropped. This runner has no shell, so the driver cannot run
>   them either.

## Level 3 - Can a leaderboard reader tell which image a SWE-bench Verified score ran on?

**No.** Nothing a swebench.com entry carries records the Docker image, its
digest, the `swebench` version or the evaluation harness a score came from.
That is true of the leaderboard page, of the entry's `metadata.yaml`, and of
the artifacts the new pipeline publishes. The submission pipeline did change
inside the window, twice, and neither change touched this. **On the question
itself, nothing moved.**

**The level's findings:**
- **The schema has no field for the environment.** The leaderboard reads
  `metadata.yaml`. Its only harness-like field, `agent`, is the agent's name,
  "without a version". The per-instance artifacts the pipeline copies are
  `patch.diff`, `report.json` and `test_output.txt.gz`. None of the three
  names an image.
- **The one place an image does appear is inside a trajectory**, and only
  because the agent software writes its own config there. On the only
  in-window Verified entry, the image is a mutable tag, `…:latest`, which
  upstream re-pushed on 2026-08-13. A tag is not a digest.
- **The "checked" mark checks grading, not the environment.** The pipeline's
  own `verify` step says "No Docker and no re-execution". The in-window
  entry, run by a SWE-bench maintainer, carries `checked: null`.
- **The leak Level 2 found sits where the leaderboard does not look.**
  Git-history leakage happens in the container the *agent* works in. The
  official harness only grades the finished patch, in a fresh container of
  its own. So even a rule requiring the official harness would not show which
  image the agent saw. That is an inference from how the pieces fit, stated in
  item 1 part 7.
- **A correction to Levels 1 and 2.** Both dated "a submission pipeline" to
  SWE-bench 5.0.0 (2026-08-17). The changelog lists the `swebench submit`
  commands under **[Unreleased]**. They were committed on 2026-08-31 and
  2026-09-01, after the latest PyPI release, 5.0.2 on 2026-08-18.

**Window.** Items are dated on or after **2026-06-26**. The in-window anchors
are:
- SWE-bench 5.0.0 / 5.0.1 / 5.0.2, 2026-08-17 and 08-18;
- the `experiments` repository's metadata rewrite, 2026-08-09;
- the submission pipeline commits, 2026-08-31 and 09-01;
- the new submission rules and the one new Verified entry, 2026-09-01;
- arXiv:2609.17394, 2026-09-15;
- issues and pull requests opened 2026-09-08 to 09-23.

These are **Background**: the November 2025 submission policy, the
2025-11-19 cheating post, Epoch's changelog (last entry 2026-03-06) and HAL's
entries (last dated 2025-10-01).

**Terms used below** (Knowledge `outside-analytics-stacks` is *new*):
- **swebench.com** is the official SWE-bench leaderboard, run by the
  benchmark's authors. It is built from the GitHub repository
  **`SWE-bench/experiments`**, where each entry is a folder added by pull
  request.
- **`metadata.yaml`** is a short text file in each entry folder, holding the
  fields the leaderboard displays.
- **An agent scaffold** (the leaderboard calls it the "agent") is the software
  that drives the model. It turns model output into shell commands in a
  container and feeds back the results. **mini-SWE-agent** is the SWE-bench
  team's own minimal scaffold.
- **A trajectory** is the saved log of one agent run on one task: every
  model message and every command.
- **PyPI** is the public index Python packages are installed from with
  `pip install`.
- **A tag** such as `:latest` is a movable name for an image. **A digest**
  (`sha256:…`) names one exact image and cannot move.

---

### 1. The entry schema names the model and the scaffold, and nothing about the environment

**1. What it is.** Every place a leaderboard entry's facts are stored or
shown, checked for an image, digest, `swebench` version or evaluation harness.

**The `metadata.yaml` schema,** as `checklist.md` gives it (rewritten
2026-09-01):
- `info`: `logo`, `name`, `site`, `report`, `authors`.
- `tags`: `checked`, `model`, `org`, `os_model`, `os_system`,
  `system: attempts`.
- Four more `tags` fields, which the checklist calls **required**: `agent`,
  `agent_org`, `model_display`, `model_org`. The checklist's comment on
  `agent` is "Name of your harness/scaffold, without a version". It says to
  "Keep `agent` stable across releases (write `Acme Agent`, not `Acme Agent
  v2.1`)".
- One optional field, `reasoning_effort`.
- An `assets` block (`repo`, `logs`, `trajs`), written by `swebench submit
  publish`.

So "harness" here means the scaffold, and its version is removed on purpose.

**The stub the tool writes** (`swebench/submit/package.py`,
`_metadata_stub()`) has the same keys, each set to `TODO`. Its header comment
reads "Replace every TODO before opening the PR; see experiments/checklist.md."

**The machine-written files:**
- `submission.json` has `schema_version`, `submission_id`, `split`, `model`
  and `run_dir`.
- `results/results.json` has `no_generation`, `no_logs` and `resolved`.
- Per instance, the tool copies only `patch.diff`, `report.json` and
  `test_output.txt` (gzipped). It does not copy `run_instance.log` or
  `eval.sh`, the harness's own logs.
- A published `report.json` (read for `django__django-16950` in the
  2026-09-01 entry) has `patch_is_None`, `patch_exists`,
  `patch_successfully_applied`, `resolved`, `infra_failure` and
  `tests_status`.
- The harness's run-level `results.json` (`swebench/harness/reporting.py`)
  holds counts and ID lists, `schema_version`, and (with a Docker client)
  `unremoved_images`, a list of images left over after the run. It holds no
  version and no image the agent used.

None of these files records `__version__`, an image name, a digest or a
timestamp.

**What the checks enforce.** `analysis/validate_entries.py` was added
2026-09-01 and runs on every pull request. It requires `info.name`, a
resolved count, no `TODO` left in the files, a committed logo, and an
`assets` location. It checks nothing about environment, version or harness.

**What reaches the page.** `analysis/get_leaderboard.py` copies metadata
fields into the leaderboard data. It carries `checked`, `warning` (from
`info.warning`), `mini-swe-agent_version` and `trajs_docent`. It does **not**
read `info.commit`, which the 2026-09-01 entry fills in with
`2f6637a2557da1f7b5f2b583ab7090a077bbeed2`. The one pin in that entry is
dropped before it reaches a reader. The page's legend has two marks:
"Open-weights model" and "Run performed or directly checked by the SWE-bench
team". Its one filter, "Bash Only", reads "Show only runs in the
mini-SWE-agent environment, so scores compare models rather than harnesses".

**The two in-window changes:**
- **2026-08-09**, "Update metadata": 7,466 added lines across existing
  entries, adding `agent`, `agent_org`, `model_display`, `model_org` and
  sometimes `reasoning_effort`. No patch added `warning` or changed `checked`.
- **2026-09-01**, "Fold bash-only into verified; self-hosted submission
  artifacts". Logs and trajectories now live in the submitter's own public
  repository: "This repository holds entries, not artifacts." It added the
  validator above.

**2. How long ago.** The metadata rewrite was 46 days ago (2026-08-09). The
pipeline commits and the rules rewrite were 23-24 days ago (2026-08-31 and
09-01).

**3. How it relates to what has already been read.** Level 2 ended on "a
benchmark is also its image digest". This checks whether the place scores are
cited from carries that digest. It does not. The Inspect Evals port was not
checked here, because it does not submit to swebench.com. What matters is that
nothing in an entry would reveal a run like the paper's if one were submitted.

**4. What through-line it changes.** It narrows "a benchmark is also its
image digest" to something a reader can act on. **A SWE-bench Verified score
on swebench.com cannot be tied to an image from anything the leaderboard
publishes.** The schema moved inside the window toward naming *who* ran what
(`agent`, `model_display`), and away from naming *what version*. It says
"without a version" on purpose, so that entries group by product.

**5. What to research next.**
- **Whether `pip install swebench` today installs a `swebench submit`
  command at all.** The experiments README tells submitters to `pip install
  swebench` and then run `swebench submit package`. PyPI's latest is 5.0.2
  (2026-08-18), and the `submit` commits came 13-14 days later. Open the 5.0.2
  wheel's file list on PyPI and look for `swebench/submit/package.py` and
  `swebench/cli/submit.py`. If they are absent, every in-window submitter
  installed from GitHub `main`, at a commit no entry records.
- **Whether adding the image to an entry is a small change.** Read
  `swebench/harness/run_evaluation.py` and `docker_utils.py` for where the
  instance image is resolved. Check whether `run_instance.log` records its
  tag or image ID. If it does, `package.py`'s artifact tuple leaves out the
  one file that names the grading image. Then check whether any issue or pull
  request in `SWE-bench/SWE-bench` proposes copying it.

**6. Source.** From open search. `github.com` and `raw.githubusercontent.com`
are on `sources.md`; `api.github.com` was used for listings and diffs.
- [`checklist.md`](https://raw.githubusercontent.com/SWE-bench/experiments/main/checklist.md):
  **full file read**. The metadata block and the `agent` guidance came back
  verbatim.
- [`experiments` README](https://raw.githubusercontent.com/SWE-bench/experiments/main/README.md):
  **full file read**, over four fetches, all summarising. The quoted sentences
  came back as quotes.
- [`swebench/submit/package.py`](https://raw.githubusercontent.com/SWE-bench/SWE-bench/main/swebench/submit/package.py):
  **full file read**, over three summarising fetches. They returned the stub,
  `write_submission_meta` and the artifact loop as code.
- [`swebench/cli/submit.py`](https://raw.githubusercontent.com/SWE-bench/SWE-bench/main/swebench/cli/submit.py)
  and [`swebench/harness/reporting.py`](https://raw.githubusercontent.com/SWE-bench/SWE-bench/main/swebench/harness/reporting.py):
  **full file read**, through summarising fetches that returned code
  verbatim.
- [`analysis/validate_entries.py`](https://raw.githubusercontent.com/SWE-bench/experiments/main/analysis/validate_entries.py)
  and [`analysis/get_leaderboard.py`](https://raw.githubusercontent.com/SWE-bench/experiments/main/analysis/get_leaderboard.py):
  **full file read**, summarising. The error strings and the dict lines came
  back quoted.
- The two commits,
  [`7b0ed87e`](https://api.github.com/repos/SWE-bench/experiments/commits/7b0ed87e)
  and [`a3e196ef`](https://api.github.com/repos/SWE-bench/experiments/commits/a3e196ef),
  and the [commit histories](https://api.github.com/repos/SWE-bench/experiments/commits?path=checklist.md)
  of `checklist.md` and the README: **full file read**, as JSON.
- [`_leaderboard_table.html`](https://raw.githubusercontent.com/SWE-bench/swe-bench.github.io/master/templates/_leaderboard_table.html):
  **full file read**, for the legend and filter text. The table itself is
  drawn by JavaScript, and [swebench.com](https://www.swebench.com/) as
  fetched showed no rows.
- The [`report.json`](https://raw.githubusercontent.com/john-b-yang/20260901_mini-v2.4.2_gemini-3-5-flash/main/logs/django__django-16950/report.json)
  for `django__django-16950`: **full file read**, twice. Key names only are
  used.
- The [SWE-bench `CHANGELOG.md`](https://raw.githubusercontent.com/SWE-bench/SWE-bench/main/CHANGELOG.md):
  **full file read**. The first 60 lines came back verbatim.
- The [PyPI release history](https://pypi.org/project/swebench/#history):
  **full page read**.

**7. Verified / inferred / assumed.**
- **Verified:**
  - every field name above;
  - the "without a version" wording;
  - the three copied artifacts;
  - the validator's checks;
  - that `get_leaderboard.py` carries no `commit`;
  - the legend and filter wording;
  - the commit dates and messages;
  - the `[Unreleased]` placement of `swebench submit`, and the PyPI dates.
- **Verified with a caveat:** the absence of `__version__`, image, digest and
  `docker` in `package.py`, `reporting.py` and the validator. Each is a
  summarising fetch's yes/no to a direct question, not a text search. The
  positive quotes it returned make a missed field unlikely, but not
  impossible.
- **Inferred:** that the leaderboard page shows nothing beyond what
  `get_leaderboard.py` passes it. The rendered table was not visible.
- **Inferred:** that git-history exposure is a property of the agent's
  container, not the grading container. It follows from the grader re-running
  a patch in its own container, and from the agent's image being set by the
  scaffold (item 2). No SWE-bench document states it.
- **Assumed:** that `leaderboards.json` on the site matches what
  `get_leaderboard.py` produces. The file truncated under every fetch.

---

### 2. The only in-window Verified entry names its agent's image in the trajectory, as a mutable tag, and is not "checked"

**1. What it is.** One Verified entry was added inside the window:
`20260901_mini-v2.4.2_gemini-3-5-flash`, merged as pull request #475 on
2026-09-01 by SWE-bench maintainer John Yang.
- **Its headline:** 359 of 500 resolved, 71.8%, with 59 instances producing no
  patch. The model is Gemini 3.5 Flash; the scaffold is mini-SWE-agent 2.4.2.
- **Its `metadata.yaml`** reads `checked: null`, `os_system: true`,
  `mini-swe-agent_version: 2.4.2`, `commit:
  2f6637a2557da1f7b5f2b583ab7090a077bbeed2` and `reasoning_effort: medium`.
- **What it does not name:** an image, a `swebench` version or a harness
  version.
- **The pull request** ticks the four checklist boxes and mentions no
  `swebench` version, image or `verify` result.

**The trajectory is where the image is.** The agent-side trajectory for
`django__django-16950` is Level 2's example task. Its config block records
the container the agent worked in:
`"docker.io/swebench/sweb.eval.x86_64.django_1776_django-16950:latest"`, with
working directory `/testbed` and version `"2.4.2"`. That is upstream's
image, not Epoch's, so this run is on the clean side of Level 2's split.
- **But the tag is `:latest`,** which Level 2 found re-pushed on 2026-08-13.
  The run date is not in the trajectory fields read.
- **So a reader learns the repository and tag,** and not which of at least
  two images behind that tag the agent got.
- **In this trajectory, the agent's only git command** was `git diff -- …`.
  It ran no `git log`, `git show`, `git reflog` or `git fsck`, and it did not
  reference `eed0965`.

**This is a scaffold habit, not a rule.** The README says trace formats are
flexible ("JSON, YAML, Markdown acceptable"). It requires only that traces be
human-readable and produced during inference. Nothing requires a trace to
name its environment.

**What "checked" means, and what `verify` checks:**
- **The legend** reads "Run performed or directly checked by the SWE-bench
  team".
- **To get the mark, the README says:** "Create an issue … provide us
  instructions on how to run your model … We will run your model on a random
  subset of SWE-bench and verify the results."
- **The new `swebench submit verify`** says of itself: "No Docker and no
  re-execution: the recorded test output is the evidence, and grading it is
  deterministic." It re-grades the recorded test output. It does not re-run
  anything, and it never sees the agent's container.
- **The maintainer's own run** is `checked: null` in its metadata. Whether the
  page shows it with the mark was not visible.

**2. How long ago.** Pull request #475 and the entry were merged 2026-09-01,
23 days ago. The image tag it names was re-pushed 2026-08-13, 42 days ago.

**3. How it relates to what has already been read.** Level 2, item 2 traced
the paper's leak to Epoch's pre-fix images, pulled by the Inspect Evals port.
This is the counter-case on the official leaderboard: the team's own scaffold
pulls upstream's cleaned image, and says so in the trajectory. **Whether a
run leaked can be read, one task at a time, from a trajectory file**, and not
from the leaderboard.

**4. What through-line it changes.** It qualifies "a benchmark is also its
image digest" (Level 2). **Where the environment is recorded at all, it is
recorded by the scaffold, as a tag, per task.** The leaderboard's
verification layer, both "checked" and `verify`, stops at the grader.

**5. What to research next.**
- **Scan all 500 trajectories of the 2026-09-01 entry for git-history
  commands.** The trajectories are 390-680 kB each, in
  `john-b-yang/20260901_mini-v2.4.2_gemini-3-5-flash/trajs/`. Count tasks
  whose commands include `git log --all`, `git show <sha>`, `git reflog` or
  `git fsck`. Check each hit against the task's gold fix commit. That is the
  first leak rate on an official-leaderboard run, in the same unit as the
  AISI paper's. It needs a driver's clone.
- **Whether other scaffolds' trajectories name their image.** Take one recent
  Verified entry each from OpenHands, SWE-agent and one closed-source
  scaffold, all on `s3://` or self-hosted. Open one trajectory from each and
  record whether it carries an image name, a tag or a digest, and where.

**6. Source.** From open search.
- [`metadata.yaml` via commit `69f10990`](https://api.github.com/repos/SWE-bench/experiments/commits/69f10990):
  **full file read**. The patch came back verbatim.
- [Pull request #475](https://github.com/SWE-bench/experiments/pull/475):
  **full page read**, summarising.
- [The entry README](https://raw.githubusercontent.com/SWE-bench/experiments/main/evaluation/verified/20260901_mini-v2.4.2_gemini-3-5-flash/README.md):
  **full file read**, summarising. The two quoted figures came back
  verbatim.
- The [artifact repository](https://github.com/john-b-yang/20260901_mini-v2.4.2_gemini-3-5-flash)'s
  root, `logs/django__django-16950/` and `trajs/` listings: **full file
  read**, as API JSON. The `trajs/` listing showed 100 entries, which is the
  API's default page, not the total.
- [`django__django-16950.traj.json`](https://raw.githubusercontent.com/john-b-yang/20260901_mini-v2.4.2_gemini-3-5-flash/main/trajs/django__django-16950.traj.json):
  **full file read**, through a summarising fetch. It quoted the image string
  and the one git command.
- [`swebench/submit/verify.py`](https://raw.githubusercontent.com/SWE-bench/SWE-bench/main/swebench/submit/verify.py):
  **full file read**. The docstrings came back verbatim.

**7. Verified / inferred / assumed.**
- **Verified:**
  - the entry's metadata;
  - the 359/500 and the 59 without a patch;
  - the image string and its `:latest` tag;
  - the `verify` docstring;
  - the legend wording and the README's "checked" procedure.
- **Verified, with a caveat:** that the django-16950 trajectory has no
  git-history command. A summariser searched a file of about half a megabyte
  for it, and one file is one task.
- **Inferred:** that `:latest` resolved to the 2026-08-13 image. The run
  predates 2026-09-01, and a pull cached from before the re-push would give
  the older one.
- **Inferred:** that mini-SWE-agent 2.4.2 writes the image into every
  trajectory it saves. Only one was read.
- **Not established:** whether the page renders this entry with the "checked"
  mark. `checked: null` is falsy in `get_leaderboard.py`'s
  `.get("checked", False)`, but the site's data file could not be read to the
  entry.

---

### 3. In-window challenges to the leaderboard ask for provenance, and none has an answer yet

**1. What it is.** Four in-window items, each asking something the entry
schema cannot answer. None has a maintainer reply.

- **arXiv:2609.17394**, "Coding Agents Have Converged" (Liu, Liu, Sun, Luo
  and Guo, v1 2026-09-15). It audits "254 SWE-bench submissions across four
  splits without running models", from "the leaderboard as retrieved on 30
  July 2026".
  - It finds "Only 61 of 134 Verified submissions (46%) carry a single usable
    model tag".
  - It recommends that "a structured (model,scaffold,version) field — plus
    attempts, and whether the harness was modified — would let anyone
    reproduce Section 4 without hand normalisation."
  - Its paired tests rest on one premise: "every entry was graded by the same
    official harness on the same instances". Nothing in an entry records
    that. The paper does not mention git history, Docker images, Epoch or
    Inspect.
- **`experiments` issue #488**, "Detecting harness artifacts in published
  results" (abhinavsv3, 2026-09-18). It fits "logit(p[s,r]) = ability[s] +
  easiness[r]" across 122 submissions and 9 repositories. Its premise is that
  "Infrastructure failure can only make a submission _fail_, never succeed".
  - Two cells pass z ≥ 4. One is **the 2026-09-01 entry on matplotlib**:
    observed 3%, expected 65%, n=34.
  - So the one in-window Verified entry is flagged as a probable environment
    failure. Nothing in its metadata could confirm or rule that out.
  - This method detects failures that *lower* a score. It cannot detect a leak
    that *raises* one.
- **`experiments` issue #482**, "Eligibility clarification: independent
  open-source harness submissions" (2026-09-12). It asks whether independent
  submissions remain welcome on Lite under the 2025-11-18 policy, and
  describes blocking github.com by DNS during runs. No reply.
- **SWE-bench issue #665**, "Harness reproducibility" (2026-09-19). It lists
  "cache leakage past base commit" among the environment faults. It asks
  "whether SWE-bench already has a preferred place in reports or docs to mark
  _harness/boot fidelity_ separately from _patch quality_". No reply.

**What the rules require of the environment.** The checklist's four boxes are:
- pass@1;
- no `PASS_TO_PASS` or `FAIL_TO_PASS`;
- no `hints`;
- "Does not have web-browsing OR has taken steps to prevent lookup of
  SWE-bench solutions via web-browsing".

**The last box is about the network. Nothing covers reading the answer out
of the local git history.** The README describes `swebench eval` and
`swebench submit` as *the* route, but no sentence found says that results
from another harness are refused. Since 2025-11-18, Verified accepts only
submissions with "a link to an arXiv preprint or technical report" and an
author "affiliated with an academic institution or established research lab"
(Background).

**2. How long ago.** The paper is 9 days old (2026-09-15). Issue #488 is 6
days old (2026-09-18), #482 is 12 (2026-09-12) and #665 is 5 (2026-09-19).

**3. How it relates to what has already been read.** Level 1, item 3 found
the benchmarks' maintainers silent on the AISI paper. Here, too, the
leaderboard's own tracker has four open questions about provenance or
environment fidelity, and no answers. The 2609.17394 audit is the first
source read in this path that asks, independently, for a version field. It
asks for the *scaffold's* version, where this path's question is the
*image's*.

**4. What through-line it changes.** It adds to "a benchmark is also its
port" a statement about citing. **A leaderboard is also its metadata
schema.** Comparisons that assume a common harness, such as 2609.17394's
paired tests and #488's residuals, inherit that assumption unchecked. The
schema does not record it.

**5. What to research next.**
- **Test #488's matplotlib flag directly.** In the 2026-09-01 entry's `logs/`,
  read `report.json` for the 34 matplotlib instances. Count how many have
  `infra_failure: true` or `patch_successfully_applied: false`, and open two
  `test_output.txt.gz` files. That separates an environment failure from a
  model weakness on the one entry this level could read.
- **Whether 2609.17394's field proposal or #665's question gets an answer.**
  Watch `SWE-bench/experiments` `checklist.md` and `validate_entries.py` for a
  `version` or `harness_modified` key. Watch issues #482, #488 and #665 for a
  maintainer reply. Check the paper's released "partition, audit protocol"
  repository for a proposed schema.

**6. Source.** From open search.
- [arXiv:2609.17394 abstract](https://arxiv.org/abs/2609.17394): **full page
  read**. [HTML](https://arxiv.org/html/2609.17394v1): **full page read**,
  over two summarising fetches, for the quoted passages and the term check.
- [Issue #488](https://github.com/SWE-bench/experiments/issues/488),
  [#482](https://github.com/SWE-bench/experiments/issues/482) and
  [SWE-bench #665](https://github.com/SWE-bench/SWE-bench/issues/665): **full
  page read**, summarising.
- [`experiments` issues since 2026-06-26](https://api.github.com/repos/SWE-bench/experiments/issues?state=all&since=2026-06-26T00:00:00Z&per_page=50)
  and [SWE-bench issues since 2026-06-26](https://api.github.com/repos/SWE-bench/SWE-bench/issues?state=all&since=2026-06-26T00:00:00Z&per_page=60):
  **full file read**, as API JSON.
- `checklist.md` and the README, as in item 1.

**7. Verified / inferred / assumed.**
- **Verified:**
  - the paper's dates, snapshot date and quoted sentences;
  - #488's formula, flagged cell and date;
  - the dates and questions of #482 and #665;
  - the four checklist boxes;
  - the 2025-11-18 policy wording.
- **Verified, with a caveat:** "no maintainer reply" on #482, #488 and #665.
  Each was a single page fetch.
- **Inferred:** that the README does not require the official harness. That
  rests on no sentence found saying so, across four summarising fetches of
  the README.
- **Inferred:** that the 2026-08-09 rewrite partly answers 2609.17394's model
  and scaffold complaint, since its snapshot is 30 July. The `version` and
  "harness was modified" parts are unanswered.

---

### 4. Epoch's hub and HAL: neither publishes an image per entry, and neither moved in the window

**1. What it is.** The two other widely cited sources of SWE-bench Verified
scores, checked for the same question.

**Epoch AI's benchmark hub** runs SWE-bench Verified itself. That makes it
the opposite case to swebench.com: one harness for every score.
- **Methodology.** "484 samples" of the 500. It runs "within a barebones
  Linux-based Docker container" with "no network access", and removes git
  history "after that sample's original GitHub issue" (Level 2).
- **Its own version number**, v2.0.3. The last changelog entry is dated
  **2026-03-06**. "Our default graph view above only displays results from
  v2.0.0 onwards."
- **Other scaffolds.** It also carries "results from other scaffolds, such as
  Claude Code or Codex, evaluated via Inspect-SWE".
- **What the about page says:**
  - on logs: "You can see model outputs by clicking the link in the 'log
    viewer' column";
  - on pinning: "In the future, we plan to pin each benchmark run to the exact
    git revision for full auditability";
  - on external scores: they are sourced "directly from official leaderboards
    maintained by the benchmark creators", with "the provenance of each data
    point in the Source and Source link columns".
- **No image or digest per entry** was found.

**HAL**, Princeton's Holistic Agent Leaderboard, runs "SWE-bench Verified
Mini", "a random subset of 50 tasks".
- **Per row** it shows the agent, the model, a verification checkmark,
  accuracy and cost with confidence intervals, the number of runs, and
  downloadable encrypted traces.
- **No image or harness version per row.** The page links `hal-harness`.
- **It is paused:** "We have paused updating HAL leaderboard with new models."
  The latest entries seen are dated 2025-09-29 and 2025-10-01.

**2. How long ago.** Nothing in the window. Epoch's last methodology change is
202 days old (2026-03-06). HAL's newest entry is about 358 days old. Both are
**Background**, and for this question **nothing moved**.

**3. How it relates to what has already been read.** Level 2 found that Epoch
cleans history at run time, and that the Inspect Evals port reuses Epoch's
images without that step. On Epoch's own page, a score is tied to a
benchmark version and a log, which is more than swebench.com offers. But it is
still not tied to an image. Pinning the run to a git revision is stated as a
future plan.

**4. What through-line it changes.** None new. It confirms that **no widely
cited source of SWE-bench Verified scores records the image per score.** The
difference between the sources is who ran the harness. On Epoch and HAL it
is always the publisher; on swebench.com it is the submitter.

**5. What to research next.**
- **Epoch's per-row fields for SWE-bench Verified.** Download
  `epoch.ai/data/benchmark_data.zip` (updated 2026-09-22, per a search
  summary). List the columns of the SWE-bench Verified internal-runs file.
  Check for a benchmark-version column, a scaffold column, a log link, and
  anything naming an image or revision. Count the rows below v2.0.0 that
  still appear.
- **Whether Epoch's Inspect-SWE runs (Claude Code, Codex, added 2026-02-13)
  apply the same run-time history removal.** Read the `inspect_swe` package's
  sandbox set-up for a git clean-up step. If it lacks one, Epoch's own page
  mixes cleaned and uncleaned runs under one benchmark version.

**6. Source.** From open search.
- [Epoch's SWE-bench Verified page](https://epoch.ai/benchmarks/swe-bench-verified):
  **full page read**, twice.
- [About](https://epoch.ai/benchmarks/about): **full page read**.
- [Use this data](https://epoch.ai/benchmarks/use-this-data): **full page
  read**. It carries no column documentation.
- [HAL SWE-bench Verified Mini](https://hal.cs.princeton.edu/swebench_verified_mini):
  **full page read**, summarising.
- The zip's date: **search summary only**.

**7. Verified / inferred / assumed.**
- **Verified:** Epoch's changelog dates and quotes, the about-page quotes,
  and HAL's paused notice and columns.
- **Inferred:** that Epoch's rows carry a benchmark version. The page filters
  its default view by version, but no column list was read.
- **Assumed:** that the about page's "In the future" plan is still current.
  The page is undated.

---

### What was dropped, and why

- **`experiments` issue #480** (2026-09-08). An older entry's
  `per_instance_details.json` marks all 500 instances unresolved against a
  69.6% headline. This is data integrity, not environment provenance. It
  sits beside item 3 as a sign that entry files go unchecked.
- **`experiments` issues #484, #490, #491 and #492** (2026-09-14 to 09-18).
  Thirteen historical files use the full test split's per-repository
  denominators (2,294) instead of Verified's 500. The same reason.
- **Pending pull request #487**, "Jesse / Weightless (Zero-Weight)"
  (2026-09-18). It claims "5 / 500 instances (1.0% pass@1…)" with
  `checked: null`, and names no image either. It is not merged, so it is not
  on the leaderboard.
- **Pull request #489** (2026-09-18). It adds a GitHub Actions workflow that
  runs `swebench eval verified`, and no `metadata.yaml`. It is not an entry.
- **SWE-bench's grading-bypass issues** #654, #655, #663 and #667 (2026-09-04
  to 09-23), where patches fake a pass. They are real validity flaws, but
  they are about the grader, not the agent's image.
- **The 2025-11-19 post "Detecting cheating in submissions"** on
  swebench.com, which gives a 6.7% average exact-match rate to the gold patch
  on Verified. It is Background, and it measures matching output, not how the
  answer was reached.
- **arXiv:2605.11030**, which records an "environment image digest" per
  release. It was seen only as a search summary, is dated May 2026, and is not
  SWE-bench's leaderboard.

### What was searched for and not found

- **Any field for an image, digest, `swebench` version or evaluation-harness
  version** in:
  - `checklist.md`'s `metadata.yaml` schema;
  - the `package.py` stub;
  - `submission.json`, `results.json` and per-instance `report.json`;
  - `validate_entries.py` and `get_leaderboard.py`;
  - the leaderboard template.

  None.
- **A submission rule about git history, future commits or the agent's
  container.** None. The only environment rule is the web-browsing box.
- **A statement that results must come from the official harness**, or that
  other harnesses are refused. None found in the README or checklist.
- **A maintainer reply** on `experiments` #482 or #488, or SWE-bench #665.
  None as of 2026-09-24.
- **Any SWE-bench or `experiments` commit, issue or pull request in the window
  mentioning image digests, git-history leakage or contamination in
  submissions.** None was found in:
  - the 29 SWE-bench commits since 2026-06-26;
  - the 22 `experiments` issues and pull requests;
  - the 19 SWE-bench issues and pull requests the listing returned.

  That last listing is incomplete: it did not include #581 (closed
  2026-08-12), which Level 2 read, so older in-window threads may be
  missing.
- **A `warning` value on any leaderboard entry.** None in the part of
  `leaderboards.json` that could be read. The file truncates under a page
  fetch.
- **Per-entry image or harness information on Epoch's or HAL's pages.** None.

> **Driver's check on level 3** (2026-09-24). 359/500 = 71.8%, re-computed.
> #488's matplotlib figure (3% observed against 65% expected, n = 34) is the
> issue author's and was not recomputed. Neither was the hand count of 29
> commits. The level's central claim is that no schema field names an image.
> It is an absence, and it rests on the subagent's reads of `checklist.md`,
> `validate_entries.py`, `get_leaderboard.py` and `package.py`. The driver
> did not repeat those reads.

## Where this path ends

The three levels together:
- **Level 1** found that the AISI scanner paper's human-confirmed
  ground-truth-access rate on SWE-bench Verified is 20.15% of transcripts.
- **Level 2** traced the git-history half of that rate to Inspect Evals
  running on Epoch AI's pre-fix images.
- **Level 3** found that the swebench.com leaderboard records nothing that
  would let a reader tell a run on such images from a clean one. It names
  model and scaffold, deliberately without versions. Its "checked" mark and
  its `verify` step stop at re-grading test output, and never see the
  container the agent worked in.

The one trace of the environment is a scaffold-written image *tag* inside
each trajectory, and a tag can move. So the chain from "20% of transcripts
leaked" to "this leaderboard score is inflated" cannot be completed from
public metadata. It can only be completed by opening trajectories.

**What remains open:**
- how the 36 graded transcripts split between issue-text leaks and git-history
  leaks;
- whether the two images differ as expected when started (P2-L2b);
- whether any official-leaderboard run shows git-history commands at all.

**The next lead**, if the path continued, is scanning the 500 trajectories of
the 2026-09-01 mini-SWE-agent entry for `git log --all`, `git show <sha>`,
`git reflog` and `git fsck`. It would give the first leak rate on an
official-leaderboard run, in the same unit as the AISI paper's, from files
that are already public.
