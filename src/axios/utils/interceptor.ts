import type {
  AxiosFetchError,
  AxiosFetchInstance,
  ErrorImplementQueue,
  FetchType,
  ImplementQueue,
  RequestInterceptorConfig,
  ResponseInterceptorConfig,
} from '@/axios/types'
import RequestCanceler from '@/axios/utils/RequestCanceler'
import type { AnyFn } from '@/types'
import { getAppEnvironment } from '@/utils'
import type { AxiosError } from 'axios'

type ImplementKeys = keyof ImplementQueue
type ErrorImplementKeys = keyof ErrorImplementQueue

// 当前请求的实例
const axiosFetchInstance: AxiosFetchInstance = {
  requestInstance: null,
  responseInstance: null,
}

// 请求失败返回值
const axiosFetchError: AxiosFetchError<AxiosError<unknown, unknown>> = {
  requestError: null,
  responseError: null,
}

// 请求队列(区分 resolve 与 reject 状态)
const implement: ImplementQueue = {
  implementRequestInterceptorArray: [],
  implementResponseInterceptorArray: [],
}

// 请求失败队列
const errorImplement: ErrorImplementQueue = {
  implementRequestInterceptorErrorArray: [],
  implementResponseInterceptorErrorArray: [],
}

// 取消器实例
export const axiosCanceler = new RequestCanceler()

export const axiosInterceptor = () => {
  /**
   *
   * @param instance - 请求或响应实例
   * @param instanceKey - 实例类型标识
   *
   * @description
   * 创建拦截器实例。
   */
  const createAxiosInstance = (
    instance: RequestInterceptorConfig | ResponseInterceptorConfig,
    instanceKey: keyof AxiosFetchInstance,
  ): void => {
    if (instanceKey === 'requestInstance') {
      axiosFetchInstance.requestInstance = instance as RequestInterceptorConfig
    } else {
      axiosFetchInstance.responseInstance =
        instance as ResponseInterceptorConfig
    }
  }

  /**
   *
   * @param instanceKey - 实例类型标识
   *
   * @returns 对应的实例
   *
   * @description
   * 获取当前实例。
   */
  const getAxiosInstance = (instanceKey: keyof AxiosFetchInstance) => {
    return axiosFetchInstance[instanceKey]
  }

  /**
   *
   * @param key - 队列键名
   * @param func - 拦截器函数数组
   * @param fetchType - 请求类型（成功/失败）
   *
   * @description
   * 设置注入方法队列。
   */
  const setImplement = (
    key: ImplementKeys | ErrorImplementKeys,
    func: AnyFn[],
    fetchType: FetchType,
  ): void => {
    if (fetchType === 'ok') {
      implement[key as ImplementKeys] = func
    } else {
      errorImplement[key as ErrorImplementKeys] = func
    }
  }

  /**
   *
   * @param key - 队列键名
   * @param fetchType - 请求类型（成功/失败）
   *
   * @returns 拦截器函数数组
   *
   * @description
   * 获取队列中所有的拦截器方法。
   */
  const getImplement = (
    key: ImplementKeys | ErrorImplementKeys,
    fetchType: FetchType,
  ): AnyFn[] => {
    return fetchType === 'ok'
      ? implement[key as ImplementKeys]
      : errorImplement[key as ErrorImplementKeys]
  }

  /**
   *
   * @param funcs - 函数数组
   * @param args - 传递给函数的参数
   *
   * @description
   * 队列执行器 - 执行所有拦截器函数。
   */
  const executeQueue = (funcs: AnyFn[], ...args: unknown[]): void => {
    funcs.forEach((func) => {
      if (typeof func === 'function') {
        func(...args)
      }
    })
  }

  /**
   *
   * @param key - 实例类型标识
   * @param implementKey - 队列键名
   * @param fetchType - 请求类型（成功/失败）
   *
   * @description
   * 请求、响应前执行拦截器队列中的所有方法。
   */
  const beforeFetch = (
    key: keyof AxiosFetchInstance,
    implementKey: ImplementKeys | ErrorImplementKeys,
    fetchType: FetchType,
  ): void => {
    const instance = getAxiosInstance(key)

    if (!instance) {
      return
    }

    const funcArr = getImplement(implementKey, fetchType)
    const { MODE } = getAppEnvironment()

    executeQueue(funcArr, instance, MODE)
  }

  /**
   *
   * @param key - 错误类型标识
   * @param error - 错误对象
   * @param errorImplementKey - 错误队列键名
   *
   * @description
   * 请求、响应错误时执行队列中所有方法。
   */
  const fetchError = (
    key: keyof AxiosFetchError,
    error: AxiosError<unknown, unknown>,
    errorImplementKey: ErrorImplementKeys,
  ): void => {
    axiosFetchError[key] = error

    const funcArr = errorImplement[errorImplementKey]
    const { MODE } = getAppEnvironment()

    executeQueue(funcArr, error, MODE)
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

export type AxiosInterceptor = ReturnType<typeof axiosInterceptor>
