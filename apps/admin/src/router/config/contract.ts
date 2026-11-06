import {
  LAYOUT,
  ROUTE_MANAGEMENT_PATH,
  SYSTEM_ROUTE_NAMES,
  SYSTEM_ROUTE_PATHS,
} from '@/router/constant'
import { createRouteContract } from '@ray-template/routing/contract'
import { findRouteView, findRouteViewId } from './views'

export const { parseRouteConfig, toRuntimeRoutes, exportRouteConfig } =
  createRouteContract({
    layout: LAYOUT,
    findRouteView,
    findRouteViewId,
    managementPath: ROUTE_MANAGEMENT_PATH,
    reservedPaths: SYSTEM_ROUTE_PATHS,
    reservedNames: [
      ...SYSTEM_ROUTE_NAMES,
      'RLogin',
      'RLayout',
      'RNotFound',
      'RouteManagement',
      'RouteManagementVisual',
      'ErrorPage',
      'RayTemplateDoc',
    ],
  })
