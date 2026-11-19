# TablePro

<script setup>
import { useData } from 'vitepress'
import { defineAsyncComponent } from 'vue'
import AdminExample from '../../examples/AdminExample.vue'

const { isDark, lang } = useData()
const TableProDemo = defineAsyncComponent(() => import('../../examples/TableProDemo.vue'))
</script>

Import `RTablePro` from `@ray-template/ui/table-pro`. Ray Admin can also import it from `@/components`. Columns, selection, sorting, pinning, and virtual scrolling follow Naive UI DataTable. Use `bare` for a plain table, or add search, pagination, and tools as needed.

![Remote people directory with filters, toolbar, visible columns, and pagination](/assets/tablepro-preview.jpg)

## Interactive example {#交互示例}

[Open all live examples](./table-pro-examples) for 11 runnable scenarios with steps, expected behavior, and the source that actually runs.

Switch the data source, filter rows, or change pages. In remote mode, changing pages or resubmitting filters quickly cancels the previous query. After simulating a failure, use the retry button in the table.

<ClientOnly>
  <TableProDemo :dark="isDark" :locale="lang.startsWith('en') ? 'en' : 'zh-CN'" />
</ClientOnly>

::: details View example source
<<< @/examples/TableProDemo.vue
:::

## Bare tables and remote queries {#纯表格与远端查询}

```tsx
import { getPersonList } from '@/api/demo/mock/person'
import { RTablePro } from '@/components'

const columns = [
  { title: 'Name', key: 'name' },
  { title: 'Email', key: 'email' },
]

const renderBare = () => <RTablePro bare columns={columns} data={[]} />

const renderRemote = () => (
  <RTablePro
    columns={columns}
    request={getPersonList}
    search={[{ key: 'name', label: 'Name' }]}
    columnStateKey="demo:people"
  />
)
```

- Remote `request(params, signal)` returns `Promise<{ data, total }>`. The component accepts only the latest result. Changing the source or filter scope clears old rows and the total. Changing the page or page size hides old rows. Until the current page resolves, the instance returns no rows and CSV and printing are unavailable. A failure clears rows and total, shows the empty state, and uses the host toast. Retry with `reload()`. Forward the signal to the HTTP client to cancel the transport.
- Submitting search returns to page 1. Pass external filters in `params`, or use `submit(values)` from the `filters` slot for a custom form. Map sort and filter events into `params` for server-side processing.
- The default is 10 rows per page. Set `pageSize` or `pagination.pageSizes`, or disable pagination with `pagination={false}`. Disabling omits pagination fields. `bare pagination` enables only pagination on a bare table.
- Set the initial page with `pagination.defaultPage`. With `request`, TablePro owns the page, page size, and total. To manage remote data yourself, use `remote + data + pagination` and handle filter scope changes. In controlled mode, update the page and size in their callbacks. Search reset and instance actions invoke the corresponding callbacks.

## Advanced search {#高级搜索}

Start with any of the following scenarios. Compare the draft, applied filters, and request parameters below the table to see when the result changes.

- **Combined filters.** Select several statuses and a creation date range. Switch to mock remote mode, apply the filters, and inspect `createdFrom` and `createdTo`. Change pages to confirm the filters persist.
- **Rapid organization changes.** Load owner options for North and South in quick succession. The owner field clears and the request log shows the North request was canceled. Open the owner menu and search South for **Wang**.
- **Delivery and amount.** Use the product cascader, warehouse tree, minimum amount, invoice state, custom delivery method, and delivery time. Apply the filters and expand a matching order to check delivery details. The request retains `minAmount: 0` and `invoiced: false`.
- **Validation.** Submit a one-character keyword and check the error while the previous rows remain visible. Correct it, switch to automatic apply on input, and edit rapidly to observe the list requests.

Use the recent request controls to fail either the owner lookup or the list once. Retry owner options under the field. For a list failure, submit the query again from the empty state.

<AdminExample path="/tables/search" title="Combined filters, dependent fields, and retry" :height="960" />

::: details View example source
<<< ../../../admin/src/views/demo/tables/search.tsx
:::

### Field configuration {#字段配置}

`search` accepts a legacy field array, a `TableProSearchOptions` object, or `false`. In an array, a field without `type` renders a single-select when it has `options` and a text field otherwise. In object mode, set `fields` explicitly or omit it to infer fields from data columns marked `search: true` or `search: { type, ... }`. Column groups, selection columns, and expand columns are excluded from inference. Column visibility settings leave search fields intact. Explicit `fields` wins, including an empty array. Give each field a unique `key`.

| `type`                             | Draft and submitted values                              | Default local matching                                                         |
| ---------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `text`                             | String, trimmed on submit                               | Case-insensitive substring                                                     |
| `number`, `boolean`                | Number or boolean. Clear a boolean to omit its filter.  | Exact                                                                          |
| `select`, `treeSelect`, `cascader` | String or number. Array with `multiple: true`.          | Exact for single selection. Any selected value matches for multiple selection. |
| `date`, `dateRange`                | `yyyy-MM-dd` string or pair                             | Exact day or inclusive range                                                   |
| `datetime`, `datetimeRange`        | Millisecond timestamp or pair                           | Exact timestamp or inclusive range                                             |
| `time`                             | `HH:mm:ss` string                                       | Exact                                                                          |
| `custom`                           | String, number, boolean, or array of strings or numbers | Exact for a single value. Any value matches for an array.                      |

Fields combine with AND. Local matching reads `row[key]` by default. Use `getValue(row)` for nested data or conversions such as timestamps to business dates, and `matches(cell, value, row)` for custom matching. Controls support `placeholder` and typed `fieldProps`. Pass tree-select and cascader options such as nodes and lazy loading through `fieldProps`. Custom controls use `render({ value, setValue, values, inputId, labelId })`. Associate the label with the focusable control.

### Submission and requests {#提交和请求}

- `initialValues` takes precedence over field `initialValue`. Defaults participate in the first query. Reset restores defaults and queries again. With `rules`, the search button and `submitSearch()` validate first and keep the last result on failure. Reset clears validation feedback. Empty values, whitespace-only strings, and empty arrays are omitted. `0` and `false` are retained.
- `transform(value, values)` returns part of the request parameters. For example, a date range can return `{ createdFrom, createdTo }` in place of the original field. Local matching still uses the field value. List requests merge external `params`, transformed search parameters, and the table's `page` and `pageSize` in that order. Submission returns to page 1. Pagination and retry reuse applied filters.
- Errors in `visible`, `transform`, `getValue`, or `matches` trigger `onSearchError` and keep the last valid filters. Local reads support paths such as `customer.name` and prefer `getValue`. When field rules change dynamically, compatible filters are recalculated with the new rules.
- After applying filters, `onSearch` receives `{ values, params, reason }` with `reason` equal to `submit` or `reset`. In manual remote mode, use the event to fetch rows and manage the page and total. Listener exceptions go through Vue event error handling. Applied filters stay in place. The caller owns request error feedback and retry.
- Both the instance and `useTablePro()` expose `getSearchValues('draft' | 'applied')`, `setSearchValues(patch)`, `submitSearch()`, and `resetSearch()`. Reads default to the draft. Submit and reset return `Promise<boolean>` indicating whether filters were applied. Use `submitMode: 'change'` for debounced submission while editing. `debounce` defaults to 300 ms.

### Remote options, dependencies, and layout {#远程选项、联动和布局}

Use `select.loadOptions({ keyword, values, signal })` to fetch options. Pass `signal` to the HTTP client to cancel older requests. A canceled response cannot overwrite newer options even if the transport returns it. Keyword input is debounced by 250 ms by default. Change it with `optionDebounce`. Loading and retrying options is independent of list requests.

`dependsOn: ['orgId']` clears the owner draft when the organization changes and loads owners for the new organization. One `setSearchValues` call can set both organization and owner. Use `visible: ({ orgId }) => orgId != null` to hide and omit the owner filter without an organization. Collapsing changes layout only. Collapsed fields still submit and validate.

Use `defaultCollapsed`, `collapsedRows`, `maxColumns`, and field `span` for layout. Set label position and width with `labelPlacement` and `labelWidth`, and button copy with `searchText` and `resetText`. Extend the buttons with `renderActions` or call `submit`, `reset`, and `setCollapsed` yourself. A custom form can still use `submit(values)` through the higher-priority `filters` slot.

## Layout, tools, and instance methods {#布局、工具与实例}

`autoHeight` fills the available workspace height. For a custom region, set `--r-table-height`. Set column widths and `scrollX` so wide tables scroll inside the table.

```tsx
import { RTablePro, type TableProInst } from '@/components'
import { shallowRef } from 'vue'

const table = shallowRef<TableProInst>()
const reloadFromFirstPage = () => table.value?.reload(true)

const renderTable = () => (
  <RTablePro ref={table} columns={[{ title: 'Name', key: 'name' }]} data={[]} />
)
```

The instance also exposes `setPage`, `setPageSize`, `getCurrentPageData`, `downloadCsv`, `print`, `copyImage`, and `getTableInstance`. Extend the table with `title`, `toolbar`, `tableFooter`, or `tableAction`. Use `error` for custom error content.

The toolbar separates application actions from built-in tools. In `request` mode it offers Refresh. Column settings, Copy table image, and fullscreen are direct actions. **More actions** contains density, striped rows, border, and CSV. Stripe and border icons remain visible, with a separate selection mark on the right. Density items use text and a selection mark. The default `size` is `medium` (Standard), shared by the menu and table. `small` selects Compact and `large` selects Comfortable. Use `showPrint` to add Print table. `tool={false}` hides built-in tools and retains the custom `toolbar` slot.

### `useTablePro`

The same package entry exports `useTablePro`. Register the instance with `[register, actions]`.

```tsx
import { RTablePro, useTablePro } from '@ray-template/ui/table-pro'

const [register, { isReady, reload }] = useTablePro()

const renderTable = () => (
  <>
    <button disabled={!isReady.value} onClick={() => reload(true)}>
      Refresh from page 1
    </button>
    <RTablePro
      onRegister={register}
      columns={[{ title: 'Name', key: 'name' }]}
    />
  </>
)
```

In an SFC, use `<RTablePro @register="register" />`. Call the hook once per table. Registration occurs on mount and clears on unmount. `actions` includes the instance methods, `getTableProInstance()`, and read-only `isReady`. `isReady` indicates instance binding, independent of request status. Calling an instance method before binding throws.

Destructure `queryState` from `actions` and read `queryState.value` reactively for TablePro-managed remote requests. With a component ref, read `table.value?.queryState`.

| Field               | Meaning                                                                                                                            |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `loading`           | A `request` is running. The external `loading` prop is separate.                                                                   |
| `failed`            | The current request failed. A retry clears it. Use `onRequestError` for details.                                                   |
| `page` / `pageSize` | Current page and page size. Both are `null` when pagination is disabled.                                                           |
| `total`             | Filtered total from the latest successful result in this query scope. A scope change or failure clears it to `null` until success. |

The `queryState` snapshot and fields are read-only. It is `null` before mount, after unmount, or without `request`, including manual remote mode. Canceled older requests cannot overwrite current query state.

`getCurrentPageData()` reads current-page rows. Local tables apply filters, sort, and pagination. TablePro-managed remote tables return only rows matching the current query and page. Treat these rows as read-only and make business changes through the page's data. Virtual scrolling leaves the data range intact. Replace `runTableRequest` or `runAsyncTableRequest` with `reload` and pass query conditions through `params` or the request function.

[Run the three hook examples](./table-pro-examples#实例与-hooks)

## Column settings and persistence {#列设置与缓存}

Try the [live column settings example](./table-pro-examples#列设置与缓存). Use stable, unique column keys. Column settings control visibility, root column order by drag or move buttons, pinning, and resizability. Group children follow the root column. Set `columnStateKey` to keep hidden columns after refresh. Include the account or tenant identifier in it when needed. The cache stores visibility only. With `v-model:columns`, the caller receives complete definitions including hidden columns. **Reset column layout** preserves visibility. In controlled mode, supply `onResetColumnLayout` to restore your column definitions.

## Copy a table image {#复制表格图片}

**Copy table image** copies the table header, rows, visible internal scroll area, and native paginator as PNG for pasting into a chat or document. The image excludes the title, filters, toolbar, notices, `tableFooter`, and `tableAction`. It preserves current scroll position and pinned columns. Capture is limited to the table's visible DOM box. Virtual scrolling captures rendered rows only and makes no additional page requests.

```tsx
const [register, { copyImage }] = useTablePro()

<RTablePro onRegister={register} columns={columns} data={rows} copyImageOptions={{ pixelRatio: 1 }} />
<NButton onClick={() => void copyImage()}>Copy table image</NButton>
```

`showCopyImage={false}` hides the button. The instance and hook still expose `copyImage(options?)`. Output is PNG. `copyImageOptions` supports `pixelRatio`, background, dimensions, styles, filters, fonts, and resource request options. Call options take precedence. The default device pixel ratio is capped at 2. The filter callback receives temporary snapshot nodes, so match classes or data attributes.

Call directly from a click handler before awaiting another task. Image rendering can be asynchronous, but the clipboard call needs user activation. The implementation passes a `Promise<Blob>` to the native `ClipboardItem` up front. [WebKit Clipboard API](https://webkit.org/blog/10855/async-clipboard-api/)

A successful write returns `true`. Loading, duplicate calls, unconfirmed data, cancellation, and failure return `false`. Use HTTPS or localhost, a browser that supports writing PNG, and clipboard permission. Permission, resource, and rendering failures have feedback. Data replacement or unmount cancels pending rendering and removes temporary nodes. The browser retains writes it already accepted. Cross-origin images, fonts, and protected canvases remain subject to browser policy. Use CSV or print for complete current-page rows.

Same-origin RIcon sprites and local `#symbol` icons are expanded in the snapshot with their static geometry, dimensions, and `currentColor`. Imported IDs are omitted. Fetches are limited to registered same-origin sprites or public `.svg` files, with credentials omitted and redirects rejected. One operation accepts up to 16 files and 1 MiB per file. Nested references, paint servers, stylesheets, and dynamic CSS values are unsupported. Snapshots strip scripts and inline event handlers and reject active `iframe/object/embed/audio/video` elements.

## Printing and CSV {#打印与-csv}

Try the [live print and CSV example](./table-pro-examples#打印与-csv). Both use visible data columns on the current page by default. Printing creates a separate table with current filters and sorting. Vue cells, actions, expanded content, and merged layouts are outside that rendering. For a custom report, set `printTableOptions.target` to an element, ref, or getter. By default it copies host stylesheets, the root theme, and current ordinary form values. Set `includePageStyles: false` to opt out of page styles. A call can supply `title` and dedicated `style`. Use print CSS for layouts that depend on outside ancestors, scripts, or embeds. Password and file values are omitted. Physical printing is handled by the browser.

For CSV, `keepOriginalData` exports the entire batch supplied to the table. It does not fetch other remote pages. Exclude a column with `allowExport: false`. `getCsvCell` and `getCsvHeader` return raw text, and the component escapes CSV fields.

[Full TablePro contract](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RTablePro/README.md) · [Table examples](https://github.com/XiaoDaiGua-Ray/ray-template/tree/main/apps/admin/src/views/demo/tables) · [What changed in v6](../migration#v6-的变更)

## Props, events, and slots {#props、事件和插槽}

Naive UI DataTable still owns column definitions, selection, expansion, loading, empty states, and virtual scrolling. These options are provided or overridden by TablePro.

| Option                                      | Default or behavior                                                                                                                                                  |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `bare`                                      | Off. Removes the card appearance and hides the title and toolbar. Pagination is off when omitted. Explicit search and footer slots still work.                       |
| `autoHeight`                                | Off. Enables DataTable `flexHeight` when the workspace provides height.                                                                                              |
| `tool`                                      | On. Controls image copying, density, fullscreen, column settings, and appearance. The custom `toolbar` remains available.                                            |
| `title`                                     | String or VNode. A `title` slot takes precedence.                                                                                                                    |
| `pagination`                                | On in standard mode. `false` disables it. Objects pass through to Naive UI Pagination. Below 600 px, the default is simple mode. Explicit `simple` takes precedence. |
| `pageSize`                                  | Default 10. `pagination.pageSize` takes first precedence, then `pagination.defaultPageSize`. Remote mode reads `pagination.defaultPage` for its initial page.        |
| `request` / `params`                        | `request` enables TablePro-managed remote data. Deep changes to `params` trigger a new query from page 1.                                                            |
| `search`                                    | Supports legacy field arrays, `TableProSearchOptions`, and `false`. [Advanced search](#高级搜索)                                                                     |
| `rowKey`                                    | Defaults to `row.id ?? row.key`. Supply a stable key if neither exists.                                                                                              |
| `columnStateKey`                            | Persistence is off by default. Provide a stable identifier to remember hidden columns.                                                                               |
| `downloadCsvTableOptions`                   | CSV defaults. The template uses `fileName` and `keepOriginalData`.                                                                                                   |
| `onResetColumnLayout`                       | Controlled column layout reset callback. Update `columns` in the callback.                                                                                           |
| `printTableOptions`                         | `target`, `title`, `style`, `includePageStyles`, `formatHeader`, and `formatCell`.                                                                                   |
| `showPrint`                                 | `false`. Controls the print item under More actions. `print()` remains callable.                                                                                     |
| `showCopyImage`                             | `true`. Controls the built-in PNG button. `copyImage()` remains callable.                                                                                            |
| `copyImageOptions`                          | PNG rendering defaults that `copyImage(options)` can override. [Copy a table image](#复制表格图片)                                                                   |
| `contextMenuOptions` / `onContextMenuClick` | Row menu items and callback `(key, option, { row, index })`. Open with right-click, Shift+F10, or the Menu key. A row handler can call `preventDefault()`.           |

Common events include `onRequestError(error)` (or SFC `@request-error`), `onUpdatePage`, `onUpdatePageSize`, and `onUpdate:columns`. Internal updates and controlled callbacks use the same entry points. For controlled values, update them in the caller. Row selection and sorting follow DataTable events. Put server-side sort parameters in `params`.

Pagination objects use `TableProPagination`. Replace the old `pagination.onChange/onPageSizeChange` and top-level `onPageChange/onPageSizeChange` with `onUpdatePage/onUpdatePageSize` or `onUpdate:page/onUpdate:pageSize`. The native paginator no longer receives the old fields.

| Slot                          | Parameters and location                                                                                                                                |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `filters`                     | Above the table. Receives `{ submit(values) }` for string- or number-keyed filters. Submit returns to page 1. Takes precedence over built-in `search`. |
| `title` / `toolbar`           | Left title area and right action area. Both are hidden in `bare` mode.                                                                                 |
| `notice`                      | Custom notice in normal conditions.                                                                                                                    |
| `error`                       | Replaces `notice` after failure if supplied. Receives `{ reload }` and replaces the default toast.                                                     |
| `tableFooter` / `tableAction` | Extra regions after DataTable.                                                                                                                         |
| Other slots                   | Forwarded to Naive UI DataTable, including loading and empty state.                                                                                    |

`TableProInst.reload(resetPage?)`, `setPage(page)`, and `setPageSize(size)` return `Promise<void>`. Request errors use events, so promise completion alone does not establish business success. `getTableInstance()` may be `null`. `print(options?)` returns `Promise<boolean>` indicating whether a preview was requested. `downloadCsv(options?)` initiates a browser download. `copyImage(options?)` reports whether a PNG was written to the clipboard.

Remote requests merge `params` and applied filters, with the latter taking precedence, then write pagination fields. Disabling pagination removes any supplied `page` and `pageSize`. `total` must be a nonnegative safe integer and `data` an array. If filtering or deletion leaves the current page outside the result range, TablePro moves to the final page and queries it when results exist.

[TablePro Props](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RTablePro/src/props.ts) · [Remote queries and pagination](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RTablePro/src/TablePro.tsx) · [Table panel](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RTablePro/src/TablePanel.tsx)
