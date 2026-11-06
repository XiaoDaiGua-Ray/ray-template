# RDraggableCard

<script setup>
import AdminExample from '../../examples/AdminExample.vue'
</script>

基于 Naive UI Card 和 Interact.js。卡片 Teleport 到应用创建的容器，不参加原父节点的普通布局流。设置标题后可拖动卡片头部，否则拖动内容区；组件没有开放改变尺寸的交互。

| 属性                  | 默认                      | 说明                                                                |
| --------------------- | ------------------------- | ------------------------------------------------------------------- |
| `dad`                 | `true`                    | 是否启用拖拽。                                                      |
| `restrictionElement`  | `'body'`                  | 拖动边界，支持 CSS 选择器、元素或可解包的目标；选择器取第一个匹配。 |
| `restrictRectOptions` | 默认边界，`endOnly: true` | 覆盖 Interact.js 边界限制。                                         |
| `defaultPosition`     | `{ x: 0, y: 0 }`          | 相对限制容器的偏移，或预设位置。                                    |
| `padding`             | 无                        | 初次定位时相对边界的 `{ x, y }` 间距。                              |
| `width` / `zIndex`    | `600` / 无                | 卡片宽度与层级。                                                    |
| `animation`           | `false`                   | 启用进场过渡。                                                      |

位置可用 `top-left`、`top-right`、`bottom-left`、`bottom-right`、`center`、`top-center`、`bottom-center`。替换 `defaultPosition`、`padding` 或边界引用会触发重定位，开关 `dad` 保留当前位置；没有公开拖拽事件或位置持久化。选择器需要在布局中真实存在，容器应有明确尺寸。服务端不创建拖拽 DOM；浏览器挂载后建立交互，关闭拖拽或卸载时释放监听器，最后一个卡片卸载后移除共享容器。继承 Card 属性和插槽，进场动画尊重减少动态效果设置。

## 交互示例

<AdminExample path="/draggable-card" title="拖拽卡片和移动边界" />

::: details 查看示例源码
<<< @/../admin/src/views/demo/draggable-card.tsx
:::

```tsx
import { RDraggableCard } from '@/components'

export const renderFloatingHelp = () => (
  <RDraggableCard
    title="帮助"
    width={320}
    defaultPosition="bottom-right"
    padding={{ x: 24, y: 24 }}
  >
    拖动标题可移动此卡片
  </RDraggableCard>
)
```

[组件源码](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RDraggableCard/DraggableCard.tsx)
