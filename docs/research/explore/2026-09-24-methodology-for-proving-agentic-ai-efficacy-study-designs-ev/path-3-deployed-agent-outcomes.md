# Path 3 - What company studies of agents count as "it worked"

Angle 1 of the [breadth pass](0-breadth.md) found two company studies of
coding agents: Microsoft's (+24% merged pull requests) and CMU/Stanford's (a
"2×" mandate). This path reads the work around them: how quality is measured
after code merges, where code review fits, and how others have read the
studies.

## Level 1 - Measuring what happens to agent code after it merges

### Speed at the cost of quality: how Cursor AI increases short-term velocity and long-term complexity in open-source projects
[link](https://arxiv.org/abs/2511.04427) · 2026-01-26 · paper · read in full

1. **What it is about:** He and co-authors compared 806 open-source repositories that adopted Cursor, an AI-first code editor, with 1,380 similar ones. The design is difference-in-differences: compare how much adopters changed with how much similar non-adopters changed. Commits rose 55% in the first month and the gain was gone by month three. Static-analysis warnings (+30%) and code complexity (+42%) stayed up.
2. **Why you're seeing it:** Background, before the window. It is the study Microsoft contrasts itself with, under `efficacy-methodology`.
3. **Seen before?** The Microsoft paper in the breadth pass cites it, but only for the speed result.
4. **Relates to:** A Few Pages of Markdown below, which follows it up.
5. **Takeaways for you:** Speed and quality can move apart after adoption: quick early gains, and a complexity cost that lasts.

### Do These Violent Delights Have Violent Ends? Measuring the Post-Merge Fate of Agentic Code
[link](https://arxiv.org/abs/2607.09902) · 2026-07-10 · paper · read in full

1. **What it is about:** Xia (UIUC) and Miller (George Washington) tracked lines written by 15 named agents across 182 open-source projects for a year. They used survival analysis, which measures how long a line lasts before a later commit changes or deletes it. Agent lines were about 50% more likely to be hit by bug fixes, yet they survived longer overall.
2. **Why you're seeing it:** `efficacy-methodology`. Quality after merge is the missing half of throughput studies.
3. **Seen before?** New to you.
4. **Relates to:** level 2, which looks at code review. The authors publish their analysis code on GitHub.
5. **Takeaways for you:** Quality measures can point different ways at once. One "quality" number hides as much as one throughput number.

### Who Finishes the Job? A Study of Follow-Up Fixes and Commit Authorship on AI Coding Agent Pull Requests
[link](https://arxiv.org/abs/2609.26847) · 2026-09-22 · paper · read in full

1. **What it is about:** Deakin University researchers counted follow-up fixes, meaning later fixes that edit the same file within 30 days. They studied 6,774 agent and 5,044 human merged pull requests from AIDev, a public dataset of agent-written GitHub pull requests. Confirmed fixes followed 4.5% of agent merges and 2.3% of human ones.
2. **Why you're seeing it:** `efficacy-methodology`. It is a concrete measure of rework.
3. **Seen before?** New to you.
4. **Relates to:** Kraishan below, which uses the same dataset.
5. **Takeaways for you:** Half of the 30-day follow-up fixes come in the first week, so a short window catches most rework. Agents fix their own merges about 70% of the time.

### Not All Agents Are Equal: Code Quality and Post-Merge Maintenance Across Five Autonomous Coding Agents in the Wild
[link](https://arxiv.org/abs/2609.17598) · 2026-09-12 · paper · read in full

1. **What it is about:** A Texas Tech study compares 90-day revert rates for 33,596 agent pull requests and 4,027 human ones. Humans reverted at 11.5%. Codex (OpenAI's coding agent) reverted at 6.1% and Devin (Cognition's autonomous agent) at 14.5%. The other agents were close to the human rate.
2. **Why you're seeing it:** `agent-efficacy`. It compares agents on a real outcome rather than a benchmark.
3. **Seen before?** New to you.
4. **Relates to:** Who Finishes the Job? above, and Microsoft's per-tool results in the breadth pass.
5. **Takeaways for you:** "AI code" is not one thing: results vary by agent. Claude Code's pull requests are much larger (median 495 changed lines against 52 for humans), which matters when a study counts pull requests.

### A Few Pages of Markdown: Committed AI Configuration and Lower Quality Cost after Coding-Agent Adoption
[link](https://arxiv.org/abs/2608.25241) · 2026-08-26 · paper · read in full

1. **What it is about:** Stanford, CMU and Grid Dynamics researchers built a scale for what teams commit to configure their AI tools. It runs from rules files such as `CLAUDE.md`, to agent definitions, to orchestration. Commits rose by a similar amount at every level. Complexity rose half as much (+27% against +53%) where teams had committed configuration.
2. **Why you're seeing it:** `efficacy-methodology`. It shows the quality outcome depends on how a team sets up its agents.
3. **Seen before?** It shares six authors with the CMU/Stanford study and builds on He et al. above.
4. **Relates to:** this repository, whose own `CLAUDE.md` and skills are exactly what it measures.
5. **Takeaways for you:** The same speed-up can come with very different quality costs, which is a reason not to generalise from a study that only measures throughput. Teams were not randomly assigned to levels.

## Level 2 - Code review: measured often, rarely linked to outcomes

### 3100 Opinions on Code Review in an AI World: Building Causal Theory from Practitioner Discourse
[link](https://arxiv.org/abs/2607.07980) · 2026-07-08 · paper · read in full

1. **What it is about:** CMU researchers built a causal theory of code review from 3,100 documents written by practitioners, then measured 2,860 GitHub repositories. The share of merged agent pull requests with no human review fell from over 50% in mid-2025 to about 14% by early 2026.
2. **Why you're seeing it:** `efficacy-methodology`. Human oversight is part of what an organisation accepts as evidence.
3. **Seen before?** New to you.
4. **Relates to:** the CMU/Stanford firm in the breadth pass, where human review went the other way.
5. **Takeaways for you:** 40% of agent pull requests were reviewed only by the developer who ran the agent. Review coverage is now measured well, but this study does not link it to defects or rework.

### AI-to-AI Code Reviews of GitHub Pull Requests
[link](https://arxiv.org/abs/2608.21311) · 2026-08-21 · paper · read in full

1. **What it is about:** ÉTS Montréal and Trent University researchers studied 248,641 AI-written pull requests that were reviewed by AI tools such as CodeRabbit (a commercial AI review app) and GitHub Copilot code review. 8.8% of agent pull requests got an AI review, a share that grew more than a hundredfold during 2025.
2. **Why you're seeing it:** `efficacy-methodology`. AI review is becoming part of how agent output gets checked.
3. **Seen before?** New to you.
4. **Relates to:** the CMU/Stanford firm, where AI review reached about 84% of pull requests.
5. **Takeaways for you:** It measures how common AI review is and what it comments on, not outcomes, and it has no human comparison group. AI reviewing AI is growing faster than the evidence on whether it works.

### How Do AI Coding Agents Contribute to Software Development?
[link](https://arxiv.org/abs/2607.21832) · 2026-07 · paper · read in full

1. **What it is about:** Mazloomzadeh, Morovati and Khomh use SZZ, an algorithm that traces each bug fix back to the commit that introduced the bug. They find agent pull requests introduce bugs less often than human ones.
2. **Why you're seeing it:** `efficacy-methodology`. It is another quality measure.
3. **Seen before?** New to you.
4. **Relates to:** Xia and Miller in level 1, who found agent lines more often hit by bug fixes. The measures disagree.
5. **Takeaways for you:** It does not look at review, so it cannot say whether review made the difference.

### These Aren't the Reviews You're Looking For: How Humans Review AI-Generated Pull Requests
[link](https://arxiv.org/abs/2605.02273) · 2026-05 · paper · summary only

1. **What it is about:** A study of how people review pull requests written by agents. It was seen only as a search result and through a vendor guide, which quotes its finding that 71.58% of review comments on agent pull requests came from agents.
2. **Why you're seeing it:** Background, before the window. It is the closest study of how humans actually review agent code.
3. **Seen before?** New to you.
4. **Relates to:** AI-to-AI Code Reviews above.
5. **Takeaways for you:** Much of the "review" on agent code may itself be automated. Keep that in mind whenever a study reports review coverage.

## Level 3 - How others have read the company studies

### Heilman, Kyllo and Murphy-Hill: GitHub Copilot usage and pull requests at Microsoft
[link](https://arxiv.org/abs/2606.00438) · 2026-05-30 · paper · summary only

1. **What it is about:** An earlier Microsoft study of 16,223 engineers found 40.5% more pull requests in each engineer's heaviest weeks of GitHub Copilot use. Copilot here is the assistant inside the code editor. The abstract names no quality outcome.
2. **Why you're seeing it:** Background, before the window. Both company studies in the breadth pass cite it.
3. **Seen before?** New to you.
4. **Relates to:** Microsoft's +24% agent study, which shares an author.
5. **Takeaways for you:** Comparing heavy-use weeks with light-use weeks shows an association, not a cause. Heavy weeks may involve lighter work, and Microsoft's later paper says the same about its own curve.

### Pith referee reports on the CMU/Stanford and Xia-Miller papers
[link](https://pith.science/paper/2607.01904) · 2026-07-03 · report · read in full

1. **What it is about:** Pith, a paper-review site, posts referee-style reports on new preprints. Its [report on Xia and Miller](https://pith.science/paper/2607.09902) calls their code-review finding "only weakly supported", because their model explains little of the difference between projects. Its report on CMU/Stanford asks for more checks on trends before the mandate and on robustness.
2. **Why you're seeing it:** these are the first outside responses to the studies this path follows.
3. **Seen before?** New to you.
4. **Relates to:** Xia and Miller in level 1, and the CMU/Stanford paper in the breadth pass.
5. **Takeaways for you:** They are useful as a quick second opinion, with caveats. Nobody knows who writes Pith's reports, and the CMU/Stanford report asks for checks that the paper's supplement already contains.

### Upcoming Paper Jam: AI Writes Faster Than Humans Can Review
[link](https://leif.me/upcoming-paper-jam-ai-writes-faster-than-humans-can-review/) · 2026-07-17 · news · read in full

1. **What it is about:** Leif Singer announces a reading-group discussion of the CMU/Stanford paper, with a short take: "Merge and revert rates held steady, which you can read as reassuring or as unsettling, depending on how much you trust one machine to catch what another machine wrote."
2. **Why you're seeing it:** a practitioner's reaction to an evidence study under `efficacy-methodology`.
3. **Seen before?** New to you.
4. **Relates to:** AI-to-AI Code Reviews in level 2.
5. **Takeaways for you:** The real open question is whether automated review is a real check. The paper does not publish how many pull requests got no review of any kind, and every merged pull request at that firm deploys automatically.
