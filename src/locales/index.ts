/**
 *
 * 注册 `vue-i18n`
 *
 * 预设 `localeLanguage` 作为缓存 `key`
 *
 * 预设中文作为基础语言
 *
 * `naive ui` 语言包切换
 *
 * 注意:
 *   - 建议按照主流约定语言包命名
 */

import { LOCAL_OPTIONS, SYSTEM_FALLBACK_LOCALE } from '@/app-config'
import { getAppDefaultLanguage, getAppLocalMessages } from '@/locales/utils'
import type { App } from 'vue'
import { createI18n } from 'vue-i18n'
import type { I18n, I18nOptions } from 'vue-i18n'

/** i18n 实例 */
export let i18n: I18n

/**
 *
 * 获取所有语言包，创建 i18n 实例
 */
const createI18nOptions = async () => {
  const locale = getAppDefaultLanguage()
  const messages = await getAppLocalMessages(LOCAL_OPTIONS)

  const i18nInstance = createI18n({
    legacy: false,
    locale,
    messages: messages as unknown as I18nOptions['messages'],
    sync: true,
    missingWarn: false,
    silentFallbackWarn: true,
    fallbackLocale: SYSTEM_FALLBACK_LOCALE,
  })

  return i18nInstance
}

/**
 *
 * @param app vue app instance
 *
 * 注册 i18n，并且缓存实例
 */
export const setupI18n = async (app: App<Element>) => {
  const i18nInstance = await createI18nOptions()

  app.use(i18nInstance)

  i18n = i18nInstance
}
