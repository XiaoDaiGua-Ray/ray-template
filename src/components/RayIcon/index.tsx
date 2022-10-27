import { defineComponent } from 'vue'

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
    },
    height: {
      type: [Number, String],
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
      <svg
        ariaHidden={true}
        class={`ray-icon ${this.customClassName}`}
        style={{
          width: `${this.width ? this.width : this.size}px`,
          height: `${this.height ? this.height : this.size}px`,
        }}
      >
        <use xlink:href={this.symbolId} fill={this.modelColor} />
      </svg>
    )
  },
})

export default RayIcon
