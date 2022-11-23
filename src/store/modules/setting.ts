import { setCache, getCache } from '@/utils/cache'

export const useSetting = defineStore('setting', () => {
  const cachePrimaryColor: string =
    getCache('primaryColor', 'localStorage') === 'no'
      ? '#18A058'
      : getCache('primaryColor', 'localStorage')
  const cacheTheme =
    getCache('theme', 'localStorage') === 'no'
      ? false
      : getCache('theme', 'localStorage')

  const settingState = reactive({
    drawerPlacement: 'right' as NaiveDrawerPlacement,
    primaryColorOverride: {
      common: {
        primaryColor: cachePrimaryColor, // 主题色
      },
    },
    themeValue: cacheTheme, // `true` 为黑夜主题, `false` 为白色主题
  })
  const { locale } = useI18n()

  const updateLocale = (key: string) => {
    // TODO: 修改语言
    locale.value = key

    setCache('localeLanguage', key, 'localStorage')
  }

  const changeTheme = (bool: boolean) => {
    settingState.themeValue = bool

    setCache('theme', bool, 'localStorage')
  }

  const changePrimaryColor = (value: string) => {
    settingState.primaryColorOverride.common.primaryColor = value

    setCache('primaryColor', value, 'localStorage')
  }

  return {
    ...toRefs(settingState),
    updateLocale,
    changeTheme,
    changePrimaryColor,
  }
})
