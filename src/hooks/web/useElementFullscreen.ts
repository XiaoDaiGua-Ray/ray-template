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

export interface UseElementFullscreenOptions {
  beforeEnter?: () => void
  beforeExit?: () => void
  zIndex?: number
  backgroundColor?: string
}

let currentZIndex = 999
let isAppend = false
const ID_TAG = 'ELEMENT-FULLSCREEN-RAY'
const { height } = useWindowSize() // 获取实际高度避免 100vh 会导致手机端浏览器获取不准确问题
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
  const { beforeEnter, beforeExit, backgroundColor, zIndex } = options ?? {}
  const cacheStyle: Partial<CSSStyleDeclaration> = {} // 缓存一些需要被覆盖的样式，例如: transition
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
            width: 100% !important;
            height: ${height.value}px !important;
            transform: translate(-${left}px, -${top}px) !important;
            transition: all 0.3s var(--r-bezier);
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

      cacheStyle.transition = element.style.transition
      element.style.transition = 'all 0.3s var(--r-bezier)'
    }
  }

  const exit = () => {
    beforeExit?.()

    const element = unrefElement(target)

    if (element) {
      element.removeAttribute(ID_TAG)
    }
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

  const stopWatch = watch(() => height.value, updateStyle)

  effectDispose(() => {
    const element = unrefElement(target) as HTMLElement | null

    if (element) {
      element.style.transition = cacheStyle.transition ?? ''

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
