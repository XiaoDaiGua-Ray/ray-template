/**
 *
 * axios 拦截器注入
 *
 * 请求拦截器、响应拦截器
 * 暴露启动方法调用所有已注册方法
 *
 * 该拦截器仅适合放置公共的 axios 拦截器操作, 并且采用队列形式管理请求拦截器的注入
 * 所以在使用的时候, 需要按照约定格式进行参数传递
 */

import RequestCanceler from '@/axios/utils/RequestCanceler'
import { getAppEnvironment } from '@/utils'

import type {
  RequestInterceptorConfig,
  ResponseInterceptorConfig,
  ImplementQueue,
  ErrorImplementQueue,
  FetchType,
  AxiosFetchInstance,
  AxiosFetchError,
} from '@/axios/types'
import type { AnyFC } from '@/types'
import type { AxiosError } from 'axios'

/** 当前请求的实例 */
const axiosFetchInstance: AxiosFetchInstance = {
  requestInstance: null,
  responseInstance: null,
}
/** 请求失败返回值 */
const axiosFetchError: AxiosFetchError<AxiosError<unknown, unknown>> = {
  requestError: null,
  responseError: null,
}
/** 请求队列(区分 resolve 与 reject 状态) */
const implement: ImplementQueue = {
  implementRequestInterceptorArray: [],
  implementResponseInterceptorArray: [],
}
const errorImplement: ErrorImplementQueue = {
  implementRequestInterceptorErrorArray: [],
  implementResponseInterceptorErrorArray: [],
}

/** 取消器实例 */
export const axiosCanceler = new RequestCanceler()

export const useAxiosInterceptor = () => {
  /** 创建拦截器实例 */
  const createAxiosInstance = (
    instance: RequestInterceptorConfig | ResponseInterceptorConfig,
    instanceKey: keyof AxiosFetchInstance,
  ) => {
    instanceKey === 'requestInstance'
      ? (axiosFetchInstance['requestInstance'] =
          instance as RequestInterceptorConfig)
      : (axiosFetchInstance['responseInstance'] =
          instance as ResponseInterceptorConfig)
  }

  /** 获取当前实例 */
  const getAxiosInstance = (instanceKey: keyof AxiosFetchInstance) => {
    return axiosFetchInstance[instanceKey]
  }

  /** 设置注入方法队列 */
  const setImplement = (
    key: keyof ImplementQueue | keyof ErrorImplementQueue,
    func: AnyFC[],
    fetchType: FetchType,
  ) => {
    fetchType === 'ok'
      ? (implement[key as keyof ImplementQueue] = func)
      : (errorImplement[key as keyof ErrorImplementQueue] = func)
  }

  /** 获取队列中所有的所有拦截器方法 */
  const getImplement = (
    key: keyof ImplementQueue | keyof ErrorImplementQueue,
    fetchType: FetchType,
  ): AnyFC[] => {
    return fetchType === 'ok'
      ? implement[key as keyof ImplementQueue]
      : errorImplement[key as keyof ErrorImplementQueue]
  }

  /** 队列执行器 */
  const implementer = (funcs: AnyFC[], ...args: any[]) => {
    if (Array.isArray(funcs)) {
      funcs.forEach((curr) => {
        if (typeof curr === 'function') {
          curr(...args)
        }
      })
    }
  }

  /** 请求、响应前执行拦截器队列中的所有方法 */
  const beforeFetch = (
    key: keyof AxiosFetchInstance,
    implementKey: keyof ImplementQueue | keyof ErrorImplementQueue,
    fetchType: FetchType,
  ) => {
    const funcArr =
      fetchType === 'ok'
        ? implement[implementKey as keyof ImplementQueue]
        : errorImplement[implementKey as keyof ErrorImplementQueue]
    const instance = getAxiosInstance(key)
    const { MODE } = getAppEnvironment()

    if (instance) {
      implementer(funcArr, instance, MODE)
    }
  }

  /** 请求、响应错误时执行队列中所有方法 */
  const fetchError = (
    key: keyof AxiosFetchError,
    error: AxiosError<unknown, unknown>,
    errorImplementKey: keyof ErrorImplementQueue,
  ) => {
    axiosFetchError[key] = error

    const funcArr = errorImplement[errorImplementKey]
    const { MODE } = getAppEnvironment()

    implementer(funcArr, error, MODE)
  }

  return {
    createAxiosInstance,
    setImplement,
    getImplement,
    getAxiosInstance,
    beforeFetch,
    fetchError,
  }
}

export type UseAxiosInterceptor = ReturnType<typeof useAxiosInterceptor>
