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

import { useMenuGetters, useMenuActions } from '@/store'

import type { AppMenuOption } from '@/types'

export type Target = number | AppMenuOption

/**
 *
 * 导航函数
 * 但是该方法仅限于在登入后调用
 */
export function useAppNavigation() {
  const { changeMenuModelValue } = useMenuActions()

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
   */
  const navigationTo = (target: Target) => {
    if (typeof target === 'number') {
      // 校验是否为 NaN
      if (isNaN(target)) {
        console.warn(`navigationTo: The ${target} is NaN, expect number.`)

        return
      }

      const { getMenuOptions } = useMenuGetters()

      // 校验是否超出最大菜单长度
      if (target > getMenuOptions.value.length) {
        console.warn(
          `navigationTo: The current ${target} exceeds the maximum number of menus.`,
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

        changeMenuModelValue(routes.key, routes)
      }

      deepNavigation(option)
    } else {
      changeMenuModelValue(target.key, target)
    }
  }

  return {
    navigationTo,
  }
}

export type UseAppNavigationReturnType = ReturnType<typeof useAppNavigation>
