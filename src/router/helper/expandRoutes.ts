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

/**
 *
 * 该功能基于 <https://me.yka.moe/> 提供代码改进实现
 *
 * 自动展开所有路由
 * 把所有路由提升为顶层路由
 */

import { cloneDeep } from 'lodash-es'

import type { AppRouteRecordRaw } from '@/router/type'

// 是否为根路由
const isRootPath = (path: string) => path[0] === '/'

/**
 *
 * @param arr route modules
 * @param result callback expand routes modules result
 * @param path route path
 * @returns callback expand routes modules result
 *
 * @remark 该方法会视 / 开头 path 为根路由
 */
const routePromotion = (
  arr: AppRouteRecordRaw[],
  result: AppRouteRecordRaw[] = [],
  path = '',
) => {
  if (!Array.isArray(arr)) {
    return []
  }

  for (const curr of arr) {
    const newPath = path + (isRootPath(curr.path) ? curr.path : '/' + curr.path)

    if (curr.children?.length) {
      routePromotion(curr.children, result, newPath)

      continue
    } else {
      result.push({
        ...curr,
        path: newPath,
      })
    }
  }

  return result
}

// 获取所有已展开的路由
export const expandRoutes = (arr: AppRouteRecordRaw[]) => {
  if (!Array.isArray(arr)) {
    return []
  }

  return routePromotion(cloneDeep(arr))
}
