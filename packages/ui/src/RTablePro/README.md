# TablePro

统一从 `@/components` 导入 `RTablePro`。它沿用 Naive UI 的列、排序、选择和渲染配置；搜索、分页和工具栏按场景启用。

```tsx
import { RTablePro } from '@/components'

// 纯表格：只渲染数据表，默认无工具栏和分页。
<RTablePro bare columns={columns} data={rows} />

// 完整模式：内置搜索，自动加载并分页。
<RTablePro
  columns={columns}
  request={loadPeople}
  search={[{ key: 'email', label: '邮箱' }]}
/>

// 自适应高度：表格填充当前内容区，行在内部滚动。
<RTablePro autoHeight columns={columns} data={rows} />
```

- `data` 用于本地数据；`request(params, signal)` 用于远端数据，返回 `Promise<{ data: Row[]; total: number }>`。`total` 是应用筛选后的总数；传递 `signal` 给 HTTP 客户端可以取消上一条请求。
- 搜索字段有 `key`、`label` 和可选的 `placeholder`、`options`（下拉选项）。输入文字只更新草稿，提交后回到第 1 页。本地文字匹配忽略大小写，下拉按值匹配；远端模式把搜索值传给 `request`。外部筛选可用 `params`，复杂表单可用 `filters` 插槽及其 `submit(values)` 方法。
- 完整模式默认使用 DataTable 底部自带的分页器，每页 10 条。空间不足时使用 Naive UI 的简洁分页，也可通过 `pagination.simple` 指定模式。用 `pageSize`、`pagination={{ pageSizes: [10, 20, 50] }}` 调整，或用 `pagination={false}` 关闭。关闭时请求不附加 `page`、`pageSize`；`bare pagination` 可以单独保留分页。
- 搜索区在结果上方。表格左上方可用 `title` 传文字，或用同名插槽放筛选开关、快捷操作等；都不传时不占位。`toolbar` 插槽和默认工具集中在表格右上方。
- 行标识默认取 `row.id` 或 `row.key`，其他字段使用 `rowKey`。宽表可设置 `scrollX` 和列宽，横向滚动留在表格内部。根列拖动或固定时保留分组的子列。
- `autoHeight` 默认使用当前布局的可用高度，宿主外部使用视口高度；嵌入特定区域时可以用 CSS 变量 `--r-table-height` 覆盖。较短的屏幕保留表格的最小操作高度。
- 只接收最新的请求结果。失败时保留已加载的数据并显示重试；可以用 `onRequestError` 处理错误，或用 `error` 插槽定制提示。
- 需要实例时使用 `shallowRef<TableProInst>()`。实例提供 `reload(resetPage?)`、`setPage`、`setPageSize`、`getCurrentPageData`、`downloadCsv`、`print` 和 `getTableInstance`。额外区域可用 `toolbar`、`tableFooter`、`tableAction` 插槽。

## 注册 Hook

也可以从 `@ray-template/ui/table-pro` 或 Ray Admin 的 `@/components` 导入 `useTablePro`。每张表调用一次，保持 `[register, actions]` 和 `onRegister` 的用法：

```tsx
const [register, { reload }] = useTablePro()

const renderTable = () => <RTablePro onRegister={register} columns={columns} />
const reloadFromFirstPage = () => reload(true)
```

在 SFC 中使用 `@register="register"`。注册发生在表格挂载后，卸载时清除绑定。`actions` 可解构，包含 `TableProInst` 的方法、`getTableProInstance()` 和只读 `isReady`。表格外的按钮可用 `disabled={!isReady.value}`；`isReady` 只表示实例已绑定，未绑定时调用实例方法会抛错。

`actions.queryState.value` 是组件管理的远端查询状态，实例 ref 则用 `table.value?.queryState`。未挂载或未传 `request` 时为 `null`。只读快照包含 `loading`、`failed`、`page`、`pageSize` 和 `total`；关闭分页时页码和每页条数为 `null`。`total` 在首次成功前为 `null`，刷新和失败时保留上次成功结果。外部 `loading` 不计入查询状态，错误详情由 `onRequestError` 报告。

`getCurrentPageData()` 适合本页批量操作。本地模式读取排序、筛选、分页后的行；远端模式读取当前已加载的数据，不会请求其他页。它返回对行的只读引用，不受虚拟滚动窗口影响；选择和批量变更仍由页面通过 `v-model:checkedRowKeys` 和业务数据管理。

迁移时，把旧 `RTable` 改为 `RTablePro bare`（需要完整工具栏时省略 `bare`），用 `useTablePro` 或实例 ref 替代 `useTable`。旧版 `runTableRequest` / `runAsyncTableRequest` 改用 `reload`，需要回第一页时调用 `reload(true)`。`requestConfig` 改用 `params` 或在请求函数内映射字段；`takeoverAutoHeight`、`flexAutoHeight` 改为 `autoHeight`。

## 列显示与缓存

只传普通 `columns` 数组，就能在同一套「列设置」里勾选显示、拖动顺序、固定列或启用列宽调整。默认由 TablePro 在当前实例内维护这些操作，不修改传入的数组。想跨刷新记住显示选择时，加一个稳定的表格标识：

```tsx
<RTablePro columns={columns} data={rows} columnStateKey="orders:list" />
```

- 使用 Naive UI 的列 `key`，同一表的列 key 唯一且稳定。勾选状态独立于列定义；列分组会跟随子列，选择列和展开列不会被勾选隐藏。至少保留一个数据列。
- 缓存是按表格标识分隔的本地偏好。只保存隐藏列的 key，启用或切换标识时读一次，用户改动时才写入。新增列默认显示，失效 key 不影响渲染，恢复全部列会清除缓存。不传标识时仅保留实例内状态。需要按账号或租户隔离时，将其标识纳入 key。
- 页面需要接管列顺序、固定位置或 `resizable` 时，可以用 `v-model:columns`；收到的是完整列定义，包含已隐藏的列。显隐始终由列设置维护，固定列仍遵守 Naive UI 的数字列宽约定。
- 不缓存行数据、列定义、回调、列宽、固定或顺序。默认模式用列 key 维护实例内的调整；更新列标题、渲染器等定义不会抹掉用户调整。

## 打印和 CSV

内置打印按当前排序、筛选和分页打印**当前页数据和可见列**。使用单独的白底 HTML 表格，跨纸页重复表头；不打印搜索、操作、复选框、展开区、分页或插槽。虚拟滚动不影响取数。需要特殊单元格文本时用 `formatCell`；未配置时沿用 `getCsvCell` 或字段值。自定义 Vue 单元格、树展开状态和合并格不会复刻为打印布局；需要复刻时指定自定义区域。

```tsx
<RTablePro
  columns={columns}
  data={rows}
  printTableOptions={{ target: reportRef }}
/>
```

内置按钮使用 `printTableOptions`。单次打印可以用 `table.value?.print({ target: reportRef, title: '报表', style: '@page { size: landscape; }' })` 覆盖配置；目标支持元素、ref 或 getter。自定义区域以独立打印文档呈现，可用 `style` 提供专用 CSS，或用 `data-print-ignore` 排除其中的控件。旧版 `printOptions.documentTitle` 改用 `title`，截图配置不再适用。

CSV 默认导出当前页可见数据列；`keepOriginalData` 使用传入的整批数据（远端模式不会为导出额外请求）。`allowExport: false` 排除对应列，`getCsvCell` / `getCsvHeader` 返回原始文本，由组件处理 CSV 转义。

## Naive UI 的配置边界

普通列配置、选择、展开、排序、筛选、汇总、虚拟滚动、固定列、空状态和加载插槽沿用 [DataTable API](https://www.naiveui.com/zh-CN/components/data-table)。`pagination` 对象透传 [Pagination API](https://www.naiveui.com/zh-CN/components/pagination) 的配置，包括快速跳页、页码模板和回调。配置了 `request` 时页码、每页条数和总数由 TablePro 管理；初始页用 `pagination.defaultPage`，运行时跳页用实例 `setPage`。手动远端模式可以直接传 `remote + data + pagination`。服务端排序、过滤继续使用 Naive UI 的事件，在调用方将条件传给 `params`，组件不会推断接口字段。页数很大时可配置 `pagination.showQuickJumpDropdown: false`。

在「表格」菜单下，除了纯表格、远端查询、自适应高度、列设置、打印和插槽示例，还可以查看三个独立的 Hooks 示例：查询与分页、选择与批量操作、导出与打印。旧示例路径会重定向到对应子页。
