import { USE_CHART_PROVIDER_KEY } from '../config'
import type { ChartTheme } from '../types'

export interface ChartProviderOptions {
  theme: ChartTheme
}

/**
 *
 * @param 配置项
 *
 * @description
 * 全局 chart 配置项。
 */
export const useChartProvider = (options: Partial<ChartProviderOptions>) => {
  provide(USE_CHART_PROVIDER_KEY, options)
}
