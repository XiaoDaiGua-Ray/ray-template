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
 *
 * 默认预设 admin 作为超级管理员角色, 可根据自身需求修改
 */

import { useSignin } from '@/store'
import { whiteRoutes, superAdmin } from './configuration'

export const validRole = (options: IMenuOptions) => {
  const { role } = storeToRefs(useSignin())

  const { meta, name } = options
  const hidden =
    meta?.hidden === undefined || meta?.hidden === false ? false : meta?.hidden

  // 如果是超级管理员(预设为 admin), 则根据其菜单栏(hidden)字段判断是否显示
  if (superAdmin.length && superAdmin.includes(role.value)) {
    return true && !hidden
  } else {
    // 如果为基础路由, 不进行鉴权则根据其菜单栏(hidden)字段判断是否显示
    if (whiteRoutes.includes(name)) {
      return true && !hidden
    }

    // 判断权限是否匹配和菜单栏(hidden)字段判断是否显示
    if (meta?.role) {
      return meta.role.includes(role.value) && !hidden
    }

    return true && !hidden
  }
}
