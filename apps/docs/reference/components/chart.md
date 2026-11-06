# RChart 与 useChart

<script setup>
import AdminExample from '../../examples/AdminExample.vue'
</script>

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

## 交互示例

<AdminExample path="/echart" title="图表渲染和更新" />

::: details 查看示例源码
<<< @/../admin/src/views/demo/echart/index.tsx
:::

## 渲染、主题与更新

| 属性                                                 | 默认                                                                    | 说明                                                                                                            |
| ---------------------------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `options`                                            | `{}`                                                                    | ECharts 配置。`showAria` 默认 `false`，组件控制 `aria.enabled` 和 `aria.decal.show`，保留其余 ARIA 配置。       |
| `width` / `height`                                   | `'100%'`                                                                | CSS 尺寸，数字按像素。                                                                                          |
| `use`                                                | `[]`                                                                    | 额外 ECharts 注册项。内置柱、线、饼、K 线、散点、象形柱、Canvas，以及标题、提示、网格、数据集、图例等基础模块。 |
| `intersectionObserver`                               | `true`                                                                  | 进入观察范围后挂载图表；隐藏区域的实例可能尚不可用；浏览器不支持观察时直接挂载。                                |
| `intersectionObserverTarget` / `intersectionOptions` | 容器 / `{ threshold: 0.1 }`                                             | 自定义观察目标与参数。                                                                                          |
| `autoResize` / `autoResizeObserverTarget`            | `true` / 绘图容器                                                       | 容器尺寸变化后节流 resize。                                                                                     |
| `watchOptions` / `watchDeep`                         | `true` / `true`                                                         | 是否订阅 options，是否深层观察。                                                                                |
| `watchOptionsThrottleWait`                           | `500`                                                                   | options 更新节流间隔（毫秒）。                                                                                  |
| `nextTick`                                           | `true`                                                                  | 初始化前等待 Vue 更新。                                                                                         |
| `setChartOptions`                                    | `{ notMerge: true, lazyUpdate: true, silent: false, replaceMerge: [] }` | ECharts `setOption` 的控制参数。                                                                                |
| `theme` / `autoChangeTheme`                          | `null` / `true`                                                         | 默认跟随应用的四套风格及明暗设置。固定主题请传注册名。                                                          |
| `loading` / `loadingOptions`                         | `false` / 当前图表主题                                                  | 是否显示 ECharts 加载层；传入的字段覆盖默认样式。                                                               |

默认使用 `ray-modern`、`ray-naive`、`ray-material` 或 `ray-plain`，各有 `-dark` 变体。`theme="default"` 使用 ECharts 内建主题，`autoChangeTheme=true` 时随应用明暗变化；显式指定其他注册名时固定使用该主题。设置 `autoChangeTheme=false` 可禁用自动选择暗色变体。旧版 `macarons` 与 `macarons-dark` 已移除。

八套主题的画布、文本、图例、坐标轴、提示层和数据配色成组设计，并与对应风格的卡片表面对齐。现代化使用冷色系，Naive 以绿色起始，Material 使用紫色与柔和色组，朴素使用低饱和分类色；切换应用主色不会单独改写数据色。页面 `options` 的显式样式仍优先于主题。

默认加载层使用当前图表配色。自定义主题的透明或无效背景会回退到相应明暗表面色，避免透明背景被转换为黑色遮罩；可通过 `loadingOptions` 显式覆盖遮罩、文字或旋转图标。

切换主题会调用 ECharts 6 的 `setTheme`，保留实例和事件监听。ECharts 会重建内部选项模型，图例选择、缩放和通过合并模式写入的增量配置可能被重置。需要保留这些值时，将它们作为完整 `options` 提供。

## 卡片预设和回调

- `preset="card"` 使用 Naive UI Card，支持 `title`（字符串或渲染函数）、`bordered`（默认 `true`）、`contentStyle`。`cardExtra` 插槽可替换右上角。
- 默认菜单含图片下载；`downloadOptions` 接受 ECharts `getDataURL` 参数和可选 `filename`。传入 `dropdownOptions` 会替换菜单，选择项通过 `onDropdownSelect(key, option)` 通知。
- 初始化成功后依次触发 `onRegister(instance, render, dispose)`、`onSuccess(instance)` 和 `onFinally()`。初始化失败会释放实例，调用 `onError()` 和 `onFinally()`，并通过 Vue 错误处理链报告异常。首次应用 options 同步渲染，使注册回调能立即读取图表；后续更新按 `setChartOptions` 处理。

`useChart()` 返回 `[register, actions]`。`getChartInstance()` 返回 `{ echartInst, render, dispose }`，注册前会抛错。`isDisposed()` 检查底层实例，`dispose()` 释放图表并停止观察，`render()` 恢复挂载；已存在实例时不要用它替代更新 `options` 或 `setOption`。图表随组件卸载清理。

[Props](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RChart/src/props.ts) · [组件实现](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RChart/src/Chart.tsx) · [useChart](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RChart/src/hooks/useChart.ts)
