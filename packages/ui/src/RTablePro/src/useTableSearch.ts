import { computed, onScopeDispose, shallowRef, watch } from 'vue'
import {
  copySearchValues,
  createSearchDependencies,
  initialSearchValues,
  patchSearchValues,
  pickSearchValues,
} from './search'
import type {
  TableProSearchFieldConfig,
  TableProSearchOptions,
  TableProSearchSubmission,
  TableProSearchValues,
} from './types'

/**
 *
 * @param fields 当前搜索字段的读取器
 * @param options 当前搜索配置的读取器
 * @param validate 支持查询是否仍有效的校验函数
 * @param restoreValidation 清除界面校验反馈
 * @param reportError 报告转换或提交异常并返回失败状态
 * @param commit 提交已确认的草稿快照
 *
 * @description
 * 持有搜索草稿、字段依赖及防抖计时器；编辑或卸载会使旧校验和延迟提交失效。
 *
 * @returns 草稿状态与读取、修改、提交、重置和字段协调方法
 */
export function useTableSearch(
  fields: () => readonly TableProSearchFieldConfig[],
  options: () => TableProSearchOptions | undefined,
  validate: (isCurrent: () => boolean) => true | Promise<boolean>,
  restoreValidation: () => void,
  reportError: (error: unknown) => false,
  commit: (
    values: TableProSearchValues,
    reason: TableProSearchSubmission['reason'],
  ) => Promise<boolean>,
) {
  const draft = shallowRef<TableProSearchValues>(
    initialSearchValues(fields(), options()),
  )
  const dependents = computed(() => createSearchDependencies(fields()))
  let revision = 0
  let timer: ReturnType<typeof setTimeout> | undefined

  const cancelPending = () => {
    clearTimeout(timer)
    revision += 1
  }

  watch(
    () => options()?.submitMode,
    (mode) => {
      if (mode !== 'change') cancelPending()
    },
  )

  /**
   *
   * @description
   * 校验当前草稿快照，期间有新编辑时放弃旧提交。
   *
   * @returns 当前快照是否成功提交
   */
  const submit = async () => {
    cancelPending()
    const current = revision
    const values = draft.value
    const isCurrent = () => current === revision

    try {
      const validation = validate(isCurrent)

      if (validation !== true && !(await validation)) return false

      return isCurrent() ? await commit(values, 'submit') : false
    } catch (error) {
      return isCurrent() ? reportError(error) : false
    }
  }

  /**
   *
   * @param values 本次更新的字段值
   *
   * @description
   * 清理类型不匹配的值、重置依赖字段，并按配置安排防抖提交；等值更新保持引用不变。
   */
  const setValues = (values: TableProSearchValues) => {
    const next = patchSearchValues(
      fields(),
      draft.value,
      values,
      dependents.value,
    )

    if (next === draft.value) return

    cancelPending()
    draft.value = next

    if (options()?.submitMode === 'change') {
      timer = setTimeout(() => void submit(), options()?.debounce ?? 300)
    }
  }

  /**
   *
   * @description
   * 取消待执行提交、恢复初始草稿并清除校验，随后提交重置后的快照。
   *
   * @returns 提交函数的结果
   */
  const reset = () => {
    cancelPending()
    draft.value = initialSearchValues(fields(), options())
    restoreValidation()

    return commit(draft.value, 'reset')
  }

  /**
   *
   * @param retainedKeys 字段定义变化后允许保留草稿的键
   *
   * @description
   * 取消旧校验与计时器，按最新字段定义补入默认值并移除失效字段。
   */
  const reconcile = (retainedKeys: ReadonlySet<string>) => {
    cancelPending()
    const defaults = initialSearchValues(fields(), options())
    const retained = Object.fromEntries(
      Object.entries(draft.value).filter(([key]) => retainedKeys.has(key)),
    )

    draft.value = pickSearchValues(fields(), { ...defaults, ...retained })
  }

  onScopeDispose(cancelPending)

  return {
    draft,
    getValues: () => copySearchValues(draft.value),
    setValues,
    submit,
    reset,
    reconcile,
  }
}
