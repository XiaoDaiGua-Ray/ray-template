# v6 Monorepo Architecture {#v6-monorepo-架构}

Ray Template v6 puts Ray Admin, the VitePress documentation site, and ten shared packages in one pnpm workspace. Ray Admin owns sign-in, business pages, and application state. The documentation site runs examples from the same component sources. Shared packages expose reusable implementations through public entry points.

## Workspace overview {#工作区总览}

```text
ray-template/
├─ apps/
│  ├─ admin/                Ray Admin
│  │  ├─ index.html         Admin entry
│  │  ├─ example.html       Demo entry
│  │  └─ src/
│  │     ├─ main.ts         Bootstrap
│  │     ├─ App.tsx         Providers
│  │     ├─ app-config/     App config
│  │     ├─ app-components/ Host UI
│  │     ├─ locales/        Locales
│  │     ├─ router/         Route guards
│  │     │  └─ config/      Route inputs
│  │     ├─ store/          Pinia state
│  │     │  ├─ modules/     Pinia stores
│  │     │  └─ hooks/       State access
│  │     ├─ layout/         Shell wiring
│  │     ├─ views/          Pages, demos
│  │     ├─ api/            API calls
│  │     │  ├─ admin/       Admin API
│  │     │  └─ demo/        Demo queries
│  │     ├─ axios/          Interceptors
│  │     └─ mocks/          MSW state
│  └─ docs/                 VitePress
│     ├─ .vitepress/
│     │  ├─ config.mts      Site config
│     │  ├─ sidebar.mts     Sidebar
│     │  ├─ legacy.mts      Legacy URLs
│     │  └─ theme/          Site theme
│     ├─ guide/             Guides
│     ├─ reference/         API docs
│     ├─ examples/          Vue examples
│     └─ playground/        Layout demo
├─ packages/
│  ├─ admin-shell/          Layout shell
│  ├─ routing/              Navigation
│  ├─ ui/                   UI and theme
│  ├─ icons/                SVG icons
│  ├─ http/                 HTTP client
│  ├─ api-contracts/        API schemas
│  ├─ demo-data/            Fixtures
│  ├─ composables/          Vue hooks
│  ├─ directives/           Directives
│  └─ utils/                Utilities
├─ harness/                 Task checks
└─ pnpm-lock.yaml           Lockfile
```

Ray Admin uses all the shared packages shown above. The docs import the packages needed by each example, including UI, layout, and routing. Examples that need the full admin context open an isolated entry in an iframe. Each application declares dependencies in its own `package.json` and uses the workspace lockfile. [Workspace configuration](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/pnpm-workspace.yaml) · [Engineering architecture map](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/docs/architecture.md)

<!-- fullstack:start -->

The full-stack source also includes `apps/server`, which runs independently. [Server architecture](#可选服务端怎样分层)

<!-- fullstack:end -->

## How Ray Admin is assembled {#ray-admin-怎么组装}

### Bootstrap and global services {#启动与全局服务}

```text
index.html → main.ts
  ↓
Install Pinia and language packs
  ↓
Restore the session → Set up Vue Router
  ↓
Install Day.js and directives
  ↓
Mount App.tsx and global providers
  ↓
RouterView → Active page
```

Standalone and Wujie sub-app modes use the same plugin setup. Startup restores the session before deciding whether to load account routes. `src/app-config/` supplies theme, route, request, and cache configuration. [Bootstrap entry point](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/main.ts) · [Application configuration](../reference/configuration)

`App.tsx` assembles Naive UI, global styles, the watermark, and loading state. Through `@ray-template/ui/services` it provides theme, translation, icon URLs, notifications, and column preference storage. Shared UI components consume these through `UiServices`, so the docs can run them in their own context. [App source](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/App.tsx)

### From route configuration to menus and pages {#从路由配置到菜单和页面}

```text
Built-in JSON / Local / Remote
  ↓
router/config/source.ts → Select source
  ↓
api-contracts → Validate structure
  ↓
routing + config/views.ts
  Bind view IDs to page loaders
  ↓
Vue Router + App guards
  ├─→ store/menu → Menus, tabs, crumbs
  └─→ RLayout → AdminShell → Page
```

- `router/` registers sign-in, status, and current-account routes. Built-in configuration comes from `demo-data`. `router/config/views.ts` registers the loadable `views/` pages. Guards use the verified session and route permissions to decide whether to enter a page. [Routes, menus, and permissions](./routing)
- `store/` keeps state by responsibility. `signing` handles sessions. `menu` derives menus from permissions and syncs tabs and breadcrumbs with the route. `keep-alive` tracks cacheable pages. `setting` persists selected preferences, while `runtime` rebuilds loading, drawer, and maximization state on mount. Store hooks expose state and actions. [Store reference](../reference/store)
- `layout/` adapts the shared shell. `RLayout` supplies layout preferences and slots for navigation and content to `AdminShell`. The default content slot wires request cancellation and page transitions. The transition uses the cache settings and allowlist to render `KeepAlive`. [Layout and state](./layout)

### The path of a business request {#一次业务请求经过哪些层}

```text
views/ or store/
  ↓
api/admin/ or api/demo/
  ↓
axios/                App interceptors
  ↓
@ray-template/http    Axios instance
  ├─→ MSW → mocks/ → Demo fixtures
  └─→ HTTP → Configured API
```

`api/` wraps endpoints. The admin client adds session transport and validates responses with `api-contracts`. `axios/` configures request, response, and error interceptors. `http` provides a canceler for each instance and accepts a caller-provided `AbortSignal`. [Requests, cancellation, and mocks](./requests)

Development and the static hosted demo can use the same MSW HTTP mock. `mocks/handlers.ts` implements endpoints. `mocks/database.ts` handles demo sessions, users, and route reads and writes. `demo-data` provides initial fixtures and query utilities. When a real API is connected, the server verifies sessions and authorizes resource access. [Backend integration and the standard API contract](./backend)

## How the docs run components {#文档怎样运行组件}

```text
Documentation page
├─ Render examples/*.vue directly
│  └─ Public entry, e.g. ui/table-pro
└─ Embed through AdminExample.vue
   └─ admin/example.html
      └─ documentation-example.tsx
         └─ Allowed admin demo routes
```

- **Direct examples.** The precision, barcode, and TablePro examples import shared packages. Markdown includes the same `.vue` file used by the runnable example. TablePro receives local rows or a cancelable mock query. The layout playground has a separate preview page and in-memory router. [Precision arithmetic](../reference/utils/core#交互示例) · [Barcode](../reference/components/barcode#交互示例) · [TablePro example](../reference/table-pro#交互示例) · [Live layout playground](./layout#在线布局实验)
- **Embedded admin demos.** `AdminExample.vue` hosts examples that need the admin layout or application context. `example.html` uses its own bootstrap, restricted example routes, and Pinia instance. Ordinary app cache is in memory, and column visibility uses a separate session storage namespace. [Docs source overview](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/docs/README.md)

<!-- fullstack:start -->

## Optional backend layers {#可选服务端怎样分层}

`apps/server/src/main.ts` starts a standalone NestJS HTTP service. `app.ts` installs the business modules, platform middleware, global response interceptor, and exception filter.

```text
Browser request to /api
  ↓
platform/ ─────────→ Redis
  ↓                  Limits, demo cache
NestJS guards and controllers
  ├─ auth / users / routes
  │  └─ Prisma → PostgreSQL
  └─ demo (when enabled)
     └─ @ray-template/demo-data
```

- `modules/auth/` handles authentication and sessions and installs the global authorization guard. `modules/users/` handles account management and provides department and role options. `modules/routes/` reads, filters, and saves route configuration. Business modules define and validate HTTP data with `api-contracts`.
- `infrastructure/database.ts` wraps Prisma access. The schema and migrations under `prisma/` define users, credentials, grants, sessions, route configuration, and audit records in PostgreSQL. The database is authoritative for sessions and permissions.
- `platform/` owns Redis, request IDs, logs, security middleware, and health checks. Redis provides rate limits and caches selected reconstructible demo reads. Demo endpoints are enabled by deployment configuration and share `demo-data`.

`apps/server` builds independently and ships in the full-stack source distribution. [Server source overview](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/server/README.md) · [Source distributions and startup](./distributions)

<!-- fullstack:end -->

## Shared package responsibilities {#各包负责什么}

Arrows show direct dependencies from the importing shared package to the package it uses. Names in the diagram stand for `@ray-template/<name>`.

```text
admin-shell
├─→ ui ───────┬─→ composables
│             ├─→ icons
│             └─→ utils
├─→ routing ──┬─→ api-contracts
│             ├─→ icons
│             └─→ utils
├─→ composables
└─→ icons

directives ──┬─→ composables
             └─→ utils
composables ───→ utils
http ──────────→ utils
demo-data ─────→ api-contracts
```

`package.json#exports` declares public entry points. Prefer feature imports across workspaces, for example `@ray-template/ui/table-pro` or `@ray-template/utils/precision`. `rayTemplate.runtime` distinguishes `browser`, `server`, and `universal`. `api-contracts` and `demo-data` are universal and can be used by the browser and server. Universal workspaces depend only on other universal workspaces. Applications consume public package entries to assemble features. `pnpm packages:check` validates workspace dependencies, public entries, and cycles. [Package boundary check](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/scripts/check-package-boundaries.mjs)

### UI, layout, and routing {#界面、布局与路由}

- **`@ray-template/admin-shell`** implements layout modes and slot placement in `AdminShell.tsx`. `TopNavigation.tsx`, `ShellTab.tsx`, and `menu-keyboard.ts` support navigation, tabs, and keyboard interaction. `LayoutSettings.tsx` provides layout options and `RouteTransition.vue` handles transitions and cache rendering. The host supplies layout state, menu items, navigation actions, and content. [Shell exports](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/admin-shell/src/index.ts)
- **`@ray-template/routing`** exposes `/contract` to bind host-provided views, reserved paths, and permission rules to serializable config and Vue Router records. It supports exporting records back to JSON. `/expand-routes`, `/order-routes`, and `/navigation` expand and order routes and traverse menu trees. `/schema` and `/json-schema` are compatibility exports backed by `api-contracts`. [Routing exports](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/routing/package.json)
- **`@ray-template/ui`** organizes implementations, types, and styles by component, with entries such as `/table-pro`, `/form`, `/chart`, and `/barcode`. `/theme.css` and `/theme-presets` supply design variables and presets. `/services` connects host themes, translations, notifications, and storage to components. [Component reference](../reference/components)
- **`@ray-template/icons`** groups SVG sources by directory. The generated `/manifest` provides full icon names, types, and group asset URLs. The admin build generates a sprite per group. `RIcon` and route configuration use the same names, such as `navigation/table`. [SVG icons](../reference/icons)

In TablePro, `TablePro.tsx` composes filtering, pagination, queries, and the instance API. `useTableSearch` manages drafts and submitted filters. `useTableRequest` handles remote request status and cancellation. `TablePanel` owns the Naive UI data table, column settings, and tools. The host supplies the query and column preference storage. [TablePro reference](../reference/table-pro) · [Component entry point](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RTablePro/index.ts)

```text
Submit search / Change page
  ↓
TablePro → useTableRequest
  ↓
Host request(params, signal)
  ↓
Current page data + Filtered total
  ↓
TablePanel → Naive UI NDataTable
```

### HTTP, contracts, and demo data {#http、契约与演示数据}

- **`@ray-template/http`** exposes `createHttpClient` in `client.ts` to create an independent Axios instance that returns HTTP response bodies. `RequestCanceler` tracks and clears pending requests. The host chooses the base URL, headers, and interceptors. [HTTP client source](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/http/src/client.ts)
- **`@ray-template/api-contracts`** defines envelopes, sessions, and admin models under `/admin` and demo queries and responses under `/demo`. `routes.ts` is the route schema source. `/route-validation` validates structure, and `/route-json-schema` and `/openapi` generate editor and API integration descriptions. Frontend, mock, and server consumers share the Valibot contracts. [API contract package](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/api-contracts/README.md)
- **`@ray-template/demo-data`** includes default routes in `routes.json`, initial options, charts, orders, people, and helpers for search, filtering, and pagination. Hosts decide when to enable demos and manage their own sessions and writes. [Demo data package](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/demo-data/README.md)

### Hooks, directives, and utilities {#hooks、指令与工具}

- **`@ray-template/composables`** offers Vue lifecycle and element-reference helpers under `/vue`. Feature hooks have their own entries, including `/useDevice`, `/useElementFullscreen`, `/useDomToImage`, and `/usePrint`. Admin-specific navigation, layout, and state hooks live under `apps/admin/src/hooks/template/`. [Hooks reference](../reference/hooks)
- **`@ray-template/directives`** keeps implementations and types by directive under `src/modules/`. Import entries such as `/copy`, `/debounce`, and `/throttle` as needed. Ray Admin's `src/directives/index.ts` registers the directives it uses. [Directives reference](../reference/directives)
- **`@ray-template/utils`** provides precision arithmetic via `/precision` and object, file, and type helpers via `/core`, `/files`, and `/types`. `/storage` reads and writes namespaced JSON through a host-supplied store. The host chooses the storage location and cache keys. [Utilities reference](../reference/utils)

## Build and deploy {#构建与部署}

`pnpm dev` starts Admin and `pnpm docs:dev` starts the docs. `pnpm build` builds Admin, `pnpm docs:build` builds the docs, and `pnpm pages:build` assembles them under `dist/pages`. The hosted application is at `/ray-template/` and the docs are at `/ray-template/docs/`, with English at `/ray-template/docs/en/`. [Build and deployment guide](./tooling)

For a project based on v5, review the compatibility boundaries and adoption process. [Moving from v5 to v6](../migration)
