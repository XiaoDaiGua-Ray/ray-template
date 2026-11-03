import { injectRequestCanceler, requestErrorCanceler } from './plugins/cancel'
import { injectRequestHeaders } from './plugins/request-headers'

/** 请求拦截器注册列表；调整顺序前需核对 Axios 的执行顺序。 */
export default {
  // 请求正常
  implementRequestInterceptorArray: [
    injectRequestHeaders,
    injectRequestCanceler,
  ],
  // 请求错误
  implementRequestInterceptorErrorArray: [requestErrorCanceler],
}
