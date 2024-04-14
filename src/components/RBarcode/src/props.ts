import type { RBarcodeRender, RBarcodeOptions, RBarcodeFormat } from './types'
import type { PropType } from 'vue'

const props = {
  /**
   *
   * @description
   * 条形码宽度。
   *
   * @default 'auto'
   */
  width: {
    type: [String, Number] as PropType<string | number>,
    default: 'auto',
  },
  /**
   *
   * @description
   * 条形码高度。
   *
   * @default 'auto'
   */
  height: {
    type: [String, Number] as PropType<string | number>,
    default: 'auto',
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
} as const

export default props
