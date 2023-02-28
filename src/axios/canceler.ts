/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-02-27
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/**
 *
 * 自动取消重复请求
 *
 * 可以根据自己项目进行定制化配置
 */

import type { AxiosRequestConfig } from 'axios'

export default class RequestCanceler {
  pendingRequest: Map<string, AbortController>

  constructor() {
    this.pendingRequest = new Map<string, AbortController>()
  }

  /**
   *
   * @param config 请求体 config
   * @returns 返回当前请求拼接 key
   *
   * @remark 将当前请求 config 生成 request key
   */
  generateRequestKey(config: AxiosRequestConfig): string {
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
   * @remark 给请求体添加 signal 属性, 用于取消请求
   */
  addPendingRequest(config: AxiosRequestConfig) {
    const requestKey = this.generateRequestKey(config)

    if (!this.pendingRequest.has(requestKey)) {
      const controller = new AbortController()

      config.signal = controller.signal
      this.pendingRequest.set(requestKey, controller)
    } else {
      // 如果已经有该 key 则重新挂载 signal
      config.signal = (
        this.pendingRequest.get(requestKey) as AbortController
      ).signal
    }
  }

  /**
   *
   * @param config axios request config
   *
   * @remark 取消该请求, 并且清除 map 中对应 generateRequestKey value
   */
  removePendingRequest(config: AxiosRequestConfig) {
    const requestKey = this.generateRequestKey(config)

    if (this.pendingRequest.has(requestKey)) {
      this.pendingRequest.get(requestKey)!.abort()

      this.pendingRequest.delete(requestKey)
    }
  }
}
