import { FORBIDDEN_ROUTE_PATH, WELCOME_ROUTE_PATH } from '@/router/constant'
import { resolveLandingPath } from '@/router/utils/resolve-landing-path'
import { useMenuActions, useMenuGetters } from '@/store'
import type { Key, MenuTagOptions } from '@/types'
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

/**
 *
 * @returns 标签页检查与关闭方法；状态由共享菜单 Store 持有。
 */
export function useSiderBar() {
  const { getMenuTagOptions, getCurrentMenuOption } = useMenuGetters()
  const { router } = useVueRouter()
  const { changeMenuModelValue, spliceMenTagOptions, setMenuTagOptions } =
    useMenuActions()

  /**
   *
   * @returns 当前激活标签的索引；未找到时为 -1。
   */
  const getCurrentTagIndex = () => {
    return getMenuTagOptions.value.findIndex(
      (curr) => curr.fullPath === getCurrentMenuOption.value?.fullPath,
    )
  }

  /**
   *
   * @param target 标签对象、索引或路径
   *
   * @returns 目标右侧是否还有标签；目标无效时返回 false。
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
   * @param target 标签对象、索引或路径
   *
   * @returns 目标左侧是否还有标签；目标无效时返回 false。
   */
  const checkCloseLeft = (target: CloseMenuTag) => {
    const normal = normalMenuTagOption(target, 'checkCloseLeft')

    return !!normal && normal.index > 0
  }

  /**
   *
   * @param target 要关闭的标签对象、索引或路径
   *
   * @description
   * 所有业务标签都可关闭；关闭最后一项进入空工作区，其余激活项切换到相邻标签。
   *
   * @returns 需要跳转时返回 Router 导航结果。
   */
  const close = (target: CloseMenuTag) => {
    const normal = normalMenuTagOption(target, 'close')

    if (normal) {
      const { index, option } = normal
      const active = option.fullPath === getCurrentMenuOption.value?.fullPath

      spliceMenTagOptions(index)

      if (!getMenuTagOptions.value.length)
        return router.replace(WELCOME_ROUTE_PATH)

      if (active) {
        const tag = getMenuTagOptions.value[Math.max(0, index - 1)]

        return tag && changeMenuModelValue(tag.fullPath, tag)
      }
    }
  }

  /**
   *
   * @description
   * 清空所有业务标签及其缓存，然后进入空工作区；不依赖任何业务首页。
   *
   * @returns Router 导航结果。
   */
  const closeAll = () => {
    setMenuTagOptions([], false)

    return router.replace(WELCOME_ROUTE_PATH)
  }

  const closeForbiddenPage = () => {
    if (router.currentRoute.value.path !== FORBIDDEN_ROUTE_PATH) return

    const previous = resolveLandingPath(
      router,
      router.options.history.state.back,
    )
    const target =
      previous === WELCOME_ROUTE_PATH
        ? resolveLandingPath(router, getMenuTagOptions.value.at(-1)?.fullPath)
        : previous

    return router.replace(target)
  }

  /**
   *
   * @param target 要保留的边界标签对象、索引或路径
   *
   * @description
   * 关闭右侧标签；激活项被移除时切换到边界标签。
   */
  const closeRight = (target: CloseMenuTag) => {
    const normal = normalMenuTagOption(target, 'closeRight')

    if (normal) {
      const { option, index } = normal
      const spliceLength = getMenuTagOptions.value.length - index // 待删除长度
      const currentIndex = getCurrentTagIndex()

      spliceMenTagOptions(index + 1, spliceLength)

      if (currentIndex > index)
        return changeMenuModelValue(option.fullPath, option)
    }
  }

  /**
   *
   * @param target 要保留的边界标签对象、索引或路径
   *
   * @description
   * 关闭左侧标签；激活项被移除时切换到边界标签。
   */
  const closeLeft = (target: CloseMenuTag) => {
    const normal = normalMenuTagOption(target, 'closeLeft')

    if (normal) {
      const { option, index } = normal
      const currentIndex = getCurrentTagIndex()

      spliceMenTagOptions(0, index)

      if (currentIndex >= 0 && currentIndex < index)
        return changeMenuModelValue(option.fullPath, option)
    }
  }

  /**
   *
   * @param target 要保留的标签对象、索引或路径
   *
   * @description
   * 仅保留并激活目标标签；目标无效时不操作。
   */
  const closeOther = (target: CloseMenuTag) => {
    const normal = normalMenuTagOption(target, 'closeOther')

    if (normal) {
      const { option } = normal

      setMenuTagOptions(option, false)

      if (getCurrentMenuOption.value?.fullPath !== option.fullPath)
        return changeMenuModelValue(option.fullPath, option)
    }
  }

  return {
    close,
    closeAll,
    closeForbiddenPage,
    closeRight,
    closeLeft,
    closeOther,
    getCurrentTagIndex,
    checkCloseRight,
    checkCloseLeft,
  }
}

export type UseSiderBarReturnType = ReturnType<typeof useSiderBar>
