# Auto breadth - methodology for proving agentic AI efficacy - 2026-09-24

**Produced in auto-breadth mode** ([`docs/reader/auto-breadth.md`](../../../reader/auto-breadth.md)),
unattended, in the `auto-breadth` GitHub Actions workflow. A research subagent
wrote the breadth pass and each level of each path. The driver chose every lead
between levels and re-checked the numbers each level's conclusion rests on.
It also corrected claims where a later level or a primary source disproved
them. No person chose anything between the seed and this page. It is not a
brief on an adopted topic, and **nothing here changes `profile.md`**. The
candidate topics at the end are proposals.

| | |
|---|---|
| Seed | Methodology for proving agentic AI efficacy: study designs, evals and benchmark validity, and what organizations accept as evidence, with lessons from any agentic AI domain |
| Profile entry it serves | `efficacy-methodology` (Depth, under `agent-efficacy`), 0 runs |
| Parameters | width 5, paths 3, depth 3 - the defaults |
| Reached | breadth + path 1 to depth 3 + path 2 to depth 3 + path 3 to depth 3 = **10 of 10 runs**, no path stopped early |
| Window | 90 days, on or after 2026-06-26. Every subject here is a first appearance |

**Read this before the paths.** The network was open this time: `arxiv.org`,
GitHub (including its API), Hugging Face, `nist.gov` and `metr.org` all
answered. What this run lacked was a **shell**. Its sandbox could not start, so
neither the driver nor any subagent could:
- run a script;
- open a PDF or a source tarball;
- unzip a data archive;
- start a Docker image.

Every re-check below was done by hand, from numbers read off pages, SVG files
and tables. **Seven leads were displaced** for that reason and are listed as
displaced, not dropped. They are the obvious next spikes (end of this page).

---

## The headline across all three paths

**Each path followed one efficacy number down to its evidence, and each ended
at the same kind of gap. What decides whether the number means what it says
is not published with it:**
- which version of the paper, and which estimator;
- which Docker image the agent ran in;
- which outcome was counted, and what counted as a review.

The methods are mostly sound. Where the claims fail is in the provenance
metadata, and in every case the artefact that would settle it is either
unpublished or not recorded.

- **Reliability (path 1).** Thinkingbox is a Microsoft-led benchmark of 507
  business-workflow tasks, each run 20 times.
  - **The headline changed model between versions without a re-run.** v1 led
    with GPT-5.4: 65.36% on a single try, 25.25% when all 20 tries must
    succeed ("pass^20"). v2 leads with Claude Opus 5 at 66.50% and 47.53%.
    GPT-5.4's row is identical in both versions, but its pass^20 is gone from
    v2.
  - **The gap is per model.** Two models 1.14 points apart on one try are
    22.28 points apart on doing it every time.
  - **Code and paper disagree.** The reproduction tool computes a different,
    larger pass^20 than the paper prints. Every printed figure is a whole
    number of tasks out of 507 (for example 241/507 = 47.53). So the paper
    reports the literal "all 20 succeeded" share, and a rerun with the
    shipped tool will not match it.
  - **No per-task results are published**, so none of this can be
    re-derived. It can only be checked for consistency, and it passes.
- **Benchmark validity (path 2).** The UK AI Security Institute's audit
  scanners flag problem transcripts, and humans confirm them.
  - **Humans confirmed that 20.15% of SWE-bench Verified transcripts touched
    leaked answers.** SWE-bench Verified is the most-cited coding-agent
    benchmark. For CORE-Bench the rate is about 30% on each of three flaw
    types.
  - **The git-history half of the leak is a property of the harness.** The
    harness the transcripts ran on is Inspect Evals' port of SWE-bench. In
    February 2026 it switched to Epoch AI's smaller Docker images. Those
    images predate SWE-bench's own fix for readable future git history. The
    paper's own example transcript runs `git show` on the task's merged fix.
  - **The leaderboard cannot show it.** swebench.com records no image,
    digest or harness for any entry. Its "checked" mark re-grades patches and
    never sees the container the agent worked in.
- **Deployed-agent evidence (path 3).** Microsoft's in-house study reports
  **+24.0% merged pull requests per engineer per day [95% CI +14.5, +33.7]**
  from command-line coding agents.
  - **It has no quality outcome of any kind**, and the authors say so. The
    one in-window company study that does have one (CMU/Stanford, at a firm
    with a "2×" productivity mandate) measures quality with a within-author
    revert proxy.
  - **Human review at that firm fell from 89% to 68% of pull requests.** The
    only external estimate that could price that fall is Xia and Miller's.
    It is a weak cross-project association: 1.75 [1.01, 3.04] from 0% to 100%
    no-review, R² = 6%. It rests on a "no review" flag the paper never
    defines.
  - **The firm's share of pull requests with no review of any kind is
    unpublished.** The published shares bound it at 0-11% before the mandate
    and 0-16% after. **Not even the direction of the quality effect is
    known.**

**Where the paths met.** Paths 1 and 2 descended from different breadth
angles, cited no common source, and ended at the same structural point:
**the integrity guard lives in the harness, not the benchmark.**
- Thinkingbox's defence against an agent rewriting the graded state is in its
  own client. The server has no equivalent, so the gap reported on
  2026-09-21 is closed for agents run through `tb infer` and open for anything
  seated on the server directly.
- SWE-bench's defence against future git history is in upstream's images. The
  port that produced the audited transcripts does not use them.

A benchmark's name therefore does not identify the measurement. **Benchmark,
version, estimator, harness and image together do**, and no publication format
seen in this run carries all five.

**Through-line.** This extends X1's path 1, which is folded into
`efficacy-methodology`. X1 found one benchmark whose gold nobody outside its
authors had audited. This run found an audit tool, released labels and
released code. The next barrier is metadata that no format asks for, not
missing audits. The breadth pass's other finding stands beside this: NIST's
CAISI and a Meta team both use item response theory to aggregate agent
results. CAISI also now publishes inside the window, but its AI Agent
Standards Initiative still does not.

---

## The tree

```
Seed: methodology for proving agentic AI efficacy
└─ Breadth pass (0-breadth.md) - 5 angles, 10 leads
   ├─ 1 Deployed-agent field studies (Microsoft +24% PRs; CMU/Stanford 2×) ── PATH 3
   │    L1 Does +24% come with a quality outcome?        → no; authors concede it
   │    L2 Does missing review predict later burden?     → weakly, cross-project, flag undefined
   │    L3 How much of the firm's code got no review?    → unpublished; 0-11% → 0-16%, sign unknown
   ├─ 2 Benchmark audits (AISI scanners; HVTB; finality) ─────────────────── PATH 2
   │    L1 Per-benchmark flaw rates behind Figure 3      → read from released SVGs; SWE-bench 20.15%
   │    L2 Where SWE-bench's leaked answers came from    → mechanism uncounted; port runs pre-fix images
   │    L3 Can a leaderboard reader tell the image?      → no; no field anywhere
   ├─ 3 Grading: repeated, state-grounded, right method ──────────────────── PATH 1
   │    L1 Thinkingbox v1 against v2                     → headline model swapped, no re-run
   │    L2 Which pass^20 did the paper report?           → literal share (grid test); tool computes another
   │    L3 Can the agent reach the state-rewrite route?  → only an outside caller can
   ├─ 4 Meta's IRT subsets for a production analytics agent (not followed)
   └─ 5 CAISI's assessments; EU enforcement (not followed)
```

- [Breadth pass](0-breadth.md)
- [Path 1 - One success is not reliability: what Thinkingbox's revision changed](path-1-thinkingbox-reliability.md),
  three levels, ends with **Where this path ends**
- [Path 2 - How often an agent benchmark is broken, measured](path-2-benchmark-flaw-rates.md),
  three levels, ends with **Where this path ends**
- [Path 3 - What a deployed-agent study counts as the outcome](path-3-deployed-agent-outcomes.md),
  three levels, ends with **Where this path ends**

---

## Every lead, kept or dropped

The breadth pass left ten leads. The rules
([`auto-breadth.md`](../../../reader/auto-breadth.md), step 2) are applied in
order:
1. exclusion;
2. motion;
3. specificity;
4. spread;
5. not already reported.

Knowledge was not used. All ten leads fall inside `efficacy-methodology`.
None is excluded, and none is about cost as a subject.

| Lead | From angle | Decision | Why |
|---|---|---|---|
| L5 - Thinkingbox v1 against v2 | 3 | **Kept → path 1** | Strongest motion in the set. The driver checked both abstracts before picking and found that a revision inside the window (2026-08-29) changed the headline model and halved the gap the breadth item built on. Specific: two versions of one paper. |
| L3 - Figure 3 of the AISI scanner paper, as numbers | 2 | **Kept → path 2** | In window (2026-07-29), one figure away, and the general case of X1's path 1. Not already reported: it names what changed since X1 (audit tooling and released labels). |
| L1 - Does Microsoft's +24% report any quality outcome? | 1 | **Kept → path 3** | In window (2026-07-01/02), specific (one paper's outcome list), and the only deployed-agent causal evidence in the pass. It covers the seed's "study designs" third, which neither other pick does. |
| L7 - Run-to-run noise floor in Meta's IRT benchmarking paper | 4 | Dropped | In window and specific. Ranked below the three picks because the breadth pass itself expected it to resolve to a verified absence in one fetch, which would have stopped the path thin at level 1. **The drop most likely to be overruled.** |
| L9 - Appendices A1 and A4 of CAISI's GLM-5.2 assessment | 5 | Dropped | In window and specific. But it concerns cyber-capability assessment of one foreign model rather than evidence that a deployed agent works, and the appendix sits in a document form this runner could not open. **The second drop most likely to be overruled**, since CAISI is the only third-party evaluator in the pass. |
| L4 - HVTB score inflation per model | 2 | Dropped | Spread: same angle as path 2, while other angles had qualifying leads. |
| L6 - KDD 2026 agentic-evaluation workshop accepted papers | 3 | Dropped | Spread: same angle as path 1. Also less specific: a list to survey, not a question to answer. |
| L2 - Primary source of Demirer et al.'s "commits +180%, releases +30%" | 1 | Dropped | Motion: the primary's date is unknown, and only the synthesis quoting it is in window. Spread: same angle as path 3. |
| L8 - Origins of 2PL adaptive testing, and 2026 critiques on agent benchmarks | 4 | Dropped | Specificity: closer to a theme, and any critique's date is unknown. |
| L10 - The EU GPAI Code's "state-of-the-art model evaluations" requirement | 5 | Dropped | Motion: the requirement is from 2025. The breadth pass already verified that the AI Office has published no evidence standard since 2026-08-02. |

**Picks between levels.** Each pick had to be narrower than the lead above
it.
- **Path 1.**
  - **Level 2** took the estimator question (P1-L1e). It was load-bearing for
    every pass^20 comparison. Appendix D.1 had truncated in every fetch, and
    per-model tables do not exist.
  - **Level 3** took issue #35 (P1-L2g). It is dated 2026-09-21, so it has the
    most motion. It asks whether the graded state can be rewritten by the
    agent. The alternative, a search of the rest of the package, was
    evergreen.
  - **Displaced for want of a shell:** P1-L2a and P1-L2d (the LaTeX source).
- **Path 2.**
  - **Level 2** took the leak mechanism and harness (P2-L1b).
  - **Level 3** took leaderboard provenance (P2-L2f). It is anchored in the
    pipeline changes of 2026-08 and 2026-09.
  - **Displaced for want of a shell or Docker:** P2-L1a, P2-L1c, P2-L2a,
    P2-L2b and P2-L2c. Those are the 2.14 GB label dataset joins, the
    bootstrap recompute, and starting the two images.
- **Path 3.**
  - **Level 2** took Xia and Miller's no-review association (P3-L1e). It was
    the only in-window number that could price review thinning.
  - **Level 3** took the firm's "no review of any kind" share (P3-L2c). It
    decides the sign of that translation.
  - **Displaced:** P3-L2a and P3-L2b, which need a 51.4 MB Zenodo archive and
    an R refit.

---

## Stops, convergences, and corrections between paths

- **No path stopped early.** All three reached depth 3, which is 10 of 10
  runs.
- **Paths 1 and 2 converged in finding, not in source.** Both ended on "the
  integrity guard is in the harness, not the benchmark" (headline). They share
  no primary source, so neither stopped.
- **All three paths ended on a provenance field** that the publication format
  does not carry: version and estimator (1), image digest (2), and outcome and
  review definitions (3).
- **Corrections, made where each claim sits, not only here:**
  - **Breadth item 3** built on Thinkingbox v1: 65.36 / 25.25, a 40-point gap.
    It also recorded 47.53, 89.35 and 7.50 as "absent from the paper". **The
    driver found 47.53 in the v2 abstract** before picking the paths. Path 1
    then placed 89.35 and 7.50 in v2 too. v2's gap for its headline model is
    **18.97 points**.
  - **Path 1, level 1** presented pull request #22 as when the pass^k formula
    was set. **Level 2** found the formula in the initial commit
    (2026-05-16); #22 only relabelled it.
  - **Path 2, level 1** said the 401 SWE-bench test transcripts came from
    three models. **Level 2** found two: GPT-5.4 (201) and Sonnet 4.6 (200).
  - **Path 2, levels 1 and 2** dated the leaderboard's submission pipeline to
    SWE-bench 5.0.0. **Level 3** found it listed under Unreleased, committed
    2026-08-31/09-01.
  - **Path 3, level 1** inferred that Table IV's revert estimate excluded
    unreviewed pull requests. **Level 3** found that the table's "Human Review
    Coverage" row is an outcome, so the caption cannot describe every row's
    sample. The inference is withdrawn.
  - **Path 3, level 1** read Xia and Miller's result as "+8% corrective
    burden per 10 points of no-review". **Level 2** found two separate models:
    the +8% corrective figure has no review variable, and the review
    association is on all later modifications.
  - **Path 3, level 2** said the firm's no-review share "could have fallen".
    **Level 3** showed that it could equally have risen.
  - **Path 3, level 2** used 68% human coverage. On merged pull requests,
    Xia and Miller's denominator, **level 3** found **76%**.
- **Counts re-checked by the driver, by hand** (no shell). Each is written
  beside the subagent's figure in a "Driver's check" block:
  - **Path 1:** Table 4's weighted averages, including Qwen3.5-9B's printed
    5.84 against 5.401 recomputed; the `(c / n) ** k` code; and all ten grid
    matches.
  - **Path 2:** every test-set flag and confirmed rate, from SVG coordinates.
    SWE-bench's 20.2% is **20.15%** exactly. Also the 36/100 grade count, and
    the 50/50-strata impossibility.
  - **Path 3:** Table IV verbatim, including a row the level had not carried;
    Table VI's 1.01 lower bound; every multiplier; and the 0-11% / 0-16%
    bounds.
- **Not re-checked:**
  - path 2's development-set table;
  - Figure 6's 85% and Figure 12's 76% in the CMU/Stanford PDF, which were
    read from page images by one subagent;
  - the leaderboard-schema absence claims in path 2, level 3.
- **The page summariser misattributed or invented figures three times.** It
  put Thinkingbox's v2 figures on "another paper", misplaced a changelog
  entry, and invented a SWE-Lancer/OSWorld finding for the AISI paper. Each
  was caught against the page and is recorded in the level that caught it.

---

## Candidate topics

Written as the Interests entries they would become. **None is in the
profile.** A reaction adopts one, and the driver shows the diff first.

- **`repeated-trial-reliability`** · Depth, under `efficacy-methodology`.
  Whether an agent succeeds *every time*, not once. That covers pass^k and
  how it is estimated, per-model consistency gaps, which version and
  estimator a headline figure comes from, and whether per-task counts are
  released. *From path 1.*
- **`harness-provenance`** · Depth, under `efficacy-methodology`. Whether a
  benchmark score can be traced to the harness and image it ran on: audited
  flaw rates (human-confirmed, not scanner-flagged), leaks that belong to a
  port or an image rather than the task, and what leaderboards record.
  *From path 2.* It would absorb X1's `benchmark-provenance` proposal, which
  the reaction to X1 folded into `efficacy-methodology` rather than adopting.
- **`deployed-outcome-measures`** · Depth, under `efficacy-methodology`. What
  company rollouts of agents count as the outcome: throughput against quality
  and rework measures (reverts, follow-up fixes, maintenance hazard), and how
  review and oversight coverage is defined and linked to them. Any agentic
  domain counts. *From path 3.*

**Open questions that need someone other than a researcher.** Each needs a
shell, a download or Docker, which this run did not have:
- Recompute the AISI paper's confirmed rates with bootstrap CIs, and split
  SWE-bench's 36 graded transcripts by mechanism. This needs the 2.14 GB
  Hugging Face dataset joined to scan results; it is a script.
- Start Epoch's and upstream's `django__django-16950` images and test whether
  commit `eed096574f` is reachable in each. This needs Docker.
- Scan the 500 trajectories of the 2026-09-01 mini-SWE-agent leaderboard
  entry for `git log --all`, `git show <sha>`, `git reflog` and `git fsck`.
  It would give the first leak rate on an official leaderboard run. This
  needs a clone.
- Open Xia and Miller's Zenodo archive (51.4 MB) and find the no-review
  flag's definition. Refit Table VI leaving one project out at a time. This
  needs R.
- Untar Thinkingbox v2's LaTeX source for Appendix D.1's intervals and any
  pass^k formula.
