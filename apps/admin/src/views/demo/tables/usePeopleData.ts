import { getPersonList } from '@/api/demo/mock/person'
import type { Person, PersonListParams } from '@/api/demo/mock/person'
import { useI18n } from '@/hooks'

export function usePeopleData(
  query: () => PersonListParams = () => ({ page: 1, pageSize: 100 }),
) {
  const data = shallowRef<Person[]>([])
  const total = ref(0)
  const loading = ref(false)
  const { t } = useI18n('tableHooks.queryPhase')
  let controller: AbortController | undefined
  const load = async () => {
    controller?.abort()
    const active = new AbortController()

    controller = active
    data.value = []
    total.value = 0
    loading.value = true

    try {
      const result = await getPersonList(query(), active.signal)

      if (!active.signal.aborted) {
        data.value = result.data
        total.value = result.total
      }
    } catch {
      if (!active.signal.aborted) window.$message?.error(t('failed'))
    } finally {
      if (!active.signal.aborted) loading.value = false
    }
  }

  watch(query, load, { immediate: true, deep: true })
  onScopeDispose(() => controller?.abort())

  return { data, total, loading, reload: load }
}
