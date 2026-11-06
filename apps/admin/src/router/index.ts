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
  })().catch((error: unknown) => {
    // 同页重挂载可以重试暂时失败的配置加载；成功初始化仍只注册一次守卫。
    initialize = void 0
    throw error
  })
  await initialize
  app.use(router)
}
