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
        '--r-icon-width': props.width
          ? completeSize(props.width)
          : completeSize(props.size),
        '--r-icon-height': props.height
          ? completeSize(props.height)
          : completeSize(props.size),
        '--r-icon-depth': props.depth,
        '--r-icon-cursor': props.cursor,
        '--r-icon-color': props.color,
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
        class={['r-icon', this.customClassName]}
        style={[this.cssVars]}
        onClick={this.iconClick}
      >
        <svg
          {...({
            RIconAttribute: 'r-icon',
            ariaHidden: true,
          } as object)}
        >
          <use
            {...{
              'xlink:href': this.symbolId,
            }}
            fill={this.color}
          />
        </svg>
      </span>
    )
  },
})
