import { getDefaultLocal } from '@/language/index'
import { setCache } from '@use-utils/cache'

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
      spinSwitch: false, // 全屏加载
      breadcrumbSwitch: true, // 面包屑开关
      localeLanguage: getDefaultLocal(),
    })
    const { locale } = useI18n()

    const updateLocale = (key: string) => {
      // TODO: 修改语言
      locale.value = key
      settingState.localeLanguage = key

      setCache('localeLanguage', key, 'localStorage')
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
     * @remark 不知道如何写: 返回属性中所有指定类型值... 如果有知道的一定要私信告知一下
     */
    const changeSwitcher = (bool: boolean, key: keyof typeof settingState) => {
      if (
        Object.hasOwn(settingState, key) &&
        typeof settingState[key] === 'boolean'
      ) {
        ;(settingState[key] as unknown) = bool
      }
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
