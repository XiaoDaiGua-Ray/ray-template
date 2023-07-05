## 说明

> axios 包，全局的 axios 使用入口
> `src/axios/instance.ts` 文件为 axios 实例文件，应该不可更改，如果需要有拦截器相关的操作，应该在 `src/axios/inject` 文件下按照需求在对应注册器中进行注册相关方法。该项目将 axios instance 与 axios interceptor 进行解耦，避免实例文件的臃肿。

## 工具函数

- BeforeFetchFunction
- FetchErrorFunction

> 两个工具函数方便类型推导。

## 约束

### 拦截器添加

> 这里以请求拦截器添加为示例

```ts
/**
 *
 * 拦截器说明
 *
 * 注册一个根据系统当前环境是否携带测试环境请求拦截器
 */

import { appendRequestHeaders } from '@/axios/helper/axiosCopilot'

import type {
  RequestInterceptorConfig,
  BeforeFetchFunction,
  FetchErrorFunction,
} from '@/axios/type'

const injectRequestHeaderOfEnv: BeforeFetchFunction<
  RequestInterceptorConfig
> = (ins, mode) => {
  if (mode === 'development') {
    appendRequestHeaders(ins, [
      {
        key: 'Development-Mode',
        value: 'development',
      },
    ])
  }
}

/**
 *
 * 在 setupRequestInterceptor 中注册
 */

export const setupRequestInterceptor = () => {
  setImplement(
    'implementRequestInterceptorArray',
    [injectRequestHeaderOfEnv],
    'ok',
  )
}

/** 至此完成了请求拦截器的注册 */
```

### 注册器

> 每个类型注册器都有两个方法，用于注册拦截器方法。都以 setupXXX 开头命名。注册器以队列形式管理拦截器方法，所以可能需要注意执行顺序。如果有新的拦截器方法，需要根据其使用场景在对应的注册器中注册（注册器第二个参数中注册）。

- 请求注册器: setupRequestInterceptor
- 请求错误注册器: setupRequestErrorInterceptor
- 响应注册器: setupResponseInterceptor
- 响应错误注册器: setupResponseErrorInterceptor
