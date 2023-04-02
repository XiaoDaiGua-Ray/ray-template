/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-03-22
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import { getDetermineEnv } from '@use-utils/hook'
import request from '@/axios/instance'

export const getOfficeDocumentApi = async (uuid: string) => {
  const { VITE_APP_OFFICE_PROXY_URL } = getDetermineEnv()
  const { get } = request
}
