# Ray Template AI Harness

从 [AGENTS.md](../AGENTS.md) 进入。LLM 可先读取 [入口索引](../llms.txt) 定位相关文件。任务上下文来自 [scopes.json](scopes.json)，跨模块关系见 [架构地图](../docs/architecture.md)。CLI 使用项目锁定的 Node.js 和 pnpm，可在本机和 CI 运行。

## 开始任务

1. 根据 `.nvmrc` 和 `package.json#packageManager` 选择运行时，首次执行 `pnpm install --frozen-lockfile` 和 `pnpm env:check`。
2. 查看 `git status`。用 `pnpm harness context` 查找任务域，再用 `pnpm harness context <scope>` 找到入口和回归测试。跨域变更分别查看受影响的任务域。
3. 明确可观察的验收条件。涉及多步迁移或跨会话接续时，记录范围、分阶段验收、关键决策与剩余项。可参考 [建设计划](plan.md)。
4. 追踪调用方和数据流后实施。先用定向测试缩短反馈周期，最后运行全量验收。

```sh
pnpm harness context routing
pnpm harness verify routing
pnpm harness verify
```

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
| `pnpm harness check`          | 上下文路径存在，回归路径至少指向一个测试文件                    |
| `pnpm harness verify <scope>` | 环境检查和该任务域的 Vitest 回归                                |
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

在交付或 PR 中记录复现步骤、实际结果及未验证项。临时报告、日志和截图放入 `.harness-local/`。浏览器结果单独记录，单元测试报告仅覆盖其中列出的命令。

## 维护

影响外部读者的功能或兼容性改动，按 [文档联动说明](../docs/docs-handoff.md) 在同一变更中更新 `apps/docs`。单独用 `pnpm docs:check` 检查示例类型、文档链接和构建；用 `pnpm docs:preview` 验收生产子路径下的交互。

任务域的路径或测试位置变化时，更新 `scopes.json` 并运行 `pnpm harness check`。测试目录以 `/` 结尾，单个文件使用仓库相对路径。优先完善现有测试和上下文入口，把可稳定复现的失败纳入共同检查。
