import { completeSize, setStyle } from '@ray-template/composables/element'
import type { CustomDirectiveFC } from '../../types'
import type { EllipsisBindingValue } from './types'

/**
 *
 * @param el 待设置省略样式的元素
 * @param options 宽度、行数、渲染方式与悬浮文本选项
 *
 * @description
 * 根据绑定值设置文本省略样式；缺少 width 时记录错误，不写入样式。
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
