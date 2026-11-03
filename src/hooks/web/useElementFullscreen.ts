import type { BasicTarget } from '@/types'
import { effectDispose, isValueType, unrefElement } from '@/utils'
import { pick } from 'lodash-es'

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
   * @default 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
   */
  transition?: string
}

// 全局 z-index 管理
let globalZIndex = 999
const ID_TAG = 'data-element-fullscreen'

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
 * const refDom = useTemplateRef<HTMLElement>('refDom')
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
    transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  } = options ?? {}

  // 每个实例独立的状态
  const isFullscreen = ref(false)
  const instanceZIndex = ref(0)
  let frame: number | undefined
  let activeElement: HTMLElement | null = null
  const originalStyles = {
    position: '',
    width: '',
    height: '',
    top: '',
    left: '',
    transform: '',
    transition: '',
    zIndex: '',
    backgroundColor: '',
    boxSizing: '',
  }

  const enter = () => {
    const element = unrefElement(target) as HTMLElement | null

    if (!element) {
      return
    }

    if (activeElement === element) return

    if (activeElement) exit()

    beforeEnter?.()
    activeElement = element

    // 保存原始样式（只在第一次进入时保存）
    if (!isFullscreen.value) {
      const o = pick(element.style, [
        'position',
        'width',
        'height',
        'top',
        'left',
        'transform',
        'transition',
        'zIndex',
        'backgroundColor',
        'boxSizing',
      ])

      Object.assign(originalStyles, o)
    }

    // 获取当前位置
    const { top, left, width, height } = element.getBoundingClientRect()

    // 分配 z-index
    if (instanceZIndex.value === 0) {
      if (
        isValueType<null>(zIndex, 'Null') ||
        isValueType<undefined>(zIndex, 'Undefined')
      ) {
        globalZIndex += 1
        instanceZIndex.value = globalZIndex
      } else {
        instanceZIndex.value = zIndex
      }
    }

    // 设置全屏样式
    element.setAttribute(ID_TAG, 'true')

    // 设置初始位置（不设置 transition）
    element.style.position = 'fixed'
    element.style.boxSizing = 'border-box'
    element.style.top = `${top}px`
    element.style.left = `${left}px`
    element.style.width = `${width}px`
    element.style.height = `${height}px`
    element.style.transform = 'translate(0, 0)'
    element.style.zIndex = String(instanceZIndex.value)

    if (backgroundColor) {
      element.style.backgroundColor = backgroundColor
    }

    // 强制重排
    void element.offsetHeight

    // 添加 transition
    element.style.transition = transition

    // 使用 requestAnimationFrame 应用最终样式
    frame = requestAnimationFrame(() => {
      element.style.top = '0px'
      element.style.left = '0px'
      element.style.width = '100dvw'
      element.style.height = '100dvh'
      frame = void 0
    })

    // 先更新状态
    isFullscreen.value = true

    _enter?.()
  }

  const exit = () => {
    const element = activeElement

    if (!element) {
      return
    }

    beforeExit?.()

    if (frame !== void 0) cancelAnimationFrame(frame)

    frame = void 0

    // 先更新状态
    isFullscreen.value = false

    // 恢复原始样式
    element.removeAttribute(ID_TAG)

    // 样式属性映射表（camelCase -> kebab-case）
    const styleMap: Record<keyof typeof originalStyles, string> = {
      position: 'position',
      width: 'width',
      height: 'height',
      top: 'top',
      left: 'left',
      transform: 'transform',
      transition: 'transition',
      zIndex: 'z-index',
      backgroundColor: 'background-color',
      boxSizing: 'box-sizing',
    }

    // 批量恢复样式
    Object.entries(originalStyles).forEach(([key, value]) => {
      const styleName = styleMap[key as keyof typeof originalStyles]

      if (!value) {
        element.style.removeProperty(styleName)
      } else {
        element.style.setProperty(styleName, value)
      }
    })

    activeElement = null
    _exit?.()
  }

  const toggleFullscreen = () => {
    if (isFullscreen.value) {
      exit()
    } else {
      enter()
    }
  }

  effectDispose(() => {
    if (isFullscreen.value) {
      exit()
    }
  })

  return {
    enter,
    exit,
    toggleFullscreen,
    isFullscreen: readonly(isFullscreen),
  }
}

export type UseElementFullscreenReturnTypes = ReturnType<
  typeof useElementFullscreen
>
