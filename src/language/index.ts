import { createI18n } from 'vue-i18n'
import messages from '@intlify/unplugin-vue-i18n/messages' // 导入所有语言包

import { getCache } from '@use-utils/cache'

import type { App } from 'vue'

export const setupI18n = (app: App<Element>) => {
  const _locales: string =
    getCache('localeLanguage', 'localStorage') !== 'no'
      ? getCache('localeLanguage', 'localStorage')
      : 'zh-CN'

  const i18n = createI18n({
    locale: _locales,
    allowComposition: true,
    messages,
  })

  app.use(i18n)
}

export const useLanguageOptions = () => [
  {
    key: 'zh-CN',
    label: '中文(简体)',
  },
  {
    key: 'en-US',
    label: 'English(US)',
  },
]

/**
 *
 * 注册 `vue-i18n`
 * 注意: 每次修改 `locales` 中的文件后, 需要重启项目
 * 预设 `localeLanguage` 作为缓存 `key`
 * 预设中文作为基础语言
 */
