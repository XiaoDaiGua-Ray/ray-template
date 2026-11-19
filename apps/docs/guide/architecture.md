# v6 Monorepo 架构

Ray Template v6 使用同一个 pnpm workspace 管理 Ray Admin、VitePress 文档站和 10 个共享包。Ray Admin 负责登录、业务页面和应用状态。文档站用同一份组件源码运行示例，共享包通过公开入口提供可复用的实现。

## 工作区总览

```text
ray-template/
├─ apps/
│  ├─ admin/                Ray Admin
│  │  ├─ index.html         后台入口
│  │  ├─ example.html       文档示例入口
│  │  └─ src/
│  │     ├─ main.ts         应用启动
│  │     ├─ App.tsx         全局服务
│  │     ├─ app-config/     应用配置
│  │     ├─ app-components/ 宿主组件
│  │     ├─ locales/        中英文资源
│  │     ├─ router/         路由与守卫
│  │     │  └─ config/      配置源与视图表
│  │     ├─ store/          Pinia 状态
│  │     │  ├─ modules/     会话/菜单/偏好
│  │     │  └─ hooks/       状态读写入口
│  │     ├─ layout/         外壳适配
│  │     ├─ views/          业务和演示页面
│  │     ├─ api/            业务端点
│  │     │  ├─ admin/       管理端点
│  │     │  └─ demo/        示例查询
│  │     ├─ axios/          请求和拦截器
│  │     └─ mocks/          MSW 与演示状态
│  └─ docs/                 VitePress
│     ├─ .vitepress/
│     │  ├─ config.mts      站点配置
│     │  ├─ sidebar.mts     文档侧栏
│     │  ├─ legacy.mts      旧链接映射
│     │  └─ theme/          主题和样式
│     ├─ guide/             开发指南
│     ├─ reference/         API 参考
│     ├─ examples/          Vue 交互示例
│     └─ playground/        布局预览页面
├─ packages/
│  ├─ admin-shell/          布局外壳
│  ├─ routing/              路由与导航
│  ├─ ui/                   组件与主题
│  ├─ icons/                SVG 图标
│  ├─ http/                 请求与取消
│  ├─ api-contracts/        API 与路由契约
│  ├─ demo-data/            演示数据与查询
│  ├─ composables/          Vue Hooks
│  ├─ directives/           Vue 指令
│  └─ utils/                工具函数
├─ harness/                 任务索引与检查
└─ pnpm-lock.yaml           工作区锁文件
```

Ray Admin 使用图中的全部共享包。文档站直接引入组件、布局、路由等示例所需的包，需要完整后台上下文时通过 iframe 打开独立的示例入口。各应用在自己的 `package.json` 声明依赖，共用一份锁文件。 [工作区配置](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/pnpm-workspace.yaml) · [完整工程地图](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/docs/architecture.md)

<!-- fullstack:start -->

全栈源码还包含独立运行的 `apps/server`。 [服务端架构](#可选服务端怎样分层)

<!-- fullstack:end -->

## Ray Admin 怎么组装

### 启动与全局服务

```text
index.html → main.ts
               ↓
     安装 Pinia 和中英文语言包
               ↓
     恢复会话 → 初始化 Vue Router
               ↓
     安装 Day.js 和指令 → 挂载 App
               ↓
     App.tsx → 全局 Provider
               ↓
     RouterView → 当前路由页面
```

独立运行和无界子应用使用同一套插件安装流程。启动时先恢复会话，再决定是否加载账户路由。`src/app-config/` 集中提供主题、路由、请求和缓存配置。 [启动入口](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/main.ts) · [应用配置](../reference/configuration)

`App.tsx` 装配 Naive UI、全局样式、水印和加载状态，通过 `@ray-template/ui/services` 注入主题、翻译、图标地址、消息回调和列偏好存储。共享 UI 组件通过 `UiServices` 读取这些能力，因此文档示例也可以按自己的上下文使用组件。 [App 源码](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/App.tsx)

### 从路由配置到菜单和页面

```text
内置 JSON / 本地配置 / 远端配置
  ↓
router/config/source.ts   选择配置源
  ↓
api-contracts            校验路由结构
  ↓
routing + config/views.ts
  将 view ID 绑定到页面加载函数
  ↓
Vue Router + 应用守卫
  ├─→ store/menu → 菜单、标签、面包屑
  └─→ RLayout → AdminShell → 页面
```

- `router/` 负责注册登录页、系统页和当前账户的路由。内置配置来自 `demo-data`，应用在 `router/config/views.ts` 登记可加载的 `views/` 页面。导航守卫根据已核验的会话和路由权限判断能否进入页面。 [路由、菜单与权限](./routing)
- `store/` 按职责维护状态。`signing` 管理会话，`menu` 根据权限生成菜单并随路由同步标签和面包屑，`keep-alive` 维护页面缓存名单。`setting` 持久化选定的偏好字段，`runtime` 中的加载、抽屉和最大化状态随应用重新挂载而重建。应用通过 Store Hooks 读写这些状态。 [Store 参考](../reference/store)
- `layout/` 是后台对共享外壳的适配层。`RLayout` 将布局偏好和导航、内容等插槽交给 `AdminShell`。默认内容槽装配请求取消和路由过渡，过渡组件根据缓存配置和名单渲染 `KeepAlive`。 [应用布局与状态](./layout)

### 一次业务请求经过哪些层

```text
views/ 或 store/
  ↓  调用业务接口
api/admin/ 或 api/demo/
  ↓
axios/                应用拦截器
  ↓
@ray-template/http    Axios 实例
  ├─→ MSW → mocks/ → 演示数据
  └─→ HTTP → 接入的 API
```

`api/` 封装端点，管理端客户端处理会话传输，并用 `api-contracts` 校验响应。`axios/` 根据应用配置装配请求、响应和错误拦截器。`http` 为每个实例创建取消器，调用方可传入自己的 `AbortSignal`。 [接口、取消与 Mock](./requests)

本地开发和静态在线演示可走同一套 MSW HTTP Mock。`mocks/handlers.ts` 实现接口，`mocks/database.ts` 管理演示会话、用户和路由的读写，`demo-data` 提供初始数据和查询辅助。接入真实 API 后，由服务端核验会话并授权资源访问。 [服务端接入与标准契约](./backend)

## 文档怎样运行组件

```text
文档页面
├─ 直接渲染 examples/*.vue
│  └─ 共享包入口（如 ui/table-pro）
└─ 通过 AdminExample.vue 嵌入页面
   └─ admin/example.html
      └─ documentation-example.tsx
         └─ 允许展示的后台示例路由
```

- **直接运行。** 精度运算、条形码和 TablePro 等 Vue 示例导入共享包，Markdown 引用同一份 `.vue` 文件展示源码。TablePro 由示例传入本地行数据或可取消的模拟查询。布局实验使用单独的预览页面和内存路由。 [精度运算](../reference/utils/core#交互示例) · [条形码](../reference/components/barcode#交互示例) · [TablePro 示例](../reference/table-pro#交互示例) · [布局实验](./layout#在线布局实验)
- **嵌入后台示例。** 依赖后台布局或应用上下文的例子使用 `AdminExample.vue`。后台的 `example.html` 有独立启动入口、受限的示例路由和独立 Pinia 实例，普通应用缓存走内存，表格列显隐走单独的会话存储命名空间。 [文档站源码说明](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/docs/README.md)

<!-- fullstack:start -->

## 可选服务端怎样分层

`apps/server/src/main.ts` 启动独立的 NestJS HTTP 服务。`app.ts` 注册业务模块、平台中间件以及全局响应拦截器和异常过滤器。

```text
浏览器 /api 请求
  ↓
platform/ ─────────→ Redis
  ↓                  限流、演示缓存
NestJS 守卫与控制器
  ├─ auth / users / routes
  │  └─ Prisma → PostgreSQL
  └─ demo（按配置启用）
     └─ @ray-template/demo-data
```

- `modules/auth/` 管理认证与会话，并安装全局权限守卫。`modules/users/` 负责账户管理和部门、角色选项，`modules/routes/` 读取、过滤和保存路由配置。业务模块通过共享的 `api-contracts` 定义和校验 HTTP 数据。
- `infrastructure/database.ts` 封装 Prisma 访问。`prisma/` 下的 schema 和迁移定义 PostgreSQL 中的用户、凭据、权限、会话、路由配置和操作审计。会话及权限以数据库为准。
- `platform/` 管理 Redis、请求 ID、日志、安全中间件与健康检查。Redis 用于限流和部分可重建的演示读请求缓存。演示端点按部署配置启用，共用 `demo-data`。

`apps/server` 独立构建，包含在全栈源码发行包中。 [服务端源码说明](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/server/README.md) · [发行版本与快速启动](./distributions)

<!-- fullstack:end -->

## 各包负责什么

下图只画共享包之间的直接依赖，箭头从使用方指向被依赖方。图中的短目录名对应 `@ray-template/<包名>`。

```text
admin-shell
├─→ ui ───────┬─→ composables
│             ├─→ icons
│             └─→ utils
├─→ routing ──┬─→ api-contracts
│             ├─→ icons
│             └─→ utils
├─→ composables
└─→ icons

directives ──┬─→ composables
             └─→ utils
composables ───→ utils
http ──────────→ utils
demo-data ─────→ api-contracts
```

包通过 `package.json#exports` 声明可导入的入口。跨工作区优先按功能导入，例如 `@ray-template/ui/table-pro` 或 `@ray-template/utils/precision`。`rayTemplate.runtime` 区分 `browser`、`server` 与 `universal`。`api-contracts` 和 `demo-data` 是通用包，可供浏览器端和服务端使用，且只依赖同为通用的工作区。应用位于依赖图的消费端，各自通过公开入口组装功能。`pnpm packages:check` 检查工作区依赖、公开入口和循环依赖。 [包边界检查](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/scripts/check-package-boundaries.mjs)

### 界面、布局与路由

- **`@ray-template/admin-shell`** 以 `AdminShell.tsx` 实现布局模式和插槽位置，`TopNavigation.tsx`、`ShellTab.tsx` 和 `menu-keyboard.ts` 封装导航、标签和键盘交互。`LayoutSettings.tsx` 提供布局选项，`RouteTransition.vue` 负责过渡与缓存渲染。宿主传入布局状态、菜单项、导航动作和页面内容。 [外壳公开入口](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/admin-shell/src/index.ts)
- **`@ray-template/routing`** 通过 `/contract` 接收宿主注册的视图、保留路径和权限规则，把可序列化配置转换为 Vue Router 记录，并支持导出。`/expand-routes`、`/order-routes` 和 `/navigation` 提供展开、排序和菜单树遍历。`/schema` 和 `/json-schema` 保留兼容入口，对应实现来自 `api-contracts`。 [路由包公开入口](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/routing/package.json)
- **`@ray-template/ui`** 按组件组织实现、类型和样式，提供 `/table-pro`、`/form`、`/chart`、`/barcode` 等入口。`/theme.css` 和 `/theme-presets` 提供设计变量与主题预设，`/services` 把宿主的主题、翻译、消息和存储适配接入组件。 [组件参考](../reference/components)
- **`@ray-template/icons`** 按目录组织 SVG，由生成的 `/manifest` 提供完整图标名、类型和分组资源地址。后台构建按组生成精灵图。`RIcon` 和路由配置复用同一套名称，例如 `navigation/table`。 [SVG 图标](../reference/icons)

以 TablePro 为例，`TablePro.tsx` 组合筛选、分页、查询和实例 API，`useTableSearch` 管理搜索草稿与提交条件，`useTableRequest` 管理远端请求状态和取消，`TablePanel` 负责 Naive UI 表格、列设置与表格工具。宿主决定查询实现和列偏好存储。 [TablePro 参考](../reference/table-pro) · [组件源码入口](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RTablePro/index.ts)

```text
搜索提交 / 切换分页
  ↓
TablePro → useTableRequest
  ↓
宿主 request(params, signal)
  ↓
本页 data + 筛选后的 total
  ↓
TablePanel → Naive UI NDataTable
```

### HTTP、契约与演示数据

- **`@ray-template/http`** 通过 `client.ts` 的 `createHttpClient` 装配独立的 Axios 实例。实例解析并返回 HTTP 响应体，`RequestCanceler` 跟踪和清理待处理请求。宿主配置地址、请求头和拦截策略。 [请求客户端源码](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/http/src/client.ts)
- **`@ray-template/api-contracts`** 在 `/admin` 定义通用响应、会话和管理接口模型，在 `/demo` 定义演示查询和响应。`routes.ts` 是路由 Schema 的源文件，`/route-validation` 提供结构校验，`/route-json-schema` 和 `/openapi` 生成供编辑器和 API 集成使用的描述。前端、Mock 和服务端共用这套 Valibot 契约。 [契约包说明](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/api-contracts/README.md)
- **`@ray-template/demo-data`** 在 `routes.json` 提供内置路由，并提供初始选项、图表、订单和人员数据，以及搜索、筛选和分页辅助函数。调用方决定何时启用演示，并负责自己的会话和写入。 [演示数据包说明](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/demo-data/README.md)

### Hooks、指令与工具

- **`@ray-template/composables`** 在 `/vue` 提供 Vue 生命周期与元素引用等辅助函数，功能 Hook 按入口拆分，例如 `/useDevice`、`/useElementFullscreen`、`/useDomToImage` 和 `/usePrint`。后台特有的导航、布局和状态 Hooks 由 `apps/admin/src/hooks/template/` 维护。 [Hooks 参考](../reference/hooks)
- **`@ray-template/directives`** 在 `src/modules/` 按指令组织实现和类型。宿主可按需导入 `/copy`、`/debounce`、`/throttle` 等入口，Ray Admin 的 `src/directives/index.ts` 统一注册模板所用指令。 [指令参考](../reference/directives)
- **`@ray-template/utils`** 通过 `/precision` 提供精度运算，`/core`、`/files` 和 `/types` 提供对象、文件和类型工具。`/storage` 接收宿主提供的存储实现后执行带命名空间的 JSON 读写，应用负责选择存储位置与缓存键。 [工具函数参考](../reference/utils)

## 构建与部署

`pnpm dev` 启动后台，`pnpm docs:dev` 启动文档。`pnpm build` 输出后台，`pnpm docs:build` 输出文档，`pnpm pages:build` 组装两者到 `dist/pages`。官方部署路径分别是 `/ray-template/` 和 `/ray-template/docs/`。 [构建与部署指南](./tooling)

如果当前项目基于 v5，请先查看兼容范围和接入方式。 [版本分界](../migration)
