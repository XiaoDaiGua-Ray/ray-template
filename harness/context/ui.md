# 页面、公共组件、Hooks 与指令

用于新增或修改页面、公共 UI、主题、双语文案、Vue Hooks 或指令。TablePro 和布局各有更窄的入口：[表格](table-pro.md)、[布局](layout.md)。

| 要查什么                             | 先读                                                                                                                                                                            | 接着追踪                                                                                                                                                             |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 页面、登录、示例                     | [页面目录](../../apps/admin/src/views)、[登录页](../../apps/admin/src/views/login/index.tsx)、[演示页骨架](../../apps/admin/src/views/demo/components/DemoPage.tsx)             | [路由注册](routing.md)、[视觉约定](../../docs/ui-design.md)                                                                                                          |
| Modal、Segment、图表、条码等通用组件 | [应用组件入口](../../apps/admin/src/components/index.ts)、[共享 UI 公开导出](../../packages/ui/package.json)                                                                    | [组件实现](../../packages/ui/src)、[API 参考](../../apps/docs/reference/components.md)                                                                               |
| 依赖模板状态的组件与 Provider        | [应用组件说明](../../apps/admin/src/app-components/README.md)                                                                                                                   | [App 组装](../../apps/admin/src/App.tsx)、[Naive UI 自动补全默认值](../../apps/admin/src/app-components/provider/AppAutocompleteDefaults)                            |
| 主题、样式、应用文案                 | [应用设计配置](../../apps/admin/src/app-config/design-config.ts)、[样式入口](../../apps/admin/src/styles/entry.ts)、[语言资源](../../apps/admin/src/locales/README.md)          | [应用主题 Hook](../../apps/admin/src/hooks/template/useTheme.ts)、[共享主题](../../packages/ui/src/theme.css)、[文档站样式](docs.md)                                 |
| Hooks、全局指令                      | [应用 Hooks 入口](../../apps/admin/src/hooks/index.ts)、[共享组合式函数入口](../../packages/composables/src/index.ts)、[应用指令注册](../../apps/admin/src/directives/index.ts) | [Hooks 说明](../../apps/admin/src/hooks/README.md)、[共享指令实现](../../packages/directives/src/modules)、[指令用法](../../apps/admin/src/directives/README.DIR.md) |

应用的 `@/components` 和部分 Hook/指令路径保留兼容导出；修通用行为前沿导出进入所属共享包。宿主特有服务通过注入接入，避免共享包引用应用别名。界面新增文案应补齐中英文。

新增组件前先按 [Harness 复用约定](../README.md#工程约定) 核对现有能力。内容撑满与独立滚动可先看 [TablePro 高度样式](../../packages/ui/src/RTablePro/src/index.scss)、[布局高度变量](../../packages/admin-shell/src/layout-css-vars.ts) 和 [用户管理页](../../apps/admin/src/views/user-management/index.tsx)：`RTablePro autoHeight` 配合 `--r-table-height` 填充宿主；Naive UI `NCard contentScrollable` 与 `NScrollbar` 负责滚动，父级通过 Flex/Grid 和 `min-block-size: 0` 提供可收缩的确定高度。

定向验证：`pnpm harness verify ui`，先按实际行为选择[组件](../../__test__/components)、[Hooks](../../__test__/hooks)或[跨包消费](../../__test__/workspace/consumer.spec.tsx)用例。涉及页面效果，按 [Harness 浏览器验收](../README.md#浏览器验收) 检查。
