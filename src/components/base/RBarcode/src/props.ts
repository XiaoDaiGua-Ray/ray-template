import type { MaybeArray } from '@/types'
import type { PropType } from 'vue'
import type {
  RBarcodeFormat,
  RBarcodeOptions,
  RBarcodeRender,
  RBarcodeSize,
} from './types'

const props = {
  /**
   *
   * @description
   * 条形码宽度。
   * - 数字：固定宽度（单位：px）
   * - 'auto'：自动宽度
   * - 其他字符串：CSS 宽度值（如 '100%', '200px'）
   *
   * @default 'auto'
   * @example
   * width={200}
   * width="auto"
   * width="responsive"
   * width="100%"
   */
  width: {
    type: [String, Number] as PropType<RBarcodeSize>,
    default: 'auto' as const,
  },
  /**
   *
   * @description
   * 条形码高度。
   * - 数字：固定高度（单位：px）
   * - 'auto'：自动高度
   * - 其他字符串：CSS 高度值（如 '100%', '200px'）
   *
   * @default 'auto'
   * @example
   * height={100}
   * height="auto"
   * height="responsive"
   * height="50%"
   */
  height: {
    type: [String, Number] as PropType<RBarcodeSize>,
    default: 'auto' as const,
  },
  /**
   *
   * @description
   * 是否显示 loading 状态。
   *
   * @default false
   */
  loading: {
    type: Boolean,
    default: false,
  },
  /**
   *
   * @description
   * 条形码渲染模式。
   * 允许配置为 svg 或 canvas。
   *
   * @default 'canvas'
   */
  barcodeRender: {
    type: String as PropType<RBarcodeRender>,
    default: 'canvas',
    validator: (value: RBarcodeRender) => ['canvas', 'svg'].includes(value),
  },
  /**
   *
   * @description
   * 条形码内容。
   *
   * @default undefined
   */
  text: {
    type: String,
  },
  /**
   *
   * @description
   * 渲染配置项。
   *
   * @see https://github.com/lindell/JsBarcode/wiki/Options
   *
   * @default {}
   */
  options: {
    type: Object as PropType<RBarcodeOptions>,
    default: () => ({}),
  },
  /**
   *
   * @description
   * 条形码输出格式，该配置项优先级最高。
   *
   * @default 'CODE128'
   */
  format: {
    type: String as PropType<RBarcodeFormat>,
    default: () => 'CODE128',
  },
  /**
   *
   * @description
   * 是否监听 text 变化，当 text 变化时，会重新生成条形码。
   *
   * @default true
   */
  watchText: {
    type: Boolean,
    default: true,
  },
  /**
   *
   * @description
   * 条形码渲染成功时的回调函数。
   *
   * @default undefined
   */
  onSuccess: {
    type: [Function, Array] as PropType<
      MaybeArray<
        (
          currentText: string | undefined,
          format: RBarcodeFormat,
          option: RBarcodeOptions,
        ) => void
      >
    >,
  },
  /**
   *
   * @description
   * 条形码渲染失败时的回调函数。
   *
   * @default undefined
   */
  onError: {
    type: [Function, Array] as PropType<MaybeArray<(err: Error) => void>>,
  },
  /**
   *
   * @description
   * 条形码渲染结束后的回调函数，无论成功或失败都会触发。
   *
   * @default undefined
   */
  onFinally: {
    type: [Function, Array] as PropType<MaybeArray<() => void>>,
  },
  /**
   *
   * @description
   * 是否启用响应式尺寸，当容器大小变化时自动重新渲染条形码。
   *
   * 如果启用了该属性，width 和 height 配置项将失效。
   *
   * @default false
   */
  responsive: {
    type: Boolean,
    default: false,
  },
} as const

export default props
