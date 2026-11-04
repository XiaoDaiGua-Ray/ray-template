import axios from 'axios'
import type { AxiosError, CreateAxiosDefaults } from 'axios'
import RequestCanceler from './RequestCanceler'
import type {
  AxiosInstanceExpand,
  AxiosRequestInterceptor,
  AxiosResponseInterceptor,
  FetchErrorFunction,
  RequestInterceptorConfig,
  ResponseInterceptorConfig,
} from './types'

interface HttpOptions {
  axios?: CreateAxiosDefaults
  mode?: string
  onRequest?: readonly AxiosRequestInterceptor[]
  onResponse?: readonly AxiosResponseInterceptor[]
  onRequestError?: readonly FetchErrorFunction[]
  onResponseError?: readonly FetchErrorFunction[]
}

export function createHttpClient(options: HttpOptions = {}) {
  const client = axios.create(options.axios)
  const canceler = new RequestCanceler()
  const mode = options.mode ?? ''

  const reject = (
    error: AxiosError,
    handlers?: readonly FetchErrorFunction[],
  ) => {
    if (error.config) canceler.releasePendingRequest(error.config)

    handlers?.forEach((handle) => handle(error, mode))

    return Promise.reject(error)
  }

  client.interceptors.request.use(
    (request) => {
      const config = request as RequestInterceptorConfig

      options.onRequest?.forEach((handle) => handle(config, mode))

      if (!config.signal && config.cancelConfig?.cancel !== false) {
        canceler.removePendingRequest(config)
        canceler.addPendingRequest(config)
      }

      return request
    },
    (error: AxiosError) => reject(error, options.onRequestError),
  )

  client.interceptors.response.use(
    (response) => {
      options.onResponse?.forEach((handle) =>
        handle(response as ResponseInterceptorConfig, mode),
      )
      canceler.releasePendingRequest(response.config)

      return response.data
    },
    (error: AxiosError) => reject(error, options.onResponseError),
  )

  return { request: client as AxiosInstanceExpand, canceler }
}
