import { defineComponent, PropType } from 'vue'
import './index.scss'
import ScrollReveal from 'scrollreveal'

const RayScrollReveal = defineComponent({
  name: 'RayScrollReveal',
  props: {
    options: {
      // ScrollReveal reveal options
      type: Object as PropType<scrollReveal.ScrollRevealObjectOptions>,
    },
    width: {
      type: String,
    },
    reset: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['scrollRevealSync'],
  setup(props, { emit }) {
    const scrollRevealRef = ref<HTMLElement>()
    const cssVarsRef = computed(() => {
      const scsVars = {
        '--ray-scroll-reveal-width': props.width,
      }

      return scsVars
    })
    let scrollRevealCore: scrollReveal.ScrollRevealObject

    /**
     *
     * 为 `dom` 注册 `ScrollReveal` 动画效果
     */
    const handleRegisterScrollReveal = async () => {
      const el = scrollRevealRef.value as HTMLElement
      const defaultOptions = {
        distance: '50px',
        duration: 600,
        reset: props.reset,
        easing: 'ease',
        scale: 0.99,
        mobile: true,
      }

      scrollRevealCore = ScrollReveal().reveal(
        el,
        Object.assign(defaultOptions, props.options),
      )
    }

    /**
     *
     * 处理 `dom` 新增后无法绑定过渡动画情况
     */
    const handleScrollRevealSync = async () => {
      const { sync } = scrollRevealCore

      emit('scrollRevealSync', sync)
    }

    onMounted(async () => {
      await handleRegisterScrollReveal()
      await handleScrollRevealSync()
    })

    return {
      scrollRevealRef,
      cssVarsRef,
    }
  },
  render() {
    return (
      <div
        class="ray-scroll-reveal"
        ref="scrollRevealRef"
        style={this.cssVarsRef}
      >
        {this.$slots.default?.()}
      </div>
    )
  },
})

export default RayScrollReveal

/**
 *
 * 滚动加载过度组件, 来回滚动时, 可以重复触发效果
 * 只需要将 `dom` 插入在 `RayScrollReveal` 组件下即可
 * 如果需要使用重新注册加载脚本或者有新的 `dom` 插入, 调用 `scrollRevealCallback` 函数即可捕获添加到 `dom` 的任何新元素
 * 注意: 插件始终是以显示屏为窗口作为判断元素是否显示, 所以自定义滚动条滚动加载元素不生效
 */
