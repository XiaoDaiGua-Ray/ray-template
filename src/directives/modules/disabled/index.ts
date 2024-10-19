/**
 *
 * directive name: disabled
 *
 * @description
 * 该指令用于处理元素的禁用状态，使用的时候必须传递正确的 value 值。
 *
 * 该方法依赖 ray-template__directive--disabled 样式类，需要在全局样式中定义，
 * 并且该指令仅仅是做了 css 样式层面的禁用效果，如果有需要，还需要在业务逻辑中做相应的处理。
 *
 * @example
 * <template>
 *  <button v-disabled="true">这是一个禁用按钮</button>
 * </template>
 */

import { setClass, removeClass } from '@/utils'

import type { CustomDirectiveFC } from '@/directives/types'

const updateElementDisabledType = (el: HTMLElement, value: boolean) => {
  if (el) {
    const classes = 'ray-template__directive--disabled'

    if (value) {
      el.setAttribute('disabled', 'disabled')

      setClass(el, classes)
    } else {
      el.removeAttribute('disabled')

      removeClass(el, classes)
    }

    el?.setAttribute('disabled', value ? 'disabled' : '')
  }
}

const disabledDirective: CustomDirectiveFC<HTMLElement, boolean> = () => {
  return {
    mounted: (el, { value }) => {
      updateElementDisabledType(el, value)
    },
    updated: (el, { value, oldValue }) => {
      if (value === oldValue) {
        return
      }

      updateElementDisabledType(el, value)
    },
  }
}

export default disabledDirective
