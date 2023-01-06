import request from './instance'

import type { AxiosRequestConfig } from 'axios'

let controller: AbortController

const useRequest = (config: AxiosRequestConfig) => {
  controller && controller.abort() // 调用控制器, 取消请求

  controller = new AbortController() // 实例化控制器对象(可以中止一个或多个 `Web` 请求)

  const cfg = Object.assign({}, config, {
    signal: controller.signal, // 取消请求信号
  })

  return request(cfg)
}

export default useRequest

/**
 *
 * 使用 `axios` 实例
 *
 * 可以自动取消重复请求部分
 *
 * 使用该方法进行二次的请求封装, 然后可以使用 `import { xxx } from '@use-api/xxx' 导入
 */
