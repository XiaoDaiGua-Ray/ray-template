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
const useForm = <
  T extends Recordable = Recordable,
  R extends RFormRules = RFormRules,
>(
  model?: T | (() => T),
  rules?: R | (() => R),
) => {
  const formRef = shallowRef<RFormInst>()
  const formModelRef = ref<T>()

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

  // 初始化 formModelRef 的值，根据 model 的类型进行初始化
  const initialFormModel = () => {
    if (typeof model === 'function') {
      formModelRef.value = model() ?? ({} as T)
    } else {
      formModelRef.value = cloneDeep(model) ?? ({} as T)
    }
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
   * 调用该方法时，需要确保初始化 useForm 方法的时候传入了 model，否则可能有意想不到的问题发生。
   *
   * 该方法可以实现重置表单的需求，因为在 vue 的设计理念中，表单的值绑定是直接绑定在每个组件上，
   * 而不是利用 Form 表单机制，所以需要这么去做表单的初始化操作维护机制。
   *
   * 在 5.2.2 版本中，新增了 formConditionRef 属性，现在可以解构获取一个 ref 包裹的响应式初始化表单对象值；
   * 这样就可以直接在 hook 中调用一个响应式的表单对象值。
   *
   * @example
   *
   * interface FormModel {
   *  name: string | null
   *  age: number | null
   * }
   *
   * const [register, { formModel }] = useForm<FormModel>({
   *  name: null,
   *  age: null,
   * })
   *
   * const formModelRef = ref(formModel())
   *
   * const reset = () => {
   *  formModelRef.value = formModel()
   * }
   */
  const formModel = (): T & Recordable => {
    if (typeof model === 'function') {
      return model()
    }

    return cloneDeep(model) || ({} as T)
  }

  /**
   *
   * @description
   * 获取验证表单项的规则。
   *
   * 调用该方法时，需要确保初始化 useForm 方法的时候传入了 rules，否则可能有意想不到的问题发生。
   */
  const formRules = () => {
    if (typeof rules === 'function') {
      return rules()
    }

    return cloneDeep(rules) || ({} as R)
  }

  /**
   *
   * @param values 需要重置的表单值，该参数会覆盖初始化值
   *
   * @warning
   * 请注意初始化值的问题，如果设置初始化值为 undefined，
   * 则会导致 reset 初始化操作失败，必须使用 null 作为初始化的空值。
   *
   * @description
   * 重置表单的值，依赖 useForm 传入的初始化值。
   * 该方法会将初始化传入的值视为整个表单的初始化绑定值。
   *
   * 但是，对于复杂的动态值，也就是在实现业务中额外的对象值，需要手动进行初始化操作。
   * 所以，最佳的实践应该是初始化 useForm 方法的时候，就应该确定好初始化值。
   * 然后，在需要重置表单的时候，直接调用该方法即可。
   */
  const reset = <Values extends T = T>(values?: Values & Recordable) => {
    formModelRef.value = Object.assign(
      formModelRef.value as T,
      formModel(),
      values,
    )
    restoreValidation()
  }

  /**
   *
   * @param key 需要验证的表单项的 key
   *
   * @see https://www.naiveui.com/zh-CN/dark/components/form#partially-apply-rules.vue
   *
   * @description
   * 验证表单项的规则。
   *
   * 注意，该方法想要正常运转，需要在定义 rules 时定义唯一 key；
   * 否则，该逻辑执行会失败。
   *
   * @example
   * const [register, { validateTargetField }] = useForm(
   *  {
   *    name: null,
   *  },
   *  {
   *    name: {
   *      required: true,
   *      message: 'name is required',
   *      trigger: ['blur', 'change'],
   *      type: 'string',
   *      key: 'name',
   *    },
   *  },
   * )
   *
   * validateTargetField('name')
   */
  const validateTargetField = (key: string) => {
    if (!key || typeof key !== 'string') {
      throw new Error(
        `[useForm-validateTargetField]: except key is string, but got ${typeof key}.`,
      )
    }

    return validate(void 0, (rules) => {
      return rules?.key === key
    })
  }

  /**
   *
   * @description
   * 更新表单的值，该方法会覆盖初始化值。
   * 推荐在表单组件中使用该方法，而不是直接修改表单的值，符合函数式的理念。
   *
   * @example
   * const [register, { updateFormCondition }] = useForm(
   *  {
   *    name: null,
   *  },
   * )
   *
   * updateFormCondition({
   *  name: 'John',
   * })
   */
  const updateFormCondition = (values: T & Recordable) => {
    formModelRef.value = Object.assign(formModelRef.value as T, values)
  }

  initialFormModel()

  return [
    register,
    {
      getFormInstance,
      validate,
      restoreValidation,
      formModel,
      formRules,
      reset,
      validateTargetField,
      formConditionRef: formModelRef as Ref<T>,
      updateFormCondition,
    },
  ] as const
}

export type UseFormReturn = ReturnType<typeof useForm>

export default useForm
