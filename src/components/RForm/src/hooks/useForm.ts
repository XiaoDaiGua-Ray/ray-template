import { cloneDeep } from 'lodash-es'

import type {
  RFormInst,
  FormValidateCallback,
  ShouldRuleBeApplied,
  RFormRules,
} from '../types'
import type { Recordable } from '@/types'

/**
 *
 * @description
 * 获取 RForm 实例。
 * 让你能够便捷的调用相关的一些已封装方法。
 *
 * @warning
 * 值得注意的是，必须手动调用 register 方法，否则不能正常使用。
 * 在使用 相关 hooks 的时候，需要注意生命周期，确保 register 方法已经被调用与表格实例已经被初始化；
 * 不要在父组件 create 阶段就去调用 hook，如果需要，请使用 nextTick 包裹。
 *
 * @example
 * defineComponent({
 *   setup() {
 *     const [register, { ...Hooks }] = useForm()
 *
 *     return {
 *      register,
 *      ...Hooks,
 *     }
 *   },
 *   render() {
 *     const { register, ...Hooks } = this
 *
 *     return <RForm onRegister={register} />
 *   },
 * })
 */
const useForm = <T extends Recordable, R extends RFormRules>(
  model?: T,
  rules?: R,
) => {
  const formRef = ref<RFormInst>()

  const register = (inst: RFormInst) => {
    if (inst) {
      formRef.value = inst
    }
  }

  const getFormInstance = () => {
    if (!formRef.value) {
      throw new Error(
        '[useForm]: form instance is not ready yet. if you are using useForm, please make sure you have called register method in onRegister event.',
      )
    }

    return formRef.value
  }

  /**
   *
   * @description
   * 验证表单，Promise rejection 的返回值类型是 FormValidationError[]。
   *
   * @see https://www.naiveui.com/zh-CN/dark/components/form#inline.vue
   */
  const validate = (
    callback?: FormValidateCallback,
    shouldRuleBeApplied?: ShouldRuleBeApplied,
  ) => getFormInstance().validate.call(null, callback, shouldRuleBeApplied)

  /**
   *
   * @description
   * 还原表单到未验证状态。
   *
   * @see https://www.naiveui.com/zh-CN/dark/components/form#Form-Methods
   */
  const restoreValidation = () => getFormInstance().restoreValidation.call(null)

  /**
   *
   * @description
   * 获取表项中收集到的值的对象。
   *
   * 调用该方法时，需要确保初始化 useForm 方法的时候传入了 model，否则可能有意想不到的问题发生。
   */
  const formModel = () => cloneDeep(model) || ({} as T)

  /**
   *
   * @description
   * 获取验证表单项的规则。
   *
   * 调用该方法时，需要确保初始化 useForm 方法的时候传入了 rules，否则可能有意想不到的问题发生。
   */
  const formRules = () => cloneDeep(rules) || ({} as R)

  return [
    register,
    {
      getFormInstance,
      validate,
      restoreValidation,
      formModel,
      formRules,
    },
  ] as const
}

export type UseFormReturn = ReturnType<typeof useForm>

export default useForm
