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

import { completeSize, call } from '@/utils'
import props from './props'

export default defineComponent({
  name: 'RIcon',
  props,
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
