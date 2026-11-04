import { useI18n } from '@/hooks'
import { NButton, NCard, NFormItem, NInput, NTag } from 'naive-ui'
import DemoPage from './DemoPage'
import DemoResult from './DemoResult'

export default defineComponent({
  name: 'CacheRouteExample',
  props: {
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  setup(props) {
    const { t } = useI18n('demoDetails')
    const route = useRoute()
    const note = ref('')
    const id = useId()

    return () => (
      <DemoPage title={props.title} description={props.description}>
        <div class="r-demo-grid">
          <NCard title={t('nested.draft')}>
            <div class="r-demo-card-stack">
              <NFormItem
                label={t('nested.note')}
                labelProps={{ for: id }}
                showFeedback={false}
              >
                <NInput
                  type="textarea"
                  v-model:value={note.value}
                  inputProps={{ id }}
                />
              </NFormItem>
              <NButton
                onClick={() => {
                  note.value = ''
                }}
              >
                {t('form.reset')}
              </NButton>
            </div>
          </NCard>
          <NCard title={t('nested.route')}>
            <div class="r-demo-card-stack">
              <code>{route.path}</code>
              <NTag type="info" bordered={false}>
                KeepAlive
              </NTag>
              <DemoResult label={t('nested.note')}>
                {note.value || t('empty')}
              </DemoResult>
            </div>
          </NCard>
        </div>
      </DemoPage>
    )
  },
})
