import { getPersonList } from '@/api/demo/mock/person'
import type { PersonListParams } from '@/api/demo/mock/person'
import { RTablePro, useTablePro } from '@/components'
import { useI18n } from '@/hooks/template/useI18n'
import {
  NButton,
  NCard,
  NFlex,
  NInput,
  NStatistic,
  NTag,
  NText,
} from 'naive-ui'
import { useId } from 'vue'
import DemoPage from '../components/DemoPage'
import { createPeopleColumns } from './people'

const statusColors = {
  idle: 'default',
  loading: 'info',
  failed: 'error',
  loaded: 'success',
} as const

export default defineComponent({
  name: 'TableDemoHooksQuery',
  setup() {
    const { t } = useI18n()
    const [register, { isReady, queryState, reload, setPage, setPageSize }] =
      useTablePro()
    const inputId = useId()
    const nameDraft = ref('')
    const params = shallowRef<PersonListParams>({})
    const lastRequest = shallowRef<PersonListParams>({})
    const attempts = ref(0)
    const columns = computed(() =>
      createPeopleColumns((key) => t(`table.${key}`)).slice(0, 4),
    )
    const phase = computed(() => {
      if (queryState.value?.loading) return 'loading'

      if (queryState.value?.failed) return 'failed'

      return queryState.value?.total != null ? 'loaded' : 'idle'
    })

    let failNext = false
    const request = async (query: PersonListParams, signal: AbortSignal) => {
      const shouldFail = failNext

      failNext = false
      attempts.value += 1
      lastRequest.value = query

      // 给演示请求留出可见的加载时间，切页时连同延时一起取消。
      await new Promise<void>((resolve, reject) => {
        signal.throwIfAborted()
        const onAbort = () => {
          clearTimeout(timer)
          reject(signal.reason)
        }
        const timer = setTimeout(() => {
          signal.removeEventListener('abort', onAbort)
          resolve()
        }, 650)

        signal.addEventListener('abort', onAbort, { once: true })
      })

      if (shouldFail) throw new Error(t('table.demoFailure'))

      return getPersonList(query, signal)
    }

    const applyName = (value: string) => {
      if (!isReady.value) return

      const name = value.trim() || void 0

      if (name === params.value.name) {
        void reload(true)
      } else {
        // params 变化已经会回到第一页请求，避免再手动刷新一次。
        params.value = { name }
      }
    }

    return () => (
      <DemoPage
        title={t('menu.TableHooksQuery')}
        description={t('tableHooks.queryDescription')}
      >
        <NCard>
          <NFlex vertical>
            <form
              class="r-table-search"
              onSubmit={(event) => {
                event.preventDefault()
                applyName(nameDraft.value)
              }}
            >
              <div class="r-table-search__field">
                <label for={inputId}>{t('table.name')}</label>
                <NInput
                  inputProps={{ id: inputId, name: 'name' }}
                  v-model:value={nameDraft.value}
                  placeholder={t('table.nameHint')}
                />
              </div>
              <div class="r-table-search__actions">
                <NButton
                  attrType="submit"
                  type="primary"
                  disabled={!isReady.value}
                >
                  {t('table.search')}
                </NButton>
                <NButton
                  disabled={!isReady.value}
                  onClick={() => {
                    nameDraft.value = ''
                    applyName('')
                  }}
                >
                  {t('table.reset')}
                </NButton>
              </div>
            </form>
            <NFlex>
              <NButton disabled={!isReady.value} onClick={() => reload()}>
                {t('tableHooks.reloadPage')}
              </NButton>
              <NButton disabled={!isReady.value} onClick={() => reload(true)}>
                {t('tableHooks.reloadFirstPage')}
              </NButton>
              <NButton disabled={!isReady.value} onClick={() => setPage(2)}>
                {t('tableHooks.secondPage')}
              </NButton>
              <NButton
                disabled={!isReady.value}
                onClick={() => setPageSize(20)}
              >
                {t('table.twentyRows')}
              </NButton>
              <NButton
                disabled={!isReady.value || queryState.value?.loading}
                onClick={() => {
                  failNext = true
                  void reload()
                }}
              >
                {t('table.demoFailure')}
              </NButton>
            </NFlex>
          </NFlex>
        </NCard>
        <NCard title={t('tableHooks.queryStatus')}>
          {{
            'header-extra': () => (
              <NTag
                size="small"
                type={statusColors[phase.value]}
                bordered={false}
              >
                {t(`tableHooks.queryPhase.${phase.value}`)}
              </NTag>
            ),
            default: () => (
              <NFlex vertical size={12}>
                <NFlex size={[24, 12]}>
                  <NStatistic
                    tabularNums
                    label={t('tableHooks.currentPage')}
                    value={queryState.value?.page ?? '—'}
                  />
                  <NStatistic
                    tabularNums
                    label={t('tableHooks.rowsPerPage')}
                    value={queryState.value?.pageSize ?? '—'}
                  />
                  <NStatistic
                    tabularNums
                    label={t('tableHooks.resultTotal')}
                    value={queryState.value?.total ?? '—'}
                  />
                </NFlex>
                <NText depth={3}>
                  {t('tableHooks.lastRequest')}
                  {' · '}
                  {t('tableHooks.requestDetails', {
                    count: attempts.value,
                    page: lastRequest.value.page ?? '—',
                    size: lastRequest.value.pageSize ?? '—',
                    name: lastRequest.value.name ?? '—',
                  })}
                </NText>
              </NFlex>
            ),
          }}
        </NCard>
        <RTablePro
          onRegister={register}
          title={t('table.directory')}
          columns={columns.value}
          request={request}
          params={params.value}
          scrollX={562}
        />
      </DemoPage>
    )
  },
})
