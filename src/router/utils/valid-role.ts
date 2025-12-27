import { SUPER_ADMIN } from '@/app-config'
import type { AppRouteMeta } from '@/router/types'
import { useSigningGetters } from '@/store'

/**
 *
 * @description
 * 校验当前菜单项是否与权限匹配。
 * 仅做对于 Meta Role 配置是否匹配做校验，不关心 Meta Hidden 属性。
 *
 * 如果为超级管理员，则会默认获取所有权限。
 *
 * true: 表示有权限
 * false: 表示没有权限
 */
export const validRole = (meta: AppRouteMeta) => {
  const { getSigningCallback } = useSigningGetters()
  const { role: metaRole } = meta

  if (
    SUPER_ADMIN?.length &&
    SUPER_ADMIN.includes(getSigningCallback.value.role)
  ) {
    return true
  } else {
    // 如果 role 为 undefined 或者空数组, 则认为该路由不做权限过滤
    if (!metaRole || !metaRole?.length) {
      return true
    }

    // 判断是否含有该权限
    if (metaRole) {
      return metaRole.includes(getSigningCallback.value.role)
    }

    return true
  }
}
