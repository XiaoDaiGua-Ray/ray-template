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
import { completeSize } from '@/utils'

export default defineComponent({
  name: 'RBarcode',
  props,
  setup(props) {
    const barcodeRef = ref<HTMLCanvasElement | HTMLOrSVGElement>()
    const cssVars = computed(() => {
      const cssVar = {
        '--r-barcode-width': completeSize(props.width),
        '--r-barcode-height': completeSize(props.height),
      }

      return cssVar
    })

    const barcodeRender = () => {
      const { format, text = '', options } = props

      const assignOptions = Object.assign({}, options, {
        format,
      })

      barcode(barcodeRef.value, text, assignOptions)
    }

    onMounted(() => {
      barcodeRender()
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
