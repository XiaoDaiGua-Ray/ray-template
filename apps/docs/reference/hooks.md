# Hooks

模板的公开 Hooks 从 `@/hooks` 导入。与具体组件一起使用的 `useForm`、`useModal`、`useChart`、`useFlow` 从 `@/components` 导入，请看对应组件页。`useRequest` 从 `@/axios` 导入。

| 需求                         | API                                |
| ---------------------------- | ---------------------------------- |
| 跳转页面，操作标签和菜单标记 | [导航与菜单](./hooks/navigation)   |
| 内容最大化、重载或滚动       | [布局与滚动](./hooks/layout)       |
| 主题、语言、水印             | [主题与国际化](./hooks/appearance) |
| 分页与右键菜单               | [组件交互](./hooks/interaction)    |
| 窗口尺寸、元素全屏和日期     | [窗口与日期](./hooks/browser)      |
| DOM 截图、打印               | [截图与打印](./hooks/output)       |

需要订阅、事件或清理的 Hook 在 `setup()` 或有效的 Vue effect scope 中创建。在 DOM 挂载后或用户操作时执行截图、打印和全屏。`BasicTarget` 接受元素、ref 或 getter，解析规则和可用元素类型见[Vue 与 DOM 目标](./utils/browser#vue-目标解析)。

项目保留 `@/hooks/web/useI18n`、`@/hooks/web/useVueRouter`、`@/hooks/web/usePagination` 作为兼容导入。新代码统一从 `@/hooks` 导入。实现和测试入口见[源码 Hooks 索引](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/hooks/README.md)。
