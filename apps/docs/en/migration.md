# Moving from v5 to v6 {#v5-与-v6-的版本分界}

**Ray Template 6.0.0 starts a new major release line.** v6 reorganizes the admin application, documentation site, and shared packages into a monorepo. In-place upgrades from v5 are unsupported. Review internal import paths, APIs, deployment settings, and browser data before migrating. Existing v5 projects can stay on v5.

| Version    | Where to start                                                                                                                                                                                                                                                                            |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **v6.0.0** | Start new projects from the v6 workspace. See [Quick start](./guide/start) and [v6 Monorepo Architecture](./guide/architecture).                                                                                                                                                          |
| **v5**     | [legacy/v5](https://github.com/XiaoDaiGua-Ray/ray-template/tree/legacy/v5) preserves the complete source before the split. The branch points to `6f095b7` with manifest version `5.2.5`. For a tagged snapshot, use [v5.2.4](https://github.com/XiaoDaiGua-Ray/ray-template/tree/v5.2.4). |

## What changed in v6 {#v6-的变更}

| Area                               | v6 entry points and conventions                                                                                                                                                                                                                   |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Application structure              | The former root `src/`, `mock/`, `public/`, app environment files, and `index.html` moved under `apps/admin/`. Review environment variables, container configuration, and build scripts against the v6 entry points.                              |
| Components and utilities           | Import shared code through each package's public entry points, such as `@ray-template/ui/table-pro`, `@ray-template/composables/useDevice`, and `@ray-template/utils/precision`. Within Ray Admin, `@/` resolves to the application's own `src/`. |
| Component integration              | In v6, `RTablePro` accepts either `data` or `request(params, signal)`. `useTablePro` retains `[register, actions]` and `onRegister`. Use the [current API](./reference/table-pro#usetablepro) for requests and instance methods.                  |
| Routing, permissions, and requests | Shared packages provide route validation, the HTTP client, and the layout. Ray Admin supplies the view registry, session handling, access checks, request headers, themes, and language.                                                          |
| Docs and demo                      | The VitePress site in `apps/docs/` runs examples through public package exports. The hosted admin is at `/ray-template/` and the docs are at `/ray-template/docs/`, with English at `/ray-template/docs/en/`.                                     |

## Adopt v6 in an existing project {#现有项目采用-v6}

1. Start from a new workspace or branch. Keep a way to roll back to your v5 code and deployment. Configure dependencies, environment variables, API endpoints, and CI for v6.
2. Move pages, endpoints, and menus one feature at a time. Review old deep imports, route JSON, and custom interceptors against the [page example](./guide/first-page), [routing conventions](./guide/routing), and [TablePro API](./reference/table-pro).
3. Verify v6 with a separate browser profile or deployment origin. `localStorage` is scoped to the origin, so different paths on the same host share session and preference storage. Existing settings, lock state, cache, and sign-in state require project-specific migration.
4. Check sign-in, permissions, direct navigation, APIs, caching, and deployment paths before switching traffic. Run `pnpm harness verify`. Use `pnpm pages:build` for a combined deployment. [Checks and deployment](./guide/tooling)
