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

import { dropdownProps } from 'naive-ui'

const props = {
  ...dropdownProps,
  icon: {
    type: String,
    default: 'more',
  },
  iconSize: {
    type: Number,
    default: 14,
  },
  cursor: {
    type: String,
    default: 'default',
  },
} as const

export default props
