import { APP_CATCH_KEY, APP_THEME, GLOBAL_CLASS_NAMES } from '@/app-config'
import { useDayjs, useI18n } from '@/hooks'
import type { LocalKey } from '@/hooks'
import { getAppDefaultLanguage } from '@/locales/utils'
import type { SettingState } from '@/store/modules/setting/types'
import type { AnyFn } from '@/types'
import { colorToRgba, setStorage, setStyle, updateObjectValue } from '@/utils'
import { cloneDeep, merge } from 'lodash-es'
import { getDefaultSettingConfig } from './constant'

export const piniaSettingStore = defineStore(
  'setting',
  () => {
    const {
      appPrimaryColor: { primaryColor, primaryFadeColor },
    } = APP_THEME
    const { locale } = useI18n()
    const { locale: dayjsLocal } = useDayjs()

    const settingState = reactive<SettingState>({
      // 默认主题色
      primaryColorOverride: {
        common: {
          primaryColor: primaryColor,
          primaryColorHover: primaryFadeColor,
          primaryColorPressed: primaryColor,
          primaryColorSuppl: primaryFadeColor,
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
      ...cloneDeep(getDefaultSettingConfig()),
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
    const changePrimaryColor = (value: string, alpha = 0.85) => {
      const alphaColor1 = colorToRgba(value, alpha)
      const themeOverrides = {
        primaryColor: value,
        primaryColorHover: alphaColor1,
        primaryColorPressed: value,
        primaryColorSuppl: alphaColor1,
      }
      const { rayTemplateThemePrimaryColor, rayTemplateThemePrimaryFadeColor } =
        GLOBAL_CLASS_NAMES
      const html = document.documentElement

      settingState.primaryColorOverride.common = themeOverrides

      // 设置主题色变量
      html.style.setProperty(rayTemplateThemePrimaryColor, value)
      // 设置主题色辅助色变量
      html.style.setProperty(rayTemplateThemePrimaryFadeColor, alphaColor1)
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
      C extends AnyFn,
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
      settingState._appTheme
        ? (settingState.primaryColorOverride = merge(
            {},
            settingState.primaryColorOverride,
            APP_THEME.appNaiveUIThemeOverrides.dark,
          ))
        : (settingState.primaryColorOverride = merge(
            {},
            settingState.primaryColorOverride,
            APP_THEME.appNaiveUIThemeOverrides.light,
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
