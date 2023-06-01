/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-06-01
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import type { AppRouteRecordRaw } from '@/router/type'

/**
 *
 * @param routes 路由模块表(route 表)
 * @returns 排序后的新路由表
 *
 * @remark 必须配置 meta 属性, order 属性会影响页面菜单排序
 */
export const orderRoutes = (routes: AppRouteRecordRaw[]) => {
  return routes.sort((curr, next) => {
    try {
      const {
        meta: { order: currOrder = 1 },
      } = curr
      const {
        meta: { order: nextOrder = 0 },
      } = next

      return currOrder - nextOrder
    } catch (e) {
      throw new Error('orderRoutes error: order must be number!')
    }
  })
}
