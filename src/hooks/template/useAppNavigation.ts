/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-11-03
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import { useMenuGetters } from '@/store'
import { useVueRouter } from '@/hooks'

import type { AppMenuOption } from '@/types'
import type { LocationQuery } from 'vue-router'

export type Target = number | AppMenuOption | string

export interface NavigationToOptions {
  /**
   *
   * 是否为 push 模式
   * 如果设置为 true， 则会使用 vue-router 的 push 方法进行导航，否则使用 replace 方法进行导航
   *
   * @default true
   */
  isPush?: boolean
  /**
   *
   * 跳转参数
   *
   * @default undefined
   */
  query?: LocationQuery
}

/**
 *
 * 导航函数
 * 但是该方法仅限于在登入后调用
 */
export function useAppNavigation() {
  /**
   *
   * @param target 需要导航的目标地址
   *
   * 当传递参数为 number:
   * - 当传入参数值超过最大菜单长度，也会跳转失败并且抛出警告
   * - 如果传递参数需要导航的菜单项为非根菜单项，会自动的递归导航至第一个子菜单项
   *
   * 当传递参数为 AppMenuOption 类型，会直接导航至目标页面。该方法可以不区分菜单层级
   *
   * @example
   * navigationTo(1) // 导航至第二个菜单项，如果为根菜单项，会自动的递归导航至第一个子菜单项
   * navigationTo({ AppMenuOption }) // 导航至目标菜单项
   * navigationTo('path') // 导航至目标路由
   */
  const navigationTo = (target: Target, option?: NavigationToOptions) => {
    const {
      router: { getRoutes, push, replace },
    } = useVueRouter()
    const { isPush = true, query } = option || {}

    const isPushNavigation = (path: string) =>
      isPush
        ? push({
            path,
            query,
          })
        : replace({
            path,
            query,
          })

    if (typeof target === 'number') {
      // 校验是否为 NaN
      if (isNaN(target)) {
        console.warn(`[navigationTo]: The ${target} is NaN, expect number.`)

        return
      }

      const { getMenuOptions } = useMenuGetters()

      // 校验是否超出最大菜单长度
      if (target > getMenuOptions.value.length) {
        console.warn(
          `[navigationTo]: The current ${target} exceeds the maximum number of menus.`,
        )

        return
      }

      const option = getMenuOptions.value[target]

      // 递归获取第一级子菜单
      const deepNavigation = (routes: AppMenuOption) => {
        if (routes.children && routes.children.length > 0) {
          const {
            children: [firstChild],
          } = routes

          deepNavigation(firstChild)

          return
        }

        isPushNavigation(routes.fullPath)
      }

      deepNavigation(option)
    } else if (typeof target === 'string') {
      const fd = getRoutes().find((curr) => curr.path === target)

      if (fd) {
        isPushNavigation(fd.path)
      } else {
        console.warn(`[navigationTo]: The path "${target}" is not found.`)
      }
    } else {
      isPushNavigation(target.fullPath)
    }
  }

  return {
    navigationTo,
  }
}

export type UseAppNavigationReturnType = ReturnType<typeof useAppNavigation>
