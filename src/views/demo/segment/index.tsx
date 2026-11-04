import { RIcon, RSegment } from '@/components'
import type { RSegmentOptions, RSegmentWidth } from '@/components'
import { useI18n } from '@/hooks'
import type { ComponentSize } from '@/types'
import { NCard, NFlex, NRadioButton, NRadioGroup } from 'naive-ui'
import DemoPage from '../components/DemoPage'

export default defineComponent({
  name: 'SegmentDemo',
  setup() {
    const { t } = useI18n('showcase')
    const value = ref<string | number>('overview')
    const size = ref<ComponentSize>('medium')
    const width = ref<RSegmentWidth>('fitContent')
    const options = computed<RSegmentOptions[]>(() => [
      {
        label: t('segmentOverview'),
        key: 'overview',
        icon: () => <RIcon name="navigation/dashboard" />,
      },
      {
        label: t('segmentReports'),
        key: 'reports',
        popover: t('segmentPopover'),
      },
      { label: t('segmentDisabled'), key: 'disabled', disabled: true },
    ])

    return () => (
      <DemoPage
        title={t('segmentTitle')}
        description={t('segmentDescription')}
        eyebrow="RAY TEMPLATE / EXAMPLES"
      >
        <div class="r-demo-grid">
          <NCard class="r-demo-grid__wide" title={t('segmentPlayground')}>
            <NFlex vertical size="large">
              <NFlex align="center">
                <NRadioGroup
                  v-model:value={width.value}
                  aria-label={t('segmentWidth')}
                >
                  <NRadioButton value="fitContent">fitContent</NRadioButton>
                  <NRadioButton value="block">block</NRadioButton>
                  <NRadioButton value={480}>480px</NRadioButton>
                </NRadioGroup>
                <NRadioGroup
                  v-model:value={size.value}
                  aria-label={t('segmentSize')}
                >
                  <NRadioButton value="small">S</NRadioButton>
                  <NRadioButton value="medium">M</NRadioButton>
                  <NRadioButton value="large">L</NRadioButton>
                </NRadioGroup>
              </NFlex>
              <div class="r-demo-stage">
                <RSegment
                  v-model:value={value.value}
                  options={options.value}
                  width={width.value}
                  size={size.value}
                />
              </div>
              <output>
                {t('segmentSelected', {
                  value:
                    options.value.find(({ key }) => key === value.value)
                      ?.label ?? value.value,
                })}
              </output>
            </NFlex>
          </NCard>

          <NCard title={t('segmentUncontrolled')}>
            <RSegment
              defaultValue="overview"
              options={options.value.slice(0, 2)}
            />
          </NCard>
          <NCard title={t('segmentCustom')}>
            <RSegment
              defaultValue="overview"
              options={[
                options.value[0],
                {
                  key: 'custom',
                  label: h(
                    'span',
                    { style: { fontVariantNumeric: 'tabular-nums' } },
                    t('segmentCustomLabel'),
                  ),
                },
              ]}
            />
          </NCard>
        </div>
      </DemoPage>
    )
  },
})
