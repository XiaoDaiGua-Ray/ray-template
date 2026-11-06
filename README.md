# Ray Template

**A Vue 3 admin template built for AI-assisted development.**

Give developers and coding agents the same path through the project: **find the implementation, understand its contracts, reuse existing capabilities, and verify the change.**

[简体中文](README.zh-CN.md) · **[Live demo](https://xiaodaigua-ray.github.io/ray-template/)** · **[Documentation](https://xiaodaigua-ray.github.io/ray-template/docs/)** · [Quick start](#quick-start) · [Develop with AI](#develop-with-ai)

Ray Template uses Vue 3, TypeScript / TSX, and Naive UI for admin dashboards, operations consoles, and internal tools. The repository brings together a working application, shared components, interactive documentation, and engineering context organized by task.

**Task context and verification commands · 4 visual styles · 5 navigation layouts · 11 TablePro examples**

[![TablePro in Modern light mode, with search, pagination, automatic height, and toolbar actions](docs/assets/readme/table-modern-light.png)](https://xiaodaigua-ray.github.io/ray-template/#/tables/auto-height)

## Why choose Ray Template

### Engineering context for AI collaboration

[AGENTS.md](AGENTS.md) sets the collaboration rules; [llms.txt](llms.txt) maps tasks to source, contracts, examples, and checks. When working on tables, routing, layout, or APIs, read the relevant context and use Harness to run the corresponding checks and save their results.

### Applications, documentation, and examples share source

The admin application and documentation consume the same workspace packages. Interactive examples use real components, and the TablePro documentation includes the source of the examples it runs. Changes to public capabilities can be checked in both the application and documentation. [Explore the examples](apps/docs/reference/table-pro-examples.md) · [Documentation workflow](docs/docs-handoff.md)

### Four styles across the business interface

Modern, Naive UI, Material, and Plain cover the shell, controls, tables, and charts, each with light and dark modes. Custom pages inherit colors, corners, and shadows through semantic theme tokens, while runtime layout variables adapt them to the workspace. [Theme integration](apps/docs/guide/appearance.md) · [CSS contract](docs/ui-design.md#custom-css-contract)

### TablePro handles interaction and data state

One table component supports local data, remote requests, and controlled pagination, with advanced search, column settings, export, printing, and instance hooks. Request races, cancellation signals, failure recovery, and export scope have explicit contracts and regression coverage. [11 runnable examples](https://xiaodaigua-ray.github.io/ray-template/docs/reference/table-pro-examples.html) · [Component contract](packages/ui/src/RTablePro/README.md)

### One contract from the static demo to your business API

Development and the static hosted demo share MSW HTTP mocks, with pages fetching data through the application's API layer. Shared TypeScript types, Valibot schemas, and generated OpenAPI 3.1 definitions guide backend integration; a dedicated command checks that generated contracts stay in sync. [API contracts](packages/api-contracts/README.md) · [Backend integration](apps/docs/guide/backend.md)

### Visual route editing with a validated configuration contract

Manage menu order, roles, visibility, and caching through a visual editor or JSON. Tree previews, import/export, JSON Schema, and registered view IDs help maintain the configuration. Both editors use the same route model, with documented integration constraints and permission boundaries. [Routes and menus](apps/admin/src/router/README.md)

<!-- fullstack:start -->

### Choose frontend or fullstack source from one project

Export an independently runnable frontend, or include the NestJS, PostgreSQL, and Redis implementation. Distribution scripts use the dependency graph to prune workspaces, the lockfile, and edition-specific documentation, then record the version, source commit, and content digest. [Source distributions and startup](apps/docs/guide/distributions.md)

<!-- fullstack:end -->

## Quick start

Use **Node.js 26.13.0** and **pnpm 12.16.1**, as pinned in the repository.

```sh
git clone https://github.com/XiaoDaiGua-Ray/ray-template.git
cd ray-template
nvm install
nvm use
npm install --global pnpm@12.16.1
pnpm install --frozen-lockfile
pnpm dev
```

Open [http://127.0.0.1:9527/ray-template/](http://127.0.0.1:9527/ray-template/) and click **Continue with demo account**. Switch to manager or read-only accounts to explore permission differences. The frontend demo needs no database or business backend.

- **Try the interface.** Open Settings to change styles and layouts, then explore Users and TablePro.
- **Build your first page.** Follow the [business page guide](apps/docs/guide/first-page.md), reuse components, and register the route with English and Chinese menu labels.
- **Connect your service.** Follow the [backend integration guide](apps/docs/guide/backend.md) to configure `VITE_API_BASE_URL` and `VITE_API_MOCK=false`.

## Develop with AI

AI support is part of the everyday development workflow. Coding agents that can read the repository and run commands can use the same Markdown documents, source entry points, and verification commands as maintainers.

| Development question                                                             | Evidence in the repository                                                                                                                                                                      |
| -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Where should I start, and which conventions apply?                               | [AGENTS.md](AGENTS.md): scope, reuse, documentation updates, and acceptance rules.                                                                                                              |
| Which files matter for this task?                                                | [llms.txt](llms.txt) → [task context](harness/context): implementations, callers, contracts, and tests.                                                                                         |
| Which module owns the behavior, and where are its boundaries?                    | The [architecture map](docs/architecture.md), public `exports`, and [package boundary checks](scripts/check-package-boundaries.mjs).                                                            |
| How do existing capabilities work, and what do their parameters and states mean? | [Component references](apps/docs/reference/components.md), [hook references](apps/docs/reference/hooks.md), module READMEs, and [runnable examples](apps/docs/reference/table-pro-examples.md). |
| How do mocks and business requests agree on API shapes?                          | [Shared schemas and OpenAPI](packages/api-contracts/README.md), with `pnpm api:check` checking generated contract synchronization.                                                              |
| What should I run after a change, and where are the results?                     | [Verification scopes](harness/scopes.json) and `pnpm harness verify <scope>`, with reports saved under `.harness-local/runs/`.                                                                  |

For a TablePro task, read its context first, then select verification for the change:

```sh
pnpm harness context table-pro
pnpm harness verify table-pro
```

You can give a coding agent a request like this and replace the business details:

```text
Read AGENTS.md and llms.txt first, then locate the context for this task.
Add a project list page with name, status, and owner filters and remote pagination.
Check existing TablePro examples, route registration, API contracts, and English/Chinese copy before implementing. Reuse existing capabilities.
Identify the modules that need to change, complete the implementation, and run the relevant checks. Verify visible interactions in a browser.
Report the changes, checks that actually passed, and anything still unverified.
```

Here, `llms.txt` is a repository task index that you can explicitly ask an agent to read. Load context by task and confirm behavior against current source and contracts. Harness runs only the commands registered for the selected scope; add type, lint, formatting, and browser checks as the change requires. Use `pnpm check` for full verification. See the [verification rules](harness/README.md#choosing-the-verification-scope).

## Everyday admin capabilities

| Area                              | Included                                                                                                                                                                              |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Users and accounts**            | Login, logout, session restoration, and screen lock; organization tree, member search, create/edit/detail flows, account status, roles, profiles, and password forms.                 |
| **Routes and permissions**        | Visual and JSON route editors, menu generation, role-based navigation, action permissions, direct-route guards, and KeepAlive.                                                        |
| **Navigation and workspace**      | Page tabs, context menus, breadcrumbs, `⌘/Ctrl + K` search, account-scoped recent pages and favorites, content maximization, transitions, and 403/404/500 pages.                      |
| **Tables and search**             | Local data, remote requests, controlled pagination, advanced search, dependent remote options, automatic height, virtual scrolling, saved column visibility, reordering, and pinning. |
| **Forms and dialogs**             | `RForm`, `useForm`, and `RModal`, with validation, reset, loading states, and interactive examples.                                                                                   |
| **Visualization and interaction** | ECharts lifecycle and themes, LogicFlow, draggable cards, context menus, screenshots, CSV export, printing, and fullscreen.                                                           |
| **Themes and localization**       | Four styles, light/dark/system modes, custom primary colors, English and Chinese copy, live preference persistence, and JSON import/export.                                           |
| **Icons and utilities**           | Typed SVG names and generated sprites, QR codes, barcodes, precision arithmetic, storage, composables, and directives.                                                                |
| **Engineering and integration**   | pnpm workspaces, request cancellation, type and package boundary checks, Vitest, ESLint / Prettier, and a [Wujie sub-application entry point](apps/admin/src/main.ts).                |

Frontend permissions shape the page experience; your backend validates real sessions and API authorization. See the [backend integration guide](apps/docs/guide/backend.md) for demo data and integration boundaries.

## Styles and layouts

| Style        | Character                                                            |
| ------------ | -------------------------------------------------------------------- |
| **Modern**   | The default style: blue accents, balanced spacing, and soft corners. |
| **Naive UI** | Native library controls, proportions, and green accents.             |
| **Material** | Tonal surfaces, larger corners, and capsule-shaped buttons.          |
| **Plain**    | Neutral colors, small corners, and flat surfaces.                    |

**Side · Top · Mixed · Right · Split.** Choose fluid or fixed-width content, adjust spacing, and pin the header or footer. Narrow screens use a menu drawer. Switch layouts in the [live demo](https://xiaodaigua-ray.github.io/ray-template/) or explore the [layout playground](apps/docs/guide/layout.md).

<details>
<summary>View the workspace and dark theme previews</summary>

![The workspace in Modern light mode](docs/assets/readme/welcome-modern-light.png)

![The workspace in Modern dark mode](docs/assets/readme/welcome-modern-dark.png)

[![TablePro in Modern dark mode](docs/assets/readme/table-modern-dark.png)](https://xiaodaigua-ray.github.io/ray-template/#/tables/auto-height)

</details>

## Workspaces and source distributions

A **pnpm monorepo** keeps business integration separate from shared capabilities.

| Location                     | Responsibility                                                                                                                               |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| [apps/admin](apps/admin)     | Pages, sessions, Pinia, route registration, business APIs, and mocks.                                                                        |
| [apps/docs](apps/docs)       | VitePress guides, API references, and interactive examples.                                                                                  |
| [packages](packages)         | 10 shared packages: `ui`, `admin-shell`, `composables`, `directives`, `icons`, `http`, `api-contracts`, `demo-data`, `routing`, and `utils`. |
| [harness](harness/README.md) | Task context, verification scopes, check commands, and result reports.                                                                       |

Shared packages expose public `exports`. Boundary checks cover imports, dependency declarations, runtime environments, and dependency cycles. These packages are used within the workspace and are not separately published to npm. [Architecture map](docs/architecture.md)

**Frontend source:** Run `pnpm dist:frontend` to generate `ray-template-frontend-<version>.tar.gz` and its source directory under `dist/distributions/`. Extract it, then run `pnpm install --frozen-lockfile` and `pnpm dev`. The export includes Admin, documentation, shared packages, and mocks; it excludes local configuration, credentials, build output, and installed dependencies. `distribution.json` records the version, source commit, workspace state, and content digest.

<!-- fullstack:start -->

**Optional fullstack source:** The complete repository also includes [apps/server](apps/server), using NestJS, PostgreSQL, and Redis for sessions, API permissions, users, route configuration, audits, and rate limits. Run `pnpm dist:fullstack` to export the fullstack source for the same version.

After installing dependencies and preparing Docker Compose, run:

```sh
pnpm fullstack:setup
pnpm dev:full
```

`setup` creates the private `apps/server/.env.local`, starts PostgreSQL and Redis, applies migrations, and initializes the administrator. The generated administrator password is stored in that file; mock demo passwords do not authenticate against the server. For existing databases and Redis, use `pnpm fullstack:setup --external` and follow the [startup guide](apps/docs/guide/distributions.md) for configuration.

Alternatively, run `node scripts/fullstack.mjs up` to build and start the entire stack with Docker, without first installing project dependencies on the host. The default entry point is `http://127.0.0.1:8080/ray-template/`. `pnpm fullstack:stop` stops services and retains data volumes.

The [source distributions workflow](.github/workflows/distributions.yaml) provides manual options to verify archives, generate the `frontend` branch, and attach assets to an existing Release. [Container startup and release instructions](apps/docs/guide/distributions.md#容器启动)

<!-- fullstack:end -->

## Development and verification

**Vue 3 · TypeScript / TSX · Naive UI · Vite / Rolldown · Pinia · Vue Router · Vue I18n · Axios · MSW · Vitest**

| Command                        | Purpose                                                                                                                                                                  |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `pnpm dev` / `pnpm docs:dev`   | Develop the admin application or documentation.                                                                                                                          |
| `pnpm build` / `pnpm preview`  | Build or preview the admin application.                                                                                                                                  |
| `pnpm pages:build`             | Assemble the admin and documentation into `dist/pages`.                                                                                                                  |
| `pnpm harness context <scope>` | Read task entry points and relevant check commands.                                                                                                                      |
| `pnpm harness verify <scope>`  | Run checks for the selected scope and save a report.                                                                                                                     |
| `pnpm harness check`           | Validate task indexes, relative file links, and registered verification scopes.                                                                                          |
| `pnpm check`                   | Run the full checks configured for this source edition: environment, contracts, package boundaries, types, lint, formatting, tests, site builds, and distribution plans. |

<!-- fullstack:start -->

In the complete repository, `pnpm check` also checks server types, tests, and builds. Distribution plan checks validate export structure and dependencies; independent installation, runtime, and deployment environments require their own acceptance checks.

<!-- fullstack:end -->

The **Pages workflow** builds the admin and documentation on every push to `main` and publishes the `dist/pages` artifact to GitHub Pages. It also supports manual publication on `main` and runs independently of cross-platform checks. Read [AGENTS.md](AGENTS.md) and the [Harness verification guide](harness/README.md) before contributing. Default deployment paths are `/ray-template/` for the admin and `/ray-template/docs/` for documentation. See the [deployment guidance](docs/architecture.md#deployment-and-search-discovery) for Pages setup.

## Version boundaries

**v6 introduces the monorepo architecture and does not provide an in-place upgrade from v5.** Compatibility with v5 internal imports, APIs, deployment settings, and browser data is not guaranteed.

Existing projects can stay on [legacy/v5](https://github.com/XiaoDaiGua-Ray/ray-template/tree/legacy/v5) or the [v5.2.5 tag](https://github.com/XiaoDaiGua-Ray/ray-template/tree/v5.2.5). Read the [migration notes](apps/docs/migration.md) before adopting v6.

---

[MIT License](LICENSE) · [Changelog](CHANGELOG.md) · [Report an issue](https://github.com/XiaoDaiGua-Ray/ray-template/issues) · [Contributor guidance](AGENTS.md)
