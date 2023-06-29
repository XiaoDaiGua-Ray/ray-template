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

import type { AppRouteRecordRaw, RouteModules } from '@/router/type'

/**
 *
 * @returns 所有路由模块
 *
 * @remark 自动合并所有路由模块, 每一个 ts 文件都视为一个 route module 与 views 一一对应
 */
export const combineRawRouteModules = () => {
  const modulesFiles: RouteModules = import.meta.glob('../modules/**/*.ts', {
    eager: true,
  })

  const modules = Object.keys(modulesFiles).reduce((modules, modulePath) => {
    const route = modulesFiles[modulePath].default

    if (route) {
      modules.push(route)
    } else {
      throw new Error(
        'router helper combine: an exception occurred while parsing the routing file!',
      )
    }

    return modules
  }, [] as AppRouteRecordRaw[])

  return modules
}
