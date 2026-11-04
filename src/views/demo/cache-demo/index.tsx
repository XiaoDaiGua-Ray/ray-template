import { useI18n } from '@/hooks'
import { getStorage, hasStorage, removeStorage, setStorage } from '@/utils'
import {
  NButton,
  NCard,
  NFlex,
  NFormItem,
  NInput,
  NRadioButton,
  NRadioGroup,
} from 'naive-ui'
import DemoPage from '../components/DemoPage'
import DemoResult from '../components/DemoResult'

export default defineComponent({
  name: 'CacheDemo',
  setup() {
    const { t } = useI18n('demoDetails')
    const value = ref('Ray')
    const scope = ref<'sessionStorage' | 'localStorage'>('sessionStorage')
    const suffix = ref('name')
    const selectedKey = computed(() => `ray:showcase:${suffix.value.trim()}`)
    const current = ref<string | null>(null)
    const operation = ref('cache.read')
    const keyId = useId()
    const valueId = useId()

    const read = () => {
      current.value = hasStorage(selectedKey.value, scope.value)
        ? getStorage<string>(selectedKey.value, scope.value)
        : null
    }

    watch([selectedKey, scope], read, { immediate: true })

    return () => (
      <DemoPage title={t('cache.title')} description={t('cache.intro')}>
        <div class="r-demo-grid">
          <NCard title={t('cache.write')}>
            <div class="r-demo-card-stack">
              <NRadioGroup
                v-model:value={scope.value}
                aria-label={t('cache.scope')}
              >
                <NRadioButton value="sessionStorage">
                  sessionStorage
                </NRadioButton>
                <NRadioButton value="localStorage">localStorage</NRadioButton>
              </NRadioGroup>
              <NFormItem
                label={t('cache.key')}
                labelProps={{ for: keyId }}
                showFeedback={false}
              >
                <NInput
                  inputProps={{ id: keyId }}
                  v-model:value={suffix.value}
                  maxlength={32}
                />
              </NFormItem>
              <NFormItem
                label={t('cache.value')}
                labelProps={{ for: valueId }}
                showFeedback={false}
              >
                <NInput
                  inputProps={{ id: valueId }}
                  v-model:value={value.value}
                />
              </NFormItem>
              <NFlex>
                <NButton
                  type="primary"
                  disabled={!suffix.value.trim()}
                  onClick={() => {
                    setStorage(selectedKey.value, value.value, scope.value)
                    operation.value = 'cache.write'
                    read()
                  }}
                >
                  {t('cache.write')}
                </NButton>
                <NButton
                  onClick={() => {
                    operation.value = 'cache.read'
                    read()
                  }}
                >
                  {t('cache.read')}
                </NButton>
                <NButton
                  onClick={() => {
                    removeStorage(selectedKey.value, scope.value)
                    operation.value = 'cache.remove'
                    read()
                  }}
                >
                  {t('cache.remove')}
                </NButton>
              </NFlex>
            </div>
          </NCard>
          <NCard title={t('result')}>
            <DemoResult label={t(operation.value)}>
              <pre>{selectedKey.value}</pre>
              <pre>
                {current.value === null
                  ? t('cache.missing')
                  : JSON.stringify(current.value)}
              </pre>
            </DemoResult>
          </NCard>
        </div>
      </DemoPage>
    )
  },
})
