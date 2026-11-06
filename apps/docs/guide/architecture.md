# v6 Monorepo 架构

Ray Template 6.0.0 把后台应用、官网文档和共享能力放到同一个 pnpm workspace。**Ray Admin** 是完整后台，官网则按页加载同一套组件和工具做交互示例。

```text
ray-template/
├── apps/
│   ├── admin/          # Ray Admin：登录、会话、路由和业务页面
│   └── docs/           # VitePress：指南、API 与交互示例
├── packages/           # 十个私有 workspace 包，按运行时边界复用
├── harness/            # 任务入口与验收命令
└── pnpm-lock.yaml      # 工作区共用锁文件
```

## 各包负责什么

| 包                            | 公开能力与使用方式                                                                           |
| ----------------------------- | -------------------------------------------------------------------------------------------- |
| `@ray-template/utils`         | 精度运算、对象和类型处理、文件工具、接收存储实现的 JSON 工具。精度运算从 `/precision` 导入。 |
| `@ray-template/composables`   | 设备宽度、元素全屏、截图、打印和其他独立 Vue Hooks，例如 `/useElementFullscreen`。           |
| `@ray-template/directives`    | 复制、防抖、节流、省略、水波纹等指令，可单独导入或统一注册。                                 |
| `@ray-template/icons`         | SVG 资源、图标名称类型和资源查找。组件和路由配置使用同一套名称。                             |
| `@ray-template/ui`            | 组件、样式、主题与类型。通过 `/table-pro`、`/barcode` 或 `/chart` 等入口按需导入。           |
| `@ray-template/http`          | `createHttpClient` 创建实例与独立的取消器。宿主提供地址、请求头和拦截器。                    |
| `@ray-template/api-contracts` | 通用请求与响应、Valibot 校验、路由 Schema 和 OpenAPI；不依赖浏览器或服务端框架。             |
| `@ray-template/demo-data`     | Mock 与后端演示共用的数据、查询辅助和初始路由，调用方决定是否启用。                          |
| `@ray-template/routing`       | 路由 Schema 兼容入口、浏览器路由展开和菜单处理。宿主提供页面注册表。                         |
| `@ray-template/admin-shell`   | 布局、顶部导航、标签、设置和路由过渡。宿主提供菜单、选中状态、偏好和内容。                   |

共享包通过 `package.json` 的 `exports` 暴露入口，只依赖自己声明的包。`pnpm packages:check` 检查跨包导入和依赖循环。应用的登录、路由守卫、业务 API、Pinia 实例和语言加载由 `apps/admin` 负责。

应用不能作为其他工作区的依赖；包通过 `rayTemplate.runtime` 标明 `browser`、`server` 或 `universal`。通用包只依赖通用包，浏览器与服务端通过 HTTP 和共享契约交互。路由 Schema 的权威来源是 `packages/api-contracts/src/routes.ts`，旧 routing 入口保留转导出。源码发行方式见[发行版本与快速启动](./distributions)。

<!-- fullstack:start -->

可选的 `apps/server` 独立构建和运行，内部业务模块使用 NestJS、PostgreSQL 和 Redis。前端不会导入其控制器、数据库模型或配置。纯前端导出会移除整个服务端工作区及专属依赖。

<!-- fullstack:end -->

## Ray Admin 怎么组装

`apps/admin/src/main.ts` 安装 Pinia、国际化、路由和指令。应用入口为组件提供主题、翻译、图标和列偏好存储，路由层把注册的页面交给后台外壳。登录、角色和会话由应用处理，真实业务的服务端负责接口授权。

以 TablePro 为例，组件负责展示、搜索、分页与请求状态。后台传入业务查询，文档传入可取消的模拟查询。两边从同一个入口导入：

```ts
import { RTablePro } from '@ray-template/ui/table-pro'
import { add } from '@ray-template/utils/precision'
```

[后台应用入口](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/main.ts) · [应用组装](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/App.tsx) · [完整工程地图](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/docs/architecture.md)

## 文档怎样运行组件

`apps/docs/examples` 保存实际运行的 Vue 示例。Markdown 引用同一个文件展示源码。TablePro 使用本地数据或可控的模拟请求；布局实验在独立预览框内运行，使用自己的内存路由和主题状态。

[精度运算](../reference/utils/core#交互示例) · [RBarcode](../reference/components/barcode#交互示例) · [TablePro](../reference/table-pro#交互示例) · [布局实验](./layout#在线布局实验)

## 构建与部署

`pnpm dev` 启动后台，`pnpm docs:dev` 启动文档。`pnpm build` 输出后台，`pnpm docs:build` 输出文档，`pnpm pages:build` 组装两者到 `dist/pages`。官方部署地址分别是 `/ray-template/` 和 `/ray-template/docs/`。[构建与部署指南](./tooling)

如果当前项目基于 v5，请先看[版本分界](../migration)，再决定是否接入 v6。
