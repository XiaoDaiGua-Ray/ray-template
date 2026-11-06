# Harness, indexes, and verification evidence

Use this topic for collaboration rules, indexes, regression scope, commands, and local reports. Execution guidance is in the [Harness README](../README.md).

| Question                                       | Read first                                                                                                 | Follow through                                                                                        |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Agent entry points and topic selection         | [Root guidance](../../AGENTS.md), [static task index](../../llms.txt)                                      | [Topic indexes](./), [cross-module map](../../docs/architecture.md)                                   |
| Delegation for complex tasks                   | [Using subagents when useful](../README.md#using-subagents-when-useful)                                    | [Root guidance](../../AGENTS.md)                                                                      |
| CLI, context, and targeted checks              | [Scope registry](../scopes.json), [CLI implementation](../run.mjs)                                         | [CLI regressions](../../__test__/harness/cli.spec.ts), [root check commands](../../package.json)      |
| Full checks, reports, and historical decisions | [Verification and evidence](../README.md#verification-and-evidence), [CI](../../.github/workflows/ci.yaml) | [Development plan and design review](../plan.md), [toolchain record](../../docs/toolchain-upgrade.md) |

Update affected index links when moving source. For new topics, update the scope registry, matching Markdown file, and static entry point together. Keep lengthy contracts in their owning modules. The existing CLI writes reports to ignored `.harness-local/runs/`; do not put screenshots or other temporary evidence in the indexes.

Targeted verification: run `pnpm harness check` for index validity. After CLI or scope-registration changes, run `pnpm harness verify harness`. For full-workflow changes, use a real `pnpm harness verify all` run to verify reporting. Collaboration rules, indexes, and the CLI do not themselves change pages, so they do not need UI/UX verification.
