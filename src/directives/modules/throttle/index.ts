import type { CustomDirectiveFC } from '@/directives/types'
import type { AnyFn } from '@/types'
import { useEventListener } from '@vueuse/core'
import { throttle } from 'lodash-es'
import type { DebouncedFunc } from 'lodash-es'
import type { ThrottleBindingOptions } from './types'

const throttleDirective: CustomDirectiveFC<
  HTMLElement,
  ThrottleBindingOptions
> = () => {
  let throttleFunction: DebouncedFunc<AnyFn> | null
  let cleanup: () => void

  return {
    beforeMount: (el, { value }) => {
      const { func, trigger = 'click', wait = 500, options } = value

      if (typeof func !== 'function') {
        throw new TypeError('throttle directive value must be a function')
      }

      throttleFunction = throttle(func, wait, Object.assign({}, options))

      cleanup = useEventListener(el, trigger, throttleFunction)
    },
    beforeUnmount: () => {
      if (throttleFunction) {
        throttleFunction.cancel()
      }

      throttleFunction = null

      cleanup?.()
    },
  }
}

export default throttleDirective
