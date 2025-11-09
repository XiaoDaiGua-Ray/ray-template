import './index.scss'

import { NSpin } from 'naive-ui'

import barcode from 'jsbarcode'
import props from './props'
import { completeSize, call } from '@/utils'
import { useTemplateRef } from 'vue'
import { useResizeObserver } from '@vueuse/core'

import type { WatchStopHandle } from 'vue'
import type { UseResizeObserverReturn } from '@vueuse/core'

export default defineComponent({
  name: 'RBarcode',
  props,
  setup(props) {
    const barcodeRef = useTemplateRef<HTMLCanvasElement | HTMLOrSVGElement>(
      'barcodeRef',
    )
    const containerRef = useTemplateRef<HTMLDivElement>('containerRef')
    const containerSize = ref({ width: 0, height: 0 })
    let resizeObserverReturn: UseResizeObserverReturn | null

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
    let watchStop: WatchStopHandle

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
        if (containerSize.value.width > 0) {
          if (props.width === 'responsive') {
            assignOptions.width = Math.max(1, containerSize.value.width / 100)
          }

          if (props.height === 'responsive') {
            assignOptions.height = Math.max(
              20,
              containerSize.value.height * 0.8,
            )
          }
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

    watchEffect(() => {
      if (props.watchText) {
        watchStop?.()

        watchStop = watch(() => props.text, barcodeRender)
      } else {
        watchStop?.()
      }

      // 监听容器尺寸变化
      if (props.responsive) {
        resizeObserverReturn?.stop()

        resizeObserverReturn = useResizeObserver(
          containerRef,
          (entries: readonly ResizeObserverEntry[]) => {
            const entry = entries[0]

            if (entry) {
              const { width, height } = entry.contentRect

              containerSize.value = { width, height }

              nextTick(() => {
                barcodeRender()
              })
            }
          },
        )
      } else {
        resizeObserverReturn?.stop()

        resizeObserverReturn = null
      }
    })

    onMounted(() => {
      // 初始化容器尺寸
      if (containerRef.value) {
        const rect = containerRef.value.getBoundingClientRect()

        containerSize.value = { width: rect.width, height: rect.height }
      }

      nextTick(() => {
        barcodeRender()
      })
    })
    onBeforeUnmount(() => {
      watchStop?.()
    })

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
