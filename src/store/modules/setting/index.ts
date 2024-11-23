import { getAppDefaultLanguage } from '@/locales/utils'
import { colorToRgba, setStorage, updateObjectValue, setStyle } from '@/utils'
import { useI18n, useDayjs } from '@/hooks'
import { APP_CATCH_KEY, APP_THEME, GLOBAL_CLASS_NAMES } from '@/app-config'
import { getDefaultSettingConfig } from './constant'

import type { SettingState } from '@/store/modules/setting/types'
import type { LocalKey } from '@/hooks'
import type { AnyFC } from '@/types'

export const piniaSettingStore = defineStore(
  'setting',
  () => {
    const {
      appPrimaryColor: { primaryColor },
    } = __APP_CFG__ // 默认主题色
    const { locale } = useI18n()
    const { locale: dayjsLocal } = useDayjs()

    const settingState = reactive<SettingState>({
      // 默认主题色
      primaryColorOverride: {
        common: {
          primaryColor: primaryColor,
          primaryColorHover: primaryColor,
          primaryColorPressed: primaryColor,
        },
      },
      // 内部使用，用于判断是否为黑夜主题（为了兼容历史遗留版本）；true 为黑夜主题，false 为明亮主题
      _appTheme: false,
      // 当前主题样式
      appTheme: 'light',
      // 默认国际化语言
      localeLanguage: getAppDefaultLanguage(),
      // 锁屏开关
      lockScreenSwitch: false,
      // 根路由信息
      appRootRoute: {
        name: 'Dashboard',
        path: '/dashboard',
      },
      // 侧边栏设置
      sideBarLogo: {
        icon: 'ray',
        title: 'Ray Template',
        url: '/dashboard',
        jumpType: 'station',
      },
      ...getDefaultSettingConfig(),
    })

    // 修改当前语言
    const updateLocale = (key: string) => {
      locale(key)
      dayjsLocal(key as LocalKey)
      setStorage(APP_CATCH_KEY.localeLanguage, key, 'localStorage')

      settingState.localeLanguage = key
    }

    /**
     *
     * @description
     * 切换主题色，传递对应颜色即可更新 naive-ui 的主题色。
     */
    const changePrimaryColor = (value: string, alpha = 0.3) => {
      const alphaColor = colorToRgba(value, alpha)
      const themeOverrides = {
        primaryColor: value,
        primaryColorHover: value,
        primaryColorPressed: value,
      }
      const { rayTemplateThemePrimaryColor, rayTemplateThemePrimaryFadeColor } =
        GLOBAL_CLASS_NAMES
      const html = document.documentElement

      settingState.primaryColorOverride.common = themeOverrides

      // 设置主题色变量
      html.style.setProperty(rayTemplateThemePrimaryColor, value)
      // 设置主题色辅助色变量
      html.style.setProperty(rayTemplateThemePrimaryFadeColor, alphaColor)
    }

    /**
     *
     * @param key settingState 的 key
     * @param value settingState 的 value
     * @param cb 回调函数
     *
     * @description
     * 更新 settingState 的值，如果 key 不存在与 settingState 中，则不会更新。
     *
     * @example
     * updateSettingState('drawerPlacement', 'left')
     * updateSettingState('appTheme', true)
     */
    const updateSettingState = <
      T extends keyof SettingState,
      V extends typeof settingState,
      C extends AnyFC,
    >(
      key: T,
      value: Partial<V[T]>,
      cb?: C,
    ) => {
      updateObjectValue(settingState, key, value as V[T], cb)
    }

    const toggleColorWeakness = (bool: boolean) => {
      const html = document.documentElement

      updateSettingState('colorWeakness', bool)
      setStyle(html, {
        filter: bool ? 'invert(100%)' : '',
      })
    }

    /**
     *
     * @description
     * 初始化合并自定义主题色。
     * 该方法会在初始化时执行一次，之后会在切换主题色时执行。
     */
    watchEffect(() => {
      settingState.appTheme
        ? (settingState.primaryColorOverride = Object.assign(
            {},
            settingState.primaryColorOverride,
            APP_THEME.appNaiveUIThemeOverrides.dark,
            APP_THEME.appNaiveUIThemeOverridesCommon.dark,
          ))
        : (settingState.primaryColorOverride = Object.assign(
            {},
            settingState.primaryColorOverride,
            APP_THEME.appNaiveUIThemeOverrides.light,
            APP_THEME.appNaiveUIThemeOverridesCommon.light,
          ))

      toggleColorWeakness(settingState.colorWeakness)

      if (!settingState.dynamicDocumentTitle) {
        document.title = settingState.sideBarLogo?.title || 'Ray Template'
      }
    })

    return {
      ...toRefs(settingState),
      updateLocale,
      changePrimaryColor,
      updateSettingState,
      toggleColorWeakness,
    }
  },
  {
    persist: {
      key: APP_CATCH_KEY.appPiniaSettingStore,
      omit: ['lockScreenSwitch'],
      storage: window.localStorage,
    },
  },
)
