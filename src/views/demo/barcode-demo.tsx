import { RBarcode } from '@/components'
import { useI18n } from '@/hooks'
import { NCard, NFlex, NFormItem, NInput, NSelect, NSwitch } from 'naive-ui'
import DemoPage from './components/DemoPage'
import DemoResult from './components/DemoResult'

const samples = {
  CODE128: 'RAY-024',
  pharmacode: '1234',
  codabar: 'A1234B',
} as const
const formats = Object.keys(samples).map((value) => ({ value, label: value }))

export default defineComponent({
  name: 'BarcodeDemo',
  setup() {
    const { t } = useI18n('demoDetails')
    const format = ref<keyof typeof samples>('CODE128')
    const text = ref<string>(samples.CODE128)
    const loading = ref(false)
    const colored = ref(false)
    const responsive = ref(false)
    const failed = ref(false)
    const id = useId()

    return () => (
      <DemoPage title={t('barcode.title')} description={t('barcode.intro')}>
        <div class="r-demo-grid">
          <NCard title={t('barcode.controls')}>
            <div class="r-demo-card-stack">
              <NFormItem label={t('barcode.format')} showFeedback={false}>
                <NSelect
                  value={format.value}
                  options={formats}
                  onUpdateValue={(value: keyof typeof samples) => {
                    format.value = value
                    text.value = samples[value]
                    failed.value = false
                  }}
                />
              </NFormItem>
              <NFormItem
                label={t('barcode.content')}
                labelProps={{ for: id }}
                showFeedback={false}
              >
                <NInput
                  v-model:value={text.value}
                  maxlength={24}
                  inputProps={{ id }}
                />
              </NFormItem>
              <NFlex>
                <label>
                  <NSwitch
                    v-model:value={colored.value}
                    aria-label={t('barcode.color')}
                  />{' '}
                  {t('barcode.color')}
                </label>
                <label>
                  <NSwitch
                    v-model:value={responsive.value}
                    aria-label={t('barcode.responsive')}
                  />{' '}
                  {t('barcode.responsive')}
                </label>
                <label>
                  <NSwitch
                    v-model:value={loading.value}
                    aria-label={t('loading')}
                  />{' '}
                  {t('loading')}
                </label>
              </NFlex>
            </div>
          </NCard>
          <NCard title={t('barcode.preview')}>
            <div class="r-demo-card-stack">
              <div class="r-demo-artifact r-demo-artifact--barcode">
                {text.value.trim() && (
                  <RBarcode
                    key={`${format.value}-${colored.value}-${responsive.value}`}
                    text={text.value}
                    format={format.value}
                    responsive={responsive.value}
                    width={responsive.value ? 'responsive' : 'auto'}
                    barcodeRender="svg"
                    loading={loading.value}
                    watchText
                    style={{ visibility: failed.value ? 'hidden' : 'visible' }}
                    options={{
                      width: 2,
                      height: 58,
                      lineColor: colored.value ? '#0b6b73' : '#182436',
                    }}
                    onSuccess={() => {
                      failed.value = false
                    }}
                    onError={() => {
                      failed.value = true
                    }}
                  />
                )}
              </div>
              <DemoResult label={format.value} error={failed.value}>
                {failed.value ? (
                  t('barcode.invalid')
                ) : text.value.trim() ? (
                  <code>{text.value}</code>
                ) : (
                  t('empty')
                )}
              </DemoResult>
            </div>
          </NCard>
        </div>
      </DemoPage>
    )
  },
})
