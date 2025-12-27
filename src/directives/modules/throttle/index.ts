/**
 *
 * directive name: throttle
 *
 * @description
 * 该指令用于处理节流，使用的时候必须传递正确的 func 值。
 *
 * 其中 trigger 和 wait 是可选的，trigger 默认为 click，wait 默认为 500。
 *
 * @example
 * <template>
 *  <div v-throttle="{ func: () => console.log('throttle') }">这是一个节流指令</div>
 * </template>
 * <template>
 *  <div v-throttle="{ func: () => console.log('throttle'), trigger: 'click', wait: 500 }">这是一个节流指令</div>
 * </template>
 */

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
