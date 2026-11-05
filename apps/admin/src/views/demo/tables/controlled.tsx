import { useI18n } from '@/hooks/template/useI18n'
import { RTablePro } from '@ray-template/ui/table-pro'
import { createPeopleColumns } from './people'
import { usePeopleData } from './usePeopleData'

export default defineComponent({
  name: 'TableDemoControlled',
  setup() {
    const { t } = useI18n()
    const page = ref(1)
    const pageSize = ref(10)
    const name = ref<string>()
    const { data, total, loading } = usePeopleData(() => ({
      page: page.value,
      pageSize: pageSize.value,
      name: name.value,
    }))
    const columns = computed(() =>
      createPeopleColumns((key) => t(`table.${key}`)),
    )

    return () => (
      <RTablePro
        title={t('menu.TableControlled')}
        remote
        data={data.value}
        loading={loading.value}
        columns={columns.value}
        scrollX={944}
        pagination={{
          page: page.value,
          pageSize: pageSize.value,
          itemCount: total.value,
          showSizePicker: true,
          pageSizes: [10, 20, 50],
          onUpdatePage: (value) => (page.value = value),
          onUpdatePageSize: (value) => {
            pageSize.value = value
            page.value = 1
          },
        }}
        search={{
          fields: [{ key: 'name', label: t('table.name'), type: 'text' }],
        }}
        onSearch={({ values }) => {
          name.value = typeof values.name === 'string' ? values.name : void 0
          page.value = 1
        }}
      />
    )
  },
})
