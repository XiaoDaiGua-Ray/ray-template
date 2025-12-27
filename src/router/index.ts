import { useVueRouter } from '@/hooks'
import { scrollViewToTop, vueRouterRegister } from '@/router/utils'
import type { App } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import constantRoutes from './routes'

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
