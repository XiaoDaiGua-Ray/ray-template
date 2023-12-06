import { createRouter, createWebHashHistory } from 'vue-router'
import { scrollViewToTop } from '@/router/helper/setupHelper'
import { vueRouterRegister } from '@/router/helper/routerCopilot'
import { useVueRouter } from '@/hooks/web'

import constantRoutes from './routes'

import type { App } from 'vue'
import type { RouteRecordRaw, Router } from 'vue-router'

export let router: Router

/**
 *
 * 创建 vue router 实例
 * 注册 scrollBehavior 方法
 */
const createVueRouter = async () => {
  return createRouter({
    history: createWebHashHistory(),
    routes: (await constantRoutes()) as unknown as RouteRecordRaw[],
    scrollBehavior: (to) => {
      scrollViewToTop(to)

      return {
        top: 0,
        left: 0,
      }
    },
  })
}

// setup router
export const setupRouter = async (app: App<Element>) => {
  router = await createVueRouter()

  vueRouterRegister(router)
  app.use(router)
  // 等待 router 挂载后，初始化 useRouter 方法
  useVueRouter()
}
