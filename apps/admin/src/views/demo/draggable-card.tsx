import { RDraggableCard } from '@/components'
import type { DefaultPosition } from '@/components'
import { useI18n } from '@/hooks'
import { NButton, NCard, NFlex, NSelect, NSwitch, NTag } from 'naive-ui'
import DemoPage from './components/DemoPage'

const positions = [
  'center',
  'top-center',
  'bottom-center',
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
] as const
const options = positions.map((value) => ({ label: value, value }))

export default defineComponent({
  name: 'DraggableCardDemo',
  setup() {
    const { t } = useI18n('demoDetails')
    const target = useTemplateRef<HTMLElement>('target')
    const position = ref<DefaultPosition>('center')
    const draggable = ref(true)
    const scope = ref<'bounded' | 'body' | null>(null)

    return () => (
      <DemoPage title={t('drag.title')} description={t('drag.intro')}>
        <NCard title={t('drag.stage')}>
          <div class="r-demo-card-stack">
            <NFlex align="center">
              <NSelect
                value={position.value as string}
                options={options}
                style={{ width: '150px' }}
                aria-label={t('drag.position')}
                onUpdateValue={(value: DefaultPosition) => {
                  position.value = value
                }}
              />
              <NSwitch
                v-model:value={draggable.value}
                aria-label={t('drag.enable')}
              />
              <NTag bordered={false}>
                {draggable.value ? t('drag.enable') : t('drag.locked')}
              </NTag>
              <NButton
                type="primary"
                onClick={() => {
                  scope.value = scope.value === 'bounded' ? null : 'bounded'
                }}
              >
                {t('drag.bounded')}
              </NButton>
              <NButton
                onClick={() => {
                  scope.value = scope.value === 'body' ? null : 'body'
                }}
              >
                {t('drag.body')}
              </NButton>
            </NFlex>
            <div ref="target" class="r-demo-stage r-demo-stage--drag">
              <span>{t('drag.bounds')}</span>
            </div>
          </div>
        </NCard>
        {scope.value && target.value && (
          <RDraggableCard
            restrictionElement={
              scope.value === 'bounded' ? target.value : 'body'
            }
            width="min(220px, calc(100vw - 56px))"
            defaultPosition={position.value}
            title={t(`drag.${scope.value}`)}
            closable
            dad={draggable.value}
            onClose={() => {
              scope.value = null
            }}
          >
            <NTag bordered={false}>
              {draggable.value ? t('drag.enable') : t('drag.locked')}
            </NTag>
          </RDraggableCard>
        )}
      </DemoPage>
    )
  },
})
