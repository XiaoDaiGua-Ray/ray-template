import {
  combineRawRouteModules,
  expandRoutes,
  orderRoutes,
} from '@/router/utils'

/**
 *
 * @description
 * 收集并按 meta.order 排序路由模块。
 *
 * @returns 合并后的路由记录列表
 */
export const getAppRawRoutes = () => orderRoutes(combineRawRouteModules())

/**
 *
 * @description
 * 将模块路由展开为平铺记录。
 *
 * @returns 平铺后的路由记录列表
 */
export const appExpandRoutes = () => expandRoutes(getAppRawRoutes())
