# Ray Template

Vue 3 + TSX 中后台模板，包含后台应用、文档站与共享包。

- 需要定位实现时，从 [任务索引](llms.txt) 或 `pnpm harness context <scope>` 选相关主题。跨模块变更再查 [架构地图](docs/architecture.md)。
- 先看 `git status`，保留已有改动。变更路由、持久化、请求或公共组件时，追踪调用方和现有数据契约。
- 复杂任务中，宿主支持且当前权限允许时，主模型可按[分工约定](harness/README.md#按需使用-subagent)自行决定是否启用 subagent，无需为分工单独请示。主模型负责整合与最终验收。
- 新增或修改注释时遵循 [注释规范](docs/comment-style.md)。页面文案同时维护中英文，页面改动按 [Harness 指南](harness/README.md#浏览器验收) 验收。
- 完成实现后运行 `pnpm harness verify`，执行全量检查并留存报告。交付说明实际验证及未验证项。
- 使用当前源码、清单和锁文件核对工程事实。敏感数据不进入源码、提示词或证据。提交、推送与部署遵循用户授权。
