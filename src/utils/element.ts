import { APP_REGEX } from '@/app-config'
import { effectDispose, unrefElement, isValueType } from '@/utils'

import type {
  BasicTarget,
  QueryElementsOptions,
  ElementSelector,
} from '@/types'
import type { CSSProperties } from 'vue'

/**
 *
 * @param target 目标元素或 ref 注册元素
 * @param classNames 所需添加类名
 *
 * @description
 * 为目标元素添加类名。
 *
 * @example
 * // targetDom 当前 class: a-class b-class
 * setClass(targetDom, 'c-class') // a-class b-class c-class
 * setClass(targetDom, ['c-class', 'c-class']) // a-class b-class c-class
 */
export const setClass = (
  target: BasicTarget<Element | HTMLElement | SVGAElement>,
  classNames: string | string[],
) => {
  const update = () => {
    const element = unrefElement(target)

    if (element) {
      const classes =
        typeof classNames === 'string'
          ? classNames.trim().split(' ')
          : classNames

      classes.forEach((item) => {
        if (item) {
          element.classList.add(item)
        }
      })
    }
  }

  const watcher = watch(() => unrefElement(target), update, {
    immediate: true,
  })

  effectDispose(watcher)
}

/**
 *
 * @param target 目标元素或 ref 注册元素
 * @param className 所需删除类名
 *
 * @description
 * 为目标元素删除类名。
 *
 * @example
 * // targetDom 当前 class: a-class b-class
 * removeClass(targetDom, 'a-class') // b-class
 * removeClass(targetDom, ['a-class', 'b-class']) // null
 * removeClass(targetDom, 'removeAllClass') // null
 */
export const removeClass = (
  target: BasicTarget<Element | HTMLElement | SVGAElement>,
  classNames: string | 'removeAllClass' | string[],
) => {
  const update = () => {
    const element = unrefElement(target)

    if (element) {
      if (classNames === 'removeAllClass') {
        const classList = element.classList

        classList.forEach((curr) => classList.remove(curr))
      } else {
        const classes =
          typeof classNames === 'string'
            ? classNames.trim().split(' ')
            : classNames

        classes.forEach((item) => {
          if (item) {
            element.classList.remove(item)
          }
        })
      }
    }
  }

  const watcher = watch(() => unrefElement(target), update, {
    immediate: true,
  })

  effectDispose(watcher)
}

/**
 *
 * @param target 目标元素或 ref 注册元素
 * @param className 查询元素是否含有此类名
 *
 * @description
 * 查询元素是否含有此类名。
 *
 * @example
 * hasClass(targetDom, 'matchClassName') // Ref<true> | Ref<false>
 * hasClass(targetDom, ['matchClassName', 'matchClassName']) // Ref<true> | Ref<false>
 */
export const hasClass = (
  target: BasicTarget<Element>,
  classNames: string | string[],
) => {
  const hasClassRef = ref(false)

  const update = () => {
    const element = unrefElement(target)

    if (!element) {
      hasClassRef.value = false
    } else {
      const elementClassName = element.className

      const classes =
        typeof classNames === 'string'
          ? classNames
              .trim()
              .split(' ')
              .filter((curr: string) => curr !== '')
          : classNames

      hasClassRef.value = classes.some((curr) =>
        elementClassName.includes(curr),
      )
    }
  }

  const watcher = watch(() => unrefElement(target), update, {
    immediate: true,
  })

  effectDispose(watcher)

  return hasClassRef
}

/**
 *
 * @param style 所需添加样式
 *
 * @returns 添加前缀后的样式
 *
 * @description
 * 为样式添加浏览器前缀，返回一个对象。
 *
 * @example
 * autoPrefixStyle('transform') // {webkitTransform: 'transform', mozTransform: 'transform', msTransform: 'transform', oTransform: 'transform'}
 */
export const autoPrefixStyle = (style: string) => {
  const prefixes = ['webkit', 'moz', 'ms', 'o']
  const styleWithPrefixes = {}

  prefixes.forEach((prefix) => {
    styleWithPrefixes[
      `${prefix}${style.charAt(0).toUpperCase()}${style.slice(1)}`
    ] = style
  })

  styleWithPrefixes[style] = style

  return styleWithPrefixes
}

/**
 *
 * @param target Target element dom
 * @param styles 所需绑定样式(如果为字符串, 则必须以分号结尾每个行内样式描述)
 *
 * @description
 * 为目标元素添加样式。
 *
 * @example
 * style of string
 * ```
 * const styles = 'width: 100px; height: 100px; background: red;'
 *
 * setStyle(styles)
 * ```
 * style of object
 * ```
 * const styles = {
 *   width: '100px',
 *   height: '100px',
 * }
 *
 * setStyle(styles)
 * ```
 */
export const setStyle = <Style extends CSSProperties>(
  target: BasicTarget<HTMLElement | SVGAElement>,
  styles: Partial<Style> | string | string[],
) => {
  const set = (styleStr: string, element: HTMLElement | SVGAElement) => {
    styleStr.split(';').forEach((curr) => {
      const [key, value] = curr.split(':')

      if (key && value) {
        const trimKey = key.trim()
        const trimValue = value.trim()

        // 是否为 css variable
        if (key.startsWith('--')) {
          element.style.setProperty(trimKey, trimValue)
        } else if (key.startsWith('-')) {
          element.style[key] = value
        } else {
          // 兼容浏览器前缀
          const kitFix = autoPrefixStyle(trimKey)

          Object.keys(kitFix).forEach((key) => {
            element.style[key] = kitFix[key]
          })
          // 设置默认需要添加样式
          element.style[trimKey] = trimValue
        }
      }
    })
  }

  const update = () => {
    const element = unrefElement(target)

    if (!element) {
      return
    }

    if (isValueType<string>(styles, 'String')) {
      set(styles, element)
    } else if (isValueType<string[]>(styles, 'Array')) {
      styles.forEach((curr) => {
        set(curr, element)
      })
    } else {
      const keys = Object.keys(styles)

      keys.forEach((curr) => {
        set(`${curr}: ${styles[curr]}`, element)
      })
    }
  }

  const watcher = watch(() => unrefElement(target), update, {
    immediate: true,
  })

  effectDispose(watcher)
}

/**
 *
 * @param el Target element dom
 * @param styles 所需卸载样式
 *
 * @description
 * 为目标元素卸载样式。
 *
 * 当你发现不能正常的移除某些样式的时候，应该考虑是否是样式表兼容问题。
 *
 * @example
 * removeStyle(['zIndex', 'z-index'])
 */
export const removeStyle = (
  target: BasicTarget<HTMLElement | SVGAElement>,
  styles: ((keyof CSSProperties & string) | string)[],
) => {
  const update = () => {
    const element = unrefElement(target)

    if (!element) {
      return
    }

    styles.forEach((curr) => {
      element.style.removeProperty(curr)
    })
  }

  const watcher = watch(() => unrefElement(target), update, {
    immediate: true,
  })

  effectDispose(watcher)
}

/**
 *
 * @param color 颜色格式
 * @param alpha 透明度
 *
 * @description
 * 将任意颜色值转为 rgba，如果本身为 rgba 或者其它非法颜色值则直接返回。
 *
 * @example
 * colorToRgba('#123632', 0.8) // rgba(18, 54, 50, 0.8)
 * colorToRgba('rgb(18, 54, 50)', 0.8) // rgba(18, 54, 50, 0.8)
 * colorToRgba('#ee4f12', 0.3) // rgba(238, 79, 18, 0.3)
 * colorToRgba('rgba(238, 79, 18, 0.3)', 0.3) // rgba(238, 79, 18, 0.3)
 * colorToRgba('not a color', 0.3) // not a color
 */
export const colorToRgba = (color: string, alpha = 1) => {
  if (color.includes('rgba')) {
    return color
  }

  if (color.includes('rgb')) {
    return color.replace('rgb', 'rgba').replace(')', `, ${alpha})`)
  }

  if (color.includes('#')) {
    const hex = color.replace('#', '')

    switch (hex.length) {
      case 3:
        return `rgba(${parseInt(hex[0] + hex[0], 16)}, ${parseInt(hex[1] + hex[1], 16)}, ${parseInt(hex[2] + hex[2], 16)}, ${alpha})`

      case 6:
        return `rgba(${parseInt(hex.slice(0, 2), 16)}, ${parseInt(hex.slice(2, 4), 16)}, ${parseInt(hex.slice(4, 6), 16)}, ${alpha})`

      case 8:
        return `rgba(${parseInt(hex.slice(0, 2), 16)}, ${parseInt(hex.slice(2, 4), 16)}, ${parseInt(hex.slice(4, 6), 16)}, ${(parseInt(hex.slice(6, 8), 16) / 255).toFixed(2)})`

      default:
        return color
    }
  }

  return color
}

/**
 *
 * @param element 需要匹配元素参数名称
 * @returns 匹配元素列表
 *
 * @description
 * 使用 querySelectorAll 作为检索方法。
 *
 * 如果希望按照 attribute 匹配, 仅需要 'attr:xxx'传递参数即可。
 *
 * @example
 * // class:
 * const el = queryElements('.demo')
 * // id:
 * const el = queryElements('#demo')
 * // attribute:
 * const el = queryElements('attr:type=button')
 * // 或者可以这样写
 * const el = queryElements('attr:type')
 * // 默认元素
 * const el = queryElements('.demo', { defaultElement: document.body })
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
 * 自动补全尺寸。
 */
export const completeSize = (size: number | string, unit = 'px') => {
  if (typeof size === 'number') {
    return size.toString() + unit
  } else if (
    isValueType<string>(size, 'String') &&
    APP_REGEX.cssUnit.test(size)
  ) {
    return size
  } else {
    return size + unit
  }
}
