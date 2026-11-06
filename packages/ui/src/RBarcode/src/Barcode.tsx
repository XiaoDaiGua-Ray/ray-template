import './index.scss'
import { completeSize } from '@ray-template/composables/element'
import { call } from '@ray-template/composables/vue/call'
import { useResizeObserver } from '@vueuse/core'
import barcode from 'jsbarcode'
import { NSpin } from 'naive-ui'
import { computed, defineComponent, ref, useTemplateRef, watch } from 'vue'
import props from './props'

export default defineComponent({
  name: 'RBarcode',
  props,
  setup(props) {
    const barcodeRef = useTemplateRef<HTMLCanvasElement | HTMLOrSVGElement>(
      'barcodeRef',
    )
    const containerRef = useTemplateRef<HTMLDivElement>('containerRef')
    const containerSize = ref({ width: 0, height: 0 })

    const cssVars = computed(() => {
      let width = completeSize(props.width)
      let height = completeSize(props.height)

      if (props.width === 'responsive' && containerSize.value.width > 0) {
        width = `${containerSize.value.width}px`
      }

      if (props.height === 'responsive' && containerSize.value.height > 0) {
        height = `${containerSize.value.height}px`
      }

      const cssVar = {
        '--r-barcode-width': width,
        '--r-barcode-height': height,
      }

      return cssVar
    })
    /**
     *
     * @description
     * 在 DOM 更新后重绘当前条码；复用同一观察器，配置变化由 Vue 合并到一次渲染。
     */
    const barcodeRender = () => {
      if (!barcodeRef.value) {
        return
      }

      try {
        const { format, text, options, onSuccess } = props

        const assignOptions = Object.assign({}, options, {
          format,
        })

        // 如果是响应式模式，根据容器尺寸调整条形码选项
        if (props.width === 'responsive' && containerSize.value.width > 0) {
          assignOptions.width = Math.max(1, containerSize.value.width / 100)
        }

        if (props.height === 'responsive' && containerSize.value.height > 0) {
          assignOptions.height = Math.max(20, containerSize.value.height * 0.8)
        }

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

    useResizeObserver(
      () => (props.responsive ? containerRef.value : null),
      ([entry]) => {
        if (!entry) return

        const { width, height } = entry.contentRect
        const previous = containerSize.value

        if (previous.width !== width || previous.height !== height)
          containerSize.value = { width, height }
      },
    )

    watch(
      [
        barcodeRef,
        () => (props.watchText ? props.text : void 0),
        () => props.format,
        () => props.options,
        () => props.width,
        () => props.height,
        () => props.responsive,
        containerSize,
      ],
      barcodeRender,
      { deep: true, flush: 'post' },
    )

    return {
      barcodeRef,
      containerRef,
      cssVars,
    }
  },
  render() {
    const { barcodeRender, loading, cssVars, responsive } = this
    const c = [
      'r-barcode',
      {
        'r-barcode--loading': loading,
      },
    ]

    const barcodeElement =
      barcodeRender === 'canvas' ? (
        <canvas class={c} style={cssVars} ref="barcodeRef" />
      ) : (
        <svg class={c} style={cssVars} ref="barcodeRef" />
      )

    return (
      <NSpin class="r-barcode-spin" show={loading}>
        {responsive ? (
          <div class="r-barcode-container" ref="containerRef">
            {barcodeElement}
          </div>
        ) : (
          barcodeElement
        )}
      </NSpin>
    )
  },
})
