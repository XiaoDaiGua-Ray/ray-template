import { i18n } from '@/locales'
import type { I18n } from 'vue-i18n'

export interface OverrideUseI18nReturnType
  extends Omit<I18n['global'], 't' | 'locale'> {
  t: <T = unknown>(key: string, ...args: T[]) => T
  locale: (lang: string) => void
}

const getI18nKey = (namespace: string | undefined, key: string) => {
  if (!namespace) {
    return key
  }

  if (key[0] === namespace) {
    return key
  }

  return `${namespace}.${key}`
}

export const useI18n = (namespace?: string) => {
  /**
   *
   * 避免 HMR 时 i18n 未初始化导致报错。
   * 但是在开发环境下，i18n 始终会被初始化，所以不会影响其正常使用。
   *
   * 但是，其实这是一种很不友好的做好，并且在顶层做修改的时候，依旧可能会有 HMR 报错；
   * 现在还未找到更好的解决方案，所以只能先这样。
   */
  if (!i18n) {
    return {
      t: (key: string) => {
        return getI18nKey(namespace, key)
      },
      locale: (lang: string) => {},
    } as OverrideUseI18nReturnType
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

  /** 重写 locale 方法 */
  const overrideLocaleFunc = (lang: string) => {
    if (i18n.mode === 'legacy') {
      i18n.global.locale = lang
    } else {
      if (isRef(i18n.global.locale)) {
        i18n.global.locale.value = lang
      } else {
        i18n.global.locale = lang
      }
    }
  }

  return {
    ...methods,
    t: overridesTFunc,
    locale: overrideLocaleFunc,
  }
}

/**
 *
 * @description
 * 该方法为纯函数，无任何副作用，单纯为了配合 i18n-ally 插件使用。
 * 该插件识别 t 方法包裹 path 进行提示文案内容。
 *
 * 不过在使用的时候必须按照示例导入，避免 vitest 抛出奇奇怪怪的错误。
 * @example
 * import { t } from '@/hooks/web/useI18n'
 */
export const t = (key: string) => key

export type UseI18nReturnType = OverrideUseI18nReturnType
