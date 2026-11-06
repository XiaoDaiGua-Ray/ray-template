# AI Harness development plan

<!-- fullstack:start -->

## 2026-11-06: Optional backend and source distributions

The approved scope is one development workspace with independently usable frontend and fullstack source distributions, followed by a NestJS backend. Backend security, authentication, Redis, logging, and operational foundations are part of this batch. No remote commit, branch publication, release, or deployment is authorized by this implementation task.

1. Establish application isolation and universal contract boundaries. Move route schemas and reusable demo fixtures into browser-independent workspace packages; preserve frontend compatibility entry points.
2. Export frontend and fullstack source trees and archives from the same source, including independent frozen-installable lockfiles. Exclude secrets, local evidence, dependencies, and build outputs. Prepare release/branch automation without publishing it.
3. Add NestJS and PostgreSQL persistence behind the existing API contract. Preserve Bearer sessions for this integration; cookie authentication is a separate protocol migration. Include revocation, RBAC, atomic writes, account protection, audit records, Redis limits/cache, configuration validation, sanitized logs, health checks, and graceful shutdown.
4. Provide repeatable setup, local fullstack orchestration, Compose configuration, database migrations, and credential provisioning without fixed passwords. Preserve existing data on repeated setup.

Acceptance: both distributions pass isolated frozen installation and their checks/builds; backend HTTP tests use real PostgreSQL and Redis; frontend mock mode and the real-backend login/user/route flows work in a browser; full Harness checks pass once after integration. Docker/remote workflows require separate evidence and must not be reported as verified without execution. Local reports belong in `.harness-local/`.

Parallel ownership: the lead owns integration, shared packages, package-boundary checks, launchers and documentation; distribution and backend agents own their assigned new files, with platform infrastructure isolated under the server's `src/platform` directory.

### Pause checkpoint requested by the user

The user requested an active pause before 17:55 Asia/Shanghai on 2026-11-06 because connectivity will end at 18:00. Resume this implementation in the same worktree; changes are uncommitted and unpublished.

Implemented: workspace runtime ownership checks; shared universal route schemas/semantic parser and generated view/icon catalog; shared demo fixtures; independent frontend/fullstack source export with pruned lockfiles and provenance; NestJS core auth/users/routes with PostgreSQL persistence, scrypt passwords, hashed opaque tokens, live authorization, atomic writes and audit; Redis limits/cache infrastructure, configuration validation, sanitized logs, CORS/security headers, health and shutdown; setup/Compose/development launchers; bilingual delivery and backend documentation. `pnpm fullstack:setup` replaces the proposed `pnpm setup` because the latter is a pnpm builtin. Login demo buttons are now restricted to Mock mode; real sign-in inputs use username/current-password autofill, stable names and required fields.

Observed validation before pause:

- Frontend checks: 103 Vitest files / 535 tests, types, lint, format, API/package checks, production build and documentation build passed. Full `pnpm harness verify all` passed; report: `.harness-local/runs/all-JcqVqb/report.json`, log: `.harness-local/full-check.log`.
- Server: type check/build and 13 unit/platform tests passed, including real Redis. Six HTTP integration tests passed on real PostgreSQL and Redis, covering authorization, uniqueness, transaction atomicity, revocation, semantic route validation, process restart persistence and repeat seed.
- Real `pnpm fullstack:setup --external` passed Prisma migrate deploy and administrator initialization in an isolated local PostgreSQL schema. The generated private `.env.local` is ignored and must never enter artifacts or logs.
- Frontend source archive extracted outside the repository passed frozen install, package/Harness/API checks and production build. The source exporter passed nine regression cases. Fullstack source projection passed structural checks; its standalone installation is still pending.
- Local PostgreSQL 18.6 and Redis 8.2.11 binaries are retained under `.harness-local/services/`. Their test endpoints were localhost ports 15432/16379; services must be restarted before real integration tests. Both temporary services were stopped before the pause.

Remaining work at the pause, in order:

1. Implement the optional Nest demo endpoints using shared fixtures and the Redis read cache. The backend currently implements core admin endpoints only; existing frontend demo/chart calls are not yet served. Ensure `DEMO_ENABLED=false` has an explicit menu/endpoint policy.
2. Run actual `pnpm dev:full` startup/shutdown/error-path checks and browser acceptance for mock and real-backend login, user operations, permissions, route saves and reloads. Login gating/autofill changes have source/build verification only.
3. Validate the isolated fullstack archive, package deploy output and Compose images. Docker is absent locally; the container definitions are unverified. Verify forwarded client IP trust, origins and non-default ports before calling container setup production-ready.
4. Implement source-release artifact and generated frontend-branch workflow (currently not written). No branch, tag, release, commit or deployment has been published; obtain required Git/publication authorization before those remote actions.
5. Review combined changes, add focused missing regressions (launcher and real-backend login/demo flows), rerun only affected checks after fixes, and regenerate final archives. Preserve the initial one-mainline/two-distribution design and production credential separation.

Modern Web Guidance applied: `autofill-sign-in-form` ("Use `autocomplete="current-password"` for the password input in a sign-in form") and `forms` ("turn off text correction on fields that hold identifiers rather than prose"). The retrieved guide is retained at `/var/folders/3n/76yvbw114mn8205ykb9npv2r0000gn/T/mwg-guide-73479-1793958308167.md`; browser acceptance is pending.

### Resumed implementation

The same worktree now includes the demo controllers and shared queries, the protected editor snapshot, the hardened dev launcher and Compose entry point, and a manually dispatched source distribution workflow. Mock and backend mode were exercised in Chrome with isolated test data, including real sign-in, user changes, read-only permissions, route persistence, and demo reads. The workflow can verify and archive a source revision, update the generated `frontend` branch, or attach assets to an existing release. Local acceptance evidence is kept in `.harness-local/fullstack-resume/`; remote workflow execution and publication require a separate authorized run.

<!-- fullstack:end -->

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
- Preserve full checks when scope is omitted for command compatibility. Everyday guidance should show an explicit scope. This checkpoint retained CI's three-platform `pnpm check` and deployment dependencies; the later [direct Pages build change](../docs/toolchain-upgrade.md#2026-11-06-direct-pages-builds-on-main) supersedes that CI arrangement.
- Continue writing local reports to `.harness-local/`, excluded from Git, lint/format scans, and package inputs. Full-report phase details still depend on terminal output. Record browser evidence separately; static checks do not prove runtime success.
- Regressions cover targeted commands not appending full checks, stopping on generated-artifact check failure, and compatibility of explicit/legacy full-check entry points. Actual run results are in the [toolchain record](../docs/toolchain-upgrade.md). This change has no page effect and needs no UI/UX verification.
