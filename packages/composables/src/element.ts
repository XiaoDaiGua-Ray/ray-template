import type {
  ElementSelector,
  QueryElementsOptions,
} from '@ray-template/utils/types'
import { ref, watch } from 'vue'
import type { CSSProperties } from 'vue'
import type { BasicTarget } from './types'
import { unrefElement } from './vue/unref-element'

const classTokens = (names: string | string[]) =>
  (typeof names === 'string' ? [names] : names)
    .flatMap((name) => name.split(/[\t\n\f\r ]+/))
    .filter(Boolean)

/**
 *
 * @param target 元素或可响应的元素引用
 * @param classNames 空白分隔的类名或类名数组
 *
 * @description
 * 给当前和后续替换的元素添加类名。
 */
export const setClass = (
  target: BasicTarget<Element>,
  classNames: string | string[],
) => {
  const tokens = classTokens(classNames)

  watch(
    () => unrefElement(target),
    (element) => element?.classList.add(...tokens),
    { immediate: true },
  )
}

/**
 *
 * @param target 元素或可响应的元素引用
 * @param classNames 要移除的类名；removeAllClass 清空整个类名列表
 *
 * @description
 * 操作当前和后续替换的元素。
 */
export const removeClass = (
  target: BasicTarget<Element>,
  classNames: string | string[],
) => {
  watch(
    () => unrefElement(target),
    (element) => {
      if (classNames === 'removeAllClass') {
        element?.removeAttribute('class')
      } else {
        element?.classList.remove(...classTokens(classNames))
      }
    },
    { immediate: true },
  )
}

/**
 *
 * @param target 元素或可响应的元素引用
 * @param classNames 待查找的类名
 *
 * @returns 当前元素是否含至少一个完整类名；随引用更新，不监听外部 class 修改。
 */
export const hasClass = (
  target: BasicTarget<Element>,
  classNames: string | string[],
) => {
  const result = ref(false)
  const tokens = classTokens(classNames)

  watch(
    () => unrefElement(target),
    (element) => {
      result.value = tokens.some((token) => element?.classList.contains(token))
    },
    { immediate: true },
  )

  return result
}

/**
 *
 * @param style CSS 属性名
 *
 * @returns 旧版兼容映射，包含原名和历史 camelCase 前缀名。
 */
export const autoPrefixStyle = (style: string) =>
  Object.fromEntries([
    ...['webkit', 'moz', 'ms', 'o'].map((prefix) => [
      `${prefix}${style.charAt(0).toUpperCase()}${style.slice(1)}`,
      style,
    ]),
    [style, style],
  ])

const cssProperty = (key: string) =>
  key.startsWith('--')
    ? key
    : key
        .replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)
        .replace(/^(webkit|moz|ms|o)-/, '-$1-')

/**
 *
 * @param target 元素或可响应的元素引用
 * @param styles CSS 声明字符串、声明数组或属性对象
 *
 * @description
 * 保留已有的其他行内样式，支持 camelCase、自定义属性和 !important。
 */
export const setStyle = <Style extends CSSProperties>(
  target: BasicTarget<HTMLElement | SVGElement>,
  styles: Partial<Style> | string | string[],
) => {
  watch(
    () => unrefElement(target),
    (element) => {
      if (!element) return

      if (typeof styles === 'string' || Array.isArray(styles)) {
        const parsed = element.ownerDocument.createElement('span').style

        // 让浏览器解析带冒号、分号或引号的属性值。
        parsed.cssText = typeof styles === 'string' ? styles : styles.join(';')

        for (let index = 0; index < parsed.length; index++) {
          const key = parsed.item(index)

          element.style.setProperty(
            key,
            parsed.getPropertyValue(key),
            parsed.getPropertyPriority(key),
          )
        }
      } else {
        for (const [key, value] of Object.entries(styles)) {
          if (value == null) continue

          const text = String(value)
          const important = /\s*!important\s*$/i

          element.style.setProperty(
            cssProperty(key),
            text.replace(important, ''),
            important.test(text) ? 'important' : '',
          )
        }
      }
    },
    { immediate: true },
  )
}

/**
 *
 * @param target 元素或可响应的元素引用
 * @param styles 要删除的 CSS 属性名
 *
 * @description
 * 支持 camelCase 和 CSS 原生属性名。
 */
export const removeStyle = (
  target: BasicTarget<HTMLElement | SVGElement>,
  styles: string[],
) => {
  watch(
    () => unrefElement(target),
    (element) => {
      styles.forEach((name) => element?.style.removeProperty(cssProperty(name)))
    },
    { immediate: true },
  )
}

/**
 *
 * @param color 颜色格式
 * @param alpha 透明度
 * @param defaultColor 默认颜色值
 *
 * @description
 * 转换 rgb/hex/hsl 颜色；已有 rgba/hsla 会更新 alpha，四位和八位 hex 保留自带透明度。
 * 无法识别时返回默认色或原始值。
 */
export const colorToRgba = (
  color: string,
  alpha = 1,
  defaultColor?: string,
) => {
  if (!color) {
    return defaultColor || color
  }

  const original = color

  color = color.trim().toLowerCase()

  // 处理 rgba 格式 - 替换原有的 alpha 值
  if (/^rgba\([^,]+,[^,]+,[^,]+,[^,]+\)$/.test(color)) {
    return color.replace(
      /rgba\((.*?),(.*?),(.*?),.*?\)/,
      (_, r: string, g: string, b: string) =>
        `rgba(${r.trim()}, ${g.trim()}, ${b.trim()}, ${alpha})`,
    )
  }

  // 处理 rgb 格式
  if (/^rgb\([^,]+,[^,]+,[^,]+\)$/.test(color)) {
    return color.replace('rgb', 'rgba').replace(')', `, ${alpha})`)
  }

  // 处理 hsla 格式 - 替换原有的 alpha 值
  if (/^hsla\([^,]+,[^,]+,[^,]+,[^,]+\)$/.test(color)) {
    return color.replace(
      /hsla\((.*?),(.*?),(.*?),.*?\)/,
      (_, h: string, s: string, l: string) =>
        `hsla(${h.trim()}, ${s.trim()}, ${l.trim()}, ${alpha})`,
    )
  }

  // 处理 hsl 格式
  if (/^hsl\([^,]+,[^,]+,[^,]+\)$/.test(color)) {
    return color.replace('hsl', 'hsla').replace(')', `, ${alpha})`)
  }

  if (/^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/.test(color)) {
    const hex = color.slice(1)
    const channels =
      hex.length <= 4
        ? [...hex].map((channel) => parseInt(channel + channel, 16))
        : hex.match(/../g)!.map((channel) => parseInt(channel, 16))
    const [r, g, b, embeddedAlpha] = channels
    const opacity =
      embeddedAlpha === void 0
        ? alpha
        : Number((embeddedAlpha / 255).toFixed(2))

    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }

  return defaultColor ?? original
}

/**
 *
 * @param selector CSS 选择器，也可用 attr: 前缀简写属性选择器
 * @param options 无匹配或选择器无效时的回退元素
 *
 * @description
 * 使用 querySelectorAll 作为检索方法。
 *
 * @returns 匹配元素列表；选择器为空或无效且没有回退元素时返回 null。
 */
export const queryElements = <T extends Element = Element>(
  selector: ElementSelector,
  options?: QueryElementsOptions<T>,
) => {
  const { defaultElement } = options || {}

  if (!selector) {
    return defaultElement ? [defaultElement] : null
  }

  const queryParam = selector.startsWith('attr:')
    ? `[${selector.replace('attr:', '')}]`
    : selector

  try {
    const elements = Array.from(document.querySelectorAll<T>(queryParam))

    if (!elements.length && defaultElement) {
      return [defaultElement]
    }

    return elements
  } catch (error) {
    console.error(
      `[queryElements]: Failed to get elements for selector '${selector}'`,
      error,
    )

    return defaultElement ? [defaultElement] : null
  }
}

/**
 *
 * @param size css size
 * @param unit 自动填充 css 尺寸单位
 *
 * @description
 * 仅给数字或无单位的数字字符串补单位；保留原有 CSS 关键字和表达式。
 */
export const completeSize = (size: number | string, unit = 'px') =>
  typeof size === 'number' || /^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(size.trim())
    ? `${typeof size === 'number' ? size : size.trim()}${unit}`
    : size
