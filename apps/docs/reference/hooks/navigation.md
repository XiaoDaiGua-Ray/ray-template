# 导航与菜单

<script setup>
import AdminExample from '../../examples/AdminExample.vue'
</script>

从 `@/hooks` 导入本页 API。菜单来源、权限和路由记录见[路由指南](../../guide/routing)。

## 交互示例

<AdminExample path="/template-hooks" title="导航、首页、标签和标记" focus="useAppNavigation,useAppRoot,useSiderBar,useBadge" layout />

::: details 查看示例源码
<<< @/../admin/src/views/demo/template-hooks/index.tsx
:::

## useVueRouter

<AdminExample path="/web-hooks" title="读取路由和更新查询参数" focus="useVueRouter" />

::: details 查看路由示例源码
<<< @/../admin/src/views/demo/hooks/web-hooks.tsx
:::

`useVueRouter()` 返回 `{ router }`，指向模板的共享 Vue Router 实例。当前路由用 `router.currentRoute.value` 读取，`push`、`replace`、`back` 等行为由 Vue Router 提供。它可在 `setup` 外取得实例。初始化后再访问依赖实际路由匹配的状态。

```ts
import { useVueRouter } from '@/hooks'

export const readQuery = () => useVueRouter().router.currentRoute.value.query
```

## useAppNavigation

`useAppNavigation().navigationTo(target, options?)` 支持三类目标：

| target          | 行为                                                                                      |
| --------------- | ----------------------------------------------------------------------------------------- |
| 完整路径字符串  | 先用 Router 解析，保留动态路径、query 和 hash。未匹配或只匹配兜底路由时返回 `undefined`。 |
| `AppMenuOption` | 按 `fullPath` 导航。                                                                      |
| 从 0 开始的整数 | 从当前菜单取项，遇到父菜单沿第一个子项查到叶子。菜单需要先初始化。                        |

`NavigationToOptions.isPush` 默认 `true`；设为 `false` 使用 `router.replace`。`query` 可覆盖字符串路径中的同名查询参数。成功发起时返回 Router Promise。负数、小数、非有限数和越界索引不会导航；实际结果仍受路由守卫影响。

```ts
import { useAppNavigation } from '@/hooks'

export function useTableNavigation() {
  const { navigationTo } = useAppNavigation()
  return () =>
    navigationTo('/tables/remote?tab=people', {
      isPush: false,
      query: { tab: 'orders' },
    })
}
```

## useAppRoot

`getRootRoute`、`getRootPath`、`getRootName` 是计算引用。`setRootRoute({ name?, path? })` 与当前首页信息合并并更新设置，不会当场导航。给首页使用已注册的完整路径，路径和名称一起更新，确保目标页有访问权限。启动时校验首页路径是否在 Router 中。

```ts
import { useAppRoot } from '@/hooks'

export function useResetHome() {
  const { getRootPath, setRootRoute } = useAppRoot()
  const reset = () => setRootRoute({ name: 'Dashboard', path: '/dashboard' })
  return { getRootPath, reset }
}
```

## useSiderBar

操作工作区的标签页。接受 `CloseMenuTag` 的方法可传从 0 开始的索引、与标签 `fullPath` 匹配的字符串或标签对象。

| 方法                                                 | 行为                                                     |
| ---------------------------------------------------- | -------------------------------------------------------- |
| `getCurrentTagIndex()`                               | 当前标签索引；找不到返回 `-1`。                          |
| `checkCloseLeft(target)` / `checkCloseRight(target)` | 检查目标对应方向是否有标签可关。                         |
| `close(target)`                                      | 关闭一个标签。最后一个标签保留。关闭激活项时切到相邻项。 |
| `closeLeft(target)` / `closeRight(target)`           | 关闭目标左侧或右侧标签。需要时切换至目标。               |
| `closeOther(target)`                                 | 只保留目标并激活。                                       |
| `closeAll()`                                         | 在首页路由存在时清空标签并重新激活首页。                 |

不要在存在未保存表单的工作流里直接调用批量关闭；这些方法不会替业务处理未保存确认。

```ts
import { useSiderBar } from '@/hooks'

export function useCloseActiveTag() {
  const { close, getCurrentTagIndex } = useSiderBar()
  return () => {
    const index = getCurrentTagIndex()
    if (index >= 0) close(index)
  }
}
```

## useBadge

目标接受菜单的 `fullPath` 或 `AppMenuOption`。`show(target, options?)` 合并配置并显示，`hidden(target)` 保留原配置并隐藏，`update(target, options)` 只更新给出的字段。菜单未加载或未找到时不会添加标记。

`AppMenuExtraOptions` 支持 `label`（字符串或数字）、`i18nLabel`（翻译键）、`icon`（VNode）、`type`（Naive UI Tag 类型）、`show`（显隐）。使用翻译键时同步维护语言包。

```ts
import { useBadge } from '@/hooks'

export function useUnreadBadge() {
  const { show, hidden } = useBadge()
  const path = '/tables/remote'
  return (count: number) =>
    count > 0 ? show(path, { label: count, type: 'info' }) : hidden(path)
}
```

源码：[useAppNavigation](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/hooks/template/useAppNavigation.ts) · [useAppRoot](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/hooks/template/useAppRoot.ts) · [useSiderBar](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/hooks/template/useSiderBar.ts) · [useBadge](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/hooks/template/useBadge.ts) · [useVueRouter](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/hooks/template/useVueRouter.ts)
