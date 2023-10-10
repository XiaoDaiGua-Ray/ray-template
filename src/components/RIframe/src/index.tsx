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
import { call } from '@/utils/vue/index'
import props from './props'

const RIframe = defineComponent({
  name: 'RIframe',
  props,
  setup(props, { expose }) {
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

      const { onSuccess } = props

      if (onSuccess) {
        call(onSuccess, iframeRef.value as HTMLIFrameElement, e)
      }
    }

    const iframeLoadError = (e: Event) => {
      spinShow.value = false

      const { onError } = props

      if (onError) {
        call(onError, e)
      }
    }

    const getIframeRef = () => {
      const iframeEl = iframeRef.value as HTMLElement

      return iframeEl
    }

    expose({
      iframeInst: iframeRef,
    })

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
                class={['ray-iframe__container', this.wrapperClass]}
                ref="iframeRef"
                src={this.src}
                allow={this.allow}
                name={this.name}
                title={this.title}
                {...{
                  loading: this.lazy ? 'lazy' : null,
                }}
              />
            ),
          }}
        </NSpin>
      </div>
    )
  },
})

export default RIframe
