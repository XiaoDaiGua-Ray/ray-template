import { RAY_TEMPLATE_DOCS_URL } from '@/app-config'
import { RIframe } from '@/components'
import { useI18n } from '@/hooks'

export default defineComponent({
  name: 'RTemplateDoc',
  setup() {
    const { t } = useI18n('menu')

    return () => (
      <RIframe
        src={RAY_TEMPLATE_DOCS_URL}
        title={t('DocLocalInside')}
        height="calc(var(--layout-content-height) - 2 * var(--layout-content-gutter))"
        customSpinProps={{
          contentStyle: { display: 'flex', height: 'var(--r-iframe-height)' },
        }}
        lazy={false}
      />
    )
  },
})
