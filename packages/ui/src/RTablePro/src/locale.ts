import { useUiServices } from '../../services'
import en from './en-US.json'
import zh from './zh-CN.json'

const labelsByLocale = {
  zh: { ...zh, fullscreen: '全屏', exitFullscreen: '退出全屏' },
  en: { ...en, fullscreen: 'Full screen', exitFullscreen: 'Exit full screen' },
}

export function useTableLocale() {
  const { translate, locale } = useUiServices()

  return {
    t: (key: string, params: Record<string, unknown> = {}) => {
      const translationKey =
        key === 'fullscreen' || key === 'exitFullscreen'
          ? `headerTooltip.${key === 'fullscreen' ? 'FullScreen' : 'CancelFullScreen'}`
          : `table.${key}`
      const translated = translate?.(translationKey, params)

      if (translated != null && translated !== translationKey) return translated

      const labels =
        locale?.() === 'zh-CN' ? labelsByLocale.zh : labelsByLocale.en
      const label = labels[key as keyof typeof labels] ?? key

      return label.replace(/\{(\w+)\}/g, (token, name: string) =>
        String(params[name] ?? token),
      )
    },
  }
}
