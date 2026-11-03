# 组件使用约定

可复用组件按名称放在 `src/components` 下；通过 `@/components` 导入组件和类型。优先复用 Naive UI 与现有组件，不把组件介绍复制到 `defineComponent` 前。

## 非显然的调用约束

- `RCollapseGrid` 基于 Naive UI Grid，子项需要使用 `NGridItem`。不要用普通容器替代 Grid 子项。
- `RChart` 与 `useChart` 负责实例初始化、销毁、尺寸与主题同步；调用方维护 ECharts options，需要的图表与组件按现有 ECharts 注册方式引入。
- `PageResult` 基于 Naive UI Result，可作为组件或错误页面使用，保留继承的 props 与 slots。
- [TablePro](RTablePro/README.md) 统一支持纯表格、搜索与分页及自适应高度。列顺序配置以第一层列为单位，深层子列跟随根列。
- `RIcon.name` 为生成的完整分包路径类型，图标改动会在开发、HMR 和构建时同步；不要手工修改生成清单。

组件样式随组件入口加载。调整 Naive UI 内部元素时，使用当前组件的类名限定作用范围；组件需填满容器时由调用处或组件自身声明尺寸。全屏 `RModal` 的卡片正文仅在溢出时滚动，`RBarcode` 的加载区域随条码尺寸或响应式容器伸缩。

示例见 `src/views/demo`；Hooks 的独立交互示例与生命周期约定见 [Hooks 文档](../hooks/README.md)。新增或修改注释遵循 [注释规范](../../docs/comment-style.md)，完整教程放在 README 与示例页。
