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
 *
 * 可在此实现共享的基础配置
 */

import axios from 'axios'
import { getDetermineEnv } from '@use-utils/hook'
import RequestCanceler from './helper/canceler'
import { AXIOS_CONFIG } from '@/appConfig/requestConfig'
import { appendRequestHeaders } from './helper/interceptor'

import type { AxiosInstanceExpand } from './type'

const canceler = new RequestCanceler()

const server: AxiosInstanceExpand = axios.create(AXIOS_CONFIG)

server.interceptors.request.use(
  (request) => {
    const { MODE } = getDetermineEnv()

    if (MODE === 'development') {
      // TODO: 开发环境
    } else if (MODE === 'production') {
      // TODO: 生产环境
    } else if (MODE === 'test') {
      // TODO: 测试环境
    }

    appendRequestHeaders(request, [
      {
        key: 'X-TOKEN',
        value: 'token',
      },
    ]) // 自定义请求头

    canceler.removePendingRequest(request) // 检查是否存在重复请求, 若存在则取消已发的请求
    canceler.addPendingRequest(request) // 把当前的请求信息添加到 pendingRequest 表中

    return request
  },
  (error) => {
    return Promise.reject(error)
  },
)

server.interceptors.response.use(
  (response) => {
    canceler.removePendingRequest(response.config)

    const { data } = response

    return Promise.resolve(data)
  },
  (error) => {
    canceler.removePendingRequest(error.config || {})

    return Promise.reject(error)
  },
)

export default server
