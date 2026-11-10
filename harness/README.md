# Ray Template AI Harness

Start with [AGENTS.md](../AGENTS.md). Use the [task index](../llms.txt) to locate implementations and the [architecture map](../docs/architecture.md) for relationships across modules. Reading the indexes does not require installing dependencies.

## Starting a task

1. Check `git status`. Choose a task area from the static index or `pnpm harness context`; `pnpm harness context <scope>` shows its index and verification commands. For changes across areas, consult each affected scope.
2. When verification is needed, select the runtime from `.nvmrc` and `package.json#packageManager`. On initial setup, run `pnpm install --frozen-lockfile` and `pnpm env:check`.
3. Define observable acceptance criteria, decide whether subagents would help, and trace callers and data flow before implementation. For multi-step migrations or work continued across sessions, record scope, staged acceptance criteria, key decisions, and remaining work. See the [development plan](plan.md) as a reference.
4. Choose checks using the [verification scope](#choosing-the-verification-scope). Run relevant tests during development and confirm coverage at task completion. Run full checks only when a full-check condition applies. After checks pass, rerun only those affected by subsequent changes.

```sh
pnpm harness context table-pro
pnpm harness verify table-pro
```

## Using subagents when useful

- **Decide whether to delegate.** Use subagents when tasks have clear boundaries, results can be verified independently, and parallel investigation, implementation, or review is worth the coordination and integration cost. Handle simple tasks, dependent steps, or frequent edits to shared files directly. If the host does not provide subagents or the current task prohibits delegation, the lead agent continues the work.
- **Define ownership.** Specify the objective, relevant scopes, acceptance criteria, and read-only or writable boundaries. Assign each file to one writer during parallel implementation. Start with read-only investigation if boundaries are unclear. Delegation inherits user authorization and repository rules.
- **Review and integrate.** Subagents report findings, changes, actual verification, and unverified areas. The lead agent reviews the combined impact and completes integration checks. Delegation itself does not trigger full verification; select scope using the rules below.

## Engineering conventions

- Before adding a capability or component, inspect existing project components, hooks, and installed component-library APIs and examples. Determine whether existing props, slots, or layout CSS can meet the requirement. Reuse sufficient existing capabilities. Add a component only for an established capability gap, and record the gap and choice in an existing task record or delivery note. Do not create a component solely for full-height sizing, a scroll container, or a styling wrapper.
- Follow existing Vue 3 Composition API patterns: `defineComponent` with TSX and `<script setup lang="ts">` for SFCs. Prefer Naive UI and project components. Use ECharts for charts.
- `unplugin-auto-import` manages Vue, Router, and Pinia APIs. Use `import type` for types and update generated declarations through their generators.
- Preserve unique route names, permission metadata, caching, and translation keys. When permissions change, verify both menu visibility and direct navigation.
- Access stores through `apps/admin/src/store/hooks`. Persistence keys and serialization formats are existing data contracts; inspect historical data before changing them.
- Requests flow from `apps/admin/src/api` into `apps/admin/src/axios`. Mocks are for demos and local verification. Never place server secrets in `VITE_*` variables that are bundled into the browser.
- When maintaining public APIs, inspect callers, exports, and existing regression tests. For engineering configuration changes, update the corresponding documentation and [verification record](../docs/toolchain-upgrade.md).

### Runtime import boundaries

Across workspaces, prefer the narrowest existing public entry point declared in `package.json#exports`, such as `@ray-template/ui/icon` or `@ray-template/routing/navigation`. Within a workspace, import the owning module or a focused feature entry point.

Keep aggregate exports for cohesive APIs and existing compatibility. Use feature entry points in startup and shared code to keep unrelated styles, module initialization, and large dependencies outside those paths. Point dynamic imports at the specific feature entry point.

When changing a startup or lazy loading boundary, inspect the production dependency graph and the requests and bytes loaded by the affected page.

## Verification and evidence

### Choosing the verification scope

Determine impact from the actual diff, callers, and data contracts before selecting commands. Line count does not measure risk: one permission condition, persistence key, or public export can affect multiple modules. Selecting verification scope does not require a separate approval step.

| Change                                                                            | Local verification                                                                                                                                                                                                    |
| --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Maintainer documentation, wording, comments, or formatting with no runtime change | Check content and formatting of changed files. Run `pnpm harness check` when indexes, links, or Harness rules change. No browser is needed.                                                                           |
| A single function, hook, or small fix with existing regression coverage           | Run the relevant test file and add a regression case if needed. Lint changed code; add type checking when types or exports are affected.                                                                              |
| One task area or multiple affected callers                                        | Run `pnpm harness verify <scope>`. Select each affected scope for cross-area work, or run the relevant test files together. Add static checks appropriate to the change.                                              |
| Documentation structure, links, code examples, or theme                           | Run `pnpm harness verify docs` for types, links, and the build. Use focused browser checks only when rendering or interaction is affected; see the [documentation workflow](../docs/docs-handoff.md#update-workflow). |
| Integration risk, a release, or an explicit request for complete checks           | Run `pnpm harness verify all` once at task completion. Select browser coverage separately using the table below.                                                                                                      |

Full command checks are required for changes to dependencies or the lockfile, workspace boundaries or public exports, TypeScript/Vite/build/CI configuration, or full-check orchestration; for cross-module impact that cannot be reliably bounded; for release preparation; or when explicitly requested. A local shared-component implementation, page, style, or copy change does not escalate solely because of its directory. Follow any user-specified verification scope and report its coverage limits.

For example, a CSV escaping fix can use `pnpm test:run __test__/components/table-pro-exports.spec.ts` and checks on the modified files. A page spacing change calls for that page and the affected widths. A global theme variable change calls for light/dark checks on representative consumers. Once relevant checks pass, verification is complete for that iteration. Do not repeatedly expand scope without a new change, failure, or evidence gap.

`pnpm harness verify <scope>` runs only its registered commands; it does not automatically include ESLint, formatting, or every type check. For small fixes, run `pnpm exec eslint <changed-code-files> --max-warnings=0`, `pnpm exec prettier --check <changed-files>`, and relevant tests directly, then record commands and results in the delivery note. Existing scope suites are broad. A clearly isolated behavior does not need broader tests merely to obtain a JSON report.

| Command                       | Coverage                                                                                                                 |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `pnpm harness check`          | Registered and reachable topics; valid relative links, regression paths, and check commands                              |
| `pnpm harness verify <scope>` | Environment check plus the scope's registered Vitest regressions or project checks                                       |
| `pnpm harness verify all`     | Explicitly runs all of `pnpm check`; the legacy command without a scope retains this behavior                            |
| `pnpm check`                  | Environment, Harness, API/package boundaries, icon synchronization, types, lint, formatting, tests, and both site builds |

`verify` runs steps sequentially, stops at the first failure, and returns a nonzero exit code. It prints the path to `.harness-local/runs/<run>/report.json` on completion. Reports contain commands, outcomes, durations, runtime, and signals; each invocation has a separate record. Full reports represent `pnpm check` as one step; consult that run's terminal output for phase details. Invalid arguments or context, and forcibly interrupted runs, may produce no report. None of these CLI commands launches a browser. Passing command checks does not establish UI/UX acceptance.

The Pages workflow runs `pnpm pages:build` on Ubuntu 24.04 for every push to `main`, then publishes the `dist/pages` artifact to GitHub Pages. It also supports manual dispatch on `main` and runs independently of cross-platform checks. Local full verification uses `pnpm check` according to the rules above. Use `pnpm lint`, `pnpm format:check`, or `pnpm typecheck` separately to diagnose failures. `pnpm lint:fix` and `pnpm format` rewrite files. `pnpm check` synchronizes icon manifests and generates `dist/production`. Review generated diffs before delivery.

### Browser verification

Use browser verification only for changes to visible effects, user actions, or browser-specific capabilities. Maintainer documentation, comments, tests, Harness changes, and logic changes with no page impact do not trigger UI/UX verification. Reader-documentation wording corrections can be checked in source and with formatting tools; open the relevant page when rendering structure, example interaction, or layout is at risk. Report missing required browser evidence accurately; screenshots do not replace functional regressions.

By default, use `pnpm dev` and open `http://127.0.0.1:9527/ray-template/`. Verify the affected page and action flow in one locale with local demo data, and check the DevTools Console for relevant warnings and errors. Missing-key warnings cover translation lookups performed in development. Add dimensions below only when their corresponding behavior changes.

| Change                                                          | Additional checks                                                                                                                                     |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Local interaction, validation, or state                         | Affected action and relevant success, failure, or recovery paths. Check keyboard operation when keyboard/focus behavior changes.                      |
| Copy or internationalization                                    | Check changed keys in both language files. Test locale switching, interpolation, fallback, and text wrapping where affected.                          |
| Layout, sizing, scrolling, or responsiveness                    | The affected area at desktop and narrow widths, such as 390px. Check only affected layout modes and long content.                                     |
| Themes, colors, or shared visual variables                      | Light/dark themes and relevant readability. Select representative actual consumers of shared styles.                                                  |
| Routing, permissions, or cache behavior                         | Menu entry, direct navigation, reload, and restoration for relevant roles/sources. Do not recheck unrelated pages.                                    |
| Browser capabilities such as downloads, printing, or fullscreen | Actual browser behavior in the corresponding example. Unit tests establish only what they cover.                                                      |
| Resource loading, deployment base, or build artifacts           | Build and use a production preview. Check affected entry points, resource URLs, and the console. Verify related admin iframes in the combined output. |

For shared layout or global style changes, choose representative pages with different usage patterns, such as a table and a form, plus affected documentation examples. Define a cross-page matrix only for a site-wide redesign, release acceptance, or an explicit request. After acceptance, small follow-up fixes need only the relevant steps. Reuse results from the same task for pages and dimensions unaffected by the new changes.

Record reproduction steps, actual observations, and unverified areas in the delivery note or PR. Put temporary reports, logs, and screenshots in `.harness-local/`. Record browser results separately; CLI reports cover only their listed commands.

## Maintenance

For behavior or compatibility changes that affect external readers, update `apps/docs` in the same change following the [documentation handoff](../docs/docs-handoff.md). `pnpm docs:check` separately checks example types, documentation links, and the build. Preview affected entry points when production subpaths or interactions are involved.

- When moving implementations, adapters, or examples, update affected indexes in `harness/context/`. Each topic explains when to use it, which files to read first, implementation ownership, and verification. Keep API details in source, module READMEs, or reader documentation.
- To add a task area, register its description and `tests` or `checks` in [scopes.json](scopes.json), add `harness/context/<scope>.md`, and link it from [llms.txt](../llms.txt). Test directories end with `/`; project checks reuse root scripts allowed by the CLI. Existing areas may remain as broader verification entry points.
- Use ordinary inline relative links to repository files or directories. `pnpm harness check` checks file targets in topic indexes and their entry documents; it does not request external links or validate heading anchors. After editing, walk through a real task to confirm implementation and test ownership.
