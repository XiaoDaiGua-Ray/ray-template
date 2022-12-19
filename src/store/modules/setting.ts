import { useNaiveLocal, useDefaultNaiveLocal } from '@/language/index'

export const useSetting = defineStore(
  'setting',
  () => {
    const settingState = reactive({
      drawerPlacement: 'right' as NaiveDrawerPlacement,
      primaryColorOverride: {
        common: {
          primaryColor: '#2d8cf0', // 主题色
        },
      },
      themeValue: false, // `true` 为黑夜主题, `false` 为白色主题
      reloadRouteSwitch: true, // 刷新路由开关
      menuTagSwitch: true, // 多标签页开关
      naiveLocal: useDefaultNaiveLocal(), // `naive ui` 语言包
    })
    const { locale } = useI18n()

    const updateLocale = (key: string) => {
      // TODO: 修改语言
      locale.value = key
      settingState.naiveLocal = useNaiveLocal(key)
    }

    const changePrimaryColor = (value: string) => {
      settingState.primaryColorOverride.common.primaryColor = value
    }

    /**
     *
     * @param bool 开关当前值
     * @param key `settingState` 对应开关属性值
     *
     * @remark 仅适用于值为 `boolean` 的切换
     */
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
