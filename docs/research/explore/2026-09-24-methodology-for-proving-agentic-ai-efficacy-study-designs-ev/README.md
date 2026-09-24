# Methodology for proving agentic AI efficacy

Seed: methodology for proving agentic AI efficacy · mode: learning - rewritten from a scrutiny-mode run on 2026-09-24 · 2026-09-24

## What's out there

People show an agent works in three main ways. **Company rollout studies**
compare adopters with non-adopters using synthetic controls or
difference-in-differences, because randomised trials are hard once people
depend on a tool. **Benchmarks** now run each task many times (pass^k), grade
the final database state or the agent's steps, and combine results with item
response theory. **Audits** read agent run logs or plant traps to catch leaked
answers. The field is converging on a few points. A single number, whether
merged pull requests or one-try success, hides what matters: quality after
merge, consistency, and oversight. A benchmark score measures the agent,
the benchmark and the harness together. Quality measures such as reverts,
follow-up fixes and line survival exist but disagree with each other, and
nobody has yet tied thinning human review to a quality cost. Regulators can
now demand evaluations but have not said what one must show.

## The map

**[Breadth pass](0-breadth.md)**
- [Microsoft CLI agents](https://arxiv.org/abs/2607.01418) - rollout study, +24%
- [CMU/Stanford "2×"](https://arxiv.org/abs/2607.01904) - throughput up, review down
- [METR update](https://metr.org/blog/2026-02-24-uplift-update/) - randomised trial stalls
- [AISI scanners](https://arxiv.org/abs/2607.27518) - benchmark flaw audit
- [Hack-Verifiable Terminal Bench](https://arxiv.org/abs/2608.22103) - planted answers
- [Outcome finality](https://arxiv.org/abs/2608.14940) - when to score
- [Thumbtack](https://arxiv.org/abs/2609.09182) - analytics-agent evals
- [trajectory-judge](https://arxiv.org/abs/2609.00038) - LLM judge blind spots
- [Meta IRT](https://arxiv.org/abs/2609.21267) - cheap re-evaluation
- [CAISI GLM-5.3](https://www.nist.gov/news-events/news/2026/09/caisis-assessment-zais-glm-53-cyber-capabilities) - government method
- [NIST agent standards](https://www.nist.gov/artificial-intelligence/ai-agent-standards-initiative) - still quiet
- [EU FAQ](https://ai-act-service-desk.ec.europa.eu/en/ai-act/faq/commissions-enforcement-powers-related-ai-act-obligations-providers-most-advanced-models) - powers, no standard

**[Path 1 - once vs every time](path-1-thinkingbox-reliability.md)**
- [Thinkingbox](https://arxiv.org/abs/2608.19741) - 20-trial benchmark
- [τ-bench](https://arxiv.org/abs/2406.12045) - origin of pass^k
- [Beyond Pass@k](https://arxiv.org/abs/2608.14711) - metric definitions
- [READY](https://arxiv.org/abs/2609.02095) - oversight needed
- [Noise Floor Audit](https://arxiv.org/abs/2608.22331) - rephrasing noise
- [Launch post](https://commandline.microsoft.com/thinkingbox-bench-agent-benchmarking/) - pass^20 defined
- [PR #22](https://github.com/microsoft/thinkingbox/pull/22) - tool's estimator
- [Dataset](https://huggingface.co/datasets/microsoft/ThinkingBox-Bench) - tasks, no results
- [Pebblous](https://blog.pebblous.ai/blog/thinkingbox-stateful-agent-reliability/en/) - launch coverage
- [Issue #35](https://github.com/microsoft/thinkingbox/issues/35) - grader bypass
- [README](https://github.com/microsoft/thinkingbox) - run wiring
- [Deep-dive doc](https://raw.githubusercontent.com/microsoft/thinkingbox/main/docs/test_cases_deep_dive.md) - reward hacking
- [jacar.es](https://jacar.es/thinkingbox-sandbox-agentes/) - Spanish explainer

**[Path 2 - broken benchmarks](path-2-benchmark-flaw-rates.md)**
- [scanner_evaluation](https://github.com/Generality-Labs/scanner_evaluation) - audit code, labels
- [Inspect Evals changelog](https://raw.githubusercontent.com/UKGovernmentBEIS/inspect_evals/main/CHANGELOG.md) - port fixes
- [Benchmark Checklist](https://arxiv.org/abs/2507.02825) - flaw types
- [OpenAI post](https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/) - dropping SWE-bench Verified
- [Epoch images](https://epoch.ai/latest/swebench-docker) - smaller images
- [SWE-bench #471](https://github.com/SWE-bench/SWE-bench/pull/471) - git-history fix
- [Inspect Evals #942](https://github.com/UKGovernmentBEIS/inspect_evals/pull/942) - pre-fix images
- [SWE-bench #581](https://github.com/SWE-bench/SWE-bench/pull/581) - Multilingual leak
- [SWE-Bench Pro Verified](https://arxiv.org/abs/2609.08149) - clean rerun
- [Checklist](https://github.com/SWE-bench/experiments/blob/main/checklist.md) - leaderboard entries
- [Coding Agents Have Converged](https://arxiv.org/abs/2609.17394) - leaderboard audit
- [Issue #488](https://github.com/SWE-bench/experiments/issues/488) - broken-run detector
- [Epoch hub](https://epoch.ai/benchmarks/swe-bench-verified) - one harness
- [HAL](https://hal.cs.princeton.edu/swebench_verified_mini) - paused leaderboard

**[Path 3 - what counts as "it worked"](path-3-deployed-agent-outcomes.md)**
- [Cursor study](https://arxiv.org/abs/2511.04427) - speed fades, complexity stays
- [Xia and Miller](https://arxiv.org/abs/2607.09902) - post-merge survival
- [Who Finishes the Job?](https://arxiv.org/abs/2609.26847) - follow-up fixes
- [Not All Agents Are Equal](https://arxiv.org/abs/2609.17598) - reverts by agent
- [A Few Pages of Markdown](https://arxiv.org/abs/2608.25241) - configuration matters
- [3100 Opinions](https://arxiv.org/abs/2607.07980) - review coverage
- [AI-to-AI reviews](https://arxiv.org/abs/2608.21311) - bots reviewing agents
- [Mazloomzadeh et al.](https://arxiv.org/abs/2607.21832) - bug introduction
- [These Aren't the Reviews](https://arxiv.org/abs/2605.02273) - human reviewing
- [Heilman et al.](https://arxiv.org/abs/2606.00438) - Copilot usage
- [Pith reports](https://pith.science/paper/2607.01904) - outside critique
- [Paper Jam](https://leif.me/upcoming-paper-jam-ai-writes-faster-than-humans-can-review/) - practitioner reaction

## How it fits together

- Paths 1 and 2 met at one point: the guard against a gamed or leaked score
  lives in the harness, not the benchmark.
- Path 2 generalises the [Snowflake exploration](../2026-09-23-snowflake-sql-ai-functions/README.md)'s
  unaudited benchmark: audit tools and labels now exist.
- Path 1 echoes the [sibling exploration](../2026-09-24-agentic-ai-features-for-analytics-launched-or-announced-ware/):
  how runs are combined decides the result.
- Meta and NIST's CAISI both use item response theory, independently.
- Path 3 is [#26](../../26-analytics-and-agent-efficacy-brief-2026-09-23.md)'s
  ERPBench lesson at company scale: an easy count stands in for the outcome.

## Candidate topics

Proposals only; none is in `profile.md`.
- *Proposal:* **`repeated-trial-reliability`** - succeeding every time, and how pass^k is computed (path 1).
- *Proposal:* **`harness-provenance`** - tracing a score to its harness and image (path 2).
- *Proposal:* **`deployed-outcome-measures`** - what rollouts count as the outcome, and how review is defined (path 3).

The original, audit-style version of this exploration is in [`scrutiny/`](scrutiny/README.md).
