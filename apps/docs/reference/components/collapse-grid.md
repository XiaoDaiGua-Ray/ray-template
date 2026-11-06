# RCollapseGrid

<script setup>
import CollapseGridDemo from '../../examples/CollapseGridDemo.vue'
</script>

适合有多个条件的搜索表单。底层用 `NGrid` 渲染，子项必须是 `NGridItem`。使用 `cols`、`responsive`、`collapsedRows`、`xGap` 和 `yGap` 配置网格；未指定间距时回退到 12，传 `0` 保留零间距。

## 交互示例

<ClientOnly>
  <CollapseGridDemo />
</ClientOnly>

::: details 查看示例源码
<<< @/examples/CollapseGridDemo.vue
:::

| 属性                 | 默认               | 说明                                                       |
| -------------------- | ------------------ | ---------------------------------------------------------- |
| `open`               | `false`            | 展开状态，`true` 表示展开，`false` 表示收起。              |
| `actionSpan`         | `1`                | 操作区占用的网格列数。                                     |
| `actionAlign`        | `'end'`            | 操作区 CSS 对齐值，可用 `auto`、`end`、`center`、`start`。 |
| `collapseToggleText` | `['展开', '收起']` | 两个位置依次对应收起时和展开时显示的按钮文案。             |
| `bordered`           | `true`             | 外层卡片边框。                                             |

`default` 渲染筛选项，`action` 渲染查询按钮，`collapse(collapsed)` 可替换展开按钮。自定义折叠插槽只收到布尔值，需要自行绑定按钮并修改 `open`。

::: tip 受控状态与更新事件
`onUpdateOpen` 和 `onUpdate:open` 回传展开状态，可直接绑定 `v-model:open`。旧版接入中为修正事件反向而添加的取反处理应删除。两个监听器同时绑定会各调用一次。默认切换按钮支持键盘，并通过 `aria-expanded` 表示当前状态。
:::

```tsx
import { RCollapseGrid } from '@/components'
import { NButton, NGridItem, NInput } from 'naive-ui'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const open = ref(false)
    return () => (
      <RCollapseGrid
        open={open.value}
        cols={3}
        collapsedRows={1}
        onUpdateOpen={(value) => {
          open.value = value
        }}
      >
        {{
          default: () => [
            <NGridItem>
              <NInput placeholder="订单号" />
            </NGridItem>,
            <NGridItem>
              <NInput placeholder="客户" />
            </NGridItem>,
            <NGridItem>
              <NInput placeholder="城市" />
            </NGridItem>,
          ],
          action: () => <NButton type="primary">查询</NButton>,
        }}
      </RCollapseGrid>
    )
  },
})
```

[组件实现](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RCollapseGrid/src/index.tsx) · [Props](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RCollapseGrid/src/props.ts)
