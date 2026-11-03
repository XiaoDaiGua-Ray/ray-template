# AI Harness 建设计划

目标是让接手 Ray Template 的开发者和 AI 助手，能按任务找到相关代码、独立复现验证，并把实际结果交给下一位维护者。工程入口和命令见 [AI Harness](README.md)。

| 阶段          | 建设内容                                                                                 | 验收条件                                                                           |
| ------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| 1. 收拢上下文 | 重写根 `AGENTS.md`，移除旧工具配置和旧开发指南。保留架构、注释、视觉和工具链的各自职责   | README 指向新入口，活跃文档没有旧指南引用。TypeScript 项目说明可从架构地图找到     |
| 2. 建立反馈   | 按路由、UI、API、图标、公共工具和 Harness 提供上下文与回归。复用 pnpm、Vitest 和构建命令 | 任务域可查询，定向验证可执行，缺失的上下文或回归路径会被拒绝                       |
| 3. 接入验收   | 将 Harness 校验纳入 `pnpm check` 和现有 CI，提供本机 JSON 报告与浏览器验收步骤           | 定向和全量运行均可追溯，失败会以非零退出码返回，报告与截图排除在源码和打包输入之外 |

日常维护时，以实际反复出现的失败为依据扩充 Harness。优先将已有覆盖缺口补进 Vitest，待浏览器流程有稳定夹具和可重复结果时，再评估纳入自动化门禁。迁移的实测结果见 [工具链记录](../docs/toolchain-upgrade.md)。

设计参考 [OpenAI Docs 的仓库工作流实践](https://developers.openai.com/cookbook/examples/codex/iterating-development-workflows-with-codex) 与 [上下文分层建议](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra)。
