import { unrefElement, effectDispose, isValueType, setStyle } from '@/utils'
import { useWindowSize } from '@vueuse/core'

import type { BasicTarget } from '@/types'
import type { CSSProperties } from 'vue'

export interface UseElementFullscreenOptions {
  /**
   *
   * @description
   * 进入全屏前的回调。
   *
   * @default undefined
   */
  beforeEnter?: () => void
  /**
   *
   * @description
   * 进入全屏后的回调。
   *
   * @default undefined
   */
  enter?: () => void
  /**
   *
   * @description
   * 退出全屏前的回调。
   *
   * @default undefined
   */
  beforeExit?: () => void
  /**
   *
   * @description
   * 退出全屏后的回调。
   *
   * @default undefined
   */
  exit?: () => void
  /**
   *
   * @description
   * 全屏时的 z-index。
   *
   * @default 999
   */
  zIndex?: number
  /**
   *
   * @description
   * 全屏时的背景色。
   *
   * @default null
   */
  backgroundColor?: string
  /**
   *
   * @description
   * 手动设定 transition 过度效果。
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
 * @description
 * 使元素全屏，但是不调用浏览器的全屏 API，仅使用纯 css 实现。
 * 该方法具有入侵性，并且会在元素上覆盖 transition 样式。
 *
 * 该方法虽然能够实现全屏，但是会覆盖元素的一些基本样式，因此需要注意管理元素的一些基本样式，例如：position、z-index、transition、transform、width、height。
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
  const catchBoundingClientRect: {
    x: number | null
    y: number | null
  } = {
    x: null,
    y: null,
  }

  const updateStyle = () => {
    const element = unrefElement(target) as HTMLElement | null

    if (!element) {
      return
    }

    const { left, top } = element.getBoundingClientRect()

    if (
      catchBoundingClientRect.x === null &&
      catchBoundingClientRect.y === null
    ) {
      catchBoundingClientRect.x = -left
      catchBoundingClientRect.y = -top
    }

    setStyle(document.body, {
      '--element-fullscreen-z-index':
        isValueType<null>(zIndex, 'Null') ||
        isValueType<undefined>(zIndex, 'Undefined')
          ? currentZIndex
          : zIndex,
      '--element-fullscreen-transition': transition,
      '--element-fullscreen-background-color': backgroundColor,
      '--element-fullscreen-width': `${width.value}px`,
      '--element-fullscreen-height': `${height.value}px`,
      '--element-fullscreen-transform-x': `${catchBoundingClientRect.x}px`,
      '--element-fullscreen-transform-y': `${catchBoundingClientRect.y}px`,
    })

    const cssContent = `
          [${ID_TAG}] {
            position: fixed;
            width: var(--element-fullscreen-width) !important;
            height: var(--element-fullscreen-height) !important;
            transform: translate(var(--element-fullscreen-transform-x), var(--element-fullscreen-transform-y)) !important;
            transition: var(--element-fullscreen-transition);
            z-index: var(--element-fullscreen-z-index) !important;
            background-color: var(--element-fullscreen-background-color);
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

    // 回滚 z-index 值，避免无限增加
    currentZIndex--

    stopWatch()
  })

  return {
    enter,
    exit,
    toggleFullscreen,
    currentWindowSize: {
      width,
      height,
    },
  }
}

export type UseElementFullscreenReturnTypes = ReturnType<
  typeof useElementFullscreen
>
