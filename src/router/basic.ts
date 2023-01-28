/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-01-28
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/**
 *
 * 公共路由, 不需要鉴权
 *
 * 需要按照路由名称一一对应, 鉴权会采用 includes 进行判断
 *
 * 如果需要添加公共路由, 不希望添加复杂 meta 配置, 则可以在此添加路由名称即可
 *
 * 该配置会覆盖 meta 配置
 */

import { useSignin } from '@/store'

const BASIC_ROUTER = ['login', 'error-page', 'doc']
const BASE_ROLES = ['admin']

export const validRole = (options: IMenuOptions) => {
  const { role } = storeToRefs(useSignin())

  const { meta, name } = options
  const hidden =
    meta?.hidden === undefined || meta?.hidden === false ? meta?.hidden : true

  if (BASE_ROLES.includes(role.value)) {
    return true && hidden
  } else {
    if (BASIC_ROUTER.includes(name)) {
      return true && hidden
    }

    if (meta?.role) {
      return meta.role.includes(role.value) && hidden
    }

    return true && hidden
  }
}
