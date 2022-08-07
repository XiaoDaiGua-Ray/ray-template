import axios from 'axios'

import { useDetermineEnv } from '@use-utils/hook'

const server = axios.create({
  baseURL: '', // import.meta.env,
  withCredentials: false, // 是否允许跨域携带cookie
  timeout: 5 * 1000,
})

server.interceptors.request.use(
  (request) => {
    const { MODE } = useDetermineEnv()

    if (MODE === 'development') {
      // TODO: 开发环境
    } else if (MODE === 'production') {
      // TODO: 生产环境
    }

    return request
  },
  (error) => {
    return Promise.reject(error)
  },
)

server.interceptors.response.use(
  (response) => {
    const { data } = response

    return Promise.resolve(data)
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default server
