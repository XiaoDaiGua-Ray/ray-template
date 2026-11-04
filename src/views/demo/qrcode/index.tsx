import LOGO from '@/assets/images/ray.svg'
import { useI18n } from '@/hooks'
import {
  NButton,
  NCard,
  NFlex,
  NFormItem,
  NInput,
  NRadioButton,
  NRadioGroup,
  NSwitch,
} from 'naive-ui'
import { Vue3NextQrcode } from 'vue3-next-qrcode'
import type { QRCodeInst, QRCodeStatus } from 'vue3-next-qrcode'
import DemoPage from '../components/DemoPage'
import DemoResult from '../components/DemoResult'

const initial = 'https://xiaodaigua-ray.github.io/ray-template/'

export default defineComponent({
  name: 'RQRCodeDemo',
  setup() {
    const { t } = useI18n('demoDetails')
    const text = ref(initial)
    const brand = ref(true)
    const animated = ref(false)
    const status = ref<'ready' | QRCodeStatus>('ready')
    const rendered = ref(false)
    const failed = ref(false)
    const instance = useTemplateRef<QRCodeInst>('qrcode')
    const id = useId()

    watch([text, brand, animated], () => {
      rendered.value = false
      failed.value = false
    })

    return () => (
      <DemoPage title={t('qr.title')} description={t('qr.intro')}>
        <div class="r-demo-grid">
          <NCard title={t('qr.controls')}>
            <div class="r-demo-card-stack">
              <NFormItem
                label={t('qr.content')}
                labelProps={{ for: id }}
                showFeedback={false}
              >
                <NInput
                  v-model:value={text.value}
                  maxlength={160}
                  showCount
                  inputProps={{ id }}
                />
              </NFormItem>
              <NFlex align="center">
                <NSwitch
                  v-model:value={brand.value}
                  aria-label={t('qr.brand')}
                />
                <span>{t('qr.brand')}</span>
                <NSwitch
                  v-model:value={animated.value}
                  aria-label={t('qr.animated')}
                />
                <span>{t('qr.animated')}</span>
              </NFlex>
              <NRadioGroup
                v-model:value={status.value}
                aria-label={t('qr.status')}
              >
                {(['ready', 'loading', 'error'] as const).map((state) => (
                  <NRadioButton key={state} value={state}>
                    {t(`qr.${state}`)}
                  </NRadioButton>
                ))}
              </NRadioGroup>
              <NButton
                type="primary"
                disabled={
                  !rendered.value || failed.value || status.value !== 'ready'
                }
                onClick={() => instance.value?.downloadQRCode()}
              >
                {t('qr.download')}
              </NButton>
            </div>
          </NCard>
          <NCard title={t('qr.preview')}>
            <div class="r-demo-card-stack">
              <div class="r-demo-artifact">
                {text.value.trim() && !failed.value ? (
                  <Vue3NextQrcode
                    ref="qrcode"
                    text={text.value}
                    size={180}
                    logoImage={brand.value ? LOGO : void 0}
                    logoScale={0.22}
                    gifBackgroundURL={
                      animated.value
                        ? `${import.meta.env.BASE_URL}examples/qr-background.gif`
                        : void 0
                    }
                    dotScale={animated.value ? 0.9 : void 0}
                    status={status.value === 'ready' ? void 0 : status.value}
                    errorDescription={t('qr.expired')}
                    errorActionDescription={t('qr.reload')}
                    onReload={() => {
                      status.value = 'ready'
                    }}
                    onSuccess={() => {
                      rendered.value = true
                    }}
                    onError={() => {
                      failed.value = true
                    }}
                  />
                ) : (
                  <span>{failed.value ? t('qr.failed') : t('qr.noText')}</span>
                )}
              </div>
              <DemoResult label={t('qr.content')}>
                <code>{text.value || t('empty')}</code>
              </DemoResult>
            </div>
          </NCard>
        </div>
      </DemoPage>
    )
  },
})
