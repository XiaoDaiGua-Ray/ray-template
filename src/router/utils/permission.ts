/**
 * 路由权限由 token、白名单和 meta.role 共同决定；实际后端仍须独立鉴权。
 * 使用返回值守卫，让 Router 5 管理重定向，避免在守卫内另起一次导航。
 */
import { APP_CATCH_KEY, WHITE_ROUTES } from '@/app-config'
import { useAppRoot } from '@/hooks'
import { getStorage, setStorage } from '@/utils'
import type { Router } from 'vue-router'
import { validRole } from './valid-role'

export const permissionRouter = (router: Router) => {
  const { getRootPath } = useAppRoot()

  router.beforeEach((to) => {
    const token = getStorage<string>(APP_CATCH_KEY.token, 'localStorage')
    const isLogin = to.path === '/'

    if (token === null) {
      return isLogin ? true : { path: '/', replace: true }
    }

    const isWhiteRoute =
      typeof to.name === 'string' && WHITE_ROUTES.includes(to.name)

    if (isLogin || (!isWhiteRoute && !validRole(to.meta))) {
      const rootPath = getRootPath.value

      // 保留既有重定向时的缓存行为；若首页本身无权限，取消导航以免循环。
      setStorage(APP_CATCH_KEY.appMenuKey, rootPath, 'localStorage')

      return to.path === rootPath ? false : { path: rootPath, replace: true }
    }

    return true
  })
}
