import { validteValueType } from '@use-utils/hook'

/**
 *
 * @param el 父节点对象
 * @param target 是否需要过滤，可按照数组或单个字符过滤
 *
 * @returns 目标节点下所有子节点
 */
export const getElementChildNodes = (
  el: HTMLElement,
  target?: string[] | string,
) => {
  if (el) {
    let nodes = Array.from(el.childNodes)

    if (Array.isArray(target)) {
      nodes = nodes.filter((el) => target.includes(el.nodeName))
    } else {
      if (target) {
        nodes = nodes.filter((el) => el.nodeName === target)
      }
    }

    return nodes
  } else {
    return []
  }
}

/**
 *
 * @param element Target element dom
 * @param event 绑定事件类型
 * @param handler 事件触发方法
 *
 * @remark 给元素绑定某个事件柄方法
 */
export const on = (
  element: HTMLElement | Document | Window,
  event: string,
  handler: EventListenerOrEventListenerObject,
  useCapture = false,
) => {
  if (element && event && handler) {
    element.addEventListener(event, handler, useCapture)
  }
}

/**
 *
 * @param element Target element dom
 * @param event 卸载事件类型
 * @param handler 所需卸载方法
 *
 * @remark 卸载元素上某个事件柄方法
 */
export const off = (
  element: HTMLElement | Document | Window,
  event: string,
  handler: EventListenerOrEventListenerObject,
  useCapture = false,
) => {
  if (element && event && handler) {
    element.removeEventListener(event, handler, useCapture)
  }
}

/**
 *
 * @param element Target element dom
 * @param className 所需添加className，可: 'xxx xxx' | 'xxx' 格式添加(参考向元素绑定 css 语法)
 *
 * @remark 添加元素className(可: 'xxx xxx' | 'xxx'格式添加)
 */
export const addClass = (element: HTMLElement, className: string) => {
  if (element) {
    const classes = className.trim().split(' ')

    classes.forEach((item) => {
      if (item) {
        element.classList.add(item)
      }
    })
  }
}

/**
 *
 * @param element Target element dom
 * @param className 所需删除className，可: 'xxx xxx' | 'xxx' 格式删除(参考向元素绑定 css 语法)
 *
 * @remark 删除元素className(可: 'xxx xxx' | 'xxx'格式删除)
 * @remark 如果输入值为 removeAllClass 则会删除该元素所有 class name
 */
export const removeClass = (
  element: HTMLElement,
  className: string | 'removeAllClass',
) => {
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

/**
 *
 * @param element Target element dom
 * @param className 查询元素是否含有此className，可: 'xxx xxx' | 'xxx' 格式查询(参考向元素绑定 css 语法)
 *
 * @returns 返回boolean
 *
 * @remark 元素是否含有某个className(可: 'xxx xxx' | 'xxx' 格式查询)
 */
export const hasClass = (element: HTMLElement, className: string) => {
  const elementClassName = element.className

  const classes = className
    .trim()
    .split(' ')
    .filter((item: string) => item !== '')

  return elementClassName.includes(classes.join(' '))
}

/**
 *
 * @param el Target element dom
 * @param styles 所需绑定样式(如果为字符串, 则必须以分号结尾每个行内样式描述)
 */
export const addStyle = (
  el: HTMLElement,
  styles: string | Partial<CSSStyleDeclaration>,
) => {
  if (el) {
    if (validteValueType(styles, 'Object')) {
      Object.keys(styles).forEach((item) => {
        el.style[item] = styles[item]
      })
    } else if (validteValueType(styles, 'String')) {
      const _styles = styles as string

      _styles.split(';').forEach((item) => {
        const [_k, _v] = item.split(':')

        if (_k && _v) {
          el.style[_k.trim()] = _v.trim()
        }
      })
    }
  }
}

/**
 *
 * @param el Target element dom
 * @param styles 所需卸载样式
 */
export const removeStyle = (el: HTMLElement, styles: string[]) => {
  if (el) {
    styles.forEach((item) => {
      el.style[item] = null
    })
  }
}

/**
 *
 * @param color 颜色格式
 * @param alpha 透明度
 * @returns 转换后的 rgba 颜色值
 *
 * @remark 将任意颜色值转为 rgba
 */
export const colorToRgba = (color: string, alpha = 1) => {
  const hexPattern = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i
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
    result = color
  } else if (rgbaPattern.test(color)) {
    result = color
  } else {
    result = ''
  }

  if (result && !result.startsWith('rgba')) {
    result = result.replace('rgb', 'rgba').replace(')', `, ${alpha})`)
  }

  return result
}
