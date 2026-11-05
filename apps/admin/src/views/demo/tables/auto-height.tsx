import { RTablePro } from '@/components'
import { useI18n } from '@/hooks/template/useI18n'
import { NCheckbox } from 'naive-ui'
import { createPeopleColumns } from './people'
import { usePeopleData } from './usePeopleData'

export default defineComponent({
  name: 'TableDemoAutoHeight',
  setup() {
    const { t } = useI18n('table')
    const { data, loading } = usePeopleData()
    const virtual = ref(false)
    const footer = ref(false)
    const action = ref(false)
    const columns = computed(() => createPeopleColumns(t))
    const ages = computed(() =>
      [...new Set(data.value.slice(0, 10).map(({ age }) => age))].sort(
        (a, b) => a - b,
      ),
    )

    return () => (
      <RTablePro
        autoHeight
        virtualScroll={virtual.value}
        data={data.value}
        loading={loading.value}
        columns={columns.value}
        scrollX={944}
        pageSize={20}
        search={[
          { key: 'name', label: t('name'), placeholder: t('nameHint') },
          {
            key: 'age',
            label: t('age'),
            options: ages.value.map((age) => ({
              value: age,
              label: String(age),
            })),
          },
        ]}
      >
        {{
          toolbar: () => (
            <>
              <NCheckbox v-model:checked={virtual.value}>
                {t('virtualRows')}
              </NCheckbox>
              <NCheckbox v-model:checked={footer.value}>
                {t('showFooter')}
              </NCheckbox>
              <NCheckbox v-model:checked={action.value}>
                {t('showAction')}
              </NCheckbox>
            </>
          ),
          tableFooter: footer.value ? () => t('footerExample') : void 0,
          tableAction: action.value ? () => t('actionExample') : void 0,
        }}
      </RTablePro>
    )
  },
})
