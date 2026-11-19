# Requests, cancellation, and mocks {#接口、取消与-mock}

<script setup>
import AdminExample from '../../examples/AdminExample.vue'
</script>

Business code calls functions in `apps/admin/src/api`, which use `request` from `@/axios`. On success, the instance resolves with the response body `T`. On failure, it rejects. The business layer unwraps any additional API envelope. Use an Axios instance that returns the full response when you need raw headers or status codes.

## Interactive example {#交互示例}

<AdminExample path="/axios" title="Send, cancel, and throttle requests" />

::: details View example source
<<< @/../admin/src/views/demo/axios/index.tsx
:::

## Send and cancel requests {#接入请求和取消}

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

The default canceler identifies duplicate requests by URL, method, query, and body. It compares the encoded parameter sequence for `URLSearchParams` and the ordered fields, text values, and file instances for `FormData`. The default layout cancels managed requests before the route updates. Callers that supply `signal` or set `cancelConfig.cancel: false` manage cancellation themselves. In the example above, TablePro owns the signal.

## Configuration and interceptors {#配置与拦截器}

- Set `baseURL`, timeouts, and default headers in `apps/admin/src/app-config/request-config.ts`.
- Register plugins in `apps/admin/src/axios/axios-interceptor/{request,response}/provider.ts`. Put request headers, auth responses, and other concerns in the corresponding `plugins`.
- `useRequest` wraps the same client. Call it within an active Vue effect scope.

## Switch from demo to a real service {#从演示切到真实服务}

Development, production preview, and GitHub Pages use the same MSW HTTP mocks. Sign-in, users, routes, people tables, route-demo details, business search options, charts, and request examples all go through the API layer. A service worker under the application base responds in the hosted demo. Table examples with local filtering first fetch data through the API and then sort, paginate, and filter locally. Request and response types and runtime schemas live in `@ray-template/api-contracts`. `@ray-template/http` supplies the transport client.

Set `VITE_API_MOCK=false` and `VITE_API_BASE_URL` to send requests to your own server. See the [backend integration guide](./backend) for request and response formats, error codes, sessions, permissions, and the downloadable OpenAPI definition. Mock changes persist in the current browser. Your backend owns shared data and production sessions.

[Request instance](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/axios/instance.ts) · [Business APIs](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/api/admin/index.ts)

## useRequest and manual execution {#userequest-与手动执行}

Import `useRequest<Response>(fetchOptions, options?)` from `@/axios` to run the given configuration through the template Axios instance. It forwards `options` to vue-hooks-plus, including `manual` and success or error callbacks. Data, errors, loading state, and the execution methods come from the upstream hook. Create it in `setup` or an active effect scope.

```ts
import { useRequest } from '@/axios'

export function useOrderSummary() {
  return useRequest<{ total: number }>(
    { url: '/api/orders/summary', method: 'get' },
    { manual: true },
  )
}
```

Call `run()` to load manually. The wrapper reads its configuration from `fetchOptions`. For a dynamic service with parameters, import `useHookPlusRequest(service, options?)` from the same entry point and call `request` inside the service. Business code or response interceptors own error notifications. The default interceptors ignore the optional `responseSuccessMessage` and `responseErrorMessage` type fields.

The template injects `Authorization: Bearer <token>` only for the configured API base and preserves caller-provided auth headers. Configure a separate client explicitly for third-party URLs.

[Request hook](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/axios/index.ts) · [Request configuration types](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/http/src/types.ts) · [Header injection](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/axios/axios-interceptor/request/plugins/request-headers.ts)
