# 工具、缓存与数据兼容

用于修改基础工具、精度、文件、缓存读写或历史密文。先通过[应用入口说明](../../apps/admin/src/utils/README.md)确认实现归属。

| 要查什么                                 | 先读                                                                                                                                                                     | 接着追踪                                                                                                                                        |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| 精度、对象、文件与基础工具               | [共享包导出](../../packages/utils/package.json)、[共享工具](../../packages/utils/src)                                                                                    | [应用兼容入口](../../apps/admin/src/utils/index.ts)、[工具 API](../../apps/docs/reference/utils.md)                                             |
| 应用缓存 key、Storage 后端、文档示例隔离 | [应用缓存](../../apps/admin/src/utils/cache.ts)、[缓存后端](../../apps/admin/src/utils/cache-backend.ts)、[key 前缀](../../apps/admin/src/utils/app/prefix-cache-key.ts) | [应用缓存键配置](../../apps/admin/src/app-config/app-config.ts)、[共享 JSON 存储](../../packages/utils/src/storage.ts)、[布局和状态](layout.md) |
| 历史同步 AES 密文                        | [兼容实现](../../apps/admin/src/utils/legacy-crypto)、[旧导入入口](../../apps/admin/src/utils/c/index.ts)                                                                | [历史密文回归](../../__test__/utils-contracts/legacy-crypto.spec.ts)                                                                            |
| Vue 生命周期、DOM 和元素工具             | [共享组合式函数与工具](../../packages/composables/src)                                                                                                                   | [应用 Hooks 与 UI](ui.md)、[Vue 工具回归](../../__test__/vue)                                                                                   |

保持调用方依赖的 key、存储类型和序列化格式。共享存储由调用方传入 Storage 实现；应用持久化和文档 iframe 的内存缓存需分别检查。同步 AES 格式或 API 若需替换，先设计历史数据迁移。

定向验证：`pnpm harness verify utils`，从[缓存测试](../../__test__/cache)、[精度测试](../../__test__/precision)或[工具契约](../../__test__/utils-contracts)选择与任务相关的回归。
