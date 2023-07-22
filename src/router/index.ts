import { createRouter, createWebHashHistory } from 'vue-router'
import { scrollViewToTop } from '@/router/helper/helper'
import { vueRouterRegister } from '@/router/helper/routerCopilot'
import { useVueRouter } from '@/router/helper/useVueRouter'

import constantRoutes from './routes'

import type { App } from 'vue'
import type { RouteRecordRaw, Router } from 'vue-router'

export let router: Router

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
  useVueRouter()

  app.use(router)
}
