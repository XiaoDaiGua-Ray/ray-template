import './index.scss'

import { NSpin } from 'naive-ui'

import { call, completeSize } from '@/utils'
import props from './props'
import { useEventListener } from '@vueuse/core'
import { useTemplateRef } from 'vue'

export default defineComponent({
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
    const iframeRef = useTemplateRef<HTMLIFrameElement>('iframeRef')
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

    useEventListener(iframeRef, 'load', iframeLoadSuccess)
    useEventListener(iframeRef, 'error', iframeLoadError)

    expose({
      iframeInst: iframeRef,
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
                class={['ray-iframe__container', this.iframeClass]}
                ref="iframeRef"
                src={this.src}
                allow={this.allow}
                name={this.name}
                title={this.title}
                loading={typeof this.lazy === 'boolean' ? 'lazy' : this.lazy}
              />
            ),
          }}
        </NSpin>
      </div>
    )
  },
})
