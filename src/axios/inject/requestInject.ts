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
 */

import { useAxiosInterceptor, axiosCanceler } from '@/axios/helper/interceptor'
import { appendRequestHeaders } from '@/axios/helper/axiosCopilot'

import type { RequestInterceptorConfig, ImplementFunction } from '@/axios/type'
const { setImplementQueue } = useAxiosInterceptor()

/** 注入请求头信息 */
const injectRequestHeaders: ImplementFunction<RequestInterceptorConfig> = (
  ins,
  mode,
) => {
  appendRequestHeaders(ins, [
    {
      key: 'X-TOKEN',
      value: 'token',
    },
  ])
}

/** 注入重复请求拦截器 */
const injectCanceler: ImplementFunction<RequestInterceptorConfig> = (
  ins,
  mode,
) => {
  axiosCanceler.removePendingRequest(ins) // 检查是否存在重复请求, 若存在则取消已发的请求
  axiosCanceler.addPendingRequest(ins) // 把当前的请求信息添加到 pendingRequest 表中
}

/**
 *
 * 注册请求拦截器
 * 请注意执行顺序, setImplementQueue 方法按照注册顺序执行
 */
export const setupRequestInterceptor = () => {
  setImplementQueue([injectRequestHeaders, injectCanceler], 'requestInstance')
}
