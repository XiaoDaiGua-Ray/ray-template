# RChart 与 useChart

`RChart` 接收 ECharts options，负责创建实例、更新主题、监听尺寸与清理。需要确定的容器高度；`height="100%"` 依赖父元素的高度。图表数据和 series 配置由页面管理。

```tsx
import { RChart, useChart } from '@/components'
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const [register] = useChart()
    return () => (
      <RChart
        onRegister={register}
        preset="card"
        title="周订单量"
        height={300}
        options={{
          xAxis: { type: 'category', data: ['周一', '周二', '周三'] },
          yAxis: { type: 'value' },
          series: [{ type: 'bar', data: [12, 19, 14] }],
        }}
      />
    )
  },
})
```

## 渲染、主题与更新

| 属性                                                 | 默认                                                                    | 说明                                                                                                            |
| ---------------------------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `options`                                            | `{}`                                                                    | ECharts 配置。`showAria` 默认 `false`，模板会写入 `aria.enabled` 和 `aria.decal.show`。                         |
| `width` / `height`                                   | `'100%'`                                                                | CSS 尺寸，数字按像素。                                                                                          |
| `use`                                                | `[]`                                                                    | 额外 ECharts 注册项。内置柱、线、饼、K 线、散点、象形柱、Canvas，以及标题、提示、网格、数据集、图例等基础模块。 |
| `intersectionObserver`                               | `true`                                                                  | 进入观察范围后挂载图表；隐藏区域的实例可能尚不可用。                                                            |
| `intersectionObserverTarget` / `intersectionOptions` | 容器 / `{ threshold: 0.1 }`                                             | 自定义观察目标与参数。                                                                                          |
| `autoResize` / `autoResizeObserverTarget`            | `true` / 外层容器                                                       | 容器尺寸变化后节流 resize。                                                                                     |
| `watchOptions` / `watchDeep`                         | `true` / `true`                                                         | 是否订阅 options，是否深层观察。                                                                                |
| `watchOptionsThrottleWait`                           | `500`                                                                   | options 更新节流间隔（毫秒）。                                                                                  |
| `nextTick`                                           | `true`                                                                  | 初始化前等待 Vue 更新。                                                                                         |
| `setChartOptions`                                    | `{ notMerge: true, lazyUpdate: true, silent: false, replaceMerge: [] }` | ECharts `setOption` 的控制参数。                                                                                |
| `theme` / `autoChangeTheme`                          | `null` / `true`                                                         | 默认用应用的 ECharts 主题及暗色变体。固定主题请传注册后的主题名。                                               |
| `loading` / `loadingOptions`                         | `false` / 模板加载样式                                                  | 是否显示 ECharts 加载层及参数。                                                                                 |

Provider 指定主题时优先。当前实现中 `theme="default"` 在 `autoChangeTheme=true` 时会传内建 `dark`，设为 `false` 才使用空主题名；需要明确的渲染效果时建议传实际主题名。切换主题可能重建实例，持有实例引用的代码应重新读取或注册。

## 卡片预设和回调

- `preset="card"` 使用 Naive UI Card，支持 `title`（字符串或渲染函数）、`bordered`（默认 `true`）、`contentStyle`。`cardExtra` 插槽可替换右上角。
- 默认菜单含图片下载；`downloadOptions` 接受 ECharts `getDataURL` 参数和可选 `filename`。传入 `dropdownOptions` 会替换菜单，选择项通过 `onDropdownSelect(key, option)` 通知。
- `onSuccess(instance)`、`onError()`、`onFinally()` 对应初始化结果；错误仍可能向调用侧抛出。`onRegister(instance, render, dispose)` 在可用实例建立后调用。

`useChart()` 返回 `[register, actions]`。`getChartInstance()` 返回 `{ echartInst, render, dispose }`，注册前会抛错。`isDisposed()` 检查底层实例，`dispose()` 释放图表和监听，`render()` 调用组件挂载逻辑；已存在实例时不要用它替代更新 `options` 或 `setOption`。图表随组件卸载清理。

[Props](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RChart/src/props.ts) · [组件实现](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RChart/src/Chart.tsx) · [useChart](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RChart/src/hooks/useChart.ts)
