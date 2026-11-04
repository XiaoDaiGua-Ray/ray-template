# Menu 与 KeepAlive Store

## Menu Store

路由模块转换成菜单树。Menu Store 负责选中项、标签、面包屑和导航联动，业务页面通常使用 [useAppNavigation](../hooks/navigation#useappnavigation) 或 [useSiderBar](../hooks/navigation#usesiderbar)。

| Getter                 | 返回的计算引用                                     |
| ---------------------- | -------------------------------------------------- |
| `getMenuOptions`       | 应用菜单树，包含子项。显示逻辑还会使用路由元数据。 |
| `getBreadcrumbOptions` | 当前面包屑项。                                     |
| `getMenuKey`           | 当前菜单 key，通常取完整路径。                     |
| `getMenuTagOptions`    | 工作区标签列表。                                   |
| `getCurrentMenuOption` | 当前激活菜单项，初始可能为空。                     |
| `getCollapsed`         | 侧栏是否折叠。                                     |

| Action                                        | 行为                                                                                         |
| --------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `setupAppMenu()`                              | 从已知路由重建菜单、标签与标题，返回 `Promise<void>`。模板会在路由联动首次运行时初始化。     |
| `resolveOption(option)`                       | 把路由形状转成菜单项。调用方须提供正确的 `fullPath`，用于 key 和查找。                       |
| `changeMenuModelValue(key, option, query?)`   | 导航并同步状态；`meta.windowOpen` 分支打开外部页面。`sameLevel` 会保留原菜单标签并补面包屑。 |
| `collapsedMenu(collapsed)`                    | 更新折叠状态。                                                                               |
| `setMenuTagOptions(options, isAppend = true)` | 追加或替换标签，参数可为单项或数组。                                                         |
| `spliceMenTagOptions(idx, length = 1)`        | 按索引删除标签，拼写保留历史契约。                                                           |
| `updateMenuState(key, value, callback?)`      | 更新已有状态字段，普通对象浅合并。需要跨字段联动时使用上述动作。                             |

`depthSearchAppMenu(options, key)` 从菜单树按完整路径查找菜单项。`changeMenuModelValue` 不返回 Router 的导航 Promise；需要等待守卫结果时使用 Router 或 `navigationTo`。更新角色后还要同步服务端授权及直接路由校验，菜单过滤本身不能授权。

`piniaMenuStore` 在 Local Storage 只持久化 `menuKey`、`collapsed`。标签列表单独使用 Session Storage 的 `appMenuTagOptions`。当前路由变化会重新同步菜单与面包屑，避免手工写缓存制造冲突。

## KeepAlive Store

`useKeepAliveGetters().getKeepAliveInclude` 是缓存名称数组的计算引用。`useKeepAliveActions()` 提供 `getKeepAliveInclude()` 读队列、`setKeepAliveInclude(option)` 按路由选项加入名称。仅处理 `meta.keepAlive` 的页面，达到上限时先移除最早的名称再追加当前名称。实际缓存由 [RTransitionComponent](../components/route-transition) 渲染。

- 路由 `name` 必须和页面组件名一致，否则 `include` 无法匹配。
- Store 只在当前浏览器标签的 Session Storage 持久化名称。刷新后组件实例与表单状态重新创建。
- 开关、排除名称和数量在 [Setting Store](./setting) 的 `keepAliveConfig` 配置。确认嵌套路由和 query 变化后，测试切回标签的结果。

```ts
import { useKeepAliveGetters, useMenuGetters } from '@/store'

export function useNavigationSummary() {
  const { getMenuKey, getMenuTagOptions } = useMenuGetters()
  const { getKeepAliveInclude } = useKeepAliveGetters()
  return { getMenuKey, getMenuTagOptions, getKeepAliveInclude }
}
```

[Menu 实现](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/store/modules/menu/index.ts) · [Menu Hooks](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/store/hooks/useMenuStore.ts) · [KeepAlive 实现](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/store/modules/keep-alive/index.ts)
