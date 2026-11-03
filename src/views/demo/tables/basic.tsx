import { RTablePro } from '@/components'
import { listPeople } from '@/demo-data/people'
import { useI18n } from '@/hooks/template/useI18n'
import { createPeopleColumns } from './people'

export default defineComponent({
  name: 'TableDemoBasic',
  setup() {
    const { t } = useI18n('table')
    const { data } = listPeople({ page: 1, pageSize: 10 })
    const columns = computed(() =>
      createPeopleColumns(t).map((column) => {
        if ('key' in column && column.key === 'age')
          return {
            ...column,
            sorter: (a: (typeof data)[number], b: (typeof data)[number]) =>
              a.age - b.age,
          }

        return column
      }),
    )

    return () => (
      <RTablePro bare data={data} columns={columns.value} scrollX={944} />
    )
  },
})
