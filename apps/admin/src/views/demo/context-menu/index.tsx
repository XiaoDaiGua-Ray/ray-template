import { useContextmenuCoordinate, useI18n } from '@/hooks'
import { NButton, NCard, NDropdown } from 'naive-ui'
import DemoPage from '../components/DemoPage'
import DemoResult from '../components/DemoResult'

const actions = ['review', 'archive', 'restore'] as const

export default defineComponent({
  name: 'ContextMenuDemo',
  setup() {
    const { t } = useI18n('demoDetails')
    const stage = useTemplateRef<HTMLElement>('stage')
    const { x, y, show, updateShow } = useContextmenuCoordinate(stage, {
      ignore: ['.r-demo-context-popup'],
    })
    const selected = ref<string>()
    const options = computed(() =>
      actions.map((key) => ({ key, label: t(`context.${key}`) })),
    )
    const select = (key: string) => {
      selected.value = key
      updateShow(false)
    }

    return () => (
      <DemoPage title={t('context.title')} description={t('context.intro')}>
        <NCard title="RAY-024">
          <div class="r-demo-card-stack">
            <div ref="stage" class="r-demo-stage">
              <div class="r-demo-card-stack">
                <strong>{t('context.target')}</strong>
                <NDropdown
                  options={options.value}
                  trigger="click"
                  onSelect={select}
                >
                  <NButton secondary>{t('context.open')}</NButton>
                </NDropdown>
              </div>
            </div>
            <DemoResult label={t('context.last')}>
              {selected.value ? t(`context.${selected.value}`) : t('empty')}
            </DemoResult>
          </div>
        </NCard>
        <NDropdown
          show={show.value}
          x={x.value}
          y={y.value}
          options={options.value}
          trigger="manual"
          menuProps={() => ({ class: 'r-demo-context-popup' })}
          onSelect={select}
          onClickoutside={() => updateShow(false)}
        />
      </DemoPage>
    )
  },
})
