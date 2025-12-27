import type { AxiosRequestInterceptor, FetchErrorFunction } from '@/axios/types'
import { axiosCanceler } from '@/axios/utils/interceptor'

/**
 *
 * @param ins 当前请求实例
 * @param mode 当前环境
 *
 * @description
 * 移除请求拦截器与注入请求拦截器。
 */
const injectRequestCanceler: AxiosRequestInterceptor = (ins, mode) => {
  axiosCanceler.removePendingRequest(ins) // 检查是否存在重复请求, 若存在则取消已发的请求
  axiosCanceler.addPendingRequest(ins) // 把当前的请求信息添加到 pendingRequest 表中
}

/**
 *
 * @param error 请求错误信息
 * @param mode 当前环境
 *
 * @description
 * 请求错误时候，移除请求拦截器。
 */
const requestErrorCanceler: FetchErrorFunction = (error, mode) => {
  axiosCanceler.removePendingRequest(error) // 移除请求拦截器
}

export { injectRequestCanceler, requestErrorCanceler }
