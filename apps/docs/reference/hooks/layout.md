# 布局与滚动 Hooks

本页 API 操作模板默认布局。替换布局内容或侧栏前，先确认[插槽和布局实例](../../guide/layout)仍在预期位置。

## useMaximize

`useMaximize(defaults?)` 返回 `isLayoutContentMaximized`（`isFullscreen` 是同一状态的别名）、`maximize(full, options?)`、`toggleFullscreen()`。页面、标签菜单和退出按钮共享同一个 Pinia 状态。需要单独放大一个 DOM 元素时，使用 [useElementFullscreen](./browser#useelementfullscreen)。

每次调用的 `options` 覆盖 `defaults`。支持 `zIndex`（默认 999）、`backgroundColor`、`transition`、`scrollToOptions: { left?, top?, behavior? }`，以及 `beforeEnter`、`enter`、`beforeExit`、`exit`。前置回调先执行，完成回调在下一次 Vue 更新后执行，并非 CSS 动画完成事件。进入时可以调整滚动位置。连续切换只执行最新状态的完成回调；切到当前状态时直接返回。

```ts
import { useMaximize } from '@/hooks'

export function useReportLayout() {
  const { isLayoutContentMaximized, maximize } = useMaximize()
  const expand = () => maximize(true, { scrollToOptions: { top: 0 } })
  return { expand, collapse: () => maximize(false), isLayoutContentMaximized }
}
```

## useSpinning

| 返回方法                     | 用途                                            |
| ---------------------------- | ----------------------------------------------- |
| `openSpin()` / `closeSpin()` | 开关布局内容区的加载动画，不改变应用全局 Spin。 |
| `reload(wait?)`              | 卸载当前内容后重新挂载，缺省等待 800ms。        |

只想表示请求未完成时使用 Spin，并在 `finally` 关闭。`reload` 会丢失当前页面未持久化的本地状态；多次重载时，Runtime Store 只保留最后一次恢复计时。

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

`useContentScroll()` 直接返回 `scrollTo` 函数。可传 `(x, y?)` 或 `{ top, left, behavior }`，例如 `scrollContent({ top: 0, behavior: 'smooth' })`。调用时读取 `LAYOUT_CONTENT_REF`，所以可以在 `setup` 创建，在事件触发时使用。没有挂载布局实例时不执行。

## useSiderScroll

`useSiderScroll()` 返回同签名的函数，操作 `LAYOUT_SIDER_REF`。顶部模式、未挂载或侧栏已卸载时安全忽略。它滚动侧栏容器，不改变菜单选中项。

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

源码：[useMaximize](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/hooks/template/useMaximize.ts) · [useSpinning](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/hooks/template/useSpinning.ts) · [useContentScroll](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/hooks/template/useContentScroll.ts) · [useSiderScroll](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/hooks/template/useSiderScroll.ts)
