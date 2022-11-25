export const useSetting = defineStore(
  'setting',
  () => {
    const settingState = reactive({
      drawerPlacement: 'right' as NaiveDrawerPlacement,
      primaryColorOverride: {
        common: {
          primaryColor: '#18A058', // 主题色
        },
      },
      themeValue: false, // `true` 为黑夜主题, `false` 为白色主题
      reloadRouteLog: true, // 刷新路由开关
      menuTagLog: true, // 多标签页开关
    })
    const { locale } = useI18n()

    const updateLocale = (key: string) => {
      // TODO: 修改语言
      locale.value = key
    }

    const changePrimaryColor = (value: string) => {
      settingState.primaryColorOverride.common.primaryColor = value
    }

    const changeSwitcher = (bool: boolean, key: keyof typeof settingState) => {
      ;(settingState[key] as unknown) = bool
    }

    return {
      ...toRefs(settingState),
      updateLocale,
      changePrimaryColor,
      changeSwitcher,
    }
  },
  {
    persist: {
      key: 'piniaSettingStore',
    },
  },
)
