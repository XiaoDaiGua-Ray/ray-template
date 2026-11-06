import { AdminApiError } from '@/api/admin/client'
import { getRouteDemoPeople, getRouteDemoPerson } from '@/api/demo/data'
import { useI18n } from '@/hooks'
import type { RouteDemoPerson } from '@ray-template/api-contracts/demo'
import {
  NButton,
  NCard,
  NDescriptions,
  NDescriptionsItem,
  NSpin,
  NTag,
} from 'naive-ui'
import DemoPage from '../../components/DemoPage'
import DemoResult from '../../components/DemoResult'

export default defineComponent({
  name: 'RouterDemoDetail',
  setup() {
    const { t } = useI18n()
    const route = useRoute()
    const router = useRouter()
    const person = shallowRef<RouteDemoPerson>()
    const loading = ref(false)
    const failed = ref(false)
    const attempt = ref(0)

    watch(
      () => [route.query.id, route.query.name, attempt.value],
      async ([id, name], _, cleanup) => {
        const controller = new AbortController()

        cleanup(() => controller.abort())
        person.value = void 0
        failed.value = false
        loading.value = true

        try {
          const result =
            typeof id === 'string'
              ? await getRouteDemoPerson(id, controller.signal)
              : typeof name === 'string'
                ? (await getRouteDemoPeople({ name }, controller.signal))
                    .items[0]
                : void 0

          if (!controller.signal.aborted) person.value = result
        } catch (error) {
          if (!controller.signal.aborted)
            failed.value = !(
              error instanceof AdminApiError && error.code === 404
            )
        } finally {
          if (!controller.signal.aborted) loading.value = false
        }
      },
      { immediate: true },
    )

    return () => (
      <DemoPage
        title={t('showcase.detailTitle')}
        description={t('showcase.detailDescription')}
      >
        {{
          actions: () => (
            <NButton
              onClick={() => router.push('/router-demo/router-demo-home')}
            >
              {t('demoDetails.detail.back')}
            </NButton>
          ),
          default: () => (
            <div class="r-demo-grid">
              <NCard title={person.value?.name ?? t('showcase.detailTitle')}>
                <NSpin show={loading.value}>
                  {failed.value ? (
                    <NButton onClick={() => attempt.value++}>
                      {t('demoDetails.detail.retry')}
                    </NButton>
                  ) : person.value ? (
                    <NDescriptions column={1} bordered>
                      <NDescriptionsItem
                        label={t('demoDetails.detail.address')}
                      >
                        {person.value.address}
                      </NDescriptionsItem>
                      <NDescriptionsItem label={t('demoDetails.detail.phone')}>
                        {person.value.phone}
                      </NDescriptionsItem>
                    </NDescriptions>
                  ) : !loading.value ? (
                    t('demoDetails.detail.missing')
                  ) : null}
                </NSpin>
              </NCard>
              <NCard title={t('demoDetails.nested.route')}>
                <div class="r-demo-card-stack">
                  <NTag type="info" bordered={false}>
                    sameLevel
                  </NTag>
                  <DemoResult label={t('demoDetails.detail.params')}>
                    <pre>{JSON.stringify(route.query, null, 2)}</pre>
                  </DemoResult>
                </div>
              </NCard>
            </div>
          ),
        }}
      </DemoPage>
    )
  },
})
