import { useI18n } from '@/hooks'
import { RIframe } from '@ray-template/ui/iframe'
import { NButton, NCard, NTag } from 'naive-ui'
import DemoPage from '../components/DemoPage'

export default defineComponent({
  name: 'IframeDemo',
  setup() {
    const { t } = useI18n('demoDetails')
    const lazyMounted = ref(false)
    const loaded = reactive({ eager: false, lazy: false })
    const source = `${import.meta.env.BASE_URL}examples/embed.html`

    return () => (
      <DemoPage title={t('iframe.title')} description={t('iframe.intro')}>
        <div class="r-demo-grid">
          {(['eager', 'lazy'] as const).map((mode) => (
            <NCard key={mode} title={t(`iframe.${mode}`)}>
              {{
                'header-extra': () => (
                  <NTag
                    size="small"
                    bordered={false}
                    type={loaded[mode] ? 'success' : 'default'}
                  >
                    {loaded[mode] ? t('iframe.loaded') : t('iframe.pending')}
                  </NTag>
                ),
                default: () =>
                  mode === 'eager' || lazyMounted.value ? (
                    <RIframe
                      src={source}
                      title={t(`iframe.${mode}`)}
                      height={220}
                      lazy={mode === 'lazy'}
                      onSuccess={() => {
                        loaded[mode] = true
                      }}
                    />
                  ) : (
                    <div class="r-demo-stage">
                      <NButton
                        secondary
                        onClick={() => {
                          lazyMounted.value = true
                        }}
                      >
                        {t('iframe.mount')}
                      </NButton>
                    </div>
                  ),
              }}
            </NCard>
          ))}
        </div>
      </DemoPage>
    )
  },
})
