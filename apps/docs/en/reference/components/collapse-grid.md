# RCollapseGrid

<script setup>
import CollapseGridDemo from '../../../examples/CollapseGridDemo.vue'
</script>

Use this component for search forms with several filters. It renders an `NGrid` and requires `NGridItem` children. Configure it with `cols`, `responsive`, `collapsedRows`, `xGap`, and `yGap`. The default gap is 12, and an explicit `0` is preserved.

## Interactive example {#交互示例}

<ClientOnly>
  <CollapseGridDemo />
</ClientOnly>

::: details View example source
<<< @/examples/CollapseGridDemo.vue
:::

| Prop                 | Default                               | Description                                                                  |
| -------------------- | ------------------------------------- | ---------------------------------------------------------------------------- |
| `open`               | `false`                               | Expansion state. `true` expands and `false` collapses.                       |
| `actionSpan`         | `1`                                   | Grid columns occupied by the action area.                                    |
| `actionAlign`        | `'end'`                               | CSS alignment for the actions. Use `auto`, `end`, `center`, or `start`.      |
| `collapseToggleText` | `['展开', '收起']` (Expand, Collapse) | Order is the label shown when collapsed, then the label shown when expanded. |
| `bordered`           | `true`                                | Outer card border.                                                           |

Use `default` for filter fields, `action` for the search action, and `collapse(collapsed)` to replace the toggle. The custom collapse slot receives a boolean. Wire its button to update `open`.

::: tip Controlled state and update events
`onUpdateOpen` and `onUpdate:open` receive the expanded state and work with `v-model:open`. Remove any inversion added for an older reversed event. Binding both listeners invokes each once. The default button supports keyboard activation and exposes state through `aria-expanded`.
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
        collapseToggleText={['Expand', 'Collapse']}
        onUpdateOpen={(value) => {
          open.value = value
        }}
      >
        {{
          default: () => [
            <NGridItem>
              <NInput placeholder="Order number" />
            </NGridItem>,
            <NGridItem>
              <NInput placeholder="Customer" />
            </NGridItem>,
            <NGridItem>
              <NInput placeholder="City" />
            </NGridItem>,
          ],
          action: () => <NButton type="primary">Search</NButton>,
        }}
      </RCollapseGrid>
    )
  },
})
```

[Component implementation](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RCollapseGrid/src/index.tsx) · [Props](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RCollapseGrid/src/props.ts)
