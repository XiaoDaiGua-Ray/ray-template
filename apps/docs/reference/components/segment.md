# RSegment

<script setup>
import AdminExample from '../../examples/AdminExample.vue'
</script>

`RSegment` 用 Naive UI Tabs 的 `segment` 模式渲染选项。通过 `value` 和 `onUpdateValue`（或 `v-model:value`）切换业务状态，`defaultValue` 可提供非受控初值。页面内容由调用方根据值渲染。

| 属性             | 默认           | 说明                                                |
| ---------------- | -------------- | --------------------------------------------------- |
| `options`        | `[]`           | `RSegmentOptions[]`，每个选项的 `key` 需唯一。      |
| `width`          | `'fitContent'` | `'block'` 占满、`'fitContent'` 按内容、数字按像素。 |
| `themeOverrides` | 内置分段间距   | 业务覆盖与内置配置浅合并。                          |

每项必填 `key: string \| number`、`label`（文本、VNode 或渲染类型）。可用 `disabled`、`icon`（VNode 或函数）、`popover`（文本或含 `label` 的 Naive UI Popover 配置）、`slots.default`。虽然类型提供 `displayDirective`，当前实现没有把该字段传给选项，不能用它控制面板挂载。组件固定 `type="segment"` 与动画，不支持 Tabs 的增删页签、位置、Pane 样式等被排除字段。

## 交互示例

<AdminExample path="/segment" title="分段选项和宽度" />

::: details 查看示例源码
<<< @/../admin/src/views/demo/segment/index.tsx
:::

```tsx
import { RSegment, type RSegmentOptions } from '@/components'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const selected = ref<string | number>('day')
    const options: RSegmentOptions[] = [
      { key: 'day', label: '日', popover: '按日查看' },
      { key: 'week', label: '周' },
    ]
    return () => (
      <RSegment
        options={options}
        value={selected.value}
        onUpdateValue={(value) => {
          selected.value = value
        }}
      />
    )
  },
})
```

[组件实现](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RSegment/src/Segment.tsx) · [选项类型](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RSegment/src/types.ts) · [不支持的 Tabs 属性](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RSegment/src/constant.ts)
