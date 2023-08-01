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
import RayIcon from '@/components/RayIcon/index'

import { tooltipProps } from 'naive-ui'

const TooltipIcon = defineComponent({
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
  setup(_, { emit }) {
    const handleClick = (e?: MouseEvent) => {
      emit('click', e)
    }
    return {
      handleClick,
    }
  },
  render() {
    return (
      <NTooltip {...this.$props}>
        {{
          trigger: () => (
            <RayIcon
              name={this.iconName}
              size="18"
              customClassName={`tooltip-text__icon ${this.customClassName}`}
              cursor="pointer"
              onClick={this.handleClick.bind(this)}
            />
          ),
          default: () => this.tooltipText,
        }}
      </NTooltip>
    )
  },
})

export default TooltipIcon
