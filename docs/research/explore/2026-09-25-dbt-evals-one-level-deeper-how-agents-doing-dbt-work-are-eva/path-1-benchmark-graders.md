# Path 1 - What data-engineering benchmarks grade, and what they miss

Follows breadth lead **L2a** (Angle 2, data-engineering benchmarks with dbt tasks).

## Level 1 - How a benchmark decides a task passed

### A Data Engineering Benchmark for AI Agents (data-eng-bench), read through one task's hidden tests
[link](https://www.snowflake.com/en/blog/engineering/data-eng-bench-data-engineering-agent-benchmark/) · 2026-08-06 (tests in the [repository](https://github.com/Snowflake-Labs/data-eng-bench/blob/master/tasks/dbt-monthly-channel-revenue/tests/test_outputs.py), first commit 2026-07-29) · vendor blog and repository (Snowflake) · read in full · listed source

1. **What it is about:** Snowflake grades each of its 103 dbt tasks with 10-50 hidden `pytest` assertions run against the tables the agent builds. One task's file mixes rule checks, such as "ranks are valid (1-5)" and a re-run returning the same rows, with a row-by-row match of all 51 rows against the reference.
2. **Why you're seeing it:** `benchmarks-depth`. This is the one data-engineering grader where you can read every check.
3. **Seen before?** Yes. The 2026-09-24 analytics-agents exploration covered this post and PR #9's disputed reference answer. This item is about the tests.
4. **Relates to:** ADE-bench's grader in the breadth pass, which checks only existence and answer-key matches. **Background:** ADE-bench [#146](https://github.com/dbt-labs/ade-bench/issues/146) and [#151](https://github.com/dbt-labs/ade-bench/pull/151) (May 2026) report answer keys with columns the task never asked for.
5. **Takeaways for you:** Assertions earn partial credit, but a task counts only "if every assertion passes". The rule checks read as a written spec. The all-rows checks tie a pass to one reference file, and PR #9 disputes that file.

### Your text-to-SQL model isn't as wrong as your benchmark says. The gold SQL is.
[link](https://dev.to/omer_hochman/your-text-to-sql-model-isnt-as-wrong-as-your-benchmark-says-the-gold-sql-is-p16) · 2026-08-07 · practitioner blog (dev.to; the author builds nlqdb, a natural-language database layer) · read in full · search

1. **What it is about:** The author sorted his 238 losses on BIRD's development set with a structural diff of about 100 lines. (BIRD is a text-to-SQL benchmark that runs both queries and compares their results.) In 46 of them his model added `DISTINCT` where the gold query had none. In his words, "The scorer marks the model wrong for being right."
2. **Why you're seeing it:** `benchmarks-depth`, `efficacy-methodology`.
3. **Seen before?** BIRD is #35's subject. The 2026-09-24 methodology exploration's path 2 surveyed flaw rates in coding benchmarks. **Background:** the UIUC audit he cites ([arXiv 2601.08778](https://arxiv.org/abs/2601.08778), January 2026) found errors in 52.8% of BIRD Mini-Dev's answer keys.
4. **Relates to:** **Background:** [ELT-Bench-Verified](https://arxiv.org/abs/2603.29399) (March 2026). The largest class of benchmark error it found was the same one: correct outputs failed by a rigid evaluation script.
5. **Takeaways for you:** His rule is to classify losses before tuning anything, and to act only where "gold is right and the model is wrong." "A benchmark number is a floor bounded by its gold quality."

### ModularSQL: A Runtime Guardrail for the Multiplicity Blind Spot in Text-to-SQL
[link](https://arxiv.org/html/2609.29573) · 2026-08-26 · research paper (USC, Northeastern) · read in full · search

1. **What it is about:** BIRD's grader compares result *sets*, so it drops duplicate rows before comparing. That means a query with a missing `DISTINCT`, or with a join that multiplies rows (fan-out), still gets full credit. Scored with duplicates counted ("Multiset-EX"), five systems lose 3.4 to 6.8 points on BIRD-Dev.
2. **Why you're seeing it:** `benchmarks-depth`.
3. **Seen before?** No.
4. **Relates to:** The previous item, from the other side: there the gold query lacks a `DISTINCT`, and here the prediction does. Spider's test-suite grader already compares with duplicates counted.
5. **Takeaways for you:** The comparison rule is a design choice, and it has blind spots of its own. Duplicate rows are grain errors, and grain (what one row stands for) is what data-eng-bench asserts on directly. The authors tested only BIRD-Dev on SQLite.

### Half the answer keys in text-to-SQL benchmarks are wrong. So I generated the database from the answer key.
[link](https://dev.to/rasinmuhammed/half-the-answer-keys-in-text-to-sql-benchmarks-are-wrong-so-i-generated-the-database-from-the-3431) · 2026-07-10 · practitioner blog (dev.to; the author maintains Misata, an open-source synthetic-data generator) · read in full · search

1. **What it is about:** He argues that answer keys go wrong because annotators write them after reading an unfamiliar database: "The answer key is a claim about the database, and claims can be wrong." His fix runs the other way. He declares the answers first, such as a fraud rate rising from 2% to 3.5%, and then generates data that satisfies them. Every gold query is then run in DuckDB, which shares no code with his generator.
2. **Why you're seeing it:** `efficacy-methodology`, `benchmarks-depth`.
3. **Seen before?** No.
4. **Relates to:** The BIRD item above. Both start from the same audit, but this one fixes the key when the benchmark is built rather than when it is scored.
5. **Takeaways for you:** 35 questions passed verification. Five were rejected because whole-number counts could not hit the declared rates, and he published them with the reasons. The method covers aggregates, counts and rates only, and he says it "complements human-authored benchmarks".

### Skill-based Agentic Evaluation for Real-time Data Science Tasks
[link](https://arxiv.org/abs/2609.16487) · 2026-09-15 · research paper · summary only (abstract; the full text came back as a PDF that could not be opened) · search

1. **What it is about:** When an agent answers questions over data that is refreshed all the time, any answer stored in advance goes stale. So each expected answer is written as "ground-truth-as-code": a reference function that is re-run on current data at grading time. A judge then splits the agent's reply and the fresh answer into atomic facts and scores precision and recall, whatever the format of the reply.
2. **Why you're seeing it:** `efficacy-methodology`, `agent-efficacy`.
3. **Seen before?** No. The breadth pass's dbt-agent-trust also tries exact matching before it falls back to a judge.
4. **Relates to:** DataClawEval, in the breadth pass, found that judges inflate scores when they cannot see runtime behaviour. Here the judge only compares facts against an answer computed fresh.
5. **Takeaways for you:** It reports a "29% improvement in the Matthews Correlation Coefficient" over natural-language references, on one production capability. The pattern fits your own project, where the data never sits still.

**Leads:**
- **L1-a** - Where data-engineering answer keys come from, and how they get repaired. Read ELT-Bench-Verified's Auditor-Corrector method and its error taxonomy (arXiv 2603.29399), and the ground truth ELT-Bench reworked in its August 2026 multi-warehouse commits (`uiuc-kang-lab/ELT-Bench` 661c8ea). Then ADE-bench's `sage` agent and seed CSVs, with the fixes still open against them (#141, #146, #151), data-eng-bench PR #9, and BenchGuard's cross-artifact audits (arXiv 2604.24955). Read for how each benchmark builds its gold, checks it and corrects it, and who is allowed to.
- **L1-b** - The comparison rule: how a data benchmark matches output to gold. Read BIRD's set-based evaluator against Spider's test-suite `multiset_eq` (via ModularSQL), and Spider 2.0-DBT's gold-table matching that tolerates extra columns. Then ADE-bench's generated equality and existence tests, data-eng-bench's tolerance-based assertions and partial credit, DataClawEval's output-plus-process scripts, and the factoid judge above. Read for what each rule forgives (row order, extra columns, duplicates, rounding, format) and so what it cannot see.

**So what:** In each benchmark here, "passed" rests on three separate parts: an answer key, a rule for comparing output against it, and any rules asserted on top. This level found each part failing on its own. Keys are wrong when written (the BIRD audit, Misata). A comparison rule forgives duplicates (ModularSQL). Keys go stale as the data moves (ground-truth-as-code). Only data-eng-bench writes its rules down where you can read them. For you this is home ground: a benchmark pass rate is a metric, and the questions that decide whether an experiment metric means anything decide this too. What is the unit, is the definition right, and can a join count a user twice?

**Searched for and not found:** a maintainer response on ADE-bench #146 or #151, or on data-eng-bench PR #9 (all still open, with no comments); an in-window revision of ELT-Bench-Verified (its last version is 2026-04-02); an in-window study of LLM judges on dbt tasks other than DataClawEval.

## Level 2a - Where answer keys come from, and who repairs them

### Spider 2.0-DBT's answer keys, audited task by task (Spider2 issues #223-#230)
[link](https://github.com/xlang-ai/Spider2/issues/224) · 2026-09-20 · open-source repository issues (xlang-ai, Spider 2.0) · read in full (#224, #226; #223, #225, #227-#230 as issue-list entries) · search

1. **What it is about:** One outside contributor filed eight defects against Spider 2.0-DBT, the 68-task dbt track, in a single day. chinook001's gold database is byte-identical to the task's starting files, so the three tables it grades on do not exist and "every submission scores 0". Three other tasks name gold files that are not shipped under those names.
2. **Why you're seeing it:** `benchmarks-depth`, `dbt-context`.
3. **Seen before?** No. The breadth pass looked for any Spider 2.0-DBT development in the window and found none.
4. **Relates to:** In flicks001, the gold covers a different set of people than its own staging model (the cleaned-up layer later models build on). Issues #225 and #226 are grader bugs, level 2b's subject.
5. **Takeaways for you:** None of the eight has a reply yet. A gold that was never built looks the same as a hard task until someone opens the file.

### DataAgentBench's golden answers, disputed one question at a time (issues #97-#107)
[link](https://github.com/ucbepic/DataAgentBench/issues/98) · 2026-09-09 to 2026-09-13 · open-source repository issues (UC Berkeley) · read in full (#98, #102, #107; #97, #101, #105 as issue-list entries) · search

1. **What it is about:** DataAgentBench (DAB) asks data agents questions across several databases. One user filed six disputes about its gold answers in five days. The "fewest transfers" gold came from a helper that counts only agents who transferred, "which never sees agents with none". All nine public submissions scored 0 on a cancer question whose gold groups by a different code than the question asks for.
2. **Why you're seeing it:** `benchmarks-depth`, `efficacy-methodology`.
3. **Seen before?** The benchmark, yes: the 2026-09-24 analytics-agents exploration covered its 2026-08-18 re-score (#86). These disputes are new.
4. **Relates to:** **Background:** in ELT-Bench-Verified, JOIN-type errors were the agents' second-largest error class. Here the gold makes that mistake: a join that drops rows with no match.
5. **Takeaways for you:** None of the six has a reply yet. A question that every submission fails is worth a second look at its gold.

### Disable web tools in the codex configs (data-eng-bench PR #7)
[link](https://github.com/Snowflake-Labs/data-eng-bench/pull/7) · opened 2026-08-19, merged 2026-09-02 · open-source repository (Snowflake Labs) · read in full · listed source

1. **What it is about:** data-eng-bench's tasks and reference solutions are public, so an agent with web search could look up the answers. This change turns web search off for Codex (OpenAI's coding agent), and for Cortex Code, Snowflake's, once Harbor 0.22.0 (a shared task format and runner) allowed it. The README recommends a network allowlist as the stricter control.
2. **Why you're seeing it:** `benchmarks-depth`, `efficacy-methodology`.
3. **Seen before?** The benchmark, yes (Level 1 and the 2026-09-24 exploration). This change, no.
4. **Relates to:** PR #4 (2026-08-06), "pre-release updates to reference solutions, verifier", was opened and merged by Snowflake's maintainers the same day. PR #9, an outsider's fix to one reference answer, is still open.
5. **Takeaways for you:** An open answer key has two jobs: anyone can check it, and no agent may copy it. So far only the maintainers have changed the references.

### Benchmarking the Benchmarks: A Validity Audit of Tool-Calling Evaluation
[link](https://arxiv.org/html/2607.02577) · 2026-06-30 · research paper (CoreThink AI, Stanford) · read in full · search

1. **What it is about:** Three annotators read the full traces of 496 tasks from four tool-calling agent benchmarks (BFCL v4, τ²-Bench, LiveMCPBench, MCP-Atlas), judging only whether the user's goal was met. The benchmarks' own graders disagreed with them on 18.5% of tasks, from wrong gold to judge rubrics regenerated on every run.
2. **Why you're seeing it:** `efficacy-methodology`, `agent-efficacy`.
3. **Seen before?** Named and dropped from a search listing in the 2026-09-24 methodology exploration. Read in full here.
4. **Relates to:** **Background:** ELT-Bench-Verified's Auditor-Corrector had an agent diagnose each failure and a single engineer classify it. Here humans grade from scratch.
5. **Takeaways for you:** Their repair runs deterministic checks on outcomes first. A judge scores only what is left and cannot overturn a failed check. It agrees with the experts 95.5% of the time.

### WorkSurface-Bench: gold answers that have to re-run
[link](https://arxiv.org/html/2607.25765) · 2026-07-28 · research paper · read in full · search

1. **What it is about:** A benchmark of 1,151 enterprise tasks over documents, tables and dependency graphs. LLMs proposed the questions, but "we never take a gold answer from LLM free text". A table's gold answer is whatever its DuckDB query returns, and a document's gold answer must be an exact passage from the source.
2. **Why you're seeing it:** `benchmarks-depth`, `efficacy-methodology`.
3. **Seen before?** No. Level 1's Misata item also ran every gold query in DuckDB.
4. **Relates to:** Spider 2.0-DBT's chinook001 above, whose gold was never built. A release check that re-runs every gold would have caught it.
5. **Takeaways for you:** The audit is a script anyone can run: all 453 table golds re-execute and match, and a lock file pins source commits and file hashes so the gold can be rebuilt exactly. That shows a gold reproduces, not that it answers the question as worded.

**Leads:**
- **L2a-a** - Outside reports against dbt-track answer keys, and what maintainers do with them. Read Spider 2.0-DBT issues #215 and #223-#230, plus the older missing-gold reports #101 and #156. Then ADE-bench #141, #146 and #151 (no commit to its main branch since 2026-05-28), data-eng-bench PR #9, and ELT-Bench-Verified's still-open PR #18. Read for who replies, how long it takes, and whether any benchmark keeps an errata log or versioned gold.
- **L2a-b** - Gold built as something that can be re-derived. Read WorkSurface-Bench's executed-query gold and lock file, the seeded ground truth in "The Double Measurement Confound in Agent Benchmarks" (arXiv 2609.09218), ADE-bench's `sage` agent and its `--seed` export of answer-key CSVs, and ELT-Bench's move of its gold to Hugging Face (8740be4). Read for how each rebuilds its gold when the data or the spec changes, and who reviews the rebuild.

**So what:** In every benchmark here, the maintainers build the answer key and outsiders find what is wrong with it. This quarter most of those reports have no reply (Spider 2.0-DBT, DataAgentBench, ADE-bench, ELT-Bench-Verified). The builds that hold up treat gold as something derived - a query that re-runs, a pinned file hash - which is how you already treat a metric definition. Before you trust a dbt benchmark's number, read its issue tracker as you would a metric's known-issues log.

**Searched for and not found:** a maintainer reply to any of Spider 2.0-DBT #223-#230 or DataAgentBench #97-#107; any ADE-bench commit since 2026-05-28; a comment on or merge of ELT-Bench-Verified's PR #18, which now targets a branch named `eltbench_old`; any BenchGuard commit or paper after 2026-06-02.

## Level 2b - The comparison rule: how a data benchmark matches output to gold

### spider2-dbt: compare_pandas_table matches columns independently, not rows together (with #225, its numeric tolerance)
[link](https://github.com/xlang-ai/Spider2/issues/226) · 2026-09-20 (companion [#225](https://github.com/xlang-ai/Spider2/issues/225) the same day) · open-source repository issues (Spider 2.0, filed by an outside user) · read in full · search

1. **What it is about:** Spider 2.0-DBT's grader compares the agent's output table with the gold table one column at a time, sorting each column. #226 shows that it scores a perfect 1 when every column holds the right values but the amounts are paired with the wrong document IDs. #225 shows that sorting numbers as text defeats its 0.01 rounding tolerance.
2. **Why you're seeing it:** `benchmarks-depth`. This is the grader behind the dbt track of a benchmark #35 covered.
3. **Seen before?** Level 1's ModularSQL item found BIRD forgiving duplicate rows. This is a different thing to forgive: which values belong on the same row.
4. **Relates to:** Comparing column by column is also what lets Spider 2.0-DBT accept extra columns. Neither issue has a reply yet; the evaluation code last changed on 2025-07-25.
5. **Takeaways for you:** A rule that forgives column order and extra columns can end up forgiving a wrong join. The reporter names a real task, `quickbooks002`, whose 10 columns are graded this way.

### AttestQL: auditing text-to-SQL gold and predictions with typed replay
[link](https://github.com/ivermin1123/attestql) · release 0.4.0 on 2026-09-14 (public history from 2026-09-02) · open-source tool (individual developer, on PyPI, Python's package index) · read in full (README, commit list) · search

1. **What it is about:** It re-runs a benchmark's gold and predicted queries and compares the results two ways: BIRD's own set rule, and a "typed" rule that "keeps duplicate rows, keeps order where the gold orders, and compares values by declared type."
2. **Why you're seeing it:** `benchmarks-depth`, `efficacy-methodology`.
3. **Seen before?** Level 1's ModularSQL and Hochman items both started from BIRD's set comparison. This tool measures that comparison across nine published prediction files.
4. **Relates to:** Of 1,239 PostgreSQL predictions BIRD credits, 164 disagree under the typed rule. On hand review, 69 were wrong answers and 74 were duplicated rows "a reader would forgive". BIRD's maintainers replied to three of its issues on 2026-09-05.
5. **Takeaways for you:** When two rules disagree, the disagreements split into real mistakes and forgivable formatting. The author says the tool does not "prove semantic equivalence".

### [bird_sql] Add versioned, configurable SQL result-comparison modes
[link](https://github.com/NVIDIA-NeMo/Gym/issues/3357) · 2026-09-14 · open-source repository issue (NVIDIA NeMo Gym) · read in full · search

1. **What it is about:** NeMo Gym is NVIDIA's library of environments for training models by reinforcement learning, where a grader's score becomes the training reward. The issue asks its BIRD environment for three comparison modes: unordered set (the current default), unordered multiset (duplicates counted) and ordered rows.
2. **Why you're seeing it:** `benchmarks-depth`, `efficacy-methodology`.
3. **Seen before?** The breadth pass's `elt-bench-rl` showed a benchmark becoming a training target. This is the comparison rule inside one such target.
4. **Relates to:** Level 1's ModularSQL described the same set-versus-multiset gap. The issue opens: "Execution-based SQL benchmarks do not all share the same result semantics."
5. **Takeaways for you:** It keeps the old default and asks for the effect on "score-comparability" to be documented, because two scores compare only under the same mode. By inference, a forgiving rule used as a reward trains the model to exploit what it forgives.

### DataSpace: Benchmarking Data Agents for Verifiable Analytics over Heterogeneous Workspaces
[link](https://arxiv.org/html/2608.03451) · 2026-08-04 · research paper (HKUST Guangzhou, Tsinghua) · read in full · search

1. **What it is about:** It has 410 financial and healthcare analytics tasks, and each answer must be a complete table. The grader ignores column headers and column order and pairs columns one to one. It compares rows as a multiset, or in order for 92 tasks, after normalising values by type: text, decimals to a set precision, dates and nulls.
2. **Why you're seeing it:** `benchmarks-depth`.
3. **Seen before?** No.
4. **Relates to:** It is the strict mirror image of Spider 2.0-DBT: "missing or extra rows and columns make the prediction incorrect". It uses no LLM judge.
5. **Takeaways for you:** It sets out, task by task, every choice a comparison rule has to make. The cost of its strictness is that an agent that adds a helpful key column fails.

### feat(eval): report a lenient accuracy that allows extra and reordered columns
[link](https://github.com/nadeem4/nl2sql/pull/152) · 2026-09-22 · open-source pull request (nl2sql, a small natural-language-to-database project) · read in full · search

1. **What it is about:** The author found most remaining failures were "shape mismatches a person would accept, not wrong answers", such as a full name in one column against separate first and last names. He adds a lenient score beside the strict one, following "Spider 2.0's column matching rule" and Defog's `sql-eval`, an open-source SQL evaluation harness.
2. **Why you're seeing it:** `benchmarks-depth`.
3. **Seen before?** It echoes Hochman in level 1: sort your losses before you trust the number.
4. **Relates to:** Unlike Spider 2.0, matched columns must still line up row by row, so "values swapped between rows still fail" - the gap #226 reported two days earlier. Extra columns are capped, so `SELECT *` cannot pass.
5. **Takeaways for you:** On 43 questions, the same run scores 58.1% strict and 69.8% lenient. Reporting both shows how much the rule forgives, which one blended number would hide.

**Leads:**
- **L2b-a** - Duplicates and types: set, multiset or typed comparison. Read AttestQL's measurement documents and ADR-0013, its three BIRD issues and the maintainers' replies, NeMo Gym's `bird_sql` environment and any pull request that answers #3357, and ModularSQL's Multiset-EX. Then read DataSpace's value-canonicalisation rules and Spider's test-suite `multiset_eq`. Read for how each benchmark decides whether a repeated row or a reformatted value counts as a different answer.
- **L2b-b** - Which columns count: extra-column tolerance and column alignment. Read Spider 2.0-DBT's `condition_cols` and `ignore_orders` settings per task in `spider2_eval.jsonl` (and the closed, empty issue #183, "Aligned comparison"), Defog's `sql-eval`, nl2sql's guardrails, DataSpace's header-invariant alignment, and ADE-bench's answer keys with columns nobody asked for (#146, #151). Read for how a grader decides which output columns are graded and which are ignored.

**So what:** A comparison rule is a metric definition: one project's score moves from 58% to 70% under a different rule, and 13% of what BIRD credits changes verdict under a stricter one. Each rule decides what to forgive - duplicates, row pairing, extra columns, rounding - and each choice has a visible cost, a wrong join credited on one side and a correct answer failed on the other. It is the same choice as whether a metric deduplicates users, so for any benchmark score, ask under which comparison rule it was earned.

**Searched for and not found:** a maintainer reply to Spider2 #225 or #226, or any change to Spider 2.0-DBT's evaluation code since 2025-07-25; a stated numeric tolerance or duplicate policy in AgenticDataBench's table matching; an in-window paper on LLM judges for SQL semantic equivalence.

## Where this path ends

A benchmark's pass rate on dbt work rests on three parts that each fail on their own: the answer key, the rule that compares output with it, and any checks written on top. This quarter outsiders found broken keys faster than maintainers answered them - eight Spider 2.0-DBT reports and six DataAgentBench disputes, none replied to - and showed the same output passing or failing depending on the comparison rule. The benchmarks that held up treat gold the way you treat a metric definition: a query that re-runs, a pinned hash, rules written where anyone can read them, as data-eng-bench does. So a dbt benchmark number is a metric whose definition you read before its value, and its issue tracker is the known-issues log you check first.
