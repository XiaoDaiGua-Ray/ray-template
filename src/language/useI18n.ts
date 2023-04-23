import { i18n } from './index'

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
  const normalFunc = {
    t: (key: string) => {
      return getI18nKey(namespace, key)
    },
  }

  if (!i18n) {
    return normalFunc
  }

  const { t, ...methods } = i18n.global

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

  return {
    ...methods,
    t: overridesTFunc,
  }
}

/** 配合 i18n ally 插件提示使用 */
export const t = (key: string) => key
