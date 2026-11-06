import {
  ACCOUNT_PROFILE_NAME,
  ACCOUNT_PROFILE_PATH,
  LAYOUT,
  ROUTE_MANAGEMENT_PATH,
  SYSTEM_ROUTE_NAMES,
  SYSTEM_ROUTE_PATHS,
} from '@/router/constant'
import { routeViewPermission } from '@ray-template/api-contracts/routes'
import { createRouteContract } from '@ray-template/routing/contract'
import { findRouteView, findRouteViewId } from './views'

export const { parseRouteConfig, toRuntimeRoutes, exportRouteConfig } =
  createRouteContract({
    layout: LAYOUT,
    findRouteView,
    findRouteViewId,
    viewPermission: routeViewPermission,
    managementPath: ROUTE_MANAGEMENT_PATH,
    reservedPaths: [...SYSTEM_ROUTE_PATHS, ACCOUNT_PROFILE_PATH],
    reservedNames: [
      ...SYSTEM_ROUTE_NAMES,
      ACCOUNT_PROFILE_NAME,
      'RLogin',
      'RLayout',
      'RNotFound',
      'RouteManagement',
      'RouteManagementVisual',
      'ErrorPage',
      'RayTemplateDoc',
    ],
  })
