import type { I18nModules } from '@/locales/types'
import { combineI18nMessages } from '@/locales/utils'

const modules: I18nModules = import.meta.glob('./zh-CN/**/*.json', {
  eager: true,
})

export default {
  message: {
    ...combineI18nMessages(modules, 'zh-CN'),
  },
}
