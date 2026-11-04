import { NOT_FOUND_ROUTE_PATH } from '@/router/constant'
import { validRole } from '@/router/utils/valid-role'
import { useMenuActions, useMenuGetters } from '@/store'
import { pickRouteRecordNormalizedConstant } from '@/store/modules/menu/constant'
import type { AppMenuOption, Key, MenuTagOptions } from '@/types'
import { pick } from 'lodash-es'
import { useAppRoot } from './useAppRoot'
import { useVueRouter } from './useVueRouter'

export type CloseMenuTag = Key | MenuTagOptions

/**
 *
 * @param target 标签页对象、索引或路径
 * @param fn 用于日志的调用方方法名
 *
 * @returns 当前标签列表中的对象和索引，找不到时返回 undefined。
 */
const normalMenuTagOption = (target: CloseMenuTag, fn: string) => {
  const { getMenuTagOptions } = useMenuGetters()

  const tags = getMenuTagOptions.value
  const index =
    typeof target === 'number'
      ? target
      : tags.findIndex(
          (tag) =>
            tag.fullPath ===
            (typeof target === 'string' ? target : target.fullPath),
        )

  if (!Number.isInteger(index) || index < 0 || index >= tags.length) {
    console.warn(`[${fn}]: Could not find menu tag.`)

    return
  }

  return { option: tags[index], index }
}

export function useSiderBar() {
  const { getMenuTagOptions, getMenuKey } = useMenuGetters()
  const {
    changeMenuModelValue,
    spliceMenTagOptions,
    setMenuTagOptions,
    resolveOption,
  } = useMenuActions()

  // 获取当前激活标签页索引位置
  const getCurrentTagIndex = () => {
    return getMenuTagOptions.value.findIndex(
      (curr) => curr.fullPath === getMenuKey.value,
    )
  }

  // 校验指定标签右侧是否有可关闭的标签
  const checkCloseRight = (target: CloseMenuTag) => {
    const normal = normalMenuTagOption(target, 'checkCloseRight')

    if (normal) {
      const { index } = normal
      const length = getMenuTagOptions.value.length - 1

      return !(index >= length)
    }

    return false
  }

  // 校验指定标签左侧是否有可关闭的标签
  const checkCloseLeft = (target: CloseMenuTag) => {
    const normal = normalMenuTagOption(target, 'checkCloseLeft')

    return !!normal && normal.index > 0
  }

  // 关闭当前标签
  const close = (target: CloseMenuTag) => {
    const normal = normalMenuTagOption(target, 'close')

    if (getMenuTagOptions.value.length === 1) {
      return
    }

    if (normal) {
      const { index, option } = normal

      spliceMenTagOptions(index)

      if (option.fullPath === getMenuKey.value) {
        const tag = getMenuTagOptions.value[Math.max(0, index - 1)]

        tag && changeMenuModelValue(tag.fullPath, tag)
      }
    }
  }

  // 关闭所有标签并且导航至 root path
  const closeAll = () => {
    const { getRootPath } = useAppRoot()
    const { router } = useVueRouter()
    const home = router.resolve(getRootPath.value)
    const record = home.matched.at(-1)

    if (
      !record ||
      record.path === NOT_FOUND_ROUTE_PATH ||
      record.redirect ||
      !validRole(home.meta)
    )
      return

    const option = resolveOption({
      ...(pick(
        record,
        pickRouteRecordNormalizedConstant,
      ) as unknown as AppMenuOption),
      fullPath: home.path,
    })

    setMenuTagOptions(option, false)

    return changeMenuModelValue(home.path, option, home.query)
  }

  // 目标标签页右侧所有标签页
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

  // 关闭目标标签页左侧所有标签页
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

  // 关闭除了当前索引的所有菜单项
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
