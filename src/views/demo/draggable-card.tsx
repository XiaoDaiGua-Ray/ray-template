import { RDraggableCard } from '@/components'
import { NButton, NCard, NFlex } from 'naive-ui'

export default defineComponent({
  name: 'DraggableCardDemo',
  setup() {
    const card3 = ref(false)

    return {
      card3,
    }
  },
  render() {
    const { card3 } = this

    return (
      <div>
        <RDraggableCard animation title="Body">
          我被限制在 body 中。
        </RDraggableCard>
        {card3 ? (
          <RDraggableCard
            animation
            title="Layout Container"
            restrictionElement=".r-layout-full__viewer-content"
            closable
            onClose={() => (this.card3 = false)}
          >
            {{
              default: () =>
                '我被限制在 Layout Container 中。并且我支持 NCard 的所有配置与插槽。',
              'header-extra': () => '其实我就是 NCard 封装的',
              footer: () => '我支持 footer 插槽',
              action: () => '我支持 action 插槽',
            }}
          </RDraggableCard>
        ) : null}
        <NCard title="显示与隐藏卡片">
          <NButton type="primary" onClick={() => (this.card3 = !this.card3)}>
            点一下试试
          </NButton>
        </NCard>
      </div>
    )
  },
})
