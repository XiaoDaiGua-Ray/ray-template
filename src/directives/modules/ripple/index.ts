import './index.scss'
import type { CustomDirectiveFC } from '@/directives/types'
import type { RippleElement, RippleValue } from './types'
import { isRippleEnabled, removeListeners, updateRipple } from './utils'

const copyDirective: CustomDirectiveFC<RippleElement, RippleValue> = () => {
  return {
    mounted: (el, binding) => {
      updateRipple(el, binding, false)
    },
    beforeUnmount: (el) => {
      delete el.__d_ripple__

      removeListeners(el)
    },
    updated: (el, binding) => {
      if (binding.value === binding.oldValue) {
        return
      }

      const wasEnabled = isRippleEnabled(binding.oldValue)

      updateRipple(el, binding, wasEnabled)
    },
  }
}

export default copyDirective
