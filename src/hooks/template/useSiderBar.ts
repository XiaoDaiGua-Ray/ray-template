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
import { redirectRouterToDashboard } from '@/router/helper/routerCopilot'

import type { MenuTagOptions, Key } from '@/types'

export type CloseMenuTag = Key | MenuTagOptions

/**
 *
 * @param target 标签页对象、索引、key
 * @param fc 触发函数
 *
 * 该方法用于统一获取目标标签页方法
 */
const normalMenuTagOption = (target: CloseMenuTag, fc: string) => {
  const { getMenuTagOptions } = useMenuGetters()

  if (typeof target === 'number') {
    // 判断是否为 NaN
    if (isNaN(target)) {
      console.warn(`${fc}: The ${target} is NaN, expect number.`)

      return
    }

    // 判断是否超出当前标签页列表最大长度或者是否为负数
    if (target > getMenuTagOptions.value.length || target < -1) {
      console.warn(
        `${fc}: The incoming index ${target} did not match the corresponding item.`,
      )

      return
    }

    return {
      option: getMenuTagOptions.value[target],
      index: target,
    }
  } else if (typeof target === 'string') {
    // 查找符合条件的 key
    const index = getMenuTagOptions.value.findIndex(
      (curr) => curr.key === target,
    )

    return index > -1
      ? {
          option: getMenuTagOptions.value[index],
          index,
        }
      : console.warn(
          `${fc}: The incoming key ${target} did not match the corresponding item.`,
        )
  } else {
    const { key } = target
    const index = getMenuTagOptions.value.findIndex((curr) => curr.key === key)

    if (index === -1) {
      console.warn(
        `${fc}: The incoming menuTag option ${target.key} did not match the corresponding item.`,
      )

      return
    }

    return {
      option: target,
      index,
    }
  }
}

export function useSiderBar() {
  const { getMenuTagOptions, getMenuKey } = useMenuGetters()
  const {
    changeMenuModelValue,
    spliceMenTagOptions,
    emptyMenuTagOptions,
    setMenuTagOptions,
  } = useMenuActions()

  /**
   *
   * @remark 获取当前激活标签页索引位置
   */
  const getCurrentTagIndex = () => {
    return getMenuTagOptions.value.findIndex(
      (curr) => curr.key === getMenuKey.value,
    )
  }

  /**
   *
   * @param target 当前关闭项
   *
   * 传递参数类型情况:
   * - number: 关闭当前项索引
   * - string: 关闭当前项 key，其实 key 也是一个具体的页面 url 地址
   * - AppMenuOption: 关闭当前项
   *
   * @remark 校验指定标签右侧是否有可关闭的标签
   */
  const checkCloseRight = (target: CloseMenuTag) => {
    const normal = normalMenuTagOption(target, 'checkCloseRight')

    if (normal) {
      const { index } = normal
      const length = getMenuTagOptions.value.length - 1

      return !(index >= length)
    }

    return false
  }

  /**
   *
   * @param target 当前关闭项
   *
   * 传递参数类型情况:
   * - number: 关闭当前项索引
   * - string: 关闭当前项 key，其实 key 也是一个具体的页面 url 地址
   * - AppMenuOption: 关闭当前项
   *
   * @remark 校验指定标签左侧是否有可关闭的标签
   */
  const checkCloseLeft = (target: CloseMenuTag) => {
    const normal = normalMenuTagOption(target, 'checkCloseRight')

    if (normal) {
      const { index } = normal
      const length = getMenuTagOptions.value.length - 1

      if (index === 0) {
        return false
      }

      if (index > 0 && length > 0) {
        return true
      }

      return false
    }

    return false
  }

  /**
   *
   * @param target 当前关闭项
   *
   * 传递参数类型情况:
   * - number: 关闭当前项索引
   * - string: 关闭当前项 key，其实 key 也是一个具体的页面 url 地址
   * - AppMenuOption: 关闭当前项
   */
  const close = (target: CloseMenuTag) => {
    const normal = normalMenuTagOption(target, 'close')

    if (normal) {
      const { index, option } = normal

      spliceMenTagOptions(index)

      if (option.key === getMenuKey.value) {
        const tag = getMenuTagOptions.value[index - 1]

        if (tag) {
          changeMenuModelValue(tag.key, tag)
        }
      }
    }
  }

  /**
   *
   * 关闭所有标签并且导航至 root path
   */
  const closeAll = () => {
    emptyMenuTagOptions()
    redirectRouterToDashboard()
  }

  /**
   *
   * @param target 目标标签页
   *
   * 关闭以当前项为索引的右侧标签
   * 如果当前选择标签与 menuKey 不匹配并且包含了当前激活标签页，则会关闭当前标签右侧所有变迁并且跳转至该页面
   *
   * 传递参数类型情况:
   * - number: 关闭当前项索引
   * - string: 关闭当前项 key，其实 key 也是一个具体的页面 url 地址
   * - AppMenuOption: 关闭当前项
   */
  const closeRight = (target: CloseMenuTag) => {
    const normal = normalMenuTagOption(target, 'closeRight')

    if (normal) {
      const { option, index } = normal
      const spliceLength = getMenuTagOptions.value.length - index // 待删除长度
      const currentIndex = getCurrentTagIndex()

      spliceMenTagOptions(index + 1, spliceLength)

      if (index <= currentIndex) {
        if (getMenuKey.value !== option.key) {
          changeMenuModelValue(option.key, option)
        }
      }
    }
  }

  /**
   *
   * @param target 目标标签页
   *
   * 关闭以当前项左侧所有标签
   * 如果当前选择标签与 menuKey 不匹配并且包含了当前激活标签页，则会关闭当前标签左侧所有变迁并且跳转至该页面
   *
   * 传递参数类型情况:
   * - number: 关闭当前项索引
   * - string: 关闭当前项 key，其实 key 也是一个具体的页面 url 地址
   * - AppMenuOption: 关闭当前项
   */
  const closeLeft = (target: CloseMenuTag) => {
    const normal = normalMenuTagOption(target, 'closeLeft')

    if (normal) {
      const { option, index } = normal
      const currentIndex = getCurrentTagIndex()

      spliceMenTagOptions(0, index)

      if (currentIndex <= index) {
        if (getMenuKey.value !== option.key) {
          changeMenuModelValue(option.key, option)
        }
      }
    }
  }

  /**
   *
   * @param target 目标标签页
   *
   * 会关闭除了当前索引的所有菜单项
   *
   * 传递参数类型情况:
   * - number: 关闭当前项索引
   * - string: 关闭当前项 key，其实 key 也是一个具体的页面 url 地址
   * - AppMenuOption: 关闭当前项
   */
  const closeOther = (target: CloseMenuTag) => {
    const normal = normalMenuTagOption(target, 'closeOther')

    if (normal) {
      const { option } = normal

      if (getMenuKey.value !== option.key) {
        emptyMenuTagOptions()
        changeMenuModelValue(option.key, option)
      } else {
        setMenuTagOptions(option, false)
      }
    }
  }

  return {
    close,
    closeAll,
    closeRight,
    closeLeft,
    closeOther,
    getCurrentTagIndex,
    checkCloseRight,
    checkCloseLeft,
  }
}

export type UseSiderBarReturnType = ReturnType<typeof useSiderBar>
