# Path 3 - Evaluating a data agent against your own dbt project

Follows breadth lead **L4a** (Angle 4, "How teams judge dbt agents on their own projects").

## Level 1 - Building an answer key and a grader from your own project

**Background:** The idea predates the window. Benn Stancil's [ADE-bench launch post](https://docs.getdbt.com/blog/building-a-better-data-agent-benchmark) (2026-04-15) says "Teams can replace our tasks with their own, and use clones of their own database and dbt repo." typedef.ai's [ade-bench-plugin](https://github.com/typedef-ai/ade-bench-plugin) (last commit 2026-05-08, offered in [ADE-bench issue #148](https://github.com/dbt-labs/ade-bench/issues/148) on 2026-05-22) does it automatically: it breaks one of your working models, for example by swapping a `LEFT JOIN` for an `INNER JOIN`, and asks the agent to fix it. Data Culture's first essay, [If You Can't Measure It, Don't Ship It](https://www.datacult.com/post/if-you-cant-measure-it-dont-ship-it) (2026-06-08), came just before the window.

### How to write golden questions, and how to grade them (dbt-agent-trust evaluation layer)
[link](https://github.com/datacult/dbt-agent-trust/blob/main/docs/golden_question_guide.md) · 2026-08-24 (PR #2, "evaluation layer integration") · open-source repository (Data Culture) · read in full (guide, evaluation README, synthesis guide) · search

1. **What it is about:** This goes past the README the breadth pass read. The guide asks one test of every question: "would they write the same SQL?" if two analysts were given it. Questions fall into seven categories, one of them deliberately out of scope, and three difficulty levels. Expected answers use fixed dates and are confirmed by a domain expert.
2. **Why you're seeing it:** `agent-efficacy`, `dbt-context`.
3. **Seen before?** Yes. The breadth pass (Angle 4) covered the four matching layers. This item covers how the answer key gets written.
4. **Relates to:** Data Culture's [dbt Summit talk](https://www.getdbt.com/dbt-summit/agenda/dont-ship-what-you-cant-measure-evaluation-driven-development-for-ai-analytics-agents) (September 15-18), known only from a search summary.
5. **Takeaways for you:** Start with 20 to 40 questions, and add more from production traffic rather than brainstorming. A question is retired when the underlying models change, much like re-baselining a holdout.

### Making Agents Evaluable: instrumenting an MCP-connected data agent
[link](https://www.datacult.com/post/building-the-agent-layer-behind-a-governed-data-agent) · 2026-09-14 · practitioner blog (Data Culture) · read in full · search

1. **What it is about:** How the dbt-agent-trust agent records every run so that failures can be diagnosed. Each run logs the SQL, the result, the tool calls, which metric was queried, whether the agent declined or asked for clarification, the error type and the duration. The golden-set runner holds the dbt context, the instructions and the tools fixed, and changes only the model.
2. **Why you're seeing it:** `agent-efficacy`, `efficacy-methodology`.
3. **Seen before?** No. The breadth pass read only the repository.
4. **Relates to:** The Snowflake guide below, which also changes one thing per run.
5. **Takeaways for you:** A pass or fail is not enough. The logged fields let you split a failure into "wrong metric", "too many tool calls" or "invalid SQL", which is like breaking a topline metric into drivers.

### Best practices for evaluating Cortex Agents
[link](https://www.snowflake.com/en/developers/guides/best-practices-for-evaluating-cortex-agents/) · 2026-08-25 · vendor developer guide (Snowflake) · read in full · search

1. **What it is about:** Snowflake's guide to building an evaluation dataset for Cortex Agents, its question-answering agents over your warehouse tables. Collect questions from real users trying a prototype, then have Cortex Code, Snowflake's coding agent, turn the logs into a dataset. A person then confirms each answer and the expected tool calls.
2. **Why you're seeing it:** `warehouse-agentic`, `efficacy-methodology`.
3. **Seen before?** The breadth pass (Angle 5) covered Snowflake's hands-on lab and phData's workflow. This guide is the method underneath both.
4. **Relates to:** The [evaluations docs](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-agents-evaluations): ground truth is "a plain-language rubric built from literal, verifiable values."
5. **Takeaways for you:** Anchor questions to fixed dates, and pin the judge's version so thresholds keep their meaning. The guide also warns that a score of 100% "typically signals that your dataset is too easy."

### dbt_context_engineering: modelling the context your AI agents read
[link](https://docs.getdbt.com/blog/dbt-context-engineering) · 2026-09-16 · vendor developer blog (dbt Labs) · read in full, plus the package's `eval` macro · listed source

1. **What it is about:** A new dbt package ([repository](https://github.com/dbt-labs/dbt-context-engineering), created 2026-07-20) for AI steps that run inside a pipeline, such as classifying or extracting from text. It keeps prompts under version control and adds deterministic checks. One is `grounded`, which checks that an output cites its source text. The `eval` macro compares predicted labels with a golden column and reports accuracy, precision and recall.
2. **Why you're seeing it:** `dbt-context`, `efficacy-methodology`.
3. **Seen before?** No.
4. **Relates to:** dbt-agent-trust's deterministic-first grader, and DataClawEval's preference for rule-based grading (breadth, Angle 2).
5. **Takeaways for you:** Here the grader is part of the dbt project and runs as ordinary dbt tests. The post rejects the LLM judge outright: "a paid opinion, not a reliable test."

### Run your agent like a data product with AI Evals (Omni)
[link](https://omni.co/blog/run-your-agent-like-a-data-product-with-ai-evals) · 2026-07-07 · vendor blog (Omni) · read in full, plus the [Evals docs](https://docs.omni.co/ai/evals) · search

1. **What it is about:** Omni is a BI tool, a dashboard and query layer that often sits on a dbt project. Its advice: "Write down ten questions your team asks", growing to 15-20, with a limit of 25 per set. Change the model on a branch, re-run the set, and compare the two runs side by side.
2. **Why you're seeing it:** `analytics-broad`, `agent-efficacy`.
3. **Seen before?** No. Hex Evals, its counterpart in another notebook and BI tool, appeared in the 2026-09-24 analytics-agents exploration.
4. **Relates to:** Snowflake's guide above. Both build the question set from real usage.
5. **Takeaways for you:** The judge reads the whole session: the query, the Topic (Omni's curated slice of the model), and the fields and filters. An expected answer is optional. The branch comparison works like a pre-merge A/B test.

**Leads:**
- **L1-a** - Where the questions and answers come from. Read Snowflake's dataset-curation skill in Cortex Code and its guide [Getting Started with Cortex Agent Evaluations](https://www.snowflake.com/en/developers/guides/getting-started-with-cortex-agent-evaluations/). Add Hex's bootstrap prompt, which writes `evals.yaml` from workspace threads, and its 2026-09-15 scheduled eval suites. Then Omni's regression prompts, dbt-agent-trust's rule to grow from production usage, and `olist_analytics_benchmark.yml`. Read for how a team mines logs for questions, who signs off the expected answer, and how the set is kept from going stale when the models change.
- **L1-b** - Tasks that test an agent building models, not answering questions, generated from your own dbt project. Read ADE-bench's task anatomy: `task.yaml`, setup patches, solution seeds, and the `AUTO_` equality and existence tests. Add typedef.ai's ade-bench-plugin and its bug catalogue (**Background**, May 2026), ADE-bench #155's proposal to grade project metadata, and Data Minded's [how-much-do-you-bench](https://github.com/datamindedacademy/how-much-do-you-bench) (2026-08-26), which keeps its answer keys private. Read for how a broken model is turned into a gradable task, and how the answer key is kept away from the agent.

**So what:** Every source here agrees on the recipe, and it is one you already run. Gather 10 to 40 real questions. Fix the dates so the answers are reproducible, have a domain expert sign off the key, and compare results rather than SQL. Change one thing per run and read the difference as a paired comparison. The sources split on the judge. dbt Labs rejects it, Data Culture uses it only as a fallback, and Snowflake and Omni make it the main grader. Nearly all of this writing is about agents that answer questions. Grading an agent that builds models on your own project still rests on ADE-bench's April advice and a May plugin.

**Searched for and not found:** any in-window activity on ADE-bench #148 or the typedef plugin; the dbt Summit talk's slides or recording; a dbt Labs guide to building a golden set for Wizard or its Analyst agent on a customer's project; any published pass rate from a team grading an agent against its own dbt project.

## Level 2a - Where eval questions come from, and how the set stays fresh

**Background:** Snowflake's [Getting Started with Cortex Agent Evaluations](https://www.snowflake.com/en/developers/guides/getting-started-with-cortex-agent-evaluations/) (updated 2026-03-17) says only "Update ground truth as requirements evolve." Databricks' [Genie spaces post](https://www.databricks.com/blog/how-build-production-ready-genie-spaces-and-build-trust-along-way) (2026-02-06) has subject-matter experts write 10-20 benchmark questions with validated SQL. Braintrust's [Topics article](https://www.braintrust.dev/articles/analyze-ai-agent-usage-patterns-eval-datasets-2026) (2026-06-17) clusters traces by intent. Omni's [Evals docs](https://docs.omni.co/ai/evals) (undated): "Add regression prompts when an AI answer turns out to be wrong."

### Self-Improving Agents with Cortex Code
[link](https://www.snowflake.com/en/developers/guides/self-improving-agents-with-cortex-code/) · 2026-09-02 · vendor developer guide (Snowflake) · read in full · listed source

1. **What it is about:** CoCo, Snowflake's coding agent, reads a deployed Cortex Agent's production traces (the logged record of each question, tool call and answer) and curates an evaluation dataset from them. You choose the metrics and the traffic period; CoCo helps select questions and annotate ground truth, and saves a "frozen snapshot" table.
2. **Why you're seeing it:** `warehouse-agentic`, `efficacy-methodology`.
3. **Seen before?** Partly. The same authors' TechUp lab (breadth pass) used CoCo to rewrite an agent's instructions. This covers where the questions come from.
4. **Relates to:** Level 1's best-practices guide, which mines prototype logs. Snowflake's [docs](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-agents-evaluations) add synthetic questions generated from the agent's configuration.
5. **Takeaways for you:** "Ground truth should always be independently verified - don't just assume production traces were correct." A logged answer is a draft label, and the frozen dataset keeps before and after comparable.

### Publish eval suites, skip approvals, and build Hex projects from your chat agent
[link](https://learn.hex.tech/changelog/2026-09-15) · 2026-09-15 · vendor changelog and docs (Hex) · read in full (entry, plus the [Evals docs](https://learn.hex.tech/docs/agent-management/evals) bootstrap prompt) · listed source

1. **What it is about:** Hex, a hosted notebook and BI tool, now lets eval suites be published from the command line and scheduled daily, weekly or monthly. A bootstrap prompt has your coding agent pull the last 30 days of Threads (Hex's chat conversations), rank topics by "distinct question intent, not raw count", read 25 representative threads and draft `evals.yaml`.
2. **Why you're seeing it:** `analytics-broad`, `agent-efficacy`.
3. **Seen before?** Yes. The 2026-09-24 analytics-agents exploration covered the Evals launch. The bootstrap prompt and schedules are new.
4. **Relates to:** Braintrust's Topics (Background), which clusters traces the same way.
5. **Takeaways for you:** The draft is "judge-only": rubrics but no expected values. It stops at "tell me to review evals.yaml", and publishing needs a Manager or Admin role, so sign-off is a permission.

### analytics-evals: mining golden questions from warehouse query history
[link](https://github.com/PaddyCH96/analytics-evals) · 2026-09-07 (initial commit) · open-source repository (individual author, no stars yet) · read in full (README, `generate-golden-queries` skill, query-history SQL) · search

1. **What it is about:** Six agent skills for testing analytics agents. The first reads 90 days of the warehouse's query history (its log of every SQL statement run), drops traffic from dbt, loaders and dashboards, ranks what is left by distinct users × log(run count) × tables touched, and writes the business question behind each query.
2. **Why you're seeing it:** `agent-efficacy`, `dbt-context`.
3. **Seen before?** No. Level 1's sources start from questions typed to an agent; this starts from SQL analysts already ran.
4. **Relates to:** dbt-agent-trust's "would they write the same SQL?" test. Without query history it falls back to the dbt manifest, the file describing every model and metric.
5. **Takeaways for you:** Business rules stay out of the question: "Whether the agent knows that rule is exactly what you are measuring." "Nothing enters the suite without a human confirming it." Nothing covers refreshing the set.

### Why Did Your LLM Golden Dataset Go Stale? A Maintenance and Sampling Workflow
[link](https://oneuptime.com/blog/post/2026-08-31-maintain-stale-llm-golden-dataset/view) · 2026-08-31 · engineering blog (OneUptime, an observability vendor) · read in full · search

1. **What it is about:** A general workflow, for AI apps rather than data, for keeping a golden set current. It names five kinds of staleness (traffic drift, system changes, expired knowledge, policy shifts, inconsistent labels) and finds them by comparing recent production traffic with the set.
2. **Why you're seeing it:** `efficacy-methodology`.
3. **Seen before?** No. Level 1 had one retirement rule, from dbt-agent-trust. This is a whole maintenance cycle.
4. **Relates to:** In dbt terms (our inference), a renamed model or redefined metric is a "system change" that makes a pinned answer wrong. Langfuse's [guide](https://langfuse.com/resources/engineering/golden-dataset-evaluation) (undated) adds versions and "Archive rather than delete".
5. **Takeaways for you:** Three pools - anchor regressions, rolling cases resampled to match traffic, and challenge cases - stratified by traffic with minimums for rare segments. Relabel monthly or per release.

**Leads:**
- **L2a-a** - Query history as the source of golden questions. Read analytics-evals' `generate-golden-queries` and `run-agent-eval` skills with its `goldens.example.yaml`, Snowflake's "import queries from production monitoring" dataset option, Databricks' "Add as benchmark" action, and dbt's [model query history](https://docs.getdbt.com/docs/explore/model-query-history). Read for how SQL someone already ran becomes a question with a pinned answer, and what gets filtered out.
- **L2a-b** - Tying a golden case to the dbt models it depends on. Read versioning and retirement in Langfuse datasets, Hex suite IDs and schedules, Snowflake's frozen snapshots and agent-version targeting (GA 2026-08-21), dbt-agent-trust's retire-on-model-change rule, and dbt's `state:modified` selector, which lists the models a change touches. Read for how a team knows which expected answers a model change has made stale.

**So what:** All four sources use one pattern: mine a log, let a machine draft the cases, have a person confirm each one. They differ on which log - agent traces show only what people asked the agent, while query history shows what analysts asked the warehouse, a broader frame. Keeping the set fresh is the weak part: none of the sources links a golden case to the dbt model its answer depends on, and that link is data-engineering work.

**Searched for and not found:** a Databricks Genie benchmark change dated after May 2026; dates on Omni's regression-prompt guidance and Snowflake's dataset-curation docs; any vendor procedure for re-checking expected answers when a dbt or semantic model changes; an in-window LangSmith write-up on building datasets from traces.

## Level 2b - Grading an agent that builds or changes dbt models

**Background:** ADE-bench's task anatomy predates the window (no commits to main since 2026-06-27). A `setup.sh` breaks the project; a hidden `solution.sh` is run only by a non-LLM "sage" agent to produce answer-key CSVs; auto-generated `AUTO_` tests check that the agent's tables exist and match them. typedef.ai's [April post](https://www.typedef.ai/blog/building-production-scale-evals-for-data-agents) planted bugs in a 260-model project at four difficulty levels; the hardest also deletes the test that would have caught the bug.

### How much do you bench? (Data Minded's hackathon benchmark)
[link](https://github.com/datamindedacademy/how-much-do-you-bench) · 2026-08-26 (first commit; design doc dated 2026-08-04) · open-source repository (Data Minded Academy) · read in full (README, design doc, one task) · search

1. **What it is about:** A hackathon benchmark in which every team gets the same model and competes on harness, skills and tools. Five sample tasks are public; the score comes from 17 hidden tasks in a private repository only the grading workers can clone.
2. **Why you're seeing it:** `efficacy-methodology`, `benchmarks-depth`.
3. **Seen before?** Only named in level 1's lead. The public/private split is the one SWE-bench uses.
4. **Relates to:** ADE-bench's hidden solution script. This one also restores the test files "from the image before grading", so an agent cannot edit its own grader.
5. **Takeaways for you:** Tests must "assert on output data ... never on the shape of the code." Difficulty came from data volume: a double-counting task on an incremental model (one that processes only new rows each run) passed 5/5 on six rows and 1/5 on 30,000.

### SiriusDeliver: Automating Data Warehouse Delivery at Tencent
[link](https://arxiv.org/html/2608.09185) · 2026-08-10 · research paper (Tencent, Wuhan University) · read in full · search

1. **What it is about:** Tencent's agent for warehouse change requests: a user asks for a sync or computation job, and the agent produces the SQL, PySpark or Flink code and its configuration. The test set is 200 real requests from early 2026 on WeData, Tencent Cloud's data-development platform.
2. **Why you're seeing it:** `efficacy-methodology`, `agent-efficacy`.
3. **Seen before?** DataClawEval, in the breadth pass, also drew on Tencent production code. This is a set of change requests rather than a public benchmark.
4. **Relates to:** Mining tasks from your own history, as level 1's Snowflake guide did with questions.
5. **Takeaways for you:** Grading was done by people: three warehouse engineers checked every output against a checklist and settled disagreements. Sessions used to train the agent's skills were kept separate from the test cases, and everything was frozen before evaluation.

### Mutation coverage for a dbt model's tests (dex PR #467)
[link](https://github.com/exmergo/dex/pull/467) · opened 2026-09-10, merged 2026-09-16 · open-source repository (Exmergo) · read in full (description) · search

1. **What it is about:** dex is an open-source toolkit that lets coding agents explore a warehouse and write dbt models. `transform test --mutate <model>` plants defects in a model's SQL - flipped comparisons, dropped filters, inner and left joins swapped, SUM for MAX - and runs the model's existing tests against each broken copy.
2. **Why you're seeing it:** `efficacy-methodology`, `dbt-context`.
3. **Seen before?** No. This is mutation testing: deliberately breaking code to see whether the tests notice.
4. **Relates to:** typedef's bug catalogue (Background) uses the same breakage to build tasks; dex uses it to check the tests themselves.
5. **Takeaways for you:** A missed bug is reported as "your tests would not catch an inner join here", with a suggested test. A grader built from dbt tests is only as strong as those tests.

### dbt PR Review (Altimate Code)
[link](https://help.altimate.ai/code/usage/dbt-pr-review/) · page dated 2026-08-07 · vendor documentation (Altimate) · read in full · search

1. **What it is about:** Altimate, a vendor of AI tooling for dbt, documents a pull-request reviewer that returns a single verdict. Only deterministic checks can block a merge: whether a refactor returns identical results, column lineage (which downstream models a change reaches), newly exposed personal data and SQL anti-patterns. An optional data diff reports which rows and values changed.
2. **Why you're seeing it:** `agent-efficacy`, `warehouse-agentic`.
3. **Seen before?** The breadth pass dropped Altimate's ADE-bench page as undated.
4. **Relates to:** DataClawEval's "rule-based grading is irreplaceable" (breadth pass). The docs say it is built for human-authored pull requests.
5. **Takeaways for you:** LLM findings are "clamped to ≤ warning — enriches the review, never blocks". The bot never formally approves, so a person still has to.

### recce-devloop: data review before the pull request (Recce plugin PR #44)
[link](https://github.com/DataRecce/recce-claude-plugin/pull/44) · opened 2026-09-03, merged 2026-09-11 · open-source repository (Recce) · read in full (description) · search

1. **What it is about:** Recce reviews dbt pull requests by comparing a change's tables with production - schema changes, row counts, value shifts and downstream impact, together called a data diff. This Claude Code plugin runs that review in rounds while a model is still being edited.
2. **Why you're seeing it:** `warehouse-agentic`, `agent-efficacy`.
3. **Seen before?** Named in breadth lead L4b, but not read there.
4. **Relates to:** Altimate above. Recce's [February post](https://blog.reccehq.com/designing-reliable-ai-agents-for-dbt-data-reviews) (Background) splits the work the same way: warehouse queries are deterministic, and the LLM only writes the summary.
5. **Takeaways for you:** The tool finds problems and the developer decides to fix or accept each. `/recce-pr-prep` writes those decisions into the pull request, so human judgement is recorded rather than replaced.

**Leads:**
- **L2b-a** - Planted defects as both tasks and checks on the tests. Read typedef's bug catalogue and ade-bench-plugin, dex's `--mutate` with its skill eval case (`skills/transform/evals/evals.json`), Data Minded's calibration notes (each task's pass rate kept between 0% and 60%), and ADE-bench's `setup.sh` patterns. Read for which defect types make hard tasks, and how to tell whether your tests would catch them.
- **L2b-b** - Automatic gates versus human sign-off on an agent's dbt change. Read Altimate's review layers, Recce's review and devloop skills, slim CI (`state:modified+` with `--defer` builds only the changed models and borrows the rest from production), model contracts enforced in CI, dbt v2's `dbt lint` (reported to replace SQLFluff, a SQL style checker), and ADE-bench #155. Read for which checks block a merge, which only advise, and where a person signs off.

**So what:** Turning dbt work into a gradable task follows one recipe: break something real or take a real request, keep the answer key where the agent cannot reach it, and grade on output data rather than code. The weak point is the grader - dex measures whether tests would catch a mistake at all, and Tencent still needed three engineers. It is like validating a metric against planted, known effects before trusting any readout from it.

**Searched for and not found:** a benchmark mined SWE-bench-style from a dbt project's own commit history; any in-window Datafold writing on agent changes (its latest post is 2026-03-05); any commit to ADE-bench's main branch since 2026-06-27; published scores from how-much-do-you-bench.

## Where this path ends

Evaluating an agent on your own dbt project splits in two. For agents that answer questions, the recipe is settled and familiar: mine a log - agent traces, or better, warehouse query history - let a machine draft cases, have an expert sign off each answer, pin the dates, compare results rather than SQL, and change one thing per run. For agents that build or change models, the recipe is to break something real or take a real request, hide the key, and grade on output data. That grader is only as good as the dbt tests behind it, which is why mutation testing (dex) and deterministic pull-request gates with a human sign-off (Altimate, Recce) appeared this quarter. The gap nobody fills is linking each golden answer to the dbt model it depends on, so a model change flags which answers went stale - data-engineering work, and the kind you are moving into.
