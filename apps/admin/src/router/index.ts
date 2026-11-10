import type { App, Component } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { getStaticAppRoutes, setAppRouteModules } from './app-route-modules'
import { loadRouteConfig, resetRouteSource } from './config/source'
import {
  getAccountProfileRoute,
  getLayoutRoutes,
  getRootRoutes,
  getSystemRoutes,
} from './routes'
import { scrollViewToTop, vueRouterRegister } from './utils'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [],
  scrollBehavior: (to) => {
    scrollViewToTop(to)
  },
})

let pending: Promise<void> | undefined
let controller: AbortController | undefined
let removeRoutes: (() => void)[] = []

export function clearAccountRoutes() {
  controller?.abort()
  pending = void 0

  for (const remove of removeRoutes.splice(0)) remove()

  setAppRouteModules([])
  resetRouteSource()
}

export function loadAccountRoutes() {
  if (pending) return pending

  const current = new AbortController()

  controller = current
  const load = (async () => {
    const config = await loadRouteConfig(current.signal)
    const routes = config
      ? (await import('./config/contract')).toRuntimeRoutes(config)
      : getStaticAppRoutes()

    current.signal.throwIfAborted()

    for (const remove of removeRoutes.splice(0)) remove()

    setAppRouteModules(routes)
    removeRoutes = getLayoutRoutes().map((route) =>
      router.addRoute('RLayout', route),
    )
  })().finally(() => {
    if (pending === load) pending = void 0
  })

  pending = load

  return load
}

let registered = false

export async function setupRouter(
  app: App<Element>,
  authenticated: boolean,
  login: Component,
) {
  if (!router.hasRoute('RLayout')) {
    for (const route of getRootRoutes(login)) router.addRoute(route)
  }

  if (authenticated) await loadAccountRoutes()
  else clearAccountRoutes()

  if (!registered) {
    for (const route of [...getSystemRoutes(), getAccountProfileRoute()])
      router.addRoute('RLayout', route)

    vueRouterRegister(router)
    registered = true
  }

  app.use(router)
}
