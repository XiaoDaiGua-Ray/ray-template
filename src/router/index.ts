import type { App } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { constantRoutes } from './routes'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

// setup router
export const setupRouter = (app: App<Element>) => {
  app.use(router)
}

/**
 *
 * 预设 `naive-ui` 的顶部加载条效果
 * 如果是使用其余的组件库, 替换即可
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

/**
 *
 * 路由权限守卫
 */
export const permissionRouter = () => {
  // router.beforeEach()
}
