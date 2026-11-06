import { initialRoutes } from '@ray-template/demo-data'
import { parseRouteConfig, toRuntimeRoutes } from './config/contract'
import { ROUTE_MANAGEMENT_PATH } from './constant'
import type { AppRouteRecordRaw } from './types'
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

export const getStaticAppRoutes = () =>
  orderRoutes(toRuntimeRoutes(parseRouteConfig(JSON.stringify(initialRoutes))))

let activeRoutes: AppRouteRecordRaw[] | undefined

export function setAppRouteModules(routes: AppRouteRecordRaw[]) {
  activeRoutes = orderRoutes(routes)
}

export const getAppRawRoutes = () => [
  ...(activeRoutes ?? getStaticAppRoutes()),
  managementRoute,
]

export const appExpandRoutes = () =>
  expandRoutes(getAppRawRoutes()).filter(({ meta }) => !meta.windowOpen)
