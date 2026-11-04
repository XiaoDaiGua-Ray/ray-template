import { APP_CATCH_KEY } from '@/app-config'
import { useAppRoot, useVueRouter } from '@/hooks'
import { setStorage } from '@/utils/cache'
import { resolveLandingPath } from './resolve-landing-path'

/**
 *
 * @param replace 是否使用
 *
 * @description
 * 重定向路由至首页，默认采用替换方法重定向。
 */
export const redirectRouterToDashboard = (isReplace = true) => {
  const { router } = useVueRouter()

  const { push, replace } = router
  const { getRootPath } = useAppRoot()

  const path = resolveLandingPath(router, getRootPath.value)

  setStorage(APP_CATCH_KEY.appMenuKey, path, 'localStorage')

  return isReplace ? replace(path) : push(path)
}
