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
 * 该页面不做改动与配置
 */

import axios from 'axios'
import { AXIOS_CONFIG } from '@/appConfig/requestConfig'
import { useAxiosInterceptor, axiosCanceler } from '@/axios/helper/interceptor'
import {
  setupResponseInterceptor,
  setupResponseErrorInterceptor,
} from '@/axios/inject/response/provide'
import {
  setupRequestInterceptor,
  setupRequestErrorInterceptor,
} from '@/axios/inject/request/provide'

import type { AxiosInstanceExpand } from './type'

const server: AxiosInstanceExpand = axios.create(AXIOS_CONFIG)
const { createAxiosInstance, beforeFetch, fetchError } = useAxiosInterceptor()

// 请求拦截器
server.interceptors.request.use(
  (request) => {
    // 生成 request instance
    createAxiosInstance(request, 'requestInstance')
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
    createAxiosInstance(response, 'responseInstance')
    setupResponseInterceptor()
    beforeFetch('responseInstance', 'implementResponseInterceptorArray', 'ok')

    const { data } = response

    return Promise.resolve(data)
  },
  (error) => {
    setupResponseErrorInterceptor()
    fetchError('responseError', error, 'implementResponseInterceptorErrorArray')

    // 注销该失败请求的取消器
    axiosCanceler.removePendingRequest(error.config || {})

    return Promise.reject(error)
  },
)

export default server
