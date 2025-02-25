import { RDraggableCard } from '@/components'
import { NButton, NCard, NFlex, NRadio, NRadioGroup, NSwitch } from 'naive-ui'

import type { DefaultPosition } from '@/components'

export default defineComponent({
  name: 'DraggableCardDemo',
  setup() {
    const card3 = ref(false)
    const domRef = useTemplateRef<HTMLElement>('domRef')
    const positionRadioOptions = [
      { label: 'center', value: 'center' },
      { label: 'top-center', value: 'top-center' },
      { label: 'bottom-center', value: 'bottom-center' },
      { label: 'top-left', value: 'top-left' },
      { label: 'top-right', value: 'top-right' },
      { label: 'bottom-left', value: 'bottom-left' },
      { label: 'bottom-right', value: 'bottom-right' },
    ]
    const positionRadioValue = ref('center')
    const card3Dad = ref(true)

    return {
      card3,
      card3Dad,
      domRef,
      positionRadioOptions,
      positionRadioValue,
    }
  },
  render() {
    const { card3, domRef, positionRadioOptions } = this

    return (
      <div>
        <div
          ref="domRef"
          style={{
            width: '100%',
            height: '400px',
            backgroundColor: 'rgba(255, 10, 20, 1)',
          }}
        ></div>
        <RDraggableCard animation title="Body">
          我被限制在 body 中。
        </RDraggableCard>
        {card3 ? (
          <RDraggableCard
            animation
            title="Custom Container"
            restrictionElement={domRef}
            closable
            onClose={() => (this.card3 = false)}
            defaultPosition={this.positionRadioValue as DefaultPosition}
            dad={this.card3Dad}
          >
            {{
              default: () =>
                '我被限制在红色区域中。并且我支持 NCard 的所有配置与插槽。',
              'header-extra': () => '其实我就是 NCard 封装的',
              footer: () => '我支持 footer 插槽',
              action: () => '我支持 action 插槽',
            }}
          </RDraggableCard>
        ) : null}
        <NCard title="显示与隐藏卡片">
          <NFlex vertical>
            <NFlex>
              <NSwitch v-model:value={this.card3Dad}>
                {{
                  checked: () => '拖拽',
                  unchecked: () => '禁用',
                }}
              </NSwitch>
            </NFlex>
            <NFlex>
              <NRadioGroup v-model:value={this.positionRadioValue}>
                {positionRadioOptions.map((curr) => (
                  <NRadio key={curr.value} value={curr.value}>
                    {curr.label}
                  </NRadio>
                ))}
              </NRadioGroup>
            </NFlex>
            <NFlex>
              <NButton
                type="primary"
                onClick={() => (this.card3 = !this.card3)}
              >
                点一下试试
              </NButton>
            </NFlex>
          </NFlex>
        </NCard>
      </div>
    )
  },
})
