import { createRouter, createWebHashHistory } from 'vue-router'
import { constantRoutes } from './routes'

import { permissionRouter as _permissionRouter } from './permission'
import { getElement } from '@/utils/element'

import type { App } from 'vue'
import type { RouteRecordRaw, RouteLocationNormalized } from 'vue-router'

/**
 *
 * 切换路由时, 手动将容器区域回归默认值
 *
 * 由于官方不支持这个方法了, 所以自己手写了一个
 * 如果需要忽略恢复默认位置, 仅需要在 meta 中配置 ignoreResetScroll 属性即可
 *
 * 找到滚动元素容器的写法有点丑陋, 暂时也想不到啥好方法解决, 就凑合一下吧
 */
const scrollViewToTop = (route: RouteLocationNormalized) => {
  const { meta } = route

  /** 这个 id 是注入在 layout 中 */
  if (!meta?.ignoreResetScroll) {
    const scrollViewRoot = getElement(
      '#rayLayoutContentWrapperScopeSelector',
    )?.[0]

    if (scrollViewRoot && typeof scrollViewRoot.scroll) {
      /** 找到 NLayoutContent 组件滚动元素 */
      const scrollView = scrollViewRoot?.firstElementChild
        ?.firstChild as HTMLElement

      scrollView?.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      })
    }
  }
}

export const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes as unknown as RouteRecordRaw[],
  scrollBehavior: (to) => {
    scrollViewToTop(to)

    return {
      top: 0,
      left: 0,
    }
  },
})

export const permissionRouter = () => _permissionRouter(router)

// setup router
export const setupRouter = (app: App<Element>) => {
  app.use(router)
}

/**
 *
 * @remark 路由切换启用顶部加载条
 * @remark 路由切换启用加载动画
 */
export const setupRouterLoadingBar = () => {
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
