# TablePro

用于 `RTablePro`、`useTablePro`、高级搜索、远端分页、列设置、导出或打印。共享包拥有实现，后台和文档站分别消费同一公开 API。

| 要查什么                           | 先读                                                                                                                                                                                                                                                          | 接着追踪                                                                                                                                                                                                 |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 导出、Props、实例方法              | [共享入口](../../packages/ui/src/RTablePro/index.ts)、[Props](../../packages/ui/src/RTablePro/src/props.ts)、[类型](../../packages/ui/src/RTablePro/src/types.ts)                                                                                             | [注册 Hook](../../packages/ui/src/RTablePro/src/useTablePro.ts)、[包导出](../../packages/ui/package.json)、[应用组件入口](../../apps/admin/src/components/index.ts)                                      |
| 搜索草稿、校验、条件生效、请求竞争 | [搜索状态](../../packages/ui/src/RTablePro/src/useTableSearch.ts)、[搜索值处理](../../packages/ui/src/RTablePro/src/search.ts)、[分页](../../packages/ui/src/RTablePro/src/pagination.ts)、[远端请求](../../packages/ui/src/RTablePro/src/useTableRequest.ts) | [搜索控件](../../packages/ui/src/RTablePro/src/components/Search.tsx)、[后台搜索示例](../../apps/admin/src/views/demo/tables/search.tsx)、[搜索回归](../../__test__/components/table-pro-search.spec.ts) |
| 列可见性、布局、当前页导出与打印   | [表格面板](../../packages/ui/src/RTablePro/src/TablePanel.tsx)、[列设置](../../packages/ui/src/RTablePro/src/columns.ts)                                                                                                                                      | [CSV](../../packages/ui/src/RTablePro/src/csv.ts)、[打印](../../packages/ui/src/RTablePro/src/printing.ts)、[列回归](../../__test__/components/table-pro-columns.spec.ts)                                |
| 示例、文案和公开约定               | [组件契约](../../packages/ui/src/RTablePro/README.md)、[文档参考](../../apps/docs/reference/table-pro.md)                                                                                                                                                     | [后台示例和夹具](../../apps/admin/src/views/demo/tables)、[文档轻量示例](../../apps/docs/examples/TableProDemo.vue)、[组件语言资源](../../packages/ui/src/RTablePro/src/locale.ts)                       |

[本轮专项代码审查](../../docs/table-pro-review.md)记录已复现的问题、修复批次和验证边界。

远端 `total` 是筛选后的总数，取消需要请求函数透传 `signal`。修改实例能力时同时检查组件暴露、Hook 和公开导出；修改示例参数时确认是文档轻量示例还是[嵌入后台示例](docs.md)。

定向验证：`pnpm harness verify table-pro` 覆盖表格、搜索、列和导出。真实滚动、下载、打印和窄屏布局使用对应示例在浏览器验收。
