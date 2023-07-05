/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-06-02
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import type { AxiosConfig } from '@/types/modules/appConfig'

/** axios 相关配置 */
export const AXIOS_CONFIG: AxiosConfig = {
  baseURL: '', // `import.meta.env`,
  withCredentials: false, // 是否允许跨域携带 `cookie`
  timeout: 5 * 1000,
  headers: {
    'Content-Type': 'application/json',
  },
}
