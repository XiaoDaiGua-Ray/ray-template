import RBarcode from './src/Barcode'
import barcodeProps from './src/props'

import type { ExtractPublicPropTypes } from 'vue'

export type BarcodeProps = ExtractPublicPropTypes<typeof barcodeProps>

export { RBarcode, barcodeProps }
