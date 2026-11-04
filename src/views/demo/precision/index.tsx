import { useI18n } from '@/hooks'
import { add, distribute, divide, format, multiply, subtract } from '@/utils'
import {
  NCard,
  NDynamicTags,
  NFormItem,
  NGrid,
  NGridItem,
  NInputNumber,
} from 'naive-ui'
import DemoPage from '../components/DemoPage'
import DemoResult from '../components/DemoResult'

const operations = { add, subtract, multiply, divide }

export default defineComponent({
  name: 'CalculatePrecision',
  setup() {
    const { t } = useI18n('demoDetails')
    const operands = reactive({
      add: ['0.1', '0.2'],
      subtract: ['1', '0.7'],
      multiply: ['0.1', '0.2'],
      divide: ['1', '3'],
    })
    const amount = ref<number | null>(10)
    const parts = ref<number | null>(3)
    const allocation = computed(() =>
      amount.value === null || parts.value === null
        ? []
        : distribute(amount.value, parts.value),
    )

    return () => (
      <DemoPage title={t('precision.title')} description={t('precision.intro')}>
        <div class="r-demo-grid">
          {(Object.keys(operations) as (keyof typeof operations)[]).map(
            (operation) => {
              const values = operands[operation]
              const invalid =
                !values.length ||
                values.some(
                  (value) => !/^-?(?:\d+(?:\.\d*)?|\.\d+)$/.test(value),
                )
              const zeroDivisor =
                operation === 'divide' &&
                values.slice(1).some((value) => Number(value) === 0)
              let result = t('precision.invalid')

              if (!invalid && !zeroDivisor) {
                try {
                  result = String(format(operations[operation](...values)))
                } catch {
                  result = t('precision.invalid')
                }
              }

              return (
                <NCard key={operation} title={t(`precision.${operation}`)}>
                  <div class="r-demo-card-stack">
                    <NDynamicTags v-model:value={operands[operation]} />
                    <DemoResult
                      label={t('result')}
                      error={invalid || zeroDivisor}
                    >
                      <strong>
                        {zeroDivisor ? t('precision.zero') : result}
                      </strong>
                    </DemoResult>
                  </div>
                </NCard>
              )
            },
          )}
          <NCard class="r-demo-grid__wide" title={t('precision.allocation')}>
            <div class="r-demo-card-stack">
              <NGrid cols="1 480:2" responsive="self" xGap={16}>
                <NGridItem>
                  <NFormItem label={t('precision.amount')} showFeedback={false}>
                    <NInputNumber v-model:value={amount.value} />
                  </NFormItem>
                </NGridItem>
                <NGridItem>
                  <NFormItem label={t('precision.parts')} showFeedback={false}>
                    <NInputNumber
                      v-model:value={parts.value}
                      min={1}
                      max={12}
                      precision={0}
                    />
                  </NFormItem>
                </NGridItem>
              </NGrid>
              <DemoResult label={t('result')}>
                <code>
                  {allocation.value.length
                    ? allocation.value.join(' + ')
                    : t('empty')}
                </code>
              </DemoResult>
            </div>
          </NCard>
        </div>
      </DemoPage>
    )
  },
})
