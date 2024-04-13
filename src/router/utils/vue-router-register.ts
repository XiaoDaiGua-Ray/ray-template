import { permissionRouter } from './permission'
import { SETUP_ROUTER_ACTION } from '@/app-config'
import { setupRouterLoadingBar } from './setup-router-loading-bar'

import type { Router } from 'vue-router'

/**
 *
 * @param router vue router instance
 *
 * @description
 * 统一的路由相关功能配置，虽然该方法有点蠢。
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
