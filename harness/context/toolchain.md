# 工作区、类型检查、构建与 CI

用于修改依赖、公开导出、别名、自动导入、生产构建或部署配置。运行时以 [.nvmrc](../../.nvmrc) 和[根清单](../../package.json)为准。

| 要查什么                     | 先读                                                                                                                                                | 接着追踪                                                                                                                                                                  |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 工作区和依赖边界             | [pnpm workspace](../../pnpm-workspace.yaml)、[锁文件](../../pnpm-lock.yaml)、[工作区清单与职责](../../docs/architecture.md#工作区)                  | [包边界检查](../../scripts/check-package-boundaries.mjs)、[环境检查](../../scripts/doctor.mjs)                                                                            |
| 路径别名、类型检查和自动导入 | [TypeScript 项目图](../../docs/architecture.md#typescript-项目配置)、[共享配置](../../tsconfig.base.json)、[Vite 别名](../../vite.custom.config.ts) | [插件配置](../../vite.plugin.config.ts)、[生成声明](../../unplugin)、[Vitest 配置](../../vitest.config.ts)                                                                |
| 构建入口、部署 base 与 SEO   | [应用 Vite 配置](../../vite.config.ts)、[部署配置](../../vite.custom.config.ts)、[站点元数据](../../vite-helper/site-seo.ts)                        | [文档站配置](../../apps/docs/.vitepress/config.mts)、[产物合并](../../scripts/assemble-pages.mjs)、[部署约定](../../docs/architecture.md#deployment-and-search-discovery) |
| CI、镜像和发布产物           | [GitHub Actions](../../.github/workflows/ci.yaml)、[Dockerfile](../../Dockerfile)、[Compose](../../docker-compose.yml)                              | [全量验证步骤](../../harness/README.md)、[工具链演进记录](../../docs/toolchain-upgrade.md)                                                                                |

公开导出以对应 workspace 的 `package.json#exports` 为准；改别名时比较 Vite、TypeScript 和 Vitest 的解析。生成声明通过配置更新。发布组合站点时同时核对后台和文档的 base。

定向验证：`pnpm harness verify toolchain` 执行包边界和类型检查。改动构建或部署时还需全量检查、生成相关产物并预览；定向通过不能证明 CI、Docker 或线上发布成功。
