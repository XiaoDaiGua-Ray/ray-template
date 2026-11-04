# RTransitionComponent

<script setup>
import AdminExample from '../../examples/AdminExample.vue'
</script>

`RTransitionComponent` 是模板的路由出口，组合 `RouterView`、`Transition`、`Suspense` 与 `KeepAlive`。它直接渲染匹配的路由组件，按 `route.fullPath` 标识实例；query 或 hash 的变化也可能换用不同实例。

| 属性                 | 默认       | 说明                                            |
| -------------------- | ---------- | ----------------------------------------------- |
| `transitionPropName` | `'fade'`   | Vue Transition 类名前缀，应与应用已有样式匹配。 |
| `transitionMode`     | `'out-in'` | Vue Transition 模式。                           |
| `transitionAppear`   | `true`     | 首次挂载也应用过渡。                            |

`setting.keepAliveConfig` 控制全局启用、最大数量和排除名称。`KeepAlive.include` 来自 KeepAlive Store，加入队列的页面必须有与路由名一致的组件名。缓存队列的名称会保存到当前标签的 Session Storage，浏览器刷新仍会创建新组件实例。自定义布局插槽时，只在期望的路由层级放一个出口，避免重复渲染；过渡页面使用单根节点。

## 交互示例

<AdminExample path="/multi/multi-menu-one" title="路由过渡和页面缓存" layout />

::: details 查看示例源码
<<< @/../admin/src/views/demo/multi/views/multi-menu-one/index.tsx
:::

```tsx
import { RTransitionComponent } from '@/components'

export const renderPageOutlet = () => (
  <RTransitionComponent transitionPropName="fade" transitionAppear={false} />
)
```

[组件源码](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/admin-shell/src/RouteTransition.vue) · [缓存 Store](../store/navigation#keepalive-store) · [路由缓存排查](../../guide/routing#keepalive-排查)
