import { setVariable, getVariableToRefs } from '@/global-variable'
import { LAYOUT_CONTENT_REF } from '@/app-config'
import { unrefElement } from '@/utils'
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

export const useMaximize = () => {
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
   * maximize(true, { MaximizeOptions }) 全屏内容区域
   * maximize(false, { MaximizeOptions }) 取消全屏内容区域
   */
  const maximize = (full: boolean, options?: MaximizeOptions) => {
    const { scrollToOptions } = options ?? {}
    const contentEl = unrefElement(LAYOUT_CONTENT_REF as Ref<HTMLElement>)
    const { toggleFullscreen } = useElementFullscreen(contentEl, options)

    setVariable('layoutContentMaximize', full)
    toggleFullscreen()

    if (scrollToOptions && full) {
      LAYOUT_CONTENT_REF?.value?.scrollTo(scrollToOptions)
    }
  }

  return {
    isLayoutContentMaximized,
    maximize,
  }
}

export type UseMaximizeReturnType = ReturnType<typeof useMaximize>
