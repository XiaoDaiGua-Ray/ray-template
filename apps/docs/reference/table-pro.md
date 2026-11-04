# TablePro

<script setup>
import { useData } from 'vitepress'
import { defineAsyncComponent } from 'vue'

const { isDark } = useData()
const TableProDemo = defineAsyncComponent(() => import('../examples/TableProDemo.vue'))
</script>

`RTablePro` 从 `@ray-template/ui/table-pro` 导入。Ray Admin 内也可以继续从 `@/components` 导入。列、选择、排序、固定和虚拟滚动沿用 Naive UI DataTable。使用 `bare` 只渲染表格，或按业务需要加上搜索、分页和工具栏。

![远端人员列表示例：筛选、表格工具栏、可见列与分页](/assets/tablepro-preview.jpg)

## 交互示例

试试切换数据来源、筛选和分页。远端模式下，快速切换页码或重复提交筛选可以中止前一次查询。触发模拟失败后，可以用表格内的按钮重试。

<ClientOnly>
  <TableProDemo :dark="isDark" />
</ClientOnly>

::: details 查看示例源码
<<< @/examples/TableProDemo.vue
:::

## 纯表格与远端查询

```tsx
import { getPersonList } from '@/api/demo/mock/person'
import { RTablePro } from '@/components'

const columns = [
  { title: '姓名', key: 'name' },
  { title: '邮箱', key: 'email' },
]

const renderBare = () => <RTablePro bare columns={columns} data={[]} />

const renderRemote = () => (
  <RTablePro
    columns={columns}
    request={getPersonList}
    search={[{ key: 'name', label: '姓名' }]}
    columnStateKey="demo:people"
  />
)
```

- 远端 `request(params, signal)` 返回 `Promise<{ data, total }>`。组件只采用最新请求结果；失败保留旧数据并提供重试。要中止底层 HTTP，请把 signal 交给请求客户端。
- 搜索提交回到第 1 页。外部筛选用 `params`，复杂表单可从 `filters` 插槽调用 `submit(values)`。服务端排序和过滤由调用方将事件值映射进 `params`。
- 默认每页 10 条；用 `pageSize`、`pagination.pageSizes` 调整，或传 `pagination={false}` 关闭。关闭时不添加分页字段；`bare pagination` 可单独开启分页。
- 初始页用 `pagination.defaultPage`。远端模式下组件管理当前页、每页条数和总数；调用方已有自己的远端控制时可传 `remote + data + pagination`。

## 布局、工具与实例

`autoHeight` 让表格填充当前工作区；嵌入自定义区域时可用 `--r-table-height` 设定可用高度。宽表设置列宽与 `scrollX`，使横向滚动留在表格内。

```tsx
import { RTablePro, type TableProInst } from '@/components'
import { shallowRef } from 'vue'

const table = shallowRef<TableProInst>()
const reloadFromFirstPage = () => table.value?.reload(true)

const renderTable = () => (
  <RTablePro ref={table} columns={[{ title: '姓名', key: 'name' }]} data={[]} />
)
```

实例还提供 `setPage`、`setPageSize`、`downloadCsv`、`print` 和 `getTableInstance`。扩展表格区域可用 `title`、`toolbar`、`tableFooter`、`tableAction`；错误区域用 `error` 插槽。

## 列设置与缓存

每张表使用稳定且唯一的列 key。列设置可以勾选显示、调整根列顺序、固定或启用列宽调整；分组子列跟随根列。使用 `columnStateKey` 跨刷新保留隐藏列，按账户或租户隔离时将标识纳入 key。缓存不存数据、列定义、顺序、固定位置或列宽。调用方接管列配置可用 `v-model:columns`，返回包含隐藏列的完整定义。

## 打印与 CSV

默认取当前页可见数据列。打印按当前筛选和排序输出独立表格，不复刻 Vue 单元格、操作区、展开区或合并布局。报表等专用版式通过 `printTableOptions.target` 指定元素、ref 或 getter；单次调用可传 `title` 和专用 `style`。真实纸张输出由浏览器负责。

CSV 的 `keepOriginalData` 使用当前传给表格的整批数据，远端模式不会自动抓取全部页。列级 `allowExport: false` 可排除数据；`getCsvCell` / `getCsvHeader` 返回原始文本，由组件做 CSV 转义。

[TablePro 完整契约](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RTablePro/README.md) · [六种可运行示例](https://github.com/XiaoDaiGua-Ray/ray-template/tree/main/apps/admin/src/views/demo/tables) · [v6 的变更](../migration#v6-的变更)

## Props、事件和插槽

Naive UI DataTable 的列定义、选择、展开、加载、空态和虚拟滚动继续使用。下面列出模板层的配置与覆盖行为。

| 配置                                        | 默认 / 行为                                                                                                                         |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `bare`                                      | 默认关。隐藏标题及工具栏，省略 `pagination` 时不分页；显式搜索、底部插槽仍可使用。                                                  |
| `autoHeight`                                | 默认关；开启时让内部 DataTable 使用 `flexHeight`，适合有可用高度的布局。                                                            |
| `tool`                                      | 默认开，控制打印、密度、全屏、列设置和外观等内置工具。关掉仍可用自定义 `toolbar`。                                                  |
| `title`                                     | 字符串或 VNode。存在 `title` 插槽时优先渲染插槽。                                                                                   |
| `pagination`                                | 普通模式缺省开，`false` 关闭；对象透传 Naive UI Pagination。容器小于 600px 时默认简洁模式，显式 `simple` 优先。                     |
| `pageSize`                                  | 默认 10；`pagination.pageSize`、`pagination.defaultPageSize` 依次优先。远端初始页读 `pagination.defaultPage`。                      |
| `request` / `params`                        | 配置 `request` 时组件管理远端数据。`params` 深层变化会从第 1 页重查。                                                               |
| `search`                                    | `{ key, label, placeholder?, options? }[]`。输入只更新草稿，提交才生效。                                                            |
| `rowKey`                                    | 默认 `row.id ?? row.key`，业务数据缺少两者时必须提供稳定键。                                                                        |
| `columnStateKey`                            | 缺省不持久化。传稳定标识可记住隐藏列。                                                                                              |
| `downloadCsvTableOptions`                   | 内置导出默认配置，模板实现使用 `fileName`、`keepOriginalData`。                                                                     |
| `printTableOptions`                         | 打印配置，支持 `target`、`title`、`style`、`formatHeader`、`formatCell`。                                                           |
| `contextMenuOptions` / `onContextMenuClick` | 行右键菜单选项及选择回调 `(key, option)`；回调不直接收到行。先调用业务 `rowProps.onContextmenu`，可用 `preventDefault()` 阻止打开。 |

常用事件有 `onRequestError(error)`（或 SFC `@request-error`）、`onUpdatePage`、`onUpdatePageSize`、`onUpdate:columns`。内部分页先变更，再触发外部事件。行选择、排序等依然沿用 DataTable 事件；需要服务端排序时，将条件写入 `params`。

| 插槽                          | 参数与位置                                                                                       |
| ----------------------------- | ------------------------------------------------------------------------------------------------ |
| `filters`                     | 表格上方；接收 `{ submit(values) }`，传入字符串或数字键值，提交后回第一页。优先于内置 `search`。 |
| `title` / `toolbar`           | 标题区左侧 / 操作区右侧；`bare` 下两者隐藏。                                                     |
| `notice`                      | 正常情况下显示自定义提示。                                                                       |
| `error`                       | 请求失败时替换 `notice`，接收 `{ reload }`。未提供则显示错误和重试按钮。                         |
| `tableFooter` / `tableAction` | DataTable 之后的额外区域。                                                                       |
| 其余插槽                      | 转给 Naive UI DataTable，例如空态和加载。                                                        |

`TableProInst` 的 `reload(resetPage?)`、`setPage(page)`、`setPageSize(size)` 返回 `Promise<void>`。请求错误由事件报告并保留旧数据；该 Promise 的完成不能用作业务成功判据。`getTableInstance()` 可能为 `null`；`print(options?)` 返回 `Promise<boolean>` 表示是否发起预览；`downloadCsv(options?)` 发起浏览器下载。

远端请求将 `params` 与已提交筛选合并，后者覆盖同名项，页码字段最后由表格写入。关闭分页时也会删除传入的 `page` 和 `pageSize`。`total` 需要是非负安全整数，`data` 必须是数组。若筛选或删除数据后当前页超出范围，会收敛到最后一页，并在有结果时重查。

[TablePro Props](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RTablePro/src/props.ts) · [远端与分页实现](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RTablePro/src/TablePro.tsx) · [表格面板实现](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RTablePro/src/TablePanel.tsx)
