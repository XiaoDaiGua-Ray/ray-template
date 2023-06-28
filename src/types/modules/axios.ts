export interface AxiosResponseBody<T = unknown> {
  data: T
  message: string
  code: number
}
