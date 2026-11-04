# Harness、索引和验证证据

用于新增或改动任务索引、回归范围、命令和本地报告。执行方式见 [Harness README](../README.md)。

| 要查什么                   | 先读                                                                         | 接着追踪                                                                         |
| -------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| 助手从哪里进入、怎么选主题 | [根约定](../../AGENTS.md)、[静态任务入口](../../llms.txt)                    | [主题索引](./)、[跨模块地图](../../docs/architecture.md)                         |
| CLI、上下文与定向目标      | [任务注册表](../scopes.json)、[CLI 实现](../run.mjs)                         | [CLI 回归](../../__test__/harness/cli.spec.ts)、[根检查命令](../../package.json) |
| 全量验证、报告和历史决策   | [验证与证据](../README.md#验收与证据)、[CI](../../.github/workflows/ci.yaml) | [建设计划与设计自审](../plan.md)、[工具链记录](../../docs/toolchain-upgrade.md)  |

移动源码时更新受影响的索引链接。新增主题时同步任务注册表、同名 Markdown 和静态入口；长篇契约保留在所属模块。报告由现有 CLI 写入被忽略的 `.harness-local/runs/`；截图和其他临时证据不放进索引。

定向验证：先运行 `pnpm harness check` 检查索引，变更 CLI 后运行 `pnpm harness verify harness`。涉及全量流程时，用真实 `pnpm harness verify` 验证报告。
