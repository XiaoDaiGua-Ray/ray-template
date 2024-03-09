import { createRouter, createWebHashHistory } from 'vue-router'
import { scrollViewToTop } from '@/router/utils/setupHelper'
import { vueRouterRegister } from '@/router/utils/routerCopilot'
import { useVueRouter } from '@/hooks'

import constantRoutes from './routes'

import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes as unknown as RouteRecordRaw[],
  scrollBehavior: (to) => {
    scrollViewToTop(to)
  },
})

/**
 *
 * @param app vue instance
 *
 * @description
 * 该方法用于注册 vue-router，并且初始化一些配置方法。
 */
export const setupRouter = (app: App<Element>) => {
  app.use(router)

  // 等待 router 挂载后，初始化 useRouter 方法
  useVueRouter()
  vueRouterRegister(router)
}
