# AI Harness development plan

The goal is to help developers and AI agents taking over Ray Template find relevant code by task, reproduce checks independently, and pass observed results to the next maintainer. Entry points and commands are in the [AI Harness](README.md).

| Phase                     | Work                                                                                                                                                                                | Acceptance criteria                                                                                                                                            |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Consolidate context    | Rewrite root `AGENTS.md`; remove obsolete tool configuration and development guides. Keep architecture, comments, visual guidance, and toolchain records in their respective roles. | The README points to the new entry point; active documents do not reference old guides. TypeScript project information is reachable from the architecture map. |
| 2. Establish feedback     | Provide context and regressions for routing, UI, APIs, icons, shared utilities, and Harness. Reuse pnpm, Vitest, and build commands.                                                | Task areas can be queried, targeted checks run, and missing context or regression paths are rejected.                                                          |
| 3. Integrate verification | Add Harness validation to `pnpm check` and existing CI; provide local JSON reports and browser verification guidance.                                                               | Targeted and full runs are traceable; failures return nonzero exit codes; reports and screenshots are excluded from source and package inputs.                 |

Expand the Harness in response to repeated observed failures. Prefer filling coverage gaps in Vitest. Consider browser automation as a required gate only after its fixtures and results are stable and reproducible. Measured migration results are in the [toolchain record](../docs/toolchain-upgrade.md).

The design draws on [OpenAI's repository workflow practices](https://developers.openai.com/cookbook/examples/codex/iterating-development-workflows-with-codex) and [context-layering guidance](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra).

## Completing the monorepo index

Review baseline: `58fc0b63`. Existing commands, regressions, and reports already formed a feedback loop. The main gap was locating code and determining ownership:

| Finding                                                                                                                                               | Impact                                                                                                                                    |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| The architecture map mixed old `src/` paths with workspace paths and still assigned routing, icons, and component implementations to the application. | An existing directory does not imply ownership. Application schemas, cancellers, and some components are compatibility entry points.      |
| `ui` covered layout, shared components, copy, hooks, and demos, without separate entry points for TablePro, the documentation site, or builds.        | Table filtering and VitePress redirects required manual searches across broad directories for implementation, examples, and verification. |
| `llms.txt`, the architecture map, and `scopes.json` maintained separate source-path lists; validation covered only the JSON paths.                    | After a move, entry points and descriptions could contradict each other while full checks still passed.                                   |

### Design

1. Keep repository-wide collaboration rules and entry points in `AGENTS.md`. Use `llms.txt` as a task router that needs no runtime, linking to the [architecture map](../docs/architecture.md) and individual topics as needed.
2. Organize `harness/context/<scope>.md` around actual questions, listing first-read source, application/shared-package/example boundaries, and relevant tests. Keep behavior contracts in source, nearby READMEs, and public documentation. The architecture map covers workspaces, key runtime flows, and deployment.
3. Keep topic descriptions and executable verification configuration in `scopes.json`. Each ID resolves to a matching index displayed by `context <scope>`. Preserve the six existing IDs and their tests; add TablePro, layout, documentation, and toolchain scopes. Documentation and toolchain scopes use existing check scripts.
4. Validate index entry points, relative links, and test targets through the existing `harness check`, still invoked by `pnpm check` and CI. This checks navigation documents, not external links or prose correctness; verify semantics through walkthroughs and regressions.

### Design review before implementation

| Question                                                              | Decision                                                                                                                                                                                                        |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Should JSON and Markdown duplicate implementation paths?              | Use the matching index as CLI output and maintain prose once; do not generate a second source tree.                                                                                                             |
| Should every task start with a command and a full architecture read?  | Keep the static entry point and open the relevant topic. The architecture map supports cross-module tasks; it is not mandatory startup reading.                                                                 |
| Should every scope have Vitest tests?                                 | Use `docs:check` for documentation and package/type checks for the toolchain. State which cases still need a production preview or full checks.                                                                 |
| Can compatibility entry points be distinguished from implementations? | Walk through TablePro search, dynamic routes, request cancellation, preference import, legacy documentation redirects, and deployment artifacts. Name the primary implementation and host adapter in the index. |

Acceptance for that development batch: all topics are reachable from the static entry point; existing command and report contracts remain compatible; broken links, missing topics, and invalid regression paths fail validation; representative tasks reach the implementation and checks; finish with `pnpm harness verify`. For everyday tasks, follow the [README verification scope](README.md#choosing-the-verification-scope).

## 2026-11-06: Structure review and verification scope

Local review baseline: `969f764c`. The review covered root collaboration rules, 10 topic indexes and their registry, CLI/tests, architecture and documentation coordination, visual conventions, the PR template, Git hooks, CI, and local evidence directories. It was not a code review of every business implementation.

### Comparison with official guidance

| Official recommendation                                                                                                                                                               | Project assessment                                                                                                                                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Codex Best practices](https://learn.chatgpt.com/docs/learn/best-practices): concise repository guidance, task-specific context, clear completion criteria, and relevant checks       | The `AGENTS.md` → `llms.txt` → topic index → source/contracts/tests hierarchy is sound. Consult the architecture map and historical records as needed; the directory structure does not need rebuilding.           |
| [Iterating Development Workflows](https://developers.openai.com/cookbook/examples/codex/iterating-development-workflows-with-codex): example files are adaptable workflow conventions | Existing `plan.md`, toolchain records, and local reports respectively hold design, observed verification, and command evidence. Copying filenames such as `GOALS.md`, `PLANS.md`, and `PROMPTS.md` is unnecessary. |
| [Rethinking skills and prompts](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra): reduce irrelevant context and excessive testing instructions       | Requiring full checks after every implementation or integration, plus fixed page/documentation matrices, inflated the cost of small fixes. Select verification by impact instead.                                  |

These sources offer practices, not a uniform Harness certification or directory compliance standard. The existing structure follows the main design principles; verification granularity needed adjustment.

### Findings and changes

| Finding                                                                                                                                                    | Change                                                                                                                                                                                  |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Root guidance and delegation rules escalated every implementation to full checks.                                                                          | Default to relevant test files or scopes. Run full checks once for integration risk, releases, or explicit requests; rerun only affected checks afterward.                              |
| Visual guidance, the PR template, and documentation coordination turned page changes into a fixed list of languages, themes, viewports, and site features. | Point to the Harness condition table. Add dimensions based on the actual change, choose representative shared consumers, and skip browsers for rules or maintainer documentation alone. |
| Targeted `api` regressions omitted OpenAPI/worker synchronization; `icons` required a separate manual manifest check.                                      | Register existing `api:check` and `icons:check` in their scopes. Retain the CLI script allowlist and stop before regressions when generated artifacts are stale.                        |
| `verify ui` could be mistaken for browser verification.                                                                                                    | Clarify in the topic and CLI help that it runs registered commands only. Its JSON report does not establish browser acceptance.                                                         |

### Retained behavior and verification limits

- All 10 topics are reachable from the static entry point. Each of the 81 enumerated `.spec.ts/.spec.tsx` files belongs to at least one scope. Index validation establishes path existence and valid targets, not accurate prose or sufficient behavior coverage.
- `ui` covers 37 test files and is suitable for scope-level regressions. A single-behavior fix can run its test file directly and record the result in the delivery note. Reuse existing entry points without adding a second system to infer scope from Git diffs and dependencies.
- Preserve full checks when scope is omitted for command compatibility. Everyday guidance should show an explicit scope. Keep CI's three-platform `pnpm check` and deployment dependencies unchanged.
- Continue writing local reports to `.harness-local/`, excluded from Git, lint/format scans, and package inputs. Full-report phase details still depend on terminal output. Record browser evidence separately; static checks do not prove runtime success.
- Regressions cover targeted commands not appending full checks, stopping on generated-artifact check failure, and compatibility of explicit/legacy full-check entry points. Actual run results are in the [toolchain record](../docs/toolchain-upgrade.md). This change has no page effect and needs no UI/UX verification.
