import { OperatingSystem } from '../types'

/**
 *
 * @description
 * 按 User-Agent 识别常见操作系统，并识别使用桌面标识的 iPad。
 *
 * @returns 无法识别或没有浏览器时返回 Unknown。
 */
export const detectOperatingSystem = () => {
  const agent = globalThis.navigator?.userAgent ?? ''

  if (
    /iphone|ipad|ipod/i.test(agent) ||
    (/macintosh/i.test(agent) && navigator.maxTouchPoints > 1)
  ) {
    return OperatingSystem.IOS
  }

  if (/android/i.test(agent)) return OperatingSystem.Android

  if (/windows/i.test(agent)) return OperatingSystem.Windows

  if (/macintosh|mac os x/i.test(agent)) return OperatingSystem.MacOS

  if (/linux/i.test(agent)) return OperatingSystem.Linux

  return OperatingSystem.Unknown
}
