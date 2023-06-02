import { createRouter, createWebHashHistory } from 'vue-router'
import scrollViewToTop from '@/router/utils/viewScrollTop'
import { vueRouterRegister } from '@/router/helper/routerCopilot'
import { useVueRouter } from '@/router/helper/useVueRouter'

import constantRoutes from './routes'

import type { App } from 'vue'
import type { RouteRecordRaw, Router } from 'vue-router'

export let router: Router

const createVueRouter = () => {
  return createRouter({
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
}

// setup router
export const setupRouter = (app: App<Element>) => {
  router = createVueRouter()

  vueRouterRegister(router)
  useVueRouter()

  app.use(router)
}
