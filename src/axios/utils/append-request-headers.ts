import type { RawAxiosRequestHeaders, AxiosRequestConfig } from 'axios'
import type { RequestHeaderOptions } from '../types'

/**
 *
 * @param instance axios instance
 * @param options axios headers options
 *
 * @description
 * 自定义配置 axios 请求头。
 *
 * @example
 * appendRequestHeaders(inst, [
 *   {
 *     key: 'Demo-Header-Key',
 *     value: 'Demo Header Value',
 *   }
 * ])
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
