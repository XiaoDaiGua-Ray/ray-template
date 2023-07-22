/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-06-02
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/**
 *
 * 错误页面
 *
 * 基于 NResult 组件实现, 继承该组件所有 props 与 slots
 * 可以当作一个组件使用, 也可以当作一个页面调用
 */

import './index.scss'

import { NResult, NButton } from 'naive-ui'

import { redirectRouterToDashboard } from '@/router/helper/routerCopilot'
import { resultProps } from 'naive-ui'

const PageResult = defineComponent({
  name: 'PageResult',
  props: {
    ...resultProps,
  },
  render() {
    return (
      <div class="error-page">
        <NResult {...this.$props} status="500" title="小调皮你走错地方了">
          {{
            ...this.$slots,
            footer: () => (
              <NButton onClick={redirectRouterToDashboard.bind(this, true)}>
                返回首页
              </NButton>
            ),
          }}
        </NResult>
      </div>
    )
  },
})

export default PageResult
