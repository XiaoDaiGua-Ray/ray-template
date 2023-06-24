/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-03-31
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/**
 *
 * 该方法演示如何使用 axios
 *
 * 示范如何完整批注响应体及其数据:
 *
 * ```
 * const demoRequest = () => {
 *   return {} as AxiosResponseBody<AxiosTestResponse>
 * }
 * ```
 */

import useRequest from '@/axios/instance'

interface AxiosTestResponse extends UnknownObjectKey {
  data: UnknownObjectKey[]
  city?: string
}

/**
 *
 * @returns 测试
 *
 * @medthod get
 */
export const onAxiosTest = async (city: string) => {
  return useRequest<AxiosTestResponse>({
    url: `https://www.tianqiapi.com/api?version=v9&appid=23035354&appsecret=8YvlPNrz&city=${city}`,
  })
}
