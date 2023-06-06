/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-06-05
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/**
 *
 * axios 拦截器注入
 *
 * 请求拦截器、响应拦截器
 * 暴露启动方法调用所有已注册方法
 *
 * 为什么要把 create 方法拆成两个, emmmmmm 我也不知道
 */

import RequestCanceler from '@/axios/helper/canceler'

import type {
  RequestInterceptorConfig,
  ResponseInterceptorConfig,
  ImplementKey,
  ImplementQueue,
} from '@/axios/type'

const axiosFetchInstance = {
  requestInstance: null as RequestInterceptorConfig | null,
  responseInstance: null as ResponseInterceptorConfig | null,
}
const implement: ImplementQueue = {
  implementRequestInterceptorArray: [],
  implementResponseInterceptorArray: [],
}
export const axiosCanceler = new RequestCanceler()

export const useAxiosInterceptor = () => {
  const getImplementKey = (key: ImplementKey) => {
    return key === 'requestInstance'
      ? 'implementRequestInterceptorArray'
      : 'implementResponseInterceptorArray'
  }

  const createRequestAxiosInstance = (instance: RequestInterceptorConfig) => {
    axiosFetchInstance['requestInstance'] = instance
  }

  const createResponseAxiosInstance = (instance: ResponseInterceptorConfig) => {
    axiosFetchInstance['responseInstance'] = instance
  }

  /** 请求前, 执行队列所有方法 */
  const beforeAxiosFetch = (key: ImplementKey) => {
    const funcArr = implement[getImplementKey(key)]

    funcArr?.forEach((curr) => {
      if (typeof curr === 'function') {
        curr()
      }
    })
  }

  /** 设置拦截器队列 */
  const setImplementQueue = (func: AnyFunc[], key: ImplementKey) => {
    if (func && key) {
      implement[getImplementKey(key)] = func
    }
  }

  /** 获取拦截器队列 */
  const getImplementQueue = (key: ImplementKey) => {
    return implement[getImplementKey(key)]
  }

  /** 获取请求实例或者响应实例 */
  const getAxiosFetchInstance = (key: ImplementKey) => {
    return axiosFetchInstance[key]
  }

  return {
    createRequestAxiosInstance,
    createResponseAxiosInstance,
    beforeAxiosFetch,
    setImplementQueue,
    getImplementQueue,
    getAxiosFetchInstance,
  }
}
