# Path 1 - How warehouse vendors back up "our agent is better"

This path starts from Snowflake's claim that its agent gives "higher answer
quality". It covers what vendors have published about their data agents'
quality, what Snowflake's own evaluation tools can measure, and Snowflake's
advice to customers on testing.

## Level 1 - What the vendors have published

### Cortex Sense for Enterprise AI Agents
[link](https://www.snowflake.com/en/blog/enterprise-ai-agents-grounded-context/) · 2026-06-30 · vendor blog · read in full

1. **What it is about:** Snowflake (a cloud data warehouse) introduces Cortex Sense, in private preview. It is a context layer that learns table, metric and filter knowledge from sources like query history, so an agent does not depend only on hand-written semantic views. Snowflake reports accuracy rising "from 24.1% to 86.3%" on "a set of hard questions".
2. **Why you're seeing it:** It is a vendor figure for what added context buys (`agent-efficacy`, `semantic-models`).
3. **Seen before?** Yes. #19 reported "Cortex Sense claims 86%" from the June summit, as vendor-run on undisclosed questions.
4. **Relates to:** The CoCo & CoWork post below, which gives the question count. [Anthropic's own post](https://claude.com/blog/how-anthropic-enables-self-service-data-analytics-with-claude) reports a similar 21% for an agent with no context.
5. **Takeaways for you:** The 24.1% baseline is a general coding agent with no context layer, not Snowflake's existing semantic views. A third setup was run, and its score was not published. Context helps a lot, but check what the comparison is against.

### Snowflake CoCo & CoWork: Token & Intelligence Efficiency
[link](https://www.snowflake.com/en/blog/engineering/snowflake-coco-cowork-token-spend-efficiency/) · 2026-08-21 · vendor blog · read in full

1. **What it is about:** CoCo (Cortex Code) is Snowflake's coding agent, a Snowflake-aware counterpart to Claude Code. CoWork is Snowflake's chat product for business users. Snowflake compares them with Claude Code connected over MCP, the standard way an outside agent calls a tool. The post puts a count on the Cortex Sense figure: 58 internal questions from Snowflake's own product analytics.
2. **Why you're seeing it:** It is a vendor comparison of its own agents (`agent-efficacy`, `warehouse-agentic`).
3. **Seen before?** The Cortex Sense post above. The 2026-09-23 Snowflake exploration covered the AI SQL functions underneath these products.
4. **Relates to:** Databricks' post below, which makes the same argument.
5. **Takeaways for you:** The claim is that an agent built for the platform beats a general one, on internal questions with no stated grading method. For one benchmark, the headline sentence quotes figures (60% vs 58%) that the post's own table does not contain. Read the table, not the prose.

### Why A Frontier Data Agent Outperforms General Coding Agents in Quality and Cost
[link](https://www.databricks.com/blog/why-frontier-data-agent-outperforms-general-coding-agents-quality-and-cost) · 2026-07-23 · vendor blog · read in full

1. **What it is about:** Databricks is a data platform that combines a warehouse and a data lake (a "lakehouse"). It tests Genie Code, its assistant inside notebooks, against three unnamed coding agents from major AI labs. There were 401 tasks "distilled ... from real internal usage", each with a 20-minute budget.
2. **Why you're seeing it:** It is a vendor's own evidence for its agent (`efficacy-methodology`, `warehouse-agentic`).
3. **Seen before?** #19 recorded Databricks' June figure (52% → 84.5%) as vendor-run. That set had 28 questions, and this one is much larger.
4. **Relates to:** Snowflake's CoCo post above: two vendors framing their results the same way.
5. **Takeaways for you:** Genie Code scored 76.6%, against 72.1%, 56.1% and 55.9%. "An independent judge" graded the answers, and the post does not say who or what the judge is. The tasks are not released, so outsiders cannot rerun the comparison.

### A Data Engineering Benchmark for AI Agents (data-eng-bench)
[link](https://www.snowflake.com/en/blog/engineering/data-eng-bench-data-engineering-agent-benchmark/) · 2026-08-06 · vendor blog · read in full

1. **What it is about:** Snowflake and Bespoke Labs release 103 public tasks for dbt, the tool that turns raw tables into modelled ones as SQL code. An automatic checker grades each task. They publish two scores for CoCo, Claude Code and Codex: the average, and the share of tasks passed on all three runs.
2. **Why you're seeing it:** It is the one vendor benchmark here whose tasks anyone can inspect (`efficacy-methodology`, `benchmarks-depth`).
3. **Seen before?** Like Spider 2.0-AIFunc in the 2026-09-23 exploration, it was written by a vendor. Unlike that one, it publishes its answers.
4. **Relates to:** #35's WarehouseReliabilityBench and #26's ERPBench, which also check results against the database.
5. **Takeaways for you:** Because the tasks are public, outsiders could check them. Within a month the [repository](https://github.com/Snowflake-Labs/data-eng-bench) had a report of one wrong reference answer. It also had a note that CoCo could not switch off web search during runs. Open benchmarks get checked, and closed ones never are.

### We benchmarked 11 AI data analysts (BI Bench)
[link](https://www.basedash.com/blog/ai-data-analyst-benchmark-bi-bench-results) · 2026-06-27 · vendor blog · read in full

1. **What it is about:** Basedash is an AI-first BI tool. Here it ranks eleven "AI data analysts", its own among them. "Snowflake Cortex" comes tenth at 19.2%, and Basedash comes first at 92.1%.
2. **Why you're seeing it:** It is the closest thing to an outside measurement of Snowflake's agent (`agent-efficacy`).
3. **Seen before?** New to you.
4. **Relates to:** The vendor posts above. This one is a competitor grading everyone else.
5. **Takeaways for you:** The post gives no question count or grader, and does not say which Snowflake product was tested. Every tool ran on "its default settings", which for Cortex probably means no semantic view was built. A competitor's leaderboard needs the same scrutiny as a vendor's own.

## Level 2 - What Snowflake's own evaluation tools can measure

### Cortex Agent evaluations
[link](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-agents-evaluations) · undated · vendor doc · read in full

1. **What it is about:** This page explains how to test a Cortex Agent. You supply a table of questions, each with an expected answer and optionally the tool calls you expect. An LLM judge scores answer correctness, tool choice, tool execution and logical consistency. Since 2026-08-21, a run can be pinned to one agent version.
2. **Why you're seeing it:** It is the tool a customer would use to check Snowflake's claim (`efficacy-methodology`, `warehouse-agentic`).
3. **Seen before?** New to you. Hex Evals, in the breadth pass, is the notebook counterpart.
4. **Relates to:** The Analyst evaluator below, which works differently.
5. **Takeaways for you:** Scores vary between runs ("Agent orchestration is non-deterministic"), so the page says to run a dataset "several times" before you set a pass threshold. Unlike the Analyst evaluator, it does not remove the semantic view's verified queries before testing.

### Cortex Analyst evaluations
[link](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-analyst-evaluations) · undated · vendor doc · read in full

1. **What it is about:** This is the evaluator for the older text-to-SQL product. It uses the semantic view's own verified queries as the test set, runs the SQL the product generates, and compares the results.
2. **Why you're seeing it:** It is the other half of the comparison Snowflake asks customers to make (`efficacy-methodology`).
3. **Seen before?** The Agent evaluator above.
4. **Relates to:** Snowflake's [Verified Query Repository](https://docs.snowflake.com/en/user-guide/views-semantic/verified-query-repository) page, which explains what verified queries are.
5. **Takeaways for you:** It holds its test questions out: "Cortex Analyst creates a temporary copy of your semantic view with those selected queries removed." The two evaluators differ in their questions, their graders and their hold-out rules. So neither can put the two products on one score.

### Upgrade from Cortex Analyst to Cortex Agents
[link](https://www.snowflake.com/en/developers/guides/migrate-cortex-analyst-to-cortex-agents/) · updated 2026-05-05 (background) · vendor doc · read in full

1. **What it is about:** Snowflake's developer guide to switching products. It explains the quality claim by design: "instead of a single pass, the agent can iterate until it gets the right answer". It also maps each Analyst response field to its Agent equivalent.
2. **Why you're seeing it:** It is the practical side of the transition (`warehouse-agentic`).
3. **Seen before?** The transition note in the breadth pass.
4. **Relates to:** Path 3, level 3, which looks at its "self-correct" step.
5. **Takeaways for you:** The guide leaves the comparison to you: "Run 10-20 representative questions through both APIs and compare". Verified queries "still influence SQL generation but are not surfaced in the response". An Agent answer does not tell you whether a stored query was used.

## Level 3 - Snowflake's advice on testing an agent

### Best Practices for Evaluating Cortex Agents
[link](https://www.snowflake.com/en/developers/guides/best-practices-for-evaluating-cortex-agents/) · 2026-08-25 · vendor doc · read in full

1. **What it is about:** Snowflake's guide to running the Agent evaluator well. It covers building a question set from real user logs, pinning the agent version and the judge version, and comparing runs. It was updated three days before the transition note.
2. **Why you're seeing it:** It is a vendor's own statement of what counts as evidence (`efficacy-methodology`).
3. **Seen before?** The two evaluator pages in level 2.
4. **Relates to:** Level 2's difference in hold-out rules.
5. **Takeaways for you:** The guide's motto is "Accurate is the goal; consistently accurate is the bar." It separates "Did this change help?" from "Is my agent consistent?". For inconsistent questions it suggests verified queries among other fixes, and it never says to keep test questions apart from them. It warns that scores from different judge versions "aren't comparable". The default judge model retires in October.

### Getting Started with Cortex Agent Evaluations
[link](https://www.snowflake.com/en/developers/guides/getting-started-with-cortex-agent-evaluations/) · 2026-03-17 (background) · vendor doc · read in full

1. **What it is about:** A hands-on quickstart. It sets up a semantic view, an agent and an evaluation table, then runs a first evaluation.
2. **Why you're seeing it:** It is the practical way in if you want to see these tools working (`warehouse-agentic`).
3. **Seen before?** The best-practices guide above builds on it.
4. **Relates to:** The Agent evaluator page in level 2.
5. **Takeaways for you:** It is the fastest way to see a whole Snowflake agent evaluation from start to finish. Its example questions, such as "What was the total spend on our summer campaign?", show the kind of business question these agents are built for.

### Best Practices for Building Cortex Agents
[link](https://www.snowflake.com/en/developers/guides/best-practices-to-building-cortex-agents/) · 2026-06-15 (background) · vendor doc · read in full

1. **What it is about:** Snowflake's companion guide to designing agents: their instructions, tool descriptions and semantic views.
2. **Why you're seeing it:** It covers how the agent uses the semantic layer (`warehouse-agentic`, `semantic-models`).
3. **Seen before?** The evaluating guide above.
4. **Relates to:** Path 3, which asks how the agent actually uses the semantic view.
5. **Takeaways for you:** It explains why verified queries steady an agent: defining them in the semantic view "ensures the agent uses an optimized, predictable query path". That helps in production. It also means that a test question with a stored verified query partly measures lookup, not reasoning.
