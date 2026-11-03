import type {
  ChartThemeRawArray,
  ChartThemeRawModules,
} from '@/components/RChart/src/types'

/**
 *
 * @see https://echarts.apache.org/zh/theme-builder.html
 *
 * @description
 * 自动注册所有主题。
 *
 * 默认以文件名当作主题名称。
 *
 * 主题编辑器使用方法:
 * 1. 配置、选择主题
 * 2. 点击下载主题
 * 3. 选择 json 类型，然后复制
 * 4. 在 echart-themes 包中创建对应的 json 文件，文件名为主题名称
 */
export const getCustomEchartTheme = () => {
  // 获取所有主题
  const themeRawModules: Record<string, ChartThemeRawModules> =
    import.meta.glob('@/app-config/echart-themes/**/*.json', {
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
