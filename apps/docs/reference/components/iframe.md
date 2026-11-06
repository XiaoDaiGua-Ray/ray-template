# RIframe

<script setup>
import AdminExample from '../../examples/AdminExample.vue'
</script>

`RIframe` 封装原生 iframe 和 Naive UI Spin。它适合嵌入允许被加载的页面，页面自身的 CSP、嵌入授权和同源策略仍生效。`load` 事件并不能证明业务内容加载成功。

## 交互示例

<AdminExample path="/iframe" title="嵌入页面和加载状态" />

::: details 查看示例源码
<<< @/../admin/src/views/demo/iframe/index.tsx
:::

```tsx
import { RIframe } from '@/components'

export const renderReport = (url: string) => (
  <RIframe src={url} title="库存报表" height={460} lazy="eager" />
)
```

| 属性                                 | 默认     | 说明                                                       |
| ------------------------------------ | -------- | ---------------------------------------------------------- |
| `src`                                | 必填     | iframe 地址。接收用户输入时应由业务限制可嵌入来源。        |
| `width` / `height`                   | `'100%'` | CSS 尺寸。百分比高度依赖父级。                             |
| `frameborder`                        | `0`      | 模板边框样式变量。                                         |
| `iframeWrapperClass` / `iframeClass` | 无       | 外层容器与原生 iframe 的类名。                             |
| `title` / `name` / `allow`           | 无       | 原生 iframe 属性。`title` 用于辅助技术识别。               |
| `lazy`                               | `true`   | `true` / `'lazy'` 延迟加载，`false` / `'eager'` 主动加载。 |
| `customSpinProps`                    | `{}`     | NSpin 配置，`show` 由组件内状态覆盖。                      |

`onSuccess(iframe, event)` 和 `onError(event)` 支持函数或回调数组。每次 `src` 变化都会重新显示 Spin，在 `load` / `error` 后关闭。组件 ref 上的 `iframe` 和兼容别名 `iframeInst` 都是原生 DOM 元素（尚未挂载时为 `null`）；Vue 已自动解包，无需再访问 `.value`。额外插槽交给 Spin，但默认内容始终为 iframe。

[组件实现](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RIframe/src/Iframe.tsx) · [Props](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RIframe/src/props.ts)
