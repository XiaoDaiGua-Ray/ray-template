import { useI18n } from '@/hooks'
import {
  callWithAsyncErrorHandling,
  callWithErrorHandling,
  detectOperatingSystem,
  equalRouterPath,
  getAppEnvironment,
  getDateByNaiveDatePicker,
  isAsyncFunction,
  isPromise,
  isValueType,
  removeDuplicateKeys,
  updateObjectValue,
  uuid,
} from '@/utils'
import {
  NButton,
  NCard,
  NDatePicker,
  NFlex,
  NInput,
  NInputNumber,
  NSelect,
  NSwitch,
} from 'naive-ui'
import DemoPage from './components/DemoPage'
import DemoResult from './components/DemoResult'

export default defineComponent({
  name: 'DocsCoreUtils',
  setup() {
    const { t } = useI18n('docsExamples')
    const text = (key: string) => t<string>(key)
    const kind = ref<'text' | 'thenable' | 'async'>('thenable')
    const length = ref<number | null>(8)
    const radix = ref<number | null>(36)
    const generated = ref('')
    const fail = ref(false)
    const errorResult = ref('')
    const first = ref('/orders/?page=1')
    const second = ref('/orders#details')
    const field = ref(text('core.pending'))
    const range = ref<[number, number] | null>(null)
    const row = reactive<{ order: { id?: string; status: string } }>({
      order: { id: 'ORD-001', status: text('core.initial') },
    })
    const { MODE, DEV, PROD } = getAppEnvironment()
    const sample = computed(() => {
      if (kind.value === 'async') return async () => text('core.complete')

      if (kind.value === 'thenable')
        return { then: () => text('core.complete') }

      return text('core.complete')
    })
    const generate = () => {
      generated.value =
        callWithErrorHandling(
          () => uuid(length.value ?? 0, radix.value ?? 36),
          (error: Error) => {
            generated.value = error.message
          },
        ) ?? generated.value
    }
    const handleError = (error: Error) => {
      errorResult.value = error.message
    }
    const run = async (asyncMode: boolean) => {
      const execute = () => {
        if (fail.value) throw new Error(text('core.failed'))

        return text('core.succeeded')
      }
      const result = asyncMode
        ? await callWithAsyncErrorHandling(async () => execute(), handleError)
        : callWithErrorHandling(execute, handleError)

      if (result) errorResult.value = result
    }

    return () => (
      <DemoPage title={text('core.title')} description={text('core.intro')}>
        <div class="r-demo-grid">
          <NCard title="isValueType · isPromise · isAsyncFunction">
            <NSelect
              aria-label={text('core.inputType')}
              options={[
                { label: text('core.text'), value: 'text' },
                { label: text('core.thenable'), value: 'thenable' },
                { label: text('core.asyncFn'), value: 'async' },
              ]}
              v-model:value={kind.value}
            />
            <DemoResult label={text('core.checkResult')}>
              <pre>
                {JSON.stringify(
                  {
                    String: isValueType(sample.value, 'String'),
                    Function: isValueType(sample.value, 'Function'),
                    isPromise: isPromise(sample.value),
                    isAsyncFunction: isAsyncFunction(sample.value),
                  },
                  null,
                  2,
                )}
              </pre>
            </DemoResult>
          </NCard>
          <NCard title={text('core.errorCallbacks')}>
            <NFlex>
              <NInputNumber
                v-model:value={length.value}
                min={0}
                max={64}
                aria-label={text('core.idLength')}
              />
              <NInputNumber
                v-model:value={radix.value}
                min={1}
                max={62}
                aria-label={text('core.radix')}
              />
              <NButton onClick={generate}>{text('core.generate')}</NButton>
            </NFlex>
            <DemoResult label={text('core.identifier')}>
              {generated.value}
            </DemoResult>
            <NFlex align="center">
              <NSwitch
                v-model:value={fail.value}
                aria-label={text('core.simulateFailure')}
              />{' '}
              {text('core.simulateFailure')}
              <NButton onClick={() => run(false)}>
                {text('core.runSync')}
              </NButton>
              <NButton onClick={() => run(true)}>
                {text('core.runAsync')}
              </NButton>
            </NFlex>
            <DemoResult label={text('core.execution')}>
              {errorResult.value}
            </DemoResult>
          </NCard>
          <NCard title={text('core.pathAndObject')}>
            <NFlex>
              <NInput
                v-model:value={first.value}
                aria-label={text('core.pathOne')}
              />
              <NInput
                v-model:value={second.value}
                aria-label={text('core.pathTwo')}
              />
              <code>{String(equalRouterPath(first.value, second.value))}</code>
            </NFlex>
            <NFlex>
              <NInput
                v-model:value={field.value}
                aria-label={text('core.orderStatus')}
              />
              <NButton
                onClick={() =>
                  updateObjectValue(row, 'order', {
                    status: field.value,
                  })
                }
              >
                {text('core.merge')}
              </NButton>
            </NFlex>
            <DemoResult label={text('core.shallowCopy')}>
              <code>{JSON.stringify(removeDuplicateKeys(row))}</code>
            </DemoResult>
          </NCard>
          <NCard title={text('core.dateAndEnvironment')}>
            <NDatePicker
              v-model:value={range.value}
              type="daterange"
              clearable
              aria-label={text('core.dateRange')}
            />
            <DemoResult label={text('core.dateResult')}>
              <code>
                {JSON.stringify(getDateByNaiveDatePicker(range.value, true))}
              </code>
            </DemoResult>
            <DemoResult label={text('core.environment')}>
              <code>
                {JSON.stringify({
                  MODE,
                  DEV,
                  PROD,
                  os: detectOperatingSystem(),
                })}
              </code>
            </DemoResult>
          </NCard>
        </div>
      </DemoPage>
    )
  },
})
