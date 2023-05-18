import { i18n } from './index'

import type { WritableComputedRef } from 'vue'

const getI18nKey = (namespace: string | undefined, key: string) => {
  if (!namespace) {
    return key
  }

  if (key.startsWith(namespace)) {
    return key
  }

  return `${namespace}.${key}`
}

export const useI18n = (namespace?: string) => {
  const { t, locale, ...methods } = i18n.global

  const overridesTFunc = (key: string, ...args: any[]) => {
    if (!key) {
      return ''
    }

    if (!key.includes('.') && !namespace) {
      return key
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (t as any)(getI18nKey(namespace, key), ...args)
  }

  const overrideLocaleFunc = (lang: string) => {
    const localeRef = locale as WritableComputedRef<string>

    localeRef.value = lang
  }

  return {
    ...methods,
    t: overridesTFunc,
    locale: overrideLocaleFunc,
  }
}
