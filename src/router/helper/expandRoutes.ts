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
 * 该功能基于 <https://me.yka.moe/> 代码改进实现
 * 自动展开所有路由
 */

import { cloneDeep } from 'lodash-es'

import type { AppRouteRecordRaw } from '@/router/type'

const isRootPath = (path: string) => path.startsWith('/')

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
  // 如果没有小宝贝进来 则没有小宝贝出去
  if (!Array.isArray(arr)) {
    return []
  }

  // 新来的小宝贝们先洗好澡澡哦
  const sourceArr = arr

  // 来开始我们的循环之旅吧
  sourceArr.forEach((curr) => {
    // 获取可爱的小宝贝哦

    if (curr.children?.length) {
      // 如果小宝贝有小小宝贝

      // 小宝贝们有孩子了，/(ㄒoㄒ)/~~
      routePromotion(
        curr.children,
        result,
        path + (isRootPath(curr.path) ? curr.path : '/' + curr.path),
      )
    } else {
      // 小宝贝还是单身哦
      // 乖乖的小宝贝快快进入口袋
      curr.path = path + (isRootPath(curr.path) ? curr.path : '/' + curr.path)

      result.push(curr)
    }
  })

  // 返回都是根节点的小宝贝们
  return result
}

export const expandRoutes = (arr: AppRouteRecordRaw[]) => {
  if (!Array.isArray(arr)) {
    return []
  }

  return routePromotion(cloneDeep(arr))
}
