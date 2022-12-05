import useRequest from '../index'

/**
 *
 * @returns 测试
 *
 * @medthod get
 */
export const onAxiosTest = async (city: string) => {
  return useRequest({
    method: 'get',
    url: `https://www.tianqiapi.com/api?version=v9&appid=23035354&appsecret=8YvlPNrz&city=${city}`,
  })
}
