# Navigation and Menus {#导航与菜单}

<script setup>
import AdminExample from '../../../examples/AdminExample.vue'
</script>

Import these APIs from `@/hooks`. See the [routing guide](../../guide/routing) for menu sources, permissions, and route records.

## Interactive example {#交互示例}

<AdminExample path="/template-hooks" title="Navigation, tabs, and badges" focus="useAppNavigation,useSiderBar,useBadge" layout />

::: details View example source
<<< @/../admin/src/views/demo/template-hooks/index.tsx
:::

## useVueRouter

<AdminExample path="/web-hooks" title="Read the route and update query parameters" focus="useVueRouter" />

::: details View the router example source
<<< @/../admin/src/views/demo/hooks/web-hooks.tsx
:::

`useVueRouter()` returns `{ router }`, the template's shared Vue Router instance. Read the current route with `router.currentRoute.value` and use Vue Router's `push`, `replace`, and `back` methods. You can get the instance outside `setup`. Wait for initialization before reading state that depends on route matching.

```ts
import { useVueRouter } from '@/hooks'

export const readQuery = () => useVueRouter().router.currentRoute.value.query
```

## useAppNavigation

`useAppNavigation().navigationTo(target, options?)` accepts these targets.

| Target             | Behavior                                                                                                                                        |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Full path string   | Resolves through Router and preserves dynamic segments, query, and hash. Returns `undefined` if it matches nothing or only the catch-all route. |
| `AppMenuOption`    | Navigates by `fullPath`, preserving parameters and fragments. `query` can override matching query keys.                                         |
| Zero-based integer | Selects an item from the initialized menu. For a parent item, follows first children until it reaches a leaf.                                   |

`NavigationToOptions.isPush` defaults to `true`. Set it to `false` to call `router.replace`. `query` overrides matching parameters in a string path. If navigation starts, the function returns the Router promise. Negative, fractional, nonfinite, and out-of-range indexes are ignored. Route guards still decide the outcome.

```ts
import { useAppNavigation } from '@/hooks'

export function useTableNavigation() {
  const { navigationTo } = useAppNavigation()
  return () =>
    navigationTo('/tables/remote?tab=people', {
      isPush: false,
      query: { tab: 'orders' },
    })
}
```

## useMenu

`useMenu(options?)` wraps Naive UI `NMenu` for standalone menus, local navigation, or selectors. Pass native menu configuration for horizontal or vertical layout, groups, dividers, custom fields, and render functions.

<AdminExample path="/template-hooks" title="Select and expand menu items" focus="useMenu" deferred />

| Return value              | Purpose                                                                                                                |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `menuRef`                 | Component ref to bind to `NMenu`.                                                                                      |
| `menuProps`               | Shallow reactive props to bind directly. Replace `menuProps.options` when loading options asynchronously.              |
| `showOption(key?)`        | Expands the ancestors of an item. Omit the key to expand the current selection's ancestors without changing selection. |
| `deriveResponsiveState()` | Recalculates overflow for a horizontal menu with `responsive`.                                                         |

When you pass `value` or `expandedKeys`, the hook syncs the prop before invoking the original update callback. `value: null` clears selection, and `expandedKeys: []` collapses every group. When omitted, `NMenu` owns the respective state and uses `defaultValue`, `defaultExpandedKeys`, or `defaultExpandAll`. Instance methods are available after mount. After an async options update, await `nextTick()` for the component to receive the data.

```tsx
import { useMenu } from '@/hooks'
import { NButton, NMenu } from 'naive-ui'
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const { menuRef, menuProps, showOption } = useMenu({
      options: [
        { key: 'overview', label: 'Overview' },
        {
          key: 'reports',
          label: 'Reports',
          children: [{ key: 'monthly', label: 'Monthly' }],
        },
      ],
      value: 'monthly',
      expandedKeys: [],
    })

    return () => (
      <>
        <NMenu ref={menuRef} {...menuProps} />
        <NButton onClick={() => showOption()}>Expand selection</NButton>
      </>
    )
  },
})
```

`useAppNavigation` and the route menu store manage workspace navigation. Use `useMenu` for standalone menus and `useMenuKeyboard` for workspace menu keyboard behavior. [Naive UI Menu API](https://www.naiveui.com/en-US/components/menu#API)

<span id="useapproot-兼容接口"></span>

## useAppRoot compatibility API {#useapproot}

This deprecated API reads and writes a legacy preference for existing callers. `getRootRoute`, `getRootPath`, and `getRootName` are computed refs, and `setRootRoute({ name?, path? })` merges its fields. Sign-in destinations, tab protection, and closing all tabs follow the current routing behavior. The empty workspace is always `/welcome`, and startup does not validate a home route. Use Router for explicit navigation in new code.

```ts
import { useVueRouter } from '@/hooks'

export function useOpenWorkspace() {
  const { router } = useVueRouter()
  return () => router.replace('/welcome')
}
```

## useSiderBar

These methods manage workspace tabs. Methods accepting `CloseMenuTag` take a zero-based index, a string matching the tab's `fullPath`, or a tab object.

| Method                                               | Behavior                                                                                                                   |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `getCurrentTagIndex()`                               | Current tab index, or `-1` if absent.                                                                                      |
| `checkCloseLeft(target)` / `checkCloseRight(target)` | Check for closable tabs in the given direction.                                                                            |
| `close(target)`                                      | Close an eligible business tab. Closing the active tab selects a neighbor. Closing the last tab opens the empty workspace. |
| `closeLeft(target)` / `closeRight(target)`           | Close eligible tabs in the given direction. If the active tab closes, select the target.                                   |
| `closeOther(target)`                                 | Retain the target and protected tabs, and activate the target.                                                             |
| `closeAll()`                                         | Close eligible tabs. Prefer the current protected page, then the first protected tab, then `/welcome`.                     |

Handle unsaved-form confirmation in the business workflow before invoking bulk close methods.

```ts
import { useSiderBar } from '@/hooks'

export function useCloseActiveTag() {
  const { close, getCurrentTagIndex } = useSiderBar()
  return () => {
    const index = getCurrentTagIndex()
    if (index >= 0) close(index)
  }
}
```

## useBadge

Use a menu `fullPath` or `AppMenuOption` as the target. `show(target, options?)` merges options and shows the badge. `hidden(target)` hides it while retaining options. `update(target, options)` changes only the supplied fields. A badge is added only when the menu is loaded and the item is found.

`AppMenuExtraOptions` supports `label` (string or number), `i18nLabel` (translation key), `icon` (VNode), `type` (Naive UI Tag type), and `show` (visibility). Maintain translations in both packs when using a translation key.

```ts
import { useBadge } from '@/hooks'

export function useUnreadBadge() {
  const { show, hidden } = useBadge()
  const path = '/tables/remote'
  return (count: number) =>
    count > 0 ? show(path, { label: count, type: 'info' }) : hidden(path)
}
```

[useMenu](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/composables/src/useMenu.ts) · [useAppNavigation](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/hooks/template/useAppNavigation.ts) · [useAppRoot](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/hooks/template/useAppRoot.ts) · [useSiderBar](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/hooks/template/useSiderBar.ts) · [useBadge](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/hooks/template/useBadge.ts) · [useVueRouter](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/hooks/template/useVueRouter.ts)
