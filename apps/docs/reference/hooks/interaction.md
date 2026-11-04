# 分页与右键菜单

<script setup>
import AdminExample from '../../examples/AdminExample.vue'
</script>

## 交互示例

<AdminExample path="/web-hooks" title="分页和右键菜单" focus="usePagination,useContextmenuCoordinate" />

::: details 查看示例源码
<<< @/../admin/src/views/demo/hooks/web-hooks.tsx
:::

## usePagination

`usePagination(callback?, options?)` 返回只读元组 `[pagination, actions]`。`pagination` 是可传给 `NPagination` 或 `NDataTable` 的响应式配置。缺省页码 1、每页 10 条、开启页大小选择器，候选 `[10, 20, 50, 100]`。`options` 接受除主题和原更新回调之外的 Pagination props，另提供 `pageChange(page)`、`pageSizeChange(size)`。

| 方法                                       | 行为                                                                             |
| ------------------------------------------ | -------------------------------------------------------------------------------- |
| `getPage()` / `setPage(page)`              | 读取页码，或更新页码并通知。                                                     |
| `getPageSize()` / `setPageSize(size)`      | 更新每页条数后先回到第 1 页，再通知。                                            |
| `getItemCount()` / `setItemCount(count)`   | 读取或写入条数，无值时读取为 0；写条数不触发请求回调。                           |
| `getPagination()`                          | 读取当前配置对象。                                                               |
| `getCallback()` / `setCallback(callback?)` | 读取、替换或移除通用回调。                                                       |
| `resetPagination()`                        | 页码回到 1，每页条数取第一个 `pageSizes` 的数字或对象 `value`，没有候选则用 10。 |

页码和页大小更新先改状态，再调用通用 `callback`，然后通知对应事件。重置同时调用两个专用事件。远端查询建议只在通用回调发请求，避免两次加载。Hook 不会自动请求或裁剪数据，初始加载由页面负责。`RTablePro` 的 `request` 已管理分页，通常无需再套一层本 Hook。

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

`useContextmenuCoordinate(target, options?)` 接收元素、ref 或 getter。`options` 可以是捕获布尔值、事件监听选项（含 `clickOutside(event)`），或这些值的 ref / getter。内部强制使用 `passive: false`，防止浏览器原生菜单和自定义菜单同时打开。

返回只读 `x`、`y`（视口坐标）、`show` 和 `updateShow(value)`、`stop()`。右键发生后，先关闭旧菜单，再在下一次 Vue 更新写入坐标并打开。普通点击、外部点击会关闭菜单；外部点击回调在关闭后执行。菜单项选择后调用 `updateShow(false)`。`stop()` 停止所有监听并阻止尚未执行的打开操作，作用域销毁时也会清理。

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
        在这里点击鼠标右键
        <NDropdown
          trigger="manual"
          x={x.value}
          y={y.value}
          show={show.value}
          options={[{ key: 'details', label: '详情' }]}
          onSelect={() => updateShow(false)}
          onClickoutside={() => updateShow(false)}
        />
      </div>
    )
  },
})
```

源码：[usePagination](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/composables/src/usePagination.ts) · [useContextmenuCoordinate](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/composables/src/useContextmenuCoordinate.ts)
