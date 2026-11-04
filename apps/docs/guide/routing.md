# 路由、菜单与权限

<script setup>
import RouteConfigDemo from '../examples/RouteConfigDemo.vue'
</script>

在 `apps/admin/src/router/modules` 写默认导出的路由模块。模板递归收集文件，按 `meta.order` 排序；路由树用于菜单与面包屑，页面记录展开后注册到 Vue Router。默认使用 hash 路由，例如 `/ray-template/#/orders`。

## 路由配置交互校验

修改路径、名称或页面 ID，查看共享校验器的结果。示例注册了 `overview` 页面。

<RouteConfigDemo />

::: details 查看示例源码
<<< @/examples/RouteConfigDemo.vue
:::

## 常用元数据

| 字段                       | 作用                                                                                      |
| -------------------------- | ----------------------------------------------------------------------------------------- |
| `i18nKey` / `noLocalTitle` | 使用翻译键，或提供不经翻译的菜单标题                                                      |
| `icon`                     | 使用完整分包图标名，也接受 VNode                                                          |
| `role`                     | 同时影响菜单与守卫；角色值类型要和会话一致                                                |
| `hidden`、`env`            | 控制菜单显隐；不充当接口或路由权限                                                        |
| `sameLevel`                | 详情页可保留当前菜单与标签，只在面包屑补充层级                                            |
| `keepAlive`                | 允许页面加入内容区的缓存                                                                  |
| `windowOpen`               | 菜单点击时打开指定地址。                                                                  |
| `ignoreAutoResetScroll`    | 允许页面保留内容区滚动位置，详见滚动工具实现。                                            |
| `extra`                    | 菜单标记的文本、图标、类型和显隐，见 [useBadge](../reference/hooks/navigation#usebadge)。 |

嵌套子路由使用相对路径；如果父路由需要承载子内容，参考 [多级菜单示例](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/router/modules/demo/multi-menu.ts) 与 `@/router/constant` 中的 `LAYOUT`。

## 登录和角色

默认登录页为 `/`。守卫启用时，无会话会返回登录页；有会话时按白名单、角色和应用首页决定导航。菜单隐藏的页面仍可能允许直达。接入真实业务时，在后端校验会话、权限和资源归属。

## KeepAlive 排查

1. 路由设置 `meta.keepAlive: true`，并为它配置唯一 `name`。
2. TSX 的 `defineComponent({ name })` 或 SFC 的组件名应与路由名一致。检查懒加载模块是否导出了预期组件。
3. 从菜单进入，改变页内状态，切到另一个标签再返回；随后检查关闭标签、直达和刷新是否符合预期。KeepAlive 不跨浏览器刷新保留组件实例。
4. 替换布局的默认内容插槽后，应用接入方需要自行保留需要的路由渲染和缓存逻辑。

[路由契约](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/router/README.md) · [守卫实现](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/router/utils/permission.ts)
