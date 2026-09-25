# Path 1 - Writing metrics in the new spec

This path starts from breadth lead L2a, under angle 2 ("How metrics are defined"). It asks how you actually learn to write a semantic model in the new YAML format, by example. It reads dbt's own tutorial, its sample project, its best-practice guide, the release that brought the format to free dbt, and dbt's guide to having its agent write one. It also notes which tutorials still teach the old format, which has separate `semantic_models:` and `measures:` blocks.

## Level 1 - Learning the new spec by example

### dbt Core v1.12 brings the new spec to open-source dbt
[link](https://github.com/dbt-labs/dbt-core/releases/tag/v1.12.0) · 2026-07-16 (GA post [2026-08-17](https://www.getdbt.com/blog/dbt-core-v1-12-is-ga)) · open-source release notes and vendor blog · read in full · search
1. **What it is about:** dbt Core is the free, open-source dbt you run on your own machine. Version 1.12 reads the new YAML: the semantic model sits on the model's own entry, entities and dimensions sit on its columns, and simple metrics replace measures. It also reads Ossie files and now builds on MetricFlow directly. In July, the paid dbt platform also added the new spec to its "Latest" release track.
2. **Why you're seeing it:** It is when the new format reached free dbt (`semantic-models`, `dbt-context`).
3. **Seen before?** The breadth pass read the migration guide. The 2026-09-24 exploration dated the format to dbt v2 and the platform. This is the open-source release.
4. **Relates to:** Breadth lead L1a, the free-versus-paid line: you can now learn the new spec without an account.
5. **Takeaways for you:** Practise on dbt 1.12 or later. Earlier versions of dbt Core read only the old format.

### Quickstart for the dbt Semantic Layer
[link](https://docs.getdbt.com/guides/sl-snowflake-qs) · last updated 2026-08-25 · vendor tutorial · read in full · listed source
1. **What it is about:** dbt's step-by-step tutorial, written only in the new spec. It builds a small project on a warehouse and adds a semantic model on `fct_orders`. Then it adds a second model with ratio, cumulative and derived metrics. It ends by querying from Google Sheets, Hex or Sigma.
2. **Why you're seeing it:** It is the first worked example to follow (`semantic-models`).
3. **Seen before?** No. The breadth pass listed the metric types but no tutorial.
4. **Relates to:** The breadth pass's "Creating metrics" page, which this puts in order.
5. **Takeaways for you:** The first model is short. It has a primary entity (`order_id`), a foreign entity (`customer`), a daily time dimension set as the default, and one `sum` metric. The later steps, such as production jobs and service tokens, need the paid platform.

### jaffle-shop, dbt Labs' sample project
[link](https://github.com/dbt-labs/jaffle-shop/blob/main/models/marts/orders.yml) · last commit 2026-09-16 · open-source example project · read in full (raw file) · search
1. **What it is about:** jaffle-shop is a made-up sandwich shop that dbt teaches with. Its `orders.yml` has used the new spec since April. One entry holds the description, the data tests (checks run against the data), the entities on columns, and eight simple metrics. Several of them are filtered counts written as `agg: sum`, `expr: 1`, such as "new customer orders".
2. **Why you're seeing it:** It is a whole project in the new spec (`semantic-models`).
3. **Seen before?** No.
4. **Relates to:** dbt's older [`jaffle-sl-template`](https://github.com/dbt-labs/jaffle-sl-template), last changed November 2025, which still has separate `semantic_models:` and `measures:` blocks.
5. **Takeaways for you:** Read it to see tests and metric definitions in one place. The September update requires dbt v2, which it says installs with `pip install dbt`.

### How we build our metrics (dbt's best-practice guide)
[link](https://docs.getdbt.com/best-practices/how-we-build-our-metrics/semantic-layer-1-intro) · pages last updated 2025-10-07 to 2026-07-07 · vendor guide · read in full · listed source
1. **What it is about:** dbt's nine-page guide to building metrics. It still teaches the old format and says it "doesn't yet use the new YAML specification". Its [refactoring page](https://docs.getdbt.com/best-practices/how-we-build-our-metrics/semantic-layer-8-refactor-a-rollup), updated 2026-07-07, shows old-format YAML and does not carry that warning.
2. **Why you're seeing it:** The lead asked which tutorials still teach the old format (`semantic-models`).
3. **Seen before?** No.
4. **Relates to:** Atlan's [explainer](https://atlan.com/dbt-semantic-layer/), updated 2026-07-30, is also in the old format and never mentions the change. So is MotherDuck's undated cookbook.
5. **Takeaways for you:** The advice outlasts the syntax. Start from one important dashboard number. Build semantic models for the tables under it, rebuild the number on the layer, and audit it before retiring the old table. Prefer normalized tables and let MetricFlow do the joins.

### Building Semantic Layer definitions with dbt Wizard
[link](https://docs.getdbt.com/best-practices/how-to-use-wizard/wizard-7-semantic-layer) · last updated 2026-09-08 · vendor guide · read in full · search
1. **What it is about:** How to get dbt Wizard, dbt's coding agent, to write a semantic model. It checks the dbt version first. It reads the model's grain (what one row stands for), its columns and its lineage, then proposes entities, dimensions and metrics before editing anything. It writes the new spec on dbt 1.12 or later and the old one on 1.6 to 1.11.
2. **Why you're seeing it:** It shows how a dbt agent builds the layer (`semantic-models`, `warehouse-agentic`).
3. **Seen before?** Breadth angle 4 read the agent skill behind this. This is the user guide, with example prompts.
4. **Relates to:** A gap in the migration guide: Copilot, dbt's older assistant, cannot write the new spec, but Wizard can.
5. **Takeaways for you:** Its review checklist still works if you write the YAML yourself: "A numeric column isn't automatically a useful metric, and an ID isn't automatically the correct primary entity."

**Not found:** No community tutorial dated inside the window teaches the new spec. The `dbt-autofix` README mentions `--semantic-layer` only in a pre-commit example, and its rewrite code for the semantic layer last changed in March.

**Leads:**
- **L-1a** - Reading old tutorials in translation. Read the `dbt-autofix` semantic-layer changeset and its tests, the semantic model and metric property references, jaffle-shop's April "Adding back semantic models" commit next to `jaffle-sl-template`, and the `type_params` deprecation notes. Build a key-by-key map from the old format to the new one, including where defaults such as `fill_nulls_with` and `join_to_timespine` changed, so that the old guide and outside explainers stay usable.
- **L-1b** - Choosing the shape of a first semantic model. Read the best-practice guide's semantic structure and terminology pages, the refactoring page, the `derived_semantics` and `primary_entity` references, the Wizard guide's validation checklist, and Adrienne Vermorel's MetricFlow notes. Look at how grain, primary entities and normalized versus pre-joined tables are chosen, and how event and user tables of the kind product analytics runs on become semantic models.

**So what:** dbt's own tutorial, sample project, open-source release and agent all use the new spec, while its best-practice guide and outside explainers still show measures - so take syntax from the quickstart and jaffle-shop, and design advice from the old guide. A first semantic model is small: the grain and primary entity, the foreign keys, one default time dimension and a few simple metrics. The hard part is deciding what each metric means, which is already your job.

## Level 2a - Reading old tutorials in translation

### Lightdash adds dbt Core 1.12, so the new spec compiles there
[link](https://github.com/lightdash/lightdash/pull/25313) · merged 2026-07-08 (request closed [2026-08-20](https://github.com/lightdash/lightdash/issues/22812)) · open-source pull request and issue · read in full · search
1. **What it is about:** Lightdash is an open-source BI tool that reads a dbt project's files directly. In May a user reported that projects written in the new spec would not compile there. Support for dbt 1.12 shipped in July.
2. **Why you're seeing it:** Old and new YAML live side by side in tools, not only in tutorials (`semantic-models`, `dbt-context`).
3. **Seen before?** No. Breadth angle 3 covered dbt's own connectors, not tools that read the project files.
4. **Relates to:** Any tool that reads dbt's files has to learn the new keys before a team can switch.
5. **Takeaways for you:** The suggested workaround was to keep the old `type_params` wrapper. So some 2026 projects stayed on the old format on purpose, and old YAML is not always a sign of a stale tutorial.

### dbt's own agent skill got the translation wrong, then fixed it
[link](https://github.com/dbt-labs/dbt-agent-skills/pull/138) · merged 2026-07-15 · open-source pull request and agent instructions · read in full · listed source
1. **What it is about:** A fix to the example in dbt's skill for coding agents that build semantic models. The example had put `agg_time_dimension` in the wrong place, still used measures, wrote `agg: avg` instead of `average`, and left out `enabled`. The skill's [new-spec reference](https://github.com/dbt-labs/dbt-agent-skills/blob/main/skills/dbt/skills/building-dbt-semantic-layer/references/latest-spec.md) now states these as rules.
2. **Why you're seeing it:** These are the slips you are likely to make when translating by hand (`semantic-models`, `warehouse-agentic`).
3. **Seen before?** Breadth angle 4 read this skill. This is the change behind its July date.
4. **Relates to:** The skill's test for which spec a file uses. A top-level `semantic_models:` key means old; a `semantic_model:` block on a model means new.
5. **Takeaways for you:** Do not mix the two in one project. The skill says staying on the old spec on 1.12 "is fine".

### The old reference pages are still live, with a banner
[link](https://docs.getdbt.com/docs/build/measures) · last updated 2026-09-10 · vendor doc · read in full · listed source
1. **What it is about:** dbt's reference page for measures, the old building block. A banner says measures "have been deprecated in favor of simple metrics" and says to convert each one. The table below still defines every old key, such as `agg_params` and `create_metric`.
2. **Why you're seeing it:** It is the dictionary for old tutorials (`semantic-models`).
3. **Seen before?** Level 1 found the old best-practice guide. This is the old reference behind it.
4. **Relates to:** The [v1.12 upgrade page](https://docs.getdbt.com/docs/dbt-versions/dbt-upgrade/upgrading-to-v1.12), updated the same day, sums up the change in four bullets and says `type_params` "is deprecated". Neither page gives an end date for the old format.
5. **Takeaways for you:** Look up an unfamiliar key here, then use the table below. `create_metric: true` meant "also make this measure a metric". The new spec has no such step, because every measure is now a metric.

### Fill nulls with and join to timespine, in the new spec
[link](https://docs.getdbt.com/docs/build/fill-nulls-advanced) · last updated 2026-07-20 · vendor doc · read in full · listed source
1. **What it is about:** How to make a metric show 0 instead of blank, with a row for every day. `fill_nulls_with` replaces nulls. `join_to_timespine` adds the missing dates from the time spine, a table with one row per date. Days with no data need both, and derived and ratio metrics can still come back null.
2. **Why you're seeing it:** These two keys moved the furthest in the translation (`semantic-models`).
3. **Seen before?** Breadth angle 2 named both options. This page shows where they sit now.
4. **Relates to:** In old YAML they sat inside `type_params: measure:`, as in [`jaffle-sl-template`](https://github.com/dbt-labs/jaffle-sl-template/blob/main/models/marts/customer360/orders.yml)'s example. Now they are plain keys on the metric.
5. **Takeaways for you:** Only their place changed, not their defaults. **Background:** January fixes to `dbt-autofix` ([#280](https://github.com/dbt-labs/dbt-autofix/pull/280), [#282](https://github.com/dbt-labs/dbt-autofix/pull/282)) keep an explicit `false` and a `0` through the rewrite.

**Old to new, key by key.** Built from the [migration guide](https://docs.getdbt.com/docs/build/latest-metrics-spec) (updated 2026-09-08). **Background:** the table also draws on the [`dbt-autofix` rewrite code](https://github.com/dbt-labs/dbt-autofix/blob/main/src/dbt_autofix/refactors/changesets/dbt_schema_yml_semantic_layer.py) (last changed March) and the [semantic model reference](https://docs.getdbt.com/reference/semantic-model-properties) (updated March). Tutorials written before dbt 1.6 (mid-2023) use an even older spec, `dbt_metrics`, that [changed "significantly"](https://docs.getdbt.com/docs/dbt-versions/dbt-upgrade/Older%20versions/upgrading-to-v1.6) when MetricFlow arrived. They do not map key by key.

| Old (legacy spec) | New (latest spec) |
|---|---|
| Top-level `semantic_models:` entry with `model: ref('orders')` | `semantic_model: enabled: true` (or `semantic_model: true`) on the `orders` model's own entry |
| `defaults: agg_time_dimension:` | `agg_time_dimension:` at model level. The reference puts it outside `semantic_model:`, though the migration guide's example puts it inside |
| `entities:` list, with `expr: customer_id` | `entity: {type, name}` on the `customer_id` column |
| Time dimension with `type_params: time_granularity: day` | `granularity: day` on the column, plus `dimension: type: time` |
| A dimension or entity whose `expr` is SQL, such as a cast | `derived_semantics:` with a required `expr` |
| `measures:` plus a simple metric with `type_params: measure:` | One `type: simple` metric with `agg` and `expr`, under the model's `metrics:` |
| `agg_params` (percentile); `non_additive_dimension` with `window_choice` and `window_groupings` | `percentile` and `percentile_type`; `window_agg` and `group_by` |
| `fill_nulls_with` and `join_to_timespine` inside `type_params: measure:` | Plain keys on the metric |
| Derived `type_params: metrics:`; cumulative `measure:` with `cumulative_type_params:` | `input_metrics:`; `input_metric:` with `window` and `grain_to_date` as plain keys |
| Conversion `base_measure` and `conversion_measure`; metric `tags` | `base_metric` and `conversion_metric`; `config.tags` |

**Not found:** No community migration write-up dated inside the window; the translation above rests on dbt's own pages and code.

**Leads:**
- **L-2a-i** - Worked translations of a whole project. Read `dbt-autofix`'s paired test projects (`tests/integration_tests/dbt_projects/project_semantic_layer` and `project_semantic_layer_expected`) file by file, with the `.stdout` log of what was rewritten. Put them next to `jaffle-sl-template`'s `customer360` YAML and jaffle-shop's April "Adding back semantic models" commit. Look closely at the cases that are not one-to-one: hidden simple metrics created for cumulative and conversion inputs, a column that was both a measure and a dimension, and filters written as `{{ Dimension('entity__dim') }}`.
- **L-2a-ii** - Which tools downstream of dbt read the new spec yet. Read how the tools and packages that consume dbt's project files or `semantic_manifest.json` handle the new keys: Lightdash after PR #25313, Hex's Semantic Model Sync, Snowflake Labs' `dbt_semantic_view` package, the Ossie converter in MetricFlow, and dbt packages that ship metrics (the migration guide warns autofix skips `dbt_packages/`). For each, note whether it accepts the new spec, needs `type_params`, or reads the compiled manifest, where both formats look the same.

**So what:** Old tutorials are still usable, because the concepts did not change - only where things are written. Three rules cover most of the translation: every measure becomes a simple metric, everything under `type_params` moves up a level, and everything under `semantic_models:` moves onto the model's columns. The old format still parses on dbt 1.12 and some tools asked users to keep it, so write the new YAML but expect to read the old for a while.

## Level 2b - Choosing the shape of a first semantic model

**Background:** dbt's "Tactical terminology" page (last updated 2025-04-16) gives this level its phrase: dbt builds "clean, normalized marts", and "the Semantic Layer is a denormalization engine" that joins them into whatever shape a query asks for ([link](https://docs.getdbt.com/best-practices/how-we-build-our-metrics/semantic-layer-6-terminology), read in full). A mart is a finished table built for use. It counts as normalized when each fact is stored once. Adrienne Vermorel's [event-grain note](https://adriennevermorel.com/notes/event-grain-sessionization/) (March 2026) argues for keeping events at one row per event and adding session context as columns, rather than building a table with one row per session.

### dbt's structure guide: the advice flips if you use the Semantic Layer
[link](https://docs.getdbt.com/best-practices/how-we-structure/4-marts) · last updated 2026-07-07 · vendor guide · read in full · listed source
1. **What it is about:** dbt's page on marts. Its default is "wide and denormalized": one table holds everything about one entity, such as orders with user data joined on. A callout reverses this: "if you're using the Semantic Layer, we want to stay as normalized as possible to allow MetricFlow the most flexibility."
2. **Why you're seeing it:** It is the first choice you make about a semantic model's shape (`semantic-models`, `dbt-context`).
3. **Seen before?** Level 1's refactoring page said to prefer normalized tables. This page shows that dbt's general advice says the opposite.
4. **Relates to:** Your own experience of wide analysis tables, which are this page's default.
5. **Takeaways for you:** Grain stays the same in both styles: "individual orders remain the core grain." What changes is whether you join other tables on in advance or leave MetricFlow to do it.

### Entities, `primary_entity` and `derived_semantics`
[link](https://docs.getdbt.com/docs/build/entities) · last updated 2026-07-20 (semantic models page [2026-09-08](https://docs.getdbt.com/docs/build/semantic-models)) · vendor reference · read in full · listed source
1. **What it is about:** An entity is a join key, and there are four kinds. A primary entity has one row for each thing and covers every one of them. A unique entity also has one row per thing but may cover only some. A foreign entity may repeat. A natural entity is a real-world key, used only for slowly changing dimensions. With no key column, set a top-level `primary_entity` or build one in `derived_semantics`.
2. **Why you're seeing it:** These are the settings that fix a model's grain (`semantic-models`).
3. **Seen before?** Level 1's Wizard checklist warned that "an ID isn't automatically the correct primary entity." This page has the rules behind that warning.
4. **Relates to:** The [dimensions page](https://docs.getdbt.com/docs/build/dimensions) (2026-09-08): every dimension belongs to its model's primary entity.
5. **Takeaways for you:** A users table gets `user` as its primary entity. An events table uses its event ID, or a built key, and marks `user` as foreign. That mapping is an inference from these pages.

### Joins: which table shapes MetricFlow will connect
[link](https://docs.getdbt.com/docs/build/join-logic) · last updated 2026-09-08 · vendor reference · read in full · listed source
1. **What it is about:** A grid of which entity types MetricFlow will join. Foreign-to-primary works. Primary-to-foreign and foreign-to-foreign are blocked, because they would cause a fan-out: one row matching many, which multiplies totals. A query can reach at most three tables, which means two hops.
2. **Why you're seeing it:** The join rules decide which tables you split apart (`semantic-models`).
3. **Seen before?** No. Earlier briefs described the joins only as automatic.
4. **Relates to:** Omni's [vendor guide](https://omni.co/articles/best-semantic-layer-for-ai-and-bi-2026) (2026-09-02), which has a step called "define grain and join rules". Its authors rank their own product first.
5. **Takeaways for you:** Event metrics can be broken down by user attributes. A metric on the users table cannot be broken down by event columns. That is an inference from the grid. Keep chains of related tables short, such as events to users to country.

### Databricks metric views: joins, including one-to-many
[link](https://docs.databricks.com/aws/en/uc-semantics/metric-views/joins) · last updated 2026-09-11 · vendor doc · read in full · listed source
1. **What it is about:** How Databricks' semantic layer joins tables. Its source is a fact table (one row per measured event), and it left-joins dimension tables (descriptive attributes). Joins default to many-to-one. A newer one-to-many option lets one view measure "events per account" while the source stays the "dimensional spine", listing each entity once.
2. **Why you're seeing it:** It shows another layer's answer to the same shape question (`semantic-models`, `warehouse-agentic`).
3. **Seen before?** The breadth pass read Colrows' outside explainer on metric views. This is Databricks' own page.
4. **Relates to:** MetricFlow's grid above, which blocks that kind of join outright.
5. **Takeaways for you:** On one-to-many joins, it tells you to use `count(distinct ...)` so you do not count rows twice. That is the fan-out problem you would handle by hand in SQL.

### Kimball Star Schema: Dimensional Modeling Explained
[link](https://datadef.io/guides/en/dimensional-modeling) · 2026-08-21 (search index date; the page shows none) · tool-vendor guide · read in full · search
1. **What it is about:** A primer on Kimball's method, the classic way to design analysis tables. You pick one business process and declare the grain in a sentence before listing any columns. Then you add dimensions and facts. It names three kinds of fact table: one row per event, one row per period (snapshots), and one row per process that is updated as it moves through milestones.
2. **Why you're seeing it:** It covers the modelling that the dbt pages take for granted (`semantic-models`).
3. **Seen before?** No. Kimball has not been explained in an earlier brief.
4. **Relates to:** Events, daily-active snapshots and funnels, which are your three kinds of fact table.
5. **Takeaways for you:** "Atoms cannot be recovered from aggregates." Keep the star schema (a fact table ringed by dimension tables) as the model of record. Build wide tables downstream from it.

**Not found:** In the window, no practitioner post shows a product events table becoming a semantic model. Nor did any practitioner compare star schemas with one big table for semantic layers; only vendor listicles came up. Snowflake's modelling page for semantic views says "a simple star schema ... is a good starting point" but shows no date.

**Leads:**
- **L-2b-i** - Product event data as semantic models. Look at how an events table with no clean key gets a primary entity (top-level `primary_entity`, a key built in `derived_semantics`). Compare event grain with session or user grain. Read dbt's SCD type II `validity_params` for "the user's plan at the time of the event", Databricks' one-to-many "events per account", the activity-schema pattern (ssp.sh), and Vermorel's GA4 and event-grain notes as Background.
- **L-2b-ii** - Running normalized marts for the layer next to wide marts for dashboards. Read dbt's structure guide callout, the refactoring page, and saved queries and exports as a way to rebuild wide tables from governed metrics. Add Kimball's "star as model of record, wide tables downstream", Snowflake's star-schema advice, and write-ups of teams keeping both kinds in one dbt project.

**So what:** The shape of a first semantic model is Kimball's grain question with stricter joins: declare what one row is, give it one primary entity, and keep tables normalized so MetricFlow can join them, even though dbt's default for marts is wide. For you that means users and events as separate models joined on `user`. Because dbt blocks the one-to-many join Databricks allows, "events per user" is asked from the events side.

## Where this path ends

Writing a semantic model is now small in syntax and large in judgment. The new spec - the semantic model on the model's own YAML entry, entities and dimensions on its columns, every measure a simple metric - is what dbt's tutorial, sample project, open-source dbt 1.12 and Wizard agent all write. Most guides online, dbt's own best-practice guide included, still show the old format, and three moves translate them. Underneath the syntax is Kimball's question: declare the grain, give each table one primary entity, and keep tables normalized so MetricFlow can join them under its stricter rules (foreign-to-primary only, two hops at most). For a product data scientist that means users and events as separate models joined on `user`, with funnels written as conversion metrics. Tools downstream of dbt are still catching up to the new keys, so old YAML will stay in circulation for a while. The gap to watch: nobody in the window has written up a product events table built out as a semantic model.
