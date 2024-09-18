/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2024-04-14
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import './index.scss'

import { NSpin } from 'naive-ui'

import barcode from 'jsbarcode'
import props from './props'
import { completeSize, call } from '@/utils'
import { useTemplateRef } from 'vue'

import type { WatchStopHandle } from 'vue'

export default defineComponent({
  name: 'RBarcode',
  props,
  setup(props) {
    const barcodeRef = useTemplateRef<HTMLCanvasElement | HTMLOrSVGElement>(
      'barcodeRef',
    )
    const cssVars = computed(() => {
      const cssVar = {
        '--r-barcode-width': completeSize(props.width),
        '--r-barcode-height': completeSize(props.height),
      }

      return cssVar
    })
    let watchStop: WatchStopHandle

    const barcodeRender = () => {
      try {
        const { format, text, options, onSuccess } = props

        const assignOptions = Object.assign({}, options, {
          format,
        })

        barcode(
          barcodeRef.value,
          text !== void 0 && text !== null ? text.toString() : '',
          assignOptions,
        )

        if (onSuccess) {
          call(onSuccess, text, format, options)
        }
      } catch (e) {
        const { onError } = props

        if (onError) {
          call(onError, e as Error)
        }
      } finally {
        const { onFinally } = props

        if (onFinally) {
          call(onFinally)
        }
      }
    }

    watchEffect(() => {
      if (props.watchText) {
        watchStop = watch(() => props.text, barcodeRender)
      } else {
        watchStop?.()
      }
    })

    onMounted(() => {
      barcodeRender()
    })
    onBeforeUnmount(() => {
      watchStop?.()
    })

    return {
      barcodeRef,
      cssVars,
    }
  },
  render() {
    const { barcodeRender, loading, cssVars } = this
    const c = [
      'r-barcode',
      {
        'r-barcode--loading': loading,
      },
    ]

    return (
      <NSpin class="r-barcode-spin" show={loading}>
        {barcodeRender === 'canvas' ? (
          <canvas class={c} style={cssVars} ref="barcodeRef" />
        ) : (
          <svg class={c} style={cssVars} ref="barcodeRef" />
        )}
      </NSpin>
    )
  },
})
