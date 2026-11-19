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
  const {
    changeMenuModelValue,
    spliceMenTagOptions,
    setMenuTagOptions,
    isMenuTagFixed,
  } = useMenuActions()

  const canClose = (tag: MenuTagOptions) => !isMenuTagFixed(tag)
  const closeWhere = (matches: (index: number) => boolean) => {
    const current = getMenuTagOptions.value
    const remaining = current.filter(
      (tag, index) => !matches(index) || !canClose(tag),
    )

    if (remaining.length !== current.length) setMenuTagOptions(remaining, false)

    return remaining
  }

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

    return (
      !!normal && getMenuTagOptions.value.slice(normal.index + 1).some(canClose)
    )
  }

  /**
   *
   * @param target 标签对象、索引或路径
   *
   * @returns 目标左侧是否还有标签；目标无效时返回 false。
   */
  const checkCloseLeft = (target: CloseMenuTag) => {
    const normal = normalMenuTagOption(target, 'checkCloseLeft')

    return (
      !!normal && getMenuTagOptions.value.slice(0, normal.index).some(canClose)
    )
  }

  /**
   *
   * @param target 要关闭的标签对象、索引或路径
   *
   * @description
   * 固定的标签会保留；关闭最后一项进入空工作区，关闭激活项时切换到相邻标签。
   *
   * @returns 需要跳转时返回 Router 导航结果。
   */
  const close = (target: CloseMenuTag) => {
    const normal = normalMenuTagOption(target, 'close')

    if (normal && canClose(normal.option)) {
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
   * 关闭未固定的标签；优先保留当前页面，再尝试第一个固定标签或空工作区。
   *
   * @returns Router 导航结果。
   */
  const closeAll = () => {
    const current = getCurrentMenuOption.value?.fullPath
    const remaining = closeWhere(() => true)

    if (remaining.some((tag) => tag.fullPath === current)) return

    return router.replace(remaining[0]?.fullPath ?? WELCOME_ROUTE_PATH)
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
   * 关闭右侧未固定的标签；激活项被移除时切换到边界标签。
   */
  const closeRight = (target: CloseMenuTag) => {
    const normal = normalMenuTagOption(target, 'closeRight')

    if (normal) {
      const { option, index } = normal
      const currentIndex = getCurrentTagIndex()
      const current = getMenuTagOptions.value[currentIndex]

      closeWhere((tagIndex) => tagIndex > index)

      if (currentIndex > index && canClose(current))
        return changeMenuModelValue(option.fullPath, option)
    }
  }

  /**
   *
   * @param target 要保留的边界标签对象、索引或路径
   *
   * @description
   * 关闭左侧未固定的标签；激活项被移除时切换到边界标签。
   */
  const closeLeft = (target: CloseMenuTag) => {
    const normal = normalMenuTagOption(target, 'closeLeft')

    if (normal) {
      const { option, index } = normal
      const currentIndex = getCurrentTagIndex()
      const current = getMenuTagOptions.value[currentIndex]

      closeWhere((tagIndex) => tagIndex < index)

      if (currentIndex >= 0 && currentIndex < index && canClose(current))
        return changeMenuModelValue(option.fullPath, option)
    }
  }

  /**
   *
   * @param target 要保留的标签对象、索引或路径
   *
   * @description
   * 保留目标与所有固定标签，并激活目标。
   */
  const closeOther = (target: CloseMenuTag) => {
    const normal = normalMenuTagOption(target, 'closeOther')

    if (normal) {
      const { option, index } = normal

      closeWhere((tagIndex) => tagIndex !== index)

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
