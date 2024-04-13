import type { AppRouteRecordRaw } from '@/router/types'

/**
 *
 * @param routes 路由模块表(route 表)
 * @returns 排序后的新路由表
 *
 * @description
 * 必须配置 meta 属性, order 属性会影响页面菜单排序
 *
 * 如果为配置 order 属性, 则会自动按照前合并路由的顺序前后排序
 * 如果 order 属性值相同, 则会按照路由名称进行排序
 */
export const orderRoutes = (routes: AppRouteRecordRaw[]) => {
  return routes.sort((curr, next) => {
    const currOrder = curr.meta?.order ?? 1
    const nextOrder = next.meta?.order ?? 0

    if (typeof currOrder !== 'number' || typeof nextOrder !== 'number') {
      throw new TypeError('orderRoutes error: order must be a number!')
    }

    if (currOrder === nextOrder) {
      // 如果两个路由的 order 值相同，则按照路由名进行排序
      return curr.name
        ? next.name
          ? curr.name.localeCompare(next.name)
          : -1
        : 1
    }

    return currOrder - nextOrder
  })
}
