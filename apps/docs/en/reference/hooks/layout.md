# Layout and Scrolling Hooks {#布局与滚动-hooks}

<script setup>
import AdminExample from '../../../examples/AdminExample.vue'
</script>

These APIs operate on the template's default layout. Check [layout slots and instances](../../guide/layout) before replacing the content or sidebar.

## Interactive example {#交互示例}

<AdminExample path="/template-hooks" title="Content loading, maximization, and scrolling" focus="useMaximize,useSpinning,useContentScroll,useSiderScroll" layout />

::: details View example source
<<< @/../admin/src/views/demo/template-hooks/index.tsx
:::

## useMaximize

`useMaximize(defaults?)` returns `isLayoutContentMaximized`, its alias `isFullscreen`, `maximize(full, options?)`, and `toggleFullscreen()`. The page, tab menu, and exit button use the same Pinia state. For a single DOM element, use [useElementFullscreen](./browser#useelementfullscreen).

Per-call `options` override `defaults`. Options include `zIndex` (default 999), `backgroundColor`, `transition`, `scrollToOptions: { left?, top?, behavior? }`, `beforeEnter`, `enter`, `beforeExit`, and `exit`. The before callbacks run first. Completion callbacks run on the next Vue update and are independent of CSS animation completion. Entering can adjust scroll position. For rapid toggles, only the latest state's completion callback runs. Selecting the current state returns immediately.

```ts
import { useMaximize } from '@/hooks'

export function useReportLayout() {
  const { isLayoutContentMaximized, maximize } = useMaximize()
  const expand = () => maximize(true, { scrollToOptions: { top: 0 } })
  return { expand, collapse: () => maximize(false), isLayoutContentMaximized }
}
```

## useSpinning

| Method                       | Purpose                                                                      |
| ---------------------------- | ---------------------------------------------------------------------------- |
| `openSpin()` / `closeSpin()` | Toggle content-area loading independently of the app's global spinner.       |
| `reload(wait?)`              | Remount the current address and keep other tabs' caches. Defaults to 800 ms. |
| `reloadWorkspace(wait?)`     | Remount the complete content area and release page instances for all tabs.   |

Content loading uses a thin progress bar and text. `openSpin` only shows it after 120 ms to avoid flashes. `reload` displays it immediately. When indicating a pending request, call `openSpin` and pair it with `closeSpin` in `finally`. Reload loses unpersisted state on the current page. For repeated reloads, Runtime Store retains only the most recent restore timer.

```ts
import { useSpinning } from '@/hooks'

export function useLoadWithSpinner() {
  const { openSpin, closeSpin } = useSpinning()
  return async <T>(load: () => Promise<T>) => {
    openSpin()
    try {
      return await load()
    } finally {
      closeSpin()
    }
  }
}
```

## useContentScroll

`useContentScroll()` returns a `scrollTo` function. Pass `(x, y?)` or `{ top, left, behavior }`, for example `scrollContent({ top: 0, behavior: 'smooth' })`. It resolves `LAYOUT_CONTENT_REF` at call time, so it can be created in `setup` and used in an event handler. It is a no-op while the layout is unmounted.

## useSiderScroll

`useSiderScroll()` returns a function with the same signature for `LAYOUT_SIDER_REF`. It is a no-op in top navigation mode or when the sidebar is unmounted. It scrolls the sidebar container and leaves menu selection alone.

```ts
import { useContentScroll, useSiderScroll } from '@/hooks'

export function useScrollShortcuts() {
  const scrollContent = useContentScroll()
  const scrollSider = useSiderScroll()
  return {
    toTop: () => scrollContent(0, 0),
    toMenuTop: () => scrollSider(0, 0),
  }
}
```

[useMaximize source](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/hooks/template/useMaximize.ts) · [useSpinning source](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/hooks/template/useSpinning.ts) · [useContentScroll source](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/hooks/template/useContentScroll.ts) · [useSiderScroll source](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/hooks/template/useSiderScroll.ts)
