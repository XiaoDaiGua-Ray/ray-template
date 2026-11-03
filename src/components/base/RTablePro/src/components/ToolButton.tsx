import { RIcon } from '@/components/base/RIcon'
import type { IconName } from '@/icons'
import { NButton } from 'naive-ui'
import type { PropType } from 'vue'
import { config } from '../shared'

export default defineComponent({
  props: {
    icon: { type: String as PropType<IconName>, required: true },
    label: { type: String, required: true },
    disabled: Boolean,
    onClick: {
      type: Function as PropType<(event: MouseEvent) => unknown>,
      default: void 0,
    },
  },
  setup(props) {
    return () => (
      <NButton
        quaternary
        size="small"
        class="r-table__tool"
        aria-label={props.label}
        {...{ title: props.label }}
        disabled={props.disabled}
        onClick={props.onClick}
      >
        {{
          icon: () => <RIcon name={props.icon} size={config.tableIconSize} />,
        }}
      </NButton>
    )
  },
})
