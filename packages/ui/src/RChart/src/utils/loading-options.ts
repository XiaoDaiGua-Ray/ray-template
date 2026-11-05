import { color } from 'echarts/core'
import type { ChartThemeRawArray, LoadingOptions } from '../types'

export const loadingOptions = (
  theme: ChartThemeRawArray['theme'] | undefined,
  dark: boolean,
  text: string,
  overrides: Partial<LoadingOptions>,
): LoadingOptions => {
  return {
    text,
    color: theme?.color?.[0] ?? (dark ? '#aabaff' : '#3b63d9'),
    textColor: theme?.textStyle?.color ?? (dark ? '#e9eef7' : '#1d2a3e'),
    maskColor:
      color.modifyAlpha(theme?.backgroundColor, 0.9) ??
      (dark ? 'rgba(23, 33, 49, 0.9)' : 'rgba(255, 255, 255, 0.9)'),
    zlevel: 0,
    fontSize: 12,
    showSpinner: true,
    spinnerRadius: 9,
    lineWidth: 2,
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontFamily: theme?.textStyle?.fontFamily ?? 'sans-serif',
    ...overrides,
  }
}
