# Components {#组件}

Import shared components from `@ray-template/ui` or use subpaths such as `/table-pro` and `/barcode`. Inside Ray Admin you can also use `@/components`. The route transition lives in `@ray-template/admin-shell`, and the application supplies current route and cache state. This reference lists props, slots, and events the template adds, overrides, or uses. For inherited functionality, consult the types in the pinned Naive UI dependency.

| Component                                             | Props type                        | Purpose                                                                                       |
| ----------------------------------------------------- | --------------------------------- | --------------------------------------------------------------------------------------------- |
| [RTablePro](./table-pro)                              | `TableProProps`                   | Bare tables, remote queries, automatic height, column settings, export, and optional printing |
| [RForm](./components/form)                            | `FormProps`                       | Form loading, validation, reset, and keyboard submission                                      |
| [RModal](./components/modal)                          | `ModalProps`                      | Controlled modal, preset widths, and fullscreen cards                                         |
| [RChart](./components/chart)                          | `ChartProps`                      | ECharts initialization, themes, and export                                                    |
| [RFlow](./components/flow)                            | `FlowProps`                       | LogicFlow diagrams and read-only mode                                                         |
| [RCollapseGrid](./components/collapse-grid)           | `CollapseGridProps`               | Collapsible filters with action columns                                                       |
| [RSegment](./components/segment)                      | `SegmentProps`                    | Segmented options, icons, and tooltips                                                        |
| [RMoreDropdown](./components/more-dropdown)           | `MoreDropdownProps`               | Icon menus and row actions                                                                    |
| [RIframe](./components/iframe)                        | `IframeProps`                     | Embedded pages with loading state                                                             |
| [RBarcode](./components/barcode)                      | `BarcodeProps`                    | Canvas and SVG barcodes                                                                       |
| [RDraggableCard](./components/draggable-card)         | `DefaultPosition` (position type) | Draggable card and movement boundaries                                                        |
| [RTransitionComponent](./components/route-transition) | `TransitionComponentProps`        | Route transitions and KeepAlive                                                               |
| [RIcon](./icons#ricon-api)                            | `IconProps`                       | Typed SVG sprites                                                                             |

Import [App Components and Providers](./components/app) by file. These use template state, themes, or routing. [QR codes](./components/qr-code) use `vue3-next-qrcode` directly.

Each component directory contains its implementation, styles, and types. Prop definitions such as `formProps`, `modalProps`, and `chartProps` also have named exports. Application code normally uses the component and public prop types. To get a TablePro instance directly, use a component ref. `RForm`, `RChart`, and `RFlow` use their respective `onRegister` contracts.

[Public exports](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/index.ts) · [Component conventions](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/components/README.md) · [Example source](https://github.com/XiaoDaiGua-Ray/ray-template/tree/main/apps/admin/src/views/demo)
