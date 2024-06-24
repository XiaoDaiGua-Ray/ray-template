/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  AxiosHeaders,
  AxiosRequestConfig,
  HeadersDefaults,
  AxiosDefaults,
  Axios,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosRequestHeaders,
} from 'axios'
import type { AnyFC } from '@/types'

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
  /**
   *
   * @description
   * 是否需要取消该请求。
   */
  cancel?: boolean
}

export interface AppRawRequestConfig<T = any> extends AxiosRequestConfig<T> {
  /**
   *
   * @description
   * 取消请求配置。
   */
  cancelConfig?: CancelConfig
  /**
   *
   * @description
   * 标记该请求的配置项是否被标记了取消。
   */
  __CANCELER_TAG_RAY_TEMPLATE__?: '__CANCELER_TAG_RAY_TEMPLATE__'
  /**
   *
   * @description
   * 该接口是否需要自动弹出请求状态提示。
   * 统一显示后端返回的提示信息。
   *
   * @default true
   */
  responseErrorMessage?: boolean
  /**
   *
   * @description
   * 该接口是否需要自动弹出请求状态提示。
   * 统一显示后端返回的提示信息。
   *
   * @default false
   */
  responseSuccessMessage?: boolean
}

export interface CancelerParams<T = any, D = any>
  extends AppRawRequestConfig<T>,
    AxiosError<T, D> {}

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

export type FetchType = 'ok' | 'error'

export interface AxiosFetchInstance {
  requestInstance: RequestInterceptorConfig | null
  responseInstance: ResponseInterceptorConfig | null
}

export interface AxiosFetchError<T = any> {
  requestError: T | null
  responseError: T | null
}

interface AxiosResponseConfigInterceptor<T = any>
  extends AppRawRequestConfig<T> {
  headers: AxiosRequestHeaders
}

type AxiosResponseOmit<T = any, D = any> = Omit<AxiosResponse<T, D>, 'config'>

type AxiosResponseInterceptorIns<T = any, D = any> = AxiosResponseOmit<T, D> & {
  config: AxiosResponseConfigInterceptor<T>
}

/**
 *
 * @param ins current response instance
 * @param mode current environment mode
 *
 * @description
 * axios response interceptor.
 */
export type AxiosResponseInterceptor<T = any, K = any> = (
  ins: AxiosResponseInterceptorIns<T, K>,
  mode: string,
) => void

/**
 *
 * @param ins current request instance
 * @param mode current environment mode
 *
 * @description
 * axios request interceptor.
 */
export type AxiosRequestInterceptor<T = any> = (
  ins: RequestInterceptorConfig<T>,
  mode: string,
) => void

/**
 *
 * @param error current request error instance
 * @param mode current environment mode
 *
 * @description
 * axios request and response error interceptor.
 * if you need create plugin with error interceptor, you can use this function type.
 */
export type FetchErrorFunction<T = any, D = any> = (
  error: AxiosError<T, D>,
  mode: string,
) => void
