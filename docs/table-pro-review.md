# TablePro 代码审查 · 2026-11-05

基线：`d15966cf`。覆盖 RTablePro、TablePanel、useTablePro、搜索控件和状态、列设置、CSV/打印、样式、公开类型、应用与文档示例。下文保留基线发现，修复结果见文末。

P1 表示应在继续扩展前处理；P2 表示有明确的功能或使用限制；P3 表示可随相关改动处理。以下“复现”表示本地 Vitest 重现了现有行为，其余为源码推导。

## P1

1. **切换查询范围后仍能操作旧范围数据（复现）。** [TablePro.tsx](https://github.com/XiaoDaiGua-Ray/ray-template/blob/d15966cf637fe8bb6d488c45945a56c26b52e158/packages/ui/src/RTablePro/src/TablePro.tsx#L191-L257) 在 request、params 或分页条件改变时启动查询，但仅在成功时替换 result。先加载 `scope=a`，再切到返回错误的 `scope=b`，表格、total、`getCurrentPageData()` 和导出仍取 A。保留同范围刷新结果符合文档；如果范围代表账号、租户或订单，保留其他范围的结果会误导批量操作。建议把成功结果与查询快照绑定，至少在业务范围或数据源切换时清空或禁用操作；单独保留同范围失败时的旧数据。

## P2

2. **本地受控分页时，提交搜索和实例跳页无法落实（复现）。** [TablePro.tsx](https://github.com/XiaoDaiGua-Ray/ray-template/blob/d15966cf637fe8bb6d488c45945a56c26b52e158/packages/ui/src/RTablePro/src/TablePro.tsx#L266-L308) 只写内部 page；[渲染](https://github.com/XiaoDaiGua-Ray/ray-template/blob/d15966cf637fe8bb6d488c45945a56c26b52e158/packages/ui/src/RTablePro/src/TablePro.tsx#L423-L459) 优先用外部 `pagination.page`，而回调只由表格分页器动作触发。给定 `pagination.page=2`，提交搜索后传给 DataTable 的仍为 2。统一用户点击、搜索重置与实例操作的受控写入语义；文档区分 request 模式、手动远端与本地模式。
3. **相同字段类型换搜索规则，已生效的规则仍旧（复现）。** [search.ts](https://github.com/XiaoDaiGua-Ray/ray-template/blob/d15966cf637fe8bb6d488c45945a56c26b52e158/packages/ui/src/RTablePro/src/search.ts#L218-L231) 只按类型和 multiple 判断字段能否保留；[TablePro.tsx](https://github.com/XiaoDaiGua-Ray/ray-template/blob/d15966cf637fe8bb6d488c45945a56c26b52e158/packages/ui/src/RTablePro/src/TablePro.tsx#L324-L352) 把“能保留值”当成“无需重建快照”。把同一个字段的 `matches` 从恒真改为恒假，表中依然显示旧行。更新 `getValue`、`transform` 或 `visible` 也可能保留旧条件。值兼容检查和查询语义变更应分开，后者重建 predicate/params。
4. **搜索可见性或匹配函数异常绕过错误边界。** [useTableSearch.ts](https://github.com/XiaoDaiGua-Ray/ray-template/blob/d15966cf637fe8bb6d488c45945a56c26b52e158/packages/ui/src/RTablePro/src/useTableSearch.ts#L44-L56) 在调用 commit 前归一化，`visible` 抛错会让 submit Promise reject（复现）；[模板](https://github.com/XiaoDaiGua-Ray/ray-template/blob/d15966cf637fe8bb6d488c45945a56c26b52e158/packages/ui/src/RTablePro/src/components/Search.tsx#L255-L258) 未处理 rejection。另有 [TablePro.tsx](https://github.com/XiaoDaiGua-Ray/ray-template/blob/d15966cf637fe8bb6d488c45945a56c26b52e158/packages/ui/src/RTablePro/src/TablePro.tsx#L182-L187) 在 render 依赖的 computed 执行 `getValue/matches`，异常同样进不了 search-error。定义回调异常是开发者错误还是可恢复错误；如选择后者，在提交与执行谓词两处都保留上次有效结果并报告。
5. **本地列字段的读取规则与 Naive UI 和导出不一致。** [search.ts](https://github.com/XiaoDaiGua-Ray/ray-template/blob/d15966cf637fe8bb6d488c45945a56c26b52e158/packages/ui/src/RTablePro/src/search.ts#L289-L291) 用 `row[key]`，而 [CSV](https://github.com/XiaoDaiGua-Ray/ray-template/blob/d15966cf637fe8bb6d488c45945a56c26b52e158/packages/ui/src/RTablePro/src/csv.ts#L33-L40) 和 [打印](https://github.com/XiaoDaiGua-Ray/ray-template/blob/d15966cf637fe8bb6d488c45945a56c26b52e158/packages/ui/src/RTablePro/src/printing.ts#L89-L96) 用 lodash `get`。给嵌套对象配置 `key: 'customer.name'` 时，搜索不到界面上展示的值；当前需为字段显式提供 getValue。建议共享默认取值语义，保留显式 getValue 优先级。
6. **行右键菜单回调拿不到触发的行。** [TablePanel.tsx](https://github.com/XiaoDaiGua-Ray/ray-template/blob/d15966cf637fe8bb6d488c45945a56c26b52e158/packages/ui/src/RTablePro/src/TablePanel.tsx#L149-L168) 已拿到 row 和 index，但仅存坐标；[选择菜单项](https://github.com/XiaoDaiGua-Ray/ray-template/blob/d15966cf637fe8bb6d488c45945a56c26b52e158/packages/ui/src/RTablePro/src/TablePanel.tsx#L293-L299) 只发 key/option，无法安全用于行级编辑或删除，也没有键盘等价入口。将行上下文随回调提供并在关闭时清理，或明确该功能是表级菜单。
7. **自定义打印区域会丢失宿主样式及部分实时控件状态。** [printing.ts](https://github.com/XiaoDaiGua-Ray/ray-template/blob/d15966cf637fe8bb6d488c45945a56c26b52e158/packages/ui/src/RTablePro/src/printing.ts#L103-L116) 克隆 DOM，再放进仅有打印样式的 [独立 iframe](https://github.com/XiaoDaiGua-Ray/ray-template/blob/d15966cf637fe8bb6d488c45945a56c26b52e158/packages/ui/src/RTablePro/src/printing.ts#L155-L169)。如区域依赖应用 CSS、异步字体、canvas 像素或不可克隆的状态，预览与屏幕不一致。文档已有专用 `style` 选项，应补充其边界，并在 Chrome/Safari 验收报表和取消打印后的清理。

## P3

8. **本地搜索的热点可以减少分配与重复计算。** [search.ts](https://github.com/XiaoDaiGua-Ray/ray-template/blob/d15966cf637fe8bb6d488c45945a56c26b52e158/packages/ui/src/RTablePro/src/search.ts#L294-L330) 对每行重复计算搜索文本的小写，多选条件对数组使用嵌套线性查找；[联动](https://github.com/XiaoDaiGua-Ray/ray-template/blob/d15966cf637fe8bb6d488c45945a56c26b52e158/packages/ui/src/RTablePro/src/search.ts#L184-L213) 每改一个依赖再次扫描全部字段。预编译小写查询与 Set，字段量大时再为依赖建立反向索引；虚拟滚动只限制 DOM，不能降低过滤成本。这里未做大数据基准。
9. **分页宽度触发不必要更新，字典反复浅拷贝。** [TablePanel.tsx](https://github.com/XiaoDaiGua-Ray/ray-template/blob/d15966cf637fe8bb6d488c45945a56c26b52e158/packages/ui/src/RTablePro/src/TablePanel.tsx#L42-L46) 的 ResizeObserver 将连续宽度带入 [render](https://github.com/XiaoDaiGua-Ray/ray-template/blob/d15966cf637fe8bb6d488c45945a56c26b52e158/packages/ui/src/RTablePro/src/TablePanel.tsx#L210-L213)；只在跨过 600px 时改变分页模式即可。[locale.ts](https://github.com/XiaoDaiGua-Ray/ray-template/blob/d15966cf637fe8bb6d488c45945a56c26b52e158/packages/ui/src/RTablePro/src/locale.ts#L9-L17) 每次翻译先克隆整份字典，即使宿主翻译已命中。预建固定字典，宿主翻译优先。此项未做性能量化。
10. **公开 Props 的透传边界不易核对。** [props.ts](https://github.com/XiaoDaiGua-Ray/ray-template/blob/d15966cf637fe8bb6d488c45945a56c26b52e158/packages/ui/src/RTablePro/src/props.ts#L6-L23) 全量继承 Naive UI，再在 [TablePro](https://github.com/XiaoDaiGua-Ray/ray-template/blob/d15966cf637fe8bb6d488c45945a56c26b52e158/packages/ui/src/RTablePro/src/TablePro.tsx#L407-L440) 与 [TablePanel](https://github.com/XiaoDaiGua-Ray/ray-template/blob/d15966cf637fe8bb6d488c45945a56c26b52e158/packages/ui/src/RTablePro/src/TablePanel.tsx#L176-L199) 两次拆分。新增包装层字段或升级 Naive UI 时容易把不适用的选项暴露给调用方。优先明确哪些字段由包装层控制；补对受控分页、受控列及 slots 的契约用例。内部 `C.tsx`、`Props.tsx` 可按实际职责命名，减少检索成本。
11. **列工具只能拖拽排序，显示状态与布局恢复是两套语义。** [C.tsx](https://github.com/XiaoDaiGua-Ray/ray-template/blob/d15966cf637fe8bb6d488c45945a56c26b52e158/packages/ui/src/RTablePro/src/components/C.tsx#L136-L177) 提供鼠标拖拽和键盘勾选，没有键盘排序动作；“显示全部”仅清除隐藏状态，[顺序与固定列补丁](https://github.com/XiaoDaiGua-Ray/ray-template/blob/d15966cf637fe8bb6d488c45945a56c26b52e158/packages/ui/src/RTablePro/src/columns.ts#L44-L93) 仍保留。若需要完整恢复和键盘可操作，可添加显式上移/下移与独立的布局重置；目前仅持久化显隐符合文档。

## 保留的设计

请求成功前校验 `total` 和数据形状，AbortSignal 既透传给调用方又用于拦截过期结果。搜索草稿和生效快照分开，过期异步校验有版本号；列显隐不会直接修改 props，CSV 单元格做公式前缀防护，默认打印使用 textContent 和隔离 iframe。建议在修复中保留这些边界。

四个标注“复现”的路径使用 Vue Test Utils / Vitest 独立验证。复现用例与输出保存在本机 `.harness-local/table-pro-review-repro.local.spec.ts` 和 `.harness-local/table-pro-review-repro.log`；未将已知缺陷写成仓库的长期断言。真实性能、原生打印对话框及读屏软件不在本次运行验证范围。

## 修复批次

| 批次 | 项目  | 结果                                                                                                                                                                                  |
| ---- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | 1     | 以请求函数、有效筛选条件和分页绑定成功结果。范围切换立即失效，切页只保留同范围总数，请求失败后清空行和总数，展示空态并由宿主 Toast 提醒。结果不匹配时拦截取数、底层实例、CSV 和打印。 |
| 2    | 2–5   | 分页操作和搜索重置复用受控回调；兼容字段采用最新规则；回调失败统一报告并保留已生效条件；字段读取与 Naive UI、打印、CSV 一致。                                                         |
| 2    | 6–7   | 行菜单回传行和索引，支持键盘，换数据后关闭。自定义打印复制页面样式、根节点主题、普通表单状态和可复制的画布，等待资源有上限；允许关闭样式继承。                                        |
| 3    | 8–9   | 搜索预计算小写查询、集合和反向依赖；分页只在跨越容器宽度阈值时改变模式；语言回退字典固定复用。                                                                                        |
| 3    | 10–11 | 集中声明 Naive UI 与包装层的透传边界，命名列及外观设置组件；列排序增加键盘按钮，显隐和布局可分别恢复。                                                                                |

回归见 [查询、分页和行菜单](../__test__/components/table-pro.spec.ts)、[搜索](../__test__/components/table-pro-search.spec.ts)、[打印和导出](../__test__/components/table-pro-exports.spec.ts)及[列设置](../__test__/components/table-pro-columns.spec.ts)。受控表格与打印定制方式见 [TablePro 契约](../packages/ui/src/RTablePro/README.md)。手动远端由调用方管理其数据范围；原生打印对话框和页面性能的验证边界见交付记录。

追补：TablePanel 复用 Naive UI 卡片的表面、描边、圆角和内边距层次，`bare` 不带卡片外观。表格密度、斑马纹和边框以计算值合成，不镜像 props；保留的侦听负责重查、同步搜索配置、上报错误、取消打印及关闭行菜单。
