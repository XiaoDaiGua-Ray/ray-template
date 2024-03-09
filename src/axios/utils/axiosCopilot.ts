/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-06-02
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/** axios 拦截器工具 */

import type { RawAxiosRequestHeaders, AxiosRequestConfig } from 'axios'
import type { RequestHeaderOptions } from '../types'

/**
 *
 * @param instance axios instance
 * @param options axios headers options
 *
 * @remark 自定义 `axios` 请求头配置
 */
export const appendRequestHeaders = <T = unknown>(
  instance: AxiosRequestConfig<T>,
  options: RequestHeaderOptions[],
) => {
  if (instance) {
    const requestHeaders = instance.headers as RawAxiosRequestHeaders

    options.forEach((curr) => {
      requestHeaders[curr.key] = curr.value
    })
  }
}
