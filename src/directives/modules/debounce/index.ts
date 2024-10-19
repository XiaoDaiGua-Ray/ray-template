/**
 *
 * directive name: debounce
 *
 * @description
 *
 * 该指令用于处理防抖，使用的时候必须传递正确的 func 值。
 *
 * 其中 trigger 和 wait 是可选的，trigger 默认为 click，wait 默认为 500。
 *
 * @example
 * <template>
 *  <div v-debounce="{ func: () => console.log('debounce') }">这是一个防抖指令</div>
 * </template>
 * <template>
 *  <div v-debounce="{ func: () => console.log('debounce'), trigger: 'click', wait: 500 }">这是一个防抖指令</div>
 * </template>
 */

import { debounce } from 'lodash-es'
import { useEventListener } from '@vueuse/core'

import type { DebounceBindingOptions } from './types'
import type { AnyFC } from '@/types'
import type { DebouncedFunc } from 'lodash-es'
import type { CustomDirectiveFC } from '@/directives/types'

const debounceDirective: CustomDirectiveFC<
  HTMLElement,
  DebounceBindingOptions
> = () => {
  let debounceFunction: DebouncedFunc<AnyFC> | null
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
