# 架构地图

Ray Template 是前端中后台模板，包含可运行的组件与路由示例。Mock 只用于演示；接入真实业务时需要自己的后端、会话和权限校验。

Ray Template 由一个 pnpm workspace 管理。**Ray Admin** 位于 `apps/admin`，在应用入口接入路由、会话、主题和数据。**文档**位于 [apps/docs](../apps/docs/README.md)，直接使用共享包的公开入口。

| 工作区                      | 公开职责                                                                         |
| --------------------------- | -------------------------------------------------------------------------------- |
| `@ray-template/utils`       | 精度、类型判断、数据与文件工具，以及接收存储实现的 JSON 读写。                   |
| `@ray-template/composables` | 可独立使用的 Vue Hooks、元素与作用域工具。                                       |
| `@ray-template/directives`  | Vue 指令与注册器。复制提示由宿主提供。                                           |
| `@ray-template/icons`       | SVG 资源、清单、图标名称类型与查询。                                             |
| `@ray-template/ui`          | 可复用组件及主题样式。TablePro、图表和条码支持按入口导入。                       |
| `@ray-template/http`        | 每个客户端独立的请求拦截和取消。                                                 |
| `@ray-template/routing`     | 路由配置校验、路由展开和菜单遍历。页面注册表由应用传入。                         |
| `@ray-template/admin-shell` | 布局框架、布局设置、路由过渡和页面缓存渲染。宿主传入导航、内容、偏好和路由状态。 |

应用的 `@/components`、`@/hooks` 和 `@/utils` 继续作为模板中的导入入口。共享包声明直接依赖，公开入口通过 `exports` 控制。`pnpm packages:check` 检查跨包导入和循环依赖，独立 TypeScript 项目检查共享包能脱离应用的路径别名和全局声明。

## 启动链路

`apps/admin/index.html` → `apps/admin/src/main.ts` → Pinia → 国际化 → Router → Day.js → 全局指令 → `App.tsx`。`main.ts` 同时保留无界微前端挂载和卸载入口；调整启动顺序时检查这两条路径。

`src/App.tsx` 组合全局 Provider 与布局。布局位于 `src/layout`；全局 Naive UI 消息等实例由 `src/app-components/provider` 提供。不要在 Provider 初始化前使用 `window.$message` 等对象。

## 模块与扩展入口

| 需求           | 入口                                                                        | 相关约定                                                                                               |
| -------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| 新增页面与菜单 | `src/views`、`src/router/modules`                                           | [路由文档](../apps/admin/src/router/README.md)，菜单由路由生成                                         |
| 权限与守卫     | `src/router/utils/vue-router-register.ts`、`src/router/utils/permission.ts` | 同时检查菜单显示与实际导航；前端权限不能替代后端授权                                                   |
| 全局状态       | `src/store/modules`、`src/store/hooks`                                      | [Store 文档](../apps/admin/src/store/README.md)，持久化配置使用 `pick`/`omit`                          |
| 请求与接口     | `src/api`、`src/axios`                                                      | [请求文档](../apps/admin/src/axios/README.md)，请求/响应拦截器分开注册                                 |
| 演示接口       | `mock/demo`、`src/demo-data`                                                | `vite-plugin-mock-dev-server`，生产环境按实际后端切换                                                  |
| 通用组件       | `src/components`                                                            | 组件、props、types、hook、样式放在同一功能目录                                                         |
| 模板绑定组件   | `src/app-components`                                                        | [组件说明](../apps/admin/src/app-components/README.md)                                                 |
| 公共工具       | `src/utils`                                                                 | [分包、兼容入口和测试](../apps/admin/src/utils/README.md)                                              |
| 组合式函数     | `src/hooks/web`、`template`、`components`                                   | [19 个 Hook 的示例与生命周期](../apps/admin/src/hooks/README.md)，回归测试在 `__test__/hooks`          |
| 国际化         | `src/locales/lang`、`src/hooks/web/useI18n.ts`                              | [国际化说明](../apps/admin/src/locales/README.md)，中文和英文成对维护                                  |
| 主题与全局样式 | `src/app-config/design-config.ts`、`src/styles`                             | 保留 CSS 变量和 Naive UI 明暗主题配置                                                                  |
| SVG 图标       | `src/icons`、`RIcon`                                                        | [图标说明](../packages/icons/src/A_README.md)，名称与分包约定影响 symbol ID                            |
| 全局指令       | `src/directives/modules`                                                    | [注册约定](../apps/admin/src/directives/README.md)、[用法](../apps/admin/src/directives/README.DIR.md) |
| 构建与插件     | `vite.config.ts`、`vite.plugin.config.ts`、`vite.custom.config.ts`          | 部署 base、输出目录、CDN、开发代理均在配置中管理                                                       |
| 自动导入       | `vite.plugin.config.ts`、`unplugin`                                         | 首次构建可更新生成声明；生成声明需要随对应依赖变化一起提交                                             |
| 测试           | `__test__`、`vitest.config.ts`                                              | Happy DOM 单元测试，不能证明真实浏览器布局、下载或打印正确                                             |

## 数据与调用约束

- `src/app-config` 管理模板配置。运行时 `__APP_CFG__` 由 Vite 注入；`__DEV__` 表示 development 模式。
- 路径别名 `@`、`@api`、`@images`、`@mock` 在 Vite 和 TypeScript 中必须一致。
- `src/store/hooks` 是已有业务对 Store 的访问层；所有全局可变 UI 状态统一归入 Pinia：临时状态由 `runtime` 管理且不持久化，布局偏好在 `setting.layoutConfig` 中沿用原缓存 key。
- `src/utils/legacy-crypto`（原 `src/utils/c`）仍使用 CryptoJS 4.2.0 的同步 AES 格式。改用 Web Crypto 前需设计异步接口和历史密文迁移，不能直接替换并让既有数据无法解密。
- 演示页与业务组件同样属于模板能力。删除 demo 或更换第三方库前需要明确任务范围；升级工具链时应保留示例功能。

布局模式、配置与插槽见 [布局说明](../apps/admin/src/layout/README.md)。图标按包生成独立雪碧图，完整名称和严格类型由 `scripts/icons.mjs` 统一生成。

页面标题、配色与示例排版见 [视觉与排版](ui-design.md)；注释位置与格式遵循 [注释规范](comment-style.md)。

## TypeScript 项目配置

[根配置](../tsconfig.json) 引用应用、Node 和测试项目。严格模式、模块解析和类型检查别名集中在 [共享配置](../tsconfig.base.json)。修改别名时同步更新 `vite.custom.config.ts`。

| 配置                          | 检查范围                                           |
| ----------------------------- | -------------------------------------------------- |
| [应用](../tsconfig.app.json)  | `src`、Vue JSX 与自动生成声明                      |
| [Node](../tsconfig.node.json) | 构建与测试配置、`vite-helper`、`mock`              |
| [测试](../tsconfig.test.json) | `__test__` 与引用源码，加载 Happy DOM 和 Node 类型 |

`pnpm typecheck` 通过 `vue-tsc --build` 检查三个项目，增量缓存存放于 `node_modules/.cache/ray-template/`。需要完整重查时使用 `pnpm exec vue-tsc --build --force`。单独检查应用或测试可用 `pnpm exec vue-tsc -p tsconfig.app.json` 或 `pnpm exec vue-tsc -p tsconfig.test.json`，Node 配置可用 `pnpm exec tsc -p tsconfig.node.json`。

## Deployment and search discovery

`pnpm build` 生成 `dist/production`，`pnpm pages:build` 将后台与文档组合到 `dist/pages`；将该目录的内容部署到 `vite.custom.config.ts` 中 `base` 对应的路径。默认路径为 `/ray-template/`，部署在域名根目录时改用 `/`。

从 `dist` 分支发布 GitHub Pages 时，Vite 会将 `public/.nojekyll` 复制到产物根目录。手动上传产物时也要保留此文件，让 Pages 跳过 Jekyll，避免过滤 `_toKey-*.js` 等以下划线开头的文件。[GitHub Pages 发布说明](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)

官方 GitHub Pages 部署会设置 `RAY_TEMPLATE_SITE_ORIGIN=https://xiaodaigua-ray.github.io`。如需让自己的公开部署被搜索引擎检索，在生产构建中设置该变量为实际站点源地址，例如 `https://example.com`，路径由 Vite 的 `base` 提供。在 fork 的 GitHub Actions 中可以使用同名的仓库变量。未设置时，构建输出 `noindex`，适合预览和内部部署。

公开构建在 HTML 中输出页面描述、规范链接（canonical）和分享预览，并生成 `sitemap.xml`。站点地图只列出公开首页；登录后的 hash 路由仍用作交互演示。可在 [Google Search Console](https://search.google.com/search-console/about) 提交部署路径下的 sitemap。若管理整个域名，也可从域名根目录的 `/robots.txt` 指向 sitemap；子目录里的 `robots.txt` 不会被识别。
