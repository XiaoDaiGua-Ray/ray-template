# 导航与菜单

<script setup>
import AdminExample from '../../examples/AdminExample.vue'
</script>

从 `@/hooks` 导入本页 API。菜单来源、权限和路由记录见[路由指南](../../guide/routing)。

## 交互示例

<AdminExample path="/template-hooks" title="导航、标签和标记" focus="useAppNavigation,useSiderBar,useBadge" layout />

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
| `AppMenuOption` | 按 `fullPath` 导航，保留参数与锚点；可用 `query` 覆盖同名参数。                           |
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

## useMenu

`useMenu(options?)` 封装 Naive UI 的 `NMenu`，可用于独立菜单示例、局部导航或选择器。传入原生菜单配置即可使用横向和纵向布局、分组、分隔线、自定义字段和渲染函数。

<AdminExample path="/template-hooks" title="选中与展开菜单项" focus="useMenu" deferred />

| 返回值                    | 用途                                                                     |
| ------------------------- | ------------------------------------------------------------------------ |
| `menuRef`                 | 绑定到 `NMenu` 的组件引用。                                              |
| `menuProps`               | 浅响应式的菜单属性，直接绑定给组件。异步加载时替换 `menuProps.options`。 |
| `showOption(key?)`        | 展开指定菜单项的父级。省略 key 时展开当前选中项的父级，选中值保持原样。  |
| `deriveResponsiveState()` | 重新计算启用了 `responsive` 的横向菜单的溢出状态。                       |

传入 `value` 或 `expandedKeys` 后，Hook 会先同步对应的属性，再调用原始更新回调。`value: null` 表示清除选中项，`expandedKeys: []` 表示收起所有分组。省略某个属性时，由 `NMenu` 管理该状态并应用 `defaultValue`、`defaultExpandedKeys` 或 `defaultExpandAll`。组件挂载后即可调用实例方法，异步更新选项后可用 `nextTick()` 等待组件接收新数据。

```tsx
import { useMenu } from '@/hooks'
import { NButton, NMenu } from 'naive-ui'
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const { menuRef, menuProps, showOption } = useMenu({
      options: [
        { key: 'overview', label: '概览' },
        {
          key: 'reports',
          label: '报表',
          children: [{ key: 'monthly', label: '月报' }],
        },
      ],
      value: 'monthly',
      expandedKeys: [],
    })

    return () => (
      <>
        <NMenu ref={menuRef} {...menuProps} />
        <NButton onClick={() => showOption()}>展开选中项</NButton>
      </>
    )
  },
})
```

工作区导航由 `useAppNavigation` 和路由菜单 Store 管理。独立菜单可用 `useMenu`，工作区菜单的键盘行为由 `useMenuKeyboard` 提供。[Naive UI Menu API](https://www.naiveui.com/zh-CN/components/menu#API)

<span id="useapproot-兼容接口"></span>

## useAppRoot（兼容接口） {#useapproot}

此接口已废弃，仅为旧调用方保留历史偏好的读写。`getRootRoute`、`getRootPath`、`getRootName` 是计算引用，`setRootRoute({ name?, path? })` 合并更新该字段；它不再控制登录落点、标签保护或关闭全部后的导航，也没有启动时首页校验。空工作区固定使用 `/welcome`。新代码直接通过 Router 显式导航。

```ts
import { useVueRouter } from '@/hooks'

export function useOpenWorkspace() {
  const { router } = useVueRouter()
  return () => router.replace('/welcome')
}
```

## useSiderBar

操作工作区的标签页。接受 `CloseMenuTag` 的方法可传从 0 开始的索引、与标签 `fullPath` 匹配的字符串或标签对象。

| 方法                                                 | 行为                                                                       |
| ---------------------------------------------------- | -------------------------------------------------------------------------- |
| `getCurrentTagIndex()`                               | 当前标签索引；找不到返回 `-1`。                                            |
| `checkCloseLeft(target)` / `checkCloseRight(target)` | 检查目标对应方向是否有标签可关。                                           |
| `close(target)`                                      | 关闭可关闭的业务标签。关闭激活项时切到相邻项，关闭最后一项后进入空工作区。 |
| `closeLeft(target)` / `closeRight(target)`           | 关闭目标对应方向的可关闭标签。激活项被关闭时切换至目标。                   |
| `closeOther(target)`                                 | 保留目标和固定标签，并激活目标。                                           |
| `closeAll()`                                         | 关闭可关闭标签，优先保留当前固定页面，再尝试第一个固定标签或 `/welcome`。  |

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

源码：[useMenu](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/composables/src/useMenu.ts) · [useAppNavigation](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/hooks/template/useAppNavigation.ts) · [useAppRoot](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/hooks/template/useAppRoot.ts) · [useSiderBar](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/hooks/template/useSiderBar.ts) · [useBadge](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/hooks/template/useBadge.ts) · [useVueRouter](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/hooks/template/useVueRouter.ts)
