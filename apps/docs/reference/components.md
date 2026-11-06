# 组件

通用组件从 `@ray-template/ui` 导入，也可用 `/table-pro`、`/barcode` 等子路径按需加载。Ray Admin 内可以使用 `@/components`。路由过渡位于 `@ray-template/admin-shell`，由应用接入当前路由和缓存状态。许多组件包装 Naive UI：本文列出模板添加、改写或消费的属性、插槽和事件，原始控件的其余能力以锁定依赖的类型为准。

| 组件                                                  | Props 类型                    | 主要用途                                             |
| ----------------------------------------------------- | ----------------------------- | ---------------------------------------------------- |
| [RTablePro](./table-pro)                              | `TableProProps`               | 纯表格、远端查询、自适应高度、列设置、导出及可选打印 |
| [RForm](./components/form)                            | `FormProps`                   | 表单加载、校验、重置和键盘提交                       |
| [RModal](./components/modal)                          | `ModalProps`                  | 受控弹窗、预设宽度和全屏卡片                         |
| [RChart](./components/chart)                          | `ChartProps`                  | ECharts 初始化、主题和导出                           |
| [RFlow](./components/flow)                            | `FlowProps`                   | LogicFlow 流程图与只读切换                           |
| [RCollapseGrid](./components/collapse-grid)           | `CollapseGridProps`           | 可折叠筛选区及操作列                                 |
| [RSegment](./components/segment)                      | `SegmentProps`                | 分段选项、图标和提示                                 |
| [RMoreDropdown](./components/more-dropdown)           | `MoreDropdownProps`           | 图标菜单、行操作                                     |
| [RIframe](./components/iframe)                        | `IframeProps`                 | 外部页面与加载状态                                   |
| [RBarcode](./components/barcode)                      | `BarcodeProps`                | Canvas / SVG 条码                                    |
| [RDraggableCard](./components/draggable-card)         | `DefaultPosition`（位置类型） | 可拖动卡片与拖动边界                                 |
| [RTransitionComponent](./components/route-transition) | `TransitionComponentProps`    | 路由过渡与 KeepAlive                                 |
| [RIcon](./icons#ricon-api)                            | `IconProps`                   | 类型化 SVG 雪碧图                                    |

[应用组件与 Provider](./components/app) 使用模板的状态、主题或路由，按文件导入。[二维码](./components/qr-code) 使用 `vue3-next-qrcode`，不属于 `@/components` 的导出。

组件实现、样式和类型放在同一个组件目录。组件属性对象也有具名导出，例如 `formProps`、`modalProps`、`chartProps`；业务代码通常直接使用组件和公开 Props 类型。`TablePro` 统一使用组件 ref 获取实例，`RForm`、`RChart`、`RFlow` 使用各自的 `onRegister` 契约。

[公开导出](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/index.ts) · [组件约定](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/components/README.md) · [示例源码](https://github.com/XiaoDaiGua-Ray/ray-template/tree/main/apps/admin/src/views/demo)
