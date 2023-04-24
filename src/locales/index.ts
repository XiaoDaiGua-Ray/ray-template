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
import { localOptions } from './language'

import { getCache } from '@use-utils/cache'

export { naiveLocales, localOptions } from './language'

import type { App } from 'vue'
import type { I18n } from 'vue-i18n'

export let i18n: I18n

/**
 *
 * @returns 获取当前环境默认语言
 *
 * @remak 未避免出现加载语言错误问题, 故而在 `main.ts` 注册时, 应优先加载 `i18n` 避免出现该问题
 */
export const getDefaultLocal = () => {
  const catchLanguage = getCache('localeLanguage', 'localStorage')

  const locale: string = catchLanguage !== 'no' ? catchLanguage : 'zh-CN'

  return locale
}

/** 获取所有语言 */
const getAppLocales = async () => {
  const message = {}

  for (const curr of localOptions) {
    const msg = await import(`./lang/${curr.key}.ts`)

    message[curr.key] = msg.default?.message ?? {}
  }

  return message
}

/** 创建 i18n 实例 */
const createI18nOptions = async () => {
  const locale = getDefaultLocal()
  const message = await getAppLocales()

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
