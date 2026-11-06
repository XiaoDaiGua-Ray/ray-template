import { APP_CATCH_KEY } from '@/app-config'
import {
  FORBIDDEN_ROUTE_PATH,
  isSystemRoute,
  NOT_FOUND_PAGE_PATH,
} from '@/router/constant'
import { getStorage } from '@/utils/cache'
import type { Router } from 'vue-router'
import { resolveLandingPath } from './resolve-landing-path'
import { getRouteAccess } from './route-access'

/**
 *
 * @param router 应用的 Router 实例
 *
 * @description
 * 注册 token、白名单与 meta.role 权限守卫，重定向返回值交给 Router 处理。
 * 前端守卫不能替代后端鉴权。
 */
export const permissionRouter = (router: Router) => {
  router.beforeEach((to) => {
    const token = getStorage<string>(APP_CATCH_KEY.token, 'localStorage')
    const isLogin = to.path === '/'
    const attempted = to.redirectedFrom ?? to

    if (typeof token !== 'string' || !token) {
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
