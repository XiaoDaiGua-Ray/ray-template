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

const RayTooltipIcon = defineComponent({
  name: 'RayTooltipIcon',
  props: {
    ...tooltipProps,
    iconName: {
      type: String,
      required: true,
    },
    customClassName: {
      type: String,
      default: '',
    },
    tooltipText: {
      type: String,
      default: '',
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
              customClassName={`ray-tooltip-text__icon ${this.customClassName}`}
              onClick={this.handleClick.bind(this)}
            />
          ),
          default: () => this.tooltipText,
        }}
      </NTooltip>
    )
  },
})

export default RayTooltipIcon
