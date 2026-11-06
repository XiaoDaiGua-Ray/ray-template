# 工程检查与部署

## 常用命令

| 命令                             | 用途                                                           |
| -------------------------------- | -------------------------------------------------------------- |
| `pnpm env:check`                 | 校验 Node、pnpm 与依赖安装                                     |
| `pnpm dev`                       | 同步图标清单并启动 Vite                                        |
| `pnpm harness context`           | 查任务域；追加 `routing`、`table-pro`、`docs` 等查看实现与验证 |
| `pnpm harness verify table-pro`  | 按域运行定向测试或项目检查                                     |
| `pnpm harness verify all`        | 集成风险或发布时运行全量检查并生成本地报告                     |
| `pnpm typecheck`                 | 验证图标清单，检查应用、Node 配置和测试类型                    |
| `pnpm dev-build` / `pnpm report` | 构建开发版，或输出静态打包报告                                 |
| `pnpm build` / `pnpm preview`    | 构建并在本机验收产物                                           |
| `pnpm packages:check`            | 检查公开入口、依赖声明和循环依赖                               |
| `pnpm pages:build`               | 将后台与文档组装到 `dist/pages`                                |
| `pnpm docs:dev`                  | 启动文档开发站                                                 |
| `pnpm docs:check`                | 验证文档示例类型、站内链接与生产构建                           |
| `pnpm docs:preview`              | 预览已构建的文档站                                             |

日常修改先运行相关测试文件或 `pnpm harness verify <scope>`，再根据改动补充格式、ESLint 和类型检查。纯措辞、注释或维护文档修正可只检查内容和格式；索引变化加 `pnpm harness check`。依赖、公共导出、构建配置等集成风险、发布或明确要求时，才在任务收尾运行一次全量检查。Pages 发布独立运行构建，本地全量检查入口仍为 `pnpm check`。

全量检查包含环境、Harness、API 与包边界、图标同步、类型、ESLint、Prettier、Vitest，以及后台和文档构建。`pnpm harness verify` 省略 scope 时仍执行全量，日常使用应显式指定 scope。Harness 在 `.harness-local/runs/` 写命令结果，所有命令均不启动浏览器。

浏览器验收按影响范围单独记录：交互变化只操作对应页面，布局变化增加桌面和窄屏，颜色变化增加明暗主题，文案或国际化变化核对中英文。共享能力选择有差异的代表调用方；纯逻辑、维护文档和读者文档纯措辞修正无需浏览器。检查通过后，只重跑受后续修改影响的部分，无需遍历页面、语言、主题和视口的所有组合。

## 部署到子路径

`pnpm build` 输出 `dist/production`。将产物部署到与 `vite.custom.config.ts` 中 `base` 对应的路径。默认应用为 `/ray-template/`，域名根目录部署改为 `/`。Vite 默认打包本地依赖；可选 CDN 模式需另外确认目标环境能访问 CDN。

组合部署使用 `pnpm pages:build`，将 `dist/pages` 作为同一个站点的产物。官方地址为 `/ray-template/`，其下 `docs/` 目录提供 v6 官网。Pages 工作流在 `main` 每次 push 后于 Ubuntu 构建，成功后发布到 `dist` 分支；不设路径过滤，也不依赖三平台检查，因此后台、文档、共享包、依赖和构建配置变动都会触发。支持在 `main` 手动重发，其他分支和 PR 不发布到正式站点。构建时传入 `RAY_TEMPLATE_SOURCE_REF`，把文档的当前源码链接固定到发布提交。

公开生产部署可在构建环境设置 `RAY_TEMPLATE_SITE_ORIGIN` 为实际站点源地址（例如 `https://example.com`），由 base 补足路径。未配置时应用产物使用 `noindex`。公开 sitemap 列出入口页，登录后的 hash 路由用于应用交互。

## 二次开发约定

- 新页面遵循 Vue 3 Composition API + TSX 或现有 SFC 模式。复用现有组件，声明按职责归档。
- Vue、Router、Pinia 的自动导入声明由生成器维护；类型使用 `import type`。应用、测试、Node 配置的 TS 边界不同。
- 格式由 Prettier 管理，ESLint 使用 flat config。提交约定和注释写法以应用仓库当前规则为准。

[工程与部署入口](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/docs/architecture.md) · [AI Harness](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/harness/README.md) · [注释规范](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/docs/comment-style.md)
