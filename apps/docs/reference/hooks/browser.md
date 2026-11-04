# 窗口、全屏和日期

<script setup>
import FullscreenDemo from '../../examples/FullscreenDemo.vue'
</script>

## useDevice

`useDevice(options?)` 返回 `width`、`height` 引用及 `isTabletOrSmaller` 计算引用。默认条件为 `width <= 768`。`options.media` 自定义断点，其他窗口尺寸选项传给 VueUse `useWindowSize`。`observer(isSmaller, { width, height })` 会立即执行一次，此后窗口尺寸或断点判断变化时再次执行。它检测窗口宽度，无法识别设备型号；组件容器宽度请另用 CSS 或容器观察。

```ts
import { useDevice } from '@/hooks'
import { computed } from 'vue'

export function useListDensity() {
  const { isTabletOrSmaller } = useDevice({ media: 900 })
  return computed(() => (isTabletOrSmaller.value ? 'small' : 'medium'))
}
```

## useElementFullscreen

点击按钮，查看元素撑满视口及恢复原位置的效果。

<FullscreenDemo />

::: details 查看示例源码
<<< @/examples/FullscreenDemo.vue
:::

`useElementFullscreen(target, options?)` 返回 `enter()`、`exit()`、`toggleFullscreen()` 和只读 `isFullscreen`。目标需能解包为 `HTMLElement`。它用 CSS 固定定位撑满视口；同一个元素一次只能由一个实例控制，也不会调用原生 Fullscreen API。

| 选项                             | 行为                                                 |
| -------------------------------- | ---------------------------------------------------- |
| `beforeEnter` / `beforeExit`     | 在覆盖或恢复样式之前执行；手动切换时抛错会中止操作。 |
| `enter` / `exit`                 | 状态变化或样式恢复后执行，`enter` 不代表动画结束。   |
| `zIndex`                         | 指定层级；省略时随进入顺序分配。                     |
| `backgroundColor` / `transition` | 指定背景与过渡。传 `'none'` 关闭过渡。               |

退出和卸载都会恢复原行内样式并取消待处理动画帧。作用域销毁会直接恢复，随后执行 `exit` 回调。若交互需要 Esc 或按钮关闭，页面应绑定 `exit()`。

```ts
import { useElementFullscreen } from '@/hooks'
import { ref } from 'vue'

export function usePanelFullscreen() {
  const panel = ref<HTMLElement>()
  const controls = useElementFullscreen(panel, { transition: 'none' })
  return { panel, ...controls }
}
```

## useDayjs

| 方法                                  | 行为                                                                 |
| ------------------------------------- | -------------------------------------------------------------------- |
| `locale(key)`                         | 从应用语言映射设置 Day.js 全局 locale，未知键回退到默认语言。        |
| `isDayjs(value)`                      | 判断是否为 Day.js 对象。                                             |
| `format(date, { format }?)`           | 格式化，默认 `YYYY-MM-DD HH:mm:ss`。                                 |
| `getStartAndEndOfDay({ format }?)`    | 返回 `today`、`startOfDay`、`endOfDay` 及对应三个 `format…` 字符串。 |
| `daysDiff(date1, date2)`              | 计算 `date2 - date1` 的整数天差，可为负数。                          |
| `isDateInRange(date, { start, end })` | 检查严格开区间 `start < date < end`，不含两端。                      |

日界线按当前 Day.js 环境计算。后端按固定时区统计时，传统一时区的时间并在业务层处理区间边界。切换界面语言时优先使用 Setting Store，它会一并同步日期语言。

```ts
import { useDayjs } from '@/hooks'

const day = useDayjs()
export const exportDate = day.format('2026-11-03', { format: 'YYYY-MM-DD' })
export const dayRange = day.getStartAndEndOfDay()
```

源码：[useDevice](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/composables/src/useDevice.ts) · [useElementFullscreen](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/composables/src/useElementFullscreen.ts) · [useDayjs](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/composables/src/useDayjs.ts)
