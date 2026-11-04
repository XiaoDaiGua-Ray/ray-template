# 文档站与可运行示例

用于修改指南、API 参考、导航、主题、旧链接或交互示例。站点开发和预览命令见[文档站 README](../../apps/docs/README.md)。

| 要查什么                 | 先读                                                                                                                                              | 接着追踪                                                                                                                                                             |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 对外用法、API 或兼容迁移 | [开发指南](../../apps/docs/guide)、[API 参考](../../apps/docs/reference/index.md)、[迁移说明](../../apps/docs/migration.md)                       | [应用与文档联动](../../docs/docs-handoff.md)、[共享包边界](../../docs/architecture.md)                                                                               |
| 站点主题、导航、源码链接 | [VitePress 配置](../../apps/docs/.vitepress/config.mts)、[侧栏](../../apps/docs/.vitepress/sidebar.mts)、[主题](../../apps/docs/.vitepress/theme) | [版本与仓库链接](../../apps/docs/.vitepress/source.mts)                                                                                                              |
| 旧文档路径与重定向       | [站内旧路径映射](../../apps/docs/.vitepress/legacy.mts)                                                                                           | [合并站点和旧站跳转产物](../../scripts/assemble-pages.mjs)、[构建与部署](toolchain.md)                                                                               |
| 页内交互与源码引用       | [轻量 Vue 示例](../../apps/docs/examples)、[后台 iframe 包装](../../apps/docs/examples/AdminExample.vue)                                          | [example.html](../../apps/admin/example.html)、[独立演示启动与路由](../../apps/admin/src/documentation-example.tsx)、[后台示例页面](../../apps/admin/src/views/demo) |

轻量示例通过共享包公开入口运行。需要后台上下文的示例走 `example.html` 的限定路由和内存缓存；使用和展示同一份运行源码。涉及公开契约时回到所属主题核实，维护指南、示例及迁移说明。

定向验证：`pnpm harness verify docs` 执行 `docs:check`，包含类型、站内链接和生产构建。嵌入后台、部署子路径和旧站跳转使用 `pnpm pages:build` 生成组合产物，再按 [README](../../apps/docs/README.md) 预览。
