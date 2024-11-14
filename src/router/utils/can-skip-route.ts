import type { AppRouteRecordRaw } from '../types'
import type { AppMenuOption } from '@/types'

type LikeTemplateRouteOption = AppRouteRecordRaw | AppMenuOption

type SkipReturnType = LikeTemplateRouteOption | undefined

/**
 *
 * @param options 标准路由表或者系统菜单列表
 *
 * @description
 * 获取第一个可以跳转的路由，如果没有可以跳转的路由，返回 undefined。
 * 当你需要动态的获取可跳转路由的时候，可以使用该方法。
 *
 * @example
 * const canSkip1 = canSkipRoute(menuOptions)
 * const canSkip2 = canSkipRoute(routeOptions)
 */
export const canSkipRoute = (
  options: LikeTemplateRouteOption[],
): SkipReturnType => {
  if (!Array.isArray(options)) {
    return void 0
  }

  const skip = (skipOptions: LikeTemplateRouteOption[]): SkipReturnType => {
    for (const curr of skipOptions) {
      if (
        (!curr.children || curr.children.length === 0) &&
        !curr.meta.windowOpen
      ) {
        return curr
      } else {
        const found = skip(curr.children || [])

        if (found) {
          return found
        }
      }
    }
  }

  return skip(options)
}
