# Path 3 - What a deployed-agent study counts as the outcome

**Produced by a research subagent in auto-breadth mode.** It is not a profile
change, and nothing in it is an adopted topic. Index: [README.md](README.md).
The breadth pass this path descends from: [0-breadth.md](0-breadth.md), item 1,
lead L1.

**Window:** items are dated on or after **2026-06-26**. Older material appears
only as marked **Background**.

---

## Level 1 - Does Microsoft's +24% come with a quality outcome?

**Short answer: no.** Microsoft's paper reports **no** review-side or
quality-side outcome anywhere: no reverts, no pull-request size, no review
latency, no reviewer counts, no bugs. Its authors say so themselves. The paper
it cites to contrast its own result, He et al.'s Cursor study, is the one
earlier study that paired a velocity gain with a quality loss. Microsoft cites
only the velocity half of it.

The CMU/Stanford study is still the only in-window study of a company rollout
that reports both a throughput outcome and quality outcomes. But its quality
outcomes compare AI-labelled pull requests with the same author's other pull
requests, and they are estimated **only on merged pull requests that were
reviewed**. It has no defect or incident measure.

The post-merge quality measures these two studies lack do exist in the window,
in three studies of open-source repositories (item 3). A fourth study, from the
same CMU/Stanford group, reports velocity and quality together and finds the
quality cost varies about twofold between repositories (item 4). None of the
four studies a company's own rollout.

### 1. The +24.0% has no quality companion, and the source Microsoft contrasts itself with was the one that had one

**1. What it is.** A verified absence, from a full read of Microsoft's
"Adoption and Impact of Command-Line AI Coding Agents" (Murphy-Hill, Butler
and Savelieva, arXiv:2607.01418).
- **The outcome, in the paper's words** (Section 5, "The Outcomes Study"): "the
  count of *merged* pull requests, counting a PR as merged if it completes
  within 28 days of creation".
- **Where the data comes from.** Pull requests are measured on Azure DevOps,
  Microsoft's internal code hosting and review service, and only there.
- **What is absent.** Two fetches of the full HTML text searched for revert
  rate, pull-request size, lines or files changed, review latency, time to
  merge, reviewer count, comments per pull request, iterations, bug or incident
  linkage, build breaks and abandoned pull requests. **None is reported, for
  adopters or controls, in either design.** The designs are the CausalImpact
  synthetic control (Section 5.1) and the within-engineer Poisson panel
  (Section 5.2). "Revert", "bug" and "defect" do not appear in the text. The
  HTML version has **no appendix and no data or code availability statement**.
- **Where the authors address quality.** Three places:
  - **Abstract:** "We use merged pull requests as our proxy for output —
    acknowledging that a merged PR is not the same as the value it delivers".
  - **Section 6, Threats to Validity, under construct validity:** "Merged PRs
    are an imperfect proxy for throughput and reward small, frequent PRs; we
    may also miss quality costs such as added complexity."
  - **Section 8, Conclusion:** "The pressing open question is now about
    quality, whether this added throughput yields better software. The field
    still lacks agreed-upon measures to answer it, and building them should be
    a priority of the research community."
- **The backward edge.** In Section 7 (Discussion) the paper contrasts its
  lasting lift with reference [16]: "Our finding that the PR lift does not fade
  stands in contrast to He and colleagues, whose Cursor lift faded at month two
  and was gone by month three". Reference [16] is He, Miller, Agarwal, Kästner
  and Vasilescu, "Speed at the cost of quality: how Cursor AI increases
  short-term velocity and long-term complexity in open-source projects" (MSR
  2026). Cursor is an AI-first code editor.
  - Microsoft uses [16] only for its **velocity** result.
  - [16]'s **quality** result is what its title names, and Microsoft does not
    engage with it. The Section 6 phrase "added complexity" is the only point
    of contact.

**Background (out of window).** He et al., arXiv:2511.04427, v3 2026-01-26.
- **Design.** Difference-in-differences: **806** repositories that adopted
  Cursor against **1,380** matched controls, January 2024 to August 2025.
- **Velocity.** Commits **+55.4%** in the first month after adoption and
  **+14.5%** in the second, then back to baseline.
- **Quality.** Static-analysis warnings **+30.26% (±6.66%)** and code
  complexity **+41.64% (±7.62%)**, both persistent.
- **The link between them.** A dynamic-panel model finds that "a 100% increase
  in code complexity and static analysis warnings causes a 64.5% and 50.3%
  decrease in development velocity".

A second Microsoft paper, Heilman, Kyllo and Murphy-Hill (arXiv:2606.00438,
submitted 2026-05-30), reports "40.5% more PRs in their highest GHCP usage
weeks" across **16,223** engineers. GHCP is GitHub Copilot, the in-editor
assistant. Its abstract names no quality outcome either.

**2. How long ago.** 2026-07-01, 85 days.

**3. How it relates to what has already been read.** This settles lead L1 from
[0-breadth.md](0-breadth.md) item 1: **the +24.0% [+14.5%, +33.7%] stands
alone**. Breadth item 1 said the weak link was the outcome variable, not the
causal design. That now rests on the authors' own Section 6 and 8 sentences,
not on a reading across two papers.

It is also the pattern #26 item 4 (ERPBench) found in a benchmark: something
that is easy to count ("the task appeared to complete", or "the PR merged")
standing in for the outcome that matters ("the right value was written", or
"the software got better").

**4. What through-line it changes.** It sharpens breadth item 1's through-line
from "the outcome variable is the weak link" to **"the outcome variable is a
choice, and a visible one"**. The authors cite a paper whose whole finding is
that velocity and quality come apart after adoption. They take its velocity
half and leave its quality half.

A reader shown "+24%" can ask one precise question: **"He et al. measured
static-analysis warnings and complexity on the same kind of rollout. Why didn't
you?"** The paper's own answer is that the field lacks agreed measures. Items 3
and 4 show that four in-window studies measured quality anyway.

**5. What to research next.**
- **P3-L1a - Does the PDF of arXiv:2607.01418 carry appendices that the HTML
  rendering does not?** Fetch `arxiv.org/pdf/2607.01418` and check whether it
  has supplementary tables: pull-request size, completion time, the number of
  engineers in the synthetic-control and Poisson panels (the HTML gives none),
  or robustness checks on PR size. If there are none, the absence is final for
  v1. Also check the abstract page for a v2.
- **P3-L1b - Does per-tool pull-request size explain Copilot CLI's +24.9%
  against Claude Code's +11.4%?** Section 6 concedes the metric "reward[s]
  small, frequent PRs". Item 3's Kraishan study gives median changed lines per
  pull request by agent in open-source code: **Claude Code 495, Copilot 76**.
  Search the window for any source reporting PR size by tool inside one
  company. Then test whether a size difference of that order could produce a
  2.2× gap in merged-PR lift with no difference in work done.

**6. Source.** From open search. `arxiv.org` is on `sources.md`.
- [arXiv:2607.01418v1 full text](https://arxiv.org/html/2607.01418v1): **full
  page read**, fetched four times: for outcomes, for verbatim quality and
  review sentences, for the reference list, and for the abstract sentence.
- Background: [arXiv:2511.04427v3 full text](https://arxiv.org/html/2511.04427v3):
  **full page read** for its figures. [Its abstract page](https://arxiv.org/abs/2511.04427v3)
  was read for the version history.
- Background: [arXiv:2606.00438 abstract page](https://arxiv.org/abs/2606.00438):
  **abstract or landing page only**.

**7. Verified / inferred / assumed.**
- **Verified:**
  - the outcome definition;
  - the absence of every listed review and quality measure, and of an appendix
    or data statement, in the HTML v1;
  - the three quoted sentences and their sections;
  - reference [16]'s identity, and both sentences that cite it;
  - He et al.'s figures and dates;
  - Heilman et al.'s date, sample and 40.5% figure.
- **Inferred:** that Microsoft's use of [16] is selective. The paper never says
  why it leaves out [16]'s quality result. It is possible the authors judged
  open-source static-analysis measures to be inapplicable to Azure DevOps
  code.
- **Assumed:** that the HTML rendering is the complete v1. arXiv's HTML
  sometimes drops appendices, which is what lead P3-L1a checks. The absence
  claim holds for the text read.

---

### 2. The CMU/Stanford study does report quality, but only per pull request, only on reviewed ones, and with no defect measure

**1. What it is.** A full read of "AI Writes Faster Than Humans Can Review: A
Longitudinal Study of an Enterprise '2×' Mandate" (He, Agarwal,
Denisov-Blanch, Azaletskiy, Koyejo and Vasilescu, arXiv:2607.01904). The read
was for the quality-side measures and how they are built.

**How the two key things are identified** (both Section III-B):
- **AI-authored pull requests:** "We use the company's own created-by-ai PR
  label, an internal convention marking pull requests the firm attributes to
  AI; the exact mechanism by which the label is attached is internal to the
  company and outside our control." **30.2%** of the 196,212 non-bot pull
  requests carry the label (Appendix A).
- **Automated review:** accounts are flagged as bots by "lexical signals
  (username and email patterns matching known bots and service accounts)" and
  "behavioral signals (machine-generated branch names, single-repository
  activity, and templated, low-diversity event bodies)".

**How review is split** (Section IV-C). "Substantive" human review means a
review with a human-written comment: "its substantive part (reviews with a
human-written comment) fell from ∼39% to ∼21% of PRs while silent approvals
held roughly flat".
- **Any human review:** the share of pull requests receiving at least one fell
  **21 percentage points, 89% → 68%**.
- **Reviewer load:** doubled (**2.0×**), while the pool of developers acting as
  reviewers grew only **1.5×**.
- **Automated review:** rose from **~19% to ~84%** of pull requests (Figure 6).

**Throughput** (the per-developer figures are the ones breadth item 1 carried):
- **Per developer:** **21.2 → 44.3** pull requests a month, **2.09×**
  (Figure 4).
- **Company-wide volume:** up **3.1×** (Figure 4).
- **Within-developer estimate:** **1.46×** with calendar-month fixed effects,
  and **1.72×** in the baseline specification (Table II).

**Quality outcomes: Table IV**, "Per-PR effects of the created-by-ai label on
merged, reviewed PRs (Eq. 4)".
- **The model** (Equation 4) has author and calendar-month fixed effects and
  controls for log size and log file count. So each coefficient compares an
  AI-labelled pull request with the same author's unlabelled ones of similar
  size.
- **Coefficients in the post-mandate column:**

  | Outcome | Coefficient | Model |
  |---|---|---|
  | P(reverted) | **−0.067\*\*\*** (pooled −0.059\*\*\*) | linear probability |
  | P(merged) | +0.011 (marked with the paper's "+" symbol) | linear probability |
  | log(1+comments) | **+0.083\*\*\*** | log points |
  | Review rounds | −0.007, not significant | Poisson |
  | log(1+time from first review to merge) | **+0.181\*\*\*** | log points |
  | log(1+total cycle time) | **+0.202\*\*\*** | log points |

> **Driver's check** (2026-09-24). The driver re-read Table IV from
> `arxiv.org/html/2607.01904v1` as a whole table rather than cell by cell.
> P(reverted) is **−0.059\*\*\*** pooled and **−0.067\*\*\*** post-mandate, as
> above. Review Lead (the time from first review to merge) is +0.181\*\*\*.
> The table also has a row the level did not carry: **Human Review Coverage
> (LPM), −0.016 pooled and −0.002 post-mandate, neither significant.** That
> row sits oddly in a table captioned "merged, reviewed PRs".
> The table prints no standard errors and no N. The paper states no baseline
> revert rate and no revert-detection method anywhere the driver's fetch could
> find, so the coefficient **cannot be re-computed** from anything public. It
> is confirmed as printed and nothing more.

- **Pull-request size** (Table I, the developer-level difference-in-differences):
  log(1+average PR size) is **+0.317\*\*\*** on the "AI Adopted" row. The text
  says: "AI-authored PRs are if anything *larger* than human ones."
- **At the level of the whole firm,** the text says only: "The merge rate stayed
  essentially flat and the revert rate, if anything, declined" (Section IV-C).
- **What is absent:** a baseline revert rate, a stated method for detecting a
  revert, and any measure of defects, bug-fix pull requests, incidents or
  churn.
- **The authors' limitation** (Section V-C): "our throughput and merge- and
  revert-rate proxies miss the downstream costs of AI-generated code at
  scale—technical debt, diluted ownership and understanding, and the cognitive
  and intent debt that accrues when code outpaces the team's capacity to absorb
  it".

**2. How long ago.** 2026-07-02, 84 days.

**3. How it relates to what has already been read.** Breadth item 1 assumed
that "substantive review" meant what it sounds like. It means **a review that
carries a human-written comment**. That is an observable definition, but a
coarse one: one comment counts the same as a full review.

Breadth item 1 also said neither study checks what the merged change did. That
is almost right. This study measures one post-merge outcome, reverts, and
finds no rise. It still measures nothing downstream of a revert.

**4. What through-line it changes.** It qualifies breadth item 1's framing
that "the checking behind each change went down" as a count trading against
quality. What the paper shows is **review coverage thinning, with the per-PR
quality proxies it has not getting worse**. Reverts are flat or down, merge
rate is flat, and review rounds are flat. What got worse is latency: about
20% longer from first review to merge (+0.181 log points).

**The caveat is a selection one, and it is inferred.** Table IV is estimated
on "merged, reviewed PRs". By the end of the period, the pull requests with no
human review at all (**32%**, from 68% receiving one) are exactly where review
thinned. If they are excluded, the revert comparison does not cover them.

A company-rollout study that pairs throughput with quality now exists. Its
quality side is a **within-author, per-PR revert proxy on the reviewed
subset**. That is thinner than the item 3 instruments.

**5. What to research next.**
- **P3-L1c - Recompute Table IV's revert column of arXiv:2607.01904 from the
  HTML table.** Get the exact P(reverted) coefficients with their standard
  errors, and the estimation N. Check whether any appendix gives a baseline
  revert rate, since a −0.067 linear-probability effect is **−6.7 percentage
  points**. That is implausibly large unless the base rate is well above 7%.
  Find how a revert is detected, and confirm whether pull requests with no
  human review are excluded from Table IV.
- **P3-L1d - Appendix C-B ("Human-Review Composition") and C-D
  ("Organization-Level Latency") of arXiv:2607.01904.** Get the exact
  silent-approval and commented-review shares **split by AI-labelled against
  unlabelled pull requests**, pre and post mandate. Does the thinning fall
  disproportionately on AI-labelled pull requests? That is the one split that
  would connect review thinning to AI authorship, not to volume.

**6. Source.** From open search. `arxiv.org` is on `sources.md`.
- [arXiv:2607.01904v1 full text](https://arxiv.org/html/2607.01904v1): **full
  page read**, fetched four times. One of those fetches declined to reproduce
  the tables in full, so the Table IV coefficients come from two targeted
  follow-up fetches that asked for individual cells.

**7. Verified / inferred / assumed.**
- **Verified:**
  - the label and bot-detection quotes;
  - the substantive-review definition;
  - 89% → 68%, 2.0× and 1.5×, 21.2 → 44.3, 3.1×, and 1.46× / 1.72×;
  - the Table IV caption, and the six post-mandate coefficients as read cell
    by cell through a page-fetch tool;
  - Table I's +0.317 and its row;
  - the "essentially flat" sentence;
  - the Section V-C limitation;
  - the absence of any defect or incident measure.
- **Needs the driver's re-check:** the Table IV numbers were extracted cell by
  cell, not seen as a rendered table. The −0.067 is worth recomputing before
  anything builds on it (lead P3-L1c).
- **Inferred:** that the excluded no-human-review pull requests bias the revert
  comparison. The direction of any bias is not known.
- **Assumed:** that the "+" beside +0.011 is the paper's marker for p<0.10.

---

### 3. The post-merge quality measures the enterprise studies lack now exist in the window, and they cut both ways

**1. What it is.** Three in-window studies of agent-authored code in public
open-source repositories. Each measures what happens to code **after** it
merges.

**Xia and Miller, "Do These Violent Delights Have Violent Ends? Measuring the
Post-Merge Fate of Agentic Code"** (UIUC and George Washington University,
arXiv:2607.09902, 2026-07-10).
- **Scope.** **182** projects, May 2025 to May 2026, with lines from 15 named
  agents tracked through later commits.
- **How agent code is identified.** From commit metadata such as
  `Co-authored-by: Claude` trailers.
- **Results** (Table V hazard ratios, agentic against human lines):

  | Outcome | Hazard ratio [CI] | Significant? |
  |---|---|---|
  | Overall line termination | 1.11 [0.85-1.45], p=0.45 | no |
  | Corrective maintenance | **1.49 [1.05-2.12]** | yes |
  | Bug-fix termination | **1.51 [1.06-2.16]** | yes |
  | Revert | 1.42 [0.57-3.54] | no |

- **Line survival at 180 days** is higher for agentic lines, **75.8% against
  65.6%** (Figure 3a). "Nearly half of agentic line terminations are performed
  by agentic commits themselves."
- **At the repository level** (Section V-B, Figure 8), each **10 percentage
  points** more agentic code is associated with **+8%** corrective burden
  (odds ratio 1.08 [1.05-1.12]).
- **Review** (Table VI, Section VI-B): a 10-point higher no-review rate is
  associated with about **6%** higher maintenance burden.
- **What it does not measure.** It reports **no throughput outcome**. It names
  "number of merged pull requests" as one of the weak proxies that adoption
  decisions rest on.

**Takerngsaksiri, Duong and Barnett, "Who Finishes the Job? A Study of
Follow-Up Fixes and Commit Authorship on AI Coding Agent Pull Requests"**
(Deakin University, arXiv:2609.26847, 2026-09-22).
- **Sample.** **6,774** merged pull requests from five agents, against
  **5,044** human pull requests, in **891** repositories.
- **The data.** It comes from AIDev, a public research dataset of agent-authored
  GitHub pull requests.
- **What counts as a follow-up fix.** A later fix-type pull request that
  co-edits a file from the first within **30 days**. Candidates were verified
  by two human annotators on samples, then by an LLM judge.
- **Result.**
  - Verified fixes follow **4.5%** of agent merges (203 of 4,505) and **2.34%**
    of human merges, an odds ratio of **1.62 [1.10-2.39]**.
  - At the candidate stage the rates are **22.9%** against **14.7%**.
  - Agents fix their own merges **69.6%** of the time.
- **Time.** "Half of the 30-day incidence accumulates within the first week."

**Kraishan, "Not All Agents Are Equal: Code Quality and Post-Merge Maintenance
Across Five Autonomous Coding Agents in the Wild"** (Texas Tech,
arXiv:2609.17598, 2026-09-12).
- **Sample.** **33,596** agent pull requests against **4,027** human ones.
- **The data.** AIDev again, with pull requests from 2024-12-24 to 2025-07-30.
- **90-day revert rates** (Table 2), against a human baseline of **11.5%**:

  | Agent | Revert rate | Odds ratio | p |
  |---|---|---|---|
  | Codex | **6.1%** | 0.50 | <.001 |
  | Devin | **14.5%** | 1.31 | .004 |
  | Copilot | 12.5% | - | not significant |
  | Cursor | 11.4% | - | not significant |
  | Claude Code | 10.5% | - | not significant |

  Codex is OpenAI's coding agent, and Devin is Cognition's autonomous agent.
- **Median changed lines per pull request:** Claude Code **495**, Cursor 96,
  Copilot 76, Codex 63, Devin 61, human 52.
- **Its own caveat.** "Revert detection via commit message misses silent
  rewrites."

**2. How long ago.** 2026-07-10 (76 days), 2026-09-22 (2 days) and 2026-09-12
(12 days). The last two analyse data from 2024-12 to 2025-07. The papers are
in window, and their data is not recent.

**3. How it relates to what has already been read.** These are the measures
Microsoft's Section 8 says the field "still lacks":
- revert hazard;
- follow-up fixes;
- corrective-maintenance share;
- line survival.

They are defined, with confidence intervals, in public data. Xia and Miller's
Table VI is the only in-window result read that connects **missing review** to
**later maintenance burden**. That is the link item 2's thinning review series
needs and does not have.

**4. What through-line it changes.** It adds a qualifier: **quality results
are agent-specific and measure-specific, so a single "quality" number would
hide as much as a single throughput number.**
- Revert rates run from half the human rate (Codex) to above it (Devin).
- Line survival is *higher* for agent code, while bug-fix hazard is also
  higher.

An enterprise asking "what happened to quality" needs at least a revert
measure and a follow-up-fix measure, because they disagree.

**5. What to research next.**
- **P3-L1e - Xia and Miller's Table VI in arXiv:2607.09902.** Get the exact
  coefficient, CI and unit for the no-review-rate association. Find how "no
  review" is measured on GitHub (merged with zero review events?), and whether
  it is estimated within repository over time or across repositories. This is
  the one number that could turn CMU/Stanford's **39% → 21%** review series
  into a predicted quality cost.
- **P3-L1f - The follow-up-fix validation in arXiv:2609.26847.** Get the
  annotators' agreement (Cohen's kappa), the LLM judge's precision and recall
  against the human-labelled pairs, and the per-agent verified fix rates.
  Check whether the human baseline's shorter window (2025-01-01 to 2025-06-28,
  against the agents' 2024-12-24 to 2025-07-30) could shift the 1.62 odds
  ratio.

**6. Source.** From open search. `arxiv.org` is on `sources.md`.
- [arXiv:2607.09902v1](https://arxiv.org/html/2607.09902v1): **full page
  read**.
- [arXiv:2609.26847](https://arxiv.org/html/2609.26847): **full page read**.
- [arXiv:2609.17598](https://arxiv.org/html/2609.17598): **full page read**.

**7. Verified / inferred / assumed.**
- **Verified:** every figure, CI and table reference quoted, the dates, the
  data windows and the quoted limitations, each as read through a page-fetch
  tool. None of the three cites arXiv:2607.01418 or 2607.01904.
- **Inferred:** that these open-source measures would transfer to an
  enterprise rollout. The Kraishan and Xia-Miller limitation sections both
  warn they may not.
- **Assumed:** that the Kraishan human baseline revert rate of 11.5% is
  comparable across his agent groups, given merge rates that range from 43.0%
  to 82.6%. Pull requests that never merged cannot be reverted, so the
  comparison is over different selections.

---

### 4. A same-group study reports velocity and quality together, and the quality cost roughly halves where teams committed AI configuration

**1. What it is.** "A Few Pages of Markdown: Committed AI Configuration and
Lower Quality Cost after Coding-Agent Adoption" (Denisov-Blanch, Agarwal,
Azaletskiy, He, Schaeffer, Miranda, Vasilescu and Koyejo, Stanford, CMU and
Grid Dynamics; arXiv:2608.25241, v1 2026-08-26, v2 2026-09-14).
- **What RAMP is.** The paper introduces RAMP, a four-level maturity scale that
  reads what teams commit to configure AI tools: rules files such as
  `CLAUDE.md` or `.cursorrules`, then agent definitions, then orchestration.
- **The design** (Study 2). It re-estimates an existing open-source
  agent-adoption panel within each level, a staggered difference-in-differences
  using the Borusyak et al. imputation estimator. That panel is Agarwal et
  al.'s.
- **The sample.** **509** treated agent-first repositories: **236** at Level 1
  and **273** at Level 2+.
- **Results** (Table 5, Section 5.3.1):

  | Outcome | Level 1 (no committed configuration) | Level 2+ |
  |---|---|---|
  | Commits | **+37.56%** | **+27.52%** |
  | Lines added | +48.07% | +68.72% |
  | Cognitive complexity | **+52.70%\*\*\*** | **+26.68%\*\*** |
  | Static-analysis warnings | **+24.08%\*\*** | **+14.04%\*** |

- **What it does not measure:** reverts, bug-fix commits, review or incidents.
- **Study 1** covers "441 private GitHub repositories from 27 commercial
  organizations". It measures only how the levels are adopted, **not
  outcomes**. "73.8% of artifacts are committed once and never modified."
- **Limitations the authors state.**
  - Maturity is not randomly assigned.
  - Configuration committed *in response to* quality problems would bias the
    gradient downward.
  - Warnings "show elevated pre-treatment coefficients and are more weakly
    identified" (Section 7.2).

**2. How long ago.** v1 2026-08-26, 29 days. The HTML header also reads
"Received 2026-06-18", which is before the window. The arXiv submission is the
public date and is used here.

**3. How it relates to what has already been read.**
- **It is the direct successor of He et al.** (item 1's background). It sets
  its Level 2+ results against He et al.'s **30%** warnings and **41%**
  complexity as benchmarks, and finds them below both.
- **It shares six of its eight authors with the CMU/Stanford study in item 2**:
  He, Agarwal, Denisov-Blanch, Azaletskiy, Koyejo and Vasilescu, all six of
  that paper's authors.
  Of this level's in-window studies with a quality outcome, the CMU/Stanford
  and "A Few Pages" papers come from **one research group**. Xia and Miller
  share an author (Miller) with He et al. The Deakin and Texas Tech papers are
  independent.
- **It bears on this repository's own practice.** Committed agent configuration
  is exactly what `CLAUDE.md` and `.claude/skills/` are here.

**4. What through-line it changes.** It shows **the quality outcome is not a
constant a study can measure once**. It varies about twofold with something a
team controls, while velocity barely moves (+28-38% commits in both groups).
That is the strongest in-window reason why a deployed-agent study that reports
only throughput cannot be generalised. The same throughput gain arrived with
twice the complexity cost in one group.

It is still open-source code, not a company's rollout.

**5. What to research next.**
- **P3-L1g - The pre-trend on static-analysis warnings in arXiv:2608.25241.**
  Get the exact event-study coefficients before adoption for warnings and for
  complexity, by level, from the event-study figure or its appendix table. Is
  the "1.7×" warnings contrast still there once the "elevated pre-treatment
  coefficients" are accounted for? Did v2 (2026-09-14) change any Table 5
  figure against v1?
- **P3-L1h - Whether any outcome exists for Study 1's 441 private
  repositories.** Check arXiv:2608.25241's data-availability section and v2
  for commit or quality outcomes on the 27 commercial organisations. Also
  check whether the same group's "2×" firm in arXiv:2607.01904 is one of them.
  That would give one company with both throughput and a complexity measure.

**6. Source.** From open search. `arxiv.org` is on `sources.md`.
- [arXiv:2608.25241v1 full text](https://arxiv.org/html/2608.25241v1): **full
  page read**, fetched twice.
- [The abstract page](https://arxiv.org/abs/2608.25241): read for the version
  history and the abstract. **v2 was not read.**

**7. Verified / inferred / assumed.**
- **Verified:** the authors, both version dates, Table 5's figures, the sample
  counts, the private and open-source split between the two studies, the
  absence of revert or review measures, the 73.8% figure, and the quoted
  limitations.
- **Inferred:** that shared authorship limits how independent this is from
  item 2 and from He et al. Nothing suggests the results are wrong.
- **Assumed:** that v2's changes are minor. v1 and v2 are the same size,
  350 KB, but that proves nothing.

---

### What was searched for and not found

- **Any review-side or quality-side outcome in arXiv:2607.01418.** None,
  across two full-text reads that searched for each named measure. There is no
  appendix and no data statement in the HTML (item 1).
- **Another in-window study of a company rollout, in any domain, that reports
  both throughput and a quality or rework outcome.** Five searches covered:
  - coding: change failure rate, reverts, incidents, company telemetry;
  - support: first-contact resolution, reopen rate, repeat contact,
    escalation;
  - enterprise field studies generally.

  **None found besides arXiv:2607.01904.**
  - **Alibaba's customer-service field experiment** (arXiv:2605.14830) reports
    duration, retrial rates and ratings together. A search summary says AI
    "reduces average chat duration and has limited effects on retrial rates,
    but substantially lowers ratings". It is dated 2026-05-14 and 2026-06-01,
    outside the window, and was seen from a search summary only.
  - **DORA's 2026 AI ROI report** was seen only in search results dated May
    2026, also outside the window. DORA is Google Cloud's software-delivery
    research programme.
- **A response to, critique of, or replication of either paper inside the
  window.**
  - **Microsoft's paper:** only news and blog commentary (TechRepublic,
    Larridin, Developers Digest), seen as search summaries. Larridin's is
    framed around cost, which the profile lists as Not interested as a
    subject. None had new data.
  - **CMU/Stanford's paper:** a 2026-07-29 post by Sylvain Kalache, read in
    full, discusses the review bottleneck but cites neither paper and has no
    data of its own. A GitHub issue on `wikicommit/ai-driven-dev-wiki`
    (#270, 2026-09-19), read in full, is an auto-generated review-tracking
    template with no content.
  - **Citations:** none of the four in-window quality studies cites either
    paper. **The two headline papers do not cite each other.** Both cite
    Heilman et al.
- **A baseline revert rate and a revert-detection definition in
  arXiv:2607.01904.** Neither is stated in the text read.
- **Throughput outcomes in the open-source quality studies.** Xia and Miller,
  Takerngsaksiri et al., and Kraishan report none. Only arXiv:2608.25241 pairs
  the two, and on open-source repositories.

### What was dropped, and why

- **Heilman, Kyllo and Murphy-Hill (arXiv:2606.00438).** A Microsoft
  dose-response study of GitHub Copilot that both headline papers cite. It is
  dated 2026-05-30, before the window, and was read only as an abstract. Used
  as background in item 1.
- **"AI Agent Pull Requests on GitHub: Frequency, Structure, and Merge Conflict
  Rates"** (arXiv:2607.04697) and **"How Do AI Coding Agents Contribute to
  Software Development?"** (arXiv:2607.21832). Both are in window by
  identifier, and both were seen only as search results. Their titles suggest
  descriptive open-source studies with no quality-after-merge or throughput
  design. Dropped for budget, not on substance.
- **"Adoption Telemetry" (arXiv:2608.23617)** and **"The Agent Incident
  Registry" (arXiv:2609.11030).** Seen as search results. One is about
  measuring adoption, the other about safety incidents. Neither measures
  efficacy outcomes.
- **The Faros survey figures in Kalache's post** (98% more pull requests,
  review time +91%, PR size +154%). They are secondhand, from a vendor survey
  about 2025, and the primary was not read.

---

## Level 2 - Does missing review predict later maintenance burden?

**Short answer: weakly, and not in a unit that transfers to the CMU/Stanford
firm.** Xia and Miller's Table VI number exists and is as reported: 10 points
more no-review goes with about 6% more burden. But three things about it
change what Level 1 took it to mean.
- **What it compares.** It is a **cross-sectional comparison of 177
  open-source projects**, not a change within one project over time.
- **What "burden" is.** It is each project's **hazard ratio for agentic
  against human lines, counting every later modification**. It is not
  corrective or bug-fix burden.
- **How weak it is.** Its 95% interval runs from **+0.1% to +11.8%** per 10
  points. It is the only one of six covariates to reach significance, and the
  whole model explains **6%** of the between-project variation.

What counts as "no review" is not defined in the paper. It is also not in any
file of the public replication package that could be read.

Read as a prediction, the arithmetic puts the CMU/Stanford firm's 21-point
fall in any human review at roughly **+12.5% [+0.2%, +26.3%]** on that
relative hazard, and its 18-point fall in substantive review at roughly
**+10.6% [+0.2%, +22.2%]**. Item 2 shows why neither should be quoted as a
predicted quality cost.

No other in-window study was found that estimates the effect of review
coverage, or of an AI reviewer replacing a human one, on defects, reverts or
maintenance for agent-authored code. Two in-window studies measure review
coverage and AI review at scale and stop short of any outcome (item 3).

### 1. Table VI is a between-project meta-regression on a relative, all-termination hazard ratio, and the "no review" flag is undefined

**1. What it is.** A full read of Section VI of Xia and Miller, "Do These
Violent Delights Have Violent Ends? Measuring the Post-Merge Fate of Agentic
Code" (arXiv:2607.09902). It was checked against the authors' public
replication package, `post-merge-reality` on GitHub, and its Zenodo archive.

**The design** (Section VI-A) has two stages.
- **Stage one.** "For each project in our dataset, we fit a Cox PH model to
  measure the agentic maintenance burden relative to human lines, expressed as
  a hazard ratio (HR)." A Cox proportional-hazards model estimates how fast an
  event happens in one group relative to another. The event here is a line
  being "terminated by a later commit", which means any later modification or
  deletion, with the same definition as RQ1a. The model is not restricted to
  corrective or bug-fix commits.
  - The package's `R_code/Data_Analysis_rq3.Rmd` has the per-project model as
    `coxph(Surv(survival_days_positive, event) ~ origin_commit_category, ...,
    weights = weight)`, with no other covariates. The paper says "we do not
    stratify or cluster based on repository because we compute a separate HR
    for each repository."
- **Stage two.** "We use each project's HR as the outcome weighted by their
  uncertainty (SE)" in a random-effects meta-regression across projects. A
  meta-regression pools per-study (here, per-project) effect estimates and asks
  whether study-level characteristics explain their spread.
  - The same file shows `rma(yi, sei, mods = ~ technical_debt_index_start +
    num_contributors + ai_source_code_share + test_file_change_share +
    ai_line_churn_share + no_review_rate, method = "REML", test = "knha")`.
    `rma` is the R `metafor` package's function, and `knha` is the
    Knapp-Hartung small-sample correction.
  - Coefficients are reported as `exp(beta)`.
- **Sample.** **177** of the 182 projects. Five were filtered out "with fewer
  than 100 tracked lines or 10 termination events in either groups".

**Table VI, as printed** (HR multiplier, 95% CI):

| Covariate | HR multiplier [95% CI] | Significant |
|---|---|---|
| Technical debt | 1.47 [0.92, 2.36] | no |
| Number of contributors | 1.00 [1.00, 1.00] | no |
| Agentic source code share | 0.72 [0.46, 1.13] | no |
| Test file change share | 1.90 [0.85, 4.26] | no |
| Agentic line churn share | 0.73 [0.40, 1.34] | no |
| **No review rate** | **1.75 [1.01, 3.04]** | **p<0.05** |

- **Model statistics:** I² = **100%**, R² = **6.0%**, F(6, 170) = 2.86,
  p < 0.05, 177 projects. No standard errors are printed. The CI is the only
  uncertainty given.
- **The unit.** The paper defines the covariate as "the proportion of merged
  pull requests during the observation window that received no code review".
  The code computes it as `sum(no_review_merged_pr_count) /
  sum(merged_pr_count)`, a 0-1 proportion with no rescaling. So **1.75 is the
  multiplier for going from 0% to 100% no-review**.
- **Per 10 points,** that is 1.75^0.1 = **1.058 [1.001, 1.118]**, which is the
  authors' "roughly a 6% increase in agentic maintenance burden, on average"
  (Section VI-B).
- **The denominator** is all merged pull requests in the project, not only
  agent-authored ones.

**What "no code review" means is not stated.** The paper does not say whether
an approval without a comment counts, whether the author's own review counts,
or whether bot or AI reviewers count. The package does not settle it either.
- **The Rmd file** reads a precomputed `combined_pr_no_review_monthly_metrics.csv`.
- **Files that do not compute the flag.** The files that could be read do not
  contain the step that builds it: `github_commit_scraper.py`,
  `export_scrape_tables.py`, `analysis.py` and `ai_code_proportion_rq2.py`.
  These were read raw, and the directory listings of `src/webscrape`,
  `dev/analysis` and `scripts` were also read.
- **What the export script carries.** `export_scrape_tables.py` carries
  per-PR `comments` and `review_comments` counts, behind an
  `--include-pr-analysis` flag. It is off by default.
- **The Zenodo record** (v1.0.0, 2026-09-13) is a single 51.4 MB zip that was
  not opened.

**Two more things Level 1 did not carry.**
- **Human code has no counterpart estimate.** The dependent variable is
  agentic *relative to* human lines in the same project. A project where
  missing review sped up the rework of both kinds of line equally would show
  no effect. So the result is about the **gap** between agentic and human code
  where review is missing, not about quality there in absolute terms.
- **Level 1's "+8% corrective burden" is a different model.** It comes from
  the Section V-B repository-month panel: a binomial GLMM, which is a
  regression for a proportion with a random intercept for each repository. Its
  outcome is corrective commits over total commits, and its predictor is
  lagged agentic code share. **That panel has no review variable.** So no
  in-window estimate links missing review to *corrective* maintenance
  specifically.

**The authors' caveat** (Section VI): "Our covariates are necessarily
incomplete and proxy-based ... the meta-regression should be interpreted as
identifying associations rather than fully explaining cross-project variation
in agentic maintenance burden." The paper has no separate threats-to-validity
section. Its limitations sit in Section IV-A.

**The forward edge.** A referee report on Pith, a paper-review site, dated
2026-07-14, makes the critique this table invites: "With essentially all
residual heterogeneity unexplained, the claim that project characteristics
(especially no-review) explain cross-project variation in agentic maintenance
burden is only weakly supported". It recommends that the authors "substantially
temper the interpretation that no-review is a robust structural driver rather
than one of several weak correlates". Who or what writes Pith's reports could
not be established, because its about page returned 403.

**2. How long ago.** Paper 2026-07-10, 76 days, v1 only. The Zenodo archive is
dated 2026-09-13, 11 days ago, and the Pith report 2026-07-14.

**3. How it relates to what has already been read.** Level 1 item 3 called
this "the only in-window result read that connects missing review to later
maintenance burden". That is still true, with three corrections.
- The burden is **all terminations, not corrective**.
- The comparison is **between projects, not over time**.
- The effect's lower bound is **+0.1%** per 10 points.

It also answers lead P3-L1e's "within repository over time or across
repositories" question: **across**. The repository-month panel is the other
model, and it has no review variable.

**4. What through-line it changes.** It adds one step to Level 1's "the outcome
variable is a choice" through-line: **the review variable is a choice too, and
this one is undefined.** A study that turns thinning review into a quality
cost has to say what counted as a review. The one in-window candidate does not
say.

**5. What to research next.**
- **P3-L2a - The no-review flag in the Zenodo archive of arXiv:2607.09902.**
  The driver should download `post-merge-reality-v1.0.0.zip` from
  zenodo.org/records/22736095 and find the script that writes
  `combined_pr_no_review_monthly_metrics.csv`.
  - Record the exact condition that marks a merged pull request as not
    reviewed: zero review objects, zero `review_comments`, or zero of both
    `comments` and `review_comments`.
  - Record whether review or comment authors of type `Bot` are excluded, which
    decides whether Copilot code review or CodeRabbit counts as review, and
    whether the pull request's own author is excluded.
  - Report the distribution of `no_review_rate` across the 177 projects: its
    minimum, median and maximum.
- **P3-L2b - Leave-one-out stability of Table VI's no-review coefficient.** If
  the archive contains `csv_full/` with the stage-two data frame, refit the
  `rma(..., test = "knha")` model from `Data_Analysis_rq3.Rmd`.
  - Drop each project in turn and report how many single-project exclusions
    push the lower CI bound of `no_review_rate` below 1.00. At 1.01 it is one
    project from non-significance in many specifications.
  - Refit with `no_review_rate` as the only moderator.

**6. Source.** From open search. `arxiv.org` is on `sources.md`; the others are
not.
- [arXiv:2607.09902v1 full text](https://arxiv.org/html/2607.09902v1): **full
  page read**, fetched three times: for Table VI and Section VI-B, for the
  variable definitions, and for the Cox event definition, the data collection
  and the limitations.
- [The abstract page](https://arxiv.org/abs/2607.09902): read for the version
  history, which shows v1 only.
- [The replication repository](https://github.com/post-merge-reality/post-merge-reality):
  README and directory listings read.
- [`R_code/Data_Analysis_rq3.Rmd`](https://raw.githubusercontent.com/post-merge-reality/post-merge-reality/main/R_code/Data_Analysis_rq3.Rmd):
  **full page read**, raw.
- **Full page reads, raw:**
  [`github_commit_scraper.py`](https://raw.githubusercontent.com/post-merge-reality/post-merge-reality/main/src/webscrape/github_commit_scraper.py),
  [`export_scrape_tables.py`](https://raw.githubusercontent.com/post-merge-reality/post-merge-reality/main/src/webscrape/export_scrape_tables.py),
  [`analysis.py`](https://raw.githubusercontent.com/post-merge-reality/post-merge-reality/main/dev/analysis/analysis.py)
  and
  [`ai_code_proportion_rq2.py`](https://raw.githubusercontent.com/post-merge-reality/post-merge-reality/main/dev/analysis/ai_code_proportion_rq2.py).
- [Zenodo record 22736095](https://zenodo.org/records/22736095): **landing page
  only**. The zip was not opened.
- [Pith page for 2607.09902](https://pith.science/paper/2607.09902): **full
  page read**. The page was read in full, but who wrote the report is not
  known.

**7. Verified / inferred / assumed.**
- **Verified:**
  - the two-stage design;
  - the `coxph` and `rma` calls;
  - the 0-1 unit and the absence of rescaling;
  - the six Table VI rows as returned by the page-fetch tool;
  - I², R², F and N;
  - the 177 = 182 − 5 filter;
  - the denominator of all merged pull requests;
  - the absence of a review variable in the Section V-B panel;
  - the quoted caveat;
  - the absence of a no-review definition in the paper and in the four
    package files read;
  - the Zenodo date and size.
- **Computed here:** 1.75^0.1 = 1.058, 1.01^0.1 = 1.001 and 3.04^0.1 = 1.118.
  The first matches the authors' "roughly 6%".
- **Needs the driver's check:** Table VI was returned by a page-fetch tool as a
  reconstructed table, not seen rendered. The 1.01 lower bound carries the
  significance claim, so it is the cell worth re-reading.
- **Inferred:**
  - that stage one's event is every termination, from the paper's statement
    that it reuses the RQ1a definition. The `event` column was not traced in
    code.
  - that the no-review flag is derived from the `comments` and
    `review_comments` counts the export carries. If it is, a bot's comment
    would count as review.
- **Unknown:** whether Pith's referee is a person or a model.

---

### 2. The translation to the CMU/Stanford firm, done carefully, gives a number that should not be quoted

**1. What it is.** The arithmetic lead P3-L1e asked for, and the reasons it
does not transfer.

**The coefficient.** ln(1.75) = 0.5596 for going from 0 to 1 on the no-review
proportion. The CI bounds are ln(1.01) = 0.00995 and ln(3.04) = 1.1119. A
change of Δ in the proportion multiplies the project's agentic-to-human
termination hazard ratio by exp(Δ × 0.5596).

| Reading of the firm's change | Δ no-review | Implied multiplier [95% CI] |
|---|---|---|
| Any human review, **89% → 68%**, so no human review goes 11% → 32% | +0.21 | exp(0.1175) = **1.125 [1.002, 1.263]**, about **+12.5%** |
| Substantive review, **~39% → ~21%**, so no commented review goes ~61% → ~79% | +0.18 | exp(0.1007) = **1.106 [1.002, 1.222]**, about **+10.6%** |
| Xia-Miller's own step | +0.10 | exp(0.0560) = 1.058 [1.001, 1.118] |

To give the multiplier a scale: applied to the pooled overall-termination
hazard ratio of **1.11** (Level 1 item 3, Table V), +12.5% would move it to
about **1.25**. That is illustration, not prediction. The pooled 1.11 has a CI
of [0.85, 1.45] that includes 1.

**Which firm definition matches.** Xia and Miller measure *any* review versus
none ("received no code review"), not review with a written comment. So the
**any human review** series, 89% → 68% (+21 points), is the nearer match. The
substantive series (+18 points) has no counterpart in their variable. It is
coarser in one way and finer in another: CMU/Stanford count a silent approval
as human review but not as substantive review.

**Why it may not transfer.** Four reasons, one of which could reverse the sign.
- **Bots.**
  - CMU/Stanford's human-review series excludes accounts flagged as bots by
    lexical and behavioural signals.
  - Their firm's **automated review rose from ~19% to ~84% of pull requests**
    (Level 1 item 2, Figure 6).
  - If Xia and Miller's flag counts a bot's review or comment as review
    (item 1: not known, and plausible from the fields the export carries),
    then in their unit the firm's share of pull requests with *no review of
    any kind* can have been at most **16%** post-mandate. It could have
    **fallen**, not risen. Under that reading the translation predicts no
    added cost, or a reduction.
  - CMU/Stanford publish no "no review of any kind" series to check it
    against.
- **Across projects, not over time.**
  - The coefficient compares projects with different average no-review rates
    across May 2025 to May 2026. It does not follow any project whose review
    thinned.
  - Projects that skip review may differ in ways the other five covariates do
    not capture: maturity, contributor mix, the kind of change merged. I² =
    100% and R² = 6% say most of the between-project variation is
    unexplained.
  - Applying a between-project slope to one firm's change over time assumes
    the two are the same. Nothing in either paper tests that.
- **Relative, all-termination outcome.** The firm's question is whether its
  code got worse. The coefficient answers a different one: whether agentic
  code is rewritten faster *relative to human code in the same place*. It
  counts refactors and feature changes as well as fixes.
- **Open source against enterprise, and a moving baseline.**
  - The 182 projects are public GitHub repositories.
  - The firm's pull requests run through its own review conventions, and
    30.2% are AI-labelled by an internal rule.
  - Item 3 shows that open-source review coverage of agent pull requests was
    rising steeply during Xia and Miller's own window. So their project-level
    average blends very different months.

**2. How long ago.** The inputs are dated 2026-07-10 (Xia and Miller) and
2026-07-02 (CMU/Stanford), 76 and 84 days. The arithmetic is today's.

**3. How it relates to what has already been read.** Level 1 item 2 found the
CMU/Stanford quality side thin, with a within-author revert proxy estimated
only on reviewed pull requests. This level found that the one external number
that could fill the gap is **between-project, relative, and undefined on the
very point, bots, where the firm changed most**. The two gaps do not cancel.

**4. What through-line it changes.** It turns Level 1's hopeful line, "the one
number that could turn the review series into a predicted quality cost", into
a finding: **no in-window evidence converts falling human review into a
quality cost for agent code**. The nearest attempt gives a number whose
interval spans roughly nothing to a quarter, and whose sign depends on how a
bot's comment is counted.

**5. What to research next.**
- **P3-L2c - The CMU/Stanford firm's "no review of any kind" share.** From
  arXiv:2607.01904, Figure 6 and Appendix C-B ("Human-Review Composition"), get
  the share of pull requests with **neither** a human **nor** a bot review, pre
  and post mandate, if it is printed. That is the only firm number in Xia and
  Miller's unit if their flag counts bots. If it is not printed, say so and
  give the joint human and bot coverage if the appendix has it.
- **P3-L2d - A within-firm, between-repository review-to-revert association in
  arXiv:2607.01904.** Check the appendices for any repository-level or
  team-level analysis relating human review coverage to revert rate or merge
  rate. The same design as Xia and Miller's stage two, inside one company,
  would be the transfer test this translation lacks. Also check whether Table
  IV's "Human Review Coverage (LPM)" row is an outcome or a sample restriction.

**6. Source.** Computed from item 1's figures and Level 1 item 2's CMU/Stanford
figures. The CMU/Stanford figures were not re-fetched at this level and rest
on Level 1's full reads of
[arXiv:2607.01904v1](https://arxiv.org/html/2607.01904v1) and the driver's
check.

**7. Verified / inferred / assumed.**
- **Verified:** the inputs, as cited in item 1 and Level 1 item 2.
- **Computed:** every multiplier in the table, and they check out:
  - exp(0.21 × 0.5596) = 1.1247;
  - exp(0.18 × 0.5596) = 1.1060;
  - exp(0.21 × 1.1119) = 1.2630;
  - exp(0.18 × 1.1119) = 1.2216.
- **Inferred:**
  - that the any-human-review series is the nearer match;
  - that a bot-inclusive flag would make the firm's no-review share fall.
    The "at most 16%" is 100% − 84% automated coverage. It assumes nothing
    about overlap with human review.
- **Assumed:** that a log-linear slope estimated on 0-1 proportions can be
  applied to a 21-point change. That is the model's own form, and it is
  untested this far from each project's mean.

---

### 3. Open-source review of agent pull requests rose while the firm's fell, and the in-window studies that measure review coverage or AI review stop before any outcome

**1. What it is.** Two in-window studies that measure the review side at
scale. A third reports review data it could not link to outcomes.

**Agarwal, Miller, Kästner and Vasilescu, "3100 Opinions on Code Review in an
AI World: Building Causal Theory from Practitioner Discourse"** (CMU,
arXiv:2607.07980, 2026-07-08). It has two parts: a causal theory built from
3,100 practitioner documents (grey literature) and an observational GitHub
analysis.
- **Sample.** **2,860** repositories and more than 2.5 million pull requests,
  from January 2020 to February 2026. Agent contrasts are "driven by activity
  from roughly May 2025 onward".
- **The definition, verbatim:** "*Review coverage* records whether a merged PR
  received any human review at all." Bot and AI reviewers do not count.
- **The series:** "the share of merged agent-authored PRs receiving no human
  review falls from over 50% in mid-2025 toward the steady human baseline of
  about 14% by early 2026".
- **Author-only review:** agent pull requests are "reviewed less
  independently, with 40.1% examined only by the developer who invoked the
  agent versus 21.5% of human PRs".
- **What it does not do.** It links none of this to defects, reverts, fixes or
  maintenance. The link to quality exists only as theory propositions, for
  example P1: "Higher review load decreases review depth, which impacts
  efficiency and effectiveness."
- **Its own limitation:** the analysis is "observational and cross-sectional;
  unobserved confounding factors may influence both agent adoption and the
  review outcomes". It cites neither arXiv:2607.09902 nor 2607.01904.

**Selvanayagam and Ghaleb, "AI-to-AI Code Reviews of GitHub Pull Requests"**
(ÉTS Montréal and Trent University, arXiv:2608.21311, 2026-08-21).
- **Sample.** **248,641** AI-authored pull requests that received at least one
  AI review, in **10,345** repositories, from 2024-01-01 to 2026-04-15.
- **The reviewers.** They include CodeRabbit, a commercial AI pull-request
  review app, and GitHub Copilot code review, GitHub's built-in AI reviewer.
  Gemini Code Assist, Codex, Amazon Q, Devin, Claude Code and PR-Agent are
  also covered.
- **Prevalence.** **8.8%** of agent-authored pull requests received AI review,
  a figure that grew "by over two orders of magnitude from 2025-Q1 to 2025-Q3".
- **What it does not do.** It measures prevalence, comment categories, volume
  and latency. It reports no merge, revert, defect or rework outcome, and
  states: "We do *not* analyze a matched human-authored control dataset". It
  cannot tell whether a human also reviewed a pull request.

**Kraishan (arXiv:2609.17598, Level 1 item 3)** reports per-agent human and
bot review figures, but "review records cover agent PRs only ... with
coverage from 5.4% (Codex) to 51.2% (Copilot)". So review is described (RQ5)
and **never modelled as a predictor** of reverts or churn.

**2. How long ago.** 2026-07-08 (78 days), 2026-08-21 (34 days) and 2026-09-12
(12 days).

**3. How it relates to what has already been read.**
- **Opposite directions.** The two review series in this path run opposite
  ways over the same months. In open source, agent pull requests with no human
  review fell from more than 50% to about 14% between mid-2025 and early 2026.
  At the CMU/Stanford firm, pull requests with no human review rose from 11%
  to 32% after the mandate.
- **Consequence for Xia and Miller.** Their 182 projects span May 2025 to May
  2026, and their no-review rate is one average over that window. So in the
  projects most like the ones 3100 Opinions sampled, it averages a period of
  steep change.
- **Shared author.** 3100 Opinions shares an author (Miller) with Xia and
  Miller. It shares two (Agarwal, Vasilescu) with CMU/Stanford.

**4. What through-line it changes.** It confirms that **review coverage is now
measured well and often, and its consequence is not**. The instruments to
make it a treatment exist in public data:
- per-pull-request human coverage;
- author-only review;
- AI-only review, at 248,641 pull requests.

No in-window study has put the outcome measures from Level 1 item 3
(follow-up fixes, bug-fix hazard, reverts) on the other side of it.

**5. What to research next.**
- **P3-L2e - The 3100 Opinions no-human-review series by month.** From
  arXiv:2607.07980, get the plotted monthly share of merged agent pull requests
  with no human review, May 2025 to February 2026, as exact values if a table
  or the replication data gives them. Also check whether its 2,860-repository
  sample overlaps Xia and Miller's 182 (`filtered_full_sample_repos.csv` in
  their repository). If it does, Xia and Miller's window-average covariate can
  be checked against a time-varying one for the same projects.
- **P3-L2f - Whether arXiv:2608.21311's data can carry an outcome.** Read its
  data-availability statement and the column list of its released dataset. Do
  the 248,641 AI-reviewed pull requests carry merge status, merge commit SHA or
  a repository identifier that would let a follow-up-fix or revert measure
  (Takerngsaksiri et al.'s 30-day co-edit rule) be attached? Is there any
  agent pull request **without** AI review in the release to serve as a
  comparison?

**6. Source.** From open search. `arxiv.org` is on `sources.md`.
- [arXiv:2607.07980v1 full text](https://arxiv.org/html/2607.07980v1): **full
  page read**, fetched twice. The second fetch was for verbatim definitions and
  figures.
- [arXiv:2608.21311v1 full text](https://arxiv.org/html/2608.21311v1): **full
  page read**.
- [arXiv:2609.17598 full text](https://arxiv.org/html/2609.17598): **full page
  read**, for its review section only.

**7. Verified / inferred / assumed.**
- **Verified:**
  - the quoted definitions and series;
  - 40.1% and 21.5%;
  - the sample sizes and dates;
  - the absence of outcome links in all three;
  - 8.8%;
  - the no-control statement;
  - the Kraishan coverage range.
- **Not verified:** section and figure numbers for the 3100 Opinions series.
  The fetch tool did not return them. An earlier paraphrase from the same page
  gave "~12%", but the verbatim sentence says "about 14%", which is used here.
- **Inferred:** that the two series running in opposite directions weakens
  transfer. The firm's figure covers all pull requests and the open-source
  figure covers agent pull requests only, so the two are not like for like.

---

### What was searched for and not found

- **A definition of "no code review" in arXiv:2607.09902** or in the four
  replication-package files read. The paper gives only "received no code
  review". The flag is precomputed in a CSV whose generating script is not in
  the readable parts of the repository.
- **Any in-window study estimating the effect of review coverage on defects,
  reverts or maintenance for agent-authored code, other than Table VI.** Five
  searches covered:
  - review coverage and reverts;
  - unreviewed or self-merged agent pull requests and bug-inducing commits;
  - AI reviewers replacing human review;
  - CodeRabbit and Copilot code review against post-merge defects;
  - industrial AI-reviewer deployments against incidents.

  **Not found.** The in-window candidates measure review without outcomes
  (item 3), or outcomes without review. Mazloomzadeh, Morovati and Khomh,
  arXiv:2607.21832, find agent pull requests *less* often bug-inducing than
  human ones by SZZ, an algorithm that traces bug-fix commits back to the
  commits that introduced the bug. Their full text, as returned, has no review
  analysis.
- **A study using an automated reviewer as the treatment.** None in the
  window. arXiv:2608.21311 is the nearest, and it has no outcome.
- **A support or operations analogue measuring oversight coverage against
  rework.** One search found vendor benchmark pages and Alibaba's field
  experiment (arXiv:2605.14830), already recorded at Level 1 as out of window.
  None measures review or oversight coverage as the treatment.
- **A published response from Xia and Miller to the Pith critique, or a v2.**
  The abstract page shows v1 only.

> **Driver's check on level 2** (2026-09-24, by hand).
> - **Table VI was re-read verbatim** from `arxiv.org/html/2607.09902v1`: "No
>   Review Rate 1.75 [1.01, 3.04]∗", with the other five rows as above and "I²
>   = 100%, R² = 6.0%". The 1.01 lower bound is as printed. The F statistic
>   did not appear in the driver's fetch.
> - **The arithmetic was re-done:**
>   - ln 1.75 = 0.5596;
>   - × 0.21 = 0.1175, exp = 1.1247;
>   - × 0.18 = 0.1007, exp = 1.1060;
>   - ln 3.04 = 1.1119, × 0.21 = 0.2335, exp = 1.2630;
>   - 1.75^0.1 = exp(0.05596) = 1.0576.
>
>   All match.
> - **Displaced, not dropped:** P3-L2a and P3-L2b need the 51.4 MB Zenodo zip
>   opened and an R refit. This runner has no shell.

### What was dropped, and why

- **"These Aren't the Reviews You're Looking For: How Humans Review
  AI-Generated Pull Requests"** (arXiv:2605.02273). May 2026, out of window,
  and seen only as a search result and through a secondary article.
  - **The secondary article.** A PR Lens guide dated 2026-08-26 relays its
    figure that "71.58% of review comments on agent pull requests came from
    agents". PR Lens is a vendor of pull-request diagram tooling.
  - **Why it stays out.** The guide reports no defect or revert link. It also
    carries a product call-to-action addressed to the reader, which was
    ignored.
- **Blog figures on AI code review.** A "25-35% decrease in production defect
  rates" and "78% of respondents reported more incidents" come from dev.to and
  news pages seen as search summaries. They are unsourced or from vendor
  surveys, and none has a study design.
- **"Test Coverage Analysis of Agentic Pull Requests"** (arXiv:2607.18057). In
  window, and seen only as a search summary. It is about test inclusion, not
  review.

---

## Level 3 - How much of the firm's code got no review of any kind?

**Short answer: the paper does not say, and nothing public lets anyone work it
out.** All 16 pages of the CMU/Stanford PDF were read in full, appendices
included. No page reports the share of pull requests that got neither a human
nor an automated review, before the mandate or after it, and the paper releases
no data or code. The published numbers allow only a range:
- **before the mandate,** somewhere between **0% and 11%** of pull requests
  had no review of any kind;
- **at the end of the window** (April 2026), somewhere between **0% and 16%**.

The change could therefore be anything from **a fall of 11 points to a rise of
16**. Level 2 said the share "could have fallen". That is true, but so is the
opposite: **the sign is not determined.** Run through Xia and Miller's
coefficient, the range gives a multiplier from **0.94 to 1.09**, anywhere from
about 6% less to 9% more relative maintenance burden. Two things in the paper
point toward the low end: its own wording, that automated review came "in
place of, not merely alongside" human review, and its note that the firm
started auto-approving pull requests late in the window. That lean is an
inference.

Two corrections to earlier levels come out of the same read.
- **Table IV's "Human Review Coverage (LPM)" is an outcome, not a sample
  restriction.** That proves the table's caption, "merged, reviewed PRs", cannot
  describe the sample for every row. Level 1 inferred that the revert estimate
  leaves out the pull requests with no human review. That inference is now
  unsupported either way.
- **Xia and Miller's variable is a share of merged pull requests.** On that
  denominator, the paper's human-review coverage at the end of the window is
  **76%, not 68%** (Figure 12). Level 2's 21-point change was measured on all
  pull requests.

### 1. The "no review of any kind" share is not published, and the published figures bound it at 0-11% before the mandate and 0-16% after

**1. What it is.** A verified absence, plus the bounds the published figures
allow. It comes from a full read of the PDF of He, Agarwal, Denisov-Blanch,
Azaletskiy, Koyejo and Vasilescu, "AI Writes Faster Than Humans Can Review"
(arXiv:2607.01904, v1).

**What Figure 6 prints** (page 8). It plots two monthly series, January 2025 to
April 2026, as a "share of PRs": "any human" review and "automated" review.
- **The end-point labels on the plot** read **68%** for any human review and
  **85%** for automated review.
- **The caption and the text say 84%.** The caption reads: "automated
  review—AI review bots (purple)—overtakes it shortly after the mandate,
  reaching 84%".
- The one-point gap between the plot label and the text is not explained.
- **The only sentence giving the start values** (Section IV-C): "The share of
  PRs receiving at least one human review fell 21 percentage points (89% to
  68%), while the share receiving an automated AI review climbed from ∼19% to
  ∼84%, overtaking human review shortly after the mandate—a progressive shift
  toward relying on automated review in place of, not merely alongside, human
  review".

**What is not printed anywhere in the 16 pages:**
- a share of pull requests with neither kind of review;
- a share with both kinds;
- a share with bot-only review or human-only review;
- a self-merged share.

The phrases "no review", "unreviewed", "self-merge" and "without review" do
not occur. The appendix section on human-review composition (C-B in the HTML
numbering) splits **only the human share**: "Figure 6 reports the headline
shift from human to automated review. Figure 10 decomposes the human share into
its substantive (written-feedback) and silent (approval-only) parts."

**What counts as automated review** (Section III-B).
- **An event.** A review event is automated "when its author is a flagged bot
  or its body matches a templated-tool pattern".
- **Which bots.** "AI review bots and deploy, coverage, and policy bots account
  for roughly 38% of review rows." The rule-set appendix lists `copilot` among
  the well-known bot names. So GitHub Copilot's reviews are automated here.
- **What the 84% counts.** The Figure 6 caption glosses automated review as
  "AI review bots". Whether events from deploy, coverage or policy bots also
  count toward the 84% is not stated.

**No data.**
- The paper has no data or code availability statement. Its footnote 1 says the
  company granted "research access to its internal, anonymized engineering and
  AI-tool data".
- The arXiv abstract page shows v1 only, with no code or data links.
- The first author's homepage lists only the PDF, the DOI and a BibTeX entry.

**The bounds.** Write H for the share with any human review, A for the share
with automated review, and N for the share with neither. Then
N = 1 − H − A + (the share with both). The share with both can be no smaller
than H + A − 1, since the two together cannot cover more than 100%, and no
larger than the smaller of H and A.

| Period | H | A | Least possible overlap | Greatest possible overlap | N, no review of any kind |
|---|---|---|---|---|---|
| Before the mandate | 0.89 | ~0.19 | 0.08 | 0.19 | **0% to 11%** |
| April 2026 | 0.68 | 0.84 (plot label 0.85) | 0.52 | 0.68 | **0% to 16%** (0% to 15% on 0.85) |

- **Lower bound.** In both periods H + A is above 1 (1.08 before, 1.52 after).
  So the two kinds of review *can* between them cover every pull request, and
  the lower bound is max(0, 1 − H − A) = **0**.
- **Upper bound, before the mandate:** 1 − 0.89 = **11%**. This is the case
  where every automated review fell on a pull request that a human also
  reviewed.
- **Upper bound, after:** 1 − 0.84 = **16%**. This is the case where every pull
  request a human reviewed also got an automated review. It is the brief's
  min(0.32, 0.16).
- **The change in N** runs from 0 − 11 = **−11 points** to 16 − 0 = **+16
  points**, or +15 on the plot's 85%.
- **One illustrative point, not an estimate.** If human and automated review
  landed on pull requests independently of each other, N would be
  0.11 × 0.81 = **8.9%** before and 0.32 × 0.16 = **5.1%** after, a fall of
  **3.8 points**. Nothing in the paper supports independence. Its "in place
  of" wording suggests the two substitute for each other, which would push
  both periods toward the lower bound.

**The same range, run through Level 2's translation.** Xia and Miller's
coefficient is ln(1.75) = 0.5596 per unit of no-review proportion, and the
upper end of its 95% CI is ln(3.04) = 1.1119.

| Change in N | Multiplier at 0.5596 | Multiplier at the CI's upper 1.1119 |
|---|---|---|
| −0.11, the largest possible fall | exp(−0.0616) = **0.940** | exp(−0.1223) = 0.885 |
| −0.038, the independence point | exp(−0.0212) = **0.979** | exp(−0.0423) = 0.959 |
| +0.16, the largest possible rise | exp(+0.0895) = **1.094** | exp(+0.1779) = 1.195 |

This holds only **if** Xia and Miller's flag counts a bot's review as a review.
Level 2 found that is not defined, and it is still undetermined. If their flag
counts only human review, the bot-inclusive range above is irrelevant, and the
comparable firm figure is the merged-PR human series in item 3.

**2. How long ago.** 2026-07-02, 84 days.

**3. How it relates to what has already been read.**
- **It answers lead P3-L2c.** The share of pull requests with no review of any
  kind is not printed, and neither is the joint human and automated coverage
  the lead asked for as a fallback.
- **It corrects Level 2 item 2.** "At most 16% post-mandate" stands. But the
  pre-mandate share can be anywhere from 0 to 11%, so a **rise** to 16% is
  exactly as consistent with the published numbers as a fall.
- **The forward edge adds nothing on this point.**
  - A Pith referee report dated 2026-07-03 repeats the 84% and 68% figures. Its
    main methodological request is event-study pre-trends and robustness to the
    Callaway-Sant'Anna estimator. Both are already in the paper's supplement
    (Figure 14, and Table VI's C&S column, +0.162). So the report does not
    appear to have read the supplement. It says nothing about overlap.
  - Leif Singer's 2026-07-17 post announcing a Paper Jam reading-group
    discussion is commentary with no data: "Merge and revert rates held
    steady, which you can read as reassuring or as unsettling, depending on how
    much you trust one machine to catch what another machine wrote."

**4. What through-line it changes.** Level 2 said the sign of the translated
quality cost depends on whether a bot's comment counts as review. **Even if
bots count, the published figures do not fix the sign.** It depends on how
much human and automated review overlap, which the paper does not publish. The
two gaps stack: Xia and Miller's flag is undefined, and the firm's joint
coverage is unreported.

One sentence in the paper raises the stakes of the missing number. Footnote 8
reads: "All PRs at the company are automatically deployed." A merged pull
request with no review of any kind goes to production with no check at all.

**5. What to research next.**
- **P3-L3a - The pre-mandate value of Figure 12's merged-PR human-review
  coverage series in arXiv:2607.01904.** The figure is vector graphics in the
  PDF. The driver can extract the navy series' path coordinates with a PDF
  tool and map them onto the right-hand axis, which runs from 70% to 100% and
  ends at the printed 76%. That gives the change in no-human-review share **in
  Xia and Miller's denominator**, which is what Level 2's translation needs if
  their flag excludes bots.
- **P3-L3b - Whether any month of Figure 6 has H + A below 1.** Extract both
  Figure 6 series by month the same way. A month where human plus automated
  coverage falls below 100% is the only thing that would give a lower bound on
  "no review of any kind" above zero. The extraction would also settle the 84%
  against 85%. The yield is likely to be low: the rendered plot shows
  automated review at roughly 15-20% in early 2025 and human review near 89%,
  so above 100% combined.

**6. Source.** From open search. `arxiv.org` is on `sources.md`.
- [arXiv:2607.01904v1 PDF](https://arxiv.org/pdf/2607.01904v1): **full page
  read**, all 16 pages as text and page images, including the appendices.
- [arXiv:2607.01904v1 HTML](https://arxiv.org/html/2607.01904v1): four targeted
  fetches. The fetch tool's copy truncated before the appendices, which is why
  the PDF was read.
- [The abstract page](https://arxiv.org/abs/2607.01904): read for the version
  history, v1 only, and for links.
- [Hao He's homepage](https://hehao98.github.io/): the paper's entry was read.
- [Pith report on 2607.01904](https://pith.science/paper/2607.01904): **full
  page read**. Who writes Pith's reports is still unknown (Level 2).
- [Leif Singer, "Upcoming Paper Jam"](https://leif.me/upcoming-paper-jam-ai-writes-faster-than-humans-can-review/):
  **full page read**.

**7. Verified / inferred / assumed.**
- **Verified:**
  - the Figure 6 labels (68%, 85%) and the caption and text figures (84%, 89%,
    ∼19%);
  - that no neither, both, bot-only or self-merged share appears in the 16
    pages;
  - the automated-event rule, the 38% of review rows, and `copilot` on the bot
    list;
  - the absence of any data statement, v2 or data link;
  - footnotes 1 and 8;
  - the Pith date and its request, and that the supplement already contains
    what it asks for.
- **Computed here:** every bound and multiplier above. The bounds follow from
  the two marginal shares alone and hold whatever the overlap is.
- **Inferred:**
  - that the overlap is closer to its minimum, from "in place of, not merely
    alongside" and the auto-approval sentence (item 3);
  - that the 84% against 85% gap is a rounding or averaging difference.
- **Assumed:**
  - that Figure 6's two series share one denominator. The caption says "share
    of PRs" for both. Figure 10 states its denominator as non-bot pull requests
    on the estimation sample, and Figure 6 does not state one;
  - that the "from ∼19%" start value refers to the same baseline months as the
    89%.

---

### 2. Table IV's "Human Review Coverage" row is an outcome, which shows the caption is not a sample rule for every row

**1. What it is.** The text that defines the row, and what it implies for how
Table IV was sampled.

**The definition, verbatim** (Section III-C, "Downstream models"): "We apply
Eq. 4 both to the review and cycle-time outcomes—comment count, review rounds,
review coverage, and the four DORA cycle-time phases of coding lead, pickup,
review lead, and total cycle (time and count outcomes in logs, review rounds via
Poisson)—and to the binary merge, revert, and any-review quality outcomes as
linear probability models (linear regressions on a 0/1 outcome, whose
coefficients read as changes in probability)."

**How the paper reads it** (Section IV-C): "were they merged with less scrutiny
they would draw less review—but review rounds and change-request counts are
flat, and AI PRs are *no less* likely to receive a human review than comparable
human ones (Table IV)."

So the row is an **outcome**: a 0/1 for whether a pull request received human
review, regressed on the AI label with author and calendar-month fixed effects
and size controls.
- **Pooled, −0.016.** AI-labelled pull requests were 1.6 points less likely to
  get a human review than the same author's unlabelled ones in the same month.
- **Post-mandate, −0.002.** The same gap is 0.2 points.
- **Neither is significant.**

**Why the caption cannot describe every row.** Table IV is captioned "Per-PR
effects of the created-by-ai label on merged, reviewed PRs (Eq. 4)".
- **Merged only.** In a sample of merged pull requests, P(merged) would be 1
  for every one of them. The table still prints a coefficient for it (+0.006
  pooled, +0.011 post-mandate).
- **Human-reviewed only.** In a sample of human-reviewed pull requests, human
  review coverage would be 1 for every one of them. The table still prints
  coefficients for it.
- **So the sample must differ by row.** The caption fits at most some rows.
  The latency rows are the likeliest, since review lead is defined from the
  first human review to merge or close. That is inferred.
- **What the paper does not say.** It never states which pull requests enter
  the revert row, and it prints no N for any row.
- **One wording tension.** Section III-C calls the outcome "any-review", while
  the row label and Section IV-C say "human". It is therefore not certain from
  the text whether a pull request reviewed only by a bot counts as covered.

**What this does to Level 1.**
- **The selection caveat.** Level 1 item 2 inferred that the revert comparison
  leaves out the pull requests with no human review, 32% of them by the end.
  The caption supports that. The coverage row shows the caption is not a
  uniform sample rule, so **the inference is now unsupported either way**.
- **A partial answer to lead P3-L1d.** On whether a pull request got any human
  review, the thinning does **not** fall disproportionately on AI-labelled
  pull requests, once author, month and size are held fixed. The split by
  substantive and silent review that P3-L1d asked for is not reported.
  - After the mandate about 90% of pull requests carry the label (Figure 3,
    end label 91%). So the comparison group is the remaining tenth.

**What the figures say about lead P3-L1c's revert base rate.** Level 1 found
no baseline revert rate stated. Figure 8 (page 8) plots the firm-wide monthly
revert rate, January 2025 to April 2026, on a right-hand axis that runs **0% to
5%**. The series stays inside that axis throughout.
- **Against the developer-level estimate.** Table I's developer-level
  difference-in-differences puts the "AI Adopted" effect on revert rate at
  **−0.004** (marked "+", the paper's p<0.10), against Table IV's per-PR
  −0.059 pooled and −0.067 post-mandate.
- **Read as a raw gap, the post-mandate −0.067 fits a sub-5% overall rate
  easily.** With about 90% of pull requests labelled, the overall rate is the
  labelled rate plus 0.10 × 0.067 = 0.0067.
- **The pooled −0.059 is tighter.** With 30.2% labelled across the whole
  window, the overall rate is the labelled rate plus 0.698 × 0.059 = 0.041. So
  under 5% overall, AI-labelled pull requests would have to revert at **under
  about 0.9%** and unlabelled ones at **above about 5.9%**.
- **The caveat on that arithmetic.** The pooled sample starts in January 2024,
  before Figure 8 does. The coefficient is conditional on author, month and
  size, not a raw gap. So this is a plausibility check, not a contradiction.

**2. How long ago.** 2026-07-02, 84 days.

**3. How it relates to what has already been read.** It settles the question
the driver's check on Level 1 left open, that the row "sits oddly in a table
captioned 'merged, reviewed PRs'". It sits oddly because it is an outcome, and
its presence is evidence that the caption is loose. It also moves Level 1's
selection caveat from "inferred" to "unknown", which is a weaker position, not
a reassuring one.

**4. What through-line it changes.** It adds to the path's recurring finding,
that the outcome and the sample are choices a reader cannot see: here **the
sample is not stated per row**. A reader cannot tell which pull requests the
headline "reverted slightly less" was estimated on.

**5. What to research next.**
- **P3-L3c - The review-coverage code in the replication package of
  arXiv:2607.07980 ("3100 Opinions").** It shares two authors, Agarwal and
  Vasilescu, with this paper, and defines coverage as "any human review at
  all". Find its data-availability link, then the function that computes
  coverage. Record whether it excludes bot accounts and the pull request's
  own author, and whether a silent approval counts. It is the nearest public
  implementation of what Table IV's row plausibly computes.
- **P3-L3d - Figure 8's monthly revert series in arXiv:2607.01904, extracted
  from the PDF's vector paths.** Get the pre-mandate and April 2026 revert
  rates. Then compute the labelled and unlabelled rates a raw gap of −0.059
  and −0.067 would require at each month's label share. That turns the
  plausibility check above into numbers.

**6. Source.** From open search. `arxiv.org` is on `sources.md`.
- [arXiv:2607.01904v1 PDF](https://arxiv.org/pdf/2607.01904v1): **full page
  read**. Sections III-C and IV-C, Tables I and IV, and Figures 3 and 8 were
  read in the same pass as item 1.

**7. Verified / inferred / assumed.**
- **Verified:**
  - both quoted definitions;
  - the Table IV caption, and all nine rows in both columns, now seen as a
    rendered table;
  - Table I's −0.004 and its "+" marker;
  - Figure 8's 0-5% axis;
  - Figure 3's 91% end label;
  - that no per-row N and no per-row sample statement exist.
- **Computed here:** 0.10 × 0.067 = 0.0067 and 0.698 × 0.059 = 0.041.
- **Inferred:**
  - that the caption fits the latency rows;
  - which reading of "any-review" against "human" the row uses. The label and
    Section IV-C favour human.
- **Assumed:** that the Figure 8 series is not clipped at the top of its axis.
  It visibly stays inside it.

---

### 3. On the denominator Xia and Miller use, merged pull requests, the firm's end-point human coverage is 76%, and the automated share is not given at all

**1. What it is.** The appendix figures that restate review coverage on other
denominators, and the one sentence about auto-approval.

**Figure 12** (page 14) plots "human-review coverage (navy, right), both among
merged pull requests". Its caption reads: "Monthly, on the estimation sample,
excluding bot-authored pull requests; rules as in Figure 3."
- **The end-point label is 76%,** on a right-hand axis that runs 70% to 100%.
  So by April 2026, **24%** of merged pull requests had no human review,
  against 32% of all pull requests in Figure 6.
- **The pre-mandate value is not printed.** The line starts near the top of
  the axis. Any figure read off the plot would be an eyeball, not a number.
- **No automated-review share among merged pull requests is given**, in this
  figure or anywhere else.

**Appendix D** ("Organization-Level Latency"): "What falls is the share of pull
requests routed through it: substantive-review coverage among merged pull
requests drops from a pre-mandate peak of ∼48% to ∼21%, and the fast bypassed
lanes pull the aggregate down even as the queue stays slow."

**Figure 10** (page 13) prints end labels of **47%** silent approval and
**21%** substantive review, "among non-bot pull requests on the estimation
sample".
- **The end values add up.** 47 + 21 = **68**, which is Figure 6's end value.
- **The start values add up.** The text's ∼50 + ∼39 = **89**, which is
  Figure 6's start value.
- **So the two categories appear to split "any human review" exactly.** A pull
  request with any commented human review counts as substantive, and otherwise
  as silent. That is inferred from the sums.
- **Silent approval fell slightly.** It ended at 47%, not the "∼50%" of the
  text.

**Auto-approval** (Section IV-C): "late in the window the company began
routing PRs through AI-driven review and auto-approval, collapsing
human-review latency for a growing share of PRs". The paper gives no start
date. A pull request that is auto-approved after an AI review is automated and
not human. So this is the pattern that keeps overlap low and pushes the share
with no review of any kind toward item 1's lower bound. Whether an
auto-approval event from a policy bot counts as "automated review" in Figure 6
is not stated.

**2. How long ago.** 2026-07-02, 84 days.

**3. How it relates to what has already been read.** Level 2 item 1 established
that Xia and Miller's covariate is "the proportion of merged pull requests
during the observation window that received no code review". Level 2 item 2
fed it the firm's all-PR change, +21 points.
- **On merged pull requests, the end point is 24% with no human review, not
  32%.** The change in that denominator depends on a start value the paper
  does not print (lead P3-L3a).
- **The firm's shares exclude bot-authored pull requests. Xia and Miller's
  denominator is all merged pull requests.** A second difference in
  denominator, in the same direction of uncertainty.
- **These figures are on the estimation sample**, developers with at least
  three active months (footnote 5). They are not on all 196,212 pull requests.

**4. What through-line it changes.** None new. It narrows Level 2's
translation. If Xia and Miller count only human review, the matching firm
number exists at the end point (24%) but not at the start. If they count bots,
the matching firm number does not exist at all (item 1). Either way, Level 2's
+12.5% rests on a denominator the source model does not use.

**5. What to research next.**
- **P3-L3e - A v2 or venue version of arXiv:2607.01904.** Check the arXiv
  listing and the dblp record for a camera-ready version, then compare Table
  IV's caption. Look for per-row Ns, a sample definition for each outcome, and
  any joint human and automated coverage series. The Pith request and the
  August Paper Jam are both occasions on which the authors may have been asked
  for these.
- **P3-L3f - Where the firm's range sits in Xia and Miller's own
  distribution.** From the Zenodo archive (lead P3-L2a), get the minimum,
  median and maximum of `no_review_rate` across the 177 projects. Then check
  whether the firm's 0-16% (bot-inclusive) or 24% (human-only, merged) falls
  inside the range the 1.75 coefficient was estimated on. Outside it, the
  translation is an extrapolation as well as a transfer.

**6. Source.** From open search. `arxiv.org` is on `sources.md`.
- [arXiv:2607.01904v1 PDF](https://arxiv.org/pdf/2607.01904v1): **full page
  read**. Figures 10 and 12, Appendix D and footnote 5, in the same pass as
  item 1.

**7. Verified / inferred / assumed.**
- **Verified:**
  - the Figure 12 caption, its axis range and its 76% label;
  - the Appendix D sentence;
  - Figure 10's 47% and 21% labels and its denominator;
  - the auto-approval sentence;
  - footnote 5;
  - that no automated share among merged pull requests is printed.
- **Computed here:** 100 − 76 = 24, 47 + 21 = 68, and 50 + 39 = 89.
- **Inferred:**
  - that substantive and silent split any human review exactly, from the two
    sums;
  - that auto-approval lowers the overlap.
- **Not stated:** the start date of auto-approval, and the pre-mandate value
  on Figure 12.

---

### What was searched for and not found

- **A no-review-of-any-kind, both-kinds, bot-only or self-merged share in
  arXiv:2607.01904.** None, across a full read of the 16-page PDF and four
  targeted fetches of the HTML. The HTML fetch truncated before the
  appendices; the PDF did not.
- **A replication package, dataset or plotted-series data for the paper.**
  - There is no availability statement in the paper.
  - There are no code or data links on the abstract page, and no v2.
  - The first author's homepage lists the PDF, DOI and BibTeX only.
  - A search for the title with "replication", "data", "github" or "zenodo"
    returned Zenodo packages for **other** papers only.
  - The data is described as internal company data shared under research
    access, so a release is unlikely.
- **An in-window critique or reanalysis addressing the review overlap, the
  Table IV sample or reverts.** Two searches found:
  - the Pith report, which asks for checks the supplement already has;
  - Leif Singer's post, commentary only;
  - the GitHub `wikicommit` template already recorded at Level 1.

  None engages with review coverage beyond repeating 84% and 68%.
- **The start date of the firm's auto-approval.** Given only as "late in the
  window".

### What was dropped, and why

- **"The New Bottleneck - When AI Writes Code Faster Than Humans Can Review
  It"** (dev.to). Seen only as a search result. Its title echoes the paper,
  but nothing suggested data of its own.
- **The Paper Jam discussion** of 2026-08-28. It was held under the Chatham
  House Rule, and no public record was found.

---

> **Driver's check on level 3** (2026-09-24, by hand). The share with no
> review of any kind is N = 1 − H − A + overlap, with the overlap between
> max(0, H + A − 1) and min(H, A).
> - **Before the mandate** (H = 0.89, A = 0.19): the overlap is 0.08 to 0.19,
>   so **N is 0 to 0.11**.
> - **After** (H = 0.68, A = 0.84): the overlap is 0.52 to 0.68, so **N is 0 to
>   0.16**.
> - **Multipliers:** exp(−0.11 × 0.5596) = 0.940 and exp(0.16 × 0.5596) =
>   1.094.
>
> All reproduce. Figure 6's printed 85% label against the text's 84%, and
> Figure 12's 76%, were read by the subagent from PDF page images. **The driver
> could not re-read them** (no PDF tooling in this runner), so they stand on
> one reading.

## Where this path ends

The three levels asked one question from three angles: when a deployed coding
agent doubles throughput, what shows the quality outcome? Microsoft's +24%
reports no quality outcome at all, and the one in-window company study that
does (CMU/Stanford) measures quality with a within-author revert proxy on a
per-row sample it does not state. The one external estimate that would turn
thinning review into a quality cost (Xia and Miller) is a weak, between-project
association on an undefined no-review flag. And the firm's share of pull
requests with no review of any kind, the number that estimate would need, is
unpublished and bounded only loosely: 0-11% before the mandate and 0-16% after,
so not even its direction is known. The path therefore ends on a verified
absence: no public number converts this firm's review shift into a quality
cost of either sign, and closing that gap needs either the authors' overlap
figure or the definition of Xia and Miller's flag. If the path continued, the
next lead would be **P3-L2a**, opening Xia and Miller's Zenodo archive, because
it decides which firm number matters at all: if their flag ignores bots, the
unpublished overlap stops mattering and the firm's merged-PR human series
(P3-L3a) is the input.
