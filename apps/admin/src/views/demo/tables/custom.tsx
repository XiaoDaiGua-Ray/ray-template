import { RTablePro, useTablePro } from '@/components'
import { useI18n } from '@/hooks/template/useI18n'
import { NButton, NFlex, NInput } from 'naive-ui'
import { createPeopleColumns } from './people'
import { usePeopleData } from './usePeopleData'

export default defineComponent({
  name: 'TableDemoCustom',
  setup() {
    const { t } = useI18n('table')
    const { data, loading } = usePeopleData()
    const [register, { setPage, setPageSize }] = useTablePro()
    const email = ref('')
    const selected = ref<(string | number)[]>([])
    const columns = computed(() => [
      { type: 'selection' as const, width: 44 },
      ...createPeopleColumns(t),
    ])

    return () => (
      <RTablePro
        onRegister={register}
        columns={columns.value}
        data={data.value}
        loading={loading.value}
        v-model:checkedRowKeys={selected.value}
        scrollX={944}
        contextMenuOptions={[{ label: t('contextAction'), key: 'example' }]}
        onContextMenuClick={(_key, _option, { row }) =>
          window.$message?.info(`${t('contextAction')}: ${row.name}`)
        }
      >
        {{
          filters: ({
            submit,
          }: {
            submit: (values: { email?: string }) => Promise<void>
          }) => (
            <form
              class="r-table-search"
              onSubmit={(event) => {
                event.preventDefault()
                void submit(email.value ? { email: email.value.trim() } : {})
              }}
            >
              <div class="r-table-search__field">
                <NInput
                  inputProps={{ 'aria-label': t('email') }}
                  v-model:value={email.value}
                  placeholder={t('emailHint')}
                  clearable
                />
              </div>
              <NButton attrType="submit">{t('search')}</NButton>
            </form>
          ),
          title: () => (
            <NFlex size={6}>
              <NButton size="small" secondary onClick={() => setPage(1)}>
                {t('firstPage')}
              </NButton>
              <NButton size="small" secondary onClick={() => setPageSize(20)}>
                {t('twentyRows')}
              </NButton>
            </NFlex>
          ),
          tableFooter: () => t('customFooter'),
          tableAction: () => (
            <NButton
              size="small"
              text
              disabled={!selected.value.length}
              onClick={() => {
                selected.value = []
              }}
            >
              {t('clearSelection', { count: selected.value.length })}
            </NButton>
          ),
        }}
      </RTablePro>
    )
  },
})
