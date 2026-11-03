# AI 辅助开发

本轮建设用于让 AI 助手理解和验证现有工程；没有接入模型服务，也没有在页面增加聊天功能。

## 首次使用

下面以 nvm 为例；使用 fnm 时，将前两行替换为 `fnm install && fnm use`。

```sh
nvm install
nvm use
npm install --global pnpm@12.16.1
pnpm install --frozen-lockfile
pnpm env:check
pnpm dev
```

开发地址为 `http://127.0.0.1:9527/ray-template/`。需要局域网访问时显式运行 `pnpm dev --host 0.0.0.0`。当前固定环境以 `.nvmrc` 和 `package.json#packageManager` 为准，不要通过全局升级所有用户项目来解决本工程的问题。

Codex 自动读取根目录 `AGENTS.md`；Cursor、Copilot 和 Claude 的项目入口也指向同一份规则。新对话只需提供目标、影响页面或报错、预期行为、约束和验收条件，无需粘贴整个仓库。

编写或修改注释时统一遵循 [注释规范](comment-style.md)，由 `AGENTS.md` 引入。组件说明放在 README 和示例页；函数契约、模块声明与内部逻辑使用各自规定的形式，不在工具适配文件重复维护规范。

## 命令契约

| 命令                                                    | 用途与结果                                                           |
| ------------------------------------------------------- | -------------------------------------------------------------------- |
| `pnpm env:check`                                        | 检查 Node、pnpm 和依赖安装状态，失败时返回非零退出码并提示修复方式   |
| `pnpm typecheck`                                        | 检查应用、测试和 Vite 配置类型，不输出构建文件                       |
| `pnpm lint`                                             | 检查代码与 Vue 规则，不改文件；warning 也会失败                      |
| `pnpm format:check`                                     | 检查格式，不改文件                                                   |
| `pnpm lint:fix`                                         | 显式自动修复可修复的代码规范问题                                     |
| `pnpm format`                                           | 显式格式化受管文件；历史 CHANGELOG、生成声明和静态素材由 ignore 排除 |
| `pnpm test`                                             | 本地交互监听；按提示退出                                             |
| `pnpm test:run`                                         | 单次执行完整回归测试，适合 AI 和 CI                                  |
| `pnpm test:run -- __test__/hooks/usePagination.spec.ts` | 只运行指定回归文件                                                   |
| `pnpm test:ui`                                          | 开启 Vitest 可视化界面                                               |
| `pnpm build`                                            | 类型检查并生成 `dist/production`                                     |
| `pnpm dev-build`                                        | 生成含 sourcemap 的 `dist/development`                               |
| `pnpm preview`                                          | 本地预览生产产物，不能作为正式服务器                                 |
| `pnpm report`                                           | 生成体积分析，非交互模式，不自动打开浏览器                           |
| `pnpm check`                                            | 依次运行环境、类型、lint、格式、单测和生产构建，任一步失败即停止     |

命令不接收业务参数；Vite/Vitest 参数使用对应 CLI 选项。日志来自各工具，退出码 `0` 表示本项检查通过。`pnpm check` 的生产产物写入 `dist/production`，需要保留源码之外的临时证据时放入 `.ai-local/`。

## 给 AI 的任务示例

```text
请按 AGENTS.md 完成：修复 RTablePro 切换每页条数后未回到第一页的问题。
先追踪 usePagination、useTablePro 和调用方，保留现有公开 API。
新增覆盖页码与回调次数的回归测试，运行 pnpm check。
交付说明实际通过的验证，以及需要浏览器确认的交互。
```

依赖升级任务应包含：查询 npm 稳定版本、核对 peerDependencies 和官方迁移说明、修改配置与调用方、更新锁文件、运行 `pnpm check`，再验证对应页面。TypeScript 7 的已知阻塞见 [工具链升级记录](toolchain-upgrade.md)，不要为了追到最新版本关闭类型检查。

## 验收与持续维护

- CI 在 Linux、Windows、macOS 使用相同 Node/pnpm 和 `pnpm check`，PR 只检查；`main` 的 push 在所有检查通过后才更新 `dist` 部署分支。
- Dependabot 每周提出 npm 与 Actions 更新 PR；大版本仍需阅读迁移说明并验证，不会自动合并。
- Husky 在提交前只处理暂存文件，并校验 commit message。AI 代码和人工代码使用相同门槛。
- 页面验收覆盖登录、菜单/权限、页面缓存、明暗主题、中英文、图表、表格和修改涉及的演示页。说明具体浏览器与检查范围。
- 不把测试通过等同于真实鉴权、微前端宿主、生产后端或 Docker 部署成功；无法验证的部分在交付中明确说明。

本工程不需要模型 API key。后续若增加产品 AI 功能，需要先明确后端代理、数据边界、费用和评估标准；服务端密钥不得放入 `VITE_*` 环境变量。

参考：[官方 AGENTS.md 规则](https://developers.openai.com/codex/guides/agents-md/)、[Vue TypeScript 指南](https://vuejs.org/guide/typescript/overview.html)。
