import { AXIOS_CONFIG } from '@/app-config'
import { createHttpClient } from '@ray-template/http'
import requestHandlers from './axios-interceptor/request/provider'
import responseHandlers from './axios-interceptor/response/provider'

const client = createHttpClient({
  axios: AXIOS_CONFIG,
  mode: import.meta.env.MODE,
  onRequest: requestHandlers.implementRequestInterceptorArray,
  onRequestError: requestHandlers.implementRequestInterceptorErrorArray,
  onResponse: responseHandlers.implementResponseInterceptorArray,
  onResponseError: responseHandlers.implementResponseInterceptorErrorArray,
})

export const axiosCanceler = client.canceler
export default client.request
