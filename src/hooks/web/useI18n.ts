/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-09-11
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import { i18n } from '@/locales'

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

  /** 重写 locale 方法 */
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

/**
 *
 * 该方法为纯函数, 无任何副作用
 * 单纯为了配合 i18n-ally 插件使用
 *
 * 该插件识别 t 方法包裹 path 进行提示文案内容
 */
export const t = (key: string) => key

export type UseI18nReturnType = ReturnType<typeof useI18n>
