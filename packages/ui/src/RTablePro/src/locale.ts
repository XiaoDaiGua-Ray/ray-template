import { useUiServices } from '../../services'
import en from './en-US.json'
import zh from './zh-CN.json'

export function useTableLocale() {
  const { translate, locale } = useUiServices()

  return {
    t: (key: string, params: Record<string, unknown> = {}) => {
      const chinese = locale?.() === 'zh-CN'
      const labels = chinese
        ? { ...zh, fullscreen: '全屏', exitFullscreen: '退出全屏' }
        : {
            ...en,
            fullscreen: 'Full screen',
            exitFullscreen: 'Exit full screen',
          }

      if (key === 'fullscreen' || key === 'exitFullscreen') {
        return (
          translate?.(
            `headerTooltip.${key === 'fullscreen' ? 'FullScreen' : 'CancelFullScreen'}`,
          ) ?? labels[key]
        )
      }

      const label = labels[key as keyof typeof labels] ?? key

      return (
        translate?.(`table.${key}`, params) ??
        label.replace(/\{(\w+)\}/g, (token, name: string) =>
          String(params[name] ?? token),
        )
      )
    },
  }
}
