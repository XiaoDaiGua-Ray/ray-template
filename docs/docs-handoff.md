# 站外文档交接

应用仓库维护实现、兼容边界和可运行示例；[ray-template-doc](https://github.com/XiaoDaiGua-Ray/ray-template-doc) 负责读者指南、迁移步骤、站点导航和视觉。站外文档基于明确的源码提交，站点构建不读取本机应用仓库。

本轮基线：`548de9427d59502cdc7f06b86943f8c0dba9f907`；包版本为 `5.2.5`，迁移对照标签为 `v5.2.4`。这里记录的是源码行为；是否打标签和发布需要另行核实。

| 领域                | 应用侧证据                                                                                                                           | 必须交代的边界                                                                                                                                                         |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 组件入口与 TablePro | [公开导出](../src/components/index.ts)、[TablePro 契约](../src/components/RTablePro/README.md)、[六个示例](../src/views/demo/tables) | `base/`、`pro/` 深层路径失效；`RTable`、`useTable`、`useTablePro` 已移除。远端 `total` 是筛选后的总数；取消依赖请求函数传递 signal；导出和打印默认仅当前页可见数据列。 |
| 路由与权限          | [路由说明](../src/router/README.md)、[路由类型](../src/router/types.ts)、[权限守卫](../src/router/utils/permission.ts)               | 菜单显隐不等于访问授权；会话和接口权限由后端校验。缓存需要路由 name 对应组件 name，验证菜单进入、直达和刷新。                                                          |
| 布局与 Pinia        | [布局插槽和偏好](../src/layout/README.md)、[Store 约定](../src/store/README.md)                                                      | 全局 UI 单例已迁入 `runtime`，不持久化。保留历史设置和锁屏格式；自定义内容插槽时，由接入方负责保留请求取消及路由缓存。                                                 |
| 请求与 Mock         | [Axios 实现](../src/axios/instance.ts)、[取消器](../src/axios/utils/RequestCanceler.ts)、[人员查询](../src/api/demo/mock/person.ts)  | 实例成功返回 body，失败拒绝；调用方传 signal 时关闭模板的默认 signal 注入。Mock HTTP 仅用于开发，静态演示有独立本地数据分支。                                          |
| Hooks、工具与图标   | [Hooks 行为](../src/hooks/README.md)、[工具兼容入口](../src/utils/README.md)、[图标生成](../src/icons/A_README.md)                   | `@/hooks` 与 `@/utils` 公共入口保留；旧裸图标仅在缓存读取边界按唯一名称迁移。截图和打印测试不代表原生浏览器能力验收。                                                  |
| 工具链与部署        | [工具链记录](toolchain-upgrade.md)、[架构地图](architecture.md)、[Vite 配置](../vite.custom.config.ts)                               | Node/pnpm 以清单为准。应用默认 base 为 `/ray-template/`，站外文档为 `/ray-template-doc/`；应用生产部署上传 `dist/production`。                                         |

## 联动流程

1. 应用改动影响公开导入、配置、缓存或行为时，先更新所属模块的 README 和示例，写清旧用法、新用法、兼容性及回归路径。记录已验证的应用提交；可从 `pnpm harness context` 定位任务域。
2. 文档仓库在对应变更中标注应用提交，按任务组织教程，给关键说法附固定提交的源码链接。破坏性改动进入迁移清单；旧 URL 映射到新版主题，旧正文可从历史提交查阅。
3. 应用运行 `pnpm harness verify`；文档运行 `pnpm build` 并预览生产子路径，检查导航、搜索、旧链接、明暗主题和窄屏。两个仓库的变更互相链接。发布前确认文档引用的应用提交已可访问，且在线演示已部署相应能力。

## 动态路由与示例页交接

应用侧已准备好 [路由接入文档](../src/router/README.md)、[Schema](../src/router/config/schema.ts)、[Segment 说明](../src/components/RSegment/README.md) 和 [页面设计说明](ui-design.md)。应用提交可访问后，在站外的 `guide/routing.md` 补充来源切换、接口示例和版本校验，在组件参考中补充 `fitContent` 的选中态与过渡规则。站外截图使用更新后的登录页与管理页，并核对部署子路径。

布局与路由编辑器交付后，站外 `guide/layout.md` 补充右侧导航、通栏分组、减少动态效果和浮动退出按钮；`guide/routing.md` 增加可视化与 JSON 两个入口，明确可视化应用仅保存在当前浏览器；`reference/hooks/layout.md` 说明加载提示以可见内容区为基准。引用对应的应用提交后再验证文档站构建和预览。

站外 `guide/layout.md` 同步设置抽屉的偏好导入导出：JSON 只包含抽屉内偏好，校验通过后即时保存，独立于路由管理的 JSON 配置。
