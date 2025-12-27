import './index.scss'
import { RIcon } from '@/components'
import { NTooltip, tooltipProps } from 'naive-ui'
import type { TooltipProps } from 'naive-ui'

export default defineComponent({
  name: 'TooltipIcon',
  props: {
    ...tooltipProps,
    iconName: {
      type: String,
      required: true,
    },
    customClassName: {
      type: String,
      default: null,
    },
    tooltipText: {
      type: String,
      default: null,
    },
  },
  emits: ['click'],
  setup(props, { emit }) {
    const iconClick = (e?: MouseEvent) => {
      emit('click', e)
    }

    const Icon = () => (
      <RIcon
        name={props.iconName}
        size="18"
        customClassName={`tooltip-text__icon ${props.customClassName}`}
        cursor="pointer"
        onClick={iconClick.bind(this)}
      />
    )

    return {
      iconClick,
      Icon,
    }
  },
  render() {
    const { Icon } = this

    return this.tooltipText ? (
      <NTooltip {...(this.$props as TooltipProps)}>
        {{
          trigger: () => <Icon />,
          default: () => this.tooltipText,
        }}
      </NTooltip>
    ) : (
      <Icon />
    )
  },
})
