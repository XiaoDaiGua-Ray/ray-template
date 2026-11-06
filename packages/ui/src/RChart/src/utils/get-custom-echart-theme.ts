import type { ChartThemeRawArray } from '../types'

/**
 *
 * @description
 * 读取随包构建的主题 JSON，以不含扩展名的文件名作为 ECharts 注册名。
 *
 * @returns 可直接注册的主题名称与配置；明暗变体保留各自注册名。
 * @throws 不同目录中的主题文件同名时抛错，避免注册结果受遍历顺序影响。
 */
export const getCustomEchartTheme = (): ChartThemeRawArray[] => {
  const modules = import.meta.glob<ChartThemeRawArray['theme']>(
    '../themes/**/*.json',
    { eager: true, import: 'default' },
  )
  const names = new Set<string>()

  return Object.entries(modules).map(([path, theme]) => {
    const name = path.slice(path.lastIndexOf('/') + 1, -'.json'.length)

    if (names.has(name)) throw new Error(`[RChart] 重复的主题名：${name}`)

    names.add(name)

    return { name, theme }
  })
}
