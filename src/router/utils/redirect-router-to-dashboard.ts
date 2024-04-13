import { APP_CATCH_KEY } from '@/app-config'
import { useVueRouter, useAppRoot } from '@/hooks'
import { setStorage } from '@/utils'

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

  setStorage(APP_CATCH_KEY.appMenuKey, getRootPath.value)

  isReplace ? replace(getRootPath.value) : push(getRootPath.value)
}
