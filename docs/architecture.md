# Architecture map

Ray Template is a pnpm workspace. The admin application owns host integration, the documentation site explains public usage, and shared packages own reusable implementations. Use the [task index](../llms.txt) to locate features. Use this page to identify ownership and trace calls across modules.

## Workspaces

| Directory                                                                     | Responsibility and authoritative entry point                                                                                                                           |
| ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [apps/admin](../apps/admin)                                                   | Ray Admin: application configuration, route registration, Pinia, providers, pages, demo data, and development mocks. This is Vite's application root.                  |
| [apps/docs](../apps/docs/README.md)                                           | VitePress site: reader guides, APIs, migration instructions, and interactive examples consuming public shared-package entry points.                                    |
| [packages](../packages)                                                       | Shared packages listed below. Each package's `package.json#exports` defines its root entry point and importable subpaths.                                              |
| [Tests](../__test__)                                                          | Vitest regressions grouped by behavior rather than mirroring the source tree. Use [Harness scopes](../harness/scopes.json) to locate coverage.                         |
| [docs](./), [harness](../harness/README.md)                                   | Maintainer conventions and cross-module explanations. Harness owns task navigation, targeted checks, and evidence. Reader-facing documentation belongs in `apps/docs`. |
| [scripts](../scripts), [vite-helper](../vite-helper), [unplugin](../unplugin) | Repository checks, Vite plugin helpers, and generated auto-import declarations. Build, type, and CI configuration remains at the root.                                 |

| Shared package                                                        | Implementation ownership                                                      | Host boundary                                                                                                                                  |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| [@ray-template/utils](../packages/utils/package.json)                 | Precision, type checks, data/file utilities, and generic JSON storage         | Callers supply Storage. Application keys, cache backends, and legacy AES formats stay in the application.                                      |
| [@ray-template/composables](../packages/composables/package.json)     | Vue composables and DOM, element, and scope utilities                         | Application-specific navigation, theme, and content-area hooks stay in the application.                                                        |
| [@ray-template/directives](../packages/directives/package.json)       | Vue directives and registration                                               | The host supplies copy notifications and decides when to register.                                                                             |
| [@ray-template/icons](../packages/icons/package.json)                 | SVG files, manifests, icon-name types, and lookups                            | The build generates spritemaps. The host supplies icon-resolution services.                                                                    |
| [@ray-template/ui](../packages/ui/package.json)                       | Shared components, themes, and UI service interfaces                          | The admin application injects translation, theme, storage, and other services. Application component entry points re-export shared components. |
| [@ray-template/http](../packages/http/package.json)                   | Independent HTTP clients, interceptors, and cancellation                      | The application supplies request configuration and interceptors, and wraps business APIs.                                                      |
| [@ray-template/api-contracts](../packages/api-contracts/package.json) | Business/demo API types, runtime schemas, route contracts, and OpenAPI        | Independent of browsers and mocks. The application, mocks, and integrating backends share the protocol.                                        |
| [@ray-template/demo-data](../packages/demo-data/package.json)         | Runtime-neutral fixtures, initial route data, and demonstration query helpers | Mock and optional backend consumers decide when demonstration behavior is enabled.                                                             |
| [@ray-template/routing](../packages/routing/package.json)             | Browser route expansion, menu traversal, and compatibility schema exports     | The application owns the view registry, configuration sources, roles, sessions, and guards.                                                    |
| [@ray-template/admin-shell](../packages/admin-shell/package.json)     | Layout shell, settings, transitions, and cached-page rendering                | The host supplies route state, preferences, navigation, and content slots.                                                                     |

Application `@/components`, `@/hooks`, and `@/utils` include compatibility entry points. Follow actual exports to determine ownership. Shared packages must not depend on application aliases or relative imports across workspaces. The [package-boundary check](../scripts/check-package-boundaries.mjs) validates dependency declarations, public entry points, and cycles. Each workspace declares `rayTemplate.runtime` as `browser`, `server`, or `universal`: applications cannot be dependencies; universal packages depend only on universal packages; browser/server workspaces cannot import each other. The canonical route schemas and structural validation live in `packages/api-contracts`; `packages/routing` retains compatibility exports and browser view binding. `packages/demo-data/src/routes.json` owns the initial route fixture.

## Source distributions

The [distribution exporter](../scripts/distributions.mjs) creates source directories and `.tar.gz` archives under `dist/distributions`. The frontend edition retains Admin, Docs, and their reachable workspace dependencies, with a pruned lockfile and usable scripts. `distribution.json` records the edition, version, source commit/worktree state, workspace set, file count, and content digest. Explicit source inputs exclude local credentials, dependencies, generated builds, and verification evidence.

Markdown blocks delimited by the HTML comment markers `fullstack:start` and `fullstack:end` are removed from frontend exports. Keep references to omitted server files inside these blocks. Export is local only; branch/Release publication is a separate integration step. Read the [distribution guide](../apps/docs/guide/distributions.md) for user commands.

<!-- fullstack:start -->

## Optional server workspace

[apps/server](../apps/server) owns NestJS controllers/services, PostgreSQL persistence through Prisma, migrations, credential initialization, authorization, and audit records. It consumes only universal workspace packages and keeps ORM models out of browser contracts. [Platform infrastructure](../apps/server/src/platform/README.md) owns Redis rate limits/cache, request IDs and redacted JSON logs, security headers, CORS, health probes, and resource shutdown. Database sessions and authorization are never cached.

The [fullstack launcher](../scripts/fullstack.mjs) creates private local configuration once, starts PostgreSQL/Redis through [Compose](../deploy/compose.yaml), migrates/seeds without resetting existing accounts, and waits for backend readiness before starting Vite with a same-origin API proxy. External databases are supported through `setup --external`. Fullstack source export adds this workspace and its deployment configuration. Docker and production deployment require independent runtime acceptance.

The server has its own [TypeScript configuration](../apps/server/tsconfig.json) and build output. Tests under `apps/server/test` use Node's test runner; database integration tests require explicit test PostgreSQL and Redis URLs. Frontend builds do not initialize server resources.

<!-- fullstack:end -->

## Key runtime flows

| Flow                      | Call order and boundaries                                                                                                                                                                                                                                                                                                                                                | Continue with                                                                    |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| Admin bootstrap           | [index.html](../apps/admin/index.html) → [main.ts](../apps/admin/src/main.ts) → Pinia → internationalization → Router → Day.js → directives and autocomplete settings → mount [App.tsx](../apps/admin/src/App.tsx). Standalone and Wujie modes share plugin registration order.                                                                                          | [Layout and bootstrap](../harness/context/layout.md)                             |
| Navigation and caching    | [Router initialization](../apps/admin/src/router/index.ts) loads the source → [application route modules](../apps/admin/src/router/app-route-modules.ts) expand configuration → guards and pages are registered → application menu stores and layouts consume routes. The application maintains the cache allowlist; the shared shell renders transitions and KeepAlive. | [Routing](../harness/context/routing.md), [layout](../harness/context/layout.md) |
| Requests and demo data    | [API](../apps/admin/src/api) → [application Axios instance](../apps/admin/src/axios/instance.ts) → [shared client](../packages/http/src/client.ts). Development and static online demos share HTTP mocks. Users, sessions, and routes are read/written through APIs; integrating backends own real sessions and resource authorization.                                  | [API](../harness/context/api.md)                                                 |
| Documentation examples    | Documentation can consume shared packages directly. When application context is required, [AdminExample.vue](../apps/docs/examples/AdminExample.vue) embeds [example.html](../apps/admin/example.html) with isolated bootstrap, restricted routes, and in-memory caching.                                                                                                | [Documentation and examples](../harness/context/docs.md)                         |
| Application configuration | [Vite](../vite.config.ts) injects `__APP_CFG__` and `__DEV__`; [application configuration](../apps/admin/src/app-config) is grouped by design, requests, routing, and caching.                                                                                                                                                                                           | [Build and toolchain](../harness/context/toolchain.md)                           |

After a successful development mount, [application doctor](../apps/admin/src/doctor/README.md) reports configuration warnings independently of startup failures. It does not initialize services or impose a business home route.

Maintain guides and runnable examples for public behavior changes through [application/documentation coordination](docs-handoff.md). See [visual and layout guidance](ui-design.md) for page design and [comment style](comment-style.md) for code comments.

## TypeScript project configuration

The [root configuration](../tsconfig.json) references four projects. Strict mode, module resolution, and type-checking aliases live in the [shared configuration](../tsconfig.base.json). When changing aliases, check [Vite](../vite.custom.config.ts) and [Vitest](../vitest.config.ts) as well.

| Configuration                                          | Coverage                                                                                                                                           |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Application](../tsconfig.app.json)                    | Admin `apps/admin/src`, Vue JSX, and generated declarations.                                                                                       |
| [Node](../tsconfig.node.json)                          | Root build/test configuration, `vite-helper`, and build helpers.                                                                                   |
| [Tests](../tsconfig.test.json)                         | `__test__` and referenced source, loading Vitest and Node types. Vitest configuration and individual test files determine the runtime environment. |
| [Shared packages](../tsconfig.packages.json)           | `packages/*/src`, without inheriting application aliases or auto-import declarations.                                                              |
| [Universal contracts/data](../tsconfig.universal.json) | Node-only type-checking environment for API contracts and demo data; no browser DOM library.                                                       |
| [Documentation site](../apps/docs/tsconfig.json)       | Independent documentation-example checks, run by `pnpm docs:check`.                                                                                |

`pnpm typecheck` first validates icon synchronization, then runs `vue-tsc --build` for the four projects referenced by the root configuration. Incremental caches live in `node_modules/.cache/ray-template/`. Use `pnpm exec vue-tsc -p <configuration-file>` for an individual project.

## Deployment and search discovery

`pnpm build` produces admin output in `dist/production`; `pnpm docs:build` produces `apps/docs/.vitepress/dist`. `pnpm pages:build` combines them in `dist/pages`, with documentation under `docs/`. The default admin base is `/ray-template/`; the documentation base is `/ray-template/docs/`. For root hosting or another subpath, align the [admin base](../vite.custom.config.ts), [documentation base](../apps/docs/.vitepress/config.mts), and [legacy redirect targets](../scripts/assemble-pages.mjs).

After main-branch checks pass, [CI](../.github/workflows/ci.yaml) publishes the combined output to the `dist` branch. The [admin public .nojekyll file](../apps/admin/public/.nojekyll) is copied into the output. Preserve it when deploying manually to Pages so assets with underscore prefixes can load.

For public builds, set `RAY_TEMPLATE_SITE_ORIGIN` to the actual site origin; the base supplies the path. Without it, admin production builds emit `noindex`. The public admin landing page generates canonical metadata, sharing previews, and `sitemap.xml`; authenticated hash routes are not listed as public pages. Domain-level crawling rules belong in `/robots.txt` at the site root. [VitePress mappings](../apps/docs/.vitepress/legacy.mts) generate legacy in-site links. When a site origin is configured, the assembly script also generates `dist/legacy-docs` for migrating the old site.

Establish implementation behavior from tracked source and configuration. Generated artifacts, dependencies, caches, and `.harness-local/` reports are useful for inspecting build and verification results.
