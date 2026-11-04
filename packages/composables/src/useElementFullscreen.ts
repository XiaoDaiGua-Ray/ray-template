import { readonly, ref } from 'vue'
import type { BasicTarget } from './types'
import { effectDispose } from './vue/effect-dispose'
import { unrefElement } from './vue/unref-element'

export interface UseElementFullscreenOptions {
  /** 在覆盖样式前调用，抛错可取消进入。 */
  beforeEnter?: () => void
  /** 在进入状态后调用，最终尺寸会在下一帧应用。 */
  enter?: () => void
  /** 手动退出前调用，抛错可取消退出。 */
  beforeExit?: () => void
  /** 恢复原始样式后调用。 */
  exit?: () => void
  /** 未指定时按进入顺序分配层级。 */
  zIndex?: number
  backgroundColor?: string
  /** 全屏过渡样式；传入 none 禁用。 */
  transition?: string
}

let globalZIndex = 999
const ID_TAG = 'data-element-fullscreen'
const activeElements = new WeakSet<HTMLElement>()

/**
 *
 * @param target 需要占满视口的元素
 * @param options 生命周期回调和样式配置
 *
 * @description
 * 使用 CSS fixed 定位。每个元素同时只能由一个实例控制，退出或作用域销毁时恢复原有行内样式。
 *
 * @returns 全屏状态以及进入、退出和切换方法。
 */
export const useElementFullscreen = (
  target: BasicTarget,
  options?: UseElementFullscreenOptions,
) => {
  const {
    beforeEnter,
    beforeExit,
    enter: onEnter,
    exit: onExit,
    backgroundColor,
    zIndex,
    transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  } = options ?? {}

  const isFullscreen = ref(false)
  let frame: number | undefined
  let restore: (() => void) | undefined

  const exit = () => {
    if (!restore) return

    beforeExit?.()
    restore()
    onExit?.()
  }

  const enter = () => {
    const element = unrefElement(target)

    if (!(element instanceof HTMLElement) || activeElements.has(element)) return

    if (restore) exit()

    beforeEnter?.()

    const { top, left, width, height } = element.getBoundingClientRect()
    const styles = {
      position: 'fixed',
      'box-sizing': 'border-box',
      top: `${top}px`,
      left: `${left}px`,
      width: `${width}px`,
      height: `${height}px`,
      transform: 'translate(0, 0)',
      'z-index': String(zIndex ?? ++globalZIndex),
      transition: 'none',
      ...(backgroundColor ? { 'background-color': backgroundColor } : {}),
    }
    const originalStyles = Object.keys(styles).map((property) => [
      property,
      element.style.getPropertyValue(property),
      element.style.getPropertyPriority(property),
    ])
    const originalAttribute = element.getAttribute(ID_TAG)

    activeElements.add(element)
    restore = () => {
      if (frame !== void 0) cancelAnimationFrame(frame)

      frame = void 0

      for (const [property, value, priority] of originalStyles) {
        element.style.setProperty(property, value, priority)
      }

      if (originalAttribute === null) element.removeAttribute(ID_TAG)
      else element.setAttribute(ID_TAG, originalAttribute)

      restore = void 0
      activeElements.delete(element)
      isFullscreen.value = false
    }

    element.setAttribute(ID_TAG, 'true')

    for (const [property, value] of Object.entries(styles)) {
      element.style.setProperty(property, value)
    }

    // 提交原始位置后再应用过渡，避免从未绘制的中间状态开始。
    void element.offsetHeight
    element.style.transition = transition

    frame = requestAnimationFrame(() => {
      Object.assign(element.style, {
        top: '0px',
        left: '0px',
        width: '100dvw',
        height: '100dvh',
      })
      frame = void 0
    })

    isFullscreen.value = true
    onEnter?.()
  }

  const toggleFullscreen = () => {
    if (isFullscreen.value) exit()
    else enter()
  }

  effectDispose(() => {
    if (!restore) return

    // 作用域销毁必须释放样式和动画帧，不允许前置回调取消。
    restore()
    onExit?.()
  })

  return { enter, exit, toggleFullscreen, isFullscreen: readonly(isFullscreen) }
}

export type UseElementFullscreenReturnTypes = ReturnType<
  typeof useElementFullscreen
>
