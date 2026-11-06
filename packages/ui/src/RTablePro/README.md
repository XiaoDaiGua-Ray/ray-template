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
- `search` 支持原有字段数组和 `TableProSearchOptions`。编辑只更新草稿，提交后回到第 1 页。外部筛选可用 `params`，自定义完整表单可用 `filters` 插槽及其 `submit(values)` 方法。
- 完整模式默认使用 DataTable 底部自带的分页器，每页 10 条。空间不足时使用 Naive UI 的简洁分页，也可通过 `pagination.simple` 指定模式。用 `pageSize`、`pagination={{ pageSizes: [10, 20, 50] }}` 调整，或用 `pagination={false}` 关闭。关闭时请求不附加 `page`、`pageSize`；`bare pagination` 可以单独保留分页。
- 普通模式按 Naive UI 卡片组织搜索、表头工具、数据与页脚。搜索区在结果上方；`bare` 保留纯表格外观。表格左上方可用 `title` 传文字，或用同名插槽放筛选开关、快捷操作等；都不传时不占位。`toolbar` 插槽和默认工具集中在表格右上方。
- 行标识默认取 `row.id` 或 `row.key`，其他字段使用 `rowKey`。宽表可设置 `scrollX` 和列宽，横向滚动留在表格内部。根列拖动或固定时保留分组的子列。
- `autoHeight` 默认使用当前布局的可用高度，宿主外部使用视口高度；嵌入特定区域时可以用 CSS 变量 `--r-table-height` 覆盖。较短的屏幕保留表格的最小操作高度。
- 只接收最新的请求结果。切换请求源或有效筛选条件会立即清空旧行和总数；切页或修改每页条数会隐藏旧行并保留同一范围的总数。当前页未加载时，实例取数返回空、底层实例返回 `null`，CSV 和打印不会启动。请求失败后显示空态并清空总数，通过宿主 Toast 提醒。可用 `onRequestError` 接收详情、用实例 `reload()` 重试，或显式提供 `error` 插槽接管提示。
- 需要实例时使用 `shallowRef<TableProInst>()`。实例提供 `reload(resetPage?)`、`setPage`、`setPageSize`、`getCurrentPageData`、`downloadCsv`、`print`、`copyImage` 和 `getTableInstance`。额外区域可用 `toolbar`、`tableFooter`、`tableAction` 插槽。
- 工具栏将业务 `toolbar` 插槽与内置工具分组。`request` 模式提供刷新，列设置、复制图片和全屏保持直接入口；「更多操作」统一收纳密度、斑马纹、边框与 CSV。打印默认隐藏，设置 `showPrint` 后出现在该菜单。`tool={false}` 隐藏全部内置工具，仍保留业务插槽。

## 注册 Hook

也可以从 `@ray-template/ui/table-pro` 或 Ray Admin 的 `@/components` 导入 `useTablePro`。每张表调用一次，保持 `[register, actions]` 和 `onRegister` 的用法：

```tsx
const [register, { reload }] = useTablePro()

const renderTable = () => <RTablePro onRegister={register} columns={columns} />
const reloadFromFirstPage = () => reload(true)
```

在 SFC 中使用 `@register="register"`。注册发生在表格挂载后，卸载时清除绑定。`actions` 可解构，包含 `TableProInst` 的方法、`getTableProInstance()` 和只读 `isReady`。表格外的按钮可用 `disabled={!isReady.value}`；`isReady` 只表示实例已绑定，未绑定时调用实例方法会抛错。

`actions.queryState.value` 是组件管理的远端查询状态，实例 ref 则用 `table.value?.queryState`。未挂载或未传 `request` 时为 `null`。只读快照包含 `loading`、`failed`、`page`、`pageSize` 和 `total`；关闭分页时页码和每页条数为 `null`。`total` 在当前查询范围首次成功前为 `null`，同一范围加载期间可保留最近的成功总数，请求失败后清空。外部 `loading` 不计入查询状态，错误详情由 `onRequestError` 报告。

`getCurrentPageData()` 适合本页批量操作。本地模式读取排序、筛选、分页后的行；组件管理的远端模式只读取与当前查询及分页匹配的数据，不会请求其他页。它返回对行的只读引用，不受虚拟滚动窗口影响；选择和批量变更仍由页面通过 `v-model:checkedRowKeys` 和业务数据管理。

迁移时，把旧 `RTable` 改为 `RTablePro bare`（需要完整工具栏时省略 `bare`），用 `useTablePro` 或实例 ref 替代 `useTable`。旧版 `runTableRequest` / `runAsyncTableRequest` 改用 `reload`，需要回第一页时调用 `reload(true)`。`requestConfig` 改用 `params` 或在请求函数内映射字段；`takeoverAutoHeight`、`flexAutoHeight` 改为 `autoHeight`。

## 列显示与缓存

只传普通 `columns` 数组，就能在同一套「列设置」里勾选显示、拖动顺序、固定列或启用列宽调整。默认由 TablePro 在当前实例内维护这些操作，不修改传入的数组。拖动或使用上移、下移按钮调整根列顺序。想跨刷新记住显示选择时，加一个稳定的表格标识：

```tsx
<RTablePro columns={columns} data={rows} columnStateKey="orders:list" />
```

- 使用 Naive UI 的列 `key`，同一表的列 key 唯一且稳定。勾选状态独立于列定义；列分组会跟随子列，选择列和展开列不会被勾选隐藏。至少保留一个数据列。
- 缓存是按表格标识分隔的本地偏好。只保存隐藏列的 key，启用或切换标识时读一次，用户改动时才写入。新增列默认显示，失效 key 不影响渲染，恢复全部列会清除缓存。不传标识时仅保留实例内状态。需要按账号或租户隔离时，将其标识纳入 key。
- 页面需要接管列顺序、固定位置或 `resizable` 时，可以用 `v-model:columns`；收到的是完整列定义，包含已隐藏的列。显隐始终由列设置维护，固定列仍遵守 Naive UI 的数字列宽约定。
- 在列设置中固定或取消固定分组时，同步更新该组所有后代的 `fixed`，使表头和表体保持一致；列宽、渲染器、调整宽度等其它配置保持不变。分组固定要求全部叶子列具有数字宽度。本地与受控模式使用相同规则，均不修改调用方的原始列定义。
- 「恢复列布局」恢复根列顺序、固定和调整宽度开关，保留隐藏列；「恢复全部列」只恢复显隐。受控列由调用方提供 `onResetColumnLayout` 并应用自己的初始定义，未提供时不显示恢复布局按钮。
- 不缓存行数据、列定义、回调、列宽、固定或顺序。默认模式用列 key 维护实例内的调整；更新列标题、渲染器等定义不会抹掉用户调整。

## 复制表格图片

默认工具栏提供「复制表格图片」，将当前 `NDataTable` 的表头、行、内部滚动可视区域及原生分页器复制为 PNG。图片不包括 TablePro 标题、搜索区、工具栏、提示区、`tableFooter` 或 `tableAction`。这是表格自身的 DOM 可视盒，不是整张网页的屏幕截图，也不会为复制主动滚动或加载其它页。虚拟滚动只包含已渲染且位于可视盒内的内容；需要完整当前页数据时使用 CSV 或打印。

```tsx
const [register, { copyImage }] = useTablePro()

<RTablePro
  onRegister={register}
  columns={columns}
  data={rows}
  copyImageOptions={{ pixelRatio: 1 }}
/>

// 直接在用户点击回调里调用，不要先等待其它异步操作。
<NButton onClick={() => void copyImage()}>复制图片</NButton>
```

`showCopyImage={false}` 隐藏内置按钮，不影响实例或 Hook 的 `copyImage(options?)`。默认分辨率使用设备像素比并限制为最高 2，`copyImageOptions` 和单次参数可覆盖 `pixelRatio`、`backgroundColor`、尺寸、`style`、`filter`、字体及资源请求选项；单次参数优先。输出固定为 PNG，不接收格式、JPEG quality 或渲染生命周期回调。`filter` 处理临时快照中的节点，应按类名或数据属性判断，而不要比较原始 DOM 对象身份。

复制成功返回 `true`；加载中、重复调用、未确认的远端数据、取消或失败返回 `false`。组件使用原生 Clipboard API，在点击调用栈内把 PNG Promise 交给 `ClipboardItem`，随后按需加载现有渲染库。需要浏览器支持及 HTTPS/localhost，权限被拒绝时显示对应反馈。独立使用时在表格旁显示状态，宿主可通过 `UiServices.reportSuccess/reportError` 接管。外部图片、字体或受保护的画布可能使渲染失败，可配置资源请求或占位图。

快照保留当前滚动位置与固定列；成功、失败、数据替换和卸载均清理临时节点，重复操作不会启动并行截图。取消会阻止尚未就绪的图片交给剪贴板，但无法撤销浏览器已经接受的写入。

RIcon 外部精灵图和本地 `#symbol` 会在快照中展开为独立静态 SVG，保留视口尺寸与 `currentColor`，移除导入 ID，避免多行图标互相干扰。只读取同源注册精灵图或公共 `.svg` 文件，不携带凭据、不跟随重定向；每次最多 16 个资源，每个最多 1 MiB，并共用同一取消信号。展开路径支持静态几何和呈现属性，不提供嵌套引用、paint server、样式表或动态 CSS 值（`var/env/attr`）的兼容。

快照连接到文档前移除脚本和内联事件属性。`iframe/object/embed/audio/video` 嵌入内容会明确拒绝，避免在临时副本中重新启动活动内容；普通图片与 canvas 仍沿用上述资源策略。

## 打印和 CSV

打印入口默认隐藏。业务页面可用 `showPrint` 在「更多操作」中启用打印；实例 `print(options?)` 始终可由业务显式调用。CSV 入口位于同一菜单。

内置打印按当前排序、筛选和分页打印**当前页数据和可见列**。使用单独的白底 HTML 表格，跨纸页重复表头；不打印搜索、操作、复选框、展开区、分页或插槽。虚拟滚动不影响取数。需要特殊单元格文本时用 `formatCell`；未配置时沿用 `getCsvCell` 或字段值。自定义 Vue 单元格、树展开状态和合并格不会复刻为打印布局；需要复刻时指定自定义区域。

```tsx
<RTablePro
  columns={columns}
  data={rows}
  printTableOptions={{ target: reportRef }}
  showPrint
/>
```

内置按钮使用 `printTableOptions`。单次打印可以用 `table.value?.print({ target: reportRef, title: '报表', style: '@page { size: landscape; }' })` 覆盖配置；目标支持元素、ref 或 getter。自定义区域以独立打印文档呈现。默认复制页面样式表、根节点主题和普通表单的当前值；设置 `includePageStyles: false` 可只用打印样式。用 `style` 添加覆盖，或用 `data-print-ignore` 排除控件。依赖区域外祖先、运行时脚本或嵌入内容的样式需自行在打印 CSS 中补齐；密码和文件值不会复制。图片和字体等待有上限，未就绪时可能使用替代样式。旧版 `printOptions.documentTitle` 改用 `title`，截图配置不再适用。

CSV 默认导出当前页可见数据列；`keepOriginalData` 使用传入的整批数据（远端模式不会为导出额外请求）。`allowExport: false` 排除对应列，`getCsvCell` / `getCsvHeader` 返回原始文本，由组件处理 CSV 转义。

## Naive UI 的配置边界

分页配置使用 `TableProPagination`：请将旧 `pagination.onChange` 改为 `onUpdatePage`（或 `onUpdate:page`），将 `pagination.onPageSizeChange` 改为 `onUpdatePageSize`（或 `onUpdate:pageSize`）。TablePro 顶层旧 `onPageChange/onPageSizeChange` 同样迁移到对应更新事件。旧字段不再调用，也不会被继续透传给 Naive UI；现行回调及回调数组仍支持。

普通列配置、选择、展开、排序、筛选、汇总、虚拟滚动、固定列、空状态和加载插槽沿用 [DataTable API](https://www.naiveui.com/zh-CN/components/data-table)。`pagination` 对象透传 [Pagination API](https://www.naiveui.com/zh-CN/components/pagination) 的配置，包括快速跳页、页码模板和回调。配置了 `request` 时页码、每页条数和总数由 TablePro 管理；初始页用 `pagination.defaultPage`，运行时跳页用实例 `setPage`。手动远端模式可以直接传 `remote + data + pagination`，由调用方负责切换范围时清空旧数据。本地和手动远端受控模式由调用方在分页回调中更新 `pagination.page/pageSize`；搜索重置和实例操作也会触发同一回调。服务端排序、过滤继续使用 Naive UI 的事件，在调用方将条件传给 `params`，组件不会推断接口字段。页数很大时可配置 `pagination.showQuickJumpDropdown: false`。

在「表格 → 高级搜索」可以切换本地筛选和模拟远端查询，查看日期区间拆分和组织到负责人的联动。配置、值类型和实例方法见[高级搜索参考](../../../../apps/docs/reference/table-pro.md#高级搜索)。在「表格」菜单下也可以查看查询与分页、选择与批量操作、导出与打印三个 Hooks 示例。

行菜单通过 `contextMenuOptions` 启用。右键点击一行，或聚焦后按 Shift+F10 / 菜单键打开；选择后调用 `onContextMenuClick(key, option, { row, index })`。既有两个参数的回调可继续使用。
