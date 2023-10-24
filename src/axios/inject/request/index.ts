/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-10-23
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import { useAxiosInterceptor } from '@/axios/helper/interceptor'
import implement from './provider'

const { setImplement } = useAxiosInterceptor()

export const setupRequestInterceptor = () => {
  const { implementRequestInterceptorArray } = implement

  setImplement(
    'implementRequestInterceptorArray',
    implementRequestInterceptorArray,
    'ok',
  )
}

export const setupRequestErrorInterceptor = () => {
  const { implementRequestInterceptorErrorArray } = implement

  setImplement(
    'implementRequestInterceptorErrorArray',
    implementRequestInterceptorErrorArray,
    'error',
  )
}
