# Pagination and Context Menus {#分页与右键菜单}

<script setup>
import AdminExample from '../../../examples/AdminExample.vue'
</script>

## Interactive example {#交互示例}

<AdminExample path="/web-hooks" title="Pagination and context menus" focus="usePagination,useContextmenuCoordinate" />

::: details View example source
<<< @/../admin/src/views/demo/hooks/web-hooks.tsx
:::

## usePagination

`usePagination(callback?, options?)` returns a read-only `[pagination, actions]` tuple. `pagination` is reactive configuration for `NPagination` or `NDataTable`. Defaults are page 1, 10 rows per page, and a page-size control with `[10, 20, 50, 100]`. `options` accepts Pagination props except theme and native update callbacks, and adds `pageChange(page)` and `pageSizeChange(size)`.

| Method                                     | Behavior                                                                                               |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `getPage()` / `setPage(page)`              | Read the page, or update it and notify callbacks.                                                      |
| `getPageSize()` / `setPageSize(size)`      | Updating size resets to page 1 before notifying callbacks.                                             |
| `getItemCount()` / `setItemCount(count)`   | Read or write the count. A missing count reads as 0. Setting it leaves request callbacks idle.         |
| `getPagination()`                          | Read the current configuration object.                                                                 |
| `getCallback()` / `setCallback(callback?)` | Read, replace, or remove the shared callback.                                                          |
| `resetPagination()`                        | Returns to page 1. Uses the first `pageSizes` number or object `value`, or 10 if there are no choices. |

Page and page-size changes update state, call the shared `callback`, and then the corresponding specific callback. Reset reads current `pagination.value.pageSizes` and calls both specific callbacks. Default size arrays are independent per instance. For remote data, issue the request only in the shared callback to avoid duplicate loads. The page owns initial loading, data fetching, and row slicing. `RTablePro` already manages pagination when you pass `request`.

```ts
import { usePagination } from '@/hooks'

export function useOrdersPagination(
  load: (page: number, size: number) => void,
) {
  const [pagination, actions] = usePagination(
    () => load(actions.getPage(), actions.getPageSize()),
    { pageSizes: [10, 20, 50], itemCount: 0 },
  )
  return { pagination, actions, loadFirstPage: () => actions.setPage(1) }
}
```

## useContextmenuCoordinate

`useContextmenuCoordinate(target, options?)` takes an element, ref, or getter. `options` can be a capture boolean, listener options including `clickOutside(event)`, or a ref or getter for either. The listener uses `passive: false` to suppress the browser context menu.

It returns read-only `x` and `y` viewport coordinates, `show`, `updateShow(value)`, and `stop()`. Right-click closes the old menu first, then writes coordinates and opens the menu on the next Vue update. A regular click or outside click closes it. The outside-click callback runs after closing. Call `updateShow(false)` when selecting an item. `stop()` removes listeners and cancels any queued open. The scope also cleans up on disposal.

```tsx
import { useContextmenuCoordinate } from '@/hooks'
import { NDropdown } from 'naive-ui'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const area = ref<HTMLElement>()
    const { x, y, show, updateShow } = useContextmenuCoordinate(area)
    return () => (
      <div ref={area}>
        Right-click here
        <NDropdown
          trigger="manual"
          x={x.value}
          y={y.value}
          show={show.value}
          options={[{ key: 'details', label: 'Details' }]}
          onSelect={() => updateShow(false)}
          onClickoutside={() => updateShow(false)}
        />
      </div>
    )
  },
})
```

[usePagination source](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/composables/src/usePagination.ts) · [useContextmenuCoordinate source](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/composables/src/useContextmenuCoordinate.ts)
