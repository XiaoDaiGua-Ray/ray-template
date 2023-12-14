import { APP_REGEX } from '@/app-config/regexConfig'
import { effectDispose, unrefElement, isValueType } from '@/utils'

import type {
  PartialCSSStyleDeclaration,
  ElementSelector,
} from '@/types/modules/utils'
import type { BasicTarget } from '@/types/modules/vue'

/**
 *
 * @param target Target element dom
 * @param className 所需添加className，可: 'xxx xxx' | 'xxx' 格式添加(参考向元素绑定 css 语法)
 *
 * 添加元素className(可: 'xxx xxx' | 'xxx'格式添加)
 *
 * @example
 * targetDom 当前 class: a-class b-class
 * addClass(targetDom, 'c-class') => a-class b-class c-class
 */
export const addClass = (
  target: BasicTarget<Element | HTMLElement | SVGAElement>,
  className: string,
) => {
  const update = () => {
    const element = unrefElement(target)

    if (element) {
      const classes = className.trim().split(' ')

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
 * @param target Target element dom
 * @param className 所需删除className，可: 'xxx xxx' | 'xxx' 格式删除(参考向元素绑定 css 语法)
 *
 * 删除元素className(可: 'xxx xxx' | 'xxx'格式删除)
 * 如果输入值为 removeAllClass 则会删除该元素所有 class name
 *
 * @example
 * targetDom 当前 class: a-class b-class
 * removeClass(targetDom, 'a-class') => b-class
 */
export const removeClass = (
  target: BasicTarget<Element | HTMLElement | SVGAElement>,
  className: string | 'removeAllClass',
) => {
  const update = () => {
    const element = unrefElement(target)

    if (element) {
      if (className === 'removeAllClass') {
        const classList = element.classList

        classList.forEach((curr) => classList.remove(curr))
      } else {
        const classes = className.trim().split(' ')

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
 * @param target Target element dom
 * @param className 查询元素是否含有此className，可: 'xxx xxx' | 'xxx' 格式查询(参考向元素绑定 css 语法)
 *
 * 元素是否含有某个className(可: 'xxx xxx' | 'xxx' 格式查询)
 *
 * @example
 * hasClass(targetDom, 'matchClassName') => Ref<true> | Ref<false>
 */
export const hasClass = (target: BasicTarget<Element>, className: string) => {
  const hasClassRef = ref(false)

  const update = () => {
    const element = unrefElement(target)

    if (!element) {
      hasClassRef.value = false
    } else {
      const elementClassName = element.className

      const classes = className
        .trim()
        .split(' ')
        .filter((item: string) => item !== '')

      hasClassRef.value = elementClassName.includes(classes.join(' '))
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
 * @param target Target element dom
 * @param styles 所需绑定样式(如果为字符串, 则必须以分号结尾每个行内样式描述)
 *
 * @example
 * style of string
 * ```
 * const styles = 'width: 100px; height: 100px; background: red;'
 *
 * addStyle(styles)
 * ```
 * style of object
 * ```
 * const styles = {
 *   width: '100px',
 *   height: '100px',
 * }
 *
 * addStyle(styles)
 * ```
 */
export const addStyle = (
  target: BasicTarget<HTMLElement | SVGAElement>,
  styles: PartialCSSStyleDeclaration | string,
) => {
  let styleObj: PartialCSSStyleDeclaration

  const update = () => {
    const element = unrefElement(target)

    if (!element) {
      return
    }

    if (isValueType<string>(styles, 'String')) {
      styleObj = styles.split(';').reduce((pre, curr) => {
        const [key, value] = curr.split(':').map((s) => s.trim())

        if (key && value) {
          pre[key] = value
        }

        return pre
      }, {} as PartialCSSStyleDeclaration)
    } else {
      styleObj = styles
    }

    Object.keys(styleObj).forEach((key) => {
      const value = styleObj[key]

      if (key in element!.style) {
        element!.style[key] = value
      }
    })
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
 * 当你发现不能正常的移除某些样式的时候，应该考虑是否是样式表兼容问题
 *
 * @example
 * removeStyle(['zIndex', 'z-index'])
 */
export const removeStyle = (
  target: BasicTarget<HTMLElement | SVGAElement>,
  styles: ((keyof CSSStyleDeclaration & string) | string)[],
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
 * 将任意颜色值转为 rgba，如果本身为 rgba, rgb 或者其它非法颜色值则直接返回
 *
 * @example
 * colorToRgba('#123632', 0.8) => rgba(18, 54, 50, 0.8)
 * colorToRgba('rgb(18, 54, 50)', 0.8) => rgb(18, 54, 50)
 * colorToRgba('#ee4f12', 0.3) => rgba(238, 79, 18, 0.3)
 * colorToRgba('rgba(238, 79, 18, 0.3)', 0.3) => rgba(238, 79, 18, 0.3)
 * colorToRgba('not a color', 0.3) => not a color
 */
export const colorToRgba = (color: string, alpha = 1) => {
  const hexPattern = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i
  const rgbPattern = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/i
  const rgbaPattern =
    /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d*(?:\.\d+)?)\)$/i

  let result: string

  if (hexPattern.test(color)) {
    const hex = color.substring(1)
    const rgb = [
      parseInt(hex.substring(0, 2), 16),
      parseInt(hex.substring(2, 4), 16),
      parseInt(hex.substring(4, 6), 16),
    ]

    result = 'rgb(' + rgb.join(', ') + ')'
  } else if (rgbPattern.test(color)) {
    return color
  } else if (rgbaPattern.test(color)) {
    return color
  } else {
    return color
  }

  if (result && !result.startsWith('rgba')) {
    result = result.replace('rgb', 'rgba').replace(')', `, ${alpha})`)
  }

  return result
}

/**
 *
 * @param element 需要匹配元素参数名称
 * @returns 匹配元素列表
 *
 * @remark 使用 querySelectorAll 作为检索方法
 * @remark 如果希望按照 attribute 匹配, 仅需要 'attr:xxx'传递参数即可
 *
 * @example
 * class:
 * const el = queryElements('.demo')
 * id:
 * const el = queryElements('#demo')
 * attribute:
 * const el = queryElements('attr:type=button')
 * 或者可以这样写
 * const el = queryElements('attr:type')
 */
export const queryElements = <T extends Element = Element>(
  selector: ElementSelector,
) => {
  if (!selector) {
    return null
  }

  const queryParam = selector.startsWith('attr:')
    ? `[${selector.replace('attr:', '')}]`
    : selector

  try {
    const elements = Array.from(document.querySelectorAll<T>(queryParam))

    return elements
  } catch (error) {
    console.error(`Failed to get elements for selector '${selector}'`, error)

    return null
  }
}

/**
 *
 * @param size css size
 * @param unit 自动填充 css 尺寸单位
 *
 * @remark 自动补全尺寸
 */
export const completeSize = (size: number | string, unit = 'px') => {
  if (typeof size === 'number') {
    return size.toString() + unit
  } else if (
    isValueType<string>(size, 'String') &&
    APP_REGEX.validCSSUnit.test(size)
  ) {
    return size
  } else {
    return size + unit
  }
}
