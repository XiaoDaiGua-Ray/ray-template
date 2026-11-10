import { getPersonList } from '@/api/demo/mock/person'
import type { PersonListParams } from '@/api/demo/mock/person'
import { useI18n } from '@/hooks/template/useI18n'
import { RTablePro } from '@ray-template/ui/table-pro'
import type { TableProInst } from '@ray-template/ui/table-pro'
import { NButton, NTag } from 'naive-ui'
import type { DataTableSortState } from 'naive-ui'
import { createPeopleColumns } from './people'

export default defineComponent({
  name: 'TableDemoRemote',
  setup() {
    const { t } = useI18n('table')
    const table = shallowRef<TableProInst>()
    const checked = ref<(string | number)[]>([])
    const columns = computed(() => [
      { type: 'selection' as const, width: 44 },
      ...createPeopleColumns(t).map((column) =>
        'key' in column && column.key === 'age'
          ? { ...column, sorter: true }
          : column,
      ),
    ])
    const params = shallowRef<PersonListParams>({})
    const updateSorter = (
      sorter: DataTableSortState | DataTableSortState[] | null,
    ) => {
      const state = Array.isArray(sorter) ? sorter[0] : sorter

      params.value = {
        sortAge:
          state?.columnKey === 'age' && state.order ? state.order : void 0,
      }
    }
    let failNext = false
    const request: typeof getPersonList = (params, signal) => {
      if (failNext) {
        failNext = false

        return Promise.reject(new Error(t('demoFailure')))
      }

      return getPersonList(params, signal)
    }

    return () => (
      <RTablePro
        ref={table}
        title={t('directory')}
        columns={columns.value}
        v-model:checkedRowKeys={checked.value}
        allowCheckingNotLoaded
        request={request}
        params={params.value}
        onUpdateSorter={updateSorter}
        columnStateKey="demo:remote"
        search={[
          { key: 'name', label: t('name'), placeholder: t('nameHint') },
          { key: 'email', label: t('email'), placeholder: t('emailHint') },
        ]}
        scrollX={944}
        downloadCsvTableOptions={{ fileName: 'people' }}
      >
        {{
          toolbar: () => (
            <>
              <NTag size="small" bordered={false} type="info">
                {t('httpSource')}
              </NTag>
              {checked.value.length ? (
                <NButton
                  text
                  onClick={() => {
                    checked.value = []
                  }}
                >
                  {t('clearSelection', { count: checked.value.length })}
                </NButton>
              ) : null}
              <NButton
                size="small"
                quaternary
                onClick={() => {
                  failNext = true
                  void table.value?.reload()
                }}
              >
                {t('demoFailure')}
              </NButton>
            </>
          ),
        }}
      </RTablePro>
    )
  },
})
