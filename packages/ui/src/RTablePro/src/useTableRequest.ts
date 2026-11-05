import { cloneDeep, isEqual } from 'lodash-es'
import { computed, onBeforeUnmount, ref, shallowRef } from 'vue'
import type {
  TableProParams,
  TableProQueryState,
  TableProRequest,
  TableProResult,
} from './types'

type RequestScope = { request: TableProRequest; filters: TableProParams }
type Paging = { page: number; pageSize: number }

export function useTableRequest({
  request,
  filters,
  paging,
  updatePage,
  reportError,
}: {
  request: () => TableProRequest | undefined
  filters: () => TableProParams
  paging: () => Paging | undefined
  updatePage: (page: number) => void
  reportError: (error: unknown) => void
}) {
  const phase = ref<'idle' | 'loading' | 'failed'>('idle')
  const result = shallowRef<{
    scope: RequestScope
    paging: Paging | undefined
    response: TableProResult
  }>()
  const scope = computed<RequestScope | undefined>((previous) => {
    const load = request()

    if (!load) return

    const values = filters()

    delete values.page
    delete values.pageSize

    return previous?.request === load && isEqual(previous.filters, values)
      ? previous
      : { request: load, filters: cloneDeep(values) }
  })

  const scopedResult = computed(() =>
    result.value?.scope === scope.value ? result.value : void 0,
  )
  const activeResult = computed(() => {
    const current = scopedResult.value

    return current && isEqual(current.paging, paging())
      ? current.response
      : void 0
  })
  const total = computed(() => scopedResult.value?.response.total ?? null)
  const state = computed<TableProQueryState | null>(() => {
    if (!request()) return null

    const currentPage = paging()

    return Object.freeze({
      loading: phase.value === 'loading',
      failed: phase.value === 'failed',
      page: currentPage?.page ?? null,
      pageSize: currentPage?.pageSize ?? null,
      total: total.value,
    })
  })
  let pending: AbortController | undefined

  const reload = async () => {
    pending?.abort()
    const currentScope = scope.value

    // 总数可以跨页复用；请求源或筛选范围改变时，之前的结果全部失效。
    if (result.value?.scope !== currentScope) result.value = void 0

    if (!currentScope) {
      pending = void 0
      phase.value = 'idle'

      return
    }

    const currentPaging = paging()
    const current = new AbortController()
    const isCurrent = () =>
      !current.signal.aborted &&
      currentScope === scope.value &&
      isEqual(currentPaging, paging())

    pending = current
    phase.value = 'loading'

    try {
      const response = await currentScope.request(
        cloneDeep({ ...currentScope.filters, ...currentPaging }),
        current.signal,
      )

      if (!isCurrent()) return

      if (
        !Array.isArray(response.data) ||
        !Number.isSafeInteger(response.total) ||
        response.total < 0
      ) {
        throw new TypeError(
          '[RTablePro] Expected { data: Row[], total: number }.',
        )
      }

      if (currentPaging) {
        const lastPage = Math.max(
          1,
          Math.ceil(response.total / currentPaging.pageSize),
        )

        if (currentPaging.page > lastPage) {
          updatePage(lastPage)

          if (response.total) {
            await reload()

            return
          }
        }
      }

      result.value = { scope: currentScope, paging: paging(), response }
    } catch (error) {
      if (!isCurrent()) return

      result.value = void 0
      phase.value = 'failed'
      reportError(error)
    } finally {
      if (pending === current) {
        pending = void 0

        if (phase.value === 'loading') phase.value = 'idle'
      }
    }
  }

  onBeforeUnmount(() => {
    pending?.abort()
    pending = void 0
  })

  return { reload, activeResult, total, phase, state }
}
