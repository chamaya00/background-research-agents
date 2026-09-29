# Path 1 - dbt's agents, from a learner's side

This path starts from breadth angle 2, "dbt - what shipped for agents and for
engineers". It reads dbt's own docs, its open repositories and its dbt Summit
tutorial to show what each of dbt's agent pieces does inside a dbt project:
Wizard, the Studio IDE agent, the Analyst agent, and the skills that teach them.

## Level 1 - dbt's agent surface

### Overview of dbt Wizard
[link](https://docs.getdbt.com/docs/platform/wizard-overview) · last updated 2026-09-16 · vendor doc · read in full

1. **What it is about:** dbt Wizard is dbt's AI agent for building and changing dbt projects. It runs in four places. Two are in the dbt platform, dbt Labs' hosted service: the Studio IDE (a browser editor) and a Wizard home tab, both in public preview. The other two run on your own machine: a terminal CLI (public beta) and a Desktop app (private beta). Explore mode lets read-only users "ask questions about production data in plain language".
2. **Why you're seeing it:** It maps dbt's own agent (`warehouse-agentic`, `dbt-context`).
3. **Seen before?** Yes. #42 item 5 listed Explore mode and Desktop at launch, and breadth angle 2 listed them in the Summit release.
4. **Relates to:** The companion [How dbt Wizard works](https://docs.getdbt.com/docs/dbt-ai/wizard-how-it-works) page, same date.
5. **Takeaways for you:** Wizard builds an index of the project from dbt's build files, covering lineage, tests and run results, before you type anything. It then checks its work at a "light", "medium" or "heavy" depth. The docs add: "A passing check doesn't remove the need to review business logic."

### dbt Wizard in Studio IDE (the Developer agent)
[link](https://docs.getdbt.com/docs/dbt-ai/developer-agent) · last updated 2026-09-16 · vendor doc · read in full

1. **What it is about:** This page is at the address dbt first used for its "Developer agent", which now goes by Wizard. It covers the agent inside the browser editor. It builds and refactors models, writes YAML for tests, docs and metrics, and "shows file diffs before changes are persisted".
2. **Why you're seeing it:** It is the engineer-facing agent (`warehouse-agentic`).
3. **Seen before?** Breadth angle 2's release notes named the Developer Agent in beta. This is its manual.
4. **Relates to:** Snowflake's CoCo post in breadth angle 3, which sets the same rule: the agent proposes, a person approves.
5. **Takeaways for you:** There are three modes. "Explore only" can query but not edit. "Ask for approval" (the default) needs your yes on every file. "Edit files automatically" skips that. The agent also asks before running `dbt build`. The steps end with "commit the changes... and open a pull request", so review stays your job.

### dbt Copilot in Insights (the Analyst agent)
[link](https://docs.getdbt.com/docs/dbt-ai/analyst-agent) · last updated 2026-07-23 · vendor doc · read in full

1. **What it is about:** Insights is dbt's query console. Its agent answers plain-language questions by querying "governed dbt models and metrics" through the dbt Semantic Layer, dbt's store of metric definitions. It shows the SQL it ran and returns "references, assumptions, and possible next steps". It is in beta, for Enterprise plans.
2. **Why you're seeing it:** It is the agent closest to your current job, asking questions of data (`dbt-context`, `semantic-models`).
3. **Seen before?** Partly. #35 read dbt's benchmark that compared Semantic Layer answers with raw text-to-SQL. This agent is built on the Semantic Layer side of that comparison.
4. **Relates to:** Wizard's Explore mode above, which does the same job for read-only users.
5. **Takeaways for you:** The page itself says "dbt Wizard is the recommended agent for dbt work". Expect the question-answering features to consolidate under Wizard.

### dbt-agent-skills (GitHub repository)
[link](https://github.com/dbt-labs/dbt-agent-skills) · opened 2026-02-05 (background); last commit 2026-09-23 · open-source repository · read in full (README, one skill, evals README)

1. **What it is about:** A skill is a folder containing a `SKILL.md` file of instructions, which an agent loads when a request matches its description. dbt publishes skills for model building, unit tests, documentation, the Semantic Layer, job debugging, and migrating to v2. They install into Claude Code, Cursor and similar tools, and ship inside Wizard.
2. **Why you're seeing it:** It is how dbt teaches agents its practices (`dbt-context`, `warehouse-agentic`).
3. **Seen before?** Breadth angle 3 found Snowflake and Databricks converging on skills too.
4. **Relates to:** Its `evals/` folder runs each task "without skills, with skills alone, or with skills plus an MCP server". That is the with-and-without comparison `agent-efficacy` cares about.
5. **Takeaways for you:** The core skill works as a checklist for doing dbt well: use `ref()`, preview with `dbt show`, check what depends on a model before editing it, and avoid "one-shotting models". The core skill is worth reading for its own sake.

### Accelerating Analytics with AI (dbt Summit 2026 hands-on lab)
[link](https://github.com/dbt-labs/Summit-26-Accelerating-analytics-with-AI) · 2026-09-11 to 2026-09-17 · tutorial repository (dbt Labs) · read in full (README, exercises 1 and 3, example skill)

1. **What it is about:** The Summit's four-exercise lab, built on a sample shop project. You ask Wizard in business terms for a daily revenue model per location, review what it built, then write your team's rules down so it follows them next time.
2. **Why you're seeing it:** It is the most direct way to learn the dbt agent workflow by doing it (`warehouse-agentic`, `dbt-context`).
3. **Seen before?** New to you. Breadth angle 3's CoCo post gave the same advice in prose.
4. **Relates to:** dbt's [skills page](https://docs.getdbt.com/docs/dbt-ai/wizard-platform-skills). The [package skills page](https://docs.getdbt.com/docs/dbt-ai/package-skills) (2026-09-17) adds that `dbt deps` can install skills from a dbt package.
5. **Takeaways for you:** Exercise 3 is the new skill in one page. Always-on rules go in `AGENTS.md`. Task rules go in a skill whose `description` decides when it fires. The example skill begins: "State explicitly what one row represents."

**Leads:**
1. L1-1a - Writing context for dbt's agents: `AGENTS.md`, custom skills in `.agents/skills/`, skills shipped inside dbt packages and installed by `dbt deps`, and the open `dbt-agent-skills` catalogue with its eval harness. Read through dbt's skills and migration docs, the Summit 2026 lab's exercises and expected outputs, the skills' own `SKILL.md` files, and practitioner write-ups, for what a good skill contains and what makes one load.
2. L1-1b - Reviewing work that dbt Wizard wrote: its project index, its light, medium and heavy validation depths, deferral to production and dbt State, and its approval modes. Read through dbt's Wizard docs, dbt's developer-blog posts from people using it (for example "No babysitting, not today", 2026-06-30), and the CLI and Desktop guides, for what a person still checks and how.

## Level 2 - Writing context for dbt's agents

Two kinds of file do this job. `AGENTS.md` is one Markdown file of standing rules, and the agent reads it in every session. A skill is a folder with a `SKILL.md` file, which the agent loads only when the skill's `description` matches the task. Both formats are open conventions shared across tools, not dbt inventions. dbt's own guidance on writing them predates the window: its [skills launch post](https://docs.getdbt.com/blog/dbt-agent-skills) (2026-02-05), Tristan Handy's ["Agent Skills: Disseminating Expertise"](https://roundup.getdbt.com/p/agent-skills-disseminating-expertise) (2026-03-30) and ["Ship smarter agents"](https://www.getdbt.com/blog/ship-smarter-agents-in-production-with-dbt-agent-skills) (2026-05-18), which gives "skill golf" (cutting a skill down until nothing distracts) (all background).

### Installing Agent Skills from dbt packages
[link](https://docs.getdbt.com/docs/dbt-ai/package-skills) · last updated 2026-09-17 · vendor doc (listed source) · read in full

1. **What it is about:** A dbt package (a reusable dbt project you pull in as a dependency) can now ship skills. `dbt deps` copies them into the folder your agent reads, which is `.claude/skills` for Claude and `.agents/skills` for Wizard, Cursor, Codex and Gemini. It only does this once `ai_provider` is set in `dbt_project.yml`.
2. **Why you're seeing it:** It covers how dbt context reaches an agent (`dbt-context`, `warehouse-agentic`).
3. **Seen before?** Level 1's Summit item linked this page without reading it.
4. **Relates to:** [Unity Catalog Skills](https://docs.databricks.com/aws/en/agents/uc-skills/) (updated 2026-09-16, beta). Databricks stores the skill as a catalog object with table-style permissions. This is breadth angle 4's release-note item.
5. **Takeaways for you:** The team gets "the same skills from a versioned dependency". dbt overwrites only the copies it installed and leaves hand-written skills alone.

### Migrate to dbt Wizard
[link](https://docs.getdbt.com/docs/dbt-ai/wizard-migrate) · last updated 2026-09-16 · vendor doc (listed source) · read in full

1. **What it is about:** This is how a Claude Code user moves to Wizard. Wizard reads instruction files in a fixed order: `AGENTS.override.md`, then `AGENTS.md`, then `CLAUDE.md` as a fallback. It also picks up `.claude/skills/` without any conversion.
2. **Why you're seeing it:** It sets out where an agent's standing context lives in a dbt project (`dbt-context`).
3. **Seen before?** Level 1's Wizard overview said Wizard indexes the project. This page covers the context that you write yourself.
4. **Relates to:** [Genie Code](https://www.databricks.com/blog/personalizing-genie-code-instructions-skills-memory-and-mcp) (2026-06-01, background) also reads `AGENTS.md` and `CLAUDE.md` from a repository, so these files carry between vendors.
5. **Takeaways for you:** Wizard "walks the directory tree" and combines the instruction files it finds at each level. "Write a specific `description:`", because that is how Wizard decides to load a skill. Start a new session after you edit one.

### Summit lab: expected outputs for exercises 3 and 4
[link](https://github.com/dbt-labs/Summit-26-Accelerating-analytics-with-AI/tree/main/exercises/expectations) · committed 2026-08-18 to 2026-09-11 · tutorial repository (dbt Labs) · read in full (exercise 4, expectations for exercise 3, example `AGENTS.md`)

1. **What it is about:** The lab's answer sheets. `AGENTS.md` should be "a handful of short, thematic sections". The skill should be shorter, "an ordered, numbered process" for building one mart (a finished, business-facing table).
2. **Why you're seeing it:** It is dbt's worked answer to what a good context file contains (`dbt-context`).
3. **Seen before?** Level 1 read exercises 1 and 3 and the example skill. These answer sheets are new.
4. **Relates to:** Exercise 4 deletes the model and asks the same question again in a fresh session. It is a small version of the with-and-without-skills comparison in `dbt-agent-skills`.
5. **Takeaways for you:** The test for where a rule goes: "would this rule matter on a staging model too?" If yes, it goes in `AGENTS.md`. The skill should point back to `AGENTS.md` rather than repeat it.

### maintaining-dbt-documentation (a dbt Labs skill)
[link](https://github.com/dbt-labs/dbt-agent-skills/blob/main/skills/dbt/skills/maintaining-dbt-documentation/SKILL.md) · added 2026-08-19 · open-source repository (listed source, via raw file) · read in full

1. **What it is about:** A recent skill that finds models with missing descriptions, drafts them in the project's own style one folder at a time, and hands the change to a person. Its `description` lists the exact requests it should fire on.
2. **Why you're seeing it:** It is a full example of dbt's own skill-writing (`dbt-context`, `warehouse-agentic`).
3. **Seen before?** Level 1 read the core skill. This one was added in the window.
4. **Relates to:** The migration skill, [amended on 2026-09-23](https://github.com/dbt-labs/dbt-agent-skills/pull/164) with "real-world migration feedback". Skills are revised as people use them.
5. **Takeaways for you:** The skill has six steps, stop conditions, and a table of common mistakes. "A wrong description is worse than a missing one." It also says: "Never commit or push" without being asked.

### Standardize project context with AGENTS.md and Agent Skills
[link](https://developers.redhat.com/articles/2026/07/27/standardize-project-context-agentsmd-and-agent-skills) · 2026-07-27 · vendor developer blog (Red Hat, from search) · read in full

1. **What it is about:** A general explanation of both conventions, written from outside data work. `AGENTS.md` is "a README for coding agents". Skills use "progressive disclosure": the agent reads only a skill's name and description until it needs the rest.
2. **Why you're seeing it:** It explains the formats dbt uses, from another vendor's side (`dbt-context`).
3. **Seen before?** New to you. Breadth angle 3's CoCo post gave Snowflake's version of the same split.
4. **Relates to:** The Summit answer sheets above, which draw the same line between always-on rules and task-specific ones.
5. **Takeaways for you:** Keep `AGENTS.md` under 150 lines. Test each line by asking, "Would removing this cause the agent to make a mistake it wouldn't otherwise make?"

**Searched for and not found:** a write-up in the window by someone outside a vendor on writing skills for a dbt project. The one candidate was on Medium, which refuses fetches.

**Leads:**
1. L1-2a - How dbt teams share, version and govern agent context: package skills installed by `dbt deps` (the `ai_provider` flag, `skill-paths`, disabling skills, the metadata dbt writes into each installed copy), Wizard's order for `AGENTS.md` and skill folders, set beside Databricks Unity Catalog Skills and Snowflake CoCo's stage and Skills Catalog publishing. Read in each vendor's docs, the release notes from June to September 2026 and packages that already ship skills, for how one team's conventions reach every agent and every person.
2. L1-2b - How dbt Labs writes, revises and tests its own skills: the `SKILL.md` files and change history of `dbt-agent-skills` from June to September 2026 (`using-dbt-state`, `maintaining-dbt-documentation`, `migrating-dbt-core-to-v2` and its real-migration amendments, the troubleshooting skill), their `references/` folders, the repository's CI validation (#161) and its eval scenarios (`skill-eval`, runs with and without skills). Read for how a skill's structure and wording change after people use it.

## Level 3 - Sharing one team's context with every agent

### Use skills with dbt Wizard CLI
[link](https://docs.getdbt.com/docs/dbt-ai/wizard-skills) · last updated 2026-09-17 · vendor doc (listed source) · read in full

1. **What it is about:** This page covers where Wizard's command-line version looks for skills, and which copy wins when two share a name. First comes the project's `.agents/skills/`, with the nearest folder winning. Then your personal `~/.agents/skills/`, then `.claude/skills` (kept for compatibility), and last dbt's built-in skills.
2. **Why you're seeing it:** It sets out whose conventions an agent follows when several apply (`dbt-context`, `warehouse-agentic`).
3. **Seen before?** Level 2's migration page gave the same kind of order for `AGENTS.md`. This page gives it for skills.
4. **Relates to:** The [platform version](https://docs.getdbt.com/docs/dbt-ai/wizard-platform-skills) of this page (2026-09-16), which still says "Cross-project sharing isn't supported yet" and tells you to copy the files by hand.
5. **Takeaways for you:** Team rules beat personal ones, and personal ones beat dbt's defaults. To share skills across projects, "Ship them in a dbt package (v2)".

### Install skills from packages via `dbt deps` (dbt pull request #15840)
[link](https://github.com/dbt-labs/dbt/pull/15840) · opened 2026-08-06, merged 2026-09-09 · open-source repository (listed source) · read in full (description and review thread)

1. **What it is about:** This is the code change behind Level 2's package-skills page, with the review around it. It adds the `ai_provider` flag and `skill-paths`, which say where a package keeps its skills. It also adds a `skills:` setting in `dbt_project.yml` that switches off skills inherited from packages.
2. **Why you're seeing it:** It shows how dbt decided a team's context should travel (`dbt-context`).
3. **Seen before?** Level 2 read the finished docs. This is the argument behind them.
4. **Relates to:** [Discussion #12521](https://github.com/dbt-labs/dbt/discussions/12521) (February, background), where users asked for skills to stay "in the repo, not in user-level configs". Three follow-up pull requests, opened 2026-09-03 and still open, would record where each installed skill came from.
5. **Takeaways for you:** A reviewer objected: "I don't believe we should silently install files meant to alter execution of third party applications." The merged version was cut back, and tracking which copies dbt owns was deferred to a second phase.

### Create, share, discover and use Unity Gateway Skills (Databricks)
[link](https://docs.databricks.com/aws/en/agents/uc-skills/create-share-uc-skills) · last updated 2026-09-21 · vendor doc (listed source) · read in full, with the [discover and use](https://docs.databricks.com/aws/en/agents/uc-skills/use-uc-skills) tutorial of the same date

1. **What it is about:** These are Databricks' two tutorials on team skills. You write a skill folder locally, and your coding agent publishes it into Unity Catalog, where Databricks keeps tables and their permissions. You share it by granting read access, the same way you would for a table.
2. **Why you're seeing it:** It is Databricks' answer to the question dbt answers with packages (`warehouse-agentic`, `dbt-context`).
3. **Seen before?** Level 2 linked the overview page, and breadth angle 4 had the August beta. These are the how-to pages, now under a "Unity Gateway" name.
4. **Relates to:** Genie Code's own [skills folders](https://docs.databricks.com/aws/en/genie-code/skills) (2026-09-11): one workspace folder for everyone and one personal folder.
5. **Takeaways for you:** "Sharing a skill is a grant, not a copy." A teammate's agent (Claude, Codex, Gemini, Copilot) can load the skill for one session, download it, or read the live version.

### Share skills and plugins (Snowflake CoCo)
[link](https://docs.snowflake.com/en/user-guide/cortex-code/cortex-code-skill-plugin-sharing) · public preview 2026-07-24 (the date is from the release note's title; this page is undated) · vendor doc (listed source) · read in full

1. **What it is about:** This page covers how a CoCo user turns a local skill into a shared Snowflake object with numbered versions, called a "Cortex Extension". Roles control who can use it, and a separate setting decides whether it shows in the catalog. In Snowsight, Snowflake's web interface, admins certify versions and see 28 days of install and usage counts.
2. **Why you're seeing it:** It is Snowflake's way of spreading one team's conventions (`warehouse-agentic`).
3. **Seen before?** Breadth angle 3's CoCo post said to write skills. This page is how they spread.
4. **Relates to:** A [2026-08-26 release note](https://docs.snowflake.com/en/release-notes/2026/other/2026-08-26-agent-skills-cortex-extension-references-ga) (GA): Cortex Agents, Snowflake's question-answering agents, can now point to an extension, and "Updates to the extension flow to every agent that references it".
5. **Takeaways for you:** A link with no version gets "the latest certified version". Sharing works only inside one Snowflake account.

**Searched for and not found:** a published dbt package that already ships a `skills/` folder (`dbt-utils` and `dbt-project-evaluator` have none). Any entry about package skills in dbt's release notes from June to September. A write-up about sharing skills across a team that is not on Medium. The Snowflake community's walkthrough (2026-09-14) is on Medium, which refused it.

**Leads:**
1. L1-3a - How dbt's package-skills design settles after its first release: the open follow-ups (#16190 `.provenance` file, #16191 `dbt-` folder prefix, #16192 skill metadata), the second-phase questions #15840 deferred (transitive installs, scripts inside skills, consent), discussion #12521's framework, convention and business layers of skills, and the first Hub packages to ship a `skills/` folder. Read on GitHub and in dbt's docs and release notes from October 2026, for what a package author and a package user each have to do.
2. L1-3b - Who reviews a shared skill before every agent loads it: Snowflake's certification, usage counts and Cortex Extension references in Cortex Agents, set beside Databricks' READ VOLUME grants, audit and live-loaded schemas, and dbt's per-skill disabling. Read in each vendor's docs, release notes and practitioner walkthroughs, for how a data team decides which conventions become the whole account's defaults.

## Where this path ends

Level 1 showed what dbt's agents are. Levels 2 and 3 show that what makes them useful is context that a person writes. That work looks the same at dbt, Snowflake and Databricks: an always-on `AGENTS.md`, task skills whose `description` decides when they load, and a way to share both that works like the rest of data engineering. dbt shares them as a versioned dependency, and Databricks and Snowflake as a catalog object you grant access to. So what a data scientist moving into the field should learn here is an ordinary data-engineering skill, not an AI one: writing conventions down, putting them under version control, and deciding who gets which ones. How far to trust shared context is still open, and the clearest place to watch that argument is dbt's own review of package skills.
