# 应用与文档联动

读者指南、迁移步骤和 API 参考在 [apps/docs](../apps/docs/README.md) 维护。VitePress 与应用共用 workspace 锁文件，从同一工作区加载交互示例。旧站内容和历史保留在 [ray-template-doc](https://github.com/XiaoDaiGua-Ray/ray-template-doc)。

官网当前面向 v6，源码链接使用 Monorepo 路径，发布构建时用 `RAY_TEMPLATE_SOURCE_REF` 固定到发布提交。页内示例随工作区源码构建。v5 的源码与发布标签见[版本分界](../apps/docs/migration.md)。

| 领域                | 应用侧证据                                                                                                                                                            | 必须交代的边界                                                                                                                                                         |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 组件入口与 TablePro | [公开导出](../apps/admin/src/components/index.ts)、[TablePro 契约](../apps/admin/src/components/RTablePro/README.md)、[六个示例](../apps/admin/src/views/demo/tables) | `base/`、`pro/` 深层路径失效；`RTable`、`useTable`、`useTablePro` 已移除。远端 `total` 是筛选后的总数；取消依赖请求函数传递 signal；导出和打印默认仅当前页可见数据列。 |
| 路由与权限          | [路由说明](../apps/admin/src/router/README.md)、[路由类型](../apps/admin/src/router/types.ts)、[权限守卫](../apps/admin/src/router/utils/permission.ts)               | 菜单显隐不等于访问授权；会话和接口权限由后端校验。缓存需要路由 name 对应组件 name，验证菜单进入、直达和刷新。                                                          |
| 布局与 Pinia        | [布局插槽和偏好](../apps/admin/src/layout/README.md)、[Store 约定](../apps/admin/src/store/README.md)                                                                 | 全局 UI 单例已迁入 `runtime`，不持久化。保留历史设置和锁屏格式；自定义内容插槽时，由接入方负责保留请求取消及路由缓存。                                                 |
| 请求与 Mock         | [Axios 实现](../apps/admin/src/axios/instance.ts)、[取消器](../apps/admin/src/axios/utils/RequestCanceler.ts)、[人员查询](../apps/admin/src/api/demo/mock/person.ts)  | 实例成功返回 body，失败拒绝；调用方传 signal 时关闭模板的默认 signal 注入。Mock HTTP 仅用于开发，静态演示有独立本地数据分支。                                          |
| Hooks、工具与图标   | [Hooks 行为](../apps/admin/src/hooks/README.md)、[工具兼容入口](../apps/admin/src/utils/README.md)、[图标生成](../packages/icons/src/A_README.md)                     | `@/hooks` 与 `@/utils` 公共入口保留；旧裸图标仅在缓存读取边界按唯一名称迁移。截图和打印测试不代表原生浏览器能力验收。                                                  |
| 工具链与部署        | [工具链记录](toolchain-upgrade.md)、[架构地图](architecture.md)、[Vite 配置](../vite.custom.config.ts)                                                                | Node/pnpm 以清单为准。应用 base 为 `/ray-template/`，内置文档为 `/ray-template/docs/`。已发布旧站仍使用 `/ray-template-doc/`。                                         |

## 联动流程

1. 应用改动影响公开导入、配置、缓存或行为时，在同一变更更新模块说明及 `apps/docs` 中受影响的文档和示例。破坏性改动进入迁移清单。
2. 交互和展示的代码使用同一个 `apps/docs/examples` 文件。优先用 workspace 包，复用应用组件时按模块导入，浏览器专用示例在客户端加载。
3. 运行 `pnpm harness verify`，再用 `pnpm docs:preview` 在 `/ray-template/docs/` 检查导航、搜索、旧路径、明暗主题、窄屏和交互。线上迁址另行验证新旧地址。

## 待同步到读者指南的内容

应用侧已准备好 [路由接入文档](../apps/admin/src/router/README.md)、[Schema](../apps/admin/src/router/config/schema.ts)、[Segment 说明](../apps/admin/src/components/RSegment/README.md) 和 [页面设计说明](ui-design.md)。在 `apps/docs/guide/routing.md` 补充来源切换、接口示例和版本校验，在组件参考中补充 `fitContent` 的选中态与过渡规则。截图使用更新后的登录页与管理页，并核对部署子路径。

`guide/layout.md` 补充右侧导航、通栏分组、减少动态效果和浮动退出按钮；`guide/routing.md` 增加可视化与 JSON 两个入口，明确可视化应用仅保存在当前浏览器；`reference/hooks/layout.md` 说明加载提示以可见内容区为基准。

`guide/layout.md` 同步设置抽屉的偏好导入导出：JSON 只包含抽屉内偏好，校验通过后即时保存，独立于路由管理的 JSON 配置。
