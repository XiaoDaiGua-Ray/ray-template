import type { LoadingOptions } from '../types'

/**
 *
 * @param options 加载自定义配置项
 * @param theme 是否使用暗色主题
 *
 * @description
 * chart 加载配置项。
 *
 * @see https://echarts.apache.org/zh/api.html#echartsInstance.showLoading
 *
 * @example
 * const options = loadingOptions({ ...LoadingOptions })
 */
export const loadingOptions = (options?: LoadingOptions, theme = false) => {
  return Object.assign({}, options, {
    text: 'loading',
    color: '#c23531',
    textColor: theme ? '#fff' : '#000',
    maskColor: theme ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
    zlevel: 0,
    fontSize: 12,
    showSpinner: true,
    spinnerRadius: 10,
    lineWidth: 5,
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontFamily: 'sans-serif',
  })
}
