import {
  FORBIDDEN_ROUTE_PATH,
  isSystemRoute,
  NOT_FOUND_PAGE_PATH,
  SERVER_ERROR_ROUTE_PATH,
} from '@/router/constant'
import { piniaSigningStore } from '@/store/modules/signing'
import type { Router } from 'vue-router'
import { resolveLandingPath } from './resolve-landing-path'
import { getRouteAccess } from './route-access'

/**
 *
 * @param router 应用的 Router 实例
 *
 * @description
 * 使用已核验的会话和路由权限，重定向返回值交给 Router 处理。
 * 前端守卫不能替代后端鉴权。
 */
export const permissionRouter = (
  router: Router,
  getSession: () => {
    signingCallback: { id?: string }
    revalidateSession: () => Promise<'active' | 'signedOut' | 'changed'>
  } = piniaSigningStore,
) => {
  router.beforeEach(async (to) => {
    const session = getSession()
    const isLogin = to.path === '/'
    const attempted = to.redirectedFrom ?? to

    if (session.signingCallback.id && !isLogin && !isSystemRoute(to)) {
      try {
        if ((await session.revalidateSession()) === 'changed') return false
      } catch {
        return {
          path: SERVER_ERROR_ROUTE_PATH,
          query: { from: attempted.fullPath },
          replace: true,
        }
      }
    }

    if (!session.signingCallback.id) {
      return isLogin
        ? true
        : { path: '/', query: { redirect: attempted.fullPath }, replace: true }
    }

    if (isLogin) {
      const target = router.resolve(
        resolveLandingPath(router, to.query.redirect),
      )

      return {
        path: target.path,
        query: target.query,
        hash: target.hash,
        replace: true,
      }
    }

    if (!to.matched.length)
      return {
        path: NOT_FOUND_PAGE_PATH,
        query: { from: to.fullPath },
        replace: true,
      }

    // Router 在守卫执行前展开重定向；状态页不能再次校验其已被拦截的来源。
    if (
      !isSystemRoute(to) &&
      (getRouteAccess(router, to) === 'forbidden' ||
        (to.redirectedFrom &&
          getRouteAccess(router, attempted) === 'forbidden'))
    )
      return {
        path: FORBIDDEN_ROUTE_PATH,
        query: { from: attempted.fullPath },
      }

    return true
  })
}
