/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2024-03-27
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import { NForm } from 'naive-ui'

import props from './props'
import { call } from '@/utils'

import type { RFormInst } from './types'

export default defineComponent({
  name: 'RForm',
  props,
  setup(props) {
    const formRef = ref<RFormInst>()

    onMounted(() => {
      // 主动调用 register 方法，满足 useForm 方法正常调用
      const { onRegister } = props

      if (onRegister && formRef.value) {
        call(onRegister, formRef.value)
      }
    })

    return {
      formRef,
    }
  },
  render() {
    const { $attrs, $props, $slots } = this

    return (
      <NForm {...$attrs} {...$props} ref="formRef">
        {{
          ...$slots,
        }}
      </NForm>
    )
  },
})
