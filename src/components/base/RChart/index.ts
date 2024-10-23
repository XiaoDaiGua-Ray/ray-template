import RChart from './src'
import chartProps from './src/props'
import useChart from './src/hooks/useChart'

import type { ExtractPublicPropTypes } from 'vue'
import type * as RChartType from './src/types'
import type { UseChartReturn } from './src/hooks/useChart'

export type ChartProps = ExtractPublicPropTypes<typeof chartProps>
export type { RChartType, UseChartReturn }

export { RChart, chartProps, useChart }
