/**
 *
 * @description
 * 该方法借鉴 pure admin ripple directive 实现。
 *
 * 在原有指令实现基础上，补充了 ts 签名与注释。并且结合本模板的特性实现。
 *
 * @see https://github.dev/pure-admin/vue-pure-admin/blob/main/src/components/ReCol/index.ts
 */

import { isValueType } from '@/utils'

import type { RippleOptions, RippleElement, RippleBindingValue } from './types'

const animationClasses = {
  vRippleAnimationEnter: 'v-ripple__animation--enter',
  vRippleAnimationVisible: 'v-ripple__animation--visible',
  vRippleAnimationIn: 'v-ripple__animation--in',
  vRippleAnimationOut: 'v-ripple__animation--out',
  vRippleAnimation: 'v-ripple__animation',
}
const vRippleContainerClass = 'v-ripple__container'

function transform(el: HTMLElement, value: string) {
  el.style.transform = value
}

/**
 *
 * @param e current click event
 *
 * @description
 * 显示水波纹效果。
 */
function rippleShow(e: PointerEvent) {
  const value: RippleOptions = {}
  const element = e.currentTarget as RippleElement | undefined

  if (!element?.__d_ripple__ || element.__d_ripple__.touched) {
    return
  }

  value.center = element.__d_ripple__.centered

  if (element.__d_ripple__.class) {
    value.class = element.__d_ripple__.class
  }

  ripples.show(e, element, value)
}

/**
 *
 * @param e current event
 *
 * @description
 * 隐藏水波纹效果。
 */
function rippleHide(e: Event) {
  const element = e.currentTarget as RippleElement | null

  if (!element?.__d_ripple__) {
    return
  }

  // 调用清理方法，隐藏水波纹
  setTimeout(() => {
    if (element.__d_ripple__) {
      element.__d_ripple__.touched = false
    }
  })
  ripples.hide(element)
}

/**
 *
 * @param e current click event
 * @param el current binding element
 * @param value current bind value
 *
 * @description
 * 计算当前水波纹相关的信息。
 */
const calculate = (
  e: PointerEvent,
  el: RippleElement,
  value: RippleOptions = {},
) => {
  const offset = el.getBoundingClientRect()

  const localX = e.clientX - offset.left // 点击位置距离 el 水平距离
  const localY = e.clientY - offset.top // 点击位置距离 el 垂直距离

  let radius = 0 // 圆半径
  let scale = 0.3 // 缩放比例

  // 计算点击位置到 el 顶点最远距离，即为圆的最大半径（勾股定理）
  if (el.__d_ripple__?.circle) {
    scale = 0.15
    radius = el.clientWidth / 2
    radius = value.center
      ? radius
      : radius + Math.sqrt((localX - radius) ** 2 + (localY - radius) ** 2) / 4
  } else {
    radius = Math.sqrt(el.clientWidth ** 2 + el.clientHeight ** 2) / 2
  }

  const centerX = `${(el.clientWidth - radius * 2) / 2}px` // 水平中心点
  const centerY = `${(el.clientHeight - radius * 2) / 2}px` // 垂直中心点

  const x = value.center ? centerX : `${localX - radius}px` // 点击位置水平坐标
  const y = value.center ? centerY : `${localY - radius}px` // 点击位置垂直坐标

  return {
    radius,
    scale,
    x,
    y,
    centerX,
    centerY,
  }
}

const ripples = {
  show(e: PointerEvent, el: RippleElement, value: RippleOptions = {}) {
    if (!el?.__d_ripple__?.enabled) {
      return
    }

    // 创建 ripple 元素和 ripple 父元素
    const container = document.createElement('span')
    const animation = document.createElement('span')

    container.appendChild(animation)

    container.className = vRippleContainerClass

    if (value.class) {
      container.className += ` ${value.class}`
    }

    const { radius, scale, x, y, centerX, centerY } = calculate(e, el, value)

    // ripple 圆大小
    const size = `${radius * 2}px`

    animation.className = animationClasses['vRippleAnimation']
    animation.style.width = size
    animation.style.height = size

    el.appendChild(container)

    // 获取目标元素样式表
    const computed = window.getComputedStyle(el)

    // 防止 position 被覆盖导致 ripple 位置有问题
    if (computed && computed.position === 'static') {
      el.style.position = 'relative'
      el.dataset.previousPosition = 'static'
    }

    animation.classList.add(animationClasses['vRippleAnimationEnter'])
    animation.classList.add(animationClasses['vRippleAnimationVisible'])

    transform(
      animation,
      `translate(${x}, ${y}) scale3d(${scale},${scale},${scale})`,
    )

    animation.dataset.activated = String(performance.now())

    setTimeout(() => {
      animation.classList.remove(animationClasses['vRippleAnimationEnter'])
      animation.classList.add(animationClasses['vRippleAnimationIn'])
      transform(animation, `translate(${centerX}, ${centerY}) scale3d(1,1,1)`)
    }, 0)
  },
  hide(el: RippleElement | null) {
    if (!el?.__d_ripple__?.enabled) {
      return
    }

    const ripples = el.getElementsByClassName(
      animationClasses['vRippleAnimation'],
    )

    if (ripples.length === 0) {
      return
    }

    const animation = ripples[ripples.length - 1] as HTMLElement

    if (animation.dataset.isHiding) {
      return
    }

    animation.dataset.isHiding = 'true'

    const diff = performance.now() - Number(animation.dataset.activated)
    const delay = Math.max(250 - diff, 0)

    setTimeout(() => {
      animation.classList.remove(animationClasses['vRippleAnimationIn'])
      animation.classList.add(animationClasses['vRippleAnimationOut'])

      setTimeout(() => {
        const ripples = el.getElementsByClassName(
          animationClasses['vRippleAnimation'],
        )

        if (ripples.length === 1 && el.dataset.previousPosition) {
          el.style.position = el.dataset.previousPosition
          delete el.dataset.previousPosition
        }

        if (animation.parentNode?.parentNode === el) {
          el.removeChild(animation.parentNode)
        }
      }, 300)
    }, delay)
  },
}

/**
 *
 * @param value valid value
 *
 * @description
 * 判断是否启用了水波纹效果。
 */
export function isRippleEnabled(value: unknown): value is true {
  return typeof value === 'undefined' || !!value
}

/**
 *
 * @param el current binging element
 *
 * @description
 * 移除被绑定元素的水波纹相关事件。
 */
export function removeListeners(el: HTMLElement) {
  el.removeEventListener('pointerdown', rippleShow)
  el.removeEventListener('pointerup', rippleHide)
}

/**
 *
 * @param el current binding element
 * @param binding current value
 * @param isEnabled is enabled
 *
 * @description
 * 绑定并且更新水波纹状态。
 */
export function updateRipple(
  el: RippleElement,
  binding: RippleBindingValue,
  isEnabled: boolean,
) {
  const { value, modifiers } = binding
  const enabled = isRippleEnabled(value)

  if (!enabled) {
    ripples.hide(el)
  }

  el.__d_ripple__ = el.__d_ripple__ ?? {}
  el.__d_ripple__.enabled = enabled
  el.__d_ripple__.centered = modifiers.center
  el.__d_ripple__.circle = modifiers.circle

  if (isValueType<object>(value, 'Object') && value.class) {
    el.__d_ripple__.class = value.class
  }

  if (enabled && !isEnabled) {
    el.addEventListener('pointerdown', rippleShow)
    el.addEventListener('pointerup', rippleHide)
  } else if (!enabled && isEnabled) {
    removeListeners(el)
  }
}
