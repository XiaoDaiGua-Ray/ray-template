import RIcon from './src'
import iconProps from './src/props'

import type { ExtractPublicPropTypes } from 'vue'

export type IconProps = ExtractPublicPropTypes<typeof iconProps>

export { RIcon, iconProps }
