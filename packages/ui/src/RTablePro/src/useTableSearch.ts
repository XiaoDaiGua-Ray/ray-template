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

  const reset = () => {
    cancelPending()
    draft.value = initialSearchValues(fields(), options())
    restoreValidation()

    return commit(draft.value, 'reset')
  }

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
