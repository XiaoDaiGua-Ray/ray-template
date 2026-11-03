import { injectResponseCanceler, responseErrorCanceler } from './plugins/cancel'

/** 响应拦截器注册列表，分别管理成功和失败分支。 */
export default {
  // 响应正常
  implementResponseInterceptorArray: [injectResponseCanceler],
  // 响应错误
  implementResponseInterceptorErrorArray: [responseErrorCanceler],
}
