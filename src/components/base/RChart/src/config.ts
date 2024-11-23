import type { InjectionKey } from 'vue'
import type { ChartProviderOptions } from './hooks/useChartProvider'

export const USE_CHART_PROVIDER_KEY: InjectionKey<
  Partial<ChartProviderOptions>
> = Symbol('USE_CHART_PROVIDER_KEY')
