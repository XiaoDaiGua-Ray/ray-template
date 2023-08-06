/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-07-04
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/**
 *
 * helper 包入口
 *
 * 该包一般是用于该模块一些处理的辅助方法
 * 通常不会用于其他地方
 * 如果有需要查看 router 模块的全局通用辅助方法可以查看 routerCopilot 包
 */

import { LAYOUT_CONTENT_REF } from '@/appConfig/routerConfig'

import type { RouteLocationNormalized } from 'vue-router'
import type { AppRouteRecordRaw, RouteModules } from '@/router/type'

/**
 *
 * @returns 所有路由模块
 *
 * @remark 自动合并所有路由模块, 每一个 ts 文件都视为一个 route module 与 views 一一对应
 *
 * 请注意, 如果更改了 modules 的目录位置或者该方法的位置, 需要同步更改 import.meta.glob 方法的路径
 * 该方法会以本文件为起始位置去查找对应 URL 目录的资源
 *
 * 会将 modules 中每一个 ts 文件当作一个路由模块, 即使你以分包的形式创建了路由模块
 */
export const combineRawRouteModules = () => {
  const modulesFiles: RouteModules = import.meta.glob(
    '@/router/modules/**/*.ts',
    {
      eager: true,
    },
  )

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

/**
 *
 * @param routes 路由模块表(route 表)
 * @returns 排序后的新路由表
 *
 * @remark 必须配置 meta 属性, order 属性会影响页面菜单排序
 *
 * 如果为配置 order 属性, 则会自动按照前合并路由的顺序前后排序
 * 如果 order 属性值相同, 则会按照路由名称进行排序
 */
export const orderRoutes = (routes: AppRouteRecordRaw[]) => {
  return routes.sort((curr, next) => {
    const currOrder = curr.meta?.order ?? 1
    const nextOrder = next.meta?.order ?? 0

    if (typeof currOrder !== 'number' || typeof nextOrder !== 'number') {
      throw new Error('orderRoutes error: order must be a number!')
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

/**
 *
 * 切换路由时, 手动将容器区域回归默认值
 *
 * 由于官方不支持这个方法了, 所以自己手写了一个
 * 如果需要忽略恢复默认位置, 仅需要在 meta 中配置 ignoreAutoResetScroll 属性即可
 */
export const scrollViewToTop = (route: RouteLocationNormalized) => {
  const { meta } = route

  /** LAYOUT_CONTENT_REF */
  if (!meta?.ignoreAutoResetScroll) {
    LAYOUT_CONTENT_REF.value?.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  }
}
