import type { ExtractPublicPropTypes } from 'vue'
import RIframe from './src/Iframe'
import iframeProps from './src/props'
import type * as RIframeType from './src/types'

export type IframeProps = ExtractPublicPropTypes<typeof iframeProps>
export type { RIframeType }

export { RIframe, iframeProps }
