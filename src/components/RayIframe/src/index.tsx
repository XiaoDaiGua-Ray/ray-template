/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-06-09
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import './index.scss'

import { NSpin } from 'naive-ui'

import { completeSize, on, off } from '@use-utils/element'

import type { PropType } from 'vue'
import type { SpinProps } from 'naive-ui'

const RayIframe = defineComponent({
  name: 'RayIframe',
  props: {
    src: {
      /** iframe url */
      type: String,
      required: true,
    },
    iframeWrapperClass: {
      /** 自定义类名 */
      type: String,
      default: '',
    },
    frameborder: {
      /** 边框尺寸, 0 则不显示 */
      type: Number,
      default: 0,
    },
    width: {
      /** iframe 宽度 */
      type: [String, Number],
      default: '100%',
    },
    height: {
      /** iframe 高度 */
      type: [String, Number],
      default: '100%',
    },
    allow: {
      /**
       *
       * iframe 特征策略
       *
       * ```
       * 全屏激活: allow = 'fullscreen'
       * 允许跨域: allow = 'payment'
       * ```
       *
       * 但是该配置属性受到浏览器安全策略影响, 使用前请仔细阅读文档
       */
      type: String,
      default: null,
    },
    name: {
      /** iframe 定位嵌入的浏览上下文的名称 */
      type: String,
      default: null,
    },
    title: {
      /** 标识 iframe 的主要内容 */
      type: String,
      default: null,
    },
    success: {
      /**
       *
       * iframe 加载成功回调
       * 返回值: iframe 对象, Event
       */
      type: Function,
      default: null,
    },
    error: {
      /**
       *
       * iframe 加载失败回调
       * 返回值: iframe 对象, Event
       */
      type: Function,
      default: null,
    },
    customSpinProps: {
      type: Object as PropType<SpinProps>,
      default: () => ({}),
    },
  },
  setup(props) {
    const cssVars = computed(() => {
      const cssVar = {
        '--ray-iframe-frameborder': completeSize(props.frameborder),
        '--ray-iframe-width': completeSize(props.width),
        '--ray-iframe-height': completeSize(props.height),
      }

      return cssVar
    })
    const iframeRef = ref<HTMLIFrameElement>()
    const spinShow = ref(true)

    const iframeLoadSuccess = (e: Event) => {
      spinShow.value = false

      props.success?.(iframeRef.value, e)
    }

    const iframeLoadError = (e: Event) => {
      spinShow.value = false

      props.error?.(iframeRef.value, e)
    }

    const getIframeRef = () => {
      const iframeEl = iframeRef.value as HTMLElement

      return iframeEl
    }

    onMounted(() => {
      on(getIframeRef(), 'load', iframeLoadSuccess.bind(this))
      on(getIframeRef(), 'error', iframeLoadError)
    })

    onBeforeUnmount(() => {
      off(getIframeRef(), 'load', iframeLoadSuccess)
      off(getIframeRef(), 'error', iframeLoadError)
    })

    return {
      cssVars,
      iframeRef,
      spinShow,
    }
  },
  render() {
    return (
      <div
        class={['ray-iframe', this.iframeWrapperClass]}
        style={[this.cssVars]}
      >
        <NSpin {...this.customSpinProps} show={this.spinShow}>
          {{
            ...this.$slots,
            default: () => (
              <iframe
                class="ray-iframe__container"
                ref="iframeRef"
                src={this.src}
                allow={this.allow}
                name={this.name}
                title={this.title}
              ></iframe>
            ),
          }}
        </NSpin>
      </div>
    )
  },
})

export default RayIframe
