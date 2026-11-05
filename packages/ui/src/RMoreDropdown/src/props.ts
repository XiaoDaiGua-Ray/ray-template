import type { IconName } from '@ray-template/icons'
import { dropdownProps } from 'naive-ui'
import type { PropType } from 'vue'

const props = {
  ...dropdownProps,
  icon: {
    type: String as PropType<IconName>,
    default: 'action/more',
  },
  iconSize: {
    type: Number,
  },
  cursor: {
    type: String,
    default: 'inherit',
  },
} as const

export default props
