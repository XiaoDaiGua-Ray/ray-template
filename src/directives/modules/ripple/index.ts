/**
 *
 * directive name: ripple
 *
 * @description
 * 水波纹指令。
 *
 * 使用方式：
 * @example
 * <template>
 *  <button v-ripple>点击查看水波纹效果</button>
 * </template>
 * <template>
 *  <div
 *    style="height: 20px; line-height: 20px;text-align: center; border: 1px solid; padding: 6px;"
 *    v-ripple={[true, ['center']]}
 *  >
 *    原生元素绑定水波纹效果，并且手动绑定 modifiers 为 center
 *  </div>
 * </template>
 *
 * const DemoOne = () => <div v-ripple>hi</div>
 * const DemoTwo = () => <div v-ripple={[true, ['circle']]}>hi</div>
 */

import './index.scss'

import { updateRipple, removeListeners, isRippleEnabled } from './utils'

import type { CustomDirectiveFC } from '@/directives/types'
import type { RippleValue, RippleElement } from './types'

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
