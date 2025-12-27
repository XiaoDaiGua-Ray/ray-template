import { call, unrefElement } from '@/utils'
import { useEventListener } from '@vueuse/core'
import { NForm, NSpin } from 'naive-ui'
import { useTemplateRef } from 'vue'
import type { ShallowRef } from 'vue'
import props from './props'
import type { RFormInst } from './types'

export default defineComponent({
  name: 'RForm',
  props,
  setup(props, { expose }) {
    const formRef = useTemplateRef<RFormInst>('formRef')
    const currentSubmitFn = computed(() => props.onFinish ?? Promise.resolve)

    const bindKeydownListener = (e: KeyboardEvent) => {
      const keyCode = e.code

      if (keyCode === 'Enter') {
        e.stopPropagation()
        e.preventDefault()

        formRef.value?.validate().then(currentSubmitFn.value)
      }
    }

    if (props.submitWhenEnter) {
      useEventListener(
        formRef as unknown as ShallowRef<HTMLElement>,
        'keydown',
        bindKeydownListener,
        {
          capture: true,
        },
      )
    }

    onMounted(() => {
      // 主动调用 register 方法，满足 useForm 方法正常调用
      const { onRegister } = props

      if (onRegister && formRef.value) {
        call(onRegister, formRef.value)
      }

      if (formRef.value) {
        const formElement = unrefElement(
          formRef.value as unknown as HTMLFormElement,
        )

        if (formElement) {
          formElement.autocomplete = props.autocomplete
        }
      }
    })

    expose()

    return {
      formRef,
    }
  },
  render() {
    const { $attrs, $props, $slots } = this
    const { loading, loadingDescription, ...restProps } = $props

    return (
      <NSpin
        show={loading}
        description={loadingDescription}
        style={{
          height: 'auto',
        }}
      >
        <NForm {...$attrs} {...restProps} ref="formRef">
          {{
            ...$slots,
          }}
        </NForm>
      </NSpin>
    )
  },
})
