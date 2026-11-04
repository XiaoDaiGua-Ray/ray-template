import { DEFAULT_HOME_PATH, ROUTE_MANAGEMENT_PATH } from './constant'
import type { AppRouteRecordRaw } from './types'
import { combineRawRouteModules } from './utils/combine-raw-route-modules'
import { expandRoutes } from './utils/expand-routes'
import { orderRoutes } from './utils/order-routes'

const managementRoute: AppRouteRecordRaw = {
  path: ROUTE_MANAGEMENT_PATH,
  meta: {
    i18nKey: 'menu.RouteManagement',
    icon: 'action/setting',
    role: ['admin'],
    order: 100,
  },
  children: [
    {
      path: 'visual',
      name: 'RouteManagementVisual',
      component: () => import('@/views/route-management/visual'),
      meta: { i18nKey: 'menu.RouteManagementVisual' },
    },
    {
      path: 'json',
      name: 'RouteManagement',
      component: () => import('@/views/route-management'),
      meta: { i18nKey: 'menu.RouteManagementJson' },
    },
  ],
}

export const getStaticAppRoutes = () => orderRoutes(combineRawRouteModules())

let activeRoutes: AppRouteRecordRaw[] | undefined

export function setAppRouteModules(routes: AppRouteRecordRaw[]) {
  const fallback = getStaticAppRoutes().find(
    ({ path }) => path === DEFAULT_HOME_PATH,
  )
  const hasHome = expandRoutes(routes).some(
    ({ path }) => path === DEFAULT_HOME_PATH,
  )

  activeRoutes = orderRoutes(
    hasHome || !fallback ? routes : [...routes, fallback],
  )
}

export const getAppRawRoutes = () => [
  ...(activeRoutes ?? getStaticAppRoutes()),
  managementRoute,
]

export const appExpandRoutes = () =>
  expandRoutes(getAppRawRoutes()).filter(({ meta }) => !meta.windowOpen)
