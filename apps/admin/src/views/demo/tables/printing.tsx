import './printing.scss'
import { RTablePro } from '@/components'
import type { TableProInst } from '@/components'
import { listPeople } from '@/demo-data/people'
import { useI18n } from '@/hooks/template/useI18n'
import { NButton } from 'naive-ui'
import { useTemplateRef } from 'vue'
import { createPeopleColumns } from './people'

export default defineComponent({
  name: 'TableDemoPrinting',
  setup() {
    const { t } = useI18n('table')
    const { data } = listPeople()
    const table = shallowRef<TableProInst>()
    const summary = useTemplateRef<HTMLElement>('summary')

    return () => (
      <RTablePro
        ref={table}
        title={t('printDemoTitle')}
        columns={createPeopleColumns(t)}
        data={data}
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
