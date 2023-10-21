/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-01-04
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import './index.scss'

import { call } from '@/utils/vue/index'
import { completeSize } from '@/utils/element'

import type { PropType } from 'vue'
import type { MaybeArray } from '@/types/modules/utils'

const RIcon = defineComponent({
  name: 'RIcon',
  props: {
    color: {
      type: String,
      default: 'currentColor',
    },
    prefix: {
      type: String,
      default: 'icon',
    },
    name: {
      type: String,
      required: true,
    },
    size: {
      type: [Number, String],
      default: 14,
    },
    width: {
      type: [Number, String],
      default: 0,
    },
    height: {
      type: [Number, String],
      default: 0,
    },
    customClassName: {
      /** 自定义 class name */
      type: String,
      default: null,
    },
    depth: {
      /** 图标深度 */
      type: Number,
      default: 1,
    },
    cursor: {
      /** 鼠标指针样式 */
      type: String,
      default: 'default',
    },
    onClick: {
      type: [Function, Array] as PropType<MaybeArray<(e: MouseEvent) => void>>,
      default: null,
    },
  },
  setup(props) {
    const symbolId = computed(() => `#${props.prefix}-${props.name}`)
    const cssVars = computed(() => {
      const cssVar = {
        '--ray-icon-width': props.width
          ? completeSize(props.width)
          : completeSize(props.size),
        '--ray-icon-height': props.height
          ? completeSize(props.height)
          : completeSize(props.size),
        '--ray-icon-depth': props.depth,
        '--ray-icon-cursor': props.cursor,
      }

      return cssVar
    })

    const iconClick = (e: MouseEvent) => {
      const { onClick } = props

      if (onClick) {
        call(onClick, e)
      }
    }

    return {
      symbolId,
      cssVars,
      iconClick,
    }
  },
  render() {
    return (
      <span
        class={['ray-icon', this.customClassName]}
        style={[this.cssVars]}
        onClick={this.iconClick.bind(this)}
      >
        <svg
          {...({ RayIconAttribute: 'ray-icon', ariaHidden: true } as object)}
        >
          <use {...{ 'xlink:href': this.symbolId }} fill={this.color} />
        </svg>
      </span>
    )
  },
})

export default RIcon
