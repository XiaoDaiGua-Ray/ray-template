import type { CustomDirectiveFC } from '@/directives/types'
import type { AnyFn } from '@/types'
import { useEventListener } from '@vueuse/core'
import { debounce } from 'lodash-es'
import type { DebouncedFunc } from 'lodash-es'
import type { DebounceBindingOptions } from './types'

const debounceDirective: CustomDirectiveFC<
  HTMLElement,
  DebounceBindingOptions
> = () => {
  let debounceFunction: DebouncedFunc<AnyFn> | null
  let cleanup: () => void

  return {
    beforeMount: (el, { value }) => {
      const { func, trigger = 'click', wait = 500, options } = value

      if (typeof func !== 'function') {
        throw new TypeError('debounce directive value must be a function')
      }

      debounceFunction = debounce(func, wait, Object.assign({}, options))

      cleanup = useEventListener(el, trigger, debounceFunction)
    },
    beforeUnmount: (el, { value }) => {
      const { trigger = 'click' } = value

      if (debounceFunction) {
        debounceFunction.cancel()
        cleanup?.()
      }

      debounceFunction = null
    },
  }
}

export default debounceDirective
