import RQRCode from './src'
import qrcodeProps from './src/props'

import type * as RQRCodeType from './src/type'
import type { ExtractPublicPropTypes } from 'vue'

export type QRCodeProps = ExtractPublicPropTypes<typeof qrcodeProps>
export type { RQRCodeType }

export { RQRCode, qrcodeProps }
