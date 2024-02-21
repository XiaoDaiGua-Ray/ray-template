/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-07-22
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import type {
  ChartThemeRawArray,
  ChartThemeRawModules,
  LoadingOptions,
} from '@/components/RChart/src/type'

/**
 *
 * @description
 * 自动注册所有主题
 *
 * 默认以文件名当作主题名称
 *
 * 主题配置器：https://echarts.apache.org/zh/theme-builder.html
 * 流程：
 * 1. 配置、选择主题
 * 2. 点击下载主题
 * 3. 选择 json 类型，然后复制
 * 4. 在 echart-themes 包中创建对应的 json 文件，文件名为主题名称
 */
export const setupChartTheme = () => {
  // 获取所有主题
  const themeRawModules: Record<string, ChartThemeRawModules> =
    import.meta.glob('@/echart-themes/**/*.json', {
      eager: true,
    })
  const regex = /\/([^/]+)\.json$/

  const rawThemes = Object.keys(themeRawModules).reduce((pre, curr) => {
    const name = curr.match(regex)?.[1]

    if (name) {
      pre.push({
        name,
        theme: themeRawModules[curr].default,
      })

      return pre
    } else {
      throw new Error(`[RChart Theme Error]: name ${curr} is invalid!`)
    }
  }, [] as ChartThemeRawArray[])

  return rawThemes
}

/**
 *
 * @description
 * 为了方便使用加载动画, 写了此方法, 虽然没啥用
 */
export const loadingOptions = (options?: LoadingOptions) =>
  Object.assign(
    {},
    {
      text: 'loading',
      color: '#c23531',
      textColor: '#000',
      maskColor: 'rgba(255, 255, 255, 0.9)',
      zlevel: 0,
      fontSize: 12,
      showSpinner: true,
      spinnerRadius: 10,
      lineWidth: 5,
      fontWeight: 'normal',
      fontStyle: 'normal',
      fontFamily: 'sans-serif',
    },
    options,
  )
