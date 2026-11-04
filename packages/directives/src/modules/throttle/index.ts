import { useEventListener } from '@vueuse/core'
import { throttle } from 'lodash-es'
import type { CustomDirectiveFC } from '../../types'
import type { ThrottleBindingOptions } from './types'

const throttleDirective: CustomDirectiveFC<
  HTMLElement,
  ThrottleBindingOptions
> = () => {
  const cleanups = new WeakMap<HTMLElement, () => void>()

  return {
    beforeMount: (el, { value }) => {
      const { func, trigger = 'click', wait = 500, options } = value

      if (typeof func !== 'function') {
        throw new TypeError('throttle directive value must be a function')
      }

      const handler = throttle(func, wait, options)
      const stop = useEventListener(el, trigger, handler)

      cleanups.set(el, () => {
        handler.cancel()
        stop()
      })
    },
    beforeUnmount(el) {
      cleanups.get(el)?.()
      cleanups.delete(el)
    },
  }
}

export default throttleDirective
