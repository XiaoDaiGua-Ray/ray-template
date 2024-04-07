/**
 *
 * directive name: ellipsis
 *
 * 该指令用于处理文本溢出省略，使用的时候必须传递正确的 width 值。
 *
 * 其中 line 和 type 是可选的，line 默认为 1，type 默认为 block。
 *
 * 使用方式：
 * @example
 * <template>
 *  <div v-ellipsis="{ line: 2, width: 200 }">这是一段需要省略的文字</div>
 * </template>
 * <template>
 *  <div v-ellipsis="{ type: 'block', width: 200 }">这是一段需要省略的文字</div>
 * </template>
 */

import { setStyle, completeSize } from '@/utils'

import type { CustomDirectiveFC } from '@/directives/types'
import type { EllipsisBindingValue } from './types'

/**
 *
 * @param el 待绑定的元素
 * @param options 配置项
 *
 * @description
 * 绑定省略样式。
 *
 * @example
 * bindEllipsis(el, { line: 2, width: 200 })
 */
const bindEllipsis = (el: HTMLElement, options: EllipsisBindingValue) => {
  const { line = 1, type = 'block', width, popoverText } = options

  if (width === void 0 || width === null) {
    console.error(
      `[v-ellipsis]: Expected width is string or number, but got typeof ${width}!`,
    )

    return
  }

  if (popoverText && el.textContent) {
    el.setAttribute('title', el.textContent)
  }

  if (type === 'line') {
    setStyle(el, {
      display: '-webkit-box',
      '-webkit-box-orient': 'vertical',
      '-webkit-line-clamp': line,
      overflow: 'hidden',
      width: completeSize(width),
    })
  } else {
    setStyle(el, {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      width: completeSize(width),
    })
  }
}

const ellipsisDirective: CustomDirectiveFC<
  HTMLElement,
  EllipsisBindingValue
> = () => {
  return {
    mounted: (el, { value }) => {
      bindEllipsis(el, value)
    },
    updated: (el, { value }) => {
      bindEllipsis(el, value)
    },
  }
}

export default ellipsisDirective
