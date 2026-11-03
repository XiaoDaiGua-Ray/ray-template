import { RIframe } from '@/components'
import { NCard, NFlex } from 'naive-ui'

const IframeDemo = defineComponent({
  name: 'IframeDemo',
  setup() {
    return {}
  },
  render() {
    return (
      <NFlex vertical size={[20, 20]}>
        <NCard title="naive ui（延迟加载）">
          <RIframe
            src="https://www.naiveui.com/zh-CN/dark"
            height="300"
            allow="fullscreen"
          />
        </NCard>
        <NCard title="vue-hooks-plus（立即加载）">
          <RIframe
            src="https://inhiblabcore.github.io/docs/hooks/"
            height="300"
            lazy={false}
          />
        </NCard>
      </NFlex>
    )
  },
})

export default IframeDemo
