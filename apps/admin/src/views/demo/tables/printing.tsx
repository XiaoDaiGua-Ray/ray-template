import './printing.scss'
import { useI18n } from '@/hooks/template/useI18n'
import { RTablePro } from '@ray-template/ui/table-pro'
import type { TableProInst } from '@ray-template/ui/table-pro'
import { NButton } from 'naive-ui'
import { useTemplateRef } from 'vue'
import { createPeopleColumns } from './people'
import { usePeopleData } from './usePeopleData'

export default defineComponent({
  name: 'TableDemoPrinting',
  setup() {
    const { t } = useI18n('table')
    const { data, loading } = usePeopleData()
    const table = shallowRef<TableProInst>()
    const summary = useTemplateRef<HTMLElement>('summary')

    return () => (
      <RTablePro
        ref={table}
        title={t('printDemoTitle')}
        columns={createPeopleColumns(t)}
        data={data.value}
        loading={loading.value}
        showPrint
        pageSize={20}
        scrollX={920}
        search={[{ key: 'name', label: t('name'), placeholder: t('nameHint') }]}
      >
        {{
          toolbar: () => (
            <NButton
              size="small"
              secondary
              onClick={() =>
                table.value?.print({
                  target: summary,
                  title: t('printSummary'),
                })
              }
            >
              {t('printSummary')}
            </NButton>
          ),
          tableFooter: () => (
            <section ref="summary" class="demo-print-summary">
              <h3>{t('printSummary')}</h3>
              <p>{t('printSummaryText')}</p>
            </section>
          ),
        }}
      </RTablePro>
    )
  },
})
