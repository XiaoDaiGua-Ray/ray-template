/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-06-24
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/**
 *
 * directive name: throttle
 */

import { throttle } from 'lodash-es'
import { on, off } from '@use-utils/element'

import type { Directive } from 'vue'
import type { ThrottleBindingOptions } from './type'

let throttleFunction: AnyFunc | null

const throttleDirective: Directive<HTMLElement, ThrottleBindingOptions> = {
  beforeMount: (el, binding) => {
    const { func, trigger = 'click', wait = 500, options } = binding.value

    if (typeof func !== 'function') {
      throw new Error('throttle directive value must be a function')
    }

    throttleFunction = throttle(func, wait, Object.assign({}, {}, options))

    on(el, trigger, throttleFunction)
  },
  beforeUnmount: (el, binding) => {
    const { trigger = 'click' } = binding.value

    if (throttleFunction) {
      off(el, trigger, throttleFunction)
    }

    throttleFunction = null
  },
}

export default throttleDirective
