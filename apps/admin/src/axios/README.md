# Requests and interceptors

Put business endpoints in `src/api` and use `request` exported by `@/axios`. Success interceptors return the response body, so `request<T>()` resolves to `T`; failures still reject. Use an Axios instance that retains the full response when headers or HTTP status are needed.

Default request configuration is in `src/app-config/request-config.ts`. Put reusable request/response logic in `axios-interceptor/request/plugins` and `axios-interceptor/response/plugins`, registering each in its `provider.ts`. Success queues use `AxiosRequestInterceptor` or `AxiosResponseInterceptor`; failure queues use `FetchErrorFunction`. Check prerequisite logic when reordering queues.

## Request cancellation

The default canceller identifies duplicates by URL, method, serialized params, and body, then injects a signal into the current request. In the default layout, `AppRequestCancelerProvider` cancels the pending requests it manages before route updates.

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

When supplying a signal, set `cancelConfig.cancel` to `false` to avoid default-canceller replacement, and own the abort lifecycle. The person list demonstrates [forwarding TablePro's signal](../api/demo/mock/person.ts). `useRequest` wraps the same instance and must run within an active Vue effect scope.
