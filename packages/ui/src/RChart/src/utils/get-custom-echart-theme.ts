import type { ChartThemeRawArray } from '../types'

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
