import { SERVER_ERROR_ROUTE_PATH } from '@/router/constant'
import { isNavigationFailure, NavigationFailureType } from 'vue-router'
import type { RouteLocationNormalized, Router } from 'vue-router'

/**
 *
 * @param router 当前 Router 实例
 *
 * @description
 * 当前导航通过本全局守卫后失败时显示 500 并保留重试目标，过期懒加载失败不改变页面。
 * 先于本守卫抛出的离开守卫异常沿用 Router 拒绝，避免无法确认归属时抢占新导航。
 */
export const setupRouterErrors = (router: Router) => {
  let latestTarget: RouteLocationNormalized | undefined

  router.beforeEach((to) => {
    latestTarget = to
  })
  router.afterEach((to, _, failure) => {
    // 重复或离开守卫中止的导航可能不经过 beforeEach；旧导航被取消则不能夺回归属。
    if (!isNavigationFailure(failure, NavigationFailureType.cancelled))
      latestTarget = to
  })

  router.onError((error, to) => {
    if (latestTarget !== to) return

    console.error('[Router] Navigation failed.', error)
    window.$loadingBar?.error()

    if (to.path === SERVER_ERROR_ROUTE_PATH) return

    void router
      .replace({ path: SERVER_ERROR_ROUTE_PATH, query: { from: to.fullPath } })
      .catch(() => {
        // 500 页面也无法加载时保留原错误，避免创建无限重定向。
      })
  })
}
