import type { AxiosConfig } from '@/types'

/** axios 相关配置 */
export const AXIOS_CONFIG: AxiosConfig = {
  baseURL: '', // `const { MODE } = getAppEnvironment()`,
  withCredentials: false, // 是否允许跨域携带 `cookie`
  timeout: 5 * 1000,
  headers: {
    'Content-Type': 'application/json',
  },
}
