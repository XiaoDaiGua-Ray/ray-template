import { mergeMessage } from '@/locales/helper'

const modules = import.meta.glob('./zh-CN/**/*.json', {
  eager: true,
})

export default {
  message: {
    ...mergeMessage(modules, 'zh-CN'),
  },
}
