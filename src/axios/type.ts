/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  AxiosHeaders,
  AxiosRequestConfig,
  HeadersDefaults,
  AxiosDefaults,
  Axios,
  AxiosResponse,
} from 'axios'
import type { AnyFC } from '@/types/modules/utils'

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

export interface CancelConfig {
  needCancel?: boolean
}

export interface AppRawRequestConfig<T = any> extends AxiosRequestConfig<T> {
  cancelConfig?: CancelConfig
}

export interface AxiosInstanceExpand extends Axios {
  <T = any, D = any>(config: AppRawRequestConfig<D>): Promise<T>
  <T = any, D = any>(url: string, config?: AppRawRequestConfig<D>): Promise<T>

  getUri(config?: AppRawRequestConfig): string
  request<R = any, D = any>(config: AppRawRequestConfig<D>): Promise<R>
  get<R = any, D = any>(
    url: string,
    config?: AppRawRequestConfig<D>,
  ): Promise<R>
  delete<R = any, D = any>(
    url: string,
    config?: AppRawRequestConfig<D>,
  ): Promise<R>
  head<R = any, D = any>(
    url: string,
    config?: AppRawRequestConfig<D>,
  ): Promise<R>
  options<R = any, D = any>(
    url: string,
    config?: AppRawRequestConfig<D>,
  ): Promise<R>
  post<R = any, D = any>(
    url: string,
    data?: D,
    config?: AppRawRequestConfig<D>,
  ): Promise<R>
  put<R = any, D = any>(
    url: string,
    data?: D,
    config?: AppRawRequestConfig<D>,
  ): Promise<R>
  patch<R = any, D = any>(
    url: string,
    data?: D,
    config?: AppRawRequestConfig<D>,
  ): Promise<R>
  postForm<R = any, D = any>(
    url: string,
    data?: D,
    config?: AppRawRequestConfig<D>,
  ): Promise<R>
  putForm<R = any, D = any>(
    url: string,
    data?: D,
    config?: AppRawRequestConfig<D>,
  ): Promise<R>
  patchForm<R = any, D = any>(
    url: string,
    data?: D,
    config?: AppRawRequestConfig<D>,
  ): Promise<R>

  defaults: Omit<AxiosDefaults, 'headers' | 'cancelToken'> & {
    headers: HeadersDefaults & {
      [key: string]: AxiosHeaderValue
    }
  }
}

export type RequestInterceptorConfig<T = any> = AppRawRequestConfig<T>

export type ResponseInterceptorConfig<T = any, K = any> = AxiosResponse<T, K>

export interface ImplementQueue {
  implementRequestInterceptorArray: AnyFC[]
  implementResponseInterceptorArray: AnyFC[]
}

export interface ErrorImplementQueue {
  implementRequestInterceptorErrorArray: AnyFC[]
  implementResponseInterceptorErrorArray: AnyFC[]
}

export type BeforeFetchFunction<
  T = RequestInterceptorConfig | ResponseInterceptorConfig,
> = <K extends T>(ins: K, mode: string) => void

export type FetchType = 'ok' | 'error'

export type FetchErrorFunction<T = any> = <K extends T>(
  error: K,
  mode: string,
) => void

export interface AxiosFetchInstance {
  requestInstance: RequestInterceptorConfig | null
  responseInstance: ResponseInterceptorConfig | null
}

export interface AxiosFetchError<T = unknown> {
  requestError: T | null
  responseError: T | null
}
