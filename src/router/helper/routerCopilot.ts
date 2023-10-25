/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-06-02
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import { permissionRouter } from './permission'
import { SETUP_ROUTER_ACTION, SUPER_ADMIN } from '@/app-config/routerConfig'
import { useSignin } from '@/store'
import { useVueRouter } from '@/hooks/web/index'
import { ROOT_ROUTE } from '@/app-config/appConfig'
import { setStorage } from '@/utils/cache'
import { getAppEnvironment } from '@/utils/basic'

import type { Router } from 'vue-router'
import type { AppRouteMeta } from '@/router/type'
import type { AppMenuOption } from '@/types/modules/app'

/**
 *
 * 校验当前菜单项是否与权限匹配
 * 仅做对于 Meta Role 配置是否匹配做校验, 不关心 Meta Hidden 属性
 *
 * 如果为超级管理员, 则会默认获取所有权限
 */
export const validRole = (meta: AppRouteMeta) => {
  const { signinCallback } = storeToRefs(useSignin())
  const modelRole = computed(() => signinCallback.value.role)
  const { role: metaRole } = meta

  if (SUPER_ADMIN?.length && SUPER_ADMIN.includes(modelRole.value)) {
    return true
  } else {
    // 如果 role 为 undefind 或者空数组, 则认为该路由不做权限过滤
    if (!metaRole || !metaRole?.length) {
      return true
    }

    // 判断是否含有该权限
    if (metaRole) {
      return metaRole.includes(modelRole.value)
    }

    return true
  }
}

/**
 *
 * @remark 校验当前路由是否显示
 *
 * 该方法进行校验时, sameLevel 的优先级最高
 * 如果你仅仅是希望校验是否满足权限, 应该使用另一个方法 validRole
 */
export const validMenuItemShow = (option: AppMenuOption) => {
  const { meta = {} } = option
  const { hidden, sameLevel, env } = meta
  const { MODE } = getAppEnvironment()

  // 如果该路由被标记为平级模式, 则会强制不显示在菜单中
  if (sameLevel) {
    return false
  }

  if (hidden) {
    return false
  }

  if (env && typeof env === 'string' && env !== MODE) {
    return false
  }

  if (env && Array.isArray(env) && !env.includes(MODE)) {
    return false
  }

  return true
}

/**
 *
 * @remark 路由切换启用顶部加载条
 * @remark 路由切换启用加载动画
 */
export const setupRouterLoadingBar = (router: Router) => {
  router.beforeEach(() => {
    window?.$loadingBar?.start()
  })

  router.afterEach(() => {
    window?.$loadingBar?.finish()
  })

  router.onError(() => {
    window?.$loadingBar?.error()
  })
}

/**
 *
 * @param router vue router instance
 *
 * @remark 统一的路由相关功能配置, 虽然该方法有点蠢...
 */
export const vueRouterRegister = (router: Router) => {
  const { setupRouterLoadingBar: cfgSetupRouterLoadingBar, setupRouterGuard } =
    SETUP_ROUTER_ACTION

  if (cfgSetupRouterLoadingBar) {
    setupRouterLoadingBar(router)
  }

  if (setupRouterGuard) {
    permissionRouter(router)
  }
}

/**
 *
 * @param replace 是否使用
 *
 * @remark 重定向路由至首页, 默认采用替换方法重定向
 */
export const redirectRouterToDashboard = (isReplace = true) => {
  const { router } = useVueRouter()

  const { push, replace } = router
  const { path } = ROOT_ROUTE

  setStorage('menuKey', path)

  isReplace ? replace(path) : push(path)
}
