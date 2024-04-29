import { axiosCanceler } from '@/axios/utils/interceptor'

import type { FetchFunction, FetchErrorFunction } from '@/axios/types'

/**
 *
 * @param ins 当前响应实例
 * @param mode 当前环境
 *
 * @description
 * 响应成功后注销请求取消器。
 */
const injectResponseCanceler: FetchFunction = (ins, mode) => {
  axiosCanceler.removePendingRequest(ins)
}

/**
 *
 * @param error 错误信息
 * @param mode 当前环境
 *
 * @description
 * 注销失败请求取消器。
 */
const responseErrorCanceler: FetchErrorFunction = (error, mode) => {
  axiosCanceler.removePendingRequest(error)
}

export { injectResponseCanceler, responseErrorCanceler }
