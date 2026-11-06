import { WELCOME_ROUTE_PATH } from '@/router/constant'
import type { Router } from 'vue-router'
import { getRouteAccess } from './route-access'

/**
 *
 * @param router 当前已注册业务与系统页面的 Router
 * @param requested 登录返回或错误恢复时请求的站内地址，可来自不可信查询参数
 *
 * @description
 * 只恢复仍存在且当前角色有权访问的业务地址，保留原查询参数和片段。
 * 不选择首页、缓存菜单或第一个菜单；无有效目标时进入空工作区。
 *
 * @returns 可安全导航的原始站内完整路径，或 /welcome。
 */
export function resolveLandingPath(router: Router, requested?: unknown) {
  if (
    typeof requested !== 'string' ||
    !requested.startsWith('/') ||
    requested.startsWith('//') ||
    /[\\\p{Cc}]/u.test(requested)
  )
    return WELCOME_ROUTE_PATH

  const original = router.resolve(requested)

  return getRouteAccess(router, original) === 'allowed'
    ? original.fullPath
    : WELCOME_ROUTE_PATH
}
