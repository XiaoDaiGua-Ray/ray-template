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
} from '@/components/RChart/type'

/**
 *
 * 自动注册所有主题
 *
 * 默认以文件名当作主题名称
 *
 * 主题配置器：https://echarts.apache.org/zh/theme-builder.html
 * 流程：
 * 1. 配置、选择主题
 * 2. 点击下载主题
 * 3. 选择 json 类型，然后复制
 * 4. 在 @/components/RayChart/theme 包中创建对应的 json 文件，文件名为主题名称
 */
export const setupChartTheme = () => {
  // 获取所有主题
  const themeRawModules: Record<string, ChartThemeRawModules> =
    import.meta.glob('@/components/RayChart/theme/**/*.json', {
      eager: true,
    })
  const regx = /\/([^/]+)\.json$/

  const rawThemes = Object.keys(themeRawModules).reduce((pre, curr) => {
    const name = curr.match(regx)?.[1]

    if (name) {
      pre.push({
        name,
        theme: themeRawModules[curr].default,
      })

      return pre
    } else {
      throw new Error('theme name is not found')
    }
  }, [] as ChartThemeRawArray[])

  return rawThemes
}

/**
 *
 * @returns LoadingOptions
 *
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
