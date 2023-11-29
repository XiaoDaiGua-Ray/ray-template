import RIframe from './src'
import iframeProps from './src/props'

import type * as RIframeType from './src/type'
import type { ExtractPublicPropTypes } from 'vue'

export type IframeProps = ExtractPublicPropTypes<typeof iframeProps>
export type { RIframeType }

export { RIframe, iframeProps }
