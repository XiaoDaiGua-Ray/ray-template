import type { I18nModules } from '@/locales/types'
import { combineI18nMessages } from '@/locales/utils/combine-i18n-messages'
import table from '@ray-template/ui/table-pro/messages/zh-CN'

const modules: I18nModules = import.meta.glob('./zh-CN/**/*.json', {
  eager: true,
})

export default {
  message: {
    table,
    ...combineI18nMessages(modules, 'zh-CN'),
  },
}
