import { i18n } from '@/locales'
import type { I18n } from 'vue-i18n'

export interface OverrideUseI18nReturnType extends Partial<
  Omit<I18n['global'], 't' | 'locale'>
> {
  t: <T extends string = string>(key: string, ...args: unknown[]) => T
  locale: (lang: string) => void
}

const getI18nKey = (namespace: string | undefined, key: string) => {
  if (!namespace) {
    return key
  }

  if (key === namespace || key.startsWith(`${namespace}.`)) {
    return key
  }

  return `${namespace}.${key}`
}

/**
 *
 * @param namespace 翻译键的可选命名空间
 *
 * @description
 * 翻译和切换语言时读取最新的国际化实例；初始化前翻译返回解析后的键。
 *
 * @returns 始终可用的翻译、语言设置方法，以及初始化后的原生能力。
 */
export const useI18n = (namespace?: string): OverrideUseI18nReturnType => {
  const translate = <T extends string = string>(
    key: string,
    ...args: unknown[]
  ): T => {
    if (!key) return '' as T

    if (!key.includes('.') && !namespace) return key as T

    const fullKey = getI18nKey(namespace, key)
    const instance = i18n

    if (!instance) return fullKey as T

    const nativeTranslate = instance.global.t as (
      key: string,
      ...args: unknown[]
    ) => unknown

    return nativeTranslate(fullKey, ...args) as T
  }

  const locale = (lang: string) => {
    const instance = i18n

    if (!instance) return

    if (instance.mode === 'legacy') {
      instance.global.locale = lang
    } else if (isRef(instance.global.locale)) {
      instance.global.locale.value = lang
    } else {
      instance.global.locale = lang
    }

    document.documentElement.lang = lang
  }

  // 初始化前创建的 Hook 也在调用时读取实例，避免永久停留在回退函数上。
  if (!i18n) return { t: translate, locale }

  return { ...i18n.global, t: translate, locale }
}

/**
 *
 * @param key 需要供 i18n-ally 识别的翻译键
 *
 * @description
 * 原样返回翻译键，不执行翻译，也不读取国际化实例。
 *
 * @returns 原始翻译键
 */
export const t = (key: string) => key

export type UseI18nReturnType = OverrideUseI18nReturnType
