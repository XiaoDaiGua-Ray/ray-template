import type { IconName } from '@/icons'
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
    default: 14,
  },
  cursor: {
    type: String,
    default: 'default',
  },
} as const

export default props
