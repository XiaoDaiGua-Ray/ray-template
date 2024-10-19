import { NForm } from 'naive-ui'

import props from './props'
import { call } from '@/utils'
import { useTemplateRef } from 'vue'

import type { RFormInst } from './types'
import type { FormProps } from 'naive-ui'

export default defineComponent({
  name: 'RForm',
  props,
  setup(props, { expose }) {
    const formRef = useTemplateRef<RFormInst>('formRef')

    onMounted(() => {
      // 主动调用 register 方法，满足 useForm 方法正常调用
      const { onRegister } = props

      if (onRegister && formRef.value) {
        call(onRegister, formRef.value)
      }
    })

    expose()

    return {
      formRef,
    }
  },
  render() {
    const { $attrs, $props, $slots } = this

    return (
      <NForm {...$attrs} {...($props as FormProps)} ref="formRef">
        {{
          ...$slots,
        }}
      </NForm>
    )
  },
})
