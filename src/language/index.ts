import { createI18n } from 'vue-i18n'
import type { App } from 'vue'
import { useGetCache } from '@use-utils/cache'

export const setupI18n = (app: App<Element>) => {
  const i18n = createI18n({
    locale:
      useGetCache('languageType') !== 'no' ? useGetCache('languageType') : 'zh',
    allowComposition: true, // you need to specify that!
    messages: {}, // 语言包
  })

  app.use(i18n)
}
