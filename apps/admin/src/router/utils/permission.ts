import { APP_CATCH_KEY, WHITE_ROUTES } from '@/app-config'
import { FORBIDDEN_ROUTE_PATH, NOT_FOUND_PAGE_PATH } from '@/router/constant'
import { getStorage } from '@/utils/cache'
import type { Router } from 'vue-router'
import { resolveLandingPath } from './resolve-landing-path'
import { validRole } from './valid-role'

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

    if (typeof token !== 'string' || !token) {
      return isLogin
        ? true
        : { path: '/', query: { redirect: to.fullPath }, replace: true }
    }

    const isWhiteRoute =
      typeof to.name === 'string' && WHITE_ROUTES.includes(to.name)

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

    if (!isWhiteRoute && !validRole(to.meta))
      return {
        path: FORBIDDEN_ROUTE_PATH,
        query: { from: to.fullPath },
        replace: true,
      }

    return true
  })
}
