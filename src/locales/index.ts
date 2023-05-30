/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2022-12-08
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

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
 *   - 因使用 `i18n` 提供虚拟文件注入缘故, 每次修改 `locales` 中的文件后, 需要重启项目
 *   - 建议按照主流约定语言包命名
 */

import { createI18n } from 'vue-i18n'
import { LOCAL_OPTIONS } from '@/appConfig/localConfig'
import { getDefaultLocal } from '@/locales/helper'

import { getAppLocales } from '@/locales/helper'

import type { App } from 'vue'
import type { I18n } from 'vue-i18n'

/** i18n 实例 */
export let i18n: I18n

/** 创建 i18n 实例 */
const createI18nOptions = async () => {
  const locale = getDefaultLocal()
  const message = await getAppLocales(LOCAL_OPTIONS)

  const i18nInstance = createI18n({
    legacy: false,
    locale,
    messages: message,
    sync: true,
    missingWarn: false,
    silentFallbackWarn: true,
  })

  return i18nInstance
}

/** 注册 i18n */
export const setupI18n = async (app: App<Element>) => {
  const i18nInstance = await createI18nOptions()

  i18n = i18nInstance

  app.use(i18nInstance)
}
