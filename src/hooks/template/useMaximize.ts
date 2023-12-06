/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-11-30
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import { setVariable, getVariableToRefs } from '@/global-variable'
import { LAYOUT_CONTENT_REF } from '@/app-config/routerConfig'
import { unrefElement } from '@/utils/vue'
import { useElementFullscreen } from '../web'

import type { UseElementFullscreenOptions } from '../web'

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
   * 该方法仅针对于 LayoutContent 区域，并且依赖全局属性 layoutContentMaximize
   *
   * @example
   * maximize(true, { UseElementFullscreenOptions }) 全屏内容区域
   * maximize(false, { UseElementFullscreenOptions }) 取消全屏内容区域
   */
  const maximize = (full: boolean, options?: UseElementFullscreenOptions) => {
    const contentEl = unrefElement(LAYOUT_CONTENT_REF as Ref<HTMLElement>)
    const { toggleFullscreen } = useElementFullscreen(contentEl, options)

    setVariable('layoutContentMaximize', full)
    toggleFullscreen()
  }

  return {
    isLayoutContentMaximized,
    maximize,
  }
}

export type UseMaximizeReturnType = ReturnType<typeof useMaximize>
