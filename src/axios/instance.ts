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
 * 请求, 响应拦截器
 * 如果有需要拓展拦截器, 请在 inject 目录下参照示例方法继续拓展
 * 该页面不做改动与配置
 */

import axios from 'axios'
import { AXIOS_CONFIG } from '@/appConfig/requestConfig'
import { useAxiosInterceptor, axiosCanceler } from '@/axios/helper/interceptor'
import { setupRequestInterceptor } from '@/axios/inject/requestInject'
import { setupResponseInterceptor } from '@/axios/inject/responseInject'

import type { AxiosInstanceExpand } from './type'

const server: AxiosInstanceExpand = axios.create(AXIOS_CONFIG)
const {
  createRequestAxiosInstance,
  createResponseAxiosInstance,
  beforeAxiosFetch,
} = useAxiosInterceptor()

server.interceptors.request.use(
  (request) => {
    createRequestAxiosInstance(request)
    setupRequestInterceptor()
    beforeAxiosFetch('requestInstance')

    return request
  },
  (error) => {
    return Promise.reject(error)
  },
)

server.interceptors.response.use(
  (response) => {
    createResponseAxiosInstance(response)
    setupResponseInterceptor()
    beforeAxiosFetch('responseInstance')

    const { data } = response

    return Promise.resolve(data)
  },
  (error) => {
    axiosCanceler.removePendingRequest(error.config || {})

    return Promise.reject(error)
  },
)

export default server
