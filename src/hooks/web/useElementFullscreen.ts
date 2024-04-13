/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-12-04
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import { unrefElement, effectDispose, isValueType } from '@/utils'
import { useWindowSize } from '@vueuse/core'

import type { BasicTarget } from '@/types'
import type { CSSProperties } from 'vue'

export interface UseElementFullscreenOptions {
  /**
   *
   * 进入全屏前的回调
   */
  beforeEnter?: () => void
  /**
   *
   * 进入全屏后的回调
   */
  enter?: () => void
  /**
   *
   * 退出全屏前的回调
   */
  beforeExit?: () => void
  /**
   *
   * 退出全屏后的回调
   */
  exit?: () => void
  /**
   *
   * 全屏时的 z-index
   *
   * @default 999
   */
  zIndex?: number
  /**
   *
   * 全屏时的背景色
   *
   * @default null
   */
  backgroundColor?: string
  /**
   *
   * 手动设定 transition 过度效果
   *
   * @default 'width 0.3s var(--r-bezier), height 0.3s var(--r-bezier)'
   */
  transition?: string
}

let currentZIndex = 999
let isAppend = false
const ID_TAG = 'ELEMENT-FULLSCREEN-RAY'
const { width, height } = useWindowSize() // 获取实际高度避免 100vh 会导致手机端浏览器获取不准确问题
const styleElement = document.createElement('style')

/**
 *
 * @param target target dom
 * @param options useElementFullscreen options
 *
 * 使元素全屏，但是不调用浏览器的全屏 API，仅使用纯 css 实现
 * 该方法具有入侵性，并且会在元素上覆盖 transition 样式
 *
 * 该方法虽然能够实现全屏，但是会覆盖元素的一些基本样式，因此需要注意管理元素的一些基本样式，例如：position、z-index、transition、transform、width、height
 *
 * @example
 * <template>
 *  <div ref="refDom" />
 * </template>
 * <script lang="ts" setup>
 * const refDom = ref<HTMLElement>()
 * const { enter, exit, toggleFullscreen } = useElementFullscreen(refDom, { UseElementFullscreenOptions })
 *
 * enter() // 进入全屏
 * exit() // 退出全屏
 * toggleFullscreen() // 切换全屏
 * </script>
 */
export const useElementFullscreen = (
  target: BasicTarget,
  options?: UseElementFullscreenOptions,
) => {
  const {
    beforeEnter,
    beforeExit,
    enter: _enter,
    exit: _exit,
    backgroundColor,
    zIndex,
    transition = 'all 0.3s var(--r-bezier)',
  } = options ?? {}
  let isSetup = false

  const updateStyle = () => {
    const element = unrefElement(target) as HTMLElement | null

    if (!element) {
      return
    }

    const { left, top } = element.getBoundingClientRect()
    const cssContent = `
          [${ID_TAG}] {
            position: fixed;
            width: ${width.value}px !important;
            height: ${height.value}px !important;
            transform: translate(-${left}px, -${top}px) !important;
            transition: ${transition};
            z-index: ${
              isValueType<null>(zIndex, 'Null') ||
              isValueType<undefined>(zIndex, 'Undefined')
                ? currentZIndex
                : zIndex
            } !important;
            background-color: ${backgroundColor ?? null};
          }
        `

    styleElement.innerHTML = cssContent

    // 避免重复添加 style 标签
    if (!isAppend) {
      document.head.appendChild(styleElement)
    }
  }

  const enter = () => {
    const element = unrefElement(target) as HTMLElement | null

    beforeEnter?.()

    if (element) {
      if (!element.getAttribute(ID_TAG)) {
        element.setAttribute(ID_TAG, ID_TAG)
      }

      if (!isSetup) {
        isSetup = true
        currentZIndex += 1
      }

      if (!isAppend) {
        updateStyle()

        isAppend = true
      }

      element.style.transition = transition

      _enter?.()
    }
  }

  const exit = () => {
    beforeExit?.()

    const element = unrefElement(target)

    if (element) {
      element.removeAttribute(ID_TAG)
    }

    _exit?.()
  }

  const toggleFullscreen = () => {
    const element = unrefElement(target)

    if (element) {
      if (element.getAttribute(ID_TAG)) {
        exit()
      } else {
        enter()
      }
    }
  }

  const stopWatch = watch(() => [width.value, height.value], updateStyle)

  effectDispose(() => {
    const element = unrefElement(target) as HTMLElement | null

    if (element) {
      element.removeAttribute(ID_TAG)
    }

    stopWatch()
  })

  return {
    enter,
    exit,
    toggleFullscreen,
  }
}

export type UseElementFullscreenReturnTypes = ReturnType<
  typeof useElementFullscreen
>
