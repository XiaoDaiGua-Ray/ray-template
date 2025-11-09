import RIframe from './src/Iframe'
import iframeProps from './src/props'

import type * as RIframeType from './src/types'
import type { ExtractPublicPropTypes } from 'vue'

export type IframeProps = ExtractPublicPropTypes<typeof iframeProps>
export type { RIframeType }

export { RIframe, iframeProps }
