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

/**
 *
 * onlyoffice
 *
 * 该功能暂未实现, 后续应该会补上
 * 由于该方法需要后端进行相关配合, 因为目前还在考虑是否接上私有 onlyoffice 服务器, 所以该功能暂未实现
 * 望多多理解, 理解万岁
 */

import { getAppEnvironment } from '@use-utils/hook'
import request from '@/axios/instance'

export const getOfficeDocumentApi = async (uuid: string) => {
  const { VITE_APP_OFFICE_PROXY_URL } = getAppEnvironment()
  const { get } = request
}
