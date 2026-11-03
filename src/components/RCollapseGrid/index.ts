import type { ExtractPublicPropTypes } from 'vue'
import RCollapseGrid from './src'
import collapseGridProps from './src/props'
import type * as RCollapseGridType from './src/types'

export type CollapseGridProps = ExtractPublicPropTypes<typeof collapseGridProps>
export type { RCollapseGridType }

export { RCollapseGrid, collapseGridProps }
