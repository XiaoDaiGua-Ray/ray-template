import { formProps } from 'naive-ui'

import type { MaybeArray } from '@/types'
import type { RFormInst } from './types'

const props = {
  ...formProps,
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
}

export default props
