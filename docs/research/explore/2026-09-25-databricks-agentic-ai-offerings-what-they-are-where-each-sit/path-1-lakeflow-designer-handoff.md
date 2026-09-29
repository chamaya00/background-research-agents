# Path 1 - Lakeflow Designer: from analyst flow to engineer's pipeline

This path starts from Angle 1 of the breadth pass (agents for data engineers) and follows lead L1b: Lakeflow Designer as the handoff from analyst to engineer. It reads the July 2026 Designer "Summer Release" notes, the Designer page on moving a flow to production, the Genie Code docs on migrating dbt and Informatica projects, one practitioner's migration method, and dbt Canvas, dbt's equivalent of Designer. Items are dated 2026-06-27 or later.

## Level 1 - Lakeflow Designer as the analyst-to-engineer handoff

### Lakeflow Designer Summer Release (July 2026 release notes)
[link](https://docs.databricks.com/aws/en/release-notes/product/2026/july) · 2026-07-24 · vendor release notes · read in full · listed source
1. **What it is about:** Lakeflow Designer is Databricks' drag-and-drop canvas. Analysts chain operators such as filter, join and prepare into a "visual data prep". It sits in Lakeflow, the pipeline layer. This release adds operators, writing to tables and materialized views (query results the platform keeps refreshed) and support for Declarative Automation Bundles.
2. **Why you're seeing it:** `warehouse-agentic`, because Genie Code is built into the canvas.
3. **Seen before?** No. The breadth pass kept Designer as this lead instead of making it an item.
4. **Relates to:** The [August release](https://docs.databricks.com/aws/en/release-notes/product/2026/august) (2026-08-27), which added a visual diff of the canvas to version history, so a change can be reviewed as a picture.
5. **Takeaways for you:** An engineer takes a flow over in two places. Bundles (YAML deployment definitions that CI runs) deploy a Designer file as a notebook task, and a table-of-contents panel shows the generated code for each operator.

### Move a visual data prep file to production
[link](https://docs.databricks.com/aws/en/designer/production) · 2026-09-11 (last updated) · vendor docs · read in full · listed source
1. **What it is about:** This page describes the handoff itself. A Designer file is saved as a notebook named `<name>.designer.ipynb`. To put it into production, you move it into a Git folder, commit it like any notebook, schedule it as a job, and deploy it with a bundle whose targets swap parameters, for example a test catalog for the production one.
2. **Why you're seeing it:** `warehouse-agentic`. Separate development and production environments are also a core data-engineering habit you are picking up.
3. **Seen before?** No.
4. **Relates to:** The Lakeflow launch post (**Background**, [2026-06-16, updated 2026-07-01](https://www.databricks.com/blog/lakeflow-new-era-agentic-data-engineering)). It says every Designer flow "natively runs on a production-ready Spark Declarative Pipeline" and that engineers can "review and refine this code directly in place".
5. **Takeaways for you:** The page does not show what a reviewer sees in a Git diff. Partner write-ups before the window describe the generated code differently: SQL materialized views ([NextLytics](https://www.nextlytics.com/blog/lakeflow-designer-in-databricks-no-code-pipelines-in-practice), April) and PySpark ([NicheeLab](https://nicheelab.com/en/articles/databricks/lakeflow-designer/), May).

### Use Genie Code for pipeline development - the migration section
[link](https://docs.databricks.com/aws/en/ldp/de-agent) · 2026-09-11 (last updated) · vendor docs · read in full · listed source
1. **What it is about:** The migration feature (Beta). You point Genie Code at an uploaded dbt or Informatica project (Informatica is an older enterprise ETL tool) and an empty Lakeflow pipeline. It reads the models and dependencies, asks whether you want SQL or Python, then converts, validates and repairs them into pipeline source.
2. **Why you're seeing it:** `warehouse-agentic`, `dbt-context`.
3. **Seen before?** The page was breadth Angle 1's first item, which only named migration as a use case.
4. **Relates to:** Genie Code's [ANSI SQL converter](https://www.databricks.com/blog/convert-proprietary-code-open-ansi-sql-genie-code) (2026-07-30). It uses parallel subagents to convert T-SQL, Snowflake SQL, Oracle and other dialects, and shows old and new side by side. Both tools are built on Lakebridge, Databricks' migration toolkit.
5. **Takeaways for you:** Databricks tells you to "review the migrated pipeline source and run the pipeline to confirm the results match". Checking that the results match stays your job.

### Stop Translating Alteryx Boxes - a Lakebridge-assisted, test-driven migration
[link](https://community.databricks.com/t5/community-articles/stop-translating-alteryx-boxes-a-lakebridge-assisted-test-driven/td-p/163424) · 2026-07-19 · community article (Databricks Champion) · read in full · listed source
1. **What it is about:** Mou Rakshit, a data architect, sets out a six-stage move from Alteryx to Databricks. Alteryx is the desktop drag-and-drop tool many analysts use, and it is what Designer is pitched against. The stages: keep the originals, assess them, write "behavioral contracts", rebuild natively, embed quality rules, and prove equivalence before cutting over.
2. **Why you're seeing it:** `warehouse-agentic`. It shows the engineer's side of taking over an analyst's canvas.
3. **Seen before?** No.
4. **Relates to:** The item above. Lakebridge only analyses Alteryx workflows and does not convert them.
5. **Takeaways for you:** Preserve "business behavior, not the visual shape of the canvas", because "a forty-tool workflow does not automatically need forty PySpark steps." Old and new run in parallel and their aggregates are compared, much like an A/A test.

### About dbt Canvas
[link](https://docs.getdbt.com/docs/platform/canvas) · 2026-07-23 (last updated) · vendor docs · read in full · listed source
1. **What it is about:** Canvas is the drag-and-drop model editor in dbt's hosted platform. It compiles to standard dbt SQL model files, which are committed to Git and reviewed by pull request. dbt runs on top of warehouses, Databricks included.
2. **Why you're seeing it:** `dbt-context`, `warehouse-agentic`. It is the closest counterpart to Designer.
3. **Seen before?** Wizard, dbt's agent, was covered on 2026-09-24. Canvas was not; it has been GA since **Background** [2025-05-28](https://www.getdbt.com/blog/dbt-canvas-is-ga).
4. **Relates to:** Designer. Both let analysts build visually and hand engineers code, and each points to its vendor's agent: Wizard for Canvas, Genie Code for Designer.
5. **Takeaways for you:** Canvas produces dbt models "indistinguishable from manually-coded models", while Designer produces a `.designer.ipynb` notebook. What lands in the pull request differs, so the review differs.

**Leads:**
- **L1-a** - What an engineer reviews when a Designer flow lands in Git. This covers the `.designer.ipynb` format, the generated code shown per operator, the August canvas diff, and how writers describe what Designer produces (SQL materialized views, PySpark, Spark Declarative Pipelines). Compare it with dbt Canvas pull requests, which are plain SQL. Sources: Databricks docs, community.databricks.com threads and practitioner walkthroughs since July 2026.
- **L1-b** - Migrating a dbt project into Spark Declarative Pipelines with Genie Code and Lakebridge Switch. How dbt models, tests, macros and incremental models map to pipeline objects (materialized views, streaming tables, expectations), when Databricks advises keeping dbt instead, and what practitioners who ran the Beta report. Sources: Lakebridge docs on GitHub, Databricks docs and blog posts, partner blogs since July 2026.

**So what:** The handoff is a file in Git. An analyst's canvas becomes a notebook that an engineer versions, deploys with bundles and parameterizes across environments. Migrations from dbt, Informatica or Alteryx end with the engineer showing that the new outputs match the old. The parts that fall to you are the review, the environments and the equivalence check, which is a comparison you already know from experimentation. The practitioner advice is to migrate the behaviour and not the boxes.

## Level 2a - Reviewing a Designer flow once it lands in Git

### Create a visual data prep in Lakeflow Designer
[link](https://docs.databricks.com/aws/en/designer/build-transformation) · 2026-09-11 (last updated) · vendor docs · read in full · listed source
1. **What it is about:** This is Designer's main how-to page. It lists three places to check a change inside the product. Staged edits wait in a "Pending changes" pane. Each operator has a "Generated code" section. Version history shows "a visual diff on the canvas that compares it with the following version."
2. **Why you're seeing it:** `warehouse-agentic`.
3. **Seen before?** Level 1 cited the August release note for the canvas diff and the production page for Git. This page is the one that describes all three review surfaces.
4. **Relates to:** dbt Canvas (level 1), where the review happens on SQL in a pull request instead.
5. **Takeaways for you:** The page never says which language the generated code is in. Designer's own diff runs inside Databricks, not in your Git pull request.

### Lakeflow Designer: Visual Data Prep for the Modern Lakehouse
[link](https://diggibyte.com/lakeflow-designer/) · 2026-07-15 · consultancy blog (Diggibyte) · read in full · search
1. **What it is about:** Mahendra Boopathi, a data engineer, gives a partner's overview of Designer. It says flows are stored as `.designer.ipynb` notebooks, are "backed by real Python code" so "nothing needs to be rewritten", and can be committed, branched and reviewed "exactly as you would any other code".
2. **Why you're seeing it:** `warehouse-agentic`. It is the only in-window write-up found that describes the Git handoff at all.
3. **Seen before?** No. It adds one more description of the output to level 1's survey.
4. **Relates to:** A Databricks demo repo ([CheeYuTan](https://github.com/CheeYuTan/lakeflow-designer), undated) says Designer "generates the underlying DLT pipeline". The launch post says Spark Declarative Pipeline. Level 1 found SQL materialized views and PySpark.
5. **Takeaways for you:** Writers still describe the output four ways. Nobody shows an actual diff of a `.designer.ipynb` file.

### Unit testing for pipelines (Beta)
[link](https://docs.databricks.com/aws/en/ldp/unit-testing) · Beta 2026-07-26 ([July notes](https://docs.databricks.com/aws/en/release-notes/product/2026/july)); page updated 2026-09-11 · vendor docs · read in full · listed source
1. **What it is about:** You can write Python unit tests (small tests that check one transformation against made-up input) for Spark Declarative Pipelines. Tests redirect table reads and writes to a temporary test schema. Genie Code can scaffold them with a "Generate tests" button or `/tests`.
2. **Why you're seeing it:** `warehouse-agentic`. The agent that writes the pipeline also writes its tests.
3. **Seen before?** No.
4. **Relates to:** The testing blueprint below, which runs tests in CI.
5. **Takeaways for you:** Tests "must be run from the web-based Lakeflow Pipelines Editor", not from CI. Operations addressed by a path "act directly on real production systems". Neither this page nor the Designer pages says whether Designer flows can use these tests.

### From Experiment to Prod: Lakeflow Spark Declarative Pipelines Testing Blueprint
[link](https://community.databricks.com/t5/technical-blog/from-experiment-to-prod-lakeflow-spark-declarative-pipelines/ba-p/164292) · 2026-07-28 · community technical blog (Databricks employee) · read in full · listed source
1. **What it is about:** Taras Chaikovsk describes two layers of tests. Unit tests run fast on open-source PySpark with no Databricks connection. Integration tests deploy a temporary pipeline into its own schema, run it in full and check the results, "the same way locally and in CI".
2. **Why you're seeing it:** `warehouse-agentic`. CI (checks that run automatically on every pull request) is where a reviewer gets evidence beyond reading code.
3. **Seen before?** No.
4. **Relates to:** The unit-testing Beta above, which runs only in the editor. This is the hand-built route into CI.
5. **Takeaways for you:** It works only when the transformation functions are kept separate from the pipeline definition. That fits hand-written code, and nothing in it covers a Designer notebook.

### Advanced CI: compare changes
[link](https://docs.getdbt.com/docs/deploy/advanced-ci) · 2026-09-08 (last updated) · vendor docs · read in full · listed source
1. **What it is about:** When a pull request is opened, dbt's hosted platform builds the changed models and compares them with production. It reports differences in primary keys (the column that identifies a row), in rows and in columns, and posts a summary to the pull request as a Git comment.
2. **Why you're seeing it:** `dbt-context`, `warehouse-agentic`.
3. **Seen before?** Slim CI (building only the changed models) was covered in the 2026-09-24 data-engineering exploration. The data diff was not.
4. **Relates to:** [Wizard Desktop](https://docs.getdbt.com/docs/dbt-ai/wizard-desktop-use) (2026-09-16), where dbt's agent runs tests and then offers "Create PR". Also [compare changes in VS Code](https://docs.getdbt.com/docs/fusion/vs-compare-changes) (2026-09-16), and **Background**: [Recce](https://blog.reccehq.com/designing-reliable-ai-agents-for-dbt-data-reviews) (2026-02-21).
5. **Takeaways for you:** A Canvas or agent change reaches review as SQL plus a data diff. That is a before-and-after comparison, much like the A/A check level 1 described.

**Leads:**
- **L2a-a** - Testing and CI for code a canvas or agent generated on Databricks. Can a Designer notebook or Genie Code output be unit-tested, run as an integration test in CI, or deployed with bundles through GitHub Actions? And when will the editor-only test Beta run in CI? Sources: Databricks docs, the Lakeflow release notes and community technical blogs.
- **L2a-b** - The data diff as the review of an agent-made change. This covers dbt compare changes, Recce and Datafold, and whether Databricks has an equivalent for pipelines. Sources: vendor docs, GitHub repos and practitioner posts since July 2026.

**So what:** On Databricks, a Designer change is reviewed inside the product, through pending edits, the code for each operator and a picture diff. What reaches Git is a notebook that writers still describe four different ways, and nobody has published what its diff looks like. In dbt, the review moves into the pull request, as SQL plus a diff of rows and columns posted by CI. That is the before-and-after comparison you already know from experiments. Databricks' new unit tests run only in the editor, so the CI half of reviewing Designer or agent output is still left to you.

## Level 2b - Moving a dbt project into Spark Declarative Pipelines, or keeping dbt

### Use dbt transformations in Lakeflow Jobs
[link](https://docs.databricks.com/aws/en/jobs/how-to/use-dbt-in-workflows) · 2026-09-11 (last updated) · vendor docs · read in full · listed source
1. **What it is about:** This is Databricks' path for keeping dbt. Lakeflow Jobs is Databricks' scheduler. A dbt project in a Git folder runs as a "dbt task" against a SQL warehouse. Databricks recommends the dbt-databricks adapter, the plugin that lets dbt talk to Databricks.
2. **Why you're seeing it:** `dbt-context`, `warehouse-agentic`. It is the alternative to migrating.
3. **Seen before?** No. Level 1 covered only the migration page.
4. **Relates to:** The [August release notes](https://docs.databricks.com/aws/en/release-notes/product/2026/august) (2026-08-20), which let dbt-task refreshes of materialized views follow the job's performance setting. Also a **Background** [April blog](https://www.databricks.com/blog/open-platform-unified-pipelines-why-dbt-databricks-accelerating) on a Beta task that triggers dbt Labs' hosted platform.
5. **Takeaways for you:** dbt and native pipelines can run side by side as tasks in one job. You can also develop on a warehouse and run production on other compute, but the page warns this "can lead to subtle differences".

### dbt: Databricks configurations
[link](https://docs.getdbt.com/reference/resource-configs/databricks-configs) · 2026-09-16 (last updated) · vendor docs (dbt Labs) · read in full · search
1. **What it is about:** This is the adapter's reference page. A dbt model can be materialized as a materialized view, a streaming table or, since adapter 1.12, a Unity Catalog metric view. A streaming table processes only new rows as they arrive.
2. **Why you're seeing it:** `dbt-context`, `semantic-models`.
3. **Seen before?** dbt microbatch appeared on 2026-09-24. This page lists it as one of six incremental strategies (ways a model adds only new data instead of rebuilding).
4. **Relates to:** The adapter's [CHANGELOG](https://github.com/databricks/dbt-databricks/blob/main/CHANGELOG.md), with releases on 2026-07-09 and 2026-07-29. A tagging fix for materialized views and streaming tables followed on [2026-09-22](https://github.com/databricks/dbt-databricks/pull/1686).
5. **Takeaways for you:** A dbt model can already create the same kinds of objects a pipeline does. One catch: when you change a streaming table's query, the change applies "to future rows only" unless you run `--full-refresh`.

### Databricks processes your data. dbt defines what it means
[link](https://www.getdbt.com/blog/databricks-processes-your-data-dbt-defines-what-it-means) · 2026-08-17 · vendor blog (dbt Labs, Daniel Poppy) · read in full · search
1. **What it is about:** This is dbt Labs' reply to Databricks pulling transformation work into Lakeflow. The post separates two decisions. Choosing Databricks for compute is one. Choosing it to hold your transformation logic is another, and the post calls that "a strategic bet on where your data team's institutional knowledge will live."
2. **Why you're seeing it:** `dbt-context`, `warehouse-agentic`. It is the other vendor's view of this lead.
3. **Seen before?** No. Wizard and Canvas were dbt's product pages, and this is dbt's argument.
4. **Relates to:** Genie Code's migration Beta, covered in level 1. Moving to SDP is the move this post argues against.
5. **Takeaways for you:** The argument is portability. The same project runs on Databricks, Snowflake or BigQuery, and the semantic layer (shared metric definitions) moves with it. Expect the migration question to come to you as a lock-in question.

### Lakebridge v0.15.0 - Reconcile's root-cause dashboard
[link](https://github.com/databrickslabs/lakebridge/releases/tag/v0.15.0) · 2026-08-11 · GitHub release notes · read in full · listed source
1. **What it is about:** Lakebridge is Databricks Labs' open-source migration toolkit. It has three parts: Analyzer, which takes inventory; converters, including Switch, which uses an LLM to translate code; and [Reconcile](https://databrickslabs.github.io/lakebridge/docs/reconcile/), which compares source data with target data. This release adds a dashboard that explains why rows fail to match.
2. **Why you're seeing it:** `warehouse-agentic`.
3. **Seen before?** Level 1 named Lakebridge as the base of Genie Code's converters.
4. **Relates to:** Level 1's advice to confirm that the results match. Reconcile lists Databricks as a source, which suggests it could compare dbt's old tables with the pipeline's new ones. No page describes that use.
5. **Takeaways for you:** In the public repo, Switch has built-in prompts for Informatica-to-SDP and SAS, but none for dbt. The dbt converter appears only inside Genie Code.

**Leads:**
- **L2b-a** - Streaming tables and materialized views written from dbt versus written in a pipeline. The same object can be declared two ways: through dbt-databricks, with its refresh schedules, `--full-refresh` and on-change rules, or natively in SDP. Compare what each hands a reviewer and where refreshes are scheduled. Sources: the dbt-databricks CHANGELOG and pull requests, Databricks materialized-view docs and release notes since July 2026.
- **L2b-b** - Proving that a migrated pipeline matches the original. Cover Lakebridge Reconcile's report types and its new root-cause dashboard, how dbt tests relate to SDP expectations (row-level quality rules that warn, drop bad rows or fail the run), and how practitioners set up a parallel run. Sources: Lakebridge docs and releases, Databricks expectations docs, community.databricks.com articles.

**So what:** Databricks does not ask you to leave dbt. Its own job docs run dbt as a task beside native pipelines, and the dbt adapter already builds the same streaming tables and materialized views that a pipeline would. That turns migration into a question of who owns the logic, which dbt Labs argues explicitly. Nothing public documents how Genie Code's dbt converter maps models, tests and macros. If you ever run a migration, the part you can inspect is the before-and-after comparison of the tables, which is an A/A test.

**Looked for and not found:** a primary source mapping dbt models, tests, macros and incremental models to pipeline objects; a dbt prompt in Lakebridge Switch's public repo; any practitioner report of running Genie Code's dbt migration Beta; and any published Git diff of a `.designer.ipynb` file.

## Where this path ends

Lakeflow Designer lets an analyst build a pipeline on a canvas, and Genie Code writes or migrates pipelines from a prompt. In both cases the engineer's work starts when the result lands in Git. On Databricks that result is a `.designer.ipynb` notebook, deployed with bundles and given different parameters for test and production. Writers still describe what it contains four different ways, and nobody has published what its diff looks like. Review happens mostly inside the product, and Databricks' new pipeline unit tests run only in the editor, so getting tests into CI is still work you do yourself. dbt's counterpart takes the other route: Canvas produces plain SQL, and CI posts a row-and-column diff on the pull request. On migration, Databricks does not insist. dbt runs as a task inside Lakeflow Jobs, and its adapter builds the same streaming tables, materialized views and metric views. What remains is a question of ownership, which dbt Labs raises openly, and a dbt converter whose mapping is not documented in public. For you, the recurring skill is one you already have. Every source ends with the engineer showing that new outputs match old ones, whether in a parallel run, a data diff or Reconcile's comparison. That is an A/A test on tables. The new parts are the scaffolding around it: Git, bundles, environments and CI.
