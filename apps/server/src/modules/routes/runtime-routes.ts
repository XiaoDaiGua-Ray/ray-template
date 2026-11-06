import type {
  RouteConfig,
  RouteConfigRecord,
} from '@ray-template/api-contracts/routes'

export function withoutDemoRoutes(config: RouteConfig): RouteConfig {
  const leaves = new Map<string, RouteConfigRecord>()
  const visit = (routes: RouteConfigRecord[], parent = '') => {
    for (const route of routes) {
      const path = route.path.startsWith('/')
        ? route.path
        : `${parent}/${route.path}`

      if (route.children) visit(route.children, path)
      else {
        leaves.set(path.toLowerCase(), route)

        for (const alias of [route.alias ?? []].flat())
          leaves.set(alias.toLowerCase(), route)
      }
    }
  }

  visit(config.routes)

  const isVisible = (route: RouteConfigRecord): boolean => {
    if (route.component?.startsWith('demo/')) return false

    if (!route.redirect) return true

    // 校验已排除循环；指向关闭页面的别名与重定向也不能留在运行菜单中。
    const target = leaves.get(route.redirect.toLowerCase())

    return !!target && isVisible(target)
  }
  const prune = (routes: RouteConfigRecord[]): RouteConfigRecord[] =>
    routes.flatMap((route) => {
      if (!isVisible(route)) return []

      if (!route.children) return [route]

      const children = prune(route.children)

      return children.length ? [{ ...route, children }] : []
    })

  return { ...config, routes: prune(config.routes) }
}
