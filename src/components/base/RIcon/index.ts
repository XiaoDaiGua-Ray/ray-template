import type { ExtractPublicPropTypes } from 'vue'
import RIcon from './src/Icon'
import iconProps from './src/props'

export type IconProps = ExtractPublicPropTypes<typeof iconProps>

export { RIcon, iconProps }
