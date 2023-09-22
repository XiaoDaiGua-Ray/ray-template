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
 * directive name: debounce
 */

import { debounce } from 'lodash-es'
import { on, off } from '@use-utils/element'

import type { DebounceBindingOptions } from './type'
import type { AnyFC } from '@/types/modules/utils'
import type { DebouncedFunc } from 'lodash-es'
import type { CustomDirectiveFC } from '@/directives/type'

const debounceDirective: CustomDirectiveFC<
  HTMLElement,
  DebounceBindingOptions
> = () => {
  let debounceFunction: DebouncedFunc<AnyFC> | null

  return {
    beforeMount: (el, { value }) => {
      const { func, trigger = 'click', wait = 500, options } = value

      if (typeof func !== 'function') {
        throw new TypeError('debounce directive value must be a function')
      }

      debounceFunction = debounce(func, wait, Object.assign({}, options))

      on(el, trigger, debounceFunction)
    },
    beforeUnmount: (el, { value }) => {
      const { trigger = 'click' } = value

      if (debounceFunction) {
        debounceFunction.cancel()
        off(el, trigger, debounceFunction)
      }

      debounceFunction = null
    },
  }
}

export default debounceDirective
