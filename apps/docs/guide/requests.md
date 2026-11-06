# 接口、取消与 Mock

<script setup>
import AdminExample from '../examples/AdminExample.vue'
</script>

业务代码调用 `apps/admin/src/api` 中的函数，后者使用 `@/axios` 的 `request`。成功时实例直接解析为响应体 `T`，失败会拒绝；接口还包了一层业务响应时，由业务层继续解析。需要原始响应头或状态码时，使用保留完整响应的 Axios 实例。

## 交互示例

<AdminExample path="/axios" title="执行、取消和节流请求" />

::: details 查看示例源码
<<< @/../admin/src/views/demo/axios/index.tsx
:::

## 接入请求和取消

```ts
import { request } from '@/axios'

interface Order {
  id: string
  customer: string
}

export function loadOrders(
  params: Record<string, unknown>,
  signal: AbortSignal,
) {
  return request<{ data: Order[]; total: number }>({
    method: 'get',
    url: '/api/orders',
    params,
    signal,
    cancelConfig: { cancel: false },
  })
}
```

默认取消器按 URL、方法、参数和请求体识别重复请求，默认布局在路由更新前取消受管理的请求。示例将信号交给 TablePro 管理，所以关闭模板的默认注入；否则默认取消器会替换调用方传入的 signal。后台任务禁用默认取消后，需要自行管理生命周期。

## 配置与拦截器

- `apps/admin/src/app-config/request-config.ts`：统一修改 `baseURL`、超时和默认 headers。
- `apps/admin/src/axios/axios-interceptor/{request,response}/provider.ts`：登记插件；请求头、鉴权响应等放入对应的 `plugins`。
- `useRequest` 包装同一请求实例，放在有效的 Vue effect 作用域内使用。

## 从演示切到真实服务

开发、生产预览和 GitHub Pages 共用 MSW HTTP Mock。登录、用户、路由、人员表格、路由示例详情、搜索业务选项、图表与请求示例都通过 API 层发送请求，在线演示由应用 base 下的 Service Worker 响应；不再在生产环境直接调用本地数据函数。选择本地筛选的表格示例，也先通过接口取得数据，再由组件完成本地排序、分页与筛选。请求/响应类型与运行时 Schema 统一放在 `@ray-template/api-contracts`，HTTP 传输能力由 `@ray-template/http` 提供。

设置 `VITE_API_MOCK=false` 和 `VITE_API_BASE_URL` 后，请求直达自己的服务端。完整请求/响应结构、错误码、会话、权限码及可下载 OpenAPI 见[服务端接入指南](./backend)。Mock 持久化仅属于当前浏览器，多用户共享数据和正式会话由真实后端负责。

[请求实例](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/axios/instance.ts) · [业务 API](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/api/admin/index.ts)

## useRequest 与手动执行

`useRequest<Response>(fetchOptions, options?)` 从 `@/axios` 导入，使用模板 Axios 实例执行同一份配置。`options` 传给 vue-hooks-plus，例如 `manual`、成功和失败回调。返回的数据、错误、加载状态与运行方法来自上游 Hook。应用在 `setup` 或有效 effect scope 内创建它。

```ts
import { useRequest } from '@/axios'

export function useOrderSummary() {
  return useRequest<{ total: number }>(
    { url: '/api/orders/summary', method: 'get' },
    { manual: true },
  )
}
```

调用 `run()` 触发手动加载。这个包装的请求函数从 `fetchOptions` 读取配置，不会把 `run(...)` 参数自动映射成请求体或 query；需要动态 service 时用同入口导出的 `useHookPlusRequest(service, options?)`，在 service 中调用 `request`。错误提示由业务配置或响应拦截器负责，当前默认拦截器不消费 `responseSuccessMessage` / `responseErrorMessage` 两个类型字段。

默认仅向已配置的 API 基址注入 `Authorization: Bearer <token>`，不覆盖调用方提供的认证头。模板 Axios 实例用来请求自己的业务接口；第三方地址使用明确配置的独立客户端。

[请求 Hook](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/axios/index.ts) · [请求配置类型](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/http/src/types.ts) · [头注入实现](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/axios/axios-interceptor/request/plugins/request-headers.ts)
