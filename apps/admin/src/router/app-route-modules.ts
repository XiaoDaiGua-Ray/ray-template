import { initialRoutes } from '@ray-template/demo-data'
import { computed, shallowRef } from 'vue'
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
    requiredPermission: 'routes:write',
    order: 100,
  },
  children: [
    {
      path: 'visual',
      name: 'RouteManagementVisual',
      component: () => import('@/views/route-management/visual'),
      meta: {
        i18nKey: 'menu.RouteManagementVisual',
        requiredPermission: 'routes:write',
      },
    },
    {
      path: 'json',
      name: 'RouteManagement',
      component: () => import('@/views/route-management'),
      meta: {
        i18nKey: 'menu.RouteManagementJson',
        requiredPermission: 'routes:write',
      },
    },
  ],
}

export const getStaticAppRoutes = () =>
  orderRoutes(toRuntimeRoutes(parseRouteConfig(JSON.stringify(initialRoutes))))

const activeRoutes = shallowRef<AppRouteRecordRaw[]>()

export function setAppRouteModules(routes: AppRouteRecordRaw[]) {
  activeRoutes.value = orderRoutes(routes)
}

const rawRoutes = computed(() => [
  ...(activeRoutes.value ?? getStaticAppRoutes()),
  managementRoute,
])

export const getAppRawRoutes = () => rawRoutes.value

export const appExpandRoutes = () =>
  expandRoutes(getAppRawRoutes()).filter(({ meta }) => !meta.windowOpen)
