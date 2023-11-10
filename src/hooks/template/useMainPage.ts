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

import { setVariable } from '@/global-variable/index'
import { LAYOUT_CONTENT_REF } from '@/app-config/routerConfig'
import { addStyle, removeStyle } from '@/utils/element'
import { unrefElement } from '@/utils/vue/index'

import type { Ref } from 'vue'

export function useMainPage() {
  /**
   *
   * @param wait 延迟时长
   *
   * 刷新当前路由
   */
  const reload = (wait = 800) => {
    setVariable('globalMainLayoutLoad', false)

    setTimeout(() => setVariable('globalMainLayoutLoad', true), wait)
  }

  /**
   *
   * @param full 是否网页全屏内容区域
   *
   * 该方法仅针对于 LayoutContent 区域，并且依赖全局属性 layoutContentMaximize
   */
  const maximize = (full: boolean) => {
    const contentEl = unrefElement(LAYOUT_CONTENT_REF as Ref<HTMLElement>)

    if (contentEl) {
      const { left, top } = contentEl.getBoundingClientRect()

      full
        ? addStyle(contentEl, {
            transform: `translate(-${left}px, -${top}px)`,
          })
        : removeStyle(contentEl, ['transform'])
    }

    setVariable('layoutContentMaximize', full)
  }

  return {
    reload,
    maximize,
  }
}
