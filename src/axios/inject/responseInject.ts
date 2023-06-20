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
 */

import { useAxiosInterceptor, axiosCanceler } from '@/axios/helper/interceptor'

import type {
  ResponseInterceptorConfig,
  BeforeFetchFunction,
  FetchErrorFunction,
} from '@/axios/type'

const { setImplement } = useAxiosInterceptor()

/** 响应成功后移除缓存请求 url */
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
 * 你可以在响应错误的时候做一些什么
 * 这里不做具体演示
 *
 * 方法执行时会有两个参数, 可以根据报错信息与环境定做一些处理
 */
const responseError: FetchErrorFunction<unknown> = (error, mode) => {
  console.log(error, mode)
}

/**
 *
 * 注册响应拦截器
 * 请注意执行顺序
 */
export const setupResponseInterceptor = () => {
  setImplement(
    'implementResponseInterceptorArray',
    [injectResponseCanceler],
    'ok',
  )
}

/**
 *
 * 注册响应错误拦截器
 * 请注意执行顺序
 */
export const setupResponseErrorInterceptor = () => {
  setImplement(
    'implementResponseInterceptorErrorArray',
    [responseError],
    'error',
  )
}
