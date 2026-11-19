# RChart and useChart {#rchart-与-usechart}

<script setup>
import AdminExample from '../../../examples/AdminExample.vue'
</script>

`RChart` takes ECharts options and manages the instance, theme changes, resize observation, and cleanup. Give the container a definite height. `height="100%"` depends on the parent's height. The page owns chart data and series configuration.

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
        title="Orders this week"
        height={300}
        options={{
          xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed'] },
          yAxis: { type: 'value' },
          series: [{ type: 'bar', data: [12, 19, 14] }],
        }}
      />
    )
  },
})
```

## Interactive example {#交互示例}

<AdminExample path="/echart" title="Render and update a chart" />

::: details View example source
<<< @/../admin/src/views/demo/echart/index.tsx
:::

## Rendering, themes, and updates {#渲染、主题与更新}

| Prop                                                 | Default                                                                 | Description                                                                                                                                                                                                              |
| ---------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `options`                                            | `{}`                                                                    | ECharts options. `showAria` defaults to `false`. The component controls `aria.enabled` and `aria.decal.show` and preserves other ARIA settings.                                                                          |
| `width` / `height`                                   | `'100%'`                                                                | CSS dimensions. Numbers are pixels.                                                                                                                                                                                      |
| `use`                                                | `[]`                                                                    | Extra ECharts registrations. The built-in registrar covers bar, line, pie, candlestick, scatter, and pictorial bar series, the Canvas renderer, and base modules such as titles, tooltips, grids, datasets, and legends. |
| `intersectionObserver`                               | `true`                                                                  | Initializes when the target intersects. Hidden charts may have no instance yet. Starts immediately in browsers without intersection observation.                                                                         |
| `intersectionObserverTarget` / `intersectionOptions` | Container / `{ threshold: 0.1 }`                                        | Custom observation target and options.                                                                                                                                                                                   |
| `autoResize` / `autoResizeObserverTarget`            | `true` / chart container                                                | Throttles resize on container size changes.                                                                                                                                                                              |
| `watchOptions` / `watchDeep`                         | `true` / `true`                                                         | Watch options and choose deep observation.                                                                                                                                                                               |
| `watchOptionsThrottleWait`                           | `500`                                                                   | Options update throttle interval in milliseconds.                                                                                                                                                                        |
| `nextTick`                                           | `true`                                                                  | Await the Vue update before initialization.                                                                                                                                                                              |
| `setChartOptions`                                    | `{ notMerge: true, lazyUpdate: true, silent: false, replaceMerge: [] }` | ECharts `setOption` controls.                                                                                                                                                                                            |
| `theme` / `autoChangeTheme`                          | `null` / `true`                                                         | Follow the app's four styles and color mode. Pass a registered name for a fixed theme.                                                                                                                                   |
| `loading` / `loadingOptions`                         | `false` / current chart theme                                           | Show the ECharts loading mask and override selected default styles.                                                                                                                                                      |

The default is `ray-modern`, `ray-naive`, `ray-material`, or `ray-plain`, with a `-dark` variant for each. `theme="default"` uses the built-in ECharts theme and follows app color mode when `autoChangeTheme=true`. Another explicit registered theme stays fixed. Set `autoChangeTheme=false` to disable automatic dark variant selection. The older `macarons` and `macarons-dark` themes have been removed.

The eight themes coordinate canvas, text, legend, axes, tooltips, and series colors with the corresponding card surfaces. Modern uses cool tones, Naive starts with green, Material uses purple and soft tones, and Plain uses a subdued categorical palette. Changing the application primary color leaves chart series colors intact. Explicit page options take precedence.

The default loading mask uses the chart palette. Transparent or invalid backgrounds in custom themes fall back to the corresponding light or dark surface to avoid a black mask. Use `loadingOptions` to override the mask, text, or spinner.

Theme switching calls ECharts 6 `setTheme`, keeping the instance and listeners. ECharts rebuilds its option model and can reset legend selection, zoom, and incremental options set in merge mode. Supply the complete `options` to retain these values.

## Card preset and callbacks {#卡片预设和回调}

- `preset="card"` uses Naive UI Card and supports `title` (string or render function), `bordered` (default `true`), and `contentStyle`. Replace the upper-right content with `cardExtra`.
- The default menu includes image download. `downloadOptions` accepts ECharts `getDataURL` options and an optional `filename`. `dropdownOptions` replaces the menu and `onDropdownSelect(key, option)` reports the selection.
- Initialization success calls `onRegister(instance, render, dispose)`, `onSuccess(instance)`, and `onFinally()` in order. Failure disposes the instance, calls `onError()` and `onFinally()`, and reports through Vue error handling. The initial options render synchronously so the registration callback can read the chart. Later updates follow `setChartOptions`.

`useChart()` returns `[register, actions]`. `getChartInstance()` returns `{ echartInst, render, dispose }` and throws before registration. `isDisposed()` checks the underlying instance. `dispose()` releases it and stops observation. `render()` mounts it again. Update an existing chart through `options` or `setOption`. Unmounting cleans up the chart.

[Props](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RChart/src/props.ts) · [Implementation](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RChart/src/Chart.tsx) · [useChart](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RChart/src/hooks/useChart.ts)
