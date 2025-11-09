import { setVariable, getVariableToRefs } from '@/global-variable'
import { LAYOUT_CONTENT_REF } from '@/app-config'
import { useElementFullscreen } from '../web'

import type { UseElementFullscreenOptions } from '../web'

export interface ScrollToOptions {
  left?: number
  top?: number
  behavior?: 'auto' | 'smooth' | 'instant'
}

export interface MaximizeOptions extends UseElementFullscreenOptions {
  /**
   *
   * 配置全屏后滚动的位置，left、top、behavior
   * 基于 LAYOUT_CONTENT_REF 实现
   *
   * 但是，该配置项仅在传递 true 时生效
   *
   * @default undefined
   */
  scrollToOptions?: ScrollToOptions
}

export const useMaximize = (options?: MaximizeOptions) => {
  const contentEl = LAYOUT_CONTENT_REF as Ref<HTMLElement>
  const { enter, exit, toggleFullscreen, isFullscreen } = useElementFullscreen(
    contentEl,
    options,
  )

  /**
   *
   * 当前 LayoutContent 是处于否全屏状态
   * - true: 全屏
   * - false: 非全屏
   *
   * @example
   * isLayoutContentMaximized() // true or false
   */
  const isLayoutContentMaximized = computed(
    () => getVariableToRefs('layoutContentMaximize').value,
  )

  /**
   *
   * @param full 是否网页全屏内容区域
   *
   * @description
   * 该方法仅针对于 LayoutContent 区域，并且依赖全局属性 layoutContentMaximize。
   *
   * @example
   * maximize(true) 全屏内容区域
   * maximize(false) 取消全屏内容区域
   */
  const maximize = (full: boolean, options?: MaximizeOptions) => {
    const { scrollToOptions } = options ?? {}

    setVariable('layoutContentMaximize', full)

    if (full) {
      enter()
    } else {
      exit()
    }

    if (scrollToOptions && full) {
      contentEl?.value?.scrollTo(scrollToOptions)
    }
  }

  return {
    isLayoutContentMaximized,
    isFullscreen,
    maximize,
    toggleFullscreen,
  }
}

export type UseMaximizeReturnType = ReturnType<typeof useMaximize>
