/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  AxiosHeaders,
  AxiosRequestConfig,
  HeadersDefaults,
  AxiosDefaults,
  Axios,
  InternalAxiosRequestConfig,
  AxiosResponse,
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
  <T = any, D = any>(config: AxiosRequestConfig<D>): Promise<T>
  <T = any, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<T>

  getUri(config?: AxiosRequestConfig): string
  request<R = any, D = any>(config: AxiosRequestConfig<D>): Promise<R>
  get<R = any, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>
  delete<R = any, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>
  head<R = any, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>
  options<R = any, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>
  post<R = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>
  put<R = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>
  patch<R = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>
  postForm<R = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>
  putForm<R = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>
  patchForm<R = any, D = any>(
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

export type RequestInterceptorConfig<T = any> = InternalAxiosRequestConfig<T>

export type ResponseInterceptorConfig<T = any, K = any> = AxiosResponse<T, K>

export type ImplementKey = 'requestInstance' | 'responseInstance'

export interface ImplementQueue {
  implementRequestInterceptorArray: AnyFunc[]
  implementResponseInterceptorArray: AnyFunc[]
}

export type ImplementFunction<
  T = RequestInterceptorConfig | ResponseInterceptorConfig,
> = <K extends T>(ins: K, mode: string) => void
