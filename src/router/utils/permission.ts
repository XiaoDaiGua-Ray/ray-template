import { APP_CATCH_KEY, WHITE_ROUTES } from '@/app-config'
import { useAppRoot } from '@/hooks'
import { getStorage, setStorage } from '@/utils'
import type { Router } from 'vue-router'
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
