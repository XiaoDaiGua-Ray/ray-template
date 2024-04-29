/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-06-06
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/**
 *
 * 请求拦截器入口
 * 被注册方法执行时其实例能够保证获取到, 所以不需要做额外空判断
 * 在内部执行方法中, 已经做了边界处理
 *
 * 提供两个工具方法, 方便类型推导
 *
 * 其中 injectRequestCanceler requestErrorCanceler 方法为 axios request interceptor 方法
 */

import { injectRequestCanceler, requestErrorCanceler } from './plugins/cancel'
import { injectRequestHeaders } from './plugins/request-headers'

/**
 *
 * 注册请求拦截器
 * 请注意执行顺序
 */
export default {
  // 请求正常
  implementRequestInterceptorArray: [
    injectRequestHeaders,
    injectRequestCanceler,
  ],
  // 请求错误
  implementRequestInterceptorErrorArray: [requestErrorCanceler],
}
