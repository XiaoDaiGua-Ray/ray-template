/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-06-26
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/**
 *
 * directive name: disabled
 */

import { addClass, removeClass } from '@/utils/element'

import type { Directive } from 'vue'
import type { CustomDirectiveFC } from '@/directives/type'

const updateElementDisabledType = (el: HTMLElement, value: boolean) => {
  if (el) {
    const classes = 'ray-template__directive--disabled'

    value ? addClass(el, classes) : removeClass(el, classes)
    el?.setAttribute('disabled', value ? 'disabled' : '')
  }
}

const disabledDirective: CustomDirectiveFC<HTMLElement, boolean> = () => {
  return {
    mounted: (el, binding) => {
      const value = binding.value

      updateElementDisabledType(el, value)
    },
    updated: (el, binding) => {
      const value = binding.value

      updateElementDisabledType(el, value)
    },
  }
}
export default disabledDirective
