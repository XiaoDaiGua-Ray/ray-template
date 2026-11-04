import {
  DEFAULT_HOME_PATH,
  LAYOUT,
  ROUTE_MANAGEMENT_PATH,
} from '@/router/constant'
import { createRouteContract } from '@ray-template/routing/contract'
import { findRouteView, findRouteViewId } from './views'

export const { parseRouteConfig, toRuntimeRoutes, exportRouteConfig } =
  createRouteContract({
    layout: LAYOUT,
    homePath: DEFAULT_HOME_PATH,
    findRouteView,
    findRouteViewId,
    managementPath: ROUTE_MANAGEMENT_PATH,
    reservedNames: [
      'RLogin',
      'RLayout',
      'RNotFound',
      'RouteManagement',
      'RouteManagementVisual',
      'ErrorPage',
      'RayTemplateDoc',
    ],
  })
