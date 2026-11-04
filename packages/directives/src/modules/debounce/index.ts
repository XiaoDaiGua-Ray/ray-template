import { useEventListener } from '@vueuse/core'
import { debounce } from 'lodash-es'
import type { CustomDirectiveFC } from '../../types'
import type { DebounceBindingOptions } from './types'

const debounceDirective: CustomDirectiveFC<
  HTMLElement,
  DebounceBindingOptions
> = () => {
  const cleanups = new WeakMap<HTMLElement, () => void>()

  return {
    beforeMount: (el, { value }) => {
      const { func, trigger = 'click', wait = 500, options } = value

      if (typeof func !== 'function') {
        throw new TypeError('debounce directive value must be a function')
      }

      const handler = debounce(func, wait, options)
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

export default debounceDirective
