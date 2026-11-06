import { provide } from 'vue'
import { USE_CHART_PROVIDER_KEY } from '../config'
import type { ChartTheme } from '../types'

export interface ChartProviderOptions {
  theme: ChartTheme
}

/**
 *
 * @param options 提供给当前后代图表的配置
 *
 * @description
 * 全局 chart 配置项。
 */
export const useChartProvider = (options: Partial<ChartProviderOptions>) => {
  provide(USE_CHART_PROVIDER_KEY, options)
}
