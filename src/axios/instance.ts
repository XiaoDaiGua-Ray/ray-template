import axios from 'axios'
import { useDetermineEnv } from '@use-utils/hook'

import type { RawAxiosRequestHeaders, AxiosRequestConfig } from 'axios'
import type { RequestHeaderOptions } from './type'

/**
 *
 * @param instance axios instance
 * @param options axios headers options
 *
 * @note
 * 自定义 `axios` 请求头配置
 */
const appendRequestHeaders = (
  instance: AxiosRequestConfig<unknown>,
  options: RequestHeaderOptions[],
) => {
  const requestHeaders = instance.headers as RawAxiosRequestHeaders

  options.forEach((curr) => {
    requestHeaders[curr.key] = curr.value
  })
}

const server = axios.create({
  baseURL: '', // `import.meta.env`,
  withCredentials: false, // 是否允许跨域携带 `cookie`
  timeout: 5 * 1000,
})

server.interceptors.request.use(
  (request) => {
    const { MODE } = useDetermineEnv()

    if (MODE === 'development') {
      // TODO: 开发环境
    } else if (MODE === 'production') {
      // TODO: 生产环境
    } else if (MODE === 'test') {
      // TODO: 测试环境
    }

    appendRequestHeaders(request, [{ key: 'X-TOKEN', value: 'token' }]) // 自定义请求头

    return request
  },
  (error) => {
    return Promise.reject(error)
  },
)

server.interceptors.response.use(
  (response) => {
    const { data } = response

    return Promise.resolve(data)
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default server

/**
 *
 * 请求, 响应拦截器
 *
 * 可在此实现共享的基础配置
 */
