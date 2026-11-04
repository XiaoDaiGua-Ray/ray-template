import { useI18n } from '@/hooks'
import { decrypt, encrypt, prefixCacheKey } from '@/utils'
import { NButton, NFlex, NInput } from 'naive-ui'
import DemoPage from './components/DemoPage'
import DemoResult from './components/DemoResult'

export default defineComponent({
  name: 'DocsStorageUtils',
  setup() {
    const { t } = useI18n('docsExamples')
    const text = (key: string) => t<string>(key)
    const key = ref('order-filter')
    const prefix = ref('orders:')
    const input = ref(text('storage.initial'))
    const ciphertext = ref('')
    const restored = ref('')
    const passphrase = 'ray-template-example-only'
    const cacheKey = computed(() =>
      prefixCacheKey(key.value, { customPrefix: prefix.value }),
    )

    return () => (
      <DemoPage
        title={text('storage.title')}
        description={text('storage.intro')}
      >
        <NFlex>
          <NInput
            v-model:value={prefix.value}
            aria-label={text('storage.prefix')}
          />
          <NInput v-model:value={key.value} aria-label={text('storage.key')} />
        </NFlex>
        <DemoResult label={text('storage.resultKey')}>
          <code>{cacheKey.value}</code>
        </DemoResult>
        <NInput
          v-model:value={input.value}
          aria-label={text('storage.plainText')}
        />
        <NFlex>
          <NButton
            onClick={() => {
              ciphertext.value = encrypt({ status: input.value }, passphrase)
              restored.value = ''
            }}
          >
            {text('storage.encrypt')}
          </NButton>
          <NButton
            disabled={!ciphertext.value}
            onClick={() => {
              restored.value = JSON.stringify(
                decrypt(ciphertext.value, passphrase),
              )
            }}
          >
            {text('storage.decrypt')}
          </NButton>
        </NFlex>
        <DemoResult label={text('storage.ciphertext')}>
          <code>{ciphertext.value}</code>
        </DemoResult>
        <DemoResult label={text('storage.restored')}>
          <code>{restored.value}</code>
        </DemoResult>
      </DemoPage>
    )
  },
})
