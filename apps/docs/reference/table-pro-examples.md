# TablePro 在线示例

从纯表格开始，按需加入查询、分页、列设置或打印。以下示例使用 Ray Admin 的真实组件和演示数据，无需登录或连接业务接口。展开「运行示例」后才加载交互区域；窄屏可以在表格内横向滚动，也可以在新标签页打开。每个示例都附实际运行的源码。

<script setup>
import AdminExample from '../examples/AdminExample.vue'
</script>

| 想解决的问题                 | 建议从这里开始                                                                |
| ---------------------------- | ----------------------------------------------------------------------------- |
| 已经拿到了数据，只想展示     | [纯表格与本地排序](#纯表格与本地排序)                                         |
| 接口返回当前页和总数         | [远端查询与失败恢复](#远端查询与失败恢复)                                     |
| 由页面或查询库维护数据和分页 | [手动远端分页](#手动远端分页)                                                 |
| 组合筛选、校验和远程选项     | [高级搜索](#高级搜索)                                                         |
| 表格填满工作区，列多或数据多 | [自适应高度与虚拟滚动](#自适应高度与虚拟滚动) · [列设置与缓存](#列设置与缓存) |
| 定制操作区，或获取打印和 CSV | [自定义插槽与行菜单](#自定义插槽与行菜单) · [打印与 CSV](#打印与-csv)         |
| 从页面其他位置操作表格       | [实例与 Hooks](#实例与-hooks)                                                 |

## 纯表格与本地排序

点击「年龄」表头，在升序、降序和默认顺序间切换。表格只消费给定的 10 行；`bare` 隐藏标题和工具栏，并默认关闭分页。宽表通过 `scrollX` 保留列宽。

<AdminExample path="/tables/basic" title="纯表格与本地排序" :height="495" deferred />

::: details 查看纯表格源码
<<< ../../admin/src/views/demo/tables/basic.tsx
:::

## 远端查询与失败恢复

1. 复制某行姓名或邮箱的一部分，填入上方筛选区并提交。查询回到第 1 页，分页使用筛选后的总数。
2. 清除条件后排序「年龄」并翻页。年龄排序通过 `onUpdateSorter` 转成 `params.sortAge`，在分页前作用于整个结果集。
3. 分别在两页勾选行；工具栏显示跨页选中总数。「导出 CSV」依然导出当前页可见数据列。
4. 点击「模拟请求失败」，观察旧行清空和错误提示；点击「刷新」恢复。传给 `request` 的 `signal` 可转交给 HTTP 客户端。

<AdminExample path="/tables/remote" title="远端查询、服务端排序与重试" :height="695" deferred />

::: details 查看远端查询源码
<<< ../../admin/src/views/demo/tables/remote.tsx
:::

## 手动远端分页

此例用本地数据模拟外部接口，只向表格传入当前页。先翻到第 2 页，再按姓名筛选；页码会回到第 1 页，总数随条件更新。改变每页条数也会回到第 1 页。

页面拥有 `page`、`pageSize` 和 `itemCount`，通过分页回调与 `onSearch` 更新。接入异步服务时，在这一层维护加载、取消和错误；希望由 TablePro 管理这些状态时，使用上一个示例的 `request`。

<AdminExample path="/tables/controlled" title="页面控制远端分页和查询结果" :height="670" deferred />

::: details 查看受控分页源码
<<< ../../admin/src/views/demo/tables/controlled.tsx
:::

## 高级搜索

此例可在本地匹配和模拟远端之间切换。每次操作后比较下方的「草稿」「已应用条件」「转换后的参数」和「实际列表请求」：

1. **组合条件**：添加状态多选和创建日期区间后提交。远端请求中的日期会拆成 `createdFrom` 和 `createdTo`，翻页继续沿用这些条件。
2. **联动和取消**：快速切换北区和南区。负责人草稿会清空，旧的候选请求会取消。在南区候选项中搜索「王雨」。
3. **零值与布尔值**：点击「交付与金额」，应用条件后展开订单。查看商品级联、仓库树、配送控件和日期时间字段如何配合，确认参数保留 `minAmount: 0` 与 `invoiced: false`。
4. **校验与自动查询**：提交单字符关键词，确认旧结果仍在；修正输入后切换为输入后自动应用，连续编辑观察防抖。
5. **分别恢复失败**：让负责人候选或列表失败一次。候选可在字段处重试，列表可再次提交。

<AdminExample path="/tables/search" title="组合条件、远程选项和高级搜索" :height="960" deferred />

::: details 查看高级搜索、业务 API 及演示数据源码
<<< ../../admin/src/views/demo/tables/search.tsx

<<< ../../admin/src/api/demo/data.ts

<<< ../../admin/src/mocks/data/orders.ts
:::

## 自适应高度与虚拟滚动

打开虚拟滚动，再分别显示表格底部和操作区。列表区域会为新增内容让出高度，分页留在表格下方。在新标签页改变窗口高度，对比搜索区展开与收起时的可用空间。虚拟滚动仅减少渲染的行；当前页、已加载数据和导出范围仍按原规则计算。

<AdminExample path="/tables/auto-height" title="自适应高度、虚拟滚动和底部插槽" :height="640" deferred />

::: details 查看自适应高度源码
<<< ../../admin/src/views/demo/tables/auto-height.tsx
:::

## 列设置与缓存

1. 打开工具栏的列设置。分别隐藏「姓名」和「邮箱」；两个子列都隐藏后，「联系方式」组标题也会消失。
2. 拖动根列，或用上下移动按钮排序。带宽度的列可固定到首尾；打开可调宽后，在表头拖动列边界。
3. 点击恢复列布局，顺序、固定位置和宽度设置回到初始布局，显隐选择保留。
4. 在新标签页运行示例，隐藏一列后刷新同一标签页；`columnStateKey` 保存显隐。示例使用独立会话缓存。正式应用可在 key 中加入租户或账户标识。
5. 切换「启用 ID 字段」查看业务列定义变化。数据列和分组使用稳定 key，选择列不进入可见数据列设置。

<AdminExample path="/tables/columns" title="分组列、显隐、固定和宽度" :height="680" deferred />

::: details 查看列设置源码
<<< ../../admin/src/views/demo/tables/columns.tsx
:::

## 自定义插槽与行菜单

在自定义表单里用邮箱筛选，表单通过 `filters` 插槽的 `submit(values)` 提交。尝试用标题区的按钮回到第 1 页、改成每页 20 条，再勾选行并用底部动作清除。右键点击某行可执行示例菜单动作，回调会收到该行的数据。

<AdminExample path="/tables/custom" title="自定义筛选、页脚、操作区和行右键菜单" :height="690" deferred />

::: details 查看自定义插槽源码
<<< ../../admin/src/views/demo/tables/custom.tsx
:::

## 打印与 CSV

先按姓名筛选，或在列设置中隐藏一列。点击工具栏的打印图标，预览当前页可见数据列。再点击「打印独立摘要」，预览 `print({ target })` 指向的自定义区域；该区域可有自己的版式。只需查看时，在浏览器的打印对话框选择取消即可。

<AdminExample path="/tables/printing" title="打印当前页与打印自定义区域" :height="710" deferred />

::: details 查看打印及其样式源码
<<< ../../admin/src/views/demo/tables/printing.tsx

<<< ../../admin/src/views/demo/tables/printing.scss
:::

如需比较 CSV 的两种范围，在下方的[导出与打印的实例生命周期](#导出与打印的实例生命周期)例子中下载并打开两个文件。

## 实例与 Hooks

### 查询、重试与分页

先切到第 2 页，再比较「刷新当前页」和「回首页并刷新」。使用模拟失败按钮观察 `queryState` 的加载、失败和总数变化，并用刷新恢复。提交姓名条件后，示例会显示实际发出的参数。快速切换页码可以观察最新请求的结果。

<AdminExample path="/tables/hooks-query" title="用 useTablePro 控制查询和分页" :height="810" deferred />

::: details 查看查询 Hook 源码
<<< ../../admin/src/views/demo/tables/hooks-query.tsx
:::

### 跨页选择与批量操作

在两页分别点「选中本页」，再点「取消本页选择」。只有该页的 key 会被移除；对其余行批量标记后，返回相应页面核对结果。排序后点「清除排序」，查看如何调用 `getTableInstance()` 暴露的底层方法。

<AdminExample path="/tables/hooks-selection" title="用 useTablePro 完成跨页选择和批量标记" :height="790" deferred />

::: details 查看选择 Hook 源码
<<< ../../admin/src/views/demo/tables/hooks-selection.tsx
:::

### 导出与打印的实例生命周期

下载「导出当前页 CSV」和「导出全部已加载数据 CSV」并比较行数。前者只包含当前页，后者使用 `keepOriginalData` 导出传入表格的整批数据；远端模式下它不会自动请求其他页。点击卸载后观察操作按钮禁用，重新挂载会再次注册实例。

<AdminExample path="/tables/hooks-output" title="CSV 范围、打印和实例挂载状态" :height="780" deferred />

::: details 查看输出 Hook 源码
<<< ../../admin/src/views/demo/tables/hooks-output.tsx
:::

[返回 TablePro API 参考](./table-pro)
