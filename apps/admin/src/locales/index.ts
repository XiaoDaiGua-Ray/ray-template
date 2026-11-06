import { LOCAL_OPTIONS, SYSTEM_FALLBACK_LOCALE } from '@/app-config'
import { getAppDefaultLanguage, getAppLocalMessages } from '@/locales/utils'
import type { App } from 'vue'
import { createI18n } from 'vue-i18n'
import type { I18n, I18nOptions } from 'vue-i18n'

/** 已安装的国际化实例；热更新期间保留同一个实例。 */
export let i18n: I18n | undefined = import.meta.hot?.data.i18n as
  I18n | undefined

if (import.meta.hot) {
  import.meta.hot.dispose((data) => {
    // 组件热更新不会重新安装 Vue 插件，保留语言和消息的原有引用。
    data.i18n = i18n
  })
}

/**
 *
 * @description
 * 加载本地语言包，并按缓存语言创建国际化实例。
 *
 * @returns 尚未安装到应用的国际化实例
 */
const createI18nOptions = async () => {
  const locale = getAppDefaultLanguage()
  const messages = await getAppLocalMessages(LOCAL_OPTIONS)

  const i18nInstance = createI18n({
    legacy: false,
    locale,
    messages: messages as unknown as I18nOptions['messages'],
    sync: true,
    silentFallbackWarn: true,
    fallbackLocale: SYSTEM_FALLBACK_LOCALE,
  })

  return i18nInstance
}

/**
 *
 * @param app 需要注册国际化插件的 Vue 应用
 *
 * @description
 * 安装国际化插件，并更新共享的国际化实例。
 */
export const setupI18n = async (app: App<Element>) => {
  const i18nInstance = await createI18nOptions()

  app.use(i18nInstance)

  i18n = i18nInstance
  document.documentElement.lang = i18nInstance.global.locale.value
}
