import RBarcode from './src/Barcode'
import barcodeProps from './src/props'

import type { ExtractPublicPropTypes } from 'vue'
import type { RBarcodeSize } from './src/types'

// 扩展 BarcodeProps 以提供更好的类型提示
export type BarcodeProps = Omit<
  ExtractPublicPropTypes<typeof barcodeProps>,
  'width' | 'height'
> & {
  width?: RBarcodeSize
  height?: RBarcodeSize
}

export { RBarcode, barcodeProps }

export type {
  RBarcodeSize,
  RBarcodeRender,
  RBarcodeFormat,
  RBarcodeOptions,
} from './src/types'
