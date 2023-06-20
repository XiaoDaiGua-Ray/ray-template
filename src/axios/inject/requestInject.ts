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
 */

import { useAxiosInterceptor, axiosCanceler } from '@/axios/helper/interceptor'
import { appendRequestHeaders } from '@/axios/helper/axiosCopilot'
import { APP_CATCH_KEY } from '@/appConfig/appConfig'
import { getCache } from '@/utils/cache'

import type {
  RequestInterceptorConfig,
  BeforeFetchFunction,
  FetchErrorFunction,
} from '@/axios/type'
const { setImplement } = useAxiosInterceptor()

/**
 *
 * 这里只是示例如何获取到系统缓存的 token 并且返回请求头 token 的 key 和 value
 * 尽可能的拆分每个拦截器的功能函数
 * 这是这个包存在的意义
 *
 * 当然你也可以根据 request instance 来特殊处理, 这里暂时不做演示
 */
const requestHeaderToken = (ins: RequestInterceptorConfig, mode: string) => {
  const token = getCache(APP_CATCH_KEY.token)

  if (ins.url) {
    // TODO: 根据 url 不同是否设置 token
  }

  return {
    key: 'X-TOKEN',
    value: token,
  }
}

/** 注入请求头信息 */
const injectRequestHeaders: BeforeFetchFunction<RequestInterceptorConfig> = (
  ins,
  mode,
) => {
  appendRequestHeaders(ins, [
    requestHeaderToken(ins, mode),
    {
      key: 'Demo-Header-Key',
      value: 'Demo Header Value',
    },
  ])
}

/** 注入重复请求拦截器 */
const injectCanceler: BeforeFetchFunction<RequestInterceptorConfig> = (
  ins,
  mode,
) => {
  axiosCanceler.removePendingRequest(ins) // 检查是否存在重复请求, 若存在则取消已发的请求
  axiosCanceler.addPendingRequest(ins) // 把当前的请求信息添加到 pendingRequest 表中
}

const requestError: FetchErrorFunction<unknown> = (error, mode) => {
  console.log(error, mode)
}

/**
 *
 * 注册请求拦截器
 * 请注意执行顺序
 */
export const setupRequestInterceptor = () => {
  setImplement(
    'implementRequestInterceptorArray',
    [injectRequestHeaders, injectCanceler],
    'ok',
  )
}

/**
 *
 * 注册请求错误拦截器
 * 请注意执行顺序
 */
export const setupRequestErrorInterceptor = () => {
  setImplement('implementRequestInterceptorErrorArray', [requestError], 'error')
}
