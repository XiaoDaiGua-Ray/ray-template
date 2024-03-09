import { combineI18nMessages } from '@/locales/utils'

import type { I18nModules } from '@/locales/types'

const modules: I18nModules = import.meta.glob('./en-US/**/*.json', {
  eager: true,
})

export default {
  message: {
    ...combineI18nMessages(modules, 'en-US'),
  },
}
