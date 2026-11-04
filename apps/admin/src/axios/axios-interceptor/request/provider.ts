import { injectRequestHeaders } from './plugins/request-headers'

export default {
  implementRequestInterceptorArray: [injectRequestHeaders],
  implementRequestInterceptorErrorArray: [],
}
