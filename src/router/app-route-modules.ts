/**
 *
 * 描述:
 *   - 自动导入所有路由模块
 *   - 平铺所有路由
 *
 * modules 模块下每一个 ts 文件视为一个路由模块(route)
 * 每个模块必须配置 meta 属性
 * 如果不设置 order 属性, 则会默认排在前面
 */

import { combineRawRouteModules } from '@/router/utils'
import { orderRoutes, expandRoutes } from '@/router/utils'

/** 获取所有被合并与排序的路由 */
export const getAppRawRoutes = () => orderRoutes(combineRawRouteModules())

/** 获取所有平铺展开的路由 */
export const appExpandRoutes = () => expandRoutes(getAppRawRoutes())
