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
 */

import { useAxiosInterceptor, axiosCanceler } from '@/axios/helper/interceptor'

import type { ResponseInterceptorConfig, ImplementFunction } from '@/axios/type'

const { setImplementQueue } = useAxiosInterceptor()

/** 响应成功后移除缓存请求 url */
const injectResponseCanceler: ImplementFunction<ResponseInterceptorConfig> = (
  ins,
  mode,
) => {
  axiosCanceler.removePendingRequest(ins.config)
}

/**
 *
 * 注册响应拦截器
 * 请注意执行顺序, setImplementQueue 方法按照注册顺序执行
 */
export const setupResponseInterceptor = () => {
  setImplementQueue([injectResponseCanceler], 'responseInstance')
}
