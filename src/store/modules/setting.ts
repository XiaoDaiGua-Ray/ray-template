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

    const changeTheme = (bool: boolean) => {
      settingState.themeValue = bool
    }

    const changePrimaryColor = (value: string) => {
      settingState.primaryColorOverride.common.primaryColor = value
    }

    /**
     *
     * @param bool 刷新页面开关
     */
    const changeReloadLog = (bool: boolean) =>
      (settingState.reloadRouteLog = bool)

    /**
     *
     * @param bool 刷新页面开关
     */
    const changeMenuTagLog = (bool: boolean) => (settingState.menuTagLog = bool)

    return {
      ...toRefs(settingState),
      updateLocale,
      changeTheme,
      changePrimaryColor,
      changeReloadLog,
      changeMenuTagLog,
    }
  },
  {
    persist: {
      key: 'piniaSettingStore',
    },
  },
)
