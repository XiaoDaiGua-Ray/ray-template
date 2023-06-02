import type {
  AxiosHeaders,
  AxiosRequestConfig,
  HeadersDefaults,
  AxiosDefaults,
  Axios,
} from 'axios'

export type AxiosHeaderValue =
  | AxiosHeaders
  | string
  | string[]
  | number
  | boolean
  | null

export interface RequestHeaderOptions {
  key: string
  value: AxiosHeaderValue
}

export interface AxiosInstanceExpand extends Axios {
  <T = unknown, D = unknown>(config: AxiosRequestConfig<D>): Promise<T>
  <T = unknown, D = unknown>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Promise<T>

  getUri(config?: AxiosRequestConfig): string
  request<R = unknown, D = unknown>(config: AxiosRequestConfig<D>): Promise<R>
  get<R = unknown, D = unknown>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>
  delete<R = unknown, D = unknown>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>
  head<R = unknown, D = unknown>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>
  options<R = unknown, D = unknown>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>
  post<R = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>
  put<R = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>
  patch<R = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>
  postForm<R = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>
  putForm<R = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>
  patchForm<R = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>

  defaults: Omit<AxiosDefaults, 'headers' | 'cancelToken'> & {
    headers: HeadersDefaults & {
      [key: string]: AxiosHeaderValue
    }
  }
}
