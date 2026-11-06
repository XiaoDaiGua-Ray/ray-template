import { WHITE_ROUTES } from '@/app-config'
import { isSystemRoute } from '@/router/constant'
import type { RouteLocationResolved, Router } from 'vue-router'
import { validRole } from './valid-role'

export type RouteAccessLocation = Pick<
  RouteLocationResolved,
  'fullPath' | 'hash' | 'matched' | 'name' | 'path' | 'query'
>

/**
 *
 * @param router 当前已注册业务路由的实例
 * @param origin 待访问的入口，包括尚未展开的重定向
 * @param currentRole 指定角色；省略时使用当前会话
 * @returns 入口和静态重定向链的访问结果；找不到业务目标时返回 unavailable。
 */
export function getRouteAccess(
  router: Router,
  origin: RouteAccessLocation,
  currentRole?: string | number,
): 'allowed' | 'forbidden' | 'unavailable' {
  const visited = new Set<string>()
  let current = origin

  while (!visited.has(current.path)) {
    const record = current.matched.at(-1)

    if (!record || current.path === '/' || isSystemRoute(current))
      return 'unavailable'

    const white =
      typeof current.name === 'string' && WHITE_ROUTES.includes(current.name)

    if (
      !white &&
      !current.matched.every(({ meta }) => validRole(meta, currentRole))
    )
      return 'forbidden'

    if (!record.redirect) return 'allowed'

    if (typeof record.redirect !== 'string') return 'unavailable'

    visited.add(current.path)
    current = router.resolve({
      path: record.redirect,
      query: current.query,
      hash: current.hash,
    })
  }

  return 'unavailable'
}
