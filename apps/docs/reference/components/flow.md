# RFlow 与 useFlow

<script setup>
import AdminExample from '../../examples/AdminExample.vue'
</script>

`RFlow` 在自己的 DOM 容器中建立 LogicFlow。图数据用 `FlowGraphData` 表示，`nodes` 和 `edges` 为可选数组；`NodeConfig`、`EdgeConfig` 都要求稳定的 `id`，边的源和目标需指向存在的节点。

## 交互示例

<AdminExample path="/flow" title="流程图和只读切换" />

::: details 查看示例源码
<<< @/../admin/src/views/demo/flow-demo.tsx
:::

```tsx
import { RFlow } from '@/components'
import type LogicFlow from '@logicflow/core'
import { defineComponent } from 'vue'

const graph = {
  nodes: [
    { id: 'start', type: 'rect', x: 100, y: 90, text: '发起' },
    { id: 'review', type: 'rect', x: 300, y: 90, text: '审核' },
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

| 属性                   | 默认                             | 说明                                                                                                  |
| ---------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `width` / `height`     | `'100%'`                         | 容器尺寸，需要可计算的高度。                                                                          |
| `data`                 | 无                               | 首次挂载和后续引用变化时渲染，清空为 `undefined` 时恢复空图；嵌套原地修改不触发。                     |
| `watchData`            | `true`                           | 是否监听传入数据。关闭后可从实例控制重绘。                                                            |
| `readonly`             | `false`                          | 启用 LogicFlow 静默模式；退出时恢复进入前的交互和键盘配置，不会强行打开调用方禁用的能力。             |
| `options`              | 网格开、`partial: false`、键盘开 | LogicFlow 初始化配置，包括尺寸、背景、键盘、边、交互、历史和插件等。`container` 由组件管理。          |
| `use`                  | 无                               | 每个组件初始化前注册自己的 LogicFlow 全局插件列表，由库按名称去重。实例级插件可用 `options.plugins`。 |
| `onRegister(instance)` | 无                               | 挂载后取得 LogicFlow，支持回调数组。                                                                  |

`FlowOptions` 支持的字段按用途分组：

- 画布与布局：`width`、`height`、`background`、`grid`、`partial`、`style`、`overlapMode`。
- 交互：`keyboard`、`adjustEdge`、`allowRotate`、`allowResize`、`isSilentMode`、`stopScrollGraph`、`stopZoomGraph`、`stopMoveGraph`、`textEdit`、`textMode`、`edgeTextMode`、`nodeTextMode`、`guards`。
- 边和渲染：`edgeType`、`customTrajectory`、`animation`、`history`、`outline`、`snapline`。
- 扩展：`plugins`、`pluginsOptions`、`disabledPlugins`、`disabledTools`、`idGenerator`、`edgeGenerator`。

`FlowGraphData` 用于包装组件的 Props。直接调用底层 `instance.render` 时，使用 `Parameters<LogicFlow['render']>[0]` 保留 LogicFlow 所要求的节点类型、坐标和连线字段。

`useFlow()` 返回 `[register, { getFlowInstance }]`，将 `register` 传给 `onRegister`。首次图数据可直接通过 `data` 提供；注册之前或组件卸载后调用 `getFlowInstance()` 会抛错。组件卸载时销毁 LogicFlow 实例；程序化编辑、导入和事件监听走该实例，接入方仍需清理自己创建的外部资源。

[组件实现](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RFlow/src/Flow.tsx) · [图和选项类型](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RFlow/src/types.ts) · [实例 Hook](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RFlow/src/hooks/useFlow.ts)
