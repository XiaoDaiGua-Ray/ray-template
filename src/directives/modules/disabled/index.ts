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

import { setClass, removeClass } from '@/utils'

import type { CustomDirectiveFC } from '@/directives/type'

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
