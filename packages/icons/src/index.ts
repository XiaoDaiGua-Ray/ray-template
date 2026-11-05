import { iconNames, isIconName } from './manifest'
import type { IconName } from './manifest'

export { iconNames, iconPackages, isIconName } from './manifest'
export type { IconName, IconPackage } from './manifest'

const retiredIcons = new Map<string, IconName>([
  ['action/export_excel', 'action/download'],
  ['logo/office', 'navigation/table'],
  ['illustration/login_bg', 'navigation/other'],
])

export const replaceRetiredIconName = (value: string): string =>
  retiredIcons.get(value) ?? value

// 仅用于读取旧版缓存。存在多个同名图标时不猜测所属分包。
export function resolveIconName(value: unknown): IconName | undefined {
  if (typeof value !== 'string') return

  const name = replaceRetiredIconName(value)

  if (isIconName(name)) return name

  if (name.includes('/')) return

  const matches = iconNames.filter((icon) => icon.endsWith(`/${name}`))

  if (matches.length === 1) return matches[0]

  if (matches.length > 1) return

  return [...retiredIcons].find(([icon]) => icon.endsWith(`/${name}`))?.[1]
}
