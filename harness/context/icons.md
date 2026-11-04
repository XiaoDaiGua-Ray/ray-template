# SVG 图标与生成

用于新增或移动图标、排查图标类型、symbol ID、雪碧图 URL 或热更新。

| 要查什么                 | 先读                                                                                           | 接着追踪                                                                                              |
| ------------------------ | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 资源、分包及命名         | [图标维护说明](../../packages/icons/src/A_README.md)、[SVG 资源目录](../../packages/icons/src) | [包公开入口](../../packages/icons/package.json)、[应用适配](../../apps/admin/src/icons)               |
| 清单、类型、生成及 HMR   | [生成器](../../packages/icons/scripts/icons.mjs)、[根脚本入口](../../scripts/icons.mjs)        | [Vite 图标适配](../../vite-helper/icons.ts)、[插件配置](../../vite.plugin.config.ts)                  |
| 渲染、应用注入和读者用法 | [RIcon](../../packages/ui/src/RIcon/index.ts)、[应用图标服务](../../apps/admin/src/App.tsx)    | [图标示例](../../apps/admin/src/views/demo/svg-icons)、[读者参考](../../apps/docs/reference/icons.md) |

SVG 与生成器是来源；[manifest.ts](../../packages/icons/src/manifest.ts) 由 `pnpm icons:generate` 更新。移动分包可能改变完整名称；检查菜单、路由配置、缓存中的引用及生产资源 URL。

定向验证：`pnpm icons:check` 与 `pnpm harness verify icons`，包括[生成](../../__test__/icons/generation.spec.ts)和[热更新](../../__test__/icons/hmr.spec.ts)回归。资源路径变更按[浏览器验收](../README.md#浏览器验收)核对生产预览。
