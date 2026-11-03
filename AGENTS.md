# Ray Template

Vue 3 + TSX 中后台模板。项目协作、定向验证和交付证据统一从 [AI Harness](harness/README.md) 开始。按任务选择上下文，不必通读仓库。

- `pnpm harness context` 列出任务域。`pnpm harness context <scope>` 给出入口、约定与回归命令。跨模块变更可查 [架构地图](docs/architecture.md)。
- 先看 `git status`，保留已有改动。变更路由、持久化、请求或公共组件时，追踪调用方和现有数据契约。
- 新增或修改注释时遵循 [注释规范](docs/comment-style.md)。页面文案同时维护中英文，页面改动按 Harness 指南验收。
- 完成实现后运行 `pnpm harness verify`。它执行 `pnpm check` 并留存结果。交付说明实际验证及未验证项。
- 使用当前源码、清单和锁文件核对工程事实。敏感数据不进入源码、提示词或证据。提交、推送与部署遵循用户授权。
