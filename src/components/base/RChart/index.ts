import type { ExtractPublicPropTypes } from 'vue'
import RChart from './src/Chart'
import useChart from './src/hooks/useChart'
import type { UseChartReturn } from './src/hooks/useChart'
import chartProps from './src/props'
import type * as RChartType from './src/types'

export type ChartProps = ExtractPublicPropTypes<typeof chartProps>
export type { RChartType, UseChartReturn }

export { RChart, chartProps, useChart }
