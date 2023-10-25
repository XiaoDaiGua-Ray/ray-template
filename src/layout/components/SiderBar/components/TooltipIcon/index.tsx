/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2022-12-29
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import './index.scss'

import { NTooltip } from 'naive-ui'
import RIcon from '@/components/RIcon/index'

import { tooltipProps } from 'naive-ui'

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
      <NTooltip {...this.$props}>
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
