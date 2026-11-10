import { useI18n } from '@/hooks/template/useI18n'
import type { Person } from '@ray-template/api-contracts/demo'
import { RTablePro } from '@ray-template/ui/table-pro'
import { NCheckbox } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { createPeopleColumns } from './people'
import { usePeopleData } from './usePeopleData'

export default defineComponent({
  name: 'TableDemoColumns',
  setup() {
    const { t } = useI18n('table')
    const { data, loading } = usePeopleData()
    const showId = ref(true)
    const columns = computed<DataTableColumns<Person>>(() =>
      [
        { type: 'selection' as const, width: 44 },
        {
          title: t('contactGroup'),
          key: 'contact',
          children: [
            { title: t('name'), key: 'name', width: 120 },
            { title: t('email'), key: 'email', width: 250 },
          ],
        },
        ...createPeopleColumns(t).slice(2),
      ].filter(
        (column) => showId.value || !('key' in column && column.key === 'id'),
      ),
    )

    return () => (
      <RTablePro
        data={data.value}
        loading={loading.value}
        columns={columns.value}
        columnStateKey="demo:columns"
        scrollX={960}
      >
        {{
          title: () => (
            <NCheckbox v-model:checked={showId.value}>
              {t('includeIdField')}
            </NCheckbox>
          ),
        }}
      </RTablePro>
    )
  },
})
