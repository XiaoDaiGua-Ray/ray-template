# Viewport, Fullscreen, and Dates {#窗口、全屏和日期}

<script setup>
import AdminExample from '../../../examples/AdminExample.vue'
import FullscreenDemo from '../../../examples/FullscreenDemo.vue'
</script>

## Interactive example {#交互示例}

<AdminExample path="/web-hooks" title="Viewport width and date ranges" focus="useDevice,useDayjs" />

::: details View example source
<<< @/../admin/src/views/demo/hooks/web-hooks.tsx
:::

## useDevice

`useDevice(options?)` returns `width` and `height` refs and a computed `isTabletOrSmaller` ref. The default test is `width <= 768`. Set a custom breakpoint with `options.media`. Other window size options pass to VueUse `useWindowSize`. `observer(isSmaller, { width, height })` runs once immediately, then when size or breakpoint state changes. This API classifies viewport width. For component container width, use CSS or observe the container.

```ts
import { useDevice } from '@/hooks'
import { computed } from 'vue'

export function useListDensity() {
  const { isTabletOrSmaller } = useDevice({ media: 900 })
  return computed(() => (isTabletOrSmaller.value ? 'small' : 'medium'))
}
```

## useElementFullscreen

Use the button to make the element fill the viewport and restore its original position.

<FullscreenDemo />

::: details View example source
<<< @/examples/FullscreenDemo.vue
:::

`useElementFullscreen(target, options?)` returns `enter()`, `exit()`, `toggleFullscreen()`, and read-only `isFullscreen`. The target must unwrap to an `HTMLElement`. It fills the viewport through CSS fixed positioning, outside the native Fullscreen API. One instance can control a given element at a time.

| Option                           | Behavior                                                                                                |
| -------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `beforeEnter` / `beforeExit`     | Run before overriding or restoring styles. An exception aborts a manual toggle.                         |
| `enter` / `exit`                 | Run after the state changes or styles are restored. `enter` runs independently of animation completion. |
| `zIndex`                         | Stacking order. Defaults to the order in which elements enter.                                          |
| `backgroundColor` / `transition` | Background and transition. Set `'none'` to disable transition.                                          |

Exiting or unmounting restores original inline styles and cancels pending animation frames. Scope disposal restores styles immediately, then calls `exit`. A disposed instance cannot enter again. Bind `exit()` to Esc or a close button if the interaction needs it.

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

| Method                                | Behavior                                                                                           |
| ------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `locale(key)`                         | Sets the global Day.js locale using the app mapping. Unknown keys fall back to the default locale. |
| `isDayjs(value)`                      | Checks whether the value is a Day.js object.                                                       |
| `format(date, { format }?)`           | Formats a date. Default is `YYYY-MM-DD HH:mm:ss`.                                                  |
| `getStartAndEndOfDay({ format }?)`    | Returns `today`, `startOfDay`, `endOfDay`, and the three corresponding `format…` strings.          |
| `daysDiff(date1, date2)`              | Whole-day difference `date2 - date1`, which may be negative.                                       |
| `isDateInRange(date, { start, end })` | Checks the open interval `start < date < end`, excluding both endpoints.                           |

Day boundaries follow the current Day.js environment. When the backend groups by a fixed time zone, pass timestamps in a consistent zone and handle interval boundaries in the business layer. Change UI language through Setting Store to update date localization at the same time.

```ts
import { useDayjs } from '@/hooks'

const day = useDayjs()
export const exportDate = day.format('2026-11-03', { format: 'YYYY-MM-DD' })
export const dayRange = day.getStartAndEndOfDay()
```

[useDevice source](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/composables/src/useDevice.ts) · [useElementFullscreen source](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/composables/src/useElementFullscreen.ts) · [useDayjs source](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/composables/src/useDayjs.ts)
