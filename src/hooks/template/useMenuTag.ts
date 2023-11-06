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
import { ROOT_ROUTE } from '@/app-config/appConfig'
import { redirectRouterToDashboard } from '@/router/helper/routerCopilot'

import type { MenuTagOptions, Key } from '@/types/modules/app'

export type CloseMenuTag = Key | MenuTagOptions

export function useMenuTag() {
  const { getMenuTagOptions, getMenuKey } = useMenuGetters()
  const {
    changeMenuModelValue,
    spliceMenTagOptions,
    emptyMenuTagOptions,
    setMenuTagOptions,
  } = useMenuActions()
  const { path } = ROOT_ROUTE

  /**
   *
   * 如果为非 root path，直接导航至上一 menuTag
   */
  const navigationPreTagOption = () => {
    const options = getMenuTagOptions.value
    const length = options.length
    const preOption = options[length - 1]

    if (getMenuKey.value !== path) {
      changeMenuModelValue(preOption.key as string, preOption)
    }
  }

  /**
   *
   * @param target 当前关闭项
   *
   * 传递参数类型情况:
   * - number: 关闭当前项索引
   * - string: 关闭当前项 key
   * - AppMenuOption: 关闭当前项
   */
  const close = (target: CloseMenuTag) => {
    if (typeof target === 'number') {
      if (isNaN(target)) {
        console.warn(`close: The ${target} is NaN, expect number.`)

        return
      }

      if (target > getMenuTagOptions.value.length) {
        console.warn(
          `close: The ${target} is greater than menuTagOptions length.`,
        )

        return
      }

      spliceMenTagOptions(target)
      navigationPreTagOption()
    } else if (typeof target === 'string') {
      const findOptionIndex = getMenuTagOptions.value.findIndex(
        (curr) => curr.key === target,
      )

      if (findOptionIndex !== -1) {
        spliceMenTagOptions(findOptionIndex)
        navigationPreTagOption()
      } else {
        console.warn(
          `close: The ${target} is not found in current menuTagOptions.`,
        )

        return
      }
    } else {
      changeMenuModelValue(target.key as string, target)
    }
  }

  /**
   *
   * 关闭所有标签并且导航至 root path
   */
  const closeAll = () => {
    emptyMenuTagOptions()
    redirectRouterToDashboard(true)
  }

  /**
   *
   * @param currentIndex 开始关闭索引
   *
   * 关闭以当前项为索引的右侧标签
   * 如果当前选择标签与 menuKey 不匹配，则会关闭当前标签右侧所有变迁并且跳转至该页面
   */
  const closeRight = (currentIndex: number) => {
    const spliceLength = getMenuTagOptions.value.length - currentIndex
    const routeOption = getMenuTagOptions.value[currentIndex]

    if (spliceLength > -1 && routeOption) {
      spliceMenTagOptions(currentIndex + 1, spliceLength)

      if (getMenuKey.value !== routeOption.key) {
        changeMenuModelValue(routeOption.key as string, routeOption)
      }
    } else {
      console.warn(
        `closeRight: The ${currentIndex} is not found in current menuTagOptions.`,
      )
    }
  }

  /**
   *
   * @param currentIndex 当前选择项的索引
   *
   * 关闭以当前项左侧所有标签
   * 如果当前选择标签与 menuKey 不匹配，则会关闭当前标签左侧所有变迁并且跳转至该页面
   */
  const closeLeft = (currentIndex: number) => {
    spliceMenTagOptions(0, currentIndex)
  }

  /**
   *
   * @param currentIndex 当前项索引
   *
   * 会关闭除了当前索引的所有菜单项
   */
  const closeOther = (currentIndex: number) => {
    const routeOption = getMenuTagOptions.value[currentIndex]

    if (routeOption) {
      if (getMenuKey.value !== routeOption.key) {
        emptyMenuTagOptions()
        changeMenuModelValue(routeOption.key, routeOption)
      } else {
        setMenuTagOptions(routeOption, false)
      }
    } else {
      console.warn(
        `closeOther: The ${currentIndex} is not found in current menuTagOptions.`,
      )
    }
  }

  return {
    close,
    closeAll,
    closeRight,
    closeLeft,
    closeOther,
  }
}
