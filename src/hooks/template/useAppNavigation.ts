import { NOT_FOUND_ROUTE_PATH } from '@/router/constant'
import { useMenuGetters } from '@/store'
import type { AppMenuOption } from '@/types'
import type { LocationQuery, RouteLocationRaw } from 'vue-router'
import { useVueRouter } from './useVueRouter'

export type Target = number | AppMenuOption | string

export interface NavigationToOptions {
  /** 默认 push；设为 false 时替换当前历史项。 */
  isPush?: boolean
  /** 随导航传递的查询参数。 */
  query?: LocationQuery
}

/**
 *
 * @returns 模板菜单导航方法；按索引导航需要先加载菜单。
 */
export function useAppNavigation() {
  /**
   *
   * @param target 从 0 开始的菜单索引、菜单项或已注册路由路径
   * @param option 导航模式与查询参数
   *
   * @description
   * 索引指向父菜单时，沿首个子项查找叶节点。
   *
   * @returns 导航 Promise；目标无效时记录警告并返回 undefined。
   */
  const navigationTo = (target: Target, option?: NavigationToOptions) => {
    const { router } = useVueRouter()
    const { isPush = true, query } = option ?? {}
    const navigate = (location: RouteLocationRaw) =>
      isPush ? router.push(location) : router.replace(location)

    if (typeof target === 'number') {
      // 校验是否为 NaN
      if (!Number.isInteger(target) || target < 0) {
        console.warn(`[navigationTo]: The ${target} is NaN, expect number.`)

        return
      }

      const { getMenuOptions } = useMenuGetters()

      // 校验是否超出最大菜单长度
      if (target >= getMenuOptions.value.length) {
        console.warn(
          `[navigationTo]: The current ${target} exceeds the maximum number of menus.`,
        )

        return
      }

      const menu = getMenuOptions.value[target]

      // 递归获取第一级子菜单
      const deepNavigation = (routes: AppMenuOption) => {
        if (routes.children && routes.children.length > 0) {
          const {
            children: [firstChild],
          } = routes

          return deepNavigation(firstChild)
        }

        return navigate({ path: routes.fullPath, query })
      }

      return deepNavigation(menu)
    }

    if (typeof target !== 'string')
      return navigate({ path: target.fullPath, query })

    const resolved = router.resolve(target)

    if (
      !resolved.matched.length ||
      resolved.matched.at(-1)?.path === NOT_FOUND_ROUTE_PATH
    ) {
      console.warn(`[navigationTo]: The path "${target}" is not found.`)

      return
    }

    return navigate({
      path: resolved.path,
      hash: resolved.hash,
      query: { ...resolved.query, ...query },
    })
  }

  return {
    navigationTo,
  }
}

export type UseAppNavigationReturnType = ReturnType<typeof useAppNavigation>
