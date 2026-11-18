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
import type { AppRouteRecordRaw } from '../types'
import { joinRoutePath } from '../utils/join-route-path'
import type { RouteConfig } from './schema'
import { findRouteView, findRouteViewId } from './views'

const contract = createRouteContract({
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

export const { parseRouteConfig, exportRouteConfig } = contract

// 旧 Mock、本地配置和已初始化的服务端可能仍保存内置菜单原文。只识别原路径和原文的组合。
const formerTitles = new Map<string, [string, string]>([
  [
    '/router-demo/router-demo-home',
    ['人员信息(平级模式)', 'menu.RouterPeople'],
  ],
  ['/router-demo/router-demo-detail', ['信息详情', 'menu.RouterPersonDetail']],
  ['/multi/multi-menu-one', ['多级菜单-1', 'menu.NestedOne']],
  ['/multi/multi-menu-two', ['多级菜单-2', 'menu.NestedTwo']],
  [
    '/multi/multi-menu-two/sub-menu-other',
    ['多级菜单-2-1', 'menu.NestedTwoOne'],
  ],
  ['/multi/multi-menu-two/sub-menu', ['多级菜单-2-2', 'menu.NestedTwoTwo']],
  [
    '/multi/multi-menu-two/sub-menu/sub-menu-one',
    ['多级菜单-2-2-1', 'menu.NestedTwoTwoOne'],
  ],
])

export function toRuntimeRoutes(config: RouteConfig) {
  const routes = contract.toRuntimeRoutes(config)
  const localize = (records: AppRouteRecordRaw[], parent: string) => {
    for (const record of records) {
      const path = joinRoutePath(parent, record.path)
      const former = formerTitles.get(path)

      if (
        former &&
        !record.meta.i18nKey &&
        record.meta.noLocalTitle === former[0]
      )
        record.meta.i18nKey = former[1]

      if (record.children) localize(record.children, path)
    }
  }

  localize(routes, '')

  return routes
}
