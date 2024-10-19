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
