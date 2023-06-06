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

/** 响应拦截器入口 */

import { useAxiosInterceptor, axiosCanceler } from '@/axios/helper/interceptor'

import type { ResponseInterceptorConfig } from '@/axios/type'

const { getAxiosFetchInstance, setImplementQueue } = useAxiosInterceptor()

/** 响应成功后移除缓存请求 url */
const injectResponseCanceler = () => {
  const response = getAxiosFetchInstance(
    'responseInstance',
  ) as ResponseInterceptorConfig

  axiosCanceler.removePendingRequest(response.config)
}

/** 注册响应拦截器 */
export const setupResponseInterceptor = () => {
  setImplementQueue([injectResponseCanceler], 'responseInstance')
}
