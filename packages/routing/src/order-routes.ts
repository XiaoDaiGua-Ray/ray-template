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
export const orderRoutes = <
  T extends { name?: string; meta?: { order?: number } },
>(
  routes: T[],
) => {
  return routes.toSorted((curr, next) => {
    const order = (curr.meta?.order ?? 0) - (next.meta?.order ?? 0)

    return order || (curr.name ?? '').localeCompare(next.name ?? '', 'en')
  })
}
