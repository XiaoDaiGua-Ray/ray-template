import type { AppRawRequestConfig, CancelerParams } from '@/axios/types'

/**
 *
 * @description
 * 请求取消器。
 *
 * 用于管理和取消重复的 HTTP 请求：
 * - 自动为请求添加 AbortController signal
 * - 通过请求特征生成唯一 key 来识别重复请求
 * - 支持取消单个或所有待处理的请求
 *
 * @example
 * ```ts
 * const canceler = new RequestCanceler()
 *
 * // 添加请求到待处理队列
 * canceler.addPendingRequest(config)
 *
 * // 移除并取消特定请求
 * canceler.removePendingRequest(config)
 *
 * // 取消所有待处理请求
 * canceler.cancelAllRequest()
 * ```
 */
export default class RequestCanceler {
  /** 待处理请求的 Map，key 为请求标识，value 为 AbortController */
  private readonly pendingRequest = new Map<string, AbortController>()

  /**
   *
   * @param config - 请求配置
   *
   * @returns 是否需要添加取消功能，默认为 true
   *
   * @description
   * 判断请求是否需要添加取消功能。
   */
  private shouldAddCanceler(
    config: AppRawRequestConfig | CancelerParams,
  ): boolean {
    return config.cancelConfig?.cancel ?? true
  }

  /**
   *
   * @param config - 请求配置
   *
   * @returns 请求的唯一标识字符串
   *
   * @description
   * 基于 URL、方法、参数和数据生成请求的唯一标识 key。
   */
  private generateRequestKey(
    config: AppRawRequestConfig | CancelerParams,
  ): string {
    const { method = '', url = '', params, data } = config

    return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&')
  }

  /**

   * @param config - Axios 请求配置

   * @description
   * 添加请求到 pendingRequest map 中，用于取消请求。
   * 并且如果已经存在该请求，则会取消上次请求，并且重新挂载 signal。
   *
   * 如果不需要该请求被挂载，则需要在请求前添加 cancelConfig.cancel 为 false。
   * 如果该请求需要被取消，则会添加 __CANCELER_TAG_RAY_TEMPLATE__ 属性，标记是否需要取消。

   * @example
   * ```ts
   * // 默认启用取消功能
   * canceler.addPendingRequest(config)
   *
   * // 禁用取消功能
   * canceler.addPendingRequest({
   *   ...config,
   *   cancelConfig: { cancel: false }
   * })
   * ```
   */
  addPendingRequest(config: AppRawRequestConfig | CancelerParams): void {
    if (!this.shouldAddCanceler(config)) {
      return
    }

    config.__CANCELER_TAG_RAY_TEMPLATE__ = '__CANCELER_TAG_RAY_TEMPLATE__'

    const requestKey = this.generateRequestKey(config)
    const existingController = this.pendingRequest.get(requestKey)

    if (existingController) {
      // 复用现有的 signal
      config.signal = existingController.signal
    } else {
      // 创建新的 AbortController
      const controller = new AbortController()

      config.signal = controller.signal
      this.pendingRequest.set(requestKey, controller)
    }
  }

  /**
   *
   * @param config - Axios 请求配置
   *
   * @description
   * 移除并取消特定请求，
   * 从待处理队列中移除请求，并调用 abort() 取消该请求。
   *
   * @example
   * ```ts
   * canceler.removePendingRequest(config)
   * ```
   */
  removePendingRequest(config: AppRawRequestConfig | CancelerParams): void {
    const requestKey = this.generateRequestKey(config)
    const controller = this.pendingRequest.get(requestKey)

    if (controller) {
      controller.abort()
      this.pendingRequest.delete(requestKey)
    }
  }

  /**
   *
   * @description
   * 取消所有待处理的请求。
   *
   * 遍历并取消队列中的所有请求，然后清空队列。
   *
   * ⚠️ 注意：此方法会取消所有请求，包括后台运行的请求。
   *
   * 如果某些请求不应被取消，请在请求配置中设置 `cancelConfig.cancel = false`
   *
   * @example
   * ```ts
   * // 在路由切换或组件卸载时取消所有请求
   * canceler.cancelAllRequest()
   * ```
   */
  cancelAllRequest(): void {
    this.pendingRequest.forEach((controller) => {
      controller.abort()
    })
    this.pendingRequest.clear()
  }

  /**
   *
   * @returns 待处理请求数量
   *
   * @description
   * 获取当前待处理请求的数量。
   */
  getPendingCount(): number {
    return this.pendingRequest.size
  }

  /**
   *
   * @param config - 请求配置
   *
   * @returns 是否存在于待处理队列
   *
   * @description
   * 检查特定请求是否在待处理队列中。
   */
  hasPendingRequest(config: AppRawRequestConfig | CancelerParams): boolean {
    const requestKey = this.generateRequestKey(config)

    return this.pendingRequest.has(requestKey)
  }
}
