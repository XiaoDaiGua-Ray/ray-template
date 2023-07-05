import { combineI18nMessages } from '@/locales/helper'

import type { I18nModules } from '@/locales/type'

const modules: I18nModules = import.meta.glob('./en-US/**/*.json', {
  eager: true,
})

export default {
  message: {
    ...combineI18nMessages(modules, 'en-US'),
  },
}
