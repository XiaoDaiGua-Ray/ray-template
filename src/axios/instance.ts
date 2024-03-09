/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2022-11-18
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/**
 *
 * 请求拦截器与响应拦截器
 * 如果有需要拓展拦截器, 请在 inject 目录下参照示例方法继续拓展
 * 该页面不应该做过多的改动与配置
 */

import axios from 'axios'
import { AXIOS_CONFIG } from '@/app-config'
import { useAxiosInterceptor } from '@/axios/utils/interceptor'
import {
  setupResponseInterceptor,
  setupResponseErrorInterceptor,
} from '@/axios/inject/response'
import {
  setupRequestInterceptor,
  setupRequestErrorInterceptor,
} from '@/axios/inject/request'

import type { AxiosInstanceExpand } from './types'

const server: AxiosInstanceExpand = axios.create(AXIOS_CONFIG)
const { createAxiosInstance, beforeFetch, fetchError } = useAxiosInterceptor()

// 请求拦截器
server.interceptors.request.use(
  (request) => {
    createAxiosInstance(request, 'requestInstance') // 生成 request instance
    setupRequestInterceptor() // 初始化拦截器所有已注入方法
    beforeFetch('requestInstance', 'implementRequestInterceptorArray', 'ok') // 执行拦截器所有已注入方法

    return request
  },
  (error) => {
    setupRequestErrorInterceptor() // 初始化拦截器所有已注入方法(错误状态)
    fetchError('requestError', error, 'implementRequestInterceptorErrorArray') // 执行所有已注入方法

    return Promise.reject(error)
  },
)

// 响应拦截器
server.interceptors.response.use(
  (response) => {
    createAxiosInstance(response, 'responseInstance') // 创建响应实例
    setupResponseInterceptor() // 注入响应成功待执行队列
    beforeFetch('responseInstance', 'implementResponseInterceptorArray', 'ok') // 执行响应成功拦截器

    const { data } = response

    return Promise.resolve(data)
  },
  (error) => {
    setupResponseErrorInterceptor() // 注入响应失败待执行队列
    fetchError('responseError', error, 'implementResponseInterceptorErrorArray') // 执行响应失败后拦截器

    return Promise.reject(error)
  },
)

export default server
