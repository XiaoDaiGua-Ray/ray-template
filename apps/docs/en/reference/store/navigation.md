# Menu and KeepAlive Stores {#menu-与-keepalive-store}

## Menu Store

Route modules become a menu tree. Menu Store coordinates selection, tabs, breadcrumbs, and navigation. Pages typically use [useAppNavigation](../hooks/navigation#useappnavigation) or [useSiderBar](../hooks/navigation#usesiderbar).

| Getter                 | Computed value                                                                   |
| ---------------------- | -------------------------------------------------------------------------------- |
| `getMenuOptions`       | Application menu tree and its children. Rendering also considers route metadata. |
| `getBreadcrumbOptions` | Current breadcrumb items.                                                        |
| `getMenuKey`           | Current menu key, usually a full path.                                           |
| `getMenuTagOptions`    | Workspace tabs.                                                                  |
| `getCurrentMenuOption` | Active menu item, possibly missing initially.                                    |
| `getCollapsed`         | Whether the sidebar is collapsed.                                                |

| Action                                        | Behavior                                                                                                                                      |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `setupAppMenu()`                              | Rebuilds menus, tabs, and titles from known routes and returns `Promise<void>`. The first route synchronization initializes it.               |
| `resolveOption(option)`                       | Converts a route-shaped option into a menu item. Supply the correct `fullPath` for its key and lookup.                                        |
| `changeMenuModelValue(key, option, query?)`   | Navigates and syncs state. `meta.windowOpen` opens an external page. `sameLevel` preserves the original menu and tab and extends breadcrumbs. |
| `collapsedMenu(collapsed)`                    | Updates collapsed state.                                                                                                                      |
| `setMenuTagOptions(options, isAppend = true)` | Appends or replaces tabs from one item or an array.                                                                                           |
| `spliceMenTagOptions(idx, length = 1)`        | Removes tabs by index. The historical spelling is retained.                                                                                   |
| `updateMenuState(key, value, callback?)`      | Updates an existing field and shallow-merges plain objects. Use the other actions for coordinated changes.                                    |

`depthSearchAppMenu(options, key)` finds a menu item by full path. Use Router or `navigationTo` to await guards because `changeMenuModelValue` returns no navigation promise. After role changes, keep backend authorization and direct route access in sync with the menu.

`piniaMenuStore` persists `collapsed` in Local Storage. Tabs are stored under `appMenuTagOptions` in Session Storage with their order and optional `topped` and `fixed` flags. Refresh restores only routes that still exist and are accessible. Current route changes update menu selection and breadcrumbs.

## KeepAlive Store

`useKeepAliveGetters().getKeepAliveInclude` is a computed list of cached component names. `useKeepAliveActions()` provides `getKeepAliveInclude()` to read the list and `setKeepAliveInclude(option)` to add names from route options. It processes pages with `meta.keepAlive`. Access moves a name to the newest position, and the list is trimmed to the configured capacity. [RTransitionComponent](../components/route-transition) renders the actual cache.

- Match each route `name` to the page component name so `include` can match it.
- Store names survive refresh in the current tab's Session Storage. Component instances and form state are recreated.
- Configure enablement, excluded names, and capacity in [Setting Store](./setting)'s `keepAliveConfig`. Check nested routes and query changes before testing a return to a cached tab.

```ts
import { useKeepAliveGetters, useMenuGetters } from '@/store'

export function useNavigationSummary() {
  const { getMenuKey, getMenuTagOptions } = useMenuGetters()
  const { getKeepAliveInclude } = useKeepAliveGetters()
  return { getMenuKey, getMenuTagOptions, getKeepAliveInclude }
}
```

[Menu implementation](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/store/modules/menu/index.ts) · [Menu hooks](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/store/hooks/useMenuStore.ts) · [KeepAlive implementation](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/store/modules/keep-alive/index.ts)
