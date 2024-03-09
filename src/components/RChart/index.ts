import RChart from './src'
import chartProps from './src/props'

import type { ExtractPublicPropTypes } from 'vue'

import type * as RChartType from './src/types'

export type ChartProps = ExtractPublicPropTypes<typeof chartProps>
export type { RChartType }

export { RChart, chartProps }
