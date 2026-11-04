# 架构地图

Ray Template 是一个 pnpm workspace：后台负责宿主集成，文档站解释公开用法，共享包拥有可复用实现。按功能定位文件从[任务索引](../llms.txt)进入；本页用于判断代码归属和追踪跨模块调用。

## 工作区

| 目录                                                                          | 职责与权威入口                                                                                        |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| [apps/admin](../apps/admin)                                                   | Ray Admin。应用配置、路由注册、Pinia、Provider、页面、演示数据与开发 Mock。Vite 的应用根目录是这里。  |
| [apps/docs](../apps/docs/README.md)                                           | VitePress 站点。读者指南、API、迁移和交互示例，消费共享包公开入口。                                   |
| [packages](../packages)                                                       | 下表列出的共享包；根入口和可导入子路径由各自的 `package.json#exports` 定义。                          |
| [**test**](../__test__)                                                       | Vitest 回归，按行为分类而非逐一镜像源码目录。通过 [Harness 任务域](../harness/scopes.json) 反查覆盖。 |
| [docs](./)、[harness](../harness/README.md)                                   | 维护者约定与跨模块说明；Harness 管理任务导航、定向验证与证据。对外文档属于 `apps/docs`。              |
| [scripts](../scripts)、[vite-helper](../vite-helper)、[unplugin](../unplugin) | 仓库级检查、Vite 插件辅助和自动导入的生成声明。根目录保留构建、类型和 CI 配置。                       |

| 共享包                                                            | 实现归属                                       | 宿主边界                                                        |
| ----------------------------------------------------------------- | ---------------------------------------------- | --------------------------------------------------------------- |
| [@ray-template/utils](../packages/utils/package.json)             | 精度、类型判断、数据与文件工具、通用 JSON 存储 | 调用方提供 Storage；应用的 key、缓存后端和旧 AES 格式留在应用。 |
| [@ray-template/composables](../packages/composables/package.json) | Vue 组合式函数、DOM、元素与作用域工具          | 应用专用导航、主题和内容区 Hooks 留在应用。                     |
| [@ray-template/directives](../packages/directives/package.json)   | Vue 指令与注册器                               | 宿主提供复制提示，并选择何时注册。                              |
| [@ray-template/icons](../packages/icons/package.json)             | SVG、清单、图标名类型与查询                    | 构建将资源生成雪碧图，宿主提供图标解析服务。                    |
| [@ray-template/ui](../packages/ui/package.json)                   | 通用组件、共享主题及 UI 服务接口               | 后台注入翻译、主题、存储等；应用组件入口转导出通用组件。        |
| [@ray-template/http](../packages/http/package.json)               | 独立 HTTP 客户端、拦截器和取消机制             | 应用传入请求配置和拦截器，封装实际业务 API。                    |
| [@ray-template/routing](../packages/routing/package.json)         | 路由配置校验、路由展开和菜单遍历               | 应用持有页面注册表、配置来源、角色、会话和守卫。                |
| [@ray-template/admin-shell](../packages/admin-shell/package.json) | 布局外壳、布局设置、过渡与页面缓存渲染         | 宿主提供路由状态、偏好、导航和内容插槽。                        |

应用侧 `@/components`、`@/hooks`、`@/utils` 有兼容入口。跟随实际导出判断实现归属。共享包不可依赖后台别名或跨 workspace 相对导入；[包边界检查](../scripts/check-package-boundaries.mjs)校验依赖声明、公开入口和循环依赖。

## 关键运行链路

| 链路           | 调用顺序与边界                                                                                                                                                                                                               | 继续阅读                                                                    |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 后台启动       | [index.html](../apps/admin/index.html) → [main.ts](../apps/admin/src/main.ts) → Pinia → 国际化 → Router → Day.js → 指令与自动补全设置 → 挂载 [App.tsx](../apps/admin/src/App.tsx)。普通和无界模式共用插件注册顺序。          | [布局与启动](../harness/context/layout.md)                                  |
| 导航与缓存     | [路由初始化](../apps/admin/src/router/index.ts)加载来源 → [应用模块](../apps/admin/src/router/app-route-modules.ts)展开配置 → 注册守卫和页面 → 应用菜单 Store 与布局消费路由。应用维护缓存名单，共享壳渲染过渡与 KeepAlive。 | [路由](../harness/context/routing.md)、[布局](../harness/context/layout.md) |
| 请求与演示数据 | [API](../apps/admin/src/api) → [应用 Axios 实例](../apps/admin/src/axios/instance.ts) → [共享客户端](../packages/http/src/client.ts)。开发 Mock 走 HTTP；静态人员演示可用本地数据。生产会话和资源授权由接入方后端负责。      | [API](../harness/context/api.md)                                            |
| 文档示例       | 文档可直接消费共享包；需要后台上下文时由 [AdminExample.vue](../apps/docs/examples/AdminExample.vue) 嵌入 [example.html](../apps/admin/example.html)，使用独立启动、限定路由和内存缓存。                                      | [文档与示例](../harness/context/docs.md)                                    |
| 应用配置       | [Vite](../vite.config.ts) 注入 `__APP_CFG__` 和 `__DEV__`；[应用配置](../apps/admin/src/app-config)按设计、请求、路由和缓存分组。                                                                                            | [构建与工具链](../harness/context/toolchain.md)                             |

公开行为变更按[应用与文档联动](docs-handoff.md)维护指南和可运行示例。页面排版见[视觉与排版](ui-design.md)；代码注释见[注释规范](comment-style.md)。

## TypeScript 项目配置

[根配置](../tsconfig.json)引用四个项目。严格模式、模块解析和类型检查别名集中在[共享配置](../tsconfig.base.json)。调整路径别名时同步核对 [Vite](../vite.custom.config.ts) 和 [Vitest](../vitest.config.ts)。

| 配置                                 | 检查范围                                                                                  |
| ------------------------------------ | ----------------------------------------------------------------------------------------- |
| [应用](../tsconfig.app.json)         | 后台 `apps/admin/src`、Vue JSX 和生成声明。                                               |
| [Node](../tsconfig.node.json)        | 根构建与测试配置、`vite-helper`、后台 Mock。                                              |
| [测试](../tsconfig.test.json)        | `__test__` 与引用源码，加载 Vitest 和 Node 类型。运行时环境由 Vitest 配置及测试文件决定。 |
| [共享包](../tsconfig.packages.json)  | `packages/*/src`，不继承应用别名或自动导入声明。                                          |
| [文档站](../apps/docs/tsconfig.json) | 独立检查文档示例，由 `pnpm docs:check` 执行。                                             |

`pnpm typecheck` 先检查图标同步，再通过 `vue-tsc --build` 检查根配置引用的四个项目；增量缓存位于 `node_modules/.cache/ray-template/`。单独检查可使用 `pnpm exec vue-tsc -p <配置文件>`。

## Deployment and search discovery

`pnpm build` 生成后台 `dist/production`；`pnpm docs:build` 生成 `apps/docs/.vitepress/dist`。`pnpm pages:build` 将两者合并到 `dist/pages`，文档放在其 `docs/` 下。后台默认 base 为 `/ray-template/`，文档默认 base 为 `/ray-template/docs/`。自建根路径或其他子路径时，同步核对[后台 base](../vite.custom.config.ts)、[文档 base](../apps/docs/.vitepress/config.mts)和[旧站跳转目标](../scripts/assemble-pages.mjs)。

[CI](../.github/workflows/ci.yaml)在主分支检查通过后将组合产物发布到 `dist` 分支。[后台 public 中的 .nojekyll](../apps/admin/public/.nojekyll)会随产物复制；手动部署到 Pages 时保留它，以便加载带下划线前缀的资源。

公开构建用 `RAY_TEMPLATE_SITE_ORIGIN` 配置实际站点源地址，路径由 base 提供。未设置时，后台生产构建输出 `noindex`。公开后台首页生成 canonical、分享预览和 `sitemap.xml`，不把登录后的 hash 路由列为公开页面。域名级抓取规则由站点根目录的 `/robots.txt` 管理。站内旧链接由 [VitePress 映射](../apps/docs/.vitepress/legacy.mts)生成；配置站点源地址时，合并脚本另生成 `dist/legacy-docs`，供旧站迁移使用。

只阅读已跟踪的源码和配置来判断实现。生成产物、依赖、缓存和 `.harness-local/` 报告适合查构建与验证结果。
