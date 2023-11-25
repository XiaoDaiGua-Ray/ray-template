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

import { setVariable, getVariableToRefs } from '@/global-variable'
import { LAYOUT_CONTENT_REF } from '@/app-config/routerConfig'
import { addStyle, removeStyle } from '@/utils/element'
import { unrefElement } from '@/utils/vue'
import { useWindowSize } from '@vueuse/core'

import type { Ref } from 'vue'

export interface MaximizeOptions {
  zIndex?: string
}

export function useMainPage() {
  /**
   *
   * @param wait 延迟时长
   *
   * 刷新当前路由（强制触发刷新）
   *
   * @example
   * reload(1200)
   */
  const reload = (wait = 800) => {
    setVariable('globalMainLayoutLoad', false)

    setTimeout(() => setVariable('globalMainLayoutLoad', true), wait)
  }

  /**
   *
   * 打开加载动画（不触发强制刷新）
   *
   * @example
   * openSpin()
   */
  const openSpin = () => {
    setVariable('layoutContentSpinning', true)
  }

  /**
   *
   * 关闭加载动画（不触发强制刷新）
   *
   * @example
   * closeSpin()
   */
  const closeSpin = () => {
    setVariable('layoutContentSpinning', false)
  }

  /**
   *
   * 当前 LayoutContent 是处于否全屏状态
   * - true: 全屏
   * - false: 非全屏
   *
   * @example
   * isLayoutContentMaximized() // true or false
   */
  const isLayoutContentMaximized = () =>
    computed(() => getVariableToRefs('layoutContentMaximize').value)

  /**
   *
   * @param full 是否网页全屏内容区域
   *
   * 该方法仅针对于 LayoutContent 区域，并且依赖全局属性 layoutContentMaximize
   *
   * @example
   * maximize(true, { MaximizeOptions }) 全屏内容区域
   * maximize(false, { MaximizeOptions }) 取消全屏内容区域
   */
  const maximize = (full: boolean, options?: MaximizeOptions) => {
    const contentEl = unrefElement(LAYOUT_CONTENT_REF as Ref<HTMLElement>)

    if (contentEl) {
      const { left, top } = contentEl.getBoundingClientRect() // 使用 left, top 计算 translate 偏移
      const { height } = useWindowSize() // 获取实际高度避免 100vh 会导致手机端浏览器获取不准确问题
      const { zIndex = '99' } = options ?? {}

      full
        ? addStyle(contentEl, {
            position: 'fixed',
            width: '100%',
            height: `${height.value}px`,
            transform: `translate(-${left}px, -${top}px)`,
            transition: 'all 0.3s var(--r-bezier)',
            zIndex,
          })
        : removeStyle(contentEl, [
            'position',
            'width',
            'height',
            'transform',
            // 为了兼容浏览器 zIndex 的样式表
            'zIndex',
            'z-index',
          ])
    }

    setVariable('layoutContentMaximize', full)
  }

  return {
    reload,
    maximize,
    isLayoutContentMaximized,
    openSpin,
    closeSpin,
  }
}
