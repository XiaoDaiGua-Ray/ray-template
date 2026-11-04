import { useI18n } from '@/hooks'
import {
  NButton,
  NCard,
  NDescriptions,
  NDescriptionsItem,
  NTag,
} from 'naive-ui'
import DemoPage from '../../components/DemoPage'
import DemoResult from '../../components/DemoResult'
import { routeDemoPeople } from '../people'

export default defineComponent({
  name: 'RouterDemoDetail',
  setup() {
    const { t } = useI18n()
    const route = useRoute()
    const router = useRouter()
    const person = computed(() =>
      routeDemoPeople.find(({ key, name }) =>
        route.query.id == null
          ? route.query.name === name
          : route.query.id === String(key),
      ),
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
                {person.value ? (
                  <NDescriptions column={1} bordered>
                    <NDescriptionsItem label={t('demoDetails.detail.address')}>
                      {person.value.address}
                    </NDescriptionsItem>
                    <NDescriptionsItem label={t('demoDetails.detail.phone')}>
                      {person.value.phone}
                    </NDescriptionsItem>
                  </NDescriptions>
                ) : (
                  t('demoDetails.detail.missing')
                )}
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
