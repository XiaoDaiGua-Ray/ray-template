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
 * 响应拦截器入口
 * 被注册方法执行时其实例能够保证获取到, 所以不需要做额外空判断
 * 在内部执行方法中, 已经做了边界处理
 *
 * 提供两个工具方法, 方便类型推导
 *
 * 其中 injectResponseCanceler responseErrorCanceler 方法是注入的 axios response interceptor 方法
 */

import { axiosCanceler } from '@/axios/helper/interceptor'

import type {
  ResponseInterceptorConfig,
  BeforeFetchFunction,
  FetchErrorFunction,
} from '@/axios/type'
import type { Recordable } from '@/types/modules/helper'

/**
 *
 * @param ins 当前响应实例
 * @param mode 当前环境
 *
 * 响应成功后注销请求取消器
 */
const injectResponseCanceler: BeforeFetchFunction<ResponseInterceptorConfig> = (
  ins,
  mode,
) => {
  axiosCanceler.removePendingRequest(ins.config)
}

/**
 *
 * @param error 错误信息
 * @param mode 当前环境
 *
 * 注销失败请求取消器
 */
const responseErrorCanceler: FetchErrorFunction<Recordable> = (error, mode) => {
  axiosCanceler.removePendingRequest(error.config)
}

/**
 *
 * 注册响应拦截器
 * 请注意执行顺序
 */
export default {
  // 响应正常
  implementResponseInterceptorArray: [injectResponseCanceler],
  // 响应错误
  implementResponseInterceptorErrorArray: [responseErrorCanceler],
}
