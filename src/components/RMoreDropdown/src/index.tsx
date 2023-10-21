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

export default defineComponent({
  name: 'RMoreDropdown',
  props,
  render() {
    const { iconSize } = this

    return (
      <NDropdown {...this.$props} {...this.$attrs}>
        {this.$slots.default ? (
          this.$slots.default()
        ) : (
          <RIcon name="more" size={iconSize} />
        )}
      </NDropdown>
    )
  },
})
