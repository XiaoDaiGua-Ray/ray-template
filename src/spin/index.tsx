/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-01-18
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/**
 *
 * 全屏加载效果
 *
 * 基于 Naive UI Spin 组件
 *
 * 使用方法
 *   1. import { setVariable } from '@/hooks/variable/index'
 *   2. setVariable('globalSpinning', true) | setVariable('globalSpinning', false)
 *
 * 仅需按照上述步骤实现全屏加载动画
 *
 * 注意
 *   1. 该组件为全屏加载动画效果, 其遮罩会导致页面元素不可被命中
 *   2. 如果需要使用该组件请注意控制取消时机
 */

import { NSpin } from 'naive-ui'

import { spinProps } from 'naive-ui'
import { globalVariableToRefs } from '@/hooks/variable/index'

const GlobalSpin = defineComponent({
  name: 'GlobalSpin',
  props: {
    ...spinProps,
  },
  setup() {
    const overrides = {
      opacitySpinning: '0.3',
    }
    const spinValue = globalVariableToRefs('globalSpinning')

    return {
      spinValue,
      overrides,
    }
  },
  render() {
    return (
      <NSpin
        {...this.$props}
        show={this.spinValue}
        themeOverrides={this.overrides}
      >
        {{ ...this.$slots }}
      </NSpin>
    )
  },
})

export default GlobalSpin
