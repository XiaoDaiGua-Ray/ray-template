/**
 *
 * 该方法演示如何封装一个通用请求方法
 *
 * 步骤：
 * 1. 定义一个方法（见下面的 demo 方法）
 * 2. 暴露该函数
 * 3. 如果该方法在 setup 环境中使用，则可以使用 useHookPlusRequest 包裹该方法，即可便捷使用该请求函数。如果请求方法在非 setup 环境中使用，直接使用即可
 */

import { request } from '@/axios'

import type { BasicResponse } from '@/types'

interface AxiosTestResponse extends UnknownObjectKey {
  data: UnknownObjectKey[]
  city?: string
}

interface JSONPlaceholder {
  completed: boolean
  id: number
  title: string
  userId: number
}

/**
 *
 * @returns 测试
 *
 * @medthod get
 */
export const getWeather = (city: string) => {
  return request<AxiosTestResponse>({
    url: `https://www.tianqiapi.com/api?version=v9&appid=23035354&appsecret=8YvlPNrz&city=${city}`,
    method: 'get',
  })
}

export const getTypicCode = () => {
  return request<JSONPlaceholder>({
    url: 'https://jsonplaceholder.typicode.com/todos/1',
    method: 'get',
  })
}
