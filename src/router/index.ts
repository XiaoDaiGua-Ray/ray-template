import { createRouter, createWebHashHistory } from 'vue-router'
import { constantRoutes } from './routes'
import { getCache, setCache } from '@/utils/cache'

import type { App } from 'vue'

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
  router.beforeEach((to, from, next) => {
    const token = getCache('token')
    const route = getCache('menuKey')
    console.log('route', route)
    console.log('token', token)

    if (token !== 'no') {
      if (to.path === '/' || from.path === '/login') {
        if (route !== 'no') {
          next(route)
        } else {
          next('/dashboard')

          setCache('menuKey', '/dashboard')
        }
      } else {
        next()
      }
    } else {
      if (to.path === '/' || from.path === '/login') {
        next()
      } else {
        next('/')
      }
    }
  })
}
