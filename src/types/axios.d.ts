export {}

declare global {
  /**
   *
   * 请求响应体类型
   *
   * 可以根据自己实际情况更改
   */
  declare interface AxiosResponseBody<T = unknown> {
    data: T
    message: string
    code: number
  }
}
