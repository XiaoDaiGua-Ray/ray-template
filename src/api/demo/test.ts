import { request } from '@/axios'
import type { BasicResponse } from '@/types'

interface AxiosTestResponse extends GlobalRecordable {
  data: GlobalRecordable[]
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
 * @param city 天气查询接口所需的城市名称
 *
 * @description
 * 按城市名称请求演示天气接口。
 *
 * @returns 演示接口的响应 Promise
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
