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
      default: '',
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
      type: String,
      default: '',
    },
  },
  setup(props) {
    const modelColor = computed(() => props.color)
    const symbolId = computed(() => `#${props.prefix}-${props.name}`)

    return {
      modelColor,
      symbolId,
    }
  },
  render() {
    return (
      <div class={`ray-icon ${this.customClassName}`}>
        <svg
          ariaHidden={true}
          style={{
            width: `${this.width ? this.width : this.size}px`,
            height: `${this.height ? this.height : this.size}px`,
          }}
        >
          <use xlink:href={this.symbolId} fill={this.modelColor} />
        </svg>
      </div>
    )
  },
})

export default RayIcon
