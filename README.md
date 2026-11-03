# Ray Template · Vue 3 Admin Dashboard Template

[简体中文](README.zh-CN.md) · **[Live demo](https://xiaodaigua-ray.github.io/ray-template/)** · **[Documentation](https://xiaodaigua-ray.github.io/ray-template-doc/)** · [Quick start](#quick-start)

Ray Template is an **open-source, ready-to-run frontend template** for admin dashboards, back-office tools, and internal apps. Run the demo to try a workspace with role-based menus and page tabs, then reuse TablePro list pages, workspace layouts, and route modules in your own app.

**Stack**: Vue 3 · TypeScript / TSX · Naive UI · Vue Router · Pinia · Vue I18n · Vite / Rolldown · Axios · Vitest

[![Ray Template's TablePro people directory with search, pagination, column settings, and sidebar navigation](docs/assets/tablepro-preview.jpg)](https://xiaodaigua-ray.github.io/ray-template/)

Sign in with the prefilled form. Open **Tables → Remote search and pagination** to try the list shown above, or **Layout playground** to experiment with the workspace.

## Core features

### TablePro for simple tables and data-heavy pages

Use `RTablePro` with `bare` for a plain table, or add search, pagination, and a toolbar for a full list page. Column definitions, selection, sorting, and custom cells follow Naive UI DataTable.

- **Search and pagination**: Pass local `data` or a `request(params, signal)` function that returns `{ data, total }`. Remote queries accept only the latest result. A failed query keeps existing rows visible and lets users retry.
- **Long lists and column controls**: Fill the available workspace and use virtual scrolling for large lists. Users can show, hide, reorder, or pin columns. Set `columnStateKey` to remember hidden columns across reloads.
- **CSV and printing**: Export or print the current page's visible data columns by default. Point printing at a custom region for documents that need their own layout.

[TablePro API and data contract](src/components/RTablePro/README.md)

### A configurable workspace

Switch between sidebar, top, and mixed navigation. Narrow screens use a menu drawer. The workspace supports fixed or fluid width, a pinned header and footer, and a maximized content area. Pinia saves layout preferences. Try changes live in the layout playground or use named slots to replace the header, sidebar, tabs, and footer.

Page tabs keep multiple tasks open, and breadcrumbs show where you are. Find menu items with `⌘/Ctrl + K`, and switch between light and dark themes or English and Simplified Chinese.

[Layout playground source](src/views/demo/layout-demo.tsx) · [Layout configuration and slots](src/layout/README.md)

### Route modules connect pages, menus, and permissions

Declare a page in `src/router/modules` to generate its navigation and breadcrumbs. Route metadata controls menu labels and icons, roles, visibility, and `keepAlive`. Detail pages can extend the breadcrumb while keeping the current menu and tab. Role checks cover both menu filtering and direct navigation. Connect your backend to validate sessions and authorize API requests.

[Routing guide](src/router/README.md) · [Nested navigation and caching example](src/router/modules/demo/multi-menu.ts)

### Reusable components, composables, and SVG icons

- **Components**: Start with `RForm` and `RModal` for forms and dialogs. `RChart` manages ECharts initialization, resizing, and theme changes. The demo also includes LogicFlow diagrams, barcodes, and draggable cards. [Component guide](src/components/README.md)
- **Composables**: Template hooks cover page refresh, content maximization, menu badges, and watermarks. Web hooks demonstrate screenshots, printing, and element fullscreen. The examples include expandable usage code. [Composables and examples](src/hooks/README.md)
- **SVG icons**: Add an SVG to a group under `src/icons` to generate typed names and sprites. Routes and `RIcon` share names such as `navigation/dashboard`. The icon gallery lets you browse by group and copy TSX usage. [SVG icon workflow](src/icons/A_README.md)

## Quick start

Use the pinned **Node.js 26.13.0** and **pnpm 12.16.1**. With nvm:

```sh
git clone https://github.com/XiaoDaiGua-Ray/ray-template.git
cd ray-template
nvm install
nvm use
npm install --global pnpm@12.16.1
pnpm install --frozen-lockfile
pnpm dev
```

Open [http://127.0.0.1:9527/ray-template/](http://127.0.0.1:9527/ray-template/) or use the URL printed by Vite. The prefilled demo sign-in and mock data let you run the template before connecting a backend.

## Project structure

```text
.
├── src/
│   ├── main.ts              # Bootstraps the app, router, state, and i18n
│   ├── App.tsx              # Root component with global providers and layout
│   ├── views/               # Sign-in, dashboard, business pages, and demos
│   │   └── demo/            # TablePro, layout playground, and hook examples
│   ├── router/
│   │   └── modules/         # Page routes, menu metadata, and roles
│   ├── layout/              # Navigation, page tabs, breadcrumbs, and content
│   ├── components/          # Shared UI exported through @/components
│   ├── app-components/      # App-specific UI and global providers
│   ├── api/                 # API functions grouped by feature
│   ├── axios/               # HTTP client, interceptors, and cancellation
│   ├── store/               # Pinia modules and access methods
│   ├── hooks/               # Template, component, and browser composables
│   ├── app-config/          # App, routing, theme, and language settings
│   ├── locales/             # English and Simplified Chinese messages
│   ├── icons/               # Grouped SVG sources and generated manifest
│   ├── styles/              # Global styles, design tokens, and theme overrides
│   ├── directives/          # Global Vue directives
│   ├── types/               # Shared types and declarations
│   ├── utils/               # Shared utility functions
│   └── demo-data/           # Sample data for mock APIs and the static demo
├── mock/                    # Mock endpoints for local development
├── public/                  # Static assets copied into the build as is
├── vite-helper/             # Build helpers for icons, CDN, and SEO
├── vite.config.ts           # Vite entry for development and builds
├── vite.custom.config.ts    # Deployment base, dev proxy, and build options
├── tsconfig.json            # References the app, Node, and test TS projects
├── package.json             # Dependencies, runtime versions, and commands
├── scripts/                 # Environment checks and icon generation
├── __test__/                # Vitest suites and test utilities
├── harness/                 # Task scopes, targeted checks, and report generation
├── .github/workflows/       # CI checks and GitHub Pages deployment
└── docs/                    # Architecture, design, and engineering conventions
```

See the [architecture map](docs/architecture.md) for how these modules work together.

## Build your first business page

This small people directory uses the template's mock query function. To adapt it for orders or inventory, replace the columns, search fields, and request function.

```tsx
import { getPersonList } from '@/api/demo/mock/person'
import { RTablePro } from '@/components'
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return () => (
      <RTablePro
        columns={[
          { title: 'Name', key: 'name' },
          { title: 'Email', key: 'email' },
        ]}
        request={getPersonList}
        search={[{ key: 'name', label: 'Name' }]}
        columnStateKey="demo:people"
      />
    )
  },
})
```

1. **Build the view.** Add a page in `src/views`. The [remote table example](src/views/demo/tables/remote.tsx) shows sorting, row selection, and toolbar actions.
2. **Connect navigation.** Add a route in `src/router/modules` and give its menu entry English and Simplified Chinese labels. Follow the [routing guide](src/router/README.md) when setting up page caching.
3. **Connect your data.** Define your API in `src/api`, use `src/axios` for interceptors and request cancellation, and connect your real sign-in and session. The people directory uses a mock HTTP endpoint in development and sample data in the static preview. [Request layer guide](src/axios/README.md)

## Checks, builds, and deployment

| Command                       | What it does                                                                                |
| ----------------------------- | ------------------------------------------------------------------------------------------- |
| `pnpm test:run`               | Run the Vitest suite                                                                        |
| `pnpm check`                  | Run the same checks as CI, including types, lint, formatting, tests, and a production build |
| `pnpm harness context`        | Find entry points and checks for areas such as routing, UI, and APIs                        |
| `pnpm harness verify`         | Run the full check and save a local report, or pass a scope to run targeted checks          |
| `pnpm build` / `pnpm preview` | Build into `dist/production` or serve the build locally                                     |

Use the [architecture map](docs/architecture.md) to find module and configuration entry points. See the [deployment guide](docs/architecture.md#deployment-and-search-discovery) for root or subpath hosting and search metadata. Contributors and coding agents share the instructions in [AGENTS.md](AGENTS.md) and the [AI Harness](harness/README.md).

[MIT License](LICENSE) · [Changelog](CHANGELOG.md) · [Issues](https://github.com/XiaoDaiGua-Ray/ray-template/issues)
