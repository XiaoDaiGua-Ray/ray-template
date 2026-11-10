# 服务端接入与标准契约

登录、会话、用户管理与路由管理使用同一套 HTTP API。源码发行和启动方式见[发行版本与快速启动](./distributions)。开发环境与静态在线演示都由 MSW 在网络层模拟响应；页面和 Store 不直接读取 Mock 数据库。接入自有服务端时，保留页面与调用方法，替换接口地址和实现即可。

<script setup>
import { withBase } from 'vitepress'
</script>

<a :href="withBase('/contracts/admin-api.json')" target="_blank" rel="noreferrer">下载 OpenAPI 3.1 契约</a>

契约从 workspace 包 `@ray-template/api-contracts` 和路由 Schema 生成，含请求体、响应、查询参数、Bearer 认证与权限码。登录与用户契约通过 `/admin` 子路径导入，演示接口通过 `/demo` 导入，路由 Schema 通过 `/routes` 导入，`/openapi` 导出 OpenAPI 生成函数。路由 Schema 的权威来源是 `packages/api-contracts/src/routes.ts`，routing 包中的旧入口保留转导出。包不读取浏览器状态，前端、Mock 和自有服务端可共享类型与运行时校验；包当前随仓库使用，尚未发布到 npm。应用原有 `api/admin/contracts.ts`、`api/demo/contracts.ts` 路径仍为兼容入口。修改后运行 `pnpm api:generate`；全量验证中的 `pnpm api:check` 检查文件与运行时 Schema 一致。

```ts
import type { ApiResponse, UserInput } from '@ray-template/api-contracts/admin'
import { userInputSchema } from '@ray-template/api-contracts/admin'
import type {
  DemoOrderQuery,
  SearchOptions,
} from '@ray-template/api-contracts/demo'
```

## 接入步骤

在 `apps/admin/.env.local` 配置并重新启动或构建：

```dotenv
VITE_API_MOCK=false
VITE_API_BASE_URL=https://your-api.example.com/api/
```

也可以使用同源 `/api/`，由部署代理转发。设置 `VITE_API_BASE_URL` 后默认关闭 Mock，显式 `VITE_API_MOCK=true` 才重新启用。接口基址可以包含版本前缀；页面只通过 `api/admin` 的方法调用，不拼接固定域名。`VITE_*` 会进入浏览器产物，仅用于公开配置。

Mock 在应用启动前完成 Service Worker 注册。每次 API 请求前检查内部健康标记；浏览器回收 worker 后，在同一个 MSW 客户端实例上调用 `stop()` / `start()` 恢复，让同一个客户端管理监听器和拦截状态。恢复失败则阻止业务请求继续发送，表单和演示数据保持原样。内部 `GET /admin/mock-health` 仅由 Mock 使用，关闭 Mock 后不请求这个接口。Worker 脚本路径为 `/ray-template/mockServiceWorker.js`，注册 URL 带有当前 MSW 版本的查询参数，作用域为应用 base。静态服务器须在该路径提供脚本。浏览器需要 HTTPS 或 localhost。GitHub Pages 只托管静态文件，这些 API 由已启动的页面中的 Mock 响应；直接在地址栏打开 API 地址会返回 404。真实后端模式不启动 Mock，也不会在请求失败时返回伪造业务数据。当前锁定 MSW 3.0.4，安装不自动执行其 worker 复制脚本；升级时显式运行 `pnpm exec msw init apps/admin/public --save`，再做契约和浏览器验证。

<!-- fullstack:start -->

## 配套 NestJS 服务端

完整源码中的 `apps/server` 实现相同的 `/api/admin/*` 协议，页面层继续使用现有 API 调用。默认开发入口为 `pnpm fullstack:setup`、`pnpm dev:full`；已有 PostgreSQL 和 Redis 时使用 `pnpm fullstack:setup --external`。管理员凭据保存在私有的 `apps/server/.env.local`，不使用 Mock 演示密码，详细步骤见[全栈发行包](./distributions#全栈发行包)。

用户、部门、角色授权、会话、路由配置和操作审计持久化到 PostgreSQL。账号与邮箱通过规范化唯一字段避免大小写冲突；批量写入、账号保护与审计在事务内执行。初始化只补齐初始数据，重复运行保留已有配置、路由与账号。

配套服务用签名 JWT 标识会话，PostgreSQL 只保存令牌摘要；密码使用带随机盐的 scrypt 派生。每次请求校验 JWT 签名、有效期、数据库会话和实时权限。配套的同源 Admin 使用 HttpOnly Cookie，接口客户端仍可用 Bearer。退出撤销当前会话，停用、角色变更和改密撤销该账号的所有会话。

用户资料创建接口不接收密码。管理员可从用户管理设置凭据，运维也可使用 `pnpm server:credential:set` 进行恢复。配套的 `dev:full` 与 Compose 已配置 `VITE_API_AUTH_TRANSPORT=cookie`；手动构建时配合 `VITE_API_BASE_URL=/api/` 使用同源代理，外部 HTTPS 部署启用 Secure Cookie。Cookie 模式请求携带 `X-Ray-Session: cookie`，写请求还必须来自允许的同源页面。

Redis 为 API、登录和改密提供跨进程限流，并缓存可重建的演示读取结果；会话与权限不经过该缓存。请求均带 `X-Request-Id`，JSON 日志记录路由模板、状态和耗时，排除请求体、查询串、凭据和原始连接错误。就绪接口 `/api/health/ready` 检查数据库已初始化且 Redis 可用；存活接口为 `/api/health/live`。

配置要求明确的 CORS 来源和可信代理，默认不信任转发头。非法 JSON、超大请求、限流和依赖故障分别返回标准错误包络。配套后端不提供 `POST /admin/users/reset`。Redis 故障时返回 503，不切回内存认证或 Mock 数据。

`DEMO_ENABLED` 在开发环境默认开启，生产环境默认关闭。开启时，`/admin/demo/*` 提供与 Mock 一致的公开演示数据；关闭时接口返回 404，运行路由移除演示视图及指向它们的重定向。已保存的路由保持完整，有编辑权限的用户可继续维护。

<!-- fullstack:end -->

## 统一响应

成功使用 HTTP 200 和以下包络：

```json
{
  "code": 200,
  "msg": "OK",
  "data": { "items": [], "total": 0 }
}
```

分页请求使用 `page`（从 1 开始）、`pageSize`（1–100）；响应 `data.items` 是当前页，`data.total` 是所有条件生效后的总数。筛选在分页前执行。详情和写入直接把单个对象放入 `data`；批量变更返回 `{ "affected": 2 }`。

失败同时使用对应的 HTTP 状态和 `code`，`data` 为 `null`：

```json
{
  "code": 409,
  "msg": "duplicateUsername",
  "data": null,
  "error": { "key": "duplicateUsername" }
}
```

400 表示输入不合法，401 表示会话失效，403 表示权限不足，404 表示对象不存在，409 表示账号/邮箱冲突或当前账号保护，413 表示请求体过大，429 表示请求受到限流，503 表示存储或依赖暂时不可用（Mock 中包括演示数据库写入失败）。`error.key` 是稳定的业务错误标识；可选的 `error.fields` 为字段到错误键的映射。API 层把错误转换为 `AdminApiError`，用户页将已约定的错误键翻译为中英文提示。读取响应也会经过 Schema 校验。

## 登录、会话与权限

| 方法和路径                   | 输入                               | 成功的 data                                                                      |
| ---------------------------- | ---------------------------------- | -------------------------------------------------------------------------------- |
| `POST /admin/auth/login`     | `{ username, password }`           | `{ accessToken, expiresAt, user, permissions }`，Cookie 模式不返回 `accessToken` |
| `GET /admin/auth/session`    | 会话                               | `{ user, permissions, expiresAt? }`                                              |
| `POST /admin/auth/logout`    | 会话                               | `null`                                                                           |
| `GET /admin/auth/profile`    | 会话                               | 当前账号资料与部门                                                               |
| `PATCH /admin/auth/profile`  | `{ name, phone }`                  | 更新后的当前账号资料                                                             |
| `PATCH /admin/auth/password` | `{ currentPassword, newPassword }` | `null`，需要重新登录                                                             |

```json
{
  "user": { "id": "u-1", "username": "admin", "name": "Alex", "role": "admin" },
  "permissions": [
    "users:read",
    "users:create",
    "users:update",
    "routes:read",
    "routes:write"
  ]
}
```

自有后端默认用 `Authorization: Bearer <accessToken>`。每次启动重新请求会话资料与权限，401 清除失效会话；其他错误保留为失败状态。当前模板的路由角色契约是单个 `user.role`，路由 `meta.role` 为允许访问的角色数组。权限码独立于角色名称，可由自有服务端自由组织。个人资料只允许用户自行编辑姓名和电话，用户名、邮箱、角色和部门由用户管理维护。

```tsx
import { useAccess } from '@/hooks'

const { hasPermission } = useAccess()

// 多个权限默认全部满足；第二个参数传 'any' 时任意一个满足即可。
hasPermission('users:create')
hasPermission(['users:update', 'users:delete'], 'any')
```

前端权限用于菜单、导航和操作入口；服务端须独立校验每次业务请求。Mock 也会验证权限，直接发送请求无法绕过只读账号、管理员操作或当前账号保护。演示账号 `admin`（也兼容 `Ray Admin`）、`manager`、`member` 的密码均为 `123456`，分别对应全部权限、用户维护权限、只读权限。Mock token 与演示密码只用于在线体验，不是生产认证实现。

## 用户管理

| 方法和路径                         | 输入                                                  | 需要的权限          |
| ---------------------------------- | ----------------------------------------------------- | ------------------- |
| `GET /admin/users/options`         | 无                                                    | `users:read`        |
| `GET /admin/users`                 | 分页及 `name/username/email/departmentId/role/status` | `users:read`        |
| `GET /admin/users/{id}`            | 路径 id                                               | `users:read`        |
| `POST /admin/users`                | `UserInput`                                           | `users:create`      |
| `PUT /admin/users/{id}`            | 完整 `UserInput`                                      | `users:update`      |
| `POST /admin/users/batch-delete`   | `{ ids: string[] }`                                   | `users:delete`      |
| `PATCH /admin/users/status`        | `{ ids: string[], status: "enabled" 或 "disabled" }`  | `users:status`      |
| `PUT /admin/users/{id}/credential` | `{ newPassword }`，目标不能是当前账号                 | `users:credentials` |
| `POST /admin/users/reset`          | 无，仅演示恢复入口                                    | `users:reset`       |

```json
{
  "username": "alex",
  "name": "Alex",
  "email": "alex@example.com",
  "phone": "",
  "departmentId": "engineering",
  "role": "member",
  "status": "enabled",
  "remark": ""
}
```

响应用户增加稳定的 `id` 与 ISO 8601 `createdAt`。账号与邮箱不区分大小写检查唯一性，更新时保留 id 与创建时间。组织选项由接口返回 `{ departments: [{ id, parentId, name, labelKey? }], roles: [{ value, label, labelKey?, disabled? }] }`，部门过滤包含子组织。`labelKey` 可选，用于演示中的中英文翻译；自有后端直接提供名称即可。

批量操作在接口层整体校验后提交，避免一部分成功一部分失败；当前账号不可被删除、停用或通过编辑更换角色。通过编辑修改状态也需要 `users:status`。只有账号管理权限的用户可以维护目标账号及其凭据，管理者不能操作管理员账号。Mock 数据库将用户、路由与会话持久化在当前浏览器；用户页的恢复按钮只在 Mock 模式显示。

## 路由管理

`GET /admin/route-config` 在登录后调用，返回当前会话可用的 `data: { version: 1, routes: [...] }`。服务端同时考虑父子角色约束、视图权限和演示开关；没有可用子项的分组和无法到达授权目标的重定向都会移除。没有 `routes:read` 或没有可用页面时返回 `routes: []`，外壳和个人信息仍可用。携带 `routes:write` 的会话可用 `GET /admin/route-config?view=editor` 读取完整配置，再通过 `PUT /admin/route-config` 保存。

初始菜单表位于 `packages/demo-data/src/routes.json`。标准 API 模式以服务端为准，登录时注入运行路由，保存后重新加载。读取失败不会回退为内置菜单。已被裁剪的业务地址直接访问会进入 404；固定的路由管理入口没有编辑权限时进入 403；业务 API 独立授权。导入、导出与接口使用同一结构，详情见[路由契约](./routing)。

前端 `router/config/views.ts` 保留组件 ID 白名单，接口只返回 ID；后端或 AI 不需要传递组件代码。登录、404 和受保护的路由管理入口由外壳保留。原 `VITE_ROUTE_CONFIG_URL` 仍兼容旧的原始 JSON 读取接口；完整读写接入使用上面的标准 API 基址。

## 在线验证

演示接口同样属于标准 HTTP 契约：

| 方法和路径                          | 输入                                            | 成功的 data                           |
| ----------------------------------- | ----------------------------------------------- | ------------------------------------- |
| `GET /admin/demo/people`            | `page/pageSize/name/email/sortAge/fail`         | `{ items: Person[], total }`          |
| `GET /admin/demo/route-people`      | `page/pageSize/name`，name 精确匹配以兼容旧链接 | `{ items: RouteDemoPerson[], total }` |
| `GET /admin/demo/route-people/{id}` | 从 0 开始的非负整数 id                          | `RouteDemoPerson`，不存在返回 404     |
| `GET /admin/demo/search-options`    | `locale`                                        | 状态、组织、产品类目、仓库与配送选项  |
| `POST /admin/demo/orders/search`    | `{ query: DemoOrderQuery, locale, fail? }`      | `{ items: DemoOrder[], total }`       |
| `POST /admin/demo/owners/search`    | `{ orgId, keyword, locale, fail? }`             | `{ value, label }[]`                  |
| `GET /admin/demo/charts`            | `refresh`                                       | `DemoCharts`                          |
| `GET /admin/demo/request`           | 无                                              | 工单与城市数据                        |

分页上限为 100。`sortAge` 为 `ascend` 或 `descend`，`refresh` 与演示用 `fail` 为布尔值；非法输入返回 HTTP 400。订单的筛选字段、类型、日期格式和金额下限均在共享 Schema 和 OpenAPI 中定义。`fail=true` 的模拟错误通过 HTTP 503 返回，页面不再直接抛出伪造请求错误。

搜索页从接口获取业务选项，订单响应直接提供仓库与配送名称，不依赖前端样例数组下标。选项加载失败显示可重试状态，切换语言或离开页面会取消旧请求。路由示例的列表和详情也从接口读取；旧的姓名查询链接继续可用。预设演示场景和故障按钮只在 Mock 模式显示。

打开浏览器 Network，依次登录、进入用户管理、查询、新增编辑、打开详情与保存路由，能够看到对应的 HTTP 请求。在线演示响应标记为来自 Service Worker；它模拟服务端协议，静态站点无需另外部署服务进程。接入真实后端后，同样的页面请求直接发往配置的基址。

用户页复用 `RTablePro`、`RForm/useForm` 和 Naive UI。桌面下两个区域填满内容区：组织卡片使用 `contentScrollable`，表格使用 `autoHeight`；窄屏上下排布时分别由现有滚动组件承载，避免页面越长越高。
