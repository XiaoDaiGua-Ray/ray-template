import { setCache } from '@/utils/cache'

export const useSetting = defineStore('setting', () => {
  const settingState = reactive({})

  const updateLocale = (key: string) => {
    // TODO: 修改语言
    setCache('localeLanguage', key, 'localStorage')
  }

  return {
    settingState,
    updateLocale,
  }
})
