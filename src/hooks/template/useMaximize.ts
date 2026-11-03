import { LAYOUT_CONTENT_REF } from '@/app-config'
import { useRuntimeActions, useRuntimeGetters } from '@/store'
import type { UseElementFullscreenOptions } from '../web'

export interface ScrollToOptions {
  left?: number
  top?: number
  behavior?: 'auto' | 'smooth' | 'instant'
}

export interface MaximizeOptions extends UseElementFullscreenOptions {
  scrollToOptions?: ScrollToOptions
}

/**
 *
 * @param defaults 每次切换的默认回调与样式
 *
 * @description
 * 操作当前 Pinia 实例的布局最大化状态；连续切换仅执行最新的完成回调。
 *
 * @returns 只读状态和布局切换方法。
 */
export const useMaximize = (defaults?: MaximizeOptions) => {
  const { layoutContentMaximize, layoutContentMaximizeVersion } =
    useRuntimeGetters()
  const { setRuntimeState } = useRuntimeActions()

  // 最大化由布局 class 驱动；不同页面、标签菜单与退出按钮共享同一状态。
  const maximize = (full: boolean, options?: MaximizeOptions) => {
    if (layoutContentMaximize.value === full) return

    const config = { ...defaults, ...options }

    if (full) {
      config.beforeEnter?.()
      setRuntimeState('layoutContentMaximizeStyle', {
        zIndex: config.zIndex ?? 999,
        backgroundColor: config.backgroundColor,
        transition: config.transition,
      })
    } else {
      config.beforeExit?.()
    }

    setRuntimeState('layoutContentMaximize', full)
    const version = layoutContentMaximizeVersion.value

    nextTick(() => {
      if (layoutContentMaximizeVersion.value !== version) return

      if (full && config.scrollToOptions) {
        LAYOUT_CONTENT_REF.value?.scrollTo(config.scrollToOptions)
      }

      if (full) config.enter?.()
      else config.exit?.()
    })
  }

  return {
    isLayoutContentMaximized: layoutContentMaximize,
    isFullscreen: layoutContentMaximize,
    maximize,
    toggleFullscreen: () => maximize(!layoutContentMaximize.value),
  }
}

export type UseMaximizeReturnType = ReturnType<typeof useMaximize>
