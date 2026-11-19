# RSegment

<script setup>
import AdminExample from '../../../examples/AdminExample.vue'
</script>

`RSegment` renders options in Naive UI Tabs' `segment` mode. Use `value` and `onUpdateValue` or `v-model:value` to change business state. For an uncontrolled initial value, use `defaultValue`. Render page content from the selected value in the caller.

Assistive technology receives a radio group. Name it with `aria-label`. Tab focuses the selected option. Left and Right move between options and skip disabled items. Home and End select the first and last enabled options.

| Prop             | Default                  | Description                                                                     |
| ---------------- | ------------------------ | ------------------------------------------------------------------------------- |
| `options`        | `[]`                     | `RSegmentOptions[]`. Each option needs a unique `key`.                          |
| `width`          | `'fitContent'`           | `'block'` fills the width. `'fitContent'` sizes to content. Numbers are pixels. |
| `themeOverrides` | Built-in segment spacing | Caller overrides are shallow-merged with built-in settings.                     |

Each option requires `key: string \| number` and `label` (text, VNode, or a render value). Optional fields include `disabled`, `icon` (VNode or function), `popover` (text or Naive UI Popover options with `label`), and `slots.default`. `displayDirective` exists in the type but is not forwarded to options, so it cannot control panel mounting. The component fixes `type="segment"` and its animation. Tab editing, position, pane styles, and other omitted Tabs props are outside this API.

## Interactive example {#交互示例}

<AdminExample path="/segment" title="Segmented options and width" />

::: details View example source
<<< @/../admin/src/views/demo/segment/index.tsx
:::

```tsx
import { RSegment, type RSegmentOptions } from '@/components'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const selected = ref<string | number>('day')
    const options: RSegmentOptions[] = [
      { key: 'day', label: 'Day', popover: 'View by day' },
      { key: 'week', label: 'Week' },
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

[Implementation](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RSegment/src/Segment.tsx) · [Option types](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RSegment/src/types.ts) · [Omitted Tabs props](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RSegment/src/constant.ts)
