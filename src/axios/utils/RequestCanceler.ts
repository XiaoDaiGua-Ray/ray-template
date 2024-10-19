/**
 *
 * 自动取消重复请求
 *
 * 可以根据自己项目进行定制化配置
 */

import type { AppRawRequestConfig, CancelerParams } from '@/axios/types'

/**
 *
 * @class RequestCanceler
 *
 * @description
 * 用于取消重复请求，会在请求前添加 signal 属性，用于取消请求。
 * 通过 generateRequestKey 方法生成请求 key，用于标识请求。
 *
 * 如果需要取消请求，则需要在请求前添加 cancelConfig.cancel 为 true；
 * 并且会在请求前添加 __CANCELER_TAG_RAY_TEMPLATE__ 属性，用于标识是否需要取消。
 */
export default class RequestCanceler {
  private pendingRequest: Map<string, AbortController>

  constructor() {
    this.pendingRequest = new Map<string, AbortController>()
  }

  /**
   *
   * @param config 请求体 config
   *
   * @description
   * 判断是否需要添加 signal 属性。
   *
   * 如果 cancelConfig 为 false，则不添加 signal 属性；
   * 如果 cancelConfig 为 true，则添加 signal 属性。
   *
   * @example
   * const bool = isAppending(config) // true or false
   */
  private isAppending(config: AppRawRequestConfig | CancelerParams) {
    return config.cancelConfig?.cancel ?? true
  }

  /**
   *
   * @param config 请求体 config
   *
   * @description
   * 根据当前请求生成 key。
   *
   * @example
   * const key = generateRequestKey(config) // string
   */
  private generateRequestKey(config: AppRawRequestConfig | CancelerParams) {
    const { method, url } = config

    return [
      url || '',
      method || '',
      JSON.stringify(config.params),
      JSON.stringify(config.data),
    ].join('&')
  }

  /**
   *
   * @param config axios request config
   *
   * @description
   * 添加请求到 pendingRequest map 中，用于取消请求。
   * 并且如果已经存在该请求，则会取消上次请求，并且重新挂载 signal。
   *
   * 如果不需要该请求被挂载，则需要在请求前添加 cancelConfig.cancel 为 false。
   * 如果该请求需要被取消，则会添加 __CANCELER_TAG_RAY_TEMPLATE__ 属性，标记是否需要取消。
   *
   * @example
   * addPendingRequest(config)
   */
  addPendingRequest(config: AppRawRequestConfig | CancelerParams) {
    if (this.isAppending(config)) {
      config.__CANCELER_TAG_RAY_TEMPLATE__ = '__CANCELER_TAG_RAY_TEMPLATE__'

      const requestKey = this.generateRequestKey(config)

      if (!this.pendingRequest.has(requestKey)) {
        const controller = new AbortController()

        config.signal = controller.signal

        this.pendingRequest.set(requestKey, controller)
      } else {
        // 如果已经有该 key 则重新挂载 signal
        config.signal = this.pendingRequest.get(requestKey)?.signal
      }
    }
  }

  /**
   *
   * @param config axios request config
   *
   * @description
   * 移除 pendingRequest map 中的请求，如果存在的话。
   *
   * @example
   * removePendingRequest(config)
   */
  removePendingRequest(config: AppRawRequestConfig | CancelerParams) {
    const requestKey = this.generateRequestKey(config)

    if (this.pendingRequest.has(requestKey)) {
      this.pendingRequest.get(requestKey)!.abort()
      this.pendingRequest.delete(requestKey)
    }
  }

  /**
   *
   * @description
   * 移除所有 pendingRequest map 中的请求。
   *
   * 值得注意的是，该方法会一次性移除所有的请求，所以需要注意是否有需要在后台挂载的请求；
   * 如果有需要在后台挂载的请求，则需要在请求前添加 cancelConfig.cancel 为 false。
   *
   * @example
   * cancelAllRequest()
   */
  cancelAllRequest() {
    this.pendingRequest.forEach((curr) => {
      curr.abort()
    })
  }
}
