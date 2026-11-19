# TablePro Live Examples {#tablepro-在线示例}

Start with a bare table and add queries, pagination, column settings, or printing as needed. These examples use real Ray Admin components and demo data. **Run example** loads each interactive area without sign-in or a business API. On narrow screens, scroll inside the table or open a new tab. Each example includes the source that actually runs.

<script setup>
import AdminExample from '../../examples/AdminExample.vue'
</script>

| Goal                                                | Start here                                                                                                         |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Display rows you already have                       | [Bare table and local sorting](#纯表格与本地排序)                                                                  |
| Use the current page and total returned by an API   | [Remote queries and retry](#远端查询与失败恢复)                                                                    |
| Let a page or query library own data and pagination | [Manual remote pagination](#手动远端分页)                                                                          |
| Combine filters, validation, and remote options     | [Advanced search](#高级搜索)                                                                                       |
| Fill the workspace and handle many columns or rows  | [Automatic height and virtual scrolling](#自适应高度与虚拟滚动) · [Column settings and persistence](#列设置与缓存) |
| Customize actions or export print and CSV           | [Custom slots and row menu](#自定义插槽与行菜单) · [Printing and CSV](#打印与-csv)                                 |
| Control the table from the page                     | [Instance methods and hooks](#实例与-hooks)                                                                        |

## Bare table and local sorting {#纯表格与本地排序}

Click **Age** to cycle through ascending, descending, and default order. The table consumes the ten supplied rows. `bare` hides the title and toolbar and disables pagination by default. `scrollX` preserves column widths in a wide table.

<AdminExample path="/tables/basic" title="Bare table and local sorting" :height="495" deferred />

::: details View the bare table source
<<< ../../../admin/src/views/demo/tables/basic.tsx
:::

## Remote queries and retry {#远端查询与失败恢复}

1. Copy part of a row's name or email into the filter area and submit. The query returns to page 1 and pagination uses the filtered total.
2. Clear the filters, sort by **Age**, and change pages. `onUpdateSorter` maps the sort to `params.sortAge`, which applies to the full result set before pagination.
3. Select rows on two pages. The toolbar shows the total across pages. **More actions → Export CSV** exports visible data columns on the current page.
4. Click **Simulate request failure** to see the old rows clear and an error appear. Click **Refresh** to recover. Forward `request`'s `signal` to the HTTP client for cancellation.

<AdminExample path="/tables/remote" title="Remote queries, server-side sort, and retry" :height="695" deferred />

::: details View the remote query source
<<< ../../../admin/src/views/demo/tables/remote.tsx
:::

## Manual remote pagination {#手动远端分页}

This example simulates an external API with local data and supplies only the current page. Go to page 2 and filter by name. The page returns to 1 and the total changes. Changing page size also returns to page 1.

The page owns `page`, `pageSize`, and `itemCount` and updates them from pagination callbacks and `onSearch`. For an async service, manage loading, cancellation, and errors in that layer. Use `request` from the previous example to let TablePro own these states.

<AdminExample path="/tables/controlled" title="Page-controlled remote pagination and results" :height="670" deferred />

::: details View the controlled pagination source
<<< ../../../admin/src/views/demo/tables/controlled.tsx
:::

## Advanced search {#高级搜索}

Switch between local matching and a mock remote query. After each action, compare the draft, applied filters, transformed parameters, and actual list request.

1. **Combine filters.** Submit multiple statuses and a creation date range. The remote query splits the dates into `createdFrom` and `createdTo`. Page changes reuse the parameters.
2. **Dependencies and cancellation.** Switch quickly between North and South. The owner draft clears and the previous options request is canceled. Search South's options for **Wang**.
3. **Zero and boolean values.** Apply the delivery and amount scenario and expand an order. Follow the product cascader, warehouse tree, delivery control, and datetime field. Confirm `minAmount: 0` and `invoiced: false` are preserved.
4. **Validation and automatic apply.** Submit a one-character keyword and check that existing rows remain. Correct it, enable automatic submission on input, and edit repeatedly to see the debounce.
5. **Recover independent failures.** Fail the owner options or list request once. Retry options at the field, or resubmit the list query.

<AdminExample path="/tables/search" title="Combined filters, remote options, and advanced search" :height="960" deferred />

::: details View the search example, business API, and demo fixtures
<<< ../../../admin/src/views/demo/tables/search.tsx

<<< ../../../admin/src/api/demo/data.ts

<<< ../../../../packages/demo-data/src/orders.ts
:::

## Automatic height and virtual scrolling {#自适应高度与虚拟滚动}

Enable **Virtual rows**, then show the footer and action slots. The list gives the new content room while the paginator stays below the rows. Open the example in a new tab and resize its height. Compare the available space with filters expanded and collapsed. Virtual scrolling reduces the rendered row count. The current page, loaded rows, and export scope are calculated as usual.

<AdminExample path="/tables/auto-height" title="Automatic height, virtual scrolling, and footer slots" :height="640" deferred />

::: details View the automatic height source
<<< ../../../admin/src/views/demo/tables/auto-height.tsx
:::

## Column settings and persistence {#列设置与缓存}

1. Open **Column settings**. Hide **Name** and **Email**. The **Contact details** group disappears once both children are hidden.
2. Drag root columns or use the move buttons. Columns with widths can be pinned to the start or end. Enable resizing, then drag a header edge.
3. Click **Reset column layout** to restore initial order, pinning, and width settings while keeping visibility.
4. Open the example in a new tab, hide a column, and reload that same tab. `columnStateKey` saves visibility in a separate session namespace. Production applications can include the tenant or account ID in the key.
5. Toggle **Include the ID field** to change the column definitions. Data columns and groups use stable keys. Selection columns are outside visible data column settings.

<AdminExample path="/tables/columns" title="Groups, visibility, pinned columns, and widths" :height="680" deferred />

::: details View the column settings source
<<< ../../../admin/src/views/demo/tables/columns.tsx
:::

## Custom slots and row menu {#自定义插槽与行菜单}

Filter by email in the custom form, which submits through `submit(values)` from `filters`. Use the title actions to return to page 1 and set 20 rows per page. Select rows and clear them with the bottom action. Right-click a row to run a sample menu action. The callback receives the row's data.

<AdminExample path="/tables/custom" title="Custom filters, footer, actions, and row context menu" :height="690" deferred />

::: details View the custom slot source
<<< ../../../admin/src/views/demo/tables/custom.tsx
:::

## Copy an image {#复制图片}

Click **Copy table image** in any full table above and paste it into an image-capable chat or document. Try hiding or pinning columns, or scrolling horizontally, before copying. Virtual scrolling captures only the content currently rendered in the visible table area. The copy action is on by default and can be hidden with `showCopyImage={false}`. Printing is off by default.

## Printing and CSV {#打印与-csv}

This example sets `showPrint`. Filter by name or hide a column in Column settings. Choose **More actions → Print table** to preview the current page's visible data columns. **Print a separate summary** previews a custom region supplied via `print({ target })`. Cancel the browser dialog to preview without printing.

<AdminExample path="/tables/printing" title="Print the current page or a custom region" :height="710" deferred />

::: details View printing source and styles
<<< ../../../admin/src/views/demo/tables/printing.tsx

<<< ../../../admin/src/views/demo/tables/printing.scss
:::

To compare both CSV scopes, download the files in [Export, print, and the instance lifecycle](#导出与打印的实例生命周期).

## Instance methods and hooks {#实例与-hooks}

### Query, retry, and pagination {#查询、重试与分页}

Go to page 2 and compare **Refresh current page** with **Refresh from page 1**. Simulate failure and observe `queryState` loading, failure, and totals, then refresh to recover. Submitting a name filter displays the actual request parameters. Change pages rapidly to see the latest request win.

<AdminExample path="/tables/hooks-query" title="Control queries and pagination with useTablePro" :height="810" deferred />

::: details View the query hook source
<<< ../../../admin/src/views/demo/tables/hooks-query.tsx
:::

### Cross-page selection and bulk actions {#跨页选择与批量操作}

Use **Select current page** on two pages, then **Deselect current page**. Only that page's keys are removed. Mark the remaining selected rows and return to the relevant page to check them. Sort rows, then use **Clear sorting** to see how the example calls the underlying method exposed by `getTableInstance()`.

<AdminExample path="/tables/hooks-selection" title="Cross-page selection and bulk marking with useTablePro" :height="790" deferred />

::: details View the selection hook source
<<< ../../../admin/src/views/demo/tables/hooks-selection.tsx
:::

### Export, print, and the instance lifecycle {#导出与打印的实例生命周期}

Download **Export current page as CSV** and **Export all loaded rows as CSV**, then compare the row counts. The latter uses `keepOriginalData` to export the entire supplied batch. In remote mode it does not fetch other pages. Click **Unmount table** to disable the actions, then mount it again to re-register the instance.

<AdminExample path="/tables/hooks-output" title="CSV scopes, printing, and instance mount state" :height="780" deferred />

::: details View the output hook source
<<< ../../../admin/src/views/demo/tables/hooks-output.tsx
:::

[Back to the TablePro API reference](./table-pro)
