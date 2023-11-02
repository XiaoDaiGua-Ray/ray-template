/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-10-21
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import { NDropdown } from 'naive-ui'
import RIcon from '@/components/RIcon/index'

import props from './props'
import { renderNode } from '@use-utils/vue/index'

export default defineComponent({
  name: 'RMoreDropdown',
  props,
  render() {
    const { iconSize, cursor } = this
    const { default: $default } = this.$slots

    return (
      <NDropdown {...this.$props} {...this.$attrs} placement="bottom-start">
        {renderNode($default, {
          defaultElement: <RIcon name="more" size={iconSize} cursor={cursor} />,
        })}
      </NDropdown>
    )
  },
})
