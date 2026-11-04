import {
  getRequestFixture,
  getWeather,
  requestFixtureUrl,
} from '@/api/demo/test'
import { useHookPlusRequest, useRequest } from '@/axios'
import { useI18n } from '@/hooks'
import { NButton, NCard, NFormItem, NInput, NSelect, NTag } from 'naive-ui'
import DemoPage from '../components/DemoPage'
import DemoResult from '../components/DemoResult'

export default defineComponent({
  name: 'RAxios',
  setup() {
    const { t } = useI18n('demoDetails')
    const manual = useRequest<Awaited<ReturnType<typeof getRequestFixture>>>(
      { url: requestFixtureUrl, method: 'get', cancelConfig: { cancel: true } },
      { manual: true },
    )
    const city = ref<string | null>(null)
    const weather = useHookPlusRequest(getWeather, { manual: true })
    const cities = ['Hangzhou', 'Shanghai', 'Chengdu'].map((value) => ({
      value,
      label: value,
    }))
    const rateDemos = (['throttle', 'debounce'] as const).map((kind) => {
      const input = ref('')
      const sent = ref(0)
      const inputId = useId()
      const query = useHookPlusRequest(
        async (value: string) => {
          sent.value += 1
          const { ticket } = await getRequestFixture()

          return { value, ticket: ticket.id }
        },
        {
          manual: true,
          ...(kind === 'throttle'
            ? { throttleWait: 1000 }
            : { debounceWait: 1000 }),
        },
      )

      return { kind, input, sent, inputId, query }
    })

    return () => (
      <DemoPage
        title={t('request.title')}
        description={t('request.intro')}
        meta={t('request.fixture')}
      >
        <div class="r-demo-grid">
          <NCard title="useRequest">
            <div class="r-demo-card-stack">
              <NButton type="primary" onClick={() => manual.run()}>
                {t('request.fetch')}
              </NButton>
              <DemoResult label={t('result')} error={!!manual.error.value}>
                {manual.loading.value ? (
                  t('loading')
                ) : manual.error.value ? (
                  t('request.failed')
                ) : manual.data.value ? (
                  <pre>{JSON.stringify(manual.data.value.ticket, null, 2)}</pre>
                ) : (
                  t('request.waiting')
                )}
              </DemoResult>
            </div>
          </NCard>
          <NCard title={t('request.city')}>
            <div class="r-demo-card-stack">
              <NSelect
                value={city.value}
                options={cities}
                placeholder={t('request.selectCity')}
                onUpdateValue={(value) => {
                  city.value = value
                  weather.run(value)
                }}
              />
              <DemoResult label={t('result')} error={!!weather.error.value}>
                {weather.loading.value
                  ? t('loading')
                  : weather.error.value
                    ? t('request.failed')
                    : weather.data.value
                      ? `${weather.data.value.temperature} °C · ${weather.data.value.humidity}% RH`
                      : t('request.waiting')}
              </DemoResult>
            </div>
          </NCard>
          {rateDemos.map(({ kind, input, sent, inputId, query }) => (
            <NCard key={kind} title={t(`request.${kind}`)}>
              {{
                'header-extra': () => (
                  <NTag size="small" bordered={false}>
                    {t('request.sent', { count: sent.value })}
                  </NTag>
                ),
                default: () => (
                  <div class="r-demo-card-stack">
                    <NFormItem
                      label={t('request.input')}
                      labelProps={{ for: inputId }}
                      showFeedback={false}
                    >
                      <NInput
                        value={input.value}
                        inputProps={{ id: inputId }}
                        onUpdateValue={(value) => {
                          input.value = value

                          if (value.trim()) query.run(value)
                          else query.cancel()
                        }}
                      />
                    </NFormItem>
                    <DemoResult
                      label={t('request.last')}
                      error={!!query.error.value}
                    >
                      {query.loading.value ? (
                        t('loading')
                      ) : query.error.value ? (
                        t('request.failed')
                      ) : query.data.value ? (
                        <code>
                          {query.data.value.value} · {query.data.value.ticket}
                        </code>
                      ) : (
                        t('request.waiting')
                      )}
                    </DemoResult>
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
