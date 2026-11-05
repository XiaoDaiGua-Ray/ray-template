# TablePro

<script setup>
import { useData } from 'vitepress'
import { defineAsyncComponent } from 'vue'
import AdminExample from '../examples/AdminExample.vue'

const { isDark, lang } = useData()
const TableProDemo = defineAsyncComponent(() => import('../examples/TableProDemo.vue'))
</script>

`RTablePro` 从 `@ray-template/ui/table-pro` 导入。Ray Admin 内也可以继续从 `@/components` 导入。列、选择、排序、固定和虚拟滚动沿用 Naive UI DataTable。使用 `bare` 只渲染表格，或按业务需要加上搜索、分页和工具栏。

![远端人员列表示例：筛选、表格工具栏、可见列与分页](/assets/tablepro-preview.jpg)

## 交互示例

[打开完整在线示例](./table-pro-examples)，按任务体验 11 个可运行场景，每个场景附操作步骤、预期结果和同一份运行源码。

试试切换数据来源、筛选和分页。远端模式下，快速切换页码或重复提交筛选可以中止前一次查询。触发模拟失败后，可以用表格内的按钮重试。

<ClientOnly>
  <TableProDemo :dark="isDark" :locale="lang.startsWith('en') ? 'en' : 'zh-CN'" />
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

- 远端 `request(params, signal)` 返回 `Promise<{ data, total }>`。组件只采用最新请求结果；切换请求源或筛选范围时清空旧行和总数，切页或修改每页条数时隐藏旧行。没有当前页结果时，实例取数为空、CSV 和打印不可用。请求失败时清空行与总数，沿用空态，并通过宿主 Toast 提醒；调用方可用实例 `reload()` 重试。要中止底层 HTTP，请把 signal 交给请求客户端。
- 搜索提交回到第 1 页。外部筛选用 `params`，复杂表单可从 `filters` 插槽调用 `submit(values)`。服务端排序和过滤由调用方将事件值映射进 `params`。
- 默认每页 10 条；用 `pageSize`、`pagination.pageSizes` 调整，或传 `pagination={false}` 关闭。关闭时不添加分页字段；`bare pagination` 可单独开启分页。
- 初始页用 `pagination.defaultPage`。远端模式下组件管理当前页、每页条数和总数；调用方已有自己的远端控制时可传 `remote + data + pagination`，并自行处理范围切换。受控分页由调用方在回调中更新页码和每页条数；搜索重置和实例操作都触发对应回调。

## 高级搜索

从下面四个场景任选一个开始。在表格下方对照草稿、已应用条件和请求参数，看看哪一步真正改变了列表。

- **组合筛选**填入状态多选与创建日期区间。切到模拟远端后点击「应用条件」，查看拆分后的 `createdFrom` 和 `createdTo`，再翻页确认条件仍然有效。
- **快速切换组织**连续发起北区和南区的候选请求。负责人会清空，最近请求里会显示北区请求已取消。打开负责人下拉，搜索南区的「王雨」。
- **交付与金额**填入商品级联、仓库树、最低金额、开票状态、自定义配送方式和交付时间。应用后展开匹配订单核对交付信息，留意请求中保留了 `minAmount: 0` 与 `invoiced: false`。
- **试试校验**提交一个字符的关键词，查看校验提示及保留的列表。修正输入后，可以切换「输入后自动应用」，快速连续编辑并观察列表请求。

在「最近请求」里还能让负责人或列表请求失败一次。负责人选项使用字段下方的重试；列表失败显示空态，通过再次查询恢复。

<AdminExample path="/tables/search" title="组合筛选、组织联动与失败重试" :height="960" />

::: details 查看示例源码
<<< ../../admin/src/views/demo/tables/search.tsx
:::

### 字段配置

`search` 接受原有数组、`TableProSearchOptions` 对象或 `false`。数组中不传 `type` 时，有 `options` 渲染单选，无 `options` 渲染文本。对象模式可用 `fields` 独立声明搜索字段，也可以省略 `fields`，从标记了 `search: true` 或 `search: { type, ... }` 的数据列生成。列分组、选择列和展开列不会生成字段，显示列设置也不会移除搜索条件。显式提供的 `fields` 优先，包括空数组。每个字段用唯一的 `key` 标识。

| `type`                             | 草稿和提交的值                          | 默认本地匹配                     |
| ---------------------------------- | --------------------------------------- | -------------------------------- |
| `text`                             | 字符串，提交时去掉首尾空白              | 忽略大小写，包含匹配             |
| `number`、`boolean`                | 数字、布尔值。布尔字段可以清空为不限    | 精确匹配                         |
| `select`、`treeSelect`、`cascader` | 字符串或数字，`multiple: true` 时为数组 | 单选精确匹配。多选任一值命中即可 |
| `date`、`dateRange`                | `yyyy-MM-dd` 字符串或二元组             | 单日精确匹配，区间包含首尾两天   |
| `datetime`、`datetimeRange`        | 毫秒时间戳或二元组                      | 单值精确匹配，区间包含两端       |
| `time`                             | `HH:mm:ss` 字符串                       | 精确匹配                         |
| `custom`                           | 字符串、数字、布尔值或字符串/数字数组   | 单值精确匹配，数组任一值命中即可 |

字段之间用 AND。默认读取 `row[key]`，嵌套数据、时间戳转业务日期等情况可用 `getValue(row)`，特殊匹配用 `matches(cell, value, row)`。控件支持 `placeholder` 和类型化的 `fieldProps`。树选择和级联的节点、懒加载等原生配置从 `fieldProps` 传入。自定义控件用 `render({ value, setValue, values, inputId, labelId })`，并为可聚焦控件关联标签。

### 提交和请求

- `initialValues` 优先于字段的 `initialValue`。默认条件参与首查，重置恢复默认并重新查询。字段配置 `rules` 后，查询按钮和 `submitSearch()` 会校验，失败保留上次结果。重置会清理校验提示并应用默认值。空值、空白文本和空数组省略，`0` 和 `false` 保留。
- `transform(value, values)` 返回请求参数片段。例如日期区间可返回 `{ createdFrom, createdTo }`，原字段不再进入参数。本地匹配仍使用字段值。列表请求按外部 `params`、转换后的搜索参数、表格的 `page` 和 `pageSize` 合并，提交回到第 1 页，分页和重试沿用已提交的条件。
- `onSearch` 接收 `{ values, params, reason }`，`reason` 为 `submit` 或 `reset`。使用对象式 `search` 与 `remote + data + pagination` 时，可在事件中自行取数并控制页码和总数。搜索回调抛错会触发 `onSearchError`，并保留上次有效条件；本地默认字段读取支持 `customer.name` 等路径，`getValue` 优先。动态替换字段的匹配、读取、转换或可见规则时，仍兼容的条件会按新规则重新计算。
- 实例和 `useTablePro()` 都提供 `getSearchValues('draft' | 'applied')`、`setSearchValues(patch)`、`submitSearch()`、`resetSearch()`。读取默认是草稿。提交和重置返回 `Promise<boolean>`，表示是否成功应用条件。设 `submitMode: 'change'` 可在编辑时防抖提交，`debounce` 默认 300 ms。

### 远程选项、联动和布局

`select.loadOptions({ keyword, values, signal })` 用于查询候选项。将 `signal` 传给请求客户端可取消旧请求，忽略取消的请求结果也不会覆盖新候选。关键词输入默认防抖 250 ms，可用 `optionDebounce` 调整。候选加载或失败重试独立于列表请求。

`dependsOn: ['orgId']` 会在组织变化时清除负责人草稿，并以新组织加载负责人选项。一次 `setSearchValues` 可以同时传入组织和新的负责人。用 `visible: ({ orgId }) => orgId != null` 在组织为空时隐藏负责人并排除该条件。折叠只改变布局，仍会提交和校验折叠区域里的字段。

用 `defaultCollapsed`、`collapsedRows`、`maxColumns` 和字段 `span` 控制容器内布局。标签位置和宽度用 `labelPlacement` / `labelWidth`，按钮文案用 `searchText` / `resetText`。用 `renderActions` 扩展默认按钮或自行调用 `submit`、`reset` 和 `setCollapsed`。如果页面已有完整自定义表单，仍可用优先渲染的 `filters` 插槽调用 `submit(values)`。

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

实例还提供 `setPage`、`setPageSize`、`getCurrentPageData`、`downloadCsv`、`print` 和 `getTableInstance`。扩展表格区域可用 `title`、`toolbar`、`tableFooter`、`tableAction`；错误区域用 `error` 插槽。

### `useTablePro`

也可以用同一入口导出的 `useTablePro` 注册实例，保留 `[register, actions]` 的写法：

```tsx
import { RTablePro, useTablePro } from '@ray-template/ui/table-pro'

const [register, { isReady, reload }] = useTablePro()

const renderTable = () => (
  <>
    <button disabled={!isReady.value} onClick={() => reload(true)}>
      回首页并刷新
    </button>
    <RTablePro
      onRegister={register}
      columns={[{ title: '姓名', key: 'name' }]}
    />
  </>
)
```

SFC 使用 `<RTablePro @register="register" />`。每张表单独调用一次 Hook；表格挂载后注册，卸载时清除。`actions` 提供上述实例方法、`getTableProInstance()` 和只读 `isReady`；它表示实例已绑定，和请求是否完成无关。未绑定时调用实例方法会抛错。

从 `actions` 解构 `queryState`，用 `queryState.value` 响应式读取 TablePro 管理的远端请求。通过组件 ref 使用时，读取 `table.value?.queryState`。

| 字段                | 含义                                                                            |
| ------------------- | ------------------------------------------------------------------------------- |
| `loading`           | 当前请求是否正在执行。只反映 `request`，与外部 `loading` prop 无关。            |
| `failed`            | 当前请求是否失败。重试开始时清除；错误详情可通过 `onRequestError` 接收。        |
| `page` / `pageSize` | 当前页码和每页条数；关闭分页时两者为 `null`。                                   |
| `total`             | 当前查询范围最近成功结果的筛选后总数。切换范围或请求失败后为 `null`，直至成功。 |

`queryState` 的值和字段均为只读。未挂载、已卸载、未传 `request`（包括手动远端模式）时，值为 `null`。被取消的旧请求不会覆盖当前查询状态。

`getCurrentPageData()` 返回当前页的行：本地表格已应用筛选、排序和分页，组件管理的远端表格只返回与当前查询和分页匹配的数据。返回的行用于读取，业务变更通过页面数据完成；虚拟滚动不会缩小取数范围。旧版 `runTableRequest` / `runAsyncTableRequest` 迁移到 `reload`，请求条件通过 `params` 或请求函数传入。

三个 Hook 场景均可在[在线示例](./table-pro-examples#实例与-hooks)中运行。

## 列设置与缓存

试试[在线列设置示例](./table-pro-examples#列设置与缓存)。每张表使用稳定且唯一的列 key。列设置可以勾选显示、拖动或用上移与下移按钮调整根列顺序、固定或启用列宽调整；分组子列跟随根列。使用 `columnStateKey` 跨刷新保留隐藏列，按账户或租户隔离时将标识纳入 key。缓存不存数据、列定义、顺序、固定位置或列宽。调用方接管列配置可用 `v-model:columns`，返回包含隐藏列的完整定义。「恢复列布局」保留显隐；受控列由调用方通过 `onResetColumnLayout` 恢复自己的列定义。

## 打印与 CSV

试试[在线打印与 CSV 示例](./table-pro-examples#打印与-csv)。默认取当前页可见数据列。打印按当前筛选和排序输出独立表格，不复刻 Vue 单元格、操作区、展开区或合并布局。报表等专用版式通过 `printTableOptions.target` 指定元素、ref 或 getter；默认复制宿主样式表、根节点主题和普通表单的当前值，也可设置 `includePageStyles: false`。单次调用可传 `title` 和专用 `style`。依赖区域外祖先、脚本或嵌入内容的区域需要专用打印 CSS；密码和文件值不会复制。真实纸张输出由浏览器负责。

CSV 的 `keepOriginalData` 使用当前传给表格的整批数据，远端模式不会自动抓取全部页。列级 `allowExport: false` 可排除数据；`getCsvCell` / `getCsvHeader` 返回原始文本，由组件做 CSV 转义。

[TablePro 完整契约](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RTablePro/README.md) · [全部表格示例](https://github.com/XiaoDaiGua-Ray/ray-template/tree/main/apps/admin/src/views/demo/tables) · [v6 的变更](../migration#v6-的变更)

## Props、事件和插槽

Naive UI DataTable 的列定义、选择、展开、加载、空态和虚拟滚动继续使用。下面列出模板层的配置与覆盖行为。

| 配置                                        | 默认 / 行为                                                                                                                  |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `bare`                                      | 默认关。移除卡片外观并隐藏标题及工具栏，省略 `pagination` 时不分页；显式搜索、底部插槽仍可使用。                             |
| `autoHeight`                                | 默认关；开启时让内部 DataTable 使用 `flexHeight`，适合有可用高度的布局。                                                     |
| `tool`                                      | 默认开，控制打印、密度、全屏、列设置和外观等内置工具。关掉仍可用自定义 `toolbar`。                                           |
| `title`                                     | 字符串或 VNode。存在 `title` 插槽时优先渲染插槽。                                                                            |
| `pagination`                                | 普通模式缺省开，`false` 关闭；对象透传 Naive UI Pagination。容器小于 600px 时默认简洁模式，显式 `simple` 优先。              |
| `pageSize`                                  | 默认 10；`pagination.pageSize`、`pagination.defaultPageSize` 依次优先。远端初始页读 `pagination.defaultPage`。               |
| `request` / `params`                        | 配置 `request` 时组件管理远端数据。`params` 深层变化会从第 1 页重查。                                                        |
| `search`                                    | 兼容原有字段数组，支持 `TableProSearchOptions` 和 `false`。见[高级搜索](#高级搜索)。                                         |
| `rowKey`                                    | 默认 `row.id ?? row.key`，业务数据缺少两者时必须提供稳定键。                                                                 |
| `columnStateKey`                            | 缺省不持久化。传稳定标识可记住隐藏列。                                                                                       |
| `downloadCsvTableOptions`                   | 内置导出默认配置，模板实现使用 `fileName`、`keepOriginalData`。                                                              |
| `onResetColumnLayout`                       | 受控列的恢复布局回调。调用方在回调里更新 `columns`。                                                                         |
| `printTableOptions`                         | 打印配置，支持 `target`、`title`、`style`、`includePageStyles`、`formatHeader`、`formatCell`。                               |
| `contextMenuOptions` / `onContextMenuClick` | 行菜单选项及选择回调 `(key, option, { row, index })`。右键、Shift+F10 或菜单键打开；业务行事件可用 `preventDefault()` 阻止。 |

常用事件有 `onRequestError(error)`（或 SFC `@request-error`）、`onUpdatePage`、`onUpdatePageSize`、`onUpdate:columns`。内部更新和受控回调走同一入口；已传入受控值时由调用方更新对应值。行选择、排序等依然沿用 DataTable 事件；需要服务端排序时，将条件写入 `params`。

| 插槽                          | 参数与位置                                                                                       |
| ----------------------------- | ------------------------------------------------------------------------------------------------ |
| `filters`                     | 表格上方；接收 `{ submit(values) }`，传入字符串或数字键值，提交后回第一页。优先于内置 `search`。 |
| `title` / `toolbar`           | 标题区左侧 / 操作区右侧；`bare` 下两者隐藏。                                                     |
| `notice`                      | 正常情况下显示自定义提示。                                                                       |
| `error`                       | 显式提供时在请求失败后替换 `notice`，接收 `{ reload }` 并接管默认 Toast。                        |
| `tableFooter` / `tableAction` | DataTable 之后的额外区域。                                                                       |
| 其余插槽                      | 转给 Naive UI DataTable，例如空态和加载。                                                        |

`TableProInst` 的 `reload(resetPage?)`、`setPage(page)`、`setPageSize(size)` 返回 `Promise<void>`。请求错误由事件报告；该 Promise 的完成不能用作业务成功判据。`getTableInstance()` 可能为 `null`；`print(options?)` 返回 `Promise<boolean>` 表示是否发起预览；`downloadCsv(options?)` 发起浏览器下载。

远端请求将 `params` 与已提交筛选合并，后者覆盖同名项，页码字段最后由表格写入。关闭分页时也会删除传入的 `page` 和 `pageSize`。`total` 需要是非负安全整数，`data` 必须是数组。若筛选或删除数据后当前页超出范围，会收敛到最后一页，并在有结果时重查。

[TablePro Props](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RTablePro/src/props.ts) · [远端与分页实现](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RTablePro/src/TablePro.tsx) · [表格面板实现](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RTablePro/src/TablePanel.tsx)
