# Ray Template AI Harness

从 [AGENTS.md](../AGENTS.md) 进入。需要查实现时，从 [任务索引](../llms.txt) 打开相关主题；跨模块关系见 [架构地图](../docs/architecture.md)。只阅读索引无需安装依赖。

## 开始任务

1. 查看 `git status`。用静态入口或 `pnpm harness context` 选择任务域；`pnpm harness context <scope>` 显示对应索引及验证命令。跨域变更分别查看受影响的任务域。
2. 需要运行验证时，根据 `.nvmrc` 和 `package.json#packageManager` 选择运行时，首次执行 `pnpm install --frozen-lockfile` 和 `pnpm env:check`。
3. 明确可观察的验收条件，按需决定是否使用 subagent，追踪调用方和数据流后实施。多步迁移或跨会话接续时，记录范围、分阶段验收、关键决策与剩余项。可参考 [建设计划](plan.md)。
4. 先运行定向验证，最后运行全量验收。

```sh
pnpm harness context table-pro
pnpm harness verify table-pro
pnpm harness verify
```

## 按需使用 subagent

- **决定是否委派。** 子任务边界清楚、结果可独立验收，且并行调查、分头实现或独立复核的收益大于沟通与合并成本时，可以启用 subagent。简单任务、步骤相互依赖或需要频繁协调共享文件的任务，通常由主模型直接处理。宿主没有提供 subagent 或当前任务不允许委派时，主模型继续执行。
- **划清任务边界。** 交代目标、相关任务域、验收条件及只读或可写范围。并行实现时，每个文件只交给一方修改；边界未定时可先委派只读调查。委派沿用用户授权和仓库规则。
- **核对并整合结果。** 子代理回传发现、改动、实际验证及未验证项。主模型复核并整合结果；有实现改动时，由主模型执行全量验收。

## 工程约定

- UI 沿用 Vue 3 Composition API、`defineComponent` + TSX 与现有 SFC 的 `<script setup lang="ts">`，优先复用 Naive UI 和项目组件。图表使用 ECharts。
- Vue、Router 和 Pinia API 由 `unplugin-auto-import` 管理。类型使用 `import type`，生成声明通过生成器更新。
- 路由维持名称唯一、权限 meta、缓存和翻译键。变更权限时同时验证菜单可见性和直接导航。
- Store 对外复用 `apps/admin/src/store/hooks`。持久化 key 和序列化格式属于已有数据契约，变更前检查历史数据。
- 请求从 `apps/admin/src/api` 进入 `apps/admin/src/axios`。Mock 只用于演示与本地验证。服务端密钥不能放入会打包到浏览器的 `VITE_*`。
- 维护公共 API 时检查调用方、导出与已有回归测试。涉及工程配置时更新对应文档和 [验证记录](../docs/toolchain-upgrade.md)。

## 验收与证据

| 命令                          | 验证范围                                                        |
| ----------------------------- | --------------------------------------------------------------- |
| `pnpm harness check`          | 主题已登记并可从入口到达；相对链接、回归路径和检查命令有效      |
| `pnpm harness verify <scope>` | 环境检查和该任务域登记的 Vitest 回归或项目检查                  |
| `pnpm harness verify`         | `pnpm check` 的全部检查                                         |
| `pnpm check`                  | 环境、Harness、图标同步、类型、规范、格式、单测、应用与文档构建 |

`verify` 逐步执行，首个失败即停止并返回非零退出码。运行结束时打印 `.harness-local/runs/<run>/report.json` 的位置，其中记录命令、结果、耗时、运行时和信号。每次执行独立留档。全量报告以 `pnpm check` 作为一个步骤，阶段详情查看当次终端输出。参数或上下文校验失败，以及被强制中断的运行，可能没有报告。

GitHub Actions 在 Linux、Windows 和 macOS 运行同一份 `pnpm check`。单独执行 `pnpm lint`、`pnpm format:check` 和 `pnpm typecheck` 可定位问题。`pnpm lint:fix` 与 `pnpm format` 会改写文件。`pnpm check` 会同步图标清单并生成 `dist/production`，交付前检查生成差异。

### 浏览器验收

页面行为变化时使用 `pnpm dev`，打开 `http://127.0.0.1:9527/ray-template/`。涉及构建或部署子路径时，运行 `pnpm build` 和 `pnpm preview`，使用终端给出的地址和部署 base。用本地演示数据复现，核对受影响的路由、动作和控制台错误。

| 变更                   | 检查                                                     |
| ---------------------- | -------------------------------------------------------- |
| 页面、主题或文案       | 对应页面、简体中文和英文、明暗主题。布局改动增加窄屏检查 |
| 路由、权限或缓存       | 从菜单进入、直接访问、刷新，核对守卫和恢复行为           |
| 图标、部署 base 或构建 | 检查生产预览、资源 URL 和控制台                          |

在交付或 PR 中记录复现步骤、实际结果及未验证项。临时报告、日志和截图放入 `.harness-local/`。浏览器结果单独记录，CLI 报告仅覆盖其中列出的命令。

## 维护

影响外部读者的功能或兼容性改动，按 [文档联动说明](../docs/docs-handoff.md) 在同一变更中更新 `apps/docs`。单独用 `pnpm docs:check` 检查示例类型、文档链接和构建；用 `pnpm docs:preview` 验收生产子路径下的交互。

- 移动实现、适配层或示例时，更新 `harness/context/` 中受影响的索引。每个主题说明何时使用、先读哪些文件、谁拥有实现及如何验证。API 细节留在源码、模块 README 或读者文档。
- 新增任务域时，在 [scopes.json](scopes.json) 注册简介和 `tests` 或 `checks`，添加同名 `harness/context/<scope>.md`，并从 [llms.txt](../llms.txt) 链入。测试目录以 `/` 结尾；项目检查复用 CLI 允许的根脚本。原有任务域可保留为较宽的验证入口。
- 索引用普通行内相对链接指向仓库文件或目录。`pnpm harness check` 检查主题及其入口文档的文件目标，不请求外部链接或验证标题锚点。调整内容后再从一个真实任务出发走查实现和测试归属。
