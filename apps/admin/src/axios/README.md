# 请求与拦截器

业务接口放在 `src/api`，使用 `@/axios` 导出的 `request`。成功拦截器返回响应体，`request<T>()` 解析为 `T`；失败仍拒绝。需要响应头或 HTTP 状态时，使用保留完整响应的 Axios 实例。

默认请求配置位于 `src/app-config/request-config.ts`。通用请求和响应逻辑分别放入 `axios-interceptor/request/plugins` 与 `axios-interceptor/response/plugins`，在各自的 `provider.ts` 中登记。成功队列使用 `AxiosRequestInterceptor` 或 `AxiosResponseInterceptor`，失败队列使用 `FetchErrorFunction`；调整队列顺序时核对前置逻辑。

## 取消请求

默认取消器按 URL、方法、序列化参数与请求体识别重复请求，并为当前请求注入 signal。默认布局中的 `AppRequestCancelerProvider` 会在路由更新前取消受它管理的待处理请求。

```ts
import { request } from '@/axios'

const loadOrders = (signal: AbortSignal) =>
  request<{ id: string }[]>({
    url: '/api/orders',
    method: 'get',
    signal,
    cancelConfig: { cancel: false },
  })
```

调用方提供 signal 时，将 `cancelConfig.cancel` 设为 `false`，避免被默认取消器覆盖，并由调用方负责中止。人员列表展示了 [TablePro 传递 signal 的方式](../api/demo/mock/person.ts)。`useRequest` 包装同一实例，需在有效的 Vue effect 作用域中调用。
