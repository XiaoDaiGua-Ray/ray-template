import axios from 'axios'
import { AXIOS_CONFIG } from '@/app-config'
import { axiosInterceptor } from '@/axios/utils/interceptor'
import {
  setupResponseInterceptor,
  setupResponseErrorInterceptor,
} from '@/axios/axios-interceptor/response'
import {
  setupRequestInterceptor,
  setupRequestErrorInterceptor,
} from '@/axios/axios-interceptor/request'

import type { AxiosInstanceExpand, RequestInterceptorConfig } from './types'

// 创建 axios 实例
const server: AxiosInstanceExpand = axios.create(AXIOS_CONFIG)
// 获取拦截器实例
const { createAxiosInstance, beforeFetch, fetchError } = axiosInterceptor()

// 请求拦截器
server.interceptors.request.use(
  (request) => {
    // 生成 request instance
    createAxiosInstance(
      request as RequestInterceptorConfig<unknown>,
      'requestInstance',
    )
    // 初始化拦截器所有已注入方法
    setupRequestInterceptor()
    // 执行拦截器所有已注入方法
    beforeFetch('requestInstance', 'implementRequestInterceptorArray', 'ok')

    return request
  },
  (error) => {
    // 初始化拦截器所有已注入方法(错误状态)
    setupRequestErrorInterceptor()
    // 执行所有已注入方法
    fetchError('requestError', error, 'implementRequestInterceptorErrorArray')

    return Promise.reject(error)
  },
)

// 响应拦截器
server.interceptors.response.use(
  (response) => {
    // 创建响应实例
    createAxiosInstance(response, 'responseInstance')
    // 注入响应成功待执行队列
    setupResponseInterceptor()
    // 执行响应成功拦截器
    beforeFetch('responseInstance', 'implementResponseInterceptorArray', 'ok')

    const { data } = response

    return Promise.resolve(data)
  },
  (error) => {
    // 注入响应失败待执行队列
    setupResponseErrorInterceptor()
    // 执行响应失败后拦截器
    fetchError('responseError', error, 'implementResponseInterceptorErrorArray')

    return Promise.reject(error)
  },
)

export default server
