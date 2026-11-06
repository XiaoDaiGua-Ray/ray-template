import { call } from '@ray-template/composables/vue'
import { NForm, NSpin } from 'naive-ui'
import {
  defineComponent,
  onBeforeUnmount,
  onMounted,
  useTemplateRef,
} from 'vue'
import props from './props'
import type { RFormInst } from './types'

export default defineComponent({
  name: 'RForm',
  inheritAttrs: false,
  props,
  setup(props, { expose }) {
    const formRef = useTemplateRef<RFormInst>('formRef')
    let submitting = false
    let disposed = false

    onBeforeUnmount(() => {
      disposed = true
    })

    /**
     *
     * @param event 表单内冒泡的键盘事件
     *
     * @description
     * 仅提交未被输入控件消费的单行 Enter；校验失败保留表单错误，提交异常交给 Vue 错误处理。
     */
    const submitOnEnter = async (event: KeyboardEvent) => {
      if (
        !props.submitWhenEnter ||
        props.loading ||
        submitting ||
        event.defaultPrevented ||
        event.isComposing ||
        event.repeat ||
        event.key !== 'Enter' ||
        event.shiftKey ||
        event.ctrlKey ||
        event.altKey ||
        event.metaKey
      )
        return

      const target = event.target

      // 组合框的 Enter 用于选项确认，多行输入、按钮和可编辑区域保留原生行为。
      if (
        !(target instanceof HTMLInputElement) ||
        ![
          'text',
          'search',
          'email',
          'url',
          'tel',
          'password',
          'number',
        ].includes(target.type) ||
        target.closest('[role="combobox"], [contenteditable="true"]') ||
        !formRef.value
      )
        return

      event.preventDefault()
      submitting = true

      try {
        let validation

        try {
          validation = await formRef.value.validate()
        } catch {
          // Naive UI 已在字段上展示校验错误，键盘事件不再制造未处理的拒绝。
          return
        }

        if (!disposed) await props.onFinish?.(validation)
      } finally {
        submitting = false
      }
    }

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
      submitOnEnter,
    }
  },
  render() {
    const { $attrs, $props, $slots } = this
    const { loading, loadingDescription, autocomplete, ...restProps } = $props

    return (
      <NSpin
        show={loading}
        description={loadingDescription}
        style={{
          height: 'auto',
        }}
      >
        <NForm
          {...$attrs}
          {...restProps}
          {...{ autocomplete, onKeydown: this.submitOnEnter }}
          ref="formRef"
        >
          {{
            ...$slots,
          }}
        </NForm>
      </NSpin>
    )
  },
})
