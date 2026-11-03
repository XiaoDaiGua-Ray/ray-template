import { iconNames, isIconName } from './manifest'
import type { IconName } from './manifest'

export { iconNames, iconPackages, isIconName } from './manifest'
export type { IconName, IconPackage } from './manifest'

// 仅用于读取旧版缓存。存在多个同名图标时不猜测所属分包。
export function resolveIconName(value: unknown): IconName | undefined {
  if (isIconName(value)) return value

  if (typeof value !== 'string' || value.includes('/')) return

  const matches = iconNames.filter((name) => name.endsWith(`/${value}`))

  return matches.length === 1 ? matches[0] : void 0
}
