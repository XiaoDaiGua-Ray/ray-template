/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-06-09
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/**
 *
 * RayIframe 组件使用示例
 *
 * 具体使用参考 props 代码注释
 * 做了简单的一个组件封装, 希望有用
 */

import { NCard, NSpace } from 'naive-ui'
import RayIframe from '@/components/RayIframe/index'

const IframeDemo = defineComponent({
  name: 'IframeDemo',
  setup() {
    return {}
  },
  render() {
    return (
      <NSpace vertical size={[20, 20]}>
        <NCard title="naive ui（延迟加载）">
          <RayIframe
            src="https://www.naiveui.com/zh-CN/dark"
            height="300"
            allow="fullscreen"
          />
        </NCard>
        <NCard title="vue-hooks-plus（立即加载）">
          <RayIframe
            src="https://inhiblabcore.github.io/docs/hooks/"
            height="300"
            lazy={false}
          />
        </NCard>
      </NSpace>
    )
  },
})

export default IframeDemo
