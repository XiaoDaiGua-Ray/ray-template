import { RTablePro } from '@/components'
import { useI18n } from '@/hooks/template/useI18n'
import { createPeopleColumns } from './people'
import { usePeopleData } from './usePeopleData'

export default defineComponent({
  name: 'TableDemoBasic',
  setup() {
    const { t } = useI18n('table')
    const { data, loading } = usePeopleData(() => ({ page: 1, pageSize: 10 }))
    const columns = computed(() =>
      createPeopleColumns(t).map((column) => {
        if ('key' in column && column.key === 'age')
          return {
            ...column,
            sorter: (
              a: (typeof data.value)[number],
              b: (typeof data.value)[number],
            ) => a.age - b.age,
          }

        return column
      }),
    )

    return () => (
      <RTablePro
        bare
        data={data.value}
        loading={loading.value}
        columns={columns.value}
        scrollX={944}
      />
    )
  },
})
