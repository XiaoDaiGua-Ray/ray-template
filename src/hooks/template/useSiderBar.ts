import { useMenuGetters, useMenuActions } from '@/store'
import { useVueRouter, useAppRoot } from '@/hooks'
import { pick } from 'lodash-es'
import { pickRouteRecordNormalizedConstant } from '@/store/modules/menu/constant'

import type { MenuTagOptions, Key, AppMenuOption } from '@/types'

export type CloseMenuTag = Key | MenuTagOptions

/**
 *
 * @param target 标签页对象、索引、key
 * @param fn 触发函数
 *
 * 该方法用于统一获取目标标签页方法
 */
const normalMenuTagOption = (target: CloseMenuTag, fn: string) => {
  const { getMenuTagOptions } = useMenuGetters()

  if (typeof target === 'number') {
    // 判断是否为 NaN
    if (isNaN(target)) {
      console.warn(`${fn}: The ${target} is NaN, expect number.`)

      return
    }

    // 判断是否超出当前标签页列表最大长度或者是否为负数
    if (target > getMenuTagOptions.value.length || target < -1) {
      console.warn(
        `${fn}: The incoming index ${target} did not match the corresponding item.`,
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
      (curr) => curr.fullPath === target,
    )

    return index > -1
      ? {
          option: getMenuTagOptions.value[index],
          index,
        }
      : console.warn(
          `${fn}: The incoming key ${target} did not match the corresponding item.`,
        )
  } else {
    const { fullPath } = target
    const index = getMenuTagOptions.value.findIndex(
      (curr) => curr.fullPath === fullPath,
    )

    if (index === -1) {
      console.warn(
        `${fn}: The incoming menuTag option ${target.fullPath} did not match the corresponding item.`,
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
    setMenuTagOptions,
    resolveOption,
  } = useMenuActions()

  /**
   *
   * @remark 获取当前激活标签页索引位置
   */
  const getCurrentTagIndex = () => {
    return getMenuTagOptions.value.findIndex(
      (curr) => curr.fullPath === getMenuKey.value,
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

    if (getMenuTagOptions.value.length === 1) {
      return
    }

    if (normal) {
      const { index, option } = normal

      spliceMenTagOptions(index)

      if (option.fullPath === getMenuKey.value) {
        let i = checkCloseLeft(index)
          ? index - 1
          : checkCloseRight(index)
            ? index
            : index - 1

        if (i < 0) {
          i = 0
        }

        const tag = getMenuTagOptions.value[i]

        tag && changeMenuModelValue(tag.fullPath, tag)
      }
    }
  }

  /**
   *
   * 关闭所有标签并且导航至 root path
   */
  const closeAll = () => {
    spliceMenTagOptions(0, getMenuTagOptions.value.length)

    const { getRootPath } = useAppRoot()
    const {
      router: { getRoutes },
    } = useVueRouter()

    const findMenuOption = getRoutes().find(
      (curr) => curr.path === getRootPath.value,
    )

    if (findMenuOption) {
      const pickOption = pick(findMenuOption, pickRouteRecordNormalizedConstant)
      const res = resolveOption(pickOption as unknown as AppMenuOption)

      changeMenuModelValue(
        res.path,
        resolveOption({
          ...res,
          fullPath: res.path,
        }),
      )
    }
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
        if (getMenuKey.value !== option.fullPath) {
          changeMenuModelValue(option.fullPath, option)
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
        if (getMenuKey.value !== option.fullPath) {
          changeMenuModelValue(option.fullPath, option)
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

      if (getMenuKey.value !== option.fullPath) {
        spliceMenTagOptions(0, getMenuTagOptions.value.length)
        changeMenuModelValue(option.fullPath, option)
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
