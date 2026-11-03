import type { AnyFn, MaybeArray } from '@/types'
import { omit } from 'lodash-es'
import { formProps } from 'naive-ui'
import type { RFormInst } from './types'

const props = {
  ...omit(formProps, ['onSubmit']),
  /**
   *
   * @description
   * 表单的加载状态。
   *
   * @default false
   */
  loading: {
    type: Boolean,
    default: false,
  },
  /**
   *
   * @description
   * 表单的加载状态的描述。
   *
   * @default undefined
   */
  loadingDescription: {
    type: String,
    default: void 0,
  },
  /**
   *
   * @description
   * 表单的自动完成功能。
   *
   * @default 'off'
   */
  autocomplete: {
    type: String as PropType<AutoFillBase>,
    default: 'off',
  },
  /**
   *
   * @description
   * 是否在按下回车键时自动触发表单的校验，如果校验成功则会自动触发 onFinish 事件。
   * 该功能需要结合 onFinish 属性使用。
   *
   * 注意，该属性不支持响应式更新，只依赖于初始化传入的值；
   * 因为该方法特性的原因，做响应式的更新意义不大。
   *
   * 并且该属性启用后，会自动的拦截 Enter 键的默认行为；
   * 例如 NSelect, NInput 等官方自带组件的默认快捷键功能，都会被阻止；
   * 但是不得不这么做，以避免一些奇奇怪怪的问题。
   *
   * @default false
   */
  submitWhenEnter: {
    type: Boolean,
    default: false,
  },
  /**
   *
   * @description
   * 表单校验成功后自动触发的事件，该事件的触发时机为 submitWhenEnter 属性为 true 时，按下回车键触发。
   * 该功能需要结合 submitWhenEnter 属性使用。
   *
   * @default null
   */
  onFinish: {
    type: Function as PropType<AnyFn>,
    default: null,
  },
  /**
   *
   * @description
   * RForm 注册挂载成功后触发的事件。
   * 可以结合 useForm 方法中的 register 方法使用，然后便捷的使用 hooks。
   *
   * @default null
   */
  onRegister: {
    type: [Function, Array] as PropType<
      MaybeArray<(formInst: RFormInst) => void>
    >,
    default: null,
  },
} as const

export default props
