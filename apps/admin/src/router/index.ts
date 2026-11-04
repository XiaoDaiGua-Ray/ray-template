import type { App } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { setAppRouteModules } from './app-route-modules'
import { loadRouteConfig } from './config/source'
import { constantRoutes, getLayoutRoutes } from './routes'
import { scrollViewToTop, vueRouterRegister } from './utils'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  scrollBehavior: (to) => {
    scrollViewToTop(to)
  },
})

let initialize: Promise<void> | undefined

export async function setupRouter(app: App<Element>) {
  initialize ??= (async () => {
    const config = await loadRouteConfig()

    if (config) {
      const { toRuntimeRoutes } = await import('./config/contract')

      setAppRouteModules(toRuntimeRoutes(config))
    }

    for (const route of getLayoutRoutes()) router.addRoute('RLayout', route)

    vueRouterRegister(router)
  })()
  await initialize
  app.use(router)
}
