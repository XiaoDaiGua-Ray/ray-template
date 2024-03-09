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
 *
 * 该指令用于处理节流，使用的时候必须传递正确的 func 值。
 *
 * 其中 trigger 和 wait 是可选的，trigger 默认为 click，wait 默认为 500。
 *
 * 使用方式：
 * @example
 * <template>
 *  <div v-throttle="{ func: () => console.log('throttle') }">这是一个节流指令</div>
 * </template>
 * <template>
 *  <div v-throttle="{ func: () => console.log('throttle'), trigger: 'click', wait: 500 }">这是一个节流指令</div>
 * </template>
 */

import { throttle } from 'lodash-es'
import { useEventListener } from '@vueuse/core'

import type { ThrottleBindingOptions } from './types'
import type { AnyFC } from '@/types'
import type { DebouncedFunc } from 'lodash-es'
import type { CustomDirectiveFC } from '@/directives/types'

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
