import { color } from 'echarts/core'
import type { ChartThemeRawArray, LoadingOptions } from '../types'

/**
 *
 * @param theme 已注册的图表主题；内建或缺失主题可不提供
 * @param dark 当前图表是否使用暗色模式
 * @param text 已翻译的加载文字
 * @param overrides 调用方指定的覆盖字段
 *
 * @description
 * 从图表主题生成加载层样式；透明或无效背景回退到当前明暗模式的表面色。
 *
 * @returns 合并后的 ECharts 加载选项，调用方字段具有最高优先级。
 */
export const loadingOptions = (
  theme: ChartThemeRawArray['theme'] | undefined,
  dark: boolean,
  text: string,
  overrides: Partial<LoadingOptions>,
): LoadingOptions => {
  const background =
    typeof theme?.backgroundColor === 'string'
      ? color.parse(theme.backgroundColor)
      : void 0
  // transparent 的 RGB 分量为黑色，直接改透明度会在浅色图表上产生黑色遮罩。
  const mask = background?.[3]
    ? background
    : color.parse(dark ? '#172131' : '#fff')!

  mask[3] = 0.9

  return {
    text,
    color: theme?.color?.[0] ?? (dark ? '#aabaff' : '#3b63d9'),
    textColor: theme?.textStyle?.color ?? (dark ? '#e9eef7' : '#1d2a3e'),
    maskColor: color.stringify(mask, 'rgba'),
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
