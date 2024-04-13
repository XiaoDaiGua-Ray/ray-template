import type { Router } from 'vue-router'

/**
 *
 * @description
 * 路由切换启用顶部加载条。
 * 路由切换启用加载动画。
 */
export const setupRouterLoadingBar = (router: Router) => {
  router.beforeEach(() => {
    window.$loadingBar?.start()
  })

  router.afterEach(() => {
    window.$loadingBar?.finish()
  })

  router.onError(() => {
    window.$loadingBar?.error()
  })
}
