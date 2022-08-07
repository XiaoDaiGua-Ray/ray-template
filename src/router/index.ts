import type { App } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { constantRoutes } from './routes'

import type { Router } from 'vue-router'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

// setup router
export const setupRouter = (app: App<Element>) => {
  app.use(router)
}
