# 架构地图

Ray Template 是前端中后台模板，包含可运行的组件与路由示例。Mock 只用于演示；接入真实业务时需要自己的后端、会话和权限校验。

## 启动链路

`index.html` → `src/main.ts` → Pinia → 国际化 → Router → Day.js → 全局指令 → `App.tsx`。`main.ts` 同时保留无界微前端挂载和卸载入口；调整启动顺序时检查这两条路径。

`src/App.tsx` 组合全局 Provider 与布局。布局位于 `src/layout`；全局 Naive UI 消息等实例由 `src/app-components/provider` 提供。不要在 Provider 初始化前使用 `window.$message` 等对象。

## 模块与扩展入口

| 需求           | 入口                                                                        | 相关约定                                                                           |
| -------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| 新增页面与菜单 | `src/views`、`src/router/modules`                                           | [路由文档](../src/router/README.md)，菜单由路由生成                                |
| 权限与守卫     | `src/router/utils/vue-router-register.ts`、`src/router/utils/permission.ts` | 同时检查菜单显示与实际导航；前端权限不能替代后端授权                               |
| 全局状态       | `src/store/modules`、`src/store/hooks`                                      | [Store 文档](../src/store/README.md)，持久化配置使用 `pick`/`omit`                 |
| 请求与接口     | `src/api`、`src/axios`                                                      | [请求文档](../src/axios/README.md)，请求/响应拦截器分开注册                        |
| 演示接口       | `mock/demo`、`mock/shared`                                                  | `vite-plugin-mock-dev-server`，生产环境按实际后端切换                              |
| 通用组件       | `src/components/base`、`src/components/pro`                                 | 组件、props、types、hook、样式放在同一功能目录                                     |
| 模板绑定组件   | `src/app-components`                                                        | [组件说明](../src/app-components/README.md)                                        |
| 公共工具       | `src/utils`                                                                 | [分包、兼容入口和测试](../src/utils/README.md)                                     |
| 组合式函数     | `src/hooks/web`、`template`、`components`                                   | [19 个 Hook 的示例与生命周期](../src/hooks/README.md)，回归测试在 `__test__/hooks` |
| 国际化         | `src/locales/lang`、`src/hooks/web/useI18n.ts`                              | [国际化说明](../src/locales/README.md)，中文和英文成对维护                         |
| 主题与全局样式 | `src/app-config/design-config.ts`、`src/styles`                             | 保留 CSS 变量和 Naive UI 明暗主题配置                                              |
| SVG 图标       | `src/icons`、`RIcon`                                                        | [图标说明](../src/icons/A_README.md)，名称与分包约定影响 symbol ID                 |
| 全局指令       | `src/directives/modules`                                                    | [注册约定](../src/directives/README.md)、[用法](../src/directives/README.DIR.md)   |
| 构建与插件     | `vite.config.ts`、`vite.plugin.config.ts`、`vite.custom.config.ts`          | 部署 base、输出目录、CDN、开发代理均在配置中管理                                   |
| 自动导入       | `vite.plugin.config.ts`、`unplugin`                                         | 首次构建可更新生成声明；生成声明需要随对应依赖变化一起提交                         |
| 测试           | `__test__`、`vitest.config.ts`                                              | Happy DOM 单元测试，不能证明真实浏览器布局、下载或打印正确                         |

## 数据与调用约束

- `src/app-config` 管理模板配置。运行时 `__APP_CFG__` 由 Vite 注入；`__DEV__` 表示 development 模式。
- 路径别名 `@`、`@api`、`@images`、`@mock` 在 Vite 和 TypeScript 中必须一致。
- `src/store/hooks` 是已有业务对 Store 的访问层；所有全局可变 UI 状态统一归入 Pinia：临时状态由 `runtime` 管理且不持久化，布局偏好在 `setting.layoutConfig` 中沿用原缓存 key。
- `src/utils/legacy-crypto`（原 `src/utils/c`）仍使用 CryptoJS 4.2.0 的同步 AES 格式。改用 Web Crypto 前需设计异步接口和历史密文迁移，不能直接替换并让既有数据无法解密。
- 演示页与业务组件同样属于模板能力。删除 demo 或更换第三方库前需要明确任务范围；升级工具链时应保留示例功能。

布局模式、配置与插槽见 [布局说明](../src/layout/README.md)。图标按包生成独立雪碧图，完整名称和严格类型由 `scripts/icons.mjs` 统一生成。

页面标题、配色与示例排版见 [视觉与排版](ui-design.md)；注释位置与格式遵循 [注释规范](comment-style.md)。

## TypeScript 项目配置

[根配置](../tsconfig.json) 引用应用、Node 和测试项目。严格模式、模块解析和类型检查别名集中在 [共享配置](../tsconfig.base.json)。修改别名时同步更新 `vite.custom.config.ts`。

| 配置                          | 检查范围                                           |
| ----------------------------- | -------------------------------------------------- |
| [应用](../tsconfig.app.json)  | `src`、Vue JSX 与自动生成声明                      |
| [Node](../tsconfig.node.json) | 构建与测试配置、`vite-helper`、`mock`              |
| [测试](../tsconfig.test.json) | `__test__` 与引用源码，加载 Happy DOM 和 Node 类型 |

`pnpm typecheck` 通过 `vue-tsc --build` 检查三个项目，增量缓存存放于 `node_modules/.cache/ray-template/`。需要完整重查时使用 `pnpm exec vue-tsc --build --force`。单独检查应用或测试可用 `pnpm exec vue-tsc -p tsconfig.app.json` 或 `pnpm exec vue-tsc -p tsconfig.test.json`，Node 配置可用 `pnpm exec tsc -p tsconfig.node.json`。
