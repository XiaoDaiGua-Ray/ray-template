import { useI18n } from '@/hooks'
import { RFlow, useFlow } from '@ray-template/ui/flow'
import { NButton, NCard, NFlex, NSwitch, NTag } from 'naive-ui'
import DemoPage from './components/DemoPage'
import DemoResult from './components/DemoResult'

export default defineComponent({
  name: 'RFlowDemo',
  setup() {
    const { t } = useI18n('demoDetails')
    const [register, { getFlowInstance }] = useFlow()
    const readonlyMode = ref(false)
    const canvasKey = ref(0)
    const ready = ref(false)
    const output = ref('')
    const graph = () => ({
      nodes: [
        { id: 'review', type: 'rect', x: 100, y: 105, text: t('flow.review') },
        { id: 'done', type: 'circle', x: 235, y: 215, text: t('flow.done') },
      ],
      edges: [
        {
          id: 'review-to-done',
          type: 'polyline',
          sourceNodeId: 'review',
          targetNodeId: 'done',
        },
      ],
    })

    return () => (
      <DemoPage title={t('flow.title')} description={t('flow.intro')}>
        <NCard title={t('flow.canvas')}>
          <div class="r-demo-card-stack">
            <NFlex align="center">
              <NSwitch
                v-model:value={readonlyMode.value}
                aria-label={t('flow.readonly')}
              />
              <NTag bordered={false}>
                {readonlyMode.value ? t('flow.readonly') : t('flow.editable')}
              </NTag>
              <NButton
                disabled={!ready.value}
                onClick={() => getFlowInstance().fitView(24, 24)}
              >
                {t('flow.fit')}
              </NButton>
              <NButton
                disabled={!ready.value}
                onClick={() => {
                  ready.value = false
                  output.value = ''
                  canvasKey.value += 1
                }}
              >
                {t('flow.reset')}
              </NButton>
              <NButton
                type="primary"
                secondary
                disabled={!ready.value}
                onClick={() => {
                  output.value = JSON.stringify(
                    getFlowInstance().getGraphData(),
                    null,
                    2,
                  )
                }}
              >
                {t('flow.inspect')}
              </NButton>
            </NFlex>
            <div class="r-demo-flow-canvas">
              <RFlow
                key={canvasKey.value}
                height={320}
                readonly={readonlyMode.value}
                onRegister={(flow) => {
                  register(flow)
                  flow.render(graph())
                  flow.fitView(24, 24)
                  ready.value = true
                }}
              />
            </div>
            {output.value && (
              <DemoResult label={t('flow.graph')}>
                <pre>{output.value}</pre>
              </DemoResult>
            )}
          </div>
        </NCard>
      </DemoPage>
    )
  },
})
