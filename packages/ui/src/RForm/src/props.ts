import type { AnyFn, MaybeArray } from '@ray-template/utils/types'
import { formProps } from 'naive-ui'
import type { PropType } from 'vue'
import type { RFormInst } from './types'

const props = {
  ...formProps,
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
   * 支持动态切换；仅处理单行输入，保留输入法确认、多行换行、组合框与按钮的原生行为。
   * 校验或提交仍在进行时忽略重复 Enter，loading 时不触发。
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
