# Component conventions

Organize reusable components by name under `src/components`. Import components and types through `@/components`. Prefer Naive UI and existing project components. Do not duplicate component introductions before `defineComponent`.

## Non-obvious usage constraints

- `RCollapseGrid` uses Naive UI Grid; its children must be `NGridItem`. Do not substitute ordinary containers for grid items.
- `RChart` and `useChart` own instance initialization, disposal, sizing, and theme synchronization. Callers own ECharts options and register required chart types/components through the established ECharts mechanism.
- `PageResult` uses Naive UI Result and can serve as a component or error page. Preserve inherited props and slots.
- [TablePro](RTablePro/README.md) supports plain tables, search, pagination, and auto-height. Column ordering operates on first-level columns; nested columns follow their root column.
- `RIcon.name` uses generated full group-path types. Development, HMR, and builds synchronize icon changes; do not edit generated manifests manually.

Component styles load with their entry points. Scope changes to Naive UI internals using the current component's class. When a component must fill its container, declare dimensions at the call site or within the component. Fullscreen `RModal` card content scrolls only on overflow; `RBarcode` loading regions follow barcode dimensions or responsive containers.

Custom styles follow the [CSS token, scope, and responsive-sizing contract](../../../../docs/ui-design.md#custom-css). Admin components inherit the existing providers; standalone shared-package consumers use the [public host example](../../../../apps/docs/examples/ThemeScopeExample.vue) instead of importing application stores or writing global theme variables.

Examples are in `src/views/demo`. Independent hook interactions and lifecycle conventions are in the [hook guide](../hooks/README.md). Follow the [comment style](../../../../docs/comment-style.md) when adding/editing comments; put complete tutorials in READMEs and demo pages.
