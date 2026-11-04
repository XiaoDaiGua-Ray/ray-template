import './hooks/index.scss'
import { useI18n } from '@/hooks'
import LayoutSettings from '@/layout/components/LayoutSettings'
import { useSettingGetters } from '@/store'
import { NCard } from 'naive-ui'
import DemoPage from './components/DemoPage'

export default defineComponent({
  name: 'LayoutDemo',
  setup() {
    const { t } = useI18n('layout')
    const { t: showcaseT } = useI18n('showcase')
    const { getLayoutConfig } = useSettingGetters()

    return () => (
      <DemoPage
        title={t<string>('title')}
        eyebrow={showcaseT<string>('layoutEyebrow')}
        meta={showcaseT<string>('livePreferences')}
      >
        <div class="r-layout-playground">
          <NCard title={showcaseT<string>('layoutControls')}>
            <LayoutSettings showDescription={false} />
          </NCard>
          <div class="r-layout-playground__aside">
            <NCard title={t<string>('current')}>
              <pre class="r-demo-code">
                <code>{JSON.stringify(getLayoutConfig.value, null, 2)}</code>
              </pre>
            </NCard>
            <NCard title={t<string>('extension')}>
              <pre class="r-demo-code">
                <code>{`const { updateSettingState } = useSettingActions()\n\nupdateSettingState('layoutConfig', {\n  mode: 'mixed',\n  contentWidth: 'fixed',\n})\n\n<RLayout>\n  {{\n    header: () => <CustomHeader />,\n    footer: () => <CustomFooter />,\n  }}\n</RLayout>`}</code>
              </pre>
            </NCard>
          </div>
        </div>
      </DemoPage>
    )
  },
})
