# Path 2 - How often agent benchmarks are broken, and how you would tell

This path starts from the UK AI Security Institute's benchmark audit (breadth
angle 2) and follows one of its findings, leaked answers on SWE-bench Verified
(500 real GitHub issues that coding agents must fix). It asks where leaks come
from and whether a leaderboard would show them.

## Level 1 - Audits of benchmark flaws, and the tools behind them

### Generality-Labs/scanner_evaluation: code and labels for the AISI benchmark audit
[link](https://github.com/Generality-Labs/scanner_evaluation) · 2026-06-30 · repo · read in full

1. **What it is about:** The released code for the transcript-scanner paper in the breadth pass. It includes the paper's figures as files and links to the human labels on Hugging Face. The figures give flaw rates per benchmark.
2. **Why you're seeing it:** `efficacy-methodology` and `benchmarks-depth`: this is benchmark validity, measured.
3. **Seen before?** The [Snowflake exploration][snow]'s path 1 found a benchmark nobody had audited. Here the audit's own labels are public.
4. **Relates to:** the Inspect Evals changelog below.
5. **Takeaways for you:** About 30% of CORE-Bench runs had a confirmed flaw on each of three types. CORE-Bench asks agents to reproduce papers' results. About 20% of SWE-bench Verified runs had confirmed access to the answer. What scanners flag and what humans confirm can be far apart, so the confirmed rate is the finding.

### Inspect Evals changelog
[link](https://raw.githubusercontent.com/UKGovernmentBEIS/inspect_evals/main/CHANGELOG.md) · 2026-09-17 · repo · read in full

1. **What it is about:** Inspect is the UK AI Security Institute's open-source framework for running evaluations. Inspect Evals is its collection of benchmark implementations, or "ports". The changelog shows fixes made during the window that tell infrastructure failures apart from real agent failures in the SWE-bench and KernelBench ports.
2. **Why you're seeing it:** `efficacy-methodology`, on whether a benchmark score is measuring the agent at all.
3. **Seen before?** New to you.
4. **Relates to:** level 2, which finds a leak in the same SWE-bench port.
5. **Takeaways for you:** A benchmark is also its port. The same named benchmark can carry different flaw rates depending on whose harness runs it, and when. None of the five benchmarks' own maintainers responded to the audit.

### Establishing Best Practices for Building Rigorous Agentic Benchmarks
[link](https://arxiv.org/abs/2507.02825) · 2025-07 · paper · summary only

1. **What it is about:** Zhu and co-authors' Agentic Benchmark Checklist, a list of the ways task design and grading go wrong in agent benchmarks. The AISI scanners look for the flaw types it defines.
2. **Why you're seeing it:** Background, older than the window. It is where the audit's categories come from.
3. **Seen before?** New to you.
4. **Relates to:** the scanner repository above.
5. **Takeaways for you:** It is a good first reference if you ever need to judge whether a benchmark is sound.

### Why we no longer evaluate SWE-bench Verified
[link](https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/) · 2026-02 · vendor blog · summary only

1. **What it is about:** OpenAI explains why it stopped reporting SWE-bench Verified. Its own audit found flawed tests in 59.4% of 138 hard problems, and signs that frontier models could recall the fixes word for word.
2. **Why you're seeing it:** Background, before the window. It is a major lab's own verdict on a benchmark's validity, under `efficacy-methodology`.
3. **Seen before?** New to you.
4. **Relates to:** the AISI audit. The two count different things, bad tests in tasks against leaked answers in runs, so the numbers do not compete.
5. **Takeaways for you:** Even the most-cited coding benchmark can be dropped by the labs that used it. Check where a benchmark stands before you trust a headline on it.

## Level 2 - How answers leak into a benchmark run

### How to run SWE-bench Verified in one hour on one machine
[link](https://epoch.ai/latest/swebench-docker) · 2025-07-10 · report · read in full

1. **What it is about:** Epoch AI is a research organisation that runs its own benchmark hub. Here it republishes SWE-bench's Docker images in a much smaller form. A Docker image is a frozen copy of a machine, here with the code checked out at the task's start. The post warns that the model might still reach "future" git history: commits made after that point, including the human fix.
2. **Why you're seeing it:** Background, older than the window. These are the images at the centre of this level.
3. **Seen before?** New to you.
4. **Relates to:** Inspect Evals pull request #942 below, which switched to these images.
5. **Takeaways for you:** Epoch removes that history when its own harness starts a container. Tools that reuse its images without that step do not.

### SWE-bench pull request #471: chronologically sound git cloning
[link](https://github.com/SWE-bench/SWE-bench/pull/471) · 2025-09-11 · repo · read in full

1. **What it is about:** The upstream SWE-bench fix that stopped task containers from exposing commits and tags dated after the task's starting point.
2. **Why you're seeing it:** Background, before the window. It is the fix whose absence explains this level's leak.
3. **Seen before?** New to you.
4. **Relates to:** Epoch's post above, and pull request #942 below.
5. **Takeaways for you:** SWE-bench closed this leak in September 2025, but images built before then still have it.

### Inspect Evals pull request #942: default images switch to Epoch AI's registry
[link](https://github.com/UKGovernmentBEIS/inspect_evals/pull/942) · 2026-02-17 · repo · read in full

1. **What it is about:** A change that made Epoch AI's images the default in the Inspect Evals SWE-bench port, because they are "10x smaller". The port does not clean up git history before the agent starts.
2. **Why you're seeing it:** Background, just before the window. It links the audit's leak to a harness choice.
3. **Seen before?** The Inspect Evals changelog in level 1.
4. **Relates to:** the AISI paper's own example run, where the agent reads the task's merged fix with `git show`.
5. **Takeaways for you:** A harness choice made to save space reopened a leak that SWE-bench had closed. It explains the git-history part of the leaks the audit found.

### SWE-bench pull request #581: Multilingual eval images leaking future commits and tags
[link](https://github.com/SWE-bench/SWE-bench/pull/581) · 2026-08-12 · repo · read in full

1. **What it is about:** A contributor reports agents on SWE-bench Multilingual "literally invoking `git log --all --grep` to retrieve the fix commit", and proposes a fix. The maintainer closed the pull request because clean-up now happens in generated per-task build files. The linked issue #578 says Verified's images already had the fix.
2. **Why you're seeing it:** `efficacy-methodology`, on how leaks get reported and fixed.
3. **Seen before?** New to you.
4. **Relates to:** pull request #471, and SWE-Bench Pro Verified below.
5. **Takeaways for you:** A fix that lives in build files does not appear in a changelog, so reading changelogs alone can miss it.

### SWE-Bench Pro Verified
[link](https://arxiv.org/abs/2609.08149) · 2026-09-08 · paper · read in full

1. **What it is about:** SWE-Bench Pro is Scale AI's harder, 731-task sibling of SWE-bench. Researchers from Shanghai AI Lab, East China Normal and Fudan rebuilt each of its tasks as a fresh one-commit repository. They name four leak channels: files, git history, network and task metadata. With the leaks closed, one model's score fell from 78.8% to 57.3%.
2. **Why you're seeing it:** `benchmarks-depth`, on measuring how much leaks inflate a score.
3. **Seen before?** New to you.
4. **Relates to:** the AISI audit, which counts leaky runs rather than their effect on the score.
5. **Takeaways for you:** Run the same model on the same tasks twice, once in the original environment and once with the leaks closed. The difference in score is how much the leaks added. Suspicious git commands outnumbered confirmed answer access about three to one.

## Level 3 - What a leaderboard records about how a score was made

### SWE-bench experiments: submission checklist
[link](https://github.com/SWE-bench/experiments/blob/main/checklist.md) · 2026-09-01 · repo · read in full

1. **What it is about:** The rules for getting a score onto swebench.com, the official SWE-bench leaderboard. Each entry has a short metadata file naming the model and the scaffold (the software that drives the model), deliberately "without a version". The "checked" mark re-grades the recorded test output and never re-runs the agent.
2. **Why you're seeing it:** `benchmarks-depth`, on what a public leaderboard shows as evidence.
3. **Seen before?** [#35][b35] item 1 looked at Spider 2.0's leaderboard. This asks the same question of the main coding leaderboard.
4. **Relates to:** level 2's leak, which happens inside the agent's container.
5. **Takeaways for you:** No entry records which image or harness produced its score, so a leaky run and a clean one look the same. The only trace is an image tag inside each run log, and a tag can be moved to a different image.

### Coding Agents Have Converged
[link](https://arxiv.org/abs/2609.17394) · 2026-09-15 · paper · read in full

1. **What it is about:** Five authors audited 254 SWE-bench leaderboard submissions without running any models. Only 61 of 134 Verified entries carry a single usable model tag. They propose a structured field recording model, scaffold and version.
2. **Why you're seeing it:** `benchmarks-depth`, on leaderboard methodology.
3. **Seen before?** New to you.
4. **Relates to:** the checklist above.
5. **Takeaways for you:** Comparing leaderboard entries assumes they were all graded the same way. Nothing in an entry records whether they were.

### SWE-bench experiments issue #488: Detecting harness artifacts in published results
[link](https://github.com/SWE-bench/experiments/issues/488) · 2026-09-18 · repo · read in full

1. **What it is about:** A contributor models submission skill and repository difficulty across 122 submissions to flag results that look like broken environments, such as one entry scoring 3% on matplotlib tasks where about 65% was expected. Two related open issues, #482 and SWE-bench's #665 on "harness reproducibility", also ask where a score came from. None has a reply yet.
2. **Why you're seeing it:** `efficacy-methodology`, on checking a leaderboard from its public data.
3. **Seen before?** New to you.
4. **Relates to:** Coding Agents Have Converged above.
5. **Takeaways for you:** This method catches failures that lower a score. It cannot catch leaks that raise one.

### Epoch AI: SWE-bench Verified
[link](https://epoch.ai/benchmarks/swe-bench-verified) · 2026-03-06 · report · read in full

1. **What it is about:** Epoch AI runs SWE-bench Verified itself on 484 of the 500 tasks. It uses containers with no network access, strips future git history, and links each score to a log.
2. **Why you're seeing it:** `benchmarks-depth`. It is a second source of scores for the same benchmark.
3. **Seen before?** Epoch's post in level 2.
4. **Relates to:** swebench.com above, where each submitter runs their own harness.
5. **Takeaways for you:** Running every score through one harness makes results easier to compare. Epoch plans to pin each run to an exact code version but does not yet record an image per entry.

### HAL: SWE-bench Verified Mini
[link](https://hal.cs.princeton.edu/swebench_verified_mini) · 2025-10-01 · report · summary only

1. **What it is about:** Princeton's Holistic Agent Leaderboard runs a 50-task subset of SWE-bench Verified. Each row shows the agent, the model, accuracy and cost with confidence intervals, the number of runs, and downloadable encrypted logs.
2. **Why you're seeing it:** Background, older than the window. It is another leaderboard design to compare, under `benchmarks-depth`.
3. **Seen before?** New to you.
4. **Relates to:** Epoch AI above.
5. **Takeaways for you:** It shows more per row than most leaderboards, with intervals and repeat runs. But it is paused, and it does not record an image or harness version either.

[b35]: ../../35-depth-brief-2026-09-23-benchmarks-and-dbt.md
[snow]: ../2026-09-23-snowflake-sql-ai-functions/README.md
