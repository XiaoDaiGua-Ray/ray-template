import type { IconName } from '@ray-template/icons'
import { NButton } from 'naive-ui'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import { RIcon } from '../../../RIcon'

export default defineComponent({
  props: {
    icon: { type: String as PropType<IconName>, required: true },
    label: { type: String, required: true },
    disabled: Boolean,
    loading: Boolean,
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
        loading={props.loading}
        onClick={props.onClick}
      >
        {{
          icon: () => <RIcon name={props.icon} />,
        }}
      </NButton>
    )
  },
})
