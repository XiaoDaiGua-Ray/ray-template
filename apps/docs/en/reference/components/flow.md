# RFlow and useFlow {#rflow-与-useflow}

<script setup>
import AdminExample from '../../../examples/AdminExample.vue'
</script>

`RFlow` creates LogicFlow in its own DOM container. `FlowGraphData` has optional `nodes` and `edges` arrays. Both `NodeConfig` and `EdgeConfig` require stable IDs, and edge sources and targets must reference existing nodes.

## Interactive example {#交互示例}

<AdminExample path="/flow" title="Flow diagram and read-only mode" />

::: details View example source
<<< @/../admin/src/views/demo/flow-demo.tsx
:::

```tsx
import { RFlow } from '@/components'
import type LogicFlow from '@logicflow/core'
import { defineComponent } from 'vue'

const graph = {
  nodes: [
    { id: 'start', type: 'rect', x: 100, y: 90, text: 'Start' },
    { id: 'review', type: 'rect', x: 300, y: 90, text: 'Review' },
  ],
  edges: [
    {
      id: 'start-review',
      type: 'polyline',
      sourceNodeId: 'start',
      targetNodeId: 'review',
    },
  ],
} satisfies Parameters<LogicFlow['render']>[0]

export default defineComponent({
  setup: () => () => (
    <RFlow
      height={240}
      readonly
      onRegister={(instance) => instance.render(graph)}
    />
  ),
})
```

| Prop                   | Default                                | Description                                                                                                                                                 |
| ---------------------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `width` / `height`     | `'100%'`                               | Container dimensions. Give it a resolvable height.                                                                                                          |
| `data`                 | None                                   | Renders on mount and when the reference changes. Setting it to `undefined` clears the graph. In-place nested mutation does not redraw it.                   |
| `watchData`            | `true`                                 | Watches the supplied data. Disable it for instance-controlled rendering.                                                                                    |
| `readonly`             | `false`                                | Enables LogicFlow silent mode. Leaving restores the prior interaction and keyboard settings, including anything the caller disabled.                        |
| `options`              | Grid on, `partial: false`, keyboard on | LogicFlow setup for size, background, keyboard, edges, interaction, history, and plugins. The component owns `container`.                                   |
| `use`                  | None                                   | Registers the component's LogicFlow global plugins before initialization. LogicFlow deduplicates by name. Use `options.plugins` for instance-level plugins. |
| `onRegister(instance)` | None                                   | Provides LogicFlow after mount. Accepts one callback or an array.                                                                                           |

`FlowOptions` groups these fields by purpose.

- Canvas and layout include `width`, `height`, `background`, `grid`, `partial`, `style`, and `overlapMode`.
- Interaction includes `keyboard`, `adjustEdge`, `allowRotate`, `allowResize`, `isSilentMode`, `stopScrollGraph`, `stopZoomGraph`, `stopMoveGraph`, `textEdit`, `textMode`, `edgeTextMode`, `nodeTextMode`, and `guards`.
- Edges and rendering include `edgeType`, `customTrajectory`, `animation`, `history`, `outline`, and `snapline`.
- Extensions include `plugins`, `pluginsOptions`, `disabledPlugins`, `disabledTools`, `idGenerator`, and `edgeGenerator`.

Use `FlowGraphData` for the wrapper's props. For direct calls to `instance.render`, use `Parameters<LogicFlow['render']>[0]` to retain LogicFlow's required node types, coordinates, and connection fields.

`useFlow()` returns `[register, { getFlowInstance }]`. Pass `register` to `onRegister` and supply initial data through `data`. Calling `getFlowInstance()` before registration or after unmount throws. The component destroys the LogicFlow instance on unmount. Use that instance for programmatic editing, imports, and listeners, and clean up external resources you create.

[Implementation](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RFlow/src/Flow.tsx) · [Graph and option types](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RFlow/src/types.ts) · [Instance hook](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RFlow/src/hooks/useFlow.ts)
