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

const RayIcon = defineComponent({
  name: 'RayIcon',
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
      default: '',
    },
    depth: {
      /** 图标深度 */
      type: Number,
      default: 1,
    },
    cursorPointer: {
      /** 是否启用小手鼠标类型 */
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const modelColor = computed(() => props.color)
    const symbolId = computed(() => `#${props.prefix}-${props.name}`)
    const cssVars = computed(() => {
      const cssVar = {
        '--ray-icon-width': props.width
          ? props.width + 'px'
          : props.size + 'px',
        '--ray-icon-height': props.height
          ? props.height + 'px'
          : props.size + 'px',
        '--ray-icon-depth': props.depth,
      }

      if (props.cursorPointer) {
        cssVar['cursor'] = 'pointer'
      }

      return cssVar
    })

    return {
      modelColor,
      symbolId,
      cssVars,
    }
  },
  render() {
    return (
      <span class={['ray-icon', this.customClassName]} style={[this.cssVars]}>
        <svg rayIconAttribute="ray-icon" ariaHidden={true}>
          <use xlink:href={this.symbolId} fill={this.modelColor} />
        </svg>
      </span>
    )
  },
})

export default RayIcon
