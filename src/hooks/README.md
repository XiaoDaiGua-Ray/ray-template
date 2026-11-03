# Hooks 示例与约定

所有自定义 Hook 从 `@/hooks` 导出。页面使用 Vue 3 Composition API + TSX；每个演示包含实际交互、响应式结果和可展开复制的用法代码。

| 分包       | Hook                       | 示例页面与操作                                                                  |
| ---------- | -------------------------- | ------------------------------------------------------------------------------- |
| template   | `useTheme`                 | `/template-hooks`：明暗、切换、跟随系统                                         |
| template   | `useSpinning`              | `/template-hooks`：加载动画、重新挂载页面                                       |
| template   | `useMaximize`              | `/template-hooks`：内容最大化、共享退出按钮、Esc                                |
| template   | `useBadge`                 | `/template-hooks`：菜单标记文本、图标与显隐                                     |
| template   | `useWatermark`             | `/template-hooks`：文本、显示、隐藏与切换                                       |
| template   | `useAppNavigation`         | `/template-hooks`：完整路径、索引、嵌套菜单与 query                             |
| template   | `useAppRoot`               | `/template-hooks`：读取首页、设置本页与恢复仪表盘                               |
| template   | `useSiderBar`              | `/template-hooks`：按路径关闭标签与左右/其他/全部标签                           |
| template   | `useContentScroll`         | `/template-hooks`：内容滚动到顶部或指定坐标                                     |
| template   | `useSiderScroll`           | `/template-hooks`：侧栏滚动到顶部或指定坐标                                     |
| web        | `useDevice`                | `/web-hooks`：随窗口尺寸更新断点判断                                            |
| web        | `usePagination`            | `/web-hooks`：实际分页数据、页码、每页条数与重置                                |
| web        | `useDayjs`                 | `/web-hooks`：日期格式化、天数差、开区间和日界限                                |
| web        | `useI18n`                  | `/web-hooks`：命名空间、完整键和语言切换                                        |
| web        | `useVueRouter`             | `/web-hooks`：当前路由、查询参数与页面导航                                      |
| web        | `useElementFullscreen`     | `/web-hooks`：指定元素 CSS 全屏与恢复                                           |
| web        | `useDomToImage`            | `/web-hooks`：PNG 生成、预览和失败提示                                          |
| web        | `usePrint`                 | `/web-hooks`：元素打印预览                                                      |
| components | `useContextmenuCoordinate` | `/web-hooks`：右键坐标、选择、外部关闭和停止监听；原 `/context-menu` 页面也保留 |

## 生命周期与状态

- 组合式函数在 `setup` 或有效 effect scope 内创建，DOM 操作由用户事件或挂载后的回调触发。事件、订阅、动画帧随作用域清理。
- 全局 UI 状态由 Pinia `runtime` 管理，通过 `useRuntimeGetters` / `useRuntimeActions` 访问，不写入持久化缓存。
- `useSpinning().reload(wait)` 会卸载页面，恢复计时器由 runtime Store 持有；多个调用以最后一次刷新为准。
- 两个滚动 Hook 可以在 setup 阶段创建，调用时才读取布局实例。无侧栏或未挂载时安全忽略。
- `useMaximize` 操作布局内容，多个调用方共享状态；`useElementFullscreen` 操作任意单个元素，其状态属于当前实例。二者均不调用浏览器 Fullscreen API。
- `navigationTo` 的索引从 0 开始；负数、小数、非有限数和越界索引不会导航。成功调用返回 Router 导航 Promise。
- `useDomToImage` 的返回类型跟随默认格式或本次 `create(format)`；失败通过 Error 拒绝，`finally` 在目标缺失时也会执行，此时参数可能为空。`created` 回调也会接收到运行时覆盖格式的结果，因此其参数为所有实际输出类型的联合，需先判断类型。
- `useI18n('hooks').t('code')` 和 `.t('hooks.code')` 指向同一个翻译键。切换应用语言使用 `useSettingActions().updateLocale`，保持日期与组件库同步。
- 国际化实例在开发热更新期间复用；初始化前创建的翻译方法会在调用时读取当前实例，不会永久停留在返回原始键的回退函数上。

截图和打印依赖实际浏览器。Happy DOM 测试验证状态与异常处理，不能替代原生打印界面或实际纸张输出验收。
