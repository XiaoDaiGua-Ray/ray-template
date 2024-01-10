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
import { useEventListener } from '@vueuse/core'

import type { ThrottleBindingOptions } from './type'
import type { AnyFC } from '@/types'
import type { DebouncedFunc } from 'lodash-es'
import type { CustomDirectiveFC } from '@/directives/type'

const throttleDirective: CustomDirectiveFC<
  HTMLElement,
  ThrottleBindingOptions
> = () => {
  let throttleFunction: DebouncedFunc<AnyFC> | null
  let cleanup: () => void

  return {
    beforeMount: (el, { value }) => {
      const { func, trigger = 'click', wait = 500, options } = value

      if (typeof func !== 'function') {
        throw new TypeError('throttle directive value must be a function')
      }

      throttleFunction = throttle(func, wait, Object.assign({}, options))

      useEventListener(el, trigger, throttleFunction)
    },
    beforeUnmount: () => {
      if (throttleFunction) {
        throttleFunction.cancel()
        cleanup?.()
      }

      throttleFunction = null
    },
  }
}

export default throttleDirective
