import { mergeMessage } from '@/locales/helper'

const modules = import.meta.glob('./en-US/**/*.json', {
  eager: true,
})

export default {
  message: {
    ...mergeMessage(modules, 'en-US'),
  },
}
