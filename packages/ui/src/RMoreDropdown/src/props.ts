import type { IconName } from '@ray-template/icons'
import { dropdownProps } from 'naive-ui'
import type { PropType } from 'vue'

const props = {
  ...dropdownProps,
  placement: {
    ...dropdownProps.placement,
    default: 'bottom-start',
  },
  icon: {
    type: String as PropType<IconName>,
    default: 'action/more',
  },
  iconSize: {
    type: Number,
  },
  /** 默认图标按钮的可访问名称，自定义触发插槽自行提供名称 */
  triggerLabel: String,
  cursor: {
    type: String,
    default: 'inherit',
  },
} as const

export default props
