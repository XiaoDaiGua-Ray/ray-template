import { createI18n } from 'vue-i18n'
import messages from '@intlify/unplugin-vue-i18n/messages'

import { useGetCache } from '@use-utils/cache'

import type { App } from 'vue'

export const setupI18n = (app: App<Element>) => {
  const i18n = createI18n({
    locale:
      useGetCache('languageType') !== 'no'
        ? useGetCache('languageType')
        : 'zh-CN',
    allowComposition: true, // you need to specify that!
    messages,
  })

  app.use(i18n)
}
