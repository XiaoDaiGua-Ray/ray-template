import type { ExtractPublicPropTypes } from 'vue'
import RMoreDropdown from './src/MoreDropdown'
import moreDropdownProps from './src/props'

export type MoreDropdownProps = ExtractPublicPropTypes<typeof moreDropdownProps>

export { RMoreDropdown, moreDropdownProps }
