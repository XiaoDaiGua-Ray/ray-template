import { useI18n } from '@/hooks'
import { RModal, useModal } from '@ray-template/ui/modal'
import { NButton, NCard, NFlex, NInputNumber, NTag } from 'naive-ui'
import DemoPage from '../components/DemoPage'
import DemoResult from '../components/DemoResult'

const variants = ['card', 'dialog', 'fullscreen'] as const

export default defineComponent({
  name: 'ModalDemo',
  setup() {
    const { t } = useI18n('demoDetails')
    const variant = ref<(typeof variants)[number]>('card')
    const visible = ref(false)
    const width = ref<number | null>(480)
    const last = ref<string>()
    const { create } = useModal()

    const open = (mode: (typeof variants)[number]) => {
      variant.value = mode
      visible.value = true
    }
    const content = () => (
      <DemoResult label={t('modal.record')}>
        <strong>RAY-024</strong>
      </DemoResult>
    )

    return () => (
      <DemoPage title={t('modal.title')} description={t('modal.intro')}>
        <div class="r-demo-grid">
          {variants.map((mode) => (
            <NCard key={mode} title={t(`modal.${mode}`)}>
              <div class="r-demo-card-stack">
                <div
                  class={[
                    'r-demo-modal-sketch',
                    `r-demo-modal-sketch--${mode}`,
                  ]}
                  aria-hidden="true"
                >
                  <span />
                </div>
                <NButton type="primary" secondary onClick={() => open(mode)}>
                  {t(`modal.open.${mode}`)}
                </NButton>
              </div>
            </NCard>
          ))}
          <NCard title={t('modal.width')}>
            <div class="r-demo-card-stack">
              <NFlex align="center">
                <NInputNumber
                  v-model:value={width.value}
                  min={280}
                  max={960}
                  step={40}
                  aria-label={t('modal.width')}
                />
                <NTag bordered={false}>px</NTag>
              </NFlex>
              <NButton onClick={() => open('card')}>
                {t('modal.applyWidth')}
              </NButton>
            </div>
          </NCard>
          <NCard class="r-demo-grid__wide" title="useModal">
            <NFlex align="center">
              <NButton
                onClick={() =>
                  create({ preset: 'card', title: t('modal.card'), content })
                }
              >
                {t('modal.createCard')}
              </NButton>
              <NButton
                onClick={() =>
                  create({
                    preset: 'dialog',
                    title: t('modal.dialog'),
                    content,
                  })
                }
              >
                {t('modal.createDialog')}
              </NButton>
            </NFlex>
          </NCard>
        </div>

        <DemoResult label={t('modal.last')}>
          {last.value ? t(`modal.${last.value}`) : t('empty')}
        </DemoResult>

        <RModal
          v-model:show={visible.value}
          preset={variant.value === 'dialog' ? 'dialog' : 'card'}
          title={t(`modal.${variant.value}`)}
          fullscreen={variant.value === 'fullscreen'}
          draggable={variant.value !== 'fullscreen'}
          cardWidth={`min(${width.value ?? 480}px, calc(100vw - 32px))`}
          dialogWidth="min(380px, calc(100vw - 32px))"
          closable
          onAfterLeave={() => {
            last.value = variant.value
          }}
        >
          {content()}
        </RModal>
      </DemoPage>
    )
  },
})
