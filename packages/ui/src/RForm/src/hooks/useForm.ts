import type { Recordable } from '@ray-template/utils/types'
import { cloneDeep } from 'lodash-es'
import type { Ref } from 'vue'
import { onScopeDispose, ref, shallowRef } from 'vue'
import type {
  FormValidateCallback,
  RFormInst,
  RFormRules,
  ShouldRuleBeApplied,
} from '../types'

/**
 *
 * @param model 初始模型或每次创建模型的工厂
 * @param rules 校验规则或每次创建规则的工厂
 *
 * @description
 * 管理表单模型、规则与实例方法。对象输入深拷贝，工厂自行保证返回独立对象；
 * 实例操作必须先通过 RForm 的 onRegister 绑定注册函数。
 *
 * @returns 注册函数、响应式模型与表单操作方法
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

  /**
   *
   * @param inst 挂载后的 Naive UI 表单实例
   *
   * @description
   * 注册表单，并在所属组件卸载时清理同一实例的引用。
   */
  const register = (inst: RFormInst) => {
    if (inst) {
      formRef.value = inst
      onScopeDispose(() => {
        if (formRef.value === inst) formRef.value = void 0
      }, true)
    }
  }

  /**
   *
   * @description
   * 读取已注册且仍挂载的表单。
   *
   * @returns 当前表单实例
   * @throws 未注册或表单已卸载时抛错
   */
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
   * 为当前 Hook 建立初始模型；对象输入深拷贝，工厂结果直接使用。
   */
  const initialFormModel = () => {
    if (typeof model === 'function') {
      formModelRef.value = model() ?? ({} as T)
    } else {
      formModelRef.value = cloneDeep(model) ?? ({} as T)
    }
  }

  /**
   *
   * @param callback 校验完成回调
   * @param shouldRuleBeApplied 选择本次需要执行的规则
   *
   * @description
   * 验证表单，Promise rejection 的返回值类型是 FormValidationError[]。
   *
   * @returns Naive UI 校验 Promise
   * @throws 尚未注册时抛错，校验失败时 Promise 拒绝
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
   * @throws 尚未注册或表单已卸载时抛错
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
   *
   * @returns 工厂返回的规则或初始化规则的深拷贝，未配置时为空对象
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
   * @description
   * 重置表单的值，依赖 useForm 传入的初始化值。
   * 该方法会将初始化传入的值视为整个表单的初始化绑定值。
   *
   * 但是，对于复杂的动态值，也就是在实现业务中额外的对象值，需要手动进行初始化操作。
   * 所以，最佳的实践应该是初始化 useForm 方法的时候，就应该确定好初始化值。
   * 然后，在需要重置表单的时候，直接调用该方法即可。
   */
  const reset = <Values extends Partial<T> = Partial<T>>(values?: Values) => {
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
   * @returns 匹配规则的校验 Promise
   * @throws key 为空、实例不可用时抛错，校验失败时 Promise 拒绝
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
   * @param values 需要浅合并到当前模型的字段，不修改初始模型
   *
   * @description
   * 更新当前模型，保留对象引用和未提供的字段。
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
  const updateFormCondition = (values: Partial<T>) => {
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
