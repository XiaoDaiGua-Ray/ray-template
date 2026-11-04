import type { AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios'
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
