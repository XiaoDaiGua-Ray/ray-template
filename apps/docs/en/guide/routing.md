# Routes, menus, and permissions {#路由、菜单与权限}

<script setup>
import RouteConfigDemo from '../../examples/RouteConfigDemo.vue'
</script>

After sign-in, `GET /admin/route-config` returns the routes available to the session, ordered by `meta.order`. Menus and breadcrumbs use the route tree, and Vue Router registers the expanded page records. The initial mock routes live in `packages/demo-data/src/routes.json`. The shell reserves sign-in, profile, and status pages. The default router uses hashes, for example `/ray-template/#/orders`.

## Validate route configuration {#路由配置交互校验}

Change the path, name, or view ID to see the shared validator's result. This example registers the `overview` view.

<RouteConfigDemo />

::: details View example source
<<< @/examples/RouteConfigDemo.vue
:::

## Edit routes and connect the API {#在线编辑与接口接入}

With `routes:write`, the visual and JSON editors load the complete draft from the editor endpoint and save it with `PUT /admin/route-config`. The runtime routes then reload. Mock writes persist in the current browser, and you can switch to a local or built-in configuration. In standard backend mode, the remote configuration is authoritative and load failures surface as errors. If you configured the read-only `VITE_ROUTE_CONFIG_URL`, select the remote source in the JSON editor and enable the remote configuration to resume reading that URL. Save edits to a read-only source locally or export the draft.

The request body is `{ version: 1, routes: [...] }`. Both read and write results are in `data` in the shared `{ code, msg, data }` envelope. `component` must be a registered ID in `router/config/views.ts`. Register the ID for a new frontend page before returning its route from the API. [Standard backend contract](./backend)

## Common metadata {#常用元数据}

| Field                      | Behavior                                                                                                 |
| -------------------------- | -------------------------------------------------------------------------------------------------------- |
| `i18nKey` / `noLocalTitle` | Use a translation key or a literal menu title.                                                           |
| `icon`                     | Use the full group-qualified icon name. Code-defined routes can also supply a VNode.                     |
| `role`                     | Applies to menus and guards. Role values must use the same type as the session.                          |
| `hidden`, `env`            | Control menu visibility. Route and API access have their own permission checks.                          |
| `sameLevel`                | A detail page can keep the current menu item and tab, adding its level only to the breadcrumb.           |
| `keepAlive`                | Makes the page eligible for caching in the content area.                                                 |
| `windowOpen`               | Opens the configured address when the menu entry is clicked.                                             |
| `ignoreAutoResetScroll`    | Allows the page to retain the content area's scroll position. See the scroll utility for details.        |
| `extra`                    | Text, icon, type, and visibility of menu badges. See [useBadge](../reference/hooks/navigation#usebadge). |

Relative child paths inherit the parent path. Built-in examples group routes by purpose and use absolute paths to preserve existing URLs. [Layout and nested route examples](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/demo-data/src/routes.json)

## Sign-in and roles {#登录和角色}

The default sign-in route is `/`. When a user opens a business page without a session, the guard puts the full destination in the sign-in page's `redirect` parameter. After sign-in, it restores only a registered business URL the current role can still access, including its query and hash. Without a valid destination, it opens `/welcome`. For redirect routes, the menu and guard check permissions on the entry, each hop, and the destination. A hidden menu item may still allow direct navigation. In production, validate the session, permissions, and resource ownership on the backend.

## Empty workspace and status pages {#空工作区和状态页}

`/welcome` represents a workspace with no active business route and displays accessible entry points. It is a shell status page, like `/403`, `/404`, and `/500`. These pages stay outside business menus, tabs, history, and page caching. The shell reserves these four paths, their descendants and aliases, and their route names. Local and remote JSON must leave them available to the shell. A custom source may omit `/dashboard` or give it role restrictions.

All business tabs can be closed, including the former home page and the last open tab. Closing the active tab selects an adjacent tab. Closing the last tab or all tabs opens the empty workspace and releases the corresponding KeepAlive instances. Each concrete pathname has one tab. Query or fragment changes update the full address stored with that tab. A role change removes revoked tabs and cached instances without opening another business page automatically.

- `/403` appears for a signed-in user without access to the requested page. Closing the current page from the tab bar returns to the previous accessible page or an open accessible tab, with the workspace as the fallback.
- `/404` indicates a missing destination. `query.from` retains the original target.
- `/500` indicates route resolution or lazy loading failed. Retry is available when `query.from` still exists and is accessible.

Every status page offers a way back to the workspace. Back and Retry validate the destination as an internal, permitted route before using history or query values. `useAppRoot` and the old `appRootRoute` preference still support compatibility reads and writes. The current startup and navigation flow use the workspace behavior above.

## Troubleshoot KeepAlive {#keepalive-排查}

1. Set `meta.keepAlive: true` and give the route a unique `name`.
2. Match the TSX `defineComponent({ name })` or SFC component name to the route name. Check that the lazy-loaded module exports the intended component.
3. Enter from the menu, change some page state, switch to another tab, and return. Also check closing the tab, direct navigation, and reloading. A browser refresh creates new component instances.
4. If you replace the default layout content slot, provide the routing and caching behavior your application needs.

[Route contract](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/router/README.md) · [Guard implementation](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/router/utils/permission.ts)
